'use strict'

const Parse = require('parse/node').Parse;
const nhClientFactory = require('./NHClient');
const classifyInstallations = require('./classifyInstallations');
const nhConfig = require('./NHConfig');
const chunkArray = require('./chunkArray');
const providerMap = {
  android: require('./GCM'),
  ios: require('./APNS'),
  winrt: require('./WNS')
}

module.exports = function AzurePushAdapter(pushConfig) {
  pushConfig = pushConfig || {};
  let nhClient = pushConfig.NHClient || nhClientFactory(nhConfig.get(pushConfig));

  let api = {
    getValidPushTypes: () => ['ios', 'android', 'winrt'],
    send: (data, installations) => {
      let deviceMap = classifyInstallations(installations, api.getValidPushTypes());
      let sendPromises = [];
      for (let pushType in deviceMap) {
        let devices = deviceMap[pushType];
        if (!devices.length)
          continue;
        let sender = providerMap[pushType];
        if (!sender) {
          console.log('Can not find sender for push type %s, %j', pushType, data);
          continue;
        }
        let headers = sender.generateHeaders(data);
        let payload = sender.generatePayload(data);
        // sender specific chunks necessary until NH fixes 4kb req size limit
        let chunk = chunkArray(sender.chunkSize);
        console.log('Sending notification "' + payload + '" to ' + devices.length + ' ' + pushType + ' devices');

        sendPromises.push(Parse.Promise.when(
          chunk(devices).map(chunkOfDevices => { 
            return nhClient.bulkSend(chunkOfDevices, headers, payload); 
          })
        ));
      }
      return Parse.Promise.when(sendPromises);
    }
  }
  return api;
}
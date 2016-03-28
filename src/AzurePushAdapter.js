'use strict'

const Parse = require('parse/node').Parse;
const nhClientFactory = require('./NHClient');
const classifyInstallations = require('./classifyInstallations');
const nhConfig = require('./NHConfig');
const providerMap = {
  android: require('./GCM'),
  ios: require('./APNS')
}

module.exports = function AzurePushAdapter(pushConfig) {
  let nhClient = pushConfig.NHClient || nhClientFactory(nhConfig.get(pushConfig || {}));

  let api = {
    getValidPushTypes: () => ['ios', 'android'],
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
        let sendPromise = nhClient[pushConfig.sendType || 'bulkSend'](devices, headers, payload);
        sendPromises.push(sendPromise);
      }
      return Parse.Promise.when(sendPromises);
    }
  }
  return api;
}
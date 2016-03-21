'use strict'

const Parse = require('parse/node').Parse;
const generateObjectId = require('./generateObjectId');

const GCMTimeToLiveMax = 4 * 7 * 24 * 60 * 60; // GCM allows a max of 4 weeks

module.exports = {
  generatePayload: parseData => {
    let coreData = parseData.data;
    let expirationTime = parseData.expiration_time;
    let pushId = generateObjectId();
    let timeStamp = Date.now();
    let payloadData =  {
      'time': new Date(timeStamp).toISOString(),
      'push_id': pushId,
      'data': JSON.stringify(coreData)
    }
    let payload = {
      priority: 'normal',
      data: payloadData
    };
    if (expirationTime) {
     // The timeStamp and expiration is in milliseconds but gcm requires second
      let timeToLive = Math.floor((expirationTime - timeStamp) / 1000);
      if (timeToLive < 0) {
        timeToLive = 0;
      }
      if (timeToLive >= GCMTimeToLiveMax) {
        timeToLive = GCMTimeToLiveMax;
      }
      payload.timeToLive = timeToLive;
    }
    return payload;
  },
  generateHeaders: parseData => ({ 'ServiceBusNotification-Format': 'gcm' })
}
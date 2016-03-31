'use strict'

const generateObjectId = require('./generateObjectId');

const GCMTimeToLiveMax = 4 * 7 * 24 * 60 * 60; // GCM allows a max of 4 weeks

module.exports = {
  generatePayload: (parseData, time) => {
    let coreData = parseData.data;
    let expirationTime = parseData.expiration_time;
    let pushId = generateObjectId();
    let timeStamp = time || Date.now();
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
    return JSON.stringify(payload);
  },
  generateHeaders: parseData => ({ 
    'ServiceBusNotification-Format': 'gcm',
    'Content-Type': 'application/json;charset=utf-8'
  }),
  chunkSize: 200
}
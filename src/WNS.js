'use strict'

const merge = require('deeply');

module.exports = {
  generatePayload: parseData => {
    let wns = parseData.wns || {};
    if (wns.data) {
      return wns.data;
    } else if (parseData.data && parseData.data.alert) {
      return '<toast><visual><binding template="ToastText01"><text id="1">' + parseData.data.alert + '</text></binding></visual></toast>';
    }
  },
  generateHeaders: (parseData, time) => {
    let wns = parseData.wns || {};
    let wnsHeaders = wns.headers || {};
    let wnsType = (wns.type && 'wns/' + wns.type) || wnsHeaders['X-WNS-Type'] || 'wns/toast';
    let headers = {
      'ServiceBusNotification-Format': 'windows',
      'X-WNS-Type': wnsType,
      'Content-Type': wnsType === 'wns/raw' ? 'application/octet-stream' : 'text/xml'
    };
    let expirationTime = parseData.expiration_time;
    if (expirationTime) {
     // The timeStamp and expiration is in milliseconds but wns requires second
      let timeStamp = time || Date.now();
      let timeToLive = Math.floor((expirationTime - timeStamp) / 1000);
      if (timeToLive < 0) {
        timeToLive = 0;
      }
      headers['X-WNS-TTL'] = timeToLive;
    }
    return merge(wnsHeaders || {}, headers);
  },
  chunkSize: 30
}
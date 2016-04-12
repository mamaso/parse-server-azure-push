'use strict'

module.exports = {
  generatePayload: parseData => {
    let coreData = parseData.data;
    let notification = {};
    let payload = {};
    for (let key in coreData) {
      switch (key) {
        case 'alert':
          notification.alert = coreData.alert;
          break;
        case 'badge':
          notification.badge = coreData.badge;
          break;
        case 'sound':
          notification.sound = coreData.sound;
          break;
        case 'content-available':
          notification['content-available'] = coreData['content-available'];
          break;
        case 'category':
          notification.category = coreData.category;
          break;
        default:
          payload[key] = coreData[key];
          break;
      }
    }
    payload.aps = notification;
    return JSON.stringify(payload);
  },
  generateHeaders: parseData => {
    let headers = { 
      'ServiceBusNotification-Format': 'apple',
      'Content-Type': 'application/json;charset=utf-8'
    };
    if (parseData.expiration_time) {
      headers["ServiceBusNotification-Apns-Expiry"] = new Date(parseData.expiration_time).toISOString();
    }
    return headers;
  }
}
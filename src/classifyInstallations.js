'use strict'

/**
   * Classify the device token of installations based on its device type.
   * @param {Object} installations An array of installations
   * @param {Array} validPushTypes An array of valid push types(string)
   * @returns {Object} A map whose key is device type and value is an array of device
   */
module.exports = (installations, validPushTypes) => {
  // Init deviceTokenMap, create a empty array for each valid pushType
  let deviceMap = {};
  for (let validPushType of validPushTypes) {
    deviceMap[validPushType] = [];
  }
  for (let installation of installations) {
    let deviceHandle = installation.deviceToken || installation.channelUris;
    if (!deviceHandle) {
      continue;
    }
    let pushType = installation.deviceType;
    if (deviceMap[pushType]) {
      deviceMap[pushType].push(deviceHandle);
    } else {
      console.log('Unknown push type from installation %j', installation);
    }
  }
  return deviceMap;
}

'use strict'

const crypto = require('crypto');

module.exports = (config, expiration) => {
    const expiry = expiration || Math.floor(Date.now() / 1000 + 3600);
    const resourceUri = config.Endpoint + '/' + config.HubName;
    const stringToSign = encodeURIComponent(resourceUri) + '\n' + expiry;
    const hmac = crypto.createHmac('sha256', config.SharedAccessKey);
    const signature = hmac.update(stringToSign).digest('base64');
    const token = 'SharedAccessSignature sr=' + encodeURIComponent(resourceUri) + '&sig=' + encodeURIComponent(signature) + '&se=' + expiry + '&skn=' + config.SharedAccessKeyName;
    return token;
}
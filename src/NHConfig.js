'use strict'

const nhConnectionString = require('./NHConnectionString');

module.exports = {
    get: (pushConfig) => {
        pushConfig.ConnectionString = pushConfig.ConnectionString || nhConnectionString.get();
        pushConfig.ConnectionString && nhConnectionString.parse(pushConfig.ConnectionString, pushConfig);
        pushConfig.HubName = pushConfig.HubName || process.env['MS_NotificationHubName'] || createFromSiteName(process.env['WEBSITE_SITE_NAME']);

        requiredParam('HubName');
        requiredParam('SharedAccessKeyName');
        requiredParam('SharedAccessKey');
        requiredParam('Endpoint');

        function requiredParam(param) {
            if (!pushConfig[param])
                throw new Error('AzurePushAdapter requires a ' + param);
        }

        function createFromSiteName(siteName) {
            if (siteName) {
                return siteName + '-hub';
            }
        }

        return pushConfig;
    }
}
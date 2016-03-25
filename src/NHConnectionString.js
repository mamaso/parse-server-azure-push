'use strict'

module.exports = {
    get: () => process.env['CUSTOMCONNSTR_MS_NotificationHubConnectionString'],
    parse: (connectionString, pushConfig) => {
        connectionString.split(';').forEach((keyValuePair) => {
            let splitIndex = keyValuePair.indexOf('=');
                pushConfig[keyValuePair.slice(0, splitIndex)] = keyValuePair.slice(splitIndex + 1);
        });

        pushConfig.Endpoint = pushConfig.Endpoint.replace('sb://', '').replace('/', '');
    }
}
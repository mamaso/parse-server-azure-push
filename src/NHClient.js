'use strict'

const request = require('request');
const Parse = require('parse/node').Parse;
const merge = require('deeply');

const generateToken = require('./NHSasToken');
const nhConnectionString = require('./NHConnectionString');

module.exports = pushConfig => {
    pushConfig.ConnectionString = pushConfig.ConnectionString || nhConnectionString.get();
    pushConfig.ConnectionString && nhConnectionString.parse(pushConfig.ConnectionString, pushConfig);
    pushConfig.HubName = pushConfig.HubName || process.env['MS_NotificationHubName'];

    var api = {
        send: (handles, headers, payload) => {
            let pushPromise = new Parse.Promise();
            let resource = 'messages';

            let defaultHeaders = {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': generateToken(resource, pushConfig),
                'x-ms-version': '2015-04',
                'ServiceBusNotification-DeviceHandle': handles[0].deviceToken
            }

            let options = {
                uri: generateResourceUrl(resource) + '?direct&api-version=2015-04',
                headers: merge(defaultHeaders, headers),
                json: payload
            }

            request.post(options, (err, res, body) => {
                if (err) {
                    pushPromise.reject(err);
                } else {
                    pushPromise.resolve();
                }
            });

            return pushPromise;
        }
    }

    return api;

    function generateResourceUrl(resource) {
        return pushConfig.Endpoint + pushConfig.HubName + '/' + resource + '/';
    }
}
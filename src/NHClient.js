'use strict'

const Parse = require('parse/node').Parse;
const https = require('https');
const request = require('request');
const merge = require('deeply');
const version = '2015-08';
const boundary = "simple-boundary";
const chunkSize = 200;

const generateToken = require('./NHSasToken');
const chunkArray = require('./chunkArray')(chunkSize);
const multipart = require('./multipart')(boundary);

module.exports = pushConfig => {
    var api = {
        directSend: (handles, headers, payload) => {
            let options = {
                uri: 'https://' + pushConfig.Endpoint + '/' + pushConfig.HubName + '/messages/?direct&api-version=' + version,
                headers: merge({
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': generateToken(pushConfig),
                    'x-ms-version': version,
                    'ServiceBusNotification-DeviceHandle': ''
                }, headers),
                json: payload
            };

            return Parse.Promise.when(handles.map(handle => {
                options.headers['ServiceBusNotification-DeviceHandle'] = handle;
                let sendPromise = new Parse.Promise();

                request.post(options, (err, res, body) => {
                    if (err) {
                        console.log(err);
                        sendPromise.reject(err);
                    } else {
                        sendPromise.resolve();
                    }
                });

                return sendPromise;
            }));
        },

        bulkSend: (handles, headers, payload) => {
            let options = {
                method: 'post',
                host: pushConfig.Endpoint,
                path: '/' + pushConfig.HubName + '/messages/$batch?direct&api-version=' + version,
                headers: merge({
                    'Content-Type': 'multipart/mixed; boundary="' + boundary + '"',
                    'Authorization': generateToken(pushConfig),
                    'x-ms-version': version,
                }, headers)
            };

            return Parse.Promise.when(chunkArray(handles).map(chunk => {
                let sendPromise = new Parse.Promise();
                let request = https.request(options);
                multipart(chunk, payload).pipe(request);
                request.on('response', (res) => {
                    sendPromise.resolve(res.statusCode);
                });
                request.on('error', sendPromise.reject);
                return sendPromise;
            }));
        }
    }

    return api;
}
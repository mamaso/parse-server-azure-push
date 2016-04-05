'use strict'

const Parse = require('parse/node').Parse;
const https = require('https');
const merge = require('deeply');
const version = '2015-08';
const boundary = "simple-boundary";

const generateToken = require('./NHSasToken');
const multipart = require('./multipart')(boundary);

module.exports = pushConfig => {
    var api = {
        bulkSend: (handles, headers, payload) => {
            let options = {
                method: 'post',
                host: pushConfig.Endpoint,
                path: '/' + pushConfig.HubName + '/messages/$batch?direct&api-version=' + version,
                headers: merge(headers, {
                    'Content-Type': 'multipart/mixed; boundary="' + boundary + '"',
                    'Authorization': generateToken(pushConfig),
                    'x-ms-version': version,
                })
            };

            let sendPromise = new Parse.Promise();
            let request = https.request(options);
            multipart(handles, payload, headers['Content-Type']).pipe(request);
            request.on('response', (res) => {
                console.log(res.statusCode + ' ' + res.statusMessage + ', sent ' + handles.length +  ' ' + options.headers['ServiceBusNotification-Format'] + ' notifications');
                if (res.statusCode != 201) {
                    let err = [];
                    res.on('data', chunk => err.push(chunk))
                       .on('end', _ => reportError(Buffer.concat(err).toString()));
                } else 
                    sendPromise.resolve(res.statusCode);
            }).on('error', reportError);

            function reportError(err) {
                console.error(err);
                sendPromise.reject(err);
            }

            return sendPromise;
        }
    }

    return api;
}
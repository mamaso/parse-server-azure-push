# Parse Server Azure Push

This module provides push capabilities for parse server via azure notification hubs.

Add to your parse app like so:
```js
var azurePushAdapter = require('parse-server-azure-push');
var ParseServer = require('parse-server').ParseServer;
var express = require('express');

var server = new ParseServer({
    //... other config values ...
    push: azurePushAdapter({
        ConnectionString: 'notification hub connection string',
        HubName: 'notification hub name'
    })
});
```

If you do not want to explicitly specify a connection string or hub name,
they can be specified via environment variables:
  * ConnectionString: process.env.CUSTOMCONNSTR_MS_NotificationHubConnectionString
  * HubName: process.env.MS_NotificationHubName

# Sending WNS Pushes

This module has the capability to send pushes to Windows devices.  The default behavior is to send toast notifications:

```js
Parse.Cloud.define('myPushFunction', (req, res) => {
    // sends a toast notification with text 'my toast notification'
    Parse.Push.send({
        channels: [ 'someChannel' ],
        data: {
            alert: 'my toast notification'
        }
    }, { useMasterKey: true })
    .then(res.success)
    .catch(res.error);
});
```

If you would like to send more advanced WNS notifications, you can through the use of the 'wns' object:

```js
// sends a raw notification with custom wns header
Parse.Push.send({
    channels: [ 'someChannel' ],
    data: {
        alert: 'apple or gcm alert'     // ignored if 'wns.data' exists for windows installations
    },
    wns: {
        type: 'raw',                    // adds the X-WNS-Type: 'wns/raw' header
        data: 'my raw notification',    // the wns payload
        headers: {                      // custom headers to be sent to WNS
            'X-WNS-Cache-Policy': 'cache'
        }
    }
}, { useMasterKey: true });
```
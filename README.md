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

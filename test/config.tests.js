var config = require('../src/NHConfig').get;
var expect = require('chai').expect;

describe('config', function () {
    it('configures', function () {
        process.env.MS_NotificationHubName = 'hub';
        var pushConfig = config({
            ConnectionString: "Endpoint=sb://endpoint.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=keyVal"
        });
        delete process.env.MS_NotificationHubName;

        expect(pushConfig.HubName).to.equal('hub');
        expect(pushConfig.Endpoint).to.be.ok;
        expect(pushConfig.SharedAccessKey).to.be.ok;
        expect(pushConfig.SharedAccessKeyName).to.be.ok;
    });

    it('uses sitename if necessary', function () {
        process.env.WEBSITE_SITE_NAME = 'hub';
        var pushConfig = config({
            ConnectionString: "Endpoint=sb://endpoint.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=keyVal"
        });
        delete process.env.WEBSITE_SITE_NAME;

        expect(pushConfig.HubName).to.equal('hub-hub');
    });

    it('throws if missing', function () {
        expect(_ => config({})).to.throw('AzurePushAdapter requires a HubName')
    });
})
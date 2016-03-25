var connectionString = require('../src/NHConnectionString');
var expect = require('chai').expect;

describe('connection string', function() {
    it('parses', function () {
        var string = "Endpoint=sb://endpoint.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=keyVal";
        var opts = {};
        connectionString.parse(string, opts);
        expect(opts).to.eql({
            Endpoint: 'endpoint.servicebus.windows.net',
            SharedAccessKey: 'keyVal',
            SharedAccessKeyName: 'DefaultFullSharedAccessSignature'
        });
    });

    it('gets', function () {
        process.env.CUSTOMCONNSTR_MS_NotificationHubConnectionString = 'test';
        expect(connectionString.get()).to.equal('test');
        delete process.env.CUSTOMCONNSTR_MS_NotificationHubConnectionString;
    });
});
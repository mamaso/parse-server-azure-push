var gcm = require('../src/GCM');
var expect = require('chai').expect;

describe('gcm', function () {
    it('builds payload', function () {
        var payload = gcm.generatePayload({
            data: {
                alert: 'push'
            },
            expiration_time: 1001
        }, 1);

        payload = JSON.parse(payload);

        expect(payload.priority).to.equal('normal');
        expect(payload.data.time).to.equal('1970-01-01T00:00:00.001Z');
        expect(payload.data.push_id).to.be.ok;
        expect(payload.data.data).to.equal('{"alert":"push"}');
        expect(payload.timeToLive).to.equal(1);
    });

    it('gets headers', function () {
        var headers = gcm.generateHeaders({});
        expect(headers).to.eql({
            'ServiceBusNotification-Format': 'gcm',
            'Content-Type': 'application/json;charset=utf-8'
        });
    });

    it('has chunk size', function () {
        expect(gcm.chunkSize).to.equal(200);
    });
})
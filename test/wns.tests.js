var wns = require('../src/WNS');
var expect = require('chai').expect;

describe('wns', function () {
    it('builds default toast payload', function () {
        var payload = wns.generatePayload({
            data: {
                alert: 'push'
            },
        });

        expect(payload).to.equal('<toast><visual><binding template="ToastText01"><text id="1">push</text></binding></visual></toast>');
    });

    it('builds default toast headers', function () {
        var headers = wns.generateHeaders({});
        expect(headers).to.eql({
            'ServiceBusNotification-Format': 'windows',
            'Content-Type': 'text/xml',
            'X-WNS-Type': 'wns/toast'
        });
    });

    it('chooses raw content type octet', function () {
        var headers = wns.generateHeaders({
            wnsHeaders: {
                'X-WNS-Type': 'wns/raw'
            }
        });
        expect(headers).to.eql({
            'ServiceBusNotification-Format': 'windows',
            'Content-Type': 'application/octet-stream',
            'X-WNS-Type': 'wns/raw'
        });
    });

    it('uses wns data and headers if specified', function () {
        var notification = {
            data: {
                alert: 'push'
            },
            wnsData: '<wns>A wns notification</wns>',
            wnsHeaders:  {
                'X-WNS-Custom': 'custom'
            },
            expiration_time: 1001
        };
        var payload = wns.generatePayload(notification);

        expect(payload).to.equal('<wns>A wns notification</wns>');

        var headers = wns.generateHeaders(notification, 1);

        expect(headers).to.eql({
            'ServiceBusNotification-Format': 'windows',
            'Content-Type': 'text/xml',
            'X-WNS-Type': 'wns/toast',
            'X-WNS-Custom': 'custom',
            'X-WNS-TTL': 1
        });
    });

    it('has chunk size', function () {
        expect(wns.chunkSize).to.equal(30);
    });
});
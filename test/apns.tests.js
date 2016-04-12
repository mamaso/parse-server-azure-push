var apns = require('../src/APNS');
var expect = require('chai').expect;

describe('apns', function () {
    it('builds payload', function () {
        var payload = apns.generatePayload({
            data: {
                alert: 'alert',
                badge: 'badge',
                sound: 'sound',
                'content-available': 'content',
                category: 'category',
                random: 'random'
            },
            expiration_time: 1001
        });

        expect(JSON.parse(payload)).to.eql({
            random: 'random',
            aps: {
                alert: 'alert',
                badge: 'badge',
                sound: 'sound',
                'content-available': 'content',
                category: 'category'
            }
        });
    });

    it('gets headers', function () {
        var headers = apns.generateHeaders({
            expiration_time: 1001
        });
        expect(headers).to.eql({
            'ServiceBusNotification-Format': 'apple',
            'ServiceBusNotification-Apns-Expiry': '1970-01-01T00:00:01.001Z',
            'Content-Type': 'application/json;charset=utf-8'
        });
    });
})
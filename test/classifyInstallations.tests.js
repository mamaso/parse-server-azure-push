var classify = require('../src/classifyInstallations');
var expect = require('chai').expect;

var installations = [
    {
        deviceToken: 1,
        deviceType: 'android'
    },
    {
        deviceToken: 2,
        deviceType: 'android'
    },
    {
        deviceToken: 3,
        deviceType: 'ios'
    },
    {
        channelUris: 4,
        deviceType: 'windows'
    }
];

describe('classify installations', function () {
    it('classifies android', function () {
        var mapped = classify(installations, ['android']);
        expect(mapped).to.eql({
            android: [ 1,2 ]
        });
    });

    it('classifies all', function () {
        var mapped = classify(installations, ['android', 'ios', 'windows'])
        expect(mapped).to.eql({
            android: [ 1,2 ],
            ios: [3],
            windows: [4]
        });
    });
})
var sasToken = require('../src/NHSasToken');
var expect = require('chai').expect;

describe('sas token', function () {
    it('generates sas token', function () {
        var token = sasToken({
            Endpoint: 'endpoint',
            SharedAccessKey: 'keyVal',
            SharedAccessKeyName: 'keyName',
            HubName: 'hub'
        }, 1);

        expect(token).to.equal('SharedAccessSignature sr=endpoint%2Fhub&sig=EGsjmHg%2FOKM5bYk5pU7ZpN5ExQRuT3VCwXuCftrmUZw%3D&se=1&skn=keyName')
    });
});
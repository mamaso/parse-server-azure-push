var multipart = require('../src/multipart')('boundary');
var expect = require('chai').expect;

describe('multipart', function () {
    it('creates', function (done) {
        var form = multipart([1,2,3], JSON.stringify({ alert: 'push' }), 'text/xml');

        var data = '';
        form.on('data', function (chunk) {
            data += chunk;
        });
        form.on('end', function (){
            expect(data).to.equal('--boundary\r\n' + 
                'Content-Disposition: inline; name=notification\r\n' +
                'Content-Type: text/xml\r\n\r\n' +
                '{"alert":"push"}\r\n' +
                '--boundary\r\n' + 
                'Content-Disposition: inline; name=devices\r\n' +
                'Content-Type: application/json;charset=utf-8\r\n\r\n' +
                '[1,2,3]\r\n' +
                '--boundary--\r\n');
            done();
        });
        form.pipe(process.stdout);
    });
});
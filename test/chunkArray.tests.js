var chunkArray = require('../src/chunkArray');
var expect = require('chai').expect;

describe('chunk array', function() {
    it('should chunk', function() {
        var arr = [1,2,3,4,5];
        expect(chunkArray(2)(arr)).to.eql([[1,2],[3,4],[5]]);
        expect(chunkArray(6)(arr)).to.eql([[1,2,3,4,5]]);
        expect(chunkArray(1)(arr)).to.eql([[1],[2],[3],[4],[5]]);
    });
});
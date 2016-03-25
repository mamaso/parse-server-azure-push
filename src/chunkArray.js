module.exports = function(chunkSize) {
    return function(arr) {
        var chunks = [];
        for (var i = 0; i < arr.length; i += chunkSize) {
            chunks.push(arr.slice(i, i + chunkSize));
        }
        return chunks;
    }
}
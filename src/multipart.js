var FormData = require('form-data');

module.exports = function(boundary) {
    return function(chunk, payload) {
        var form = new FormData();
        form._boundary = boundary;
        form.append('notification', JSON.stringify(payload), formOptions('notification'));
        form.append('devices', JSON.stringify(chunk), formOptions('devices'));

        return form;   
    }

    function formOptions(name) {
        return {
            header: '--' + boundary + FormData.LINE_BREAK +
                    'Content-Disposition: inline; name=' + name + FormData.LINE_BREAK +
                    'Content-Type: application/json;charset=utf-8' + FormData.LINE_BREAK + FormData.LINE_BREAK
        }
    }             
}

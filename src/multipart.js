var FormData = require('form-data');

module.exports = function(boundary) {
    return function(chunk, payload, contentType) {
        var form = new FormData();
        form._boundary = boundary;
        form.append('notification', payload, formOptions('notification', contentType));
        form.append('devices', JSON.stringify(chunk), formOptions('devices', 'application/json;charset=utf-8'));

        return form;   
    }

    function formOptions(name, contentType) {
        return {
            header: '--' + boundary + FormData.LINE_BREAK +
                    'Content-Disposition: inline; name=' + name + FormData.LINE_BREAK +
                    'Content-Type: ' + contentType + FormData.LINE_BREAK + FormData.LINE_BREAK
        }
    }             
}

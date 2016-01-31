var xhr = require('../utils/xhr');

module.exports = {
    getDeviceSpec: function(deviceID, callback) {
        xhr.simpleCall({
            func: 'get-spec',
            data: {
                deviceID: deviceID
            }
        }, null, function(err, res){
            callback(err, res);
        });
    },
    getMessages: function(callback){
        xhr.simpleCall({
            func:'message'
        }, {}, function(res) {
            callback(res.data);
        });
    },
    invokeAction: function(deviceID, serviceID, actionName, args, callback) {
        xhr.simpleCall({
            func: 'invoke-action',
            method: 'POST',
            data: {
                deviceID: deviceID
            }
        }, {
            serviceID: serviceID,
            actionName: actionName,
            argumentList: args
        }, function(err, res){
            callback(err, res);
        });
    }
};
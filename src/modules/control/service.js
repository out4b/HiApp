var xhr = require('../utils/xhr');

module.exports = {
    getDeviceSpec: function(deviceID, callback) {
        xhr.simpleCall({
            func: 'get-spec',
            data: {
                deviceID: deviceID
            }            
        }, function(err, res){
            callback(err, res);
        });
    },
    getMessages: function(callback){
        xhr.simpleCall({
            func:'message'
        },function(res) {
            callback(res.data);
        });
    }
};
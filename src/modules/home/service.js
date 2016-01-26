var xhr = require('../utils/xhr');

module.exports = {
    getTimeline: function(callback){
        xhr.simpleCall({
            func:'timeline'
        },function(res){
            callback(res.data);
        });
    },
    refreshTimeline: function(callback){
        xhr.simpleCall({
            func:'refresh_timeline'
        },function(res){
            callback(res.data);
        });
    },
    infiniteTimeline: function(callback){
        xhr.simpleCall({
            func:'more_timeline'
        },function(res){
            callback(res.data);
        });
    },
    discoverDevice: function(callback) {
        xhr.simpleCall({
            func:'discover',
            method: 'POST'
        }, callback);
    },
    stopDiscoverDevice: function(callback) {
        xhr.simpleCall({
            func:'stop-discover',
            method: 'POST'
        }, callback);
    },    
    getDeviceList: function(callback) {
        xhr.simpleCall({
            func:'devicelist'
        },function(err, res){
            callback(err, res);
        });        
    },
    connectDevice: function(deviceID, user, pass, callback) {
        xhr.simpleCall({
            func:'connect',
            method: 'POST',
            data: {
                deviceID: deviceID,
                username: user,
                password: pass
            }
        },function(err, result){
            callback(err, result);
        });                
    },
    disconnectDevice: function(deviceID, token, callback) {
        xhr.simpleCall({
            func:'disconnect',
            method: 'POST',
            data: {
                deviceID: deviceID,
                token: token
            }
        },function(err, result){
            callback(err, result);
        });                
    }    
};
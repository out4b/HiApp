var appFunc = require('./appFunc'),
    networkStatus = require('../components/networkStatus');
var CdifServerUrl = 'http://10.239.158.75:3049/';

module.exports = {

    search: function(code, array){
        for (var i=0;i< array.length; i++){
            if (array[i].code === code) {
                return array[i];
            }
        }
        return false;
    },

    getRequestURL: function(options){
        //var host = apiServerHost || window.location.host;
        //var port = options.port || window.location.port;
        var query = options.query || {};
        var func = options.func || '';

        if (func === 'devicelist') {
            return CdifServerUrl + 'device-list';
        } else if (func === 'get-spec') {
            return CdifServerUrl + 'device-control/' + options.data.deviceID + '/get-spec';
        }else if (func === 'discover') {
            return CdifServerUrl + 'discover';
        } else if (func === 'stop-discover') {
            return CdifServerUrl + 'stop-discover';
        } else if (func === 'connect') {
            return CdifServerUrl + 'device-control/' + options.data.deviceID + '/connect';
        } else if (func === 'disconnect') {
            return CdifServerUrl + 'device-control/' + options.data.deviceID + '/disconnect';
        } else if (func === 'invoke-action') {
            return CdifServerUrl + 'device-control/' + options.data.deviceID + '/invoke-action';
        }

        var apiServer = 'api/' + func + '.json' +
            (appFunc.isEmpty(query) ? '' : '?');

        var name;
        for (name in query) {
            apiServer += name + '=' + query[name] + '&';
        }

        return apiServer.replace(/&$/gi, '');
    },

    simpleCall: function(options,callback){
        var that = this;

        options = options || {};
        options.data = options.data ? options.data : '';

        //If you access your server api ,please user `post` method.
        options.method = options.method || 'GET';
        //options.method = options.method || 'POST';

        if(appFunc.isPhonegap()){
            //Check network connection
            var network = networkStatus.checkConnection();
            if(network === 'NoNetwork'){

                hiApp.alert(i18n.error.no_network,function(){
                    hiApp.hideIndicator();
                    hiApp.hidePreloader();
                });

                return false;
            }
        }

        $$.ajax({
            url: that.getRequestURL(options) ,
            method: options.method,
            data: options.data,
            success:function(data, status, xhr) {
                console.log(data);
                console.log(status);
                console.log(xhr);
                data = data ? JSON.parse(data) : '';
                callback(null, data);

                // var codes = [
                //     {code:10000, message:'Your session is invalid, please login again',path:'/'},
                //     {code:10001, message:'Unknown error,please login again',path:'tpl/login.html'},
                //     {code:20001, message:'User name or password does not match',path:'/'}
                // ];

                // var codeLevel = that.search(data.err_code,codes);

                // if(!codeLevel){

                //     (typeof(callback) === 'function') ? callback(null, data) : '';

                // }else{

                //     hiApp.alert(codeLevel.message,function(){
                //         hiApp.hideIndicator();
                //         hiApp.hidePreloader();
                //     });
                // }
            },
            error:function(xhr, status, data) {
                var response = JSON.parse(xhr.response);
                callback(new Error(response.topic), response.message);
            }
        });

    }
};
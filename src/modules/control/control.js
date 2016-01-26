require('./control.less');

var appFunc = require('../utils/appFunc'),
    template = require('./control.tpl.html'),
    service = require('./service');


var inputModule = {
    init: function(query){
        var that = this;

        this.deviceID = query.deviceID;
        console.log(deviceID);

        service.getDeviceSpec(this.deviceID, function(err, spec) {
            that.spec = spec;
            console.log(err);
            console.log(spec);
            // that.renderDeviceList(that.transformDeviceList(dl));
            // hiApp.hideIndicator();
            // var ptrContent = $$('#homeView').find('.pull-to-refresh-content');
            // ptrContent.data('scrollLoading','unloading');
        });        
        // appFunc.hideToolbar();
    },
    openControlPage: function(device) {
        console.log('XXX');
        var renderData = {
            serviceList: this.transformServiceList(device),
            serviceID: function() {
                return this.id;
            }
        };

        var output = appFunc.renderTpl(template, renderData);
        // $$('#contactView .contacts-list ul').html(output);

        var bindings = [{
            element: '#sendWeiboBtn',
            event: 'click',
            handler: inputModule.postMessage
        },{
            element: 'div.message-tools .get-position',
            event: 'click',
           handler: geo.catchGeoInfo
        },{
            element: '#geoInfo',
            event: 'click',
            handler: geo.cleanGeo
        },{
            element: 'div.message-tools .image-upload',
            event: 'click',
            handler: camera.getPicture
        }];

        appFunc.bindEvents(bindings);
    },
    transformServiceList: function(device) {
        var serviceArray = [];

        for (serviceID in device.serviceList) {
            device.serviceList[serviceID].id = serviceID;
            serviceArray.push(device.serviceList[serviceID]);
        }
        return serviceArray;
    },    
    renderServiceList: function(sl) {
        console.log(dl);

        var output = appFunc.renderTpl(template, renderData);
        if(type === 'prepend'){
            $$('#homeView').find('.home-timeline').prepend(output);
        }else if(type === 'append') {
            $$('#homeView').find('.home-timeline').append(output);
        }else {
            $$('#homeView').find('.home-timeline').html(output);
        }
    },
};

module.exports = inputModule;

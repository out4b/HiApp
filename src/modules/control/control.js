require('./control.less');

var appFunc = require('../utils/appFunc'),
    template = require('./control.tpl.html'),
    xhrService = require('./service'),
    variableTemplate = require('./variable.tpl.html');


var inputModule = {
    init: function(query){
        var that = this;

        this.deviceID = query.deviceID;
        console.log(deviceID);

        xhrService.getDeviceSpec(this.deviceID, function(err, spec) {
            that.spec = spec;
            console.log(err);
            console.log(spec);
            that.renderServiceList(that.transformServiceList(that.spec));
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
    transformServiceList: function(spec) {
        var serviceArray = [];
        var sl = spec.device.serviceList;

        for (serviceID in sl) {
            var service = sl[serviceID];
            service.id  = serviceID;
            service.va = [];
            for (var j in service.serviceStateTable) {
                service.serviceStateTable[j].name = j;
                service.va.push(service.serviceStateTable[j]);
            }
            service.aa = [];
            for (var j in service.actionList) {
                service.actionList[j].name = j;
                service.aa.push(service.actionList[j]);
            }
            serviceArray.push(service);
        }
        return serviceArray;
    },
    getClickHandler: function(service, action) {
        var _this = this;
        return function() {
            var args = action.argumentList;
            for (var argName in args) {
                var variableName = args[argName].relatedStateVariable;
                var stateVariable = service.serviceStateTable[variableName];
                console.log(stateVariable);
                if (stateVariable.dataType === 'boolean') {
                    if (args[argName].direction === 'in') {
                        var popupButtons = [{
                            text: 'ON',
                            onClick: function () {
                                xhrService.invokeAction(_this.deviceID, service.id, action.name, {stateValue: true}, function(err, result) {
                                    console.log(err);
                                });
                            }
                        },
                        {
                            text: 'OFF',
                            onClick: function () {
                                xhrService.invokeAction(_this.deviceID, service.id, action.name, {stateValue: false}, function(err, result) {
                                    console.log(err);
                                });
                            }
                        }];

                        hiApp.actions(popupButtons);
                        // popup set value menu
                    } else {
                        // popup retrieved value
                    }
                }
            }
        };
    },
    renderServiceList: function(sa, type) {
        var renderData = {
            serviceList: sa,
            serviceID: function() {
                return this.id;
            }
        };

        var output = appFunc.renderTpl(template, renderData);
        $$('.page[data-page="device"] .device-servicelist').html(output);

        for (var i in sa) {
            var aa = sa[i].aa;
            for (var j in aa) {
                var elem = '.' + aa[j].name;
                var binding = [{
                    element: elem,
                    event: 'click',
                    handler: this.getClickHandler(sa[i], aa[j])
                }];
                appFunc.bindEvents(binding);
            }
        }
        // var bindings = [{
        //     element: '.getState',
        //     event: 'click',
        //     handler: this.binarySwitchHandler
        // }];

        // appFunc.bindEvents(bindings);

        // var variableRenderData = {
        //     variableList: va,
        //     variableName: function() {
        //         return this.name;
        //     }
        // };
        // var output = appFunc.renderTpl(variableTemplate, variableRenderData);
        // $$('.page[data-page="device"] .device-servicelist .variable-list').html(output);

        // var actionRenderData = {
        //     actionList: actions,
        //     actionName: function() {
        //         return this.name;
        //     }
        // }
        // var ao = appFunc.renderTpl(actionTemplate, actionRenderData);
        // console.log(ao);
        // $$('.page[data-page="device"] .device-servicelist .action-list').html(ao);

        // if(type === 'prepend'){
        //     $$('#deviceView').find('.device-servicelist').prepend(output);
        // }else if(type === 'append') {
        //     $$('#deviceView').find('.device-servicelist').append(output);
        // }else {
        //     $$('#deviceView').find('.device-servicelist').html(output);
        // }
    },
};

module.exports = inputModule;

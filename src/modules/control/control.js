require('./control.less');

var appFunc = require('../utils/appFunc'),
    template = require('./control.tpl.html'),
    xhrService = require('./service'),
    switchTemplate = require('./switch.tpl.html');


var inputModule = {
    init: function(query){
        var that = this;

        this.deviceID = query.deviceID;
        console.log(deviceID);

        xhrService.getDeviceSpec(this.deviceID, function(err, spec) {
            that.spec = spec;
            that.renderServiceList(that.transformServiceList(that.spec));
            // that.renderDeviceList(that.transformDeviceList(dl));
            // hiApp.hideIndicator();
            // var ptrContent = $$('#homeView').find('.pull-to-refresh-content');
            // ptrContent.data('scrollLoading','unloading');
        });
        // appFunc.hideToolbar();
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
                var argumentList = service.actionList[j].argumentList;
                for (var l in argumentList) {
                    argumentList[l].name = l;
                }
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
        var _this = this;
        var renderData = {
            serviceList: sa,
            serviceID: function() {
                return this.id;
            }
        };

        var output = appFunc.renderTpl(template, renderData);
        $$('.page[data-page="device"] .device-servicelist').html(output);

        var $this = $$('.page[data-page="device"] .device-servicelist');

        for (var i in sa) {
            var aa = sa[i].aa;
            for (var j in aa) {
                var args = aa[j].argumentList;
                for (var l in args) {
                    var varName = args[l].relatedStateVariable;
                    var variable = sa[i].serviceStateTable[varName];
                    var sel = '.' + aa[j].name;
                    if (variable.dataType === 'boolean' && args[l].direction === 'in') {
                        var renderData = {
                            id: aa[j].name
                        };
                        var out = appFunc.renderTpl(switchTemplate, renderData);
                        $this.find(sel).html(out);

                        var arg = {};
                        arg[l] = false;
                        var actionObject = new ActionObject(_this.deviceID, sa[i].id, aa[j].name, arg);

                        var binding = [{
                            element: sel,
                            event: 'change',
                            handler: function() {
                                actionObject.invoke(function(err, result) {
                                    if (!err) {

                                    }
                                });
                            }
                        }];
                        appFunc.bindEvents(binding);
                    }
                }
            }
        }

    },
};

var ActionObject = function(deviceID, serviceID, actionName, argumentList) {
    this.deviceID = deviceID;
    this.serviceID = serviceID;
    this.actionName = actionName;
    this.args = argumentList;
    this.invoke = function(callback) {
        xhrService.invokeAction(this.deviceID, this.serviceID, this.actionName, this.args, callback);
    };
}
module.exports = inputModule;

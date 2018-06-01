'use strict';

define([
    'text!./reportErrorAside.html',
    'ServerAPI',
    'ERROR'
], function (
    tpl,
    ServerAPI,
    ERROR
) {
    return {
        template: tpl,
        data: function () {
            return {
                eventLog: [], //事件记录
                errorList: [] //异常列表
            };
        },
        computed: {
            // 基本信息
            reportBase: function () {
                return this.$store.state.reportBase;
            },
            // 处理好的数据
            diseaseListDealData: function () {
                return this.$store.getters.diseaseListDealData;
            }
        },
        methods: {
            // 日期转化方法
            dateFormat: function (date, format) {
                var o = {
                    "M+": date.getMonth() + 1, //month
                    "d+": date.getDate(), //day
                    "h+": date.getHours(), //hour
                    "m+": date.getMinutes(), //minute
                    "s+": date.getSeconds(), //second
                    "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
                    "S": date.getMilliseconds() //millisecond
                };
                if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
                    (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(format))
                        format = format.replace(RegExp.$1,
                            RegExp.$1.length == 1 ? o[k] :
                            ("00" + o[k]).substr(("" + o[k]).length));
                return format;
            },
            // 获取心电用药记录
            getHeartDrugLog: function () {
                var result = ServerAPI.getHeartDrugLog({
                    userInfoId: this.reportBase.userInfoId,
                    date: this.dateFormat(new Date(Number(this.reportBase.startTime)), 'yyyy-MM-dd')
                });
                result.then(function (res) {
                    if (res.status == 0) {
                        this.eventLog = (function (data) {
                            var arr = [];
                            for (var i = 0; i < data.length; i++) {
                                var obj = {
                                    time: data[i].time,
                                    descriptions: data[i].name
                                };
                                arr.push(obj);
                            }
                            return this.eventLog.concat(arr);
                        }.bind(this))(res.content);
                    }
                }.bind(this)).catch(function (err) {
                    if(err.statusText=='timeout'){
                        this.$alert('请求超时，请刷新页面', '提示',{
                            confirmButtonText: "确定",
                            callback: function (action) {
                            }
                        });
                    }
                }.bind(this));
            },
            // 获取心电事件记录
            getHeartEventLog: function () {
                var result = ServerAPI.getHeartEventLog({
                    userInfoId: this.reportBase.userInfoId,
                    date: this.dateFormat(new Date(Number(this.reportBase.startTime)), 'yyyy-MM-dd')
                });
                result.then(function (res) {
                    if (res.status == 0) {
                        this.eventLog = (function (data) {
                            var arr = [];
                            for (var i = 0; i < data.length; i++) {
                                var obj = {
                                    time: data[i].time,
                                    descriptions: data[i].descriptions
                                };
                                arr.push(obj);
                            }
                            return this.eventLog.concat(arr);
                        }.bind(this))(res.content);
                    }
                }.bind(this)).catch(function (err) {
                    if(err.statusText=='timeout'){
                        this.$alert('请求超时，请刷新页面', '提示',{
                            confirmButtonText: "确定",
                            callback: function (action) {
                            }
                        });
                    }
                }.bind(this));
            },
            // 设置异常记录table数据
            setErrorList: function () {
                var datalist = this.diseaseListDealData;
                var tableObj = [];
                for (var type in datalist) {
                    // 将异常类型数字换算成文字
                    var name = (function (value) {
                        var nameArr = value.slice(1, value.length - 1).split(',');
                        nameArr = nameArr.map(function (current, index, arr) {
                            if (current in ERROR) {
                                return ERROR[current].name;
                            }
                        });
                        return nameArr.toString();
                    })(type);

                    for (var mode in datalist[type]) {
                        // table每列数据的大概格式
                        var obj = {
                            name: name,
                            num: datalist[type][mode].list.length,
                            checkTrueNum: datalist[type][mode].checkTrueNum,
                            diseaseType: type, //异常的类型
                            diseaseMode: mode //异常的模板号
                        };
                        tableObj.push(obj);
                    }
                }
                this.errorList = tableObj;
            },
            // 点击每一行的数据
            clickRowList: function (row) {
                // 路由配置参数
                var paramsObj = {
                    reportId: this.$route.params.reportId, //报告的id
                    type: this.$route.params.type, //报告的类型
                    diseaseType: row.diseaseType, //异常的类型
                    diseaseMode: row.diseaseMode //异常的模板号
                };
                this.$router.push({
                    name: 'reportAbnormalTypeDetail',
                    params: paramsObj
                });
            },
            // 获取所有的异常记录
            getErrorLog: function () {
                var result = ServerAPI.getDiseaseList({
                    reportId: this.$route.params.reportId,
                    type: this.$route.params.type
                });
                result.then(function (res) {
                    if (res.status == 0) {
                        this.$store.commit('setDiseaseList', res.content);
                    }
                }.bind(this)).catch(function (err) {
                    if(err.statusText=='timeout'){
                        this.$alert('请求超时，请刷新页面', '提示',{
                            confirmButtonText: "确定",
                            callback: function (action) {
                            }
                        });
                    }
                }.bind(this));
            },
        },
        created: function () {
            this.getErrorLog();
        },
        watch: {
            reportBase: function (value) {
                this.getHeartDrugLog();
                this.getHeartEventLog();
            },
            diseaseListDealData: function (value) {
                this.setErrorList();
            }
        }
    };
});
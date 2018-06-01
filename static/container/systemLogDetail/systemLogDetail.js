'use strict';
define([
    'text!./systemLogDetail.html',
    'ServerAPI',
    'css!/container/systemLogDetail/systemLogDetail.css'
], function (
    tpl,
    ServerAPI
) {
    return {
        template: tpl,
        data: function () {
            return {
                //table数据
                listData: [],
                // 操作前
                before: {},
                // 操作后
                after: {}
            };
        },
        methods: {
            // table日期格式化
            date: function (row, column) {
                var dateFormat = function (date, format) {
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
                };
                return dateFormat(new Date(row.operateTime), 'yyyy-MM-dd hh:mm:ss');
            },
            // 获取页面的数据
            getData: function () {
                // 模拟数据

                var result = ServerAPI.logDetail({
                    id: this.$route.params.id
                });
                result.then(function (res) {
                    if (res.status == 200) {
                        // // 基本信息
                        this.listData = function (data) {
                            var arr = [];
                            arr.push(data);
                            return arr;
                        }(res.content);
                        // // 操作前的记录
                        this.before = JSON.parse(res.content.operationAfter);
                        // 操作后的记录
                        this.after = JSON.parse(res.content.operationBefore);
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
            }
        },
        created: function () {
            this.getData();
        }
    };
});
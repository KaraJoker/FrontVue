'use strict';
/**
 * Vue公共的配置
 */
define([
    'ServerAPI'
], function (
    ServerAPI
) {
    return {
        methods: {
            // 异常分类片段，返回数据总览
            returnTotal: function () {
                if (!this.$route.params.isResult) {
                    if (this.$route.params.doctorId) {
                        this.$router.push({
                            name: 'reportDetailDeal',
                            params: {
                                reportId: this.$route.params.reportId,
                                doctorId: this.$route.params.doctorId,
                                type: this.$route.params.type
                            }
                        });
                    } else {
                        this.$router.push({
                            name: 'reportDetailSee',
                            params: {
                                doctorId: this.$route.params.doctorId,
                                type: this.$route.params.type
                            }
                        });
                    }
                } else {
                    if (this.$route.name == 'reportResultAbnormalType') {
                        history.go(-1);
                    } else {
                        history.go(-2);
                    }
                }
            },
            // 表格过滤显示
            checkInArray: function (value) {
                if (this.choiceShow.showList.indexOf(value) !== -1) {
                    return true;
                } else {
                    return false;
                }
            },
            // 日期格式化
            formatDate: function (date, fmt) {
                if (/(y+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
                }
                var o = {
                    'M+': date.getMonth() + 1,
                    'd+': date.getDate(),
                    'h+': date.getHours(),
                    'm+': date.getMinutes(),
                    's+': date.getSeconds()
                };
                for (var k in o) {
                    if (new RegExp(`(${k})`).test(fmt)) {
                        var str = o[k] + '';
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
                    }
                }
                return fmt;
            },
            // 获取图片地
            getLogo: function () {
                var result = ServerAPI.systemDetail();
                result.then(function (res) {
                    if (res.status == 200) {
                        // 请求服务器
                        this.logoSrc = res.content.logo;
                    }else {
                        this.$alert(res.message, '提示', {
                            confirmButtonText: "确定",
                            callback: function (action) {}
                        });
                    }
                }.bind(this)).catch(function (err) {
                    if (err.statusText == 'timeout') {
                        this.$alert('请求超时，请刷新页面', '提示', {
                            confirmButtonText: "确定",
                            callback: function (action) {}
                        });
                    }
                }.bind(this));
            },
        }
    };
});
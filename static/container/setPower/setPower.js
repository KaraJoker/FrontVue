'use strict';
define([
    'text!./setPower.html', 'ServerAPI', 'setPowerCheckbox', 'css!/container/setPower/setPower.css'
], function (tpl, ServerAPI, setPowerCheckbox) {
    return {
        template: tpl,
        data: function () {
            return {
                reportList: [{
                    text: '体温报告',
                    value: 'PERM_temperature'
                }, {
                    text: '睡眠报告',
                    value: 'PERM_sleep'
                }, {
                    text: '心电报告',
                    value: 'PERM_electrocardio'
                }],
                systemList: [{
                    text: '组织架构',
                    value: 'PERM_organization'
                }, {
                    text: '权限管理',
                    value: 'PERM_permission'
                }, {
                    text: '人员管理',
                    value: 'PERM_personage'
                }, {
                    text: '操作日志',
                    value: 'PERM_logger'
                }, {
                    text: '系统设置',
                    value: 'PERM_setting'
                }],
                REPORT_lIST: ['PERM_temperature', 'PERM_sleep', 'PERM_electrocardio'],
                SYSTEM_lIST: ['PERM_organization', 'PERM_permission', 'PERM_personage', 'PERM_logger', 'PERM_setting'],
                reportChecked: [], //报告选中的数据
                systemChecked: [], //系统管理选中的数据
                flag: true
            };
        },
        methods: {
            // 保存
            save: function () {
                if (this.flag) {
                    this.flag = false;
                    var result = ServerAPI.editPower({
                        id: this.$route.params.id,
                        privilegeArray: this.reportChecked.concat(this.systemChecked).toString()
                    })
                    result.then(function (res) {
                        this.flag = true;
                        if (res.status === 200) {
                            this.$alert('提交成功', '提示',{
                                confirmButtonText: "确定",
                                callback: function (action) {
                                    history.go(-1);
                                }
                            });
                        } else {
                            this.$alert(res.message, '提示',{
                                confirmButtonText: "确定",
                                callback: function (action) {}
                            });
                        }
                    }.bind(this)).catch(function (err) {
                        this.flag = true;
                        if (err.statusText == 'timeout') {
                            this.$alert('请求超时，请重新操作', '提示', {
                                confirmButtonText: "确定",
                                callback: function (action) {}
                            });
                        }
                    }.bind(this));
                }
            },
            // 取消
            cancel: function () {
                history.go(-1);
            },
            // 获取报告select组件回传过来的数据
            getReportValue: function (value) {
                this.reportChecked = value;
            },
            // 获取系统管理select组件回传过来的数据
            getSystemValue: function (value) {
                this.systemChecked = value;
            },
            // 获取权限设置
            getPowerSet: function () {
                ServerAPI.getPower({
                    roleId: this.$route.params.id
                }).then(function (res) {
                    if (res.status == 200) {
                        this.powerObj = res.content;
                        var allChecked = res.content.privilegeListString.split(',');
                        console.log('allChecked', allChecked);
                        for (var i = 0; i < allChecked.length; i++) {
                            if (this.REPORT_lIST.indexOf(allChecked[i]) > -1) {
                                this.reportChecked.push(allChecked[i]);
                            }
                        }
                        for (var i = 0; i < allChecked.length; i++) {
                            if (this.SYSTEM_lIST.indexOf(allChecked[i]) > -1) {
                                this.systemChecked.push(allChecked[i]);
                            }
                        }
                    }else {
                        this.$alert(res.message, '提示', {
                            confirmButtonText: "确定",
                            callback: function (action) {}
                        });
                    }
                }.bind(this))
            }
        },
        components: {
            'v-check-group': setPowerCheckbox
        },
        created: function () {
            this.getPowerSet();
        }
    };
});
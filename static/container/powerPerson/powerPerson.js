'use strict';
define([
    'text!./powerPerson.html',
    'ServerAPI',
    'setPowerCheckbox',
    'css!/container/powerPerson/powerPerson.css'
], function (
    tpl,
    ServerAPI,
    setPowerCheckbox
) {
    return {
        template: tpl,
        data: function () {
            return {
                // 展开或收起搜索栏
                isSearchShow: true,
                // 报告权限选项
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
                // 系统设置权限选项
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
                // 服务器返回的权限数据
                powerObj: {
                    roleId: '',
                    role: '',
                    status: '0',
                },
                rules: {
                    role: [{
                            required: true,
                            message: "请输入角色名称",
                            trigger: "blur"
                        },
                        {
                            min: 1,
                            max: 10,
                            message: "角色名称不能超过10个长度",
                            trigger: "blur"
                        }
                    ]
                },
                flag: true
            };
        },
        methods: {
            save: function (formName) {
                this.$refs[formName].validate(function (valid) {
                    if (valid) {
                        if (this.$route.name == 'powerPersonEdit') {
                            this.editSave();
                        } else {
                            this.addSave();
                        }
                    }
                }.bind(this))
            },
            // 编辑保存
            editSave: function () {
                if (this.flag) {
                    this.flag = false;
                    var result = ServerAPI.editPower({
                        id: this.powerObj.roleId,
                        role: this.powerObj.role,
                        status: this.powerObj.status,
                        privilegeArray: this.reportChecked.concat(this.systemChecked).toString()
                    });
                    result.then(function (res) {
                        this.flag = true;
                        if (res.status === 200) {
                            this.$alert('提交成功', '提示',{
                                confirmButtonText: '确定',
                                callback: function (action) {
                                    history.go(-1);
                                }
                            });
                        } else {
                            this.$alert(res.message,'提示', {
                                confirmButtonText: '确定'
                            });
                        }
                    }.bind(this)).catch(function (err) {
                        this.flag = true;
                        if (err.statusText == 'timeout') {
                            this.$alert('请求超时，请重新操作', '提示', {
                                confirmButtonText: "确定",
                                callback: function (action) {
                                    history.go(-1);
                                }
                            });
                        }
                    }.bind(this))
                }
            },
            // 新增保存
            addSave: function () {
                if (this.flag) {
                    this.flag = false;
                    var result = ServerAPI.addPower({
                        role: this.powerObj.role,
                        status: this.powerObj.status,
                        privilegeArray: this.reportChecked.concat(this.systemChecked).toString()
                    });
                    result.then(function (res) {
                        this.flag = true;
                        if (res.status === 200) {
                            this.$alert('提交成功', '提示',{
                                confirmButtonText: '确定',
                                callback: function (action) {
                                    history.go(-1);
                                }
                            });
                        } else {
                            this.$alert(res.message, '提示',{
                                confirmButtonText: '确定'
                            });
                        }
                    }.bind(this)).catch(function (err) {
                        this.flag = true;
                        if (err.statusText == 'timeout') {
                            this.$alert('请求超时，请重新操作', '提示', {
                                confirmButtonText: "确定",
                                callback: function (action) {
                                    history.go(-1);
                                }
                            });
                        }
                    }.bind(this))
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
            // 获取页面的数据
            getPower: function () {
                var result = ServerAPI.getPower({
                    roleId: this.$route.params.id
                });
                result.then(function (res) {
                    if (res.status === 200) {
                        this.powerObj = res.content;
                        this.powerObj.status = (res.content.status + '') == '0' ? '0' : '1';
                        var allChecked = res.content.privilegeListString.split(',');
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
                        console.log(this.reportChecked);
                        console.log(this.systemChecked);
                    }else {
                        this.$alert(res.message,'提示', {
                            confirmButtonText: '确定'
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
            }
        },
        components: {
            'v-check-group': setPowerCheckbox
        },
        created: function () {
            /**
             * 如果有id说明进入的是编辑页面
             */
            if (this.$route.name == 'powerPersonEdit') {
                this.getPower();
            }
        }
    };
});
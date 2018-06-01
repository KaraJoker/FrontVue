'use strict';
define([
    'text!./personManageAddEdit.html',
    'ServerAPI',
    'css!/container/personManageAddEdit/personManageAddEdit.css'
], function (
    tpl,
    ServerAPI
) {
    return {
        template: tpl,
        data: function () {
            // 验证身份证
            var validateID = function (rule, value, callback) {
                var idReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                if (!value) {
                    return callback(new Error('请输入身份证号'));
                } else if (idReg.test(value) == false) {
                    return callback(new Error('请输入正确的身份证号'));
                } else {
                    callback();
                }
            };
            // 手机号验证
            var checkPhone = function (rule, value, callback) {
                var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
                if (!myreg.test(value)) {
                    callback(new Error("请输入正确的手机号"));
                } else {
                    callback();
                }
            };

            return {
                // 表单数据
                person: {
                    mobile: '',
                    realName: '',
                    gender: '1',
                    idCard: '',
                    birthday: '',
                    departmentId: [],
                    position: '',
                    status: 'true'
                },
                // 职位列表
                subjectList: [],
                rules: {
                    mobile: [{
                        required: true,
                        message: "请输入手机号",
                        trigger: "blur"
                    }, {
                        validator: checkPhone,
                        trigger: "blur"
                    }],
                    realName: [{
                        required: true,
                        min: 2,
                        max: 15,
                        message: '请输入真实姓名',
                        trigger: 'blur'
                    }],
                    idCard: [{
                        required: true,
                        message: '请输入身份证号',
                        trigger: 'blur'
                    }, {
                        min: 15,
                        max: 18,
                        message: '身份证号长度不正确',
                        trigger: 'blur'
                    }, {
                        validator: validateID,
                        trigger: 'blur'
                    }],
                    departmentId: [{
                        required: true,
                        message: '请选择所在部门',
                        trigger: 'change'
                    }],
                    birthday: [{
                        required: true,
                        message: '请选择出生日期',
                        trigger: 'change'
                    }]

                },
                // 防止连续提交
                flag: true
            };
        },
        methods: {
            save: function (formName) {
                this.$refs[formName].validate(function (valid) {
                    if (valid) {
                        if (this.$route.params.id) {
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
                    var sendData = {
                        departmentId: this.person.departmentId.join(','),
                        id: this.person.id,
                        mobile: this.person.mobile,
                        realName: this.person.realName,
                        gender: this.person.gender,
                        idCard: this.person.idCard,
                        birthday: this.person.birthday,
                        position: this.person.position,
                        status: this.person.status,
                    };
                    var result = ServerAPI.editUser(sendData);
                    result.then(function (res) {
                        this.flag = true;
                        if (res.status === 200) {
                            this.$alert('提交成功', {
                                confirmButtonText: '确定'
                            });
                        } else {
                            this.$alert(res.msg, {
                                confirmButtonText: '确定'
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

            // 日期格式化
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
            // 新增保存
            addSave: function () {
                if (this.flag) {
                    this.flag = false;
                    var sendData = {
                        departmentId: this.person.departmentId.join(','),
                        id: this.person.id,
                        mobile: this.person.mobile,
                        realName: this.person.realName,
                        gender: this.person.gender,
                        idCard: this.person.idCard,
                        birthday: this.person.birthday,
                        position: this.person.position,
                        status: this.person.status,
                    };
                    var result = ServerAPI.addUser(sendData);
                    result.then(function (res) {
                        this.flag = true;
                        if (res.status === 200) {
                            this.$alert('提交成功', {
                                confirmButtonText: '确定'
                            });
                        } else {
                            this.$alert(res.msg, {
                                confirmButtonText: '确定'
                            });
                        }
                        this.flag = true;
                    }.bind(this)).catch(function (err) {
                        this.flag = true;
                        if (err.statusText == 'timeout') {
                            this.$alert('请求超时，请重新操作', '提示', {
                                confirmButtonText: "确定",
                                callback: function (action) {}
                            });
                        }
                    }.bind(this))
                }
            },
            cancel: function () {
                history.go(-1);
            },
            // 添加，查询手机号
            searchPhone: function () {
                if (this.flag) {
                    this.flag = false;
                    if (this.person.mobile) {
                        var result = ServerAPI.mobileSearchPerson({
                            mobile: this.person.mobile
                        });
                        result.then(function (res) {
                            this.flag = true;
                            if (res.status == 200) {
                                this.person = res.content;
                            } else {
                                this.$alert('暂无该人员的信息，请填写', {
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
                        }.bind(this))
                    }
                }
            },
            // 获取用户的信息
            getPersonInfo: function () {
                var result = ServerAPI.getPersonInfo({
                    doctorInfoId: this.$route.params.id
                });
                result.then(function (res) {
                    if (res.status == 200) {
                        var content = res.content;
                        this.person.departmentId = content.departmentId || [];
                        this.person.id = content.id;
                        this.person.mobile = content.mobile;
                        this.person.realName = content.realName;
                        this.person.gender = content.gender + '';
                        this.person.idCard = content.idCard;
                        this.person.birthday = content.birthday;
                        this.person.position = content.position;
                        this.person.status = content.status + '' || 'true';
                    }
                }.bind(this)).catch(function (err) {
                    if (err.statusText == 'timeout') {
                        this.$alert('请求超时，请刷新页面', '提示', {
                            confirmButtonText: "确定",
                            callback: function (action) {}
                        });
                    }
                }.bind(this))
            },
            // 获取部门列表
            getSectionData: function () {
                var result = ServerAPI.getSectionData();
                result.then(function (res) {
                    if (res.status == 200) {
                        // 原始数据
                        this.subjectList = (function (list) {
                            var arr = [];
                            for (var i = 0; i < list.length; i++) {
                                arr.push(list[i]);
                            }
                            return arr;
                        })(res.content);
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
        },
        created: function () {
            /**
             * 进入编辑页面
             */
            if (this.$route.name == 'personManageEdit') {
                this.getPersonInfo();
            }
            // 获取部门列表
            this.getSectionData();
        }
    };
});
'use strict';
define([
    'text!./findPwdForm.html',
    'ServerAPI',
    'baseProgress',
    'css!/components/findPwdForm/findPwdForm.css'
], function (
    tpl,
    ServerAPI,
    baseProgress
) {
    return {
        template: tpl,
        components: {
            "v-progress": baseProgress
        },
        data: function () {
            // 手机号验证
            var checkPhone = function (rule, value, callback) {
                var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
                if (!myreg.test(value)) {
                    callback(new Error("请输入正确的手机号"));
                } else {
                    callback();
                }
            };
            var validatePass = function (rule, value, callback) {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.userPwd.checkPassword !== '') {
                        this.$refs.pwdForm.validateField('checkPassword');
                    }
                    callback();
                }
            }.bind(this);
            var validatePass2 = function (rule, value, callback) {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.userPwd.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            }.bind(this);
            return {
                step: 0,
                flag: true,
                progressText: ['填写账号', '设置密码', '完成'],
                isDisable: false,
                btnText: '获取验证码',
                initWait: 60,
                wait: 60,
                userPhone: {
                    mobile: "",
                    smsCode: ""
                },
                userPwd: {
                    password: "",
                    checkPassword: "",
                },
                rules: {
                    mobile: [{
                        required: true,
                        message: "请输入手机号",
                        trigger: "blur"
                    }, {
                        validator: checkPhone,
                        trigger: "blur"
                    }],
                    smsCode: [{
                            required: true,
                            message: "请输入验证码",
                            trigger: "blur"
                        },
                        {
                            min: 6,
                            max: 6,
                            message: "验证码长度为6位",
                            trigger: "blur"
                        }
                    ],
                    password: [{
                        min: 6,
                        max: 16,
                        message: "密码长度为6至16位",
                        trigger: "blur"
                    }, {
                        validator: validatePass,
                        trigger: 'blur'
                    }],
                    checkPassword: [{
                        validator: validatePass2,
                        trigger: 'blur'
                    }]
                },
                flag: true
            };
        },
        methods: {
            submitPhone: function (formName) {
                if (this.flag) {
                    this.$refs[formName].validate(function (valid) {
                        if (valid) {
                            this.flag = false;
                            // 请求服务器
                            var result = ServerAPI.phoneCode({
                                mobile: this.userPhone.mobile,
                                smsCode: this.userPhone.smsCode
                            });
                            result.then(function (res) {
                                this.flag = true;
                                if (res.status == 200) {
                                    this.step++
                                } else {
                                    this.$alert(res.message, '提示', {
                                        confirmButtonText: "确定",
                                        callback: function (action) {}
                                    });
                                }
                            }.bind(this)).catch(function (err) {
                                this.flag = true;
                                if (err.statusText == 'timeout') {
                                    this.$alert('请求超时，请重新操作','提示',  {
                                        confirmButtonText: "确定",
                                        callback: function (action) {}
                                    });
                                }
                            }.bind(this));
                        } else {
                            return false;
                        }
                    }.bind(this));
                }
            },
            submitPwd: function (formName) {
                if (this.flag) {
                    this.$refs[formName].validate(function (valid) {
                        if (valid) {
                            this.flag = false;
                            var result = ServerAPI.findPwd({
                                password: this.userPwd.password
                            });
                            result.then(
                                function (res) {
                                    this.flag = true;
                                    if (res.status == 200) {
                                        // 如果密码设置成功，就转到下个界面
                                        this.step++
                                    } else {
                                        this.$alert(res.message, '提示', {
                                            confirmButtonText: "确定",
                                            callback: function (action) {}
                                        });
                                    }
                                }.bind(this)
                            ).catch(function (err) {
                                this.flag = true;
                                if (err.statusText == 'timeout') {
                                    this.$alert('请求超时，请重新操作', '提示', {
                                        confirmButtonText: "确定",
                                        callback: function (action) {}
                                    });
                                }
                            }.bind(this));
                        }
                    }.bind(this));
                }
            },
            timeDown: function () {
                if (this.flag) {
                    this.flag = false;
                    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
                    if (myreg.test(this.userPhone.mobile)) {
                        // 验证手机号是否已经存在，并且获取手机验证码
                        var result = ServerAPI.isRegisterExsitPhone({
                            mobile: this.userPhone.mobile
                        });
                        result.then(function (res) {
                            this.flag = true;
                            if (res.status == 200) {
                                this.isDisable = true;
                                var timer = setInterval(function () {
                                    this.btnText = this.wait + "秒";
                                    this.wait--;
                                    if (this.wait < 0) {
                                        clearInterval(timer);
                                        this.isDisable = false;
                                        this.btnText = "获取验证码";
                                        this.wait = this.initWait;
                                    }
                                }.bind(this), 1000)
                            } else {
                                this.$alert(res.message, '提示', {
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
                }
            }
        }
    }

})
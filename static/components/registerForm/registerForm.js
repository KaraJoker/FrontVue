'use strict';
/**
 * 注册表单
 */
define([
    'text!./registerForm.html',
    'baseProgress',
    'ServerAPI',
    'css!components/registerForm/registerForm.css'
], function (
    tpl,
    baseProgress,
    ServerAPI
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
                flag: true, //防止重复点击
                step: 0,
                progressText: ['填写账号', '设置密码', '完成'],
                isDisable: false,
                btnText: '获取验证码',
                initWait: 60,
                wait: 60,
                isRegister: false, //默认是没有注册过的
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
                            var result = ServerAPI.phoneCode({
                                mobile: this.userPhone.mobile,
                                smsCode: this.userPhone.smsCode
                            });
                            result.then(function (res) {
                                this.flag = true;
                                if (res.status == 200) {
                                    this.step++
                                } else {
                                    this.$alert(res.message, '提示',{
                                        confirmButtonText: "确定",
                                        callback: function (action) {}
                                    });
                                }
                            }.bind(this)).catch(function (err) {
                                this.flag = true;
                                if (err.statusText == 'timeout') {
                                    this.$alert('请求超时，请重新操作', '提示',{
                                        confirmButtonText: "确定",
                                        callback: function (action) {}
                                    });
                                }
                            }.bind(this)).catch(function (err) {
                                this.flag = true;
                                if (err.statusText == 'timeout') {
                                    this.$alert('请求超时，请重新操作', '提示',{
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
                            var result = ServerAPI.setPwd({
                                password: this.userPwd.password
                            });
                            result.then(
                                function (res) {
                                    this.flag = true;
                                    if (res.status == 200) {
                                        // 如果密码设置成功，就转到下个界面
                                        this.step++
                                    } else {
                                        this.$alert(res.message, '提示',{
                                            confirmButtonText: "确定",
                                            callback: function (action) {}
                                        });
                                    }
                                }.bind(this)
                            ).catch(function (err) {
                                this.flag = true;
                                if (err.statusText == 'timeout') {
                                    this.$alert('请求超时，请重新操作', '提示',{
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
                        var result = ServerAPI.isExsitPhone({
                            mobile: this.userPhone.mobile
                        });
                        result.then(function (res) {
                            this.flag = true;
                            // 如果响应的状态吗为200，就表示手机号是没有注册的
                            // 后端开始给手机号发验证码，同时页面开始倒计时
                            // 否则，手机号已经注册过了
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
                                this.$alert(res.message, '提示',{
                                    confirmButtonText: '确定'
                                });
                            }
                        }.bind(this)).catch(function (err) {
                            this.flag = true;
                            if (err.statusText == 'timeout') {
                                this.$alert('请求超时，请重新操作', '提示',{
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
'use strict';

define([
    'text!./changePwdForm.html',
    'baseProgress',
    'ServerAPI',
    'css!/container/changePwdForm/changePwdForm.css'
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
                flag: true,
                step: 0,
                progressText: ['验证身份', '设置密码', '完成'],
                isDisable: false,
                btnText: '获取验证码',
                initWait: 60,
                wait: 60,
                quitTime: 5,
                userPhone: {
                    mobile: '',
                    smsCode: ""
                },
                userPwd: {
                    oldPassword: '',
                    password: "",
                    checkPassword: "",
                },
                rules: {
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
                    oldPassword: [{
                        min: 6,
                        max: 16,
                        message: "密码长度为6至16位",
                        trigger: "blur"
                    }, {
                        validator: validatePass,
                        trigger: 'blur'
                    }],
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
        computed: {
            seeMobile: function () {
                return this.userPhone.mobile.substr(0, 3) + "****" + this.userPhone.mobile.substr(7);
            }
        },
        methods: {
            // 提交手机号和验证码
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
                            result.then(
                                function (res) {
                                    this.flag = true;
                                    // 如果状态不为0，表示有错误
                                    if (res.status == 200) {
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
                                if(err.statusText=='timeout'){
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
            // 提交旧密码和新密码
            submitPwd: function (formName) {
                if (this.flag) {
                    this.$refs[formName].validate(function (valid) {
                        if (valid) {
                            this.flag = false;
                            var result = ServerAPI.changePwd({
                                oldPassword: this.userPwd.oldPassword,
                                password: this.userPwd.password
                            });
                            result.then(
                                function (res) {
                                    this.flag = true;
                                    if (res.status === 200) {
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
                                if(err.statusText=='timeout'){
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
            // 验证手机号是否已经存在
            timeDown: function () {
                if (this.flag) {
                    this.flag = false;
                    if (this.userPhone.mobile) {
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
                                this.$alert(res.message, '提示',{
                                    confirmButtonText: "确定",
                                    callback: function (action) {}
                                });
                            }
                        }.bind(this)).catch(function (err) {
                            this.flag = true;
                            if(err.statusText=='timeout'){
                                this.$alert('请求超时，请重新操作', '提示',{
                                    confirmButtonText: "确定",
                                    callback: function (action) {}
                                });
                            }
                        }.bind(this));
                    }
                }
            },
            // 短信倒计时
            timeDownQuit: function () {
                var timer;
                if (this.quitTime == 0) {
                    // 清除用户session

                    // 跳转到login页面
                    clearTimeout(timer);
                    location.href = '/login.html';
                } else {
                    this.quitTime--;
                    timer = setTimeout(function () {
                        this.timeDownQuit();
                    }.bind(this), 1000);
                }
            },
            // 获取用户的手机号
            getUserMobile: function () {
                var result = ServerAPI.getUserInfo();
                result.then(function (res) {
                    if (res.status == 200) {
                        this.userPhone.mobile = res.content.mobile;
                    }else {
                        this.$alert(res.message, '提示', {
                            confirmButtonText: "确定",
                            callback: function (action) {}
                        });
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
            this.getUserMobile();
        },
        watch: {
            step: function (newValue, oldValue) {
                if (newValue == '2') {
                    this.timeDownQuit();
                }
            }
        }
    };
});
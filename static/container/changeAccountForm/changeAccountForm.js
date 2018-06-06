'use strict';

define([
    'text!./changeAccountForm.html',
    'baseProgress',
    'ServerAPI',
    'css!/container/changeAccountForm/changeAccountForm.css'
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
        computed: {
            seeMobile: function () {
                return this.userPhone.mobile.substr(0, 3) + "****" + this.userPhone.mobile.substr(7);
            }
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
            return {
                step: 0,
                progressText: ['验证身份', '设置账号', '完成'],
                isDisable: false,
                btnText: '获取验证码',
                initWait: 60,
                wait: 60,
                quitTime: 10,
                userPhone: {
                    mobile: '',
                    smsCode: ""
                },
                userNewPhone: {
                    mobile: '',
                    smsCode: ""
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
                    ]
                },
                flag: true
            };
        },
        methods: {
            timeDown: function () {
                if (this.flag) {
                    this.flag = false;
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
                                if (this.step == 1) {
                                    clearInterval(timer);
                                    this.isDisable = false;
                                    this.btnText = "获取验证码";
                                    this.wait = this.initWait;
                                }
                            }.bind(this), 1000)
                        } else {
                            this.$alert(res.message, '提示', {
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
                        } else {
                            return false;
                        }
                    }.bind(this));
                }
            },
            newTimeDown: function () {
                if (this.flag) {
                    this.flag = false;
                    var result = ServerAPI.isExsitPhone({
                        mobile: this.userNewPhone.mobile
                    });
                    result.then(function (res) {
                        this.flag = true;
                        if (res.status == 200) {
                            this.isDisable = true;
                            var timer = setInterval(function () {
                                console.log(this.wait);
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
            submitNewPhone: function (formName) {
                if (this.flag) {
                    this.$refs[formName].validate(function (valid) {
                        if (valid) {
                            this.flag = false;
                            var result = ServerAPI.changeMobile({
                                mobile: this.userNewPhone.mobile,
                                smsCode: this.userNewPhone.smsCode
                            });
                            result.then(function (res) {
                                this.flag = true;
                                // 如果状态不为0，表示有错误
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
            timeDownQuit: function () {
                var timer;
                if (this.quitTime == 0) {
                    // 跳转到login页面
                    clearTimeout(timer);
                    // 清除用户token
                    sessionStorage.removeItem('zhirou_token');
                    // 将用户转发到登陆页面
                    location.href = "/login.html";
                } else {
                    this.quitTime--;
                    timer = setTimeout(function () {
                        this.timeDownQuit()
                    }.bind(this), 1000)
                }
            },
            // 获取用户的信息
            getInfo: function () {
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
                    if (err.statusText == 'timeout') {
                        this.$alert('请求超时，请刷新页面', '提示', {
                            confirmButtonText: "确定",
                            callback: function (action) {}
                        });
                    }
                }.bind(this));
            },
        },
        watch: {
            step: function (newValue, oldValue) {
                if (newValue == '2') {
                    this.timeDownQuit();
                }
            }
        },
        created: function () {
            this.getInfo();
        }
    }
})
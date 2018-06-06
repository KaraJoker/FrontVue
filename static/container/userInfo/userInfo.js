'use strict';
/**
 * 用户信息
 */
define([
    'text!./userInfo.html',
    'ServerAPI',
    'baseImgUpload',
    'css!/container/userInfo/userInfo.css'
], function (
    tpl,
    ServerAPI,
    baseImgUpload
) {
    return {
        template: tpl,
        data: function () {
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
            return {
                flag: true,
                initPhotoSrc: "/images/avatar.png",
                userInfo: {
                    id: '',
                    mobile: '',
                    userface: '',
                    realName: '',
                    gender: '1',
                    certificateNumber: '',
                    departmentId: [],
                    position: '',
                },
                positionList: [],
                rules: {
                    realName: [{
                        required: true,
                        min: 2,
                        max: 15,
                        message: '请输入真实姓名',
                        trigger: 'blur'
                    }],
                    certificateNumber: [{
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
                    }]
                },
                btnShow: false,
            };
        },
        computed: {
            seeMobile: function () {
                return this.userInfo.mobile.substr(0, 3) + "****" + this.userInfo.mobile.substr(7);
            },
            disabledSet: function () {
                // 如果是临时的，就说明没有认证
                if (sessionStorage.getItem('isTemporary') == 'true') {
                    return false
                } else {
                    return true
                }
            }
        },
        methods: {
            // 跳转到修改账号页面
            pageChange: function () {
                this.$router.push({
                    name: 'changeAccount'
                })
            },
            // 获取部门列表
            getSectionData: function () {
                var result = ServerAPI.getSectionData();
                result.then(function (res) {
                    if (res.status == 200) {
                        // 原始数据
                        this.positionList = (function (list) {
                            var arr = [];
                            for (var i = 0; i < list.length; i++) {
                                arr.push(list[i]);
                            }
                            return arr;
                        })(res.content)
                    } else {
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
            // 获取用户的信息
            getInfo: function () {
                var result = ServerAPI.getUserInfo();
                result.then(function (res) {
                    if (res.status == 200) {
                        this.userInfo.id = res.content.id;
                        this.userInfo.mobile = res.content.mobile;
                        if (res.content.userface) {
                            this.userInfo.userface = res.content.userface;
                        } else {
                            this.userInfo.userface = this.initPhotoSrc;
                        }
                        this.userInfo.realName = res.content.realName;
                        this.userInfo.gender = res.content.gender + '' == '0' ? '0' : '1';
                        this.userInfo.certificateNumber = res.content.certificateNumber;
                        this.userInfo.departmentId = res.content.departmentId;
                        this.userInfo.position = res.content.position;
                    } else {
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
            // 保存信息
            saveInfo: function (formName) {
                if (this.flag) {
                    this.$refs[formName].validate(function (valid) {
                        if (valid) {
                            this.flag = false;
                            var formData = new FormData(this.$refs[formName].$el);
                            formData.append('position', this.userInfo.position);
                            formData.append('name', this.userInfo.realName);
                            formData.append('gender', this.userInfo.gender);
                            formData.append('certificateNumber', this.userInfo.certificateNumber);
                            formData.append('departmentId', this.userInfo.departmentId);
                            var result = ServerAPI.saveUserInfo(formData);
                            result.then(function (res) {
                                this.flag = true;
                                if (res.status == 200) {
                                    this.$alert('提交成功', '提示', {
                                        confirmButtonText: "确定",
                                        callback: function (action) {
                                            location.reload();
                                        }
                                    })
                                } else {
                                    this.$alert(res.message, '提示', {
                                        confirmButtonText: "确定",
                                        callback: function (action) {}
                                    })
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
            // 上传图片的操作
            changeFile: function (event) {
                var file = event.target.files[0];
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    this.userInfo.userface = e.target.result;
                }.bind(this);
            },
            // 显示删除头像的按钮
            showChangeBtn: function (isShow) {
                if (this.userInfo.userface !== this.initPhotoSrc) {
                    this.btnShow = isShow;
                }
            },
        },
        mounted: function () {
            // 获取用户信息
            this.getInfo();
            // 获取部门信息
            this.getSectionData();
        },
        components: {
            'v-img-upload': baseImgUpload
        }
    };
});
'use strict';
define([
    'text!attestation.html',
    'ServerAPI',
    'baseProgress',
    'baseImgUpload',
    'css!/container/attestation/attestation.css'
], function (
    tpl,
    ServerAPI,
    baseProgress,
    baseImgUpload
) {
    return {
        template: tpl,
        data: function () {
            // 验证身份证的方法
            var validateID = function (rule, value, callback) {
                var idReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                if (!value) {
                    return callback(new Error("请输入身份证号"));
                } else if (idReg.test(value) == false) {
                    return callback(new Error("请输入正确的身份证号"));
                } else {
                    callback();
                }
            };
            return {
                // 认证结果
                result: {},
                // 是否已经认证了
                isPlacehold: false,
                // 当前在第几步
                step: 0,
                // 步骤进度的文字
                progressText: ["身份认证", "资质认证", "完成"],
                // 显示认证流程
                showRenZhen: true,
                // 显示认证结果
                showRenZhenResult: false,
                // 部门列表
                positionList: [],
                // 身份认证的数据
                userRenZhen: {
                    realName: "",
                    certificateType: "",
                    certificateNumber: ""
                },
                // 医师认证
                physicianZhenPhoto: {
                    subject: [],
                    position: ''
                },
                // 身份证图片
                file: '',
                // 医师执业注册证图片
                registrationFile: '',
                // 医生职称证图片
                certificateFile: '',
                // 证件类型
                idTypeOption: [{
                    text: "身份证",
                    value: "0"
                }],
                // 部门名称
                departmentName: '',
                // 验证规则
                rules: {
                    // 真实姓名验证
                    realName: [{
                            required: true,
                            message: "请填写姓名",
                            trigger: "blur"
                        },
                        {
                            min: 2,
                            max: 15,
                            message: "请填写真实的姓名",
                            trigger: "blur"
                        }
                    ],
                    // 证件类型
                    certificateType: [{
                        required: true,
                        message: "请选择证件类型",
                        trigger: "change"
                    }],
                    // 证件类型的号码验证
                    certificateNumber: [{
                            required: true,
                            message: "请输入身份证号",
                            trigger: "blur"
                        },
                        {
                            min: 15,
                            max: 18,
                            message: "身份证号长度不正确",
                            trigger: "blur"
                        },
                        {
                            validator: validateID,
                            trigger: "blur"
                        }
                    ],
                    subject: [{
                        required: true,
                        message: "请输入所在部门",
                        trigger: "blur"
                    }]
                },
                flag: true
            };
        },
        computed: {
            // 认证的结果的图片
            resultImgPath: function () {
                switch (this.result.reviewState) {
                    case 0:
                        return '/images/passing.png';

                    case 1:
                        return '/images/pass.png';

                    case 2:
                        return '/images/unpass.png';

                    default:
                        break;
                }
            },
            // 认证结果
            renZhenResult: function () {
                switch (this.result.reviewState) {
                    case 0:
                        return '审核中';
                    case 1:
                        return '通过';
                    case 2:
                        return '驳回';
                    default:
                        break;
                }
            },
            // 认证时间
            createTime: function () {
                return this.dateFormat(new Date(Number(this.result.createTime)), 'yyyy-MM-dd hh:mm:ss');
            },
            // 审核时间
            updateTime: function () {
                return this.dateFormat(new Date(Number(this.result.updateTime)), 'yyyy-MM-dd hh:mm:ss');
            }
        },
        components: {
            "v-progress": baseProgress,
            "v-upload": baseImgUpload
        },
        methods: {
            // 将部门id转化为部门名称
            _departmentIdToName: function (departmentIdArr, subjectList) {
                // 部门名称数组
                var departmentNameArr = [];
                for (var i = 0; i < departmentIdArr.length; i++) {
                    var departId = departmentIdArr[i];
                    for (var j = 0; j < subjectList.length; j++) {
                        if (subjectList[j].id == departId) {
                            departmentNameArr.push(subjectList[j].departmentName);
                        }
                    }
                }
                return departmentNameArr.join(',')
            },
            // 获取身份证的图片资源
            fileChange: function (value) {
                this.file = value;
            },
            // 医师执业注册证图片
            registrationFileChange: function (value) {
                this.registrationFile = value;
            },
            // 医生职称证图片
            certificateFileChange: function (value) {
                this.certificateFile = value;
            },
            // 重新认证
            againRenZhen: function () {
                // 认证流程
                this.showRenZhen = true;
                // 认证结果
                this.showRenZhenResult = false;
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
            // 提交身份认证信息
            submitId: function (formName) {
                if (this.flag) {
                    this.$refs[formName].validate(function (valid) {
                        // 验证是否已经准备号上传图片
                        var checkImg = this.$refs.fileUpload.checkImg();
                        if (valid && checkImg) {
                            this.flag = false;
                            var formData = new FormData();
                            formData.append('realName', this.userRenZhen.realName);
                            formData.append('certificateType', this.userRenZhen.certificateType);
                            formData.append('certificateNumber', this.userRenZhen.certificateNumber);
                            formData.append('file', this.file);
                            var result = ServerAPI.userRenZhen(formData);
                            result.then(function (res) {
                                this.flag = true;
                                // 如果状态不为0，表示有错误
                                if (res.status == 200) {
                                    this.step++;
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
                        } else {
                            return false;
                        }
                    }.bind(this));
                }
            },
            // 提交医师认证信息
            submitZiZhi: function (formName) {
                if (this.flag) {
                    this.$refs[formName].validate(function (valid) {
                        // 验证是否已经准备号上传图片
                        var checkImg = this.$refs.registrationFileUpload.checkImg();
                        if (valid && checkImg) {
                            this.flag = false;
                            var formData = new FormData();
                            formData.append('departmentId', this.physicianZhenPhoto.subject.join(','));
                            formData.append('position', this.physicianZhenPhoto.position);
                            formData.append('registrationFile', this.registrationFile);
                            formData.append('certificateFile', this.certificateFile);
                            var result = ServerAPI.ziZhiRenZhen(formData);
                            result.then(function (res) {
                                this.flag = true;
                                // 如果状态不为0，表示有错误
                                if (res.status == 200) {
                                    this.step++;
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
            // 获取认证结果
            getResult: function () {
                // 获取部门数据
                var sectionResult = ServerAPI.getSectionData();
                // 获取认证结果
                var renZhenResult = ServerAPI.renZhenResult();
                // 监听两个异步
                Promise.all([sectionResult, renZhenResult]).then(function (results) {
                    this.flag = true;
                    if (results[0].status == 200 && results[1].status == 200) {
                        // 部门数据
                        this.positionList = (function (list) {
                            var arr = [];
                            for (var i = 0; i < list.length; i++) {
                                arr.push(list[i]);
                            }
                            return arr;
                        })(results[0].content);
                        console.log('aaaaaa', this.positionList);
                        // 认证的结果
                        this.result = results[1].content;
                        if (results[1].content === null) {
                            console.log('null');
                            // 认证结果里有数据
                            // 已经提交了认证
                            // 认证流程
                            this.showRenZhen = true;
                            // 认证结果
                            this.showRenZhenResult = false;
                        } else {
                            if (results[1].content.reviewState == 3) {
                                console.log(3);
                                // 认证流程
                                this.showRenZhen = true;
                                // 认证结果
                                this.showRenZhenResult = false;
                                // 正在认证，第几步
                                this.step = results[1].content.reviewState == 3 ? 1 : 0;
                            } else {
                                // 认证流程
                                this.showRenZhen = false;
                                // 认证结果
                                this.showRenZhenResult = true;
                            }
                        }

                        // 将部门id列表转为部门名称
                        var positionArrId = this.result.departmentId.split(',');
                        this.departmentName = this._departmentIdToName(positionArrId, this.positionList);
                    }
                }.bind(this)).catch(function (err) {
                    this.flag = true;
                    if (err.statusText == 'timeout') {
                        this.$alert('请求超时，请刷新页面', '提示', {
                            confirmButtonText: "确定",
                            callback: function (action) {}
                        });
                    }
                }.bind(this));
            }
        },
        created: function () {
            // 是否去获取认证的结果
            this.getResult();
        }
    }
})
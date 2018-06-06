'use strict';
define([
    'text!./organizationEdit.html',
    'ServerAPI',
    'css!/container/organizationEdit/organizationEdit.css'
], function (
    tpl,
    ServerAPI
) {
    return {
        template: tpl,
        data: function () {
            return {
                // form数据
                formData: {
                    departmentName: '',
                    status: '0',
                    principle: '',
                    departmentPhone: '',
                    address: '',
                    remarks: ''
                },
                // 父部门
                parentDepartmentName: '',
                // 父亲部门的id
                parentId: '',
                rules: {},
                // 防止重复提交
                flag: true,
                // 所有部门信息
                allPostionData: [],
                flag: true,
                radioDisabled: true //是否禁止编辑状态   true是禁用，false是可用
            };
        },
        /**
         * 在浏览器中用户可以刷新网页
         * 刷新网页后，状态就清除掉了
         * 如果在手机端就不会有这个问题
         */
        // computed: {
        //     subjectArr: function () {
        //         return this.$store.state.subjectArr;
        //     }
        // },
        methods: {
            checkDepartmentName: function (rule, value, callback) {
                var inArr = (function (data, value) {
                    var result = false;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i] == value) {
                            result = true;
                        }
                    }
                    return result;
                }.bind(this))(this.allPostionData, value);
                if (inArr) {
                    callback(new Error("该部门已经存在，请重新填写部门名称"));
                } else {
                    callback();
                }
            },
            // 保存
            save: function (formName) {
                this.$refs[formName].validate(function (valid) {
                    if (valid) {
                        if (this.$route.params.id) {
                            this.editSave()
                        } else {
                            this.addSave()
                        }
                    }
                }.bind(this))
            },
            // 编辑保存
            editSave: function () {
                if (this.flag) {
                    this.flag = false;
                    var result = ServerAPI.editSectionInfo(this.formData);
                    var setAllow = ServerAPI.setAllow({
                        ids: this.$route.params.childArr.split('/').join(',')
                    });
                    Promise.all([result, setAllow]).then(function (results) {
                        this.flag = true;
                        if (results[0].status == 200 && results[1].status == 200) {
                            this.$alert('提交成功','提示', {
                                confirmButtonText: '确定',
                                callback: function (action) {
                                    history.go(-1);
                                }
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
            // 新增保存
            addSave: function () {
                if (this.flag) {
                    this.flag = false;
                    var sendData = this.formData;
                    // 带上父节点的id
                    sendData.parentId = this.parentId;
                    var result = ServerAPI.addSectionInfo(sendData);
                    result.then(function (res) {
                        this.flag = true;
                        if (res.status == '200') {
                            this.$alert('提交成功', '提示',{
                                confirmButtonText: '确定',
                                callback: function (action) {
                                    history.go(-1);
                                }
                            });
                        }
                    }.bind(this));
                }
            },
            // 取消保存
            cancel: function () {
                // 回退
                history.go(-1);
            },
            // 获取本部门的信息
            getSectionInfo: function () {
                var result = ServerAPI.getSectionInfo({
                    id: this.$route.params.id
                });
                result.then(function (res) {
                    if (res.status === 200) {
                        this.formData = res.content;
                        this.parentId = res.content.parentId;
                        // 根据父亲部门的id获取父亲部门的名称
                        this.getParentSection(res.content.parentId);
                    }else {
                        this.$alert(res.message,'提示', {
                            confirmButtonText: '确定'
                        });
                    }
                }.bind(this))
            },
            // 获取本部门父部门的信息
            getParentSection: function (id) {
                var result = ServerAPI.getSectionInfo({
                    id: id
                });
                result.then(function (res) {
                    console.log('副部们', res);
                    if (res.status === 200) {
                        // 如果是最顶级的部门，它的父亲部门信息就是空的
                        if ('content' in res) {
                            this.parentDepartmentName = res.content.departmentName;
                            if (res.content.status == '1') {
                                this.radioDisabled = true;
                            }
                            if (res.content.status == '0') {
                                this.radioDisabled = false;
                            }
                        } else {
                            this.radioDisabled = false;
                        }

                        console.log(this.radioDisabled);
                    }else {
                        this.$alert(res.message,'提示', {
                            confirmButtonText: '确定'
                        });
                    }
                }.bind(this))
            },
            // 获取所有部门数据
            getSectionData: function () {
                var result = ServerAPI.getSectionData();
                result.then(function (res) {
                    if (res.status == 200) {
                        if (res.content) {
                            this.allPostionData = (function (data) {
                                var arr = [];
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].parentId == this.$route.params.parentId) {
                                        arr.push(data[i].departmentName);
                                    }
                                }
                                return arr;
                            }.bind(this))(res.content);
                            console.log('所有的子部门', this.allPostionData);
                        }
                    }else {
                        this.$alert(res.message, '提示', {
                            confirmButtonText: "确定",
                            callback: function (action) {}
                        });
                    }
                }.bind(this));
            }
        },
        created: function () {
            // 获取所有部门的数据
            this.getSectionData();
            // 如果进入的编辑页面
            if (this.$route.name == 'organizationEdit') {
                //  获取部门的基本信息
                this.getSectionInfo();
                // 编辑的验证规则
                this.rules = {
                    departmentName: [{
                        required: true,
                        message: '部门名称不能为空',
                        trigger: 'blur'
                    }]
                }
            };
            // 如果进入的是添加页面
            if (this.$route.name == 'organizationAdd') {
                // 添加的验证规则
                this.rules = {
                    departmentName: [{
                        required: true,
                        message: '请输入部门名称',
                        trigger: 'blur'
                    }, {
                        validator: this.checkDepartmentName,
                        trigger: "blur"
                    }]
                }
                this.parentId = this.$route.params.parentId;
                this.getParentSection(this.parentId);
            };
        }
    };
});
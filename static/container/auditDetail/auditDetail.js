'use strict';
define([
    'text!./auditDetail.html',
    'ServerAPI',
    'css!/container/auditDetail/auditDetail.css'
], function (
    tpl,
    ServerAPI
) {
    return {
        template: tpl,
        data: function () {
            return {
                baseDetail: {},
                //table数据
                tableData: {
                    data: [],
                    currentPage: 1, //当前是第几页的数据
                    total: 0, //总共多少条数据
                    pageSize: 10, //每页的多少条数据
                },
                textarea: '',
                dialogVisible: false,
                reviewState: 0,
                flag: true,
                departmentName: '', //科室，部门名称
                positionList: [], //部门列表
                // 路由值
                userId: '',
                id: ''
            };
        },
        computed: {
            createTime: function () {
                var dateFormat = function (date, format) {
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
                };

                if (this.baseDetail.createTime) {
                    return dateFormat(new Date(this.baseDetail.createTime), 'yyyy-MM-dd hh:mm:ss');
                } else {
                    return '';
                }
            }
        },
        methods: {
            // 证件类型转化
            certificateType: function (row) {
                switch (row.certificateType) {
                    case '0':
                        return '身份证';
                    default:
                        return '身份证'
                }
            },
            reviewFormat: function (row) {
                switch (row.reviewState) {
                    case 0:
                        return '未审核'
                    case 1:
                        return '审核通过'
                    case 2:
                        return '审核未通过';

                    default:
                        return '';
                }
            },
            // table日期格式化
            dateCreateTime: function (row, column) {
                var dateFormat = function (date, format) {
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
                };

                if (row.createTime) {
                    return dateFormat(new Date(row.createTime), 'yyyy-MM-dd hh:mm:ss');
                } else {
                    return '';
                }
            },
            // table日期格式化
            dateUpdateTime: function (row, column) {
                var dateFormat = function (date, format) {
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
                };

                if (row.updateTime) {
                    return dateFormat(new Date(row.updateTime), 'yyyy-MM-dd hh:mm:ss');
                } else {
                    return '';
                }
            },
            // 切换分页
            handleCurrentChange: function (val) {
                this.tableData.currentPage = val;
                this.auditLog();
            },

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
            // 获取用户的信息
            getInfo: function (id) {
                var userInfo = ServerAPI.getOtherInfo({
                    id: id
                });
                // 获取部门数据
                var sectionResult = ServerAPI.getSectionData();
                Promise.all([userInfo, sectionResult]).then(function (results) {
                    if (results[0].status == 200 && results[1].status == 200) {
                        // 用户的认证信息
                        this.baseDetail = results[0].content;
                        // 部门数据
                        this.positionList = (function (list) {
                            var arr = [];
                            for (var i = 0; i < list.length; i++) {
                                arr.push(list[i]);
                            }
                            return arr;
                        })(results[1].content);
                        // 将部门id列表转为部门名称
                        var positionArrId = this.baseDetail.departmentId.split(',');
                        this.departmentName = this._departmentIdToName(positionArrId, this.positionList);
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
            // 提交通过审核建议
            submitSuggest: function () {
                if (this.flag) {
                    this.flag = false;
                    ServerAPI.suggestAudit({
                        id: this.id,
                        reviewState: this.reviewState,
                        reviewRemark: this.textarea
                    }).then(function (res) {
                        this.flag = true;
                        if (res.status == 200) {
                            this.dialogVisible = false;
                            this.$alert('提交成功', '提示',{
                                confirmButtonText: '确定',
                                callback: function (action) {
                                    history.go(-1);
                                }.bind(this)
                            });
                        } else {
                            this.$alert(res.message, '提示', {
                                confirmButtonText: '确定',
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
            // 显示意见窗
            showSuggest: function (num) {
                this.dialogVisible = true;
                this.reviewState = num;
            },
            // 获取人认证记录
            auditLog: function () {
                ServerAPI.auditLog({
                    pageId: this.tableData.currentPage,
                    userId: this.userId
                }).then(function (res) {
                    if (res.status == 200) {
                        this.tableData.data = res.content;
                        console.log(this.tableData.data);
                        this.tableData.currentPage = res.page.pageId;
                        this.tableData.total = res.page.totalElements;
                        this.tableData.pageSize = res.page.size;
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
                }.bind(this))
            }
        },
        created: function () {
            console.log(this.$route.name);
            if (this.$route.name == 'auditDetailWait') {
                this.id = this.$route.params.waitId;
                this.userId = this.$route.params.waitUserId;
            }
            if (this.$route.name == 'auditDetailYet') {
                this.id = this.$route.params.yetId;
                this.userId = this.$route.params.yetUserId;
            }
            this.getInfo(this.id);
            this.auditLog();
        }
    };
});
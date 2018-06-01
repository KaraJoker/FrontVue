'use strict';
define([
    'text!./personManage.html',
    'ServerAPI',
    'css!/container/personManage/personManage.css'
], function (
    tpl,
    ServerAPI
) {
    return {
        template: tpl,
        data: function () {
            return {
                isSearchShow: true, //搜索栏是否收起
                searchObj: { //搜索的关键字
                    mobile: '',
                    realName: '',
                    subject: '',
                    status: '', //状态
                    pageId: ''
                },
                // 部门列表
                subjectList: [],
                //table数据
                tableData: {
                    data: [],
                    currentPage: 1, //当前是第几页的数据
                    total: 0, //总共多少条数据
                    pageSize: 10, //每页的多少条数据
                },
                flag: true
            };
        },
        methods: {
            // 部门
            departmentId: function (row) {
                // 部门名称数组
                var departmentNameArr = [];
                // 本人员部门id
                var departmentIdArr = row.departmentId;
                // 所有的部门数据
                var subjectList = this.subjectList;
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
            // 切换分页
            handleCurrentChange: function (val) {
                this.searchObj.pageId = val;
                this.search();
            },
            // 切换搜索栏的展开和收起
            toggleSearchShow: function () {
                this.isSearchShow = !this.isSearchShow;
            },
            // 根据过滤条件，重新搜索table数据
            search: function () {
                if (this.flag) {
                    this.flag = false;
                    // 设置链接
                    this.$router.push({
                        path: this.$route.path,
                        query: {
                            mobile: this.searchObj.mobile || '',
                            realName: this.searchObj.realName || '',
                            subject: this.searchObj.subject || '',
                            status: this.searchObj.status,
                            pageId: this.searchObj.pageId
                        }
                    });


                    var sendObj = (function () {
                        var obj = {};
                        if (this.searchObj.mobile) {
                            obj.mobile = this.searchObj.mobile;
                        }
                        if (this.searchObj.realName) {
                            obj.realName = this.searchObj.realName;
                        }
                        if (this.searchObj.subject) {
                            obj.subject = this.searchObj.subject;
                        }
                        if (this.searchObj.status) {
                            obj.status = this.searchObj.status;
                        }
                        if (this.searchObj.pageId) {
                            obj.pageId = this.searchObj.pageId;
                        }
                        return obj;
                    }.bind(this))()

                    var result = ServerAPI.userListSearch(sendObj);
                    result.then(function (res) {
                        this.flag = true;
                        if (res.status === 200) {
                            this.searchObj.pageId = res.page.pageId;
                            this.tableData.data = res.content;
                            this.tableData.currentPage = res.page.pageId; //当前是第几页的数据
                            this.tableData.total = res.page.totalElements; //总共多少条数据
                            this.tableData.pageSize = res.page.size; //每页的多少条数据
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
            // 点击设置权限
            setPower: function (row) {
                this.$router.push({
                    name: 'setPower',
                    params: {
                        id: row.id
                    }
                });
            },
            // 点击编辑
            editData: function (row) {
                this.$router.push({
                    name: 'personManageEdit',
                    params: {
                        id: row.id
                    }
                });
            },
            // 点击添加
            add: function () {
                this.$router.push({
                    name: 'personManageAdd'
                });
            },
            // 删除一条数据
            deleteData: function (index, row, current) {
                console.log(index, row, current);
                this.$confirm('确认删除本条数据', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    var result = ServerAPI.deleteUser({
                        id: current.id
                    });
                    result.then(function (res) {
                        if (res.status == 200) {
                            row.splice(index, 1);
                            this.$alert('删除成功', {
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
                }.bind(this)).catch(function () {}.bind(this));
            },
            // 初始页面查询数据
            initSearch: function () {
                this.searchObj.mobile = this.$route.query.mobile || '';
                this.searchObj.realName = this.$route.query.realName || '';
                this.searchObj.subject = this.$route.query.subject || '';
                this.searchObj.status = this.$route.query.status || '';
                this.searchObj.pageId = this.$route.query.pageId || 1;
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
                        })(res.content)
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
            // table日期格式化
            birthday: function (row, column) {
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
                return dateFormat(new Date(row.birthday), 'yyyy-MM-dd');
            },
            // 格式化创建时间
            createTime: function (row, column) {
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
                return dateFormat(new Date(row.createTime), 'yyyy-MM-dd hh:mm:ss');
            },
            status: function (row) {
                if (row.status == false) {
                    return '禁用'
                }
                if (row.status == true) {
                    return '启用'
                }
            },
            gender: function (row) {
                if (row.gender == 1) {
                    return '男'
                }
                if (row.gender == 0) {
                    return '女'
                }
            }
        },
        created: function () {
            // 将浏览器导航的数据放到页面的数据中心中
            this.initSearch();
            // 获取部门数据
            this.getSectionData();
            this.search();
        }

    };
});
'use strict';
define([
    'text!./audit.html',
    'ServerAPI',
    'css!/container/audit/audit.css'
], function (
    tpl,
    ServerAPI
) {
    return {
        template: tpl,
        data: function () {
            return {
                isSearchShow: true, //搜索栏是否收起
                //等待审核
                waitAuditSearchObj: {
                    time: '',
                    account: '',
                    pageId: 1
                },
                waitAuditTableData: {
                    data: [],
                    currentPage: 1, //当前是第几页的数据
                    total: 0, //总共多少条数据
                    pageSize: 10, //每页的多少条数据
                },
                //已经审核
                yetAuditSearchObj: {
                    time: '',
                    account: '',
                    result: '',
                    pageId: 1
                },
                yetAuditTableData: {
                    data: [],
                    currentPage: 1, //当前是第几页的数据
                    total: 0, //总共多少条数据
                    pageSize: 10, //每页的多少条数据
                },
                activeName: '待审核',
                waitflag: true,
                yetflag: true
            };
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
            // table日期格式化
            date: function (row, column) {
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
            // 切换分页
            handleCurrentChange: function (val) {
                if (this.activeName == '待审核') {
                    this.waitAuditTableData.currentPage = val;
                    this.waitAuditSearchObj.pageId = val;
                    this.searchAttestation();
                } else {
                    this.yetAuditTableData.currentPage = val;
                    this.yetAuditSearchObj.pageId = val;
                    this.searchAudit();
                }
            },
            // 切换搜索栏的展开和收起
            toggleSearchShow: function () {
                this.isSearchShow = !this.isSearchShow;
            },
            // 点击审核按钮
            shenHeWait: function (row) {
                this.$router.push({
                    name: 'auditDetailWait',
                    params: {
                        waitUserId: row.userId,
                        waitId: row.id
                    }
                })
            },
            // 点击详情按钮
            shenHeYet: function (row) {
                console.log(row);
                this.$router.push({
                    name: 'auditDetailYet',
                    params: {
                        yetId: row.id,
                        yetUserId: row.userId,
                        type: 1
                    }
                })
            },
            // 待审核列表
            searchAttestation: function () {
                if (this.waitflag) {
                    this.waitflag = false;
                    // 设置链接
                    this.$router.push({
                        path: this.$route.path,
                        query: {
                            time: this.waitAuditSearchObj.time || '',
                            account: this.waitAuditSearchObj.account || '',
                            pageId: this.waitAuditSearchObj.pageId || 1
                        }
                    })
                    var sendObj = (function () {
                        var obj = {};
                        if (this.waitAuditSearchObj.time) {
                            obj.startTime = this.waitAuditSearchObj.time[0];
                            obj.endTime = this.waitAuditSearchObj.time[1];
                        }
                        if (this.waitAuditSearchObj.account) {
                            obj.userMobile = this.waitAuditSearchObj.account;
                        }
                        if (this.waitAuditSearchObj.pageId) {
                            obj.pageId = this.waitAuditSearchObj.pageId;
                        }
                        return obj;
                    }.bind(this))()

                    var result = ServerAPI.waitAudit(sendObj);
                    result.then(function (res) {
                        this.waitflag = true;
                        if (res.status == 200) {
                            this.waitAuditSearchObj.pageId = res.page.pageId;
                            this.waitAuditTableData.data = res.content;
                            this.waitAuditTableData.currentPage = res.page.pageId; //当前是第几页的数据
                            this.waitAuditTableData.total = res.page.totalElements; //总共多少条数据
                            this.waitAuditTableData.pageSize = res.page.size; //每页的多少条数据
                        }else {
                            this.$alert(res.message, '提示', {
                                confirmButtonText: "确定",
                                callback: function (action) {}
                            });
                        }
                    }.bind(this)).catch(function (err) {
                        this.waitflag = true;
                        if (err.statusText == 'timeout') {
                            this.$alert('请求超时，请重新操作', '提示', {
                                confirmButtonText: "确定",
                                callback: function (action) {}
                            });
                        }
                    }.bind(this));
                }
            },
            // 已经审核列表
            searchAudit: function () {
                if (this.yetflag) {
                    this.yetflag = false;
                    // 设置链接
                    this.$router.push({
                        path: this.$route.path,
                        query: {
                            time: this.yetAuditSearchObj.time || '',
                            account: this.yetAuditSearchObj.account || '',
                            result: this.yetAuditSearchObj.result || '',
                            pageId: this.yetAuditSearchObj.pageId || 1
                        }
                    })
                    var sendObj = (function () {
                        var obj = {};
                        if (this.yetAuditSearchObj.time.length > 0) {
                            obj.startTime = this.yetAuditSearchObj.time[0];
                            obj.endTime = this.yetAuditSearchObj.time[1];
                        }
                        if (this.yetAuditSearchObj.account) {
                            obj.userMobile = this.yetAuditSearchObj.account;
                        }
                        console.log(this.yetAuditSearchObj.result);
                        if (this.yetAuditSearchObj.result) {
                            obj.reviewState = this.yetAuditSearchObj.result;
                        }
                        if (this.yetAuditSearchObj.pageId) {
                            obj.pageId = this.yetAuditSearchObj.pageId;
                        }
                        return obj;
                    }.bind(this))();
                    var result = ServerAPI.yetAudit(sendObj);
                    result.then(function (res) {
                        this.yetflag = true;
                        if (res.status == 200) {
                            this.yetAuditSearchObj.pageId = res.page.pageId;
                            this.yetAuditTableData.data = res.content;
                            this.yetAuditTableData.currentPage = res.page.pageId; //当前是第几页的数据
                            this.yetAuditTableData.total = res.page.totalElements; //总共多少条数据
                            this.yetAuditTableData.pageSize = res.page.size; //每页的多少条数据
                        }else {
                            this.$alert(res.message, '提示', {
                                confirmButtonText: "确定",
                                callback: function (action) {}
                            });
                        }
                    }.bind(this)).catch(function (err) {
                        this.yetflag = true;
                        if (err.statusText == 'timeout') {
                            this.$alert('请求超时，请重新操作', '提示', {
                                confirmButtonText: "确定",
                                callback: function (action) {}
                            });
                        }
                    }.bind(this));
                }
            },
            // 初始页面查询数据
            initSearch: function () {
                if (this.activeName == '待审核') {
                    this.waitAuditSearchObj.account = this.$route.query.account || '';
                    this.waitAuditSearchObj.time = this.$route.query.time || '';
                    this.waitAuditSearchObj.pageId = this.$route.query.pageId || 1;
                } else {
                    this.yetAuditSearchObj.account = this.$route.query.account || '';
                    this.yetAuditSearchObj.time = this.$route.query.time || '';
                    this.yetAuditSearchObj.result = this.$route.query.result || '';
                    this.yetAuditSearchObj.pageId = this.$route.query.pageId || 1;
                }
            }
        },
        created: function () {
            // 将浏览器导航的数据放到页面的数据中心中
            this.initSearch();
            // 查询
            this.searchAttestation();
        },
        watch: {
            activeName: function (value) {
                if (value == '待审核') {
                    this.searchAttestation()
                } else {
                    this.searchAudit()
                }
            }
        }
    };
});
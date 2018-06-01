'use strict';
/**
 * 认证的结果
 */
define([
    'text!./unscramble.html',
    'ServerAPI',
    'css!/container/unscramble/unscramble.css'
], function (
    tpl,
    ServerAPI
) {
    return {
        template: tpl,
        data: function () {
            return {
                // 展开或收起搜索栏
                isSearchShow: true,
                // 查询的条件
                searchObj: {
                    reportTime: '',
                    finishTime: '',
                    patientAccount: '',
                    timeliness: '',
                    reportType: '',
                    pageId: 1 //分页数
                },
                // table数据
                tableData: {
                    data: [],
                    currentPage: 1, //当前是第几页的数据
                    total: 0, //总共多少条数据
                    pageSize: 10, //每页的多少条数据
                },
                // 选择要显示的栏目
                choiceShow: {
                    options: [{
                        value: 'report',
                        label: '报告名称'
                    }, {
                        value: 'account',
                        label: '患者账号'
                    }, {
                        value: 'name',
                        label: '姓名'
                    }, {
                        value: 'sex',
                        label: '性别'
                    }, {
                        value: 'age',
                        label: '年龄'
                    }, {
                        value: 'reportStartTime',
                        label: '报告时间'
                    }, {
                        value: 'reportEndTime',
                        label: '完成时间'
                    }, {
                        value: 'timely',
                        label: '解读及时性'
                    }],
                    showList: ['report', 'account', 'name', 'sex', 'age', 'reportStartTime', 'reportEndTime', 'timely']
                },
                flag: true
            };
        },
        computed: {
            isShowReport: function () {
                return this.checkInArray('report');
            },
            isShowAccount: function () {

                return this.checkInArray('account');
            },
            isShowName: function () {

                return this.checkInArray('name');
            },
            isShowSex: function () {

                return this.checkInArray('sex');
            },
            isShowAge: function () {

                return this.checkInArray('age');
            },
            isShowReportStartTime: function () {

                return this.checkInArray('reportStartTime');
            },
            isShowReportEndTime: function () {

                return this.checkInArray('reportEndTime');
            },
            isShowTimely: function () {
                return this.checkInArray('timely');
            },
        },
        methods: {
            // 表格过滤显示
            checkInArray: function (value) {
                if (this.choiceShow.showList.indexOf(value) !== -1) {
                    return true;
                } else {
                    return false;
                }
            },
            // 切换搜索框的展开和收起
            toggleSearchShow: function () {
                this.isSearchShow = !this.isSearchShow;
            },
            // 搜索按钮查询table的数据
            search: function () {
                if (this.flag) {
                    this.flag = false;
                    // 设置链接
                    this.$router.push({
                        path: this.$route.path,
                        query: {
                            reportTime: this.searchObj.reportTime || '',
                            finishTime: this.searchObj.finishTime || '',
                            patientAccount: this.searchObj.patientAccount || '',
                            timeliness: this.searchObj.timeliness || '',
                            reportType: this.searchObj.reportType || '',
                            pageId: this.searchObj.pageId || 1
                        }
                    })
                    // 准备发送给服务器的数据
                    var sendObj = {};

                    if (this.searchObj.reportTime) {
                        sendObj.reportStart = this.searchObj.reportTime[0];
                        sendObj.reportEnd = this.searchObj.reportTime[1];
                    }
                    if (this.searchObj.finishTime) {
                        sendObj.finishStart = this.searchObj.finishTime[0];
                        sendObj.finishEnd = this.searchObj.finishTime[1];
                    }

                    if (this.searchObj.patientAccount) {
                        sendObj.patientAccount = this.searchObj.patientAccount;
                    }

                    if (this.searchObj.timeliness) {
                        sendObj.timeliness = this.searchObj.timeliness;
                    }

                    if (this.searchObj.reportType) {
                        sendObj.reportType = this.searchObj.reportType;
                    }

                    if (this.searchObj.pageId) {
                        sendObj.pageId = this.searchObj.pageId;
                    }

                    var result = ServerAPI.getReportTableSearch(sendObj);

                    result.then(function (res) {
                        this.flag = true;
                        if (res.status == 200) {
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
            // 点击立即诊断按钮
            diagnose: function (row) {
                this.$router.push({
                    name: 'reportDetail',
                    params: {
                        reportId: row.id
                    }
                });
            },
            // 点击报告详情按钮
            detail: function (row) {
                this.$router.push({
                    name: 'reportDetail',
                    params: {
                        reportId: row.id
                    }
                });
            },
            // 分页点击查询table数据
            handleCurrentChange: function (val) {
                this.searchObj.pageId = val;
                this.search()
            },
            // 初始页面查询数据
            initSearch: function () {
                this.searchObj.reportTime = this.$route.query.reportTime || '';
                this.searchObj.finishTime = this.$route.query.finishTime || '';
                this.searchObj.patientAccount = this.$route.query.patientAccount || '';
                this.searchObj.timeliness = this.$route.query.timeliness || '';
                this.searchObj.reportType = this.$route.query.reportType || '';
                this.searchObj.pageId = this.$route.query.pageId || 1;
            },

            // 开始日期格式化
            reportTime: function (row, column) {
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

                return dateFormat(new Date(row.reportTime), 'yyyy-MM-dd hh:mm:ss');
            },
            // 开始日期格式化
            finishTime: function (row, column) {
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

                return dateFormat(new Date(row.finishTime), 'yyyy-MM-dd hh:mm:ss');
            },
            timeliness: function (row) {
                switch (row.timeliness + '') {
                    case '0':
                        return '超时';
                    case '1':
                        return '及时';
                    default:
                        return '未知';
                }
            }
        },
        created: function () {
            // 将浏览器导航的数据放到页面的数据中心中
            this.initSearch();
            // 页面初始化的时候，获取表格数据
            this.search(this.searchObj);
        }
    }
})
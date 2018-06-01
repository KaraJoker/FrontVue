'use strict';
define([
    'text!./reportThermometer.html',
    'ServerAPI',
    'mixins',
    'css!/container/reportThermometer/reportThermometer.css'
], function (
    tpl,
    ServerAPI,
    mixins
) {
    return {
        template: tpl,
        data: function () {
            return {
                flag: true,
                isSearchShow: true,
                searchObj: {
                    date: '',
                    roleId: '',
                    pageId: 1
                },
                tableData: {
                    data: [],
                    currentPage: 1, //当前是第几页的数据
                    total: 0, //总共多少条数据
                    pageSize: 10, //每页的多少条数据
                },
                // 选择要显示的栏目
                choiceShow: {
                    options: [{
                        value: 'reportId',
                        label: '报告名称'
                    }, {
                        value: 'userPhone',
                        label: '患者账号'
                    }, {
                        value: 'userName',
                        label: '姓名'
                    }, {
                        value: 'userGender',
                        label: '性别'
                    }, {
                        value: 'userAge',
                        label: '年龄'
                    }, {
                        value: 'startTime',
                        label: '报告时间'
                    }, {
                        value: 'reportStateTime',
                        label: '解读及时性'
                    }],
                    showList: ['reportId', 'userPhone', 'userName', 'userGender', 'userAge', 'startTime', 'reportStateTime']
                }
            };
        },

        computed: {
            isShowReport: function () {
                return this.checkInArray('reportId');
            },
            isShowAccount: function () {
                return this.checkInArray('userPhone');
            },
            isShowName: function () {
                return this.checkInArray('userName');
            },
            isShowSex: function () {
                return this.checkInArray('userGender');
            },
            isShowAge: function () {
                return this.checkInArray('userAge');
            },
            isShowReportStartTime: function () {
                return this.checkInArray('startTime');
            },
            isShowTimely: function () {
                return this.checkInArray('reportStateTime');
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
            // 获取未完成的数据
            getUnfinished: function () {
                // 获取未完成的数据
                var unfinishedData = ServerAPI.getReportTableUnfinished({
                    page: this.searchObj.pageId,
                    startTime: this.searchObj.date[0] || '',
                    endTime: this.searchObj.date[1] || '',
                    roleId: this.searchObj.roleId || '',
                    doctorId: sessionStorage.getItem('doctorId')
                });
                unfinishedData.then(function (res) {
                    if (res.status == 0) {
                        var content = res.content;
                        if (content.length > 0) {
                            // this.tableData.data = content;
                            this.$alert('您有未处理完成的报告,请继续处理', '温馨提示', {
                                confirmButtonText: '确定',
                                showClose: false,
                                callback: function (action) {
                                    this.$router.push({
                                        name: 'reportDetailDeal',
                                        params: {
                                            reportId: content[0].id,
                                            doctorId: sessionStorage.getItem('doctorId'),
                                            type: content[0].type,
                                        }
                                    });
                                }.bind(this)
                            });
                        }
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
            },
            // 搜索按钮查询table的数据
            searchTableData: function () {
                if (this.flag) {
                    this.flag = false;
                    // 设置链接
                    this.$router.push({
                        path: this.$route.path,
                        query: {
                            page: this.searchObj.pageId,
                            date: this.searchObj.date,
                            roleId: this.searchObj.roleId || '',
                        }
                    })
                    // 正常数据
                    var result = ServerAPI.getReportTableEcg({
                        page: this.searchObj.pageId,
                        startTime: this.searchObj.date[0] || '',
                        roleId: this.searchObj.roleId || '',
                        endTime: this.searchObj.date[1] || ''
                    });
                    result.then(function (res) {
                        this.flag = true;
                        if (res.status == 0) {
                            this.tableData = {
                                data: res.content,
                                currentPage: res.page.number, //当前是第几页的数据
                                total: res.page.size, //总共多少条数据
                                pageSize: 10, //每页的多少条数据
                            };
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
            },
            // 点击立即诊断按钮
            diagnose: function (row) {
                this.$router.push({
                    name: 'reportDetailDeal',
                    params: {
                        reportId: row.id,
                        doctorId: sessionStorage.getItem('doctorId'),
                        type: row.type
                    }
                });
            },
            // 点击查看报告详情按钮
            detail: function (row) {
                this.$router.push({
                    name: 'reportDetailSee',
                    params: {
                        reportId: row.id,
                        type: row.type
                    }
                });
            },
            // 分页点击查询table数据
            handleCurrentChange: function (val) {
                this.searchObj.pageId = val;
                this.searchTableData();
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
                return dateFormat(new Date(row.startTime), 'yyyy-MM-dd hh:mm:ss');
            },
            // table等待小时数
            dateHour: function (row) {
                var getInervalHour = function (startDate, endDate) {
                    var ms = endDate.getTime() - startDate.getTime();
                    if (ms < 0) return 0;
                    return Math.floor(ms / 1000 / 60 / 60) + '小时';
                };
                return getInervalHour(new Date(row.reportStateTime), new Date());
            },
            // table男女
            gender: function (row) {
                if (row.userGender == '1') {
                    return '男';
                } else {
                    return '女';
                }
            },
            // 初始页面查询数据
            initSearch: function () {
                this.searchObj.page = this.$route.query.pageId || '';
                this.searchObj.date = this.$route.query.date || '';
                this.searchObj.roleId = this.$route.query.roleId || '';
            }
        },

        created: function () {
            // 将浏览器导航的数据放到页面的数据中心中
            this.initSearch();
            // 获取未完成的报告数据
            this.getUnfinished();
            // 获取待诊断的报告数据
            this.searchTableData();
        }
    };
});
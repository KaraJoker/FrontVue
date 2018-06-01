'use strict';
define([
    'text!./systemLog.html',
    'ServerAPI',
    'css!/container/systemLog/systemLog.css'
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
                    time: '', //创建时间
                    operator: '', //操作人
                    operateAccount: '',
                    pageId: ''
                },
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
                return dateFormat(new Date(row.operateTime), 'yyyy-MM-dd hh:mm:ss');
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
                            time: this.searchObj.time || '',
                            operator: this.searchObj.operator || '', //角色名称
                            operateAccount: this.searchObj.operateAccount || '', //状态
                            pageId: this.searchObj.pageId
                        }
                    })

                    var sendObj = (function () {
                        var obj = {};
                        if (this.searchObj.time !== null && this.searchObj.time !== '') {
                            obj.startTime = this.searchObj.time[0];
                            obj.endTime = this.searchObj.time[1];
                        }
                        if (this.searchObj.operator) {
                            obj.operator = this.searchObj.operator;
                        }
                        if (this.searchObj.operateAccount) {
                            obj.operateAccount = this.searchObj.operateAccount;
                        }
                        if (this.searchObj.pageId) {
                            obj.pageId = this.searchObj.pageId;
                        }
                        return obj;
                    }.bind(this))()

                    var result = ServerAPI.logListSearch(sendObj);
                    result.then(function (res) {
                        this.flag = true;
                        if (res.status == 200) {
                            //this.searchObj.pageId = res.page.pageId;
                            this.tableData.data = res.content;
                            this.tableData.currentPage = res.page.pageId; //当前是第几页的数据
                            this.tableData.total = res.page.totalElements; //总共多少条数据
                            this.tableData.pageSize = res.page.size; //每页的多少条数据
                        }
                    }.bind(this)).catch(function (err) {
                        this.flag = true;
                        if (err.statusText == 'timeout') {
                            this.$alert('请求超时，请重新操作', '提示',{
                                confirmButtonText: "确定",
                                callback: function (action) {}
                            });
                        }
                    }.bind(this));
                }
            },
            // 查看详情
            checkDetail: function (row) {
                console.log(row);
                this.$router.push({
                    name: 'systemLogDetail',
                    params: {
                        id: row.id
                    }
                });
            },
            // 初始页面查询数据
            initSearch: function () {
                this.searchObj.operator = this.$route.query.operator || '';
                this.searchObj.time = this.$route.query.time || '';
                this.searchObj.operateAccount = this.$route.query.operateAccount || '';
                this.searchObj.pageId = this.$route.query.pageId || 1;
            }
        },
        created: function () {
            // 将浏览器导航的数据放到页面的数据中心中
            this.initSearch();
            this.search();
        }
    };
});
'use strict';
define([
    'text!./systemNotice.html',
    'ServerAPI',
    'css!/container/systemNotice/systemNotice.css'
], function (
    tpl,
    ServerAPI
) {
    return {
        template: tpl,
        data: function () {
            return {
                isSearchShow: true, //搜索栏是否收起
                searchObj: {
                    time: '',
                    notice: '',
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
            _isSend: function (row) {
                console.log(row);
                var isSend = row.isSend;
                switch (isSend) {
                    case true:
                        return '已发送';
                    case false:
                        return '未发送';
                    default:
                        return '暂无状态'
                }
            },
            // table日期格式化
            _sendTime: function (row, column) {
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

                if (row.sendTime) {
                    return dateFormat(new Date(row.sendTime), 'yyyy-MM-dd hh:mm:ss');
                } else {
                    return '暂无时间';
                }


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
                            notice: this.searchObj.notice || '', //角色名称
                            pageId: this.searchObj.pageId
                        }
                    })
                    var sendObj = (function () {
                        var obj = {};
                        if (this.searchObj.time) {
                            obj.startTime = this.searchObj.time[0];
                            obj.endTime = this.searchObj.time[1];
                        };
                        if (this.searchObj.notice) {
                            obj.title = this.searchObj.notice;
                        }
                        obj.pageId = this.searchObj.pageId;
                        return obj;
                    }.bind(this))();
                    var result = ServerAPI.noticeList(sendObj);
                    result.then(function (res) {
                        this.flag = true;
                        if (res.status == 200) {
                            this.tableData.data = res.content;
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
            add: function () {
                this.$router.push({
                    name: 'systemNoticeAdd'
                });
            },
            // 查看详情
            checkDetail: function (row) {
                this.$router.push({
                    name: 'systemNoticeSee',
                    params: {
                        id: row.id
                    }
                });
            },
            // 查看详情
            edit: function (row) {
                this.$router.push({
                    name: 'systemNoticeEdit',
                    params: {
                        id: row.id
                    }
                });
            },
            // 查看详情
            deleteData: function (index, row, current) {
                console.log(index, row, current);
                this.$confirm('确认删除本条数据', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    var sendObj = {
                        id: current.id
                    };
                    ServerAPI.deleteNotice(sendObj).then(function (res) {
                        if (res.status == 200) {
                            row.splice(index, 1);
                            this.$alert('删除成功', '提示', {
                                confirmButtonText: '确定'
                            });
                        } else {
                            this.$alert(res.message, '提示', {
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
            _initSearch: function () {
                this.searchObj.notice = this.$route.query.notice || '';
                this.searchObj.time = this.$route.query.time || '';
                this.searchObj.pageId = this.$route.query.pageId || 1;
            }
        },
        created: function () {
            // 将浏览器导航的数据放到页面的数据中心中
            this._initSearch();
            this.search();
        }
    };
});
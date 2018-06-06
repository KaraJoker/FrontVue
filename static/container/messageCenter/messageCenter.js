'use strict';
define([
    'text!./messageCenter.html',
    'ServerAPI',
    'css!/container/messageCenter/messageCenter.css'
], function (
    tpl,
    ServerAPI
) {
    var NOT_READING = '0'; //未读
    var READING = '1'; //已读

    var TONG_ZHI = '0'; //通知
    var GONG_GAO = '1'; //公告
    return {
        template: tpl,
        data: function () {
            return {
                tableData: [],
                // 全选删除按钮
                deleteAllDisable: true,
                // 单个选中
                oneDisable: true,
                // 选中的消息
                checkedMsg: [],
                // tab选中
                activeName: '未读', //未读和通知的数字一样，没有办法，只能将未读设为文字，传递的时候再进行转化
                page: {},
                pageId: 1,
                flag: true,
                expands: [2]
            };
        },
        methods: {
            getRowKeys: function (row) {
                return row.id;
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
            // 获取消息列表
            getMsgList: function (text) {
                var sendObj = {
                    pageId: this.pageId
                };
                if (this.activeName == '未读') {
                    sendObj.isReading = NOT_READING;
                } else {
                    sendObj.type = this.activeName;
                }
                var result = ServerAPI.getMessage(sendObj);
                result.then(function (res) {
                    if (res.status === 200) {
                        this.tableData = res.content;
                        this.page = res.page;
                        this.pageId = res.page.pageId;
                    }else {
                        this.$alert(res.message,'提示', {
                            confirmButtonText: '确定'
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

            // 切换分页
            handleCurrentChange: function (val) {
                this.pageId = val;
                this.getMsgList();
            },
            // checkbox改变时候
            handleSelectionChange: function (val) {
                // 是否全选
                if (val.length == this.tableData.length) {
                    this.deleteAllDisable = false;
                } else {
                    this.deleteAllDisable = true;
                }
                // 选中一个
                console.log(val.length);
                if (val.length == 0) {
                    this.oneDisable = true;
                } else {
                    this.oneDisable = false;
                }

                this.checkedMsg = [];
                for (var i = 0; i < val.length; i++) {
                    this.checkedMsg.push(val[i]);
                }
            },
            // 删除一行数据
            deleteRow: function (index, rows) {
                this.$confirm('确定删除这条邮件', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    var result = ServerAPI.deleteMessage({
                        ids: rows[index].id
                    });
                    result.then(function (res) {
                        if (res.status == 200) {
                            rows.splice(index, 1);
                            this.$alert('删除成功', '提示',{
                                confirmButtonText: "确定",
                                callback: function (action) {}
                            });
                        }else {
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
                }.bind(this)).catch(function () {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                }.bind(this));

            },
            // 全部删除
            deleteAll: function () {
                if (this.checkedMsg.length == this.tableData.length) {
                    this.$confirm('您确定全部删除？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(function () {
                        var tableData = this.tableData;
                        var ids = function () {
                            var arr = [];
                            for (var i = 0; i < tableData.length; i++) {
                                arr.push(tableData[i].id)
                            }
                            return arr.join(',');
                        }();
                        var result = ServerAPI.deleteMessage({
                            ids: ids
                        });
                        result.then(function (res) {
                            if (res.status == 200) {
                                this.tableData = [];
                                this.$alert('全部删除成功','提示', {
                                    confirmButtonText: "确定",
                                    callback: function (action) {}
                                });
                            }else {
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
                    }.bind(this)).catch(function () {}.bind(this));
                }
            },
            // 选择了全选
            choiceAll: function (val) {
                if (val.length == this.tableData.length) {
                    this.deleteAllDisable = false;
                    this.oneDisable = false;
                } else {
                    this.oneDisable = true;
                    this.deleteAllDisable = true;
                }
                this.checkedMsg = [];
                for (var i = 0; i < val.length; i++) {
                    this.checkedMsg.push(val[i]);
                }
            },
            // 全部标记为已读
            allReaded: function () {
                this.$confirm('您确定全部标记为已读？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    this.readSet();
                }.bind(this)).catch(function () {}.bind(this));
            },

            // 已读请求
            readSet: function () {
                var checkedMsg = this.checkedMsg;
                var ids = function () {
                    var arr = [];
                    for (var i = 0; i < checkedMsg.length; i++) {
                        arr.push(checkedMsg[i].id)
                    }
                    return arr.join(',');
                }();
                var result = ServerAPI.readYet({
                    ids: ids
                });
                result.then(function (res) {
                    if (res.status == 200) {
                        for (var i = 0; i < checkedMsg.length; i++) {
                            for (var j = 0; j < this.tableData.length; j++) {
                                if (checkedMsg[i].id == this.tableData[j].id) {
                                    this.tableData[j].isReading = READING
                                }
                            }
                        }
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
                }.bind(this));
            },
            // 标记为已读
            readed: function () {
                this.readSet();
            },
            // tab点击
            tabListClick: function () {
                // 获取邮件
                this.getMsgList(this.activeName);
            },
            // 打开标记为已读
            openRow: function (row, expandedRows) {
                console.log(row);
                if (!row.isReading) {
                    var result = ServerAPI.readYet({
                        ids: row.id
                    });
                    result.then(function (res) {
                        if (res.status == 200) {
                            row.isReading = READING
                        }else {
                            this.$alert(res.message, '提示', {
                                confirmButtonText: "确定",
                                callback: function (action) {}
                            });
                        }
                    }).catch(function (err) {
                        if (err.statusText == 'timeout') {
                            this.$alert('请求超时，请刷新页面', '提示', {
                                confirmButtonText: "确定",
                                callback: function (action) {}
                            });
                        }
                    }.bind(this));
                }
            }
        },
        created: function () {
            // 获取邮件
            this.tabListClick();
        }
    };
});
'use strict';

define([
    'ServerAPI'
], function (
    ServerAPI
) {

    var SYSTEM_lIST = ['PERM_organization', 'PERM_permission', 'PERM_personage', 'PERM_logger', 'PERM_setting'];
    var REPORT_lIST = ['PERM_temperature', 'PERM_sleep', 'PERM_electrocardio'];
    var REPORT_NAV = {
        url: "/report",
        name: "报告"
    };
    var SYSTEM_NAV = {
        url: "/system",
        name: "系统管理"
    };
    return {
        template: [
            '<div class="nav">',
            '<div class="nav-list">',
            '<ul>',
            '<li v-for="item in heads" :key="item.page">',
            '<router-link :to="item.url" v-text="item.name"></router-link>',
            '</li>',
            '</ul>',
            '</div>',
            '<div class="nav-right">',
            '<div class="userInfo">',
            '<div class="userInfo-content">',
            '<div class="userPhoto">',
            '<img :src="userPhoto" alt="用户头像">',
            '</div>',
            '<span class="userName" v-text="userInfo.name" @click="changePage()">',
            '</span>',
            '<span  class="fa fa-angle-down" style="line-height: 80px;vertical-align: top;padding-left: 10px;"></span>',
            '</div>',
            '</div>',
            '<div class="queit fa fa-sign-out" @click="quit"></div>',
            '</div>',
            '<div class="clear"></div>',
            '</div>'
        ].join(''),
        data: function () {
            return {
                heads: [{
                        url: "/home",
                        name: "首页"
                    },
                    {
                        url: "/message",
                        name: "消息"
                    },
                    {
                        url: "/help",
                        name: "帮助中心"
                    }
                ],
                userInfo: {
                    url: "/userInfo",
                    name: "默认用户名"
                },
                userPhoto: "/images/avatar.png",
                flag: true
            };
        },
        methods: {
            // 获取用户的头像和名称
            getInfo: function () {
                var result = ServerAPI.getUserInfo();
                result.then(function (res) {
                    if (res.status == 200) {
                        this.userPhoto = res.content.userface;
                        this.userInfo.name = res.content.name;
                    }
                }.bind(this)).catch(function (err) {
                    if (err.statusText == 'timeout') {
                        this.$alert('请求超时，请刷新页面', '提示',{
                            confirmButtonText: "确定",
                            callback: function (action) {
                            }
                        });
                    }
                }.bind(this));
            },
            // 退出
            quit: function () {
                this.$confirm('您确定退出网站？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    if (this.flag) {
                        this.flag = false;
                        var result = ServerAPI.quit();
                        result.then(function (res) {
                            this.flag = true;
                            if (res.status == 200) {
                                sessionStorage.removeItem('zhirou_token');
                                sessionStorage.removeItem('doctorId');
                                sessionStorage.removeItem('isTemporary');
                                sessionStorage.removeItem('zhirou_role');
                                location.href = "/login.html";
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
                }.bind(this)).catch(function () {}.bind(this));
            },
            // 进入用户信息页面
            changePage: function () {
                this.$router.push({
                    name: 'userInfo'
                });
            },
            // 获取侧边栏数据
            getAside: function () {
                var navList = sessionStorage.getItem('zhirou_role').split(',');
                var addReportNav = false;
                var addSystemNav = false;
                for (var i = 0; i < navList.length; i++) {
                    if (REPORT_lIST.indexOf(navList[i]) > -1) {
                        addReportNav = true;
                    }
                    if (SYSTEM_lIST.indexOf(navList[i]) > -1) {
                        addSystemNav = true;
                    }
                }

                if (addReportNav) {
                    this.heads.splice(1, 0, REPORT_NAV)
                }
                if (addSystemNav) {
                    if (this.heads.length == 4) {
                        this.heads.splice(2, 0, SYSTEM_NAV)
                    } else {
                        this.heads.splice(1, 0, SYSTEM_NAV)
                    }
                };
            }

        },
        created: function () {
            this.getInfo();
            this.getAside();
        }
    };
});
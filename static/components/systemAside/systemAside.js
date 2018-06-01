'use strict';

define([
    'ServerAPI',
    'mixins'
], function (
    ServerAPI,
    mixins
) {
    var SYSTEM_lIST = ['PERM_organization', 'PERM_permission', 'PERM_personage', 'PERM_logger', 'PERM_setting'];
    var SYSTEM_lIST_DETAIL = {
        // 组织架构
        PERM_organization: {
            url: "/system/organization",
            name: "组织架构",
            icon: "fa fa-sitemap"
        },
        // 权限管理
        PERM_permission: {
            url: "/system/powerManage",
            name: "权限管理",
            icon: "fa fa-key"
        },
        // 人员管理
        PERM_personage: {
            url: "/system/personManage",
            name: "人员管理",
            icon: "fa fa-user-md"
        },
        // 操作日志
        PERM_logger: {
            url: "/system/systemLog",
            name: "操作日志",
            icon: "fa fa-list"
        },
        // 系统设置
        PERM_setting: {
            url: "/system/systemSet",
            name: "系统设置",
            icon: "fa fa-wrench"
        }
    }

    return {
        template: [
            '<div class="aside-nav">',
            '<div class="logo">',
            '<img v-if="logoSrc" :src="logoSrc" alt="">',
            '<img v-if="!logoSrc" src="/images/zhirou_logo.png" alt="">',
            '</div>',
            '<ul>',
            '<li v-for="item in asides" :key="item.url" v-bind:class="[item.url===asideActive? \'active\' : \'\']">',
            '<router-link :to="item.url">',
            '<i :class="item.icon"></i>',
            '<span v-text="item.name"></span>',
            '</router-link>',
            '</li>',
            '</ul>',
            '</div>'
        ].join(''),
        data: function () {
            return {
                asideActive: '',
                asides: [
                    // {
                    //     url: "/system/systemNotice",
                    //     name: "系统公告",
                    //     icon: "fa fa-newspaper-o"
                    // }
                ],
                logoSrc: ""
            };
        },
        mixins: [mixins],
        methods: {
            getLogo: function () {
                var result = ServerAPI.systemDetail();
                result.then(function (res) {
                    if (res.status == 200) {
                        // 请求服务器
                        this.logoSrc = res.content.logo;
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
            // 获取侧边栏数据
            getAside: function () {
                var navList = sessionStorage.getItem('zhirou_role').split(',');
                var arr = [];
                for (var i = 0; i < navList.length; i++) {
                    if (SYSTEM_lIST.indexOf(navList[i]) > -1) {
                        arr.push(SYSTEM_lIST_DETAIL[navList[i]])
                    }
                }
                this.asides = arr;
            },
            // 判断要跳转的地址是否有权限，如果没有权限，就转到404页面
            _go404: function (active, asides) {
                var inAsides = false;
                for (var i = 0; i < asides.length; i++) {
                    if (active == asides[i].url) {
                        inAsides = true;
                    }
                }
                if (!inAsides) {
                    location.href = "/404.html";
                }
            }
        },
        created: function () {
            this.asideActive = this.$route.meta.asideActive;
            this.getLogo();
            this.getAside();
            // 判断是否跳转到404页面
            this._go404(this.asideActive, this.asides)
        },
        beforeRouteUpdate: function (to, from, next) {
            this.asideActive = to.meta.asideActive;
            next();
        },
    };
});
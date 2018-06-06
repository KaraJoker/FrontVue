'use strict';
define([
    'ServerAPI'
], function (
    ServerAPI
) {
    var commonAside = [{
            url: "/home/reportCount",
            name: "我的首页",
            icon: "fa fa-home"
        },
        {
            url: "/home/unscramble",
            name: "我的解读",
            icon: "fa fa-clipboard"
        },
        {
            url: "/home/userInfo",
            name: "个人信息",
            icon: "fa fa-user"
        },
        {
            url: "/home/attestation",
            name: "我的认证",
            icon: "fa fa-drivers-license"
        },
        {
            url: "/home/changePwd",
            name: "修改密码",
            icon: "fa fa-lock"
        }
    ];

    const adminAside = [{
            url: "/home/reportCount",
            name: "系统首页",
            icon: "fa fa-home"
        },
        {
            url: "/home/unscramble",
            name: "报告解读",
            icon: "fa fa-clipboard"
        },
        {
            url: "/home/audit",
            name: "认证审核",
            icon: "fa fa-clipboard"
        },
        {
            url: "/home/changeAccount",
            name: "修改账号",
            icon: "fa fa-drivers-license"
        },
        {
            url: "/home/changePwd",
            name: "修改密码",
            icon: "fa fa-lock"
        }
    ];
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
                asides: [],
                logoSrc: "",
            };
        },
        methods: {
            getLogo: function () {
                var result = ServerAPI.systemDetail();
                result.then(function (res) {
                    if (res.status == 200) {
                        // 请求服务器
                        this.logoSrc = res.content.logo;
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
            // 侧边栏导航的数据,如果是管理员
            if (sessionStorage.getItem('isSystem') + '' == 'true') {
                this.asides = adminAside;
            } else {
                // 如果不是管理员
                this.asides = commonAside;
            }
            // 侧边栏导航的激活选项
            // 加一层修改账号页面的激活效果
            this.asideActive = (function () {
                if (this.$route.meta.asideActive == '/home/userInfo') {
                    if (sessionStorage.getItem('isSystem') + '' == 'true') {
                        return '/home/changeAccount'
                    } else {
                        return '/home/userInfo'
                    }
                } else {
                    return this.$route.meta.asideActive;
                }
            }.bind(this))()
            // 获取logo图片的地址
            this.getLogo();
            // 判断是否跳转到404页面
            // this._go404(this.asideActive, this.asides);
            // 如果是临时用户，将侧边栏导航的定位到我的认证这一项上
            if (sessionStorage.getItem('isTemporary') == 'true') {
                this.asideActive = '/home/attestation';
            }
        },
        beforeRouteUpdate: function (to, from, next) {
            // 加一层修改账号页面的激活效果
            this.asideActive = (function () {
                if (to.meta.asideActive == '/home/userInfo') {
                    if (sessionStorage.getItem('isSystem') + '' == 'true') {
                        return '/home/changeAccount'
                    } else {
                        return '/home/userInfo'
                    }
                } else {
                    return to.meta.asideActive;
                }
            }.bind(this))()
            next();
        },
    };
});
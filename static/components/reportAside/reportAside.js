'use strict';

define([
    'ServerAPI'
], function (
    ServerAPI
) {
    var REPORT_lIST = ['PERM_sleep', 'PERM_electrocardio', 'PERM_temperature'];
    var REPORT_lIST_DETAIL = {
        // 心电报告
        PERM_electrocardio: {
            url: "/report/reportHeart",
            name: "心电报告",
            icon: "fa fa-heartbeat"
        },
        // 体温报告
        PERM_temperature: {
            url: "/report/reportThermometer",
            name: "体温报告",
            icon: "fa fa-thermometer-empty"
        },
        // 睡眠报告
        PERM_sleep: {
            url: "/report/reportBed",
            name: "睡眠报告",
            icon: "fa fa-bed"
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
                asides: [],
                logoSrc: ""
            };
        },
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
                for (var i = 0; i < REPORT_lIST.length; i++) {
                    if (navList.indexOf(REPORT_lIST[i]) > -1) {
                        arr.push(REPORT_lIST_DETAIL[REPORT_lIST[i]])
                    }
                }
                this.asides = arr;
            },

            // 判断要跳转的地址是否有权限，如果没有权限，就转到404页面
            _go404: function (active, asides) {
                console.log(active);
                console.log(asides);
                var inAsides = false;
                for (var i = 0; i < asides.length; i++) {
                    if (active == asides[i].url) {
                        inAsides = true;
                    }
                }
                if (!inAsides) {
                    // location.href = "/404.html";
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
        }
    };
});
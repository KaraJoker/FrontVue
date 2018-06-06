'use strict';

define([
    'ServerAPI'
], function (
    ServerAPI
) {
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
                    }else {
                        this.$alert(res.message, '提示', {
                            confirmButtonText: "确定",
                            callback: function (action) {}
                        });
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
            }
        },
        created: function () {
            this.asideActive = this.$route.meta.asideActive;
            this.getLogo();
        },
        beforeRouteUpdate: function (to, from, next) {
            this.asideActive = to.meta.asideActive;
            next();
        },
    };
});
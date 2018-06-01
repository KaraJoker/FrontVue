'use strict';

define([
    'theHead',
    'theBread',
    'css!/components/theLayout/theLayout.css'
], function (
    theHead,
    theBread
) {
    return {
        template: [
            '<div class="layout">',
            '<div class="aside-nav">',
            '<router-view name="aside"></router-view>',
            '</div>',
            '<div class="main" ref="main">',
            '<div class="head-nav">',
            '<v-head></v-head>',
            '</div>',
            '<div class="content">',
            '<v-bread  :bread-arr="breadArr"></v-bread>',
            '<router-view name="content"></router-view>',
            '</div>',
            '</div>',
            '</div>'
        ].join(''),
        data: function () {
            return {
                breadArr: []
            }
        },
        components: {
            'v-head': theHead,
            'v-bread': theBread
        },
        created: function () {
            this.breadArr = this.$route.meta.bread;
        },
        updated: function () {
            this.breadArr = this.$route.meta.bread;
        },
    };
});
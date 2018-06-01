'use strict';
define(function () {
    return {
        template: [
            '<div class="bread-nav">',
            '<el-breadcrumb separator-class="el-icon-d-arrow-right" class="bread-nav">',
            '<el-breadcrumb-item class="bread-nav-list" v-for="(item, index) in breadArr" :key="index" @click.native="pageChange(index)">{{item}}</el-breadcrumb-item>',
            '</el-breadcrumb>',
            '</div>'
        ].join(''),
        props: {
            breadArr: {
                type: Array,
                required: true
            }
        },
        methods: {
            pageChange: function (index) {
                var breadLength = this.breadArr.length;
                if (index != breadLength - 1 && index != 0) {
                    var num = index - breadLength + 1;
                    history.go(num)
                }
            }
        }
    }
})
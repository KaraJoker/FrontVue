'use strict';

define(function () {
    return {
        template: [
            '<el-steps :active="active" finish-status="process" align-center>',
            '<el-step v-for="(item,index) in progressText" :key="index" :title="item"></el-step>',
            '</el-steps>'
        ].join(''),
        props: ['active', 'progressText']
    }
})
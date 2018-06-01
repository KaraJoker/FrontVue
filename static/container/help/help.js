'use strict';
define([
    'text!help.html',
    'css!/container/help/help.css'
], function (
    tpl
) {
    return {
        template: tpl,
        methods: {
            changePage: function () {
                console.log('a');
                this.$router.push({
                    name: 'feedBack'
                })
            }
        }
    }

})
'use strict';
/**
 * 首页
 */
define([
    'text!./home.html',
    'homeIndexCountPercent',
    'homeIndexCountLine',
    'homeIndexTypeBar',
    'homeIndexTypeLine',
    'homeIndexMonthLine',
    'homeIndexCountPerson',
    'css!/container/home/home.css'
], function (
    tpl,
    homeIndexCountPercent,
    homeIndexCountLine,
    homeIndexTypeBar,
    homeIndexTypeLine,
    homeIndexMonthLine,
    homeIndexCountPerson
) {
    return {
        template: tpl,
        data: function () {
            return {
                isAdministrator: false
            };
        },
        components: {
            'v-count-percent': homeIndexCountPercent,
            'v-count-line': homeIndexCountLine,
            'v-type-bar': homeIndexTypeBar,
            'v-type-line': homeIndexTypeLine,
            'v-month-line': homeIndexMonthLine,
            'v-person': homeIndexCountPerson
        },
        created: function () {
            /**
             * 判断是不是管理员
             */
            if (sessionStorage.getItem('zhirou_role')) {
                this.isAdministrator = true;
            } else {
                this.isAdministrator = false;
            }
        }
    };
});
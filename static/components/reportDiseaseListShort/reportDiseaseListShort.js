'use strict';

define([
    'text!./reportDiseaseListShort.html',
    'reportDetailHeart',
    'css!/components/reportDiseaseListShort/reportDiseaseListShort.css'
], function (
    tpl,
    reportDetailHeart
) {
    return {
        template: tpl,
        components: {
            'v-heart-part': reportDetailHeart
        }
    };
});
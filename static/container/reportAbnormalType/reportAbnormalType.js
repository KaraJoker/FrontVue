'use strict';
define([
    'text!./reportAbnormalType.html',
    'ServerAPI',
    'reportErrorAside',
    'reportUserDetail',
    'reportDiseaseList',
    'mixins',
    'reportSuggest',
    'css!/container/reportAbnormalType/reportAbnormalType.css'
], function (
    tpl,
    ServerAPI,
    reportErrorAside,
    reportUserDetail,
    reportDiseaseList,
    mixins,
    reportSuggest
) {
    return {
        template: tpl,
        components: {
            'v-error-aside': reportErrorAside,
            'v-user-detail': reportUserDetail,
            'v-disease-list': reportDiseaseList,
            'v-suggest': reportSuggest
        },
        computed:{
            dataList:function(){
                console.log(this.$store.getters.diseaseListDealData);
                return this.$store.getters.diseaseListDealData;
            }
        },
        mixins: [mixins],
        methods: {
            // 查看片段的详情
            seeTypeAll: function () {
                this.$router.push({
                    name: 'reportAbnormalTypeDetail',
                    params: {
                        detailId: 456
                    }
                });
            },
        },
        // mounted:function(){
        //     console.log(this.$store.getters.diseaseListDealData);
        // }
    };
});
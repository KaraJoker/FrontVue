'use strict';

define([
    'text!./reportDiseaseList.html',
    'reportDetailHeart',
    'ERROR',
    'css!/components/reportDiseaseList/reportDiseaseList.css'
], function (
    tpl,
    reportDetailHeart,
    ERROR
) {
    return {
        template: tpl,
        props: [
            'errorModeId', //异常模板号和里面的图表id
            'errorType' //异常的类型
        ],
        data: function () {
            return {
                nameType: [], //异常片段的类型,将异常代表的数字转成具体的的文字
            };
        },
        components: {
            'v-heart-part': reportDetailHeart
        },
        methods: {
            // 设置异常片段类型
            setNameType: function () {
                var value = this.errorType;
                var nameArr = value.slice(1, value.length - 1).split(',');
                nameArr = nameArr.map(function (current, index, arr) {
                    if (current in ERROR) {
                        return ERROR[current].name;
                    }
                });
                this.nameType = nameArr;
            },
            // 查看该报告的这个异常片段类型下这个模板下的具体数据
            seeTypeDetail: function (index) {
                // 路由配置参数
                var paramsObj = {
                    reportId: this.$route.params.reportId, //报告的id
                    type: this.$route.params.type, //报告的类型
                    diseaseType: this.errorType, //异常的类型
                    diseaseMode: index //异常的模板号
                };
                this.$router.push({
                    name: 'reportAbnormalTypeDetail',
                    params: paramsObj
                });
            }
        },
        mounted: function () {
            console.log('异常的类型',this.errorType);
            console.log('异常的模板号和图表id',this.errorModeId);
            // 设置异常类型,将数字转为文字
            this.setNameType();
        },
    };
});
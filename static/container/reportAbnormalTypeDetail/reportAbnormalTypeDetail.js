'use strict';
/**
 * 复核异常片段
 */
define([
    'text!./reportAbnormalTypeDetail.html',
    'ServerAPI',
    'reportErrorAside',
    'reportUserDetail',
    'reportDetailHeart',
    'mixins',
    'reportSuggest',
    'css!/container/reportAbnormalTypeDetail/reportAbnormalTypeDetail.css'
], function (
    tpl,
    ServerAPI,
    reportErrorAside,
    reportUserDetail,
    reportDetailHeart,
    mixins,
    reportSuggest
) {
    return {
        template: tpl,
        components: {
            'v-error-aside': reportErrorAside,
            'v-user-detail': reportUserDetail,
            'v-heart-part': reportDetailHeart,
            'v-suggest': reportSuggest
        },
        data: function () {
            return {
                // 本异常类型下，本模板下，所有的图表的信息
                dataList: Object,
                flag: true
            };
        },
        mixins: [mixins],
        computed: {
            // 基本信息
            userReport: function () {
                return this.$store.state.reportBase;
            },
        },
        methods: {
            // 获取本异常类型,本模板下，所有的图表的列表
            // 和侧边栏的数据是不一样的
            getErrorLog: function () {
                var result = ServerAPI.getDiseaseList({
                    reportId: this.$route.params.reportId,
                    diseaseType: this.$route.params.diseaseType,
                    diseaseMode: this.$route.params.diseaseMode
                });
                result.then(function (res) {
                    if (res.status == 0) {
                        this.dataList = res.content;
                    }else {
                        this.$alert(res.message,'提示', {
                            confirmButtonText: '确定'
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
            },
            // 全部报错
            allError: function () {
                if (this.flag) {
                    this.flag = false;
                    var result = ServerAPI.allError({
                        reportId: this.$route.params.reportId,
                        diseaseType: this.$route.params.diseaseType,
                        diseaseMode: this.$route.params.diseaseMode,
                        verify: 2
                    });
                    result.then(function (res) {
                        this.flag = true;
                        if (res.status === 0) {
                            this.$router.push({
                                name: 'reportAbnormalType',
                                params: {
                                    reportId: this.$route.params.reportId,
                                    type: this.$route.params.type
                                }
                            });
                        }else {
                            this.$alert(res.message,'提示', {
                                confirmButtonText: '确定'
                            });
                        }
                    }.bind(this)).catch(function (err) {
                        this.flag = true;
                        if(err.statusText=='timeout'){
                            this.$alert('请求超时，请重新操作', '提示',{
                                confirmButtonText: "确定",
                                callback: function (action) {}
                            });
                        }
                    }.bind(this));
                }
            },
            // 复核确认
            checkSure: function () {
                if (this.flag) {
                    this.flag = false;
                    var result = ServerAPI.checkSure({
                        reportId: this.$route.params.reportId,
                        diseaseType: this.$route.params.diseaseType,
                        diseaseMode: this.$route.params.diseaseMode,
                        verify: 1

                    });
                    result.then(function (res) {
                        this.flag = true;
                        if (res.status === 0) {
                            this.$router.push({
                                name: 'reportAbnormalType',
                                params: {
                                    reportId: this.$route.params.reportId,
                                    type: this.$route.params.type
                                }
                            });
                        }else {
                            this.$alert(res.message,'提示', {
                                confirmButtonText: '确定'
                            });
                        }
                    }.bind(this)).catch(function (err) {
                        this.flag = true;
                        if(err.statusText=='timeout'){
                            this.$alert('请求超时，请重新操作', '提示',{
                                confirmButtonText: "确定",
                                callback: function (action) {}
                            });
                        }
                    }.bind(this));
                }
            }
        },
        created: function () {
            this.getErrorLog();
        },
        watch: {
            '$route': function (to, from) {
                this.getErrorLog();
            }
        }
    };
});
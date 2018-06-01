'use strict';
/**
 * 解读占比环形图
 */
define([
    'ServerAPI',
    'echarts'
], function (ServerAPI, echarts, homeIndexEcharSelect) {
    return {
        template: [
            '<div>',
            '<div class="page-box-title clear">',
            '<div class="echar-title">',
            '<i class="fa fa-circle-o"></i>',
            '<span class="title">按解读人数统计</span>',
            '</div>',
            '<span>查看更多</span>',
            '</div>',
            '<div class="home-count-line" ref="mychart"></div>',
            '<span class="echar-unit">单位：个</span>',
            '</div>'
        ].join(''),
        data: function () {
            return {
                // 本图表的echart实例对象，只初始化一次
                echart: Object,
                options: {
                    yAxis: {
                        data: []
                    },
                    series: [{
                            name: '解读报告数量',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: []
                        },
                        {
                            name: '超时报告数量',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: []
                        }
                    ]
                }
            };
        },
        methods: {
            // 图表初始化
            initEchar: function () {
                this.echart = echarts.init(this.$refs.mychart);
                // 图表配置
                var option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        orient: 'horizontal',
                        x: 'center',
                        y: '85%',
                        data: [{
                            name: '解读报告数量',
                            icon: 'circle',
                            textStyle: {
                                color: '#C0BDBC'
                            }
                        }, {
                            name: '超时报告数量',
                            icon: 'circle',
                            textStyle: {
                                color: '#C0BDBC'
                            }
                        }]
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '20%',
                        top: '10%',
                        containLabel: true
                    },

                    xAxis: {
                        type: 'value'
                    },
                    yAxis: {
                        type: 'category',
                        data: [] //人名
                    },

                    color: ['#FC8E37', '#D6243C'],
                    series: [{
                            name: '解读报告数量',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: []
                        },
                        {
                            name: '超时报告数量',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: []
                        }
                    ]
                };
                this.echart.setOption(option);
            },
            // 渲染图表
            draw: function () {
                //获取图表的数据
                var result = ServerAPI.getEcharCountPerson();
                result.then(function (res) {
                    // res = JSON.parse(res);
                    if (res.status == 200) {
                        this.options.yAxis.data = (function (data) {
                            var arr = [];
                            for (var i = 0; i < data.length; i++) {
                                arr.push(data[i].reader);
                            }
                            return arr;
                        })(res.content.totalNumList);

                        // 解读报告总数 y轴数
                        this.options.series[0].data = (function (data) {
                            var arr = [];
                            for (var i = 0; i < data.length; i++) {
                                arr.push(data[i].number);
                            }
                            return arr;
                        })(res.content.totalNumList);
                        // 超时报告总数 y轴数
                        this.options.series[1].data = (function (data) {
                            var arr = [];
                            for (var i = 0; i < data.length; i++) {
                                arr.push(data[i].number);
                            }
                            return arr;
                        })(res.content.totalTimelinessList);

                        if (this.options.yAxis.data.length <= 0) {
                            // this.echart.showLoading({
                            //     text: '暂无数据',
                            //     effect: 'bubble',
                            //     maskColor: 'rgba(0, 0, 0, 0)',
                            //     textStyle: {
                            //         fontSize: 30
                            //     }
                            // });
                        } else {
                            // 隐藏暂无数据的loading
                            this.echart.hideLoading();
                            // 重新给图表添加数据
                            this.echart.setOption(this.options);
                        }
                    }
                }.bind(this)).catch(function (err) {
                    if (err.statusText == 'timeout') {
                        this.$alert('请求超时，请刷新页面', '提示',{
                            confirmButtonText: "确定",
                            callback: function (action) {
                            }
                        });
                    }
                }.bind(this));
            }
        },
        mounted: function () {
            this.initEchar();
            this.draw();
        },
        watch: {
            // 监听子组件select值得变化
            "select.value": function () {
                this.draw();
            }
        }
    }
})
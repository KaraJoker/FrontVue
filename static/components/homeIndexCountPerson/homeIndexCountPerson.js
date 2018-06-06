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
                            name: '及时报告数量',
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
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        orient: 'horizontal',
                        x: 'center',
                        y: '85%',
                        data: [{
                            name: '及时报告数量',
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
                        data: []
                    },

                    color: ['#FC8E37', '#D6243C'],
                    series: [{
                            name: '及时报告数量',
                            type: 'bar',
                            stack: '总量',
                            data: []
                        },
                        {
                            name: '超时报告数量',
                            type: 'bar',
                            stack: '总量',
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
                    if (res.status == 200) {
                        var yAxisData = (function (data) {
                            var arr = [];
                            for (var i = 0; i < data.length; i++) {
                                arr.push(data[i].reader + '');
                            }
                            return arr;
                        })(res.content.totalNumList);
                        // 及时报告总数 y轴数
                        var jiShiData = (function (data, linesData) {
                            var arr = [];
                            for (var i = 0; i < data.length; i++) {
                                arr.push(data[i].number - linesData[i].number);
                            }
                            return arr;
                        })(res.content.totalNumList, res.content.totalTimelinessList);
                        console.log('jishi', jiShiData);

                        // 超时报告总数 y轴数
                        var chaoShiData = (function (data) {
                            var arr = [];
                            for (var i = 0; i < data.length; i++) {
                                arr.push(data[i].number);
                            }
                            return arr;
                        })(res.content.totalTimelinessList);
                        console.log('chaoShiData', chaoShiData);

                        // 重新给图表添加数据
                        this.echart.setOption({
                            yAxis: {
                                data: yAxisData
                            },
                            series: [{
                                    name: '及时报告数量',
                                    type: 'bar',
                                    stack: '总量',
                                    data: jiShiData
                                },
                                {
                                    name: '超时报告数量',
                                    type: 'bar',
                                    stack: '总量',
                                    data: chaoShiData
                                }
                            ]
                        });
                    } else {
                        this.$alert(res.message, '提示', {
                            confirmButtonText: "确定",
                            callback: function (action) {}
                        });
                    }
                }.bind(this)).catch(function (err) {
                    if (err.statusText == 'timeout') {
                        this.$alert('请求超时，请刷新页面', '提示', {
                            confirmButtonText: "确定",
                            callback: function (action) {}
                        });
                    }
                }.bind(this));
            }
        },
        mounted: function () {
            if (sessionStorage.getItem('isTemporary') == 'false') {
                this.initEchar();
                this.draw();
            }
        },
        watch: {
            // 监听子组件select值得变化
            "select.value": function () {
                this.draw();
            }
        }
    }
})
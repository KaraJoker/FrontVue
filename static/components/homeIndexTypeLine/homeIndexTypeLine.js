'use strict';
/**
 * 解决总量曲线图
 */
define([
    'ServerAPI',
    'echarts',
    'homeIndexEcharSelect'
], function (ServerAPI, echarts, homeIndexEcharSelect) {
    return {
        template: [
            '<div>',
            '<div class="page-box-title clear">',
            '<div class="echar-title">',
            '<i class="fa fa-circle-o"></i>',
            '<span class="title">解读报告分类曲线</span>',
            '</div>',
            '<v-select :selectSet="select" @selectChange="getSelectValue"></v-select>',
            '<el-tabs v-model="activeName" @tab-click="handleClick" class="choice-tab">',
            '<el-tab-pane label="心电报告" name="0,1"></el-tab-pane>',
            '<el-tab-pane label="体温报告" name="2,3"></el-tab-pane>',
            // '<el-tab-pane label="睡眠报告" name=""></el-tab-pane>',
            '</el-tabs>',
            '</div>',
            '<div class="home-count-line" ref="mychart"></div>',
            '<span class="echar-unit">单位：个</span>',
            '</div>'
        ].join(''),
        data: function () {
            return {
                xAxisData: [],
                seriesJieDuData: [],
                seriesChaoShiData: [],
                select: {
                    options: [{
                            value: "2017",
                            label: "2017"
                        },
                        {
                            value: "2018",
                            label: "2018"
                        }
                    ],
                    value: "2018"
                },
                activeName: '0,1',
                echar: Object,
                options: {
                    xAxis: [{
                        data: []
                    }],
                    series: [{
                            name: '解读报告',
                            type: 'line',
                            areaStyle: {
                                opacity: 0.1
                            },
                            symbolSize: 10,
                            data: []
                        },
                        {
                            name: '超时报告',
                            type: 'line',
                            areaStyle: {
                                opacity: 0.1
                            },
                            symbolSize: 10,
                            data: []
                        }
                    ]
                }
            };
        },
        methods: {
            initEchar: function () {
                this.echart = echarts.init(this.$refs.mychart);
                // 设置图表数据
                var option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    color: ['#FC8E37', '#D6243C'],
                    legend: {
                        orient: 'horizontal',
                        x: 'center',
                        y: '85%',
                        data: [{
                            name: '解读报告',
                            icon: 'circle',
                            textStyle: {
                                color: '#C0BDBC'
                            }
                        }, {
                            name: '超时报告',
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
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [{
                            name: '解读报告',
                            type: 'line',
                            areaStyle: {
                                opacity: 0.1
                            },
                            symbolSize: 10,
                            data: []
                        },
                        {
                            name: '超时报告',
                            type: 'line',
                            areaStyle: {
                                opacity: 0.1
                            },
                            symbolSize: 10,
                            data: []
                        }
                    ]
                };
                this.echart.setOption(option);
            },
            // 渲染图表
            draw: function () {
                //获取图表的数据
                var result = ServerAPI.getEcharTypeLine({
                    year: this.select.value,
                    reportType: this.activeName
                });
                result.then(function (res) {
                    if (res.status == 200) {
                        // x轴的数据,因为x轴的数据是一致的，所以我只取一条折线的x轴数据
                        this.options.xAxis[0].data = (function (data) {
                            var arr = [];
                            for (var i = 0; i < data.length; i++) {
                                arr.push(data[i].month + '月');
                            }
                            return arr;
                        })(res.content.totalNumPerMonthList);

                        // 解读报告总数 y轴数
                        this.options.series[0].data = (function (data) {
                            var arr = [];
                            for (var i = 0; i < data.length; i++) {
                                arr.push(data[i].number);
                            }
                            return arr;
                        })(res.content.totalNumPerMonthList);
                        // 超时报告总数 y轴数
                        this.options.series[1].data = (function (data) {
                            var arr = [];
                            for (var i = 0; i < data.length; i++) {
                                arr.push(data[i].number);
                            }
                            return arr;
                        })(res.content.totalTimelinessPerMonthList);


                        // 隐藏暂无数据的loading
                        this.echart.hideLoading();
                        // 重新给图表添加数据
                        this.echart.setOption(this.options);

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
            },
            // 接收select子组件传过来的数据
            getSelectValue: function (msg) {
                this.select.value = msg;
            },
            handleClick: function () {
                this.draw();
            }
        },
        mounted: function () {
            if (sessionStorage.getItem('isTemporary') == 'false') {
                this.initEchar();
                this.draw();
            }
        },
        components: {
            "v-select": homeIndexEcharSelect
        },
        watch: {
            // 监听子组件select值得变化
            "select.value": function () {
                this.draw();
            }
        }
    }
})
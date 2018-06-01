'use strict';
/**
 * 解决报告分类
 */
define([
    'ServerAPI',
    'echarts',
    'homeIndexEcharSelect'
], function (ServerAPI, echarts, homeIndexEcharSelect) {
    // 无话可说的常量
    var TI_WEN = [2, 3]; //体温常量
    var HEART = [0, 1]; //心电常量
    return {
        template: [
            '<div>',
            '<div class="page-box-title clear">',
            '<div class="echar-title">',
            '<i class="fa fa-circle-o"></i>',
            '<span class="title">解读报告分类</span>',
            '</div>',
            '<v-select :selectSet="select" @selectChange="getSelectValue"></v-select>',
            '</div>',
            '<div class="home-count-line" ref="mychart"></div>',
            '<span class="echar-unit">单位：个</span>',
            '</div>'
        ].join(''),
        data: function () {
            return {
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
                echart: Object,
                options: {
                    series: [{
                            name: '解读报告',
                            type: 'bar',
                            data: []
                        },
                        {
                            name: '超时报告',
                            type: 'bar',
                            data: []
                        }
                    ]
                }
            };
        },
        methods: {
            // 初始化图表
            initEchar: function () {
                this.echart = echarts.init(this.$refs.mychart);
                // 设置图表数据
                var option = {
                    tooltip: {
                        trigger: 'axis'
                    },
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
                    color: ['#FC8E37', '#D6243C'],
                    calculable: true,
                    xAxis: [{
                        type: 'category',
                        data: ['心电报告', '体温报告'],
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: []
                };
                this.echart.setOption(option);
            },
            // 渲染图表
            draw: function () {
                //获取图表的数据
                var result = ServerAPI.getEcharTypeBar({
                    year: this.select.value
                });
                result.then(function (res) {
                    console.log('cccc', res);
                    // res = JSON.parse(res);
                    // console.log('bbbb', res);
                    if (res.status == 200) {
                        // 解读报告总数 y轴数
                        this.options.series[0].data = (function (obj) {
                            var arr = [];
                            // 心电的数据
                            var heart = 0;
                            // 体温的数据
                            var tiwen = 0;
                            // 收集心电
                            for (var i = 0; i < HEART.length; i++) {
                                heart += obj[HEART[i]]
                            }
                            // 收集体温
                            for (var i = 0; i < TI_WEN.length; i++) {
                                tiwen += obj[TI_WEN[i]]
                            }
                            // 存储心电
                            arr.push(heart);
                            // 存储体温
                            arr.push(tiwen);
                            console.log('总数', arr);
                            return arr;
                        })(res.content.totalNumPerTypeMap);
                        // 超时报告总数 y轴数
                        this.options.series[1].data = (function (obj) {
                            var arr = [];
                            // 心电的数据
                            var heart = 0;
                            // 体温的数据
                            var tiwen = 0;
                            // 收集心电
                            for (var i = 0; i < HEART.length; i++) {
                                heart += obj[HEART[i]]
                            }
                            // 收集体温
                            for (var i = 0; i < TI_WEN.length; i++) {
                                tiwen += obj[TI_WEN[i]]
                            }
                            // 存储心电
                            arr.push(heart);
                            // 存储体温
                            arr.push(tiwen);
                            console.log('超时', arr);
                            return arr;
                        })(res.content.totalTimelinessPerTypeMap);
                        this.echart.setOption(this.options);
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
        },
        mounted: function () {
            this.initEchar();
            this.draw();
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
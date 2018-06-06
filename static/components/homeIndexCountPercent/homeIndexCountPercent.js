'use strict';
/**
 * 解读占比环形图
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
            '<span class="title">解读报告</span>',
            '</div>',
            '<v-select :selectSet="select" @selectChange="getSelectValue"></v-select>',
            '</div>',
            '<div class="home-count-echar" ref="mychart"></div>',
            '<span class="echar-unit">单位：个</span>',
            '</div>'
        ].join(''),
        data: function () {
            return {
                // select选项
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
                // 本图表的echart实例对象，只初始化一次
                echart: Object,
                total: ''
            };
        },
        methods: {
            // 图表初始化
            initEchar: function () {
                this.echart = echarts.init(this.$refs.mychart);
                // 图表配置
                var option = {
                    tooltip: {
                        trigger: 'item',
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
                            },
                            {
                                name: '超时报告数量',
                                icon: 'circle',
                                textStyle: {
                                    color: '#C0BDBC'
                                }
                            }
                        ]
                    },
                    color: ['#FC8E37', '#D6243C'],
                    series: [{
                        name: '报告数量',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        center: ['50%', '40%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [],
                        animation: false
                    }]
                };
                this.echart.setOption(option);
            },
            // 渲染图表
            draw: function () {
                //获取图表的数据
                var result = ServerAPI.getEcharCount({
                    year: this.select.value
                });
                result.then(function (res) {
                    if (res.status == '200') {
                        this.total = res.content.totalNum;
                        console.log(this.total);
                        var seriesData = [{
                                value: res.content.totalNum - res.content.totalTimeleness,
                                name: '及时报告数量'
                            },
                            {
                                value: res.content.totalTimeleness,
                                name: '超时报告数量'
                            }
                        ];

                        this.echart.setOption({
                            tooltip: {
                                trigger: 'item',
                                formatter: "{a}<br/>解读报告总数:" + this.total + "个<br/>{b}: {c}个 ({d}%)"
                            },
                            series: [{
                                data: seriesData
                            }]
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
                console.log(msg);
                this.select.value = msg;
            },
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
                console.log('aaaaaaaaaa');
                this.draw();
            }
        }
    }
})
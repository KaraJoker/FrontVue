'use strict';
/**
 * 报告详情
 */
define([
    'text!./reportDetailTwo.html',
    'ServerAPI',
    'echarts',
    'reportDetailHeart',
    'reportErrorAside',
    'reportUserDetail',
    'mixins',
    'reportSuggest',
    'css!/container/reportDetailTwo/reportDetailTwo.css'
], function (
    tpl,
    ServerAPI,
    echarts,
    reportDetailHeart,
    reportErrorAside,
    reportUserDetail,
    mixins,
    reportSuggest
) {
    return {
        template: tpl,
        data: function () {
            return {
                loading: Object,
                // 心电图
                heartEchar: Object,
                // 心电图配置数据
                heartEcharOptions: {
                    xAxis: {
                        data: []
                    },
                    series: {
                        data: []
                    }
                },
                // 时间图
                timeEchar: Object,
                // 时间图配置
                timeEcharOptions: {
                    series: [{
                        type: 'heatmap',
                        data: [],
                        label: {
                            show: false,
                            height: '2px',
                        },
                    }]
                },
                // lorenz图
                lorenzEchar: Object,
                // lorenz图配置
                lorenzEcharOptions: {
                    series: [{
                        symbolSize: 4,
                        data: [],
                        type: 'scatter'
                    }]
                },
                // 表格数
                tableData: [],
                // 最高心率
                heightHeat: {
                    urlPath: '/doctor/report/highHeartRate',
                    reportId: this.$route.params.reportId
                },
                // 最低心率
                lowHeat: {
                    urlPath: '/doctor/report/lowHeartRate',
                    reportId: this.$route.params.reportId
                }
            };
        },
        computed: {
            // 基本信息
            userReport: function () {
                return this.$store.state.reportBase;
            },
        },
        methods: {
            // 进入复核异常片段,将报告的id，报告的类型，如果有医生id，将这些数据往下面传递
            againSee: function () {
                var paramsObj = {
                    reportId: this.$route.params.reportId,
                    type: this.$route.params.type,
                };
                this.$router.push({
                    name: 'reportAbnormalType',
                    params: paramsObj
                });
            },
            // 心电图表初始化
            initHeartEchar: function () {
                this.heartEchar = echarts.init(this.$refs.heartChart);
                // 设置图表数据
                var option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        data: [],
                        type: 'category',
                        boundaryGap: false,
                        splitLine: {
                            show: true
                        }
                    },
                    yAxis: {
                        type: 'value',
                        interval: 30,
                        max: 210,
                        min: 0,
                        splitLine: {
                            show: true
                        }
                    },
                    dataZoom: [{
                        type: 'inside'
                    }, {
                        startValue: '00:00:00'
                    }, ],
                    visualMap: {
                        orient: 'horizontal',
                        top: 5,
                        right: 'center',
                        pieces: [{
                            gt: 0,
                            lte: 30,
                            color: '#C0191F'
                        }, {
                            gt: 30,
                            lte: 50,
                            color: '#ED8E25'
                        }, {
                            gt: 50,
                            lte: 100,
                            color: '#3FB6A5'
                        }, {
                            gt: 100,
                            lte: 160,
                            color: '#ED8E25'
                        }, {
                            gt: 160,
                            color: '#C0191F'
                        }],
                        outOfRange: {
                            color: '#999'
                        }
                    },
                    series: {
                        name: '心率',
                        type: 'line',
                        data: [],
                        markLine: {
                            silent: true,
                            data: [{
                                yAxis: 50
                            }, {
                                yAxis: 100
                            }, {
                                yAxis: 150
                            }, {
                                yAxis: 200
                            }, {
                                yAxis: 300
                            }]
                        }
                    }
                };

                this.heartEchar.setOption(option);
            },
            // 时间段表初始化
            initTimeEchar: function () {
                this.timeEchar = echarts.init(this.$refs.timeEchar);
                var option = {
                    tooltip: {
                        position: 'top',
                        show: false
                    },
                    animation: false,
                    grid: {
                        show: false,
                        height: '150px',
                        left: '72px',
                        top: '0',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        axisLabel: {
                            show: true
                        },
                        boundaryGap: true,
                        position: 'bottom',
                        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                        splitArea: {
                            show: true
                        }
                    },
                    yAxis: {
                        type: 'category',
                        data: ['长间期', '房补房颤', '室速', '室上速'],
                        splitArea: {
                            show: true
                        }
                    },
                    visualMap: {
                        min: 0,
                        max: 0,
                        show: false,
                        color: 'red'
                    },

                    series: [{
                        type: 'heatmap',
                        data: [
                            // 大概数据格式范例，不要删除
                            // {
                            //     value: [0, 0, 1],
                            // }, {
                            //     value: [2, 1, 1],
                            // }, {
                            //     value: [14, 1, 1],
                            // }
                        ],
                        label: {
                            show: false,
                            height: '2px',
                        },
                    }]
                };
                this.timeEchar.setOption(option);
            },
            // Lorenz图
            initLorenz: function () {
                this.lorenzEchar = echarts.init(this.$refs.splashesChart);
                var option = {
                    xAxis: {
                        type: 'value',
                        interval: 200,
                        max: 2000,
                        min: 0,
                        splitLine: {
                            show: true
                        }
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: false,
                        min: 0,
                        max: 2000,
                        splitNumber: 10,
                        splitLine: {
                            show: true
                        }
                    },
                    series: [{
                        symbolSize: 4,
                        data: [
                            // [300, 600],
                            // [400, 700],
                            // [500, 800],
                            // [300, 500]
                        ],
                        type: 'scatter'
                    }]
                };
                this.lorenzEchar.setOption(option);
            },
            // 渲染心电图表
            drawHeart: function () {
                this.loading = this.$loading({
                    lock: true,
                    text: '请稍后，报告数据加载中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                // 日期转化方法
                var dateFormat = function (date, format) {
                    var o = {
                        "M+": date.getMonth() + 1, //month
                        "d+": date.getDate(), //day
                        "h+": date.getHours(), //hour
                        "m+": date.getMinutes(), //minute
                        "s+": date.getSeconds(), //second
                        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
                        "S": date.getMilliseconds() //millisecond
                    };
                    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
                        (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                    for (var k in o)
                        if (new RegExp("(" + k + ")").test(format))
                            format = format.replace(RegExp.$1,
                                RegExp.$1.length == 1 ? o[k] :
                                ("00" + o[k]).substr(("" + o[k]).length));
                    return format;
                };
                var result = ServerAPI.getDayHeart();
                result.then(function (res) {
                    if (res.status == 0) {
                        this.loading.close();
                        // 时间结果
                        var timeNow = res.content.heartRateTime;
                        var timeArr = timeNow.map(function (current, index, arr) {
                            return dateFormat(new Date(Number(current)), 'hh:mm:ss');
                        });
                        this.heartEcharOptions = {
                            xAxis: {
                                data: timeArr
                            },
                            series: {
                                data: res.content.heartRateValue
                            }
                        };
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
            // 时间段图
            drawTime: function () {
                // 图表的数据
                var echarData = [];
                // y轴原始数据
                var yData = this.userReport['diseaseList'];
                // x轴原始数据
                var xData = this.userReport['diseaseListTime'];
                // 根据值判断当前值的x坐标是哪个
                var decide = function (value) {
                    switch (value) {
                        // 房颤是57，坐标为1
                        case '57':
                            return 1;
                        case '0-1':
                            return 0;
                        case '"0':
                            return 1;
                        case '3':
                            return 2;
                        default:
                            break;
                    }
                };
                // 有多少条数据，就创建多少个空对象
                (function () {
                    var length = yData.slice(1, yData.length - 1).split(',').length;
                    for (var i = 0; i < length; i++) {
                        var obj = {};
                        obj.value = [];
                        // 将每组数据的最后一位都设置为1；echar图表绘制需要，value数组总共3位
                        // 大概格式 value:[0,0,1],表示(0，0)坐标绘制一个点
                        obj.value[2] = 1;
                        echarData.push(obj);
                    }
                }.bind(this))();
                // 处理x轴数据
                (function (dataStr) {
                    // 日期转化方法
                    var dateFormat = function (date, format) {
                        var o = {
                            "M+": date.getMonth() + 1, //month
                            "d+": date.getDate(), //day
                            "h+": date.getHours(), //hour
                            "m+": date.getMinutes(), //minute
                            "s+": date.getSeconds(), //second
                            "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
                            "S": date.getMilliseconds() //millisecond
                        };
                        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
                            (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                        for (var k in o)
                            if (new RegExp("(" + k + ")").test(format))
                                format = format.replace(RegExp.$1,
                                    RegExp.$1.length == 1 ? o[k] :
                                    ("00" + o[k]).substr(("" + o[k]).length));
                        return format;
                    };
                    // 将x轴字符串数据转为数组
                    var dataArr = dataStr.slice(1, dataStr.length - 1).split(',');
                    for (var i = 0; i < dataArr.length; i++) {
                        var xNum = Number(dateFormat(new Date(Number(dataArr[i])), 'h'));
                        echarData[i].value[0] = xNum;
                    }
                })(xData);
                // 处理y轴数据
                (function (dataStr) {
                    var dataArr = dataStr.slice(1, dataStr.length - 1).split(',');
                    for (var i = 0; i < dataArr.length; i++) {
                        echarData[i].value[1] = decide(dataArr[i]);
                    }
                })(yData);

                this.timeEcharOptions = {
                    series: [{
                        type: 'heatmap',
                        data: echarData,
                        label: {
                            show: false,
                            height: '2px',
                        },
                    }]
                };

            },
            // 散点图
            drawLorenz: function () {
                var echarData = [];
                // y轴原始数据
                var yData = this.userReport['scatterX'];
                // x轴原始数据
                var xData = this.userReport['scatterY'];
                // 有多少条数据，就创建多少个空数组，数组中存储的是[x,y]坐标点
                (function () {
                    var length = yData.slice(1, yData.length - 1).split(',').length;
                    for (var i = 0; i < length; i++) {
                        var obj = [];
                        echarData.push(obj);
                    }
                }.bind(this))();

                // 处理x轴数据
                (function (dataStr) {
                    var dataArr = dataStr.slice(1, dataStr.length - 1).split(',');
                    for (var i = 0; i < dataArr.length; i++) {
                        echarData[i][0] = dataArr[i];
                    }
                })(xData);
                // 处理Y轴数据
                (function (dataStr) {
                    var dataArr = dataStr.slice(1, dataStr.length - 1).split(',');
                    for (var i = 0; i < dataArr.length; i++) {
                        echarData[i][1] = dataArr[i];
                    }
                })(yData);

                this.lorenzEcharOptions = {
                    series: [{
                        symbolSize: 4,
                        data: echarData,
                        type: 'scatter'
                    }]
                };
                // this.lorenzEchar.setOption(this.lorenzEcharOptions);
            },
            // 设置table的数据
            setTableData: function () {
                // 有多少条数据，就创建多少个空对象，用来保存每条表格数据
                // 以时间为例子，获取有多少条数据
                var length = this.userReport['diseaseTime'].slice(1, this.userReport['diseaseTime'].length - 1).split(',').length;
                for (var i = 0; i < length; i++) {
                    var obj = {};
                    this.tableData.push(obj);
                }
                // 给空对象添加数据的方法
                var addData = function (key) {
                    var value = this.userReport[key].slice(1, this.userReport[key].length - 1).split(',');
                    for (var i = 0; i < value.length; i++) {
                        this.tableData[i][key] = value[i];
                    }
                }.bind(this);
                // 时间
                addData('diseaseTime');
                // 有效时长
                addData('diseaseTimeValid');
                // 心搏总数
                addData('diseaseHeartBeat');
                // 平均心率
                addData('diseaseHeartRateAverage');
                // 最高心率
                addData('diseaseHeartRateHigh');
                // 最低心率
                addData('diseaseHeartRateLow');
                // 室上早
                addData('diseaseSves');
                // 室上速
                addData('diseaseSt');
                // 室早
                addData('diseaseVpb');
                // 室速
                addData('diseaseVt');
                // 房颤
                addData('diseaseAfib');
                // 长时间
                addData('diseaseLong');
            },
        },
        components: {
            'v-error-aside': reportErrorAside,
            'v-user-detail': reportUserDetail,
            'v-heart-part': reportDetailHeart,
            'v-suggest': reportSuggest
        },
        mounted: function () {
            // 初始化图表
            this.initHeartEchar();
            this.initTimeEchar();
            this.initLorenz();
            // 二十小时图
            this.drawHeart();
        },
        watch: {
            // 监听心电数据的变化
            heartEcharOptions: function (value) {
                this.heartEchar.setOption(this.heartEcharOptions);
            },
            // 监听时间段图数据的变化
            timeEcharOptions: function () {
                this.timeEchar.setOption(this.timeEcharOptions);
            },
            // 监听散点图数据的变化
            lorenzEcharOptions: function (value) {
                this.lorenzEchar.setOption(this.lorenzEcharOptions);
            },

            userReport: function () {
                this.setTableData();
                this.drawTime();
                this.drawLorenz();
            }
        }
    };
});
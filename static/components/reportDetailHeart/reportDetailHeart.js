'use strict';

define([
    'text!./reportDetailHeart.html',
    'echarts',
    'ServerAPI',
    'long',
    'ERROR',
    'css!/components/reportDetailHeart/reportDetailHeart.css'
], function (
    tpl,
    echarts,
    ServerAPI,
    Long,
    ERROR
) {
    var echarDetail = {
        template: tpl,
        props: [
            'urlPath', //获取本图表数据的接口路径,如果没有,就使用通用的的接口路径
            'id', //本图表的id
            'showError', //是否显示错误的类型,这个功能只有在最后查看异常详情才会使用到
            'echarData'
        ],
        computed: {
            echarId: function () {
                if (this.echarData) {
                    return this.echarData.id;
                } else {
                    return this.id;
                }
            }
        },
        data: function () {
            return {
                // 每秒400个数据,这个常量最好保存下来,预防后期改动
                SPACE: 400,
                // 点击区域的大小一半
                AREA: 200,
                // 图表的x轴刻度值默认大小
                ECHARSPACE: 3200,
                // 格子的大小19px,加边线20px
                SIZE: 19,
                // 心电图片段
                heartEchar: Object,
                // 心电图配置
                heartEcharOptions: {},
                // 片段的诊断结果
                result: false,
                // 已经复核了多少条
                checkYet: 0,
                // 右键选择框的内容
                choiceObj: Object,
                // 是否显示鼠标选择框
                showChoice: false,
                // 鼠标的位置
                mousePosition: {
                    left: '10px',
                    top: '20px'
                },
                // 鼠标事件的信息
                mouseEventParams: {

                },
                // 异常类型
                diseaseType: '',
                // 异常开始的时间
                startTime: '',
                // 异常的位置
                errorIndex: '',
                // 新增异常的位置
                addErrorIndex: '',
                // 图表的数据
                echarDetailData: '',
                // 外层盒子高度
                boxHeight: '191px'
            };
        },
        methods: {
            // 日期格式化
            dateFormat: function (date, format) {
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
            },
            str2bytes: function (str) {
                var bytes = [];
                for (var i = 0, len = str.length; i < len; ++i) {
                    var c = str.charCodeAt(i);
                    var byte = c & 0xff;
                    bytes.push(byte);
                }
                return bytes;
            },
            // 图表初始化
            initHeart: function () {
                this.heartEchar = echarts.init(this.$refs.heartPartDetail);
                var option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            // animation: true
                            type: 'line',
                            snap: true
                        },
                        showContent: false,
                    }
                };
                this.heartEchar.setOption(option);
            },
            /**
             * 整理这三个配置数据
             * gridArr
             * xAxisArr
             * yAxisArr
             * seriesArr
             */
            // 处理数据
            dealData: function () {
                var yData = this.echarDetailData;
                console.log(this.echarDetailData);
                // 数据分成几段
                var steps = 0;
                // 所有的y轴数据
                var allSeriesData = function () {
                    var arr = [];
                    // 收集所有的数据
                    for (var i = 0; i < yData.length; i++) {
                        yData[i].value.forEach(function (item, index, input) {
                            arr.push(item * 0.002288 / 16);
                        });
                    }
                    // 将y轴数据分成几段
                    steps = arr.length / this.ECHARSPACE;

                    this.boxHeight = 19 * 10 * steps + 1 + 'px';
                    return arr;
                }.bind(this)();

                // 所有的x轴数据
                var xAxisAllData = (function (time, arrLength) {
                    var arr = [];
                    for (var i = 0; i < arrLength; i++) {
                        // 添加叠加的时间
                        arr.push((time + i).toString());
                    }
                    return arr;
                }.bind(this))(this.startTime, allSeriesData.length)

                // 将数据分段的方法
                var dealArr = function (step, arr, space) {
                    var result = [];
                    for (var i = 0; i < step; i++) {
                        var box = arr.splice(0, space)
                        result.push(box);
                    }
                    return result;
                }
                // series配置
                var seriesObj = function () {
                    var arrList = dealArr(steps, allSeriesData, this.ECHARSPACE);
                    var resultArr = [];
                    for (var i = 0; i < steps; i++) {
                        var obj = {
                            type: 'line',
                            xAxisIndex: i,
                            yAxisIndex: i,
                            symbolSize: 2,
                            hoverAnimation: false,
                            data: arrList[i],
                            lineStyle: {
                                color: '#000',
                                width: 1
                            },
                            markArea: {
                                data: [],
                                label: {
                                    offset: [0, 20],
                                    color: '#fff',
                                },
                                z: 20,
                                zlevel: 20
                            }

                        }
                        resultArr.push(obj);
                    }
                    return resultArr;
                }.bind(this)();

                (function () {
                    // 如果传入的是图表对象数据
                    if (this.echarData) {
                        var diseaseTime = this.echarData.diseaseTime;
                        var startTime = this.startTime;
                        var timeDiff = Number(diseaseTime) - Number(startTime);
                        var arrIndex = 0;
                        // 算出异常出现在y轴数据的那个索引下
                        if (timeDiff < this.ECHARSPACE) {
                            arrIndex = 0;
                        } else {
                            arrIndex = parseInt(timeDiff / this.ECHARSPACE);
                        }
                        seriesObj[arrIndex].markArea.data.push(
                            [{
                                name: this.diseaseType,
                                xAxis: Number(diseaseTime) - this.AREA + ''
                            }, {
                                xAxis: Number(diseaseTime) + this.AREA + ''
                            }]
                        );
                    } else {
                        return {};
                    }

                }.bind(this))()

                // xAxis配置
                var xAxisObj = function () {
                    var arrList = dealArr(steps, xAxisAllData, this.ECHARSPACE);
                    var resultArr = [];
                    for (var i = 0; i < steps; i++) {
                        var obj = {
                            show: false,
                            type: 'category',
                            boundaryGap: false,
                            // data: ['e', 'r', 'x', 't', 'y'],
                            data: arrList[i],
                            gridIndex: i,
                        }
                        resultArr.push(obj);
                    }
                    return resultArr;
                }.bind(this)()

                // yAxios配置
                var yAxisObj = function () {
                    var resultArr = [];
                    for (var i = 0; i < steps; i++) {
                        var obj = {
                            show: false,
                            type: 'value',
                            max: 2.5,
                            min: -2.5,
                            gridIndex: i,
                        }
                        resultArr.push(obj);
                    }
                    return resultArr;
                }()

                // grid
                var gridObj = function () {
                    var resultArr = [];
                    for (var i = 0; i < steps; i++) {
                        var top = 0;
                        if (i == 0) {
                            top = 0;
                        } else {
                            top = 190 * i + 1;
                        }
                        var obj = {
                            show: false,
                            height: '191px',
                            width: '100%',
                            top: top + 'px',
                            left: '0',
                            containLabel: false
                        }
                        resultArr.push(obj);
                    }
                    return resultArr;
                }()
                this.heartEcharOptions = {
                    grid: gridObj,
                    xAxis: xAxisObj,
                    yAxis: yAxisObj,
                    series: seriesObj
                }
            },
            // 将probuf转为json
            transitionBuf: function (bufData) {
                var v1 = new Uint8Array(bufData);
                protobuf.load('/protoFile/EcgSmoothedData2.proto', function (err, root) {
                    if (err) throw err;
                    var AwesomeMessage = root.lookupType("SmoothedData");
                    var message = AwesomeMessage.decode(v1);
                    // 片段数据开始的时间
                    this.startTime = message.startTime;
                    // 存储图表的数据
                    this.echarDetailData = message.smoothedset.v1Data;
                }.bind(this));

            },
            // 获取图表数据
            getHeartData: function () {
                /**
                 * 如果请求的地址是不是空的
                 * 代表请求的就是最高心率或这最低心率的数据
                 */
                if (this.urlPath != '' && this.urlPath != undefined) {
                    // 获取高低心率的图
                    ServerAPI.getHeightLowHeart({
                        urlPath: this.urlPath,
                        params: {
                            reportId: this.echarId
                        }
                    }, function (data) {
                        // 处理bufu
                        this.transitionBuf(data);
                    }.bind(this));
                } else {
                    // 获取一般的图
                    ServerAPI.getDetailHeart({
                        diseaseId: this.echarId
                    }, function (data) {
                        // 处理bufu
                        this.transitionBuf(data);
                    }.bind(this));
                }
            },
            // 设置异常片段类型
            setNameType: function () {
                if (this.$route.params.diseaseType) {
                    var value = this.$route.params.diseaseType;
                    var nameArr = value.slice(1, value.length - 1).split(',');
                    nameArr = nameArr.map(function (current, index, arr) {
                        if (current in ERROR) {
                            return ERROR[current].name;
                        }
                    });
                    this.diseaseType = nameArr.toString();
                }
            },
            // 监听鼠标右键事件
            eventListen: function () {
                // 禁用鼠标右键的点击事件
                document.oncontextmenu = function (event) {
                    event.returnValue = false;
                };
                // 监听鼠标左键事件
                document.addEventListener('click', function (event) {
                    event.stopPropagation();
                    this.showChoice = false;
                }.bind(this));
                // 监听图表的鼠标右键点击事件
                this.heartEchar.on('mousedown', function (params) {
                    console.log(params);
                    this.mouseEventParams = params;
                    // 点击鼠标右键
                    if (params.event.which === 3) {
                        this.showChoice = true;
                        this.mousePosition = {
                            left: params.event.offsetX + 'px',
                            top: params.event.offsetY + 'px'
                        };
                        if (this.mouseEventParams.componentType === 'series') {
                            this.addErrorIndex = params.name;
                        }
                    }
                }.bind(this));
            },
            // 设置右键选择框的内容
            setMouseChoice: function () {
                this.choiceObj = ERROR;
            },
            // 修改错误的类型/或者添加异常
            changeDiseaseType: function (name, typeNum) {
                console.log(name, typeNum);
                // 在区块内点击就是修改异常
                if (this.mouseEventParams.componentType === 'markArea') {
                    this.showChoice = false;
                    var result = ServerAPI.changeError({
                        diseaseId: this.echarId,
                        diseaseType: '[' + typeNum + ']'
                    });
                    result.then(function (res) {
                        if (res.status === 0) {
                            // 修改图表的异常类型
                            this.diseaseType = name;
                            this.dealData(this.echarDetailData)
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
                } else {
                    // 在区块外点击就是添加异常
                    this.showChoice = false;
                    var result = ServerAPI.changeError({
                        diseaseId: this.echarId,
                        diseaseType: '[' + typeNum + ']',
                        diseaseTime: this.addErrorIndex
                    });
                    result.then(function (res) {
                        if (res.status === 0) {
                            var diseaseTime = this.addErrorIndex;
                            var startTime = this.startTime;
                            var timeDiff = Number(diseaseTime) - Number(startTime);
                            var arrIndex = 0;
                            // 算出异常出现在y轴数据的那个索引下
                            if (timeDiff < this.ECHARSPACE) {
                                arrIndex = 0;
                            } else {
                                arrIndex = parseInt(timeDiff / this.ECHARSPACE);
                            };
                            var seriesArr = this.heartEcharOptions.series;
                            seriesArr[arrIndex].markArea.data.push(
                                [{
                                    name: name,
                                    xAxis: Number(diseaseTime) - this.AREA + ''
                                }, {
                                    xAxis: Number(diseaseTime) + this.AREA + ''
                                }]
                            );
                            this.heartEcharOptions = {
                                grid: this.heartEcharOptions.grid,
                                yAxis: this.heartEcharOptions.yAxis,
                                xAxis: this.heartEcharOptions.xAxis,
                                series: seriesArr
                            };

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
            // 单个点击报错
            errorClick: function () {
                if (this.showError === 'true') {
                    var result = ServerAPI.oneError({
                        diseaseId: this.echarId,
                        verify: 2
                    })
                    result.then(function (res) {
                        if (res.status === 0) {
                            this.result = true;
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
            // 取消报错
            cancelError: function () {
                if (this.showError === 'true') {
                    var result = ServerAPI.oneError({
                        diseaseId: this.echarId,
                        verify: 0
                    })
                    result.then(function (res) {
                        if (res.status === 0) {
                            this.result = false;
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
        mounted: function () {
            // 图表初始化操作
            this.initHeart();
            // 获取图表数据
            this.getHeartData();
            // 将异常类型数字根据配置转成文字
            this.setNameType();
            // 监听鼠标右键事件
            this.eventListen();
            // 鼠标选择框
            this.setMouseChoice();
        },
        watch: {
            // 监听图表数据的变化,自动更新图表
            heartEcharOptions: function (value) {
                this.heartEchar.setOption(value);
            },
            '$route': function (to, from) {
                // 获取图表数据
                this.getHeartData();
                // 将异常类型数字根据配置转成文字
                this.setNameType();
            },
            // 监听图表外部的高度变化，自动改变图表的大小
            boxHeight: function () {
                this.$nextTick(function () {
                    this.heartEchar.resize();
                }.bind(this))
            },
            // 监听图表数据，只要probuf解析完，马上开始处理数据
            echarDetailData: function () {
                this.dealData();
            }
        }
    };
    return echarDetail;
});
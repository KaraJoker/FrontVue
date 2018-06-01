'use strict';
define([
    'vue',
    'vuex'
], function (
    Vue,
    Vuex
) {
    Vue.use(Vuex);
    var state = {
        reportBase: '', //用户的基本信息
        diseaseList: '', //异常列表
        medicationsLog: '', //吃药记录
        incidentLog: '', //事件记录
        subjectArr: [] //当前点击的部门id和子部门id的集合
    };

    var mutations = {
        setReportBase: function (state, payload) {
            state.reportBase = payload;
        },
        // 设置异常列表
        setDiseaseList: function (state, payload) {
            state.diseaseList = payload;
        },
        // 设置吃药记录
        setMedicationsLog: function (state, payload) {
            state.medicationsLog = payload;
        },
        // 设置事件记录
        setIncidentLog: function (state, payload) {
            state.incidentLog = payload;
        },
        // 设置部门集合数据
        setSubjectArr: function (state, payload) {
            state.subjectArr = payload;
        },
    };
    var getters = {
        diseaseListDealData: function (state) {
            var data = state.diseaseList;
            if (data) {
                var obj = {};
                for (var i = 0; i < data.length; i++) {
                    // 当前条数据
                    var currentData = data[i];
                    // 当前条数据的‘疾病类型’
                    var diseaseTypeValue = currentData.diseaseType + '';
                    // 如果没有这条疾病类型，在数据中创建一条
                    if (!(diseaseTypeValue in obj)) {
                        obj[diseaseTypeValue] = {};
                    }
                    // 本条疾病的模板号
                    var modelName = currentData.diseaseMode + '';
                    if (!(modelName in obj[diseaseTypeValue])) {
                        obj[diseaseTypeValue][modelName] = {};
                        // 所有的图表id
                        obj[diseaseTypeValue][modelName].list = [];
                        // 已经复核了多少条
                        obj[diseaseTypeValue][modelName].checkTrueNum = 0;
                        // 已经复核的错误的有多少条
                        obj[diseaseTypeValue][modelName].checkErrorNum = 0;
                        // 没有复核有多少条
                        obj[diseaseTypeValue][modelName].noCheck = 0;
                        // 所有异常发生的时间,有多少个id就有多少个图,也就有多少个异常时间
                        obj[diseaseTypeValue][modelName].time = [];
                    }
                    obj[diseaseTypeValue][modelName].time.push(currentData.diseaseTime);
                    obj[diseaseTypeValue][modelName].list.push(currentData.id);
                    if (currentData.diseaseValidity == 1) {
                        obj[diseaseTypeValue][modelName].checkTrueNum += 1;
                    }
                    if (currentData.diseaseValidity == 2) {
                        obj[diseaseTypeValue][modelName].checkErrorNum += 1;
                    }
                    if (currentData.diseaseValidity == 0) {
                        obj[diseaseTypeValue][modelName].noCheck += 1;
                    }
                }
                return obj;

            }
        }
    };
    return new Vuex.Store({
        state: state,
        mutations: mutations,
        getters: getters
    });
});
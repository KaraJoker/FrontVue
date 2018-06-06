'use strict';

define([
    'text!./reportSuggest.html',
    'ServerAPI',
    'css!/components/reportSuggest/reportSuggest.css'
], function (
    tpl,
    ServerAPI
) {
    return {
        template: tpl,
        data: function () {
            return {
                reportResultObj: {},
                textarea: '',
                isShow: true,
                dialogVisible: false,
                flag: true,
            };
        },
        computed: {
            // 基本信息
            userReport: function () {
                return this.$store.state.reportBase;
            }
        },
        methods: {
            // 提交报告
            submitSuggest: function () {
                if (this.flag) {
                    this.flag = false;
                    this.dialogVisible = false;
                    // 审核报告的参数
                    var reportSendObj = this.userReport;
                    reportSendObj.doctorRemark = this.textarea;
                    reportSendObj.doctorId = sessionStorage.getItem('doctorId');
                    reportSendObj.reportId = this.$route.params.reportId;
                    reportSendObj.reportType = this.$route.params.type;
                    // 提交报告审核结果
                    var result = ServerAPI.submitSuggest(reportSendObj);
                    result.then(function (res) {
                        this.flag = true;
                        if (res.status == 0) {
                            this.reportResultObj = res.content;
                            // 新增一条报告记录
                            this.addReportLog();
                        }else {
                            this.$alert(res.message,'提示', {
                                confirmButtonText: '确定'
                            });
                        }
                    }.bind(this)).catch(function (err) {
                        this.flag = true;
                        if (err.statusText == 'timeout') {
                            this.$alert('请求超时，请重新操作', '提示', {
                                confirmButtonText: "确定",
                                callback: function (action) {}
                            });
                        }
                    }.bind(this));
                }
            },
            // 添加一条报告记录
            addReportLog: function () {
                // 发送新增报告的参数
                var addReportSendObj = {
                    resultId: this.reportResultObj.id,
                    reportId: this.reportResultObj.reportId,
                    reportName: this.reportResultObj.reportCode,
                    reportType: this.reportResultObj.reportType,
                    patientAccount: this.reportResultObj.userPhone,
                    name: this.reportResultObj.userName,
                    gender: this.reportResultObj.userGender == 0 ? 0 : 1,
                    age: this.reportResultObj.userAge,
                    reportTime: this.reportResultObj.startTime,
                    updateTime: this.reportResultObj.reportStateTime //提交审核的时间，有歧义
                }
                // 通知新增一条报告
                var addReport = ServerAPI.addReport(addReportSendObj);
                addReport.then(function (res) {
                    this.flag = true;
                    if (res.status == 200) {
                        this.$alert('提交成功', {
                            confirmButtonText: '确定',
                            callback: function (action) {
                                history.go(-1);
                            }
                        });
                    }else {
                        this.$alert(res.message, '提示', {
                            confirmButtonText: "确定",
                            callback: function (action) {}
                        });
                    }
                }.bind(this)).catch(function (err) {
                    this.flag = true;
                    if (err.statusText == 'timeout') {
                        this.$alert('请求超时，请重新操作', '提示', {
                            confirmButtonText: "确定",
                            callback: function (action) {}
                        });
                    }
                }.bind(this));

            }
        }
    };
});
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
                textarea: '',
                isShow: true,
                dialogVisible: false,
                flag: true
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

                    // 发送新增报告的参数
                    var addReportSendObj = {
                        id: this.userReport.reportId,
                        reportName: this.userReport.reportCode,
                        reportType: this.userReport.reportType,
                        patientAccount: this.userReport.userPhone,
                        name: this.userReport.userName,
                        gender: this.userReport.userGender == 0 ? 0 : 1,
                        age: this.userReport.userAge,
                        reportTime: this.userReport.startTime,
                        updateTime: this.userReport.updateTime
                    }
                    // 提交报告审核结果
                    var result = ServerAPI.submitSuggest(reportSendObj);
                    // 通知新增一条报告
                    var addReport = ServerAPI.addReport(addReportSendObj);
                    // 监听两个异步
                    Promise.all([result, addReport]).then(function (results) {
                        this.flag = true;
                        if (results[0].status == 200 && results[1].status == 200) {
                            this.$alert('提交成功', {
                                confirmButtonText: '确定',
                                callback: function (action) {
                                    history.go(-1);
                                }
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
        }
    };
});
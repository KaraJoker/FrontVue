'use strict';
define([
    'axios', 'jquery',
], function (axios, $) {
    // 超时的时间设置
    var TIME_OUT = 100000;
    return {
        // 获取网站的基本信息
        getWebDetail: function () {
            return $.ajax({
                timeout: TIME_OUT,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/findSystemSetting",
            })
        },
        // 登录
        login: function (sendData) {
            console.log(sendData);
            return $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                timeout: TIME_OUT,
                crossDomain: true,
                method: 'post',
                url: developmentPath + "/users/login",
                data: sendData
            })
        },
        // 退出
        quit: function () {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: 'get',
                url: developmentPath + "/users/logout"
            });
        },
        // 获取用户信息
        getUserInfo: function () {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/doctorInfo/show"
            });
        },
        // 获取图片
        getImgs: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "get",
                url: developmentPath + "/doctorInfo/getImgs",
                data: sendData
            });
        },
        // 设置用户信息
        saveUserInfo: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                processData: false,
                contentType: false,
                crossDomain: true,
                method: "post",
                url: developmentPath + "/doctorInfo/save",
                data: sendData
            });
        },
        // 更改手机号
        changeMobile: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/users/updateMobile",
                data: sendData
            });
        },
        // 找回密码（忘记密码）
        findPwd: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: 'post',
                url: developmentPath + "/users/findPwd",
                data: sendData
            });
        },
        // 修改密码
        changePwd: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: 'post',
                url: developmentPath + "/users/changePwd",
                data: sendData
            });
        },
        // 设置密码
        setPwd: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: 'post',
                url: developmentPath + "/users/registry",
                data: sendData
            });
        },
        // 没注册，验证手机号（账号）是否已经存在
        isExsitPhone: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: 'get',
                url: developmentPath + "/users/smsSendeRegister",
                data: sendData
            });
        },
        // 已经注册，验证手机号（账号）是否已经存在
        isRegisterExsitPhone: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: 'get',
                url: developmentPath + "/users/smsSende",
                data: sendData
            });
        },
        // 手机验证码验证
        phoneCode: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                // 如果密码设置成功，就转到下个界面
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: 'POST',
                url: developmentPath + "/users/validateCode",
                data: sendData
            });
        },
        // 删除头像
        deletePhoto: function () {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: 'POST',
                url: developmentPath + "/doctorInfo/deleteFace"
            });
        },
        // 身份认证
        userRenZhen: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                processData: false,
                contentType: false,
                crossDomain: true,
                method: 'POST',
                url: developmentPath + "/doctorInfo/basicAuth",
                data: sendData
            });
        },
        // 资质认证
        ziZhiRenZhen: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                processData: false,
                contentType: false,
                crossDomain: true,
                method: 'POST',
                url: developmentPath + "/doctorInfo/doctorAuth",
                data: sendData
            });
        },

        /**
         * 首页
         */
        // 解读总量百分比
        getEcharCount: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: 'POST',
                url: developmentPath + "/report/countTimelinessByYear",
                data: sendData
            });
        },
        // 解读总量折线图
        getEcharCountLine: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: 'POST',
                url: developmentPath + "/report/countTimelinessByMonth",
                data: sendData
            });
        },
        // 解读报告分类百分比
        getEcharTypeBar: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: 'POST',
                url: developmentPath + "/report/countTimelinessByType",
                data: sendData
            });
        },
        // 解读报告分类总量折线图
        getEcharTypeLine: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: 'POST',
                url: developmentPath + "/report/countTimelinessByTypeAndMonth",
                data: sendData
            });
        },
        // 近一个月解读
        getEcharMonthLine: function () {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: 'POST',
                url: developmentPath + "/report/countTimelinessByDay"
            });
        },
        // 解读人排名
        getEcharCountPerson: function () {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: 'post',
                url: developmentPath + "/report/countTimelinessByPerson"
            });
        },
        // 获取已经解读的报告
        getReportTableSearch: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: 'post',
                url: developmentPath + "/report/selectByCondition",
                data: sendData
            });
        },

        // 查询解读报告,获取正常的数据
        getReportTableEcg: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                method: 'get',
                url: developmentPath_gang + "/doctor/ecg",
                data: sendData
            });
        },
        // 查询未完成的报告数据
        getReportTableUnfinished: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                method: 'get',
                url: developmentPath_gang + "/doctor/unfinished",
                data: sendData
            });
        },
        // 获取报告的基本信息
        getReportBaseInfo: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                method: 'get',
                url: developmentPath_gang + "/doctor/start",
                data: sendData
            });
        },

        // 心电8秒图
        getDetailHeart: function (setObj, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open("get", developmentPath_gang + "/doctor/disease?diseaseId=" + setObj.diseaseId);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function (e) {
                if (this.status == 200) {
                    callback(this.response);
                }
            };
            xhr.send();
        },

        // 心24小时图
        getDayHeart: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                method: 'get',
                url: developmentPath_gang + '/doctor/report/heartRate',
                data: sendData
            });
        },

        // 最高心率或者最低心率
        getHeightLowHeart: function (setObj, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open("get", developmentPath_gang + setObj.urlPath + "?reportId=" + setObj.params.reportId);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function (e) {
                if (this.status == 200) {
                    callback(this.response);
                }
            };
            xhr.send();
        },

        // 获取疾病列表
        getDiseaseList: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                method: 'get',
                url: developmentPath_gang + "/doctor/disease/list",
                data: sendData
            });
        },

        // 获取心电用药记录
        getHeartDrugLog: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                method: 'get',
                url: developmentPath_gang + "/medications/ecg",
                data: sendData
            });
        },

        // 获取心电事件记录
        getHeartEventLog: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                method: 'get',
                url: developmentPath_gang + "/incident/ecg",
                data: sendData
            });
        },

        // 全部报错
        allError: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                method: 'get',
                url: developmentPath_gang + "/doctor/verify/list",
                data: sendData
            });
        },
        // 单个报错
        oneError: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                method: 'get',
                url: developmentPath_gang + "/doctor/verify",
                data: sendData
            });
        },
        // 修改异常名称
        changeError: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                method: 'get',
                url: developmentPath_gang + "/doctor/update/type",
                data: sendData
            });
        },
        // 提交建议
        submitSuggest: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                method: 'post',
                url: developmentPath_gang + "/doctor/report/commit",
                data: JSON.stringify(sendData)
            });
        },
        // 复核确认
        checkSure: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                method: 'post',
                url: developmentPath_gang + "/doctor/report/finish",
                data: JSON.stringify(sendData)
            });
        },
        /**
         * 部门列表
         */
        getSectionData: function () {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/selectDepartment"
            });
        },

        // 获取部门的信息
        getSectionInfo: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/findDepartment",
                data: sendData
            });
        },
        // 根据手机号查询信息
        mobileSearchPerson: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/findMobile",
                data: sendData
            });
        },
        // 部门编辑保存
        editSectionInfo: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/saveDepartment",
                data: sendData
            });
        },

        // 部门新增保存
        addSectionInfo: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/addDepartment",
                data: sendData
            });
        },

        // 判断是否能删除部门的信息
        allowDeleteSectionInfo: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/findDepartmentUserCount",
                data: sendData
            });
        },

        // 删除部门的信息
        deleteSectionInfo: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/deleteDepartment",
                data: sendData
            });
        },

        // 权限管理列表
        powerMangeListSearch: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/selectDoctorRole",
                data: sendData
            });
        },

        // 设置权限
        setPower: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/PickPrivilege",
                data: sendData
            });
        },

        // 删除权限
        deletePower: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/deleteDoctorRole",
                data: sendData
            });
        },
        // 查看角色人员
        powerUserList: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/ViewDoctorInfo",
                data: sendData
            });
        },

        // 保存设置权限的人员
        saveCheckPerson: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/PickDoctorInfo",
                data: sendData
            });
        },


        // 保存没有勾选设置权限的人员
        saveNotCheckPerson: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/UnpickDoctorInfo",
                data: sendData
            });
        },


        // 获取部门的人员列表 
        getPersonList: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/departMentPickDoctorInfo",
                data: sendData
            });
        },
        // 角色权限编辑保存
        editPower: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/saveDoctorRole",
                data: sendData
            });
        },
        // 角色权限添加保存
        addPower: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/addDoctorRole",
                data: sendData
            });

        },

        // 角色的权限信息
        getPower: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/ViewPrivilege",
                data: sendData
            });
        },

        // 人员信息
        getPersonInfo: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/findDoctorInfo",
                data: sendData
            });
        },
        // 人员列表初始查询
        userListSearch: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/selectDoctorInfo",
                data: sendData
            });
        },
        // 人员编辑保存
        editUser: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/saveDoctorInfo",
                data: sendData
            });
        },
        // 人员添加保存
        addUser: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/addDoctorInfo",
                data: sendData
            });
        },
        // 删除人员
        deleteUser: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/deleteDoctorInfo",
                data: sendData
            });
        },

        // 操作日志列表
        logListInit: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/selectOperateLogger",
                data: sendData
            });
        },
        // 操作日志列表
        logListSearch: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/selectOperateLogger",
                data: sendData
            });
        },
        // 操作日志详情
        logDetail: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/findOperateLogger",
                data: sendData
            });
        },
        // 获取系统设置信息
        systemDetail: function () {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/findSystemSetting",
            });
        },
        // 保存系统设置信息
        saveSystemDetail: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                processData: false,
                contentType: false,
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/saveSystemSetting",
                data: sendData
            });
        },


        // 获取消息
        getMessage: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/message/messageDisplay",
                data: sendData
            });
        },
        // 删除消息
        deleteMessage: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/message/messageDelete",
                data: sendData
            });
        },
        // 标记为已读
        readYet: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/message/messageMarkup",
                data: sendData
            });
        },

        // 待审核列表
        waitAudit: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/doctorInfo/doctorReviewList",
                data: sendData
            });
        },
        // 已经审核列表
        yetAudit: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/doctorInfo/doctorReviewFinishList",
                data: sendData
            });
        },
        // 认证记录
        auditLog: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/doctorInfo/doctorReviewUser",
                data: sendData
            });
        },

        // 提交认证审核建议
        suggestAudit: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/doctorInfo/doctorReviewFinish",
                data: sendData
            });
        },

        // 认证结果
        renZhenResult: function () {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/doctorInfo/findDoctorReviewState",
            });
        },
        //提交意见反馈
        feedback: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/saveUserHelp",
                data: sendData
            });
        },
        // 获取消息设置
        sysMsgSet: function () {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "get",
                url: developmentPath + "/message/setting",
            });
        },
        // 保存消息设置
        saveMsgSet: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/message/setting",
                data: sendData
            });
        },
        // 查看设置权限
        powerSet: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/ViewPrivilege",
                data: sendData
            });
        },

        // 管理员获取其他的用户的信息
        getOtherInfo: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,

                method: "post",
                url: developmentPath + "/doctorInfo/getDoctorReview",
                data: sendData
            });
        },
        // 获取当前用户的权限
        getPowerSetAside: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/doctorInfo/doctorLookRole",
                data: sendData
            });
        },
        // 获取当前用户的权限
        setAllow: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/disableDepartMent",
                data: sendData
            });
        },
        // 新增一条报告
        addReport: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/report/addReport",
                data: sendData
            });
        },
        // 查询解读后报告的结果基本信息
        getResultBase: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                method: 'get',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                url: developmentPath_gang + "/report/diagnosis/finish",
                data: sendData
            });

        },
        // 上传文件
        fileUP: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                processData: false,
                contentType: false,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/csvImport",
                data: sendData
            });
        },
        // 公告列表
        noticeList: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                // processData: false,
                // contentType: false,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "get",
                url: developmentPath + "/message/announcement/list",
                data: sendData
            });
        },
        // 公告详情
        noticeDetail: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "get",
                url: developmentPath + "/message/announcement/get",
                data: sendData
            });
        },
        // 新增公告
        addNotice: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/message/announcement/add",
                data: sendData
            });
        },
        // 编辑公告
        editNotice: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/message/announcement/update",
                data: sendData
            });
        },
        // 删除公告
        deleteNotice: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/message/announcement/delete",
                data: sendData
            });
        },
        // 获取角色列表
        getRoleList: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: developmentPath + "/sysManage/selectDoctorRoleList",
                data: sendData
            });
        },
        // 测试
        test: function (sendData) {
            return $.ajax({
                timeout: TIME_OUT,
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        XMLHttpRequest.abort();
                    }
                },
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('zhirou_token'));
                },
                processData: false,
                contentType: false,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                method: "post",
                url: "./ERROR.js",
                data: sendData
            });
        }
    };

});
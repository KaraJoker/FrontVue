'use strict';
define([
    'text!./messageSet.html',
    'ServerAPI',
    'css!/container/messageSet/messageSet.css'
], function (
    tpl,
    ServerAPI
) {
    return {
        template: tpl,
        data: function () {
            return {
                formData: {},
                flag: true
            };
        },
        computed: {
            receiveMethod: {
                get: function () {
                    return this.formData.receiveMethod + ''
                },
                set: function (newValue) {
                    this.formData.receiveMethod = newValue;
                }
            }
        },
        methods: {
            getSet: function () {
                ServerAPI.sysMsgSet().then(function (res) {
                    if (res.status == 200) {
                        this.formData = res.content;
                    }
                }.bind(this)).catch(function (err) {
                    if(err.statusText=='timeout'){
                        this.$alert('请求超时，请刷新页面', '提示',{
                            confirmButtonText: "确定",
                            callback: function (action) {
                            }
                        });
                    }
                }.bind(this))

            },
            saveSet: function () {
                if (this.flag) {
                    this.flag = false;
                    ServerAPI.saveMsgSet(this.formData).then(function (res) {
                        this.flag = true;
                        if (res.status == 200) {
                            this.$alert('设置成功', {
                                confirmButtonText: "确定",
                                callback: function (action) {}
                            });
                        } else {
                            this.$alert(res.message, '提示',{
                                confirmButtonText: "确定",
                                callback: function (action) {}
                            });
                        }
                    }.bind(this)).catch(function (err) {
                        this.flag = true;
                        if(err.statusText=='timeout'){
                            this.$alert('请求超时，请重新操作', '提示',{
                                confirmButtonText: "确定",
                                callback: function (action) {}
                            });
                        }
                    }.bind(this))

                }
            }
        },
        created: function () {
            this.getSet();
        }
    };
});
'use strict';
define([
    'text!./feedBack.html',
    'ServerAPI',
    'css!/container/feedBack/feedBack.css'
], function (
    tpl,
    ServerAPI
) {
    return {
        template: tpl,
        data: function () {
            return {
                wordScope: 300,
                textValue: '',
                flag: true
            }
        },
        computed: {
            wordNum: function () {
                return this.textValue.length;
            },
            wordLast: function () {
                return this.wordScope - this.wordNum
            }
        },
        methods: {
            submitText: function () {
                if (this.flag) {
                    this.flag = false;
                    if (this.textValue) {
                        var result = ServerAPI.feedback({
                            suggest: this.textValue
                        });
                        result.then(function (res) {
                            this.flag = true;
                            if (res.status == 200) {
                                // 假如如果提交成功
                                this.$alert('感谢您的建议，我们会一直做好对您的服务', {
                                    confirmButtonText: '确定',
                                    callback: function (action) {
                                        this.textValue = '';
                                    }.bind(this)
                                });
                            } else {
                                this.$alert(res.msg, {
                                    confirmButtonText: '确定',
                                    callback: function (action) {
                                        this.textValue = '';
                                    }.bind(this)
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
            }
        }

    }
})
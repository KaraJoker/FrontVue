'use strict';
define([
    'text!./systemSet.html',
    'ServerAPI',
    'baseImgUpload',
    'css!/container/systemSet/systemSet.css'
], function (
    tpl,
    ServerAPI,
    baseImgUpload
) {
    return {
        template: tpl,
        data: function () {
            return {
                id: '',
                logo: '',
                sysName: '智柔健康云平台',
                copyright: true,
                publishPicture: '',
                flag: true //防止连续提交
            };
        },
        components: {
            "v-upload": baseImgUpload
        },
        methods: {
            save: function (formName) {
                var formData = new FormData(this.$refs[formName].$el);
                console.log('wwwwwwwwww', this.copyright);
                formData.append('copyright', this.copyright);
                if (this.flag) {
                    this.flag = false;
                    var result = ServerAPI.saveSystemDetail(formData);

                    result.then(function (res) {
                        if (res.status == 200) {
                            this.flag = true;
                            this.$alert('提交成功', '提示', {
                                confirmButtonText: "确定",
                                callback: function (action) {}
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
            },
            getDetail: function () {
                var result = ServerAPI.systemDetail();
                result.then(function (res) {
                    if (res.status == 200) {
                        this.id = res.content.id;
                        this.logo = res.content.logo;
                        this.sysName = res.content.sysName;
                        this.copyright = res.content.copyright;
                        this.publishPicture = res.content.publishPicture.split(',');
                        console.log(this.publishPicture);
                    }else {
                        this.$alert(res.message, '提示', {
                            confirmButtonText: "确定",
                            callback: function (action) {}
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
            }
        },
        created: function () {
            this.getDetail();
        }
    }
});
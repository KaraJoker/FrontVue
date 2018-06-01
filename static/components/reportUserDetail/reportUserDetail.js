define([
    'text!./reportUserDetail.html',
    'ServerAPI'
], function (
    tpl,
    ServerAPI
) {
    return {
        template: tpl,
        computed: {
            userDetail: function () {
                return this.$store.state.reportBase;
            }
        },
        methods: {
            getBaseText: function () {
                var result;
                if (this.$route.params.doctorId) {
                    result = ServerAPI.getReportBaseInfo({
                        reportId: this.$route.params.reportId,
                        doctorId: this.$route.params.doctorId,
                        type: this.$route.params.type
                    });
                } else {
                    result = ServerAPI.getReportBaseInfo({
                        reportId: this.$route.params.reportId,
                        type: this.$route.params.type
                    });
                }
                result.then(function (res) {
                    if (res.status == 0) {
                        this.$store.commit('setReportBase', res.content);
                    }
                }.bind(this)).catch(function (err) {
                    if(err.statusText=='timeout'){
                        this.$alert('请求超时，请刷新页面', '提示',{
                            confirmButtonText: "确定",
                            callback: function (action) {
                            }
                        });
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
        },
        created: function () {
            // 获取患者的基本信息
            this.getBaseText();
        }
    };
});
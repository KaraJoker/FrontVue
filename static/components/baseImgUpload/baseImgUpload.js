'use strict';
define([
    'text!./baseImgUpload.html',
    'css!/components/baseImgUpload/baseImgUpload.css'
], function (
    tpl
) {
    return {
        template: tpl,
        props: ['reqed', 'name', 'imgPath', 'imgSize'],
        data: function () {
            return {
                showHint: false,
                nowImg: ''
            };
        },
        methods: {
            // 上传图片的操作
            changeFile: function (event) {
                var file = event.target.files[0];
                // 將图片的值回传给父组件
                this.$emit("uploadImg", file);
                // 读取图片文件
                var reader = new FileReader();
                reader.readAsDataURL(file);
                // 读取图片文件后，显示图片
                reader.onload = function (e) {
                    this.nowImg = e.target.result;
                }.bind(this);
            },
            // 验证input是否选择了上传的图片
            checkImg: function () {
                if (this.reqed == 'true') {
                    if (this.$refs.avatarInput.value == '') {
                        console.log(2);
                        this.showHint = true;
                        return false;
                    } else {
                        this.showHint = false;
                        return true;
                    }
                } else {
                    console.log(3);
                    return true;
                }
            }
        },
        watch: {
            imgPath: function (value) {
                this.nowImg = value;
            }
        }
    };
});
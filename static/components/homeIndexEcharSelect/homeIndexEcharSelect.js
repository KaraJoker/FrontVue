'use strict';

define(function (tpl) {
    return {
        template: [
            '<el-select v-model="selectSet.value" placeholder="请选择" @change="changeValue" class="time-choice">',
            '<el-option v-for="item in selectSet.options" :key="item.value" :label="item.label" :value="item.value"></el-option>',
            '</el-select>'
        ].join(''),
        props: {
            selectSet: {
                type: Object,
                default: function () {
                    return {
                        value: "选项2"
                    };
                }
            }
        },
        methods: {
            changeValue: function () {
                // 告诉父组件，select现在的值
                this.$emit("selectChange", this.selectSet.value);
            }
        }
    }
});
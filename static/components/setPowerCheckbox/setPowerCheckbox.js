'use strict';
define([
    'text!./setPowerCheckbox.html',
    'css!/components/setPowerCheckbox/setPowerCheckbox.css'
], function (
    tpl
) {
    return {
        template: tpl,
        props: {
            lists: {
                type: Array,
                required: true
            },
            checkedValue: {
                type: Array,
                required: true
            }
        },
        data: function () {
            return {
                checkAll: false, //是否全选
                isIndeterminate: false,
                checkedList: []
            };
        },
        methods: {
            handleCheckAllChange: function (val) {
                var allValue = function () {
                    console.log(this.lists);
                    var arr = [];
                    for (var i = 0; i < this.lists.length; i++) {
                        arr.push(this.lists[i].value);
                    }
                    return arr;
                }.bind(this)()
                this.checkedList = val ? allValue : [];
                this.isIndeterminate = false;
            },
            handleCheckedChange: function (value) {
                var checkedCount = value.length;
                this.checkAll = checkedCount === this.lists.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.lists.length;
            }
        },
        watch: {
            checkedList: function () {
                this.$emit('checked-change', this.checkedList);
            },
            checkedValue: function (value) {
                console.log(value);
                this.checkedList = value;
            }
        }
    };
});
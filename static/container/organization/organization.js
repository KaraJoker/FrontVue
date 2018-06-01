'use strict';
define([
    'text!./organization.html',
    'ServerAPI',
    'css!/container/organization/organization.css'
], function (
    tpl,
    ServerAPI
) {
    return {
        template: tpl,
        data: function () {
            return {
                // 服务器返回的数据
                serverData: Object,
                // tab那个栏目显示,默认是第一个
                showBox: 1,
                // 是否在编辑状态下
                isEditer: false,
                // 部门信息
                organization: {
                    // 部门的父部门
                    parentOrganization: '',
                    // 部门基本信息
                    organizationList: {},
                },
                // 搜索的部门
                filterText: '',
                // 组织部门tree
                treeData: [],
                // 表格的数据,也就是子部门的数据
                tableData: [],
                // 当前部门的数据
                nowPosData: '',
                // 当前选中部门的id和子部门的id的集合
                nowPosChildArr: []
            };
        },
        methods: {
            status: function (row) {
                if (row.status == '0') {
                    return '启用';
                }
                if (row.status == '1') {
                    return '禁用';
                }
            },
            // 以什么准则过滤tree
            filterNode: function (value, data) {
                if (!value) {
                    return true;
                }
                return data.label.indexOf(value) !== -1;
            },
            // 点击过滤后的条件,更换右边的信息
            filterClick: function (data, node, ele) {
                // 部门的信息
                this.organization = {
                    organizationList: data,
                    parentOrganization: node.parent.data.label
                }
                // table的数据,子部门的数据
                this.tableData = data.children;
                // 当前部门的数据
                this.nowPosData = data;

            },
            // 切换到编辑状态
            changeEdit: function () {
                var childArr = (function () {
                    var obj = this._getTreeChild(this.treeData, this.nowPosData.id);
                    return this._getArrId(obj);
                }.bind(this))();

                this.$router.push({
                    name: 'organizationEdit',
                    params: {
                        id: this.organization.organizationList.id,
                        childArr: childArr.join('/')
                    }
                });
            },
            // 编辑table一条数据
            editData: function (row) {
                var childArr = (function () {
                    var obj = this._getTreeChild(this.treeData, row.id);
                    return this._getArrId(obj);
                }.bind(this))();

                this.$router.push({
                    name: 'organizationEdit',
                    params: {
                        id: row.id,
                        childArr: childArr.join('/')
                    }
                });
            },
            // 切换tab
            changeShow: function (index) {
                this.showBox = index;
            },
            // 添加部门
            add: function () {
                // 只有父亲部门是启用的才能添加子部门
                if (this.nowPosData.status == '0') {
                    this.$router.push({
                        name: 'organizationAdd',
                        params: {
                            parentId: this.nowPosData.id
                        }
                    });
                }
                // 如果父部门是禁用的就不能添加
                if (this.nowPosData.status == '1') {
                    this.$alert('当前部门是禁用状态，不能添加下级部门', '提示', {
                        confirmButtonText: "确定",
                        callback: function (action) {}.bind(this)
                    });
                }
            },
            // 删除table一条数据
            deleteData: function (index, row, current) {
                this.$confirm('确认删除本条数据', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    var result = ServerAPI.deleteSectionInfo({
                        id: current.id
                    });
                    result.then(function (res) {
                        if (res.status == 200) {
                            row.splice(index, 1);
                            this.$alert('删除成功', {
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
                }.bind(this)).catch(function () {}.bind(this));
            },
            // 初始获取部门数据
            getSectionData: function () {
                var result = ServerAPI.getSectionData();
                result.then(function (res) {
                    if (res.status == 200) {
                        // 原始数据
                        this.serverData = res.content;
                        // 处理成tree数据
                        this.setTreeData(res.content);
                        // 默认显示公司信息
                        this.organization.organizationList = this.treeData[0];
                        // 下级部门信息
                        this.tableData = this.treeData[0].children;
                        // 本部门的信息，点击添加是给本部门添加子部门
                        this.nowPosData = this.treeData[0];
                    }
                }.bind(this)).catch(function (err) {
                    if (err.statusText == 'timeout') {
                        this.$alert('请求超时，请刷新页面', '提示', {
                            confirmButtonText: "确定",
                            callback: function (action) {
                            }
                        });
                    }
                }.bind(this));
            },
            // 将数据处理成tree结构
            toTreeData: function (data, attributes) {
                let resData = data;
                let tree = [];
                for (let i = 0; i < resData.length; i++) {
                    if (resData[i].parentId === attributes.rootId) {
                        let obj = {
                            id: resData[i][attributes.id],
                            address: resData[i][attributes.address],
                            label: resData[i][attributes.departmentName],
                            departmentPhone: resData[i][attributes.departmentPhone],
                            principle: resData[i][attributes.principle],
                            remarks: resData[i][attributes.remarks],
                            status: resData[i][attributes.status],
                            children: []
                        };
                        tree.push(obj);
                        resData.splice(i, 1);
                        i--;
                    }
                }
                run(tree);

                function run(chiArr) {
                    if (resData.length !== 0) {
                        for (let i = 0; i < chiArr.length; i++) {
                            for (let j = 0; j < resData.length; j++) {
                                if (chiArr[i].id === resData[j][attributes.parentId]) {
                                    let obj = {
                                        id: resData[j][attributes.id],
                                        address: resData[j][attributes.address],
                                        label: resData[j][attributes.departmentName],
                                        departmentPhone: resData[j][attributes.departmentPhone],
                                        principle: resData[j][attributes.principle],
                                        remarks: resData[j][attributes.remarks],
                                        status: resData[j][attributes.status],
                                        children: []
                                    };
                                    chiArr[i].children.push(obj);
                                    resData.splice(j, 1);
                                    j--;
                                }
                            }
                            run(chiArr[i].children);
                        }
                    }
                }
                return tree;
            },
            // 截取树形结构
            _getTreeChild: function (data, id) {
                var result;
                var loop = function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].id == id) {
                            result = data[i];
                            return;
                        } else {
                            loop(data[i].children)
                        }
                    }
                }
                loop(data)
                return result;
            },
            _getArrId: function (data) {
                var arr = [];
                arr.push(data.id)
                var getArr = function (obj) {
                    if (obj.children.length > 0) {
                        var childrenData = obj.children;
                        for (var i = 0; i < childrenData.length; i++) {
                            arr.push(childrenData[i].id);
                            getArr(childrenData[i]);
                        }
                    }
                }
                getArr(data);
                return arr;
            },
            // 处理成tree需要的数格式
            setTreeData: function (data) {
                // 属性配置信息
                var attributes = {
                    id: 'id',
                    parentId: 'parentId',
                    address: 'address',
                    departmentName: 'departmentName',
                    departmentPhone: 'departmentPhone',
                    principle: 'principle',
                    remarks: 'remarks',
                    status: 'status',
                    rootId: '0'
                };
                var treeData = this.toTreeData(data, attributes);
                console.log('ssssssssssssss', treeData);
                this.treeData = treeData;
            }
        },
        mounted: function () {
            this.getSectionData();
        },
        watch: {
            filterText: function (val) {
                this.$refs.organizationTree.filter(val);
            }
        },
    };
});
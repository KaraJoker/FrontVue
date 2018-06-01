'use strict';
define([
    'text!./choicePerson.html',
    'ServerAPI',
    'css!/container/choicePerson/choicePerson.css'
], function (
    tpl,
    ServerAPI
) {
    return {
        template: tpl,
        data: function () {
            return {
                // 筛选部门
                filterPerson: '',
                // 部门列表
                positionData: [],
                checkOption: [], //勾选的数据的id
                serverData: Object, //部门列表的服务器数据
                // 自定义的过滤规则
                filterMethod: function (query, item) {
                    return item.mobile.indexOf(query) > -1 || item.name.indexOf(query) > -1;
                },
                nowPosition: {}, //当前选中的是哪个部门
                arrId: [],
                isMove: false, //是否对人员进行了操作
                flag: true,
                // 部门所有的人员信息
                personData: [],
                powerList: [], //拥有角色的所有与人员

            };
        },
        methods: {
            // 过滤
            filterNode: function (value, data) {
                if (!value) {
                    return true;
                }
                return data.label.indexOf(value) !== -1;
            },
            // 点击了那一项
            checkList: function (node, arr) {
                // 保存当前选中的部门信息
                this.nowPosition = node;
            },
            // 将数据处理成tree结构
            toTreeData: function (data, attributes) {
                let resData = data;
                let tree = [];
                for (let i = 0; i < resData.length; i++) {
                    if (resData[i].parentId === attributes.rootId) {
                        let obj = {
                            id: resData[i][attributes.id],
                            parentId: resData[i][attributes.parentId],
                            name: resData[i][attributes.name],
                            departmentName: resData[i][attributes.departmentName],
                            mobile: resData[i][attributes.mobile],
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
                                        parentId: resData[j][attributes.parentId],
                                        name: resData[j][attributes.name],
                                        departmentName: resData[j][attributes.departmentName],
                                        mobile: resData[j][attributes.mobile],
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
            // 处理成tree需要的数格式
            setTreeData: function (data) {
                // 属性配置信息
                var attributes = {
                    id: 'id',
                    parentId: 'parentId',
                    name: 'name',
                    departmentName: 'departmentName',
                    mobile: 'mobile',
                    rootId: 0
                };
                var treeData = this.toTreeData(data, attributes);
                this.treeData = treeData;
                console.log(this.treeData);
            },
            // 保存
            save: function () {
                if (this.flag) {
                    this.flag = false;
                    // 如果勾选的人数大于0
                    if (this.isMove) {
                        // 没有勾选的人员id
                        var notCheckedId = (function () {
                            var arr = [];
                            // 所有的人
                            var personData = this.personData;
                            // 已经勾选的人
                            var checkedList = this.checkOption;
                            if (checkedList.length == 0) {
                                for (var k = 0; k < personData.length; k++) {
                                    arr.push(personData[k].doctorinfoId);
                                }
                            } else {
                                for (var i = 0; i < checkedList.length; i++) {
                                    var nowCheckId = checkedList[i];
                                    for (var k = 0; k < personData.length; k++) {
                                        if (personData[k].doctorinfoId != nowCheckId) {
                                            arr.push(personData[k].doctorinfoId);
                                        }
                                    }
                                }
                            }
                            return arr;
                        }.bind(this))();
                        // 勾选的
                        var chekedResult = ServerAPI.saveCheckPerson({
                            roleId: this.$route.params.id,
                            userList: this.checkOption.join(',')
                        });
                        checkedList.then(function (res) {
                            this.flag = true;
                            if (res.status == 200) {
                                this.$alert('设置成功', '提示', {
                                    confirmButtonText: "确定",
                                    callback: function (action) {}
                                });
                            }
                        }.bind(this)).catch(function (err) {
                            this.flag = true;
                            if (err.statusText == 'timeout') {
                                this.$alert('请求超时，请重新提交', '提示', {
                                    confirmButtonText: "确定",
                                    callback: function (action) {}
                                });
                            }
                        }.bind(this));
                    }
                }
            },
            cancel: function () {
                history.go(-1)
            },
            // 初始获取部门数据
            getSectionData: function () {
                var result = ServerAPI.getSectionData();
                result.then(function (res) {
                    if (res.status == 200) {
                        // 原始数据
                        this.serverData = res.content //部门列表的服务器数据;
                        // 处理成tree数据
                        this.setTreeData(res.content);
                    }
                }.bind(this)).catch(function (err) {
                    if (err.statusText == 'timeout') {
                        this.$alert('请求超时，请刷新页面', '提示', {
                            confirmButtonText: "确定",
                            callback: function (action) {}
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
                this.positionData = treeData;

            },
            //获取人员列表
            personList: function () {
                var personListResult = ServerAPI.getPersonList({
                    ids: this.arrId.join(',')
                });
                // result.then(function (res) {
                //     if (res.status == 200) {
                //         var content = res.content;
                //         var personDataObj = [];
                //         for (var i = 0; i < content.length; i++) {
                //             var obj = {};
                //             // 防止doctorinfoId为空
                //             if (content[i].doctorinfoId) {
                //                 obj.doctorinfoId = parseInt(content[i].doctorinfoId);
                //                 obj.realName = content[i].realName || '';
                //                 obj.mobile = content[i].mobile || '';
                //                 obj.option = 'false' //已经拥有角色标识字段
                //                 personDataObj.push(obj);
                //             }
                //         }
                //         personDataObj = personDataObj.concat(this.powerList);
                //         // 部门所有的人
                //         this.personData = personDataObj;

                //         console.log('aaaaaaaaaaa', this.personData);
                //         // 已经勾选的人员列表
                //         this.checkOption = this.personChecked(this.personData);
                //         console.log(this.personData);
                //         console.log(this.checkOption);
                //     }
                // }.bind(this)).catch(function (err) {
                //     if (err.statusText == 'timeout') {
                //         this.$alert('请求超时，请刷新页面', '提示', {
                //             confirmButtonText: "确定",
                //             callback: function (action) {}
                //         });
                //     }
                // }.bind(this));


                var powerUserListResult = ServerAPI.powerUserList({
                    id: this.$route.params.id
                });



                Promise.all([personListResult, powerUserListResult]).then(function (results) {
                    this.flag = true;
                    if (results[0].status == 200 && results[1].status == 200) {
                        // var content = results[0].content;
                        // var personDataObj = [];
                        // for (var i = 0; i < content.length; i++) {
                        //     var obj = {};
                        //     // 防止doctorinfoId为空
                        //     if (content[i].doctorinfoId) {
                        //         obj.doctorinfoId = parseInt(content[i].doctorinfoId);
                        //         obj.realName = content[i].realName || '';
                        //         obj.mobile = content[i].mobile || '';
                        //         obj.option = 'false' //已经拥有角色标识字段
                        //         personDataObj.push(obj);
                        //     }
                        // };

                        var personDataObj = (function (data) {
                            console.log('bbbbbbbb', data);
                            var arr = [];
                            for (var i = 0; i < data.length; i++) {
                                var obj = {};
                                // 防止doctorinfoId为空
                                if (data[i].doctorinfoId) {
                                    obj.doctorinfoId = data[i].doctorinfoId;
                                    obj.realName = data[i].realName || '';
                                    obj.mobile = data[i].mobile || '';
                                    obj.option = 'false' //已经拥有角色标识字段
                                    arr.push(obj);
                                }
                            };
                            return arr;
                        })(results[0].content);

                        var allPowerPerson = (function (data) {
                            console.log('cccccccc', data);
                            var arr = [];
                            for (var i = 0; i < data.length; i++) {
                                var obj = {};
                                obj.doctorinfoId = data[i].id;
                                obj.realName = data[i].realName || '';
                                obj.mobile = data[i].mobile || '';
                                obj.option = 'true' //已经拥有角色标识字段
                                arr.push(obj);
                            }
                            return arr;
                        })(results[1].content.doctorInfoList);


                        var allPerson = allPowerPerson.concat(personDataObj);
                        console.log('allPerson', allPerson);

                        var notRepeatPerson = []; //新数组
                        for (var i = 0; i < allPerson.length; i++) {　　
                            var flag = true;　　
                            for (var j = 0; j < notRepeatPerson.length; j++) {　　　　
                                if (allPerson[i].doctorinfoId == notRepeatPerson[j].doctorinfoId) {　　　　　　
                                    flag = false;　　　　
                                };　　
                            };　　
                            if (flag) {　　　　
                                notRepeatPerson.push(allPerson[i]);　　
                            };
                        };
                        this.personData = notRepeatPerson;
                        this.checkOption = this.personChecked(this.personData);
                    }
                }.bind(this)).catch(function (err) {
                    if (err.statusText == 'timeout') {
                        this.$alert('请求超时，请刷新页面', '提示', {
                            confirmButtonText: "确定",
                            callback: function (action) {}
                        });
                    }
                }.bind(this));

            },
            // 将勾选的人的id收集出来
            personChecked: function (data) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].option == 'true') {
                        arr.push(data[i].doctorinfoId);
                    }
                }
                return arr;
            },
            // 当前点击的节点，将=当前节点的id和子节点的id全部收集成数组，发送给服务器
            filterClick: function (data, node, ele) {
                this.arrId = this._getArrId(data);
                this.personList()
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
            // 收集当前节点和子节点的id
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
            // 到左边，到右边
            handleChange: function (value, direction, movedKeys) {
                console.log(value, direction, movedKeys);
                // value值就是目前已经勾选的人员id
                // 将id发送给服务器
                this.isMove = true;
            },
            // 查看角色人员
            powerUserList: function () {
                var result = ServerAPI.powerUserList({
                    id: this.$route.params.id
                });
                result.then(function (res) {
                    if (res.status == '200') {
                        // this.powerList = res.content.alldoctorInfo;
                        // 收集所有有角色权限的人
                        var allPowerPerson = (function (data) {
                            var arr = [];
                            for (var i = 0; i < data.length; i++) {
                                var obj = {};
                                obj.doctorinfoId = data.doctorinfoId;
                                obj.realName = data.realName || '';
                                obj.mobile = data.mobile || '';
                                obj.option = 'true' //已经拥有角色标识字段
                            }
                            return arr;
                        })(res.content.alldoctorInfo)
                        this.powerList = allPowerPerson;
                        this.personData = this.personData.concat(this.powerList);
                        console.log('aaaaaaaaaaa', this.personData);
                    }
                })
            }

        },
        watch: {
            filterPerson: function (val) {
                this.$refs.organizationTree.filter(val);
            },
            filterSelect: function (val) {
                this.$refs.personSelect.filter(val);
            },
            positionData: function (value) {
                // 获取选中的部门
                this.arrId = this._getArrId(value[0]);
                // 获取根部门的人员
                this.personList();
            }
        },
        created: function () {
            // 获取部门列表
            this.getSectionData();
            // this.powerUserList();
        }
    };
});
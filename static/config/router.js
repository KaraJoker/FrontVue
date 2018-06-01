'use strict';

define([
    'VueRouter',
    'layout',
], function (
    VueRouter,
    layout
) {
    return new VueRouter({
        routes: [{
            path: '/',
            component: layout,
            redirect: '/home/reportCount',
            children: [{
                path: 'home',
                redirect: '/home/reportCount',
                components: {
                    aside: function (resolve) {
                        require(['homeAside'], resolve);
                    },
                    content: {
                        template: '<router-view></router-view>'
                    }
                },
                children: [{
                        path: 'reportCount',
                        component: function (resolve) {
                            require(['home'], resolve);
                        },
                        meta: {
                            asideActive: '/home/reportCount',
                            bread: ['首页', '解读报告']
                        },
                    }, {
                        path: 'unscramble',
                        component: function (resolve) {
                            require(['unscramble'], resolve);
                        },
                        meta: {
                            asideActive: '/home/unscramble',
                            bread: ['首页', '我的解读']
                        },
                    },
                    {
                        path: 'audit',
                        component: function (resolve) {
                            require(['audit'], resolve);
                        },
                        meta: {
                            asideActive: '/home/audit',
                            bread: ['首页', '认证审核']
                        },
                    }, {
                        path: 'auditDetail/:waitUserId/:waitId',
                        name: 'auditDetailWait',
                        component: function (resolve) {
                            require(['auditDetail'], resolve);
                        },
                        meta: {
                            asideActive: '/home/audit',
                            bread: ['首页', '认证审核', '认证详情']
                        },
                    }, {
                        path: 'auditDetail/:yetUserId/:yetId/:type',
                        name: 'auditDetailYet',
                        component: function (resolve) {
                            require(['auditDetail'], resolve);
                        },
                        meta: {
                            asideActive: '/home/audit',
                            bread: ['首页', '认证审核', '认证详情']
                        },
                    },
                    {
                        path: 'userInfo',
                        name: 'userInfo',
                        component: function (resolve) {
                            require(['userInfo'], resolve);
                        },
                        meta: {
                            asideActive: '/home/userInfo',
                            bread: ['首页', '个人信息']
                        },
                    },
                    {
                        path: 'changeAccount/:mobile',
                        name: 'changeAccount',
                        component: function (resolve) {
                            require(['changeAccountForm'], resolve);
                        },
                        meta: {
                            asideActive: '/home/userInfo',
                            bread: ['首页', '个人信息', '修改账号']
                        }
                    },
                    {
                        path: 'attestation',
                        name: 'attestation',
                        component: function (resolve) {
                            require(['attestation'], resolve);
                        },
                        meta: {
                            asideActive: '/home/attestation',
                            bread: ['首页', '我的认证']
                        }
                    }, {
                        path: 'changePwd',
                        component: function (resolve) {
                            require(['changePwdForm'], resolve);
                        },
                        meta: {
                            asideActive: '/home/changePwd',
                            bread: ['首页', '修改密码']
                        }
                    }

                ]
            }, {
                path: 'report',
                redirect: '/report/reportHeart',
                components: {
                    aside: function (resolve) {
                        require(['reportAside'], resolve);
                    },
                    content: {
                        template: '<router-view></router-view>'
                    }
                },
                children: [{
                        path: 'reportHeart',
                        component: function (resolve) {
                            require(['reportHeart'], resolve);
                        },
                        meta: {
                            asideActive: '/report/reportHeart',
                            bread: ['报告', '心电报告']
                        }
                    }, {
                        path: 'reportThermometer',
                        component: function (resolve) {
                            require(['reportThermometer'], resolve);
                        },
                        meta: {
                            asideActive: '/report/reportThermometer',
                            bread: ['报告', '体温报告']
                        }
                    }, {
                        path: 'reportBed',
                        component: function (resolve) {
                            require(['reportBed'], resolve);
                        },
                        meta: {
                            asideActive: '/report/reportBed',
                            bread: ['报告', '睡眠报告']
                        }
                    }, {
                        path: 'reportDetailTwo/:reportId/:type',
                        name: 'reportDetailSee',
                        component: function (resolve) {
                            require(['reportDetailTwo'], resolve);
                        },
                        meta: {
                            asideActive: '/report/reportHeart',
                            bread: ['报告', '心电报告', '报告详情']
                        }
                    }, {
                        // 诊断报告进入报告详情
                        path: 'reportDetailTwo/:reportId/:type/:doctorId',
                        name: 'reportDetailDeal',
                        component: function (resolve) {
                            require(['reportDetailTwo'], resolve);
                        },
                        meta: {
                            asideActive: '/report/reportHeart',
                            bread: ['报告', '心电报告', '报告详情']
                        }
                    }, {
                        path: 'reportAbnormalType/:reportId/:type',
                        name: 'reportAbnormalType',
                        component: function (resolve) {
                            require(['reportAbnormalType'], resolve);
                        },
                        meta: {
                            asideActive: '/report/reportHeart',
                            bread: ['报告', '心电报告', '报告详情', '异常统计']
                        }
                    },
                    {
                        path: 'reportAbnormalTypeDetail/:reportId/:type/:diseaseType/:diseaseMode',
                        name: 'reportAbnormalTypeDetail',
                        component: function (resolve) {
                            require(['reportAbnormalTypeDetail'], resolve);
                        },
                        meta: {
                            asideActive: '/report/reportHeart',
                            bread: ['报告', '心电报告', '报告详情', '异常统计']
                        }
                    }
                ]
            }, {
                path: 'system',
                redirect: '/system/organization',
                components: {
                    aside: function (resolve) {
                        require(['systemAside'], resolve);
                    },
                    content: {
                        template: '<router-view></router-view>'
                    }
                },
                children: [{
                    path: 'organization',
                    name: 'organization',
                    component: function (resolve) {
                        require(['organization'], resolve);
                    },
                    meta: {
                        asideActive: '/system/organization',
                        bread: ['系统管理', '组织架构']
                    }
                }, {
                    path: 'organizationEdit/:parentId',
                    name: 'organizationAdd',
                    component: function (resolve) {
                        require(['organizationEdit'], resolve);
                    },
                    meta: {
                        asideActive: '/system/organization',
                        bread: ['系统管理', '组织架构', '添加部门']
                    }
                }, {
                    path: 'organizationEdit/:id/:childArr',
                    name: 'organizationEdit',
                    component: function (resolve) {
                        require(['organizationEdit'], resolve);
                    },
                    meta: {
                        asideActive: '/system/organization',
                        bread: ['系统管理', '组织架构', '编辑部门']
                    }
                }, {
                    path: 'powerManage',
                    name: 'powerManage',
                    component: function (resolve) {
                        require(['powerManage'], resolve);
                    },
                    meta: {
                        asideActive: '/system/powerManage',
                        bread: ['系统管理', '权限管理']
                    }
                }, {
                    path: 'choicePerson/:id',
                    name: 'choicePerson',
                    component: function (resolve) {
                        require(['choicePerson'], resolve);
                    },
                    meta: {
                        asideActive: '/system/powerManage',
                        bread: ['系统管理', '组织架构', '选择人员']
                    }
                }, {
                    path: 'setPower/:id',
                    name: 'setPower',
                    component: function (resolve) {
                        require(['setPower'], resolve);
                    },
                    meta: {
                        asideActive: '/system/powerManage',
                        bread: ['系统管理', '组织架构', '设置权限']
                    }
                }, {
                    path: 'powerPerson',
                    name: 'powerPersonAdd',
                    component: function (resolve) {
                        require(['powerPerson'], resolve);
                    },
                    meta: {
                        asideActive: '/system/powerManage',
                        bread: ['系统管理', '组织架构', '添加角色']
                    }
                }, {
                    path: 'powerPerson/:id',
                    name: 'powerPersonEdit',
                    component: function (resolve) {
                        require(['powerPerson'], resolve);
                    },
                    meta: {
                        asideActive: '/system/powerManage',
                        bread: ['系统管理', '组织架构', '编辑角色']
                    }
                }, {
                    path: 'personManage',
                    name: 'personManage',
                    component: function (resolve) {
                        require(['personManage'], resolve);
                    },
                    meta: {
                        asideActive: '/system/personManage',
                        bread: ['系统管理', '人员管理']
                    }
                }, {
                    path: 'personManageAddEdit',
                    name: 'personManageAdd',
                    component: function (resolve) {
                        require(['personManageAddEdit'], resolve);
                    },
                    meta: {
                        asideActive: '/system/personManage',
                        bread: ['系统管理', '人员管理', '人员添加']
                    }
                }, {
                    path: 'personManageAddEdit/:id',
                    name: 'personManageEdit',
                    component: function (resolve) {
                        require(['personManageAddEdit'], resolve);
                    },
                    meta: {
                        asideActive: '/system/personManage',
                        bread: ['系统管理', '人员管理', '人员编辑']
                    }
                }, {
                    path: 'systemLog',
                    name: 'systemLog',
                    component: function (resolve) {
                        require(['systemLog'], resolve);
                    },
                    meta: {
                        asideActive: '/system/systemLog',
                        bread: ['系统管理', '操作日志']
                    }
                }, {
                    path: 'systemLogDetail/:id',
                    name: 'systemLogDetail',
                    component: function (resolve) {
                        require(['systemLogDetail'], resolve);
                    },
                    meta: {
                        asideActive: '/system/systemLog',
                        bread: ['系统管理', '操作日志', '日志详情']
                    }
                }, {
                    path: 'systemSet',
                    name: 'systemSet',
                    component: function (resolve) {
                        require(['systemSet'], resolve);
                    },
                    meta: {
                        asideActive: '/system/systemSet',
                        bread: ['系统管理', '系统设置']
                    }
                }]
            }, {
                path: 'message',
                redirect: '/message/messageCenter',
                components: {
                    aside: function (resolve) {
                        require(['messageAside'], resolve);
                    },
                    content: {
                        template: '<router-view></router-view>'
                    }
                },
                children: [{
                    path: 'messageCenter',
                    name: 'messageCenter',
                    component: function (resolve) {
                        require(['messageCenter'], resolve);
                    },
                    meta: {
                        asideActive: '/message/messageCenter',
                        bread: ['消息', '消息中心']
                    }
                }, {
                    path: 'messageSet',
                    name: 'messageSet',
                    component: function (resolve) {
                        require(['messageSet'], resolve);
                    },
                    meta: {
                        asideActive: '/message/messageSet',
                        bread: ['消息', '设置']
                    }
                }]
            }, {
                path: 'help',
                redirect: '/help/helpCenter',
                components: {
                    aside: function (resolve) {
                        require(['helpAside'], resolve);
                    },
                    content: {
                        template: '<router-view></router-view>'
                    }
                },
                children: [{
                    path: 'helpCenter',
                    name: 'helpCenter',
                    component: function (resolve) {
                        require(['help'], resolve);
                    },
                    meta: {
                        bread: ['帮助中心']
                    }
                }, {
                    path: 'feedBack',
                    name: 'feedBack',
                    component: function (resolve) {
                        require(['feedBack'], resolve);
                    },
                    meta: {
                        bread: ['帮助中心', '意见反馈']
                    }
                }]
            }]
        }]
    });
});
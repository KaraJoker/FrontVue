requirejs.config({
    baseUrl: baseUrl,
    paths: {
        text: "lib/text",
        vue: 'lib/vue',
        vuex: 'lib/vuex',
        VueResource: 'lib/vue-resource.min',
        VueRouter: 'lib/vue-router',
        ELEMENT: 'lib/element-ui/lib/index',
        axios: 'lib/axios.min',
        polyfill: 'lib/polyfill.min',
        ServerAPI: 'config/api',
        echarts: 'lib/echarts',
        jquery: 'lib/jquery-3.3.1.min',
        bytebuffer: 'lib/bytebuffer',
        long: 'lib/long',
        protobuf: 'lib/protobuf',
        ERROR: 'config/ERROR',
        // store中心
        store: 'store/store',
        // layout
        layout: 'components/theLayout/theLayout',
        // 路由
        router: 'config/router',
        // mixins
        mixins: 'config/mixins',
        // head组件
        theHead: 'components/theHead/theHead',
        theBread: 'components/theBread/theBread',
        theContent: 'components/theContent/theContent',
        // 基础组件
        baseProgress: 'components/baseProgress/baseProgress',
        baseImgUpload: 'components/baseImgUpload/baseImgUpload',

        // 首页
        home: 'container/home/home',
        homeAside: 'components/homeAside/homeAside',
        homeIndexEcharSelect: 'components/homeIndexEcharSelect/homeIndexEcharSelect',
        homeIndexCountPercent: 'components/homeIndexCountPercent/homeIndexCountPercent',
        homeIndexCountLine: 'components/homeIndexCountLine/homeIndexCountLine',
        homeIndexTypeBar: 'components/homeIndexTypeBar/homeIndexTypeBar',
        homeIndexTypeLine: 'components/homeIndexTypeLine/homeIndexTypeLine',
        homeIndexMonthLine: 'components/homeIndexMonthLine/homeIndexMonthLine',
        homeIndexCountPerson: 'components/homeIndexCountPerson/homeIndexCountPerson',
        auditDetail: 'container/auditDetail/auditDetail',
        audit: 'container/audit/audit',

        // 修改账号页组件
        changeAccountForm: 'container/changeAccountForm/changeAccountForm',
        // 修改密码页组件
        changePwdForm: 'container/changePwdForm/changePwdForm',
        // 找回密码页组件
        findPwdForm: 'container/findPwdForm/findPwdForm',
        // 注册页面组件
        registerForm: 'container/registerForm/registerForm',
        // 登录
        loginForm: 'container/loginForm/loginForm',
        // 认证页面
        attestation: 'container/attestation/attestation',
        // 个人信息
        userInfo: 'container/userInfo/userInfo',
        // 我的解读
        unscramble: 'container/unscramble/unscramble',

        // 心电报告
        reportHeart: 'container/reportHeart/reportHeart',
        // 体温报告
        reportThermometer: 'container/reportThermometer/reportThermometer',
        // 睡眠报告
        reportBed: 'container/reportBed/reportBed',
        reportUserDetail: 'components/reportUserDetail/reportUserDetail',
        reportAside: 'components/reportAside/reportAside',
        reportTable: 'components/reportTable/reportTable',
        // 报告详情
        reportDetailTwo: 'container/reportDetailTwo/reportDetailTwo',
        reportDetailHeart: 'components/reportDetailHeart/reportDetailHeart',
        reportErrorAside: 'components/reportErrorAside/reportErrorAside',
        reportSuggest: 'components/reportSuggest/reportSuggest',
        // 疾病列表，那个类型疾病，那个模板
        reportDiseaseList: 'components/reportDiseaseList/reportDiseaseList',
        reportDiseaseListShort: 'components/reportDiseaseListShort/reportDiseaseListShort',
        // 报告异常片段详情
        reportAbnormalType: 'container/reportAbnormalType/reportAbnormalType',
        // 复核异常片段
        reportAbnormalTypeDetail: 'container/reportAbnormalTypeDetail/reportAbnormalTypeDetail',
        // 系统设置
        systemAside: 'components/systemAside/systemAside',
        // 系统公告
        systemNotice: 'container/systemNotice/systemNotice',
        systemNoticeAddEdit: 'container/systemNoticeAddEdit/systemNoticeAddEdit',
        systemNoticeSee: 'container/systemNoticeSee/systemNoticeSee',
        // 组织架构
        organization: 'container/organization/organization',
        // 组织架构编辑
        organizationEdit: 'container/organizationEdit/organizationEdit',
        // 权限管理
        powerManage: 'container/powerManage/powerManage',
        // 选择人员
        choicePerson: 'container/choicePerson/choicePerson',
        // 设置权限
        setPower: 'container/setPower/setPower',
        setPowerCheckbox: 'components/setPowerCheckbox/setPowerCheckbox',
        // 添加角色，编辑角色
        powerPerson: 'container/powerPerson/powerPerson',
        // 人员管理
        personManage: 'container/personManage/personManage',
        personManageAddEdit: 'container/personManageAddEdit/personManageAddEdit',
        // 操作日志
        systemLog: 'container/systemLog/systemLog',
        // 操作日志详情
        systemLogDetail: 'container/systemLogDetail/systemLogDetail',
        systemSet: 'container/systemSet/systemSet',

        // 消息
        messageCenter: 'container/messageCenter/messageCenter',
        messageSet: 'container/messageSet/messageSet',
        messageAside: 'components/messageAside/messageAside',

        // 帮助中心
        help: 'container/help/help',
        helpAside: 'components/helpAside/helpAside',
        // 意见反馈
        feedBack: 'container/feedBack/feedBack',

    },
    shim: {　　　　　　
        'axios': {　　　　　　　　
            deps: ['polyfill'],
            exports: 'axios'　　　　　　
        },
        　　
        'VueResource': {　　　　　　　　
            deps: ['vue'],
            exports: 'VueResource'　　　　　　
        },
    },
    map: {
        '*': {
            'css': '/lib/css.min.js' // or whatever the path to require-css is
        }
    },
    waitSeconds: 0
});
module.exports = [{
        name: 'name',
        message: '请输入项目名称',
        default: '{outFolder}',
        filter: val => val.toLowerCase()
    },
    {
        name: 'description',
        message: '请输入项目简介',
        default: 'my {outFolder} project'
    },
    {
        name: 'device',
        message: '选择设备类型',
        type: 'list',
        choices: [
            { name: '移动端', value: 'mobile' },
            { name: '桌面端', value: 'pc' }
        ],
        default: 'mobile'
    },
    {
        name: 'ui',
        message: '选择ui框架',
        type: 'list',
        pageSize: 15,
        choices: [
            { name: 'None', value: 'none' },
            { name: 'Element-UI', value: 'element-ui' },
            { name: 'iView', value: 'iview' },
            { name: 'Ant Design Vue', value: 'ant-design-vue' },
        ],
        default: 'none'
    },
    {
        name: 'mode',
        message: '选择页面模式',
        type: 'list',
        choices: [
            { name: '单页面（SPA）', value: 'spa' },
            { name: '多页面', value: 'universal' }
        ],
        default: 'spa'
    },
    {
        name: 'extra',
        message: '额外模块',
        type: 'checkbox',
        pageSize: 10,
        choices: [
            { name: 'px2rem', value: 'px2rem' },
            { name: 'PostCSS', value: 'postcss' },
            { name: '抽取css', value: 'extract' },
        ],
        default: []
    },
    {
        name: 'npmInstall',
        message: '完成后立即安装npm依赖',
        type: 'list',
        choices: [
            { name: '是', value: 'yes' },
            { name: '否', value: 'no' }
        ],
        default: 'yes'
    },
];
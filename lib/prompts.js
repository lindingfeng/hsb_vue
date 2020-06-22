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
        name: 'ui',
        message: '选择ui框架',
        type: 'list',
        pageSize: 15,
        choices: [
            { name: 'None', value: 'none' },
            { name: 'Ant Design Vue', value: 'ant-design-vue' },
            { name: 'Element-UI', value: 'element-ui' },
            { name: 'iView', value: 'iview' },
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
];
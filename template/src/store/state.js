const ua = navigator.userAgent.toLocaleLowerCase();
const IS_ANDROID = ua.indexOf('android') !== -1;
const IS_IOS = ua.indexOf('iphone') !== -1;
const IS_NATIVE = IS_ANDROID || IS_IOS;

const ENVQuery = () => {
    if (ua.includes('alipayclient')) return 'alipay';
    if (ua.includes('micromessenger')) return 'wechat';
    if (IS_NATIVE) return 'mobile';
    return 'pc';
};

export default {
    title: '',

    IS_ANDROID: IS_ANDROID,
    IS_IOS: IS_IOS,
    IS_NATIVE: IS_NATIVE,
    ENV: ENVQuery(),

    // 验证码倒计时
    downTime: 60,

    // 当前路由
    currentRoutePath: '',

    // 接口状态码
    apiStateKey: {},

    // 第三方资源加载状态
    third: {
        networkType: null,
        wxjs: false,
        wxSign: false
    },
};

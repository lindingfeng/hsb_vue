import { env } from './env.config';

let wechat = {
    sdk: '//res.wx.qq.com/open/js/jweixin-1.2.0.js',
};

let baidu = {
    ak: 'xxx',
    geoconvV1: '//api.map.baidu.com/geoconv/v1/',       // 转换坐标
    geocoderV2: '//api.map.baidu.com/geocoder/v2/'      // 坐标转出地址
};
baidu.sdk = '//api.map.baidu.com/api?v=2.0&s=1&ak=' + baidu.ak;

let config = {
    local: {
        wechat,
        baidu
    },
    test: {
        wechat,
        baidu
    },
    product: {
        wechat,
        baidu
    }
};

export default config[env];

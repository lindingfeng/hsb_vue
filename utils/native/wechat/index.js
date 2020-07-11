import thirdApiConfig from '@/config/thirdApiConfig';
import ajax from '@/utils/ajax';
import ResourceLoader from '@/utils/resourceLoader';

let Wechat = {
    isLoad: false,  // 是否加载过,
    isReady: false, // 是否注册过
    configSign: {},     // 签名信息
    params: {},

    init(cb, params = {}) {
        if (typeof wx !== 'undefined') {
            this.setLoadState(true);
            return cb('success');
        }
        if (this.isLoad) return cb('success');
        this.params = params
        ResourceLoader(thirdApiConfig.wechat.sdk, (loadState) => {
            if (loadState === 9999) return cb('loading', "加载中");
            if (loadState === -1) return cb('error', "资源加载超时, 请稍后重试");
            if (loadState === 0) return cb('error', "资源加载失败, 网络错误");
            if (loadState === 1) {
                this.setLoadState(true);
                cb('success');
            }
        });
    },

    setLoadState(isLoad) {
        this.isLoad = isLoad;
    },

    setReadyState(isReady) {
        this.isReady = isReady;
    },

    // 获取签名
    getSign(cb) {
        let loca = window.location;
        let url = loca.origin + loca.pathname + loca.search;
        let xmlHttp = ajax.post({
            url: this.params.api,
            data: {
                url: url
            }
        });
        xmlHttp.promise.then((res) => {
            res = (typeof res === 'object') ? res : JSON.parse(res);
            if (~~res.code !== 0) {
                cb('error', res.message || '操作异常!');
            } else {
                let config = res.data || {};
                if (!Object.keys(config).length) {
                    cb('error', '未获取到签名信息');
                } else {
                    Object.assign(this.configSign, config);
                    cb('success', config);
                }
            }
        }, (error) => {
            this.setReadyState(false);
            cb('error', '签名网络错误');
        }).catch((data = {}) => {
            cb('error', JSON.stringify(data));
        });
    },

    // 注册接口
    apiRegister(cb) {
        // 如果已经注册过, 不在多次注册
        if (this.isReady) return cb('success');

        // 获取签名
        this.getSign((type, msg) => {
            if (type === 'error') return cb(type, msg);
            let triggerError = false;

            // 微信初始化失败处理
            wx.error((res = {}) => {
                if (!res.errMsg) return;
                triggerError = true;
                this.setReadyState(false);
                cb('error', res.errMsg);
            });
            window.wxConfig = msg;
            wx.config(msg);
            wx.ready((data) => {
                if (triggerError) return;
                this.setReadyState(true);
                cb('success');
            });
        });
    }
};

export default Wechat;

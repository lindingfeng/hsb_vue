import Wechat from './wechat/index';
import WechatSdk from './wechat/sdk';
const ua = navigator.userAgent.toLocaleLowerCase();
const alipayEnv = ua.includes("alipayclient");
const wechatEnv = ua.includes('micromessenger');

let Entry = {

    // 根据环境初始化native包
    init(cb, params) {
        if (wechatEnv) {
            Wechat.init((type, data) => {
                cb(type, data, 1);
                if (type === 'success') {
                    Wechat.apiRegister((type, data) => {

                        // 签名失败
                        if (type === 'error') {
                            cb(type, data, 2);
                            console.error(data);
                        }

                        // 签名成功
                        if (type === 'success') cb(type, 'ok', 2);
                    });
                }
            }, params);
        }
    },

    // 选择照片
    // @return 'type' [cancel, error, success]
    // @description (success, base64字符串), (error, '错误信息')
    chooseImage(options) {
        if (wechatEnv) {
            WechatSdk.chooseImage({
                callback: (type, data) => {
                    if (type === 'cancel') return options.callback(type);
                    if (type === 'error') {
                        options.callback(type, data);
                        return console.error('chooseImage, ' + data);
                    }
                    WechatSdk.getLocalImgData({
                        localId: data,
                        callback: (type, data) => {
                            options.callback(type, data);
                        }
                    });
                }
            });
        }
    },

    // 支付
    choosePay(options) {
        if (wechatEnv) {
            WechatSdk.chooseWXPay(options);
        }
    },

    // 获取网络状态接口
    getNetworkType(callback) {
        if (wechatEnv) {
            WechatSdk.getNetworkType(callback);
        }
    },

    // 请求进行基于生物识别的人脸核身
    requestWxFacePictureVerify(options) {
        if (wechatEnv) {
            WechatSdk.requestWxFacePictureVerify(options);
        }
    },

    // 请求进行基于生物识别的人脸核身
    requestWxFacePictureVerifyUnionVideo(options) {
        if (wechatEnv) {
            WechatSdk.requestWxFacePictureVerifyUnionVideo(options);
        }
    },

    // 检查设备是否支持人脸检测
    checkIsSupportFaceDetect(options) {
        if (wechatEnv) {
            return WechatSdk.checkIsSupportFaceDetect(options);
        }
        options('error');
    },

    // 调用视频
    chooseVideo(options) {
        if (wechatEnv) {
            WechatSdk.chooseVideo(options);
        }
    },

    // 上传视频
    uploadVideo(options) {
        if (wechatEnv) {
            WechatSdk.uploadVideo(options);
        }
    },
};

export default Entry;

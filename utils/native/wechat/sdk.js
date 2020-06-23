const ua = navigator.userAgent.toLocaleLowerCase();
const IS_ANDROID = ua.indexOf('android') !== -1;
const IS_IOS = ua.indexOf('iphone') !== -1;

// 活体关联code
let faceVideReation = {
    10001: "参数错误",
    10002: "人脸特征检测失败",
    10003: "身份证号不匹配",
    10004: "公安比对人脸信息不匹配",
    10005: "正在检测中",
    10006: "appid没有权限",
    10007: "后台获取图片失败",
    10008: "公安系统失败",
    10009: "公安未查到身份证照片比对源",
    10010: "照片质量不满足公安比对要求",
    10011: "身份证信息未开通公安比对权限",
    10012: "征信验证失败",
    10013: "征信系统错误",
    10014: "公安系统失败，征信系统成功",
    10015: "公安服务暂时不可用",
    10016: "存储用户图片失败",
    10017: "非法identify_id",
    10018: "用户信息不存在",
    10020: "认证超时",
    10021: "重复的请求，返回上一次的结果",
    10022: "用户信息错误，请检测json格式",
    10026: "用户身份证数据不在公安比对数据库中",
    10027: "语音识别失败",
    10028: "唇动检测失败",
    10029: "微警超时",
    10030: "绑定身份证失败",
    10031: "没有申请征信商户号或公众号/小程序没有设置昵称",
    10032: "用户身份证数据不再征信数据库中",
    10040: "请求数据编码不对，必须是UTF8 编码",
    10041: "非法user_id_key",
    10042: "请求过于频繁，稍后再重试",
    10045: "系统失败",
    10052: "请求数超时征信的限制",
    10066: "人脸流水号bioid重复",
    10069: "活体检测暂时不可用",
    90100: "已取消",
    90101: "用户未授权",
    90102: "底层库出错",
    90103: "CDN上传出错",
    90104: "获取配置信息出错",
    90105: "获取确认页信息失败",
    90106: "相机初始化失败",
    90107: "用户采集人脸超时",
    90108: "用户采集过程中都动态剧烈",
    90109: "设备不支持人脸采集",
    90199: "未知错误"
};

// 是否支持人脸接口
let checkIsFaceReation = {
    10001: "设备没有前置摄像头",
    10002: "没有下载到必要模型",
    10003: "后台黑名单控制"
};

let Sdk = {

    // 解析照片成base64
    getLocalImgData(options = {}) {
        if (!options.localId) return options.callback('error', 'localId不能为空');

        if (typeof wx.getLocalImgData === "undefined") {
            let str = 'undefined is wx.getLocalImgData';
            options.callback('error', str);
            return console.error(str);
        }

        wx.getLocalImgData({
            localId: options.localId, // 图片的localID
            success: (res = {}) => {
                let baseStr = res.localData; // localData是图片的base64数据，可以用img标签显示
                if (!baseStr) {
                    options.callback('error', '获取图片数据出错');
                } else {
                    if (IS_ANDROID) baseStr = "data:image/jpeg;base64," + baseStr;
                    options.callback('success', baseStr);
                }
            }
        });
    },

    // 选择照片
    chooseImage(options = {}) {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 [ 'original', 'compressed' ]
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 [ 'album', 'camera']
            success: (res = {}) => {
                let ids = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                if (!ids.length) return;
                options.callback('success', ids[0]);
            },
            cancel: () => {
                options.callback('cancel');
            },
            fail: (msg) => {
                options.callback('error', msg);
            }
        });
    },

    // 支付
    chooseWXPay(options = {}) {
        //alert('支付参数：' + JSON.stringify(options));
        wx.chooseWXPay({
            timestamp: options.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: options.nonceStr, // 支付签名随机串，不长于 32 位
            package: options.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: options.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: options.paySign, // 支付签名
            success: (res = {}) => {
                let type = 'success', value = '';
                if (res.errMsg !== "chooseWXPay:ok") {
                    type = 'error';
                    value = "支付失败:" + res.errMsg;
                }
                options.callback(type, value);
            },
            cancel: () => {
                options.callback('cancel');
            },
            fail: () => {
                options.callback('error', '支付失败');
            }
        });
    },

    // 获取网络状态接口 返回网络类型2g，3g，4g，wifi
    getNetworkType(callback) {
        wx.getNetworkType({
            success: (res) => {
                callback(res.networkType);
            },
            fail: (msg) => {
                callback(null);
            }
        });
    },

    /**
     * @method requestWxFacePictureVerify
     * @description 请求进行基于生物识别的人脸核身, 兼容版本：android 6.5.4 及以上版本, iOS 6.5.6 及以上版本
     * @param {Object} options
     *      @param {String} appid 调用此jsapi的公众号appid
     *      @param {String} request_verify_pre_info json字符串
     *              @param {String} name 姓名
     *              @param {String} id_card_number 身份证号码
     * 
     * @returns {Object}
     *      ****
     *      @param {String} verify_result 本次认证结果凭据
     */
    requestWxFacePictureVerify(options = {}) {
        wx.invoke("requestWxFacePictureVerify", options.param, (res) => {
            if (res.err_code == 0) {
                options.callback('success', res.verify_result);
            } else {
                let ret = res.err_msg + " err_code: " + res.err_code;
                options.callback('error', ret);
                console.error('requestWxFacePictureVerify, code:' + res.err_code);
            }
        });
    },

    /**
     * @method requestWxFacePictureVerifyUnionVideo
     * @description 请求进行基于生物识别的人脸核身-并上传视频, 兼容版本：android 6.5.4 及以上版本, iOS 6.5.6 及以上版本
     * @param {Object} options
     *      @param {String} appid 调用此jsapi的公众号appid
     *      @param {String} request_verify_pre_info json字符串, 如果用user_id_key可以不用name和id_card_number
     *              @param {String} name 姓名
     *              @param {String} id_card_number 身份证号码
     *              @param {String} user_id_key 用户key
     * 
     * @returns {Object}
     *      ****
     *      @param {String} verify_result 本次认证结果凭据
     */
    requestWxFacePictureVerifyUnionVideo(options = {}) {
        try {
            wx.invoke("requestWxFacePictureVerifyUnionVideo", options.param, (res) => {
                let code = Number(res.err_code);
                let text = faceVideReation[code];

                if (code === 0) {
                    return options.callback('success', res.verify_result);
                }

                // 未知code上报给服务端
                if (!text) {
                    console.error('requestWxFacePictureVerifyUnionVideo：未知code：' + code);
                    code = null;
                }
                
                // V3.4新增人脸识别失败也拿取结果
                options.callback('error', text, code, res.verify_result);
            });
        } catch(err) {
            options.callback('error', '加载失败, 请刷新页面重试', 1);
            console.error('requestWxFacePictureVerifyUnionVideo：' + err);
        }
    },

    /**
     * @method checkIsSupportFaceDetect
     * @description 检查设备是否支持人脸检测
     * 
     * @returns {Object} 
     *      @param {Number} err_code 错误码 
     *      @param {String} err_msg 错误信息 
     *      @param {*} lib_version_code 人脸采集库版本号
     * 
     * @description err_code返回码说明
     *      0: 支持人脸采集 support 
     *      10001: 不支持人脸采集：设备没有前置摄像头 No front camera 
     *      10002: 不支持人脸采集：没有下载到必要模型 No necessary model found 
     *      10003: 不支持人脸采集：后台黑名单控制 Device is blacklisted
     */
    checkIsSupportFaceDetect(callback) {
        callback = callback || function() {};
        try {
            wx.invoke("checkIsSupportFaceDetect", {}, (res) => {
                let code = Number(res.err_code);

                if (code === 0) {
                    return callback('success', res.lib_version_code);
                }

                console.error('checkIsSupportFaceDetect：' + code);
                callback('error');
            });
        } catch(err) {
            callback('error');
            console.error('checkIsSupportFaceDetect：' + err);
        }
    },

    // 调用视频
    chooseVideo(options = {}) {
        let callback = options.callback || function() {};
        delete options.callback;
        options = Object.assign({
            sourceType: 'camera',
            maxDuration: 8,
            camera: 'front',
            front: true,
            isShowProgressTips: 0
        }, options);
        try {
            wx.invoke("chooseVideo", options, (res) => {
                debugger
                if (res.err_code == 0) {
                    callback('success', res.localId);
                } else {
                    let ret = res.err_msg + " err_code: " + res.err_code;
                    callback('error', ret);
                    console.error('chooseVideo, code:' + res.err_code);
                }
            });
        } catch(err) {
            callback('error');
            console.error('chooseVideo' + err);
        }
    },

    // 视频上传
    uploadVideo(options = {}) {
        let fnName = 'uploadVideo';
        let callback = options.callback || function() {};
        delete options.callback;
        options = Object.assign({
            appId: '',
            isShowProgressTips: 0,
            localId: ''
        }, options);
        try {
            wx.invoke(fnName, options, (res) => {
                if (res.err_code == 0) {
                    callback('success', res.serverId);
                } else {
                    let ret = res.err_msg + " err_code: " + res.err_code;
                    callback('error', ret);
                    console.error(fnName + ', code:' + res.err_code);
                }
            });
        } catch(err) {
            callback('error');
            console.error(fnName +  err);
        }
    },
};

export default Sdk;

import Transform from './transformLonlat';
/**
 * @description h5定位,仅用于https
 * @param {function} callback 回调(type: error, success, data: '信息')
 * @param {object} options 配置
 */
export default (callback, options = {}) => {
    let init, getLocation, watchPosition, supportsGeoLocation, mapIt, locationError;
    let relationErrorText = {
        1: '用户拒绝定位',
        2: '无法确定设备的位置, 内部错误',
        3: '响应超时'
    };

    // 检测浏览器是否支持HTML5
    supportsGeoLocation = () => {
        return !!navigator.geolocation;
    };

    // 单次位置请求执行的函数
    getLocation = (o) => {
        navigator.geolocation.getCurrentPosition(mapIt, locationError, o);
    };

    // 持续获取地理位置
    watchPosition = (o) => {
        navigator.geolocation.watchPosition(mapIt, locationError, o);
    };

    // 定位成功时，执行的函数
    mapIt = (position) => {
        let lon = position.coords.longitude,
            lat = position.coords.latitude;

        Transform.lonLat(lon, lat, {from: 3}, (type, data) => {
            callback(type, data);
        });
    };

    locationError = (err) => {
        callback('error', relationErrorText[err.code] || "定位失败");
    };

    init = (options) => {
        if (!supportsGeoLocation()) {
            return callback('error', "您的浏览器不支持定位！");
        }

        options.enableHighAccuracy = options.gpswifi || true;      // 参数表示是否高精度可用，为Boolean类型，默认为false
        options.maximumAge = options.time || 5000;                 // 表示应用程序的缓存时间。默认5秒
        options.timeout = options.timeout || 200000;                // 等待响应的最大时间，默认是20秒

        if (options.isWatch) {
            watchPosition(options);
        } else {
            getLocation(options);
        }
    };

    // Transform.lonLat('113.9627456', '22.5441039', {from: 3}, (type, data) => {
    //     callback(type, data);
    // });
    callback('loading', '正在获取位置');
    init(options);
};

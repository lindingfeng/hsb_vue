import thirdApiConfig from '@/config/thirdApiConfig';
const AK = thirdApiConfig.baidu.ak;
const API = thirdApiConfig.baidu.geoconvV1;         // 转换坐标
const API2 = thirdApiConfig.baidu.geocoderV2;       // 坐标转出地址
const errText = {
    1: "内部错误",
    2: '请求参数非法',
    3: '权限校验失败',
    4: '配额校验失败',
    5: 'ak不存在或者非法',
    21: "来源非法",
    22: "目标源非法",
    24: "经纬度格式非法",
    25: "经纬度个数非法，超过限制",
    101: '服务禁用',
    102: '不通过白名单或者安全码不对'
};

let ajaxJsonp = (param) => {
    let url = param.url;
    let data = param.data;
    let oBody = document.getElementsByTagName('body')[0];
    let oScript = document.createElement('script');
    let callbackName = 'cb' + (~~(Math.random()*0xffffff)).toString(16);

    let clear = () => {
        try {
            oBody.removeChild(oScript);
            clearTimeout(data.timer);
            window[callbackName] = null;
        } catch (err) {}
    };

    let format = (data) => {
        let str = '';
        for (let p in data) {
            str += encodeURIComponent(p) + '=' + encodeURIComponent(data[p]) + '&';
        }
        return str;
    };

    window[callbackName] = function(result) {
        clear();
        param.success(result);
    };

    data.callback = callbackName;
    data.v = callbackName;
    oScript.setAttribute('src', url + '?' + format(data));
    oBody.append(oScript);

    // 超时30s
    data.timer = setTimeout(() => {
        clear();
        param.error();
    }, 30000);
};

/**
 * @method renderReverse
 * @description 逆地理编码
 * MD http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding-abroad
 * @param {Object} param
 *      - location: 38.76623,116.43213 lat<纬度>,lng<经度>
 *      - coordtype: 坐标的类型，目前支持的坐标类型包括：bd09ll（百度经纬度坐标）、bd09mc（百度米制坐标）、gcj02ll（国测局经纬度坐标，仅限中国）、wgs84ll（ GPS经纬度
 * @param callback
 * @returns {*}
 */
let renderReverse = (param, callback) => {
    ajaxJsonp({
        url: API2,
        data: {
            location: param.location,
            coordtype: param.coordtype || 'bd09ll',
            ak: AK,
            output: "json"
        },
        success(data) {
            try {
                data = (typeof data === "string") ? JSON.parse(data) : data;
            } catch (err) {
                return callback('error', '地址解析错误');
            }

            if (~~data.status !== 0) {
                return callback('error', '地址解析: ' + errText[data.status]);
            }

            let result = data.result || {};
            let addComp = result.addressComponent || {};
            let point = result.location || {};

            if (!Object.keys(addComp).length) {
                return callback('error', '地址解析,无效');
            }

            callback('success', {
                point: point,
                province: addComp.province,
                city: addComp.city,
                district: addComp.district,
                street: addComp.street,
                streetNumber: addComp.streetNumber
            });
        },
        error() {
            callback('error', '响应超时');
        }
    });
};

/**
 *   @method transformLonLat
 *   @description 转换微信获取的火星坐标to百度坐标
 *   MD http://lbsyun.baidu.com/index.php?title=webapi/guide/changeposition
 *
 *   @param {Number} lon 经度
 *   @param {Number} lat 纬度
 *   @param {Function} callback 转换回调
 *   @param {Object} opt  配置
 *       ak: 秘钥
 *       source: 来源
 */
let lonLat = (lon, lat, opt = {}, callback) => {
    if (!lon || !lat) return;
    ajaxJsonp({
        url: API,
        data: {
            coords: lon +","+ lat,
            from: opt.from || 1,    // 微信获取定位传3
            to: 5,
            ak: AK,
            output: "json"
        },
        success(data) {
            try {
                data = (typeof data === "string") ? JSON.parse(data) : data;
            } catch (err) {
                return callback('error', '解析错误');
            }

            if (~~data.status !== 0) {
                return callback('error', errText[data.status]);
            }

            let result = data.result[0];
            if (!result) return callback('error', '转换失败');

            renderReverse({
                location: result.y + ',' + result.x
            }, (type, data) => {
                callback(type, data);
            });
        },
        error() {
            callback('error', '响应超时');
        }
    });
};

export default {
    lonLat,
    renderReverse
};

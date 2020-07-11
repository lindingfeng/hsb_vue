/**
 * @script @createMap过程
 * loading 正在加载...
 * error 缺少参数
 * success this.mp
 *
 * @method geolocation
 * error 定位失败，请重试
 * loading 正在获取位置
 * success {point: {lat, lng}, province, city, district, street, streetNumber}
 */
import thirdApiConfig from '@/config/thirdApiConfig';
let LoadBaidu = {
    statusText: {
        1: "定位失败",
        2: "位置结果未知",
        3: "导航结果未知",
        4: "非法密钥",
        5: "非法请求位置",
        6: "当前没有权限",
        7: "服务不可用",
        8: "请求超时"
    },
    options: {},
    callback: null,
    mp: null,
    el: null,
    script(options, callback) {
        this.options = options;
        this.callback = callback || function() {};
        this.callback('loading', '正在加载...');

        if (this.mp) return this.createMap();
        let script = document.createElement("script");
        script.src = thirdApiConfig.baidu.sdk + "&callback=loadBaiDuInitialize";
        document.body.appendChild(script);
        let handleError = () => {
            this.callback('error', '网络错误，请开启网络');
            script.removeEventListener('error', handleError);
        };
        script.addEventListener('error', handleError, false );
    },

    // 创建地图
    createMap() {
        let options = this.options;
        if (!options.el) return this.callback('error', '缺少参数');

        if (this.el) {
            if (options.el === this.el.id) {
                return this.callback('success', this.mp);
            }
        }

        try {
            this.el = document.createElement('div');
            this.el.id = options.id;
            this.mp = new BMap.Map(options.id);
            this.callback('success', this.mp);
        } catch (err) {
            this.callback('error', '文件加载失败');
        }
    },

    // 获取经纬度
    geolocation(cbHandle) {
        let that = this;
        let geolocation = null;
        try {
            geolocation = new BMap.Geolocation();
        } catch (err) {
            return cbHandle('error', '定位失败，请重试');
        }

        cbHandle('loading', '正在获取位置');
        try {
            // 开启SDK辅助定位
            geolocation.enableSDKLocation();
            geolocation.getCurrentPosition(function (res) {
                let status = this.getStatus() || 0, pt, geoc;

                if (status | 0) {
                    return cbHandle('error', that.statusText[status]);
                }

                pt = new BMap.Point(res.point.lng, res.point.lat);
                geoc = new BMap.Geocoder();
                geoc.getLocation(pt, function (rs) {
                    let addComp = rs.addressComponents;
                    cbHandle('success', {
                        point: res.point,
                        province: addComp.province,
                        city: addComp.city,
                        district: addComp.district,
                        street: addComp.street,
                        streetNumber: addComp.streetNumber
                    });
                });
            }, {
                //maximumAge : 30 * 1000
            });
        } catch (err) {
            cbHandle('error', '定位失败, 请刷新后操作');
        }
    },

    // 地址解析为坐标
    geocoder(params, cbHandle) {
        let that = this;
        let geoc = null;
        // "南山区" params.bus_address
        // "深圳市"  params.city
        let {bus_address, city} = params;

        geoc = new BMap.Geocoder();

        try {
            // 地址解析为坐标，获取经纬度   
            geoc.getPoint(bus_address, function(point){
                if(point) {
                    cbHandle('success', point);
                } else {
                    cbHandle('error', '实际经营地址没有解析到结果!');
                }
            },
            city);
        } catch (err) {
            cbHandle('error', '地址解析失败');
        }
    }
};

// 加载百度地图成功
window.loadBaiDuInitialize = () => {
    // 延迟初始化, script标签需要解析
    setTimeout(() => {
        LoadBaidu.createMap();
    }, 200);
};

export default LoadBaidu;

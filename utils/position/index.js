import LoadBaidu from './baidu';
import H5 from './h5';
let protocol = location.protocol;
let getLocation = (params, cb) => {

    // https下调用原生定位
    if (navigator.geolocation && protocol === 'https:' && false) {
        H5(function(type, data) {
            cb(type, data);
        });
    } else {
        if (params.type === 'hand') {
            return LoadBaidu.geolocation(function(type, data) {
                cb(type, data);
            });
        }
        LoadBaidu.script({el: params.el}, function(type, tip) {
            if (type === 'success') {
                this.geolocation(function(type, data) {
                    cb(type, data);
                });
            } else {
                cb(type, tip);
            }
        });
    }
};

// 定位
let Position = {
    maxCount: 3,        // 最大请求次数
    timeout: 30000,     // 超时时间30s
    timer: null,
    isOpen: false,      // 是否开启

    // 统计次数: 超时和失败
    setMaxCount() {
        this.maxCount--;
    },

    // 是否开放发起请求
    setIsOpen(flag) {
        this.isOpen = flag;
    },

    init(params, cb) {
        if (this.isOpen) return;
        this.setIsOpen(true);

        if (this.maxCount <= 0) {
            this.setIsOpen(false);
            return cb('error', '请刷新页面再试');
        }

        cb('loading', '准备中');
        this.timer = setTimeout(() => {
            this.setIsOpen(false);
            this.setMaxCount();
            cb('error', '定位超时');
        }, this.timeout);

        getLocation(params, (type, data) => {

            // 定位超时阻止执行
            if (!this.isOpen) return;

            // {文件加载失败, 定位失败||成功} 清除定时重置状态
            if (type === 'success' || type === 'error') {
                clearTimeout(this.timer);
                this.setIsOpen(false);
            }

            // 统计失败次数
            if (type === 'error') this.setMaxCount();

            cb(type, data);
        });
    },

    // 地址解析坐标
    getPoint(params, cb) {
        return LoadBaidu.geocoder(params, function(type, data) {
            cb(type, data);
        });
    }

};

export default Position;

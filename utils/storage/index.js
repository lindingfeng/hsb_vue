let Storage = {};

// 设置过期时间
Storage.expire = (key, expire) => {
    let value;
    key = "expire-" + key;
    expire = expire || 1;
    if (Storage.get(key)) return;

    expire = expire * 1000 * 60 * 60;  // 默认1个小时
    value = +new Date() + expire;
    Storage.add(key, value);
};

// 检测过期时间
Storage.checkExpire = () => {
    if (typeof localStorage === "undefined") return;

    Object.keys(localStorage).forEach(function(item) {
        if (item.indexOf("expire-") > -1) {
            let value = Storage.get(item);
            if (+new Date() > value) {
                Storage.remove(item);
                Storage.remove(item.slice(7));
            }
        }
    });
};

// 设置
Storage.add = (key, value, expire) => {
    if (!key) return;
    if (typeof value === 'function') return;
    if (typeof value === 'object') value = JSON.stringify(value);

    localStorage.setItem(key, value);
    expire && Storage.expire(key, expire);  // 设置过期时间
};

// 删除
Storage.remove = (key, expire) => {
    localStorage.removeItem(key);
    if (expire) {
        localStorage.removeItem('expire-' + key);
    }
};

// 获取
Storage.get = (key) => {
    let str = localStorage.getItem(key);
    try {
        return JSON.parse(str);
    }catch (err) {
        return str;
    }
};

export default Storage;

/**
 * @method LoadImage
 * @description 检测图片加载状态
 *
 * @param {String} url 需要加载的图片地址
 * @param {Function} cbHandle 图片加载成功的回调
 *
 * @returnFunction
 *      @param {Element} image
 *      @param {Number} 完成状态 0失败, 1成功, 2缓存成功, -1获取元数据
 *      @param {Number} 递增id
 *
 *
 * @demo
 * loadImage( "url", function() {} );
 */

let guId = 0;
export default (url, cbHandle) => {
    let img, loopAttr, startTime = Date.now();

    if (!url || typeof cbHandle !== "function") return;

    // return s
    let getRunTime = () => (Date.now() - startTime) / 1000;

    let packHandle = (state) => {
        clearInterval(loopAttr);
        if (!img) return;
        cbHandle(img, state, guId, getRunTime());
        img = null;
    };

    let checkAttr = () => {
        if (img.width || img.height) {
            clearInterval(loopAttr);
            cbHandle(img, -1, guId);
        }
    };

    // 初始化
    let init = () => {
        guId++;
        img = new Image();
        img.onload = () => packHandle(1);
        img.onerror = () => packHandle(0);
        img.src = url;
        loopAttr = setInterval(checkAttr, 16);
        if (img.complete) {
            return packHandle(2);
        }
    };

    init();
};
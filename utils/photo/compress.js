
class Compress {

    constructor(img, param = {}) {
        this.startTime = Date.now();
        this.img = img;
        this.maxWidth = param.maxWidth || 2000;     // 最大宽度
        this.maxHeight = param.maxHeight || 2000;   // 最大高度
        this.handleSuccess = param.handleSuccess || function() {};
        this.handleError = param.handleError || function() {};
        this.totalSize = img.src.length;    // 原图总大小
        this.ratio = 1;  // 压缩比
        this.maxk = param.maxk || 500; // 压缩最大k, 默认200k
        this.init();
    }

    init() {
        let canvas = this.canvas = document.createElement("canvas");
        let wh = this.whRatio();
        this.canvas.width = wh.width;
        this.canvas.height = wh.height;
        this.ctx = canvas.getContext("2d");
        this.rest(wh.width, wh.height);
        this.draw(wh.width, wh.height);
        this.toDataURL();
    }

    rest(w, h) {
        this.ctx.clearRect(0, 0, w, h);
    }

    remove() {
        this.canvas.width = this.canvas.height = 0;
    }

    draw(w, h) {
        this.ctx.drawImage(this.img, 0, 0, w, h);
    }

    // 循环压缩
    repeatToDataURL(ratio, cb) {
        let maxk = this.maxk;
        let compressResult = '';
        let repeat = (ratio) => {
            try {
                compressResult = this.canvas.toDataURL("image/jpeg", ratio);
                if (compressResult.length / 1024 >= maxk) {
                    return repeat(ratio - 0.1);
                }
                cb(compressResult);
            } catch (err) {
                cb(null, err.message || '压缩异常');
            }
        };
        repeat(ratio);
    };

    getRunTime() {
        return (Date.now() - this.startTime) / 1000;
    };

    toDataURL() {
        let totalSize = this.totalSize;
        let compressResult = '';

        this.repeatToDataURL(this.ratio, (data, msg) => {
            if (data === null) {
                return this.handleError('error', msg);
            }

            compressResult = data;
            console.log( "压缩前：" + ( totalSize / 1024 ) + "k" );
            console.log( "压缩后：" + ( compressResult.length / 1024 ) + "k" );
            console.log( "压缩率：" + ~~( 100 * ( totalSize - compressResult.length ) / totalSize ) + "%" );
            console.log( totalSize, compressResult.length );

            // 如果未压缩的大小 < 压缩后, 则取未压缩
            if (totalSize < compressResult.length) {
                compressResult = this.img.src;
            }

            this.handleSuccess(compressResult, this.getRunTime());
            this.destroy();
        });
    }

    // 计算比例
    whRatio() {
        let width = this.img.width;
        let height = this.img.height;
        let maxWidth = this.maxWidth;
        let maxHeight = this.maxHeight;
        let scale = 1;

        if (width > maxWidth || height > maxHeight) {
            if (width > height) {
                scale = maxWidth / width;
            } else {
                scale = maxHeight / height;
            }
        }

        return {
            width: width * scale,
            height: height * scale
        }
    }

    destroy() {
        this.img = null;
        this.totalSize = null;
        this.maxWidth = null;
        this.maxHeight = null;
        this.remove();
        this.ctx = null;
        this.canvas = null;
        this.handleSuccess = null;
        this.handleError = null;
    }

}

export default Compress;


/**
 * @method ReaderFile
 * @description 读取files类型

 * @demo
 * ReaderFile.init(file, {});
 */

let _toString = Object.prototype.toString;

class ReaderFile {
    constructor(files, param = {}) {
        this.readerImg = null;

        this.handleLoadStart = param.handleLoadStart || function(e) {};
        this.handleProgress = param.handleProgress || function(e) {};
        this.handleLoad = param.handleLoad || function(e) {};
        this.handleError = param.handleError || function(e) {};

        if (_toString.call(files) !== "[object FileList]") {
            return this.handleError('error', '非法对象');
        }

        if (!files.length) return;
        this.startTime = Date.now();
        this.file = files[0];
        this.init();
    }

    destroy() {
        this.file = null;
        this.readerImg = null;
    }

    init() {
        let that = this;

        try {
            this.readerImg = new FileReader();
            this.readerImg.readAsDataURL(this.file);
        } catch (err) {
            this.handleError('error', err.message);
            console.error(err);
            return;
        }

        this.readerImg.onloadstart = this.handleLoadStart;
        this.readerImg.onerror = (e) => {
            this.handleError('error');
        };

        // 取消读取
        this.readerImg.onabort = () => {
            this.handleError('abort');
        };

        // 读取进度
        this.readerImg.onprogress = (e) => {
            let progressNum = (e.loaded / e.total * 100 | 0) + "%";
            that.handleProgress(progressNum);
        };

        // 读取成功
        this.readerImg.onload = (e) => {
            let result = e.target.result;
            let time = (Date.now() - this.startTime) / 1000;
            that.handleLoad(result, time);
            that.destroy();
        };

    }
}

export default ReaderFile;

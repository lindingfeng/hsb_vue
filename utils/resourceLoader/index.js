
/**
 * @return {Number} 
 * 9999: 正在初始化
 * -1: 加载超时
 * 0: 加载失败
 * 1: 加载成功
 */

export default (url = '', fn = () => {}, overtime = 45000) => {
    fn(9999);
    let errorCount = 0; // 失败率
    let oBody = document.getElementsByTagName('body')[0];
    let create = () => {
        let newUrl =  url + '?v=' + Date.now();
        let node = document.createElement("script");
        node.charset = 'utf-8';
        node.async = true;
        node.setAttribute('type', 'text/javascript');
        node.setAttribute('src', newUrl);
        document.body.appendChild(node);

        // 超时
        let timer = setTimeout(() => {
            handleAbort();
        }, overtime);

        // 失败率大于1次 不在重复请求
        let retryRate = () => {
            if (errorCount >= 1) {
                fn(0);
                return console.error(newUrl + ' 加载失败');
            }
            errorCount++;
            create();
        };

        let destroy = () => {
            node.removeEventListener('error', handleError);
            node.removeEventListener('load', handleSuccess);
            try {
                oBody.removeChild(node);
                clearTimeout(timer);
            } catch (err) {}
        };

        let handleAbort = () => {
            destroy();
            fn(-1);
            errorCount++;
            console.error(newUrl + ' 加载超时');
        };

        let handleSuccess = () => {
            destroy();
            fn(1);
        };

        let handleError = () => {
            destroy();
            retryRate();
        };

        node.addEventListener('load', handleSuccess, false);
        node.addEventListener('error', handleError, false);
    };

    create();
};

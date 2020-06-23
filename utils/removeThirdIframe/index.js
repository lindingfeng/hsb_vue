let RemoveThirdIframe = {};
const whiteNames = 'my-iframe';

// 检测iframe白名单,删除不在白名单内的iframe
RemoveThirdIframe.remove = () => {
    try {
        let oBody = document.body;
        let iframe = document.getElementsByTagName('iframe') || [];
        for (let i = 0; i < iframe.length; i++) {
            if (!iframe[i].classList.contains(whiteNames)) {
                oBody.removeChild(iframe[i]);
            }
        }
    } catch(err) {
        console.error(`RemoveThirdIframe, ${err}`);
    }
};

export default RemoveThirdIframe;

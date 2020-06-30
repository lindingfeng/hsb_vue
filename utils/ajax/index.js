class Ajax {

    constructor() {
        //this.createXMLHttpRequest();
    }

    createXMLHttpRequest() {
        let xmlHttp;
        if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
            if (xmlHttp.overrideMimeType) {
                xmlHttp.overrideMimeType("text/xml");
            }
        } else if (window.ActiveXObject) {
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch(e) {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        //xmlHttp.withCredentials = true;
        xmlHttp.timeout = 30000;
        return xmlHttp;
    }

    // 过滤非空
    filterEmpty(data) {
        for (let i in data) {
            if (data[i] === undefined || data[i] === null || data[i] === "undefined" || data[i] === "null" || data[i] === "") {
                delete data[i];
            }
        }
        return data;
    }

    // 前置过滤
    beforeFilter(data) {
        return this.filterEmpty(data);
    }

    get(param) {
        if (!param || !param.url) {
            return;
        }
        let xmlHttp = this.createXMLHttpRequest();
        let url = param.url;
        let data = param.data || {};
        data = this.beforeFilter(data);
        let strTag = '', dataStr = '';
        for (let i in data) {
            dataStr += strTag + encodeURIComponent(i) + '=' + encodeURIComponent(data[i]);
            if (!strTag) {
                strTag = "&";
            }
        }
        url += /\?/.test(url) ? dataStr : '?' + dataStr;
        xmlHttp.open('GET', url, true);
        xmlHttp.send();
        return this.sendCallback(xmlHttp);
    };

    post(param) {
        if (!param || !param.url) {
            return;
        }
        let xmlHttp = this.createXMLHttpRequest();
        let url = param.url;
        let data = param.data || {};
        data = this.beforeFilter(data);
        xmlHttp.open('POST', url, true);
        xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        let strTag = '', dataStr = '';
        for (let i in data) {
            dataStr += strTag + encodeURIComponent(i) + '=' + encodeURIComponent(data[i]);
            if (!strTag) {
                strTag = "&";
            }
        }
        if (typeof param.progress === 'function') {
            xmlHttp.upload.onprogress = function (e) {
                param.progress(e);
            };
        }
        xmlHttp.send(dataStr);
        return this.sendCallback(xmlHttp);
    };

    postForm(param) {
        if (!param || !param.url || !param.data) {
            return;
        }
        let xmlHttp = this.createXMLHttpRequest();
        let url = param.url;
        let data = param.data;
        xmlHttp.open('POST', url, true);
        xmlHttp.send(data);
        return this.sendCallback(xmlHttp);
    }

    postJson(param) {
        if (!param || !param.url || !param.data) {
            return;
        }
        let xmlHttp = this.createXMLHttpRequest();
        let url = param.url;
        let data = param.data;
        xmlHttp.open('POST', url, true);
        xmlHttp.setRequestHeader("Content-Type","application/json");
        xmlHttp.send(JSON.stringify(data));
        return this.sendCallback(xmlHttp);
    }

    upload(param) {
        if (!param || !param.url || !param.data) {
            return;
        }
        let xmlHttp = this.createXMLHttpRequest();
        let url = param.url;
        let data = param.data;
        data = this.beforeFilter(data);
        xmlHttp.open('POST', url, true);
        xmlHttp.withCredentials = true;
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xmlHttp.send(data);
        if (param.onprogress) {
            xmlHttp.onprogress = param.onprogress;
            xmlHttp.upload.onprogress = param.onprogress;
        }
        param.success = param.success || function() {};
        param.error = param.error || function() {};
        xmlHttp.onload = (e) => {
            if((xmlHttp.status >= 200 && xmlHttp.status < 300) || xmlHttp.status === 304){
                param.success(xmlHttp.responseText);
            } else {
                param.error(xmlHttp.responseText || e);
            }
        };
        xmlHttp.onerror = (e) => {
            param.error(xmlHttp.responseText || e);
        };
    }

    uploadFormData (param) {
        if (!param || !param.url || !param.data) {
            return;
        }
        let form = new FormData();
        let xmlHttp = this.createXMLHttpRequest();
        let url = param.url;
        let data = param.data;
        for(let p in data){
            if(data.hasOwnProperty(p)){
                form.append(p, data[p]);
            }
        }
        xmlHttp.open('POST', url, true);
        xmlHttp.withCredentials = false;
        xmlHttp.send(form);
        return this.sendCallback(xmlHttp);
    }

    uploadFormExcel(param){
        if (!param || !param.url || !param.data) {
            return;
        }
        let form = new FormData();
        let xmlHttp = this.createXMLHttpRequest();
        let url = param.url;
        let data = param.data;
        for(let p in data){
            if(data.hasOwnProperty(p)){
                form.append(p, data[p]);
            }
        }
        xmlHttp.open('POST', url, true);
        xmlHttp.withCredentials = false;
        xmlHttp.setRequestHeader("enctype","multipart/form-data");
        xmlHttp.send(form);
        return this.sendCallback(xmlHttp);
    }

    downloadExcel (param) {
        if (!param || !param.url || !param.data) {
            return;
        }
        let formData = document.createElement('form');
        formData.setAttribute('id', 'sendAll');
        formData.setAttribute('action', param.url);
        formData.setAttribute('target', '_self');
        formData.setAttribute('method', param.method || 'get');
        let data = param.data;
        for(let p in data){
            if(data.hasOwnProperty(p)){
                formData.innerHTML += '<input type="hidden" name="' + p + '" value="' + data[p] + '"/>';
            }
        }
        document.body.appendChild(formData);
        let sendAll = document.getElementById('sendAll');
        sendAll.submit();
        sendAll.remove();
    }

    jsonp(param) {
        let url = param.url;
        let data = param.data;
        let oBody = document.getElementsByTagName('body')[0];
        let oScript = document.createElement('script');
        let callbackName = 'cb' + (~~(Math.random()*0xffffff)).toString(16);

        window[callbackName] = function(result) {
            param.success(result);
        };

        function format(data) {
            let str = '';
            for (let p in data) {
                str += encodeURIComponent(p) + '=' + encodeURIComponent(data[p]) + '&';
            }
            return str;
        }

        data[param.callback] = callbackName;
        data.v = callbackName;
        oScript.setAttribute('src', url + '?' + format(data));
        oBody.append(oScript);
    }

    sendCallback(xmlHttp) {
        return {
            abort: (fn) => {
                if (xmlHttp.status < 200) {
                    xmlHttp.abort();
                    (typeof fn === 'function') && fn();
                }
            },
            promise: new Promise((resolve, reject) => {
                xmlHttp.onload = (e) => {
                    if((xmlHttp.status >= 200 && xmlHttp.status < 300) || xmlHttp.status === 304){
                        resolve(xmlHttp.responseText);
                    } else {
                        xmlHttp.type = e.type;
                        reject({
                            xhr: xmlHttp,
                            responseText: xmlHttp.responseText || e
                        });
                    }
                };
                xmlHttp.onerror = (e) => {
                    xmlHttp.type = e.type;
                    reject({
                        xhr: xmlHttp,
                        responseText: xmlHttp.responseText || e
                    });
                };
                xmlHttp.ontimeout = (e) => {
                    xmlHttp.type = e.type;
                    reject({
                        xhr: xmlHttp,
                        responseText: xmlHttp.responseText || e
                    });
                };
            })
        }
    }
}

export default Ajax;

export default {
    setValue (state, param) {
        const key = param.key;
        if (!key) {
            return;
        }
        const keyArr = key.toString().split('.');
        let setParam = state;
        for (let i in keyArr) {
            if (i < keyArr.length - 1) {
                setParam = setParam[keyArr[i]];
            }
        }
        setParam[keyArr[keyArr.length - 1]] = param.value;
    }
};
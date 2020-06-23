const ruleName = (remark, max = 100, min = 1) => {
    return {
        remark: remark, type: 'String', required: true, maxLen: max, minLen: min,
        validate: {
            rules: /^[\u4e00-\u9fa5]+$/,
            text: '只允许输入汉字'
        }
    }
}

export default {
    name: ruleName('姓名', 10, 2),
    phone: {
        remark: '手机号', type: 'String', required: true, maxLen: 11,
        validate: {
            rules: /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/
        }
    },
    
    idnum: {
        remark: '身份证号码', type: 'String', required: true,
        validate: [
            { rules: function(sId) {
                    let aCity = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
                    let iSum = 0;
                    let info = "";
                    if (!/^\d{17}(\d|x)$/i.test(sId)) return false;
                    sId = sId.replace(/x$/i,"a");
                    if (aCity[parseInt(sId.substr(0,2))]==null) return false;
                    let sBirthday = sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
                    let d = new Date(sBirthday.replace(/-/g,"/"));
                    if (sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())) return false;
                    for (let i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
                    if (iSum%11!=1) return false;
                    return true;
                }, text: '输入错误' 
            }
        ]
    },

    verify_code: {
        remark: '验证码', type: 'String', required: true, maxLen: 6
    },
}

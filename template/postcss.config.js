let autoprefixer = require('autoprefixer');

module.exports = {
    modules: true,
    plugins: [
        autoprefixer({
            overrideBrowserslist:[
                "iOS >= 7",
                "Android >= 4"
            ]
        })
    ]
}
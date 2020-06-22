let autoprefixer = require('autoprefixer');

module.exports = {
    plugins: [
        autoprefixer({
            browsers:[
                "iOS >= 7",
                "Android >= 4"
            ]
        })
    ]
}
/**
 * Created by snail on 2017/7/25.
 */

const autoprefixer = require('autoprefixer');
module.exports = {
    plugins:[
        autoprefixer({
            browsers:['ie>=8','>1% in CN']
        })
    ]
}
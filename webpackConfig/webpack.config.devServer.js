/**
 * Created by snail on 17-7-19.
 */
'use strict'


const devServer = function(env){
    return {
        inline:true,
        port: 8082,
        historyApiFallback: true,
    }
}

module.exports = devServer;
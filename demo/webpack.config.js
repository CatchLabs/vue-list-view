'use strict';

module.exports = {
    context: '',
    entry: {
        bundle: './demo'
    },
    output: {
        path: './demo/dist',
        filename: '[name].js',
        publicPath: '/dist'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/
        }, {
            test: /\.(css|less)$/,
            loader: 'style!css!autoprefixer!less'
        }, {
            test: /\.html$/,
            loader: 'vue-html'
        },{
            test: /\.jpg/,
            loader: 'url?limit=0'
        }]
    },
    devServer: {
        port: 12345,
        inline: true,
        host: "0.0.0.0",
        historyApiFallback: {
            index: '/demo/index.html'
        }
    }
};

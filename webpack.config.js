const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, './src/index.js'),
    output: {
        filename: 'bundle.[hash:8].js',
        path: path.resolve(__dirname, './build/static/src')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(js|jsx|ts|tsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                },
                exclude: /node_modules/
            }, 
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '../images/[name].[ext]' // 相对于 output path 的位置
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './public/index.html'),
            filename: '../../index.html' // 相对于 output path 的位置
        }),
        new CleanWebpackPlugin()
    ]
}
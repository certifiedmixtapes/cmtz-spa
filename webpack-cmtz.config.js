const HtmlWebpackPlugin = require('html-webpack-plugin')
//const Critters = require('critters-webpack-plugin');
/*const CriticalPlugin = require('webpack-plugin-critical').CriticalPlugin;
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
var HtmlWebpackInlineSourcePlugin = require("ks-html-webpack-inline-source-plugin");
const HtmlWebpackInlineSourceOnlyPlugin = require('html-webpack-inline-source-only-plugin');*/
//const HtmlInlinePlugin = require('assets-inline-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
    plugins: [      
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'bundled.html',
            inlineSource: '.(css)$'
          }),
        new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin)
        //new Critters()      
    ]
  }
const webpack = require('webpack')
const path = require('path')

const config = {
  context: path.resolve(__dirname, 'src/js/bundle'),
  entry: './app.js',
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.(png|jpg)$/,
      use: [{
        loader: 'url-loader',
        options: { limit: 10000 } // Convert images < 10k to base64 strings
      }] // use[]-end
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader'
      ] // use[]-end
    }, {
      test: /\.js$/,
      include: path.resolve(__dirname, 'src/js/bundle'),
      use: [{
        loader: 'babel-loader', // babel使用 … ES6(ES2015)・ES7を変換（トランスパイル/transpile）
        options: {
          presets: [
            ['es2015', { modules: false }]
          ]
        }
      }] // use[]-end
    }] // rules[]-end
  } // module-end
} // config-end

module.exports = config
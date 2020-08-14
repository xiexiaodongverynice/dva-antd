const path = require('path');

const svgSpriteDirs = [path.resolve(__dirname, 'src/svg/'), require.resolve('antd').replace(/index\.js$/, '')];

export default {
  entry: 'src/index.js',
  hash: 'true',
  svgSpriteLoaderDirs: svgSpriteDirs,
  // "publicPath": "/tenant-management/",
  autoprefixer: null,
  theme: './theme.config.js',
  cssModulesExclude: ['./src/assets/iconfont.css', './src/assets/icomoon.css'],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr', 'transform-runtime', ['import', { libraryName: 'antd', style: true }]],
    },
    production: {
      extraBabelPlugins: ['transform-runtime', ['import', { libraryName: 'antd', style: true }]],
    },
  },
};

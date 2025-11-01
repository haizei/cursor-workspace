const path = require('path');

module.exports = {
  outputDir: path.resolve(__dirname, '../public'),
  publicPath: '/',
  lintOnSave: false,
  
  devServer: {
    port: 8080,
    proxy: {
      '/admin': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  }
};

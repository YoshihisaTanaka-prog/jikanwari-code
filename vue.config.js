const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    watch: true,
    watchOptions: {
      poll: true
    },
  },
  devServer: {
    client: {
      webSocketURL: 'ws://0.0.0.0:8080/ws'
    }
  },
  publicPath: './'
})

module.exports = {
  configureWebpack: {
    devServer: {
      watchOptions: {
        ignored: ["node_modules", "public", "server"],
      },
    },
  },
  transpileDependencies: ["vuetify"],
};

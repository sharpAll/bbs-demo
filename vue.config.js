module.exports = {
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "项目交流平台";
      return args;
    });
  },
  devServer: {
    port: 8888,
    host: "localhost",
    https: false,
    open: true,
    // proxy: {
    //   [process.env.VUE_APP_BASE_API]: {
    //     target: process.env.VUE_APP_SERVICE_URL,
    //     changOrigin: true,
    //     pathRewrite: {
    //       ["^" + process.env.VUE_APP_BASE_API]: "",
    //     },
    //   },
    // },
  },
  lintOnSave: false, // 关闭格式检查
  productionSourceMap: false, // 打包时不会生成 .map 文件，加快打包速度
};

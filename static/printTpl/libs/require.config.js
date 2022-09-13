requirejs.config({
  baseUrl: '../js',
  urlArgs: 'time=' + new Date().getTime(), // 测试
  // urlArgs: "v=4.8.5", //正式
  paths: {
    '_config': '../_config'
  },

  shim: {　　　　},
  waitSeconds: 3000
})

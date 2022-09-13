define(['_config', 'beans', 'printHelper'], function (_config, beans, printHelper) {
  return {

    isPreview: getQueryStringArgs().isPreview, // 是否预览,不是预览模需要进行自动打印
    printHelper: undefined,
    init: function () {
      var _this = this
      _this.printHelper = new PrintHelper()
      _this.PrintHelper.init(_this)
    },

    // 打印的公共控制方法
    PrintHelper: {
      printConfiguration: undefined,
      orderId: getQueryStringArgs().orderId,
      init: function (globalThis) {
        var _this = this
        var printer = {}
        // 在系统设置里面进行预览时进行的传参
        globalThis.printHelper.setPrintConfig(printer)
        // 获取页面传递过来的设备参数
        printer.device = getQueryStringArgs().device || PrintConfig.DEVICE_WEB
        globalThis.Print110Or80mm.init(globalThis, printer)
      }
    },

    // 110mm以及80mm打印
    Print110Or80mm: {
      orderId: getQueryStringArgs().orderId,
      printConfiguration: {},
      size: '',
      // 初始化
      init: function (_globalThis, printConfiguration) {
        globalThis = _globalThis
        var _this = this
        _this.printConfiguration = printConfiguration
        globalThis.printHelper.setSizeType(printConfiguration)
        _this.addTemplate()
      },

      // 初始化模板
      addTemplate: function () {
        var itemHtml = $('#t-order').html()
        $('#j-con').append(itemHtml)
        $('#preview-img').attr('src', './source/js/asset/' + getQueryStringArgs().previewImg)
      }

    }

  }
})

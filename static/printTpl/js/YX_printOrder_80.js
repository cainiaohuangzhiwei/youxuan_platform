define(['_config', 'beans', 'printHelper', 'barcode'], function (
  _config,
  beans,
  printHelper,
  barcode
) {
  return {
    isPreview: getQueryStringArgs().isPreview, // 是否预览,不是预览模需要进行自动打印
    printCount: Number(getQueryStringArgs().printCount || 0), // 打印次数
    printHelper: undefined,
    init: function () {
      var _this = this
      _this.printHelper = new PrintHelper()
      _this.PrintHelper.init(_this)
    },

    // 打印的公共控制方法
    PrintHelper: {
      PRINT_TYPE: 1, // 打印类型。1：订单，2：发货单，3：退货单
      printConfiguration: undefined,
      orderId: getQueryStringArgs().orderId,
      init: function (globalThis) {
        var _this = this

        globalThis.printHelper.callPrintConfig(function (printer) {
          _this.printConfiguration = printer = printer.orderPrintConfiguration

          // 在系统设置里面进行预览时进行的传参
          globalThis.printHelper.setPrintConfig(printer)
          // 获取页面传递过来的设备参数
          printer.device =
            getQueryStringArgs().device || PrintConfig.DEVICE_WEB
          globalThis.Print110Or80mm.init(globalThis, printer)
        })
      },
      // 是否显示描述
      isShowDescription: function () {
        var _this = this
        if (!isNull(_this.printConfiguration)) {
          return _this.printConfiguration.printContainDescription == 1
        }
        return false
      },
      // 是否显示图标
      isShowLogo: function () {
        // var _this = this;
        // if(!isNull(_this.printConfiguration)) {
        //    return _this.printConfiguration.printContainLogo == 1 ? true : false;
        // }
        return true
      },
      // 获得订单模板数据
      callTemplateOrderData: function (printConfiguration, fn) {
        var _this = this
        var jsonFileName = 'YX_printOrder_80.json'

        $.ajax({
          type: 'POST', // 请求方式
          url: 'source/js/asset/' + jsonFileName, // 请求路径
          dataType: 'json', // 数据格式
          success: function (resultJson) {
            // 成功处理函数
            if (fn) {
              fn(resultJson)
            }
          },
          error: function () {}
        })
      }
    },

    // 110mm以及80mm打印
    Print110Or80mm: {
      orderId: getQueryStringArgs().orderId,
      sourceType: getQueryStringArgs().sourceType,
      printConfiguration: {},
      size: '',
      // 初始化
      init: function (_globalThis, printConfiguration) {
        globalThis = _globalThis
        var _this = this
        _this.printConfiguration = printConfiguration
        // 设置成自定义的80mm模板
        globalThis.printHelper.setSizeType(printConfiguration)
        _this.addTemplate()
        _this.callOrderDetails(globalThis)

        // 是否显示描述
        if (globalThis.PrintHelper.isShowDescription()) {
          $('#printDescription')
            .html(replaceSpace(printConfiguration.printDescription))
            .parent()
            .show()
        } else {
          $('#printDescription')
            .parent()
            .hide()
        }

        // 是否显示logo
        if (globalThis.PrintHelper.isShowLogo()) {
          $('#company-logo').show()
        } else {
          $('#company-logo').hide()
        }
      },

      setTitleName: function () {
        var organizationName = ''
        if (!getQueryStringArgs().isPreview) {
          // 获取用户信息
          sendQuiescePost(url.getUserDetail, {}, function (resultJson) {
            var user = resultJson.resultData.userSimple
            organizationName = user.organizationName + '订单表'
            $('#page-title').html(organizationName)
          })
        } else {
          organizationName = '广州微革' + '订单表'
          $('#page-title').html(organizationName)
        }
      },

      // 初始化模板
      addTemplate: function () {
        var _this = this
        var itemHtml = $('#t-order-80mm').html()
        $('#j-con').append(itemHtml)
        //      _this.setTitleName();
        setTimeout(function () {
          $('#printer-header').css({
            visibility: 'visible'
          })
        }, 500)
      },

      initTable: function (resultJson) {
        var _this = this

        var totalQunatity = 0
        var SPECTWO_ROW_COUNT = 6 // 每行展示的规格数
        var tabbleBodyTd = $('#t-table-80mm-tr').html()

        var orderGoodsList = resultJson.resultData.orderGoodsList

        var $formBody = $('body')
          .find('.table-box:last')
          .find('tbody')

        $.each(orderGoodsList, function (i, itemJson) {
          $formBody.append(tabbleBodyTd)
          var $lastChild = $formBody.find('.table-item:last')
          var specString = ''
          //        var goodsNumber = '<p>货号：'+itemJson.goodsNumber+' 名称'+itemJson.goodsName+itemJson.goodsNumber+'</p>';
          totalQunatity += itemJson.quantity
          $lastChild
            .find('.sku')
            .html(
              '</p>【' +
                itemJson.goodsNumber +
                '】' +
                itemJson.specOne +
                '，' +
                itemJson.specTwo +
                ' 数量' +
                itemJson.quantity +
                '</p>'
            )
        })
        $('.table-box').css({
          'page-break-after': 'avoid'
        })
        $('.totalCount').html(totalQunatity)

        var copyItemCount = globalThis.printCount - 1
        var pageItemHtml = $('.page80mm:last').prop('outerHTML')
        for (var i = 0; i < copyItemCount; i++) {
          // 加个小分隔，适配批量打印分页不准确的问题
          $('.content ').append('<div style="height: 10px;"></div>')
          $('.content ').append(
            $(pageItemHtml)
              .attr('id', '')
              .html()
          )
        }
      },
      /* 获取订单详情 */
      callOrderDetails: function (globalThis) {
        var _this = this
        var paramJson = {
          orderId: _this.orderId,
          printOrder: 1 // 1：打印订单调用
        }
        $('#tips-cell').show(300)

        if (!getQueryStringArgs().isPreview) {
          sendPost(
            url.getOrderDetailByOrderIdPlus,
            {
              data: JSON.stringify(paramJson)
            },
            function (resultJson) {
              // CzcTool('20000010','订单打印',{orderId:_this.orderId},null,null);
              setData(resultJson)
            }
          )
        } else {
          globalThis.PrintHelper.callTemplateOrderData(
            _this.printConfiguration,
            function (resultJson) {
              setData(resultJson)
            }
          )
        }
        function setData (resultJson) {
          var orderDetail = resultJson.resultData.orderDetail || {}

          fillDataToView($('body'), orderDetail, function (
            key,
            value,
            $itemView
          ) {
            if (key.indexOf('Time') != -1) {
              if (isNull(value) || value == 0) {
                return ''
              }
              value = value || 0
              return new Date(value).Format('yyyy-MM-dd hh:mm:ss')
            }
            if (key == 'description') {
              if (isNull(value)) {
                $itemView.hide()
                return ''
              } else {
                return value
              }
            }
          })

          // 对分页有影响，所以要先渲染这些
          //        var consigneeInfo = $.orderDetail.getConsigneeInfo(orderDetail);
          //        $('.consignee-info').html(consigneeInfo);
          $('.sourceName').html(
            getsourceNameByType(_this.sourceType) +
              orderDetail.sourceName.substr(-1)
          )
          var barString = resultJson.resultData.orderDetail.orderSn.replace(
            'OD',
            ''
          )
          $('#bcTarget').barcode(barString, 'code128', {
            barWidth: 2,
            barHeight: 40
          })

          _this.initTable(resultJson)
          $('#tips-cell').hide(300)
          setTimeout(function () {
            globalThis.printHelper.startPrint()
          }, 1000)
        }
      }
    }
  }
})

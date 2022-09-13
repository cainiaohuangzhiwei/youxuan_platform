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
      PRINT_TYPE: 3, // 打印类型。1：订单，2：发货单，3：退货单
      printConfiguration: undefined,
      init: function (globalThis) {
        var _this = this

        globalThis.printHelper.callPrintConfig(function (printer) {
          _this.printConfiguration = printer = printer.returnPrintConfiguration

          // 在系统设置里面进行预览时进行的传参
          globalThis.printHelper.setPrintConfig(printer)
          // 获取页面传递过来的设备参数
          printer.device = getQueryStringArgs().device || PrintConfig.DEVICE_WEB

          var templateTypeKey = 'templateType'
          switch (printer[templateTypeKey]) {
            case TEMPLATE_TYPE.BILL_80mm:// 80mm
              globalThis.Print110Or80mm.init(globalThis, printer)
              break
            case TEMPLATE_TYPE.BILL_110mm:// 110mm
              globalThis.Print110Or80mm.init(globalThis, printer)
              break
            case TEMPLATE_TYPE.DOUBLE_SKU:// 双规格
              globalThis.PrintA4.needPaging = true
              globalThis.PrintA4.init(globalThis, printer)
              break
            case TEMPLATE_TYPE.SINGLE_SKU_IMG: // 单规格有图
              globalThis.PrintGoods.hasGoodsImage = true
              globalThis.PrintGoods.init(globalThis, printer)
              break
            case TEMPLATE_TYPE.SINGLE_SKU_NO_IMG: // 单规格无图
              globalThis.PrintGoods.hasGoodsImage = false
              globalThis.PrintGoods.init(globalThis, printer)
              break
            case TEMPLATE_TYPE.CUSTOM_MADE: // 定制模板
              var paramJson = getQueryStringArgs()
              WindowTool.replace(printer.printUrl, paramJson)
              break
            default:
              $('#j-con').html('无法识别的模板').show()
              break
          }
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
        var _this = this
        if (!isNull(_this.printConfiguration)) {
          return _this.printConfiguration.printContainLogo == 1
        }
        return false
      },
      // 获得订单模板数据
      callTemplateOrderData: function (printConfiguration, fn) {
        var _this = this
        var jsonFileName = ''
        var templateTypeKey = 'templateType'
        switch (printConfiguration[templateTypeKey]) {
          case TEMPLATE_TYPE.BILL_80mm:// 80mm
            jsonFileName = 'printReturnOrderData.json'
            break
          case TEMPLATE_TYPE.BILL_110mm:// 110mm
            jsonFileName = 'printReturnOrderData.json'
            break
          case TEMPLATE_TYPE.DOUBLE_SKU:// 双规格
            jsonFileName = 'printReturnOrderData.json'
            break
          case TEMPLATE_TYPE.SINGLE_SKU_IMG: // 单规格有图
            jsonFileName = 'printReturnOrderData.json'
            break
          case TEMPLATE_TYPE.SINGLE_SKU_NO_IMG: // 单规格无图
            jsonFileName = 'printReturnOrderData.json'
            break
        }

        $.ajax({
          type: 'POST', // 请求方式
          url: 'source/js/asset/' + jsonFileName, // 请求路径
          dataType: 'json', // 数据格式
          success: function (resultJson) { // 成功处理函数
            if (fn) {
              fn(resultJson)
            }
          },
          error: function () {
          }
        })
      }

    },

    // A4打印以及三联单打印（区别只有分不分页）
    PrintA4: {
      needPaging: false, // 是否需要分页(A4纸需要,三联单不需要)
      printConfiguration: {},
      globalThis: undefined,
      // 初始化
      init: function (_globalThis, printConfiguration) {
        globalThis = _globalThis
        var _this = this
        _this.printConfiguration = printConfiguration
        globalThis.printHelper.setSizeType(printConfiguration)
        _this.addTemplate()
        _this.callOrderDetails(globalThis)

        // 是否显示描述
        if (globalThis.PrintHelper.isShowDescription()) {
          $('#printDescription').html(replaceSpace(printConfiguration.printDescription)).parent().show()
        } else {
          $('#printDescription').parent().hide()
        }
        // 是否显示logo
        if (globalThis.PrintHelper.isShowLogo()) {
          $('#company-logo').show().css({
            'margin-left': '10%'
          })
          $('#page-title-parent').css({
            'width': '56%',
            'margin-left': '5%',
            'vertical-align': 'middle'
          })
          $('#page-title').css({
            'text-align': 'left',
            'width': '100%',
            'font-size': '30px'
          })
          $('#printer-header').css({
            'height': '154px',
            'margin-bottom': '0px'

          })
        } else {
          $('#company-logo').hide()
          $('#page-title-parent').css({
            'width': '100%',
            'text-align': 'center'
          })

          $('#page-title').css({
            'text-align': 'center',
            'width': '80%',
            'height': '35px',
            'font-size': '18px',
            'font-weight': 'normal'
          })
          $('#printer-header').css({
            'height': 'auto',
            'margin-bottom': '0px'
          })
        }
      },

      setTitleName: function () {
        var organizationName = ''

        if (!getQueryStringArgs().isPreview) {
          // 获取用户信息
          sendQuiescePost(url.getUserDetail, {}, function (resultJson) {
            var user = resultJson.resultData.userSimple
            organizationName = getUserInfo().organizationName + '退货单'
            $('#page-title').html(organizationName)
          })
        } else {
          organizationName = '广州微革' + '退货单'
          $('#page-title').html(organizationName)
        }
      },

      // 初始化模板
      addTemplate: function () {
        var _this = this
        var itemHtml = $('#t-order').html()
        $('#j-con').append(itemHtml)
        _this.setTitleName()

        setTimeout(function () {
          $('#printer-header').css({
            'visibility': 'visible'
          })
        }, 500)
      },

      initTable: function (printOrderGoods, newSpecTwoList) {
        var _this = this
        var dip = js_getDPI()[0]

        var PAGE_INDEXS = []

        // 毫米转px
        function mm2Px (inPx) {
          var _this = this
          return inPx * dip / 25.4// A4纸的高度是277，换算成对应的px值,像素换算为毫米 x * 25.4 / px
        };
        // px转毫米
        function px2mm (inMm) {
          var _this = this
          return inMm * 25.4 / dip// A4纸的高度是277，换算成对应的px值,像素换算为毫米 x * 25.4 / px
        };

        var pageHeightInPx = 297 * dip / 25.4// A4纸的高度是277，换算成对应的px值,像素换算为毫米 x * 25.4 / px
        pageHeightInPx = pageHeightInPx // 减去边距
        pageHeightInPx = globalThis.printHelper.getHeightBySizeType(_this.printConfiguration)

        var SPECTWO_ROW_COUNT = 7// 每行展示的规格数
        var totalAmount = 0
        var totalQunatity = 0
        var tabbleBodyTd = $('#t-table-tr').html()

        // 对表头进行渲染
        globalThis.printHelper.renderDoubeSkuColumnHeader(newSpecTwoList)

        var $formBody = $('#table-container').find('.table-box:last').find('tbody')

        $.each(printOrderGoods, function (i, itemJson) {
          $formBody.append(tabbleBodyTd)
          var $lastChild = $formBody.find('.table-item:last')
          $lastChild.find('.goodsNumber').html(goodsNameCut(itemJson.goodsNumber))
          $lastChild.find('.specOne').html(itemJson.specOne)
          $lastChild.find('.index').html(i + 1)
          $lastChild.find('.totalAmount').html(Number(itemJson.totalAmount).toFixed(2))
          $lastChild.find('.totalQuantity').html(itemJson.totalQuantity)

          if (itemJson.minPrice == itemJson.maxPrice) {
            $lastChild.find('.price').html(itemJson.minPrice)
          } else {
            $lastChild.find('.price').html(itemJson.minPrice + '-' + itemJson.maxPrice)
          }

          var pageIndex = Math.ceil(Number($lastChild.offset().top + $lastChild.height()) / pageHeightInPx)

          totalQunatity = NumberTool.floatAdd(totalQunatity, itemJson.totalQuantity)
          totalAmount = NumberTool.floatAdd(totalAmount, itemJson.totalAmount)

          // 预先填充出所有空格
          globalThis.printHelper.renderDoubeSkuColumnTd($lastChild, newSpecTwoList)

          $.each(itemJson.specTwoList || [], function (j, specItem) {
            $lastChild.find('.goods-spec-td2').find('.specCell[specTwo="' + specItem.specTwo + '"]').html(specItem.quantity)
            // var specTpl = [
            //    '<table class="spec-cell-box">',
            //    '<tbody><tr class="spec-cell"><td style="font-weight: bold">'+specItem.specTwo+'</td></tr>',
            //    '<tr class="spec-cell no-borderBottom">' ,
            //    '<td>' ,
            //    '<p>'+specItem.quantity+'</p>' ,
            //    '</td>' ,
            //    '</tr>',
            //    '</tbody>',
            //    ' </table>',
            // ].join('')
            // $lastChild.find('.goods-spec-td2').append(specTpl);
            // var TOTAL_ROW = Math.ceil(itemJson.specTwoList.length/SPECTWO_ROW_COUNT);//一共多少行
            //
            /// /最后一行不需要加黑色分隔线
            // if(j>SPECTWO_ROW_COUNT*(TOTAL_ROW-1)-1 ) {
            //    $lastChild.find('.goods-spec-td2').find('.spec-cell-box:last').css({
            //        'border-bottom':'0',
            //    });
            // }
          })

          if (_this.needPaging) {
            globalThis.printHelper.paging(function () {
              globalThis.printHelper.renderDoubeSkuColumnHeader(newSpecTwoList)
              $formBody = $('#table-container').find('table:last').find('tbody')
              $lastChild.remove()
              $formBody.append($lastChild.prop('outerHTML'))
            }, pageIndex, pageHeightInPx, $lastChild)
          }
        })
        $('#table-container').find('.table-box:last').append($('#t-table-footer-item').html())
        $('#table-container').find('.table-box:last').css({
          'page-break-after': 'avoid'
        })
        $('.table-total-amount').html(totalAmount.toFixed(2))
        $('.table-total-quantity').html(totalQunatity)
        globalThis.printHelper.setPageIndex(pageHeightInPx)
      },

      /* 获取订单详情 */
      callOrderDetails: function (globalThis) {
        var _this = this
        var paramJson = {
          returnOrderId: getQueryStringArgs().returnOrderId
        }
        $('#tips-cell').show(300)

        if (!getQueryStringArgs().isPreview) {
          sendPost(url.getReturnOrderDetailByReturnOrderId, {data: JSON.stringify(paramJson)}, function (resultJson) {
            setData(resultJson)
          })
        } else {
          globalThis.PrintHelper.callTemplateOrderData(_this.printConfiguration, function (resultJson) {
            setData(resultJson)
          })
        }

        function setData (resultJson) {
          var orderDetail = resultJson.resultData.returnOrder || {}
          var refund = resultJson.resultData.refund || {}

          fillDataToView($('body'), orderDetail, function (key, value, itemView) {
            if (key.indexOf('Time') != -1)	{
              if (isNull(value) || value == 0) {
                return '无'
              }
              value = value || 0
              return new Date(value).Format('yyyy-MM-dd')
            }
            if (key == 'remark') {
              if (isNull(value)) {
                itemView.parents('.margin-tb5').hide()
                return '无'
              } else {
                return value
              }
            }
          })
          if (refund.isBalanceBack == 0) {
            // 是否退到余额。0：不是，1：是
            $('*[data-fill="accountName"]').html('退至 ' + refund.organizationAccountName + '-' + refund.organizationAccountNo)
          } else {
            $('*[data-fill="accountName"]').html('退至余额')
          }
          // 设置组织logo
          try {
            $('#company-logo').attr('src', resultJson.resultData.company.image.imageUrl)
          } catch (e) {

          }

          // 设置收货信息
          var consigneeInfo = $.orderDetail.getConsigneeInfo(orderDetail)
          $('#consignee-info').html(consigneeInfo)

          sendPost(url.getGoodsConfiguration, {}, function (configResultJson) {
            var groupSpecTwoList = configResultJson.resultData.groupSpecTwoList
            var newSpecTwoList = groupSpecTwoList.slice(0, globalThis.printHelper.getDoubeSkuColumnSizeType(_this.printConfiguration))
            _this.initTable(resultJson.resultData.printReturnGoods, newSpecTwoList)

            var goodsType = configResultJson.resultData.goodsType
            $('.specOneTitle').html(goodsType.specOne)
            $('.specTwoTitle').html(goodsType.specTwo + '/数量')

            $('#tips-cell').hide(300)
            setTimeout(function () {
              globalThis.printHelper.startPrint()
            }, 100)
          })
        }
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
        // if(_this.size == '110mm') {
        //    $('.content').addClass('page110mm');
        // }
        // else if(_this.size == '80mm') {
        //    $('.content').addClass('page80mm');
        // }
        globalThis.printHelper.setSizeType(printConfiguration)
        _this.addTemplate()
        _this.callOrderDetails(globalThis)

        // 是否显示描述
        if (globalThis.PrintHelper.isShowDescription()) {
          $('#printDescription').html(replaceSpace(printConfiguration.printDescription)).parent().show()
        } else {
          $('#printDescription').parent().hide()
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
            organizationName = user.organizationName + '退货单'
            $('#page-title').html(organizationName)
          })
        } else {
          organizationName = '广州微革' + '退货单'
          $('#page-title').html(organizationName)
        }
      },

      // 初始化模板
      addTemplate: function () {
        var _this = this
        var itemHtml = ''

        // if(_this.size == '110mm') {
        //    itemHtml = $('#t-order-110mm').html();
        // }
        // else if(_this.size == '80mm') {
        //    itemHtml = $('#t-order-110mm').html();
        // }
        itemHtml = $('#t-order-110mm').html()
        $('#j-con').append(itemHtml)
        _this.setTitleName()

        setTimeout(function () {
          $('#printer-header').css({
            'visibility': 'visible'
          })
        }, 500)
      },

      initTable: function (resultJson) {
        var printOrderGoods
        var _this = this
        var dip = js_getDPI()[0]
        // 毫米转px
        function mm2Px (inPx) {
          var _this = this
          return inPx * dip / 25.4// A4纸的高度是277，换算成对应的px值,像素换算为毫米 x * 25.4 / px
        };
        // px转毫米
        function px2mm (inMm) {
          var _this = this
          return inMm * 25.4 / dip// A4纸的高度是277，换算成对应的px值,像素换算为毫米 x * 25.4 / px
        };

        var pageHeightInPx = 297 * dip / 25.4// A4纸的高度是277，换算成对应的px值,像素换算为毫米 x * 25.4 / px

        pageHeightInPx = pageHeightInPx // 减去边距

        var totalQunatity = 0
        var SPECTWO_ROW_COUNT = 6// 每行展示的规格数
        var tabbleBodyTd = ''
        if (_this.printConfiguration.sizeType == PRINT_SIZE_TYPE.NORMAL_110) {
          tabbleBodyTd = $('#t-table-110mm-tr').html()
          $('#table-container').append($('#t-table-110mm-item').html())
          printOrderGoods = resultJson.resultData.printReturnGoods
          $('#tableEndDashline').hide()
        } else if (_this.printConfiguration.sizeType == PRINT_SIZE_TYPE.NORMAL_80) {
          tabbleBodyTd = $('#t-table-80mm-tr').html()
          $('#table-container').append($('#t-table-80mm-item').html())
          printOrderGoods = resultJson.resultData.returnGoodsList
        }

        var $formBody = $('#table-container').find('.table-box:last').find('tbody')

        // 长度裁减
        function stringCut (str, length) {
          str = String(str)
          if (!isNull(str) || str.length > length) {
            str = str.substring(0, length)
            return str
          }
          return ''
        }
        function getFixedNumber (num) {
          if (!isNaN(num) && !isNull(num)) {
            return parseFloat(Number(num).toFixed(2))
          }
        }

        $.each(printOrderGoods, function (i, itemJson) {
          $formBody.append(tabbleBodyTd)
          var $lastChild = $formBody.find('.table-item:last')
          var specString = ''
          if (!isNull(itemJson.specOne)) {
            specString += itemJson.specOne + ','
          }
          if (!isNull(itemJson.specTwo)) {
            specString += itemJson.specTwo + ','
          }
          if (!isNull(itemJson.specThree)) {
            specString += itemJson.specThree + ','
          }
          if (specString.length > 0) {
            specString = specString.substr(0, specString.length - 1)
          }
          var goodsString = itemJson.goodsNumber + ' (' + specString + ')'
          var price = ''
          var quantity = 0

          if (_this.printConfiguration.sizeType == PRINT_SIZE_TYPE.NORMAL_110) {
            // goodsString = stringCut(goodsString,20);
            // price = stringCut(getFixedNumber(itemJson.price),7);
            // quantity = stringCut(getFixedNumber(itemJson.quantity),4);
            // $lastChild.find('.goodsNumber').html(goodsString);

            var goodsString = stringCut(itemJson.goodsNumber + '&nbsp;&nbsp;&nbsp;&nbsp;' + itemJson.specOne, 66)
            $lastChild.find('.goodsNumber').html(goodsString)

            if (itemJson.minPrice == itemJson.maxPrice) {
              $lastChild.find('.price').html(itemJson.minPrice.toFixed(2))
            } else {
              $lastChild.find('.price').html(itemJson.minPrice.toFixed(2) + '-' + itemJson.maxPrice.toFixed(2))
            }

            $lastChild.find('.quantity').html(itemJson.totalQuantity)
            $lastChild.find('.totalAmount').html(itemJson.totalAmount)

            $.each(itemJson.specTwoList || [], function (j, specItem) {
              var quantity = Number(specItem.quantity)
              var specTpl = [
                '<table class="spec-cell-box">',
                '<tbody><tr class="spec-cell"><td style="font-weight: bold;height:28px">' + specItem.specTwo + '</td></tr>',
                '<tr class="spec-cell">',
                '<td style="height: 20px;">',
                '<p>' + quantity + '</p>',
                '</td>',
                '</tr>',
                '</tbody>',
                ' </table>'
              ].join('')
              $lastChild.find('.goods-spec-td4').append(specTpl)
              var TOTAL_ROW = Math.ceil(itemJson.specTwoList.length / SPECTWO_ROW_COUNT)// 一共多少行

              // 最后一行不需要加黑色分隔线
              if (j > SPECTWO_ROW_COUNT * (TOTAL_ROW - 1) - 1) {
                $lastChild.find('.goods-spec-td4').find('.spec-cell-box:last').css({
                  'border-bottom': '0'
                })
              }

              totalQunatity = NumberTool.floatAdd(totalQunatity, quantity)
            })
          } else if (_this.printConfiguration.sizeType == PRINT_SIZE_TYPE.NORMAL_80) {
            goodsString = stringCut(goodsString, 60)
            price = stringCut(getFixedNumber(itemJson.price), 8)
            quantity = stringCut(getFixedNumber(itemJson.quantity), 3)
            // $lastChild.prev('tr').find('.goodsNumber').html(goodsString);
            $lastChild.find('.goodsNumber').html(goodsString)
            $lastChild.find('.price').html(price)
            $lastChild.find('.quantity').html(quantity)
            totalQunatity = NumberTool.floatAdd(totalQunatity, itemJson.quantity)
            var rowTotalAmount = NumberTool.floatMul(itemJson.price, itemJson.quantity)
            $lastChild.find('.totalAmount').html(parseFloat(rowTotalAmount.toFixed(2)))
          }
        })
        // $('#table-container').find('.table-box:last').append($('#t-table-footer-item').html());
        // $('#table-container').find('.table-box:last').css({
        //    'page-break-after':'avoid',
        // });
        // 不分页
        $('.table-box').css({
          'page-break-after': 'avoid'
        })

        if (_this.printConfiguration.sizeType == PRINT_SIZE_TYPE.NORMAL_110) {
          totalQunatity = stringCut(getFixedNumber(totalQunatity), 10)
        } else if (_this.printConfiguration.sizeType == PRINT_SIZE_TYPE.NORMAL_80) {
          totalQunatity = stringCut(getFixedNumber(totalQunatity), 11)
        }

        $('b[data-fill="totalCount"]').html(totalQunatity)
      },

      /* 获取订单详情 */
      callOrderDetails: function (globalThis) {
        var _this = this
        var paramJson = {
          returnOrderId: getQueryStringArgs().returnOrderId
        }
        $('#tips-cell').show(300)

        if (!getQueryStringArgs().isPreview) {
          sendPost(url.getReturnOrderDetailByReturnOrderId, {data: JSON.stringify(paramJson)}, function (resultJson) {
            setData(resultJson)
          })
        } else {
          globalThis.PrintHelper.callTemplateOrderData(_this.printConfiguration, function (resultJson) {
            setData(resultJson)
          })
        }

        function setData (resultJson) {
          var orderDetail = resultJson.resultData.returnOrder || {}
          var refund = resultJson.resultData.refund || {}
          fillDataToView($('body'), orderDetail, function (key, value, itemView) {
            if (key.indexOf('Time') != -1)	{
              if (isNull(value) || value == 0) {
                return '无'
              }
              value = value || 0
              return new Date(value).Format('yyyy-MM-dd')
            }
            if (key == 'remark') {
              if (isNull(value)) {
                itemView.parents('.margin-tb5').hide()
                return '无'
              } else {
                return value
              }
            }
          })
          if (refund.isBalanceBack == 0) {
            // 是否退到余额。0：不是，1：是
            $('*[data-fill="accountName"]').html('退至 ' + refund.organizationAccountName + '-' + refund.organizationAccountNo)
          } else {
            $('*[data-fill="accountName"]').html('退至余额')
          }

          // 设置组织logo
          try {
            $('#company-logo').attr('src', resultJson.resultData.company.image.imageUrl)
          } catch (e) {
          }
          // 设置收货信息
          var consigneeInfo = $.orderDetail.getConsigneeInfo(orderDetail)
          $('#consignee-info').html(consigneeInfo)
          $('#consignee-info').css({
                    	'font-size': '12px'
          })
          _this.initTable(resultJson)
          $('#tips-cell').hide(300)
          setTimeout(function () {
            globalThis.printHelper.startPrint()
          }, 1000)
        }
      }
    },

    // 普通商品有图、普通商品无图
    PrintGoods: {
      orderId: getQueryStringArgs().orderId,
      hasGoodsImage: false, // 是否有图
      needPaging: true, // 是否需要分页
      printConfiguration: {},
      // 初始化
      init: function (_globalThis, printConfiguration) {
        globalThis = _globalThis
        var _this = this
        _this.printConfiguration = printConfiguration
        // $('.content').addClass('page210mm');
        globalThis.printHelper.setSizeType(printConfiguration)
        _this.addTemplate()
        _this.callOrderDetails(globalThis)

        // 是否显示描述
        if (globalThis.PrintHelper.isShowDescription()) {
          $('#printDescription').html(replaceSpace(printConfiguration.printDescription)).parent().show()
        } else {
          $('#printDescription').parent().hide()
        }
        // 是否显示logo
        if (globalThis.PrintHelper.isShowLogo()) {
          $('#company-logo').show().css({
            'margin-left': '10%'
          })
          $('#page-title-parent').css({
            'width': '56%',
            'margin-left': '5%',
            'vertical-align': 'middle'
          })
          $('#page-title').css({
            'text-align': 'left',
            'width': '100%',
            'font-size': '30px'
          })
          $('#printer-header').css({
            'height': '154px',
            'margin-bottom': '0px'

          })
        } else {
          $('#company-logo').hide()
          $('#page-title-parent').css({
            'width': '100%',
            'text-align': 'center'
          })

          $('#page-title').css({
            'text-align': 'center',
            'width': '80%',
            'height': '35px',
            'font-size': '18px',
            'font-weight': 'normal'
          })
          $('#printer-header').css({
            'height': 'auto',
            'margin-bottom': '0px'
          })
        }
      },

      setTitleName: function () {
        var organizationName = ''

        if (!getQueryStringArgs().isPreview) {
          // 获取用户信息
          sendQuiescePost(url.getUserDetail, {}, function (resultJson) {
            var user = resultJson.resultData.userSimple
            organizationName = user.organizationName + '退货单'
            $('#page-title').html(organizationName)
          })
        } else {
          organizationName = '广州微革' + '退货单'
          $('#page-title').html(organizationName)
        }
      },

      // 初始化模板
      addTemplate: function () {
        var _this = this
        var itemHtml = $('#t-order').html()
        $('#j-con').append(itemHtml)
        _this.setTitleName()

        setTimeout(function () {
          $('#printer-header').css({
            'visibility': 'visible'
          })
        }, 500)
      },

      initTable: function (printOrderGoods) {
        var _this = this
        var dip = js_getDPI()[0]
        // 毫米转px
        function mm2Px (inPx) {
          var _this = this
          return inPx * dip / 25.4// A4纸的高度是277，换算成对应的px值,像素换算为毫米 x * 25.4 / px
        };
        // px转毫米
        function px2mm (inMm) {
          var _this = this
          return inMm * 25.4 / dip// A4纸的高度是277，换算成对应的px值,像素换算为毫米 x * 25.4 / px
        };

        var pageHeightInPx = 297 * dip / 25.4// A4纸的高度是277，换算成对应的px值,像素换算为毫米 x * 25.4 / px

        pageHeightInPx = pageHeightInPx // 减去边距
        pageHeightInPx = globalThis.printHelper.getHeightBySizeType(_this.printConfiguration)

        var SPECTWO_ROW_COUNT = 7// 每行展示的规格数
        var tabbleBodyTd = ''

        if (_this.hasGoodsImage) {
          tabbleBodyTd = $('#t-table-goods-img-tr').html()
          $('#table-container').append($('#t-table-goods-img-item').html())
        } else {
          tabbleBodyTd = $('#t-table-goods-tr').html()
          $('#table-container').append($('#t-table-goods-item').html())
        }

        var tableTotalAmount = 0
        var tableTotalQuantity = 0

        var $formBody = $('#table-container').find('.table-box:last').find('tbody')
        $.each(printOrderGoods, function (i, itemJson) {
          $formBody.append(tabbleBodyTd)
          var $lastChild = $formBody.find('.table-item:last')
          itemJson.image = itemJson.image || {}
          $lastChild.find('.goodsImage').attr('src', itemJson.image.imageUrl)
          $lastChild.find('.goodsNumber').html(itemJson.goodsNumber)
          var returnGoodsSpecList = itemJson.returnGoodsSpecList || []
          if (returnGoodsSpecList.length > 0) {
            var specItem = returnGoodsSpecList[0]
            var totalAmount = NumberTool.floatMul(specItem.price, specItem.quantity)
            $lastChild.find('.goodsSpec').html(specItem.specOne)
            $lastChild.find('.index').html(i + 1)
            $lastChild.find('.price').html(specItem.price)
            $lastChild.find('.priceOne').html(specItem.priceOne)
            $lastChild.find('.quantity').html(specItem.quantity)
            $lastChild.find('.totalAmount').html(totalAmount.toFixed(2))

            tableTotalAmount = NumberTool.floatAdd(tableTotalAmount, totalAmount)
            tableTotalQuantity = NumberTool.floatAdd(tableTotalQuantity, specItem.quantity)
          }

          var pageIndex = Math.ceil(Number($lastChild.offset().top + $lastChild.height()) / pageHeightInPx)

          if (_this.needPaging) {
            globalThis.printHelper.paging(function () {
              if (_this.hasGoodsImage) {
                $('#table-container').append($('#t-table-goods-img-item').html())
              } else {
                $('#table-container').append($('#t-table-goods-item').html())
              }
              $formBody = $('#table-container').find('table:last').find('tbody')
              $lastChild.remove()
              $formBody.append($lastChild.prop('outerHTML'))
            }, pageIndex, pageHeightInPx, $lastChild)
          }
        })
        // 最后一个表格与它后面的文字不分页
        $('#table-container').find('.table-box:last').append($('#t-table-goodsimg-footer-item').html())
        $('#table-container').find('.table-box:last').css({
          'page-break-after': 'avoid'
        })
        $('.table-total-amount').html(tableTotalAmount.toFixed(2))
        $('.table-total-quantity').html(tableTotalQuantity)
        if (_this.hasGoodsImage) {
          $('#totalQuantityTitle').attr('colspan', 4)
        }
        globalThis.printHelper.setPageIndex(pageHeightInPx)
      },

      /* 获取订单详情 */
      callOrderDetails: function (globalThis) {
        var _this = this
        var paramJson = {
          returnOrderId: getQueryStringArgs().returnOrderId
        }
        $('#tips-cell').show(300)

        if (!getQueryStringArgs().isPreview) {
          sendPost(url.getReturnOrderDetailByReturnOrderId, {data: JSON.stringify(paramJson)}, function (resultJson) {
            setData(resultJson)
          })
        } else {
          globalThis.PrintHelper.callTemplateOrderData(_this.printConfiguration, function (resultJson) {
            setData(resultJson)
          })
        }

        function setData (resultJson) {
          var orderDetail = resultJson.resultData.returnOrder || {}
          var refund = resultJson.resultData.refund || {}

          fillDataToView($('body'), orderDetail, function (key, value, itemView) {
            if (key.indexOf('Time') != -1)	{
              if (isNull(value) || value == 0) {
                return '无'
              }
              value = value || 0
              return new Date(value).Format('yyyy-MM-dd')
            }
            if (key == 'accountName') {
              if (orderDetail.isBalanceBack == 0) {
                // 是否退到余额。0：不是，1：是
                return '退至 ' + orderDetail.accountName + '-' + orderDetail.accountNo
              } else {
                return '退至余额'
              }
            }
            if (key == 'remark') {
              if (isNull(value)) {
                itemView.parents('.margin-tb5').hide()
                return '无'
              } else {
                return value
              }
            }
          })

          if (refund.isBalanceBack == 0) {
            // 是否退到余额。0：不是，1：是
            $('*[data-fill="accountName"]').html('退至 ' + refund.organizationAccountName + '-' + refund.organizationAccountNo)
          } else {
            $('*[data-fill="accountName"]').html('退至余额')
          }

          // 设置组织logo
          try {
            $('#company-logo').attr('src', resultJson.resultData.company.image.imageUrl)
          } catch (e) {
          }
          // 设置收货信息
          var consigneeInfo = $.orderDetail.getConsigneeInfo(orderDetail)
          $('#consignee-info').html(consigneeInfo)
          $('#consignee-info').css({
                    	'font-size': '12px'
          })

          _this.initTable(resultJson.resultData.goodsList)
          $.goods.confirmGoodsTypeloaded(null, function (goodsType) {
            $('.specOneTitle').html(goodsType.specOne)
          })

          $('#tips-cell').hide(300)
          setTimeout(function () {
            globalThis.printHelper.startPrint()
          }, 1000)
        }
      }
    }
  }
})

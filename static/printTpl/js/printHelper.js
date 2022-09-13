
// 打印辅助类
function PrintHelper () {
  this.printConfiguration
  this.dip = js_getDPI()[0]
  this.pageHeightInPx = 0 // 各种定制模板奇怪的高度
}

// 获得打印配置
PrintHelper.prototype.callPrintConfig = function (fn) {
  var platformType
  if (getQueryStringArgs().device == PrintConfig.DEVICE_ANDROID || getQueryStringArgs().device == PrintConfig.DEVICE_IOS) {
    platformType = PRINT_PLATFORM_TYPE.APP
  } else {
    platformType = PRINT_PLATFORM_TYPE.WEB
  }

  sendPost(url.getPrinterList, {
    data: JSON.stringify({
      platformType: platformType, // 平台类型。2：web，3：app
      printerId: getQueryStringArgs().printerId
    })
  }, function (resultJson) {
    var printerList = resultJson.resultData.printerList
    if (fn) {
      if (printerList.length > 0) {
        fn(printerList[0])
      } else {
        $('#j-con').append('无效的打印机id').show()
      }
    }
  })
},

// 设置打印的配置
PrintHelper.prototype.setPrintConfig = function (printConfiguration) {
  var _this = this
  // 在系统设置里面进行预览时进行的传参
  // web端参数
  var queryStringArgs = getQueryStringArgs()
  if (!isNull(queryStringArgs.printConfigurationId)) {
    printConfiguration.printConfigurationId = Number(queryStringArgs.printConfigurationId)
  }
  // 模板类型
  if (!isNull(queryStringArgs.templateType)) {
    printConfiguration.templateType = Number(queryStringArgs.templateType)
  }
  // 页面类型
  if (!isNull(queryStringArgs.sizeType)) {
    printConfiguration.sizeType = Number(queryStringArgs.sizeType)
  }
  // 是否显示打印logo
  if (!isNull(queryStringArgs.printContainLogo)) {
    printConfiguration.printContainLogo = Number(queryStringArgs.printContainLogo)
  }
  // 是否显示打印温馨提示
  if (!isNull(queryStringArgs.printContainDescription)) {
    printConfiguration.printContainDescription = Number(queryStringArgs.printContainDescription)
  }
  // 是否显示上次欠款
  if (!isNull(queryStringArgs.printContainLastTimeUnpaidAmount)) {
    printConfiguration.printContainLastTimeUnpaidAmount = Number(queryStringArgs.printContainLastTimeUnpaidAmount)
  }
  // 是否显示上次收款方式
  if (!isNull(queryStringArgs.printContainPaymentType)) {
    printConfiguration.printContainPaymentType = Number(queryStringArgs.printContainPaymentType)
  }
  // 文星提示内容
  if (!isNull(queryStringArgs.printDescription)) {
    printConfiguration.printDescription = queryStringArgs.printDescription
    printConfiguration.printDescription = replaceSpace(printConfiguration.printDescription || '')
  }

  _this.printConfiguration = printConfiguration
}

// 获取每张打印纸的高度a
PrintHelper.prototype.getHeightBySizeType = function (printConfiguration) {
  // 谷歌浏览器下每页A4纸张的高度
  var CHROME_A4_PAGE_H = 1386
  var CHROME_A5_PAGE_H = 1080
  // 三联单的高度
  // var WHOLE_PAGE_210_HEIGHT  = 1130;
  var WHOLE_PAGE_210_HEIGHT = 1220
  // IE浏览器下每页A4纸张的高度
  var IE_A4_PAGE_H = 1130

  var pageHeightInPx = 0
  // 80mm小票
  if (printConfiguration.sizeType == PRINT_SIZE_TYPE.NORMAL_80) {
    return CHROME_A4_PAGE_H
  }
  // 110mm小票
  else if (printConfiguration.sizeType == PRINT_SIZE_TYPE.NORMAL_110) {
    return CHROME_A4_PAGE_H
  }
  // A4纸张
  else if (printConfiguration.sizeType == PRINT_SIZE_TYPE.A4) {
    if (IECompat.isIE()) {
      pageHeightInPx = IE_A4_PAGE_H
    } else {
        	// 适配手机打印
        	if (getQueryStringArgs().device == PrintConfig.DEVICE_ANDROID || getQueryStringArgs().device == PrintConfig.DEVICE_IOS) {
        		pageHeightInPx = 1150
    		} else {
		         pageHeightInPx = CHROME_A4_PAGE_H
		    }
    }
  }
  // 三联单80列整张
  else if (printConfiguration.sizeType == PRINT_SIZE_TYPE.WHOLE_PAGE_210) {
    if (IECompat.isIE()) {
      pageHeightInPx = IE_A4_PAGE_H - 80 * 3
    } else {
      pageHeightInPx = WHOLE_PAGE_210_HEIGHT
    }
  }
  // 三联单80列对半
  else if (printConfiguration.sizeType == PRINT_SIZE_TYPE.HALVE_210) {
    if (IECompat.isIE()) {
      pageHeightInPx = (IE_A4_PAGE_H - 80 * 3) / 2
    } else {
      pageHeightInPx = (WHOLE_PAGE_210_HEIGHT) / 2
    }
  }
  // A5
  else if (printConfiguration.sizeType == PRINT_SIZE_TYPE.A5) {
    pageHeightInPx = CHROME_A5_PAGE_H
  }

  return pageHeightInPx
}

// 设置页面大小
PrintHelper.prototype.setSizeType = function (printConfiguration) {
  var pageClassName = ''
  if (printConfiguration.sizeType == PRINT_SIZE_TYPE.NORMAL_80) {
    $('.content').addClass('page80mm')
    pageClassName = 'page80mm'
  } else if (printConfiguration.sizeType == PRINT_SIZE_TYPE.NORMAL_110) {
    $('.content').addClass('page110mm')
    pageClassName = 'page110mm'
  } else if (printConfiguration.sizeType == PRINT_SIZE_TYPE.A5) {
    $('.content').addClass('page148mm')
    pageClassName = 'page148mm'
  } else if (printConfiguration.sizeType == PRINT_SIZE_TYPE.A4 ||
        printConfiguration.sizeType == PRINT_SIZE_TYPE.WHOLE_PAGE_210 ||
        printConfiguration.sizeType == PRINT_SIZE_TYPE.HALVE_210) {
    $('.content').addClass('page210mm')
    pageClassName = 'page210mm'
  }
  return pageClassName
},
// 给每个页面设置下标
PrintHelper.prototype.setPageIndex = function (pageHeightInPx) {
  $('.pageEnd').css({
         	'height': 20 + 'px'
  })
  $('.pageEnd').after('<p class="pageIndex" style="text-align: center;margin-top: 0.1cm"></p>')

  rejustLastTable()

  var totalPage = Math.ceil($('.pageEnd').offset().top / pageHeightInPx)
  $('.pageIndex').each(function (i) {
    $(this).html('第' + (i + 1) + '页/共' + totalPage + '页')
  })

  // 适配最后一页
  function rejustLastTable () {
        	// 显示页下标控件的高度
        	var FOOTER_INDEX_HEIGHT = 25
        	// 最后一页的分页标志地方
        	 var $lastPagingLabel = $('.lastPagingLabel').length > 0 ? $('.lastPagingLabel') : $('.table-box:last')
        	 var $lastPageIndex = $('.pageIndex:last')

        	 var lastPageIndex = Math.ceil(($lastPagingLabel.offset().top + $lastPagingLabel.height()) / pageHeightInPx)
        	 // 最后一页的页码的offset().top 加上它自身的高度
        	 var pageIndex = Math.ceil(($lastPageIndex.offset().top + FOOTER_INDEX_HEIGHT) / pageHeightInPx)
        	 // 上一个元素剩余的空间
	 		 var pageRemainder = lastPageIndex * pageHeightInPx - ($lastPagingLabel.offset().top + $lastPagingLabel.height())
       		 if (pageIndex > lastPageIndex || pageRemainder < FOOTER_INDEX_HEIGHT) {
       		 	var totalPage = $('.pageIndex').length
	            var footerHtml = [
	                '<div>',
	                '<p style="height: 4px;"></p>',
	                '<p class="pageIndex" style="text-align: center;height: 16px;">页</p>',
	                '<p style="height: ' + (pageRemainder) + 'px"></p>',
	                '<p style="height:1.0cm"></p>',
	                '</div>'
	            ].join('')
	            $('#table-container').append(footerHtml)
    }
  }
}

// 进入打印预览界面
PrintHelper.prototype.startPrint = function () {
  var _this = this
  if (parent.window.renderFinish) {
    // 告诉父级iframe界面已经渲染完毕
    var options = {
      documentHeight: $(document).height(),
      printFrameId: getQueryStringArgs().printFrameId,
      pageHeightInPx: _this.pageHeightInPx > 0 ? _this.pageHeightInPx : _this.getHeightBySizeType(_this.printConfiguration),
      pageClassName: _this.setSizeType(_this.printConfiguration)
    }
    parent.window.renderFinish(options)
    return
  }
  if (!getQueryStringArgs().isPreview) {
    window.print()
  }
  try {
    // 给安卓的回调
    if (getQueryStringArgs().device == PrintConfig.DEVICE_ANDROID) {
      javascript:Android.jsWindowOnload('DataStatistics')
    }
    if (getQueryStringArgs().device == PrintConfig.DEVICE_IOS) {
      printFn()
    }
  } catch (e) {};
},
// 分页工具
PrintHelper.prototype.paging = function (pageFn, pageIndex, pageHeightInPx, $lastChild, bottomMargin) {
  // 像素换算为毫米 x * 25.4 / px
//      var itemGap = $lastChild.height() ;
//      var THRESHOLD_VALUE = 20;//分页的阈值
//      var FOOTER_INDEX_HEIGHT = 4 + 16 ;//显示页下标控件的高度
//      var during = pageIndex*pageHeightInPx  -  Number($lastChild.offset().top + $lastChild.height() + FOOTER_INDEX_HEIGHT );
//
  // 分页的关键逻辑
//      if(during < THRESHOLD_VALUE ) {
//          var footerHtml = [
//              '<div>',
//              '<p style="height: '+4+'px"></p>',
//              '<p class="pageIndex" style="text-align: center;height: 16px;">第'+pageIndex+'页</p>',
//              '<p style="height: '+(during)+'px"></p>',
//              '<p style="height:2.0cm"></p>',
//              '</div>'
//          ].join('');
//          $('#table-container').append(footerHtml);
//          if(pageFn) {
//              pageFn();
//          }
//      }
  // 每一页距离底部的距离
  bottomMargin = bottomMargin || 10 * this.dip / 25.4
	 		var FOOTER_INDEX_HEIGHT = 25 // 显示页下标控件的高度
	 		var lastPageIndex = Math.ceil($lastChild.offset().top / pageHeightInPx)
	 		// 上一个元素剩余的空间
	 		var pageRemainder = lastPageIndex * pageHeightInPx - $lastChild.offset().top
	 		// 当前元素底部所在的页码
	 		var	pageIndex = Math.ceil(($lastChild.offset().top + $lastChild.height() + FOOTER_INDEX_HEIGHT + bottomMargin) / pageHeightInPx)
	        // 分页的关键逻辑
	        if (pageIndex > lastPageIndex || pageRemainder < FOOTER_INDEX_HEIGHT) {
	            var footerHtml = [
	                '<div>',
	                '<p style="height: 4px;"></p>',
	                '<p class="pageIndex" style="text-align: center;height: 16px;">第' + pageIndex + '页</p>',
	                '<p style="height: ' + (pageRemainder - FOOTER_INDEX_HEIGHT - bottomMargin) + 'px"></p>',
      '<p style="height:' + bottomMargin + 'px"></p>',
	                '<p class="pageTopSpace" style="height:0.31cm"></p>',
	                '</div>'
	            ].join('')
	            $('#table-container').append(footerHtml)
	            if (pageFn) {
	                pageFn()
	            }
  }
},

// 根据纸张获取双规格中的列数
PrintHelper.prototype.getDoubeSkuColumnSizeType = function (printConfiguration) {
  if (printConfiguration.sizeType == PRINT_SIZE_TYPE.A4 ||
     printConfiguration.sizeType == PRINT_SIZE_TYPE.WHOLE_PAGE_210 ||
     printConfiguration.sizeType == PRINT_SIZE_TYPE.HALVE_210) {
    return 10
  } else if (printConfiguration.sizeType == PRINT_SIZE_TYPE.A5) {
    return 6
  }
}
// 渲染双规格中的表头（专用方法）
PrintHelper.prototype.renderDoubeSkuColumnHeader = function (newSpecTwoList) {
  // 对表头进行渲染
  var SPEC_CELL_WIDTH = (100 / newSpecTwoList.length - 0.4).toFixed(2)
  $('#table-container').append($('#t-table-item').html())
  var $tableHeader = $('#table-container').find('.table-box:last')
  $.each(newSpecTwoList, function (i, specTwo) {
    $tableHeader.find('.goodsTypeBox').append('<span class="specCell" style="width: ' + SPEC_CELL_WIDTH + '%">' + specTwo.specName + '</span>')
  })
  $tableHeader.find('.specCell').css({
    width: SPEC_CELL_WIDTH + '%'
  })
  return $tableHeader
}
// 填充双规格中所有的空格（专用方法）
PrintHelper.prototype.renderDoubeSkuColumnTd = function ($lastChild, newSpecTwoList) {
  // 渲染表格内容
  var SPEC_CELL_WIDTH = (100 / newSpecTwoList.length - 0.4).toFixed(2)
  var goodsSpecTd2 = $lastChild.find('.goods-spec-td2')
  for (var i = 0; i < newSpecTwoList.length; i++) {
    var item = newSpecTwoList[i]
    goodsSpecTd2.append('<span class="specCell" style="width: ' + SPEC_CELL_WIDTH + '%" specTwo="' + item.specName + '"><span>')
  }
}

// 获得查询字符串参数
function getQueryStringArgs (url) {
  // 取得查询字符串并去掉开头的问号
  var qs = location.search.length > 0 ? location.search.substring(1) : ''
  if (!isNull(url)) {
    qs = url.substring(url.indexOf('?') + '?'.length)
  }
  var args = {}
  // 取得每一项
  var items = qs.length ? qs.split('&') : []
  var item = null,
    name = null,
    value = null
  // 逐个将每一项新增到args对象中
  for (var i = 0; i < items.length; i++) {
    item = items[i].split('=')
    name = decodeURIComponent(item[0])
    value = decodeURIComponent(item[1])
    if (name.length) {
      args[name] = value
    }
  }
  return args
}

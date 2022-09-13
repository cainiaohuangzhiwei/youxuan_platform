;(function () {
	var utils = UM.utils,
		browser = UM.browser,
		Base = {
			checkURL: function (url) {
				if (!url) return false
				url = utils.trim(url)
				if (url.length <= 0) {
					return false
				}
				if (url.search(/http:\/\/|https:\/\//) !== 0) {
					url += 'http://'
				}

				url = url.replace(/\?[\s\S]*$/, '')

				if (!/(.gif|.jpg|.jpeg|.png)$/i.test(url)) {
					return false
				}
				return url
			},
			getAllPic: function (sel, $w, editor) {
				var me = this,
					arr = [],
					$imgs = $(sel, $w)
				var initialFrameWidth =
					editor.options.initialFrameWidth -
					parseInt($(editor.body).css('padding-left')) -
					parseInt($(editor.body).css('padding-right'))
				$.each($imgs, function (index, node) {
					//              $(node).removeAttr("width").removeAttr("height");
					//将图片添加到编辑区域时，按比例缩放不超过最大尺寸
					if (node.naturalWidth >= initialFrameWidth) {
						node.width = initialFrameWidth
						node.height =
							(initialFrameWidth / node.naturalWidth).toFixed(2) *
							node.naturalHeight
						//                  me.scale(node, editor.options.initialFrameWidth -
						//                      parseInt($(editor.body).css("padding-left"))  -
						//                      parseInt($(editor.body).css("padding-right")));
					} else {
						node.width = node.naturalWidth
						node.height = node.naturalHeight
					}
					return arr.push({
						_src: $(node).attr('src'),
						src: $(node).attr('src'),
						width: node.width,
						height: node.height,
					})
				})

				return arr
			},
			scale: function (img, max, oWidth, oHeight) {
				var width = 0,
					height = 0,
					percent,
					ow = img.width || oWidth,
					oh = img.height || oHeight
				if (ow > max || oh > max) {
					if (ow >= oh) {
						if ((width = ow - max)) {
							percent = (width / ow).toFixed(2)
							img.height = oh - oh * percent
							img.width = max
						}
					} else {
						if ((height = oh - max)) {
							percent = (height / oh).toFixed(2)
							img.width = ow - ow * percent
							img.height = max
						}
					}
				}

				return this
			},
			close: function ($img) {
				$img
					.css({
						top: ($img.parent().height() - $img.height()) / 2,
						left: ($img.parent().width() - $img.width()) / 2,
					})
					.prev()
					.on('click', function () {
						if ($(this).parent().remove().hasClass('edui-image-upload-item')) {
							//显示图片计数-1
							Upload.showCount--
							Upload.updateView()
						}
					})

				return this
			},
			createImgBase64: function (img, file, $w) {
				if (browser.webkit) {
					//Chrome8+
					img.src = window.webkitURL.createObjectURL(file)
				} else if (browser.gecko) {
					//FF4+
					img.src = window.URL.createObjectURL(file)
				} else {
					//实例化file reader对象
					var reader = new FileReader()
					reader.onload = function (e) {
						img.src = this.result
						$w.append(img)
					}
					reader.readAsDataURL(file)
				}
			},
			callback: function (editor, $w, url, state) {
				if (state == 'success') {
					//显示图片计数+1
					Upload.showCount++
					var $img = $(
							"<img src='" +
								editor.options.imagePath +
								url +
								"' class='edui-image-pic' />"
						),
						$item = $(
							"<div class='edui-image-item edui-image-upload-item'><div class='edui-image-close'></div></div>"
						).append($img)

					if ($('.edui-image-upload2', $w).length < 1) {
						$('.edui-image-content', $w).append($item)

						Upload.render('.edui-image-content', 2).config(
							'.edui-image-upload2'
						)
					} else {
						$('.edui-image-upload2', $w).before($item).show()
					}

					$img.on('load', function () {
						Base.scale(this, 120)
						Base.close($(this))
						$('.edui-image-content', $w).focus()
					})
				} else {
					currentDialog.showTip(state)
					window.setTimeout(function () {
						currentDialog.hideTip()
					}, 3000)
				}

				Upload.toggleMask()
			},
		}

	/*
	 * 本地上传
	 * */
	var Upload = {
		showCount: 0,
		uploadTpl:
			'<div class="edui-image-upload%%">' +
			'<span class="edui-image-icon"></span>' +
			'<form class="edui-image-form" method="post" enctype="multipart/form-data" target="up">' +
			'<input style="filter: alpha(opacity=0);" class="edui-image-file" type="file" hidefocus name="image" accept="image/gif,image/jpeg,image/png,image/jpg,image/bmp"/>' +
			'</form>' +
			'</div>',
		init: function (editor, $w) {
			var me = this

			me.editor = editor
			me.dialog = $w
			//防止拖放到文件上传框中
			//          me.render(".edui-image-local", 1);
			me.render('.edui-image-content', 1)
			me.config('.edui-image-upload1')
			me.submit()
			me.drag()

			$('.edui-image-upload1').hover(function () {
				$('.edui-image-icon', this).toggleClass('hover')
			})

			if (!(UM.browser.ie && UM.browser.version <= 9)) {
				$('.edui-image-dragTip', me.dialog).css('display', 'block')
			}

			return me
		},
		render: function (sel, t) {
			var me = this

			$(sel, me.dialog).append($(me.uploadTpl.replace(/%%/g, t)))
			//edit by leon (添加上传的额外参数)
			var $form = $(sel, me.dialog)
				.find('.edui-image-upload' + t)
				.find('.edui-image-form')
			if ($form.find('input[name="userId"]').length == 0) {
				console.log('图片上传参数', me.editor.options.uploadParams)
				for (var key in me.editor.options.uploadParams) {
					var paramValue = me.editor.options.uploadParams[key]
					$form.append(
						'<input style="filter: alpha(opacity=0);position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index:-1;">'
					)
					$form.find('input:last').attr('name', key).attr('value', paramValue)
				}
			}
			return me
		},
		config: function (sel) {
			var me = this,
				url = me.editor.options.imageUrl

			url =
				url + (url.indexOf('?') == -1 ? '?' : '&') + 'editorid=' + me.editor.id //初始form提交地址;

			$('form', $(sel, me.dialog)).attr('action', url)

			return me
		},
		uploadComplete: function (r) {
			var me = this
			try {
				var json = eval('(' + r + ')')

				// edit by Leon
				//（保存新增的图片对象）
				// me.editor.options.newUploadImagesList.push(json.resultData.imageList[0])
				// window.console.log(
				// 	' me.editor.options.newUploadImagesList.push(json.resultData.imageList[0])'
				// )
				if (!me.editor.options.isImageList) {
					me.editor.options.newUploadImagesList.push(json.resultData.url)
				} else {
					me.editor.options.newUploadImagesList.push(
						json.resultData.imageList[0]
					)
				}
				window.console.log(
					' me.editor.options.newUploadImagesList.push(json.resultData.url)'
				)
				// Base.callback(me.editor, me.dialog, json.url, json.state);
				// Base.callback(
				// 	me.editor,
				// 	me.dialog,
				// 	json.resultData.imageList[0].imageUrl,
				// 	json.result
				// )
				console.log(json.resultData)
				if (!me.editor.options.isImageList) {
					Base.callback(me.editor, me.dialog, json.resultData.url, json.result)
				} else {
					if (json.resultCode == 0) {
						Base.callback(
							me.editor,
							me.dialog,
							json.resultData.imageList[0].imageUrl,
							'success'
						)
					} else {
						Base.callback(
							me.editor,
							me.dialog,
							json.resultData.imageList[0].imageUrl,
							'errer'
						)
					}
					// me.editor.options.newUploadImagesList.push(json.resultData.imageList[0], 'success')
				}
			} catch (e) {
				var lang = me.editor.getLang('image')

				Base.callback(
					me.editor,
					me.dialog,
					'',
					(lang && lang.uploadError) || 'Error!'
				)
			}
		},
		submit: function (callback) {
			var me = this,
				input = $(
					'<input style="filter: alpha(opacity=0);" class="edui-image-file" type="file" hidefocus="" name="upfile" accept="image/gif,image/jpeg,image/png,image/jpg,image/bmp">'
				),
				input = input[0]

			$(me.dialog).delegate('.edui-image-file', 'change', function (e) {
				if (!this.parentNode) {
					return
				}

				//edit by leon (添加上传的额外参数)
				//              if($('input[name="userId"]').length  == 0) {
				//                  var $form  = $(me.dialog).find('.edui-image-form');
				//                  for ( var key in me.editor.options.uploadParams) {
				//                      var paramValue = me.editor.options.uploadParams[key];
				//                      $form.append('<input style="filter: alpha(opacity=0)">');
				//                      $form.find('input:last').attr('name',key).attr('value',paramValue);
				//                  }
				//              }

				$('<iframe name="up" style="display: none"></iframe>')
					.insertBefore(me.dialog)
					.on('load', function () {
						var r = this.contentWindow.document.body.innerHTML

						if (r.indexOf('<pre') >= 0) {
							r = $(r).html()
						}

						window.console.log(r)

						if (r == '') return
						me.uploadComplete(r)
						$(this).unbind('load')
						$(this).remove()
					})

				//获取文件列表
				var fileList = e.currentTarget.files
				var img = document.createElement('img')
				// var hasImg = false;
				console.log(me.editor, 'me.editorme.editor')
				var token = me.editor.options.uploadParams['sessionKey']
				var csrf = me.editor.options.csrf
				console.log('fwb图片上传token', token)
				console.log('fwb图片上传fileList', fileList)
				console.log('fwb图片上传uploadParams', me.editor.options.uploadParams)
				$.each(fileList, function (i, f) {
					console.log('f：', f)
					if (/^image/.test(f.type)) {
						//创建图片的base64
						Base.createImgBase64(img, f, me.dialog)
						var xhr = new XMLHttpRequest()
						// xhr.open('post', me.editor.getOpt('imageUrl') + '?type=ajax', true)
						xhr.open('post', me.editor.getOpt('imageUrl'), true)
						xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
						xhr.setRequestHeader('X-AUTH-TOKEN', token)
						xhr.setRequestHeader('x-csrf-token', csrf)
						xhr.setRequestHeader('WEEGET_PLATFORM_TYPE', 4)
						//模拟数据
						var fd = new FormData()
						fd.append(me.editor.options.imageFieldName, f)
						//edit by Leon
						for (var key in me.editor.options.uploadParams) {
							fd.append(key, me.editor.options.uploadParams[key])
							console.log('~~', fd.get(key))
						}
						console.log('~~文件名称', me.editor.options.imageFieldName)
						console.log('~~上传参数', me.editor.options.uploadParams)
						xhr.send(fd)
						xhr.addEventListener('load', function (e) {
							var r = e.target.response,
								json
							me.uploadComplete(r)
							if (i == fileList.length - 1) {
								$(img).remove()
							}
						})
						// hasImg = true;
					}
				})

				// $(this).parent()[0].submit();
				Upload.updateInput(input)
				me.toggleMask('Loading....')

				callback && callback()
			})

			return me
		},
		//更新input
		updateInput: function (inputField) {
			$('.edui-image-file', this.dialog).each(function (index, ele) {
				ele.parentNode.replaceChild(inputField.cloneNode(true), ele)
			})
		},
		//更新上传框
		updateView: function () {
			if (Upload.showCount !== 0) {
				return
			}

			$('.edui-image-upload2', this.dialog).hide()
			$('.edui-image-dragTip', this.dialog).show()
			$('.edui-image-upload1', this.dialog).show()
		},
		drag: function () {
			var me = this
			//做拖拽上传的支持
			if (!UM.browser.ie9below) {
				//防止拖放到文件上传框中
				//          		me.dialog.find('.edui-image-file').on('drop',function (e) {
				//          			e.preventDefault();
				//          		}).on('dragover', function (e) {
				//                  e.preventDefault();
				//              });
				me.dialog
					.find('.edui-image-content')
					.on('drop', function (e) {
						//获取文件列表
						var fileList = e.originalEvent.dataTransfer.files
						var img = document.createElement('img')
						var token = me.editor.options.uploadParams['sessionKey']
						var csrf = me.editor.options.csrf
						var hasImg = false
						$.each(fileList, function (i, f) {
							console.log('f：', f)
							if (/^image/.test(f.type)) {
								//创建图片的base64
								Base.createImgBase64(img, f, me.dialog)
								var xhr = new XMLHttpRequest()
								// xhr.open(
								// 	'post',
								// 	me.editor.getOpt('imageUrl') + '?type=ajax',
								// 	true
								// )
								xhr.open('post', me.editor.getOpt('imageUrl'), true)
								xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
								xhr.setRequestHeader('X-AUTH-TOKEN', token)
								xhr.setRequestHeader('x-csrf-token', csrf)
								xhr.setRequestHeader('WEEGET_PLATFORM_TYPE', 4)
								//模拟数据
								var fd = new FormData()
								fd.append(me.editor.options.imageFieldName, f)
								//edit by Leon
								for (var key in me.editor.options.uploadParams) {
									fd.append(key, me.editor.options.uploadParams[key])
								}
								xhr.send(fd)
								xhr.addEventListener('load', function (e) {
									var r = e.target.response,
										json
									me.uploadComplete(r)
									if (i == fileList.length - 1) {
										$(img).remove()
									}
								})
								// hasImg = true;
							}
						})
						if (hasImg) {
							e.preventDefault()
							me.toggleMask('Loading....')
						}
					})
					.on('dragover', function (e) {
						e.preventDefault()
					})
			}
		},
		toggleMask: function (html) {
			var me = this

			var $mask = $('.edui-image-mask', me.dialog)
			if (html) {
				if (!(UM.browser.ie && UM.browser.version <= 9)) {
					$('.edui-image-dragTip', me.dialog).css('display', 'none')
				}
				$('.edui-image-upload1', me.dialog).css('display', 'none')
				$mask.addClass('edui-active').html(html)
			} else {
				$mask.removeClass('edui-active').html()

				if (Upload.showCount > 0) {
					return me
				}

				if (!(UM.browser.ie && UM.browser.version <= 9)) {
					$('.edui-image-dragTip', me.dialog).css('display', 'block')
				}
				$('.edui-image-upload1', me.dialog).css('display', 'block')
			}

			return me
		},
	}

	/*
	 * 网络图片
	 * */
	var NetWork = {
		init: function (editor, $w) {
			var me = this

			me.editor = editor
			me.dialog = $w

			me.initEvt()
		},
		initEvt: function () {
			var me = this,
				url,
				$ele = $('.edui-image-searchTxt', me.dialog)

			$('.edui-image-searchAdd', me.dialog)
				.on('click', function () {
					url = Base.checkURL($ele.val())

					if (url) {
						$("<img src='" + url + "' class='edui-image-pic' />").on(
							'load',
							function () {
								var $item = $(
									"<div class='edui-image-item'><div class='edui-image-close'></div></div>"
								).append(this)

								$('.edui-image-searchRes', me.dialog).append($item)

								Base.scale(this, 120)

								$item.width($(this).width())

								Base.close($(this))

								$ele.val('')
							}
						)
					}
				})
				.hover(function () {
					$(this).toggleClass('hover')
				})
		},
	}

	var $tab = null,
		currentDialog = null

	//增加资源版本号，防止缓存
	UM.registerWidget(
		'image',
		{
			tpl:
				'<link rel="stylesheet" type="text/css" href="<%=image_url%>image.css?v=1.0.4">' +
				'<div class="edui-image-wrapper">' +
				'<ul class="edui-tab-nav">' +
				'<li class="edui-tab-item edui-active"><a data-context=".edui-image-local" class="edui-tab-text"><%=lang_tab_local%></a></li>' +
				'<li  class="edui-tab-item"><a data-context=".edui-image-JimgSearch" class="edui-tab-text"><%=lang_tab_imgSearch%></a></li>' +
				'</ul>' +
				'<div class="edui-tab-content">' +
				'<div class="edui-image-local edui-tab-pane edui-active">' +
				'<div class="edui-image-content"></div>' +
				'<div class="edui-image-mask"></div>' +
				'<div class="edui-image-dragTip"><%=lang_input_dragTip%></div>' +
				'</div>' +
				'<div class="edui-image-JimgSearch edui-tab-pane">' +
				'<div class="edui-image-searchBar">' +
				'<table><tr><td><input class="edui-image-searchTxt" type="text"></td>' +
				'<td><div class="edui-image-searchAdd"><%=lang_btn_add%></div></td></tr></table>' +
				'</div>' +
				'<div class="edui-image-searchRes"></div>' +
				'</div>' +
				'</div>' +
				'</div>',
			initContent: function (editor, $dialog) {
				var lang = editor.getLang('image')['static'],
					opt = $.extend({}, lang, {
						image_url: UMEDITOR_CONFIG.UMEDITOR_HOME_URL + 'dialogs/image/',
					})

				Upload.showCount = 0

				if (lang) {
					var html = $.parseTmpl(this.tpl, opt)
				}

				currentDialog = $dialog.edui()

				this.root().html(html)
			},
			initEvent: function (editor, $w) {
				$tab = $.eduitab({ selector: '.edui-image-wrapper' })
					.edui()
					.on('beforeshow', function (e) {
						e.stopPropagation()
					})

				Upload.init(editor, $w)

				NetWork.init(editor, $w)
			},
			buttons: {
				ok: {
					exec: function (editor, $w) {
						var sel = '',
							index = $tab.activate()

						if (index == 0) {
							sel = '.edui-image-content .edui-image-pic'
						} else if (index == 1) {
							sel = '.edui-image-searchRes .edui-image-pic'
						}

						var list = Base.getAllPic(sel, $w, editor)

						if (index != -1) {
							editor.execCommand('insertimage', list)
						}
					},
				},
				cancel: {},
			},
			width: 900,
			/*修改弹窗高度*/
			height: 408,
			//      height: 558
		},
		function (editor, $w, url, state) {
			Base.callback(editor, $w, url, state)
		}
	)
})()

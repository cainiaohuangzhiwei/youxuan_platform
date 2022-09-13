<template>
	<div style="width: 100%">
		<script :id="name" type="text/plain"></script>
	</div>
</template>
<script>
// import eggConfig from '../../../config/config.default'
// const youxuan_config = eggConfig({ name: 'youxuan_web' })
// const baseURL = `${youxuan_config.youxuan.apiServe.prefix}`
import store from '@/store'
import { getToken } from '@/utils/auth'
import { imgCosServerPath } from '@/utils/imageTool'
import { getCsrf } from '@/utils/helper/common.js'
import '../../../static/umeditor1.2/themes/default/css/umeditor.css'
import '../../../static/umeditor1.2/third-party/jquery.js'
import '../../../static/umeditor1.2/umeditor.min.js'
import '../../../static/umeditor1.2/umeditor.config.js'
import '../../../static/umeditor1.2/lang/zh-cn/zh-cn.js'
export default {
	name: 'UE',
	props: {
		defaultMsg: {
			type: String,
			default: '',
		},
		name: {
			type: String,
			default: 'myEditor',
		},
		imageType: {
			// 富文本图片类型
			type: Number,
			default: 18,
		},
		imageUrl: {
			type: String,
			// default: '/yhtplus/fileAction/uploadFile.action?action=uploadimage',
			default: `/weeget-infinite-backend-gateway/yhtplus/fileAction/uploadFile.action?action=uploadimage`,
		},
		isImageList: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			editor: null,
			userId: '',
			sessionKey: '',
		}
	},
	watch: {
		defaultMsg: {
			handler(newValue) {
				this.editor.setContent(newValue)
			},
			deep: true,
		},
	},
	mounted() {
		this.$nextTick(function () {
			console.log('RichText init', getCsrf())
			let _this = this
			window.UM.delEditor(_this.name)
			this.editor = window.UM.getEditor(_this.name, {
				// imageUrl: baseURL + _this.imageUrl, // 图片上传提交地址
				imageUrl: _this.imageUrl, // 图片上传提交地址
				imagePath: imgCosServerPath, // 图片修正地址，引用了fixedImagePath,如有特殊需求，可自行配置
				imageFieldName: 'image', // 图片数据的key,若此处修改，需要在后台对应文件修改对应参数
				csrf: getCsrf(),
				isImageList: _this.isImageList,
				uploadParams: {
					// 图片上传参数
					userId: store.state.user.userInfo.userId,
					sessionKey: getToken() || store.state.user.token,
					data: JSON.stringify({
						imageType: _this.imageType, // 富文本的图片类型
					}),
				},
			}) // 初始化UM
		})
	},
	methods: {
		getInformation() {
			/** 获取内容方法 **/
			return this.editor.getContent()
		},
		getInformationImageList: function () {
			/** 获取图片列表 **/
			return this.editor.options.newUploadImagesList
		},
	},
	destroyed() {
		/** 清楚富文本 **/
		this.editor.destroy()
	},
}
</script>

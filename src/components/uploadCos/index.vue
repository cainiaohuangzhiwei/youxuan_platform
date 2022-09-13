<template>
	<div>
		<el-upload
			class="upload-demo"
			action="#"
			multiple
			:show-file-list="false"
			:before-upload="beforeAvatarUpload"
			:http-request="_uploadImageHttpRequest"
		>
			<el-button slot="trigger" size="small" type="primary" icon="el-icon-plus"
				>添加图片/视频素材</el-button
			>
		</el-upload>
	</div>
</template>
<script>
import { uploadImgToCos } from '@/utils/upload'
export default {
	props: {
		index: {
			type: Number,
			default: null,
		},
		videoMaxSize: {
			type: Number,
			default: 200,
		},
	},
	data() {
		return {
			imgList: [],
		}
	},
	methods: {
		openFullScreen() {
			const loading = this.$loading({
				lock: false,
				text: '',
				spinner: '',
				background: '',
			})
			return loading
		},
		closeFullScreen(loading) {
			loading.close()
		},
		_uploadImageHttpRequest: async function (params) {
			const isLt200M =
				params.file.size / 1024 / 1024 < (this.videoMaxSize || 200)
			const isType = /\.(jpg|jpeg|png|GIF|gif|JPG|PNG|mp4)$/.test(
				params.file.name.toLocaleLowerCase()
			)
			let type = params.file.name.substring(
				params.file.name.toLocaleLowerCase().lastIndexOf('.') + 1
			)
			if (!isType) {
				return this.$message.warning('不支持的上传类型')
			}
			if (type == 'mp4') {
				if (!isLt200M) {
					return this.$message({
						message: `上传文件大于${this.videoMaxSize || 200}M,请重新选择!`,
						type: 'warning',
					})
				}
			}
			this.openFullScreen()
			const result = await uploadImgToCos(params.file)
			this.closeFullScreen(this.openFullScreen())
			console.log(result)
			// this.imgList.push(result)
			// let obj = {
			// 	index: this.index,
			// 	imgList: this.imgList,
			// }
			this.$emit('upload', result)
		},
	},
}
</script>
<style>
/* .uploaderCos .avatar-uploader .el-upload {
	border: 1px dashed #d9d9d9 !important;
	border-radius: 6px !important;
	cursor: pointer !important;
	position: relative !important;
	overflow: hidden !important;
}
.uploaderCos .avatar-uploader .el-upload:hover {
	border-color: #409eff !important;
}
.uploaderCos .avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 80px;
	height: 80px;
	line-height: 80px;
	text-align: center;
}
.uploaderCos .avatar {
	width: 80px;
	height: 80px;
	display: block;
} */
</style>

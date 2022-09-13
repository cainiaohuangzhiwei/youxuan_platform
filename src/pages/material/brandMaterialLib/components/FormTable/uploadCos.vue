<template>
	<div class="uploaderCos">
		<!-- <el-image
			style="width: 100px; height: 100px"
			src="https://imagecos.yunhuotong.net/2021_12/21a1eaa455bf745a56552771d2a3b694.gif"
			fit="cover"
		></el-image> -->
		<el-upload
			class="avatar-uploader"
			action="#"
			limit="9"
			multiple
			:show-file-list="false"
			:file-list="fileList"
			:before-upload="beforeAvatarUpload"
			:http-request="_uploadImageHttpRequest"
		>
			<img v-if="imageUrl" :src="imageUrl" class="avatar" />
			<i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
		fileList: {
			define: false,
			default: () => [],
		},
		imgList: {
			define: false,
			default: () => [],
		},
	},
	data() {
		return {}
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
			const isLt300M = params.file.size / 1024 / 1024 < 300
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
				if (!isLt300M) {
					return this.$message({
						message: '上传文件大于300M,请重新选择!',
						type: 'warning',
					})
				}
			}
			this.openFullScreen()
			const result = await uploadImgToCos(params.file)
			this.closeFullScreen(this.openFullScreen())
			let res = {}
			res.materialContent = result.url
			if (result.type.toLocaleLowerCase() == 'mp4') {
				res.materialType = 'video'
			} else {
				res.materialType = 'image'
			}
			this.imgList.push(res)
			this.fileList.push(res)
			let obj = {
				index: this.index,
				imgList: this.imgList,
				fileList: this.fileList,
			}
			this.$emit('upload', obj)
		},
	},
}
</script>
<style>
.uploaderCos .avatar-uploader .el-upload {
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
}
</style>

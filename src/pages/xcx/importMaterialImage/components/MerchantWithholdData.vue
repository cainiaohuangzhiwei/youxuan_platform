<template>
	<div>
		<!-- <el-button type="primary" class="el-icon-right" @click="oldSystem"
			>老系统</el-button
		> -->
		<h4 class="mtb20">导入图片</h4>
		导入评价素材图片说明：
		<p class="lh26">
			1、所有的评价素材图片必须压缩在一个ZIP文件里面。
			<br />
			2、对应评价图片文件名应为：评价对应的ID （如：1）
			<br />
			3、若有多张图片，需把所有的图片放在一个文件夹里面，该文件夹以评论ID命名。
			<br />
			4、普通素材图片可以随便命名。
			<br />
			5、头像命名规范必须为：head.jpg（头像必须按照head命名），与素材图片放在同一个文件夹中。
			<br />
			6、文件夹名称一致的情况下新上传的图片会替代的所有旧图片。
			<br />
			7、每个素材最多支持9张图片，图片格式仅支持JPG,JPEG,BMP,PNG格式
			<br />
			8、单一素材图片如果超过9张，超过部分系统会自动清除。
			<br />
			9、文件大小不可超过200M。
		</p>
		<yx-form
			ref="withholdData"
			:inline="true"
			:data="storeData"
			:items="storeFormOptions"
		>
		</yx-form>
		<div v-if="resultMsg == '成功'" style="color: #db5050">
			<div>
				导入结果：成功{{ data.successCount }}款评价素材，失败{{
					data.errorCount
				}}款评价素材。
			</div>
			<div>失败评价素材明细：{{ data.errorMsg }}</div>
		</div>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { impostEvaluationImage } from '@/api/webImport'
export default {
	name: 'MerchantWithholdData',
	components: { YxForm },
	data() {
		return {
			storeData: {},
			data: {},
			resultMsg: '',
			storeFormOptions: [
				{
					type: 'upload',
					dataIndex: 'goodsImg',
					uploadAttributes: {
						limit: 1,
						autoUpload: false,
						accept: 'aplication/zip',
						httpRequest: (file) => this._uploadPictures(file),
					},
					class: 'excel-upload',
				},
			],
		}
	},
	methods: {
		// 打开老系统
		oldSystem() {
			window.open(`/yhtplus/web/importMaterialImage.html`)
		},
		async _uploadPictures(file) {
			this.data = {}
			this.resultMsg = ''
			let formData = new FormData()
			formData.append('formId', '#materialZipForm')
			formData.append(
				'organizationId',
				this.$store.state.user.userInfo.organizationId
			)
			formData.append(
				'data',
				JSON.stringify({
					organizationId: this.$store.state.user.userInfo.organizationId,
					timeStamp: new Date() * 1,
					groupId: 2,
				})
			)
			formData.append('upload_picture', file.file)
			let {
				data: { resultCode, resultMsg, resultData },
			} = await impostEvaluationImage(formData)
			if (resultCode === 0) {
				this.data = resultData
				this.resultMsg = resultMsg
				this.$message.success(resultMsg)
			}
			this.$refs['withholdData'].$refs.goodsImg[0].clearFiles()
		},
	},
}
</script>

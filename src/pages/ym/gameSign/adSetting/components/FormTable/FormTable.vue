<template>
	<basic-container>
		<yx-form
			ref="form"
			v-loading="showLoading"
			:inline="false"
			:items="item"
			:data="formData"
			:rules="formRules"
			labelWidth="120px"
			:formAction="formAction"
		>
		</yx-form>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import { uploadImageList } from '@/api/image'
import { getSmallImg } from '@/utils/imageTool'
import { addActFishAd, getActFishAdList } from '@/api/actFish'

export default {
	components: {
		BasicContainer,
		YxForm,
	},
	name: 'FormTable',

	data() {
		return {
			item: [
				{
					type: 'uploadImage',
					title: '广告位入口',
					dataIndex: 'advertisementImage',
					uploadAttributes: {
						limit: 1,
						imageName: 'imageUrl',
						accept: 'image/jpeg, image/jpg, image/png, image/gif',
						httpRequest: (file) => this._uploadImageHttpRequest(file),
					},
				},
				{
					title: '可展示时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
				},
				{
					title: '小程序链接',
					placeholder: '小程序链接',
					type: 'input',
					dataIndex: 'jumpUrl',
				},
			],
			showLoading: false,
			formData: {
				jumpUrl: '',
				startTime: '',
				endTime: '',
				advertisementImage: [],
			},
			formRules: {
				startTime: [
					{
						required: true,
						message: '请选择开始时间',
						trigger: ['blur', 'change'],
					},
				],
				endTime: [
					{
						required: true,
						message: '请选择结束时间',
						trigger: ['blur', 'change'],
					},
				],
				advertisementImage: [
					{
						required: true,
						message: '请上传广告位入口',
						trigger: ['blur', 'change'],
					},
				],
			},
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
			],
		}
	},
	created() {
		this._getActFishAdList()
	},
	methods: {
		async _getActFishAdList() {
			this.showLoading = true
			let { data } = await getActFishAdList()
			this.showLoading = false
			if (data.resultCode == 0 && data.resultData.length) {
				const formData = { ...data.resultData[0] }
				formData.advertisementImage = []
				if (data.resultData[0].advertisementImage) {
					formData.advertisementImage.push({
						imageUrl: getSmallImg(data.resultData[0].advertisementImage),
						imageUrlTemp: data.resultData[0].advertisementImage,
					})
				}
				this.formData = formData
			}
		},
		// 上传图标图片
		_uploadImageHttpRequest: async function (params) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#gameSignAd', imageType: 82 })
			)
			if (params.file.size > 1024 * 500) {
				this.$message.error('图片的大小不能超过500K')
				this.formData.advertisementImage = []
				return
			}
			formData.append('file', params.file)
			const res = await uploadImageList(formData)
			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				this.formData.advertisementImage.push({
					imageUrl: getSmallImg(res.data.resultData.imageList[0].imageUrl),
					imageUrlTemp: res.data.resultData.imageList[0].imageUrl,
				})
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
		// 提交
		submitForm: async function () {
			const param = {
				actFishAdvertisementId: this.formData.actFishAdvertisementId,
				jumpUrl: this.formData.jumpUrl,
				startTime: new Date(this.formData.startTime).getTime(),
				endTime: new Date(this.formData.endTime).getTime(),
				advertisementImage: this.formData.advertisementImage.length
					? this.formData.advertisementImage[0].imageUrlTemp
					: '',
			}
			try {
				this.showLoading = true
				let { data } = await addActFishAd(param)
				this.showLoading = false
				if (data.resultCode == 0) {
					let msg = this.formData.actFishAdvertisementId
						? '编辑成功'
						: '添加成功'
					this.$message({
						message: msg,
						type: 'success',
					})
					this._getActFishAdList()
				}
			} catch (e) {
				this.$message.error('添加失败，请稍后再试')
			}
		},
	},
}
</script>

<style lang="scss" scope></style>

<template>
	<div>
		<el-dialog
			width="600px"
			:title="`${title}`"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="open"
		>
			<yx-form
				ref="form"
				v-loading="loading"
				labelWidth="140px"
				:items="item"
				:rules="funRules"
				:data="formData"
				:formAction="formAction"
			>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import { savePrize } from '@/api/lotteryTools'
import YxForm from '@wg-vue-materials/yx-form'
import moment from 'moment'
import { getSmallImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: '',
		},
		row: {
			type: Object,
			default: () => ({}),
		},
		dialogState: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		YxForm,
	},

	data() {
		return {
			selectCoupon: {},
			couponRow: [],
			formData: {
				prizeType: 1,
				prizeName: '',
				useTime: [],
				prizeImgUrl: [],
				prizeNumber: '',
			},
			couponIds: [],
			fileToUpload: '',
			item: [
				{
					type: 'select',
					title: '奖品类型',
					dataIndex: 'prizeType',
					label: 'value',
					options: [
						{
							prizeType: 1,
							value: '实物奖品',
						},
					],
				},
				{
					title: '奖品名称',
					dataIndex: 'prizeName',
					placeholder: '请输入奖品名称',
				},
				{
					type: 'uploadImage',
					title: '奖品图片',
					dataIndex: 'prizeImgUrl',
					uploadAttributes: {
						isEdit: true,
						limit: 1,
						imageName: 'prizeImgUrl',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'prizeImgUrl', 2048),
					},
				},
				{
					type: 'time',
					title: '可领取时间',
					dataIndex: 'useTime',
					timeAttributes: {
						type: 'datetimerange',
					},
				},
				{
					title: '奖品数量',
					dataIndex: 'prizeNumber',
					placeholder: '请输入奖品数量',
				},
			],
			loading: false,
			formsDialog: false,
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this._save()
					},
				},
				{
					title: '取消',
					type: 'default',
					cancel: true,
					click: () => {
						this.localVisible = false
					},
				},
			],
			funRules: {
				prizeType: [
					{
						required: true,
						message: '请选择奖品类型！',
						trigger: 'blur',
					},
				],
				prizeName: [
					{
						required: true,
						message: '请输入奖品名称！',
						trigger: 'blur',
					},
					{
						validator: (rule, value, callback) => {
							if (value.length > 30) {
								callback(new Error('活动名称不能超过30个字符！'))
							} else {
								callback()
							}
						},
					},
				],
				useTime: [
					{
						required: true,
						message: '请选择奖品时效时间!',
						trigger: 'blur',
					},
				],
				prizeImgUrl: [
					{
						required: true,
						message: '请选择奖品图片!',
						trigger: 'blur',
					},
				],
				prizeNumber: [
					{
						required: true,
						message: '请输入奖品数量！',
						trigger: 'blur',
					},
					{
						validator: (rule, value, callback) => {
							if (!/\d+/.test(value)) {
								callback(new Error('请填写数量'))
							} else if (!/^[0-9]+$/.test(value)) {
								callback(new Error('请填写正整数'))
							} else if (value > 100000) {
								callback(new Error('请输入小于100000的正整数'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
		}
	},

	computed: {
		localVisible: {
			get() {
				return this.visible
			},
			set(val) {
				this.$emit('update:visible', val)
			},
		},
	},

	methods: {
		handleAdd() {
			this.couponRow = JSON.parse(JSON.stringify(this.selectCoupon))
			this.formsDialog = true
		},
		//保存
		async _save() {
			let paramsData = {
				functionType: this.row.prizeSettingId ? 1 : 0,
				prizeStartTime: moment(this.formData.useTime[0]).valueOf(),
				prizeEndTime: moment(this.formData.useTime[1]).valueOf(),
				prizeName: this.formData.prizeName,
				prizeType: this.formData.prizeType,
				prizeImgUrl: this.formData.prizeImgUrl?.[0]?.prizeImgUrl,
				prizeNumber: this.formData.prizeNumber,
			}

			this.loading = true
			if (this.row.prizeSettingId) {
				paramsData.prizeSettingId = this.row.prizeSettingId
			}
			const res = await savePrize(paramsData)
			const resultCode = res.data.resultCode
			if (resultCode == 0) {
				this.$message({
					message: '操作成功',
					type: 'success',
				})
				this.localVisible = false
				this.$emit('initTable')
			}
			this.loading = false
		},

		resetForm() {
			this.localVisible = false
			this.$refs?.form?.$refs?.YxForm?.resetFields()
		},

		async open() {
			this.$refs?.form?.$refs?.YxForm?.resetFields()
			this.loading = false
			if (this.row.prizeSettingId) {
				this.formData.useTime = [this.row.prizeStartTime, this.row.prizeEndTime]
				this.formData.prizeSettingId = this.row.prizeSettingId
				this.formData.prizeName = this.row.prizeName
				this.formData.prizeType = this.row.prizeType
				this.formData.prizeImgUrl = [{ prizeImgUrl: this.row.prizeImgUrl }]
				this.formData.prizeNumber = this.row.prizeNumber
			} else {
				this.formData.useTime = []
				this.formData.prizeSettingId = ''
				this.formData.prizeName = ''
				this.formData.prizeType = 1
				this.formData.prizeImgUrl = []
				this.formData.prizeNumber = ''
			}
			this.item.forEach((item) => {
				if (item.dataIndex != 'prizeNumber' && this.row.prizeSettingId) {
					item.disabled = true
				} else {
					item.disabled = false
				}
			})
		},

		handleVerify(e) {
			console.log('e', e)
		},
		//上传图片
		async uploadImageHttpRequest(params, key, maxSize) {
			let file = params.file
			let that = this
			console.log('file', file)
			const size = params.file.size
			let index = file.name.lastIndexOf('.')
			let format = file.name.substring(index + 1, file.name.length)
			if (!/\.|png|jpg|gif/i.test(format)) {
				this.$message.warning('图片上传有误,仅支持上传png,jpg,gif格式图片')
				this.formData[key] = []
				return
			}
			if (maxSize && size >= 1024 * maxSize) {
				this.$message.warning(`图片大小不超过${maxSize / 1024}M`)
				this.formData[key] = []
				return
			}
			let _URL = window.URL || window.webkitURL
			let img = new Image()
			img.onload = function () {
				let valid = true
				if (img.width < 800 || img.height < 800) {
					valid = false
				}
				if (img.width != img.height) {
					valid = false
				}
				if (valid) {
					that._uploadImageList(file, key)
				} else {
					that.$message.warning('图片尺寸 800px*800px 以上，并且比例1:1')
					that.formData[key] = []
				}
			}
			img.src = _URL.createObjectURL(file)
		},
		async _uploadImageList(file, key) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#addMaterial', imageType: 1 })
			)
			formData.append('file', file)
			let {
				data: { resultData },
			} = await uploadImageList(formData)
			this.formData[key] = resultData.imageList
			this.formData[key][0][key] = getSmallImg(resultData.imageList[0].imageUrl)
		},
	},
}
</script>

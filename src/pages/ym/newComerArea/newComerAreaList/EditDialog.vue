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
import { uploadImageList } from '@/api/image'
import { shopkeeperActivitySave } from '@/api/newComerArea'
import YxForm from '@wg-vue-materials/yx-form'
import moment from 'moment'
import { getBigImg } from '@/utils/imageTool'

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
			formData: {
				activityName: '',
				useTime: [],
				landingActivityPicUrlList: [],
				taskActivityPicUrlList: [],
				landingJumpUrl: '',
			},
			item: [
				{
					dataIndex: 'activityName',
					title: '活动名称',
					maxlength: 50,
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
					type: 'uploadImage',
					title: '活动图片-落地页',
					dataIndex: 'landingActivityPicUrlList',
					required: true,
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'imageUrl',
						httpRequest: (file) =>
							this._uploadImageHttpRequest(file, 'landingActivityPicUrlList'),
					},
				},
				{
					title: '跳转链接',
					dataIndex: 'landingJumpUrl',
					placeholder: '请输入小程序路径',
				},
				{
					type: 'uploadImage',
					title: '活动图片-新手任务',
					dataIndex: 'taskActivityPicUrlList',
					required: true,
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'imageUrl',
						httpRequest: (file) =>
							this._uploadImageHttpRequest(file, 'taskActivityPicUrlList'),
					},
				},
			],
			loading: false,
			formsDialog: false,
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this._shopkeeperActivitySave()
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
				activityName: [{ required: true, message: '请填写活动名称' }],
				useTime: [
					{
						required: true,
						message: '请选择领取时间!',
						trigger: 'blur',
					},
				],
				landingActivityPicUrlList: [
					{
						required: true,
						message: '您还有活动图片未上传，请上传后再点击保存。',
					},
				],
				taskActivityPicUrlList: [
					{
						required: true,
						message: '您还有活动图片未上传，请上传后再点击保存。',
					},
				],
				landingJumpUrl: [
					{ required: true, message: '新人专区落地页-跳转链接不能为空' },
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
		// 上传图标图片
		_uploadImageHttpRequest: async function (params, key) {
			let formData = new FormData()
			formData.append('data', JSON.stringify({ imageType: 54 }))
			formData.append('file', params.file)
			const res = await uploadImageList(formData)
			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				this.formData[key] = [
					{
						imageUrl: getBigImg(res.data.resultData.imageList[0].imageUrl),
						imageUrlTemp: res.data.resultData.imageList[0].imageUrl,
					},
				]
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
		//保存
		async _shopkeeperActivitySave() {
			let paramsData = {
				activityName: this.formData.activityName,
				showStartTime: moment(this.formData.useTime[0]).valueOf(),
				showEndTime: moment(this.formData.useTime[1]).valueOf(),
				landingActivityPicUrl: this.formData.landingActivityPicUrlList[0]
					.imageUrl,
				landingJumpUrl: this.formData.landingJumpUrl,
				taskActivityPicUrl: this.formData.taskActivityPicUrlList[0].imageUrl,
			}
			if (this.formData.id) {
				paramsData.id = this.formData.id
			}

			this.loading = true
			const res = await shopkeeperActivitySave(paramsData)
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
			this.formData = {
				activityName: '',
				useTime: [],
				landingActivityPicUrlList: [],
				taskActivityPicUrlList: [],
				landingJumpUrl: '',
			}
			this.$refs.form.$refs.YxForm.resetFields()
		},

		async open() {
			this.$refs.form && this.$refs.form.$refs.YxForm.resetFields()
			this.loading = false
			if (this.row.id) {
				this.formData = {
					...this.row,
					landingActivityPicUrlList: [
						{ imageUrl: this.row.landingActivityPicUrl },
					],
					taskActivityPicUrlList: [{ imageUrl: this.row.taskActivityPicUrl }],
					useTime: [
						moment(this.row.showStartTime),
						moment(this.row.showEndTime),
					],
				}
			} else {
				this.formData = {
					activityName: '',
					useTime: [],
					landingActivityPicUrlList: [],
					taskActivityPicUrlList: [],
					landingJumpUrl: '',
				}
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>

<template>
	<el-dialog
		width="550px"
		:title="`${dialogTitle}活动氛围`"
		:close-on-click-modal="false"
		:visible.sync="localVisible"
		:before-close="closeForm"
	>
		<yx-form
			ref="form"
			:inline="false"
			:data="formData"
			:rules="formRules"
			:items="searchCfg"
			:labelWidth="'110px'"
			:formAction="formAction"
			v-loading="editLoading"
		/>
	</el-dialog>
</template>

<script>
import moment from 'moment'
import { uploadImageList } from '@/api/image'
import { getSmallImg } from '@/utils/imageTool'
import YxForm from '@wg-vue-materials/yx-form'
import {
	addActivityAmbient,
	updateActivityAmbient,
} from '@/api/activityAmbient'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		YxForm,
	},

	data() {
		return {
			editLoading: false,
			type: '',
			dialogTitle: '',
			formData: {
				name: '',
				showTime: '',
				goodsGroupUrl: [],
				brandSaleUrl: [],
				goodsDetailUrl: [],
			},
			imageList: [],
			searchCfg: [
				{
					title: '氛围名称',
					dataIndex: 'name',
					placeholder: '氛围名称不超过30个字符',
					maxlength: 30,
				},
				{
					type: 'time',
					title: '展示时间',
					dataIndex: 'showTime',
					timeAttributes: {
						type: 'datetimerange',
						defaultTime: ['00:00:00', '23:59:59'],
					},
				},
				{
					type: 'uploadImage',
					title: '会场列表页氛围',
					dataIndex: 'goodsGroupUrl',
					uploadAttributes: {
						limit: 1,
						imageName: 'goodsGroupUrl',
						action: this.uploadImageList,
						httpRequest: (file) =>
							this.uploadCertificate(
								file,
								'goodsGroupUrl',
								'addSupplierCredentials',
								126
							),
					},
				},
				{
					type: 'uploadImage',
					title: '品牌特卖页氛围',
					dataIndex: 'brandSaleUrl',
					uploadAttributes: {
						limit: 1,
						imageName: 'brandSaleUrl',
						action: this.uploadImageList,
						httpRequest: (file) =>
							this.uploadCertificate(
								file,
								'brandSaleUrl',
								'addSupplierCredentials',
								126
							),
					},
				},
				{
					type: 'uploadImage',
					title: '商品详情页氛围',
					dataIndex: 'goodsDetailUrl',
					uploadAttributes: {
						limit: 1,
						imageName: 'goodsDetailUrl',
						action: this.uploadImageList,
						httpRequest: (file) =>
							this.uploadCertificate(
								file,
								'goodsDetailUrl',
								'addBrandAuthorization',
								126
							),
					},
				},
			],
			formAction: [
				{
					title: '确定',
					type: 'primary',
					hide: false,
					click: () => {
						this.submitForm()
					},
				},
			],
			titleMap: {
				1: '新增',
				2: '编辑',
				3: '查看',
			},
			formRules: {
				name: [{ required: true, message: '请输入氛围名称', trigger: 'blur' }],
				showTime: [
					{ required: true, message: '请选择展示时间', trigger: 'blur' },
				],
			},
			uploadImageList: '/yhtplus/image/uploadImageList.action',
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
		detail(type, row) {
			this.editLoading = true
			const titleMap = {
				1: '新增',
				2: '编辑',
				3: '查看',
			}
			this.dialogTitle = titleMap[type] || ''
			this.type = type

			if (type == 1 || type == 2) {
				this.searchCfg[0].disabled = false
				this.searchCfg[1].disabled = false
				this.searchCfg[2].disabled = false
				this.searchCfg[3].disabled = false
				this.searchCfg[4].disabled = false
				this.formAction[0].hide = false
			} else {
				this.searchCfg[0].disabled = true
				this.searchCfg[1].disabled = true
				this.searchCfg[2].disabled = true
				this.searchCfg[3].disabled = true
				this.searchCfg[4].disabled = true
				this.formAction[0].hide = true
			}
			if (type == 2 || type == 3) {
				const curRow = JSON.parse(JSON.stringify(row))
				this.formData = {
					name: curRow.name,
					showTime:
						curRow.showStartTime && curRow.showEndTime
							? [curRow.showStartTime, curRow.showEndTime]
							: [],
					goodsGroupUrl: this.handleEchoImg(
						'goodsGroupUrl',
						curRow.goodsGroupUrl
					),
					brandSaleUrl: this.handleEchoImg('brandSaleUrl', curRow.brandSaleUrl),
					goodsDetailUrl: this.handleEchoImg(
						'goodsDetailUrl',
						curRow.goodsDetailUrl
					),
					actAtmosphereId: curRow.actAtmosphereId,
				}
			}
			this.editLoading = false
		},

		handleEchoImg(key, imgUrl) {
			return imgUrl
				? [
						{
							imageUrl: imgUrl || '',
							[key]: getSmallImg(imgUrl),
						},
				  ]
				: []
		},

		closeForm() {
			this.localVisible = false
			this.$refs.form.$refs.YxForm.resetFields()
		},

		async _addActivityAmbient(parmasData) {
			const {
				data: { resultCode, resultMsg },
			} = await addActivityAmbient(parmasData)
			this.editLoading = true

			if (resultCode == 0) {
				this.$emit('fatherMethodInit')
				this.closeForm()
				this.$message.success(resultMsg)
			}
			this.editLoading = false
		},

		async _updateActivityAmbient(parmasData) {
			this.editLoading = true
			const {
				data: { resultCode, resultMsg },
			} = await updateActivityAmbient(parmasData)

			if (resultCode == 0) {
				this.$emit('fatherMethodInit')
				this.closeForm()
				this.$message.success(resultMsg)
			}
			this.editLoading = false
		},

		submitForm() {
			if (
				this.formData.goodsGroupUrl.length == 0 &&
				this.formData.brandSaleUrl.length == 0 &&
				this.formData.goodsDetailUrl.length == 0
			) {
				return this.$message.warning(
					'上传会场列表、品牌特卖页、商品详情页其中一张即可'
				)
			}

			const goodsGroupUrl = this.handleImgData(this.formData.goodsGroupUrl)
			const brandSaleUrl = this.handleImgData(this.formData.brandSaleUrl)
			const goodsDetailUrl = this.handleImgData(this.formData.goodsDetailUrl)
			const paramsData = {
				name: this.formData.name,
				showStartTime: moment(this.formData.showTime[0]).valueOf(),
				showEndTime: moment(this.formData.showTime[1]).valueOf(),
				goodsGroupUrl,
				brandSaleUrl,
				goodsDetailUrl,
			}
			if (this.type == 1) {
				this._addActivityAmbient(paramsData)
			} else if (this.type == 2) {
				paramsData.actAtmosphereId = this.formData.actAtmosphereId
				this._updateActivityAmbient(paramsData)
			}
		},

		handleImgData(item) {
			if (!Array.isArray(item) && item.length == 0) return
			return item.map((v) => v.imageUrl).toString()
		},

		async uploadCertificate(params, key, name, imageType) {
			const formData = new FormData()
			formData.append('data', JSON.stringify({ formId: `#${name}`, imageType }))
			formData.append('image', params.file)
			const {
				data: { resultCode, resultData = {} },
			} = await uploadImageList(formData)

			if (resultCode == 0 && resultData.imageList.length > 0) {
				this.formData[key] = resultData.imageList
				this.formData[key][0][key] = getSmallImg(
					resultData.imageList[0].imageUrl
				)
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>

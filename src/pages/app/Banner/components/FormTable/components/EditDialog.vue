<template>
	<div>
		<el-dialog
			width="50%"
			:title="`${title}`"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="open"
		>
			<yx-form
				ref="form"
				v-loading="loading"
				labelWidth="100px"
				:items="item"
				:rules="funRules"
				:data="formData"
				:formAction="formAction"
				><template #downloadTemp
					><el-button
						icon="el-icon-download"
						@click="downloadImpostTemplate"
						type="primary"
						>下载模板</el-button
					><el-button @click="importHistory" type="primary"
						>查看导入记录</el-button
					></template
				>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import { saveAppBanner, updateAppBanner, selectList } from '@/api/appBanner'
import YxForm from '@wg-vue-materials/yx-form'
import { uploadImageList } from '@/api/image'
import { getBigImg } from '@/utils/imageTool'
import { downloadFile } from '@/utils/helper/common'
import moment from 'moment'

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
	},

	components: {
		YxForm,
	},

	data() {
		return {
			formData: {
				bannerName: '',
				pictureUrl: [],
				sort: '',
				position: 1,
				visibleType: 0,
				jumpType: 0,
				jumpUrl: '',
				showTime: '',
			},
			fileToUpload: '',
			item: [
				{
					type: 'input',
					dataIndex: 'bannerName',
					title: 'banner名称',
				},
				{
					type: 'uploadImage',
					title: 'Banner图片',
					dataIndex: 'pictureUrl',
					uploadAttributes: {
						limit: 1,
						imageName: 'imageUrl',
						httpRequest: (file) => this._uploadImageHttpRequest(file),
					},
				},
				{
					type: 'radioMap',
					dataIndex: 'position',
					title: '展示位置',
					options: {
						个人中心: 1,
					},
				},
				{
					type: 'time',
					title: '展示时间',
					dataIndex: 'showTime',
					timeAttributes: {
						type: 'datetimerange',
					},
				},
				{
					type: 'input',
					dataIndex: 'sort',
					title: '排序值',
				},
				{
					type: 'select',
					dataIndex: 'jumpType',
					title: '跳转类型',
					label: 'value',
					options: this.$store.state.app.constant.APP_BANNER_JUMPTYPE,
				},
				{
					type: 'input',
					hide: true,
					dataIndex: 'jumpUrl',
					title: '跳转链接',
				},
				{
					type: 'radioMap',
					dataIndex: 'visibleType',
					disabled: false,
					title: '可见用户',
					options: {
						全部店主: 0,
						部分店主: 1,
					},
				},
				{
					type: 'upload',
					dataIndex: 'goodsFile',
					hide: true,
					uploadAttributes: {
						limit: 1,
						autoUpload: true,
						accept:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
						httpRequest: (file) => {
							this.fileToUpload = file.file
						},
					},
					class: 'excel-upload',
				},
				{
					type: 'custom',
					hide: true,
					dataIndex: 'downloadTemp',
				},
			],
			loading: false,
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this._saveAppBanner()
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
				bannerName: [
					{ required: true, message: '请填写banner名称!', trigger: 'blur' },
				],
				pictureUrl: [
					{ required: true, message: '请上传图片!', trigger: 'blur' },
				],
				position: [
					{ required: true, message: '请选择展示位置!', trigger: 'blur' },
				],
				showTime: [
					{ required: true, message: '请选择展示时间!', trigger: 'blur' },
				],
				jumpType: [
					{ required: true, message: '请选择跳转类型!', trigger: 'blur' },
				],
				visibleType: [
					{ required: true, message: '请选择可见对象!', trigger: 'blur' },
				],
				sort: [{ required: true, message: '请填写排序值!', trigger: 'blur' }],
			},
		}
	},

	watch: {
		formData: {
			handler: function (val) {
				this.item[6].hide = val.jumpType == 0 ? true : false
				this.item[8].hide = val.visibleType == 0 ? true : false
				this.item[9].hide = val.visibleType == 0 ? true : false
				this.formData.sort = val.sort.replace(/[^\d]/g, '')
			},
			deep: true,
		},
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
		_uploadImageHttpRequest: async function (params) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#addMaterial', imageType: 82 })
			)
			formData.append('file', params.file)
			const res = await uploadImageList(formData)
			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				this.formData.pictureUrl.push({
					imageUrl: getBigImg(res.data.resultData.imageList[0].imageUrl),
					imageUrlTemp: res.data.resultData.imageList[0].imageUrl,
				})
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
		//保存
		async _saveAppBanner() {
			let paramsData = Object.assign({}, this.formData)
			if (this.formData.jumpType == 1 && this.formData.jumpUrl == '') {
				this.$message.error('请填写跳转链接')
				return
			}

			//新增时选择部分店主必须上传文件
			if (
				this.formData.visibleType == 1 &&
				!this.row.appBannerId &&
				this.fileToUpload == ''
			) {
				this.$message.error('请上传文件!')
				return
			}

			if (this.formData.jumpType == 0) {
				paramsData.jumpUrl = ''
			}

			paramsData.startTime = moment(this.formData.showTime[0]).valueOf()
			paramsData.endTime = moment(this.formData.showTime[1]).valueOf()

			if (this.row.appBannerId) {
				paramsData.appBannerId = this.row.appBannerId
			}
			delete paramsData.showTime
			if (this.formData.pictureUrl) {
				paramsData.pictureUrl = this.formData.pictureUrl[0].imageUrlTemp
			}
			let isForm = true

			if (this.formData.visibleType == 1 && this.fileToUpload != '') {
				//编辑并且没有上传文件
				let formData = new FormData()
				formData.append(
					'data',
					JSON.stringify({
						timeStamp: new Date().getTime(),
						groupId: 2,
						...paramsData,
					})
				)
				formData.append('formId', '#appBanner')
				formData.append('fileToUpload', this.fileToUpload)
				paramsData = formData
				isForm = false
			}

			this.loading = true
			let res = ''
			if (this.row.appBannerId) {
				res = await updateAppBanner(paramsData, isForm)
			} else {
				res = await saveAppBanner(paramsData, isForm)
			}
			let resultCode = res.data.resultCode
			if (resultCode == 0) {
				this.$message({
					message: '操作成功',
					type: 'success',
				})
			}
			this.loading = false
			this.localVisible = false
			this.$emit('initTable')
		},
		//下载模板
		downloadImpostTemplate() {
			downloadFile('/excel/platform/导入部分店铺模板.xlsx')
		},
		//查看导入记录
		importHistory() {
			this.localVisible = false
			this.$router.push({ path: '/import/importHistory' })
		},
		resetForm() {
			this.localVisible = false
		},

		async open() {
			this.loading = false
			this.item[7].disabled = false
			this.formData.showTime = ''
			this.fileToUpload = ''
			this.$refs.form && this.$refs.form.$refs.YxForm.resetFields()
			if (this.row.appBannerId) {
				this.item[7].disabled = true
				this.loading = true
				let parmaJosn = {
					appBannerId: this.row.appBannerId,
				}
				let {
					data: { resultCode, resultData },
				} = await selectList(parmaJosn)
				if (resultCode == 0) {
					this.loading = false
					let row = resultData.bannerVOList[0]
					this.formData.bannerName = row.bannerName
					this.formData.jumpType = row.jumpType
					this.formData.jumpUrl = row.jumpUrl
					this.formData.showTime = [row.startTime, row.endTime]
					this.formData.sort = row.sort
					this.formData.pictureUrl.push({
						imageUrl: getBigImg(row.pictureUrl),
						imageUrlTemp: row.pictureUrl,
					})
					this.formData.visibleType = row.visibleType
				}
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>

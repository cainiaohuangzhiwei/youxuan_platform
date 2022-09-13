<template>
	<div class="curriculumClassifyStatistics">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData117"
				:items="formCfg117"
				:formAction="formAction117"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading118"
				:columns="tableColumns118"
				:pagination="page118"
				:data="tableData118"
			>
				<template slot="xCoordinate" slot-scope="scope">
					<div>
						( {{ scope.row.xCoordinate }} , {{ scope.row.yCoordinate }} )
					</div>
				</template>
			</yx-table>
			<Dialog
				:title="dialogTitle119"
				:visible.sync="dialogVisible119"
				:width="dialogWidth119"
				:bottomBtn="dialogBottomBtn119"
			>
				<yx-form
					labelWidth="100px"
					ref="dialog120"
					:data="formData120"
					:items="formCfg120"
					:formAction="formAction120"
					:rules="formRules120"
				>
					<template slot="xCoordinate">
						<div class="coordinate-box">
							<div>
								x：<el-input
									class="coordinate-input"
									type="number"
									v-model="formData120.xCoordinate"
								></el-input>
							</div>
							<div>
								y：<el-input
									class="coordinate-input"
									type="number"
									v-model="formData120.yCoordinate"
								></el-input>
							</div>
						</div>
					</template>
				</yx-form>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import {
	getBsDayShareList,
	updateBsDayShare,
	addBsDayShare,
	delBsDayShare,
} from '@/api/businessSchool'
import { uploadImageList } from '@/api/image'
import { getBigImg } from '@/utils/imageTool'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},
	props: [],
	data() {
		return {
			isShow: false,
			curTime: moment().startOf('day').valueOf(),
			formData117: {
				startTime: '',
				endTime: '',
			},
			formCfg117: [
				{
					type: 'datetimerange',
					title: '开始时间',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
				},
			],
			formAction117: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						this.init(true)
					},
				},
				{
					title: '新增分享',
					type: 'warning',
					auth: '',
					dialogId: 139,
					click: () => {
						this.formData120 = {
							startTime: '',
							yCoordinate: '',
							xCoordinate: '',
							shareText: '',
							bsDayShareImage: [],
						}
						this.$nextTick(() => {
							this.$refs.dialog120.$refs.YxForm.clearValidate()
						})
						this.dialogVisible119 = true
					},
				},
			],
			loading118: false,
			tableData118: [],
			tableColumns118: [
				{
					type: 'date',
					dataIndex: 'startTime',
					title: '开始时间',
				},
				{
					type: 'image',
					dataIndex: 'imageUrl',
					title: '分享图',
				},
				{
					type: 'string',
					dataIndex: 'shareText',
					title: '分享文案',
				},
				{
					type: 'custom',
					dataIndex: 'xCoordinate',
					title: '店铺码坐标',
				},
				{
					type: 'date',
					dataIndex: 'updateTime',
					title: '最后修改时间',
				},
				{
					type: 'string',
					dataIndex: 'updateUserName',
					title: '最后修改人',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '删除',
							// auth: 'updateBusinessSchool',
							popconfirm: true,
							popconfirmTitle: '确认要删除该每日分享吗？',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._delBsDayShare(row)
							},
							customRender: (action, row) => {
								action.hide = row.startTime < this.curTime
								return action
							},
						},
						{
							title: '编辑',
							// auth: 'updateBusinessSchool',
							click: (row) => {
								this.updateDailyShareInfo(row)
							},
							customRender: (action, row) => {
								action.hide = row.startTime < this.curTime
								return action
							},
						},
					],
				},
			],
			page118: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			dialogTitle119: '新增每日分享',
			dialogWidth119: '600px',
			dialogVisible119: false,
			dialogBottomBtn119: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog120.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveDailyShare()
								// this.dialogVisible105 = false
							}
						})
					},
				},
			],
			formData120: {
				dailyShareAddTime: '',
				xCoordinate: '',
				shareText: '',
				bsDayShareImage: [],
			},
			formRules120: {
				startTime: [
					{ required: true, message: '请选择开始时间', trigger: 'change' },
				],
				xCoordinate: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (
								!this.formData120.xCoordinate ||
								!this.formData120.yCoordinate
							) {
								callback(new Error('请输入店铺码坐标'))
							} else if (
								!this.isNumber(this.formData120.xCoordinate) ||
								!this.isNumber(this.formData120.yCoordinate)
							) {
								callback(new Error('店铺码坐标必须为正整数'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				shareText: [
					{ required: true, message: '请输入分享文案', trigger: 'blur' },
				],
				bsDayShareImage: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData120.bsDayShareImage.length) {
								callback(new Error('请上传图片!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			formCfg120: [
				{
					title: '开始日期',
					type: 'time',
					dataIndex: 'startTime',
					placeholder: '开始日期',
					timeAttributes: {
						type: 'datetime',
						pickerOptions: {
							disabledDate(time) {
								return time.getTime() < Date.now() - 8.64e7
							},
						},
					},
				},
				{
					type: 'custom',
					title: '店铺码坐标',
					dataIndex: 'xCoordinate',
				},
				{
					type: 'textarea',
					title: '分享文案',
					dataIndex: 'shareText',
					placeholder: '请输入分享文案',
				},
				{
					type: 'uploadImage',
					title: '分享图片',
					dataIndex: 'bsDayShareImage',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'bsDayShareImage',
						httpRequest: (file) => this.uploadImageHttpRequest(file),
					},
				},
			],
			formAction120: [],
		}
	},

	methods: {
		isNumber(s) {
			const regu = '^[0-9]+$'
			let re = new RegExp(regu)
			if (re.test(s)) {
				return true
			} else {
				return false
			}
		},
		async uploadImageHttpRequest(params) {
			//上传banner
			let formData = new FormData()
			formData.append('formId', '#dailyShareImageFrom')
			formData.append('data', JSON.stringify({ imageType: 72 }))
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			if (resultCode == 0) {
				resultData.imageList[0].bsDayShareImage = getBigImg(
					resultData.imageList[0].imageUrl
				)
				this.formData120.bsDayShareImage = resultData.imageList
			}
			this.$forceUpdate()
		},
		_delBsDayShare: async function ({ bsDayShareId }) {
			let {
				data: { resultCode, resultMsg },
			} = await delBsDayShare({ bsDayShareId })
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.init(true)
			}
		},
		saveDailyShare: async function () {
			let paramJson = {
				xCoordinate: this.formData120.xCoordinate,
				yCoordinate: this.formData120.yCoordinate,
				shareText: this.formData120.shareText,
				startTime: moment(this.formData120.startTime).valueOf(),
				state: 1,
			}
			if (this.formData120.bsDayShareImage[0].imageId) {
				paramJson.image = this.formData120.bsDayShareImage[0]
				delete paramJson.bsDayShareImage
			}
			let res = null
			let flag = false
			if (this.formData120.bsDayShareId) {
				paramJson.bsDayShareId = this.formData120.bsDayShareId
				res = await updateBsDayShare(paramJson)
			} else {
				flag = true
				res = await addBsDayShare(paramJson)
			}
			let {
				data: { resultCode, resultMsg },
			} = res
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible119 = false
				this.init(flag)
			}
		},
		updateDailyShareInfo(row) {
			// 课程分类-编辑
			this.formData120 = Object.assign({}, row)
			this.formData120.bsDayShareImage = [
				{
					bsDayShareImage: row.imageUrl,
				},
			]
			this.dialogTitle119 = '编辑每日分享'
			this.$nextTick(() => {
				this.$refs.dialog120.$refs.YxForm.clearValidate()
			})
			this.dialogVisible119 = true
			this.$forceUpdate()
		},
		init: async function (flag) {
			this.loading118 = true
			let paramJson = this.findSearchParams118(flag)
			const {
				data: { resultCode, resultData },
			} = await getBsDayShareList(paramJson)
			if (resultCode == 0) {
				this.isShow = true
				// this.curTime = new Date().getTime()
				this.tableData118 = resultData.list
				this.page118.count = resultData.count
				this.tableData118.map((item) => {
					item.imageUrl = getBigImg(item.imageUrl)
				})
			} else {
				this.tableData118 = []
				this.page118.count = 0
			}
			this.loading118 = false
		},
		findSearchParams118(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page118.currentPage = 1
			}
			const paramJson = Object.assign(this.formData117, {
				length: this.page118.length,
				startIndex: (this.page118.currentPage - 1) * this.page118.length,
			})
			return paramJson
		},
	},
}
</script>
<style lang="scss" scope>
.coordinate-box {
	display: flex;
	align-items: center;
	.coordinate-input {
		width: 120px;
		margin-right: 20px;
	}
}
</style>

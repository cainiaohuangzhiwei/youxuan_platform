<template>
	<div class="activityArea">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData115"
				:items="formCfg115"
				:formAction="formAction115"
			>
			</yx-form>
			<div class="goods-group-btnlist">
				<el-button
					@click="addActivity"
					v-auth="'secKillActivitySaveInfo'"
					type="primary"
					>新建活动</el-button
				>
			</div>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns116"
				:pagination="page116"
				:data="tableData116"
			>
				<template slot="saleState" slot-scope="scope">
					<el-tag effect="dark" :type="saleState(scope.row).type">{{
						saleState(scope.row).label
					}}</el-tag>
				</template>
				<template slot="enableStatus" slot-scope="scope">
					<div v-html="findSaleStateString(scope.row)"></div> </template
			></yx-table>
			<Dialog
				:title="dialogTitle117"
				:visible.sync="dialogVisible117"
				:width="dialogWidth117"
				:bottomBtn="dialogBottonBtn117"
			>
				<yx-form
					labelWidth="130px"
					ref="dialog118"
					:data="formData118"
					:items="formCfg118"
					:formAction="formAction118"
					:rules="formRules118"
				>
					<template #activityName>
						<el-input
							type="text"
							placeholder="请输入活动名称"
							v-model="formData118.activityName"
							maxlength="30"
							show-word-limit
						>
						</el-input
					></template>
					<template #activityStartTime>
						<el-date-picker
							v-model="formData118.activityStartTime"
							type="datetime"
							:disabled="startTimedisabledEdit"
							style="width: 200px"
							placeholder="开始时间"
							default-time="00:00:00"
						>
						</el-date-picker>
						-
						<el-date-picker
							v-model="formData118.activityEndTime"
							type="datetime"
							style="width: 200px"
							placeholder="结束时间"
							default-time="23:59:59"
						>
						</el-date-picker>
					</template>
					<template #activityType>
						<el-radio
							v-model="formData118.activityType"
							:label="2"
							:disabled="dialogTitle117 == '编辑活动'"
							>限时降价</el-radio
						>
						<el-radio
							v-model="formData118.activityType"
							:label="3"
							:disabled="dialogTitle117 == '编辑活动'"
							>限量降价</el-radio
						>
					</template>
					<template #tagText>
						<el-radio
							v-model="formData118.tagText"
							:label="1"
							:disabled="forbidden"
							>活动价</el-radio
						>
						<el-radio
							v-model="formData118.tagText"
							:label="2"
							:disabled="forbidden"
							>秒杀价</el-radio
						>
						<el-radio
							v-model="formData118.tagText"
							:label="3"
							:disabled="forbidden"
							>一口价</el-radio
						>
					</template>
				</yx-form>
			</Dialog>
			<Dialog
				title="分享设置"
				:visible.sync="sharingSettingsVisible"
				width="600px"
				:bottomBtn="sharingSettingsBottonBtn"
			>
				<yx-form
					labelWidth="100px"
					ref="sharingSettingsDialog"
					:data="sharingSettingsData"
					:items="sharingSettingsCfg"
					:rules="sharingSettingsFormRules"
				>
					<template #shareCopy>
						<el-input
							type="text"
							placeholder="请输入标题，30字以内"
							v-model="sharingSettingsData.shareCopy"
							maxlength="30"
							show-word-limit
						>
						</el-input
					></template>
					<template #title>
						<div>1.文件格式只允许JPG、JPEG</div>
						<div>2.文件尺寸限定为750*600</div></template
					>
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
import moment from 'moment'
import {
	queryList,
	sharingSettings,
	querySave,
	updateById,
	updateSharingSettings,
	endingActivity,
} from '@/api/secKillActivity'

import { getBigImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'
import { checkFunctionCode } from '@/utils/auth'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},
	name: 'limitPriceList',

	props: [],
	data() {
		return {
			//查询列表权限
			secKillActivityQueryListInfo: checkFunctionCode(
				'secKillActivityQueryListInfo'
			),
			//新建活动权限
			secKillActivitySaveInfo: checkFunctionCode('secKillActivitySaveInfo'),
			forbidden: false, //是否进行中
			startTimedisabledEdit: false, //活动开始时间是否禁止编辑
			loading: false,
			sharingSettingsVisible: false,
			sharingSettingsData: { shareCopy: '', areaImageList: [] },
			sharingSettingsCfg: [
				{
					type: 'custom',
					title: '分享文案',
					dataIndex: 'shareCopy',
				},
				{
					type: 'uploadImage',
					title: '分享图片',
					dataIndex: 'areaImageList',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'areaImageUrl',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'areaImageUrl'),
					},
				},
				{
					type: 'custom',
					title: '',
					dataIndex: 'title',
				},
			],
			sharingSettingsFormRules: {
				shareCopy: [
					{ required: true, message: '请输入活动名称', trigger: 'blur' },
				],
				areaImageList: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.sharingSettingsData.areaImageList.length) {
								callback(new Error('请上传图片!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			sharingSettingsBottonBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.sharingSettingsDialog.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this._sharingSettings(2)
							}
						})
					},
				},
			],
			formData115: {
				activityName: '',
				activityStatus: '',
				activityType: '',
			},
			formCfg115: [
				{
					type: 'input',
					title: '活动名称',
					dataIndex: 'activityName',
					placeholder: '请输入活动名称',
				},
				{
					title: '活动状态',
					type: 'select',
					dataIndex: 'activityStatus',
					options: [
						{
							activityStatus: '',
							value: '全部',
						},
						{
							activityStatus: 0,
							value: '未开始',
						},
						{
							activityStatus: 1,
							value: '进行中',
						},
						{
							activityStatus: 2,
							value: '已结束',
						},
					],
					label: 'value',
				},
				{
					title: '活动类型',
					type: 'select',
					dataIndex: 'activityType',
					// 活动类型：1-秒杀 2-限时降价 3-限量降价
					options: [
						{
							activityType: '',
							value: '全部',
						},
						{
							activityType: 2,
							value: '限时降价',
						},
						{
							activityType: 3,
							value: '限量降价',
						},
					],
					label: 'value',
				},
				{
					title: '活动时间',
					type: 'datetimerange',
					dataIndex: ['activityStartTime', 'activityEndTime'],
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
			],
			formAction115: [
				{
					title: '清空',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					auth: 'secKillActivityQueryListInfo',
					click: () => {
						this.getData116(true)
					},
				},
			],
			tableData116: [],
			tableColumns116: [
				{
					type: 'string',
					dataIndex: 'secKillActivityId',
					title: '活动id',
				},
				{
					type: 'string',
					dataIndex: 'activityName',
					title: '活动名称',
				},
				{
					type: 'string',
					dataIndex: 'activityStartTime',
					title: '活动进行时间',
					customRender: (row) => {
						return (
							moment(row.activityStartTime).format('YYYY-MM-DD HH:mm:ss') +
							'-' +
							moment(row.activityEndTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					type: 'map',
					dataIndex: 'activityType',
					title: '活动类型',
					options: {
						秒杀: 1,
						限时降价: 2,
						限量降价: 3,
					},
				},
				{
					type: 'string',
					dataIndex: 'goodsNumber',
					title: '商品数',
				},
				{
					type: 'custom',
					dataIndex: 'saleState',
					title: '活动状态',
				},
				{
					type: 'string',
					dataIndex: 'creator',
					title: '创建人',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '编辑活动',
							auth: 'secKillActivityUpdateByIdInfo',
							click: ({
								activityName,
								activityStatus,
								rulesText,
								activityStartTime,
								activityEndTime,
								activityType,
								tagText,
								secKillActivityId,
							}) => {
								this.formData118 = {
									secKillActivityId,
									activityName,
									rulesText,
									activityStartTime,
									activityEndTime,
									activityType,
									tagText,
								}
								this.originalActivityStartTime = activityStartTime
								this.originalActivityStatus = activityStatus
								console.log('this.formData118', this.formData118)
								this.$forceUpdate()
								this.dialogTitle117 = '编辑活动'
								this.$nextTick(() => {
									this.$refs.dialog118.$refs.YxForm.clearValidate()
								})
								this.forbidden = activityStatus === 1
								let nowTime = new Date().getTime()
								if (
									activityStatus === 1 ||
									(activityStatus === 0 &&
										nowTime < activityStartTime &&
										activityStartTime - nowTime < 10 * 60 * 1000)
								) {
									this.startTimedisabledEdit = true
								} else {
									this.startTimedisabledEdit = false
								}
								this.dialogVisible117 = true
							},
							customRender: (action, row) => {
								action.hide = row.activityStatus === 2
								return action
							},
						},
						{
							title: '结束活动',
							auth: 'secKillActivityEndingActivity',
							customRender: (action, row) => {
								action.hide = row.activityStatus === 2
								return action
							},
							click: ({ secKillActivityId }) => {
								this.$confirm('此操作将结束该活动, 是否继续?', '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning',
								})
									.then(async () => {
										const {
											data: { resultCode },
										} = await endingActivity({
											secKillActivityId,
										})
										if (resultCode === 0) {
											this.$message({
												type: 'success',
												message: '结束成功!',
											})
											this.getData116()
										}
									})
									.catch(() => {
										this.$message({
											type: 'info',
											message: '已取消结束',
										})
									})
							},
						},
						{
							title: '查看活动商品',
							auth: 'secKillActivityGoodsQueryList',
							click: (row) => {
								this.$router.push({
									name: 'limitPriceGoods',
									params: {
										secKillActivityId: row.secKillActivityId,
										activityStatus: row.activityStatus,
										activityType: row.activityType,
									},
								})
							},
						},
					],
				},
			],
			page116: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData116()
				},
			},
			dialogTitle117: '新建活动',
			dialogWidth117: '700px',
			dialogVisible117: false,
			dialogBottonBtn117: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog118.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveAddActivityList()
							}
						})
					},
				},
			],
			formData118: {
				activityName: '',
				activityStartTime: '',
				activityEndTime: '',
				activityType: 2,
				tagText: 1,
				rulesText: '',
				activityInterestPoint: '',
			},
			formRules118: {
				activityName: [
					{ required: true, message: '请输入活动名称', trigger: 'blur' },
				],
				activityStartTime: [
					{ required: true, message: '请选择开始时间', trigger: 'change' },
					{
						required: true,
						validator: (rule, value, callback) => {
							let nowTime = new Date().getTime()
							if (!value) {
								callback(new Error('请选择开始时间!'))
							} else if (
								!this.startTimedisabledEdit &&
								moment().valueOf() >
									moment(this.formData118.activityStartTime).valueOf()
							) {
								callback(new Error('开始时间不能低于当前时间!'))
							} else if (
								!this.startTimedisabledEdit &&
								this.dialogTitle117 == '编辑活动' &&
								this.originalActivityStatus === 0 &&
								this.originalActivityStartTime - nowTime < 10 * 60 * 1000
							) {
								callback(new Error('活动开始前10分钟之前才可编辑!'))
							} else if (!this.formData118.activityEndTime) {
								callback(new Error('请选择结束时间!'))
							} else if (
								moment(this.formData118.activityStartTime).valueOf() >
								moment(this.formData118.activityEndTime).valueOf()
							) {
								callback(new Error('结束时间必须大于开始时间!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				activityType: {
					required: true,
					message: '请选择活动类型',
					trigger: 'blur',
				},
				tagText: {
					required: true,
					message: '请选择标签类型',
					trigger: 'blur',
				},
			},
			formCfg118: [
				{
					type: 'custom',
					title: '活动名称',
					dataIndex: 'activityName',
				},
				{
					title: '活动进行时间',
					type: 'custom',
					dataIndex: 'activityStartTime',
				},
				{
					title: '活动类型',
					type: 'custom',
					dataIndex: 'activityType',
				},
				{
					title: '标签文案',
					type: 'custom',
					dataIndex: 'tagText',
				},
			],
			formAction118: [],
		}
	},

	created() {
		this.getData116(true)
	},

	methods: {
		//启用
		async banIt(row) {
			this.loading = true
			const {
				data: { resultCode },
			} = await updateById({
				secKillActivityId: row.secKillActivityId,
				enableStatus: 0, //状态 0-启用，1-禁用
			})
			this.loading = false
			if (resultCode == 0) {
				this.$message({
					message: `启用成功!`,
					type: 'success',
				})
				this.getData116()
			}
		},
		//分享设置
		_sharingSettings: async function (v) {
			this.sharingSettingsVisible = true
			let paramJson = {}
			if (v == 2) {
				paramJson.sharePicUrl =
					this.sharingSettingsData.areaImageList[0].imageUrl
				paramJson.shareText = this.sharingSettingsData.shareCopy
			}
			let Url = v == 2 ? updateSharingSettings : sharingSettings
			let {
				data: { resultCode, resultData },
			} = await Url(paramJson)
			if (resultCode === 0) {
				if (v === 2) {
					this.$message({
						type: 'success',
						message: '成功!',
					})
					this.sharingSettingsVisible = false
				} else {
					this.sharingSettingsData.shareCopy = resultData.shareText
					this.sharingSettingsData.areaImageList = [
						{
							areaImageUrl: getBigImg(resultData.sharePicUrl),
							imageUrl: resultData.sharePicUrl,
						},
					]
				}
			}
		},
		saleState(row) {
			if (row.activityStatus === 0) {
				return {
					type: 'danger',
					label: '未开始',
				}
			}
			if (row.activityStatus === 1) {
				return {
					type: '',
					label: '进行中',
				}
			}
			if (row.activityStatus === 2) {
				return {
					type: 'info',
					label: '已结束',
				}
			}
		},
		findSaleStateString(row) {
			// 活动状态值
			let stateString, color
			if (row.enableStatus === 0) {
				stateString = '启用'
				color = 'rgb(0, 153, 102)'
			} else if (row.enableStatus === 1) {
				color = 'rgb(255, 0, 0)'
				stateString = '禁用'
			}
			return `<div><span style="width:8px;height:8px;background:${color};margin-right: 10px;display: inline-block;"></span><span style="color: ${color};">${stateString}</span></div>`
		},
		addActivity() {
			if (!this.secKillActivitySaveInfo) return
			this.dialogTitle117 = '新增活动'
			this.formData118 = {
				activityName: '',
				activityStartTime: '',
				activityEndTime: '',
				activityType: 2,
				tagText: 1,
				rulesText: '',
				activityInterestPoint: '',
			}
			this.forbidden = false
			this.startTimedisabledEdit = false
			this.$nextTick(() => {
				this.$refs.dialog118.$refs.YxForm.clearValidate()
			})
			this.dialogVisible117 = true
		},
		saveAddActivityList: async function () {
			let paramJson = {
				activityName: this.formData118.activityName,
				rulesText: this.formData118.rulesText,
				activityStartTime: moment(this.formData118.activityStartTime).valueOf(),
				activityEndTime: moment(this.formData118.activityEndTime).valueOf(),
				activityType: this.formData118.activityType,
				tagText: this.formData118.tagText,
				creator: this.$store.state.user.userInfo.clerkName,
			}
			let res = null
			if (this.formData118.secKillActivityId) {
				paramJson.secKillActivityId = this.formData118.secKillActivityId
				res = await updateById(paramJson)
			} else {
				res = await querySave(paramJson)
			}
			let {
				data: { resultCode, resultMsg },
			} = res
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible117 = false
				this.getData116()
			}
			console.log(paramJson)
		},
		//上传图片
		async uploadImageHttpRequest(params, key) {
			let file = params.file
			let that = this
			let index = file.name.lastIndexOf('.')
			let format = file.name.substring(index + 1, file.name.length)
			if (!/\.|JPG|JPEG/i.test(format)) {
				this.$message.warning('图片上传有误，请上传JPEG、JPEG格式')
				this.formData[key] = []
				return
			}
			let _URL = window.URL || window.webkitURL
			let img = new Image()
			img.onload = function () {
				let valid = true
				if (img.width != 750 || img.height != 600) {
					valid = false
				}
				if (valid) {
					that._uploadImageList(file, key)
				} else {
					that.$message.warning('图片尺寸限定为750*600')
					console.log('哈哈哈哈哈哈哈哈哈')
					that.formData[key] = []
				}
			}
			img.src = _URL.createObjectURL(file)
		},
		async _uploadImageList(params) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#addMaterial', imageType: 82 })
			)
			formData.append('file', params)
			const res = await uploadImageList(formData)
			if (res.data.resultCode == 0) {
				res.data.resultData.imageList[0].areaImageUrl = getBigImg(
					res.data.resultData.imageList[0].imageUrl
				)
				this.sharingSettingsData.areaImageList = res.data.resultData.imageList
			}
		},
		async getData116(flag) {
			if (!this.secKillActivityQueryListInfo) return
			this.loading = true
			let paramJson = this.findSearchParams116(flag)
			const {
				data: { resultCode, resultData, total },
			} = await queryList(paramJson)
			if (resultCode == 0) {
				this.tableData116 = resultData
				this.page116.count = total
			} else {
				this.tableData116 = []
				this.page116.count = 0
			}
			this.loading = false
		},
		findSearchParams116(flag) {
			const paramJson = Object.assign(this.formData115, {
				pageSize: 10,
				pageNum: 1,
			})
			paramJson.pageSize = this.page116.length
			// 当前页的条数开始
			if (flag) {
				this.page116.currentPage = 1
			}
			paramJson.pageNum = this.page116.currentPage
			paramJson.queryType = 2
			return paramJson
		},
	},
}
</script>
<style scope>
.goods-group-btnlist {
	margin-bottom: 20px;
}
.c_image {
	height: 200px;
	width: 200px;
}
.el-textarea__inner {
	min-height: 137px !important;
}
.code-box {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>

<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>
			<el-row>
				<YxAccounts :items="statistics" />
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
					:select="true"
					:selectionChange="selectionChange"
				></yx-table>
			</el-row>
		</div>
		<!-- 提现信息弹框 -->
		<withdrawInformation
			:withdrawData.sync="withdrawData"
			:dialogVisible.sync="dialogVisible"
		></withdrawInformation>
		<el-dialog
			width="30%"
			title="剩余限额"
			:close-on-click-modal="false"
			:visible.sync="remainingQuota"
		>
			<yx-table
				v-loading="showLoadingQuota"
				:columns="tableColumnsQuota"
				:data="tableDataQuota"
			></yx-table>
		</el-dialog>

		<!-- 通过弹框 -->
		<Dialog
			:title="getDialogAuditTitle"
			:visible.sync="dialogVisibleAudit"
			width="500px"
			:bottomBtn="dialogBtnAudit"
		>
			<yx-form
				labelWidth="100px"
				:rules="formRules"
				:data="auditData"
				:items="formCfgAudit"
			>
			</yx-form>
		</Dialog>

		<!-- 驳回弹框 -->
		<Dialog
			:title="getDialogRejectTitle"
			:visible.sync="dialogVisibleReject"
			width="500px"
			:bottomBtn="dialogBtnReject"
		>
			<yx-form
				labelWidth="100px"
				:rules="formRules"
				:data="rejectData"
				:items="formCfgReject"
			>
			</yx-form>
		</Dialog>
	</basic-container>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import withdrawInformation from './components/withdrawInformation'
import YxAccounts from '@/components/Accounts/index'
import BasicContainer from '@wg-vue-materials/basic-container'
import { getWithdrawList, getWithdrawBalance } from '@/api/yhtPlusCmsFinance'
import { exportWithdrawList } from '@/api/webImport'
import { downloadFile } from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth.js'
import { uploadImageList } from '@/api/image'
import { getBigImg } from '@/utils/imageTool'
import Dialog from '@/components/Dialog'
import moment from 'moment'
import { updateAccWithdrawalAuditLogBatchAudit } from '@/api/taxAdministration'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		YxAccounts,
		withdrawInformation,
		Dialog,
	},
	name: 'FormTable',

	data() {
		return {
			showLoadingQuota: false,
			remainingQuota: false,
			showLoading: false,
			dialogVisible: false, // 提现信息弹框开关
			withdrawData: {}, // 提现信息
			searchData: {
				levelType: '', // 类型
				channel: '', // 通道
				keyword: '', //关键字
				status: 0, //状态
				finishTimeStart: moment().startOf('day').valueOf(), //到账开始时间
				finishTimeEnd: moment().endOf('day').valueOf(), //到账结束时间
				addTimeStart: moment().startOf('day').valueOf(), //发起开始时间
				addTimeEnd: moment().endOf('day').valueOf(), //发起结束时间
				organizationId: '', // 店主ID
				withdrawSn: '', // 提现ID
				taxType: '', // 发起身份
			},
			statistics: [
				{
					type: 'amount',
					title: '提现金额',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '手续费',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '服务费',
					value: '0.00',
				},
			],
			invitationCodeGenerationType: [
				{
					key: 1,
					value: '自己付费加入',
				},
				{
					key: 2,
					value: '付费',
				},
				{
					key: 3,
					value: '组织创建',
				},
				{
					key: 4,
					value: '系统生成',
				},
				{
					key: 5,
					value: '手动生成',
				},
			],
			searchCfg: [
				{
					title: '状态',
					type: 'selectMap',
					dataIndex: 'status',
					options: this.$store.state.app.constant.WITHDRAW_STATUS,
				},
				// {
				// 	title: '类型',
				// 	type: 'selectMap',
				// 	dataIndex: 'levelType',
				// 	options: this.$store.state.app.constant.WITHDRAW_TYPE,
				// },
				{
					title: '通道',
					type: 'selectMap',
					dataIndex: 'channel',
					options: {
						全部: '',
						YJB: 1,
						HJ: 2,
						YL: 4,
						YB: 3,
						WGZF: 5,
						XZB: 6,
						其他: 0,
					},
				},
				{
					title: '发起身份',
					type: 'selectMap',
					dataIndex: 'taxType',
					options: {
						全部: '',
						代办: 1,
						非代办: 2,
						普通店主: 0,
					},
				},
				{
					title: '到账时间',
					type: 'datetimerange',
					dataIndex: ['finishTimeStart', 'finishTimeEnd'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					title: '发起时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					title: '操作人',
					type: 'input',
					dataIndex: 'keyword',
				},
				{
					title: '店主ID',
					type: 'inputNumber',
					dataIndex: 'organizationId',
				},
				{
					title: '提现ID',
					type: 'input',
					dataIndex: 'withdrawSn',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: (e) => {
						this._getWithdrawList(true, e)
					},
				},
				{
					title: '查看剩余余额',
					type: 'primary',
					click: () => {
						this.remainingBalance()
					},
				},
				// {
				// 	title: '配置路由',
				// 	type: 'primary',
				// 	auth: 'getWithdrawalConfig',
				// 	click: () => {
				// 		this.goConfigureWithdrawalRouting()
				// 	},
				// },
				{
					title: '导出',
					type: 'primary',
					auth: 'exportWithdrawList',
					click: () => {
						this._exportWithdrawList()
					},
				},
				{
					title: '批量通过',
					type: 'primary',
					auth: 'batchAuditFors',
					click: () => {
						this.showAuditAllDialog()
					},
				},
				{
					title: '批量驳回',
					type: 'primary',
					auth: 'batchAuditFors',
					click: () => {
						this.showRejectAllDialog()
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'flowWithdrawId',
					title: 'ID',
				},
				{
					type: 'map',
					dataIndex: 'channel',
					title: '通道',
					options: {
						YJB: 1,
						HJ: 2,
						YL: 4,
						YB: 3,
						WGZF: 5,
						XZB: 6,
						其他: 0,
					},
				},
				{
					type: 'map',
					dataIndex: 'arrivalType',
					title: '到账类型',
					options: {
						'T+1': 0,
						快速到账: 1,
						'快速到账(垫资)': 2,
					},
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '发起时间',
				},
				{
					type: 'data',
					dataIndex: 'finishTime',
					title: '到账时间',
				},
				{
					type: 'string',
					dataIndex: 'amount',
					title: '金额',
				},
				{
					type: 'string',
					dataIndex: 'serviceCharge',
					title: '提现手续费',
				},
				{
					type: 'string',
					dataIndex: 'platformServiceCharge',
					title: '服务费',
				},
				// {
				// 	type: 'string',
				// 	dataIndex: 'remainder',
				// 	title: '剩余余额',
				// },
				// {
				// 	type: 'map',
				// 	dataIndex: 'levelType',
				// 	title: '类型',
				// 	options: {
				// 		店主提现: 1,
				// 		vip店主提现: 2,
				// 		服务商提现: 3,
				// 		其他: 0,
				// 	},
				// },
				{
					type: 'map',
					dataIndex: 'status',
					title: '状态',
					options: {
						提现中: 1,
						提现成功: 2,
						提现失败: 3,
						'T+1提现中': 4,
						提现异常: 6,
						等待回调中: 5,
						提现审核中: 7,
					},
				},
				{
					type: 'string',
					dataIndex: 'userName',
					title: '操作人姓名',
				},
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: '店主ID',
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '查看提现信息',
							auth: 'getWithdrawItem',
							click: (row) => {
								this.showWithdrawInformation(row)
							},
						},
						{
							title: '提现通过',
							auth: 'batchAuditFors',
							customRender: (action, row) => {
								action.hide = row.status == 7 ? false : true
								return action
							},
							click: (row) => {
								this.showAuditAllDialog(row)
							},
						},
						{
							title: '提现驳回',
							auth: 'batchAuditFors',
							customRender: (action, row) => {
								action.hide = row.status == 7 ? false : true
								return action
							},
							click: (row) => {
								this.showRejectAllDialog(row)
							},
						},
					],
				},
			],
			tableDataQuota: [],
			tableColumnsQuota: [
				{
					type: 'string',
					dataIndex: 'month',
					title: '月份',
				},
				{
					type: 'amount',
					dataIndex: 'limitAmountTotal',
					title: '总限额',
				},
				{
					type: 'amount',
					dataIndex: 'limitAmountRemain',
					title: '剩余限额',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getWithdrawList()
				},
			},
			// 审核弹框
			dialogVisibleAudit: false,
			dialogVisibleAuditType: 1, // 1: 单个提现通过，2: 批量提现通过
			formCfgAudit: [
				{
					type: 'uploadImage',
					title: '上传图片',
					dataIndex: 'imageUrlList',
					uploadAttributes: {
						limit: 1,
						imageName: 'imageUrlTemp',
						accept: 'image/jpeg, image/jpg, image/png',
						beforeAvatarUpload: (file) => this.beforeAvatarUpload(file),
						httpRequest: (file) => this._uploadImageHttpRequest(file),
					},
				},
				{
					type: 'textarea',
					title: '备注',
					maxlength: 100,
					dataIndex: 'remark',
				},
			],
			auditData: {
				remark: '',
				imageUrlList: [],
			},
			dialogBtnAudit: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.commitRejectInfo(1)
					},
				},
			],
			// 驳回弹框
			dialogVisibleReject: false,
			dialogVisibleRejectType: 1, // 1: 单个提现驳回， 2: 批量提现驳回
			formCfgReject: [
				{
					type: 'textarea',
					title: '备注',
					maxlength: 100,
					dataIndex: 'remark',
				},
			],
			rejectData: {
				remark: '',
			},
			formRules: {
				remark: [{ required: true, message: '请填写备注', trigger: 'blur' }],
			},
			dialogBtnReject: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.commitRejectInfo(2)
					},
				},
			],
			selectedList: [], // 列表选中信息
		}
	},
	computed: {
		getDialogAuditTitle() {
			let titleMap = {
				1: '提现通过',
				2: '批量提现通过',
			}
			return titleMap[this.dialogVisibleAuditType]
		},
		getDialogRejectTitle() {
			let titleMap = {
				1: '提现驳回',
				2: '批量提现驳回',
			}
			return titleMap[this.dialogVisibleRejectType]
		},
	},
	methods: {
		beforeAvatarUpload(params) {
			const isLt2M = params.size / 1024 / 1024 < 4
			if (!isLt2M) {
				this.$message.error('上传文件大于4M,请重新选择!')
				return false
			} else if (!/\.(jpg|jpeg|png|GIF|JPG|PNG)$/.test(params.name)) {
				this.$message.warning('格式不对')
				return false
			} else {
				return params
			}
		},
		showAuditAllDialog(row) {
			// 显示批量通过弹框
			if (row) {
				// 单个
				this.dialogVisibleAuditType = 1
				this.selectedList = [row]
			} else {
				// 批量
				if (!this.selectedList.length) {
					return
				}
				this.dialogVisibleAuditType = 2
			}
			this.auditData = {
				remark: '',
				imageUrlList: [],
			}
			this.dialogVisibleAudit = true
		},
		showRejectAllDialog(row) {
			// 显示批量驳回弹框
			if (row) {
				// 单个
				this.dialogVisibleRejectType = 1
				this.selectedList = [row]
			} else {
				// 批量
				if (!this.selectedList.length) {
					return
				}
				this.dialogVisibleRejectType = 2
			}
			this.rejectData = {
				remark: '',
			}
			this.dialogVisibleReject = true
		},
		commitRejectInfo(type) {
			// type 1:审批通过， 2: 审批不通过
			// 提交驳回信息
			if (type == 2 && !this.rejectData.remark) {
				this.$message.error('请填写备注')
				return
			} else if (type == 1 && !this.auditData.remark) {
				this.$message.error('请填写备注')
				return
			}
			let params = {
				remark: '',
				billImgUrl: '',
				status: type,
				flowWithdrawIdList: [],
			}
			if (type == 1) {
				// 审批通过
				params.remark = this.auditData.remark
				params.billImgUrl = this.auditData.imageUrlList.length
					? this.auditData.imageUrlList[0].imageUrl
					: ''
			} else {
				// 审批不通过
				params.remark = this.rejectData.remark
			}
			params.flowWithdrawIdList = this.selectedList.map((item) => {
				return item.flowWithdrawId
			})
			// 提交审核
			this._updateAccWithdrawalAuditLogBatchAudit(params)
		},
		selectionChange(list) {
			// 勾选回调
			this.selectedList = list
		},
		_updateAccWithdrawalAuditLogBatchAudit: async function (params) {
			// 提交审核
			let {
				data: { resultCode },
			} = await updateAccWithdrawalAuditLogBatchAudit(params)
			if (resultCode == 0) {
				this.dialogVisibleAudit = false
				this.dialogVisibleReject = false
				this.$message.success('提交成功')
				this._getWithdrawList()
			}
		},
		_uploadImageHttpRequest: async function (params) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#addMaterial', imageType: 35 })
			)
			formData.append('file', params.file)
			const res = await uploadImageList(formData)
			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				this.auditData.portraitImageData = res.data.resultData.imageList[0]
				this.auditData.imageUrlList.push({
					imageUrlTemp: getBigImg(res.data.resultData.imageList[0].imageUrl),
					imageUrl: res.data.resultData.imageList[0].imageUrl,
				})
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
		remainingBalance: async function () {
			this.remainingQuota = true
			let {
				data: { resultCode, resultData },
			} = await getWithdrawBalance({})
			if (resultCode == 0) {
				this.tableDataQuota = resultData
			}
		},

		_exportWithdrawList: async function () {
			// 导出列表数据
			let paramJson = this.findSearchParams()
			paramJson.headerList = [
				'flowWithdrawId', // ID
				'channel', // 通道
				'addTime', // 发起时间
				'finishTime', // 到账时间
				'amount', // 金额
				'serviceCharge', // 提现手续费
				'platformServiceCharge', // 服务费
				'status', // 状态
				'userName', // 操作人姓名
				'withdrawSn', // 交易单号
				'accountName', // 账户名
				'phone', // 手机号
				'accountNumber', // 账号
				'cardNumber', // 身份证号码
				'bankName', // 开户银行
			]
			let { data } = await exportWithdrawList(paramJson)
			downloadFile(data, '提现明细记录.xlsx')
		},
		goConfigureWithdrawalRouting() {
			// 跳转配置路由页面
			this.$router.push({
				path: '/finance/configureWithdrawalRouting',
			})
		},
		showWithdrawInformation(row) {
			// 设置提现信息
			this.dialogVisible = true
			this.withdrawData = row
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		_getWithdrawList: async function (flag, e) {
			// 获取列表数据
			let paramJson = this.findSearchParams(flag)
			if (!paramJson.finishTimeStart && !paramJson.addTimeStart) {
				this.$message.warning('必须选择提现到账时间或提现发起时间进行搜索')
				return
			}
			let isGetWithdrawListByParam = !checkFunctionCode(
				'getWithdrawListByParam'
			)
			if (
				isGetWithdrawListByParam &&
				!paramJson.organizationId &&
				!paramJson.keyword
			) {
				this.$message.warning('请输入店主ID或者操作人')
				return
			}
			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			this.showLoading = true
			// let res = null
			// if (checkFunctionCode('getWithdrawList')) {
			// 	res = await getWithdrawList(paramJson, custom)
			// } else if (checkFunctionCode('getWithdrawListByParam')) {
			// 	res = await getWithdrawListByParam(paramJson, custom)
			// }
			let {
				data: { resultCode, resultData },
			} = await getWithdrawList(paramJson, custom)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.flowWithdrawVoDetail.map((item) => {
					item.channel = item.channel ? item.channel : 0
					item.levelType = item.levelType ? item.levelType : 0
					return item
				})
				this.page.count = resultData.count
				this.statistics[0].value =
					(resultData.flowWithdrawSumVo &&
						resultData.flowWithdrawSumVo.amount) ||
					'0.00'
				this.statistics[1].value =
					(resultData.flowWithdrawSumVo &&
						resultData.flowWithdrawSumVo.serviceCharge) ||
					'0.00'
				this.statistics[2].value =
					(resultData.flowWithdrawSumVo &&
						resultData.flowWithdrawSumVo.platformServiceCharge) ||
					'0.00'
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>

<template>
	<basic-container>
		<div>
			<div style="">
				<yx-form
					style="display: contents"
					:inline="true"
					:data="formInline"
					:items="formCfg"
					:formAction="funAction"
				>
				</yx-form>
			</div>
			<el-button
				style="margin-bottom: 20px"
				type="primary"
				v-auth="'createUserRiskControl'"
				@click="getAddedRiskControlType"
				>新增风控类型</el-button
			>
			<el-row>
				<yx-table
					v-loading="loading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableList"
				>
				</yx-table>
			</el-row>
		</div>
		<!-- //关联用户 -->
		<Dialog
			title="关联用户"
			:visible="relevancyUseLoding"
			width="40%"
			height="10%"
			:bottomBtn="relevancyBottomBtn"
			@before-close="relevancyUseLoding = false"
		>
			<yx-form
				ref="form"
				:inline="false"
				:items="uploadItem"
				:data="uploadData"
				labelWidth="150px"
			>
				<template #riskControlTypeName>
					<div style="display: initial">
						{{ uploadData.riskControlTypeName }}
					</div>

					<el-button
						style="margin-left: 60px"
						type="primary"
						@click="downloadFile('/excel/platform/风控用户名称.xlsx')"
						>下载导入风控用户模板</el-button
					>
					<el-button
						style="margin-left: 30px"
						type="primary"
						@click="leadRecord"
						>导入风控用户信息记录</el-button
					>
				</template>
			</yx-form>
			<p class="mtb20">数据导入说明：</p>
			<p class="lh26">
				1. 文件后缀名必须为：xls或xlsx（Excel标准格式）<br />
				2. 用户ID 不能为空，且必须正确，否则该条数据导入失败；<br />
			</p>
		</Dialog>
		<!-- //新增/编辑风控类型 -->
		<Dialog
			:title="title"
			:visible="addedRiskControlTypeLoding"
			width="40%"
			labelWidth="120px"
			:bottomBtn="addedRiskControlTypeBottomBtn"
			@before-close="close"
		>
			<yx-form
				ref="dialog110"
				labelWidth="120px"
				:data="formData110"
				:items="formCfg110"
				:rules="formRules110"
			>
				<template slot="validityType">
					<el-radio-group
						class="validity-type-box"
						v-model="formData110.validityType"
					>
						<el-radio class="validity-type-item" :label="1">
							长期有效
						</el-radio>
						<el-radio :label="2">
							风控用户<el-input
								class="validity-day"
								type="number"
								onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
								v-model="formData110.validityDay"
							></el-input
							><span>天</span><span style="margin-left: 20px">自动解封</span>
						</el-radio>
					</el-radio-group>
				</template>
			</yx-form>
		</Dialog>

		<!-- //查看用户-->
		<Dialog
			title="查看用户"
			:visible="viewUserLoading"
			width="40%"
			labelWidth="120px"
			:bottomBtn="viewUserLodingBottomBtn"
			@before-close="closeView"
		>
			<yx-form
				:inline="true"
				:data="viewFormData"
				:items="viewFormCfg"
				:formAction="viewFunAction"
			>
			</yx-form>
			<el-button
				type="primary"
				style="margin-bottom: 20px"
				v-auth="'batchRemoveUserRiskControlItem'"
				@click="remove(null)"
				>批量移除</el-button
			>
			<el-button
				type="primary"
				v-auth="'riskControlItemExportByCondition'"
				style="margin-bottom: 20px; float: right"
				@click="derive"
				>导出</el-button
			>

			<yx-table
				:select="true"
				v-loading="viewLoading"
				:columns="viewUserTableColumns"
				:pagination="viewUserPage"
				:data="viewUserTableList"
				:selectionChange="selectionChange"
			>
			</yx-table>
		</Dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import Dialog from '@/components/Dialog'
import { imgCosServerPath } from '@/utils/imageTool'
import {
	createUserRiskControl,
	updateUserRiskControl,
	enableUserRiskControl,
	listUserRiskControl,
	listUserRiskControlItem,
	batchRemoveUserRiskControlItem,
	riskControlItemExportByCondition,
	importUserRiskControlItem,
} from '@/api/risk-control'
import { downloadFile } from '@/utils/helper/common'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},

	name: 'FormTable',

	data() {
		return {
			loading: false,
			downloadFile,
			//---------------------------S查看用户---------------------------------
			selectionData: [],
			viewFormData: { queryUserId: '', riskControlStatus: '' },
			viewUserId: null,
			viewFunAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.viewUser()
					},
				},
			],
			viewFormCfg: [
				{
					title: '用户ID',
					label: 'value',
					type: 'inputNumber',
					dataIndex: 'queryUserId',
					placeholder: '请输入用户ID',
				},
				{
					type: 'select',
					title: '风控状态',
					dataIndex: 'riskControlStatus',
					label: 'value',
					options: [
						{
							riskControlStatus: '',
							value: '全部',
						},
						{
							riskControlStatus: 1,
							value: '风控中',
						},
						{
							riskControlStatus: 2,
							value: '风控完成',
						},
					],
				},
			],
			viewLoading: false,
			viewUserLoading: false,
			viewUserTableList: [],
			viewUserLodingBottomBtn: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.closeView()
					},
				},
			],
			viewUserTableColumns: [
				{
					type: 'string',
					dataIndex: 'userId',
					title: '用户ID',
				},
				{
					type: 'data',
					dataIndex: 'riskControlStartTime',
					title: '风控开始时间',
				},
				{
					type: 'string',
					dataIndex: 'riskControlStatus',
					title: '风控状态',
					customRender: (row) => {
						return row.riskControlStatus === 1 ? '风控中' : '风控完成'
					},
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '移除该用户',
							auth: 'riskControlItemExportByCondition',
							click: (row) => {
								this.remove(row)
							},
						},
					],
				},
			],
			viewUserPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.viewUser()
				},
			},
			//---------------------------E查看用户--------------------------------

			//---------------------------S新增风控类型---------------------------------
			id: null,
			addedRiskControlTypeLoding: false,
			title: '',
			formData110: {
				risk: '',
				riskType: 1,
				validityType: 1,
				validityDay: '',
			},
			formCfg110: [
				{
					title: '风控类型名称',
					label: 'value',
					type: 'input',
					dataIndex: 'risk',
					placeholder: '请输入风控类型名称',
				},
				{
					type: 'radio',
					title: '选择风控手段',
					dataIndex: 'riskType',
					label: 'value',
					options: [
						{
							value: '不予赠送运保卡',
							riskType: 1,
						},
					],
				},
				{
					title: '风控周期',
					type: 'custom',
					dataIndex: 'validityType',
				},
			],
			addedRiskControlTypeBottomBtn: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.$refs.dialog110.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.addedRiskControlTypeInformation()
							}
						})
					},
				},
			],
			formRules110: {
				risk: [
					{
						required: true,
						message: '请输入风控类型名称',
						trigger: 'blur',
					},
					{
						max: 20,
						message: '风控类型名称长度不超过20个字符',
						trigger: 'blur',
					},
				],
				riskType: [
					{ required: true, message: '请选择风控手段', trigger: 'blur' },
				],
				validityType: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (
								this.formData110.validityType == 2 &&
								!this.formData110.validityDay
							) {
								callback(new Error('请填写天数'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
			},
			//---------------------------E新增风控类型---------------------------------
			//---------------------------S关联用户弹窗---------------------------------
			relevancyUseLoding: false,
			riskId: null,
			uploadData: {
				riskControlTypeName: '',
				goodsFile: [],
			},
			uploadItem: [
				{
					title: '风控类型名称',
					type: 'custom',
					dataIndex: 'riskControlTypeName',
				},
				{
					type: 'upload',
					dataIndex: 'goodsFile',
					uploadAttributes: {
						limit: 1,
						autoUpload: false,
						accept:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
						httpRequest: (file) => this._importUserRiskControlItem(file),
					},
					class: 'excel-upload',
				},
			],
			//---------------------------E关联用户弹窗---------------------------------
			formInline: {
				riskControlType: '',
				status: '',
				startTime: moment().startOf('month').valueOf(), // 查询开始时间
				endTime: moment().endOf('month').valueOf(), // 查询结束时间
			},
			tableList: [],
			formCfg: [
				{
					title: '风控类型：',
					label: 'value',
					type: 'input',
					dataIndex: 'riskControlType',
					placeholder: '请输入风控类型',
				},
				{
					type: 'select',
					title: '状态：',
					dataIndex: 'status',
					label: 'value',
					options: [
						{
							status: '',
							value: '全部',
						},
						{
							status: 1,
							value: '启用',
						},
						{
							status: 2,
							value: '禁用',
						},
					],
				},
				{
					title: '创建时间：',
					label: 'value',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
				},
			],
			funAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init(true)
					},
				},
			],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'riskControlType',
					title: '风控类型',
				},
				{
					type: 'string',
					dataIndex: 'riskControlCount',
					title: '风控人数',
				},
				{
					type: 'string',
					dataIndex: 'riskControlMethods',
					title: '风控手段',
					customRender: (row) => {
						return row.riskControlMethods === 1 ? '不予赠送运保卡' : ''
					},
				},
				{
					type: 'string',
					dataIndex: 'riskControlTime',
					title: '风控时间',
					customRender: (row) => {
						return row.riskControlTime === 0
							? '长期有效'
							: row.riskControlTime + '天'
					},
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '状态',
					customRender: (row) => {
						return row.status === 1 ? '启用' : '禁用'
					},
				},
				{
					type: 'data',
					dataIndex: 'addTimeLong',
					title: '创建时间',
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '禁用',
							auth: 'enableUserRiskControl',
							click: (row) => {
								this.setStatus(row)
							},
							customRender: (action, row) => {
								action.title = row.status == 1 ? '禁用' : '启用'
								return action
							},
						},
						{
							title: '编辑',
							auth: 'updateUserRiskControl',
							click: (row) => {
								this.addedRiskControlTypeLoding = true
								this.title = '编辑风控类型'
								this.editRiskControlType(row)
							},
						},
						{
							title: '关联用户',
							auth: 'importUserRiskControlItem',
							click: (row) => {
								this._getRelevancyUseLoding(row)
							},
						},
						{
							title: '查看用户',
							auth: 'listUserRiskControlItem',
							click: (row) => {
								this.viewUserLoading = true
								this.viewUserId = row.id
								this.viewUser()
							},
						},
					],
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
		}
	},
	computed: {
		uploadHead() {
			// 上传文件请求头
			return {
				'X-AUTH-TOKEN': this.getSessionKey,
			}
		},
	},
	created: function () {
		this.init(true)
	},
	methods: {
		//---------------S查看用户------------------------
		closeView() {
			this.viewUserLoading = false
			this.viewFormData = { userId: '', riskControlStatus: '' }
		},
		// 批量移除勾选
		selectionChange(row) {
			this.selectionData = row
		},
		async derive() {
			let paramJson = Object.assign({}, this.viewFormData)
			paramJson.groupId = this.$store.state.user.userInfo.groupId
			paramJson.listPath = '用户风控>用户风控列表'
			let {
				data: { resultCode, resultData },
			} = await riskControlItemExportByCondition(paramJson)
			console.log('11111111', resultCode)

			if (resultCode == 0) {
				if (resultData.remoteFilePath) {
					resultData.remoteFilePath = resultData.remoteFilePath.replace(
						'/data/yhtplusFile/',
						''
					)
					const elt = document.createElement('a')
					elt.setAttribute('href', imgCosServerPath + resultData.remoteFilePath)
					console.log('11111111', imgCosServerPath + resultData.remoteFilePath)
					elt.setAttribute('download', 'file.xlsx')
					elt.style.display = 'none'
					document.body.appendChild(elt)
					elt.click()
					document.body.removeChild(elt)
					// window.open(imgCosServerPath + resultData.remoteFilePath)
				}
			}
		},
		async remove(row) {
			console.log('row', row)
			let paramJson = {}
			if (row) {
				paramJson.ids = [row.id]
			} else {
				if (this.selectionData.length === 0) {
					this.$message.warning('请勾选需要移除的风控用户')
					return
				}
				paramJson.ids = this.selectionData.map((item) => {
					return item.id
				})
			}

			this.$confirm(
				row
					? '移除该用户，不再受风控手段?'
					: `确定批量移除${this.selectionData.length}个勾选的风控用户？`,
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			).then(async () => {
				const {
					data: { resultCode },
				} = await batchRemoveUserRiskControlItem(paramJson)
				if (resultCode == 0) {
					this.$message({
						type: 'success',
						message: '成功!',
					})
					this.viewUser()
				}
			})
		},

		// 搜索条件
		viewFindSearchParams(flag) {
			const paramJson = Object.assign(this.viewFormData, {
				pageNum: 1,
				pageSize: 10,
				length: this.viewUserPage.length,
				startIndex:
					(this.viewUserPage.currentPage - 1) * this.viewUserPage.length,
			})
			// 每页的加载数据长度
			paramJson.pageSize = this.viewUserPage.length
			// 当前页的条数开始
			if (flag) {
				this.viewUserPage.currentPage = 1
			}
			paramJson.pageNum = this.viewUserPage.currentPage
			return paramJson
		},
		async viewUser(flag) {
			let paramJson = this.viewFindSearchParams(flag)
			paramJson.id = this.viewUserId
			const {
				data: { resultCode, resultData },
			} = await listUserRiskControlItem(paramJson)
			if (resultCode == 0) {
				this.viewUserTableList = resultData.recordList
				this.viewUserPage.count = resultData.totalCount
			} else {
				this.viewUserTableList = []
				this.viewUserPage.count = 0
			}
		},
		//---------------E查看用户------------------------

		//---------------S新增风控类型------------------------
		//编辑回显
		editRiskControlType(row) {
			this.id = row.id
			this.formData110 = {
				risk: row.riskControlType,
				riskType: 1,
				validityType: row.riskControlTime === 0 ? 1 : 2,
				validityDay: row.riskControlTime === 0 ? '' : row.riskControlTime,
			}
			console.log('666', row)
		},
		// 新增弹起弹窗
		getAddedRiskControlType() {
			this.title = '新增风控类型'
			this.addedRiskControlTypeLoding = true
		},
		async addedRiskControlTypeInformation() {
			let paramJson = {
				riskControlType: this.formData110.risk,
				riskControlTime:
					this.formData110.validityType === 1
						? 0
						: this.formData110.validityDay,
				riskControlMethods: 1,
				userId: this.$store.state.user.userInfo.userId,
			}
			if (this.title === '编辑风控类型') {
				paramJson.id = this.id
			}
			console.log('666', paramJson)
			let Url =
				this.title === '编辑风控类型'
					? updateUserRiskControl
					: createUserRiskControl
			const {
				data: { resultCode },
			} = await Url(paramJson)
			if (resultCode === 0) {
				this.$message.success('成功')
				this.close()
				this.init()
			}
		},
		close() {
			this.addedRiskControlTypeLoding = false
			this.formData110 = {
				risk: '',
				riskType: 1,
				validityType: 1,
				validityDay: '',
			}
			this.$nextTick(() => {
				this.$refs.dialog110.$refs.YxForm.clearValidate()
			})
		},
		//---------------E新增风控类型------------------------

		//---------------S关联用户弹窗------------------------
		_getRelevancyUseLoding(row) {
			this.uploadData.riskControlTypeName = row.riskControlType
			this.riskId = row.id
			this.uploadData.goodsFile = []
			this.relevancyUseLoding = true
		},
		//导入
		async _importUserRiskControlItem(file) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({
					timeStamp: new Date().getTime(),
					groupId: 2,
					organizationId: this.$store.state.user.userInfo.organizationId,
				})
			)
			formData.append('formId', '#goodsForm')
			formData.append('file', file.file)
			formData.append('riskId', this.riskId)
			let {
				data: { resultCode, resultMsg },
			} = await importUserRiskControlItem(formData)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
				this.relevancyUseLoding = false
				this.init(true)
			}
		},
		//跳转导入记录
		leadRecord() {
			this.$router.push({
				path: `/publicPage/importRecord/${43}/${'导入风控用户信息记录'}`,
			})
		},
		//---------------E关联用户弹窗------------------------
		// 禁用/启用
		setStatus: async function (info) {
			let message = ''
			let isDisable = true
			const self = this
			console.log(info)
			if (info.status == 2) {
				message = '确认要启用此风控类型'
			} else {
				isDisable = false
				message =
					'确认要禁用?禁用此风控类型不再生效，此类型下所有风控手段不再生效'
			}
			this.$alert(message, '提示', {
				confirmButtonText: '确定',
				callback: (action) => {
					if (action == 'confirm') {
						self.enableUserRiskControl(info.id, isDisable)
					}
				},
			})
		},
		// 禁用/启用调取接口
		enableUserRiskControl: async function (ids, flag) {
			let status = 1
			if (!flag) {
				status = 2
			}
			let {
				data: { resultCode, resultMsg },
			} = await enableUserRiskControl({
				id: ids,
				status: status,
			})
			let type = ''
			if (resultCode == 0) {
				type = 'success'
			} else {
				type = 'error'
			}
			this.$message({
				message: resultMsg,
				type: type,
			})
			this.init()
		},
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = Object.assign(this.formInline, {
				pageNum: 1,
				// pageSize: 10,
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})

			paramJson.pageNum = this.page.currentPage
			return paramJson
		},
		async init(flag) {
			let paramJson = this.findSearchParams(flag)
			if (
				moment(paramJson.startTime).valueOf() >
				moment(paramJson.endTime).valueOf()
			) {
				return this.$message.warning('开始时间不可大于结束时间')
			}
			if (this.formInline.orgId) {
				paramJson.orgId = this.formInline.orgId
			}
			this.loading = true
			let {
				data: { resultCode, resultData },
			} = await listUserRiskControl(paramJson)
			this.loading = false
			if (resultCode == 0) {
				this.tableList = resultData.recordList
				this.page.count = resultData.totalCount
			} else {
				this.page.count = 0
				this.tableList = []
			}
		},
	},
}
</script>

<style>
.messageCenter_keyword_input {
	width: 260px;
}
.wi {
	width: 500px;
}

.validity-type-item {
	margin-top: 10px;
	margin-bottom: 20px;
}
.validity-day {
	width: 100px;
	margin: 0 10px;
}
.validity-type-box {
	display: flex;
	flex-direction: column;
}
</style>

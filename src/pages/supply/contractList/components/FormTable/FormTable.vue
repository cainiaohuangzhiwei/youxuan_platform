<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			>
			</yx-form>
			<el-row>
				<yx-table
					v-loading="loading"
					:columns="tableColumns"
					:pagination="page"
					:data="list"
				>
				</yx-table>
			</el-row>
		</div>
		<Dialog
			title="修改收费方案"
			:visible.sync="modifySchemeDialog"
			:width="dialogWidth194"
			:bottomBtn="modifySchemeBottom"
		>
			<div style="margin-bottom: 20px">商家名称:{{ supplierNmae }}</div>
			<span style="color: #ff4949; margin-right: 4px">*</span>
			<template>
				选择收费方案：
				<el-radio class="mb20" v-model="chargeType" label="1">方案一</el-radio>
				<el-radio v-model="chargeType" label="2">方案二</el-radio>
			</template>
		</Dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import Dialog from '@/components/Dialog'
import YxTable from '@wg-vue-materials/yx-table'
import { imgCosServerPath } from '@/utils/imageTool'
import {
	listContract,
	updateSendContract,
	contractExportByCondition,
	deleteContract,
} from '@/api/signCenter'
import { getConstantValueByKey } from '@/utils/helper/common'
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
			modifySchemeDialog: false,
			list: [],
			chargeType: '1',
			supplierName: '',
			id: '',
			modifySchemeBottom: [
				{
					title: '取消',
					auth: '',
					isClear: true,
					click: () => {
						this.modifySchemeDialog = false
						this.chargeType = '1'
					},
				},
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this._updateSendContract()
					},
				},
			],
			formAction: [
				{
					title: '重置',
					auth: '',
					isClear: true,
				},
				{
					title: '搜索',
					type: 'primary',
					click: () => {
						this._listContract(true)
					},
				},
				{
					title: '导出',
					type: 'primary',
					auth: 'contractExportByCondition',
					click: () => {
						this.derive()
					},
				},
			],
			formInline: {
				partiesName: '', // 签约方名称
				contractSn: '', // 合同编号
				contractTemplateName: '', // 合同模板名称
				signAddTime: '', //moment(moment().startOf('month')).valueOf(), // 查询开始时间
				signEndTime: '', //moment(moment().endOf('month')).valueOf(), // 查询结束时间
				expireAddTime: '', //moment(moment().startOf('month')).valueOf(), // 到期时间start
				expireEndTime: '', // moment(moment().startOf('month')).valueOf(), // 到期时间end
				effectStatus: '', // 合同生效状态 0 CREATED：已创建，1 VALID：生效中，2 INVALID：已过期
				signStatus: '', // 1 WAIT_SIGN:待签属，2 SIGN_ING：签署中，3 SIGN_SUCCESS：签属成功，" +             "4 SIGN_FAIL:签署失败，5 SIGN_CLOSE:签署关闭
				isSupplier: '0', // 是否商家端 默认是 0:否 1:是
			},
			formCfg: [
				{
					title: '签约方名称',
					label: 'value',
					type: 'input',
					dataIndex: 'partiesName',
					placeholder: '请输入签约方名称',
				},
				{
					title: '合同编号',
					label: 'value',
					type: 'input',
					dataIndex: 'contractSn',
					placeholder: '请输入合同编号',
				},
				{
					title: '合同模板名称',
					label: 'value',
					type: 'input',
					dataIndex: 'contractTemplateName',
					placeholder: '合同模板名称',
				},
				{
					title: '合同签署状态',
					type: 'select',
					dataIndex: 'signStatus',
					label: 'value',
					placeholder: '请输入合同签署状态',
					options: [
						{
							value: '全部',
							signStatus: '',
						},
						{
							value: '待签属',
							signStatus: '1',
						},
						{
							value: '签署中',
							signStatus: '2',
						},
						{
							value: '签属成功',
							signStatus: '3',
						},
						{
							value: '签署失败',
							signStatus: '4',
						},
						{
							value: '签署关闭',
							signStatus: '5',
						},
					],
				},
				{
					title: '合同生效状态',
					type: 'select',
					dataIndex: 'effectStatus',
					label: 'value',
					placeholder: '请输入合同生效状态',
					options: [
						{
							value: '全部',
							effectStatus: '',
						},
						{
							value: '已创建',
							effectStatus: '0',
						},
						{
							value: '生效中',
							effectStatus: '1',
						},
						{
							value: '已过期',
							effectStatus: '2',
						},
					],
				},
				{
					title: '签署时间',
					label: 'value',
					type: 'datetimerange',
					dataIndex: ['signAddTime', 'signEndTime'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					title: '到期时间',
					label: 'value',
					type: 'datetimerange',
					dataIndex: ['expireAddTime', 'expireEndTime'],
					placeholder: ['开始时间', '结束时间'],
				},
			],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'contractId',
					title: '合同编号',
				},
				{
					type: 'string',
					dataIndex: 'subjectName',
					title: '签约方名称',
				},
				{
					type: 'string',
					dataIndex: 'templateName',
					title: '合同模板名称',
				},
				{
					type: 'string',
					dataIndex: 'templateId',
					title: '合同签署状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.SIGN_STATUS,
							row.signStatus,
							'-',
							'signStatus'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'effectStatus',
					title: '合同生效状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.EFFECT_STATUS,
							row.effectStatus,
							'-',
							'effectStatus'
						)
					},
				},
				{
					type: 'date',
					dataIndex: 'signTime',
					title: '签署时间',
				},
				{
					type: 'date',
					dataIndex: 'expireEndTime',
					title: '到期时间',
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '查看',
							auth: 'viewContract',
							click: (row) => {
								window.open(row.viewpdfUrl)
							},
						},
						{
							title: '下载',
							auth: 'downloadContract',
							click: (row) => {
								window.open(row.downloadUrl)
							},
						},
						{
							title: '修改收费方案',
							auth: 'updateSendContract',
							click: (row) => {
								this.modifyScheme(row)
							},
							customRender: (action, row) => {
								action.hide =
									row.contractType != 'SERVICEAGREEMENT' ||
									row.signStatus == 'SIGN_SUCCESS'
								return action
							},
						},
						{
							title: '删除',
							auth: 'deleteContract',
							popconfirm: true,
							popconfirmTitle: '确认要删除吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this.delContract(row)
							},
						},
					],
				},
			],
			page: {
				count: 0,
				currentPage: 1,
				length: 10,
				tableChange: () => {
					this._listContract()
				},
			},
		}
	},

	created: function () {
		this._listContract()
	},
	methods: {
		//导出
		derive: async function () {
			let paramJson = Object.assign({}, this.formInline)
			paramJson.groupId = this.$store.state.user.userInfo.groupId
			paramJson.supplierId = 0
			paramJson.listPath = 'S端合同'
			let {
				data: { resultCode, resultData },
			} = await contractExportByCondition(paramJson)
			if (resultCode == 0) {
				if (resultData.remoteFilePath) {
					resultData.remoteFilePath = resultData.remoteFilePath.replace(
						'/data/yhtplusFile/',
						''
					)
					const elt = document.createElement('a')
					elt.setAttribute('href', imgCosServerPath + resultData.remoteFilePath)
					elt.setAttribute('download', 'file.xlsx')
					elt.style.display = 'none'
					document.body.appendChild(elt)
					elt.click()
					document.body.removeChild(elt)
				}
			}
		},
		// 修改收费方案
		async _updateSendContract() {
			const {
				data: { resultCode },
			} = await updateSendContract({
				chargeType: this.chargeType,
				supplierName: this.supplierName,
				id: this.id,
			})
			if (resultCode == 0) {
				this.$message.success('成功')
				this.modifySchemeDialog = false
				this._listContract(true)
				this.chargeType = '1'
			}
		},
		modifyScheme(row) {
			this.modifySchemeDialog = true
			this.chargeType = row.chargePlan === '一' ? '1' : '2'
			this.supplierName = row.subjectName
			this.id = row.id
		},
		// 列表查询
		findSearchParams106(flag) {
			if (flag) {
				this.page.currentPage = 1
			}
			const params = Object.assign(
				{
					length: this.page.length,
					startIndex: (this.page.currentPage - 1) * this.page.length,
				},
				this.formInline
			)
			return params
		},
		async _listContract(flag) {
			let params = this.findSearchParams106(flag)
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await listContract(params)
			this.loading = false
			if (resultCode == 0) {
				this.list = resultData.list
				this.page.count = resultData.totalCount
			}
		},
		// 删除合同
		delContract: async function (row) {
			let {
				data: { resultCode, resultMsg },
			} = await deleteContract({
				id: row.id,
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this._listContract(true)
			}
		},
	},
}
</script>

<style>
.messageCenter_keyword_input {
	width: 260px;
}
</style>

<template>
	<div class="serviceProviderVipStatistics">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
			</yx-form>
			<yx-table
				:select="true"
				v-loading="loading"
				:columns="tableColumns102"
				:selectionChange="selectionChange"
				:pagination="page102"
				:data="tableData102"
			></yx-table>
			<Dialog
				:title="dialogTitle103"
				:visible="dialogVisible103"
				:width="dialogWidth103"
				:bottomBtn="dialogBottomBtn103"
				@before-close="dialogVisible103 = false"
			>
				<detailsTemplate
					:templateId="activeRow.expressTemplateId"
					:supplierName="activeRow.supplierName"
				/>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import detailsTemplate from '../detailsTemplate'
import {
	expressTemplateList,
	settingFeeTemplateAudit,
} from '@/api/yhtPlusCmsSupplierExpressTemplate'
import { getConstantValueByKey } from '@/utils/helper/common'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
		detailsTemplate,
	},
	props: [],
	data() {
		return {
			selectedList: [],
			loading: false,
			activeRow: {},
			formData101: {},
			formCfg101: [
				{
					title: '商家名称',
					type: 'input',
					dataIndex: 'supplierName',
					placeholder: '请输入商家名称',
					enter: () => {
						if (!this.loading) this.getData102(true)
					},
				},
			],
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					yapiId: '',
					token: '',
					dialogId: '',
					click: () => {
						if (!this.loading) this.getData102(true)
					},
					tableId: 102,
				},
				{
					title: '批量审核',
					type: 'primary',
					auth: '',
					yapiId: '',
					token: '',
					dialogId: '',
					click: () => {
						if (this.selectedList.length == 0) {
							this.$message.error('请勾选上需要批量操作的模板！')
							return
						}
						let isNext = true
						let arr = []
						let ids = this.selectedList.map((item) => {
							if (
								item.auditStatus == 1 ||
								item.auditStatus == 3 ||
								item.auditStatus == 4
							) {
								arr.push(item.name)
								isNext = false
							}
							return item.expressTemplateId
						})
						if (!isNext) {
							this.$message.error(
								`勾选上的运费模板“${arr.join('、')}”该状态不能通过！`
							)
							return
						}
						this.$confirm('确认批量审核通过选中的运费模板？', '', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning',
							callback: async (action) => {
								if (action == 'confirm') {
									this.passIt(ids)
								}
							},
						})
					},
					tableId: 102,
				},
				{
					title: '批量驳回',
					type: 'primary',
					auth: '',
					yapiId: '',
					token: '',
					dialogId: '',
					click: () => {
						if (this.selectedList.length == 0) {
							this.$message.error('请勾选上需要批量操作的模板！')
							return
						}
						let isNext = true
						let arr = []
						let ids = this.selectedList.map((item) => {
							if (item.auditStatus == 1 || item.auditStatus == 4) {
								arr.push(item.name)
								isNext = false
							}
							return item.expressTemplateId
						})
						if (!isNext) {
							this.$message.error(
								`勾选上的运费模板“${arr.join('、')}”该状态不能驳回！`
							)
							return
						}
						this.refuseIt(ids)
					},
					tableId: 102,
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'action',
					title: '运费模板名称',
					actions: [
						{
							title: '查询',
							auth: 'expressTempDetail',
							dialogId: 103,
							click: (row) => {
								this.activeRow = row
								this.dialogVisible103 = true
							},
							customRender: (action, row) => {
								action.title = row.name
								return action
							},
						},
					],
				},
				{
					type: 'string',
					dataIndex: 'auditStatus',
					title: '状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.EXPRESS_TEMP_AUDIT_STATUS,
							row.auditStatus,
							'状态异常',
							'auditStatus'
						)
					},
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '通过',
							auth: 'settingFeeTemplateAudit',
							popconfirm: true,
							popconfirmTitle: '确认审核通过该运费模板？',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this.passIt([row.expressTemplateId])
							},
							customRender: (action, row) => {
								action.hide =
									row.auditStatus == 1 ||
									row.auditStatus == 3 ||
									row.auditStatus == 4
								return action
							},
						},
						{
							title: '驳回',
							auth: 'settingFeeTemplateAudit',
							dialogId: 103,
							click: (row) => {
								this.refuseIt([row.expressTemplateId])
							},
							customRender: (action, row) => {
								action.hide = row.auditStatus == 1 || row.auditStatus == 4
								return action
							},
						},
					],
				},
			],
			page102: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData102()
				},
			},
			dialogTitle103: '运费模板详情',
			dialogWidth103: '900px',
			dialogVisible103: false,
			dialogBottomBtn103: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible103 = false
					},
				},
			],
		}
	},

	created() {
		this.getData102(true)
	},

	methods: {
		async passIt(id) {
			const {
				data: { resultCode },
			} = await settingFeeTemplateAudit({
				expressTemplateIds: id,
				auditStatus: 3,
			})

			if (resultCode == 0) {
				this.$message.success('操作成功')
				this.getData102()
			}
		},
		refuseIt(id) {
			this.$prompt(
				id.length > 1 ? '确认批量驳回选中的运费模板？' : '确认驳回该运费模板？',
				'',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
					inputErrorMessage: '请输入驳回理由',
					inputType: 'textarea',
					inputPlaceholder: '请输入驳回理由',
					inputValidator: (value) => {
						// 点击按钮时，对文本框里面的值进行验证
						if (value && value.length > 100) {
							return '字数太长！'
						}
					},
				}
			).then(async ({ value }) => {
				const {
					data: { resultCode },
				} = await settingFeeTemplateAudit({
					expressTemplateIds: id,
					auditStatus: 4,
					remark: value,
				})
				if (resultCode == 0) {
					this.$message.success('操作成功')
					this.getData102()
				}
			})
		},
		selectionChange(list) {
			this.selectedList = list
		},
		async getData102(flag) {
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			const {
				data: { resultCode, resultData },
			} = await expressTemplateList(paramJson)
			if (resultCode != 0) {
				this.$message({
					type: 'error',
					message: '查询超时',
					duration: 3000,
				})
			}
			if (resultData.datalist) {
				this.tableData102 = resultData.datalist
				this.page102.count = resultData.count
			}
			this.loading = false
		},
		findSearchParams102(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			const paramJson = Object.assign(this.formData101, {
				length: this.page102.length,
				startIndex: (this.page102.currentPage - 1) * this.page102.length,
			})
			return paramJson
		},
	},
}
</script>

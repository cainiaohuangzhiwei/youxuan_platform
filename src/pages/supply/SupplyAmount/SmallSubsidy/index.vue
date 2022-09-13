<template>
	<div class="SupplyList-page">
		<basic-container>
			<div>
				<yx-form
					:inline="true"
					:data="formInline"
					:items="formCfg"
					:formAction="formAction"
				></yx-form>

				<yx-table
					v-loading="loading"
					:columns="tableColumns"
					:pagination="page"
					:data="list"
				></yx-table>

				<edit-dialog ref="recordTable" />
			</div>
		</basic-container>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import EditDialog from './components/EditDialog'
import { downloadFile, numberFormat } from '@/utils/helper/common'
import {
	querySupplierCompensationConfigList,
	exportSupplierCompensationConfig,
	updateSupplierCompensationConfig,
} from '@/api/supplyAmount'
export default {
	name: 'SmallSubsidy1',
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		EditDialog,
	},
	data() {
		return {
			delType: '',
			formInline: {
				supplierName: '',
				supplierId: '',
				compensationPermissionState: '',
			},
			formCfg: [
				{
					title: '商家ID',
					type: 'inputNumber',
					dataIndex: 'supplierId',
					placeholder: '商家ID',
				},
				{
					title: '商家名称',
					type: 'input',
					dataIndex: 'supplierName',
					placeholder: '商家名称',
				},
				{
					title: '小额补款权限状态',
					type: 'select',
					dataIndex: 'compensationPermissionState',
					label: 'value',
					options: [
						{ compensationPermissionState: '', value: '全部' },
						{ compensationPermissionState: 0, value: '关闭' },
						{ compensationPermissionState: 1, value: '开启' },
					], // 0关闭； 1开启
				},
			],
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: this.onSubmit,
				},
				{
					title: '导出',
					click: this.onExport,
					auth: 'supplierCompensationConfigExport',
				},
				{
					title: '导入商家小额补款配置',
					type: 'primary',
					auth: 'importSupplierCompensationConfig',
					click: () => {
						this.$router.push({ name: 'SmallSubsidyImport' })
					},
				},
			],
			// 详情数据
			list: [],
			loading: false,
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'supplierId',
					title: '商家ID',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'newMap',
					dataIndex: 'compensationPermissionState',
					title: '小额补款权限状态',
					options: [
						['0', '关闭'],
						['1', '开启'],
					],
				},
				{
					type: 'amount',
					dataIndex: 'supplierDailyLimitAmount',
					title: '每日小额补偿金额上限',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '调整金额',
							auth: 'updateSupplierCompensationConfig',
							click: (row) => {
								this.handleEdit(row)
							},
						},
						{
							title: '关闭',
							auth: 'updateSupplierCompensationConfig',
							click: (row) => {
								this.handleUpdate(row)
							},
							customRender: (action, row) => {
								action.title =
									row.compensationPermissionState == 0 ? '开启' : '关闭'
								return action
							},
						},
						{
							title: '查看记录',
							auth: 'queryCompensationConfigRecord',
							click: (row) => {
								this.handleCheck(row)
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
					this.getConfigList()
				},
			},
		}
	},
	mounted() {
		this.getConfigList()
	},
	methods: {
		onSubmit() {
			this.getConfigList(true)
		},

		// 查询
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.formInline, {
				pageSize: this.page.length,
				pageNum: this.page.currentPage,
			})

			return paramJson
		},

		// 初始化
		async getConfigList(flag) {
			if (
				this.formInline.supplierId &&
				!/^[0-9]*$/.test(this.formInline.supplierId)
			) {
				return this.$message.error('商家ID数据格式不对')
			}
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await querySupplierCompensationConfigList(paramJson)

			if (resultCode === 0) {
				this.list = resultData.records
				this.page.count = resultData.total
				this.page.currentPage = resultData.currentPage
				this.loading = false
			} else {
				this.loading = false
				this.page.count = 0
				this.list = []
			}
		},

		// 导出
		async onExport() {
			if (
				this.formInline.supplierId &&
				!/^[0-9]*$/.test(this.formInline.supplierId)
			) {
				return this.$message.error('商家ID只能是数字')
			}
			const paramJson = this.findSearchParams()
			this.loading = true
			let { data } = await exportSupplierCompensationConfig(paramJson)
			this.loading = false
			downloadFile(data, '商家小额补款配置数据.xlsx')
		},

		// 状态改变
		handleUpdate(row) {
			let tip = ''
			if (row.compensationPermissionState == 0) {
				tip = '开启后，该商家即可针对订单进行补款'
			} else {
				tip = '关闭后，该商家后续不可针对订单进行自主补款'
			}
			this.$confirm(
				tip,
				`确认${
					row.compensationPermissionState == 0 ? '开启' : '关闭'
				}该商家小额补款权限？`,
				{
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							let {
								data: { resultCode },
							} = await updateSupplierCompensationConfig({
								supplierId: row.supplierId,
								compensationPermissionState:
									row.compensationPermissionState === 0 ? 1 : 0,
								supplierDailyLimitAmount: row.supplierDailyLimitAmount,
								userId: this.$store.state.user.userInfo.userId || '',
							})
							if (resultCode == 0) {
								this.getConfigList()
							}
						}
					},
				}
			)
		},

		// 调整金额
		handleEdit(row) {
			this.$prompt(
				`调整金额：由￥${numberFormat(
					row.supplierDailyLimitAmount,
					2
				)}，调整为`,
				'调整商家每日补款上限金额？',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /^(?:[1-9]\d*|0)(?:\.\d{1,2})?$/,
					inputErrorMessage: '金额格式有误，必填且支持最多两位小数点',
					inputPlaceholder: '输入金额',
					beforeClose: (action, instance, done) => {
						if (action === 'confirm') {
							if (Number(instance.inputValue) > 50000) {
								this.$message({
									type: 'error',
									message: '设定商家每日补款上限金额过高',
								})
								return
							}
						}
						done()
					},
				}
			)
				.then(async ({ value }) => {
					let {
						data: { resultCode },
					} = await updateSupplierCompensationConfig({
						supplierId: row.supplierId,
						compensationPermissionState: row.compensationPermissionState,
						supplierDailyLimitAmount: value,
						userId: this.$store.state.user.userInfo.userId || '',
					})
					if (resultCode == 0) {
						this.$message({
							type: 'success',
							message: '调整成功',
						})
						this.getConfigList()
					}
				})
				.catch(() => {})
		},

		// 查看记录
		handleCheck(row) {
			this.$refs.recordTable.detail(row)
		},
	},
}
</script>

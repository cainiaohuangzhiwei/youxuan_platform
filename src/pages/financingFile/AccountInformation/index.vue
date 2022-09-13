<template>
	<div>
		<yx-form
			:inline="true"
			:data="searchData"
			:items="formOptions"
			:formAction="formActions"
		>
			<template #supplierName>
				<el-input
					v-model="searchData.supplierName"
					placeholder="请选择商家"
					value-key="supplierName"
					label="supplierName"
					@focus="selectSupplier"
					clearable
					@clear="
						() => {
							searchData.supplierName = ''
							searchData.supplierIds = []
						}
					"
				>
					<el-button
						slot="append"
						icon="el-icon-more"
						@click="supplyDialogVisible = true"
					></el-button>
				</el-input>
			</template>
		</yx-form>
		<YxTable
			v-loading="tableLoding"
			:columns="tableColumns"
			:pagination="page"
			:data="tableData"
		>
		</YxTable>
		<multitermSupply-dialog
			:itemInfo="supplyRow"
			:visible.sync="supplyDialogVisible"
			@fatherMethodInit="fatherMethodInit"
		/>
	</div>
</template>
<script>
import YxForm from '@wg-vue-materials/yx-form'
import { numberFormat } from '@/utils/helper/common'
import YxTable from '@wg-vue-materials/yx-table'
import { sPlatformSupplierBalanceList } from '@/api/yhtPlusCmsSupplierBalance.js'
import MultitermSupplyDialog from '@/components/MultitermSupplyDialog'
import { downloadFile } from '@/utils/helper/common'
import { exportSupplierBalanceList } from '@/api/webImport.js'
export default {
	name: 'MerchantImportRecord',
	components: { YxForm, YxTable, MultitermSupplyDialog },
	data() {
		return {
			supplyRow: [], // 选种商家信息
			exportLoading: false, // 导出中
			tableLoding: false, // 表格加载中
			supplyDialogVisible: false, // 是否显示商家选择弹框
			searchData: {
				// 查询条件
				supplierName: '',
				supplierIds: [],
			},
			formOptions: [
				// 表单配置项
				{
					type: 'custom',
					title: '商家名称',
					dataIndex: 'supplierName',
					colSpan: 8,
				},
			],
			formActions: [
				// 表单操作按钮
				{
					title: '查询',
					type: 'primary',
					click: () => {
						// 查询列表
						this._sPlatformSupplierBalanceList(true)
					},
				},
				{
					title: '导入冲账数据',
					type: 'success',
					auth: 'importSupplierFlatBalanceList',
					click: () => {
						// 跳转导入页面
						this.$router.push('/financingFile/merchantImport')
					},
				},
				{
					title: '导出',
					type: 'success',
					align: 'right',
					click: async () => {
						// 下载导出列表
						if (this.exportLoading) return
						this.exportLoading = true
						let paramJson = {
							supplierIds: this.searchData.supplierIds,
							groupId: this.$store.state.user.userInfo.groupId,
						}
						let { data } = await exportSupplierBalanceList(paramJson)
						downloadFile(data, '商家账户数据.xls')
						this.exportLoading = false
					},
				},
			],
			tableColumns: [
				// 列表配置项
				{
					type: 'string',
					dataIndex: 'supplierId',
					title: '商家ID',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
				},
				{
					type: 'string',
					dataIndex: 'balanceAmount',
					title: '余额',
					customRender: (row) => {
						return `￥${numberFormat(row.balanceAmount, 2)}`
					},
				},
				{
					type: 'string',
					dataIndex: 'freezeBalance',
					title: '冻结余额',
					customRender: (row) => {
						return `￥${numberFormat(row.freezeBalance, 2)}`
					},
				},
				{
					type: 'string',
					dataIndex: 'pendingBalance',
					title: '待入账金额',
					customRender: (row) => {
						return `￥${numberFormat(row.pendingBalance, 2)}`
					},
				},
				{
					type: 'action',
					width: 150,
					title: '操作',
					actions: [
						{
							title: '查看详情',
							click: (row) => {
								// 查看详情
								this.$router.push({
									name: 'MerchantAccount',
									query: {
										supplierBalanceId: row.supplierBalanceId,
										supplierId: row.supplierId,
									},
								})
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
					this._sPlatformSupplierBalanceList()
				},
			},
			tableData: [],
		}
	},
	created() {
		// 获取列表信息
		this._sPlatformSupplierBalanceList(true)
	},
	methods: {
		fatherMethodInit(row) {
			// 设置勾选商家信息
			this.supplyRow = JSON.parse(JSON.stringify(row))
			this.searchData.supplierIds = []
			if (row.length) {
				let supplierNameStr = ''
				row.map((item) => {
					supplierNameStr += item.supplierName + ','
					this.searchData.supplierIds.push(item.supplierId)
				})
				supplierNameStr = supplierNameStr.slice(0, supplierNameStr.length - 1)
				this.searchData.supplierName = supplierNameStr
			}
		},
		async _sPlatformSupplierBalanceList(flag) {
			this.tableLoding = true
			if (flag) {
				this.page.currentPage = 1
			}

			let params = JSON.parse(JSON.stringify(this.searchData))
			delete params.supplierName
			params = {
				...params,
				length: this.page.length,
				startIndex: this.page.currentPage - 1,
			}
			// console.log(params, 'params')
			let {
				data: { resultCode, resultData },
			} = await sPlatformSupplierBalanceList(params)
			if (resultCode === 0) {
				this.tableData = resultData.supplierBalanceList
				this.page.count = resultData.count
			}
			this.tableLoding = false
		},
		selectSupplier(e) {
			e.target.blur()
			this.supplyDialogVisible = true
		},
	},
}
</script>

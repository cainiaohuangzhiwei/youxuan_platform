/* eslint-disable prettier/prettier */
<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			>
				<template #supplierName>
					<div>
						<el-input
							v-model="formInline.supplierName"
							placeholder="请选择商家"
							value-key="supplierName"
							label="supplierName"
							@focus="selectSupplier"
							clearable
							@clear="
								() => {
									formInline.supplierName = ''
									formInline.supplierId = ''
								}
							"
						>
							<el-button
								slot="append"
								icon="el-icon-more"
								@click="dialogVisible198 = true"
							></el-button>
						</el-input>
					</div>
				</template>
			</yx-form>
			<el-row>
				<yx-table
					:columns="tableColumns"
					:pagination="page"
					:data="list"
					v-loading="tableLoading"
				>
				</yx-table>
			</el-row>
		</div>
		<Dialog
			:title="dialogTitle198"
			:visible.sync="dialogVisible198"
			:width="dialogWidth198"
			:bottomBtn="dialogBottomBtn189"
		>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
			</yx-form>
			<yx-table
				v-loading="loading101"
				:columns="table101"
				:pagination="page101"
				:data="tableData101"
			>
				<template slot="supplierAccountNumberId" slot-scope="scope">
					<el-radio
						v-model="formInline.supplierId"
						:label="scope.row.supplierId"
						@change="changeAnchor(scope.row)"
						>选择</el-radio
					>
				</template>
			</yx-table>
		</Dialog>
	</basic-container>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import { processList } from '@/api/supply'
import { getCmsSupplierListByCondition } from '@/api/webImport'
// import moment from 'moment'
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
			loading101: false,
			table101: [
				{
					width: 200,
					type: 'custom',
					dataIndex: 'supplierAccountNumberId',
				},
				{
					dataIndex: 'supplierName',
					title: '商家',
				},
			],
			page101: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData198()
				},
			},
			tableData101: [],
			formData101: {
				supplierName: '',
			},
			formCfg101: [
				{
					type: 'input',
					title: '商家名称',
					dataIndex: 'supplierName',
				},
			],
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getData198(true)
					},
				},
			],
			dialogTitle198: '选择商家',
			dialogVisible198: false,
			dialogWidth198: '80%',
			dialogBottomBtn189: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.dialogVisible198 = false
					},
				},
			],
			tableLoading: false,
			//表单数据
			formInline: {
				supplierName: '',
				supplierId: '',
			},
			formCfg: [
				{
					title: '商家',
					type: 'custom',
					dataIndex: 'supplierName',
				},
			],
			formAction: [
				{
					title: '重置',
					click: () => {
						this.formInline = {
							supplierName: '',
							supplierId: '',
						}
					},
				},
				{
					title: '搜索',
					type: 'primary',
					click: () => {
						this.getData109(true)
					},
				},
			],
			page: {
				count: 0,
				length: 20,
				pageSizes: [20, 40, 60, 80, 100],
				currentPage: 1,
				tableChange: () => {
					this.getData109()
				},
			},
			tableColumns: [
				{
					dataIndex: 'supplierName',
					title: '商家名称',
					// width: '300',
				},
				{
					dataIndex: 'toBeDeliverCount',
					title: '待发货订单数',
					// width: '300',
				},
				{
					dataIndex: 'unDeliverTimeoutAlert',
					title: '超时发货预警',
					// width: '300',
				},
				{
					dataIndex: 'unDeliverTimeoutCount',
					title: '超时发货订单',
				},
				{
					dataIndex: 'unCollectCount',
					title: '未揽收订单数',
					// width: '300',
				},
				{
					dataIndex: 'unCollectTimeoutAlert',
					title: '超时揽收预警',
					// width: '300',
				},
				{
					dataIndex: 'unCollectTimeoutCount',
					title: '超时揽收订单',
					// width: '300',
				},
				{
					dataIndex: 'fakeDeliverAlert',
					title: '虚假发货预警',
					// width: '300',
				},
				{
					dataIndex: 'fakeDeliverCount',
					title: '虚假发货订单数',
					// width: '300',
				},
				{
					dataIndex: 'deliverStagnationCount',
					title: '物流停滞订单数',
					// width: '300',
				},
				{
					dataIndex: 'toBeAuditAfterSalesCount',
					title: '待审核售后单',
					// width: '300',
				},
				{
					dataIndex: 'unAuditAfterSalesCount',
					title: '超24h未审核售后单',
					// width: '300',
				},
				{
					dataIndex: 'unAuditAfterSalesAlert',
					title: '售后单超时预警',
					// width: '300',
				},
				{
					dataIndex: 'toBeAuditCheckGoodsCount',
					title: '待审核验货单',
					// width: '300',
				},
				{
					dataIndex: 'unAuditCheckGoodsCount',
					title: '超48h未审核验货单',
					// width: '300',
				},
				{
					dataIndex: 'unAuditCheckGoodsAlert',
					title: '超时未验货预警',
					// width: '300',
				},
				{
					dataIndex: 'toBeAuditInvoiceCount',
					title: '待审核开票订单数',
					// width: '300',
				},
				{
					dataIndex: 'unInvoiceCount',
					title: '待开票订单数',
					// width: '300',
				},
			],
			list: [],
		}
	},

	methods: {
		changeAnchor(row) {
			this.formInline.supplierName = row.supplierName
			this.formInline.supplierId = row.supplierId
			// this.rowData = Object.assign({}, row)
		},
		async getData198(flag) {
			this.loading = true
			let paramJson = this.findSearchParams198(flag)
			const {
				data: { resultCode, resultData },
			} = await getCmsSupplierListByCondition(paramJson)
			if (resultCode == 0) {
				this.tableData101 = resultData.supplierList
				this.page101.count = resultData.count
			} else {
				this.tableData101 = []
				this.page101.count = 0
			}
			this.loading = false
		},
		findSearchParams198(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page101.currentPage = 1
			}
			const paramJson = Object.assign(this.formData101, {
				length: this.page101.length,
				startIndex: (this.page101.currentPage - 1) * this.page101.length,
			})
			return paramJson
		},
		//商家弹窗
		selectSupplier(e) {
			e.target.blur()
			this.dialogVisible198 = true
		},
		async getData109(flag) {
			this.loading = true
			let paramJson = this.findSearchParams109(flag)
			const {
				data: { resultCode, resultData },
			} = await processList(paramJson)
			if (resultCode == 0) {
				this.list = resultData.recordList || []
				this.page.count = resultData.count
			} else {
				this.list = []
				this.page.count = 0
			}
			this.loading = false
		},
		findSearchParams109(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = Object.assign(this.formInline, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})
			return paramJson
		},
	},
}
</script>
<style lang="scss" scoped>
.main {
	// min-width: 1000px;
	width: 100%;
	margin-bottom: 20px;
}
.main-box {
	width: 100%;
	display: table;
}
.main-box_one {
	width: 8%;
	text-align: center;
	height: 100%;
	display: table-cell;
	vertical-align: middle;
	background: rgb(242, 242, 242);
}
.main-box_two {
	word-break: break-all;
	border-left: 1px solid rgb(204, 204, 204);
	border-top: 1px solid rgb(204, 204, 204);
	border-right: 1px solid rgb(204, 204, 204);
	display: table-cell;
	padding: 20px 10px;
	box-sizing: border-box;
}
.main-box_three {
	width: 6%;
	display: table-cell;
	vertical-align: middle;
	border-top: 1px solid rgb(204, 204, 204);
	border-right: 1px solid rgb(204, 204, 204);
	text-align: center;
}
.border-b {
	border-bottom: 1px solid rgb(204, 204, 204);
}
</style>

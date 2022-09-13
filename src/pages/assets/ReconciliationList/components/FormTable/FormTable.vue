<template>
	<div class="reconciliationListOld">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
				<template #supplierName>
					<el-input
						v-model="formData101.supplierName"
						placeholder="请选择商家"
						value-key="supplierName"
						label="supplierName"
						@focus="selectSupplier"
						clearable
						@clear="
							() => {
								formData101.supplierName = ''
								formData101.supplierAccountNumberIds = []
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
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns102"
				:pagination="page102"
				:data="tableData102"
			>
				<template slot="addTime" slot-scope="scope">
					<span>
						{{ moment(scope.row.salesTimeStart).format('YYYY-MM-DD HH:mm:ss') }}
					</span>
					-
					<span>
						{{ moment(scope.row.salesTimeEnd).format('YYYY-MM-DD HH:mm:ss') }}
					</span>
				</template>
				<template slot="handle" slot-scope="scope">
					<a
						style="color: #0096fb"
						target="_blank"
						@click="viewDetails(scope.row)"
						>查看详情</a
					>
					<div
						style="color: #0096fb; cursor: pointer"
						@click="getApproveList(scope.row)"
					>
						查看审批记录
					</div>
				</template>
			</yx-table>
			<Dialog
				:title="dialogTitle103"
				:visible="dialogVisible103"
				:width="dialogWidth103"
				:bottomBtn="dialogBottomBtn103"
				@before-close="dialogVisible103 = false"
			>
				<yx-table
					:select="false"
					v-loading="loading"
					:columns="tableColumns104"
					:data="tableData104"
				></yx-table>
			</Dialog>
			<!-- 商家/商家列表 -->
			<supplier-dialog
				:itemInfo="supplierRow"
				:visible.sync="supplyDialogVisible"
				chooseType="checkbox"
				@fatherMethodInit="
					(row) => {
						formData101.supplierName = row.supplierName
						formData101.supplierAccountNumberIds = row.supplierAccountNumberIds
					}
				"
			/>
		</basicContainer>
	</div>
</template>
<script>
import moment from 'moment'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import SupplierDialog from '@/components/SupplierDialog'
import {
	selectReconciliationRecordList,
	selectExaminationRecordList,
} from '@/api/reconciliation'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
		SupplierDialog,
	},
	props: [],
	data() {
		return {
			loading: false,
			moment,
			supplyDialogVisible: false,
			formData101: {
				keyWord: '',
				supplierName: '',
				firstStatus: '0',
				lastStatus: '0',
				supplierAccountNumberIds: [],
			},
			formCfg101: [
				{
					type: 'input',
					title: '筛选',
					dataIndex: 'keyWord',
					placeholder: '会场名称/分组名称',
				},
				{
					title: '商家名称',
					type: 'custom',
					dataIndex: 'supplierName',
				},
				{
					type: 'select',
					title: '首款对账状态',
					dataIndex: 'firstStatus',
					label: 'value',
					options: [
						{
							firstStatus: '0',
							value: '全部',
						},
						{
							firstStatus: '1',
							value: '未提交',
						},
						{
							firstStatus: '2',
							value: '待确认',
						},
						{
							firstStatus: '3',
							value: '待审核',
						},
						{
							firstStatus: '4',
							value: '待付款',
						},
						{
							firstStatus: '6',
							value: '已完成',
						},
						{
							firstStatus: '7',
							value: '已拒绝',
						},
						{
							firstStatus: '8',
							value: '付款失败',
						},
					],
				},
				{
					type: 'select',
					title: '尾款对账状态',
					dataIndex: 'lastStatus',
					label: 'value',
					options: [
						{
							lastStatus: '0',
							value: '全部',
						},
						{
							lastStatus: '1',
							value: '未提交',
						},
						{
							lastStatus: '2',
							value: '待确认',
						},
						{
							lastStatus: '3',
							value: '待审核',
						},
						{
							lastStatus: '4',
							value: '待付款',
						},
						{
							lastStatus: '6',
							value: '已完成',
						},
						{
							lastStatus: '7',
							value: '已拒绝',
						},
						{
							lastStatus: '8',
							value: '付款失败',
						},
					],
				},
			],
			formAction101: [
				{
					title: '重置',
					auth: '',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData102(true)
					},
					tableId: 102,
					api: 'selectReconciliationRecordList',
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					dataIndex: 'reconciliationSn',
					title: '对账单号',
					width: '150',
				},
				{
					type: 'string',
					dataIndex: 'goodsGroupName',
					title: '分组名称',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场名称',
					width: '120',
				},
				{
					type: 'custom',
					dataIndex: 'addTime',
					title: '售卖时间',
					width: '280',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
				},
				{
					type: 'date',
					dataIndex: 'auditTime',
					title: '提交审核时间',
					width: '120',
				},
				{
					type: 'string',
					dataIndex: 'firstStatus',
					title: '首款对账状态',
					customRender: (row) => {
						const arr = [
							'',
							'未提交',
							'待确认',
							'待审核',
							'待付款',
							'付款中',
							'已完成',
							'已拒绝',
							'付款失败',
						]
						return arr[row.firstStatus] || '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'lastStatus',
					title: '尾款对账状态',
					customRender: (row) => {
						const arr = [
							'',
							'未提交',
							'待确认',
							'待审核',
							'待付款',
							'付款中',
							'已完成',
							'已拒绝',
							'付款失败',
						]
						return arr[row.lastStatus] || '-'
					},
				},
				{
					type: 'custom',
					title: '操作',
					width: '120',
					dataIndex: 'handle',
					fixed: 'right',
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
			dialogTitle103: '审批记录',
			dialogWidth103: '50%',
			dialogVisible103: false,
			dialogBottomBtn103: [],
			tableData104: [],
			tableColumns104: [
				{
					type: 'string',
					dataIndex: 'clerkName',
					title: '操作人',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '操作时间',
				},
				{
					type: 'string',
					dataIndex: 'result',
					title: '操作结果',
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
			],
		}
	},

	methods: {
		viewDetails(row) {
			this.$router.push({
				path: `/finance/ReconciliationRecordDetail/${row.reconciliationRecordId}`,
			})
		},

		async getData102(flag) {
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			const {
				data: { resultCode, resultData },
			} = await selectReconciliationRecordList(paramJson)
			if (resultCode === 0) {
				this.tableData102 = resultData.list
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
		async getApproveList(row) {
			this.dialogVisible103 = true
			let paramJson = {
				reconciliationRecordId: row.reconciliationRecordId,
			}
			const {
				data: { resultCode, resultData },
			} = await selectExaminationRecordList(paramJson)
			if (resultCode === 0) {
				this.tableData104 = resultData.list
			}
		},
		selectSupplier(e) {
			e.target.blur()
			this.supplyDialogVisible = true
		},
	},
}
</script>

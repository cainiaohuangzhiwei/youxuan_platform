<template>
	<div class="reconciliationListOld">
		<basicContainer>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns101"
				:data="tableData101"
			></yx-table>
			<information-processing
				:itemInfo="itemInfo102"
				@initTable="getData102"
				:headTrail="false"
			/>
			<information-dialog
				:visible.sync="sponsor102"
				@init="getData102"
				:headTrailDialog="false"
			/>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import informationProcessing from './informationProcessing'
import informationDialog from './informationDialog'
import { selectReconciliationRecordById } from '@/api/reconciliation'
import { downloadFile } from '@/utils/helper/common'
import {
	exportReconciliationByBrandEnd,
	exportReconciliationDetailsEnd,
} from '@/api/webImport'

export default {
	components: {
		BasicContainer,
		YxTable,
		informationProcessing,
		informationDialog,
	},
	props: ['reconciliationRecordId'],
	data() {
		return {
			loading: false,
			tableData101: [],
			sponsor102: false,
			itemInfo102: {},
			tableColumns101: [
				{
					type: 'string',
					dataIndex: 'goodsGroupName',
					title: '分组名称',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场名称',
				},
				{
					type: 'string',
					dataIndex: 'addTime',
					title: '售卖时间',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '尾款对账单下载',
							auth: '',
							click: (row) => {
								this.exportReconciliationByBrandEndList(row)
							},
						},
						{
							title: '尾款对账单明细下载',
							auth: '',
							click: (row) => {
								this.exportReconciliationDetailsEndList(row)
							},
						},
						{
							title: '发起审批',
							auth: '',
							click: (row) => {
								if (row.firstStatus == 2 || row.firstStatus == 3) {
									this.$message.warning('审批还未完成,无法发起重新发起审批')
								} else if (
									row.firstStatus == 1 ||
									row.firstStatus == 2 ||
									row.firstStatus == 3 ||
									row.firstStatus == 7
								) {
									this.$message.warning('首款审批还未完成,无法发起尾款审批')
								} else {
									this.sponsor102 = true
								}
							},
						},
					],
				},
			],
		}
	},
	created() {
		this.getData102()
	},
	methods: {
		async getData102() {
			this.loading = true
			let paramJson = {
				reconciliationRecordId: this.$route.params.reconciliationRecordId,
				type: 2,
			}
			const {
				data: { resultCode, resultData },
			} = await selectReconciliationRecordById(paramJson)
			if (resultCode === 0) {
				this.itemInfo102 = resultData
				this.tableData101 = [resultData.reconciliationRecord]
			}
			this.loading = false
		},
		async exportReconciliationByBrandEndList(row) {
			const params = {
				reconciliationRecordId: this.$route.params.reconciliationRecordId,
			}
			const { data } = await exportReconciliationByBrandEnd(params)
			downloadFile(data, row.brandName + '尾款对账单.xlsx')
		},
		async exportReconciliationDetailsEndList(row) {
			const params = {
				reconciliationRecordId: this.$route.params.reconciliationRecordId,
			}
			const { data } = await exportReconciliationDetailsEnd(params)
			downloadFile(data, row.brandName + '尾款对账单明细.xlsx')
		},
	},
}
</script>

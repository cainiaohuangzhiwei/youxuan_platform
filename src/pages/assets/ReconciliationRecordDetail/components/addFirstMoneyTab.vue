<template>
	<div>
		<basicContainer>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns106"
				:data="tableData106"
			>
			</yx-table>
			<information-processing
				:itemInfo="itemInfo"
				@initTable="getData106"
				:headTrail="true"
			/>
			<information-dialog
				:visible.sync="sponsor"
				@init="getData106"
				:headTrailDialog="true"
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
import {
	exportReconciliationByBrandFirst,
	exportReconciliationDetails,
} from '@/api/webImport'
import { mapGetters } from 'vuex'
import { downloadFile } from '@/utils/helper/common'

export default {
	components: {
		BasicContainer,
		YxTable,
		informationProcessing,
		informationDialog,
	},
	props: [],
	data() {
		return {
			loading: false,
			sponsor: false,
			itemInfo: {},
			tableData106: [],
			tableColumns106: [
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
					type: 'data',
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
							title: '首款对账单下载',
							auth: 'exportReconciliationByBrandFirst',
							click: (row) => {
								this.exportReconciliationByBrandEndList(row)
							},
						},
						{
							title: '首款对账单明细下载',
							auth: 'exportReconciliationDetails',
							click: (row) => {
								this.exportReconciliationDetailsEndList(row)
							},
						},
						{
							title: '发起审批',
							auth: 'verifySaveReconciliation',
							click: (row) => {
								if (row.firstStatus == 2 || row.firstStatus == 3) {
									return this.$message.warning(
										'审批还未完成,无法发起重新发起审批'
									)
								} else {
									this.sponsor = true
								}
							},
							customRender: (action, row) => {
								let show =
									row.firstStatus == 1 ||
									row.firstStatus == 2 ||
									row.firstStatus == 3 ||
									row.firstStatus == 7
								action.hide = !show
								return action
							},
						},
					],
				},
			],
		}
	},
	computed: {
		...mapGetters(['getUserId', 'getSessionKey']),
		uploadHead() {
			// 上传文件请求头
			return {
				'X-AUTH-TOKEN': this.getSessionKey,
			}
		},
	},
	created() {
		this.getData106()
	},
	methods: {
		async getData106() {
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await selectReconciliationRecordById({
				type: 1,
				reconciliationRecordId: this.$route.params.reconciliationRecordId,
			})
			if (resultCode == 0) {
				this.itemInfo = resultData
				this.tableData106 = [resultData.reconciliationRecord]
			}
			this.loading = false
		},

		async exportReconciliationByBrandEndList(row) {
			const params = {
				reconciliationRecordId: this.$route.params.reconciliationRecordId,
			}
			let { data } = await exportReconciliationByBrandFirst(params)
			downloadFile(data, row.brandName + '首款对账单.xlsx')
		},
		async exportReconciliationDetailsEndList(row) {
			const params = {
				reconciliationRecordId: this.$route.params.reconciliationRecordId,
			}
			const { data } = await exportReconciliationDetails(params)
			downloadFile(data, row.brandName + '首款对账单明细.xlsx')
		},
	},
}
</script>
<style>
.mb20 {
	margin-bottom: 20px;
}
.ml20 {
	margin-left: 20px;
}
.save_button {
	position: fixed;
	bottom: 0;
	left: 280px;
	right: 0;
	padding: 20px 0px 20px 50px;
	background-color: #ccc;
	opacity: 0.8;
	z-index: 120;
}
.must {
	color: #ff4949;
	margin-right: 4px;
}
.w50 {
	width: 50px;
}
</style>

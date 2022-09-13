<template>
	<div>
		<el-dialog
			width="80%"
			class="supplier"
			title="操作记录"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			@close="closeForm"
		>
			<yx-table
				v-loading="loading"
				:columns="tableColumns"
				:pagination="page"
				:data="list"
			></yx-table>
		</el-dialog>
	</div>
</template>

<script>
import YxTable from '@wg-vue-materials/yx-table'
import { queryCompensationConfigRecord } from '@/api/supplyAmount'

export default {
	props: {},

	components: { YxTable },

	data() {
		return {
			list: [],
			loading: false,
			formDialog: false,
			tableColumns: [
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
					type: 'date',
					dataIndex: 'addTime',
					title: '操作时间',
				},
				{
					type: 'string',
					dataIndex: 'operatorName',
					title: '操作人',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getList()
				},
			},
			recordId: '',
		}
	},

	methods: {
		// 回显
		detail(row) {
			this.form = row
			this.recordId = row.id
			this.localVisible = true
			this.getList(true)
		},

		// 关闭弹窗
		closeForm() {
			this.localVisible = false
			this.list = []
			this.$refs.form.$refs.YxForm.resetFields()
		},

		// 查看
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = {
				// pageSize: this.page.length,
				// pageNum: this.page.currentPage,
				supplierCompensationConfigId: this.recordId,
			}

			return paramJson
		},
		async getList(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			let {
				data: { resultCode, resultData },
			} = await queryCompensationConfigRecord(paramJson)
			this.loading = false
			if (resultCode === 0) {
				this.list = resultData
				// this.page.count = resultData.total
				// this.page.currentPage = resultData.currentPage
				this.loading = false
			} else {
				this.loading = false
				// this.page.count = 0
				this.list = []
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.supplier {
	max-height: 80%;
	overflow-y: auto;
}
</style>

<template>
	<div>
		<el-dialog
			width="60%"
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
import { updateProportionRecord } from '@/api/deduction'

export default {
	props: {},

	components: { YxTable },

	data() {
		return {
			list: [],
			loading: false,
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'operationType',
					title: '操作',
					customRender: (row) => {
						return row.operationType == 1
							? '调整默认分佣比例'
							: row.operationType == 2
							? '启用'
							: row.operationType == 3
							? '禁用'
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'updateDetail',
					title: '详情',
					customRender: (row) => {
						return row.operationType == 1
							? '调整为' + row.updateDetail
							: row.updateDetail
					},
				},
				{
					type: 'date',
					dataIndex: 'operationTime',
					title: '操作时间',
				},
				{
					type: 'string',
					dataIndex: 'operationName',
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
			this.recordId = row.supplierDeductionWhitelistId
			this.localVisible = true
			this.getList(true)
		},

		// 关闭弹窗
		closeForm() {
			this.localVisible = false
			this.list = []
			//重置页面不能把操作重置
			this.page.count = 0
			this.page.length = 10
			this.page.currentPage = 1
		},

		// 查看
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
				supplierDeductionWhitelistId: this.recordId,
			}
			return paramJson
		},
		async getList(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			let {
				data: { resultCode, resultData },
			} = await updateProportionRecord(paramJson)
			this.loading = false
			if (resultCode === 0) {
				this.list = resultData.recordList
				this.page.count = resultData.count
				this.loading = false
			} else {
				this.loading = false
				this.page.count = 0
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

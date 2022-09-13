<template>
	<div>
		<el-dialog
			width="60%"
			class="supplier"
			title="查看详情"
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
import { getOperationListByRecordId } from '@/api/accountService'
export default {
	props: {},

	components: { YxTable },

	data() {
		return {
			list: [],
			loading: false,
			tableColumns: [
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '时间',
				},
				{
					type: 'string',
					dataIndex: 'operatorName',
					title: '操作人',
				},
				{
					type: 'string',
					dataIndex: 'changeTaskStatus',
					title: '操作',
					customRender: (row) => {
						return row.changeTaskStatus == 1
							? '已完成'
							: row.changeTaskStatus == 0
							? '未完成'
							: '-'
					},
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
			this.recordId = row.platformTaskRecordId || 56
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
				// length: this.page.length,
				// startIndex: (this.page.currentPage - 1) * this.page.length,
				pageSize: this.page.length,
				pageNum: this.page.currentPage,
				platformTaskRecordId: this.recordId,
			}
			return paramJson
		},
		async getList(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			let {
				data: { resultCode, resultData, total },
			} = await getOperationListByRecordId(paramJson)
			this.loading = false
			if (resultCode === 0) {
				this.list = resultData || []
				this.page.count = total
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

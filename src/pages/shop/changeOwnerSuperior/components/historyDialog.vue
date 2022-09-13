<template>
	<div>
		<el-dialog
			width="850px"
			title="查看详情"
			append-to-body
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="init"
			@close="resetIt"
		>
			<yx-table
				v-loading="loading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			>
			</yx-table>
		</el-dialog>
	</div>
</template>

<script>
import YxTable from '@wg-vue-materials/yx-table'
import { relationLog } from '@/api/relation'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxTable,
	},

	data() {
		return {
			loading: false,
			tableData: [],
			tableColumns: [
				{
					type: 'date',
					dataIndex: 'optTime',
					title: '时间',
				},
				{
					dataIndex: 'optUser',
					title: '操作人',
				},
				{
					dataIndex: 'stateDesc',
					title: '类型',
				},
				{
					dataIndex: 'remark',
					title: '备注',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			funAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init()
					},
				},
			],
		}
	},

	computed: {
		localVisible: {
			get() {
				return this.visible
			},
			set(val) {
				this.$emit('update:visible', val)
			},
		},
	},
	methods: {
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = {
				requestNo: this.itemInfo.requestNo,
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			}
			return paramJson
		},
		resetIt() {
			this.tableData = []
		},
		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const {
				data: { resultCode, resultData = [] },
			} = await relationLog(paramJson)
			this.loading = false

			if (resultCode == 0 && resultData.length > 0) {
				this.tableData = resultData
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},

		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},
	},
}
</script>

<style lang="scss" scoped>
.btn {
	text-align: right;
}
</style>

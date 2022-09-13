<template>
	<div>
		<el-dialog
			width="850px"
			title="借支业务"
			:inline="true"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="open"
		>
			<yx-table
				v-loading="showLoading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			></yx-table>
			<h1 class="h1-title">偿还业务</h1>
			<yx-table
				v-loading="showLoadingTurn"
				:columns="tableColumnsTurn"
				:pagination="pageTurn"
				:data="tableDataTurn"
			></yx-table>
		</el-dialog>
	</div>
</template>

<script>
import YxTable from '@wg-vue-materials/yx-table'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		YxTable,
	},

	data() {
		return {
			showLoadingTurn: false,
			showLoading: false,
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'borrowingRecordId',
					title: '业务id',
				},
				{
					type: 'string',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'string',
					dataIndex: 'amount',
					title: '借出金额',
				},
				{
					type: 'string',
					dataIndex: 'repayAmount',
					title: '归还金额',
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '状态',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getData()
				},
			},
			tableColumnsTurn: [
				{
					type: 'string',
					dataIndex: 'repayRecordId',
					title: '偿还业务id',
				},
				{
					type: 'string',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'string',
					dataIndex: 'amount',
					title: '偿还金额',
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '业务状态',
				},
			],
			pageTurn: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getDataTurn()
				},
			},
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
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},
		async _getData() {
			// this.showLoading = true
			// let paramJson = this.findSearchParams(flag)
			// let {
			// 	data: { resultCode, resultData },
			// } = await getGoodsGroupList(paramJson)
			// this.showLoading = false
			// if (resultCode == 0) {
			// 	this.tableData = resultData.records
			// 	this.page.count = resultData.total
			// } else {
			// 	this.page.count = 0
			// 	this.tableData = []
			// }
		},
		async _getDataTurn() {
			// this.showLoadingTurn = true
			// let paramJson = this.findSearchParams(flag)
			// let {
			// 	data: { resultCode, resultData },
			// } = await getGoodsGroupList(paramJson)
			// this.showLoadingTurn = false
			// if (resultCode == 0) {
			// 	this.tableData = resultData.records
			// 	this.page.count = resultData.total
			// } else {
			// 	this.page.count = 0
			// 	this.tableData = []
			// }
		},
		open() {
			this._getData()
		},
	},
}
</script>

<style lang="scss" scoped>
.h1-title {
	font-size: 15px;
}
</style>

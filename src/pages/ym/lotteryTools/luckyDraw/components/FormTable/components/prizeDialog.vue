<template>
	<div>
		<el-dialog
			width="60%"
			title="选择奖品"
			append-to-body
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<yx-table
				v-loading="loading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			>
			</yx-table>
			<div class="btn">
				<el-button type="primary" @click="save">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import YxTable from '@wg-vue-materials/yx-table'
import { prizeListWithFilter } from '@/api/lotteryTools'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		itemInfo: {
			type: Array,
			default: () => [],
		},
	},

	components: {
		// YxForm,
		YxTable,
	},

	data() {
		return {
			selectPrize: {},
			rowData: [],
			isAdd: 0,
			loading: false,
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'prizeName',
					title: '奖品名称',
				},
				{
					type: 'action',
					dataIndex: 'add',
					title: '操作',
					actions: [
						{
							title: '选择',
							click: (row) => {
								this.editList(row)
							},
							customRender: (action, row) => {
								action.title =
									this.selectPrize.prizeSettingId == row.prizeSettingId
										? '已选'
										: '选择'
								action.type =
									this.selectPrize.prizeSettingId == row.prizeSettingId
										? 'success'
										: ''
								return action
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
					this._prizeListWithFilter()
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

	watch: {
		localVisible(val) {
			if (val) {
				this.selectPrize = JSON.parse(JSON.stringify(this.itemInfo))
				this._prizeListWithFilter(true)
			}
		},
	},

	created() {
		this._prizeListWithFilter(true)
	},

	methods: {
		// 搜索条件
		findSearchParams(flag) {
			let paramJson = {
				length: 1,
				startIndex: 0,
			}
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		//获取奖品列表
		async _prizeListWithFilter(flag) {
			const paramJson = this.findSearchParams(flag)
			const { data = {} } = await prizeListWithFilter(paramJson)
			if (data.resultCode == 0) {
				this.tableData = data.resultData?.prizeList || []
				this.page.count = data.resultData?.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		resetForm() {
			this.localVisible = false
		},
		save() {
			this.$emit('fatherMethodInit', this.selectPrize)
			this.localVisible = false
		},
		editList(row) {
			// 添加/移除
			this.selectPrize = row
		},
	},
}
</script>

<style lang="scss" scoped>
.btn {
	text-align: right;
}
</style>

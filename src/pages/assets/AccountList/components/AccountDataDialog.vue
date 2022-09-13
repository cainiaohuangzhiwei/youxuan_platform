<template>
	<div>
		<el-dialog
			width="850px"
			title="操作记录"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			@open="open"
		>
			<yx-table
				v-loading="loading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			/>
		</el-dialog>
	</div>
</template>

<script>
import YxTable from '@wg-vue-materials/yx-table'
import { findBankAccountRecord } from '@/api/yhtPlusCmsFinance'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		dataBankAccountId: {
			type: String,
			default: '',
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
					type: 'string',
					dataIndex: 'operationName',
					title: '操作人',
				},
				{
					type: 'string',
					dataIndex: 'recordDetail',
					title: '操作详情',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '操作时间',
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
		open() {
			this.init()
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(
				{},
				{
					startIndex: 0,
					length: 1,
					bankAccountId: this.dataBankAccountId,
				}
			)
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		// 获取银行列表
		async init() {
			this.loading = true
			let paramJson = this.findSearchParams()
			const res = await findBankAccountRecord(paramJson)
			const { count = 0, list = [] } = res.data.resultData
			this.loading = false
			if (list.length > 0) {
				this.tableData = list
				this.page.count = count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},

		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.rowData = {}
		},
	},
}
</script>

<style lang="scss" scoped>
.btn {
	text-align: right;
}
</style>

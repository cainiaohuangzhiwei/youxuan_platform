<template>
	<yx-dialog title="操作记录" :bottomBtn="bottomBtn" :visible.sync="visible">
		<yx-table
			v-loading="showLoading"
			:columns="tableColumns"
			:pagination="page"
			:data="tableData"
		></yx-table>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxTable from '@wg-vue-materials/yx-table'
import { operationalLogsList } from '@/api/yhtPlusOperationalLogs'
export default {
	components: {
		YxDialog,
		YxTable,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		// 操作记录类型,1店主身份提现路由，2限额提现路由
		objects: {
			type: String,
			default: 'updateAmount',
		},
	},
	data() {
		return {
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.visible = false
					},
				},
			],
			visible: false,
			showLoading: false,
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'userName',
					title: '操作人',
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '操作时间',
				},
				{
					type: 'string',
					dataIndex: 'event',
					title: '操作事件',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._operationalLogsList()
				},
			},
		}
	},
	methods: {
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(
				{ withdrawalConfigObject: this.objects },
				{
					startIndex: 0,
					length: 1,
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
		_operationalLogsList: async function (flag) {
			// 获取列表数据
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await operationalLogsList(paramJson)
			if (resultCode == 0) {
				this.page.count = resultData.count
				this.tableData = resultData.operationalLogList
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
		},
		dialogVisible(newVlaue) {
			this.visible = newVlaue
			this.tableData = []
			this._operationalLogsList(true)
		},
	},
}
</script>

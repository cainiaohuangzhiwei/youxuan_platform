<template>
	<basic-container>
		<div>
			<yx-form :inline="true" :formAction="oneformAction"></yx-form>
			<el-row>
				<yx-table
					:columns="tableColumns"
					:data="tableData"
					:pagination="page"
					:actionInline="true"
					v-loading="tableLoading"
				>
				</yx-table>
			</el-row>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import { downloadFile } from '@/utils/helper/common'
import { winnerList, winnerExport } from '@/api/lotteryTools'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			params: this.$route.params,
			tableData: [],
			tableLoading: false,
			oneformAction: [
				{
					title: '导出EXCEL',
					type: 'primary',
					click: () => {
						this.$confirm('确定导出中奖名单列表？', '提示', {
							type: 'success',
							callback: async (action) => {
								if (action === 'confirm') {
									let paramJson = { lotteryActivityId: this.params.id }
									const { data } = await winnerExport(paramJson)
									if (data) {
										downloadFile(data, '导出中奖名单列表.xlsx')
									}
								}
							},
						})
					},
				},
			],
			tableColumns: [
				{
					width: 80,
					dataIndex: 'index',
					title: '序号',
				},
				{
					dataIndex: 'weixinUserName',
					title: '获奖人微信昵称',
				},
				{
					width: 130,
					dataIndex: 'openId',
					title: '获奖人微信openID',
				},
				{
					width: 140,
					dataIndex: 'prizeTime',
					title: '中奖时间',
					customRender: (row) => {
						return moment(row.prizeTime).format('YYYY-MM-DD HH:mm:ss')
					},
				},
				{
					dataIndex: 'lotteryActivityName',
					title: '抽奖活动名称',
				},
				{
					width: 100,
					dataIndex: 'userName',
					title: '姓名',
					customRender: (row) => {
						return row.userName || '-'
					},
				},
				{
					width: 100,
					dataIndex: 'telNumber',
					title: '电话',
					customRender: (row) => {
						return row.telNumber || '-'
					},
				},
				{
					dataIndex: 'address',
					title: '地址',
					customRender: (row) => {
						return row.address || '-'
					},
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getWinnerList()
				},
			},
		}
	},
	created() {
		this.getWinnerList(true)
	},
	methods: {
		async getWinnerList(flag) {
			this.tableLoading = true
			let paramJson = {
				lotteryActivityId: this.params.id,
				startIndex: 0,
				length: 10,
			}
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			let { data } = await winnerList(paramJson)
			this.tableLoading = false
			if (data.resultCode == 0) {
				this.tableData = data.resultData?.list || []
				this.tableData.forEach((item, index) => {
					item.index = (this.page.currentPage - 1) * 10 + index + 1
				})
				this.page.count = data.resultData?.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>

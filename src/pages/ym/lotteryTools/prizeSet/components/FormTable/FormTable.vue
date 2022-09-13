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
					<template slot="action" slot-scope="scope">
						<el-button
							type="text"
							size="small"
							:disabled="new Date().getTime() > scope.row.prizeEndTime"
							@click="addPrize(scope.row)"
							>编辑</el-button
						>
					</template>
				</yx-table>
			</el-row>
			<EditDialog
				ref="form"
				:title="EditDialogTitle"
				:visible.sync="dialogVisible"
				:row="editItem"
				:dialogState="dialogState"
				@initTable="_queryPrizeList"
			/>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import EditDialog from './components/EditDialog'

import { queryPrizeList } from '@/api/lotteryTools'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		EditDialog,
	},
	name: 'FormTable',

	data() {
		return {
			editItem: {},
			dialogVisible: false,
			dialogState: false,
			tableData: [],
			tableLoading: false,
			oneformAction: [
				{
					title: '新建奖品',
					type: 'primary',
					click: () => {
						this.addPrize()
					},
				},
			],
			tableColumns: [
				{
					dataIndex: 'prizeName',
					title: '奖品名称',
				},
				{
					width: 80,
					dataIndex: 'prizeSettingId',
					title: '奖品ID',
				},
				{
					dataIndex: 'addTime',
					title: '创建时间',
					customRender: (row) => {
						return moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
					},
				},
				{
					dataIndex: 'prizeStartTime',
					title: '开始时间',
					customRender: (row) => {
						return moment(row.prizeStartTime).format('YYYY-MM-DD HH:mm:ss')
					},
				},
				{
					dataIndex: 'prizeEndTime',
					title: '结束时间',
					customRender: (row) => {
						return moment(row.prizeEndTime).format('YYYY-MM-DD HH:mm:ss')
					},
				},
				{
					dataIndex: 'operatorId',
					title: '创建人ID',
					width: 80,
				},
				{
					dataIndex: 'prizeNumber',
					title: '奖品数量',
					width: 80,
				},
				{
					type: 'custom',
					dataIndex: 'action',
					width: '150',
					title: '操作',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._queryPrizeList()
				},
			},
		}
	},
	created() {
		this._queryPrizeList()
	},
	methods: {
		async _queryPrizeList(flag) {
			this.tableLoading = true
			//搜索条件
			let paramJson = {
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
			let { data } = await queryPrizeList(paramJson)
			this.tableLoading = false
			if (data.resultCode == 0) {
				this.tableData = data.resultData?.prizeList || []
				this.page.count = data.resultData?.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		async addPrize(row) {
			// 新建奖品
			if (row && row.prizeSettingId) {
				// 编辑奖品
				this.EditDialogTitle = '编辑奖品'
				this.editItem = row
			} else {
				this.EditDialogTitle = '新建奖品'
				this.editItem = {}
			}
			this.dialogVisible = true
			this.dialogState = true
		},
	},
}
</script>

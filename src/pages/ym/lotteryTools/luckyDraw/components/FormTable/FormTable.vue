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
							@click="goToWinningListPage(scope.row)"
							>数据</el-button
						>
						<!-- <el-button
							type="text"
							size="small"
							v-show="scope.row.lotteryState != 0"
							:disabled="scope.row.lotteryState != 1"
							@click="disabledActive(scope.row)"
							>禁用</el-button
						> -->
						<el-button
							type="text"
							size="small"
							v-show="new Date().getTime() >= scope.row.startTime"
							:disabled="scope.row.lotteryState != 0"
							@click="openActive(scope.row)"
							>启用</el-button
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
				@initTable="_getLotteryList"
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
import { getLotteryList, setLottery, getProgress } from '@/api/lotteryTools'
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
					title: '新建抽奖',
					type: 'primary',
					click: () => {
						this.addLuckyDraw()
					},
				},
			],
			tableColumns: [
				{
					dataIndex: 'lotteryActivityName',
					title: '活动名称',
				},
				{
					width: 80,
					dataIndex: 'lotteryActivityId',
					title: '活动ID',
				},
				{
					dataIndex: 'addTime',
					title: '创建时间',
					width: 140,
					customRender: (row) => {
						return moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
					},
				},
				{
					dataIndex: 'startTime',
					title: '开始时间',
					width: 140,
					customRender: (row) => {
						return moment(row.startTime).format('YYYY-MM-DD HH:mm:ss')
					},
				},
				{
					dataIndex: 'endTime',
					title: '结束时间',
					width: 140,
					customRender: (row) => {
						return moment(row.endTime).format('YYYY-MM-DD HH:mm:ss')
					},
				},
				{
					width: 100,
					dataIndex: 'operatorId',
					title: '创建人id',
				},
				{
					dataIndex: 'associatedActivityName',
					title: '关联活动',
				},
				{
					width: 80,
					dataIndex: 'lotteryState',
					title: '活动状态',
					customRender: (row) => {
						//0:未开始， 1:进行中， 2-已结束,3-已禁用
						const lotteryStateList = ['未开始', '进行中', '已结束', '已禁用']
						return lotteryStateList[row.lotteryState] || '-'
					},
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
					this._getLotteryList()
				},
			},
		}
	},
	created() {
		this._getLotteryList()
	},
	methods: {
		//查询抽奖活动列表
		async _getLotteryList(flag) {
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
			let { data } = await getLotteryList(paramJson)
			this.tableLoading = false
			if (data.resultCode == 0) {
				this.tableData = data.resultData?.list || []
				this.page.count = data.resultData?.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		//查询是否存在启动中的抽奖活动
		async _getProgress(item) {
			this.tableLoading = true
			// 每页的加载数据长度
			let { data } = await getProgress({
				livePlanId: item.associatedActivityId,
			})
			this.tableLoading = false
			if (data.resultCode == 0) {
				return data.resultData?.lotteryActivityId ? true : false
			}
		},
		//禁用/启用抽奖活动
		async _setLottery(row, state, disableLotteryActivityId) {
			this.tableLoading = true
			let param = {
				lotteryActivityId: row.lotteryActivityId,
				state: state,
				livePlanId: row.associatedActivityId,
				disableLotteryActivityId: disableLotteryActivityId || '', //启用新抽奖活动时需要禁用之前已启用的抽奖活动id
			}
			let { data } = await setLottery(param)
			this.tableLoading = false
			if (data.resultCode == 0) {
				this.$message.success('操作成功')
				this._getLotteryList()
			}
		},
		//新建抽奖活动
		async addLuckyDraw() {
			this.EditDialogTitle = '新建抽奖'
			this.editItem = {}
			this.dialogVisible = true
			this.dialogState = true
		},
		//启用活动
		openActive(row) {
			if (row.lotteryState == 1) {
				this.$message({
					type: 'info',
					message: '当前活动已启用，无需重复启用！',
				})
				return
			}
			this.tableLoading = true
			getProgress({
				livePlanId: row.associatedActivityId,
			}).then(({ data }) => {
				this.tableLoading = false
				let lotteryActivityId = ''
				let msg = '确认要启用当前抽奖活动吗？启用后当前抽奖活动会在直播间展示！'
				if (
					data.resultCode == 0 &&
					data.resultData?.lotteryActivityId &&
					row.associatedActivityId
				) {
					lotteryActivityId = data.resultData.lotteryActivityId
					msg =
						'当前已经有抽奖活动被启用，是否要放弃之前的活动，开启当前的直播活动？'
				}
				this.$confirm(msg, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						this._setLottery(row, 1, lotteryActivityId)
					})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '已取消',
						})
					})
			})
		},
		//禁用活动
		disabledActive(row) {
			this.$confirm(
				'确认要禁用当前抽奖活动吗？禁用后当前抽奖活动将不会在直播间展示！',
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			)
				.then(() => {
					this._setLottery(row, 0)
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消',
					})
				})
		},
		//跳转至中奖名单列表
		goToWinningListPage(row) {
			this.$router.push({
				path: 'winningList/' + row.lotteryActivityId,
				params: row,
			})
		},
	},
}
</script>

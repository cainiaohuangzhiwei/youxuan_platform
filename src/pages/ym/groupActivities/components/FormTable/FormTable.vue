<template>
	<basic-container>
		<div>
			<div style="display: contents">
				<span
					>共
					<label style="font-weight: 700; color: #0000bf">{{
						page.count
					}}</label>
					个活动</span
				>
				<el-button style="margin-left: 50px" type="text" @click="_copy"
					>复制活动看板链接</el-button
				>
			</div>
			<yx-form
				style="float: right"
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			>
				<template slot="activityName">
					<div class="w300_mb20">
						<el-input
							placeholder="请输入活动名称进行搜索"
							v-model="searchData.activityName"
							class="input-with-select"
						>
							<el-button
								slot="append"
								icon="el-icon-search"
								@click="_receiveCouponCenterList"
							></el-button>
						</el-input>
					</div>
				</template>
			</yx-form>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
					<template slot="activityStatusDesc" slot-scope="scope">
						<div :class="saleStateCom(scope.row, 1)"></div>
					</template>
					<template slot="operator" slot-scope="scope">
						<div>{{ scope.row.operator }}</div>
						<div>
							{{ moment(scope.row.operatorTime).format('YYYY-MM-DD HH:mm') }}
						</div>
					</template>
				</yx-table>
			</el-row>
			<Dialog
				title="活动详情"
				:visible="particularsDialog"
				:bottomBtn="particularsBtn"
				@before-close="particularsDialog = false"
			>
				<div class="w300_mb20">
					<el-input
						placeholder="请输入店铺ID或店铺名称进行搜索"
						v-model="search"
						class="input-with-select"
					>
						<el-button
							slot="append"
							icon="el-icon-search"
							@click="_organizationStatistics"
						></el-button>
					</el-input>
				</div>
				<yx-table
					v-loading="particularsLoading"
					:columns="particularsTable"
					:pagination="particularsPpage"
					:data="particularsData"
				></yx-table>
			</Dialog>
			<Dialog
				title="活动明细"
				:visible="detailDialog"
				:bottomBtn="detailBtn"
				@before-close="detailDialog = false"
			>
				<yx-table
					:spanMethod="spanMethod"
					v-loading="detailLoading"
					:columns="detailTable"
					:pagination="detailPpage"
					:data="detailData"
				>
					<template slot="groupBuyingDetailSn" slot-scope="scope">
						<div style="color: #0000ff">
							{{ scope.row.groupBuyingDetailSn }}
						</div>
					</template>
					<template slot="groupStatus" slot-scope="scope">
						<div :class="saleStateCom(scope.row, 2)"></div>
						<div style="color: #b0b0b0">
							{{
								scope.row.groupStatus == 4
									? moment(scope.row.groupSuccessTime).format(
											'YYYY-MM-DD HH:mm'
									  )
									: scope.row.groupStatus == 3
									? '还差' + scope.row.leftPosition + '人'
									: scope.row.groupStatus == 5
									? scope.row.groupFailReason
									: '-'
							}}
						</div>
					</template>
					<template slot="orderSn" slot-scope="scope">
						<router-link :to="`/business/orderDetails/${scope.row.orderId}`"
							><el-button type="text">{{
								scope.row.orderSn
							}}</el-button></router-link
						>
					</template>
				</yx-table>
			</Dialog>
			<EditDialog
				ref="form"
				class="wid"
				:title="EditDialogTitle"
				:visible.sync="editDialog"
				:row="row"
				:echo="echo"
				:dialogState="dialogState"
				@initTable="_receiveCouponCenterList"
			/>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import {
	groupBuyingList,
	detailCreate,
	cancelActivity,
	organizationDetail,
	organizationStatistics,
} from '@/api/groupbuying'
import EditDialog from './components/EditDialog'
import Dialog from '@/components/Dialog'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		EditDialog,
		Dialog,
	},
	name: 'FormTable',

	data() {
		return {
			moment,
			echo: {},
			row: {},
			spanArr: [],
			dialogState: 0,
			particularsDialog: false,
			particularsLoading: false,
			detailDialog: false,
			detailLoading: false,
			state: '',
			showLoading: false,
			search: '',
			searchData: {
				activityName: '', // 名称
				activityStatus: '', // 状态
			},
			editDialog: false,
			EditDialogTitle: '',
			particularsBtn: [],
			searchCfg: [
				{
					type: 'select',
					dataIndex: 'activityStatus',
					placeholder: '活动状态',
					label: 'value',
					options: this.$store.state.app.constant.GROUP_ACTIVITIES_STATUS,
					change: () => {
						this._receiveCouponCenterList(true)
					},
				},
				{
					type: 'custom',
					placeholder: '请输入活动名称进行搜索',
					dataIndex: 'activityName',
				},
			],
			searchAction: [
				{
					title: '新增活动',
					auth: 'groupBuyingCreate',
					type: 'primary',
					click: () => {
						this.EditDialogTitle = '新增活动'
						this.row = {}
						this.editDialog = true
						this.dialogState = 1
					},
				},
			],
			detailData: [],
			detailTable: [
				{
					type: 'custom',
					dataIndex: 'groupBuyingDetailSn',
					title: '团ID',
				},
				{
					type: 'custom',
					dataIndex: 'groupStatus',
					title: '团状态',
				},
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '订单号',
				},
				{
					type: 'string',
					dataIndex: 'orderSaleScore',
					title: '销售分',
				},
				{
					type: 'string',
					dataIndex: 'rewardAmount',
					title: '奖励',
				},
			],
			particularsData: [],
			particularsTable: [
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: '店铺id',
				},
				{
					type: 'string',
					dataIndex: 'organizationName',
					title: '店铺名称',
				},
				{
					type: 'string',
					dataIndex: 'finishGroupCount',
					title: '成团数',
				},
				{
					type: 'string',
					dataIndex: 'waitGroupCount',
					title: '待成团数',
				},
				{
					type: 'string',
					dataIndex: 'orderCount',
					title: '有效订单数',
				},
				{
					type: 'string',
					dataIndex: 'reward',
					title: '奖励',
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '明细',
							auth: 'groupBuyingOrganizationDetail',
							click: (row) => {
								this.detailDialog = true
								this._organizationDetail(row)
							},
						},
					],
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'activityId',
					title: 'ID',
				},
				{
					type: 'string',
					dataIndex: 'activityName',
					title: '活动名称',
				},
				{
					type: 'string',
					dataIndex: 'startTime',
					title: '活动时间',
					width: 300,
					customRender: (row) => {
						return row.startTime && row.endTime
							? moment(row.startTime).format('YYYY-MM-DD HH:mm') +
									'~' +
									moment(row.endTime).format('YYYY-MM-DD HH:mm')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'goodsCount',
					title: '活动商品数',
				},
				{
					type: 'string',
					dataIndex: 'finishGroupCount',
					title: '成团数',
				},
				{
					type: 'custom',
					dataIndex: 'activityStatusDesc',
					title: '活动状态',
				},
				{
					type: 'custom',
					dataIndex: 'operator',
					title: '最后操作人',
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '编辑',
							auth: '',
							click: (row) => {
								this.row = row
								this.EditDialogTitle = '编辑活动'
								this.editDialog = true
								this.dialogState = 2
								this.groupBuyingEdit()
							},
							customRender: (action, row) => {
								action.hide =
									row.activityStatusDesc == '已取消' ||
									row.activityStatusDesc == '已结束'
								return action
							},
						},
						{
							title: '详情',
							auth: 'groupBuyingOrganizationStatistics',
							click: (row) => {
								this.row = row
								this.search = ''
								this.particularsDialog = true
								this._organizationStatistics(true)
							},
							customRender: (action, row) => {
								action.hide = row.activityStatusDesc == '已取消'
								return action
							},
						},
						{
							title: '查看配置',
							auth: 'groupBuyingDetail',
							click: (row) => {
								this.row = row
								this.EditDialogTitle = '查看活动'
								this.editDialog = true
								this.dialogState = 3
								this.groupBuyingEdit()
							},
							customRender: (action, row) => {
								action.hide = row.activityStatusDesc != '已取消'
								return action
							},
						},
						{
							title: '复制链接',
							click: (row) => {
								this.$copyText(
									`/subpages/GroupBuying/GroupActiveDetail/GroupActiveDetail?groupBuyingActivityId=${row.activityId}`
								).then(() => {
									this.$message.success('复制成功')
								})
							},
							customRender: (action, row) => {
								action.hide = row.activityStatusDesc == '已取消'
								return action
							},
						},
						{
							title: '取消',
							auth: 'groupBuyingCancel',
							click: (row) => {
								let _this = this
								_this.$confirm('确定取消？', '提示', {
									type: 'warning',
									async callback(action) {
										if (action === 'confirm') {
											_this._cancelActivity(row.activityId)
										}
									},
								})
							},
							customRender: (action, row) => {
								action.hide = row.activityStatusDesc != '未开始'
								return action
							},
						},
					],
				},
			],
			detailPpage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._organizationDetail()
				},
			},
			particularsPpage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._organizationStatistics()
				},
			},
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._receiveCouponCenterList()
				},
			},
		}
	},

	mounted() {
		this._receiveCouponCenterList()
	},
	computed: {
		saleStateCom() {
			return function (row, v) {
				if (v == 1) {
					if (row.activityStatusDesc == '未开始') {
						return 'preSale'
					} else if (row.activityStatusDesc == '进行中') {
						return 'onSale'
					} else if (row.activityStatusDesc == '已结束') {
						return 'offSale'
					} else {
						return 'cancel'
					}
				} else {
					// 团状态：1：待支付；2：取消订单；3：待成团；4：成团成功；5：成团失败
					if (row.groupStatus == 1) {
						return 'unpaid'
					} else if (row.groupStatus == 2) {
						return 'cancel'
					} else if (row.groupStatus == 3) {
						return 'stay_together'
					} else if (row.groupStatus == 4) {
						return 'clouds_success'
					} else {
						return 'clouds_failure'
					}
				}
			}
		},
	},
	methods: {
		// 合并表格
		spanMethod({ row, columnIndex }) {
			if (columnIndex === 0 || columnIndex === 1 || columnIndex === 4) {
				return {
					rowspan: row.rowspan,
					colspan: row.colspan,
				}
			}
		},
		findSearchParamsStatistics(flag) {
			//搜索条件
			let paramJson = Object.assign(
				{},
				{
					startIndex: 0,
					length: 1,
					groupId: 2,
					currentPage: this.particularsPpage.currentPage,
				}
			)
			// 每页的加载数据长度
			paramJson.length = this.particularsPpage.length
			// 当前页的条数开始
			if (flag) {
				this.particularsPpage.currentPage = 1
			}

			paramJson.startIndex =
				(this.particularsPpage.currentPage - 1) * this.particularsPpage.length
			paramJson.search = this.search
			return paramJson
		},
		//活动详情
		async _organizationStatistics(flag) {
			this.particularsLoading = true
			let paramJson = this.findSearchParamsStatistics(flag)
			paramJson.groupBuyingActivitySn = this.row.groupBuyingActivitySn
			let {
				data: { resultCode, resultData },
			} = await organizationStatistics(paramJson)
			this.particularsLoading = false
			if (resultCode == 0) {
				this.particularsData = resultData.records
				this.particularsPpage.count = resultData.total
			} else {
				this.particularsPpage.count = 0
				this.particularsData = []
			}
		},
		//活动明细
		async _organizationDetail(row) {
			let {
				data: { resultCode, resultData },
			} = await organizationDetail({
				organizationId: row.organizationId,
				groupBuyingActivitySn: row.groupBuyingActivitySn,
			})
			if (resultCode == 0) {
				this.detailData = []
				resultData.forEach((item) => {
					if (item.orderList && item.orderList.length) {
						item.orderList.forEach((v, i) => {
							const current = {
								groupBuyingDetailSn: item.groupBuyingDetailSn,
								groupStatus: item.groupStatus,
								rewardAmount: item.rewardAmount,
								groupFailReason: item.groupFailReason,
								leftPosition:
									Number(item.groupUserLimitCount) -
									Number(item.orderList.length),
								groupSuccessTime: item.groupSuccessTime,
								orderSn: v.orderSn,
								orderId: v.orderId,
								orderSaleScore: v.orderSaleScore,
								rowspan: i == 0 ? item.orderList.length : 0,
								colspan: i == 0 ? 1 : 0,
							}
							this.detailData.push(current)
						})
					}
				})
			}
		},
		async groupBuyingEdit() {
			let {
				data: { resultCode, resultData },
			} = await detailCreate({
				activityId: this.row.activityId,
			})
			if (resultCode == 0) {
				this.echo = resultData
				this.$nextTick(() => {
					this.$refs.form.detail(this.echo)
				})
			}
		},
		//复制
		_copy() {
			this.$copyText(
				`/subpages/GroupBuying/GroupActiveList/GroupActiveList`
			).then(() => {
				this.$message.success('复制成功')
			})
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
				groupId: 2,
				currentPage: this.page.currentPage,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		// 获取列表
		_receiveCouponCenterList: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await groupBuyingList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.records
				this.page.count = resultData.total
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		//取消
		_cancelActivity: async function (activityId) {
			let paramJson = {
				activityId,
			}
			let {
				data: { resultCode },
			} = await cancelActivity(paramJson)
			if (resultCode == 0) {
				this.$message.success('取消成功')
				this._receiveCouponCenterList()
			}
		},
	},
}
</script>
<style>
.el-select .el-input {
	width: 130px;
}
.input-with-select .el-input-group__prepend {
	background-color: #fff;
}
.w300_mb20 {
	width: 300px;
	margin-bottom: 20px;
}
.preSale {
	color: #d9001b;
}
.onSale {
	color: #70b603;
}
.offSale {
	color: #b0b0b0;
}
.cancel {
	color: #aaaaaa;
}
.unpaid {
	color: rgb(247, 186, 42);
}
.stay_together {
	color: #d9001b;
}
.clouds_success {
	color: #70b603;
}
.clouds_failure {
	color: #b0b0b0;
}
.clouds_failure:after {
	content: '拼团失败';
}
.clouds_success:after {
	content: '拼团成功';
}
.stay_together:after {
	content: '待成团';
}
.unpaid:after {
	content: '待支付';
}
.cancel:after {
	content: '已取消';
}
.preSale:after {
	content: '未开始';
}
.onSale:after {
	content: '进行中';
}
.offSale:after {
	content: '已结束';
}
.wid .el-dialog {
	margin-top: 20px !important;
	width: 1100px !important;
}
.wid .el-dialog__body {
	max-height: 100%;
}
</style>

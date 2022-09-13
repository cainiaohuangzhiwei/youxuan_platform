<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			>
				<template slot="datetimerBtn">
					<el-button type="text" @click="setDatetimerange(7)">近7天</el-button>
					<el-button type="text" @click="setDatetimerange(15)"
						>近15天</el-button
					>
					<el-button type="text" @click="setDatetimerange(30)"
						>近30天</el-button
					>
				</template> </yx-form
			><el-row>
				<div class="amount_box">
					转账金额<span>￥{{ numberFormat(transferAmountSum, 2) }}</span
					>元,笔数<span>{{ transferCount }}</span
					>笔
				</div>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
					<template slot="transferringAccount" slot-scope="scope">
						<div>
							<p>{{ scope.row.transferOutAccountName }}</p>
							<p>{{ scope.row.transferOutAccountId }}</p>
						</div>
					</template>
					<template slot="transferAccount" slot-scope="scope">
						<div>
							<p>{{ scope.row.transferInAccountName }}</p>
							<p>{{ scope.row.transferInAccountId }}</p>
						</div>
					</template>
				</yx-table>
			</el-row>
		</div>
		<orderTransferDetails
			:dialogVisible.sync="dialogVisible"
			:itemInfo="selectedItem"
		></orderTransferDetails>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import { getConstantValueByKey, numberFormat } from '@/utils/helper/common'
import YxTable from '@wg-vue-materials/yx-table'
import {
	fundOrderTransferList,
	retryMarketingToMerchant,
} from '@/api/accountService'
import orderTransferDetails from './components/orderTransferDetails'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		orderTransferDetails,
	},
	name: 'FormTable',

	data() {
		return {
			numberFormat: numberFormat,
			dialogVisible: false,
			selectedItem: {},
			showLoading: false,
			transferAmountSum: 0, // 转账金额
			transferCount: 0, // 笔数
			searchData: {
				transferInAccountName: '', // 转入账户名称
				businessSn: '', // 业务单号
				status: '', // 状态
				transferInAccountId: '', // 转入账户id
				transferOutAccountId: '', // 转出账户id
				type: '', // 类型
				addTimeStart: moment().startOf('day').valueOf(), // 开始时间
				addTimeEnd: moment().endOf('day').valueOf(), // 结束时间
			},
			orderStatus: [],
			searchCfg: [
				{
					type: 'input',
					title: '转入账户名称',
					dataIndex: 'transferInAccountName',
				},
				{
					type: 'input',
					title: '业务单号',
					dataIndex: 'businessSn',
				},
				{
					type: 'select',
					title: '状态',
					dataIndex: 'status',
					options: this.$store.state.app.constant.TRANSFER_STATUS,
					label: 'value',
				},
				{
					type: 'inputNumber',
					title: '转入账户id',
					dataIndex: 'transferInAccountId',
				},
				{
					type: 'inputNumber',
					title: '转出账户id',
					dataIndex: 'transferOutAccountId',
				},
				{
					type: 'select',
					title: '类型',
					dataIndex: 'type',
					options: this.$store.state.app.constant.TRANSFER_TYPE,
					label: 'value',
				},
				{
					title: '添加时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
				},
				{
					type: 'custom',
					dataIndex: 'datetimerBtn',
				},
			],
			searchAction: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._fundOrderTransferList(true)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'transferRecordId',
					title: '业务ID',
				},
				{
					type: 'string',
					dataIndex: 'businessSn',
					title: '关联业务单号',
				},
				{
					type: 'custom',
					dataIndex: 'transferringAccount',
					title: '转出账户名称账户ID',
				},
				{
					type: 'custom',
					dataIndex: 'transferAccount',
					title: '转入账户名称账户ID',
				},
				{
					type: 'string',
					dataIndex: 'transferInAccType',
					title: '账户类型',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.TRANSFER_IN_ACC_TYPE,
							row.transferInAccType,
							'-',
							'transferInAccType'
						)
					},
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'data',
					dataIndex: 'finishTime',
					title: '完成时间',
				},
				{
					type: 'string',
					dataIndex: 'amount',
					title: '转账金额',
					customRender: (row) => {
						return numberFormat(row.amount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'whetherReturn',
					title: '是否退款',
					customRender: (row) => {
						return row.whetherReturn ? '是' : '否'
					},
				},
				{
					type: 'string',
					dataIndex: 'type',
					title: '类型',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.TRANSFER_TYPE,
							row.type,
							'-',
							'type'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.TRANSFER_STATUS,
							row.status,
							'-',
							'status'
						)
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '查看详情',
							auth: 'fundTransferRefundList',
							click: (row) => {
								this.seeDetails(row)
							},
						},
						{
							title: '重新发起',
							auth: 'retryMarketingToMerchant',
							click: (row) => {
								this.relaunch(row)
							},
							customRender: (action, row) => {
								action.hide = row.status == 3
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
					this._fundOrderTransferList()
				},
			},
		}
	},

	created() {
		this._fundOrderTransferList(true)
	},

	methods: {
		relaunch(row) {
			// 重新发起
			this.$confirm(`确定重新发起？`, '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						let {
							data: { resultData, resultCode },
						} = await retryMarketingToMerchant({
							transferRecordId: row.transferRecordId,
						})
						if (resultCode == 0) {
							this.$message({
								message: getConstantValueByKey(
									this.$store.state.app.constant.TRANSFER_STATUS,
									resultData.status,
									'-',
									'status'
								),
								type: 'success',
								onClose: () => {
									this._fundOrderTransferList()
								},
							})
						}
					}
				},
			})
		},
		setDatetimerange(data) {
			// 设置添加时间段
			let startTime =
				moment().startOf('day').valueOf() - (data - 1) * 24 * 60 * 60 * 1000
			this.searchData.addTimeStart = startTime
		},
		seeDetails(row) {
			// 查看详情
			console.log(row)
			this.dialogVisible = true
			this.selectedItem = JSON.parse(JSON.stringify(row))
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(
				JSON.parse(JSON.stringify(this.searchData)),
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
		_fundOrderTransferList: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: {
					resultCode,
					resultData: {
						transferCount = 0,
						transferAmountSum = 0,
						recordList = [],
						totalCount = 0,
					},
				},
			} = await fundOrderTransferList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.transferCount = transferCount
				this.transferAmountSum = transferAmountSum
				this.tableData = recordList
				this.page.count = totalCount
			} else {
				this.page.count = 0
				this.transferCount = 0
				this.transferAmountSum = 0
				this.tableData = []
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.amount_box {
	margin: 20px 0;
	span {
		font-size: 26px;
		font-weight: bold;
	}
}
</style>

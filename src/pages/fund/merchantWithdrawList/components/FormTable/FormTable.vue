<template>
	<basic-container>
		<div>
			<yx-form
				v-loading="exportLoading"
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>
			<el-row>
				<YxAccounts v-auth="'sumMerchantAccountWithdraw'" :items="statistics" />
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
					<template slot="accountName" slot-scope="scope">
						<el-button
							v-if="supplierQueryAccountDetail"
							type="text"
							@click="goDetails(scope.row)"
							>{{ scope.row.accountName }}</el-button
						>
						<span v-else>{{ scope.row.accountName }}</span>
					</template>
				</yx-table>
			</el-row>
		</div>
		<!-- 提现信息弹框 -->
		<withdrawInformation
			:withdrawData.sync="withdrawData"
			:dialogVisible.sync="dialogVisible"
		></withdrawInformation>
	</basic-container>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import withdrawInformation from './components/withdrawInformation'
import YxAccounts from '@/components/Accounts/index'
import BasicContainer from '@wg-vue-materials/basic-container'
import {
	getMerchantAccountWithdrawList,
	sumMerchantAccountWithdraw,
	merchantWithdrawExport,
} from '@/api/yhtPlusCmsFinance'
import { downloadFile } from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		YxAccounts,
		withdrawInformation,
	},
	name: 'FormTable',

	data() {
		return {
			sumMerchantAccountWithdraw: checkFunctionCode(
				'sumMerchantAccountWithdraw'
			),
			getMerchantAccountWithdrawList: checkFunctionCode(
				'getMerchantAccountWithdrawList'
			),
			supplierQueryAccountDetail: checkFunctionCode(
				'supplierQueryAccountDetail'
			),
			exportLoading: false,
			showLoading: false,
			dialogVisible: false, // 提现信息弹框开关
			withdrawData: {}, // 提现信息
			searchData: {
				channel: '', // 通道
				status: '', //状态
				type: 12,
				finishTimeStart: '', //到账开始时间
				finishTimeEnd: '', //到账结束时间
				addTimeStart: moment().startOf('day').valueOf(), //发起开始时间
				addTimeEnd: moment().endOf('day').valueOf(), //发起结束时间
				accountName: '', // 商家名称
				WithdrawSn: '',
			},
			statistics: [
				{
					type: 'amount',
					title: '提现金额',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '手续费',
					value: '0.00',
				},
			],
			searchCfg: [
				{
					title: '商家名称',
					type: 'input',
					dataIndex: 'accountName',
				},
				{
					title: '状态',
					type: 'select',
					dataIndex: 'status',
					options: this.$store.state.app.constant.COMMON_WITHDRAW_STATUS,
					label: 'value',
				},
				{
					title: '通道',
					type: 'selectMap',
					dataIndex: 'channel',
					options: this.$store.state.app.constant.WITHDRAW_CHANNEL,
				},
				{
					title: '发起时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					title: '到账时间',
					type: 'datetimerange',
					dataIndex: ['finishTimeStart', 'finishTimeEnd'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					title: '提现单号',
					type: 'input',
					dataIndex: 'WithdrawSn',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: (e) => {
						this._getMerchantAccountWithdrawList(true, e)
					},
				},
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '导出',
					auth: 'merchantWithdrawExport',
					type: 'primary',
					click: () => {
						this.exportIt()
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'flowWithdrawId',
					title: '业务ID',
				},
				{
					type: 'string',
					dataIndex: 'accountId',
					title: '账户ID',
				},
				{
					type: 'custom',
					dataIndex: 'accountName',
					title: '账户名称',
				},
				{
					type: 'map',
					dataIndex: 'channel',
					title: '通道',
					options: {
						YJB: 1,
						HJ: 2,
						YL: 4,
						YB: 3,
						WGZF: 5,
						XZB: 6,
						SN: 7,
						其他: 0,
					},
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '发起时间',
				},
				{
					type: 'data',
					dataIndex: 'finishTime',
					title: '到账时间',
				},
				{
					type: 'amount',
					dataIndex: 'amount',
					title: '提现金额',
				},
				{
					type: 'amount',
					dataIndex: 'serviceCharge',
					title: '手续费',
				},
				// {
				// 	type: 'string',
				// 	dataIndex: 'remainder',
				// 	title: '剩余余额',
				// },
				{
					type: 'map',
					dataIndex: 'status',
					title: '状态',
					options: {
						提现中: 1,
						提现成功: 2,
						提现失败: 3,
						'T+1提现中': 4,
						提现异常: 6,
						等待回调中: 5,
					},
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '查看详情',
							auth: 'getMerchantBankAccountByFlowWithdrawId',
							click: (row) => {
								this.showWithdrawInformation(row)
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
					this._getMerchantAccountWithdrawList()
				},
			},
			gatewayEnable: false,
		}
	},

	mounted() {
		// this._withdrawSwitch( )
	},

	methods: {
		goDetails(row) {
			// 跳转详情
			this.$router.push({
				path: `merchantAccountDetails/${row.accountId}`,
			})
		},
		showWithdrawInformation(row) {
			// 设置提现信息
			this.dialogVisible = true
			this.withdrawData = row
		},
		async exportIt() {
			// 导出数据
			let paramJson = this.findSearchParams()
			this.exportLoading = true
			let { data } = await merchantWithdrawExport(paramJson)
			this.exportLoading = false
			downloadFile(data, 'excel.xls')
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
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
		_sumMerchantAccountWithdraw: async function (paramJson, custom) {
			if (!this.sumMerchantAccountWithdraw) return
			// 获取提现金额、手续费
			let {
				data: { resultCode, resultData },
			} = await sumMerchantAccountWithdraw(paramJson, custom)
			if (resultCode == 0) {
				this.statistics[0].value =
					resultData.flowWithdrawSumVo && resultData.flowWithdrawSumVo.amount
						? resultData.flowWithdrawSumVo.amount
						: 0
				this.statistics[1].value =
					resultData.flowWithdrawSumVo &&
					resultData.flowWithdrawSumVo.serviceCharge
						? resultData.flowWithdrawSumVo.serviceCharge
						: 0
			} else {
				this.statistics[0].value = 0
				this.statistics[1].value = 0
			}
		},
		_getMerchantAccountWithdrawList: async function (flag, e) {
			if (!this.getMerchantAccountWithdrawList) return
			let paramJson = JSON.parse(JSON.stringify(this.findSearchParams(flag)))
			paramJson.accountName = paramJson.accountName
				? paramJson.accountName + '%'
				: ''
			if (!paramJson.addTimeStart) {
				this.$message.warning('必须选择发起时间进行搜索')
				return
			}
			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			this.showLoading = true
			let {
				data: {
					resultCode,
					resultData: { count = 0, flowWithdrawVoDetail = [] },
				},
			} = await getMerchantAccountWithdrawList(paramJson, custom)
			console.log(flag, 'flag')
			if (flag) {
				this._sumMerchantAccountWithdraw(paramJson, custom)
			}
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = flowWithdrawVoDetail
				this.page.count = count
			} else {
				this.tableData = []
				this.page.count = 0
			}
		},
	},
}
</script>

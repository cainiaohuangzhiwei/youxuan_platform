<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>
			<el-row>
				<YxAccounts v-auth="'sumPlatformAccountWithdraw'" :items="statistics" />
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
					<template slot="accountName" slot-scope="scope">
						<el-button
							v-if="platformWeegetAccountDetail"
							@click="goDetails(scope.row.type)"
							type="text"
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
	getPlatformAccountWithdrawList,
	sumPlatformAccountWithdraw,
} from '@/api/yhtPlusCmsFinance'
import { numberFormat } from '@/utils/helper/common'
import moment from 'moment'
import { checkFunctionCode } from '@/utils/auth.js'
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
			platformWeegetAccountDetail: checkFunctionCode(
				'platformWeegetAccountDetail'
			),
			sumPlatformAccountWithdraw: checkFunctionCode(
				'sumPlatformAccountWithdraw'
			),
			getPlatformAccountWithdrawList: checkFunctionCode(
				'getPlatformAccountWithdrawList'
			),
			showLoading: false,
			dialogVisible: false, // 提现信息弹框开关
			withdrawData: {}, // 提现信息
			searchData: {
				channel: '', // 通道
				status: '', //状态
				type: 11,
				finishTimeStart: '', //到账开始时间
				finishTimeEnd: '', //到账结束时间
				addTimeStart: moment().startOf('day').valueOf(), //发起开始时间
				addTimeEnd: moment().endOf('day').valueOf(), //发起结束时间
				accountName: '', // 商家名称
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
					title: '状态',
					type: 'select',
					dataIndex: 'status',
					options: this.$store.state.app.constant.COMMON_WITHDRAW_STATUS,
					label: 'value',
				},
				{
					title: '提现账户',
					type: 'select',
					dataIndex: 'type',
					options: this.$store.state.app.constant.ACCOUNT_TYPE,
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
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: (e) => {
						this._getPlatformAccountWithdrawList(true, e)
					},
				},
				{
					title: '重置',
					isClear: true,
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
				// {
				// 	type: 'string',
				// 	dataIndex: 'accountId',
				// 	title: '账户ID',
				// },
				{
					type: 'custom',
					dataIndex: 'accountName',
					title: '账户名称',
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
					type: 'string',
					dataIndex: 'amount',
					title: '提现金额',
					customRender: (row) => {
						return '￥' + numberFormat(row.amount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'serviceCharge',
					title: '手续费',
					customRender: (row) => {
						return '￥' + numberFormat(row.serviceCharge, 2)
					},
				},
				// {
				// 	type: 'string',
				// 	dataIndex: 'remainder',
				// 	title: '剩余余额',
				// 	customRender: (row) => {
				// 		return '￥' + numberFormat(row.remainder, 2)
				// 	},
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
							auth: 'getPlatformBankAccountByFlowWithdrawId',
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
					this._getPlatformAccountWithdrawList()
				},
			},
		}
	},

	methods: {
		goDetails(type) {
			if (type == 11) {
				// 跳转详情
				this.$router.push({
					path: `platformAccountDetails/1`,
				})
			} else {
				this.$router.push({
					path: `promotionAccountDetails`,
				})
			}
		},
		showWithdrawInformation(row) {
			// 设置提现信息
			this.dialogVisible = true
			this.withdrawData = row
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
		_sumPlatformAccountWithdraw: async function (paramJson, custom) {
			if (!this.sumPlatformAccountWithdraw) return
			// 获取提现金额、手续费
			let {
				data: { resultCode, resultData },
			} = await sumPlatformAccountWithdraw(paramJson, custom)
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
				this.statistics[0].value = numberFormat(0, 2)
				this.statistics[1].value = numberFormat(0, 2)
			}
		},
		_getPlatformAccountWithdrawList: async function (flag, e) {
			if (!this.getPlatformAccountWithdrawList) return
			// 获取列表数据
			let paramJson = JSON.parse(JSON.stringify(this.findSearchParams(flag)))
			paramJson.accountName = paramJson.accountName
				? paramJson.accountName + '%'
				: ''
			if (!paramJson.addTimeStart) {
				this.$message.warning('必须选择提现发起时间进行搜索')
				return
			}
			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			this.showLoading = true
			if (flag) {
				this._sumPlatformAccountWithdraw(paramJson, custom)
			}
			let {
				data: { resultCode, resultData },
			} = await getPlatformAccountWithdrawList(paramJson, custom)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.flowWithdrawVoDetail || []
				this.page.count = resultData.count || 0
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>

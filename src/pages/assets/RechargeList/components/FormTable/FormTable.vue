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
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
				</yx-table>
			</el-row>
		</div>
		<recharge-dialog
			:visible.sync="showDialog"
			@updateList="init"
		></recharge-dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { findRechargeListByCondition } from '@/api/yhtPlusCmsFinance'
import { getConstantValueByKey } from '@/utils/helper/common'
import RechargeDialog from '../RechargeDialog'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		RechargeDialog,
	},
	name: 'FormTable',

	data() {
		return {
			showDialog: false,
			showLoading: false,
			searchData: {
				type: 0,
				keyWord: '', // 关键词
				addTimeStart: moment().startOf('month').valueOf(), // 开始时间
				addTimeEnd: moment().endOf('month').valueOf(), // 结束时间
			},
			searchCfg: [
				{
					type: 'select',
					title: '转账账户',
					dataIndex: 'type',
					label: 'value',
					options: this.$store.state.app.constant.RECHARGE_ACCOUNT_TYPE,
					change: () => {
						this.callFindRechargeListByCondition(true)
					},
				},
				{
					type: 'input',
					title: '关键词',
					dataIndex: 'keyWord',
					placeholder: '充值账户/经办人/审批人',
					enter: () => {
						this.callFindRechargeListByCondition(true)
					},
				},
				{
					title: '下单时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.callFindRechargeListByCondition(true)
					},
				},
				{
					title: '充值',
					type: 'primary',
					auth: 'addRechargeRecord',
					click: () => {
						this.showDialog = true
					},
				},
			],

			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'flowRechargeId',
					title: 'ID',
				},
				{
					dataIndex: 'addTime',
					title: '操作时间',
					type: 'date',
					width: '160',
				},
				{
					dataIndex: 'amount',
					title: '金额',
					type: 'amount',
				},
				{
					dataIndex: 'finishTime',
					title: '充值时间',
					type: 'date',
					width: '160',
				},
				{
					dataIndex: 'type',
					title: '充值账户',
					type: 'string',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.RECHARGE_ACCOUNT_TYPE,
							row.type,
							'-',
							'type'
						)
					},
				},
				{
					dataIndex: 'transferAccount',
					title: '转账账户',
					type: 'string',
				},
				{
					dataIndex: 'approvingPerson',
					title: '经办人',
					type: 'string',
				},
				{
					dataIndex: 'transactor',
					title: '审批人',
					type: 'string',
				},
				{
					dataIndex: 'refund',
					title: '退款金额',
					type: 'amount',
				},
				{
					dataIndex: 'remark',
					title: '备注',
					type: 'string',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.callFindRechargeListByCondition()
				},
			},
		}
	},

	methods: {
		init() {
			this.callFindRechargeListByCondition(true)
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
		callFindRechargeListByCondition: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData = {} },
			} = await findRechargeListByCondition(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.list || []
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>

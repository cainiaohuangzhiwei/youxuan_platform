/* eslint-disable no-unused-vars */
<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			>
				<template slot="merchantAccountId">
					<div>
						<el-input
							v-model="searchData.merchantAccountId"
							maxlength="10"
							oninput="if(value.length>10)value=value.slice(0,10)"
							type="number"
							placeholder="请输入内容"
						></el-input>
					</div>
				</template>
			</yx-form>

			<el-row>
				<yx-table
					:select="true"
					v-loading="loading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
					:selectionChange="selectionChange"
				></yx-table>
			</el-row>
		</div>
	</basic-container>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { numberFormat } from '@/utils/helper/common'
import { getConstantValueByKey } from '@/utils/helper/common'
import {
	supplierFrozenAccount,
	supplierQueryAccountList,
} from '@/api/supplierAccount'
import { fundSwitch } from '@/api/accountService'
import moment from 'moment'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			numberFormat: numberFormat,
			searchData: {
				supplierName: '', //账户名称
				merchantAccountId: '', //账户id
				status: '', //账户状态
				switchStatus: '', //资金系统开关
			},
			loading: false,
			selectionData: [],
			searchCfg: [
				{
					type: 'custom',
					title: '账户id',
					dataIndex: 'merchantAccountId',
				},
				// {
				// 	title: '账户id',
				// 	type: 'inputNumber',
				// 	dataIndex: 'merchantAccountId',
				// 	placeholder: '请输入账户id',
				// 	maxlength: 10,
				// 	change: () => {
				// 		this.init()
				// 	},
				// },
				{
					title: '账户名称',
					dataIndex: 'supplierName',
					placeholder: '请输入账户名称',
					change: () => {
						this.init()
					},
				},
				{
					type: 'select',
					title: '账户状态',
					dataIndex: 'status',
					label: 'value',
					options: this.$store.state.app.constant.MERCHANT_ACCOUNT_STATUS,
					change: () => {
						this.init()
					},
				},
				{
					type: 'select',
					title: '资金系统开关',
					dataIndex: 'switchStatus',
					label: 'value',
					options: this.$store.state.app.constant.FUNDINF_SYSTEM,
					change: () => {
						this.init()
					},
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
						this.init(true)
					},
				},
				{
					title: '批量开启资金系统',
					type: 'success',
					auth: 'fundSwitch',
					click: () => {
						this.batchCapitalSystem()
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					dataIndex: 'merchantAccountId',
					title: '商家账户id',
				},
				{
					dataIndex: 'addTime',
					title: '切换时间',
					customRender: (row) => {
						return row.addTime
							? moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					dataIndex: 'supplierId',
					title: '商家id',
				},
				{
					dataIndex: 'supplierName',
					title: '账户名称',
				},
				{
					dataIndex: 'settledAmount',
					title: '待结算账户',
					customRender: (row) => {
						return '￥' + numberFormat(row.settledAmount, 2)
					},
				},
				{
					dataIndex: 'availableAmount',
					title: '可用余额账户',
					customRender: (row) => {
						return '￥' + numberFormat(row.availableAmount, 2)
					},
				},
				// {
				// 	dataIndex: 'frozenAmount',
				// 	title: '可用余额账户冻结',
				// 	customRender: (row) => {
				// 		return '￥' + numberFormat(row.frozenAmount, 2)
				// 	},
				// },
				{
					dataIndex: 'frozenAmount',
					title: '提现冻结',
					customRender: (row) => {
						return '￥' + numberFormat(row.frozenAmount, 2)
					},
				},
				{
					dataIndex: 'borrowingLockBalance',
					title: '借支冻结',
					customRender: (row) => {
						return '￥' + numberFormat(row.borrowingLockBalance, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.MERCHANT_ACCOUNT_STATUS,
							row.status,
							'-',
							'status'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'switchStatus',
					title: '资金系统开关状态',
					customRender: (row) => {
						return row.switchStatus == 0
							? '关闭'
							: row.switchStatus == 1
							? '开启'
							: '-'
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '冻结',
							auth: 'supplierFrozenAccount',
							click: (row) => {
								this.freezeOrThaw(row)
							},
							customRender: (action, row) => {
								action.title = row.status == 1 ? '冻结' : '解冻'
								return action
							},
						},
						{
							title: '开启资金系统',
							auth: 'fundSwitch',
							customRender: (action, row) => {
								action.hide = row.switchStatus == 1
								return action
							},
							click: (row) => {
								this.openFundsSystem(row)
							},
						},
						{
							title: '查看详情',
							auth: 'supplierQueryAccountDetail',
							click: (row) => {
								this.$router.push({
									path: `merchantAccountDetails/${row.merchantAccountId}`,
								})
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
					this.init()
				},
			},
			trusteeshipStateMap: {
				0: '冻结',
				1: '解冻',
			},
			blockedAccountThaw: {
				0: '不可发起提现，请谨慎确认',
				1: '可发起提现',
			},
		}
	},

	created() {
		this.init(true)
	},

	methods: {
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			console.log('flag', flag)
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.searchData, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})

			return paramJson
		},
		//冻结or解冻
		freezeOrThaw(row) {
			const paramJson = Object.assign(
				{},
				{
					merchantAccountId: row.merchantAccountId,
					status: row.status == 1 ? 0 : 1,
				}
			)

			this.$confirm(
				`是否确认${this.trusteeshipStateMap[paramJson.status]}账户，${
					this.trusteeshipStateMap[paramJson.status]
				}后账户${this.blockedAccountThaw[paramJson.status]}！`,
				'提示',
				{
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							let {
								data: { resultMsg = '' },
							} = await supplierFrozenAccount(paramJson)
							this.$message.success(resultMsg)
							this.init()
						}
					},
				}
			)
		},
		//开启资金系统
		openFundsSystem(row) {
			const paramJson = Object.assign(
				{},
				{
					accountSwitchList: [
						{
							merchantAccountId: row.merchantAccountId,
							supplierId: row.supplierId,
						},
					],
				}
			)
			this.$confirm(`是否开启资金系统，一旦开启不可关闭！`, '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						let {
							data: { resultMsg = '', resultData },
						} = await fundSwitch(paramJson)
						if (resultData.failSupplierIds[0] != undefined) {
							this.$message({
								message: '资金系统开启失败:' + resultData.failSupplierIds[0],
								type: 'warning',
								duration: 5000,
							})
						} else {
							this.$message.success(resultMsg)
						}
						this.init()
					}
				},
			})
		},
		// 多选
		selectionChange(row) {
			this.selectionData = row
		},
		// 判断数组的数组是否全部为undefined
		// isAllEqual(array) {
		// 	if (array.length > 0) {
		// 		return !array.some(function (value) {
		//         console.log('value', value)
		// 			return value !== array[0]
		// 		})
		// 	} else {
		// 		return true
		// 	}
		// },

		//批量开启资金系统
		batchCapitalSystem() {
			let ids = []
			this.selectionData.map((item) => {
				if (item.switchStatus == 0) {
					ids.push({
						merchantAccountId: item.merchantAccountId,
						supplierId: item.supplierId,
					})
				}
			})
			if (ids.length == 0) {
				return this.$message.warning('请选择可操作的商家账户')
			}
			if (ids.length > 10) {
				return this.$message.warning('只能勾选10条商家账户进行操作')
			}
			// const idsArr = ids.filter((i) => i)
			const paramJson = Object.assign(
				{},
				{
					accountSwitchList: ids,
				}
			)
			this.$confirm(
				`确认要批量开启${ids.length}个商家资金系统吗？一旦开启不可关闭！`,
				'提示',
				{
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							let {
								data: { resultMsg = '', resultData },
							} = await fundSwitch(paramJson)
							if (resultData.failSupplierIds.length > 0) {
								console.log('1111')
								const idsArr = resultData.failSupplierIds.filter((i) => i)
								this.$message({
									message: '资金系统开启失败:' + idsArr,
									type: 'warning',
									duration: 5000,
								})
							} else {
								this.$message.success(resultMsg)
							}
							this.init(true)
						}
					},
				}
			)
		},
		// 商家账户列表
		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			let {
				data: {
					resultCode,
					resultData: { recordList = [], totalCount = 0 },
				},
			} = await supplierQueryAccountList(paramJson)
			if (resultCode == 0) {
				this.tableData = recordList
				this.page.count = totalCount
			} else {
				this.page.count = 0
				this.tableData = []
				this.loading = false
			}
		},
	},
}
</script>

<template>
	<basic-container>
		时间：
		<el-date-picker
			v-model="dataTime"
			style="margin-bottom: 20px"
			align="right"
			type="date"
			placeholder="选择日期"
			@change="_summaryList"
			:picker-options="pickerOptions"
		>
		</el-date-picker>

		<div>
			<el-button
				style="margin-bottom: 20px"
				type="primary"
				v-auth="'updateSummaryByCode'"
				@click="modifyBalance()"
				>修改余额</el-button
			>
		</div>
		<div>资金数据日期：{{ moment(dataTime).format('YYYY年MM月DD日') }}</div>
		<el-table
			:data="tableData182"
			show-summary
			:summary-method="getSummaries"
			style="width: 100%"
		>
			<el-table-column prop="channelName" label="通道名称"> </el-table-column>
			<el-table-column prop="mchName" label="商户名称"> </el-table-column
			><el-table-column prop="mchId" label="平台商户号"> </el-table-column
			><el-table-column prop="openingBalance" label="期初余额">
				<template slot-scope="scope">
					<div>
						{{ numberFormat(scope.row.openingBalance, 2) }}
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="withdrawalAmount" label="本期流出" width="150">
				<el-table-column prop="withdrawalAmount" label="提现" width="150">
					<template slot-scope="scope">
						<div class="cor">
							{{ numberFormat(scope.row.withdrawalAmount, 2) }}
						</div>
					</template>
				</el-table-column>
			</el-table-column>

			<el-table-column prop="outflowFeeAmount" label="本期流出" width="150">
				<el-table-column prop="outflowFeeAmount" label="手续费" width="150">
					<template slot-scope="scope">
						<div class="cor">
							{{ numberFormat(scope.row.outflowFeeAmount, 2) }}
						</div>
					</template>
				</el-table-column>
			</el-table-column>
			<el-table-column prop="refundAmount" label="本期流出" width="150">
				<el-table-column prop="refundAmount" label="退款" width="150">
					<template slot-scope="scope">
						<div class="cor">
							{{ numberFormat(scope.row.refundAmount, 2) }}
						</div>
					</template>
				</el-table-column>
			</el-table-column>

			<el-table-column prop="otherOutflowAmount" label="本期流出" width="120">
				<el-table-column prop="otherOutflowAmount" label="其他" width="150">
					<template slot-scope="scope">
						<div class="cor">
							{{ numberFormat(scope.row.otherOutflowAmount, 2) }}
						</div>
					</template>
				</el-table-column>
			</el-table-column>

			<el-table-column prop="inflowAmount" label="本期流入" width="150">
				<template slot-scope="scope">
					<div class="red">
						{{ numberFormat(scope.row.inflowAmount, 2) }}
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="closingBalance" label="期末余额" width="150">
				<template slot-scope="scope">
					<div>
						{{ numberFormat(scope.row.closingBalance, 2) }}
					</div>
				</template>
			</el-table-column>
		</el-table>
		<Dialog
			title="编辑"
			:visible.sync="dialogVisible184"
			width="800px"
			:bottomBtn="dialogBottomBtn184"
		>
			<yx-form
				ref="yxForm"
				labelWidth="100px"
				:inline="false"
				:data="formData184"
				:rules="formRules"
				:items="formCfg184"
			>
			</yx-form>
		</Dialog>
	</basic-container>
</template>

<script>
import { numberFormat } from '@/utils/helper/common'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import Dialog from '@/components/Dialog'

import {
	summaryList,
	updateSummaryByCode,
} from '@/api/weeget-bullet-payment-rest-fors'
import moment from 'moment'
export default {
	components: {
		BasicContainer,
		Dialog,
		YxForm,
	},
	data() {
		return {
			moment,
			numberFormat,
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() > Date.now() - 8.64e7
				},
				shortcuts: [
					{
						text: '昨天',
						onClick(picker) {
							const date = new Date()
							date.setTime(date.getTime() - 3600 * 1000 * 24)
							picker.$emit('pick', date)
						},
					},
					{
						text: '前天',
						onClick(picker) {
							const date = new Date()
							date.setTime(date.getTime() - 3600 * 1000 * 48)
							picker.$emit('pick', date)
						},
					},
					{
						text: '一周前',
						onClick(picker) {
							const date = new Date()
							date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
							picker.$emit('pick', date)
						},
					},
				],
			},

			dataTime: moment().startOf('day').valueOf() - 3600 * 1000 * 24,
			tableData: [],
			formData184: {
				channelCode: 'BANK_DEPOSIT', //支付通道 BANK_DEPOSIT:银行存款; UNION_PAY:银联支付; YEE_PAY:易宝支付;
				closingBalance: '', //期末余额
				inflowAmount: '', //本期流入金额(分)
				openingBalance: '', //期初余额(分)
				otherOutflowAmount: '', //其他流出金额
				tradeDate: '', //交易日期
			},
			formRules: {
				closingBalance: [
					{
						validator: (rule, value, callback) => {
							if (!this.formData184.closingBalance) {
								callback(new Error('请输入期末余额'))
							} else {
								if (this.formData184.closingBalance < 0) {
									callback(new Error('期末余额不可为负数'))
								} else if (this.formData184.closingBalance > 1000000000) {
									callback(new Error('期末余额不能大于十亿'))
								} else {
									callback()
								}
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
				inflowAmount: [
					{ required: true, message: '请输入本期流入金额', trigger: 'change' },
				],
				openingBalance: [
					{
						validator: (rule, value, callback) => {
							if (!this.formData184.openingBalance) {
								callback(new Error('请输入期初余额'))
							} else {
								if (this.formData184.openingBalance < 0) {
									callback(new Error('期初余额不可为负数'))
								} else if (this.formData184.openingBalance > 1000000000) {
									callback(new Error('期初余额不能大于十亿'))
								} else {
									callback()
								}
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
				otherOutflowAmount: [
					{ required: true, message: '请输入其他流出金额', trigger: 'blur' },
				],
			},
			formCfg184: [
				{
					type: 'radioMap',
					dataIndex: 'channelCode',
					title: '通道名称',
					options: {
						银行存款: 'BANK_DEPOSIT',
						银联支付: 'UNION_PAY',
						易宝支付: 'YEE_PAY',
					},
				},
				{
					title: '期初余额',
					type: 'inputNumber',
					dataIndex: 'openingBalance',
				},
				{
					title: '本期流出',
					type: 'inputNumber',
					dataIndex: 'otherOutflowAmount',
				},
				{
					title: '本期流入',
					type: 'inputNumber',
					dataIndex: 'inflowAmount',
				},
				{
					title: '期末余额',
					type: 'inputNumber',
					dataIndex: 'closingBalance',
				},
			],
			dialogVisible184: false,
			dialogBottomBtn184: [
				{
					title: '取消',
					type: 'default',
					cancel: true,
					click: () => {
						this.dialogVisible184 = false
					},
				},
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this._accountAdjustmentSave()
					},
				},
			],
			loading: false,
			accountId: null,
			optionsList: [],
			tableData182: [],
		}
	},
	created() {
		this._summaryList()
	},
	methods: {
		getSummaries(param) {
			const { columns, data } = param
			const sums = []
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = '总和'
					return
				}
				if (index === 3 || index === 8 || index === 9) {
					//获取每列数值
					const values = data.map((item) => Number(item[column.property]))
					if (!values.every((value) => isNaN(value))) {
						sums[index] = values.reduce((prev, curr) => {
							const value = Number(curr)
							if (!isNaN(value)) {
								return prev + curr
							} else {
								return prev
							}
						}, 0)
						sums[index] = numberFormat(sums[index], 2) + ' 元'
					} else {
						sums[index] = ''
					}
				}
			})
			return sums
		},
		modifyBalance() {
			this.dialogVisible184 = true
			this.formData184 = {
				channelCode: 'BANK_DEPOSIT', //支付通道 BANK_DEPOSIT:银行存款; UNION_PAY:银联支付; YEE_PAY:易宝支付;
				closingBalance: '', //期末余额
				inflowAmount: '', //本期流入金额(分)
				openingBalance: '', //期初余额(分)
				otherOutflowAmount: '', //其他流出金额
				tradeDate: '', //交易日期
			}
		},
		_accountAdjustmentSave() {
			this.$refs.yxForm.$refs.YxForm.validate(async (valid) => {
				if (valid) {
					let paramJson = this.formData184
					paramJson.channelName =
						paramJson.channelCode == 'BANK_DEPOSIT'
							? '银行存款'
							: paramJson.channelCode == 'UNION_PAY'
							? '银行存款'
							: '易宝支付'
					paramJson.tradeDate = moment(this.dataTime).format('YYYY-MM-DD')
					let {
						data: { resultCode },
					} = await updateSummaryByCode(paramJson)
					if (resultCode == 0) {
						this.$message.success('调账成功')
						this.dialogVisible184 = false
						this._summaryList()
					}
				}
			})
		},
		async _summaryList() {
			this.loading = true
			let {
				data: { resultCode, resultData },
			} = await summaryList({
				tradeDate: moment(this.dataTime).format('YYYY-MM-DD'),
			})
			this.loading = false
			if (resultCode === 0) {
				this.tableData182 = resultData
			} else {
				this.tableData182 = []
			}
		},
	},
}
</script>

<style>
.cor {
	color: #009966;
}
.red {
	color: red;
}
</style>

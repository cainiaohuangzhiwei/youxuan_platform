<template>
	<basic-container>
		<yx-form
			:inline="true"
			:data="formData195"
			:items="formCfg195"
			:formAction="formAction195"
		>
			<template slot="date">
				<el-date-picker
					v-model="formData195.date"
					type="daterange"
					format="yyyy-MM-dd"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
				>
				</el-date-picker>
			</template>
		</yx-form>
		<yx-table
			v-loading="loading"
			:columns="tableColumns188"
			:pagination="page188"
			:data="tableData188"
		></yx-table>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { transferInfoQuery } from '@/api/weeget-bullet-payment-rest-fors'
import moment from 'moment'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	data() {
		return {
			loading: false,
			tableColumns188: [
				{
					type: 'string',
					dataIndex: 'createTime',
					title: '发起时间',
				},
				{
					type: 'string',
					dataIndex: 'payerAccountName',
					title: '转出账户',
				},
				{
					type: 'string',
					dataIndex: 'payeeAccountName',
					title: '转入账户',
				},
				{
					type: 'amount',
					dataIndex: 'tradeAmount',
					title: '转账金额',
				},
				{
					type: 'string',
					dataIndex: 'transferNo',
					title: '转账单号',
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
				// CREATED:已创建, PROCESSING:转账中, SUCCESS:转账成功, FAIL:转账失败
				{
					type: 'newMap',
					dataIndex: 'tradeState',
					title: '状态',
					options: [
						['CREATED', '已创建'],
						['PROCESSING', '转账中'],
						['SUCCESS', '转账成功'],
						['FAIL', '转账失败'],
					],
				},
				{
					type: 'string',
					dataIndex: 'reason',
					title: '失败原因',
				},
				{
					type: 'string',
					dataIndex: 'optUsername',
					title: '操作人',
				},
			],
			page188: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._transferInfoQuery()
				},
			},
			tableData188: [],
			formData195: {
				// 出账账户名称
				payerAccountName: '',
				// 入账账户名称
				payeeAccountName: '',
				// 操作人
				optUsername: '',
				// 操作时间
				date: [moment().startOf('day'), moment().endOf('day')],
			},
			formCfg195: [
				{
					type: 'input',
					title: '转出账户名称',
					dataIndex: 'payerAccountName',
				},
				{
					type: 'input',
					title: '转入账户名称',
					dataIndex: 'payeeAccountName',
				},
				{
					type: 'input',
					title: '操作人',
					dataIndex: 'optUsername',
				},
				{
					title: '发起时间',
					type: 'custom',
					dataIndex: 'date',
				},
			],
			formAction195: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._transferInfoQuery(true)
					},
				},
				{
					title: '发起转账',
					type: 'success',
					click: () => {
						this.$router.push({
							path: '/fund/accountTransfer',
						})
					},
				},
			],
		}
	},
	created() {
		this._transferInfoQuery(true)
	},
	methods: {
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.formData195, {
				offset: 0,
				limit: 1,
				channelCode: 'SU_NING',
			})
			// 每页的加载数据长度
			paramJson.limit = this.page188.length
			// 发起开始时间
			paramJson.startDate = moment(this.formData195.date[0]).format(
				'YYYY-MM-DD'
			)
			// 发起结束时间
			paramJson.endDate = moment(this.formData195.date[1]).format('YYYY-MM-DD')
			// 当前页的条数开始
			if (flag) {
				this.page188.currentPage = 1
			}
			paramJson.offset = (this.page188.currentPage - 1) * this.page188.length
			return paramJson
		},
		// 查询列表
		_transferInfoQuery: async function (flag) {
			if (!this.formData195.date || !this.formData195.date.length) {
				return this.$message.warning('请选择时间')
			}
			let time = 24 * 60 * 60 * 1000 * 30
			if (
				moment(this.formData195.date[1]).valueOf() -
					moment(this.formData195.date[0]).valueOf() >
				time
			) {
				return this.$message.warning('时间不能超过31天')
			}
			let paramJson = { ...this.findSearchParams(flag) }
			delete paramJson.date
			this.loading = true
			let {
				data: {
					resultCode,
					resultData: { transferInfoList = [], total = 0 },
				},
			} = await transferInfoQuery(paramJson)
			this.loading = false
			if (resultCode == 0 && total) {
				this.tableData188 = transferInfoList
				this.page188.count = total
			} else {
				this.page188.count = 0
				this.tableData188 = []
			}
		},
	},
}
</script>

<style></style>

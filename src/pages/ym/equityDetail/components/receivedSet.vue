<template>
	<div class="shopStatistics">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns102"
				:pagination="page102"
				:data="tableData102"
			></yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getEquityReceived } from '@/api/yhtPlusCmsEquity'
import moment from 'moment'

export default {
	components: { BasicContainer, YxForm, YxTable },
	props: {
		params: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			loading: false,
			formData101: {
				receiverName: '',
				startTime: '',
				endTime: '',
				donerName: '',
			},
			formCfg101: [
				{
					type: 'input',
					dataIndex: 'receiverName',
					title: '领取人名称',
					placeholder: '领取人名称',
				},
				{
					type: 'input',
					dataIndex: 'donerName',
					title: '赠送人名称',
					placeholder: '赠送人名称',
				},
				{
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					title: '领取时间',
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
			],
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (!this.loading) this.init(true)
					},
					tableId: 102,
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					dataIndex: 'equityReceivedId',
					title: '权益卡子ID',
				},
				{
					type: 'string',
					dataIndex: 'receiverId',
					title: '用户ID',
				},
				{
					type: 'string',
					dataIndex: 'receiverName',
					title: '领取人名称',
				},
				{
					type: 'string',
					dataIndex: 'donerName',
					title: '赠送人名称',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '领取时间',
				},
				{
					type: 'string',
					dataIndex: 'startTime',
					title: '有效时间',
					customRender: ({ startTime, endTime }) => {
						return (
							moment(startTime).format('YYYY-MM-DD HH:mm:ss') +
							'-' +
							moment(endTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					type: 'newMap',
					dataIndex: 'userIdentify',
					title: '用户身份',
					options: [
						['1', '普通用户'],
						['2', '店主'],
					],
				},
				{
					type: 'newMap',
					dataIndex: 'equityStatus',
					title: '权益卡状态',
					options: [
						['1', '未使用'],
						['3', '已使用'],
						['2', '锁定中'],
						['4', '已赠送'],
						['5', '待付款'],
						['6', '已取消'],
					],
				},
				{
					type: 'newMap',
					dataIndex: 'receiveWay',
					title: '领取方式',
					options: [
						['1', '好友赠送'],
						['2', '平台派发'],
						['3', '下单购买'],
						['4', '策略中心'],
					],
				},
				{
					type: 'string',
					dataIndex: 'equityPlanId',
					title: '来源',
					customRender: ({ equityPlanId }) => {
						return equityPlanId ? '派发计划' + equityPlanId : '-'
					},
				},
			],
			page102: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
		}
	},

	methods: {
		async init(flag) {
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			const {
				data: { resultCode, resultData },
			} = await getEquityReceived(paramJson)
			if (resultCode == 0) {
				this.tableData102 = resultData.equityReceivedlist
				this.page102.count = resultData.count
			} else {
				this.tableData102 = []
				this.page102.count = 0
			}
			this.loading = false
		},
		findSearchParams102(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			const paramJson = Object.assign(this.formData101, {
				length: this.page102.length,
				equityId: this.params.equityId,
				startIndex: (this.page102.currentPage - 1) * this.page102.length,
			})
			return paramJson
		},
	},
}
</script>

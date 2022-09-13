<template>
	<div class="equityCardList">
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
			>
				<template slot="orderSn" slot-scope="scope">
					<router-link :to="`/business/orderDetails/${scope.row.orderId}`"
						><el-button type="text">{{
							scope.row.orderSn
						}}</el-button></router-link
					>
				</template>
				<template slot="afterSalesSn" slot-scope="scope">
					<router-link
						:to="`/business/afterSaleOrderDetails/${scope.row.afterSalesId}`"
						><el-button type="text">{{
							scope.row.afterSalesSn
						}}</el-button></router-link
					>
				</template>
			</yx-table>
		</basicContainer>
	</div>
</template>
<script>
import moment from 'moment'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import {
	listEquityCompensation,
	exportEquityCompensationList,
	compensationManual,
} from '@/api/equity'
import { inquireQueryApplyResult } from '@/api/yxCompensationAmount'
import { downloadFile } from '@/utils/helper/common'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	props: [],
	data() {
		return {
			loading: false,
			formData101: {
				compensationSn: '',
				orderSnCompensation: '',
				afterSalesSn: '',
				compensationWay: '',
				compensationStatus: '',
				startTime: moment().startOf('month').valueOf(), // 开始时间
				endTime: moment().endOf('month').valueOf(), // 结束时间
			},
			formCfg101: [
				{
					title: '赔付单号',
					type: 'input',
					dataIndex: 'compensationSn',
					placeholder: '请输入赔付单号',
				},
				{
					type: 'input',
					dataIndex: 'orderSn',
					title: '关联订单',
				},
				{
					type: 'input',
					dataIndex: 'afterSalesSn',
					title: '关联售后单',
				},
				{
					type: 'input',
					dataIndex: 'transactionSn',
					title: '关联交易流水号',
				},
				{
					title: '赔付状态',
					type: 'select',
					dataIndex: 'compensationStatus',
					label: 'value',
					options: [
						{
							value: '全部',
							compensationStatus: '',
						},
						{
							value: '已赔付',
							compensationStatus: 1,
						},
						{
							value: '赔付失败',
							compensationStatus: 2,
						},
						{
							value: '待转账',
							compensationStatus: 4,
						},
						{
							value: '赔付中',
							compensationStatus: 5,
						},
					],
				},
				{
					title: '赔付方式',
					type: 'select',
					dataIndex: 'compensationWay',
					label: 'value',
					options: [
						{
							value: '全部',
							compensationWay: '',
						},
						{
							value: '微信零钱',
							compensationWay: 0,
						},
						{
							value: '用户自行转账',
							compensationWay: 1,
						},
						{
							value: '兑换优惠券',
							compensationWay: 2,
						},
						{
							value: '上门取件抵扣',
							compensationWay: 3,
						},
						{
							value: '补款赔付',
							compensationWay: 4,
						},
					],
				},
				{
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					title: '添加时间',
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
			],
			formAction101: [
				{
					title: '重置',
					auth: '',
					yapiId: '',
					token: '',
					dialogId: '',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					auth: '',
					yapiId: '',
					token: '',
					dialogId: '',
					click: () => {
						if (!this.loading) this.getData102(true)
					},
					tableId: 102,
					api: 'listEquityCompensation',
				},
				{
					title: '导出',
					auth: 'exportEquityCompensationList',
					type: 'success',
					click: () => {
						this.exportEquityCompensationList()
					},
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					dataIndex: 'compensationSn',
					title: '赔付单号',
					width: '160',
				},
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '关联订单',
					width: '180',
				},
				{
					type: 'custom',
					dataIndex: 'afterSalesSn',
					title: '关联售后单',
					width: '160',
				},
				{
					type: 'string',
					dataIndex: 'transactionSn',
					title: '交易流水号',
					width: '180',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '赔付时间',
					width: '160',
				},
				{
					type: 'string',
					dataIndex: 'orderUserName',
					title: '下单人',
					width: '80',
				},
				{
					type: 'amount',
					dataIndex: 'compensationAmount',
					title: '赔付金额',
					width: '80',
				},
				{
					type: 'string',
					dataIndex: 'compensationStatus',
					title: '赔付状态',
					customRender: (row) => {
						const arr = ['', '已赔付', '赔付失败', '', '待赔付', '赔付中']
						return arr[row.compensationStatus] || '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'compensationWay',
					title: '赔付方式',
					customRender: (row) => {
						const arr = [
							'微信零钱',
							'用户自行转账',
							'兑换优惠券',
							'上门取件抵扣',
							'补款赔付',
						]
						return arr[row.compensationWay] || '-'
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '补款赔付',
							auth: 'compensationManual',
							customRender: (action, row) => {
								action.hide =
									row.compensationStatus == 4 ||
									(row.compensationStatus == 2 &&
										(row.compensationWay == 1 || row.compensationWay == 2))
										? false
										: true
								return action
							},
							popconfirm: true,
							popconfirmTitle:
								'确认后，此条记录会变为“已赔付”状态。需要对此订单进行补款操作?',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: async (row) => {
								const {
									data: { resultCode, resultMsg },
								} = await compensationManual({
									afterSalesId: row.afterSalesId,
									equityCompensationId: row.equityCompensationId,
								})
								if (resultCode == 0) {
									this.$message.success(resultMsg)
									this.getData102(true)
								}
							},
						},
						{
							title: '查询赔付',
							auth: '',
							customRender: (action, row) => {
								action.hide = row.compensationStatus != 5
								return action
							},
							popconfirm: true,
							popconfirmTitle: '是否查询赔付?',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: async (row) => {
								const {
									data: { resultCode, resultMsg },
								} = await inquireQueryApplyResult({
									compensationSnList: [row.compensationSn],
								})
								if (resultCode == 0) {
									this.$message.success(resultMsg)
									this.getData102(true)
								}
							},
						},
					],
				},
			],
			page102: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData102()
				},
			},
		}
	},

	methods: {
		//导出
		exportEquityCompensationList: async function () {
			let paramJson = this.formData101
			if (!paramJson.startTime || !paramJson.endTime) {
				this.$message.warning('请选择添加时间区间')
				return
			}
			paramJson.groupId = this.$store.state.user.userInfo.groupId
			let { data } = await exportEquityCompensationList(paramJson)
			data && downloadFile(data, '赔付信息表.xlsx')
		},
		async getData102(flag) {
			let paramJson = this.findSearchParams102(flag)
			if (!paramJson.startTime || !paramJson.endTime) {
				this.$message.warning('请选择添加时间区间')
				return
			}
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await listEquityCompensation(paramJson)
			if (resultCode === 0) {
				this.tableData102 = resultData.equityCompensationList
				this.page102.count = resultData.count
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
				startIndex: (this.page102.currentPage - 1) * this.page102.length,
			})
			return paramJson
		},
	},
}
</script>

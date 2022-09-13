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
				:columns.sync="tableColumns102"
				:pagination="page102"
				:data="tableData102"
			>
				<template slot="orderId" slot-scope="scope">
					<div>
						<div
							v-if="scope.row.orderInfoList && scope.row.orderInfoList.length"
						>
							<router-link
								v-for="(item, index) in scope.row.orderInfoList"
								:key="index"
								:to="`/business/orderDetails/${item.orderId}`"
								><el-button type="text">{{
									item.orderSn
								}}</el-button></router-link
							>
						</div>
						<span v-else>-</span>
					</div>
				</template>
				<template slot="organizationName" slot-scope="scope">
					<div>
						<el-button
							type="text"
							v-if="scope.row.organizationId && scope.row.organizationName"
						>
							<router-link
								:to="`/shop/shop/shopDetail/${scope.row.organizationId}`"
							>
								{{ scope.row.organizationName }}
							</router-link>
						</el-button>
						<span v-else>-</span>
					</div>
				</template>
			</yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { useCouponRecord } from '@/api/yhtPlusCoupon'
// import moment from 'moment'

export default {
	components: { BasicContainer, YxForm, YxTable },
	props: {
		params: {
			type: Boolean,
			default: () => ({}),
		},
	},
	data() {
		return {
			loading: false,
			formData101: {
				userName: '',
				yxUserId: '',
				startTime: '',
				endTime: '',
			},
			formCfg101: [
				{
					type: 'input',
					dataIndex: 'userName',
					title: '用户名称',
					placeholder: '用户名称',
				},
				{
					type: 'inputNumber',
					dataIndex: 'yxUserId',
					title: '用户ID',
					placeholder: '用户ID',
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
					dataIndex: 'userId',
					title: '用户Id',
				},
				{
					type: 'string',
					dataIndex: 'userName',
					title: '用户名称',
				},
				{
					type: 'date',
					dataIndex: 'grantTime',
					title: '领取时间',
					hide: true,
				},
				{
					type: 'custom',
					dataIndex: 'orderId',
					title: '使用订单',
					width: '200px',
				},
				{
					type: 'custom',
					dataIndex: 'organizationName',
					title: '下单店铺',
				},
				{
					type: 'date',
					dataIndex: 'userTime',
					title: '使用时间',
				},
				{
					type: 'string',
					dataIndex: 'doneeName',
					title: '领取人名称',
					hide: true,
				},
				{
					type: 'newMap',
					dataIndex: 'doneeStatus',
					title: '领取状态',
					hide: true,
					options: [
						['1', '已领取待使用'],
						['3', '已领取已过期'],
						['2', '已领取已使用'],
						['4', '待领取'],
					],
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
		tableColumnHide(give) {
			this.tableColumns102.map((item) => {
				if (item.dataIndex == 'grantTime') {
					item.hide = give != 0 ? false : true
				} else if (
					item.dataIndex == 'doneeName' ||
					item.dataIndex == 'doneeStatus'
				) {
					item.hide = give == 1 ? false : true
				}
			})
		},
		async init(flag) {
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			const {
				data: { resultCode, resultData },
			} = await useCouponRecord(paramJson)
			if (resultCode == 0) {
				this.tableData102 = resultData.userYxCouponList
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
				yxCouponId: this.params.yxCouponId,
				startIndex: (this.page102.currentPage - 1) * this.page102.length,
				version: 1,
			})
			return paramJson
		},
	},
}
</script>

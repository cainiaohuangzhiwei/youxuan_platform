<template>
	<div>
		<yx-table
			:select="false"
			v-loading="loading"
			:columns="tableColumns108"
			:data="tableData108"
		></yx-table>
		<el-timeline class="updateSpec-box">
			<el-timeline-item v-for="(item, index) in updateSpecVoList" :key="index">
				<div>
					<p>修改尺码:{{ item.specTwo }},{{ item.specOne }}</p>
					<p>
						申请时间:{{
							item.addTime
								? moment(item.addTime).format('YYYY-MM-DD HH:mm:ss')
								: '无'
						}}
					</p>
					<p>申请人:{{ item.nickname }}</p>
				</div>
			</el-timeline-item>
			<el-timeline-item v-if="updateSpecVoList.length">
				<template slot="dot">
					<span></span>
				</template>
			</el-timeline-item>
		</el-timeline>
	</div>
</template>

<script>
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import {
	findOrderGoodsUpdateRecordsNew,
	findOrderGoodsUpdateRecords,
} from '@/api/orderRecord'
export default {
	components: {
		YxTable,
	},
	data() {
		return {
			moment,
			loading: false,
			orderId: this.$route.params.orderId,
			tableColumns108: [
				{
					type: 'string',
					title: '商品条形码',
					dataIndex: 'barCode',
				},
				{
					type: 'string',
					title: '商品数量',
					dataIndex: 'num',
				},
				{
					type: 'string',
					title: '上游订单号',
					dataIndex: 'platformOrderSn',
				},
				{
					type: 'string',
					title: '支付订单号',
					dataIndex: 'refPaymentNo',
				},
			],
			tableData108: [],
			updateSpecVoList: [],
		}
	},

	methods: {
		async init() {
			this.loading = true
			let {
				data: { resultCode, resultData },
			} = await findOrderGoodsUpdateRecordsNew({
				orderId: this.orderId,
			})
			this._findOrderGoodsUpdateRecords()
			this.loading = false
			if (resultCode == 0) {
				this.isShow = true
				this.tableData108 = resultData.platformOrderInfoList
			} else {
				this.tableData108 = []
			}
		},
		async _findOrderGoodsUpdateRecords() {
			let {
				data: { resultCode, resultData },
			} = await findOrderGoodsUpdateRecords({
				orderId: this.orderId,
			})
			if (resultCode == 0) {
				let orderUpdateRecord = resultData.orderUpdateRecord || {}
				let updateSpecVoList = orderUpdateRecord.updateSpecVoList || []
				this.updateSpecVoList = updateSpecVoList
			}
		},
	},
}
</script>

<style scoped>
.updateSpec-box {
	padding: 10px;
	position: relative;
	margin-left: 20px;
}
</style>

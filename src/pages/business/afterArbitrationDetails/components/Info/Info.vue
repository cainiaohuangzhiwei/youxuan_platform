<template>
	<div class="container">
		<h1 style="text-align: center">
			{{
				resultDataList.arbitrationState == 1
					? '待商家处理'
					: resultDataList.arbitrationState == 2
					? '待平台处理'
					: resultDataList.arbitrationState == 3
					? '仲裁关闭'
					: '仲裁完成'
			}}
		</h1>
		<yx-info :data="resultDataList" :items="infoItems">
			<template slot="orderSn" slot-scope="">
				<label for="">订单编号:</label>
				<router-link :to="`/business/orderDetails/${resultDataList.orderId}`"
					><el-button type="text">{{
						resultDataList.orderSn
					}}</el-button></router-link
				>
			</template>
			<template slot="afterId" slot-scope="">
				<label for="">售后单号:</label>
				<router-link
					:to="`/business/afterSaleOrderDetails/${resultDataList.afterSalesId}`"
					><el-button type="text">{{
						resultDataList.afterSalesSn
					}}</el-button></router-link
				>
			</template>
		</yx-info>
	</div>
</template>

<script>
import YxInfo from '@wg-vue-materials/yx-info'
export default {
	props: ['resultDataList'],
	components: {
		YxInfo,
	},
	name: 'baseInfo',
	data() {
		return {
			infoItems: [
				{
					type: 'custom',
					dataIndex: 'orderSn',
					width: '160',
				},
				{
					type: 'custom',
					dataIndex: 'afterId',
				},
				{
					type: 'string',
					title: '平台仲裁单号',
					dataIndex: 'arbitrationSn',
				},

				{
					type: 'string',
					title: '仲裁类型',
					dataIndex: 'arbitrationType',
					customRender: (row) => {
						return row.arbitrationType == 1 ? '审核结果仲裁' : '验货结果仲裁'
					},
				},
				{
					type: 'string',
					title: '售后仲裁单状态',
					dataIndex: 'arbitrationState',
					customRender: (row) => {
						if (row.arbitrationState == 1) {
							return '待商家处理'
						} else if (row.arbitrationState == 2) {
							return '待平台处理'
						} else if (row.arbitrationState == 3) {
							return '已关闭'
						} else if (row.arbitrationState == 4) {
							return '仲裁完成'
						}
					},
				},
				{
					type: 'string',
					title: '关联售后单售后类型',
					dataIndex: 'afterType',
					customRender: (row) => {
						return row.afterType == 1 ? '退货退款' : '仅退款'
					},
				},
			],
		}
	},

	created() {},

	mounted() {},
}
</script>

<style scoped>
.info-container {
	padding: 10px 0 35px;
}
</style>

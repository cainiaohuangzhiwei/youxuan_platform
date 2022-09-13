<template>
	<div>
		<yx-info :column="4" :data="orderAfterSalesVo" :items="afterSalesItems">
			<template slot="orderSn">
				<div>
					<span>单号：</span>
					<el-button
						v-clipboard:copy="orderAfterSalesVo.orderSn"
						v-clipboard:success="copyCode"
						type="text"
						>{{ orderAfterSalesVo.orderSn }}</el-button
					>
				</div>
			</template>
			<template slot="afterSaleOrderDetails">
				<div class="after-sale-list">
					<span>售后单：</span>
					<div>
						<p
							v-for="(item, index) in orderAfterSalesVo.afterSaleList"
							:key="index"
							class="afterSalesSn"
						>
							<el-button type="text">
								<router-link
									:to="`/business/afterSaleOrderDetails/${item.afterSalesId}`"
									>{{ item.afterSalesSn }}</router-link
								>
							</el-button>
						</p>
					</div>
				</div>
			</template>
		</yx-info>
	</div>
</template>

<script>
import YxInfo from '@wg-vue-materials/yx-info'
import moment from 'moment'
export default {
	components: {
		YxInfo,
	},
	props: {
		orderAfterSalesVo: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			afterSalesItems: [
				{
					type: 'string',
					title: '店主',
					dataIndex: 'organizationName',
				},
				{
					type: 'custom',
					dataIndex: 'orderSn',
				},
				{
					type: 'string',
					title: '下单时间',
					dataIndex: 'refundTime',
					customRender: () => {
						return this.orderAfterSalesVo.orderAddTime
							? moment(this.orderAfterSalesVo.orderAddTime).format(
									'YYYY-MM-DD HH:mm:ss'
							  )
							: '-'
					},
				},
				{
					type: 'string',
					title: '下单人',
					dataIndex: 'weixinUserName',
				},
				{
					type: 'custom',
					dataIndex: 'afterSaleOrderDetails',
				},
			],
		}
	},

	methods: {
		copyCode() {
			this.$message.success('复制成功')
		},
	},
}
</script>

<style lang="scss" scoped>
.after-sale-list {
	display: flex;
	span {
		margin-top: 6px;
	}
}
.afterSalesSn {
	margin: 0;
}
</style>

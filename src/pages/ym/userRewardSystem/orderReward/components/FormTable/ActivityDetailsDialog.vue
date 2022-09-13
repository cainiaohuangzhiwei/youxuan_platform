<template>
	<yx-dialog
		title="用户活动详情"
		:width="width"
		:bottomBtn="bottomBtn"
		:visible.sync="localVisible"
		:before-close="resetForm"
	>
		<div>
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="用户ID:">
					<span>{{ form.userId }}</span>
				</el-form-item>
				<el-form-item label="用户名称:">
					<span>{{ form.userName }}</span>
				</el-form-item>
			</el-form>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tialogColumns"
					:data="tableData"
					:pagination="page"
				>
					<template slot="orderSn" slot-scope="scope">
						<el-button type="text" @click="handleDetails(scope.row.orderId)">
							{{ scope.row.orderSn }}
							<!-- <router-link
								:to="`/business/orderDetails/${scope.row.orderId}?sourceType=${scope.row.sourceType}`"
							></router-link> -->
						</el-button>
					</template>
				</yx-table>
			</el-row>
		</div>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxTable from '@wg-vue-materials/yx-table'
import { listActivityOrderReward } from '@/api/userRewardSystem'
export default {
	components: {
		YxDialog,
		YxTable,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			default: false,
		},
		activityDetailsRow: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			form: {},
			width: '600px',
			tableData: [],
			showLoading: false,
			tialogColumns: [
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '订单号',
				},
				{
					type: 'string',
					dataIndex: 'effectiveGoodsSum',
					title: '有效商品数',
				},
			],
		}
	},
	computed: {
		localVisible: {
			get() {
				return this.visible
			},
			set(val) {
				this.$emit('update:visible', val)
			},
		},
	},

	watch: {
		localVisible(val) {
			if (val) {
				this.form.userId = this.activityDetailsRow.userId
				this.form.userName = this.activityDetailsRow.userName
				this._listActivityOrderReward()
			}
		},
	},
	methods: {
		handleDetails(orderId) {
			this.$emit('transmit')
			this.localVisible = false
			this.$router.push({ path: `/business/orderDetails/${orderId}` })
		},
		// 搜索条件
		findSearchParams() {
			// 当前页的条数开始
			const paramJson = {
				activitySn: this.activityDetailsRow.activitySn,
				searchUserId: this.activityDetailsRow.userId,
			}

			return paramJson
		},
		async _listActivityOrderReward() {
			let paramJson = this.findSearchParams()
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await listActivityOrderReward(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData
			}
		},
		resetForm() {
			this.localVisible = false
		},
	},
}
</script>

<style lang="scss" scoped></style>

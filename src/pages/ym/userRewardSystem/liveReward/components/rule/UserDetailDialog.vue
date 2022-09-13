<template>
	<el-dialog
		class="look"
		width="650px"
		title="用户明细"
		append-to-body
		v-loading="loading"
		:close-on-click-modal="false"
		:visible.sync="localVisible"
		:before-close="resetForm"
	>
		<YxInfo :column="'1'" :items="items" :data="userInfo" />

		<YxTable :data="tableData" :pagination="page" :columns="tableColumns">
			<template slot="orderSn" slot-scope="scope">
				<el-button type="text" @click="skipOrder(scope.row)">{{
					scope.row.orderSn
				}}</el-button>
			</template>
		</YxTable>
	</el-dialog>
</template>

<script>
import { viewActSaleRewardUserDetail } from '@/api/userRewardSystem'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		YxInfo: () => import('@wg-vue-materials/yx-info'),
		YxTable: () => import('@wg-vue-materials/yx-table'),
	},

	data() {
		return {
			userInfo: {
				userName: '',
				userId: '',
			},
			items: [
				{
					type: 'string',
					title: '用户名称',
					dataIndex: 'userName',
				},
				{
					type: 'string',
					title: '用户ID',
					dataIndex: 'userId',
				},
			],
			loading: false,
			tableData: [],
			searchData: {
				participateUserId: '',
				actSaleRewardId: '',
			},
			tableColumns: [
				{
					type: 'custom',
					title: '订单号',
					dataIndex: 'orderSn',
				},
				{
					title: '有效商品数',
					dataIndex: 'effectiveQuantity',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._viewActSaleRewardUserDetail()
				},
			},
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

	methods: {
		details(row) {
			this.searchData = {
				participateUserId: row.userId,
				actSaleRewardId: row.actSaleRewardId,
			}
			this._viewActSaleRewardUserDetail(true)
		},

		findSearchParams(flag) {
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = Object.assign(this.searchData, {
				length: this.page.length,
				currentPage: this.page.currentPage,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})
			return paramJson
		},

		async _viewActSaleRewardUserDetail(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await viewActSaleRewardUserDetail(paramJson)

			if (resultCode == 0) {
				this.userInfo = resultData.userInfo
				this.page.count = resultData.actSaleRewardUserOrderList.total
				this.tableData = resultData.actSaleRewardUserOrderList.records
			} else {
				this.page.count = 0
				this.tableData = []
			}
			this.loading = false
		},

		skipOrder(row) {
			this.lookActivityGoodsDialog = true
			this.$router.push({
				path: `/business/orderDetails/${row.orderId}`,
			})
		},

		resetForm() {
			this.localVisible = false
			this.rowData = {}
		},
	},
}
</script>

<style lang="scss" scoped></style>

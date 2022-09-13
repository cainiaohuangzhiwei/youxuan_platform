<template>
	<yx-dialog title="结算详情" :visible.sync="visible" :bottomBtn="bottomBtn">
		<yx-table v-loading="showLoading" :columns="tableColumns" :data="tableData">
		</yx-table>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxTable from '@wg-vue-materials/yx-table'
import { merchantSettleListDetail } from '@/api/orderSettle'
import { getConstantValueByKey } from '@/utils/helper/common'
export default {
	components: {
		YxDialog,
		YxTable,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		options: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			visible: false,
			showLoading: false,
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'settleType',
					title: '结算类型',
					customRender: (row) => {
						if (row.settleType == 1) {
							return '货款结算'
						} else if (row.settleType == 2) {
							return '运费结算'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'settleProportion',
					title: '结算比例',
					customRender: (row) => {
						return row.settleProportion + '%'
					},
				},
				{
					type: 'date',
					dataIndex: 'settleTime',
					title: '结算时间',
				},
				{
					type: 'amount',
					dataIndex: 'settleAmount',
					title: '结算金额',
				},
				{
					type: 'string',
					dataIndex: 'settleStatus',
					title: '结算状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.SETTLE_STATUS_SUPPLIER,
							row.settleStatus,
							'其他',
							'settleStatus'
						)
					},
				},
			],
			bottomBtn: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.visible = false
					},
				},
			],
		}
	},
	methods: {
		_merchantSettleListDetail: async function () {
			// 获取详细信息
			this.showLoading = true
			let {
				data: {
					resultCode,
					resultData: { settleDetails = [] },
				},
			} = await merchantSettleListDetail({
				orderSn: this.options.orderSn,
			})
			if (resultCode == 0) {
				this.tableData = settleDetails
			}
			this.showLoading = false
		},
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
		},
		dialogVisible(newVlaue) {
			this.visible = newVlaue
			if (this.visible) {
				this._merchantSettleListDetail()
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.withdrawsn-box {
	display: flex;
	align-items: center;
	.withdraw-sn {
		margin-right: 20%;
	}
}
</style>

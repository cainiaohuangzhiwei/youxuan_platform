<template>
	<yx-dialog title="转账业务" :visible.sync="visible" :bottomBtn="bottomBtn">
		<div>
			<yx-table :columns="tableColumns" :data="[itemInfo]">
				<template slot="transferringAccount" slot-scope="scope">
					<div>
						<p>{{ scope.row.transferOutAccountName }}</p>
						<p>{{ scope.row.transferOutAccountId }}</p>
					</div>
				</template>
				<template slot="transferAccount" slot-scope="scope">
					<div>
						<p>{{ scope.row.transferInAccountName }}</p>
						<p>{{ scope.row.transferInAccountId }}</p>
					</div>
				</template>
			</yx-table>
			<div class="title">退款业务</div>
			<yx-table
				v-loading="showLoading"
				:columns="refundColumns"
				:data="refundList"
			>
			</yx-table>
		</div>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxTable from '@wg-vue-materials/yx-table'
import { fundTransferRefundList } from '@/api/accountService'
import { getConstantValueByKey, numberFormat } from '@/utils/helper/common'
import moment from 'moment'
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
		// 详情
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			visible: false,
			showLoading: false,
			bottomBtn: [
				{
					title: '关闭',
					type: 'primary',
					click: () => {
						this.visible = false
					},
				},
			],
			refundList: [], // 退款业务列表
			// 退款表格配置项
			refundColumns: [
				{
					type: 'string',
					dataIndex: 'transferReturnRecordId',
					title: '退款业务ID',
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'data',
					dataIndex: 'finishTime',
					title: '完成时间',
				},
				{
					type: 'string',
					dataIndex: 'amount',
					title: '退款金额',
					customRender: (row) => {
						return numberFormat(row.amount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '业务状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.REFIND_BUSINESS_TYPE,
							row.status,
							'-',
							'status'
						)
					},
				},
			],
			// 转账业务
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'transferRecordId',
					title: '业务ID',
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'data',
					dataIndex: 'finishTime',
					title: '完成时间',
					customRender: (row) => {
						return row.finishTime
							? moment(row.finishTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'custom',
					dataIndex: 'transferringAccount',
					title: '转出账户名称账户ID',
				},
				{
					type: 'custom',
					dataIndex: 'transferAccount',
					title: '转入账户名称账户ID',
				},
				{
					type: 'string',
					dataIndex: 'amount',
					title: '转账金额',
					customRender: (row) => {
						return numberFormat(row.amount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.TRANSFER_STATUS,
							row.status,
							'-',
							'status'
						)
					},
				},
			],
		}
	},
	methods: {
		_fundTransferRefundList: async function () {
			this.showLoading = true
			let {
				data: {
					resultCode,
					resultData: { recordList = [] },
				},
			} = await fundTransferRefundList({
				transferRecordId: this.itemInfo.transferRecordId,
			})
			this.showLoading = false
			if (resultCode == 0) {
				this.refundList = recordList
			} else {
				this.refundList = []
			}
		},
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
		},
		dialogVisible(newVlaue) {
			this.visible = newVlaue
			if (this.visible) {
				this._fundTransferRefundList()
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.title {
	margin: 20px 0;
}
</style>

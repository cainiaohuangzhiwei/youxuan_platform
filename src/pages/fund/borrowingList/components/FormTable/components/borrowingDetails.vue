<template>
	<yx-dialog title="借支业务" :visible.sync="visible" :bottomBtn="bottomBtn">
		<div>
			<yx-table :columns="tableColumns" :data="[itemInfo]">
				<template slot="accountInformation" slot-scope="scope">
					<div>
						<p>{{ scope.row.borrowerAccountName }}</p>
						<p>{{ scope.row.borrowingAccountId }}</p>
					</div>
				</template>
			</yx-table>
			<div class="title">偿还业务</div>
			<yx-table
				v-loading="showLoading"
				:columns="repayColumns"
				:data="list"
			></yx-table>
		</div>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxTable from '@wg-vue-materials/yx-table'
import { fundRepayList } from '@/api/accountService'
import { numberFormat, getConstantValueByKey } from '@/utils/helper/common'
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
		// 借支信息
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
			dialogData: {
				userName: '',
			},
			// 退款表格配置项
			repayColumns: [
				{
					type: 'string',
					dataIndex: 'repayRecordId',
					title: '偿还业务ID',
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'string',
					dataIndex: 'amount',
					title: '偿还金额',
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
							this.$store.state.app.constant.REPAY_STATUS,
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
					dataIndex: 'borrowingRecordId',
					title: '业务ID',
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'custom',
					dataIndex: 'accountInformation',
					title: '账户名称账户ID',
				},
				{
					type: 'string',
					dataIndex: 'amount',
					title: '借出金额',
					customRender: (row) => {
						return numberFormat(row.amount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'repayAmount',
					title: '归还金额',
					customRender: (row) => {
						return numberFormat(row.repayAmount, 2)
					},
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.LENDING_STATUS,
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
		_fundRepayList: async function () {
			this.showLoading = true
			let {
				data: {
					resultCode,
					resultData: { recordList = [] },
				},
			} = await fundRepayList({
				accountId: this.itemInfo.borrowingAccountId,
				borrowingRecordId: this.itemInfo.borrowingRecordId,
			})
			this.showLoading = false
			if (resultCode == 0) {
				this.list = recordList
			} else {
				this.list = []
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
				this._fundRepayList()
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

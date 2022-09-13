<template>
	<div>
		<el-dialog
			width="850px"
			title="规则配置变更记录"
			append-to-body
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="init"
			@close="resetIt"
		>
			<yx-table
				v-loading="loading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			>
				<template slot="ruleItemList" slot-scope="scope">
					<div>
						<p v-for="(item, index) in scope.row.ruleItemList" :key="index">
							{{ index === 0 ? '规则一：' : '规则二：'
							}}{{ substrIt(item.ruleOrderState) }}；{{
								item.ruleDays
							}}天；结算比例{{ item.ruleSettleProportion }}%
						</p>
					</div>
				</template>
			</yx-table>
		</el-dialog>
	</div>
</template>

<script>
import YxTable from '@wg-vue-materials/yx-table'
import { merchantSettleRuleHistory } from '@/api/orderSettle'
import { getConstantValueByKey } from '@/utils/helper/common'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxTable,
	},

	data() {
		return {
			loading: false,
			tableData: [],
			tableColumns: [
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '变更日期',
				},
				{
					type: 'custom',
					dataIndex: 'ruleItemList',
					title: '变更后配置',
				},
				{
					type: 'date',
					dataIndex: 'effectiveTime',
					title: '生效时间',
				},
				{
					dataIndex: 'operator',
					title: '变更人',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			funAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init()
					},
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
	methods: {
		substrIt(label) {
			let newLabel = getConstantValueByKey(
				this.$store.state.app.constant.RULE_ORDER_STATE,
				label,
				'-',
				'value',
				'label'
			)
			return newLabel.substr(3, newLabel.length)
		},
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = {
				supplierId: this.itemInfo.supplierId,
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			}
			return paramJson
		},
		resetIt() {
			this.tableData = []
		},
		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const {
				data: {
					resultCode,
					resultData: { merchantSettleRuleHistoryList = [], count = 0 },
				},
			} = await merchantSettleRuleHistory(paramJson)
			this.loading = false

			if (resultCode == 0 && merchantSettleRuleHistoryList.length > 0) {
				this.tableData = merchantSettleRuleHistoryList
				this.page.count = count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},

		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},
	},
}
</script>

<style lang="scss" scoped>
.btn {
	text-align: right;
}
</style>

<template>
	<el-dialog
		width="500px"
		title="奖励区间及内容"
		append-to-body
		:close-on-click-modal="false"
		:visible.sync="localVisible"
		:before-close="resetForm"
		v-loading="loading"
	>
		<div v-for="item in tableData" :key="item.actSaleRewardRuleDetailId">
			<span class="range">区间范围：{{ `${item.start} - ${item.end}` }}</span>
			<span v-if="item.fixedAmount">奖励{{ item.fixedAmount }}元</span>
			<span v-if="item.fixedAmount && item.commissionFactor">，</span>
			<span v-if="item.commissionFactor">佣金*{{ item.commissionFactor }}</span>
		</div>
	</el-dialog>
</template>

<script>
import { detailsList } from '@/api/userRewardSystem'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			searchData: {
				actSaleRewardRuleId: '',
			},
			tableData: [],
			loading: false,
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._detailsList()
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
		findSearchParams(flag) {
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.searchData, {
				length: this.page.length,
				currentPage: this.page.currentPage.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})
			return paramJson
		},

		details(row) {
			this.searchData.actSaleRewardRuleId = row.actSaleRewardRuleId
			this._detailsList(true)
		},

		async _detailsList(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await detailsList(paramJson)

			if (resultCode == 0) {
				this.tableData = resultData.records
				this.page.count = resultData.total
			} else {
				this.page.count = 0
				this.tableData = []
			}
			this.loading = false
		},

		resetForm() {
			this.localVisible = false
		},
	},
}
</script>

<style lang="scss" scoped>
.range {
	margin-right: 100px;
}
</style>

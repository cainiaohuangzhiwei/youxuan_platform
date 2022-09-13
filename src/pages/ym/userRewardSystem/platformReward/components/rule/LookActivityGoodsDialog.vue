<template>
	<el-dialog
		width="800px"
		title="参加活动的商品"
		append-to-body
		:close-on-click-modal="false"
		:visible.sync="localVisible"
		:before-close="resetForm"
		@open="init"
	>
		<YxTable
			ref="form"
			:data="tableData"
			:pagination="page"
			v-loading="loading"
			:columns="tableColumns"
		>
			<template slot="targetName" slot-scope="scope">
				<div class="slot">
					<div>
						<img
							class="goods_img"
							:src="getSmallImg(scope.row.defaultImageUrl)"
							alt=""
						/>
					</div>
					<div>
						<p>
							<span class="number">货号：{{ scope.row.goodsNumber }}</span>
							<el-tag
								v-if="shelfStateMapTag[goodsStateMap[scope.row.isSale]]"
								:type="shelfStateMapTag[goodsStateMap[scope.row.isSale]]"
								>{{ goodsStateMap[scope.row.isSale] }}</el-tag
							>
						</p>
						<p>{{ scope.row.targetName }}</p>
					</div>
				</div>
			</template>
		</YxTable>
	</el-dialog>
</template>

<script>
import { getSmallImg } from '@/utils/imageTool'
import { viewActSaleRewardTargetList } from '@/api/userRewardSystem'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		YxTable: () => import('@wg-vue-materials/yx-table'),
	},

	data() {
		return {
			loading: false,
			searchData: {
				actSaleRewardId: '',
				actSaleRewardRuleId: '',
			},
			tableData: [],
			tableColumns: [
				{
					title: '商品',
					type: 'custom',
					dataIndex: 'targetName',
				},
			],
			shelfStateMapTag: {
				在售: 'warning',
				待售: 'info',
			},
			goodsStateMap: {
				1: '在售',
				2: '待售',
			},
			getSmallImg,
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._viewActSaleRewardTargetList()
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
		details(row, actSaleRewardId) {
			this.searchData = {
				actSaleRewardId,
				actSaleRewardRuleId: row.actSaleRewardRuleId,
			}
			this._viewActSaleRewardTargetList(true)
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

		async _viewActSaleRewardTargetList(flag) {
			this.loading = true
			const paramJson = this.findSearchParams(flag)
			const {
				data: { resultCode, resultData },
			} = await viewActSaleRewardTargetList(paramJson)

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
			this.searchData = {
				actSaleRewardId: '',
				actSaleRewardRuleId: '',
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.slot {
	text-align: left;
	display: flex;
	align-items: center;
	justify-content: center;

	.goods_img {
		width: 50px;
		height: 50px;
		margin-right: 10px;
		line-height: 155px;
	}

	.number {
		margin-right: 10px;
	}
}
</style>

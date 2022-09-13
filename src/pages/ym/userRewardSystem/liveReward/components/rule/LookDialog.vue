<template>
	<el-dialog
		class="look"
		width="770px"
		title="查看活动"
		append-to-body
		v-loading="loading"
		:close-on-click-modal="false"
		:visible.sync="localVisible"
		:before-close="resetForm"
	>
		<YxInfo :column="'1'" :items="items" :data="activityInfo">
			<template #activityContent>
				<div class="look__wrap">
					<p>活动内容：</p>
					<YxTable
						class="table"
						:columns="activityColumns"
						:data="activityInfo.rewardRuleList"
					>
						<template slot="participationScopes" slot-scope="scope">
							<template v-if="scope.row.targetType == 1">
								商品
								<el-button type="text" @click="lookGoods(scope.row)"
									>查看商品</el-button
								>
							</template>
							<template v-if="scope.row.targetType == 3">
								品牌
								<el-button type="text" @click="lookBrand(scope.row)"
									>查看品牌</el-button
								>
							</template>
						</template>
						<template slot="rewardInterval" slot-scope="scope">
							<el-button type="text" @click="handleLookAward(scope.row)"
								>查看</el-button
							>
						</template>
					</YxTable>
				</div>
			</template>
		</YxInfo>

		<el-tabs class="look__tabs" v-model="activeName">
			<YxForm
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			/>

			<el-tab-pane label="参与用户" name="first">
				<YxTable :data="tableData" :pagination="page" :columns="tableColumns" />
			</el-tab-pane>
		</el-tabs>

		<LookGoodsDialog ref="goods" :visible.sync="lookGoodsDialog" />
		<LookActivityGoodsDialog
			ref="activityGoods"
			:visible.sync="lookActivityGoodsDialog"
		/>
		<LookActivityBrandDialog
			ref="activityBrand"
			:visible.sync="lookActivityBrandDialog"
		/>
		<UserDetailDialog ref="userDetail" :visible.sync="userDetailDialog" />
	</el-dialog>
</template>

<script>
import moment from 'moment'
import {
	viewActSaleReward,
	viewActSaleRewardUser,
} from '@/api/userRewardSystem'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		YxInfo: () => import('@wg-vue-materials/yx-info'),
		YxForm: () => import('@wg-vue-materials/yx-form'),
		YxTable: () => import('@wg-vue-materials/yx-table'),
		LookGoodsDialog: () => import('./LookGoodsDialog'),
		UserDetailDialog: () => import('./UserDetailDialog'),
		LookActivityBrandDialog: () => import('./LookActivityBrandDialog'),
		LookActivityGoodsDialog: () => import('./LookActivityGoodsDialog'),
	},

	data() {
		return {
			activityInfo: {
				activityName: '',
				time: '',
				deadline: '',
				activityType: '',
				activityContent: '',
				rewardRuleList: [],
			},
			actSaleRewardId: '',
			items: [
				{
					type: 'string',
					title: '活动名称',
					dataIndex: 'activityName',
				},
				{
					type: 'string',
					title: '活动参与时间',
					dataIndex: 'time',
				},
				{
					type: 'date',
					title: '奖励截止时间',
					dataIndex: 'deadline',
				},
				{
					title: '活动类型',
					dataIndex: 'activityType',
				},
				{
					type: 'custom',
					dataIndex: 'activityContent',
				},
			],
			searchData: {
				actSaleRewardId: '',
				participateUserId: '',
			},
			loading: false,
			lookGoodsDialog: false,
			lookActivityBrandDialog: false,
			userDetailDialog: false,
			lookActivityGoodsDialog: false,
			tableData: [],
			activeName: 'first',
			finishTypeMap: {
				1: '出单商品数量',
				2: '出单',
			},
			activityColumns: [
				{
					title: '子活动',
					dataIndex: 'subactivityIndex',
				},
				{
					title: '完成指标',
					dataIndex: 'finishType',
					customRender: ({ finishType }) => {
						return this.finishTypeMap[finishType]
					},
				},
				{
					type: 'custom',
					title: '参与范围',
					dataIndex: 'participationScopes',
				},
				{
					type: 'custom',
					title: '奖励区间及内容',
					dataIndex: 'rewardInterval',
				},
			],
			tableColumns: [
				{
					title: '用户名称',
					dataIndex: 'userName',
				},
				{
					title: '用户ID',
					dataIndex: 'userId',
				},
				{
					title: '有效商品数',
					dataIndex: 'ruleEffectiveQuantity',
				},
				{
					title: '奖励金额',
					dataIndex: 'ruleRewardAmount',
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '查看详情',
							click: (row) => {
								this.handleDetails(row)
							},
						},
					],
				},
			],
			searchCfg: [
				{
					title: '用户ID',
					placeholder: '请输入用户ID',
					dataIndex: 'participateUserId',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._viewActSaleRewardUser()
				},
			},
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._viewActSaleRewardUser()
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

		async _viewActSaleReward(actSaleRewardId) {
			this.searchData.actSaleRewardId = actSaleRewardId
			this.loading = true

			const params = {
				actSaleRewardId,
				withTargetDetail: true,
			}
			const {
				data: { resultCode, resultData },
			} = await viewActSaleReward(params)

			if (resultCode == 0) {
				const activityTypeMap = {
					1: '连续型 ',
					2: '累计型',
				}
				const { startTime, endTime, activityType } = resultData

				resultData.time =
					moment(startTime).format('YYYY年MM月DD日HH:mm') +
					'-' +
					moment(endTime).format('YYYY年MM月DD日HH:mm')
				resultData.activityType = activityTypeMap[activityType]
				for (let i = 0; i < resultData.rewardRuleList.length; i++) {
					resultData.rewardRuleList[i].subactivityIndex = i + 1
				}
				this.activityInfo = resultData
			}
			this._viewActSaleRewardUser()
		},

		async _viewActSaleRewardUser(flag) {
			this.loading = true
			const paramJson = this.findSearchParams(flag)
			const {
				data: { resultCode, resultData },
			} = await viewActSaleRewardUser(paramJson)

			if (resultCode == 0) {
				this.tableData = resultData.records
				this.page.count = resultData.total
			} else {
				this.page.count = 0
				this.tableData = []
			}
			this.loading = false
		},

		handleDetails(row) {
			this.userDetailDialog = true
			this.$nextTick(() => {
				this.$refs.userDetail.details(row)
			})
		},

		handleLookAward(row) {
			this.lookGoodsDialog = true
			this.$nextTick(() => {
				this.$refs.goods.details(row)
			})
		},

		lookGoods(row) {
			this.lookActivityGoodsDialog = true
			this.$nextTick(() => {
				this.$refs.activityGoods.details(row, this.searchData.actSaleRewardId)
			})
		},
		lookBrand(row) {
			this.lookActivityBrandDialog = true
			this.$nextTick(() => {
				this.$refs.activityBrand.details(row, this.searchData.actSaleRewardId)
			})
		},

		resetForm() {
			this.localVisible = false
		},
	},
}
</script>

<style lang="scss" scoped>
.look {
	&__wrap {
		display: flex;

		.table {
			width: 90%;
			margin-top: 10px;
		}
	}

	&__tabs {
		margin-top: 20px;
	}
}
</style>

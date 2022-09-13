<template>
	<div>
		<div>
			<p style="color: red; font-size: 22px">版本ID</p>
			{{ flowRuleIdNew || flowRuleId }}
		</div>
		<div>
			<p style="color: red; font-size: 22px">物品类型</p>
			{{
				(
					returnContentList.find((x) => x.value === item.returnContentType) ||
					{}
				).label || ''
			}}
		</div>
		<div v-if="item.returnContentType != 'SEARCH'">
			<p style="color: red; font-size: 22px">召回服务</p>
			<el-row>
				<template>
					<el-table
						v-loading="item.showLoading"
						:data="item.tableData"
						border
						style="width: 100%"
					>
						<el-table-column label="序号" align="center">
							<template slot-scope="scope">
								<span>{{ scope.$index + 1 }}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="recallModelName"
							label="服务名称"
							align="center"
						>
						</el-table-column>
						<el-table-column
							prop="maxReturnQuantity"
							label="物品数量"
							align="center"
						>
						</el-table-column>
					</el-table>
					<div class="pagBox">
						<custom-paging
							:total="item.total"
							:length="item.pageSize"
							:currentPage="item.pageNum"
							@tableChange="tableChange"
							@sizeChange="sizeChange"
							@currentChange="currentChange"
						></custom-paging>
					</div>
				</template>
			</el-row>
		</div>
		<div v-if="item.returnContentType != 'SEARCH'">
			<p style="color: red; font-size: 22px">排序服务</p>
			{{
				item.ranking.label && item.ranking.value
					? item.ranking.label + '———' + item.ranking.value
					: ''
			}}
		</div>
		<div v-if="item.returnContentType == 'SEARCH'">
			<p style="color: red; font-size: 22px">搜索服务</p>
			{{ item.rankingSearch.label ? item.rankingSearch.label : '' }}
		</div>
		<div>
			<p style="color: red; font-size: 22px">业务规则</p>
			<el-row>
				<template>
					<el-table
						v-loading="item.bsShowLoading"
						:data="item.bsTableData"
						border
						style="width: 100%"
					>
						<el-table-column prop="priority" label="优先级" align="center">
						</el-table-column>
						<el-table-column
							prop="strategyName"
							label="策略名称"
							align="center"
						>
						</el-table-column>
						<el-table-column prop="address" label="生效时间" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.enableType == 0">一直生效</span>
								<span v-if="scope.row.enableType == 1">
									{{ moment(scope.row.startTime).format('YYYY.MM.DD') }}-{{
										scope.row.endTime
											? moment(scope.row.endTime).format('YYYY.MM.DD')
											: '永不结束'
									}}
								</span>
							</template>
						</el-table-column>
					</el-table>
					<div class="pagBox">
						<custom-paging
							:total="item.bsTotal"
							:length="item.bsPageSize"
							:currentPage="item.bsPageNum"
							@tableChange="bsTableChange"
							@sizeChange="sizeChange"
							@currentChange="currentChange"
						></custom-paging>
					</div>
				</template>
			</el-row>
		</div>
	</div>
</template>

<script>
import moment from 'moment'
import customPaging from './customPaging'
import {
	rcFlowRuleGet,
	rcBizStrategyList,
	rcRecallRuleList,
	newFlowRule,
	rcSortRuleGet,
	rcSearchRuleSearch,
} from '@/api/scene'
export default {
	props: {
		returnContentList: {
			type: Array,
			default: () => [],
		},
		abtStrategyId: {
			type: Number,
		},
		flowRuleId: {
			type: Number,
		},
		online: {
			type: Boolean,
		},
	},
	components: { customPaging },
	data() {
		return {
			item: {
				pageNum: 1,
				pageSize: 10,
				total: 0,
				showLoading: false,
				tableData: [],
				bsPageNum: 1,
				bsPgeSize: 10,
				bsTotal: 0,
				bsShowLoading: false,
				bsTableData: [],
				rcSortObj: {},
				ranking: '',
				rankingSearch: '',
				newSortRuleId: '',
				returnContentType: '',
			},
			flowRuleIdNew: '',
			moment: moment,
			params: this.$route.params,
		}
	},
	mounted() {
		if (this.flowRuleId) {
			this._rcRecallRuleAuditList()
			this._rcBizStrategyAuditQueryList()
			!this.online && this._rcFlowRuleGet()
		} else {
			this._newFlowRule()
		}
	},
	watch: {
		flowRuleId: function () {
			if (!this.flowRuleId) return
			this._rcRecallRuleAuditList()
			this._rcBizStrategyAuditQueryList()
			!this.online && this._rcFlowRuleGet()
		},
	},
	methods: {
		// 最新版本的ruleId
		async _newFlowRule() {
			let { data } = await newFlowRule({
				abtStrategyId: this.abtStrategyId,
				sceneId: this.params.sceneId,
			})
			if (data.resultCode == 0) {
				if (data.resultData) {
					this.flowRuleId = data.resultData.flowRuleId
					this.flowRuleIdNew = data.resultData.flowRuleId
					this.item.returnContentType = data.resultData.returnContentType
					this._rcSortRuleAuditGet(this.item.returnContentType)
				}
			}
		},
		// 历史版本的基本信息
		async _rcSortRuleAuditGet(returnContentType) {
			let params = {
				id: this.flowRuleId,
				abtStrategyId: this.abtStrategyId,
			}
			let Url =
				returnContentType == 'SEARCH' ? rcSearchRuleSearch : rcSortRuleGet
			let { data } = await Url(params)
			if (data.resultCode == 0) {
				if (data.resultData) {
					this.item.rcSortObj = data.resultData
					if (returnContentType == 'SEARCH') {
						this.item.rankingSearch = {
							value: JSON.parse(
								JSON.stringify(data.resultData.algorithmModel || '')
							),
							name: JSON.parse(
								JSON.stringify(data.resultData.algorithmModelName || '')
							),
							label: JSON.parse(
								JSON.stringify(data.resultData.algorithmModelName || '')
							),
						}
					} else {
						this.item.ranking = {
							value: JSON.parse(
								JSON.stringify(data.resultData.algorithmModel || '')
							),
							name:
								JSON.parse(
									JSON.stringify(data.resultData.algorithmModelName || '')
								) +
								'———' +
								JSON.parse(
									JSON.stringify(data.resultData.algorithmModel || '')
								),
							label: JSON.parse(
								JSON.stringify(data.resultData.algorithmModelName || '')
							),
						}
					}
				}
			}
		},
		async _rcFlowRuleGet() {
			let params = {
				id: this.flowRuleId,
			}
			let { data } = await rcFlowRuleGet(params)
			if (data.resultCode == 0) {
				if (data.resultData) {
					this.item.returnContentType = data.resultData.returnContentType
					this._rcSortRuleAuditGet(this.item.returnContentType)
				}
			}
		},
		tableChange(val) {
			this.item.pageNum = val.pageNum
			this.item.pageSize = val.pageSize
			this._rcRecallRuleAuditList(this.item)
		},
		bsTableChange(val) {
			this.item.bsPageNum = val.pageNum
			this.item.bsPageSize = val.pageSize
			this._rcBizStrategyAuditQueryList(this.item)
		},
		findSearchParams() {
			//搜索条件
			let paramJson = {
				pageNum: 0,
				pageSize: 1,
				abtStrategyId: this.abtStrategyId,
				sceneId: this.params.sceneId,
				id: this.flowRuleId,
			}
			// 每页的加载数据长度
			paramJson.pageSize = this.item.pageSize
			// 当前页的条数开始
			paramJson.pageNum = this.item.pageNum
			return paramJson
		},
		_rcRecallRuleAuditList: async function () {
			this.item.showLoading = true
			let params = this.findSearchParams()
			let { data } = await rcRecallRuleList(params)
			this.item.showLoading = false
			if (data.resultCode == 0) {
				this.item.tableData = data.resultData
				this.item.total = data.total
			} else {
				this.item.total = 0
				this.item.tableData = []
			}
		},
		bsFindSearchParams() {
			//搜索条件
			let paramJson = {
				pageNum: 0,
				pageSize: 1,
				abtStrategyId: this.abtStrategyId,
				sceneId: this.params.sceneId,
				id: this.flowRuleId,
			}
			// 每页的加载数据长度
			paramJson.pageSize = this.item.bsPageSize
			// 当前页的条数开始
			paramJson.pageNum = this.item.bsPageNum
			return paramJson
		},
		_rcBizStrategyAuditQueryList: async function () {
			this.item.bsShowLoading = true
			let params = this.bsFindSearchParams()
			let { data } = await rcBizStrategyList(params)
			this.item.bsShowLoading = false
			if (data.resultCode == 0) {
				this.item.bsTableData = data.resultData
				this.item.bsTotal = data.total
			} else {
				this.item.bsTotal = 0
				this.item.bsTableData = []
			}
		},
	},
}
</script>

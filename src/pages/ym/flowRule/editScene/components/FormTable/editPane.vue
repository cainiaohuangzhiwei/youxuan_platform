<template>
	<div>
		<div>
			<p style="color: red; font-size: 22px">物品类型</p>
			<el-select
				v-model="item.returnContentType"
				value-key="value"
				placeholder="请选择物品类型"
				style="width: 700px"
				:disabled="!isAdminAuth"
				@change="objectTypeChange"
			>
				<el-option
					v-for="opt in returnContentList"
					:key="opt.value"
					:value="opt.value"
					:label="opt.label"
				></el-option>
			</el-select>
		</div>
		<div>
			<div v-if="item._returnContentType != 'SEARCH'">
				<p style="color: red; font-size: 22px">召回服务</p>
				<el-button
					v-if="isAdminAuth"
					style="margin-bottom: 15px"
					type="primary"
					icon="el-icon-plus"
					@click="handleAddRecall()"
					>新增召回服务</el-button
				>
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
							<el-table-column label="操作" align="center">
								<template slot-scope="scope">
									<div v-if="isAdminAuth">
										<el-button size="mini" @click="recallEdit(scope.row)"
											>编辑</el-button
										>
										<el-button
											size="mini"
											type="danger"
											@click="recallDelete(scope.row)"
											>删除</el-button
										>
									</div>
									<div v-else>--</div>
								</template>
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
			<div v-if="item._returnContentType != 'SEARCH'">
				<p style="color: red; font-size: 22px">排序服务</p>
				<el-select
					v-model="item.ranking"
					value-key="value"
					:placeholder="'请选择排序服务内容'"
					style="width: 700px"
					popper-class="selectOptions"
					:disabled="!isAdminAuth"
					@change="rankChange(item)"
				>
					<el-option
						v-for="ite in rankingModelList"
						:key="ite.value"
						:label="ite.name"
						:value="ite"
					>
					</el-option>
				</el-select>
			</div>
			<div v-if="item._returnContentType == 'SEARCH'">
				<p style="color: red; font-size: 22px">搜索服务</p>
				<el-select
					v-model="item.rankingSearch"
					value-key="value"
					:placeholder="'请选择搜索服务内容'"
					style="width: 700px"
					popper-class="selectOptions"
					:disabled="!isAdminAuth"
					@change="rankChange(item)"
				>
					<el-option
						v-for="ite in searchModelList"
						:key="ite.value"
						:label="ite.name"
						:value="ite"
					>
					</el-option>
				</el-select>
			</div>
			<div>
				<p style="color: red; font-size: 22px">业务规则</p>
				<el-button
					v-if="isEditAuth"
					style="margin-bottom: 15px"
					type="primary"
					icon="el-icon-plus"
					@click="handleAddStrategy()"
					>新增业务策略</el-button
				>
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
							<el-table-column label="操作" align="center">
								<template slot-scope="scope">
									<div v-if="isEditAuth">
										<el-button size="mini" @click="bsEdit(scope.row)"
											>编辑</el-button
										>
										<el-button
											size="mini"
											type="danger"
											@click="bsDelete(scope.row)"
											>删除</el-button
										>
									</div>
									<div v-else>--</div>
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

		<!-- 没有编辑权限的隐藏保存和发布按钮，或者按钮置为disable -->
		<div style="text-align: right; margin-top: 15px">
			<el-button size="medium" @click="isShow(item, false)">收起</el-button>
			<el-button
				v-if="isEditAuth"
				size="medium"
				type="primary"
				@click="handlePublish(item)"
				>提交审核</el-button
			>
		</div>

		<recall-service
			:visible.sync="recallServiceDialog"
			:recallServiceRow="recallServiceRow"
			:paramsRow="paramsRow"
			@recallRefresh="recallRefresh"
			:returnContentType="item.returnContentType"
		></recall-service>
		<business-strategy
			:visible.sync="businessStrategyDialog"
			:businessStrategyRow="businessStrategyRow"
			:bsRow="bsRow"
			@strategyRefresh="strategyRefresh"
			:returnContentType="item.returnContentType"
		></business-strategy>
	</div>
</template>

<script>
import moment from 'moment'
import customPaging from './customPaging'
import recallService from './recallService'
import businessStrategy from './businessStrategy'
import {
	rcFlowRuleRecordUpdateUser,
	rcRecallRuleAuditList,
	rcRecallRuleAuditDeleteById,
	rcBizStrategyAuditQueryList,
	rcBizStrategyAuditDeleteById,
	// rcBizSceneReleaseScene,
	rcSortRuleAuditGet,
	rcSortRuleAuditAdd,
	rcSortRuleAuditUpdateById,
	switchObjectType,
	rcShopSceneAuditAdd,
	shopSceneIsEditAuth,
	getByWaitingAudit,
	auditAdd,
	rcSortRuleAuditGetSearch,
	updateByIdSearch,
} from '@/api/scene'
export default {
	props: {
		item: {
			type: Object,
			value: () => {},
		},
		index: {
			type: Number,
		},
		returnContentList: {
			type: Array,
			default: () => [],
		},
		abtIdParent: {
			type: Number,
		},
		shopSceneId: {
			type: Number,
		},
	},
	components: { recallService, businessStrategy, customPaging },
	data() {
		return {
			searchRuleId: null,
			moment: moment,
			params: this.$route.params,
			recallServiceDialog: false,
			recallServiceRow: {},
			businessStrategyDialog: false,
			businessStrategyRow: {},
			paramsRow: {},
			bsRow: {},
			rankingModelList: [],
			searchModelList: [],
			isAdminAuth: false,
			isEditAuth: false, // 编辑权限
		}
	},
	watch: {
		'item._returnContentType': function (val) {
			this.rankingModelList = this.item.rankingModelList.filter(
				(x) => x.returnContentType === val
			)
		},
		'item.rankingModelList': function (val) {
			this.rankingModelList = val.filter(
				(x) => x.returnContentType === this.item._returnContentType
			)
		},
	},
	async mounted() {
		if (this.item.rankingModelList) {
			this.rankingModelList = this.item.rankingModelList.filter(
				(x) => x.returnContentType === this.item._returnContentType
			)
		}
		if (this.item.searchModelList) {
			this.searchModelList = this.item.searchModelList
		}
		// 检查当前是否有版本在审核
		const isChecking = await this.checkEditAuth()
		if (!isChecking) {
			const accountType = this.$store.state.user.rcAuthAccount.accountType || 0
			if (accountType === 1) {
				// 普通管理员-兼容
				if (this.shopSceneId) {
					shopSceneIsEditAuth({ shopSceneId: this.shopSceneId }).then(
						({ data }) => {
							// 业务策略
							this.isEditAuth = data.resultData
						}
					)
				}
			} else if (accountType > 1) {
				this.isEditAuth = true
				// 编辑除业务策略外的情况
				this.isAdminAuth = true
			}
		}

		this._rcRecallRuleAuditList(this.item)
		this._rcBizStrategyAuditQueryList(this.item)
		this._rcSortRuleAuditGet(this.item)
	},
	methods: {
		async checkEditAuth() {
			const {
				data: { resultCode, resultData },
			} = await getByWaitingAudit({
				abtStrategyId: this.item.abtStrategyId,
				sceneId: this.params.sceneId,
			})
			if (resultCode == 0 && resultData.shopSceneAuditId) {
				this.$alert(
					'当前场景策略已存在待审核记录，请通知管理员审核通过后再编辑提交！',
					'提示',
					{
						confirmButtonText: '确定',
					}
				)
				this.closeEdit()
				return true
			}
			return false
		},
		closeEdit() {
			this.isEditAuth = false
			this.isAdminAuth = false
		},
		isShow(item) {
			this.$emit('showChange', item)
		},
		// 物品类型
		objectTypeChange(value) {
			const _this = this
			if (value && value !== this.item._returnContentType) {
				this.$confirm(
					`当前物品类型为 ${
						this.item._returnContentType === 'GOODS'
							? '商品'
							: this.item._returnContentType === 'SEARCH'
							? '搜索'
							: '会场'
					}，如果切换为  ${
						value === 'GOODS' ? '商品' : value === 'SEARCH' ? '搜索' : '会场'
					}，已编辑好的召回，排序和业务策略都会清空。`,
					'提示',
					{
						type: 'warning',
						async callback(action) {
							if (action === 'confirm') {
								_this.clearData()
							} else {
								_this.item.returnContentType = _this.item._returnContentType
							}
						},
					}
				)
			}
		},
		// 清空数据
		clearData() {
			this.item._returnContentType = this.item.returnContentType
			if (this.item._returnContentType == 'SEARCH') {
				if (this.item.searchModelList.length > 0) {
					this.searchModelList = this.item.searchModelList
				}
			}
			switchObjectType({
				abtStrategyId: this.item.abtStrategyId,
				returnContentType: this.item.returnContentType,
				sceneId: this.params.sceneId,
				userId: this.$store.state.user.userInfo.userId,
			})
			this.searchRuleId = null
			this.item = {
				...this.item,
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
			}
			this.$emit('clear', this.item)
		},
		async rankChange(item) {
			let params = {
				abtStrategyId: item.abtStrategyId,
				sceneId: this.params.sceneId,
				algorithmModel:
					this.item._returnContentType != 'SEARCH'
						? item.ranking.value
						: item.rankingSearch.value,
				algorithmModelName:
					this.item._returnContentType != 'SEARCH'
						? item.ranking.label
						: item.rankingSearch.label,
			}
			if (item.rcSortObj.sortRuleId || item.rcSortObj.sortRuleId == 0) {
				params.sortRuleId = item.rcSortObj.sortRuleId
				params.sortId =
					this.item._returnContentType != 'SEARCH'
						? item.ranking.id
						: item.rankingSearch.id
				params.updateUser = this.$store.state.user.userInfo.userId
			} else {
				params.sortId =
					this.item._returnContentType != 'SEARCH'
						? item.ranking.id
						: item.rankingSearch.id
				params.addUser = this.$store.state.user.userInfo.userId
			}
			if (this.item._returnContentType == 'SEARCH') {
				params.searchId = item.rankingSearch.id
				if (!item.rankingSearch.id) {
					params.addUser = this.$store.state.user.userInfo.userId
				} else {
					params.searchRuleId = this.searchRuleId
					params.updateUser = this.$store.state.user.userInfo.userId
				}
			}
			console.log('66666666', this.searchRuleId, item)
			let { data } =
				item.rcSortObj.sortRuleId || item.rcSortObj.sortRuleId == 0
					? await rcSortRuleAuditUpdateById(params)
					: this.item._returnContentType == 'SEARCH' && !this.searchRuleId
					? await auditAdd(params)
					: item.returnContentType == 'SEARCH' && item.rankingSearch.id
					? await updateByIdSearch(params)
					: await rcSortRuleAuditAdd(params)
			if (data.resultCode == 0) {
				this._rcFlowRuleRecordUpdateUser(item)
				if (item.rcSortObj.sortRuleId || item.rcSortObj.sortRuleId == 0) {
					this.$message.success('修改成功')
				} else {
					this.$message.success('成功')
				}
				item.rcSortObj = data.resultData
			}
		},
		findSearchParams(item) {
			//搜索条件
			let paramJson = {
				pageNum: 0,
				pageSize: 1,
				abtStrategyId: item.abtStrategyId,
				sceneId: this.params.sceneId,
			}
			// 每页的加载数据长度
			paramJson.pageSize = item.pageSize
			// 当前页的条数开始
			paramJson.pageNum = item.pageNum
			return paramJson
		},
		_rcRecallRuleAuditList: async function (item) {
			item.showLoading = true
			let params = this.findSearchParams(item)
			let { data } = await rcRecallRuleAuditList(params)
			item.showLoading = false
			if (data.resultCode == 0) {
				item.tableData = data.resultData
				item.total = data.total
			} else {
				item.total = 0
				item.tableData = []
			}
		},
		bsFindSearchParams(item) {
			//搜索条件
			let paramJson = {
				pageNum: 0,
				pageSize: 1,
				abtStrategyId: item.abtStrategyId,
				sceneId: this.params.sceneId,
			}
			// 每页的加载数据长度
			paramJson.pageSize = item.bsPageSize
			// 当前页的条数开始
			paramJson.pageNum = item.bsPageNum
			return paramJson
		},
		_rcBizStrategyAuditQueryList: async function (item) {
			item.bsShowLoading = true
			let params = this.bsFindSearchParams(item)
			let { data } = await rcBizStrategyAuditQueryList(params)
			item.bsShowLoading = false
			if (data.resultCode == 0) {
				item.bsTableData = data.resultData
				item.bsTotal = data.total
			} else {
				item.bsTotal = 0
				item.bsTableData = []
			}
		},
		async _rcSortRuleAuditGet(item) {
			let params = {
				abtStrategyId: item.abtStrategyId,
				sceneId: this.params.sceneId,
			}
			let Url = rcSortRuleAuditGet
			if (item._returnContentType == 'SEARCH') {
				Url = rcSortRuleAuditGetSearch
			}
			let { data } = await Url(params)
			if (data.resultCode == 0) {
				if (data.resultData) {
					item.rcSortObj = data.resultData
					if (this.item._returnContentType != 'SEARCH') {
						item.ranking = {
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
					} else {
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
						this.searchRuleId = data.resultData.searchRuleId
					}
				}
			}
			this.item = { ...this.item }
		},
		handleAddRecall() {
			this.recallServiceRow = {}
			this.paramsRow = {
				abtStrategyId: this.item.abtStrategyId,
				sceneId: this.params.sceneId,
				flowRuleRecordId: this.item.flowRuleRecordId,
			}
			this.recallServiceDialog = true
		},
		recallEdit(row) {
			this.paramsRow = {
				abtStrategyId: this.item.abtStrategyId,
				sceneId: this.params.sceneId,
				flowRuleRecordId: this.item.flowRuleRecordId,
			}
			this.recallServiceRow = row
			this.recallServiceDialog = true
		},
		async recallDelete(row) {
			let params = {
				id: row.recallRuleId,
			}
			let {
				data: { resultCode },
			} = await rcRecallRuleAuditDeleteById(params)
			if (resultCode == 0) {
				this._rcFlowRuleRecordUpdateUser(this.item)
				this.$message.success('删除成功')
				// item.pageSize = 10
				// item.pageNum = 1
				this._rcRecallRuleAuditList(this.item)
			}
		},
		async bsDelete(row) {
			let params = {
				id: row.strategyId,
			}
			let {
				data: { resultCode },
			} = await rcBizStrategyAuditDeleteById(params)
			if (resultCode == 0) {
				this._rcFlowRuleRecordUpdateUser(this.item)
				this.$message.success('删除成功')
				// item.bsPageSize = 10
				// item.bsPageNum = 1
				this._rcBizStrategyAuditQueryList(this.item)
			}
		},
		recallRefresh() {
			this._rcRecallRuleAuditList(this.item)
		},
		strategyRefresh() {
			this._rcBizStrategyAuditQueryList(this.item)
		},
		handleAddStrategy() {
			this.bsRow = {
				abtStrategyId: this.item.abtStrategyId,
				sceneId: this.params.sceneId,
				flowRuleRecordId: this.item.flowRuleRecordId,
			}
			this.businessStrategyRow = {}
			this.businessStrategyDialog = true
		},
		bsEdit(row) {
			this.bsRow = {
				abtStrategyId: this.item.abtStrategyId,
				sceneId: this.params.sceneId,
				flowRuleRecordId: this.item.flowRuleRecordId,
			}
			this.businessStrategyRow = row
			this.businessStrategyDialog = true
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
		async _rcFlowRuleRecordUpdateUser(item) {
			let params = {
				userId: this.$store.state.user.userInfo.userId,
				flowRuleRecordId: item.flowRuleRecordId,
			}
			await rcFlowRuleRecordUpdateUser(params)
		},
		handleHold: async function () {
			const item = this.item
			if (this.item._returnContentType != 'SEARCH') {
				if (!item.tableData.length) {
					return this.$message.warning('召回服务不能为空')
				} else if (!item.ranking) {
					return this.$message.warning('排序服务不能为空')
				} else if (!item.bsTableData.length) {
					return this.$message.warning('业务策略不能为空')
				}
			} else {
				if (!item.rankingSearch) {
					return this.$message.warning('搜索服务不能为空')
				}
			}
		},
		handlePublish: async function () {
			const item = this.item
			if (this.item._returnContentType != 'SEARCH') {
				if (!item.tableData.length) {
					return this.$message.warning('召回服务不能为空')
				} else if (!item.ranking) {
					return this.$message.warning('排序服务不能为空')
				}
			} else {
				if (!item.rankingSearch) {
					return this.$message.warning('搜索服务不能为空')
				}
			}

			//  else if (!item.bsTableData.length) {
			// 	return this.$message.warning('业务策略不能为空')
			// }
			if (!this.shopSceneId) return

			let params = {
				abtId: this.abtIdParent,
				abtStrategyId: item.abtStrategyId,
				sceneId: this.params.sceneId,
				shopSceneId: this.shopSceneId,
				userId: this.$store.state.user.userInfo.userId,
			}
			// return
			// let { data } = await rcBizSceneReleaseScene(params)
			let { data } = await rcShopSceneAuditAdd(params)
			if (data.resultCode == 0) {
				this.$message.success('提交成功')
				this.$router.push({ name: 'sceneManagement' })
				this.closeEdit()
				this.$emit('refresh')
			} else {
				this.$router.push({ name: 'sceneManagement' })
			}
		},
	},
}
</script>

<style lang="scss">
.selectOptions {
	max-width: 50%;
}
</style>

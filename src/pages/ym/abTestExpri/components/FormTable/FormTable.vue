<template>
	<div>
		<h2 class="test-name">{{ curTestInfo.testName }}</h2>
		<el-container>
			<el-aside class="expri-list-wrap">
				<div
					@click="toggleExpri(item, index)"
					v-for="(item, index) in expriList"
					:key="item.id"
				>
					<el-card
						shadow="never"
						class="expri-list"
						v-bind:class="{ 'expri-list-active': curIndex == index }"
					>
						<div class="expri-buttons">
							<el-button
								class="expri-button"
								type="primary"
								plain
								icon="el-icon-edit"
								circle
								@click.stop="addOrUpdateExpriHandle(item)"
							></el-button>
							<el-button
								class="expri-button"
								type="danger"
								plain
								icon="el-icon-delete"
								circle
								@click.stop="removeExpri(item.id, index)"
							></el-button>
						</div>
						<div>实验ID：{{ item.id }}</div>
						<div class="expriment-name">
							{{ item.experimentName }}
						</div>
						<div class="text item">流量分配：{{ item.rate }}%</div>
					</el-card>
				</div>
				<div class="expri-list">
					<el-button
						@click="addOrUpdateExpriHandle"
						style="width: 100%; padding: 30px 0; border-radius: 0"
					>
						<i class="el-icon-circle-plus-outline"></i> 添加实验
					</el-button>
				</div>
			</el-aside>
			<el-main>
				<div
					v-if="dataLoaded && expriList.length === 0"
					style="text-align: center; line-height: 300px; color: #909399"
				>
					请先添加实验
				</div>
				<template v-else>
					<el-card class="box-card mt10">
						<div slot="header" class="clearfix">
							<span class="fb">策略列表</span>
							<el-button
								v-if="!strategyEditState"
								style="float: right; margin-left: 10px"
								size="mini"
								icon="el-icon-edit"
								type="primary"
								@click="startEdit"
								>设置策略</el-button
							>
							<template v-else>
								<el-button
									style="float: right; margin-left: 10px"
									size="mini"
									icon="el-icon-refresh"
									type="warning"
									@click="cancelEdit"
									>取消</el-button
								>
								<el-button
									style="float: right; margin-left: 10px"
									type="success"
									size="mini"
									icon="el-icon-check"
									@click="confirmEdit"
									>保存</el-button
								>
								<el-button
									style="float: right; margin-left: 10px"
									size="mini"
									plain
									icon="el-icon-plus"
									@click="addEdit"
									>添加策略</el-button
								>
							</template>
						</div>
						<div class="card-content">
							<el-form :model="strategyList" ref="strategyForm">
								<el-table
									v-loading="listLoading"
									:data="strategyList"
									border
									fit
									highlight-current-row
									style="width: 100%"
								>
									<el-table-column align="center" label="策略ID" width="80">
										<template slot-scope="{ row }">
											<span>{{ row.id }}</span>
										</template>
									</el-table-column>
									<el-table-column min-width="300px" label="策略名称">
										<template slot-scope="{ $index }">
											<template v-if="strategyEditState">
												<el-form-item
													:prop="$index + '.strategyName'"
													label=""
													:rules="[
														{
															required: true,
															message: '请输入策略名称',
															trigger: 'blur',
														},
													]"
												>
													<el-input
														v-model.trim="strategyList[$index].strategyName"
														class="edit-input"
														size="small"
														maxlength="20"
													/>
												</el-form-item>
											</template>
											<span v-else>{{
												strategyList[$index].strategyName
											}}</span>
										</template>
									</el-table-column>
									<el-table-column
										width="250"
										label="人群ID"
										v-if="curStrategyType === 2"
									>
										<template slot-scope="{ $index }">
											<template v-if="strategyEditState">
												<el-form-item
													:prop="$index + '.userGroupId'"
													label=""
													:rules="[
														{
															required: true,
															message: '请输入人群ID',
															trigger: 'blur',
														},
													]"
												>
													<el-input-number
														class="edit-input"
														size="small"
														min="1"
														:precision="0"
														:controls="false"
														v-model.trim="strategyList[$index].userGroupId"
														label="描述文字"
													></el-input-number>
												</el-form-item>
											</template>
											<span v-else>{{ strategyList[$index].userGroupId }}</span>
										</template>
									</el-table-column>
									<el-table-column width="250" label="流量（%）" v-else>
										<template slot-scope="{ $index }">
											<template v-if="strategyEditState">
												<el-form-item
													:prop="$index + '.rate'"
													label=""
													:rules="[
														{
															required: true,
															message: '请设置流量占比',
															trigger: 'blur',
														},
														{
															type: 'number',
															min: 0,
															max: 100,
															message: '必须为数字值，大于等于0，小于等于100',
															trigger: ['blur', 'change'],
														},
													]"
												>
													<el-input
														v-model.number="strategyList[$index].rate"
														class="edit-input"
														size="small"
													/>
												</el-form-item>
											</template>
											<span v-else>{{ strategyList[$index].rate }}</span>
										</template>
									</el-table-column>
									<el-table-column align="center" label="操作" width="200">
										<template slot-scope="{ $index }">
											<template v-if="strategyEditState">
												<el-button
													type="text"
													size="small"
													icon="el-icon-delete"
													@click="delEdit($index)"
												>
													删除
												</el-button>
											</template>
											<span v-else>-</span>
										</template>
									</el-table-column>
								</el-table>
							</el-form>
						</div>
					</el-card>

					<el-card
						class="box-card mt10"
						v-if="
							(strategyList.length > 0 && !strategyEditState) ||
							(originalStrategyList.length > 0 && strategyEditState)
						"
					>
						<div slot="header" class="clearfix">
							<span class="fb">变量列表</span>
							<el-button
								style="float: right; margin-left: 10px"
								size="mini"
								plain
								icon="el-icon-plus"
								@click="addVariable"
								>添加变量</el-button
							>
						</div>
						<div class="card-content">
							<div
								v-for="(variations, varIndex) in variableList"
								:key="varIndex"
							>
								<el-row class="var-list">
									<b style="color: #495060"
										>{{ variations.variableName }}({{
											typeOption[Number(variations.variableType) - 1] &&
											typeOption[Number(variations.variableType) - 1].label
										}})</b
									>
									<div style="float: right">
										<el-button
											type="text"
											size="mini"
											icon="el-icon-edit"
											@click="addVariable(variations)"
											>查看变量</el-button
										>
										<el-button
											type="text"
											size="mini"
											icon="el-icon-delete"
											@click="removeVariable(variations.id, varIndex)"
											>移除变量</el-button
										>
										<el-button
											type="text"
											size="mini"
											icon="el-icon-check"
											@click="confirmVarable(variations, varIndex)"
											>保存</el-button
										>
									</div>
								</el-row>
								<el-row class="mb20">
									<el-form
										:model="variations"
										ref="variableForm"
										label-width="200px"
										class="demo-dynamic"
									>
										<div
											v-for="strategy in strategyList"
											:key="strategy.id + '-' + variations.id"
										>
											<template v-if="variations.variableType === 1">
												<el-form-item
													:label="strategy.strategyName"
													label-width="220px"
													:prop="
														'variableValuesMap.' +
														strategy.id +
														'.variableValue'
													"
													:rules="[
														{
															required: true,
															type: 'string',
															maxlength: 1000,
															message: '请输入的变量值，最多输入1000字符',
															trigger: 'blur',
														},
													]"
												>
													<el-input
														v-model.trim="
															variations.variableValuesMap[strategy.id]
																.variableValue
														"
														class="policy-flow"
														style="width: 300px"
														type="text"
														placeholder="变量值"
													></el-input>
												</el-form-item>
											</template>
											<template v-if="variations.variableType === 2">
												<el-form-item
													:label="strategy.strategyName"
													label-width="220px"
													:prop="
														'variableValuesMap.' +
														strategy.id +
														'.variableValue'
													"
													:rules="[
														{
															required: true,
															type: 'string',
															message: '请输入数字，最多2位小数',
															pattern: /^\d*(\.?\d{0,2})$/,
															trigger: 'blur',
														},
													]"
												>
													<el-input
														v-model="
															variations.variableValuesMap[strategy.id]
																.variableValue
														"
														class="policy-flow"
														style="width: 300px"
														type="text"
														placeholder="变量值"
													></el-input>
												</el-form-item>
											</template>
											<template v-if="variations.variableType === 3">
												<el-form-item
													:label="strategy.strategyName"
													label-width="220px"
													:prop="
														'variableValuesMap.' +
														strategy.id +
														'.variableValue'
													"
													:rules="[
														{
															required: true,
															message: '请选择变量值',
															trigger: 'blur',
														},
													]"
												>
													<el-select
														v-model="
															variations.variableValuesMap[strategy.id]
																.variableValue
														"
														placeholder="请选择"
													>
														<el-option label="请选择" value=""> </el-option>
														<el-option label="true" value="1"></el-option>
														<el-option label="false" value="0"></el-option>
													</el-select>
												</el-form-item>
											</template>
										</div>
									</el-form>
								</el-row>
							</div>
						</div>
					</el-card>
				</template>
				<expriment-dialog
					:visible.sync="showExprimentDialog"
					:itemInfo.sync="editExprimentItem"
					:testInfo="curTestInfo"
					@updateList="updateList"
				></expriment-dialog>
				<variable-dialog
					:visible.sync="showVariableDialog"
					:itemInfo.sync="editVariableItem"
					:strategyList="strategyList"
					@updateList="updateList"
				></variable-dialog>
			</el-main>
		</el-container>
	</div>
</template>

<script>
import variableDialog from './variableDialog'
import exprimentDialog from './exprimentDialog'
import {
	getExprimentList,
	getStrategyListByExperimentId,
	getVariableListByExperimentId,
	addOrUpdateStrategy,
	updateExperiment,
	addOrUpdateVariable,
	deleteVariable,
	deleteExperiment,
	deleteStrategy,
} from '@/api/abTest'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		editRow: {
			type: Object,
			default: () => ({}),
		},
	},
	components: {
		variableDialog,
		exprimentDialog,
	},
	name: 'FormTable',
	watch: {
		formData: {
			// handler: function (val) {
			// 	this.item[7].hide = val.give == 1 || val.give == 2 ? false : true
			// },
			// deep: true,
		},
		'dynamicValidateForm.variations.policy': function (val) {
			console.log(23324, val)
		},
	},
	data() {
		return {
			dataLoaded: false,
			curTestInfo: {},
			//当前的实验索引
			curIndex: 0,
			// 当前的实验类型
			curStrategyType: 1,
			defaultName: '',
			listLoading: true,
			expriList: [],
			exprimentDetailInfoArr: [],
			strategyEditState: false,
			strategyList: [],
			originalStrategyList: [],
			variableList: [],
			showLoading: false,
			showEditDialog: false,
			showExprimentDialog: false,
			showVariableDialog: false,
			editExprimentItem: {},
			editVariableItem: {},
			typeOption: [
				{
					value: 1,
					label: '字符串',
				},
				{
					value: 2,
					label: '数值',
				},
				{
					value: 3,
					label: '逻辑',
				},
			],
		}
	},
	mounted() {
		let pageParam = this.$route.params
		let storeInfo = JSON.parse(sessionStorage.getItem('testId')) || ''
		if (!pageParam.id) {
			this.curTestInfo = storeInfo
			this.getList()
		} else if (pageParam.id == storeInfo) {
			this.curTestInfo = pageParam
		} else {
			this.curTestInfo = pageParam
			this.getList()
		}
		sessionStorage.setItem('testId', JSON.stringify(this.curTestInfo))
	},
	methods: {
		updateList() {
			this.getList()
		},
		getList: async function () {
			let id = this.curTestInfo.id
			let {
				data: { resultCode, resultData },
			} = await getExprimentList({ testId: id })
			this.dataLoaded = true
			this.showLoading = false
			this.listLoading = false
			if (resultCode == 0) {
				this.expriList = resultData
				this.defaultName = `实验${this.curIndex + 1}`
				if (this.expriList.length) {
					this.getPolicyList(this.expriList[this.curIndex].id)
					this.curStrategyType = resultData[this.curIndex].strategyType
				}
			} else {
				this.expriList = []
			}
		},
		change() {
			this.$forceUpdate()
		},
		//切换实验
		toggleExpri(list, index) {
			console.log(list, index)
			this.curIndex = index
			this.curStrategyType = list.strategyType
			let id = list.id
			if (id) this.getPolicyList(id)
		},
		//获取实验下的详细信息
		getPolicyList: async function (expriId) {
			Promise.all([
				getStrategyListByExperimentId({ experimentId: expriId }),
				getVariableListByExperimentId({ experimentId: expriId }),
			])
				.then(
					([
						{
							data: { resultCode: resultCode1, resultData: strategyList },
						},
						{
							data: { resultCode: resultCode2, resultData: variableList },
						},
					]) => {
						if (resultCode1 == 0 && resultCode2 == 0) {
							this.strategyList = strategyList
							variableList.map((variable) => {
								variable.variableValuesMap = {}
								if (variable.variableValues) {
									variable.variableValues.map((val) => {
										variable.variableValuesMap[val.strategyId] = val
									})
								}
								strategyList.forEach((strategy) => {
									if (!variable.variableValuesMap[strategy.id]) {
										variable.variableValuesMap[strategy.id] = {
											strategyId: strategy.id,
											variableId: variable.id,
											variableValue: '',
										}
									}
								})
							})
							console.log(variableList)
							this.variableList = variableList
						} else {
							this.strategyList = []
							this.variableList = []
						}
						this.listLoading = false
					}
				)
				.catch(() => {
					this.strategyList = []
					this.variableList = []
					this.listLoading = false
				})
		},
		addOrUpdateExpriHandle(item) {
			if (item) {
				this.editExprimentItem = item
			}
			this.showExprimentDialog = true
		},
		// 保存变量
		confirmVarable: async function (item, index) {
			this.$refs['variableForm'][index].validate(async (valid) => {
				if (valid) {
					Object.keys(item.variableValuesMap).forEach((strategyId) => {
						const isDefine = item.variableValues.some((variableValues) => {
							return (
								variableValues.strategyId ===
								item.variableValuesMap[strategyId].strategyId
							)
						})
						if (!isDefine) {
							item.variableValues.push({
								strategyId: item.variableValuesMap[strategyId].strategyId,
								variableId: item.variableValuesMap[strategyId].variableId,
								variableValue: item.variableValuesMap[strategyId].variableValue,
							})
						}
					})
					item.variableValues.map((variableItem) => {
						variableItem.variableValue = item.variableValuesMap[
							variableItem.strategyId
						]
							? item.variableValuesMap[variableItem.strategyId].variableValue
							: ''
					})
					let param = {
						description: item.description,
						experimentId: item.experimentId,
						id: item.id,
						variableName: item.variableName,
						variableType: item.variableType,
						variableValues: item.variableValues.filter(
							(v) => v.variableValue !== ''
						),
					}
					console.log(item)
					let {
						data: { resultCode },
					} = await addOrUpdateVariable(param)
					if (resultCode == 0) {
						this.$message({
							message: '保存成功',
							type: 'success',
						})
					}
				}
			})
		},
		//删除变量
		removeVariable(id, index) {
			this.delBox(undefined, async () => {
				let param = { id }
				let {
					data: { resultCode },
				} = await deleteVariable(param)
				if (resultCode == 0) {
					this.variableList.splice(index, 1)
					this.$message({
						message: '操作成功',
						type: 'success',
					})
				}
			})
		},
		//删除实验
		removeExpri(item, index) {
			this.delBox(undefined, async () => {
				let param = { id: item }
				let {
					data: { resultCode },
				} = await deleteExperiment(param)
				if (resultCode == 0) {
					this.$message({
						message: '操作成功',
						type: 'success',
					})
					this.getList()
					if (index === this.curIndex) this.curIndex = 0
				}
			})
		},
		//保存实验内容
		submitForm: async function () {
			let param = {
				testId: this.curTestInfo.id,
				name: this.dynamicValidateForm.name,
				id: this.dynamicValidateForm.id,
				rate: this.dynamicValidateForm.rate,
				relation: this.dynamicValidateForm.variable[1],
			}

			let {
				data: { resultCode },
			} = await updateExperiment(param)
			if (resultCode == 0) {
				this.$message({
					message: '保存成功',
					type: 'success',
				})
			}
		},
		addEdit: function () {
			this.strategyList.push({
				strategyName: '',
				rate: '',
				userGroupId: '',
				edit: true,
			})
		},
		//新增策略
		confirmEdit: async function () {
			this.$refs.strategyForm.validate(async (valid) => {
				if (valid) {
					this.showLoading = true
					let rateTotal = 0
					if (this.strategyList.length > 20) {
						return this.$message({
							message: '最多只能添加20条策略',
							type: 'error',
						})
					}
					let strategyList = this.strategyList.map((item) => {
						rateTotal += item.rate
						let paramTemp = {
							experimentId: this.expriList[this.curIndex].id,
							rate: item.rate,
							strategyName: item.strategyName,
							userGroupId: item.userGroupId,
							strategyType: this.curStrategyType,
						}
						if (item.id) {
							paramTemp.id = item.id
						}
						return paramTemp
					})
					if (rateTotal > 100) {
						return this.$message({
							message: '流量占比总数不能超过100%',
							type: 'error',
						})
					}
					console.log(strategyList)
					let param = { list: strategyList }
					let api = addOrUpdateStrategy

					if (strategyList.length == 0) {
						param = { experimentId: this.expriList[this.curIndex].id }
						api = deleteStrategy
					}
					let {
						data: { resultCode },
					} = await api(param)
					this.showLoading = false
					if (resultCode == 0) {
						this.$message({
							message: '操作成功',
							type: 'success',
						})
						this.strategyEditState = false
						this.getPolicyList(this.expriList[this.curIndex].id)
					}
				}
			})
		},
		//新增变量
		addVariable(item = {}) {
			if (item.id) {
				this.editVariableItem = item
			} else {
				let variableValuesMap = {}
				this.strategyList.forEach((strategy) => {
					variableValuesMap[strategy.id] = {
						strategyId: strategy.id,
						variableValue: '',
					}
				})
				this.editVariableItem = {
					experimentId: this.expriList[this.curIndex].id,
					variableType: 1,
					variableValuesMap,
				}
			}
			console.log(this.editVariableItem)
			this.showVariableDialog = true
		},
		copyList(arr) {
			let newArr = arr.constructor === Array ? [] : {}
			for (let i in arr) {
				if (arr[i].constructor === Object || arr[i].constructor === Array) {
					newArr[i] = this.copyList(arr[i])
				} else {
					newArr[i] = arr[i]
				}
			}
			return newArr
		},
		startEdit() {
			this.originalStrategyList = this.copyList(this.strategyList)
			this.strategyEditState = true
		},
		cancelEdit() {
			this.strategyList = this.originalStrategyList
			this.strategyEditState = false
		},
		delEdit(index) {
			this.strategyList.splice(index, 1)
		},
		//删除确认框
		delBox(title = '确定删除此项吗？', callback = {}) {
			this.$confirm(title, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				center: true,
			}).then(() => {
				callback()
			})
		},
	},
}
</script>

<style lang="scss" scope>
.expri-list-wrap {
	position: relative;
}
.expri-list-wrap::after {
	content: ' ';
	width: 1px;
	background: #ddd;
	height: 100%;
	position: absolute;
	top: 0;
	right: 0;
}
.test-name {
	color: #495060;
	margin: 0;
	border-bottom: 1px solid #ddd;
	padding-bottom: 20px;
}
.expri-list {
	border-width: 0 1px 1px 0;
	display: block;
	margin-left: 0 !important;
	min-width: 120px;
	position: relative;
	z-index: 1;
	border-radius: 0;
	&:hover {
		box-shadow: 0 2px 3px 0 rgb(0 0 0 / 10%) inset;
	}
	&.expri-list-active {
		background: #eee;
		border-width: 0 0 1px 0;
	}
	.expri-buttons {
		position: absolute;
		top: 5px;
		right: 5px;
	}
	.expri-button {
		padding: 3px;
	}
	.expriment-name {
		font-weight: bold;
		font-size: 16px;
		line-height: 1.6;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
}

.policy-name {
	width: 200px;
}
.var-list {
	border-bottom: 1px solid #ddd;
	padding-bottom: 10px;
	margin-bottom: 10px;
}
.w300 {
	width: 300px;
}
.mt5 {
	margin-top: 5px;
}
.mt10 {
	margin-top: 10px;
}
.mb20 {
	margin-bottom: 20px;
}
.mr10 {
	margin-right: 10px;
}
.fb {
	font-weight: bold;
}
.btn-group {
	margin-left: 200px;
}
</style>

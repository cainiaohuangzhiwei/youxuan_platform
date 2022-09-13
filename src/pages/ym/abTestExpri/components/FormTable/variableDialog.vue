<template>
	<div>
		<el-dialog
			width="800px"
			:title="itemInfo && itemInfo.id ? '查看变量' : '创建变量'"
			:close-on-click-modal="false"
			:modal-append-to-body="true"
			:append-to-body="true"
			:visible.sync="showVariableDialog"
			:before-close="resetForm"
		>
			<el-form
				:model="variableForm"
				ref="variableForm"
				label-width="120px"
				class="demo-dynamic"
			>
				<el-form-item
					prop="variableName"
					label="变量名称"
					:rules="[
						{
							required: true,
							type: 'string',
							message: '请输入正确的变量名称',
							pattern: /^[a-zA-Z\$_][a-zA-Z\d_]*$/,
							trigger: 'blur',
						},
					]"
				>
					<el-input
						type="text"
						v-model.trim="variableForm.variableName"
						maxlength="30"
					></el-input>
				</el-form-item>
				<el-form-item prop="description" label="变量描述">
					<el-input
						type="text"
						v-model="variableForm.description"
						maxlength="50"
					></el-input>
				</el-form-item>
				<el-form-item prop="type" label="类型">
					<el-select v-model="variableForm.variableType" placeholder="请选择">
						<el-option
							v-for="item in typeOption"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<template v-if="variableForm.variableValuesMap">
					<p class="title">策略变量</p>
					<el-row :gutter="24" class="policy-box">
						<el-col :span="7">
							<p class="tr">策略名称</p>
						</el-col>
						<el-col :span="17">
							<p>变量值</p>
						</el-col>
					</el-row>
					<template v-if="variableForm.originalVariableValuesMaps">
						<template v-if="variableForm.variableType === 1">
							<el-form-item
								v-for="strategy in strategyList"
								:key="strategy.id"
								:label="strategy.strategyName"
								label-width="220px"
								:prop="
									'originalVariableValuesMaps.' +
									variableForm.variableType +
									'.' +
									strategy.id
								"
								:rules="[
									{
										required: true,
										maxlength: 200,
										type: 'string',
										message: '请输入的变量值，最多输入200字符',
										trigger: 'blur',
									},
								]"
							>
								<el-input
									v-model.trim="
										variableForm.originalVariableValuesMaps[
											variableForm.variableType
										][strategy.id]
									"
									class="policy-flow"
									style="width: 300px"
									type="text"
									@input="change(e)"
									placeholder="变量值"
								></el-input>
							</el-form-item>
						</template>
						<template v-if="variableForm.variableType === 2">
							<el-form-item
								v-for="strategy in strategyList"
								:key="strategy.id"
								:label="strategy.strategyName"
								label-width="220px"
								:prop="
									'originalVariableValuesMaps.' +
									variableForm.variableType +
									'.' +
									strategy.id
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
									v-model.trim="
										variableForm.originalVariableValuesMaps[
											variableForm.variableType
										][strategy.id]
									"
									class="policy-flow"
									style="width: 300px"
									type="text"
									@input="change(e)"
									placeholder="变量值"
								></el-input>
							</el-form-item>
						</template>
						<template v-if="variableForm.variableType === 3">
							<el-form-item
								v-for="strategy in strategyList"
								:key="strategy.id"
								:label="strategy.strategyName"
								label-width="220px"
								:prop="
									'originalVariableValuesMaps.' +
									variableForm.variableType +
									'.' +
									strategy.id
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
										variableForm.originalVariableValuesMaps[
											variableForm.variableType
										][strategy.id]
									"
									placeholder="请选择"
								>
									<el-option label="请选择" value=""> </el-option>
									<el-option label="true" value="1"></el-option>
									<el-option label="false" value="0"></el-option>
								</el-select>
							</el-form-item>
						</template>
						<el-form-item>
							<el-button type="primary" @click="submitVariable">确定</el-button>
						</el-form-item>
					</template>
				</template>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import { addOrUpdateVariable } from '@/api/abTest'

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
		strategyList: {
			type: Array,
			default: () => [],
		},
	},

	data() {
		return {
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
			variableForm: {},
			dialogFormVisible: false,
			showLoading: false,
			selectGroupList: [],
			variations: [],
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submitVariable()
					},
				},
			],
		}
	},
	watch: {
		showVariableDialog(isShow) {
			if (isShow) {
				if (this.itemInfo && this.itemInfo.id) {
					this.variableForm = JSON.parse(JSON.stringify(this.itemInfo))
				} else {
					this.variableForm = this.itemInfo
				}
				if (typeof this.variableForm.variableType != 'undefined') {
					let originalVariableValuesMaps = {}
					this.typeOption.map((option) => {
						originalVariableValuesMaps[option.value] = {}
						this.strategyList.map((strategy) => {
							originalVariableValuesMaps[option.value][strategy.id] =
								option.value === this.variableForm.variableType
									? this.variableForm.variableValuesMap[strategy.id]
											.variableValue
									: ''
						})
					})

					this.$set(
						this.variableForm,
						'originalVariableValuesMaps',
						originalVariableValuesMaps
					)
				}
			} else {
				this.variableForm = {}
			}
		},
	},
	computed: {
		showVariableDialog: {
			get() {
				return this.visible
			},
			set(val) {
				this.$emit('update:visible', val)
			},
		},
	},
	methods: {
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
		change() {
			this.$forceUpdate()
		},
		getForm() {
			return {
				variableName: '',
			}
		},
		submitVariable: async function () {
			this.$refs.variableForm.validate(async (valid) => {
				if (valid) {
					let param = {
						experimentId: this.variableForm.experimentId,
						variableName: this.variableForm.variableName,
						variableType: this.variableForm.variableType,
					}
					if (this.variableForm.description) {
						param.description = this.variableForm.description
					}

					let variableValuesMap = this.variableForm.originalVariableValuesMaps[
						param.variableType
					]
					param.variableValues = Object.keys(variableValuesMap).map(
						(strategyId) => {
							const variable = {
								strategyId,
								variableValue: variableValuesMap[strategyId],
							}
							if (this.variableForm.id) {
								variable.variableId = this.variableForm.id
							}
							return variable
						}
					)
					if (this.variableForm.id) {
						param.id = this.variableForm.id
					}
					let {
						data: { resultCode },
					} = await addOrUpdateVariable(param)
					if (resultCode == 0) {
						this.$message({
							message: '添加成功',
							type: 'success',
						})
						console.log('this.variations', this.variableForm)
						setTimeout(() => {
							this.showVariableDialog = false
							this.$emit('updateList', this.variableForm)
						}, 1000)
					}
				}
			})
		},
		// 关闭弹窗
		resetForm() {
			this.$refs.variableForm && this.$refs.variableForm.resetFields()
			this.showVariableDialog = false
		},
	},
}
</script>

<style lang="scss" scoped>
.title {
	font-weight: bold;
	margin-bottom: 0;
	margin-left: 50px;
	margin-top: 40px;
}
.policy-box {
	border-bottom: 1px solid #ddd;
	margin-bottom: 10px;
}
.tr {
	text-align: right;
}
.w150 {
	width: 150px;
}
</style>

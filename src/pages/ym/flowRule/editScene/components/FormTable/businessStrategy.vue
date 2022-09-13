<template>
	<div>
		<el-dialog
			width="500px"
			:title="businessStrategyRow.strategyId ? '编辑业务策略' : '新增业务策略'"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<el-form
				ref="strategyForm"
				:model="form"
				:rules="rules"
				label-width="100px"
			>
				<el-form-item label="策略名称" prop="strategyName">
					<el-input
						v-model="form.strategyName"
						style="width: 300px"
						maxlength="128"
					></el-input>
				</el-form-item>
				<el-form-item label="物品类型" prop="objectType">
					<el-select
						v-model="form.objectType"
						placeholder="请选择"
						:disabled="businessStrategyRow.strategyId"
						@change="change"
					>
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					label="物品池"
					prop="goodsPoolId"
					v-if="form.objectType == 1"
				>
					<el-input
						v-model="form.goodsPoolId"
						style="width: 300px"
						maxlength="128"
					></el-input>
				</el-form-item>
				<el-form-item
					label="服务名称"
					prop="recallModel"
					v-if="form.objectType == 2"
				>
					<el-select
						v-model="form.recallModel"
						placeholder="请选择"
						popper-class="selectOptions"
					>
						<template v-for="item in recallModelList">
							<el-option
								:key="item.value"
								:label="item.label"
								:value="item.value"
								v-if="item.returnContentType === returnContentType"
							>
							</el-option>
						</template>
					</el-select>
				</el-form-item>
				<el-form-item
					label="活动类型ID"
					prop="activityId"
					v-if="form.objectType == 3"
				>
					<el-input v-model="form.activityId" style="width: 300px"></el-input>
				</el-form-item>
				<el-form-item
					label="物品个数"
					prop="maxReturnQuantity"
					v-if="
						form.objectType == 3 || form.objectType == 4 || form.objectType == 5
					"
				>
					<el-input
						v-model="form.maxReturnQuantity"
						style="width: 300px"
					></el-input>
				</el-form-item>
				<el-form-item
					label="数据源"
					prop="sourceTag"
					v-if="form.objectType == 4"
				>
					<el-select
						value-key="value"
						v-model="form.sourceTag"
						placeholder="请选择"
						popper-class="selectOptions"
					>
						<template v-for="item in dataSourceTypeList">
							<el-option
								:key="item.label"
								:label="item.label"
								:value="item.value"
								v-if="item.returnContentType === returnContentType"
							>
							</el-option>
						</template>
					</el-select>
				</el-form-item>
				<el-form-item label="生效时间" prop="enableType">
					<el-select v-model="form.enableType" placeholder="请选择生效时间">
						<el-option label="一直生效" :value="0"></el-option>
						<el-option label="区间时间" :value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					label="时间范围"
					prop="startTime"
					v-if="form.enableType == 1"
				>
					<div>
						<el-date-picker
							v-model="form.startTime"
							type="datetime"
							placeholder="选择开始时间"
							align="right"
							:picker-options="pickerOptions"
							:disabled="form.checked1"
						>
						</el-date-picker>
						<el-checkbox
							v-model="form.checked1"
							@change="handleChange1"
							style="margin-left: 10px"
							>马上开始</el-checkbox
						>
					</div>
					<div style="margin-top: 10px">
						<el-date-picker
							v-model="form.endTime"
							type="datetime"
							placeholder="选择结束时间"
							align="right"
							:picker-options="pickerOptions"
							:disabled="form.checked2"
						>
						</el-date-picker>
						<el-checkbox
							v-model="form.checked2"
							@change="handleChange2"
							style="margin-left: 10px"
							>永不结束</el-checkbox
						>
					</div>
				</el-form-item>
				<el-form-item label="策略" prop="strategyType">
					<el-select
						v-model="form.strategyType"
						@change="strategyChange"
						placeholder="请选择策略"
						popper-class="selectOptions"
					>
						<el-option
							v-for="item in strategyTypeList"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					label="置顶"
					prop="topping"
					v-if="form.strategyType == 'TOPPING'"
				>
					<div>
						把目标物品在TOP<el-input
							v-model="form.topping"
							style="width: 60px; margin-left: 6px; margin-right: 6px"
						></el-input
						>位置顶
					</div>
				</el-form-item>
				<el-form-item
					label="相对扶持"
					prop="rSupport"
					v-if="form.strategyType == 'RELATIVE_SUPPORT'"
				>
					<div>
						把目标物品往前提升<el-input
							v-model="form.rSupport"
							style="width: 60px; margin-left: 6px; margin-right: 6px"
						></el-input
						>位
					</div>
				</el-form-item>
				<el-form-item
					label="区间扶持"
					prop="isNum1"
					v-if="form.strategyType == 'INTERVAL_SUPPORT'"
				>
					<div>
						把目标物品在第<el-input
							v-model="form.isNum1"
							style="width: 60px; margin-left: 6px; margin-right: 6px"
						></el-input
						>到<el-input
							v-model="form.isNum2"
							style="width: 60px; margin-left: 6px; margin-right: 6px"
						></el-input
						>至少保证有<el-input
							v-model="form.isNum3"
							style="width: 60px; margin-left: 6px; margin-right: 6px"
						></el-input
						>个商品
					</div>
				</el-form-item>
				<el-form-item
					label="沉底"
					prop="sedimenTation"
					v-if="form.strategyType == 'SEDIMENTATION'"
				>
					<div>
						把目标物品在底部<el-input
							v-model="form.sedimenTation"
							style="width: 60px; margin-left: 6px; margin-right: 6px"
						></el-input
						>位沉底
					</div>
				</el-form-item>
				<el-form-item
					label="相对打压"
					prop="rPressure"
					v-if="form.strategyType == 'RELATIVE_PRESSURE'"
				>
					<div>
						把目标物品往后打压<el-input
							v-model="form.rPressure"
							style="width: 60px; margin-left: 6px; margin-right: 6px"
						></el-input
						>位
					</div>
				</el-form-item>
				<el-form-item
					label="区间打压"
					prop="ipNum1"
					v-if="form.strategyType == 'INTERVAL_PRESSURE'"
				>
					<div>
						把目标物品在第<el-input
							v-model="form.ipNum1"
							style="width: 60px; margin-left: 6px; margin-right: 6px"
						></el-input
						>到<el-input
							v-model="form.ipNum2"
							style="width: 60px; margin-left: 6px; margin-right: 6px"
						></el-input
						>至多保证有<el-input
							v-model="form.ipNum3"
							style="width: 60px; margin-left: 6px; margin-right: 6px"
						></el-input
						>个商品
					</div>
				</el-form-item>
				<el-form-item label="优先级" prop="priority">
					<el-input v-model="form.priority" style="width: 300px"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button @click="handleCancel">取消</el-button>
					<el-button type="primary" @click="submitForm">保存</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import {
	rcBizStrategyAuditAdd,
	optionsGet,
	rcBizStrategyAuditUpdateById,
	rcFlowRuleRecordUpdateUser,
} from '@/api/scene'
import moment from 'moment'

export default {
	props: {
		visible: {
			type: Boolean,
			define: false,
		},
		businessStrategyRow: {
			define: false,
			default: () => {},
		},
		bsRow: {
			define: false,
			default: () => {},
		},
		returnContentType: {
			type: String,
		},
	},

	components: {},

	data() {
		let timeValidatePass = (rule, value, callback) => {
			if (!this.form.checked1 && !this.form.startTime) {
				callback(new Error('请选择开始时间'))
			} else if (!this.form.checked2 && !this.form.endTime) {
				callback(new Error('请选择结束时间'))
			} else if (
				moment(this.form.startTime).valueOf() >=
				moment(this.form.endTime).valueOf()
			) {
				callback(new Error('开始时间不能大于结束时间'))
			} else {
				callback()
			}
		}
		let validatePass = (rule, value, callback) => {
			let pattern = /^\+?[1-9][0-9]*$/
			if (this.form.strategyType == 'INTERVAL_SUPPORT') {
				if (!this.form.isNum1 || !this.form.isNum2 || !this.form.isNum3) {
					callback(new Error('请在填写框输入相应数值'))
				} else if (
					!pattern.test(this.form.isNum1) ||
					!pattern.test(this.form.isNum2) ||
					!pattern.test(this.form.isNum3)
				) {
					callback(new Error('请输入正确的数值'))
				} else {
					callback()
				}
			} else if (this.form.strategyType == 'INTERVAL_PRESSURE') {
				if (!this.form.ipNum1 || !this.form.ipNum2 || !this.form.ipNum3) {
					callback(new Error('请在填写框输入相应数值'))
				} else if (
					!pattern.test(this.form.ipNum1) ||
					!pattern.test(this.form.ipNum2) ||
					!pattern.test(this.form.ipNum3)
				) {
					callback(new Error('请输入正确的数值'))
				} else {
					callback()
				}
			}
		}
		return {
			moment: moment,
			recallModelList: [],
			strategyTypeList: [],
			dataSourceTypeList: [],
			startD: false,
			endD: false,
			options: [
				{
					value: 1,
					label: '货品池',
				},
				{
					value: 2,
					label: '召回服务',
				},
				{
					value: 3,
					label: '活动类型',
				},
				{
					value: 4,
					label: '曝光打压',
				},
				{
					value: 5,
					label: '首页档期',
				},
			],
			form: {
				strategyName: '',
				objectType: 1,
				priority: '',
				goodsPoolId: '',
				recallModel: '',
				recallObj: {},
				enableType: 0,
				strategyType: '',
				startTime: '',
				endTime: '',
				checked1: false,
				checked2: false,
				activityId: '',
				maxReturnQuantity: '',
				topping: '',
				rSupport: '',
				isNum1: '',
				isNum2: '',
				isNum3: '',
				sedimenTation: '',
				rPressure: '',
				ipNum1: '',
				ipNum2: '',
				ipNum3: '',
				sourceTag: '', // 数据源
			},
			rules: {
				strategyName: [
					{
						required: true,
						message: '请输入策略名称',
						trigger: ['blur', 'change'],
					},
				],
				objectType: [
					{
						required: true,
						message: '请输入服务名称',
						trigger: ['blur', 'change'],
					},
				],
				goodsPoolId: [
					{
						required: true,
						message: '请输入正确的物品池ID',
						pattern: /^\+?[1-9][0-9]*$/,
						trigger: ['blur', 'change'],
					},
				],
				recallModel: [
					{
						required: true,
						message: '请选择服务名称',
						trigger: ['blur', 'change'],
					},
				],
				recallObj: [
					{
						required: true,
						message: '请选择服务名称',
						trigger: ['blur', 'change'],
					},
				],
				enableType: [
					{
						required: true,
						message: '请选择服务名称',
						trigger: ['blur', 'change'],
					},
				],
				activityId: [
					{
						required: true,
						message: '请输入活动类型ID',
						trigger: ['blur', 'change'],
					},
				],
				maxReturnQuantity: [
					{
						required: true,
						message: '请输入正确的物品个数',
						pattern: /^\+?[1-9][0-9]*$/,
						trigger: ['blur', 'change'],
					},
				],
				startTime: [
					{
						validator: timeValidatePass,
						trigger: ['blur', 'change'],
					},
				],
				sourceTag: [
					{
						required: true,
						message: '请选择数据源',
						trigger: ['blur', 'change'],
					},
				],
				strategyType: [
					{
						required: true,
						message: '请选择策略',
						trigger: ['blur', 'change'],
					},
				],
				topping: [
					{
						required: true,
						message: '请输入正确的数值',
						pattern: /^\+?[1-9][0-9]*$/,
						trigger: ['blur', 'change'],
					},
				],
				rSupport: [
					{
						required: true,
						message: '请输入正确的数值',
						pattern: /^\+?[1-9][0-9]*$/,
						trigger: ['blur', 'change'],
					},
				],
				isNum1: [
					{
						required: true,
						validator: validatePass,
						trigger: ['blur', 'change'],
					},
				],
				sedimenTation: [
					{
						required: true,
						message: '请输入正确的数值',
						pattern: /^\+?[1-9][0-9]*$/,
						trigger: ['blur', 'change'],
					},
				],
				rPressure: [
					{
						required: true,
						message: '请输入正确的数值',
						pattern: /^\+?[1-9][0-9]*$/,
						trigger: ['blur', 'change'],
					},
				],
				ipNum1: [
					{
						required: true,
						validator: validatePass,
						trigger: ['blur', 'change'],
					},
				],
				priority: [
					{
						required: true,
						message: '请输入正确的优先级',
						pattern: /^\+?[1-9][0-9]*$/,
						trigger: ['blur', 'change'],
					},
				],
			},
		}
	},
	watch: {
		localVisible(val) {
			this.form = this.getForm()
			this.$refs.strategyForm && this.$refs['strategyForm'].resetFields()
			if (val) {
				this._optionsGet()
				console.log(this.businessStrategyRow, 'aaaaaaa')
				if (this.businessStrategyRow) {
					this.form.strategyName = this.businessStrategyRow.strategyName
					if (
						this.businessStrategyRow.enableType ||
						this.businessStrategyRow.enableType == 0
					) {
						this.form.enableType = this.businessStrategyRow.enableType
					}
					this.form.priority = this.businessStrategyRow.priority
					if (this.businessStrategyRow.objectType) {
						this.form.objectType = this.businessStrategyRow.objectType
					}
					this.form.strategyType = this.businessStrategyRow.strategyType
					if (this.form.objectType == 1) {
						this.form.goodsPoolId = this.businessStrategyRow.goodsPoolId
					} else if (this.form.objectType == 2) {
						this.form.recallModel = this.businessStrategyRow.sourceTag
					} else if (this.form.objectType == 3) {
						this.form.activityId = this.businessStrategyRow.sourceTag
						this.form.maxReturnQuantity =
							this.businessStrategyRow.maxReturnQuantity
					} else if (this.form.objectType == 4) {
						this.form.sourceTag = this.businessStrategyRow.sourceTag
						this.form.maxReturnQuantity =
							this.businessStrategyRow.maxReturnQuantity
					} else if (this.form.objectType == 5) {
						this.form.maxReturnQuantity =
							this.businessStrategyRow.maxReturnQuantity
					}
					if (this.form.enableType == 1) {
						if (this.businessStrategyRow.startTime) {
							this.form.startTime = this.businessStrategyRow.startTime
						}
						if (this.businessStrategyRow.endTime) {
							this.form.endTime = this.businessStrategyRow.endTime
						} else {
							this.form.checked2 = true
						}
					}
					if (this.form.strategyType == 'TOPPING') {
						this.form.topping = this.businessStrategyRow.targetGoodsQuantity
					} else if (this.form.strategyType == 'RELATIVE_SUPPORT') {
						this.form.rSupport = this.businessStrategyRow.targetGoodsQuantity
					} else if (this.form.strategyType == 'SEDIMENTATION') {
						this.form.sedimenTation =
							this.businessStrategyRow.targetGoodsQuantity
					} else if (this.form.strategyType == 'RELATIVE_PRESSURE') {
						this.form.rPressure = this.businessStrategyRow.targetGoodsQuantity
					} else if (this.form.strategyType == 'INTERVAL_SUPPORT') {
						this.form.isNum3 = this.businessStrategyRow.positionQuantity
						this.form.isNum1 = this.businessStrategyRow.startPosition
						this.form.isNum2 = this.businessStrategyRow.endPosition
					} else if (this.form.strategyType == 'INTERVAL_PRESSURE') {
						this.form.ipNum3 = this.businessStrategyRow.positionQuantity
						this.form.ipNum1 = this.businessStrategyRow.startPosition
						this.form.ipNum2 = this.businessStrategyRow.endPosition
					}
				}
			}
		},
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
		getForm() {
			return {
				strategyName: '',
				objectType: 1,
				priority: '',
				goodsPoolId: '',
				recallModel: '',
				enableType: 0,
				strategyType: '',
				startTime: '',
				endTime: '',
				checked1: false,
				checked2: false,
				activityId: '',
				maxReturnQuantity: '',
				topping: '',
				rSupport: '',
				isNum1: '',
				isNum2: '',
				isNum3: '',
				sedimenTation: '',
				rPressure: '',
				ipNum1: '',
				ipNum2: '',
				ipNum3: '',
			}
		},
		_optionsGet: async function () {
			let { data } = await optionsGet()
			if (data.resultCode == 0) {
				this.recallModelList = data.resultData.recallModelList
				this.strategyTypeList = data.resultData.strategyTypeList
				this.dataSourceTypeList = data.resultData.exposureTypeList
			}
		},
		change() {
			this.$refs.strategyForm.clearValidate('goodsPoolId')
			this.$refs.strategyForm.clearValidate('recallModel')
			this.$refs.strategyForm.clearValidate('activityId')
			this.$refs.strategyForm.clearValidate('maxReturnQuantity')
		},
		strategyChange() {
			this.$refs.strategyForm.clearValidate('topping')
			this.$refs.strategyForm.clearValidate('rSupport')
			this.$refs.strategyForm.clearValidate('isNum1')
			this.$refs.strategyForm.clearValidate('sedimenTation')
			this.$refs.strategyForm.clearValidate('rPressure')
			this.$refs.strategyForm.clearValidate('ipNum1')
		},
		handleChange1(val) {
			if (val) {
				this.form.startTime = ''
				this.startD = true
			} else {
				this.startD = false
			}
		},
		handleChange2(val) {
			if (val) {
				this.form.endTime = ''
				this.endD = true
			} else {
				this.endD = false
			}
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},
		handleCancel() {
			this.localVisible = false
		},
		async _rcFlowRuleRecordUpdateUser() {
			let params = {
				userId: this.$store.state.user.userInfo.userId,
				flowRuleRecordId: this.bsRow.flowRuleRecordId,
			}
			let { data } = await rcFlowRuleRecordUpdateUser(params)
			if (data.resultCode == 0) {
				console.log(11111)
			}
		},
		submitForm() {
			this.$refs['strategyForm'].validate(async (valid) => {
				if (valid) {
					let params = {
						abtStrategyId: this.bsRow.abtStrategyId,
						sceneId: this.bsRow.sceneId,
						strategyName: this.form.strategyName,
						objectType: this.form.objectType,
						priority: this.form.priority,
						enableType: this.form.enableType,
						strategyType: this.form.strategyType,
					}
					if (this.form.enableType == 1) {
						if (this.form.checked1) {
							params.startTime = new Date().getTime()
						} else {
							params.startTime = moment(this.form.startTime).valueOf()
						}
						if (this.form.checked2) {
							params.endTime = ''
						} else {
							params.endTime = moment(this.form.endTime).valueOf()
						}
					}
					console.error(this.form)
					if (this.form.objectType == 1) {
						params.goodsPoolId = this.form.goodsPoolId
					} else if (this.form.objectType == 2) {
						params.sourceTag = this.form.recallModel
					} else if (this.form.objectType == 3) {
						params.sourceTag = this.form.activityId
						params.maxReturnQuantity = this.form.maxReturnQuantity
					} else if (this.form.objectType == 4) {
						params.sourceTag = this.form.sourceTag
						params.maxReturnQuantity = this.form.maxReturnQuantity
						params.sourceId = 0
					} else if (this.form.objectType == 5) {
						params.maxReturnQuantity = this.form.maxReturnQuantity
					}
					if (this.form.strategyType == 'TOPPING') {
						params.targetGoodsQuantity = this.form.topping
					} else if (this.form.strategyType == 'RELATIVE_SUPPORT') {
						params.targetGoodsQuantity = this.form.rSupport
					} else if (this.form.strategyType == 'SEDIMENTATION') {
						params.targetGoodsQuantity = this.form.sedimenTation
					} else if (this.form.strategyType == 'RELATIVE_PRESSURE') {
						params.targetGoodsQuantity = this.form.rPressure
					} else if (this.form.strategyType == 'INTERVAL_SUPPORT') {
						params.positionQuantity = this.form.isNum3
						params.startPosition = this.form.isNum1
						params.endPosition = this.form.isNum2
					} else if (this.form.strategyType == 'INTERVAL_PRESSURE') {
						params.positionQuantity = this.form.ipNum3
						params.startPosition = this.form.ipNum1
						params.endPosition = this.form.ipNum2
					}
					if (
						this.businessStrategyRow.strategyId ||
						this.businessStrategyRow.strategyId == 0
					) {
						params.strategyId = this.businessStrategyRow.strategyId
						params.updateUser = this.$store.state.user.userInfo.userId
					} else {
						params.addUser = this.$store.state.user.userInfo.userId
					}
					let {
						data: { resultCode },
					} =
						this.businessStrategyRow.strategyId ||
						this.businessStrategyRow.strategyId == 0
							? await rcBizStrategyAuditUpdateById(params)
							: await rcBizStrategyAuditAdd(params)
					if (resultCode == 0) {
						this._rcFlowRuleRecordUpdateUser()
						if (
							this.businessStrategyRow.strategyId ||
							this.businessStrategyRow.strategyId == 0
						) {
							this.$message.success('编辑成功')
						} else {
							this.$message.success('新建成功')
						}

						this.$emit('strategyRefresh', true)
						this.localVisible = false
					}
				}
			})
		},
	},
}
</script>

<style lang="scss">
.selectOptions {
	max-width: 50%;
}
</style>

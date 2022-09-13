<template>
	<div>
		<el-dialog
			width="500px"
			:title="recallServiceRow.recallRuleId ? '编辑召回服务' : '新增召回服务'"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="服务名称" prop="recallObj">
					<el-select
						v-model="form.recallObj"
						placeholder="请选择"
						value-key="value"
						popper-class="selectOptions"
					>
						<template v-for="item in recallModelList">
							<el-option
								:key="item.value"
								:label="item.label"
								:value="item"
								v-if="item.returnContentType === returnContentType"
							>
							</el-option>
						</template>
					</el-select>
				</el-form-item>
				<el-form-item label="物品数量" prop="maxReturnQuantity">
					<el-input
						v-model="form.maxReturnQuantity"
						style="width: 300px"
					></el-input>
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
	optionsGet,
	rcRecallRuleAuditAdd,
	rcRecallRuleAuditUpdateById,
	rcFlowRuleRecordUpdateUser,
} from '@/api/scene'

export default {
	props: {
		visible: {
			type: Boolean,
			define: false,
		},
		recallServiceRow: {
			define: false,
			default: () => {},
		},
		index: {
			type: Number,
			default: 0,
		},
		paramsRow: {
			define: false,
			default: () => {},
		},
		returnContentType: {
			type: String,
		},
	},

	components: {},

	data() {
		return {
			recallModelList: [],
			options: [
				{
					value: 1,
					label: '商品和会场',
				},
				{
					value: 2,
					label: '商品',
				},
				{
					value: 3,
					label: '会场',
				},
			],
			form: {
				recallObj: '',
				name2: '',
				maxReturnQuantity: '',
			},
			rules: {
				recallObj: [
					{
						required: true,
						message: '请输入服务名称',
						trigger: ['blur', 'change'],
					},
				],
				maxReturnQuantity: [
					{
						required: true,
						message: '请输入正确的物品数量',
						pattern: /^\+?[1-9][0-9]*$/,
						trigger: ['blur', 'change'],
					},
				],
			},
		}
	},
	watch: {
		localVisible(val) {
			this.$refs.form && this.$refs.form.resetFields()
			this.form.recallObj = ''
			this.form.maxReturnQuantity = ''
			this.recallModelList = []
			if (val) {
				this._optionsGet()
				this.form.recallObj = {
					value: this.recallServiceRow.recallModel,
					label: this.recallServiceRow.recallModelName,
					id: this.recallServiceRow.recallRuleId,
				}
				this.form.maxReturnQuantity = this.recallServiceRow.maxReturnQuantity
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
		async _optionsGet() {
			let { data } = await optionsGet()
			if (data.resultCode == 0) {
				this.recallModelList = data.resultData.recallModelList
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
				flowRuleRecordId: this.paramsRow.flowRuleRecordId,
			}
			let { data } = await rcFlowRuleRecordUpdateUser(params)
			if (data.resultCode == 0) {
				console.log(11111)
			}
		},
		submitForm() {
			this.$refs['form'].validate(async (valid) => {
				if (valid) {
					let params = {
						recallId: this.form.recallObj.id,
						recallModel: this.form.recallObj.value,
						recallModelName: this.form.recallObj.label,
						maxReturnQuantity: this.form.maxReturnQuantity,
						sceneId: this.paramsRow.sceneId,
						abtStrategyId: this.paramsRow.abtStrategyId,
					}
					if (
						this.recallServiceRow.recallRuleId ||
						this.recallServiceRow.recallRuleId == 0
					) {
						params.recallRuleId = this.recallServiceRow.recallRuleId
						params.updateUser = this.$store.state.user.userInfo.userId
					} else {
						params.addUser = this.$store.state.user.userInfo.userId
					}
					let {
						data: { resultCode },
					} =
						this.recallServiceRow.recallRuleId ||
						this.recallServiceRow.recallRuleId == 0
							? await rcRecallRuleAuditUpdateById(params)
							: await rcRecallRuleAuditAdd(params)
					if (resultCode == 0) {
						this._rcFlowRuleRecordUpdateUser()
						this.recallServiceRow.recallRuleId
							? this.$message.success('编辑成功')
							: this.$message.success('新建成功')
						this.$emit('recallRefresh', true)
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

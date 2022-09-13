<template>
	<div>
		<el-dialog
			width="800px"
			:title="itemInfo && itemInfo.name ? '查看实验' : '创建实验'"
			:close-on-click-modal="false"
			:modal-append-to-body="true"
			:append-to-body="true"
			:visible.sync="showExprimentDialog"
			:before-close="resetForm"
		>
			<el-form
				:model="itemInfo"
				ref="exprimentForm"
				label-width="120px"
				class="demo-dynamic"
			>
				<el-form-item
					prop="experimentName"
					label="实验名称"
					:rules="[
						{
							required: true,
							message: '请输入实验名称',
							trigger: 'blur',
						},
					]"
				>
					<el-input
						class="w300"
						v-model="itemInfo.experimentName"
						maxlength="20"
					></el-input>
				</el-form-item>
				<el-form-item
					prop="rate"
					label="设置总流量"
					:rules="[
						{ required: true, message: '请设置总流量', trigger: 'blur' },
						{
							type: 'number',
							min: 0,
							max: 100,
							message: '必须为数字值，大于等于0，小于等于100',
							trigger: ['blur', 'change'],
						},
					]"
				>
					<el-input class="w300" v-model.number="itemInfo.rate"
						><i slot="suffix" class="el-input__icon">%</i></el-input
					>
					从总流量中选择一定百分比的流量来参与实验
				</el-form-item>
				<el-form-item
					prop="strategyType"
					label="策略流量类型"
					:rules="[
						{ required: true, message: '请选择策略流量类型', trigger: 'blur' },
					]"
				>
					<el-radio-group v-model="itemInfo.strategyType">
						<el-radio :label="1">流量比例</el-radio>
						<el-radio :label="2">用户分群（用户规则系统）</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm">确定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import { addOrUpdateExperiment } from '@/api/abTest'

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
		testInfo: {
			type: Object,
			default: () => ({}),
		},
	},

	data() {
		return {}
	},
	watch: {
		showExprimentDialog(isShow) {
			if (isShow) {
				this.itemInfo.strategyType = this.itemInfo.strategyType || 1
				this.itemInfo = JSON.parse(JSON.stringify(this.itemInfo))
			} else {
				this.itemInfo = {}
			}
		},
	},
	computed: {
		showExprimentDialog: {
			get() {
				return this.visible
			},
			set(val) {
				this.$emit('update:visible', val)
			},
		},
	},
	methods: {
		change() {
			this.$forceUpdate()
		},
		getForm() {
			return {
				variableName: '',
				strategyType: 1,
			}
		},
		submitForm: function () {
			this.$refs.exprimentForm.validate(async (valid) => {
				if (valid) {
					if (!this.itemInfo.testId) {
						this.itemInfo.testId = this.testInfo.id
					}
					let {
						data: { resultCode },
					} = await addOrUpdateExperiment(this.itemInfo)
					if (resultCode == 0) {
						this.$message({
							message: '操作成功',
							type: 'success',
						})
						setTimeout(() => {
							this.showExprimentDialog = false
							this.$emit('updateList', this.variableForm)
						}, 1000)
					}
				} else {
					this.$message.error('请填写信息后再重试')
				}
			})
		},
		// 关闭弹窗
		resetForm() {
			this.$refs.exprimentForm && this.$refs.exprimentForm.resetFields()
			this.showExprimentDialog = false
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

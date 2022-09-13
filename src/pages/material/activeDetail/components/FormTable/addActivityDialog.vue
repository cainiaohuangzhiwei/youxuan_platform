/* eslint-disable no-dupe-else-if */
<template>
	<div>
		<el-dialog
			width="600px"
			:title="addActivityRow.id ? '编辑活动' : '新增活动'"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="活动名称" prop="activityName">
					<el-input v-model="form.activityName" maxlength="50"></el-input>
				</el-form-item>
				<el-form-item label="活动描述">
					<el-input
						type="textarea"
						maxlength="120"
						show-word-limit
						:autosize="{ minRows: 4, maxRows: 6 }"
						v-model="form.activityDescription"
					></el-input>
				</el-form-item>
				<el-form-item>
					<div class="foot-b">
						<el-button type="primary" @click="submitForm('form')"
							>确定</el-button
						>
						<el-button @click="handleCancel">取消</el-button>
					</div>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import { activityInfoAdd, activityInfoEdit } from '@/api/newMaterial'
export default {
	props: {
		visible: {
			type: Boolean,
			define: false,
		},
		addActivityRow: {
			define: false,
			default: () => {},
		},
	},

	components: {},

	data() {
		return {
			rules: {
				activityName: [
					{
						required: true,
						message: '请输入活动名称',
						trigger: ['blur', 'change'],
					},
				],
			},
			form: {
				activityName: '',
				activityDescription: '',
			},
		}
	},
	watch: {
		localVisible(val) {
			this.$refs.form && this.$refs.form.resetFields()
			this.form.activityName = ''
			this.form.activityDescription = ''
			if (val) {
				this.form.activityName = this.addActivityRow.activityName || ''
				this.form.activityDescription =
					this.addActivityRow.activityDescription || ''
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
		submitForm(formName) {
			this.$refs[formName].validate(async (valid) => {
				if (valid) {
					await this._activityInfoAdd()
				}
			})
		},
		async _activityInfoAdd() {
			let params = {
				activityDescription: this.form.activityDescription,
				activityName: this.form.activityName,
			}
			if (this.addActivityRow.id) {
				params.id = this.addActivityRow.id
			}
			let {
				data: { resultCode, resultData },
			} = this.addActivityRow.id
				? await activityInfoEdit(params)
				: await activityInfoAdd(params)
			if (resultCode == 0) {
				if (this.addActivityRow.id) {
					this.$message.success('修改成功')
				} else {
					this.$message.success('新增成功')
				}
				this.$emit('refresh')
				this.localVisible = false
				this.$router.push({ name: 'activeDetail', params: { id: resultData } })
			}
		},
		handleCancel() {
			this.localVisible = false
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},
	},
}
</script>

<style lang="scss" scoped>
.foot-b {
	text-align: center;
}
</style>

<template>
	<div>
		<el-dialog
			width="600px"
			title="结算设置"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="open"
		>
			<el-form ref="form" :rules="rules" :model="form" label-width="110px">
				<el-form-item label="活动结算时间" class="inline-form-item">
					<el-radio-group :value="1" style="margin-right: 10px">
						<el-radio :label="1">类型一</el-radio>
					</el-radio-group>
					<el-form-item prop="actSettleTime">
						<el-date-picker
							v-model="form.actSettleTime"
							type="datetime"
							placeholder="结算时间"
							:picker-options="{
								disabledDate: (time) => {
									return time.getTime() < Date.now() - 8.64e7
								},
							}"
						>
						</el-date-picker>
					</el-form-item>
					<div>超过活动结算时间后，订单售后不再更新活动数据</div>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">确定</el-button>
					<el-button @click="cancel">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import { updateActSettleTime } from '@/api/marketing'
import moment from 'moment'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		settleRow: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {},

	data() {
		return {
			form: {
				id: '',
				actSettleType: 1,
				actSettleTime: '',
				endTime: '',
			},
			rules: {
				actSettleTime: [
					{
						validator: (_, value, callback) => {
							if (!value) {
								callback(new Error('请选择结算时间'))
							} else if (
								this.settleRow.endTime &&
								moment(this.form.actSettleTime).valueOf() <
									moment(this.settleRow.endTime).valueOf() + 8.64e7 * 25
							) {
								callback(new Error('结算时间不得小于活动结束时间25天'))
							} else if (
								this.settleRow.endTime &&
								moment(this.form.actSettleTime).valueOf() >
									moment(this.settleRow.endTime).valueOf() + 8.64e7 * 100
							) {
								callback(new Error('结算时间不得大于活动结束时间100天'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
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
		detail(type, row) {
			this.form.actSettleTime = this.settleRow.actSettleTime
				? moment(this.settleRow.actSettleTime).format('YYYY-MM-DD HH:mm:ss')
				: ''
			this.editLoading = true
			this.type = type

			if (type == 2) {
				const curRow = JSON.parse(JSON.stringify(row))
				this.form = {
					...curRow,
				}
			}
			this.editLoading = false
		},
		//保存
		onSubmit() {
			this.$refs.form.validate(async (valid) => {
				if (valid) {
					let paramsData = {
						id: this.settleRow.id,
						actSettleType: 1,
						actSettleTime: moment(this.form.actSettleTime).valueOf(),
					}

					this.loading = true
					const res = await updateActSettleTime(paramsData)
					const resultCode = res.data.resultCode
					if (resultCode == 0) {
						this.$message({
							message: '设置成功',
							type: 'success',
						})
						this.$emit('fatherMethodInit')
						this.localVisible = false
					}
				}
			})
		},

		resetForm() {
			this.localVisible = false
			this.form = {
				id: '',
				actSettleType: 1,
				actSettleTime: '',
				endTime: '',
			}
			this.$refs.form.resetFields()
		},

		cancel() {
			this.$refs.form && this.$refs.form.resetFields()
			this.localVisible = false
		},
	},
}
</script>

<style lang="scss" scoped>
.inline-form-item ::v-deep .el-form-item__content {
	.el-form-item {
		display: inline-block;
	}
	.el-form-item__error {
		word-break: keep-all;
	}
}
</style>

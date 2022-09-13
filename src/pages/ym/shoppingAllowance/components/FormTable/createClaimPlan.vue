<template>
	<div>
		<yx-dialog
			v-loading="loading"
			:title="dialogTitle"
			:visible.sync="visible"
			@open="open"
		>
			<yx-form
				labelWidth="80px"
				ref="form"
				:data="dialogData"
				:rules="rules"
				:items.sync="dialogCfg"
				:formAction="dialogAction"
			>
			</yx-form>
		</yx-dialog>
	</div>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import moment from 'moment'
// import { downloadFile } from '@/utils/helper/common'
// import { getSmallImg } from '@/utils/imageTool'
import { saveAllowancePlan, cmsAllowancePlan } from '@/api/shoppingAllowance'
export default {
	components: {
		YxDialog,
		YxForm,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		// 机构
		editItem: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			loading: false,
			visible: false,
			dialogAnchorVisible: false,
			dialogUserVisible: false,
			dialogTitle: '创建津贴领取计划',
			dialogData: {
				plantTime: ['', ''],
				actAllowancePlanName: '', //计划名称
				planAmount: '', //额度限度
				startTime: '', // 活动开始时间
				endTime: '', // 活动结束时间
			},
			rules: {
				actAllowancePlanName: [
					{
						required: true,
						message: '请输入计划名称',
						trigger: ['blur', 'change'],
					},
				],
				planAmount: [
					{
						required: true,
						message: '请输入正确的限领额度',
						pattern: /^\d+$/,
						trigger: ['blur', 'change'],
					},
				],
				plantTime: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value || !value[0] || !value[1]) {
								callback(new Error('请选择领取时间'))
							} else {
								callback()
							}
						},
						trigger: ['blur', 'change'],
					},
				],
			},
			dialogCfg: [
				{
					type: 'input',
					title: '计划名称',
					dataIndex: 'actAllowancePlanName',
					maxlength: 60,
				},
				{
					type: 'input',
					title: '限领额度',
					dataIndex: 'planAmount',
					maxlength: 20,
				},
				{
					type: 'time',
					title: '领取时间',
					dataIndex: 'plantTime',
					timeAttributes: {
						type: 'datetimerange',
						// pickerOptions: {
						// 	disabledDate(time) {
						// 		return time.getTime() < Date.now() - 8.64e7
						// 	},
						// },
					},
				},
			],
			dialogAction: [
				{
					title: '确定',
					type: 'primary',
					click: (e) => {
						this.saveAllowancePlan(e)
					},
				},
			],
		}
	},
	methods: {
		async saveAllowancePlan() {
			// 新增\修改
			let paramJson = {
				startTime: moment(this.dialogData.plantTime[0]).valueOf(),
				endTime: moment(this.dialogData.plantTime[1]).valueOf(),
				actAllowancePlanName: this.dialogData.actAllowancePlanName,
				planAmount: this.dialogData.planAmount,
			}
			if (this.dialogData.actAllowancePlanId) {
				paramJson.actAllowancePlanId = this.dialogData.actAllowancePlanId
			}
			// paramJson.groupId = 2
			this.loading = true
			let res = null
			if (this.dialogData.actAllowancePlanId) {
				res = await cmsAllowancePlan(paramJson)
			} else {
				res = await saveAllowancePlan(paramJson)
			}
			if (res.data.resultCode == 0) {
				this.$message({
					message: res.data.resultMsg,
					type: 'success',
				})
				this.visible = false
				this.$emit('updateList')
			}
			this.loading = false
		},
		async _getAllowancePlan(editItem) {
			// 获取详情
			this.dialogData.actAllowancePlanName = editItem.actAllowancePlanName
			this.dialogData.planAmount = editItem.planAmount
			this.dialogData.plantTime = [editItem.startTime, editItem.endTime]
			this.dialogData.actAllowancePlanId = editItem.actAllowancePlanId
			// this.dialogData = editItem
		},
	},
	watch: {
		visible(newVlaue) {
			this.$refs.form && this.$refs.form.$refs.YxForm.resetFields()
			this.$emit('update:dialogVisible', newVlaue)
			if (this.visible) {
				if (this.editItem && this.editItem.actAllowancePlanId) {
					this.dialogTitle = '修改津贴领取计划'
					this._getAllowancePlan(this.editItem)
				} else {
					this.dialogTitle = '创建津贴领取计划'
					this.dialogData = {
						plantTime: ['', ''],
						actAllowancePlanName: '', //计划名称
						planAmount: '',
						startTime: '', // 活动开始时间
						endTime: '', // 活动结束时间
					}
				}
			}
		},
		dialogVisible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.visible = newVlaue
			}
		},
		open() {},
	},
}
</script>

<style lang="scss">
.row_flex {
	display: flex;
	align-items: center;
}
.row_input {
	margin-right: 20px;
}
.nickname {
	margin-right: 10px;
	margin-bottom: 10px;
}
.btn {
	display: flex;
}
.excel {
	height: 32px;
	margin: 1px 10px 0 0;
}
</style>

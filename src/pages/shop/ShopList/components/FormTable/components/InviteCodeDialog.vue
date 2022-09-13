<template>
	<div>
		<el-dialog
			width="30%"
			:title="title"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			:destroy-on-close="true"
		>
			<yx-form
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			></yx-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="localVisible = false">取 消</el-button>
				<el-button type="primary" @click="_batchAddInviteCodeByOrganizationId"
					>确 定</el-button
				>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { batchAddInviteCodeByOrganizationId } from '@/api/shopList'
import moment from 'moment'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: '',
		},
		row: {
			type: Object,
			default: () => ({}),
		},
		rows: {
			type: Array,
			default: () => [],
		},
		multiple: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		YxForm,
	},

	data() {
		return {
			formInline: {
				inviteCodeCount: '',
				usefulTime: '',
				remark: '',
			},
			formCfg: [
				{
					title: '* 生成数量',
					type: 'inputNumber',
					dataIndex: 'inviteCodeCount',
				},
				{
					title: '使用期限',
					type: 'time',
					timeAttributes: {
						type: 'datetime',
					},
					dataIndex: 'usefulTime',
				},
				{
					title: '* 备注',
					type: 'textarea',
					dataIndex: 'remark',
				},
			],
		}
	},
	computed: {
		localVisible: {
			get() {
				return this.visible
			},
			set(val) {
				this.formInline.inviteCodeCount = ''
				this.formInline.usefulTime = ''
				this.formInline.remark = ''
				this.$emit('update:visible', val)
			},
		},
	},
	methods: {
		async _batchAddInviteCodeByOrganizationId() {
			if (this.formInline.inviteCodeCount == '') {
				this.$message.error('请输入数量')
				return
			}
			if (
				this.formInline.usefulTime != '' &&
				moment(this.formInline.usefulTime).valueOf() < new Date() * 1
			) {
				this.$message.error('时间不能少于当前时间')
				return
			}
			if (this.formInline.remark == '') {
				this.$message.error('请输入原因')
				return
			}

			let organizationIdList = []
			if (this.multiple) {
				organizationIdList = this.rows.map((item) => {
					return item.organizationId
				})
			} else {
				organizationIdList = [this.row.organizationId]
			}

			let paramJson = {
				inviteCodeCount: this.formInline.inviteCodeCount,
				remark: this.formInline.remark,
				organizationIdList,
			}
			if (this.formInline.usefulTime) {
				paramJson.isValidity = 1
				paramJson.usefulTime = moment(this.formInline.usefulTime).valueOf()
			} else {
				paramJson.isValidity = 2
			}
			let {
				data: { resultCode, resultMsg },
			} = await batchAddInviteCodeByOrganizationId(paramJson)

			if (resultCode === 0) {
				this.$message({
					message: '成功！',
					type: 'success',
				})
				this.$emit('refreshList')
			} else {
				this.$message.error(resultMsg)
			}
			this.localVisible = false
		},
	},
}
</script>

<style lang="scss" scoped></style>

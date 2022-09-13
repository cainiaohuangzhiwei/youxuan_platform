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
				<el-button type="primary" @click="_batchOperateOrganizationList"
					>确 定</el-button
				>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { batchOperateOrganizationList } from '@/api/shopList'
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
	},
	components: {
		YxForm,
	},
	data() {
		return {
			formInline: {
				remark: '',
			},
			formCfg: [
				{
					title: '备注',
					type: 'textarea',
					maxlength: 50,
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
				this.$emit('update:visible', val)
			},
		},
	},
	methods: {
		async _batchOperateOrganizationList() {
			if (this.formInline.remark == '') {
				this.$message.error('禁用备注必填且小于50字')
				return
			}
			let paramJson = {
				organizationIdList: [this.row.organizationId],
				operateType: 2,
				disableRemark: this.formInline.remark,
			}
			let {
				data: { resultCode, resultMsg },
			} = await batchOperateOrganizationList(paramJson)

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

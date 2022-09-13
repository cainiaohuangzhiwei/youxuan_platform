<template>
	<div>
		<el-dialog
			width="30%"
			title="注销店铺"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			:destroy-on-close="true"
		>
			<h4>店铺注销后，不可重新启用，请确认后进行操作</h4>
			<yx-form
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			></yx-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="localVisible = false">取 消</el-button>
				<el-button type="primary" @click="_deleteOrganizations"
					>确 定</el-button
				>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { deleteOrganizations } from '@/api/shopList'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
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
				reason: '',
			},
			formCfg: [
				{
					title: '备注',
					type: 'textarea',
					maxlength: 100,
					dataIndex: 'reason',
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
		async _deleteOrganizations() {
			if (this.formInline.reason == '') {
				this.$message.error('注销备注必填且小于100字')
				return
			}
			let paramJson = {
				organizationIds: [this.row.organizationId],
				reason: this.formInline.reason,
			}
			let {
				data: { resultCode, resultMsg },
			} = await deleteOrganizations(paramJson)

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

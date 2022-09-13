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
			let paramJson = {
				organizationIdList: [this.row.organizationId],
				operateType: 1,
				disableRemark: '',
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

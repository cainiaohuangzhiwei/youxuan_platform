<template>
	<div>
		<el-dialog
			width="30%"
			:title="title"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="open"
			:destroy-on-close="true"
		>
			<span>{{ message }}</span>
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
		type: {
			type: String,
			default: 'enable',
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
	data() {
		return {
			title: '',
			message: '',
			organizationIdList: [],
		}
	},
	methods: {
		async _batchOperateOrganizationList() {
			let paramJson = {
				organizationIdList: this.organizationIdList,
				disableRemark: '',
			}
			if (this.type === 'enable') {
				paramJson.operateType = 1
			} else {
				paramJson.operateType = 2
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
		open() {
			this.organizationIdList = this.row.map((item) => {
				return item.organizationId
			})
			if (this.type === 'enable') {
				this.title = '启用店铺'
				this.message = `是否启用${this.organizationIdList.length}个店铺`
			} else {
				this.title = '禁用店铺'
				this.message = `是否禁用${this.organizationIdList.length}个店铺`
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>

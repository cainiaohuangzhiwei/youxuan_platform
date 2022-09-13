<template>
	<div>
		<el-dialog
			width="30%"
			:title="title"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			:destroy-on-close="true"
			@open="open"
		>
			<yx-form
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			></yx-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="localVisible = false">取 消</el-button>
				<el-button type="primary" @click="_bindDepartmentId">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { bindDepartmentId } from '@/api/shopList'
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
		departmentList: {
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
			departmentMap: [],
			formInline: {
				departmentId: '',
				lowerDepartmentId: '',
			},
			formCfg: [
				{
					title: '部门',
					type: 'select',
					dataIndex: 'departmentId',
					placeholder: '一级部门',
					label: 'departmentName',
					change: this.departmentChange,
					options: [],
				},
				{
					type: 'select',
					dataIndex: 'lowerDepartmentId',
					label: 'departmentName',
					placeholder: '二级部门',
					options: [],
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
		async _bindDepartmentId() {
			let departmentId = this.formInline.lowerDepartmentId
				? this.formInline.lowerDepartmentId
				: this.formInline.departmentId
			if (!departmentId) {
				this.$message.warning('请选择部门')
				return
			}
			let organizationIds = []
			if (this.multiple) {
				organizationIds = this.rows.map((item) => {
					return item.organizationId
				})
			} else {
				organizationIds = [this.row.organizationId]
			}

			let departmentName = this.departmentMap.find(
				(item) => item.departmentId == departmentId
			)
			let paramJson = {
				organizationIds,
				departmentId,
				departmentName,
				scope: 1, //操作的范围。0：店主以及该店主所有下级；1：只操作该店主
			}
			let {
				data: { resultCode, resultMsg },
			} = await bindDepartmentId(paramJson)

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
			this.formCfg[0].options = this.departmentList
			this.departmentMap = this.departmentList
		},
		departmentChange(row) {
			let r = this.departmentList.find((ele) => ele.departmentId === row)
			if (r.childDepartmentList) {
				this.formCfg[1].options = [
					...r.childDepartmentList.map((item) => {
						return {
							lowerDepartmentId: item.departmentId,
							departmentName: item.departmentName,
						}
					}),
				]
				this.departmentMap = [...this.departmentMap, r.childDepartmentList]
			} else {
				this.formInline.lowerDepartmentId = ''
				this.formCfg[1].options = []
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>

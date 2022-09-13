<template>
	<div>
		<el-dialog
			width="40%"
			:title="title"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="open"
			:destroy-on-close="true"
		>
			<h4>设置店铺标签/群标签/小C标签</h4>
			<yx-form
				:inline="false"
				:data="formInline"
				:items.sync="formCfg"
				:formAction="formAction"
			></yx-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="localVisible = false">取 消</el-button>
				<el-button type="primary" @click="_marking">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { addOrganizationTagToOrganization } from '@/api/shopList'
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
				groupTagList: [],
				crowdList: [],
				littleCList: [],
				groupBadgeList: '',
			},
			formCfg: [
				{
					title: '店铺标签：(多选)',
					type: 'checkbox',
					dataIndex: 'groupTagList',
					label: 'tagName',
					options: [],
				},
				{
					title: '群标签：(多选)',
					type: 'checkbox',
					dataIndex: 'crowdList',
					label: 'tagName',
					options: [],
				},
				{
					title: '小C标签：(多选)',
					type: 'checkbox',
					dataIndex: 'littleCList',
					label: 'tagName',
					options: [],
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getBrandList()
				},
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
		open() {
			if (!this.multiple) {
				if (this.row.row.groupTagList) {
					this.formInline.groupTagList = this.row.row.groupTagList
						.map((item) => {
							if (item.type == 2) {
								return item.groupTagId
							}
						})
						.filter((item) => {
							return item != undefined
						})
					this.formInline.crowdList = this.row.row.groupTagList
						.map((item) => {
							if (item.type == 7) {
								return item.groupTagId
							}
						})
						.filter((item) => {
							return item != undefined
						})
					this.formInline.littleCList = this.row.row.groupTagList
						.map((item) => {
							if (item.type == 8) {
								return item.groupTagId
							}
						})
						.filter((item) => {
							return item != undefined
						})
					let groupBadgeList = this.row.row.groupTagList.filter((item) => {
						return item.type == 5
					})
					this.formInline.groupBadgeList = groupBadgeList.length
						? groupBadgeList[0].groupTagId
						: ''
				}
			}
			let formCfg = this.formCfg
			formCfg[0].options = this.row.groupTagList
			formCfg[1].options = this.row.crowdList
			formCfg[2].options = this.row.littleCList
			if (!this.multiple && formCfg.length == 3) {
				formCfg.push({
					title: '店铺徽章：(单选)',
					type: 'radio',
					dataIndex: 'groupBadgeList',
					label: 'tagName',
					options: this.row.groupBadgeList,
				})
			} else if (formCfg.length == 4 && this.multiple) {
				formCfg.splice(3, 1)
			}
			this.formCfg = formCfg
		},
		_marking: async function () {
			let organizationIdList = []
			if (this.multiple) {
				organizationIdList = this.rows.map((item) => {
					return item.organizationId
				})
			} else {
				organizationIdList = [this.row.row.organizationId]
			}
			let paramJson = {
				isBatch: false,
				tagIdList: [
					...this.formInline.groupTagList,
					...this.formInline.crowdList,
					...this.formInline.littleCList,
				],
				badgeId: this.formInline.groupBadgeList,
				organizationIdList: organizationIdList,
			}
			let {
				data: { resultCode, resultMsg },
			} = await addOrganizationTagToOrganization(paramJson)

			if (resultCode === 0) {
				this.$message({
					message: '修改成功！',
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

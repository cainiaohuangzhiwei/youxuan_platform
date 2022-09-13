<template>
	<yx-dialog
		:bottomBtn="bottomBtn"
		:visible.sync="localVisible"
		:before-close="resetForm"
		title="选择分群"
	>
		<yx-form
			:inline="true"
			:data="dialogData"
			:items="dialogCfg"
			:formAction="dialogAction"
		></yx-form>

		<el-row>
			<yx-table
				v-loading="showLoading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			>
			</yx-table>
		</el-row>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getSmallImg } from '@/utils/imageTool'
import { getUserGroupPageResult } from '@/api/userOperation'

export default {
	components: {
		YxDialog,
		YxForm,
		YxTable,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			define: false,
		},
		userGroupList: {
			type: Array,
			default: () => [],
		},
		userIdentity: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			getSmallImg: getSmallImg,
			selectUserGroupList: [],
			showLoading: false,
			currentTime: '',
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'userGroupId',
					title: 'ID',
				},
				{
					type: 'string',
					dataIndex: 'userGroupName',
					title: '分群名称',
				},
				{
					title: '分群店主人数',
					type: 'string',
					dataIndex: 'organizationCount',
				},
				{
					title: '操作',
					type: 'action',
					fixed: 'right',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.updatedUserGroup(row)
							},
							customRender: (action, row) => {
								action.title = this.findIndex(row) ? '添加' : '移除'
								return action
							},
						},
					],
				},
			],
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveUserGroup()
					},
				},
				{
					title: '取消',
					click: () => {
						this.resetForm()
					},
				},
			],
			dialogData: {
				userGroupName: '',
				goodsType: 1,
			},
			dialogCfg: [
				{
					type: 'input',
					title: '分群名称：',
					dataIndex: 'userGroupName',
					placeholder: '模糊搜索',
				},
			],
			dialogAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getData(true)
					},
				},
			],
			page: {
				count: 0,
				length: 5,
				currentPage: 1,
				pageSizes: [5],
				tableChange: () => {
					this.getData()
				},
			},

			tableData: [],
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
	mounted() {},
	watch: {
		localVisible(val) {
			if (val) {
				this.selectUserGroupList = JSON.parse(
					JSON.stringify(this.userGroupList)
				)
				this.getData()
			}
		},
	},
	methods: {
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			// this.$refs.form.$refs.YxForm.resetFields()
		},
		saveUserGroup() {
			// if (this.selectUserGroupList && this.selectUserGroupList.length > 1) {
			// 	return this.$message.warning('主推档期不能超过1个')
			// }
			this.$emit('saveUserGroup', this.selectUserGroupList)
			this.localVisible = false
		},
		findIndex(row) {
			// 判断是否已经添加用户
			let ids = this.selectUserGroupList.map((item) => {
				return item.userGroupId
			})
			return ids.indexOf(row.userGroupId) == -1
		},
		updatedUserGroup(row) {
			// 添加/移除用户
			const ids = this.selectUserGroupList.map((item) => {
				return item.userGroupId
			})
			if (ids.indexOf(row.userGroupId) == -1) {
				this.selectUserGroupList.push(row)
			} else {
				this.selectUserGroupList.splice(ids.indexOf(row.userGroupId), 1)
			}
		},

		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = Object.assign(this.dialogData, {
				pageSize: this.page.length,
				pageNum: this.page.currentPage,
				// 人群身份：用户身份 0：店主，1其他
				userIdentity: this.userIdentity,
				userGroupName: this.dialogData.userGroupName,
			})
			return paramJson
		},
		getData: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			const {
				data: { resultCode, resultData, total },
			} = await getUserGroupPageResult(paramJson)
			if (resultCode == 0) {
				this.tableData = resultData
				this.page.count = total
			} else {
				this.tableData = []
				this.page.count = 0
			}
			this.showLoading = false
		},
	},
}
</script>

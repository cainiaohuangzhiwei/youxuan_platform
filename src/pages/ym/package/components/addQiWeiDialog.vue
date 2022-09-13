<template>
	<yx-dialog
		title="选择企微群"
		:bottomBtn="bottomBtn"
		:visible.sync="localVisible"
		:before-close="resetForm"
		customClass="qiWei-dialog"
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
				:columns="dialogTableColumns"
				:pagination="dialogTablePage"
				:data="dialogTableData"
			>
			</yx-table>
		</el-row>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { searchGroupChat } from '@/api/groupChat'
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
			default: false,
		},
		defaultSelectList: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			selectList: [],
			showLoading: false,
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveSelect()
					},
				},
			],
			dialogData: {
				chatName: '',
				ownerName: '',
			},
			dialogCfg: [
				{
					type: 'input',
					title: '群名称',
					dataIndex: 'chatName',
				},
				{
					type: 'input',
					title: '群主',
					dataIndex: 'ownerName',
				},
			],
			dialogAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._searchList(true)
					},
				},
			],
			dialogTableColumns: [
				{
					type: 'string',
					dataIndex: 'chatId',
					title: '群ID',
					width: '280',
				},
				{
					type: 'string',
					dataIndex: 'chatName',
					title: '群名',
					width: '220',
				},
				{
					type: 'string',
					dataIndex: 'ownerName',
					title: '群主',
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.editUserList(row)
							},
							customRender: (action, row) => {
								action.title = this.findIndex(row) ? '添加' : '移除'
								return action
							},
						},
					],
				},
			],
			dialogTablePage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._searchList()
				},
			},
			dialogTableData: [],
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

	watch: {
		localVisible(val) {
			if (val) {
				this.selectList = JSON.parse(JSON.stringify(this.defaultSelectList))
				this._searchList()
			}
		},
	},
	methods: {
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			// this.$refs.form.$refs.YxForm.resetFields()
		},
		saveSelect() {
			this.$emit('saveSelect', this.selectList)
			this.localVisible = false
		},
		findIndex(row) {
			// 判断是否已经添加用户
			let ids = this.selectList.map((item) => {
				return item.chatId
			})
			return ids.indexOf(row.chatId) == -1
		},
		editUserList(row) {
			// 添加/移除用户
			let ids = this.selectList.map((item) => {
				return item.chatId
			})
			if (ids.indexOf(row.chatId) == -1) {
				this.selectList.push(row)
			} else {
				this.selectList.splice(ids.indexOf(row.chatId), 1)
			}
		},
		findParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.dialogTablePage.currentPage = 1
			}
			// 用户搜索条件
			let paramJson = Object.assign(
				{
					startIndex:
						(this.dialogTablePage.currentPage - 1) *
						this.dialogTablePage.length,
					length: this.dialogTablePage.length,
					pageNum: this.dialogTablePage.currentPage,
					pageSize: this.dialogTablePage.length,
				},
				this.dialogData
			)
			return paramJson
		},
		async _searchList(flag) {
			// 用户列表
			this.showLoading = true
			let paramJson = this.findParams(flag)
			let {
				data: { resultCode, resultData },
			} = await searchGroupChat(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.dialogTableData = resultData.records || []
				this.dialogTablePage.count = resultData.total || 0
			} else {
				this.dialogTablePage.count = 0
				this.dialogTableData = []
			}
		},
	},
}
</script>
<style lang="scss">
.qiWei-dialog .el-dialog__body {
	max-height: none;
	padding: 10px 20px 0;
}
</style>

<template>
	<yx-dialog title="添加用户" :bottomBtn="bottomBtn" :visible.sync="visible">
		<yx-form
			:inline="true"
			:data="dialogData"
			:items="dialogCfg"
			:formAction="dialogAction"
		></yx-form>
		<el-row>
			<yx-table
				v-loading="showLoading"
				:columns="tialogColumns"
				:pagination="tialogPage"
				:data="tialogData"
			>
			</yx-table>
		</el-row>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getUser } from '@/api/yhtPlusCmsPlanEquity'
export default {
	components: {
		YxDialog,
		YxForm,
		YxTable,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		userIds: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			showLoading: false,
			visible: false,
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveUsers()
					},
				},
			],
			dialogData: {
				userIdCms: '', // 用户id
				openId: '', // 用户openId
				phoneMob: '', // 手机号码
			},
			dialogCfg: [
				{
					type: 'input',
					title: '用户id',
					dataIndex: 'userIdCms',
					placeholder: '用户id',
				},
				{
					type: 'input',
					title: '用户openid',
					dataIndex: 'openId',
					placeholder: '用户openid',
				},
				{
					type: 'input',
					title: '手机号码',
					dataIndex: 'phoneMob',
					placeholder: '手机号码',
				},
			],
			dialogAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getUser(true)
					},
				},
			],
			tialogColumns: [
				{
					type: 'string',
					dataIndex: 'userId',
					title: '用户id',
				},
				{
					type: 'string',
					dataIndex: 'nickname',
					title: '用户名称',
				},
				{
					type: 'string',
					dataIndex: 'openId',
					title: '用户openid',
				},
				{
					type: 'string',
					dataIndex: 'phoneMob',
					title: '手机号码',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
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
			tialogPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getUser()
				},
			},
			tialogData: [],
		}
	},
	methods: {
		saveUsers() {
			this.visible = false
		},
		findIndex(row) {
			// 判断是否已经添加用户
			let ids = this.userIds.map((item) => {
				return item.userId
			})
			return ids.indexOf(row.userId) == -1
		},
		editUserList(row) {
			// 添加/移除用户
			let ids = this.userIds.map((item) => {
				return item.userId
			})
			if (ids.indexOf(row.userId) == -1) {
				this.userIds.push(row)
			} else {
				this.userIds.splice(ids.indexOf(row.userId), 1)
			}
		},
		findUserParams(flag) {
			// 用户搜索条件
			let paramJson = Object.assign(this.dialogData, {
				startIndex: 0,
				length: 1,
				groupId: 2,
			})
			// 每页的加载数据长度
			paramJson.length = this.tialogPage.length
			// 当前页的条数开始
			if (flag) {
				this.tialogPage.currentPage = 1
			}
			paramJson.startIndex =
				(this.tialogPage.currentPage - 1) * this.tialogPage.length
			return paramJson
		},
		async _getUser(flag) {
			// 用户列表
			this.showLoading = true
			let paramJson = this.findUserParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getUser(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tialogData = resultData.userList
				this.tialogPage.count = resultData.count
			} else {
				this.tialogPage.count = 0
				this.tialogData = []
			}
		},
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
			if (this.visible) {
				this._getUser(true)
			}
		},
		dialogVisible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.visible = newVlaue
			}
		},
	},
}
</script>

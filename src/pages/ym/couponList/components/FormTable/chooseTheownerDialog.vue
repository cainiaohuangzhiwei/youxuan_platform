<template>
	<yx-dialog
		title="选择店主"
		:bottomBtn="bottomBtn"
		:visible.sync="localVisible"
		:before-close="resetForm"
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
import { getOrganizationListByCondition } from '@/api/coupon'
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
		rangeExt: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			selectGroupList: [],
			showLoading: false,
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveBrand()
					},
				},
			],
			dialogData: {
				phone: '',
				keyword: '',
			},
			dialogCfg: [
				{
					type: 'input',
					title: '手机号',
					dataIndex: 'phone',
				},
				{
					type: 'input',
					title: '店铺名称',
					dataIndex: 'keyword',
				},
			],
			dialogAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getOrganizationListByCondition(true)
					},
				},
			],
			tialogColumns: [
				{
					type: 'string',
					dataIndex: 'userId',
					title: '用户ID',
					customRender: (row) => {
						if (row.userId) {
							return row.userId
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: '店铺ID',
				},
				{
					type: 'string',
					dataIndex: 'phone',
					title: '手机号',
				},
				{
					type: 'string',
					dataIndex: 'organizationName',
					title: '店铺名称',
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
								action.hide = row.isBanding == 2
								return action
							},
						},
						{
							title: '未绑定',
							click: () => {
								return false
							},
							customRender: (action, row) => {
								action.hide = row.isBanding != 2
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
					this._getOrganizationListByCondition()
				},
			},
			tialogData: [],
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
				this.selectGroupList = JSON.parse(JSON.stringify(this.rangeExt))
				// this._getGoodsGroupListByConditionForCMS()
			}
		},
	},
	methods: {
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			// this.$refs.form.$refs.YxForm.resetFields()
		},
		saveBrand() {
			this.$emit('saveBrand', this.selectGroupList)
			this.localVisible = false
		},
		findIndex(row) {
			// 判断是否已经添加用户
			let ids = this.selectGroupList.map((item) => {
				return item.userId
			})
			return ids.indexOf(row.userId) == -1
		},
		editUserList(row) {
			// 添加/移除用户
			let ids = this.selectGroupList.map((item) => {
				return item.userId
			})
			if (ids.indexOf(row.userId) == -1) {
				this.selectGroupList.push(row)
			} else {
				this.selectGroupList.splice(ids.indexOf(row.userId), 1)
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
		async _getOrganizationListByCondition(flag) {
			// 用户列表
			this.showLoading = true
			let paramJson = this.findUserParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getOrganizationListByCondition(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tialogData = resultData.organizationList
				this.tialogPage.count = resultData.organizationCount
			} else {
				this.tialogPage.count = 0
				this.tialogData = []
			}
		},
	},
}
</script>

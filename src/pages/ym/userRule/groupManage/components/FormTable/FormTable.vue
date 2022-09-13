<template>
	<basic-container>
		<div>
			<div class="create-btn-box">
				<el-button type="primary" class="createBtn" @click="showUploadDialog"
					>创建人群</el-button
				>
			</div>
			<yx-form
				:inline="true"
				:data="formInline"
				:items="searchFormCfg"
				:formAction="formAction"
				align="right"
			>
				<template slot="onlyMine">
					<el-switch
						v-model="formInline.onlyMine"
						@change="getUserGroups(true)"
					>
					</el-switch>
				</template>
			</yx-form>
			<yx-table
				v-loading="loading"
				:columns="tableColumns"
				:data="list"
			></yx-table>

			<el-row type="flex" class="row-bg pagination" justify="end">
				<el-pagination
					background
					layout="total, sizes, prev, pager, next, jumper"
					:total="totalCount"
					:page-size="formInline.pageSize"
					:current-page="formInline.pageNum"
					@current-change="changePage"
					@size-change="sizeChange"
				>
				</el-pagination>
			</el-row>

			<Dialog
				:visible.sync="dialogVisible"
				:row.sync="row"
				:successCallback="onSubmit"
			/>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import Dialog from '../Dialog/index'
import YxTable from '@wg-vue-materials/yx-table'
import {
	userGroupConfigList,
	updateUserTag,
	removeById,
} from '@/api/platformUserGroupTag'

import moment from 'moment'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},
	data() {
		return {
			row: {},
			dialogVisible: false,
			selectTagIds: [],
			totalCount: 0,
			formInline: {
				pageSize: 10,
				pageNum: 1,
				keyWord: '',
				onlyMine: false,
			},
			optionsArr: [
				{
					value: 10,
					label: '10条/页',
				},
				{
					value: 20,
					label: '20条/页',
				},
				{
					value: 50,
					label: '50条/页',
				},
				{
					value: 100,
					label: '100条/页',
				},
				{
					value: 200,
					label: '200条/页',
				},
			],
			searchFormCfg: [
				{
					title: '人群名称/ID',
					type: 'input',
					dataIndex: 'groupName',
					placeholder: '请输入人群名称/ID',
				},
				{
					type: 'custom',
					dataIndex: 'onlyMine',
					title: '只看我创建',
				},
			],
			formAction: [
				// {
				// 	title: '重置',
				// 	isClear: true,
				// },
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getUserGroups(true)
					},
				},
			],
			// 详情数据
			list: [],
			loading: false,
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'id',
					title: '人群ID',
				},
				{
					type: 'string',
					dataIndex: 'groupName',
					title: '人群名称',
				},
				{
					type: 'string',
					dataIndex: 'groupExpression',
					title: '规则',
				},
				{
					type: 'string',
					dataIndex: 'updateTime',
					title: '最后更新时间',
					customRender: (row) => {
						return row.updateTime
							? moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'creator',
					title: '创建者',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '编辑',
							// auth: 'updateUserTag',
							type: 'primary',
							click: (row) => {
								this.showUploadDialog(row)
							},
						},
						{
							title: '删除',
							// auth: 'updateUserTag',
							popconfirm: true,
							popconfirmTitle: '确认要删除该人群吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'danger',
							type: 'danger',
							cancelButtonType: 'text',
							confirm: (row) => {
								this.delete(row)
							},
						},
					],
				},
			],
		}
	},

	created() {
		this.formInline.setTime = [
			moment().startOf('day').valueOf(),
			moment().endOf('day').valueOf(),
		]
	},
	mounted() {
		this.getUserGroups()
	},
	methods: {
		onSubmit() {
			this.getUserGroups(true)
		},
		changePage(val) {
			this.formInline.pageNum = val
			this.getUserGroups()
		},

		sizeChange(val) {
			this.formInline.pageSize = val
			this.getUserGroups()
		},
		// 删除
		async delete(row) {
			if (!row.id) return
			const {
				data: { resultCode },
			} = await removeById({
				id: row.id,
				operator: this.$store.state.user.userInfo.userName,
				operatorId: this.$store.state.user.userInfo.userId,
			})

			if (resultCode === 0) {
				this.$message.success('删除成功')
				this.getUserGroups()
			}
		},
		// 编辑
		async edit(row) {
			// status === 0是禁用 ， 1 是启用
			const newStatus = row.status === 1 ? 0 : 1
			const confirmText = newStatus === 0 ? '禁用' : '启用'
			this.$confirm(`是否${confirmText}该分群？`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					this.loading = true
					const {
						data: { resultCode },
					} = await updateUserTag({
						userTagId: row.userTagId,
						status: newStatus,
					})
					this.loading = false
					if (resultCode == 0) {
						const newLists = this.list.map((item) => {
							if (item.userTagId === row.userTagId) {
								item.status = newStatus
							}
							return item
						})
						this.$message({
							type: 'success',
							message: '操作成功!',
						})
						this.list = [...newLists]
					}
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消操作!',
					})
				})
		},

		// 初始化
		async getUserGroups(flag) {
			if (flag) {
				this.formInline.pageNum = 1
			}
			// 只看自己创建的数据
			if (this.formInline.onlyMine) {
				this.formInline.creator = this.$store.state.user.userInfo.userName
			} else {
				delete this.formInline.creator
			}
			this.loading = true
			this.list = []
			this.formInline.startCreateTime = this.formInline.setTime
				? moment(this.formInline.setTime[0]).format('x')
				: ''
			this.formInline.endCreateTime = this.formInline.setTime
				? moment(this.formInline.setTime[1]).format('x')
				: ''
			const {
				data: { resultCode, resultData, total },
			} = await userGroupConfigList(this.formInline)
			if (resultCode == 0) {
				this.list = resultData || []
				this.totalCount = total || 0
			} else {
				this.list = []
			}
			this.loading = false
		},

		// 展示弹窗
		showUploadDialog: function (row) {
			this.dialogVisible = true
			this.row = row
		},
	},
}
</script>

<style lang="scss" scoped>
.el-sel {
	width: 100px;
	margin-right: 10px;
}
.pagination {
	margin-top: 30px;
}
.createBtn {
	margin-bottom: 10px;
}
.create-btn-box {
	text-align: right;
	margin-bottom: 20px;
	border-bottom: dashed 1px #ddd;
}
</style>

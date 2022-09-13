<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			></yx-form>
			<!-- <el-button
				type="primary"
				class="cacheRedis"
				@click="refreshTagsRedisCache"
				>刷新选中项缓存</el-button
			> -->
			<yx-table
				v-loading="loading"
				:columns="tableColumns"
				:data="list"
				:selectionChange="handleSelectionChange"
				:select="true"
			></yx-table>

			<el-row type="flex" class="row-bg pagination" justify="end">
				<el-pagination
					background
					layout="total, sizes, prev, pager, next, jumper"
					:total="totalCount"
					:page-size="formInline.pageSize"
					:current-page="formInline.currentPage"
					:hide-on-single-page="true"
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
import { getUserTagConfig } from '@/api/questionNaire'
import {
	getUserTagList,
	updateUserTag,
	refreshRedisCache,
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
			isData: false,
			dialogVisible: false,
			selectTagIds: [],
			totalCount: 0,
			formInline: {
				pageSize: 10,
				currentPage: 1,
				setTime: [],
				endCreateTime: '', //结束时间
				startCreateTime: '', //开始时间
				userTagId: '', //分群ID
				tagType: '', //分群类型
				tagName: '', // 分群名称
				status: '', //分群状态
				creatorName: '', //创建人人名称
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
			formCfg: [
				{
					title: '分群ID',
					type: 'input',
					dataIndex: 'userTagId',
					placeholder: '请输入内容',
				},
				{
					title: '分群名称',
					type: 'input',
					dataIndex: 'tagName',
					placeholder: '请输入内容',
				},
				{
					title: '分群类型',
					type: 'selectMap',
					dataIndex: 'tagType',
					options: {
						全部: '',
						规则创建: 1,
						批量上传: 2,
					},
				},
				{
					title: '状态',
					type: 'selectMap',
					dataIndex: 'status',
					options: {
						全部: '',
						启用: 1,
						禁用: 0,
					},
				},
				// {
				// 	title: '创建人',
				// 	type: 'input',
				// 	dataIndex: 'creatorName',
				// 	placeholder: '请输入内容',
				// },
				{
					title: '创建时间',
					type: 'time',
					dataIndex: 'setTime',
					placeholder: ['开始时间', '结束时间'],
					timeAttributes: {
						type: 'datetimerange',
						pickerOptions: {
							disabledDate: (time) => {
								let nowDate = new Date()
								let oneDay = 1000 * 60 * 60 * 24
								let oneYearLater = new Date(nowDate.getTime() - oneDay * 182)
								return time.getTime() > nowDate || time.getTime() < oneYearLater
							},
						},
					},
				},
			],
			formAction: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.callExchangeGroupsList(true)
					},
				},
				{
					title: '上传用户分群',
					type: 'success',
					auth: 'addUserTag',
					click: () => {
						this.showUploadDialog()
					},
				},
				{
					title: '刷新选中项缓存',
					type: 'primary',
					auth: 'refreshUserTagsRedisCache',
					click: () => {
						this.refreshTagsRedisCache()
					},
				},
			],
			// 详情数据
			list: [],
			bizTypeList: [],
			loading: false,
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'userTagId',
					title: '分群ID',
				},
				{
					type: 'string',
					dataIndex: 'tagName',
					title: '分群名称',
				},
				{
					type: 'string',
					dataIndex: 'userNum',
					title: '分群人数',
				},
				{
					type: 'string',
					dataIndex: 'tagType',
					title: '分群类型',
					customRender: (row) => {
						return row.tagType === 1 ? '规则创建' : '批量上传'
					},
				},
				{
					type: 'string',
					dataIndex: 'bizType',
					title: '分群业务',
					customRender: (row) => {
						let index = this.bizTypeList.findIndex(
							(item) => item.type === row.bizType
						)
						return (
							(this.bizTypeList[index] && this.bizTypeList[index].desc) || ''
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'createTime',
					title: '创建时间',
					customRender: (row) => {
						return row.createTime
							? moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '状态',
					customRender: (row) => {
						return row.status === 0 ? '禁用' : '启用'
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '禁用',
							auth: 'updateUserTag',
							click: (row) => {
								this.changeStatus(row)
							},
							customRender: (action, row) => {
								action.title = row.status == 1 ? '禁用' : '启用'
								return action
							},
						},
						{
							title: '继续上传',
							auth: 'updateUserTag',
							customRender: (action, row) => {
								action.hide = row.tagType == 1
								return action
							},
							click: (row) => {
								this.showUploadDialog(row)
							},
						},
						{
							title: '覆盖上传',
							// auth: 'updateUserTag',
							// customRender: (action, row) => {
							// 	action.hide = row.tagType == 1
							// 	return action
							// },
							click: (row) => {
								let info = { ...row, clearUserTag: true }
								this.showUploadDialog(info)
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
		this._getUserTagConfig()
		this.callExchangeGroupsList()
	},
	methods: {
		async _getUserTagConfig() {
			let {
				data: { resultData, resultCode },
			} = await getUserTagConfig()
			if (resultCode == 0) {
				this.bizTypeList = resultData.bizTypeList || []
			}
		},
		onSubmit() {
			this.callExchangeGroupsList(true)
		},
		changePage(val) {
			this.formInline.currentPage = val
			this.callExchangeGroupsList()
		},

		sizeChange(val) {
			this.formInline.pageSize = val
			this.callExchangeGroupsList()
		},

		// 刷新缓存
		handleSelectionChange(tagIds) {
			this.selectTagIds = tagIds.map((item) => item.userTagId)
		},

		async refreshTagsRedisCache() {
			const {
				data: { resultCode },
			} = await refreshRedisCache({
				tagIds: this.selectTagIds || [],
			})
			if (resultCode == '0') {
				this.$message.success('刷新缓存成功!')
			} else {
				this.$message.error('刷新缓存失败!')
			}
		},

		// 启用/禁用
		async changeStatus(row) {
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
		async callExchangeGroupsList(flag) {
			if (flag) {
				this.formInline.currentPage = 1
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
				data: { resultCode, resultData },
			} = await getUserTagList(this.formInline)
			if (resultCode == 0) {
				if (
					resultData?.records.length === 0 ||
					resultData?.records.length < this.formInline.pageSize
				) {
					this.isData = true
				} else {
					this.isData = false
				}
				this.list = resultData?.records || []
				this.totalCount = resultData?.total || 0
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
.cacheRedis {
	margin-bottom: 10px;
}
</style>

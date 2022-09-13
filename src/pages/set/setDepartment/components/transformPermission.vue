<template>
	<div>
		<yx-form
			:inline="true"
			:data="searchData"
			:items="searchCfg"
			:formAction="searchAction"
		></yx-form
		><el-row>
			<yx-table
				v-loading="showLoading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			></yx-table>
		</el-row>
		<Dialog
			:title="sceneTitle"
			:visible="newlyIncreased"
			width="50%"
			:bottomBtn="newlyIncreasedBottomBtn"
			@before-close="newlyIncreased = false"
		>
			<yx-form
				ref="dialog"
				labelWidth="100px"
				:rules="formRules"
				:data="newData"
				:items="dialogCfg"
			>
			</yx-form>
		</Dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import {
	createProject,
	projectList,
	delProject,
	refreshSupplier,
} from '@/api/cmsFunctionProject'
import moment from 'moment'
import { isNull } from '@/utils/helper/common'
export default {
	components: {
		YxForm,
		YxTable,
		Dialog,
	},
	data() {
		return {
			showLoading: false, //列表加载
			newlyIncreased: false, //弹框开关
			//新增编辑参
			newData: {
				projectName: '',
				comment: '',
			},
			formRules: {
				projectName: [
					{ required: true, message: '请输入项目名称', trigger: 'blur' },
				],
				comment: [
					{ required: true, message: '请输入项目描述', trigger: 'blur' },
				],
			},
			//查询参
			searchData: {
				projectName: '',
				isDelete: '',
			},
			//新增内容
			dialogCfg: [
				{
					type: 'input',
					title: '项目名称',
					dataIndex: 'projectName',
				},
				{
					title: '项目描述',
					type: 'textarea',
					dataIndex: 'comment',
					placeholder: '请输入项目描述',
				},
			],
			//查询内容
			searchCfg: [
				{
					type: 'input',
					title: '项目名称',
					dataIndex: 'projectName',
				},
				{
					type: 'select',
					title: '是否删除',
					dataIndex: 'isDelete',
					placeholder: '请选择删除状态',
					label: 'value',
					options: [
						{
							isDelete: '',
							value: '全部',
						},
						{
							isDelete: '1',
							value: '是',
						},
						{
							isDelete: '0',
							value: '否',
						},
					],
					change: () => {
						this.init(true)
					},
				},
			],
			sceneTitle: null, //弹框标题
			//确认新增 编辑
			newlyIncreasedBottomBtn: [
				{
					title: '确 认',
					type: 'primary',
					click: () => {
						this.$refs.dialog.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.confirmAdditional()
							}
						})
					},
				},
			],
			//初始查询
			searchAction: [
				{
					title: '搜索',
					type: 'primary',
					click: () => {
						this.init(true)
					},
				},
				{
					title: '新增',
					auth: 'createProject',
					type: 'primary',
					click: () => {
						this.additionalPermissions(null, 1)
						this.newData = {
							projectName: '',
						}
					},
				},
				{
					title: '刷新商家权限',
					auth: 'refreshSupplierProjectFunctionRedisCache',
					type: 'primary',
					click: () => {
						this.refreshPermissions()
					},
				},
			],
			tableData: [], //初始数据
			//表格
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'functionProjectId',
					title: '项目ID',
				},
				{
					type: 'string',
					dataIndex: 'projectName',
					title: '项目名称	',
				},
				{
					type: 'string',
					dataIndex: 'comment',
					title: '项目描述',
				},
				{
					type: 'string',
					dataIndex: 'createTime',
					title: '创建时间',
					customRender: (row) => {
						return row.createTime
							? moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'isDeleteDesc',
					title: '是否删除',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					fixed: 'right',
					actions: [
						// {
						// 	title: '修改项目',
						// 	click: (row) => {
						// 		this.additionalPermissions(row, 2)
						// 	},
						// },
						{
							title: '删除',
							auth: 'delProject',
							click: (row) => {
								let _this = this
								_this.$confirm('确定删除？', '提示', {
									type: 'warning',
									async callback(action) {
										if (action === 'confirm') {
											_this._messageDel(row.functionProjectId)
										}
									},
								})
							},
							customRender: (action, row) => {
								action.hide = row.isDeleteDesc != '否'
								return action
							},
						},
					],
				},
			],
			//分页
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
		}
	},

	created() {
		this.init(true)
	},

	methods: {
		//刷新权限
		async refreshPermissions() {
			let {
				data: { resultCode },
			} = await refreshSupplier([])
			if (resultCode == 0) {
				this.$message.success('成功')
			}
		},
		//新增编辑弹框
		additionalPermissions(row, type) {
			this.newlyIncreased = true
			this.$nextTick(() => {
				this.$refs.dialog.$refs.YxForm.clearValidate()
			})
			if (type == 1) {
				this.sceneTitle = '新增'
			} else {
				this.newData = row.releaseTime
				this.sceneTitle = '修改'
			}
		},
		//新增
		async confirmAdditional() {
			let paramJson = this.newData
			if (isNull(paramJson.projectName)) {
				this.$message.warning('请填入名字')
				return
			}
			if (isNull(paramJson.comment)) {
				this.$message.warning('请描述项目详细')
				return
			}
			let {
				data: { resultCode },
			} = await createProject(paramJson)
			if (resultCode == 0) {
				this.$message.success('新增成功')
				this.newlyIncreased = false
				this.init()
			}
		},
		//删除
		_messageDel: async function (functionProjectId) {
			let paramJson = {
				functionProjectId,
			}
			let {
				data: { resultCode },
			} = await delProject(paramJson)
			if (resultCode == 0) {
				this.$message.success('删除成功')
				this.init()
			}
		},
		//初始列表
		init: async function () {
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await projectList(this.searchData)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData =
					resultData && resultData.records ? resultData.records : []
				this.page.count = resultData.total
			} else {
				this.tableData = []
				this.page.count = 0
			}
		},
	},
}
</script>

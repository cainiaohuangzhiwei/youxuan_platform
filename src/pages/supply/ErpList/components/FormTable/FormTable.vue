<template>
	<basic-container>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="我方授权" name="one">
				<el-button class="mb20" type="primary" @click="handleEdit(1)"
					>新增ERP</el-button
				>
				<keep-alive>
					<yx-table
						v-loading="loadingOne"
						:columns="tableColumns"
						:pagination="page"
						:data="tableData"
					></yx-table>
				</keep-alive>
			</el-tab-pane>
			<el-tab-pane label="对方授权" name="two">
				<el-button class="mb20" type="primary" @click="handleEdit(1)"
					>新增ERP</el-button
				>
				<keep-alive>
					<yx-table
						v-loading="loadingTwo"
						:columns="tableColumnsTwo"
						:pagination="pageTwo"
						:data="tableDataSecond"
					></yx-table>
				</keep-alive>
			</el-tab-pane>
			<edit-dialog
				ref="mall"
				:title="title"
				:visible.sync="userDialog"
				@fatherMethodOne="fatherMethodOne"
				@fatherMethodTwo="fatherMethodTwo"
			/>
		</el-tabs>
	</basic-container>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import EditDialog from './EditDialog'
import {
	getErpList,
	projectList,
	projectStatusUpdate,
} from '@/api/YhtPlusCmsErpAction'

export default {
	components: {
		BasicContainer,
		YxTable,
		EditDialog,
	},
	name: 'FormTable',
	data() {
		return {
			activeName: 'one',
			tableData: [],
			tableDataSecond: [],
			userDialog: false,
			loadingOne: false,
			loadingTwo: false,
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'erpName',
					title: '名称',
				},
				{
					type: 'string',
					dataIndex: 'disabled',
					title: '状态',
					customRender: (row) => {
						return row.disabled == 0 ? '启用' : row.disabled == 1 ? '禁用' : '-'
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.handleEdit(row)
							},
						},
					],
				},
			],
			currentDtaOne: {
				imageName: '',
				sort: '',
				isHide: '0',
				imageList: [],
				jumpLocationLink: '',
			},
			tableColumnsTwo: [
				{
					type: 'string',
					dataIndex: 'projectName',
					title: 'ERP名称',
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '状态',
					customRender: (row) => {
						return row.status == 1 ? '启用' : '禁用'
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '禁用',
							click: (row) => {
								this.setStatus(row)
							},
							customRender: (action, row) => {
								action.title = row.status == 1 ? '禁用' : '启用'
								return action
							},
						},
						{
							title: '编辑',
							click: (row) => {
								this.handleEdit(row)
							},
							customRender: (action, row) => {
								action.hide = row.status == 1
								return action
							},
						},
					],
				},
			],
		}
	},
	created() {
		this._getErpList(true)
	},
	methods: {
		// 禁用/启用
		setStatus: async function (info) {
			let message = ''
			let isDisable = true
			const self = this
			console.log(info)
			if (info.status == 0) {
				message = '确认要启用    ' + info.projectName + ' ERP'
			} else {
				isDisable = false
				message = '确认要禁用    ' + info.projectName + '   ERP'
			}
			this.$alert(message, '提示', {
				confirmButtonText: '确定',
				callback: (action) => {
					if (action == 'confirm') {
						self.batchControl(info.outsideAccessSettingId, isDisable)
					}
				},
			})
		}, // 禁用/启用调取接口
		batchControl: async function (ids, flag) {
			let status = 1
			if (!flag) {
				status = 0
			}
			let {
				data: { resultCode, resultMsg },
			} = await projectStatusUpdate({
				outsideAccessSettingId: ids,
				status: status,
			})
			let type = ''
			if (resultCode == 0) {
				type = 'success'
			} else {
				type = 'error'
			}
			this.$message({
				message: resultMsg,
				type: type,
			})
			this._projectList()
		},
		// tab切换
		handleClick(tab) {
			if (tab.name == 'one') {
				this._getErpList()
			} else {
				this._projectList()
			}
		},
		// 子组件调用父组件选品区方法更新
		fatherMethodOne() {
			this._getErpList()
		},
		// 子组件调用父组件首页列表方法更新
		fatherMethodTwo() {
			this._projectList()
		},
		//获取我方
		async _getErpList() {
			this.loadingOne = true
			let res = await getErpList({})
			if (res.data.resultData && res.data.resultData.length) {
				this.tableData = res.data.resultData
				this.loadingOne = false
			} else {
				this.tableData = []
				this.loadingOne = false
			}
		},
		// 获取对方
		async _projectList() {
			this.loadingTwo = true
			let res = await projectList({})
			if (res.data.resultData && res.data.resultData.length) {
				this.tableDataSecond = res.data.resultData
				this.loadingTwo = false
			} else {
				this.tableData = []
				this.loadingTwo = false
			}
		},
		// 弹窗显示
		handleEdit(data) {
			this.userDialog = true
			if (data !== 1) {
				this.title = this.activeName === 'one' ? 3 : 4
				this.$nextTick(() => {
					this.$refs.mall.detail(data)
				})
			} else {
				this.title = this.activeName === 'one' ? 1 : 2
			}
		},
	},
}
</script>
<style lang="scss">
.poster_img {
	width: 50px;
	height: 50px;
}
</style>

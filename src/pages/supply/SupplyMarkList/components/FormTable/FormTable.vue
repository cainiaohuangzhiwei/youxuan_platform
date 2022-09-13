<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			></yx-form>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="list"
				></yx-table>
			</el-row>
		</div>
		<!-- 模拟账号 S -->
		<demo-account-dialog
			:dialogVisible.sync="demoAccounVisible"
			:selectItem="selectItem"
		></demo-account-dialog>
		<!-- 模拟账号 E -->
		<!-- 新增编辑商家登陆账号 S -->
		<add-supplier-dialog
			:dialogVisible.sync="addSupplierVisible"
			:selectItem="selectItem"
			@updateList="callSupplierAccountNumberTable(true)"
		></add-supplier-dialog>
		<!-- 新增编辑商家登陆账号 E -->
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import demoAccountDialog from './demoAccountDialog'
import addSupplierDialog from './addSupplierDialog'
import { getCmsSupplierClerkListByCondition } from '@/api/yhtPlusCmsSupplier'
import { updateSupplierClerkState } from '@/api/clerk'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		demoAccountDialog,
		addSupplierDialog,
	},
	name: 'FormTable',
	data() {
		return {
			showLoading: false,
			formInline: {
				userState: '', // 托管状态
				supplierName: '', // 商家名称
				mobPhone: '', // 手机号
				userName: '', // 登录账号名称
				name: '', // 姓名
			},
			demoAccounVisible: false, // 模拟登陆弹框
			addSupplierVisible: false, // 新增编辑弹框开关
			selectItem: {}, // 选中编辑项
			dialogVisibleAdd: false,
			formCfg: [
				{
					title: '商家名称',
					type: 'input',
					dataIndex: 'supplierName',
					placeholder: '商家名称',
					enter: () => {
						this.onSubmit()
					},
				},
				{
					title: '手机号',
					type: 'input',
					dataIndex: 'mobPhone',
					placeholder: '请输入手机号',
					enter: () => {
						this.onSubmit()
					},
				},
				{
					title: '登录账号名称',
					type: 'input',
					dataIndex: 'userName',
					placeholder: '请输入登录账号名称',
					enter: () => {
						this.onSubmit()
					},
				},
				{
					title: '姓名',
					type: 'input',
					dataIndex: 'name',
					placeholder: '请输入姓名',
					enter: () => {
						this.onSubmit()
					},
				},
				{
					title: '托管状态',
					type: 'selectMap',
					dataIndex: 'userState',
					options: {
						全部: '',
						禁用: 2,
						启用: 1,
					},
				},
			],
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: this.onSubmit,
				},
				{
					title: '新增商家登录账号',
					type: 'primary',
					click: () => {
						this.selectItem = {}
						this.addSupplierVisible = true
					},
				},
			],
			// 列表数据
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'clerkId',
					title: 'clerkID',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'string',
					dataIndex: 'userName',
					title: '登录账号名称',
					customRender: (row) => {
						if (row.scope != 4) {
							return row.userName
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'name',
					title: '姓名',
					customRender: (row) => {
						if (row.scope != 4) {
							return row.name
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'mobPhone',
					title: '手机号',
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '新增日期',
				},
				{
					type: 'map',
					dataIndex: 'userState',
					title: '状态',
					options: {
						禁用: 2,
						启用: 1,
					},
				},
				{
					type: 'action',
					dataIndex: 'action',
					title: '操作',
					actions: [
						{
							title: '模拟账号',
							auth: 'simulationSupplierByUserId',
							click: (row) => {
								this.redactEvents(row)
							},
						},
						{
							title: '编辑',
							auth: 'updateSupplierByUserId',
							click: (row) => {
								this.addEvents(row)
							},
						},
						{
							title: '禁用',
							auth: 'updateSupplierClerkState',
							click: (row) => {
								this.setStatus(row)
							},
							customRender: (action, row) => {
								action.title = row.userState == 2 ? '启用' : '禁用'
								return action
							},
						},
					],
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.callSupplierAccountNumberTable(false)
				},
			},
			list: [],
		}
	},
	created: function () {
		this.callSupplierAccountNumberTable(true)
	},
	methods: {
		// 查询列表数据
		callSupplierAccountNumberTable: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getCmsSupplierClerkListByCondition(paramJson)
			this.showLoading = false
			if (resultCode === 0) {
				this.list = resultData.clerkList
				this.page.count = resultData.clerkCount
			}
		},
		thisSplice(index) {
			this.counter.splice(index, 1)
		},
		cutOffTime(id) {
			console.log(id)
			this.counter.push({})
			this.addCutOffTime = true
		},
		onSubmit() {
			this.callSupplierAccountNumberTable(true)
		},
		redactEvents: async function (row) {
			this.selectItem = row
			this.demoAccounVisible = true
		},
		// 获取筛选的数据
		findSearchParams(flag) {
			let paramJson = this.formInline
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		addEvents(row) {
			this.selectItem = row
			this.addSupplierVisible = true
		},
		// 禁用/启用
		setStatus: async function (info) {
			let message = ''
			let isDisable = true
			const self = this
			console.log(info)
			if (info.userState == 2) {
				message = '确认要启用该员工    ' + info.clerkName + '    的账户'
			} else {
				isDisable = false
				message = '确认要禁用该员工    ' + info.clerkName + '    的账户'
			}
			this.$alert(message, '提示', {
				confirmButtonText: '确定',
				callback: (action) => {
					if (action == 'confirm') {
						self.batchControl([info.userId], isDisable)
					}
				},
			})
		},
		// 禁用/启用调取接口
		batchControl: async function (ids, flag) {
			let operateType = 1
			if (!flag) {
				operateType = 2
			}
			let {
				data: { resultCode, resultMsg },
			} = await updateSupplierClerkState({
				userIdList: ids,
				operateType: operateType,
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
			this.callSupplierAccountNumberTable()
		},
	},
}
</script>

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
		<!-- 新增编辑商家登陆账号 S -->
		<add-customer-dialog
			:dialogVisible.sync="addSupplierVisible"
			:selectItem="selectItem"
			@updateList="supplierServiceListTable(true)"
		></add-customer-dialog>
		<!-- 新增编辑商家登陆账号 E -->
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import addCustomerDialog from './addCustomerDialog'
import { supplierServiceList } from '@/api/yhtPlusSupplierService'
import moment from 'moment'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		addCustomerDialog,
	},
	name: 'FormTable',
	data() {
		return {
			showLoading: false,
			formInline: {
				supplierName: '', // 商家名称
				supplierId: '', // 商家ID
				qiyuSupplierId: '', // 七鱼商家账户ID
				startTime: '', //创建开始时间
				endTime: '', //创建结束时间
				supplierStatus: '', //绑定七鱼账户ID状态
			},
			addSupplierVisible: false, // 新增编辑弹框开关
			selectItem: {}, // 选中编辑项
			dialogVisibleAdd: false,
			formCfg: [
				{
					title: '商家ID',
					type: 'inputNumber',
					dataIndex: 'supplierId',
					placeholder: '请输入商家ID',
				},
				{
					title: '商家名称',
					type: 'input',
					dataIndex: 'supplierName',
					placeholder: '请输入商家名称',
				},
				{
					title: '七鱼商家账户ID',
					type: 'input',
					dataIndex: 'qiyuSupplierId',
					placeholder: '请输入七鱼商家账户ID',
				},
				{
					title: '绑定七鱼账户ID状态',
					type: 'select',
					dataIndex: 'supplierStatus',
					label: 'value',
					options: this.$store.state.app.constant.SEVEN_FISH_ACCOUNT,
				},
				{
					title: '创建时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
				},
			],
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: this.onSubmit,
				},
				{
					title: '新增',
					auth: 'addSupplierService',
					type: 'primary',
					click: () => {
						this.selectItem = {}
						this.addSupplierVisible = true
					},
				},
				{
					title: '批量导入绑定',
					auth: 'impostSupplierService',
					type: 'primary',
					click: () => {
						this.$router.push({ path: `/supply/importCustomer` })
					},
				},
			],
			// 列表数据
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'supplierId',
					title: '商家ID',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'string',
					dataIndex: 'qiyuSupplierId',
					title: '七鱼账号ID',
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '创建时间',
					customRender: (row) => {
						return row.addTime
							? moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'map',
					dataIndex: 'supplierStatus',
					title: '绑定七鱼账户ID状态',
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
							title: '编辑',
							auth: 'editSupplierService',
							click: (row) => {
								this.addEvents(row)
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
					this.supplierServiceListTable(false)
				},
			},
			list: [],
		}
	},
	created: function () {
		console.log('addSupplierVisible', this.addSupplierVisible)
		this.supplierServiceListTable(true)
	},
	methods: {
		// 查询列表数据
		supplierServiceListTable: async function (flag) {
			if (
				this.formInline.supplierId &&
				!/^[0-9]*$/.test(this.formInline.supplierId)
			) {
				return this.$message.error('商家ID数据格式不对')
			}
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await supplierServiceList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.list = resultData.records
				this.page.count = resultData.length
			}
		},
		onSubmit() {
			this.supplierServiceListTable(true)
		},
		redactEvents: async function (row) {
			this.selectItem = row
		},
		// 获取筛选的数据
		findSearchParams(flag) {
			const { startTime, endTime } = this.formInline
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = Object.assign(this.formInline, {
				startTime: moment(startTime).valueOf() || '',
				endTime: moment(endTime).valueOf() || '',
				startIndex: (this.page.currentPage - 1) * this.page.length,
				length: this.page.length,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始

			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		addEvents(row) {
			this.selectItem = row
			this.addSupplierVisible = true
		},
	},
}
</script>

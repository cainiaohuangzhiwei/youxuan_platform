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
		<Dialog
			title="出入库详情信息"
			:visible="compileEventsVisible"
			width="50%"
			:bottomBtn="outboundDetailsBottomBtn"
			@before-close="compileEventsVisible = false"
		>
			<yx-form
				:inline="true"
				:data="advancedData"
				:items="advancedCfg"
				:formAction="advancedAction"
			></yx-form>
		</Dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import { getWarehouseList, updateWarehouseByWarehouseId } from '@/api/warehouse'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},
	name: 'FormTable',
	data() {
		return {
			showLoading: false,
			formInline: {
				keyword: '', // 仓库名称
			},
			advancedData: {
				warehouseName: '',
				warehouseAddress: '',
				warehouseId: '',
				isDefault: '',
			},
			advancedCfg: [
				{
					title: '仓库名称',
					type: 'input',
					dataIndex: 'warehouseName',
					placeholder: '仓库名称',
				},
				{
					title: '仓库地址',
					type: 'input',
					dataIndex: 'warehouseAddress',
					placeholder: '仓库地址',
				},
				{
					type: 'radioMap',
					dataIndex: 'isDefault',
					title: '默认仓库',
					options: {
						设为默认: 1,
					},
				},
			],
			compileEventsVisible: false,
			formCfg: [
				{
					title: '仓库名称',
					type: 'input',
					dataIndex: 'keyword',
					placeholder: '仓库名称',
				},
			],
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: this.onSubmit,
				},
			],
			outboundDetailsBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: (row) => {
						this.ensureWarehouse(row)
					},
				},
			],
			// 列表数据
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'warehouseName',
					title: '仓库名称',
				},
				{
					type: 'string',
					dataIndex: 'warehouseAddress',
					title: '仓库地址',
				},
				{
					type: 'string',
					dataIndex: 'isDefault',
					title: '默认仓库',
					customRender: (row) => {
						return row.isDefault == 1 ? '是' : '否'
					},
				},
				{
					type: 'action',
					dataIndex: 'action',
					title: '操作',
					actions: [
						{
							title: '编辑',
							auth: 'updateWarehouseByWarehouseId',
							click: (row) => {
								this.compileEvents(row)
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
					this.callWarehouseList(false)
				},
			},
			list: [],
		}
	},
	created: function () {
		this.callWarehouseList(true)
	},
	methods: {
		// 查询列表数据
		callWarehouseList: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getWarehouseList(paramJson)
			this.showLoading = false
			if (resultCode === 0) {
				this.list = resultData.warehouseList
				this.page.count = resultData.warehouseCount
			}
		},
		onSubmit() {
			this.callWarehouseList(true)
		},
		ensureWarehouse: async function () {
			let paramJson = {
				warehouseId: this.advancedData.warehouseId,
				warehouseName: this.advancedData.warehouseName,
				warehouseAddress: this.advancedData.warehouseAddress,
				isDefault: this.advancedData.isDefault,
			}
			let {
				data: { resultCode, resultMsg },
			} = await updateWarehouseByWarehouseId(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.compileEventsVisible = false
				this.callWarehouseList()
			}
		},
		compileEvents(row) {
			console.log(row)
			this.compileEventsVisible = true
			this.advancedData.warehouseId = row.warehouseId
			this.advancedData.warehouseName = row.warehouseName
			this.advancedData.warehouseAddress = row.warehouseAddress
			this.advancedData.isDefault = row.isDefault
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
	},
}
</script>

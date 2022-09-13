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
					:selectionChange="selectionChange"
					:pagination="page"
					:data="list"
				></yx-table>
			</el-row>

			<edit-dialog
				ref="form"
				:visible.sync="formDialog"
				@fatherMethod="callSupplierAccountNumberTable(true)"
			/>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import EditDialog from './EditDialog'
import { getConstantValueByKey } from '@/utils/helper/common'
import {
	supplierAccountNumberList,
	supplierAccountNumberDelete,
} from '@/api/yhtPlusCmsSupplierAccountNumber'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		EditDialog,
	},
	name: 'FormTable',

	data() {
		return {
			showLoading: false,
			formInline: {
				keyword: '',
			},
			formCfg: [
				{
					title: '商家名称',
					type: 'input',
					dataIndex: 'keyword',
					placeholder: '商家名称',
				},
			],
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.callSupplierAccountNumberTable(true)
					},
				},
				{
					title: '新增商家',
					auth: 'supplierAccountNumberSave',
					type: 'primary',
					click: () => {
						this.handleEdit(1, {})
					},
				},
			],
			// 列表数据
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'supplierAccountNumberId',
					title: '商家账号ID',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家账号名称',
				},
				{
					type: 'string',
					dataIndex: 'isAutoOrder',
					title: '是否自动下单',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.YES_OR_NO,
							row.isAutoOrder,
							'-',
							'isAutoOrder'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'isDelayedOrder',
					title: '是否延时下单',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.YES_OR_NO,
							row.isDelayedOrder,
							'-',
							'isAutoOrder'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'isSelfPurchase',
					title: '是否限购',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.YES_OR_NO,
							row.isSelfPurchase,
							'-',
							'isAutoOrder'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'isHandleOrder',
					title: '是否快速处理工单',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.YES_OR_NO,
							row.isHandleOrder,
							'-',
							'isAutoOrder'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'endOrderTime',
					title: '截单时间',
					customRender: ({ endOrderTime, deliverMod }) => {
						return deliverMod == 1
							? endOrderTime
							: `下单成功后${endOrderTime}小时`
					},
				},
				{
					type: 'action',
					dataIndex: 'action',
					title: '操作',
					actions: [
						{
							title: '编辑',
							auth: 'supplierAccountNumberDelete',
							click: (row) => {
								this.handleEdit(2, row)
							},
						},
						{
							title: '删除',
							auth: 'supplierAccountNumberDelete',
							click: (row) => {
								this.delEvents(row)
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
			formDialog: false,
		}
	},

	created() {
		this.callSupplierAccountNumberTable(true)
	},

	methods: {
		// 查询列表数据
		async callSupplierAccountNumberTable(flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await supplierAccountNumberList(paramJson)
			this.showLoading = false
			if (resultCode === 0) {
				this.list = resultData.supplierAccountNumberList
				this.page.count = resultData.count
			}
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

		// 删除商家
		delEvents(row) {
			let self = this
			self.$confirm('确认要删除该商家账号吗？', '提示', {
				type: 'warning',

				callback: async function (action) {
					if (action === 'confirm') {
						let res = await supplierAccountNumberDelete({
							supplierAccountNumberId: row.supplierAccountNumberId,
						})
						if (res.data.resultCode === 0) {
							self.$message.success({
								message: res.data.resultMsg,
								duration: 1000,
								onClose() {
									self.callSupplierAccountNumberTable(true)
								},
							})
						}
					}
				},
			})
		},

		// 弹窗显示
		handleEdit(type, row) {
			this.formDialog = true
			this.$nextTick(() => {
				this.$refs.form.detail(type, row)
			})
		},
	},
}
</script>

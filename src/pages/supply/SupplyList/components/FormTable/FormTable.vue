<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			></yx-form>

			<yx-table
				v-loading="loading"
				:columns="tableColumns"
				:pagination="page"
				:data="list"
			></yx-table>

			<edit-dialog
				ref="form"
				:delType="delType"
				:visible.sync="formDialog"
				@onSubmit="onSubmit"
			/>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import { getConstantValueByKey } from '@/utils/helper/common'
import YxTable from '@wg-vue-materials/yx-table'
import EditDialog from '../components/EditDialog'
import {
	getCmsSupplierListByCondition,
	accountInfoConfirm,
} from '@/api/yhtPlusCmsSupplier'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		EditDialog,
	},
	data() {
		return {
			delType: '',
			formInline: {
				supplierName: '',
				mobPhone: '',
				name: '',
				accountInfoConfirm: '',
			},
			formCfg: [
				{
					title: '商家名称',
					type: 'input',
					dataIndex: 'supplierName',
					placeholder: '商家名称',
				},
				{
					title: '手机号',
					type: 'input',
					dataIndex: 'mobPhone',
					placeholder: '手机号',
				},
				{
					title: '商家姓名',
					type: 'input',
					dataIndex: 'name',
					placeholder: '商家姓名',
				},
				{
					title: '收款信息确认状态',
					type: 'select',
					dataIndex: 'accountInfoConfirm',
					label: 'value',
					options: this.$store.state.app.constant.PAYMENT_INFORMATION,
				},
			],
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: this.onSubmit,
				},
				{
					title: '新增商家',
					auth: 'addCmsSupplier',
					type: 'primary',
					click: () => {
						this.handleEdit(3, {})
					},
				},
			],
			// 详情数据
			list: [],
			loading: false,
			formDialog: false,
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'supplierId',
					title: '商家ID',
				},
				{
					type: 'string',
					dataIndex: 'supplierAccountNumberId',
					title: '商家账号ID',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'string',
					dataIndex: 'mobPhone',
					title: '手机号',
				},
				{
					type: 'string',
					dataIndex: 'name',
					title: '姓名',
				},
				{
					type: 'string',
					dataIndex: 'accountName',
					title: '银行账户名',
				},
				{
					width: 200,
					type: 'string',
					dataIndex: 'accountNumber',
					title: '银行账户号',
				},
				{
					width: 200,
					type: 'string',
					dataIndex: 'bankName',
					title: '银行名称',
				},
				{
					width: 100,
					type: 'string',
					dataIndex: 'bankCity',
					title: '银行城市',
					customRender: (row) => {
						return row.bankCity == 820032 ? '其它城市' : row.bankCity
					},
				},
				{
					type: 'string',
					dataIndex: 'bankSubbranch',
					title: '开户支行',
				},
				{
					type: 'string',
					dataIndex: 'accountInfoConfirm',
					title: '收款信息确认状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.PAYMENT_INFORMATION,
							row.accountInfoConfirm,
							'-',
							'accountInfoConfirm'
						)
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '编辑',
							auth: 'updateCmsSupplier',
							click: (row) => {
								this.handleEdit(1, row)
							},
						},
						{
							title: '查看',
							click: (row) => {
								this.handleEdit(2, row)
							},
						},
						{
							title: '确认收款信息',
							click: (row) => {
								this.paymentInformation(row)
							},
							customRender: (action, row) => {
								action.title = row.accountInfoConfirm == 0 ? '确认收款信息' : ''
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
					this.callExchangeGoodsList()
				},
			},
		}
	},

	created() {
		this.callExchangeGoodsList()
	},

	methods: {
		onSubmit() {
			this.callExchangeGoodsList(true)
		},

		// 查询
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.formInline, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})

			return paramJson
		},

		// 初始化
		async callExchangeGoodsList(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await getCmsSupplierListByCondition(paramJson)

			if (resultCode === 0) {
				this.list = resultData.supplierList
				this.page.count = resultData.count
				this.loading = false
			} else {
				this.loading = false
				this.page.count = 0
				this.list = []
			}
		},

		// 弹窗显示
		handleEdit(type, row) {
			this.formDialog = true
			this.delType = type
			this.$refs.form.detail(type, row)
		},
		// 确认商家收款信息
		async paymentInformation(row) {
			this.$confirm('是否确认商家收款信息无误？？', '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						let {
							data: { resultCode },
						} = await accountInfoConfirm({
							supplierId: row.supplierId,
						})
						if (resultCode == 0) {
							this.callExchangeGoodsList()
						}
					}
				},
			})
		},
	},
}
</script>

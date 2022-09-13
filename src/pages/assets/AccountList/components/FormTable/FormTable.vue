<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
				</yx-table>
			</el-row>
		</div>
		<add-account-dialog
			:visible.sync="showDialog"
			@updateList="init"
			:type="showType"
			:options="options"
		></add-account-dialog>
		<account-data-dialog
			:dataBankAccountId="dataBankAccountId"
			:visible.sync="showDataDialog"
		/>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import {
	getBankAccountListByCondition,
	checkFinancePassWord,
} from '@/api/yhtPlusCmsFinance'
import { getPublicKeyAndModel } from '@/api/webUser.js'
import AccountDataDialog from '../AccountDataDialog'
import AddAccountDialog from '../AddAccountDialog'
import RSA from 'js-rsa-dave'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		AddAccountDialog,
		AccountDataDialog,
	},
	name: 'FormTable',

	data() {
		return {
			isNeedPwd: true,
			showDialog: false,
			showLoading: false,
			showDataDialog: false,
			dataBankAccountId: '',
			searchData: {
				bankType: '',
				accountName: '', // 银行账户名称
			},
			searchCfg: [
				{
					type: 'select',
					title: '是否对公账户',
					dataIndex: 'bankType',
					label: 'value',
					options: [
						{
							bankType: '',
							value: '全部',
						},
						{
							bankType: 204,
							value: '是',
						},
						{
							bankType: 201,
							value: '否',
						},
					],
					change: () => {
						this.callGetBankAccountListByCondition(true)
					},
				},
				{
					type: 'input',
					title: '银行账户名称',
					dataIndex: 'accountName',
					enter: () => {
						this.callGetBankAccountListByCondition(true)
					},
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.callGetBankAccountListByCondition(true)
					},
				},
				{
					title: '新增提现账户',
					type: 'primary',
					auth: 'addBankAccount',
					click: () => {
						this.showType = 3
						this.showDialog = true
						this.options = ''
					},
				},
			],

			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'bankAccountId',
					title: '提现账户ID',
				},
				{
					type: 'string',
					dataIndex: 'bankName',
					title: '银行名称',
					width: '140',
				},
				{
					type: 'string',
					dataIndex: 'bankCity',
					title: '银行城市',
				},
				{
					type: 'string',
					dataIndex: 'accountName',
					title: '银行账户名',
				},
				{
					type: 'string',
					dataIndex: 'accountNumber',
					title: '银行账户号',
					width: '150',
				},
				{
					type: 'string',
					dataIndex: 'bankSubbranch',
					title: '开户支行',
					width: '100',
				},
				{
					type: 'string',
					dataIndex: 'cardNumber',
					title: '身份证号',
					customRender: (row) => {
						return row.cardNumber || '-'
					},
					width: '150',
				},
				{
					type: 'string',
					dataIndex: 'phone',
					title: '手机号',
					width: '100',
					customRender: (row) => {
						return row.phone || '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'sourceName',
					title: '所属设备',
					customRender: (row) => {
						return row.sourceName || '-'
					},
				},
				{
					type: 'amount',
					dataIndex: 'usableAmount',
					title: '银行卡余额',
					width: '100',
				},
				{
					type: 'amount',
					dataIndex: 'alipayAmount',
					title: '支付宝总额度',
					width: '100',
				},
				{
					type: 'amount',
					dataIndex: 'wxpayAmount',
					title: '微信总额度',
					width: '100',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '编辑',
							auth: 'updateBankAccount',
							click: (row) => {
								this.edit(row)
							},
						},
						{
							title: '查看记录',
							auth: 'updateBankAccount',
							click: (row) => {
								this.$router.push({
									path: `/finance/bankCardDetail/${row.bankAccountId}`,
								})
							},
						},
					],
				},
				{
					type: 'action',
					title: '操作记录',
					width: '100',
					actions: [
						{
							title: '查看操作记录',
							auth: 'updateBankAccount',
							click: (row) => {
								this.showDataDialog = true
								this.dataBankAccountId = row.bankAccountId
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
					this.callGetBankAccountListByCondition()
				},
			},
		}
	},

	methods: {
		init() {
			this.callGetBankAccountListByCondition(true)
		},

		async getRSAPassword(paramJson) {
			//加密方法
			let psw = paramJson.password.split('').reverse().join('')
			let rsaData = await getPublicKeyAndModel()
			let publicKey = RSA.getKeyPair(
				rsaData.data.resultData.publicKeyIndex,
				'',
				rsaData.data.resultData.modulus
			)
			paramJson.password = RSA.encryptedString(publicKey, psw)
			paramJson.privateKeySessionKey =
				rsaData.data.resultData.privateKeySessionKey
			return paramJson
		},
		edit(row) {
			// 编辑密码
			if (this.isNeedPwd) {
				this.$prompt('输入密码', '', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
					inputErrorMessage: '请输入密码',
					inputType: 'password',
				}).then(async ({ value }) => {
					const loading = this.$loading({
						lock: true,
						text: '校验密码中，请稍等',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)',
					})
					let {
						data: { resultCode },
					} = await checkFinancePassWord(
						await this.getRSAPassword({
							password: value,
						})
					)
					loading.close()
					if (resultCode == 0) {
						this.showType = 1
						this.showDialog = true
						this.options = row
						this.isNeedPwd = false
					}
				})
			} else {
				this.showType = 1
				this.showDialog = true
				this.options = row
			}
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		callGetBankAccountListByCondition: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData = {} },
			} = await getBankAccountListByCondition(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.bankAccountList || []
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>

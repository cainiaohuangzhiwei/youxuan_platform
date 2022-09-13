<template>
	<yx-dialog
		title="选择银行账户"
		:visible.sync="visible"
		:bottomBtn="bottomBtn"
	>
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
				>
					<template slot="select" slot-scope="scope">
						<el-radio v-model="selectItemId" :label="scope.row.bankAccountId">{{
							''
						}}</el-radio>
					</template>
				</yx-table>
			</el-row>
		</div>
	</yx-dialog>
</template>
<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getBankAccountListByCondition } from '@/api/yhtPlusCmsFinance'
import YxDialog from '@/components/Dialog/index.vue'
export default {
	components: {
		YxDialog,
		YxForm,
		YxTable,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		// 银行信息
		bankAccounInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	name: 'FormTable',
	data() {
		return {
			visible: false,
			selectItemId: null,
			showLoading: false,
			bottomBtn: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.change()
					},
				},
			],
			searchData: {
				accountName: '', // 银行账户
			},
			orderStatus: [],
			searchCfg: [
				{
					type: 'input',
					title: '筛选',
					dataIndex: 'accountName',
					placeholder: '请输入银行账户',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getBankAccountListByCondition(true)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'custom',
					dataIndex: 'select',
				},
				{
					type: 'string',
					dataIndex: 'sourceName',
					title: '公司名称',
					customRender: (row) => {
						return row.sourceName ? row.sourceName : '-'
					},
				},
				// {
				// 	type: 'string',
				// 	dataIndex: 'phone',
				// 	title: '店主手机号',
				// },
				{
					type: 'string',
					dataIndex: 'bankName',
					title: '账户名称',
					customRender: (row) => {
						return row.accountName + '-' + row.accountNumber
					},
				},
				{
					type: 'string',
					dataIndex: 'bankName',
					title: '开户行',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getBankAccountListByCondition()
				},
			},
		}
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
		},
		dialogVisible(newVlaue) {
			this.visible = newVlaue
			if (
				newVlaue &&
				this.bankAccounInfo &&
				this.bankAccounInfo.bankAccountId
			) {
				console
				this.selectItemId = this.bankAccounInfo.bankAccountId
			} else {
				this.selectItemId = null
			}
			this.searchData = {
				accountName: '',
			}
			this.tableData = []
			this.page.count = 0
		},
	},

	methods: {
		change() {
			if (!this.selectItemId) {
				return this.$message.warning('请选择账户')
			}
			for (let i = 0; i < this.tableData.length; i++) {
				if (this.tableData[i].bankAccountId == this.selectItemId) {
					this.tableData[i].accountNameAndNumber =
						this.tableData[i].accountName +
						'-' +
						this.tableData[i].accountNumber
					this.tableData[i].value =
						this.tableData[i].bankName +
						'-' +
						this.tableData[i].accountName +
						'-' +
						this.tableData[i].accountNumber
					this.$emit('update:bankAccounInfo', this.tableData[i])
					continue
				}
			}
			this.visible = false
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
		_getBankAccountListByCondition: async function (flag) {
			let paramJson = this.findSearchParams(flag)
			this.showLoading = true
			let {
				data: {
					resultCode,
					resultData: { bankAccountList = [], count = 0 },
				},
			} = await getBankAccountListByCondition(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = bankAccountList
				this.page.count = count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>

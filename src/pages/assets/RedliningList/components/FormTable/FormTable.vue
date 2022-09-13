<template>
	<basic-container>
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
		</div>
		<editBank
			:dialogVisible.sync="dialogVisible"
			:editInfo="editInfo"
			@updateList="_getBankList"
		></editBank>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getBankList } from '@/api/yhtPlusCmsSupplier'
import editBank from './components/editBank'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		editBank,
	},
	name: 'FormTable',

	data() {
		return {
			showLoading: false,
			dialogVisible: false,
			editInfo: {}, // 编辑项
			searchData: {
				bankName: '', // 银行名称
			},
			searchCfg: [
				{
					type: 'input',
					title: '银行名称',
					dataIndex: 'bankName',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getBankList(true)
					},
				},
				{
					title: '新增银行',
					type: 'primary',
					auth: 'exportLiveDatas',
					click: () => {
						this.setEditInfo()
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'bankName',
					title: '银行名称',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.setEditInfo(row)
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
					this._getBankList()
				},
			},
		}
	},

	created() {
		this._getBankList(true)
	},

	methods: {
		setEditInfo(row = {}) {
			this.editInfo = row
			this.dialogVisible = true
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
		_getBankList: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: {
					resultCode,
					resultData: { bankList = [], bankCount = 0 },
				},
			} = await getBankList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = bankList
				this.page.count = bankCount
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>

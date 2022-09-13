<template>
	<div>
		<yx-form
			:inline="true"
			:data="searchData"
			:items="searchCfg"
			:formAction="searchAction"
		></yx-form>
		<el-row>
			<yx-table
				:select="true"
				v-loading="loading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
				:selectionChange="selectionChange"
			></yx-table>
		</el-row>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { checkFunctionCode } from '@/utils/auth'
import {
	listGoodsMaterialWhite,
	batchUpdateGoodsMaterialWhitelist,
} from '@/api/businessMaterial'
import { getConstantValueByKey } from '@/utils/helper/common'
import moment from 'moment'
export default {
	components: {
		YxForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			whitelistBatchEnable: checkFunctionCode('whitelistBatchEnable'),
			whitelistBatchDisable: checkFunctionCode('whitelistBatchDisable'),
			getConstantValueByKey: getConstantValueByKey,
			moment: moment,
			searchData: {
				supplierNameList: '',
				supplierIdList: '',
				status: '',
			},
			loading: false,
			batchDialog: false,
			// 操作记录弹框开关
			dialogVisible: false,
			orderStatus: [],
			selectionData: [],
			operatingRecord: [],
			searchCfg: [
				{
					type: 'textarea',
					dataIndex: 'supplierNameList',
					title: '商家名',
					placeholder: '请输入商家名称,多个商家用逗号隔开或者换行',
				},
				{
					type: 'textarea',
					dataIndex: 'supplierIdList',
					title: '商家ID',
					placeholder: '请输入商家ID,多个商家用逗号隔开或者换行',
				},
				{
					type: 'select',
					title: '上传权限',
					dataIndex: 'status',
					label: 'value',
					options: [
						{
							status: '',
							value: '全部',
						},
						{
							status: 2,
							value: '禁用',
						},
						{
							status: 1,
							value: '启用',
						},
					],
					change: () => {
						this.init(true)
					},
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init(true)
					},
				},
				{
					title: '批量启用',
					auth: 'batchUpdateGoodsMaterialWhitelist',
					type: 'success',
					click: () => {
						this.handleForbidden(null, 2)
					},
				},
				{
					title: '批量禁用',
					auth: 'batchUpdateGoodsMaterialWhitelist',
					type: 'warning',
					click: () => {
						this.handleForbidden(null, 3)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					dataIndex: 'supplierId',
					title: '商家ID',
				},
				{
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '上传权限',
					customRender: (row) => {
						return row.status == 1 ? (
							<el-tag type="success">启用</el-tag>
						) : row.status == 2 ? (
							<el-tag type="danger">禁用</el-tag>
						) : (
							'-'
						)
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '240',
					actions: [
						{
							title: '禁用',
							auth: 'batchUpdateGoodsMaterialWhitelist',
							click: (row) => {
								this.handleForbidden(row, 1)
							},
							customRender: (action, row) => {
								action.hide =
									(row.status == 1 && !this.whitelistBatchDisable) ||
									(row.status != 1 && !this.whitelistBatchEnable)
								action.title = row.status == 1 ? '禁用' : '启用'
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
					this.init()
				},
			},
		}
	},

	created() {
		this.init(true)
	},

	methods: {
		// 搜索条件 true
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.searchData, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})
			return paramJson
		},
		// 获取列表
		async init(flag) {
			let paramJson = this.findSearchParams(flag)
			paramJson = JSON.parse(JSON.stringify(paramJson))
			paramJson.supplierIdList = paramJson.supplierIdList.replace(/\n/g, ',')
			paramJson.supplierIdList = paramJson.supplierIdList.replace(/\s*/g, '')
			paramJson.supplierNameList = paramJson.supplierNameList.replace(
				/\n/g,
				','
			)
			paramJson.supplierNameList = paramJson.supplierNameList.replace(
				/\s*/g,
				''
			)

			if (paramJson.supplierIdList && paramJson.supplierNameList) {
				this.$message.warning('商家id和商家名称不能同时查询')
				return
			}
			this.loading = true
			const {
				data: { resultData },
			} = await listGoodsMaterialWhite(paramJson)

			if (resultData.recordList.length > 0) {
				this.tableData = resultData.recordList
				this.page.count = resultData.totalCount
				this.loading = false
			} else {
				this.page.count = 0
				this.tableData = []
				this.loading = false
			}
		},
		// 多选
		selectionChange(row) {
			this.selectionData = row
		},
		// 禁用/启用
		async handleForbidden(row, v) {
			let paramJson = {}
			let status = ''
			if ((v == 1 && row.status == 1) || v == 3) {
				status = 2
			} else if ((v == 1 && row.status == 2) || v == 2) {
				status = 1
			}
			if (v == 2 || v == 3) {
				paramJson.list = this.selectionData.map((item) => ({
					supplierId: item.supplierId,
					supplierName: item.supplierName,
					status,
				}))
			} else {
				paramJson.list = [
					{
						supplierId: row.supplierId,
						supplierName: row.supplierName,
						status,
					},
				]
			}
			if (this.selectionData.length == 0 && (v == 2 || v == 3)) {
				return this.$message.warning('请勾选需要批量操作的商家')
			}
			let hint
			if (v == 2 || v == 3) {
				hint = `确认要批量${v == 2 ? '启用' : '禁用'}${
					this.selectionData.length
				}个商家吗？`
			} else {
				hint = `确认要${row.status == 1 ? '禁用' : '启用'}该商家吗？`
			}
			this.$confirm(hint, '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						let {
							data: { resultMsg },
						} = await batchUpdateGoodsMaterialWhitelist(paramJson)
						this.$message.success(resultMsg)
						this.init(true)
					}
				},
			})
		},
	},
}
</script>

<style>
.tracking-item {
	display: flex;
}
.tracking-item-div {
	width: 30%;
}
</style>

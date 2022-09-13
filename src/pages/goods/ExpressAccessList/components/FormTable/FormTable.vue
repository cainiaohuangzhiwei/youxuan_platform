<template>
	<div class="serviceProviderVipStatistics">
		<basicContainer v-loading="exportLoading">
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
			</yx-form>
			<yx-table
				:select="true"
				v-loading="loading"
				:columns="tableColumns102"
				:pagination="page102"
				:data="tableData102"
				:selectionChange="selectionChange"
			></yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { downloadFile } from '@/utils/helper/common'
import {
	expressAccessList,
	expressAccess,
	exportSupplier,
} from '@/api/yhtPlusCmsSupplierExpressTemplate'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	props: [],
	data() {
		return {
			selectedList: [],
			exportLoading: false,
			loading: false,
			formData101: {
				supplierName: '',
				supplierId: '',
				status: 0,
			},
			formCfg101: [
				{
					type: 'textarea',
					title: '商家名称',
					dataIndex: 'supplierName',
					placeholder: '请输入商家名称',
				},
				{
					type: 'textarea',
					title: '商家ID',
					dataIndex: 'supplierId',
					placeholder: '请输入商家ID',
				},
				{
					title: '启用状态',
					type: 'select',
					dataIndex: 'status',
					placeholder: '请选择启用状态',
					label: 'value',
					options: [
						{
							status: '',
							value: '全部',
						},
						{
							status: 1,
							value: '启用',
						},
						{
							status: 0,
							value: '禁用',
						},
					],
					change: () => {
						if (!this.loading) this.getData102(true)
					},
				},
			],
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					yapiId: '',
					token: '',
					dialogId: '',
					click: () => {
						if (!this.loading) this.getData102(true)
					},
					tableId: 102,
				},
				{
					title: '批量禁用',
					type: 'primary',
					auth: 'expressTempAccessEdit',
					click: () => {
						this.expressAccessMore(0)
					},
				},
				{
					title: '批量启用',
					type: 'primary',
					auth: 'expressTempAccessEdit',
					click: () => {
						this.expressAccessMore(1)
						// this.expressAccess(row.supplierId, 1, 'array')
					},
				},
				{
					title: '批量导出',
					type: 'primary',
					auth: 'expressTempAccessExport',
					click: () => {
						this.exportExcel()
					},
				},
			],
			tableData102: [],
			tableColumns102: [
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
					dataIndex: 'status',
					title: '启用状态',
					customRender: (row) => {
						return row.status == 0 ? '禁用' : '启用'
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '启用',
							auth: 'expressTempAccessEdit',
							popconfirm: true,
							popconfirmTitle: '确认删除此渠道号？',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								let status = row.status == 0 ? 1 : 0
								this.expressAccess(row.supplierId, status, 'single')
							},
							customRender: (action, row) => {
								action.title = row.status == 0 ? '启用' : '禁用'
								action.popconfirmTitle =
									row.status == 0 ? '确认启用？' : '确认禁用？'
								return action
							},
						},
					],
				},
			],
			page102: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData102()
				},
			},
		}
	},

	created() {
		this.getData102(true)
	},

	methods: {
		exportExcel: async function () {
			this.exportLoading = true
			let { data } = await exportSupplier({})
			this.exportLoading = false
			downloadFile(data, '运费模板白名单.xls')
		},
		// 批量处理参数
		handleNoParams(type) {
			const searchData = JSON.parse(JSON.stringify(this.formData101))
			searchData[type] = searchData[type].replace(/\n/g, ',')
			//把所有中文的逗号转为英文的
			searchData[type] = searchData[type].replace(/，/g, ',')
			searchData[type] = searchData[type].replace(/\s*/g, '') //商品货号
			const searchLength = searchData[type].match(/,|，/g)

			if (searchLength && searchLength.length > 100) {
				return this.$message.warning(
					`最多支持100个${type == 'supplyName' ? '商家名称' : '商家ID'}搜索`
				)
			}
			return searchData[type]
		},
		expressAccessMore(status) {
			if (!this.selectedList || this.selectedList.length == 0) {
				this.$message.error(
					`请勾选上需要${status == 0 ? '禁用' : '启用'}的商家！`
				)
				return
			}
			let isNext = true
			let supplierId = this.selectedList.map((item) => {
				if (item.status == status) {
					isNext = false
				}
				return item.supplierId
			})
			if (!isNext) {
				this.$message.error(
					`选中的商家中含有启用状态为“${status == 0 ? '禁用' : '启用'}”的商家！`
				)
				return
			}

			this.$confirm(`确认要批量启用${supplierId.length}个商家吗？`, '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						this.expressAccess(supplierId, status, 'array')
					}
				},
			})
		},
		selectionChange(list) {
			this.selectedList = list
		},
		async expressAccess(supplierId, status, type) {
			this.loading = true
			const {
				data: { resultCode },
			} = await expressAccess({
				supplierIdList: type == 'single' ? [supplierId] : supplierId,
				status: status,
			})
			if (resultCode != 0) {
				this.$message({
					type: 'error',
					message: '查询超时',
					duration: 3000,
				})
			}
			if (resultCode == 0) {
				this.$message.success('操作成功！')
				this.getData102()
			}
			this.loading = false
		},
		async getData102(flag) {
			if (this.formData101.supplierName && this.formData101.supplierId) {
				this.$message({
					type: 'error',
					message: '商家ID和商家名称只输入一种查询方式',
					duration: 3000,
				})
				return
			}
			let paramJson = this.findSearchParams102(flag)
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await expressAccessList(paramJson)
			if (resultCode != 0) {
				this.$message({
					type: 'error',
					message: '查询超时',
					duration: 3000,
				})
			}
			if (resultData.datalist) {
				this.tableData102 = resultData.datalist
				this.page102.count = resultData.count
			}
			this.loading = false
		},
		findSearchParams102(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			this.formData101.supplierName = this.handleNoParams('supplierName')
			this.formData101.supplierId = this.handleNoParams('supplierId')
			const paramJson = Object.assign(this.formData101, {
				length: this.page102.length,
				startIndex: (this.page102.currentPage - 1) * this.page102.length,
			})
			return paramJson
		},
	},
}
</script>

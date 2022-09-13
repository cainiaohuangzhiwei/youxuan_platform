<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			></yx-form>
			<el-row v-loading="loading">
				<yx-table
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
					class="goodsTagTable"
				></yx-table>
			</el-row>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { downloadFile } from '@/utils/helper/common'

import {
	goodsPageList,
	removeGoodsFromGoodsTag,
	exportGoodsFromGoodsTag,
} from '@/api/yhtPlusWebGoods'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			buriedRow: {},
			buriedDialog: false,
			actionType: 'create',
			stateMap: ['启用', '禁用'],
			loading: false,
			formInline: {
				supplierName: '',
				goodsNumber: '',
			},
			formCfg: [
				{
					title: '商家名称:',
					dataIndex: 'supplierName',
					placeholder: '请输入内容',
				},
				{
					title: '货号:',
					dataIndex: 'goodsNumber',
					placeholder: '请输入内容',
				},
			],
			formAction: [
				{
					title: '重置',
					// auth: 'bindDepartmentId',
					click: () => {
						this.reset()
					},
				},
				{
					title: '搜索',
					type: 'primary',
					// auth: 'bindDepartmentId',
					click: () => {
						this.page.currentPage = 1
						this.getData()
					},
				},
				{
					title: '导出',
					type: 'primary',
					// auth: 'bindDepartmentId',
					click: () => {
						this.exportGoods()
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'supplierAccountNumberId',
					title: '商家ID',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'string',
					dataIndex: 'goodsNumber',
					title: '货号',
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '清除',
							// auth: '',
							popconfirm: true,
							popconfirmTitle: '是否清除该商品',
							confirm: (row) => {
								this.removeGoods(row)
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
					this.getData()
				},
			},
		}
	},

	created() {
		this.getData()
	},
	methods: {
		getParams() {
			const { supplierName = '', goodsNumber = '' } = this.formInline
			const data = {
				pageNum: this.page.currentPage,
				pageSize: this.page.length,
				goodsTagId: this.$route.params.goodsTagId,
			}
			if (supplierName) {
				data.supplierName = supplierName
			}
			if (goodsNumber) {
				data.goodsNumber = goodsNumber
			}
			return data
		},
		async getData() {
			this.loading = true
			const res = await goodsPageList(this.getParams()).finally(() => {
				this.loading = false
			})
			if (res && res.data && res.data.resultCode === 0) {
				const { resultData, total } = res.data || {}
				this.tableData = resultData || []
				if (this.page.currentPage === 1) {
					this.page.count = total || 0
				}
			}
		},
		//移除
		async removeGoods(row) {
			this.loading = true
			const {
				data: { resultCode },
			} = await removeGoodsFromGoodsTag({
				goodsTagRelationId: row.goodsTagRelationId,
			})
			this.loading = false
			if (resultCode == 0) {
				this.$message({
					message: `移除成功!`,
					type: 'success',
				})
				this.getData()
			}
		},
		// 导出商品
		async exportGoods() {
			let paramJson = Object.assign({}, this.formInline)
			this.$confirm('确定导出？', '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						paramJson.goodsTagId = this.$route.params.goodsTagId
						let { data } = await exportGoodsFromGoodsTag(paramJson)
						downloadFile(data, '商品列表.xlsx')
					}
				},
			})
		},
		reset() {
			this.formInline = this.$options.data().formInline
			this.page.currentPage = 1
			this.$nextTick(() => {
				this.getData()
			})
		},
	},
}
</script>

<style lang="scss" scope></style>

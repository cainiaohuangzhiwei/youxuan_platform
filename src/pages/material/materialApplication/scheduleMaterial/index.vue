<template>
	<div class="xcxMaterialList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData"
				:items="formCfg"
				:formAction="formAction"
			>
			</yx-form>
			<yx-table
				v-loading="loading"
				:columns="tableColumn"
				:pagination="tablePage"
				:data="tableData"
			>
			</yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { goodsGroupMaterialPage } from '@/api/newMaterial'
import moment from 'moment'
export default {
	name: 'scheduleMaterial',
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	props: [],
	data() {
		return {
			formData: {
				keyword: '',
				saleTime: [],
			},
			formCfg: [
				{
					type: 'input',
					// title: '优惠券名称',
					dataIndex: 'keyword',
					placeholder: '档期名称进行搜索',
					enter: () => {
						if (!this.loading) this.getData102(true)
					},
				},
				{
					type: 'time',
					placeholder: ['开始时间', '结束时间'],
					dataIndex: 'saleTime',
					timeAttributes: {
						type: 'datetimerange',
					},
				},
			],
			formAction: [
				{
					title: '查询',
					type: 'primary',
					auth: 'goodsGroupMaterialPage',
					click: () => {
						if (!this.loading) this._goodsGroupMaterialPage(true)
					},
				},
			],
			tableData: [{ id: 123123 }],
			tableColumn: [
				{
					type: 'string',
					dataIndex: 'goodsGroupName',
					title: '档期名称',
				},
				{
					type: 'string',
					title: '售卖时间',
					dataIndex: 'saleStartTime',
					customRender: (row) => {
						return row.saleStartTime && row.saleEndTime
							? moment(row.saleStartTime).format('YYYY-MM-DD HH:mm:ss') +
									'-' +
									moment(row.saleEndTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'haveMaterialGoodsCount',
					title: '档期内有素材商品数',
				},
				{
					type: 'string',
					dataIndex: 'materialCount',
					title: '档期商品素材总数',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					actions: [
						{
							title: '商品列表',
							auth: 'goodsGroupMaterialPageGoods',
							click: (row) => {
								this.$store.dispatch('leadin/setMaterId', row)
								this.$router.push({
									name: 'commodity',
									// params: { id: row.id },
								})
							},
						},
					],
				},
			],
			tablePage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._goodsGroupMaterialPage()
				},
			},
			showLoading: false,
		}
	},
	computed: {},

	created() {
		this._goodsGroupMaterialPage()
	},

	methods: {
		// 搜索条件
		findSearchParams(flag) {
			let paramJson = Object.assign({
				pageSize: 10,
				pageNum: 1,
			})
			if (this.formData.keyword) {
				paramJson.keyword = this.formData.keyword
			}
			if (this.formData.saleTime?.[0]) {
				paramJson.saleStartTime = new Date(
					this.formData.saleTime?.[0]
				).getTime()
			}
			if (this.formData.saleTime?.[1]) {
				paramJson.saleEndTime = new Date(this.formData.saleTime?.[1]).getTime()
			}
			paramJson.pageSize = this.tablePage.length
			// 当前页的条数开始
			if (flag) {
				this.tablePage.currentPage = 1
			}
			paramJson.pageNum = this.tablePage.currentPage
			return paramJson
		},
		async _goodsGroupMaterialPage(flag) {
			this.loading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await goodsGroupMaterialPage(paramJson)
			this.loading = false
			if (resultCode == 0) {
				this.tableData = resultData.records || {}
				this.tablePage.count = resultData.total || 0
			} else {
				this.tableData = []
				this.tablePage.count = 0
			}
		},
		// findSearchParams(flag) {
		// 	// 当前页的条数开始
		// 	if (flag) {
		// 		this.tablePage.currentPage = 1
		// 	}
		// 	const paramJson = Object.assign(this.formData, {
		// 		length: this.tablePage.length,
		// 		startIndex: (this.tablePage.currentPage - 1) * this.tablePage.length,
		// 	})
		// 	return paramJson
		// },
	},
}
</script>
<style scoped>
.c_image {
	width: 100px;
}
.input-with-select {
	width: 100%;
}
</style>

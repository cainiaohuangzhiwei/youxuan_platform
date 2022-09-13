<template>
	<div class="brandEvaluteDetails">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData109"
				:items="formCfg109"
				:formAction="formAction109"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns110"
				:pagination="page110"
				:data="tableData110"
			></yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getBrandEvaluateList } from '@/api/yhtPlusCmsActivity'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	props: [],
	data() {
		return {
			loading: false,
			formData109: {
				keyword: '',
			},
			formCfg109: [
				{
					type: 'input',
					title: '关键词',
					dataIndex: 'keyword',
					placeholder: '用户名称/订单号/下单店铺',
					enter: () => {
						if (!this.loading) this.getData110(true)
					},
				},
			],
			formAction109: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData110(true)
					},
					tableId: 110,
				},
			],
			tableData110: [],
			tableColumns110: [
				{
					type: 'string',
					dataIndex: 'nickName',
					title: '用户名称',
				},
				{
					type: 'action',
					dataIndex: 'orderSn',
					title: '订单号',
					actions: [
						{
							title: '订单号',
							click: (row) => {
								this.$router.push({
									path: `/business/orderDetails/${row.orderId}`,
								})
							},
							customRender: (action, row) => {
								action.title = row.orderSn
								return action
							},
						},
					],
				},
				{
					type: 'action',
					dataIndex: 'orderSn',
					title: '下单店铺',
					actions: [
						{
							title: '下单店铺',
							click: (row) => {
								this.$router.push({
									path: `/shop/shop/shopDetail/${row.organizationId}`,
								})
							},
							customRender: (action, row) => {
								action.title = row.organizationName
								return action
							},
						},
					],
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '评价时间',
				},
				{
					type: 'string',
					dataIndex: 'content',
					title: '评价',
				},
			],
			page110: {
				count: 1,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData110()
				},
			},
		}
	},

	created() {
		this.getData110(true)
	},

	methods: {
		async getData110(flag) {
			this.loading = true
			let paramJson = this.findSearchParams110(flag)
			const {
				data: { resultCode, resultData },
			} = await getBrandEvaluateList(paramJson)
			if (resultCode != 0) {
				this.$message({
					type: 'error',
					message: '查询超时',
					duration: 3000,
				})
			}
			if (resultData.orderEvaluateList) {
				this.tableData110 = resultData.orderEvaluateList
				this.page110.count = resultData.count
			}
			this.loading = false
		},
		findSearchParams110(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page110.currentPage = 1
			}
			this.formData109.goodsGroupId = this.$route.params.id
			const paramJson = Object.assign(this.formData109, {
				length: this.page110.length,
				startIndex: (this.page110.currentPage - 1) * this.page110.length,
			})
			return paramJson
		},
	},
}
</script>

<template>
	<div class="goodsStockList">
		<basicContainer>
			<div style="margin-bottom: 20px">
				<span>会场名称：{{ brandDetail.brandName }}</span>
				<span style="margin-left: 80px"
					>一口价活动时间：{{
						moment(brandDetail.startTime).format('YYYY-MM-DD HH:mm:ss')
					}}-
					{{ moment(brandDetail.endTime).format('YYYY-MM-DD HH:mm:ss') }}</span
				>
			</div>
			<div style="margin-bottom: 20px">
				<span>商品货号：</span>
				<el-input
					placeholder="请输入商品货号"
					v-model="styleNo"
					class="input-with-select"
				>
					<el-button
						slot="append"
						icon="el-icon-search"
						@click="getSearchBrandRecord"
					></el-button>
				</el-input>
				<el-button
					style="margin-left: 80px"
					type="primary"
					v-auth="'exportAkcBrandFixedPriceGoodsList'"
					@click="exportAkcBrandFixedPriceGoodsList"
					>导出</el-button
				>
			</div>
			<yx-table
				v-loading="loading"
				:columns="tableColumns106"
				:pagination="page106"
				:data="tableDataBrand"
			>
			</yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import { downloadFile } from '@/utils/helper/common'
import {
	queryAkcBrandFixedPriceGoodsList,
	exportAkcBrandFixedPriceGoodsList,
	getAkcBrandDetail,
} from '@/api/brandRecord'
export default {
	components: {
		BasicContainer,
		YxTable,
	},
	props: [],
	data() {
		return {
			moment: moment,
			styleNo: '',
			loading: false,
			tableDataBrand: [],
			formData105: {},
			tableColumns106: [
				{
					width: 80,
					type: 'string',
					dataIndex: 'styleNo',
					title: '商品货号',
				},
				{
					type: 'string',
					dataIndex: 'marketId',
					title: '上游营销活动ID',
				},
				// {
				// 	type: 'amount',
				// 	dataIndex: 'settlePrice',
				// 	title: '结算价',
				// },
				// {
				// 	type: 'amount',
				// 	dataIndex: 'commission',
				// 	title: '佣金',
				// },
				{
					type: 'amount',
					dataIndex: 'price',
					title: '零售价',
				},
				{
					type: 'amount',
					dataIndex: 'fixedSettlePrice',
					title: '一口价结算价',
				},
				{
					type: 'amount',
					dataIndex: 'fixedCommission',
					title: '一口价佣金',
				},
				{
					type: 'amount',
					dataIndex: 'fixedPrice',
					title: '零售价（一口价活动期间）',
				},
			],
			page106: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getSearchBrandRecord()
				},
			},
			brandDetail: {},
		}
	},

	created() {
		this.getSearchBrandRecord(true)
	},

	methods: {
		async exportAkcBrandFixedPriceGoodsList() {
			let paramJson = this.findSearchParams106()
			paramJson.activityId = this.$route.params.actId
			paramJson.brandId = this.$route.params.refBrandId
			paramJson.marketId = this.$route.params.marketId
			let { data } = await exportAkcBrandFixedPriceGoodsList(paramJson)
			downloadFile(data, '一口价商品列表.xls')
		},
		findSearchParams106(flag) {
			let paramJson = {
				pageSize: 10,
				pageNum: 1,
			}
			paramJson.pageSize = this.page106.length
			// 当前页的条数开始
			if (flag) {
				this.page106.currentPage = 1
			}
			paramJson.pageNum = this.page106.currentPage
			return paramJson
		},
		getAkcBrandDetail: async function () {
			let paramJson = {}
			paramJson.activityId = this.$route.params.actId
			paramJson.brandId = this.$route.params.refBrandId
			paramJson.marketId = this.$route.params.marketId
			let {
				data: { resultData, resultCode },
			} = await getAkcBrandDetail(paramJson)
			if (resultCode == 0) {
				this.brandDetail = resultData
			}
		},

		getSearchBrandRecord: async function (flag) {
			let paramJson = this.findSearchParams106(flag)
			paramJson.styleNo = this.styleNo
			paramJson.activityId = this.$route.params.actId
			paramJson.brandId = this.$route.params.refBrandId
			paramJson.marketId = this.$route.params.marketId
			this.loading = true
			let {
				data: { resultData, total, resultCode },
			} = await queryAkcBrandFixedPriceGoodsList(paramJson)
			if (resultCode == 0) {
				this.tableDataBrand = resultData
				this.page106.count = total
				this.loading = false
			} else {
				this.page106.count = 0
				this.tableDataBrand = []
				this.loading = false
			}
			this.getAkcBrandDetail()
		},
	},
}
</script>
<style>
.input-with-select {
	width: 300px;
}
.input-with-select .el-input-group__prepend {
	background-color: #fff;
}
</style>

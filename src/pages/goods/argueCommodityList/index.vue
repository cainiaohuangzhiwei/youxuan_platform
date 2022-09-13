<template>
	<div class="goodsStockList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData105"
				:items="formCfg105"
				:formAction="formAction105"
			>
			</yx-form>
			<yx-table
				:select="true"
				v-loading="loading"
				:columns="tableColumns106"
				:pagination="page106"
				:data="tableData106"
			>
				<template slot="goodsInventory" slot-scope="scope">
					<div class="slot active">
						<div>
							<img
								class="goods_img"
								:src="getSmallImg(scope.row.goodsDefaultImage)"
								alt=""
							/>
						</div>
						<div>
							<p>
								<span class="number">货号：{{ scope.row.goodsNumber }}</span>
							</p>
							<p class="goods_name">{{ scope.row.goodsName }}</p>
						</div>
					</div>
				</template>
			</yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import { getSmallImg } from '@/utils/imageTool'
import { isNull } from '@/utils/helper/common'
import { getRejectGoodsList } from '@/api/yhtPlusWebGoods'

export default {
	name: 'ArgueCommodityList',
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	props: [],
	data() {
		return {
			getSmallImg: getSmallImg,
			loading: false,
			formData105: {
				brandName: '',
				goodsName: '',
				supplierName: '',
				goodsNumber: '',
				startTime: '',
				endTime: '',
			},
			formCfg105: [
				{
					type: 'input',
					title: '会场名称',
					dataIndex: 'brandName',
					placeholder: '请输入会场名称',
				},
				{
					type: 'input',
					title: '商品名称',
					dataIndex: 'goodsName',
					placeholder: '请输入商品名称',
				},
				{
					type: 'input',
					title: '商品货号',
					dataIndex: 'goodsNumber',
					placeholder: '商品货号',
				},
				{
					type: 'input',
					title: '商家名称',
					dataIndex: 'supplierName',
					placeholder: '商家名称',
				},
				{
					title: '操作时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
				},
			],
			formAction105: [
				{
					title: '重置',
					auth: '',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: (e) => {
						this.queryGetRejectGoodsList(true, e)
					},
				},
			],
			tableData106: [],
			tableColumns106: [
				{
					type: 'custom',
					dataIndex: 'goodsInventory',
					title: '商品',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场名称',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
				},
				{
					type: 'string',
					dataIndex: 'clerkName',
					title: '操作人名称',
				},
				{
					type: 'string',
					dataIndex: 'checkReason',
					title: '驳回原因',
				},
				{
					type: 'data',
					dataIndex: 'checkTime',
					title: '操作时间',
				},
			],
			page106: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.queryGetRejectGoodsList()
				},
			},
		}
	},

	methods: {
		findSearchParams106(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page106.currentPage = 1
			}
			const paramJson = Object.assign(this.formData105, {
				length: this.page106.length,
				startIndex: (this.page106.currentPage - 1) * this.page106.length,
			})
			paramJson.startTime = moment(paramJson.startTime).valueOf() || ''
			paramJson.endTime = moment(paramJson.endTime).valueOf() || ''
			return paramJson
		},
		queryGetRejectGoodsList: async function (flag) {
			let paramJson = this.findSearchParams106(flag)
			if (isNull(paramJson.brandName)) {
				this.$message.warning({ message: '请填写会场名称' })
				return
			}
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await getRejectGoodsList(paramJson)
			this.showLoading = false
			if (resultCode === 0) {
				this.tableData106 = resultData.rejectGoodsList
				this.page106.count = resultData.count
			} else {
				this.page106.count = 0
				this.tableData106 = []
			}
		},
	},
}
</script>
<style>
.goods_img {
	width: 60px;
	height: 60px;
	margin-right: 10px;
	line-height: 155px;
}
.number {
	margin-right: 10px;
}
.goods_name {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-box-orient: vertical;
}
</style>

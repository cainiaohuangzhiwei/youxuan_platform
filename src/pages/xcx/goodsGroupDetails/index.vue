<template>
	<div class="goodsGroupDetails">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData181"
				:items="formCfg181"
				:formAction="formAction181"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns101"
				:pagination="page101"
				:data="tableData101"
			>
				<template slot="goodsInfo" slot-scope="scope">
					<div v-if="getGoodsDetailByOrganizationSpecId">
						<router-link
							class="goods-info-right"
							:to="`/goods/GoodsDetail/${scope.row.goodsId}/${scope.row.goodsSpecId}`"
						>
							<el-button type="text"
								>货号：{{ scope.row.goodsNumber }}</el-button
							>
							<p style="color: #1890ff; cursor: pointer">
								{{ scope.row.goodsName }}
							</p>
						</router-link>
					</div>
					<div class="goods-info-right" v-else>
						<p>货号：{{ scope.row.goodsNumber }}</p>
						<p>{{ scope.row.goodsName }}</p>
					</div>
				</template>
				<template slot="copyLink" slot-scope="scope">
					<el-link
						type="primary"
						v-clipboard:copy="scope.row.copyLink"
						v-clipboard:success="onCopy"
						v-clipboard:error="onError"
						>{{ scope.row.copyLink }}</el-link
					>
				</template>
			</yx-table>
		</basicContainer>
		<material-pt-dialog
			:visible.sync="materialPtDialog"
			:materialPtRow="materialPtRow"
			@Refresh="Refresh"
		></material-pt-dialog>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import YxForm from '@wg-vue-materials/yx-form'
import { setViewTitle, numberFormat } from '@/utils/helper/common'
import { yxGoodsList } from '@/api/goodsList'
import { getBigImg } from '@/utils/imageTool'
import { checkFunctionCode } from '@/utils/auth'
import MaterialPtDialog from './MaterialPtDialog'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		MaterialPtDialog,
	},
	props: [],
	data() {
		return {
			formData181: {
				goodsNumber: '',
			},
			formCfg181: [
				{
					type: 'input',
					title: '商品货号',
					dataIndex: 'goodsNumber',
				},
			],
			formAction181: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._yxGoodsList(true)
					},
				},
			],
			pictureTextDialog: false,
			pictureTextRow: {},
			materialPtDialog: false,
			materialPtRow: {},
			getGoodsDetailByOrganizationSpecId: checkFunctionCode(
				'getGoodsDetailByOrganizationSpecId'
			),
			params: this.$route.params,
			loading: false,
			tableData101: [],
			tableColumns101: [
				{
					type: 'image',
					dataIndex: 'imageUrl',
					title: '商品图',
				},
				{
					type: 'custom',
					dataIndex: 'goodsInfo',
					title: '商品名称',
					width: '300px',
				},
				{
					type: 'custom',
					dataIndex: 'copyLink',
					title: '复制链接',
					width: '150px',
				},
				{
					type: 'string',
					dataIndex: 'goodsAllCategoryName',
					title: '商品分类',
					customRender: (row) => {
						return row.goodsAllCategoryName ? row.goodsAllCategoryName : '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '品牌',
				},
				{
					type: 'amount',
					dataIndex: 'supplyPrice',
					title: '供货价',
				},
				{
					type: 'string',
					dataIndex: 'lowestPrice',
					title: '建议零售价',
					customRender: (row) => {
						return (
							'￥' +
							numberFormat(row.lowestPrice, 2) +
							'~' +
							numberFormat(row.highestPrice, 2)
						)
					},
				},
				{
					type: 'amount',
					dataIndex: 'marketPrice',
					title: '市场价',
				},
			],
			page101: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._yxGoodsList()
				},
			},
		}
	},

	created() {
		let { groupName = '' } = this.$route.params
		if (groupName) {
			setViewTitle(this.$store, this.$route, `${groupName}`)
		}
		this._yxGoodsList(true)
	},

	methods: {
		Refresh() {
			this._yxGoodsList(true)
		},
		handleEdit(row) {
			this.materialPtDialog = true
			this.materialPtRow = row
		},
		_yxGoodsList: async function (flag) {
			this.loading = true
			let paramJson = this.findSearchParams101(flag)
			const {
				data: { resultCode, resultData },
			} = await yxGoodsList(paramJson)
			if (resultCode == 0) {
				resultData.resultData.forEach((item) => {
					if (item.imageUrl) {
						item.imageUrl = getBigImg(item.imageUrl)
					}
					item.copyLink = ''
					if (item.goodsGroupId) {
						item.copyLink =
							'pages/InPurchasing/goodsDetail?goodsGroupId=' +
							item.goodsGroupId +
							'&goodsId=' +
							item.goodsId
					}
				})

				this.tableData101 = resultData.resultData || []
				this.page101.count = resultData.total
				// this.currentTime = resultData.currentTime
			} else {
				this.page101.count = 0
				this.tableData101 = []
			}
			this.loading = false
		},
		findSearchParams101(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page101.currentPage = 1
			}
			const paramJson = {
				goodsGroupIdList: this.params.goodsGroupId.split(','),
				brandIdList: this.params.brandId ? [this.params.brandId] : [],
				viewType: 3,
				shelfState: 2,
				goodsNumber: this.formData181.goodsNumber,
				length: this.page101.length,
				startIndex: (this.page101.currentPage - 1) * this.page101.length,
				pageNum: this.page101.currentPage,
				pageSize: this.page101.length,
			}
			return paramJson
		},
		onCopy: function () {
			this.$message.success('复制成功')
		},
		onError: function () {
			this.$message.error('复制失败')
		},
	},
}
</script>
<style lang="scss" scoped>
.goods-info-right {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;
	button {
		margin-left: 0;
	}
}
</style>

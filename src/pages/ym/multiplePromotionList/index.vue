<template>
	<div class="multiplePromotionList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData102"
				:items="formCfg102"
				:formAction="formAction102"
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
					<div
						v-if="getGoodsDetailByOrganizationSpecId"
						class="goods-info-right"
						@click="toDetails(scope.row)"
					>
						<el-image
							class="c_image"
							fit="cover"
							:src="getBigImg(scope.row.goodsDefaultImage)"
							:preview-src-list="[getBigImg(scope.row.goodsDefaultImage)]"
						>
							<div slot="error" class="image-slot">
								<i class="el-icon-picture-outline"></i>
							</div>
						</el-image>
						<el-button class="goodsName" type="text">{{
							scope.row.goodsName
						}}</el-button>
					</div>
					<div class="goods-info-right" v-else>
						<el-image
							class="c_image"
							fit="cover"
							:src="getBigImg(scope.row.goodsDefaultImage)"
							:preview-src-list="[getBigImg(scope.row.goodsDefaultImage)]"
						>
							<div slot="error" class="image-slot">
								<i class="el-icon-picture-outline"></i>
							</div>
						</el-image>
						<p class="goodsName">{{ scope.row.goodsName }}</p>
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
import { getYouxuanGoodsList } from '@/api/goodsList'
import { numberFormat, setViewTitle } from '@/utils/helper/common'
import { getBigImg } from '@/utils/imageTool'
import { checkFunctionCode } from '@/utils/auth'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	props: [],
	data() {
		return {
			getBigImg,
			loading: false,
			getGoodsDetailByOrganizationSpecId: checkFunctionCode(
				'getGoodsDetailByOrganizationSpecId'
			),
			params: this.$route.params,
			formData102: {
				goodskeyword: '',
				goodsGroupIdList: this.$route.params.goodsGroupIds.split(','),
				viewType: 3, //1??????????????????2???????????????(?????????)???3???????????????(????????????)
				shelfState: 2, // ??????????????????
				sortField: 1,
			},
			formCfg102: [
				{
					type: 'input',
					title: '????????????/??????',
					dataIndex: 'goodskeyword',
					placeholder: '?????????????????????/??????',
				},
			],
			formAction102: [
				{
					title: '??????',
					type: 'primary',
					auth: '',
					yapiId: '',
					token: '',
					dialogId: '',
					click: () => {
						if (!this.loading) this.getData101(true)
					},
					tableId: 101,
				},
			],
			tableData101: [],
			tableColumns101: [
				{
					type: 'custom',
					dataIndex: 'goodsInfo',
					title: '??????',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '????????????',
				},
				{
					type: 'amount',
					dataIndex: 'costPrice',
					title: '?????????',
				},
				{
					type: 'amount',
					dataIndex: 'supplyPrice',
					title: '?????????',
				},
				{
					type: 'string',
					dataIndex: 'lowestPrice',
					title: '???????????????',
					customRender: (row) => {
						return (
							'???' +
							numberFormat(row.lowestPrice, 2) +
							'~' +
							numberFormat(row.highestPrice, 2)
						)
					},
				},
				{
					type: 'amount',
					dataIndex: 'marketPrice',
					title: '?????????',
				},
			],
			page101: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData101()
				},
			},
		}
	},

	created() {
		let goodsGroupIds = this.$route.params.goodsGroupIds.split(',')
		if (goodsGroupIds) {
			setViewTitle(this.$store, this.$route, `${goodsGroupIds}`)
		}
		this.getData101(true)
	},

	methods: {
		toDetails(row) {
			this.$router.push({
				path: `/goods/GoodsDetail/${row.goodsId}/${row.goodsSpecId}`,
			})
		},
		async getData101(flag) {
			this.loading = true
			let paramJson = this.findSearchParams101(flag)
			const {
				data: { resultCode, resultData },
			} = await getYouxuanGoodsList(paramJson)
			if (resultCode == 0) {
				this.tableData101 = resultData.goodsList
				this.page101.count = resultData.goodsCount
			} else {
				this.tableData101 = []
				this.page101.count = 0
			}
			this.loading = false
		},
		findSearchParams101(flag) {
			// ????????????????????????
			if (flag) {
				this.page101.currentPage = 1
			}
			const paramJson = Object.assign(this.formData102, {
				length: this.page101.length,
				startIndex: (this.page101.currentPage - 1) * this.page101.length,
			})
			return paramJson
		},
	},
}
</script>
<style scoped>
.c_image {
	width: 60px;
	height: 60px;
}
.goods-info-right {
	margin-left: 10px;
	display: flex;
	/* justify-content: space-between; */
	align-items: flex-start;
}
.goodsName {
	text-align: left;
	flex: 1;
	padding-left: 10px;
}
</style>

<template>
	<div class="goods-price-details">
		<h1>{{ goodsSimple.goodsName }}</h1>
		<div class="slice">
			<span>商品类目：{{ goodsSimple.goodsCategoryName }}</span>
			<span>商家：{{ goodsSimple.supplierName }}</span>
			<span>货号：{{ goodsSimple.goodsNumber }}</span>
		</div>
		<div class="slice message">
			商品标志：<span v-for="(e, i) in goodsMarkList" :key="i">{{
				e.markName
			}}</span>
		</div>

		<div class="slice message">
			<span>计量单位：{{ goodsSimple.unit || '无' }}</span>
			<span>订单限购数： {{ goodsSimple.is_self_purchase || '无' }}</span>
			<span>上架状态： {{ goodsSimple.shelfState | shelfState }}</span>
		</div>
		<div class="slice message">
			标签：<span v-for="(e, i) in groupTagList" :key="i">{{ e.tagName }}</span>
		</div>

		<div class="slice message">商品卖点：{{ goodsSimple.mark || '无' }}</div>
		<div class="slice message">
			限制加价：{{ goodsSimple.isLimitMarkup == 0 ? '否' : '是' }}
		</div>
		<div class="imageDiv">
			<el-image
				:preview-src-list="imageList"
				class="image"
				v-for="(v, k) in imageList"
				:key="k"
				:src="v"
			/>
		</div>

		<h1>各规格商品价格走势</h1>
		<div class="card-contanier">
			<div class="btn-group">
				<el-radio-group v-model="checked" @change="changeDate" size="mini">
					<el-radio-button label="2">365天</el-radio-button>
					<el-radio-button label="0">180天</el-radio-button>
					<el-radio-button label="1">30天</el-radio-button>
				</el-radio-group>
			</div>
		</div>

		<div v-loading="kLoading">
			<el-card
				v-for="(item, index) in goodsSpecList"
				:key="index"
				class="box-card"
			>
				<echarts-list :options="item"></echarts-list>
			</el-card>
		</div>
	</div>
</template>

<script>
import EchartsList from '../EchartsList'
import {
	queryGoodsPriceComparisonDetail,
	queryGoodsPriceComparisonMoreSpec,
} from '@/api/supplierPrice'

import { getBigImg } from '@/utils/imageTool'
export default {
	data() {
		return {
			checked: 0,
			goodsSpecList: [],
			goodsSimple: {},
			imageList: [],
			kLoading: false,
		}
	},
	components: {
		EchartsList,
	},
	created() {
		this.init()
		this.queryGoodsPriceComparisonMoreSpec()
	},
	methods: {
		changeDate(e) {
			this.checked = e
			this.queryGoodsPriceComparisonMoreSpec()
		},
		async init() {
			let params = {
				goodsNumber: decodeURIComponent(this.$route.params.goodsNumber),
				//	supplierId: this.$route.params.supplierId,
				day: this.checked,
			}
			if (this.$route.query.supplierId) {
				params.supplierId = this.$route.query.supplierId
			} else if (this.$route.query.supplierAccountNumberId) {
				params.supplierAccountNumberId = this.$route.query.supplierAccountNumberId
			}

			const paramJson = Object.assign(params, {
				startIndex: 1,
				length: 10,
			})

			let {
				data: {
					resultCode,
					resultData: { goodsSimple = {}, imageList = [] },
				},
			} = await queryGoodsPriceComparisonDetail(paramJson)

			if (resultCode == 0) {
				this.goodsSimple = goodsSimple
				if (imageList && imageList.length > 0) {
					this.imageList = imageList.map((v) => {
						return getBigImg(v.imageUrl)
					})
				}
			} else {
				this.page.count = 0
				this.imageList = []
				this.goodsSimple = {}

				this.loading = false
			}
		},
		async queryGoodsPriceComparisonMoreSpec() {
			this.kLoading = true
			let params = {
				goodsNumber: decodeURIComponent(this.$route.params.goodsNumber),
				specStatus: 1, //0 获取当前最新规格,1 获取全部规格
				priceTimeStatus: this.checked,
			}
			if (this.$route.query.supplierId) {
				params.supplierId = this.$route.query.supplierId
			} else if (this.$route.query.supplierAccountNumberId) {
				params.supplierAccountNumberId = this.$route.query.supplierAccountNumberId
			}
			const paramJson = Object.assign(params, {})

			let {
				data: {
					resultCode,
					resultData: { goodsPriceComparisonSpecVO = [] },
				},
			} = await queryGoodsPriceComparisonMoreSpec(paramJson)
			this.kLoading = false
			if (resultCode == 0) {
				goodsPriceComparisonSpecVO.forEach((item) => {
					item.chartData = this.setOptions(item.showDataPrice)
				})
				this.goodsSpecList = goodsPriceComparisonSpecVO
			} else {
				this.page.count = 0
				this.tableData = []
				this.loading = false
			}
		},
		setOptions(val) {
			let newArr = {
				dateTime: [],
				costPrice: [],
				supplyPrice: [],
				lowestPrice: [],
			}
			val.forEach((item) => {
				newArr.dateTime.push(item.dateTime)
				newArr.costPrice.push(item.costPrice)
				newArr.supplyPrice.push(item.supplyPrice)
				newArr.lowestPrice.push(item.lowestPrice)
			})
			return newArr
		},
	},
	filters: {
		shelfState(key) {
			let name
			switch (key) {
				case 1:
					name = '下架'
					break
				case 2:
					name = '上架'
					break
				default:
					name = '---'

					break
			}
			return name
		},
	},
}
</script>

<style lang="scss" scoped>
.goods-price-details {
	h1 {
		font-size: 22px;
		color: #333;
	}
	.slice {
		line-height: 26px;
		font-size: 14px;
		color: #999;
		span {
			margin-right: 20px;
		}
		&.message {
			color: #666;
		}
	}
	.imageDiv {
		margin: 10px 0;
		.image {
			max-width: 240px;
		}
	}
	.box-card {
		width: 100%;
		margin-bottom: 24px;
	}
	.btn-group {
		float: right;
		margin-bottom: 12px;
	}
}
</style>

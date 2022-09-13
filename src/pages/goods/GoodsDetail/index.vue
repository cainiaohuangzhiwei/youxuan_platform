<!-- 商品详情 -->
<template>
	<el-main class="wg_main mb50" id="goodsDetail">
		<el-container class="bg_white">
			<el-header height="auto" class="mt20 wg_form_box">
				<!-- <el-button
					style="display: none"
					type="primary"
					class="el-icon-right"
					@click="oldSystem"
					>老系统</el-button
				> -->
				<!-- <el-button
					@click="copyGoodsInfo"
					type="primary"
					style="margin-left: 20px"
					>复制抖店信息</el-button
				> -->
				<div class="con_flex mb20">
					<div class="goods_message">
						<h2 class="mt20 mb10 fs18">
							{{ checkData(goodsSimple.goodsName) }}
						</h2>
						<el-row>
							<el-col :span="24"
								><div class="grid-content bg-purple-dark">
									<div style="line-height: 60px">
										<span class="typeface">供货价：</span>
										<span class="typeface" style="color: red">{{
											goodsSimple.supplyPrice
										}}</span>
										<span class="typeface ml80">市场价:</span>
										<span class="typeface" style="color: red">{{
											goodsSimple.marketPrice
										}}</span>
									</div>
								</div></el-col
							>
						</el-row>
						<div class="mb20">
							<span>商品类目：</span
							><span class="mr20">{{
								checkData(goodsSimple.goodsCategoryName)
							}}</span>
						</div>
						<div class="mb20">
							<span>商品货号：</span
							><span class="mr20">{{
								checkData(goodsSimple.goodsNumber)
							}}</span>
						</div>
						<div class="mb20">
							<span>会场名称：</span
							><span class="mr20">{{ checkData(goodsSimple.brandName) }}</span>
						</div>
						<div class="mb20">
							<span>计量单位：</span
							><span class="mr20">{{ checkData(goodsSimple.unit) }}</span>
						</div>
						<div class="mb20">
							<span>订单限购数</span
							><span class="mr20">{{ checkData(goodsSimple.riseBatch) }}</span>
						</div>
						<div class="mb20">
							<span>上架状态</span
							><span class="mr20">{{
								checkData(goodsSimple.shelfState == 1 ? '下架' : '上架')
							}}</span>
						</div>
						<div class="mb20">
							<span>商品卖点：</span
							><span class="mr20">{{
								checkData(goodsSimple.sellingPoint)
							}}</span>
						</div>
						<div class="mb20">
							<span>限制加价:</span
							><span class="mr20">{{
								checkData(goodsSimple.isLimitMarkup == 0 ? '否' : '是')
							}}</span>
						</div>
						<div class="mb20">
							<span>标签:</span>
							<el-tag
								v-for="item in groupTagList"
								:key="item"
								:label="item"
								type="success"
								>{{ item.tagName }}</el-tag
							>
						</div>
					</div>
				</div>
			</el-header>
			<el-main>
				<div class="mt20 category-list" v-if="categoryList.length > 0">
					<h3 class="mb20">商品属性</h3>
					<div
						v-for="item in categoryList"
						:key="item.goodsCategoryAttributeId"
						class="each-list clearfix"
					>
						<span
							class="typeface_nature"
							:class="{ requiredType: item.requiredType == 1 }"
							>{{ item.attributeAnotherName }}：</span
						>
						<span
							v-for="_item in item.goodsAttributeItems"
							:key="_item.goodsAttributeItemId"
						>
							{{ _item.attributeItemValue }}
						</span>
					</div>
				</div>
				<div class="mb20">
					<h3 class="mb20">
						商品图片
						<el-button @click="copyImage" type="text" style="margin-left: 20px"
							>复制商品图片</el-button
						>
					</h3>
					<div v-if="imageList.length === 0">暂无图片数据</div>
					<div v-else>
						<el-image
							class="c_image"
							fit="cover"
							v-for="item in imageList"
							:src="item.imageUrl"
							:key="item.imageId"
							:preview-src-list="previewImageList"
						>
							<div slot="error" class="el-image__error">
								<i class="el-icon-picture-outline"></i>
							</div>
						</el-image>
					</div>
				</div>
				<div class="mb20">
					<h3 class="mb20">规格信息</h3>
					<el-table
						ref="multipleTable"
						:data="goodsSpecList"
						border
						style="width: 100%"
					>
						<el-table-column
							prop="specOne"
							:label="goodsType.specOne"
							header-align="center"
							align="center"
						></el-table-column>
						<el-table-column
							prop="specTwo"
							:label="goodsType.specTwo"
							header-align="center"
							align="center"
						></el-table-column>
						<el-table-column
							v-if="goodsType.specThree"
							prop="specThree"
							:label="goodsType.specThree"
							header-align="center"
							align="center"
						></el-table-column>
						<el-table-column
							label="条形码"
							header-align="center"
							align="center"
						>
							<template slot-scope="scope">
								<div v-if="scope.row.barCode">{{ scope.row.barCode }}</div>
								<div v-else>-</div>
							</template>
						</el-table-column>
						<el-table-column
							prop="totalStock"
							label="库存"
							header-align="center"
							align="center"
						></el-table-column>
						<el-table-column
							label="结算价"
							header-align="center"
							align="center"
						>
							<template slot="header">
								<span>结算价</span>
								<el-tooltip
									class="item"
									effect="dark"
									content="商品完成销售后，平台与商家的结算价格。"
									placement="top"
								>
									<i
										class="el-icon-question"
										style="color: #409eff; margin-left: 5px"
									></i>
								</el-tooltip>
							</template>
							<template slot-scope="scope">
								<div v-if="scope.row.costPrice">
									￥{{ scope.row.costPrice.toFixed(2) }}
								</div>
							</template>
						</el-table-column>
						<el-table-column
							label="供货价"
							header-align="center"
							align="center"
						>
							<template slot="header">
								<span>供货价</span>
								<el-tooltip
									class="item"
									effect="dark"
									content="商品展示给平台店主的供货价格。"
									placement="top"
								>
									<i
										class="el-icon-question"
										style="color: #409eff; margin-left: 5px"
									></i>
								</el-tooltip>
							</template>
							<template slot-scope="scope">
								<div v-if="scope.row.supplyPrice">
									￥{{ scope.row.supplyPrice.toFixed(2) }}
								</div>
							</template>
						</el-table-column>

						<el-table-column
							label="商家建议最低销售价"
							header-align="center"
							align="center"
						>
							<template slot="header">
								<span>商家建议最低销售价</span>
								<el-tooltip
									class="item"
									effect="dark"
									content="商家提供的最低建议销售价。"
									placement="top"
								>
									<i
										class="el-icon-question"
										style="color: #409eff; margin-left: 5px"
									></i>
								</el-tooltip>
							</template>
							<template slot-scope="scope">
								<div v-if="scope.row.supplierPrice">
									￥{{ scope.row.supplierPrice.toFixed(2) }}
								</div>
							</template>
						</el-table-column>
						<el-table-column
							label="建议最低零售价"
							header-align="center"
							align="center"
						>
							<template slot="header">
								<span>建议最低零售价</span>
								<el-tooltip
									class="item"
									effect="dark"
									content="商品在平台正常销售的价格，以此价格进行销售最具性价比。"
									placement="top"
								>
									<i
										class="el-icon-question"
										style="color: #409eff; margin-left: 5px"
									></i>
								</el-tooltip>
							</template>
							<template slot-scope="scope">
								<div v-if="scope.row.lowestPrice">
									￥{{ scope.row.lowestPrice.toFixed(2) }}
								</div>
							</template>
						</el-table-column>
						<el-table-column
							label="外网价"
							header-align="center"
							align="center"
						>
							<template slot="header">
								<span>外网价</span>
								<el-tooltip
									class="item"
									effect="dark"
									content="商品在云货优选平台以外的其他主流线上渠道实际销售价格。"
									placement="top"
								>
									<i
										class="el-icon-question"
										style="color: #409eff; margin-left: 5px"
									></i>
								</el-tooltip>
							</template>
							<template slot-scope="scope">
								<div v-if="scope.row.highestPrice">
									￥{{ scope.row.highestPrice.toFixed(2) }}
								</div>
							</template>
						</el-table-column>
						<el-table-column
							label="市场价"
							header-align="center"
							align="center"
						>
							<template slot="header">
								<span>市场价</span>
								<el-tooltip class="item" effect="dark" placement="top">
									<div slot="content">
										<p>
											1.划线价必须有依据，可以是吊牌价或品牌官网售价等价格；
										</p>
										<p>
											2.请商家务必妥善保存划线价定价依据以备查。抽检时如无法提供的，将被平台或政府处罚；
										</p>
										<p>
											3.平台鼓励商家在商品详情页对“划线价”的含义及定价依据进行准确说明。
										</p>
									</div>
									<i
										class="el-icon-question"
										style="color: #409eff; margin-left: 5px"
									></i>
								</el-tooltip>
							</template>
							<template slot-scope="scope">
								<div v-if="scope.row.marketPrice">
									￥{{ scope.row.marketPrice.toFixed(2) }}
								</div>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div>
					<h3 class="mb20">详细信息</h3>
					<div v-html="checkData(goodsSimple.information)"></div>
				</div>
				<div>
					<h3 class="mb20">运费模板</h3>
					<div v-if="!templateId">没有关联运费模板</div>
					<div v-if="templateId" class="mb20">
						模板名称：<span>{{ templateName }}</span>
					</div>
					<div v-if="templateId" class="mb20">
						运费设置： 计件方式： <span>计件方式：</span>
						<span>按件</span>
					</div>
					<div class="mb20">
						<span>运送方式：</span>
						<span>指定偏远地区，附加运费后可完成发货</span>
					</div>
					<yx-table
						v-if="tableData.length > 0"
						:columns="tableColumns"
						:data="tableData"
					></yx-table>
					<!-- <el-button @click="showDetailsTemplate" v-if="templateId"
						>查看运费模板详情</el-button
					> -->
				</div>
				<div>
					<h3 class="mb20">售后服务</h3>
					<div>{{ categorySevenReason }}</div>
					<div>{{ goodsSevenDaysReason }}</div>
				</div>
			</el-main>
		</el-container>
		<!-- 商品状态  goodsStatus 待审核: 1,4,5,6 审核中: 2, 审核通过: 3 -->
		<div class="save_button">
			<!-- v-if="this.updateWarehouseGroupGoodsByGoodsId" -->

			<el-button type="primary" @click="goEdit">编辑</el-button>
			<el-button @click="goList">返回</el-button>
		</div>
		<!-- <my-dialog
			labelWidth="105px"
			:isVisible.sync="detailsTemplateDialog"
			title="运费模板详情"
			:btList="btList"
			width="900px"
			@handleClick="detailsTemplate"
		>
			<detailsTemplate :templateId="templateId"></detailsTemplate>
		</my-dialog> -->
	</el-main>
</template>
<script>
import {
	getGoodsDetailByOrganizationSpecIdPlus,
	getGoodsDetailBySnapshot,
} from '@/api/yhtPlusWebGoods'
import {
	listCategoryAttributeInfoByCategoryId,
	getGoodsAttributeInfo,
} from '@/api/yhtPlusCmsGoodsCategoryAttribute'
import YxTable from '@wg-vue-materials/yx-table'
import { isNull } from '@/utils/helper/common'
import { getBigImg } from '@/utils/imageTool'
import { checkFunctionCode } from '@/utils/auth'
import { getGoodsConfiguration } from '@/api/systemConfiguration'
// import detailsTemplate from '../freight/components/detailsTemplate'
// import MyDialog from '@/components/utils/MyDialog'
export default {
	name: 'GoodsDetail',
	components: {
		YxTable,
		// MyDialog,
		// detailsTemplate,
	},
	data() {
		return {
			goodsType: {
				specOne: '',
				specTwo: '',
			},
			categoryList: [], //商品属性
			/* -------------权限----------------- */
			updateWarehouseGroupGoodsByGoodsId: checkFunctionCode(
				'updateWarehouseGroupGoodsByGoodsId'
			),
			/* -------------权限----------------- */
			goodsSimple: {}, // 商品详情
			imageList: [], // 图片列表
			goodsSpecList: [], // 商品规格列表
			tableData: [],
			groupTagList: [],
			tableColumns: [
				{
					dataIndex: 'areaDelivery',
					title: '运送到',
					customRender: (row) => {
						return row.areaDelivery.areaDeliveryDetailName
					},
				},
				{
					dataIndex: 'firstItem',
					title: '首件数（件）',
				},
				{
					dataIndex: 'firstFee',
					title: '首费（元）',
				},
				{
					dataIndex: 'contItem',
					title: '续件数（件）',
				},
				{
					dataIndex: 'contFee',
					title: '续费（元）',
				},
			],
			goodsId: this.$route.params.goodsId,
			goodsSpecId: this.$route.params.goodsSpecId,
			orderCommodity: this.$route.params.orderCommodity,
			goodsSnapshotId: this.$route.params.goodsSnapshotId,
			goodsSpecSnapshotId: this.$route.params.goodsSpecSnapshotId,

			/* -------------运费详情框----------------- */
			// detailsTemplateDialog: false,
			templateId: 0,
			templateName: '',
			// btList: [
			// 	{
			// 		type: 'default',
			// 		label: '关闭',
			// 		show: true,
			// 		event: 'close',
			// 	},
			// ],
			// detailsTemplate: () => {
			// 	this.detailsTemplateDialog = false
			// },
			// 七天无理由回显
			categorySevenDaysConfig: {},
			goodsSevenDaysConfig: {},
		}
	},
	created: function () {
		/* -------------权限----------------- */
		/* -------------权限----------------- */
		this._getGoodsConfiguration()
	},
	computed: {
		previewImageList() {
			return this.imageList.map((item) => {
				return item.imageUrl
			})
		},
		// 七天无理由回显
		categorySevenReason: function () {
			if (this.categorySevenDaysConfig.configType == 3) {
				return '该商品所属类目默认不支持七天无理由，商家可进行调整'
			} else if (this.categorySevenDaysConfig.configType == 1) {
				return '该商品所属类目默认不支持七天无理由'
			} else if (this.categorySevenDaysConfig.configType == 2) {
				return '该商品所属类目默认支持七天无理由'
			} else {
				return '该商品所属类目没有配置七天无理由信息'
			}
		},
		goodsSevenDaysReason() {
			if (this.goodsSevenDaysConfig.configType == 1) {
				return '该商品不支持【七天无理由】服务'
			} else if (this.goodsSevenDaysConfig.configType == 2) {
				return '该商品支持【七天无理由】服务'
			} else {
				return '该商品未设置【七天无理由】服务'
			}
		},
	},
	methods: {
		// 复制图片
		copyImage() {
			let list = this.imageList.map((item) => {
				return getBigImg(item.imageUrl)
			})
			this.$copyText(list.join(',')).then(() => {
				this.$message.success('复制成功')
			})
		},
		// 复制抖店信息
		copyGoodsInfo() {
			let list = this.imageList.map((item) => {
				return getBigImg(item.imageUrl)
			})
			let goodsSimple = this.goodsSimple
			let goods = ''
			this.goodsSpecList.map((item) => {
				let sku = item.specTwo
					? `${this.goodsType.specOne}:${item.specOne};${this.goodsType.specTwo}:${item.specTwo}`
					: `${this.goodsType.specOne}:${item.specOne}`
				goods += `${this.checkData(goodsSimple.goodsName)}	${
					item.lowestPrice
				}				30		${this.checkData(goodsSimple.goodsNumber)}	${this.checkData(
					goodsSimple.goodsNumber
				)}	${sku}		${item.lowestPrice}			30		${item.barCode}	${item.barCode}	${list.join(
					','
				)}				女装>>POLO衫\r\n`
			})
			this.$copyText(goods).then(() => {
				this.$message.success('复制成功')
			})
		},
		// 获取规格配置
		async _getGoodsConfiguration() {
			let {
				data: { resultData, resultCode },
			} = await getGoodsConfiguration()
			if (resultCode == 0) {
				this.goodsType = resultData.goodsType || {}
			}
			this.getInfo()
		},
		oldSystem() {
			window.open(
				`/yhtplus/web/goodsDetail.html?goodsId=${this.goodsId}&goodsSpecId=${
					this.goodsSpecId
				}&isEdit=${true}`
			)
		},
		/**
		 *  校验数据 返回空字符
		 */
		checkData(data, hint) {
			if (isNull(data)) {
				return hint || '暂无数据'
			}
			return data
		},

		async _listCategoryAttributeInfoByCategoryId(id) {
			let paramJson = {
				goodsCategoryId: id,
			}
			let {
				data: { resultCode, resultData },
			} = await listCategoryAttributeInfoByCategoryId(paramJson)
			if (resultCode == 0) {
				this._getGoodsAttributeInfo(resultData)
			}
		},
		async _getGoodsAttributeInfo(arr) {
			let paramJson = {
				goodsId: this.goodsId,
			}
			let {
				data: { resultCode, resultData },
			} = await getGoodsAttributeInfo(paramJson)
			if (resultCode == 0) {
				arr.forEach((item) => {
					resultData.forEach((_item) => {
						if (item.goodsBasicsAttributeId == _item.goodsBasicsAttributeId) {
							_item.requiredType = item.requiredType
						}
					})
				})
				this.categoryList = resultData
			}
		},
		goList() {
			this.$router.push({ name: 'GoodsList' })
		},
		goEdit() {
			/** 编辑商品 **/
			this.$router.push({
				path: `/goods/GoodsEdit/${this.goodsSpecId}/${null}/${this.goodsId}`,
			})
		},
		getInfo: async function () {
			/** 获取商品详情 **/
			let paramJson = { goodsId: this.goodsId, goodsSpecId: this.goodsSpecId }
			let Url = getGoodsDetailByOrganizationSpecIdPlus
			if (this.orderCommodity == 1) {
				paramJson.goodsSnapshotId = this.goodsSnapshotId
				paramJson.goodsSpecSnapshotId = this.goodsSpecSnapshotId
				Url = getGoodsDetailBySnapshot
			}
			let {
				data: { resultCode, resultData },
			} = await Url(paramJson)

			if (resultCode === 0) {
				if (resultData.categorySevenDaysConfig) {
					this.categorySevenDaysConfig =
						resultData.categorySevenDaysConfig || {}
				}
				if (resultData.goodsSevenDaysConfig) {
					this.goodsSevenDaysConfig = resultData.goodsSevenDaysConfig || {}
				}
				this.goodsSimple = resultData.goodsSimple
				this.groupTagList = resultData.groupTagList
				this._listCategoryAttributeInfoByCategoryId(
					resultData.goodsSimple.goodsCategoryId
				)
				if (
					resultData.imageList.length > 0 &&
					resultData.imageList[0].imageUrl ===
						'file/default/goods/goods_default_1m.jpg'
				) {
					this.imageList = []
				} else {
					this.imageList = resultData.imageList.map((item) => {
						if (item.imageUrl.lastIndexOf('m') === item.imageUrl.length - 5) {
							item.imageUrl =
								item.imageUrl.substring(0, item.imageUrl.lastIndexOf('m')) +
								'.jpg'
						}
						item.imageUrl = getBigImg(item.imageUrl)
						return item
					})
				}
				this.goodsSpecList = resultData.goodsSpecList
				//运费模板id
				if (
					resultData.expressTemplate &&
					resultData.expressTemplate.templateId
				) {
					this.tableData = resultData.expressTemplate.templateConfig.areaConfig

					console.log('----', this.tableData)
					this.templateId = resultData.expressTemplate.templateId
					this.templateName = resultData.expressTemplate.templateName
				}
				console.log(this.goodsSimple, 'this.goodsSimple')
			} else {
				this.goodsSimple = {}
			}
		},
		// showDetailsTemplate() {
		// 	this.detailsTemplateDialog = true
		// },
	},
}
</script>

<style lang="scss" scoped>
.mb50 {
	margin-bottom: 40px !important;
}
.mb20 {
	margin-bottom: 20px;
}
.typeface {
	font-weight: bold;
	font-size: 18px;
}
.ml80 {
	margin-left: 80px;
}
.el-row {
	border-bottom: 1px dashed #e7e7e7;
	border-color: #bbb;
	width: 300px;
	margin-bottom: 20px;
	&:last-child {
		margin-bottom: 0;
	}
}
.bg-purple-dark {
	background: #e5e9f2;
}
.grid-content {
	border-radius: 4px;
	min-height: 60px;
	text-align: center;
}
.c_image {
	width: 150px;
	height: 150px;
	margin-right: 15px;
	margin-top: 15px;
	border-radius: 5px;
	box-shadow: #e6e6e6 0px 0px 7px 1px;
}
.goods_message {
	width: 685px;
}
.cl_999 {
	color: #999;
}
.goods_price {
	background-color: #f5f5f5;
	margin: 15px 0px;
	border-bottom: 1px dashed #e7e7e7;
	.price_item {
		flex: 1;
		padding: 20px 30px;
		.price_red {
			color: red;
			font-size: 20px;
			font-weight: 700;
		}
	}
}
.save_button {
	position: fixed;
	bottom: 0;
	left: 280px;
	right: 0;
	padding: 20px 0px 20px 50px;
	background-color: #ccc;
	opacity: 0.8;
	z-index: 120;
}
.each-list {
	line-height: 32px;
}
.clearfix:after {
	content: '.';
	display: block;
	clear: both;
	visibility: hidden;
	height: 0;
	font-size: 0;
}
.typeface_nature {
	position: relative;
	float: left;
	width: auto;
	&.requiredType {
		&::after {
			content: '*';
			position: absolute;
			left: -10px;
			top: 4px;
			font-size: 14px;
			color: brown;
		}
	}
}
</style>

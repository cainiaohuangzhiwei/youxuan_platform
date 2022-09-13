<template>
	<div>
		<el-dialog
			title="审核商品"
			:visible.sync="localVisible"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			@before-close="handleCloseDialog"
		>
			<div v-loading="loading">
				<!-- 商品信息 S -->
				<div class="con_flex mb10">
					<div class="goods_message">
						<h2 class="mb10 fs18">商品基本信息</h2>
						<div class="mb10">
							<span>商品名称：</span
							><span class="mr20">{{
								goodsSimple.goodsName || '暂无数据'
							}}</span>
						</div>
						<div class="mb10">
							<span>商品类目：</span
							><span class="mr20">{{
								goodsSimple.goodsCategoryName || '暂无数据'
							}}</span>
						</div>
						<div class="mb10">
							<span>商品货号：</span
							><span class="mr20">{{
								goodsSimple.goodsNumber || '暂无数据'
							}}</span>
						</div>
						<div class="mb10">
							<span>品牌名称：</span
							><span class="mr20">{{
								goodsSimple.brandName || '暂无数据'
							}}</span>
						</div>
						<div class="mb10">
							<span>计量单位：</span
							><span class="mr20">{{ goodsSimple.unit || '件' }}</span>
						</div>
						<div class="mb10">
							<span>排序值：</span
							><span class="mr20">{{ goodsSimple.sortOrder || 0 }}</span>
						</div>
						<div class="mb10">
							<span>商品卖点：</span
							><span class="mr20">{{
								goodsSimple.sellingPoint || '暂无数据'
							}}</span>
						</div>
					</div>
				</div>
				<!-- 商品信息 E -->
				<!-- 商品属性 S -->
				<div class="mt20 category-list">
					<h3 class="mb20">商品属性</h3>
					<div v-if="!categoryList.length">暂无商品属性</div>
					<div v-else>
						<div
							v-for="item in categoryList"
							:key="item.goodsCategoryAttributeId"
							class="each-list clearfix mb10"
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
				</div>
				<!-- 商品属性 E -->
				<!-- 商品图片 S -->
				<div class="mb20">
					<h3 class="mb20">商品图片</h3>
					<div v-if="imageList.length === 0">暂无图片数据</div>
					<div v-else>
						<draggable
							v-model="goodsDetail.imageList"
							@update="datadragEnd"
							:options="{ animation: 500 }"
						>
							<transition-group>
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
							</transition-group>
						</draggable>
					</div>
				</div>
			</div>
			<!-- 商品图片 E -->
			<!-- 规格信息 S -->
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
						label="颜色"
						header-align="center"
						align="center"
					></el-table-column>
					<el-table-column
						prop="specTwo"
						label="尺码"
						header-align="center"
						align="center"
					></el-table-column>
					<el-table-column label="条形码" header-align="center" align="center">
						<template slot-scope="scope">
							<div v-if="scope.row.barCode">{{ scope.row.barCode }}</div>
							<div v-else>-</div>
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
							<div>
								{{
									scope.row.lowestPrice > 0
										? scope.row.lowestPrice.toFixed(2)
										: '-'
								}}
							</div>
						</template>
					</el-table-column>
					<el-table-column label="结算价" header-align="center" align="center">
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
								{{ scope.row.costPrice.toFixed(2) }}
							</div>
						</template>
					</el-table-column>
					<el-table-column label="外网价" header-align="center" align="center">
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
								{{ scope.row.highestPrice.toFixed(2) }}
							</div>
						</template>
					</el-table-column>
					<el-table-column label="市场价" header-align="center" align="center">
						<template slot="header">
							<span>市场价</span>
							<el-tooltip class="item" effect="dark" placement="top">
								<div slot="content">
									<p>1.划线价必须有依据，可以是吊牌价或品牌官网售价等价格；</p>
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
								{{ scope.row.marketPrice.toFixed(2) }}
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 规格信息 E -->
			<!-- 详细信息 S -->
			<div>
				<h3 class="mb20">详细信息</h3>
				<UE
					ref="um"
					:defaultMsg="information"
					:name="'ue' + timeOut"
					:isImageList="true"
					imageType="18"
					imageUrl="/weeget-infinite-backend-gateway/yhtplus/image/uploadImageList.action?type=ajax"
				></UE>
			</div>
			<!-- 详细信息 E -->
			<!-- 变更记录 S -->
			<div v-if="changeRecordList.length">
				<h3 class="mb20">变更商品记录</h3>
				<p class="check-info">
					<span
						>变更时间：
						{{
							moment(currentData.checkTime).format('YYYY-MM-DD HH:mm:ss')
						}}</span
					>
					<span>变更人： {{ clerkName }}</span>
				</p>
				<p class="clerk-title">变更前</p>
				<yx-table
					:spanMethod="spanMethod"
					:columns="tableColumnsCheck"
					:data="oldList"
				>
					<template slot="specOne" slot-scope="scope">
						<div>
							{{ scope.row.specOne }}
						</div>
					</template>
					<template slot="specTwo" slot-scope="scope">
						<div>
							{{ scope.row.specTwo }}
						</div>
					</template>
					<template slot="barCode" slot-scope="scope">
						<div>
							{{ scope.row.barCode }}
						</div>
					</template>
					<template slot="stock" slot-scope="scope">
						<div>
							{{ scope.row.stock }}
						</div>
					</template>
					<template slot="lowestPrice" slot-scope="scope">
						<div>
							{{ scope.row.lowestPrice }}
						</div>
					</template>
					<template slot="costPrice" slot-scope="scope">
						<div>
							{{ scope.row.costPrice }}
						</div>
					</template>
					<template slot="highestPrice" slot-scope="scope">
						<div>
							{{ scope.row.highestPrice }}
						</div>
					</template>
					<template slot="marketPrice" slot-scope="scope">
						<div>
							{{ scope.row.marketPrice }}
						</div>
					</template>
				</yx-table>
				<p class="clerk-title">变更后</p>
				<yx-table
					:spanMethod="spanMethodNew"
					:columns="tableColumnsCheck"
					:data="newList"
				>
					<template slot="specOne" slot-scope="scope">
						<div
							:style="
								!oldList[scope.index] ||
								scope.row.specOne != oldList[scope.index].specOne
									? 'color:red'
									: ''
							"
						>
							{{ scope.row.specOne }}
						</div>
					</template>
					<template slot="specTwo" slot-scope="scope">
						<div
							:style="
								!oldList[scope.index] ||
								scope.row.specTwo != oldList[scope.index].specTwo
									? 'color:red'
									: ''
							"
						>
							{{ scope.row.specTwo }}
						</div>
					</template>
					<template slot="barCode" slot-scope="scope">
						<div
							:style="
								!oldList[scope.index] ||
								scope.row.barCode != oldList[scope.index].barCode
									? 'color:red'
									: ''
							"
						>
							{{ scope.row.barCode }}
						</div>
					</template>
					<template slot="stock" slot-scope="scope">
						<div
							:style="
								!oldList[scope.index] ||
								scope.row.stock != oldList[scope.index].stock
									? 'color:red'
									: ''
							"
						>
							{{ scope.row.stock }}
						</div>
					</template>
					<template slot="lowestPrice" slot-scope="scope">
						<div
							:style="
								!oldList[scope.index] ||
								scope.row.lowestPrice != oldList[scope.index].lowestPrice
									? 'color:red'
									: ''
							"
						>
							{{ scope.row.lowestPrice }}
						</div>
					</template>
					<template slot="costPrice" slot-scope="scope">
						<div
							:style="
								!oldList[scope.index] ||
								scope.row.costPrice != oldList[scope.index].costPrice
									? 'color:red'
									: ''
							"
						>
							{{ scope.row.costPrice }}
						</div>
					</template>
					<template slot="highestPrice" slot-scope="scope">
						<div
							:style="
								!oldList[scope.index] ||
								scope.row.highestPrice != oldList[scope.index].highestPrice
									? 'color:red'
									: ''
							"
						>
							{{ scope.row.highestPrice }}
						</div>
					</template>
					<template slot="marketPrice" slot-scope="scope">
						<div
							:style="
								!oldList[scope.index] ||
								scope.row.marketPrice != oldList[scope.index].marketPrice
									? 'color:red'
									: ''
							"
						>
							{{ scope.row.marketPrice }}
						</div>
					</template>
				</yx-table>
			</div>
			<!-- 变更记录 E -->
			<!-- 运费模版 S -->
			<div>
				<h3 class="mb20">运费模板</h3>
				<div v-if="!templateId">没有关联运费模板</div>
				<div v-if="templateId" class="mb20">
					模板名称：<span>{{ templateName }}</span>
				</div>
				<div v-if="templateId" class="mb20">
					运费设置： 计件方式： <span>计件方式：</span>
					<span>按件</span>
					<div class="mb20">
						<span>运送方式：</span>
						<span>指定偏远地区，附加运费后可完成发货</span>
					</div>
					<yx-table
						v-if="tableData.length > 0"
						:columns="tableColumns"
						:data="tableData"
					></yx-table>
				</div>
			</div>
			<!-- 运费模版 E -->
			<div slot="footer" class="dialog-footer">
				<el-button
					type="primary"
					v-if="currentIndex > 0"
					@click="handleSortItem('previous')"
					>上一条</el-button
				>
				<el-button type="primary" @click="handleAuditItem('pass')"
					>审核通过，进入下一条</el-button
				>
				<el-button type="primary" @click="handleAuditItem('reject')"
					>审核不通过</el-button
				>
				<el-button type="primary" @click="handleSortItem('next')"
					>下一条</el-button
				>
			</div>
		</el-dialog>
		<Dialog
			:title="审核"
			:visible="auditLoding"
			width="50%"
			:bottomBtn="auditBottomBtn"
			@before-close="
				() => {
					auditLoding = false
					auditCfg[0].hide = false
					auditCfg[1].hide = false
					auditCfg[2].hide = true
					auditData = {
						lowPrice2: '',
						lowPrice1: '',
						supplyPrice: '',
						checkReason: '',
					}
				}
			"
		>
			<yx-form
				labelWidth="100px"
				:rules="formRules"
				:data="auditData"
				:items.sync="auditCfg"
			>
				<template #supplyPrice>
					<div>
						供货价 = 结算价/
						<el-input
							:min="0"
							:max="100"
							style="width: 22%"
							v-model.trim="auditData.supplyPrice"
							placeholder="请输入比例"
						/>
					</div>
				</template>
				<template #price>
					<div>
						建议零售价 = 结算价/<el-input
							:min="0"
							:max="100"
							style="width: 22%"
							v-model.trim="auditData.lowPrice1"
							placeholder="请输入比例"
						/>
						/<el-input
							:min="0"
							:max="100"
							style="width: 22%"
							v-model.trim="auditData.lowPrice2"
							placeholder="请输入比例"
						/>
					</div>
				</template>
			</yx-form>
		</Dialog>
	</div>
</template>

<script>
import draggable from 'vuedraggable'
import {
	getGoodsDetailByGoodsId,
	checkGoodsFromSupplier,
	checkGoodsPrice,
	getChangeOfContrastByGoodsId,
} from '@/api/yhtPlusWebGoods'
import {
	listCategoryAttributeInfoByCategoryId,
	getGoodsAttributeInfo,
} from '@/api/yhtPlusCmsGoodsCategoryAttribute'
import { isNull } from '@/utils/helper/common'
import { getBigImg } from '@/utils/imageTool'
import moment from 'moment'
import UE from '@/components/RichText'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import YxForm from '@wg-vue-materials/yx-form'
export default {
	name: 'CommodityAuditDialog',
	components: {
		YxTable,
		draggable,
		UE,
		Dialog,
		YxForm,
	},
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		newTableData: {
			type: Array,
			default: () => [],
		},
		commodityAuditDialogParams: {
			type: Object,
			default: () => {},
		},
	},
	watch: {
		visible(val) {
			if (val && this.commodityAuditDialogParams?.currentIndex >= 0) {
				this.init(this.commodityAuditDialogParams.currentIndex)
			}
		},
		'commodityAuditDialogParams.currentIndex'(val) {
			this.currentIndex = val
		},
	},
	data() {
		return {
			moment,
			currentIndex: -1,
			loading: false,
			currentData: {},
			// 商品信息
			goodsSimple: {},
			// 商品属性
			categoryList: {},
			// 商品数据
			goodsDetail: {},
			// 商品图片列表
			imageList: [],
			// 规格信息
			goodsSpecList: [],
			// 详细信息
			timeOut: new Date().getTime(),
			information: {},
			// 变更记录
			clerkName: '', // 变更操作人
			changeRecordList: [],
			tableColumnsCheck: [
				{
					type: 'string',
					title: '商品名称',
					dataIndex: 'goodsName',
					width: '200',
				},
				{
					type: 'string',
					title: '商品货号',
					dataIndex: 'goodsNumber',
				},
				{
					type: 'string',
					title: '计量单位',
					dataIndex: 'unit',
				},
				{
					type: 'custom',
					title: '颜色',
					dataIndex: 'specOne',
				},
				{
					type: 'custom',
					title: '尺码',
					dataIndex: 'specTwo',
				},
				{
					type: 'custom',
					title: '条形码',
					dataIndex: 'barCode',
				},
				{
					type: 'custom',
					title: '库存',
					dataIndex: 'stock',
				},
				{
					type: 'custom',
					title: '最低销售价',
					dataIndex: 'lowestPrice',
				},
				{
					type: 'custom',
					title: '结算价',
					dataIndex: 'costPrice',
				},
				{
					type: 'custom',
					title: '外网价',
					dataIndex: 'highestPrice',
				},
				{
					type: 'custom',
					title: '市场价',
					dataIndex: 'marketPrice',
				},
			],
			oldList: [],
			newList: [],
			spanOldArr: [],
			spanNewArr: [],
			pos: 0,
			// 运费模版
			templateId: 0,
			templateName: '',
			tableData: [],
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
			// 审核弹窗
			auditLoding: false,
			auditBottomBtn: [
				{
					title: '确定,进入下一条',
					type: 'primary',
					click: () => {
						this.auditConfirm()
					},
				},
			],
			auditData: {
				lowPrice2: '',
				lowPrice1: '',
				supplyPrice: '',
				checkReason: '',
			},
			auditCfg: [
				{
					type: 'custom',
					dataIndex: 'supplyPrice',
				},
				{
					type: 'custom',
					dataIndex: 'price',
				},
				{
					type: 'textarea',
					dataIndex: 'checkReason',
					title: '审核不通过原因：',
					placeholder: '请填入审核不通过原因',
					hide: true,
				},
			],
		}
	},
	computed: {
		previewImageList() {
			return this.imageList.map((item) => {
				return item.imageUrl
			})
		},
		localVisible: {
			get() {
				return this.visible
			},
			set(val) {
				this.$emit('update:visible', val)
			},
		},
	},
	methods: {
		init(index) {
			this.loading = true
			this.currentData = this.newTableData[index]
			// 获取商商品信息、详细信息、商品数据、商品图片、规格信息、运费模板
			this.fetchGoodsDetail((resultData) => {
				// 获取商品属性
				this.fetchCategoryAttribute(resultData.goodsSimple.goodsCategoryId)
				// 变更记录
				this._getChangeOfContrastByGoodsId()
				this.loading = false
			})
		},
		handleCloseDialog() {
			this.localVisible = false
			this.$emit('update:visible', false)
		},
		async fetchGoodsDetail(cb) {
			const currentData = this.currentData

			const params = {
				goodsId: currentData.goodsId,
				goodsSpecId: currentData.goodsSpecId,
				checkTime: currentData.checkTime * 1,
				idx: currentData.idx,
				oCount: currentData.oCount,
				startIndex: this.commodityAuditDialogParams.startIndex,
				goodsSt: this.commodityAuditDialogParams.goodsSt,
				goodsStatus: this.commodityAuditDialogParams.gStatus,
			}

			const {
				data: { resultCode, resultData },
			} = await getGoodsDetailByGoodsId(params)
			if (resultCode !== 0) return
			// 商品信息
			this.goodsSimple = resultData.goodsSimple
			// 详细信息
			this.information =
				(resultData.goodsSimple && resultData.goodsSimple.information) || ''
			// 商品数据
			this.goodsDetail = resultData
			// 商品图片
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
			// 规格信息
			this.goodsSpecList = resultData.goodsSpecList
			//运费模板id
			if (resultData.expressTemplate && resultData.expressTemplate.templateId) {
				this.tableData = resultData.expressTemplate.templateConfig.areaConfig
				this.templateId = resultData.expressTemplate.templateId
				this.templateName = resultData.expressTemplate.templateName
			}
			cb && cb(resultData)
		},
		// 获取商品属性
		async fetchCategoryAttribute(id) {
			const { data } = await listCategoryAttributeInfoByCategoryId({
				goodsCategoryId: id,
			})
			if (data.resultCode != 0) return
			const {
				data: { resultCode, resultData },
			} = await getGoodsAttributeInfo({
				goodsId: this.currentData.goodsId,
			})
			if (resultCode == 0) {
				data.resultData.forEach((item) => {
					resultData.forEach((_item) => {
						if (item.goodsBasicsAttributeId == _item.goodsBasicsAttributeId) {
							_item.requiredType = item.requiredType
						}
					})
				})
				this.categoryList = resultData
			}
		},
		// 获取变更记录
		async _getChangeOfContrastByGoodsId() {
			let {
				data: { resultCode, resultData },
			} = await getChangeOfContrastByGoodsId({
				goodsId: String(this.currentData.goodsId),
				goodsNumber: this.goodsSimple.goodsNumber,
			})
			if (resultCode == 0) {
				this.spanArr = []
				let changeRecordList
				let arr = resultData ? Object.keys(resultData) : []
				arr = arr.filter((i) => resultData[i])
				if (arr.length > 1) {
					changeRecordList = [
						resultData.updateAfterGoodsInfo,
						resultData.updateFrontGoodsInfo,
					]
				} else {
					changeRecordList = []
				}
				let oldList = (changeRecordList[1] && [changeRecordList[1]]) || []
				let newList = (changeRecordList[0] && [changeRecordList[0]]) || []
				this.oldList = []
				if (oldList.length) {
					oldList.forEach((item) => {
						if (item.newGoodsSpecList) {
							item.newGoodsSpecList.forEach((sku) => {
								let newItem = Object.assign({}, item, sku)
								this.oldList.push(newItem)
							})
						}
					})
					if (this.oldList && this.oldList.length) {
						this.getSpanArr(this.oldList, 'spanOldArr')
					}
				} else {
					this.oldList = []
				}
				this.newList = []
				if (newList.length) {
					newList.forEach((item) => {
						if (item.newGoodsSpecList) {
							item.newGoodsSpecList.forEach((sku) => {
								let newItem = Object.assign({}, item, sku)
								this.newList.push(newItem)
							})
						}
					})
					if (this.newList && this.newList.length) {
						this.getSpanArr(this.newList, 'spanNewArr')
					}
				} else {
					this.newList = []
				}
				this.changeRecordList = changeRecordList
				if (isNull(changeRecordList)) {
					return
				}
				this.clerkName = (newList[0] && newList[0].clerkName) || ''
			}
		},
		getSpanArr(data, key) {
			data.forEach((item, index) => {
				if (index == 0) {
					this[key].push(1)
					this.pos = 0
				} else {
					// 判断当前元素与上一个元素是否相同
					if (data[index].goodsId == data[index - 1].goodsId) {
						this[key][this.pos] += 1
						this[key].push(0)
					} else {
						this[key].push(1)
						this.pos = index
					}
				}
			})
		},
		spanMethodNew({ rowIndex, columnIndex }) {
			if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
				const _row = this.spanNewArr[rowIndex]
				const _col = _row > 0 ? 1 : 0
				return {
					// [0,0] 表示这一行不显示， [2,1]表示行的合并数
					rowspan: _row,
					colspan: _col,
				}
			}
		},
		spanMethod({ rowIndex, columnIndex }) {
			if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
				const _row = this.spanOldArr[rowIndex]
				const _col = _row > 0 ? 1 : 0
				return {
					// [0,0] 表示这一行不显示， [2,1]表示行的合并数
					rowspan: _row,
					colspan: _col,
				}
			}
		},
		// 上下条操作
		handleSortItem(type) {
			if (type === 'next') {
				if (this.currentIndex < this.newTableData.length - 1) {
					this.currentIndex = this.currentIndex + 1
					this.init(this.currentIndex)
				} else {
					this.$message.warning('这是最后一条！')
				}
			} else {
				if (this.currentIndex > 0) {
					this.currentIndex = this.currentIndex - 1
					this.init(this.currentIndex)
				} else {
					this.$message.warning('这是第一条！')
				}
			}
		},
		datadragEnd(evt) {
			// evt.preventDefault()
			this.imageList = JSON.parse(JSON.stringify(this.goodsDetail.imageList))
			this.imageList.forEach((item) => {
				if (item.imageUrl.lastIndexOf('m') === item.imageUrl.length - 5) {
					item.imageUrl =
						item.imageUrl.substring(0, item.imageUrl.lastIndexOf('m')) + '.jpg'
				}
			})
			console.log('拖动前的索引 :' + evt.oldIndex)
			console.log('拖动后的索引 :' + evt.newIndex)
		},
		getParamJson() {
			let imageList = this.goodsDetail.imageList.map((item, index) => {
				item.sortOrder = index
				return item
			})
			let pams = {
				goodsId: this.goodsSimple.goodsId,
				goodsSpecId: this.goodsSimple.goodsSpecId,
				checkResult: 1,
				goodsName: this.goodsSimple.goodsName,
				goodsNumber: this.goodsSimple.goodsNumber,
				brandId: this.goodsSimple.brandId,
				warehouseSpecList: this.goodsDetail.warehouseSpecList,
				sellingPoint: this.goodsSimple.sellingPoint,
				imageList: imageList,
				markList: this.goodsDetail.goodsMarkList,
				goodsSpecList: this.goodsDetail.goodsSpecList,
				unit: this.goodsSimple.unit,
				information: this.$refs.um.editor.getContent(),
				informationImageList: this.$refs.um.getInformationImageList(),
			}
			return pams
		},
		// 处理审核
		async handleAuditItem(type) {
			this.typeLogding = type
			const goodsStatus = parseInt(this.commodityAuditDialogParams.goodsSt) //审核状态
			if (type === 'pass') {
				if (goodsStatus === 2) {
					//第一次审核基本信息
					const pams = this.getParamJson()
					const {
						data: { resultCode },
					} = await checkGoodsFromSupplier(pams)
					if (resultCode == 0) {
						this.handleSortItem('next')
					}
				} else if (goodsStatus == 7) {
					this.auditLoding = true
				}
			} else {
				this.auditLoding = true
				this.auditCfg[0].hide = true
				this.auditCfg[1].hide = true
				this.auditCfg[2].hide = false
			}
		},
		async auditConfirm() {
			if (this.typeLogding == 'pass') {
				const paramJson = {
					lowPrice2: this.auditData.lowPrice2,
					lowPrice1: this.auditData.lowPrice1,
					supplyPrice: this.auditData.supplyPrice,
				}
				paramJson.goodsIdList = [this.commodityAuditDialogParams.goodsId]
				paramJson.checkResult = 1
				if (
					paramJson.lowPrice1 == 0 ||
					paramJson.lowPrice1 == 1 ||
					paramJson.lowPrice2 == 0 ||
					paramJson.lowPrice2 == 1
				) {
					this.$message({
						message: '请输入正确的比例',
						type: 'warning',
					})
					return
				}
				let {
					data: { resultCode },
				} = await checkGoodsPrice(paramJson)
				if (resultCode == 0) {
					this.auditLoding = false
					this.handleSortItem('next')
				}
			} else {
				let goodsStatus = parseInt(this.commodityAuditDialogParams.goodsSt) //审核状态
				if (goodsStatus == 2) {
					let paramJson = this.getParamJson()
					paramJson.checkResult = 2
					paramJson.checkReason = this.auditData.checkReason
					if (isNull(paramJson.checkReason)) {
						this.$message({
							message: '请填写审核不通过的理由',
							type: 'warning',
						})
						return
					}
					let {
						data: { resultCode },
					} = await checkGoodsFromSupplier(paramJson)
					if (resultCode == 0) {
						this.auditLoding = false
						this.handleSortItem('next')
					}
				} else {
					let paramJson = {}
					paramJson.checkResult = 2
					paramJson.checkReason = this.auditData.checkReason
					paramJson.goodsIdList = [this.commodityAuditDialogParams.goodsId]
					if (isNull(paramJson.checkReason)) {
						this.$message({
							message: '请填写审核不通过的理由',
							type: 'warning',
						})
						return
					}
					let {
						data: { resultCode },
					} = await checkGoodsPrice(paramJson)
					if (resultCode == 0) {
						this.auditLoding = false
						this.handleSortItem('next')
					}
				}
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.mb10 {
	margin-bottom: 10px;
}
.c_image {
	width: 150px;
	height: 150px;
	margin-right: 15px;
	margin-top: 15px;
	border-radius: 5px;
	box-shadow: #e6e6e6 0px 0px 7px 1px;
}
</style>

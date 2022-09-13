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
				<div class="con_flex mb20">
					<div class="goods_message">
						<h2 class="mt20 mb10 fs18">商品基本信息</h2>
						<div class="mb20">
							<span>商品名称:</span
							><span class="mr20">{{ checkData(goodsSimple.goodsName) }}</span>
						</div>
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
							<span>品牌名称：</span
							><span class="mr20">{{ checkData(goodsSimple.brandName) }}</span>
						</div>
						<div class="mb20">
							<span>计量单位：</span
							><span class="mr20">{{ checkData(goodsSimple.unit) }}</span>
						</div>
						<div class="mb20">
							<span>排序值：</span
							><span class="mr20">{{ checkData(goodsSimple.sortOrder) }}</span>
						</div>
						<div class="mb20">
							<span>商品卖点：</span
							><span class="mr20">{{
								checkData(goodsSimple.sellingPoint)
							}}</span>
						</div>
					</div>
				</div>
			</el-header>
			<el-main>
				<div class="mt20 category-list">
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
						<!-- <el-table-column
							prop="totalStock"
							label="库存"
							header-align="center"
							align="center"
						></el-table-column> -->
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
						<el-table-column
							label="商家建议最低零售价"
							header-align="center"
							align="center"
						>
							<template slot="header">
								<span>商家建议最低零售价</span>
								<el-tooltip
									class="item"
									effect="dark"
									content="商家提供的最低建议销售价。。"
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
										scope.row.supplierPrice > 0
											? scope.row.supplierPrice.toFixed(2)
											: '-'
									}}
								</div>
							</template>
						</el-table-column>
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
									{{ scope.row.costPrice.toFixed(2) }}
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
									{{ scope.row.highestPrice.toFixed(2) }}
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
									{{ scope.row.marketPrice.toFixed(2) }}
								</div>
							</template>
						</el-table-column>
					</el-table>
				</div>
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
					<!-- <div v-html="checkData(goodsSimple.information)"></div> -->
				</div>
				<div v-if="changeRecordList.length">
					<h3 class="mb20">变更商品记录</h3>
					<p class="check-info">
						<span
							>变更时间：
							{{
								moment(withCords.checkTime).format('YYYY-MM-DD HH:mm:ss')
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

					<!-- <el-button @click="showDetailsTemplate" v-if="templateId"
						>查看运费模板详情</el-button
					> -->
				</div>
			</el-main>
		</el-container>
		<!-- 商品状态  goodsStatus 待审核: 1,4,5,6 审核中: 2, 审核通过: 3 -->
		<div class="save_button">
			<!-- v-if="this.updateWarehouseGroupGoodsByGoodsId" -->
			<el-button
				v-if="Number(withCords.idx + withCords.startIndex) >= 1"
				type="primary"
				@click="OnA('previous')"
				>上一条</el-button
			>
			<el-button type="primary" @click="nextItem('yes')"
				>审核通过，进入下一条</el-button
			>

			<el-button type="primary" @click="nextItem('no')">审核不通过</el-button>
			<el-button type="primary" @click="OnA('next')">下一条</el-button>

			<el-button @click="goList">返回</el-button>
		</div>
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
	getGoodsDetailByGoodsId,
	checkGoodsFromSupplier,
	checkGoodsPrice,
	getChangeOfContrastByGoodsId,
} from '@/api/yhtPlusWebGoods'
import { getYouxuanGoodsAuditListByParam } from '@/api/supplierGoodsAudit'
import Dialog from '@/components/Dialog'
import {
	listCategoryAttributeInfoByCategoryId,
	getGoodsAttributeInfo,
} from '@/api/yhtPlusCmsGoodsCategoryAttribute'
import YxTable from '@wg-vue-materials/yx-table'
import YxForm from '@wg-vue-materials/yx-form'
import { isNull } from '@/utils/helper/common'
import { getBigImg } from '@/utils/imageTool'
import { checkFunctionCode } from '@/utils/auth'
import draggable from 'vuedraggable'
import moment from 'moment'
import UE from '@/components/RichText'
// import detailsTemplate from '../freight/components/detailsTemplate'
// import MyDialog from '@/components/utils/MyDialog'
export default {
	name: 'CommodityAudit',
	components: {
		YxTable,
		Dialog,
		YxForm,
		draggable,
		UE,
		// MyDialog,
		// detailsTemplate,
	},
	data() {
		return {
			moment,
			timeOut: new Date().getTime(),
			information: '',
			/* -------------变更记录----------------- */
			changeRecordList: [], // 变更列表
			clerkName: '', // 变更操作人
			oldList: [],
			newList: [],
			spanOldArr: [],
			spanNewArr: [],
			pos: 0,
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
			/* -------------变更记录----------------- */
			auditLoding: false,
			typeLogding: '',
			categoryList: [], //商品属性
			/* -------------权限----------------- */
			updateWarehouseGroupGoodsByGoodsId: checkFunctionCode(
				'updateWarehouseGroupGoodsByGoodsId'
			),
			/* -------------权限----------------- */
			goodsSimple: {}, // 商品详情
			goodsDetail: [],
			imageList: [], // 图片列表
			goodsSpecList: [], // 商品规格列表
			tableData: [],
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
			formRules: {
				supplyPrice: [
					{
						validator: (rule, value, callback) => {
							const pattern = /^\d+.?\d{0,2}$/
							if (value === '') {
								callback(new Error('比例不能为空'))
							} else {
								if (Number(value) == 1 || Number(value) == 0) {
									callback(new Error('比例不可等于1或者为0'))
								} else if (isNaN(Number(value))) {
									callback(new Error('请输入正确的比例'))
								} else if (!pattern.test(value)) {
									callback(new Error('小数点后最多只能输入两位'))
								}
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			auditBottomBtn: [
				{
					title: '确定,进入下一条',
					type: 'primary',
					click: () => {
						this.auditConfirm()
					},
				},
			],
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
			withCords: {
				goodsId: this.$route.params.goodsId,
				goodsSpecId: this.$route.params.goodsSpecId,
				checkTime: this.$route.params.checkTime * 1,
				idx: this.$route.params.idx,
				oCount: this.$route.params.oCount,
				startIndex: this.$route.params.startIndex,
				goodsSt: this.$route.params.goodsSt,
				goodsStatus: this.$route.query.goodsStatus,
				goodsCategoryId: this.$route.params.goodsCategoryId,
			},

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
		}
	},
	created: function () {
		/* -------------权限----------------- */
		/* -------------权限----------------- */
		this.getInfo()
	},
	computed: {
		previewImageList() {
			return this.imageList.map((item) => {
				return item.imageUrl
			})
		},
	},
	methods: {
		// 获取变更记录
		async _getChangeOfContrastByGoodsId() {
			let {
				data: { resultCode, resultData },
			} = await getChangeOfContrastByGoodsId({
				goodsId: this.withCords.goodsId,
				// goodsSpecId: this.withCords.goodsSpecId,
				goodsNumber: this.goodsSimple.goodsNumber,
			})
			if (resultCode == 0) {
				this.spanArr = []
				let changeRecordList
				let arr = resultData ? Object.keys(resultData) : []
				arr = arr.filter((i) => resultData[i])
				console.log(arr.length, 'aaaaaaaa')
				if (arr.length > 1) {
					changeRecordList = [
						resultData.updateAfterGoodsInfo,
						resultData.updateFrontGoodsInfo,
					]
				} else {
					changeRecordList = []
				}
				// let changeRecordList = resultData || []
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
		oldSystem() {
			window.open(
				`/yhtplus/web/commodityAudit.html?goodsId=${this.withCords.goodsId}&goodsSpecId=${this.withCords.goodsSpecId}&checkTime=${this.withCords.checkTime}&i=${this.withCords.idx}&C=${this.withCords.oCount}&s=${this.withCords.startIndex}&t=${this.withCords.goodsSt}`
			)
		},
		async auditConfirm() {
			if (this.typeLogding == 'yes') {
				let paramJson = {
					lowPrice2: this.auditData.lowPrice2,
					lowPrice1: this.auditData.lowPrice1,
					supplyPrice: this.auditData.supplyPrice,
				}
				paramJson.goodsIdList = [this.withCords.goodsId]
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
					this.OnA('next')
				}
			} else {
				let goodsStatus = parseInt(this.withCords.goodsSt) //审核状态
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
						this.OnA('next')
					}
				} else {
					let paramJson = {}
					paramJson.checkResult = 2
					paramJson.checkReason = this.auditData.checkReason
					paramJson.goodsIdList = [this.withCords.goodsId]
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
						this.OnA('next')
					}
				}
			}
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
		async nextItem(type) {
			this.typeLogding = type
			let goodsStatus = parseInt(this.withCords.goodsSt) //审核状态
			if (type == 'yes') {
				if (goodsStatus == 2) {
					//第一次审核基本信息
					let pams = this.getParamJson()
					let {
						data: { resultCode },
					} = await checkGoodsFromSupplier(pams)
					if (resultCode == 0) {
						this.OnA('next')
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
		//下一条 上一条操作
		async OnA(type) {
			let idx = parseInt(this.withCords.idx) //第X条进的(下标)
			let startIndex = parseInt(this.withCords.startIndex) //第X页
			let goodsStT = parseInt(this.withCords.goodsSt) //审核状态
			let goodsStatus = parseInt(this.withCords.goodsSt)
			let goodsCategoryId = this.withCords.goodsCategoryId
				? parseInt(this.withCords.goodsCategoryId)
				: null
			let nIndex, AstartIndex
			if (goodsStT == goodsStatus) {
				nIndex = idx + startIndex
				AstartIndex = idx
			} else {
				nIndex =
					type == 'previous' ? idx + startIndex - 1 : idx + startIndex + 1 //第X条上一条就减，下一条就加

				AstartIndex = type == 'next' ? idx + 1 : idx - 1
			}
			let param = {
				signField: 1,
				length: 10,
				startIndex: nIndex, //页码
				goodsStatus: goodsStatus, //审核状态
				goodsCategoryId: goodsCategoryId,
				brandIdList: [this.goodsSimple.brandId],
			}
			console.log('第X条进的(下标) :', idx)
			console.log('第X页 :', startIndex)
			console.log('第X条进的 + 第X页 :', AstartIndex)
			console.log('第X条上一条就减，下一条就加:', nIndex)
			console.log('审核状态:', goodsStatus)
			// return
			let {
				data: { resultCode, resultData },
			} = await getYouxuanGoodsAuditListByParam(param)
			if (resultCode == 0) {
				let list = resultData.goodsList
				let goodsCount = resultData.goodsCount
				if (list.length == 0) {
					this.$message.success('该会场商品全部审核完成')
					this.$router.push({ name: 'supplierGoodsAudit' })
					return
				} else {
					this.$store
						.dispatch('tagsView/delVisitedView', this.$route)
						.then(() => {
							this.$router.push({
								path: `/goods/commodityAudit/${list[0].goodsId}/${list[0].goodsSpecId}/${list[0].checkTime}/${AstartIndex}/${goodsCount}/${startIndex}/${goodsStatus}/${goodsCategoryId}`,
							})
						})
				}
			}
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
				goodsId: this.withCords.goodsId,
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
			this.$router.push({ name: 'supplierGoodsAudit' })
		},
		goEdit() {
			/** 编辑商品 **/
			this.$router.push({
				name: 'GoodsEdit',
				params: {
					goodsSpecId: this.goodsSpecId,
					goodsId: this.goodsId,
				},
			})
		},
		getInfo: async function () {
			/** 获取商品详情 **/
			let paramJson = this.withCords
			let {
				data: { resultCode, resultData },
			} = await getGoodsDetailByGoodsId(paramJson)

			if (resultCode === 0) {
				this.goodsSimple = resultData.goodsSimple
				this.information =
					(resultData.goodsSimple && resultData.goodsSimple.information) || ''
				this.goodsDetail = resultData
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
				this._getChangeOfContrastByGoodsId()
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
.check-info span {
	display: inline-block;
	margin-right: 20px;
}
.clerk-title {
	margin: 0;
	text-align: center;
	color: #333333;
	background-color: rgba(153, 153, 153, 1);
	padding: 5px 0;
	margin-top: 20px;
}
</style>

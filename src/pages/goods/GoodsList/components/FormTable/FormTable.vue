<template>
	<basic-container>
		<div class="goods">
			<!-- 会场查询 -->
			<yx-form
				ref="formOne"
				:inline="true"
				:data="searchDataOne"
				:items="searchCfgOne"
				:formAction="searchActionOne"
			/>
			<!-- 商品货号查询 -->
			<yx-form
				ref="formTwo"
				:inline="true"
				:data="searchDataTwo"
				:items="searchCfgTwo"
				:formAction="searchActionTwo"
			>
				<template #keyword>
					<div>
						<el-input
							type="textarea"
							placeholder="请输入货号搜索,货号与货号之间使用逗号隔开或者换行"
							v-model="searchDataTwo.keyword"
						/>
					</div>
				</template>
			</yx-form>
			<p class="goods__no" v-if="notGoodsNumber.length">
				以下货号搜索找不到对应商品：
				<span class="attribute">{{ notGoodsNumber.join('，') }}</span>
			</p>
			<div class="search" ref="venue">
				<yx-form
					ref="form"
					:inline="true"
					:data="searchData"
					:items="searchCfg"
					:formAction="searchAction"
				>
					<template #supplierName>
						<el-select
							v-model="searchSupplier"
							filterable
							remote
							clearable
							placeholder="请输入商家名称"
							value-key="supplierId"
							:remote-method="_supplierPageByInfo"
							><i class="el-icon-search el-input__icon" slot="prefix"> </i>
							<el-option
								v-for="item in formDataSupplierList"
								:key="item.supplierId"
								:label="item.supplierName"
								:value="item"
							>
							</el-option>
						</el-select>
					</template>
					<template #goodsCategoryId>
						<el-cascader
							:options="goodsCategoryList"
							@change="handleChange"
							clearable
							:props="{
								checkStrictly: true,
								children: 'goodsCategoryChildList',
								label: 'goodsCategoryName',
								value: 'goodsCategoryId',
							}"
							ref="cascader"
							placeholder="请选择类目名称"
						></el-cascader>
					</template>

					<template #brandIdList>
						<div
							v-loading="loading"
							class="venue"
							:class="{ bedeck: handleVenueState }"
						>
							<el-checkbox-group
								v-if="moreTitle"
								v-model="searchData.brandIdList"
								@change="handleBrandIdList"
							>
								<el-checkbox
									v-for="item in goodsGroupList"
									:key="item.brandIdCombine"
									:label="item.brandIdCombine"
									>{{ item.brandName }}</el-checkbox
								>
							</el-checkbox-group>
							<el-checkbox-group
								v-else
								v-model="brandIdTwoList"
								@change="handleBrandIdList"
							>
								<el-checkbox
									v-for="(item, index) in goodsGroupTwoList"
									:key="index"
									:label="item.brandId"
									>{{ item.brandName }}</el-checkbox
								>
							</el-checkbox-group>
							<div class="feature" v-if="!handleVenueState">
								<p
									class="active"
									v-if="(flagOneTitle && moreTitle) || goodsGroupCount > 30"
									@click="handleUnfold"
								>
									展开
								</p>
								<p class="active" v-if="moreTitle" @click="_getBrandList">
									更多
								</p>
							</div>
						</div>
						<div class="checked" v-if="handleVenueState">
							<p>已选会场：{{ branditle.join('，') }}</p>
							<p class="checked__btn">
								<el-button type="primary" @click="_getYouxuanGoodsList()"
									>确定</el-button
								>
								<el-button @click="handleCancel">取消</el-button>
							</p>
						</div>
					</template>
				</yx-form>
				<el-button
					v-if="searchData.viewType === '3'"
					style="margin-bottom: 20px"
					type="primary"
					v-auth="
						$route.path === '/goods/goodsList'
							? 'updateGoodsLimitMarkupStatusBatch'
							: 'updateGoodsLimitMarkupStatusBatchHZ'
					"
					@click="volumeLimitMarkUp"
					>批量限制加价</el-button
				>
				<el-radio-group
					class="view"
					v-model="searchData.viewType"
					@change="handleViewType"
				>
					<el-radio-button label="2">规格视图</el-radio-button>
					<el-radio-button label="3">商品视图</el-radio-button>
				</el-radio-group>
			</div>

			<!-- 商品视图 -->
			<yx-table
				v-loading="loading"
				v-show="searchData.viewType === '3'"
				:select="true"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
				:selectionChange="selectionChange"
			>
				<template slot="imageUrl" slot-scope="scope">
					<div class="slot active" @click="skipGoodsDetails(scope.row)">
						<div v-if="!loading">
							<img
								class="goods_img"
								:src="getSmallImg(scope.row.imageUrl)"
								alt=""
							/>
						</div>
						<div>
							<div>
								<span class="number">货号：{{ scope.row.goodsNumber }}</span>
								<el-tag :type="shelfStateMapTag[handleGoodsTag(scope.row)]">{{
									handleGoodsTag(scope.row)
								}}</el-tag>
							</div>
							<div class="goods_name">{{ scope.row.goodsName }}</div>
						</div>
					</div>
				</template>
				<template slot="supplyPrice" slot-scope="scope">
					{{ handleSupplyPrice(scope.row) }}
				</template>
				<template slot="lowestPrice" slot-scope="scope">
					<el-tag
						type="danger"
						v-if="scope.row.highestPrice - scope.row.lowestPrice <= 0"
						>{{ handleLowestPrice(scope.row) }}</el-tag
					>
					<span v-else>{{ handleLowestPrice(scope.row) }}</span>
				</template>
				<template slot="hoverShow" slot-scope="scope">
					<el-link type="primary" @click="toDetail(scope.row)">查看</el-link>
				</template>
				<template slot="marketPrice" slot-scope="scope">
					<el-tag
						type="danger"
						v-if="scope.row.marketPrice - scope.row.lowestPrice <= 0"
						>{{ handleMarketPrice(scope.row) }}</el-tag
					>
					<span v-else>{{ handleMarketPrice(scope.row) }}</span>
				</template>
				<template slot="platformProfit" slot-scope="scope">
					<el-tag v-if="scope.row.platformProfit < 10">{{
						scope.row.platformProfit > 0
							? handlePlatformProfit(scope.row.platformProfit)
							: '-'
					}}</el-tag>
					<span v-else>{{
						scope.row.platformProfit > 0
							? handlePlatformProfit(scope.row.platformProfit)
							: '-'
					}}</span>
				</template>
				<template slot="shopProfit" slot-scope="scope">
					<el-tag v-if="scope.row.shopProfit < 10">{{
						scope.row.shopProfit > 0
							? handlePlatformProfit(scope.row.shopProfit)
							: '-'
					}}</el-tag>
					<span v-else>{{
						scope.row.shopProfit > 0
							? handlePlatformProfit(scope.row.shopProfit)
							: '-'
					}}</span>
				</template>
			</yx-table>

			<!-- 规格视图 -->
			<yx-table
				v-show="searchData.viewType === '2'"
				:select="true"
				:columns="tableColumnsTwo"
				:pagination="pageTwo"
				:data="tableTwoData"
				:span-method="objectSpanMethod"
				:selectionChange="selectionChange"
			>
				<template slot="imageUrl" slot-scope="scope">
					<div class="slot">
						<div>
							<img
								class="goods_img"
								:src="getSmallImg(scope.row.imageUrl)"
								alt=""
							/>
						</div>
						<div>
							<div>
								<span class="number">货号：{{ scope.row.goodsNumber }}</span>
								<el-tag :type="shelfStateMapTag[handleGoodsTag(scope.row)]">{{
									handleGoodsTag(scope.row)
								}}</el-tag>
							</div>
							<div class="goods_name">{{ scope.row.goodsName }}</div>
						</div>
					</div>
				</template>
				<template slot="hoverShow" slot-scope="scope">
					<el-link type="primary" @click="toDetail(scope.row)">查看</el-link>
				</template>
				<template slot="supplyPrice" slot-scope="scope">
					{{ handleSupplyPrice(scope.row) }}
				</template>
				<template slot="lowestPrice" slot-scope="scope">
					<el-tag
						type="danger"
						v-if="scope.row.highestPrice - scope.row.lowestPrice <= 0"
						>{{ handleLowestPrice(scope.row) }}</el-tag
					>
					<span v-else>{{ handleLowestPrice(scope.row) }}</span>
				</template>
				<template slot="marketPrice" slot-scope="scope">
					<el-tag
						type="danger"
						v-if="scope.row.marketPrice - scope.row.lowestPrice <= 0"
						>{{ handleMarketPrice(scope.row) }}</el-tag
					>
					<span v-else>{{ handleMarketPrice(scope.row) }}</span>
				</template>
				<template slot="platformProfit" slot-scope="scope">
					<el-tag v-if="scope.row.platformProfit < 10">{{
						scope.row.platformProfit > 0
							? handlePlatformProfit(scope.row.platformProfit)
							: '-'
					}}</el-tag>
					<span v-else>{{
						scope.row.platformProfit > 0
							? handlePlatformProfit(scope.row.platformProfit)
							: '-'
					}}</span>
				</template>
				<template slot="shopProfit" slot-scope="scope">
					<el-tag v-if="scope.row.shopProfit < 10">{{
						scope.row.shopProfit > 0
							? handlePlatformProfit(scope.row.shopProfit)
							: '-'
					}}</el-tag>
					<span v-else>{{
						scope.row.shopProfit > 0
							? handlePlatformProfit(scope.row.shopProfit)
							: '-'
					}}</span>
				</template>
			</yx-table>
			<Dialog
				title="批量限制加价"
				:visible.sync="limitPrice"
				width="500px"
				:bottomBtn="limitPriceBottomBtn"
			>
				<template>
					是否批量限制加价
					<el-radio v-model="limitPriceRadio" label="1">是</el-radio>
					<el-radio v-model="limitPriceRadio" label="0">否</el-radio>
				</template>
			</Dialog>
			<Dialog
				:title="contentNumber === 1 ? '平台加价' : '佣金加价'"
				:visible.sync="platformPriceVisible"
				width="500px"
				:bottomBtn="platformPriceBottomBtn"
			>
				<div class="mb20">
					{{
						contentNumber === 1
							? '平台加价操作可调整商品定价，为平台提升利润。'
							: '佣金加价部分为店主+服务商总金额'
					}}
				</div>
				<div v-if="contentNumber === 2" class="mb20">
					需要特别留意，若有商品参与<span style="color: #ff0000"
						>佣金膨胀等活动</span
					>，会导致派发奖励增加
				</div>
				<div class="mb20">
					<span style="color: #ff4949; margin-right: 4px">*</span>
					加价方式：
					<el-radio @change="priceChange" v-model="priceWayRadio" label="1"
						>比例</el-radio
					>
					<el-radio @change="priceChange" v-model="priceWayRadio" label="2"
						>金额</el-radio
					>
				</div>
				<yx-form
					ref="amountDialog"
					labelWidth="100px"
					:data="amountFormData"
					:items="amountFormCfg"
					:rules="amountFormRules"
				>
					<template #premiumAmount>
						<el-input
							v-model="amountFormData.premiumAmount"
							style="width: 150px"
							type="number"
							placeholder="请输入"
						>
						</el-input>
						<span class="" style="padding: 10px">{{
							priceWayRadio == 1 ? '%' : '元'
						}}</span>
					</template>
				</yx-form>
			</Dialog>
			<!-- 批量驳回商品 -->
			<batch-reject-goods-dialog
				:selectionData="selectionData"
				:visible.sync="batchRejectGoodsDialog"
				:batchRejectGoodsId="batchRejectGoodsId"
				@fatherMethodInit="_getYouxuanGoodsList"
			/>

			<!-- 导出商品列表 -->
			<educe-goods-list-dialog
				:exportSpecData="exportSpecData"
				:visible.sync="educeGoodsListDialog"
			/>
		</div>
		<!-- <picture-text-dialog
			:visible.sync="pictureTextDialog"
			:pictureTextRow="pictureTextRow"
			@Refresh="Refresh"
		></picture-text-dialog> -->
		<material-pt-dialog
			:visible.sync="materialPtDialog"
			:materialPtRow="materialPtRow"
			@Refresh="Refresh"
		></material-pt-dialog>
		<!-- 七天无理由 -->
		<el-dialog
			title="批量设置七天无理由"
			:visible.sync="dialogVisible"
			width="30%"
			:before-close="cancelSevenDaysNotReason"
		>
			<div>
				<h3>已选中{{ selectionData.length }}个商品</h3>
				说明：
				<p class="indent">
					1、可无视平台类目对于七天无理由的要求，直接对商品生效。请谨慎操作！
				</p>
				<p class="indent">2、上架状态的商品不生效。</p>
			</div>
			<el-form
				:model="ruleForm"
				:rules="rules"
				ref="ruleForm"
				label-width="100px"
				class="demo-ruleForm"
			>
				<el-form-item
					label="选择是否支持七天无理由："
					prop="sevenWithoutReason"
					label-width="200px"
				>
					<el-select
						v-model="ruleForm.sevenWithoutReason"
						placeholder="请选择是否支持七天无理由"
					>
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<!-- <el-select v-model="value" placeholder="请选择">
				<el-option
					v-for="item in options"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				>
				</el-option>
			</el-select> -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancelSevenDaysNotReason">取 消</el-button>
				<el-button type="primary" @click="handleSevenDaysNotReason('ruleForm')"
					>确 定</el-button
				>
			</span>
		</el-dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import BatchRejectGoodsDialog from '../components/BatchRejectGoodsDialog'
import EduceGoodsListDialog from '../components/EduceGoodsListDialog'
import Dialog from '@/components/Dialog'
import { goodsEnableCategoryTree } from '@/api/grossMargins'
import MaterialPtDialog from './MaterialPtDialog'
import { queryNotSelfBrandSupplierAccountIds } from '@/api/brandRecord'
import { isNull } from '@/utils/helper/common'
import {
	removeGoodsRedis,
	getYouxuanGoodsNumberList,
	// getYouxuanGoodsList,
	// getYouxuanGoodsListByHZ,
	yxGoodsList,
	hzYxGoodsList,
	deleteGroupGoods,
	batchDeleteGoodsSpec,
	goodsOnOffShelves,
	supplierPageByInfo,
	exportUpdateGoodsPrice,
	exportGoodsOfPassDetails,
	exportGoodsOfPassDetailsByHz,
	commissionAdjustmentByGoods,
	platformAdjustmentByGoods,
	platformAdjustmentByHZGoods,
	commissionAdjustmentByHZGoods,
	updateGoodsLimitMarkupStatusBatch,
	handleSevenDaysWithoutReason,
} from '@/api/goodsList'
import { getBrandList } from '@/api/brand'
import { getGoodsGroupListByConditionWithoutPrivilege } from '@/api/goodsGroup'
import { batchFixPrice } from '@/api/yhtPlusWebGoods'

import { getSmallImg } from '@/utils/imageTool'
import { retainDecimalPoint, downloadFile, accSub } from '@/utils/helper/common'
import moment from 'moment'
import { checkFunctionCode } from '@/utils/auth'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		EduceGoodsListDialog,
		BatchRejectGoodsDialog,
		// EchartsPopover,
		MaterialPtDialog,
		Dialog,
	},
	name: 'FormTable',

	data() {
		return {
			// 七天无理由
			ruleForm: {
				sevenWithoutReason: '',
			},
			rules: {
				sevenWithoutReason: [
					{
						required: true,
						message: '请选择是否支持七天无理由',
						trigger: 'change',
					},
				],
			},
			options: [
				{
					value: 1,
					label: '不支持',
				},
				{
					value: 2,
					label: '支持',
				},
			],
			dialogVisible: false,
			accSub: accSub,
			pictureTextRow: {},
			pictureTextDialog: false,
			materialPtDialog: false,
			limitPrice: false,
			limitPriceRadio: '1',
			limitPriceBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						// 规则校验通过
						this.volumeLimitMarkUpSubmitForm()
					},
				},
			],
			materialPtRow: {},
			goodsCategoryList: [], //商品类目
			goodsCategoryListAuth: checkFunctionCode('goodsCategoryTree'), //商品类目权限
			goodsCostPrice: !checkFunctionCode('goodsCostPrice'),
			exportGoodsOfPassDetails: !checkFunctionCode('exportGoodsOfPassDetails'),
			exportGoodsOfPassDetailsByHz: !checkFunctionCode(
				'exportGoodsOfPassDetailsByHz'
			),
			queryGoodsPriceComparisonDetail: checkFunctionCode(
				'queryGoodsPriceComparisonDetail'
			),
			//S平台加价/调价
			priceWayRadio: '1',
			premiumAmount: '0',
			contentNumber: null,
			platformPriceVisible: false,
			priceRow: {},
			platformPriceBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.amountDialog.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.priceSubmitForm()
							}
						})
					},
				},
			],
			//E平台加价/调价
			brandIdListTemp: [],
			notGoodsNumber: [],
			searchDataOne: {
				brandNameKeyword: '', // 会场名称
			},
			searchDataTwo: {
				keyword: '', // 商品货号
			},
			searchData: {
				brandNameKeyword: '', // 会场名称
				goodsName: '',
				time: '',
				shelvesTimeStart: '', // 上架开始时间
				shelvesTimeEnd: '', // 上架结束时间
				supplierName: '', // 商家
				shelfState: '', // 上下架状态 -- 重构之后默认改为全部
				selfStatus: '0', // 销售状态
				sortField: '1', // 排序
				viewType: '3', // 视图类型
				goodsStatus: 3,
				brandIdList: [], // 是否会场多选
			},
			// 搜索商家数据源
			searchSupplier: {},
			formDataSupplierList: [],
			pos: '',
			spanArr: [],
			brandIdTwoList: [],
			goodsGroupTwoList: [],
			brandIdNamber: false,
			loading: false,
			loadingForm: false,
			batchRejectGoodsDialog: false, // 批量驳回商品弹窗
			educeGoodsListDialog: false, // 导出商品列表弹窗
			exportSpecData: {}, // 编辑类目弹窗
			orderStatus: [],
			selectionData: [],
			branditle: [], // 已选会场
			moreTitle: true,
			flagOneTitle: false,
			flagTwoTitle: false,
			flagUnfold: false,
			amountFormData: {
				premiumAmount: '',
			},
			amountFormRules: {
				premiumAmount: [
					{
						required: true,
						message: '请输入数值，且数值至多保留两位小数',
						trigger: ['blur', 'change'],
						pattern: /^((((?!0)\d+)|(0{1}))(.\d{1,2})?)$/,
					},
				],
			},
			amountFormCfg: [
				{
					title: '加价比例',
					type: 'custom',
					dataIndex: 'premiumAmount',
				},
			],
			searchCfgOne: [
				{
					title: '会场名称',
					dataIndex: 'brandNameKeyword',
					placeholder: '请输入会场名称',
				},
			],
			searchCfgTwo: [
				{
					title: '商品货号',
					type: 'textarea',
					dataIndex: 'keyword',
					placeholder: '请输入货号搜索,货号与货号之间使用逗号隔开或者换行',
				},
			],
			searchCfg: [
				{
					type: 'select',
					title: '商品状态',
					dataIndex: 'shelfState',
					label: 'value',
					options: [
						{
							shelfState: '',
							value: '全部',
						},
						{
							shelfState: '2',
							value: '上架',
						},
						{
							shelfState: '1',
							value: '下架',
						},
					],
					change: () => {
						this._getYouxuanGoodsList()
					},
				},
				{
					type: 'select',
					title: '销售状态',
					dataIndex: 'selfStatus',
					label: 'value',
					options: this.$store.state.app.constant.SALE_STATE,
				},
				{
					type: 'select',
					title: '排序',
					dataIndex: 'sortField',
					label: 'value',
					options: this.$store.state.app.constant.GOODS_SORT,
					change: () => {
						this._getYouxuanGoodsList()
					},
				},
				{
					type: 'time',
					title: '上架时间',
					dataIndex: 'time',
					timeAttributes: {
						type: 'datetimerange',
						defaultTime: ['00:00:00', '23:59:59'],
					},
				},
				{
					title: '商品名称',
					dataIndex: 'goodsName',
					placeholder: '请输入商品名称',
				},
				{
					title: '商家',
					type: 'custom',
					dataIndex: 'supplierName',
				},
				{
					title: '商品类目',
					type: 'custom',
					hide: this.goodsCategoryListAuth,
					dataIndex: 'goodsCategoryId',
				},
				{
					title: '会场',
					type: 'custom',
					dataIndex: 'brandIdList',
					class: 'brand-list',
				},
			],
			searchAction: [
				{
					title: '广州批量修改商品价格',
					auth: '',
					type: 'primary',
					click: () => {
						this.$router.push({
							path: `/goods/batchesModifyPrices/${this.handleJurisdictionTwo()}`,
						})
					},
					customRender: (action) => {
						action.title = this.handleJurisdictionTwo()
							? '杭州批量修改商品价格'
							: '广州批量修改商品价格'
						return action
					},
				},
				{
					title: '批量定价',
					type: 'primary',
					auth: 'batchFixPrice',
					customRender: (action) => {
						if (
							this.searchData.viewType === '2' ||
							this.handleJurisdictionTwo()
						) {
							action.hide = true
						} else {
							action.hide = false
						}
						return action
					},
					click: () => {
						this.handleBatchFixPrice()
					},
				},
				{
					title: '批量导出修改价格',
					type: 'primary',
					auth: 'exportUpdateGoodsPrice',
					click: () => {
						this.batchDeriveEditPrice()
					},
				},
				{
					title: '批量驳回商品',
					type: 'primary',
					auth: 'rejectGoods',
					customRender: (action) => {
						action.hide = this.searchData.viewType === '2'
						return action
					},
					click: () => {
						this.handleBatchRejectGoods(1, null)
					},
				},
				{
					title: '批量导出',
					// auth: 'exportGoodsOfPassDetails',exportGoodsOfPassDetailsByHz
					type: 'primary',
					click: () => {
						this.handleBatchForbidden()
					},
					customRender: (action) => {
						action.hide =
							(this.handleJurisdictionTwo() && !exportGoodsOfPassDetailsByHz) ||
							(!this.handleJurisdictionTwo() && !exportGoodsOfPassDetails)
						return action
					},
				},
				{
					title: '同步到小程序',
					type: 'primary',
					click: () => {
						this._removeGoodsRedis()
					},
				},
				{
					title: '批量上架',
					type: 'success',
					auth: 'batchOperateGoodsList',
					click: () => {
						this._goodsOnOffShelves(2)
					},
				},
				{
					title: '批量下架',
					type: 'warning',
					auth: 'batchOperateGoodsList',
					click: () => {
						this._goodsOnOffShelves(1)
					},
				},
				{
					title: '批量删除',
					type: 'danger',
					auth: 'batchDeleteOrganizationSpec',
					customRender: (action) => {
						action.hide = this.searchData.viewType === '3'
						return action
					},
					click: () => {
						this._batchDeleteGoodsSpec({}, 3)
					},
				},
				{
					title: '批量设置七天无理由',
					type: 'primary',
					auth: 'reasonConfigSaveOrUpdate',
					// customRender: (action) => {
					// 	action.hide = this.searchData.viewType === '3'
					// 	return action
					// },
					click: () => {
						this.sevenDaysNotReason()
					},
				},
			],
			searchActionOne: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getGoodsGroupListByConditionForCMS(2)
					},
				},
			],
			searchActionTwo: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getYouxuanGoodsList()
					},
				},
				{
					title: '重置',
					click: () => {
						this.notGoodsNumber = []
						this.$refs.form.$refs.YxForm.resetFields()
						this.$refs.formOne.$refs.YxForm.resetFields()
						this.$refs.formTwo.$refs.YxForm.resetFields()
					},
				},
			],
			goodsGroupCount: 0,
			tableData: [],
			tableTwoData: [],
			goodsGroupList: [],
			goodsGroupListMap: {},
			getSmallImg: getSmallImg,
			batchRejectGoodsId: {},
			pathFlag: false,
			retainDecimalPoint: retainDecimalPoint,
			tableColumns: [
				{
					width: 300,
					type: 'custom',
					dataIndex: 'imageUrl',
					title: '商品',
				},
				{
					width: 100,
					dataIndex: 'brandName',
					title: '会场名称',
				},
				{
					dataIndex: 'supplierName',
					title: '商家',
				},
				{
					width: 170,
					dataIndex: 'goodsAllCategoryName',
					title: '商品类目',
				},
				{
					dataIndex: 'costPrice',
					title: '结算价',
					renderHeader: (h, { column }) => {
						return this.renderHeader(
							h,
							{ column },
							'商品完成销售后，平台与商家的结算价格。'
						)
					},
					customRender: (row) => {
						if (row.marketPrice > 0) {
							return `￥${retainDecimalPoint(row.costPrice, 2)}`
						} else {
							return '-'
						}
					},
				},
				{
					width: 100,
					type: 'custom',
					dataIndex: 'supplyPrice',
					title: '供货价',
					customRender: (row) => {
						return this.handleSupplyPrice(row)
					},
					renderHeader: (h, { column }) => {
						return this.renderHeader(
							h,
							{ column },
							'商品展示给平台店主的供货价格。'
						)
					},
				},
				{
					width: 140,
					dataIndex: 'supplierPrice',
					title: '商家建议销售价',
					renderHeader: (h, { column }) => {
						return this.renderHeader(
							h,
							{ column },
							'商家提供的最低建议销售价。'
						)
					},
					customRender: (row) => {
						return `￥${retainDecimalPoint(row.supplierPrice, 2)}`
					},
				},
				{
					width: 140,
					type: 'custom',
					dataIndex: 'lowestPrice',
					title: '建议最低零售价',
					renderHeader: (h, { column }) => {
						return this.renderHeader(
							h,
							{ column },
							'商品在平台正常销售的价格，以此价格进行销售最具性价比。'
						)
					},
				},
				{
					width: 120,
					type: 'custom',
					dataIndex: 'marketPrice',
					title: '市场价',
					renderHeader: (h, { column }) => {
						return this.renderHeader(h, { column }, [
							'1.划线价必须有依据，可以是吊牌价或品牌官网售价等价格；',
							'2.请商家务必妥善保存划线价定价依据以备查。抽检时如无法提供的，将被平台或政府处罚；',
							'3.平台鼓励商家在商品详情页对“划线价”的含义及定价依据进行准确说明。',
						])
					},
				},
				{
					width: 80,
					dataIndex: 'platformAdjustmentValue',
					title: '平台加价',
					customRender: (row) => {
						// 1、比例 2、金额
						if (row.goodsFixedPriceRecordBO) {
							if (row.goodsFixedPriceRecordBO.platformAdjustmentType == 1) {
								return row.goodsFixedPriceRecordBO.platformAdjustmentValue + '%'
							} else if (
								row.goodsFixedPriceRecordBO.platformAdjustmentType == 2
							) {
								return `￥${retainDecimalPoint(
									row.goodsFixedPriceRecordBO.platformAdjustmentValue,
									2
								)}`
							} else {
								return '-'
							}
						} else {
							return '-'
						}
					},
				},
				{
					width: 80,
					dataIndex: 'commissionAdjustmentValue',
					title: '佣金加价',
					customRender: (row) => {
						// 1、比例 2、金额
						if (row.goodsFixedPriceRecordBO) {
							if (row.goodsFixedPriceRecordBO.commissionAdjustmentType == 1) {
								return (
									row.goodsFixedPriceRecordBO.commissionAdjustmentValue + '%'
								)
							} else if (
								row.goodsFixedPriceRecordBO.commissionAdjustmentType == 2
							) {
								return `￥${retainDecimalPoint(
									row.goodsFixedPriceRecordBO.commissionAdjustmentValue,
									2
								)}`
							} else {
								return '-'
							}
						} else {
							return '-'
						}
					},
				},
				{
					width: 120,
					type: 'custom',
					hide: this.queryGoodsPriceComparisonDetail,
					dataIndex: 'hoverShow',
					title: '销售价近期趋势',
				},
				{
					width: 110,
					type: 'custom',
					dataIndex: 'platformProfit',
					title: '利润率（平台）',
				},
				{
					width: 120,
					dataIndex: 'platformProfitValue',
					title: '利润值（平台）',
					customRender: (row) => {
						return row.platformProfitValue > 0 ? row.platformProfitValue : '-'
					},
				},
				{
					width: 110,
					type: 'custom',
					dataIndex: 'shopProfit',
					title: '利润率(分佣）',
				},

				{
					width: 120,
					dataIndex: 'shopProfitValue',
					title: '利润值（分佣）',
					customRender: (row) => {
						return row.shopProfitValue > 0 ? row.shopProfitValue : '-'
					},
				},
				{
					width: 120,
					dataIndex: 'adviceCommissionRate',
					title: '建议分佣率',
					customRender: (row) => {
						return row.adviceCommissionRate > 0
							? `${row.adviceCommissionRate}%`
							: '-'
					},
				},
				{
					width: 90,
					dataIndex: 'realGrossMargins',
					title: '实际毛利率',
					customRender: (row) => {
						return row.realGrossMargins ? `${row.realGrossMargins}%` : '-'
					},
				},
				{
					width: 110,
					dataIndex: 'rateValue',
					title: '提佣值（杭州）',
					customRender: (row) => {
						return row.rateValue > 0 ? row.rateValue : '-'
					},
				},
				{
					dataIndex: 'rate',
					title: '分佣比例',
					hide: this.$route.path !== '/goods/goodsPrice',
					customRender: (row) => {
						return row.rate ? `${row.rate}%` : '-'
					},
				},
				{
					dataIndex: 'totalStock',
					title: '库存',
				},
				{
					dataIndex: 'sortOrder',
					title: '排序',
				},
				{
					width: 135,
					type: 'data',
					dataIndex: 'shelvesTime',
					title: '上架时间',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					fixed: 'right',
					actions: [
						{
							title: '编辑',
							auth: 'updateGroupGoodsByGoodsId',
							click: (row) => {
								this.$router.push({
									path: `/goods/GoodsEdit/${row.goodsSpecId}/${row.shelfState}/${row.goodsId}`,
								})
							},
						},

						{
							title: '删除',
							auth: 'batchDeleteOrganizationSpec',
							click: (row) => {
								this._deleteGroupGoods(row)
							},
						},
						{
							title: '驳回',
							auth: 'rejectGoods',
							click: (row) => {
								this.handleBatchRejectGoods(2, row.goodsId)
							},
							customRender: (action, row) => {
								action.hide = row.forbidden == '命中非自有品牌'
								return action
							},
						},
						{
							title: '平台加价',
							dialogId: 105,
							click: (row) => {
								this.platformPrice(row, 1)
							},
							customRender: (action, row) => {
								let path = this.$route.path === '/goods/goodsList'
								action.hide =
									row.shelfState == 2 ||
									(path && !checkFunctionCode('platformAdjustmentByGoods')) ||
									(!path && !checkFunctionCode('platformAdjustmentByHZGoods'))
								return action
							},
						},
						{
							title: '佣金加价',
							dialogId: 105,
							click: (row) => {
								this.platformPrice(row, 2)
							},
							customRender: (action, row) => {
								let path = this.$route.path === '/goods/goodsList'
								action.hide =
									row.shelfState == 2 ||
									(path && !checkFunctionCode('commissionAdjustmentByGoods')) ||
									(!path && !checkFunctionCode('commissionAdjustmentByHZGoods'))
								return action
							},
						},
					],
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getYouxuanGoodsList()
				},
			},
			pageTwo: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getYouxuanGoodsList()
				},
			},
			tableColumnsTwo: [
				{
					width: 300,
					type: 'custom',
					dataIndex: 'imageUrl',
					title: '商品',
				},
				{
					width: 100,
					dataIndex: 'brandName',
					title: '会场名称',
				},
				{
					dataIndex: 'specOne',
					title: '颜色',
				},
				{
					dataIndex: 'specTwo',
					title: '尺码',
					customRender: (row) => {
						return row.specTwo ? row.specTwo : '-'
					},
				},
				{
					dataIndex: 'costPrice',
					title: '结算价',
					renderHeader: (h, { column }) => {
						return this.renderHeader(
							h,
							{ column },
							'商品完成销售后，平台与商家的结算价格。'
						)
					},
					customRender: (row) => {
						return `￥${retainDecimalPoint(row.costPrice, 2)}`
					},
				},
				{
					width: 100,
					type: 'custom',
					dataIndex: 'supplyPrice',
					title: '供货价',
					customRender: (row) => {
						return this.handleSupplyPrice(row)
					},
					renderHeader: (h, { column }) => {
						return this.renderHeader(
							h,
							{ column },
							'商品展示给平台店主的供货价格。'
						)
					},
				},
				{
					width: 140,
					dataIndex: 'supplierPrice',
					title: '商家建议销售价',
					renderHeader: (h, { column }) => {
						return this.renderHeader(
							h,
							{ column },
							'商家提供的最低建议销售价。'
						)
					},
					customRender: (row) => {
						return `￥${retainDecimalPoint(row.supplierPrice, 2)}`
					},
				},
				{
					width: 140,
					type: 'custom',
					dataIndex: 'lowestPrice',
					title: '建议最低零售价',
					renderHeader: (h, { column }) => {
						return this.renderHeader(
							h,
							{ column },
							'商品在平台正常销售的价格，以此价格进行销售最具性价比。'
						)
					},
				},
				{
					width: 120,
					type: 'custom',
					dataIndex: 'marketPrice',
					title: '市场价',
					renderHeader: (h, { column }) => {
						return this.renderHeader(h, { column }, [
							'1.划线价必须有依据，可以是吊牌价或品牌官网售价等价格；',
							'2.请商家务必妥善保存划线价定价依据以备查。抽检时如无法提供的，将被平台或政府处罚；',
							'3.平台鼓励商家在商品详情页对“划线价”的含义及定价依据进行准确说明。',
						])
					},
				},
				{
					dataIndex: 'totalStock',
					title: '库存',
				},
				{
					width: 120,
					type: 'custom',
					hide: this.queryGoodsPriceComparisonDetail,
					dataIndex: 'hoverShow',
					title: '销售价近期趋势',
				},
				{
					type: 'action',
					title: '操作',
					width: '100',
					actions: [
						{
							title: '删除',
							auth: 'batchDeleteOrganizationSpec',
							click: (row) => {
								this._batchDeleteGoodsSpec(row, 2)
							},
						},
					],
				},
			],
			shelfStateMapTag: {
				在售: 'warning',
				待售: 'info',
				下架: 'info',
				推荐: 'danger',
			},
			costPriceTag: '',
		}
	},

	computed: {
		handleVenueState() {
			return !this.moreTitle || this.flagUnfold
		},
	},

	created() {
		this.handleJurisdiction()
		if (checkFunctionCode('goodsCategoryTree')) {
			this.getGoodsCategoryList() // 获取商品类目
		}
		this._getGoodsGroupListByConditionForCMS()
		this.tableColumns.forEach((item) => {
			if (item.dataIndex == 'costPrice') {
				item.hide = this.goodsCostPrice
			}
			if (item.dataIndex == 'rate') {
				item.hide = !this.handleJurisdictionTwo()
			}
			if (item.dataIndex == 'rateValue') {
				item.hide = !this.handleJurisdictionTwo()
			}
			if (item.dataIndex == 'supplierPrice') {
				item.hide = this.handleJurisdictionTwo()
			}
			if (item.dataIndex == 'platformAdjustmentValue') {
				item.hide = this.handleJurisdictionTwo()
			}
			if (item.dataIndex == 'commissionAdjustmentValue') {
				item.hide = this.handleJurisdictionTwo()
			}
			return item
		})
		this.tableColumnsTwo.forEach((item) => {
			if (item.dataIndex == 'costPrice') {
				item.hide = this.goodsCostPrice
			}
			if (item.dataIndex == 'supplierPrice') {
				item.hide = this.handleJurisdictionTwo()
			}
			if (item.dataIndex == 'platformAdjustmentValue') {
				item.hide = this.handleJurisdictionTwo()
			}
			if (item.dataIndex == 'commissionAdjustmentValue') {
				item.hide = this.handleJurisdictionTwo()
			}
			return item
		})
	},

	methods: {
		priceChange(e) {
			//平台加价切换加价方式回显值
			if (this.contentNumber == 1) {
				if (e == this.priceRow.platformAdjustmentType) {
					this.amountFormData.premiumAmount = this.priceRow.platformAdjustmentValue
				} else {
					this.amountFormData.premiumAmount = '0'
				}
				//佣金加价切换加价方式回显值
			} else if (this.contentNumber == 2) {
				if (e == this.priceRow.commissionAdjustmentType) {
					this.amountFormData.premiumAmount = this.priceRow.commissionAdjustmentValue
				} else {
					this.amountFormData.premiumAmount = '0'
				}
			}
			if (e == 1) {
				this.amountFormCfg[0].title = '加价比例'
				if (this.amountFormData.premiumAmount > 20) {
					this.amountFormData.premiumAmount = 20
					return this.$message.warning('加价比例最大值为20')
				}
			}
			if (e == 2) {
				this.amountFormCfg[0].title = '加价金额'
				if (this.amountFormData.premiumAmount > 500) {
					this.amountFormData.premiumAmount = 500
					return this.$message.warning('，加价金额最大值为500')
				}
			}
		},
		platformPrice(row, v) {
			row.goodsFixedPriceRecordBO = row.goodsFixedPriceRecordBO || {}
			if (v == 1) {
				this.priceWayRadio = row.goodsFixedPriceRecordBO.platformAdjustmentType
					? String(row.goodsFixedPriceRecordBO.platformAdjustmentType)
					: '1'
				this.amountFormData.premiumAmount =
					row.goodsFixedPriceRecordBO.platformAdjustmentValue
			} else {
				this.priceWayRadio = row.goodsFixedPriceRecordBO
					.commissionAdjustmentType
					? String(row.goodsFixedPriceRecordBO.commissionAdjustmentType)
					: '1'
				this.amountFormData.premiumAmount =
					row.goodsFixedPriceRecordBO.commissionAdjustmentValue
			}
			this.platformPriceVisible = true
			this.contentNumber = v
			this.priceRow = {
				...row.goodsFixedPriceRecordBO,
				...row,
			}
			console.log('this.priceRow--', this.priceRow)
		},
		// 确定
		async priceSubmitForm() {
			if (
				this.priceWayRadio == 1 &&
				(this.amountFormData.premiumAmount > 20 ||
					this.amountFormData.premiumAmount < 0)
			) {
				this.$message.warning('比例最大值不可大于20且不可小于0')
				return
			}
			if (
				this.priceWayRadio == 2 &&
				(this.amountFormData.premiumAmount > 500 ||
					this.amountFormData.premiumAmount < 0)
			) {
				this.$message.warning('比例最大值不可大于500且不可小于0')
				return
			}
			let paramJson = {
				goodsId: this.priceRow.goodsId,
				goodsNumber: this.priceRow.goodsNumber,
				supplierId: this.priceRow.supplierId,
				clerkId: this.$store.state.user.userInfo.clerkId,
				clerkName: this.$store.state.user.userInfo.clerkName,
			}
			let Url
			if (this.contentNumber == 1) {
				paramJson.platformAdjustmentType = this.priceWayRadio
				paramJson.platformAdjustmentValue = this.amountFormData.premiumAmount
				Url = this.handleJurisdictionTwo()
					? platformAdjustmentByHZGoods
					: platformAdjustmentByGoods
			} else {
				paramJson.commissionAdjustmentType = this.priceWayRadio
				paramJson.commissionAdjustmentValue = this.amountFormData.premiumAmount
				Url = this.handleJurisdictionTwo()
					? commissionAdjustmentByHZGoods
					: commissionAdjustmentByGoods
			}
			this.$confirm(
				'确认后，可在平台调价记录列表进行查看处理状态',
				'是否确认',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			).then(async () => {
				let {
					data: { resultCode },
				} = await Url(paramJson)
				if (resultCode == 0) {
					this.$message({
						type: 'success',
						message: '成功!',
					})
					this.platformPriceVisible = false
					this._getYouxuanGoodsList(true)
				}
			})
		},
		toDetail(options) {
			let json = {}
			if (options.supplierAccountNumberId) {
				json.supplierAccountNumberId = options.supplierAccountNumberId
			} else if (options.supplierId) {
				json.supplierId = options.supplierId
			}
			this.$router.push({
				path: `goodsPriceDetails/${encodeURIComponent(options.goodsNumber)}`,
				query: json,
			})
		},
		queryNotSelfBrandSupplierAccountIds: async function () {
			let {
				data: { resultCode = 0, resultData = [] },
			} = await queryNotSelfBrandSupplierAccountIds({})
			if (resultCode == 0) {
				//供应商账号id,只要判断有包含的，就是非自有品牌
				if (resultData.length > 0) {
					resultData.map((item) => {
						this.tableData.forEach((v) => {
							if (item == v.supplierAccountNumberId) {
								this.$set(v, 'forbidden', '命中非自有品牌')
							} else {
								v.forbidden = null
							}
							return v
						})
					})
				}
				console.log('是否匹配到非自有品牌:', this.tableData, resultData)
			}
		},
		Refresh() {
			this._getYouxuanGoodsList()
		},
		handleEdit(row) {
			this.materialPtDialog = true
			this.materialPtRow = row
			// this.pictureTextRow = row
			// this.pictureTextDialog = true
		},
		getGoodsCategoryList: async function () {
			let {
				data: { resultCode = 0, resultData = [] },
			} = await goodsEnableCategoryTree()
			if (resultCode == 0) {
				this.goodsCategoryList = this.mapAll(resultData.goodsCategoryList)
			}
		},
		//数据过滤，三级后去掉子级，可以选中
		mapAll(options) {
			return options.map((item) => {
				//最高三级，清除第三级后面的数组，组件就可以选中
				if (item.goodsCategoryLevel === 3) {
					item.goodsCategoryChildList = null
				}
				if (
					item.goodsCategoryChildList &&
					item.goodsCategoryChildList.length > 0
				) {
					this.mapAll(item.goodsCategoryChildList)
				}
				return item
			})
		},
		renderHeader(h, { column }, tip) {
			let arr = typeof tip === 'string' ? [tip] : tip
			// 表头提示
			return h('div', [
				h('span', column.label),
				h(
					'el-tooltip',
					{
						props: {
							effect: 'dark',
							content: [
								h(
									'div',
									arr.map((item) => {
										return h('p', item)
									})
								),
							],
							placement: 'top',
						},
					},
					[
						h('i', {
							class: 'el-icon-question',
							style: 'color:#409EFF;margin-left:5px;',
						}),
					]
				),
			])
		},
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			let { selfStatus, brandIdList, viewType } = this.searchData
			const searchDataTwo = this.handleNoParams()
			const tempBrandIdList = this.handleVenueParams(brandIdList)
			const paramsData = JSON.parse(JSON.stringify(this.searchData))
			const time = this.handlePutawayDate(paramsData.time)
			const paramJson = Object.assign(paramsData, {
				startIndex:
					viewType === '3'
						? (this.page.currentPage - 1) * this.page.length
						: (this.pageTwo.currentPage - 1) * this.pageTwo.length,
				length: this.page.length,
				pageNum:
					viewType === '3' ? this.page.currentPage : this.pageTwo.currentPage,
				pageSize: this.page.length,
				shelvesTimeStart: time[0],
				shelvesTimeEnd: time[1],
				goodsNumberList: searchDataTwo.goodsNumberList,
				isSales: selfStatus == 0 ? '' : selfStatus,
				brandIdList: !this.brandIdNamber
					? tempBrandIdList
					: this.brandIdTwoList,
			})
			console.log('this.searchSupplier', this.searchSupplier)
			paramJson.supplierId = this.searchSupplier.supplierId
			paramJson.supplierName = this.searchSupplier.supplierName
			delete paramJson.time

			return paramJson
		},

		// 处理上架时间参数
		handlePutawayDate(val) {
			if (!val) {
				val = ['', '']
			} else {
				val[0] = moment(val[0]).valueOf() || ''
				val[1] = moment(val[1]).valueOf() || ''
			}

			return val
		},

		// 处理货号参数
		handleNoParams() {
			const searchDataTwo = JSON.parse(JSON.stringify(this.searchDataTwo))
			searchDataTwo.keyword = searchDataTwo.keyword.replace(/\n/g, ',')
			searchDataTwo.keyword = searchDataTwo.keyword.replace(/\s*/g, '') //商品货号
			// const goodsNumberLength = searchDataTwo.keyword.match(/,|，/g)
			// if (type === 1 && goodsNumberLength && goodsNumberLength.length > 500) {
			// 	return this.$message.warning('货号长度最多支持500个货号搜索')
			// }
			if (searchDataTwo.keyword) {
				searchDataTwo.goodsNumberList = searchDataTwo.keyword.split(',')
			}
			return searchDataTwo
		},

		// 初始化
		async _getYouxuanGoodsList(flag, type) {
			const jurisdiction = this.handleJurisdiction()
			const jurisdictionTwo = this.handleJurisdictionTwo()
			if (this.searchData.brandIdList.length === 0 && type === 1) {
				this.tableData = []
				this.tableTwoData = []
				return
			}
			if (
				(this.searchData.brandIdList.length === 0 &&
					this.brandIdTwoList.length === 0) ||
				(!this.brandIdTwoList.length && !this.searchData.brandIdList.length)
			) {
				return this.$message.warning('请选择一个会场')
			}

			const paramJson = this.findSearchParams(flag)
			this.loading = true

			// jurisdiction为true是商品列表, false是特殊处理
			//优化商品列表货号搜索,返回无货号
			this._getYouxuanGoodsNumberList(paramJson)
			console.log('paramJson----------------', paramJson)
			if (jurisdiction && !jurisdictionTwo) {
				const {
					data: { resultCode, resultData },
				} = await yxGoodsList(paramJson)
				this.handleJurisdictionRequest(resultCode, resultData)
			} else {
				const {
					data: { resultCode, resultData },
				} = await hzYxGoodsList(paramJson)
				this.handleJurisdictionRequest(resultCode, resultData)
			}
			if (this.searchData.viewType === '3') {
				this.queryNotSelfBrandSupplierAccountIds()
			}

			this.loading = false
		},
		//优化商品列表货号搜索,返回无货号
		async _getYouxuanGoodsNumberList(paramJson) {
			const searchDataTwo = this.handleNoParams()
			// 如果货号为空 不做请求
			if (!searchDataTwo.keyword) {
				this.notGoodsNumber = []
				return
			}
			const paramsData = JSON.parse(JSON.stringify(paramJson))
			paramsData.keyword = searchDataTwo.keyword
			const {
				data: {
					resultCode,
					resultData: { notGoodsNumber = [] },
				},
			} = await getYouxuanGoodsNumberList(paramsData)
			if (resultCode == 0 && notGoodsNumber.length > 0) {
				this.notGoodsNumber = notGoodsNumber
			} else {
				this.notGoodsNumber = [] //添加清空：‘以下货号搜索找不到对应商品’
			}
		},
		// 权限接口请求处理
		handleJurisdictionRequest(resultCode, resultData) {
			if (resultCode == 0 && resultData.resultData.length > 0) {
				if (this.searchData.viewType === '3') {
					this.tableData = resultData.resultData
					this.page.count = resultData.total
				} else {
					this.tableTwoData = []
					const list = resultData.resultData
					this.pageTwo.count = resultData.total
					list.forEach((item) => {
						if (item.goodsSpecBOList && item.goodsSpecBOList.length) {
							item.goodsSpecBOList.forEach((v) => {
								const current = {
									supplierAccountNumberId: item.supplierAccountNumberId,
									brandId: item.brandId,
									goodsId: item.goodsId,
									goodsName: item.goodsName,
									goodsNumber: item.goodsNumber,
									goodsGroupId: item.goodsGroupId,
									groupName: item.groupName,
									shelfState: item.shelfState,
									isSales: item.isSales,
									imageUrl: item.imageUrl,
									brandName: item.brandName,
									barCode: v.barCode,
									goodsSpecId: v.goodsSpecId,
									specNumber: v.specNumber,
									specOne: v.specOne,
									specTwo: v.specTwo,
									costPrice: v.costPrice,
									supplyPrice: v.supplyPrice,
									lowestPrice: v.lowestPrice,
									supplierPrice: v.supplierPrice,
									highestPrice: v.highestPrice,
									marketPrice: v.marketPrice,
									totalStock: v.stock,
								}
								this.tableTwoData.push(current)
							})
						}
					})
					this.merageInit()
					this.getSpanArr(this.tableTwoData)
				}
			} else {
				this.page.count = 0
				this.tableData = []
				this.tableTwoData = []
			}
		},

		// 多选
		selectionChange(row) {
			this.selectionData = row
			console.log(this.selectionData)
		},

		// 删除商品
		_deleteGroupGoods(row) {
			const paramJson = {
				goodsId: row.goodsId,
			}

			this.$confirm(`确定删除该商品？`, '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						let {
							data: { resultMsg, resultCode },
						} = await deleteGroupGoods(paramJson)
						const typeMsg = resultCode == 0 ? 'success' : 'error'
						if (resultCode == 0) {
							this.$message[typeMsg](resultMsg)
							this._getYouxuanGoodsList(true)
						}
					}
				},
			})
		},

		// 删除规格
		_batchDeleteGoodsSpec(row, type) {
			// 2删除单个规格, 3批量删除规格
			const paramJson = {}

			if (type === 2) {
				paramJson.goodsSpecIdList = [row.goodsSpecId]
			} else if (type === 3) {
				if (this.selectionData.length === 0) {
					return this.$message.warning('请选择商品')
				}

				paramJson.goodsSpecIdList = this.selectionData.map((item) => {
					return item.goodsSpecId
				})
			}

			this.$confirm(
				type === 3
					? `确定删除选择的${this.selectionData.length}个商品？`
					: `确定删除该规格？`,
				'提示',
				{
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							let {
								data: { resultMsg, resultCode },
							} = await batchDeleteGoodsSpec(paramJson)
							const typeMsg = resultCode == 0 ? 'success' : 'error'
							if (resultCode == 0) {
								this.$message[typeMsg](resultMsg)
								this._getYouxuanGoodsList(true)
							}
						}
					},
				}
			)
		},
		// 获取商家列表
		async _supplierPageByInfo(query) {
			if (query !== '') {
				const paramJson = {
					startIndex: 0,
					length: 20,
					supplierName: query,
				}
				const {
					data: { resultCode, resultData },
				} = await supplierPageByInfo(paramJson)

				if (resultCode == 0) {
					this.formDataSupplierList = resultData.recordList || []
					return
				}
			}
			this.formDataSupplierList = []
		},
		// 获取会场列表 type 1.查询更多 2.查不到数据时触发查询更多
		async _getGoodsGroupListByConditionForCMS(type) {
			this.branditle = []
			this.goodsGroupTwoList = []
			this.searchData.brandIdList = []
			this.brandIdTwoList = []
			this.brandIdNamber = false
			const paramJson = {
				brandNameKeyword: this.searchDataOne.brandNameKeyword,
				organizationId: 1,
				goodsTypeList: [1, 2],
				goodsGroupStateList: [1, 2],
				startIndex: 0,
			}
			if (type !== 1) {
				paramJson.length = 30
			} else {
				this.flagTwoTitle = true
			}
			this.moreTitle = true
			this.loadingForm = true
			getGoodsGroupListByConditionWithoutPrivilege(paramJson).then(
				(res) => {
					const {
						data: { resultCode, resultData },
					} = res
					if (resultCode == 0) {
						if (resultData.goodsGroupList.length > 0) {
							this.goodsGroupList = resultData.goodsGroupList.map((item) => {
								return {
									brandId: item.brandId,
									brandName: item.brandName,
									brandIdCombine: `${item.brandId}|${item.goodsGroupId}`,
								}
							})
							this.goodsGroupList.map((item, index) => {
								this.goodsGroupListMap[
									item.brandIdCombine
								] = this.goodsGroupList[index].brandName
							})
							this.goodsGroupCount = resultData.goodsGroupCount
						} else {
							this.goodsGroupList = []
							this.searchData.brandIdList = []
							// 触发更多查询
							if (type === 2) {
								this._getBrandList()
							}
						}
					} else {
						this.goodsGroupList = []
						this.searchData.brandIdList = []
					}
					this.loadingForm = false
				},
				() => {
					this.loadingForm = false
				}
			)
		},

		// 获取品牌列表
		async _getBrandList() {
			this.branditle = []
			this.brandIdTwoList = []
			this.goodsGroupTwoList = []
			this.searchData.brandIdList = []
			this.brandIdListTemp = JSON.parse(
				JSON.stringify(this.searchData.brandIdList)
			)
			this.flagOneTitle = true
			const paramJson = {
				keyword: this.searchDataOne.brandNameKeyword,
				selectionTag: 2,
				startIndex: 0,
				length: 100,
			}
			this.moreTitle = false
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await getBrandList(paramJson)
			if (resultCode == 0 && resultData.brandList.length > 0) {
				this.goodsGroupTwoList = resultData.brandList
			} else {
				this.goodsGroupTwoList = []
			}
			this.loading = false
			this.brandIdNamber = true
		},

		// 商品规格-处理显示商品状态
		handleGoodsTag(row = {}) {
			let title =
				row.shelfState == 2 ? (row.isSales == 1 ? '在售' : '待售') : '下架'
			return title
		},

		// 商品规格-转换供货价
		handleSupplyPrice(row) {
			const { lowestPrice, supplyPrice } = row

			if (lowestPrice - supplyPrice <= 0) {
				// this.costPriceTag = 'danger'
				return `￥${retainDecimalPoint(supplyPrice)}`
			} else if (lowestPrice - supplyPrice <= 5) {
				// this.costPriceTag = 'warning'
				return `￥${retainDecimalPoint(supplyPrice)}`
			} else {
				// this.costPriceTag = ''
				return '￥' + retainDecimalPoint(supplyPrice)
			}
		},

		// 商品规格-转换建议零售价
		handleLowestPrice(row) {
			const { highestPrice, lowestPrice } = row

			//红色 建议零售价小于等于外网价
			if (highestPrice - lowestPrice <= 0) {
				return `￥${retainDecimalPoint(lowestPrice)}~${retainDecimalPoint(
					highestPrice
				)}`
			} else {
				return `￥${retainDecimalPoint(lowestPrice)}~${retainDecimalPoint(
					highestPrice
				)}`
			}
		},

		// 商品规格-转换市场价
		handleMarketPrice(row) {
			const { marketPrice, lowestPrice } = row

			//红色 市场价小于等于建议零售价
			if (marketPrice - lowestPrice <= 0) {
				return `￥${retainDecimalPoint(marketPrice)}`
			} else {
				return `￥${retainDecimalPoint(marketPrice)}`
			}
		},

		// 商品规格-转换利润率（平台）、利润率（店主）
		handlePlatformProfit(val) {
			//蓝色 利润率小于10%
			if (val < 10) {
				return `${retainDecimalPoint(val)}%`
			} else {
				return `${retainDecimalPoint(val)}%`
			}
		},

		// 操作视图
		handleViewType() {
			this.selectionData = []
			if (
				this.searchData.brandIdList.length > 0 ||
				this.brandIdTwoList.length > 0
			) {
				this._getYouxuanGoodsList(true)
			}
		},

		// 批量驳回商品
		handleBatchRejectGoods(type, goodsId) {
			// type: 1批量驳回, 2单条
			if (this.selectionData.length === 0 && type === 1) {
				return this.$message.warning('请勾选商品')
			}
			if (this.selectionData.length > 0 && type === 1) {
				for (let i = 0; i < this.selectionData.length; i++) {
					if (this.selectionData[i].forbidden == '命中非自有品牌') {
						return this.$message.warning('‘爱库存商品’不可操作驳回')
					}
				}
			}
			this.batchRejectGoodsId = goodsId
			this.batchRejectGoodsDialog = true
		},

		// 同步到小程序
		async _removeGoodsRedis() {
			const {
				data: { resultCode, resultMsg },
			} = await removeGoodsRedis()

			if (resultCode == 0) {
				this.$message.success(resultMsg)
			}
		},
		volumeLimitMarkUpSubmitForm() {
			let goodsIdList = []
			let goodsTitle = ''

			this.selectionData.map((item) => {
				console.log('=========', item)
				if (item.forbidden != '命中非自有品牌' && item.shelfState == 1) {
					goodsIdList.push(item.goodsId)
				} else {
					goodsTitle += item.goodsNumber + '，'
				}
			})
			console.log('goodsIdList', goodsIdList)
			let title = !isNull(goodsTitle)
				? '<strong>是否批量限制</strong>' +
				  '<strong>' +
				  goodsIdList.length +
				  '</strong>' +
				  '<strong>个有效商品加价,</strong><br />' +
				  '商品货号：' +
				  goodsTitle +
				  '为非自有品牌或非下架状态'
				: '<strong>是否批量限制</strong>' +
				  '<strong>' +
				  goodsIdList.length +
				  '</strong>' +
				  '<strong>个有效商品加价,</strong><br />'
			if (goodsIdList.length === 0) {
				return this.$message.warning('请选择自有品牌并且下架的商品')
			}
			this.$confirm(title, '批量限制加价', {
				confirmButtonText: '确定',
				dangerouslyUseHTMLString: true,
				type: 'warning',
			}).then(async () => {
				let {
					data: { resultCode, resultData },
				} = await updateGoodsLimitMarkupStatusBatch({
					goodsIdList: goodsIdList,
					isLimitMarkup: this.limitPriceRadio,
				})
				if (resultCode == 0) {
					if (resultData?.errorGoodsInfo?.length) {
						this.$message({
							type: 'success',
							message: resultData.errorGoodsInfo,
						})
					} else {
						this.$message({
							type: 'success',
							message: '成功!',
						})
					}
					this.limitPrice = false
					this._getYouxuanGoodsList()
				}
			})
		},
		volumeLimitMarkUp() {
			if (this.selectionData.length === 0) {
				return this.$message.warning('请选择商品')
			}
			this.limitPriceRadio = '1'
			this.limitPrice = true
		},

		// 批量上下架
		async _goodsOnOffShelves(type) {
			// type: 1下架, 2上架
			if (this.selectionData.length === 0) {
				return this.$message.warning('请选择商品')
			}
			let grounding = false

			const goodsInfo = []
			this.selectionData.forEach((item) => {
				if (accSub(item.lowestPrice, item.supplyPrice) <= 0.3 && type == 2) {
					grounding = true
				} else {
					goodsInfo.push({
						goodsId: item.goodsId, //商品ID
						goodsName: item.goodsName, //商品名称
						goodsNumber: item.goodsNumber, //商品编号
						imageUrl: item.imageUrl, //图片地址
						goodsGroupId: item.goodsGroupId > 0 ? item.goodsGroupId : '', //分组ID
						groupName: item.goodsGroupId > 0 ? item.groupName : '', //分组名称
						barCode: item.barCode, //商品尺码字段
						supplierAccountNumberId: item.supplierAccountNumberId, //商家账号id
						brandId: item.brandId, //会场id
					})
				}
			})
			if (grounding && !goodsInfo.length) {
				return this.$message.warning('最低销售价减供货价需大于0.3')
			}
			console.log('+++++++++', goodsInfo)
			// return
			const paramJson = {
				isSycnGoods: 2,
				operateType: type,
				goodsInfo,
				sourceType: 1,
			}

			this.$confirm(
				`确定${type == 1 ? '下架' : '上架'}选中的${
					this.selectionData.length
				}款商品？`,
				'提示',
				{
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							let {
								data: { resultMsg, resultCode },
							} = await goodsOnOffShelves(paramJson)
							const typeMsg = resultCode == 0 ? 'success' : 'error'
							if (resultCode == 0) {
								this.$message[typeMsg](resultMsg)
								this._getYouxuanGoodsList()
							}
						}
					},
				}
			)
		},

		// 批量七天无理由
		sevenDaysNotReason() {
			if (this.selectionData.length === 0) {
				return this.$message.warning('请选择商品')
			}
			if (
				this.selectionData.length == 1 &&
				this.selectionData[0].shelfState == 2
			) {
				return this.$message.warning('商品下架才可进行此操作')
			}
			this.dialogVisible = true
		},

		// 批量导出修改价格
		async batchDeriveEditPrice() {
			const { selfStatus, brandIdList } = this.searchData
			const searchDataTwo = this.handleNoParams()
			if (brandIdList.length === 0 && this.brandIdTwoList.length === 0) {
				return this.$message.warning('请选择一个会场')
			}

			const loading = this.$loading({
				lock: true,
				text: '导出中',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)',
			})
			const exportData = JSON.parse(JSON.stringify(this.searchData))
			const tempBrandIdList = this.handleVenueParams(brandIdList)
			const time = this.handlePutawayDate(exportData.time)
			const paramJson = Object.assign(exportData, {
				shelvesTimeStart: time[0],
				shelvesTimeEnd: time[1],
				keyword: searchDataTwo.keyword,
				goodsStatus: 3,
				userId: this.$store.state.user.userInfo.userId,
				isSales: selfStatus == 0 ? '' : selfStatus,
				startIndex: '',
				length: '',
				viewType: 2,
				brandIdList: !this.brandIdNamber
					? tempBrandIdList
					: this.brandIdTwoList,
			})
			delete paramJson.time
			const { data } = await exportUpdateGoodsPrice(paramJson)
			downloadFile(data, '批量导出修改价格.xlsx')
			loading.close()
		},

		//批量导出
		async handleBatchForbidden() {
			const { selfStatus, viewType, brandIdList } = this.searchData
			const searchDataTwo = this.handleNoParams()
			if (
				brandIdList.length === 0 &&
				viewType === '3' &&
				this.brandIdTwoList.length === 0
			) {
				return this.$message.warning('请选择一个会场')
			}
			const exportData = JSON.parse(JSON.stringify(this.searchData))
			const time = this.handlePutawayDate(exportData.time)
			const tempBrandIdList = this.handleVenueParams(brandIdList)
			// 杭州特殊需求, 只有在特殊列表商品视图导出比例才会显示
			const jurisdiction = this.handleJurisdiction()
			const headList = !jurisdiction
				? [
						'supplierName',
						'brandName',
						'goodsNumber',
						'goodsName',
						'shelfState',
						'specOne',
						'specTwo',
						'barCode',
						'sortOrder',
						'costPrice',
						'supplierPrice',
						'lowestPrice',
						'highestPrice',
						'marketPrice',
						'stock',
						'platformProfit',
						'shopProfit',
				  ]
				: [
						this.searchData.viewType == 2
							? 'supplierPrice'
							: 'platformAdjustmentValue' && 'commissionAdjustmentValue',
						'supplierName',
						'brandName',
						'goodsNumber',
						'goodsName',
						'shelfState',
						'specOne',
						'specTwo',
						'barCode',
						'sortOrder',
						'costPrice',
						'supplierPrice',
						'lowestPrice',
						'highestPrice',
						'marketPrice',
						'stock',
						'isSales',
						'platformProfit',
						'shopProfit',
						'platformAdjustmentValue',
						'commissionAdjustmentValue ',
				  ]
			const paramJson = Object.assign(exportData, {
				shelvesTimeStart: time[0],
				shelvesTimeEnd: time[1],
				keyword: searchDataTwo.keyword,
				goodsStatus: 3,
				userId: this.$store.state.user.userInfo.userId,
				isSales: selfStatus == 0 ? '' : selfStatus,
				startIndex: '',
				length: '',
				headList: headList,
				brandIdList: !this.brandIdNamber
					? tempBrandIdList
					: this.brandIdTwoList,
			})
			if (viewType === '2') {
				this.educeGoodsListDialog = true
				this.exportSpecData = exportData
				return
			}
			const loading = this.$loading({
				lock: true,
				text: '导出中',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)',
			})
			delete paramJson.time
			let Url = this.handleJurisdiction()
				? exportGoodsOfPassDetails
				: exportGoodsOfPassDetailsByHz
			const { data } = await Url(paramJson)
			downloadFile(data, '商品列表.xlsx')
			loading.close()
		},

		// 批量定价
		async handleBatchFixPrice() {
			if (this.selectionData.length === 0) {
				this.$message.warning('请勾选商品')
				return
			}
			if (this.selectionData.length > 100) {
				this.$message.warning('最多选择100个商品')
				return
			}
			let goodsIdList = this.selectionData.map((item) => {
				return item.goodsId
			})
			this.$confirm(
				`确定批量定价选择的${goodsIdList.length}个商品吗？`,
				'提示',
				{
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							let {
								data: { resultCode, resultData },
							} = await batchFixPrice({
								operationType: 2,
								goodsIdList,
							})
							const typeMsg = resultCode === 0 ? 'success' : 'error'
							if (resultCode === 0) {
								this.$message[typeMsg](resultData.resultMsg)
								this._getYouxuanGoodsList(true)
							}
						}
					},
				}
			)
		},

		// 跳转商品详情
		skipGoodsDetails(row) {
			this.$router.push({
				path: `/goods/GoodsDetail/${row.goodsId}/${row.goodsSpecId}`,
			})
		},
		handleChange(e) {
			console.log(e)
			this.searchData.goodsCategoryId = e[e.length - 1]
			this._getYouxuanGoodsList(true)
		},
		// 操作会场
		handleBrandIdList(val) {
			this.branditle = []
			if (!this.brandIdNamber) {
				for (let i = 0; i < val.length; i++) {
					this.branditle.push(this.goodsGroupListMap[val[i]])
				}
			} else {
				for (let i = 0; i < val.length; i++) {
					for (let j = 0; j < this.goodsGroupTwoList.length; j++) {
						if (this.goodsGroupTwoList[j].brandId == val[i]) {
							this.branditle.push(this.goodsGroupTwoList[j].brandName)
						}
					}
				}
			}
			if (!this.handleVenueState) {
				this._getYouxuanGoodsList(true, 1)
			}
		},

		// 展开
		handleUnfold() {
			this.brandIdListTemp = JSON.parse(
				JSON.stringify(this.searchData.brandIdList)
			)
			this.flagUnfold = true
			this.branditle = []
			this.brandIdTwoList = []
			this.searchData.brandIdList = []
			this._getGoodsGroupListByConditionForCMS(1)
		},

		// 取消
		handleCancel() {
			this.branditle = []
			this.brandIdTwoList = []
			this.flagUnfold = false

			if (this.brandIdListTemp.length > 0) {
				this.searchData.brandIdList = this.brandIdListTemp
			}
			this._getGoodsGroupListByConditionForCMS()
		},

		// 处理会场参数
		handleVenueParams(brandIdList) {
			const tempBrandIdList = []
			for (let i = 0; i < brandIdList.length; i++) {
				for (let j = 0; j < this.goodsGroupList.length; j++) {
					if (brandIdList[i] === this.goodsGroupList[j].brandIdCombine) {
						tempBrandIdList.push(this.goodsGroupList[j].brandId)
					}
				}
			}

			return tempBrandIdList
		},

		// 规格视图合并
		objectSpanMethod({ rowIndex, columnIndex }) {
			if (
				columnIndex === 0 ||
				columnIndex === 1 ||
				columnIndex === 2 ||
				columnIndex === this.tableColumnsTwo.length - 1 ||
				columnIndex === this.tableColumnsTwo.length
			) {
				const _row = this.spanArr[rowIndex]
				const _col = _row > 0 ? 1 : 0
				return {
					// [0,0] 表示这一行不显示， [2,1]表示行的合并数
					rowspan: _row,
					colspan: _col,
				}
			}
		},

		// 处理合并表格
		getSpanArr(data) {
			data.forEach((item, index) => {
				if (index == 0) {
					this.spanArr.push(1)
					this.pos = 0
				} else {
					// 判断当前元素与上一个元素是否相同
					if (data[index].goodsId == data[index - 1].goodsId) {
						this.spanArr[this.pos] += 1
						this.spanArr.push(0)
					} else {
						this.spanArr.push(1)
						this.pos = index
					}
				}
			})
		},

		// 初始合并行的数组
		merageInit() {
			this.spanArr = []
			this.pos = 0
		},

		// 处理商品列表和特殊处理权限
		handleJurisdiction() {
			let pathFlag = false
			if (
				this.$route.path === '/goods/goodsList' ||
				(this.$route.path === '/goods/goodsPrice' &&
					this.searchData.viewType === '2')
			) {
				pathFlag = true
			}

			return pathFlag
		},

		// 处理商品列表和特殊处理权限
		handleJurisdictionTwo() {
			let pathFlag = false
			if (this.$route.path === '/goods/goodsPrice') {
				pathFlag = true
			}

			return pathFlag
		},
		// 取消七天无理由
		cancelSevenDaysNotReason() {
			this.dialogVisible = false
		},
		// 确定七天无理由
		handleSevenDaysNotReason(formName) {
			this.$refs[formName].validate(async (valid) => {
				if (valid) {
					let pramasJson = {
						sourceType: 0,
						targetIdList: [],
						targetType: 2,
					}
					pramasJson.configType = this.ruleForm.sevenWithoutReason
					this.selectionData.forEach((item) => {
						pramasJson.targetIdList.push(item.goodsId)
					})
					const {
						data: { resultCode, resultData },
					} = await handleSevenDaysWithoutReason(pramasJson)
					if (resultCode === 0) {
						const tip = resultData.tip || '添加成功！'
						this.$message.success(tip)
						this.dialogVisible = false
					}
				} else {
					return false
				}
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.goods {
	&__no {
		margin-top: -10px;

		.attribute {
			color: #ff0000;
		}
	}

	.search {
		position: relative;

		.venue {
			width: 100%;
			position: relative;
			padding-right: 32px;
			.feature {
				position: absolute;
				right: 0;
				top: -14px;
			}
		}

		.checked {
			padding: 0 10px;
			border: 1px solid #e6e6e6;

			&__btn {
				text-align: center;
			}
		}

		.view {
			position: absolute;
			right: 0;
			bottom: 18px;
		}

		.bedeck {
			height: 150px;
			padding: 10px;
			overflow-y: auto;
			border: 1px solid #e6e6e6;
			border-bottom: none;
		}
	}

	.slot {
		text-align: left;
		display: flex;
		align-items: flex-start;
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
			margin-top: 10px;
		}
	}

	.active {
		color: #4498e0;
		cursor: pointer;
		line-height: 15px;
	}
}
</style>

<style lang="scss">
.search .brand-list {
	width: 100%;
}
.search .brand-list .el-form-item__content {
	width: 100%;
}
.mb20 {
	margin-bottom: 20px;
}
.indent {
	margin: 0;
	text-indent: 2em;
}
</style>

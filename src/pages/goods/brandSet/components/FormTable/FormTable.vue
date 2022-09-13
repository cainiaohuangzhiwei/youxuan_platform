<template>
	<basic-container>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="会场列表" name="one">
				<yx-form
					:inline="true"
					:data="formDataOne"
					:items="formCfgOne"
					:formAction="formActionOne"
				>
					<template #supplierAccountNumberIds>
						<el-select
							v-model="formDataOne.supplierAccountNumberIds"
							multiple
							filterable
							remote
							clearable
							placeholder="请输入商家名称"
							value-key="supplierAccountNumberId"
							:remote-method="_findSupplierAccountNumberForList"
							><i class="el-icon-search el-input__icon" slot="prefix"> </i>
							<el-option
								v-for="item in formDataSupplierAccountNumberList"
								:key="item.supplierAccountNumberId"
								:label="item.supplierName"
								:value="item.supplierAccountNumberId"
							>
							</el-option>
						</el-select>
					</template>
				</yx-form>
				<yx-table
					:select="true"
					v-loading="brandLoging"
					:pagination="page"
					:data="tableData"
					:columns="tableColumns"
					:selectionChange="selectionChange"
					:rowClassName="tableRowClassName"
				></yx-table>
				<!-- 品牌品类列表 -->
			</el-tab-pane>
			<el-tab-pane label="品牌品类列表" name="two">
				<yx-form
					:inline="true"
					:data="formDataTwo"
					:items="formCfgTwo"
					:formAction="formActionTwo"
				>
				</yx-form>

				<yx-table
					v-loading="loadingTwo"
					:columns="tableColumnsTwo"
					:pagination="pageTwo"
					:data="tableDataSecond"
				></yx-table>
			</el-tab-pane>
			<el-tab-pane label="品牌列表" name="three">
				<yx-form
					:inline="true"
					:data="formDataThree"
					:items="formCfgThree"
					:formAction="formActionThree"
				>
				</yx-form>
				<yx-table
					:row-class-name="isRedRow"
					v-loading="loadingThree"
					:columns="tableColumnsThree"
					:pagination="pageThree"
					:data="tableDataBrand"
				></yx-table>
			</el-tab-pane>
			<el-tab-pane label="分类列表" name="four">
				<yx-form :inline="true" :formAction="formActionFour"> </yx-form>
				<yx-table
					v-loading="loadingFour"
					:columns="tableColumnsFour"
					:pagination="pageFour"
					:data="tableDataClassify"
				></yx-table>
			</el-tab-pane>
			<edit-dialog
				ref="mall"
				:title="title"
				:visible.sync="userDialog"
				:itemInfo.sync="editItem"
				@fatherMethodOne="fatherMethodOne"
				@fatherMethodTwo="fatherMethodTwo"
			/>
		</el-tabs>
		<!-- ERP同步 -->
		<Dialog
			title="ERP同步"
			:visible="synchronizationLoding"
			width="50%"
			:bottomBtn="synchronizationBottomBtn"
			@before-close="synchronizationLoding = false"
		>
			<yx-form
				:inline="true"
				:data="formData105"
				:items="formCfg105"
				:formAction="formAction105"
			>
				<template #lastSyncTime>
					<div class="row">
						{{ formData105.lastSyncTime ? formData105.lastSyncTime : '无' }}
					</div>
				</template>
			</yx-form>
		</Dialog>
		<!-- 一键调价 -->
		<Dialog
			title="会场调价"
			style="z-index: 2006; left: -300px; width: 2700px"
			:visible="venuePricingLoding"
			width="50%"
			:bottomBtn="venuePricingBottomBtn"
			@before-close="venuePricingLoding = false"
		>
			<yx-form
				:inline="true"
				:data="venuePricingformData"
				:items="venuePricingformCfg"
				:formAction="venuePricingformAction"
			>
				<template #textDocument>
					<div class="textm">
						<p>结算价基础上调价规则：</p>
						<p>1.在商品的结算价基础上加价。</p>
						<p>2.供货价加价：在结算价的基础上加对应的金额。</p>
						<p>如：结算价100-500之间的商品，供货价加5元，即供货价=结算价+5元</p>
						<p>2.最低建议销售价加价：在结算价的基础上加对应的金额。</p>
						<p>
							如：结算价100-500之间的商品，最低建议销售价价加10元，即最低建议销售价=基础结算价+10元
						</p>
					</div>
					<div class="textm">会场名称:{{ adjustBran.brandName }}</div>
					<el-button class="btn textm" @click="cutOffTime"
						>+增加区间
					</el-button>
				</template>
				<template #priceText>
					<div class="textm">
						<p>供货价或最低建议销售价调价规则：</p>
						<p>1.在商品的供货价或最低建议销售价基础上加价。</p>
						<p>2.供货价加价：在供货价的基础上加对应的金额。</p>
						<p>
							如：结算价100-500之间的商品，供货价加5元，即最终供货价=供货价+5元
						</p>
						<p>2.最低建议销售价加价：在最低建议销售价的基础上加对应的金额。</p>
						<p>
							如：结算价100-500之间的商品，最低建议销售价价加10元，即最终最低建议销售价=基础销售价+10元
						</p>
					</div>
					<div class="textm">会场名称:{{ adjustBran.brandName }}</div>
					<el-button class="btn textm" @click="cutOffTime"
						>+增加区间
					</el-button>
				</template>
				<template #section>
					<div
						class="time"
						:class="{ adorn: counter.length === 0 }"
						v-if="sectionShow"
					>
						<p v-for="(item, index) in counter" :key="index">
							结算价：
							<el-input
								style="margin-bottom: 10px"
								class="w80"
								type="number"
								min="1"
								v-model="item.settlementPriceOne"
							></el-input>
							-
							<el-input
								class="w80"
								type="number"
								min="1"
								v-model="item.settlementPriceTwo"
							></el-input>
							供货价：
							<el-radio v-model="item.radioSupplyPriceOne" label="1"
								><span>加</span
								><el-input
									type="number"
									oninput="if(value>5)value=value=5"
									v-model.trim="item.plusSupplyPriceOne"
									style="width: 80px; margin-left: 10px"
								></el-input
								>&nbsp;</el-radio
							>
							<el-radio
								:disabled="true"
								v-if="venuePricingformData.adjustment == 1"
								v-model="item.radioSupplyPriceOne"
								label="2"
								><span>减</span
								><el-input
									:disabled="true"
									v-model.trim="item.minusSupplyPriceOne"
									style="width: 80px; margin-left: 10px"
								></el-input
								>&nbsp;</el-radio
							>
							<el-radio
								:disabled="true"
								v-model="item.radioSupplyPriceOne"
								label="3"
								><span>加</span
								><el-input
									:disabled="true"
									v-model.trim="item.plusSupplyPriceTwo"
									style="width: 80px; margin-left: 10px"
								></el-input
								>&nbsp;%</el-radio
							>
							<el-radio
								:disabled="true"
								v-if="venuePricingformData.adjustment == 1"
								v-model="item.radioSupplyPriceOne"
								label="4"
								><span>减</span
								><el-input
									:disabled="true"
									v-model.trim="item.minusSupplyPriceTwo"
									style="width: 80px; margin-left: 10px"
								></el-input
								>&nbsp;%</el-radio
							>
							<el-radio v-model="item.radioSupplyPriceOne" label="5"
								><span>不变</span></el-radio
							>
							<span>建议零售价：</span>
							<el-radio
								:disabled="true"
								v-model="item.radioSupplyPriceOne"
								label="1"
								><span>加</span
								><el-input
									:disabled="true"
									type="number"
									oninput="if(value>5)value=value=5"
									v-model.trim="item.plusSupplyPriceOne"
									style="width: 80px; margin-left: 10px"
								></el-input
								>&nbsp;</el-radio
							>
							<el-radio
								:disabled="true"
								v-if="venuePricingformData.adjustment == 1"
								v-model="item.radioSupplyPriceTwo"
								label="2"
								><span>减</span
								><el-input
									:disabled="true"
									v-model.trim="item.suggestedRetailPriceTwo"
									style="width: 80px; margin-left: 10px"
								></el-input
								>&nbsp;</el-radio
							>
							<el-radio
								:disabled="true"
								v-model="item.radioSupplyPriceTwo"
								label="3"
								><span>加</span
								><el-input
									:disabled="true"
									v-model.trim="item.suggestedRetailPriceThree"
									style="width: 80px; margin-left: 10px"
								></el-input
								>&nbsp;%</el-radio
							>
							<el-radio
								:disabled="true"
								v-if="venuePricingformData.adjustment == 1"
								v-model="item.radioSupplyPriceTwo"
								label="4"
								><span>减</span
								><el-input
									:disabled="true"
									v-model.trim="item.suggestedRetailPriceFour"
									style="width: 80px; margin-left: 10px"
								></el-input
								>&nbsp;%</el-radio
							>
							<el-radio
								:disabled="true"
								v-model="item.radioSupplyPriceOne"
								label="5"
								><span>不变</span></el-radio
							>
							<el-button type="danger" @click="thisSplice(index)"
								>删除</el-button
							>
						</p>
					</div>
				</template>
			</yx-form>

			<yx-table
				:select="true"
				v-loading="loading"
				:columns="adjustRecordTable"
				:pagination="adjustRecordPage"
				:data="adjustRecordTableData"
			>
			</yx-table>
		</Dialog>
		<!-- //编辑购物需知 -->
		<Dialog
			title="购物需知"
			:visible="shoppingKnow"
			width="50%"
			:bottomBtn="shoppingKnowBottomBtn"
			@before-close="shoppingKnow = false"
		>
			<yx-form
				ref="form"
				v-loading="loading"
				labelWidth="140px"
				:items="buyerReading"
				:data="buyerReadingFormData"
				:formAction="buyerReadingFormAction"
			>
				<template #content>
					<UE
						ref="um"
						:defaultMsg="information"
						:name="'ue' + messagePlanId"
					></UE>
				</template>
				<template #brandName>
					<div>{{ buyerReadingFormData.brandName }}</div>
				</template>
			</yx-form>
		</Dialog>
		<!-- //操作记录 -->
		<Dialog
			title="操作记录"
			:visible="operatingRecordLoding"
			width="50%"
			:bottomBtn="operatingRecordBottomBtn"
			@before-close="operatingRecordLoding = false"
		>
			<yx-table
				:select="true"
				v-loading="loading"
				:columns="operatingRecordTable"
				:pagination="operatingRecordPage"
				:data="operatingRecordTableData"
			>
			</yx-table>
		</Dialog>
		<!-- //品牌品类 -->
		<brand-dialog
			ref="addMall"
			:title="title"
			:visible.sync="brandCategoryDialog"
			:itemInfo.sync="brandItem"
			@fatherbrandCategory="fatherbrandCategory"
		/>
		<!-- //分类列表 -->
		<classified-dialog
			ref="accMall"
			:title="title"
			:visible.sync="classifiedPopUps"
			:itemInfo.sync="classifiedItem"
			@classifiedBrand="classifiedBrand"
		/>
		<!-- //新增品牌弹窗 -->
		<newBrand-dialog
			ref="brandMall"
			:title="title"
			:visible.sync="addNewBrandHzw"
			:itemInfo.sync="newBrandItem"
			@fatherNewBrandCategory="fatherNewBrandCategory"
		/>
		<!-- //品牌logo批量上传弹窗 -->
		<brandLogoBatch-dialog
			ref="logoBatchMall"
			:title="title"
			:visible.sync="brandLogoBatch"
			@fatherNewBrandCategory="fatherNewBrandCategory"
		/>
	</basic-container>
</template>
<script>
import { isNull } from '@/utils/helper/common'
import UE from '@/components/RichText'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import YxForm from '@wg-vue-materials/yx-form'
import EditDialog from './EditDialog'
import BrandDialog from './BrandDialog'
import NewBrandDialog from './NewBrandDialog'
import ClassifiedDialog from './ClassifiedDialog'
import BrandLogoBatchDialog from './BrandLogoBatchDialog'
import Dialog from '@/components/Dialog'
import { getBigImg } from '@/utils/imageTool'
import { findSupplierAccountNumberForList } from '@/api/yhtPlusCmsSupplierAccountNumber'
import {
	tagSelection,
	cancelTag,
	deleteBrandByBrandId,
	updateBrandShoppingNoticeById,
} from '@/api/brand'
import { getBrandListConfiguration } from '@/api/systemConfiguration'
import { removeGoodsRedis } from '@/api/goodsList'
import { refreshGoodsGroupLockingStock } from '@/api/goodsGroup'
import { brandPriceAdjustmentLogList } from '@/api/brandPriceAdjustmentLogAction'
import {
	verifyErp,
	getUploadGoodsTime,
	uploadBrandGoodsList,
	findAdjustRecordByBrandId,
	batchUpdateGoodsPrice,
	getBrandCategory,
	getBrandCategoryList,
	getBrandParentList,
	findBrandCategoryClassifyByParam,
	refreshBrandCategoryClassifyCache,
	deleteBrandCategoryClassify,
	delBrandCategory,
	delBrandParent,
} from '@/api/yhtPlusWebGoods'
import moment from 'moment'
import { getConstantValueByKey, downloadFile } from '@/utils/helper/common'
import { exportBrandParentList } from '@/api/supplierBrandParent'
export default {
	components: {
		BasicContainer,
		YxTable,
		YxForm,
		EditDialog,
		Dialog,
		UE,
		BrandDialog,
		ClassifiedDialog,
		NewBrandDialog,
		BrandLogoBatchDialog,
	},
	name: 'FormTable',
	data() {
		return {
			activeName: 'one',
			formsDialog: false,
			sectionShow: true,
			counter: [],
			brandLoging: false,
			synchronizationLoding: false,
			operatingRecordLoding: false,
			shoppingKnow: false,
			classifiedPopUps: false,
			addNewBrandHzw: false,
			operatingRecordTableData: [],
			// 搜索商家数据源
			formDataSupplierAccountNumberList: [],
			formDataOne: {
				supplierAccountNumberIds: [], // 商家
				selectionTag: '', //标记状态
				keywordList: [],
			},
			formDataTwo: {
				keyword: '',
			},
			formDataThree: {
				keyword: '',
				brandParentId: '',
			},
			formData105: {
				isSyncGoods: '',
				syncStartTime: '',
				syncEndTime: '',
				lastSyncTime: '',
			},
			selectionData: [],
			tableData: [],
			tableDataSecond: [],
			tableDataBrand: [],
			tableDataClassify: [],
			adjustRecordTableData: [],
			selectGroupList: [],
			userDialog: false,
			loadingOne: false,
			loadingTwo: false,
			loadingThree: false,
			loadingFour: false,
			venuePricingLoding: false,
			brandCategoryDialog: false,
			brandLogoBatch: false,
			singleBrandId: '',
			buyerReadingFormData: [],
			information: '',
			messagePlanId: '',
			adjustBran: '',
			addBrandCategoryId: '',
			addBrandId: '',
			formCfgTwo: [
				{
					type: 'input',
					title: '品牌名称',
					dataIndex: 'keyword',
					placeholder: '请输入品牌名称',
				},
			],
			formCfgThree: [
				{
					type: 'input',
					title: '品牌名称',
					dataIndex: 'keyword',
					placeholder: '请输入品牌名称',
				},
				{
					type: 'input',
					title: '品牌ID',
					dataIndex: 'brandParentId',
					placeholder: '请输入品牌ID',
				},
			],
			venuePricingformData: {
				adjustment: '',
				section: '',
				typeExt: '',
				suggested: '',
			},
			venuePricingBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: (row) => {
						this.priceAdjustment(row)
					},
				},
			],
			venuePricingformCfg: [
				{
					type: 'radioMap',
					dataIndex: 'adjustment',
					disabled: false,
					title: '',
					options: {
						结算价基础上调价: 2,
						供货价或最低建议销售价基础上调价: 1,
					},
				},
				{
					type: 'custom',
					hide: true,
					dataIndex: 'textDocument',
				},
				{
					type: 'custom',
					hide: true,
					dataIndex: 'priceText',
				},
				{
					type: 'custom',
					hide: true,
					dataIndex: 'section',
				},
			],
			operatingRecordBottomBtn: [
				{
					title: '确 定',
					type: '',
					click: () => {
						this.operatingRecordLoding = false
					},
				},
			],
			shoppingKnowBottomBtn: [
				{
					title: '确 定',
					type: '',
					click: () => {
						this.determineshoppingKnow()
					},
				},
			],
			buyerReading: [
				{
					type: 'custom',
					title: '会场',
					dataIndex: 'brandName',
				},
				{
					type: 'custom',
					title: '消息内容',
					dataIndex: 'content',
				},
			],
			adjustRecordTable: [
				{
					type: 'string',
					dataIndex: 'brandCategoryName',
					title: '品牌品类名称',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场名称',
				},
				{
					type: 'string',
					dataIndex: 'type',
					title: '调价类型',
					customRender: (row) => {
						return row.type == 1 ? '结算价' : '供货价或建议零售价'
					},
				},
				{
					type: 'string',
					dataIndex: 'price',
					title: '成本区间',
					customRender: (row) => {
						return row.rule.split(',')[0] + '-' + row.rule.split(',')[1]
					},
				},
				{
					type: 'string',
					dataIndex: 'supplyPriceMarkUp',
					title: '供货价加价',
				},
				{
					type: 'string',
					dataIndex: 'minimumSalesPriceMarkUp',
					title: '建议零售价加价',
				},
			],
			operatingRecordTable: [
				{
					type: 'string',
					dataIndex: 'clerkName',
					title: '操作人',
				},
				{
					type: 'string',
					dataIndex: 'addTime',
					title: '操作时间',
					customRender: (row) => {
						return row.addTime
							? row.addTime + moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
			],
			formCfg105: [
				{
					title: '同步库存',
					type: 'datetimerange',
					dataIndex: ['syncStartTime', 'syncEndTime'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					type: 'radioMap',
					dataIndex: 'isSyncGoods',
					title: '是否上传商品',
					options: {
						是: 1,
						否: 0,
					},
				},
				{
					type: 'custom',
					title: '上次同步时间',
					dataIndex: 'lastSyncTime',
				},
			],
			synchronizationBottomBtn: [
				{
					title: '取 消',
					type: '',
					click: () => {
						this.synchronizationLoding = false
					},
				},
				{
					title: '确 定',
					type: 'primary',
					click: (row) => {
						this.determineERP(row)
					},
				},
			],
			formCfgOne: [
				{
					title: '商家',
					type: 'custom',
					dataIndex: 'supplierAccountNumberIds',
				},
				{
					type: 'select',
					dataIndex: 'selectionTag',
					title: '标记状态',
					label: 'value',
					options: this.$store.state.app.constant.FLAG_STATE_ROOM,
				},
				{
					title: '批量搜索',
					type: 'textarea',
					dataIndex: 'keywordList',
					autosize: { minRows: 4, maxRows: 6 },
					placeholder: '会场可以批量搜索，会场与会场之间用逗号隔开，或分行输入',
				},
			],
			formActionTwo: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getBrandCategoryList(true)
					},
				},
				{
					title: '新增品牌品类',
					type: 'primary',
					click: (row) => {
						this.newBrandCategories(row, 1)
					},
				},
			],
			formActionThree: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getBrandParentList(true)
					},
				},
				{
					title: '新增品牌',
					type: 'primary',
					click: (row) => {
						this.newBrandHzw(row, 1)
					},
				},
				{
					title: '方形品牌logo批量上传',
					type: 'primary',
					click: () => {
						this.uploadBrandLogoBatch(2)
					},
				},
				{
					title: '长形品牌logo批量上传',
					type: 'primary',
					click: () => {
						this.uploadBrandLogoBatch(1)
					},
				},
				{
					title: '导出',
					type: 'primary',
					click: () => {
						this.derive(true)
					},
				},
			],
			formActionFour: [
				{
					title: '新增分类',
					type: 'primary',
					click: (row) => {
						this._newClassification(row, 1)
					},
				},
				{
					title: '同步到小程序',
					type: 'success',
					click: () => {
						this._refreshBrandCategoryClassifyCache()
					},
				},
			],
			formActionOne: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getBrandListConfiguration(true)
					},
				},
				{
					title: '新增会场',
					type: 'primary',
					click: (row) => {
						this.handleEdit(row, 1)
					},
				},
				{
					title: '批量标记选品',
					type: 'success',
					click: () => {
						this.batchLabelSelections()
					},
				},
				{
					title: '同步到小程序',
					type: 'success',
					click: () => {
						this.synchronizeApplets()
					},
				},
			],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'brandId',
					title: '会场Id',
				},
				{
					type: 'string',
					dataIndex: 'brandCategoryId',
					title: '品类Id',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场名称',
				},
				{
					type: 'string',
					dataIndex: 'description',
					title: '描述',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
				},
				{
					type: 'string',
					dataIndex: 'selectionTag',
					title: '是否已选',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.FLAG_STATE_ROOM,
							row.selectionTag,
							'-',
							'selectionTag'
						)
					},
				},
				{
					type: 'action',
					title: '购物需知',
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.shoppingKnowEdit(row)
							},
						},
					],
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '修改',
							click: (row) => {
								this.handleEdit(row, 2)
							},
						},
						{
							title: '删除',
							popconfirm: true,
							popconfirmTitle: '是否删除该会场',
							confirm: (row) => {
								this.deleteIt(row, 1)
							},
						},
						{
							title: '标记选品',
							popconfirm: true,
							popconfirmTitle: '确定标记选品',
							confirm: (row) => {
								this.banIt(row)
							},
							customRender: (action, row) => {
								action.title = row.selectionTag == 1 ? '标记选品' : '取消标记'
								action.popconfirmTitle =
									row.selectionTag == 2 ? '确定取消标记选品' : '确定标记选品'
								return action
							},
						},
						{
							title: '清除锁库',
							popconfirm: true,
							popconfirmTitle: '是否清除锁库',
							confirm: (row) => {
								this.removeLibrary(row)
							},
						},
						{
							title: 'ERP同步',
							popconfirm: true,
							popconfirmTitle: '是否同步ERP',
							confirm: (row) => {
								this.singleBrandId = row.brandId
								this.synchronizationERP(row)
							},
						},
						{
							title: '一键调价',
							click: (row) => {
								this.keyPricing(row)
							},
						},
					],
				},
				{
					type: 'action',
					title: '操作记录',
					actions: [
						{
							title: '操作记录',
							click: (row) => {
								this.operatingRecord(row)
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
					this._getBrandListConfiguration()
				},
			},
			operatingRecordPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.operatingRecord()
				},
			},
			currentDtaOne: {
				imageName: '',
				sort: '',
				isHide: '0',
				imageList: [],
				jumpLocationLink: '',
			},
			tableColumnsTwo: [
				{
					type: 'string',
					dataIndex: 'brandParentId',
					title: '品牌ID',
				},
				{
					type: 'string',
					dataIndex: 'brandParentName',
					title: '品牌',
				},
				{
					type: 'string',
					dataIndex: 'brandCategoryId',
					title: '品牌品类ID',
				},
				{
					type: 'string',
					width: '200',
					dataIndex: 'brandCategoryName',
					title: '品牌品类名称',
				},
				{
					type: 'string',
					width: '350',
					dataIndex: 'proposal',
					title: '品牌建议',
					customRender: (row) => {
						return this.textateaDisposePHtml(row.proposal)
					},
				},
				{
					type: 'string',
					// width: '350',
					dataIndex: 'evaluation',
					title: '品类评价',
				},
				{
					type: 'string',
					// width: '350',
					dataIndex: 'evaluationReason',
					title: '评价原因',
				},
				{
					type: 'string',
					// width: '350',
					dataIndex: 'tag',
					title: '品类标签',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.newBrandCategories(row, 2)
							},
						},
						{
							title: '删除',
							popconfirm: true,
							popconfirmTitle: '是否删除品牌品类',
							confirm: (row) => {
								this.deleteIt(row, 3)
							},
						},
					],
				},
			],
			tableColumnsThree: [
				{
					type: 'string',
					dataIndex: 'brandParentId',
					title: '品牌ID',
				},
				{
					type: 'string',
					dataIndex: 'brandParentName',
					title: '品牌中文名称',
				},
				{
					type: 'string',
					dataIndex: 'brandParentEnglishName',
					title: '品牌英文名称',
				},
				{
					type: 'image',
					dataIndex: 'imageUrl',
					// class: 'poster_img',
					title: '品牌logo',
				},
				{
					type: 'image',
					dataIndex: 'brandLogoUrl',
					// class: 'poster_img',
					title: '新品牌logo',
				},
				{
					type: 'string',
					width: '350',
					dataIndex: 'brandParentClass',
					title: '品牌等级',
					customRender: (row) => {
						if (row.brandParentClass == 1) {
							return 'S级'
						} else if (row.brandParentClass == 2) {
							return '超A级'
						} else if (row.brandParentClass == 3) {
							return 'A级'
						} else if (row.brandParentClass == 4) {
							return 'B级'
						} else if (row.brandParentClass == 5) {
							return 'C级'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '查看',
							click: (row) => {
								this.newBrandHzw(row, 3)
							},
						},
						{
							title: '编辑',
							click: (row) => {
								this.newBrandHzw(row, 2)
							},
						},
						{
							title: '删除',
							popconfirm: true,
							popconfirmTitle: '是否删除该品牌',
							confirm: (row) => {
								this.deleteIt(row, 4)
							},
						},
					],
				},
			],
			tableColumnsFour: [
				{
					type: 'string',
					dataIndex: 'id',
					title: '分类ID',
				},
				{
					type: 'string',
					dataIndex: 'sort',
					title: '排序',
				},
				{
					type: 'string',
					dataIndex: 'firstClassify',
					title: '分类名称',
				},
				{
					type: 'image',
					dataIndex: 'imageUrl',
					class: 'poster_img',
					title: '分类顶部图片',
				},
				{
					type: 'string',
					width: '350',
					dataIndex: 'transitionState',
					title: '跳转页面',
					customRender: (row) => {
						return this.getTextByTransitionState(row.transitionState)
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this._newClassification(row, 2)
							},
						},
						{
							title: '删除',
							popconfirm: true,
							popconfirmTitle: '是否删除该分类',
							confirm: (row) => {
								this.deleteIt(row, 2)
							},
						},
					],
				},
			],
			pageTwo: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getBrandCategoryList()
				},
			},
			pageThree: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getBrandParentList()
				},
			},
			pageFour: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._findBrandCategoryClassifyByParam()
				},
			},
		}
	},
	created() {
		this._getBrandListConfiguration(true)
	},
	watch: {
		venuePricingformData: {
			handler: function (val) {
				this.counter = []
				this.venuePricingformCfg[1].hide = val.adjustment == 1 ? true : false
				this.venuePricingformCfg[2].hide = val.adjustment == 2 ? true : false
				this.venuePricingformCfg[3].hide = false
			},
			deep: true,
		},
	},
	methods: {
		// 获取商家列表
		async _findSupplierAccountNumberForList(query) {
			if (query !== '') {
				this.loading = true
				const paramJson = {
					startIndex: 0,
					length: 20,
					keyword: query,
				}
				const {
					data: { resultCode, resultData },
				} = await findSupplierAccountNumberForList(paramJson)

				if (resultCode == 0) {
					this.loading = false
					this.formDataSupplierAccountNumberList = resultData.list || []
					return
				}
			}
			this.formDataSupplierAccountNumberList = []
		},
		//么滴logo图片需要给黄色
		isRedRow({ row }) {
			if (!row.image || !row.brandLogoUrl) {
				return 'ffc94b'
			}
			return ''
		},
		//导出
		derive: async function () {
			let paramJson = Object.assign({}, this.formDataThree)
			paramJson.groupId = this.$store.state.user.userInfo.groupId
			console.log(paramJson)
			let { data } = await exportBrandParentList({
				data: JSON.stringify(paramJson),
			})
			downloadFile(data, '品牌列表.xlsx')
		},
		//批量搞logo
		uploadBrandLogoBatch(type) {
			this.brandLogoBatch = true
			this.$nextTick(() => {
				this.$refs.logoBatchMall.logoBatch(type)
			})
		},
		//新增 编辑 查看品牌
		newBrandHzw(data, type) {
			this.addNewBrandHzw = true
			//显示编辑弹框
			if (type == 2) {
				this.title = '编辑品牌'
				this.newBrandItem = data
				this.$nextTick(() => {
					this.$refs.brandMall.brandDetail(data, type)
				})
			} else if (type == 3) {
				this.title = '查看品牌'
				this.$nextTick(() => {
					this.$refs.brandMall.brandDetail(data, type)
				})
			} else {
				this.title = '新增品牌'
				this.newBrandItem = {}
			}
			console.log('品牌品类', type)
		},
		tableRowClassName({ row }) {
			if (row.businessLicenseUrls) {
				return 'ffc94b-row'
			}
			return ''
		},
		//分类列表弹窗
		_newClassification(data, type) {
			this.classifiedPopUps = true
			//显示编辑弹框
			if (type == 2) {
				this.title = '编辑分类'
				this.classifiedItem = data
				this.$nextTick(() => {
					this.$refs.accMall.accDetail(data, type)
				})
			} else {
				this.title = '新增分类'
				this.classifiedItem = {}
				this.$nextTick(() => {
					this.$refs.accMall.accDetail({}, type)
				})
			}
		},
		//跳转类型有点儿长 拎出来好看点
		getTextByTransitionState(value) {
			if (value == 1) {
				return '不跳'
				// } else if (value == 2) {
				// 	return '选品列表页'
				// } else if (value == 3) {
				// 	return '京东专区'
				// } else if (value == 4) {
				// 	return '我的推手'
				// } else if (value == 5) {
				// 	return '步数换首页'
				// } else if (value == 6) {
				// 	return '砍单专区'
			} else if (value == 8) {
				return '领券中心'
			} else if (value == 9) {
				return '指定品牌'
			} else if (value == 10) {
				return '满减/满折专区'
				// } else if (value == 11) {
				// 	return '活动预告'
			} else if (value == 12) {
				return '小程序直播'
			} else {
				return '-'
			}
		},
		//品牌品类新增 编辑弹窗
		newBrandCategories(data, type) {
			this.brandCategoryDialog = true
			//显示编辑弹框
			if (type == 2) {
				this.title = '编辑品牌品类'
				this.brandItem = data
				this.$nextTick(() => {
					this.$refs.addMall.addDetail(data, type)
				})
			} else {
				this.title = '新增品牌品类'
				this.brandItem = {}
			}
			console.log('品牌品类', type)
		},
		//文字处理元素（每个换行新增一个元素）
		textateaDisposePHtml(textareaStr) {
			let textareaStrPHtml = ''
			if (!isNull(textareaStr)) {
				let textareaStrArr = textareaStr.split('\n')
				for (let z = 0; z < textareaStrArr.length; z++) {
					textareaStrPHtml += textareaStrArr[z] + ','
				}
			}
			return textareaStrPHtml
		},
		//确定调价
		async priceAdjustment() {
			if (!this.venuePricingformData.adjustment) {
				this.$message({
					message: '请选择调价类型!',
					type: 'warning',
				})
				return
			}
			let notPass = false
			if (this.counter.length == 0) {
				this.$message({
					message: '请增加区间!',
					type: 'warning',
				})
				return
			}
			let aKeyPricingStr = ''
			let isPercentLow = 0 //供货价 0.正常加价，1.百分比
			let isPercentSup = 0 //最低建议价 0.正常加价，1.百分比
			this.counter.forEach((item) => {
				let settlementPriceTextOne = ''
				let settlementPriceTextTwo = '' //结算价
				let supplyPriceText = '' //供货价
				let suggestedRetailPrice = '' //建议销售价
				//选择结算价基础上调价
				if (this.venuePricingformData.adjustment == 2) {
					// if (!item.radioSupplyPriceOne || !item.radioSupplyPriceTwo) {
					// 	//供货价和建议零售价都要勾选一个
					// 	notPass = true
					// }
					//5.88.1版本改成双绑
					if (!item.radioSupplyPriceOne) {
						//供货价和建议零售价是同一个值
						notPass = true
					}
					if (
						isNull(item.settlementPriceOne) ||
						isNull(item.settlementPriceTwo)
					) {
						//结算价不可空
						notPass = true
					}
					if (
						(item.radioSupplyPriceOne == 1 &&
							isNull(item.plusSupplyPriceOne)) ||
						(item.radioSupplyPriceOne == 3 && isNull(item.plusSupplyPriceTwo))
					) {
						//供货价勾选后的输入框不可空
						notPass = true
					}
					if (
						(item.radioSupplyPriceTwo == 1 &&
							isNull(item.suggestedRetailPriceOne)) ||
						(item.radioSupplyPriceTwo == 3 &&
							isNull(item.suggestedRetailPriceThree))
					) {
						//建议零售价勾选后的输入框不可空
						notPass = true
					}
					//筛选填入的价格区间
					settlementPriceTextOne = item.settlementPriceOne
					settlementPriceTextTwo = item.settlementPriceTwo
					//供货价
					if (item.radioSupplyPriceOne == 1) {
						supplyPriceText = item.plusSupplyPriceOne
						suggestedRetailPrice = item.plusSupplyPriceOne //绑定供货价的输入框
					} else if (item.radioSupplyPriceOne == 3) {
						isPercentLow = 1
						supplyPriceText = item.plusSupplyPriceTwo
					} else if (item.radioSupplyPriceOne == 5) {
						supplyPriceText = null
					}
					//建议零售价
					if (item.radioSupplyPriceTwo == 1) {
						suggestedRetailPrice = item.suggestedRetailPriceOne
					} else if (item.radioSupplyPriceTwo == 3) {
						isPercentSup = 1
						suggestedRetailPrice = item.suggestedRetailPriceThree
					} else if (item.radioSupplyPriceTwo == 5) {
						suggestedRetailPrice = null
					}
					aKeyPricingStr +=
						settlementPriceTextOne +
						',' +
						settlementPriceTextTwo +
						',' +
						supplyPriceText +
						',' +
						suggestedRetailPrice +
						';'
				} else {
					// if (!item.radioSupplyPriceOne || !item.radioSupplyPriceTwo) {
					// 	//供货价和建议零售价都要勾选一个
					// 	notPass = true
					// }
					//5.88.1版本改成双绑
					if (!item.radioSupplyPriceOne) {
						//供货价和建议零售价是同一个值
						notPass = true
					}
					if (
						isNull(item.settlementPriceOne) ||
						isNull(item.settlementPriceTwo)
					) {
						//结算价不可空
						notPass == true
					}
					if (
						(item.radioSupplyPriceOne == 1 &&
							isNull(item.plusSupplyPriceOne)) ||
						(item.radioSupplyPriceOne == 3 &&
							isNull(item.plusSupplyPriceTwo)) ||
						(item.radioSupplyPriceOne == 2 &&
							isNull(item.minusSupplyPriceOne)) ||
						(item.radioSupplyPriceOne == 4 && isNull(item.minusSupplyPriceTwo))
					) {
						//供货价勾选后的输入框不可空
						notPass == true
					}
					if (
						(item.radioSupplyPriceTwo == 1 &&
							isNull(item.suggestedRetailPriceOne)) ||
						(item.radioSupplyPriceTwo == 3 &&
							isNull(item.suggestedRetailPriceThree)) ||
						(item.radioSupplyPriceTwo == 2 &&
							isNull(item.suggestedRetailPriceTwo)) ||
						(item.radioSupplyPriceTwo == 4 &&
							isNull(item.suggestedRetailPriceFour))
					) {
						//建议零售价勾选后的输入框不可空
						notPass == true
					}
					//筛选填入的价格区间
					settlementPriceTextOne = item.settlementPriceOne
					settlementPriceTextTwo = item.settlementPriceTwo
					//供货价 5.88.1改动
					if (item.radioSupplyPriceOne == 1) {
						supplyPriceText = item.plusSupplyPriceOne
						suggestedRetailPrice = item.plusSupplyPriceOne //绑定供货价的输入框
					} else if (item.radioSupplyPriceOne == 2) {
						supplyPriceText = item.minusSupplyPriceOne
					} else if (item.radioSupplyPriceOne == 3) {
						isPercentLow = 1
						supplyPriceText = item.plusSupplyPriceTwo
					} else if (item.radioSupplyPriceOne == 4) {
						supplyPriceText = item.minusSupplyPriceTwo
					} else if (item.radioSupplyPriceOne == 5) {
						supplyPriceText = null
						suggestedRetailPrice = null
					}
					//建议零售价 5.88.1改动
					// if (item.radioSupplyPriceTwo == 1) {
					// 	suggestedRetailPrice = item.suggestedRetailPriceOne
					// } else if (item.radioSupplyPriceTwo == 2) {
					// 	suggestedRetailPrice = item.suggestedRetailPriceTwo
					// } else if (item.radioSupplyPriceTwo == 3) {
					// 	isPercentSup = 1
					// 	suggestedRetailPrice = item.suggestedRetailPriceThree
					// } else if (item.radioSupplyPriceTwo == 4) {
					// 	suggestedRetailPrice = item.suggestedRetailPriceFour
					// } else if (item.radioSupplyPriceTwo == 5) {
					// 	suggestedRetailPrice = null
					// }
					aKeyPricingStr +=
						settlementPriceTextOne +
						',' +
						settlementPriceTextTwo +
						',' +
						supplyPriceText +
						',' +
						suggestedRetailPrice +
						';'
				}
				return item
			})
			console.log('aKeyPricingStr', aKeyPricingStr)
			console.log('row', this.counter)

			if (notPass) {
				this.$message({
					message: '请填写正确价格!',
					type: 'warning',
				})
				return
			}
			let params = {
				isPercentSup: isPercentSup,
				isPercentLow: isPercentLow,
				brandCategoryId: this.addBrandCategoryId,
				rule: aKeyPricingStr,
				brandId: this.addBrandId,
			}
			let {
				data: { resultCode },
			} = await batchUpdateGoodsPrice(params)
			if (resultCode == 0) {
				this.$message({
					message: '调价成功!',
					type: 'success',
				})
				this.venuePricingLoding = false
			}
		},
		// 添加区间
		cutOffTime() {
			this.counter.push({})
			this.sectionShow = true
		},
		// 删除区间
		thisSplice(index) {
			this.counter.splice(index, 1)
		},
		//一键调价弹窗
		async keyPricing(row) {
			this.counter = []
			this.addBrandCategoryId = row.brandCategoryId
			this.addBrandId = row.brandId
			this.adjustBran = row
			this.venuePricingLoding = true
			if (row.brandCategoryId) {
				let {
					data: { resultCode, resultData },
				} = await brandPriceAdjustmentLogList({
					brandCategoryId: row.brandCategoryId,
					brandId: row.brandId,
				})
				if (resultCode == 0) {
					this.adjustRecordTableData = resultData.brandPriceAdjustmentLogList
				}
				let res = await getBrandCategory({
					brandCategoryIdList: [row.brandCategoryId],
				})
				if (resultCode == 0) {
					let brandCategoryList = res.data.resultData.brandCategoryList
					if (this.adjustRecordTableData.length > 0) {
						this.adjustRecordTableData[0].brandCategoryName =
							brandCategoryList[0].brandCategoryName
						let sumData = []
						// sumData = sumData
						// 	.concat(this.adjustRecordTableData[0])
						// 	.concat(brandCategoryList[0])
						console.log('[[[p[p[p[p', sumData)
					}
				}
			}
		},
		//确定编辑购物须知
		async determineshoppingKnow() {
			console.log(this.buyerReadingFormData.brandId)
			let {
				data: { resultCode },
			} = await updateBrandShoppingNoticeById({
				brandId: this.buyerReadingFormData.brandId,
				shoppingNotice: this.$refs.um.editor.getContent(),
			})
			if (resultCode == 0) {
				this.$message({
					message: '编辑成功!',
					type: 'success',
				})
				this._getBrandListConfiguration()
				this.shoppingKnow = false
			}
		},
		//回显购物需知
		async shoppingKnowEdit(row) {
			this.shoppingKnow = true
			console.log(row, 'roroworwrwr===')
			this.buyerReadingFormData = row
			// row.shoppingNotice =
			// 	"<img src='https://image-test.weeget.cn/yhtplusFile/file/thirdParty/6af261675bdd43a496278c40def7f6e4/1631610950913_263578s.jpg' /><p>123</p>"

			this.$nextTick(() => {
				// this.$refs.um.editor.setContent('')
				this.information = row.shoppingNotice
			})
		},

		//操作记录
		async operatingRecord(row) {
			this.operatingRecordLoding = true
			let {
				data: { resultCode, resultData },
			} = await findAdjustRecordByBrandId({
				brandId: row.brandId,
			})
			if (resultCode === 0) {
				this.operatingRecordTableData = resultData.list
				this.operatingRecordPage.count = resultData.count
			} else {
				this.operatingRecordPage.count = 0
				this.operatingRecordTableData = []
			}
		},
		//同步erp信息
		async determineERP() {
			this.loading = true
			let params = this.formData105
			params.brandId = this.singleBrandId
			const {
				data: { resultCode },
			} = await uploadBrandGoodsList(params)
			this.loading = false
			if (resultCode == 0) {
				this.$message({
					message: '同步成功!',
					type: 'success',
				})
				this._getBrandListConfiguration()
			}
		},
		//获取ERP权限和回显信息
		async synchronizationERP(row) {
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await verifyErp({
				brandId: row.brandId,
			})
			this.loading = false
			if (resultCode == 0) {
				if (!resultData) {
					this.$message({
						message: 'ERP不可用!',
						type: 'warning',
					})
				} else {
					const {
						data: { syncEndTime, syncStartTime, lastSyncTime },
					} = await getUploadGoodsTime({
						brandId: row.brandId,
					})
					if (resultCode == 0) {
						this.formData105.syncStartTime = syncStartTime
						this.formData105.syncEndTime = syncEndTime
						this.formData105.lastSyncTime = lastSyncTime
						this.formData105.isSyncGoods = 0
					}
					this.synchronizationLoding = true
				}
				this._getBrandListConfiguration()
			}
		},
		//清除库存
		async removeLibrary(row) {
			this.loading = true
			const {
				data: { resultCode },
			} = await refreshGoodsGroupLockingStock({
				brandId: row.brandId,
			})
			this.loading = false
			if (resultCode == 0) {
				this.$message({
					message: '清除成功!',
					type: 'success',
				})
				this._getBrandListConfiguration()
			}
		},
		//删除
		async deleteIt(row, type) {
			this.loading = true
			let deleteUrl = null
			let deleteParameter = {}
			if (type == 1) {
				deleteParameter.brandId = row.brandId
				if (!row.brandId) {
					this._getBrandListConfiguration() //会场
					return
				}
				deleteUrl = deleteBrandByBrandId
			} else if (type == 2) {
				deleteParameter.classifyId = row.id
				if (!row.id) {
					this._findBrandCategoryClassifyByParam() //分类
					return
				}
				deleteUrl = deleteBrandCategoryClassify
			} else if (type == 3) {
				deleteParameter.brandCategoryId = row.brandCategoryId
				if (!row.brandCategoryId) {
					this._getBrandCategoryList() //品牌品类
					return
				}
				deleteUrl = delBrandCategory
			} else if (type == 4) {
				deleteParameter.brandParentId = row.brandParentId
				if (!row.brandParentId) {
					this._getBrandParentList() //品牌列表
					return
				}
				deleteUrl = delBrandParent
			}
			const {
				data: { resultCode },
			} = await deleteUrl(deleteParameter)
			this.loading = false
			if (resultCode == 0) {
				this.$message({
					message: '删除成功!',
					type: 'success',
				})
				//刷新列表
				if (type == 1) {
					this._getBrandListConfiguration() //会场
				} else if (type == 2) {
					this._findBrandCategoryClassifyByParam() //分类
				} else if (type == 3) {
					this._getBrandCategoryList() //品牌品类
				} else if (type == 4) {
					this._getBrandParentList() //品牌列表
				}
			}
		},
		//标记，取消标记
		async banIt(row) {
			this.loading = true
			let addUrl = row.selectionTag == 1 ? tagSelection : cancelTag
			const {
				data: { resultCode },
			} = await addUrl({
				brandIds: [row.brandId],
			})
			this.loading = false
			if (resultCode == 0) {
				this.$message({
					message: `${row.selectionTag != 1 ? '取消标记' : '标记'}成功!`,
					type: 'success',
				})
				this._getBrandListConfiguration()
			}
		},
		//会场列表同步小程序
		async synchronizeApplets() {
			const {
				data: { resultCode, resultMsg },
			} = await removeGoodsRedis()

			if (resultCode == 0) {
				this.$message.success(resultMsg)
			}
		},
		//分类列表同步小程序
		async _refreshBrandCategoryClassifyCache() {
			const {
				data: { resultCode, resultMsg },
			} = await refreshBrandCategoryClassifyCache()

			if (resultCode == 0) {
				this.$message.success(resultMsg)
			}
		},
		// 多选
		selectionChange(row) {
			this.selectionData = row
		},
		//批量标记选品
		batchLabelSelections() {
			let ids = []
			this.selectionData.map((item) => {
				if (item.selectionTag == 1) {
					ids.push(item.brandId)
				}
			})
			if (ids.length == 0) {
				return this.$message.warning('请选择可操作的会场')
			}
			if (ids.length > 10) {
				return this.$message.warning('只能勾选10条会场进行操作')
			}
			// const idsArr = ids.filter((i) => i)
			const paramJson = Object.assign(
				{},
				{
					brandIds: ids,
				}
			)
			this.$confirm(`确认要批量标记${ids.length}个会场吗？`, '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						let {
							data: { resultMsg = '', resultCode },
						} = await tagSelection(paramJson)
						if (resultCode == 0) {
							this.$message.success(resultMsg)
						}
						this._getBrandListConfiguration(true)
					}
				},
			})
		},
		// tab切换
		handleClick(tab) {
			if (tab.name == 'one') {
				this._getBrandListConfiguration()
			} else if (tab.name == 'two') {
				this._getBrandCategoryList()
			} else if (tab.name == 'three') {
				this._getBrandParentList()
			} else if (tab.name == 'four') {
				this._findBrandCategoryClassifyByParam()
			}
		},
		// 子组件调用父组件会场列表方法更新
		fatherMethodOne() {
			this._getBrandListConfiguration()
		},
		// 子组件调用父组件品牌品类列表列表方法更新
		fatherbrandCategory() {
			this._getBrandCategoryList()
		},
		// 子组件调用父组件分类列表列表方法更新
		classifiedBrand() {
			this._findBrandCategoryClassifyByParam()
		},
		// 子组件调用父组件品牌列表列表方法更新
		fatherNewBrandCategory() {
			this._getBrandParentList()
		},
		//品牌列表搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(
				JSON.parse(JSON.stringify(this.formDataOne)),
				{
					length: this.page.length,
					startIndex: 0,
				}
			)
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			if (paramJson.keywordList.length > 0) {
				let keywordSplit
				// keywordSplit = String(paramJson.keywordList)
				keywordSplit = paramJson.keywordList.replaceAll('\n', ',').split(',')
				paramJson.keywordList = keywordSplit
			} else {
				paramJson.keywordList = []
			}

			return paramJson
		},
		// 搜索条件
		findSearchParamsTwo(flag) {
			if (flag) {
				this.pageTwo.currentPage = 1
			}
			let paramJson = Object.assign(this.formDataTwo, {
				length: this.pageTwo.length,
				startIndex: 0,
			})
			paramJson.startIndex =
				(this.pageTwo.currentPage - 1) * this.pageTwo.length
			// 每页的加载数据长度
			paramJson.length = this.pageTwo.length
			// 当前页的条数开始
			return paramJson
		},
		findSearchParamsThree(flag) {
			if (flag) {
				this.pageThree.currentPage = 1
			}
			let paramJson = Object.assign(this.formDataThree, {
				length: this.pageThree.length,
				startIndex: 0,
			})
			paramJson.startIndex =
				(this.pageThree.currentPage - 1) * this.pageThree.length
			// 每页的加载数据长度
			paramJson.length = this.pageThree.length
			// 当前页的条数开始

			return paramJson
		},
		findSearchParamsFour(flag) {
			let paramJson = {}
			paramJson.length = this.pageFour.length
			// 当前页的条数开始
			if (flag) {
				this.pageFour.currentPage = 1
			}
			paramJson.groupId = 2
			paramJson.startIndex =
				(this.pageFour.currentPage - 1) * this.pageFour.length
			return paramJson
		},
		//获取品牌列表
		async _getBrandListConfiguration(flag) {
			let paramJson = this.findSearchParams(flag)
			this.brandLoging = true
			let {
				data: {
					resultCode,
					resultData: { brandList = [], brandCount = 0 },
				},
			} = await getBrandListConfiguration(paramJson)
			this.brandLoging = false
			if (resultCode == 0) {
				this.tableData = brandList
				this.page.count = brandCount
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		// 获取品牌品类列表
		async _getBrandCategoryList(flag) {
			let paramJson = this.findSearchParamsTwo(flag)
			this.loadingTwo = true
			let res = await getBrandCategoryList(paramJson)
			if (
				res.data.resultData.brandCategoryList &&
				res.data.resultData.brandCategoryList.length
			) {
				this.tableDataSecond = res.data.resultData.brandCategoryList
				this.pageTwo.count = res.data.resultData.count
				this.loadingTwo = false
			} else {
				this.pageTwo.count = 0
				this.tableDataSecond = []
				this.loadingTwo = false
			}
		},
		// 获取品牌列表
		async _getBrandParentList(flag) {
			let paramJson = this.findSearchParamsThree(flag)
			this.loadingThree = true
			let {
				data: {
					resultCode,
					resultData: { brandParentList = [], count = 0 },
				},
			} = await getBrandParentList(paramJson)
			if (resultCode == 0) {
				this.tableDataBrand = brandParentList.map((item) => {
					item.brandLogoUrl = item.brandLogoUrl
						? getBigImg(item.brandLogoUrl)
						: ''
					return item
				})
				for (let i = 0; i < this.tableDataBrand.length; i++) {
					if (this.tableDataBrand[i].image) {
						this.tableDataBrand[i].imageUrl = this.tableDataBrand[i].image
							.imageUrl
							? getBigImg(this.tableDataBrand[i].image.imageUrl)
							: ''
					}
				}
				this.pageThree.count = count
				this.loadingThree = false
			} else {
				this.pageThree.count = 0
				this.tableDataBrand = []
				this.loadingThree = false
			}
		},
		// 获取分类列表
		async _findBrandCategoryClassifyByParam() {
			this.loadingFour = true
			let paramJson = this.findSearchParamsFour()
			let {
				data: {
					resultCode,
					resultData: { brandCategoryClassifyList = [], count = 0 },
				},
			} = await findBrandCategoryClassifyByParam(paramJson)
			if (resultCode == 0) {
				this.tableDataClassify = brandCategoryClassifyList.map((item) => {
					item.imageUrl = getBigImg(item.imageUrl)
					return item
				})
				this.pageFour.count = count
				this.loadingFour = false
			} else {
				this.pageFour.count = 0
				this.tableDataClassify = []
				this.loadingFour = false
			}
		},
		// 弹窗显示
		handleEdit(data, type) {
			this.userDialog = true
			//显示编辑弹框
			if (type == 2) {
				this.title = '编辑会场'
				this.editItem = data
				this.$nextTick(() => {
					this.$refs.mall.detail(data, type)
				})
			} else {
				this.title = '新增会场'
				this.editItem = {}
				this.$nextTick(() => {
					this.$refs.mall.detail(data, type)
				})
			}
			console.log('ggggggggg', type)
		},
	},
}
</script>
<style lang="scss">
.el-table .ffc94b {
	background-color: #ffc94b;
}
.poster_img {
	width: 50px;
	height: 50px;
}
.w80 {
	width: 80px;
}
.textm {
	margin-left: -403px;
	margin-top: 30px;
}
.el-table .ffc94b-row {
	background-color: #ffc94b;
	.el-table__row:hover td {
		background-color: #ffc94b;
	}
}
.el-table--enable-row-hover
	.el-table__body
	.ffc94b-row:hover
	> td.el-table__cell {
	background-color: #ffc94b;
}
</style>

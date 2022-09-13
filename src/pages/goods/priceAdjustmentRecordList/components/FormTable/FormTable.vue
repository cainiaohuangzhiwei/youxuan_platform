<template>
	<basic-container>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane
				v-auth="'pagePlatformAdjustmentByCategory'"
				label="商家+品牌+类目"
				name="one"
			>
				<yx-form
					style="display: contents"
					:inline="true"
					:data="formData103"
					:items="formCfg103"
					:formAction="formAction103"
				>
					<template #goodsCategoryName>
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
					<template #brand>
						<el-input
							placeholder="请选择品牌"
							v-model="formData103.brandParentName"
							clearable
							@clear="
								() => {
									formData103.brandParentName = ''
									formData103.brandParentId = ''
								}
							"
							@focus="selectBrand(formData103.brandParentId, 1, false)"
						>
							<el-button
								@click="showDialog101(formData103.brandParentId, 1, false)"
								slot="append"
								icon="el-icon-more"
							></el-button>
						</el-input>
					</template>
				</yx-form>
				<el-button
					type="primary"
					v-auth="'importPlatformAdjustmentByCategory'"
					@click="
						$router.push({
							path: `platformPricingImport/${skipType}`,
						})
					"
					>导入批量平台调价数据</el-button
				>
				<el-button
					type="primary"
					v-auth="'exportPlatformAdjustmentByCategory'"
					@click="derivePricing()"
					>导出</el-button
				>
				<yx-table
					v-loading="loadingOne"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				></yx-table>
			</el-tab-pane>
			<el-tab-pane
				v-auth="'pagePlatformAdjustmentByGoods'"
				label="商品"
				name="two"
			>
				<yx-form
					style="display: contents"
					:inline="true"
					:data="formData106"
					:items="formCfg106"
					:formAction="formAction103"
				>
					<template #supplierName>
						<el-autocomplete
							v-model="formData106.supplierName"
							debounce
							placeholder="请输入商家名称"
							value-key="supplierName"
							label="supplierName"
							:fetch-suggestions="_getCmsSupplierListByCondition"
							@select="handleBrandName"
							@focus="handleFocusBrandName"
						>
							<el-button
								slot="append"
								icon="el-icon-more"
								@click="formsDialog = true"
							></el-button>
						</el-autocomplete>
					</template>
					<template #brandId>
						<el-input
							placeholder="请选择品牌"
							v-model="formData106.brandParentName"
							clearable
							@clear="
								() => {
									formData106.brandParentName = ''
									formData106.brandParentId = ''
								}
							"
							@focus="selectBrand(formData106.brandParentId, 1, true)"
						>
							<el-button
								@click="showDialog101(formData106.brandParentId, 1, true)"
								slot="append"
								icon="el-icon-more"
							></el-button>
						</el-input>
					</template>
				</yx-form>
				<el-button
					type="primary"
					v-auth="'importPlatformAdjustmentByGoods'"
					@click="
						$router.push({
							path: `platformPricingImport/${skipType}`,
						})
					"
					>导入批量平台调价数据</el-button
				>
				<el-button
					type="primary"
					v-auth="'exportPlatformAdjustmentByGoods'"
					@click="derivePricing()"
					>导出</el-button
				>
				<yx-table
					v-loading="loadingTwo"
					:columns="tableColumnsTwo"
					:pagination="pageTwo"
					:data="tableDataSecond"
				></yx-table>
			</el-tab-pane>
		</el-tabs>
		<!-- 查看处理详情 -->
		<Dialog title="商品处理状态" :visible.sync="detailsDialog">
			<yx-form
				:inline="true"
				:data="detailsFormData"
				:items="detailsFormCfg"
				:formAction="detailsFormAction"
			>
			</yx-form>
			<yx-table
				v-loading="detailsLoading"
				:columns="detailsTableColumns"
				:pagination="detailsPage"
				:data="detailsTableData"
			>
			</yx-table>
		</Dialog>

		<Dialog
			title="选择品牌"
			:visible.sync="dialogVisible101"
			:width="dialogWidth101"
			:bottomBtn="dialogBottomBtn101"
		>
			<yx-form
				:inline="true"
				:data="formData123"
				:items="formCfg123"
				:formAction="formAction123"
			>
			</yx-form
			><yx-table
				v-loading="loading102"
				:columns="tableColumns102"
				:pagination="page102"
				:data="tableData102"
			>
				<template slot="brandParentId" slot-scope="scope">
					<el-radio
						v-model="brandParentId"
						:label="scope.row.brandParentId"
						@change="changeGoodsGroup(scope.row)"
						>选择</el-radio
					>
				</template>
			</yx-table>
			<div class="btn"></div>
		</Dialog>
		<!-- 商家列表 -->
		<supply-dialog
			:itemInfo="supplyRow"
			:visible.sync="formsDialog"
			@fatherMethodInit="
				(row) => {
					formData106.supplierName = row.supplierName
					formData106.supplierId = row.supplierId
				}
			"
		/>
	</basic-container>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import {
	pagePlatformAdjustmentByCategory,
	pagePlatformAdjustmentByGoods,
	exportPlatformAdjustmentByGoods,
	exportPlatformAdjustmentByCategory,
} from '@/api/deduction'
import { checkFunctionCode } from '@/utils/auth'
import { commissionGoodsCategoryTree } from '@/api/grossMargins'
import { getBrandParentList } from '@/api/yhtPlusWebGoods'
import Dialog from '@/components/Dialog'
import SupplyDialog from '@/components/SupplyDialog'
import YxForm from '@wg-vue-materials/yx-form'
import { getCmsSupplierListByCondition } from '@/api/yhtPlusCmsSupplier'
import { imgCosServerPath } from '@/utils/imageTool'
export default {
	components: {
		BasicContainer,
		YxTable,
		Dialog,
		YxForm,
		SupplyDialog,
	},
	name: 'FormTable',
	data() {
		return {
			pagePlatformAdjustmentByCategory: checkFunctionCode(
				'pagePlatformAdjustmentByCategory'
			), // 商家+品牌+类目权限
			pagePlatformAdjustmentByGoods: checkFunctionCode(
				'pagePlatformAdjustmentByGoods'
			), // 商品权限
			skipType: 1, //点击table
			activeName: 'one',
			tableData: [],
			tableDataSecond: [],
			userDialog: false,
			loadingOne: false,
			loadingTwo: false,
			formsDialog: false,
			detailsDialog: false,
			detailsLoading: false,
			detailsTableData: [],
			detailsTableColumns: [
				{
					type: 'string',
					dataIndex: 'goodsNumber',
					title: '货号',
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '处理状态',
					customRender: (row) => {
						return row.status == 1
							? '处理中'
							: row.status == 2
							? '处理成功'
							: '处理失败'
					},
				},
			],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'supplierId',
					title: '商家ID',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
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
					dataIndex: 'goodsCategoryName',
					title: '类目',
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '商品定价处理状态',
					customRender: (row) => {
						return row.status == 1
							? '处理中'
							: row.status == 2
							? '处理成功'
							: '处理失败'
					},
				},
				{
					type: 'string',
					dataIndex: 'erpName',
					title: '总商品数量/成功/失败',
					customRender: (row) => {
						return (
							row.goodsTotalCount +
							'/' +
							row.goodsSuccessCount +
							'/' +
							row.goodsFailCount
						)
					},
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'data',
					dataIndex: 'finishTime',
					title: '完成时间',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '查看处理详情',
							click: (row) => {
								this.adjustmentPriceRecordId = row.adjustmentPriceRecordId
								this.detailsDialog = true
								this.detailsFormData = {
									goodsNumber: '',
									status: '',
								}
								this.viewProcessingDetails()
							},
						},
					],
				},
			],
			dialogBottomBtn101: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
			],
			formCfg106: [
				{
					type: 'textarea',
					title: '商品货号',
					dataIndex: 'goodsNumber',
					placeholder: '请输入商品货号,多个商品货号用逗号隔开或者换行',
				},
				{
					title: '商家',
					type: 'custom',
					dataIndex: 'supplierName',
				},
				{
					title: '品牌',
					type: 'custom',
					dataIndex: 'brandId',
				},
				{
					type: 'select',
					title: '商品定价处理状态',
					dataIndex: 'status',
					placeholder: '请选择商品定价处理状态',
					label: 'value',
					options: [
						{
							status: '',
							value: '全部',
						},
						{
							status: '1',
							value: '处理中',
						},
						{
							status: '2',
							value: '处理成功',
						},
						{
							status: '3',
							value: '处理失败',
						},
					],
				},
				{
					title: '添加时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['开始时间', '结束时间'],
				},
			],

			formData106: {
				supplierName: '',
				supplierId: '',
				goodsNumber: '',
				status: '',
				addTimeStart: '',
				addTimeEnd: '',
				brandParentId: '',
				brandParentName: '',
			},
			supplyRow: {}, // 商家当前行选中数据
			dialogVisible101: false,
			brandParentId: '',
			formData123: {
				keyword: '',
				brandParentId: '',
			},
			formCfg123: [
				{
					title: '筛选',
					type: 'input',
					dataIndex: 'keyword',
					placeholder: '品牌名称',
				},
			],
			formAction123: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getData102(true)
					},
				},
			],
			tableColumns102: [
				{
					type: 'custom',
					dataIndex: 'brandParentId',
				},
				{
					type: 'string',
					dataIndex: 'brandParentName',
					title: '品牌名称',
				},
			],
			tableData102: [],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._pagePlatformAdjustmentByCategory()
				},
			},
			pageTwo: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._pagePlatformAdjustmentByGoods()
				},
			},
			page102: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData102()
				},
			},
			detailsPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.viewProcessingDetails()
				},
			},
			formData103: {
				supplierIdList: '',
				supplierName: '',
				categoryId: '',
				brandParentId: '',
				brandParentName: '',
				shelfState: '',
				addTimeStart: '',
				addTimeEnd: '',
				status: '',
			},
			formCfg103: [
				{
					type: 'textarea',
					title: '商家名称',
					dataIndex: 'supplierName',
					placeholder: '请输入商家名称,多个商家用逗号隔开或者换行',
				},
				{
					type: 'textarea',
					title: '商家ID',
					dataIndex: 'supplierIdList',
					placeholder: '请输入商家ID,多个商家用逗号隔开或者换行',
				},
				{
					title: '商品类目',
					type: 'custom',
					dataIndex: 'goodsCategoryName',
				},
				{
					title: '品牌',
					type: 'custom',
					dataIndex: 'brand',
				},
				{
					type: 'select',
					title: '商品定价处理状态',
					dataIndex: 'status',
					placeholder: '请选择商品定价处理状态',
					label: 'value',
					options: [
						{
							status: '',
							value: '全部',
						},
						{
							status: '1',
							value: '处理中',
						},
						{
							status: '2',
							value: '处理成功',
						},
					],
				},
				{
					title: '添加时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['开始时间', '结束时间'],
				},
			],
			formAction103: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (this.skipType == 1) {
							this._pagePlatformAdjustmentByCategory(true)
						} else {
							this._pagePlatformAdjustmentByGoods(true, null)
						}
					},
				},
			],
			goodsCategoryList: [], //商品类目

			tableColumnsTwo: [
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'string',
					dataIndex: 'brandParentName',
					title: '品牌',
				},
				{
					type: 'string',
					dataIndex: 'goodsNumber',
					title: '商品货号',
				},
				{
					type: 'string',
					dataIndex: 'adjustmentRecord',
					title: '平台调价记录',
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '商品定价处理状态',
					customRender: (row) => {
						return row.status == 1
							? '处理中'
							: row.status == 2
							? '处理成功'
							: '处理失败'
					},
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'data',
					dataIndex: 'finishTime',
					title: '完成时间',
				},
			],
			detailsFormData: {
				goodsNumber: '',
				status: '',
			}, //查看处理详情弹窗查询
			detailsFormCfg: [
				{
					type: 'input',
					title: '商品货号',
					dataIndex: 'goodsNumber',
					placeholder: '请输入商品货号',
				},
				{
					type: 'select',
					title: '商品定价处理状态',
					dataIndex: 'status',
					placeholder: '请选择商品定价处理状态',
					label: 'value',
					options: [
						{
							status: '',
							value: '全部',
						},
						{
							status: '1',
							value: '处理中',
						},
						{
							status: '2',
							value: '处理成功',
						},
						{
							status: '3',
							value: '处理失败',
						},
					],
				},
			],
			detailsFormAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.viewProcessingDetails(true)
					},
				},
			],
			adjustmentPriceRecordId: null,
			boolean: false,
		}
	},
	created() {
		if (this.pagePlatformAdjustmentByCategory) {
			this._pagePlatformAdjustmentByCategory(true)
		}
		this.getGoodsCategoryList() // 获取商品类目
	},
	methods: {
		//查看处理详情
		async viewProcessingDetails(flag) {
			let paramJson = this.findSearchParamsDetails(flag)
			paramJson.adjustmentPriceRecordId = this.adjustmentPriceRecordId
			let {
				data: { resultCode, resultData },
			} = await pagePlatformAdjustmentByGoods(paramJson)
			if (resultCode === 0) {
				this.detailsTableData = resultData.recordList
				this.detailsPage.count = resultData.totalCount
			} else {
				this.detailsTableData = []
				this.detailsPage.count = 0
			}
		},
		//查看处理详情
		findSearchParamsDetails(flag) {
			// 当前页的条数开始
			if (flag) {
				this.detailsPage.currentPage = 1
			}
			const paramJson = Object.assign(this.detailsFormData, {
				length: this.detailsPage.length,
				startIndex:
					(this.detailsPage.currentPage - 1) * this.detailsPage.length,
			})
			return paramJson
		},
		//导出
		async derivePricing() {
			let paramJson =
				this.skipType == 1
					? this.findSearchParams()
					: this.findSearchParamsByGoods()
			paramJson.listPath = '商品>平台调价记录列表'
			let Url =
				this.skipType == 1
					? exportPlatformAdjustmentByCategory
					: exportPlatformAdjustmentByGoods
			paramJson.groupId = this.$store.state.user.userInfo.groupId
			let {
				data: { resultCode, resultData },
			} = await Url(paramJson)
			if (resultCode == 0) {
				if (resultData.remoteFilePath) {
					resultData.remoteFilePath = resultData.remoteFilePath.replace(
						'/data/yhtplusFile/',
						''
					)
					const elt = document.createElement('a')
					elt.setAttribute('href', imgCosServerPath + resultData.remoteFilePath)
					elt.setAttribute('download', 'file.xlsx')
					elt.style.display = 'none'
					document.body.appendChild(elt)
					elt.click()
					document.body.removeChild(elt)
					// window.open(imgCosServerPath + resultData.remoteFilePath)
				}
			}
		},
		//类目
		getGoodsCategoryList: async function () {
			let {
				data: { resultCode = 0, resultData = [] },
			} = await commissionGoodsCategoryTree()
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
					item.disabled = true
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
		//类目id
		handleChange(e) {
			console.log(e)
			this.formData103.categoryId = e[e.length - 1]
			// this._getYouxuanGoodsList(true)
		},
		//品牌
		selectBrand(brandParentId, type, boolean) {
			this.boolean = boolean
			console.log('brandParentId>>>>', brandParentId, type)
			this.brandParentType = type
			this.formData123.keyword = ''
			this.getData102(true)
			this.dialogVisible101 = true
			this.brandParentId = brandParentId
		},
		// 确定
		submitForm() {
			if (
				(!this.boolean &&
					!this.formData103.brandParentId &&
					this.brandParentType == 1) ||
				(this.boolean &&
					!this.formData106.brandParentId &&
					this.brandParentType == 1)
			) {
				return this.$message.warning('请选择品牌')
			}
			this.dialogVisible101 = false

			// this.$emit('fatherMethodInit', this.brandList)
		},
		showDialog101(brandParentId, type, boolean) {
			this.boolean = boolean
			this.brandParentType = type
			console.log('brandParentId>>>>', brandParentId, type)
			this.formData123.keyword = ''
			this.brandParentId = brandParentId
			this.getData102(true)
			this.dialogVisible101 = true
		},
		findSearchParams123(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			const paramJson = Object.assign(this.formData123, {
				length: this.page102.length,
				startIndex: (this.page102.currentPage - 1) * this.page102.length,
			})
			return paramJson
		},
		getData102: async function (flag) {
			this.loading102 = true
			let paramJson = this.findSearchParams123(flag)
			const {
				data: { resultCode, resultData },
			} = await getBrandParentList(paramJson)
			if (resultCode == 0) {
				this.tableData102 = resultData.brandParentList
				this.page102.count = resultData.count
			} else {
				this.tableData102 = []
				this.page102.count = 0
			}
			this.loading102 = false
		},
		//选择品牌
		changeGoodsGroup(row) {
			if (this.boolean) {
				this.formData106.brandParentId = row.brandParentId
				this.formData106.brandParentName = row.brandParentName
			} else {
				this.formData103.brandParentId = row.brandParentId
				this.formData103.brandParentName = row.brandParentName
			}
		},
		// 操作商家
		handleBrandName(item) {
			this.formData106.supplierName = item.supplierName
			this.formData106.supplierId = item.supplierId
		},
		// 获取商家
		handleFocusBrandName() {
			this.formData106.supplierId = ''
			this.formData106.supplierName = ''
		},

		// 获取商家列表
		async _getCmsSupplierListByCondition(queryString, callback) {
			const paramJson = {
				startIndex: 0,
				length: 20,
				supplierName: queryString,
			}
			const {
				data: { resultCode, resultData },
			} = await getCmsSupplierListByCondition(paramJson)

			if (resultCode == 0 && resultData.supplierList.length > 0) {
				callback(resultData.supplierList)
			}
		},
		// tab切换
		handleClick(tab) {
			if (tab.name == 'one') {
				this.skipType = 1
				if (this.pagePlatformAdjustmentByCategory) {
					//权限
					this._pagePlatformAdjustmentByCategory()
				}
			} else {
				this.skipType = 2
				if (this.pagePlatformAdjustmentByGoods) {
					this._pagePlatformAdjustmentByGoods()
				}
			}
		},
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = Object.assign(this.formData103, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})
			if (paramJson.supplierIdList) {
				while (paramJson.supplierIdList.indexOf('，') != -1)
					paramJson.supplierIdList = paramJson.supplierIdList
						.replace(/\n/g, ',')
						.replace('，', ',')
				paramJson.supplierIdList = paramJson.supplierIdList.replace(/\s*/g, '') //商品货号
			}
			if (paramJson.supplierName) {
				paramJson.supplierName = paramJson.supplierName.replace(/\n/g, ',')
				paramJson.supplierName = paramJson.supplierName.replace(/\s*/g, '') //商品货号
			}
			return paramJson
		},
		findSearchParamsByGoods(flag) {
			// 当前页的条数开始
			if (flag) {
				this.pageTwo.currentPage = 1
			}
			const paramJson = Object.assign(this.formData106, {
				length: this.pageTwo.length,
				startIndex: (this.pageTwo.currentPage - 1) * this.pageTwo.length,
			})
			if (paramJson.goodsNumber) {
				paramJson.goodsNumber = paramJson.goodsNumber.replace(/\n/g, ',')
				paramJson.goodsNumber = paramJson.goodsNumber.replace(/\s*/g, '') //商品货号
			}

			return paramJson
		},
		//获取商家+品牌+类目
		async _pagePlatformAdjustmentByCategory(flag) {
			this.loadingOne = true
			let paramJson = this.findSearchParams(flag)
			if (paramJson.supplierIdList && paramJson.supplierName) {
				return this.$message.warning('商家id和商家名称不能同时查询')
			}
			let {
				data: { resultCode, resultData },
			} = await pagePlatformAdjustmentByCategory(paramJson)
			if (resultCode == 0) {
				this.tableData = resultData.recordList
				this.page.count = resultData.totalCount
				this.loadingOne = false
			} else {
				this.tableData = []
				this.page.count = 0
				this.loadingOne = false
			}
		},
		// 获取商品
		async _pagePlatformAdjustmentByGoods(flag) {
			this.loadingTwo = true
			let paramJson = this.findSearchParamsByGoods(flag)
			let {
				data: { resultCode, resultData },
			} = await pagePlatformAdjustmentByGoods(paramJson)
			if (resultCode == 0) {
				this.tableDataSecond = resultData.recordList
				this.pageTwo.count = resultData.totalCount
				this.loadingTwo = false
			} else {
				this.tableData = []
				this.pageTwo.count = 0
				this.loadingTwo = false
			}
		},
	},
}
</script>
<style lang="scss">
.poster_img {
	width: 50px;
	height: 50px;
}
.mb20 {
	margin-bottom: 20px;
}
</style>

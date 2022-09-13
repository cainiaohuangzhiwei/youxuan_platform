<!--
 * @Description: 导入操作主页面
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-08-29 16:13:59
 * @LastEditTime: 2021-04-19 11:14:45
 * @LastEditors: 你的名字
-->
<template>
	<div>
		<el-tabs v-model="editableTabsValue" type="card">
			<template v-for="item in editableTabs">
				<el-tab-pane
					v-if="item.auth"
					:key="item.name"
					:label="item.title"
					:name="item.name"
				>
					<!-- <keep-alive>
						<ImportGoods
							v-if="editableTabsValue === 'ImportGoods'"
							@openBrandDialog="openBrandDialog"
							:brandData="brandNameList.importGoodsBrandData"
						>
						</ImportGoods>
					</keep-alive> -->
					<keep-alive>
						<ImportGoodsImage
							v-if="editableTabsValue === 'ImportGoodsImage'"
							@openBrandDialog="openBrandDialog"
							:brandData="brandNameList.importGoodsImageBrandData"
						>
						</ImportGoodsImage>
					</keep-alive>
					<keep-alive>
						<StockTaking
							v-if="editableTabsValue === 'StockTaking'"
							@openBrandDialog="openBrandDialog"
							:brandData="brandNameList.stockTakingGoodsDownloadBrand"
						>
						</StockTaking>
					</keep-alive>
					<keep-alive>
						<Replenishment
							v-if="editableTabsValue === 'Replenishment'"
							@openBrandDialog="openBrandDialog"
							:brandData="brandNameList.ReplenishmentBrand"
						>
						</Replenishment>
					</keep-alive>
					<!-- <keep-alive>
						<ImportDeliver
							v-if="editableTabsValue === 'ImportDeliver'"
							@openBrandDialog="openBrandDialog"
							:brandData="brandNameList.ImportDeliverBrand"
						>
						</ImportDeliver>
					</keep-alive> -->
					<keep-alive>
						<ImportCheckGoods v-if="editableTabsValue === 'ImportCheckGoods'">
						</ImportCheckGoods>
					</keep-alive>
					<!-- <keep-alive>
						<EditLogisticsNo v-if="editableTabsValue === 'EditLogisticsNo'">
						</EditLogisticsNo>
					</keep-alive> -->
					<keep-alive>
						<EditGoodsMsg
							v-if="editableTabsValue === 'EditGoodsMsg'"
							@openBrandDialog="openBrandDialog"
							:brandData="brandNameList.EditGoodsMsgBrand"
						>
						</EditGoodsMsg>
					</keep-alive>
					<keep-alive>
						<EditGoodsPrice
							v-if="editableTabsValue === 'EditGoodsPrice'"
							@openBrandDialog="openBrandDialog"
							:brandData="brandNameList.EditGoodsPriceBrand"
						>
						</EditGoodsPrice>
					</keep-alive>
					<keep-alive>
						<ReconciliationData
							v-if="editableTabsValue === 'ReconciliationData'"
						>
						</ReconciliationData>
					</keep-alive>
					<keep-alive>
						<ImportBrands v-if="editableTabsValue === 'ImportBrands'">
						</ImportBrands>
					</keep-alive>
					<keep-alive>
						<BatchCommodityCategories
							v-if="editableTabsValue === 'BatchCommodityCategories'"
							@openBrandDialog="openBrandDialog"
							:brandData="brandNameList.EditCategoriesBrand"
						>
						</BatchCommodityCategories>
					</keep-alive>
				</el-tab-pane>
			</template>
		</el-tabs>
		<BrandDialog :visible.sync="brandDialog" @chooseBrand="chooseBrand" />
	</div>
</template>
<script>
// import ImportGoods from './tabs/ImportGoods'
import ImportGoodsImage from './tabs/ImportGoodsImage'
import StockTaking from './tabs/StockTaking'
import Replenishment from './tabs/Replenishment'
// import ImportDeliver from './tabs/ImportDeliver'
import ImportCheckGoods from './tabs/ImportCheckGoods'
// import EditLogisticsNo from './tabs/EditLogisticsNo'
import EditGoodsMsg from './tabs/EditGoodsMsg'
import EditGoodsPrice from './tabs/EditGoodsPrice'
import ImportBrands from './tabs/ImportBrands'
import BatchCommodityCategories from './tabs/BatchCommodityCategories'
import ReconciliationData from './tabs/ReconciliationData'
import { getWarehouseList } from '@/api/warehouse.js'
import BrandDialog from './components/brandDialog'
import { checkFunctionCode } from '@/utils/auth.js'
export default {
	name: 'Actions',
	components: {
		// ImportGoods,
		ImportGoodsImage,
		StockTaking,
		Replenishment,
		// ImportDeliver,
		ImportCheckGoods,
		// EditLogisticsNo,
		EditGoodsMsg,
		EditGoodsPrice,
		BrandDialog,
		ReconciliationData,
		ImportBrands,
		BatchCommodityCategories,
	},
	data() {
		return {
			brandDialog: false,
			currentBrandDialog: '',
			brandNameList: {
				importGoodsBrandData: '',
				importGoodsImageBrandData: '',
				stockTakingGoodsDownloadBrand: '',
				ReplenishmentBrand: '',
				ImportDeliverBrand: '',
				EditGoodsMsgBrand: '',
				EditCategoriesBrand: '',
				EditGoodsPriceBrand: '',
			},
			editableTabsValue: 'ImportGoods',
			editableTabs: [
				// {
				// 	title: '导入商品',
				// 	name: 'ImportGoods',
				// 	auth: checkFunctionCode('impostGoods'),
				// },
				{
					title: '导入商品图片',
					name: 'ImportGoodsImage',
					auth: true,
				},
				{
					title: '库存盘点',
					name: 'StockTaking',
					auth: checkFunctionCode('impostStockTaking'),
				},
				{
					title: '补货',
					name: 'Replenishment',
					auth: checkFunctionCode('replenishment'),
				},
				// {
				// 	title: '导入发货单',
				// 	name: 'ImportDeliver',
				// 	auth: checkFunctionCode('impostOrderDeliver'),
				// },
				// {
				// 	title: '导入审核商品',
				// 	name: 'ImportCheckGoods',
				// 	auth: checkFunctionCode('importAuditedSupplierGoods'),
				// },
				// {
				// 	title: '批量修改物流单号',
				// 	name: 'EditLogisticsNo',
				// 	auth: checkFunctionCode('impostSupplierBatchUpdateExpressSn'),
				// },
				{
					title: '批量修改商品信息',
					name: 'EditGoodsMsg',
					auth: checkFunctionCode('importBatchUpdateGoods'),
				},
				{
					title: '批量修改商品价格',
					name: 'EditGoodsPrice',
					auth: checkFunctionCode('importUpdateGoodsPrice'),
				},
				{
					title: '档期数据明细导入',
					name: 'ReconciliationData',
					auth: checkFunctionCode('importStFinanceDataDetail'),
				},
				{
					title: '导入品牌',
					name: 'ImportBrands',
					auth: checkFunctionCode('saveBrandParent'),
				},
				{
					title: '批量修改商品类目',
					name: 'BatchCommodityCategories',
					auth: checkFunctionCode('batchEditGoodsCategory'),
				},
			],
		}
	},
	async created() {
		let {
			data: { resultCode, resultData },
		} = await getWarehouseList()
		if (resultCode === 0) {
			this.$store.commit('leadin/SET_WAREHOUSE_LIST', resultData.warehouseList)
		}
	},
	methods: {
		openBrandDialog(val) {
			this.brandDialog = true
			this.currentBrandDialog = val
		},
		chooseBrand(val) {
			console.log('val', val)
			switch (this.currentBrandDialog) {
				case 'importGoods':
					this.brandNameList.importGoodsBrandData = val
					break
				case 'importGoodsImage':
					this.brandNameList.importGoodsImageBrandData = val
					break
				case 'stockTakingGoodsDownloadBrand':
					this.brandNameList.stockTakingGoodsDownloadBrand = val
					break
				case 'ReplenishmentBrand':
					this.brandNameList.ReplenishmentBrand = val
					break
				case 'ImportDeliver':
					this.brandNameList.ImportDeliverBrand = val
					break
				case 'EditGoodsMsg':
					this.brandNameList.EditGoodsMsgBrand = val
					break
				case 'EditGoodsPrice':
					this.brandNameList.EditGoodsPriceBrand = val
					break
				case 'BatchCommodityCategories':
					this.brandNameList.EditCategoriesBrand = val
					break
			}
		},
	},
}
</script>

<!--
 * @Description: 导入记录
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-08-24 00:39:47
 * @LastEditTime : 2020-10-22 12:02:17
 * @LastEditors  : WG-zhaorubo
-->
<template>
	<div>
		<el-tabs v-model="editableTabsValue" type="card" @tab-click="fn">
			<template v-for="item in editableTabs">
				<el-tab-pane
					v-if="item.auth"
					:key="item.name"
					:label="item.title"
					:name="item.name"
				>
					<keep-alive>
						<ImportGoods
							@details="openDetailDialog"
							v-if="editableTabsValue === 'GoodsImportHistroy'"
						>
						</ImportGoods>
					</keep-alive>
					<keep-alive>
						<ImportStock
							@details="openDetailDialog"
							v-if="editableTabsValue === 'StockImportHistroy'"
						>
						</ImportStock>
					</keep-alive>
					<keep-alive>
						<ImportDeliver
							@details="openDetailDialog"
							v-if="editableTabsValue === 'ImportDeliver'"
						>
						</ImportDeliver>
					</keep-alive>
					<keep-alive>
						<ImportCheckGoods
							@details="openDetailDialog"
							v-if="editableTabsValue === 'ImportCheckGoods'"
						>
						</ImportCheckGoods>
					</keep-alive>
					<keep-alive>
						<ImportLogisticsNo
							@details="openDetailDialog"
							v-if="editableTabsValue === 'ImportLogisticsNo'"
						>
						</ImportLogisticsNo>
					</keep-alive>
					<keep-alive>
						<ImportGoodsMsg
							@details="openDetailDialog"
							v-if="editableTabsValue === 'ImportGoodsMsg'"
						>
						</ImportGoodsMsg>
					</keep-alive>
					<keep-alive>
						<ImportEmitPlan
							@details="openDetailDialog"
							v-if="editableTabsValue === 'ImportEmitPlan'"
						>
						</ImportEmitPlan>
					</keep-alive>
					<keep-alive>
						<batchImportReconciliation
							@details="openDetailDialog"
							v-if="editableTabsValue === 'batchImportReconciliation'"
						>
						</batchImportReconciliation>
					</keep-alive>
					<keep-alive>
						<ImportAppMaterial
							@details="openDetailDialog"
							v-if="editableTabsValue === 'ImportAppMaterial'"
						>
						</ImportAppMaterial>
					</keep-alive>
					<keep-alive>
						<ImportAppBanner
							@details="openDetailDialog"
							v-if="editableTabsValue === 'ImportAppBanner'"
						>
						</ImportAppBanner>
					</keep-alive>
					<keep-alive>
						<CategorySttributeManagement
							@details="openDetailDialog"
							v-if="editableTabsValue === 'CategorySttributeManagement'"
						>
						</CategorySttributeManagement>
					</keep-alive>
					<keep-alive>
						<ProductAttributeLibrary
							@details="openDetailDialog"
							v-if="editableTabsValue === 'ProductAttributeLibrary'"
						>
						</ProductAttributeLibrary>
					</keep-alive>
					<keep-alive>
						<ImportBrand
							@details="openDetailDialog"
							v-if="editableTabsValue === 'brandImportHistroy'"
						>
						</ImportBrand>
					</keep-alive>
				</el-tab-pane>
			</template>
		</el-tabs>
		<DetailDialog :visible.sync="DetailDialog" :row="row" />
	</div>
</template>
<script>
import ImportGoods from './tabs/ImportGoods'
import ImportStock from './tabs/ImportStock'
import ImportDeliver from './tabs/ImportDeliver'
import ImportCheckGoods from './tabs/ImportCheckGoods'
import ImportLogisticsNo from './tabs/ImportLogisticsNo'
import ImportGoodsMsg from './tabs/ImportGoodsMsg'
import ImportEmitPlan from './tabs/ImportEmitPlan'
import ImportAppMaterial from './tabs/ImportAppMaterial'
import ImportAppBanner from './tabs/ImportAppBanner'
import CategorySttributeManagement from './tabs/CategorySttributeManagement'
import ProductAttributeLibrary from './tabs/ProductAttributeLibrary'
// import InformationLibrary from './tabs/InformationLibrary'
import batchImportReconciliation from './tabs/batchImportReconciliation'
import ImportBrand from './tabs/ImportBrand'
import DetailDialog from './components/DetailDialog'
import { checkFunctionCode } from '@/utils/auth.js'
export default {
	name: 'GetInventory',
	components: {
		ImportGoods,
		ImportStock,
		ImportDeliver,
		ImportCheckGoods,
		ImportLogisticsNo,
		ImportGoodsMsg,
		ImportEmitPlan,
		ImportAppMaterial,
		ImportAppBanner,
		DetailDialog,
		batchImportReconciliation,
		CategorySttributeManagement,
		ProductAttributeLibrary,
		ImportBrand,
	},
	data() {
		return {
			DetailDialog: false,
			row: {},
			editableTabsValue: 'GoodsImportHistroy',
			editableTabs: [
				{
					title: '商品导入记录',
					name: 'GoodsImportHistroy',
					content: '商品导入记录',
					flag: true,
					auth: checkFunctionCode('impostGoods'),
				},
				{
					title: '库存导入记录',
					name: 'StockImportHistroy',
					content: '库存导入记录',
					auth: checkFunctionCode('impostStockTaking'),
				},
				{
					title: '发货单导入记录',
					name: 'ImportDeliver',
					content: '发货单导入记录',
					auth: checkFunctionCode('impostOrderDeliver'),
				},
				{
					title: '商品审核导入记录',
					name: 'ImportCheckGoods',
					content: '商品审核导入记录',
					auth: checkFunctionCode('importAuditedSupplierGoods'),
				},
				{
					title: '批量修改物流单号记录',
					name: 'ImportLogisticsNo',
					content: '批量修改物流单号记录',
					auth: checkFunctionCode('impostSupplierBatchUpdateExpressSn'),
				},
				{
					title: '批量修改商品信息记录',
					name: 'ImportGoodsMsg',
					content: '批量修改商品信息记录',
					auth: checkFunctionCode('importBatchUpdateGoods'),
				},
				{
					title: '修改商品价格导入记录',
					name: 'ImportEmitPlan',
					content: '修改商品价格导入记录',
					auth: checkFunctionCode('importUpdateGoodsPrice'),
				},
				{
					title: '批量导入数据明细',
					name: 'batchImportReconciliation',
					content: '批量导入数据明细',
					auth: checkFunctionCode('importStFinanceDataDetail'),
				},
				{
					title: 'APP素材群店铺导入记录',
					name: 'ImportAppMaterial',
					content: 'APP素材群店铺导入记录',
					auth: checkFunctionCode('pageAppMaterial'),
				},
				{
					title: 'APPBanner店铺导入记录',
					name: 'ImportAppBanner',
					content: 'APPBanner店铺导入记录',
					auth: checkFunctionCode('selectList'),
				},
				{
					title: '商品类目属性管理导入记录',
					name: 'CategorySttributeManagement',
					content: '商品类目属性管理导入记录',
					auth: checkFunctionCode('importCategoryAttribute'),
				},
				{
					title: '商品属性库导入记录',
					name: 'ProductAttributeLibrary',
					content: '商品类目属性管理导入记录',
					auth: checkFunctionCode('importBasicsAttribute'),
				},
				{
					title: '品牌导入记录',
					name: 'brandImportHistroy',
					content: '品牌导入记录',
					auth: checkFunctionCode('saveBrandParent'),
				},
			],
		}
	},
	created() {
		console.log(
			this.$store.state.user.functionList.map((item) => {
				return item.functionName
			}),
			this.$store.state.user.functionList.filter((item) => {
				return item.functionName === '导入库存补货'
			})
		)
	},
	methods: {
		openDetailDialog(row) {
			this.DetailDialog = true
			this.row = row
		},
	},
}
</script>

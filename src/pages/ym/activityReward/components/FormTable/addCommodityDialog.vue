<template>
	<div>
		<yx-dialog
			title="添加商品"
			width="70%"
			:bottomBtn="bottomBtn"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<yx-form
				:inline="true"
				:data="dialogData"
				:items="dialogCfg"
				:formAction="dialogAction"
			>
				<template #businessName>
					<div class="row_flex">
						<el-input
							v-model="dialogData.businessName"
							disabled
							style="width: 160px"
						></el-input>
						<el-button type="primary" @click="cutBusiness(true)"
							>选择商家</el-button
						>
					</div>
				</template>
				<template #conference>
					<el-select
						v-model="dialogData.brandId"
						placeholder="请选择"
						style="width: 140px"
					>
						<el-option label="全部" value=""></el-option>
						<el-option
							v-for="item in supplierBrands"
							:key="item.brandIds"
							:label="item.brandName"
							:value="item.brandIds"
						>
						</el-option>
					</el-select>
				</template>
			</yx-form>
			<el-row>
				<el-button type="text" size="medium" @click="handleAdd"
					>批量添加</el-button
				>
				<el-button type="text" size="medium" @click="handleRemoval"
					>批量移除</el-button
				>
			</el-row>
			<el-row class="table_box">
				<yx-table
					:select="true"
					v-loading="showLoading"
					:columns="tialogColumns"
					:pagination="tialogPage"
					:data="tialogData"
					:selectionChange="selectionChange"
				>
					<template slot="goodsName" slot-scope="scope">
						<div style="display: flex; align-items: center">
							<img
								class="goods_img"
								:src="getSmallImg(scope.row.imageUrl)"
								alt=""
							/>
							<div>
								<div>货号：{{ scope.row.goodsNumber }}</div>
								<div>{{ scope.row.goodsName }}</div>
							</div>
						</div>
					</template>
					<template slot="supplyPrice" slot-scope="scope">
						{{ handleSupplyPrice(scope.row) }}
					</template>
					<template slot="lowestPrice" slot-scope="scope">
						<span>{{ handleLowestPrice(scope.row) }}</span>
					</template>
					<template slot="marketPrice" slot-scope="scope">
						{{ handleMarketPrice(scope.row) }}
					</template>
				</yx-table>
			</el-row>
			<el-row>
				<div class="select_box">
					<div class="select_box_l">已选：</div>
					<div class="select_box_r">
						<div v-for="(item, index) in selectGroupList" :key="index">
							<div
								class="rigth_box"
								:style="{
									'margin-bottom':
										selectGroupList.length - 1 == index ? '0' : '6px',
								}"
							>
								{{ item.goodsName }}
							</div>
						</div>
					</div>
				</div>
			</el-row>
		</yx-dialog>
		<select-business-dialog
			:visible.sync="dialogBusinessVisible"
			:itemInfo.sync="selectedBusiness"
			@saveBusiness="saveBusiness"
		></select-business-dialog>
	</div>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import selectBusinessDialog from './selectBusinessDialog'
import { getSmallImg } from '@/utils/imageTool'
import { retainDecimalPoint } from '@/utils/helper/common'
import { getGoodsListByAddCoupon, getSupplierBrandList } from '@/api/coupon'
// import moment from 'moment'
export default {
	components: {
		YxDialog,
		YxForm,
		YxTable,
		selectBusinessDialog,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			default: false,
		},
		commodityExt: {
			type: Array,
			default: () => [],
		},
		listData: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			selectionData: [],
			getSmallImg: getSmallImg,
			supplierBrands: [],
			selectedBusiness: {},
			dialogBusinessVisible: false,
			selectGroupList: [],
			showLoading: false,
			// currentTime: '',
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveBrand()
					},
				},
			],
			dialogData: {
				businessName: '',
				businessId: '',
				brandId: '',
				keyword: '',
				goodsName: '',
			},
			dialogCfg: [
				{
					title: '商家',
					type: 'custom',
					dataIndex: 'businessName',
				},
				{
					title: '会场',
					type: 'custom',
					dataIndex: 'conference',
				},
				{
					type: 'textarea',
					dataIndex: 'keyword',
					title: '商品货号',
					placeholder: '请输入货号搜索,货号与货号之间使用逗号隔开或者换行',
				},
				{
					type: 'input',
					dataIndex: 'goodsName',
					title: '商品名称',
					placeholder: '请输入商品名称搜索',
				},
			],
			dialogAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getGoodsListByAddCoupon(true)
					},
				},
			],
			tialogColumns: [
				{
					width: 240,
					type: 'custom',
					dataIndex: 'goodsName',
					align: 'left',
					title: '商品',
				},
				{
					width: 100,
					dataIndex: 'brandName',
					title: '会场名称',
				},
				{
					width: 90,
					type: 'custom',
					dataIndex: 'supplyPrice',
					title: '供货价',
					// customRender: (row) => {
					// 	return this.handleSupplyPrice(row)
					// },
				},
				{
					width: 140,
					type: 'custom',
					dataIndex: 'lowestPrice',
					title: '建议销售价',
				},
				{
					width: 90,
					type: 'custom',
					dataIndex: 'marketPrice',
					title: '吊牌价',
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.editUserList(row)
							},
							customRender: (action, row) => {
								action.title = this.findIndex(row) ? '添加' : '移除'
								return action
							},
						},
					],
				},
			],
			tialogPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getGoodsListByAddCoupon()
				},
			},
			tialogData: [],
		}
	},
	computed: {
		localVisible: {
			get() {
				return this.visible
			},
			set(val) {
				this.$emit('update:visible', val)
			},
		},
	},

	watch: {
		localVisible(val) {
			this.reset()
			if (val) {
				this.dialogData.businessId = this.listData.businessId
				this.dialogData.businessName = this.listData.businessName
				this.selectedBusiness.supplierAccountNumberId =
					this.dialogData.businessId
				this.selectedBusiness.supplierName = this.dialogData.businessName
				this.selectGroupList = JSON.parse(JSON.stringify(this.commodityExt))
				// this._getGoodsListByAddCoupon()
				if (this.dialogData.businessId) {
					this._getGoodsListByAddCoupon()
					this._getSupplierBrandList()
				}
			}
		},
	},
	methods: {
		// 处理货号参数
		handleNoParams() {
			const dialogData = JSON.parse(JSON.stringify(this.dialogData))
			dialogData.keyword = dialogData.keyword.replace(/\n/g, ',')
			dialogData.keyword = dialogData.keyword.replace(/\s*/g, '') //商品货号
			// const goodsNumberLength = searchDataTwo.keyword.match(/,|，/g)
			// if (type === 1 && goodsNumberLength && goodsNumberLength.length > 500) {
			// 	return this.$message.warning('货号长度最多支持500个货号搜索')
			// }
			return dialogData
		},
		handleAdd() {
			let ids = this.selectGroupList.map((item) => {
				return item.goodsId
			})
			if (this.selectionData && this.selectionData.length) {
				this.selectionData.forEach((row) => {
					if (ids.indexOf(row.goodsId) == -1) {
						this.selectGroupList.push(row)
					}
				})
			}
		},
		handleRemoval() {
			if (this.selectionData && this.selectionData.length) {
				for (let i = 0; i < this.selectionData.length; i++) {
					for (let j = 0; j < this.selectGroupList.length; j++) {
						if (
							this.selectionData[i].goodsId === this.selectGroupList[j].goodsId
						) {
							let indexs = this.selectGroupList.indexOf(this.selectGroupList[j])
							this.selectGroupList.splice(indexs, 1)
						}
					}
				}
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
		handleMarketPrice(row) {
			const { marketPrice } = row
			return `￥${retainDecimalPoint(marketPrice)}`
		},
		selectionChange(row) {
			this.selectionData = row
		},
		saveBusiness(val) {
			if (val) {
				this.dialogData.brandId = ''
				this.selectGroupList = []
				this.tialogData = []
				this.dialogData.businessName = val.supplierName
				this.dialogData.businessId = val.supplierAccountNumberId
				this.selectedBusiness = val
				if (this.dialogData.businessId) {
					this._getSupplierBrandList()
				}
			}
		},
		async _getSupplierBrandList() {
			let params = {
				supplierAccountNumberId: this.dialogData.businessId,
			}
			let {
				data: { resultCode, resultData },
			} = await getSupplierBrandList(params)
			if (resultCode == 0) {
				this.supplierBrands = resultData.supplierBrands
			} else {
				this.supplierBrands = []
			}
			console.log(resultData, 'fadfasfagadgasdfas=====')
		},
		cutBusiness() {
			// 选择商家
			this.dialogBusinessVisible = true
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			// this.$refs.form.$refs.YxForm.resetFields()
		},
		saveBrand() {
			let listData = {
				businessName: this.dialogData.businessName,
				businessId: this.dialogData.businessId,
			}
			this.$emit('saveCommodity', this.selectGroupList, listData)
			this.localVisible = false
		},
		reset() {
			this.dialogData.businessName = ''
			this.dialogData.businessId = ''
			this.dialogData.brandId = ''
			this.dialogData.keyword = ''
			this.dialogData.goodsName = ''
			this.tialogPage.count = 0
			this.tialogPage.length = 10
			this.tialogPage.currentPage = 1
			this.tialogData = []
			this.selectedBusiness = {}
			this.supplierBrands = []
		},
		findIndex(row) {
			// 判断是否已经添加用户
			let ids = this.selectGroupList.map((item) => {
				return item.goodsId
			})
			return ids.indexOf(row.goodsId) == -1
		},
		editUserList(row) {
			// 添加/移除用户
			let ids = this.selectGroupList.map((item) => {
				return item.goodsId
			})
			if (ids.indexOf(row.goodsId) == -1) {
				this.selectGroupList.push(row)
			} else {
				this.selectGroupList.splice(ids.indexOf(row.goodsId), 1)
			}
		},
		findUserParams(flag) {
			const dialogData = this.handleNoParams(1)
			let paramJson = {
				keyword: dialogData.keyword,
				goodsName: this.dialogData.goodsName,
				shelfState: 2,
				brandId: this.dialogData.brandId,
				startIndex: 0,
				length: 1,
				groupId: 2,
				supplierAccountNumberId: this.dialogData.businessId,
			}
			// 每页的加载数据长度
			paramJson.length = this.tialogPage.length
			// 当前页的条数开始
			if (flag) {
				this.tialogPage.currentPage = 1
			}
			paramJson.startIndex =
				(this.tialogPage.currentPage - 1) * this.tialogPage.length
			return paramJson
		},
		async _getGoodsListByAddCoupon(flag) {
			if (!this.dialogData.businessId) {
				return this.$message.warning('请选择商家！')
			}
			// 用户列表
			this.showLoading = true
			let paramJson = this.findUserParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getGoodsListByAddCoupon(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tialogData = resultData.goodsList
				this.tialogPage.count = resultData.goodsCount
				// this.currentTime = resultData.currentTime
			} else {
				this.tialogPage.count = 0
				this.tialogData = []
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.table_box {
	margin-bottom: 10px;
}
.row_flex {
	display: flex;
	align-items: center;
}
.select_box {
	width: 100%;
	display: flex;
	align-items: flex-start;
}
.select_box_l {
	width: 50px;
}
.select_box_r {
	flex: 1;
	padding: 4px 10px 0 10px;
	border: 1px solid #ccc;
	height: 100px;
	overflow: scroll;
}
.rigth_box {
	// margin-bottom: 6px;
	font-size: 16px;
}
.goods_img {
	width: 60px;
	height: 60px;
	margin-right: 10px;
}
</style>

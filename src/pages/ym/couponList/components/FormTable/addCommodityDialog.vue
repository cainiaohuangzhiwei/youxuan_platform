<template>
	<div>
		<yx-dialog
			title="添加商品"
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
				<template #supplierId>
					<el-select
						v-model="selectedSupplier"
						filterable
						remote
						placeholder="请输入商家名称"
						value-key="supplierId"
						:remote-method="_getCmsSupplierListByCondition"
						@change="selectSupplier"
					>
						<el-option
							v-for="item in formDataSupplierList"
							:key="item.supplierId"
							:label="item.supplierName"
							:value="item"
						>
						</el-option>
					</el-select>
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
					<template slot="imageUrl" slot-scope="scope">
						<div>
							<img
								class="goods_img"
								:src="getSmallImg(scope.row.imageUrl)"
								alt=""
							/>
						</div>
					</template>
					<template slot="goodsName" slot-scope="scope">
						<div>
							<div>货号:{{ scope.row.goodsNumber }}</div>
							<div>{{ scope.row.goodsName }}</div>
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
	</div>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getSmallImg } from '@/utils/imageTool'
import { retainDecimalPoint } from '@/utils/helper/common'
import { getGoodsListByAddCoupon, getSupplierBrandList } from '@/api/coupon'
import { getCmsSupplierListByCondition } from '@/api/yhtPlusCmsSupplier'
// import moment from 'moment'
export default {
	components: {
		YxDialog,
		YxForm,
		YxTable,
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
			selectedSupplier: {},
			selectGroupList: [],
			showLoading: false,
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveBrand()
					},
				},
			],
			// 搜索商家数据源
			formDataSupplierList: [],
			dialogData: {
				supplierName: '',
				supplierAccountNumberId: '',
				supplierId: '',
				brandId: '',
				keyword: '',
				goodsName: '',
			},
			dialogCfg: [
				{
					title: '商家',
					type: 'custom',
					dataIndex: 'supplierId',
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
					type: 'custom',
					dataIndex: 'imageUrl',
					title: '商品图',
				},
				{
					dataIndex: 'goodsName',
					type: 'custom',
					title: '商品名称',
				},
				{
					dataIndex: 'brandName',
					title: '会场名称',
				},
				{
					type: 'custom',
					dataIndex: 'supplyPrice',
					title: '供货价',
					// customRender: (row) => {
					// 	return this.handleSupplyPrice(row)
					// },
				},
				{
					type: 'custom',
					dataIndex: 'lowestPrice',
					title: '建议销售价',
				},
				{
					type: 'custom',
					dataIndex: 'marketPrice',
					title: '吊牌价',
				},
				{
					type: 'action',
					title: '操作',
					width: '100',
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
				this.dialogData.supplierId = this.listData.supplierId
				this.selectedSupplier.supplierId = this.dialogData.supplierId
				this.selectGroupList = JSON.parse(JSON.stringify(this.commodityExt))
				if (this.dialogData.supplierId) {
					this._getCmsSupplierListByCondition('', this.dialogData.supplierId)
				} else {
					this._getCmsSupplierListByCondition()
				}
			}
		},
	},
	methods: {
		// 获取商家列表
		async _getCmsSupplierListByCondition(query, supplierId) {
			const paramJson = {
				startIndex: 0,
				length: 20,
			}
			if (query !== '') {
				paramJson.supplierName = query
			} else if (supplierId) {
				paramJson.supplierId = supplierId
			}
			const {
				data: { resultCode, resultData },
			} = await getCmsSupplierListByCondition(paramJson)
			if (resultCode == 0) {
				this.formDataSupplierList = resultData.supplierList || []
				if (supplierId && this.formDataSupplierList.length > 0) {
					this.selectedSupplier = this.formDataSupplierList[0]
					this.dialogData.supplierAccountNumberId =
						this.selectedSupplier.supplierAccountNumberId
					this._getSupplierBrandList()
					this._getGoodsListByAddCoupon()
				}
				return
			}
			this.formDataSupplierList = []
		},
		selectSupplier(val) {
			if (val && this.dialogData.supplierId != val.supplierId) {
				this.selectGroupList = []
				this.tialogData = []
				this.dialogData.supplierId = val.supplierId
				this.dialogData.brandId = ''
				this.dialogData.supplierAccountNumberId = val.supplierAccountNumberId
				if (this.dialogData.supplierAccountNumberId) {
					this._getSupplierBrandList()
				}
			}
		},
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
				return `￥${retainDecimalPoint(supplyPrice)}`
			} else if (lowestPrice - supplyPrice <= 5) {
				return `￥${retainDecimalPoint(supplyPrice)}`
			} else {
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
		async _getSupplierBrandList() {
			let params = {
				supplierAccountNumberId: this.selectedSupplier.supplierAccountNumberId,
			}
			let {
				data: { resultCode, resultData },
			} = await getSupplierBrandList(params)
			if (resultCode == 0) {
				this.supplierBrands = resultData.supplierBrands
			} else {
				this.supplierBrands = []
			}
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			// this.$refs.form.$refs.YxForm.resetFields()
		},
		saveBrand() {
			let listData = {
				supplierName: this.dialogData.supplierName,
				supplierAccountNumberId: this.dialogData.supplierAccountNumberId,
				supplierId: this.dialogData.supplierId,
			}
			this.$emit('saveCommodity', this.selectGroupList, listData)
			this.localVisible = false
		},
		reset() {
			this.dialogData.supplierName = ''
			this.dialogData.supplierAccountNumberId = ''
			this.dialogData.supplierId = ''
			this.dialogData.brandId = ''
			this.dialogData.keyword = ''
			this.dialogData.goodsName = ''
			this.tialogPage.count = 0
			this.tialogPage.length = 10
			this.tialogPage.currentPage = 1
			this.tialogData = []
			this.selectedSupplier = {}
			this.supplierBrands = []
		},
		findIndex(row) {
			// 判断是否已经添加用户
			let ids = this.selectGroupList.map((item) => {
				return item.goodsId
			})
			return ids.indexOf(row.goodsId) == -1
		},
		// 添加/移除用户
		editUserList(row) {
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
			const dialogData = this.handleNoParams()
			let paramJson = {
				keyword: dialogData.keyword,
				goodsName: this.dialogData.goodsName,
				shelfState: 2,
				brandId: this.dialogData.brandId,
				supplierAccountNumberId: this.dialogData.supplierAccountNumberId,
				startIndex: 0,
				length: 1,
				groupId: 2,
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
			if (!this.dialogData.supplierAccountNumberId) {
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

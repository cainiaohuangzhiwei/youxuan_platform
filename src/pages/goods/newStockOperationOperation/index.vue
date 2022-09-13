<template>
	<div class="goodsStockList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData105"
				:items="formCfg105"
				:formAction="formAction105"
			>
				<template #brandName>
					<el-input
						v-model="formData105.brandName"
						placeholder="请选择会场"
						value-key="brandName"
						label="brandName"
						@focus="selectBrand"
						clearable
						@clear="
							() => {
								formData105.brandName = ''
								formData105.brandId = ''
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="formsDialog = true"
						></el-button>
					</el-input>
				</template>
			</yx-form>
			<yx-table
				:select="true"
				v-loading="loading"
				:selectionChange="selectionChange"
				:columns="tableColumns106"
				:pagination="page106"
				:data="tableData106"
			>
				<template slot="goodsDefaultImage" slot-scope="scope">
					<div class="slot active">
						<div>
							<img
								class="goods_img"
								:src="getSmallImg(scope.row.imageUrl)"
								alt=""
							/>
						</div>
						<div>
							<p>
								<span class="number">货号：{{ scope.row.goodsNumber }}</span>
							</p>
							<p class="goods_name">{{ scope.row.goodsName }}</p>
						</div>
					</div>
				</template>
			</yx-table>
			<!-- //弹窗 -->
			<Dialog
				title="出入库操作"
				:visible="warehouseLoding"
				width="50%"
				:bottomBtn="warehouseBottomBtn"
				@before-close="warehouseLoding = false"
			>
				<yx-table
					v-loading="loading"
					:columns="inventoryTable"
					:pagination="inventoryPage"
					:data="inventoryTableData"
				>
					<template slot="goodsInventory" slot-scope="scope">
						<div class="slot active">
							<div>
								<p>
									<span class="number">货号：{{ scope.row.goodsNumber }}</span>
								</p>
								<p class="goods_name">{{ scope.row.goodsName }}</p>
							</div>
						</div>
					</template>
					<template slot="inventoryQWuantity" slot-scope="scope">
						<div class="slot active">
							<div>
								<el-input
									type="number"
									min="1"
									v-model="scope.row.inventoryQuantity"
								></el-input>
							</div>
						</div>
					</template>
				</yx-table>

				<yx-form
					style="margin-top: 60px"
					ref="form"
					:inline="false"
					:items="item"
					:data="batchData"
					labelWidth="80px"
				>
				</yx-form>
			</Dialog>

			<Dialog
				title="出入库详情信息"
				:visible="outboundLoding"
				width="50%"
				:bottomBtn="outboundDetailsBottomBtn"
				@before-close="outboundLoding = false"
			>
				<yx-table
					:select="true"
					v-loading="loading"
					:columns="outboundDetailsTable"
					:pagination="stockUpdatePage"
					:data="outboundDetailsTableData"
				>
				</yx-table>
			</Dialog>

			<!-- 会场列表 -->
			<brand-dialog
				:itemInfo="brandRow"
				:visible.sync="formsDialog"
				@fatherMethodInit="
					(row) => {
						formData105.brandName = row.brandName
						formData105.brandId = row.brandId
					}
				"
			/>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import BrandDialog from '@/components/BrandDialog'
import { getConstantValueByKey } from '@/utils/helper/common'
import { isNull } from '@/utils/helper/common'
import { getSmallImg } from '@/utils/imageTool'
import { getWarehouseList } from '@/api/warehouse'
import { getNewGoodsInventoryList } from '@/api/yhtPlusWebGoods'
import { inventoryOperate, getStockUpdateListByCondition } from '@/api/webGoods'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		BrandDialog,
		Dialog,
	},
	props: [],
	data() {
		return {
			formsDialog: false,
			loading: false,
			warehouseList: [],
			outboundDetailsTableData: [],
			getSmallImg: getSmallImg,
			warehouseLoding: false,
			inventoryQuantity: '',
			outboundLoding: false,
			goOut: false,
			selectedList: [],
			formData105: {
				brandId: '',
				brandName: '',
				goodsNumberList: [],
				goodsName: '',
				isSales: '',
				warehouseId: 1,
			},
			batchData: {
				checkReason: '',
			},
			item: [
				{
					title: '操作备注',
					type: 'textarea',
					dataIndex: 'checkReason',
				},
			],
			warehouseBottomBtn: [
				{
					title: '取 消',
					type: '',
					click: () => {
						this.warehouseLoding = false
					},
				},
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.quantityAudit()
					},
				},
			],
			formCfg105: [
				{
					type: 'select',
					title: '盘点仓库：',
					label: 'warehouseName',
					dataIndex: 'warehouseId',
					placeholder: '请输入仓库',
					options: [],
				},
				{
					title: '会场名称',
					type: 'custom',
					dataIndex: 'brandName',
				},
				{
					type: 'input',
					title: '商品名称',
					dataIndex: 'goodsName',
					placeholder: '请输入商品名称',
				},
				{
					title: '商品货号',
					type: 'textarea',
					dataIndex: 'goodsNumberList',
					placeholder: '请输入货号搜索,货号与货号之间使用逗号隔开或者换行',
				},
				{
					type: 'select',
					title: '销售状态',
					dataIndex: 'isSales',
					placeholder: '请选择销售状态',
					label: 'value',
					options: [
						{
							isSales: '',
							value: '全部',
						},
						{
							isSales: '1',
							value: '在售',
						},
						{
							isSales: '2',
							value: '待售',
						},
					],
					change: () => {
						this.getWarehouseSpecListByCondition(true)
					},
				},
			],
			formAction105: [
				{
					title: '重置',
					auth: '',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: (e) => {
						this.getWarehouseSpecListByCondition(true, e)
					},
				},
				{
					title: '批量入库',
					type: 'primary',
					auth: 'stockOut',
					click: () => {
						this.getWarehouseLoding(null, 'batchEnter')
					},
				},
				{
					title: '批量出库',
					type: 'primary',
					auth: 'stockIn',
					click: () => {
						this.getWarehouseLoding(null, 'batchGo')
					},
				},
			],
			tableData106: [],
			inventoryTableData: [],
			outboundDetailsTable: [
				{
					type: 'string',
					dataIndex: 'barCode',
					title: '条形码',
				},
				{
					type: 'string',
					dataIndex: 'specOne',
					title: '规格一',
				},
				{
					type: 'string',
					dataIndex: 'specTwo',
					title: '规格二',
				},
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
				{
					type: 'string',
					dataIndex: 'enteredTime',
					title: '条形码',
				},
				{
					type: 'string',
					dataIndex: 'updateType',
					title: '操作类型',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.OPERATION_TYPE_CODE,
							row.updateType,
							'-',
							'updateType'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'quantity',
					title: '数量',
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '操作备注',
				},
			],
			inventoryTable: [
				{
					type: 'custom',
					dataIndex: 'goodsInventory',
					title: '商品名称',
				},
				{
					type: 'string',
					dataIndex: 'barCode',
					title: '条形码',
				},
				{
					type: 'string',
					dataIndex: 'specOne',
					title: '规格一',
				},
				{
					type: 'string',
					dataIndex: 'specTwo',
					title: '规格二',
				},
				{
					type: 'string',
					dataIndex: 'stock',
					title: '库存',
				},
				{
					type: 'string',
					dataIndex: 'lockingStock',
					title: '锁定库存',
				},
				{
					type: 'string',
					dataIndex: '',
					title: '可售库存',
					customRender: (row) => {
						if (row.stock && row.lockingStock) {
							return row.stock - row.lockingStock
						}
					},
				},
				{
					type: 'custom',
					dataIndex: 'inventoryQWuantity',
				},
			],
			tableColumns106: [
				{
					type: 'custom',
					dataIndex: 'goodsDefaultImage',
					title: '商品名称',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场名称',
				},
				{
					type: 'action',
					title: '入库',
					width: '150',
					actions: [
						{
							title: '入库',
							click: (row) => {
								this.getWarehouseLoding(row, 'enter')
							},
						},
					],
				},
				{
					type: 'action',
					title: '出库',
					width: '150',
					actions: [
						{
							title: '出库',
							click: (row) => {
								this.getWarehouseLoding(row, 'go')
							},
						},
					],
				},
				{
					type: 'string',
					dataIndex: 'updateType',
					title: '销售状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.SALE_STATE,
							row.isSales,
							'-',
							'selfStatus'
						)
					},
				},
				{
					type: 'action',
					title: '出入库记录',
					width: '150',
					actions: [
						{
							title: '出入库记录',
							click: (row) => {
								this.getStockUpdateListByCondition(row)
							},
						},
					],
				},
			],
			page106: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getWarehouseSpecListByCondition()
				},
			},
			stockUpdatePage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getStockUpdateListByCondition()
				},
			},
		}
	},

	created() {
		this._getWarehouseList()
	},

	methods: {
		async getStockUpdateListByCondition(row) {
			console.log('row', row)
			this.outboundLoding = true
			let paramJson = {}
			let warehouseSpecIdList = []
			warehouseSpecIdList = row.goodsSpecs.map(function (item) {
				return item.warehouseSpecId
			})
			paramJson.warehouseSpecIdList = warehouseSpecIdList
			let {
				data: { resultCode, resultData },
			} = await getStockUpdateListByCondition(paramJson)
			if (resultCode === 0) {
				this.outboundDetailsTableData = resultData.stockUpdateList
				this.stockUpdatePage.count = resultData.stockUpdateCount
			} else {
				this.stockUpdatePage.count = 0
				this.outboundDetailsTableData = []
			}
		},

		async quantityAudit() {
			let paramJson = {
				remark: this.batchData.checkReason,
			}
			let stockUpdateList = []
			this.inventoryTableData.forEach((item) => {
				if (item.inventoryQuantity) {
					stockUpdateList.push({
						warehouseSpecId: item.warehouseSpecId, //库存规格Id
						goodsSpecId: item.goodsSpecId, //规格Id
						quantity: item.inventoryQuantity, //入库数量
						price: 1, //价格 写死
					})
				}
			})
			paramJson.stockUpdateList = stockUpdateList
			if (this.goOut) {
				paramJson.toWarehouseId = 1 //入库
			} else {
				paramJson.fromWarehouseId = 1 //出库
			}
			if (paramJson.stockUpdateList.length == 0) {
				this.$message.warning({ message: '请填写出入库数量' })
				return
			}
			let {
				data: { resultCode },
			} = await inventoryOperate(paramJson)
			if (resultCode == 0) {
				this.warehouseLoding = false
				this.$message.success('操作成功')
				this.getWarehouseSpecListByCondition()
			}
			console.log(stockUpdateList)
		},
		selectionChange(list) {
			this.selectedList = list
		},

		getWarehouseLoding(row, type) {
			if (
				(type == 'batchEnter' || type == 'batchGo') &&
				this.selectedList.length == 0
			) {
				this.$message.warning({ message: '请勾选批量操作得数据' })
				return
			}
			this.warehouseLoding = true
			//表格标题显示
			this.inventoryTable[7].title =
				type == 'enter'
					? '入库数量'
					: type == 'go'
					? '出库数量'
					: type == 'batchEnter'
					? '出库批量数量'
					: '批量入库'
			//出or入
			this.goOut = type == 'enter' || type == 'batchEnter' ? true : false
			let arryInventory = []
			row = type == 'batchEnter' || type == 'batchGo' ? this.selectedList : row //批量拿勾选数据 单条拿当前
			if (type == 'batchEnter' || type == 'batchGo') {
				for (let i = 0; i < row.length; i++) {
					//多条加层遍历
					console.log('.........', row[i])
					row[i].goodsSpecs.map((item) => {
						arryInventory.push(
							Object.assign({}, item, {
								goodsName: row[i].goodsName,
								goodsNumber: row[i].goodsNumber,
							})
						)
					})
				}
			} else {
				//单条
				row.goodsSpecs.map((item) => {
					arryInventory.push(
						Object.assign({}, item, {
							goodsName: row.goodsName,
							goodsNumber: row.goodsNumber,
						})
					)
				})
			}
			this.inventoryTableData = arryInventory
		},
		selectBrand(e) {
			e.target.blur()
			this.formsDialog = true
		},
		//获取部门列表
		async _getWarehouseList() {
			let res = await getWarehouseList()
			res = res.data
			if (res.resultCode === 0) {
				this.warehouseList = res.resultData.warehouseList
				this.formCfg105[0].options = [
					{
						warehouseId: '',
						warehouseName: '全部',
					},
					...this.warehouseList,
				]
				// 从立即发货进来入库
				if (this.$route.query.brandId) {
					this.$nextTick(() => {
						this.formData105 = {
							brandId: this.$route.query.brandId,
							brandName: decodeURIComponent(this.$route.query.brandName),
							goodsNumberList: [
								decodeURIComponent(this.$route.query.goodsNumber),
							],
							goodsName: decodeURIComponent(this.$route.query.goodsName),
							warehouseId:
								(this.$route.query.warehouseId &&
									parseInt(this.$route.query.warehouseId)) ||
								'',
						}
						this.getWarehouseSpecListByCondition(true)
					})
				}

				// departmentId
			}
		},
		findSearchParams106(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page106.currentPage = 1
			}
			const paramJson = Object.assign(this.formData105, {
				length: this.page106.length,
				startIndex: (this.page106.currentPage - 1) * this.page106.length,
			})
			if (paramJson.goodsNumberList.length > 0) {
				let goodsNumSplit
				goodsNumSplit = String(paramJson.goodsNumberList)
				goodsNumSplit = goodsNumSplit.split(',')
				paramJson.goodsNumberList = goodsNumSplit
			} else {
				paramJson.goodsNumberList = []
			}

			//商品货号
			return paramJson
		},
		getWarehouseSpecListByCondition: async function (flag, e) {
			let paramJson = this.findSearchParams106(flag)
			if (isNull(paramJson.brandName)) {
				this.$message.warning({ message: '请填写会场名称' })
				return
			}
			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await getNewGoodsInventoryList(paramJson, custom)
			this.showLoading = false
			if (resultCode === 0) {
				this.tableData106 = resultData.list
				this.page106.count = resultData.count
			} else {
				this.page106.count = 0
				this.tableData106 = []
			}
		},
	},
}
</script>
<style>
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
}
</style>

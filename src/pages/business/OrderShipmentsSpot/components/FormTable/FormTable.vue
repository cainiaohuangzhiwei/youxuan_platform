<template>
	<div class="orderShipmentsSpot">
		<basicContainer>
			<div class="shop-msg">
				<div class="shop-msg-item">
					店主：<span>{{ consigneeInfoFormData.organizationName }}</span>
				</div>
				<div class="shop-msg-item">
					单号：<span>{{ consigneeInfoFormData.orderSn }}</span>
				</div>
				<div v-if="consigneeInfoFormData.orderState" class="shop-msg-item">
					【{{ getOrderState(consigneeInfoFormData.orderState) }}】
				</div>
			</div>
			<div class="goods-msg">
				<span>收货信息</span>
				{{ consigneeInfoFormData.consigneeInfo }}
			</div>
			<yx-form
				:inline="true"
				:data="orderShipmentFormData"
				:items="orderShipmentFormCfg"
				:formAction="orderShipmentFormAction"
			>
			</yx-form>
			<yx-table
				:select="true"
				v-loading="orderShipmentTableLoading"
				:selectionChange="selectionOrderShipmentTableChange"
				:columns="orderShipmentTableColumns"
				:data="orderShipmentTableData"
			>
				<template slot="goodsName" slot-scope="scope">
					<div class="shop-msg">
						<el-image
							class="image"
							:src="getBigImg(scope.row.imageUrl)"
							alt=""
						/>
						<div class="image-msg">
							<div>货号：{{ scope.row.goodsNumber }}</div>
							<div>{{ scope.row.goodsName }}</div>
						</div>
					</div>
				</template>
				<template slot="totalStock" slot-scope="scope">
					<div>当前库存{{ scope.row.totalStock }}</div>
					<el-button @click="toStock(scope.row)" type="primary">入库</el-button>
				</template>
			</yx-table>
			<!-- 填写发货信息弹窗 S -->
			<Dialog
				title="填写发货信息"
				:visible="immediateDeliveryDialogVisible"
				width="600px"
				@before-close="
					() => {
						immediateDeliveryDialogVisible = false
						immediateDeliveryFormData.expressList = []
						immediateDeliveryFormData.remark = ''
					}
				"
			>
				<el-form
					:model="immediateDeliveryFormData"
					ref="immediateDeliveryValidateForm"
					label-width="100px"
					class="immediateDelivery-dynamic"
				>
					<el-form-item prop="orderSn" label="订单号">
						<el-input
							:disabled="true"
							v-model="immediateDeliveryFormData.orderSn"
						></el-input>
					</el-form-item>
					<div class="add-express">
						<el-button type="primary" @click="addImmediateExpress"
							>新增物流</el-button
						>
					</div>
					<div
						v-for="(
							expressItem, index
						) in immediateDeliveryFormData.expressList"
						:key="index"
					>
						<el-form-item
							:label="'物流公司'"
							:key="expressItem.key"
							prop="expressName"
						>
							<el-input
								v-model="expressItem.expressName"
								placeholder="选择物流公司"
								value-key="expressName"
								label="expressName"
								@focus="selectExpress(index)"
								clearable
								@clear="
									() => {
										expressItem = {}
										selectedExpressList = []
									}
								"
							>
								<el-button
									slot="append"
									icon="el-icon-more"
									@click="selectExpress(index)"
								></el-button>
							</el-input>
						</el-form-item>
						<el-form-item
							:label="'物流单号'"
							:key="expressItem.key"
							prop="expressSn"
						>
							<el-input v-model="expressItem.expressSn"></el-input
							><el-button @click.prevent="removeExpressItem(expressItem)"
								>删除</el-button
							>
						</el-form-item>
					</div>
					<el-form-item prop="remark" label="备注">
						<el-input
							type="textarea"
							v-model="immediateDeliveryFormData.remark"
						></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleImmediateDeliveryClick"
							>确定</el-button
						>
					</el-form-item>
				</el-form>
			</Dialog>
			<!-- 填写发货信息弹窗 E -->
			<!-- 选择物流弹窗 S -->
			<selected-express-dialog
				:dialogVisible.sync="dialogExpressVisible"
				:selectedList.sync="selectedExpressList"
				@fatherMethodInit="fatherMethodInit"
			></selected-express-dialog>
			<!-- 选择物流弹窗 E -->
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import { getGoodsConfiguration } from '@/api/systemConfiguration'
import { getWarehouseList } from '@/api/warehouse'
import { getBigImg } from '@/utils/imageTool'
import selectedExpressDialog from '../selectedExpressDialog'
import {
	getOrderDetailByOrderId,
	getOrderGoodsByOrderId,
	addFastOrderDeliver,
} from '@/api/yhtPlusCmsOrder'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		selectedExpressDialog,
		Dialog,
	},
	props: [],
	data() {
		return {
			orderDetailResultData: {},
			addConsignee: '', //overall收货人
			addPhoneMob: '', //电话
			addAreaId: '', //地区ID
			addAddress: '', //详情地址
			getBigImg,
			goodsType: {},
			checkOrderShipmentTableList: [],
			dialogExpressVisible: false,
			selectedExpressList: [],
			// 立即发货弹窗 - 表单
			consigneeInfoFormData: {
				organizationName: '',
				orderSn: '',
				orderState: '',
				consigneeInfo: '',
			},
			// 立即发货弹窗 - 表格
			orderShipmentTableData: [],
			orderShipmentTableColumns: [
				{
					type: 'custom',
					dataIndex: 'goodsName',
					title: '商品',
					width: 250,
				},
				{
					type: 'string',
					width: 300,
					dataIndex: 'supplierSource',
					title: '规格',
					customRender: (row) => {
						let spec = ''
						if (row.specOne) {
							spec = this.goodsType.specOne + '：' + row.specOne
						}
						if (row.specTwo) {
							spec = spec + '，' + this.goodsType.specTwo + '：' + row.specTwo
						}
						if (row.specThree) {
							spec =
								spec + '，' + this.goodsType.specThree + '：' + row.specThree
						}
						return spec
					},
				},
				{
					type: 'string',
					dataIndex: 'barCode',
					title: '条形码',
				},
				{
					type: 'amount',
					dataIndex: 'price',
					title: '单价',
				},
				{
					type: 'string',
					dataIndex: 'shouldDeliverCount',
					title: '应发',
				},
				{
					type: 'string',
					dataIndex: 'stockOutQuantity',
					title: '缺货',
				},
				{
					type: 'string',
					dataIndex: 'refundQuantity',
					title: '已退',
				},
				{
					type: 'custom',
					width: 120,
					dataIndex: 'totalStock',
					title: '当前库存',
				},
			],
			// 填写发货信息弹窗
			immediateDeliveryDialogVisible: false,
			// 填写发货信息弹窗 - 表格
			immediateDeliveryFormData: {
				orderSn: '',
				expressList: [],
				remark: '',
			},
			orderShipmentTableLoading: false,
			orderShipmentFormData: {
				warehouseId: '',
			},
			orderShipmentFormCfg: [
				{
					title: '选择仓库',
					type: 'select',
					label: 'value',
					dataIndex: 'warehouseId',
					options: [],
					change: (warehouseId) => {
						this.warehouseId = warehouseId
						this.getOrderGoods(warehouseId)
					},
				},
			],
			orderShipmentFormAction: [
				{
					title: '发货',
					type: 'primary',
					auth: '',
					click: () => {
						if (this.checkOrderShipmentTableList.length === 0)
							return this.$message.warning('请选择要发货的商品')
						this.immediateDeliveryDialogVisible = true
					},
				},
			],
		}
	},
	watch: {
		// 设置物流选择列表
		selectedExpressList: {
			handler(val) {
				if (val.length > 0) {
					this.immediateDeliveryFormData.expressList.splice(
						this.expressIndex,
						1,
						val[0]
					)
				}
			},
			deep: true,
		},
	},
	created() {
		this._getGoodsConfiguration()
		this._getWarehouseList()
	},
	methods: {
		toStock(row) {
			this.$router.push({
				path: '/goods/newStockOperationOperation',
				query: {
					warehouseId: this.warehouseId,
					brandId: this.orderDetailResultData.brandId,
					brandName: encodeURIComponent(this.orderDetailResultData.brandName),
					goodsNumber: encodeURIComponent(row.goodsNumber),
					goodsName: encodeURIComponent(row.goodsName),
				},
			})
		},
		getOrderState(code) {
			/*获取订单详情的状态码描述*/
			let codeString = ''
			if (code < 8 && code > 0) {
				codeString = '待审核'
			} else if (code == 8) {
				codeString = '审核通过'
			} else if (code == 9) {
				codeString = '审核不通过'
			} else {
				codeString = '其他'
			}
			return codeString
		},
		selectionOrderShipmentTableChange(list) {
			this.checkOrderShipmentTableList = list.map((item) => {
				return {
					quantity: item.shouldDeliverCount,
					orderGoodsId: item.orderGoodsId,
				}
			})
		},
		// 获取配置项
		async _getGoodsConfiguration() {
			let {
				data: { resultCode, resultData },
			} = await getGoodsConfiguration()
			if (resultCode == 0) {
				this.goodsType = resultData.goodsType || {}
			}
		},
		// 选择仓库之后加载关联订单
		async getOrderGoods(warehouseId) {
			this.warehouseId = warehouseId
			this.orderShipmentTableLoading = true
			const {
				data: { resultData, resultCode },
			} = await getOrderGoodsByOrderId({
				warehouseId,
				orderId: this.$route.params.orderId,
			})
			this.orderShipmentTableLoading = false
			if (resultCode == 0) {
				this.orderShipmentTableData = resultData.orderGoodsList
			}
		},
		/*详细的收货人信息*/
		getDetailConsigneeInfo(itemJson) {
			let consigneeInfo =
				'联系人：' +
				(itemJson.consignee || '无') +
				', 电话：' +
				(itemJson.phoneMob || '无') +
				'，所在区域：' +
				this.assembleAreaName(itemJson) +
				'，' +
				(itemJson.address || '无')
			return consigneeInfo
		},

		assembleAreaName(row) {
			let areaName = ''
			if (row != null) {
				if (row.grandAreaName) {
					areaName += row.grandAreaName
				}
				if (row.parentAreaName) {
					areaName += row.parentAreaName
				}
				if (row.areaName) {
					areaName += row.areaName
				}
				if (row.addressCountiesFourthStageName) {
					areaName += row.addressCountiesFourthStageName
				}
				if (row.areaName == '其他地区') {
					return '其他地区'
				}
				if (!areaName) {
					return '未设置'
				}
				if (
					areaName.lastIndexOf('-') != -1 &&
					areaName.lastIndexOf('-') == areaName.length - 1
				) {
					areaName = areaName.substring(0, areaName.length - 1)
				}
				return areaName
			}
			return '未设置'
		},
		// 发货
		async handleImmediateDeliveryClick() {
			if (this.immediateDeliveryFormData.expressList.length === 0)
				return this.$message.warning('请添加物流信息')
			// const deliverGoodsList = this.deliverGoodsList.map((item) => {
			// 	return {
			// 		quantity: item.shouldDeliverCount,
			// 		orderGoodsId: item.orderGoodsId,
			// 	}
			// })
			let isNextCompany = true
			let isNextOrder = true
			this.immediateDeliveryFormData.expressList.forEach((item) => {
				if (!item.expressName) {
					isNextCompany = false
				}
				if (!item.expressSn) {
					isNextOrder = false
				}
			})
			if (!isNextCompany) {
				return this.$message.warning('请添加物流公司')
			}
			if (!isNextOrder) {
				return this.$message.warning('请添加物流单号')
			}
			const params = {
				orderId: this.$route.params.orderId,
				warehouseId: this.warehouseId,
				clerkId: this.$store.state.user.userInfo.clerkId,
				consignee: this.addConsignee,
				phoneMob: this.addPhoneMob,
				areaId: this.addAreaId,
				address: this.addAddress,
				expressSn: this.consigneeInfoFormData.orderSn,
				remark: this.immediateDeliveryFormData.remark,
				deliverGoodsList: this.checkOrderShipmentTableList,
				deliverExpressList: this.immediateDeliveryFormData.expressList,
			}
			const {
				data: { resultMsg, resultCode },
			} = await addFastOrderDeliver(params)
			if (resultCode === 0) {
				this.$message.success(resultMsg)

				this.immediateDeliveryDialogVisible = false
			}
		},
		async _getWarehouseList() {
			this.orderShipmentTableLoading = true
			const {
				data: { resultData, resultCode },
			} = await getWarehouseList()
			if (resultCode === 0) {
				const targetArr = []
				resultData.warehouseList.forEach((item) => {
					if (item.isDefault == 1) {
						this.orderShipmentFormData.warehouseId = item.warehouseId
					}
					targetArr.push({
						warehouseId: item.warehouseId,
						value: item.warehouseName,
					})
				})
				this.getOrderGoods(this.orderShipmentFormData.warehouseId)
				this.orderShipmentFormCfg.forEach((item) => {
					if (item.dataIndex === 'warehouseId') {
						item.options = targetArr
					}
				})
			}
			const {
				data: {
					resultData: orderDetailResultData,
					resultCode: orderDetailResultCode,
				},
			} = await getOrderDetailByOrderId({
				orderId: this.$route.params.orderId,
			})
			if (orderDetailResultCode === 0) {
				this.orderDetailResultData = orderDetailResultData.orderDetail
				this.consigneeInfoFormData.organizationName =
					orderDetailResultData.organization.organizationName
				this.consigneeInfoFormData.orderSn =
					orderDetailResultData.orderDetail.orderSn
				this.consigneeInfoFormData.orderState =
					orderDetailResultData.orderDetail.orderState
				this.consigneeInfoFormData.consigneeInfo = this.getDetailConsigneeInfo(
					orderDetailResultData.orderDetail
				)

				this.addConsignee = orderDetailResultData.orderDetail.consignee
				this.addPhoneMob = orderDetailResultData.orderDetail.phoneMob
				this.addAreaId = orderDetailResultData.orderDetail.areaId
				this.addAddress = orderDetailResultData.orderDetail.address
				this.deliverGoodsList = orderDetailResultData.orderGoodsList
			}
			this.immediateDeliveryFormData.orderSn = this.consigneeInfoFormData.orderSn
			this.orderShipmentTableLoading = false
		},
		// 填写发货信息弹窗 - 表单物流增加
		addImmediateExpress() {
			this.immediateDeliveryFormData.expressList.push({
				expressName: '',
				expressSn: '',
				key: Date.now(),
			})
		},
		// 打开选择物流modal
		selectExpress(index) {
			this.expressIndex = index
			this.dialogExpressVisible = true
		},
		// 子组件传值
		fatherMethodInit(row = {}) {
			console.log(this.immediateDeliveryFormData.expressList)
			this.immediateDeliveryFormData.expressList[
				this.expressIndex
			] = Object.assign(
				this.immediateDeliveryFormData.expressList[this.expressIndex],
				row
			)
		},
		// 填写发货信息弹窗 - 表单物流删除
		removeExpressItem(item) {
			let index = this.immediateDeliveryFormData.expressList.indexOf(item)
			if (index !== -1) {
				this.immediateDeliveryFormData.expressList.splice(index, 1)
			}
		},
	},
}
</script>
<style lang="scss" scoped>
.goods-msg {
	background-color: #f5f5f5;
	width: 100%;
	padding: 20px 10px;
	margin: 12px 0;
	color: #333;
	span {
		font-weight: bold;
	}
}
.add-express {
	margin: 0 0 18px 14px;
}
.shop-msg {
	display: flex;
	font-size: 16px;
	vertical-align: middle;
	.image {
		width: 45px;
		height: 45px;
		margin-right: 8px;
	}
	.image-msg {
		font-size: 14px;
		text-align: left;
	}
	.shop-msg-item {
		color: #333;
		margin-right: 12px;

		span {
			font-weight: bold;
		}
	}
}
</style>

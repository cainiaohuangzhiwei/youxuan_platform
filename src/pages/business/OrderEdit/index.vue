<template>
	<div class="order-edit-page">
		<!-- 基于element的搜索表格组合 -->
		<basicContainer>
			<yx-form
				:inline="false"
				:data="orderEditFormData"
				:items="orderEditFormCfg"
				label-position="right"
				label-width="70px"
			>
				<template v-if="orderEditFormData.receiveInfo" slot="receiveInfo">
					<div class="receiveInfo">
						<span
							>联系人：{{
								orderEditFormData.receiveInfo.orderDetail.consignee
							}}</span
						>
						<el-popover
							placement="top-start"
							width="120"
							popper-class="popperClass"
							trigger="click"
							:content="visiblePhone"
						>
							<span
								slot="reference"
								@click="showPhone(orderEditFormData.receiveInfo.orderDetail)"
								style="cursor: pointer"
								title="点击获取手机号"
								>电话：{{
									orderEditFormData.receiveInfo.orderDetail.phoneMob
								}}</span
							>
						</el-popover>
						<span
							>所在区域：{{
								orderEditFormData.receiveInfo.orderDetail.grandAreaName
							}}
							{{ orderEditFormData.receiveInfo.orderDetail.parentAreaName }}
							{{ orderEditFormData.receiveInfo.orderDetail.areaName }}
							{{ orderEditFormData.receiveInfo.orderDetail.address }}
						</span>

						<span class="orderAdressEdit" @click="handleEditAddressDialog"
							>修改</span
						>
					</div>
				</template>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="orderEditTableColumns"
				:data="orderEditTableData"
			>
				<template slot="index" slot-scope="scope">
					<div>{{ scope.index + 1 }}</div>
				</template>
				<template slot="goodsName" slot-scope="scope">
					<div class="slot active">
						<div>
							<img
								class="goods_img"
								:src="getSmallImg(scope.row.goodsDefaultImage)"
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
				<template slot="specOneMap" slot-scope="scope">
					<div>{{ goodsType.specOne }}：{{ scope.row.specOne }}</div>
					<div>{{ goodsType.specTwo }}：{{ scope.row.specTwo }}</div>
				</template>
			</yx-table>
			<div class="orderEditDetail">
				<div class="orderEditDetail-item">
					<span class="orderEditDetail-title">原价】商品:</span
					><span class="orderEditDetail-contain"
						>￥{{ orderEditDetailData.unitPrice }}</span
					>
				</div>
				<div class="orderEditDetail-item">
					<span class="orderEditDetail-title">【现价】商品:</span
					><span class="orderEditDetail-contain"
						>￥{{ orderEditDetailData.price }}</span
					>
				</div>
				<div class="orderEditDetail-item">
					<span class="orderEditDetail-title">邮费:</span
					><span class="orderEditDetail-contain"
						>￥{{ orderEditDetailData.expressFee }}</span
					>
				</div>
				<div class="orderEditDetail-item">
					<span class="orderEditDetail-title">总计:</span
					><span class="orderEditDetail-contain"
						>￥{{ orderEditDetailData.totle }}</span
					>
				</div>
				<div class="orderEditDetail-item">
					<span class="orderEditDetail-title">优惠券:</span
					><span class="orderEditDetail-contain">{{
						orderEditDetailData.couponName
					}}</span>
				</div>
				<div class="orderEditDetail-item">
					<span class="orderEditDetail-title">满减/满折:</span
					><span class="orderEditDetail-contain">{{
						orderEditDetailData.discountType
					}}</span>
				</div>
			</div>
			<el-button @click="submit" class="btn-position" type="primary"
				>保存</el-button
			>
		</basicContainer>
		<!-- 编辑地址弹窗 S -->
		<Dialog
			title="编辑地址"
			:visible="editAddressDialogVisible"
			width="500px"
			:bottomBtn="editAddressDialogBottomBtn"
			@open="openAddress"
			@before-close="
				() => {
					editAddressDialogVisible = false
					editAddressFormData = {
						consignee: '',
						phoneMob: '',
						address: '',
					}
				}
			"
		>
			<yx-form
				:inline="false"
				:data="editAddressFormData"
				:items="editAddressFormCfg"
				label-position="right"
				label-width="70px"
				v-loading="areaLoading"
			>
				<template slot="area">
					<el-cascader
						ref="el_cascader"
						v-model="selectedArea"
						:options="addressOptions"
						:props="parentAreaLis"
					></el-cascader>
				</template>
			</yx-form>
		</Dialog>
		<!-- 编辑地址弹窗 E -->
	</div>
</template>
<script>
import Dialog from '@/components/Dialog'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import BasicContainer from '@wg-vue-materials/basic-container'
import { getSmallImg } from '@/utils/imageTool'
import moment from 'moment'
import { getParentAreaListByAreaId, getAreaListByParentId } from '@/api/public'
import { findOrderPhoneById } from '@/api/showPhone'
import {
	getOrderDetailByOrderId,
	updateOrderByOrderId,
} from '@/api/yhtPlusCmsOrder'
import { getGoodsConfiguration } from '@/api/systemConfiguration'
export default {
	name: 'OrderEdit',
	components: { BasicContainer, YxForm, YxTable, Dialog },
	data() {
		return {
			visiblePhone: '***********',
			isSx: false,
			getSmallImg,
			areaLoading: false,
			addressOptions: [],
			orderEditVisible: false,
			editAddressDialogVisible: false,
			editAddressDialogBottomBtn: [
				{
					title: '保存',
					type: 'primary',
					click: () => {
						const { consignee, phoneMob, address } = this.editAddressFormData
						const area = this.selectedArea
						if (area.length === 0) return this.$message.warning('请选择区域')
						const newArea =
							this.$refs.el_cascader.getCheckedNodes()[0].pathLabels
						this.orderEditTableDetail.areaId = area[area.length - 1]
						this.orderEditFormData.receiveInfo.orderDetail.consignee = consignee
						this.orderEditFormData.receiveInfo.orderDetail.phoneMob = phoneMob
						this.visiblePhone = phoneMob
						this.orderEditFormData.receiveInfo.orderDetail.grandAreaName =
							newArea[1] || ''
						this.orderEditFormData.receiveInfo.orderDetail.parentAreaName =
							newArea[2] || ''
						this.orderEditFormData.receiveInfo.orderDetail.areaName =
							newArea[3] || ''
						this.orderEditFormData.receiveInfo.orderDetail.address = address
						this.editAddressDialogVisible = false
					},
				},
			],
			editAddressFormData: {
				consignee: '',
				phoneMob: '',
				address: '',
			},
			editAddressFormCfg: [
				{
					type: 'input',
					title: '联系人',
					dataIndex: 'consignee',
				},
				{
					type: 'input',
					title: '手机',
					dataIndex: 'phoneMob',
				},
				{
					title: '所在地区',
					type: 'custom',
					dataIndex: 'area',
				},
				{
					title: '详细地址',
					type: 'input',
					dataIndex: 'address',
				},
			],

			// 动态级联
			selectedArea: [],
			parentAreaLis: {
				lazy: true,
				children: 'childAreaList',
				label: 'areaName',
				value: 'areaId',
				lazyLoad: async (node, resolve) => {
					if (node.level > 0) {
						// 后两级用另外一个接口
						if (node.children.length === 0) {
							const {
								data: { resultData, resultCode },
							} = await getAreaListByParentId({
								parentId: node.data.areaId,
							})
							if (resultCode === 0) {
								let nodes = resultData.areaList.map((item) => {
									return {
										leaf: item.childAreaCount == 0 || item.level >= 4,
										value: {
											areaId: item.areaId,
											areaName: item.areaName,
										},
										...item,
									}
								})
								resolve(nodes)
							}
						} else {
							resolve()
						}
					}
				},
			},
			goodsType: {},
			orderEditFormData: {
				orderSn: '',
				organizationName: '',
				brand: '',
				consignee: '',
				addTime: '',
				receiveInfo: '',
				remark: '',
			},
			orderEditDetailData: {
				unitPrice: '',
				price: '',
				expressFee: '',
				totle: '',
				couponName: '',
				discountType: '',
			},
			orderEditFormCfg: [
				{
					title: '订单号',
					type: 'text',
					dataIndex: 'orderSn',
				},
				{
					title: '店主',
					type: 'text',
					dataIndex: 'organizationName',
				},
				{
					title: '会场',
					type: 'text',
					dataIndex: 'brand',
				},
				{
					title: '下单人',
					type: 'text',
					dataIndex: 'weixinUserName',
				},
				{
					title: '下单时间',
					type: 'input',
					dataIndex: 'addTime',
					disabled: true,
				},
				{
					title: '收货信息',
					type: 'custom',
					dataIndex: 'receiveInfo',
				},
				{
					title: '备注',
					type: 'textarea',
					dataIndex: 'remark',
				},
			],
			orderEditTableColumns: [
				{
					type: 'custom',
					dataIndex: 'index',
					title: '',
					width: '60px',
				},
				{
					type: 'custom',
					dataIndex: 'goodsName',
					title: '商品',
					width: '280px',
				},
				{
					type: 'custom',
					dataIndex: 'specOneMap',
					title: '规格',
				},
				{
					type: 'amount',
					dataIndex: 'unitPrice',
					title: '单价',
				},
				{
					type: 'string',
					dataIndex: 'quantity',
					title: '数量',
				},
				{
					type: 'amount',
					dataIndex: 'total',
					title: '合计',
				},
			],
			orderEditTableData: [],
		}
	},
	created() {
		this.init()
		this._getGoodsConfiguration()
	},
	methods: {
		async showPhone(rowData) {
			if (this.visiblePhone != '***********') {
				this.isSx = false
				return false
			}
			//this.visiblePhone = '***********'
			let {
				data: { resultCode, resultData },
			} = await findOrderPhoneById({
				id: rowData.orderId,
			})

			if (resultCode == 0) {
				this.visiblePhone = resultData
				this.isSx = false
			} else {
				this.visiblePhone = '***********'
				this.isSx = true
			}
			console.log(resultCode, this.visiblePhone)
			//	return resultCode
		},
		async submit() {
			const goodsSimpleList = []
			this.orderEditTableData.map((item) => {
				let uploadData = {
					goodsSpecId: item.goodsSpecId,
					quantity: item.quantity,
					price: item.price,
					goodsName: item.goodsName,
				}
				goodsSimpleList.push(uploadData)
			})

			const params = {
				orderId: this.$route.params.orderId,
				description: this.orderEditFormData.remark,
				consignee: this.orderEditFormData.receiveInfo.orderDetail.consignee,
				phoneMob: this.orderEditFormData.receiveInfo.orderDetail.phoneMob,
				grandAreaName:
					this.orderEditFormData.receiveInfo.orderDetail.grandAreaName || '',
				parentAreaName:
					this.orderEditFormData.receiveInfo.orderDetail.parentAreaName || '',
				areaName: this.orderEditFormData.receiveInfo.orderDetail.areaName || '',
				areaId: this.orderEditTableDetail.areaId,
				goodsSimpleList,
				expressFee: this.orderEditTableDetail.expressFee,
				realAmount:
					Number(this.orderEditDetailData.price) +
					Number(this.orderEditDetailData.expressFee),
				proviceFirstStageName:
					this.orderEditFormData.receiveInfo.orderDetail.grandAreaName || '',
				addressCitySecondStageName:
					this.orderEditFormData.receiveInfo.orderDetail.parentAreaName || '',
				addressCountiesThirdStageName:
					this.orderEditFormData.receiveInfo.orderDetail.areaName || '',
				address: this.orderEditFormData.receiveInfo.orderDetail.address,
			}

			if (this.visiblePhone == '***********') {
				await this.showPhone(this.orderEditFormData.receiveInfo.orderDetail)
			}
			if (this.isSx) {
				this.visiblePhone = '***********'
				return false
			}
			params.phoneMob = this.visiblePhone
			console.log('====', params)

			const {
				data: { resultCode },
			} = await updateOrderByOrderId(params)
			if (resultCode === 0) {
				this.$message.success('修改成功')

				this.$store
					.dispatch('tagsView/delVisitedView', this.$route)
					.then(() => {
						this.$router.push({
							path: '/business/orderList',
						})
					})
			}
		},
		async openAddress() {
			this.areaLoading = true

			const {
				data: { resultData, resultCode },
			} = await getParentAreaListByAreaId({
				areaId: this.orderEditTableDetail.areaId,
			})
			this.areaLoading = false
			if (resultCode === 0) {
				this.addressOptions = this.getDefautlArea(
					JSON.parse(JSON.stringify(resultData.areaList))
				)

				this.$nextTick(() => {
					this.selectedArea = this.myDefautlArea(
						JSON.parse(JSON.stringify(resultData.areaList))
					)
				})
			}
		},
		getDefautlArea(areaList) {
			areaList.forEach((item) => {
				if (item.childAreaCount == 0 || item.level >= 4) {
					item.leaf = true
				}
				// item.value = {
				// 	areaId: item.areaId,
				// 	areaName: item.areaName,
				// }
				if (item.childAreaList) {
					this.getDefautlArea(item.childAreaList)
				}
			})
			return areaList
		},
		myDefautlArea(areaList, arr = []) {
			areaList.forEach((item) => {
				if (item.childAreaList) {
					arr.push(item.areaId)
					this.myDefautlArea(item.childAreaList, arr)
				}
			})
			return arr
		},
		async handleEditAddressDialog() {
			if (this.visiblePhone == '***********') {
				await this.showPhone(this.orderEditFormData.receiveInfo.orderDetail)
			}
			//this.visiblePhone = this.orderEditFormData.receiveInfo.orderDetail.phoneMob
			this.editAddressFormData = {
				consignee: this.orderEditFormData.receiveInfo.orderDetail.consignee,
				phoneMob: this.isSx
					? this.orderEditFormData.receiveInfo.orderDetail.phoneMob
					: this.visiblePhone,
				address: this.orderEditFormData.receiveInfo.orderDetail.address,
			}
			if (this.isSx) {
				this.visiblePhone = '***********'
			}

			this.editAddressDialogVisible = true
		},
		// 获取配置项
		async _getGoodsConfiguration() {
			let {
				data: { resultCode, resultData },
			} = await getGoodsConfiguration()
			if (resultCode == 0) {
				this.goodsType = resultData.goodsType
			}
		},
		async init() {
			const {
				data: { resultData, resultCode },
			} = await getOrderDetailByOrderId({ orderId: this.$route.params.orderId })
			if (resultCode === 0) {
				this.orderEditFormData = {
					orderSn: resultData.orderDetail.orderSn,
					organizationName: resultData.orderDetail.organizationName,
					brand: resultData.orderDetail.brandName,
					weixinUserName: resultData.orderDetail.weixinUserName,
					addTime: moment(resultData.orderDetail.addTime).format(
						'YYYY-MM-DD HH:mm:ss'
					),
					receiveInfo: resultData,
					remark: resultData.orderDetail.description,
				}
				this.orderEditTableData = resultData.orderGoodsList
				this.orderEditTableDetail = resultData.orderDetail
				this.orderEditTableData.map((item) => {
					item.total = (item.quantity * item.unitPrice).toFixed(2)
				})
				let unitPrice = 0,
					price = 0,
					expressFee = 0,
					discountType = '无',
					totalPrice = 0
				resultData.orderGoodsList.map((item) => {
					unitPrice += item.unitPrice
					price += item.price
				})
				totalPrice = unitPrice
				expressFee = resultData.orderDetail.expressFee
				let couponDesc = ''
				resultData.yxCouponList.map((item) => {
					let couponTypeExt = null //优惠券明细
					if (item.typeExt == 1) {
						couponTypeExt = '代金券' + item.amount + '元'
						totalPrice = totalPrice - item.amount
					} else if (item.typeExt == 2) {
						couponTypeExt = '折扣券' + item.amount * 10 + '折'
						totalPrice = totalPrice * item.amount
					} else if (item.typeExt == 3) {
						couponTypeExt = '免邮券'
					}
					couponDesc += item.couponName + '(' + couponTypeExt + ')；'
				})
				//满减/满折
				if (resultData.orderDetail.discountType) {
					totalPrice = totalPrice - resultData.orderDetail.discount
					//参与折扣活动
					let discountRules = resultData.orderDetail.discountRule.split(':')
					if (resultData.orderDetail.discountType == 1) {
						discountType =
							'满' + discountRules[0] + '元减' + discountRules[1] + '元'
					} else if (resultData.orderDetail.discountType == 2) {
						discountType =
							'满' + discountRules[0] + '件减' + discountRules[1] + '元'
					} else if (resultData.orderDetail.discountType == 3) {
						discountType =
							'满' + discountRules[0] + '元打' + discountRules[1] + '折'
					} else if (resultData.orderDetail.discountType == 4) {
						discountType =
							'满' + discountRules[0] + '件打' + discountRules[1] + '折'
					} else {
						discountType = '无'
					}
				}
				let differences = totalPrice - price
				this.orderEditDetailData = {
					unitPrice: unitPrice.toFixed(2),
					price,
					expressFee: expressFee.toFixed(2),
					totle: `${(expressFee + price).toFixed(2)}(+￥${parseInt(
						differences
					).toFixed(2)})`,
					couponName: couponDesc || '无',
					discountType,
				}
			}
		},
	},
}
</script>

<style scoped lang="scss">
.popperClass {
	text-align: center;
}
.orderEditDetail {
	width: 100%;
	height: 160px;
	border: 1px solid #e5ebf5;
	border-top: none;
	padding: 5px 10px;
	.orderEditDetail-item {
		margin-bottom: 5px;
	}
	.orderEditDetail-title {
		font-weight: bold;
		margin-right: 5px;
	}
	.orderEditDetail-contain {
		font-weight: bold;
		color: red;
	}
}
.receiveInfo {
	span {
		margin-right: 10px;
		&.orderAdressEdit {
			margin-left: 10px;
			color: #0096fb;
			text-decoration: underline;
			cursor: pointer;
		}
	}
}
.btn-position {
	margin-top: 20px;
}

.slot {
	text-align: left;
	display: flex;
	align-items: center;
	justify-content: center;

	.goods_img {
		width: 50px;
		height: 50px;
		margin-right: 10px;
		line-height: 155px;
	}

	.number {
		margin-right: 10px;
	}
}

.page {
	margin: 20px 0;
	text-align: right;
}

.active {
	line-height: 15px;
}
</style>

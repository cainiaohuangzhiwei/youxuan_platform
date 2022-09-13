<template>
	<div>
		<div class="order-info">
			<b>订单信息</b>
			<yx-info :data="afterSalesDetailVo" :items="orderInfo">
				<template slot="orderSn">
					<div>
						<span>关联订单号：</span>
						<el-button
							v-clipboard:copy="afterSalesDetailVo.orderSn"
							v-clipboard:success="copyCode"
							type="text"
							>{{ afterSalesDetailVo.orderSn }}</el-button
						>
					</div>
				</template>
			</yx-info>
		</div>
		<div class="after-sale-info">
			<b>售后单信息</b>
			<yx-info :column="4" :data="afterSalesDetailVo" :items="afterSaleInfo">
				<template slot="afterSalesSn">
					<div>
						<span>售后单号：</span>
						<el-button
							v-clipboard:copy="afterSalesDetailVo.afterSalesSn"
							v-clipboard:success="copyCode"
							type="text"
							>{{ this.afterSalesDetailVo.afterSalesSn }}</el-button
						>
					</div>
				</template>
			</yx-info>
			<yx-table
				:spanMethod="spanMethod"
				:select="false"
				:columns="tableColumns104"
				:data="tableData104"
			>
				<template slot="goodsInfo" slot-scope="scope">
					<div>
						<el-button type="text" v-if="scope.index == 0">
							<div class="goodsInfo">
								<el-image
									class="c_image"
									fit="cover"
									:src="scope.row.goodsDefaultImage"
									:preview-src-list="[scope.row.goodsDefaultImage]"
								>
									<div slot="error" class="image-slot">
										<i class="el-icon-picture-outline"></i>
									</div>
								</el-image>
								<div class="goods-name">
									<router-link
										class="goods-name-box"
										:to="`/goods/GoodsDetail/${scope.row.goodsId}/${
											scope.row.goodsSpecId
										}/${1}/${scope.row.goodsSnapshotId}/${
											scope.row.goodsSpecSnapshotId
										}`"
									>
										<p>货号：{{ scope.row.goodsNumber }}</p>
										<p v-html="scope.row.goodsName"></p>
									</router-link>
									<!-- <p>货号：{{ scope.row.goodsNumber }}</p> -->
									<!-- <p v-html="scope.row.goodsName"></p> -->
								</div>
							</div>
						</el-button>
						<div v-else class="tfootData">
							<p>
								申请退款金额： <span>￥{{ scope.row.applyPayPrice }}</span>
							</p>
							<p>
								实际退款金额： <span>￥{{ scope.row.refundAmount }}</span>
							</p>
							<p>
								运费： <span>￥{{ scope.row.expressFee }}</span>
							</p>
							<p>
								已退商品总成本金额：
								<span>￥{{ scope.row.retiredCostPrice }}</span>
							</p>
							<p>
								第三方返退金额：
								<span>￥{{ scope.row.thirdPartyRefundAmount }}</span>
							</p>
							<p>
								差额： <span>￥{{ scope.row.balance }}</span>
							</p>
						</div>
					</div>
				</template>
				<template slot="skuInfo" slot-scope="scope">
					<div>
						<p v-if="scope.row.specOne && goodsType.specOne">
							{{ goodsType.specOne }}：{{ scope.row.specOne }}
						</p>
						<p v-if="scope.row.specTwo && goodsType.specTwo">
							{{ goodsType.specTwo }}：{{ scope.row.specTwo }}
						</p>
					</div>
				</template>
			</yx-table>
			<yx-info :column="4" :data="afterSalesDetailVo" :items="afterSaleInfo2">
			</yx-info>
			<div class="after-sales-image-list">
				<span>图片：</span>
				<div>
					<template
						v-for="(image, index) in afterSalesDetailVo.afterSalesImageList"
					>
						<el-image
							:key="index"
							class="after-sales-image"
							fit="cover"
							:src="getBigImg(image.imageUrl)"
							:preview-src-list="[getBigImg(image.imageUrl)]"
						>
							<div slot="error" class="image-slot">
								<i class="el-icon-picture-outline"></i>
							</div>
						</el-image>
					</template>
				</div>
			</div>
			<yx-form
				v-loading="loading"
				labelWidth="100px"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
				<template slot="afterSalesCommentImages">
					<div>
						<template v-for="(image, index) in afterSalesCommentImages">
							<div class="wg_image_box" :key="index">
								<el-image
									class="wg_image_item"
									fit="cover"
									:src="getBigImg(image.imageUrl)"
									:preview-src-list="[getBigImg(image.imageUrl)]"
								>
									<div slot="error" class="image-slot">
										<i class="el-icon-picture-outline"></i>
									</div>
								</el-image>
								<div class="wg_image_item_dlt">
									<span @click="delAfterSalesImage(index)">删除</span>
								</div>
							</div>
						</template>
					</div>
				</template>
			</yx-form>
		</div>
	</div>
</template>

<script>
import YxInfo from '@wg-vue-materials/yx-info'
import YxTable from '@wg-vue-materials/yx-table'
import YxForm from '@wg-vue-materials/yx-form'
import moment from 'moment'
import { getBigImg } from '@/utils/imageTool'
import { getGoodsConfiguration } from '@/api/systemConfiguration'
import { updateRemarksInRecord } from '@/api/afterSalesRemarks'
export default {
	props: {
		afterSalesDetailVo: {
			type: Object,
			default: () => ({}),
		},
		afterSalesRefundVo: {
			type: Object,
			default: () => ({}),
		},
		afterSalesRemark: {
			type: Object,
			default: () => ({}),
		},
	},
	components: {
		YxInfo,
		YxTable,
		YxForm,
	},
	data() {
		return {
			loading: false,
			delImageIdList: [],
			params: this.$route.params,
			afterSalesCommentImages: [],
			formData101: {
				mailAddress: '',
				returnStandard: '',
				checkNote: '',
			},
			formCfg101: [
				{
					type: 'textarea',
					dataIndex: 'mailAddress',
					title: '寄回地址',
				},
				{
					type: 'textarea',
					dataIndex: 'returnStandard',
					title: '退件寄回备注',
				},
				{
					type: 'textarea',
					dataIndex: 'checkNote',
					title: '结果反馈',
				},
				{
					type: 'custom',
					unformItem: true,
					dataIndex: 'afterSalesCommentImages',
				},
			],
			formAction101: [
				{
					title: '保存',
					type: 'primary',
					click: () => {
						this._updateRemarksInRecord()
					},
				},
			],
			getBigImg,
			goodsType: {},
			tableData104: [],
			tableColumns104: [
				{
					type: 'custom',
					title: '商品',
					dataIndex: 'goodsInfo',
					width: '320px',
				},
				{
					type: 'custom',
					title: '规格',
					dataIndex: 'skuInfo',
				},
				{
					type: 'string',
					title: '申请数/待退/已退',
					dataIndex: 'astNumStr',
				},
				{
					type: 'amount',
					title: '结算价',
					dataIndex: 'costPrice',
				},
				{
					type: 'amount',
					title: '单价(实际支付)',
					dataIndex: 'price',
				},
				{
					type: 'amount',
					title: '小计(申请退款金额)',
					dataIndex: 'applyPayPrice',
				},
			],
			afterSaleInfo2: [
				{
					type: 'string',
					title: '售后类型',
					dataIndex: 'afterType',
					customRender: () => {
						return this.afterSalesDetailVo.afterType == 1
							? '退货退款'
							: '仅退款'
					},
				},
				{
					type: 'string',
					title: '是否收到货',
					dataIndex: 'acceptGoods',
					customRender: () => {
						return this.afterSalesDetailVo.acceptGoods == 1
							? '已收到'
							: '未收到'
					},
				},
				{
					type: 'string',
					title: '售后原因',
					dataIndex: 'afterReason',
				},
				{
					type: 'string',
					title: '问题描述',
					dataIndex: 'problemDesc',
				},
			],
			afterSaleInfo: [
				{
					type: 'custom',
					dataIndex: 'afterSalesSn',
				},
				{
					type: 'string',
					title: '申请时间',
					dataIndex: 'refundTime',
					customRender: () => {
						return this.afterSalesDetailVo.astAddTime
							? moment(this.afterSalesDetailVo.astAddTime).format(
									'YYYY-MM-DD HH:mm:ss'
							  )
							: '-'
					},
				},
				{
					type: 'string',
					title: '售后单状态',
					dataIndex: 'afterOrderStatus',
					customRender: () => {
						let afterOrderStatus = [
							'',
							'申请中',
							'待寄出',
							'已寄出',
							'待退款',
							'退款中',
							'退款成功',
							'已关闭',
						]
						return afterOrderStatus[
							this.afterSalesDetailVo.afterOrderStatus - 1
						]
					},
				},
				{
					type: 'string',
					title: '受理状态',
					dataIndex: 'acceptTheStatus',
					customRender: () => {
						let acceptTheStatus = [
							'',
							'受理中',
							'同步中',
							'已受理',
							'受理完成',
							'结果确认中',
							'已关闭',
						]
						return acceptTheStatus[this.afterSalesDetailVo.acceptTheStatus - 1]
					},
				},
				{
					type: 'string',
					title: '商家售后状态',
					dataIndex: 'supplierAfterSalesStatus',
					customRender: () => {
						let supplierAfterSalesStatus = [
							'',
							'物流同步中',
							'待验货',
							'售后完成',
							'异常处理中',
							'已关闭',
						]
						return supplierAfterSalesStatus[
							this.afterSalesDetailVo.supplierAfterSalesStatus - 1
						]
					},
				},
			],
			orderInfo: [
				{
					type: 'custom',
					dataIndex: 'orderSn',
				},
				{
					type: 'string',
					title: '下单时间',
					dataIndex: 'refundTime',
					customRender: () => {
						return this.afterSalesDetailVo.orderAddTime
							? moment(this.afterSalesDetailVo.orderAddTime).format(
									'YYYY-MM-DD HH:mm:ss'
							  )
							: '-'
					},
				},
				{
					type: 'string',
					title: '订单发货状态',
					dataIndex: 'deliverState',
					customRender: () => {
						let deliverState = ['', '待发货', '发货中', '发完货', '确认收货']
						return deliverState[this.afterSalesDetailVo.deliverState]
					},
				},
				{
					type: 'string',
					title: '会场',
					dataIndex: 'brandName',
				},
				{
					type: 'string',
					title: '店主',
					dataIndex: 'organizationName',
				},
				{
					type: 'string',
					title: '下单昵称',
					dataIndex: 'weixinUserName',
				},
			],
		}
	},
	watch: {
		afterSalesRemark(newValue) {
			this.formData101.returnStandard = newValue.returnStandard
		},
		afterSalesDetailVo() {
			let tableData104 = []
			if (this.afterSalesDetailVo.afterType == 1) {
				this.formCfg101[0].hide = false
				this.formData101.mailAddress = this.afterSalesDetailVo.mailAddress
			} else {
				this.formCfg101[0].hide = true
			}
			this.afterSalesCommentImages =
				this.afterSalesDetailVo.afterSalesCommentImages || []
			this.formData101.checkNote = this.afterSalesDetailVo.checkNote
			tableData104.push({
				goodsSnapshotId: this.afterSalesDetailVo.goodsSnapshotId,
				goodsSpecSnapshotId: this.afterSalesDetailVo.goodsSpecSnapshotId,
				goodsId: this.afterSalesDetailVo.goodsId,
				goodsName: this.goodsNameCut(this.afterSalesDetailVo.goodsName),
				goodsNumber: this.afterSalesDetailVo.goodsNumber,
				goodsDefaultImage: getBigImg(this.afterSalesDetailVo.imageUrl),
				goodsSpecId: this.afterSalesDetailVo.goodsSpecId,
				specOne: this.afterSalesDetailVo.specOne,
				specTwo: this.afterSalesDetailVo.specTwo,
				astNumStr: this.afterSalesDetailVo.astNumStr,
				costPrice: this.afterSalesDetailVo.costPrice,
				price: this.afterSalesDetailVo.price,
				applyPayPrice: this.afterSalesDetailVo.applyPayPrice,
			})
			let tfootData = {
				applyPayPrice: this.afterSalesDetailVo.applyPayPrice,
				refundAmount: this.afterSalesRefundVo.refundAmount,
				retiredCostPrice: this.afterSalesDetailVo.retiredCostPrice,
				thirdPartyRefundAmount: this.afterSalesDetailVo.thirdPartyRefundAmount,
				balance: this.afterSalesDetailVo.balance,
				expressFee: this.afterSalesDetailVo.expressFee || 0,
			}
			tableData104.push(tfootData)
			this.tableData104 = tableData104
		},
	},
	created() {
		this._getGoodsConfiguration()
	},
	methods: {
		// 删除客服地址
		delAfterSalesImage(index) {
			this.delImageIdList.push(this.afterSalesCommentImages[index].imageId)
			this.afterSalesCommentImages.splice(index, 1)
		},
		// 寄回地址或结果反馈
		async _updateRemarksInRecord() {
			let paramJson = {
				afterSalesId: this.params.afterSalesId,
				checkNote: this.formData101.checkNote,
				delImageIdList: this.delImageIdList,
				returnStandard: this.formData101.returnStandard,
			}
			if (this.afterSalesDetailVo.afterType == 1) {
				paramJson.mailAddress = this.formData101.mailAddress
			}
			this.loading = true
			let {
				data: { resultCode, resultMsg },
			} = await updateRemarksInRecord(paramJson)
			this.loading = false
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.$emit('update')
			}
		},
		// 合并表格
		spanMethod({ rowIndex }) {
			if (rowIndex == 1) {
				return [1, 6]
			}
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
		// 处理商品名
		goodsNameCut(str) {
			let goodsNamenew = ''
			if (str) {
				let goodsName = str
				if (str.length > 39) {
					goodsNamenew =
						goodsName.substring(0, 20) +
						'<br />' +
						goodsName.substring(20, 39) +
						'...'
				} else if (str.length > 20) {
					goodsNamenew =
						goodsName.substring(0, 20) + '<br />' + goodsName.substring(20, 40)
				} else {
					goodsNamenew = str
				}
			}
			return goodsNamenew
		},
		copyCode() {
			this.$message.success('复制成功')
		},
	},
}
</script>

<style lang="scss" scoped>
.goodsInfo {
	display: flex;
	align-items: center;
	.c_image {
		width: 45px;
		height: 45px;
	}
	.goods-name {
		text-align: left;
		flex: 1;
		padding-left: 10px;
		.goods-name-box {
			color: #4498e0;
			cursor: pointer;
		}
	}
}
.tfootData {
	text-align: right;
	span {
		color: red;
	}
	p {
		margin: 0;
	}
}
.after-sales-image-list {
	display: flex;
	padding-left: 10px;
	span {
		margin-right: 10px;
	}
	.after-sales-image {
		margin-right: 20px;
		margin-bottom: 20px;
		width: 200px;
		height: 200px;
	}
}
.wg_image_box {
	overflow: hidden;
	position: relative;
	cursor: pointer;
	width: 120px;
	height: 120px;
	line-height: 116px;
	margin: 5px;
	padding: 0px;
	text-align: center;
	border: 1px solid #ccc;
	margin-top: 15px;
	display: inline-block;
	border-radius: 5px;
	box-shadow: #e6e6e6 0px 0px 7px 1px;
	.wg_image_item {
		width: 100%;
		height: 100%;
	}
	.wg_image_item_dlt {
		width: 100%;
		height: 24px;
		position: absolute;
		background: #e7e7e7;
		bottom: 0;
		left: 0;
		z-index: 10;
		text-align: center;
		line-height: 24px;
		border: 0;
		border-top-width: 0px;
	}
}
</style>

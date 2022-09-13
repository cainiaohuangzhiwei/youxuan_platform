<template>
	<div>
		<!-- 订单信息 -->
		<div class="order-info">
			<p>
				<span>店主：</span>
				<el-button type="text">
					<router-link
						:to="`/shop/shop/shopDetail/${orderDetail.childOrganizationId}`"
						>{{ orderDetail.organizationName }}</router-link
					>
				</el-button>
			</p>
			<p>
				<span>单号：</span>
				<el-button
					v-clipboard:copy="orderDetail.orderSn"
					v-clipboard:success="copyCode"
					type="text"
					>{{ orderDetail.orderSn }}</el-button
				>
			</p>
			<p>{{ getDeliverState() }}</p>
			<p>
				<span>确认收货时间：</span>
				<span>{{
					orderDetail.confirmDeliverTime
						? moment(orderDetail.confirmDeliverTime).format(
								'YYYY-MM-DD HH:mm:ss'
						  )
						: '无'
				}}</span>
			</p>
			<p>
				<span>是否延长收货：</span>
				<span>{{ orderDetail.delayConfirmDeliverTime > 0 ? '是' : '否' }}</span>
			</p>
		</div>
		<!-- 收货信息 -->
		<div class="consignee-info">
			<strong>收货信息</strong> {{ getDetailConsigneeInfo() }}
		</div>
		<!-- 待发货清单 -->
		<div>
			<p class="title-item">
				<strong>待发货清单</strong>
				<el-button
					v-if="tableData108.length"
					@click="toOrderShipmentsSpot"
					type="text"
					>立即发货</el-button
				>
			</p>
			<yx-table
				v-loading="loading108"
				:select="false"
				:columns="tableColumns108"
				:data="tableData108"
			>
				<template slot="goodsInfo" slot-scope="scope">
					<div>
						<el-button type="text">
							<router-link
								class="goods-name-box"
								:to="`/goods/GoodsDetail/${scope.row.goodsId}/${
									scope.row.goodsSpecId
								}/${1}/${scope.row.goodsSnapshotId}/${
									scope.row.goodsSpecSnapshotId
								}`"
							>
								<el-button type="text">
									<p v-html="goodsNameCut(scope.row.goodsName)"></p>
								</el-button>
							</router-link>
						</el-button>
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
		</div>
		<!-- 发货记录 -->
		<div class="deliver-record">
			<b>发货记录</b>
			<el-timeline class="timeline-box" v-loading="loadingDeliver">
				<el-timeline-item
					v-for="(orderDeliver, index) in orderDeliverList"
					:key="index"
				>
					<template slot="dot">
						<i class="cart_icon"></i>
					</template>
					<p class="frame-lin">
						<el-button type="text" @click="expressUpdate(orderDeliver)"
							>更新物流信息</el-button
						>
					</p>
					<div class="frame-cell">
						<p>
							<span class="frame-cell-span">单号：</span
							>{{ orderDeliver.deliverSn }}
							<span class="frame-cell-span">添加时间：</span
							>{{
								orderDeliver.addTime
									? moment(orderDeliver.addTime).format('YYYY-MM-DD HH:mm:ss')
									: '无'
							}}
							<span class="frame-cell-span">发货仓库：</span
							>{{ orderDeliver.warehouseName }}
							<span class="frame-cell-span">备注：</span
							>{{ orderDeliver.remark }}
						</p>
						<div
							class="consignee-info"
							v-for="(deliver, dIndex) in orderDeliver.deliverExpress"
							:key="dIndex"
						>
							<span class="frame-cell-span">物流公司：</span
							>{{ deliver.expressName }}
							<span class="frame-cell-span">物流单号：</span
							>{{ deliver.expressSn }}
							<span class="frame-cell-span">经办人：</span
							>{{ deliver.operatorName }}
							<span class="frame-cell-span">发货时间：</span
							>{{ moment(deliver.addTime).format('YYYY-MM-DD HH:mm:ss') }}
							<span class="frame-cell-span">物流状态：</span
							>{{ getDeliverTraceState(deliver.deliverTraceState) }}
							<span class="frame-cell-span">签收时间：</span
							>{{
								deliver.deliverTime
									? moment(deliver.deliverTime).format('YYYY-MM-DD HH:mm:ss')
									: '无'
							}}
							<el-button
								@click="_queryExpressInfoForPlatform(deliver)"
								class="frame-cell-span"
								type="text"
								>立即查询物流</el-button
							>
						</div>
						<yx-table
							class="deliver-goods-list"
							:select="false"
							:columns="tableColumns109"
							:data="orderDeliver.deliverGoodsList"
						>
							<template slot="goodsInfo" slot-scope="scope">
								<div>
									<el-button type="text">
										<router-link
											class="goods-name-box"
											:to="`/goods/GoodsDetail/${scope.row.goodsId}/${
												scope.row.goodsSpecId
											}/${1}/${scope.row.goodsSnapshotId}/${
												scope.row.goodsSpecSnapshotId
											}`"
										>
											<el-button type="text">
												<p v-html="goodsNameCut(scope.row.goodsName)"></p>
											</el-button>
										</router-link>
									</el-button>
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
					</div>
				</el-timeline-item>
				<el-timeline-item>
					<template slot="dot">
						<span></span>
					</template>
				</el-timeline-item>
			</el-timeline>
		</div>
		<!-- 物流信息 -->
		<Dialog
			:title="dialogTitle128"
			:visible.sync="dialogVisible128"
			:width="dialogWidth128"
			:bottomBtn="dialogBottomBtn128"
		>
			<p>物流单号：{{ expressInfo.LogisticCode }}</p>
			<el-timeline>
				<el-timeline-item
					v-for="(express, index) in expressInfo.Traces"
					:key="index"
				>
					<p class="express-info">{{ express.AcceptStation }}</p>
					<p class="express-info">
						{{ moment(express.AcceptTime).format('YYYY-MM-DD HH:mm:ss') }}
					</p>
				</el-timeline-item>
				<el-timeline-item>
					<template slot="dot">
						<span></span>
					</template>
				</el-timeline-item>
			</el-timeline>
		</Dialog>
		<!-- 物流信息 -->
		<!-- 更新物流 -->
		<Dialog
			:title="dialogTitle129"
			:visible.sync="dialogVisible129"
			:width="dialogWidth129"
			:bottomBtn="dialogBottomBtn129"
		>
			<p>
				<span class="span-left">订单号：</span>
				<span>{{ orderDetail.orderSn }}</span>
			</p>
			<div class="old-express">
				<span class="span-left">原物流信息：</span>
				<p>
					<span v-for="(item, index) in oldExpress.deliverExpress" :key="index"
						>{{ item.expressName }}#{{ item.expressSn }}</span
					>
				</p>
			</div>
			<el-button icon="el-icon-plus" @click="addExpress" type="text"
				>添加物流</el-button
			>
			<div v-if="newExpressList.length">
				<el-form class="express-form" ref="expressForm" label-width="100px">
					<template v-for="(item, index) in newExpressList">
						<div class="express-item" :key="index">
							<div>
								<el-form-item label="物流公司">
									<el-select
										filterable
										remote
										reserve-keyword
										class="inline-input"
										v-model="item.expressId"
										:remote-method="_getExpressList"
										:loading="loading"
										@focus="_getExpressList('')"
										@change="handleSelect(index)"
									>
										<el-option
											v-for="e in expressList"
											:key="e.expressId"
											:label="e.expressName"
											:value="e.expressId"
										>
										</el-option>
									</el-select>
									<el-button
										@click="showDialog130(index)"
										icon="el-icon-more"
									></el-button>
								</el-form-item>
								<el-form-item label="物流单号">
									<el-input v-model="item.expressSn"></el-input>
								</el-form-item>
							</div>
							<div class="del-r">
								<el-button
									@click="newExpressList.splice(index, 1)"
									type="danger"
									>删除</el-button
								>
							</div>
						</div>
					</template>
				</el-form>
			</div>
		</Dialog>
		<!-- 更新物流 -->
		<!-- 物流公司弹框 -->
		<Dialog
			:title="dialogTitle130"
			:visible.sync="dialogVisible130"
			:width="dialogWidth130"
			:bottomBtn="dialogBottomBtn130"
		>
			<yx-form
				:inline="true"
				:data="formData126"
				:items="formCfg126"
				:formAction="formAction126"
			>
			</yx-form>
			<yx-table
				v-loading="loading127"
				:columns="tableColumns127"
				:pagination="page127"
				:data="tableData127"
			>
				<template slot="expressId" slot-scope="scope">
					<el-radio
						v-model="expressId"
						:label="scope.row.expressId"
						@change="changeExpressId(scope.row)"
						>选择
					</el-radio>
				</template>
			</yx-table>
		</Dialog>
		<!-- 物流公司弹框 -->
	</div>
</template>

<script>
import YxTable from '@wg-vue-materials/yx-table'
import YxForm from '@wg-vue-materials/yx-form'
import Dialog from '@/components/Dialog'
import moment from 'moment'
import { assembleAreaName, goodsNameCut } from '@/utils/helper/common'
import {
	findOrderNoDeliverGoods,
	findOrderDeliverRecordByOrderId,
	queryExpressInfoForPlatform,
	updateDeliverExpress,
} from '@/api/yhtPlusCmsOrder'
import { getExpressList } from '@/api/express'
import { checkFunctionCode } from '@/utils/auth'
export default {
	components: {
		YxTable,
		Dialog,
		YxForm,
	},
	props: {
		orderAfterSalesVo: {
			type: Object,
			default: () => ({}),
		},
		orderDetail: {
			type: Object,
			default: () => ({}),
		},
		goodsType: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			loading108: false,
			loadingDeliver: false,
			loading127: false,
			selectIndex: 0,
			selectExpress: {},
			expressId: '',
			tableData127: [],
			tableColumns127: [
				{
					type: 'custom',
					dataIndex: 'expressId',
				},
				{
					type: 'string',
					dataIndex: 'expressName',
					title: '物流名称',
				},
			],
			page127: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData127()
				},
			},
			formData126: {
				keyword: '',
			},
			formCfg126: [
				{
					type: 'input',
					title: '筛选',
					dataIndex: 'keyword',
					placeholder: '请输入物流名称',
				},
			],
			formAction126: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						this.getData127(true)
					},
				},
			],
			dialogTitle130: '选择物流',
			dialogVisible130: false,
			dialogWidth130: '800px',
			dialogBottomBtn130: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.newExpressList[this.selectIndex] = Object.assign(
							this.newExpressList[this.selectIndex],
							this.selectExpress
						)
						let index = this.expressList.findIndex((item) => {
							return item.expressId == this.selectExpress.expressId
						})
						if (index == -1) {
							this.expressList.push(this.selectExpress)
						}
						this.dialogVisible130 = false
					},
				},
			],
			loading: false,
			expressList: [],
			newExpressList: [],
			oldExpress: {},
			dialogTitle129: '更新物流信息',
			dialogVisible129: false,
			dialogWidth129: '800px',
			dialogBottomBtn129: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this._updateDeliverExpress()
						// this.dialogVisible129 = false
					},
				},
			],
			expressInfo: {},
			dialogTitle128: '立即查询物流',
			dialogVisible128: false,
			dialogWidth128: '800px',
			dialogBottomBtn128: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible128 = false
					},
				},
			],
			goodsNameCut,
			tableColumns109: [
				{
					type: 'string',
					title: '货号',
					dataIndex: 'goodsNumber',
				},
				{
					type: 'custom',
					title: '商品',
					dataIndex: 'goodsInfo',
					width: '360',
				},
				{
					type: 'custom',
					title: '规格',
					dataIndex: 'skuInfo',
				},
				{
					type: 'amount',
					title: '券后价',
					dataIndex: 'price',
				},
				{
					type: 'amount',
					title: '单价',
					dataIndex: 'unitPrice',
				},
				{
					type: 'string',
					title: '已发数量',
					dataIndex: 'quantity',
				},
			],
			orderDeliverList: [],
			getGoodsDetailByOrganizationSpecId: checkFunctionCode(
				'getGoodsDetailByOrganizationSpecId'
			),
			moment,
			tableColumns108: [
				{
					type: 'string',
					title: '',
					dataIndex: 'index',
					customRender: (row, column, cellValue, index) => {
						return index + 1
					},
				},
				{
					type: 'string',
					title: '货号',
					dataIndex: 'goodsNumber',
				},
				{
					type: 'custom',
					title: '商品',
					dataIndex: 'goodsInfo',
					width: '360',
				},
				{
					type: 'custom',
					title: '规格',
					dataIndex: 'skuInfo',
				},
				{
					type: 'string',
					title: '单价',
					dataIndex: 'quantity',
					customRender: ({ price, unitPrice }) => {
						return !unitPrice
							? `￥${price.toFixed(2)}`
							: `￥${unitPrice.toFixed(2)}`
					},
				},
				{
					type: 'amount',
					title: '优惠价',
					dataIndex: 'price',
				},
				{
					type: 'string',
					title: '应发数量',
					dataIndex: 'shouldDeliverCount',
				},
			],
			tableData108: [],
			orderId: this.$route.params.orderId,
		}
	},
	created() {
		this.init()
		this._getExpressList()
	},
	methods: {
		// 立即发货
		toOrderShipmentsSpot() {
			this.$router.push({
				path: `/business/orderShipmentsSpot/${this.orderId}`,
			})
		},
		// 更新物流信息
		async _updateDeliverExpress() {
			let flag = true
			if (!this.newExpressList.length) {
				this.$message.warning('请添加物流信息')
				return
			}
			let paramJson = {
				orderDeliverId: this.oldExpress.orderDeliverId,
				orderDeliverExpressId:
					this.oldExpress.deliverExpress[
						this.oldExpress.deliverExpress.length - 1
					].orderDeliverExpressId,
				deliverExpressList: [],
			}
			this.newExpressList.map((item) => {
				if (!item.expressId) {
					flag = false
					this.$message.warning('请选择物流')
				} else if (!item.expressSn) {
					flag = false
					this.$message.warning('请输入物流单号')
				} else {
					paramJson.deliverExpressList.push({
						expressId: item.expressId,
						expressName: item.expressName,
						expressCode: item.expressCode,
						expressSn: item.expressSn,
					})
				}
			})
			if (!flag) {
				return
			}
			let {
				data: { resultCode, resultMsg },
			} = await updateDeliverExpress(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible129 = false
				this.newExpressList = []
				this._findOrderDeliverRecordByOrderId()
			}
		},
		// 选择物流公司
		changeExpressId(row) {
			this.selectExpress = row
		},
		// 显示物流公司弹框
		showDialog130(index) {
			this.selectIndex = index
			this.expressId = this.newExpressList[index].expressId
			this.formData126.keyword = ''
			this.dialogVisible130 = true
			this.getData127(true)
		},
		findSearchParams127(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page127.currentPage = 1
			}
			const paramJson = Object.assign(this.formData126, {
				length: this.page127.length,
				startIndex: (this.page127.currentPage - 1) * this.page127.length,
			})
			return paramJson
		},
		async getData127(flag) {
			this.loading127 = true
			let paramJson = this.findSearchParams127(flag)
			const {
				data: { resultCode, resultData },
			} = await getExpressList(paramJson)
			if (resultCode == 0) {
				this.tableData127 = resultData.expressList
				this.page127.count = resultData.count
			} else {
				this.tableData127 = []
				this.page127.count = 0
			}
			this.loading127 = false
		},
		// 选择物流公司
		handleSelect(index) {
			let selectItem = this.expressList.find((obj) => {
				if (obj.expressId == this.newExpressList[index].expressId) {
					return obj
				}
			})
			if (selectItem) {
				this.newExpressList[index] = Object.assign(
					this.newExpressList[index],
					selectItem
				)
			}
		},
		// 获取物流公司
		async _getExpressList(queryString) {
			this.loading = true
			let {
				data: { resultCode, resultData },
			} = await getExpressList({
				startIndex: 0,
				length: 20,
				status: 0,
				keyword: queryString,
			})
			this.loading = false
			if (resultCode == 0) {
				this.expressList = resultData.expressList
			} else {
				this.expressList = []
			}
		},
		// 添加物流
		addExpress() {
			this.newExpressList.push({
				expressId: '',
				expressName: '',
				expressCode: '',
				expressSn: '',
			})
		},
		// 更新物流弹框
		expressUpdate(data) {
			this.oldExpress = data
			this.newExpressList = []
			this.dialogVisible129 = true
		},
		// 复制提示
		copyCode() {
			this.$message.success('复制成功')
		},
		// 查询物流
		async _queryExpressInfoForPlatform(deliver) {
			let {
				data: { resultCode, resultData },
			} = await queryExpressInfoForPlatform({
				orderDeliverExpressId: deliver.orderDeliverExpressId,
			})
			if (resultCode == 0) {
				this.dialogVisible128 = true
				this.expressInfo = resultData
			}
		},
		// 获取发货记录
		async _findOrderDeliverRecordByOrderId() {
			this.loadingDeliver = true
			let {
				data: { resultCode, resultData },
			} = await findOrderDeliverRecordByOrderId({
				orderId: this.orderId,
			})
			this.loadingDeliver = false
			if (resultCode == 0) {
				this.orderDeliverList = resultData.orderDeliverList || []
			}
		},
		// 获取待发货列表
		async _findOrderNoDeliverGoods() {
			this.loading108 = true
			let {
				data: { resultCode, resultData },
			} = await findOrderNoDeliverGoods({
				orderId: this.orderId,
			})
			this.loading108 = false
			if (resultCode == 0) {
				this.tableData108 = resultData.orderGoodsList
			}
		},
		init() {
			this._findOrderNoDeliverGoods()
			this._findOrderDeliverRecordByOrderId()
		},
		// 获取收货地址
		getDetailConsigneeInfo() {
			console.log(
				assembleAreaName(this.orderDetail),
				'>>>>>>>>>>>>>',
				this.orderDetail
			)
			return `联系人：${this.orderDetail.consignee || '无'}, 电话：${
				this.orderDetail.phoneMob || '无'
			}，所在区域：${assembleAreaName(this.orderDetail)}${
				this.orderDetail.address
			}`
		},
		// 获取物流状态
		getDeliverTraceState(deliverTraceState) {
			if (deliverTraceState == 0) {
				return '无轨迹'
			} else if (deliverTraceState == 1) {
				return '已揽收'
			} else if (deliverTraceState == 2) {
				return '在途中'
			} else if (deliverTraceState == 3) {
				return '已签收'
			} else if (deliverTraceState == 4) {
				return '问题件'
			} else {
				return '-'
			}
		},
		// 获取发货状态
		getDeliverState() {
			let deliverGoods = ''
			if (
				this.orderDetail.deliverSign == 0 &&
				this.orderDetail.deliverState == 1
			) {
				deliverGoods = '待发货(未拣货)'
			} else if (
				this.orderDetail.deliverSign == 1 &&
				this.orderDetail.deliverState == 1
			) {
				deliverGoods = '待发货(拣货中)'
			} else if (
				this.orderDetail.deliverSign == 2 &&
				this.orderDetail.deliverState == 3
			) {
				deliverGoods = '已发货(部分商品发货)'
			} else if (
				this.orderDetail.deliverSign == 3 &&
				this.orderDetail.deliverState == 3
			) {
				deliverGoods = '已发货(全部商品发货)'
			} else if (
				this.orderDetail.deliverSign == 3 &&
				this.orderDetail.deliverState == 4
			) {
				deliverGoods = '已确认收货'
			} else {
				if (this.orderDetail.deliverState == 1) {
					deliverGoods = '待发货(未拣货)'
				} else {
					deliverGoods = '状态异常'
				}
			}
			return `【${deliverGoods}】`
		},
	},
}
</script>

<style lang="scss" scoped>
.order-info {
	display: flex;
	align-items: center;
	p {
		margin-right: 30px;
	}
}
.info-item {
	padding: 6px 0;
}
.consignee-info {
	margin-top: 10px;
	padding: 18px;
	background: #f5f5f5;
	strong {
		margin-right: 10px;
	}
}
.title-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
}
.deliver-record {
	margin-top: 20px;
}
.timeline-box {
	padding: 10px 20px;
	margin-top: 20px;
}
.cart_icon {
	background-color: #4977f1;
	position: absolute;
	left: -16px;
	width: 42px;
	height: 42px;
	border-radius: 50%;
	background-image: url('https://youxuan.yunhuotong.net/yhtplus/web/image/cart_icon.png');
	padding: 19px;
	display: inline-block;
	background-repeat: no-repeat;
	background-size: auto;
	background-position: center;
	cursor: pointer;
}
.frame-cell {
	border: 2px solid #e0e0e0;
	padding: 10px;
	position: relative;
	margin-left: 20px;
}
.frame-cell::before {
	content: '';
	display: block;
	border-width: 10px;
	position: absolute;
	top: -20px;
	left: 20px;
	border-style: solid dashed dashed;
	border-color: transparent transparent #e0e0e0 transparent;
	font-size: 0;
	line-height: 0;
}
.frame-cell::after {
	display: block;
	content: '';
	border-width: 10px;
	position: absolute;
	top: -18px;
	left: 20px;
	border-style: solid dashed dashed;
	border-color: transparent transparent white transparent;
	font-size: 0;
	line-height: 0;
}
.frame-lin {
	height: 20px;
	text-align: right;
}
.frame-cell-span {
	text-align: right;
	display: inline-block;
	margin: 0 6px 0 15px;
}
.deliver-goods-list {
	margin-top: 20px;
}
.express-info {
	margin: 0;
	padding-bottom: 10px;
}
.span-left {
	width: 140px;
	text-align: right;
	display: inline-block;
	padding-right: 20px;
}
.old-express {
	display: flex;
	p {
		margin: 0;
	}
	span {
		display: block;
	}
}
.express-form {
	width: 460px;
}
.express-item {
	display: flex;
}
.del-r {
	padding-left: 20px;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	padding-bottom: 18px;
}
</style>

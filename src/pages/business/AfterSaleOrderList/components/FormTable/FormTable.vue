<template>
	<div class="afterSaleOrderList">
		<WgForm
			:inline="true"
			labelWidth="68px"
			:data="formData115"
			:items="formCfg115"
			:formAction="formAction115"
			:actionInline="true"
		>
			<template #supplierNumberIds>
				<el-select
					v-model="formData115.supplierNumberIds"
					multiple
					filterable
					remote
					clearable
					placeholder="请输入商家名称"
					value-key="supplierAccountNumberId"
					:remote-method="_findSupplierAccountNumberForList"
				>
					<el-option
						v-for="item in formDataSupplierAccountNumberList"
						:key="item.supplierAccountNumberId"
						:label="item.supplierName"
						:value="item.supplierAccountNumberId"
					>
					</el-option>
				</el-select>
			</template>
		</WgForm>
		<!-- 表格表头设置 -->
		<table-header-set
			:tableTitle="$route.meta.title"
			:tableStorageKey="$route.name + 'Columns_'"
			:tableColumns.sync="tableColumns115"
		></table-header-set>
		<yx-table
			:select="false"
			v-loading="loading"
			:columns="tableColumns115"
			:pagination="page115"
			:data="tableData115"
		>
			<template slot="afterSalesSn" slot-scope="scope">
				<el-button type="text">
					<router-link
						:to="`/business/afterSaleOrderDetails/${scope.row.afterSalesId}`"
						>{{ scope.row.afterSalesSn }}</router-link
					>
				</el-button>
				<div>
					{{ moment(scope.row.addTime).format('YYYY-MM-DD HH:mm:ss') }}
				</div>
			</template>
			<template slot="orderSn" slot-scope="scope">
				<el-button type="text">
					<router-link :to="`/business/orderDetails/${scope.row.orderId}`">{{
						scope.row.orderSn
					}}</router-link>
				</el-button>
				<div>
					{{ moment(scope.row.orderAddTime).format('YYYY-MM-DD HH:mm:ss') }}
				</div>
			</template>
			<template slot="organizationName" slot-scope="scope">
				<router-link
					style="color: #0096fb"
					:to="`/shop/shop/shopDetail/${scope.row.organizationId}`"
					>{{ scope.row.organizationName }}</router-link
				>
			</template>
			<template slot="astNumStr" slot-scope="scope">
				<a
					style="color: #0096fb"
					target="_blank"
					@click.prevent="handleAfterSaleGoods(scope.row)"
					>{{ scope.row.astNumStr }}</a
				>
			</template>
			<template slot="trackingPrice" slot-scope="scope">
				<div>￥{{ scope.row.trackingPrice.toFixed(2) }}</div>
				<el-button
					v-if="scope.row.shippingDocuments"
					class="voucher-btn"
					plain
					size="mini"
					type="primary"
					@click.prevent="handleVoucher(scope.row)"
				>
					凭证
				</el-button>
			</template>
			<template slot="compensationAmount" slot-scope="scope">
				<div
					v-for="(priceItem, priceIndex) in scope.row.priceList"
					:key="priceIndex"
					style="margin-bottom: 5px"
				>
					￥{{ priceItem.price }}
					<span class="stateBgColor stateBgColor-red">{{
						priceItem.status_val
					}}</span>
				</div>
			</template>
			<template slot="afterOrderStatus" slot-scope="scope">
				<span :class="afterOrderStatusMap[scope.row.afterOrderStatus].color">{{
					scope.row.collectionFlag
						? afterOrderStatusMap[scope.row.afterOrderStatus].value +
						  '(上门取件)'
						: afterOrderStatusMap[scope.row.afterOrderStatus].value
				}}</span>
			</template>
			<template slot="acceptTheStatus" slot-scope="scope">
				<span :class="acceptTheStatusMap[scope.row.acceptTheStatus].color">{{
					acceptTheStatusMap[scope.row.acceptTheStatus].value
				}}</span>
			</template>
			<template slot="supplierAfterSalesStatus" slot-scope="scope">
				<span
					:class="
						supplierAfterSalesStatusMap[scope.row.supplierAfterSalesStatus]
							.color
					"
					>{{
						supplierAfterSalesStatusMap[scope.row.supplierAfterSalesStatus]
							.value
					}}</span
				>
			</template>
		</yx-table>
		<Dialog
			:title="dialogTitle116"
			:visible="dialogVisible116"
			:width="dialogWidth116"
			:bottomBtn="dialogBottomBtn116"
			@before-close="
				() => {
					dialogVisible116 = false
					formData117 = {
						customerRemark: '',
						warehouseRemark: '',
					}
				}
			"
		>
			<yx-form
				:inline="false"
				:data="formData117"
				:items="formCfg117"
				:formAction="formAction117"
				label-position="right"
				label-width="90px"
				:rules="formRules117"
			>
			</yx-form>
		</Dialog>
		<Dialog
			:title="dialogTitle118"
			:visible="dialogVisible118"
			:width="dialogWidth118"
			:bottomBtn="dialogBottomBtn118"
			@before-close="dialogVisible118 = false"
		>
			<yx-table
				:select="false"
				v-loading="refundConfirmLoading"
				:columns="tableColumns119"
				:pagination="page119"
				:data="tableData119"
			>
				<template slot="goodsId" slot-scope="scope">
					<div class="goods_name active" @click="skipGoodsDetails(scope.row)">
						<div>货号：{{ scope.row.goodsNumber }}</div>
						<div>{{ scope.row.goodsName }}</div>
					</div>
				</template>
				<template slot="goodsSpecId" slot-scope="scope">
					<div>颜色：{{ scope.row.specOne }}</div>
					<div>尺码：{{ scope.row.specTwo }}</div>
				</template>
				<template slot="refundNumber" slot-scope="scope">
					<el-input
						v-model="scope.row.refundNumber"
						placeholder="请退款数量"
						type="number"
					></el-input>
				</template>
			</yx-table>
			<yx-form
				:inline="false"
				:data="refundConfirmFormData"
				:items="refundConfirmFormCfg"
				label-position="right"
				label-width="110px"
				:rules="refundConfirmFormRules"
			>
			</yx-form>
		</Dialog>
		<Dialog
			:title="dialogTitle120"
			:visible="dialogVisible120"
			:width="dialogWidth120"
			:bottomBtn="dialogBottomBtn120"
			@before-close="dialogVisible120 = false"
		>
			<el-form ref="form" :model="formData121" label-width="100px">
				<el-form-item label="是否使用商家端的仓库地址">
					<el-radio-group v-model="formData121.rate">
						<el-radio :label="1">是</el-radio>
						<el-radio :label="2">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="寄回地址" v-if="formData121.rate == 2">
					<el-input
						v-model="formData121.remark"
						type="textarea"
						placeholder="寄回地址（用户可见）"
						:autosize="{ minRows: 2, maxRows: 4 }"
					/>
				</el-form-item>
				<div v-else>
					<el-form-item label="选择仓库地址">
						<el-select
							v-model="formData121.selectAd"
							placeholder="请选择"
							@change="selectChange"
						>
							<el-option
								v-for="item in options"
								:key="item.afterSalesAddressId"
								:label="item.title"
								:value="item.afterSalesAddressId"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<div v-if="formData121.selectAd">
						<el-form-item label="仓库收件人">
							<span>{{ formData121.consignee }}</span>
						</el-form-item>
						<el-form-item label="手机号">
							<span>{{ formData121.phone }}</span>
						</el-form-item>
						<el-form-item label="电话">
							<span>{{ formData121.tel }}</span>
						</el-form-item>
						<el-form-item label="仓库地址">
							<span>{{ formData121.address }}</span>
						</el-form-item>
						<el-form-item label="寄回标准">
							<span>{{ formData121.standard }}</span>
						</el-form-item>
					</div>
				</div>
			</el-form>
		</Dialog>
		<Dialog
			:title="dialogTitle124"
			:visible="dialogVisible124"
			:width="dialogWidth124"
			:bottomBtn="dialogBottomBtn124"
			@before-close="dialogVisible124 = false"
		>
			<yx-form
				:inline="true"
				:data="formData125"
				:items="formCfg125"
				:formAction="formAction125"
			>
			</yx-form>
		</Dialog>
		<!-- 运费凭证 -->
		<Dialog
			title="凭证"
			:visible="voucherDialogVisible"
			width="50%"
			:bottomBtn="voucherDialogBottomBtn"
			@before-close="voucherDialogVisible = false"
		>
			<div>
				<img class="wg-width" :src="voucherUrl" />
			</div>
		</Dialog>
		<Dialog
			title="售后商品信息"
			:visible="astNumStrDialogVisible"
			width="50%"
			:bottomBtn="astNumStrDialogBottomBtn"
			@before-close="astNumStrDialogVisible = false"
		>
			<yx-table
				:select="false"
				v-loading="astNumStrLoading"
				:columns="astNumStrTableColumns115"
				:data="astNumStrTableData115"
			>
				<template slot="goodsId" slot-scope="scope">
					<div class="goods_name active" @click="skipGoodsDetails(scope.row)">
						<div>货号：{{ scope.row.goodsNumber }}</div>
						<div>{{ scope.row.goodsName }}</div>
					</div>
				</template>
				<template slot="goodsSpecId" slot-scope="scope">
					<div>颜色：{{ scope.row.specOne }}</div>
					<div>尺码：{{ scope.row.specTwo }}</div>
				</template>
			</yx-table>
		</Dialog>
		<!-- 订单补款dialog -->
		<Dialog
			:title="dialogTitle101"
			:visible="dialogVisible101"
			:width="dialogWidth101"
			:bottomBtn="dialogBottomBtn101"
			@before-close="
				() => {
					dialogVisible101 = false
					formData102 = {
						orderSn: '',
						supplementType: '1',
						supplementRefundWay: '1',
						returnMoneyReason: '9',
						returnMoney: '',
						supplementRefundDesc: '',
						remark: '',
					}
				}
			"
		>
			<yx-form
				:inline="false"
				:data="formData102"
				:items="formCfg102"
				:formAction="formAction102"
				label-position="right"
				label-width="100px"
			>
			</yx-form>
			<div>该订单已经发起过补款，详细信息如下，请确认是否还要再次发起</div>
			<yx-table
				:select="false"
				v-loading="tableDataLoading103"
				:columns="tableColumns103"
				:data="tableData103"
			></yx-table>
			<div style="margin-top: 20px">
				该物流单号已经发起补款，详情信息如下，请确认是否还要再次发起
			</div>
			<yx-table
				:select="false"
				v-loading="tableDataLoading103"
				:columns="tableColumns103"
				:data="tableData104"
			></yx-table>
		</Dialog>
		<!-- 录入返退金额dialog -->
		<Dialog
			title="录入返退金额"
			:visible="writeRefundPriceDialogVisible"
			width="30%"
			:bottomBtn="writeRefundPriceDialogBottomBtn"
			@before-close="
				() => {
					writeRefundPriceDialogVisible = false
					writeRefundPriceFormData.writeRefundPrice = ''
				}
			"
		>
			<div class="writeRefundPriceContent">
				录入退款金额后售后状态将扭转为待退款，请确认上游已退款再录入返退金额
			</div>
			<yx-form
				:inline="false"
				:data="writeRefundPriceFormData"
				:items="writeRefundPriceFormCfg"
				label-position="right"
				label-width="120px"
				:rules="writeRefundPriceFormRules"
			>
			</yx-form>
		</Dialog>
		<!-- 关闭售后单dialog -->
		<Dialog
			title="关闭售后单"
			:visible="closeAfterSalesDialogVisible"
			width="30%"
			:bottomBtn="closeAfterSalesDialogBottomBtn"
			@before-close="
				() => {
					closeAfterSalesDialogVisible = false
					closeAfterSalesFormData.remark = ''
				}
			"
		>
			<yx-form
				:inline="false"
				:data="closeAfterSalesFormData"
				:items="closeAfterSalesFormCfg"
				label-position="right"
				label-width="120px"
				:rules="closeAfterSalesFormRules"
			>
			</yx-form>
		</Dialog>
		<!-- 填写物流单号dialog -->
		<Dialog
			title="填写物流单号"
			:visible="updateAfterSalesExpressVisible"
			width="30%"
			:bottomBtn="updateAfterSalesExpressBottomBtn"
			@before-close="
				() => {
					updateAfterSalesExpressVisible = false
					updateAfterSalesExpressData = {
						expressName: '',
						logisticsNum: '',
						logisticsCost: '',
					}
				}
			"
		>
			<yx-form
				:inline="false"
				:data="updateAfterSalesExpressData"
				:items="updateAfterSalesExpressCfg"
				label-position="right"
				label-width="100px"
				:rules="updateAfterSalesExpressRules"
			>
			</yx-form>
		</Dialog>
		<!-- //仲裁弹窗 -->
		<Dialog
			:title="arbitrationTitle"
			:visible="arbitramentDialog"
			width="50%"
			:bottomBtn="arbitramentBottomBtn"
			@before-close="arbitramentDialog = false"
		>
			<h3>{{ arbitramentHint }}</h3>
			<yx-form
				style="margin-top: 60px"
				ref="form105"
				:inline="false"
				:rules="funRules"
				:items="arbitramentItem"
				:data="arbitramentData"
				labelWidth="80px"
			>
				<template slot="uploading">
					<el-input
						class="textarea"
						size="small"
						placeholder="图片复制/粘贴"
						show-word-limit
						@paste.native="_uploadImageHttpRequest"
					>
					</el-input>
				</template>
			</yx-form>
		</Dialog>

		<return-money-dialog
			:dialogVisible.sync="refundMoneyDialogVisible"
			:activeRow="activeRow"
			@fatherMethodInit="
				() => {
					getData110()
				}
			"
		></return-money-dialog>
		<change-sale-dialog
			:visible.sync="changeSaleDialog"
			:changeSaleRow="changeSaleRow"
			@Refresh="Refresh"
		></change-sale-dialog>
	</div>
</template>
<script>
import moment from 'moment'
import YxForm from '@wg-vue-materials/yx-form'
import WgForm from '@/components/WgForm'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import TableHeaderSet from '@/components/TableHeaderSet'
import { checkFunctionCode } from '@/utils/auth'
import { downloadFile, isNull } from '@/utils/helper/common'
import { exportAfterSales } from '@/api/webImport'
import { queryNotSelfBrandSupplierAccountIds } from '@/api/brandRecord'
import { uploadImageList } from '@/api/image'
import {
	queryUnAuditAfterSales,
	queryUnCheckingAfterSales,
	exportOverTimeAfterSales,
} from '@/api/business'
import ChangeSaleDialog from './ChangeSaleDialog'

import {
	listAfterSales,
	updateCustomerWarehouseRemark,
	findAsProduct,
	updateAfterSalesSuppCheck,
	goodsChecking,
	updateAfterSalesWareCheck,
	fillReturnAmount,
	closeAfterSales,
	updateAfterSalesfillLogistics,
	afterSalesAddressList,
	syncAfterSalesManual,
	extendMailTime,
} from '@/api/afterSales'
import {
	equityCompensation,
	createPrepayment,
} from '@/api/afterSalesPrepayment'
import { addNewOrderRefundByOrderIdNews } from '@/api/yhtPlusCmsOrder'
import { addOrderCompensation } from '@/api/yhtplusCmsOrderCompensation'
import { suppConfirmRefundChecking } from '@/api/suppAfterSales'
import { getExpressList } from '@/api/public'
import { findSupplierAccountNumberForList } from '@/api/yhtPlusCmsSupplierAccountNumber'
import { getBigImg } from '@/utils/imageTool'
import ReturnMoneyDialog from '../../../components/ReturnMoneyDialog'
export default {
	components: {
		YxForm,
		WgForm,
		YxTable,
		Dialog,
		ReturnMoneyDialog,
		ChangeSaleDialog,
		TableHeaderSet,
	},
	props: [],
	data() {
		return {
			notApproved: false,
			notInspected: false,
			changeSaleRow: {},
			changeSaleDialog: false,
			//S新售后 不同意退款/验收不通过弹窗
			imageDialog: false,
			arbitramentDialog: false,
			arbitramentHint: '',
			newAfterSalesNoPass: '',
			newAfterSalesId: null,
			arbitramentData: {
				remark: '',
				activityImage: [],
			},
			arbitramentBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.form105.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.newAfterSales()
								// this.dialogVisible105 = false
							}
						})
					},
				},
				{
					title: '取消',
					type: 'cancel',
					click: () => {
						this.arbitramentData = {
							remark: '',
							activityImage: [],
						}
						this.arbitramentDialog = false
					},
				},
			],
			arbitramentItem: [
				{
					title: '审核备注',
					type: 'textarea',
					dataIndex: 'remark',
					placeholder: '该备注会同步到用户侧',
				},
				{
					title: '图片上传',
					type: 'custom',
					dataIndex: 'uploading',
				},
				{
					type: 'uploadImage',
					dataIndex: 'activityImage',
					uploadAttributes: {
						limit: 4,
						imageName: 'imageUrl',
						accept: 'image/jpeg, image/jpg, image/png',
						beforeAvatarUpload: (file) => this.beforeAvatarUpload(file),
						httpRequest: (file) =>
							this._uploadImageHttpRequest(file, 'clickUploading'),
					},
				},
				{
					type: 'custom',
					dataIndex: 'merchantAddress',
				},
			],
			funRules: {
				remark: [{ required: true, message: '请填写备注!', trigger: 'blur' }],
			},
			//E新售后 不同意退款/验收不通过弹窗

			moment,
			user: {},
			loading: false,
			supplyDialogVisible: false,
			refundMoneyDialogVisible: false,
			notSeIfBrandMap: {},
			activeRow: {},
			// 搜索商家数据源
			formDataSupplierAccountNumberList: [],
			formData115: {
				afterSalesSn: '',
				orderSn: '',
				supplierNumberIds: [], // 商家
				brandName: '',
				phone: '',
				trackingNum: '',
				startTime: moment().startOf('month').valueOf(),
				endTime: moment().endOf('month').valueOf(),
				addTimeList: [moment().startOf('month'), moment().endOf('month')],
				afterType: '',
				afterOrderStatus: '1',
				acceptTheStatus: '1',
				arbitrationState: '0',
				supplierAfterSalesStatus: '1',
				customerRemark: '',
				compensationState: '',
				trackingPriceIsMore15: '',
				afterReason: '',
			},
			formCfg115: [
				{
					type: 'input',
					title: '售后单号',
					dataIndex: 'afterSalesSn',
					enter: () => {
						if (!this.loading) this.getData115(true)
					},
				},
				{
					type: 'input',
					title: '订单号',
					dataIndex: 'orderSn',
					enter: () => {
						if (!this.loading) this.getData115(true)
					},
				},
				{
					type: 'input',
					title: '会场',
					dataIndex: 'brandName',
					enter: () => {
						if (!this.loading) this.getData115(true)
					},
				},
				{
					type: 'input',
					title: '店主手机',
					dataIndex: 'phone',
					enter: () => {
						if (!this.loading) this.getData115(true)
					},
				},
				{
					type: 'custom',
					title: '商家',
					dataIndex: 'supplierNumberIds',
					colSpan: 6,
				},
				{
					type: 'input',
					title: '物流单号',
					dataIndex: 'trackingNum',
					enter: () => {
						if (!this.loading) this.getData115(true)
					},
				},
				{
					type: 'select',
					title: '售后类型',
					dataIndex: 'afterType',
					label: 'value',
					change: () => {
						if (!this.loading) this.getData115(true)
					},
					options: [
						{
							afterType: '',
							value: '全部',
						},
						{
							afterType: '1',
							value: '退货退款',
						},
						{
							afterType: '2',
							value: '仅退款',
						},
					],
				},
				{
					type: 'select',
					title: '售后状态',
					dataIndex: 'afterOrderStatus',
					label: 'value',
					change: () => {
						if (!this.loading) this.getData115(true)
					},
					options: [
						{
							afterOrderStatus: '1',
							value: '全部',
						},
						{
							afterOrderStatus: '2',
							value: '申请中',
						},
						{
							afterOrderStatus: '3',
							value: '待寄出',
						},
						{
							afterOrderStatus: '4',
							value: '已寄出',
						},
						{
							afterOrderStatus: '5',
							value: '待退款',
						},
						{
							afterOrderStatus: '6',
							value: '退款中',
						},
						{
							afterOrderStatus: '7',
							value: '退款成功',
						},
						{
							afterOrderStatus: '8',
							value: '已关闭',
						},
					],
				},
				{
					type: 'select',
					title: '受理状态',
					dataIndex: 'acceptTheStatus',
					label: 'value',
					change: () => {
						if (!this.loading) this.getData115(true)
					},
					options: [
						{
							acceptTheStatus: '1',
							value: '全部',
						},
						{
							acceptTheStatus: '8',
							value: '待受理',
						},
						{
							acceptTheStatus: '2',
							value: '受理中',
						},
						{
							acceptTheStatus: '3',
							value: '同步中',
						},
						{
							acceptTheStatus: '4',
							value: '已受理',
						},
						{
							acceptTheStatus: '5',
							value: '受理完成',
						},
						{
							acceptTheStatus: '6',
							value: '结果确认中',
						},
						{
							acceptTheStatus: '7',
							value: '已关闭',
						},
					],
				},
				{
					type: 'select',
					title: '商家售后',
					dataIndex: 'supplierAfterSalesStatus',
					label: 'value',
					change: () => {
						if (!this.loading) this.getData115(true)
					},
					options: [
						{
							supplierAfterSalesStatus: '1',
							value: '全部',
						},
						{
							supplierAfterSalesStatus: '2',
							value: '物流同步中',
						},
						{
							supplierAfterSalesStatus: '3',
							value: '待验货',
						},
						{
							supplierAfterSalesStatus: '4',
							value: '售后完成',
						},
						{
							supplierAfterSalesStatus: '5',
							value: '异常处理中',
						},
						{
							supplierAfterSalesStatus: '6',
							value: '已关闭',
						},
					],
				},
				{
					type: 'select',
					title: '客服备注',
					dataIndex: 'customerRemark',
					label: 'value',
					change: () => {
						if (!this.loading) this.getData115(true)
					},
					options: [
						{
							customerRemark: '',
							value: '全部',
						},
						{
							customerRemark: 1,
							value: '有',
						},
						{
							customerRemark: 0,
							value: '无',
						},
					],
				},
				{
					type: 'select',
					title: '运费补偿',
					dataIndex: 'compensationState',
					label: 'value',
					change: () => {
						if (!this.loading) this.getData115(true)
					},
					options: [
						{
							compensationState: '',
							value: '全部',
						},
						{
							compensationState: '0',
							value: '未发起',
						},
						{
							compensationState: '1',
							value: '未派发',
						},
						{
							compensationState: '2',
							value: '已派发',
						},
					],
				},
				{
					type: 'select',
					title: '售后原因',
					dataIndex: 'afterReason',
					label: 'value',
					change: () => {
						if (!this.loading) this.getData115(true)
					},
					options: [
						{
							afterReason: '',
							value: '全部',
						},
						{
							afterReason: '7天无理由退货（运费自理）',
							value: '7天无理由退货（运费自理）',
						},
						{
							afterReason: '质量问题（瑕疵/破损污渍/发霉变质等）',
							value: '质量问题（瑕疵/破损污渍/发霉变质等）',
						},
						{
							afterReason: '颜色、款式、图案与商品描述不符',
							value: '颜色、款式、图案与商品描述不符',
						},
						{
							afterReason: '商家发错货',
							value: '商家发错货',
						},
						{
							afterReason: '少件/漏发',
							value: '少件/漏发',
						},
						{
							afterReason: '商品破损',
							value: '商品破损',
						},
						{
							afterReason: '个人原因/不喜欢拒收',
							value: '个人原因/不喜欢拒收',
						},
						{
							afterReason: '签收异常/物流异常/停滞',
							value: '签收异常/物流异常/停滞',
						},
						{
							afterReason: '未收到货(显示签收)',
							value: '未收到货(显示签收)',
						},
						{
							afterReason: '长时间未发货',
							value: '长时间未发货',
						},
						{
							afterReason: '拒收(破损/包裹变形等)',
							value: '拒收(破损/包裹变形等)',
						},
						{
							afterReason: '不想要了，错拍',
							value: '不想要了，错拍',
						},
						{
							afterReason: '有污渍/发霉变质',
							value: '有污渍/发霉变质',
						},
						{
							afterReason: '收到商品有破损',
							value: '收到商品有破损',
						},
						{
							afterReason: '大小/尺码与描述不符',
							value: '大小/尺码与描述不符',
						},
					],
				},
				{
					type: 'select',
					title: '仲裁状态',
					dataIndex: 'arbitrationState',
					label: 'value',
					change: () => {
						if (!this.loading) this.getData115(true)
					},
					options: [
						{
							arbitrationState: '0',
							value: '全部',
						},
						{
							arbitrationState: '1',
							value: '待商家处理',
						},
						{
							arbitrationState: '2',
							value: '待平台处理',
						},
						{
							arbitrationState: '4',
							value: '仲裁完成',
						},
						{
							arbitrationState: '3',
							value: '仲裁关闭',
						},
					],
				},
				{
					type: 'select',
					title: '运费>15',
					dataIndex: 'trackingPriceIsMore15',
					label: 'value',
					change: () => {
						if (!this.loading) this.getData115(true)
					},
					options: [
						{
							trackingPriceIsMore15: '',
							value: '全部',
						},
						{
							trackingPriceIsMore15: '1',
							value: '是',
						},
						{
							trackingPriceIsMore15: '0',
							value: '否',
						},
					],
				},
				{
					type: 'time',
					title: '申请时间',
					dataIndex: 'addTimeList',
					colSpan: 12,
					change: () => {
						this.formData115.addTimeList = this.formData115.addTimeList || [
							'',
							'',
						]
						let startTime = this.formData115.addTimeList[0]
						let endTime = this.formData115.addTimeList[1]
						this.formData115.startTime = startTime
							? moment(startTime).valueOf()
							: ''
						this.formData115.endTime = endTime ? moment(endTime).valueOf() : ''
					},
					timeAttributes: {
						type: 'datetimerange',
						defaultTime: ['00:00:00', '23:59:59'],
						pickerOptions: {
							shortcuts: [
								{
									text: '今日',
									onClick(picker) {
										picker.$emit('pick', [
											moment().startOf('days'),
											moment().endOf('days'),
										])
									},
								},
								{
									text: '昨日',
									onClick(picker) {
										picker.$emit('pick', [
											moment().subtract(1, 'days').startOf('days'),
											moment().subtract(1, 'days').endOf('days'),
										])
									},
								},
								{
									text: '本周',
									onClick(picker) {
										picker.$emit('pick', [
											moment().startOf('week'),
											moment().endOf('week'),
										])
									},
								},
								{
									text: '上周',
									onClick(picker) {
										picker.$emit('pick', [
											moment().subtract(1, 'week').startOf('week'),
											moment().subtract(1, 'week').endOf('week'),
										])
									},
								},
								{
									text: '本月',
									onClick(picker) {
										picker.$emit('pick', [
											moment().startOf('months'),
											moment().endOf('months'),
										])
									},
								},
								{
									text: '上月',
									onClick(picker) {
										picker.$emit('pick', [
											moment().subtract(1, 'months').startOf('months'),
											moment().subtract(1, 'months').endOf('months'),
										])
									},
								},
							],
						},
					},
				},
			],
			formAction115: [
				{
					title: '导出',
					type: 'success',
					auth: 'exportAfterSales',
					click: () => {
						this.$confirm('确定导出售后单列表？', '提示', {
							type: 'success',
							callback: async (action) => {
								if (action === 'confirm') {
									let paramJson = this.findSearchParams115(true)
									let paramJson_ = { ...paramJson }
									const { data } = await exportAfterSales(paramJson_)
									if (data) {
										downloadFile(data, '导出售后单列表.xlsx')
									}
								}
							},
						})
					},
				},
				{
					title: '重置',
					isClear: true,
					align: 'right',
				},
				{
					title: '查询',
					type: 'primary',
					align: 'right',
					click: () => {
						if (!this.loading) this.getData()
					},
				},
				{
					title: '超时未审核',
					auth: 'queryUnAuditAfterSales',
					align: 'right',
					click: () => {
						this.handleApproved()
					},
					customRender: (action) => {
						action.hide = this.notApproved ? true : false
						return action
					},
				},
				{
					title: '超时未审核',
					align: 'right',
					type: 'primary',
					auth: 'queryUnAuditAfterSales',
					click: () => {
						this.handleNotApproved()
					},
					customRender: (action) => {
						action.hide = this.notApproved ? false : true
						return action
					},
				},
				{
					title: '超时未验货',
					align: 'right',
					auth: 'queryUnCheckingAfterSales',
					click: () => {
						this.handleInspected()
					},
					customRender: (action) => {
						action.hide = this.notInspected ? true : false
						return action
					},
				},
				{
					title: '超时未验货',
					align: 'right',
					type: 'primary',
					auth: 'queryUnCheckingAfterSales',
					click: () => {
						this.handleNotInspected()
					},
					customRender: (action) => {
						action.hide = this.notInspected ? false : true
						return action
					},
				},
				{
					title: '导出超时数据',
					align: 'right',
					type: 'primary',
					auth: 'exportOverTimeAfterSales',
					click: () => {
						this.exportOverTimeAfterSales()
					},
					customRender: (action) => {
						action.hide = this.notApproved || this.notInspected ? false : true
						return action
					},
				},
			],
			afterOrderStatusMap: {
				1: {
					value: '-',
				},
				2: {
					value: '申请中',
				},
				3: {
					value: '待寄出',
				},
				4: {
					value: '已寄出',
				},
				5: {
					value: '待退款',
				},
				6: {
					value: '退款中',
				},
				7: {
					value: '退款成功',
				},
				8: {
					value: '已关闭',
					color: 'stateBgColor stateBgColor-gray',
				},
			},
			acceptTheStatusMap: {
				1: {
					value: '-',
				},
				2: {
					value: '受理中',
				},
				3: {
					value: '同步中',
				},
				4: {
					value: '已受理',
				},
				5: {
					value: '受理完成',
				},
				6: {
					value: '结果确认中',
					color: 'stateBgColor stateBgColor-yellow',
				},
				7: {
					value: '已关闭',
					color: 'stateBgColor stateBgColor-gray',
				},
				8: {
					value: '待受理',
				},
			},
			supplierAfterSalesStatusMap: {
				1: {
					value: '-',
				},
				2: {
					value: '物流同步中',
				},
				3: {
					value: '待验货',
				},
				4: {
					value: '售后完成',
				},
				5: {
					value: '异常处理中',
					color: 'stateBgColor stateBgColor-red',
				},
				6: {
					value: '已关闭',
					color: 'stateBgColor stateBgColor-gray',
				},
			},
			tableData115: [],
			// 表格列设置
			tableColumns115: [
				{
					type: 'custom',
					dataIndex: 'afterSalesSn',
					title: '售后单号',
					width: '148',
					align: 'left',
				},
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '关联订单号',
					width: '180',
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场',
					align: 'left',
					width: '120',
				},
				{
					type: 'string',
					dataIndex: 'afterType',
					title: '售后类型',
					customRender: (row) => {
						const arr = ['', '退货退款', '仅退款']
						return arr[row.afterType] || '-'
					},
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'afterReason',
					title: '售后原因',
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'trackingNum',
					title: '客户退货物流单号',
					align: 'left',
				},
				{
					type: 'custom',
					dataIndex: 'trackingPrice',
					title: '运费',
					align: 'left',
				},
				{
					type: 'custom',
					dataIndex: 'afterOrderStatus',
					title: '售后状态',
					align: 'left',
					width: '84',
				},
				{
					type: 'custom',
					dataIndex: 'acceptTheStatus',
					title: '受理状态',
					align: 'left',
					width: '90',
				},
				{
					type: 'string',
					dataIndex: 'arbitrationState',
					title: '仲裁状态',
					customRender: (row) => {
						if (row.arbitrationState == 1) {
							return '待商家处理'
						} else if (row.arbitrationState == 2) {
							return '待平台处理'
						} else if (row.arbitrationState == 3) {
							return '已关闭'
						} else if (row.arbitrationState == 4) {
							return '仲裁完成'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'custom',
					dataIndex: 'supplierAfterSalesStatus',
					title: '商家售后状态',
					align: 'left',
					width: '96',
				},
				{
					type: 'custom',
					dataIndex: 'compensationAmount',
					title: '运费补偿',
					align: 'left',
					width: '120',
				},
				{
					type: 'string',
					dataIndex: 'compensationStatus',
					title: '运费保障卡赔付',
					align: 'left',
					customRender: (row) => {
						const arr = ['', '已赔付', '赔付失败']
						return arr[row.compensationStatus] || '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'thirdPartyRefundAmount',
					title: '第三方返退金额',
					align: 'left',
				},
				{
					type: 'custom',
					dataIndex: 'organizationName',
					title: '店主名称',
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'weixinUserName',
					title: '下单人',
					align: 'left',
				},
				{
					type: 'custom',
					dataIndex: 'astNumStr',
					title: '申请数/待退/已退',
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'applyForSupplierLog',
					title: '向商家申请次数',
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'sourceName',
					title: '下单设备',
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'orderId',
					title: '寄出有效期',
					align: 'left',
					width: '84',
					customRender: (row) => {
						if (row.availableGivingoutTime) {
							let hours = row.availableGivingoutTime / 1000 / 60 / 60
							let hoursRound = Math.floor(hours)
							return hoursRound + '小时'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'customerRemark',
					title: '客服备注',
					align: 'left',
					customRender: (row) => {
						if (row.customerRemark) {
							let text = ''
							if (row.customerRemark.length > 10) {
								text = row.customerRemark.slice(0, 10) + '...'
							} else {
								text = row.customerRemark
							}
							return row.customerRemark + text
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'warehouseRemark',
					title: '仓库备注',
					align: 'left',
					customRender: (row) => {
						if (row.warehouseRemark) {
							let text = ''
							if (row.warehouseRemark.length > 10) {
								text = row.warehouseRemark.slice(0, 10) + '...'
							} else {
								text = row.warehouseRemark
							}
							return row.warehouseRemark + text
						} else {
							return '-'
						}
					},
				},
				{
					type: 'action',
					dataIndex: 'listOperation',
					title: '操作',
					width: '180',
					fixed: 'right',
					actions: [
						{
							title: '查看详情',
							auth: 'listAfterSales',
							click: (row) => {
								this.$router.push(
									`/business/afterSaleOrderDetails/${row.afterSalesId}`
								)
							},
						},
						{
							title: '延长可回寄期',
							auth: 'extendMailTime',
							click: (row) => {
								this.returnablePeriod(row)
							},
							customRender: (action, row) => {
								action.hide = row.afterOrderStatus == 3 ? false : true
								return action
							},
						},
						{
							title: '填写备注',
							auth: 'updateCustomerWarehouseRemark',
							click: (row) => {
								this.activeRow = row
								this.dialogVisible116 = true
							},
						},
						{
							title: '确认退款',
							auth: 'updateAfterSalesRefund',
							customRender: (action, row) => {
								action.hide = row.afterOrderStatus == 5 ? false : true
								return action
							},
							click: async (row) => {
								this.activeRow = row
								this.refundConfirmLoading = true
								this.dialogVisible118 = true
								this.refundConfirmFormData.remark = row.afterReason
								const {
									data: { resultCode, resultData },
								} = await findAsProduct({
									afterSalesId: row.afterSalesId,
								})
								if (resultCode === 0) {
									this.tableData119 = [resultData.afterSalesProductVo]
									this.refundConfirmFormData.applyPayPrice =
										resultData.afterSalesProductVo.price
									this.refundConfirmFormData.remark = row.afterReason
									this.astNumStrLoading = false
									this.refundConfirmLoading = false
								}
							},
						},
						{
							title: '补款',
							auth: 'updateAfterSalesRefund',
							customRender: (action) => {
								const status =
									this.authList.addOrderCompensation &&
									(this.user.groupId == 2 || this.user.groupId == 8)
								action.hide = !status
								return action
							},
							click: async (row) => {
								this.activeRow = row
								this.refundMoneyDialogVisible = true
							},
						},
						{
							title: '运保卡赔付',
							auth: 'equityCompensation',
							popconfirm: true,
							popconfirmTitle: '点击确认生成赔付单并触发赔付！',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							customRender: (action, row) => {
								const status =
									row.afterOrderStatus == 7 &&
									row.afterReason == '7天无理由退货（运费自理）' &&
									row.showCompensation == 1
								action.hide = !status
								return action
							},
							confirm: async (row) => {
								const {
									data: { resultMsg: resultMsg1, resultCode: resultCode1 },
								} = await equityCompensation({
									afterSalesId: row.afterSalesId,
									orderId: row.orderId,
								})
								if (resultCode1 === 0) {
									this.$message.success(resultMsg1)
									this.getData115()
								}
							},
						},
						{
							title: '填写物流单号',
							auth: 'updateAfterSalesfillLogistics',
							customRender: (action, row) => {
								const status = row.afterOrderStatus == 3
								action.hide = !status
								return action
							},
							click: async (row) => {
								if (!row.fillLogistics) {
									return this.$message.error(
										'该售后单有上门揽件订单，不可填写物流单号'
									)
								}
								this.activeRow = row
								const {
									data: { resultData },
								} = await getExpressList({
									orderId: row.orderId,
								})
								this.updateAfterSalesExpressCfg[0].options =
									resultData.expressList
								this.updateAfterSalesExpressVisible = true
							},
						},
						{
							title: '立即同步',
							auth: 'syncAfterSalesManual',
							popconfirm: true,
							popconfirmTitle:
								'立即同步售后单？ 需要先协调上游开启售后或完成发货，才可进行此操作',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							customRender: (action, row) => {
								//售后状态为“申请中”，受理状态为“同步中” 显示立即同步按钮
								const status =
									row.afterOrderStatus == 2 && row.acceptTheStatus == 3
								action.hide = !status
								return action
							},
							confirm: async (row) => {
								const {
									data: { resultMsg, resultData },
								} = await syncAfterSalesManual({
									afterSalesId: row.afterSalesId,
								})
								if (resultData) {
									this.$message.success(resultMsg)
									this.getData115(true)
								}
							},
						},
						{
							title: '同意退款',
							auth: 'updateAfterSalesSuppCheck',
							customRender: (action, row) => {
								let tw = this.isTw(row)
								const status =
									((row.prepayment == 1 && !tw) || tw) &&
									row.acceptTheStatus == 4
								action.hide = !status
								return action
							},
							click: async (row) => {
								this.activeRow = row
								this.formData121.rate = 1
								this.formData121.consignee = ''
								this.formData121.phone = ''
								this.formData121.tel = ''
								this.formData121.address = ''
								this.formData121.standard = ''
								this.options = []
								this.formData121.selectAd = ''
								this.formData121.remark = ''
								if (row.afterType == 2) {
									const {
										data: { resultData },
									} = await suppConfirmRefundChecking({
										orderId: row.orderId,
									})
									if (!resultData) {
										this.$confirm(
											'该商品处于拣货中，是否确认同意售后?',
											'提示',
											{
												type: 'success',
												callback: async (action) => {
													if (action === 'confirm') {
														this.$confirm(
															'同意退款受理状态将扭转为受理完成确定商家同意退款？',
															'提示',
															{
																type: 'success',
																callback: async (action1) => {
																	if (action1 === 'confirm') {
																		const {
																			data: {
																				resultMsg: resultMsg1,
																				resultCode: resultCode1,
																			},
																		} = await updateAfterSalesSuppCheck({
																			afterSalesId: row.afterSalesId,
																			updateState: 3,
																		})
																		if (resultCode1 === 0) {
																			this.$message.success(resultMsg1)
																			this.getData115(true)
																		}
																	}
																},
															}
														)
													}
												},
											}
										)
									} else {
										this.$confirm(
											'同意退款受理状态将扭转为受理完成确定商家同意退款？',
											'提示',
											{
												type: 'success',
												callback: async (action1) => {
													if (action1 === 'confirm') {
														const {
															data: {
																resultMsg: resultMsg1,
																resultCode: resultCode1,
															},
														} = await updateAfterSalesSuppCheck({
															afterSalesId: row.afterSalesId,
															updateState: 3,
														})
														if (resultCode1 === 0) {
															this.$message.success(resultMsg1)
															this.getData115(true)
														}
													}
												},
											}
										)
									}
								} else {
									const {
										data: { resultData },
									} = await goodsChecking({
										afterSalesId: row.afterSalesId,
									})
									if (!resultData) {
										this.$confirm('该订单还未发货，是否同意退货退款?', '提示', {
											type: 'success',
											callback: async (action) => {
												if (action === 'confirm') {
													this.afterSalesAddressList(row)
												}
											},
										})
									} else {
										this.afterSalesAddressList(row)
									}
								}
							},
						},
						{
							title: '不同意退款',
							auth: 'updateAfterSalesSuppCheck',
							customRender: (action, row) => {
								let tw = this.isTw(row)
								const status =
									((row.prepayment == 1 && !tw) || tw) &&
									row.acceptTheStatus == 4 &&
									row.supplierArbitrateState == 1
								action.hide = !status
								return action
							},
							click: async (row) => {
								this.arbitramentDialog = true
								this.newAfterSalesNoPass = 'refund'
								this.newAfterSalesId = row.afterSalesId
								this.arbitramentHint =
									'审核结果将直接同步到用户及商家侧，是否确认不同意退款？'
								this.arbitramentData = {
									remark: '',
									activityImage: [],
								}
							},
						},
						{
							title: '验收不通过',
							auth: 'updateAfterSalesWareCheck',
							customRender: (action, row) => {
								let tw = this.isTw(row)
								const status =
									((row.prepayment == 1 && !tw) || tw) &&
									row.supplierAfterSalesStatus == 3 &&
									row.supplierArbitrateState == 1
								action.hide = !status
								return action
							},
							click: async (row) => {
								this.arbitramentDialog = true
								this.newAfterSalesNoPass = 'check'
								this.newAfterSalesId = row.afterSalesId
								this.arbitramentHint =
									'验货结果将直接同步到用户及商家侧，是否确认验货不通过？'
								this.arbitramentData = {
									remark: '',
									activityImage: [],
								}
							},
						},
						{
							title: '不同意退款',
							auth: 'updateAfterSalesSuppCheck',
							popconfirm: true,
							popconfirmTitle:
								'不同意退款,受理状态将扭转为结果确认中,确定商家不同意退款？',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							customRender: (action, row) => {
								let tw = this.isTw(row)
								const status =
									((row.prepayment == 1 && !tw) || tw) &&
									row.acceptTheStatus == 4 &&
									row.supplierArbitrateState != 1
								action.hide = !status
								return action
							},
							confirm: async (row) => {
								const {
									data: { resultMsg, resultData },
								} = await updateAfterSalesSuppCheck({
									afterSalesId: row.afterSalesId,
									updateState: 4,
								})
								if (resultData) {
									this.$message.success(resultMsg)
									this.getData115(true)
								}
							},
						},
						{
							title: '验收通过',
							auth: 'updateAfterSalesWareCheck',
							popconfirm: true,
							popconfirmTitle:
								'验收通过后，商家售后状态将扭转为受理完成，确定商家验收通过？',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							customRender: (action, row) => {
								let tw = this.isTw(row)
								const status =
									((row.prepayment == 1 && !tw) || tw) &&
									row.supplierAfterSalesStatus == 3
								action.hide = !status
								return action
							},
							confirm: async (row) => {
								const {
									data: { resultMsg, resultData },
								} = await updateAfterSalesWareCheck({
									afterSalesId: row.afterSalesId,
									updateState: 8,
								})
								if (resultData) {
									this.$message.success(resultMsg)
									this.getData115(true)
								}
							},
						},
						{
							title: '验收不通过',
							auth: 'updateAfterSalesWareCheck',
							customRender: (action, row) => {
								let tw = this.isTw(row)
								const status =
									((row.prepayment == 1 && !tw) || tw) &&
									row.supplierAfterSalesStatus == 3 &&
									row.supplierArbitrateState != 1
								action.hide = !status
								return action
							},
							click: (row) => {
								this.activeRow = row
								this.dialogVisible124 = true
							},
						},
						{
							title: '优先赔付',
							auth: '',
							popconfirm: true,
							popconfirmTitle:
								'开启优先赔付后，该售后单将不会再执行脚本服务，确定开启?',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							customRender: (action, row) => {
								const status =
									row.prepayment != 1 &&
									((row.afterOrderStatus == 2 &&
										(row.acceptTheStatus == 4 || row.acceptTheStatus == 6)) ||
										(row.afterOrderStatus == 4 &&
											(row.supplierAfterSalesStatus == 3 ||
												row.supplierAfterSalesStatus == 5)))
								action.hide =
									!status || this.notSeIfBrandMap[row.supplierAccountNumberId]
								return action
							},
							confirm: async (row) => {
								const {
									data: { resultMsg, resultData },
								} = await createPrepayment({
									afterSalesId: row.afterSalesId,
								})
								if (resultData) {
									this.$message.success(resultMsg)
									this.getData115(true)
								}
							},
						},
						{
							title: '录入返退金额',
							auth: 'fillReturnAmount',
							customRender: (action, row) => {
								let tw = this.isTw(row)
								const status =
									(row.afterType == 1 && !tw && row.afterOrderStatus == 4) ||
									(row.afterType == 2 && !tw && row.acceptTheStatus == 4)
								action.hide = !status
								return action
							},
							click: (row) => {
								this.activeRow = row
								this.writeRefundPriceDialogVisible = true
							},
						},
						{
							title: '关闭售后单',
							auth: 'closeAfterSales',
							customRender: (action, row) => {
								const status =
									row.supplierAccountNumberId != 4616 &&
									row.supplierAccountNumberId != 12 &&
									((row.afterType == 1 && row.afterOrderStatus == 3) ||
										(row.afterOrderStatus == 2 &&
											(row.afterType == 1 || row.afterType == 2)))
								action.hide = !status
								return action
							},
							click: (row) => {
								this.closeAfterSalesFormData.remark = ''
								this.activeRow = row
								this.closeAfterSalesDialogVisible = true
							},
						},
						{
							title: '更改售后类型',
							auth: 'modifyAfterType', // 权限要更改
							customRender: (action, row) => {
								const status =
									row.afterType == 1 &&
									row.afterOrderStatus == 2 &&
									!this.notSeIfBrandMap[row.supplierAccountNumberId] &&
									row.supplierAccountNumberId != 12 &&
									row.supplierAccountNumberId != 4616 // 非上游售后单
								action.hide = !status
								return action
							},
							click: (row) => {
								this.changeSaleRow = row
								this.changeSaleDialog = true
							},
						},
					],
				},
			],
			page115: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData()
				},
			},
			dialogTitle116: '填写备注',
			dialogWidth116: '30%',
			dialogVisible116: false,
			dialogBottomBtn116: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						if (!this.loading) this.handleSubmitDialog116(117)
					},
				},
			],
			formData117: {
				customerRemark: '',
				warehouseRemark: '',
			},
			formCfg117: [
				{
					type: 'textarea',
					title: '客服备注',
					dataIndex: 'customerRemark',
					placeholder: '请输入客服备注',
				},
				{
					type: 'textarea',
					title: '仓库备注',
					dataIndex: 'warehouseRemark',
					placeholder: '请输入仓库备注',
				},
			],
			formRules117: {
				customerRemark: [
					{ required: true, message: '请输入客服备注', trigger: 'blur' },
				],
				warehouseRemark: [
					{ required: true, message: '请输入仓库备注', trigger: 'blur' },
				],
			},
			formAction117: [],
			dialogTitle118: '确认退款',
			dialogWidth118: '90%',
			dialogVisible118: false,
			dialogBottomBtn118: [
				{
					title: '确 定',
					type: 'primary',
					click: async () => {
						const formData = this.refundConfirmFormData
						let msg = ''
						formData.remark = formData.remark.trim()
						if (!formData.remark) return this.$message.warning('请输入备注')
						const orderGoodsList = this.tableData119.map((item) => {
							let astNumStr = item.astNumStr.split('/')[0]
							if (
								!item.refundNumber ||
								astNumStr < item.refundNumber ||
								item.refundNumber <= 0
							) {
								msg = '退款数量不能大于申请数并且不能小于1'
							}
							return {
								orderGoodsId: item.orderGoodsId,
								quantity: item.refundNumber,
								price: item.price,
								goodsSpecId: item.goodsSpecId,
							}
						})
						if (msg) return this.$message.warning(msg)
						Object.assign(formData, {
							orderId: this.activeRow.orderId,
							afterSalesId: this.activeRow.afterSalesId,
							orderGoodsList,
							isExpressFee: 1,
							isRefund: 1,
							refundType: 2,
						})
						for (let i in formData.orderGoodsList) {
							formData.orderGoodsList[i].refundQuantity =
								formData.orderGoodsList[i].quantity
						}
						formData.refundOrderGoodsList = formData.orderGoodsList
						formData.userId = this.$store.state.user.userInfo.userId
						formData.groupId = this.$store.state.user.userInfo.groupId
						const {
							data: { resultCode, resultMsg },
						} = await addNewOrderRefundByOrderIdNews(formData)
						if (resultCode == 0) {
							this.$message.success(resultMsg)
							this.getData115(true)
						}
						this.dialogVisible118 = false
					},
					dialogType: 'closeDialog',
					formId: '',
					api: '',
				},
			],
			refundConfirmLoading: false,
			tableData119: [],
			tableColumns119: [
				{
					type: 'custom',
					dataIndex: 'goodsId',
					title: '商品',
				},
				{
					type: 'custom',
					dataIndex: 'goodsSpecId',
					title: '规格',
				},
				{
					type: 'string',
					dataIndex: 'astNumStr',
					title: '申请数/待退',
				},
				{
					type: 'custom',
					dataIndex: 'refundNumber',
					title: '退款数量',
				},
				{
					title: '结算价',
					type: 'amount',
					dataIndex: 'costPrice',
				},
				{
					title: '单价(实际支付)',
					type: 'amount',
					dataIndex: 'price',
				},
				{
					title: '小计 (申请退款金额)',
					type: 'amount',
					dataIndex: 'applyPayPrice',
				},
			],
			page119: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData119()
				},
			},
			refundConfirmFormData: {
				remarkType: '1',
				applyPayPrice: '',
				refundWay: '1',
				refundDesc: '1',
				remark: '',
			},
			refundConfirmFormCfg: [
				{
					type: 'select',
					title: '退款原因',
					dataIndex: 'remarkType',
					label: 'value',
					options: [
						{
							remarkType: '1',
							value: '质量问题',
						},
						{
							remarkType: '2',
							value: '缺货退款',
						},
						{
							remarkType: '3',
							value: '特殊处理',
						},
						{
							remarkType: '4',
							value: '拒收退款',
						},
						{
							remarkType: '5',
							value: '取消订单',
						},
						{
							remarkType: '11',
							value: '七天无理由',
						},
						{
							remarkType: '12',
							value: '漏发/少发/未收到货',
						},
						{
							remarkType: '13',
							value: '错发退款',
						},
						{
							remarkType: '14',
							value: '物流停滞/异常/丢件',
						},
						{
							remarkType: '15',
							value: '大小/尺码与描述不符',
						},
						{
							remarkType: '16',
							value: '商家同意退款',
						},
					],
					change: (val) => {
						this.refundConfirmFormData.refundDesc = val === '3' ? '2' : '1'
					},
				},
				{
					type: 'text',
					title: '退款金额',
					dataIndex: 'applyPayPrice',
				},
				{
					type: 'radio',
					title: '退款类型',
					dataIndex: 'refundWay',
					label: 'value',
					options: [
						{
							refundWay: '1',
							value: '普通退款',
						},
						{
							refundWay: '2',
							value: '售后申诉退款',
						},
						{
							refundWay: '3',
							value: '二次申诉退款',
						},
					],
				},
				{
					type: 'radio',
					title: '退款说明',
					dataIndex: 'refundDesc',
					disabled: true,
					label: 'value',
					options: [
						{
							refundDesc: '1',
							value: '商家承担',
						},
						{
							refundDesc: '2',
							value: '平台承担',
						},
					],
				},
				{
					type: 'textarea',
					title: '退款备注',
					dataIndex: 'remark',
				},
			],
			refundConfirmFormRules: {},
			dialogTitle120: '商家同意退款后，售后单将扭转为待寄出',
			dialogWidth120: '30%',
			dialogVisible120: false,
			dialogBottomBtn120: [
				{
					title: '确 定',
					type: 'primary',
					click: async () => {
						// let remark = this.formData121.remark.trim()
						// if (!remark) return this.$message.warning('请输入寄回地址')
						let params = {
							afterSalesId: this.activeRow.afterSalesId,
							updateState: 3,
						}
						if (this.formData121.rate == 2) {
							let remark = this.formData121.remark.trim()
							if (!remark) return this.$message.warning('请输入寄回地址')
							params.remark = remark
						}
						if (this.formData121.rate == 1) {
							if (!this.formData121.selectAd)
								return this.$message.warning('请输入仓库地址')
							let addressSplicing =
								this.formData121.address +
								'|' +
								this.formData121.consignee +
								'|' +
								this.formData121.phone
							if (!addressSplicing)
								return this.$message.warning('请选择寄回地址')
							params.remark = addressSplicing
						}
						const {
							data: { resultMsg, resultData },
						} = await updateAfterSalesSuppCheck(params)
						if (resultData) {
							this.$message.success(resultMsg)
							this.getData115(true)
							this.dialogVisible120 = false
						} else {
							this.$confirm('该订单需要发货后才能处理售后', '提示', {
								type: 'success',
								callback: async (action) => {
									if (action === 'confirm') {
										this.getData115(true)
									}
								},
							})
						}
					},
				},
			],
			options: [],
			selectOp: [],
			formData121: {
				remark: '',
				rate: 1,
				selectAd: '',
				address: '',
				phone: '',
				tel: '',
				standard: '',
			},
			formCfg121: [
				{
					type: 'custom',
					title: '是否使用商家端的仓库地址',
					dataIndex: 'rate',
				},
				{
					type: 'custom',
					title: '选择仓库地址',
					dataIndex: 'selectAd',
				},
				{
					type: 'custom',
					title: '寄回地址',
					dataIndex: 'remark',
					placeholder: '寄回地址（用户可见）',
				},
			],
			formAction121: [],
			dialogTitle124: '验收不通过后，商家售后状态将扭转为异常处理中',
			dialogWidth124: '30%',
			dialogVisible124: false,
			dialogBottomBtn124: [
				{
					title: '确 定',
					type: 'primary',
					click: async () => {
						let remark = this.formData125.remark.trim()
						if (!remark) return this.$message.warning('请输入结果反馈')
						const {
							data: { resultMsg, resultData },
						} = await updateAfterSalesWareCheck({
							afterSalesId: this.activeRow.afterSalesId,
							updateState: 9,
							remark: remark,
						})
						if (resultData) {
							this.$message.success(resultMsg)
							this.getData115(true)
							this.dialogVisible124 = false
						}
					},
				},
			],
			formData125: {
				remark: '',
			},
			formCfg125: [
				{
					type: 'textarea',
					title: '结果反馈',
					dataIndex: 'remark',
					placeholder: '结果反馈：（后台可见）',
				},
			],
			formAction125: [],
			voucherDialogVisible: false,
			voucherDialogBottomBtn: [],
			voucherUrl: '',
			astNumStrDialogVisible: false,
			astNumStrDialogBottomBtn: [],
			astNumStrLoading: false,
			astNumStrTableData115: [],
			astNumStrTableColumns115: [
				{
					type: 'custom',
					dataIndex: 'goodsId',
					title: '商品',
				},
				{
					type: 'custom',
					dataIndex: 'goodsSpecId',
					title: '规格',
				},
				{
					type: 'string',
					dataIndex: 'astNumStr',
					title: '申请数/待退',
				},
				{
					title: '结算价',
					type: 'amount',
					dataIndex: 'costPrice',
				},
				{
					title: '单价(实际支付)',
					type: 'amount',
					dataIndex: 'price',
				},
				{
					title: '小计 (申请退款金额)',
					type: 'amount',
					dataIndex: 'applyPayPrice',
				},
			],
			dialogTitle101: '订单补款',
			dialogWidth101: '50%',
			dialogVisible101: false,
			dialogBottomBtn101: [
				{
					title: '确定',
					type: 'primary',
					click: async () => {
						let msg = ''
						for (const key in this.formData102) {
							if (Object.hasOwnProperty.call(this.formData102, key)) {
								const element = this.formData102[key]
								if (!element) {
									msg = '请选择或填写必要项目'
								}
							}
						}
						if (msg) return this.$message.warning(msg)
						const formData102 = this.formData102
						const params = {
							orderId: this.activeRow.orderId,
							supplementType: formData102.supplementType,
							compensationAmount: formData102.returnMoney,
							remarkType: formData102.returnMoneyReason,
							remark: formData102.remark,
							refundDesc: formData102.supplementRefundDesc,
							refundWay: formData102.supplementRefundWay,
							trackingNum: formData102.trackingNum,
						}
						const {
							data: { resultCode, resultMsg },
						} = await addOrderCompensation(params)
						if (resultCode === 0) {
							this.$message.success(resultMsg)
							this.getData115(true)
							this.dialogVisible101 = false
						}
					},
				},
			],
			formData102: {
				orderSn: '',
				supplementType: '1',
				supplementRefundWay: '1',
				returnMoneyReason: '9',
				returnMoney: '',
				supplementRefundDesc: '',
				remark: '',
			},
			formCfg102: [
				{
					type: 'text',
					title: '订单号',
					dataIndex: 'orderSn',
				},
				{
					type: 'radio',
					title: '补款方式',
					dataIndex: 'supplementType',
					label: 'value',
					options: [
						{
							value: '到消费者微信零钱',
							supplementType: '1',
						},
					],
				},
				{
					title: '补款类型',
					type: 'radio',
					dataIndex: 'supplementRefundWay',
					label: 'value',
					options: [
						{
							value: '普通退款',
							supplementRefundWay: '1',
						},
						{
							value: '售后申诉退款',
							supplementRefundWay: '2',
						},
						{
							value: '二次申诉退款',
							supplementRefundWay: '3',
						},
					],
				},
				{
					title: '补款原因',
					type: 'select',
					dataIndex: 'returnMoneyReason',
					label: 'value',
					options: [
						{
							value: '缺货退款+补偿',
							returnMoneyReason: '6',
						},
						{
							value: '漏发少件补偿+退货/退款',
							returnMoneyReason: '7',
						},
						{
							value: '特殊处理',
							returnMoneyReason: '8',
						},
						{
							value: '退货运费',
							returnMoneyReason: '9',
						},
						{
							value: '质量问题',
							returnMoneyReason: '10',
						},
					],
				},
				{
					title: '用户补款金额',
					type: 'inputNumber',
					dataIndex: 'returnMoney',
				},
				{
					title: '补款说明',
					type: 'radio',
					dataIndex: 'supplementRefundDesc',
					label: 'value',
					options: [
						{
							value: '商家承担',
							supplementRefundDesc: '1',
						},
						{
							value: '平台承担',
							supplementRefundDesc: '2',
						},
					],
				},
				{
					title: '客户退货物流单号',
					type: 'text',
					dataIndex: 'trackingNum',
				},
				{
					title: '备注',
					type: 'textarea',
					dataIndex: 'remark',
				},
			],
			formAction102: [],
			tableData103: [],
			tableData104: [],
			tableColumns103: [
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'amount',
					dataIndex: 'compensationAmount',
					title: '补款金额',
				},
				{
					type: 'string',
					dataIndex: 'trackingNum',
					title: '客户退货物流单号',
				},
				{
					type: 'string',
					dataIndex: 'remarkType',
					title: '补款方式',
					customRender: (row) => {
						const arr = {
							6: '缺货退款+补偿',
							7: '漏发少件补偿+退货/退款',
							8: '特殊处理',
							9: '退货运费',
							10: '质量问题',
							21: '权益保障',
						}
						return arr[row.remarkType] || '-'
					},
				},
				{
					title: '备注',
					type: 'string',
					dataIndex: 'remark',
				},
				{
					title: '派发状态',
					type: 'string',
					dataIndex: 'compensationState',
					customRender: (row) => {
						const arr = ['已派发', '未派发']
						return arr[row.compensationState] || '已派发'
					},
				},
			],
			writeRefundPriceDialogVisible: false,
			writeRefundPriceDialogBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: async () => {
						let writeRefundPrice = this.writeRefundPriceFormData.writeRefundPrice.trim()
						if (!writeRefundPrice)
							return this.$message.warning('请输入第三方返退金额')
						const {
							data: { resultMsg, resultData },
						} = await fillReturnAmount({
							afterSalesId: this.activeRow.afterSalesId,
							returnAmount: writeRefundPrice,
						})
						if (resultData) {
							this.$message.success(resultMsg)
							this.getData115(true)
							this.writeRefundPriceDialogVisible = false
						}
					},
				},
			],
			writeRefundPriceFormData: {
				writeRefundPrice: '',
			},
			writeRefundPriceFormCfg: [
				{
					type: 'inputNumber',
					title: '第三方返退金额',
					dataIndex: 'writeRefundPrice',
				},
			],
			writeRefundPriceFormRules: {
				writeRefundPrice: [
					{
						pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
						message: '返退金额仅支持正数!',
					},
				],
			},
			closeAfterSalesDialogVisible: false,
			closeAfterSalesDialogBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: async () => {
						let remark = this.closeAfterSalesFormData.remark.trim()
						if (!remark) return this.$message.warning('请输入的关闭原因')
						const {
							data: { resultMsg, resultData },
						} = await closeAfterSales({
							afterSalesId: this.activeRow.afterSalesId,
							remark,
						})
						if (resultData) {
							this.$message.success(resultMsg)
							this.getData115(true)
							this.closeAfterSalesDialogVisible = false
						}
					},
				},
			],
			closeAfterSalesFormData: {
				remark: '',
			},
			closeAfterSalesFormCfg: [
				{
					type: 'textarea',
					title: '关闭原因',
					dataIndex: 'remark',
					maxlength: 50,
				},
			],
			closeAfterSalesFormRules: {
				remark: [
					{ required: true, message: '请输入关闭原因', trigger: 'blur' },
				],
			},
			updateAfterSalesExpressVisible: false,
			updateAfterSalesExpressBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: async () => {
						console.log(this.updateAfterSalesExpressData)
						if (!this.updateAfterSalesExpressData.expressName)
							return this.$message.warning('请选择物流公司')
						if (!this.updateAfterSalesExpressData.logisticsNum)
							return this.$message.warning('物流单号不可为空')
						if (this.activeRow.afterReason == '7天无理由退货（运费自理）') {
							this.updateAfterSalesExpressData.logisticsCost = 0
						}
						if (
							this.updateAfterSalesExpressData.logisticsCost == null &&
							this.updateAfterSalesExpressData.logisticsCost == undefined
						)
							return this.$message.warning('运费不可为空')
						this.updateAfterSalesExpressVisible = false
						const {
							data: { resultMsg, resultData },
						} = await updateAfterSalesfillLogistics({
							afterSalesId: this.activeRow.afterSalesId,
							updateState: 5,
							logisticsCompany: this.updateAfterSalesExpressData.expressName,
							expressSn: this.updateAfterSalesExpressData.logisticsNum,
							customerExpressFee: this.updateAfterSalesExpressData
								.logisticsCost,
						})
						if (resultData) {
							this.$message.success(resultMsg)
							this.getData115(true)
						}
					},
				},
			],
			updateAfterSalesExpressData: {
				expressName: '',
				logisticsNum: '',
				logisticsCost: '',
			},
			updateAfterSalesExpressCfg: [
				{
					type: 'select',
					title: '物流公司',
					dataIndex: 'expressName',
					label: 'expressName',
					options: [],
				},
				{
					type: 'input',
					title: '物流单号',
					dataIndex: 'logisticsNum',
				},
				{
					type: 'inputNumber',
					title: '运费',
					dataIndex: 'logisticsCost',
				},
			],
			updateAfterSalesExpressRules: {
				logisticsNum: [
					{ required: true, message: '物流单号不可为空', trigger: 'blur' },
				],
				logisticsCost: [
					{ required: true, message: '运费不可为空', trigger: 'blur' },
				],
			},
		}
	},

	created() {
		this.queryNotSelfBrandSupplierAccountIds()
		this.authList = {
			addOrderCompensation: checkFunctionCode('addOrderCompensation'),
		}
		this.getUserInfo()
	},

	methods: {
		// 获取商家列表
		async _findSupplierAccountNumberForList(query) {
			if (query !== '') {
				const paramJson = {
					startIndex: 0,
					length: 20,
					keyword: query,
				}
				const {
					data: { resultCode, resultData },
				} = await findSupplierAccountNumberForList(paramJson)

				if (resultCode == 0) {
					this.formDataSupplierAccountNumberList = resultData.list || []
					return
				}
			}
			this.formDataSupplierAccountNumberList = []
		},

		returnablePeriod: async function (row) {
			let paramJson = {
				afterSalesId: row.afterSalesId,
				clerkId: this.$store.state.user.userInfo.clerkId,
				clerkName: this.$store.state.user.userInfo.clerkName,
			}
			this.$alert(
				'确认后，可回寄期将延长七天，是否确认延长？',
				'延长可回寄期？',
				{
					confirmButtonText: '确定',
					callback: async (action) => {
						if (action == 'confirm') {
							const {
								data: { resultCode, resultMsg },
							} = await extendMailTime(paramJson)
							if (resultCode == 0) {
								this.getData115(true)
								this.$message.success(resultMsg)
							}
						}
					},
				}
			)
		},

		newAfterSales: async function () {
			let paramJson = {
				imageUrlList: [],
				remark: this.arbitramentData.remark,
				afterSalesId: this.newAfterSalesId,
			}
			if (!paramJson.remark) {
				return this.$message.error('请填写备注!')
			}
			this.arbitramentData.activityImage.map((item) => {
				paramJson.imageUrlList.push({ imageUrl: item.imageUrlTemp })
			})
			let Url = null
			if (this.newAfterSalesNoPass == 'refund') {
				paramJson.updateState = 4
				Url = updateAfterSalesSuppCheck
			} else {
				paramJson.updateState = 9
				Url = updateAfterSalesWareCheck
			}
			console.log('paramJson', paramJson)

			const {
				data: { resultCode, resultMsg },
			} = await Url(paramJson)
			if (resultCode == 0) {
				this.arbitramentDialog = false
				this.getData115(true)
				this.$message.success(resultMsg)
			}
		},
		beforeAvatarUpload(params) {
			const isLt2M = params.size / 1024 / 1024 < 5
			if (!isLt2M) {
				this.$message.error('上传文件大于5M,请重新选择!')
				return false
			} else {
				return params
			}
		},
		// 上传图标图片
		_uploadImageHttpRequest: async function (params, way) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#addMaterial', imageType: 80 })
			)
			if (!params.file && !params.clipboardData.files[0]) {
				this.$message.error('粘贴板无图片内容，请复制需上传的图片!')
				return
			}
			const isLt2M = params.file
				? params.file.size / 1024 / 1024 < 5
				: params.clipboardData.files[0].size / 1024 / 1024 < 5 //限制上传
			if (!isLt2M) {
				this.$message.error('上传文件大于5M,请重新选择!')
				return
			}
			if (this.arbitramentData.activityImage.length >= 4) {
				this.$message.error('图片不能超过四张')
				return
			}
			// 粘贴时进行处理
			let uploa
			if (params.clipboardData && params.clipboardData.files[0]) {
				uploa = params.clipboardData.files[0]
			} else {
				uploa = params.file
			}
			formData.append('file', uploa)
			if (this.imageDialog && way != 'clickUploading') {
				return
			}
			this.imageDialog = true
			const res = await uploadImageList(formData)
			this.imageDialog = false
			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				this.arbitramentData.activityImage.push({
					imageUrl: getBigImg(res.data.resultData.imageList[0].imageUrl),
					imageUrlTemp: res.data.resultData.imageList[0].imageUrl,
				})
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
		// 获取用户数据
		getUserInfo() {
			this.user = JSON.parse(localStorage.getItem('yhtplus/_user') || '{}')
		},
		getData(flag) {
			if (this.notApproved) {
				this._queryUnAuditAfterSales(flag)
			} else if (this.notInspected) {
				this._queryUnCheckingAfterSales(flag)
			} else {
				this.getData115(flag)
			}
		},
		handleApproved() {
			this.$confirm(
				'选择此筛选条件后，其他筛选条件均不生效',
				'是否进行快捷筛选',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			)
				.then(() => {
					this.notApproved = true
					this.notInspected = false
					this._queryUnAuditAfterSales()
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消选择此条件',
					})
				})
		},
		handleNotApproved() {
			this.notApproved = false
		},
		handleInspected() {
			this.$confirm(
				'选择此筛选条件后，其他筛选条件均不生效',
				'是否进行快捷筛选',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			)
				.then(() => {
					this.notInspected = true
					this.notApproved = false
					this._queryUnCheckingAfterSales()
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消选择此条件',
					})
				})
		},
		handleNotInspected() {
			this.notInspected = false
		},
		exportOverTimeAfterSales: async function () {
			let paramJson = {}
			if (this.notApproved) {
				paramJson.overTimeType = 1
			} else if (this.notInspected) {
				paramJson.overTimeType = 2
			}
			let { data } = await exportOverTimeAfterSales(paramJson)
			downloadFile(data, "导出超时数据'.xlsx")
		},
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page115.currentPage = 1
			}
			const paramJson = {
				length: this.page115.length,
				currentPage: (this.page115.currentPage - 1) * this.page115.length,
			}
			return paramJson
		},
		async _queryUnAuditAfterSales(flag) {
			this.loading = true
			let paramJson = this.findSearchParams(flag)
			const {
				data: { resultCode, resultData },
			} = await queryUnAuditAfterSales(paramJson)
			if (resultCode === 0) {
				this.tableData115 = resultData.afterSalesList.map((row) => {
					if (row.compensationAmount || row.equityCompensation) {
						return this.dealPrice(row)
					} else {
						return row
					}
				})
				console.log(this.tableData115)
				this.page115.count = resultData.count
			}
			this.loading = false
		},
		async _queryUnCheckingAfterSales(flag) {
			this.loading = true
			let paramJson = this.findSearchParams(flag)
			const {
				data: { resultCode, resultData },
			} = await queryUnCheckingAfterSales(paramJson)
			if (resultCode === 0) {
				this.tableData115 = resultData.afterSalesList.map((row) => {
					if (row.compensationAmount || row.equityCompensation) {
						return this.dealPrice(row)
					} else {
						return row
					}
				})
				console.log(this.tableData115)
				this.page115.count = resultData.count
			}
			this.loading = false
		},
		Refresh() {
			this.getData115(true)
		},
		selectChange(val) {
			if (val) {
				let obj = this.options.find((item) => {
					return item.afterSalesAddressId == val
				})
				this.filterFormData(obj)
			}
		},
		filterFormData(obj) {
			this.formData121.consignee = obj.consignee
			this.formData121.phone = obj.phone
			this.formData121.tel = obj.tel
			this.formData121.address =
				obj.province + obj.city + obj.district + obj.detail
			this.formData121.standard = obj.standard
		},
		afterSalesAddressList: async function (row) {
			let {
				data: { resultCode = 0, resultData = [] },
			} = await afterSalesAddressList({ supplierId: row.supplierId })
			if (resultCode == 0) {
				this.options = resultData
				this.selectOp = resultData
				if (resultData.length == 1) {
					this.formData121.selectAd = resultData[0].afterSalesAddressId
					this.filterFormData(resultData[0])
				}
				this.dialogVisible120 = true
			}
		},
		queryNotSelfBrandSupplierAccountIds: async function () {
			let {
				data: { resultCode = 0, resultData = [] },
			} = await queryNotSelfBrandSupplierAccountIds({})
			if (resultCode == 0) {
				//供应商账号id,只要判断有包含的，就是非自有品牌
				if (resultData.length > 0) {
					resultData.map((item) => {
						this.notSeIfBrandMap[item] = item
					})
				}
				console.log('是否匹配到非自有品牌:', this.notSeIfBrandMap)
			}
		},
		// 跳转商品详情
		skipGoodsDetails(row) {
			this.dialogVisible118 = false
			this.astNumStrDialogVisible = false
			this.$router.push({
				path: `/goods/GoodsDetail/${row.goodsId}/${row.goodsSpecId}/${1}/${
					row.goodsSnapshotId
				}/${row.goodsSpecSnapshotId}`,
			})
		},
		async getData115(flag) {
			this.loading = true
			let paramJson = this.findSearchParams115(flag)
			let paramJson_ = { ...paramJson }
			delete paramJson_['addTimeList']
			if (!paramJson_.supplierNumberIds.length) {
				delete paramJson_['supplierNumberIds']
			}
			if (isNull(paramJson.customerRemark)) {
				delete paramJson_['customerRemark']
			}
			if (isNull(paramJson.warehouseRemark)) {
				delete paramJson_['warehouseRemark']
			}
			const {
				data: { resultCode, resultData },
			} = await listAfterSales(paramJson_)
			if (resultCode === 0) {
				console.log(resultData)
				this.tableData115 = resultData.afterSalesList.map((row) => {
					if (row.compensationAmount || row.equityCompensation) {
						return this.dealPrice(row)
					} else {
						return row
					}
				})
				console.log(this.tableData115)
				this.page115.count = resultData.count
			}
			this.loading = false
		},
		dealPrice(row) {
			let str = row.compensationAmount || ''
			let equityCompensationStr = row.equityCompensation || ''
			let priceList = []
			if (str.length > 0) {
				let arr = str.split(';')
				arr.map(function (item) {
					let cut = item.split('||')
					let price = cut[1]
					let status = cut[0]
					let show_func = {
						0: '未发起',
						1: '未派发',
						2: '已派发',
					}
					// 1:未派发 2:已派发
					let status_val = show_func[status]
					priceList.push({
						price,
						status_val,
					})
				})
			}
			if (equityCompensationStr.length > 0) {
				let arr = equityCompensationStr.split(';')
				arr.map(function (item) {
					let cut = item.split('||')
					let price = cut[1]
					let status = cut[0]
					let show_func = {
						0: '未发起',
						1: '未派发',
						2: '已派发',
					}
					// 1:未派发 2:已派发
					let status_val = show_func[status]
					priceList.push({
						price,
						status_val,
					})
				})
			}
			row.priceList = priceList
			return row
		},
		findSearchParams115(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page115.currentPage = 1
			}
			const paramJson = Object.assign(
				{
					length: this.page115.length,
					startIndex: (this.page115.currentPage - 1) * this.page115.length,
				},
				this.formData115
			)
			return paramJson
		},
		async handleSubmitDialog116(formId) {
			const formData = this['formData' + formId]
			formData.afterSalesId = this.activeRow.afterSalesId
			console.log(formData)
			const {
				data: { resultCode, resultData },
			} = await updateCustomerWarehouseRemark(formData)
			if (resultCode === 0) {
				this.$message.success(resultData)
			}
			this.dialogVisible116 = false
		},
		async handleAfterSaleGoods(row) {
			this.astNumStrTableData115 = []
			this.astNumStrDialogVisible = true
			this.astNumStrLoading = true
			const {
				data: { resultCode, resultData },
			} = await findAsProduct({
				afterSalesId: row.afterSalesId,
			})
			if (resultCode === 0) {
				this.astNumStrTableData115 = [resultData.afterSalesProductVo]
				this.astNumStrLoading = false
			}
		},
		isTw(row) {
			let tw = true
			if (
				row.supplierName == 'AKC' ||
				row.supplierName == 'BBC' ||
				row.supplierName == 'HYK' ||
				row.supplierName == 'WPC'
			) {
				tw = false
			}
			return tw
		},
		handleVoucher(row) {
			this.voucherDialogVisible = true
			this.voucherUrl = getBigImg(row.shippingDocuments)
		},
	},
}
</script>
<style>
.writeRefundPriceContent {
	margin-bottom: 20px;
}
.voucher-btn {
	padding: 5px;
}
.stateBgColor {
	border-radius: 4px;
	color: #fff;
	padding: 2px 3px;
	font-size: 12px;
	font-weight: bold;
}
.stateBgColor-red {
	background-color: rgba(255, 0, 0, 1);
}
.stateBgColor-yellow {
	background-color: #ff8e02;
}
.stateBgColor-gray {
	background-color: #b0b0b0;
}
.stateBgColor-green {
	background-color: #2ea522;
}
.goods_name {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-box-orient: vertical;
}
.active {
	color: #4498e0;
	cursor: pointer;
	line-height: 15px;
}
</style>

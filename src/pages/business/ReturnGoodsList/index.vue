<template>
	<div class="goodsStockList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="shopData"
				:items="shopCfg"
				:formAction="shopAction"
			>
			</yx-form>
			<yx-table
				v-if="showTable"
				v-loading="shoploading"
				:columns="shopTableColumns"
				:data="shopTableData"
				style="margin-bottom: 20px"
			>
				<template slot="organizationName" slot-scope="scope">
					<router-link
						style="color: #0096fb"
						:to="`/shop/shop/shopDetail/${scope.row.organizationId}`"
						>{{ scope.row.organizationName }}</router-link
					>
					<div>
						<el-tag
							v-for="item in scope.row.tagList"
							:key="item.label"
							:type="item.type"
							effect="dark"
							style="margin: 0 6px"
						>
							{{ item.label }}
						</el-tag>
					</div>
				</template>
			</yx-table>

			<!-- //查退货列表 -->
			<yx-form
				:inline="true"
				:data="formData105"
				:items="formCfg105"
				:formAction="formAction105"
			>
				<template #supplierName>
					<el-input
						v-model="formData105.supplierName"
						placeholder="请选择商家"
						value-key="supplierName"
						label="supplierName"
						@focus="selectSupplier"
						clearable
						@clear="
							() => {
								formData105.supplierName = ''
								formData105.supplierAccountNumberId = ''
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
				<template #returnUserId>
					<el-input
						v-model="formData105.clerkName"
						placeholder="请选择收货员工"
						value-key="clerkName"
						label="clerkName"
						@focus="selectClerkList"
						clearable
						@clear="
							() => {
								formData105.clerkName = ''
								formData105.userId = ''
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="clerkDialog = true"
						></el-button>
					</el-input>
				</template>
				<template #platformUserId>
					<el-input
						v-model="formData105.clerkNameOne"
						placeholder="请选择录入员工"
						value-key="clerkNameOne"
						label="clerkNameOne"
						@focus="selectClerkEntering"
						clearable
						@clear="
							() => {
								formData105.clerkNameOne = ''
								formData105.userIdOne = ''
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="enteringDialog = true"
						></el-button>
					</el-input>
				</template>
				<template #tagIdList>
					<el-checkbox-group
						v-model="formData105.tagIdList"
						@change="_getRetrunOrderListByParam(true)"
					>
						<el-checkbox
							v-for="(item, index) in markingData.groupTagList"
							:key="index"
							:label="item.groupTagList"
							>{{ item.tagName }}</el-checkbox
						>
					</el-checkbox-group>
				</template>
			</yx-form>
			<yx-table
				v-loading="loading"
				:columns="tableColumns106"
				:pagination="page106"
				:data="tableData106"
			>
				<template slot="returnSn" slot-scope="scope">
					<el-link
						type="primary"
						v-if="getRetrunOrderDetailByParam"
						:href="`/yhtplus/web/returnGoodsDetails.html?refundId=${scope.row.refundId}&orderId=${scope.row.orderId}&sourceType=${scope.row.sourceType}`"
						target="_blank"
						:underline="false"
						>{{ scope.row.returnSn }}</el-link
					>
					<p v-else>{{ scope.row.returnSn }}</p>
					<div>
						{{ moment(scope.row.addTime).format('YYYY-MM-DD HH:mm:ss') }}
					</div>

					<div>
						<el-tag
							v-for="item in scope.row.tagList"
							:key="item.tagName"
							type="warning"
							effect="dark"
							style="margin: 2px"
						>
							{{ item.tagName }}
						</el-tag>
						<span
							v-if="scope.row.prepayment == 1"
							style="
								border: 1px solid #000;
								border-radius: 4px;
								color: #000;
								padding: 0 5px;
							"
							>优先赔付</span
						>
					</div>
				</template>

				<template slot="orderSn" slot-scope="scope">
					<router-link
						v-if="getOrderDetailByOrderId"
						:to="`/business/orderDetails/${scope.row.orderId}?sourceType=${scope.row.sourceType}`"
						><el-button type="text">{{
							scope.row.orderSn
						}}</el-button></router-link
					>
					<p v-else>{{ scope.row.orderSn }}</p>
					<div>
						{{ moment(scope.row.orderAddTime).format('YYYY-MM-DD HH:mm:ss') }}
					</div>
				</template>
				<template slot="organizationName" slot-scope="scope">
					<router-link
						style="color: #0096fb"
						:to="`/shop/shop/shopDetail/${scope.row.childOrganizationId}`"
						>{{ scope.row.organizationName }}</router-link
					>
				</template>
				<template slot="expressSn" slot-scope="scope">
					<el-link
						type="primary"
						:href="`https://www.kuaidi100.com?nu=${scope.row.expressSn}`"
						target="_blank"
						:underline="false"
						>{{ scope.row.expressSn }}</el-link
					>
				</template>
			</yx-table>
			<!-- //补款 -->
			<Dialog
				title="补款"
				:visible="fillingMoneyLoding"
				width="50%"
				:bottomBtn="fillingMoneyBottomBtn"
				@before-close="fillingMoneyLoding = false"
			>
				<yx-form
					ref="form"
					:inline="false"
					:items="fillingItem"
					:data="fillingData"
					labelWidth="120px"
				>
					<template #order-sn>
						<span>{{ fillingData.orderSn }}</span>
					</template>
					<template #shipmentNumber>
						<el-radio-group
							v-model="fillingData.shipmentNumber"
							@change="trackingNumChange"
						>
							<el-radio
								v-for="(item, index) in addTrackingNumList"
								:key="index"
								:label="item"
								>{{ item }}</el-radio
							>
						</el-radio-group>
					</template>
				</yx-form>
				<span style="color: #f16b6b" v-if="trackingNumCompensation.length > 0">
					该物流单号已经发起补款，详情信息如下，请确认是否还要再次发起
				</span>
				<yx-table
					v-if="trackingNumCompensation.length > 0"
					:columns="trackingNumTableColumns"
					:data="trackingNumCompensation"
				>
				</yx-table>
			</Dialog>
			<!-- 商家承担/商家列表 -->
			<supplier-account-dialog
				:itemInfo="supplyRow"
				:visible.sync="formsDialog"
				@fatherMethodInit="
					(row) => {
						formData105.supplierName = row.supplierName
						formData105.supplierAccountNumberId = row.supplierAccountNumberId
					}
				"
			/>
			<!-- 收货员工列表 -->
			<employee-dialog
				:itemInfo="clerkRow"
				:visible.sync="clerkDialog"
				@fatherMethodInit="
					(row) => {
						formData105.clerkName = row.clerkName
						formData105.userId = row.userId
					}
				"
			/>
			<!-- 录入员工列表 -->
			<entering-dialog
				:itemInfo="enteringRow"
				:visible.sync="enteringDialog"
				@fatherMethodInit="
					(row) => {
						formData105.clerkNameOne = row.clerkName
						formData105.userIdOne = row.userId
					}
				"
			/>
			<!-- //导出 -->
			<export-mailing-dialog
				:dialogVisible.sync="dialogVisible"
				:exportData="formData105"
			></export-mailing-dialog>

			<!-- 退款弹窗 S -->
			<Dialog
				title="请再次确认退款信息"
				v-loading="refundDialogLoading"
				:visible="refundDialogVisible"
				width="800px"
				:bottomBtn="refundDialogBottomBtn"
				@before-close="
					() => {
						refundDialogVisible = false
						refundDialogData = {
							organizationName: '',
							orderSn: '',
							addTime: '',
							weixinUserName: '',
						}
						refundReasonDialogData = {
							refundReason: 1,
							refundType: 1,
							refundDesc: 1,
							remark: '',
							tagIdList: [],
						}
					}
				"
			>
				<yx-form
					:inline="true"
					:data="refundDialogData"
					:items="refundDialogCfg"
				>
				</yx-form>
				<yx-table :columns="refundtableColumns" :data="orderGoodsTableData">
					<template slot="goodsName" slot-scope="scope">
						<div style="display: flex; align-items: center">
							<img
								class="goods_img"
								:src="getSmallImg(scope.row.goodsDefaultImage)"
								alt=""
							/>
							<div>
								<div>货号：{{ scope.row.goodsNumber }}</div>
								<div>{{ scope.row.goodsName }}</div>
							</div>
						</div>
					</template>
					<template slot="specOne" slot-scope="scope">
						<div v-if="goodsType.specOne && scope.row.specOne">
							{{ goodsType.specOne }}：{{ scope.row.specOne }}
						</div>
						<div v-if="goodsType.specTwo && scope.row.specTwo">
							{{ goodsType.specTwo }}：{{ scope.row.specTwo }}
						</div>
						<div v-if="goodsType.specThree && scope.row.specThree">
							{{ goodsType.specThree }}：{{ scope.row.specThree }}
						</div>
					</template>
				</yx-table>
				<div style="float: right">
					<p v-if="expressFee > 0">
						<el-checkbox v-model="isExpressFee">邮费退款</el-checkbox>¥{{
							expressFee
						}}
					</p>
					<span> 总计:{{ aggregate }}件</span>
					<span style="margin-left: 20px"
						>退款金额：￥{{ totalRefundAmount }}</span
					>
				</div>
				<div class="refundReason">
					<yx-form
						label-width="80px"
						:data="refundReasonDialogData"
						:items="refundReasonDialogCfg"
					>
						<template #tagIdList>
							<el-checkbox-group
								v-model="refundReasonDialogData.tagIdList"
								@change="1"
							>
								<el-checkbox
									v-for="(item, index) in markingData.groupTagList"
									:key="index"
									:label="item.groupTagList"
									>{{ item.tagName }}</el-checkbox
								>
							</el-checkbox-group>
						</template>
					</yx-form>
				</div>
			</Dialog>
			<!-- 退款弹窗 E -->
			<!-- //打标 -->
			<Dialog
				title="退货单打标签(使用退款单标签)"
				:visible="markingLogding"
				width="50%"
				:bottomBtn="markingBottomBtn"
				@before-close="markingLogding = false"
			>
				<yx-form
					label-width="80px"
					:data="markingDialogData"
					:items="markingDialogCfg"
				>
					<template #tagIdList>
						<div>设置退款单标签内容步骤：设置—>系统设置—>退款单</div>
						<el-checkbox-group
							v-model="markingDialogData.tagIdList"
							@change="1"
						>
							<el-checkbox
								v-for="(item, index) in markingData.groupTagList"
								:key="index"
								:label="item.groupTagList"
								>{{ item.tagName }}</el-checkbox
							>
						</el-checkbox-group>
					</template>
				</yx-form>
			</Dialog>
			<!-- //填写记录 -->
			<Dialog
				title="返退记录"
				:visible="fillRecordLogding"
				width="50%"
				:bottomBtn="fillRecordBottomBtn"
				@before-close="fillRecordLogding = false"
			>
				<yx-form
					labelWidth="200px"
					:data="fillRecordDialogData"
					:items="fillRecordDialogCfg"
				>
					<template #checkTrue>
						<el-checkbox
							:disabled="disabledCheck"
							@change="checkChangeTrue"
							v-model="fillRecordDialogData.checkTrue"
							>客户退货是否收回</el-checkbox
						>
					</template>
					<template #sendTrue>
						<el-checkbox
							:disabled="disabledSend"
							@change="sendChangeTrue"
							v-model="fillRecordDialogData.sendTrue"
							>第三方退货是否已寄出</el-checkbox
						>
					</template>
				</yx-form>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import SupplierAccountDialog from '@/components/SupplierAccountDialog'
import EmployeeDialog from './EmployeeDialog'
import EnteringDialog from './EnteringDialog'
import moment from 'moment'
import { isNull } from '@/utils/helper/common'
import exportMailingDialog from './exportMailingDialog'
import { getOrganizationListByCondition } from '@/api/yhtPlusCmsOrganization'
import {
	getRefundTag,
	addRefundTagToRefund,
	getGoodsConfiguration,
} from '@/api/systemConfiguration'
import { getSmallImg } from '@/utils/imageTool'
import {
	getRetrunOrderListByParam,
	getRetrunOrderDetailByParam,
	cancelRetrunOrderByRefundId,
	updateRetrunOrderByRefundId,
	getRetrunExpressSnByParam,
	addNewOrderRefundByOrderIdNews,
} from '@/api/yhtPlusCmsOrder'
import { getCompensationInfo } from '@/api/afterSales'
import { checkFunctionCode } from '@/utils/auth'
import { addOrderCompensation } from '@/api/yhtplusCmsOrderCompensation'

export default {
	name: 'ReturnGoodsList',
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
		SupplierAccountDialog,
		EmployeeDialog,
		EnteringDialog,
		exportMailingDialog,
	},
	props: [],
	data() {
		return {
			getSmallImg: getSmallImg,
			moment: moment,
			dialogVisible: false, // 批量导出开关
			getRetrunOrderDetailByParam: checkFunctionCode(
				'getRetrunOrderDetailByParam'
			), // 退货单详情权限
			getOrderDetailByOrderId: checkFunctionCode('getOrderDetailByOrderId'), // 订单详情权限
			operateGoodsRecovery: checkFunctionCode('operateGoodsRecovery'), // 订单详情权限
			//--------S-----查询店主table-----S-------------//
			expressSn: '',
			showTable: false,
			shopData: {
				phone: '',
			},
			shopCfg: [
				{
					type: 'input',
					title: '店主手机号',
					dataIndex: 'phone',
					placeholder: '请输入店主手机号',
				},
			],
			shopAction: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: (e) => {
						this._getOrganizationListByCondition(true, e)
					},
				},
				{
					title: '导出',
					type: 'primary',
					auth: '',
					click: () => {
						this.dialogVisible = true
					},
				},
			],

			shoploading: false,
			shopTableColumns: [
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: '店主ID',
				},
				{
					type: 'custom',
					dataIndex: 'organizationName',
					title: '店主名称',
				},
				{
					type: 'string',
					dataIndex: 'phone',
					title: '手机号',
				},
				{
					type: 'string',
					dataIndex: 'departmentName',
					title: '店主维护部门',
				},
			],
			//--------E-----查询店主table-----E-------------//
			//--------S-----退货单列表table-----S-------------//
			clerkDialog: false,
			enteringDialog: false,
			formsDialog: false,
			formData105: {
				likeConsignee: '', //收货人
				likeTelNumber: '', //收货号码
				likeOrderSn: '', //订单号
				likeExpressSn: '', //物流单号
				likeOrganizationName: '', //店主名称
				likeBrandName: '', //会场名称
				likeWeixinUserName: '', //下单人
				likeBarCode: '', //条形码
				likeReturnRemark: '', //退货备注
				supplierName: '',
				supplierAccountNumberId: '0',
				sourceName: '', //下单号
				addTimeStart: '', //发起时间 开始
				addTimeEnd: '', //发起时间 结束
				returnTimeStart: '', //收货时间 开始
				returnTimeEnd: '', //收货时间 结束
				platformTimeStart: '', // 第三方物流录入时间 开始
				platformTimeEnd: '', // 第三方物流录入时间 开始
				returnUserId: '0', //收货员工
				platformUserId: '0', //录入员工
				userId: '', //收货员工id
				userIdOne: '', //录入员工id
				clerkName: '', //录入员工名称
				clerkNameOne: '', //录入员工名称
				tagIdList: [], //退款单标签
				goodsRecovery: '0', // 客户是否已退回
				platformSend: '0', // 是否已寄回至第三方
				returnStatus: '0', // 退货单状态
				remarkType: 0, // 退款原因
				orderParam: '', //退货时间
			},
			markingData: {
				groupTagList: [],
			},
			formCfg105: [
				{
					type: 'input',
					title: '收货人',
					dataIndex: 'likeConsignee',
					placeholder: '请输入收货人',
					enter: () => {
						this._getRetrunOrderListByParam(true)
					},
				},
				{
					type: 'input',
					title: '收货号码',
					dataIndex: 'likeTelNumber',
					placeholder: '请输入收货号码',
					enter: () => {
						this._getRetrunOrderListByParam(true)
					},
				},
				{
					type: 'input',
					title: '订单号',
					dataIndex: 'likeOrderSn',
					placeholder: '请输入订单号',
					enter: () => {
						this._getRetrunOrderListByParam(true)
					},
				},
				{
					type: 'input',
					title: '物流单号',
					dataIndex: 'likeExpressSn',
					placeholder: '请输入物流单号',
					enter: () => {
						this._getRetrunOrderListByParam(true)
					},
				},
				{
					type: 'input',
					title: '店主名称',
					dataIndex: 'likeOrganizationName',
					placeholder: '请输入店主名称',
					enter: () => {
						this._getRetrunOrderListByParam(true)
					},
				},

				{
					type: 'input',
					title: '会场名称',
					dataIndex: 'likeBrandName',
					placeholder: '请输入会场名称',
					enter: () => {
						this._getRetrunOrderListByParam(true)
					},
				},

				{
					type: 'input',
					title: '下单人',
					dataIndex: 'likeWeixinUserName',
					placeholder: '请输入下单人',
					enter: () => {
						this._getRetrunOrderListByParam(true)
					},
				},
				{
					type: 'input',
					title: '条形码',
					dataIndex: 'likeBarCode',
					placeholder: '请输入条形码',
					enter: () => {
						this._getRetrunOrderListByParam(true)
					},
				},
				{
					type: 'input',
					title: '退货备注',
					dataIndex: 'likeReturnRemark',
					placeholder: '请输入退货备注',
					enter: () => {
						this._getRetrunOrderListByParam(true)
					},
				},
				{
					title: '商家名称',
					type: 'custom',
					dataIndex: 'supplierName',
				},
				{
					title: '收货员工',
					type: 'custom',
					dataIndex: 'returnUserId',
				},
				{
					title: '录入员工',
					type: 'custom',
					dataIndex: 'platformUserId',
				},
				{
					type: 'select',
					title: '下单号',
					dataIndex: 'sourceName',
					placeholder: '请选择下单号',
					label: 'value',
					change: () => {
						this._getRetrunOrderListByParam(true)
					},
					options: [
						{
							sourceName: '',
							value: '全部',
						},
						{
							sourceName: 'mi-01',
							value: 'mi-01',
						},
						{
							sourceName: 'mi-02',
							value: 'mi-02',
						},
						{
							sourceName: 'mi-03',
							value: 'mi-03',
						},
						{
							sourceName: 'mi-04',
							value: 'mi-04',
						},
					],
				},
				{
					type: 'select',
					title: '客户是否已退回',
					dataIndex: 'goodsRecovery',
					placeholder: '请选择退回状态',
					label: 'value',
					change: () => {
						this._getRetrunOrderListByParam(true)
					},
					options: [
						{
							goodsRecovery: '0',
							value: '全部',
						},
						{
							goodsRecovery: '1',
							value: '否',
						},
						{
							goodsRecovery: '2',
							value: '是',
						},
					],
				},
				{
					type: 'select',
					title: ' 是否已寄回至第三方',
					dataIndex: 'platformSend',
					placeholder: '请选择寄回状态',
					label: 'value',
					change: () => {
						this._getRetrunOrderListByParam(true)
					},
					options: [
						{
							platformSend: '0',
							value: '全部',
						},
						{
							platformSend: '1',
							value: '否',
						},
						{
							platformSend: '2',
							value: '是',
						},
					],
				},
				{
					type: 'select',
					title: ' 退货单状态',
					dataIndex: 'returnStatus',
					placeholder: '请选择退货单状态',
					label: 'value',
					change: () => {
						this._getRetrunOrderListByParam(true)
					},
					options: [
						{
							returnStatus: '0',
							value: '全部(非取消)',
						},
						{
							returnStatus: '1',
							value: '待退款',
						},
						{
							returnStatus: '2',
							value: ' 待返退',
						},
						{
							returnStatus: '3',
							value: '已完成',
						},
						{
							returnStatus: '4',
							value: '已取消',
						},
					],
				},
				{
					type: 'select',
					dataIndex: 'remarkType',
					title: '退款原因',
					label: 'value',
					change: () => {
						this._getRetrunOrderListByParam(true)
					},
					options: this.$store.state.app.constant.REFUND_REASON,
				},
				{
					title: '发起时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					title: '收货时间',
					type: 'datetimerange',
					dataIndex: ['returnTimeStart', 'returnTimeEnd'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					title: '第三方物流录入时间',
					type: 'datetimerange',
					dataIndex: ['platformTimeStart', 'platformTimeEnd'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					type: 'select',
					title: '退货时间',
					dataIndex: 'orderParam',
					placeholder: '请选择退货时间',
					label: 'value',
					change: () => {
						this._getRetrunOrderListByParam(true)
					},
					options: [
						{
							orderParam: '',
							value: '默认',
						},
						{
							orderParam: 'ASC',
							value: '升序',
						},
						{
							orderParam: 'DESC',
							value: '降序',
						},
					],
				},
				{
					title: '退款单标签',
					type: 'custom',
					dataIndex: 'tagIdList',
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
						this._getRetrunOrderListByParam(true, e)
					},
				},
			],
			tableData106: [],
			tableColumns106: [
				{
					type: 'custom',
					dataIndex: 'returnSn',
					title: '退货单号',
					width: '180',
				},
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '关联订单号',
					width: '180',
				},
				{
					type: 'custom',
					dataIndex: 'organizationName',
					title: '店主名称',
				},

				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
					customRender: (row) => {
						if (row.supplierName) {
							return row.supplierName
						} else {
							if (row.sourceType) {
								return this.$store.state.app.constant.SOURCE_TYPE[
									row.sourceType
								]
							} else {
								return '-'
							}
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'sourceName',
					title: '下单号',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场',
				},
				{
					type: 'amount',
					dataIndex: 'customerExpressFee',
					title: '客户退货运费',
				},
				{
					type: 'string',
					dataIndex: 'goodsRecovery',
					title: '货物是否收回',
					customRender: (row) => {
						return row.goodsRecovery == 1
							? '否'
							: row.goodsRecovery == 2
							? '是'
							: '-'
					},
				},
				{
					type: 'custom',
					dataIndex: 'expressSn',
					title: '客户退货物流单号',
				},
				{
					type: 'string',
					dataIndex: 'returnRemark',
					title: '退货备注',
				},
				{
					type: 'string',
					dataIndex: 'platformSend',
					title: '返还第三方是否寄出',
					customRender: (row) => {
						return row.platformSend == 1
							? '否'
							: row.platformSend == 2
							? '是'
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'platformExpressSn',
					title: '返回第三方物流单',
				},
				{
					type: 'amount',
					dataIndex: 'refundAmount',
					title: '退款金额',
				},
				{
					type: 'amount',
					dataIndex: 'costPrice',
					title: '结算价',
				},
				{
					type: 'amount',
					dataIndex: 'platformPrice',
					title: '第三方返退金额',
				},
				{
					type: 'string',
					dataIndex: 'difference',
					title: '差额',
					customRender: (row) => {
						const platformPrice = row.platformPrice || 0
						const costPrice = row.costPrice || 0
						return `￥${(platformPrice - costPrice).toFixed(2)}`
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '打标',
							customRender: (action, row) => {
								action.hide =
									row.returnStatus != 1 &&
									row.returnStatus != 2 &&
									row.returnStatus != 3 &&
									row.returnStatus != 4
								return action
							},
							click: (row) => {
								this.markingClickLogding(row)
							},
						},
						{
							title: '填写记录',
							auth: 'updateRetrunOrderByRefundId',
							customRender: (action, row) => {
								action.hide =
									row.returnStatus != 1 &&
									row.returnStatus != 2 &&
									row.returnStatus != 3
								return action
							},
							click: (row) => {
								this.fillRecordClick(row)
							},
						},
						{
							title: '同意退款',
							customRender: (action, row) => {
								action.hide = row.refundState == 4 || row.refundState == 6
								return action
							},
							click: (row) => {
								this.handleClickRefund(row)
							},
						},
						{
							title: '取消退款',
							popconfirm: true,
							popconfirmTitle: '是否取消退货？"',
							confirm: (row) => {
								this.cancelRefund(row)
							},
							customRender: (action, row) => {
								action.hide = row.refundState == 4 || row.refundState == 6
								return action
							},
						},
					],
				},
				// {
				// 	type: 'action',
				// 	title: '补款',
				// 	width: '150',
				// 	actions: [
				// 		{
				// 			title: '补款',
				// 			auth: 'addOrderCompensation',
				// 			click: (row) => {
				// 				this.getFillingMoneyList(row)
				// 			},
				// 			customRender: (action, row) => {
				// 				action.hide = row.orderState == 1
				// 				return action
				// 			},
				// 		},
				// 	],
				// },
				{
					type: 'string',
					dataIndex: 'returnStatus',
					title: '退货状态',
					customRender: (row) => {
						// 1.待退款 2：待返退 3：已完成 4：已取消
						if (row.returnStatus == 1) {
							return '退款'
						} else if (row.returnStatus == 2) {
							return '待返退'
						} else if (row.returnStatus == 3) {
							return '已完成'
						} else if (row.returnStatus == 4) {
							return '已取消'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'refundState',
					title: '退款状态',
					customRender: (row) => {
						//退款状态。1：未确认，2：已确认，3：已作废, 4,退款成功, 5退款失败, 6发起退款
						if (row.refundState == 1) {
							return '未确认'
						} else if (row.refundState == 2) {
							return '已确认'
						} else if (row.refundState == 3) {
							return '已作废'
						} else if (row.refundState == 4) {
							return '退款成功'
						} else if (row.refundState == 5) {
							return '退款失败'
						} else if (row.refundState == 6) {
							return '发起退款'
						} else {
							return '其他'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'clerkName',
					title: '操作人',
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '退款原因',
				},
			],
			page106: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getRetrunOrderListByParam()
				},
			},
			// --------补款-----------//
			fillingMoneyLoding: false,
			addTrackingNumList: [],
			trackingNumCompensation: [],
			trackingNumTableColumns: [
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
						if (row.remarkType == 6) {
							return '缺货退款+补偿'
						} else if (row.remarkType == 7) {
							return '漏发少件补偿+退货/退款'
						} else if (row.remarkType == 8) {
							return '特殊处理'
						} else if (row.remarkType == 9) {
							return '退货运费'
						} else if (row.remarkType == 10) {
							return '质量问题'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
				{
					type: 'string',
					dataIndex: 'compensationState',
					title: '派发状态',
					customRender: (row) => {
						if (row.compensationState == 1) {
							return '未派发'
						} else {
							return '已派发'
						}
					},
				},
			],
			fillingMoneyBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.addOrderCompensation()
					},
				},
			],
			fillingData: {
				remarkType: '9',
				remark: '',
				compensationAmount: '',
				refundDesc: '',
				refundWay: '1',
				supplementType: '1',
				shipmentNumber: [],
				orderId: '',
			},
			fillingItem: [
				{
					type: 'custom',
					dataIndex: 'order-sn',
					title: '订单号',
				},
				{
					title: '补款方式',
					type: 'radio',
					label: 'value',
					dataIndex: 'supplementType',
					options: [
						{
							supplementType: '1',
							value: '到消费者微信零钱 ',
						},
					],
				},
				{
					title: '补款类型',
					type: 'radio',
					label: 'value',
					dataIndex: 'refundWay',
					options: [
						{
							refundWay: '1',
							value: '普通退款 ',
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
					title: '补款说明',
					type: 'radio',
					label: 'value',
					dataIndex: 'refundDesc',
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
					title: '用户补款金额',
					type: 'inputNumber',
					dataIndex: 'compensationAmount',
				},
				{
					type: 'select',
					title: '补款原因',
					dataIndex: 'remarkType',
					placeholder: '请选择处理结果',
					label: 'value',
					options: [
						{
							remarkType: '6',
							value: '缺货退款+补偿',
						},
						{
							remarkType: '7',
							value: '漏发少件补偿+退货/退款',
						},
						{
							remarkType: '8',
							value: '特殊处理',
						},
						{
							remarkType: '9',
							value: '退货运费',
						},
						{
							remarkType: '10',
							value: '质量问题',
						},
					],
				},
				{
					type: 'custom',
					dataIndex: 'shipmentNumber',
					title: '客户退货物流单号',
				},
				{
					title: '备注',
					type: 'textarea',
					dataIndex: 'remark',
				},
			],
			// --------同意退款-----------//
			refundDialogVisible: false,
			refundDialogLoading: false,
			expressFee: 0,
			isExpressFee: false,
			// 退款弹窗 - 表单
			refundDialogData: {
				organizationName: '',
				orderSn: '',
				addTime: '',
				weixinUserName: '',
			},
			// 退款弹窗 - 表单
			refundReasonDialogData: {
				refundType: 1,
				refundWay: 1,
				refundDesc: 1,
				remark: '',
				tagIdList: [],
				orderId: '',
				refundId: '',
				deliverState: '',
				orderState: '',
				orderGoodsList: [],
				isRefund: '1',
				isExpressFee: '1',
			},
			refundDialogCfg: [
				{
					title: '店主',
					type: 'text',
					dataIndex: 'organizationName',
				},
				{
					title: '订单号',
					type: 'text',
					dataIndex: 'orderSn',
				},
				{
					title: '下单时间',
					type: 'text',
					dataIndex: 'addTime',
				},
				{
					title: '下单人',
					type: 'text',
					dataIndex: 'weixinUserName',
				},
			],
			// 退款弹窗 - 表格
			orderGoodsTableData: [],
			returnDetaiList: [],
			aggregate: '',
			totalRefundAmount: '',
			refundtableColumns: [
				{
					type: 'custom',
					dataIndex: 'goodsName',
					title: '商品',
					width: '180',
				},
				{
					type: 'custom',
					dataIndex: 'specOne',
					title: '规格',
					width: '180',
				},
				{
					type: 'string',
					dataIndex: 'quantity',
					title: '退款数量',
				},
				{
					type: 'amount',
					dataIndex: 'price',
					title: '单价',
				},
				{
					type: 'string',
					dataIndex: 'totalAmount',
					title: '小计',
					customRender: (row) => {
						return '￥' + this.floatMul(row.price, row.quantity).toFixed(2)
					},
				},
			],
			refundTagList: [],
			refundReasonDialogCfg: [
				{
					title: '退款类型',
					type: 'radio',
					dataIndex: 'refundWay',
					label: 'value',
					options: [
						{
							refundWay: 1,
							value: '普通退款',
						},
						{
							refundWay: 2,
							value: '售后申诉退款',
						},
						{
							refundWay: 3,
							value: '二次申诉退款',
						},
					],
				},
				{
					title: '退款说明',
					type: 'radio',
					dataIndex: 'refundDesc',
					label: 'value',
					options: [
						{
							refundDesc: 1,
							value: '商家承担',
						},
						{
							refundDesc: 2,
							value: '平台承担',
						},
					],
				},
				{
					title: '退款原因',
					type: 'textarea',
					dataIndex: 'remark',
				},
				{
					title: '退款单标签',
					type: 'custom',
					dataIndex: 'tagIdList',
				},
			],
			refundDialogBottomBtn: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.handleRefundDialog()
					},
				},
			],
			//打标
			markingLogding: false,
			markingDialogData: {
				tagIdList: [],
				refundIdList: [],
			},
			markingDialogCfg: [
				{
					title: '',
					type: 'custom',
					dataIndex: 'tagIdList',
				},
			],
			markingBottomBtn: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.confirmMarking()
					},
				},
			],
			// --------填写记录-----------//
			fillRecordLogding: false,
			changed: false,
			sendChang: false,
			disabledCheck: false,
			disabledSend: false,
			returnTime: '',
			platformTime: '',
			fillRecordDialogData: {
				expressSn: '',
				customerExpressFee: '0',
				returnRemark: '',
				checkTrue: '',
				sendTrue: '',
				returnTime: '',
				platformExpressSn: '',
				platformTime: '',
				platformPrice: '0',
				platformSupplement: '0',
			},
			fillRecordDialogCfg: [
				{
					title: '客户退货物流单号',
					type: 'input',
					dataIndex: 'expressSn',
				},
				{
					title: '客户退货物流单运费',
					type: 'inputNumber',
					dataIndex: 'customerExpressFee',
				},
				{
					title: '退货备注',
					type: 'textarea',
					dataIndex: 'returnRemark',
				},
				{
					type: 'custom',
					dataIndex: 'checkTrue',
				},
				{
					title: '返回第三方物流单号',
					type: 'input',
					dataIndex: 'platformExpressSn',
				},
				{
					title: '第三方返退金额',
					type: 'inputNumber',
					dataIndex: 'platformPrice',
				},
				{
					title: '第三方补款金额',
					type: 'inputNumber',
					dataIndex: 'platformSupplement',
				},
				{
					type: 'custom',
					dataIndex: 'sendTrue',
				},
			],
			fillRecordBottomBtn: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.confirmFillRecord()
					},
				},
			],
			goodsType: null,
		}
	},

	created() {
		this._getRefundTag()
		this._getGoodsConfiguration()
	},

	methods: {
		// 获取规格名称
		async _getGoodsConfiguration() {
			let {
				data: { resultCode, resultData },
			} = await getGoodsConfiguration()
			if (resultCode == 0) {
				this.goodsType = resultData.goodsType
			}
		},
		//--------S-----查询店主table-----S-------------//
		_getOrganizationListByCondition: async function () {
			let paramJson = {
				phone: this.shopData.phone,
			}
			let regu = /^1[0-9]{10}$/
			let reg = new RegExp(regu)
			if (!reg.test(paramJson.phone)) {
				this.$message.error('请输入正确的手机号')
				return
			}
			let {
				data: { resultCode, resultData },
			} = await getOrganizationListByCondition(paramJson)
			this.shoploading = true
			if (resultCode == 0) {
				const shopTableData = resultData.organizationList || []
				this.shoploading = false
				this.showTable = true
				this.shopTableData = shopTableData.map((item) => {
					const tagList = []
					item?.groupTagList?.map((groupItem) => {
						if ([2, 7, 8].includes(groupItem.type)) {
							tagList.push({ type: 'warning', label: groupItem.tagName })
						}
						if ([5].includes(groupItem.type)) {
							tagList.push({ type: 'danger', label: groupItem.tagName })
						}
					})
					return {
						...item,
						tagList,
					}
				})
			} else {
				this.shopTableData = []
			}
		},
		//--------E-----查询店主table----E--------------//
		//--------S-----退款操作----S--------------//
		// 处理退款按钮
		async handleClickRefund(row) {
			this.refundDialogLoading = true
			this.refundDialogVisible = true

			this.refundReasonDialogData.remark = row.remark

			this.aggregate = 0
			this.totalRefundAmount = 0
			this.returnDetaiList = []
			this.isExpressFee = false
			const {
				data: { resultData, resultCode },
			} = await getRetrunOrderDetailByParam({ refundId: row.refundId })
			if (resultCode == 0) {
				this.refundDialogData = {
					organizationName: resultData.returnDetail.weixinUserName,
					orderSn: row.orderSn,
					addTime: resultData.returnDetail.addTime,
					weixinUserName: resultData.returnDetail.weixinUserName,
				}
				this.refundReasonDialogData.orderId = resultData.returnDetail.orderId
				this.refundReasonDialogData.refundId = resultData.returnDetail.refundId
				this.refundReasonDialogData.remarkType =
					resultData.returnDetail.remarkType + ''
				this.refundReasonDialogData.deliverState =
					resultData.returnDetail.deliverState
				this.refundReasonDialogData.orderState =
					resultData.returnDetail.orderState
				this.returnDetaiList.push(resultData.returnDetail)
				this.orderGoodsTableData = resultData.returnDetail.orderGoodsList
				this.refundReasonDialogData.orderGoodsList = this.orderGoodsTableData
				this.refundReasonDialogData.refundWay =
					resultData.returnDetail.refundWay
				this.expressFee = row.expressFee
				this.refundReasonDialogData.refundDesc =
					resultData.returnDetail.refundDesc
				this.orderGoodsTableData.map((item) => {
					this.aggregate += item.quantity
					this.totalRefundAmount += item.price * item.quantity
				})
				this.totalRefundAmount = this.totalRefundAmount.toFixed(2)
				console.log('===', this.totalRefundAmount)
			}
			this.refundDialogLoading = false
		},
		// //乘
		floatMul(arg1, arg2) {
			let m = 0,
				s1 = arg1.toString(),
				s2 = arg2.toString()
			try {
				m += s1.split('.')[1].length
			} catch (e) {
				;('')
			}
			try {
				m += s2.split('.')[1].length
			} catch (e) {
				;('')
			}
			return (
				(Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
				Math.pow(10, m)
			)
		},
		async cancelRefund(row) {
			const {
				data: { resultCode },
			} = await cancelRetrunOrderByRefundId({
				refundId: row.refundId,
			})
			if (resultCode == 0) {
				this.$message({
					message: `退款成功!`,
					type: 'success',
				})
				this._getRetrunOrderListByParam()
			}
		},
		// 发起退款操作
		async handleRefundDialog() {
			const refundReasonDialogData = JSON.parse(
				JSON.stringify(this.refundReasonDialogData)
			)
			if (isNull(refundReasonDialogData.remark)) {
				this.$message.warning({ message: '请填写退款原因' })
				return
			}
			refundReasonDialogData.isExpressFee = this.isExpressFee ? 2 : 1
			if (
				refundReasonDialogData.orderGoodsList.length == 0 &&
				refundReasonDialogData.isExpressFee == 1
			) {
				this.$message.warning({ message: '必须填写退款数量或者选择运费' })
				return
			}
			if (!refundReasonDialogData.refundWay) {
				this.$message.warning({ message: '请选择退款类型' })
				return
			}
			if (!refundReasonDialogData.refundDesc) {
				this.$message.warning({ message: '请选择退款说明' })
				return
			}
			for (let i in refundReasonDialogData.orderGoodsList) {
				refundReasonDialogData.orderGoodsList[i].refundQuantity =
					refundReasonDialogData.orderGoodsList[i].quantity
			}
			refundReasonDialogData.refundOrderGoodsList =
				refundReasonDialogData.orderGoodsList
			refundReasonDialogData.userId = this.$store.state.user.userInfo.userId
			refundReasonDialogData.groupId = this.$store.state.user.userInfo.groupId
			const {
				data: { resultCode, resultMsg },
			} = await addNewOrderRefundByOrderIdNews(refundReasonDialogData)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.refundDialogVisible = false
				this._getRetrunOrderListByParam(true)
			}
		},
		//--------E-----退款操作----E--------------//
		//--------S-----打标----S--------------//
		//打标
		markingClickLogding(row) {
			this.markingLogding = true
			// this.markingDialogData.tagIdList = []
			this.markingDialogData.refundIdList = [row.refundId]
			if (row.tagNames) {
				this.markingDialogData.tagIdList = row.tagNames
					.split(',')
					.map((item) => {
						let tagItem = item.split('-')
						return tagItem[0] * 1
					})
			} else {
				this.markingDialogData.tagIdList = []
			}
		},
		//确认打标
		confirmMarking: async function () {
			let paramJson = this.markingDialogData
			let {
				data: { resultCode, resultMsg },
			} = await addRefundTagToRefund(paramJson)
			if (resultCode == 0) {
				this.$message({
					message: `打标成功!`,
					type: 'success',
				})
				this.markingLogding = false
				this._getRetrunOrderListByParam()
			} else {
				this.$message.error(resultMsg)
			}
		},
		//筛选初始数据
		_getRefundTag: async function () {
			let res = await getRefundTag()
			res = res.data
			if (res.resultCode === 0) {
				let groupTagList = res.resultData.groupTagList.map((item) => {
					return {
						groupTagList: item.groupTagId,
						tagName: item.tagName,
					}
				})
				this.markingData.groupTagList = groupTagList
			}
		},
		//--------E-----打标----E--------------//
		//--------S-----返退记录----S--------------//
		//弹起初始数据记录 && 弹框
		fillRecordClick(row) {
			this.fillRecordLogding = true
			//回显
			this.expressSn = row.expressSn ? row.expressSn : ''
			this.fillRecordDialogData.refundId = row.refundId
			this.fillRecordDialogData.expressSn = row.expressSn ? row.expressSn : '' //客户退货物流单号

			this.fillRecordDialogData.customerExpressFee = row.customerExpressFee
				? row.customerExpressFee
				: 0 //客户退货物流单运费
			this.fillRecordDialogData.returnRemark = row.returnRemark
				? row.returnRemark
				: '' //退货备注
			this.fillRecordDialogData.returnTime = row.returnTime
				? row.returnTime
				: '' //客户退货是否收回 时间
			console.log('======', this.fillRecordDialogCfg)

			this.fillRecordDialogData.checkTrue = row.returnTime ? true : false //客户退货是否收回 选框
			let newList = []
			this.fillRecordDialogCfg.map((item) => {
				if (item.type !== 'time') {
					newList.push(item)
					// return item
				}
			})
			this.fillRecordDialogCfg = newList
			console.log('======', newList)
			this.returnTime = row.returnTime
			this.platformTime = row.platformTime
			if (row.returnTime) {
				this.disabledCheck = true //有数据返回禁用选框
				this.fillRecordDialogCfg.splice(4, 0, {
					//回显时间&&禁用
					hide: false,
					title: '收回时间',
					disabled: true,
					type: 'time',
					timeAttributes: {
						type: 'datetime',
					},
					dataIndex: 'returnTime',
				})
			} else {
				this.disabledCheck = false //有数据返回禁用选框
			}
			this.fillRecordDialogData.platformExpressSn = row.platformExpressSn
				? row.platformExpressSn
				: '' //返回第三方物流单号
			this.fillRecordDialogData.platformPrice = row.platformPrice
				? row.platformPrice
				: '0' //第三方返退金额
			this.fillRecordDialogData.platformSupplement = row.platformSupplement
				? row.platformSupplement
				: '0' //第三方补款金额
			this.fillRecordDialogData.platformTime = row.platformTime
				? row.platformTime
				: ''
			this.fillRecordDialogCfg.forEach((cfg) => {
				if (
					cfg.dataIndex == 'platformPrice' ||
					cfg.dataIndex == 'platformSupplement' ||
					cfg.dataIndex == 'sendTrue'
				) {
					cfg.hide = row.returnStatus == 1
				}
			})
			if (row.platformTime) {
				this.disabledSend = true //有数据返回禁用选框
				this.fillRecordDialogCfg[this.fillRecordDialogCfg.length] = {
					//回显时间&&禁用
					hide: false,
					title: '寄出时间',
					disabled: true,
					type: 'time',
					timeAttributes: {
						type: 'datetime',
					},
					dataIndex: 'platformTime',
				}
			} else {
				this.disabledSend = false //有数据返回禁用选框
			}
			this.fillRecordDialogData.sendTrue = row.platformTime ? true : false
		},
		// 关闭弹窗
		closeForm() {
			this.fillRecordLogding = false
			this.disabledCheck = false //有数据返回禁用选框
			this.disabledSend = false //有数据返回禁用选框
			this.fillRecordDialogData = {
				expressSn: '',
				customerExpressFee: '0',
				returnRemark: '',
				checkTrue: '',
				sendTrue: '',
				returnTime: '',
				platformExpressSn: '',
				platformTime: '',
				platformPrice: '0',
				platformSupplement: '0',
			}
			this.$refs.form.$refs.YxForm.resetFields()
		},
		//监听退货是否收回选框
		checkChangeTrue(val) {
			this.changed = val
			if (this.changed) {
				this.fillRecordDialogCfg.splice(4, 0, {
					hide: false,
					title: '收回时间',
					disabled: true,
					type: 'time',
					timeAttributes: {
						type: 'datetime',
					},
					dataIndex: 'returnTime',
				})
				this.fillRecordDialogData.returnTime = new Date().getTime()
			} else {
				this.fillRecordDialogCfg[4] = {
					hide: true,
					title: '收回时间',
					type: 'time',
					timeAttributes: {
						type: 'datetime',
					},
					dataIndex: 'returnTime',
				}
				this.fillRecordDialogData.returnTime = ''
			}
		},
		//监听寄出选框
		sendChangeTrue(dotey) {
			this.sendChang = dotey
			console.log('inde====', this.fillRecordDialogCfg.length)
			if (this.sendChang) {
				this.fillRecordDialogCfg[this.fillRecordDialogCfg.length] = {
					hide: false,
					title: '寄出时间',
					disabled: true,
					type: 'time',
					timeAttributes: {
						type: 'datetime',
					},
					dataIndex: 'platformTime',
				}
				this.fillRecordDialogData.platformTime = new Date().getTime()
			} else {
				this.fillRecordDialogCfg[this.fillRecordDialogCfg.length - 1] = {
					hide: true,
					title: '寄出时间',
					type: 'time',
					timeAttributes: {
						type: 'datetime',
					},
					dataIndex: 'platformTime',
				}
				this.fillRecordDialogData.platformTime = ''
			}
		},
		//确定填写记录
		confirmFillRecord() {
			if (this.expressSn != this.fillRecordDialogData.expressSn) {
				this._getRetrunExpressSnByParam({
					expressSn: this.fillRecordDialogData.expressSn,
				})
			} else {
				this._updateRetrunOrderByRefundId()
			}
			console.log('[][][=-=', this.fillRecordDialogData)
		},
		//--------E-----返退记录----E--------------//

		//弹起补款,查补款内联数据
		getFillingMoneyList(row) {
			this.fillingMoneyLoding = true
			this.fillingData = {
				remarkType: '9',
				remark: '',
				compensationAmount: '',
				refundDesc: '',
				refundWay: '1',
				supplementType: '1',
				shipmentNumber: [],
				orderId: '',
			}
			this.fillingData.orderSn = row.orderSn
			this.fillingData.orderId = row.orderId
			this._getCompensationInfo()
		},
		//客户退货的申请补款物流信息
		_getCompensationInfo: async function (num) {
			let paramJson = {
				orderSn: this.fillingData.orderSn,
				needTrackingNum: 1,
			}
			if (num) {
				paramJson.trackingNum = num
			}
			let {
				data: { resultCode, resultData },
			} = await getCompensationInfo(paramJson)
			if (resultCode == 0) {
				this.addTrackingNumList = resultData.trackingNumCompensation || []
				this.trackingNumCompensation = resultData.orderCompensation || []
				console.log('++++=', this.trackingNumCompensation.length)
			}
		},
		//监听客户退货单选框
		trackingNumChange(num) {
			this.fillingData.trackingNum = num
			this._getCompensationInfo(num)
		},
		//确定补款
		addOrderCompensation: async function () {
			let paramJson = JSON.parse(JSON.stringify(this.fillingData))
			delete paramJson.orderSn
			if (isNull(paramJson.compensationAmount)) {
				this.$message.warning({ message: '请输入补款金额' })
				return
			}
			if (paramJson.compensationAmount < 0.3) {
				this.$message.warning({ message: '补款金额不能小于0.3' })
				return
			}
			if (paramJson.compensationAmount > 999) {
				this.$message.warning({ message: '补款金额不能超过999' })
				return
			}
			if (isNull(paramJson.refundDesc)) {
				this.$message.warning({ message: '请选择补款说明' })
				return
			}
			if (isNull(paramJson.remark)) {
				this.$message.warning({ message: '请填写备注' })
				return
			}
			if (isNull(paramJson.remarkType)) {
				this.$message.warning({ message: '请选择补款原因' })
				return
			}
			let {
				data: { resultCode },
			} = await addOrderCompensation(paramJson)
			if (resultCode == 0) {
				this.$message({
					message: `补款成功!`,
					type: 'success',
				})
				this.fillingMoneyLoding = false
				this._getRetrunOrderListByParam()
			}
		},
		//商家弹窗
		selectSupplier(e) {
			e.target.blur()
			this.formsDialog = true
		},
		//员工弹窗
		selectClerkList(e) {
			e.target.blur()
			this.clerkDialog = true
		},
		//录入员工弹窗
		selectClerkEntering(e) {
			e.target.blur()
			this.enteringDialog = true
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
			paramJson.addTimeStart = moment(paramJson.addTimeStart).valueOf() || ''
			paramJson.addTimeEnd = moment(paramJson.addTimeEnd).valueOf() || ''
			paramJson.returnTimeStart =
				moment(paramJson.returnTimeStart).valueOf() || ''
			paramJson.returnTimeEnd = moment(paramJson.returnTimeEnd).valueOf() || ''
			paramJson.platformTimeStart =
				moment(paramJson.platformTimeStart).valueOf() || ''
			paramJson.platformTimeEnd =
				moment(paramJson.platformTimeEnd).valueOf() || ''

			return paramJson
		},
		//加载初始表格
		_getRetrunOrderListByParam: async function (flag) {
			let paramJson = this.findSearchParams106(flag)
			if (
				isNull(paramJson.addTimeStart) &&
				isNull(paramJson.addTimeEnd) &&
				isNull(paramJson.likeOrderSn)
			) {
				this.$message.warning({
					message: '发起时间、订单号、物流单号必须有一个不为空!',
				})
				return
			}
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await getRetrunOrderListByParam(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				const refundList = resultData.refundList || []
				this.tableData106 = refundList.map((item) => {
					let tagList = item.groupTagList || []
					if (item.tagNames) {
						tagList = item.tagNames.split(',').map((tag) => {
							const tagItem = tag.split('-')
							return {
								groupTagId: tagItem[0],
								tagName: tagItem[1],
							}
						})
					}
					return {
						...item,
						tagList,
					}
				})
				this.page106.count = resultData.count
			} else {
				this.page106.count = 0
				this.tableData106 = []
			}
		},
		async _getRetrunExpressSnByParam(paramJson) {
			let {
				data: { resultCode, resultData },
			} = await getRetrunExpressSnByParam(paramJson)

			if (resultCode == 0) {
				if (resultData.isExpressSnExist) {
					this.$alert(
						'该物流单号已填写于其他退货单，请确认该物流单号？',
						'物流单号',
						{
							confirmButtonText: '确定',
							callback: () => {
								this._updateRetrunOrderByRefundId()
							},
						}
					)
				} else {
					this._updateRetrunOrderByRefundId()
				}
			}
		},
		async _updateRetrunOrderByRefundId() {
			let paramJson = this.fillRecordDialogData
			paramJson.updateType = 0
			if (this.platformTime && isNull(paramJson.platformPrice)) {
				this.$message.warning({ message: '请输入第三方返退金额' })
				return
			}
			if (
				this.returnTime == 0 &&
				paramJson.returnTime == 0 &&
				!this.operateGoodsRecovery
			) {
				this.$message.warning({ message: '没有确认收货的权限' })
				return
			}
			let {
				data: { resultCode },
			} = await updateRetrunOrderByRefundId(paramJson)

			if (resultCode == 0) {
				this.$message({
					message: `记录成功!`,
					type: 'success',
				})
				this._getRetrunOrderListByParam(true)
				this.closeForm()
			}
		},
	},
}
</script>
<style>
.bg-yellow {
	background-color: #ffc94b;
}
.goods_img {
	width: 60px;
	height: 60px;
	margin-right: 10px;
	line-height: 155px;
}
.refundReason {
	margin: 20px 0;
}
</style>

<template>
	<div class="refundList">
		<basicContainer>
			<yx-form
				ref="formData107"
				:inline="true"
				:data="formData107"
				:items="formCfg107"
				:formAction="formAction107"
				:rules="formRule107"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns108"
				:data="tableData108"
				v-if="isShowTable"
			>
				<template slot="organizationName" slot-scope="scope">
					<div>
						<el-link
							v-if="getOrganizationDetailsAuth"
							type="primary"
							:href="
								'/yhtplus/egg/shop/shop/shopDetail?organizationId=' +
								scope.row.organizationId
							"
							>{{ scope.row.organizationName
							}}<i class="el-icon-view el-icon--right"></i>
						</el-link>
						<span v-else>{{ scope.row.organizationName }}</span>
						<div>
							<el-tag
								style="margin: 5px"
								v-for="item in scope.row.groupTagList"
								:key="item.groupTagRelationId"
								:type="getTypeMap(item.type)"
								effect="dark"
							>
								{{ item.tagName }}
							</el-tag>
						</div>
					</div>
				</template>
			</yx-table>
			<div class="mb-20"></div>
			<yx-form
				:inline="true"
				:data="formData104"
				:items="formCfg104"
				:formAction="formAction104"
			>
				<template #supplierName>
					<el-input
						v-model="formData104.supplierName"
						placeholder="请选择商家"
						value-key="supplierName"
						label="supplierName"
						@focus="selectSupplier"
						clearable
						@clear="
							() => {
								formData104.supplierName = ''
								formData104.supplierAccountNumberId = ''
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="supplyDialogVisible = true"
						></el-button>
					</el-input>
				</template>
			</yx-form>
			<yx-accounts :items="accountItems106"></yx-accounts>
			<yx-table
				:select="true"
				:selectionChange="selectionChange"
				v-loading="loading2"
				:columns="tableColumns105"
				:pagination="page105"
				:data="tableData105"
			>
				<template slot="refundSn" slot-scope="scope">
					<div>{{ scope.row.refundSn }}</div>
					<div style="color: #999">
						{{ moment(scope.row.addTime).format('YYYY-MM-DD HH:mm:ss') }}
					</div>
					<el-tag
						style="margin: 5px"
						v-for="(item, index) in scope.row.tagList"
						:key="index"
						type="primary"
					>
						{{ item.refundName }}
					</el-tag>
				</template>
				<template slot="orderSn" slot-scope="scope">
					<div v-if="scope.row.orderSn">
						<router-link
							:to="`/business/orderDetails/${scope.row.orderId}?sourceType=${scope.row.sourceType}`"
							><el-button type="text">{{
								scope.row.orderSn
							}}</el-button></router-link
						>
						<div style="color: #999">
							{{ moment(scope.row.orderAddTime).format('YYYY-MM-DD HH:mm:ss') }}
						</div>
					</div>
					<span v-else>-</span>
				</template>
				<template slot="afterSalesId" slot-scope="scope">
					<router-link
						v-if="scope.row.afterSalesId"
						:to="`/business/afterSaleOrderDetails/${scope.row.afterSalesId}`"
						><el-button type="text">{{
							scope.row.afterSalesSn
						}}</el-button></router-link
					>
					<span v-else>-</span>
				</template>
				<template slot="orderState" slot-scope="scope">
					<YxOrderState :orderState="scope.row.orderState" />
				</template>
				<template slot="organizationName" slot-scope="scope">
					<a
						style="color: #0096fb"
						target="_blank"
						:href="
							'/yhtplus/egg/shop/shop/shopDetail?organizationId=' +
							scope.row.childOrganizationId
						"
						>{{ scope.row.organizationName }}</a
					>
				</template>
				<template slot="deliverState" slot-scope="scope">
					<YxDeliverState :deliverState="scope.row.deliverState" />
				</template>
			</yx-table>
			<Dialog
				:title="dialogTitle109"
				:visible="dialogVisible109"
				:width="dialogWidth109"
				:bottomBtn="dialogBottomBtn109"
				@before-close="
					() => {
						dialogVisible109 = false
						formData110 = {
							platformExpressSn: '',
							platformPrice: '',
						}
					}
				"
			>
				<yx-form
					:inline="false"
					:data="formData110"
					:items="formCfg110"
					label-position="right"
					label-width="130px"
				>
				</yx-form>
			</Dialog>
			<!-- 退款单打标签弹窗 S -->
			<Dialog
				:title="dialogTitle111"
				:visible="dialogVisible111"
				:width="dialogWidth111"
				:bottomBtn="dialogBottomBtn111"
				@before-close="
					() => {
						dialogVisible111 = false
					}
				"
			>
				<div class="refundTagCheckbox-title">
					设置订单标签内容步骤：设置—>系统设置—>订单—>默认订单标签
				</div>
				<el-checkbox-group v-model="refundTagCheckboxList">
					<el-checkbox
						class="refundTagCheckbox-item"
						v-for="(item, index) in tagIdList"
						:key="index"
						:label="item.tagIdList"
						>{{ item.value }}</el-checkbox
					>
				</el-checkbox-group>
			</Dialog>
			<!-- 退款单打标签弹窗 E -->
			<Dialog
				title="人工退款"
				:visible="refundDialogVisible"
				width="500px"
				:bottomBtn="refundDialogBtn"
				@before-close="
					() => {
						refundDialogVisible = false
						refundDialogData = {
							refundFormList: '4',
							remark: '',
						}
					}
				"
			>
				<yx-form
					:inline="false"
					:data="refundDialogData"
					:items="refundDialogCfg"
					label-position="right"
					label-width="130px"
				>
				</yx-form>
			</Dialog>
			<!-- 供应商/商家列表 -->
			<supplier-account-dialog
				:itemInfo="supplierRow"
				:visible.sync="supplyDialogVisible"
				chooseType="radio"
				@fatherMethodInit="
					(row) => {
						formData104.supplierName = row.supplierName
						formData104.supplierAccountNumberId = row.supplierAccountNumberId
						this.supplierRow = row
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
import YxAccounts from '@/components/Accounts'
import Dialog from '@/components/Dialog'
import YxDeliverState from '../deliverState.vue'
import YxOrderState from '../orderState.vue'
import { getOrganizationListByCondition } from '@/api/yhtPlusCmsOrganization'
import {
	getRefundOrderListByParam,
	exportRefundOrderListByParam,
	updateRefundOrderByRefundId,
} from '@/api/yhtPlusCmsOrder'
import { addRefundTagToRefund, getRefundTag } from '@/api/systemConfiguration'
import {
	handleProcess,
	checkRefundResult,
} from '@/api/weeget-bullet-order-rest'
// import { updaterefundbylist } from '@/api/afterSales'
import { downloadFile } from '@/utils/helper/common'
// import { supplierAccountNumberList } from '@/api/yhtPlusCmsSupplier'
import moment from 'moment'
import { checkFunctionCode } from '@/utils/auth'
// import SupplierDialog from '@/components/SupplierDialog'
import SupplierAccountDialog from '@/components/SupplierAccountDialog'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		YxAccounts,
		Dialog,
		YxDeliverState,
		// SupplierDialog,
		SupplierAccountDialog,
		YxOrderState,
	},
	props: [],
	data() {
		return {
			supplierRow: {},
			supplyDialogVisible: false,
			getOrganizationDetailsAuth: false, //查看店主权限
			getOrderDetailByOrderIdAuth: false, //关联订单号
			isShowTable: false,
			moment,
			activeRow: {},
			checkedList: [],
			loading: false,
			loading2: false,
			formData107: {
				phone: '',
			},
			formCfg107: [
				{
					type: 'inputNumber',
					title: '店主手机号',
					dataIndex: 'phone',
					enter: () => {
						this.$refs.formData107.$refs.YxForm.validate((valid) => {
							if (valid) {
								this.getData108()
							}
						})
					},
				},
			],
			formRule107: {
				phone: [
					{ required: true, message: '请输入手机号！' },
					{
						pattern: /^1[0-9]{10}$/,
						message: '手机号格式有误',
						trigger: 'blur',
					},
				],
			},
			formAction107: [
				{
					title: '查询',
					type: 'primary',
					yapiId: '',
					token: '',
					dialogId: '',
					click: () => {
						if (!this.loading) this.getData108(true)
					},
				},
			],
			tableData108: [],
			tableColumns108: [
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
			page108: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData108()
				},
			},
			formData104: {
				supplierAccountNumberId: '',
				supplierName: '',
				refundState: '',
				orderState: '',
				handleTag: '',
				deliverState: '',
				sourceName: '',
				platformPriceState: '',
				addTimeStart: moment().startOf('month').valueOf(),
				addTimeEnd: moment().endOf('month').valueOf(),
				tagIdList: [],
				likeExpressSn: '',
				likeOrderSn: '',
				likeReturnSn: '',
				likeConsignee: '',
				likeTelNumber: '',
				likeOrganizationName: '',
				likeBrandName: '',
				likeWeixinUserName: '',
				likeClerkName: '',
				afterSalesSn: '',
				exportLoading: false,
			},
			formCfg104: [
				{
					type: 'select',
					title: '退款单状态',
					dataIndex: 'refundState',
					label: 'value',
					options: [
						{
							refundState: '',
							value: '全部',
						},
						{
							refundState: '1',
							value: '未确认',
						},
						{
							refundState: '4',
							value: '退款成功',
						},
						{
							refundState: '5',
							value: '退款失败',
						},
						{
							refundState: '6',
							value: '发起微信退款',
						},
					],
				},
				{
					type: 'select',
					title: '审核状态',
					dataIndex: 'orderState',
					label: 'value',
					options: [
						{
							orderState: '',
							value: '全部',
						},
						{
							orderState: '1',
							value: '待审核',
						},
						{
							orderState: '8',
							value: '审核通过',
						},
					],
				},
				{
					type: 'select',
					title: '标记状态',
					dataIndex: 'handleTag',
					label: 'value',
					options: [
						{
							handleTag: '',
							value: '全部',
						},
						{
							handleTag: '1',
							value: '待处理',
						},
						{
							handleTag: '2',
							value: '系统处理',
						},
						{
							handleTag: '3',
							value: '人工处理',
						},
					],
				},
				{
					title: '商家名称',
					type: 'custom',
					dataIndex: 'supplierName',
				},
				// {
				// 	type: 'select',
				// 	title: '供应商',
				// 	dataIndex: 'supplierAccountNumberId',
				// 	label: 'value',
				// 	options: [
				// 		{
				// 			supplierAccountNumberId: '0',
				// 			value: '全部',
				// 		},
				// 	],
				// 	change: () => {
				// 		this.getData105(true)
				// 	},
				// },
				{
					type: 'select',
					title: '发货状态',
					dataIndex: 'deliverState',
					label: 'value',
					options: [
						{
							deliverState: '',
							value: '全部',
						},
						{
							deliverState: '1',
							value: '待发货',
						},
						{
							deliverState: '3',
							value: '已发货',
						},
						{
							deliverState: '4',
							value: '已确认收货',
						},
					],
				},
				{
					type: 'select',
					title: '下单号',
					dataIndex: 'sourceName',
					label: 'value',
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
					title: '第三方返退金额',
					dataIndex: 'platformPriceState',
					label: 'value',
					options: [
						{
							platformPriceState: '0',
							value: '全部',
						},
						{
							platformPriceState: '1',
							value: '为0',
						},
						{
							platformPriceState: '2',
							value: '非0',
						},
					],
				},
				{
					type: 'datetimerange',
					title: '发起退款时间',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
				},
				{
					type: 'checkbox',
					title: '退款单标签',
					dataIndex: 'tagIdList',
					label: 'value',
					options: [],
					change: () => {
						this.getData105(true)
					},
				},
				{
					title: '物流单号',
					type: 'input',
					dataIndex: 'likeExpressSn',
					enter: () => {
						this.getData105(true)
					},
				},
				{
					title: '订单号',
					type: 'input',
					dataIndex: 'likeOrderSn',
					enter: () => {
						this.getData105(true)
					},
				},
				{
					title: '退货单号',
					type: 'input',
					dataIndex: 'likeReturnSn',
					enter: () => {
						this.getData105(true)
					},
				},
				{
					title: '收货人',
					type: 'input',
					dataIndex: 'likeConsignee',
					enter: () => {
						this.getData105(true)
					},
				},
				{
					title: '收货号码',
					type: 'input',
					dataIndex: 'likeTelNumber',
					enter: () => {
						this.getData105(true)
					},
				},
				{
					title: '店主名称',
					type: 'input',
					dataIndex: 'likeOrganizationName',
					enter: () => {
						this.getData105(true)
					},
				},
				{
					title: '会场名称',
					type: 'input',
					dataIndex: 'likeBrandName',
					enter: () => {
						this.getData105(true)
					},
				},
				{
					title: '下单人',
					type: 'input',
					dataIndex: 'likeWeixinUserName',
					enter: () => {
						this.getData105(true)
					},
				},
				{
					title: '操作人',
					type: 'input',
					dataIndex: 'likeClerkName',
					enter: () => {
						this.getData105(true)
					},
				},
				{
					title: '售后单号',
					type: 'input',
					dataIndex: 'afterSalesSn',
					enter: () => {
						this.getData105(true)
					},
				},
			],
			formAction104: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getData105(true)
					},
					tableId: 105,
					api: 'getRefundOrderListByParam',
				},
				// {
				// 	title: '批量更新',
				// 	type: 'primary',
				// 	click: () => {
				// 		if (this.checkedList.length === 0) {
				// 			return this.$message.warning('请勾选退款单')
				// 		} else if (this.checkedList.length > 10) {
				// 			return this.$message.warning('每次更新条数不能超过10')
				// 		}
				// 		this._updaterefundbylist(this.checkedList)
				// 	},
				// },
				{
					title: '导出Excel',
					type: 'success',
					auth: 'exportRefundOrderListByParam',
					click: async () => {
						if (this.exportLoading) return
						this.exportLoading = true
						let paramJson = this.findSearchParams105(true)
						let { data } = await exportRefundOrderListByParam({
							data: JSON.stringify(paramJson),
						})
						console.log('data', data)
						downloadFile(data, '退款单列表.xlsx')
						this.exportLoading = false
					},
				},
			],
			accountItems106: [
				{
					type: 'amount',
					title: '退款金额',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '结算金额',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '第三方返退金额',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '差额',
					value: '0.00',
				},
			],
			tableData105: [],
			tableColumns105: [
				{
					type: 'custom',
					dataIndex: 'refundSn',
					title: '退款单号',
					width: '200',
				},
				{
					type: 'date',
					dataIndex: 'refundTime',
					title: '退款时间',
				},
				{
					type: 'string',
					dataIndex: 'refundState',
					title: '退款单状态',
					customRender: (row) => {
						const arr = [
							'',
							'未确认',
							'已确认',
							'已作废',
							'退款成功',
							'退款失败',
							'发起微信退款',
						]
						return arr[row.refundState] || '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'platformExpressSn',
					title: '返回第三方物流号',
					customRender: (row) => {
						return row.platformExpressSn || '-'
					},
				},
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '关联订单号',
					width: '180',
				},
				{
					type: 'custom',
					dataIndex: 'afterSalesId',
					title: '关联售后单',
					width: '160',
				},
				{
					type: 'custom',
					dataIndex: 'orderState',
					title: '审核状态',
					width: '200',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
				},
				{
					type: 'string',
					dataIndex: 'sourceName',
					title: '下单号',
					customRender: (row) => {
						return row.sourceName || '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'handleTag',
					title: '标记状态',
					customRender: (row) => {
						const arr = ['', '待处理', '系统处理', '人工处理']
						return arr[row.handleTag] || '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场',
				},
				{
					type: 'custom',
					dataIndex: 'organizationName',
					title: '店主名称',
				},
				{
					type: 'string',
					dataIndex: 'weixinUserName',
					title: '下单人',
				},
				{
					type: 'string',
					dataIndex: 'refundQuantity',
					title: '商品数量',
				},
				{
					type: 'custom',
					dataIndex: 'deliverState',
					title: '发货状态',
					width: '150',
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
						let platformPrice = row.platformPrice || 0
						let costPrice = row.costPrice || 0
						return '￥' + (platformPrice - costPrice).toFixed(2)
					},
				},
				{
					type: 'string',
					dataIndex: 'clerkName',
					title: '操作人',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '返退记录',
							auth: 'updateRefundOrderByRefundId',
							click: (row) => {
								this.activeRow = row
								this.formData110.platformPrice = row.platformPrice
								this.formData110.platformExpressSn = row.platformExpressSn
								this.dialogVisible109 = true
							},
						},
						{
							title: '打标',
							auth: 'addRefundTagToRefund',
							click: (row) => {
								this.activeRow = row
								this.dialogVisible111 = true
								if (row.tagNames) {
									// 打标回显
									try {
										this.refundTagCheckboxList = row.tagNames
											.split(',')
											.map((item) => item.split('-')[0] * 1)
									} catch (error) {
										this.refundTagCheckboxList = []
									}
								} else {
									this.refundTagCheckboxList = []
								}
							},
						},
						// {
						// 	title: '更新返退金额',
						// 	popconfirm: true,
						// 	popconfirmTitle: '确认要更新返退金额吗',
						// 	confirmButtonText: '确认',
						// 	cancelButtonText: '取消',
						// 	confirmButtonType: 'primary',
						// 	cancelButtonType: 'text',
						// 	confirm: async (row) => {
						// 		this._updaterefundbylist([row])
						// 	},
						// },
						{
							title: '同步查询',
							// customRender: (action, row) => {
							// 	action.hide = !(row.refundState == 1)
							// 	return action
							// },
							popconfirm: true,
							popconfirmTitle: '确认要同步查询吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: async (row) => {
								if (this.loading) return
								this.loading = true
								const res = await checkRefundResult({
									refundSn: row.refundSn,
									orderId: row.orderId,
									groupId: this.$store.state.user.userInfo.groupId,
								})
								const {
									data: { resultCode, resultMsg },
								} = res
								if (resultCode === 0) {
									this.$message.success(resultMsg)
									this.getData105(true)
								}
								this.loading = false
							},
						},
						{
							title: '人工退款',
							customRender: (action, row) => {
								action.hide = !(row.refundState == 5)
								return action
							},
							click: (row) => {
								this.activeRow = row
								this.refundDialogVisible = true
								this.getData105(true)
							},
						},
					],
				},
			],
			page105: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData105()
				},
			},
			dialogTitle109: '返退记录',
			dialogWidth109: '30%',
			dialogVisible109: false,
			dialogBottomBtn109: [
				{
					title: '确 定',
					type: 'primary',
					click: async () => {
						const {
							data: { resultCode, resultMsg },
						} = await updateRefundOrderByRefundId({
							refundId: this.activeRow.refundId,
							...this.formData110,
						})
						if (resultCode === 0) {
							this.$message.success(resultMsg)
							this.getData105(true)
							this.dialogVisible109 = false
						}
					},
				},
			],
			formData110: {
				platformExpressSn: '',
				platformPrice: '',
			},
			formCfg110: [
				{
					type: 'input',
					title: '返回第三方物流号',
					dataIndex: 'platformExpressSn',
				},
				{
					type: 'inputNumber',
					title: '第三方返退金额',
					dataIndex: 'platformPrice',
				},
			],
			// 退款单打标签弹窗
			tagIdList: [],
			refundTagCheckboxList: [],
			dialogTitle111: '退款单打标签',
			dialogWidth111: '600px',
			dialogVisible111: false,
			dialogBottomBtn111: [
				{
					title: '保存',
					type: 'primary',
					click: async () => {
						// console.log('refundTagCheckboxList', this.refundTagCheckboxList)
						const params = {
							refundIdList: [this.activeRow.refundId],
							tagIdList: this.refundTagCheckboxList,
						}
						const {
							data: { resultCode, resultMsg },
						} = await addRefundTagToRefund(params)
						if (resultCode === 0) {
							this.$message.success(resultMsg)
							this.dialogVisible111 = false
							this.getData105(true)
						}
					},
				},
			],
			refundDialogVisible: false,
			refundDialogBtn: [
				{
					title: '保存',
					type: 'primary',
					click: async () => {
						if (!this.refundDialogData.remark.trim())
							return this.$message.warning('请输入退款备注')
						if (this.loading) return
						this.loading = true
						const params = {
							orderId: this.activeRow.orderId,
							afterSalesId: this.activeRow.afterSalesId,
							remark: this.refundDialogData.remark,
							refundId: this.activeRow.refundId,
							refundForm: this.activeRow.refundFormList,
						}
						params.userId = this.$store.state.user.userInfo.userId
						params.groupId = this.$store.state.user.userInfo.groupId
						const {
							data: { resultCode, resultMsg },
						} = await handleProcess(params)
						if (resultCode === 0) {
							this.$message.success(resultMsg)
							this.refundDialogVisible = false
							this.getData105(true)
						}
						this.loading = false
					},
				},
			],
			refundDialogData: {
				refundFormList: '4',
				remark: '',
			},
			refundDialogCfg: [
				{
					type: 'select',
					title: '退款方式',
					dataIndex: 'refundFormList',
					label: 'value',
					options: [
						{
							refundFormList: '4',
							value: '微信转账',
						},
						{
							refundFormList: '5',
							value: '支付宝转账',
						},
					],
				},
				{
					type: 'textarea',
					title: '退款备注',
					dataIndex: 'remark',
				},
			],
		}
	},
	created() {
		this.getOrganizationDetailsAuth = checkFunctionCode(
			'getOrganizationDetails'
		)
		this.getOrderDetailByOrderIdAuth = checkFunctionCode(
			'getOrderDetailByOrderId'
		)
		// this.getData105(true)
		this.initRefundTag()
		// this.initSupplierAccountOptions()
	},
	methods: {
		//商家弹窗
		selectSupplier(e) {
			e.target.blur()
			this.supplyDialogVisible = true
		},
		//标签
		getTagByTagNamesString(tagNamesString) {
			// console.log('tagNamesString', tagNamesString)
			let tagList = []
			if (tagNamesString) {
				try {
					tagList = tagNamesString.split(',').map((item) => {
						let temp = item.split('-')
						// console.log('temp', temp)
						return {
							refundId: temp[0] * 1,
							refundName: temp[1],
						}
					})
				} catch (error) {
					tagList = []
				}
			}
			return tagList
		},
		getTypeMap(typeValue) {
			// 7 8 5
			let type = ''
			switch (typeValue) {
				case 2:
					type = 'info'
					break
				case 5:
					type = 'success'
					break
				case 7:
					type = 'danger'
					break
				case 8:
					type = 'warning'
					break
			}
			return type
		},
		// 获取供应商列表
		// async initSupplierAccountOptions() {
		// 	const {
		// 		data: { resultData, resultCode },
		// 	} = await supplierAccountNumberList()
		// 	if (resultCode === 0) {
		// 		const targetArr = []
		// 		resultData.supplierAccountNumberList.flat()
		// 		resultData.supplierAccountNumberList.map((item) => {
		// 			targetArr.push({
		// 				supplierAccountNumberId: item.supplierAccountNumberId,
		// 				value: item.supplierName,
		// 			})
		// 		})
		// 		this.formCfg104.map((item) => {
		// 			if (item.dataIndex === 'supplierAccountNumberId') {
		// 				item.options.push(...targetArr)
		// 			}
		// 		})
		// 	}
		// },
		async getData108(flag) {
			this.loading = true
			let paramJson = this.findSearchParams108(flag)
			const {
				data: {
					resultCode,
					resultData: { organizationList = [], organizationCount = 0 },
				},
			} = await getOrganizationListByCondition(paramJson)
			if (resultCode == 0) {
				this.tableData108 = organizationList
				this.page108.count = organizationCount
				this.isShowTable = true
			}
			this.loading = false
		},
		findSearchParams108(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page108.currentPage = 1
			}
			const paramJson = Object.assign(this.formData107, {
				length: this.page108.length,
				startIndex: (this.page108.currentPage - 1) * this.page108.length,
			})
			return paramJson
		},
		async getData105(flag) {
			if (this.loading2) return
			this.loading2 = true
			let paramJson = this.findSearchParams105(flag)
			const {
				data: { resultCode, resultData },
			} = await getRefundOrderListByParam(paramJson)
			if (resultCode === 0) {
				if (resultData.refundMoneyAmount) {
					this.accountItems106[0].value =
						resultData.refundMoneyAmount.refundAmount
					this.accountItems106[1].value =
						resultData.refundMoneyAmount.costPriceAmount
					this.accountItems106[2].value =
						resultData.refundMoneyAmount.platformPriceAmount
					this.accountItems106[3].value =
						resultData.refundMoneyAmount.platformPriceAmount -
						resultData.refundMoneyAmount.costPriceAmount
				}
				resultData.refundList.forEach((item) => {
					item.tagList = this.getTagByTagNamesString(item.tagNames)
					// console.log('item.tagList', item.tagList)
				})
				this.tableData105 = resultData.refundList
				this.page105.count = resultData.count
			}
			this.loading2 = false
		},
		findSearchParams105(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page105.currentPage = 1
			}
			const paramJson = Object.assign(this.formData104, {
				length: this.page105.length,
				startIndex: (this.page105.currentPage - 1) * this.page105.length,
			})
			return paramJson
		},
		// 获取退款dialog中的退款单标签
		async initRefundTag() {
			const {
				data: { resultData, resultCode },
			} = await getRefundTag()
			if (resultCode == 0) {
				let targetArr = []
				if (
					resultData &&
					Object.prototype.hasOwnProperty.call(resultData, 'groupTagList') &&
					Array.isArray(resultData.groupTagList)
				) {
					targetArr = resultData.groupTagList.map((item) => {
						return {
							// refundTag: item.groupTagId,
							value: item.tagName,
							tagIdList: item.groupTagId, //为了配合YxForm做的数据格式转换
						}
					})
				}
				// console.log('targetArr', targetArr)
				let tagIdListItem = this.formCfg104.find((item) => {
					return item.title === '退款单标签' && item.dataIndex === 'tagIdList'
				})
				tagIdListItem && (tagIdListItem.options = targetArr)

				// console.log('a', a)
				this.tagIdList = targetArr
			}
		},
		// async _updaterefundbylist(refundList) {
		// 	if (this.loading) return
		// 	this.loading = true
		// 	const {
		// 		data: { resultCode, resultMsg },
		// 	} = await updaterefundbylist({
		// 		refundList,
		// 	})
		// 	if (resultCode === 0) {
		// 		this.$message.success(resultMsg)
		// 		this.getData105(true)
		// 	}
		// 	this.loading = false
		// },
		selectionChange(list) {
			this.checkedList = list
		},
	},
}
</script>
<style lang="scss" scope>
.refundTagCheckbox-title {
	margin-bottom: 25px;
}
.refundTagCheckbox-item {
	margin-bottom: 10px;
}
.mb-20 {
	margin-bottom: 20px;
}
</style>

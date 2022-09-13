<template>
	<div>
		<yx-form
			:inline="true"
			:items="searchCfg"
			:data="searchData"
			:formAction="searchAction"
		></yx-form
		><el-row>
			<yx-table
				:select="true"
				v-loading="showLoading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
				:selectionChange="selectionChange"
			>
				<template slot="orderSn" slot-scope="scope">
					<router-link
						v-if="getOrderDetailByOrderId"
						:to="`/business/orderDetails/${scope.row.orderId}`"
						><el-button type="text">{{
							scope.row.orderSn
						}}</el-button></router-link
					>
					<span v-else>{{ scope.row.orderSn }}</span>
				</template>
				<template slot="counts" slot-scope="scope">
					<el-link
						style="color: #1890ff"
						@click="compensationRecords(scope.row)"
						>{{ scope.row.counts }}</el-link
					>
				</template>
			</yx-table>
		</el-row>
		<!-- //补偿记录 -->
		<Dialog
			title="补偿记录"
			:visible="compensationDialog"
			width="50%"
			@before-close="compensationDialog = false"
		>
			<yx-table
				v-loading="compensationLoading"
				:columns="compensationTableColumns"
				:data="compensationTableData"
			>
			</yx-table>
		</Dialog>
		<!-- //编辑 -->
		<Dialog
			title="编辑"
			:visible="compileDialog"
			width="50%"
			@before-close="compileDialog = false"
		>
			<yx-form
				:inline="true"
				:items="compileformCfg"
				:data="compileformData"
				:formAction="compileformAction"
			>
				<template #couponName>
					<el-row>
						<el-col :span="20">
							<el-input
								v-model="compileformData.couponName"
								debounce
								placeholder="请在右侧按钮选择优惠卷"
								value-key="couponName"
								label="couponName"
								:fetch-suggestions="_getCmsSupplierListByCondition"
								@select="handleBrandName"
								@focus="formsDialog = true"
						/></el-col>
						<el-col :span="2">
							<el-button
								type="primary"
								icon="el-icon-more"
								@click="formsDialog = true"
							/>
						</el-col>
					</el-row>
				</template>
			</yx-form>
		</Dialog>
		<!-- //派发的弹框 -->
		<Dialog
			title="派发"
			:visible="successfulDialog"
			:bottomBtn="confirmCouponBottomBtn"
			width="50%"
			@before-close="successfulDialog = false"
		>
			<div>操作提示：是否确认补款{{ compensationAmountNumber }}元？</div>

			<yx-form
				:inline="true"
				:items="successfuformCfg"
				:data="successfuformData"
			>
				<template #refundRemark>
					<el-input
						v-model.trim="successfuformData.refundRemark"
						placeholder="非必填"
					></el-input>
					<span>（本说明将直接展示至用户，非特殊情况请勿填写)</span>
				</template>
			</yx-form>
		</Dialog>

		<!-- //查看的弹框 -->
		<Dialog
			title="查看信息"
			:visible="informationDialog"
			:bottomBtn="informationBottomBtn"
			width="50%"
			@before-close="informationDialog = false"
		>
			<div>姓名：{{ transferUserName }}</div>
			<div>银行卡号：{{ bankAccount }}</div>
		</Dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import {
	deleteCompensationAmountHJ,
	batchDistributeCompensationAmountHJ,
	findCompensationHJ,
} from '@/api/yhtplusCmsOrderCompensation'
import { checkFunctionCode } from '@/utils/auth'
import moment from 'moment'
export default {
	components: {
		YxForm,
		YxTable,
		Dialog,
	},
	name: 'FormTable',

	data() {
		return {
			getOrderDetailByOrderId: checkFunctionCode('getOrderDetailByOrderId'),
			showLoading: false,
			successfulDialog: false,
			addDisabled: false,
			formsDialog: false,
			idS: null,
			compensationAmountNumber: null,
			compensationDialog: false,
			informationDialog: false,
			compensationLoading: false,
			compileDialog: false,
			compensationTableData: [],
			selectionData: [],
			transferUserName: '',
			bankAccount: '',
			compileformData: {
				yxCouponCompensationId: '',
				yxCouponId: '',
				grantCount: '',
				quantity: '',
				couponName: '',
				organizationName: '',
			},
			successfuformData: {
				refundRemark: '',
			},
			successfuformCfg: [
				{
					type: 'custom',
					title: '入账详情',
					dataIndex: 'refundRemark',
				},
			],
			compileformCfg: [
				{
					type: 'input',
					title: '用户名称',
					dataIndex: 'organizationName',
					disabled: true,
				},
				{
					type: 'custom',
					dataIndex: 'couponName',
					title: '优惠卷名称',
				},
				{
					type: 'inputNumber',
					title: '数量',
					dataIndex: 'quantity',
				},
			],
			searchData: {
				trackingNum: '',
				weixinUserName: '',
				addTimeStart: moment().startOf('month').valueOf(),
				addTimeEnd: moment().endOf('month').valueOf(),
				compensationType: 2,
				compensationState: '1',
				orderSn: '',
				clerkName: '',
				organizationName: '',
				paymentStatus: '1',
			},
			searchCfg: [
				{
					type: 'select',
					dataIndex: 'compensationState',
					title: ' 派发状态',
					label: 'value',
					options: [
						{
							compensationState: '',
							value: '全部',
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
					dataIndex: 'paymentStatus',
					title: ' 打款状态：',
					label: 'value',
					options: [
						{
							paymentStatus: '',
							value: '全部',
						},
						{
							paymentStatus: '1',
							value: '待打款',
						},
						{
							paymentStatus: '2',
							value: ' 打款中',
						},
						{
							paymentStatus: '4',
							value: '打款失败',
						},
						{
							paymentStatus: '3',
							value: '打款成功',
						},
					],
				},
				{
					type: 'input',
					title: '操作人',
					dataIndex: 'clerkName',
					placeholder: '请输入操作人',
				},
				{
					type: 'input',
					title: '店主',
					dataIndex: 'organizationName',
					placeholder: '请输入店主',
				},
				{
					type: 'input',
					title: '订单号',
					dataIndex: 'orderSn',
					placeholder: '请输入订单号',
				},
				{
					type: 'input',
					title: '用户',
					dataIndex: 'weixinUserName',
					placeholder: '请输入用户',
				},
				{
					type: 'input',
					title: '客户退货物流单号',
					dataIndex: 'trackingNum',
					placeholder: '请输入客户退货物流单号',
				},
				{
					title: '添加时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['开始时间', '结束时间'],
				},
			],
			searchAction: [
				{
					title: '搜索',
					type: 'primary',
					click: () => {
						this.findCompensationHJ()
					},
				},
				{
					title: '批量派发',
					auth: 'batchDistributeCompensationAmountHJ',
					type: 'primary',
					click: () => {
						this.getSuccessfulDialog()
					},
				},
				{
					title: '批量删除',
					type: 'primary',
					auth: 'deleteCompensationAmountHJ',
					click: () => {
						let _this = this
						_this._messageDel()
					},
				},
			],
			confirmCouponBottomBtn: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.confirmCouponDistribution()
					},
				},
			],
			compileformAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.compileformConfirm()
					},
				},
			],
			tableData: [],
			compensationTableColumns: [
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					title: '补款金额',
					type: 'amount',
					dataIndex: 'compensationAmount',
				},
				{
					type: 'string',
					dataIndex: 'supplementType',
					title: '补款方式',
					customRender: (row) => {
						//1消费者 2店主
						if (row.supplementType == 1) {
							return '到消费者微信零钱'
						} else if (row.supplementType == 2) {
							return '到店主余额'
						} else if (row.supplementType == 3) {
							return '到消费者银行卡'
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
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'id',
					title: 'ID',
				},
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '关联订单号',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'string',
					dataIndex: 'userId',
					title: '用户ID',
				},
				{
					type: 'string',
					dataIndex: 'trackingNum',
					title: '客户退货物流单号',
				},
				{
					type: 'string',
					dataIndex: 'supplementType',
					title: '下单用户名称',
					customRender: (row) => {
						if (row.supplementType == 2) {
							return row.organizationUserName
						} else {
							return row.weixinUserName
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'organizationName',
					title: '下单店主名称',
				},
				{
					title: '补款金额',
					type: 'amount',
					dataIndex: 'compensationAmount',
				},
				{
					type: 'string',
					dataIndex: 'supplementType',
					title: '补款方式',
					customRender: (row) => {
						//1消费者 2店主
						if (row.supplementType == 1) {
							return '到消费者微信零钱'
						} else if (row.supplementType == 2) {
							return '到店主余额'
						} else if (row.supplementType == 3) {
							return '到消费者银行卡'
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
					dataIndex: 'operatorName',
					title: '操作人',
				},
				{
					type: 'string',
					dataIndex: 'distributeUserName',
					title: '派发人',
				},
				{
					type: 'string',
					dataIndex: 'compensationCounts',
					title: '补偿次数',
				},
				{
					type: 'custom',
					dataIndex: 'counts',
					title: '补偿记录',
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
				{
					type: 'string',
					dataIndex: 'paymentStatus',
					title: '打款状态',
					customRender: (row) => {
						if (row.paymentStatus == 1) {
							return '待打款'
						} else if (row.paymentStatus == 2) {
							return '打款中'
						} else if (row.paymentStatus == 3) {
							return '打款成功'
						} else {
							return '打款失败'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'paymentResp',
					title: '打款反馈',
				},
				{
					type: 'string',
					dataIndex: 'compensationTarget',
					title: '汇聚补款事由',
					customRender: (row) => {
						if (row.compensationTarget == 1) {
							return '运保卡赔付'
						} else if (row.compensationTarget == 2) {
							return '其它'
						} else {
							return ''
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'refundDesc',
					title: '补款说明',
					customRender: (row) => {
						if (row.refundDesc == 1) {
							return '商家承担'
						} else if (row.refundDesc == 2) {
							return '平台承担'
						} else {
							return ''
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'equityReceivedId',
					title: '是否购买运保卡',
					customRender: (row) => {
						if (row.equityReceivedId) {
							return '是'
						} else {
							return '否'
						}
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					fixed: 'right',
					actions: [
						{
							title: '删除',
							auth: 'deleteCompensationAmountHJ',
							click: (row) => {
								let _this = this
								_this._messageDel(row)
							},
							customRender: (action, row) => {
								let judge =
									row.compensationState == 1 &&
									(row.paymentStatus == 1 || row.paymentStatus == 4)
								action.hide = !judge
								return action
							},
						},
						{
							title: '派发',
							auth: 'batchDistributeCompensationAmountHJ',
							click: (row) => {
								this.getSuccessfulDialog(row)
							},
							customRender: (action, row) => {
								let judge =
									row.compensationState == 1 &&
									(row.paymentStatus == 1 || row.paymentStatus == 4)
								action.hide = !judge
								return action
							},
						},
						{
							title: '查看收款信息',
							click: (row) => {
								this.viewInformation(row)
							},
						},
					],
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.findCompensationHJ()
				},
			},
		}
	},

	created() {
		// this.findCompensationHJ()
	},

	methods: {
		viewInformation(row) {
			this.informationDialog = true
			this.transferUserName = row.transferUserName
			this.bankAccount = row.bankAccount
		},
		// 多选
		selectionChange(row) {
			this.selectionData = row
		},
		getSuccessfulDialog(row) {
			if (row) {
				this.idS = [row.id]
				this.compensationAmountNumber = row.compensationAmount
			} else {
				let compensationAmount = 0
				let ids = []
				for (let i = this.selectionData.length - 1; i >= 0; i--) {
					if (this.selectionData[i].compensationState == 1) {
						compensationAmount += this.selectionData[i].compensationAmount
						ids.push(this.selectionData[i].id)
					}
				}
				if (ids.length == 0 || !this.selectionData.length) {
					return this.$message.warning('请选择可操作的待补款记录')
				}
				this.idS = ids
				this.compensationAmountNumber = compensationAmount
			}
			this.successfulDialog = true
		},
		//派发
		confirmCouponDistribution: async function () {
			let paramJson
			paramJson = {
				yxCompensationAmountIdList: this.idS,
			}
			paramJson.refundRemark = this.successfuformData.refundRemark

			let {
				data: { resultCode, resultMsg },
			} = await batchDistributeCompensationAmountHJ(paramJson)
			if (resultCode == 0) {
				this.successfulDialog = false
				if (resultMsg == '成功') {
					this.$message.success('成功')
				} else {
					this.$message.warning(resultMsg)
				}
				this.findCompensationHJ()
			}
		},
		//删除
		_messageDel: async function (row) {
			let paramJson
			let _this = this
			let confirmMsg = ''
			if (row) {
				paramJson = {
					yxCompensationAmountIdList: [row.id],
				}
				confirmMsg = '确定删除？'
			} else {
				let ids = []
				_this.selectionData.map((item) => {
					if (item.compensationState == 1) {
						ids.push(item.id)
					}
				})
				paramJson = {
					yxCompensationAmountIdList: ids,
				}
				if (
					paramJson.yxCompensationAmountIdList.length == 0 ||
					!_this.selectionData.length
				) {
					return _this.$message.warning('请选择可操作的待补款记录')
				}
				confirmMsg =
					'是否批量删除' +
					paramJson.yxCompensationAmountIdList.length +
					'个待补款记录?'
			}

			_this.$confirm(confirmMsg, '提示', {
				type: 'warning',
				async callback(action) {
					if (action === 'confirm') {
						let {
							data: { resultCode },
						} = await deleteCompensationAmountHJ(paramJson)
						if (resultCode == 0) {
							_this.$message.success('删除成功')
							_this.findCompensationHJ()
						}
					}
				},
			})
		},
		//待补偿记录
		compensationRecords(row) {
			this.compensationDialog = true
			this.compensationLoading = true
			this.findCompensationHJ(row)
		},
		// 搜索条件
		findSearchParams(flag) {
			if (flag) {
				this.page.currentPage = 1
			}
			let paramJson = Object.assign(this.searchData, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始

			return paramJson
		},
		//列表渲染
		findCompensationHJ: async function (row) {
			let paramJson = this.findSearchParams()
			if (row) {
				paramJson.orderId = row.orderId
			} else {
				this.showLoading = true
			}

			let {
				data: { resultCode, resultData },
			} = await findCompensationHJ(paramJson)
			if (resultCode == 0) {
				if (row) {
					this.compensationLoading = false
					this.compensationTableData =
						resultData && resultData.yxCompensationList
							? resultData.yxCompensationList
							: []
				} else {
					this.showLoading = false
					this.tableData =
						resultData && resultData.yxCompensationList
							? resultData.yxCompensationList
							: []
					this.page.count =
						resultData && resultData.count ? resultData.count : 0
				}
			} else {
				this.tableData = []
				this.page.count = 0
			}
		},
	},
}
</script>

<style>
.mb20 {
	margin-bottom: 20px;
}
</style>

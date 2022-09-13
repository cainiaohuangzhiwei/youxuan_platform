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
				<template slot="takeAmount" slot-scope="scope">
					<span style="color: #ff0000">{{
						scope.row.supplierCompensationAmount
					}}</span>
					/
					<span style="color: #00cc00">{{
						scope.row.platformCompensationAmount
					}}</span>
				</template>
				<template slot="imageUrlList" slot-scope="scope">
					<el-button
						v-if="scope.row.imageUrlList && scope.row.imageUrlList.length > 0"
						class="list-start-btn"
						type="text"
						@click="lookMasterMap(scope.row.imageUrlList)"
						>查看图片</el-button
					>
				</template>
			</yx-table>
		</el-row>
		<!-- //补偿记录 -->
		<Dialog
			title="打款记录"
			:visible="compensationDialog"
			width="50%"
			@before-close="compensationDialog = false"
		>
			<yx-table
				v-loading="compensationLoading"
				:columns="compensationTableColumns"
				:data="compensationTableData"
			>
				<template slot="takeAmount" slot-scope="scope">
					<span style="color: #ff0000">{{
						scope.row.supplierCompensationAmount
					}}</span>
					/
					<span style="color: #00cc00">{{
						scope.row.platformCompensationAmount
					}}</span>
				</template>
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
			<div>操作提示：是否确认打款{{ compensationAmountNumber }}元？</div>

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
		<!-- 查看图片 -->
		<el-dialog
			:visible.sync="isShowLookImgDialog"
			class="examine"
			width="500px"
			title=""
		>
			<div class="goods_img_list">
				<div v-for="item in imageUrlList" :key="item.imageId">
					<div class="goods_img_list_warp">
						<el-image
							class=""
							fit="cover"
							:preview-src-list="[getBigImg(item)]"
							:src="getBigImg(item)"
						>
							<div slot="error" class="el-image__error">
								<i class="el-icon-picture-outline"></i>
							</div>
						</el-image>
					</div>
				</div>
			</div>
			<span slot="footer" class="dialog-footer"> </span>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import { getBigImg } from '@/utils/imageTool'
import { downloadFile, numberFormat } from '@/utils/helper/common'
import {
	subsidyQueryPage,
	subsidyDelete,
	subsidyExport,
	subsidyBatchDistribute,
	subsidyQueryApplyResult,
} from '@/api/yxCompensationAmount'
import { batchDistributeCompensationAmount } from '@/api/yhtplusCmsOrderCompensation'

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
			numberFormat,
			getBigImg,
			getOrderDetailByOrderId: checkFunctionCode('getOrderDetailByOrderId'),
			showLoading: false,
			successfulDialog: false,
			addDisabled: false,
			formsDialog: false,
			idS: null,
			rowObj: {},
			compensationAmountNumber: null,
			compensationDialog: false,
			compensationLoading: false,
			compileDialog: false,
			isShowLookImgDialog: false,
			compensationTableData: [],
			selectionData: [],
			imageUrlList: [],
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
				distributeWay: '',
				transactionSn: '',
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
						{
							compensationState: '3',
							value: '派发中',
						},
					],
				},
				{
					type: 'select',
					dataIndex: 'distributeWay',
					title: ' 派发方式',
					label: 'value',
					options: [
						{
							distributeWay: '',
							value: '全部',
						},
						{
							distributeWay: '0',
							value: '微信零钱',
						},
						{
							distributeWay: '1',
							value: '银行卡',
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
					type: 'input',
					title: '交易单号',
					dataIndex: 'transactionSn',
					placeholder: '请输入交易单号',
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
						this.subsidyQueryPage()
					},
				},
				{
					title: '批量派发',
					auth: 'batchDistributeCompensationAmount',
					type: 'primary',
					click: () => {
						this.getSuccessfulDialog()
					},
				},
				{
					title: '批量删除',
					type: 'primary',
					auth: 'deleteCompensationAmount',
					click: () => {
						let _this = this
						_this._messageDel()
					},
				},
				{
					title: '导出',
					type: 'primary',
					auth: 'exportCompensationAmount',
					click: () => {
						this.exportCouponCompensationByCondition()
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
					type: 'custom',
					dataIndex: 'takeAmount',
					title: '商家承担金额/平台承担金额',
				},
				{
					type: 'string',
					dataIndex: 'supplementType',
					title: '打款方式',
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
					dataIndex: 'compensationPlatformType',
					title: '派发方',
					customRender: (row) => {
						if (row.compensationPlatformType == 8) {
							return '商家发起'
						} else if (row.compensationPlatformType == 4) {
							return '平台发起'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'compensationState',
					title: '派发状态',
					customRender: (row) => {
						if (row.compensationState == 1) {
							return '未派发'
						} else if (row.compensationState == 2) {
							return '已派发'
						} else {
							return '派发中'
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
					title: '打款金额',
					type: 'string',
					dataIndex: 'compensationAmount',
				},
				{
					type: 'custom',
					dataIndex: 'takeAmount',
					title: '商家承担金额/平台承担金额',
				},
				{
					type: 'string',
					dataIndex: 'supplementType',
					title: '打款方式',
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
					dataIndex: 'childRemark',
					title: '补款原因分类',
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
					title: '打款次数',
				},

				{
					type: 'custom',
					dataIndex: 'imageUrlList',
					title: '图片',
				},
				{
					type: 'custom',
					dataIndex: 'counts',
					title: '打款记录',
				},
				{
					type: 'string',
					dataIndex: 'compensationState',
					title: '派发状态',
					customRender: (row) => {
						if (row.compensationState == 1) {
							return '未派发'
						} else if (row.compensationState == 2) {
							return '已派发'
						} else {
							return '派发中'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'refundDesc',
					title: '打款说明',
					customRender: (row) => {
						if (row.refundDesc == 1) {
							return '商家承担'
						} else if (row.refundDesc == 2) {
							return '平台承担'
						} else {
							return '共同承担'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'transactionSn',
					title: '关联交易流水号',
				},
				{
					type: 'string',
					dataIndex: 'distributeWay',
					title: '派发方式',
					customRender: (row) => {
						if (row.distributeWay == 0) {
							return '微信零钱'
						} else {
							return '银行卡'
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
					auth: 'editCouponCompensation',
					width: '150',
					fixed: 'right',
					actions: [
						{
							title: '删除',
							auth: 'deleteCompensationAmount',
							click: (row) => {
								let _this = this
								_this._messageDel(row)
							},
							customRender: (action, row) => {
								action.hide = row.compensationState != 1
								return action
							},
						},
						{
							title: '派发',
							auth: 'batchDistributeCompensationAmount',
							click: (row) => {
								this.getSuccessfulDialog(row)
							},
							customRender: (action, row) => {
								action.hide = row.compensationState != 1
								return action
							},
						},
						{
							title: '查询打款',
							auth: 'queryApplyResult', //queryApplyResult
							click: (row) => {
								this.getQueryApplyResult(row)
							},
							customRender: (action, row) => {
								action.hide = row.compensationState != 3
								return action
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
					this.subsidyQueryPage()
				},
			},
		}
	},

	created() {
		// this.subsidyQueryPage()
	},

	methods: {
		// 查看图片
		lookMasterMap(urlList) {
			this.imageUrlList = urlList
			this.isShowLookImgDialog = true
		},
		getQueryApplyResult: async function (row) {
			let {
				data: { resultCode, resultMsg },
			} = await subsidyQueryApplyResult({
				yxCompensationAmountIdList: [row.id],
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
			}
		},
		// 多选
		selectionChange(row) {
			this.selectionData = row
		},
		//导出
		exportCouponCompensationByCondition: async function () {
			let paramJson = Object.assign({}, this.searchData)
			paramJson.groupId = this.$store.state.user.userInfo.groupId
			let { data } = await subsidyExport(paramJson)
			console.log(data)

			downloadFile(data, '待打款信息表.xlsx')
		},
		getSuccessfulDialog(row) {
			this.rowObj = row
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
					return this.$message.warning('请选择可操作的待打款记录')
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
			let Url =
				this.rowObj &&
				this.rowObj.platformCompensationAmount == 0 &&
				this.rowObj.supplierCompensationAmount == 0
					? batchDistributeCompensationAmount
					: subsidyBatchDistribute
			let {
				data: { resultCode },
			} = await Url(paramJson)
			if (resultCode == 0) {
				this.successfulDialog = false
				this.$message.success('成功')
				this.subsidyQueryPage()
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
					return _this.$message.warning('请选择可操作的待打款记录')
				}
				confirmMsg =
					'是否批量删除' +
					paramJson.yxCompensationAmountIdList.length +
					'个待打款记录?'
			}

			_this.$confirm(confirmMsg, '提示', {
				type: 'warning',
				async callback(action) {
					if (action === 'confirm') {
						let {
							data: { resultCode },
						} = await subsidyDelete(paramJson)
						if (resultCode == 0) {
							_this.$message.success('删除成功')
							_this.subsidyQueryPage()
						}
					}
				},
			})
		},
		//待补偿记录
		compensationRecords(row) {
			this.compensationDialog = true
			this.compensationLoading = true
			this.subsidyQueryPage(row)
		},
		// 搜索条件
		findSearchParams(flag) {
			if (flag) {
				this.page.currentPage = 1
			}
			let paramJson = {
				...this.searchData,
				pageNum: 1,
				pageSize: 10,
			}
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			// 当前页的条数开始
			paramJson.pageNum = this.page.currentPage
			return paramJson
		},
		//列表渲染
		subsidyQueryPage: async function (row) {
			let paramJson = this.findSearchParams()
			if (row) {
				paramJson.orderId = row.orderId
				paramJson.queryType = 2
			} else {
				this.showLoading = true
			}

			let {
				data: { resultCode, resultData },
			} = await subsidyQueryPage(paramJson)
			if (resultCode == 0) {
				if (row) {
					this.compensationLoading = false
					this.compensationTableData =
						resultData && resultData.records ? resultData.records : []
				} else {
					this.showLoading = false
					this.tableData =
						resultData && resultData.records ? resultData.records : []
					this.page.count =
						resultData && resultData.total ? resultData.total : 0
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
.examine .el-dialog {
	overflow-y: hidden;
}
.examine .el-dialog .el-dialog__header {
	padding-bottom: 0px;
	height: 50px;
}
</style>

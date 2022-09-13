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
					<!-- @click="skipDetails(scope.row)" -->
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
		<!-- //派发成功后的弹框 -->
		<Dialog
			title="派发成功"
			:visible="successfulDialog"
			width="50%"
			:bottomBtn="successfulBottomBtn"
			@before-close="successfulDialog = false"
		>
			<div>{{ successfulMsg }}</div>
		</Dialog>

		<!-- 商家列表 -->
		<coupon-dialog
			:itemInfo="supplyRow"
			:visible.sync="formsDialog"
			@fatherMethodInit="
				(row) => {
					compileformData.couponName = row.couponName
					compileformData.yxCouponId = row.yxCouponId
					compileformData.grantCount = row.grantCount
				}
			"
		/>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import CouponDialog from './CouponDialog'
import {
	findCouponCompensationByCondition,
	editCouponCompensation,
	delCouponCompensation,
	distributeCouponCompensation,
	exportCouponCompensationByCondition,
} from '@/api/yhtPlusCoupon'
import { downloadFile } from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth'
import moment from 'moment'
export default {
	components: {
		YxForm,
		YxTable,
		CouponDialog,
		Dialog,
	},
	name: 'FormTable',

	data() {
		return {
			getOrderDetailByOrderId: checkFunctionCode('getOrderDetailByOrderId'),
			showLoading: false,
			successfulMsg: null,
			successfulDialog: false,
			addDisabled: false,
			formsDialog: false,
			compensationDialog: false,
			compensationLoading: false,
			compileDialog: false,
			compensationTableData: [],
			selectionData: [],

			compileformData: {
				yxCouponCompensationId: '',
				yxCouponId: '',
				grantCount: '',
				quantity: '',
				couponName: '',
				organizationName: '',
			},
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
				couponName: '',
				weixinUserName: '',
				addTimeStart: moment().startOf('month').valueOf(),
				addTimeEnd: moment().endOf('month').valueOf(),
				compensationType: 1,
				compensationState: '1',
				orderSn: '',
				clerkName: '',
				organizationName: '',
			},
			successfulBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.successfulDialog = false
						this.findCouponCompensationByCondition()
					},
				},
			],
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
					title: '优惠卷',
					dataIndex: 'couponName',
					placeholder: '请输入优惠卷',
				},
				{
					type: 'input',
					title: '用户',
					dataIndex: 'weixinUserName',
					placeholder: '请输入用户',
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
						this.findCouponCompensationByCondition()
					},
				},
				{
					title: '批量派发',
					auth: 'distributeCouponCompensation',
					type: 'primary',
					click: () => {
						let _this = this
						_this.confirmCouponDistribution()
					},
				},
				{
					title: '批量删除',
					type: 'primary',
					auth: 'delCouponCompensation',
					click: () => {
						let _this = this
						_this._messageDel()
					},
				},
				{
					title: '导出',
					auth: 'exportCouponCompensationByCondition',
					type: 'primary',
					click: () => {
						this.exportCouponCompensationByCondition()
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
					type: 'string',
					dataIndex: 'couponName',
					title: '补偿优惠券',
				},
				{
					type: 'string',
					dataIndex: 'scope',
					title: '用户类型',
					customRender: (row) => {
						//1消费者 2店主 3消费者&店主
						if (row.scope == 1) {
							return '消费者'
						} else if (row.scope == 2) {
							return '店主'
						} else if (row.scope == 3) {
							return '消费者&店主'
						} else if (row.scope == 4) {
							return '店主'
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
					dataIndex: 'yxCouponCompensationId',
					title: 'id',
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
					dataIndex: 'weixinUserName',
					title: '下单用户名称',
					customRender: (row) => {
						if (row.scope == 2 || row.scope == 4) {
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
					customRender: (row) => {
						if (row.scope != 4) {
							return row.organizationName
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'couponName',
					title: '补偿优惠券',
				},
				{
					type: 'string',
					dataIndex: 'quantity',
					title: '补偿数量',
				},
				{
					type: 'string',
					dataIndex: 'scope',
					title: '用户类型',
					customRender: (row) => {
						//1消费者 2店主 3消费者&店主
						if (row.scope == 1) {
							return '消费者'
						} else if (row.scope == 2) {
							return '店主'
						} else if (row.scope == 3) {
							return '消费者&店主'
						} else if (row.scope == 4) {
							return '店主'
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
					type: 'action',
					title: '操作',
					auth: 'editCouponCompensation',
					width: '150',
					fixed: 'right',
					actions: [
						{
							title: '编辑',
							auth: 'editCouponCompensation',
							click: (row) => {
								this.editContentClick(row)
							},
							customRender: (action, row) => {
								action.hide = row.compensationState != 1
								return action
							},
						},
						{
							title: '删除',
							auth: 'delCouponCompensation',
							click: (row) => {
								let _this = this
								_this.$confirm('确定删除？', '提示', {
									type: 'warning',
									async callback(action) {
										if (action === 'confirm') {
											_this._messageDel(row)
										}
									},
								})
							},
							customRender: (action, row) => {
								action.hide = row.compensationState != 1
								return action
							},
						},
						{
							title: '派发',
							auth: 'distributeCouponCompensation',
							click: (row) => {
								let _this = this
								_this.$confirm(
									'是否确认派发优惠券？' +
										'用户名称:' +
										row.organizationName +
										' 补偿优惠券:' +
										row.couponName +
										'数量:' +
										row.quantity,
									'提示',
									{
										type: 'warning',
										async callback(action) {
											if (action === 'confirm') {
												_this.confirmCouponDistribution(row)
											}
										},
									}
								)
							},
							customRender: (action, row) => {
								action.hide = row.compensationState != 1
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
					this.findCouponCompensationByCondition()
				},
			},
		}
	},

	created() {
		this.findCouponCompensationByCondition()
	},

	methods: {
		skipDetails(row) {
			this.$router.push({
				path: `/business/orderDetails/${row.orderId}`,
			})
		},
		// 多选
		selectionChange(row) {
			this.selectionData = row
		},
		//导出
		exportCouponCompensationByCondition: async function () {
			let paramJson = Object.assign({}, this.searchData)
			paramJson.groupId = this.$store.state.user.userInfo.groupId
			let { data } = await exportCouponCompensationByCondition(paramJson)
			downloadFile(data, '待补偿优惠券信息表.xlsx')
		},
		//派发
		confirmCouponDistribution: async function (row) {
			let _this = this
			let paramJson
			let confirmMsg = ''
			if (row) {
				paramJson = {
					yxCouponCompensationIdList: [row.yxCouponCompensationId],
				}
				confirmMsg =
					'是否确认派发优惠券？' +
					'用户名称:' +
					row.organizationName +
					' 补偿优惠券:' +
					row.couponName +
					'数量:' +
					row.quantity
			} else {
				let ids = []
				_this.selectionData.forEach((item) => {
					if (item.compensationState == 1) {
						ids.push(item.yxCouponCompensationId)
					}
				})
				paramJson = {
					yxCouponCompensationIdList: ids,
				}
				if (
					paramJson.yxCouponCompensationIdList.length == 0 ||
					!_this.selectionData.length
				) {
					return _this.$message.warning('请选择可操作的待发放优惠券记录')
				}
				confirmMsg =
					'是否批量派发' +
					paramJson.yxCouponCompensationIdList.length +
					'个待发放优惠券记录?'
			}

			_this.$confirm(confirmMsg, '提示', {
				type: 'warning',
				async callback(action) {
					if (action === 'confirm') {
						let {
							data: { resultCode, msg, resultMsg },
						} = await distributeCouponCompensation(paramJson)
						if (resultCode == 0) {
							_this.successfulDialog = true
							_this.successfulMsg = msg ? msg : resultMsg
						}
					}
				},
			})
		},
		//删除
		_messageDel: async function (row) {
			let _this = this
			let paramJson
			let confirmMsg = ''
			if (row) {
				paramJson = {
					yxCouponCompensationIdList: [row.yxCouponCompensationId],
				}
				confirmMsg = '确定删除？'
			} else {
				let ids = []
				_this.selectionData.forEach((item) => {
					if (item.compensationState == 1) {
						ids.push(item.yxCouponCompensationId)
					}
				})
				paramJson = {
					yxCouponCompensationIdList: ids,
				}
				if (
					paramJson.yxCouponCompensationIdList.length == 0 ||
					!_this.selectionData.length
				) {
					return _this.$message.warning('请选择可操作的待发放优惠券记录')
				}
				confirmMsg =
					'是否批量删除' +
					paramJson.yxCouponCompensationIdList.length +
					'个待发放优惠券记录?'
			}

			_this.$confirm(confirmMsg, '提示', {
				type: 'warning',
				async callback(action) {
					if (action === 'confirm') {
						let {
							data: { resultCode },
						} = await delCouponCompensation(paramJson)
						if (resultCode == 0) {
							_this.$message.success('删除成功')
							_this.findCouponCompensationByCondition()
						}
					}
				},
			})
		},
		// 操作优惠卷
		handleBrandName(item) {
			this.compileformData.couponName = item.couponName
			this.compileformData.yxCouponId = item.yxCouponId
			this.compileformData.grantCount = item.grantCount
		},
		compileformConfirm: async function () {
			let paramJson = this.compileformData
			let {
				data: { resultCode },
			} = await editCouponCompensation(paramJson)
			if (resultCode == 0) {
				this.$message.success('编辑成功')
				this.compileDialog = false
				this.findCouponCompensationByCondition()
			}
		},
		//编弹框 &&回显
		editContentClick(row) {
			this.compileDialog = true
			this.compileformData.yxCouponId = row.yxCouponId
			this.compileformData.grantCount = row.grantCount
			this.compileformData.couponName = row.couponName
			this.compileformData.quantity = row.quantity
			this.compileformData.organizationName = row.organizationName
			this.compileformData.yxCouponCompensationId = row.yxCouponCompensationId
		},
		//待补偿记录
		compensationRecords(row) {
			this.compensationDialog = true
			this.compensationLoading = true
			this.findCouponCompensationByCondition(row)
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
		findCouponCompensationByCondition: async function (row) {
			let paramJson
			if (row) {
				paramJson = {
					orderId: row.orderId,
				}
			} else {
				paramJson = this.findSearchParams()
				this.showLoading = true
			}
			let {
				data: { resultCode, resultData },
			} = await findCouponCompensationByCondition(paramJson)
			if (resultCode == 0) {
				if (row) {
					this.compensationLoading = false
					this.compensationTableData =
						resultData && resultData.yxCouponCompensationList
							? resultData.yxCouponCompensationList
							: []
				} else {
					this.showLoading = false
					this.tableData =
						resultData && resultData.yxCouponCompensationList
							? resultData.yxCouponCompensationList
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

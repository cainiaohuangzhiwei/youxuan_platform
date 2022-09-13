<template>
	<div>
		<yx-form
			:inline="true"
			:items="searchCfg"
			:data="searchData"
			:formAction="searchAction"
		>
			<template #supplierName>
				<el-input
					v-model="searchData.supplierName"
					placeholder="请选择商家"
					value-key="supplierId"
					label="supplierName"
					@focus="selectSupplier"
					clearable
					@clear="
						() => {
							searchData.supplierId = ''
							searchData.supplierName = ''
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

		<supply-dialog
			:itemInfo="supplierRow"
			chooseType="checkbox"
			:visible.sync="supplyDialogVisible"
			@fatherMethodInit="
				(row) => {
					searchData.supplierId = row.supplierId
					searchData.supplierName = row.supplierName
					if (!this.loading) this.supplierSubsidyQueryPage(true)
				}
			"
		/>
		<el-row>
			<yx-table
				:select="true"
				v-loading="showLoading"
				:columns="tableColumns"
				:pagination="supplierPage"
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
			title="补款记录"
			:visible="compensationDialog"
			width="50%"
			@before-close="compensationDialog = false"
		>
			<yx-table
				v-loading="compensationLoading"
				:columns="compensationTableColumns"
				:data="compensationTableData"
				:pagination="page"
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
import { subsidyQueryPage } from '@/api/yxCompensationAmount'
import {
	supplierCompensationAmountList,
	batchDistribute,
	supplierDelete,
	supplierExport,
} from '@/api/supplyAmount'
import SupplyDialog from '@/components/SupplyDialog'
import { checkFunctionCode } from '@/utils/auth'
import moment from 'moment'
export default {
	components: {
		YxForm,
		YxTable,
		Dialog,
		SupplyDialog,
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
			supplyDialogVisible: false,
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
			supplierRow: {},
			searchData: {
				addTimeStart: moment().startOf('month').valueOf(),
				addTimeEnd: moment().endOf('month').valueOf(),
				compensationState: '',
				distributeWay: '',
				remarkType: '',
				isDelete: 0,
				distributePlatformType: '',
				supplierId: '',
				supplierName: '',
				platformType: 4,
			},
			searchCfg: [
				{
					type: 'inputNumber',
					title: '补款ID',
					dataIndex: 'id',
					placeholder: '请输入补款ID',
				},
				{
					type: 'input',
					title: '订单编号',
					dataIndex: 'orderSn',
					placeholder: '请输入订单编号',
				},
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
							compensationState: 1,
							value: '未派发',
						},
						{
							compensationState: 2,
							value: '已派发',
						},
						{
							compensationState: 3,
							value: '派发中',
						},
						{
							compensationState: 4,
							value: '派发失败',
						},
					],
				},
				{
					type: 'custom',
					title: '商家名称',
					dataIndex: 'supplierName',
					placeholder: '请输入商家名称',
				},
				{
					type: 'input',
					title: '操作人',
					dataIndex: 'operatorName',
					placeholder: '请输入操作人',
				},
				{
					title: '添加时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					type: 'select',
					dataIndex: 'isDelete',
					title: '数据状态',
					label: 'value',
					options: [
						{
							isDelete: '',
							value: '全部',
						},
						{
							isDelete: 1,
							value: '已删除',
						},
						{
							isDelete: 0,
							value: '正常',
						},
					],
				},
				{
					type: 'select',
					dataIndex: 'remarkType',
					title: '补款原因',
					label: 'value',
					options: [
						{
							remarkType: '',
							value: '全部',
						},
						{
							remarkType: 9,
							value: '退货运费',
						},
						{
							remarkType: 10,
							value: '质量问题',
						},
						{
							remarkType: 13,
							value: '错发补款',
						},
						{
							remarkType: 19,
							value: '破损补款',
						},
						{
							remarkType: 20,
							value: '未按约定时间发货',
						},
					],
				},
				{
					type: 'select',
					dataIndex: 'distributePlatformType',
					title: ' 派发方',
					label: 'value',
					options: [
						{
							distributePlatformType: '',
							value: '全部',
						},
						{
							distributePlatformType: 4,
							value: '平台',
						},
						{
							distributePlatformType: 8,
							value: '商家',
						},
					],
				},
			],
			searchAction: [
				{
					title: '搜索',
					type: 'primary',
					click: () => {
						this.supplierSubsidyQueryPage(true)
					},
				},
				{
					title: '批量派发',
					auth: 'supplierCompensationAmountBatchDistribute',
					type: 'primary',
					click: () => {
						this.getSuccessfulDialog()
					},
				},
				{
					title: '批量删除',
					type: 'primary',
					auth: 'supplierCompensationAmountDelete',
					click: () => {
						let _this = this
						_this._messageDel()
					},
				},
				{
					title: '导出',
					type: 'primary',
					auth: 'supplierCompensationAmountExport',
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
					type: 'string',
					dataIndex: 'id',
					title: '补款ID',
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
					dataIndex: 'compensationPlatformType',
					title: '发起方',
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
					type: 'newMap',
					dataIndex: 'compensationState',
					title: '派发状态',
					options: [
						['1', '未派发'],
						['2', '已派发'],
						['3', '派发中'],
						['4', '派发失败'],
					],
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
			],
			tableColumns: [
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '关联订单号',
				},
				{
					type: 'string',
					dataIndex: 'id',
					title: '补款ID',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'amount',
					dataIndex: 'supplierCompensationAmount',
					title: '补款金额',
				},
				{
					type: 'string',
					dataIndex: 'compensationCounts',
					title: '补款次数',
				},
				{
					type: 'custom',
					dataIndex: 'counts',
					title: '补款记录',
				},
				{
					type: 'newMap',
					dataIndex: 'remarkType',
					title: '补款原因',
					options: [
						['9', '退货运费'],
						['10', '质量问题'],
						['13', '错发补款'],
						['19', '破损补款'],
						['20', '未按约定时间发货'],
					],
				},
				{
					type: 'newMap',
					dataIndex: 'compensationState',
					title: '派发状态',
					options: [
						['1', '未派发'],
						['2', '已派发'],
						['3', '派发中'],
						['4', '派发失败'],
					],
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
				{
					type: 'custom',
					dataIndex: 'imageUrlList',
					title: '图片',
				},
				{
					type: 'string',
					dataIndex: 'operatorName',
					title: '操作人',
				},
				{
					type: 'newMap',
					dataIndex: 'distributePlatformType',
					title: '派发方',
					options: [
						['4', '平台'],
						['8', '商家'],
					],
				},
				{
					type: 'string',
					dataIndex: 'distributeUserName',
					title: '派发人/删除人',
					customRender: (row) =>
						row.isDelete ? row.deleterName : row.distributeUserName,
				},
				{
					type: 'newMap',
					dataIndex: 'isDelete',
					title: '数据状态',
					options: [
						['1', '删除'],
						['0', '正常'],
					],
				},
				{
					title: '添加时间',
					type: 'date',
					dataIndex: 'addTime',
				},
				{
					title: '派发时间/删除时间',
					type: 'string',
					dataIndex: 'compensationTime',
					customRender: (row) => {
						let _time
						if (row.isDelete) {
							_time = row.deleteTime
						} else {
							_time = row.compensationTime
						}
						return _time
							? moment(Number(_time)).format('YYYY-MM-DD HH:mm:ss')
							: '-'
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
							auth: 'supplierCompensationAmountDelete',
							click: (row) => {
								let _this = this
								_this._messageDel(row)
							},
							customRender: (action, row) => {
								action.hide =
									row.compensationState == 2 ||
									row.compensationState == 3 ||
									row.isDelete == 1
								return action
							},
						},
						{
							title: '派发',
							auth: 'supplierCompensationAmountBatchDistribute',
							click: (row) => {
								this.getSuccessfulDialog(row)
							},
							customRender: (action, row) => {
								action.hide =
									row.compensationState == 2 ||
									row.compensationState == 3 ||
									row.isDelete == 1
								return action
							},
						},
						{
							title: '查看失败原因',
							click: (row) => {
								this.$message.info(row.failReason)
							},
							customRender: (action, row) => {
								action.hide = row.compensationState != 4 || row.isDelete == 1
								return action
							},
						},
					],
				},
			],
			supplierPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.supplierSubsidyQueryPage()
				},
			},
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.supplierSubsidyQueryPage()
				},
			},
		}
	},

	created() {
		this.supplierSubsidyQueryPage()
	},

	methods: {
		selectSupplier(e) {
			e.target.blur()
			this.supplyDialogVisible = true
		},
		// 查看图片
		lookMasterMap(urlList) {
			this.imageUrlList = urlList
			this.isShowLookImgDialog = true
		},
		// 多选
		selectionChange(row) {
			this.selectionData = row
		},
		//导出
		exportCouponCompensationByCondition: async function () {
			if (this.searchData.id && !/^[0-9]*$/.test(this.searchData.id)) {
				return this.$message.error('补款ID数据格式不对')
			}
			let paramJson = Object.assign({}, this.searchData)
			paramJson.groupId = this.$store.state.user.userInfo.groupId
			let { data } = await supplierExport(paramJson)
			downloadFile(data, '补款信息表.xlsx')
		},
		getSuccessfulDialog(row) {
			if (row) {
				this.idS = [row.id]
				this.compensationAmountNumber = row.supplierCompensationAmount
			} else {
				let compensationAmount = 0
				let ids = []
				for (let i = this.selectionData.length - 1; i >= 0; i--) {
					if (
						!this.selectionData[i].isDelete &&
						(this.selectionData[i].compensationState == 1 ||
							this.selectionData[i].compensationState == 4)
					) {
						compensationAmount +=
							this.selectionData[i].supplierCompensationAmount
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
			const paramJson = {
				compensationAmountIdList: this.idS,
				platformType: 4,
				refundRemark: this.successfuformData.refundRemark,
			}
			let {
				data: { resultCode },
			} = await batchDistribute(paramJson)
			if (resultCode == 0) {
				this.successfuformData.refundRemark = ''
				this.successfulDialog = false
				this.$message.success('成功')
				this.supplierSubsidyQueryPage()
			}
		},
		//删除
		_messageDel: async function (row) {
			let paramJson
			let _this = this
			let confirmMsg = ''
			if (row) {
				paramJson = {
					compensationAmountIdList: [row.id],
				}
				confirmMsg = '确定删除？'
			} else {
				let ids = []
				_this.selectionData.map((item) => {
					if (
						!item.isDelete &&
						(item.compensationState == 1 || item.compensationState == 4)
					) {
						ids.push(item.id)
					}
				})
				paramJson = {
					compensationAmountIdList: ids,
				}
				if (
					paramJson.compensationAmountIdList.length == 0 ||
					!_this.selectionData.length
				) {
					return _this.$message.warning('请选择可操作的补款记录')
				}
				confirmMsg =
					'是否批量删除' +
					paramJson.compensationAmountIdList.length +
					'个补款记录?'
			}

			_this.$confirm(confirmMsg, '提示', {
				type: 'warning',
				async callback(action) {
					if (action === 'confirm') {
						let {
							data: { resultCode },
						} = await supplierDelete(paramJson)
						if (resultCode == 0) {
							_this.$message.success('删除成功')
							_this.supplierSubsidyQueryPage()
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
		findSupplierSearchParams(flag) {
			let paramJson = Object.assign(this.searchData, {
				pageNum: 1,
				pageSize: 10,
			})
			paramJson.pageSize = this.supplierPage.length
			// 当前页的条数开始
			if (flag) {
				this.supplierPage.currentPage = 1
			}
			// 当前页的条数开始
			paramJson.pageNum = this.supplierPage.currentPage
			return paramJson
		},
		//列表渲染
		supplierSubsidyQueryPage: async function (flag) {
			if (this.searchData.id && !/^[0-9]*$/.test(this.searchData.id)) {
				return this.$message.error('补款ID数据格式不对')
			}
			let paramJson = this.findSupplierSearchParams(flag)

			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await supplierCompensationAmountList(paramJson)
			if (resultCode == 0) {
				this.showLoading = false
				this.tableData =
					resultData && resultData.records ? resultData.records : []
				this.supplierPage.count =
					resultData && resultData.total ? resultData.total : 0
			} else {
				this.tableData = []
				this.supplierPage.count = 0
			}
		},
		async subsidyQueryPage(row) {
			let paramJson = {
				pageNum: this.page.currentPage,
				pageSize: this.page.length,
				orderId: row.orderId,
				queryType: 2,
			}
			let {
				data: { resultCode, resultData },
			} = await subsidyQueryPage(paramJson)
			if (resultCode == 0) {
				if (row) {
					this.compensationLoading = false
					this.compensationTableData =
						resultData && resultData.records ? resultData.records : []
				}
			} else {
				this.compensationTableData = []
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

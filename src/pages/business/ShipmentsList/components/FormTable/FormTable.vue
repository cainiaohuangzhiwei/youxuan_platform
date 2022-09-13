<template>
	<div class="shipmentsList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
			</yx-form>
			<yx-accounts :items="accountItems103"></yx-accounts>
			<yx-table
				:select="true"
				v-loading="loading"
				:columns="tableColumns102"
				:pagination="page102"
				:data="tableData102"
			>
				<template slot="orderSn" slot-scope="scope">
					<router-link
						v-if="getOrderDetailByOrderId"
						:to="`/business/orderDetails/${scope.row.orderId}`"
						><el-button type="text">{{
							scope.row.orderSn
						}}</el-button></router-link
					>
					<p v-else>{{ scope.row.orderSn }}</p>
				</template>

				<template slot="action" slot-scope="scope">
					<router-link
						:to="`/business/orderDetails/${scope.row.orderId}?&tabIndex=1`"
						><el-button type="text">详情</el-button></router-link
					>
				</template>
				<template slot="deliverState" slot-scope="scope">
					<div>
						<el-tag :type="getTag(scope.row.deliverState).type">{{
							getTag(scope.row.deliverState).value
						}}</el-tag>
					</div>
				</template>
			</yx-table>

			<Dialog
				title="导出订单列表"
				:visible="exportTypeDialogVisiable"
				width="800px"
				:bottomBtn="exportTypeDialogBottomBtn"
				@before-close="exportTypeDialogVisiable = false"
			>
				<!-- <yx-form
					:inline="true"
					:data="exportTypeDialogFormData"
					:items="exportTypeDialogFormCfg"
					label-position="right"
					label-width="90px"
				> -->
				<!-- <template #exportType> -->
				<el-checkbox
					:indeterminate="isIndeterminate"
					v-model="checkAll"
					@change="handleCheckAllChange"
					>全选</el-checkbox
				>
				<div style="margin: 15px 0"></div>
				<div class="exportType-box">
					<div class="exportType-left">字段选择：</div>
					<el-checkbox-group
						v-model="checkedTypes"
						@change="handleCheckedCitiesChange"
					>
						<el-checkbox
							class="exportType-item"
							v-for="item in exportTypeList"
							:label="item.exportType"
							:key="item.value"
							>{{ item.value }}</el-checkbox
						>
					</el-checkbox-group>
				</div>
				<!-- </template> -->
				<!-- </yx-form> -->
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import moment from 'moment'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxAccounts from '@/components/Accounts'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import {
	getOrderDeliverListByCondition,
	exportOrderDeliverListByCondition,
} from '@/api/yhtPlusCmsOrder'
import { exportBatchUpdateExpressSnDetails } from '@/api/webImport'
import { downloadFile, assembleAreaName } from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxAccounts,
		YxTable,
		Dialog,
	},
	props: [],
	data() {
		return {
			loading: false,
			getOrderDetailByOrderId: checkFunctionCode('getOrderDetailByOrderId'),
			formData101: {
				likeClerkName: '',
				likeBrandName: '',
				likeDeliverSn: '',
				likeOrderSn: '',
				likeExpressSn: '',
				deliverType: '0',
				auditTimeStart: moment().startOf('day').valueOf(), // 开始时间
				auditTimeEnd: moment().endOf('day').valueOf(), // 结束时间
			},
			formCfg101: [
				{
					title: '发件人',
					type: 'input',
					dataIndex: 'likeClerkName',
					enter: () => {
						this.getData102(true)
					},
				},
				{
					title: '会场',
					type: 'input',
					dataIndex: 'likeBrandName',
					enter: () => {
						this.getData102(true)
					},
				},
				{
					title: '发货编号',
					type: 'input',
					dataIndex: 'likeDeliverSn',
					enter: () => {
						this.getData102(true)
					},
				},
				{
					title: '订单号',
					type: 'input',
					dataIndex: 'likeOrderSn',
					enter: () => {
						this.getData102(true)
					},
				},
				{
					title: '快递单号',
					type: 'input',
					dataIndex: 'likeExpressSn',
					enter: () => {
						this.getData102(true)
					},
				},
				{
					title: '状态',
					type: 'select',
					dataIndex: 'deliverType',
					label: 'value',
					change: () => {
						this.getData102(true)
					},
					options: [
						{
							deliverType: '0',
							value: '全部',
						},
						{
							deliverType: '1',
							value: '发完货',
						},
						{
							deliverType: '2',
							value: '已确定收货',
						},
					],
				},
				{
					type: 'datetimerange',
					title: '发货时间',
					dataIndex: ['auditTimeStart', 'auditTimeEnd'],
				},
			],
			formAction101: [
				{
					title: '重置',
					auth: '',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData102(true)
					},
					tableId: 102,
					api: 'getOrderDeliverListByCondition',
				},
				{
					title: '批量导出物流信息',
					type: 'success',
					auth: '',
					click: async () => {
						try {
							const { data } = await exportBatchUpdateExpressSnDetails(
								this.formData101
							)
							downloadFile(data, '导出发货订单.xlsx')
						} catch (error) {
							console.log(error)
						}
					},
				},
				{
					title: '导出',
					type: 'success',
					auth: '',
					click: () => {
						console.log(this)
						this.$forceUpdate()
						this.exportTypeDialogVisiable = true
					},
				},
			],
			accountItems103: [
				{
					type: 'order',
					title: '发货单数',
					value: '0',
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					dataIndex: 'deliverSn',
					title: '编号',
					width: '100',
				},
				{
					type: 'string',
					dataIndex: 'clerkName',
					title: '发件人',
				},
				{
					type: 'string',
					dataIndex: 'organizationName',
					title: '店主名称',
				},
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '关联订单',
					width: '210',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场名称',
				},
				{
					type: 'string',
					dataIndex: 'deliverQuantity',
					title: '商品数',
					width: '60',
				},
				{
					type: 'string',
					dataIndex: 'consignee',
					title: '收件人',
				},
				{
					type: 'string',
					dataIndex: 'phoneMob',
					title: '手机号',
				},
				{
					type: 'string',
					dataIndex: 'grandAreaName',
					title: '地区',
					customRender: (row) => {
						return assembleAreaName(row)
					},
				},
				{
					type: 'string',
					dataIndex: 'address',
					title: '收货地址',
					width: '150',
				},
				{
					type: 'string',
					dataIndex: 'expressName',
					title: '快递公司',
				},
				{
					type: 'string',
					dataIndex: 'expressSn',
					title: '快递单号',
				},
				{
					type: 'date',
					dataIndex: 'auditTime',
					title: '发货时间',
				},
				{
					type: 'custom',
					dataIndex: 'deliverState',
					title: '状态',
					width: '100',
				},
				{
					title: '操作',
					width: '120',
					fixed: 'right',
					dataIndex: 'action',
					type: 'custom',
				},
			],
			page102: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData102()
				},
			},
			exportTypeDialogVisiable: false,
			exportTypeDialogBottomBtn: [
				{
					title: '导出',
					type: 'primary',
					click: () => {
						this.handleExportTypeFile()
					},
				},
			],
			exportTypeDialogFormCfg: [
				{
					title: '字段选择',
					type: 'custom',
					dataIndex: 'exportType',
				},
			],
			checkAll: true,
			checkedMap: {
				orderSn: '订单号',
				orderAddTime: '下单时间',
				goodsNumber: '货号',
				goodsName: '商品名称',
				specOne: '规格一（颜色）',
				specTwo: '规格二（尺码',
				barCode: '条形码',
				costPrice: '结算价',
				deliverQuantity: '发货数量',
				addTime: '发货时间',
				phoneMob: '收件人手机号',
				consignee: '收件人名称',
				address: '收件人地址',
				expressName: '物流公司',
				expressSn: '物流单号',
			},
			checkedTypes: [
				'orderSn',
				'orderAddTime',
				'goodsNumber',
				'goodsName',
				'specOne',
				'specTwo',
				'barCode',
				'costPrice',
				'deliverQuantity',
				'addTime',
				'phoneMob',
				'consignee',
				'address',
				'expressName',
				'expressSn',
			],
			exportTypeList: [
				{
					exportType: 'orderSn',
					value: '订单号',
				},
				{
					exportType: 'orderAddTime',
					value: '下单时间',
				},
				{
					exportType: 'goodsNumber',
					value: '货号',
				},
				{
					exportType: 'goodsName',
					value: '商品名称',
				},
				{
					exportType: 'specOne',
					value: '规格一（颜色）',
				},
				{
					exportType: 'specTwo',
					value: '规格二（尺码',
				},
				{
					exportType: 'barCode',
					value: '条形码',
				},
				{
					exportType: 'costPrice',
					value: '结算价',
				},
				{
					exportType: 'deliverQuantity',
					value: '发货数量',
				},
				{
					exportType: 'addTime',
					value: '发货时间',
				},
				{
					exportType: 'phoneMob',
					value: '收件人手机号',
				},
				{
					exportType: 'consignee',
					value: '收件人名称',
				},
				{
					exportType: 'address',
					value: '收件人地址',
				},
				{
					exportType: 'expressName',
					value: '物流公司',
				},
				{
					exportType: 'expressSn',
					value: '物流单号',
				},
			],
			isIndeterminate: false,
		}
	},

	methods: {
		// 设置标签
		getTag(deliverState) {
			// red:  danger
			// green:  success
			// yellow:  warning
			// gray: info
			if (deliverState <= 6) {
				return {
					type: 'danger',
					value: '待发货',
				}
			} else if (deliverState < 8) {
				return {
					type: 'warning',
					value: '发货中',
				}
			} else if (deliverState == 8) {
				return {
					type: 'warning',
					value: '发完货',
				}
			} else if (deliverState == 9) {
				return {
					type: 'info',
					value: '已作废',
				}
			} else if (deliverState == 10) {
				return {
					type: 'success',
					value: '已确认收货',
				}
			}
		},
		skipDetails(row, v) {
			if (v == 1) {
				this.$router.push({
					path: `/business/orderDetails/${row.orderId}`,
				})
			} else {
				this.$router.push({
					path: `/business/orderDetails/${row.orderId}`,
					query: { activeName: 'shipmentRecordTab' },
				})
			}
		},
		async getData102(flag) {
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			const {
				data: { resultCode, resultData },
			} = await getOrderDeliverListByCondition(paramJson)
			if (resultCode === 0) {
				this.tableData102 = resultData.orderDeliverList
				this.page102.count = resultData.orderDeliverCount
				this.accountItems103[0].value = resultData.orderDeliverCount
			}
			this.loading = false
		},
		findSearchParams102(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			const paramJson = Object.assign(this.formData101, {
				length: this.page102.length,
				startIndex: (this.page102.currentPage - 1) * this.page102.length,
			})
			return paramJson
		},
		handleCheckAllChange(val) {
			this.checkedTypes = val
				? this.exportTypeList.map((item) => item.exportType)
				: []
			this.isIndeterminate = false
		},
		handleCheckedCitiesChange(value) {
			let checkedCount = value.length
			this.checkAll = checkedCount === this.exportTypeList.length
			this.isIndeterminate =
				checkedCount == 0 || checkedCount === this.exportTypeList.length
					? false
					: true
		},
		async handleExportTypeFile() {
			if (!this.checkedTypes.length) {
				this.$message.warning('请勾选字段')
				return
			}
			const header = {}
			this.checkedTypes.map((item) => {
				header[item] = this.checkedMap[item]
			})
			const params = this.formData101
			Object.assign(params, {
				header,
			})
			this.exportTypeDialogVisiable = false
			const { data } = exportOrderDeliverListByCondition(params)
			downloadFile(data, '导出订单列表.xlsx')
		},
	},
}
</script>
<style scoped>
.exportType-box {
	display: flex;
}
.exportType-left {
	width: 180px;
}
.exportType-item {
	width: 20%;
}
</style>

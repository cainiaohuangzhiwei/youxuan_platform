<template>
	<!-- 未完成 -->
	<div class="priorityClaimsList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData103"
				:items="formCfg103"
				:formAction="formAction103"
			>
				<template #supplierName>
					<el-input
						v-model="formData103.supplierName"
						placeholder="请选择商家"
						value-key="supplierName"
						label="supplierName"
						@focus="selectSupplierList"
						clearable
						@clear="
							() => {
								formData103.supplierName = ''
								formData103.supplierNumberIds = []
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="supplierListDialogVisiable = true"
						></el-button>
					</el-input>
				</template>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns104"
				:pagination="page104"
				:data="tableData104"
			>
				<template slot="afterSalesSn" slot-scope="scope">
					<router-link
						:to="`/business/afterSaleOrderDetails/${scope.row.afterSalesId}`"
						><el-button type="text">{{
							scope.row.afterSalesSn
						}}</el-button></router-link
					>
					<div>
						{{ moment(scope.row.addTime).format('YYYY-MM-DD HH:mm:ss') }}
					</div>
				</template>
				<template slot="orderSn" slot-scope="scope">
					<router-link :to="`/business/orderDetails/${scope.row.orderId}`"
						><el-button type="text">{{
							scope.row.orderSn
						}}</el-button></router-link
					>
					<div>
						{{ moment(scope.row.orderAddTime).format('YYYY-MM-DD HH:mm:ss') }}
					</div>
				</template>
				<template slot="trackingNum" slot-scope="scope">
					<a
						style="color: #0096fb"
						target="_blank"
						:href="'https://www.kuaidi100.com?nu=' + scope.row.trackingNum"
						>{{ scope.row.trackingNum }}</a
					>
				</template>
				<template slot="acceptTheStatus" slot-scope="scope">
					<span :class="acceptTheStatusArr[scope.row.acceptTheStatus].color">{{
						acceptTheStatusArr[scope.row.acceptTheStatus].value
					}}</span>
				</template>
			</yx-table>
			<!-- 商家/商家列表 -->
			<supplier-dialog
				:itemInfo="supplierRow"
				:visible.sync="supplierListDialogVisiable"
				chooseType="checkbox"
				@fatherMethodInit="
					(row) => {
						formData103.supplierName = row.supplierName
						formData103.supplierNumberIds = row.supplierAccountNumberIds
					}
				"
			/>
		</basicContainer>
	</div>
</template>
<script>
import moment from 'moment'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import {
	prepaymentList,
	afterSalesPrepayment,
} from '@/api/afterSalesPrepayment'
import { exportAfterSalesPrepayment } from '@/api/webImport'
import SupplierDialog from '@/components/SupplierDialog'
import { downloadFile } from '@/utils/helper/common'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		SupplierDialog,
	},
	props: [],
	data() {
		return {
			moment,
			loading: false,
			formData103: {
				afterSalesSn: '',
				orderSn: '',
				supplierName: [], // 商家
				trackingNum: '',
				startTime: moment().startOf('month').valueOf(), // 开始时间
				endTime: moment().endOf('month').valueOf(), // 开始时间
				afterType: '',
				afterOrderStatus: '1',
				acceptTheStatus: '1',
				supplierAfterSalesStatus: '1',
				supplierNumberIds: [],
			},
			formCfg103: [
				{
					type: 'input',
					title: '售后单号',
					dataIndex: 'afterSalesSn',
				},
				{
					type: 'input',
					title: '关联订单号',
					dataIndex: 'orderSn',
				},
				{
					type: 'custom',
					title: '商家',
					dataIndex: 'supplierName',
				},
				{
					type: 'input',
					title: '物流单号',
					dataIndex: 'trackingNum',
				},
				{
					type: 'datetimerange',
					title: '申请时间',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
				},
				{
					type: 'select',
					title: '售后类型',
					dataIndex: 'afterType',
					label: 'value',
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
					change: () => {
						this.getData104(true)
					},
				},
				{
					type: 'select',
					title: '售后单状态',
					dataIndex: 'afterOrderStatus',
					label: 'value',
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
							value: '商家已退款',
						},
						{
							afterOrderStatus: '8',
							value: '已关闭',
						},
					],
					change: () => {
						this.getData104(true)
					},
				},
				{
					type: 'select',
					title: '受理状态',
					dataIndex: 'acceptTheStatus',
					label: 'value',
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
					change: () => {
						this.getData104(true)
					},
				},
				{
					type: 'select',
					title: '商家售后状态',
					dataIndex: 'supplierAfterSalesStatus',
					label: 'value',
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
					change: () => {
						this.getData104(true)
					},
				},
			],
			formAction103: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData104(true)
					},
					tableId: 104,
					api: 'prepaymentList',
				},
				{
					title: '导出',
					type: 'success',
					auth: '',
					click: () => {
						this.exportAfterSalesList()
					},
				},
			],
			acceptTheStatusArr: {
				2: {
					value: '受理中',
					color: '',
				},
				3: {
					value: '同步中',
					color: '',
				},
				4: {
					value: '已受理',
					color: '',
				},
				5: {
					value: '受理完成',
					color: '',
				},
				6: {
					value: '结果确认中',
					color: 'state-tag-orange',
				},
				7: {
					value: '已关闭',
					color: 'state-tag-gray',
				},
				8: {
					value: '待受理',
					color: '',
				},
			},
			tableData104: [],
			tableColumns104: [
				{
					type: 'custom',
					dataIndex: 'afterSalesSn',
					title: '售后单号',
					width: '150',
				},
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '关联订单号',
					width: '200',
				},
				{
					type: 'string',
					dataIndex: 'channel',
					title: '商家',
					width: '60',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场',
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
				},
				{
					type: 'string',
					dataIndex: 'afterReason',
					title: '售后原因',
				},
				{
					type: 'string',
					dataIndex: 'refundAmount',
					title: '退款金额',
				},
				{
					type: 'string',
					dataIndex: 'afterOrderStatus',
					title: '售后单状态',
					width: '120',
					customRender: (row) => {
						const arr = {
							2: '申请中',
							3: '待寄出',
							4: '已寄出',
							5: '商家已退款',
							8: '已关闭',
						}
						return arr[row.afterOrderStatus] || '-'
					},
				},
				{
					type: 'custom',
					dataIndex: 'acceptTheStatus',
					title: '受理状态',
					width: '120',
				},
				{
					type: 'string',
					dataIndex: 'supplierAfterSalesStatus',
					title: '商家售后状态',
					customRender: (row) => {
						const arr = {
							2: '物流同步中',
							3: '待验货',
							4: '售后完成',
							5: '异常处理中',
							6: '已关闭',
						}
						return arr[row.supplierAfterSalesStatus] || '-'
					},
				},
				{
					type: 'custom',
					dataIndex: 'trackingNum',
					title: '寄回第三方物流单号',
				},
				{
					type: 'string',
					dataIndex: 'orderDevice',
					title: '下单设备',
				},
				{
					type: 'amount',
					dataIndex: 'thirdPartyRefundAmount',
					title: '第三方返退金额',
				},
				{
					type: 'string',
					dataIndex: 'mailAddress',
					title: '上游寄回地址',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '填写物流单号',
							auth: 'prepaymentOperate',
							popconfirm: true,
							popconfirmTitle: '暂不支持，请使用旧系统',
							confirmButtonText: '确认',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: () => {
								window.open('/yhtplus/web/priorityClaimsList.html')
							},
							customRender: (action, row) => {
								const showStatus = row.afterOrderStatus == 3 ? true : false
								action.hide = !showStatus
								return action
							},
						},
						{
							title: '关闭售后',
							auth: 'prepaymentOperate',
							popconfirm: true,
							popconfirmTitle: '确认要关闭售后吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this.handleClickTableBtn(row, 8)
							},
							customRender: (action, row) => {
								const showStatus =
									row.afterOrderStatus == 3 ||
									row.supplierAfterSalesStatus == 5 ||
									row.acceptTheStatus == 6
										? true
										: false
								action.hide = !showStatus
								return action
							},
						},
						{
							title: '处理成功',
							auth: 'prepaymentOperate',
							popconfirm: true,
							popconfirmTitle: '商家售后状态将扭转为待验货，确定处理成功？',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this.handleClickTableBtn(row, 7)
							},
							customRender: (action, row) => {
								const showStatus =
									row.supplierAfterSalesStatus == 5 ? true : false
								action.hide = !showStatus
								return action
							},
						},
						{
							title: '二次申请',
							auth: 'prepaymentOperate',
							popconfirm: true,
							popconfirmTitle: '受理售后状态将扭转为已受理，确定商家验收通过？',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this.handleClickTableBtn(row, 6)
							},
							customRender: (action, row) => {
								const showStatus = row.acceptTheStatus == 6 ? true : false
								action.hide = !showStatus
								return action
							},
						},
					],
				},
			],
			page104: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData104()
				},
			},
			supplierListDialogVisiable: false,
		}
	},

	methods: {
		async getData104(flag) {
			this.loading = true
			let paramJson = this.findSearchParams104(flag)
			const {
				data: { resultCode, resultData },
			} = await prepaymentList(paramJson)
			if (resultCode === 0) {
				this.tableData104 = resultData.afterSalesList
				this.page104.count = resultData.count
			}
			this.loading = false
		},
		findSearchParams104(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page104.currentPage = 1
			}
			const paramJson = Object.assign(this.formData103, {
				length: this.page104.length,
				startIndex: (this.page104.currentPage - 1) * this.page104.length,
			})
			return paramJson
		},
		selectSupplierList(e) {
			e.target.blur()
			this.supplierListDialogVisiable = true
		},
		async handleClickTableBtn(row, operationItem) {
			const params = {
				operationItem,
				afterSalesPrepaymentId: row.afterSalesPrepaymentId,
			}
			const {
				data: { resultCode, resultMsg },
			} = await afterSalesPrepayment(params)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
				this.getData104(true)
			}
		},
		async exportAfterSalesList() {
			const params = this.formData103
			const { data } = await exportAfterSalesPrepayment(params)
			downloadFile(data, '优先赔付列表.xlsx')
		},
	},
}
</script>
<style lang="scss" scope>
.state-tag-orange {
	background-color: rgba(255, 153, 0, 1);
	padding: 10px;
	border-radius: 10px;
	color: #fff;
}
.state-tag-gray {
	background-color: #999;
	padding: 10px;
	border-radius: 10px;
	color: #fff;
}
</style>

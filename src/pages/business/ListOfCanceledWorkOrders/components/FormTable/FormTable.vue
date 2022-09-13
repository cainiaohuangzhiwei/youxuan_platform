<template>
	<div class="listOfCanceledWorkOrders">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
				<template #supplierName>
					<el-input
						v-model="formData101.supplierName"
						placeholder="请选择商家"
						value-key="supplierName"
						label="supplierName"
						@focus="selectSupplier"
						clearable
						@clear="
							() => {
								supplierList = []
								formData101.supplierName = ''
								formData101.supplierNumberIds = []
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="selectSupplier"
						></el-button>
					</el-input>
				</template>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns102"
				:pagination="page102"
				:data="tableData102"
			>
				<template slot="orderSn" slot-scope="scope">
					<router-link :to="`/business/orderDetails/${scope.row.orderId}`"
						><el-button type="text">{{
							scope.row.orderSn
						}}</el-button></router-link
					>
				</template>
			</yx-table>
			<Dialog
				:title="dialogTitle103"
				:visible="dialogVisible103"
				:width="dialogWidth103"
				:bottomBtn="dialogBottomBtn103"
				@before-close="dialogVisible103 = false"
			>
				<yx-form
					ref="dialog104"
					labelWidth="80px"
					:inline="false"
					:data="formData104"
					:items="formCfg104"
				>
				</yx-form>
			</Dialog>
			<Dialog
				:title="dialogTitle126"
				:visible.sync="dialogVisible126"
				:width="dialogWidth126"
				:bottomBtn="dialogBottomBtn126"
			>
				<yx-form
					:inline="true"
					:data="formData126"
					:items="formCfg126"
					:formAction="formAction126"
				>
				</yx-form>
				<yx-table
					:select="false"
					v-loading="loading104"
					:columns="tableColumns104"
					:pagination="page104"
					:data="tableData104"
				>
				</yx-table>
			</Dialog>
			<!-- 商家/商家列表 -->
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import { cancelOrderList, serviceRecordUpdate } from '@/api/serviceRecord'
import moment from 'moment'
import { findSupplierAccountNumberForList } from '@/api/yhtPlusCmsSupplierAccountNumber'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},
	props: [],
	data() {
		return {
			loading104: false,
			tableData104: [],
			tableColumns104: [
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.setSupplierList(row)
							},
							customRender: (action, row) => {
								let flag = this.supplierList.some(
									(item) =>
										item.supplierAccountNumberId === row.supplierAccountNumberId
								)
								action.title = flag ? '移除' : '添加'
								return action
							},
						},
					],
				},
			],
			supplierList: [],
			page104: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._findSupplierAccountNumberForList()
				},
			},
			formData126: {
				keyword: '',
			},
			formCfg126: [
				{
					type: 'input',
					title: '搜索',
					dataIndex: 'keyword',
					placeholder: '商家',
				},
			],
			formAction126: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						this._findSupplierAccountNumberForList(true)
					},
				},
			],
			dialogTitle126: '选择商家',
			dialogWidth126: '800px',
			dialogVisible126: false,
			dialogBottomBtn126: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible126 = false
					},
				},
			],
			loading: false,
			supplyDialogVisible: false,
			formData101: {
				ticketId: '',
				orderSn: '',
				supplierName: '',
				serviceStatus: '',
				startTime: moment().startOf('month').valueOf(), // 开始时间
				endTime: moment().endOf('month').valueOf(), // 结束时间
				supplierNumberIds: [],
			},
			formCfg101: [
				{
					type: 'input',
					title: '工单编号',
					dataIndex: 'ticketId',
					placeholder: '请输入工单编号',
				},
				{
					type: 'input',
					title: '订单号',
					dataIndex: 'orderSn',
					placeholder: '请输入订单号',
				},
				{
					type: 'custom',
					title: '商家',
					dataIndex: 'supplierName',
					placeholder: '请输入商家',
				},
				{
					type: 'select',
					title: '状态',
					dataIndex: 'serviceStatus',
					placeholder: '请输入状态',
					label: 'value',
					options: [
						{
							serviceStatus: '',
							value: '全部',
						},
						{
							serviceStatus: '1',
							value: '待受理',
						},
						{
							serviceStatus: '2',
							value: '处理成功',
						},
						{
							serviceStatus: '3',
							value: '已关闭',
						},
					],
				},
				{
					type: 'datetimerange',
					title: '申请时间',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
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
					api: 'cancelOrderList',
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					dataIndex: 'ticketId',
					title: '工单编号',
				},
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '订单号编号',
					width: '210',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '申请时间',
				},
				{
					type: 'string',
					dataIndex: 'creatorName',
					title: '申请人',
				},
				{
					type: 'string',
					dataIndex: 'organizationName',
					title: '店主名称',
				},
				{
					type: 'string',
					dataIndex: 'orderUserName',
					title: '下单人',
				},
				{
					type: 'string',
					dataIndex: 'channel',
					title: '商家',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场',
					width: '120',
				},
				{
					type: 'string',
					dataIndex: 'orderDevice',
					title: '下单设备',
				},
				{
					dataIndex: 'serviceStatus',
					title: '状态',
					customRender: (row) => {
						const arr = ['全部', '待受理', '处理成功', '已关闭']
						return arr[row.serviceStatus] || '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '填写备注',
							auth: '',
							click: (row) => {
								this.formData104 = Object.assign({ remark: '' }, row)
								this.$nextTick(() => {
									this.$refs.dialog104.$refs.YxForm.clearValidate()
								})
								this.dialogVisible103 = true
							},
						},
					],
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
			dialogTitle103: '备注',
			dialogWidth103: '600px',
			dialogVisible103: false,
			dialogBottomBtn103: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						if (!this.loading) this.handleSubmitDialog103(104)
					},
					dialogType: 'submitDialogForm',
					formId: 104,
					api: 'serviceRecordUpdate',
				},
			],
			formData104: {
				remark: '',
			},
			formCfg104: [
				{
					type: 'textarea',
					title: '备注',
					autosize: { minRows: 5, maxRows: 8 },
					dataIndex: 'remark',
					placeholder: '请输入备注',
				},
			],
			formRules104: {
				remark: [{ required: true, message: '请输入备注!', trigger: 'blur' }],
			},
		}
	},
	methods: {
		setSupplierList(row) {
			let newRow = JSON.parse(JSON.stringify(row))
			let flag = this.supplierList.some(
				(item) =>
					item.supplierAccountNumberId === newRow.supplierAccountNumberId
			)
			if (!flag) {
				this.supplierList.push(newRow)
			} else {
				let index = this.supplierList.findIndex((item) => {
					return item.supplierAccountNumberId == newRow.supplierAccountNumberId
				})
				this.supplierList.splice(index, 1)
			}
			let supplierName = this.supplierList.map((item) => {
				return item.supplierName
			})
			this.formData101.supplierNumberIds = this.supplierList.map((item) => {
				return item.supplierAccountNumberId
			})
			this.formData101.supplierName = supplierName.join(',')
		},
		// 获取供应列表
		_findSupplierAccountNumberForList: async function (flag) {
			this.loading104 = true
			let paramJson = this.findSearchParams126(flag)
			const {
				data: { resultCode, resultData },
			} = await findSupplierAccountNumberForList(paramJson)
			if (resultCode == 0) {
				this.tableData104 = resultData.list
				this.page104.count = resultData.count
			} else {
				this.tableData104 = []
				this.page104.count = 0
			}
			this.loading104 = false
		},
		findSearchParams126(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page104.currentPage = 1
			}
			const paramJson = Object.assign(this.formData126, {
				length: this.page104.length,
				startIndex: (this.page104.currentPage - 1) * this.page104.length,
			})
			return paramJson
		},
		async getData102(flag) {
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			const {
				data: { resultCode, resultData },
			} = await cancelOrderList(paramJson)
			if (resultCode === 0) {
				this.tableData102 = resultData.serviceRecordList
				this.page102.count = resultData.count
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
		async handleSubmitDialog103() {
			let paramJson = {
				remark: this.formData104.remark.trim(),
				serviceRecordId: this.formData104.afterSalesServiceRecordId,
			}
			const {
				data: { resultCode, resultMsg },
			} = await serviceRecordUpdate(paramJson)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
				this.dialogVisible103 = false
				this.getData102(true)
			}
		},
		selectSupplier(e) {
			e.target.blur()
			this.dialogVisible126 = true
			this.formData126.keyword = ''
			this._findSupplierAccountNumberForList(true)
		},
	},
}
</script>

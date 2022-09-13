<template>
	<div class="modifyAddressList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData105"
				:items="formCfg105"
				:formAction="formAction105"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns106"
				:pagination="page106"
				:data="tableData106"
			>
				<template slot="consignee" slot-scope="scope">
					<div>{{ scope.row.consignee }}</div>
					<div>{{ scope.row.phoneMob }}</div>
					<div>
						{{ scope.row.grandAreaName }}{{ scope.row.parentAreaName
						}}{{ scope.row.areaName }}
					</div>
					<div>{{ scope.row.address }}</div>
				</template>
				<template slot="orderSn" slot-scope="scope">
					<router-link :to="`/business/orderDetails/${scope.row.orderId}`"
						><el-button type="text">{{
							scope.row.orderSn
						}}</el-button></router-link
					>
					<!-- <el-button type="text"> -->
					<!-- <router-link :to="`/business/orderDetails/${scope.row.orderId}`">{{
							scope.row.orderSn
						}}</router-link> -->
					<!-- </el-button> -->
				</template>
			</yx-table>
			<Dialog
				:title="dialogTitle107"
				:visible="dialogVisible107"
				:width="dialogWidth107"
				:bottomBtn="dialogBottomBtn107"
				@before-close="dialogVisible107 = false"
			>
				<yx-form
					:inline="false"
					:data="formData108"
					:items="formCfg108"
					:formAction="formAction108"
				>
				</yx-form>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import moment from 'moment'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import { getOrderRecordList, updateOrderRecord } from '@/api/orderRecord'

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
			loading: false,
			formData105: {
				orderSn: '',
				acceptType: '0',
				addTimeStart: moment().startOf('day').valueOf(), // 开始时间
				addTimeEnd: moment().endOf('day').valueOf(), // 结束时间
			},
			formCfg105: [
				{
					type: 'input',
					title: '订单编号',
					dataIndex: 'orderSn',
					placeholder: '请输入订单编号',
				},
				{
					type: 'select',
					title: '状态',
					dataIndex: 'acceptType',
					placeholder: '请输入状态',
					label: 'value',
					options: [
						{
							acceptType: '0',
							value: '全部',
						},
						{
							acceptType: '2',
							value: '待受理',
						},
						{
							acceptType: '3',
							value: '受理成功',
						},
						{
							acceptType: '4',
							value: '受理失败',
						},
					],
				},
				{
					type: 'datetimerange',
					title: '申请时间',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
				},
			],
			formAction105: [
				// {
				// 	title: '重置',
				// 	auth: '',
				// 	isClear: true,
				// },
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData106(true)
					},
					tableId: 106,
					api: 'getOrderRecordList',
				},
			],
			tableData106: [],
			tableColumns106: [
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
					dataIndex: 'applyUserName',
					title: '申请人',
					customRender: (row) => {
						return row.orderUserName ? row.orderUserName : '-'
					},
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
					customRender: (row) => {
						return row.orderUserName ? row.orderUserName : '-'
					},
				},
				{
					type: 'custom',
					dataIndex: 'consignee',
					title: '收货信息',
					width: '220',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场',
				},
				{
					type: 'string',
					dataIndex: 'sourceName',
					title: '下单设备',
				},
				{
					dataIndex: 'acceptType',
					title: '状态',
					customRender: (row) => {
						const arr = ['全部', '-', '待受理', '受理成功', '受理失败']
						return arr[row.acceptType] || '-'
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
								this.formData108 = Object.assign({ remark: '' }, row)
								this.dialogVisible107 = true
							},
						},
					],
				},
			],
			page106: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData106()
				},
			},
			dialogTitle107: '备注填写',
			dialogWidth107: '30%',
			dialogVisible107: false,
			dialogBottomBtn107: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						if (!this.loading) this.handleSubmitDialog107(108)
					},
					formId: 108,
					api: 'updateOrderRecord',
					dialogType: 'submitDialogForm',
				},
			],
			formData108: {
				remark: '',
			},
			formCfg108: [
				{
					title: '',
					type: 'textarea',
					dataIndex: 'remark',
					placeholder: '请输入备注',
					autosize: { minRows: 7, maxRows: 9 },
				},
			],
			formAction108: [],
			formRules108: {
				remark: [{ required: true, message: '请输入备注!', trigger: 'blur' }],
			},
		}
	},

	created() {
		this.getData106(true)
	},

	methods: {
		async getData106(flag) {
			this.loading = true
			let paramJson = this.findSearchParams106(flag)
			const {
				data: { resultCode, resultData },
			} = await getOrderRecordList(paramJson)
			if (resultCode === 0) {
				this.tableData106 = resultData.orderRecordList
				this.page106.count = resultData.count
			}
			this.loading = false
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
			return paramJson
		},
		async handleSubmitDialog107() {
			let paramJson = {
				remark: this.formData108.remark.trim(),
				orderAddressRecordId: this.formData108.orderAddressRecordId,
			}
			const {
				data: { resultCode, resultMsg },
			} = await updateOrderRecord(paramJson)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
				this.dialogVisible107 = false
				this.getData106(true)
			}
		},
	},
}
</script>

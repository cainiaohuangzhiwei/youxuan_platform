<template>
	<div>
		<!-- <el-button type="primary" class="el-icon-right" @click="oldSystem"
			>老系统</el-button
		> -->
		<yx-form
			:inline="true"
			:data="formData"
			:items="formCfg"
			:formAction="formAction"
			:actionInline="true"
		>
			<template #chooseGroup>
				<el-input
					v-model="formData.groupName"
					placeholder="选择分组"
					value-key="groupName"
					label="groupName"
					@focus="selectGroupDialog"
					clearable
					@clear="
						() => {
							formData.groupName = ''
							formData.goodsGroupId = ''
						}
					"
				>
					<el-button
						slot="append"
						icon="el-icon-more"
						@click="dialogGroupVisible = true"
					></el-button>
				</el-input>
			</template>
			<template #supplierName>
				<el-input
					v-model="formData.supplierName"
					placeholder="请选择商家"
					value-key="supplierId"
					label="supplierName"
					@focus="selectSupplier"
					clearable
					@clear="
						() => {
							formData.supplierName = ''
							formData.supplierIds = []
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

		<yx-table
			:select="true"
			v-loading="loading"
			:columns="tableColumns"
			:pagination="page115"
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
		</yx-table>

		<selected-group-dialog
			:dialogVisible.sync="dialogGroupVisible"
			:itemInfo.sync="selectedGoodsGroup"
			@selectedMethods="
				(row) => {
					formData.goodsGroupId = row.goodsGroupId
					formData.groupName = row.groupName
					if (!loading) getData(true)
				}
			"
		></selected-group-dialog>

		<supplier-dialog
			chooseType="checkbox"
			:visible.sync="supplyDialogVisible"
			@fatherMethodInit="
				(row) => {
					formData.supplierName = row.supplierName
					formData.supplierIds = row.supplierAccountNumberIds
					if (!loading) getData(true)
				}
			"
		/>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { downloadFile, isNull } from '@/utils/helper/common'
import SupplierDialog from '@/components/SupplierDialog'
import selectedGroupDialog from '@/components/groupGoods/selectedGroupDialog'
import YxTable from '@wg-vue-materials/yx-table'
import { checkFunctionCode } from '@/utils/auth.js'
import {
	pageStFinanceDataDetail,
	exportStFinanceDataDetail,
	// deleteStFinanceDataDetail,
	batchDeleteStFinanceDataDetail,
} from '@/api/accountDetail'
import moment from 'moment'

export default {
	components: { YxForm, YxTable, selectedGroupDialog, SupplierDialog },
	data() {
		return {
			getOrderDetailByOrderId: checkFunctionCode('getOrderDetailByOrderId'),
			formData: {
				type: '0', // 数据类型
				stType: '0',
				stFinanceId: '',
				stFinanceDataDetailId: '',
				orderSn: '',
				supplierName: '',
				supplierIds: [],
				goodsGroupId: '',
				groupName: '',
				startTime: '',
				endTime: '',
			},
			formCfg: [
				{
					type: 'input',
					title: '数据ID',
					dataIndex: 'stFinanceDataDetailId',
					placeholder: '请输入数据ID',
				},
				{
					title: '分组名称',
					type: 'custom',
					dataIndex: 'chooseGroup',
				},
				{
					title: '商家名称',
					type: 'custom',
					dataIndex: 'supplierName',
				},
				{
					type: 'input',
					title: '订单号',
					dataIndex: 'orderSn',
					placeholder: '请输入订单号',
				},
				{
					type: 'select',
					title: '数据类型',
					dataIndex: 'type',
					label: 'value',
					options: [
						{
							type: '0',
							value: '全部',
						},
						{
							type: '1',
							value: '订单',
						},
						{
							type: '2',
							value: '退款',
						},
						{
							type: '3',
							value: '营销费用',
						},
						{
							type: '4',
							value: '罚款',
						},
						{
							type: '5',
							value: '补款',
						},
						{
							type: '6',
							value: '其他',
						},
					],
				},
				{
					type: 'input',
					title: '关联对账单ID',
					dataIndex: 'stFinanceId',
					placeholder: '请输入对账单ID',
				},
				{
					type: 'select',
					title: '对账单类型',
					dataIndex: 'stType',
					label: 'value',
					options: [
						{
							stType: '0',
							value: '全部',
						},
						{
							stType: '1',
							value: '首款',
						},
						{
							stType: '2',
							value: '尾款',
						},
						{
							stType: '3',
							value: '往期数据',
						},
					],
				},
				{
					title: '创建时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
				},
			],
			formAction: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getData(true)
					},
				},
				{
					title: '批量删除',
					auth: 'batchDeleteStFinanceDataDetail',
					type: 'warning',
					click: () => {
						this._messageDel()
					},
				},
				{
					title: '批量导入',
					type: 'success',
					auth: 'importStFinanceDataDetail',
					click: () => {
						this.$router.push({ path: '/import/actions' })
					},
				},
				{
					title: '导出',
					type: 'success',
					auth: 'exportStFinanceDataDetail',
					click: () => {
						let paramJson = this.findSearchParams115(true)
						let paramJson_ = this.validParam(paramJson)
						if (!paramJson_) {
							return
						}
						this.$confirm('确定导出数据明细列表？', '提示', {
							type: 'success',
							callback: async (action) => {
								if (action === 'confirm') {
									const { data } = await exportStFinanceDataDetail(paramJson_)
									if (data) {
										downloadFile(data, '数据明细表.xlsx')
									}
								}
							},
						})
					},
				},
			],
			tableColumns: [
				{
					type: 'string',
					title: '数据ID',
					dataIndex: 'stFinanceDataDetailId',
				},
				{
					type: 'newMap',
					title: '数据类型',
					dataIndex: 'type',
					options: [
						['0', '全部'],
						['1', '订单'],
						['2', '退款'],
						['3', '营销费用'],
						['4', '罚款'],
						['5', '补款'],
						['6', '其他'],
					],
				},
				{
					type: 'string',
					title: '首款对账单ID',
					dataIndex: 'stFinanceFirstId',
				},
				{
					type: 'string',
					title: '尾款对账单ID',
					dataIndex: 'stFinanceLastId',
				},
				{
					type: 'string',
					title: '往期对账单ID',
					dataIndex: 'stFinancePeriodId',
				},
				{
					type: 'string',
					title: '分组ID',
					dataIndex: 'goodsGroupId',
				},
				{
					type: 'string',
					title: '分组名称',
					dataIndex: 'groupName',
				},
				{
					type: 'string',
					title: '会场名称',
					dataIndex: 'brandName',
				},
				{
					type: 'string',
					dataIndex: 'saleStartTime',
					title: '售卖时间',
					customRender: function (row) {
						return (
							moment(row.saleStartTime).format('yyyy-MM-dd hh:mm:ss') +
							'-' +
							moment(row.saleEndTime).format('yyyy-MM-dd hh:mm:ss')
						)
					},
				},
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '关联订单号',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
				},
				{
					type: 'amount',
					dataIndex: 'amount',
					title: '金额',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '创建时间',
				},
				{
					type: 'string',
					dataIndex: 'state',
					title: '数据状态',
					customRender: function (row) {
						if (row.state == 0) {
							return '失效'
						} else if (row.state == 1) {
							return '正常'
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
					type: 'action',
					title: '操作',
					width: '80',
					fixed: 'right',
					actions: [
						{
							title: '删除',
							click: (row) => {
								this._messageDel(row)
							},
							customRender: (action, row) => {
								const show =
									row.state == 1 &&
									row.type != 1 &&
									row.type != 2 &&
									checkFunctionCode('deleteStFinanceDataDetail')
								action.hide = !show
								return action
							},
						},
					],
				},
			],
			tableData: [],
			page115: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData()
				},
			},
			supplyDialogVisible: false,
			dialogGroupVisible: false,
			selectedGoodsGroup: {},
			loading: false,

			selectedList: [],
		}
	},
	methods: {
		// 打开老系统
		oldSystem() {
			window.open(`/yhtplus/web/accountDetail.html`)
		},
		selectSupplier(e) {
			e.target.blur()
			this.supplyDialogVisible = true
			this.$nextTick(() => {
				this.$refs.supplier.detail(this.formData.supplierIds)
			})
		},
		// 保存选分组选项数据
		selectGroupDialog(e) {
			e.target.blur()
			this.dialogGroupVisible = true
		},

		findSearchParams115(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page115.currentPage = 1
			}
			const paramJson = Object.assign(
				{
					length: this.page115.length,
					startIndex: (this.page115.currentPage - 1) * this.page115.length,
				},
				this.formData
			)
			return paramJson
		},
		async getData(flag) {
			let paramJson = this.findSearchParams115(flag)
			let paramJson_ = this.validParam(paramJson)
			if (!paramJson_) {
				return
			}

			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await pageStFinanceDataDetail(paramJson_)
			if (resultCode.toString() === '0') {
				this.tableData = resultData.records
				this.page115.count = resultData.total
			}
			this.loading = false
		},

		selectionChange(list) {
			this.selectedList = list
		},

		validParam(paramJson) {
			let paramJson_ = { ...paramJson }
			delete paramJson_['supplierName']
			delete paramJson_['groupName']
			if (!paramJson_.supplierIds.length) {
				delete paramJson_['supplierIds']
			}
			if (
				isNull(paramJson_.orderSn) &&
				isNull(paramJson_.goodsGroupId) &&
				isNull(paramJson_.stFinanceId) &&
				isNull(paramJson_.stFinanceDataDetailId) &&
				isNull(paramJson_.supplierIds)
			) {
				this.$message.warning(
					'请在(订单编号,关联对账单ID,分组名称,数据ID,商家名称)中填充一项筛选条件'
				)
				return false
			}
			return paramJson_
		},

		//删除
		_messageDel: function (row) {
			let paramJson
			let _this = this
			let confirmMsg = ''
			if (row) {
				paramJson = {
					stFinanceDataDetailIds: [row.stFinanceDataDetailId],
				}
				confirmMsg = '确定删除？'
			} else {
				paramJson = {
					stFinanceDataDetailIds: _this.selectedList.map(
						(x) => x.stFinanceDataDetailId
					),
				}
				if (!paramJson.stFinanceDataDetailIds.length) {
					return _this.$message.warning('请勾选数据')
				}
				confirmMsg =
					'是否批量删除' + paramJson.stFinanceDataDetailIds.length + '个数据?'
			}

			_this
				.$prompt(confirmMsg, '提示', {
					type: 'warning',
					inputPattern: /\S/,
					inputErrorMessage: '请输入删除原因',
				})
				.then(async ({ value }) => {
					if (!value) return
					paramJson.reason = value
					_this.loading = true
					let {
						data: { resultCode },
					} = await batchDeleteStFinanceDataDetail(paramJson)
					_this.loading = false
					if (resultCode == 0) {
						_this.$message.success('删除成功')
						_this.getData()
					}
				})
		},
	},
}
</script>

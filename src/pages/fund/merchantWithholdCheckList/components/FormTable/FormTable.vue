<template>
	<basic-container>
		<div>
			<!-- 条件筛选 -->
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>
			<!-- 表单列表 -->
			<el-row>
				<yx-table
					:select="true"
					:selectionChange="selectionChange"
					v-loading="loading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				></yx-table>
			</el-row>
		</div>
		<!-- 扣款详情 -->
		<Dialog
			title="扣款详情"
			:visible="withholdDetailDialogVisible"
			width="50%"
			:bottomBtn="auditDialogBottomBtn"
			@before-close="withholdDetailDialogVisible = false"
		>
			<yx-table
				v-loading="loading"
				:columns="withholdDetailDialogColumns"
				:data="withholdDetailDialogData"
			>
				<template slot="changeRemark" slot-scope="scope">
					<div>{{ changeRemarkStatus[scope.row.verifyState] }}</div>
					<div>备注：{{ scope.row.remark }}</div>
				</template>
			</yx-table>
		</Dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { numberFormat } from '@/utils/helper/common'
import moment from 'moment'
import { merchantDeductList } from '@/api/merchantDeduct'
import Dialog from '@/components/Dialog'
import { downloadFile } from '@/utils/helper/common'
import {
	merchantDeductExport,
	rejectDeduct,
	batchRejectDeduct,
} from '@/api/orderSettle'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},

	name: 'FormTable',

	data() {
		return {
			loading: false,
			withholdDetailDialogVisible: false,
			withholdDetailDialogData: [],
			changeRemarkStatus: ['创建', '已确认', '拒绝'],
			auditDialogBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.withholdDetailDialogVisible = false
					},
				},
			],
			numberFormat: numberFormat,
			searchData: {
				orderSn: '',
				deductType: '',
				verifyState: '',
				createName: '',
				supplierName: '',
				startTime: moment().startOf('day').valueOf(), // 开始时间
				endTime: moment().endOf('day').valueOf(), // 结束时间
				changeTimeStart: moment().startOf('day').valueOf(), // 开始时间
				changeTimeEnd: moment().endOf('day').valueOf(), // 结束时间
			},
			searchCfg: [
				{
					title: '订单编号',
					dataIndex: 'orderSn',
					placeholder: '请输入订单编号',
					change: () => {
						// this.init(true)
					},
				},
				{
					type: 'select',
					title: '扣款类型',
					dataIndex: 'deductType',
					label: 'value',
					options: this.$store.state.app.constant.WITHHOLD_TYPE,
					change: () => {
						// this.init()
					},
				},
				{
					type: 'select',
					title: '确认状态',
					dataIndex: 'verifyState',
					label: 'value',
					options: this.$store.state.app.constant.WITHHOLD_STATUS,
					change: () => {
						// this.init()
					},
				},
				{
					title: '创建人',
					dataIndex: 'createName',
					placeholder: '请输入创建人',
					change: () => {
						// this.init(true)
					},
				},
				{
					title: '商家名称',
					dataIndex: 'supplierName',
					placeholder: '请输入商家名称',
					change: () => {
						// this.init(true)
					},
				},
				{
					title: '创建时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
				},
				{
					title: '变更时间',
					type: 'datetimerange',
					dataIndex: ['changeTimeStart', 'changeTimeEnd'],
				},
			],
			searchAction: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (!this.loading) this.init(true)
					},
				},
				{
					title: '导出',
					auth: 'merchantDeductExport',
					type: 'primary',
					click: () => {
						this.exportIt()
					},
				},
				{
					title: '批量驳回',
					auth: 'batchRejectDeduct',
					type: 'primary',
					click: () => {
						this.handleBatchWithhold()
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					dataIndex: 'orderSn',
					title: '订单编号',
				},
				{
					dataIndex: 'violationSn',
					title: '违规单号',
				},
				{
					dataIndex: 'orderAddTime',
					title: '下单时间',
					type: 'date',
				},
				{
					dataIndex: 'addTime',
					title: '创建时间',
					type: 'date',
				},
				{
					dataIndex: 'supplierName',
					title: '商户名称',
				},
				{
					dataIndex: 'deductType',
					title: '扣款类型',
					customRender: (row) => {
						const optionsArr = [
							'',
							'罚款',
							'补款',
							'其他',
							'商家违规扣款',
							'小额扣款',
							'营销活动结算',
						]
						return optionsArr[row.deductType]
					},
				},
				{
					dataIndex: 'amount',
					title: '确认金额',
					width: '120',
					type: 'amount',
				},
				{
					dataIndex: 'remark',
					title: '备注',
				},
				{
					dataIndex: 'createName',
					title: '创建人',
				},
				{
					dataIndex: 'verifyState',
					title: '确认状态',
					customRender: (row) => {
						const optionsArr = [
							'',
							'待确认',
							'已确认',
							'已拒绝 ',
							'待二次确认  ',
							'二次拒绝 ',
						]
						return optionsArr[row.verifyState]
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '查看详情',
							auth: 'getMerchantDeductDetail',
							click: (row, e, i) => {
								this.withholdDetailDialogVisible = true
								this.withholdDetailDialogData = this.tableData[i].recordList
							},
						},
						{
							title: '驳回',
							auth: 'rejectDeduct',
							dialogId: 103,
							click: (row) => {
								this.refuseIt(row.merchantDeductItemId)
							},
							customRender: (action, row) => {
								action.hide = row.verifyState != 3
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
					this.init()
				},
			},
			withholdDetailDialogColumns: [
				{
					dataIndex: 'addTime',
					title: '变更时间',
					type: 'date',
				},
				{
					dataIndex: 'changeRemark',
					title: '变更备注',
					type: 'custom',
				},
				{
					dataIndex: 'verifyState',
					title: '状态',
					customRender: (row) => {
						// 1、已确认 2拒绝 4扣款完成 5待二次确认 6二次拒绝
						return row.verifyState == 1
							? '已确认'
							: row.verifyState == 2
							? '拒绝'
							: row.verifyState == 4
							? '扣款完成'
							: row.verifyState == 5
							? '待二次确认'
							: row.verifyState == 6
							? '二次拒绝'
							: '-'
					},
				},
				{
					dataIndex: 'createName',
					title: '变更人',
				},
			],
			// 选中的列表
			selectedList: [],
		}
	},

	created() {
		// this.init(true)
	},

	methods: {
		rejectPrompt(batch) {
			return this.$prompt(
				'备注（必填，不超过20字）：',
				`请确定是否驳回${batch ? '已勾选' : '本条'}记录？`,
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
					inputErrorMessage: '请输入驳回理由',
					inputType: 'textarea',
					inputPlaceholder: '请输入驳回理由',
					inputValidator: (value) => {
						// 点击按钮时，对文本框里面的值进行验证
						if (value && value.length > 20) {
							return '字数太长！'
						}
					},
				}
			)
		},
		refuseIt(id) {
			this.rejectPrompt().then(async ({ value }) => {
				const param = {
					merchantDeductItemId: id,
					remark: value,
				}
				const {
					data: { resultCode },
				} = await rejectDeduct(param)
				if (resultCode == 0) {
					this.$message.success('操作成功')
					this.init()
				}
			})
		},
		async exportIt() {
			// 导出数据
			let paramJson = this.findSearchParams()
			this.exportLoading = true
			// let { data } = await merchantDeductExport(paramJson)
			let { data } = await merchantDeductExport({
				data: JSON.stringify(paramJson),
			})
			this.exportLoading = false
			downloadFile(data, '商家扣款列表.xlsx')
		},
		// 初始化及筛选审核列表数据
		async init(flag) {
			this.loading = true
			let paramJson = this.findSearchParams(flag)
			const {
				data: { resultData },
				status,
			} = await merchantDeductList(paramJson)
			if (status === -404) {
				this.$message({
					type: 'error',
					message: '查询超时',
					duration: 3000,
				})
			}
			if (resultData.datalist) {
				this.tableData = resultData.datalist
				this.page.count = resultData.count
			}
			this.loading = false
		},
		// 设置添加时间段
		setDatetimerange(data) {
			let startTime =
				moment().startOf('day').valueOf() - (data - 1) * 24 * 60 * 60 * 1000
			this.searchData.startTime = startTime
		},
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = Object.assign(this.searchData, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})
			return paramJson
		},
		selectionChange(list) {
			this.selectedList = list
		},
		// 批量驳回
		handleBatchWithhold() {
			const merchantDeductItemIdList = this.selectedList
				.filter((item) => item.verifyState === 3)
				.map((item) => item.merchantDeductItemId)
			if (merchantDeductItemIdList.length === 0) {
				this.$message.warning('请勾选需要驳回的订单!')
				return
			}
			this.rejectPrompt(true).then(async ({ value }) => {
				const param = {
					merchantDeductItemIdList,
					remark: value,
				}
				const {
					data: { resultCode },
				} = await batchRejectDeduct(param)
				if (resultCode == 0) {
					this.$message.success('操作成功')
					this.init()
				}
			})
		},
	},
}
</script>

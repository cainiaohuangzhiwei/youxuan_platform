<template>
	<basic-container>
		<div>
			<yx-form
				v-loading="eLoading"
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			>
			</yx-form>

			<el-row>
				<el-table
					v-loading="showLoading"
					ref="multipleTable"
					tooltip-effect="dark"
					:data="tableData"
					style="width: 100%"
					max-height="600px"
					@selection-change="handleSelectionChange"
					>>
					<el-table-column type="selection" width="55"> </el-table-column>
					<el-table-column
						prop="supplierId"
						label="ID"
						width="100"
						fixed="left"
						align="center"
					>
					</el-table-column>
					<el-table-column
						prop="supplierName"
						label="商家名称"
						width="100"
						fixed="left"
					>
					</el-table-column>
					<el-table-column align="center">
						<template slot="header">
							<div class="my_header">
								<span>发货时长 (h)</span>
								<el-tooltip
									class="item"
									effect="dark"
									content="近30天(T-32～T-3)从截单到确认发货的平均时间"
									placement="top"
								>
									<i class="el-icon-question my_el-icon-question"></i>
								</el-tooltip>
							</div>
						</template>
						<el-table-column
							prop="averageDeliverTime"
							label="发货时长(h)"
							width="120"
							align="center"
						>
						</el-table-column>
						<el-table-column
							prop="averageDeliverRanking"
							label="排名"
							width="120"
							align="center"
						>
						</el-table-column>
					</el-table-column>
					<el-table-column align="center">
						<template slot="header">
							<div class="my_header">
								<span>揽收时长(h)</span>
								<el-tooltip
									class="item"
									effect="dark"
									content="近30天(T-32～T-3)从截单到已揽收的平均时间"
									placement="top"
								>
									<i class="el-icon-question my_el-icon-question"></i>
								</el-tooltip>
							</div>
						</template>
						<el-table-column
							prop="averageGetPackageTime"
							label="揽收时长(h)"
							width="120"
							align="center"
						>
						</el-table-column>
						<el-table-column
							prop="averageGetPackageRanking"
							label="排名"
							width="120"
							align="center"
						>
						</el-table-column>
					</el-table-column>
					<el-table-column align="center">
						<template slot="header">
							<div class="my_header">
								<span>签收时长 (h)</span>
								<el-tooltip
									class="item"
									effect="dark"
									content="近30天(T-39～T-10)从截单到已签收的平均时间"
									placement="top"
								>
									<i class="el-icon-question my_el-icon-question"></i>
								</el-tooltip>
							</div>
						</template>
						<el-table-column
							prop="averageSignForTime"
							label="签收时长(h)"
							width="120"
							align="center"
						>
						</el-table-column>
						<el-table-column
							prop="averageSignForRanking"
							label="排名"
							width="120"
							align="center"
						>
						</el-table-column>
					</el-table-column>
					<el-table-column align="center">
						<template slot="header">
							<div class="my_header">
								<span>及时发货率 (%)</span>
								<el-tooltip
									class="item"
									effect="dark"
									content="近30天(T-32～T-3)发货时间早于或等于48小时<br/>（特殊情形下为特殊时间）的订单量/应发货订单量"
									placement="top"
								>
									<i class="el-icon-question my_el-icon-question"></i>
								</el-tooltip>
							</div>
						</template>
						<el-table-column
							prop="onTimeDeliverRate"
							label="及时发货率(%)"
							width="120"
							align="center"
						>
							<template slot-scope="scope">
								<div v-if="scope.row.onTimeDeliverRate">
									{{ (scope.row.onTimeDeliverRate * 100).toFixed(2) }}%
								</div>
								<div v-else>-</div>
							</template>
						</el-table-column>
						<el-table-column
							prop="onTimeDeliverRanking"
							label="排名"
							width="120"
							align="center"
						>
						</el-table-column>
					</el-table-column>
					<el-table-column align="center">
						<template slot="header">
							<div class="my_header">
								<span>虚假发货率 (%)</span>
								<el-tooltip
									class="item"
									effect="dark"
									content="近30天(T-33～T-4)物流单号上传24H物流状态小于等于已揽收的物流单号/总物流单量"
									placement="top"
								>
									<i class="el-icon-question my_el-icon-question"></i>
								</el-tooltip>
							</div>
						</template>
						<el-table-column
							prop="fakeDeliverRate"
							label="虚假发货率(%)"
							width="120"
							align="center"
						>
							<template slot-scope="scope">
								<div v-if="scope.row.fakeDeliverRate">
									{{ (scope.row.fakeDeliverRate * 100).toFixed(2) }}%
								</div>
								<div v-else>-</div>
							</template>
						</el-table-column>
						<el-table-column
							prop="fakeDeliverRanking"
							label="排名"
							width="120"
							align="center"
						>
						</el-table-column>
					</el-table-column>

					<el-table-column align="center">
						<template slot="header">
							<div class="my_header">
								<span>错发漏发率 (%)</span>
								<el-tooltip
									class="item"
									effect="dark"
									content=" 近30天(T-39～T-10)售后原因为商家发错货或少件/漏发且已售后完成的订单量/已发货订单量"
									placement="top"
								>
									<i class="el-icon-question my_el-icon-question"></i>
								</el-tooltip>
							</div>
						</template>
						<el-table-column
							prop="missDeliverRate"
							label="错发漏发率(%)"
							width="120"
							align="center"
						>
							<template slot-scope="scope">
								<div v-if="scope.row.missDeliverRate">
									{{ (scope.row.missDeliverRate * 100).toFixed(2) }}%
								</div>
								<div v-else>-</div>
							</template>
						</el-table-column>
						<el-table-column
							prop="missDeliverRanking"
							label="排名"
							width="120"
							align="center"
						>
						</el-table-column>
					</el-table-column>
					<el-table-column align="center">
						<template slot="header">
							<div class="my_header">
								<span>缺货率 (%)</span>
								<el-tooltip
									class="item"
									effect="dark"
									content="近30天(T-37～T-8)退款单原因为：缺货退款或截单后120小时未发货的订单量/截单后订单量"
									placement="top"
								>
									<i class="el-icon-question my_el-icon-question"></i>
								</el-tooltip>
							</div>
						</template>
						<el-table-column
							prop="noGoodRate"
							label="缺货率(%)"
							width="120"
							align="center"
						>
							<template slot-scope="scope">
								<div v-if="scope.row.noGoodRate">
									{{ (scope.row.noGoodRate * 100).toFixed(2) }}%
								</div>
								<div v-else>-</div>
							</template>
						</el-table-column>
						<el-table-column
							prop="noGoodRanking"
							label="排名"
							width="120"
							align="center"
						>
						</el-table-column>
					</el-table-column>
					<el-table-column
						prop="analysisDate"
						label="时间"
						width="120"
						align="center"
					>
					</el-table-column>
					<el-table-column
						label="操作"
						prop="supplierAccountNumberId"
						width="120"
						fixed="right"
						align="center"
					>
						<template slot-scope="scope">
							<el-link type="primary" @click="goDetail(scope.row)"
								>查看</el-link
							>
						</template>
					</el-table-column>
				</el-table>
				<div class="pagination" v-if="pagination.count">
					<el-pagination
						background
						@size-change="sizeChange"
						@current-change="currentChange"
						:current-page="pagination.currentPage"
						:page-sizes="[10, 30, 50, 100]"
						:page-size="pagination.length"
						layout="total, sizes, prev, pager, next, jumper"
						:total="pagination.count"
					>
					</el-pagination>
				</div>
			</el-row>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import {
	getSupplierGradeList,
	getSupplierGradeListExport,
} from '@/api/monitorController'
import { downloadFile } from '@/utils/helper/common'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		YxForm,
	},
	name: 'FormTable',

	data() {
		return {
			tableData: [],
			eLoading: false,
			showLoading: false,
			formInline: {
				supplierName: '',
				searchDate: moment().startOf('day').valueOf(),
			},
			formCfg: [
				{
					title: '商家名称',
					type: 'input',
					dataIndex: 'supplierName',
					placeholder: '请输入商家名称',
				},
				{
					title: '时间',
					type: 'time',
					dataIndex: 'searchDate',
					timeAttributes: {
						type: 'date',
					},
				},
			],
			formAction: [
				{
					title: '搜索',
					type: 'primary',
					click: () => {
						this.callSupplierAccountNumberTable(true)
					},
				},
				{
					title: '导出',
					auth: 'monitorLogisticsExport',
					type: 'primary',
					click: () => {
						this.exportExcel()
					},
				},
			],
			multipleSelection: [], // 多选
			pagination: {
				count: 10,
				length: 10,
				currentPage: 1,
			},
			list: [],
			formDialog: false,
		}
	},

	created() {
		// this.callSupplierAccountNumberTable(true)
	},

	methods: {
		goDetail(row) {
			console.log('row', row)
			this.$router.push({
				path: `/supply/supplyRatingDetail/${row.supplierId}`,
				query: {
					supplierName: encodeURIComponent(row.supplierName),
				},
			})
		},
		toggleSelection(rows) {
			if (rows) {
				rows.forEach((row) => {
					this.$refs.multipleTable.toggleRowSelection(row)
				})
			} else {
				this.$refs.multipleTable.clearSelection()
			}
		},
		handleSelectionChange(val) {
			this.multipleSelection = val
		},
		sizeChange(val) {
			/** 页码长度变化回调 **/
			this.pagination.length = val
			this.callSupplierAccountNumberTable(true)
		},
		currentChange(val) {
			/** 选中页码下标变化回调 **/
			this.pagination.currentPage = val
			this.callSupplierAccountNumberTable(false)
		},
		// 查询列表数据
		async callSupplierAccountNumberTable(flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultData, resultCode },
			} = await getSupplierGradeList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.datalist || []
				this.pagination.count = resultData.count
			}
		},
		exportExcel: async function () {
			let paramJson = this.findSearchParams()
			if (this.multipleSelection && this.multipleSelection.length > 0) {
				paramJson.analysisSupplierDataIds = this.multipleSelection.map(
					(item) => {
						return item.analysisSupplierDataId
					}
				)
			}
			this.eLoading = true
			let { data } = await getSupplierGradeListExport(paramJson)
			this.eLoading = false
			downloadFile(data, '导出详情.xlsx')
		},
		// 获取筛选的数据
		findSearchParams(flag) {
			let paramJson = this.formInline
			// 每页的加载数据长度
			paramJson.length = this.pagination.length
			// 当前页的条数开始
			if (flag) {
				this.pagination.currentPage = 1
			}
			this.formInline.searchStartDate = this.formInline.searchDate
				? moment(this.formInline.searchDate).valueOf()
				: ''
			this.formInline.searchEndDate = this.formInline.searchDate
				? moment(this.formInline.searchDate).valueOf()
				: ''
			paramJson.startIndex =
				(this.pagination.currentPage - 1) * this.pagination.length
			return paramJson
		},
	},
}
</script>

<style>
.my_header {
	display: flex;
	justify-content: center;
	align-items: center;
}
.my_el-icon-question {
	font-size: 16px;
	margin-left: 10px;
	margin-bottom: 4px;
}
.pagination {
	padding: 30px 0;
	display: flex;
	justify-content: center;
}
</style>

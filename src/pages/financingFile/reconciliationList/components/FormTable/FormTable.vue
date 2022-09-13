<template>
	<basic-container>
		<!-- <el-button type="primary" class="el-icon-right" @click="oldSystem"
			>老系统</el-button
		> -->
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<yx-form
				:inline="true"
				:data="formData105"
				:items="formCfg105"
				:formAction="formAction105"
			>
				<template #chooseGroup>
					<el-input
						v-model="formData105.groupName"
						placeholder="选择分组"
						value-key="groupName"
						label="groupName"
						@focus="selectGroupDialog"
						clearable
						@clear="
							() => {
								formData105.groupName = ''
								formData105.goodsGroupId = ''
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
						v-model="supplierName"
						placeholder="请选择商家"
						@focus="selectSupplier"
						clearable
						@clear="
							() => {
								supplierName = []
								formData105.supplierIds = []
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="handleAdd"
						></el-button>
					</el-input>
				</template>
			</yx-form>
			<el-tab-pane label="首款" name="one" v-if="exportFirstStFinanceList">
				<keep-alive>
					<yx-table
						v-loading="loadingOne"
						:columns="tableColumns"
						:pagination="page"
						:data="tableData"
					></yx-table>
				</keep-alive>
			</el-tab-pane>
			<el-tab-pane label="尾款" name="two" v-if="exportEndStFinanceList">
				<keep-alive>
					<yx-table
						v-loading="loadingOne"
						:columns="tableColumns"
						:pagination="page"
						:data="tableData"
					></yx-table>
				</keep-alive>
			</el-tab-pane>
			<el-tab-pane
				label="往期未结算款项"
				name="three"
				v-if="exportPreviousStFinanceList"
			>
				<keep-alive>
					<yx-table
						v-loading="loadingOne"
						:columns="tableColumns"
						:pagination="page"
						:data="tableData"
					></yx-table>
				</keep-alive>
			</el-tab-pane>
		</el-tabs>
		<!-- 商家列表 -->
		<multitermSupply-dialog
			:itemInfo="supplyRow"
			:visible.sync="formsDialog"
			@fatherMethodInit="fatherMethodInit"
		/>
		<!-- 选择分组弹框 -->
		<selected-group-dialog
			:dialogVisible.sync="dialogGroupVisible"
			:itemInfo.sync="selectedGoodsGroup"
			@selectedMethods="selectedGoodsGroupMethods"
		></selected-group-dialog>
	</basic-container>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import YxForm from '@wg-vue-materials/yx-form'
import moment from 'moment'
import { downloadFile } from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth'
import {
	listFirstStFinancePage,
	listPreviousStFinancePage,
	listEndStFinancePage,
	stFinanceRefundDataFix,
} from '@/api/supplyAmount'
import {
	exportFirstStFinanceList,
	exportEndStFinanceList,
	exportPreviousStFinanceList,
} from '@/api/webImport'
import selectedGroupDialog from '@/components/groupGoods/selectedGroupDialog'
import MultitermSupplyDialog from '@/components/MultitermSupplyDialog'

export default {
	components: {
		BasicContainer,
		YxTable,
		selectedGroupDialog,
		YxForm,
		MultitermSupplyDialog,
	},
	name: 'reconciliationList',
	data() {
		return {
			exportFirstStFinanceList: checkFunctionCode('exportFirstStFinanceList'),
			exportEndStFinanceList: checkFunctionCode('exportEndStFinanceList'),
			exportPreviousStFinanceList: checkFunctionCode(
				'exportPreviousStFinanceList'
			),
			activeName: 'one',
			tableData: [],
			loadingOne: false,
			// 选择分组
			dialogGroupVisible: false,
			selectedGoodsGroup: {},
			supplyRow: [],
			selectGroupList: [],
			formsDialog: false,
			supplierName: [],
			formData105: {
				groupName: '',
				goodsGroupId: '',
				supplierIds: [],
				stFinanceId: '',
				status: '0',
				type: 1,
				startTime: '',
				endTime: '',
				supplierSubmitTimeStart: '',
				supplierSubmitTimeEnd: '',
				firstAuditTimeStart: '',
				firstAuditTimeEnd: '',
			},
			formCfg105: [
				{
					title: '选择分组',
					type: 'custom',
					dataIndex: 'chooseGroup',
					hide: false,
				},
				{
					title: '商家名称',
					type: 'custom',
					dataIndex: 'supplierName',
				},
				{
					title: '对账单ID',
					type: 'input',
					dataIndex: 'stFinanceId',
				},
				{
					type: 'select',
					title: '对账状态',
					dataIndex: 'status',
					placeholder: '请选择对账状态',
					label: 'value',
					options: [
						{
							status: '0',
							value: '全部',
						},
						{
							status: '1',
							value: '待平台确认',
						},
						{
							status: '2',
							value: '待对账',
						},
						{
							status: '3',
							value: '待初审',
						},
						{
							status: '4',
							value: '待复审',
						},
						{
							status: '5',
							value: '待三审',
						},
						{
							status: '6',
							value: '已完成',
						},
						{
							status: '7',
							value: '已关闭',
						},
					],
				},
				{
					title: '创建时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					title: '商家提交对账时间',
					type: 'datetimerange',
					dataIndex: ['supplierSubmitTimeStart', 'supplierSubmitTimeEnd'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					title: '初审时间',
					type: 'datetimerange',
					dataIndex: ['firstAuditTimeStart', 'firstAuditTimeEnd'],
					placeholder: ['开始时间', '结束时间'],
				},
			],
			formAction105: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.listFinancePage(this.activeName)
					},
				},
				{
					title: '导出',
					type: 'primary',
					click: () => {
						this._exportStFinanceList()
					},
				},
			],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'stFinanceId',
					title: '首款对账单ID',
				},
				{
					type: 'string',
					dataIndex: 'goodsGroupId',
					title: '分组ID',
				},
				{
					type: 'string',
					dataIndex: 'groupName',
					title: '分组名称',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场名称',
				},
				{
					type: 'string',
					dataIndex: 'saleStartTime',
					title: '售卖时间',
					customRender: (row) => {
						return row.saleStartTime && row.saleEndTime
							? moment(row.saleStartTime).format('YYYY-MM-DD HH:mm:ss') +
									'-' +
									moment(row.saleEndTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '对账状态',
					customRender: (row) => {
						let arr = [
							'',
							'待平台确认',
							'待对账',
							'待初审',
							'待复审',
							'待三审',
							'已完成',
							'已关闭',
						]
						return arr[row.status]
					},
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '创建时间',
				},
				{
					type: 'data',
					dataIndex: '商家提交对账时间',
					title: '商家提交对账时间',
				},
				{
					type: 'data',
					dataIndex: 'firstAuditTime',
					title: '初审时间',
				},
				{
					type: 'amount',
					dataIndex: 'amount',
					title: '对账金额',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '查看详情',
							click: (row) => {
								// 查看详情
								this.$router.push({
									name: 'billParticulars',
									query: {
										stFinanceId: row.stFinanceId,
										supplierId: row.supplierId,
										moneyToType: row.type,
									},
								})
							},
						},
						{
							title: '修复',
							popconfirm: true,
							popconfirmTitle: '确定修复该对账单？',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							customRender: (action, row) => {
								action.hide = row.type == 1
								return action
							},
							confirm: (row) => {
								this.repair(row.stFinanceId)
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
					this.listFinancePage(this.activeName)
				},
			},
		}
	},
	created() {
		this.listFinancePage(1)
	},
	methods: {
		// 打开老系统
		oldSystem() {
			window.open(`/yhtplus/web/reconciliationList.html`)
		},
		// tab切换
		handleClick(tab) {
			this.supplierName = []
			this.formData105 = {
				groupName: '',
				goodsGroupId: '',
				supplierIds: [],
				stFinanceId: '',
				status: '0',
				type: 1,
				startTime: '',
				endTime: '',
				supplierSubmitTimeStart: '',
				supplierSubmitTimeEnd: '',
				firstAuditTimeStart: '',
				firstAuditTimeEnd: '',
			}
			if (tab.name == 'one') {
				this.tableColumns[0].title = '首款对账单ID'
				this.formCfg105[0].hide = false
				this.formAction105[1].auth = 'exportFirstStFinanceList'
				this.tableColumns.forEach((item) => {
					item.hide = false
				})
				this.listFinancePage(1)
			} else if (tab.name == 'two') {
				this.tableColumns[0].title = '尾款对账单ID'
				this.formAction105[1].auth = 'exportEndStFinanceList'
				this.formCfg105[0].hide = false
				this.tableColumns.forEach((item) => {
					item.hide = false
				})
				this.listFinancePage(2)
			} else {
				this.tableColumns[0].title = '往期数据对账单ID'
				this.formAction105[1].auth = 'exportPreviousStFinanceList'
				this.formCfg105[0].hide = true
				this.tableColumns.forEach((item) => {
					if (
						item.dataIndex == 'goodsGroupId' ||
						item.dataIndex == 'groupName' ||
						item.dataIndex == 'brandName' ||
						item.dataIndex == 'saleStartTime'
					) {
						item.hide = true
					}
				})
				this.listFinancePage(3)
			}
		},
		async repair(stFinanceId) {
			let {
				data: { resultCode },
			} = await stFinanceRefundDataFix({ stFinanceId })
			if (resultCode == 0) {
				let v = this.activeName == 'two' ? 2 : 3
				this.$message({
					message: `成功!`,
					type: 'success',
				})
				this.listFinancePage(v)
			}
		},

		async _exportStFinanceList() {
			// 导出
			let paramJson = this.formData105
			let Url =
				this.activeName == 'one'
					? exportFirstStFinanceList
					: this.activeName == 'two'
					? exportEndStFinanceList
					: exportPreviousStFinanceList
			let { data } = await Url(paramJson)
			let title =
				this.activeName == 'one'
					? '首款对账.xlsx'
					: this.activeName == 'two'
					? '尾款对账.xlsx'
					: '往期对账.xlsx'
			downloadFile(data, title)
		},
		//商家弹窗
		selectSupplier(e) {
			e.target.blur()
			this.formsDialog = true
		},
		//处理商家多选查询
		fatherMethodInit(row = {}) {
			this.selectGroupList = JSON.parse(JSON.stringify(row))
			for (let i = 0; i < row.length; i++) {
				this.supplierName.push(row[i].supplierName) //插入数组
				this.supplierName = [
					//数组防重
					...new Set(this.supplierName),
				]
				this.formData105.supplierIds.push(row[i].supplierId)
				this.formData105.supplierIds = [
					//数组防重
					...new Set(this.formData105.supplierIds),
				]
			}
		},
		handleAdd() {
			this.supplyRow = JSON.parse(JSON.stringify(this.selectGroupList))
			this.formsDialog = true
		},
		// 保存选分组选项数据
		selectGroupDialog(e) {
			e.target.blur()
			this.dialogGroupVisible = true
		},
		// 保存商品分组选择结果
		selectedGoodsGroupMethods(val) {
			this.formData105.groupName = val.groupName
			this.formData105.goodsGroupId = val.goodsGroupId
		},
		// 首页搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = Object.assign(this.formData105, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})
			return paramJson
		},
		// 获取列表
		async listFinancePage(v) {
			let paramJson = this.findSearchParams()
			this.loadingOne = true
			let Url
			if (v == 1 || v == 'one') {
				paramJson.type = 1
				Url = listFirstStFinancePage
			} else if (v == 2 || v == 'two') {
				paramJson.type = 2
				Url = listEndStFinancePage
			} else {
				paramJson.type = 3
				Url = listPreviousStFinancePage
			}
			let {
				data: { resultCode, resultData },
			} = await Url(paramJson)
			this.loadingOne = false
			if (resultCode == 0) {
				this.tableData = resultData.stFinances
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>

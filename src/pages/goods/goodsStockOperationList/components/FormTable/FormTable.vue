<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="advancedData"
				:items="advancedCfg"
				:formAction="advancedAction"
			></yx-form>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>
			<div style="margin-bottom: 10px">
				<el-button
					type="primary"
					v-auth="'getNewGoodsInventoryList'"
					@click="enterDelivery"
					>入库</el-button
				>
				<el-button
					type="primary"
					v-auth="'getNewGoodsInventoryList'"
					@click="enterDelivery"
					>出库</el-button
				>
			</div>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				></yx-table>
			</el-row>
		</div>
		<Dialog
			title="出入库详情信息"
			:visible="outboundLoding"
			width="50%"
			:bottomBtn="outboundDetailsBottomBtn"
			@before-close="outboundLoding = false"
		>
			<div>
				<span>序列号:{{ inventoryChangeMessage.changeSn }}</span>
				<span class="ml20"
					>日期:{{ inventoryChangeMessage.addTime | moment }}</span
				>
				<span class="ml20">操作人:{{ inventoryChangeMessage.clerkName }}</span>
				<span class="ml20"
					>所在仓库:{{ inventoryChangeMessage.warehouseName }}</span
				>
			</div>
			<yx-table
				style="overflow-x: auto; height: 500px"
				v-loading="loading"
				:columns="outboundDetailsTable"
				:data="outboundDetailsTableData"
			>
				<template slot="goodsInventory" slot-scope="scope">
					<div class="slot active">
						<div>
							<p>
								<span class="number">货号：{{ scope.row.goodsNumber }}</span>
							</p>
							<p class="goods_name">{{ scope.row.goodsName }}</p>
						</div>
					</div>
				</template>
			</yx-table>
			<div>
				<p>操作备注:{{ inventoryChangeMessage.remark }}</p>
				<p>经办人:{{ inventoryChangeMessage.clerkName }}</p>
			</div>
		</Dialog>
	</basic-container>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import BasicContainer from '@wg-vue-materials/basic-container'
import {
	getConstantValueByKey,
	numberFormat,
	isNull,
} from '@/utils/helper/common'
import { getGoodsConfiguration } from '@/api/systemConfiguration'
import {
	getInventoryChangeListByCondition,
	getInventoryChangeDetailByInventoryChangeId,
} from '@/api/webGoods'

import moment from 'moment'

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
			showLoading: false,
			outboundLoding: false,
			loading: false,
			inviteCodeListData: [],
			outboundDetailsTableData: [],
			inventoryChangeMessage: [],
			searchData: {
				keyword: '', //关键字
				updateType: 1, //状态
				addTimeStart: moment().startOf('day').valueOf(), //发起开始时间
				addTimeEnd: moment().endOf('day').valueOf(), //发起结束时间
			},
			advancedData: {
				keyword: '',
			},
			outboundDetailsTable: [
				{
					type: 'custom',
					dataIndex: 'goodsInventory',
					title: '商品',
					fixed: 'right',
				},
				{
					type: 'string',
					dataIndex: 'specNumber',
					title: '规格编码',
				},
				{
					type: 'string',
					dataIndex: 'specTwo',
					title: '规格',
					customRender: (row) => {
						let specHtml = ''
						if (
							!isNull(row.specOne) &&
							!isNull(this.inviteCodeListData.specOne)
						) {
							specHtml +=
								this.inviteCodeListData.specOne + '：' + row.specOne + '。'
						}
						if (
							!isNull(row.specTwo) &&
							!isNull(this.inviteCodeListData.specTwo)
						) {
							specHtml +=
								this.inviteCodeListData.specTwo + '：' + row.specTwo + '。'
						}
						if (
							!isNull(row.specThree) &&
							!isNull(this.inviteCodeListData.specThree)
						) {
							specHtml +=
								this.inviteCodeListData.specThree + '：' + row.specThree + '。'
						}
						return specHtml
					},
				},
				{
					type: 'string',
					dataIndex: 'price',
					title: '入库价',
					customRender: (row) => {
						if (
							row.updateType == '2' ||
							row.updateType == '3' ||
							row.updateType == '5' ||
							row.updateType == '9' ||
							row.updateType == '10'
						) {
							return '--'
						} else {
							return isNull(row.price)
								? '--'
								: '￥' + numberFormat(row.price, 2)
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'quantity',
					title: '数量',
				},
				{
					type: 'string',
					dataIndex: 'unit',
					title: '计量单位',
				},
				{
					type: 'string',
					dataIndex: 'supplier',
					title: '商家',
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
			],
			outboundDetailsBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.outboundLoding = false
					},
				},
			],
			advancedCfg: [
				{
					title: '高级搜索',
					type: 'input',
					dataIndex: 'keyword',
					placeholder: '经手人/操作人/操作编号',
				},
			],
			searchCfg: [
				{
					title: '操作类型',
					type: 'select',
					dataIndex: 'updateType',
					placeholder: '全部',
					label: 'value',
					options: this.$store.state.app.constant.OPERATION_TYPE_CODE,
					change: () => {
						this.callGetWarehouseList(true)
					},
				},
				{
					title: ' 操作时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['开始时间', '结束时间'],
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: (e) => {
						this.callGetWarehouseList(true, e)
					},
				},
			],
			advancedAction: [
				{
					title: '搜索',
					type: 'primary',
					click: (e) => {
						this.callGetWarehouseList(true, e)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'changeSn',
					title: '操作编号',
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '日期',
					customRender: (row) => {
						return row.addTime
							? row.addTime + moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'warehouseName',
					title: '所在仓库',
				},
				{
					type: 'string',
					dataIndex: 'updateType',
					title: '操作类型',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.OPERATION_TYPE_CODE,
							row.updateType,
							'-',
							'updateType'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'clerkName',
					title: '经手人',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '详情',
							click: (row) => {
								this.getStockUpdateListByCondition(row)
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
					this.callGetWarehouseList()
				},
			},
		}
	},
	created() {
		this.addGetGoodsConfiguration(true)
		this.callGetWarehouseList(true)
	},

	methods: {
		async getStockUpdateListByCondition(row) {
			console.log('row', row)
			this.outboundLoding = true
			this.loading = true
			let paramJson = {
				inventoryChangeId: row.inventoryChangeId,
			}
			let {
				data: { resultCode, resultData },
			} = await getInventoryChangeDetailByInventoryChangeId(paramJson)
			this.loading = false
			if (resultCode === 0) {
				this.outboundDetailsTableData = resultData.stockUpdateList
				this.inventoryChangeMessage = resultData.inventoryChange
			} else {
				this.outboundDetailsTableData = []
			}
		},
		addGetGoodsConfiguration: async function () {
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await getGoodsConfiguration()
			if (resultCode === 0) {
				this.inviteCodeListData = resultData.goodsType
			} else {
				this.inviteCodeListData = []
			}
		},
		enterDelivery() {
			this.$router.push({
				path: `newStockOperationOperation`,
			})
		},

		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
				type: 1,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		callGetWarehouseList: async function (flag, e) {
			let paramJson = this.findSearchParams(flag)
			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await getInventoryChangeListByCondition(paramJson, custom)
			this.showLoading = false
			if (resultCode === 0) {
				this.tableData = resultData.inventoryChangeList
				this.page.count = resultData.inventoryChangeCount
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>

<style>
.ml20 {
	margin-left: 20px;
}
</style>

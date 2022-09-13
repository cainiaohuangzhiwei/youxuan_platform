<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>
			<el-row class="button_row">
				<el-button size="small" @click="_exportAppGroupSale" type="primary"
					>导出</el-button
				>
			</el-row>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:select="true"
					:columns="tableColumns"
					:selectionChange="selectionChange"
					:pagination="page"
					:data="tableData"
				></yx-table>
			</el-row>
		</div>
	</basic-container>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import BasicContainer from '@wg-vue-materials/basic-container'
import { downloadFile } from '@/utils/helper/common'
import { exportAppGroup, listAppGroup } from '@/api/cmsAppGroupShopkeeperSale'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			showLoading: false,
			searchData: {
				shopId: '', //店铺ID
				shopName: '', //店铺名称
				status: this.$route.params.status, //状态
				startTime: 0,
				endTime: 0,
				groupId: this.$route.params.groupId,
			},
			selectedList: [],
			searchCfg: [
				{
					title: '店铺ID',
					type: 'input',
					dataIndex: 'shopId',
					placeholder: '请输入店铺ID',
				},
				{
					title: '店铺名称',
					type: 'input',
					dataIndex: 'shopName',
					placeholder: '请输入店铺名称',
				},
				{
					title: '时间选择',
					type: 'select',
					label: 'value',
					dataIndex: 'status',
					change: (val) => {
						this.setDataTimer(val)
					},
					options: this.$store.state.app.constant.SALE_TIME_SELECTION,
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: (e) => {
						this.callInviteCodeListByCondition(true, e)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'shopId',
					title: '店铺id',
				},
				{
					type: 'string',
					dataIndex: 'shopName',
					title: '店铺名称',
				},
				{
					type: 'string',
					dataIndex: 'saleOrderCount',
					title: '销售订单数',
				},
				{
					type: 'string',
					dataIndex: 'saleAmount',
					title: '销售额',
					customRender: (row) => {
						return row.saleAmount ? '￥' + row.saleAmount : '0'
					},
				},
				{
					type: 'string',
					dataIndex: 'commission',
					title: '可赚金',
					customRender: (row) => {
						return row.commission ? '￥' + row.commission : '0'
					},
				},
				{
					type: 'string',
					dataIndex: 'afterSalesRate',
					title: '售后率',
					customRender: (row) => {
						return row.afterSalesRate ? row.afterSalesRate : '0'
					},
				},
				{
					type: 'string',
					dataIndex: 'refundAmount',
					title: '售后退款额',
					customRender: (row) => {
						return row.refundAmount ? '￥' + row.refundAmount : '0'
					},
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.callInviteCodeListByCondition()
				},
			},
		}
	},
	created() {
		this.setDataTimer(this.$route.params.status)
		this.callInviteCodeListByCondition(true)
	},

	watch: {
		searchData: {
			handler(newValue) {
				this.searchData.shopId = newValue.shopId.replace(/[^\d]/g, '')
			},
			deep: true,
		},
	},
	methods: {
		setDataTimer(type) {
			// 设置时间
			switch (type) {
				case '0':
					this.searchData.startTime =
						moment().startOf('day').valueOf() - 24 * 60 * 60 * 1000
					this.searchData.endTime =
						moment().endOf('day').valueOf() - 24 * 60 * 60 * 1000
					break
				case '2':
					this.searchData.startTime =
						moment().startOf('day').valueOf() - 24 * 60 * 60 * 1000 * 3
					this.searchData.endTime =
						moment().endOf('day').valueOf() - 24 * 60 * 60 * 1000
					break
				case '3':
					this.searchData.startTime =
						moment().startOf('week').valueOf() + 24 * 60 * 60 * 1000
					this.searchData.endTime =
						moment().endOf('week').valueOf() + 24 * 60 * 60 * 1000
					break
				case '4':
					this.searchData.startTime =
						moment().startOf('week').subtract('week', 1).valueOf() +
						24 * 60 * 60 * 1000
					this.searchData.endTime =
						moment().endOf('week').subtract('week', 1).valueOf() +
						24 * 60 * 60 * 1000
					break
				case '5':
					this.searchData.startTime = moment().startOf('month').valueOf()
					this.searchData.endTime = moment().endOf('month').valueOf()
					break
				case '6':
					this.searchData.startTime = moment()
						.startOf('month')
						.subtract('month', 1)
						.valueOf()
					this.searchData.endTime = moment()
						.subtract('month', 1)
						.endOf('month')
						.valueOf()
					break
			}
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
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
		callInviteCodeListByCondition: async function (flag) {
			this.showLoading = true
			let paramJson = JSON.parse(JSON.stringify(this.findSearchParams(flag)))
			delete paramJson.status
			let {
				data: { resultCode, resultData },
			} = await listAppGroup(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.records
				this.page.count = resultData.total
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		selectionChange(list) {
			this.selectedList = list
		},

		_exportAppGroupSale: async function () {
			let paramJson = Object.assign({}, this.searchData)
			delete paramJson.status
			paramJson.shopIds = this.selectedList.map((item) => {
				return item.shopId
			})
			let { data } = await exportAppGroup({
				data: JSON.stringify(paramJson),
			})
			downloadFile(data, '群销售数据.xlsx')
		},
	},
}
</script>

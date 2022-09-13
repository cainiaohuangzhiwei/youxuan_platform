<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>
			<div>注：以下销售数据统计至昨日的总销售情况</div>
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
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { downloadFile } from '@/utils/helper/common'
import {
	listAppGroupShopkeeper,
	exportAppGroupShopkeeper,
} from '@/api/cmsAppGroupShopkeeperSale.js'
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
				joinGroupStartTime: '',
				joinGroupEndTime: '',
				quitGroupStartTime: '',
				quitGroupEndTime: '',
				shopId: this.$route.query.shopId,
			},
			orderStatus: [],
			searchCfg: [
				{
					title: '加入群时间',
					type: 'datetimerange',
					dataIndex: ['joinGroupStartTime', 'joinGroupEndTime'],
				},
				{
					title: '脱离群时间',
					type: 'datetimerange',
					dataIndex: ['quitGroupStartTime', 'quitGroupEndTime'],
				},
			],
			searchAction: [
				{
					title: '搜索',
					type: 'primary',
					click: () => {
						this._listAppGroupShopkeeper(true)
					},
				},
				{
					title: '导出',
					type: 'primary',
					auth: 'exportAppGroupShopkeeper',
					click: () => {
						this._exportAppGroupShopkeeper()
					},
				},
			],
			tableData: [],
			selectedList: [],
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
					dataIndex: 'groupName',
					title: '所在群组',
				},
				{
					type: 'data',
					dataIndex: 'joinGroupTime',
					title: '加入群时间',
				},
				{
					type: 'string',
					dataIndex: 'quitGroupTime',
					title: '脱离群时间',
					customRender: (row) => {
						if (row.quitGroupTime == 1) {
							return '不在该群'
						} else {
							return row.quitGroupTime
								? moment(row.quitGroupTime).format('YYYY-MM-DD HH:mm:ss')
								: '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'saleOrderCount',
					title: '在本群销售订单数',
					customRender: (row) => {
						return row.saleOrderCount ? row.saleOrderCount : '0'
					},
				},
				{
					type: 'string',
					dataIndex: 'saleAmount',
					title: '在本群销售额',
					customRender: (row) => {
						return row.saleAmount ? '￥' + row.saleAmount : '0'
					},
				},
				{
					type: 'string',
					dataIndex: 'commission',
					title: '在本群佣金',
					customRender: (row) => {
						return row.commission ? '￥' + row.commission : '0'
					},
				},
				{
					type: 'string',
					dataIndex: 'afterSalesRate',
					title: '在本群售后率',
					customRender: (row) => {
						return row.afterSalesRate ? row.afterSalesRate : '0'
					},
				},
				{
					type: 'string',
					dataIndex: 'refundAmount',
					title: '在本群售后退款额',
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
					this._listAppGroupShopkeeper()
				},
			},
		}
	},

	created() {
		this.searchData.shopId = this.$route.query.shopId || ''
	},

	watch: {
		$route: {
			immediate: true,
			deep: true,
			handler(newValue) {
				const ids = newValue.query.shopId || ''
				this.searchData.shopId = ids
				if (ids) {
					this._listAppGroupShopkeeper(true)
				}
			},
		},
	},
	methods: {
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
		async _listAppGroupShopkeeper(flag) {
			// 获取列表
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			paramJson.groupId = ''
			let {
				data: { resultCode, resultData },
			} = await listAppGroupShopkeeper(paramJson)
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
		_exportAppGroupShopkeeper: async function () {
			// 导出
			let paramJson = Object.assign({}, this.searchData)
			delete paramJson.status
			paramJson.groupId = ''
			paramJson.shopIds = this.selectedList.map((item) => {
				return item.shopId
			})
			paramJson.joinGroupTimes = this.selectedList.map((item) => {
				return item.joinGroupTime
			})
			let { data } = await exportAppGroupShopkeeper({
				data: JSON.stringify(paramJson),
			})
			downloadFile(data, '店主数据.xlsx')
		},
	},
}
</script>

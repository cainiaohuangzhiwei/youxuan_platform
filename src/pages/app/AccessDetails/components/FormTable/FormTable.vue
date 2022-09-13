<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>
			<el-row class="button_row mb20">
				<el-button
					size="small"
					@click="_exportAppGroupShopkeeper"
					type="primary"
					>导出</el-button
				>
			</el-row>
			<div style="margin-left: 20px">
				注：以下销售数据统计至昨日的在本群总销售情况
			</div>
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
import {
	listAppGroupShopkeeper,
	exportAppGroupShopkeeper,
} from '@/api/cmsAppGroupShopkeeperSale'
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
				status: '0', //状态
				joinGroupStartTime: '',
				joinGroupEndTime: '',
				quitGroupStartTime: '',
				quitGroupEndTime: '',
				groupId: this.$route.query.groupId,
			},
			statusList: [],
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
					title: '加入群时间',
					type: 'datetimerange',
					dataIndex: ['joinGroupStartTime', 'joinGroupEndTime'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					title: '脱离群时间',
					type: 'datetimerange',
					dataIndex: ['quitGroupStartTime', 'quitGroupEndTime'],
					placeholder: ['开始时间', '结束时间'],
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
					dataIndex: 'joinGroupTime',
					title: '加入群时间',
					customRender: (row) => {
						return row.joinGroupTime
							? moment(row.joinGroupTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
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
						return row.refundAmount ? row.refundAmount : '0'
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
	beforeCreate: function () {
		this.statusList = JSON.parse(
			JSON.stringify(this.$store.state.app.constant.SALE_TIME_SELECTION)
		)
	},
	created() {
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
		findSearchParams(flag) {
			//搜索条件
			const {
				quitGroupStartTime,
				quitGroupEndTime,
				joinGroupStartTime,
				joinGroupEndTime,
			} = this.searchData
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = Object.assign(this.searchData, {
				quitGroupStartTime: moment(quitGroupStartTime).valueOf() || '',
				quitGroupEndTime: moment(quitGroupEndTime).valueOf() || '',
				joinGroupStartTime: moment(joinGroupStartTime).valueOf() || '',
				joinGroupEndTime: moment(joinGroupEndTime).valueOf() || '',
				startIndex: (this.page.currentPage - 1) * this.page.length,
				length: this.page.length,
			})
			return paramJson
		},
		callInviteCodeListByCondition: async function (flag, e) {
			let paramJson = this.findSearchParams(flag)
			delete paramJson.status
			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await listAppGroupShopkeeper(paramJson, custom)
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
			let paramJson = Object.assign({}, this.searchData)
			delete paramJson.status
			if (this.selectedList) {
				paramJson.shopIds = this.selectedList.map((item) => {
					return item.shopId
				})
				paramJson.joinGroupTimes = this.selectedList.map((item) => {
					return item.joinGroupTime
				})
			}

			let { data } = await exportAppGroupShopkeeper({
				data: JSON.stringify(paramJson),
			})
			downloadFile(data, '群在售店主销售详情.xlsx')
		},
	},
}
</script>

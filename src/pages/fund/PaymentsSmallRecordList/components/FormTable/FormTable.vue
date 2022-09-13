<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			>
			</yx-form>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:select="true"
					:data="tableData"
					:selectionChange="selectionChange"
				>
					<template slot="transferringAccount" slot-scope="scope">
						<div>
							<p>{{ scope.row.transferOutAccountName }}</p>
							<p>{{ scope.row.transferOutAccountId }}</p>
						</div>
					</template>
				</yx-table>
			</el-row>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import { numberFormat } from '@/utils/helper/common'
import YxTable from '@wg-vue-materials/yx-table'
import { smallRemitPage } from '@/api/yxCompensationAmount'

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
			numberFormat: numberFormat,
			showLoading: false,
			selectionData: [],
			searchData: {
				addTimeStart: moment().startOf('day').valueOf(), // 开始时间
				addTimeEnd: moment().endOf('day').valueOf(), // 结束时间
				remitType: '', // 打款类型
				orderSn: '', // 订单号
				businessSn: '', // 打款单号
			},
			searchCfg: [
				{
					type: 'input',
					title: '打款单号',
					dataIndex: 'businessSn',
				},
				{
					type: 'input',
					title: '订单号',
					dataIndex: 'orderSn',
				},

				{
					type: 'select',
					title: '打款类型',
					dataIndex: 'remitType',
					label: 'value',
					options: [
						{
							remitType: '',
							value: '全部',
						},
						{
							remitType: 1,
							value: '小额打款',
						},
						{
							remitType: 2,
							value: '营销费用',
						},
						{
							remitType: 3,
							value: '运保卡赔付',
						},
					],
				},
				{
					title: '创建时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
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
						this._fundAccountTransferList(true)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '创建时间',
				},
				{
					type: 'string',
					dataIndex: 'businessSn',
					title: '打款单号',
				},
				{
					type: 'string',
					dataIndex: 'orderSn',
					title: '订单号',
				},
				{
					type: 'string',
					dataIndex: 'remitType',
					title: '打款类型',
					customRender: (row) => {
						// 打款类型:1.售后补款 2.店主营销费用打款 3.运保卡赔付
						return row.remitType == 1
							? '售后补款'
							: row.remitType == 2
							? '店主营销费用打款'
							: '运保卡赔付'
					},
				},
				{
					type: 'amount',
					dataIndex: 'remitAmount',
					title: '打款金额',
				},

				{
					type: 'amount',
					dataIndex: 'platformRemitAmount',
					title: '平台承担金额',
				},
				{
					type: 'amount',
					dataIndex: 'merchantRemitAmount',
					title: '商家承担金额',
				},
				{
					type: 'string',
					dataIndex: 'remitReason',
					title: '打款备注',
				},
				{
					type: 'string',
					dataIndex: 'originatorName',
					title: '打款人',
				},
				{
					type: 'string',
					dataIndex: 'remitType',
					title: '款项回收状态',
					customRender: (row) => {
						// 打款类型:1.售后补款 2.店主营销费用打款 3.运保卡赔付
						return row.remitType == 1
							? '售后补款'
							: row.remitType == 2
							? '店主营销费用打款'
							: row.remitType == 3
							? '运保卡赔付'
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'remitStatus',
					title: '打款状态',
					customRender: (row) => {
						// 打款状态:0.预发起 1.打款中 2.打款成功 3.打款失败
						return row.remitStatus == 1
							? '打款中'
							: row.remitStatus == 2
							? '打款成功'
							: row.remitStatus == 3
							? '打款失败(' + row.remark + ')'
							: '预发起'
					},
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._fundAccountTransferList()
				},
			},
		}
	},

	created() {
		this._fundAccountTransferList(true)
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
		_fundAccountTransferList: async function (flag) {
			let paramJson = this.findSearchParams(flag)
			this.showLoading = true
			let {
				data: {
					resultCode,
					resultData: { recordList = [], totalCount = 0 },
				},
			} = await smallRemitPage(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = recordList
				this.page.count = totalCount
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.amount_box {
	margin: 20px 0;
	span {
		font-size: 26px;
		font-weight: bold;
	}
}
.wi100 {
	width: 100px;
}
</style>

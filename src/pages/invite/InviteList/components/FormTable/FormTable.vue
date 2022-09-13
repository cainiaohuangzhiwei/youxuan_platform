<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
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
import { wgGetDate, getConstantValueByKey } from '@/utils/helper/common'
import { getInviteCodeListByCondition } from '@/api/yhtPlusCmsInviteCode'
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
				type: 1,
				keyword: '', //关键字
				status: '', //状态
				startTime: wgGetDate().getMonthStartDate, //购买开始时间
				endTime: wgGetDate().getMonthEndDate, //购买结束时间
				startTimeUse: '', //使用开始时间
				endTimeUse: '', //使用结束时间
			},
			statusList: [],
			invitationCodeGenerationType: [
				{
					key: 1,
					value: '自己付费加入',
				},
				{
					key: 2,
					value: '付费',
				},
				{
					key: 3,
					value: '组织创建',
				},
				{
					key: 4,
					value: '系统生成',
				},
				{
					key: 5,
					value: '手动生成',
				},
			],
			searchCfg: [
				{
					title: '关键字',
					type: 'input',
					dataIndex: 'keyword',
					placeholder: '手机号/店铺名称',
				},
				// TODO:
				{
					title: '状态',
					type: 'select',
					dataIndex: 'status',
					placeholder: '全部',
					label: 'value',
					options: this.statusList,
					change: () => {
						this.callInviteCodeListByCondition(true)
					},
				},
				{
					title: '购买时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					title: '使用时间',
					type: 'datetimerange',
					dataIndex: ['startTimeUse', 'endTimeUse'],
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
					dataIndex: 'inviteCode',
					title: '邀请码',
				},
				{
					type: 'string',
					dataIndex: 'phoneMob',
					title: '购买手机号',
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '购买/生成时间',
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.INVITATION_CODE_STATUS,
							row.status,
							'-',
							'status'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '类型',
					customRender: (
						row
						// column
					) => {
						return getConstantValueByKey(
							this.invitationCodeGenerationType,
							row.payType,
							''
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
				{
					type: 'string',
					dataIndex: 'useTime',
					title: '使用日期',
					customRender: (row) => {
						return row.useTime
							? moment(row.useTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'useOrganizationName',
					title: '使用店铺',
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
			JSON.stringify(this.$store.state.app.constant.INVITATION_CODE_STATUS)
		)
		this.statusList.splice(1, 1)
		this.statusList.splice(3, 1)
	},
	created() {
		this.callInviteCodeListByCondition(true)
	},

	methods: {
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
			paramJson.startTime = moment(paramJson.startTime).valueOf() || ''
			paramJson.endTime = moment(paramJson.endTime).valueOf() || ''
			paramJson.startTimeUse = moment(paramJson.startTimeUse).valueOf() || ''
			paramJson.endTimeUse = moment(paramJson.endTimeUse).valueOf() || ''
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		callInviteCodeListByCondition: async function (flag, e) {
			let paramJson = this.findSearchParams(flag)
			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await getInviteCodeListByCondition(paramJson, custom)
			this.showLoading = false
			if (resultCode === 0) {
				this.tableData = resultData.inviteCodeList
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>

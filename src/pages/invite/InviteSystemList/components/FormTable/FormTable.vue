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
				<el-button
					v-auth="'batchAddInviteCode'"
					size="small"
					@click="batchAddInviteCode(false)"
					type="primary"
					>生成邀请码</el-button
				>
				<el-button
					v-auth="'batchAddInviteCode'"
					size="small"
					@click="batchAddInviteCode(true)"
					type="primary"
					>批量生成</el-button
				>
			</el-row>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:selectionChange="selectionChange"
					:pagination="page"
					:data="tableData"
				></yx-table>
			</el-row>
		</div>
		<el-dialog title="生成邀请码" :visible.sync="dialogVisibleAddInviteCode">
			<yx-form
				:labelWidth="'80px'"
				:rules="addInviteCoderules"
				:data="addInviteCodeData"
				:items="addInviteCodeItems"
				:formAction="addInviteCodeAction"
			></yx-form>
		</el-dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { wgGetDate, getConstantValueByKey } from '@/utils/helper/common'
import {
	getInviteCodeListByCondition,
	batchAddInviteCode,
} from '@/api/yhtPlusCmsInviteCode'
import moment from 'moment'
let that
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
			addInviteCoderules: {
				inviteCodeCount: [
					{ required: true, message: '请输入生成数量', trigger: 'blur' },
				],
				remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
			},
			addInviteCodeData: {
				inviteCodeCount: 1, // 邀请码数量
				remark: '', // 备注
				usefulTime: '', // 使用期限
			},
			addInviteCodeAction: [
				{
					title: '确定',
					type: 'primary',
					click: (e) => {
						this.saveBatchInvite(e)
					},
				},
			],
			addInviteCodeItems: [
				{
					title: '生成数量',
					type: 'inputNumber',
					dataIndex: 'inviteCodeCount',
				},
				{
					title: '使用期限',
					type: 'time',
					timeAttributes: {
						type: 'datetime',
					},
					dataIndex: 'usefulTime',
				},
				{
					title: '备注',
					type: 'textarea',
					dataIndex: 'remark',
				},
			],
			dialogVisibleAddInviteCode: false,
			searchData: {
				keyword: '',
				status: '',
				startTime: wgGetDate().getMonthStartDate,
				endTime: wgGetDate().getMonthEndDate,
				startTimeUse: '',
				endTimeUse: '',
			},
			statusList: [],
			orderStatus: [],
			searchCfg: [
				{
					title: '关键字',
					type: 'input',
					dataIndex: 'keyword',
					placeholder: '手机号/店铺名称/备注',
				},
				{
					title: '状态',
					type: 'select',
					dataIndex: 'status',
					placeholder: '全部',
					label: 'value',
					options: this.statusList,
				},
				{
					title: '生成时间',
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
					dataIndex: 'inviteCodeId',
					title: '邀请码ID',
				},
				{
					type: 'string',
					dataIndex: 'inviteCode',
					title: '邀请码',
				},
				{
					type: 'string',
					dataIndex: 'addTime',
					title: '生成日期',
					customRender: (row) => {
						return row.addTime
							? moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'expiryTime',
					title: '有效日期',
					customRender: (row) => {
						return row.expiryTime
							? moment(row.addTime + row.expiryTime).format(
									'YYYY-MM-DD HH:mm:ss'
							  )
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
				{
					type: 'string',
					dataIndex: 'brandState',
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
		that = this
		this.statusList = JSON.parse(
			JSON.stringify(this.$store.state.app.constant.INVITATION_CODE_STATUS)
		)
		this.statusList.splice(1, 1)
		this.statusList.splice(3, 1)
	},
	created() {
		this.callInviteCodeListByCondition()
	},

	methods: {
		saveBatchInvite: async function (e) {
			let paramJson = {
				inviteCodeCount: this.addInviteCodeData.inviteCodeCount,
				remark: this.addInviteCodeData.remark,
			}
			if (paramJson.inviteCodeCount <= 0) {
				this.$message.error({
					duration: 1000,
					message: '邀请码数量要大于0',
				})
				return false
			}
			if (this.addInviteCodeData.usefulTime) {
				if (
					moment(this.addInviteCodeData.usefulTime).valueOf() <=
					moment().valueOf()
				) {
					this.$message.error({
						duration: 1000,
						message: '使用时间不能小于或等于当前时间',
					})
					return
				}
				paramJson.usefulTime = moment(
					this.addInviteCodeData.usefulTime
				).valueOf()
				paramJson.isValidity = 1
			} else {
				paramJson.isValidity = 2
			}
			let custom = {
				uid: e.currentTarget.__vue__._uid,
			}
			if (!this.dialogVisibleAddInviteCode) {
				return
			}
			let {
				data: { resultCode, resultMsg },
			} = await batchAddInviteCode(paramJson, custom)
			if (resultCode === 0) {
				that.dialogVisibleAddInviteCode = false
				this.$message.success({
					message: resultMsg,
					duration: 1000,
					onClose() {
						that.callInviteCodeListByCondition(true)
					},
				})
			}
		},
		batchAddInviteCode(flag) {
			this.addInviteCodeData = {
				inviteCodeCount: 1, // 邀请码数量
				remark: '', // 备注
				usefulTime: '', // 使用期限
			}
			if (flag && this.addInviteCodeItems.length == 2) {
				this.addInviteCodeItems.unshift({
					title: '生成数量',
					type: 'inputNumber',
					dataIndex: 'inviteCodeCount',
				})
			} else if (!flag && this.addInviteCodeItems.length === 3) {
				this.addInviteCodeItems.splice(0, 1)
			}
			this.dialogVisibleAddInviteCode = true
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
				type: 2,
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
			let custom = {}
			if (e) {
				custom = {
					uid: e.currentTarget.__vue__._uid,
				}
			}
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

<style lang="scss" scope>
.button_row {
	margin-bottom: 20px;
}
</style>

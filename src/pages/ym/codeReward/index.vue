<template>
	<div class="codeReward">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData108"
				:items="formCfg108"
				:formAction="formAction108"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns109"
				:pagination="page109"
				:data="tableData109"
			>
				<template slot="status" slot-scope="scope">
					<div>
						<template v-if="scope.row.state == 1">
							<div>
								<el-tag v-if="curTime < scope.row.orderStartTime" type="danger"
									>未开始</el-tag
								>
								<el-tag
									v-if="
										curTime >= scope.row.orderStartTime &&
										curTime > scope.row.orderEndTime
									"
									type="info"
									>已结束</el-tag
								>
								<el-tag
									v-if="
										curTime >= scope.row.orderStartTime &&
										curTime <= scope.row.orderEndTime
									"
									>进行中</el-tag
								>
							</div>
						</template>
						<el-tag v-if="scope.row.state != 1" type="info">禁用</el-tag>
					</div>
				</template>
			</yx-table>
			<Dialog
				:title="dialogTitle110"
				:visible="dialogVisible110"
				:width="dialogWidth110"
				:bottomBtn="dialogBottomBtn110"
				@before-close="dialogVisible110 = false"
			>
				<yx-table
					:select="false"
					v-loading="loading111"
					:columns="tableColumns111"
					:pagination="page111"
					:data="tableData111"
				></yx-table>
			</Dialog>
			<Dialog
				:title="dialogTitle113"
				:visible="dialogVisible113"
				:width="dialogWidth113"
				:bottomBtn="dialogBottomBtn113"
				@before-close="dialogVisible113 = false"
			>
				<yx-form
					labelWidth="120px"
					:data="formData114"
					:items="formCfg114"
					:formAction="formAction114"
					:rules="formRules114"
					:formDisabled="true"
				>
					<template slot="codeRewardList">
						<div>
							<div
								class="mutual-reward-list"
								v-for="(item, index) in totalCodeReward"
								:key="index"
							>
								<div class="code-item">
									销售额：<el-input
										class="input-item"
										type="number"
										v-model="item.startCodeReward"
									></el-input
									>-<el-input
										class="input-item"
										type="number"
										v-model="item.endCodeReward"
									></el-input
									>元，奖励邀请码<el-input
										class="input-item"
										type="number"
										onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
										v-model="item.sendCodeReward"
									></el-input
									>个
								</div>
							</div>
						</div>
					</template>
					<template slot="organizationList">
						<div>
							不奖励店主：
							<p>
								<span v-for="(item, index) in organizationList" :key="index"
									>{{ item.organizationName
									}}{{ index >= organizationList.length - 1 ? '' : ',' }}</span
								>
							</p>
						</div>
					</template>
				</yx-form>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import {
	getActInviteCodeByCondition,
	getActInviteCodeRecordByCondition,
	saveActInviteCode,
	getActInviteCodeById,
} from '@/api/yhtPlusCmsAct'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},
	props: [],
	data() {
		return {
			totalCodeReward: [],
			organizationList: [],
			dialogTitle113: '奖励邀请码',
			dialogWidth113: '800px',
			dialogVisible113: false,
			dialogBottomBtn113: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible113 = false
					},
				},
			],
			formData114: {
				orderStartTime: '',
				orderEndTime: '',
				inviteCodeEffectiveTime: '',
				remark: '',
			},
			formCfg114: [
				{
					title: '下单时间',
					type: 'datetimerange',
					dataIndex: ['orderStartTime', 'orderEndTime'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
				},
				{
					title: '邀请码有效期',
					type: 'time',
					timeAttributes: {
						type: 'datetime',
					},
					dataIndex: 'inviteCodeEffectiveTime',
					placeholder: '请选择邀请码有效期',
				},
				{
					title: '邀请码备注',
					type: 'textarea',
					dataIndex: 'remark',
					placeholder: '请输入邀请码备注',
				},
				{
					type: 'custom',
					dataIndex: 'codeRewardList',
					unformItem: true,
				},
				{
					type: 'custom',
					dataIndex: 'organizationList',
					unformItem: true,
				},
			],
			formAction114: [],
			loading111: false,
			curTime: new Date().getTime(),
			loading: false,
			formData108: {
				startTime: '',
				endTime: '',
				status: '',
			},
			formCfg108: [
				{
					title: '结束时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
				{
					title: '活动状态',
					type: 'select',
					dataIndex: 'status',
					placeholder: '请输入placeholder',
					label: 'value',
					options: [
						{
							value: '全部',
							status: '',
						},
						{
							status: 1,
							value: '未开始',
						},
						{
							status: 2,
							value: '进行中',
						},
						{
							status: 3,
							value: '已结束',
						},
					],
				},
			],
			formAction108: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData109(true)
					},
					tableId: 109,
				},
			],
			tableData109: [],
			tableColumns109: [
				{
					type: 'string',
					dataIndex: 'orderStartTime',
					title: '活动时间',
					customRender: (row) => {
						return (
							moment(row.orderStartTime).format('YYYY-MM-DD') +
							'——' +
							moment(row.orderEndTime).format('YYYY-MM-DD')
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'organizationCount',
					title: '达标店主数',
				},
				{
					type: 'string',
					dataIndex: 'inviteCodeCount',
					title: '发放邀请码数',
				},
				{
					type: 'custom',
					dataIndex: 'status',
					title: '状态',
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '查看活动配置',
							auth: '',
							dialogId: '',
							click: ({ actInviteCodeId }) => {
								this._getActInviteCodeById(actInviteCodeId)
							},
						},
						{
							title: '禁用',
							click: (row) => {
								this._saveActInviteCode(row)
							},
							customRender: (action, row) => {
								action.title = row.state == 1 ? '禁用' : '开启'
								action.hide =
									this.curTime < row.orderStartTime ||
									this.curTime > row.orderEndTime
								return action
							},
						},
						{
							title: '查看活动数据',
							auth: '',
							dialogId: 110,
							click: ({ actInviteCodeId, orderStartTime, orderEndTime }) => {
								this.tableData111 = []
								this.actInviteCodeId = actInviteCodeId
								this.dialogVisible110 = true
								this.dialogTitle110 =
									moment(orderStartTime).format('YYYY-MM-DD HH:mm:ss') +
									'——' +
									moment(orderEndTime).format('YYYY-MM-DD HH:mm:ss')
								this.formData108 = {
									startTime: '',
									endTime: '',
									status: '',
								}
								this.getData111(true)
							},
							customRender: (action, row) => {
								let hide = this.curTime >= row.orderStartTime
								action.hide = !hide
								return action
							},
						},
					],
				},
			],
			page109: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData109()
				},
			},
			dialogTitle110: '',
			dialogWidth110: '800px',
			dialogVisible110: false,
			dialogBottomBtn110: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible110 = false
					},
				},
			],
			tableData111: [],
			tableColumns111: [
				{
					type: 'string',
					dataIndex: 'organizationName',
					title: '店铺名称',
				},
				{
					type: 'string',
					dataIndex: 'salesVolume',
					title: '销售额',
				},
				{
					type: 'string',
					dataIndex: 'inviteCodeCount',
					title: '奖励邀请码数量',
				},
			],
			page111: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData111()
				},
			},
			actInviteCodeId: '',
		}
	},

	created() {
		this.getData109(true)
	},

	methods: {
		_getActInviteCodeById: async function (actInviteCodeId) {
			let {
				data: { resultCode, resultData },
			} = await getActInviteCodeById({ actInviteCodeId })
			if (resultCode == 0) {
				this.formData114 = {
					orderStartTime: resultData.actInviteCode.orderStartTime,
					orderEndTime: resultData.actInviteCode.orderEndTime,
					inviteCodeEffectiveTime:
						resultData.actInviteCode.inviteCodeEffectiveTime,
					remark: resultData.actInviteCode.remark,
				}
				this.totalCodeReward = []
				// 店铺取值
				let noRewardOrganizations =
					resultData.actInviteCode.noRewardOrganizations || []
				let organizationNames = []
				for (let i = 0; i < noRewardOrganizations.length; i++) {
					let item = noRewardOrganizations[i].organizationName
					organizationNames.push(item)
				}
				this.organizationList = organizationNames
				if (resultData.actInviteCode.salesVolumeRange) {
					let codeRewardList =
						resultData.actInviteCode.salesVolumeRange.split(',')
					codeRewardList.map((item) => {
						let startCodeReward = item.split(':')[0].split('-')[0]
						let endCodeReward = item.split(':')[0].split('-')[1]
						let sendCodeReward = item.split(':')[1]
						this.totalCodeReward.push({
							startCodeReward,
							endCodeReward,
							sendCodeReward,
						})
					})
				}
				this.dialogVisible113 = true
				console.log(resultData)
			}
		},
		_saveActInviteCode: async function (row) {
			if (row.state == 1) {
				row.state = 2
			} else {
				row.state = 1
			}
			let {
				data: { resultCode, resultMsg },
			} = await saveActInviteCode(row)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.getData109()
			}
		},
		async getData111(flag) {
			this.loading111 = true
			let paramJson = this.findSearchParams111(flag)
			const {
				data: { resultCode, resultData },
			} = await getActInviteCodeRecordByCondition(paramJson)
			if (resultCode == 0) {
				this.tableData111 = resultData.list
				this.page111.count = resultData.count
			} else {
				this.tableData111 = []
				this.page111.count = 0
			}
			this.loading111 = false
		},
		findSearchParams111(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page111.currentPage = 1
			}
			const paramJson = Object.assign(
				{
					actInviteCodeId: this.actInviteCodeId,
				},
				{
					length: this.page111.length,
					startIndex: (this.page111.currentPage - 1) * this.page111.length,
				}
			)
			return paramJson
		},
		async getData109(flag) {
			this.loading = true
			let paramJson = this.findSearchParams109(flag)
			const {
				data: { resultCode, resultData },
			} = await getActInviteCodeByCondition(paramJson)
			this.curTime = new Date().getTime()
			if (resultCode == 0) {
				this.tableData109 = resultData.list
				this.page109.count = resultData.count
			} else {
				this.tableData109 = []
				this.page109.count = 0
			}
			this.loading = false
		},
		findSearchParams109(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page109.currentPage = 1
			}
			const paramJson = Object.assign(this.formData108, {
				length: this.page109.length,
				startIndex: (this.page109.currentPage - 1) * this.page109.length,
			})
			return paramJson
		},
	},
}
</script>
<style scoped>
.code-item {
	margin: 10px 0;
	display: flex;
	align-items: center;
}
.input-item {
	width: 120px;
	margin: 0 5px;
}
</style>

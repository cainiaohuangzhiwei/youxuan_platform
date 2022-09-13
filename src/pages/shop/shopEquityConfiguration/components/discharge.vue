<template>
	<div>
		<yx-form
			:inline="true"
			:data="formData187"
			:items="formCfg187"
			:formAction="formAction187"
		>
		</yx-form>
		<yx-table
			v-loading="loading"
			:columns="tableColumns188"
			:pagination="page188"
			:data="tableData188"
		>
		</yx-table>
		<Dialog
			:title="dialogTitle198"
			:visible.sync="dialogVisible198"
			:width="dialogWidth198"
			:bottomBtn="!viewDetails ? dialogBottomBtn198 : []"
		>
			<yx-form
				ref="dialog189"
				labelWidth="120px"
				:data="formData189"
				:items="formCfg189"
				:rules="formRules189"
				:formDisabled="viewDetails"
			>
				<template slot="rules">
					<el-input
						v-model="formData189.levelEquityRulesName"
						placeholder="请选择权益规则"
						disabled
					>
						<el-button
							slot="append"
							:disabled="editForbid"
							icon="el-icon-more"
							@click="showDialog199"
						></el-button>
					</el-input>
				</template>
				<template slot="userTag">
					<el-input
						v-model="formData189.groupName"
						placeholder="请选择人群"
						disabled
					>
						<el-button
							slot="append"
							:disabled="editForbid"
							icon="el-icon-more"
							@click="showDialog180"
						></el-button>
					</el-input>
				</template>
				<template slot="equityTake">
					<div style="margin-bottom: 20px">
						<el-radio
							v-model="effectiveImmediately"
							@change="equityChange"
							:disabled="
								!compileObject.effectiveImmediately &&
								dialogTitle198 == '编辑发放权益'
							"
							:label="1"
							>立即生效</el-radio
						>
						<el-date-picker
							v-model="formData189.startTimeImmediate"
							type="datetime"
							:disabled="true"
							style="width: 200px"
							placeholder="开始时间"
							default-time="23:59:59"
						>
						</el-date-picker>
						-
						<el-date-picker
							v-model="formData189.endTimeImmediate"
							type="datetime"
							style="width: 200px"
							:picker-options="endDayOptions"
							:disabled="
								!compileObject.effectiveImmediately &&
								dialogTitle198 == '编辑发放权益'
							"
							placeholder="结束时间"
							default-time="23:59:59"
						>
						</el-date-picker>
					</div>
					<div style="display: flex">
						<el-radio
							v-model="effectiveImmediately"
							@change="equityChange"
							:disabled="compileObject.effectiveImmediately === 1"
							:label="0"
							>生效时间</el-radio
						>
						<el-date-picker
							v-model="formData189.time"
							:disabled="compileObject.effectiveImmediately === 1"
							type="datetimerange"
							:picker-options="endDayOptions"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:default-time="[hms, '23:59:59']"
						>
						</el-date-picker>
					</div>
				</template>

				<template slot="morrow">
					<el-date-picker
						v-model="formData189.startTime"
						type="datetime"
						:picker-options="startOptions"
						style="width: 160px"
						placeholder="开始时间"
						default-time="00:00:00"
					>
					</el-date-picker>
					-
					<el-date-picker
						v-model="formData189.endTime"
						type="datetime"
						style="width: 160px"
						:picker-options="pickerOptions"
						placeholder="结束时间"
						default-time="23:59:59"
					>
					</el-date-picker>
				</template>
			</yx-form>
		</Dialog>
		<Dialog
			title="选择权益规则"
			:visible.sync="dialogVisible199"
			:width="dialogWidth198"
			:bottomBtn="dialogBottomBtn189"
		>
			<yx-table
				v-loading="loading189"
				:columns="tableColumns189"
				:pagination="page189"
				:data="tableData189"
			>
				<template slot="select" slot-scope="scope">
					<el-radio
						v-model="levelEquityRulesId"
						:label="scope.row.ruleId"
						@change="changeAnchor(scope.row)"
						>{{ '' }}</el-radio
					>
				</template>
			</yx-table>
		</Dialog>
		<Dialog
			title="选择人群"
			:visible.sync="dialogVisible180"
			width="800px"
			:bottomBtn="dialogBottomBtn180"
		>
			<yx-form
				:inline="true"
				:data="formData180"
				:items="formCfg180"
				:formAction="formAction180"
			>
			</yx-form>
			<yx-table
				v-loading="loading180"
				:columns="tableColumns180"
				:pagination="page180"
				:data="tableData180"
			>
				<template slot="select" slot-scope="scope">
					<el-radio
						:disabled="scope.row.userTagId == 1 || scope.row.userTagId == 2"
						v-model="groupId"
						:label="scope.row.userTagId"
						@change="changeAnchorUserTag(scope.row)"
						>{{ '' }}</el-radio
					>
				</template>
			</yx-table>
		</Dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import moment from 'moment'
import { queryList } from '@/api/actEquityLevelRule'
import { debounce } from 'lodash'
import { getUserTagList } from '@/api/platformUserGroupTag'
import {
	queryActivityList,
	addActivityConfiguration,
	deleteActivityById,
	updateActivityById,
} from '@/api/actEquityLevel'
export default {
	components: {
		YxForm,
		YxTable,
		Dialog,
	},
	computed: {},
	data() {
		return {
			moment,
			effectiveImmediately: 1,
			rowData: {},
			compileObject: {},
			groupId: '',
			viewDetails: false,
			editForbid: false,
			levelEquityRulesId: '',
			UserTagList: {},
			hms: '',
			endDayOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7
				},
			},
			startOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7 + 24 * 60 * 60 * 1000
				},
			},
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7 + 24 * 60 * 60 * 1000
				},
				// disabledDate: (time) => {
				// 	// let inDate = new Date()
				// 	// let year = inDate.getFullYear()
				// 	// let month = inDate.getMonth()
				// 	// 当前月份还剩几天
				// 	let date = new Date()
				// 	let dayAmount =
				// 		new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() -
				// 		date.getDate()
				// 	return time.getTime() < Date.now() - 24 * dayAmount * 60 * 60 * 1000
				// 	// return time.getTime() < this.formData189.startTime
				// },
			},
			//----------选择人群-------------
			formData180: {
				userTagId: '',
			},
			formCfg180: [
				{
					type: 'inputNumber',
					dataIndex: 'userTagId',
					title: '分群ID',
				},
			],
			formAction180: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getUserTagList(true)
					},
				},
			],
			loading180: false,
			tableColumns180: [
				{
					type: 'custom',
					dataIndex: 'select',
				},
				{
					type: 'string',
					dataIndex: 'userTagId',
					title: '分群ID',
				},
				{
					type: 'string',
					dataIndex: 'tagName',
					title: '分群名称',
				},
			],
			page180: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getUserTagList()
				},
			},
			tableData180: [],
			dialogVisible180: false,
			dialogBottomBtn180: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.setGroupId()
					},
				},
			],
			//----------选择人群-------------
			//-------------选择权益规则-------------
			loading189: false,
			tableColumns189: [
				{
					type: 'custom',
					dataIndex: 'select',
				},
				{
					type: 'string',
					dataIndex: 'ruleId',
					title: 'ID',
				},
				{
					type: 'string',
					dataIndex: 'ruleName',
					title: '权益名称',
				},
			],
			page189: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._levelEquityRulesPage()
				},
			},
			tableData189: [],
			dialogVisible199: false,
			dialogBottomBtn189: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.setLevelEquityRulesId()
					},
				},
			],
			dialogBottomBtn198: [
				{
					title: '确定',
					type: 'primary',
					click: debounce(
						() => {
							this.$refs.dialog189.$refs.YxForm.validate((valid) => {
								if (valid) {
									// 规则校验通过
									this._groupEquityActivitySave()
								}
							})
						},
						300,
						{
							leading: true,
							trailing: false,
						}
					),
				},
			],
			formData189: {
				startTimeImmediate: '',
				endTimeImmediate: '',
				startTime: '',
				endTime: '',
				time: [],
				actName: '', //活动名称
				equityRuleId: '', //权益规则ID
				userGroupId: '', //人群ID
				groupId: '',
				groupName: '',
				remark: '',
				levelEquityRulesId: '',
				levelEquityRulesName: '',
			},
			formCfg189: [
				{
					type: 'input',
					title: '活动名称',
					dataIndex: 'actName',
				},
				{
					title: '选择权益规则',
					type: 'custom',
					dataIndex: 'rules',
				},
				{
					title: '选择人群',
					type: 'custom',
					dataIndex: 'userTag',
				},
				{
					title: '权益生效时间',
					type: 'custom',
					hide: false,
					dataIndex: 'equityTake',
				},
				{
					title: '权益生效时间',
					type: 'custom',
					hide: true,
					dataIndex: 'morrow',
					placeholder: ['开始时间', '结束时间'],
				},
				{
					type: 'textarea',
					title: '备注',
					disabled: this.editForbid,
					dataIndex: 'remark',
					maxlength: 100,
					// disabled: this.formData189.condition == 2,
					autosize: {
						minRows: 5,
						maxRows: 9,
					},
				},
			],
			formRules189: {
				actName: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入活动名称'))
							} else if (value.length > 10) {
								callback(new Error('不超过10字'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				rules: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData189.levelEquityRulesId) {
								callback(new Error('请选择权益规则'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				userTag: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData189.groupId) {
								callback(new Error('请选择人群'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				// date: [
				// 	{
				// 		validator: (rule, value, callback) => {
				// 			if (!this.formData189.date || !this.formData189.date.length) {
				// 				callback(new Error('请选择生效时间'))
				// 			} else {
				// 				callback()
				// 			}
				// 		},
				// 		trigger: 'blur',
				// 	},
				// ],
				remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
			},
			dialogTitle198: '添加发放权益',
			dialogVisible198: false,
			dialogWidth198: '850px',
			//-------------选择权益规则-------------
			loading: false,
			tableColumns188: [
				{
					type: 'string',
					dataIndex: 'actId',
					title: 'ID',
				},
				{
					type: 'data',
					dataIndex: 'updateTime',
					title: '添加时间',
					// customRender: ({ addTime }) => {
					// 	return `${addTime[0]}-${addTime[1]}-${addTime[2]} ${addTime[3]}:${addTime[4]}:${addTime[5]}`
					// },
				},
				{
					type: 'string',
					dataIndex: 'actName',
					title: '活动名称',
				},
				{
					type: 'string',
					dataIndex: 'optUserName',
					title: '添加人',
				},
				{
					type: 'newMap',
					dataIndex: 'actState',
					title: '状态',
					options: [
						['3', '已结束'],
						['2', '进行中'],
						['1', '未开始'],
					],
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '查看详情',
							click: (row) => {
								this.editForbid = false
								this.viewDetails = true
								this.dialogTitle198 = '查看详情'
								this.echo(row)
							},
						},
						{
							auth: 'updateActivityById',
							title: '编辑',
							click: (row) => {
								this.editForbid = true
								this.formCfg189.map((item) => {
									if (
										item.dataIndex == 'actName' ||
										item.dataIndex == 'remark'
									) {
										item.disabled = true
									}
								})
								this.viewDetails = false
								this.dialogTitle198 = '编辑发放权益'
								this.echo(row)
							},
							customRender: (action, row) => {
								action.hide = row.actState == 3
								return action
							},
						},
						{
							auth: 'deleteActivityById',
							title: '删除',
							click: ({ actId }) => {
								let _this = this
								_this.$confirm('确定删除？', '提示', {
									type: 'warning',
									async callback(action) {
										if (action === 'confirm') {
											let {
												data: { resultCode },
											} = await deleteActivityById({ actId })
											if (resultCode == 0) {
												_this.$message.success('操作成功')
												_this._queryActivityList()
											}
										}
									},
								})
							},
							customRender: (action, row) => {
								action.hide = row.actState != 1
								return action
							},
						},
					],
				},
			],
			page188: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._queryActivityList()
				},
			},
			tableData188: [],
			formData187: {
				actName: '',
				startTime: moment().startOf('day').valueOf(),
				endTime: moment().endOf('day').valueOf(),
			},
			formCfg187: [
				{
					type: 'input',
					dataIndex: 'actName',
					title: '活动名称',
				},
				{
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					title: '添加时间',
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
			],
			formAction187: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._queryActivityList(true)
					},
				},
				{
					title: '重置',
					isClear: true,
				},
				{
					auth: 'addActivityConfiguration',
					title: '添加发放权益',
					type: 'success',
					click: () => {
						this.dialogVisible198 = true
						let date = new Date() //时间戳为10位需*1000，时间戳为13位的话不需乘1000
						let h = date.getHours() + ':'
						let m = date.getMinutes() + ':'
						let s = date.getSeconds()
						this.hms = h + m + s
						this.viewDetails = false
						this.editForbid = false
						this.formCfg189.map((item) => {
							if (item.dataIndex == 'actName' || item.dataIndex == 'remark') {
								item.disabled = false
							}
						})
						this.dialogTitle198 = '添加发放权益'
						this.effectiveImmediately = 1
						this.compileObject = {}
						this.formCfg189[3].hide = false
						this.formCfg189[4].hide = true
						this.levelEquityRulesId = ''
						this.formData189 = {
							startTimeImmediate: moment(new Date()).valueOf(),
							actName: '',
							endTimeImmediate: '',
							time: [],
							groupId: '',
							groupName: '',
							levelEquityRulesId: '',
							levelEquityRulesName: '',
							startTime: '',
							endTime: '',
							equityRuleId: '', //权益规则ID
							userGroupId: '', //人群ID
							remark: '',
						}
						this.$nextTick(() => {
							this.$refs.dialog189.$refs.YxForm.clearValidate()
						})
					},
				},
			],
		}
	},
	methods: {
		equityChange(e) {
			if (e === 1 && this.dialogTitle198 != '编辑发放权益') {
				this.formData189.startTimeImmediate = moment(new Date()).valueOf()
			} else {
				if (this.compileObject.effectiveImmediately == 1) {
					this.formData189.startTimeImmediate = this.compileObject.startTime
				} else {
					this.formData189.startTimeImmediate = moment(new Date()).valueOf()
				}
			}
			this.formData189 = { ...this.formData189 }
		},
		echo(row) {
			this.compileObject = row
			this.dialogVisible198 = true
			this.formData189 = {
				actName: row.actName, //活动名称
				levelEquityRulesId: row.equityRuleId, //权益规则ID
				remark: row.remark, //备注
				// userGroupId: '', //人群ID
				groupId: row.userGroupId,
				groupName: row.userGroupName,
				levelEquityRulesName: row.ruleName,
			}
			this.rowData.equityLevelType = row.equityLevelType
			this.effectiveImmediately = row.effectiveImmediately
			if (row.equityLevelType === 2) {
				this.formCfg189[3].hide = true
				this.formCfg189[4].hide = false
				this.formData189.startTime = row.startTime
				this.formData189.endTime = row.endTime
			} else {
				this.formCfg189[3].hide = false
				this.formCfg189[4].hide = true
				if (row.effectiveImmediately === 1) {
					this.formData189.startTimeImmediate = row.startTime
					this.formData189.endTimeImmediate = row.endTime
				} else {
					this.formData189.time = [row.startTime, row.endTime]
				}
			}
			this.formData189 = { ...this.formData189 }
		},
		changeAnchorUserTag(row) {
			this.UserTagList = row
		},
		// 单选
		changeAnchor(row) {
			this.rowData = Object.assign({}, row)
			this.formCfg189 = [...this.formCfg189]
		},
		_groupEquityActivitySave: async function () {
			let paramJson = {
				actType: 1,
				actName: this.formData189.actName,
				equityLevel: this.rowData.equityLevel,
				equityLevelType: this.rowData.equityLevelType,
				equityRuleId: this.rowData.ruleId,
				userGroupId: this.formData189.groupId,
				optUserName: this.$store.state.user.userInfo.clerkName,
				optUserId: this.$store.state.user.userInfo.clerkId,
				remark: this.formData189.remark,
			}
			if (this.rowData.equityLevelType === 1) {
				if (this.effectiveImmediately === 1) {
					if (!this.formData189.endTimeImmediate) {
						return this.$message.warning('请选择结束时间')
					} else {
						paramJson.startTime = moment(new Date()).valueOf()
						paramJson.endTime = moment(
							this.formData189.endTimeImmediate
						).valueOf()
					}
				}
				if (this.effectiveImmediately === 0) {
					if (!this.formData189.time[0]) {
						return this.$message.warning('请选择次日开始时间')
					}
					if (!this.formData189.time[1]) {
						return this.$message.warning('请选择结束时间')
					}
					paramJson.startTime = moment(this.formData189.time[0]).valueOf()
					paramJson.endTime = moment(this.formData189.time[1]).valueOf()
				}
				paramJson.effectiveImmediately = this.effectiveImmediately
			} else {
				if (!this.formData189.startTime) {
					return this.$message.warning('请选择开始时间')
				}
				if (!this.formData189.endTime) {
					return this.$message.warning('请选择结束时间')
				}
				paramJson.startTime = moment(this.formData189.startTime).valueOf()
				paramJson.endTime = moment(this.formData189.endTime).valueOf()
			}
			if (this.dialogTitle198 == '编辑发放权益') {
				paramJson.actId = this.compileObject.actId
				if (this.compileObject.effectiveImmediately == 1) {
					paramJson.startTime = this.compileObject.startTime
				}
				if (
					this.compileObject.actState === 2 &&
					paramJson.startTime != this.compileObject.startTime
				) {
					return this.$message.warning('进行中的活动不可更改开始时间')
				}
			}
			console.log('入参LLL:', paramJson, this.formData189)
			// return
			let Url =
				this.dialogTitle198 == '编辑发放权益'
					? updateActivityById
					: addActivityConfiguration
			let {
				data: { resultCode },
			} = await Url(paramJson)
			if (resultCode == 0) {
				this.dialogVisible198 = false
				this.$message.success('操作成功')
				this._queryActivityList()
			}
		},
		setLevelEquityRulesId() {
			if (!this.levelEquityRulesId) {
				return this.$message.warning('请选择权益规则')
			}
			// let index = this.tableData189.findIndex(
			// 	(item) => item.id == this.levelEquityRulesId
			// )
			// let item = this.tableData189[index]
			this.formData189.levelEquityRulesId = this.rowData.ruleId
			this.formData189.levelEquityRulesName = this.rowData.ruleName
			console.log('权益等级：', this.rowData.equityLevelType)
			if (this.rowData.equityLevelType === 2) {
				this.formCfg189[3].hide = true
				this.formCfg189[4].hide = false
			} else {
				this.formCfg189[3].hide = false
				this.formCfg189[4].hide = true
			}
			this.dialogVisible199 = false
			this.$refs.dialog189.$refs.YxForm.clearValidate()
		},
		showDialog199() {
			this.dialogVisible199 = true
			this._levelEquityRulesPage(true)
		},
		_levelEquityRulesPage: async function (flag) {
			this.loading189 = true
			if (flag) {
				this.page189.currentPage = 1
			}
			let paramJson = {
				pageSize: this.page189.length,
				pageNum: this.page189.currentPage,
				actName: this.formData187.actName,
				addStartTime: this.formData187.startTime,
				addEndTime: this.formData187.endTime,
			}
			const {
				data: { resultCode, resultData, total },
			} = await queryList(paramJson)
			if (resultCode == 0) {
				this.tableData189 = resultData
				this.page189.count = total
			}
			this.loading189 = false
		},
		_queryActivityList: async function (flag) {
			let paramJson = this.findSearchParams188(flag)
			this.loading = true
			const {
				data: { resultCode, resultData = [], total },
			} = await queryActivityList(paramJson)
			if (resultCode == 0) {
				this.tableData188 = resultData
				this.page188.count = total
			}
			this.loading = false
		},
		findSearchParams188(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page188.currentPage = 1
			}
			const paramJson = Object.assign(this.formData187, {
				pageSize: this.page188.length,
				pageNum: this.page188.currentPage,
			})
			return paramJson
		},
		/* 选择分群 s */
		setGroupId() {
			if (!this.groupId) {
				return this.$message.warning('请选择分群')
			}
			this.formData189.groupId = this.UserTagList.userTagId
			this.formData189.groupName = `分群名称：${this.UserTagList.tagName}`
			this.dialogVisible180 = false
			this.$refs.dialog189.$refs.YxForm.clearValidate()
		},
		showDialog180() {
			this.dialogVisible180 = true
			this.formData180.userTagId = ''
			this._getUserTagList(true)
		},
		findSearchParams180(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page180.currentPage = 1
			}
			const paramJson = Object.assign(this.formData180, {
				pageSize: this.page180.length,
				currentPage: this.page180.currentPage,
				tagType: 2,
			})
			return paramJson
		},
		async _getUserTagList(flag) {
			this.loading180 = true
			let paramJson = this.findSearchParams180(flag)
			const {
				data: { resultCode, resultData = [] },
			} = await getUserTagList(paramJson)
			if (resultCode == 0) {
				this.tableData180 = resultData.records
				this.page180.count = resultData.total
			}
			this.loading180 = false
		},
		/* 选择分群 e */
	},
}
</script>

<style></style>

<template>
	<div class="demo">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
			</yx-form>
			<div class="goods-group-btn-box">
				<el-button type="success" @click="addNewPlan">新建派发计划</el-button>
				<el-button type="primary" @click="setImport">历史导入记录</el-button>
			</div>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns102"
				:pagination="page102"
				:data="tableData102"
			>
				<template slot="disCount" slot-scope="scope">
					<div>
						<el-button
							@click="_getReceivedCountByPlanId(scope.row, scope.index)"
							size="medium"
							type="text"
							>{{
								scope.row.isReceivedNum ? scope.row.receivedNum : '查看领取数量'
							}}</el-button
						>
					</div>
				</template>
				<template slot="usedCount" slot-scope="scope">
					<div>
						<el-button
							@click="_getUsedCountByPlanId(scope.row, scope.index)"
							size="medium"
							type="text"
							>{{
								scope.row.isUsedCount ? scope.row.usedCount : '查看已使用数量'
							}}</el-button
						>
					</div>
				</template>
			</yx-table>
			<Dialog
				:title="dialogTitle103"
				:visible="dialogVisible103"
				:width="dialogWidth103"
				:bottomBtn="dialogBottomBtn103"
				@before-close="dialogVisible103 = false"
			>
				<yx-form
					ref="dialog104"
					labelWidth="120px"
					:data="formData104"
					:items="formCfg104"
					:formDisabled="formDisabled104"
					:formAction="formAction104"
					:rules="formRules104"
				>
					<template slot="equityId">
						<el-autocomplete
							:disabled="true"
							v-model="formData104.equityName"
							class="input-with-select"
						>
							<el-button @click="openGiftDialog" slot="append"
								>选择权益卡</el-button
							>
						</el-autocomplete>
					</template>
					<template slot="importType">
						<el-radio-group
							class="validity-type-box"
							v-model="formData104.importType"
							@change="changeImportType"
						>
							<el-radio class="validity-type-item" :label="1">
								<div class="radio-box">
									<el-upload
										:auto-upload="false"
										:limit="1"
										accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
										:on-change="onChange"
										:on-exceed="onExceed"
										:file-list="fileList"
										ref="uploadUser"
									>
										<el-button slot="trigger" class="mr20" icon="el-icon-plus">
											添加文件
										</el-button>
									</el-upload>
									<el-button
										v-if="!formDisabled104"
										@click="handleDownExcel"
										class="template"
										type="primary"
										>下载模板</el-button
									>
								</div>
							</el-radio>
							<el-radio class="validity-type-item" :label="2">
								<div class="radio-box">
									<el-button
										class="radio-box-left"
										icon="el-icon-plus"
										type="text"
										@click="addUser"
										>添加用户</el-button
									>
									<div>
										派发数量<el-input
											class="validity-day"
											type="number"
											onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
											v-model="formData104.allQuatity1"
										></el-input
										>张
									</div>
								</div>
								<p>
									<span v-for="(item, index) in userList" :key="index"
										>{{ item.nickname
										}}{{ index >= userList.length - 1 ? '' : ',' }}</span
									>
								</p>
							</el-radio>
							<el-radio class="validity-type-item" :label="3">
								<div class="radio-box">
									<el-button class="radio-box-left" type="text"
										>全量店主</el-button
									>
									<div>
										派发数量<el-input
											class="validity-day"
											type="number"
											onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
											v-model="formData104.allQuatity2"
										></el-input
										>张
									</div>
								</div>
							</el-radio>
							<!-- 用户分群 START-->
							<el-radio class="validity-type-item" :label="4">
								<div class="radio-box">
									<div class="userTagLabel">按用户分群</div>
									<div>
										派发数量<el-input
											class="validity-day"
											type="number"
											onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
											v-model="formData104.allQuatity3"
										></el-input
										>张
									</div>
								</div>
								<div
									class="select_wraper"
									v-show="formData104.importType === 4"
								>
									<el-select
										value-key="userTagId"
										v-model="formData104.userTagList"
										clearable
										multiple
										filterable
										allow-create
										default-first-option
										placeholder="请选择分群"
									>
										<el-option
											v-for="item in userTagList"
											:key="item.userTagId"
											:label="item.tagName"
											:value="item"
										>
										</el-option>
									</el-select>
								</div>
							</el-radio>
							<!-- 用户分群 END-->
						</el-radio-group>
					</template>
				</yx-form>
			</Dialog>
			<Dialog
				:title="dialogTitle125"
				:visible.sync="dialogVisible125"
				:width="dialogWidth125"
				:bottomBtn="dialogBottomBtn125"
			>
				<yx-table
					v-loading="loading127"
					:columns="tableColumns127"
					:pagination="page127"
					:data="tableData127"
				>
					<template slot="equityId" slot-scope="scope">
						<el-radio
							v-model="formData104.equityId"
							:label="scope.row.equityId"
							@change="changeEquityId(scope.row)"
							>选择
						</el-radio>
					</template>
				</yx-table>
			</Dialog>
			<Dialog
				:title="dialogTitle126"
				:visible.sync="dialogVisible126"
				:width="dialogWidth126"
				:bottomBtn="dialogBottomBtn126"
			>
				<yx-form
					:inline="true"
					:data="formData126"
					:items="formCfg126"
					:formAction="formAction126"
				>
				</yx-form>
				<yx-table
					:select="false"
					v-loading="loading104"
					:columns="tableColumns104"
					:data="tableData104"
				>
				</yx-table>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import { downloadFile } from '@/utils/helper/common'
import { importEquityReceived } from '@/api/webImport'
import {
	getPlan,
	getReceivedCountByPlanId,
	getUsedCountByPlanId,
	getUser,
	addPlan,
	deleteEquityPlan,
} from '@/api/yhtPlusCmsPlanEquity'
import { getUserTagList } from '@/api/platformUserGroupTag'
import { getEquity } from '@/api/yhtPlusCmsEquity'
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
			userTagList: [],
			userList: [],
			formDisabled104: false,
			loading104: false,
			tableData104: [],
			tableColumns104: [
				{
					type: 'string',
					dataIndex: 'userId',
					title: '用户id',
				},
				{
					type: 'string',
					dataIndex: 'nickname',
					title: '用户名称',
				},
				{
					type: 'string',
					dataIndex: 'openId',
					title: '用户openid',
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.setUserList(row)
							},
							customRender: (action, row) => {
								let flag = this.userList.some(
									(item) => item.userId === row.userId
								)
								action.title = flag ? '移除' : '添加'
								return action
							},
						},
					],
				},
			],
			page104: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getUser()
				},
			},
			formData126: {
				userIdCms: '',
				openId: '',
			},
			formCfg126: [
				{
					type: 'input',
					title: '用户id',
					dataIndex: 'userIdCms',
					placeholder: '用户id',
				},
				{
					type: 'input',
					title: '用户openid',
					dataIndex: 'openId',
					placeholder: '用户openid',
				},
			],
			formAction126: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						this._getUser(true)
					},
				},
			],
			dialogTitle126: '添加用户',
			dialogWidth126: '800px',
			dialogVisible126: false,
			dialogBottomBtn126: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible126 = false
					},
				},
			],
			dialogTitle125: '选择权益卡',
			dialogWidth125: '800px',
			dialogVisible125: false,
			dialogBottomBtn125: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible125 = false
					},
				},
			],
			loading127: false,
			tableData127: [],
			tableColumns127: [
				{
					type: 'string',
					dataIndex: 'equityId',
					title: '权益卡ID',
				},
				{
					type: 'string',
					dataIndex: 'equityName',
					title: '权益卡名称',
				},
				{
					type: 'custom',
					dataIndex: 'equityId',
				},
			],
			page127: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getEquity()
				},
			},
			loading: false,
			fileList: [],
			formData101: {
				equityPlanId: '',
				planName: '',
				planStatus: 0,
				startTime: '',
				planTimeEnd: '',
			},
			formCfg101: [
				{
					type: 'input',
					title: '计划ID',
					dataIndex: 'equityPlanId',
					placeholder: '请输入计划ID',
				},
				{
					type: 'input',
					title: '计划名称',
					dataIndex: 'planName',
					placeholder: '请输入计划名称',
				},
				{
					type: 'select',
					title: '派发计划状态',
					dataIndex: 'planStatus',
					placeholder: '请输入派发计划状态',
					label: 'value',
					options: [
						{
							planStatus: 0,
							value: '全部',
						},
						{
							planStatus: 1,
							value: '未开始',
						},
						{
							planStatus: 2,
							value: '派发中',
						},
						{
							planStatus: 3,
							value: '已完成',
						},
					],
				},
				{
					type: 'datetimerange',
					title: '派发时间',
					dataIndex: ['startTime', 'planTimeEnd'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
				},
			],
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.init(true)
					},
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					dataIndex: 'equityPlanId',
					title: '计划ID',
				},
				{
					type: 'string',
					dataIndex: 'planName',
					title: '计划名称',
				},
				{
					type: 'newMap',
					dataIndex: 'equityType',
					title: '权益类型',
					options: [['1', '运费保障卡']],
				},
				{
					type: 'string',
					dataIndex: 'equityId',
					title: '权益卡ID',
				},
				{
					type: 'string',
					dataIndex: 'equityName',
					title: '权益卡名称',
				},
				{
					type: 'date',
					dataIndex: 'distributeTime',
					title: '开始派发时间',
				},
				{
					type: 'custom',
					dataIndex: 'disCount',
					title: '派发数量',
					width: 120,
				},
				{
					type: 'custom',
					dataIndex: 'usedCount',
					title: '已使用',
					width: 120,
				},
				{
					type: 'newMap',
					dataIndex: 'planStatus',
					title: '派发计划状态',
					options: [
						['1', '未开始'],
						['2', '派发中'],
						['3', '已完成'],
					],
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '编辑',
							auth: '',
							dialogId: '',
							click: (row) => {
								this._getPlan(row, false)
							},
							customRender: (action, row) => {
								action.hide = row.planStatus != 1
								return action
							},
						},
						{
							title: '删除',
							popconfirm: true,
							popconfirmTitle: '确定删除计划',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._deleteEquityPlan(row)
							},
							customRender: (action, row) => {
								action.hide = row.planStatus != 1
								return action
							},
						},
						{
							title: '查看',
							auth: '',
							dialogId: '',
							click: (row) => {
								this._getPlan(row, true)
							},
							customRender: (action, row) => {
								action.hide = row.planStatus == 1
								return action
							},
						},
					],
				},
			],
			page102: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			dialogTitle103: '新建派发计划',
			dialogWidth103: '800px',
			dialogVisible103: false,
			dialogBottomBtn103: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						if (this.formDisabled104) {
							this.dialogVisible103 = false
							return
						}
						this.$refs.dialog104.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.savePalan()
								// this.dialogVisible105 = false
							}
						})
					},
				},
			],
			formData104: {
				planName: '',
				equityType: '',
				equityId: '',
				distributeTime: '',
				importType: '',
				allQuatity1: '',
				allQuatity2: '',
				allQuatity3: '',
				userTagList: [],
			},
			formRules104: {
				planName: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value.replace(/\s+/g, '')) {
								callback(new Error('派发计划名称不能为空'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				equityType: [
					{ required: true, message: '请选择权益类型', trigger: 'change' },
				],
				equityId: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData104.equityId) {
								callback(new Error('请选择权益卡名称'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				distributeTime: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请选择派发时间'))
							} else if (value < new Date().getTime()) {
								callback(new Error('派发时间不能小于当前时间！'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				importType: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData104.importType) {
								callback(new Error('请选择派发用户'))
							} else if (
								this.formData104.importType == 1 &&
								!this.fileList.length
							) {
								callback(new Error('请上传文件'))
							} else if (
								this.formData104.importType == 2 &&
								!this.userList.length
							) {
								callback(new Error('请添加用户'))
							} else if (
								this.formData104.importType == 2 &&
								!this.formData104.allQuatity1
							) {
								callback(new Error('用户派发数量不能为空'))
							} else if (
								this.formData104.importType == 2 &&
								!(
									this.formData104.allQuatity1 > 0 &&
									this.formData104.allQuatity1 <= 100
								)
							) {
								callback(new Error('用户派发数量在1-100'))
							} else if (
								this.formData104.importType == 3 &&
								!this.formData104.allQuatity2
							) {
								callback(new Error('店主派发数量不能为空'))
							} else if (
								this.formData104.importType == 3 &&
								!(
									this.formData104.allQuatity2 > 0 &&
									this.formData104.allQuatity2 <= 100
								)
							) {
								callback(new Error('店主派发数量在1-100'))
							} else if (
								this.formData104.importType == 4 &&
								!(
									this.formData104.allQuatity3 > 0 &&
									this.formData104.allQuatity3 <= 100
								)
							) {
								callback(new Error('按用户分群派发数量在1-100'))
							} else if (
								this.formData104.importType == 4 &&
								!this.formData104.userTagList.length
							) {
								console.log(
									'this.formData104.userTagList',
									this.formData104.userTagList
								)
								callback(new Error('请选择用户分群'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				userTagList: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData104.userTagList.length) {
								callback(new Error('请选择用户分群'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
			},
			formCfg104: [
				{
					type: 'input',
					title: '派发计划名称',
					dataIndex: 'planName',
					placeholder: '请输入派发计划名称',
				},
				{
					type: 'radio',
					title: '权益类型',
					dataIndex: 'equityType',
					label: 'value',
					options: [
						{
							value: '运费保障卡',
							equityType: 1,
						},
					],
				},
				{
					title: '权益卡名称',
					type: 'custom',
					dataIndex: 'equityId',
				},
				{
					title: '开始派发时间',
					type: 'time',
					dataIndex: 'distributeTime',
					placeholder: '请输入开始派发时间',
					timeAttributes: {
						type: 'datetime',
						pickerOptions: {
							disabledDate(time) {
								return time.getTime() < Date.now() - 8.64e7
							},
						},
					},
				},
				{
					title: '派发用户',
					type: 'custom',
					dataIndex: 'importType',
				},
			],
			formAction104: [],
		}
	},

	created() {
		// this._getUserTagList()
	},

	methods: {
		changeImportType(importType) {
			if (importType == 4 && !this.userTagList.length) {
				this._getUserTagList()
			}
		},
		async _getUserTagList() {
			const params = {
				startCreateTime: new Date('2021-01-01 00:00:00').getTime(),
				userTagId: '',
				tagType: '',
				tagName: '',
				status: 1, //启用
				creatorName: '',
				pageSize: 99999999,
				currentPage: 1,
			}
			let {
				data: { resultData },
			} = await getUserTagList(params)
			console.log('resultCode', resultData)
			this.userTagList = Object.freeze(resultData.records)
		},
		setImport() {
			this.$router.push({
				path: `historyLeadRecord`,
			})
		},
		_deleteEquityPlan: async function ({ equityPlanId }) {
			let {
				data: { resultCode, resultMsg },
			} = await deleteEquityPlan({ equityPlanId })
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.init(true)
			}
		},
		addNewPlan() {
			this.formData104 = {
				planName: '',
				equityType: '',
				equityId: '',
				equityName: '',
				distributeTime: '',
				importType: '',
				allQuatity1: '',
				allQuatity2: '',
				allQuatity3: '',
				userTagList: [],
			}
			this.userList = []
			this.dialogVisible103 = true
			this.formDisabled104 = false
			this.$nextTick(() => {
				this.$refs.dialog104.$refs.YxForm.clearValidate()
			})
		},
		savePalan: async function () {
			let paramJson = {
				planName: this.formData104.planName.replace(/\s+/g, ''), //名称
				equityType: this.formData104.equityType, //权益卡类型
				equityId: this.formData104.equityId, //权益中心
				distributeTime: moment(this.formData104.distributeTime).valueOf(), //时间
				importType: this.formData104.importType, //类型
				update: this.formData104.equityPlanId ? 1 : 0, // 保存派发计划对应的字段 新建传0 编辑传1
			}
			if (this.formData104.equityPlanId) {
				paramJson.equityPlanId = this.formData104.equityPlanId
			}
			let flag = paramJson.equityPlanId ? true : false
			if (paramJson.importType != 1) {
				// paramJson.importType == 2
				// 	? this.formData104.allQuatity1
				// 	: this.formData104.allQuatity2
				if (paramJson.importType == 2) {
					paramJson.allQuatity = this.formData104.allQuatity1
				} else if (paramJson.importType == 3) {
					paramJson.allQuatity = this.formData104.allQuatity2
				} else if (paramJson.importType == 4) {
					paramJson.allQuatity = this.formData104.allQuatity3
				}
				if (paramJson.importType == 2) {
					paramJson.userList = this.userList.map((item) => {
						return {
							userId: item.userId,
						}
					})
				}
				if (paramJson.importType == 4) {
					// 用户分群
					paramJson.userTagList = this.formData104.userTagList.map((item) => {
						return { userTagId: item.userTagId, userTagName: item.tagName }
					}) // 用户分群id集合
				}
				console.log('paramJson', paramJson)
				let {
					data: { resultCode },
				} = await addPlan(paramJson)
				if (resultCode == 0) {
					this.init(flag)
					this.dialogVisible103 = false
				}
			} else {
				let formData = new FormData()
				paramJson.groupId = this.$store.state.user.userInfo.groupId || ''
				paramJson.userId = this.$store.state.user.userInfo.userId || ''
				formData.append('data', JSON.stringify(paramJson))
				formData.append(
					'groupId',
					this.$store.state.user.userInfo.groupId || ''
				)
				formData.append('file', this.fileList[0].raw)
				let {
					data: { resultCode },
				} = await importEquityReceived(formData)
				if (resultCode == 0) {
					this.init(flag)
					this.dialogVisible103 = false
				}
			}
		},
		_getEquity: async function (flag) {
			this.loading127 = true
			let paramJson = this.findSearchParams127(flag)
			const {
				data: { resultCode, resultData },
			} = await getEquity(paramJson)
			if (resultCode == 0) {
				this.tableData127 = resultData.equityList
				this.page127.count = resultData.count
			} else {
				this.tableData127 = []
				this.page127.count = 0
			}
			this.loading127 = false
		},
		findSearchParams127(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page127.currentPage = 1
			}
			const paramJson = Object.assign(
				{
					type: 1,
				},
				{
					length: this.page127.length,
					startIndex: (this.page127.currentPage - 1) * this.page127.length,
				}
			)
			return paramJson
		},
		changeEquityId(row) {
			this.formData104 = Object.assign(this.formData104, row)
		},
		openGiftDialog() {
			this.dialogVisible125 = true
			this._getEquity(true)
		},
		// 下载Excel模板
		handleDownExcel() {
			downloadFile(`/excel/platform/用户权益卡导入模板.xlsx`)
		},
		onExceed() {
			// 文件超出个数限制时的钩子
			this.$message.warning({
				message: `最多只能上传1个文件`,
			})
		},
		onChange(file) {
			this.fileList = [file]
		},
		// 获取已使用数量
		_getUsedCountByPlanId: async function ({ equityPlanId }, index) {
			let {
				data: { resultCode, resultData },
			} = await getUsedCountByPlanId({
				equityPlanId,
			})
			if (resultCode == 0) {
				this.$set(this.tableData102[index], 'usedCount', resultData.usedCount)
				this.$set(this.tableData102[index], 'isUsedCount', true)
			}
		},
		// 获取派发数量
		_getReceivedCountByPlanId: async function ({ equityPlanId }, index) {
			let {
				data: { resultCode, resultData },
			} = await getReceivedCountByPlanId({
				equityPlanId,
			})
			if (resultCode == 0) {
				this.$set(
					this.tableData102[index],
					'receivedNum',
					resultData.receivedCount
				)
				this.$set(this.tableData102[index], 'isReceivedNum', true)
			}
		},
		setUserList(row) {
			let newRow = JSON.parse(JSON.stringify(row))
			let flag = this.userList.some((item) => item.userId === newRow.userId)
			if (!flag) {
				this.userList.push(newRow)
			} else {
				let index = this.userList.findIndex((item) => {
					return item.userId == newRow.userId
				})
				this.userList.splice(index, 1)
			}
		},
		addUser() {
			this.dialogTitle103 = '新建派发计划'
			this.dialogVisible126 = true
			this.formData126 = {
				userIdCms: '',
				openId: '',
			}
			this.tableData104 = []
			// this._getUser(true)
		},
		_getUser: async function (flag) {
			this.loading104 = true
			let paramJson = this.findSearchParams126(flag)
			const {
				data: { resultCode, resultData },
			} = await getUser(paramJson)
			if (resultCode == 0) {
				this.tableData104 = resultData.userList
				this.page104.count = resultData.count
			} else {
				this.tableData104 = []
				this.page104.count = 0
			}
			this.loading104 = false
		},
		findSearchParams126(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page104.currentPage = 1
			}
			const paramJson = Object.assign(this.formData126, {
				length: this.page104.length,
				startIndex: (this.page104.currentPage - 1) * this.page104.length,
			})
			return paramJson
		},
		_getPlan: async function (row, flag) {
			console.log('row', row, this.formData104.userTagList)
			this.dialogTitle103 = flag ? '查看派发计划' : '编辑派发计划'
			this.formDisabled104 = flag
			this.formData104 = Object.assign(
				{
					allQuatity2: '',
					allQuatity1: '',
					userTagList: [],
				},
				row
			)
			if (this.formData104.importType == 2) {
				this.formData104.allQuatity1 = this.formData104.distributeCount
			} else if (this.formData104.importType == 3) {
				this.formData104.allQuatity2 = this.formData104.distributeCount
			} else if (this.formData104.importType == 4) {
				this.formData104.allQuatity3 = this.formData104.distributeCount
			}
			this.dialogVisible103 = true
			this.$nextTick(() => {
				this.$refs.dialog104.$refs.YxForm.clearValidate()
			})
			let {
				data: { resultCode, resultData },
			} = await getPlan({
				type: 1,
				equityPlanId: row.equityPlanId,
			})
			if (resultCode == 0) {
				if (resultData.equityPlan.userName) {
					this.userList = resultData.equityPlan.userName
				} else {
					this.userList = []
				}
				if (
					resultData?.equityPlan.userTagList &&
					Array.isArray(resultData?.equityPlan.userTagList)
				) {
					let userTagList = resultData.equityPlan.userTagList.map((item) => {
						return { userTagId: item.userTagId, tagName: item.userTagName }
					})
					console.log('userTagList', userTagList)
					this.formData104.userTagList = userTagList || []
				}
				console.log('formData104', this.formData104, resultData)
			}
		},
		// 获取列表数据
		async init(flag) {
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			const {
				data: { resultCode, resultData },
			} = await getPlan(paramJson)
			if (resultCode == 0) {
				this.tableData102 = resultData.equityPlanList
				this.page102.count = resultData.count
			} else {
				this.tableData102 = []
				this.page102.count = 0
			}
			this.loading = false
		},
		findSearchParams102(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			const paramJson = Object.assign(this.formData101, {
				length: this.page102.length,
				startIndex: (this.page102.currentPage - 1) * this.page102.length,
			})
			return paramJson
		},
	},
}
</script>
<style scoped>
.goods-group-btn-box {
	margin-bottom: 20px;
}
.validity-type-box {
	display: flex;
	flex-direction: column;
}
.validity-type-item {
	margin-bottom: 20px;
	display: flex;
	/* align-items: center; */
}
.radio-box {
	display: flex;
}
.template {
	margin-left: 20px;
	height: 32px;
}
.validity-day {
	width: 100px;
	margin: 0 10px;
}
.radio-box-left {
	width: 100px;
}
.select_wraper {
	margin-top: 20px;
	margin-left: 20px;
}
.userTagLabel {
	margin: 10px 20px;
	font-size: 12px;
}
</style>

<template>
	<div class="package">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData104"
				:items="formCfg104"
				:formAction="formAction104"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns105"
				:pagination="page105"
				:data="tableData105"
			>
				<template slot="state" slot-scope="scope">
					<div>
						<el-tag type="danger" v-if="scope.row.state == 1">禁用</el-tag>
						<el-tag type="info" v-if="scope.row.state == 3">删除</el-tag>
						<el-tag v-if="scope.row.state == 2">启用</el-tag>
					</div>
				</template>
				<template slot="shareTypeText" slot-scope="scope">
					<div>
						<template v-if="scope.row.shareType == 1">部分用户</template>
						<template v-else-if="scope.row.shareType == 2">全部用户</template>
						<template v-else-if="scope.row.shareType == 3">仅店主</template>
						<template v-else-if="scope.row.shareType == 4">按用户分群</template>
						<template v-else-if="scope.row.shareType == 5">
							<div>
								企微群-{{
									scope.row.customerType == 0
										? '全部'
										: scope.row.customerType == 1
										? '店主'
										: scope.row.customerType == 2
										? '顾客'
										: ''
								}}
							</div>
							<div v-for="item in scope.row.qwGroupNames" :key="item">
								[{{ item }}]
							</div>
						</template>
					</div>
				</template>
			</yx-table>
			<Dialog
				:title="dialogTitle110"
				:visible.sync="dialogVisible110"
				:width="dialogWidth110"
				:bottomBtn="dialogBottomBtn110"
			>
				<yx-form
					ref="dialog111"
					labelWidth="120px"
					:data="formData111"
					:items="formCfg111"
					:formAction="formAction111"
					:rules="formRules111"
				>
					<template slot="giftId">
						<el-autocomplete
							placeholder="请选择选择礼包"
							v-model="formData111.giftName"
							:fetch-suggestions="querySearchAsync"
							@select="changeGiftId"
							class="input-with-select"
						>
							<el-button
								@click="openGiftDialog"
								slot="append"
								icon="el-icon-more"
							></el-button>
						</el-autocomplete>
					</template>
					<template slot="userIds">
						<div>
							<div class="user-upload">
								<el-button
									class="down-btn"
									@click="handleDownExcel"
									type="primary"
									>下载模板</el-button
								>
								<el-upload
									ref="uploadExcel"
									:limit="1"
									accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
									:on-exceed="onExceed"
									:http-request="httpRequest"
								>
									<el-button slot="trigger" class="mr20" icon="el-icon-plus">
										上传文件
									</el-button>
								</el-upload>
								<!-- <el-button type="success">上传文件</el-button> -->
							</div>
							<div class="user-info">
								<p v-for="(item, index) in userInfoList" :key="index">
									用户ID:{{ item.userId }}
									<!-- ，手机号:{{ item.weixinUserName }} -->
								</p>
							</div>
						</div>
					</template>
					<!-- 按用户分群 -->
					<template slot="userTag">
						<el-select
							value-key="userTagId"
							v-model="formData111.selectedUserTags"
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
					</template>
					<template slot="qiWeiIds">
						<span v-if="formData111.selectQiWeiList.length">已选：</span>
						<span v-if="formData111.selectQiWeiList.length"
							>{{
								formData111.selectQiWeiList
									.map((item) => item.chatName)
									.join(',')
							}}&nbsp;&nbsp;</span
						>
						<el-button type="text" @click="handleAddQiWei()"
							>选择企微群</el-button
						>
					</template>
					<!-- 按用户分群 -->
					<template slot="giftCount">
						<div>
							<el-input
								class="package-num"
								type="number"
								v-model="formData111.giftCount"
							></el-input>
							<span>份</span>
						</div>
					</template>
				</yx-form>
			</Dialog>
			<Dialog
				:title="dialogTitle112"
				:visible.sync="dialogVisible112"
				:width="dialogWidth112"
				:bottomBtn="dialogBottomBtn112"
			>
				<div v-loading="loading112">
					<div class="share-data">
						<p>
							礼包总数量：{{ giftShareCount }} 当前已领取数量：{{
								giftShareRecordCount
							}}
						</p>
						<el-button
							v-auth="'exportGiftShareRecord'"
							size="small"
							class="exportData-btn"
							type="primary"
							@click="exportDataBtn"
							>导出</el-button
						>
					</div>
					<yx-table
						:select="false"
						v-loading="loading113"
						:columns="tableColumns113"
						:pagination="page113"
						:data="tableData113"
					></yx-table>
				</div>
			</Dialog>
			<Dialog
				:title="dialogTitle114"
				:visible.sync="dialogVisible114"
				:width="dialogWidth114"
				:bottomBtn="dialogBottomBtn114"
			>
				<div class="image-box">
					<el-image class="code-image" fit="cover" :src="codeImagePath">
						<div slot="error" class="image-slot">
							<i class="el-icon-picture-outline"></i>
						</div>
					</el-image>
				</div>
			</Dialog>
			<Dialog
				:title="dialogTitle125"
				:visible.sync="dialogVisible125"
				:width="dialogWidth125"
				:bottomBtn="dialogBottomBtn125"
			>
				<yx-form
					:inline="true"
					:data="formData126"
					:items="formCfg126"
					:formAction="formAction126"
				>
				</yx-form>
				<yx-table
					v-loading="loading127"
					:columns="tableColumns127"
					:pagination="page127"
					:data="tableData127"
				>
					<template slot="giftId" slot-scope="scope">
						<el-radio
							v-model="formData111.giftId"
							:label="scope.row.giftId"
							@change="changeGiftId(scope.row)"
							>选择
						</el-radio>
					</template>
				</yx-table>
			</Dialog>
			<addQiWeiDialog
				:visible.sync="dialogQiWeiVisible"
				:defaultSelectList="formData111.selectQiWeiList"
				@saveSelect="saveQiWei"
			></addQiWeiDialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import {
	findGiftShareListByParam,
	findGiftShareRecord,
	updateGiftShareState,
	getGiftShareCode,
	findGiftListByParam,
	addGiftShare,
} from '@/api/gift'
import { exportGiftShareRecord, impostCouponExcel } from '@/api/webImport'
import { downloadFile } from '@/utils/helper/common'
import { getBigImg } from '@/utils/imageTool'
import moment from 'moment'
import { getUserTagList } from '@/api/platformUserGroupTag'
import addQiWeiDialog from './addQiWeiDialog'
// import { userClusterList } from '../mock.js'
// console.log('userClusterList', userClusterList)
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
		addQiWeiDialog,
	},
	props: [],
	data() {
		return {
			// userClusterList: userClusterList.resultData.records,
			userTagList: [],
			value: [],
			userInfoList: [],
			loading112: false,
			dialogTitle125: '选择礼包',
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
			formData126: {
				giftName: '',
				addTimeStart: 1577808000000,
			},
			formCfg126: [
				{
					type: 'input',
					title: '筛选',
					dataIndex: 'giftName',
					placeholder: '礼包名称',
				},
			],
			formAction126: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						this._findGiftListByParam(true)
					},
				},
			],
			loading127: false,
			tableData127: [],
			tableColumns127: [
				{
					type: 'custom',
					dataIndex: 'giftId',
				},
				{
					type: 'string',
					dataIndex: 'giftName',
					title: '礼包',
				},
				{
					type: 'string',
					dataIndex: 'addUserName',
					title: '创建人',
				},
			],
			page127: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._findGiftListByParam()
				},
			},
			codeImagePath: '',
			dialogTitle114: '派发小程序码',
			dialogVisible114: false,
			dialogWidth114: '460px',
			dialogBottomBtn114: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible114 = false
					},
				},
			],
			loading113: false,
			loading: false,
			giftShareId: null,
			giftShareCount: 0,
			giftShareRecordCount: 0,
			formData104: {
				giftShareName: '',
				addTimeStart: '',
				addTimeEnd: moment().endOf('day').valueOf(),
			},
			formCfg104: [
				{
					type: 'input',
					title: '计划名称',
					dataIndex: 'giftShareName',
					placeholder: '请输入计划名称',
				},
				{
					type: 'datetimerange',
					title: '添加时间',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
				},
			],
			formAction104: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.init(true)
					},
					tableId: 105,
				},
				{
					title: '清空',
					auth: '',
					isClear: true,
				},
				{
					title: '派发礼包',
					type: 'success',
					auth: '',
					click: () => {
						this.userInfoList = []
						this.formData111 = {
							giftShareName: '',
							giftName: '',
							shareType: 2,
							giftCount: '',
							giftId: '',
							selectedUserTags: [],
							selectQiWeiList: [],
							customerType: 0,
						}
						this.changShareType()
						this.$nextTick(() => {
							this.$refs.dialog111.$refs.YxForm.resetFields()
						})
						this.dialogVisible110 = true
					},
					dialogId: 110,
				},
			],
			tableData105: [],
			tableColumns105: [
				{
					type: 'string',
					dataIndex: 'giftShareId',
					title: '派发计划id',
				},
				{
					type: 'string',
					dataIndex: 'giftShareName',
					title: '派发计划名称',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '创建时间',
				},
				{
					type: 'string',
					dataIndex: 'giftName',
					title: '派发礼包名称',
				},
				{
					type: 'custom',
					dataIndex: 'shareTypeText',
					title: '领取用户',
					align: 'left',
				},
				{
					type: 'custom',
					dataIndex: 'state',
					title: '礼包派发状态',
				},
				{
					type: 'string',
					dataIndex: 'addUserName',
					title: '派发人',
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '启用',
							auth: 'updateGiftShareState',
							popconfirm: true,
							popconfirmTitle: '确认要禁用该派发计划吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								let state = row.state == 1 ? 2 : 1
								this._updateGiftShareState(row, state)
							},
							customRender: (action, row) => {
								action.popconfirmTitle =
									row.state == 1
										? '确认要启用该派发计划吗'
										: '确认要禁用该派发计划吗'
								action.hide = row.state != 1 && row.state != 2
								action.title = row.state == 1 ? '启用' : '禁用'
								return action
							},
						},
						{
							title: '查看派发小程序码',
							auth: 'getGiftShareCode',
							dialogId: '',
							click: (row) => {
								this._getGiftShareCode(row.giftShareId)
							},
							customRender: (action, row) => {
								action.hide = row.state != 2
								return action
							},
						},
						{
							title: '派发数据',
							dialogId: 112,
							click: (row) => {
								this.giftShareId = row.giftShareId
								this._findGiftShareRecord(true)
								this.dialogVisible112 = true
							},
							customRender: (action, row) => {
								action.hide = row.state != 1 && row.state != 2
								return action
							},
						},
						{
							title: '删除',
							auth: 'updateGiftShareState',
							popconfirm: true,
							popconfirmTitle: '确认要删除该派发计划吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._updateGiftShareState(row, 0)
							},
							customRender: (action, row) => {
								action.hide = row.state != 1
								return action
							},
						},
					],
				},
			],
			page105: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			dialogTitle110: '新增派发计划',
			dialogWidth110: '800px',
			dialogVisible110: false,
			dialogBottomBtn110: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog111.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.savePlanList()
							}
						})
					},
				},
			],
			formData111: {
				giftShareName: '',
				groupBrand: '',
				shareType: 2,
				giftCount: '',
				selectedUserTags: [],
				selectQiWeiList: [],
				customerType: 0,
			},
			formRules111: {
				giftShareName: [
					{ required: true, message: '请输入派发计划名称', trigger: 'blur' },
				],
				giftId: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData111.giftId) {
								callback(new Error('请选择礼包'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				giftCount: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (this.formData111.giftCount == '') {
								callback(new Error('请填写礼包数量'))
							} else if (this.formData111.giftCount <= 0) {
								callback(new Error('请填写正确礼包数量'))
							} else if (!/^\d+$/.test(this.formData111.giftCount)) {
								callback(new Error('礼包数量只能输入整数'))
							} else if (this.formData111.giftCount > 999999999) {
								callback(new Error('礼包数量不能超出999999999'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
			},
			formCfg111: [
				{
					type: 'input',
					title: '派发计划名称',
					dataIndex: 'giftShareName',
					placeholder: '请输入派发计划名称',
				},
				{
					type: 'custom',
					title: '选择礼包',
					dataIndex: 'giftId',
				},
				{
					title: '领取用户',
					type: 'radio',
					dataIndex: 'shareType',
					label: 'value',
					change: (shareType) => {
						this.changShareType(shareType)
					},
					options: [
						{
							value: '全部用户',
							shareType: 2,
						},
						{
							value: '部分用户',
							shareType: 1,
						},
						{
							value: '仅店主',
							shareType: 3,
						},
						{
							value: '按用户分群',
							shareType: 4,
						},
						{
							value: '按企微群',
							shareType: 5,
						},
					],
				},
				{
					title: '用户类型',
					type: 'radio',
					dataIndex: 'customerType',
					label: 'value',
					options: [
						{
							value: '全部',
							customerType: 0,
						},
						{
							value: '店主',
							customerType: 1,
						},
						{
							value: '顾客',
							customerType: 2,
						},
					],
					hide: true,
				},
				{
					title: '',
					type: 'custom',
					dataIndex: 'userTag',
					hide: true,
				},
				{
					title: '',
					type: 'custom',
					dataIndex: 'userIds',
					hide: true,
				},
				{
					title: '选择企微群',
					type: 'custom',
					dataIndex: 'qiWeiIds',
					hide: true,
				},
				{
					title: '礼包数量',
					type: 'custom',
					dataIndex: 'giftCount',
				},
			],
			formAction111: [],
			dialogTitle112: '派发数据',
			dialogWidth112: '800px',
			dialogVisible112: false,
			dialogBottomBtn112: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible112 = false
					},
				},
			],
			tableData113: [],
			tableColumns113: [
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: '店铺id',
				},
				{
					type: 'string',
					dataIndex: 'organizationName',
					title: '店铺名称',
				},
				{
					type: 'string',
					dataIndex: 'organizationPhone',
					title: '手机号',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '领取时间',
				},
			],
			page113: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._findGiftShareRecord()
				},
			},
			dialogQiWeiVisible: false,
		}
	},

	created() {
		let curTime = moment().startOf('day').valueOf()
		this.formData104.addTimeStart = moment(
			curTime - 24 * 60 * 60 * 1000 * 7
		).valueOf()
		// this._getUserTagList()
	},

	methods: {
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
		changShareType(type) {
			this.formCfg111.map((item) => {
				if (item.dataIndex == 'userIds') {
					// item.hide = type == 2 || type == 3
					item.hide = type !== 1
				} else if (item.dataIndex == 'userTag') {
					item.hide = type !== 4
				} else if (
					item.dataIndex == 'qiWeiIds' ||
					item.dataIndex == 'customerType'
				) {
					item.hide = type !== 5
				}
			})
			if (type == 4 && !this.userTagList.length) {
				this._getUserTagList()
			}
		},
		onExceed() {
			// 文件超出个数限制时的钩子
			this.$message.warning({
				message: `最多只能上传1个文件`,
			})
		},
		httpRequest: async function (file) {
			let formData = new FormData()
			formData.append('formId', '#excelForm')
			formData.append(
				'data',
				JSON.stringify({
					timeStamp: new Date() * 1,
					groupId: 2,
				})
			)
			formData.append('excel', file.file)
			let {
				data: { resultCode, resultData },
			} = await impostCouponExcel(formData)
			if (resultCode === 0) {
				if (resultData.errorMsg) {
					this.$message.error(resultData.errorMsg)
					this.$refs.uploadExcel.clearFiles()
					return
				}
				this.userInfoList = resultData.userInfoList || []
			}
		},
		// 下载Excel模板
		handleDownExcel() {
			downloadFile(`/excel/platform/礼包派发名单模板.xlsx`)
		},
		savePlanList: async function () {
			let paramJson = Object.assign({}, this.formData111)
			paramJson.giftShareName = paramJson.giftShareName.replace(/\s+/g, '')
			if (paramJson.shareType == 1) {
				if (!this.userInfoList.length) {
					return this.$message.error('请导入小程序用户')
				}
				paramJson.userIds = this.userInfoList.map((item) => {
					return item.userId
				})
			}
			// 用户分群
			if (paramJson.shareType == 4) {
				paramJson.userTagList = this.formData111.selectedUserTags.map(
					(item) => {
						return { userTagId: item.userTagId, userTagName: item.tagName }
					}
				)
			}
			// 企微群
			if (paramJson.shareType == 5) {
				if (!paramJson.selectQiWeiList.length) {
					return this.$message.error('请选择企微群')
				}
				paramJson.qwGroupList = paramJson.selectQiWeiList.map((item) => {
					return {
						qwWechatId: item.chatId,
						qwGroupName: item.chatName,
					}
				})
			}
			delete paramJson.selectQiWeiList
			delete paramJson.selectedUserTags
			console.log('paramJson', paramJson)
			this.$confirm(
				'请确认当前所有信息准确，创建派发计划后本计划不可更改',
				'提示',
				{
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							let {
								data: { resultCode, resultMsg },
							} = await addGiftShare(paramJson)
							if (resultCode == 0) {
								this.$message.success(resultMsg)
								this.dialogVisible110 = false
								this.init(true)
							}
						}
					},
				}
			)
		},
		_findGiftListByParam: async function (flag) {
			this.loading127 = true
			let paramJson = this.findSearchParams127(flag)
			const {
				data: { resultCode, resultData },
			} = await findGiftListByParam(paramJson)
			if (resultCode == 0) {
				this.tableData127 = resultData.giftList
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
			const paramJson = Object.assign(this.formData126, {
				length: this.page127.length,
				startIndex: (this.page127.currentPage - 1) * this.page127.length,
			})
			return paramJson
		},
		openGiftDialog() {
			this.formData126.giftName = ''
			this.dialogVisible125 = true
			this._findGiftListByParam(true)
		},
		changeGiftId(row) {
			this.formData111.giftId = row.giftId
			this.formData111.giftName = row.giftName
		},
		querySearchAsync: async function (queryString = '', cb) {
			let {
				data: { resultCode, resultData },
			} = await findGiftListByParam({
				giftName: queryString,
				startIndex: 0,
				addTimeStart: 1577808000000,
			})
			if (resultCode == 0) {
				resultData.giftList.map((item) => {
					item.value = item.giftName
				})
				cb(resultData.giftList)
			}
		},
		_getGiftShareCode: async function (id) {
			let {
				data: { resultCode, resultData },
			} = await getGiftShareCode({
				id,
				page: 'pages/gift/giftDistribution',
				scene: 'id=',
			})
			if (resultCode == 0) {
				let codeImagePath = resultData.codeImagePath
				codeImagePath = codeImagePath.replace('/data/yhtplusFile/', '')
				this.codeImagePath = getBigImg(codeImagePath)
				this.dialogVisible114 = true
			}
		},
		_updateGiftShareState: async function ({ giftShareId }, state) {
			let {
				data: { resultCode, resultMsg },
			} = await updateGiftShareState({
				giftShareId, //分组id
				state,
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.init()
			}
		},
		exportDataBtn: async function () {
			this.loading112 = true
			let { data } = await exportGiftShareRecord({
				giftShareId: this.giftShareId,
			})
			this.loading112 = false
			downloadFile(data, '礼包派发数据.xlsx')
		},
		_findGiftShareRecord: async function (flag) {
			this.loading113 = true
			let paramJson = this.findSearchParams113(flag)
			const {
				data: { resultCode, resultData },
			} = await findGiftShareRecord(paramJson)
			if (resultCode == 0) {
				this.giftShareCount = resultData.giftShareCount
				this.giftShareRecordCount = resultData.giftShareRecordCount
				this.tableData113 = resultData.giftShareRecordList
				this.page113.count =
					resultData.giftShareRecordCount ||
					resultData.giftShareRecordList.length ||
					0
			} else {
				this.giftShareCount = 0
				this.giftShareRecordCount = 0
				this.tableData113 = []
				this.page113.count = 0
			}
			this.loading113 = false
		},
		findSearchParams113(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page113.currentPage = 1
			}
			const paramJson = Object.assign(
				{
					giftShareId: this.giftShareId,
				},
				{
					length: this.page113.length,
					startIndex: (this.page113.currentPage - 1) * this.page113.length,
				}
			)
			return paramJson
		},
		async init(flag) {
			this.loading = true
			let paramJson = this.findSearchParams105(flag)
			const {
				data: { resultCode, resultData },
			} = await findGiftShareListByParam(paramJson)
			if (resultCode == 0) {
				this.tableData105 = resultData.giftSharList
				this.page105.count = resultData.count
			} else {
				this.tableData105 = []
				this.page105.count = 0
			}
			this.loading = false
		},
		findSearchParams105(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page105.currentPage = 1
			}
			const paramJson = Object.assign(this.formData104, {
				length: this.page105.length,
				startIndex: (this.page105.currentPage - 1) * this.page105.length,
			})
			return paramJson
		},
		saveQiWei(val) {
			this.formData111.selectQiWeiList = val
		},
		handleAddQiWei() {
			this.dialogQiWeiVisible = true
		},
	},
}
</script>
<style scoped>
.share-data {
	display: flex;
	margin-bottom: 20px;
}
.exportData-btn {
	margin-left: 20px;
	height: 40px;
}
.code-image {
	width: 200px;
	height: 200px;
}
.image-box {
	display: flex;
	align-items: center;
	justify-content: center;
}
.package-num {
	width: 100px;
	margin-right: 10px;
}
.user-upload {
	display: flex;
}
.down-btn {
	margin-right: 20px;
	height: 34px;
}
.user-info {
	max-height: 200px;
	overflow-y: scroll;
}
</style>

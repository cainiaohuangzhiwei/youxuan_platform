<template>
	<div class="storeActRebateList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData102"
				:items="formCfg102"
				:formAction="formAction102"
			>
			</yx-form>
			<div class="goods-group-btn-box">
				<el-button type="success" v-auth="'addActiveBonus'" @click="addAward"
					>新增奖励</el-button
				>
				<el-button
					v-auth="'exportFlowOrganizationBouns'"
					@click="_exportFlowOrganizationBouns"
					type="warning"
					>导出Excel</el-button
				>
			</div>
			<yx-accounts v-loading="loading" :items="accountItems104"></yx-accounts>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns103"
				:pagination="page103"
				:data="tableData103"
			>
				<template slot="name" slot-scope="scope">
					<div>
						<el-button
							type="text"
							v-if="scope.row.organizationId > 0 && getOrganizationDetails"
						>
							<router-link
								:to="`/shop/shop/shopDetail/${scope.row.organizationId}`"
								>{{ scope.row.organizationName }}</router-link
							>
						</el-button>
						<p v-else>{{ scope.row.weixinUserName }}</p>
					</div>
				</template>
			</yx-table>
			<Dialog
				:title="dialogTitle105"
				:visible="dialogVisible105"
				:width="dialogWidth105"
				:bottomBtn="dialogBottomBtn105"
				@before-close="dialogVisible105 = false"
			>
				<yx-form
					:inline="true"
					:data="formData106"
					:items="formCfg106"
					:rules="rules"
					:formAction="formAction106"
				>
				</yx-form
				><yx-table
					:select="false"
					v-loading="loading107"
					:columns="tableColumns107"
					:pagination="page107"
					:data="tableData107"
				></yx-table>
			</Dialog>
			<Dialog
				:title="dialogTitle108"
				:visible="dialogVisible108"
				:width="dialogWidth108"
				:bottomBtn="dialogBottomBtn108"
				@before-close="dialogVisible108 = false"
			>
				<yx-form
					:inline="true"
					:data="formData109"
					:items="formCfg109"
					:formAction="formAction109"
				>
				</yx-form
				><yx-table
					:select="false"
					v-loading="loading110"
					:columns="tableColumns110"
					:pagination="page110"
					:data="tableData110"
				></yx-table>
			</Dialog>
			<Dialog
				:title="dialogTitle110"
				:visible="dialogVisible110"
				:width="dialogWidth110"
				:bottomBtn="dialogBottomBtn110"
				@before-close="dialogVisible110 = false"
			>
				<yx-form
					ref="dialog110"
					v-loading="loading112"
					labelWidth="100px"
					:data="formData110"
					:items="formCfg110"
					:rules="formRules110"
				>
					<template slot="awardType">
						<el-radio-group
							v-model="formData110.awardType"
							@change="changeAwardType"
						>
							<el-radio-button :label="1">固定金额奖励</el-radio-button>
							<el-radio-button :label="2">不定金额奖励</el-radio-button>
							<el-radio-button :label="3">excel批量奖励</el-radio-button>
						</el-radio-group>
					</template>
					<template slot="awardType" v-if="formData110.awardType != 3">
						<div class="text-btn">
							<el-button
								class="btn-item prefix-star"
								@click="showDialo108"
								type="text"
								>选择店主</el-button
							>
							<el-button
								@click="showDialo105"
								class="btn-item prefix-star"
								type="text"
								>选择用户</el-button
							>
							<p v-if="formData110.awardType == 1">
								<span v-for="(item, index) in selectOgList" :key="index"
									>{{ item.organizationName
									}}{{ index >= selectOgList.length - 1 ? '' : ',' }}</span
								>
							</p>
							<p v-if="formData110.awardType == 1">
								<span v-for="(item, index) in selectUserList" :key="index"
									>{{ item.weixinUserName
									}}{{ index >= selectUserList.length - 1 ? '' : ',' }}</span
								>
							</p>
							<div v-if="formData110.awardType == 2">
								<div
									class="user-item"
									v-for="(item, index) in selectOgList"
									:key="index"
								>
									<span class="user-name">
										店主名称：{{ item.organizationName }}
									</span>
									<div class="user-rigth">
										奖励金额：<el-input
											type="number"
											class="user-amount"
											v-amount="item.amount"
											v-model="item.amount"
										></el-input>
										<el-button
											type="danger"
											@click="selectOgList.splice(index, 1)"
											>删除</el-button
										>
									</div>
								</div>
								<div
									class="user-item"
									v-for="(item, index) in selectUserList"
									:key="index"
								>
									<span class="user-name">
										用户名称：{{ item.weixinUserName }}
									</span>
									<div class="user-rigth">
										奖励金额：<el-input
											type="number"
											class="user-amount"
											v-amount="item.amount"
											v-model="item.amount"
										></el-input>
										<el-button
											type="danger"
											@click="selectUserList.splice(index, 1)"
											>删除</el-button
										>
									</div>
								</div>
							</div>
						</div>
					</template>
					<template slot="excelForm" v-else>
						<div class="user-upload text-btn">
							<el-upload
								ref="uploadExcel"
								:limit="1"
								accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
								:before-upload="beforeUpload"
								:on-exceed="onExceed"
								:http-request="httpRequest"
							>
								<el-button slot="trigger" class="mr20" icon="el-icon-plus">
									导入Excel表
								</el-button>
							</el-upload>
							<el-button class="down-btn" @click="downloadExcelTpl" type="text"
								>下载Excel模板</el-button
							>
							<!-- <el-button type="success">上传文件</el-button> -->
						</div>
						<p v-if="ckeckActBonusData.amount">
							奖励总金额：{{ ckeckActBonusData.amount }}
						</p>
						<!-- <div class="text-btn">
							<el-button class="btn-item" type="text">+导入Excel表</el-button>
							 <el-button @click="downloadExcelTpl" class="btn-item" type="text"
								>下载Excel模板</el-button
							>
						</div> -->
					</template>
					<template slot="awardAmount">
						<div>
							<el-input
								type="number"
								class="amount-input"
								v-amount="formData110.awardAmount"
								v-model="formData110.awardAmount"
							></el-input>
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
import YxAccounts from '@/components/Accounts'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import moment from 'moment'
import { downloadFile } from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth.js'
import {
	findFlowOrganizationBouns,
	exportFlowOrganizationBouns,
	findRemainderByType,
	addActiveBonus,
	checkFinancePassWord,
} from '@/api/yhtPlusCmsFinance'
import { getOrganizationListByCondition } from '@/api/yhtPlusCmsOrganization'
import { getWeixinUserListByCondition } from '@/api/yhtPlusCmsUser'
import { ckeckActBonus, impostActBonus } from '@/api/webImport'
import { getPublicKeyAndModel } from '@/api/webUser.js'
import RSA from 'js-rsa-dave'
import { getConstantValueByKey } from '@/utils/helper/common'
export default {
	name: 'StoreActRebateList',
	components: {
		BasicContainer,
		YxForm,
		YxAccounts,
		YxTable,
		Dialog,
	},
	props: [],
	data() {
		return {
			loading112: false,
			loading107: false,
			loading110: false,
			loading: false,
			activeName: '',
			formData110: {
				awardType: 1,
				awardAmount: '',
				bonusType: 1,
				awardAccount: '',
				awardAccountAmount: 0,
				remark: '',
			},
			formRules110: {
				awardAmount: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (
								(this.formData110.awardType == 1 &&
									!this.formData110.awardAmount) ||
								(this.formData110.awardType == 1 &&
									this.formData110.awardAmount <= 0)
							) {
								callback(new Error('请输入奖励金额'))
							} else if (
								this.formData110.bonusType == 1 &&
								this.formData110.awardAmount < 1
							) {
								callback(new Error('选择奖励到微信零钱最少为1元'))
							} else {
								callback()
							}
						},
					},
				],
				awardAccount: [
					{ required: true, message: '请选择奖励账户', trigger: 'change' },
				],
				remark: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (this.formData110.awardType != 3 && !this.formData110.remark) {
								callback(new Error('请输入奖励金额'))
							} else {
								callback()
							}
						},
					},
				],
			},
			formCfg110: [
				{
					type: 'custom',
					unformItem: true,
					dataIndex: 'awardTypeList',
				},
				{
					type: 'custom',
					unformItem: true,
					dataIndex: 'awardType',
				},
				{
					type: 'custom',
					unformItem: true,
					dataIndex: 'excelForm',
					hide: true,
				},
				{
					type: 'custom',
					title: '奖励金额',
					dataIndex: 'awardAmount',
					hide: false,
				},
				{
					type: 'radio',
					title: '奖励方式',
					dataIndex: 'bonusType',
					label: 'value',
					options: [
						{
							bonusType: 1,
							value: '奖励到微信零钱',
						},
						{
							bonusType: 2,
							value: '奖励到店主余额',
							disabled: false,
						},
						{
							bonusType: 3,
							value: '用户自行转账',
							disabled: false,
						},
					],
				},
				{
					type: 'select',
					title: '奖励账户',
					dataIndex: 'awardAccount',
					label: 'value',
					change: (type) => {
						this._findRemainderByType(type)
					},
					options: [
						{
							awardAccount: 7,
							value: '营销账号',
						},
					],
				},
				{
					type: 'text',
					title: '账户余额',
					dataIndex: 'awardAccountAmount',
				},
				{
					type: 'textarea',
					title: '备注',
					dataIndex: 'remark',
				},
			],
			dialogTitle110: '新增奖励',
			dialogVisible110: false,
			dialogWidth110: '800px',
			dialogBottomBtn110: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog110.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveAddAward()
								// this.dialogVisible105 = false
							}
						})
					},
				},
			],
			getOrganizationDetails: checkFunctionCode('getOrganizationDetails'),
			formData102: {
				keyword: '',
				bonusType: '',
				addTimeStart: moment().startOf('month').valueOf(),
				addTimeEnd: moment().endOf('month').valueOf(),
				transferStates: [1, 2, 3, 4, 5],
			},
			formCfg102: [
				{
					type: 'input',
					title: '关键词',
					dataIndex: 'keyword',
					placeholder: '请输入关键词',
				},
				{
					type: 'datetimerange',
					title: '奖励时间',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
				},
				{
					type: 'select',
					title: '奖励方式',
					dataIndex: 'bonusType',
					placeholder: '请选择奖励方式',
					change: () => {
						if (!this.loading) this.getData103(true)
					},
					label: 'value',
					options: this.$store.state.app.constant.REWARD_WAY,
				},
				{
					type: 'input',
					title: '交易流水号',
					dataIndex: 'responsePaymentNo',
					placeholder: '请输入关键词',
				},
				{
					type: 'checkbox',
					title: '奖励状态',
					dataIndex: 'transferStates',
					placeholder: '请输入奖励状态',
					label: 'value',
					options: [
						{
							transferStates: 1,
							value: '转账中',
						},
						{
							transferStates: 2,
							value: '转账微信成功',
						},
						{
							transferStates: 3,
							value: '转账失败',
						},
						{
							transferStates: 4,
							value: '转账余额成功',
						},
						{
							transferStates: 5,
							value: '待转账',
						},
					],
				},
			],
			formAction102: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData103(true)
					},
					tableId: 103,
				},
			],
			accountItems104: [
				{
					type: 'amount',
					title: '返现总额',
					value: '0.00',
				},
			],
			tableData103: [],
			tableColumns103: [
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: 'ID',
				},
				{
					type: 'custom',
					dataIndex: 'name',
					title: '名称',
				},
				{
					type: 'amount',
					dataIndex: 'amount',
					title: '奖励金额',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '奖励时间',
				},
				{
					type: 'string',
					dataIndex: 'bonusType',
					title: '奖励方式',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.REWARD_WAY,
							row.bonusType,
							'其他',
							'bonusType'
						)
					},
				},
				{
					type: 'newMap',
					dataIndex: 'type',
					title: '奖励账户',
					options: [
						['2', '成本账号'],
						['3', '盈利账号'],
						['4', '返退账号'],
						['7', '营销账号'],
					],
				},
				{
					type: 'string',
					dataIndex: 'transferState',
					title: '奖励状态',
					customRender: ({ transferState, errRemark }) => {
						if (transferState == 1) {
							return '转账中'
						} else if (transferState == 2) {
							return '转账成功'
						} else if (transferState == 3) {
							return '转账失败(' + errRemark + ')'
						} else if (transferState == 4) {
							return '转账成功'
						} else if (transferState == 5) {
							return '待转账'
						} else {
							return '其他'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'responsePaymentNo',
					title: '关联交易流水号',
					customRender: (row) => {
						return row.responsePaymentNo || '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'transactor',
					title: '经办人',
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
			],
			page103: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData103()
				},
			},
			dialogTitle105: '选择用户',
			dialogWidth105: '800px',
			dialogVisible105: false,
			dialogBottomBtn105: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible105 = false
					},
				},
			],
			formData106: {
				keyWord: '',
			},
			formCfg106: [
				{
					type: 'input',
					title: '筛选',
					dataIndex: 'keyWord',
					placeholder: '用户名称/openId',
				},
			],
			rules: {
				keyWord: [
					{
						required: true,
						message: '请输入用户名称/openId',
						trigger: 'blur',
					},
				],
			},
			formAction106: [
				{
					title: '查询',
					type: 'primary',
					yapiId: '',
					token: '',
					dialogId: '',
					click: () => {
						this.getData107(true)
					},
				},
			],
			tableData107: [],
			tableColumns107: [
				{
					type: 'string',
					dataIndex: 'userId',
					title: '用户ID',
				},
				{
					type: 'string',
					dataIndex: 'weixinUserName',
					title: '用户名称',
				},
				{
					title: '微信openId',
					type: 'string',
					dataIndex: 'openId',
				},
				{
					title: '标题',
					type: 'action',
					fixed: 'right',
					actions: [
						{
							title: '添加',
							auth: '',
							dialogId: '',
							click: (row) => {
								this.selectUser(row)
							},
							customRender: (action, row) => {
								let flag = this.selectUserList.some(
									(item) => item.userId === row.userId
								)
								action.title = flag ? '移除' : '添加'
								return action
							},
						},
					],
				},
			],
			selectUserList: [],
			page107: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData107()
				},
			},
			dialogTitle108: '选择店主',
			dialogWidth108: '800px',
			dialogVisible108: false,
			dialogBottomBtn108: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible108 = false
					},
				},
			],
			formData109: {
				phone: '',
			},
			formCfg109: [
				{
					type: 'input',
					title: '筛选',
					dataIndex: 'phone',
					placeholder: '手机号/店铺名称',
				},
			],
			formAction109: [
				{
					title: '查询',
					type: 'primary',
					yapiId: '',
					token: '',
					dialogId: '',
					click: () => {
						this.getData110(true)
					},
				},
			],
			tableData110: [],
			tableColumns110: [
				{
					type: 'string',
					dataIndex: 'userId',
					title: '用户ID',
				},
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: '店铺ID',
				},
				{
					title: '手机号',
					type: 'string',
					dataIndex: 'phone',
				},
				{
					title: '店铺名称',
					type: 'string',
					dataIndex: 'organizationName',
				},
				{
					title: '标题',
					type: 'action',
					fixed: 'right',
					actions: [
						{
							title: '添加',
							auth: '',
							dialogId: '',
							click: (row) => {
								this.selectOg(row)
							},
							customRender: (action, row) => {
								let flag = this.selectOgList.some(
									(item) => item.organizationId === row.organizationId
								)
								action.title = flag ? '移除' : '添加'
								return action
							},
						},
					],
				},
			],
			selectOgList: [],
			ckeckActBonusData: {},
			file: null,
			page110: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData110()
				},
			},
		}
	},

	created() {
		this.getData103(true)
	},

	methods: {
		//	新增奖励
		saveAddAward() {
			let paramJson = {
				amount: this.formData110.awardAmount,
				type: this.formData110.awardAccount,
				bonusType: this.formData110.bonusType,
				remark: this.formData110.remark,
				orgJsonList: [],
				userJsonList: [],
			}
			const h = this.$createElement
			if (this.formData110.awardType == 3) {
				if (!this.ckeckActBonusData.amount) {
					this.$message.warning('请重新上传Excel文件')
					return
				}
				if (this.ckeckActBonusData.amount < 1 && paramJson.bonusType == 1) {
					this.$message.warning('选择奖励到微信零钱最少为1元')
					return
				}
				this.$msgbox({
					title: '提示',
					message: h('div', [
						h('p', `奖励总金额：${this.ckeckActBonusData.amount}元`),
						h(
							'p',
							`奖励方式：${getConstantValueByKey(
								this.$store.state.app.constant.REWARD_WAY,
								paramJson.bonusType,
								'其他',
								'bonusType'
							)}`
						),
						h('p', `转账账户：营销账号`),
						h('p', '是否确定奖励？'),
					]),
					showCancelButton: false,
					confirmButtonText: '确定',
				}).then(async (action) => {
					if (action == 'confirm') {
						let formData = new FormData()
						formData.append(
							'data',
							JSON.stringify({
								bonusType: paramJson.bonusType,
								type: paramJson.type,
							})
						)
						formData.append('excel', this.file)
						this.loading112 = true
						let {
							data: { resultCode, resultMsg },
						} = await impostActBonus(formData)
						this.loading112 = false
						if (resultCode == 0) {
							this.$message.success(resultMsg)
							this.dialogVisible110 = false
							this.getData103(true)
						}
					}
				})
				return
			}
			if (!this.selectOgList.length && !this.selectUserList.length) {
				this.$message.warning('请选择奖励用户')
				return
			}
			let name = this.selectOgList.length ? '店主' : '用户'
			let selectNameText = ''
			let orgJsonList = []
			let userJsonList = []
			let amountFlag = false
			let awardTotalAmount = 0
			if (this.selectOgList.length) {
				this.selectOgList.map((item, index) => {
					if (index > 0) {
						selectNameText += ',' + item.organizationName
					} else {
						selectNameText += item.organizationName
					}
					let amount =
						this.formData110.awardType == 1 ? paramJson.amount : item.amount
					awardTotalAmount += amount
					if (
						(this.formData110.awardType == 1 &&
							paramJson.amount < 1 &&
							paramJson.bonusType == 1) ||
						(this.formData110.awardType == 2 &&
							item.amount < 1 &&
							paramJson.bonusType == 1)
					) {
						amountFlag = true
					}
					orgJsonList.push({
						organizationId: item.organizationId,
						amount:
							this.formData110.awardType == 1 ? paramJson.amount : item.amount,
						remark: paramJson.remark,
					})
				})
			} else {
				this.selectUserList.map((item, index) => {
					let amount =
						this.formData110.awardType == 1 ? paramJson.amount : item.amount
					awardTotalAmount += amount
					if (
						(this.formData110.awardType == 1 &&
							paramJson.amount < 1 &&
							paramJson.bonusType == 1) ||
						(this.formData110.awardType == 2 &&
							item.amount < 1 &&
							paramJson.bonusType == 1)
					) {
						amountFlag = true
					}
					if (index > 0) {
						selectNameText += ',' + item.weixinUserName
					} else {
						selectNameText += item.weixinUserName
					}
					userJsonList.push({
						rewardUserId: item.userId,
						amount:
							this.formData110.awardType == 1 ? paramJson.amount : item.amount,
						remark: paramJson.remark,
					})
				})
			}
			if (amountFlag) {
				this.$message.warning('选择奖励到微信零钱最少为1元')
				return
			}
			this.$msgbox({
				title: '提示',
				message: h('div', [
					h('p', `奖励总金额：${awardTotalAmount}元`),
					h('p', `奖励给${name}:${selectNameText}`),
					h(
						'p',
						`奖励方式：${getConstantValueByKey(
							this.$store.state.app.constant.REWARD_WAY,
							paramJson.bonusType,
							'其他',
							'bonusType'
						)}`
					),
					h('p', `转账账户：营销账号`),
					h('p', `备注：${paramJson.remark}`),
					h('p', '是否确定奖励？'),
				]),
				showCancelButton: false,
				confirmButtonText: '确定',
			}).then(async (action) => {
				if (action == 'confirm') {
					let newParamJson = await this.getRSAAmount(paramJson)
					newParamJson.orgJsonList = orgJsonList
					newParamJson.userJsonList = userJsonList
					this.loading112 = true
					let {
						data: { resultCode, resultMsg },
					} = await addActiveBonus(newParamJson)
					this.loading112 = false
					if (resultCode == 0) {
						this.$message.success(resultMsg)
						this.dialogVisible110 = false
						this.getData103(true)
					}
				}
			})
		},
		async getRSAPassword(paramJson) {
			//加密方法
			let psw = paramJson.password.split('').reverse().join('')
			let rsaData = await getPublicKeyAndModel()
			let publicKey = RSA.getKeyPair(
				rsaData.data.resultData.publicKeyIndex,
				'',
				rsaData.data.resultData.modulus
			)
			paramJson.password = RSA.encryptedString(publicKey, psw)
			paramJson.privateKeySessionKey =
				rsaData.data.resultData.privateKeySessionKey
			return paramJson
		},
		async getRSAAmount(paramJson) {
			paramJson.amount = paramJson.amount.toString()
			let amount = paramJson.amount.split('').reverse().join('')
			let rsaData = await getPublicKeyAndModel()
			let publicKey = RSA.getKeyPair(
				rsaData.data.resultData.publicKeyIndex,
				'',
				rsaData.data.resultData.modulus
			)
			paramJson.amount = RSA.encryptedString(publicKey, amount)
			paramJson.privateKeySessionKey =
				rsaData.data.resultData.privateKeySessionKey
			return paramJson
		},
		async beforeUpload(file) {
			const isLt2M = file.size / 1024 / 1024 < 2
			if (!isLt2M) {
				this.$message({
					message: '上传文件大于2M,请重新选择!',
					type: 'warning',
				})
				return Promise.reject(isLt2M)
			}
			return isLt2M
		},
		async httpRequest(file) {
			let formData = new FormData()
			formData.append('formId', '#excelForm')
			formData.append(
				'data',
				JSON.stringify({
					timeStamp: new Date() * 1,
					groupId: this.$store.state.user.userInfo.groupId || '',
				})
			)
			formData.append('excel', file.file)
			this.file = file.file
			let {
				data: { resultCode, resultData, resultMsg },
			} = await ckeckActBonus(formData)
			if (resultCode != 0 && resultData && resultData.errorInfo) {
				let errorInfo = ''
				resultData.errorInfo.map((item) => {
					errorInfo += item
				})
				this.$message({
					showClose: true,
					message: errorInfo,
					type: 'error',
					duration: 5000,
				})
			} else if (resultCode != 0) {
				this.$message.error(resultMsg)
			} else if (resultCode == 0) {
				this.ckeckActBonusData = resultData
			}
		},
		onExceed() {
			// 文件超出个数限制时的钩子
			this.$message.warning({
				message: `最多只能上传1个文件`,
			})
		},
		downloadExcelTpl() {
			downloadFile('/excel/platform/导入奖励模板.xlsx')
		},
		// 选择用户
		selectUser(row) {
			let newRow = JSON.parse(JSON.stringify(row))
			let flag = this.selectUserList.some(
				(item) => item.userId === newRow.userId
			)
			if (!flag) {
				this.selectUserList.push(newRow)
			} else {
				let index = this.selectUserList.findIndex((item) => {
					return item.userId == newRow.userId
				})
				this.selectUserList.splice(index, 1)
			}
			this.formCfg110.map((item) => {
				if (item.dataIndex == 'bonusType') {
					item.options.map((opt) => {
						if (opt.bonusType == 2) {
							opt.disabled = this.selectUserList.length > 0
						}
					})
				}
			})
			if (this.selectUserList.length > 0) {
				this.formData110.bonusType = 1
			}
		},
		// 选择店主
		selectOg(row) {
			let newRow = JSON.parse(JSON.stringify(row))
			let flag = this.selectOgList.some(
				(item) => item.organizationId === newRow.organizationId
			)
			if (!flag) {
				this.selectOgList.push(newRow)
			} else {
				let index = this.selectOgList.findIndex((item) => {
					return item.organizationId == newRow.organizationId
				})
				this.selectOgList.splice(index, 1)
			}
		},
		changeAwardType(type) {
			this.formCfg110.map((item) => {
				if (item.dataIndex == 'awardAmount') {
					item.hide = type != 1
				}
				if (item.dataIndex == 'remark') {
					item.hide = type == 3
				}
				if (item.dataIndex == 'bonusType') {
					item.options.map((opt) => {
						if (opt.bonusType == 2) {
							opt.disabled = false
						}
					})
				}
			})
			this.selectOgList = []
			this.selectUserList = []
			this.formData110.awardAmount = ''
			this.formData110.bonusType = 1
			this.formData110.awardAccount = ''
			this.formData110.awardAccountAmount = 0
			this.formData110.remark = ''
			this.$refs.dialog110.$refs.YxForm.clearValidate()
			this.$forceUpdate()
		},
		addAward() {
			this.$prompt('输入密码', '', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
				inputErrorMessage: '请输入密码',
				inputType: 'password',
			}).then(async ({ value }) => {
				const loading = this.$loading({
					lock: true,
					text: '校验密码中，请稍等',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)',
				})
				let {
					data: { resultCode },
				} = await checkFinancePassWord(
					await this.getRSAPassword({
						password: value,
					})
				)
				loading.close()
				if (resultCode == 0) {
					this.selectOgList = []
					this.selectUserList = []
					this.formData110 = {
						awardType: 1,
						awardAmount: '',
						bonusType: 1,
						awardAccount: '',
						awardAccountAmount: 0,
						remark: '',
					}
					this.dialogVisible110 = true
					this.$nextTick(() => {
						this.$refs.dialog110.$refs.YxForm.clearValidate()
					})
				}
			})
		},
		// 获取账户余额
		async _findRemainderByType(type) {
			let {
				data: { resultCode, resultData },
			} = await findRemainderByType({ type })
			if (resultCode == 0) {
				this.formData110.awardAccountAmount = resultData
			}
		},
		// 导出
		async _exportFlowOrganizationBouns() {
			let paramJson = this.formData102
			let { data } = await exportFlowOrganizationBouns(paramJson)
			downloadFile(data, '营销费用信息表.xlsx')
		},
		showDialo105() {
			this.dialogVisible105 = true
			this.formData106.keyWord = ''
			this.tableData107 = []
			this.selectOgList = []
			this.page107.count = 0
			// this.getData107(true)
		},
		async getData107(flag) {
			this.loading107 = true
			let paramJson = this.findSearchParams107(flag)
			const {
				data: { resultCode, resultData },
			} = await getWeixinUserListByCondition(paramJson)
			if (resultCode == 0) {
				this.tableData107 = resultData.userList
				this.page107.count = resultData.count
			} else {
				this.tableData107 = []
				this.page107.count = 0
			}
			this.loading107 = false
		},
		findSearchParams107(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page107.currentPage = 1
			}
			const paramJson = Object.assign(this.formData106, {
				length: this.page107.length,
				startIndex: (this.page107.currentPage - 1) * this.page107.length,
			})
			return paramJson
		},
		showDialo108() {
			this.dialogVisible108 = true
			this.formData109.phone = ''
			this.tableData110 = []
			this.selectUserList = []
			this.page110.count = 0
		},
		async getData110(flag) {
			this.loading110 = true
			let paramJson = this.findSearchParams110(flag)
			const {
				data: { resultCode, resultData },
			} = await getOrganizationListByCondition(paramJson)
			if (resultCode == 0) {
				this.tableData110 = resultData.organizationList
				this.page110.count = resultData.organizationCount
			} else {
				this.tableData110 = []
				this.page110.count = 0
			}
			this.loading110 = false
		},
		findSearchParams110(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page110.currentPage = 1
			}
			const paramJson = Object.assign(this.formData109, {
				length: this.page110.length,
				startIndex: (this.page110.currentPage - 1) * this.page110.length,
			})
			return paramJson
		},
		async getData103(flag) {
			this.loading = true
			let paramJson = this.findSearchParams103(flag)
			const {
				data: { resultCode, resultData },
			} = await findFlowOrganizationBouns(paramJson)
			if (resultCode == 0) {
				this.accountItems104[0].value = resultData.amountSum || 0
				this.tableData103 = resultData.list
				this.page103.count = resultData.count
			} else {
				this.accountItems104[0].value = 0
				this.tableData103 = []
				this.page103.count = 0
			}
			this.loading = false
		},
		findSearchParams103(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page103.currentPage = 1
			}
			const paramJson = Object.assign(this.formData102, {
				length: this.page103.length,
				startIndex: (this.page103.currentPage - 1) * this.page103.length,
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
.text-btn {
	margin: 10px 0;
}
.btn-item {
	margin-right: 50px;
}
.prefix-star:before {
	content: '*';
	color: #ff6c60;
}
.user-upload {
	display: flex;
}
.down-btn {
	margin-left: 60px;
	height: 34px;
}
.user-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 5px 0;
}
.user-name {
	flex: 1;
}
.user-rigth {
	width: 300px;
	display: flex;
	align-items: center;
	padding-left: 20px;
	box-sizing: border-box;
}
.user-amount {
	width: 100px;
	margin-right: 20px;
}
</style>

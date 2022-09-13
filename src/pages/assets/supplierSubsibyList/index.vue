<template>
	<div class="supplierSubsibyList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
			</yx-form>
			<div class="goods-group-btn-box">
				<el-button v-auth="'addPlatformReward'" type="primary" @click="addAward"
					>新增奖励</el-button
				>
				<el-button
					@click="showImport"
					v-auth="'addPlatformReward'"
					type="primary"
					>导入Excel</el-button
				>
				<el-button
					v-auth="'updateGoodsGroupByGoodsGroupId'"
					@click="exportExcel"
					type="primary"
					>导出Excel</el-button
				>
			</div>
			<yx-accounts v-loading="loading" :items="accountItems102"></yx-accounts>
			<yx-table
				:select="true"
				v-loading="loading"
				:selectionChange="selectionChange"
				:columns="tableColumns104"
				:pagination="page104"
				:data="tableData104"
			></yx-table>
			<Dialog
				:title="dialogTitle105"
				:visible="dialogVisible105"
				:width="dialogWidth105"
				:bottomBtn="dialogBottomBtn105"
				@before-close="dialogVisible105 = false"
			>
				<yx-form
					ref="formRef106"
					labelWidth="100px"
					:data="formData106"
					:items="formCfg106"
					:formAction="formAction106"
					:rules="formRules106"
				>
					<template slot="award">
						<el-radio-group class="award-box" v-model="formData106.award">
							<el-radio class="award-item" :label="1">
								奖励金额
								<el-input
									class="amount-input"
									type="number"
									v-if="formData106.award == 1"
									v-amount="formData106.rewardAmount"
									v-model="formData106.rewardAmount"
								></el-input
							></el-radio>
							<el-radio class="award-item" :label="2">
								补偿金额<el-input
									type="number"
									class="amount-input"
									v-if="formData106.award == 2"
									v-amount="formData106.compensateAmount"
									v-model="formData106.compensateAmount"
								></el-input
							></el-radio>
						</el-radio-group>
					</template>
				</yx-form>
			</Dialog>
			<Dialog
				:title="dialogTitle109"
				:visible="dialogVisible109"
				:width="dialogWidth109"
				:bottomBtn="dialogBottomBtn109"
				@before-close="dialogVisible109 = false"
			>
				<yx-form
					ref="dialog110"
					labelWidth="100px"
					:data="formData110"
					:items="formCfg110"
					:formAction="formAction110"
				>
					<template slot="downloadExcelTemp">
						<div>
							<el-button
								class="down-btn"
								@click="handleDownExcel"
								type="primary"
								>下载模板</el-button
							>
						</div>
					</template>
					<!-- <template slot="excelDrop">
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
						</div>
					</template> -->
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
import { supplierAccountNumberList } from '@/api/yhtPlusCmsSupplierAccountNumber'
import {
	getPlatformRewardListByCondition,
	addPlatformReward,
	exportPlatformRewardListByCondition,
} from '@/api/yhtPlusCmsFinance'
import { importPlatformReward } from '@/api/webImport'

export default {
	name: 'SupplierSubsibyList',
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
			formCfg110: [
				{
					type: 'custom',
					title: '下载模板',
					dataIndex: 'downloadExcelTemp',
				},
				{
					type: 'upload',
					dataIndex: 'fileStream',
					title: '上传Excel',
					uploadAttributes: {
						limit: 1,
						// autoUpload: false,
						accept:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
						httpRequest: (file) => this._importPlatformReward(file),
					},
					class: 'excel-upload',
				},
				{
					type: 'text',
					dataIndex: 'excelTip',
				},
			],
			formData110: {
				excelTip: '',
			},
			dialogTitle109: '导入Excel(商家补贴)',
			dialogWidth109: '600px',
			dialogVisible109: false,
			dialogBottomBtn109: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog110.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.configurationSave()
								// this.dialogVisible105 = false
							}
						})
					},
				},
			],
			loading: false,
			formData101: {
				supplierAccountNumberId: '',
				sourceName: '',
				addTimeStart: moment().startOf('month').valueOf(),
				addTimeEnd: moment().endOf('month').valueOf(),
				subsidyStartTime: '',
				subsidyEndTime: '',
			},
			formCfg101: [
				{
					type: 'select',
					title: '商家',
					dataIndex: 'supplierAccountNumberId',
					label: 'supplierName',
					options: [],
				},
				{
					type: 'select',
					title: '下单设备',
					dataIndex: 'sourceName',
					label: 'value',
					options: [
						{
							value: '全部',
							sourceName: '',
						},
						{
							sourceName: 'mi-01',
							value: 'mi-01',
						},
						{
							sourceName: 'mi-02',
							value: 'mi-02',
						},
						{
							sourceName: 'mi-03',
							value: 'mi-03',
						},
						{
							sourceName: 'mi-04',
							value: 'mi-04',
						},
						{
							sourceName: 'mi-05',
							value: 'mi-05',
						},
						{
							sourceName: 'mi-06',
							value: 'mi-06',
						},
						{
							sourceName: 'mi-07',
							value: 'mi-07',
						},
						{
							sourceName: 'mi-08',
							value: 'mi-08',
						},
						{
							sourceName: 'mi-09',
							value: 'mi-09',
						},
					],
				},
				{
					title: '录入时间',
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
				{
					title: '补贴时间',
					type: 'datetimerange',
					dataIndex: ['subsidyStartTime', 'subsidyEndTime'],
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
			],
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getData104(true)
					},
				},
			],
			accountItems102: [
				{
					type: 'amount',
					title: '奖励总额',
					value: '0.00',
				},
				{
					type: 'amount',
					title: '补偿总额',
					value: '0.00',
				},
			],
			tableData104: [],
			tableColumns104: [
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '录入时间',
				},
				{
					type: 'string',
					dataIndex: 'subsidyStartTime',
					title: '补贴时间',
					customRender: (row) => {
						return row.subsidyStartTime && row.subsidyEndTime
							? moment(row.subsidyStartTime).format('YYYY-MM-DD HH:mm:ss') +
									'-' +
									moment(row.subsidyEndTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
					customRender: ({ supplierName, sourceType }) => {
						if (supplierName) {
							return supplierName
						} else if (sourceType) {
							if (sourceType == 1) {
								return 'AKC'
							} else if (sourceType == 2) {
								return 'HYK'
							} else if (sourceType == 3) {
								return 'BBC'
							} else if (sourceType == 4) {
								return 'WPC'
							} else if (sourceType == 5) {
								return '京东联盟'
							} else if (sourceType == 6) {
								return '海外购'
							} else if (sourceType == 7) {
								return '砍单活动'
							} else if (sourceType == 8) {
								return '奥买家'
							} else if (sourceType == 9) {
								return '自有品牌'
							} else if (sourceType == 10) {
								return '商家'
							} else if (sourceType == 11) {
								return '购拉拉'
							} else if (sourceType == 12) {
								return '超链'
							} else if (sourceType == 13) {
								return '自有品牌-海外'
							} else {
								return '-'
							}
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'platformName',
					title: '下单设备',
				},
				{
					type: 'amount',
					dataIndex: 'rewardAmount',
					title: '奖励金额',
					renderHeader: (h, { column }) => {
						return this.renderHeader(h, { column })
					},
				},
				{
					type: 'string',
					dataIndex: 'compensateAmount',
					title: '补偿金额',
					renderHeader: (h, { column }) => {
						return this.renderHeader(h, { column })
					},
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
			],
			page104: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData104()
				},
			},
			dialogTitle105: '新增奖励',
			dialogWidth105: '600px',
			dialogVisible105: false,
			dialogBottomBtn105: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.formRef106.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveAddAward()
							}
						})
					},
				},
			],
			formData106: {
				supplierAccountNumberId: '',
				platformName: '',
				subsidyStartTime: '',
				subsidyEndTime: '',
				remark: '',
				award: 1,
				rewardAmount: '',
				compensateAmount: '',
			},
			formRules106: {
				supplierAccountNumberId: [
					{ required: true, message: '请选择商家', trigger: 'change' },
				],
				platformName: [
					{ required: true, message: '请选择下单设备', trigger: 'change' },
				],
				subsidyStartTime: [
					{ required: true, message: '请选择开始时间', trigger: 'change' },
				],
				subsidyEndTime: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请选择结束时间'))
							} else if (value < this.formData106.subsidyStartTime) {
								callback(new Error('补贴结束时间必须大于开始时间'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				remark: [{ required: true, message: '请填写备注', trigger: 'blur' }],
			},
			formCfg106: [
				{
					type: 'select',
					title: '商家',
					dataIndex: 'supplierAccountNumberId',
					label: 'supplierName',
					options: [],
				},
				{
					type: 'select',
					title: '下单设备',
					dataIndex: 'platformName',
					label: 'value',
					options: [
						{
							value: 'mi-01',
							platformName: 'mi-01',
						},
						{
							platformName: 'mi-02',
							value: 'mi-02',
						},
						{
							platformName: 'mi-03',
							value: 'mi-03',
						},
						{
							platformName: 'mi-04',
							value: 'mi-04',
						},
						{
							platformName: 'mi-05',
							value: 'mi-05',
						},
						{
							platformName: 'mi-06',
							value: 'mi-06',
						},
						{
							platformName: 'mi-07',
							value: 'mi-07',
						},
						{
							platformName: 'mi-08',
							value: 'mi-08',
						},
						{
							platformName: 'mi-09',
							value: 'mi-09',
						},
					],
				},
				{
					type: 'custom',
					unformItem: true,
					dataIndex: 'award',
				},
				{
					title: '补贴时间',
					type: 'datetimerange',
					dataIndex: ['subsidyStartTime', 'subsidyEndTime'],
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
				{
					title: '备注',
					type: 'textarea',
					dataIndex: 'remark',
				},
			],
			formAction106: [],
			selectList: [],
			importInfo: {},
		}
	},

	created() {
		this._supplierAccountNumberList()
	},

	methods: {
		renderHeader(h, { column }) {
			// 表头提示
			return h('div', [
				h(
					'span',
					{
						style: 'color: red',
					},
					column.label
				),
			])
		},
		showImport() {
			this.formData110.excelTip = ''
			this.dialogVisible109 = true
		},
		async _importPlatformReward(file) {
			let formData = new FormData()
			formData.append('formId', '#excelForm')
			formData.append(
				'data',
				JSON.stringify({
					timeStamp: new Date() * 1,
					groupId: this.$store.state.user.userInfo.groupId,
				})
			)
			formData.append('excel', file.file)
			let {
				data: { resultCode, resultMsg, resultData },
			} = await importPlatformReward(formData)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
				this.formData110.excelTip = `成功导入${
					resultData.successCount
				}条，失败${resultData.errorCount}条，失败信息：${
					resultData.errorMsg ? resultData.errorMsg : '无'
				}`
			}
		},
		// 下载Excel模板
		handleDownExcel() {
			downloadFile(`/excel/platform/商家补贴导入模板.xlsx`)
		},
		// 导出Excel
		exportExcel: async function () {
			let paramJson = this.formData101
			const loading = this.$loading({
				lock: true,
				text: '正在导出，请稍等',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)',
			})
			let { data } = await exportPlatformRewardListByCondition(paramJson)
			loading.close()
			downloadFile(data, '商家补贴表.xlsx')
		},
		// 选择列表
		selectionChange(list) {
			this.selectList = list
		},
		// 保存新增奖励
		async saveAddAward() {
			let paramJson = {
				sourceType: 0,
				supplierAccountNumberId: this.formData106.supplierAccountNumberId,
				platformName: this.formData106.platformName,
				rewardAmount:
					this.formData106.award == 1 ? this.formData106.rewardAmount : 0,
				compensateAmount:
					this.formData106.award == 2 ? this.formData106.compensateAmount : 0,
				subsidyStartTime: this.formData106.subsidyStartTime,
				subsidyEndTime: this.formData106.subsidyEndTime,
				remark: this.formData106.remark,
			}
			if (
				!paramJson.rewardAmount.toString().length ||
				!paramJson.compensateAmount.toString().length
			) {
				this.$message.warning('请填写全部信息')
				return
			}
			let {
				data: { resultCode, resultMsg },
			} = await addPlatformReward(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible105 = false
				this.getData104(true)
			}
		},
		// 新增奖励
		addAward() {
			this.formData106 = {
				supplierAccountNumberId: '',
				platformName: '',
				subsidyStartTime: '',
				subsidyEndTime: '',
				remark: '',
				award: 1,
				rewardAmount: '',
				compensateAmount: '',
			}
			this.dialogVisible105 = true
			this.$nextTick(() => {
				this.$refs.formRef106.$refs.YxForm.clearValidate()
			})
		},
		// 获取商家列表
		async _supplierAccountNumberList() {
			let {
				data: { resultCode, resultData },
			} = await supplierAccountNumberList()
			if (resultCode == 0 && resultData.supplierAccountNumberList) {
				let list = [
					{
						supplierAccountNumberId: '',
						supplierName: '全部',
					},
				]
				list.push(...resultData.supplierAccountNumberList)
				this.formCfg101[0].options = list
				this.formCfg106[0].options = resultData.supplierAccountNumberList
			}
			this.getData104(true)
		},
		// 获取列表数据
		async getData104(flag) {
			this.loading = true
			let paramJson = this.findSearchParams104(flag)
			const {
				data: { resultCode, resultData },
			} = await getPlatformRewardListByCondition(paramJson)
			if (resultCode == 0) {
				if (resultData.flowPlatform) {
					this.accountItems102[0].value = resultData.flowPlatform.rewardAmount
					this.accountItems102[1].value =
						resultData.flowPlatform.compensateAmount
				} else {
					this.accountItems102[0].value = 0
					this.accountItems102[1].value = 0
				}
				this.tableData104 = resultData.flowPlatformList
				this.page104.count = resultData.count
			} else {
				this.tableData104 = []
				this.page104.count = 0
				this.accountItems102[0].value = 0
				this.accountItems102[1].value = 0
			}
			this.loading = false
		},
		findSearchParams104(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page104.currentPage = 1
			}
			const paramJson = Object.assign(this.formData101, {
				length: this.page104.length,
				startIndex: (this.page104.currentPage - 1) * this.page104.length,
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
.award-box {
	display: flex;
	flex-direction: column;
}
.award-item {
	margin-bottom: 20px;
}
.amount-input {
	width: 200px;
	margin-left: 20px;
}
</style>

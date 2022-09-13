<template>
	<basic-container class="form-box">
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="单个转账" name="single">
				<yx-form
					ref="formBox"
					labelWidth="110px"
					:data="searchData"
					:items="searchCfg"
					:rules="rules"
					:formAction="searchAction"
				>
					<template slot="amount" slot-scope="scope">
						<el-input
							type="number"
							v-amount="scope.data.amount"
							v-model="scope.data.amount"
						></el-input>
					</template>
					<template #supplierName>
						<el-input
							v-model="searchData.supplierName"
							placeholder="请选择商家"
							@focus="selectSupplier"
							clearable
							@clear="
								() => {
									searchData.supplierName = ''
									searchData.supplierId = ''
								}
							"
						>
							<el-button
								slot="append"
								icon="el-icon-more"
								@click="formsDialog = true"
							></el-button>
						</el-input>
					</template>
				</yx-form>
			</el-tab-pane>
			<el-tab-pane
				v-if="importTransferAmountRecord"
				label="批量转账"
				name="multi"
			>
				<yx-form
					style="margin-top: 60px"
					ref="form"
					:inline="false"
					:items="importItem"
					:data="importData"
					labelWidth="80px"
				>
					<template #downloadTemp
						><el-button
							icon="el-icon-download"
							@click="downloadImpostTemplate"
							type="primary"
							>下载模板</el-button
						><el-button type="primary" @click="importHistory"
							>查看导入记录</el-button
						>
					</template>
				</yx-form>
			</el-tab-pane>
		</el-tabs>
		<!-- 商家/商家列表 -->
		<supply-dialog
			:itemInfo="supplyRow"
			:visible.sync="formsDialog"
			@fatherMethodInit="
				(row) => {
					searchData.supplierName = row.supplierName
					searchData.supplierId = row.supplierId
				}
			"
		/>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import {
	importTransferAmountRecord,
	saveTransferAmountRecord,
} from '@/api/accountService'
import SupplyDialog from '@/components/SupplyDialog'
import { downloadFile } from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth.js'
export default {
	components: {
		BasicContainer,
		YxForm,
		SupplyDialog,
	},
	name: 'FormTable',

	data() {
		return {
			importTransferAmountRecord: checkFunctionCode(
				'importTransferAmountRecord'
			),
			platformAccountTransfer: checkFunctionCode('platformAccountTransfer'),
			platformAccountTransferOrganization: checkFunctionCode(
				'platformAccountTransferOrganization'
			),
			activeName: 'single',
			formsDialog: false,
			supplyRow: true,
			marketingAccountList: [],
			searchData: {
				transferOutAccount: '微革账户', // 转出账户
				supplierName: '', // 商家id
				supplierId: '', // 商家id
				amount: '', // 转账金额
				transferInAccType: 1, // 转入账户类型
				transferOutAccType: 1, //出账账户类型:1.平台微革账户 2.平台营销账户
				transferRemark: '',
			},
			rules: {
				// transferToAccount: [
				// 	{
				// 		required: true,
				// 		validator: (rule, value, callback) => {
				// 			if (value == '' && !this.searchData.type) {
				// 				callback(new Error('请选择转入账户类型'))
				// 			} else if (value == '' && this.searchData.type == 1) {
				// 				callback(new Error('请选择店主账户'))
				// 			} else {
				// 				callback()
				// 			}
				// 		},
				// 		trigger: 'blur',
				// 	},
				// ],
				supplierName: [
					{ required: true, message: '请选择商家账户', trigger: 'change' },
				],
				type: [
					{ required: true, message: '请选择转入账户类型', trigger: 'change' },
				],
				amount: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (value == '') {
								callback(new Error('请输入转账金额!'))
							} else if (value < 0.01) {
								callback(new Error('金额不能小于0.01'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			importData: {
				goodsFile: [],
				transferOutAccount: '微革账户', // 转出账户
			},
			importItem: [
				{
					type: 'text',
					title: '转出账户',
					dataIndex: 'transferOutAccount',
				},
				{
					type: 'upload',
					title: '批量转账',
					dataIndex: 'goodsFile',
					uploadAttributes: {
						limit: 1,
						autoUpload: false,
						accept:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
						httpRequest: (file) => this._impost(file),
					},
					class: 'excel-upload',
				},
				{
					type: 'custom',
					dataIndex: 'downloadTemp',
				},
			],
			searchCfg: [
				{
					type: 'text',
					title: '转出账户',
					dataIndex: 'transferOutAccount',
				},
				{
					type: 'select',
					title: '转入账户类型',
					label: 'value',
					dataIndex: 'transferInAccType',
					options: [
						{
							transferInAccType: 1,
							value: '商家账户',
						},
					],
				},
				{
					type: 'custom',
					title: '转入账户',
					dataIndex: 'supplierName',
				},
				{
					type: 'custom',
					title: '转账金额',
					dataIndex: 'amount',
				},
				{
					title: '转账备注',
					type: 'textarea',
					maxlength: 120,
					dataIndex: 'transferRemark',
				},
			],

			searchAction: [
				{
					title: '发起',
					auth: 'platformAccountTransfer',
					type: 'primary',
					click: () => {
						this.submit()
					},
				},
				{
					title: '取消',
					cancel: true,
					click: () => {
						this.$store
							.dispatch('tagsView/delVisitedView', this.$route)
							.then(() => {
								this.$store
									.dispatch('tagsView/delVisitedView', this.$route)
									.then(() => {
										this.$router.push({
											path: '/fund/platformAccountList',
										})
									})
							})
					},
				},
			],
		}
	},

	methods: {
		importHistory() {
			this.$router.push({
				path: '/fund/accountTransferImportLog',
			})
		},
		selectSupplier(e) {
			e.target.blur()
			this.formsDialog = true
		},
		//下载模板
		downloadImpostTemplate() {
			downloadFile('/excel/platform/批量转账商家导入.xlsx')
		},
		//导入
		async _impost(file) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({
					timeStamp: new Date().getTime(),
					groupId: 2,
					originatorId: this.$store.state.user.userInfo.organizationId,
					originatorName: this.$store.state.user.userInfo.clerkName,
					clerkId: this.$store.state.user.userInfo.clerkId,
				})
			)
			formData.append('formId', '#goodsForm')
			formData.append('file', file.file)
			let {
				data: { resultCode, resultMsg },
			} = await importTransferAmountRecord(formData)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
			}
			// 清空文件
			this.$refs['form'].$refs.goodsFile[0].clearFiles()
		},
		submit: async function () {
			// 转账到店主账户
			let paramJson = this.searchData
			paramJson.originatorName = this.$store.state.user.userInfo.clerkName
			paramJson.originatorId = this.$store.state.user.userInfo.userId

			let {
				data: { resultCode },
			} = await saveTransferAmountRecord(paramJson)
			if (resultCode == 0) {
				this.$message.success('发起成功！')
				this.searchData = {
					transferOutAccount: '微革账户', // 转出账户
					supplierName: '', // 商家id
					supplierId: '', // 商家id
					amount: '', // 转账金额
					transferInAccType: 1, // 转入账户类型
					transferRemark: '',
					transferOutAccType: 1,
				}
				// this.$store
				// 	.dispatch('tagsView/delVisitedView', this.$route)
				// 	.then(() => {
				// 		this.$router.push({
				// 			path: '/fund/platformAccountList',
				// 		})
				// 	})
			}
		},
	},
}
</script>

<style scoped>
.form-box {
	width: 600px;
}
</style>

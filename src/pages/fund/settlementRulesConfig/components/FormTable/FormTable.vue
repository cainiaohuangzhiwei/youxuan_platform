/* eslint-disable no-unused-vars */
<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
				:rules="funRules"
				ref="form"
			>
				<el-input
					v-model="searchData.supplierName"
					placeholder="请选择商家"
					value-key="supplierName"
					label="supplierName"
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
			</yx-form>

			<yx-form
				ref="ImportForm"
				:inline="true"
				:data="storeData"
				:items="storeFormOptions"
				v-if="importSupplierSettleRule"
			>
			</yx-form>

			<el-row>
				<yx-table
					v-loading="loading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
					:selectionChange="selectionChange"
				>
					<template slot="merchantSettleRuleItemList" slot-scope="scope">
						<div>
							<p
								v-for="(item, index) in scope.row.merchantSettleRuleItemList"
								:key="index"
							>
								{{ index === 0 ? '规则一：' : '规则二：'
								}}{{ substrIt(item.ruleOrderState) }}；{{
									item.ruleDays
								}}天；结算比例{{ item.ruleSettleProportion }}%
							</p>
						</div>
					</template>
				</yx-table>
			</el-row>

			<new-and-edit-dialog
				:itemInfo="row"
				:visible.sync="formsDialog"
				@fatherMethodInit="
					() => {
						this.init(true)
					}
				"
			/>
			<history-dialog :itemInfo="row" :visible.sync="showHistoryDialog" />
			<check-dialog :itemInfo="row" :visible.sync="showCheckDialog" />
		</div>
	</basic-container>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import newAndEditDialog from '../newAndEditDialog'
import historyDialog from '../historyDialog'
import checkDialog from '../checkDialog'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { numberFormat } from '@/utils/helper/common'
import { getConstantValueByKey } from '@/utils/helper/common'

import {
	getMerchantSettleRuleList,
	importSupplierSettleRule,
} from '@/api/orderSettle'
import { checkFunctionCode } from '@/utils/auth'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		newAndEditDialog,
		historyDialog,
		checkDialog,
	},
	name: 'FormTable',

	data() {
		return {
			importSupplierSettleRule: checkFunctionCode('importSupplierSettleRule'),
			storeData: {},
			storeFormOptions: [
				{
					type: 'upload',
					title: '导入规则模板',
					dataIndex: 'fileStream',
					uploadAttributes: {
						limit: 1,
						autoUpload: true,
						accept:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
						httpRequest: (file) => {
							this._importSupplierSettleRule(file, 'excel')
						},
					},
					class: 'excel-upload',
				},
			],
			showHistoryDialog: false, //变更记录
			formsDialog: false,
			showCheckDialog: false, // 查看信息
			row: {}, //当前行选中数据
			numberFormat: numberFormat,
			searchData: {
				supplierId: '',
				supplierName: '',
			},
			loading: false,
			selectionData: [],
			searchCfg: [
				{
					type: 'inputNumber',
					title: '商家ID',
					dataIndex: 'supplierId',
					placeholder: '请输入商家ID',
					enter: () => {
						this.init()
					},
				},
				{
					type: 'input',
					title: '商家名称',
					dataIndex: 'supplierName',
					placeholder: '请输入商家名称',
					enter: () => {
						this.init()
					},
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
						this.init(true)
					},
				},
				{
					title: '新增商家结算规则',
					type: 'primary',
					auth: 'merchantSettleRuleAdd',
					click: () => {
						this.setFormsDialog()
					},
				},
				{
					title: '查看导入历史',
					type: 'primary',
					click: () => {
						this.$router.push({ path: '/fund/importsettlementRules' })
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					dataIndex: 'supplierId',
					title: '商家ID',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '创建时间',
				},
				{
					type: 'date',
					dataIndex: 'effectiveTime',
					title: '生效规则配置时间',
				},
				{
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					dataIndex: 'ruleItemCount',
					title: '账期数量',
				},
				{
					type: 'custom',
					width: 200,
					dataIndex: 'merchantSettleRuleItemList',
					title: '生效结算规则',
				},
				{
					type: 'action',
					title: '操作',
					width: 180,
					actions: [
						{
							title: '查看',
							auth: 'merchantSettleRuleView',
							click: (row) => {
								this.row = row
								this.showCheckDialog = true
							},
						},
						{
							title: '更改结算规则',
							auth: 'merchantSettleRuleEdit',
							click: (row) => {
								this.row = row
								this.formsDialog = true
							},
						},
						{
							title: '变更记录',
							auth: 'merchantSettleRuleHistory',
							click: (row) => {
								this.row = row
								this.showHistoryDialog = true
							},
						},
					],
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
		}
	},

	created() {
		// 相同规则不能同一天，不同规则可以同一天
		this.init(true)
	},

	methods: {
		substrIt(label) {
			let newLabel = getConstantValueByKey(
				this.$store.state.app.constant.RULE_ORDER_STATE,
				label,
				'-',
				'value',
				'label'
			)
			return newLabel.substr(3, newLabel.length)
		},
		setFormsDialog() {
			this.row = ''
			this.formsDialog = true
		},
		getType(val) {
			let type
			switch (val) {
				case 0:
					type = '平稳'
					break
				case 1:
					type = '上升'
					break
				case 2:
					type = '下降'
					break

				default:
					type = '---'
					break
			}
			return type
		},
		selectSupplier(e) {
			e.target.blur()
			this.formsDialog = true
		},
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.searchData, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})

			return paramJson
		},
		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			let {
				data: {
					resultCode,
					resultData: { merchantSettleRuleList = [], count = 0 },
				},
			} = await getMerchantSettleRuleList(paramJson)
			this.loading = false
			if (resultCode == 0) {
				this.tableData = merchantSettleRuleList
				this.page.count = count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		async _importSupplierSettleRule(file) {
			let formData = new FormData()
			formData.append('formId', '#excelForm')
			formData.append(
				'data',
				JSON.stringify({
					organizationId: 1,
					clerkId: this.$store.state.user.userInfo.clerkId,
					userId: this.$store.state.user.userInfo.userId,
					timeStamp: new Date() * 1,
					groupId: 2,
				})
			)
			formData.append('excel', file.file)
			let {
				data: { resultCode, resultMsg },
			} = await importSupplierSettleRule(formData)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
			}
			// 清空文件
			this.$refs['ImportForm'].$refs.fileStream[0].clearFiles()
		},
	},
}
</script>

<style lang="scss" scoped>
.red-color {
	font-size: 24px;
	color: #d51a21;
	vertical-align: middle;
}
.green-color {
	font-size: 24px;
	color: #407434;
	vertical-align: middle;
}
.yellow-color {
	font-size: 24px;
	color: #f4d000;
	vertical-align: middle;
}
.slot {
	text-align: left;
	display: flex;

	.goods_img {
		width: 60px;
		height: 60px;
		margin-right: 10px;
		line-height: 155px;
	}

	.number {
		margin-right: 10px;
	}

	.goods_name {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
	}
}
.add-btn {
	margin-bottom: 20px;
}
</style>

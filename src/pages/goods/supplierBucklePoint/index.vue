<template>
	<div class="activityList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData103"
				:items="formCfg103"
				:formAction="formAction103"
			>
				<template #goodsCategoryName>
					<el-cascader
						:options="goodsCategoryList"
						@change="handleChange"
						clearable
						:props="{
							checkStrictly: true,
							children: 'goodsCategoryChildList',
							label: 'goodsCategoryName',
							value: 'goodsCategoryId',
						}"
						ref="cascader"
						placeholder="请选择类目名称"
					></el-cascader>
				</template>
				<template #brandParentId>
					<el-select
						v-model="formData103.brandParentId"
						filterable
						remote
						clearable
						placeholder="请输入品牌名称"
						value-key="brandParentId"
						:remote-method="_getBrandParentList"
					>
						<el-option
							v-for="item in formDataBrandParentList"
							:key="item.brandParentId"
							:label="item.brandParentName"
							:value="item.brandParentId"
						>
						</el-option>
					</el-select>
				</template>
			</yx-form>
			<div class="mb20">
				<el-button
					v-auth="pathPage ? 'ruleSave' : 'hzDeductionRulesave'"
					@click="addActivity(null, 1)"
					type="primary"
					>新增</el-button
				>
				<el-button
					@click="
						$router.push({
							path: `/goods/priceAdjustmentRecordList`,
						})
					"
					v-auth="pathPage ? 'skipPriceAdjustment' : 'skipPriceAdjustmentHz'"
					type="primary"
					>导入批量平台调价模板</el-button
				>
			</div>
			<yx-table
				v-loading="loading"
				:columns="tableColumns104"
				:pagination="page104"
				:data="tableData104"
			>
			</yx-table>
			<Dialog
				:title="dialogTitle105"
				:visible.sync="dialogVisible105"
				:width="dialogWidth105"
				:bottomBtn="dialogBottomBtn105"
			>
				<yx-form
					ref="dialog106"
					labelWidth="100px"
					:data="formData106"
					:items="formCfg106"
					:rules="formRules106"
				>
					<template #supplierName>
						<el-autocomplete
							v-model="formData106.supplierName"
							debounce
							:disabled="dialogTitle105 == '编辑扣点配置'"
							placeholder="请输入商家名称"
							value-key="supplierName"
							label="supplierName"
							:fetch-suggestions="_getCmsSupplierListByCondition"
							@select="handleBrandName"
							@focus="handleFocusBrandName"
						>
							<el-button
								slot="append"
								icon="el-icon-more"
								:disabled="dialogTitle105 == '编辑扣点配置'"
								@click="formsDialog = true"
							></el-button>
						</el-autocomplete>
					</template>
					<template #categoryId>
						<el-cascader
							v-model="formData106.categoryId"
							:options="goodsCategoryList"
							@change="addHandleChange"
							clearable
							:props="{
								checkStrictly: true,
								children: 'goodsCategoryChildList',
								label: 'goodsCategoryName',
								value: 'goodsCategoryId',
							}"
							ref="cascader"
							placeholder="请选择类目名称"
						></el-cascader>
					</template>
					<template #brandParentId>
						<el-input
							placeholder="请选择品牌"
							v-model="formData106.brandParentName"
							clearable
							@clear="
								() => {
									formData106.brandParentName = ''
									formData106.brandParentId = ''
								}
							"
							@focus="selectBrand(formData106.brandParentId)"
						>
							<el-button
								@click="showDialog101(formData106.brandParentId)"
								slot="append"
								icon="el-icon-more"
							></el-button>
						</el-input>
					</template>
					<template #deduction>
						<el-input
							v-model="formData106.deduction"
							oninput="if(value>100)value=1"
							style="width: 150px"
							type="number"
							min="1"
							max="100"
							placeholder="请选择输入扣点"
						>
						</el-input>
						<span style="margin-left: 10px; color: #1682e6">%</span>
					</template>
					<template #commissionRate>
						<el-input
							v-model="formData106.commissionRate"
							oninput="if(value>100)value=1"
							style="width: 150px"
							type="number"
							min="1"
							max="100"
							placeholder="请选择输入杭州分佣"
						>
						</el-input>
						<span style="margin-left: 10px; color: #1682e6">%</span>
					</template>
					<template #systemGrossMargin>
						<el-input
							v-model="formData106.systemGrossMargin"
							oninput="if(value>100)value=1"
							style="width: 150px"
							type="number"
							min="1"
							max="100"
							placeholder="请选择输入总毛利率"
						>
						</el-input>
						<span style="margin-left: 10px; color: #1682e6">%</span>
					</template>
				</yx-form>
			</Dialog>
			<Dialog
				:title="dialogTitle101"
				:visible.sync="dialogVisible101"
				:width="dialogWidth101"
				:bottomBtn="dialogBottomBtn101"
			>
				<yx-form
					:inline="true"
					:data="formData123"
					:items="formCfg123"
					:formAction="formAction123"
				>
				</yx-form
				><yx-table
					v-loading="loading102"
					:columns="tableColumns102"
					:pagination="page102"
					:data="tableData102"
				>
					<template slot="brandParentId" slot-scope="scope">
						<el-radio
							v-model="brandParentId"
							:label="scope.row.brandParentId"
							@change="changeGoodsGroup(scope.row)"
							>选择</el-radio
						>
					</template>
				</yx-table>
				<div class="btn"></div>
			</Dialog>
			<Dialog
				title="操作记录"
				:visible.sync="checkRecordDialogVisible101"
				width="1000px"
				><yx-table
					v-loading="checkRecordLoading102"
					:columns="checkRecordTableColumns102"
					:pagination="checkRecordPage102"
					:data="checkRecordTableData102"
				>
					<template slot="operationDetail" slot-scope="scope">
						<div
							v-for="(item, index) in scope.row.operationDetail.split(';')"
							:key="index"
						>
							<div>{{ item }}</div>
						</div>
					</template>
				</yx-table>
			</Dialog>
			<Dialog
				:title="contentNumber === 1 ? '平台加价' : '佣金加价'"
				:visible.sync="platformPriceVisible"
				width="500px"
				:bottomBtn="platformPriceBottomBtn"
			>
				<div class="mb20">
					{{
						contentNumber === 1
							? '平台加价操作可调整商品定价，为平台提升利润。'
							: '佣金加价部分为店主+服务商总金额'
					}}
				</div>
				<div v-if="contentNumber === 2" class="mb20">
					需要特别留意，若有商品参与<span style="color: #ff0000"
						>佣金膨胀等活动</span
					>，会导致派发奖励增加
				</div>
				<div class="mb20">
					<span class="mb20" style="color: #ff4949; margin-right: 4px">*</span>
					加价方式：
					<el-radio @change="priceChange" v-model="priceWayradio" label="1"
						>比例</el-radio
					>
					<el-radio @change="priceChange" v-model="priceWayradio" label="2"
						>金额</el-radio
					>
				</div>
				<yx-form
					ref="amountDialog"
					labelWidth="100px"
					:data="amountFormData"
					:items="amountFormCfg"
					:rules="amountFormRules"
				>
					<template #premiumAmount>
						<el-input
							v-model="amountFormData.premiumAmount"
							style="width: 150px"
							type="number"
							placeholder="请输入"
						>
						</el-input>
						<span class="" style="padding: 10px">{{
							priceWayradio == 1 ? '%' : '元'
						}}</span>
					</template>
				</yx-form>
			</Dialog>
			<!-- 商家列表 -->
			<supply-dialog
				:itemInfo="supplyRow"
				:visible.sync="formsDialog"
				@fatherMethodInit="
					(row) => {
						formData106.supplierName = row.supplierName
						formData106.supplierId = row.supplierId
					}
				"
			/>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import SupplyDialog from './SupplyDialog'
import { commissionGoodsCategoryTree } from '@/api/grossMargins'
import {
	regulationListByCondition,
	addSave,
	compileUpdate,
	removeRule,
	listByConditionHZ,
	addSaveHZ,
	updateHZ,
	removeHZ,
} from '@/api/deduction'
import { imgCosServerPath } from '@/utils/imageTool'
import { getCmsSupplierListByCondition } from '@/api/yhtPlusCmsSupplier'
import { getBrandParentList } from '@/api/yhtPlusWebGoods'
import { checkFunctionCode } from '@/utils/auth'
import {
	exportDeductionRule,
	exportHzDeductionRule,
	commissionAdjustmentByCategory,
	platformAdjustmentByCategory,
	platformAdjustmentByHZCategory,
	commissionAdjustmentByHZCategory,
	deductionRuleRecord,
} from '@/api/deduction'
// import { downloadFile, isNull } from '@/utils/helper/common'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
		SupplyDialog,
	},
	name: 'supplierBucklePoint',
	props: [],
	data() {
		return {
			//操作记录
			checkRecordDialogVisible101: false,
			checkRecordTableColumns102: [
				{
					type: 'string',
					dataIndex: 'operationType',
					title: '操作',
					customRender: (row) => {
						return row.operationType == 1
							? '平台&佣金调价'
							: row.operationType == 2
							? '编辑扣点配置'
							: '新增扣点配置'
					},
				},
				{
					type: 'custom',
					dataIndex: 'operationDetail',
					title: '详情',
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '操作时间',
				},
				{
					type: 'string',
					dataIndex: 'operationName',
					title: '操作人',
				},
			],
			checkRecordTableData102: [],
			//操作记录
			pathPage: null,
			brandParentId: '',
			goodsCategoryList: [], //商品类目
			supplyRow: {}, // 商家当前行选中数据
			brandList: {},
			formsDialog: false,
			pickerOptions: {
				disabledDate: (time) => {
					return time.getTime() < this.formData106.registeredStartTime
				},
			},
			loading102: false,
			dialogTitle101: '选择品牌',
			dialogWidth101: '90%',
			dialogVisible101: false,
			dialogBottomBtn101: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
			],
			formData123: {
				keyword: '',
				brandParentId: '',
			},
			formCfg123: [
				{
					title: '筛选',
					type: 'input',
					dataIndex: 'keyword',
					placeholder: '品牌名称',
				},
			],
			formAction123: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getData102(true)
					},
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'custom',
					dataIndex: 'brandParentId',
				},
				{
					type: 'string',
					dataIndex: 'brandParentName',
					title: '品牌名称',
				},
			],
			checkRecordPage102: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.checkRecord()
				},
			},
			page102: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData102()
				},
			},
			loading: false,
			// 搜索品牌数据源
			formDataBrandParentList: [],
			formData103: {
				supplierId: '',
				supplierName: '',
				categoryId: '',
				brandParentId: '',
			},
			formCfg103: [
				{
					type: 'textarea',
					title: '商家名称',
					dataIndex: 'supplierName',
					placeholder: '请输入商家名称,多个商家用逗号隔开或者换行',
				},
				{
					type: 'textarea',
					title: '商家ID',
					dataIndex: 'supplierId',
					placeholder: '请输入商家ID,多个商家用逗号隔开或者换行',
				},
				{
					title: '商品类目',
					type: 'custom',
					dataIndex: 'goodsCategoryName',
				},
				{
					title: '品牌',
					type: 'custom',
					dataIndex: 'brandParentId',
				},
			],
			formAction103: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (!this.loading) this.init(true)
						this.dialogGroupVisible = true
					},
					tableId: 104,
				},
				{
					title: '导出',
					type: 'primary',
					click: () => {
						this.derive()
					},
					customRender: (action) => {
						let path = this.$route.path === '/goods/supplierBucklePoint'
						action.hide =
							(path && !checkFunctionCode('exportDeductionRule')) ||
							(!path && !checkFunctionCode('exportHzDeductionRule'))
						return action
					},
				},
			],
			tableData104: [],
			tableColumns104: [
				{
					type: 'string',
					dataIndex: 'supplierDeductionRuleId',
					title: '扣点ID',
				},
				{
					type: 'string',
					dataIndex: 'supplierId',
					title: '商家ID',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'string',
					dataIndex: 'brandParentId',
					title: '品牌ID',
				},
				{
					type: 'string',
					dataIndex: 'brandParentName',
					title: '品牌',
				},
				{
					type: 'string',
					dataIndex: 'categoryName',
					title: '类目',
				},
				{
					type: 'string',
					dataIndex: 'platformAdjustmentValue',
					title: '平台加价',
					customRender: (row) => {
						return row.platformAdjustmentType == 1
							? row.platformAdjustmentValue + '%'
							: row.platformAdjustmentValue + '元'
					},
				},
				{
					type: 'string',
					dataIndex: 'commissionAdjustmentValue',
					title: '佣金加价',
					customRender: (row) => {
						return row.commissionAdjustmentType == 1
							? row.commissionAdjustmentValue + '%'
							: row.commissionAdjustmentValue + '元'
					},
				},
				{
					type: 'string',
					dataIndex: 'deduction',
					title: '扣点',
					customRender: (row) => {
						return row.deduction + '%'
					},
				},
				{
					type: 'string',
					dataIndex: 'commissionRate',
					title: '杭州分佣',
					customRender: (row) => {
						return row.commissionRate + '%'
					},
				},
				{
					type: 'string',
					dataIndex: 'organizationCommissionRate',
					title: '店主分佣比例',
					customRender: (row) => {
						return row.organizationCommissionRate + '%'
					},
				},
				{
					type: 'string',
					dataIndex: 'systemGrossMargin',
					title: '总毛利率',
					customRender: (row) => {
						return row.systemGrossMargin + '%'
					},
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '删除',
							// auth: 'ruleRemove',
							popconfirm: true,
							popconfirmTitle: '确认要删除该规则吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this.removeRule(row)
							},
							customRender: (action) => {
								let path = this.$route.path === '/goods/supplierBucklePoint'
								action.hide =
									(path && !checkFunctionCode('ruleRemove')) ||
									(!path && !checkFunctionCode('hzDeductionRuleRemove'))
								return action
							},
						},
						{
							title: '编辑',
							// auth: 'ruleUpdate',
							dialogId: 105,
							click: (row) => {
								this.dialogTitle105 = '编辑扣点配置'
								this.addActivity(row, 2)
							},
							customRender: (action) => {
								let path = this.$route.path === '/goods/supplierBucklePoint'
								action.hide =
									(path && !checkFunctionCode('ruleUpdate')) ||
									(!path && !checkFunctionCode('hzDeductionRuleUpate'))
								return action
							},
						},
						{
							title: '平台加价',
							dialogId: 105,
							click: (row) => {
								this.platformPrice(row, 1)
							},
							customRender: (action) => {
								let path = this.$route.path === '/goods/supplierBucklePoint'
								action.hide =
									(path &&
										!checkFunctionCode('platformAdjustmentByCategory')) ||
									(!path &&
										!checkFunctionCode('platformAdjustmentByHZCategory'))
								return action
							},
						},
						{
							title: '佣金加价',
							dialogId: 105,
							click: (row) => {
								this.platformPrice(row, 2)
							},
							customRender: (action) => {
								let path = this.$route.path === '/goods/supplierBucklePoint'
								action.hide =
									(path &&
										!checkFunctionCode('commissionAdjustmentByCategory')) ||
									(!path &&
										!checkFunctionCode('commissionAdjustmentByHZCategory'))
								return action
							},
						},
						{
							title: '查看记录',
							dialogId: 105,
							click: (row) => {
								this.checkRecordId = row.supplierDeductionRuleId
								this.checkRecord(true)
							},
							customRender: (action) => {
								let path = this.$route.path === '/goods/supplierBucklePoint'
								action.hide =
									(path && !checkFunctionCode('deductionRuleRecord')) ||
									(!path && !checkFunctionCode('deductionRuleHZRecord'))
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
					this.init()
				},
			},
			dialogTitle105: '添加扣点配置',
			dialogWidth105: '600px',
			dialogVisible105: false,
			dialogBottomBtn105: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog106.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveAddActivityList()
								// this.dialogVisible105 = false
							}
						})
					},
				},
			],
			formData106: {
				supplierName: '',
				supplierId: '',
				brandParentId: '',
				brandParentName: '',
				deduction: '',
				commissionRate: '',
				categoryId: '',
				systemGrossMargin: '',
			},
			supplierBrands: [],
			formCfg106: [
				{
					title: '商家',
					type: 'custom',
					dataIndex: 'supplierName',
				},
				{
					title: '品牌名称',
					type: 'custom',
					dataIndex: 'brandParentId',
				},
				{
					title: '商品类目',
					type: 'custom',
					dataIndex: 'categoryId',
				},
				{
					title: '扣点',
					type: 'custom',
					dataIndex: 'deduction',
				},
				{
					title: '杭州分佣',
					type: 'custom',
					dataIndex: 'commissionRate',
				},
				{
					title: '总毛利率',
					type: 'custom',
					dataIndex: 'systemGrossMargin',
				},
			],
			formRules106: {
				supplierName: [
					{
						required: true,
						message: '请选择商家',
						trigger: ['blur', 'change'],
					},
				],
				brandParentId: [
					{
						required: true,
						message: '请选择品牌',
						trigger: ['blur', 'change'],
					},
				],
				categoryId: [
					{ required: true, message: '请选择类目', trigger: 'blur' },
				],
				deduction: [
					{
						required: true,
						message: '请输入扣点，且扣点至多保留两位小数',
						trigger: ['blur', 'change'],
						pattern: /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/,
					},
				],
				commissionRate: [
					{
						required: true,
						message: '请输入杭州分佣，且至多保留两位小数',
						trigger: ['blur', 'change'],
						pattern: /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/,
					},
				],
				systemGrossMargin: [
					{
						// required: true,
						message: '请输入总毛利率，且总毛利率至多保留两位小数',
						trigger: ['blur', 'change'],
						pattern: /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*)|0)$/,
					},
				],
			},
			actDiscountList: [],
			activityAreaList: [],
			fileList: [],
			userIds: [],
			checkRecordId: null,
			updateRow: {},
			priceWayradio: '1',
			amountFormData: {
				premiumAmount: '',
			},
			rowPlatformPrice: {},
			amountFormRules: {
				premiumAmount: [
					{
						required: true,
						message: '请输入数值，且数值至多保留两位小数',
						trigger: ['blur', 'change'],
						pattern: /^((((?!0)\d+)|(0{1}))(.\d{1,2})?)$/,
					},
				],
			},
			amountFormCfg: [
				{
					title: '加价比例',
					type: 'custom',
					dataIndex: 'premiumAmount',
				},
			],
			contentNumber: null,
			platformPriceVisible: false,
			supplierDeductionRuleId: null,
			platformPriceBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.amountDialog.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.priceSubmitForm()
							}
						})
					},
				},
			],
		}
	},

	created() {
		this.pathPage = this.$route.path === '/goods/supplierBucklePoint'
		this.formCfg106.forEach((item) => {
			if (item.dataIndex == 'commissionRate') {
				item.hide = this.pathPage
			}
			return item
		})
		this.tableColumns104.forEach((item) => {
			console.log(item, 'aaafadfdsfdfdf')
			if (item.dataIndex == 'commissionRate') {
				item.hide = this.pathPage
			}
			// if (
			// 	item.dataIndex == 'commissionAdjustmentValue' ||
			// 	item.dataIndex == 'platformAdjustmentValue'
			// ) {
			// 	item.hide = !this.pathPage
			// }
			return item
		})
		this.getGoodsCategoryList() // 获取商品类目
	},

	methods: {
		// 获取品牌列表
		async _getBrandParentList(query) {
			if (query !== '') {
				const paramJson = {
					startIndex: 0,
					length: 20,
					keyword: query,
				}
				const {
					data: { resultCode, resultData },
				} = await getBrandParentList(paramJson)

				if (resultCode == 0) {
					this.formDataBrandParentList = resultData.brandParentList || []
					return
				}
			}
			this.formDataBrandParentList = []
		},
		priceChange(e) {
			//平台加价切换加价方式回显值
			if (this.contentNumber == 1) {
				if (e == this.rowPlatformPrice.platformAdjustmentType) {
					this.amountFormData.premiumAmount =
						this.rowPlatformPrice.platformAdjustmentValue
				} else {
					this.amountFormData.premiumAmount = '0'
				}
				//佣金加价切换加价方式回显值
			} else if (this.contentNumber == 2) {
				if (e == this.rowPlatformPrice.commissionAdjustmentType) {
					this.amountFormData.premiumAmount =
						this.rowPlatformPrice.commissionAdjustmentValue
				} else {
					this.amountFormData.premiumAmount = '0'
				}
			}
			if (e == 1) {
				this.amountFormCfg[0].title = '加价比例'
				if (this.amountFormData.premiumAmount > 20) {
					this.amountFormData.premiumAmount = 20
					return this.$message.warning('加价比例最大值为20')
				}
			}
			if (e == 2) {
				this.amountFormCfg[0].title = '加价金额'
				if (this.amountFormData.premiumAmount > 500) {
					this.amountFormData.premiumAmount = 500
					return this.$message.warning('，加价金额最大值为500')
				}
			}
		},
		checkRecord: async function (flag) {
			this.checkRecordDialogVisible101 = true
			let paramJson = this.checkFindSearchParams(flag)
			paramJson.supplierDeductionRuleId = this.checkRecordId
			let {
				data: { resultCode, resultData },
			} = await deductionRuleRecord(paramJson)
			if (resultCode == 0) {
				this.checkRecordTableData102 = resultData.recordList
				this.checkRecordPage102.count = resultData.count
			}
		},
		checkFindSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.checkRecordPage102.currentPage = 1
			}
			const paramJson = Object.assign(
				{},
				{
					length: this.checkRecordPage102.length,
					startIndex:
						(this.checkRecordPage102.currentPage - 1) *
						this.checkRecordPage102.length,
				}
			)
			return paramJson
		},
		//导出
		derive: async function () {
			let paramJson = this.findSearchParams()
			paramJson.listPath = '商品>商家扣点配置'
			paramJson.groupId = this.$store.state.user.userInfo.groupId
			let Url = this.pathPage ? exportDeductionRule : exportHzDeductionRule
			let {
				data: { resultCode, resultData },
			} = await Url(paramJson)
			if (resultCode == 0) {
				if (resultData.remoteFilePath) {
					resultData.remoteFilePath = resultData.remoteFilePath.replace(
						'/data/yhtplusFile/',
						''
					)
					const elt = document.createElement('a')
					elt.setAttribute('href', imgCosServerPath + resultData.remoteFilePath)
					elt.setAttribute('download', 'file.xlsx')
					elt.style.display = 'none'
					document.body.appendChild(elt)
					elt.click()
					document.body.removeChild(elt)
					// window.open(imgCosServerPath + resultData.remoteFilePath)
				}
			}
		},
		platformPrice(row, v) {
			this.contentNumber = v
			this.rowPlatformPrice = row
			this.supplierDeductionRuleId = row.supplierDeductionRuleId
			if (v == 1) {
				this.priceWayradio = row.platformAdjustmentType
					? String(row.platformAdjustmentType)
					: '1'
				this.amountFormData.premiumAmount = row.platformAdjustmentValue
			} else {
				this.priceWayradio = row.commissionAdjustmentType
					? String(row.commissionAdjustmentType)
					: '1'
				this.amountFormData.premiumAmount = row.commissionAdjustmentValue
			}
			this.platformPriceVisible = true
		},
		// 删除
		removeRule: async function (row) {
			let Url = this.pathPage ? removeRule : removeHZ
			let {
				data: { resultCode, resultMsg },
			} = await Url({
				supplierDeductionRuleId: row.supplierDeductionRuleId,
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.init()
			}
		},
		// 确定
		async priceSubmitForm() {
			if (
				this.priceWayradio == 1 &&
				(this.amountFormData.premiumAmount > 20 ||
					this.amountFormData.premiumAmount < 0)
			) {
				this.$message.warning('比例最大值不可大于20且不可小于0')
				return
			}
			if (
				this.priceWayradio == 2 &&
				(this.amountFormData.premiumAmount > 500 ||
					this.amountFormData.premiumAmount < 0)
			) {
				this.$message.warning('比例最大值不可大于500且不可小于0')
				return
			}
			this.$confirm(
				'确认后，系统将会处理此条件下所有下架商品的价格，可在平台调价记录列表进行查看进度',
				'加价',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			).then(async () => {
				let Url
				let paramJson = {
					clerkId: this.$store.state.user.userInfo.clerkId,
					clerkName: this.$store.state.user.userInfo.clerkName,
					supplierDeductionRuleId: this.supplierDeductionRuleId,
				}
				if (this.contentNumber === 1) {
					paramJson.platformAdjustmentType = this.priceWayradio
					paramJson.platformAdjustmentValue = this.amountFormData.premiumAmount
					Url = this.pathPage
						? platformAdjustmentByCategory
						: platformAdjustmentByHZCategory
				} else {
					paramJson.commissionAdjustmentType = this.priceWayradio
					paramJson.commissionAdjustmentValue =
						this.amountFormData.premiumAmount
					Url = this.pathPage
						? commissionAdjustmentByCategory
						: commissionAdjustmentByHZCategory
				}
				let {
					data: { resultCode },
				} = await Url(paramJson)
				if (resultCode == 0) {
					this.$message({
						type: 'success',
						message: '成功!',
					})
					this.platformPriceVisible = false
					this.init(true)
				}
			})
		},
		addActivity(row, v) {
			this.dialogVisible105 = true
			this.$nextTick(() => {
				this.$refs.dialog106.$refs.YxForm.clearValidate()
			})
			this.getGoodsCategoryList() // 获取商品类目
			if (row && v == 2) {
				this.supplierBrands = []
				this.supplierBrands.push({
					brandParentId: row.brandParentId,
					brandParentName: row.brandParentName,
				})
				this.formCfg106[1].options = this.supplierBrands
				this.goodsCategoryList = []
				this.goodsCategoryList.push({
					categoryId: row.categoryId,
					categoryName: row.categoryName,
				})
				// this.mapAll(this.goodsCategoryList)
				this.updateRow = row
				console.log(this.updateRow, '------')
				this.formData106 = {
					supplierName: row.supplierName,
					supplierId: row.supplierId,
					deduction: row.deduction,
					commissionRate: row.commissionRate,
					brandParentId: row.brandParentId,
					brandParentName: row.brandParentName,
					categoryId: row.categoryId,
					systemGrossMargin: row.systemGrossMargin,
					// categoryName: row.categoryName,
				}
			} else {
				this.dialogTitle105 = '添加扣点配置'
				this.supplierBrands = []
				this.formData106 = {
					supplierName: '',
					supplierId: '',
					brandParentId: '',
					brandParentName: '',
					deduction: '',
					commissionRate: '',
					categoryId: '',
					systemGrossMargin: '',
				}
			}
		},
		getGoodsCategoryList: async function () {
			let {
				data: { resultCode = 0, resultData = [] },
			} = await commissionGoodsCategoryTree()
			if (resultCode == 0) {
				this.goodsCategoryList = this.mapAll(resultData.goodsCategoryList)
			}
		},
		//数据过滤，三级后去掉子级，可以选中
		mapAll(options) {
			return options.map((item) => {
				//最高三级，清除第三级后面的数组，组件就可以选中
				if (item.goodsCategoryLevel === 3) {
					item.goodsCategoryChildList = null
					item.disabled = true
				}
				if (
					item.goodsCategoryChildList &&
					item.goodsCategoryChildList.length > 0
				) {
					this.mapAll(item.goodsCategoryChildList)
				}
				return item
			})
		},
		handleChange(e) {
			console.log(e)
			this.formData103.categoryId = e[e.length - 1]
		},
		addHandleChange(e) {
			console.log(e)
			this.formData106.categoryId = e[e.length - 1]
		},
		// 选择品牌
		selectBrand(brandParentId) {
			this.formData123.keyword = ''
			this.getData102(true)
			this.dialogVisible101 = true
			this.brandParentId = brandParentId
		},
		showDialog101(brandParentId) {
			this.formData123.keyword = ''
			this.brandParentId = brandParentId
			this.getData102(true)
			this.dialogVisible101 = true
		},
		changeGoodsGroup(row) {
			this.formData106.brandParentId = row.brandParentId
			this.formData106.brandParentName = row.brandParentName
		},
		getData102: async function (flag) {
			this.loading102 = true
			let paramJson = this.findSearchParams123(flag)
			const {
				data: { resultCode, resultData },
			} = await getBrandParentList(paramJson)
			if (resultCode == 0) {
				this.tableData102 = resultData.brandParentList
				this.page102.count = resultData.count
			} else {
				this.tableData102 = []
				this.page102.count = 0
			}
			this.loading102 = false
		},
		findSearchParams123(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			const paramJson = Object.assign(this.formData123, {
				length: this.page102.length,
				startIndex: (this.page102.currentPage - 1) * this.page102.length,
			})
			return paramJson
		},
		// 确定
		submitForm() {
			if (!this.formData106.brandParentId) {
				return this.$message.warning('请选择品牌')
			}
			this.dialogVisible101 = false
		},
		// 获取商家列表
		async _getCmsSupplierListByCondition(queryString, callback) {
			const paramJson = {
				startIndex: 0,
				length: 20,
				supplierName: queryString,
			}
			const {
				data: { resultCode, resultData },
			} = await getCmsSupplierListByCondition(paramJson)

			if (resultCode == 0 && resultData.supplierList.length > 0) {
				callback(resultData.supplierList)
			}
		},
		// 操作商家
		handleBrandName(item) {
			this.formData106.supplierName = item.supplierName
			this.formData106.supplierId = item.supplierId
		},
		// 获取商家
		handleFocusBrandName() {
			this.formData106.supplierId = ''
			this.formData106.supplierName = ''
		},
		// 添加扣点配置
		saveAddActivityList: async function () {
			let paramJson = this.formData106
			paramJson.userName = this.$store.state.user.userInfo.clerkName
			paramJson.clerkId = this.$store.state.user.userInfo.clerkId
			let Url =
				this.dialogTitle105 == '添加扣点配置' && this.pathPage
					? addSave
					: this.dialogTitle105 == '添加扣点配置' && !this.pathPage
					? addSaveHZ
					: this.dialogTitle105 == '编辑扣点配置' && this.pathPage
					? compileUpdate
					: updateHZ
			if (this.dialogTitle105 != '添加扣点配置') {
				paramJson.supplierDeductionRuleId =
					this.updateRow.supplierDeductionRuleId
			}
			if (paramJson.deduction <= 0) {
				return this.$message.warning('数值不可小于等于0')
			}
			if (paramJson.systemGrossMargin < 0) {
				return this.$message.warning('数值不可小于0')
			}
			if (!this.pathPage && paramJson.commissionRate <= 0) {
				return this.$message.warning('数值不可小于等于0')
			}

			const {
				data: { resultCode, resultMsg },
			} = await Url(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.init()
				this.dialogVisible105 = false
			}
		},
		// 获取列表参数
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page104.currentPage = 1
			}
			const paramJson = Object.assign(this.formData103, {
				length: this.page104.length,
				startIndex: (this.page104.currentPage - 1) * this.page104.length,
			})
			// paramJson.supplierId = paramJson.supplierId.replace(/\s+/g, ',')
			// paramJson.supplierName = paramJson.supplierName.replace(/\s+/g, ',')
			paramJson.supplierId = paramJson.supplierId.replace(/\n/g, ',')
			paramJson.supplierId = paramJson.supplierId.replace(/\s*/g, '')
			paramJson.supplierName = paramJson.supplierName.replace(/\n/g, ',')
			paramJson.supplierName = paramJson.supplierName.replace(/\s*/g, '')
			return paramJson
		},
		// 获取列表
		async init(flag) {
			let paramJson = this.findSearchParams(flag)
			paramJson = JSON.parse(JSON.stringify(paramJson))

			if (paramJson.supplierId && paramJson.supplierName) {
				this.$message.warning('商家id和商家名称不能同时查询')
				return
			}
			this.loading = true
			let Url = this.pathPage ? regulationListByCondition : listByConditionHZ
			const {
				data: { resultData },
			} = await Url(paramJson)
			if (resultData.recordList.length > 0) {
				this.tableData104 = resultData.recordList
				this.page104.count = resultData.count
				this.loading = false
			} else {
				this.page104.count = 0
				this.tableData104 = []
				this.loading = false
			}
		},
	},
}
</script>
<style lang="scss" scope>
.registration-time-box {
	display: flex;
	flex-direction: column;
}
.registration-time-item {
	margin: 6px 0;
}
.upload-box {
	display: flex;
	.template {
		margin-right: 20px;
		height: 32px;
	}
}
.c_image {
	width: 100px;
}
.mb20 {
	margin-bottom: 20px;
}
</style>

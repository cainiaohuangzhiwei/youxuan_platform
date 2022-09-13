<template>
	<div class="marketList">
		<yx-form
			:inline="true"
			:data="formData105"
			:items="formCfg105"
			:formAction="formAction105"
		>
		</yx-form>
		<div class="selection-goods-btnlist">
			<el-button v-auth="'addActBanner'" @click="_addActBanner" type="primary"
				>新增活动</el-button
			>
		</div>
		<yx-table
			v-loading="loading"
			:columns="tableColumns106"
			:pagination="page106"
			:data="tableData106"
		>
			<template slot="goodsGroupCount" slot-scope="scope">
				<div>
					<el-button
						@click="showGoodsGroupInfo(scope.row)"
						v-if="scope.row.goodsGroupInfo"
						type="text"
						>档期数({{ scope.row.goodsGroupInfo.split(',').length }})</el-button
					>
					<span v-else>0</span>
				</div>
			</template>
			<template slot="discountState" slot-scope="scope">
				<div>
					<el-tag type="danger" v-if="curTime < scope.row.startTime"
						>未开始</el-tag
					>
					<el-tag type="info" v-if="curTime > scope.row.endTime">已结束</el-tag>
					<el-tag
						v-if="
							curTime >= scope.row.startTime && curTime <= scope.row.endTime
						"
						>进行中</el-tag
					>
				</div>
			</template>
		</yx-table>
		<Dialog
			:title="dialogTitle107"
			:visible.sync="dialogVisible107"
			:width="dialogWidth107"
			:bottomBtn="dialogBottomBtn107"
		>
			<yx-table :columns="tableColumns109" :data="tableData109"></yx-table>
		</Dialog>
		<Dialog
			:title="dialogTitle111"
			:visible.sync="dialogVisible111"
			:width="dialogWidth111"
			:bottomBtn="formData112.isNewData == 0 ? [] : dialogBottomBtn111"
		>
			<yx-form
				ref="dialog112"
				labelWidth="100px"
				:data="formData112"
				:items="formCfg112"
				:formAction="formAction112"
				:rules="formRules112"
				:formDisabled="formData112.isNewData == 0"
			>
				<template slot="addActRule">
					<div class="add-act-rule-box">
						<el-button @click="setDiscountRule(false)" type="text"
							>+新增规则</el-button
						>
						<div>
							<div
								class="add-act-rule-item"
								:key="index"
								v-for="(item, index) in formData112.discountRuleList"
							>
								<p>满</p>
								<el-input
									class="rule-item-input"
									v-model="item[0]"
									type="number"
									@input="forceUpdate"
								></el-input>
								<p v-if="discountRule[formData112.discountType - 1]">
									{{ discountRule[formData112.discountType - 1].text1 }}
								</p>
								<el-input
									class="rule-item-input"
									v-model="item[1]"
									@input="forceUpdate"
									type="number"
								></el-input>
								<p v-if="discountRule[formData112.discountType - 1]">
									{{ discountRule[formData112.discountType - 1].text2 }}
								</p>
								<el-button @click="setDiscountRule(true, index)" type="primary"
									>删除</el-button
								>
							</div>
						</div>
					</div>
				</template>
				<template slot="goodsGroupId">
					<div>
						<el-button type="text" @click="handleAdd">添加档期</el-button>
						<div>
							<span
								v-for="(item, index) in formData112.goodsGroupList"
								:key="index"
								>{{ item.groupName }}
								<span v-if="index < formData112.goodsGroupList.length - 1"
									>,</span
								>
							</span>
						</div>
					</div>
				</template>
				<!-- <template slot="platform">
						<div class="platform-box">
							<p>商家承担</p>
							<el-input
								class="platform-box-input"
								type="number"
								v-model="formData112.businessExpensesProportion"
								@input="businessExpensesProportionInput"
							></el-input>
							<p>%平台承担</p>
							<el-input
								class="platform-box-input"
								type="number"
								disabled
								v-model="formData112.platform"
							></el-input>
							<p>%</p>
						</div>
					</template> -->
				<!-- 旧数据 编辑，有信息展示 -->
				<template
					v-if="formData112.actDiscountId && formData112.isNewData == 0"
					slot="platform"
				>
					<el-form-item label="费用归属" prop="businessExpensesProportion">
						<div class="platform-box">
							<span>商家承担&nbsp;</span>
							<el-input
								class="platform-box-input"
								type="number"
								v-model="formData112.businessExpensesProportion"
								@input="businessExpensesProportionInput"
							></el-input>
							<span>&nbsp;%平台承担&nbsp;</span>
							<el-input
								class="platform-box-input"
								type="number"
								disabled
								v-model="formData112.platform"
							></el-input>
							<span>&nbsp;%</span>
						</div>
					</el-form-item>
				</template>
			</yx-form>
		</Dialog>
		<Dialog
			:title="dialogTitle101"
			:visible.sync="dialogVisible101"
			:width="dialogWidth101"
		>
			<yx-table
				v-loading="loading102"
				:columns="tableColumns102"
				:pagination="page102"
				:data="tableData102"
			>
				<template slot="goodsName" slot-scope="scope">
					<div class="goods-name-box">
						<router-link
							v-if="getGoodsDetailByOrganizationSpecId"
							class="goods-name-box"
							:to="`/goods/GoodsDetail/${scope.row.goodsId}/${scope.row.goodsSpecId}`"
						>
							<el-button type="text">
								<p>货号：{{ scope.row.goodsNumber }}</p>
								<p>{{ scope.row.goodsName }}</p>
							</el-button>
						</router-link>
						<div v-else>
							<p>货号：{{ scope.row.goodsNumber }}</p>
							<p>{{ scope.row.goodsName }}</p>
						</div>
					</div>
				</template>
				<template slot="excellentWordCommand" slot-scope="scope">
					<div>
						<el-button
							@click="_createWordCommand(scope.row, scope.index)"
							v-if="!scope.row.excellentWordCommand"
							>商品详情页口令</el-button
						>
						<span v-else>{{ scope.row.excellentWordCommand }}</span>
					</div>
				</template>
			</yx-table>
		</Dialog>
		<GoodsGroupDialog
			:itemInfo="goodsGroupInfo"
			:formData="formData112"
			:visible.sync="goodsGroupDialogVisible"
			@saveBrand="saveBrand"
		/>
	</div>
</template>
<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import GoodsGroupDialog from './components/GoodsGroupDialog'

import {
	getActDiscountListByCondition,
	delActDiscount,
	addActDiscount,
	editActDiscount,
} from '@/api/yhtPlusCmsAct'
import { getBigImg } from '@/utils/imageTool'
import { handleActDiscountRedis, createWordCommand } from '@/api/goodsGroup'
import { getYouxuanGoodsList } from '@/api/goodsList'
import { getPublicKeyAndModel } from '@/api/webUser'
import { uploadImageList } from '@/api/image'
import { numberFormat } from '@/utils/helper/common.js'
import { checkFunctionCode } from '@/utils/auth'
import RSA from 'js-rsa-dave'
import moment from 'moment'

export default {
	components: {
		YxForm,
		YxTable,
		Dialog,
		GoodsGroupDialog,
	},
	props: [],
	data() {
		return {
			getGoodsDetailByOrganizationSpecId: checkFunctionCode(
				'getGoodsDetailByOrganizationSpecId'
			),
			goodsGroupIds: [],
			loading102: false,
			dialogTitle101: '分组商品',
			dialogWidth101: '80%',
			dialogVisible101: false,
			tableData102: [],
			tableColumns102: [
				{
					type: 'image',
					dataIndex: 'goodsDefaultImage',
					title: '商品图',
				},
				{
					type: 'custom',
					dataIndex: 'goodsName',
					title: '商品名称',
					width: '300px',
				},
				{
					type: 'string',
					dataIndex: 'scateName',
					title: '商品分类',
					customRender: (row) => {
						return row.scateName ? row.scateName : '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '品牌',
				},
				{
					type: 'amount',
					dataIndex: 'supplyPrice',
					title: '供货价',
				},
				{
					type: 'string',
					dataIndex: 'lowestPrice',
					title: '建议零售价',
					customRender: (row) => {
						return (
							'￥' +
							numberFormat(row.lowestPrice, 2) +
							'~' +
							numberFormat(row.highestPrice, 2)
						)
					},
				},
				{
					type: 'amount',
					dataIndex: 'marketPrice',
					title: '市场价',
				},
				{
					type: 'custom',
					dataIndex: 'excellentWordCommand',
					title: '生成优口令',
					width: '160px',
				},
			],
			page102: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData102()
				},
			},
			curTime: new Date().getTime(),
			discountRule: [
				{
					text1: '元，减',
					text2: '元',
				},
				{
					text1: '件，减',
					text2: '元',
				},
				{
					text1: '元，打',
					text2: '折',
				},
				{
					text1: '件，打',
					text2: '折',
				},
			],
			loading: false,
			formData105: {
				keyword: '',
				discountTypeList: [],
				openTypeList: [],
				startTime: '',
				endTime: '',
			},
			formCfg105: [
				{
					type: 'input',
					title: '关键词',
					dataIndex: 'keyword',
					placeholder: '请输入关键词',
				},
				{
					type: 'checkbox',
					title: '活动类型',
					dataIndex: 'discountTypeList',
					placeholder: '请输入活动类型',
					label: 'value',
					options: [
						{
							discountTypeList: '1',
							value: '满元减',
						},
						{
							discountTypeList: '2',
							value: '满件减',
						},
						{
							discountTypeList: '3',
							value: '满元折',
						},
						{
							discountTypeList: '4',
							value: '满件折',
						},
					],
				},
				{
					type: 'checkbox',
					title: '活动状态',
					dataIndex: 'openTypeList',
					placeholder: '请输入活动状态',
					label: 'value',
					options: [
						{
							openTypeList: '1',
							value: '未开始',
						},
						{
							openTypeList: '2',
							value: '进行中',
						},
						{
							openTypeList: '3',
							value: '已结束',
						},
					],
				},
				{
					type: 'datetimerange',
					title: '添加时间',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
				},
			],
			formAction105: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData106(true)
					},
				},
			],
			tableData106: [],
			tableColumns106: [
				{
					type: 'string',
					dataIndex: 'actDiscountId',
					title: '活动Id',
				},
				{
					type: 'image',
					dataIndex: 'imageBigUrl',
					title: '活动海报',
					width: '180',
				},
				{
					type: 'string',
					dataIndex: 'actName',
					title: '活动名称',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'string',
					dataIndex: 'sortOrder',
					title: '排序值',
				},
				{
					type: 'string',
					dataIndex: 'startTime',
					title: '活动时间',
					customRender: (row) => {
						return (
							moment(row.startTime).format('YYYY-MM-DD HH:mm:ss') +
							'-' +
							moment(row.endTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					type: 'custom',
					dataIndex: 'goodsGroupCount',
					title: '档期数',
				},
				{
					type: 'string',
					dataIndex: 'goodsCount',
					title: '商品数',
				},
				{
					type: 'newMap',
					dataIndex: 'discountType',
					title: '活动类型',
					options: [
						['1', '满元减'],
						['2', '满件减'],
						['3', '满元折'],
						['4', '满件折'],
					],
				},
				{
					type: 'string',
					dataIndex: 'discountRule',
					title: '活动规则',
				},
				{
					type: 'custom',
					dataIndex: 'discountState',
					title: '活动状态',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '编辑',
							auth: 'editActDiscount',
							click: (row) => {
								this.editActDiscountInfo(row)
							},
							customRender: (action, row) => {
								action.hide = row.isNewData == 0
								return action
							},
						},
						{
							title: '查看',
							auth: 'editActDiscount',
							click: (row) => {
								this.editActDiscountInfo(row)
							},
							customRender: (action, row) => {
								action.hide = row.isNewData == 1
								return action
							},
						},
						{
							title: '查看商品',
							click: (row) => {
								if (row.goodsCount == 0) {
									return this.$message.error('商品数量为0！')
								}
								this.dialogVisible101 = true
								this.goodsGroupIds = row.goodsGroupInfo
									.split(',')
									.map((item) => {
										return item.split('-')[0]
									})
								this.getData102(true)
							},
							customRender: (action, row) => {
								action.hide = !row.goodsGroupInfo
								return action
							},
						},
						{
							title: '删除',
							auth: 'delActDiscount',
							popconfirm: true,
							popconfirmTitle: '确认要删除该活动吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._delActDiscount(row)
							},
						},
						{
							title: '刷新缓存',
							auth: 'handleGoodsGroupListRedis',
							customRender: (action) => {
								action.hide = this.$store.state.user.userInfo.groupId != 2
								return action
							},
							popconfirm: true,
							popconfirmTitle: '是否刷新缓存',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._handleGoodsGroupListRedis(row)
							},
						},
					],
				},
			],
			page106: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData106()
				},
			},
			dialogTitle107: '查看会场',
			dialogWidth107: '640px',
			dialogVisible107: false,
			dialogBottomBtn107: [],
			tableData109: [],
			tableColumns109: [
				{
					type: 'string',
					dataIndex: 'groupName1',
					title: '分组名称',
				},
				{
					type: 'string',
					dataIndex: 'groupName2',
					title: '分组名称',
				},
				{
					title: '分组名称',
					type: 'string',
					dataIndex: 'groupName3',
				},
				{
					title: '分组名称',
					type: 'string',
					dataIndex: 'groupName4',
				},
				{
					title: '分组名称',
					type: 'string',
					dataIndex: 'groupName5',
				},
				{
					title: '分组名称',
					type: 'string',
					dataIndex: 'groupName6',
				},
			],
			dialogTitle111: '新增活动',
			dialogWidth111: '600px',
			dialogVisible111: false,
			dialogBottomBtn111: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog112.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveAddActDiscountList()
								// this.dialogVisible105 = false
							}
						})
					},
				},
			],
			goodsGroupDialogVisible: false,
			formData112: {
				actName: '',
				sortOrder: '',
				startTime: '',
				endTime: '',
				discountType: '',
				copywriting: '',
				goodsGroupList: [],
			},
			formRules112: {
				actName: [
					{ required: true, message: '请输入活动名称', trigger: 'blur' },
				],
				sortOrder: [
					{ required: true, message: '请输入排序值', trigger: 'blur' },
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入排序值!'))
							} else if (Number(value) > 255) {
								callback(new Error('排序值最大值不超过255!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				startTime: [
					{ required: true, message: '请选择开始时间', trigger: 'change' },
				],
				endTime: [
					{ required: true, message: '请选择结束时间', trigger: 'change' },
				],
				goodsGroupId: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData112.goodsGroupList.length) {
								callback(new Error('请选择活动!'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				// platform: [
				// 	{
				// 		required: true,
				// 		validator: (rule, value, callback) => {
				// 			if (
				// 				!this.formData112.businessExpensesProportion.toString() ||
				// 				!this.formData112.platform.toString()
				// 			) {
				// 				callback(new Error('费用归属!'))
				// 			} else if (
				// 				!new RegExp(/^(?:0|[1-9][0-9]?|100)$/).test(
				// 					this.formData112.businessExpensesProportion
				// 				)
				// 			) {
				// 				callback(new Error('请输入正确的商家承担比例!'))
				// 			} else {
				// 				callback()
				// 			}
				// 		},
				// 		trigger: 'blur',
				// 	},
				// ],
				discountImageB: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData112.discountImageB.length) {
								callback(new Error('请上传图片!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			formCfg112: [
				{
					type: 'input',
					title: '活动名称',
					dataIndex: 'actName',
					placeholder: '请输入活动名称',
				},
				{
					type: 'input',
					title: '排序值',
					dataIndex: 'sortOrder',
					placeholder: '请输入排序值',
				},
				{
					type: 'text',
					title: '',
					dataIndex: 'sortOrderTip',
				},
				{
					title: '活动时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
				{
					title: '活动类型',
					type: 'radio',
					dataIndex: 'discountType',
					placeholder: '请输入placeholder',
					label: 'value',
					change: () => {
						this.formData112.discountRuleList = []
					},
					options: [
						{
							value: '满元减',
							discountType: 1,
						},
						{
							value: '满件减',
							discountType: 2,
						},
						{
							value: '满元折',
							discountType: 3,
						},
						{
							value: '满件折',
							discountType: 4,
						},
					],
				},
				{
					type: 'custom',
					unformItem: true,
					dataIndex: 'addActRule',
				},
				{
					type: 'custom',
					title: '参与档期',
					dataIndex: 'goodsGroupId',
				},
				{
					type: 'uploadImage',
					title: '活动海报',
					dataIndex: 'discountImage',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'discountImage',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'discountImage'),
					},
				},
				{
					title: '分享文案',
					type: 'input',
					dataIndex: 'copywriting',
					placeholder: '请输入分享文案',
				},
				{
					type: 'uploadImage',
					title: '分享图片',
					dataIndex: 'discountImageB',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'discountImageB',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'discountImageB'),
					},
				},
				{
					type: 'custom',
					title: '费用归属',
					unformItem: true,
					dataIndex: 'platform',
				},
			],
			formAction112: [],
		}
	},

	created() {
		this.getData106(true)
	},

	methods: {
		editActDiscountInfo(row) {
			this.formData112 = {
				sortOrderTip: '数字越大，排序越前（最大值不超过255）',
				discountImage: [],
				discountImageB: [],
				businessExpensesProportion: row.businessExpensesProportion,
				platform: '',
				discountRuleList: [],
				goodsGroupList: [],
				actName: row.actName,
				sortOrder: row.sortOrder,
				startTime: row.startTime,
				endTime: row.endTime,
				discountType: row.discountType,
				goodsGroupId: row.goodsGroupId,
				copywriting: row.copywriting,
				actDiscountId: row.actDiscountId,
				supplierId: row.supplierId,
				isNewData: row.isNewData,
			}
			// this.formData112.sortOrderTip = '数字越大，排序越前（最大值不超过255）'
			this.dialogTitle111 =
				this.formData112.isNewData == 0 ? '查看活动' : '编辑活动'
			if (row.imageUrl) {
				this.formData112.discountImage = [
					{
						discountImage: getBigImg(row.imageUrl),
					},
				]
			} else {
				this.formData112.discountImage = []
			}
			if (row.shareImageUrl) {
				this.formData112.discountImageB = [
					{
						discountImageB: getBigImg(row.shareImageUrl),
					},
				]
			} else {
				this.formData112.discountImageB = []
			}
			if (this.formData112.businessExpensesProportion) {
				this.formData112.platform =
					100 - this.formData112.businessExpensesProportion
			} else {
				this.formData112.businessExpensesProportion = 0
				this.formData112.platform = 100
			}
			let discountRuleList = row.discountRule.split(',')
			this.formData112.discountRuleList = []
			discountRuleList.map((item) => {
				this.formData112.discountRuleList.push(item.split(':'))
			})
			this.formData112.goodsGroupList = row.goodsGroupInfo
				.split(',')
				.map((item) => {
					return {
						goodsGroupId: Number(item.split('-')[0]),
						groupName: item.split('-')[1],
					}
				})
			this.$nextTick(() => {
				this.$refs.dialog112.$refs.YxForm.clearValidate()
			})
			this.dialogVisible111 = true
		},
		businessExpensesProportionInput(businessExpensesProportionInput) {
			let n = /^(?:0|[1-9][0-9]?|100)$/
			let re = new RegExp(n)
			if (!re.test(businessExpensesProportionInput)) {
				this.$message.warning('请输入正确的商家承担比例')
				this.formData112.platform = 0
				return false
			}
			this.formData112.platform = 100 - businessExpensesProportionInput
		},
		_addActBanner() {
			this.dialogTitle111 = '新增活动'
			this.formData112 = {
				sortOrderTip: '数字越大，排序越前（最大值不超过255）',
				discountImage: [],
				discountImageB: [],
				businessExpensesProportion: '',
				platform: '',
				discountRuleList: [],
				goodsGroupList: [],
				actName: '',
				sortOrder: '',
				startTime: '',
				endTime: '',
				discountType: 1,
				goodsGroupId: '',
				copywriting: '',
				supplierId: '',
			}
			this.$nextTick(() => {
				this.$refs.dialog112.$refs.YxForm.clearValidate()
			})
			this.dialogVisible111 = true
		},
		saveAddActDiscountList: async function () {
			let paramJson = Object.assign(
				{},
				{
					actName: this.formData112.actName,
					sortOrder: this.formData112.sortOrder,
					businessExpensesProportion:
						this.formData112.businessExpensesProportion,
					discountType: this.formData112.discountType,
					showType: this.formData112.showType,
					startTime: moment(this.formData112.startTime).valueOf(),
					endTime: moment(this.formData112.endTime).valueOf(),
				}
			)
			if (this.formData112.supplierId) {
				paramJson.supplierId = this.formData112.supplierId
			}
			// let n = /^(?:0|[1-9][0-9]?|100)$/
			// let re = new RegExp(n)
			// if (
			// 	!this.formData112.actDiscountId &&
			// 	!re.test(paramJson.businessExpensesProportion)
			// ) {
			// 	return this.$message.error('请输入正确的商家承担比例格式')
			// }
			paramJson.goodsGroupIdList = this.formData112.goodsGroupList.map(
				(item) => {
					return item.goodsGroupId
				}
			)
			paramJson.copywriting = this.formData112.copywriting
			if (
				this.formData112.discountImageB.length &&
				this.formData112.discountImageB[0].imageId
			) {
				paramJson.shareImage = this.formData112.discountImageB[0]
				delete paramJson.shareImage.discountImageB
			}
			let actRuleOldNum = 0
			let isCanNext = true
			let discountRuleList = []
			let flag = false
			for (let i = 0; i < this.formData112.discountRuleList.length; i++) {
				let actRuleNum = Number(this.formData112.discountRuleList[i][0]),
					actRuleNum2 = Number(this.formData112.discountRuleList[i][1])
				console.log('--------actRuleNum:', actRuleNum)
				console.log('--------actRuleNum2:', actRuleNum2)
				console.log('--------paramJson.discountType', paramJson.discountType)
				if (!actRuleNum || !actRuleNum2) {
					flag = true
					this.$message.error('请填写活动规则')
					return
				}
				if (paramJson.discountType == 1 && actRuleNum <= actRuleNum2) {
					flag = true
					this.$message.error('活动规则不正确')
					return
				}
				if (
					(paramJson.discountType == 3 || paramJson.discountType == 4) &&
					actRuleNum2 >= 10
				) {
					flag = true
					this.$message.error('请填写正确的折扣')
					return
				}
				if (actRuleNum <= actRuleOldNum) {
					flag = true
					this.$message.error('活动规则必须从小到大递增')
					return
				}
				if (
					(paramJson.discountType == 3 || paramJson.discountType == 4) &&
					actRuleNum2 <= 8
				) {
					// 1.活动类型为满元折或满件折时，规则设置的折扣≤8折
					isCanNext = false
				} else if (paramJson.discountType == 2 && actRuleNum2 > 40) {
					isCanNext = false
				} else if (paramJson.discountType == 1) {
					let countNub = (actRuleNum - actRuleNum2) / actRuleNum
					if (countNub <= 0.8) {
						isCanNext = false
					}
				}
				discountRuleList.push(`${actRuleNum}:${actRuleNum2}`)
				actRuleOldNum = actRuleNum
			}
			if (flag) {
				return false
			}
			paramJson.discountRule = discountRuleList.join(',')
			if (!paramJson.discountRule) {
				return this.$message.error('请添加活动规则')
			}
			if (
				this.formData112.discountImage.length &&
				this.formData112.discountImage[0].imageId
			) {
				paramJson.image = this.formData112.discountImage[0]
				delete paramJson.image.discountImage
				paramJson.bannerId = paramJson.image.imageId
			}
			if (
				this.formData112.actDiscountId &&
				this.formData112.actDiscountId > 0
			) {
				paramJson.actDiscountId = this.formData112.actDiscountId
				paramJson.state = 2
			}
			let res = null
			let isAdd = false
			if (!isCanNext) {
				this.$prompt('活动优惠可能存在折扣过低，请输入设置密码', '', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
					inputErrorMessage: '请输入密码',
					inputType: 'password',
				}).then(async ({ value }) => {
					this.visible = false
					paramJson.couponPassWord = value
					paramJson = await this.getRSAPassword(paramJson)
					let {
						data: { resultCode },
					} = await getPublicKeyAndModel(paramJson)
					if (resultCode == 0) {
						if (paramJson.actDiscountId && paramJson.actDiscountId > 0) {
							res = await editActDiscount(paramJson)
						} else {
							isAdd = true
							res = await addActDiscount(paramJson)
						}
						let { data } = res
						if (data.resultCode == 0) {
							this.$message.success(data.resultMsg)
							this.getData106(isAdd)
							this.dialogVisible111 = false
						}
					}
				})
			} else {
				if (paramJson.actDiscountId && paramJson.actDiscountId > 0) {
					res = await editActDiscount(paramJson)
				} else {
					isAdd = true
					res = await addActDiscount(paramJson)
				}
				let { data } = res
				if (data.resultCode == 0) {
					this.$message.success(data.resultMsg)
					this.getData106(isAdd)
					this.dialogVisible111 = false
				}
			}
		},
		async getRSAPassword(paramJson) {
			let psw = paramJson.couponPassWord.split('').reverse().join('')
			let rsaData = await getPublicKeyAndModel()
			let publicKey = RSA.getKeyPair(
				rsaData.data.resultData.publicKeyIndex,
				'',
				rsaData.data.resultData.modulus
			)
			paramJson.couponPassWord = RSA.encryptedString(publicKey, psw)
			paramJson.privateKeySessionKey =
				rsaData.data.resultData.privateKeySessionKey
			return paramJson
		},
		_createWordCommand: async function (row, index) {
			let {
				data: { resultCode, resultData },
			} = await createWordCommand({
				goodsGroupId: row.goodsGroupList[0].goodsGroupId,
				targetType: 2, //目标类型: 1会场 2商品
				targetId: row.goodsSpecId, //目标id: 会场id、规格id
			})
			if (resultCode == 0) {
				this.tableData102[index].excellentWordCommand = resultData.codeStr
			}
		},
		async getData102(flag) {
			this.loading102 = true
			let paramJson = this.findSearchParams102(flag)
			const {
				data: { resultCode, resultData },
			} = await getYouxuanGoodsList(paramJson)
			if (resultCode == 0) {
				resultData.goodsList.map((item) => {
					if (item.goodsDefaultImage) {
						item.goodsDefaultImage = getBigImg(item.goodsDefaultImage)
					}
				})
				this.tableData102 = resultData.goodsList
				this.page102.count = resultData.goodsCount
			} else {
				this.tableData102 = []
				this.page102.count = 0
			}
			this.loading102 = false
		},
		findSearchParams102(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			const paramJson = Object.assign(
				{},
				{
					goodsGroupIdList: this.goodsGroupIds,
					viewType: 3, //1：规格视图，2：商品视图(带规格)，3：商品视图(不带规格)
					shelfState: 2, // 获取上架商品
					sortField: 1,
					length: this.page102.length,
					startIndex: (this.page102.currentPage - 1) * this.page102.length,
				}
			)
			return paramJson
		},
		// 添加档期
		handleAdd() {
			console.log(
				'this.formData112.goodsGroupList',
				this.formData112.goodsGroupList
			)
			this.goodsGroupInfo = JSON.parse(
				JSON.stringify(this.formData112.goodsGroupList)
			)
			this.goodsGroupDialogVisible = true
		},
		saveBrand(selectGroupList, selectedSupplier) {
			console.log(
				'selectGroupList, selectedSupplier',
				selectGroupList,
				selectedSupplier
			)
			this.formData112.supplierId = selectedSupplier.supplierId
			this.formData112.goodsGroupList = selectGroupList
		},
		// 新增规则
		setDiscountRule(flag, index) {
			if (flag) {
				this.formData112.discountRuleList.splice(index, 1)
			} else {
				this.formData112.discountRuleList.push(['', ''])
			}
			this.$forceUpdate()
		},
		async uploadImageHttpRequest(params, name) {
			//上传海报
			let formData = new FormData()
			if (name == 'discountImage') {
				formData.append('formId', '#portraitImageFrom')
			} else if (name == 'discountImageB') {
				formData.append('formId', '#portraitImageFromB')
			}
			formData.append('data', JSON.stringify({ imageType: 49 }))
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			if (resultCode == 0) {
				resultData.imageList[0][name] = getBigImg(
					resultData.imageList[0].imageUrl
				)
				this.formData112[name] = resultData.imageList
			}
			this.$forceUpdate()
		},
		_delActDiscount: async function ({ actDiscountId }) {
			let {
				data: { resultCode, resultMsg },
			} = await delActDiscount({
				actDiscountIdList: [actDiscountId],
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.getData106()
			}
		},
		_handleGoodsGroupListRedis: async function ({ actDiscountId }) {
			let {
				data: { resultCode, resultMsg },
			} = await handleActDiscountRedis({
				actDiscountId,
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.getData106()
			}
		},
		showGoodsGroupInfo(row) {
			let list = row.goodsGroupInfo.split(',')
			let mapIndex = 0,
				groupList = []
			for (let i = 0; i < list.length; i++) {
				if (i % 6 == 0 && i != 0) {
					let item = {
						groupName1: list[mapIndex].split('-')[1],
						groupName2: list[mapIndex + 1].split('-')[1],
						groupName3: list[mapIndex + 2].split('-')[1],
						groupName4: list[mapIndex + 3].split('-')[1],
						groupName5: list[mapIndex + 4].split('-')[1],
						groupName6: list[mapIndex + 5].split('-')[1],
					}
					groupList.push(item)
					mapIndex = i
				}
			}
			if (mapIndex < list.length) {
				let item = {
					groupName1: list[mapIndex].split('-')[1],
				}
				if (list.length - mapIndex > 1)
					item.groupName2 = list[mapIndex + 1].split('-')[1]
				if (list.length - mapIndex > 2)
					item.groupName3 = list[mapIndex + 2].split('-')[1]
				if (list.length - mapIndex > 3)
					item.groupName4 = list[mapIndex + 3].split('-')[1]
				if (list.length - mapIndex > 4)
					item.groupName5 = list[mapIndex + 4].split('-')[1]
				if (list.length - mapIndex > 5)
					item.groupName6 = list[mapIndex + 5].split('-')[1]

				groupList.push(item)
			}
			this.dialogVisible107 = true
			this.tableData109 = groupList
		},
		getData106: async function (flag) {
			this.loading = true
			let paramJson = this.findSearchParams106(flag)
			const {
				data: { resultCode, resultData },
			} = await getActDiscountListByCondition(paramJson)
			this.curTime = new Date().getTime()
			if (resultCode == 0) {
				resultData.actDiscountList.map((item) => {
					item.imageBigUrl = getBigImg(item.imageUrl)
				})
				this.tableData106 = resultData.actDiscountList
				this.page106.count = resultData.count
			} else {
				this.tableData106 = []
				this.page106.count = 0
			}
			this.loading = false
		},
		findSearchParams106(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page106.currentPage = 1
			}
			const paramJson = Object.assign(this.formData105, {
				length: this.page106.length,
				startIndex: (this.page106.currentPage - 1) * this.page106.length,
			})
			return paramJson
		},
	},
}
</script>
<style lang="scss" scope>
.selection-goods-btnlist {
	margin-bottom: 20px;
}
.platform-box {
	display: flex;
	align-items: center;
	.platform-box-input {
		width: 100px;
	}
}
.add-act-rule-box {
	display: flex;
	align-items: flex-start;
}
.add-act-rule-item {
	display: flex;
	margin-left: 50px;
	align-items: center;
	.rule-item-input {
		width: 100px;
		margin-right: 10px;
	}
	p {
		margin-right: 10px;
	}
}
.goods-name-box {
	text-align: left;
	p {
		text-align: left;
	}
}
</style>

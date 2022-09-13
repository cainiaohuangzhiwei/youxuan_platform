<template>
	<yx-dialog
		:title="getTitle()"
		class="yxDialog"
		width="800px"
		:bottomBtn="bottomBtn"
		:visible.sync="localVisible"
		:before-close="resetForm"
	>
		<el-form ref="form" :model="form" :rules="rules" label-width="80px">
			<el-form-item label="活动名称" prop="activityName">
				<el-input
					v-model="form.activityName"
					maxlength="20"
					:disabled="Prohibited"
				></el-input>
			</el-form-item>
			<el-form-item
				v-if="activityStatus == 1 && status == 1"
				label="活动时间"
				prop="actEndTime"
			>
				<el-date-picker
					:disabled="true"
					v-model="form.actStartTime"
					type="datetime"
					placeholder="开始日期"
					key="actStartTime"
				>
				</el-date-picker>
				-
				<el-date-picker
					v-model="form.actEndTime"
					type="datetime"
					placeholder="结束日期"
					key="actEndTime"
				>
				</el-date-picker>
			</el-form-item>
			<el-form-item v-else label="活动时间" prop="time">
				<el-date-picker
					:disabled="Prohibited || ProhibitTed"
					v-model="form.time"
					type="datetimerange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					key="time"
				>
				</el-date-picker>
			</el-form-item>
			<el-form-item
				label="费用归属"
				class="inline-form-item"
				prop="businessExpensesProportion"
				required
			>
				商家承担
				<el-form-item>
					<el-input
						v-model.number="form.businessExpensesProportion"
						:disabled="Prohibited || ProhibitTed"
						@input="businessExpensesProportionInput"
						placeholder=""
						style="width: 70px"
					></el-input>
				</el-form-item>
				%，平台承担
				<el-form-item prop="platformCostRatio">
					<el-input
						disabled
						v-model="form.platformCostRatio"
						placeholder=""
						style="width: 70px"
					></el-input>
				</el-form-item>
				%
			</el-form-item>
			<el-form-item label="费用预算" prop="costBudget">
				<el-input
					:disabled="Prohibited || ProhibitTed"
					type="number"
					v-model="form.costBudget"
				></el-input>
			</el-form-item>
			<el-form-item label="部门预算" prop="departmentBudget">
				<el-input
					:disabled="Prohibited || ProhibitTed"
					v-model="form.departmentBudget"
				></el-input>
			</el-form-item>
			<div>
				<h5>奖励规则设置</h5>
				<div class="box-item" v-for="(item, index) in form.list" :key="index">
					<p>规则{{ index + 1 }}</p>
					<el-form-item
						label="参与范围"
						:prop="'list.' + index + '.ruleType'"
						:rules="listRuleBeanRule.ruleType"
					>
						<div>
							<el-select
								v-model="item.ruleType"
								style="margin-right: 10px"
								@change="participateScope(index)"
								:disabled="Prohibited || ProhibitTed"
							>
								<el-option label="全平台" :value="1"></el-option>
								<el-option label="指定档期" :value="2"></el-option>
								<el-option label="指定商品" :value="3"></el-option>
							</el-select>
							<el-button
								:disabled="Prohibited"
								type="text"
								v-if="item.ruleType == 1"
								@click="addSchedule(item, index)"
								>添加不参与档期</el-button
							>
							<el-button
								:disabled="Prohibited"
								type="text"
								v-else-if="item.ruleType == 2"
								@click="addSchedule(item, index)"
								>选择档期</el-button
							>
							<el-button
								:disabled="Prohibited"
								@click="addProduct(item, index, false)"
								type="text"
								v-else-if="item.ruleType == 3"
								>选择商品</el-button
							>
						</div>
						<div
							v-if="item.ruleType == 1 && item.notGroup && item.notGroup.length"
						>
							不参与的档期：<span v-for="(ite, i) in item.notGroup" :key="i"
								>{{ ite.groupName
								}}{{ item.notGroup.length - 1 != i ? '、' : '' }}</span
							>
						</div>
						<div
							v-else-if="
								item.ruleType == 2 && item.inGroup && item.inGroup.length
							"
						>
							<!-- 只展示3个档期 -->
							<div
								v-if="item.inGroup.length && !item.unfold"
								style="display: contents"
							>
								参与的档期：
								<el-button
									style="margin-left: 140px"
									:disabled="Prohibited"
									type="text"
									@click="addProduct(item, index, true)"
									>添加不参与商品（{{
										item.inGoods
											? item.inGoods.length
											: item.eliminateGoodsInfoList
											? item.eliminateGoodsInfoList.length
											: 0
									}})</el-button
								>
								<span
									style="display: block"
									v-for="(ite, i) in item.threeS"
									:key="i"
									>{{ ite.groupName
									}}{{ item.inGroup.length - 1 != i ? '、' : '' }}</span
								>
							</div>
							<!-- 展示全部档期 -->
							<div v-else-if="item.unfold" style="display: contents">
								参与的档期：
								<el-button
									style="margin-left: 140px"
									:disabled="Prohibited"
									type="text"
									@click="addProduct(item, index, true)"
									>添加不参与商品（{{
										item.inGoods
											? item.inGoods.length
											: item.eliminateGoodsInfoList
											? item.eliminateGoodsInfoList.length
											: 0
									}})</el-button
								>
								<span
									style="display: block"
									v-for="(ite, i) in item.inGroup"
									:key="i"
									>{{ ite.groupName
									}}{{ item.inGroup.length - 1 != i ? '、' : '' }}
								</span>
							</div>
							<el-link
								v-if="item.inGroup.length > 3 && !item.unfold"
								type="primary"
								style="margin-left: 20px"
								class="el-icon-caret-bottom"
								@click="grtUnfold(item, index, 1)"
								>展开</el-link
							>
							<el-link
								v-if="item.inGroup.length > 3 && item.unfold"
								type="primary"
								style="margin-left: 20px"
								class="el-icon-caret-bottom"
								@click="grtUnfold(item, index, 2)"
								>收起</el-link
							>
						</div>

						<div
							v-else-if="
								item.ruleType == 3 && item.inGoods && item.inGoods.length
							"
						>
							参与商品：<span v-for="(ite, i) in item.inGoods" :key="i"
								>{{ ite.goodsName
								}}{{ item.inGoods.length - 1 != i ? '、' : '' }}</span
							>
						</div>
					</el-form-item>
					<el-form-item
						label="奖励内容"
						:prop="'list.' + index + '.resource'"
						:rules="listRuleBeanRule.resource"
					>
						<el-radio-group
							v-model="item.resource"
							:disabled="Prohibited || ProhibitTed"
						>
							<!-- <el-radio :label="1" disabled>销售分系数</el-radio> -->
							<!-- <el-radio :label="2" disabled>固定分</el-radio> -->
							<el-radio :label="3">现金</el-radio>
							<el-radio :label="4">佣金系数</el-radio>
						</el-radio-group>
						<div v-if="item.resource == 1">
							<el-input
								:disabled="Prohibited || ProhibitTed"
								style="width: 200px"
								v-model="item.amountFactor"
								placeholder="请输入销售分系数"
							></el-input>
						</div>
						<div v-else-if="item.resource == 2">
							<el-input
								:disabled="Prohibited || ProhibitTed"
								style="width: 200px"
								v-model="item.fixedAmount"
								placeholder="请输入固定分"
							></el-input
							>分
						</div>
						<div v-else-if="item.resource == 3">
							<el-input
								:disabled="Prohibited || ProhibitTed"
								style="width: 200px"
								v-model="item.cash"
								placeholder="请输入现金"
							></el-input
							>元
						</div>
						<div v-if="item.resource == 4">
							<el-input
								:disabled="Prohibited || ProhibitTed"
								style="width: 200px"
								v-model="item.commissionRatio"
								placeholder="请输入佣金系数"
							></el-input>
						</div>
					</el-form-item>
					<div style="text-align: right; margin-bottom: 10px">
						<el-button
							@click="handleDel(item, index)"
							type="danger"
							:disabled="Prohibited || ProhibitTed"
							>删除</el-button
						>
					</div>
				</div>
			</div>
			<div>
				<el-button
					:disabled="Prohibited || ProhibitTed"
					type="primary"
					style="margin-top: 10px"
					@click="addRules"
					>添加规则</el-button
				>
			</div>
		</el-form>
		<div>
			<h5>活动页面配置</h5>
			<yx-form
				ref="dialog106"
				labelWidth="100px"
				:data="formData"
				:items="formCfg"
				:rules="formRules"
				:formDisabled="Prohibited"
			>
			</yx-form>
		</div>
		<select-schedule-dialog
			:visible.sync="selectScheduleDialog"
			:selectScheduleRow="selectScheduleRow"
			@saveSchedule="saveSchedule"
		></select-schedule-dialog>
		<select-product-dialog
			:visible.sync="selectProductDialog"
			:selectProductRow="selectProductRow"
			:inquireProductRow="inquireProductRow"
			:eliminateGoodsInfoListS="eliminateGoodsInfoListS"
			:BooleS="BooleS"
			:newActivitiesRow="newActivitiesRow"
			@saveProduct="saveProduct"
		></select-product-dialog>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import { getGoodsGroupListByConditionForCMS } from '@/api/coupon'
import {
	saveActivityReward,
	modifyActivityReward,
	getMarketingRewardById,
} from '@/api/userRewardSystem'
import { getBigImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'
import SelectScheduleDialog from './SelectScheduleDialog'
import SelectProductDialog from './SelectProductDialog'
import moment from 'moment'
export default {
	components: {
		YxDialog,
		YxForm,
		SelectScheduleDialog,
		SelectProductDialog,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			default: false,
		},
		newActivitiesRow: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		let validateruleType = (rule, value, callback) => {
			let thisField = rule.field.split('.')[1]
			if (value == 2) {
				if (!this.form.list[thisField].inGroup.length) {
					callback(new Error('请选择指定档期'))
				}
			} else if (value == 3) {
				if (!this.form.list[thisField].inGoods.length) {
					callback(new Error('请选择指定商品'))
				}
			}
			callback()
		}
		let validateresource = (rule, value, callback) => {
			const cashFlag = this.form.list.some((item) => item.resource == 3) //是否存在现金规则列表
			const salesFlag = this.form.list.some(
				(item) => item.resource == 1 || item.resource == 2
			) //是否存在销售分规则列表
			if (cashFlag && salesFlag) {
				callback(
					new Error('多个规则时奖励内容类型不能同时存在现金和销售分类型')
				)
			}
			let thisField = rule.field.split('.')[1]
			let reg = /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/
			if (value == 1) {
				if (!this.form.list[thisField].amountFactor) {
					callback(new Error('销售分系数不能为空'))
				} else if (!reg.test(this.form.list[thisField].amountFactor)) {
					callback(new Error('填写数需大于0,支持2位小数'))
				}
			} else if (value == 2) {
				if (!this.form.list[thisField].fixedAmount) {
					callback(new Error('固定分不能为空'))
				} else if (!reg.test(this.form.list[thisField].fixedAmount)) {
					callback(new Error('填写数需大于0,支持2位小数'))
				}
			} else if (value == 3) {
				if (!this.form.list[thisField].cash) {
					callback(new Error('现金不能为空'))
				} else if (!reg.test(this.form.list[thisField].cash)) {
					callback(new Error('填写数需大于0,支持2位小数'))
				}
			} else if (value == 4) {
				if (!this.form.list[thisField].commissionRatio) {
					callback(new Error('佣金系数不能为空'))
				} else if (!reg.test(this.form.list[thisField].commissionRatio)) {
					callback(new Error('填写数需大于0,支持2位小数'))
				}
			}
			callback()
		}
		let validateActEndTime = (rule, value, callback) => {
			if (!value) {
				callback(new Error('活动结束时间不能为空'))
			} else if (moment(value).valueOf() <= this.form.actStartTime) {
				callback(new Error('结束时间需大于开始时间'))
			} else if (moment(value).valueOf() <= new Date().getTime()) {
				callback(new Error('结束时间需大于当前时间'))
			}
			callback()
		}
		return {
			listRuleBeanRule: {
				resource: {
					required: true,
					validator: validateresource,
					trigger: ['blur', 'change'],
				},
				ruleType: {
					required: true,
					validator: validateruleType,
					trigger: ['blur', 'change'],
				},
			},
			BooleS: false, //在档期中剔除商品
			Prohibited: false, // 编辑
			ProhibitTed: false, // 查看
			activityStatus: -1, //活动状态，1:开启，0:关闭
			status: -1, //活动状态，0未开始 1进行中 2已结束
			removeRuleIdList: [],
			selectScheduleDialog: false,
			selectScheduleRow: {},
			selectProductDialog: false,
			selectProductRow: [],
			inquireProductRow: [],
			rulesIndex: 0,
			form: {
				activityName: '',
				time: '',
				actStartTime: '',
				actEndTime: '',
				businessExpensesProportion: 0,
				platformCostRatio: 100,
				costBudget: '',
				departmentBudget: '',
				list: [
					{
						ruleType: 1,
						resource: 3,
						fixedAmount: '',
						amountFactor: '',
						commissionRatio: '',
						notGroup: [],
						inGroup: [],
						inGoods: [],
						threeS: [],
						unfold: false,
					},
				],
			},
			rules: {
				activityName: [
					{
						required: true,
						message: '请输入活动名称',
						trigger: ['blur', 'change'],
					},
				],
				businessExpensesProportion: [
					{ required: true, message: '请输入费用归属', trigger: 'blur' },
					{
						type: 'number',
						min: 0,
						max: 100,
						message: '费用归属范围应该设置0~100',
						trigger: 'blur',
					},
				],
				costBudget: [
					{ required: true, message: '请输入费用预算', trigger: 'blur' },
					{
						validator: (rule, value, callback) => {
							const pattern = /^\d+.?\d{0,2}$/
							if (value === '') {
								callback(new Error('费用预算不能为空'))
							} else {
								if (Number(value) < 0 || Number(value) > 500 * 10000) {
									callback(new Error('费用预算必须大于0小于等于500W'))
								} else if (!pattern.test(value)) {
									callback(new Error('小数点后最多只能输入两位'))
								}
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				departmentBudget: [
					{ required: true, message: '请输入预算部门', trigger: 'blur' },
					{
						validator: (rule, value, callback) => {
							let pattern = /^[一-龥]{1,10}$/
							if (!value) {
								callback(new Error('请输入活动名称'))
							} else if (value.length > 10) {
								callback(new Error('长度不能超过10个字'))
							} else if (!pattern.test(value)) {
								callback(new Error('仅限输入文字'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				region: [
					{ required: true, message: '请选择活动区域', trigger: 'change' },
				],
				time: [
					{
						required: true,
						message: '请选择活动时间',
						trigger: 'change',
					},
				],
				actEndTime: [
					{
						required: true,
						validator: validateActEndTime,
						trigger: 'change',
					},
				],
			},
			selectGroupList: [],
			showLoading: false,
			currentTime: '',
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.handleHold()
					},
				},
			],
			formData: {
				mainPicUrl: [],
				activityBillUrl: [],
				billRequestUrl: '',
				activityRemark: '',
			},
			formCfg: [
				{
					type: 'uploadImage',
					title: '入口图',
					dataIndex: 'mainPicUrl',
					uploadAttributes: {
						limit: 1,
						imageName: 'mainPicUrl',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'mainPicUrl'),
					},
				},
				{
					type: 'uploadImage',
					title: '活动海报',
					dataIndex: 'activityBillUrl',
					uploadAttributes: {
						limit: 1,
						imageName: 'activityBillUrl',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'activityBillUrl'),
					},
				},
				{
					type: 'input',
					title: '海报跳转路径',
					dataIndex: 'billRequestUrl',
					placeholder: '请输入海报跳转路径',
				},
				{
					title: '活动说明',
					type: 'textarea',
					dataIndex: 'activityRemark',
					maxlength: 1000,
					placeholder: '活动说明(限制1000字)',
				},
			],
			formRules: {
				activityRemark: [
					{
						required: true,
						message: '请输入活动说明',
						trigger: ['blur', 'change'],
					},
				],
			},
			eliminateGoodsInfoListS: [],
		}
	},
	computed: {
		localVisible: {
			get() {
				return this.visible
			},
			set(val) {
				this.$emit('update:visible', val)
			},
		},
	},

	watch: {
		localVisible(val) {
			this.$refs.form && this.$refs.dialog106.$refs.YxForm.resetFields()
			this.$refs.form && this.$refs.form.resetFields()
			this.removeRuleIdList = []
			this.Prohibited = false
			this.ProhibitTed = false
			this.activityStatus = -1
			this.status = -1
			this.form = this.getForm()
			this.formData = this.getFormData()
			this.inquireProductRow = []
			this.eliminateGoodsInfoListS = []
			this.selectProductRow = {}
			if (val) {
				if (this.newActivitiesRow.id) {
					this._getMarketingRewardById()
				}
			}
		},
	},
	methods: {
		businessExpensesProportionInput() {
			this.form.platformCostRatio =
				100 - (this.form.businessExpensesProportion || 0)
		},
		//清除数据存储
		participateScope(index) {
			this.form.list[index].inGoods = []
			this.form.list[index].inGroup = []
		},
		grtUnfold(it, index, v) {
			if (v === 2) {
				it.unfold = false
				this.form.list[index].unfold = false
			} else {
				it.unfold = true
				this.form.list[index].unfold = true
			}
		},
		getTitle() {
			if (this.newActivitiesRow.id) {
				if (this.newActivitiesRow.activityStatus == 0) {
					return '查看活动'
				} else if (this.newActivitiesRow.activityStatus == 1) {
					if (this.newActivitiesRow.status == 2) {
						return '查看活动'
					} else {
						return '编辑活动'
					}
				}
			} else {
				return '新增活动'
			}
		},
		async _getMarketingRewardById() {
			let params = {
				activityId: this.newActivitiesRow.id,
				userName: this.$store.state.user.userInfo.userName,
			}
			let {
				data: { resultCode, resultData },
			} = await getMarketingRewardById(params)
			if (resultCode == 0) {
				// activityStatus(活动状态，1:开启，0:关闭)
				if (resultData.activityStatus == 0) {
					this.Prohibited = true
					this.ProhibitTed = true
				} else if (resultData.activityStatus == 1) {
					// status(活动状态，0未开始 1进行中 2已结束)
					if (resultData.status == 0 || resultData.status == 1) {
						this.Prohibited = false
					} else {
						this.Prohibited = true
					}
					if (resultData.status == 1) {
						this.ProhibitTed = true
					} else if (resultData.status == 0) {
						this.ProhibitTed = false
					}
				}
				this.activityStatus = resultData.activityStatus
				this.status = resultData.status
				this.form.costBudget = resultData.costBudget
				if (resultData.departmentBudget) {
					this.form.departmentBudget = resultData.departmentBudget
				}
				this.form.activityName = resultData.activityName
				if (resultData.businessExpensesProportion) {
					this.form.businessExpensesProportion =
						resultData.businessExpensesProportion
					this.businessExpensesProportionInput()
				}

				this.formData.activityRemark = resultData.activityRemark
				this.form.time = [
					new Date(resultData.startTime),
					new Date(resultData.endTime),
				]
				this.form.actStartTime = new Date(resultData.startTime)
				this.form.actEndTime = new Date(resultData.endTime)
				if (resultData.billRequestUrl) {
					this.formData.billRequestUrl = resultData.billRequestUrl
				}
				if (resultData.mainPicUrl) {
					this.formData.mainPicUrl = [
						{
							mainPicUrl: getBigImg(resultData.mainPicUrl),
							imageUrl: resultData.mainPicUrl,
						},
					]
				}
				if (resultData.activityBillUrl) {
					this.formData.activityBillUrl = [
						{
							activityBillUrl: getBigImg(resultData.activityBillUrl),
							imageUrl: resultData.activityBillUrl,
						},
					]
				}
				if (resultData.listRuleBO && resultData.listRuleBO.length) {
					this.form.list = resultData.listRuleBO.map((item) => {
						let obj = {}
						obj.id = item.id
						obj.rewardType = item.rewardType
						obj.ruleType = item.ruleType
						if (item.rewardType == 1) {
							if (item.amountFactor > 0) {
								obj.amountFactor = item.amountFactor
								obj.resource = 1
							} else if (item.fixedAmount > 0) {
								obj.fixedAmount = item.fixedAmount
								obj.resource = 2
							}
						} else if (item.rewardType == 2) {
							if (item.fixedAmount > 0) {
								obj.cash = item.fixedAmount
								obj.resource = 3
							}
						} else if (item.rewardType == 3) {
							if (item.amountFactor > 0) {
								obj.commissionRatio = item.amountFactor
								obj.resource = 4
							}
						}

						if (item.ruleType == 1) {
							obj.notGroup = item.listTargetBO.map((ite) => {
								return {
									goodsGroupId: ite.targetId,
									groupName: ite.targetName,
									id: ite.id,
								}
							})
						} else if (item.ruleType == 2) {
							obj.inGroup = item.listTargetBO.map((ite) => {
								return {
									goodsGroupId: ite.targetId,
									groupName: ite.targetName,
									id: ite.id,
								}
							})
							if (item.eliminateGoodsInfoList.length > 0) {
								this.eliminateGoodsInfoListS = item.eliminateGoodsInfoList
								obj.eliminateGoodsInfoList = item.eliminateGoodsInfoList.map(
									(ite) => {
										return {
											goodsId: ite.goodsId,
											goodsGroupId: ite.goodsGroupId,
										}
									}
								)
							} else {
								obj.eliminateGoodsInfoList = []
							}
							obj.threeS = this.uniqueArr(
								Object.assign([], obj.inGroup.slice(0, 3))
							)
							obj.unfold = false
						} else if (item.ruleType == 3) {
							obj.inGoods = item.listTargetBO.map((ite) => {
								return {
									goodsId: ite.targetId,
									goodsGroupId: ite.goodsGroupId,
									goodsName: ite.targetName,
									id: ite.id,
									targetSnapshotId: ite.targetSnapshotId || ite.goodsSnapshotId,
								}
							})
						}
						return obj
					})
				} else {
					this.form.list = [
						{
							ruleType: 1,
							resource: 3,
							fixedAmount: '',
							amountFactor: '',
							commissionRatio: '',
							notGroup: [],
							inGroup: [],
							inGoods: [],
							unfold: false,
						},
					]
				}
			}
		},
		handleDel(item, index) {
			if (this.form.list.length === 1) {
				return this.$message.error('至少存在一个奖励规则')
			}
			if (item.id) {
				this.removeRuleIdList.push(item.id)
			}
			this.form.list.splice(index, 1)
		},
		getFormData() {
			return {
				mainPicUrl: [],
				activityBillUrl: [],
				billRequestUrl: '',
				activityRemark: '',
			}
		},
		getForm() {
			return {
				activityName: '',
				time: '',
				actStartTime: '',
				actEndTime: '',
				businessExpensesProportion: 0,
				platformCostRatio: 100,
				costBudget: '',
				departmentBudget: '',
				list: [
					{
						ruleType: 1,
						resource: 3,
						fixedAmount: '',
						amountFactor: '',
						commissionRatio: '',
						notGroup: [],
						inGroup: [],
						inGoods: [],
						threeS: [],
						unfold: false,
					},
				],
			}
		},
		saveProduct(obj) {
			if (this.form.list[this.rulesIndex].ruleType == 3 || this.BooleS) {
				this.form.list[this.rulesIndex].inGoods = JSON.parse(
					JSON.stringify(obj)
				)
			}
		},
		saveSchedule(obj) {
			if (this.form.list[this.rulesIndex].ruleType == 1) {
				this.form.list[this.rulesIndex].notGroup = JSON.parse(
					JSON.stringify(obj)
				)
			} else if (this.form.list[this.rulesIndex].ruleType == 2) {
				this.form.list[this.rulesIndex].inGroup = JSON.parse(
					JSON.stringify(obj)
				)
				// this.form.list[0].inGroup.map((item) => {
				// this.form.list[0].inGroup.forEach((item) => {
				// 	if (this.form.list[0].inGroup.length < 4) {
				// 		this.threeS.push({
				// 			groupName: item.groupName,
				// 		})
				// 	}
				// })
				this.form.list[this.rulesIndex].threeS = this.uniqueArr(
					Object.assign([], this.form.list[this.rulesIndex].inGroup.slice(0, 3))
				)
				this.form.list[this.rulesIndex].unfold = false
			}
		},
		//去重
		uniqueArr(array) {
			const obj = {}
			return array.filter((item) => {
				// 防止key重复
				const newItem = item + JSON.stringify(item)
				// eslint-disable-next-line no-prototype-builtins
				return obj.hasOwnProperty(newItem) ? false : (obj[newItem] = true)
			})
		},
		addSchedule(item, index) {
			if (item.ruleType == 1) {
				this.selectScheduleRow = item.notGroup || []
			} else if (item.ruleType == 2) {
				this.selectScheduleRow = item.inGroup || []
			}
			this.selectScheduleDialog = true
			this.rulesIndex = index
		},
		addProduct(item, index, Boole) {
			//在档期中剔除商品
			this.BooleS = Boole
			if (item.ruleType == 3 || Boole) {
				this.selectProductRow = item.inGoods || []
			}
			if (Boole) {
				this.inquireProductRow = item.inGroup || []
			} else {
				// this.inquireProductRow = []
				// this.eliminateGoodsInfoListS = []
			}
			this.selectProductDialog = true
			this.rulesIndex = index
		},
		addRules() {
			this.form.list.push({
				ruleType: 1,
				resource: 3,
				fixedAmount: '',
				amountFactor: '',
				commissionRatio: '',
				notGroup: [],
				inGroup: [],
				inGoods: [],
				unfold: false,
			})
		},
		handleHold() {
			if (this.Prohibited) return
			this.$refs['form'].validate((valid) => {
				if (valid) {
					this.$refs.dialog106.$refs.YxForm.validate((vd) => {
						if (vd) {
							// 规则校验通过
							this.addActivities()
						}
					})
				}
			})
		},
		async addActivities() {
			let params = {
				activityType: 1,
				activityName: this.form.activityName,
				activityRemark: this.formData.activityRemark,
				startTime:
					this.activityStatus == 1 && this.status == 1
						? moment(this.form.actStartTime).valueOf()
						: moment(this.form.time[0]).valueOf(),
				endTime:
					this.activityStatus == 1 && this.status == 1
						? moment(this.form.actEndTime).valueOf()
						: moment(this.form.time[1]).valueOf(),
				userName: this.$store.state.user.userInfo.clerkName,
			}
			params.businessExpensesProportion = this.form.businessExpensesProportion
			params.costBudget = this.form.costBudget
			params.departmentBudget = this.form.departmentBudget

			if (this.newActivitiesRow.id) {
				params.id = this.newActivitiesRow.id
			}
			if (this.formData.mainPicUrl && this.formData.mainPicUrl.length) {
				params.mainPicUrl = this.formData.mainPicUrl[0].imageUrl
			} else {
				params.mainPicUrl = ''
			}
			if (
				this.formData.activityBillUrl &&
				this.formData.activityBillUrl.length
			) {
				params.activityBillUrl = this.formData.activityBillUrl[0].imageUrl
			} else {
				params.activityBillUrl = ''
			}
			if (this.formData.billRequestUrl) {
				params.billRequestUrl = this.formData.billRequestUrl
			}
			if (this.removeRuleIdList.length) {
				params.removeRuleIdList = this.removeRuleIdList
			}

			params.ruleBeanList = this.form.list.map((item) => {
				let obj = {}
				if (item.id) {
					obj.id = item.id
				}
				obj.rewardType = 1 //rewardType: 1:销售分，2：现金
				obj.ruleType = item.ruleType
				if (item.resource == 1) {
					obj.amountFactor = item.amountFactor
					obj.fixedAmount = 0
				} else if (item.resource == 2) {
					obj.fixedAmount = item.fixedAmount
					obj.amountFactor = 0
				} else if (item.resource == 3) {
					obj.fixedAmount = item.cash
					obj.amountFactor = 0
					obj.rewardType = 2
				} else if (item.resource == 4) {
					obj.fixedAmount = 0
					obj.amountFactor = item.commissionRatio
					obj.rewardType = 3
				}
				if (item.ruleType == 1 && item.notGroup) {
					obj.targetBeanList = item.notGroup.map((ite) => {
						return {
							removeTargetType: 2,
							targetId: ite.goodsGroupId,
							targetName: ite.groupName,
							goodsGroupId: ite.goodsGroupId || null,
							vectorType: 0,
						}
					})
				} else if (item.ruleType == 2) {
					// //在档期中剔除商品
					if (
						item?.inGoods?.length > 0 ||
						item?.eliminateGoodsInfoList?.length > 0
					) {
						if (item?.inGoods?.length > 0) {
							obj.eliminateGoodsInfoList = item.inGoods.map((ite) => {
								return {
									goodsId: ite.goodsId,
									goodsGroupId: ite.goodsGroupId,
								}
							})
						} else {
							obj.eliminateGoodsInfoList = item.eliminateGoodsInfoList.map(
								(ite) => {
									return {
										goodsId: ite.goodsId,
										goodsGroupId: ite.goodsGroupId,
									}
								}
							)
						}
					}
					obj.targetBeanList = item.inGroup.map((ite) => {
						return {
							removeTargetType: 0,
							targetId: ite.goodsGroupId,
							targetName: ite.groupName,
							goodsGroupId: ite.goodsGroupId || null,
							vectorType: 1,
						}
					})
				} else if (item.ruleType == 3) {
					obj.targetBeanList = item.inGoods.map((ite) => {
						return {
							removeTargetType: 0,
							targetId: ite.goodsId,
							targetName: ite.goodsName,
							goodsGroupId: ite.goodsGroupId || null,
							vectorType: 1,
							targetSnapshotId: ite.targetSnapshotId || ite.goodsSnapshotId,
						}
					})
				}
				return obj
			})
			console.log('入参：', params)
			// return
			let {
				data: { resultCode },
			} = this.newActivitiesRow.id
				? await modifyActivityReward(params)
				: await saveActivityReward(params)
			if (resultCode == 0) {
				this.$emit('refit')
				this.$message.success('保存成功')
				this.localVisible = false
			}
		},
		async uploadImageHttpRequest(params, type) {
			//上传海报
			let formData = new FormData()

			formData.append(
				'data',
				JSON.stringify({ formId: '#portraitImageFrom', imageType: 34 })
			)
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			if (resultCode == 0) {
				if (type == 'mainPicUrl') {
					this.formData.mainPicUrl = resultData.imageList
					this.formData.mainPicUrl[0].mainPicUrl = getBigImg(
						resultData.imageList[0].imageUrl
					)
				} else if (type == 'activityBillUrl') {
					this.formData.activityBillUrl = resultData.imageList
					this.formData.activityBillUrl[0].activityBillUrl = getBigImg(
						resultData.imageList[0].imageUrl
					)
				}

				// this.$set(this.formData106, 'mainPicUrl', resultData.imageList)
			}
			this.$forceUpdate()
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			// this.$refs.form.$refs.YxForm.resetFields()
		},
		saveBrand() {
			this.localVisible = false
		},
		findIndex(row) {
			// 判断是否已经添加用户
			let ids = this.selectGroupList.map((item) => {
				return item.goodsGroupId
			})
			return ids.indexOf(row.goodsGroupId) == -1
		},
		editUserList(row) {
			// 添加/移除用户
			let ids = this.selectGroupList.map((item) => {
				return item.goodsGroupId
			})
			if (ids.indexOf(row.goodsGroupId) == -1) {
				this.selectGroupList.push(row)
			} else {
				this.selectGroupList.splice(ids.indexOf(row.goodsGroupId), 1)
			}
		},
		findUserParams(flag) {
			// 用户搜索条件
			let paramJson = Object.assign(this.dialogData, {
				startIndex: 0,
				length: 1,
				groupId: 2,
				goodsGroupStateList: ['1', '2'],
				gcategoryList: ['1'],
			})
			// 每页的加载数据长度
			paramJson.length = this.tialogPage.length
			// 当前页的条数开始
			if (flag) {
				this.tialogPage.currentPage = 1
			}
			paramJson.startIndex =
				(this.tialogPage.currentPage - 1) * this.tialogPage.length
			return paramJson
		},
		async _getGoodsGroupListByConditionForCMS(flag) {
			// 用户列表
			this.showLoading = true
			let paramJson = this.findUserParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getGoodsGroupListByConditionForCMS(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tialogData = resultData.goodsGroupList
				this.tialogPage.count = resultData.goodsGroupCount
				this.currentTime = resultData.currentTime
			} else {
				this.tialogPage.count = 0
				this.tialogData = []
			}
		},
	},
}
</script>
<style lang="scss" scoped>
.box-item {
	border: 1px solid #ccc;
	border-radius: 10px;
	background: rgb(242, 242, 242);
	padding: 0 10px;
	box-sizing: border-box;
	margin-bottom: 10px;
}
.inline-form-item .el-form-item--small.el-form-item {
	margin-bottom: 0;
}
.inline-form-item ::v-deep .el-form-item__content {
	.el-form-item {
		display: inline-block;
	}
	.el-form-item__error {
		white-space: nowrap;
	}
}
</style>
<style>
.yxDialog .el-dialog .el-dialog__body {
	max-height: 700px !important;
}
</style>

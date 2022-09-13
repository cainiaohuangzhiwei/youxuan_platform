<template>
	<div>
		<el-dialog
			width="600px"
			:title="`${title}`"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="open"
		>
			<yx-form
				ref="form"
				v-loading="loading"
				labelWidth="100px"
				:items="item"
				:rules="funRules"
				:data="formData"
				:formAction="formAction"
				:formDisabled="disabledForm"
			>
				<template slot="actRuleAmount">
					<el-input
						type="number"
						class="wi100"
						:disabled="disabledRule"
						v-model="formData.actRuleAmount"
						autocomplete="off"
					></el-input
					>&nbsp;件&nbsp;<el-input
						type="number"
						class="wi100"
						:disabled="disabledRule"
						v-model="formData.actRuleCash"
						autocomplete="off"
					></el-input
					>&nbsp;元
				</template>

				<template slot="groupName">
					<div>
						<div>
							<el-button @click="handleAdd" size="small" type="text"
								>+添加档期</el-button
							>
							<div>
								<span v-for="(item, index) in selectGroupList" :key="index"
									>{{ item.groupName
									}}{{ selectGroupList.length - 1 != index ? '、' : '' }}</span
								>
							</div>
						</div>
					</div>
				</template>
				<!-- <template slot="businessExpensesProportion">
					商家承担&nbsp;<el-input
						onkeyup="if(value.length>5)value=value.slice(0,3);this.v=function(){this.value=this.value.replace(/-/g,'');}.call(this)"
						type="number"
						class="wi100"
						:disabled="disabledTrue"
						max="100"
						min="0"
						v-model="formData.businessExpensesProportion"
						autocomplete="off"
						@input="businessExpensesChange"
					></el-input
					>&nbsp;% 平台承担&nbsp;<el-input
						type="number"
						class="wi100"
						v-model="formData.undertake"
						autocomplete="off"
						disabled
					></el-input
					>&nbsp;%
				</template> -->
				<!-- 旧数据 编辑，有信息展示 -->
				<template
					v-if="actMorePromotionId && formData.isNewData == 0"
					slot="businessExpensesProportion"
				>
					<el-form-item label="费用归属" prop="businessExpensesProportion">
						商家承担&nbsp;<el-input
							onkeyup="if(value.length>5)value=value.slice(0,3);this.v=function(){this.value=this.value.replace(/-/g,'');}.call(this)"
							type="number"
							class="wi100"
							:disabled="disabledTrue"
							max="100"
							min="0"
							v-model="formData.businessExpensesProportion"
							autocomplete="off"
							@input="businessExpensesChange"
						></el-input
						>&nbsp;% 平台承担&nbsp;<el-input
							type="number"
							class="wi100"
							v-model="formData.undertake"
							autocomplete="off"
							disabled
						></el-input
						>&nbsp;%
					</el-form-item>
				</template>
			</yx-form>
			<GoodsGroupDialog
				:itemInfo="couponRow"
				:row="row"
				:visible.sync="formsDialog"
				@saveBrand="saveBrand"
			/>
		</el-dialog>
	</div>
</template>

<script>
import moment from 'moment'
import {
	saveActMorePromotion,
	updateActMorePromotion,
} from '@/api/yhtPlusCmsActMorePromotion'
import YxForm from '@wg-vue-materials/yx-form'
import GoodsGroupDialog from '../components/GoodsGroupDialog'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: '',
		},
		row: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm,
		GoodsGroupDialog,
	},

	data() {
		return {
			selectGroupList: [],
			couponRow: [],
			disabledForm: false,
			disabledTrue: false,
			disabledRule: false,
			formData: {
				actName: '', //活动名称
				startTime: '', //活动开始时间
				endTime: '', //活动结束时间
				actRuleAmount: '', //活动规则
				actRuleCash: '', //活动规则
				goodsGroupIdList: [], // 档期
				businessExpensesProportion: '', //费用归属
				undertake: '',
				isNewData: 1,
			},
			couponIds: [],
			fileToUpload: '',
			item: [
				{
					type: 'input',
					title: '活动名称	',
					dataIndex: 'actName',
				},
				{
					title: '活动时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					type: 'custom',
					dataIndex: 'actRuleAmount',
					title: '活动规则',
				},
				{
					type: 'custom',
					dataIndex: 'groupName',
					title: '参加档期',
					disabled: true,
				},
				{
					type: 'custom',
					unformItem: true,
					dataIndex: 'businessExpensesProportion',
					title: '费用归属',
				},
			],
			loading: false,
			formsDialog: false,
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this._updateCoupon()
					},
				},
				{
					title: '取消',
					type: 'default',
					cancel: true,
					click: () => {
						this.localVisible = false
					},
				},
			],
			funRules: {
				groupName: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (this.selectGroupList && !this.selectGroupList.length) {
								callback(new Error('请选择参加档期'))
							}
							callback()
						},
						trigger: ['blur', 'change'],
					},
				],
				actName: [
					{ required: true, message: '请输入活动名称!', trigger: 'blur' },
				],
				startTime: [
					{ required: true, message: '请输入活动开始时间!', trigger: 'blur' },
				],
				endTime: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入活动结束时间!'))
							} else if (value < this.formData.startTime) {
								callback(new Error('结束时间必须大于开始时间!'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
					{ required: true, message: '请输入活动结束时间!', trigger: 'blur' },
				],
				actRuleAmount: [
					{ required: true, message: '请输入活动规则!', trigger: 'blur' },
				],
				actRuleCash: [
					{ required: true, message: '请输入活动规则!', trigger: 'blur' },
				],
				// businessExpensesProportion: [
				// 	{ required: true, message: '请输入费用归属!', trigger: 'blur' },
				// ],
			},
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

	methods: {
		businessExpensesChange() {
			if (this.formData.businessExpensesProportion) {
				this.formData.undertake = 100 - this.formData.businessExpensesProportion
			}
			console.log('=====', this.formData.undertake)
		},
		handleAdd() {
			this.couponRow = JSON.parse(JSON.stringify(this.selectGroupList))
			this.formsDialog = true
		},
		saveBrand(selectGroupList) {
			this.selectGroupList = selectGroupList
		},
		//保存
		async _updateCoupon() {
			this.formData.supplierId = this.selectGroupList[0].supplierId
			this.formData.goodsGroupIdList = this.selectGroupList.map((item) => {
				return item.goodsGroupId
			})
			let paramsData = this.formData
			if (paramsData.businessExpensesProportion > 100) {
				this.$message.warning('商家承担不可大于100%')
				return
			}
			if (paramsData.actRuleAmount > 200 || paramsData.actRuleAmount < 2) {
				this.$message.warning('件数最多为200且须大于1')
				return
			}
			if (!/^[1-9]\d*$/.test(paramsData.actRuleAmount)) {
				this.$message.warning('件数只能输入正整数')
				return
			}
			if (paramsData.actRuleCash <= 0) {
				this.$message.warning('金额必须大于0')
				return
			}
			console.log('paramJson', this.title)

			let addUrl
			if (this.title == '编辑活动') {
				paramsData.actMorePromotionId = this.actMorePromotionId
				addUrl = updateActMorePromotion
			} else {
				addUrl = saveActMorePromotion
			}
			this.$alert(
				`
				<h4>请确认活动信息准确，活动开始后不可更改</h4>
				<div><strong>活动规则</strong>：${paramsData.actRuleAmount || '-'}件${
					paramsData.actRuleCash
				}元</div>
				<div><strong>活动时间</strong>：${moment(paramsData.startTime).format(
					'YYYY-MM-DD HH:mm'
				)} ~ ${moment(paramsData.endTime).format('YYYY-MM-DD HH:mm')}</div>
						`,
				'提示',
				{
					dangerouslyUseHTMLString: true,
					callback: async (action) => {
						if (action === 'confirm') {
							this.loading = true
							delete paramsData.undertake
							let res = await addUrl(paramsData)
							let resultCode = res.data.resultCode
							if (resultCode == 0) {
								this.$message({
									message: '操作成功',
									type: 'success',
								})
								this.localVisible = false
								this.$emit('initTable')
							}
							this.loading = false
						}
					},
				}
			)
		},
		resetForm() {
			this.localVisible = false
		},
		async open() {
			this.$refs.form && this.$refs.form.$refs.YxForm.resetFields()
			this.loading = false
			this.formData.actName = ''
			this.formData.endTime = ''
			this.formData.startTime = ''
			this.formData.actRuleAmount = ''
			this.formData.actRuleCash = ''
			this.formData.goodsGroupIdList = []
			this.formData.businessExpensesProportion = ''
			this.formData.undertake = ''
			this.formData.isNewData = 1
			this.selectGroupList = []
			this.disabledForm = false
			this.disabledTrue = false
			this.disabledRule = false
			if (this.row.actMorePromotionId) {
				this.actMorePromotionId = this.row.actMorePromotionId
				this.selectGroupList = this.row.actMorePromotionRelationList.map(
					(item) => {
						return {
							goodsGroupId: item.goodsGroupId,
							groupName: item.groupName,
							supplierId: item.supplierId,
						}
					}
				)
				if (this.row.actGroupOrderList.length) {
					this.disabledRule = true
				}
				this.formData.actName = this.row.actName //活动名称
				this.formData.startTime = this.row.startTime //活动开始时间
				this.formData.endTime = this.row.endTime //活动结束时间
				this.formData.actRuleAmount = this.row.actRuleAmount //活动规则
				this.formData.actRuleCash = this.row.actRuleCash //活动规则
				this.disabledTrue = true

				this.formData.businessExpensesProportion =
					this.row.businessExpensesProportion //费用归属
				this.formData.undertake = 100 - this.row.businessExpensesProportion
				// 区分新旧
				this.formData.isNewData = this.row.isNewData
				// 旧数据查看不能编辑
				if (this.row.isNewData == 0 || this.row.actState == 2) {
					this.disabledForm = true
				}
				console.log('this.formData', this.formData, this.disabledForm)
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.wi100 {
	width: 100px;
}
</style>

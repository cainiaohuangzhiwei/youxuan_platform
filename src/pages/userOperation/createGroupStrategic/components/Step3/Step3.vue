<template>
	<div>
		<WgForm
			ref="form"
			:actionInline="true"
			labelWidth="8em"
			:data="formData"
			:items="formCfg"
			:rules="rules"
		>
			<!-- 派发执行 -->
			<template slot="deliveryTime">
				<el-date-picker
					v-model="formData.deliveryTime"
					value-format="timestamp"
					format="yyyy-MM-dd HH:mm"
					type="datetime"
					placeholder="选择日期时间"
					default-time="11:00:00"
					:disabled="disabled"
					:picker-options="{
						disabledDate: (time) => {
							return time.getTime() < Date.now() - 8.64e7
						},
					}"
				/>
			</template>

			<!-- 奖品类型选择 -->
			<template #uoAwardList>
				<div>
					<div v-if="formData.uoAwardList && formData.uoAwardList.length">
						<el-tag
							:key="i"
							v-for="(tag, i) in formData.uoAwardList"
							:closable="!disabled"
							:disable-transitions="false"
							@close="deleteCouponItem(tag)"
							class="tagItem"
						>
							{{
								tag.awardType === AWARD_TYPE.COUPON
									? `【优惠券】${tag.couponName}`
									: tag.couponName
							}}
						</el-tag>
					</div>
					<el-button
						@click="selectAwardType"
						type="primary"
						icon="el-icon-plus"
						size="mini"
						:disabled="disabled"
					>
						选择奖励（可多选）
					</el-button>
				</div>
			</template>

			<!-- 触达类型选择 -->
			<template #uoMessageList>
				<div>
					<div v-if="formData.uoMessageList && formData.uoMessageList.length">
						<el-tag
							:key="i"
							v-for="(tag, i) in formData.uoMessageList"
							:closable="!disabled"
							:disable-transitions="false"
							@close="deleteMessageItem(tag)"
							class="tagItem"
						>
							{{
								tag.messageType === REACH_TYPE.SMS
									? `【短信】${tag.messageName}`
									: `【模板消息】${tag.messageName}`
							}}
						</el-tag>
					</div>
					<el-button
						@click="selectUoMessageList"
						type="primary"
						icon="el-icon-plus"
						size="mini"
						:disabled="disabled"
					>
						选择触达（可多选）
					</el-button>
				</div>
			</template>
		</WgForm>

		<!-- 选择奖励、触达类型 -->
		<Dialog
			:title="selectTypeTitle"
			:visible.sync="selectTypeVisible"
			width="400px"
		>
			<WgForm
				ref="selectTypeForm"
				labelWidth="6em"
				class="selectTypeForm"
				:data="selectTypeData"
				:items="selectTypeItems"
			>
			</WgForm>
			<el-button type="primary" class="btns" @click="confirmSelectType"
				>下一步</el-button
			>
			<el-button class="btns" @click="hideSelectTypeDialog">取消</el-button>
		</Dialog>

		<!-- 新建任务 -->
		<EditDialog
			title="新建任务"
			:visible.sync="pushDialog"
			:createTaskShow="true"
			@fatherMethod="createTempMessageCallback"
			:forbiddenShow="false"
			:itemInfo.sync="editTempMessageItem"
			source="BULLET_USER_OPERATION"
		></EditDialog>

		<!-- 选择优惠券 -->
		<CouponsSelect
			:visible.sync="conponsDialog"
			:couponList="defaultCouponList"
			@saveCallback="saveCouponsCallback"
		></CouponsSelect>

		<!-- 选择短信 -->
		<SmsSelect
			:visible.sync="smsDialog"
			:smsList="defaultMessageList"
			@saveCallback="saveSmsCallback"
		></SmsSelect>
	</div>
</template>

<script>
import WgForm from '@/components/WgForm'
import Dialog from '@/components/Dialog'
import CouponsSelect from './CouponsSelect'
import SmsSelect from './SmsSelect'
import EditDialog from '../../../../messageCenter/subscribeManagement/components/EditDialog'
import {
	TRIGGER_TYPE,
	SEND_TYPE,
	EDIT_TYPE,
	AWARD_TYPE,
	REACH_TYPE,
} from '../constants.js'

export default {
	name: 'Step3',
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
		strategyConfig: {
			type: Object,
			default: () => ({}),
		},
	},
	components: {
		WgForm,
		Dialog,
		EditDialog,
		CouponsSelect,
		SmsSelect,
	},
	data() {
		return {
			// 选择类型
			selectType: '',
			selectTypeTitle: '',
			selectTypeVisible: false,
			EDIT_TYPE,
			AWARD_TYPE,
			REACH_TYPE,
			awardDatas: {
				awardType: AWARD_TYPE.COUPON,
			},
			// 选择弹窗回显数据
			defaultCouponList: [],
			// 选择短信回显数据
			defaultMessageList: [],
			reachDatas: {
				messageType: REACH_TYPE.SMS,
			},
			awardItems: [
				{
					title: '奖励类型：',
					dataIndex: 'awardType',
					type: 'radio',
					label: 'text',
					options: [
						{
							text: '优惠券',
							awardType: AWARD_TYPE.COUPON,
						},
					],
				},
			],
			reachItems: [
				{
					title: '触达类型：',
					dataIndex: 'messageType',
					type: 'radio',
					label: 'text',
					options: [
						{
							text: '短信',
							messageType: REACH_TYPE.SMS,
						},
						{
							text: '模板消息',
							messageType: REACH_TYPE.TEMPLATE,
						},
					],
				},
			],

			// 选择弹窗
			formCfg: [
				{
					title: '营销时间',
					type: 'radio',
					dataIndex: 'sendType',
					disabled: this.disabled,
					label: 'value',
					change: (val) => {
						this.filterFormCol({
							...this.formData,
							sendType: val,
						})
					},
					options: [
						{
							sendType: SEND_TYPE.IMMEDIATELY,
							value: '实时发送',
						},
						{
							sendType: SEND_TYPE.TIMING,
							value: '特定时间点',
						},
					],
				},
				{
					title: '派发时间',
					type: 'custom',
					dataIndex: 'deliveryTime',
				},
				{
					title: '奖励内容',
					type: 'custom',
					dataIndex: 'uoAwardList',
				},
				{
					title: '触达内容',
					type: 'custom',
					dataIndex: 'uoMessageList',
				},
			],
			rules: {
				sendType: [
					{ required: true, message: '请选择营销时间', trigger: 'change' },
				],
				deliveryTime: [
					{ required: true, message: '请选择派发时间', trigger: 'change' },
				],
			},
			formData: {
				sendType: SEND_TYPE.IMMEDIATELY,
				deliveryTime: '',
				uoAwardList: [],
				uoMessageList: [],
			},

			// 新建消息推送模板
			pushDialog: false,
			editTempMessageItem: {},

			// 选择优惠券弹窗
			conponsDialog: false,

			// 选择短信
			smsDialog: false,
		}
	},
	mounted: function () {
		this.initFormData()
	},
	watch: {
		strategyConfig() {
			this.initFormData()
		},
	},
	methods: {
		initFormData() {
			this.formData = {
				...this.formData,
				...this.strategyConfig,
				uoMessageList: this.strategyConfig.uoMessageList || [],
			}
			this.filterFormCol(this.formData)
		},
		// 过滤表单配置
		filterFormCol(row) {
			// 触发类型切换
			if (row.triggerType === TRIGGER_TYPE.ACTION) {
				this.formCfg = this.formCfg.map((item) => {
					if (item.dataIndex === 'sendType') {
						item.hide = false
					}
					return item
				})

				if (row.sendType === SEND_TYPE.TIMING) {
					this.formCfg = this.formCfg.map((item) => {
						if (item.dataIndex === 'deliveryTime') {
							item.hide = false
						}
						return item
					})
				} else {
					this.formCfg = this.formCfg.map((item) => {
						if (item.dataIndex === 'deliveryTime') {
							item.hide = true
						}
						return item
					})
				}
			} else {
				this.formCfg = this.formCfg.map((item) => {
					if (
						item.dataIndex === 'sendType' ||
						item.dataIndex === 'deliveryTime'
					) {
						item.hide = true
					}
					return item
				})
			}
		},
		// 选择奖励
		selectAwardType() {
			this.selectTypeTitle = '奖励类型'
			this.selectTypeData = this.awardDatas
			this.selectTypeItems = this.awardItems
			this.selectType = EDIT_TYPE.AWARD
			this.selectTypeVisible = true
		},
		// 选择触达
		selectUoMessageList() {
			this.selectTypeTitle = '触达类型'
			this.selectTypeData = this.reachDatas
			this.selectTypeItems = this.reachItems
			this.selectType = EDIT_TYPE.REACH
			// this.selectTypeVisible = true

			// 只有短信模板
			this.selectTypeData.messageType = REACH_TYPE.TEMPLATE
			this.pushDialog = true
		},

		// 关闭弹窗
		hideSelectTypeDialog() {
			this.selectTypeVisible = false
		},
		// 下一步
		confirmSelectType() {
			// 选择奖励类型
			if (this.selectType === EDIT_TYPE.AWARD) {
				// 选择优惠券
				this.conponsDialog = true
				this.selectTypeVisible = false
				// 处理优惠券回显
				this.defaultCouponList =
					(this.formData.uoAwardList &&
						this.formData.uoAwardList.map((item) => ({
							...item,
							yxCouponId: item.awardRefId,
						}))) ||
					[]
			} else if (this.selectType === EDIT_TYPE.REACH) {
				this.selectTypeVisible = false
				if (this.selectTypeData.messageType === REACH_TYPE.SMS) {
					// 选择短信
					this.smsDialog = true
					this.defaultMessageList = this.formData.uoMessageList.filter(
						(item) => item.messageType === REACH_TYPE.SMS
					)
				} else if (this.selectTypeData.messageType === REACH_TYPE.TEMPLATE) {
					// 选择推送模板
					this.pushDialog = true
				}
			}
		},
		// 选择优惠券回调赋值
		saveCouponsCallback(val) {
			this.formData.uoAwardList = val.map((item) => ({
				awardType: AWARD_TYPE.COUPON,
				awardRefId: item.yxCouponId,
				couponName: item.couponName,
			}))
		},
		// 选择短信回调
		saveSmsCallback(val) {
			this.formData.uoMessageList = val.map((item) => ({
				messageType: REACH_TYPE.SMS,
				templateId: item.templateId,
				messageName: item.templateName,
			}))
		},
		submitForm() {
			// 校验表单
			return new Promise((resolve, reject) => {
				this.$refs.form.$refs.WgForm.validate((valid) => {
					if (valid) {
						resolve(this.formData)
					} else {
						reject(new Error('校验失败'))
					}
				})
			})
		},
		saveForm() {
			// 校验表单
			return new Promise((resolve) => {
				resolve(this.formData)
			})
		},
		// 新建消息回调
		createTempMessageCallback(msg) {
			this.formData.uoMessageList.push({
				messageType: REACH_TYPE.TEMPLATE,
				templateId: msg.templateId,
				taskId: msg.taskId,
				messageName: msg.taskName,
			})
		},
		// 删除部分选中
		deleteCouponItem(tag) {
			this.formData.uoAwardList.splice(
				this.formData.uoAwardList.indexOf(tag),
				1
			)
		},
		deleteMessageItem(tag) {
			this.formData.uoMessageList.splice(
				this.formData.uoMessageList.indexOf(tag),
				1
			)
		},
	},
}
</script>

<style>
.btns {
	float: right;
	margin-right: 10px;
}

.cronExpression {
	margin: 10px 0;
}
</style>

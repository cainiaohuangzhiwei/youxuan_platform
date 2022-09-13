/* eslint-disable no-dupe-else-if */
<template>
	<div>
		<el-dialog
			width="800px"
			:title="
				(editRow.isCheck ? '查看' : editRow.yxCouponId ? '编辑' : '新增') +
				(editRow.couponType == 1
					? '平台购物券'
					: editRow.couponType == 2
					? '品牌券'
					: '优选券')
			"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<yx-form
				ref="form"
				v-loading="showLoading"
				:inline="false"
				:items="formItem"
				:data="formData"
				:rules="formRules"
				labelWidth="120px"
				:formAction="formAction"
				:formDisabled="editRow.isCheck"
			>
				<template #title1>
					<h3 class="coupon-title">基础信息</h3>
				</template>
				<template #title2>
					<h3 class="coupon-title">领取和使用规则</h3>
				</template>
				<template #typeExt>
					<el-radio
						v-model="formData.typeExt"
						label="1"
						:disabled="editRow.yxCouponId"
						><span>减</span
						><el-input
							:disabled="editRow.yxCouponId"
							v-model.trim="formData.moneyAmount"
							style="width: 80px; margin-left: 10px"
						></el-input
						>&nbsp;元</el-radio
					>
					<el-radio
						v-if="
							editRow.yxCouponId &&
							editRow.isNewData == 0 &&
							editRow.typeExt == 2
						"
						v-model="formData.typeExt"
						label="2"
						:disabled="editRow.yxCouponId"
						><span>打</span
						><el-input
							v-model.trim="formData.typeExtAmount"
							:disabled="editRow.yxCouponId"
							style="width: 80px; margin-left: 10px"
						></el-input
						>&nbsp;折</el-radio
					>
				</template>
				<template #limitType>
					<el-radio
						v-model="formData.limitType"
						label="1"
						:disabled="editRow.yxCouponId"
						><span>满</span
						><el-input
							:disabled="editRow.yxCouponId"
							v-model.trim="formData.limitAmount"
							style="width: 80px; margin-left: 10px"
						></el-input
						>&nbsp;元</el-radio
					>
					<el-radio
						v-model="formData.limitType"
						label="3"
						:disabled="editRow.yxCouponId"
						><span>满</span
						><el-input
							:disabled="editRow.yxCouponId"
							v-model.trim="formData.floorCount"
							style="width: 80px; margin-left: 10px"
						></el-input
						>&nbsp;件</el-radio
					>
				</template>
				<template #expiryDateType>
					<div style="margin-bottom: 10px">
						<el-radio
							v-model="formData.expiryDateType"
							label="1"
							:disabled="editRow.yxCouponId"
						>
							<div
								style="display: contents"
								v-if="editRow.yxCouponId && isDisableStartTimeSelect"
							>
								<el-date-picker
									v-model="formData.time[0]"
									type="datetime"
									placeholder="选择开始日期"
									align="right"
									:picker-options="pickerOptions"
									:disabled="isDisableStartTimeSelect"
								>
								</el-date-picker>
								至
								<el-date-picker
									v-model="formData.time[1]"
									type="datetime"
									placeholder="选择结束日期"
									align="right"
									:picker-options="pickerOptions"
								>
								</el-date-picker>
							</div>
							<el-date-picker
								v-else
								v-model="formData.time"
								type="datetimerange"
								:picker-options="endDayOptions"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								:default-time="[hms, '23:59:59']"
							>
							</el-date-picker>
						</el-radio>
					</div>
					<div>
						<el-radio v-model="formData.expiryDateType" label="2"
							><span>自领取起</span
							><el-input
								v-model.trim="formData.expiryDate"
								style="width: 80px; margin-left: 10px"
							></el-input
							>&nbsp;天内有效</el-radio
						>
					</div>
				</template>
				<template #range>
					<!-- 平台购物券 或者旧数据编辑展示 -->
					<el-radio
						v-if="formData.couponType == 1"
						v-model="formData.range"
						label="0"
						>全场通用</el-radio
					>
					<el-radio v-model="formData.range" label="1"
						>指定档期&nbsp;<el-button type="text" @click="handleAdd()"
							>添加档期</el-button
						></el-radio
					>
					<el-radio v-model="formData.range" label="3"
						>指定商品&nbsp;<el-button type="text" @click="handleCommodity()"
							>添加商品</el-button
						></el-radio
					>
					<div v-if="formData.range == 1">
						<span v-for="(item, index) in selectGroupList" :key="index"
							>{{ item.groupName
							}}{{ selectGroupList.length - 1 != index ? '、' : '' }}</span
						>
					</div>
					<div v-if="formData.range == 3">
						<span>已添加{{ selectCommodityList.length }}个商品</span>
					</div>
					<p v-if="formData.typeExt == 2">
						（全场通用与指定多品牌的优惠券可支持跨场使用，请谨慎设置避免营销费用超额）
					</p>
				</template>
				<template #usePermission>
					<el-radio
						v-model="formData.usePermission"
						label="1"
						:disabled="editRow.yxCouponId"
						>仅领券店主下可使用</el-radio
					>
					<el-radio
						v-model="formData.usePermission"
						label="2"
						:disabled="editRow.yxCouponId"
						>所有店主下可使用</el-radio
					>
				</template>
				<template #give>
					<el-radio
						v-model="formData.give"
						label="2"
						:disabled="editRow.yxCouponId"
						>转赠和自用</el-radio
					>
					<el-radio
						v-model="formData.give"
						label="0"
						:disabled="editRow.yxCouponId"
						>自用</el-radio
					>
					<el-radio
						v-model="formData.give"
						label="1"
						:disabled="editRow.yxCouponId"
						>转赠</el-radio
					>
				</template>
				<template #receivePermission>
					<el-radio
						v-model="formData.receivePermission"
						label="1"
						:disabled="editRow.yxCouponId"
						>平台用户可领取</el-radio
					>
					<el-radio
						v-model="formData.receivePermission"
						label="2"
						:disabled="editRow.yxCouponId"
						>仅C端用户可领取</el-radio
					>
				</template>
				<template
					v-if="editRow.couponType == 1"
					slot="businessExpensesProportion"
				>
					<el-form-item label="费用归属" prop="businessExpensesProportion">
						<span>商家承担</span>
						<el-input
							:disabled="editRow.yxCouponId"
							v-model.trim="formData.businessExpensesProportion"
							style="width: 80px; margin-left: 10px"
						></el-input
						>&nbsp;%
					</el-form-item>
				</template>
				<template #grantQuantity>
					<el-input
						:disabled="editRow.yxCouponId"
						v-model.trim="formData.grantQuantity"
						style="width: 80px; margin-left: 10px"
					></el-input
					>&nbsp;张
				</template>
				<template #limitCount>
					<el-input
						v-model.trim="formData.limitCount"
						style="width: 80px; margin-left: 10px"
					></el-input
					>&nbsp;张
				</template>
				<template #limitDaily>
					<el-input
						v-model.trim="formData.limitDaily"
						style="width: 80px; margin-left: 10px"
					></el-input
					>&nbsp;张
				</template>
				<template #userRank>
					<el-radio v-model="formData.userRank" label="0">平台用户</el-radio>
					<el-radio v-model="formData.userRank" label="1">店主</el-radio>
					<el-radio v-model="formData.userRank" label="2">C端用户</el-radio>
				</template>
				<template #coupionContent>
					<el-input
						type="textarea"
						v-model.trim="formData.coupionContent"
						maxlength="200"
						:autosize="{ minRows: 2, maxRows: 4 }"
						placeholder="请输入活动描述内容"
					></el-input>
				</template>
			</yx-form>
		</el-dialog>
		<add-brand-dialog
			:visible.sync="dialogBrandVisible"
			:rangeExt="rangeExt"
			:listData="listData"
			@saveBrand="saveBrand"
		></add-brand-dialog>
		<add-commodity-dialog
			:visible.sync="dialogCommodityVisible"
			:commodityExt="commodityExt"
			:listData="listData"
			@saveCommodity="saveCommodity"
		></add-commodity-dialog>
		<el-dialog
			title="设置的是全场通用券，请仔细核信息"
			:visible.sync="checkPopUp"
			width="400px"
			:close-on-click-modal="false"
		>
			<div>优惠券名称：{{ formData.couponName }}</div>
			<div>发放总量：{{ formData.grantQuantity }}</div>

			<div>
				优惠券类型：{{
					formData.typeExt == 1
						? ' 减' + formData.moneyAmount + '元'
						: '打' + formData.typeExtAmount + '折'
				}}
			</div>
			<div>
				使用门槛：{{
					formData.limitType == 1
						? '满' + formData.limitAmount + '元'
						: '满' + formData.floorCount + '件'
				}}
			</div>
			<div>
				有效期：{{
					formData.expiryDateType == 1
						? moment(formData.time[0]).format('YYYY-MM-DD HH:mm:ss') +
						  '-' +
						  moment(formData.time[1]).format('YYYY-MM-DD HH:mm:ss')
						: '自领取起' + formData.expiryDate + '天内有效'
				}}
			</div>
			<el-button
				type="primary"
				style="float: right; margin-top: 60px"
				@click="dialogFormVisible = true"
				>确定</el-button
			>
		</el-dialog>
		<el-dialog
			title="优惠券可能存在折扣过低，请输入设置密码"
			:visible.sync="dialogFormVisible"
			width="400px"
			:close-on-click-modal="false"
		>
			<yx-form
				v-loading="passNode"
				ref="rsaform"
				:inline="false"
				:items="rsaitem"
				:data="rsaData"
				:rules="rules"
				labelWidth="60px"
				:formAction="rsaAction"
			>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import RSA from 'js-rsa-dave'
import YxForm from '@wg-vue-materials/yx-form'
import addBrandDialog from './addBrandDialog'
import addCommodityDialog from './addCommodityDialog'
import {
	addYxCouponInfoToYhtPlus,
	updateYxCouponInfoToYhtPlus,
	checkCouponPassword,
} from '@/api/coupon'
import { getPublicKeyAndModel } from '@/api/webUser.js'
import { highPrecisionMul, accDiv } from '@/utils/helper/common'
import moment from 'moment'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		editRow: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm,
		addBrandDialog,
		addCommodityDialog,
	},

	data() {
		return {
			moment,
			listData: {},
			selectCommodityList: [],
			dialogFormVisible: false,
			checkPopUp: false,
			showLoading: false,
			passNode: false,
			rangeExt: [],
			rangeExt2: [],
			selectGroupList: [],
			dialogBrandVisible: false,
			commodityExt: [],
			dialogCommodityVisible: false,
			endDayOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7
				},
			},
			hms: '',

			rsaitem: [
				{
					title: '密码',
					dataIndex: 'password',
					placeholder: '请输入密码',
				},
			],
			rsaData: {
				password: '',
			},
			rules: {
				password: [
					{
						required: true,
						message: '请输入密码!',
						trigger: ['blur', 'change'],
					},
				],
			},
			rsaAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.handlePass()
					},
				},
			],
			formItem: [
				{
					unformItem: true,
					dataIndex: 'title1',
					type: 'custom',
				},
				{
					title: '优惠券名称',
					dataIndex: 'couponName',
					placeholder: '优惠券名称',
				},
				{
					title: '发放总量',
					type: 'custom',
					dataIndex: 'grantQuantity',
				},
				{
					title: '优惠券类型',
					type: 'custom',
					dataIndex: 'typeExt',
				},
				{
					title: '使用门槛',
					type: 'custom',
					dataIndex: 'limitType',
				},
				{
					title: '有效时间',
					type: 'custom',
					dataIndex: 'expiryDateType',
				},
				{
					title: '使用范围',
					type: 'custom',
					dataIndex: 'range',
				},
				{
					title: '费用归属',
					type: 'custom',
					unformItem: true,
					dataIndex: 'businessExpensesProportion',
				},
				{
					unformItem: true,
					dataIndex: 'title2',
					type: 'custom',
				},
				{
					title: '使用方式',
					type: 'custom',
					dataIndex: 'give',
				},
				{
					title: '转赠领取权限',
					type: 'custom',
					dataIndex: 'receivePermission',
					hide: false,
				},
				{
					title: '使用权限',
					type: 'custom',
					dataIndex: 'usePermission',
				},
				{
					title: '可领用户',
					type: 'custom',
					dataIndex: 'userRank',
				},
				{
					title: '每人限领数量',
					type: 'custom',
					dataIndex: 'limitCount',
				},
				{
					title: '每人每日限领',
					type: 'custom',
					dataIndex: 'limitDaily',
				},
				{
					title: '活动描述',
					type: 'custom',
					dataIndex: 'coupionContent',
				},
			],
			formData: {
				...this.getForm(),
				time: [
					moment().startOf('day').valueOf(),
					moment().endOf('day').valueOf(),
				],
			},
			rateFirst: '',
			flag: null,
			formRules: {
				couponName: [
					{
						required: true,
						message: '请填写优惠券名称!',
						trigger: ['blur', 'change'],
					},
				],
				typeExt: [
					{
						required: true,
						validator: (rule, value, callback) => {
							let typeExtPattren = /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/
							// let typeExtTwoPattren = /^\d(\.\d{1,1})?$/
							let typeExtTwoPattren = /^((1\.[1-9]{1})|(([1-9]{1})(\.\d{1})?))$/
							if (!value) {
								callback(new Error('请选择优惠券类型'))
							}
							if (value == 2) {
								if (!this.formData.typeExtAmount) {
									callback(new Error('请填写优惠券折扣数'))
								} else if (
									!typeExtTwoPattren.test(this.formData.typeExtAmount)
								) {
									callback(new Error('请输入正确的格式'))
								}
							} else if (value == 1) {
								if (!this.formData.moneyAmount) {
									callback(new Error('请填写优惠券指定金额面值'))
								} else if (!typeExtPattren.test(this.formData.moneyAmount)) {
									callback(new Error('请输入正确的格式'))
								}
							}
							callback()
						},
						trigger: ['blur', 'change'],
					},
				],
				limitType: [
					{
						required: true,
						validator: (rule, value, callback) => {
							let limitAmountPattren = /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/
							let floorPattren = /^[1-9]\d*$/
							if (!value) {
								callback(new Error('请选择使用门槛'))
							}
							if (value == 1) {
								if (!this.formData.limitAmount) {
									callback(new Error('请填写优惠券使用门槛金额'))
								} else if (
									!limitAmountPattren.test(this.formData.limitAmount)
								) {
									callback(new Error('请输入正确的格式'))
								}
							} else if (value == 3) {
								if (!this.formData.floorCount) {
									callback(new Error('请填写优惠券使用门槛件数'))
								} else if (!floorPattren.test(this.formData.floorCount)) {
									callback(new Error('请输入正确的格式'))
								}
							}
							callback()
						},
						trigger: ['blur', 'change'],
					},
				],
				expiryDateType: [
					{
						required: true,
						validator: (rule, value, callback) => {
							let parttren = /^[1-9]\d*$/
							if (!value) {
								callback(new Error('请选择有效期'))
							}
							if (value == 1) {
								if (
									!this.formData.time ||
									(this.formData.time && !this.formData.time.length)
								) {
									callback(new Error('请选择有效期范围'))
								}
							} else if (value == 2) {
								if (!this.formData.expiryDate) {
									callback(new Error('请填写有效期天数'))
								} else if (!parttren.test(this.formData.expiryDate)) {
									callback(new Error('请输入正确的格式'))
								}
							}
							callback()
						},
						trigger: ['blur', 'change'],
					},
				],
				range: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请选择使用范围'))
							}
							if (value == 1) {
								if (this.selectGroupList && !this.selectGroupList.length) {
									callback(new Error('请选择指定档期'))
								}
							} else if (value == 3) {
								if (
									this.selectCommodityList &&
									!this.selectCommodityList.length
								) {
									callback(new Error('请选择指定商品'))
								}
							}
							callback()
						},
						trigger: ['blur', 'change'],
					},
				],
				usePermission: [
					{
						required: true,
						message: '请选择使用权限!',
						trigger: ['blur', 'change'],
					},
				],
				give: [
					{
						required: true,
						message: '请选择使用方式!',
						trigger: ['blur', 'change'],
					},
				],
				receivePermission: [
					{
						required: true,
						message: '请选择转赠领取权限!',
						trigger: ['blur', 'change'],
					},
				],
				businessExpensesProportion: [
					{
						required: true,
						message: '请填写正确格式!',
						trigger: 'blur',
						pattern: /^(?:0|[1-9][0-9]?|100)$/,
					},
				],
				grantQuantity: [
					{
						required: true,
						validator: (rule, value, callback) => {
							let limitCountParttren = /^[1-9]\d*$/
							if (!value) {
								callback(new Error('请填写发放总数'))
							} else if (!limitCountParttren.test(value)) {
								callback(new Error('请填写正确格式'))
							}
							callback()
						},
						trigger: ['blur', 'change'],
					},
				],
				limitCount: [
					{
						required: true,
						validator: (rule, value, callback) => {
							let limitCountParttren = /^[1-9]\d*$/
							if (!value) {
								callback(new Error('请填写每人限领数量'))
							} else if (!limitCountParttren.test(value)) {
								callback(new Error('请填写正确格式'))
							}
							callback()
						},
						trigger: ['blur', 'change'],
					},
				],
				limitDaily: [
					{
						required: true,
						validator: (rule, value, callback) => {
							let limitDailyParttren = /^[1-9]\d*$/
							if (!value) {
								callback(new Error('请填写每人每日限领'))
							} else if (!limitDailyParttren.test(value)) {
								callback(new Error('请填写正确格式'))
							}
							callback()
						},
						trigger: ['blur', 'change'],
					},
				],
				userRank: [
					{
						required: true,
						message: '请选择可领用户!',
						trigger: ['blur', 'change'],
					},
				],
				coupionContent: [
					{
						required: true,
						message: '请填写活动描述!',
						trigger: ['blur', 'change'],
					},
				],
			},
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
			],
			// 是否禁用开始时间
			isDisableStartTimeSelect: false,
		}
	},
	watch: {
		localVisible(val) {
			let date = new Date() //时间戳为10位需*1000，时间戳为13位的话不需乘1000
			let h = date.getHours() + ':'
			let m = date.getMinutes() + ':'
			let s = date.getSeconds()
			this.hms = h + m + s
			this.formData = this.getForm()
			this.showLoading = false
			this.passNode = false
			this.rsaData.password = ''
			this.$refs.form && this.$refs.form.$refs.YxForm.resetFields()
			this.$refs.rsaform && this.$refs.rsaform.$refs.YxForm.resetFields()
			if (!val) {
				this.editRow = {}
			} else {
				this.initFormData()
				this.isDisableTimePicker(this.formData.time[0])
			}
			console.log('this.formData----------', this.editRow)
		},
		formData: {
			handler: function (val) {
				this.formItem.forEach((item) => {
					if (item.dataIndex == 'receivePermission') {
						item.hide = val.give == 1 || val.give == 2 ? false : true
					}
				})
				// this.formItem[7].hide = val.give == 1 || val.give == 2 ? false : true
			},
			deep: true,
		},
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
		// 处理信息
		initFormData() {
			console.log(this.editRow, 'xxthis.editRowthis.editRow')
			this.selectGroupList = []
			this.selectCommodityList = []
			this.listData = {}
			// 编辑及复制
			if (this.editRow && (this.editRow.yxCouponId || this.editRow.isCopy)) {
				if (this.editRow.yxCouponId) {
					this.formData.isNewData = this.editRow.isNewData
				}
				this.formData.couponName = this.editRow.couponName
				this.formData.couponType = this.editRow.couponType
				this.formData.typeExt = this.editRow.typeExt.toString()
				if (this.editRow.typeExt == 1) {
					this.formData.moneyAmount = this.editRow.amount || ''
				} else {
					this.formData.typeExtAmount = this.editRow.amount
						? highPrecisionMul(this.editRow.amount, 10)
						: ''
				}
				this.formData.limitType = this.editRow.limitType.toString()
				this.formData.limitAmount = this.editRow.limitAmount || ''
				this.formData.floorCount = this.editRow.floorCount || ''
				this.formData.expiryDateType = this.editRow.expiryDateType.toString()
				if (this.formData.expiryDateType == 2) {
					this.formData.expiryDate = this.editRow.expiryDate
				} else {
					this.formData.time = [this.editRow.startTime, this.editRow.endTime]
				}
				this.formData.range = this.editRow.range.toString()
				if (this.editRow.range == 1) {
					if (this.editRow.yxCouponToRangeDTOList) {
						this.selectGroupList = this.editRow.yxCouponToRangeDTOList.map(
							(item) => {
								return {
									goodsGroupId: item.rangeId,
									supplierId: item.supplierId,
									groupName: item.name,
								}
							}
						)
						this.listData.supplierId = this.editRow.yxCouponToRangeDTOList[0].supplierId
					} else {
						this.selectGroupList = this.editRow.rangeExtList || []
					}
				}
				if (this.editRow.range == 3) {
					if (this.editRow.yxCouponToRangeDTOList) {
						this.selectCommodityList = this.editRow.yxCouponToRangeDTOList.map(
							(item) => {
								return {
									goodsId: item.rangeId,
									supplierId: item.supplierId,
									goodsName: item.name,
								}
							}
						)
						this.listData.supplierId = this.editRow.yxCouponToRangeDTOList[0].supplierId
					} else {
						this.selectCommodityList = this.editRow.rangeExtList || []
					}
				}
				this.formData.usePermission = this.editRow.usePermission.toString()
				this.formData.give = this.editRow.give.toString()
				if (this.editRow.give == 1 || this.editRow.give == 2) {
					this.formData.receivePermission = this.editRow.receivePermission.toString()
				}
				this.formData.businessExpensesProportion = this.editRow.businessExpensesProportion
				this.formData.platform =
					Number(100) - Number(this.editRow.businessExpensesProportion)

				// 费用承担类型
				if (this.formData.businessExpensesProportion == 100) {
					this.formData.proportion = '1'
				} else if (this.formData.businessExpensesProportion == 0) {
					this.formData.proportion = '2'
				} else {
					this.formData.proportion = '3'
					this.formData.expensesProportion = this.editRow.businessExpensesProportion
				}
				this.formData.grantQuantity = this.editRow.grantQuantity
				this.formData.limitCount = this.editRow.limitCount
				this.formData.limitDaily = this.editRow.limitDaily
				this.formData.userRank = this.editRow.userRank.toString()
				this.formData.coupionContent = this.editRow.coupionContent
			} else {
				this.formData.couponType = this.editRow.couponType
			}
		},
		getForm() {
			return {
				couponName: '',
				couponType: '',
				typeExt: '',
				typeExtAmount: '',
				moneyAmount: '',
				limitType: '',
				limitAmount: '',
				floorCount: '',
				expiryDateType: '',
				time: [
					moment().startOf('day').valueOf(),
					moment().endOf('day').valueOf(),
				],
				expiryDate: '',
				range: '',
				usePermission: '2',
				give: '2',
				receivePermission: '1',
				businessExpensesProportion: 0,
				proportion: '1',
				platform: 0,
				grantQuantity: '',
				limitCount: '',
				limitDaily: '',
				userRank: '0',
				coupionContent: '',
				isNewData: 1,
			}
		},
		saveBrand(val, item) {
			console.log(val, item)
			this.listData.supplierId = item.supplierId
			this.selectGroupList = val
		},
		saveCommodity(val, item) {
			console.log(val, item)
			this.listData = item
			this.selectCommodityList = val
		},
		handleAdd() {
			this.formData.range = '1'
			this.setListData()
			this.selectCommodityList = []
			this.rangeExt = JSON.parse(JSON.stringify(this.selectGroupList))
			this.dialogBrandVisible = true
		},
		handleCommodity() {
			this.formData.range = '3'
			this.setListData()
			this.selectGroupList = []
			this.commodityExt = JSON.parse(JSON.stringify(this.selectCommodityList))
			this.dialogCommodityVisible = true
		},
		setListData() {
			// 编辑平台券-档期范围 支持多商家
			if (this.formData.couponType == 1) {
				// 编辑平台券-档期范围 支持多商家
				this.listData.noSupplier = true
				if (this.formData.range == 1) {
					this.listData.supplierId = ''
				}
			} else if (this.formData.couponType == 2) {
				// 编辑品牌券-平台承担类型-档期范围 支持多商家
				if (this.formData.proportion != '1') {
					this.listData.noSupplier = true
					if (this.formData.range == 1) {
						this.listData.supplierId = ''
					}
				} else {
					this.listData.noSupplier = false
				}
			} else {
				this.listData.noSupplier = false
			}
			console.log('this.listData----------', this.listData)
		},
		submitForm: async function () {
			if (this.formData.expiryDateType == 1) {
				if (this.formData.time && this.formData.time.length) {
					let selectTime = moment(this.formData.time[1]).valueOf()
					let nowTime = moment().valueOf()
					if (selectTime < nowTime) {
						this.$message.error('优惠券结束时间不能小于当前时间')
						return
					}
					if (
						(!this.editRow.yxCouponId || !this.isDisableStartTimeSelect) &&
						moment().valueOf() > moment(this.formData.time[0]).valueOf()
					) {
						this.$message.error('有效开始时间不可小于当前时间')
						return false
					}
				}
			}
			console.log(this.formData, '------this.formData')
			if (this.formData.limitType == 1 && this.formData.typeExt == 1) {
				if (
					Number(this.formData.limitAmount) <= Number(this.formData.moneyAmount)
				) {
					this.$message.error('满减金额不能小于或等于指定金额面值')
					return false
				}
			}
			if (Number(this.formData.limitDaily) > Number(this.formData.limitCount)) {
				this.$message.error('每人每日限领张数不能大于每人限领张数')
				return false
			}
			if (
				Number(this.formData.limitCount) > Number(this.formData.grantQuantity)
			) {
				this.$message.error('每人限领张数不能大于派发数量')
				return false
			}
			// if (this.formData.couponType == 2 && this.formData.range == 0) {
			// 	this.$message.error('品牌券只能选择指定档期或商品')
			// 	return false
			// }
			if (this.formData.couponType == 3 && this.formData.range == 0) {
				this.$message.error('优惠券只能选择指定档期或商品')
				return false
			}
			let typeExt = this.formData.typeExt
			let typeExtAmount = this.formData.typeExtAmount
			let limitType = this.formData.limitType
			let moneyAmount = this.formData.moneyAmount
			let limitAmount = this.formData.limitAmount
			if (this.formData.range == 0) {
				this.checkPopUp = true
			} else {
				//优惠券类型设置折扣<=8折
				if (typeExt == 2 && Number(typeExtAmount) <= 8) {
					this.dialogFormVisible = true
				} else if (typeExt == 1 && limitType == 3) {
					//优惠券类型选择为指定金额，且使用门槛选择了满件可用
					this.dialogFormVisible = true
				} else if (typeExt == 1 && limitType == 1) {
					//（x-y）/x<=80% y=优惠类型的指定金额面值 x=使用门槛的满x元可用金额
					let countNub =
						(Number(limitAmount) - Number(moneyAmount)) / Number(limitAmount)
					console.log('countNub---------', countNub)
					if (countNub <= 0.8) {
						this.dialogFormVisible = true
					} else {
						this.handleSure()
					}
				} else {
					this.handleSure()
				}
			}
		},
		async handlePass() {
			this.passNode = true
			let params = await this.getRSAPassword(Object.assign({}, this.rsaData))
			let paramJson = {}
			if (params) {
				paramJson.couponPassWord = params.password
				paramJson.privateKeySessionKey = params.privateKeySessionKey
			}
			let {
				data: { resultCode },
			} = await checkCouponPassword(paramJson)
			if (resultCode == 0) {
				this.handleSure()
			} else {
				this.passNode = false
			}
		},
		async handleSure() {
			this.showLoading = true
			let paramJson = {
				couponName: this.formData.couponName,
				couponType: this.formData.couponType,
				typeExt: this.formData.typeExt,
				limitType: this.formData.limitType,
				expiryDateType: this.formData.expiryDateType,
				range: this.formData.range,
				usePermission: this.formData.usePermission,
				give: this.formData.give,
				grantQuantity: this.formData.grantQuantity,
				limitCount: this.formData.limitCount,
				limitDaily: this.formData.limitDaily,
				userRank: this.formData.userRank,
				coupionContent: this.formData.coupionContent,
				type: 1,
				sortOrder: 10,
			}
			if (this.editRow.yxCouponId) {
				paramJson.yxCouponId = this.editRow.yxCouponId
			}
			if (this.formData.typeExt == 2) {
				// paramJson.amount = (this.formData.typeExtAmount * 10000) / 10 / 10000
				paramJson.amount = accDiv(this.formData.typeExtAmount, 10)
			} else {
				paramJson.amount = this.formData.moneyAmount
			}
			if (this.formData.limitType == 1) {
				paramJson.limitAmount = this.formData.limitAmount
			} else {
				paramJson.floorCount = this.formData.floorCount
			}
			if (this.formData.expiryDateType == 1) {
				paramJson.startTime = moment(this.formData.time[0]).valueOf()
				paramJson.endTime = moment(this.formData.time[1]).valueOf()
			} else {
				paramJson.expiryDate = this.formData.expiryDate
			}
			if (this.formData.range == 1) {
				paramJson.rangeExtList = this.selectGroupList.map((item) => {
					return item.goodsGroupId
				})
				paramJson.yxCouponToRangeDTOList = this.selectGroupList.map((item) => {
					return {
						rangeId: item.goodsGroupId,
						supplierId: item.supplierId,
						groupName: item.name,
					}
				})
			} else if (this.formData.range == 3) {
				paramJson.rangeExtList = this.selectCommodityList.map((item) => {
					return item.goodsId
				})
				paramJson.yxCouponToRangeDTOList = this.selectCommodityList.map(
					(item) => {
						return {
							rangeId: item.goodsId,
							supplierId: item.supplierId,
							goodsName: item.name,
						}
					}
				)
			}
			if (this.formData.couponType == 1) {
				// 平台券
				paramJson.businessExpensesProportion = this.formData.businessExpensesProportion
			} else if (this.formData.couponType == 2) {
				// 品牌券
				if (this.formData.proportion == '1') {
					paramJson.businessExpensesProportion = 100
				} else if (this.formData.proportion == '2') {
					paramJson.businessExpensesProportion = 0
				} else if (this.formData.proportion == '3') {
					paramJson.businessExpensesProportion = this.formData.expensesProportion
				}
			} else if (this.formData.couponType == 3) {
				// 优选券不用传
				delete paramJson.businessExpensesProportion
			}
			if (this.formData.give == 1 || this.formData.give == 2) {
				paramJson.receivePermission = this.formData.receivePermission
			}
			let {
				data: { resultCode },
			} = await (this.editRow.yxCouponId
				? updateYxCouponInfoToYhtPlus(paramJson)
				: addYxCouponInfoToYhtPlus(paramJson))
			this.showLoading = false
			this.passNode = false
			if (resultCode == 0) {
				this.$message({
					type: 'success',
					message: '保存成功',
				})
				this.dialogFormVisible = false
				this.localVisible = false
				this.checkPopUp = false
				this.$emit('Refresh', true)
			}
		},
		async getRSAPassword(paramJson) {
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
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},

		// 判断是否禁止选择开始时间
		isDisableTimePicker(startTime) {
			const nowTime = moment().valueOf()
			// 当前时间>=开始时间前, 优惠券开始时间不可编辑
			this.isDisableStartTimeSelect =
				this.editRow.yxCouponId && startTime > 0 && nowTime >= startTime
		},
	},
}
</script>

<style lang="scss" scoped>
.coupon-title {
	margin: 0 0 16px;
}
.proportion-text {
	margin-bottom: 10px;
	color: #999;
}
</style>

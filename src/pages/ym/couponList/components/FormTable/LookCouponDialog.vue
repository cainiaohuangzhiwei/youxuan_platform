/* eslint-disable no-dupe-else-if */
<template>
	<div>
		<el-dialog
			width="800px"
			:title="'查看优惠卷'"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<yx-form
				ref="form"
				v-loading="showLoading"
				:inline="false"
				:items="item"
				:data="formData"
				labelWidth="120px"
				:formAction="formAction"
			>
				<template #title1>
					<h3>基础信息</h3>
				</template>
				<template #title2>
					<h3>领取和使用规则</h3>
				</template>
				<template #typeExt>
					<el-radio v-model="formData.typeExt" label="1" :disabled="true"
						><span>减</span
						><el-input
							:disabled="true"
							v-model.trim="formData.moneyAmount"
							style="width: 80px; margin-left: 10px"
						></el-input
						>&nbsp;元</el-radio
					>
					<el-radio v-model="formData.typeExt" label="2" :disabled="true"
						><span>打</span
						><el-input
							v-model.trim="formData.typeExtAmount"
							:disabled="true"
							style="width: 80px; margin-left: 10px"
						></el-input
						>&nbsp;折</el-radio
					>
				</template>
				<template #limitType>
					<el-radio v-model="formData.limitType" label="1" :disabled="true"
						><span>满</span
						><el-input
							:disabled="true"
							v-model.trim="formData.limitAmount"
							style="width: 80px; margin-left: 10px"
						></el-input
						>&nbsp;元</el-radio
					>
					<el-radio v-model="formData.limitType" label="3" :disabled="true"
						><span>满</span
						><el-input
							:disabled="true"
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
							:disabled="true"
							><el-date-picker
								v-model="formData.time"
								type="datetimerange"
								:default-time="['00:00:00', '23:59:59']"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
							>
							</el-date-picker
						></el-radio>
					</div>
					<div>
						<el-radio
							v-model="formData.expiryDateType"
							label="2"
							:disabled="true"
							><span>自领取起</span
							><el-input
								:disabled="true"
								v-model.trim="formData.expiryDate"
								style="width: 80px; margin-left: 10px"
							></el-input
							>&nbsp;天内有效</el-radio
						>
					</div>
				</template>
				<template #range>
					<el-radio :disabled="true" v-model="formData.range" label="1"
						>指定档期</el-radio
					>
					<div v-if="formData.range == 1">
						<span v-for="(item, index) in selectGroupList" :key="index"
							>{{ item.groupName
							}}{{ selectGroupList.length - 1 != index ? '、' : '' }}</span
						>
					</div>
				</template>
				<template #usePermission>
					<el-radio v-model="formData.usePermission" label="1" :disabled="true"
						>仅店铺使用</el-radio
					>
					<el-radio v-model="formData.usePermission" label="2" :disabled="true"
						>平台店铺通用</el-radio
					>
				</template>
				<template #give>
					<el-radio v-model="formData.give" label="0" :disabled="true"
						>自用</el-radio
					>
				</template>
				<template #receivePermission>
					<el-radio
						v-model="formData.receivePermission"
						label="1"
						:disabled="true"
						>平台用户可领取</el-radio
					>
					<el-radio
						v-model="formData.receivePermission"
						label="2"
						:disabled="true"
						>仅C端用户可领取</el-radio
					>
				</template>
				<template #businessExpensesProportion>
					<span>商家承担</span>
					<el-input
						@input="handleChange"
						:disabled="true"
						v-model.trim="formData.businessExpensesProportion"
						style="width: 80px; margin-left: 10px"
					></el-input
					>&nbsp;%
					<span style="margin-left: 20px">平台承担</span>
					<el-input
						disabled
						v-model.trim="formData.platform"
						style="width: 80px; margin-left: 10px"
					></el-input
					>&nbsp;%
				</template>
				<template #limitCount>
					<el-input
						:disabled="true"
						v-model.trim="formData.limitCount"
						style="width: 80px; margin-left: 10px"
					></el-input
					>&nbsp;张
				</template>
				<template #limitDaily>
					<el-input
						:disabled="true"
						v-model.trim="formData.limitDaily"
						style="width: 80px; margin-left: 10px"
					></el-input
					>&nbsp;张
				</template>
				<template #userRank>
					<el-radio :disabled="true" v-model="formData.userRank" label="0"
						>平台用户</el-radio
					>
					<el-radio :disabled="true" v-model="formData.userRank" label="1"
						>店主</el-radio
					>
					<el-radio :disabled="true" v-model="formData.userRank" label="2"
						>C端用户</el-radio
					>
				</template>
				<template #coupionContent>
					<el-input
						type="textarea"
						:disabled="true"
						v-model.trim="formData.coupionContent"
						maxlength="200"
						:autosize="{ minRows: 2, maxRows: 4 }"
						placeholder="请输入活动描述内容"
					></el-input>
				</template>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import RSA from 'js-rsa-dave'
import YxForm from '@wg-vue-materials/yx-form'
import { getPublicKeyAndModel } from '@/api/webUser.js'
import { highPrecisionMul } from '@/utils/helper/common'
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
	},

	data() {
		return {
			listData: {},
			selectCommodityList: [],
			dialogFormVisible: false,
			showLoading: false,
			passNode: false,
			selectGroupList: [],
			dialogBrandVisible: false,
			commodityExt: [],
			dialogCommodityVisible: false,
			item: [
				{
					unformItem: true,
					dataIndex: 'title1',
					type: 'custom',
				},
				{
					title: '优惠券名称',
					dataIndex: 'couponName',
					disabled: 'true',
					placeholder: '优惠券名称',
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
			formData: this.getForm(),
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
			],
		}
	},
	watch: {
		localVisible(val) {
			this.formData = this.getForm()
			this.$refs.form && this.$refs.form.$refs.YxForm.resetFields()
			this.$refs.rsaform && this.$refs.rsaform.$refs.YxForm.resetFields()
			if (!val) {
				this.editRow = {}
			} else {
				console.log(this.editRow, 'xxthis.editRowthis.editRow')
				this.selectGroupList = []
				this.selectCommodityList = []
				this.listData = {}
				if (this.editRow && this.editRow.yxCouponId) {
					this.initFormData()
				} else if (this.editRow && this.editRow.isCopy) {
					this.initFormData()
				}
			}
		},
		formData: {
			handler: function (val) {
				this.item.forEach((item) => {
					if (item.dataIndex == 'receivePermission') {
						item.hide = val.give == 1 || val.give == 2 ? false : true
					}
				})
				// this.item[7].hide = val.give == 1 || val.give == 2 ? false : true
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
			this.formData.couponName = this.editRow.couponName
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
				this.selectGroupList = this.editRow.rangeExtList || []
			}
			if (this.editRow.range == 3) {
				this.selectCommodityList = this.editRow.rangeExtList || []
				this.listData = this.editRow.supplierExtInfo || []
			}
			this.formData.usePermission = this.editRow.usePermission.toString()
			this.formData.give = this.editRow.give.toString()
			if (this.editRow.give == 1 || this.editRow.give == 2) {
				this.formData.receivePermission =
					this.editRow.receivePermission.toString()
			}
			this.formData.businessExpensesProportion =
				this.editRow.businessExpensesProportion
			this.formData.platform =
				Number(100) - Number(this.editRow.businessExpensesProportion)
			this.formData.limitCount = this.editRow.limitCount
			this.formData.limitDaily = this.editRow.limitDaily
			this.formData.userRank = this.editRow.userRank.toString()
			this.formData.coupionContent = this.editRow.coupionContent
		},
		handleChange(val) {
			console.log(val, 'valval')
			let pattern = /^(?:0|[1-9][0-9]?|100)$/
			if (pattern.test(val)) {
				let a = val
				let b = Number(100) - Number(a)
				if (b < 0 || b > 100) {
					this.formData.platform = 0
				} else {
					this.formData.platform = b
				}
			} else {
				this.formData.platform = 0
			}
		},
		getForm() {
			return {
				couponName: '',
				typeExt: '',
				typeExtAmount: '',
				moneyAmount: '',
				limitType: '',
				limitAmount: '',
				floorCount: '',
				expiryDateType: '',
				time: '',
				expiryDate: '',
				range: '',
				usePermission: '2',
				give: '2',
				receivePermission: '1',
				businessExpensesProportion: 100,
				platform: 0,
				limitCount: '',
				limitDaily: '',
				userRank: '0',
				coupionContent: '',
			}
		},
		saveBrand(val) {
			this.selectGroupList = val
		},
		saveCommodity(val, item) {
			this.listData = JSON.parse(JSON.stringify(item))
			this.selectCommodityList = val
			console.log(val, 'valvalv')
		},
		handleAdd() {
			this.formData.range = '1'
			this.rangeExt = JSON.parse(JSON.stringify(this.selectGroupList))
			this.dialogBrandVisible = true
		},
		handleCommodity() {
			this.formData.range = '3'
			this.commodityExt = JSON.parse(JSON.stringify(this.selectCommodityList))
			this.dialogCommodityVisible = true
		},
		submitForm: async function () {
			this.localVisible = false
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
	},
}
</script>

<style lang="scss" scoped></style>

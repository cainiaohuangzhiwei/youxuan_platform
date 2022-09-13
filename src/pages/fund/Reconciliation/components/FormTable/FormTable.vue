<template>
	<basic-container class="form-box">
		<yx-form
			v-loading="showLoading"
			labelWidth="100px"
			:data.sync="withdrawData"
			:items="searchCfg"
			:rules="rules"
			:formAction="searchAction"
			ref="reconciliationForm"
		>
			<template slot="regulationType" slot-scope="scope">
				<div>
					<el-select v-model="scope.data.regulationType" placeholder="请选择">
						<el-option
							v-for="item in regulationTypeList"
							:key="item.regulationType"
							:label="item.label"
							:value="item.regulationType"
						>
						</el-option>
					</el-select>
					<el-popover
						placement="top-start"
						title="调账类型"
						width="200"
						trigger="hover"
					>
						<div>
							<p>1.加款[加总余额]</p>
							<p>2.减款[减总余额]</p>
						</div>
						<el-button
							class="el-icon-question question-btn"
							circle
							type="text"
							slot="reference"
						></el-button>
					</el-popover>
				</div>
			</template>
			<template slot="amount">
				<div class="amount-box">
					<el-input
						type="number"
						v-amount="withdrawData.amount"
						v-model="withdrawData.amount"
						placeholder="请输入调账金额"
					></el-input>
				</div>
			</template>
			<template slot="serviceCharge">
				<span>{{ withdrawData.serviceCharge }}</span>
			</template>
		</yx-form>
		<infoDialog
			:dialogVisible.sync="dialogVisible"
			:withdrawData.sync="withdrawData"
			@updateWithdrawData="updateWithdrawData"
		></infoDialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import infoDialog from './components/infoDialog'
import { checkFunctionCode } from '@/utils/auth.js'
export default {
	components: {
		BasicContainer,
		YxForm,
		infoDialog,
	},
	name: 'FormTable',

	data() {
		return {
			platformWithdrawView: checkFunctionCode('platformWithdrawView'),
			supplierWithdrawView: checkFunctionCode('supplierWithdrawView'),
			showLoading: false,
			dialogVisible: false,
			withdrawData: {
				accountName: '微革营销账户', // 调账账户
				amount: '', // 调账金额
				remark: '', // 调账备注
				regulationType: '', // 调账类型
			},
			regulationTypeList: [
				{
					regulationType: 1,
					label: '加款',
				},
				{
					regulationType: 2,
					label: '减款',
				},
			],
			rules: {
				regulationType: [
					{ required: true, message: '请选择调账类型', trigger: 'change' },
				],
				amount: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (value == '') {
								callback(new Error('请输入调账金额!'))
							} else if (value > 10000000) {
								callback(new Error('金额不能大于1000W!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				remark: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入调账备注!'))
							} else if (value.length > 140) {
								callback(new Error('备注长度不能大于140'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			orderStatus: [],
			searchCfg: [
				{
					type: 'text',
					title: '调账账户',
					dataIndex: 'accountName',
					disabled: true,
				},
				{
					type: 'custom',
					title: '调账类型',
					dataIndex: 'regulationType',
				},
				{
					type: 'custom',
					title: '调账金额',
					dataIndex: 'amount',
				},
				{
					type: 'textarea',
					title: '调账备注',
					dataIndex: 'remark',
				},
			],
			searchAction: [
				{
					title: '发起',
					type: 'primary',
					click: () => {
						// this.$store.dispatch('tagsView/delVisitedView', )
						this.showDialog()
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
	watch: {
		$route: {
			immediate: true,
			deep: true,
			handler() {
				this.$nextTick(() => {
					this.$refs.reconciliationForm.clearValidate()
				})
			},
		},
	},
	methods: {
		updateWithdrawData() {
			// 更新调账信息
			this.withdrawData = {
				accountName: '微革营销账户', // 调账账户
				amount: '', // 调账金额
				remark: '', // 调账备注
				regulationType: '', // 调账类型
			}
		},
		showDialog() {
			this.withdrawData = Object.assign(this.withdrawData, {
				regulationTypeString:
					this.withdrawData.regulationType == 1 ? '加款' : '减款',
			})
			this.dialogVisible = true
		},
	},
}
</script>

<style scoped lang="scss">
.amount-box {
	display: flex;
	span {
		width: 300px;
		margin-left: 40px;
	}
}
.question-btn {
	margin-left: 20px;
}
.form-box {
	width: 600px;
}
</style>

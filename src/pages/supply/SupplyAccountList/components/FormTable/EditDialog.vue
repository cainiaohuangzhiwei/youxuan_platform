<template>
	<div>
		<el-dialog
			width="500px"
			:title="type === 2 ? '编辑商家' : '新增商家'"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<span style="color: red"
				>（请确认各项信息的准确性，一旦保存将不可再次编辑）</span
			>
			<yx-form
				ref="form"
				:inline="false"
				:items="item"
				:data="formData"
				:rules="formRules"
				v-loading="loading"
				:labelWidth="'130px'"
				:formAction="formAction"
			>
				<template #endOrderTime>
					<el-radio-group v-model="formData.deliverMod">
						<el-radio :label="1">模式一 </el-radio>
						<el-radio :label="2">模式二</el-radio>
					</el-radio-group>
					<div v-if="formData.deliverMod == 1">
						<el-button class="btn" @click="cutOffTime"
							>+添加截单时间
						</el-button>
						<div
							class="time"
							:class="{ adorn: counter.length === 0 }"
							v-if="endOrderTimeShow"
						>
							<p v-for="(item, index) in counter" :key="index">
								<el-time-picker
									class="picker"
									v-model="item.endOrderTime"
									:picker-options="{
										selectableRange: '0:00:00 - 23:59:59',
									}"
									placeholder="任意时间点"
								>
								</el-time-picker>
								<el-button type="danger" @click="thisSplice(index)"
									>删除</el-button
								>
							</p>
						</div>
					</div>
					<div v-else class="hour-box">
						订单下单后<el-input
							class="hour-input"
							type="number"
							onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
							v-model.number="formData.endOrderTime"
						></el-input
						>小时
					</div>
				</template>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import moment from 'moment'
import YxForm from '@wg-vue-materials/yx-form'
import { supplierAccountNumberSave } from '@/api/yhtPlusCmsSupplierAccountNumber'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		YxForm,
	},

	data() {
		return {
			loading: false,
			item: [
				{
					type: 'input',
					disabled: false,
					title: '商家名称',
					dataIndex: 'supplierName',
					placeholder: '请输入正确的商家名称',
				},
				{
					type: 'radio',
					disabled: false,
					title: '是否自动下单',
					dataIndex: 'isAutoOrder',
					label: 'value',
					hide: true,
					options: [
						{
							isAutoOrder: '1',
							value: '是',
						},
						{
							isAutoOrder: '0',
							value: '否',
						},
					],
				},
				{
					type: 'radio',
					disabled: true,
					title: '是否延时下单',
					dataIndex: 'isDelayedOrder',
					label: 'value',
					hide: true,
					options: [
						{
							isDelayedOrder: '1',
							value: '是',
						},
						{
							isDelayedOrder: '0',
							value: '否',
						},
					],
				},
				{
					type: 'radio',
					disabled: false,
					title: '是否限购',
					hide: true,
					dataIndex: 'isSelfPurchase',
					label: 'value',
					options: [
						{
							isSelfPurchase: '1',
							value: '是',
						},
						{
							isSelfPurchase: '0',
							value: '否',
						},
					],
				},
				{
					type: 'radio',
					disabled: false,
					title: '是否快速处理工单',
					dataIndex: 'isHandleOrder',
					hide: true,
					label: 'value',
					options: [
						{
							isHandleOrder: '1',
							value: '是',
						},
						{
							isHandleOrder: '0',
							value: '否',
						},
					],
				},
				{
					type: 'custom',
					dataIndex: 'endOrderTime',
				},
			],
			type: '',
			endOrderTimeShow: true,
			counter: [],
			formData: {
				deliverMod: 1,
				supplierName: '', // 商家名称
				isAutoOrder: '1', // 是否自动下单
				isDelayedOrder: '0', // 是否延时下单
				isSelfPurchase: '0', // 是否限购
				isHandleOrder: '1', // 是否快速处理工单
				endOrderTime: '',
			},
			formRules: {
				supplierName: [
					{
						required: true,
						message: '请填写商家名称',
						trigger: 'blur',
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
		// 回显
		detail(type, row) {
			this.counter = []
			this.loading = false
			this.type = type
			for (let i = 0; i < this.item.length; i++) {
				this.item[i].disabled = true
			}
			const tempArr = Object.assign({}, row)
			if (type === 2) {
				tempArr.isAutoOrder = tempArr.isAutoOrder.toString()
				tempArr.isDelayedOrder = tempArr.isDelayedOrder.toString()
				tempArr.isSelfPurchase = tempArr.isSelfPurchase.toString()
				tempArr.isHandleOrder = tempArr.isHandleOrder.toString()
				this.formData = tempArr
				if (tempArr.deliverMod == 1) {
					if (!tempArr.endOrderTime) {
						this.counter = []
						this.endOrderTimeShow = false
					} else {
						const addendOrderTimeList = tempArr.endOrderTime.split(',')
						this.counter = addendOrderTimeList.map((item) => {
							return {
								endOrderTime: new Date('1995/2/5/' + item),
							}
						})
						this.endOrderTimeShow = true
					}
				}
				this.item[4].disabled = false
				this.item[5].disabled = false
			} else {
				this.item[0].disabled = false
				this.formData = {
					deliverMod: 1,
					supplierName: '', // 商家名称
					isAutoOrder: '1', // 是否自动下单
					isDelayedOrder: '0', // 是否延时下单
					isSelfPurchase: '0', // 是否限购
					isHandleOrder: '1', // 是否快速处理工单
					endOrderTime: '',
					// hour: '',
				}
				// for (let i = 0; i < this.item.length; i++) {
				// 	this.item[i].disabled = false
				// }
			}
		},

		// 添加截单时间
		cutOffTime() {
			this.counter.push({
				endOrderTime: moment().startOf('day'),
			})
			this.endOrderTimeShow = true
		},

		// 删除截单时间
		thisSplice(index) {
			this.counter.splice(index, 1)
		},

		// 保存
		async submitForm() {
			if (
				this.formData.deliverMod == 2 &&
				!/^1[0-9]$|^2[0-4]$|^[0-9]$/.test(this.formData.endOrderTime)
			) {
				this.$message.warning('请输入正整数0-24之间的截单时间')
				return
			}
			const endOrderTimeList = []
			const paramsData = Object.assign(this.formData, {})
			// const paramsData = Object.assign(
			// 	{},
			// 	{
			// 		deliverMod: this.formData.deliverMod,
			// 		isAutoOrder: 1,
			// 		isDelayedOrder: 0,
			// 		isSelfPurchase: 0,
			// 		isHandleOrder: 1,
			// 		supplierName: this.formData.supplierName,
			// 	}
			// )
			for (let i = 0; i < this.counter.length; i++) {
				endOrderTimeList.push(
					moment(this.counter[i].endOrderTime).format('HH:mm:ss')
				)
			}
			paramsData.endOrderTime =
				this.formData.deliverMod == 1
					? endOrderTimeList.join(',')
					: this.formData.endOrderTime
			paramsData.supplierName = paramsData.supplierName.replace(/\s+/g, '')
			this.supplierAccountNumberSave(paramsData)
		},

		// 新增/编辑
		async supplierAccountNumberSave(paramsData) {
			this.loading = true
			const res = await supplierAccountNumberSave(paramsData)
			this.loading = false
			if (res.data.resultCode === 0) {
				this.$message.success(res.data.resultMsg)
				this.resetForm()
				this.$emit('fatherMethod')
			}
		},

		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.$refs.form.$refs.YxForm.resetFields()
		},
	},
}
</script>

<style lang="scss" scoped>
.btn {
	height: 32px;
	margin-left: -130px;
}

.time {
	margin-top: -46px;
	margin-bottom: 0;
}

.picker {
	margin-right: 10px;
}

.adorn {
	margin-bottom: 61px;
}
.hour-box {
	display: flex;
	align-items: center;
	.hour-input {
		width: 100px;
		margin: 0 10px;
	}
}
</style>

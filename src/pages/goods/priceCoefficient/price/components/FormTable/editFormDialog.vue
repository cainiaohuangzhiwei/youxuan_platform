<template>
	<yx-dialog
		:title="dialogTitle"
		:visible.sync="visible"
		v-loading="showLoading"
		:bottomBtn="bottomBtn"
		@before-close="resetForm"
	>
		<el-form
			:inline="true"
			ref="dynamicValidateForm"
			:model="formData"
			labelWidth="100px"
		>
			<el-row v-for="(item, index) in formData" :key="item.priceIntervalId">
				<el-form-item label="下限价格">
					<el-input
						:value="
							(formData[index - 1] && formData[index - 1].upperLimit) ||
							(index === 0 ? 0 : '')
						"
						:disabled="true"
					></el-input>
				</el-form-item>
				<el-form-item
					:prop="index + '.upperLimit'"
					label="上限价格"
					:rules="
						index !== formData.length - 1
							? [
									{
										validator: validatorPrice,
										trigger: ['blur', 'change'],
									},
							  ]
							: []
					"
				>
					<el-input
						v-model.trim="item.upperLimit"
						:placeholder="index == formData.length - 1 ? '999999999' : ''"
					></el-input>
				</el-form-item>
				<el-form-item
					:prop="index + '.modulus'"
					label="系数"
					:rules="[
						{
							validator: validatorModulus,
							trigger: ['blur', 'change'],
						},
					]"
				>
					<el-input v-model.trim="item.modulus"></el-input>
				</el-form-item>
				<el-button
					v-if="index < formData.length - 1"
					@click.prevent="remove(index)"
					>删除</el-button
				>
				<el-button
					v-if="index < formData.length - 1 || index == 0"
					@click.prevent="add(index)"
					>添加</el-button
				>
			</el-row>
			<el-row>
				<el-form-item label="填写说明">
					保证数据连贯性，上一条数据上限价格为下一条数据的下限价格，最后一条数据上限价格可不用填写，系统默认999999999元
				</el-form-item>
			</el-row>
		</el-form>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import { priceList, updatePriceValList } from '@/api/grossMargins'
export default {
	components: {
		YxDialog,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			validatorModulus: (rule, value, callback) => {
				let pattern = /^\d+.?\d{0,2}$/
				if (value === '') {
					callback(new Error('系数不能为空'))
				} else {
					if (Number(value) <= 0 || Number(value) > 1.3) {
						callback(new Error('请输入正确的系数，0<系数≤1.3'))
					} else if (isNaN(Number(value))) {
						callback(new Error('请输入正确的系数'))
					} else if (!pattern.test(value)) {
						callback(new Error('小数点后最多只能输入两位'))
					}
					callback()
				}
			},
			validatorPrice: (rule, value, callback) => {
				let [index] = rule.field.split('.')
				index = Number(index)
				let pattern = /^\d+.?\d{0,2}$/
				if (value === '') {
					callback(new Error('价格不能为空'))
				} else {
					if (Number(value) <= 0 || Number(value) >= 999999999) {
						callback(new Error('价格必须大于0小于999999999'))
					} else if (isNaN(Number(value))) {
						callback(new Error('请输入正确的价格'))
					} else if (!pattern.test(value)) {
						callback(new Error('小数点后最多只能输入两位'))
					} else if (
						this.formData[index - 1] &&
						this.formData[index - 1].upperLimit &&
						Number(this.formData[index - 1].upperLimit) >= Number(value)
					) {
						callback(new Error('必须大于下限价格'))
					} else if (
						this.formData[index + 1] &&
						this.formData[index + 1].upperLimit &&
						Number(this.formData[index + 1].upperLimit) <= Number(value)
					) {
						callback(new Error('必须小于下个区间的上限价格'))
					}

					callback()
				}
			},
			dialogTitle: '修改价格区间',
			showLoading: false,
			visible: false,
			formData: [],
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.savePriceCoefficient()
					},
				},
			],
		}
	},
	methods: {
		async getData(e) {
			let custom = {}
			if (e) {
				custom = {
					uid: e.currentTarget.__vue__._uid,
				}
			}
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await priceList({}, custom)
			this.showLoading = false
			if (resultCode == 0) {
				this.formData = resultData
			} else {
				this.formData = []
			}
			if (this.formData.length === 0) {
				this.add(-1)
			}
			this.format()
		},
		add(index) {
			if (this.formData.length === 1) {
				this.formData[0].upperLimit = ''
			}
			this.formData.splice(index + 1, 0, {
				priceIntervalId: Symbol(),
				upperLimit: '',
				modulus: '',
			})
			this.format()
		},
		remove(index) {
			this.formData.splice(index, 1)
			this.format()
		},
		format() {
			if (!this.formData) {
				this.formData = [
					{
						priceIntervalId: Symbol(),
						upperLimit: '',
						modulus: '',
					},
				]
			}
		},
		savePriceCoefficient() {
			this.$refs.dynamicValidateForm.validate(async (valid) => {
				if (!valid) {
					return false
				}

				let priceValList = this.formData.map((item, index) => {
					return {
						lowerLimit:
							(this.formData[index - 1] &&
								parseFloat(this.formData[index - 1].upperLimit)) ||
							0,
						upperLimit:
							index == this.formData.length - 1
								? 999999999
								: parseFloat(item.upperLimit),
						modulus: parseFloat(item.modulus),
					}
				})
				let paramJson = { priceValList }
				console.log(paramJson)
				let res = await updatePriceValList(paramJson)
				if (res.data.resultCode == 0) {
					this.$message.success(res.data.resultMsg)
					this.visible = false
					this.$emit('updateList')
				}
			})
		},
		resetForm() {
			this.$refs.dynamicValidateForm.resetFields()
		},
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
			this.formData = []
			if (this.visible) {
				this.getData()
			}
		},
		dialogVisible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.visible = newVlaue
			}
		},
	},
}
</script>

<template>
	<yx-dialog
		:title="dialogTitle"
		:visible.sync="visible"
		@before-close="resetForm"
	>
		<yx-form
			labelWidth="100px"
			:data="dialogData"
			:rules="rules"
			ref="form"
			:items.sync="dialogCfg"
			:formAction="dialogAction"
		>
			<template slot="lowerLimit" slot-scope="scope">
				<div>
					<div class="dis_f_ac">{{ scope.data.lowerLimit }}</div>
				</div>
			</template>
			<template slot="upperLimit" slot-scope="scope">
				<div>
					<div class="dis_f_ac">{{ scope.data.upperLimit }}</div>
				</div>
			</template>
			<template slot="modulus" slot-scope="scope">
				<div>
					<div class="dis_f_ac">
						<el-input
							class="form_input"
							v-model.trim="scope.data.modulus"
							placeholder="请输入系数"
							style="width: 300px"
						>
						</el-input>
					</div>
				</div>
			</template>
		</yx-form>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import { updatePriceModulus } from '@/api/grossMargins'
export default {
	components: {
		YxDialog,
		YxForm,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		// 单条信息
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			dialogTitle: '编辑系数',
			visible: false,
			dialogData: {
				priceIntervalId: '',
				lowerLimit: '', // 上限
				upperLimit: '', // 下限
				modulus: '', // 系数
			},
			rules: {
				modulus: [
					{
						validator: (rule, value, callback) => {
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
						trigger: 'blur',
					},
				],
			},
			dialogAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.saveModulus()
					},
				},
			],
			dialogCfg: [
				{
					type: 'custom',
					dataIndex: 'lowerLimit',
					title: '下限价格',
				},
				{
					type: 'custom',
					dataIndex: 'upperLimit',
					title: '上限价格',
				},
				{
					type: 'custom',
					dataIndex: 'modulus',
					title: '系数',
				},
			],
		}
	},
	methods: {
		async saveModulus() {
			let paramJson = Object.assign(
				{},
				{
					priceIntervalId: this.dialogData.priceIntervalId,
					modulus: this.dialogData.modulus,
				}
			)
			let res = await updatePriceModulus(paramJson)
			if (res.data.resultCode == 0) {
				this.$message.success(res.data.resultMsg)
				this.visible = false
				this.$emit('updateList')
			}
		},
		resetForm() {
			this.$refs.form.$refs.YxForm.resetFields()
		},
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
			if (this.visible) {
				if (this.itemInfo && this.itemInfo.priceIntervalId) {
					this.dialogData = Object.assign({}, this.itemInfo)
				} else {
					this.dialogData = {
						priceIntervalId: '',
						modulus: '',
					}
				}
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

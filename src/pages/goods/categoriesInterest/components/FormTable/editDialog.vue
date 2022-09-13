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
			<template slot="goodsCategoryName" slot-scope="scope">
				<div>
					<div class="dis_f_ac">{{ scope.data.goodsCategoryName }}</div>
				</div>
			</template>
			<template slot="grossMargins" slot-scope="scope">
				<div>
					<div class="dis_f_ac">
						<el-input
							class="form_input"
							v-model.trim="scope.data.grossMargins"
							placeholder="请输入毛利率"
							style="width: 300px"
						>
							<template slot="append">%</template>
						</el-input>
					</div>
				</div>
				<div>请填写百分比，不需要自己做换算</div>
			</template>
		</yx-form>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import { updateGrossMargins } from '@/api/grossMargins'
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
			dialogTitle: '编辑毛利率',
			visible: false,
			dialogData: {
				goodsCategoryId: '',
				goodsCategoryName: '', // 分类
				grossMargins: '', // 毛利率
			},
			rules: {
				grossMargins: [
					{
						validator: (rule, value, callback) => {
							let pattern = /^\d+.?\d{0,2}$/
							if (value === '') {
								callback(new Error('毛利率不能为空'))
							} else {
								if (Number(value) <= 0 || Number(value) >= 100) {
									callback(new Error('毛利率必须大于0小于100'))
								} else if (isNaN(Number(value))) {
									callback(new Error('请输入正确的毛利率'))
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
						this.saveGrossMargins()
					},
				},
			],
			dialogCfg: [
				{
					type: 'custom',
					dataIndex: 'goodsCategoryName',
					title: '类目名称',
				},
				{
					type: 'custom',
					dataIndex: 'grossMargins',
					title: '毛利率',
				},
			],
		}
	},
	methods: {
		async saveGrossMargins() {
			let paramJson = Object.assign(
				{},
				{
					goodsCategoryId: this.dialogData.goodsCategoryId,
					grossMargins: this.dialogData.grossMargins,
				}
			)
			let res = await updateGrossMargins(paramJson)
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
				if (this.itemInfo && this.itemInfo.goodsCategoryId) {
					this.dialogData = Object.assign({}, this.itemInfo)
					if (this.dialogData.grossMargins === null) {
						this.dialogData.grossMargins = ''
					}
				} else {
					this.dialogData = {
						goodsCategoryId: '',
						grossMargins: '',
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

<template>
	<div>
		<el-dialog
			width="30%"
			:title="title"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			:destroy-on-close="true"
		>
			<yx-form
				:ref="ruleForm"
				:inline="false"
				:data="formInline"
				:items="formCfg"
				:rules="funRules"
				:formAction="dialogAction"
			>
				<template #supplyPrice>
					<div>
						结算价&nbsp;/&nbsp;<el-input
							v-model="formInline.supplyPrice"
							size="mini"
							style="width: 80px"
						></el-input>
					</div>
				</template>
				<template #lowPrice>
					<div>
						结算价&nbsp;/&nbsp;<el-input
							v-model="formInline.lowPrice1"
							size="mini"
							style="width: 80px"
						></el-input
						>&nbsp;/&nbsp;<el-input
							v-model="formInline.lowPrice2"
							size="mini"
							style="width: 80px"
						></el-input>
					</div>
				</template>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { checkGoodsPrice } from '@/api/supplierGoodsAudit'
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
	},
	data() {
		let validatePass = (rule, value, callback) => {
			if (!this.formInline.lowPrice1 || !this.formInline.lowPrice2) {
				callback(new Error('请填入建议零售价'))
			} else {
				callback()
			}
		}
		return {
			funRules: {
				supplyPrice: [
					{ required: true, message: '请填入结算价', trigger: 'blur' },
				],
				lowPrice: [
					{ required: true, validator: validatePass, trigger: 'blur' },
				],
			},
			formInline: {
				supplyPrice: '',
				lowPrice1: '',
				lowPrice2: '',
			},
			formCfg: [
				{
					type: 'custom',
					title: '供货价=',
					dataIndex: 'supplyPrice',
				},
				{
					type: 'custom',
					title: '建议零售价=',
					dataIndex: 'lowPrice',
				},
			],
			dialogAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.checkGoodsPrice()
					},
				},
				{
					title: '取消',
					cancel: true,
					click: () => {
						this.localVisible = false
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
				this.formInline.lowPrice1 = ''
				this.formInline.lowPrice2 = ''
				this.formInline.supplyPrice = ''
			},
		},
	},
	methods: {
		saveLivePlan() {},
		async checkGoodsPrice() {
			if (
				this.formInline.lowPrice1 <= 0 ||
				this.formInline.supplyPrice <= 0 ||
				this.formInline.lowPrice2 <= 0
			) {
				this.$message.error('填入的价格比例有误')
				return false
			}
			if (
				this.formInline.lowPrice1 == 1 ||
				this.formInline.supplyPrice == 1 ||
				this.formInline.lowPrice2 == 1
			) {
				this.$message.error('填入的价格不可等于"1"')
				return false
			}
			let goodsIdList = []
			if (this.row) {
				goodsIdList.push(this.row.goodsId)
			}
			let paramJson = {
				goodsIdList: goodsIdList,
				checkResult: 1,
				lowPrice1: Number(this.formInline.lowPrice1).toFixed(2),
				lowPrice2: Number(this.formInline.lowPrice2).toFixed(2),
				supplyPrice: Number(this.formInline.supplyPrice).toFixed(2),
			}
			let res = await checkGoodsPrice(paramJson)
			res = res.data
			if (res.resultCode === 0) {
				this.$message({
					message: '成功！',
					type: 'success',
				})
				this.$emit('refreshList')
				this.localVisible = false
				this.formInline.lowPrice1 = ''
				this.formInline.lowPrice2 = ''
				this.formInline.supplyPrice = ''
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>

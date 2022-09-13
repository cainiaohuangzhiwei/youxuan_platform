<template>
	<div>
		<el-dialog
			width="450px"
			title="驳回原因"
			:inline="true"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<yx-form
				ref="form"
				:inline="false"
				:items="item"
				:data="batchData"
				:rules="funRules"
				labelWidth="80px"
				:formAction="funAction"
			>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { rejectGoods } from '@/api/goodsList'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		batchRejectGoodsId: {
			default: false,
		},
		selectionData: {
			type: Array,
			default: () => [],
		},
	},

	components: {
		YxForm,
	},

	data() {
		return {
			item: [
				{
					title: '填写原因',
					type: 'textarea',
					dataIndex: 'checkReason',
				},
			],
			batchData: {
				checkReason: '',
			},
			funRules: {
				checkReason: [
					{ required: true, message: '请填驳回原因', trigger: 'blur' },
				],
			},
			funAction: [
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
		// 保存
		async submitForm() {
			const goodsId = this.selectionData.map((item) => {
				return item.goodsId
			})
			const paramJson = Object.assign(this.batchData, {
				goodsIdList: this.batchRejectGoodsId
					? [this.batchRejectGoodsId]
					: goodsId,
			})
			const {
				data: { resultCode, resultMsg },
			} = await rejectGoods(paramJson)

			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.$emit('fatherMethodInit')
				this.resetForm()
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

<style lang="scss" scoped></style>

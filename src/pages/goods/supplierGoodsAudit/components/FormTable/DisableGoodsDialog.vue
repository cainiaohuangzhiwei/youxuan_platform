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
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			></yx-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="localVisible = false">取 消</el-button>
				<el-button type="primary" @click="checkGoodsPrice">确 定</el-button>
			</span>
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
		selectRow: {
			type: Array,
			default: () => [],
		},
	},
	components: {
		YxForm,
	},
	data() {
		return {
			formInline: {
				remark: '',
			},
			formCfg: [
				{
					title: '理由',
					type: 'textarea',
					maxlength: 50,
					dataIndex: 'remark',
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
				this.formInline.remark = ''
				this.$emit('update:visible', val)
			},
		},
	},
	methods: {
		async checkGoodsPrice() {
			if (this.formInline.remark == '') {
				this.$message.error('请填写审核不通过的理由')
				return
			}
			let goodsIdList = []
			if (this.row) {
				goodsIdList.push(this.row.goodsId)
			}
			if (this.selectRow && this.selectRow.length) {
				goodsIdList = this.selectRow.map((item) => {
					return item.goodsId
				})
			}
			let paramJson = {
				goodsIdList: goodsIdList,
				checkResult: 2,
				checkReason: this.formInline.remark,
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
				this.formInline.remark = ''
			} else {
				this.$message.error(res.resultMsg)
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>

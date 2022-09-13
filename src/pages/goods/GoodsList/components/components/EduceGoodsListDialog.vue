<template>
	<div>
		<el-dialog
			width="700px"
			title="导出商品列表"
			:inline="false"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<yx-form
				ref="form"
				:inline="false"
				:items="item"
				:data="formData"
				:rules="formRules"
				:formAction="formAction"
				labelWidth="80px"
			>
				<template #checkedField>
					<el-checkbox
						:indeterminate="isIndeterminate"
						v-model="formData.checkAll"
						@change="handleCheckAllChange"
						>全选</el-checkbox
					>
					<div style="margin: 15px 0"></div>
					<el-checkbox-group
						v-model="formData.checkedField"
						@change="handleCheckedCitiesChange"
					>
						<el-checkbox
							v-for="(item, index) in fieldList"
							:label="item"
							:key="index"
							>{{ item }}</el-checkbox
						>
					</el-checkbox-group>
				</template>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { downloadFile } from '@/utils/helper/common'
import { exportGoodsOfPassDetails } from '@/api/goodsList'
const fieldOptions = [
	'商家名称',
	'会场名称',
	'货号',
	'商品名称',
	'状态',
	'颜色',
	'尺寸',
	'条形码',
	'排序值',
	'结算价',
	'供货价',
	'建议零售价',
	'外网价',
	'市场价',
	'库存数量',
	'销售状态',
	'商家建议最低销售价',
]
const fieldOptionsMap = {
	商家名称: 'supplierName',
	会场名称: 'brandName',
	货号: 'goodsNumber',
	商品名称: 'goodsName',
	状态: 'shelfState',
	颜色: 'specOne',
	尺寸: 'specTwo',
	条形码: 'barCode',
	排序值: 'sortOrder',
	结算价: 'costPrice',
	供货价: 'supplyPrice',
	建议零售价: 'lowestPrice',
	外网价: 'highestPrice',
	市场价: 'marketPrice',
	库存数量: 'stock',
	销售状态: 'isSales',
	商家建议最低销售价: 'supplierPrice',
}

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		exportSpecData: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm,
	},

	data() {
		return {
			fieldList: fieldOptions,
			isIndeterminate: true,
			item: [
				{
					title: '字段选择',
					type: 'custom',
					dataIndex: 'checkedField',
				},
			],
			formData: {
				checkedField: fieldOptions,
				checkAll: true,
			},
			formRules: {
				checkedField: [
					{ required: true, message: '请选择字段', trigger: 'blur' },
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
		// 保存
		async submitForm() {
			const fieldArr = []
			const { checkedField } = this.formData

			for (let i = 0; i < checkedField.length; i++) {
				fieldArr.push(fieldOptionsMap[checkedField[i]])
			}
			const loading = this.$loading({
				lock: true,
				text: '导出中',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)',
			})
			this.exportSpecData.headList = fieldArr
			const { data } = await exportGoodsOfPassDetails(this.exportSpecData)
			downloadFile(data, '商品列表.xlsx')
			loading.close()
			this.resetForm()
		},

		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.$refs.form.$refs.YxForm.resetFields()
		},

		// 全选
		handleCheckAllChange(val) {
			this.formData.checkedField = val ? fieldOptions : []
			this.isIndeterminate = false
		},

		// 操作字段选择
		handleCheckedCitiesChange(value) {
			let checkedCount = value.length
			this.formData.checkAll = checkedCount === this.fieldList.length
			this.isIndeterminate =
				checkedCount > 0 && checkedCount < this.fieldList.length
		},
	},
}
</script>

<style lang="scss" scoped></style>

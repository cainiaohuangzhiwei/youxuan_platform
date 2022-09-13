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
			<template slot="fatherGoodsCategoryName" slot-scope="scope">
				<div>
					<el-input
						v-if="itemInfo.type == 1"
						disabled="disabled"
						class="form_input"
						v-model.trim="itemInfo.fatherGoodsCategoryName"
						style="width: 300px"
					>
					</el-input>
					<el-input
						v-else
						disabled="disabled"
						class="form_input"
						v-model.trim="scope.data.fatherGoodsCategoryName"
						style="width: 300px"
					>
					</el-input>
					<div>无一级类目默认填充为一级类目</div>
					<!-- <div class="dis_f_ac">{{ scope.data.fatherGoodsCategoryName }}</div> -->
				</div>
			</template>
			<template slot="goodsCategoryName" slot-scope="scope">
				<div>
					<div class="dis_f_ac">
						<el-input
							class="form_input"
							v-model.trim="scope.data.goodsCategoryName"
							placeholder="请输入类目名称"
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
import { editGoodsCategory, addGoodsCategory } from '@/api/goodsList'
import { isNull } from '@/utils/helper/common'
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
			dialogTitle: '',
			visible: false,
			dialogData: {
				goodsCategoryId: '',
				fatherGoodsCategoryName: '', // 上级分类
				goodsCategoryName: '', // 类目名称:
			},
			rules: {
				goodsCategoryName: [
					{
						validator: (rule, value, callback) => {
							if (value === '') {
								callback(new Error('类目名称不能为空'))
							} else {
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
					dataIndex: 'fatherGoodsCategoryName',
					title: '上级类目',
				},
				{
					type: 'custom',
					dataIndex: 'goodsCategoryName',
					title: '类目名称',
				},
			],
		}
	},
	methods: {
		async getUpdateGrossMargins() {},
		async saveGrossMargins() {
			let paramJson = Object.assign(
				{},
				{
					goodsCategoryId: this.dialogData.goodsCategoryId,
					goodsCategoryName: this.dialogData.goodsCategoryName,
				}
			)
			if (isNull(paramJson.goodsCategoryName)) {
				this.$message.warning({ message: '请填写类目名称' })
				return
			}
			let addUrl = null
			if (this.itemInfo.type == 1) {
				addUrl = addGoodsCategory
				paramJson.goodsCategoryFatherId = this.itemInfo.atPresentId
			} else {
				addUrl = editGoodsCategory
				paramJson.goodsCategoryId = this.itemInfo.goodsCategoryId
			}
			let res = await addUrl(paramJson)
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
			if (this.itemInfo.type == 1) {
				this.dialogTitle = '新增类目'
			} else {
				this.dialogTitle = '编辑类目'
			}

			this.$emit('update:dialogVisible', newVlaue)
			if (this.visible) {
				if (this.itemInfo && this.itemInfo.goodsCategoryId) {
					this.dialogData = Object.assign({}, this.itemInfo)

					if (this.dialogData.fatherGoodsCategoryName === null) {
						this.dialogData.fatherGoodsCategoryName = ''
					}
				} else {
					this.dialogData = {
						goodsCategoryId: '',
						fatherGoodsCategoryName: '',
					}
				}
			}
			if (
				this.itemInfo.type == 1 &&
				this.itemInfo.goodsCategoryList &&
				this.itemInfo.goodsCategoryList[0].goodsCategoryLevel > 2 &&
				this.itemInfo.goodsCategoryList.length > 0
			) {
				let index = this.itemInfo.fatherGoodsCategoryName.lastIndexOf('>')
				let aCategoryName = this.itemInfo.fatherGoodsCategoryName.substring(
					index + 1
				)
				this.itemInfo.fatherGoodsCategoryName = aCategoryName
			} else {
				let indexA = this.dialogData.fatherGoodsCategoryName.lastIndexOf('>')
				let bCategoryName = this.dialogData.fatherGoodsCategoryName.substring(
					indexA + 1
				)
				this.dialogData.fatherGoodsCategoryName = bCategoryName
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

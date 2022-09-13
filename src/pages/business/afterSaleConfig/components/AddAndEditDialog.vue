<template>
	<div>
		<el-dialog
			width="650px"
			title="新增属性"
			append-to-body
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="init"
		>
			<div v-loading="loading">
				<yx-form
					ref="form"
					:inline="false"
					:items="item"
					:data="searchData"
					:rules="rules"
					:labelWidth="'180px'"
					:formAction="searchAction"
				>
					<template #goodsCategoryName>
						<span>{{ searchData.goodsCategoryName }}</span>
					</template>
				</yx-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { saveOrUpdate } from '@/api/yhtPlusCmsGoodsCategoryAttribute'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		options: {
			type: Object,
			default: () => ({}),
		},
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm,
	},

	data() {
		return {
			listLoading: false,
			basicsAttributeList: [],
			newOptions: [],
			defaultProps: {
				children: 'goodsCategoryChildList',
				label: 'goodsCategoryName',
				value: 'goodsCategoryId',
			},
			goodsBasicsAttributeItems: [],
			item: [
				{
					type: 'custom',
					title: '已选类目',
					dataIndex: 'goodsCategoryName',
				},
				{
					type: 'select',
					title: '选择七天无理由支持类型',
					dataIndex: 'sevenDaysWithoutReasonConfigType',
					placeholder: '请选择',
					label: 'value',
					options: [
						{
							sevenDaysWithoutReasonConfigType: 1,
							value: '不支持',
						},
						{
							sevenDaysWithoutReasonConfigType: 2,
							value: '支持',
						},
						{
							sevenDaysWithoutReasonConfigType: 3,
							value: '商家可跟据商品调整',
						},
					],
				},
			],
			searchData: {
				goodsCategoryName: '',
				sevenDaysWithoutReasonConfigType: '',
			},
			rules: {
				sevenDaysWithoutReasonConfigType: [
					{ required: true, message: '请选择是否可必填', trigger: 'blur' },
				],
			},
			loading: false,
			searchAction: [
				{
					hide: false,
					title: '保存',
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
		// 初始化
		init() {
			this.searchData.goodsCategoryName = this.itemInfo.goodsCategoryName
			if (this.itemInfo.sevenDaysWithoutReasonConfigType) {
				this.searchData.sevenDaysWithoutReasonConfigType =
					this.itemInfo.sevenDaysWithoutReasonConfigType
			}
		},
		// 关闭弹窗
		resetForm() {
			this.searchData = {
				goodsCategoryName: '',
				sevenDaysWithoutReasonConfigType: '',
			}
			this.$refs.form.$refs.YxForm.clearValidate()
			this.localVisible = false
		},

		// 保存
		async submitForm() {
			this.loading = true
			const {
				data: { resultCode },
			} = await saveOrUpdate({
				sourceType: 0, //来源类型 null或者0：普通，1：商家端
				targetType: 1, //目标类型 0:初始化 1:类目 2:商品
				targetIdList: [this.itemInfo.goodsCategoryId], //目标ID 商品ID或者类目ID
				configType: this.searchData.sevenDaysWithoutReasonConfigType, //配置类型 0:初始化 1:不支持 2:支持，3:商家可跟据商品调整
			})
			this.loading = false
			if (resultCode == 0) {
				this.$message({
					message: '编辑成功!',
					type: 'success',
				})
				this.resetForm()
				this.$emit('fatherMethodInit')
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.btn {
	text-align: right;
}
.add-tabel {
	margin-bottom: 18px;
	margin-top: -24px;
}
.fr {
	float: right;
}
.span-item {
	margin-right: 5px;
}
</style>

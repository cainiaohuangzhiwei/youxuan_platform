<template>
	<div>
		<el-dialog
			width="600px"
			:title="`${title}分类`"
			:visible.sync="localVisible"
			:before-close="close"
			@open="open"
		>
			<yx-form
				ref="form"
				v-loading="loading"
				labelWidth="140px"
				:items="item"
				:rules="funRules"
				:data="formData"
				:formAction="formAction"
			>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import { updateMaterialClassify, addMaterialClassify } from '@/api/newMaterial'
import YxForm from '@wg-vue-materials/yx-form'

export default {
	props: {
		//是否显示弹窗
		visible: {
			type: Boolean,
			default: false,
		},
		//弹窗标题
		title: {
			type: String,
			default: '',
		},
		//编辑数据
		row: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm,
	},

	data() {
		let validateSort = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入排序值'))
			} else if (value <= 0 || value > 999 || !/^[0-9]+$/.test(value)) {
				callback(new Error('排序值需大于0并且小于或等于999'))
			} else {
				callback()
			}
		}
		return {
			formData: {
				materialClassifyName: '', //素材分类
				sortOrder: '', //排序值
				status: 2, //状态
			},
			item: [
				{
					title: '分类',
					dataIndex: 'materialClassifyName',
					maxlength: 6,
				},
				{
					dataIndex: 'sortOrder',
					title: '排序值',
					maxlength: 3,
				},
				{
					title: '状态',
					type: 'radio',
					dataIndex: 'status',
					label: 'value',
					options: [
						{
							status: 2,
							value: '启用',
						},
						{
							status: 1,
							value: '禁用',
						},
					],
				},
			],
			loading: false,
			formsDialog: false,
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.saveData()
					},
				},
				{
					title: '取消',
					type: 'default',
					cancel: true,
					click: () => {
						this.localVisible = false
					},
				},
			],
			funRules: {
				materialClassifyName: [{ required: true, message: '请填写分类' }],
				// sortOrder: [{ required: true, message: '请填写排序值' }],
				sortOrder: [
					{ required: true, validator: validateSort, trigger: 'blur' },
				],
				status: [{ required: true, message: '请选择状态' }],
			},
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
		//保存
		async saveData() {
			let paramsData = {
				...this.formData,
			}
			let requestApi = null
			if (this.row.materialClassifyId) {
				//编辑
				paramsData.materialClassifyId = this.row.materialClassifyId
				requestApi = updateMaterialClassify
			} else {
				// 新增
				requestApi = addMaterialClassify
			}
			this.loading = true
			const res = await requestApi(paramsData)
			const resultCode = res.data.resultCode
			if (resultCode == 0) {
				this.$message({
					message: '操作成功',
					type: 'success',
				})
				this.localVisible = false
				this.$emit('initTable')
			}
			this.loading = false
		},
		//关闭弹窗
		close() {
			this.localVisible = false
		},
		//重置form表单数据
		resetForm() {
			// this.$refs.form.$refs.YxForm.resetFields()
			this.formData = {
				materialClassifyName: '', //素材分类
				sortOrder: '', //排序值
				status: 2, //状态
			}
		},
		//打开素材应用弹窗
		async open() {
			// this.$refs.form && this.$refs.form.$refs.YxForm.resetFields()
			this.resetForm()
			this.loading = false
			if (this.row.materialClassifyId) {
				this.formData = {
					...this.row,
				}
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.brandTag,
.goodsTag {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	button {
		margin-right: 6px;
	}
}
.tagItem {
	margin-right: 6px;
	margin-bottom: 6px;
}
</style>

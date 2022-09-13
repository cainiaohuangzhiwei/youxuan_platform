<template>
	<div>
		<el-dialog
			width="650px"
			:title="title"
			append-to-body
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			@close="resetForm"
			@open="init"
		>
			<div v-loading="loading">
				<yx-form
					ref="form"
					:inline="false"
					:items="item"
					:data="searchData"
					:rules="funRules"
					:labelWidth="'100px'"
					:formAction="dialogAction"
				>
				</yx-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import {
	addGoodsCategoryFront,
	updateGoodsCategoryFront,
} from '@/api/goodsCategoryFront'

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
		type: {
			type: String,
			default: '',
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
			dialogAction: [
				{
					title: '保存',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
			],
			item: [
				{
					title: '上级分类',
					dataIndex: 'fatherCategoryName',
					placeholder: '请输入上级分类',
					disabled: true,
				},
				{
					title: '分类名称',
					dataIndex: 'categoryName',
					placeholder: '请输入属性名称',
					maxlength: 15,
				},
				{
					type: 'inputNumber',
					title: '排序值',
					dataIndex: 'sort',
					placeholder: '请输入属性名称',
					maxlength: 3,
				},
				{
					type: 'radio',
					title: '类型',
					dataIndex: 'categoryType',
					label: 'value',
					options: [
						{
							categoryType: 1,
							value: '常规类目',
						},
						{
							categoryType: 2,
							value: '活动类目',
						},
					],
					change: (val) => {
						if (val == 1) {
							this.item[4].hide = true
						} else {
							this.item[4].hide = false
						}
					},
				},
				{
					type: 'time',
					title: '展示时间',
					dataIndex: 'showTime',
					hide: true,
					timeAttributes: {
						type: 'datetimerange',
					},
				},
				{
					type: 'radio',
					title: '状态',
					dataIndex: 'enableStatus',
					label: 'value',
					options: [
						{
							enableStatus: 0,
							value: '禁用',
						},
						{
							enableStatus: 1,
							value: '启用',
						},
					],
				},
			],
			searchData: {
				fatherCategoryName: '',
				categoryName: '',
				sort: 10,
				showTime: [],
				categoryType: 1,
				enableStatus: 0,
			},
			funRules: {
				categoryName: [
					{ required: true, message: '请填写分类名称!', trigger: 'blur' },
				],
				sort: [{ required: true, message: '请填写排序值!', trigger: 'blur' }],
				categoryType: [
					{ required: true, message: '请选择类型!', trigger: 'blur' },
				],
				enableStatus: [
					{ required: true, message: '请选择状态!', trigger: 'blur' },
				],
				showTime: [
					{ required: true, message: '请选择展示时间!', trigger: 'blur' },
				],
			},
			loading: false,
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
		// 获取商家列表
		init() {
			if (this.type == 'edit') {
				if (this.itemInfo.validStartTime) {
					this.item[4].hide = false
				} else {
					this.item[4].hide = true
				}
				this.searchData = {
					fatherCategoryName: this.itemInfo.parentName,
					categoryName: this.itemInfo.categoryName,
					sort: this.itemInfo.sort,
					showTime: this.itemInfo.validStartTime
						? [this.itemInfo.validStartTime, this.itemInfo.validEndTime]
						: [],
					categoryType: this.itemInfo.categoryType,
					enableStatus: this.itemInfo.enableStatus,
				}
			} else {
				this.searchData = {
					fatherCategoryName: this.itemInfo.categoryName,
					categoryName: '',
					sort: 10,
					showTime: [],
					categoryType: 1,
					enableStatus: 0,
				}
			}
			if (
				this.itemInfo.categoryLevel == 2 ||
				(this.itemInfo.categoryLevel == 1 && this.type == 'new')
			) {
				this.item[0].hide = false
			} else {
				this.item[0].hide = true
			}
		},
		// 关闭弹窗
		resetForm() {
			this.searchData = {
				fatherCategoryName: '',
				categoryName: '',
				sort: 10,
				showTime: [],
				categoryType: 1,
				enableStatus: 0,
			}
			this.item[0].hide = true
			this.item[4].hide = true
			this.localVisible = false
		},

		// 保存
		async submitForm() {
			if (this.searchData.sort <= 0 || this.searchData.sort > 100) {
				this.$message({
					message: '"排序值"请输入范围为1~100的整数!',
					type: 'error',
				})
				return
			}
			this.loading = true
			if (this.type == 'new') {
				const {
					data: { resultCode },
				} = await addGoodsCategoryFront(
					Object.assign(this.searchData, {
						categoryLevel: this.itemInfo.categoryLevel
							? this.itemInfo.categoryLevel + 1
							: 1,
						validStartTime:
							this.searchData.categoryType == 2
								? new Date(this.searchData.showTime[0]).getTime()
								: '',
						validEndTime:
							this.searchData.categoryType == 2
								? new Date(this.searchData.showTime[1]).getTime()
								: '',
						parentId: this.itemInfo.goodsCategoryFrontId || '',
					})
				)
				this.loading = false
				if (resultCode == 0) {
					this.$message({
						message: '新建成功!',
						type: 'success',
					})
					this.resetForm()
					this.$emit('fatherMethodInit')
				}
			} else if (this.type == 'edit') {
				const {
					data: { resultCode },
				} = await updateGoodsCategoryFront(
					Object.assign(this.searchData, {
						categoryLevel: this.itemInfo.categoryLevel,
						validStartTime:
							this.searchData.categoryType == 2
								? new Date(this.searchData.showTime[0]).getTime()
								: '',
						validEndTime:
							this.searchData.categoryType == 2
								? new Date(this.searchData.showTime[1]).getTime()
								: '',
						goodsCategoryFrontId: this.itemInfo.goodsCategoryFrontId,
					})
				)
				this.loading = false
				if (resultCode == 0) {
					this.$message({
						message: '编辑成功!',
						type: 'success',
					})
					this.resetForm()
					this.$emit('fatherMethodInit')
				}
			}
		},
	},
}
</script>

<template>
	<div class="commonProblems">
		<basicContainer>
			<div class="goods-group-btn-box">
				<el-button type="primary" @click="showDialog108">新增</el-button>
			</div>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns106"
				:pagination="page106"
				:data="tableData106"
			></yx-table>
			<Dialog
				:title="dialogTitle108"
				:visible.sync="dialogVisible108"
				:width="dialogWidth108"
				:bottomBtn="dialogBottomBtn108"
			>
				<yx-form
					labelWidth="100px"
					ref="dialog109"
					:data="formData109"
					:items="formCfg109"
					:formAction="formAction109"
					:rules="formRules109"
				>
				</yx-form>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import {
	categoryList,
	createCategory,
	updateCategory,
} from '@/api/commonProblem'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},
	props: [],
	data() {
		return {
			isShow: false,
			loading: false,
			tableData106: [],
			tableColumns106: [
				{
					type: 'string',
					dataIndex: 'problemCategoryId',
					title: '类别id',
				},
				{
					type: 'string',
					dataIndex: 'categoryName',
					title: '问题类别',
				},
				{
					type: 'string',
					dataIndex: 'sortOrder',
					title: '排序值',
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.formData109 = Object.assign({}, row)
								this.$nextTick(() => {
									this.$refs.dialog109.$refs.YxForm.clearValidate()
								})
								this.dialogVisible108 = true
							},
						},
					],
				},
			],
			page106: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			formRules109: {
				categoryName: [
					{ required: true, message: '请输入问题类别', trigger: 'blur' },
				],
				sortOrder: [
					{ required: true, message: '请输入排序值', trigger: 'blur' },
				],
			},
			dialogTitle108: '新增问题类别',
			dialogWidth108: '500px',
			dialogVisible108: false,
			dialogBottomBtn108: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog109.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.issueSave()
								// this.dialogVisible105 = false
							}
						})
						// this.dialogVisible108 = false
					},
				},
			],
			formData109: {
				categoryName: '',
				sortOrder: '',
			},
			formCfg109: [
				{
					type: 'input',
					title: '问题类别',
					dataIndex: 'categoryName',
					placeholder: '请输入问题类别',
				},
				{
					type: 'inputNumber',
					title: '排序值',
					dataIndex: 'sortOrder',
					placeholder: '请输入排序值',
				},
			],
			formAction109: [],
		}
	},

	methods: {
		showDialog108() {
			this.formData109 = {
				categoryName: '',
				sortOrder: '',
			}
			this.$nextTick(() => {
				this.$refs.dialog109.$refs.YxForm.clearValidate()
			})
			this.dialogVisible108 = true
		},
		issueSave: async function () {
			let paramJson = {
				categoryName: this.formData109.categoryName,
				sort: this.formData109.sortOrder,
			}
			let res = null
			let flag = false
			if (this.formData109.problemCategoryId) {
				paramJson.problemCategoryId = this.formData109.problemCategoryId
				res = await updateCategory(paramJson)
			} else {
				flag = true
				res = await createCategory(paramJson)
			}
			let {
				data: { resultCode, resultMsg },
			} = res
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.init(flag)
				this.dialogVisible108 = false
			}
		},
		init: async function (flag) {
			this.loading = true
			let paramJson = this.findSearchParams106(flag)
			const {
				data: { resultCode, resultData },
			} = await categoryList(paramJson)
			if (resultCode == 0) {
				this.isShow = true
				this.tableData106 = resultData.problemCategoryList
				this.page106.count = resultData.count
			} else {
				this.page106.count = 0
				this.tableData106 = []
			}
			this.loading = false
		},
		findSearchParams106(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page106.currentPage = 1
			}
			const paramJson = Object.assign(
				{},
				{
					length: this.page106.length,
					startIndex: (this.page106.currentPage - 1) * this.page106.length,
				}
			)
			return paramJson
		},
	},
}
</script>
<style lang="scss" scope>
.goods-group-btn-box {
	margin-bottom: 20px;
}
</style>

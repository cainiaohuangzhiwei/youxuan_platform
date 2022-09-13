<template>
	<div class="curriculumClassifyStatistics">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData113"
				:items="formCfg113"
				:formAction="formAction113"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading114"
				:columns="tableColumns114"
				:pagination="page114"
				:data="tableData114"
			></yx-table>
			<Dialog
				:title="dialogTitle115"
				:visible.sync="dialogVisible115"
				:width="dialogWidth115"
				:bottomBtn="dialogBottomBtn115"
			>
				<yx-form
					ref="dialog116"
					labelWidth="120px"
					:data="formData116"
					:items="formCfg116"
					:rules="formRules116"
					:formAction="formAction116"
				>
					<template slot="sortTip">
						<div>数字越大，排序越前（最大值不超过255）</div>
					</template>
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
	getCurriculumClassifyList,
	updateCurriculumClassify,
	addCurriculumClassify,
	delCurriculumClassify,
} from '@/api/businessSchool'

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
			formData113: {},
			formCfg113: [],
			formAction113: [
				{
					title: '新增课程分类',
					type: 'warning',
					auth: '',
					dialogId: 137,
					click: () => {
						this.formData116 = {
							classifyName: '',
							sort: '',
						}
						this.$nextTick(() => {
							this.$refs.dialog116.$refs.YxForm.clearValidate()
						})
						this.dialogVisible115 = true
					},
				},
			],
			loading114: false,
			tableData114: [],
			tableColumns114: [
				{
					type: 'string',
					dataIndex: 'classifyName',
					title: '课程分类名称',
				},
				{
					type: 'string',
					dataIndex: 'sort',
					title: '排序值',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '编辑',
							auth: 'updateBusinessSchool',
							dialogId: 137,
							click: (row) => {
								this.updateCurriculumClassifyInfo(row)
							},
						},
						{
							title: '删除',
							auth: 'updateBusinessSchool',
							dialogId: '',
							popconfirm: true,
							popconfirmTitle: '确认要删除该课程分类吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._delCurriculumClassify(row)
							},
						},
					],
				},
			],
			page114: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			dialogTitle115: '新增课程分类',
			dialogWidth115: '600px',
			dialogVisible115: false,
			dialogBottomBtn115: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog116.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveClassifyList()
								// this.dialogVisible105 = false
							}
						})
					},
				},
			],
			formData116: {
				classifyName: '',
				sort: '',
			},
			formRules116: {
				classifyName: [
					{ required: true, message: '请输入课程分类名称', trigger: 'blur' },
				],
				sort: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入排序值'))
							} else if (value > 255) {
								callback(new Error('排序值最高不超过255'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			formCfg116: [
				{
					type: 'input',
					title: '课程分类名称',
					dataIndex: 'classifyName',
					placeholder: '请输入课程分类名称',
				},
				{
					type: 'inputNumber',
					title: '排序值',
					dataIndex: 'sort',
					placeholder: '请输入排序值',
				},
				{
					type: 'custom',
					dataIndex: 'sortTip',
					title: '',
				},
			],
			formAction116: [],
		}
	},

	methods: {
		_delCurriculumClassify: async function ({ id }) {
			let {
				data: { resultCode, resultMsg },
			} = await delCurriculumClassify({ curriculumClassifyId: id })
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.init(true)
			}
		},
		saveClassifyList: async function () {
			let paramJson = {
				classifyName: this.formData116.classifyName,
				sort: this.formData116.sort,
			}
			let res = null
			let flag = false
			if (this.formData116.id) {
				paramJson.curriculumClassifyId = this.formData116.id
				res = await updateCurriculumClassify(paramJson)
			} else {
				flag = true
				res = await addCurriculumClassify(paramJson)
			}
			let {
				data: { resultCode, resultMsg },
			} = res
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible115 = false
				this.init(flag)
			}
		},
		updateCurriculumClassifyInfo(row) {
			// 课程分类-编辑
			this.formData116 = Object.assign({}, row)
			this.dialogTitle115 = '编辑课程分类'
			this.$nextTick(() => {
				this.$refs.dialog116.$refs.YxForm.clearValidate()
			})
			this.dialogVisible115 = true
			this.$forceUpdate()
		},
		init: async function (flag) {
			this.loading114 = true
			let paramJson = this.findSearchParams114(flag)
			const {
				data: { resultCode, resultData },
			} = await getCurriculumClassifyList(paramJson)
			if (resultCode == 0) {
				this.isShow = true
				this.tableData114 = resultData.curriculumClassifyList
				this.page114.count = resultData.curriculumClassifyCount
			} else {
				this.tableData114 = []
				this.page114.count = 0
			}
			this.loading114 = false
		},
		findSearchParams114(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page114.currentPage = 1
			}
			const paramJson = Object.assign(this.formData113, {
				length: this.page114.length,
				startIndex: (this.page114.currentPage - 1) * this.page114.length,
			})
			return paramJson
		},
	},
}
</script>

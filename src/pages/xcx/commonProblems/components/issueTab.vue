<template>
	<div class="commonProblems">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData105"
				:items="formCfg105"
				:formAction="formAction105"
			>
			</yx-form>
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
					ref="dialog108"
					labelWidth="100px"
					:data="formData109"
					:items="formCfg109"
					:formAction="formAction109"
					:rules="formRules109"
				>
					<template slot="categoryName">
						<el-autocomplete
							placeholder="请选择问题类别"
							v-model="formData109.categoryName"
							:fetch-suggestions="querySearchAsync"
							@select="changeGoodsGroup"
							class="input-with-select"
						>
							<el-button
								@click="showDialog101"
								slot="append"
								icon="el-icon-more"
							></el-button>
						</el-autocomplete>
					</template>
					<template #content>
						<UE
							ref="um"
							:defaultMsg="information"
							:name="'ue' + timeOut"
							:isImageList="true"
							imageType="68"
							imageUrl="/weeget-infinite-backend-gateway/yhtplus/image/uploadImageList.action?action=uploadimage"
						></UE>
					</template>
				</yx-form>
			</Dialog>
			<Dialog
				:title="dialogTitle101"
				:visible.sync="dialogVisible101"
				:width="dialogWidth101"
				:bottomBtn="dialogBottomBtn101"
				><yx-table
					v-loading="loading102"
					:columns="tableColumns102"
					:pagination="page102"
					:data="tableData102"
				>
					<template slot="creatorId" slot-scope="scope">
						<el-radio
							v-model="formData109.categoryId"
							:label="scope.row.problemCategoryId"
							@change="changeGoodsGroup(scope.row)"
							>选择</el-radio
						>
					</template>
				</yx-table>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import UE from '@/components/RichText'
import Dialog from '@/components/Dialog'
import {
	commonProblemList,
	commonProblemDetail,
	categoryList,
	createCommonProblem,
	updateCommonProblem,
} from '@/api/commonProblem'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
		UE,
	},
	props: [],
	data() {
		let validatePass = (rule, value, callback) => {
			let val = this.$refs.um.editor.getContent()
			// let valText = val.replace(/<[^>]+>/g, '')
			if (!val.trim()) {
				callback(new Error('请输入消息内容'))
			} else {
				callback()
			}
		}
		return {
			isShow: false,
			timeOut: new Date().getTime(),
			dialogTitle101: '问题类别选择',
			formRules109: {
				title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
				sortOrder: [
					{ required: true, message: '请输入排序值', trigger: 'blur' },
				],
				content: [{ required: true, validator: validatePass, trigger: 'blur' }],
				categoryName: [
					{ required: true, message: '请选择问题类别', trigger: 'blur' },
				],
			},
			loading102: false,
			page102: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData102()
				},
			},
			tableColumns102: [
				{
					type: 'custom',
					dataIndex: 'creatorId',
				},
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
					title: '排序值',
					type: 'string',
					dataIndex: 'sortOrder',
				},
			],
			dialogVisible101: false,
			dialogWidth101: '800px',
			dialogBottomBtn101: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible101 = false
					},
				},
			],
			information: '',
			loading: false,
			formCfg105: [],
			formAction105: [
				{
					title: '新增',
					type: 'primary',
					click: () => {
						this.addCommonProblem()
					},
				},
			],
			tableData106: [],
			tableColumns106: [
				{
					type: 'string',
					dataIndex: 'title',
					title: '标题',
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
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '编辑',
							auth: '',
							click: (row) => {
								this._commonProblemDetail(row)
							},
							dialogId: 108,
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
			dialogTitle108: '编辑问题',
			dialogWidth108: '70%',
			dialogVisible108: false,
			dialogBottomBtn108: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog108.$refs.YxForm.validate((valid) => {
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
				title: '',
				orderSn: '',
				sortOrder: '',
				content: '',
			},
			formCfg109: [
				{
					type: 'input',
					title: '标题',
					dataIndex: 'title',
					placeholder: '请输入商家名称',
				},
				{
					type: 'custom',
					title: '问题类别',
					dataIndex: 'categoryName',
				},
				{
					title: '排序值',
					type: 'input',
					dataIndex: 'sortOrder',
					placeholder: '请输入排序值',
				},
				{
					type: 'custom',
					title: '内容',
					dataIndex: 'content',
				},
			],
			formAction109: [],
		}
	},

	methods: {
		issueSave: async function () {
			let paramJson = {
				title: this.formData109.title,
				sort: this.formData109.sortOrder,
				categoryId: this.formData109.problemCategoryId,
				content: this.$refs.um.editor.getContent(),
				commonProblemImage: this.$refs.um.getInformationImageList(),
			}
			let flag = false
			let res = null
			if (this.formData109.commonProblemId) {
				paramJson.commonProblemId = this.formData109.commonProblemId
				res = await updateCommonProblem(paramJson)
			} else {
				flag = true
				res = await createCommonProblem(paramJson)
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
		getData102: async function (flag) {
			this.loading102 = true
			let paramJson = this.findSearchParams123(flag)
			const {
				data: { resultCode, resultData },
			} = await categoryList(paramJson)
			if (resultCode == 0) {
				this.tableData102 = resultData.problemCategoryList
				this.page102.count = resultData.count
			} else {
				this.tableData102 = []
				this.page102.count = 0
			}
			this.loading102 = false
		},
		findSearchParams123(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			const paramJson = Object.assign(
				{},
				{
					length: this.page102.length,
					startIndex: (this.page102.currentPage - 1) * this.page102.length,
				}
			)
			return paramJson
		},
		showDialog101() {
			this.dialogVisible101 = true
			this.getData102(true)
		},
		changeGoodsGroup(row) {
			this.formData109 = Object.assign(this.formData109, row)
		},
		querySearchAsync: async function (queryString = '', cb) {
			console.log(queryString)
			let {
				data: { resultCode, resultData },
			} = await categoryList({
				startIndex: 0,
				length: 20,
			})
			if (resultCode == 0) {
				resultData.problemCategoryList.map((item) => {
					item.value = item.categoryName
				})
				cb(resultData.problemCategoryList)
			}
		},
		addCommonProblem() {
			this.dialogTitle108 = '新增问题'
			this.formData109 = {
				title: '',
				categoryName: '',
				problemCategoryId: '',
				sortOrder: '',
			}
			this.$nextTick(() => {
				this.information = ''
				this.$refs.dialog108.$refs.YxForm.clearValidate()
			})
			this.dialogVisible108 = true
		},
		_commonProblemDetail: async function ({ commonProblemId }) {
			let {
				data: { resultCode, resultData },
			} = await commonProblemDetail({ commonProblemId })
			if (resultCode == 0) {
				this.dialogTitle108 = '编辑问题'
				this.formData109 = Object.assign({}, resultData)
				this.$nextTick(() => {
					this.information = resultData.content || 'default'
				})
				this.dialogVisible108 = true
			}
		},
		init: async function (flag) {
			this.loading = true
			let paramJson = this.findSearchParams106(flag)
			const {
				data: { resultCode, resultData },
			} = await commonProblemList(paramJson)
			if (resultCode == 0) {
				this.isShow = true
				this.tableData106 = resultData.commonProblemList
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

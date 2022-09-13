<template>
	<div class="businessSchoolStatistics">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData103"
				:items="formCfg103"
				:formAction="formAction103"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading104"
				:columns="tableColumns104"
				:pagination="page104"
				:data="tableData104"
			>
				<template slot="link" slot-scope="scope">
					<div>
						<el-link type="primary" :href="scope.row.link" target="_blank">{{
							scope.row.link
						}}</el-link>
					</div>
				</template>
				<template slot="state" slot-scope="scope">
					<div>
						<el-tag v-if="scope.row.state == 1">启用</el-tag>
						<el-tag type="info" v-else-if="scope.row.state == 2">禁用</el-tag>
						<span v-else>-</span>
					</div>
				</template>
			</yx-table>
			<Dialog
				:title="dialogTitle105"
				:visible.sync="dialogVisible105"
				:width="dialogWidth105"
				:bottomBtn="dialogBottomBtn105"
			>
				<yx-form
					ref="dialog106"
					labelWidth="120px"
					:data="formData106"
					:items="formCfg106"
					:formAction="formAction106"
					:rules="formRules106"
				>
					<template slot="labelTip">
						<div>不同标签之间用英文,分隔，如(夏日美妆,新手教程)</div>
					</template>
					<template slot="sortTip">
						<div>排序值越大，标签显示位置越前（最大值不超过256）</div>
					</template>
					<template slot="classifyId">
						<el-autocomplete
							placeholder="请选择课程分类"
							v-model="formData106.classifyName"
							:fetch-suggestions="querySearchAsync"
							@select="changeClassifyId"
							class="input-with-select"
						>
							<el-button
								@click="openClassifyDialog"
								slot="append"
								icon="el-icon-more"
							></el-button>
						</el-autocomplete>
					</template>
				</yx-form>
			</Dialog>
			<Dialog
				:title="dialogTitle107"
				:visible.sync="dialogVisible107"
				:width="dialogWidth107"
				:bottomBtn="dialogBottomBtn107"
			>
				<yx-table
					v-loading="loading"
					:columns="tableColumns108"
					:pagination="page108"
					:data="tableData108"
				>
					<template slot="classifyId" slot-scope="scope">
						<el-radio
							v-model="formData106.classifyId"
							:label="scope.row.id"
							@change="changeClassifyId(scope.row)"
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
import Dialog from '@/components/Dialog'
import {
	getBusinessSchoolList,
	deleteBusinessSchoolByCurriculumId,
	getCurriculumClassifyList,
	updateBusinessSchoolByCurriculumId,
	addBusinessSchoolCurriculum,
} from '@/api/businessSchool'
import { getBigImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'

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
			formData103: {
				keyword: '',
			},
			formCfg103: [
				{
					type: 'input',
					title: '关键词',
					dataIndex: 'keyword',
					placeholder: '请输入关键词',
				},
			],
			formAction103: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						this.init(true)
					},
				},
				{
					title: '新增课程',
					type: 'primary',
					click: () => {
						this.formData106 = {
							title: '',
							subtitle: '',
							label: '',
							classifyId: '',
							classifyName: '',
							link: '',
							initNumber: '',
							sort: '',
							state: 1,
							image: [],
						}
						this.$nextTick(() => {
							this.$refs.dialog106.$refs.YxForm.clearValidate()
						})
						this.dialogVisible105 = true
					},
				},
			],
			loading104: false,
			activeRow104: {},
			tableData104: [],
			tableColumns104: [
				{
					type: 'string',
					dataIndex: 'title',
					title: '课程标题',
					width: '120',
				},
				{
					type: 'string',
					dataIndex: 'subtitle',
					title: '课程副标题',
					width: '200',
				},
				{
					type: 'image',
					dataIndex: 'imageUrl',
					title: '图片',
				},
				{
					type: 'string',
					dataIndex: 'label',
					title: '标签',
				},
				{
					type: 'string',
					dataIndex: 'classifyName',
					title: '课程分类',
				},
				{
					type: 'custom',
					dataIndex: 'link',
					title: '跳转链接',
				},
				{
					type: 'string',
					dataIndex: 'initNumber',
					title: '初始已学人数',
				},
				{
					type: 'string',
					dataIndex: 'sort',
					title: '排序值',
				},
				{
					type: 'custom',
					dataIndex: 'state',
					title: '状态',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '删除',
							auth: 'updateBusinessSchool',
							popconfirm: true,
							popconfirmTitle: '确认要删除该课程吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._deleteBusinessSchoolByCurriculumId(row)
							},
						},
						{
							title: '编辑',
							auth: 'updateBusinessSchool',
							click: (row) => {
								this.updateBusinessSchoolInfo(row)
							},
						},
					],
				},
			],
			page104: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			dialogTitle105: '新增课程',
			dialogWidth105: '800px',
			dialogVisible105: false,
			dialogBottomBtn105: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog106.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveCurriculum()
								// this.dialogVisible105 = false
							}
						})
					},
				},
			],
			formRules106: {
				title: [{ required: true, message: '请输入课程标题', trigger: 'blur' }],
				subtitle: [
					{ required: true, message: '请输入副标题', trigger: 'blur' },
				],
				link: [{ required: true, message: '请输入跳转链接', trigger: 'blur' }],
				initNumber: [
					{ required: true, message: '请输入初始已学人数', trigger: 'blur' },
				],
				sort: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入排序值'))
							} else if (value > 256) {
								callback(new Error('排序值最高不超过256'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				image: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData106.image.length) {
								callback(new Error('请上传图片!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			formData106: {
				title: '',
				subtitle: '',
				label: '',
				classifyId: '',
				classifyName: '',
				link: '',
				initNumber: '',
				sort: '',
				state: '',
				image: [],
			},
			formCfg106: [
				{
					type: 'input',
					title: '课程标题',
					dataIndex: 'title',
				},
				{
					title: '副标题',
					type: 'input',
					dataIndex: 'subtitle',
					placeholder: '',
				},
				{
					title: '标签',
					type: 'input',
					dataIndex: 'label',
					placeholder: '',
				},
				{
					type: 'custom',
					dataIndex: 'labelTip',
					title: '',
				},
				{
					title: '课程分类',
					type: 'custom',
					dataIndex: 'classifyId',
				},
				{
					title: '跳转链接',
					type: 'input',
					dataIndex: 'link',
					placeholder: '',
				},
				{
					title: '初始已学人数',
					type: 'inputNumber',
					dataIndex: 'initNumber',
					placeholder: '请输入初始已学人数',
				},
				{
					title: '排序值',
					type: 'inputNumber',
					dataIndex: 'sort',
				},
				{
					title: '',
					type: 'custom',
					dataIndex: 'sortTip',
				},
				{
					title: '状态',
					type: 'radio',
					dataIndex: 'state',
					placeholder: '',
					label: 'value',
					options: [
						{
							value: '启用',
							state: 1,
						},
						{
							value: '禁用',
							state: 2,
						},
					],
				},
				{
					type: 'uploadImage',
					title: '封面图',
					dataIndex: 'image',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'image',
						httpRequest: (file) => this.uploadImageHttpRequest(file, 'image'),
					},
				},
			],
			formAction106: [],
			dialogTitle107: '选择课程分类',
			dialogWidth107: '90%',
			dialogVisible107: false,
			dialogBottomBtn107: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible107 = false
					},
				},
			],
			loading108: false,
			tableData108: [],
			tableColumns108: [
				{
					type: 'custom',
					dataIndex: 'classifyId',
				},
				{
					type: 'string',
					dataIndex: 'classifyName',
					title: '课程分类',
				},
			],
			page108: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getDialogCurriculumClassifyList()
				},
			},
		}
	},

	methods: {
		saveCurriculum: async function () {
			let paramJson = {
				title: this.formData106.title,
				subtitle: this.formData106.subtitle,
				label: this.formData106.label,
				link: this.formData106.link,
				initNumber: this.formData106.initNumber,
				sort: this.formData106.sort,
				state: this.formData106.state,
			}
			if (this.formData106.image[0].imageId) {
				paramJson.Image = this.formData106.image[0]
				delete paramJson.image
			}
			if (this.formData106.classifyId) {
				paramJson.classifyId = this.formData106.classifyId
			}
			let res = null
			let flag = false
			if (this.formData106.curriculumId) {
				paramJson.curriculumId = this.formData106.curriculumId
				res = await updateBusinessSchoolByCurriculumId(paramJson)
			} else {
				flag = true
				res = await addBusinessSchoolCurriculum(paramJson)
			}
			let {
				data: { resultCode, resultMsg },
			} = res
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible105 = false
				this.init(flag)
			}
		},
		openClassifyDialog() {
			this._getDialogCurriculumClassifyList(true)
			this.dialogVisible107 = true
		},
		_getDialogCurriculumClassifyList: async function (flag) {
			console.log('_getDialogCurriculumClassifyList')
			this.loading108 = true
			let paramJson = this.findSearchParams108(flag)
			const {
				data: { resultCode, resultData },
			} = await getCurriculumClassifyList(paramJson)
			if (resultCode == 0) {
				this.tableData108 = resultData.curriculumClassifyList
				this.page108.count = resultData.curriculumClassifyCount
			} else {
				this.tableData108 = []
				this.page108.count = 0
			}
			this.loading108 = false
		},
		findSearchParams108(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page108.currentPage = 1
			}
			const paramJson = {
				length: this.page108.length,
				startIndex: (this.page108.currentPage - 1) * this.page108.length,
			}
			return paramJson
		},
		_deleteBusinessSchoolByCurriculumId: async function ({ curriculumId }) {
			let {
				data: { resultCode, resultMsg },
			} = await deleteBusinessSchoolByCurriculumId({ curriculumId })
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.init(true)
			}
		},
		async uploadImageHttpRequest(params, name) {
			//上传banner
			let formData = new FormData()
			formData.append('formId', '#portraitImageFrom')
			formData.append('data', JSON.stringify({ imageType: 50 }))
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			if (resultCode == 0) {
				resultData.imageList[0][name] = getBigImg(
					resultData.imageList[0].imageUrl
				)
				this.formData106[name] = resultData.imageList
			}
			// this.$forceUpdate()
		},
		updateBusinessSchoolInfo(row) {
			// 课程-编辑
			this.formData106 = Object.assign({}, row)
			this.formData106.image = [
				{
					image: getBigImg(this.formData106.image),
				},
			]
			this.dialogTitle105 = '编辑课程'
			this.$nextTick(() => {
				this.$refs.dialog106.$refs.YxForm.clearValidate()
			})
			this.dialogVisible105 = true
			this.$forceUpdate()
		},
		changeClassifyId(row) {
			this.formData106.classifyId = row.id
			this.formData106.classifyName = row.classifyName
		},
		querySearchAsync: async function (queryString = '', cb) {
			console.log(queryString)
			let {
				data: { resultCode, resultData },
			} = await getCurriculumClassifyList({
				startIndex: 0,
				length: 20,
			})
			if (resultCode == 0) {
				resultData.curriculumClassifyList.map((item) => {
					item.value = item.classifyName
				})
				cb(resultData.curriculumClassifyList)
			}
		},
		init: async function (flag) {
			this.loading104 = true
			let paramJson = this.findSearchParams104(flag)
			const {
				data: { resultCode, resultData },
			} = await getBusinessSchoolList(paramJson)
			if (resultCode == 0) {
				this.isShow = true
				this.tableData104 = resultData.curriculumList
				this.page104.count = resultData.curriculumCount
				this.tableData104.map((item) => {
					item.imageUrl = getBigImg(item.image)
				})
			} else {
				this.tableData104 = []
				this.page104.count = 0
			}
			this.loading104 = false
		},
		findSearchParams104(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page104.currentPage = 1
			}
			const paramJson = Object.assign(this.formData103, {
				length: this.page104.length,
				startIndex: (this.page104.currentPage - 1) * this.page104.length,
			})
			return paramJson
		},
	},
}
</script>
<style scoped>
.c_image {
	width: 150px;
}
</style>

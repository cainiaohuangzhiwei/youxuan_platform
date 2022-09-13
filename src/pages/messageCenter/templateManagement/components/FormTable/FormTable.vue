<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			>
				<template #searchKey>
					<el-input
						class="messageCenter_keyword_input"
						maxlength="200"
						placeholder="输入短信内容/短信名称匹配短信模板"
						v-model="formInline.searchKey"
						suffix-icon="el-icon-search"
					></el-input>
				</template>
			</yx-form>

			<el-row>
				<yx-table
					v-loading="loading"
					:columns="tableColumns"
					:selectionChange="selectionChange"
					:pagination="page"
					:data="templateList"
					><template slot="operating" slot-scope="scope">
						<el-button
							type="text"
							size="small"
							@click="openEditTeplateDialog(scope.row)"
							>编辑</el-button
						>
						<el-button
							type="text"
							size="small"
							@click="_updateStatus(scope.row)"
							>{{
								scope.row.templateStatus == 'ENABLE' ? '禁用' : '启用'
							}}</el-button
						>
					</template>
					<template slot="optName" slot-scope="scope">
						<div>
							{{ scope.row.optName }}
						</div>
						<div>
							{{ scope.row.updateTime }}
						</div>
					</template>
				</yx-table>
			</el-row>
		</div>
		<Dialog
			:title="dialogTitle194"
			:visible.sync="dialogVisible194"
			:width="dialogWidth194"
			:bottomBtn="dialogBottomBtn194"
			@before-close="templateDialogclose"
		>
			<yx-form
				ref="dialog194"
				v-loading="dialogLoading194"
				labelWidth="100px"
				:data="formData194"
				:items="formCfg194"
				:rules="rules194"
			>
				<template #keyword>
					<el-select v-model="formData194.keyword" placeholder="请选择">
						<el-option
							v-for="item in options"
							:key="item.keyword"
							:label="item.value"
							:value="item.keyword"
						>
						</el-option>
					</el-select>
				</template>
				<template #templateContent>
					<el-link
						type="primary"
						id="insertLink"
						@click="insertContentHandle(' {link01} ', ' {link02} ')"
						>+插入链接</el-link
					>
					<el-input
						@blur="blurEvent"
						type="textarea"
						v-on:input="searchData"
						id="inputName"
						placeholder="请输入内容"
						class="inputTextarea mb20"
						v-model="formData194.templateContent"
						maxlength="200"
						show-word-limit
					>
					</el-input>
					<div class="mb20" style="display: flex">
						<!-- <el-button
							type="danger"
							@click="linkInputText1Click(1)"
							style="margin-right: 10px"
							icon="el-icon-delete"
							circle
						></el-button> -->
						<el-input
							placeholder="请输入内容"
							v-on:input="linkInput01"
							v-model="link01"
						>
							<template slot="prepend">link01</template>
						</el-input>
					</div>
					<div style="display: flex">
						<!-- <el-button
							type="danger"
							@click="linkInputText1Click(2)"
							style="margin-right: 10px"
							icon="el-icon-delete"
							circle
						></el-button> -->
						<el-input
							placeholder="请输入内容"
							v-on:input="linkInput02"
							v-model="link02"
						>
							<template slot="prepend">link02</template>
						</el-input>
					</div>
				</template>
			</yx-form>
		</Dialog>
		<!-- <Dialog
			:title="dialogTitle195"
			:visible.sync="dialogVisible195"
			:width="dialogWidth195"
		>
			<yx-form
				ref="dialog195"
				v-loading="dialogLoading195"
				labelWidth="100px"
				:data="formData195"
				:items="formCfg195"
				:formAction="formAction195"
				:rules="rules195"
			>
			</yx-form>
		</Dialog> -->
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import moment from 'moment'
import { debounce } from 'lodash'
import {
	queryTemplateList,
	createTemplate,
	modifyTemplate,
	updateStatus,
	customCiew,
} from '@/api/messageCenter'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},
	name: 'FormTable',

	data() {
		return {
			loading: false,
			dialogLoading195: false,
			dialogLoading194: false,
			dialogTitle194: '新建短信模板',
			dialogWidth194: '800px',
			dialogVisible194: false,
			blurIndex: null,
			templateContentList: [],
			link01: '',
			link02: '',
			formData194: {
				templateName: '',
				keyword: '',
				templateContent: '',
				// outTemplateId: '',
				// optName: '',
			},
			options: [
				{
					value: '营销通知',
					keyword: '营销通知',
				},
			],
			formCfg194: [
				{
					type: 'input',
					title: '模板名称',
					maxlength: 10,
					dataIndex: 'templateName',
					placeholder: '请输入模板名称',
				},
				{
					type: 'custom',
					title: '模板分类',
					dataIndex: 'keyword',
					placeholder: '请输入模板分类',
				},
				{
					type: 'custom',
					title: '模板内容',
					dataIndex: 'templateContent',
					placeholder: '请输入模板内容',
				},
			],
			rules194: {
				templateName: {
					require: true,
					validator: (rule, value, callback) => {
						if (!value) {
							callback(new Error('请输入模板名称'))
						} else if (value.replace(/(^\s+)|(\s+$)/g, '').length === 0) {
							callback(new Error('请输入模板名称'))
						} else {
							callback()
						}
					},
					trigger: 'blur',
				},
				keyword: {
					require: true,
					validator: (rule, value, callback) => {
						if (!value) {
							callback(new Error('请选择模板分类'))
						} else if (value.replace(/(^\s+)|(\s+$)/g, '').length === 0) {
							callback(new Error('请选择模板分类'))
						} else {
							callback()
						}
					},
					trigger: 'blur',
				},
				templateContent: {
					require: true,
					validator: (rule, value, callback) => {
						if (!value) {
							callback(new Error('请输入模板内容'))
						} else {
							callback()
						}
					},
					trigger: 'blur',
				},
			},
			dialogBottomBtn194: [
				{
					title: '取消',
					type: 'primary',
					click: () => {
						this.templateDialogclose()
					},
				},
				{
					title: '确定',
					type: 'primary',
					click: debounce(
						() => {
							this.$refs.dialog194.$refs.YxForm.validate((valid) => {
								if (valid) {
									this._createTemplate()
								}
							})
						},
						300,
						{
							leading: true,
							trailing: false,
						}
					),
				},
			],
			// dialogTitle195: '编辑短信模板',
			// dialogWidth195: '500px',
			// dialogVisible195: false,
			// formData195: {
			// 	templateName: '',
			// 	keyword: '',
			// 	templateId: '',
			// 	templateContent: '',
			// 	outTemplateId: '',
			// 	optName: '',
			// 	templateStatus: 'ENABLE',
			// },
			// formCfg195: [
			// 	{
			// 		type: 'input',
			// 		title: '模板名称',
			// 		maxlength: 10,
			// 		dataIndex: 'templateName',
			// 		placeholder: '请输入模板名称',
			// 	},
			// 	{
			// 		type: 'select',
			// 		title: '模板分类',
			// 		dataIndex: 'keyword',
			// 		placeholder: '请输入模板分类',
			// 		options: [
			// 			{
			// 				value: '营销通知',
			// 				keyword: '营销通知',
			// 			},
			// 		],
			// 	},
			// 	{
			// 		type: 'textarea',
			// 		title: '模板内容',
			// 		maxlength: 200,
			// 		dataIndex: 'templateContent',
			// 		placeholder: '请输入模板内容',
			// 	},
			// 	{
			// 		type: 'select',
			// 		title: '模板状态',
			// 		dataIndex: 'templateStatus',
			// 		label: 'value',
			// 		options: [
			// 			{
			// 				value: '禁用',
			// 				templateStatus: 'DISABLE',
			// 			},
			// 			{
			// 				value: '启用',
			// 				templateStatus: 'ENABLE',
			// 			},
			// 		],
			// 	},
			// ],
			// formAction195: [
			// 	{
			// 		title: '取消',
			// 		type: 'primary',
			// 		click: () => {
			// 			this.dialogVisible195 = false
			// 		},
			// 	},
			// 	{
			// 		title: '确定',
			// 		type: 'primary',
			// 		click: debounce(
			// 			() => {
			// 				this.$refs.dialog195.$refs.YxForm.validate((valid) => {
			// 					if (valid) {
			// 						// 规则校验通过
			// 						this._modifyTemplate()
			// 					}
			// 				})
			// 			},
			// 			300,
			// 			{
			// 				leading: true,
			// 				trailing: false,
			// 			}
			// 		),
			// 	},
			// ],
			// rules195: {
			// 	templateName: {
			// 		require: true,
			// 		validator: (rule, value, callback) => {
			// 			if (!value) {
			// 				callback(new Error('请输入模板名称'))
			// 			} else if (value.replace(/(^\s+)|(\s+$)/g, '').length === 0) {
			// 				callback(new Error('请输入模板名称'))
			// 			} else {
			// 				callback()
			// 			}
			// 		},
			// 		trigger: 'blur',
			// 	},
			// 	keyword: {
			// 		require: true,
			// 		validator: (rule, value, callback) => {
			// 			if (!value) {
			// 				callback(new Error('请选择模板分类'))
			// 			} else if (value.replace(/(^\s+)|(\s+$)/g, '').length === 0) {
			// 				callback(new Error('请选择模板分类'))
			// 			} else {
			// 				callback()
			// 			}
			// 		},
			// 		trigger: 'blur',
			// 	},
			// 	templateContent: {
			// 		require: true,
			// 		validator: (rule, value, callback) => {
			// 			if (!value) {
			// 				callback(new Error('请输入模板内容'))
			// 			} else {
			// 				callback()
			// 			}
			// 		},
			// 		trigger: 'blur',
			// 	},
			// 	templateStatus: {
			// 		require: true,
			// 		validator: (rule, value, callback) => {
			// 			if (!value) {
			// 				callback(new Error('请选择模板状态'))
			// 			} else {
			// 				callback()
			// 			}
			// 		},
			// 		trigger: 'blur',
			// 	},
			// },
			templateList: [],
			// 选中的表格条目
			selectList: [],
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: debounce(this._queryTemplateListEffect, 300, {
						leading: true,
						trailing: false,
					}),
				},
				{
					// title: '批量盘点',
					title: '新增模板',
					type: 'primary',
					click: this.openCreateTemplateDialog,
				},
			],
			formInline: {
				keyword: '全部',
				searchKey: '',
				startAddTime: '', // 查询开始时间
				endAddTime: '', // 查询结束时间
				templateStatus: 'ENABLE',
			},
			formCfg: [
				{
					title: '创建时间',
					type: 'datetimerange',
					dataIndex: ['startAddTime', 'endAddTime'],
					placeholder: ['开始时间', '结束时间'],
					colSpan: 12,
				},
				{
					title: '模板分类',
					type: 'select',
					dataIndex: 'keyword',
					placeholder: '请选择模板分类',
					options: [
						{
							value: '全部',
							keyword: '全部',
						},
						{
							value: '营销通知',
							keyword: '营销通知',
						},
					],
				},
				{
					type: 'select',
					title: '模板状态',
					dataIndex: 'templateStatus',
					label: 'value',
					options: [
						{
							value: '禁用',
							templateStatus: 'DISABLE',
						},
						{
							value: '启用',
							templateStatus: 'ENABLE',
						},
					],
				},
				{
					type: 'custom',
					dataIndex: 'searchKey',
				},
			],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'templateId',
					align: 'left',
					title: '模板ID',
				},
				{
					type: 'string',
					dataIndex: 'templateName',
					align: 'left',
					title: '模板名称',
				},
				{
					type: 'string',
					dataIndex: 'templateContent',
					width: '500px',
					align: 'left',
					title: '模板内容',
				},
				{
					type: 'string',
					dataIndex: 'keyword',
					title: '模板分类',
				},
				{
					type: 'string',
					dataIndex: 'templateStatus',
					title: '启用状态',
					customRender: (row) => {
						if (row.templateStatus === 'ENABLE') {
							return '启用'
						} else {
							return '禁用'
						}
					},
				},
				{
					type: 'custom',
					dataIndex: 'optName',
					title: '最后操作人',
				},
				{
					type: 'custom',
					dataIndex: 'operating',
					title: '操作',
				},
			],
			page: {
				count: 0,
				currentPage: 1,
				length: 10,
				tableChange: () => {
					this._queryTemplateList()
				},
			},
			// linkInput01Text1: false,
			// linkInput01Text2: false,
		}
	},

	created: function () {
		this.$nextTick(() => {
			this._queryTemplateList()
		})
	},
	mounted() {},
	methods: {
		// linkInputText1Click(v) {
		// 	if (v === 1) {
		// 		this.linkInput01Text1 = false
		// 		this.link01 = ''
		// 	}
		// 	if (v === 2) {
		// 		this.linkInput01Text2 = false
		// 		this.link02 = ''
		// 	}
		// },
		async _updateStatus(row) {
			let title = row.templateStatus == 'ENABLE' ? '禁用' : '启用'
			this.$confirm('确定' + title + '该模板？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					let param = {
						userAccount: this.$store.state.user.userInfo.userName,
						userId: this.$store.state.user.userInfo.userId,
						optName: this.$store.state.user.userInfo.clerkName,
						templateId: row.templateId,
						templateStatus:
							row.templateStatus == 'ENABLE' ? 'DISABLE' : 'ENABLE',
					}
					const {
						data: { resultCode },
					} = await updateStatus(param)
					if (resultCode == 0) {
						this.$message.success('成功')
						this._queryTemplateList()
					}
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消',
					})
				})
		},
		// 获取光标所在位置的index
		blurEvent(e) {
			this.blurIndex = e.srcElement.selectionStart
			// let regex4 = /\{(.+?)\}/g // {}
			// console.log('1111111111', this.formData194.templateContent.match(regex4))
			// console.log(e)
			// console.log(e.srcElement)
			// console.log(e.srcElement.selectionStart) //光标所在的位置
		},
		// linkInput01(e) {
		// 	this.formData194.templateContent = this.replaceStr(
		// 		this.formData194.templateContent,
		// 		[this.link02, e]
		// 	)
		// },
		replaceStr(str, arr) {
			const reg = /\{(.*?)\}/g
			const result = str.match(reg)
			if (result) {
				result.forEach((item, index) => {
					str = str.replace(item, `{${arr[index]}}`)
				})
			}
			return str
		},
		// linkInput02(e) {
		// 	this.formData194.templateContent = this.replaceStr(
		// 		this.formData194.templateContent,
		// 		[this.link01, e]
		// 	)
		// },
		// searchData() {
		// 	let regex4 = /(?<=\{)(.+?)(?=\})/g // {}
		// 	if (this.formData194.templateContent.match(regex4)) {
		// 		this.templateContentList = this.formData194.templateContent.match(
		// 			regex4
		// 		)

		// 		this.link01 = this.formData194.templateContent.match(regex4)[0]
		// 		this.link02 = this.formData194.templateContent.match(regex4)[1]
		// 	}
		// },

		// 插入内容的方法
		insertContentHandle(text1, text2) {
			// 正则匹配 内容为link01 或者 link02
			let regex4 = /{link01}|{link02}/g // {}
			console.log(
				'=========',
				text1,
				text2,
				this.formData194.templateContent.match(regex4)
			)
			if (
				this.formData194.templateContent.match(regex4) &&
				this.formData194.templateContent.match(regex4).length > 1
			) {
				this.$message('一个模板最多增加两个链接')
				return
			}

			if (
				!this.formData194.templateContent.match(regex4) ||
				this.formData194.templateContent.match(regex4)[0] == '{link02}'
			) {
				// this.linkInput01Text1 = true
				let index = this.blurIndex
				let str = this.formData194.templateContent
				this.formData194.templateContent =
					str.slice(0, index) + text1 + str.slice(index)
			} else {
				// this.linkInput01Text2 = true
				let index = this.blurIndex
				let str = this.formData194.templateContent
				this.formData194.templateContent =
					str.slice(0, index) + text2 + str.slice(index)
			}
			// if (this.formData194.templateContent.match(regex4)) {
			// 	document.getElementById('insertLink').style = 'color:#909399'
			// 	this.$message('一个模板最多增加两个链接')
			// 	return
			// }
			// document.getElementById('inputName').style = 'cursor:pointer'
		},
		// 表单查询按钮绑定的列表查询方法
		async _queryTemplateListEffect() {
			const { formInline, page } = this

			this.loading = true
			// const { formInline, page } = this

			console.log('111111111111')
			if (!formInline.startAddTime) {
				delete formInline.startAddTime
			} else {
				formInline.startAddTime = moment(formInline.startAddTime).format(
					'yyyy-MM-DD HH:mm:ss'
				)
			}
			if (!formInline.endAddTime) {
				delete formInline.endAddTime
			} else {
				formInline.endAddTime = moment(formInline.endAddTime).format(
					'yyyy-MM-DD HH:mm:ss'
				)
			}
			const params = {
				channelCode: 'SMS',
				limit: page.length,
				offset: 1,
				...formInline,
			}
			if (params.keyword === '全部') {
				params.keyword = ''
			}
			let res = await queryTemplateList(params).finally(() => {
				this.loading = false
			})
			const { resultCode, resultData } = res.data
			if (resultCode === 0) {
				const { templateList = [], total, offset, limit } = resultData
				this.templateList = templateList || []
				this.page.count = total
				this.page.currentPage = offset
				this.page.length = limit
			}
		},
		/**
		 * @Description: 分页器进行列表查询
		 * @param {type} {*}
		 * @return {type} {*}
		 */
		async _queryTemplateList() {
			const { formInline, page } = this
			// if (!formInline.startAddTime || !formInline.endAddTime) {
			// 	this.$message('请选择查询时间范围', 'error')
			// 	return
			// }
			if (!formInline.startAddTime) {
				delete formInline.startAddTime
			} else {
				formInline.startAddTime = moment(formInline.startAddTime).format(
					'yyyy-MM-DD HH:mm:ss'
				)
			}
			if (!formInline.endAddTime) {
				delete formInline.endAddTime
			} else {
				formInline.endAddTime = moment(formInline.endAddTime).format(
					'yyyy-MM-DD HH:mm:ss'
				)
			}
			this.loading = true
			const params = {
				channelCode: 'SMS',
				limit: page.length,
				offset: page.currentPage,
				...formInline,
			}
			if (params.keyword === '全部') {
				params.keyword = ''
			}
			let res = await queryTemplateList(params).finally(() => {
				this.loading = false
			})
			const { resultCode, resultData } = res.data
			if (resultCode === 0) {
				const { templateList = [], total, offset, limit } = resultData
				this.templateList = templateList || []
				this.page.count = total
				this.page.currentPage = offset
				this.page.length = limit
			}
		},
		/**
		 * @Description: 打开新建模板弹窗
		 * @param {type} {*}
		 * @return {type} {*}
		 */
		async openCreateTemplateDialog() {
			// this.linkInput01Text1 = false
			// this.linkInput01Text2 = false
			this.dialogTitle194 = '新建短信模板'
			this.templateContentList = []
			this.link01 = ''
			this.link02 = ''
			this.formData194 = {
				templateName: '',
				keyword: '',
				templateContent: '',
			}
			this.dialogVisible194 = true
			this.$nextTick(() => {
				this.$refs.dialog194.$refs.YxForm.clearValidate()
				document.getElementById('insertLink').style = 'color:#1890ff'
			})

			// 打开时初始化弹窗内的数据
		},
		templateDialogclose() {
			this.dialogVisible194 = false
			// this.linkInput01Text1 = false
			// this.linkInput01Text2 = false
			this.templateContentList = []
			this.link01 = ''
			this.link02 = ''
			this.formData194 = {
				templateName: '',
				keyword: '',
				templateContent: '',
			}
		},
		async _createTemplate() {
			this.dialogLoading194 = true
			// let regex4 = /(?<=\{)(.+?)(?=\})/g // {}

			// if (
			// 	!this.formData194.templateContent.match(regex4) &&
			// 	(this.link01 || this.link02)
			// ) {
			// 	this.$message('请插入链接')
			// 	this.dialogLoading194 = false
			// 	return
			// }
			const { formData194 } = this
			const params = {
				channelCode: 'SMS',
				userAccount: this.$store.state.user.userInfo.userName,
				userId: this.$store.state.user.userInfo.userId,
				optName: this.$store.state.user.userInfo.clerkName,
				defaultVariable: {},
				...formData194,
			}
			// let json = {}
			// for (let i = 0; i < this.templateContentList.length; i++) {
			// 	json[i] = this.templateContentList[i]
			// }
			// console.log(JSON.stringify(json))
			// let jsonS = JSON.stringify(json)
			params.defaultVariable.link01 = this.link01
			params.defaultVariable.link02 = this.link02
			params.defaultVariable = JSON.stringify(params.defaultVariable)
			if (params.templateContent.length > 200) {
				this.$message('内容长度不可超过200')
				this.dialogLoading194 = false
				return
			}
			let Url =
				this.dialogTitle194 == '编辑短信模板' ? modifyTemplate : createTemplate
			// return
			await Url(params)
				.then((res) => {
					const { resultCode } = res.data
					if (resultCode === 0) {
						this.$message.success('创建消息模板成功')
						this.dialogVisible194 = false
						this._queryTemplateListEffect()
						this.templateDialogclose()
					}
				})
				.finally(() => {
					this.dialogLoading194 = false
				})
		},
		// 打开编辑模板弹窗，并从表单row中映射数据做回显
		async openEditTeplateDialog(row) {
			this.dialogTitle194 = '编辑短信模板'
			this.dialogVisible194 = true
			const { formData194 } = this
			let {
				data: { resultCode, resultData },
			} = await customCiew({ templateId: row.templateId })
			if (resultCode == 0) {
				formData194.templateName = resultData.templateName
				formData194.keyword = resultData.keyword
				formData194.templateContent = resultData.templateContent
				formData194.templateStatus = resultData.templateStatus
				formData194.outTemplateId = resultData.outTemplateId
				formData194.templateId = resultData.templateId
				if (
					resultData.defaultVariableList &&
					resultData.defaultVariableList.length > 0
				) {
					resultData.defaultVariableList.map((item) => {
						if (item.name == 'link01') {
							// this.linkInput01Text1 = true
							this.link01 = item.value
						}
						if (item.name == 'link02') {
							// this.linkInput01Text2 = true
							this.link02 = item.value
						}
					})
				}
			}
		},
		// async _modifyTemplate() {
		// 	this.dialogLoading195 = true
		// 	const { formData195 } = this
		// 	const params = {
		// 		...formData195,
		// 		channelCode: 'SMS',
		// 		optName: this.$store.state.user.userInfo.clerkName,
		// 		userId: this.$store.state.user.userInfo.userId,
		// 		userAccount: this.$store.state.user.userInfo.userName,
		// 	}
		// 	modifyTemplate(params)
		// 		.then((res) => {
		// 			const { resultCode } = res.data
		// 			if (resultCode === 0) {
		// 				this.$message.success('修改短信模板成功')
		// 				this.dialogVisible195 = false
		// 				// 更新成功后更新列表视图
		// 				this._queryTemplateList()
		// 			}
		// 		})
		// 		.finally(() => {
		// 			this.dialogLoading195 = false
		// 		})
		// },
	},
}
</script>

<style>
.messageCenter_keyword_input {
	width: 260px;
}
.inputTextarea .el-textarea__inner {
	min-height: 200px !important;
}
.mb20 {
	margin-bottom: 20px;
}
</style>

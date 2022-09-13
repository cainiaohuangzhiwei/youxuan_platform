<template>
	<div class="xcxTitle">
		<basicContainer>
			<div class="goods-group-btn-box">
				<el-button
					v-auth="'homePageTitleOfAppletUpdate'"
					type="primary"
					@click="addXcxTitle"
					>新增首页标题</el-button
				>
				<el-button @click="_refreshHomePageTitleOfAppletCache" type="primary"
					>同步到小程序</el-button
				>
			</div>
			<yx-form
				:inline="true"
				:data="formData193"
				:items="formCfg193"
				:formAction="formAction193"
			>
			</yx-form>
			<yx-table
				v-loading="loading"
				:columns="tableColumns188"
				:pagination="page188"
				:data="tableData188"
			>
			</yx-table>
			<Dialog
				:title="dialogTitle194"
				:visible.sync="dialogVisible194"
				:width="dialogWidth194"
				:bottomBtn="dialogBottomBtn194"
			>
				<yx-form
					ref="dialog194"
					labelWidth="100px"
					:data="formData195"
					:items="formCfg195"
					:formAction="formAction195"
					:rules="rules"
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
	homePageTitleOfAppletList,
	homePageTitleOfAppletUpdate,
	homePageTitleOfAppletSave,
	homePageTitleOfAppletDelete,
	refreshHomePageTitleOfAppletCache,
} from '@/api/yhtPlusCmsHomePageTitleOfApplet'

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
			isUpdate: false,
			formData193: {
				titleState: '',
				keyword: '',
			},
			formCfg193: [
				{
					type: 'select',
					title: '标题状态',
					dataIndex: 'titleState',
					placeholder: '请输入商家名称',
					label: 'value',
					options: [
						{
							value: '全部',
							titleState: '',
						},
						{
							value: '禁用',
							titleState: 0,
						},
						{
							value: '启用',
							titleState: 1,
						},
					],
				},
				{
					type: 'input',
					title: '标题名称',
					dataIndex: 'keyword',
					placeholder: '请输入标题名称',
				},
			],
			formAction193: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init(true)
					},
				},
			],
			tableData188: [],
			tableColumns188: [
				{
					type: 'string',
					dataIndex: 'titleName',
					title: '标题名',
				},
				{
					type: 'string',
					dataIndex: 'subheading',
					title: '副标题名称',
				},
				{
					type: 'string',
					dataIndex: 'sortOrder',
					title: '排序值',
				},
				{
					type: 'newMap',
					dataIndex: 'titleState',
					title: '标题状态',
					options: [
						['0', '禁用'],
						['1', '启用'],
					],
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '禁用',
							popconfirm: true,
							popconfirmTitle: '确认要禁用该标题吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._homePageTitleOfAppletUpdate(row, 0)
							},
							customRender: (action, row) => {
								action.hide = row.titleState == 0
								return action
							},
						},
						{
							title: '启用',
							popconfirm: true,
							popconfirmTitle: '确认要启用该标题吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._homePageTitleOfAppletUpdate(row, 1)
							},
							customRender: (action, row) => {
								action.hide = row.titleState != 0
								return action
							},
						},
						{
							title: '编辑',
							dialogId: 194,
							click: (row) => {
								this.formData195 = Object.assign({}, row)
								this.isUpdate = true
								this.$nextTick(() => {
									this.$refs.dialog194.$refs.YxForm.clearValidate()
								})
								this.dialogVisible194 = true
							},
						},
						{
							title: '删除',
							popconfirm: true,
							popconfirmTitle: '确认要删除该标题吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._homePageTitleOfAppletDelete(row)
							},
						},
					],
				},
			],
			page188: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			dialogTitle194: '',
			dialogWidth194: '500px',
			dialogVisible194: false,
			dialogBottomBtn194: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog194.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveXcxTitle()
							}
						})
					},
				},
			],
			formData195: {
				titleName: '',
				subheading: '',
				sortOrder: '',
			},
			formCfg195: [
				{
					type: 'input',
					title: '标题名',
					dataIndex: 'titleName',
					placeholder: '请输入标题名',
				},
				{
					type: 'input',
					title: '副标题名',
					dataIndex: 'subheading',
					placeholder: '请输入副标题名',
				},
				{
					title: '排序值',
					type: 'inputNumber',
					dataIndex: 'sortOrder',
					placeholder: '请输入排序值',
				},
			],
			rules: {
				titleName: [
					{ required: true, message: '请输入标题名', trigger: 'blur' },
				],
				subheading: [
					{ required: true, message: '请输入副标题名', trigger: 'blur' },
				],
				sortOrder: [
					{ required: true, message: '请输入排序值', trigger: 'blur' },
				],
			},
			formAction195: [],
		}
	},

	methods: {
		_refreshHomePageTitleOfAppletCache: async function () {
			let {
				data: { resultCode, resultMsg },
			} = await refreshHomePageTitleOfAppletCache()
			if (resultCode == 0) {
				this.$message.success(resultMsg)
			}
		},
		addXcxTitle() {
			this.formData195 = Object.assign(
				{},
				{
					titleName: '',
					subheading: '',
					sortOrder: '',
				}
			)
			this.isUpdate = false
			this.$nextTick(() => {
				this.$refs.dialog194.$refs.YxForm.clearValidate()
			})
			this.dialogVisible194 = true
		},
		_homePageTitleOfAppletDelete: async function ({ homePageTitleOfAppletId }) {
			let {
				data: { resultCode, resultMsg },
			} = await homePageTitleOfAppletDelete({
				homePageTitleOfAppletId,
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.init()
			}
		},
		saveXcxTitle: async function () {
			let res = null
			if (this.isUpdate) {
				// 编辑
				res = await homePageTitleOfAppletUpdate({
					titleName: this.formData195.titleName,
					subheading: this.formData195.subheading,
					sortOrder: this.formData195.sortOrder,
					homePageTitleOfAppletId: this.formData195.homePageTitleOfAppletId,
					titleState: this.formData195.titleState,
				})
			} else {
				// 新增
				res = await homePageTitleOfAppletSave({
					titleName: this.formData195.titleName,
					subheading: this.formData195.subheading,
					sortOrder: this.formData195.sortOrder,
					titleState: 0,
				})
			}
			let {
				data: { resultCode, resultMsg },
			} = res
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible194 = false
				this.init()
			}
		},
		_homePageTitleOfAppletUpdate: async function (
			{ homePageTitleOfAppletId, titleName, subheading, sortOrder },
			titleState
		) {
			let {
				data: { resultCode, resultMsg },
			} = await homePageTitleOfAppletUpdate({
				homePageTitleOfAppletId,
				titleName,
				subheading,
				sortOrder,
				titleState,
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.init()
			}
		},
		init: async function (flag) {
			this.loading = true
			let paramJson = this.findSearchParams188(flag)
			const {
				data: { resultCode, resultData },
			} = await homePageTitleOfAppletList(paramJson)
			if (resultCode == 0) {
				this.isShow = true
				this.tableData188 = resultData.homePageTitleOfAppletArrayList
				this.page188.count = resultData.count
			} else {
				this.page188.count = 0
				this.tableData188 = []
			}
			this.loading = false
		},
		findSearchParams188(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page188.currentPage = 1
			}
			const paramJson = Object.assign(this.formData193, {
				length: this.page188.length,
				startIndex: (this.page188.currentPage - 1) * this.page188.length,
			})
			return paramJson
		},
	},
}
</script>

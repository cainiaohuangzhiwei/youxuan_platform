<template>
	<yx-dialog
		width="800px"
		:bottomBtn="bottomBtn"
		:visible.sync="localVisible"
		:before-close="resetForm"
		title="新增短信"
	>
		<yx-form
			:inline="true"
			:data="searchData"
			:items="searchItems"
			:formAction="searchAction"
		></yx-form>

		<el-row>
			<yx-table
				v-loading="showLoading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			>
			</yx-table>
		</el-row>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getSmallImg } from '@/utils/imageTool'
import { queryTemplateList } from '@/api/messageCenter'
import moment from 'moment'

export default {
	components: {
		YxDialog,
		YxForm,
		YxTable,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			define: false,
		},
		smsList: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			getSmallImg: getSmallImg,
			selectSMSList: [],
			showLoading: false,
			currentTime: '',
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'templateId',
					title: 'ID',
				},
				{
					type: 'string',
					dataIndex: 'templateName',
					title: '模板名称',
				},
				{
					title: '短信内容',
					type: 'string',
					dataIndex: 'templateContent',
				},
				{
					title: '操作',
					type: 'action',
					fixed: 'right',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.updatedUserGroup(row)
							},
							customRender: (action, row) => {
								action.title = this.findIndex(row) ? '添加' : '移除'
								return action
							},
						},
					],
				},
			],
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveCallback()
					},
				},
				{
					title: '取消',
					click: () => {
						this.resetForm()
					},
				},
			],
			searchData: {
				keyword: '',
				searchKey: '',
				// startAddTime: '', // 查询开始时间
				// endAddTime: '', // 查询结束时间
				startAddTime: moment(moment().startOf('month')).valueOf(), // 查询开始时间
				endAddTime: moment(moment().endOf('month')).valueOf(), // 查询结束时间
				templateStatus: 'ENABLE',
			},
			searchItems: [
				{
					title: '创建时间',
					label: 'value',
					type: 'datetimerange',
					dataIndex: ['startAddTime', 'endAddTime'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					title: '模板分类',
					type: 'select',
					dataIndex: 'keyword',
					label: 'value',
					placeholder: '请选择模板分类',
					options: [
						{
							value: '全部',
							keyword: '',
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
					type: 'input',
					title: '模板名称',
					dataIndex: 'searchKey',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getData(true)
					},
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData()
				},
			},

			tableData: [],
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
	mounted() {},
	watch: {
		localVisible(val) {
			if (val) {
				this.selectSMSList = JSON.parse(JSON.stringify(this.smsList))
				this.getData()
			}
		},
	},
	methods: {
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			// this.$refs.form.$refs.YxForm.resetFields()
		},
		saveCallback() {
			// if (this.selectSMSList && this.selectSMSList.length > 1) {
			// 	return this.$message.warning('主推档期不能超过1个')
			// }
			this.$emit('saveCallback', this.selectSMSList)
			this.localVisible = false
		},
		findIndex(row) {
			// 判断是否已经添加用户
			let ids = this.selectSMSList.map((item) => {
				return item.templateId
			})
			return ids.indexOf(row.templateId) == -1
		},
		updatedUserGroup(row) {
			// 添加/移除用户
			const ids = this.selectSMSList.map((item) => {
				return item.templateId
			})
			if (ids.indexOf(row.templateId) == -1) {
				this.selectSMSList.push(row)
			} else {
				this.selectSMSList.splice(ids.indexOf(row.templateId), 1)
			}
		},

		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = Object.assign(this.searchData, {
				limit: this.page.length,
				offset: this.page.currentPage,
				channelCode: 'SMS',
			})
			paramJson.startAddTime = moment(paramJson.startAddTime).format(
				'yyyy-MM-DD HH:mm:ss'
			)
			paramJson.endAddTime = moment(paramJson.endAddTime).format(
				'yyyy-MM-DD HH:mm:ss'
			)
			return paramJson
		},
		getData: async function (flag) {
			this.showLoading = true
			const paramJson = this.findSearchParams(flag)
			const {
				data: { resultCode, resultData },
			} = await queryTemplateList(paramJson)
			if (resultCode == 0) {
				const { templateList = [], total } = resultData
				this.tableData = templateList
				this.page.count = total
			} else {
				this.tableData = []
				this.page.count = 0
			}
			this.showLoading = false
		},
	},
}
</script>

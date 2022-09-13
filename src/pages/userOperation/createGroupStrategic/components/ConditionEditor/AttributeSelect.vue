<template>
	<yx-dialog
		:bottomBtn="bottomBtn"
		:visible.sync="localVisible"
		:before-close="resetForm"
		title="选择属性"
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
import { queryVisibleUoAttributeBatch } from '@/api/uoOptionKey'

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
		classifyItem: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			getSmallImg: getSmallImg,
			selector: [],
			showLoading: false,
			currentTime: '',
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'uoAttributeId',
					title: 'ID',
				},
				{
					type: 'string',
					dataIndex: 'name',
					title: '名称',
				},
				{
					type: 'string',
					dataIndex: 'nameCode',
					title: '名称编码',
				},
				{
					type: 'string',
					dataIndex: 'sort',
					title: '排序',
				},
				{
					title: '操作',
					type: 'action',
					fixed: 'right',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.updatedSelector(row)
							},
							customRender: (action, row) => {
								action.title = this.findIndex(row) ? '移除' : '添加'
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
						this.saveClassify()
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
				name: '',
				visibleType: 1,
			},
			searchItems: [
				{
					type: 'input',
					title: '名称：',
					dataIndex: 'name',
					placeholder: '模糊搜索',
				},
				// {
				// 	type: 'select',
				// 	title: '状态',
				// 	dataIndex: 'visibleType',
				// 	label: 'value',
				// 	options: [
				// 		{
				// 			visibleType: '',
				// 			value: '全部',
				// 		},
				// 		{
				// 			visibleType: '0',
				// 			value: '不可见',
				// 		},
				// 		{
				// 			visibleType: 1,
				// 			value: '可见',
				// 		},
				// 	],
				// },
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
				this.selector = {
					...this.classifyItem,
					name: this.classifyItem.uoAttributeName || '',
				}
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
		saveClassify() {
			this.$emit('saveCallback', this.selector)
			this.localVisible = false
		},
		findIndex(row) {
			// 判断是否已经添加
			return this.selector.uoAttributeId === row.uoAttributeId
		},
		updatedSelector(row) {
			// 添加/移除
			if (this.selector.uoAttributeId !== row.uoAttributeId) {
				this.selector = row
			} else {
				this.selector = {}
			}
		},

		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				pageNum: 1,
				pageSize: 10,
				uoAttributeClassifyId: this.classifyItem.uoAttributeClassifyId,
			})
			// 每页的加载数据长度
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.pageNum = this.page.currentPage
			return paramJson
		},
		getData: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			const {
				data: { resultCode, resultData, total },
			} = await queryVisibleUoAttributeBatch(paramJson)
			if (resultCode == 0) {
				this.tableData = resultData
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

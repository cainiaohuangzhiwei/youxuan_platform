<template>
	<el-dialog
		width="800px"
		title="选择分类"
		append-to-body
		:close-on-click-modal="false"
		:visible.sync="localVisible"
		:before-close="resetForm"
	>
		<YxForm
			ref="form"
			:inline="true"
			:items="item"
			:data="formData"
			:formAction="formAction"
		/>

		<YxTable
			v-loading="loading"
			:columns="tableColumns"
			:pagination="page"
			:data="tableData"
		>
			<template slot="goodsCategoryFrontId" slot-scope="scope">
				<el-radio
					v-model="rowData.goodsCategoryFrontId"
					:label="scope.row.goodsCategoryFrontId"
					@change="changeAnchor(scope.row)"
					>选择</el-radio
				>
			</template>
		</YxTable>

		<div class="wg-text-right" v-if="page.count > 0">
			<el-button type="primary" @click="submitForm">确定</el-button>
		</div>
	</el-dialog>
</template>

<script>
import { getThirdCategoryList } from '@/api/goodsCategoryFront.js'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	watch: {
		visible() {
			if (this.visible) {
				this.init(true)
			}
		},
	},

	components: {
		YxForm: () => import('@wg-vue-materials/yx-form'),
		YxTable: () => import('@wg-vue-materials/yx-table'),
	},

	data() {
		return {
			item: [
				{
					title: '类目名称',
					dataIndex: 'keyword',
					type: 'input',
				},
			],
			formData: {
				keyword: '',
			},
			rowData: {},
			loading: false,
			tableData: [],
			tableColumns: [
				{
					width: 80,
					type: 'custom',
					dataIndex: 'goodsCategoryFrontId',
				},
				{
					title: '类目名称',
					dataIndex: 'categoryName',
				},
				{
					title: '类目',
					dataIndex: 'categoryType',
					customRender: (row) => {
						const arr = ['', '常规类目', '活动类目']
						return arr[row.categoryType]
					},
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init(true)
					},
				},
			],
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
		details(goodsCategoryFrontId) {
			this.rowData.goodsCategoryFrontId = parseInt(
				goodsCategoryFrontId.toString()
			)
			this.init(true)
		},

		changeAnchor(row) {
			this.rowData = Object.assign({}, row)
		},

		findSearchParams(flag) {
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.formData, {
				pageNum: this.page.currentPage,
			})

			return paramJson
		},

		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const {
				data: { resultData },
			} = await getThirdCategoryList(paramJson)

			if (resultData.thirdGoodsCategoryFront.length > 0) {
				this.tableData = resultData.thirdGoodsCategoryFront
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
			this.loading = false
		},

		resetForm() {
			this.localVisible = false
			this.rowData = {}
			this.$refs.form.$refs.YxForm.resetFields()
		},

		submitForm() {
			if (!this.rowData.goodsCategoryFrontId) {
				return this.$message.warning('请选择类目')
			}

			this.$emit('categoryMethod', this.rowData)
			this.resetForm()
		},
	},
}
</script>

<style lang="scss" scoped></style>

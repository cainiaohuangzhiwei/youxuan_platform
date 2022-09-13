<template>
	<div>
		<Dialog
			title="选择权限"
			:width="width"
			append-to-body
			custom-class="yx-dialog"
			:modal-append-to-body="false"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:visible.sync="localVisible"
			:bottomBtn="dialogBottomBtn"
			:before-close="resetForm"
			@open="init"
		>
			<yx-form
				ref="form"
				:inline="true"
				:items="item"
				:data="searchData"
				:rules="funRules"
				:formAction="funAction"
			>
			</yx-form>

			<yx-table
				v-loading="loading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			>
				<template slot="brandRow" slot-scope="scope">
					<el-radio
						v-model="rowData.functionProjectId"
						:label="scope.row.functionProjectId"
						@change="changeAnchor(scope.row)"
						>选择</el-radio
					>
				</template>
			</yx-table>
		</Dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { projectList } from '@/api/cmsFunctionProject'
import Dialog from '@/components/Dialog'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		width: {
			type: String,
			default: '60%',
		},
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
		paramJson: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm,
		YxTable,
		Dialog,
	},

	data() {
		return {
			item: [
				{
					title: '项目名称',
					dataIndex: 'projectName',
					placeholder: '请输入项目名称',
					enter: () => {
						this.init(true)
					},
				},
			],
			dialogBottomBtn: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
			],
			searchData: {
				projectName: '',
				isDelete: '0',
			},
			rowData: {},
			loading: false,
			tableData: [],
			tableColumns: [
				{
					width: 200,
					type: 'custom',
					dataIndex: 'brandRow',
				},
				{
					dataIndex: 'projectName',
					title: '项目名称',
				},
				{
					dataIndex: 'isDeleteDesc',
					title: '是否删除',
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
			funAction: [
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

	watch: {
		itemInfo() {
			this.rowData = Object.assign({}, this.itemInfo)
		},
	},
	created() {
		this.init(true)
	},
	methods: {
		// 单选
		changeAnchor(row) {
			this.rowData = Object.assign({}, row)
		},

		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			let newSearchData = Object.assign(this.searchData, this.paramJson)
			const paramJson = Object.assign(newSearchData, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})

			return paramJson
		},

		// 获取商家列表
		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await projectList(paramJson)
			this.loading = false
			if (resultCode == 0 && resultData.records.length > 0) {
				this.tableData = resultData.records
				this.page.count = resultData.total
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},

		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.rowData = {}
			this.tableData = []
			this.searchData.projectName = ''
			//重置页面不能把操作重置
			this.page.count = 0
			this.page.length = 10
			this.page.currentPage = 1
		},

		// 确定
		submitForm() {
			if (!this.rowData.functionProjectId) {
				return this.$message.warning('请选择对应项目！')
			}
			this.$emit('fatherMethodInit', this.rowData)
			this.resetForm()
		},
	},
}
</script>

<style lang="scss" scoped>
.yx-dialog {
	max-height: 90%;
	overflow-y: auto;
}
.el-dialog__body {
	max-height: 500px;
	overflow-y: auto;
}
</style>

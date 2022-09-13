<template>
	<el-dialog
		width="60%"
		title="选择商家"
		append-to-body
		:close-on-click-modal="false"
		:visible.sync="localVisible"
		:before-close="resetForm"
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
		</yx-table>
		<div class="btn" slot="footer">
			<el-button type="primary" @click="saveBrand">确定</el-button>
		</div>
	</el-dialog>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getCmsSupplierListByCondition } from '@/api/yhtPlusCmsSupplier'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		itemInfo: {
			type: Array,
			default: () => [],
		},
	},

	components: {
		YxForm,
		YxTable,
	},

	data() {
		return {
			selectGroupList: [],
			item: [
				{
					title: '筛选',
					dataIndex: 'supplierName',
					placeholder: '请输入商家名称',
				},
			],
			searchData: {
				supplierName: '',
			},
			rowData: [],
			multipleSelection: [],
			isAdd: 0,
			loading: false,
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'action',
					dataIndex: 'add',
					title: '操作',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.editUserList(row)
							},
							customRender: (action, row) => {
								action.title = this.findIndex(row) ? '添加' : '移除'
								return action
							},
						},
					],
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getCmsSupplierListByCondition(false)
				},
			},
			funAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getCmsSupplierListByCondition(true)
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
		localVisible(val) {
			if (val) {
				this.selectGroupList = JSON.parse(JSON.stringify(this.itemInfo))
				this._getCmsSupplierListByCondition(true)
			}
		},
	},

	created() {
		this._getCmsSupplierListByCondition(true)
	},

	methods: {
		// 搜索条件
		findSearchParams(flag) {
			let paramJson = this.searchData
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			console.log('======', flag)

			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},

		// 获取列表
		async _getCmsSupplierListByCondition(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const res = await getCmsSupplierListByCondition(paramJson)
			const { resultCode, resultData } = res.data
			this.loading = false
			if (resultCode == 0) {
				this.tableData = resultData.supplierList
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		resetForm() {
			this.localVisible = false
			this.$refs.form.$refs.YxForm.resetFields()
		},
		saveBrand() {
			if (this.selectGroupList.length == 0) {
				this.$message.error('请添加商家')
				return
			}
			this.$emit('fatherMethodInit', this.selectGroupList)
			this.localVisible = false
		},
		findIndex(row) {
			// 判断是否已经添加
			let ids = this.selectGroupList.map((item) => {
				return item.supplierId
			})
			return ids.indexOf(row.supplierId) == -1
		},
		editUserList(row) {
			// 添加/移除
			let ids = this.selectGroupList.map((item) => {
				return item.supplierId
			})
			if (ids.indexOf(row.supplierId) == -1) {
				this.selectGroupList.push(row)
			} else {
				this.selectGroupList.splice(ids.indexOf(row.supplierId), 1)
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.btn {
	text-align: right;
}
</style>

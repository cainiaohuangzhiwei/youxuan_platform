<template>
	<div class="interestFormTable">
		<el-row :gutter="20">
			<basic-container>
				<el-row>
					<yx-table
						v-loading="showLoading"
						:columns="tableColumns"
						:selectionChange="selectionChange"
						:pagination="page"
						:data="tableData"
					></yx-table>
					<editDialog
						:dialogVisible.sync="showEditDialog"
						:itemInfo.sync="editItem"
						@updateList="getList"
					></editDialog>
				</el-row>
			</basic-container>
		</el-row>
	</div>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import editDialog from './editDialog'
import { brandParentClassList } from '@/api/grossMargins'
export default {
	components: {
		BasicContainer,
		editDialog,
		YxTable,
	},
	name: 'FormTable',
	watch: {
		filterText(val) {
			this.$refs.tree.filter(val)
		},
	},
	data() {
		return {
			showLoading: false,
			showEditDialog: false,
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'brandParentClassName',
					title: '品牌等级',
				},
				{
					type: 'string',
					dataIndex: 'classModulus',
					title: '系数',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.edit(row)
							},
						},
					],
				},
			],
		}
	},

	created() {
		this.initData()
	},

	methods: {
		initData() {
			this.getList()
		},
		getList: async function (flag, e) {
			let custom = {}
			if (e) {
				custom = {
					uid: e.currentTarget.__vue__._uid,
				}
			}
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await brandParentClassList({}, custom)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData
			} else {
				this.tableData = []
			}
		},
		edit: function (data) {
			//显示编辑弹框
			if (data && data.brandParentClassId) {
				this.editItem = data
			} else {
				this.editItem = {}
			}

			this.showEditDialog = true
		},
	},
}
</script>

<style lang="scss" scope></style>

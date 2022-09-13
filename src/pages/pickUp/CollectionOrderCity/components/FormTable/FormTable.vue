<template>
	<div>
		<div class="top-tips">
			当前系统内可以使用“上门揽退服务”的城市列表

			<span v-auth="'/webImport/importCity.action'">
				<router-link to="/pickUp/importCity/"
					><el-button class="top-button" icon="el-icon-plus" type="primary"
						>导入城市</el-button
					></router-link
				>
			</span>
		</div>
		<yx-table
			v-loading="showLoading"
			:columns="tableColumns"
			:pagination="page"
			:data="tableData"
		>
			<template slot="index" slot-scope="scope">
				<div>{{ (page.currentPage - 1) * page.length + scope.index + 1 }}</div>
			</template>
		</yx-table>
	</div>
</template>

<script>
import YxTable from '@wg-vue-materials/yx-table'
import { collectionOrderCityConfig, deleteCity } from '@/api/collectionOrder'

export default {
	components: {
		YxTable,
	},
	data() {
		return {
			exportLoading: false,
			showLoading: false,
			tableData: [],
			tableColumns: [
				{
					type: 'custom',
					dataIndex: 'index',
					title: '序号',
				},
				{
					type: 'string',
					dataIndex: 'city',
					title: '城市',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '生成时间',
				},
				{
					type: 'string',
					dataIndex: 'userName',
					title: '导入人员',
				},

				{
					type: 'action',
					dataIndex: 'version',
					title: '操作',
					width: 200,
					fixed: 'right',
					actions: [
						{
							auth: '/deleteCity',
							title: '删除',
							popconfirm: true,
							popconfirmTitle: '是否删除该城市？',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: async (row) => {
								const {
									data: { resultCode },
								} = await deleteCity({
									id: row.id,
								})
								if (resultCode == 0) {
									this.$message.success('删除成功！')
									this.init()
								}
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
					this.init()
				},
			},
		}
	},
	created() {
		this.init(true)
	},
	methods: {
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = Object.assign(
				{},
				{
					pageNum: this.page.currentPage,
					pageSize: this.page.length,
				}
			)

			return paramJson
		},
		async init(flag) {
			this.showLoading = true
			const params = this.findSearchParams(flag)
			const {
				data: { resultCode, resultData = {} },
			} = await collectionOrderCityConfig(params)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.records || []
				this.page.count = resultData.total
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.top-tips {
	margin-bottom: 20px;
	.top-button {
		margin-left: 10px;
	}
}
</style>

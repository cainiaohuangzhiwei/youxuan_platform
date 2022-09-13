<template>
	<div class="downloadCenter">
		<basicContainer>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns104"
				:pagination="page104"
				:data="tableData104"
			>
			</yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import { cmsDownloadCenterList } from '@/api/cmsDownloadCenter'
import { imgCosServerPath } from '@/utils/imageTool'

export default {
	components: {
		BasicContainer,
		YxTable,
	},
	props: [],
	data() {
		return {
			loading: false,
			tableData104: [],
			tableColumns104: [
				{
					type: 'string',
					dataIndex: 'title',
					title: '导出列表',
				},
				{
					type: 'string',
					dataIndex: 'exportCondition',
					title: '导出条件',
				},
				{
					type: 'string',
					dataIndex: 'state',
					title: '状态',
					customRender: (row) => {
						const arr = ['', '已完成', '下载失败', '下载中']
						return arr[row.state] || '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'nickname',
					title: '操作人',
				},
				{
					type: 'date',
					dataIndex: 'formatTime',
					title: '导出时间',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					actions: [
						{
							title: '下载',
							// auth: 'addOrganizationTagToOrganization',
							click: (row) => {
								row.filePath = row.filePath.replace('/data/yhtplusFile/', '')

								window.open(imgCosServerPath + row.filePath)
							},
							customRender: (action, row) => {
								action.hide = row.state != 1
								return action
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
					this.getData104()
				},
			},
		}
	},

	created() {
		this.getData104(true)
	},

	methods: {
		async getData104(flag) {
			this.loading = true
			let paramJson = this.findSearchParams104(flag)
			const {
				data: { resultCode, resultData },
			} = await cmsDownloadCenterList(paramJson)
			if (resultCode == 0) {
				this.tableData104 = resultData.records
				this.page104.count = resultData.total
			}
			this.loading = false
		},
		findSearchParams104(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page104.currentPage = 1
			}
			const paramJson = Object.assign(
				{},
				{
					length: this.page104.length,
					startIndex: (this.page104.currentPage - 1) * this.page104.length,
				}
			)
			return paramJson
		},
	},
}
</script>

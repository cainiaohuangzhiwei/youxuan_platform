<template>
	<BasicContainer>
		<YxForm
			:inline="true"
			:data="formData"
			:items="formItems"
			:formAction="formAction"
		/>

		<YxTable
			v-loading="loading"
			:columns="tableColumns"
			:pagination="page"
			:data="tableData"
		/>
		<PageConfigDialog
			:row="pageConfigRow"
			:visible.sync="pageConfigDialog"
			@refreshTable="_getPlatActPageConfList(true)"
			:disabled="pageConfigDisabled"
		/>
	</BasicContainer>
</template>
<script>
import { getPlatActPageConfList } from '@/api/userRewardSystem'
export default {
	name: 'pageConfig',
	components: {
		YxForm: () => import('@wg-vue-materials/yx-form'),
		YxTable: () => import('@wg-vue-materials/yx-table'),
		PageConfigDialog: () => import('./components/PageConfigDialog'),
	},
	data() {
		return {
			pageConfigRow: {},
			pageConfigDialog: false,
			pageConfigDisabled: false,
			formData: {
				activityName: '',
			},
			formItems: [
				{
					title: '活动名称',
					dataIndex: 'actName',
					placeholder: '请输入活动名称',
				},
			],
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getPlatActPageConfList()
					},
				},
				{
					title: '创建活动配置',
					type: 'primary',
					auth: 'addPlatActPageConf',
					click: () => {
						this.pageConfigRow = {}
						this.pageConfigDisabled = false
						this.pageConfigDialog = true
					},
				},
			],
			tableColumns: [
				{
					title: '活动ID',
					dataIndex: 'id',
				},
				{
					title: '活动名称',
					dataIndex: 'actName',
				},
				{
					title: '关联奖励',
					dataIndex: 'actSaleRewardName',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '查看',
							auth: 'getPlatActPageConfDetail',
							click: (row) => {
								this.pageConfigRow = row
								this.pageConfigDisabled = true
								this.pageConfigDialog = true
							},
						},
						{
							title: '编辑',
							auth: 'updatePlatActPageConf',
							click: (row) => {
								this.pageConfigRow = row
								this.pageConfigDisabled = false
								this.pageConfigDialog = true
							},
						},
						{
							title: '复制路径',
							// auth: 'operateActEntranceStatus',
							click: (row) => {
								this.$copyText(
									`/subpages/marketingBonus/marketingBonus?actId=${row.id}`
								).then(() => {
									this.$message.success('复制成功')
								})
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
					this._getPlatActPageConfList()
				},
			},
			tableData: [],
		}
	},
	created() {
		this._getPlatActPageConfList(true)
	},
	methods: {
		async _getPlatActPageConfList(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await getPlatActPageConfList(paramJson)

			if (resultCode == 0) {
				if (resultData && resultData.records.length > 0) {
					this.page.count = resultData.total
					this.tableData = resultData.records
				} else {
					this.page.count = 0
					this.tableData = []
				}
			}
			this.loading = false
		},
		findSearchParams(flag) {
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.formData, {
				length: this.page.length,
				currentPage: this.page.currentPage,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})
			return paramJson
		},
	},
}
</script>
<style lang="scss"></style>

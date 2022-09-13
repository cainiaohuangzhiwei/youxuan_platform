<template>
	<div class="userGroupList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData111"
				:items="formCfg111"
				:formAction="formAction111"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns112"
				:pagination="page112"
				:data="tableData112"
			></yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { brandSubscribeStatistics } from '@/api/cmsBrandSubscribe'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	props: [],
	data() {
		return {
			loading: false,
			formData111: {
				brandParentId: '',
				brandParentName: '',
			},
			formCfg111: [
				{
					type: 'input',
					title: '品牌ID',
					dataIndex: 'brandParentId',
					width: '300',
					placeholder: '请输入品牌ID',
					enter: () => {
						if (!this.loading) this.getData112(true)
					},
				},
				{
					type: 'input',
					title: '品牌名称',
					dataIndex: 'brandParentName',
					width: '300',
					placeholder: '请输入品牌名称',
					enter: () => {
						if (!this.loading) this.getData112(true)
					},
				},
			],
			formAction111: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData112(true)
					},
					tableId: 112,
				},
			],
			tableData112: [],
			tableColumns112: [
				{
					type: 'string',
					dataIndex: 'brandParentId',
					title: '品牌ID',
				},
				{
					type: 'string',
					dataIndex: 'brandParentName',
					title: '品牌名称',
				},
				{
					type: 'string',
					dataIndex: 'totalSubscribeUser',
					title: '预约人数',
				},
				{
					type: 'string',
					dataIndex: 'totalSubscribeCount',
					title: '预约次数',
				},
				{
					type: 'string',
					dataIndex: 'nearlySubscribeCount',
					title: '近一场预约次数',
				},
			],
			page112: {
				count: 1,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData112()
				},
			},
		}
	},

	created() {
		this.getData112(true)
	},

	methods: {
		async getData112(flag) {
			this.loading = true
			let paramJson = this.findSearchParams112(flag)
			const {
				data: { resultCode, resultData },
			} = await brandSubscribeStatistics(paramJson)
			if (resultCode != 0) {
				this.$message({
					type: 'error',
					message: '查询超时',
					duration: 3000,
				})
			}
			if (resultData.statisticsList) {
				this.tableData112 = resultData.statisticsList
				this.page112.count = resultData.count
			}
			this.loading = false
		},
		findSearchParams112(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page112.currentPage = 1
			}
			const paramJson = Object.assign(this.formData111, {
				length: this.page112.length,
				startIndex: (this.page112.currentPage - 1) * this.page112.length,
			})
			return paramJson
		},
	},
}
</script>

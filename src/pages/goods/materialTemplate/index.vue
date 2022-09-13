<template>
	<basicContainer>
		<el-button
			class="add-template"
			:disabled="tableData.length >= 5"
			type="primary"
			@click="addTemplate"
			>新增模板</el-button
		>
		<yx-table v-loading="loading" :columns="tableColumns" :data="tableData">
		</yx-table>
		<add-and-edit-template
			:dialogVisible.sync="visible"
			:dialogTitle="dialogTitle"
			:itemInfo="itemInfo"
			@initList="_brandTemplateList"
		/>
	</basicContainer>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import addAndEditTemplate from './components/addAndEditTemplate'
import { setViewTitle } from '@/utils/helper/common'
import {
	brandTemplateList,
	brandTemplateDelete,
} from '@/api/promotionMaterials'

export default {
	name: 'MaterialTemplate',
	components: {
		BasicContainer,
		YxTable,
		addAndEditTemplate,
	},
	props: [],
	data() {
		return {
			loading: false,
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'id',
					title: '模板ID',
				},
				{
					type: 'string',
					dataIndex: 'materialTemplateName',
					title: '模板名称',
				},
				{
					type: 'string',
					dataIndex: 'materialTemplateRemark',
					title: '备注',
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.itemInfo = row
								this.visible = true
								this.dialogTitle = '编辑模板'
							},
						},
						{
							title: '删除',
							click: ({ id }) => {
								this._brandTemplateDelete(id)
							},
						},
					],
				},
			],
			visible: false,
			dialogTitle: '',
			itemInfo: null,
		}
	},

	created() {
		let { brandParentId = '' } = this.$route.params
		setViewTitle(this.$store, this.$route, `${brandParentId}`)
		this._brandTemplateList()
	},
	methods: {
		addTemplate() {
			this.visible = true
			this.dialogTitle = '新增模板'
			this.itemInfo = {}
		},
		async _brandTemplateDelete(materialTemplateId) {
			let {
				data: { resultCode },
			} = await brandTemplateDelete({
				materialTemplateId,
				brandParentId: this.$route.params.brandParentId,
			})
			if (resultCode == 0) {
				this.$message.success('删除成功')
				this._brandTemplateList()
			}
		},
		async _brandTemplateList() {
			this.itemInfo = null
			this.loading = true
			let {
				data: { resultCode, resultData },
			} = await brandTemplateList({
				brandParentId: this.$route.params.brandParentId,
			})
			this.loading = false
			if (resultCode == 0) {
				this.tableData = resultData.brandRefMaterialTemplateList || []
			}
		},
	},
}
</script>
<style>
.add-template {
	margin-bottom: 20px;
}
</style>

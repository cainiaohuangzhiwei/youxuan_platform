<template>
	<div>
		<p>敏感词提示</p>
		<p>当相关敏感词出现在检测源时，系统会提示操作人员进行修改。</p>
		<yx-table
			:select="false"
			v-loading="loading104"
			:columns="tableColumns104"
			:data="tableData104"
		>
		</yx-table>
		<Dialog
			:title="dialogTitle126"
			:visible.sync="dialogVisible126"
			:width="dialogWidth126"
			:bottomBtn="dialogBottomBtn126"
		>
			<yx-form
				ref="dialog104"
				labelWidth="0px"
				:data="formData104"
				:items="formCfg104"
			></yx-form>
			<p>输入需要检测的敏感词，每个敏感词后加英文逗号作间隔。</p>
		</Dialog>
	</div>
</template>

<script>
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import YxForm from '@wg-vue-materials/yx-form'
import {
	getSensitiveWordFilteringList,
	updateSensitiveWordFiltering,
} from '@/api/systemConfiguration'
export default {
	components: {
		YxTable,
		Dialog,
		YxForm,
	},
	data() {
		return {
			formData104: {},
			isShow: false,
			formCfg104: [
				{
					type: 'textarea',
					title: '',
					dataIndex: 'filterWord',
				},
			],
			dialogTitle126: '编辑分组文案敏感词',
			dialogVisible126: false,
			dialogWidth126: '600px',
			dialogBottomBtn126: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this._updateSensitiveWordFiltering()
					},
				},
			],
			loading104: false,
			tableColumns104: [
				{
					type: 'string',
					dataIndex: 'sensitiveWordId',
					title: 'ID',
					width: 80,
				},
				{
					type: 'string',
					dataIndex: 'detection',
					title: '检测源',
					width: 120,
				},
				{
					type: 'string',
					dataIndex: 'filterWord',
					title: '敏感词',
					customRender: ({ filterWord }) => {
						return filterWord && filterWord.length > 200
							? filterWord.substring(0, 200) + '......'
							: filterWord
					},
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					width: 80,
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.dialogVisible126 = true
								this.formData104 = JSON.parse(JSON.stringify(row))
							},
						},
					],
				},
			],
			tableData104: [],
		}
	},
	methods: {
		_updateSensitiveWordFiltering: async function () {
			let {
				data: { resultCode, resultMsg },
			} = await updateSensitiveWordFiltering({
				sensitiveId: this.formData104.sensitiveWordId,
				filterWord: this.formData104.filterWord,
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible126 = false
				this.init()
			}
		},
		init: async function () {
			this.loading104 = true
			let {
				data: { resultCode, resultData },
			} = await getSensitiveWordFilteringList()
			this.loading104 = false
			if (resultCode == 0) {
				this.isShow = true
				this.tableData104 = resultData.list || []
			} else {
				this.tableData104 = []
			}
		},
	},
}
</script>

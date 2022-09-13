<template>
	<div>
		<el-dialog
			width="50%"
			title="选择品牌"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			:modal-append-to-body="false"
		>
			<yx-form
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			>
			</yx-form>

			<el-row>
				<yx-table
					:highlightCcurrentRow="true"
					:changeRow="changeRow"
					:columns="tableColumns"
					:pagination="page"
					:data="list"
				>
				</yx-table>
			</el-row>
			<span slot="footer" class="dialog-footer">
				<el-button @click="localVisible = false">取 消</el-button>
				<el-button type="primary" @click="confirm">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { getBrandList } from '@/api/webImport'
import YxTable from '@wg-vue-materials/yx-table'
export default {
	components: {
		YxForm,
		YxTable,
	},
	props: {
		visible: {
			type: [Boolean],
			default: false,
		},
		row: {
			type: Object,
			default: () => ({}),
		},
		paramJson: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			formInline: {
				keyword: '',
			},
			formCfg: [
				{
					title: '品牌选择',
					dataIndex: 'keyword',
				},
			],
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getBrandList(true)
					},
				},
			],
			list: [],
			tableColumns: [
				{
					dataIndex: 'brandName',
					title: '品牌名称',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getBrandList()
				},
			},
			itemData: null,
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
	async created() {
		await this.getBrandList()
	},
	methods: {
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			let newSearchData = Object.assign(this.formInline, this.paramJson)
			const paramJson = Object.assign(newSearchData, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})

			return paramJson
		},
		async getBrandList(flag) {
			let paramJson = this.findSearchParams(flag)
			paramJson.selectionTag = 2
			let res = await getBrandList(paramJson)
			res = res.data
			if (res.resultCode === 0) {
				this.list = res.resultData.brandList
				this.page.count = res.resultData.brandCount
			}
		},
		changeRow(row) {
			this.itemData = row
			console.log('row', row)
		},
		confirm() {
			this.localVisible = false
			this.$emit('chooseBrand', this.itemData)
		},
	},
}
</script>

<style lang="scss" scoped></style>

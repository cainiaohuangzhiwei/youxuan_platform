<template>
	<div>
		<el-dialog
			width="850px"
			title="选择品牌品类"
			append-to-body
			:close-on-click-modal="false"
			:visible.sync="localVisible"
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
				<template slot="brandParentId" slot-scope="scope">
					<el-radio
						v-model="rowData.brandParentId"
						:label="scope.row.brandParentId"
						@change="changeAnchor(scope.row)"
						>选择</el-radio
					>
				</template>
			</yx-table>

			<div class="btn">
				<el-button type="primary" @click="submitForm">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getBrandParentList } from '@/api/yhtPlusWebGoods'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm,
		YxTable,
	},

	data() {
		return {
			item: [
				{
					title: '搜索',
					dataIndex: 'keyword',
					placeholder: '请输入品牌品类',
				},
			],
			searchData: {
				bankName: '',
			},
			rowData: {},
			loading: false,
			tableData: [],
			tableColumns: [
				{
					width: 200,
					type: 'custom',
					dataIndex: 'brandParentId',
				},
				{
					dataIndex: 'brandParentName',
					title: '品牌',
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
						this.init()
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

			const paramJson = Object.assign(this.searchData, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})

			return paramJson
		},

		// 获取品牌品类
		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await getBrandParentList(paramJson)
			this.loading = false

			if (resultCode == 0 && resultData.brandParentList.length > 0) {
				this.tableData = resultData.brandParentList
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},

		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.rowData = {}
		},

		// 确定
		submitForm() {
			if (!this.rowData.brandParentId) {
				return this.$message.warning('请选择品牌')
			}
			this.$emit('fatherMethodInit', this.rowData)
			this.resetForm()
		},
	},
}
</script>

<style lang="scss" scoped>
.btn {
	text-align: right;
}
</style>

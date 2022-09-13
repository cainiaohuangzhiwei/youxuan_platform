<template>
	<el-dialog
		width="810px"
		title="选择商家"
		append-to-body
		:close-on-click-modal="false"
		:visible.sync="localVisible"
		:before-close="resetForm"
		@open="open"
	>
		<YxForm
			:inline="true"
			:items="item"
			:data="searchData"
			:formAction="formAction"
		/>
		<YxTable
			:highlightCcurrentRow="true"
			:columns="tableColumns"
			:pagination="page"
			:data="tableData"
			><template slot="supplierId" slot-scope="scope">
				<el-radio
					v-model="currSupplierId.supplierId"
					@change="changeRow(scope.row)"
					:label="scope.row.supplierId"
					>选择</el-radio
				>
			</template></YxTable
		>
		<div class="page">
			<el-button type="primary" @click="submitForm">确定</el-button>
		</div>
	</el-dialog>
</template>

<script>
import { getSupplierList } from '@/api/userRewardSystem'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		YxForm: () => import('@wg-vue-materials/yx-form'),
		YxTable: () => import('@wg-vue-materials/yx-table'),
	},

	data() {
		return {
			currSupplierId: {},
			supplierName: '',
			tableColumns: [
				{
					type: 'custom',
					dataIndex: 'supplierId',
					title: '选择商家',
				},
				{
					dataIndex: 'supplierName',
					title: '商家名称',
				},
			],
			item: [
				{
					type: 'input',
					title: '商家',
					dataIndex: 'supplierName',
					placeholder: '请输入商家搜索',
				},
			],
			searchData: {
				supplierName: '',
			},
			loading: false,
			tableData: [],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.currentPage
						this.init(true)
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

	methods: {
		findSearchParams(flag) {
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.searchData, {
				length: this.page.length,
				currentPage: this.searchData.supplierName ? 1 : this.page.currentPage,
				startIndex: this.searchData.supplierName
					? 0
					: (this.page.currentPage - 1) * this.page.length,
			})
			return paramJson
		},

		async init(flag) {
			this.loading = true
			const paramJson = this.findSearchParams(flag)
			const {
				data: { resultCode, resultData },
			} = await getSupplierList(paramJson)
			if (resultCode == 0) {
				this.tableData = resultData.records.map((item) => {
					return {
						supplierId: item.supplierId,
						supplierName: item.supplierName,
					}
				})
				this.page.count = resultData.total
			} else {
				this.page.count = 0
				this.tableData = []
			}
			this.loading = false
		},

		open() {
			this.init()
		},

		changeRow(row) {
			this.currSupplierId = Object.assign({}, row)
			this.supplierName = row.supplierName
		},

		submitForm() {
			if (!this.currSupplierId.supplierId && !this.supplierName) {
				return this.$message.warning('请选择商家')
			}
			this.$emit(
				'checkSupplier',
				this.currSupplierId.supplierId,
				this.supplierName
			)
			this.resetForm()
		},
		resetForm() {
			this.currSupplierId = {}
			this.supplierName = ''
			this.localVisible = false
		},
	},
}
</script>

<style lang="scss" scoped>
.page {
	margin-top: 20px;
	text-align: right;
}

.supplier {
	width: 400px;
}
</style>

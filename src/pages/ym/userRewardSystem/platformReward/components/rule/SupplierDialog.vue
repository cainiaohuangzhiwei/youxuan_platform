<template>
	<el-dialog
		width="810px"
		title="选择商家"
		append-to-body
		:close-on-click-modal="false"
		:visible.sync="localVisible"
		:before-close="resetForm"
	>
		<YxForm
			ref="form"
			:inline="true"
			:items="item"
			:data="searchData"
			:formAction="formAction"
		>
			<template #supplierName>
				<el-input
					v-model="searchData.supplierName"
					placeholder="请输入商家搜索"
				/>
			</template>
		</YxForm>

		<el-table
			border
			v-loading="loading"
			ref="multipleTable"
			:data="tableData"
			tooltip-effect="dark"
			:row-key="getRowKeys"
			@selection-change="handleSelectionChange"
		>
			<el-table-column
				align="center"
				type="selection"
				:reserve-selection="true"
				width="55"
			/>
			<el-table-column align="center" prop="supplierName" label="商家名称" />
		</el-table>

		<el-pagination
			v-if="page.count > 0"
			class="page"
			:total="page.count"
			:page-size="page.length"
			:page-sizes="[10, 30, 50, 100]"
			:current-page="page.currentPage"
			layout="total, sizes, prev, pager, next, jumper"
			@current-change="nextPage"
			@size-change="handleSizeChange"
		/>

		<div class="page">
			<el-button type="primary" @click="submitForm">确定</el-button>
			<!-- <el-button @click="resetForm">取消</el-button> -->
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
	},

	data() {
		return {
			item: [
				{
					type: 'custom',
					title: '商家',
					dataIndex: 'supplierName',
				},
			],
			searchData: {
				supplierName: '',
			},
			supplierIds: [],
			supplierId: [],
			echoOff: false,
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
			multipleSelection: [],
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
		detail(supplierIds) {
			this.supplierIds = supplierIds
			this.echoOff = true
			this.init(true)
		},

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
				// ["皮超3", "皮超1", "汤文辉商家"]
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

		resetForm() {
			this.localVisible = false
			this.$refs.multipleTable.clearSelection()
			this.$refs.form.$refs.YxForm.resetFields()
		},

		resetTable() {
			this.$refs.multipleTable.clearSelection()
		},

		submitForm() {
			if (!this.multipleSelection.length) {
				return this.$message.warning('请选择商家')
			}

			const supplierId = this.multipleSelection.map((item) => {
				return item.supplierId
			})

			const supplierName = this.multipleSelection.map((item) => {
				return item.supplierName
			})

			this.$emit('supplierData', supplierId, supplierName)
			this.resetForm()
		},

		getRowKeys(row) {
			return row.supplierId
		},

		uniqueArr(array) {
			const obj = {}
			return array.filter((item) => {
				// 防止key重复
				const newItem = item + JSON.stringify(item)
				// eslint-disable-next-line no-prototype-builtins
				return obj.hasOwnProperty(newItem) ? false : (obj[newItem] = true)
			})
		},

		handleSelectionChange(val) {
			this.multipleSelection = this.uniqueArr(val)
		},

		handleSizeChange(val) {
			this.page.length = val
			this.init()
		},

		nextPage(val) {
			this.page.currentPage = val
			this.init()
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

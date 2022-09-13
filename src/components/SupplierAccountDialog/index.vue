<template>
	<div>
		<el-dialog
			width="850px"
			title="选择商家"
			append-to-body
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
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
				<template slot="supplierAccountNumberId" slot-scope="scope">
					<el-radio
						v-if="chooseType === 'radio'"
						v-model="rowData.supplierAccountNumberId"
						:label="scope.row.supplierAccountNumberId"
						@change="changeAnchor(scope.row, 'radio')"
						>选择</el-radio
					>
					<el-checkbox
						v-else
						v-model="supplierAccountNumberList"
						:label="scope.row"
						@change="multipleChangeAnchor(scope.row)"
						>选择</el-checkbox
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
import { supplierAccountNumberList } from '@/api/yhtPlusCmsSupplier.js'

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
		chooseType: {
			type: String,
			default: 'radio',
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
					placeholder: '请输入商家名称',
				},
			],
			searchData: {
				bankName: '',
			},
			rowData: {
				supplierAccountNumberList: [],
			},
			loading: false,
			tableData: [],
			tableColumns: [
				{
					width: 200,
					type: 'custom',
					dataIndex: 'supplierAccountNumberId',
				},
				{
					dataIndex: 'supplierName',
					title: '商家名称',
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
						this.init(true)
					},
				},
			],
			supplierAccountNumberList: [],
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

	created() {
		this.init()
	},

	methods: {
		// 单选
		changeAnchor(row, type) {
			if (type === 'checkbox') {
				this.rowData.supplierAccountNumberList.push(row)
			} else if (type === 'radio') {
				this.rowData = Object.assign({}, row)
			}
		},

		// 多选
		multipleChangeAnchor() {
			this.rowData.supplierName = this.supplierAccountNumberList
				.map((item) => {
					return item.supplierName
				})
				.join('，')
			this.rowData.supplierAccountNumberIds = this.supplierAccountNumberList.map(
				(item) => {
					return item.supplierAccountNumberId
				}
			)
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

		// 获取商家列表
		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const res = await supplierAccountNumberList(paramJson)
			const { count, supplierAccountNumberList: list } = res.data.resultData
			this.loading = false

			if (list.length > 0) {
				this.tableData = list
				this.page.count = count
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
			if (
				this.chooseType === 'radio' &&
				!this.rowData.supplierAccountNumberId
			) {
				return this.$message.warning('请选择一个商家')
			}

			if (
				this.chooseType === 'checkbox' &&
				this.supplierAccountNumberList.length === 0
			) {
				return this.$message.warning('请选择商家')
			}
			console.log(this.rowData)
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

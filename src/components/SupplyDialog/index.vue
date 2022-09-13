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

			<div class="choose-tips" v-if="chooseType === 'checkbox'">
				已选择{{ supplierAccountNumberListRawData.length }}个商家
			</div>

			<yx-table
				v-loading="loading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
				:select="chooseType === 'checkbox'"
				:selectionChange="selectionChange"
			>
				<template slot="supplierRow" slot-scope="scope">
					<el-radio
						v-model="rowData.supplierId"
						:label="scope.row.supplierId"
						@change="changeAnchor(scope.row, 'radio')"
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
import { getCmsSupplierListByCondition } from '@/api/webImport'

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
		supplierAccountNumberList: {
			type: Array,
			default: () => [],
		},
		showAppraiseSelect: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		YxForm,
		YxTable,
	},

	created() {
		this.init()
	},

	data() {
		return {
			item: [
				{
					title: '商家名称',
					dataIndex: 'supplierName',
					placeholder: '请输入商家名称',
					enter: () => {
						this.init(true)
					},
				},
				{
					type: 'select',
					title: '是否公开商品评价',
					dataIndex: 'supplierOpenStatus',
					label: 'value',
					hide: !this.showAppraiseSelect,
					change: () => {
						this.init(true)
					},
					options: [
						{
							supplierOpenStatus: '',
							value: '全部',
						},
						{
							supplierOpenStatus: 0,
							value: '未公开',
						},
						{
							supplierOpenStatus: 1,
							value: '公开',
						},
					],
				},
			],
			searchData: {
				supplierName: '',
				supplierOpenStatus: '',
			},
			rowData: {},
			loading: false,
			tableData: [],
			tableColumns: [
				{
					width: 200,
					type: 'custom',
					dataIndex: 'supplierRow',
				},
				{
					dataIndex: 'supplierId',
					title: '商家ID',
				},
				{
					dataIndex: 'supplierAccountNumberId',
					hide: !this.itemInfo,
					title: '商家账户ID',
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
			supplierAccountNumberListRawData: [],
			supplierIdList: [],
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
		supplierAccountNumberList(val) {
			this.supplierIdList = val.map((item) => item.supplierId)
		},
	},

	methods: {
		changeAnchor(row, type) {
			if (type === 'checkbox') {
				this.supplierAccountNumberListRawData.push(row)
			} else if (type === 'radio') {
				this.rowData = Object.assign({}, row)
			}
		},

		changeMulti(row) {
			const targetIndex = this.supplierAccountNumberListRawData.findIndex(
				(i) => i.supplierId === row.supplierId
			)
			if (targetIndex > -1) {
				this.supplierAccountNumberListRawData =
					this.supplierAccountNumberListRawData.filter(
						(item) => item.supplierId !== row.supplierId
					)
			} else {
				this.supplierAccountNumberListRawData.push(row)
			}
		},
		selectionChange(list) {
			this.supplierAccountNumberListRawData = list
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
			if (this.chooseType === 'checkbox') {
				this.tableColumns[0].type = 'none'
			} else {
				this.tableColumns[0].type = 'custom'
			}
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await getCmsSupplierListByCondition(paramJson)
			this.loading = false
			if (resultCode == 0 && resultData.supplierList.length > 0) {
				this.tableData = resultData.supplierList
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
			this.searchData.supplierName = ''
		},

		// 确定
		submitForm() {
			if (this.chooseType === 'radio' && !this.rowData.supplierId) {
				return this.$message.warning('请选择对应商家！')
			}

			if (
				this.chooseType === 'checkbox' &&
				this.supplierAccountNumberListRawData.length === 0
			) {
				return this.$message.warning('请选择商家')
			}

			if (this.chooseType === 'checkbox') {
				this.$emit('fatherMethodInit', this.supplierAccountNumberListRawData)
				this.resetForm()
				return
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
.choose-tips {
	margin-bottom: 10px;
}
</style>

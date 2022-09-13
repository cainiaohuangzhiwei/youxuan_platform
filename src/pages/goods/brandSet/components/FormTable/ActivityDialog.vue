<template>
	<div>
		<el-dialog
			width="850px"
			title="选择活动"
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
				<template slot="actDiscountId" slot-scope="scope">
					<el-radio
						v-model="rowData.actDiscountId"
						:label="scope.row.actDiscountId"
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
import { getActDiscountListByCondition } from '@/api/yhtPlusCmsAct'

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
			item: [],
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
					dataIndex: 'actDiscountId',
				},
				{
					dataIndex: 'actName',
					title: '活动名称',
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

			paramJson.openTypeList = ['1', '2']
			return paramJson
		},

		// 获取品牌品类
		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await getActDiscountListByCondition(paramJson)
			this.loading = false

			if (resultCode == 0 && resultData.actDiscountList.length > 0) {
				this.tableData = resultData.actDiscountList
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
			if (!this.rowData.actDiscountId) {
				return this.$message.warning('请选择活动')
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

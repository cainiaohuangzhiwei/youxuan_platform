<template>
	<div>
		<el-dialog
			width="850px"
			title="选择员工"
			append-to-body
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="init"
		>
			<yx-form ref="form" :inline="true" :data="searchData" :rules="funRules">
			</yx-form>

			<yx-table
				v-loading="loading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			>
				<template slot="userId" slot-scope="scope">
					<el-radio
						v-model="rowData.clerkId"
						:label="scope.row.clerkId"
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
import { getClerkListByCondition } from '@/api/clerk'

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
			rowData: {},
			loading: false,
			tableData: [],
			tableColumns: [
				{
					width: 200,
					type: 'custom',
					dataIndex: 'userId',
				},
				{
					dataIndex: 'clerkName',
					title: '员工名称',
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
		departmentId() {
			return process.env.NODE_ENV === 'development' ||
				location.href.indexOf('test') > -1 ||
				location.href.indexOf('growth') > -1
				? 1
				: 29
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

			const paramJson = Object.assign(
				{
					departmentId: this.departmentId,
				},
				{
					length: this.page.length,
					startIndex: (this.page.currentPage - 1) * this.page.length,
				}
			)

			return paramJson
		},

		// 获取商家列表
		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await getClerkListByCondition(paramJson)
			this.loading = false
			if (resultCode == 0 && resultData.clerkList.length > 0) {
				this.tableData = resultData.clerkList
				this.page.count = resultData.clerkCount
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},

		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.rowData = {}
			this.tableData = []
			// this.searchData.supplierName = ''
			//重置页面不能把操作重置
			this.page.count = 0
			this.page.length = 10
			this.page.currentPage = 1
		},

		// 确定
		submitForm() {
			if (!this.rowData.userId) {
				return this.$message.warning('请选择对应员工！')
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

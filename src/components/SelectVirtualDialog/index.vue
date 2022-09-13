<template>
	<div>
		<el-dialog
			width="850px"
			title="选择虚拟店主"
			append-to-body
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="init"
		>
			<yx-table
				v-loading="loading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			>
				<template slot="brandRow" slot-scope="scope">
					<el-radio
						v-model="rowData.id"
						:label="scope.row.id"
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
import YxTable from '@wg-vue-materials/yx-table'
import { virtualShopkeeperPage } from '@/api/newMaterial'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		selectVirtualRow: {
			type: Object,
			default: () => ({}),
		},
		paramJson: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
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
					dataIndex: 'brandRow',
				},
				{
					type: 'image',
					dataIndex: 'virtualShopkeeperPortraitUrl',
					title: '图片',
				},
				{
					dataIndex: 'virtualShopkeeperName',
					title: '店主名称',
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
		selectVirtualRow() {},
		localVisible(val) {
			if (val) {
				this.rowData = Object.assign({}, this.selectVirtualRow)
				this._virtualShopkeeperPage()
			}
		},
	},

	methods: {
		// 单选
		changeAnchor(row) {
			this.rowData = Object.assign({}, row)
		},

		// 搜索条件
		findSearchParams(flag) {
			let paramJson = {
				pageSize: 10,
				pageNum: 1,
			}
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.pageNum = this.page.currentPage
			return paramJson
		},

		async _virtualShopkeeperPage(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await virtualShopkeeperPage(paramJson)
			console.log(resultData, resultCode, 'aadfdfdfddfdf')
			this.loading = false
			if (resultCode == 0) {
				this.tableData = resultData.records
				this.page.count = resultData.total
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
			//重置页面不能把操作重置
			this.page.count = 0
			this.page.length = 10
			this.page.currentPage = 1
		},

		// 确定
		submitForm() {
			if (!this.rowData.id) {
				return this.$message.warning('请选择对应虚拟店主！')
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

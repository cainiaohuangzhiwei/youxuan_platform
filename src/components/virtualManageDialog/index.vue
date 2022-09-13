<template>
	<div>
		<el-dialog
			width="850px"
			title="虚拟店主管理"
			append-to-body
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="init"
		>
			<el-button type="primary" class="el-icon-plus mb" @click="addVirtual"
				>新增虚拟店主</el-button
			>
			<yx-table
				v-loading="loading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			>
			</yx-table>

			<!-- <div class="btn">
				<el-button type="primary" @click="submitForm">确定</el-button>
			</div> -->
		</el-dialog>
		<new-virtual-dialog
			:visible.sync="newVirtualDialog"
			:newVirtualRow="newVirtualRow"
			@pass="pass"
		></new-virtual-dialog>
	</div>
</template>

<script>
import YxTable from '@wg-vue-materials/yx-table'
import newVirtualDialog from '@/components/newVirtualDialog'
import { virtualShopkeeperPage, virtualShopkeeperDel } from '@/api/newMaterial'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		virtualManageRow: {
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
		newVirtualDialog,
	},

	data() {
		return {
			newVirtualDialog: false,
			newVirtualRow: {},
			item: [
				{
					title: '会场',
					dataIndex: 'keyword',
					placeholder: '请输入会场名称',
					enter: () => {
						this.init(true)
					},
				},
			],
			searchData: {
				keyword: '',
			},
			rowData: {},
			loading: false,
			tableData: [],
			tableColumns: [
				{
					type: 'image',
					dataIndex: 'virtualShopkeeperPortraitUrl',
					title: '图片',
				},
				{
					dataIndex: 'virtualShopkeeperName',
					title: '店主名称',
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.newVirtualRow = row
								this.newVirtualDialog = true
							},
						},
						{
							title: '删除',
							click: (row) => {
								let _this = this
								_this.$confirm('确定删除？', '提示', {
									type: 'warning',
									async callback(action) {
										if (action === 'confirm') {
											_this._virtualShopkeeperDel(row.id)
										}
									},
								})
							},
						},
					],
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._virtualShopkeeperPage()
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
		localVisible(val) {
			if (val) {
				this._virtualShopkeeperPage()
			}
		},
		virtualManageRow() {
			this.rowData = Object.assign({}, this.virtualManageRow)
		},
	},

	methods: {
		pass() {
			this._virtualShopkeeperPage()
		},
		async _virtualShopkeeperDel(id) {
			let params = {
				id: id,
			}
			let {
				data: { resultCode },
			} = await virtualShopkeeperDel(params)
			if (resultCode == 0) {
				this._virtualShopkeeperPage()
			}
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
		addVirtual() {
			this.newVirtualRow = {}
			this.newVirtualDialog = true
		},
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

		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.rowData = {}
			this.tableData = []
			this.searchData.keyword = ''
			//重置页面不能把操作重置
			this.page.count = 0
			this.page.length = 10
			this.page.currentPage = 1
		},

		// 确定
		submitForm() {
			if (!this.rowData.brandId) {
				return this.$message.warning('请选择对应会场！')
			}
			this.$emit('fatherMethodInit', this.rowData)
			this.resetForm()
		},
	},
}
</script>

<style lang="scss" scoped>
.mb {
	margin-bottom: 10px;
}
.btn {
	text-align: right;
}
</style>

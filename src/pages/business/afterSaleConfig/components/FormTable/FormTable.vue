<template>
	<div class="interestFormTable">
		<el-row :gutter="20">
			<el-col :span="4">
				<basic-container>
					<el-input
						placeholder="输入关键字进行过滤"
						v-model="filterText"
						style="margin-bottom: 12px"
					>
					</el-input>
					<el-tree
						ref="tree"
						node-key="goodsCategoryId"
						:highlight-current="true"
						:expand-on-click-node="false"
						:data="treeData"
						:props="defaultProps"
						:current-node-key="treeData[0].goodsCategoryId"
						:filter-node-method="filterNode"
						@node-click="handleNodeClick"
					></el-tree>
				</basic-container>
			</el-col>
			<el-col :span="20">
				<basic-container>
					<yx-form
						:inline="true"
						:data="searchData"
						:items="searchCfg"
						:formAction="searchAction"
					></yx-form>
					<el-row class="l-pis" type="flex" align="middle">
						<span>类别:</span>
						<el-breadcrumb separator-class="el-icon-arrow-right">
							<el-breadcrumb-item
								v-for="(item, index) in breadcrumb"
								:key="index"
								>{{ item.goodsCategoryName }}</el-breadcrumb-item
							>
						</el-breadcrumb>
					</el-row>
					<el-row>
						<yx-table
							v-loading="showLoading"
							:columns="tableColumns"
							:selectionChange="selectionChange"
							:pagination="page"
							:data="tableData"
						></yx-table>
					</el-row>
				</basic-container>
			</el-col>
		</el-row>
		<add-and-edit-dialog
			:options="treeData"
			:itemInfo="editRow"
			:visible.sync="formsDialog"
			@fatherMethodInit="
				() => {
					this.callList(true)
				}
			"
		/>
	</div>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import YxForm from '@wg-vue-materials/yx-form'
import { listGoodsCategory } from '@/api/yhtPlusCmsGoodsCategoryAttribute'
import { goodsCategoryTree } from '@/api/grossMargins'
import AddAndEditDialog from '../AddAndEditDialog'

export default {
	components: {
		BasicContainer,
		YxTable,
		YxForm,
		AddAndEditDialog,
	},
	name: 'FormTable',
	watch: {
		filterText(val) {
			this.$refs.tree.filter(val)
		},
	},
	data() {
		return {
			filterText: '',
			editRow: '',
			showLoading: false,
			formsDialog: false,
			batchDialog: false,
			addInviteCoderules: {
				inviteCodeCount: [
					{ required: true, message: '请输入生成数量', trigger: 'blur' },
				],
				remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
			},
			addInviteCodeAction: [
				{
					title: '确定',
					type: 'primary',
					click: (e) => {
						this.saveBatchInvite(e)
					},
				},
			],
			searchData: {
				goodsCategoryFatherId: '',
				sevenDaysWithoutReasonConfigType: '', //类型 0:初始化 1:不支持 2:支持，3:商家可跟据商品调整
			},

			searchCfg: [
				{
					title: '七天无理由支持类型',
					type: 'select',
					label: 'value',
					dataIndex: 'sevenDaysWithoutReasonConfigType',
					change: (val) => {
						this.callList(val)
					},
					options: [
						{
							sevenDaysWithoutReasonConfigType: '',
							value: '全部',
						},
						{
							sevenDaysWithoutReasonConfigType: 2,
							value: '支持',
						},
						{
							sevenDaysWithoutReasonConfigType: 1,
							value: '不支持',
						},
						{
							sevenDaysWithoutReasonConfigType: 3,
							value: '商家可根据商品调整',
						},
					],
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: (e) => {
						this.callList(true, e)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'goodsCategoryId',
					title: '类目ID',
				},
				{
					type: 'string',
					dataIndex: 'goodsCategoryName',
					title: '类目名称',
				},
				{
					type: 'map',
					dataIndex: 'enableStatus',
					title: '类目状态',
					options: {
						禁用: 0,
						启用: 1,
					},
				},
				{
					type: 'map',
					dataIndex: 'sevenDaysWithoutReasonConfigType',
					title: '七天无理由支持类型',
					options: {
						'-': null,
						不支持: 1,
						支持: 2,
						商家可跟据商品调整: 3,
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					fixed: 'right',
					actions: [
						{
							title: '编辑',
							auth: 'updateCategoryAttribute',
							click: (row) => {
								this.editRow = row
								this.editRow.type = 'edit'
								this.formsDialog = true
							},
						},
					],
				},
			],
			treeData: [],
			defaultProps: {
				children: 'goodsCategoryChildList',
				label: 'goodsCategoryName',
			},
			breadcrumb: [],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.callList()
				},
			},
		}
	},

	created() {
		this.initData()
	},

	methods: {
		initData() {
			this.getGoodsCategoryList()
		},
		filterNode(value, data, node) {
			if (!value) return true
			let parentNode = node.parent,
				labels = [node.label],
				level = 1
			while (level < node.level) {
				labels = [...labels, parentNode.label]
				parentNode = parentNode.parent
				level++
			}
			return labels.some((label) => label.indexOf(value) !== -1)
		},
		getGoodsCategoryList: async function () {
			let {
				data: { resultCode, resultData },
			} = await goodsCategoryTree()
			if (resultCode == 0) {
				this.treeData = [...resultData.goodsCategoryList]
			}
			this.$nextTick(() => {
				this.handleNodeClick(
					this.treeData[0],
					this.$refs.tree.getNode(this.treeData[0].goodsCategoryId)
				)
			})
		},
		handleNodeClick: function (data, node) {
			let breadcrumb = []
			let a = 0
			do {
				breadcrumb.push(node.data)
				node = node.parent
				a++
			} while (
				node &&
				Object.prototype.toString.call(node.data) === '[object Object]' &&
				a < 3
			)
			breadcrumb.reverse()
			this.breadcrumb = breadcrumb
			this.searchData.goodsCategoryFatherId =
				breadcrumb[breadcrumb.length - 1].goodsCategoryId || ''
			this.callList(true)
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				pageNum: 1,
				pageSize: 10,
			})
			// 每页的加载数据长度
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			// paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			paramJson.pageNum = this.page.currentPage
			return paramJson
		},
		callList: async function (flag, e) {
			let paramJson = this.findSearchParams(flag)
			// paramJson.goodsCategoryFatherId =
			let custom = {}
			if (e) {
				custom = {
					uid: e.currentTarget.__vue__._uid,
				}
			}
			this.showLoading = true
			let {
				data: { resultCode, resultData, total },
			} = await listGoodsCategory(paramJson, custom)

			this.showLoading = false
			if (
				resultCode == 0 &&
				resultData &&
				resultData &&
				resultData.length > 0
			) {
				this.tableData = resultData
				this.page.count = total
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		editInterest: function (data) {
			//显示编辑弹框
			if (data && data.goodsCategoryId) {
				this.editItem = data
			} else {
				this.editItem = {}
			}

			this.formsDialog = true
		},
	},
}
</script>

<style lang="scss" scope>
.button_row {
	margin-bottom: 20px;
}
.interestFormTable .el-tree-node__label {
	min-width: 0;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	word-break: break-all;
}
.l-pis {
	color: #606266;
	padding-right: 12px;
	margin-bottom: 16px;
}
</style>

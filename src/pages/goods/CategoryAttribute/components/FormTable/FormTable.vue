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
						:current-node-key="0"
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
		<batch-dialog
			:row="currentDta"
			:visible.sync="batchDialog"
			@fatherMethodInit="fatherMethodInit"
		/>
	</div>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import YxForm from '@wg-vue-materials/yx-form'
import {
	listCategoryAttribute,
	deleteCategoryAttribute,
	disableCategoryAttribute,
} from '@/api/yhtPlusCmsGoodsCategoryAttribute'
import { getConstantValueByKey } from '@/utils/helper/common'
import { goodsCategoryTree } from '@/api/grossMargins'
import AddAndEditDialog from '../AddAndEditDialog'
import BatchDialog from '../BatchDialog'

export default {
	components: {
		BasicContainer,
		YxTable,
		YxForm,
		AddAndEditDialog,
		BatchDialog,
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
				attributeName: '', //属性名称
				goodsCategoryId: '',
				attributeState: null, //属性状态 0-删除，1-正常，2-禁用
			},

			searchCfg: [
				{
					title: '属性名称',
					type: 'input',
					dataIndex: 'attributeName',
					placeholder: '请输入属性名称',
					enter: () => {
						this.callList(true)
					},
				},
				{
					title: '属性状态',
					type: 'select',
					label: 'value',
					dataIndex: 'attributeState',
					change: (val) => {
						this.callList(val)
					},
					options:
						this.$store.state.app.constant.CATEGORY_ATTRIBUTE_ATTRIBUTE_STATE,
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
				{
					title: '新增',
					type: 'primary',
					auth: 'saveCategoryAttribute',
					click: () => {
						this.editRow = ''
						this.formsDialog = true
					},
				},
				{
					title: '导入',
					type: 'primary',
					auth: 'importCategoryAttribute',
					click: () => {
						this.batchDialog = true
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'goodsCategoryAttributeId',
					title: '编号',
				},
				{
					type: 'string',
					dataIndex: 'goodsCategoryName',
					title: '类目名称',
				},
				{
					type: 'string',
					dataIndex: 'goodsCategoryLevel',
					title: '级别',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant
								.CATEGORY_ATTRIBUTE_GOODS_CATEGORY_LEVEL,
							row.goodsCategoryLevel,
							'-',
							'goodsCategoryLevel'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'goodsCategoryState',
					title: '类目状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.CATEGORY_ATTRIBUTE_ATTRIBUTE_STATE,
							row.goodsCategoryState,
							'-',
							'attributeState'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'goodsBasicsAttributeId',
					title: '属性ID',
				},
				{
					type: 'string',
					dataIndex: 'attributeName',
					title: '属性名称',
				},
				{
					type: 'string',
					dataIndex: 'attributeAnotherName',
					title: '属性别称',
				},
				{
					type: 'string',
					dataIndex: 'state',
					title: '属性状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.CATEGORY_ATTRIBUTE_ATTRIBUTE_STATE,
							row.state,
							'-',
							'attributeState'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'requiredType',
					title: '是否必填',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.CATEGORY_ATTRIBUTE_REQUIRED_TYPE,
							row.requiredType,
							'-',
							'requiredType'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'multipleType',
					title: '是否可多选',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.CATEGORY_ATTRIBUTE_MULTIPLE_TYPE,
							row.multipleType,
							'-',
							'multipleType'
						)
					},
				},
				// {
				// 	type: 'date',
				// 	dataIndex: 'updateTime',
				// 	title: '是否禁止自定义',
				// },
				{
					type: 'date',
					dataIndex: 'updateTime',
					title: '修改时间',
				},

				{
					type: 'action',
					title: '操作',
					width: '150',
					fixed: 'right',
					actions: [
						{
							title: '属性值编辑',
							auth: 'updateCategoryAttribute',
							click: (row) => {
								this.editRow = row
								this.editRow.type = 'edit'
								this.formsDialog = true
							},
						},

						{
							title: '删除',
							auth: 'deleteCategoryAttribute',
							popconfirm: true,
							popconfirmTitle: '是否删除该属性',
							confirm: (row) => {
								this.deleteIt(row)
							},
						},
						{
							title: '禁用',
							auth: 'disableCategoryAttribute',
							popconfirm: true,
							popconfirmTitle: '是否禁用该属性',
							confirm: (row) => {
								this.banIt(row)
							},
							customRender: (action, row) => {
								action.title = row.state == 2 ? '启用' : '禁用'
								action.popconfirmTitle =
									row.state == 2 ? '是否启用该属性' : '是否禁用该属性'
								return action
							},
						},
						{
							title: '查看',
							click: (row) => {
								this.editRow = row
								this.editRow.type = 'check'
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
		//删除
		async deleteIt(row) {
			this.loading = true
			const {
				data: { resultCode },
			} = await deleteCategoryAttribute({
				goodsCategoryAttributeId: row.goodsCategoryAttributeId,
			})
			this.loading = false
			if (resultCode == 0) {
				this.$message({
					message: '删除成功!',
					type: 'success',
				})
				this.callList()
			}
		},
		//禁、启用
		async banIt(row) {
			this.loading = true
			const {
				data: { resultCode },
			} = await disableCategoryAttribute({
				goodsCategoryAttributeId: row.goodsCategoryAttributeId,
				disable: row.state == 1 ? 2 : 1, //状态 1-启用，2-禁用
			})
			this.loading = false
			if (resultCode == 0) {
				this.$message({
					message: `${row.state == 1 ? '禁用' : '启用'}成功!`,
					type: 'success',
				})
				this.callList()
			}
		},
		initData() {
			this.getGoodsCategoryList()
		},
		filterNode(value, data, node) {
			// if (!value) return true
			// return data.goodsCategoryName.indexOf(value) !== -1
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
				this.treeData = [
					{
						goodsCategoryId: 0,
						goodsCategoryLevel: 0,
						goodsCategoryName: '全部',
					},
					...resultData.goodsCategoryList,
				]
			}
			this.$nextTick(() => {
				this.handleNodeClick(this.treeData[0], this.$refs.tree.getNode(0))
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
			this.searchData.goodsCategoryId =
				breadcrumb[breadcrumb.length - 1].goodsCategoryId || ''
			this.callList(true)
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				length: 1,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		callList: async function (flag, e) {
			let paramJson = this.findSearchParams(flag)
			let custom = {}
			if (e) {
				custom = {
					uid: e.currentTarget.__vue__._uid,
				}
			}
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await listCategoryAttribute(paramJson, custom)

			this.showLoading = false
			if (
				resultCode == 0 &&
				resultData &&
				resultData.records &&
				resultData.records.length > 0
			) {
				this.tableData = resultData.records
				this.page.count = resultData.total
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

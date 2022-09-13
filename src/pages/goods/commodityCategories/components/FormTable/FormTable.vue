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
					<el-row type="flex" align="middle">
						<span style="color: #606266; padding-right: 12px">类别:</span>
						<el-breadcrumb separator-class="el-icon-arrow-right">
							<el-breadcrumb-item
								v-for="(item, index) in breadcrumb"
								:key="index"
								>{{ item.goodsCategoryName }}</el-breadcrumb-item
							>
						</el-breadcrumb>
					</el-row>
					<el-row>
						<el-button
							v-if="!threeLevel"
							class="mf"
							type="primary"
							v-auth="addGoodsCategory"
							@click="editInterest(tableData, 1)"
							>新增类目</el-button
						>

						<yx-table
							v-loading="showLoading"
							:columns="tableColumns"
							:selectionChange="selectionChange"
							:pagination="page"
							:data="tableData.goodsCategoryList"
						></yx-table>
						<editDialog
							:dialogVisible.sync="showEditDialog"
							:itemInfo.sync="editItem"
							@updateList="searchInterestListByCate(false)"
						></editDialog>
					</el-row>
				</basic-container>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import editDialog from './editDialog'
import { goodsCategoryTree } from '@/api/grossMargins'
import {
	getGoodsCategoryDetailList,
	delGoodsCategory,
	enableGoodsCategory,
} from '@/api/goodsList'
import moment from 'moment'
export default {
	components: {
		BasicContainer,
		editDialog,
		YxTable,
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
			showLoading: false,
			showEditDialog: false,
			threeLevel: false,
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
				goodsCategoryFatherId: 0,
			},
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'goodsCategoryId',
					title: '编号',
				},
				{
					type: 'string',
					dataIndex: 'goodsCategoryName',
					title: '类目名称',
				},
				{
					type: 'string',
					dataIndex: 'addTime',
					title: '创建时间',
					customRender: (row) => {
						return row.addTime
							? moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'updateTime',
					title: '更新时间',
					customRender: (row) => {
						return row.updateTime
							? moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'goodsCategoryLevel',
					title: '级别',
				},
				{
					type: 'string',
					dataIndex: 'goodsCount',
					title: '商品数量',
				},
				{
					type: 'string',
					dataIndex: 'enableStatus',
					title: '状态',
					customRender: (row) => {
						return row.enableStatus ? '启用' : '禁用'
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '编辑',
							auth: 'editGoodsCategory',
							click: (row) => {
								this.editInterest(row, 2)
							},
						},
						{
							title: '删除',
							auth: 'delGoodsCategory',
							popconfirm: true,
							popconfirmTitle: '是否删除该类目',
							confirm: (row) => {
								this.deleteIt(row)
							},
						},
						{
							title: '禁用',
							auth: 'enableGoodsCategory',
							popconfirm: true,
							popconfirmTitle: '是否禁用该类目',
							confirm: (row) => {
								this.banIt(row)
							},
							customRender: (action, row) => {
								action.title = row.enableStatus == 0 ? '启用' : '禁用'
								action.popconfirmTitle =
									row.enableStatus == 0 ? '是否启用该类目' : '是否禁用该类目'
								return action
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
					this.searchInterestListByCate()
				},
			},
		}
	},

	created() {
		this.initData()
	},

	methods: {
		//禁、启用
		async banIt(row) {
			this.loading = true
			const {
				data: { resultCode },
			} = await enableGoodsCategory({
				goodsCategoryId: row.goodsCategoryId,
				enableStatus: row.enableStatus == 0 ? 1 : 0, //状态 1-启用，0-禁用
			})
			this.loading = false
			if (resultCode == 0) {
				this.$message({
					message: `${row.enableStatus == 1 ? '禁用' : '启用'}成功!`,
					type: 'success',
				})
				this.getGoodsCategoryList()
			}
		},
		//删除
		async deleteIt(row) {
			this.loading = true
			const {
				data: { resultCode },
			} = await delGoodsCategory({
				goodsCategoryId: row.goodsCategoryId,
			})
			this.loading = false
			if (resultCode == 0) {
				this.$message({
					message: '删除成功!',
					type: 'success',
				})
				this.getGoodsCategoryList()
			}
		},
		initData() {
			this.getGoodsCategoryList()
		},
		filterNode(value, data) {
			if (!value) return true
			return data.goodsCategoryName.indexOf(value) !== -1
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
			this.searchData.goodsCategoryFatherId =
				breadcrumb[breadcrumb.length - 1].goodsCategoryId
			this.searchInterestListByCate(true)
		},
		save: async function (e) {
			console.log(e)
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
		searchInterestListByCate: async function (flag, e) {
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
			} = await getGoodsCategoryDetailList(paramJson, custom)

			this.showLoading = false

			if (
				resultData.fatherGoodsCategoryName &&
				resultData.fatherGoodsCategoryName.split('>').length == 3
			) {
				console.log('jibie')
				this.threeLevel = true
			} else {
				this.threeLevel = false
			}
			if (
				resultCode == 0 &&
				resultData &&
				resultData.goodsCategoryList &&
				resultData.goodsCategoryList.length > 0
			) {
				this.tableData = resultData
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		editInterest: function (data, type) {
			console.log('data', data)
			//显示编辑弹框
			if (data) {
				this.editItem = data
				this.editItem.fatherGoodsCategoryName =
					this.breadcrumb[0].goodsCategoryName
				this.editItem.type = type
				this.editItem.atPresentId = this.searchData.goodsCategoryFatherId
			} else {
				this.editItem = {}
			}

			this.showEditDialog = true
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
.mf {
	float: right;
	margin-bottom: 10px;
}
</style>

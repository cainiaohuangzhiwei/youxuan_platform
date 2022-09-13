<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>
			<el-row>
				<yx-table
					ref="filterTable"
					v-loading="showLoading"
					:columns="tableColumns"
					:data="tableData"
					:row-key="getRowKeys"
					:expandRowKeys="expands"
					:tree-props="{
						children: 'childCategoryList',
						hasChildren: 'hasChildren',
					}"
				>
					<template slot="imgUrl" slot-scope="scope">
						<div v-if="scope.row.imgUrl">
							<el-image
								:src="scope.row.imgUrl"
								:preview-src-list="[scope.row.imgUrl]"
							></el-image>
						</div>
						<div v-else>-</div>
					</template>
				</yx-table>
			</el-row>
		</div>
		<add-and-edit-dialog
			:itemInfo="editRow"
			:visible.sync="formsDialog"
			:title="title"
			:type="type"
			@fatherMethodInit="
				() => {
					this.callGoodsCategoryFrontTree()
				}
			"
		/>
		<three-dialog
			:itemInfo="editRow"
			:visible.sync="ThreeDialog"
			:title="title"
			:type="type"
			@fatherMethodInit="
				() => {
					this.callGoodsCategoryFrontTree()
				}
			"
		/>
	</basic-container>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getBigImg } from '@/utils/imageTool'
import BasicContainer from '@wg-vue-materials/basic-container'
import {
	goodsCategoryFrontTree,
	deleteGoodsCategoryFront,
} from '@/api/goodsCategoryFront'
import AddAndEditDialog from '../AddAndEditDialog'
import ThreeDialog from '../ThreeDialog'
import moment from 'moment'
export default {
	components: {
		BasicContainer,
		AddAndEditDialog,
		YxForm,
		YxTable,
		ThreeDialog,
	},
	name: 'FormTable',
	data() {
		return {
			formsDialog: false,
			showLoading: false,
			ThreeDialog: false,
			expands: [],
			editRow: '',
			type: '',
			title: '',
			searchData: {
				keyWord: '', //关键字
			},
			searchCfg: [
				{
					title: '类目名称',
					type: 'input',
					dataIndex: 'keyWord',
					placeholder: '请输入类目名称',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: (e) => {
						this.callGoodsCategoryFrontTree(e)
					},
				},
				{
					title: '新建一级类目',
					type: 'primary',
					auth: 'addGoodsCategoryFront',
					click: () => {
						this.type = 'new'
						this.title = '新建一级类目'
						this.editRow = {}
						this.formsDialog = true
					},
				},
			],
			tableDataSave: [],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'categoryName',
					title: '分类名称',
					// width: 280,
					align: 'left',
				},
				{
					type: 'custom',
					dataIndex: 'imgUrl',
					title: '分类图片',
					width: 200,
				},
				{
					type: 'string',
					dataIndex: 'sort',
					title: '排序值',
					width: 60,
				},
				{
					type: 'string',
					dataIndex: 'categoryType',
					title: '类型',
					width: 100,
					customRender: (row) => {
						return row.categoryType == 1
							? '常规类目'
							: row.categoryType == 2
							? '活动类目'
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'validEndTime',
					title: '有效时间',
					customRender: (row) => {
						return row.validStartTime && row.validEndTime
							? moment(row.validStartTime).format('YYYY年MM月DD日HH:mm') +
									'~~' +
									moment(row.validEndTime).format('YYYY年MM月DD日HH:mm')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'enableStatus',
					title: '状态',
					width: 60,
					customRender: (row) => {
						return row.enableStatus == 0
							? '禁用'
							: row.enableStatus == 1
							? '启用'
							: '-'
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '210',
					actions: [
						{
							title: '新建类目',
							auth: 'addGoodsCategoryFront',
							click: (row) => {
								this.editRow = row
								this.type = 'new'
								this.title =
									row.categoryLevel == 1
										? '新建二级类目'
										: row.categoryLevel == 2
										? '新建三级类目'
										: '-'
								if (row.categoryLevel == 1) {
									this.formsDialog = true
								} else if (row.categoryLevel == 2) {
									this.ThreeDialog = true
								}
							},
							customRender: (action, row) => {
								action.title =
									row.categoryLevel == 1
										? '新建二级类目'
										: row.categoryLevel == 2
										? '新建三级类目'
										: '-'
								action.hide = row.categoryLevel == 3
								return action
							},
						},
						{
							title: '编辑',
							auth: 'updateGoodsCategoryFront',
							click: (row) => {
								this.editRow = row
								this.type = 'edit'
								this.title =
									row.categoryLevel == 1
										? '编辑一级类目'
										: row.categoryLevel == 2
										? '编辑二级类目'
										: '编辑三级类目'
								this.editRow.parentName = this.threeLevel(this.tableData, row)
								if (row.categoryLevel == 1 || row.categoryLevel == 2) {
									this.formsDialog = true
								} else if (row.categoryLevel == 3) {
									this.ThreeDialog = true
								}
							},
						},
						{
							title: '删除',
							auth: 'deleteGoodsCategoryFront',
							popconfirm: true,
							popconfirmTitle: '是否删除该类目',
							confirm: (row) => {
								this.deleteGoodsCategoryFront(row)
							},
							customRender: (action, row) => {
								action.popconfirmTitle =
									row.categoryLevel == 1
										? '删除一级类目会把其下所有子类目一并删除'
										: row.categoryLevel == 2
										? '删除二级类目会把其下所有子类目一并删除'
										: '确定删除'
								return action
							},
						},
					],
				},
			],
		}
	},
	watch: {
		'searchData.keyWord'(val) {
			this.expands = []
			this.tableData = this.filterMenu(this.tableDataSave, val)
		},
	},
	created() {
		this.callGoodsCategoryFrontTree()
		if (
			!this.$store.state.user.treeData ||
			this.$store.state.user.treeData.length == 0
		) {
			this.$store.dispatch('user/setTreeData')
		}
	},

	methods: {
		getRowKeys(row) {
			return row.goodsCategoryFrontId
		},
		filterMenu(menuList, menuCode) {
			menuList = JSON.parse(JSON.stringify(menuList))
			let newarr = []
			menuList.forEach((item) => {
				item = JSON.parse(JSON.stringify(item))
				if (item.childCategoryList && item.childCategoryList.length) {
					const ab = this.filterMenu(item.childCategoryList, menuCode)
					const obj = {
						...item,
						childCategoryList: ab,
					}
					if (obj.categoryName.indexOf(menuCode) > -1 || (ab && ab.length)) {
						if (menuCode) {
							this.$nextTick(() => {
								this.expands.push(JSON.stringify(obj.goodsCategoryFrontId))
							})
						}

						newarr.push(item)
					}
				} else {
					if (item.categoryName.indexOf(menuCode) > -1) {
						newarr.push(item)
					}
				}
			})
			return newarr
		},
		threeLevel(treeData, row, name = []) {
			for (let i = 0; i < treeData.length; i++) {
				if (treeData[i].goodsCategoryFrontId == row.parentId) {
					name.push(treeData[i].categoryName)
					break
				}

				if (
					treeData[i].childCategoryList &&
					treeData[i].childCategoryList.length > 0
				) {
					this.threeLevel(treeData[i].childCategoryList, row, name)
				}
			}
			return name[0]
		},
		findSearchParams() {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {})

			return paramJson
		},
		async deleteGoodsCategoryFront(row) {
			let paramJson = this.findSearchParams()
			this.showLoading = true
			let {
				data: { resultCode },
			} = await deleteGoodsCategoryFront({
				...paramJson,
				goodsCategoryFrontId: row.goodsCategoryFrontId,
			})

			if (resultCode == 0) {
				this.$message({
					message: '删除成功!',
					type: 'success',
				})
				this.callGoodsCategoryFrontTree()
			}
		},
		async callGoodsCategoryFrontTree(e) {
			let paramJson = this.findSearchParams()
			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await goodsCategoryFrontTree(paramJson, custom)

			this.showLoading = false
			if (resultCode == 0) {
				// this.tableData = this.changeImage(resultData)
				this.tableDataSave = JSON.parse(
					JSON.stringify(this.changeImage(resultData))
				)
				this.tableData = this.filterMenu(
					this.tableDataSave,
					this.searchData.keyWord
				)
			} else {
				this.tableData = []
				this.tableDataSave = []
			}
		},
		changeImage(arr) {
			arr.forEach((item) => {
				if (item.categoryImageUrl) {
					item.imgUrl = getBigImg(item.categoryImageUrl)
				}
				if (item.childCategoryList && item.childCategoryList.length > 0) {
					this.changeImage(item.childCategoryList)
				}
			})
			return arr
		},
	},
}
</script>

<template>
	<div>
		<yx-form
			:inline="true"
			:items="searchCfg"
			:formAction="searchAction"
		></yx-form
		><el-row>
			<yx-table
				v-loading="showLoading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			></yx-table>
		</el-row>
		<create-channel-dialog
			ref="mall"
			:visible.sync="createChannelVisible"
			@initTable="getSourceMaterialList"
			:itemInfo.sync="newBrandItem"
		></create-channel-dialog>
		<!-- //编辑内容 -->
		<Dialog
			:title="sceneTitle"
			:visible="editContentLoding"
			width="50%"
			:bottomBtn="editContentBottomBtn"
			@before-close="editContentLoding = false"
		>
			<el-button class="btn textm mb20" @click="relatedContent"
				>关联内容
			</el-button>
			<yx-table
				:select="true"
				v-loading="loading"
				:columns="editContentTable"
				:data="editContentTableData"
			>
				<template slot="sortOrder" slot-scope="scope">
					<div class="slot active">
						<div>
							<el-input
								type="number"
								min="1"
								v-model="scope.row.sortOrder"
							></el-input>
						</div>
					</div>
				</template>
			</yx-table>
			<yx-form
				labelWidth="100px"
				:data="dialogData"
				:rules="rules"
				:items.sync="dialogCfg"
			>
			</yx-form>
		</Dialog>

		<!-- //关联内容 -->
		<Dialog
			:title="关联内容"
			:visible="relatedContentLoding"
			width="50%"
			:bottomBtn="relatedContentBottomBtn"
			@before-close="relatedContentLoding = false"
		>
			<yx-form
				labelWidth="100px"
				:data="hzwData"
				:items.sync="hzwCfg"
				:formAction="hzwFormAction"
			>
			</yx-form>
			<yx-table v-loading="loading101" :columns="Table101" :data="TableData101">
			</yx-table>
		</Dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import {
	getSourceMaterialList,
	delSourceMaterial,
	getSourceMaterialManageListById,
	operationSourceMaterial,
	getSourceMaterialManageList,
} from '@/api/sourceMaterial'
import CreateChannelDialog from './CreateChannelDialog'

export default {
	components: {
		YxForm,
		YxTable,
		CreateChannelDialog,
		Dialog,
	},
	name: 'FormTable',

	data() {
		return {
			createChannelVisible: false,
			showLoading: false,
			editContentLoding: false,
			relatedContentLoding: false,
			editContentTableData: [],
			TableData101: [],
			hzwData: {
				keyWord: '',
			},
			Table101: [
				{
					type: 'string',
					dataIndex: 'sourceMaterialManageId',
					title: '内容id',
				},
				{
					type: 'string',
					dataIndex: 'title',
					title: '标题',
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '状态',
					customRender: (row) => {
						return row.status == 1 ? '启用' : '禁用'
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					fixed: 'right',
					actions: [
						{
							title: '添加',
							click: (row, t, index) => {
								this.additionList(row, 1, index)
							},
							customRender: (action, row) => {
								action.title = row.isRelation == 1 ? '移除' : '添加'
								return action
							},
						},
					],
				},
			],
			hzwCfg: [
				{
					title: '标题',
					type: 'input',
					dataIndex: 'keyWord',
				},
			],
			hzwFormAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.relatedContent()
					},
				},
			],
			dialogData: {
				state: 1, //状态
			},
			dialogCfg: [
				{
					type: 'radioMap',
					dataIndex: 'state',
					title: '状态',
					options: {
						启用: 1,
						禁用: 0,
					},
				},
			],
			editContentTable: [
				{
					type: 'string',
					dataIndex: 'sourceMaterialManageId',
					title: '内容id',
				},
				{
					type: 'string',
					dataIndex: 'title',
					title: '标题',
				},
				{
					type: 'custom',
					dataIndex: 'sortOrder',
					title: '入库数量',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					fixed: 'right',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.additionList(row, 2)
							},
							customRender: (action, row) => {
								action.title = row.state == 1 ? '移除' : '添加'
								return action
							},
						},
					],
				},
			],
			editContentBottomBtn: [
				{
					title: '确 定',
					type: '',
					click: () => {
						this.additionListBottomBtn()
					},
				},
			],
			relatedContentBottomBtn: [
				{
					title: '确 定',
					type: '',
					click: () => {
						this.addrelatedContentBottomBtn()
					},
				},
			],
			loading: false,
			sceneTitleOrRow: [],
			sceneTitle: null,
			searchAction: [
				{
					title: '新增',
					type: 'primary',
					click: () => {
						this.createChannel(null, 1)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'sourceMaterialId',
					title: '场景id',
				},
				{
					type: 'string',
					dataIndex: 'scene',
					title: '内容分类',
				},
				{
					field: 'status',
					title: '状态',
					align: 'center',
					valign: 'middle',
					customRender: (row) => {
						if (row.status == 0) {
							return '禁用'
						} else if (row.status == 1) {
							return '启用'
						}
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					fixed: 'right',
					actions: [
						{
							title: '编辑内容',
							click: (row) => {
								this.editContentClick(row)
							},
						},
						{
							title: '修改名称',
							click: (row) => {
								this.createChannel(row, 2)
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
											_this._messageDel(row.sourceMaterialId)
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
					this.getSourceMaterialList()
				},
			},
		}
	},

	created() {
		this.getSourceMaterialList(true)
	},

	methods: {
		relatedContent: async function () {
			this.relatedContentLoding = true
			this.loading101 = true
			let {
				data: { resultCode, resultData },
			} = await getSourceMaterialManageList({
				sourceMaterialId: this.sceneTitleOrRow.sourceMaterialId,
				keyWord: this.hzwData.keyWord,
			})
			if (resultCode == 0) {
				this.loading101 = false
				this.TableData101 = resultData.sourceMaterialManageList
			} else {
				this.TableData101 = []
			}
		},
		//确定关内容
		addrelatedContentBottomBtn: async function () {
			let relatedContentList = []
			this.TableData101.forEach((item) => {
				if (item.haveChange) {
					relatedContentList.push(item)
				}
			})
			let params = {
				sourceMaterialRelationList: relatedContentList,
				status: 1,
				sourceMaterialId: this.sceneTitleOrRow.sourceMaterialId,
			}
			let {
				data: { resultCode },
			} = await operationSourceMaterial(params)
			if (resultCode == 0) {
				this.$message.success('成功')
				this.relatedContentLoding = false
				this.getSourceMaterialManageListById()
			}

			console.log('item', relatedContentList)
		},
		//确定编辑内容
		additionListBottomBtn: async function () {
			let stockUpdateList = []
			this.editContentTableData.forEach((item) => {
				stockUpdateList.push(item)
			})
			let params = {
				sourceMaterialId: this.sceneTitleOrRow.sourceMaterialId,
				sourceMaterialRelationList: stockUpdateList,
				status: this.dialogData.state,
			}
			let {
				data: { resultCode },
			} = await operationSourceMaterial(params)
			if (resultCode == 0) {
				this.$message.success('成功')
				this.editContentLoding = false
			}
		},
		additionList(row, type, index) {
			// 添加/移除
			if (type == 2) {
				if (row.state == 1) {
					row.state = 0
				} else {
					row.state = 1
				}
			} else {
				console.log('index', index)
				if (row.isRelation == 1) {
					row.isRelation = 0
					row.state = 0
					this.TableData101[index].haveChange = true
				} else {
					row.isRelation = 1
					row.state = 1
					this.TableData101[index].haveChange = true
				}
			}
		},
		//编辑内容列表
		editContentClick: async function (row) {
			this.editContentLoding = true
			this.sceneTitleOrRow = row
			this.sceneTitle = row.scene
			this.getSourceMaterialManageListById(row)
		},
		getSourceMaterialManageListById: async function (row) {
			console.log('row', row)
			this.loading = true
			let {
				data: { resultCode, resultData },
			} = await getSourceMaterialManageListById({
				sourceMaterialId: this.sceneTitleOrRow.sourceMaterialId,
			})
			this.loading = false
			if (resultCode == 0) {
				this.editContentTableData =
					resultData && resultData.sourceMaterialRelationList
						? resultData.sourceMaterialRelationList
						: []
			} else {
				this.editContentTableData = []
			}
		},
		//删除
		_messageDel: async function (sourceMaterialId) {
			let paramJson = {
				sourceMaterialId,
			}
			let {
				data: { resultCode },
			} = await delSourceMaterial(paramJson)
			if (resultCode == 0) {
				this.$message.success('删除成功')
				this.getSourceMaterialList()
			}
		},
		createChannel(row, type) {
			//新增渠道
			this.createChannelVisible = true
			if (type == 2) {
				this.title = '编辑'
				this.newBrandItem = row
				this.$nextTick(() => {
					this.$refs.mall.mallDetail(row, type)
				})
			} else {
				this.title = '新增'
				this.newBrandItem = {}
			}
		},
		getSourceMaterialList: async function () {
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await getSourceMaterialList({})
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData =
					resultData && resultData.sourceMaterialList
						? resultData.sourceMaterialList
						: []
			} else {
				this.tableData = []
			}
		},
	},
}
</script>

<style>
.mb20 {
	margin-bottom: 20px;
}
</style>

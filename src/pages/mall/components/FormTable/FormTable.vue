<template>
	<basic-container>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="选品区" name="one">
				<el-button type="primary" @click="handleEdit(1)">新增</el-button>
				<keep-alive>
					<yx-table
						v-loading="loadingOne"
						:columns="tableColumns"
						:pagination="page"
						:data="tableData"
					></yx-table>
				</keep-alive>
			</el-tab-pane>
			<el-tab-pane label="首页" name="two">
				<el-button type="primary" @click="handleEdit(1)">新增</el-button>
				<keep-alive>
					<yx-table
						v-loading="loadingTwo"
						:columns="tableColumnsTwo"
						:pagination="pageTwo"
						:data="tableDataSecond"
					></yx-table>
				</keep-alive>
			</el-tab-pane>
			<edit-dialog
				ref="mall"
				:title="title"
				:visible.sync="userDialog"
				@fatherMethodOne="fatherMethodOne"
				@fatherMethodTwo="fatherMethodTwo"
			/>
		</el-tabs>
	</basic-container>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import EditDialog from './EditDialog'
import { getBigImg } from '@/utils/imageTool'
import { functionalAreaList, functionalAreaDelete } from '@/api/functionalAreas'
import { getConstantValueByKey } from '@/utils/helper/common'
export default {
	components: {
		BasicContainer,
		YxTable,
		EditDialog,
	},
	name: 'FormTable',
	data() {
		return {
			activeName: 'one',
			tableData: [],
			tableDataSecond: [],
			userDialog: false,
			loadingOne: false,
			loadingTwo: false,
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'imageName',
					title: '图标名称',
				},
				{
					type: 'string',
					dataIndex: 'sort',
					title: '排序值',
				},
				{
					type: 'string',
					dataIndex: 'isHide',
					title: '是否隐藏',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.IS_HIDE,
							row.isHide,
							'-',
							'state'
						)
					},
				},
				{
					type: 'image',
					dataIndex: 'imageUrl',
					class: 'poster_img',
					title: '图标',
				},
				{
					type: 'string',
					width: '350',
					dataIndex: 'jumpLocationLink',
					title: '跳转路径',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.handleEdit(row)
							},
						},
						{
							title: '删除',
							click: (row) => {
								this.functionalAreaDelete(row, 1)
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
					this.functionalAreaListOne()
				},
			},
			currentDtaOne: {
				imageName: '',
				sort: '',
				isHide: '0',
				imageList: [],
				jumpLocationLink: '',
			},
			tableColumnsTwo: [
				{
					type: 'string',
					dataIndex: 'imageName',
					title: '图标名称',
				},
				{
					type: 'string',
					dataIndex: 'sort',
					title: '排序值',
				},
				{
					type: 'string',
					dataIndex: 'isHide',
					title: '是否隐藏',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.IS_HIDE,
							row.isHide,
							'-',
							'state'
						)
					},
				},
				{
					type: 'image',
					dataIndex: 'imageUrl',
					class: 'poster_img',
					title: '图标',
				},
				{
					type: 'string',
					width: '350',
					dataIndex: 'jumpLocationLink',
					title: '跳转路径',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.handleEdit(row)
							},
						},
						{
							title: '删除',
							click: (row) => {
								this.functionalAreaDelete(row, 2)
							},
						},
					],
				},
			],
			pageTwo: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.functionalAreaListTwo()
				},
			},
		}
	},
	created() {
		this.functionalAreaListOne(true)
	},
	methods: {
		// tab切换
		handleClick(tab) {
			if (tab.name == 'one') {
				this.functionalAreaListOne()
			} else {
				this.functionalAreaListTwo()
			}
		},
		// 子组件调用父组件选品区方法更新
		fatherMethodOne() {
			this.functionalAreaListOne()
		},
		// 子组件调用父组件首页列表方法更新
		fatherMethodTwo() {
			this.functionalAreaListTwo()
		},
		//删除选品区
		functionalAreaDelete(data, type) {
			if (data.isHide != 1) {
				return this.$message.warning('请先隐藏功能区记录再操作')
			}
			this.$confirm('确定删除？', '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						let {
							data: { resultMsg },
						} = await functionalAreaDelete({
							functionalAreaId: data.functionalAreaId,
						})
						this.$message.success(resultMsg)
						if (type === 1 || type === 3) {
							this.functionalAreaListOne(true)
						} else {
							this.functionalAreaListTwo()
						}
					}
				},
			})
		},
		//选品区搜索条件
		findSearchParams(flag) {
			let paramJson = {}
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.type = 1
			paramJson.groupId = 2
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		// 首页搜索条件
		findSearchParamsTwo(flag) {
			let paramJson = {}
			// 每页的加载数据长度
			paramJson.length = this.pageTwo.length
			// 当前页的条数开始
			if (flag) {
				this.pageTwo.currentPage = 1
			}
			paramJson.type = 2
			paramJson.groupId = 2
			paramJson.startIndex =
				(this.pageTwo.currentPage - 1) * this.pageTwo.length
			return paramJson
		},
		//获取选品区
		async functionalAreaListOne(flag) {
			let paramJson = this.findSearchParams(flag)
			this.loadingOne = true
			let res = await functionalAreaList(paramJson)
			if (
				res.data.resultData.functionalAreaArrayList &&
				res.data.resultData.functionalAreaArrayList.length
			) {
				this.tableData = res.data.resultData.functionalAreaArrayList.map(
					(v) => {
						v.imageUrl = getBigImg(v.imageUrl)
						return v
					}
				)
				this.page.count = res.data.resultData.count
				this.loadingOne = false
			} else {
				this.page.count = 0
				this.tableData = []
				this.loadingOne = false
			}
		},
		// 获取首页
		async functionalAreaListTwo() {
			let paramJson = this.findSearchParamsTwo()
			this.loadingTwo = true
			let res = await functionalAreaList(paramJson)
			if (
				res.data.resultData.functionalAreaArrayList &&
				res.data.resultData.functionalAreaArrayList.length
			) {
				this.tableDataSecond = res.data.resultData.functionalAreaArrayList.map(
					(v) => {
						v.imageUrl = getBigImg(v.imageUrl)
						return v
					}
				)
				this.pageTwo.count = res.data.resultData.count
				this.loadingTwo = false
			} else {
				this.page.count = 0
				this.tableData = []
				this.loadingTwo = false
			}
		},
		// 弹窗显示
		handleEdit(data) {
			this.userDialog = true
			if (data !== 1) {
				this.title = this.activeName === 'one' ? 3 : 4
				this.$nextTick(() => {
					this.$refs.mall.detail(data)
				})
			} else {
				this.title = this.activeName === 'one' ? 1 : 2
			}
		},
	},
}
</script>
<style lang="scss">
.poster_img {
	width: 50px;
	height: 50px;
}
</style>

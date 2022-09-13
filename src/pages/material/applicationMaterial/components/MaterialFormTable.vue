<template>
	<basic-container>
		<div>
			<WgForm
				v-loading="exportLoading"
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
				:actionInline="true"
				labelWidth="6em"
			>
				<template slot="keyWords">
					<!-- 自动切割文字变数组输入组件 S -->
					<SplittedInput
						:value.sync="searchData.keyWords"
						placeholder="输入关键词搜索，批量搜索请换行或用逗号隔开"
					/>
					<!-- 自动切割文字变数组输入组件 E -->
				</template>
				<template slot="materialUseIds">
					<!-- 自动切割文字变数组输入组件 S -->
					<SplittedInput
						:value.sync="searchData.materialUseIds"
						placeholder="输入素材应用ID搜索，批量搜索请换行或用逗号隔开"
					/>
					<!-- 自动切割文字变数组输入组件 E -->
				</template>
				<template slot="materialClassifyId">
					<div style="width: 100%">
						<el-select
							v-model="searchData.materialClassifyId"
							multiple
							style="margin-left: 20px"
							placeholder="请选择"
						>
							<el-option
								v-for="item in materialClassList"
								:key="item.materialClassifyId"
								:label="item.materialClassifyName"
								:value="item.materialClassifyId"
							>
							</el-option>
						</el-select>
					</div>
				</template>
			</WgForm>
			<div class="total-content" v-if="statistics">
				在售商品<strong>{{ statistics.onSellingGoods }}</strong
				>, 在线商品素材<strong>{{ statistics.onlineGoodsMaterial }}</strong
				>, 在线活动素材<strong>{{ statistics.onlineActivityMaterial }}</strong>
				<br />
				共覆盖商品<strong>{{ statistics.involveGoods }}</strong
				>, 共覆盖素材<strong>{{ statistics.involveMaterial }}</strong>
			</div>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
					<template slot="goodsName" slot-scope="scope">
						<div v-if="scope.row.materialType == 1" class="slot">
							<div>
								<img
									class="goods_img"
									:src="getSmallImg(scope.row.goodsDefaultImage)"
									alt=""
								/>
							</div>
							<div style="text-align: left">
								<div class="goodsName">{{ scope.row.goodsName }}</div>
								<div>
									<el-tag
										:type="shelfStateMapTag[handleGoodsTag(scope.row)]"
										size="mini"
										>{{ handleGoodsTag(scope.row) }}</el-tag
									>
									<span class="number"> 货号：{{ scope.row.goodsNumber }}</span>
								</div>
							</div>
						</div>
						<div v-else>-</div>
					</template>
				</yx-table>
			</el-row>

			<!-- 新增/编辑 -->
			<MaterialEditDialog
				ref="form"
				:title="dialogTitle"
				:visible.sync="dialogVisible"
				:row="currentEditMaterial"
				:materialClassList="materialClassList"
				@initTable="_queryListByPage()"
			/>
		</div>
	</basic-container>
</template>

<script>
import WgForm from '@wg-vue-materials/wg-form'
import YxTable from '@wg-vue-materials/yx-table'
import BasicContainer from '@wg-vue-materials/basic-container'
import { orgReconciliationList } from '@/api/shopSettlement'
import {
	queryListByPage,
	queryMaterialClassifyListByPage,
	deleteMaterial,
	materialUseUpdateTop,
	materialUseStatistical,
} from '@/api/newMaterial'
import moment from 'moment'
import MaterialEditDialog from './MaterialEditDialog'
import { getSmallImg } from '@/utils/imageTool'
import SplittedInput from '@/components/SplittedInput'

export default {
	components: {
		BasicContainer,
		WgForm,
		YxTable,
		MaterialEditDialog,
		SplittedInput,
	},
	name: 'FormTable',

	data() {
		return {
			//当前编辑素材
			currentEditMaterial: {},
			//弹窗是否显示
			dialogVisible: false,
			//弹窗标题
			dialogTitle: '',
			//分类选项列表
			materialClassList: [],
			shelfStateMapTag: {
				在售: 'warning',
				待售: 'info',
				下架: 'info',
				推荐: 'danger',
			},
			// 统计数据展示
			statistics: null,
			// statistics: {
			// 	involveGoods: 0, // 覆盖商品数
			// 	involveMaterial: 0, // 覆盖素材数
			// 	onSellingGoods: 0, // 在售商品数
			// 	onlineActivityMaterial: 0, // 在线活动素材数
			// 	onlineGoodsMaterial: 0, // 在线商品素材数
			// },
			exportLoading: false,
			showLoading: false,
			searchData: {
				keyWords: [], // 关键词
				materialType: '', //素材类型
				materialClassifyId: [], // 分类
				// startTime: '', //档期开始时间
				// endTime: '', //档期结束时间
				currentTime: '', // 档期开售时间
				materialUseIds: [], // 素材应用ID
			},
			searchCfg: [
				{
					type: 'custom',
					title: '关键词',
					dataIndex: 'keyWords',
					colSpan: 6,
					labelWidth: '80px',
				},
				{
					type: 'custom',
					title: '素材应用ID',
					dataIndex: 'materialUseIds',
					colSpan: 6,
					labelWidth: '120px',
				},
				{
					title: '素材类型',
					type: 'select',
					dataIndex: 'materialType',
					options: [
						{
							materialType: '',
							value: '全部',
						},
						{
							materialType: 1,
							value: '商品素材',
						},
						{
							materialType: 2,
							value: '活动素材',
						},
					],
					label: 'value',
				},
				{
					title: '分类',
					type: 'custom',
					dataIndex: 'materialClassifyId',
					colSpan: 6,
					labelWidth: '40px',
				},
				// {
				// 	title: '档期时间',
				// 	type: 'datetimerange',
				// 	dataIndex: ['startTime', 'endTime'],
				// 	placeholder: ['开始时间', '结束时间'],
				// 	colSpan: 12,
				// },
				{
					title: '档期开售时间',
					type: 'time',
					dataIndex: 'currentTime',
					placeholder: '开始时间',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					auth: 'getMaterialUseByPage',
					align: 'right',
					click: () => {
						this._queryListByPage(true)
					},
				},
				{
					title: '新增',
					type: 'primary',
					auth: 'batchAddMaterialUse',
					align: 'right',
					click: () => {
						this.openDialog()
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'materialUseId',
					title: '素材应用ID',
					width: 100,
				},
				{
					type: 'custom',
					dataIndex: 'goodsName',
					title: '商品信息',
					width: 200,
				},
				{
					type: 'string',
					dataIndex: 'activityMaterialName',
					title: '活动信息',
					customRender: (row) => {
						return row.activityMaterialName || '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'goodsGroupName',
					title: '档期名称',
				},
				{
					type: 'map',
					dataIndex: 'materialType',
					title: '素材类型',
					width: 100,
					options: {
						商品素材: 1,
						活动素材: 2,
					},
				},
				{
					type: 'string',
					dataIndex: 'materialClassifyName',
					title: '分类',
				},
				{
					type: 'string',
					dataIndex: 'sortOrder',
					title: '排序值',
					width: 80,
				},
				{
					type: 'string',
					dataIndex: 'saleStartTime',
					title: '档期时间',
					customRender: (row) => {
						let dataStr = '-'
						if (row.saleStartTime && row.saleEndTime) {
							dataStr =
								moment(row.saleStartTime).format('YYYY-MM-DD HH:mm:ss') +
								' - ' +
								moment(row.saleEndTime).format('YYYY-MM-DD HH:mm:ss')
						}
						return dataStr
					},
				},
				{
					type: 'action',
					title: '操作',
					width: 150,
					actions: [
						{
							title: '置顶',
							auth: 'materialUseUpdateTop',
							click: (row) => {
								this.stickTop(row)
							},
							customRender: (action, row) => {
								action.title = row.isTop === 0 ? '' : '取消置顶'
								return action
							},
						},
						{
							title: '编辑',
							auth: 'updateMaterialUse',
							click: (row) => {
								this.openDialog(row)
							},
						},
						{
							title: '删除',
							auth: 'deleteMaterialUse',
							click: (row) => {
								let _this = this
								_this.$confirm('确定删除？', '提示', {
									type: 'warning',
									async callback(action) {
										if (action === 'confirm') {
											_this.delete(row)
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
					this._queryListByPage()
				},
			},
			getSmallImg: getSmallImg,
		}
	},
	created() {
		this._queryListByPage()
		this._queryMaterialClassifyListByPage()
	},

	mounted() {},

	methods: {
		// 置顶
		async stickTop(row) {
			const { isTop, materialUseId } = row
			const {
				data: { resultCode },
			} = await materialUseUpdateTop({
				materialUseId: materialUseId,
				isTopStatus: isTop === 0 ? 1 : 2,
			})
			if (resultCode === 0) {
				this.$message.success('操作成功')
				this._queryListByPage(true)
			} else {
				this.$message.error('操作失败')
			}
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
			})
			// 每页的加载数据长度
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			paramJson.pageNum = this.page.currentPage
			return paramJson
		},
		//查询列表数据
		_orgReconciliationList: async function (flag) {
			let paramJson = JSON.parse(JSON.stringify(this.findSearchParams(flag)))
			this.showLoading = true
			let {
				data: {
					resultCode,
					resultData: { count = 0, list = [] },
				},
			} = await orgReconciliationList(paramJson)
			console.log(flag, 'flag')
			this.showLoading = false
			if (resultCode == 0) {
				list = [{ remark: '2132' }]
				this.tableData = list
				this.page.count = count
			} else {
				this.tableData = []
				this.page.count = 0
			}
		},
		//查询素材列表数据
		_queryListByPage: async function (flag) {
			let paramJson = JSON.parse(JSON.stringify(this.findSearchParams(flag)))
			paramJson.materialClassifyId = this.searchData.materialClassifyId.join()

			this.showLoading = true
			const {
				data: { resultCode, resultData, total },
			} = await queryListByPage(paramJson)

			// 查询统计数据
			this._queryStatistics(paramJson)

			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData || []
				this.page.count = total
			} else {
				this.tableData = []
				this.page.count = 0
			}
		},
		// 查询统计数据
		_queryStatistics: async function (paramJson) {
			const {
				data: { resultCode, resultData },
			} = await materialUseStatistical(paramJson)
			if (resultCode === 0) {
				this.statistics = resultData
			}
		},
		//查询分类
		_queryMaterialClassifyListByPage: async function () {
			let {
				data: { resultCode, resultData },
			} = await queryMaterialClassifyListByPage({ pageSize: 50 })
			if (resultCode == 0) {
				this.materialClassList = resultData || []
			}
		},
		//打开弹窗
		openDialog(row) {
			this.dialogVisible = true
			if (row) {
				//编辑
				this.dialogTitle = '编辑'
				this.currentEditMaterial = row
			} else {
				//新增
				this.dialogTitle = '新增'
				this.currentEditMaterial = {}
			}
		},
		//删除数据
		delete: async function (row) {
			console.log(row)
			let paramJson = {
				materialUseId: row.materialUseId,
			}
			let {
				data: { resultCode },
			} = await deleteMaterial(paramJson)
			if (resultCode == 0) {
				this.$message.success('删除成功')
				this._queryListByPage()
			}
		},
		handleGoodsTag(row = {}) {
			let title =
				row.goodsShelfState == 2
					? row.goodsIsSale == 1
						? '在售'
						: '待售'
					: '下架'
			return title
		},
	},
}
</script>

<style lang="scss" scoped>
.slot {
	display: flex;
	align-items: center;
}
.goods_img {
	width: 60px;
	height: 60px;
	margin-right: 10px;
	line-height: 155px;
}
.goodsName {
	text-align: left;
}

.total-content {
	text-align: right;
	margin-bottom: 20px;
	color: #606266;
}

.total-content strong {
	font-size: 18px;
	margin: 0 4px;
	font-weight: 500;
	color: #1890ff;
}
</style>

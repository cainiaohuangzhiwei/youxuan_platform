<template>
	<basic-container>
		<div>
			<el-form :inline="true" ref="form" :model="form" label-width="80px">
				<div v-if="goodsGroupId" class="hasId">
					<div>档期 - {{ goodsGroupName }}</div>
					<i class="el-icon-error" style="color: red" @click="handleDelete"></i>
				</div>
				<div class="form-hearder">
					<div>
						<div class="hp">
							在售<span class="nj">{{
								goodsStatistics.withMaterialGoodsInSaleTotalNo
							}}</span
							>个商品,共<span class="nj">{{
								goodsStatistics.goodsInSaleWithAllStateMaterialTotalNo
							}}</span
							>个素材,在用<span class="nj">{{
								goodsStatistics.goodsInSaleWithEnableStateMaterialTotalNo
							}}</span
							>个素材
						</div>
						<div class="hbp">
							共覆盖<span>{{ goodsStatistics.withMaterialGoodsTotalNo }}</span
							>个商品，共<span>{{
								goodsStatistics.goodsWithAllStateMaterialTotalNo
							}}</span
							>个素材，启用状态共<span>{{
								goodsStatistics.goodsWithEnableStateMaterialTotalNo
							}}</span
							>个
						</div>
					</div>
					<div>
						<el-form-item>
							<el-select
								v-model="form.goodsIsSale"
								placeholder="商品状态"
								size="medium"
							>
								<el-option label="全部" value=""></el-option>
								<el-option label="在售" :value="1"></el-option>
								<el-option label="待售" :value="2"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<!-- <el-input
								size="medium"
								type="textarea"
								v-model="form.keyWord"
								style="width: 200px"
								placeholder="请输入商品名称、货号进行搜索;批量搜索请换行或用逗号隔开"
							></el-input> -->
							<SplittedInput
								:value.sync="form.keyWordList"
								placeholder="请输入商品名称、货号进行搜索，批量搜索请换行或用逗号隔开"
							/>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="handleDetails" size="medium"
								>查询</el-button
							>
							<el-button
								type="primary"
								@click="handleSynchro"
								size="medium"
								v-auth="'goodsMaterialSynchrodata'"
								>同步第三方</el-button
							>
							<el-button
								type="primary"
								@click="exportWordData"
								size="medium"
								v-auth="'goodsMaterialSynchrodata'"
								>导出</el-button
							>
							<el-button
								type="primary"
								v-auth="'goodsMaterialSaveBatch'"
								@click="handleAdd"
								size="medium"
								>新增素材</el-button
							>
						</el-form-item>
					</div>
				</div>
			</el-form>
			<el-row>
				<yx-table
					:columns="tableColumns"
					:select="true"
					:selectionChange="selectionChange"
					:pagination="page"
					:data="tableData"
					v-loading="tableLoading"
				>
					<template slot="goodsDefaultImage" slot-scope="scope">
						<div class="slot">
							<div>
								<img
									class="goods_img"
									:src="getSmallImg(scope.row.goodsDefaultImage)"
									alt=""
								/>
							</div>
							<div>
								<div>{{ scope.row.goodsName }}</div>
								<div>
									<el-tag :type="shelfStateMapTag[handleGoodsTag(scope.row)]">{{
										handleGoodsTag(scope.row)
									}}</el-tag>
									<span class="number">货号：{{ scope.row.goodsNumber }}</span>
								</div>
							</div>
						</div>
					</template>
				</yx-table>
			</el-row>
		</div>
		<new-material-dialog
			:visible.sync="newMaterialDialog"
			:newMaterialRow="newMaterialRow"
			@Refresh="Refresh"
		></new-material-dialog>
		<add-material-dialog
			:visible.sync="addMaterialDialog"
			:addMaterialRow="addMaterialRow"
			:showB="showB"
			@addRefresh="addRefresh"
		></add-material-dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import { getSmallImg } from '@/utils/imageTool'
import NewMaterialDialog from '@/components/NewMaterialDialog'
import AddMaterialDialog from '@/components/AddMaterialDialog'
import SplittedInput from '@/components/SplittedInput'
import { downloadFile } from '@/utils/helper/common'

import {
	goodsMaterialStatistics,
	goodsMaterialPage,
	materialSynchrodataBatch,
	exportGoodsMaterialWord,
} from '@/api/newMaterial'
export default {
	components: {
		BasicContainer,
		YxTable,
		NewMaterialDialog,
		AddMaterialDialog,
		SplittedInput,
	},
	name: 'FormTable',

	data() {
		return {
			params: this.$route.params,
			selectedList: [],
			authMap: {
				save: '/goods/material/save',
				all: '/goods/material/all',
			},
			showB: '',
			goodsStatistics: '',
			tableLoading: false,
			form: {
				goodsIsSale: '',
				keyWord: '',
				keyWordList: [],
			},
			getSmallImg: getSmallImg,
			newMaterialRow: {},
			newMaterialDialog: false,
			addMaterialDialog: false,
			addMaterialRow: {},
			shelfStateMapTag: {
				在售: 'warning',
				待售: 'info',
				下架: 'info',
				推荐: 'danger',
			},
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._goodsMaterialPage()
				},
			},
			tableData: [],
			tableColumns: [
				{
					width: 300,
					type: 'custom',
					dataIndex: 'goodsDefaultImage',
					title: '商品信息',
				},
				{
					dataIndex: 'materialTotalNo',
					title: '素材总数',
				},
				{
					dataIndex: 'inUseMaterialTotalNo',
					title: '在用素材总数',
				},
				{
					dataIndex: 'materialDownLoadTotalNo',
					title: '总下载次数',
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '素材管理',
							auth: 'goodsMaterialAll',
							click: (row) => {
								this.$router.push({
									name: 'commodityDetail',
									params: { goodsId: row.goodsId },
								})
							},
						},
					],
				},
			],
		}
	},
	created() {
		this._goodsMaterialStatistics()
		this._goodsMaterialPage()
		console.log(this.$store.state.leadin.id, 'aaaa=====')
	},
	computed: {
		goodsGroupId: function () {
			// 通过vuex的getters方法来获取state里面的数据
			return this.$store.state.leadin.groupRow.goodsGroupId
		},
		goodsGroupName: function () {
			// 通过vuex的getters方法来获取state里面的数据
			return this.$store.state.leadin.groupRow.goodsGroupName
		},
	},
	watch: {
		goodsGroupId() {
			this._goodsMaterialPage(true)
			this._goodsMaterialStatistics()
		},
	},
	methods: {
		selectionChange(list) {
			this.selectedList = list
		},
		handleSynchro() {
			if (!this.selectedList.length)
				return this.$message.warning('请先选择需要同步素材的商品')
			this.$confirm(
				'是否确认将所选的商品素材同步到第三方平台？',
				'同步第三方',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			)
				.then(() => {
					this._materialSynchrodataBatch()
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消同步第三方',
					})
				})
		},
		async _materialSynchrodataBatch() {
			let goodsIdList = this.selectedList.map((item) => {
				return item.goodsId
			})
			let params = {
				goodsIdList,
			}
			let {
				data: { resultCode },
			} = await materialSynchrodataBatch(params)
			if (resultCode == 0) {
				this.$message({
					type: 'success',
					message: '同步成功!',
				})
			}
		},
		handleDelete() {
			this.$store.dispatch('leadin/setMaterId', {})
			this._goodsMaterialStatistics()
			this._goodsMaterialPage()
		},
		Refresh(val) {
			this.addMaterialDialog = true
			this.addMaterialRow = val
			this.addMaterialRow.goodsGroupId = val?.goodsGroupList[0]?.goodsGroupId
			this.showB = 1
		},
		addRefresh(val) {
			this._goodsMaterialStatistics()
			this._goodsMaterialPage()
			if (val == 'next') {
				this.newMaterialDialog = true
			}
		},
		handleAdd() {
			this.newMaterialDialog = true
		},
		async _goodsMaterialStatistics() {
			let params = this.goodsGroupId ? { goodsGroupId: this.goodsGroupId } : {}
			let {
				data: { resultCode, resultData },
			} = await goodsMaterialStatistics(params)
			if (resultCode == 0) {
				this.goodsStatistics = resultData
			}
		},
		async _goodsMaterialPage(flag) {
			let params = this.findSearchParams(flag)
			this.tableLoading = true
			let {
				data: { resultCode, resultData },
			} = await goodsMaterialPage(params)
			this.tableLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.records || []
				this.page.count = resultData.total
			} else {
				this.tableData = []
			}
		},
		// 商品规格-处理显示商品状态
		handleGoodsTag(row = {}) {
			let title =
				row.goodsShelfState == 2
					? row.goodsIsSale == 1
						? '在售'
						: '待售'
					: '下架'
			return title
		},
		handleDetails() {
			this._goodsMaterialPage(true)
		},
		findSearchParams(flag) {
			const keyWordList = this.form.keyWordList
				.map((item) => item.trim())
				.filter((item) => !!item)

			const paramJson = {
				goodsIsSale: this.form.goodsIsSale,
				keyWord: this.form.keyWord,
				keyWordList,
				pageSize: 10,
				pageNum: 1,
			}
			if (this.goodsGroupId) paramJson.goodsGroupId = this.goodsGroupId
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.pageNum = this.page.currentPage
			return paramJson
		},
		async exportWordData() {
			if (this.selectedList.length === 0) {
				this.$message.warning('请勾选商品')
				return
			}

			await this.$confirm('确定导出Word文档？', '导出素材', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})

			const goodsIds = this.selectedList.map((item) => item.goodsId)
			const { data } = await exportGoodsMaterialWord({ goodsIds })
			downloadFile(data, '商品素材导出.docx')
		},
	},
}
</script>
<style lang="scss" scoped>
.form-hearder {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20px;
	color: rgb(152, 152, 152);
}
.slot {
	text-align: left;
	display: flex;
	align-items: center;
	.goods_img {
		width: 60px;
		height: 60px;
		margin-right: 10px;
		line-height: 155px;
	}

	.number {
		margin-left: 10px;
	}

	.goods_name {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
	}
}
.hp {
	font-size: 18px;
	color: #000;
}
.hbp {
	font-size: 16px;
	color: rgb(190, 190, 190);
}
.nj {
	margin-right: 6px;
	margin-left: 6px;
	color: blue;
}
.hasId {
	display: flex;
	align-items: center;
	font-size: 18px;
}
</style>

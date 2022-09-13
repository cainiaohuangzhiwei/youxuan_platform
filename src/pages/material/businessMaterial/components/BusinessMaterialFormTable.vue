<template>
	<basic-container>
		<div>
			<wg-form
				v-loading="exportLoading"
				:inline="false"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
				:actionInline="false"
				labelWidth="4em"
			>
				<template slot="keywordList">
					<SplittedInput
						:value.sync="searchData.keywordList"
						placeholder="商品名称/货号， 批量查询请用英文逗号或者换行分隔"
					/>
				</template>
			</wg-form>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
					<template slot="goodsName" slot-scope="scope">
						<div class="slot">
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
									<!-- <el-tag
										:type="shelfStateMapTag[handleGoodsTag(scope.row)]"
										size="mini"
										>{{ handleGoodsTag(scope.row) }}</el-tag
									> -->
									<span class="number"> 货号：{{ scope.row.goodsNumber }}</span>
								</div>
							</div>
						</div>
					</template>

					<template slot="auditRemark" slot-scope="scope">
						<div class="BusinessMaterialFormTable_box">
							<div
								class="BusinessMaterialFormTable_auditRemark"
								v-html="scope.row.auditRemark"
							></div>
							<el-image
								src="https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg"
								class="BusinessMaterialFormTable_auditRemark_mask"
								:preview-src-list="scope.row.auditRemarkImgs"
							>
							</el-image>
						</div>
					</template>
					<template slot="materialVO" slot-scope="scope">
						<div class="materialVO-content">
							<pre class="preS">{{
								scope.row.materialVO.wordMaterialContent
							}}</pre>
							<div class="media-list">
								<div
									class="media-item"
									v-for="(item, index) in scope.row.materialVO
										.picMaterialContents"
									:key="index"
								>
									<el-image
										v-if="item.materialContentType == 'image'"
										class="media-target"
										fit="cover"
										:src="item.picOrVideoMaterialContent"
										:preview-src-list="scope.row.materialVO.previewImgList"
									>
										<div slot="error" class="el-image__error">
											<i class="el-icon-picture-outline"></i>
										</div>
									</el-image>
									<video
										v-else
										controls
										:src="item.picOrVideoMaterialContent"
										class="media-target"
									></video>
								</div>
							</div>
						</div>
					</template>
				</yx-table>
			</el-row>

			<!-- 新增/编辑 -->
			<MaterialAuditDialog
				ref="form"
				:title="dialogTitle"
				:type="dialogType"
				:visible.sync="dialogVisible"
				:singeMaterialRow="currentEditMaterial"
				:materialClassList="materialClassList"
				@refresh="refresh"
				@initTable="_queryListByPage()"
			/>
		</div>
	</basic-container>
</template>

<script>
import WgForm from '@wg-vue-materials/wg-form'
import YxTable from '@wg-vue-materials/yx-table'
import BasicContainer from '@wg-vue-materials/basic-container'
import SplittedInput from '@/components/SplittedInput'
import { pageSupplierGoodsMaterialListFors } from '@/api/businessMaterial'

import moment from 'moment'
import MaterialAuditDialog from './MaterialAuditDialog'
import { getSmallImg } from '@/utils/imageTool'
import constant from '../constant'

export default {
	props: {
		// 类型
		name: {
			type: String,
			default: '',
		},
		activeName: {
			type: String,
			default: '',
		},
	},
	components: {
		BasicContainer,
		WgForm,
		YxTable,
		MaterialAuditDialog,
		SplittedInput,
	},
	name: 'FormTable',
	watch: {
		activeName(newVlaue) {
			if (newVlaue === this.name) {
				this._queryListByPage()
			}
		},
	},
	data() {
		return {
			constant,
			srcList: [
				'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
				'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg',
			],
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
			exportLoading: false,
			showLoading: false,
			searchData: {
				keyword: '', // 关键词
				keywordList: [], // 关键词
			},
			searchCfg: [
				{
					title: '关键词',
					type: 'custom',
					dataIndex: 'keywordList',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					auth: 'getMaterialUseByPage',
					// align: 'right',
					click: () => {
						this._queryListByPage(true)
					},
				},
			],
			tableData: [],
			previewImgList: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
					width: 120,
				},
				{
					type: 'custom',
					dataIndex: 'goodsName',
					title: '商品信息',
					width: 220,
				},
				{
					type: 'custom',
					dataIndex: 'materialVO',
					align: 'left',
					title: '素材内容',
				},
				{
					type: 'map',
					dataIndex: 'auditStatus',
					title: '状态',
					width: 100,
					options: {
						待审核: 2,
						已入库: 3,
						已驳回: 4,
					},
				},
				{
					type: 'custom',
					dataIndex: 'auditRemark',
					title: '驳回理由',
					width: 150,
					hide: this.name !== constant.REJECT,
				},
				{
					type: 'string',
					dataIndex: 'auditTime',
					title:
						this.name === constant.WAIT
							? '提审时间'
							: this.name === constant.SUCCESS
							? '入库时间'
							: '驳回时间',
					width: 150,
					customRender: (row) => {
						let dataStr = '-'
						if (row.auditTime) {
							dataStr = moment(row.auditTime).format('YYYY-MM-DD HH:mm:ss')
						}
						return dataStr
					},
				},

				// {
				// 	type: 'string',
				// 	dataIndex: 'saleStartTime',
				// 	title: '提审时间',
				// 	width: 250,
				// 	customRender: (row) => {
				// 		let dataStr = '-'
				// 		if (row.saleStartTime) {
				// 			dataStr = moment(row.saleStartTime).format('YYYY-MM-DD HH:mm:ss')
				// 		}
				// 		return dataStr
				// 	},
				// },
				{
					type: 'action',
					title: '操作',
					width: 150,
					actions: [
						{
							title: '审核素材',
							auth: 'auditGoodsMaterialForSupplier',
							hide: true,
							click: (row) => {
								this.openDialog(row, 'audit')
							},
							customRender: (action, row) => {
								action.hide = row.auditStatus !== 2
								return action
							},
						},
						{
							title: '编辑',
							auth: 'updateGoodsMaterialForSupplier',
							hide: true,
							click: (row) => {
								this.openDialog(row, 'edit')
							},
							customRender: (action, row) => {
								action.hide = row.auditStatus !== 3
								return action
							},
						},
						{
							title: '查看详情',
							auth: 'detailGoodsMaterial',
							hide: true,
							click: (row) => {
								this.openDialog(row, 'detail')
							},
							customRender: (action, row) => {
								action.hide = row.auditStatus !== 4
								return action
							},
						},
						// {
						// 	title: '删除',
						// 	auth: 'deleteMaterialUse',
						// 	click: (row) => {
						// 		let _this = this
						// 		_this.$confirm('确定删除？', '提示', {
						// 			type: 'warning',
						// 			async callback(action) {
						// 				if (action === 'confirm') {
						// 					_this.delete(row)
						// 				}
						// 			},
						// 		})
						// 	},
						// },
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
	},

	mounted() {},

	methods: {
		refresh() {
			this._queryListByPage()
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
				auditStatus:
					this.name === constant.WAIT
						? 2
						: this.name === constant.SUCCESS
						? 3
						: this.name === constant.REJECT
						? 4
						: 1,
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

		//查询素材列表数据
		_queryListByPage: async function (flag) {
			const paramJson = JSON.parse(JSON.stringify(this.findSearchParams(flag)))

			this.showLoading = true

			const {
				data: { resultCode, resultData },
			} = await pageSupplierGoodsMaterialListFors(paramJson)

			this.showLoading = false

			if (resultCode === 0) {
				this.tableData = resultData.records || []
				// 图片预览数据组装
				this.tableData = this.tableData.map((item) => {
					if (item.materialVO && item.materialVO.picMaterialContents) {
						item.materialVO.previewImgList =
							item.materialVO.picMaterialContents.map((vo) => {
								if (vo.materialContentType === 'image') {
									return vo.picOrVideoMaterialContent
								}
							})
					}
					return item
				})
				// 驳回理由图片组装
				this.tableData = this.tableData.map((item) => {
					if (item.auditRemark) {
						// 抽出img元素的src属性
						item.auditRemarkImgs =
							item.auditRemark
								.match(/<img.*?(?:>|\/>)/gi)
								?.map((img) => img.match(/src="?(.*?)(?:")/i)[1]) || []
					}
					return item
				})
				console.log('this.tableData>>', this.tableData)
				this.page.count = resultData.total
			} else {
				this.tableData = []
				this.page.count = 0
			}
		},

		//打开弹窗
		openDialog(row, type) {
			this.dialogVisible = true
			if (row) {
				//编辑
				this.dialogTitle =
					type === 'edit'
						? '素材编辑'
						: type === 'audit'
						? '素材审核'
						: '素材详情'
				this.dialogType = type
				this.currentEditMaterial = row
			} else {
				//新增
				this.dialogTitle = '新增'
				this.currentEditMaterial = {}
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

.media-list {
	display: flex;
	flex-wrap: wrap;
}
.media-list .media-item {
	flex: 0 0 100px;
	margin-right: 10px;
	margin-top: 10px;
	border-radius: 5px;
	box-shadow: #e6e6e6 0px 0px 7px 1px;
}

.media-list .media-item .media-target {
	object-fit: cover;
	width: 100%;
}
</style>

<style lang="scss">
.BusinessMaterialFormTable_box {
	position: relative;
}

.BusinessMaterialFormTable_auditRemark img {
	width: 100%;
	height: auto;
}

.BusinessMaterialFormTable_auditRemark_mask {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	opacity: 0;
}
.preS {
	white-space: pre-wrap;
	word-wrap: break-word;
}
</style>

<template>
	<div class="mainProdu">
		<yx-dialog
			:bottomBtn="bottomBtn"
			:visible.sync="localVisible"
			:before-close="resetForm"
			title="选择商品素材"
		>
			<yx-form
				ref="form"
				:inline="true"
				:data="dialogData"
				:items="dialogCfg"
				:formAction="dialogAction"
			></yx-form>
			<el-row style="text-align: right; margin-bottom: 10px"
				>已选择{{ selectGoodsList.length }}个素材</el-row
			>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tialogColumns"
					:pagination="tialogPage"
					:data="tialogData"
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
							<div style="text-align: left">
								<div class="goodsName">{{ scope.row.goodsName }}</div>
								<div>
									<el-tag :type="shelfStateMapTag[handleGoodsTag(scope.row)]">{{
										handleGoodsTag(scope.row)
									}}</el-tag>
									<span class="number">货号：{{ scope.row.goodsNumber }}</span>
								</div>
							</div>
						</div>
					</template>

					<template slot="goodsMaterial" slot-scope="scope">
						<div>
							<div style="text-align: left">
								<div class="goodsName">{{ scope.row.materialTest }}</div>
								<div>
									<div
										v-for="(ite, i) in scope.row
											.activityMaterialContentRelationBOList"
										:key="i"
										class="image-box"
									>
										<el-image
											v-if="ite.materialType == 'image'"
											class="c_image"
											fit="cover"
											:src="ite.materialContent"
											:preview-src-list="scope.row.previewImgList"
										>
											<div slot="error" class="el-image__error">
												<i class="el-icon-picture-outline"></i>
											</div>
										</el-image>
										<video
											v-else
											controls
											:src="ite.materialContent"
											class="c_image"
										></video>
									</div>
								</div>
							</div>
						</div>
					</template>
				</yx-table>
			</el-row>
		</yx-dialog>
	</div>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getSmallImg } from '@/utils/imageTool'
import { queryGoodsListToBatch } from '@/api/newMaterial'
export default {
	components: {
		YxDialog,
		YxForm,
		YxTable,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			define: false,
		},
		mainProductsRow: {
			type: Array,
			default: () => [],
		},
		//是否新增
		isAdd: {
			type: Boolean,
			define: false,
		},
	},
	data() {
		return {
			getSmallImg: getSmallImg,
			sourceId: '',
			isFirstQuery: true,
			shelfStateMapTag: {
				在售: 'warning',
				待售: 'info',
				下架: 'info',
				推荐: 'danger',
			},
			selectGoodsList: [],
			showLoading: false,
			currentTime: '',
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveProduct()
					},
				},
				{
					title: '取消',
					click: () => {
						this.resetForm()
					},
				},
			],
			dialogData: {
				keyWord: '',
			},
			dialogCfg: [
				{
					title: '',
					type: 'textarea',
					dataIndex: 'keyWord',
					autosize: { minRows: 2, maxRows: 4 },
					placeholder: '请输入商品名称/货号，请用逗号或者换行输入',
				},
			],
			dialogAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._queryGoodsListToBatch(true)
					},
				},
			],
			tialogColumns: [
				{
					type: 'custom',
					dataIndex: 'goodsDefaultImage',
					title: '商品信息',
					width: 350,
				},
				{
					type: 'custom',
					dataIndex: 'goodsMaterial',
					title: '素材',
				},
				{
					type: 'action',
					title: '操作',
					width: '80',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.editUserList(row)
							},
							customRender: (action, row) => {
								action.title = this.findIndex(row) ? '添加' : '移除'
								return action
							},
						},
					],
				},
			],
			tialogPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._queryGoodsListToBatch()
				},
			},
			tialogData: [],
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
	mounted() {},
	watch: {
		localVisible(val) {
			if (val) {
				this.selectGoodsList = JSON.parse(JSON.stringify(this.mainProductsRow))

				console.log('this.selectGoodsList>>', this.selectGoodsList)

				if (!this.isAdd && this.selectGoodsList[0].activityGoodsMaterialRefId) {
					this.sourceId = this.selectGoodsList[0].activityGoodsMaterialRefId
					this.isFirstQuery = true
					this._queryGoodsListToBatch(true)
				}

				this.dialogData.keyWord = ''
			}
		},
	},
	methods: {
		handleGoodsTag(row = {}) {
			let title =
				row.goodsShelfState == 2
					? row.goodsIsSale == 1
						? '在售'
						: '待售'
					: '下架'
			return title
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},
		saveProduct() {
			// if (this.selectGoodsList && this.selectGoodsList.length > 5) {
			// 	return this.$message.warning('主推商品不能超过5个')
			// }
			this.$emit('saveProduct', this.selectGoodsList)
			this.localVisible = false
		},
		findIndex(row) {
			// 判断是否已经添加用户
			let ids = this.selectGoodsList.map((item) => {
				return item.activityGoodsMaterialRefId
			})
			return ids.indexOf(row.activityGoodsMaterialRefId) == -1
		},
		editUserList(row) {
			// 添加/移除
			if (this.isAdd) {
				//添加素材时可多选
				let ids = this.selectGoodsList.map((item) => {
					return item.activityGoodsMaterialRefId
				})
				if (ids.indexOf(row.activityGoodsMaterialRefId) == -1) {
					this.selectGoodsList.push(row)
				} else {
					this.selectGoodsList.splice(
						ids.indexOf(row.activityGoodsMaterialRefId),
						1
					)
				}
			} else {
				// 编辑素材时单选
				this.selectGoodsList = [row]
			}
		},
		findUserParams(flag) {
			// 用户搜索条件
			const paramJson = {
				keyWord: this.dialogData.keyWord,
				pageNum: 1,
				pageSize: 10,
			}

			if (this.sourceId && this.isFirstQuery) {
				paramJson.sourceId = this.sourceId
				this.isFirstQuery = false
			}

			if (paramJson.keyWord.length > 0) {
				let keywordSplit
				keywordSplit = paramJson.keyWord.replaceAll('\n', ',')
				paramJson.keyWord = keywordSplit
			} else {
				paramJson.keyWord = ''
			}
			// 每页的加载数据长度
			paramJson.pageSize = this.tialogPage.length
			// 当前页的条数开始
			if (flag) {
				this.tialogPage.currentPage = 1
			}
			paramJson.pageNum = this.tialogPage.currentPage
			return paramJson
		},
		async _queryGoodsListToBatch(flag) {
			// 商品素材列表
			this.showLoading = true
			let paramJson = this.findUserParams(flag)
			let {
				data: { resultCode, resultData, total },
			} = await queryGoodsListToBatch(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tialogData = resultData?.map((item) => {
					item.previewImgList = []
					item.activityMaterialContentRelationBOList.forEach((materialItem) => {
						if (materialItem.materialType == 'image') {
							item.previewImgList.push(materialItem.materialContent)
						}
					})
					return item
				})
				this.tialogPage.count = total
			} else {
				this.tialogPage.count = 0
				this.tialogData = []
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.slot {
	display: flex;
	align-items: center;
	padding-left: 30px;
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
.number {
	margin-left: 6px;
}
.image-box {
	display: inline-block;
}
.c_image {
	width: 80px;
	height: 80px;
	margin-right: 10px;
	margin-top: 10px;
	border-radius: 5px;
	box-shadow: #e6e6e6 0px 0px 7px 1px;
}
</style>

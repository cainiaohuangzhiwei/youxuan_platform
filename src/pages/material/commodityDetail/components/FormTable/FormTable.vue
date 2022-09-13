<template>
	<div>
		<div class="circle-b" @click="handleAdd">
			<span>新增</span>
			<span>素材</span>
		</div>
		<div class="header-box">
			<div class="slot">
				<div>
					<img
						class="goods_img"
						:src="getSmallImg(gmaList.goodsDefaultImg)"
						alt=""
					/>
				</div>
				<div>
					<p class="solt-name">{{ gmaList.goodsName }}</p>
					<p class="slot-num">
						<el-tag :type="shelfStateMapTag[handleGoodsTag(gmaList)]">{{
							handleGoodsTag(gmaList)
						}}</el-tag>
						<span class="number">货号：{{ gmaList.goodsNumber }}</span>
					</p>
				</div>
			</div>
			<div class="header-r">
				<div class="hr-box">
					<span class="hr-bs">{{ gmaList.materialTotalNo }}</span>
					<span class="hr-bp">素材总数</span>
				</div>
				<div class="hr-box">
					<span class="hr-bs">{{ gmaList.inUseMaterialTotalNo }}</span>
					<span class="hr-bp">在用素材数</span>
				</div>
				<div class="hr-box">
					<span class="hr-bs">{{ gmaList.materialDownLoadTotalNo }}</span>
					<span class="hr-bp">总下载次数</span>
				</div>
			</div>
		</div>
		<el-divider></el-divider>
		<div v-loading="itemLoading">
			<div class="main" v-for="(item, index) in records" :key="index">
				<div class="main-h">
					<div class="source-s" v-if="item.materialSource == 0">
						<img
							class="titleImg"
							:src="
								getSmallImg('file/default/static/meterial/20211012-141757.png')
							"
							alt=""
						/>
						<span style="margin-right: 10px">官方素材</span>
					</div>
					<div class="source-s" v-if="item.materialSource == 1">
						<img
							class="titleImg"
							:src="getSmallImg(item.shopperHeadPortrait)"
							alt=""
						/>
						<span style="margin-right: 10px">{{ item.shopkeeperName }}</span>
					</div>
					<div
						class="source-s"
						v-if="item.materialSource == 2 || item.materialSource == 3"
					>
						<img
							class="titleImg"
							:src="getSmallImg(item.virtualShopkeeperPortraitUrl)"
							alt=""
						/>
						<span style="margin-right: 10px">{{
							item.virtualShopkeeperName
						}}</span>
					</div>
					<div class="source-s" v-if="item.materialSource == 4">
						<img
							class="titleImg"
							:src="
								getSmallImg('file/default/static/meterial/20211012-141757.png')
							"
							alt=""
						/>
						<span style="margin-right: 10px">商家素材</span>
					</div>
					<el-tag style="margin-right: 6px" v-if="item.status == 1"
						>启用</el-tag
					>
					<el-tag type="success" style="margin-right: 6px" v-else>禁用</el-tag>
					<el-tag v-if="item.effectivityType == 0">长期有效</el-tag>
					<el-tag
						type="danger"
						v-else-if="item.effectivityType == 1 && item.materialExpired == 1"
						>【过期】生效时间：{{
							moment(item.effectivityStartTime).format('YYYY-MM-DD HH:mm:ss')
						}}
						~
						{{
							moment(item.effectivityEndTime).format('YYYY-MM-DD HH:mm:ss')
						}}</el-tag
					>
					<el-tag
						v-else-if="item.effectivityType == 1 && item.materialExpired != 1"
						>生效时间：{{
							moment(item.effectivityStartTime).format('YYYY-MM-DD HH:mm:ss')
						}}
						~
						{{
							moment(item.effectivityEndTime).format('YYYY-MM-DD HH:mm:ss')
						}}</el-tag
					>
				</div>
				<pre class="preS" v-if="item.wordMaterialContent">{{
					item.wordMaterialContent
				}}</pre>
				<div
					class="ivbox"
					v-if="item.picMaterialContents && item.picMaterialContents.length"
				>
					<div v-for="(ite, i) in item.picMaterialContents" :key="i">
						<el-image
							v-if="ite.materialContentType == 'image'"
							class="c_image"
							fit="cover"
							:src="ite.picOrVideoMaterialContent"
							:preview-src-list="item.previewImgList"
						>
							<div slot="error" class="el-image__error">
								<i class="el-icon-picture-outline"></i>
							</div>
						</el-image>
						<video
							v-else
							controls
							:src="ite.picOrVideoMaterialContent"
							class="c_image"
						></video>
					</div>
				</div>
				<div class="foot-b">
					<el-button
						v-auth="'goodsMaterialUpdate'"
						type="text"
						style="font-size: 18px"
						@click="handleEdit(item)"
						>编辑</el-button
					>
					<el-button
						v-auth="'goodsMaterialDelete'"
						type="text"
						style="font-size: 18px"
						@click="handleDel(item)"
						>删除</el-button
					>
					<el-button
						v-auth="'goodsMaterialSynchrodata'"
						type="text"
						style="font-size: 18px"
						@click="handleSynchro(item)"
						>同步第三方</el-button
					>
				</div>
				<el-divider></el-divider>
			</div>
		</div>
		<div class="pagination-box">
			<el-pagination
				background
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="page.pageNum"
				:page-sizes="[5, 10, 20, 50]"
				:page-size="page.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="page.total"
			></el-pagination>
		</div>
		<add-material-dialog
			:visible.sync="addMaterialDialog"
			:addMaterialRow="addMaterialRow"
			:showB="showB"
			@addRefresh="addRefresh"
		></add-material-dialog>
		<new-material-dialog
			:visible.sync="newMaterialDialog"
			:newMaterialRow="newMaterialRow"
			@Refresh="Refresh"
		></new-material-dialog>
		<singe-material-dialog
			:visible.sync="singeMaterialDialog"
			:singeMaterialRow="singeMaterialRow"
			@singeRefresh="singeRefresh"
		></singe-material-dialog>
	</div>
</template>

<script>
import { getSmallImg } from '@/utils/imageTool'
import {
	goodsMaterialAll,
	goodsMaterialDelSingle,
	materialSynchrodata,
} from '@/api/newMaterial'
import moment from 'moment'
import NewMaterialDialog from '@/components/NewMaterialDialog'
import AddMaterialDialog from '@/components/AddMaterialDialog'
import SingeMaterialDialog from './SingeMaterialDialog'

export default {
	components: {
		AddMaterialDialog,
		NewMaterialDialog,
		SingeMaterialDialog,
	},
	name: 'FormTable',

	data() {
		return {
			authMap: {
				delete: '/goods/material/delete',
				update: '/goods/material/update',
			},
			showB: '',
			goodsId: this.$route.params.goodsId,
			itemLoading: false,
			moment,
			nowTime: new Date().getTime(),
			singeMaterialRow: {},
			singeMaterialDialog: false,
			addMaterialDialog: false,
			addMaterialRow: {},
			newMaterialRow: {},
			newMaterialDialog: false,
			gmaList: '',
			records: [],
			page: {
				pageSize: 10,
				pageNum: 1,
				total: 0,
			},
			getSmallImg,
			shelfStateMapTag: {
				在售: 'warning',
				待售: 'info',
				下架: 'info',
				推荐: 'danger',
			},
		}
	},
	created() {
		this._goodsMaterialAll()
	},
	methods: {
		handleSynchro(item) {
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
					this._materialSynchrodata(item)
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消同步第三方',
					})
				})
		},
		async _materialSynchrodata(item) {
			let params = {
				id: item.activityGoodsMaterialRefId,
			}
			let {
				data: { resultCode },
			} = await materialSynchrodata(params)
			if (resultCode == 0) {
				this.$message({
					type: 'success',
					message: '同步成功!',
				})
			}
		},
		singeRefresh() {
			this._goodsMaterialAll()
		},
		Refresh(val) {
			this.addMaterialDialog = true
			this.addMaterialRow = val
		},
		addRefresh(val) {
			this._goodsMaterialAll()
			if (val == 'next') {
				this.newMaterialDialog = true
			}
		},
		handleEdit(item) {
			this.singeMaterialRow = item
			this.singeMaterialDialog = true
		},
		handleDel(item) {
			this.$confirm('此操作将删除该素材, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this._goodsMaterialDelSingle(item)
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					})
				})
		},
		async _goodsMaterialDelSingle(item) {
			this.itemLoading = true
			let params = {
				activityGoodsMaterialRefId: item.activityGoodsMaterialRefId,
			}
			let {
				data: { resultCode },
			} = await goodsMaterialDelSingle(params)
			if (resultCode == 0) {
				this._goodsMaterialAll()
				this.$message({
					type: 'success',
					message: '删除成功!',
				})
			}
		},
		handleAdd() {
			this.addMaterialRow = {
				goodsId: this.goodsId,
				goodsDefaultImage: this.gmaList.goodsDefaultImg,
				goodsGroupId: this.gmaList.goodsGroupId || 14706,
				isSales: this.gmaList.goodsIsSale,
				shelfState: this.gmaList.goodsShelfState,
				goodsName: this.gmaList.goodsName,
				goodsNumber: this.gmaList.goodsNumber,
			}
			this.showB = 2
			this.addMaterialDialog = true
		},
		async _goodsMaterialAll(flag) {
			let params = this.findSearchParams(flag)
			this.itemLoading = true
			let {
				data: { resultCode, resultData },
			} = await goodsMaterialAll(params)
			this.itemLoading = false
			if (resultCode == 0) {
				this.gmaList = resultData
				if (resultData.materialDetailPageVO) {
					this.records = resultData.materialDetailPageVO.records || []
					this.page.total = resultData.materialDetailPageVO.total || 0
					if (this.records && this.records.length) {
						this.records.forEach((item) => {
							item.previewImgList = []
							if (item.picMaterialContents && item.picMaterialContents.length) {
								item.picMaterialContents.forEach((ite) => {
									if (ite.materialContentType == 'image') {
										item.previewImgList.push(ite.picOrVideoMaterialContent)
									}
								})
							}
						})
					}
				} else {
					this.records = []
				}
			}
		},
		findSearchParams(flag) {
			let paramJson = {
				pageSize: 10,
				pageNum: 1,
				goodsId: this.goodsId,
			}
			paramJson.pageSize = this.page.pageSize
			// 当前页的条数开始
			if (flag) {
				this.page.pageNum = 1
			}
			paramJson.pageNum = this.page.pageNum
			return paramJson
		},
		handleSizeChange(val) {
			this.page.pageSize = val
			this._goodsMaterialAll()
			console.log(`每页 ${val} 条`)
		},
		handleCurrentChange(val) {
			this.page.pageNum = val
			this._goodsMaterialAll()
			console.log(`当前页: ${val}`)
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
	},
}
</script>
<style lang="scss" scoped>
.header-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 60px 0 10px;
}
.header-r {
	width: 500px;
	min-width: 500px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.hr-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-left: 60px;
}
.hr-bs {
	font-size: 20px;
}
.hr-bp {
	font-size: 18px;
}
.slot {
	text-align: left;
	display: flex;
	align-items: center;

	.goods_img {
		width: 90px;
		height: 90px;
		margin-right: 6px;
		// line-height: 155px;
	}
	.slot-num {
		display: flex;
		align-items: center;
	}
	.solt-name {
		font-size: 16px;
		color: blue;
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
.box-card {
	width: 100%;
}
.main {
	// background-color: #e9eef3;
	color: #333;
	padding: 10px 0 0 10px;
}
.main-h {
	display: flex;
	align-items: center;
}
.titleImg {
	width: 50px;
	height: 50px;
	border-radius: 25px;
	border: 1px solid #ccc;
	margin-right: 6px;
}
.ivbox {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
}
.c_image {
	width: 160px;
	height: 160px;
	margin-right: 10px;
	margin-top: 10px;
	border-radius: 5px;
	box-shadow: #e6e6e6 0px 0px 7px 1px;
}
.foot-b {
	text-align: right;
	margin-right: 20px;
	margin-top: 10px;
}
.circle-b {
	height: 60px;
	width: 60px;
	// text-align: center;
	// line-height: 60px;
	background: rgb(51, 51, 51);
	border-radius: 60px;
	color: #fff;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	position: fixed;
	right: 50px;
	bottom: 120px;
	z-index: 999;
}
.pagination-box {
	text-align: right;
	margin-right: 50px;
}
.preS {
	white-space: pre-wrap;
	word-wrap: break-word;
	font-size: 16px;
}
.source-s {
	display: flex;
	align-items: center;
}
</style>

<template>
	<basic-container>
		<div>
			<el-form
				:inline="true"
				:model="formInline"
				class="demo-form-inline"
				@submit.native.prevent
			>
				<div class="formH">
					<div>
						共<span style="margin-left: 6px; margin-right: 6px; color: blue">{{
							this.totalNum
						}}</span
						>个品牌素材
					</div>
					<div>
						<el-form-item>
							<el-input
								v-model="formInline.keyword"
								size="medium"
								style="width: 400px"
								placeholder="请输入品牌id/名称进行搜索"
							></el-input>
						</el-form-item>
						<el-form-item>
							<el-button size="medium" type="primary" @click="handleFind"
								>查询</el-button
							>
							<el-button
								v-auth="'brandParentMaterialSave'"
								size="medium"
								type="primary"
								@click="handleAdd"
								>新增素材</el-button
							>
						</el-form-item>
					</div>
				</div>
			</el-form>
			<el-row>
				<div
					class="card"
					v-loading="tableLoading"
					v-if="voList && voList.length"
				>
					<el-card
						class="box-card"
						v-for="(item, index) in voList"
						:key="index"
					>
						<div class="posb">
							<div class="cardH">
								<img
									class="goods_img"
									:src="getSmallImg(item.brandImgUrl || item.brandLogoUrl)"
									alt=""
								/>
								<div>
									<div class="titleH">{{ item.brandParentName }}</div>
									<span>ID：{{ item.brandParentId }}</span>
								</div>
							</div>
							<pre class="preS">{{ item.text }}</pre>
							<div class="numP" v-if="item.materialDetailList.length > 3">
								+{{ item.materialDetailList.length - 3 }}
							</div>
							<div class="ivbox">
								<div
									v-for="(ite, idx) in item.materialDetailList"
									:key="idx"
									class="imr"
								>
									<video
										:src="ite.materialContent"
										class="c_image"
										controls
										v-if="idx < 3 && ite.materialType == 'video'"
									></video>
									<el-image
										v-if="idx < 3 && ite.materialType == 'image'"
										class="c_image"
										fit="cover"
										:src="ite.materialContent"
										:preview-src-list="item.previewImgList"
									>
										<div slot="error" class="el-image__error">
											<i class="el-icon-picture-outline"></i>
										</div>
									</el-image>
								</div>
							</div>
							<div class="foot-b">
								<el-tag size="medium" v-if="item.status == 1">启用</el-tag>
								<el-tag size="medium" type="success" v-if="item.status == 0"
									>禁用</el-tag
								>
								<div>
									<el-button
										v-auth="'brandParentMaterialSave'"
										type="text"
										size="medium"
										@click="handleEdit(item)"
										>编辑</el-button
									>
									<el-button
										v-auth="'brandParentMaterialDelete'"
										type="text"
										size="medium"
										@click="handleDel(item)"
										>删除</el-button
									>
								</div>
							</div>
						</div>
					</el-card>
				</div>
				<div class="noCard" v-else>暂无数据</div>
			</el-row>
			<div class="pagination-box">
				<el-pagination
					background
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="page.pageNum"
					:page-sizes="[6, 12, 24, 50]"
					:page-size="page.pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="page.total"
				></el-pagination>
			</div>
		</div>
		<select-brand-dialog
			:visible.sync="selectBrandDialog"
			:selectBrandRow="selectBrandRow"
			@refresh="refresh"
		></select-brand-dialog>
		<brand-material-dialog
			:visible.sync="brandMaterialDialog"
			:brandMaterialRow="brandMaterialRow"
			@editRefresh="editRefresh"
		></brand-material-dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import { getSmallImg } from '@/utils/imageTool'
import selectBrandDialog from './selectBrandDialog'
import brandMaterialDialog from './brandMaterialDialog'
import {
	brandParentMaterialList,
	brandParentMaterialDelete,
} from '@/api/newMaterial'

export default {
	components: {
		BasicContainer,
		selectBrandDialog,
		brandMaterialDialog,
	},
	name: 'FormTable',

	data() {
		return {
			totalNum: 0,
			authMap: {
				save: '/brandParent/material/save',
				delete: '/brandParent/material/delete',
			},
			brandMaterialRow: {},
			brandMaterialDialog: false,
			selectBrandRow: {},
			selectBrandDialog: false,
			getSmallImg,
			tableLoading: false,
			voList: [],
			page: {
				pageSize: 6,
				pageNum: 1,
				total: 0,
			},
			formInline: {
				keyword: '',
			},
		}
	},
	created() {
		this._brandParentMaterialList()
	},
	methods: {
		handleSizeChange(val) {
			this.page.pageSize = val
			this._brandParentMaterialList()
		},
		handleCurrentChange(val) {
			this.page.pageNum = val
			this._brandParentMaterialList()
		},
		handleDetails() {
			this.$router.push({
				path: `material/commodityDetail/${123}`,
			})
		},
		handleFind() {
			this._brandParentMaterialList(true)
		},
		handleAdd() {
			this.selectBrandDialog = true
		},
		handleDel(item) {
			this.$confirm('此操作将永久删除该品牌素材, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.deleteM(item)
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					})
				})
		},
		handleEdit(item) {
			this.brandMaterialDialog = true
			this.brandMaterialRow = {
				brandParentId: item.brandParentId,
			}
		},
		async deleteM(item) {
			let params = {
				brandParentId: item.brandParentId,
			}
			let {
				data: { resultCode },
			} = await brandParentMaterialDelete(params)
			if (resultCode == 0) {
				this.$message.success('删除成功')
				this._brandParentMaterialList()
			}
		},
		refresh(val) {
			this.brandMaterialDialog = true
			this.brandMaterialRow = {
				brandParentId: val.brandParentId,
			}
		},
		editRefresh() {
			this._brandParentMaterialList()
		},
		async _brandParentMaterialList(flag) {
			let paramJson = this.findSearchParams(flag)
			this.tableLoading = true
			let res = await brandParentMaterialList(paramJson)
			this.tableLoading = false
			res = res.data
			if (res.resultCode === 0) {
				this.voList = res.resultData.voList
				this.page.total = res.resultData.total
				this.totalNum = res.resultData.totalNum || 0
				this.voList.forEach((item) => {
					if (item.materialDetailList && item.materialDetailList.length) {
						let previewImgList = []
						item.materialDetailList.forEach((ite) => {
							if (ite.materialType == 'image') {
								previewImgList.push(ite.materialContent)
								item.previewImgList = previewImgList
							}
						})
					}
				})
			}
		},
		findSearchParams(flag) {
			let paramJson = {
				keyword: this.formInline.keyword,
			}
			paramJson.pageSize = this.page.pageSize
			// 当前页的条数开始
			if (flag) {
				this.page.pageNum = 1
			}
			paramJson.pageNum = this.page.pageNum
			return paramJson
		},
	},
}
</script>
<style lang="scss" scoped>
.formH {
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 18px;
}
.card {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
}
.box-card {
	width: 480px;
	margin-right: 10px;
	margin-top: 10px;
}
.cardH {
	display: flex;
	align-items: center;
	font-size: 16px;
	padding-right: 15px;
}
.goods_img {
	width: 60px;
	height: 60px;
	margin-right: 10px;
}
.ivbox {
	position: relative;
	display: flex;
	align-items: center;
	margin-bottom: 10px;
	flex-wrap: wrap;
	min-height: 148px;
}
.posb {
	position: relative;
}
.numP {
	position: absolute;
	font-size: 30px;
	color: #fff;
	right: 50px;
	top: 228px;
	z-index: 999;
}
.c_image {
	width: 135px;
	height: 135px;
	margin-top: 10px;
	border-radius: 5px;
	box-shadow: #e6e6e6 0px 0px 7px 1px;
}
.imr {
	margin-right: 16px;
}
.imr:nth-child(3) {
	margin-right: 0 !important;
}
.foot-b {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.pagination-box {
	text-align: right;
	margin-right: 50px;
	margin-top: 30px;
}
.preS {
	height: 90px;
	line-height: 18px;
	white-space: pre-wrap;
	word-wrap: break-word;
	color: #666;
	// text-overflow: -o-ellipsis-lastline;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 5;
	line-clamp: 5;
	-webkit-box-orient: vertical;
}
.titleH {
	width: 360px;
	max-width: 360px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	word-break: break-all;
}
.noCard {
	text-align: center;
	height: 200px;
	line-height: 200px;
	color: #666;
	font-size: 16px;
}
</style>

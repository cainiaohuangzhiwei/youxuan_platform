<template>
	<div>
		<div v-if="total <= 0">
			<div class="ht">
				<div class="htt">
					<span>{{ activeRow.activityName }}</span>
					<i
						v-auth="'materialContentEdit'"
						class="el-icon-edit-outline"
						@click="handleActiveEdit()"
					></i>
				</div>
				<pre class="httpre">{{ activeRow.activityDescription }}</pre>
			</div>
			<div class="noadd">
				<i class="el-icon-document-delete icon-delete"></i>
				<span class="noM">暂无活动素材</span>
				<el-button
					v-auth="'materialInfoAdd'"
					type="text"
					icon="el-icon-plus"
					@click="handleAdd"
				>
					新增场次素材
				</el-button>
			</div>
		</div>
		<basic-container v-if="total > 0">
			<div class="activeDetail">
				<!-- <basic-container> -->
				<div style="display: flex">
					<!-- <el-container style="height: 1vp; border: 1px solid #eee"> -->
					<el-menu
						:default-active="activeIndex"
						class="el-menu-demo"
						mode="vertical"
						@select="handleSelect"
					>
						<div class="li-box">
							<div class="li-item">
								<span class="nameBox" style="font-size: 16px; font-weight: 800">
									{{ activeRow.activityName }}
								</span>

								<i
									v-auth="'materialContentEdit'"
									class="el-icon-edit-outline"
									@click="handleActiveEdit()"
								></i>
							</div>
							<pre class="preB">{{ activeRow.activityDescription }}</pre>
						</div>
						<div class="li-add">
							<span>活动场次</span>
							<el-button
								v-auth="'materialInfoAdd'"
								type="text"
								icon="el-icon-plus"
								@click="handleAdd"
							>
								新增场次素材
							</el-button>
						</div>
						<el-menu-item
							class="menu-item"
							v-for="(item, index) in list"
							:key="index"
							:index="item.id"
						>
							{{ item.activityMaterialName }}
						</el-menu-item>
					</el-menu>

					<div class="rowbox">
						<div class="header-box">
							<div class="box-one">
								<div class="brand-g">
									<div class="spanT">主推品牌：</div>
									<div
										class="spanL"
										v-if="
											activeObj.brandParentList &&
											activeObj.brandParentList.length
										"
									>
										<span
											v-for="(ite, i) in activeObj.brandParentList"
											:key="i"
										>
											{{ ite.brandParentName ? sub(ite.brandParentName) : ''
											}}{{
												activeObj.brandParentList.length - 1 != i ? '、' : ''
											}}
										</span>
									</div>
									<div v-else class="spanL">无</div>
								</div>
							</div>
							<div class="box-one bt">
								<div class="brand-g">
									<div class="spanT">主推档期：</div>
									<div class="spanL" v-if="activeObj.goodsGroupName">
										<span>
											{{
												activeObj.goodsGroupName
													? sub(activeObj.goodsGroupName)
													: ''
											}}
										</span>
									</div>
									<div v-else class="spanL">无</div>
								</div>
							</div>
							<div class="box-one bt">
								<div class="brand-g">
									<div class="spanT">主推商品：</div>
									<div
										class="spanL"
										v-if="activeObj.goodsList && activeObj.goodsList.length"
									>
										<span v-for="(ite, i) in activeObj.goodsList" :key="i">
											{{ ite.goodsName ? sub(ite.goodsName) : ''
											}}{{ activeObj.goodsList.length - 1 != i ? '、' : '' }}
										</span>
									</div>
									<div v-else class="spanL">无</div>
								</div>
							</div>
							<div class="box-two">
								<div class="btd">图片：{{ activeObj.imageCount }}</div>
								<div class="btd">文本：{{ activeObj.textCount }}</div>
								<div class="btd">视频：{{ activeObj.videoCount }}</div>
							</div>
							<div class="box-two">
								<div class="btd" v-if="activeObj.status == 0">
									状态：
									<span style="color: red">禁用</span>
								</div>
								<div
									class="btd"
									v-else-if="
										activeObj.status == 1 &&
										activeObj.effectivityStartTime > nowTime
									"
								>
									状态：未开始
								</div>
								<div
									class="btd"
									v-else-if="
										activeObj.status == 1 &&
										activeObj.effectivityEndTime < nowTime
									"
								>
									状态：过期
								</div>
								<div
									class="btd"
									v-else-if="
										activeObj.status == 1 &&
										activeObj.effectivityEndTime > nowTime &&
										activeObj.effectivityStartTime < nowTime
									"
								>
									状态：在线
								</div>
								<div class="btd">
									有效期：{{
										moment(activeObj.effectivityStartTime).format(
											'YYYY-MM-DD HH:mm:ss'
										)
									}}
									~
									{{
										moment(activeObj.effectivityEndTime).format(
											'YYYY-MM-DD HH:mm:ss'
										)
									}}
								</div>
							</div>
						</div>
						<el-divider></el-divider>
						<div class="rowDetails" v-if="activeObj.materialContentList">
							<div
								v-for="(item, index) in activeObj.materialContentList"
								:key="index"
								:class="getItemClass(index)"
							>
								<pre v-if="item.materialType == 'text'" class="preS">{{
									item.materialContent
								}}</pre>
								<div v-if="item.materialType == 'video'">
									<video
										controls
										class="c_image"
										:src="item.materialContent"
									></video>
								</div>
								<div v-if="item.materialType == 'image'">
									<el-image
										class="c_image"
										fit="cover"
										v-if="item.materialType == 'image'"
										:src="item.materialContent"
									>
										<div slot="error" class="el-image__error">
											<i class="el-icon-picture-outline"></i>
										</div>
									</el-image>
								</div>
							</div>
						</div>
						<div class="foot-b">
							<el-button
								v-auth="'materialInfoEdit'"
								size="medium"
								type="primary"
								@click="handleEdit"
								style="margin-right: 20px"
							>
								编辑
							</el-button>

							<el-button
								v-auth="'materialInfoDelete'"
								size="medium"
								type="danger"
								@click="handleDel"
							>
								删除
							</el-button>
						</div>
					</div>

					<!-- </el-container> -->
				</div>
			</div>
		</basic-container>

		<add-activity-dialog
			:visible.sync="addActivityDialog"
			:addActivityRow="addActivityRow"
			@refresh="refresh"
		></add-activity-dialog>
	</div>
</template>

<script>
import { getSmallImg } from '@/utils/imageTool'
import BasicContainer from '@wg-vue-materials/basic-container'
import addActivityDialog from './addActivityDialog'
import moment from 'moment'
import {
	activityContentList,
	activityInfoDetail,
	activityContentDetail,
	activityContentDelete,
} from '@/api/newMaterial'
export default {
	components: {
		BasicContainer,
		addActivityDialog,
	},

	data() {
		return {
			authMap: {
				add: '/material/info/add',
				edit: '/material/info/edit',
				delete: '/material/info/delete',
				cedit: '/material/content/edit',
			},
			id: this.$route.params.id,
			activeRow: {},
			addActivityRow: {},
			addActivityDialog: false,
			total: null,
			list: [],
			activeIndex: null,
			activeObj: {},
			nowTime: new Date().getTime(),
			moment,
			imgList: [],
			getSmallImg,
		}
	},
	created() {
		this._activityContentList()
		this._activityInfoDetail()
	},
	methods: {
		sub(val) {
			return val && val.length > 8 ? val.substring(0, 8) + '...' : val
		},
		refresh() {
			this._activityInfoDetail()
		},
		handleActiveEdit() {
			this.addActivityRow = this.activeRow
			this.addActivityDialog = true
		},
		async _activityInfoDetail() {
			let params = {
				id: this.id,
			}
			let {
				data: { resultCode, resultData },
			} = await activityInfoDetail(params)
			if (resultCode == 0) {
				this.activeRow = resultData
			}
		},
		getItemClass(index) {
			let className = ''

			const addStyleItem = ['video', 'image']

			if (this.activeObj.materialContentList[index].materialType === 'text') {
				return className
			}

			if (
				addStyleItem.includes(
					this.activeObj?.materialContentList?.[index]?.materialType
				)
			) {
				className += 'media'
			}

			if (
				addStyleItem.includes(
					this.activeObj?.materialContentList?.[index + 1]?.materialType
				) ||
				(index > 1 &&
					addStyleItem.includes(
						this.activeObj?.materialContentList?.[index - 1]?.materialType
					))
			) {
				className += ' min-media-flex'
			}

			return className
		},
		async _activityContentList() {
			let params = {
				id: this.id,
				pageNum: 1,
				pageSize: 100,
			}
			let {
				data: { resultCode, resultData },
			} = await activityContentList(params)
			if (resultCode == 0) {
				this.list = resultData.list || []
				this.total = resultData.total || 0
				if (this.list.length) {
					this.activeIndex = this.list[0].id
					this._activityContentDetail()
				}
			}
		},
		async _activityContentDetail() {
			let params = {
				id: this.activeIndex,
			}
			let {
				data: { resultCode, resultData },
			} = await activityContentDetail(params)
			if (resultCode == 0) {
				this.activeObj = resultData
			}
		},
		handleAdd() {
			this.$router.push({
				name: 'activeAdd',
				params: { activityMaterialInfoId: this.id },
			})
		},
		handleSelect(val) {
			console.log(val, 'valvlavlalvav')
			this.activeIndex = val
			this._activityContentDetail()
		},
		handleEdit() {
			this.$router.push({
				name: 'activeAdd',
				params: { activityMaterialInfoId: this.id, id: this.activeIndex },
			})
		},
		async handleDel() {
			this.$confirm('此操作将删除该场次, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this._activityContentDelete()
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					})
				})
		},
		async _activityContentDelete() {
			let params = {
				id: this.activeIndex,
			}
			let {
				data: { resultCode },
			} = await activityContentDelete(params)
			if (resultCode == 0) {
				this.$message({
					type: 'success',
					message: '删除成功!',
				})
				this._activityContentList()
			}
		},
	},
}
</script>

<style>
.activeDetail {
	width: 100%;
}
</style>

<style lang="scss" scoped>
.li-item {
	display: flex;
	align-items: center;
}
.nameBox {
	width: 250px;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
}
.menu-item {
	white-space: nowrop;
	overflow: hidden;
	text-overflow: ellipsis;
}
.el-menu-demo {
	width: 300px;
	min-width: 300px;
}
.li-add {
	display: flex;
	align-items: center;
	min-width: 200px;
	justify-content: space-between;
	padding: 10px 15px;
	border-bottom: 1px solid #ccc;
}
.li-box {
	padding: 15px 0 0 15px;
	border-top: 1px solid #ccc;
	border-bottom: 1px solid #ccc;
	background: #ccc;
}
.preB {
	white-space: pre-wrap;
	word-wrap: break-word;
	color: #666;
	max-width: 500px;
	// margin-bottom: 10px;
	// margin-top: 10px;
	font-size: 14px;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	line-clamp: 3;
	-webkit-box-orient: vertical;
}
.preS {
	white-space: pre-wrap;
	word-wrap: break-word;
	color: #666;
	min-width: 300px;
	margin-bottom: 20px;
	// margin-top: 20px;
}
.rowbox {
	width: 100%;
	padding: 0 25px;
}
.header-box {
	display: flex;
	flex-direction: column;
	// background-color: #b3c0d1;
	padding: 15px 15px 0 0px;
	box-sizing: border-box;
	color: rgb(125, 125, 125);
	font-size: 14px;
}
.box-one {
	display: flex;
	align-items: center;
}
.bt {
	margin-top: 10px;
}
.brand-g {
	display: flex;
	align-items: center;
	// margin-right: 60px;
}
.spanT {
	width: 70px;
	min-width: 70px;
}
.spanL {
	// display: flex;
	// flex-wrap: wrap;
	// width: 250px;
	color: blue;
}
.box-two {
	display: flex;
	align-items: center;
	margin-top: 10px;
}
.btd {
	margin-right: 30px;
}
.rowDetails {
	padding-left: 50px;
}
.media {
	width: 400px;
	max-width: 500px;
	margin-bottom: 20px;
	border-radius: 5px;
	box-shadow: #e6e6e6 0px 0px 7px 1px;
	overflow: hidden;
}

.media img,
.media video {
	width: 100%;
}

.min-media-flex {
	width: 180px;
	display: inline-block;
	margin-right: 10px;
	vertical-align: top;
}

.foot-b {
	text-align: center;
	margin-top: 30px;
}
.ht {
	text-align: center;
	background: rgb(170, 170, 170);
	padding: 15px 0 10px 0;
	color: #fff;
}
.htt {
	font-size: 18px;
}
.httpre {
	white-space: pre-wrap;
	word-wrap: break-word;
	font-size: 16px;
}
.noadd {
	width: 100%;
	// background: #f00;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	margin-top: 150px;
}
.icon-delete {
	font-size: 70px;
}
.noM {
	margin-top: 8px;
	margin-bottom: 8px;
	color: rgb(152, 152, 152);
}
</style>

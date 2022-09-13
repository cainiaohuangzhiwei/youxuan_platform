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
							activeObj.activityMaterialInfoCount
								? activeObj.activityMaterialInfoCount
								: 0
						}}</span
						>个活动，共<span
							style="margin-left: 6px; margin-right: 6px; color: blue"
							>{{
								activeObj.activityMaterialContentCount
									? activeObj.activityMaterialContentCount
									: 0
							}}</span
						>个素材，在用<span
							style="margin-left: 6px; margin-right: 6px; color: blue"
							>{{
								activeObj.activityMaterialContentInUseCount
									? activeObj.activityMaterialContentInUseCount
									: 0
							}}</span
						>个素材
					</div>
					<div>
						<el-form-item>
							<el-input
								v-model="formInline.keyword"
								size="medium"
								style="width: 400px"
								placeholder="请输入活动名称进行搜索"
							></el-input>
						</el-form-item>
						<el-form-item>
							<el-button size="medium" type="primary" @click="handleQuery"
								>查询</el-button
							>
							<el-button
								v-auth="'materialContentAdd'"
								size="medium"
								type="primary"
								@click="handleAdd"
								>新增活动</el-button
							>
						</el-form-item>
					</div>
				</div>
			</el-form>
			<el-row>
				<div
					class="card"
					v-loading="cardLoading"
					v-if="cardData && cardData.length"
				>
					<el-card
						class="box-card"
						v-for="(item, index) in cardData"
						:key="index"
					>
						<div>
							<div class="cardH">
								<span class="cardL">{{ item.activityName }}</span>
								<i
									v-auth="'materialContentEdit'"
									class="el-icon-edit-outline"
									@click="handleEdit(item)"
								></i>
							</div>
							<pre class="preS">{{ item.activityDescription }}</pre>
							<div class="on-line" v-if="item.activityMaterialContent">
								<span>当前在线:</span>
								<span class="titleH">{{
									item.activityMaterialContent.activityMaterialName
								}}</span>
								<div class="line-data">
									<div class="line-mr">
										<span>图片</span>
										<span class="numy">{{
											item.activityMaterialContent.imageCount
										}}</span>
									</div>
									<div class="line-mr">
										<span>文本</span>
										<span class="numy">{{
											item.activityMaterialContent.textCount
										}}</span>
									</div>
									<div class="line-mr">
										<span>视频</span>
										<span class="numy">{{
											item.activityMaterialContent.videoCount
										}}</span>
									</div>
								</div>
							</div>
							<div v-else class="no-line">当前在线：无</div>
							<div class="on-line">
								<span class="nH"
									>共<span class="numFw">{{
										item.activityMaterialContentCount
									}}</span
									>个活动素材</span
								>
								<div class="line-data">
									<div class="line-mr">
										<span>图片</span>
										<span class="numy">{{ item.imageCount }}</span>
									</div>
									<div class="line-mr">
										<span>文本</span>
										<span class="numy">{{ item.textCount }}</span>
									</div>
									<div class="line-mr">
										<span>视频</span>
										<span class="numy">{{ item.videoCount }}</span>
									</div>
								</div>
							</div>
							<div class="foot-b">
								<el-button
									type="text"
									size="medium"
									v-clipboard:copy="
										'/subpages/appSubPage/material/activeMaterial?id=' + item.id
									"
									v-clipboard:success="copyCode"
									>复制链接</el-button
								>
								<el-button
									v-auth="'materialContentDetail'"
									type="text"
									size="medium"
									@click="handleDetail(item)"
									>素材管理</el-button
								>
								<el-button
									v-auth="'materialContentDelete'"
									type="text"
									size="medium"
									style="color: red"
									@click="handleDel(item)"
									>删除</el-button
								>
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
					:page-sizes="[8, 24, 40, 56]"
					:page-size="page.pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="page.total"
				></el-pagination>
			</div>
		</div>
		<add-activity-dialog
			:visible.sync="addActivityDialog"
			:addActivityRow="addActivityRow"
			@refresh="refresh"
		></add-activity-dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import { getSmallImg } from '@/utils/imageTool'
import addActivityDialog from './addActivityDialog'
import {
	activityInfoList,
	activityInfoDelete,
	activityInfoStatistics,
} from '@/api/newMaterial'

export default {
	components: {
		BasicContainer,
		addActivityDialog,
	},
	name: 'FormTable',

	data() {
		return {
			authMap: {
				add: '/material/content/add',
				detail: '/material/content/detail',
				delete: '/material/content/delete',
				edit: '/material/content/edit',
			},
			cardLoading: false,
			activeObj: {},
			addActivityRow: {},
			addActivityDialog: false,
			getSmallImg,
			page: {
				pageSize: 8,
				pageNum: 1,
				total: 0,
			},
			formInline: {
				keyword: '',
			},
			cardData: [],
		}
	},
	created() {
		this._activityInfoList()
		this._activityInfoStatistics()
	},
	methods: {
		//复制小提示
		copyCode() {
			this.$message.success('复制成功')
		},
		handleDetail(item) {
			this.$router.push({ name: 'activeDetail', params: { id: item.id } })
		},
		handleEdit(item) {
			this.addActivityRow = item
			this.addActivityDialog = true
		},
		handleQuery() {
			this._activityInfoList(true)
		},
		handleDel(item) {
			this.$confirm('此操作将永久删除该活动素材, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.delActive(item)
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					})
				})
		},
		async delActive(item) {
			let params = {
				id: item.id,
			}
			let {
				data: { resultCode },
			} = await activityInfoDelete(params)
			if (resultCode == 0) {
				this.$message.success('删除成功')
				this._activityInfoList()
			}
		},
		async _activityInfoStatistics() {
			let {
				data: { resultCode, resultData },
			} = await activityInfoStatistics()
			if (resultCode == 0) {
				this.activeObj = resultData
			}
		},
		async _activityInfoList(flag) {
			this.cardLoading = true
			let params = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await activityInfoList(params)
			this.cardLoading = false
			if (resultCode == 0) {
				this.cardData = resultData.list || []
				this.page.total = resultData.total
			}
		},
		refresh() {
			this._activityInfoList()
			this._activityInfoStatistics()
		},
		handleSizeChange(val) {
			this.page.pageSize = val
			this._activityInfoList()
		},
		handleCurrentChange(val) {
			this.page.pageNum = val
			this._activityInfoList()
		},
		handleAdd() {
			this.addActivityRow = {}
			this.addActivityDialog = true
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
.preS {
	height: 36px;
	line-height: 18px;
	white-space: pre-wrap;
	word-wrap: break-word;
	color: #666;
	// text-overflow: -o-ellipsis-lastline;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
	// margin-top: 10px;
	// margin-bottom: 10px;
}
.box-card {
	width: 365px;
	// height: 314px;
	margin-right: 10px;
	margin-top: 10px;
}
.cardH {
	display: flex;
	align-items: center;
	font-size: 16px;
}
.cardL {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	line-clamp: 1;
	-webkit-box-orient: vertical;
}
.on-line {
	width: 100%;
	padding: 10px;
	background: rgb(242, 242, 242);
	display: flex;
	flex-direction: column;
	margin-bottom: 10px;
}
.no-line {
	width: 100%;
	height: 85px;
	padding: 10px;
	background: rgb(242, 242, 242);
	display: flex;
	flex-direction: column;
	margin-bottom: 10px;
}
.titleH {
	font-weight: 800;
	margin-top: 4px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	word-break: break-all;
}
.nH {
	margin-top: 4px;
}
.numFw {
	font-weight: 800;
	margin-left: 4px;
	margin-right: 4px;
}
.line-data {
	display: flex;
	align-items: center;
	margin-top: 4px;
}
.line-mr {
	margin-right: 18px;
	color: rgb(221, 221, 221);
}
.numy {
	color: rgb(141, 141, 141);
	margin-left: 4px;
}
.foot-b {
	text-align: right;
}
.pagination-box {
	text-align: right;
	margin-right: 50px;
	margin-top: 30px;
}
.noCard {
	text-align: center;
	height: 200px;
	line-height: 200px;
	color: #666;
	font-size: 16px;
}
</style>

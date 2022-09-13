<template>
	<div class="xcxMaterialList">
		<basicContainer style="padding: 0 20px">
			<sticky :sticky-top="84" :z-index="3">
				<div class="header-fixed">
					<el-form :inline="true" :model="formInline" class="demo-form-inline">
						<el-form-item label="采集日期">
							<el-date-picker
								v-model="formInline.time"
								type="date"
								placeholder="选择日期"
								:picker-options="pickerOptions"
							>
							</el-date-picker>
						</el-form-item>
						<el-form-item label="群聊">
							<el-select
								v-model="formInline.groupChatName"
								placeholder="请选择"
							>
								<el-option
									v-for="(item, index) in chatList"
									:key="index"
									:label="item"
									:value="item"
								>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否入库">
							<el-select
								v-model="formInline.isSave"
								placeholder="请选择是否入库"
							>
								<el-option label="全部" :value="0"></el-option>
								<el-option label="是" :value="1"></el-option>
								<el-option label="否" :value="2"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button
								type="primary"
								@click="handleFind"
								v-auth="'robotMaterialList'"
								>查询</el-button
							>
						</el-form-item>
						<el-form-item>
							<el-button
								type="primary"
								@click="handleSpecial"
								v-auth="'robotMaterialWarehouse'"
								>入库</el-button
							>
						</el-form-item>
					</el-form>
					<div class="time-sy" style="display: none">
						<i class="el-icon-date icondate"></i>
						<span>{{ version }}</span>
					</div>
				</div>
			</sticky>

			<el-row>
				<div v-if="robotsList && robotsList.length">
					<!-- <template> -->
					<el-checkbox-group
						v-model="checkList"
						v-infinite-scroll="load"
						infinite-scroll-disabled="disabled"
						infinite-scroll-immediate="false"
					>
						<el-checkbox
							v-for="(item, index) in robotsList"
							:key="index"
							:label="item"
							style="display: block; padding-top: 10px; margin-bottom: 20px"
							><div class="context-sy">
								<el-button type="primary" round class="br" v-if="item.isSave"
									>已入库</el-button
								>
								<el-button type="info" round class="br" v-else
									>待入库</el-button
								>
								<div>
									<pre class="preS" v-if="item.msgType == 2001">{{
										item.content
									}}</pre>
									<el-image
										v-else-if="item.msgType == 2002"
										class="c_image"
										fit="cover"
										:src="item.content"
										@click.prevent="handleRule"
										:preview-src-list="[item.content]"
									>
										<div slot="error" class="el-image__error">
											<i class="el-icon-picture-outline"></i>
										</div>
									</el-image>
									<video
										v-else-if="item.msgType == 2004"
										:src="item.content"
										class="c_image"
										controls
									></video>
									<div class="slot" v-else-if="item.msgType == 2013">
										<div>
											<img
												@click.prevent="handleRule"
												class="goods_img"
												:src="
													getSmallImg(
														item.appletCardInfoVO.goodsDefaultImage || ''
													)
												"
												alt=""
											/>
										</div>
										<div class="goods-info">
											<div class="break-sy">
												{{ item.appletCardInfoVO.goodsName || '' }}
											</div>
											<div>
												<span class="number"
													>货号：{{
														item.appletCardInfoVO.goodsNumber || ''
													}}</span
												>
											</div>
										</div>
									</div>
								</div>
							</div></el-checkbox
						>
					</el-checkbox-group>
					<p v-if="loading" style="margin-top: 10px" class="loading">
						<span></span>
					</p>
				</div>
				<div v-else class="no-message">暂无数据</div>
				<!-- </template> -->
			</el-row>
		</basicContainer>
		<put-warehousing-dialog
			:visible.sync="putWarehousingDialog"
			:putWarehousingRow="putWarehousingRow"
			@retain="retain"
		></put-warehousing-dialog>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import PutWarehousingDialog from '@/components/PutWarehousingDialog'
import { getSmallImg } from '@/utils/imageTool'
// import { uploadImageList } from '@/api/image'
import { robotMaterialNameList, robotMaterialList } from '@/api/newMaterial'
import moment from 'moment'
import Sticky from '@/components/Sticky'
export default {
	name: 'robotMaterial',
	components: {
		BasicContainer,
		PutWarehousingDialog,
		Sticky,
	},
	props: [],
	data() {
		return {
			noMore: false,
			robotsList: [],
			count: 1,
			totalPages: '',
			version: '',
			textarea: 'afadfasdfasdfasdfasdfsdfdsf\n123123123123123213',
			chatList: [],
			putWarehousingDialog: false,
			putWarehousingRow: {},
			moment,
			getSmallImg: getSmallImg,
			numbers: [{ name: 1, value: 2 }, 2, 3, 4, 5, 6, 7, 8, 9],
			checkList: [],
			pickerOptions: {
				disabledDate(time) {
					let curDate = new Date().getTime()
					let three = 15 * 24 * 3600 * 1000
					let threeMonths = curDate - three
					return time.getTime() > Date.now() || time.getTime() < threeMonths
				},
			},
			formInline: {
				time: moment().format(),
				groupChatName: '',
				isSave: 0,
			},
			loading: false,
		}
	},
	computed: {
		// noMore() {
		// 	//当起始页数大于总页数时停止加载
		// 	return this.count >= this.totalPages
		// },
		disabled() {
			return this.loading || this.noMore
		},
	},
	created() {
		this._robotMaterialNameList()
	},

	methods: {
		retain(val) {
			this.robotsList.forEach((item) => {
				val.forEach((ite) => {
					if (item.msgId == ite) {
						item.isSave = true
					}
				})
			})
			this.checkList = []
		},
		handleFind() {
			if (!this.formInline.time) return this.$message.warning('请选择采集日期')
			this.count = 1
			this.robotsList = []
			this.checkList = []
			this._robotMaterialList()
		},
		async _robotMaterialNameList() {
			let {
				data: { resultCode, resultData },
			} = await robotMaterialNameList()
			if (resultCode == 0) {
				this.chatList = resultData
				this.formInline.groupChatName = this.chatList[0]
				this._robotMaterialList()
			}
		},
		// findSearchParams(flag) {
		// 	// 当前页的条数开始
		// 	if (flag) {
		// 		this.tablePage.currentPage = 1
		// 	}
		// 	const paramJson = Object.assign(this.formData, {
		// 		length: this.tablePage.length,
		// 		startIndex: (this.tablePage.currentPage - 1) * this.tablePage.length,
		// 	})
		// 	return paramJson
		// },
		// 搜索条件
		findSearchParams() {
			let paramJson = {
				groupChatName: this.formInline.groupChatName,
				collectionDate: moment(this.formInline.time).format('YYYYMMDD'),
				pageSize: 20,
				pageNum: this.count,
			}
			if (this.formInline.isSave == 1) {
				paramJson.isSave = true
			} else if (this.formInline.isSave == 2) {
				paramJson.isSave = false
			}
			// 当前页的条数开始
			// if (flag) {
			// 	this.page.currentPage = 1
			// }
			// paramJson.pageNum = this.page.currentPage
			return paramJson
		},
		async _robotMaterialList(flag) {
			const paramJson = this.findSearchParams(flag)
			const {
				data: { resultCode, resultData },
			} = await robotMaterialList(paramJson)
			console.log(resultData, resultCode, 'aadfdfdfddfdf')
			this.loading = false
			if (resultCode == 0) {
				this.version = moment(this.formInline.time).format('YYYY.MM.DD')
				this.robotsList = this.robotsList.concat(resultData)
				// this.totalPages = 3
				this.noMore = !resultData.length
			} else {
				this.robotsList = []
			}
		},
		load() {
			//滑到底部时进行加载
			this.loading = true
			setTimeout(() => {
				this.count += 1 //页数+1
				this._robotMaterialList() //调用接口，此时页数+1，查询下一页数据
			}, 2000)
			this.numbers.push(this.numbers.length + 1)
			console.log(111112312323)
		},
		handleSpecial() {
			if (!this.checkList.length) return this.$message.warning('请选择内容入库')
			// if (this.checkList.length > 9)
			// 	return this.$message.warning('已超过可选数量')
			let f1 = this.checkList.filter((item) => {
				return item.msgType == 2013
			})
			if (f1.length > 1) return this.$message.warning('已超过可选数量')
			let f2 = this.checkList.filter((item) => {
				return item.msgType == 2004
			})
			if (f2.length > 1) return this.$message.warning('已超过可选数量')
			let f3 = this.checkList.filter((item) => {
				return item.msgType == 2004 || item.msgType == 2002
			})
			if (f3.length > 9) return this.$message.warning('已超过可选数量')
			console.log(this.checkList, 'aaaaaaaaaaa')
			this.putWarehousingRow = {
				sort: '',
				materialSource: 3,
				shopId: '',
				wordMaterialContent: '',
				status: 1,
				effectivityType: 0,
			}
			let obj
			this.checkList.forEach((item, index) => {
				if (item.msgType == 2013) {
					let goodsObj = {
						goodsDefaultImage: item.appletCardInfoVO.goodsDefaultImage,
						goodsGroupId: item.appletCardInfoVO.goodsGroupId,
						goodsId: item.appletCardInfoVO.goodsId,
						isSales: item.appletCardInfoVO.goodsIsSale,
						goodsName: item.appletCardInfoVO.goodsName,
						goodsNumber: item.appletCardInfoVO.goodsNumber,
						shelfState: item.appletCardInfoVO.goodsShelfState,
					}
					this.putWarehousingRow = Object.assign(
						this.putWarehousingRow,
						goodsObj
					)
				}
				if (item.msgType == 2001) {
					this.putWarehousingRow.wordMaterialContent += item.content + `\n`
				}
				if (item.msgType == 2004) {
					obj = item
					this.checkList.splice(index, 1)
					if (obj) this.checkList.unshift(obj)
				}
			})
			let { wordMaterialContent } = this.putWarehousingRow
			if (wordMaterialContent && wordMaterialContent.length > 200)
				this.putWarehousingRow.wordMaterialContent = wordMaterialContent.substring(
					0,
					200
				)
			let arr = this.checkList.filter((item) => {
				return item.msgType == 2004 || item.msgType == 2002
			})
			let picMaterialContents = arr.map((item) => {
				let objList = {}
				if (item.msgType == 2002) {
					objList.materialContentType = 'image'
					objList.picOrVideoMaterialContent = item.content
				} else if (item.msgType == 2004) {
					objList.materialContentType = 'video'
					objList.picOrVideoMaterialContent = item.content
				}
				return objList
			})
			this.putWarehousingRow.picMaterialContents = picMaterialContents.length
				? picMaterialContents
				: []
			let msgIdList = this.checkList.map((item) => {
				return item.msgId
			})
			this.putWarehousingRow.msgIdList = msgIdList.length ? msgIdList : []
			console.log(this.putWarehousingRow, 'aaaaaaaaaaabbbbb')
			this.putWarehousingDialog = true
		},
		handleRule() {
			console.log(111111)
		},
	},
}
</script>
<style lang="scss" scoped>
.header-fixed {
	background-color: #ffffff;
	padding-top: 20px;
}
.time-sy {
	display: flex;
	align-items: center;
	font-size: 22px;
}
.icondate {
	margin-right: 6px;
}
.br {
	margin-right: 20px;
}
.preS {
	// height: 90px;
	line-height: 18px;
	white-space: pre-wrap;
	word-wrap: break-word;
	color: #666;
	// overflow: hidden;
	// text-overflow: ellipsis;
	// display: -webkit-box;
	// -webkit-line-clamp: 5;
	// line-clamp: 5;
	// -webkit-box-orient: vertical;
}
.context-sy {
	display: flex;
	align-items: center;
	margin-left: 14px;
}
.c_image {
	width: 135px;
	height: 135px;
	margin-top: 10px;
	border-radius: 5px;
	box-shadow: #e6e6e6 0px 0px 7px 1px;
}
.slot {
	padding: 8px 0 8px 12px;
	width: 700px;
	background: #ccc;
	text-align: left;
	display: flex;
	// align-items: center;
	.goods_img {
		width: 60px;
		height: 60px;
		margin-right: 10px;
		line-height: 155px;
	}

	.number {
		margin-left: 10px;
	}
}
.goods-info {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}
.break-sy {
	width: 600px;
	color: blue;
	// white-space: break-spaces;
	// word-break: break-all;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	word-break: break-all;
}

.loading span {
	display: inline-block;
	width: 20px;
	height: 20px;
	border: 2px solid #409eff;
	border-left: transparent;
	animation: zhuan 0.5s linear infinite;
	border-radius: 50%;
}
@keyframes zhuan {
	0% {
		transform: rotate(0);
	}
	100% {
		transform: rotate(360deg);
	}
}
.no-message {
	text-align: center;
	font-size: 18px;
	height: 300px;
	line-height: 300px;
	color: #ccc;
}
</style>

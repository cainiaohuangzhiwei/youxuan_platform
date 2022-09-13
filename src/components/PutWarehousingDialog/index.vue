/* eslint-disable no-dupe-else-if */
<template>
	<div class="addMaterial">
		<el-dialog
			width="800px"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<!-- <div style="height: 100vh"> -->
			<div class="box" v-if="putWarehousingRow.goodsId">
				<div class="solt">
					<img
						class="goods_img"
						:src="getSmallImg(putWarehousingRow.goodsDefaultImage)"
						alt=""
					/>
					<div>
						<div class="goodsName">
							{{ putWarehousingRow.goodsName }}
						</div>
						<div class="statusH">
							<el-tag
								:type="shelfStateMapTag[handleGoodsTag(putWarehousingRow)]"
								>{{ handleGoodsTag(putWarehousingRow) }}</el-tag
							>
							<span style="margin-left: 10px"
								>货号：{{ putWarehousingRow.goodsNumber }}</span
							>
						</div>
					</div>
				</div>
			</div>
			<div v-else class="box-goods">
				<el-button type="text" class="goods-b" @click="handleRelated"
					>关联商品</el-button
				>
			</div>
			<el-form
				ref="form"
				:model="form"
				label-width="100px"
				:rules="rules"
				v-loading="fixLoading"
			>
				<div class="formBox">
					<el-form-item label="归属" prop="materialSource">
						<el-select
							v-model="form.materialSource"
							placeholder="请选择素材类型"
						>
							<el-option label="官方素材" :value="0"></el-option>
							<el-option label="店主素材" :value="1"></el-option>
							<el-option label="虚拟店主素材" :value="2"></el-option>
							<el-option label="机器人素材" :value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item
						label="虚拟店主"
						prop="virtualShopId"
						:rules="{
							required: true,
							message: '请选择虚拟店主',
							trigger: ['blur', 'change'],
						}"
						v-if="form.materialSource == 2 || form.materialSource == 3"
					>
						<div class="virtual-sy">
							<el-button
								v-if="!form.virtualShopId"
								type="text"
								@click="handleVirtual(form)"
								>选择虚拟店主</el-button
							>
							<el-image
								v-if="form.virtualShopId && form.virtualShopkeeperPortraitUrl"
								class="virtual-image"
								fit="cover"
								:src="form.virtualShopkeeperPortraitUrl"
							>
								<div slot="error" class="el-image__error">
									<i class="el-icon-picture-outline"></i>
								</div>
							</el-image>
							<span v-if="form.virtualShopId" class="vistual-tx">{{
								form.virtualShopkeeperName
							}}</span>
							<el-button
								v-if="form.virtualShopId"
								type="text"
								@click="handleVirtual(form)"
								>修改</el-button
							>
							<el-button type="text" @click="handleVirtualManage"
								>虚拟店主管理</el-button
							>
						</div>
					</el-form-item>
					<el-form-item
						label="店主ID"
						prop="shopId"
						:rules="{
							required: true,
							message: '请输入店铺ID',
							trigger: ['blur', 'change'],
						}"
						v-if="form.materialSource == 1"
					>
						<el-input
							v-model="form.shopId"
							style="width: 200px; margin-left: 6px"
							placeholder="请输入店主 ID"
						></el-input>
					</el-form-item>
					<el-form-item label="素材内容" prop="wordMaterialContent">
						<div>
							<el-input
								style="width: 400px"
								type="textarea"
								maxlength="400"
								:autosize="{ minRows: 4, maxRows: 6 }"
								placeholder="请输入文字素材"
								v-model="form.wordMaterialContent"
							>
							</el-input>
						</div>
					</el-form-item>
					<el-form-item prop="imgList">
						<div>
							<div class="ivbox">
								<draggable
									v-model="form.imgList"
									@update="datadragEnd()"
									v-bind="{ animation: 500 }"
								>
									<transition-group>
										<!-- <div class="imgVideo"> -->
										<div
											v-for="(ite, idx) in form.imgList"
											:key="idx"
											class="imgVideo"
										>
											<div
												v-if="ite.materialContentType == 'video'"
												class="posbox"
											>
												<i
													class="el-icon-close ivbox-icon"
													@click="deleteImgV(idx)"
												></i>
												<video
													:src="ite.picOrVideoMaterialContent"
													class="c_image"
												></video>
											</div>
											<div v-else class="posbox">
												<i
													class="el-icon-close ivbox-icon"
													@click="deleteImgV(idx)"
												></i>
												<el-image
													class="c_image"
													fit="cover"
													:src="ite.picOrVideoMaterialContent"
												>
													<div slot="error" class="el-image__error">
														<i class="el-icon-picture-outline"></i>
													</div>
												</el-image>
											</div>
										</div>
									</transition-group>
								</draggable>
								<multiple-upload
									v-if="form.imgList && form.imgList.length < 9"
									style="margin-right: 14px"
									:index="index"
									:imgList="form.imgList"
									:fileList="form.fileList"
									@upload="upload"
								></multiple-upload>
							</div>
						</div>
					</el-form-item>
					<el-form-item label="状态" prop="status">
						<el-radio-group v-model="form.status">
							<el-radio :label="1">启用</el-radio>
							<el-radio :label="0">禁用</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="有效期" prop="effectivityType">
						<el-radio-group v-model="form.effectivityType">
							<el-radio :label="0">长期有效</el-radio>
							<el-radio :label="1">固定有效期</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item
						label="固定有效期"
						prop="time"
						:rules="{
							required: true,
							message: '请选择固定有效期',
							trigger: ['blur', 'change'],
						}"
						v-if="form.effectivityType == 1"
					>
						<el-date-picker
							v-model="form.time"
							type="datetimerange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
						>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="排序值" prop="sort">
						<el-input v-model="form.sort" style="width: 200px"></el-input>
						<p style="font-size: 12px; color: #ccc">
							排序值用于调整前端展示顺序，大的数字排前面，可不填，则按最后编辑时间，最新的显示在前面。
						</p>
					</el-form-item>
				</div>
				<!-- </div> -->
			</el-form>
			<div class="foot-b">
				<el-button type="primary" @click="submit()">确定</el-button>
				<el-button @click="resetForm()">取消</el-button>
			</div>
			<!-- </div> -->
		</el-dialog>
		<select-virtual-dialog
			:visible.sync="selectVirtualDialog"
			:selectVirtualRow="selectVirtualRow"
			@fatherMethodInit="fatherMethodInit"
		></select-virtual-dialog>
		<virtual-manage-dialog
			:visible.sync="virtualManageDialog"
			:virtualManageRow="virtualManageRow"
		></virtual-manage-dialog>
		<new-material-dialog
			:visible.sync="newMaterialDialog"
			:newMaterialRow="newMaterialRow"
			@Refresh="Refresh"
		></new-material-dialog>
	</div>
</template>

<script>
import multipleUpload from '@/components/multipleUpload'
import SelectVirtualDialog from '@/components/SelectVirtualDialog'
import virtualManageDialog from '@/components/virtualManageDialog'
import NewMaterialDialog from '@/components/NewMaterialDialog'
import { getSmallImg } from '@/utils/imageTool'
import { goodsMaterialAll, goodsMaterialSave } from '@/api/newMaterial'
import draggable from 'vuedraggable'
import moment from 'moment'
export default {
	props: {
		visible: {
			type: Boolean,
			define: false,
		},
		putWarehousingRow: {
			define: false,
			default: () => {},
		},
	},

	components: {
		multipleUpload,
		draggable,
		SelectVirtualDialog,
		virtualManageDialog,
		NewMaterialDialog,
	},

	data() {
		let validateWordMaterialContent = (rule, value, callback) => {
			if (!this.form.imgList.length && value == '') {
				callback(new Error('素材文本内容不能为空'))
			}
			callback()
		}
		let validateImgList = (rule, value, callback) => {
			if (!this.form.wordMaterialContent && value == '') {
				callback(new Error('素材图片或视频内容不能为空'))
			}
			callback()
		}
		let validateSort = (rule, value, callback) => {
			let reg = /^[+]{0,1}(\d+)$/
			if (value && !reg.test(value)) {
				callback(new Error('排序值只能输入正整数'))
			}
			callback()
		}
		return {
			newMaterialDialog: false,
			newMaterialRow: {},
			virtualManageDialog: false,
			virtualManageRow: {},
			selectVirtualDialog: false,
			selectVirtualRow: {},
			virtualIndex: null,
			fixLoading: false,
			gmaList: {},
			form: this.getForm(),
			rules: {
				wordMaterialContent: {
					required: true,
					validator: validateWordMaterialContent,
					trigger: ['blur', 'change'],
				},
				imgList: {
					required: true,
					validator: validateImgList,
					trigger: ['blur', 'change'],
				},
				sort: {
					validator: validateSort,
					trigger: ['blur', 'change'],
				},
			},
			getSmallImg: getSmallImg,
			shelfStateMapTag: {
				在售: 'warning',
				待售: 'info',
				下架: 'info',
				推荐: 'danger',
			},
		}
	},
	watch: {
		localVisible(val) {
			this.$refs.form && this.$refs.form.resetFields()
			this.form = this.getForm()
			if (val) {
				console.log(this.putWarehousingRow, '===1123123123123123')
				this.form.materialSource = this.putWarehousingRow.materialSource
				this.form.effectivityType = this.putWarehousingRow.effectivityType
				if (
					this.putWarehousingRow.picMaterialContents &&
					this.putWarehousingRow.picMaterialContents.length
				) {
					this.form.imgList = JSON.parse(
						JSON.stringify(this.putWarehousingRow.picMaterialContents)
					)
					this.form.fileList = JSON.parse(
						JSON.stringify(this.putWarehousingRow.picMaterialContents)
					)
				}
				this.form.shopId = this.putWarehousingRow.shopId || ''
				this.form.sort = this.putWarehousingRow.sort
				this.form.status = this.putWarehousingRow.status
				this.form.wordMaterialContent =
					this.putWarehousingRow.wordMaterialContent
				if (this.form.effectivityType == 1) {
					this.form.time = [
						new Date(this.putWarehousingRow.effectivityStartTime),
						new Date(this.putWarehousingRow.effectivityEndTime),
					]
				}
			}
		},
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
	methods: {
		handleRelated() {
			this.newMaterialDialog = true
		},
		Refresh(val) {
			console.log(val, 'valvlavlav')
			let obj = {
				goodsDefaultImage: val.goodsDefaultImage,
				goodsGroupId: val?.goodsGroupList[0]?.goodsGroupId,
				goodsId: val.goodsId,
				isSales: val.isSales,
				goodsName: val.goodsName,
				goodsNumber: val.goodsNumber,
				shelfState: val.shelfState,
			}
			this.putWarehousingRow = Object.assign(this.putWarehousingRow, obj)
			console.log(this.putWarehousingRow, 'aadfdfdfdf')
		},
		fatherMethodInit(row) {
			this.form.virtualShopkeeperName = row.virtualShopkeeperName
			this.form.virtualShopId = row.id
			this.form.virtualShopkeeperPortraitUrl = row.virtualShopkeeperPortraitUrl
		},
		handleVirtualManage() {
			this.virtualManageDialog = true
		},
		handleVirtual(item) {
			this.selectVirtualDialog = true
			if (item.virtualShopId) {
				this.selectVirtualRow = {
					id: item.virtualShopId,
					virtualShopkeeperName: item.virtualShopkeeperName,
					virtualShopkeeperPortraitUrl: item.virtualShopkeeperPortraitUrl,
				}
			} else {
				this.selectVirtualRow = {}
			}
		},
		getForm() {
			return {
				materialSource: 0,
				shopId: '',
				wordMaterialContent: '',
				imgList: [],
				fileList: [],
				status: 1,
				effectivityType: 0,
				time: '',
				sort: '',
				virtualShopId: '',
				virtualShopkeeperName: '',
				virtualShopkeeperPortraitUrl: '',
			}
		},
		async _goodsMaterialAll() {
			let params = {
				goodsId: this.putWarehousingRow.goodsId,
			}
			let {
				data: { resultCode, resultData },
			} = await goodsMaterialAll(params)
			if (resultCode == 0) {
				this.gmaList = resultData
			}
		},
		handleDelete(i) {
			this.form.list.splice(i, 1)
		},
		handleDetail() {
			this.localVisible = false
			this.$router.push({
				name: 'commodityDetail',
				params: { goodsId: this.putWarehousingRow.goodsId },
			})
		},
		submit() {
			this.$refs['form'].validate((valid) => {
				if (valid) {
					let canFix = this.handleData()
					if (canFix) {
						return this.$message.warning('每个素材只能上传一个视频')
					} else {
						this.handleFix()
					}
				}
			})
		},
		handleData() {
			let canFix = false
			if (this.form.imgList && this.form.imgList.length) {
				let arr = this.form.imgList.filter((item) => {
					return item.materialContentType == 'video'
				})
				if (arr && arr.length > 1) {
					canFix = true
				}
			}
			return canFix
		},
		async handleFix() {
			if (this.fixLoading) return
			if (!this.putWarehousingRow.goodsId) {
				return this.$message.warning('请先关联商品')
			}
			this.fixLoading = true
			let params = {
				goodsDefaultImg: this.putWarehousingRow.goodsDefaultImage,
				goodsGroupId: this.putWarehousingRow.goodsGroupId,
				goodsId: this.putWarehousingRow.goodsId,
				goodsIsSale: this.putWarehousingRow.isSales,
				goodsName: this.putWarehousingRow.goodsName,
				goodsNumber: this.putWarehousingRow.goodsNumber,
				goodsShelfState: this.putWarehousingRow.shelfState,
				clerkId: this.$store.state.user.userInfo.clerkId,
				userName: this.$store.state.user.userInfo.clerkName,
				userId: this.$store.state.user.userInfo.userId,
			}
			console.log(this.form, '======afasdfasdfdf')
			let objList = {}
			objList.effectivityType = this.form.effectivityType
			objList.materialSource = this.form.materialSource
			objList.status = this.form.status
			objList.sort = this.form.sort
			if (this.form.wordMaterialContent) {
				objList.wordMaterialContent = this.form.wordMaterialContent
			}
			if (this.form.effectivityType == 1) {
				objList.effectivityStartTime = moment(this.form.time[0]).valueOf()
				objList.effectivityEndTime = moment(this.form.time[1]).valueOf()
			}
			if (this.form.materialSource == 2 || this.form.materialSource == 3) {
				objList.shopType = 2
			} else if (this.form.materialSource == 0) {
				objList.shopType = 0
			} else {
				objList.shopType = 1
			}
			if (this.form.materialSource == 1) {
				objList.shopId = this.form.shopId
			} else if (
				this.form.materialSource == 2 ||
				this.form.materialSource == 3
			) {
				objList.virtualShopId = this.form.virtualShopId
				objList.virtualShopkeeperName = this.form.virtualShopkeeperName
				objList.virtualShopkeeperPortraitUrl =
					this.form.virtualShopkeeperPortraitUrl
			}
			if (this.form.imgList && this.form.imgList.length) {
				objList.picMaterialContents = this.form.imgList
			}
			params.goodsRefMaterialList = [objList]
			params.msgIdList = this.putWarehousingRow.msgIdList
			let {
				data: { resultCode },
			} = await goodsMaterialSave(params)
			this.fixLoading = false
			if (resultCode == 0) {
				this.$message.success('添加成功')
				this.localVisible = false
				this.$emit('retain', this.putWarehousingRow.msgIdList)
				// this.$router.push({
				// 	name: 'commodityDetail',
				// 	params: { goodsId: this.putWarehousingRow.goodsId },
				// })
			}
		},
		datadragEnd(evt) {
			console.log(evt, 'evt')
		},
		deleteImgV(i) {
			this.form.imgList.splice(i, 1)
			this.form.fileList.splice(i, 1)
		},
		upload(val) {
			let res = {}
			res.picOrVideoMaterialContent = val.result.url
			if (val.result.type.toLocaleLowerCase() == 'mp4') {
				res.materialContentType = 'video'
			} else {
				res.materialContentType = 'image'
			}
			this.form.imgList.push(JSON.parse(JSON.stringify(res)))
			this.form.fileList.push(JSON.parse(JSON.stringify(res)))
			// let res = {}
			// res.picOrVideoMaterialContent = val.result.url
			// if (val.result.type == 'mp4') {
			// 	res.materialContentType = 'video'
			// } else {
			// 	res.materialContentType = 'image'
			// }
			// this.form.list[val.index].imgList.push(JSON.parse(JSON.stringify(res)))
			// this.form.list[val.index].fileList.push(JSON.parse(JSON.stringify(res)))
			// this.form.list[val.index].imgList = val.imgList.map((item) => {
			// 	let obj = {}
			// 	obj.picOrVideoMaterialContent = item.picOrVideoMaterialContent
			// 	obj.materialContentType = item.materialContentType
			// 	return obj
			// })
			// this.form.list[val.index].fileList = val.fileList.map((item) => {
			// 	let obj = {}
			// 	obj.picOrVideoMaterialContent = item.picOrVideoMaterialContent
			// 	obj.materialContentType = item.materialContentType
			// 	return obj
			// })
		},
		// 商品规格-处理显示商品状态
		handleGoodsTag(row = {}) {
			// return '在售'
			let title =
				row.shelfState == 2 ? (row.isSales == 1 ? '在售' : '待售') : '下架'
			return title
		},
		saveBrand(val) {
			this.selectGroupList = val
		},
		handleAdd() {
			this.form.list.unshift({
				materialSource: 0,
				shopId: '',
				virtualShopId: '',
				virtualShopkeeperName: '',
				virtualShopkeeperPortraitUrl: '',
				wordMaterialContent: '',
				imgList: [],
				fileList: [],
				status: 1,
				effectivityType: 0,
				time: '',
				sort: '',
			})
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},
	},
}
</script>
<style>
.addMaterial .el-dialog__body {
	max-height: 700px;
}
</style>
<style lang="scss" scoped>
.box {
	width: 100%;

	border: 1px solid #cccccc;
	margin-bottom: 15px;
	// position: fixed;
	text-align: center;
	background: rgb(236, 236, 236);
	// z-index: 999;
}
.box-goods {
	width: 100%;
	border: 1px solid #cccccc;
	margin-bottom: 15px;
	background: rgb(236, 236, 236);
	height: 142px;
	line-height: 142px;
	padding-left: 30px;
	.goods-b {
		font-size: 18px;
	}
}
.solt {
	display: flex;
	align-items: center;
	padding: 10px 0 10px 40px;
}
.goods_img {
	width: 120px;
	height: auto;
	margin-right: 15px;
}
.goodsName {
	margin-bottom: 6px;
	width: 500px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	word-break: break-all;
	text-align: left;
	font-size: 20px;
	font-weight: 800;
}
.statusH {
	display: flex;
	align-items: center;
}
.formBox {
	position: relative;
	border: 1px solid #cccccc;
	padding: 10px;
	box-sizing: border-box;
}
.box-icon {
	position: absolute;
	right: 12px;
	z-index: 999;
}
.posbox {
	position: relative;
}
.ivbox-icon {
	position: absolute;
	right: 14px;
	top: 14px;
	z-index: 999;
	font-size: 16px;
}
.bs {
	text-align: center;
	margin-top: 20px;
}
.ivbox {
	display: flex;
	align-items: center;
}
.imgVideo {
	display: inline-block;
}
.imgVideo .c_image {
	width: 100px;
	height: 100px;
	margin-right: 10px;
	margin-top: 10px;
	border-radius: 5px;
	box-shadow: #e6e6e6 0px 0px 7px 1px;
}
.foot-b {
	text-align: right;
	margin-top: 20px;
}
.virtual-sy {
	display: flex;
	align-items: center;
}
.vistual-tx {
	margin-right: 6px;
}
.virtual-image {
	width: 40px;
	margin-right: 6px;
}
</style>

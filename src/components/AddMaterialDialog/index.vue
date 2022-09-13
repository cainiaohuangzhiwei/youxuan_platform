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
			<div class="box">
				<div class="solt">
					<img
						class="goods_img"
						:src="getSmallImg(addMaterialRow.goodsDefaultImage)"
						alt=""
					/>
					<div>
						<div class="goodsName">
							{{ addMaterialRow.goodsName }}
						</div>
						<div class="statusH">
							<el-tag
								:type="shelfStateMapTag[handleGoodsTag(addMaterialRow)]"
								>{{ handleGoodsTag(addMaterialRow) }}</el-tag
							>
							<span style="margin-left: 10px"
								>货号：{{ addMaterialRow.goodsNumber }}</span
							>
						</div>
					</div>
				</div>
				<div style="text-align: right; margin-right: 10px">
					<el-button
						v-if="gmaList.materialTotalNo"
						type="text"
						style="font-size: 16px"
						@click="handleDetail"
						>查看所有素材({{ gmaList.materialTotalNo || 0 }})</el-button
					>
					<el-button
						type="text"
						@click="handleAdd"
						icon="el-icon-plus"
						style="font-size: 16px"
						>添加素材</el-button
					>
				</div>
			</div>
			<div>
				<el-form
					ref="form"
					:model="form"
					label-width="100px"
					:rules="rules"
					v-loading="fixLoading"
				>
					<div
						v-for="(item, index) in form.list"
						:key="index"
						style="margin-bottom: 10px"
					>
						<div class="formBox">
							<i
								class="el-icon-close box-icon"
								@click="handleDelete(index)"
							></i>
							<el-form-item label="归属">
								<el-select
									v-model="item.materialSource"
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
								:prop="'list.' + index + '.virtualShopId'"
								:rules="{
									required: true,
									message: '请选择虚拟店主',
									trigger: ['blur', 'change'],
								}"
								v-if="item.materialSource == 2 || item.materialSource == 3"
							>
								<div class="virtual-sy">
									<el-button
										v-if="!item.virtualShopId"
										type="text"
										@click="handleVirtual(item, index)"
										>选择虚拟店主</el-button
									>
									<el-image
										v-if="
											item.virtualShopId && item.virtualShopkeeperPortraitUrl
										"
										class="virtual-image"
										fit="cover"
										:src="item.virtualShopkeeperPortraitUrl"
									>
										<div slot="error" class="el-image__error">
											<i class="el-icon-picture-outline"></i>
										</div>
									</el-image>
									<span v-if="item.virtualShopId" class="vistual-tx">{{
										item.virtualShopkeeperName
									}}</span>
									<el-button
										v-if="item.virtualShopId"
										type="text"
										@click="handleVirtual(item, index)"
										>修改</el-button
									>
									<el-button type="text" @click="handleVirtualManage"
										>虚拟店主管理</el-button
									>
								</div>
							</el-form-item>
							<el-form-item
								label="店主ID"
								:prop="'list.' + index + '.shopId'"
								:rules="{
									required: true,
									message: '请输入店铺ID',
									trigger: ['blur', 'change'],
								}"
								v-if="item.materialSource == 1"
							>
								<el-input
									v-model="item.shopId"
									style="width: 200px; margin-left: 6px"
									placeholder="请输入店主ID"
								></el-input>
							</el-form-item>
							<el-form-item
								label="素材内容"
								:prop="'list.' + index + '.wordMaterialContent'"
								:rules="workListRule.wordMaterialContent"
							>
								<div>
									<el-input
										style="width: 400px"
										type="textarea"
										maxlength="400"
										:autosize="{ minRows: 4, maxRows: 6 }"
										placeholder="请输入文字素材"
										v-model="item.wordMaterialContent"
									>
									</el-input>
								</div>
							</el-form-item>
							<el-form-item
								:prop="'list.' + index + '.imgList'"
								:rules="workListRule.imgList"
							>
								<div>
									<div class="ivbox">
										<draggable
											v-model="item.imgList"
											@update="datadragEnd()"
											v-bind="{ animation: 500 }"
										>
											<transition-group>
												<!-- <div class="imgVideo"> -->
												<div
													v-for="(ite, idx) in item.imgList"
													:key="idx"
													class="imgVideo"
												>
													<div
														v-if="ite.materialContentType == 'video'"
														class="posbox"
													>
														<i
															class="el-icon-close ivbox-icon"
															@click="deleteImgV(item, idx)"
														></i>
														<video
															:src="ite.picOrVideoMaterialContent"
															class="c_image"
														></video>
													</div>
													<div v-else class="posbox">
														<i
															class="el-icon-close ivbox-icon"
															@click="deleteImgV(item, idx)"
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
											v-if="item.imgList && item.imgList.length < 9"
											style="margin-right: 14px"
											:index="index"
											:imgList="item.imgList"
											:fileList="item.fileList"
											@upload="upload"
											:videoMaxSize="200"
										></multiple-upload>
									</div>
								</div>
							</el-form-item>
							<el-form-item label="状态">
								<el-radio-group v-model="item.status">
									<el-radio :label="1">启用</el-radio>
									<el-radio :label="0">禁用</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="有效期">
								<el-radio-group v-model="item.effectivityType">
									<el-radio :label="0">长期有效</el-radio>
									<el-radio :label="1">固定有效期</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item
								label="固定有效期"
								:prop="'list.' + index + '.time'"
								:rules="{
									required: true,
									message: '请选择固定有效期',
									trigger: ['blur', 'change'],
								}"
								v-if="item.effectivityType == 1"
							>
								<el-date-picker
									v-model="item.time"
									type="datetimerange"
									range-separator="至"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
								>
								</el-date-picker>
							</el-form-item>
							<el-form-item
								label="排序值"
								:prop="'list.' + index + '.sort'"
								:rules="workListRule.sort"
							>
								<el-input v-model="item.sort" style="width: 200px"></el-input>
								<p style="font-size: 12px; color: #ccc">
									排序值用于调整前端展示顺序，大的数字排前面，可不填，则按最后编辑时间，最新的显示在前面。
								</p>
							</el-form-item>
						</div>
					</div>
				</el-form>
				<div class="foot-b">
					<el-button @click="resetForm()">取消</el-button>
					<el-button type="primary" @click="submit('only')">确定</el-button>
					<el-button type="primary" @click="submit('next')" v-if="showB == 1"
						>确定并添加下一个</el-button
					>
				</div>
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
	</div>
</template>

<script>
import multipleUpload from '@/components/multipleUpload'
import SelectVirtualDialog from '@/components/SelectVirtualDialog'
import virtualManageDialog from '@/components/virtualManageDialog'
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
		addMaterialRow: {
			define: false,
			default: () => {},
		},
		showB: {
			type: String,
			define: 1,
		},
	},

	components: {
		multipleUpload,
		draggable,
		SelectVirtualDialog,
		virtualManageDialog,
	},

	data() {
		let validateWordMaterialContent = (rule, value, callback) => {
			let thisField = rule.field.split('.')[1]
			if (!this.form.list[thisField].imgList.length && value == '') {
				callback(new Error('素材文本内容不能为空'))
			}
			callback()
		}
		let validateImgList = (rule, value, callback) => {
			let thisField = rule.field.split('.')[1]
			console.log(value, '====lengtt')
			if (!this.form.list[thisField].wordMaterialContent && value == '') {
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
			virtualManageDialog: false,
			virtualManageRow: {},
			selectVirtualDialog: false,
			selectVirtualRow: {},
			virtualIndex: null,
			workListRule: {
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
			// nextMaterialRow: {},
			// NextMaterialDialog: false,
			fixLoading: false,
			gmaList: {},
			form: this.getForm(),
			rules: {},
			shelfStateMapTag: {
				在售: 'warning',
				待售: 'info',
				下架: 'info',
				推荐: 'danger',
			},
			getSmallImg: getSmallImg,
		}
	},
	watch: {
		localVisible(val) {
			this.$refs.form && this.$refs.form.resetFields()
			if (val) {
				this._goodsMaterialAll()
				this.form = this.getForm()
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
		fatherMethodInit(row) {
			console.log(this.virtualIndex, row, 'rowuwrwerererer')
			this.form.list.forEach((item, index) => {
				if (index == this.virtualIndex) {
					item.virtualShopId = row.id
					item.virtualShopkeeperName = row.virtualShopkeeperName
					item.virtualShopkeeperPortraitUrl = row.virtualShopkeeperPortraitUrl
				}
			})
			console.log(this.form.list, 'aaaaaaa')
		},
		handleVirtualManage() {
			this.virtualManageDialog = true
		},
		handleVirtual(item, index) {
			this.virtualIndex = index
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
				list: [
					{
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
					},
				],
			}
		},
		async _goodsMaterialAll() {
			let params = {
				goodsId: this.addMaterialRow.goodsId,
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
				params: { goodsId: this.addMaterialRow.goodsId },
			})
		},
		submit(type) {
			this.$refs['form'].validate((valid) => {
				if (valid) {
					let canFix = this.handleData()
					if (canFix) {
						return this.$message.warning('每个素材只能上传一个视频')
					} else {
						this.handleFix(type)
					}
				}
			})
		},
		handleData() {
			let canFix = false
			let arrList = []
			this.form.list.forEach((item) => {
				let obj = 1
				if (item.imgList && item.imgList.length) {
					let arr = item.imgList.filter((ite) => {
						return ite.materialContentType == 'video'
					})
					console.log(arr, 989898)
					if (arr.length > 1) {
						obj = 2
					} else {
						obj = 1
					}
				}
				arrList.push(obj)
			})
			canFix = arrList.some((item) => {
				return item == 2
			})
			return canFix
		},
		async handleFix(type) {
			if (this.fixLoading) return
			this.fixLoading = true
			let params = {
				goodsDefaultImg: this.addMaterialRow.goodsDefaultImage,
				goodsGroupId:
					this.addMaterialRow.goodsGroupId || this.gmaList.goodsGroupId,
				goodsId: this.addMaterialRow.goodsId,
				goodsIsSale: this.addMaterialRow.isSales,
				goodsName: this.addMaterialRow.goodsName,
				goodsNumber: this.addMaterialRow.goodsNumber,
				goodsShelfState: this.addMaterialRow.shelfState,
				clerkId: this.$store.state.user.userInfo.clerkId,
				userName: this.$store.state.user.userInfo.clerkName,
				userId: this.$store.state.user.userInfo.userId,
			}
			params.goodsRefMaterialList = this.form.list.map((item) => {
				let obj = {
					effectivityType: item.effectivityType,
					materialSource: item.materialSource,
					status: item.status,
					sort: item.sort,
				}
				if (item.materialSource == 2 || item.materialSource == 3) {
					obj.shopType = 2
				} else if (item.materialSource == 0) {
					obj.shopType = 0
				} else {
					obj.shopType = 1
				}
				if (item.wordMaterialContent) {
					obj.wordMaterialContent = item.wordMaterialContent
				}
				if (item.materialSource == 1) {
					obj.shopId = item.shopId
				} else if (item.materialSource == 2 || item.materialSource == 3) {
					obj.virtualShopId = item.virtualShopId
					obj.virtualShopkeeperName = item.virtualShopkeeperName
					obj.virtualShopkeeperPortraitUrl = item.virtualShopkeeperPortraitUrl
				}
				if (item.effectivityType == 1) {
					obj.effectivityStartTime = moment(item.time[0]).valueOf()
					obj.effectivityEndTime = moment(item.time[1]).valueOf()
				}
				if (item.imgList && item.imgList.length) {
					obj.picMaterialContents = item.imgList
				}
				return obj
			})
			let {
				data: { resultCode },
			} = await goodsMaterialSave(params)
			this.fixLoading = false
			if (resultCode == 0) {
				this.$message.success('添加成功')
				this.localVisible = false
				this.$emit('addRefresh', type)
				if (type == 'only') {
					this.$router.push({
						name: 'commodityDetail',
						params: { goodsId: this.addMaterialRow.goodsId },
					})
				}
			}
		},
		datadragEnd(evt) {
			console.log(evt, 'evt')
		},
		deleteImgV(item, i) {
			item.imgList.splice(i, 1)
			item.fileList.splice(i, 1)
		},
		upload(val) {
			let res = {}
			res.picOrVideoMaterialContent = val.result.url
			if (val.result.type.toLocaleLowerCase() == 'mp4') {
				res.materialContentType = 'video'
			} else {
				res.materialContentType = 'image'
			}
			this.form.list[val.index].imgList.push(JSON.parse(JSON.stringify(res)))
			this.form.list[val.index].fileList.push(JSON.parse(JSON.stringify(res)))
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
.solt {
	display: flex;
	align-items: center;
	padding: 10px 0 0 40px;
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

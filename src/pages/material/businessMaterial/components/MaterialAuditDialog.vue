/* eslint-disable no-dupe-else-if */
<template>
	<div class="addMaterial">
		<el-dialog
			width="800px"
			:close-on-click-modal="false"
			:title="title"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<div>
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
								disabled
							>
								<el-option label="官方素材" :value="0"></el-option>
								<el-option label="店主素材" :value="1"></el-option>
								<el-option label="虚拟店主素材" :value="2"></el-option>
								<el-option label="机器人素材" :value="3"></el-option>
								<el-option label="商家素材" :value="4"></el-option>
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
									disabled
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
									disabled
									@click="handleVirtual(form)"
									>修改</el-button
								>
								<el-button type="text" disabled @click="handleVirtualManage"
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
								placeholder="请输入店主ID"
								disabled
							></el-input>
						</el-form-item>
						<!-- 商品信息 -->
						<el-form-item label="商品" prop="goodsId">
							<div class="good-info-item">
								<div class="good-img">
									<img :src="getSmallImg(form.goodsDefaultImage)" />
								</div>
								<div class="good-text">
									<p class="good-title">{{ form.goodsName }}</p>
									<p class="good-number">货号: {{ form.goodsNumber }}</p>
								</div>
							</div>
						</el-form-item>
						<el-form-item label="素材内容" prop="wordMaterialContent">
							<div>
								<el-input
									style="width: 400px"
									type="textarea"
									:disabled="type === 'detail'"
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
										:disabled="type === 'detail'"
										v-bind="{ animation: 500 }"
									>
										<transition-group>
											<!-- <div class="imgVideo"> -->
											<div
												v-for="(ite, idx) in form.imgList"
												:key="idx"
												class="imgVideo"
											>
												<div v-if="ite.materialType == 'video'" class="posbox">
													<i
														class="el-icon-close ivbox-icon"
														@click="deleteImgV(idx)"
													></i>
													<video
														:src="ite.materialContent"
														class="c_image"
													></video>
												</div>
												<div v-else class="posbox">
													<i
														class="el-icon-close ivbox-icon"
														@click="deleteImgV(idx)"
														v-if="type !== 'detail'"
													></i>
													<el-image
														class="c_image"
														fit="cover"
														:src="ite.materialContent"
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
										v-if="
											form.imgList &&
											form.imgList.length < 9 &&
											type !== 'detail'
										"
										style="margin-right: 14px"
										:index="index"
										:imgList="form.imgList"
										:fileList="form.fileList"
										:maxSize="50"
										@upload="upload"
									></multiple-upload>
								</div>
							</div>
						</el-form-item>
						<el-form-item label="状态" prop="status">
							<el-radio-group
								v-model="form.status"
								:disabled="type === 'detail'"
							>
								<el-radio :label="1">启用</el-radio>
								<el-radio :label="0">禁用</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="有效期" prop="effectivityType">
							<el-radio-group
								v-model="form.effectivityType"
								:disabled="type === 'detail'"
							>
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
							<el-input
								v-model="form.sort"
								style="width: 200px"
								:disabled="type === 'detail'"
							></el-input>
							<p style="font-size: 12px; color: #ccc">
								排序值用于调整前端展示顺序，大的数字排前面，可不填，则按最后编辑时间，最新的显示在前面。
							</p>
						</el-form-item>
					</div>
					<!-- </div> -->
				</el-form>
				<div class="foot-b" v-if="type === 'audit'">
					<el-popconfirm
						class="button-confirm"
						confirm-button-text="确定"
						cancel-button-text="取消"
						icon="el-icon-info"
						icon-color="red"
						@confirm="auditPass()"
						title="审核通过后素材立即入库,确定审核通过吗？"
					>
						<el-button slot="reference" type="primary">通过</el-button>
					</el-popconfirm>
					<el-button type="danger" @click="rejectHandle()">驳回</el-button>
				</div>
				<div class="foot-b" v-if="type === 'edit'">
					<el-button type="info" @click="resetForm()">取消</el-button>
					<el-popconfirm
						class="button-confirm"
						confirm-button-text="确定"
						cancel-button-text="取消"
						icon="el-icon-info"
						icon-color="red"
						@confirm="auditPass()"
						title="确定修改素材吗？"
					>
						<el-button slot="reference" type="primary">确定</el-button>
					</el-popconfirm>
				</div>
			</div>
		</el-dialog>
		<reject-edit-dialog
			:visible.sync="rejectEditDialogVisible"
			:rejectEditRow="rejectEditRow"
			@rejectSuccess="rejectSuccess"
		/>
	</div>
</template>

<script>
import multipleUpload from '@/components/multipleUpload'
import { getSmallImg } from '@/utils/imageTool'
import rejectEditDialog from './RejectEditDialog'
import {
	supplierMaterialDetailFors,
	auditForSupplier,
	updateForSupplier,
} from '@/api/businessMaterial'
import draggable from 'vuedraggable'
import moment from 'moment'
export default {
	props: {
		visible: {
			type: Boolean,
			define: false,
		},
		singeMaterialRow: {
			define: false,
			default: () => {},
		},
		type: {
			type: String,
			define: '',
		},
		title: {
			type: String,
			define: '',
		},
	},

	components: {
		multipleUpload,
		draggable,
		rejectEditDialog,
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
			rejectEditDialogVisible: false,
			rejectEditRow: {},
		}
	},
	watch: {
		localVisible(val) {
			this.$refs.form && this.$refs.form.resetFields()
			this.form = this.getForm()
			console.log(this.singeMaterialRow, 'aaa1312312323')
			if (val) {
				const { id } = this.singeMaterialRow
				supplierMaterialDetailFors({
					activityGoodsMaterialRefId: id,
				}).then(({ data: { resultCode, resultData } }) => {
					if (resultCode === 0) {
						this.form.materialSource = resultData.materialSource
						this.form.effectivityType = resultData.effectivityType
						this.form.goodsName = resultData.goodsName
						this.form.goodsDefaultImage = resultData.goodsDefaultImage
						this.form.goodsNumber = resultData.goodsNumber

						this.rejectEditRow = resultData

						if (
							resultData.goodsMaterialList &&
							resultData.goodsMaterialList.length
						) {
							this.form.imgList = JSON.parse(
								JSON.stringify(
									resultData.goodsMaterialList.filter(
										(m) => m.materialType !== 'text'
									)
								)
							)
							this.form.fileList = JSON.parse(
								JSON.stringify(
									resultData.goodsMaterialList.filter(
										(m) => m.materialType !== 'text'
									)
								)
							)

							this.form.wordMaterialContent =
								resultData.goodsMaterialList.find(
									(m) => m.materialType === 'text'
								)?.materialContent || ''
						}
						this.form.sort = resultData.sort
						this.form.status = resultData.status
						if (this.form.effectivityType == 1) {
							this.form.time = [
								new Date(resultData.effectivityStartTime),
								new Date(resultData.effectivityEndTime),
							]
						}
					}
				})
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
		auditPass() {
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
		rejectHandle() {
			this.rejectEditDialogVisible = true
		},
		rejectSuccess() {
			this.localVisible = false
			this.rejectEditRow = {}
			this.$emit('refresh')
		},
		handleData() {
			let canFix = false
			if (this.form.imgList && this.form.imgList.length) {
				let arr = this.form.imgList.filter((item) => {
					return item.materialType == 'video'
				})
				if (arr && arr.length > 1) {
					canFix = true
				}
			}
			return canFix
		},
		async handleFix() {
			if (this.fixLoading) return
			this.fixLoading = true
			let params = {
				activityGoodsMaterialRefId: this.singeMaterialRow.id,
				effectivityType: this.form.effectivityType,
				sort: this.form.sort,
				status: this.form.status,
				auditStatus: 3,
				clerkId: this.$store.state.user.userInfo.clerkId,
				userName: this.$store.state.user.userInfo.clerkName,
				userId: this.$store.state.user.userInfo.userId,
				auditRemark: '审批通过',
			}
			if (this.form.effectivityType == 1) {
				params.effectivityStartTime = moment(this.form.time[0]).valueOf()
				params.effectivityEndTime = moment(this.form.time[1]).valueOf()
			}
			params.goodsMaterialList = []
			if (this.form.wordMaterialContent) {
				params.goodsMaterialList.push({
					materialType: 'text',
					materialContent: this.form.wordMaterialContent,
				})
			}
			if (this.form.imgList && this.form.imgList.length) {
				params.goodsMaterialList = params.goodsMaterialList.concat(
					this.form.imgList
				)
			}
			if (this.type === 'audit') {
				// 审核
				const {
					data: { resultCode },
				} = await auditForSupplier(params)
				this.fixLoading = false
				if (resultCode === 0) {
					this.$message.success('审核成功')
					this.localVisible = false
					this.$emit('refresh')
				}
			} else if (this.type === 'edit') {
				// 编辑
				params.picMaterialContents = params.goodsMaterialList
					.filter((item) => item.materialType !== 'text')
					.map((item) => ({
						materialContentType: item.materialType,
						picOrVideoMaterialContent: item.materialContent,
					}))
				params.wordMaterialContent = this.form.wordMaterialContent
				const {
					data: { resultCode },
				} = await updateForSupplier(params)
				if (resultCode === 0) {
					this.$message.success('编辑成功')
					this.localVisible = false
					this.$emit('refresh')
				}
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
			res.materialContent = val.result.url
			if (val.result.type.toLocaleLowerCase() == 'mp4') {
				res.materialType = 'video'
			} else {
				res.materialType = 'image'
			}
			this.form.imgList.push(JSON.parse(JSON.stringify(res)))
			this.form.fileList.push(JSON.parse(JSON.stringify(res)))
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
}
.statusH {
	display: flex;
	align-items: center;
}
.formBox {
	// border: 1px solid #cccccc;
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

.good-info-item {
	display: flex;
}

.good-info-item .good-img {
	width: 80px;
	border-radius: 10px;
	overflow: hidden;
	border: solid 1px #ddd;
	margin-right: 10px;
}
.good-img img {
	width: 100%;
	display: block;
}

.good-text p {
	margin: 0;
}

.button-confirm {
	margin: 0 20px;
}
</style>

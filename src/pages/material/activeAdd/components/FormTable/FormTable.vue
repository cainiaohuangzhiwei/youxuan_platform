<template>
	<basic-container>
		<div class="form-box">
			<el-form
				ref="form"
				:model="form"
				:rules="rules"
				label-width="80px"
				v-loading="formLoading"
			>
				<el-form-item label="场次名称" prop="activityMaterialName">
					<el-input
						v-model="form.activityMaterialName"
						placeholder="请输入活动名称"
						maxlength="30"
						show-word-limit
						style="width: 600px"
					></el-input>
				</el-form-item>
				<el-form-item label="活动素材" prop="materialContentList">
					<draggable
						v-model="form.materialContentList"
						:options="{ animation: 500 }"
					>
						<transition-group>
							<div
								v-for="(item, index) in form.materialContentList"
								:key="index"
							>
								<div class="forItem" v-if="item.materialType == 'text'">
									<i
										class="el-icon-close ivbox-icon"
										@click="deleteImgV(index)"
									></i>
									<el-input
										type="textarea"
										:autosize="{ minRows: 4, maxRows: 6 }"
										placeholder="文本功能区，支持文本、Emoji等即可。其它功能后续需要再加。"
										v-model="item.materialContent"
										style="width: 650px"
										maxlength="200"
										show-word-limit
									>
									</el-input>
								</div>
								<div v-else-if="item.materialType == 'video'" class="pos">
									<i
										class="el-icon-close ivbox-icon"
										@click="deleteImgV(index)"
									></i>
									<video :src="item.materialContent" class="c_image"></video>
								</div>
								<div v-else class="pos">
									<i
										class="el-icon-close ivbox-icon"
										@click="deleteImgV(index)"
									></i>
									<el-image
										class="c_image"
										fit="cover"
										:src="item.materialContent"
									>
										<div slot="error" class="el-image__error">
											<i class="el-icon-picture-outline"></i>
										</div>
									</el-image>
								</div>
							</div>
						</transition-group>
					</draggable>
				</el-form-item>
				<el-form-item>
					<div class="addB">
						<upload-cos
							style="margin-right: 14px"
							:index="index"
							@upload="upload"
							:videoMaxSize="200"
						></upload-cos>
						<el-button type="primary" icon="el-icon-plus" @click="handleAddText"
							>添加文本</el-button
						>
					</div>
				</el-form-item>
				<el-divider></el-divider>
				<el-form-item label="主推品牌">
					<div class="brandTag">
						<div v-if="selectBrandList && selectBrandList.length">
							<el-tag
								:key="i"
								v-for="(tag, i) in selectBrandList"
								closable
								:disable-transitions="false"
								@close="handleClose(tag)"
								class="tagItem"
							>
								{{ tag.brandParentName }}
							</el-tag>
						</div>
						<el-button
							@click="handleAddBrand"
							type="primary"
							icon="el-icon-plus"
							size="mini"
							>请选择品牌，可多选</el-button
						>
					</div>
				</el-form-item>
				<el-form-item label="主推商品">
					<div class="brandTag">
						<div v-if="selectGoodsList && selectGoodsList.length">
							<el-tag
								:key="i"
								v-for="(tag, i) in selectGoodsList"
								closable
								:disable-transitions="false"
								@close="handleGoodsClose(tag)"
								class="tagItem"
							>
								{{ tag.goodsName }}
							</el-tag>
						</div>
						<el-button
							@click="handleAddProduct"
							type="primary"
							icon="el-icon-plus"
							size="mini"
						>
							请选择商品，可多选
						</el-button>
					</div>
				</el-form-item>
				<el-form-item label="主推档期">
					<div class="brandTag">
						<div v-if="selectGroudList && selectGroudList.length">
							<el-tag
								:key="i"
								v-for="(tag, i) in selectGroudList"
								closable
								:disable-transitions="false"
								@close="handleGroupClose(tag)"
								class="tagItem"
							>
								{{ tag.groupName }}
							</el-tag>
						</div>
						<el-button
							@click="handleAddGroup"
							type="primary"
							icon="el-icon-plus"
							size="mini"
						>
							请选择档期，单选
						</el-button>
						<span class="tips">主推档期只应用于素材中心</span>
					</div>
				</el-form-item>
				<el-divider></el-divider>
				<el-form-item label="状态">
					<el-radio-group v-model="form.status">
						<el-radio :label="1">启用</el-radio>
						<el-radio :label="0">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="有效期" prop="time">
					<el-date-picker
						v-model="form.time"
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
					>
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('form')">确定</el-button>
					<el-button @click="handleCancel">取消</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!-- 品牌选择 -->
		<main-brands-dialog
			:visible.sync="mainBrandsDialog"
			:mainBrandsRow="mainBrandsRow"
			@saveBrand="saveBrand"
		></main-brands-dialog>
		<!-- 商品选择 -->
		<main-products-dialog
			:visible.sync="mainProductsDialog"
			:mainProductsRow="mainProductsRow"
			@saveProduct="saveProduct"
		></main-products-dialog>
		<!-- 档期选择 -->
		<main-groud-dialog
			:visible.sync="mainGroupDialog"
			:mainGroupRow="mainGroupRow"
			@saveGroup="saveGroup"
		></main-groud-dialog>
	</basic-container>
</template>

<script>
import { getSmallImg } from '@/utils/imageTool'
import BasicContainer from '@wg-vue-materials/basic-container'
import uploadCos from '@/components/uploadCos'
import draggable from 'vuedraggable'
import MainBrandsDialog from './MainBrandsDialog'
import MainProductsDialog from './MainProductsDialog'
import MainGroudDialog from './MainGroudDialog'
import moment from 'moment'

import {
	activityContentAdd,
	activityContentDetail,
	activityContentEdit,
} from '@/api/newMaterial'
export default {
	components: {
		BasicContainer,
		uploadCos,
		draggable,
		MainBrandsDialog,
		MainProductsDialog,
		MainGroudDialog,
	},
	// name: 'FormTable',

	data() {
		let validatePass = (rule, value, callback) => {
			if (!this.form.materialContentList.length) {
				callback(new Error('活动素材不能为空'))
			} else if (this.form.materialContentList.length) {
				let arr1 = this.form.materialContentList.every((item) => {
					if (item.type == 'text') {
						return item.text
					} else {
						return true
					}
				})
				if (!arr1) {
					callback(new Error('活动素材文本内容不能为空'))
				} else {
					callback()
				}
			} else {
				callback()
			}
		}
		return {
			moment,
			activityMaterialInfoId: this.$route.params.activityMaterialInfoId,
			id: this.$route.params.id || '',
			formLoading: false,
			mainBrandsDialog: false,
			mainBrandsRow: {},
			mainProductsDialog: false,
			mainProductsRow: {},
			mainGroupDialog: false,
			mainGroupRow: {},
			form: {
				activityMaterialName: '',
				materialContentList: [
					{
						materialContent: '',
						materialType: 'text',
					},
				],
				status: 1,
				time: '',
			},
			// 主推品牌
			selectBrandList: [],
			// 主推档期
			selectGroudList: [],
			// 主推商品
			selectGoodsList: [],
			getSmallImg,
			rules: {
				activityMaterialName: [
					{
						required: true,
						message: '请输入活动名称',
						trigger: ['blur', 'change'],
					},
				],
				materialContentList: [
					{
						required: true,
						validator: validatePass,
						trigger: ['blur', 'change'],
					},
				],
				time: [
					{
						required: true,
						message: '请选择有效期',
						trigger: ['blur', 'change'],
					},
				],
			},
		}
	},
	created() {
		if (this.id) {
			this._activityContentDetail()
		}
	},
	methods: {
		async _activityContentDetail() {
			let params = {
				id: this.id,
			}
			let {
				data: { resultCode, resultData },
			} = await activityContentDetail(params)
			if (resultCode == 0) {
				this.form.activityMaterialName = resultData.activityMaterialName || ''
				if (resultData.brandParentList && resultData.brandParentList.length) {
					this.selectBrandList = JSON.parse(
						JSON.stringify(resultData.brandParentList)
					)
				}
				if (resultData.goodsList && resultData.goodsList.length) {
					this.selectGoodsList = JSON.parse(
						JSON.stringify(resultData.goodsList)
					)
				}

				// 回组主推档期
				if (resultData.goodsGroupId) {
					this.selectGroudList = [
						{
							goodsGroupId: resultData.goodsGroupId,
							groupName: resultData.goodsGroupName,
						},
					]
				}

				if (
					resultData.materialContentList &&
					resultData.materialContentList.length
				) {
					this.form.materialContentList = JSON.parse(
						JSON.stringify(resultData.materialContentList)
					)
				}
				this.form.status = resultData.status
				this.form.time = [
					new Date(resultData.effectivityStartTime),
					new Date(resultData.effectivityEndTime),
				]
			}
		},
		handleCancel() {
			this.$store.dispatch('tagsView/delVisitedView', this.$route).then(() => {
				this.$router.push({
					name: 'activeDetail',
					params: { id: this.activityMaterialInfoId },
				})
			})
		},
		submitForm(formName) {
			this.$refs[formName].validate(async (valid) => {
				if (valid) {
					await this.handleFix()
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		async handleFix() {
			let params = {
				activityMaterialName: this.form.activityMaterialName,
				status: this.form.status,
				effectivityStartTime: moment(this.form.time[0]).valueOf() || '',
				effectivityEndTime: moment(this.form.time[1]).valueOf() || '',
				materialContentList: this.form.materialContentList,
			}
			if (this.id) {
				params.id = this.id
			} else {
				params.activityMaterialInfoId = this.activityMaterialInfoId
			}
			if (this.selectBrandList && this.selectBrandList.length) {
				params.brandParentList = this.selectBrandList.map((item) => {
					return {
						brandParentId: item.brandParentId,
						brandParentName: item.brandParentName,
					}
				})
			}
			if (this.selectGoodsList && this.selectGoodsList.length) {
				params.goodsList = this.selectGoodsList.map((item) => {
					return {
						goodsId: item.goodsId,
						goodsName: item.goodsName,
					}
				})
			}

			// 主推档期
			if (this.selectGroudList && this.selectGroudList.length) {
				params.goodsGroupId = this.selectGroudList[0].goodsGroupId
				params.goodsGroupName = this.selectGroudList[0].groupName
			} else {
				params.goodsGroupId = 0
				params.goodsGroupName = ''
			}

			let {
				data: { resultCode },
			} = this.id
				? await activityContentEdit(params)
				: await activityContentAdd(params)
			console.log(resultCode)
			if (resultCode == 0) {
				if (this.id) {
					this.$message.success('编辑成功')
				} else {
					this.$message.success('新增成功')
				}
				this.$store
					.dispatch('tagsView/delVisitedView', this.$route)
					.then(() => {
						this.$router.push({
							name: 'activeDetail',
							params: { id: this.activityMaterialInfoId },
						})
					})
			}
		},
		handleAddText() {
			this.form.materialContentList.push({
				materialContent: '',
				materialType: 'text',
			})
		},
		deleteImgV(i) {
			this.form.materialContentList.splice(i, 1)
		},
		handleAddBrand() {
			this.mainBrandsRow = JSON.parse(JSON.stringify(this.selectBrandList))
			this.mainBrandsDialog = true
		},
		saveBrand(val) {
			this.selectBrandList = val
		},
		saveGroup(val) {
			this.selectGroudList = val
		},
		handleClose(tag) {
			this.selectBrandList.splice(this.selectBrandList.indexOf(tag), 1)
		},
		handleAddProduct() {
			this.mainProductsRow = JSON.parse(JSON.stringify(this.selectGoodsList))
			this.mainProductsDialog = true
		},
		handleAddGroup() {
			this.mainGroupRow = JSON.parse(JSON.stringify(this.selectGroudList))
			this.mainGroupDialog = true
		},
		saveProduct(val) {
			this.selectGoodsList = val
		},
		handleGoodsClose(tag) {
			this.selectGoodsList.splice(this.selectGoodsList.indexOf(tag), 1)
		},
		handleGroupClose(tag) {
			this.selectGroudList.splice(this.selectGroudList.indexOf(tag), 1)
		},
		upload(val) {
			if (val.type == 'mp4') {
				this.form.materialContentList.push({
					materialContent: val.url,
					materialType: 'video',
				})
			} else {
				this.form.materialContentList.push({
					materialContent: val.url,
					materialType: 'image',
				})
			}
		},
	},
}
</script>
<style lang="scss" scoped>
.form-box {
	padding-left: 8%;
	width: 900px;
	min-width: 900px;
}
.addB {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	width: 650px;
	text-align: right;
	// margin-right: 300px;
}
.forItem {
	margin-bottom: 15px;
	position: relative;
}
.c_image {
	width: 200px;
	height: 200px;
	border-radius: 5px;
	box-shadow: #e6e6e6 0px 0px 7px 1px;
}
.ivbox-icon {
	position: absolute;
	right: 0;
}
.pos {
	position: relative;
}
.brandTag {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
}
.tagItem {
	margin-right: 6px;
	margin-bottom: 6px;
}

.tips {
	font-size: 14px;
	margin-left: 10px;
	color: #979797;
}
</style>

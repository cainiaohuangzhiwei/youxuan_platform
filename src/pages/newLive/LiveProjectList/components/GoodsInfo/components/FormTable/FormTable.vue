<template>
	<basic-container>
		<div v-loading="loading">
			<YxForm
				ref="form"
				:items="item"
				:inline="false"
				:data="formData"
				:labelWidth="'80px'"
				:formAction="formAction"
			>
				<template #shopSikp>
					<el-button
						v-if="formData.groupName.length == 0"
						type="primary"
						@click="handleAward(0)"
						>选择分组</el-button
					>
					<div v-else class="skip">
						<div class="mr20">
							<el-tag
								v-for="(item, index) in formData.groupName"
								:key="index"
								:effect="status != 3 && item.active ? 'dark' : 'plain'"
								:closable="status == 3"
								@click="handleClickTag(item)"
								@close="handleClose(item)"
							>
								{{ item.groupName }}
							</el-tag>
						</div>
						<div v-if="status == 3">
							本场直播共选择商品数量：{{ list.length }}，鼠标拖动可以调整顺序；
						</div>
						<div v-if="status == 2">
							<el-button type="success" @click="handleAward(1)"
								>继续增加分组</el-button
							>
							<el-button type="primary" @click="confirmSubmit(2)"
								>确认，不需要再增加分组</el-button
							>
							<el-button @click="handleClose(item)">取消关联</el-button>
						</div>
					</div>
				</template>
				<template #goodsInfo>
					<div class="draggable">
						<draggable v-model="list" :disabled="status != 3">
							<transition-group>
								<label
									class="wrapper"
									v-for="(item, index) in list"
									:key="index"
								>
									<el-checkbox
										v-if="status != 3"
										class="checkbox"
										v-model="item.checked"
									/>
									<div class="goods">
										<!-- <img class="goods__img" :src="item.goodsImgUrl" alt="" /> -->
										<div class="goods__name">{{ item.goodsName }}</div>
									</div>
								</label>
							</transition-group>
						</draggable>
					</div>
				</template>
			</YxForm>
		</div>
		<SelectedGroupDialog
			:dialogVisible.sync="dialogGroupVisible"
			:itemInfo.sync="selectedGoodsGroup"
		/>
	</basic-container>
</template>

<script>
import { getSmallImg } from '@/utils/imageTool'
import draggable from 'vuedraggable'
import { uploadImageList } from '@/api/image'
import {
	goodsList,
	saveGoods,
	goodsListSort,
	deleteByGoods,
	getLivePlanById,
} from '@/api/livePlan'
import { getYouxuanGoodsList } from '@/api/goodsList'

export default {
	name: 'GoodsInfo',

	components: {
		draggable,
		YxForm: () => import('@wg-vue-materials/yx-form'),
		SelectedGroupDialog: () => import('../../../FormTable/selectedGroupDialog'),
	},

	data() {
		return {
			status: 0,
			loading: false,
			isInitState: true,
			dialogGroupVisible: false,
			selectedGoodsGroup: {},
			list: [],
			item: [
				{
					type: 'uploadImage',
					title: '引流商品',
					dataIndex: 'drainageImage',
					uploadAttributes: {
						limit: 4,
						imageName: 'drainageImage',
						action: this.uploadImageList,
						httpRequest: (file) =>
							this.uploadCertificate(
								file,
								'drainageImage',
								'addSupplierCredentials',
								81
							),
					},
				},
				{
					type: 'custom',
					title: '商城跳转',
					dataIndex: 'shopSikp',
				},
				{
					type: 'custom',
					dataIndex: 'goodsInfo',
				},
			],
			formData: {
				shopSikp: '',
				goodsInfo: '',
				groupName: [],
				goodsGroupId: [],
				drainageImage: [],
			},
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this._goodsListSort(1)
					},
				},
			],
			livePlanId: '',
			imageState: false,
		}
	},

	watch: {
		selectedGoodsGroup() {
			this.status = 2
			this.formData.groupName.push({
				active: false,
				groupName: this.selectedGoodsGroup.groupName,
				goodsGroupId: this.selectedGoodsGroup.goodsGroupId,
			})
			for (let i = 0; i < this.formData.groupName.length; i++) {
				if (
					this.formData.groupName[i].goodsGroupId ==
					this.selectedGoodsGroup.goodsGroupId
				) {
					this.formData.groupName[i].active = true
				} else {
					this.formData.groupName[i].active = false
				}
			}
			this._getYouxuanGoodsList()
		},
	},

	created() {
		this.getLivePlanIdParams()
		this._goodsList(true)
		this._getLivePlanById()
	},

	methods: {
		// 获取直播计划ID
		getLivePlanIdParams() {
			this.livePlanId =
				this.$route.params.livePlanId || this.$route.query.livePlanId || ''
		},

		// 获取引流商品详情
		async _getLivePlanById() {
			const {
				data: { resultCode, resultData },
			} = await getLivePlanById({
				livePlanId: this.livePlanId,
			})
			this.loading = true
			if (resultCode == 0) {
				let imgStr = resultData.drainageImage
					? resultData.drainageImage.split(',')
					: []
				if (imgStr.length === 1) {
					this.formData.drainageImage = imgStr
						? [
								{
									imageUrl: imgStr[0],
									drainageImage: getSmallImg(imgStr[0]) || '',
								},
						  ]
						: []
				} else if (imgStr.length === 2) {
					this.formData.drainageImage = imgStr
						? [
								{
									imageUrl: imgStr[0],
									drainageImage: getSmallImg(imgStr[0]) || '',
								},
								{
									imageUrl: imgStr[1],
									drainageImage: getSmallImg(imgStr[1]) || '',
								},
						  ]
						: []
				} else if (imgStr.length === 3) {
					this.formData.drainageImage = imgStr
						? [
								{
									imageUrl: imgStr[0],
									drainageImage: getSmallImg(imgStr[0]) || '',
								},
								{
									imageUrl: imgStr[1],
									drainageImage: getSmallImg(imgStr[1]) || '',
								},
								{
									imageUrl: imgStr[2],
									drainageImage: getSmallImg(imgStr[2]) || '',
								},
						  ]
						: []
				} else if (imgStr.length === 4) {
					this.formData.drainageImage = imgStr
						? [
								{
									imageUrl: imgStr[0],
									drainageImage: getSmallImg(imgStr[0]) || '',
								},
								{
									imageUrl: imgStr[1],
									drainageImage: getSmallImg(imgStr[1]) || '',
								},
								{
									imageUrl: imgStr[2],
									drainageImage: getSmallImg(imgStr[2]) || '',
								},
								{
									imageUrl: imgStr[3],
									drainageImage: getSmallImg(imgStr[3]) || '',
								},
						  ]
						: []
				}
			}
			this.loading = false
		},

		// 获取商品列表
		async _getYouxuanGoodsList() {
			const params = {
				sortField: '3',
				shelfState: '2',
				selfStatus: '0',
				goodsStatus: 3,
				//brandIdList: [this.selectedGoodsGroup?.brandId],
				goodsGroupIdList: [this.selectedGoodsGroup?.goodsGroupId],
				isSales: 1,
			}
			this.loading = true
			const {
				data: { resultCode, resultData = [] },
			} = await getYouxuanGoodsList(params)
			if (resultCode == 0 && resultData.goodsList.length > 0) {
				this.list = resultData.goodsList.map((item) => {
					return {
						checked: false,
						goodsId: item.goodsId,
						goodsName: item.goodsName,
						goodsGroupId: this.selectedGoodsGroup.goodsGroupId,
						groupName: this.selectedGoodsGroup.groupName,
						goodsImgUrl: item.goodsDefaultImage
							? getSmallImg(item.goodsDefaultImage)
							: '',
					}
				})
			} else {
				this.list = []
			}
			this.loading = false
		},

		// 上传图片
		async uploadCertificate(params, key, name, imageType) {
			const formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: `#${name}`, imageType: imageType })
			)
			formData.append('image', params.file)
			const {
				data: { resultCode, resultData = [] },
			} = await uploadImageList(formData)

			if (resultCode == 0 && resultData.imageList.length > 0) {
				this.formData[key].push(resultData.imageList)
				for (let i = 0; i < this.formData[key].length; i++) {
					const item = this.formData[key][i]
					for (let j = 0; j < item.length; j++) {
						if (item[j].imageUrl) {
							this.formData[key][i][key] = getSmallImg(item[j].imageUrl)
						}
					}
				}
				this.imageState = true
			} else {
				this.imageState = false
				this.$message.error('上传图片失败, 请重新上传')
			}
		},

		// 编辑图片数据处理
		handleEditImageData(item) {
			const arr = []
			if (item.length > 0) {
				for (let i = 0; i < item.length; i++) {
					if (
						Array.isArray(item[i]) ||
						(Object.prototype.toString.call(item[i]) === '[object Object]' &&
							item[i].imageUrl)
					) {
						const imageList = []
						const val = Array.isArray(item[i]) ? item[i][0] : item[i]
						imageList.push(val)
						for (let j = 0; j < imageList.length; j++) {
							arr.push(imageList[j].imageUrl)
						}
					}
				}
			}

			return arr.join(',')
		},

		// 重置表单
		resetForm() {
			this.localVisible = false
			this.$refs.form.$refs.YxForm.resetFields()
			this._getLivePlanById()
		},

		// 保存直播关联商品列表
		async _saveGoods() {
			const livePlanGoods = []
			for (let i = 0; i < this.list.length; i++) {
				if (this.list[i].checked) {
					livePlanGoods.push({
						...this.list[i],
						livePlanId: parseInt(this.livePlanId) || '',
					})
				}
			}

			if (livePlanGoods.length == 0) {
				return this.$message.warning('请选择商品')
			}
			this.loading = true
			const {
				data: { resultCode },
			} = await saveGoods({ livePlanGoods })
			if (resultCode == 0) {
				this._goodsList()
				this.status = 3
			}
			this.loading = false
		},

		// 直播关联商品排序
		async _goodsListSort() {
			let liveGoodsIdList = []
			for (let i = 0; i < this.list.length; i++) {
				if (this.list[i].id) {
					liveGoodsIdList.push(this.list[i].id)
				}
			}
			const params = {
				liveGoodsIdList,
				livePlanId: parseInt(this.livePlanId),
				drainageImage:
					this.formData.drainageImage.length > 0
						? this.handleEditImageData(this.formData.drainageImage)
						: '',
			}
			const {
				data: { resultCode, resultMsg },
			} = await goodsListSort(params)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.resetGoods()
			}
			this.loading = false
		},

		// 分组弹窗
		handleAward(type) {
			if (this.formData.groupName.length == 5) {
				return this.$message.warning(
					'直播栏目最多只能关联5个分组，您已超出5个！'
				)
			}
			if (type == 1) {
				this._saveGoods()
			}
			this._goodsList(false, 1)
		},

		// 直播关联商品列表
		async _goodsList(flag, type) {
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await goodsList({ livePlanId: this.livePlanId })
			if (resultCode == 0) {
				this.list = resultData.liveGoodList.map((item) => {
					return {
						...item,
						checked: true,
					}
				})
				if (flag == true || this.isInitState) {
					this.isInitState = false
					this.status = this.list.length > 0 ? 3 : 0
				} else {
					if (type == 1) {
						this.status = this.list.length > 0 ? 3 : 0
						this.dialogGroupVisible = !this.dialogGroupVisible
					}
				}
				this.formData.groupName = resultData.liveGoodsGroupList
			}
			this.loading = false
		},

		// 删除
		handleClose(item) {
			if (this.status == 3) {
				this._deleteByGoods(item.goodsGroupId)
			} else {
				this.formData.groupName.splice(this.formData.groupName.indexOf(item), 1)
				this.list = []
			}
		},
		//点击对应分组标签
		handleClickTag(groupItem) {
			if (this.status == 3) {
				this._getYouxuanGoodsListAgain(groupItem) //会场id需要后端接口返回出来
			}
		},
		// 逆向编辑时获取商品列表
		async _getYouxuanGoodsListAgain(groupItem) {
			const params = {
				sortField: '3',
				shelfState: '2',
				selfStatus: '0',
				goodsStatus: 3,
				goodsGroupIdList: [groupItem?.goodsGroupId],
				isSales: 1,
			}
			this.loading = true
			const {
				data: { resultCode, resultData = {} },
			} = await getYouxuanGoodsList(params)
			let yxGoodsList = resultData.goodsList || []
			if (resultCode == 0 && yxGoodsList.length > 0) {
				let list = yxGoodsList.map((item) => {
					//判断商品是否已勾选
					let checked = this.list.some((goodsItem) => {
						return (
							goodsItem.goodsGroupId == groupItem.goodsGroupId &&
							goodsItem.goodsId == item?.goodsId
						)
					})
					return {
						checked: checked,
						goodsId: item.goodsId,
						goodsName: item.goodsName,
						goodsGroupId: groupItem.goodsGroupId,
						groupName: groupItem.groupName,
						goodsImgUrl: item.goodsDefaultImage
							? getSmallImg(item.goodsDefaultImage)
							: '',
					}
				})
				this.list = list
				this.status = 2 //选择会场状态
				//选中分组高亮
				for (let i = 0; i < this.formData.groupName.length; i++) {
					if (
						this.formData.groupName[i].goodsGroupId == groupItem.goodsGroupId
					) {
						this.formData.groupName[i].active = true
					} else {
						this.formData.groupName[i].active = false
					}
				}
			} else {
				this.list = []
			}
			this.loading = false
		},
		// 根据分组删除直播关联的商品
		async _deleteByGoods(goodsGroupId) {
			this.$confirm('确定要删除该分组下关联的商品吗？', '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						const {
							data: { resultCode, resultMsg },
						} = await deleteByGoods({
							goodsGroupId,
							livePlanId: this.livePlanId,
						})
						if (resultCode == 0) {
							this._goodsList()
						}
						this.$message({
							message: resultMsg,
							type: resultCode == 0 ? 'success' : 'warning',
						})
					}
				},
			})
		},

		// 取消商品
		confirmSubmit(type) {
			if (type == 2) {
				this._saveGoods()
			} else if (type == 3) {
				this._goodsListSort()
			} else if (type == 4) {
				this.resetGoods()
			}
		},

		// 重置分组商品
		resetGoods() {
			this.list = []
			this.formData.groupName = []
			this.isInitState = true
			this.getLivePlanIdParams()
			this._goodsList(true)
			this._getLivePlanById()
		},

		closeDialog() {
			this.status = 2
			this._getYouxuanGoodsList(true)
		},
	},
}
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
	margin-left: 10px;
}

.mr20 {
	font-size: 14px;
	margin-right: 20px;
}

.ml10 {
	margin-left: 20px;
}

.live_name {
	width: 460px;
	line-height: 16px;
}

.skip {
	display: flex;
}

.draggable {
	clear: both;
	width: 100%;

	.wrapper {
		float: left;
		width: 100px;
		height: 90px;
		position: relative;
		margin: 0 20px 20px 0;

		.checkbox {
			position: absolute;
			right: 0;
			top: -19px;
		}

		.goods {
			position: absolute;
			top: 0;
			left: 0;
			width: 100px;
			text-align: center;

			&__img {
				width: 100px;
				height: 100px;
			}

			&__name {
				background: #ddd;
				padding: 3px;
				width: 100px;
				height: 100px;
				line-height: 1.4;
				text-align: left;
				// white-space: nowrap;
				overflow: hidden;
				margin-top: -10px;
				text-overflow: ellipsis;
			}
		}
	}
}
</style>

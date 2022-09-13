<template>
	<div class="activityAreaFloorDetails">
		<basicContainer>
			<yx-form
				ref="dialog101"
				class="form-box"
				labelWidth="120px"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
				:rules="formRules101"
			>
				<template slot="title1">
					<div class="title">楼层信息</div>
				</template>
				<template slot="sortTip">
					<div>填写规则：1~100正整数, 数字越大优先级越高</div>
				</template>
				<template slot="title2">
					<div class="title">楼层图片信息</div>
				</template>
				<template slot="goodsGroup1">
					<el-autocomplete
						placeholder="请选择分组"
						v-model="formData101.groupName1"
						:fetch-suggestions="querySearchAsync"
						@select="(row) => changeGoodsGroup(row, 1)"
						class="input-with-select"
					>
						<el-button
							@click="setDialog101(1)"
							slot="append"
							icon="el-icon-more"
						></el-button>
					</el-autocomplete>
				</template>
				<template slot="goods1">
					<el-autocomplete
						placeholder="请选择商品"
						v-model="formData101.goodsName1"
						:fetch-suggestions="goodsSearchAsync1"
						@select="(row) => changeGoods(row, 1)"
						class="input-with-select"
					>
						<el-button
							@click="setDialog194(1)"
							slot="append"
							icon="el-icon-more"
						></el-button>
					</el-autocomplete>
				</template>
				<template slot="goodsGroup2">
					<el-autocomplete
						placeholder="请选择分组"
						v-model="formData101.groupName2"
						:fetch-suggestions="querySearchAsync"
						@select="(row) => changeGoodsGroup(row, 2)"
						class="input-with-select"
					>
						<el-button
							@click="setDialog101(2)"
							slot="append"
							icon="el-icon-more"
						></el-button>
					</el-autocomplete>
				</template>
				<template slot="goods2">
					<el-autocomplete
						placeholder="请选择商品"
						v-model="formData101.goodsName2"
						:fetch-suggestions="goodsSearchAsync2"
						@select="(row) => changeGoods(row, 2)"
						class="input-with-select"
					>
						<el-button
							@click="setDialog194(2)"
							slot="append"
							icon="el-icon-more"
						></el-button>
					</el-autocomplete>
				</template>
				<template slot="goodsGroup3">
					<el-autocomplete
						placeholder="请选择分组"
						v-model="formData101.groupName3"
						:fetch-suggestions="querySearchAsync"
						@select="(row) => changeGoodsGroup(row, 3)"
						class="input-with-select"
					>
						<el-button
							@click="setDialog101(3)"
							slot="append"
							icon="el-icon-more"
						></el-button>
					</el-autocomplete>
				</template>
				<template slot="goods3">
					<el-autocomplete
						placeholder="请选择商品"
						v-model="formData101.goodsName3"
						:fetch-suggestions="goodsSearchAsync3"
						@select="(row) => changeGoods(row, 3)"
						class="input-with-select"
					>
						<el-button
							@click="setDialog194(3)"
							slot="append"
							icon="el-icon-more"
						></el-button>
					</el-autocomplete>
				</template>
			</yx-form>
			<Dialog
				:title="dialogTitle101"
				:visible.sync="dialogVisible101"
				:width="dialogWidth101"
				:bottomBtn="dialogBottomBtn101"
			>
				<yx-form
					:inline="true"
					:data="formData123"
					:items="formCfg123"
					:formAction="formAction123"
				>
				</yx-form
				><yx-table
					v-loading="loading102"
					:columns="tableColumns102"
					:pagination="page102"
					:data="tableData102"
				>
					<template slot="goodsSpecId" slot-scope="scope">
						<el-radio
							v-model="formData101.goodsGroupId"
							:label="scope.row.goodsGroupId"
							@change="changeGoodsGroup(scope.row, actIndex)"
							>选择</el-radio
						>
					</template>
				</yx-table>
			</Dialog>
			<Dialog
				:title="dialogTitle194"
				:visible.sync="dialogVisible194"
				:width="dialogWidth194"
				:bottomBtn="dialogBottomBtn194"
			>
				<div>
					<yx-form
						:inline="true"
						:data="formData195"
						:items="formCfg195"
						:formAction="formAction195"
					>
					</yx-form>
					<yx-table
						v-loading="loading196"
						:select="false"
						:selectionChange="selectionGoods"
						:columns="tableColumns196"
						:pagination="page196"
						:data="tableData196"
					>
						<template slot="goodsSpecId" slot-scope="scope">
							<el-radio
								v-model="formData101.goodsId"
								:label="scope.row.goodsId"
								@change="changeGoods(scope.row, actIndex)"
								>选择</el-radio
							>
						</template>
						<template slot="goodsInfo" slot-scope="scope">
							<div class="goods-info-box">
								<el-image
									z-index="2100"
									class="c_image"
									fit="cover"
									:src="getBigImg(scope.row.goodsDefaultImage)"
									:preview-src-list="[getBigImg(scope.row.goodsDefaultImage)]"
								>
									<div slot="error" class="image-slot">
										<i class="el-icon-picture-outline"></i>
									</div>
								</el-image>
								<div v-if="getGoodsDetailByOrganizationSpecId">
									<router-link
										class="goods-info-right"
										:to="`/goods/GoodsDetail/${scope.row.goodsId}/${scope.row.goodsSpecId}`"
									>
										<el-button type="text"
											>货号：{{ scope.row.goodsNumber }}</el-button
										>
										<el-button type="text">{{ scope.row.goodsName }}</el-button>
									</router-link>
								</div>
								<div class="goods-info-right" v-else>
									<p>货号：{{ scope.row.goodsNumber }}</p>
									<p>{{ scope.row.goodsName }}</p>
								</div>
							</div>
						</template>
						<template slot="supplyPrice" slot-scope="scope">
							<div>
								<p
									v-if="scope.row.lowestPrice - scope.row.supplyPrice <= 0"
									class="group-row-bg-red"
								>
									￥{{ numberFormat(scope.row.supplyPrice, 2) }}
								</p>
								<p>￥{{ numberFormat(scope.row.supplyPrice, 2) }}</p>
							</div>
						</template>
						<template slot="lowestPrice" slot-scope="scope">
							<div>
								<p
									v-if="scope.row.highestPrice - scope.row.lowestPrice <= 0"
									class="group-row-bg-red"
								>
									￥{{ numberFormat(scope.row.lowestPrice, 2) }}~{{
										numberFormat(scope.row.highestPrice, 2)
									}}
								</p>
								<p>
									￥{{ numberFormat(scope.row.lowestPrice, 2) }}~{{
										numberFormat(scope.row.highestPrice, 2)
									}}
								</p>
							</div>
						</template>
					</yx-table>
				</div>
			</Dialog>
			<div class="save_button">
				<el-button v-if="!params.floorId" type="primary" @click="submitForm"
					>新增</el-button
				>
				<el-button v-else type="primary" @click="submitForm">提交</el-button>
				<el-button @click="goBack">取消</el-button>
			</div>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import { getBigImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'
import Dialog from '@/components/Dialog'
import YxTable from '@wg-vue-materials/yx-table'
import { getGoodsGroupListByConditionForCMS } from '@/api/goodsGroup'
import { getYouxuanGoodsList } from '@/api/goodsList'
import { numberFormat } from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth'
import {
	addActivityFloor,
	editActivityFloor,
	getActivityFloor,
} from '@/api/yhtPlusCmsActArea'

export default {
	components: {
		BasicContainer,
		YxForm,
		Dialog,
		YxTable,
	},
	props: [],
	data() {
		return {
			getBigImg,
			numberFormat,
			getGoodsDetailByOrganizationSpecId: checkFunctionCode(
				'getGoodsDetailByOrganizationSpecId'
			),
			loading196: false,
			selectedItem: {},
			tableData196: [],
			page196: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getYouxuanGoodsList()
				},
			},
			notGoodsNumber: [],
			tableColumns196: [
				{
					type: 'custom',
					dataIndex: 'goodsSpecId',
				},
				{
					type: 'string',
					dataIndex: 'goodsId',
					title: '商品Id',
				},
				{
					type: 'custom',
					dataIndex: 'goodsInfo',
					title: '商品',
					width: '370px',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场',
				},
				{
					type: 'string',
					dataIndex: 'goodsCategoryName',
					title: '商品分类',
				},
				{
					type: 'custom',
					dataIndex: 'supplyPrice',
					title: '供货价',
				},
				{
					type: 'custom',
					dataIndex: 'lowestPrice',
					title: '建议零售价',
				},
				{
					type: 'amount',
					dataIndex: 'marketPrice',
					title: '市场价',
				},
			],
			dialogTitle194: '添加商品',
			dialogVisible194: false,
			dialogWidth194: '80%',
			dialogBottomBtn194: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible194 = false
					},
				},
			],
			formData195: {
				keyword: '',
				goodsName: '',
				isSales: '',
			},
			formCfg195: [
				{
					type: 'textarea',
					dataIndex: 'keyword',
					placeholder: '请输入货号,货号与货号之间使用英文逗号隔开或者换行',
				},
				{
					type: 'input',
					dataIndex: 'goodsName',
					title: '',
					placeholder: '商品名称',
				},
				{
					type: 'select',
					dataIndex: 'isSales',
					title: '状态',
					label: 'value',
					options: [
						{
							isSales: '',
							value: '全部',
						},
						{
							isSales: 2,
							value: '待售',
						},
						{
							isSales: 1,
							value: '在售',
						},
					],
				},
			],
			formAction195: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getYouxuanGoodsList(true)
					},
					tableId: 102,
				},
			],
			loading102: false,
			dialogTitle101: '选择分组',
			dialogWidth101: '90%',
			dialogVisible101: false,
			actIndex: 1,
			dialogBottomBtn101: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible101 = false
					},
				},
			],
			formData123: {
				groupNameKeyword: '',
				goodsType: 1,
			},
			formCfg123: [
				{
					title: '筛选',
					type: 'input',
					dataIndex: 'groupNameKeyword',
					placeholder: '品牌名称',
				},
				{
					type: 'select',
					title: '营销类型',
					dataIndex: 'goodsType',
					label: 'value',
					options: [
						{
							goodsType: 1,
							value: '品牌营销',
						},
						{
							goodsType: 2,
							value: '专享营销',
						},
					],
				},
			],
			formAction123: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getData102(true)
					},
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'custom',
					dataIndex: 'goodsSpecId',
				},
				{
					type: 'string',
					dataIndex: 'groupName',
					title: '分组名称',
				},
				{
					title: '品牌名称',
					type: 'string',
					dataIndex: 'brandName',
				},
			],
			page102: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData102()
				},
			},
			loading: false,
			params: this.$route.params,
			formData101: {
				floorName: '',
				floorStyle: null,
				sort: '',
				gap: 1,
				floorDetailList1: [],
				skipType1: '',
				skipUrl1: '',
				groupName1: '',
				goodsGroupId: '',
				goodsGroupId1: '',
				floorDetailList2: [],
				skipType2: '',
				skipUrl2: '',
				groupName2: '',
				goodsGroupId2: '',
				floorDetailList3: [],
				skipType3: '',
				skipUrl3: '',
				groupName3: '',
				goodsGroupId3: '',
				goodsId: '',
			},
			formRules101: {
				floorName: [
					{ required: true, message: '请输入楼层名称', trigger: 'blur' },
				],
				floorStyle: [
					{ required: true, message: '请选择楼层样式', trigger: 'change' },
				],
				sort: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入显示顺序'))
							} else if (!/^([1-9][0-9]{0,1}|100)$/.test(value)) {
								callback(new Error('100整数型的显示顺序'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				floorDetailList1: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData101.floorDetailList1.length) {
								callback(new Error('请上传图片!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				skipType1: [
					{ required: true, message: '请选择跳转类型', trigger: 'change' },
				],
				floorDetailList2: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData101.floorDetailList1.length) {
								callback(new Error('请上传图片!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				skipType2: [
					{ required: true, message: '请选择跳转类型', trigger: 'change' },
				],
				floorDetailList3: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData101.floorDetailList1.length) {
								callback(new Error('请上传图片!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				skipType3: [
					{ required: true, message: '请选择跳转类型', trigger: 'change' },
				],
			},
			formCfg101: [
				{
					type: 'custom',
					dataIndex: 'title1',
					unformItem: true,
				},
				{
					type: 'input',
					title: '楼层名称',
					dataIndex: 'floorName',
					placeholder: '请输入楼层名称',
				},
				{
					type: 'select',
					title: '楼层样式',
					dataIndex: 'floorStyle',
					placeholder: '请选择楼层样式',
					label: 'value',
					change: (floorStyle) => {
						this.setFloor(floorStyle)
					},
					options: [
						{
							floorStyle: 1,
							value: '1*1图',
						},
						{
							floorStyle: 2,
							value: '1*2图',
						},
						{
							floorStyle: 3,
							value: '1*3图',
						},
					],
				},
				{
					title: '显示顺序',
					type: 'inputNumber',
					dataIndex: 'sort',
					placeholder: '请输入显示顺序',
				},
				{
					type: 'custom',
					dataIndex: 'sortTip',
				},
				{
					title: '楼层间隔',
					type: 'select',
					dataIndex: 'gap',
					label: 'value',
					options: [
						{
							gap: 1,
							value: '有',
						},
						{
							gap: 2,
							value: '无',
						},
					],
				},
				{
					type: 'custom',
					dataIndex: 'title2',
					unformItem: true,
				},
				{
					type: 'uploadImage',
					title: '弹框图片1',
					dataIndex: 'floorDetailList1',
					hide: true,
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'bigUrl',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'floorDetailList1'),
					},
				},
				{
					title: '图片1跳转类型',
					type: 'radio',
					dataIndex: 'skipType1',
					label: 'value',
					change: () => {
						this.skipTypeChange(1)
					},
					options: [
						{
							skipType1: 1,
							value: '不跳',
						},
						{
							skipType1: 2,
							value: '领券中心',
						},
						{
							skipType1: 4,
							value: '品牌特卖页',
						},
						{
							skipType1: 5,
							value: '小程序',
						},
						{
							skipType1: 6,
							value: 'H5页面',
						},
						{
							skipType1: 7,
							value: '多件促销',
						},
						{
							skipType1: 10,
							value: '商品详情页(新)',
						},
					],
					hide: true,
				},
				{
					title: '选择分组',
					type: 'custom',
					dataIndex: 'goodsGroup1',
					hide: true,
				},
				{
					title: '选择商品',
					type: 'custom',
					dataIndex: 'goods1',
					hide: true,
				},
				{
					title: '跳转路径',
					type: 'input',
					dataIndex: 'skipUrl1',
					hide: true,
				},
				{
					type: 'uploadImage',
					title: '弹框图片2',
					dataIndex: 'floorDetailList2',
					hide: true,
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'bigUrl',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'floorDetailList2'),
					},
				},
				{
					title: '图片2跳转类型',
					type: 'radio',
					dataIndex: 'skipType2',
					label: 'value',
					change: () => {
						this.skipTypeChange(2)
					},
					options: [
						{
							skipType2: 1,
							value: '不跳',
						},
						{
							skipType2: 2,
							value: '领券中心',
						},
						{
							skipType2: 4,
							value: '品牌特卖页',
						},
						{
							skipType2: 5,
							value: '小程序',
						},
						{
							skipType2: 6,
							value: 'H5页面',
						},
						{
							skipType2: 7,
							value: '多件促销',
						},
						{
							skipType2: 10,
							value: '商品详情页(新)',
						},
					],
					hide: true,
				},
				{
					title: '选择分组',
					type: 'custom',
					dataIndex: 'goodsGroup2',
					hide: true,
				},
				{
					title: '选择商品',
					type: 'custom',
					dataIndex: 'goods2',
					hide: true,
				},
				{
					title: '跳转路径',
					type: 'input',
					dataIndex: 'skipUrl2',
					hide: true,
				},
				{
					type: 'uploadImage',
					title: '弹框图片3',
					dataIndex: 'floorDetailList3',
					hide: true,
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'bigUrl',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'floorDetailList3'),
					},
				},
				{
					title: '图片3跳转类型',
					type: 'radio',
					dataIndex: 'skipType3',
					label: 'value',
					change: () => {
						this.skipTypeChange(3)
					},
					options: [
						{
							skipType3: 1,
							value: '不跳',
						},
						{
							skipType3: 2,
							value: '领券中心',
						},
						{
							skipType3: 4,
							value: '品牌特卖页',
						},
						{
							skipType3: 5,
							value: '小程序',
						},
						{
							skipType3: 6,
							value: 'H5页面',
						},
						{
							skipType3: 7,
							value: '多件促销',
						},
						{
							skipType3: 10,
							value: '商品详情页(新)',
						},
					],
					hide: true,
				},
				{
					title: '选择分组',
					type: 'custom',
					dataIndex: 'goodsGroup3',
					hide: true,
				},
				{
					title: '选择商品',
					type: 'custom',
					dataIndex: 'goods3',
					hide: true,
				},
				{
					title: '跳转路径',
					type: 'input',
					dataIndex: 'skipUrl3',
					hide: true,
				},
			],
			optionsValue: [
				{
					skipType: 1,
					value: '不跳',
				},
				{
					skipType: 2,
					value: '领券中心',
				},
				{
					skipType: 4,
					value: '品牌特卖页',
				},
				{
					skipType: 5,
					value: '小程序',
				},
				{
					skipType: 6,
					value: 'H5页面',
				},
				{
					skipType: 7,
					value: '多件促销',
				},
				{
					skipType: 10,
					value: '商品详情页(新)',
				},
			],
			formAction101: [],
		}
	},
	created() {
		if (this.params.floorId) {
			this._getActivityFloor()
		}
	},
	methods: {
		goBack() {
			this.$store.dispatch('tagsView/delVisitedView', this.$route).then(() => {
				this.$router.push({
					path: `/xcx/activityAreaFloor/${this.params.activityId}`,
				})
			})
		},
		// 获取楼层详情
		async _getActivityFloor() {
			let {
				data: { resultCode, resultData },
			} = await getActivityFloor({
				id: this.params.floorId,
			})
			if (resultCode == 0) {
				console.log(resultData)
				this.formData101.floorName = resultData.activityFloorVo.floorName
				this.formData101.floorStyle = resultData.activityFloorVo.floorStyle
				this.formData101.sort = resultData.activityFloorVo.sort
				this.formData101.gap = resultData.activityFloorVo.gap
				this.setFloor(resultData.activityFloorVo.floorStyle)
				resultData.activityFloorVo.details.map((item, index) => {
					this.formData101['skipType' + (index + 1)] = item.skipType
					item.images.bigUrl = getBigImg(item.images.imageUrl)
					this.skipTypeChange(index + 1)
					if (item.skipType == 5 || item.skipType == 6) {
						this.formData101['skipUrl' + (index + 1)] = item.skipUrl
					} else if (item.skipType == 10) {
						this.formData101['goodsGroupId' + (index + 1)] = item.skipUrl
						this.formData101['goodsId' + (index + 1)] = item.skipDesc
						this.formData101['groupName' + (index + 1)] = item.groupName
						this._getYouxuanGoodsListOld(item.skipUrl, item.skipDesc, index + 1)
					} else if (item.skipType == 4) {
						this.formData101['goodsGroupId' + (index + 1)] = item.skipUrl
						this.formData101['groupName' + (index + 1)] = item.groupName
					}
					this.formData101['floorDetailList' + (index + 1)] = [item.images]
				})
			}
		},
		// 商品详情回显
		_getYouxuanGoodsListOld: async function (goodsGroupId, goodsId, index) {
			const {
				data: { resultCode, resultData },
			} = await getYouxuanGoodsList({
				goodsName: '',
				goodsGroupIdList: [goodsGroupId],
				viewType: 3,
				shelfState: 2,
				goodsId,
			})
			if (resultCode == 0 && resultData.goodsList) {
				resultData.goodsList.map((goods) => {
					if (goods.goodsId == goodsId) {
						this.formData101['goodsName' + index] = goods.goodsName
						this.$forceUpdate()
					}
				})
			}
		},
		setDialog194(index) {
			if (!this.formData101[`goodsGroupId${index}`]) {
				return this.$message.error('请选择分组')
			}
			this.actIndex = index
			this.formData101.goodsId = this.formData101[`goodsId${index}`]
			this.dialogVisible194 = true
			this._getYouxuanGoodsList()
		},
		_getYouxuanGoodsList: async function (flag) {
			this.loading196 = true
			let paramJson = this.findSearchParams195(flag)
			if (paramJson.keyword && flag) {
				this._getYouxuanGoodsNumberList()
			}
			const {
				data: { resultCode, resultData },
			} = await getYouxuanGoodsList(paramJson)
			if (resultCode == 0) {
				this.tableData196 = resultData.goodsList
				this.page196.count = resultData.goodsCount
			} else {
				this.page196.count = 0
				this.tableData196 = []
			}
			this.loading196 = false
		},
		findSearchParams195(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page196.currentPage = 1
			}
			const paramJson = Object.assign(this.formData195, {
				goodsGroupIdList: [this.formData101[`goodsGroupId${this.actIndex}`]],
				viewType: 3,
				shelfState: 2,
				length: this.page196.length,
				startIndex: (this.page196.currentPage - 1) * this.page196.length,
			})
			return paramJson
		},
		setDialog101(index) {
			this.actIndex = index
			this.formData101.goodsGroupId = this.formData101[`goodsGroupId${index}`]
			this.dialogVisible101 = true
			this.getData102(true)
		},
		getData102: async function (flag) {
			this.loading102 = true
			let paramJson = this.findSearchParams123(flag)
			const {
				data: { resultCode, resultData },
			} = await getGoodsGroupListByConditionForCMS(paramJson)
			if (resultCode == 0) {
				this.tableData102 = resultData.goodsGroupList
				this.page102.count = resultData.goodsGroupCount
			} else {
				this.tableData102 = []
				this.page102.count = 0
			}
			this.loading102 = false
		},
		findSearchParams123(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			const paramJson = Object.assign(this.formData123, {
				length: this.page102.length,
				goodsGroupStateList: ['1', '2'],
				gcategoryList: ['1'],
				startIndex: (this.page102.currentPage - 1) * this.page102.length,
			})
			return paramJson
		},
		changeGoodsGroup(row, actIndex) {
			this.actIndex = actIndex
			this.formData101[`groupName${this.actIndex}`] = row.groupName
			this.formData101[`goodsGroupId${this.actIndex}`] = row.goodsGroupId
			this.$forceUpdate()
		},
		changeGoods(row, actIndex) {
			this.actIndex = actIndex
			this.formData101[`goodsName${this.actIndex}`] = row.goodsName
			this.formData101[`goodsId${this.actIndex}`] = row.goodsId
			this.$forceUpdate()
		},
		goodsSearchAsync1(queryString = '', cb) {
			if (!this.formData101.goodsGroupId1) {
				cb([])
				return this.$message.error('请选择分组')
			}
			this.goodsSearchAsync(queryString, cb, this.formData101.goodsGroupId1)
		},
		goodsSearchAsync2(queryString = '', cb) {
			if (!this.formData101.goodsGroupId2) {
				cb([])
				return this.$message.error('请选择分组')
			}
			this.goodsSearchAsync(queryString, cb, this.formData101.goodsGroupId2)
		},
		goodsSearchAsync3(queryString = '', cb) {
			if (!this.formData101.goodsGroupId3) {
				cb([])
				return this.$message.error('请选择分组')
			}
			this.goodsSearchAsync(queryString, cb, this.formData101.goodsGroupId3)
		},
		goodsSearchAsync: async function (queryString = '', cb, goodsGroupId) {
			let {
				data: { resultCode, resultData },
			} = await getYouxuanGoodsList({
				goodsGroupIdList: [goodsGroupId],
				viewType: 3,
				shelfState: 2,
				startIndex: 0,
				length: 20,
				groupNameKeyword: queryString,
			})
			if (resultCode == 0) {
				resultData.goodsList.map((item) => {
					item.value = item.goodsName
				})
				cb(resultData.goodsList)
			}
		},
		querySearchAsync: async function (queryString = '', cb) {
			let {
				data: { resultCode, resultData },
			} = await getGoodsGroupListByConditionForCMS({
				goodsGroupStateList: ['1', '2'],
				goodsTypeList: [1, 2],
				gcategoryList: ['1'],
				startIndex: 0,
				length: 20,
				groupNameKeyword: queryString,
			})
			if (resultCode == 0) {
				resultData.goodsGroupList.map((item) => {
					item.value = item.groupName
				})
				cb(resultData.goodsGroupList)
			}
		},
		submitForm() {
			this.$refs.dialog101.$refs.YxForm.validate(async (valid) => {
				if (valid) {
					// 规则校验通过
					let paramJson = {
						activityAreaId: this.params.activityId, // 活动id
						floorName: this.formData101.floorName, // 楼层名称
						floorStyle: this.formData101.floorStyle, // 楼层样式
						sort: this.formData101.sort, // 显示顺序
						gap: this.formData101.gap, // 楼层间隔
						floorDetailList: [], // 图片信息
					}
					// 楼层id
					if (this.params.floorId) {
						paramJson.activityAreaFloorId = this.params.floorId
					}
					for (let index = 1; index <= this.formData101.floorStyle; index++) {
						let imageData = Object.assign(
							{},
							this.formData101[`floorDetailList${index}`][0]
						)
						let floorItem = {}
						floorItem.image = JSON.stringify(imageData)
						if (this.params.activityId && this.params.floorId) {
							floorItem.activityAreaFloorId = this.params.floorId
							floorItem.activityAreaId = this.params.activityId
						}
						floorItem.skipType = this.formData101[`skipType${index}`]
						if (floorItem.skipType == 4) {
							// 品牌特卖页
							floorItem.skipUrl = this.formData101[`goodsGroupId${index}`]
							if (!floorItem.skipUrl) {
								return this.$message.error(`请填写完整的图片${index}信息`)
							}
						} else if (floorItem.skipType == 5 || imageData.skipType == 6) {
							floorItem.skipUrl = this.formData101[`skipUrl${index}`]
							if (!floorItem.skipUrl) {
								return this.$message.error(`请填写完整的图片${index}信息`)
							}
						} else if (floorItem.skipType == 10) {
							floorItem.skipUrl = this.formData101[`goodsGroupId${index}`]
							floorItem.skipDesc = this.formData101[`goodsId${index}`]
							if (!floorItem.skipUrl) {
								return this.$message.error(`请填写完整的图片${index}信息`)
							}
						}
						paramJson.floorDetailList.push(floorItem)
					}
					let res = null
					if (this.params.floorId && this.params.activityId) {
						res = await editActivityFloor(paramJson)
					} else {
						res = await addActivityFloor(paramJson)
					}
					let {
						data: { resultCode, resultMsg },
					} = res
					if (resultCode == 0) {
						this.$message.success(resultMsg)
						this.$store
							.dispatch('tagsView/delVisitedView', this.$route)
							.then(() => {
								this.$router.push({
									path: `/xcx/activityAreaFloor/${this.params.activityId}`,
								})
							})
					}
				}
			})
		},
		async uploadImageHttpRequest(params, name) {
			//上传banner
			let formData = new FormData()
			// formData.append('formId', '#portraitImageFrom')
			formData.append('data', JSON.stringify({ imageType: 74, isPng: 'png' }))
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			if (resultCode == 0) {
				resultData.imageList[0].bigUrl = getBigImg(
					resultData.imageList[0].imageUrl
				)
				this.formData101[name] = resultData.imageList
			}
			this.$forceUpdate()
		},
		skipTypeChange(index) {
			let type = this.formData101[`skipType${index}`]
			let dataIndexArr = []
			if (index == 1) {
				dataIndexArr = ['goodsGroup1', 'goods1', 'skipUrl1']
			} else if (index == 2) {
				dataIndexArr = ['goodsGroup2', 'goods2', 'skipUrl2']
			} else {
				dataIndexArr = ['goodsGroup3', 'goods3', 'skipUrl3']
			}
			this.formCfg101.map((item) => {
				if (dataIndexArr.indexOf(item.dataIndex) != -1) {
					item.hide = true
				}
				if (type == 4) {
					if (
						(item.dataIndex == 'goodsGroup1' && index == 1) ||
						(item.dataIndex == 'goodsGroup2' && index == 2) ||
						(item.dataIndex == 'goodsGroup3' && index == 3)
					) {
						item.hide = false
					}
				} else if (type == 5 || type == 6) {
					if (
						(item.dataIndex == 'skipUrl1' && index == 1) ||
						(item.dataIndex == 'skipUrl2' && index == 2) ||
						(item.dataIndex == 'skipUrl3' && index == 3)
					) {
						item.hide = false
					}
				} else if (type == 10) {
					if (
						((item.dataIndex == 'goodsGroup1' || item.dataIndex == 'goods1') &&
							index == 1) ||
						((item.dataIndex == 'goodsGroup2' || item.dataIndex == 'goods2') &&
							index == 2) ||
						((item.dataIndex == 'goodsGroup3' || item.dataIndex == 'goods3') &&
							index == 3)
					) {
						item.hide = false
					}
				}
			})
		},
		setFloor(floorStyle) {
			let dataIndexArr = [
				'floorDetailList1',
				'skipType1',
				'goodsGroup1',
				'goods1',
				'skipUrl1',
				'floorDetailList2',
				'skipType2',
				'goodsGroup2',
				'goods2',
				'skipUrl2',
				'floorDetailList3',
				'skipType3',
				'goodsGroup3',
				'goods3',
				'skipUrl3',
			]
			this.formCfg101.map((item) => {
				if (dataIndexArr.indexOf(item.dataIndex) != -1) {
					item.hide = true
				}
				if (
					floorStyle >= 1 &&
					(item.dataIndex == 'floorDetailList1' ||
						item.dataIndex == 'skipType1')
				) {
					item.hide = false
				}
				if (
					floorStyle >= 2 &&
					(item.dataIndex == 'floorDetailList2' ||
						item.dataIndex == 'skipType2')
				) {
					item.hide = false
				}
				if (
					floorStyle >= 3 &&
					(item.dataIndex == 'floorDetailList3' ||
						item.dataIndex == 'skipType3')
				) {
					item.hide = false
				}
			})
			this.$forceUpdate()
		},
	},
}
</script>
<style lang="scss" scoped>
.form-box {
	width: 900px;
	margin-left: 20px;
}
.title {
	margin-left: -20px;
	font-size: 18px;
	margin-bottom: 20px;
	font-weight: 700;
}
.save_button {
	width: 100%;
	padding: 20px 0px 20px 50px;
	z-index: 120;
}
.goods-info-box {
	display: flex;
	align-items: center;
	.c_image {
		width: 50px;
		height: 50px;
	}
	.goods-info-right {
		width: 300px;
		margin-left: 10px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		button {
			margin-left: 0;
		}
	}
}
</style>

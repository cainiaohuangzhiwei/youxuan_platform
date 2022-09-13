<template>
	<div class="SearchKeyword">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns102"
				:pagination="page102"
				:data="tableData102"
			>
				<template slot="validTimes" slot-scope="scope">
					<div>
						{{ moment(scope.row.startTime).format('YYYY-MM-DD HH:mm:ss') }} --
						{{ moment(scope.row.endTime).format('YYYY-MM-DD HH:mm:ss') }}
					</div>
				</template>
				<template slot="actCoverUrl" slot-scope="scope">
					<div v-if="scope.row.actCoverUrl">
						<el-image
							class="c_image"
							fit="cover"
							:src="getBigImg(scope.row.actCoverUrl)"
							:preview-src-list="[getBigImg(scope.row.actCoverUrl)]"
						>
							<div slot="error" class="image-slot">
								<i class="el-icon-picture-outline"></i>
							</div>
						</el-image>
					</div>
					<div v-else>-</div>
				</template>
			</yx-table>
			<Dialog
				:title="dialogTitle103"
				:visible="dialogVisible103"
				width="800px"
				@before-close="closeDialog103"
				ref="form"
			>
				<yx-form
					:inline="false"
					ref="formData104"
					:data="formData104"
					:items="formCfg104"
					label-position="right"
					label-width="90px"
					:formAction="formAction104"
					:rules="formRule104"
				>
					<template #chooseLive>
						<el-input
							v-model="chooseLive.livePlanName"
							placeholder="选择直播"
							value-key="livePlanName"
							label="livePlanName"
							@focus="selectLive"
							clearable
							@clear="
								() => {
									chooseLive.chooseLive = ''
									chooseLive.livePlanName = ''
									chooseLive.skipId = ''
									formData104.chooseLive = ''
								}
							"
						>
							<el-button
								slot="append"
								icon="el-icon-more"
								@click="liveDialogVisible = true"
							></el-button>
						</el-input>
					</template>
					<template #chooseCategory>
						<el-input
							v-model="chooseCategory.categoryPlanName"
							placeholder="选择分类"
							value-key="categoryPlanName"
							label="categoryPlanName"
							@focus="selectCategory"
							clearable
							@clear="
								() => {
									chooseCategory.categoryPlanName = ''
									chooseCategory.skipId = ''
									formData104.chooseCategory = ''
								}
							"
						>
							<el-button
								slot="append"
								icon="el-icon-more"
								@click="categoryDialogVisible = true"
							></el-button>
						</el-input>
					</template>
					<template #choosePage>
						<el-input
							v-model="choosePage.pagePlanName"
							placeholder="选择页面"
							value-key="pagePlanName"
							label="pagePlanName"
							@focus="selectPage"
							clearable
							@clear="
								() => {
									choosePage.pagePlanName = ''
									choosePage.skipId = ''
									formData104.choosePage = ''
								}
							"
						>
							<el-button
								slot="append"
								icon="el-icon-more"
								@click="pageDialogVisible = true"
							></el-button>
						</el-input>
					</template>
					<template #chooseGroup>
						<el-input
							v-model="chooseGroup.groupName"
							placeholder="选择分组"
							value-key="groupName"
							label="groupName"
							@focus="selectGroupDialog"
							clearable
							@clear="
								() => {
									chooseGroup.groupName = ''
									chooseGroup.skipId = ''
									formData104.chooseGroup = ''
								}
							"
						>
							<el-button
								slot="append"
								icon="el-icon-more"
								@click="dialogGroupVisible = true"
							></el-button>
						</el-input>
					</template>
					<template #chooseGoods>
						<el-input
							v-model="chooseGoods.goodsName"
							placeholder="选择商品"
							value-key="goodsName"
							label="goodsName"
							@focus="selectGoodsDialog"
							clearable
							@clear="
								() => {
									chooseGoods.goodsName = ''
									chooseGoods.skipSubId = ''
									formData104.chooseGoods = ''
								}
							"
						>
							<el-button
								slot="append"
								icon="el-icon-more"
								@click="selectGoodsDialog"
							></el-button>
						</el-input>
					</template>
					<template #chooseActivity>
						<el-input
							v-model="chooseActivity.activityName"
							placeholder="选择活动"
							value-key="activityName"
							label="activityName"
							@focus="selectActivity"
							clearable
							@clear="
								() => {
									chooseActivity.activityName = ''
									chooseActivity.skipId = ''
									formData104.chooseActivity = ''
								}
							"
						>
							<el-button
								slot="append"
								icon="el-icon-more"
								@click="awardDialog = true"
							></el-button>
						</el-input>
					</template>
					<template #chooseActivity2>
						<el-input
							v-model="chooseActivity2.activityName"
							placeholder="选择活动"
							value-key="activityName"
							label="activityName"
							@focus="selectActivity2"
							clearable
							@clear="
								() => {
									chooseActivity2.activityName = ''
									chooseActivity2.skipId = ''
									formData104.chooseActivity2 = ''
								}
							"
						>
							<el-button
								slot="append"
								icon="el-icon-more"
								@click="awardDialog2 = true"
							></el-button>
						</el-input>
					</template>
				</yx-form>
			</Dialog>
			<!-- 选择直播 -->
			<LiveDialog
				ref="live"
				:visible.sync="liveDialogVisible"
				@liveMethod="liveMethod"
			/>
			<!-- 选择分类 -->
			<CategoryDialog
				ref="category"
				:visible.sync="categoryDialogVisible"
				@categoryMethod="categoryMethod"
			/>

			<!-- 选择鲁班页面弹窗 -->
			<SelectActPath
				ref="page"
				:visible.sync="pageDialogVisible"
				@handleChangeSelectActPath="pageMethod"
				:defaultValue="formData104.fileId"
			/>

			<!-- 选择分组弹框 -->
			<selected-group-dialog
				:dialogVisible.sync="dialogGroupVisible"
				:itemInfo.sync="selectedGoodsGroup"
				@selectedMethods="selectedGoodsGroupMethods"
			></selected-group-dialog>
			<!-- 选择商品弹框 -->
			<selected-group-list-dialog
				:dialogVisible.sync="dialogGroupListVisible"
				:itemInfo.sync="selectedGoodsListGroup"
				:groups.sync="selectedGoodsGroup"
				@selectedMethods="selectedGoodsMethods"
			></selected-group-list-dialog>
			<!-- 选择活动 -->
			<AwardDialog
				ref="award"
				:visible.sync="awardDialog"
				@awardMethod="awardMethod"
			/>
			<!-- 选择活动 - 活动专区-->
			<AwardDialog2
				ref="award2"
				:visible.sync="awardDialog2"
				@awardMethod="awardMethod2"
			/>
		</basicContainer>
	</div>
</template>
<script>
import moment from 'moment'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import LiveDialog from '../LiveDialog'
import CategoryDialog from '../CategoryDialog'
import SelectActPath from '@/components/SelectActPath'
import AwardDialog from '../AwardDialog'
import AwardDialog2 from '../AwardDialog2'
import selectedGroupDialog from '@/components/groupGoods/selectedGroupDialog'
import selectedGroupListDialog from '@/components/groupGoods/selectedGroupListDialog'
import {
	getSearchHotWordsList,
	deleteSearchHotWord,
	saveSearchHotWord,
	getSearchHotWordDetail,
} from '@/api/searchHotWords'
import { uploadImageList } from '@/api/image'
import { getBigImg } from '@/utils/imageTool'
import { getActServerPagesInfo } from '@/api/act-server'
import { throttle } from '@/utils/helper/common'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
		LiveDialog,
		CategoryDialog,
		SelectActPath,
		selectedGroupDialog,
		selectedGroupListDialog,
		AwardDialog,
		AwardDialog2,
	},
	data() {
		return {
			moment,
			getBigImg,
			loading: false,
			formData101: {
				keyWord: '',
				useSceneCode: '',
				startTime: '',
				endTime: '',
			},
			formCfg101: [
				{
					type: 'input',
					title: '热词',
					dataIndex: 'keyWord',
					placeholder: '请输入热词',
				},
				{
					type: 'select',
					title: '应用场景',
					dataIndex: 'useSceneCode',
					label: 'value',
					options: [
						{
							useSceneCode: '',
							value: '全部',
						},
						{
							useSceneCode: 1,
							value: '搜索发现',
						},
						{
							useSceneCode: 2,
							value: '搜索底纹',
						},
						{
							useSceneCode: 3,
							value: '素材中心',
						},
					],
				},
				{
					title: '有效时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
				},
			],
			formAction101: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (!this.loading) this.getData102(true)
					},
				},
				{
					title: '新建热词',
					type: 'success',
					auth: 'saveOrUpdate',
					click: () => {
						this.dialogVisible103 = true
						this.dialogTitle103 = '新建热词'
					},
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					dataIndex: 'word',
					title: '热词',
				},
				{
					type: 'string',
					dataIndex: 'wordType',
					title: '类型',
					customRender: (row) => {
						const arr = ['', '搜索', '跳转']
						return arr[row.wordType]
					},
				},
				{
					type: 'string',
					dataIndex: 'useSceneCodeList',
					title: '应用场景',
					customRender: (row) => {
						const arr = ['搜索发现', '搜索底纹', '素材中心']
						return row.useSceneCodeList.map((code) => arr[code - 1]).join('/')
					},
				},
				{
					title: '活动封面',
					type: 'custom',
					dataIndex: 'actCoverUrl',
					width: '120',
				},
				{
					type: 'string',
					dataIndex: 'sortOrder',
					title: '排序值',
				},
				{
					title: '有效时间',
					type: 'custom',
					dataIndex: 'validTimes',
					width: '290',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '编辑',
							auth: 'saveOrUpdate',
							click: async (row) => {
								this.activeRow = row
								const loading = this.$loading({
									lock: true,
									text: '加载中',
									spinner: 'el-icon-loading',
									background: 'rgba(0, 0, 0, 0.7)',
								})
								const {
									data: { resultData, resultCode },
								} = await getSearchHotWordDetail({
									searchHotWordsId: row.searchHotWordsId,
								})
								if (resultCode == 0) {
									this.switchType(resultData.wordType)
									this.switchActivityType(resultData.skipType)
									if (resultData.wordType == 1 && resultData.skipType == 0) {
										resultData.skipType = 1
									}
									console.log(
										resultData.useScene ? resultData.useScene.split(',') : []
									)
									this.formData104 = {
										searchHotWordsId: resultData.searchHotWordsId,
										word: resultData.word,
										wordType: resultData.wordType,
										actName: resultData.actName,
										activityType: resultData.skipType,
										startTime: resultData.startTime,
										endTime: resultData.endTime,
										useSceneCodeList: resultData.useScene
											? resultData.useScene.split(',').map(Number)
											: [],
										sortOrder: resultData.sortOrder,
										coverImages: resultData.actCoverUrl
											? [
													{
														imageUrl: getBigImg(resultData.actCoverUrl),
														imageUrlTemp: resultData.actCoverUrl,
													},
											  ]
											: [],
										skipId: resultData.skipId,
										skipSubId: resultData.skipSubId,
										chooseActivity: resultData.skipId,
										chooseActivity2: resultData.skipId,
										chooseLive: resultData.skipId,
										chooseCategory: resultData.skipId,
										choosePage: resultData.skipId,
										chooseGroup: resultData.skipId,
										chooseGoods: resultData.skipSubId,
										fileId: 'active_page_' + resultData.skipId,
									}
									this.setSkipName(resultData)
									loading.close()
									this.dialogVisible103 = true
									this.dialogTitle103 = '编辑热词'
								}
								loading.close()
							},
						},
						{
							title: '删除',
							auth: 'deleteById',
							popconfirm: true,
							popconfirmTitle: '确认要删除热词吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: async (row) => {
								this.activeRow = row
								const {
									data: { resultCode, resultMsg },
								} = await deleteSearchHotWord({
									searchHotWordsId: row.searchHotWordsId,
								})
								if (resultCode == 0) {
									this.$message.success(resultMsg)
									this.getData102(true)
								}
							},
						},
					],
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
			// 新建热词弹窗
			dialogTitle103: '新建热词',
			dialogVisible103: false,
			formData104: {
				word: '',
				wordType: 1,
				actName: '',
				activityType: 1,
				startTime: '',
				endTime: '',
				useSceneCodeList: [],
				sortOrder: 10,
				coverImageState: 1,
				coverImages: [],
				coverImagesTips: '(图片尺寸：750 x 280 px)',
				skipSubId: null,
				chooseActivity: '',
				chooseActivity2: '',
				chooseLive: '',
				chooseCategory: '',
				choosePage: '',
				chooseGroup: '',
				chooseGoods: '',
			},
			formCfg104: [
				{
					type: 'input',
					title: '热词',
					dataIndex: 'word',
					maxlength: 20,
				},
				{
					type: 'radio',
					title: '类型',
					dataIndex: 'wordType',
					label: 'value',
					change: (type) => {
						this.switchType(type)
					},
					options: [
						{
							value: '搜索',
							wordType: 1,
						},
						{
							value: '跳转',
							wordType: 2,
						},
					],
				},
				{
					type: 'uploadImage',
					dataIndex: 'coverImages',
					title: '活动封面',
					uploadAttributes: {
						limit: 1,
						imageName: 'imageUrl',
						isEdit: true,
						accept: 'image/jpeg, image/jpg, image/png',
						httpRequest: (file) => this._uploadImageHttpRequest(file),
					},
					hide: true,
				},
				{
					title: '',
					dataIndex: 'coverImagesTips',
					type: 'text',
					hide: true,
				},
				{
					title: '活动名称',
					type: 'input',
					dataIndex: 'actName',
					hide: true,
				},
				{
					type: 'radio',
					title: '跳转类型',
					dataIndex: 'activityType',
					label: 'value',
					hide: true,
					change: (type) => {
						this.switchActivityType(type)
					},
					options: [
						{
							value: '领券中心',
							activityType: 1,
						},
						{
							value: '满折满减',
							activityType: 3,
						},
						{
							value: '品牌特卖',
							activityType: 5,
						},
						{
							value: '商品详情',
							activityType: 6,
						},
						{
							value: '分类商品',
							activityType: 7,
						},
						{
							value: '鲁班活动页面',
							activityType: 8,
						},
						{
							value: '直播广场',
							activityType: 9,
						},
						{
							value: '直播间',
							activityType: 10,
						},
					],
				},
				{
					title: '选择分类',
					type: 'custom',
					dataIndex: 'chooseCategory',
					hide: true,
				},
				{
					title: '选择页面',
					type: 'custom',
					dataIndex: 'choosePage',
					hide: true,
				},
				{
					title: '选择直播',
					type: 'custom',
					dataIndex: 'chooseLive',
					hide: true,
				},
				{
					title: '选择分组',
					type: 'custom',
					dataIndex: 'chooseGroup',
					hide: true,
				},
				{
					title: '选择商品',
					type: 'custom',
					dataIndex: 'chooseGoods',
					hide: true,
				},
				{
					title: '选择活动',
					type: 'custom',
					dataIndex: 'chooseActivity',
					hide: true,
				},
				{
					title: '选择活动',
					type: 'custom',
					dataIndex: 'chooseActivity2',
					hide: true,
				},
				{
					type: 'checkbox',
					title: '应用场景',
					dataIndex: 'useSceneCodeList',
					label: 'value',
					options: [
						{
							value: '搜索发现',
							useSceneCodeList: 1,
						},
						{
							value: '搜索底纹',
							useSceneCodeList: 2,
						},
						{
							value: '素材中心',
							useSceneCodeList: 3,
						},
					],
				},
				{
					title: '排序值',
					type: 'inputNumber',
					dataIndex: 'sortOrder',
					change: (val) => {
						if (!(val >= 1 && val <= 100)) {
							this.formData104.sortOrder = 100
							this.$message.warning('排序值请填写1-100范围内的数值')
						}
						if (String(val).indexOf('.') !== -1) {
							this.formData104.sortOrder = Math.floor(val)
							this.$message.warning('排序值必须为正整数')
						}
					},
				},
				{
					title: '有效时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['选择日期', '选择日期'],
				},
			],
			formAction104: [
				{
					title: '保存',
					type: 'primary',
					click: throttle(async () => {
						let params = this.dealParams()
						if (!params) {
							return this.$message.warning('请填写必填内容或选择必选项')
						}
						if (this.formData104.startTime > this.formData104.endTime) {
							return this.$message.warning('有效时间选择错误')
						}
						const {
							data: { resultCode, resultMsg },
						} = await saveSearchHotWord(params)
						if (resultCode == 0) {
							this.$message.success(resultMsg)
							this.getData102(true)
							this.closeDialog103()
						}
					}, 600),
				},
			],
			formRule104: {
				word: [{ required: true, message: '请填写热词!', trigger: 'blur' }],
				wordType: [{ required: true, message: '请选择类型!', trigger: 'blur' }],
				activityType: [
					{ required: true, message: '请选择跳转类型!', trigger: 'blur' },
				],
				chooseCategory: [
					{ required: true, message: '请选择分类!', trigger: 'blur' },
				],
				choosePage: [
					{ required: true, message: '请选择页面!', trigger: 'blur' },
				],
				chooseLive: [
					{ required: true, message: '请填写直播页面!', trigger: 'blur' },
				],
				chooseGroup: [
					{ required: true, message: '请选择分组!', trigger: 'blur' },
				],
				chooseGoods: [
					{ required: true, message: '请选择商品!', trigger: 'blur' },
				],
				chooseActivity: [
					{ required: true, message: '请选择活动!', trigger: 'blur' },
				],
				chooseActivity2: [
					{ required: true, message: '请选择活动!', trigger: 'blur' },
				],
				useSceneCodeList: [
					{ required: true, message: '请选择应用场景!', trigger: 'blur' },
				],
				sortOrder: [
					{ required: true, message: '请填写排序值!', trigger: 'blur' },
				],
				startTime: [
					{ required: true, message: '请选择有效时间!', trigger: 'blur' },
				],
				endTime: [
					{ required: true, message: '请选择有效时间!', trigger: 'blur' },
				],
			},
			// 选择活动
			awardDialog: false,
			chooseActivity: {
				activityName: '',
				actSaleRewardId: '',
			},
			// 选择活动
			awardDialog2: false,
			chooseActivity2: {
				activityName: '',
				actSaleRewardId: '',
			},
			// 选择商品
			dialogGroupListVisible: false,
			selectedGoodsListGroup: {},
			chooseGoods: {
				goodsName: '',
				skipId: '',
			},
			// 选择分组
			dialogGroupVisible: false,
			selectedGoodsGroup: {},
			chooseGroup: {
				groupName: '',
				skipId: '',
			},
			// 选择分类
			categoryDialogVisible: false,
			chooseCategory: {
				categoryPlanName: '',
				skipId: '',
			},
			// 选择页面
			pageDialogVisible: false,
			choosePage: {
				pagePlanName: '',
				skipId: '',
			},
			// 选择直播
			liveDialogVisible: false,
			chooseLive: {
				livePlanName: '',
				skipId: '',
			},
		}
	},
	mounted() {
		this.getData102(true)
	},
	methods: {
		async getData102(flag) {
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			const {
				data: { resultCode, resultData },
			} = await getSearchHotWordsList(paramJson)
			if (resultCode == 0) {
				this.tableData102 = resultData.searchHotWordsList
				resultData.count > 0 && (this.page102.count = resultData.count)
			}
			this.loading = false
		},
		findSearchParams102(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			const paramJson = Object.assign(this.formData101, {
				pageNum: this.page102.currentPage,
				pageSize: this.page102.length,
			})
			return paramJson
		},
		// 保存选择直播选项数据
		liveMethod(row) {
			this.chooseLive.skipId = row.livePlanId
			this.chooseLive.livePlanName = row.livePlanName
			this.chooseLive.chooseLive = row.livePlanName
			this.formData104.skipId = row.livePlanId
			this.formData104.chooseLive = row.livePlanId
			this.$refs['formData104'].$refs['YxForm'].clearValidate('chooseLive')
		},
		// 弹出选择直播
		selectLive(e) {
			e.target.blur()
			this.liveDialogVisible = true
		},
		// 保存选择分类选项数据
		categoryMethod(row) {
			this.chooseCategory.skipId = row.goodsCategoryFrontId
			this.chooseCategory.categoryPlanName = row.categoryName
			this.chooseCategory.chooseCategory = row.categoryName
			this.formData104.skipId = row.goodsCategoryFrontId
			this.formData104.chooseCategory = row.goodsCategoryFrontId
			this.$refs['formData104'].$refs['YxForm'].clearValidate('chooseCategory')
		},
		// 弹出选择分类
		selectCategory(e) {
			e.target.blur()
			this.categoryDialogVisible = true
		},
		// 保存选择页面选项数据
		pageMethod(row) {
			this.choosePage.skipId = row.actPagesId
			this.choosePage.pagePlanName = row.title
			this.choosePage.choosePage = row.title
			this.formData104.skipId = row.actPagesId
			this.formData104.choosePage = row.actPagesId
			this.formData104.fileId = row.fileId
			this.$refs['formData104'].$refs['YxForm'].clearValidate('choosePage')
		},
		// 弹出选择页面
		selectPage(e) {
			e.target.blur()
			this.pageDialogVisible = true
		},
		// 保存选分组选项数据
		selectGroupDialog(e) {
			e.target.blur()
			this.dialogGroupVisible = true
		},
		// 弹出选择商品
		selectGoodsDialog(e) {
			e && e.target.blur()
			if (!this.chooseGroup.skipId) return this.$message.warning('请先选择分组')
			this.dialogGroupListVisible = true
		},
		// 保存商品分组选择结果
		selectedGoodsGroupMethods(val) {
			this.chooseGroup.groupName = val.groupName
			this.chooseGroup.skipId = val.goodsGroupId
			this.formData104.skipId = val.goodsGroupId
			this.formData104.chooseGroup = val.goodsGroupId
			this.chooseGoods = {
				goodsName: '',
				skipId: '',
			}
			this.$refs['formData104'].$refs['YxForm'].clearValidate('chooseGroup')
		},
		// 保存商品选择结果
		selectedGoodsMethods(e) {
			this.chooseGoods = {
				goodsName: e.goodsName,
				skipId: e.goodsId,
			}
			this.formData104.skipSubId = e.goodsId
			this.formData104.chooseGoods = e.goodsId
			this.$refs['formData104'].$refs['YxForm'].clearValidate('chooseGoods')
		},
		// 保存选择活动选项数据
		selectActivity(e) {
			e.target.blur()
			this.awardDialog = true
		},
		// 保存选择活动选项数据
		selectActivity2(e) {
			e.target.blur()
			this.awardDialog2 = true
		},
		// 弹出选择活动
		awardMethod(row) {
			this.chooseActivity.activityName = row.actName
			this.chooseActivity.skipId = row.actDiscountId
			this.formData104.skipId = row.actDiscountId
			this.formData104.chooseActivity = row.actDiscountId
			this.$refs['formData104'].$refs['YxForm'].clearValidate('chooseActivity')
		},
		// 弹出选择活动 - 活动选择
		awardMethod2(row) {
			this.chooseActivity2.activityName = row.name
			this.chooseActivity2.skipId = row.id
			this.formData104.skipId = row.id
			this.formData104.chooseActivity2 = row.id
			this.$refs['formData104'].$refs['YxForm'].clearValidate('chooseActivity2')
		},
		// 关闭弹窗
		closeDialog103() {
			this.dialogVisible103 = false
			this.formData104 = {
				word: '',
				wordType: 1,
				actName: '',
				activityType: 1,
				startTime: '',
				endTime: '',
				chooseActivity: '',
				chooseActivity2: '',
				useSceneCodeList: [],
				sortOrder: 10,
				coverImageState: 1,
				coverImages: [],
				skipSubId: null,
				coverImagesTips: '(图片尺寸：750 x 280 px)',
				chooseLive: '',
				chooseCategory: '',
				choosePage: '',
				chooseGroup: '',
				chooseGoods: '',
			}
			this.chooseActivity = {
				activityName: '',
				actSaleRewardId: '',
			}
			this.chooseActivity2 = {
				activityName: '',
				actSaleRewardId: '',
			}
			this.chooseGoods = {
				goodsName: '',
				skipId: '',
			}
			this.chooseGroup = {
				groupName: '',
				skipId: '',
			}
			this.chooseCategory = {
				categoryPlanName: '',
				skipId: '',
			}
			this.choosePage = {
				pagePlanName: '',
				skipId: '',
			}
			this.chooseLive = {
				livePlanName: '',
				skipId: '',
			}
			this.switchType(1)
			this.$refs['formData104'].$refs['YxForm'].clearValidate()
		},
		// 切换热词类型
		switchType(type) {
			const showList = {
				actName: true,
				activityType: true,
				coverImages: true,
				coverImagesTips: true,
			}
			this.formCfg104.map((item) => {
				if (showList[item.dataIndex]) {
					if (type === 2) {
						item.hide = false
						this.switchActivityType(this.formData104.activityType)
					} else {
						item.hide = true
						this.switchActivityType(1)
					}
				}
			})
		},
		// 切换活动类型
		switchActivityType(type) {
			let showList = {
				chooseActivity: 'hide',
				chooseActivity2: 'hide',
				chooseGoods: 'hide',
				chooseGroup: 'hide',
				chooseCategory: 'hide',
				choosePage: 'hide',
				chooseLive: 'hide',
			}
			switch (type) {
				case 3:
					showList.chooseActivity = 'show'
					break
				case 4:
					showList.chooseActivity2 = 'show'
					break
				case 5:
					showList.chooseGroup = 'show'
					break
				case 6:
					showList.chooseGoods = 'show'
					showList.chooseGroup = 'show'
					break
				case 7:
					showList.chooseCategory = 'show'
					break
				case 8:
					showList.choosePage = 'show'
					break
				case 10:
					showList.chooseLive = 'show'
					break
				default:
					break
			}
			this.formCfg104.map((item) => {
				if (showList[item.dataIndex] === 'show') {
					item.hide = false
					this.formData104.skipId = null
					this.formData104.skipSubId = null
					Object.assign(this.formData104, this[item.dataIndex])
				} else if (showList[item.dataIndex] === 'hide') {
					item.hide = true
					this.formData104.skipSubId &&
						(this.chooseGoods.skipId = this.chooseGroup.skipId)
					Object.keys(this[item.dataIndex]).forEach((key) => {
						if (key !== 'skipId' && key !== 'skipSubId') {
							this.formData104[key] = null
						}
					})
				}
			})
		},
		// 上传图片
		beforeAvatarUpload(file) {
			if (!/\.(jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)) {
				this.$message.warning('格式不对')
				return false
			} else {
				return file
			}
		},
		// 上传图标图片
		_uploadImageHttpRequest: async function (params) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#addMaterial', imageType: 82 })
			)
			formData.append('file', params.file)
			const res = await uploadImageList(formData)
			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				this.formData104.coverImages.push({
					imageUrl: getBigImg(res.data.resultData.imageList[0].imageUrl),
					imageUrlTemp: res.data.resultData.imageList[0].imageUrl,
				})
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
		// 处理新建/保存热词参数
		dealParams() {
			let {
				searchHotWordsId,
				word,
				wordType,
				activityType,
				skipId,
				skipSubId,
				coverImages,
				actName,
				useSceneCodeList = [],
				sortOrder,
				startTime,
				endTime,
			} = this.formData104
			const actCoverUrl = coverImages.length > 0 && coverImages[0].imageUrlTemp
			if (!word) return false
			if (
				activityType == 3 ||
				activityType == 4 ||
				activityType == 5 ||
				activityType == 6 ||
				activityType == 7 ||
				activityType == 8 ||
				activityType == 10
			) {
				if (!skipId && wordType == 2) {
					return false
				}
			}
			if (!skipSubId && wordType == 2 && activityType == 6) return false
			if (!skipId && activityType == 0 && wordType == 2) return false
			if (!sortOrder) return false
			if (!startTime) return false
			if (!endTime) return false
			const params = {
				searchHotWordsId: searchHotWordsId,
				word: word,
				wordType: wordType,
				skipType: activityType,
				skipId: skipId,
				skipSubId: skipSubId,
				actCoverUrl: actCoverUrl ? actCoverUrl : '',
				actName: actName,
				useSceneCodeList,
				sortOrder: sortOrder,
				startTime: startTime,
				endTime: endTime,
			}
			for (let key in params) {
				if (params[key] == undefined && params[key] == null) {
					delete params[key]
				}
			}
			if (wordType == 1) {
				params.skipType = 0
				delete params.skipId
				delete params.skipSubId
				delete params.actCoverUrl
				delete params.actName
			}
			return params
		},
		// 获取回显的选择名称
		async setSkipName(resultData) {
			const {
				skipType,
				skipId,
				skipSubId,
				detail: { name, goodsName },
			} = resultData
			if (skipType == 3) {
				// 选择活动
				this.chooseActivity = {
					activityName: name,
					actSaleRewardId: skipId,
				}
			} else if (skipType == 4) {
				// 选择分组
				this.chooseActivity2 = {
					activityName: name,
					actSaleRewardId: skipId,
				}
			} else if (skipType == 5) {
				// 选择分组
				this.chooseGroup = {
					groupName: name,
					skipId,
				}
			} else if (skipType == 6) {
				// 选择分组
				this.chooseGroup = {
					groupName: name,
					skipId,
				}
				// 选择商品
				this.chooseGoods = {
					goodsName,
					skipId: skipSubId,
				}
			} else if (skipType == 7) {
				// 选择分类
				this.chooseCategory = {
					categoryPlanName: name,
					skipId,
				}
			} else if (skipType == 8) {
				// 选择页面
				const { data } = await getActServerPagesInfo({
					actPagesId: this.formData104.skipId,
					type: 0,
				})

				this.choosePage = {
					pagePlanName: data.resultData.title,
					skipId,
				}
			} else if (skipType == 10) {
				// 选择直播
				this.chooseLive = {
					livePlanName: name,
					skipId,
				}
			}
		},
	},
}
</script>
<style lang="scss" scope>
.el-radio-group {
	line-height: 42px;
}
.el-dialog__body {
	max-height: none !important;
}
</style>

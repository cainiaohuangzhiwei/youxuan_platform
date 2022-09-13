<template>
	<div>
		<el-dialog
			width="500px"
			:title="title"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<yx-form
				ref="form"
				:inline="false"
				:items="item"
				:data="classifyData"
				:rules="funRules"
				:labelWidth="'110px'"
				:formAction="funAction"
			>
				<template #goodsGroupId>
					<el-autocomplete
						v-model="classifyData.groupName"
						debounce
						placeholder="请输入品牌"
						value-key="groupName"
						label="groupName"
						:fetch-suggestions="_getGoodsGroupListByConditionForCMS"
						@select="handleBrandName"
						@focus="handleFocusBrandName"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="formsDialog = true"
						></el-button>
					</el-autocomplete>
				</template>
				<template #actDiscountId>
					<el-autocomplete
						v-model="classifyData.actName"
						debounce
						placeholder="请输入活动"
						value-key="actName"
						label="actName"
						:fetch-suggestions="_getActDiscountListByCondition"
						@select="handleActNameName"
						@focus="handleFocusActNameName"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="actDialog = true"
						></el-button>
					</el-autocomplete>
				</template>
			</yx-form>
			<!-- 品牌 -->
			<classifyBrand-dialog
				:itemInfo="supplyRow"
				:visible.sync="formsDialog"
				@fatherMethodInit="
					(row) => {
						classifyData.groupName = row.groupName
					}
				"
			/>
			<!-- 活动 -->
			<activity-dialog
				:itemInfo="actRow"
				:visible.sync="actDialog"
				@fatherMethodInit="
					(row) => {
						classifyData.actName = row.actName
					}
				"
			/>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import ClassifyBrandDialog from './ClassifyBrandDialog'
import ActivityDialog from './ActivityDialog'
import { uploadImageList } from '@/api/image'
import { getSmallImg } from '@/utils/imageTool'
import { getGoodsGroupListByConditionForCMS } from '@/api/goodsGroup'
import { getActDiscountListByCondition } from '@/api/yhtPlusCmsAct'
import { addOrUpdateBrandCategoryClassify } from '@/api/yhtPlusWebGoods'
import { isNull } from '@/utils/helper/common'
export default {
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		visible: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: '',
		},
		// 单条信息
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	components: {
		YxForm,
		ClassifyBrandDialog,
		ActivityDialog,
	},
	data() {
		return {
			formsDialog: false,
			actDialog: false,
			counter: [],
			endOrderTimeShow: true,
			classifys: [], // 选择用户列表
			supplyRow: {}, // 当前行选中数据
			actRow: {}, // 当前行选中数据
			supplierList: [],
			item: [
				{
					type: 'input',
					title: '分类名称',
					dataIndex: 'firstClassify',
					placeholder: '请输入分类名称',
				},
				{
					type: 'input',
					title: '排序值',
					dataIndex: 'sort',
					placeholder: '请输入排序值',
				},
				{
					type: 'uploadImage',
					title: '分类图片',
					dataIndex: 'image',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'imageUrl',
						httpRequest: (file) => this.uploadImageHttpRequest(file),
					},
				},
				{
					type: 'select',
					title: '图片跳转位置',
					label: 'value',
					dataIndex: 'transitionState',
					placeholder: '请输入图片跳转位置',
					options: [
						{
							transitionState: 1,
							value: '不跳',
						},
						{
							transitionState: 8,
							value: '领券中心',
						},
						{
							transitionState: 9,
							value: '指定品牌',
						},
						{
							transitionState: 10,
							value: '满减/满折活动专区',
						},
						{
							transitionState: 12,
							value: '小程序直播',
						},
					],
				},
				{
					title: '选择品牌',
					type: 'custom',
					dataIndex: 'goodsGroupId',
				},
				{
					title: '选择活动',
					type: 'custom',
					dataIndex: 'actDiscountId',
				},
			],
			classifyData: {
				goodsGroupId: '', //分组id
				groupName: '', //分组名称
				actDiscountId: '', //活动id
				actName: '', //活动名称
				firstClassify: '',
				sort: '',
				transitionState: '',
				image: [],
			},
			classifyInfo: {},
			funRules: {
				transitionState: [
					{ required: true, message: '请输入跳转位置', trigger: 'blur' },
				],
				firstClassify: [
					{ required: true, message: '请输入分类名称', trigger: 'blur' },
				],
				sort: [{ required: true, message: '请输入排序值', trigger: 'blur' }],
			},
			funAction: [
				{
					title: '确定',
					type: 'primary',
					click: (row) => {
						this.submitForm(row)
					},
				},
			],
		}
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
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
		},
		dialogVisible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.visible = newVlaue
			}
		},
	},
	methods: {
		// 获取分组名称
		handleFocusBrandName() {
			this.classifyData.groupName = ''
		},
		// 操作分组
		handleBrandName(item) {
			this.classifyData.groupName = item.groupName
			this.classifyData.goodsGroupId = item.goodsGroupId
		},
		// 获取活动名称
		handleFocusActNameName() {
			this.classifyData.actName = ''
		},
		// 操作活动
		handleActNameName(item) {
			this.classifyData.actName = item.actName
			this.classifyData.actDiscountId = item.actDiscountId
		},
		// 获取品牌列表
		async _getGoodsGroupListByConditionForCMS(queryString, callback) {
			const paramJson = {
				organizationId:
					(this.$store.state.user.userInfo &&
						this.$store.state.user.userInfo.organizationId) ||
					'',
				goodsGroupStateList: ['1', '2'],
				goodsType: 1,
				gcategoryList: ['1'],
				startIndex: 0,
				length: 20,
				groupNameKeyword: queryString,
			}
			const {
				data: { resultCode, resultData },
			} = await getGoodsGroupListByConditionForCMS(paramJson)

			if (resultCode == 0 && resultData.goodsGroupList.length > 0) {
				callback(resultData.goodsGroupList)
			}
		},
		// 获取活动列表
		async _getActDiscountListByCondition(queryString, callback) {
			const paramJson = {
				openTypeList: ['1', '2'],
				keyword: queryString,
			}
			const {
				data: { resultCode, resultData },
			} = await getActDiscountListByCondition(paramJson)

			if (resultCode == 0 && resultData.actDiscountList.length > 0) {
				callback(resultData.actDiscountList)
			}
		},

		// 回显
		async accDetail(row, type) {
			this.classifyInfo = row
			if (type == 2) {
				this.classifyData.firstClassify = row.firstClassify
					? row.firstClassify
					: ''
				this.classifyData.sort = row.sort ? row.sort : ''
				this.classifyData.transitionState = row.transitionState
				this.classifyData.goodsGroupId =
					row.goodsGroupId && row.goodsGroupId != -1 ? row.goodsGroupId : ''
				this.classifyData.groupName = row.groupName ? row.groupName : ''
				this.classifyData.actDiscountId =
					row.actDiscountId && row.actDiscountId != -1 ? row.actDiscountId : ''

				this.classifyData.actName = row.actName ? row.actName : ''
				this.classifyData.image = [
					{
						imageUrl: row.imageUrl,
					},
				]
			} else {
				this.classifyData = {
					goodsGroupId: '', //分组id
					groupName: '', //分组名称
					actDiscountId: '', //活动id
					actName: '', //活动名称
					firstClassify: '',
					sort: '',
					transitionState: '',
					image: [],
				}
			}
		},

		// 保存
		async submitForm() {
			this.addBrandSave()
		},

		// 新增
		async addBrandSave() {
			const paramsData = {
				firstClassify: this.classifyData.firstClassify,
				sort: this.classifyData.sort,
				transitionState: this.classifyData.transitionState,
			}
			if (this.classifyData.transitionState == 9) {
				paramsData.goodsGroupId = this.classifyData.goodsGroupId
				if (isNull(paramsData.goodsGroupId)) {
					this.$message.warning('请选择品牌')
					return
				}
			}
			if (this.classifyData.transitionState == 10) {
				paramsData.actDiscountId = this.classifyData.actDiscountId
				if (isNull(paramsData.actDiscountId)) {
					this.$message.warning('请选择活动')
					return
				}
			}
			if (
				this.classifyData.image.length > 0 &&
				this.classifyData.image[0].imageList
			) {
				for (let z = 0; z < this.classifyData.image[0].imageList.length; z++) {
					paramsData.image = this.classifyData.image[0].imageList[0]
				}
			}
			if (paramsData.sort > 255) {
				this.$message({
					message: '请输入1-255的排序值!',
					type: 'warning',
				})
				return
			}
			if (this.classifyInfo.id) {
				paramsData.classifyId = this.classifyInfo.id
			}
			const {
				data: { resultCode, resultMsg },
			} = await addOrUpdateBrandCategoryClassify(paramsData)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.resetForm()
				this.$emit('classifiedBrand')
			}
		},
		// 关闭弹窗
		resetForm() {
			this.classifyData.goodsGroupId = ''
			this.classifyData.groupName = ''
			this.classifyData.actDiscountId = ''
			this.classifyData.actName = ''
			this.classifyData.firstClassify = ''
			this.classifyData.sort = ''
			this.classifyData.transitionState = ''
			this.classifyData.image = []
			this.localVisible = false
			this.classifyInfo = {}
			this.$refs.form.$refs.YxForm.resetFields()
		},
		async uploadImageHttpRequest(params) {
			//上传海报
			let formData = new FormData()

			formData.append(
				'data',
				JSON.stringify({ formId: '#anchorImageFrom', imageType: 64 })
			)
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			if (resultCode == 0) {
				this.classifyData.image.push({
					imageUrl: getSmallImg(resultData.imageList[0].imageUrl),
					imageList: resultData.imageList,
				})
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.classifys {
	margin-right: 10px;
	margin-bottom: 10px;
}
.mt10 {
	margin-top: 10px;
}
.dx {
	display: flex;
}
.mt6 {
	margin-top: 6px;
}
.wit150 {
	width: 150px;
}
</style>

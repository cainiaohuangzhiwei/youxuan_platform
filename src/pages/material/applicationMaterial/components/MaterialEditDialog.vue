<template>
	<div>
		<el-dialog
			width="600px"
			:title="`${title}素材应用`"
			:visible.sync="localVisible"
			:before-close="close"
			@open="open"
		>
			<yx-form
				ref="form"
				v-loading="loading"
				labelWidth="140px"
				:items="item"
				:rules="funRules"
				:data="formData"
				:formAction="formAction"
			>
				<template slot="materialList">
					<div v-if="formData.materialType == 1" class="goodsTag">
						<el-button
							@click="handleAddProduct"
							type="primary"
							icon="el-icon-plus"
							size="mini"
							>选择商品素材</el-button
						>
						<div v-if="formData.materialList && formData.materialList.length">
							<el-tag
								:key="tag.activityGoodsMaterialRefId"
								v-for="tag in formData.materialList"
								closable
								:disable-transitions="false"
								@close="handleClose(tag)"
								class="tagItem"
							>
								{{ tag.goodsName }}
							</el-tag>
						</div>
					</div>
					<div v-if="formData.materialType == 2" class="brandTag">
						<el-button
							@click="handleAddBrand"
							type="primary"
							icon="el-icon-plus"
							size="mini"
							>选择会场素材</el-button
						>
						<div v-if="formData.materialList && formData.materialList.length">
							<el-tag
								:key="i"
								v-for="(tag, i) in formData.materialList"
								closable
								:disable-transitions="false"
								@close="handleClose(tag)"
								class="tagItem"
							>
								{{ tag.activityMaterialName }}
							</el-tag>
						</div>
					</div>
				</template>
				<template slot="materialClass">
					<div style="width: 100%">
						<el-select v-model="formData.materialClass" placeholder="请选择">
							<el-option
								v-for="item in materialClassList.filter(
									(item) => item.status == 2
								)"
								:key="item.materialClassifyId"
								:label="item.materialClassifyName"
								:value="item.materialClassifyId"
							>
							</el-option>
						</el-select>
					</div>
				</template>
				<template #materialType>
					<el-radio
						v-model="formData.materialType"
						:label="1"
						:disabled="row.materialUseId"
						@change="materialTypeChange"
						>商品素材</el-radio
					>
					<el-radio
						v-model="formData.materialType"
						@change="materialTypeChange"
						:label="2"
						:disabled="row.materialUseId"
						>活动素材</el-radio
					>
				</template>
			</yx-form>
		</el-dialog>
		<!-- 选择商品 -->
		<main-products-dialog
			:visible.sync="mainProductsDialog"
			:mainProductsRow="mainProductsRow"
			:isAdd="!row.materialUseId"
			@saveProduct="saveMaterial"
		></main-products-dialog>

		<!-- 选择会场 -->
		<main-brands-dialog
			:visible.sync="mainBrandsDialog"
			:mainBrandsRow="mainBrandsRow"
			:isAdd="!row.materialUseId"
			@saveBrand="saveMaterial"
		></main-brands-dialog>
	</div>
</template>

<script>
import { addMaterialToBatch, updateMaterial } from '@/api/newMaterial'
import YxForm from '@wg-vue-materials/yx-form'
import MainBrandsDialog from './MainBrandsDialog'
import MainProductsDialog from './MainProductsDialog'

export default {
	props: {
		//是否显示弹窗
		visible: {
			type: Boolean,
			default: false,
		},
		//弹窗标题
		title: {
			type: String,
			default: '',
		},
		//编辑数据
		row: {
			type: Object,
			default: () => ({}),
		},
		//分类列表
		materialClassList: {
			type: Array,
			default: () => [],
		},
	},

	components: {
		YxForm,
		MainBrandsDialog,
		MainProductsDialog,
	},

	data() {
		let validateSort = (_rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入排序值'))
			} else if (value <= 0 || value > 999 || !/^[0-9]+$/.test(value)) {
				callback(new Error('排序值需大于0并且小于或等于999'))
			} else {
				callback()
			}
		}
		return {
			//是否显示活动素材弹框
			mainBrandsDialog: false,
			//已选活动素材数据
			mainBrandsRow: {},
			//是否显示商品素材弹框
			mainProductsDialog: false,
			//已选商品素材数据
			mainProductsRow: {},
			formData: {
				materialType: 1, //素材类型
				materialList: [], //选择素材
				materialClass: 1, //素材分类
				sort: '', //排序值
				isTopStatus: 2,
				topStartTime: 0,
				topEndTime: 0,
			},
			item: [
				{
					title: '素材类型',
					type: 'custom',
					dataIndex: 'materialType',
				},
				{
					title: '选择素材',
					dataIndex: 'materialList',
					type: 'custom',
				},
				{
					title: '素材分类',
					type: 'custom',
					dataIndex: 'materialClass',
				},
				{
					dataIndex: 'sort',
					title: '排序值',
					maxlength: 3,
				},
				{
					type: 'radio',
					title: '置顶',
					dataIndex: 'isTopStatus',
					label: 'value',
					options: [
						{
							isTopStatus: 2,
							value: '否',
						},
						{
							isTopStatus: 1,
							value: '是',
						},
					],
					change: (value) => {
						const index = this.item.findIndex((item) => item.key === 'time')
						if (value === 1) {
							this.item[index].hide = false
						} else {
							this.item[index].hide = true
						}
					},
				},
				{
					key: 'time',
					title: '置顶有效期',
					type: 'datetimerange',
					dataIndex: ['topStartTime', 'topEndTime'],
					hide: true,
				},
			],
			loading: false,
			formsDialog: false,
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.saveData()
					},
				},
				{
					title: '取消',
					type: 'default',
					cancel: true,
					click: () => {
						this.localVisible = false
					},
				},
			],
			funRules: {
				sort: [{ required: true, validator: validateSort, trigger: 'blur' }],
				materialList: [{ required: true, message: '请选择素材' }],
				materialClass: [{ required: true, message: '请选择分类' }],
				materialType: [{ required: true, message: '请选择类型' }],
			},
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

	methods: {
		//保存
		async saveData() {
			if (!this.formData.materialList?.length) {
				return this.$message({
					message: '请选择素材',
					type: 'error',
				})
			}
			let paramsData = {}
			let materialUseAddDTOList = []
			this.loading = true
			let requestApi = null
			if (this.row.materialUseId) {
				// 编辑
				requestApi = updateMaterial
				let material = this.formData.materialList[0]
				paramsData = {
					materialType: this.formData.materialType, //素材类型
					materialClassifyId: this.formData.materialClass, //素材分类
					sortOrder: this.formData.sort, //排序值
					isTopStatus: this.formData.isTopStatus, // 是否置顶
					goodsGroupId: material.goodsGroupId, //档期id
					goodsId: material.goodsId, //商品id
					materialUseId: this.row.materialUseId, //素材应用id
					sourceId:
						material.activityGoodsMaterialRefId ||
						material.activityMaterialContentId, //素材来源id
				}
			} else {
				// 新增
				requestApi = addMaterialToBatch
				materialUseAddDTOList = this.formData.materialList.map((item) => {
					return {
						materialType: this.formData.materialType, //素材类型
						materialClassifyId: this.formData.materialClass, //素材分类
						sortOrder: this.formData.sort, //排序值
						isTopStatus: this.formData.isTopStatus, // 是否置顶
						topStartTime: this.formData.topStartTime,
						topEndTime: this.formData.topEndTime,
						goodsGroupId: item.goodsGroupId, //档期id
						goodsId: item.goodsId, //商品id
						sourceId:
							item.activityGoodsMaterialRefId || item.activityMaterialContentId, //素材来源id
					}
				})
				paramsData = {
					materialUseAddDTOList,
				}
			}

			// // 是否置顶， 置顶需要添加置顶时间
			if (paramsData.isTopStatus === 1) {
				paramsData.topStartTime = this.formData.topStartTime
				paramsData.topEndTime = this.formData.topEndTime
			} else {
				paramsData.topStartTime = 0
				paramsData.topEndTime = 0
			}
			const res = await requestApi(paramsData)
			const { resultCode = -1, resultData } = res.data
			if (resultCode == 0) {
				if (resultData.errorMessage === 1) {
					this.$message({
						message: '该素材已被关联到素材中心，无须重复关联',
						type: 'error',
					})
					this.loading = false
					return
				}

				if (resultData.errorMessage === 2) {
					this.$message({
						message: '部分素材已关联到素材中心，无须重新关联',
						type: 'error',
					})
					this.loading = false
					return
				}

				if (resultData.errorMessage === 3) {
					this.$confirm(resultData.errorMessageDetail, '', {
						confirmButtonText: '我知道了',
						showCancelButton: false,
						type: 'warning',
					}).then(() => {
						this.localVisible = false
					})
					this.loading = false
					return
				}

				this.$message({
					message: '操作成功',
					type: 'success',
				})
				this.localVisible = false
				this.$emit('initTable')
			}
			this.loading = false
		},
		//关闭弹窗
		close() {
			this.localVisible = false
		},
		//重置form表单数据
		resetForm() {
			this.$refs.form && this.$refs.form.$refs.YxForm.resetFields()
			this.formData = {
				materialType: 1, //素材类型
				materialList: [], //选择素材
				materialClass: 1, //素材分类
				sort: '', //排序值
				isTopStatus: 2, // 是否置顶
			}
		},
		//打开素材应用弹窗
		async open() {
			this.resetForm() //重置数据
			this.loading = false
			// 置顶时间回显
			const timeIndex = this.item.findIndex((formItem) => {
				return formItem.key === 'time'
			})
			if (this.row.materialUseId) {
				//编辑
				this.formData = {
					materialType: this.row.materialType, //素材类型
					materialClass: this.row.materialClassifyId, //素材分类
					sort: this.row.sortOrder, //排序值
					isTopStatus: this.row.isTop ? 1 : 2, // 是否置顶
					topStartTime: this.row.topStartTime || Date.now(),
					topEndTime: this.row.topEndTime || Date.now() + 86400000,
				}

				console.log('this.row>>', this.row)
				if (this.row.isTop) {
					this.item[timeIndex].hide = false
				} else {
					this.item[timeIndex].hide = true
				}

				if (this.row.materialType == 1) {
					// 商品素材
					this.formData.materialList = [
						{
							goodsId: this.row.goodsId,
							goodsName: this.row.goodsName,
							goodsGroupId: this.row.goodsGroupId,
							activityGoodsMaterialRefId: this.row.sourceId,
						},
					]
				} else if (this.row.materialType == 2) {
					// 活动素材
					this.formData.materialList = [
						{
							goodsId: this.row.goodsId,
							activityMaterialName: this.row.activityMaterialName,
							activityMaterialContentId: this.row.sourceId,
						},
					]
				}
			} else {
				this.item[timeIndex].hide = true
			}
		},
		//选择素材类型
		materialTypeChange() {
			this.formData.materialList = []
		},
		//保存素材
		saveMaterial(val) {
			this.formData.materialList = val
		},
		//打开活动素材弹框
		handleAddBrand() {
			this.mainBrandsRow = JSON.parse(
				JSON.stringify(this.formData.materialList)
			)
			console.log('打开活动素材弹框 mainProductsRow', this.mainBrandsRow)
			this.mainBrandsDialog = true
		},
		//打开商品素材弹框
		handleAddProduct() {
			this.mainProductsRow = JSON.parse(
				JSON.stringify(this.formData.materialList)
			)
			console.log('打开商品素材弹框 mainProductsRow', this.mainProductsRow)
			this.mainProductsDialog = true
		},
		//点击tag删除素材
		handleClose(tag) {
			let index = -1
			let materialList = this.formData.materialList
			if (this.formData.materialType == 1) {
				materialList.forEach((item, i) => {
					if (
						item.activityGoodsMaterialRefId == tag.activityGoodsMaterialRefId
					) {
						index = i
					}
				})
			} else if (this.formData.materialType == 2) {
				materialList.forEach((item, i) => {
					if (item.activityMaterialContentId == tag.activityMaterialContentId) {
						index = i
					}
				})
			}
			if (index > -1) {
				materialList.splice(index, 1)
				this.formData = {
					...this.formData,
					materialList,
				}
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.brandTag,
.goodsTag {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	button {
		margin-right: 6px;
	}
}
.tagItem {
	margin-right: 6px;
	margin-bottom: 6px;
}
</style>

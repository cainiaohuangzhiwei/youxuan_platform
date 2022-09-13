<template>
	<div>
		<el-dialog
			width="650px"
			:title="title"
			append-to-body
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="init"
		>
			<div v-loading="loading">
				<yx-form
					ref="form"
					:inline="false"
					:items="item"
					:data="searchData"
					:rules="funRules"
					:labelWidth="'120px'"
					:formAction="dialogAction"
				>
					<template #goodsCategoryIds>
						<div class="goodsCategoryIds-list">
							<span
								v-for="item in goodsCategorySelected"
								:key="item.goodsCategoryId"
								class="item-name"
								>{{ item.goodsCategoryName }}</span
							>
							<el-button @click="select" type="primary">选择类目</el-button>
						</div>
					</template>
				</yx-form>
			</div>
		</el-dialog>
		<category-select
			@fatherMethodInit="
				(arr) => {
					this.getSelected(arr)
				}
			"
			:goodsCategorySelected="goodsCategorySelected"
			:visible.sync="showDialog"
		/>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import CategorySelect from './CategorySelect'
import {
	addGoodsCategoryFront,
	updateGoodsCategoryFront,
} from '@/api/goodsCategoryFront'
import { uploadImageList } from '@/api/image'
import { getBigImg } from '@/utils/imageTool'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: '',
		},
		type: {
			type: String,
			default: '',
		},
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm,
		CategorySelect,
	},
	data() {
		return {
			showDialog: false,
			dialogAction: [
				{
					title: '保存',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
			],
			item: [
				{
					title: '上级分类',
					dataIndex: 'fatherCategoryName',
					placeholder: '请输入上级分类',
					disabled: true,
				},
				{
					title: '分类名称',
					dataIndex: 'categoryName',
					placeholder: '请输入属性名称',
					maxlength: 15,
				},
				{
					type: 'uploadImage',
					title: '分类图片',
					dataIndex: 'categoryImageUrls',
					uploadAttributes: {
						limit: 1,
						imageName: 'imageUrl',
						httpRequest: (file) => this._uploadImageHttpRequest(file),
					},
				},
				{
					type: 'inputNumber',
					title: '排序值',
					dataIndex: 'sort',
					placeholder: '请输入属性名称',
					maxlength: 3,
				},
				{
					type: 'custom',
					title: '关联商品类目',
					dataIndex: 'goodsCategoryIds',
					placeholder: '请选择商品类目',
				},
				{
					type: 'radio',
					title: '类型',
					dataIndex: 'categoryType',
					label: 'value',
					options: [
						{
							categoryType: 1,
							value: '常规类目',
						},
						{
							categoryType: 2,
							value: '活动类目',
						},
					],
					change: (val) => {
						if (val == 1) {
							this.item[6].hide = true
						} else {
							this.item[6].hide = false
						}
					},
				},
				{
					type: 'time',
					title: '展示时间',
					dataIndex: 'showTime',
					hide: true,
					timeAttributes: {
						type: 'datetimerange',
					},
				},
				{
					type: 'radio',
					title: '状态',
					dataIndex: 'enableStatus',
					label: 'value',
					options: [
						{
							enableStatus: 0,
							value: '禁用',
						},
						{
							enableStatus: 1,
							value: '启用',
						},
					],
				},
			],
			searchData: {
				fatherCategoryName: '',
				categoryName: '',
				categoryImageUrls: [],
				sort: 10,
				showTime: [],
				goodsCategoryIds: [],
				categoryType: 1,
				enableStatus: 0,
			},
			goodsCategorySelected: [],
			funRules: {
				categoryName: [
					{ required: true, message: '请填写分类名称!', trigger: 'blur' },
				],
				sort: [{ required: true, message: '请填写排序值!', trigger: 'blur' }],
				categoryImageUrls: [
					{ required: true, message: '请上传图片!', trigger: 'blur' },
				],
				categoryType: [
					{ required: true, message: '请选择类型!', trigger: 'blur' },
				],
				goodsCategoryIds: [
					{ required: true, message: '请选择关联的商品类目!', trigger: 'blur' },
				],
				enableStatus: [
					{ required: true, message: '请选择状态!', trigger: 'blur' },
				],
				showTime: [
					{ required: true, message: '请选择展示时间!', trigger: 'blur' },
				],
			},
			loading: false,
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
		getSelected(arr) {
			this.goodsCategorySelected = arr
			if (arr && arr.length > 0) {
				this.searchData.goodsCategoryIds = arr.map((item) => {
					return item.goodsCategoryId
				})
			} else {
				this.searchData.goodsCategoryIds = []
			}
		},
		select() {
			this.showDialog = true
		},
		// 上传图片
		_uploadImageHttpRequest: async function (params) {
			if (!/^image\/(jpeg|png|jpg|gif)$/.test(params.file.type)) {
				this.$message.error('上传格式为“jpeg|png|jpg|gif”的图片!')
				return
			}
			let imageType =
				params.file.type.indexOf('png') != -1
					? { isPng: 'png', imageType: 82 }
					: { imageType: 82 }

			let formData = new FormData()
			formData.append('data', JSON.stringify(imageType))
			formData.append('file', params.file)
			const res = await uploadImageList(formData)
			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				this.searchData.categoryImageUrls.push({
					imageUrl: getBigImg(res.data.resultData.imageList[0].imageUrl),
					imageUrlTemp: res.data.resultData.imageList[0].imageUrl,
				})
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
		init() {
			if (this.type == 'edit') {
				if (this.itemInfo.validStartTime) {
					this.item[6].hide = false
				} else {
					this.item[6].hide = true
				}
				this.searchData = {
					fatherCategoryName: this.itemInfo.parentName,
					categoryName: this.itemInfo.categoryName,
					categoryImageUrls: [
						{
							imageUrl: getBigImg(this.itemInfo.categoryImageUrl),
							imageUrlTemp: this.itemInfo.categoryImageUrl,
						},
					],
					sort: this.itemInfo.sort,
					showTime: this.itemInfo.validStartTime
						? [this.itemInfo.validStartTime, this.itemInfo.validEndTime]
						: [],
					categoryType: this.itemInfo.categoryType,
					enableStatus: this.itemInfo.enableStatus,
					goodsCategoryIds: [],
				}
				let treeData = this.$store.state.user.treeData
				let arr = this.threeLevel(treeData, [])
				this.getSelected(arr)
			} else {
				this.searchData = {
					fatherCategoryName: this.itemInfo.categoryName,
					categoryName: '',
					categoryImageUrls: [],
					goodsCategoryIds: [],
					sort: 10,
					showTime: [],
					categoryType: 1,
					enableStatus: 0,
				}
			}
		},
		threeLevel(treeData, arr) {
			treeData.forEach((i) => {
				if (i.goodsCategoryChildList && i.goodsCategoryChildList.length > 0) {
					this.threeLevel(i.goodsCategoryChildList, arr)
				}
				this.itemInfo.goodsCategoryIds.forEach((v) => {
					if (i.goodsCategoryId == v) {
						arr.push(i)
					}
				})
			})
			return arr
		},
		// 关闭弹窗
		resetForm() {
			this.searchData = {
				fatherCategoryName: '',
				categoryName: '',
				categoryImageUrls: [],
				sort: 10,
				showTime: [],
				goodsCategoryIds: [],
				categoryType: 1,
				enableStatus: 0,
			}
			this.goodsCategorySelected = []
			this.localVisible = false
		},

		// 保存
		async submitForm() {
			if (this.searchData.sort <= 0 || this.searchData.sort > 100) {
				this.$message({
					message: '"排序值"请输入范围为1~100的整数!',
					type: 'error',
				})
				return
			}
			this.loading = true
			if (this.type == 'new') {
				const {
					data: { resultCode },
				} = await addGoodsCategoryFront(
					Object.assign(this.searchData, {
						categoryLevel: 3,
						validStartTime:
							this.searchData.categoryType == 2
								? new Date(this.searchData.showTime[0]).getTime()
								: '',
						validEndTime:
							this.searchData.categoryType == 2
								? new Date(this.searchData.showTime[1]).getTime()
								: '',
						parentId: this.itemInfo.goodsCategoryFrontId || '',
						categoryImageUrl:
							this.searchData.categoryImageUrls[0].imageUrlTemp || [],
					})
				)
				this.loading = false
				if (resultCode == 0) {
					this.$message({
						message: '新建成功!',
						type: 'success',
					})
					this.resetForm()
					this.$emit('fatherMethodInit')
				}
			} else if (this.type == 'edit') {
				const {
					data: { resultCode },
				} = await updateGoodsCategoryFront(
					Object.assign(this.searchData, {
						categoryLevel: 3,
						validStartTime:
							this.searchData.categoryType == 2
								? new Date(this.searchData.showTime[0]).getTime()
								: '',
						validEndTime:
							this.searchData.categoryType == 2
								? new Date(this.searchData.showTime[1]).getTime()
								: '',
						goodsCategoryFrontId: this.itemInfo.goodsCategoryFrontId,
						categoryImageUrl:
							this.searchData.categoryImageUrls[0].imageUrlTemp || [],
					})
				)
				this.loading = false
				if (resultCode == 0) {
					this.$message({
						message: '编辑成功!',
						type: 'success',
					})
					this.resetForm()
					this.$emit('fatherMethodInit')
				}
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.goodsCategoryIds-list {
	height: 100px;
	overflow: scroll;
	.item-name {
		padding: 0 10px 10px 0;
	}
}
</style>

<template>
	<div>
		<el-dialog
			width="500px"
			:title="titleMap[title]"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<yx-form
				ref="form"
				:inline="false"
				:items="item"
				:data="funData"
				:rules="funRules"
				:labelWidth="'110px'"
				:formAction="funAction"
			>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { getSmallImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'
import { functionalAreaSave, functionalAreaUpdate } from '@/api/functionalAreas'

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
	},

	components: {
		YxForm,
	},

	data() {
		return {
			titleMap: {
				1: '新增选品区',
				2: '新增首页',
				3: '编辑选品区',
				4: '编辑首页',
			},
			item: [
				{
					type: 'input',
					title: '图标名称',
					dataIndex: 'imageName',
					placeholder: '请输入图标名称',
				},
				{
					type: 'inputNumber',
					title: '排序值',
					dataIndex: 'sort',
					placeholder: '请输入排序值',
				},
				{
					type: 'radio',
					title: '是否隐藏',
					dataIndex: 'isHide',
					label: 'value',
					options: [
						{
							isHide: 1,
							value: '是',
						},
						{
							isHide: 0,
							value: '否',
						},
					],
				},
				{
					type: 'uploadImage',
					title: '图标',
					dataIndex: 'imageList',
					uploadAttributes: {
						limit: 1,
						imageName: 'imageList',
						action: this.uploadImageList,
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'imageList'),
					},
				},
				{
					type: 'input',
					title: '跳转位置链接',
					dataIndex: 'jumpLocationLink',
					placeholder: '请输入跳转位置链接',
				},
			],
			flag: true,
			funData: {
				imageName: '',
				sort: '',
				isHide: 0,
				imageList: [],
				jumpLocationLink: '',
			},
			funRules: {
				sort: [{ required: true, message: '请输入排序值', trigger: 'blur' }],
				jumpLocationLink: [
					{ required: true, message: '请输入跳转位置链接', trigger: 'blur' },
				],
				imageList: [{ required: true, message: '请上传图标', trigger: 'blur' }],
			},
			funAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
			],
			queryParam: {},
			uploadImageList:
				'/weeget-infinite-backend-gateway/yhtplus/image/uploadImageList.action',
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
		// 回显
		detail(row) {
			this.flag = true
			const tempArr = Object.assign({}, row)
			const {
				imageName,
				sort,
				isHide,
				imageUrl,
				jumpLocationLink,
				functionalAreaId,
			} = tempArr
			this.funData = {
				imageName: imageName,
				sort: sort,
				isHide: isHide,
				functionalAreaId: functionalAreaId,
				imageList: [
					{
						imageUrl: '',
					},
				],
				jumpLocationLink: jumpLocationLink,
			}
			this.funData.imageList[0].imageList = imageUrl
		},

		// 保存
		async submitForm() {
			const typeMap = {
				1: 1,
				2: 2,
				3: 1,
				4: 2,
			}

			this.funData.groupId = 2
			this.funData.type = typeMap[this.title]

			if (this.funData.sort > 127) {
				return this.$message.error('排序值最大不能大于127')
			}

			if (this.title === 1 || this.title === 2) {
				this.functionalAreaSave()
			} else {
				this.functionalAreaUpdate()
			}
		},

		// 新增
		async functionalAreaSave() {
			const paramsData = Object.assign(
				{},
				{
					imageName: this.funData.imageName,
					sort: this.funData.sort,
					jumpLocationLink: this.funData.jumpLocationLink,
					isHide: this.funData.isHide,
					type: this.funData.type,
					image: this.funData.imageList[0],
					groupId: 2,
					timeStamp: new Date().getTime(),
				}
			)
			delete paramsData.image.imageList
			paramsData.image = JSON.stringify(paramsData.image)

			const res = await functionalAreaSave(paramsData)

			if (res.data.resultCode === 0) {
				this.$message.success(res.data.resultMsg)
				this.resetForm()

				if (this.title === 1) {
					this.$emit('fatherMethodOne')
				} else if (this.title === 2) {
					this.$emit('fatherMethodTwo')
				}
			}
		},

		// 编辑
		async functionalAreaUpdate() {
			let paramsData

			if (this.flag) {
				paramsData = Object.assign(
					{},
					{
						functionalAreaId: this.funData.functionalAreaId,
						imageName: this.funData.imageName,
						sort: this.funData.sort,
						jumpLocationLink: this.funData.jumpLocationLink,
						isHide: this.funData.isHide,
						type: this.funData.type,
						groupId: 2,
					}
				)
			} else {
				paramsData = Object.assign(
					{},
					{
						imageName: this.funData.imageName,
						sort: this.funData.sort,
						functionalAreaId: this.funData.functionalAreaId,
						jumpLocationLink: this.funData.jumpLocationLink,
						isHide: this.funData.isHide,
						type: this.funData.type,
						image: this.funData.imageList[0],
						groupId: 2,
					}
				)

				delete paramsData.image.imageList
				paramsData.image = JSON.stringify(paramsData.image)
			}

			let res = await functionalAreaUpdate(paramsData)

			if (res.data.resultCode === 0) {
				this.$message.success(res.data.resultMsg)
				this.resetForm()
				if (this.title === 3) {
					this.$emit('fatherMethodOne')
				} else {
					this.$emit('fatherMethodTwo')
				}
			}
		},

		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.$refs.form.$refs.YxForm.resetFields()
		},

		// 上传图标
		async uploadImageHttpRequest(params, key) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({
					formId: '#addImageFrom_goods',
					imageType: 63,
					isPng: 'png',
				})
			)
			formData.append('file', params.file)
			const res = await uploadImageList(formData)

			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				this.funData.image = res.data.resultData.imageList[0].imageUrl
				this.funData[key] = res.data.resultData.imageList
				this.funData[key][0][key] = getSmallImg(
					res.data.resultData.imageList[0].imageUrl
				)
				this.flag = false
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>

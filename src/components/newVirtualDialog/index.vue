<template>
	<div>
		<el-dialog
			v-loading="loading"
			width="850px"
			title="虚拟店主管理"
			append-to-body
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="init"
		>
			<yx-form
				labelWidth="100px"
				:data="dialogData"
				:rules="rules"
				:items.sync="dialogCfg"
				:formAction="dialogAction"
			>
			</yx-form>
			<!-- <div class="btn">
				<el-button type="primary" @click="submitForm">确定</el-button>
			</div> -->
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { uploadImageList } from '@/api/image'
import { getSmallImg } from '@/utils/imageTool'
import { virtualShopkeeperSave } from '@/api/newMaterial'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		newVirtualRow: {
			type: Object,
			default: () => ({}),
		},
		paramJson: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm,
	},

	data() {
		return {
			loading: false,
			rowData: {},
			dialogData: {
				virtualShopkeeperName: '', //副标题
				virtualShopkeeperPortraitUrl: [], // 直播栏目图
			},
			dialogCfg: [
				{
					type: 'uploadImage',
					title: '店主图片',
					dataIndex: 'virtualShopkeeperPortraitUrl',
					uploadAttributes: {
						limit: 1,
						imageName: 'virtualShopkeeperPortraitUrl',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'virtualShopkeeperPortraitUrl'),
					},
				},
				{
					type: 'input',
					title: '店主名称',
					dataIndex: 'virtualShopkeeperName',
					maxlength: 30,
					placeholder: '请输入店主名称',
				},
			],
			rules: {
				virtualShopkeeperName: [
					{
						required: true,
						message: '请输入店主名称',
						trigger: 'blur',
					},
				],
				virtualShopkeeperPortraitUrl: [
					{
						required: true,
						message: '请上传店主图片',
						trigger: 'blur',
					},
				],
			},
			dialogAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.saveLivePlan()
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
		newVirtualRow() {},
		localVisible(val) {
			if (val) {
				this.rowData = Object.assign({}, this.newVirtualRow)
				let { virtualShopkeeperPortraitUrl, virtualShopkeeperName } =
					this.rowData || {}
				console.log(
					virtualShopkeeperPortraitUrl,
					virtualShopkeeperName,
					'adfasdfsd====='
				)
				if (virtualShopkeeperPortraitUrl) {
					this.dialogData.virtualShopkeeperPortraitUrl = [
						{
							virtualShopkeeperPortraitUrl: virtualShopkeeperPortraitUrl,
						},
					]
				} else {
					this.dialogData.virtualShopkeeperPortraitUrl = []
				}
				this.dialogData.virtualShopkeeperName = virtualShopkeeperName || ''
			}
		},
	},

	methods: {
		async saveLivePlan() {
			this.loading = true
			console.log(
				this.dialogData,
				this.rowData,
				'this.dialogDatathis.dialogDatathis.dialogData'
			)
			let { id } = this.rowData
			let params = {
				virtualShopkeeperName: this.dialogData.virtualShopkeeperName,
				virtualShopkeeperPortraitUrl: this.dialogData
					.virtualShopkeeperPortraitUrl[0].virtualShopkeeperPortraitUrl,
			}
			if (id) params.id = id
			console.log(params, 'afadfdfdfdfdf')
			let {
				data: { resultCode },
			} = await virtualShopkeeperSave(params)
			this.loading = false
			if (resultCode == 0) {
				this.resetForm()
				this.$emit('pass')
			}
		},
		async uploadImageHttpRequest(params, key, maxSize) {
			const size = params.file.size

			if (maxSize && size >= 1024 * maxSize) {
				this.$message.warning(`图片大小不超过${maxSize}K`)
				this.dialogData[key] = []
				return
			}

			//上传海报
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#addImageFrom_goods', imageType: 81 })
			)
			formData.append('file', params.file)
			let {
				data: { resultData },
			} = await uploadImageList(formData)
			this.dialogData[key] = resultData.imageList
			this.dialogData[key][0][key] = getSmallImg(
				resultData.imageList[0].imageUrl
			)
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.rowData = {}
			this.dialogData.virtualShopkeeperPortraitUrl = []
			this.dialogData.virtualShopkeeperName = ''
		},

		// 确定
		submitForm() {
			if (!this.rowData.brandId) {
				return this.$message.warning('请选择对应会场！')
			}
			this.$emit('fatherMethodInit', this.rowData)
			this.resetForm()
		},
	},
}
</script>

<style lang="scss" scoped>
.mb {
	margin-bottom: 10px;
}
.btn {
	text-align: right;
}
</style>

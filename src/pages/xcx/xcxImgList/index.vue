<template>
	<div class="xcxImgList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData181"
				:items="formCfg181"
				:formAction="formAction181"
			>
			</yx-form>
			<yx-table
				v-loading="loading"
				:select="false"
				:columns="tableColumns182"
				:pagination="page182"
				:data="tableData182"
			>
				<template slot="imageUrl" slot-scope="scope">
					<div>
						<el-image
							:ref="`imageUrl${scope.row.weixinImageId}`"
							class="c_image"
							fit="cover"
							:src="getBigImg(scope.row.imageUrl)"
							:preview-src-list="[getBigImg(scope.row.imageUrl)]"
						>
							<div slot="error" class="image-slot">
								<i class="el-icon-picture-outline"></i>
							</div>
						</el-image>
					</div>
				</template>
			</yx-table>
			<Dialog
				:title="dialogTitle183"
				:visible.sync="dialogVisible183"
				:width="dialogWidth183"
				:bottomBtn="dialogBottomBtn183"
			>
				<yx-form :inline="true" :data="formData184" :items="formCfg184">
				</yx-form>
			</Dialog>
			<Dialog
				title="上传图片"
				:visible.sync="dialogVisible184"
				width="500px"
				:bottomBtn="dialogBottomBtn184"
			>
				<yx-form labelWidth="100px" :data="saveAddImg" :items="formCfg185">
				</yx-form>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import { uploadImageList } from '@/api/image'
import { getWeixinImageList, updateWeixinImage } from '@/api/yhtPlusCmsActivity'
import { refreshWeixinImageList } from '@/api/cmsWeixinImage'
import { getBigImg } from '@/utils/imageTool'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},
	props: [],
	data() {
		return {
			getBigImg,
			dialogVisible184: false,
			formCfg185: [
				{
					type: 'text',
					title: '图片名称',
					dataIndex: 'imageName',
				},
				{
					type: 'uploadImage',
					title: '上传图片',
					dataIndex: 'imageUrlList',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'imageUrlTemp',
						httpRequest: (file) => this._uploadImageHttpRequest(file),
					},
				},
				{
					type: 'text',
					title: '图片描述',
					dataIndex: 'remark',
				},
			],
			dialogBottomBtn184: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this._updateWeixinImage()
					},
				},
			],
			saveAddImg: {},
			loading: false,
			formData181: {
				forwardDocument: '',
			},
			formCfg181: [
				{
					type: 'input',
					title: '位置',
					dataIndex: 'keyword',
					placeholder: '请输入位置',
				},
			],
			formAction181: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getWeixinImageList(true)
					},
				},
				{
					title: '刷新缓存',
					type: 'primary',
					click: () => {
						this._refreshWeixinImageList()
					},
				},
			],
			tableData182: [],
			tableColumns182: [
				{
					type: 'string',
					dataIndex: 'imageName',
					title: '位置',
				},
				{
					type: 'newMap',
					dataIndex: 'imageType',
					title: '图片类型',
					options: [
						['1', '图片'],
						['2', '链接封面图'],
						['3', '海报'],
						['4', '装饰图'],
						['3', '自定义顶部图'],
					],
				},
				{
					type: 'string',
					dataIndex: 'imageItem',
					title: '图片标记',
				},
				{
					type: 'custom',
					dataIndex: 'imageUrl',
					title: '图片',
				},
				{
					type: 'string',
					dataIndex: 'forwardDocument',
					title: '转发文案',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '上传',
							click: (row) => {
								console.log(row)
								row.portraitImageData =
									JSON.parse(JSON.stringify(row.image)) || {}
								if (row.image) {
									row.image.imageUrlTemp =
										(row.image.imageUrl && getBigImg(row.image.imageUrl)) || ''
								}
								this.saveAddImg = Object.assign(
									{
										imageUrlList: [row.image],
									},
									row
								)
								console.log(this.saveAddImg, '13123123')
								this.dialogVisible184 = true
								// this.setAnchorState(row)
							},
							customRender: (action, row) => {
								action.hide = row.imageItem == 18
								return action
							},
						},
						{
							title: '编辑文案',
							click: (row) => {
								this.formData184 = Object.assign({}, row)
								this.dialogVisible183 = true
							},
							customRender: (action, row) => {
								action.hide =
									row.imageType != 2 &&
									row.imageItem != 19 &&
									row.imageItem != 20
								return action
							},
						},
						{
							title: '查看',
							click: ({ weixinImageId }) => {
								this.$refs[`imageUrl${weixinImageId}`].showViewer = true
							},
							customRender: (action, row) => {
								action.hide = !row.imageUrl
								return action
							},
						},
					],
				},
			],
			page182: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getWeixinImageList()
				},
			},
			dialogTitle183: '编辑文案',
			dialogWidth183: '500px',
			dialogVisible183: false,
			dialogBottomBtn183: [
				{
					title: '取 消',
					click: () => {
						this.dialogVisible183 = false
					},
				},
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.saveDocument()
					},
				},
			],
			formData184: {
				forwardDocument: '',
			},
			formCfg184: [
				{
					type: 'textarea',
					title: '小程序文案',
					dataIndex: 'forwardDocument',
					placeholder: '请输入小程序文案',
				},
			],
		}
	},

	created() {
		this._getWeixinImageList()
	},

	methods: {
		_updateWeixinImage: async function () {
			console.log(this.saveAddImg)
			let paramJson = {
				remark: this.saveAddImg.remark,
				weixinImageId: this.saveAddImg.weixinImageId,
			}
			if (!this.saveAddImg.imageUrlList[0].imageUrl) {
				this.$message.error('请上传图片')
				return
			}
			paramJson.portraitImageData = this.saveAddImg.portraitImageData
			const {
				data: { resultCode, resultMsg },
			} = await updateWeixinImage(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible184 = false
				this._getWeixinImageList()
			}
		},
		// 上传图标图片
		_uploadImageHttpRequest: async function (params) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#addMaterial', imageType: 35 })
			)
			formData.append('file', params.file)
			const res = await uploadImageList(formData)
			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				this.saveAddImg.portraitImageData = res.data.resultData.imageList[0]
				this.saveAddImg.imageUrlList.push({
					imageUrlTemp: getBigImg(res.data.resultData.imageList[0].imageUrl),
					imageUrl: res.data.resultData.imageList[0].imageUrl,
				})
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
		_refreshWeixinImageList: async function () {
			const {
				data: { resultCode, resultMsg },
			} = await refreshWeixinImageList()
			if (resultCode == 0) {
				this.$message.success(resultMsg)
			}
		},
		saveDocument: async function () {
			if (!this.formData184.forwardDocument) {
				this.$message({
					message: '请填写文案',
					type: 'warning',
				})
				return
			}
			const {
				data: { resultCode, resultMsg },
			} = await updateWeixinImage({
				weixinImageId: this.formData184.weixinImageId,
				forwardDocument: this.formData184.forwardDocument,
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible183 = false
				this._getWeixinImageList()
			}
		},
		_getWeixinImageList: async function (flag) {
			this.loading = true
			let paramJson = this.findSearchParams182(flag)
			const {
				data: { resultCode, resultData },
			} = await getWeixinImageList(paramJson)
			if (resultCode == 0) {
				this.tableData182 = resultData.weixinImageList
				this.page182.count = resultData.count
			}
			this.loading = false
		},
		findSearchParams182(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page182.currentPage = 1
			}
			const paramJson = Object.assign(this.formData181, {
				length: this.page182.length,
				startIndex: (this.page182.currentPage - 1) * this.page182.length,
			})
			return paramJson
		},
	},
}
</script>

<template>
	<div class="bannerList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
			</yx-form>
			<yx-table
				v-loading="loading"
				:columns="tableColumns102"
				:pagination="page102"
				:data="tableData102"
			>
			</yx-table>
			<Dialog
				:title="dialogTitle105"
				:visible.sync="dialogVisible105"
				:width="dialogWidth105"
				:bottomBtn="dialogBottomBtn105"
			>
				<yx-form
					ref="dialog106"
					labelWidth="100px"
					:data="formData106"
					:items="formCfg106"
					:rules="formRules106"
					v-loading="fixLoading"
				>
					<template slot="goodsGroup">
						<el-input
							v-model="formData106.brandParentName"
							placeholder="选择品牌"
							value-key="brandParentName"
							label="brandParentName"
							@focus="selectGroup"
						>
							<el-button
								slot="append"
								icon="el-icon-more"
								@click="showDialog101"
							></el-button>
						</el-input>
					</template>
				</yx-form>
			</Dialog>
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
					v-loading="loading103"
					:columns="tableColumns103"
					:pagination="page103"
					:data="tableData103"
				>
					<template slot="brandParentId" slot-scope="scope">
						<el-radio
							v-model="formData106.brandParentId"
							:label="scope.row.brandParentId"
							@change="changeGoodsGroup(scope.row)"
							>选择</el-radio
						>
					</template>
				</yx-table>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import moment from 'moment'
import { getBigImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'
import {
	materialSourcePage,
	materialSourceDelete,
	materialSourceSave,
	materialSourceUpdate,
} from '@/api/promotionMaterials'
import { getBrandParentList } from '@/api/yhtPlusWebGoods'
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
			limit: 9,
			fixLoading: false,
			sourceId: '',
			loading103: false,
			tableData103: [],
			tableColumns103: [
				{
					width: 200,
					type: 'custom',
					dataIndex: 'brandParentId',
				},
				{
					dataIndex: 'brandParentId',
					title: '品牌ID',
					customRender: (row) => {
						if (row.brandParentId) {
							return row.brandParentId
						} else {
							return '-'
						}
					},
				},
				{
					dataIndex: 'brandParentName',
					title: '品牌中文名称',
					customRender: (row) => {
						if (row.brandParentName) {
							return row.brandParentName
						} else {
							return '-'
						}
					},
				},
				{
					dataIndex: 'brandParentEnglishName',
					title: '品牌英文名称',
					customRender: (row) => {
						if (row.brandParentEnglishName) {
							return row.brandParentEnglishName
						} else {
							return '-'
						}
					},
				},
			],
			page103: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			dialogTitle101: '选择品牌',
			dialogWidth101: '90%',
			dialogVisible101: false,
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
				keyword: '',
				brandParentId: '',
			},
			formCfg123: [
				{
					title: '品牌名称',
					type: 'input',
					dataIndex: 'keyword',
					placeholder: '品牌名称',
				},
				{
					title: '品牌ID',
					type: 'input',
					dataIndex: 'brandParentId',
					placeholder: '品牌ID',
				},
			],
			formAction123: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init(true)
					},
				},
			],
			uploadImageList: '/yhtplus/webImport/importCusServiceTrusteeship.action',
			dialogTitle105: '新增素材',
			dialogWidth105: '600px',
			dialogVisible105: false,
			dialogBottomBtn105: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog106.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveAddActivityList()
								// this.dialogVisible105 = false
							}
						})
					},
				},
			],
			getBigImg,
			loading: false,
			formData101: {
				brandParentId: '',
				goodsNumber: '',
				brandParentName: '',
			},
			formCfg101: [
				{
					type: 'input',
					title: '关联的品牌ID',
					dataIndex: 'brandParentId',
					placeholder: '关联的品牌ID',
				},
				{
					type: 'input',
					title: '品牌名称',
					dataIndex: 'brandParentName',
				},
				{
					type: 'input',
					title: '关联的商品货号',
					dataIndex: 'goodsNumber',
					placeholder: '关联的商品货号',
				},
			],
			formAction101: [
				{
					title: '搜索',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData102(true)
					},
					tableId: 102,
				},
				{
					title: '新增素材',
					type: 'success',
					auth: '',
					click: () => {
						this.dialogVisible105 = '新增素材'
						this.formCfg106[2].uploadAttributes.limit = 9 //物料处理方式
						this.formData106 = {
							goodsNumber: '',
							activityImage: [],
							brandParentId: '',
							brandParentName: '',
						}
						this.sourceId = ''
						this.$nextTick(() => {
							this.$refs.dialog106.$refs.YxForm.clearValidate()
						})
						this.dialogVisible105 = true
					},
					dialogId: 103,
				},
			],
			formData106: {
				goodsNumber: '',
				brandParentId: '',
				activityImage: [],
				brandParentName: '',
			},
			formCfg106: [
				{
					title: '选择品牌',
					type: 'custom',
					dataIndex: 'goodsGroup',
				},
				{
					type: 'input',
					title: '商品货号',
					dataIndex: 'goodsNumber',
					placeholder: '请输入商品货号',
				},
				{
					type: 'uploadImage',
					title: '图片素材',
					dataIndex: 'activityImage',
					uploadAttributes: {
						limit: 9,
						isEdit: true,
						imageName: 'activityImage',
						httpRequest: (file) => this.uploadImageHttpRequest(file, 3145728),
					},
				},
			],
			formRules106: {
				activityImage: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData106.activityImage.length) {
								callback(new Error('请上传图片!'))
							} else {
								callback()
							}
						},
						trigger: ['blur', 'change'],
					},
				],
				goodsGroup: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData106.brandParentId) {
								callback(new Error('请选择指定品牌!'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
			},
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					dataIndex: 'brandParentId',
					title: '品牌ID',
				},
				{
					type: 'string',
					dataIndex: 'goodsNumber',
					title: '商品货号',
					customRender: (row) => {
						if (row.goodsNumber) {
							return row.goodsNumber
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'brandParentName',
					title: '品牌名称',
					customRender: (row) => {
						if (row.brandParentName) {
							return row.brandParentName
						} else {
							return '-'
						}
					},
				},
				{
					type: 'image',
					dataIndex: 'imageBigUrl',
					title: '图片',
				},
				{
					type: 'string',
					dataIndex: 'addTime',
					title: '添加时间',
					customRender: (row) => {
						return moment(row.addTime).format('YYYY-MM-DD')
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '删除',
							auth: '',
							popconfirm: true,
							popconfirmTitle: '确认要删除该素材吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._delActBanner(row)
							},
						},
						{
							title: '编辑',
							auth: '',
							dialogId: 103,
							click: (row) => {
								this.dialogTitle105 = '编辑素材'
								this.handleEdit(row)
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
		}
	},

	created() {
		this.getData102(true)
	},

	methods: {
		getLun() {
			return 8
		},
		selectGroup(e) {
			e.target.blur()
			this.showDialog101()
		},
		changeGoodsGroup(row) {
			this.formData106 = Object.assign(this.formData106, row)
		},
		showDialog101() {
			this.formData123.keyword = ''
			this.formData123.brandParentId = ''
			this.init(true)
			this.dialogVisible101 = true
		},
		// 搜索条件
		findSearchParams(flag) {
			console.log(12344)
			// 当前页的条数开始
			if (flag) {
				this.page103.currentPage = 1
			}

			const paramJson = Object.assign(this.formData123, {
				length: this.page103.length,
				startIndex: (this.page103.currentPage - 1) * this.page103.length,
			})

			return paramJson
		},
		// 获取品牌品类
		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading103 = true
			const {
				data: { resultCode, resultData },
			} = await getBrandParentList(paramJson)
			this.loading103 = false
			console.log(resultData, 'resultDataresultData')
			if (resultCode == 0 && resultData.brandParentList.length > 0) {
				this.tableData103 = resultData.brandParentList
				this.page103.count = resultData.count
			} else {
				this.page103.count = 0
				this.tableData103 = []
			}
		},
		async uploadImageHttpRequest(params, maxSize) {
			const size = params.file.size
			if (maxSize && size > maxSize) {
				this.$message.warning(`图片大小不超过${maxSize}K`)
				this.formData['activityImage'] = []
				return
			}
			//上传海报
			let formData = new FormData()

			formData.append(
				'data',
				JSON.stringify({ formId: '#portraitImageFrom', imageType: 34 })
			)
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			console.log(resultCode, resultData)
			if (resultCode == 0) {
				// this.$refs.dialog106 && this.$refs.dialog106.resetFields()
				// this.formData106.activityImage = resultData.imageList
				// this.formData106.activityImage[0].activityImage = getBigImg(
				// 	resultData.imageList[0].imageUrl
				// )
				this.formData106.activityImage.push({
					imageUrl: resultData.imageList[0].imageUrl,
					activityImage: getBigImg(resultData.imageList[0].imageUrl),
				})
				this.$message.success('上传成功')
			}
			// this.$forceUpdate()
		},
		saveAddActivityList: async function () {
			this.fixLoading = true
			console.log(this.formData106, '123123123123')
			let params = {}
			if (!this.sourceId) {
				if (
					this.formData106.activityImage &&
					this.formData106.activityImage.length
				) {
					params.sourceList = this.formData106.activityImage.map((item) => {
						return {
							brandParentId: this.formData106.brandParentId,
							goodsNumber: this.formData106.goodsNumber,
							materialPath: item.activityImage,
							brandParentName: this.formData106.brandParentName,
						}
					})
				}
			} else {
				params.goodsNumber = this.formData106.goodsNumber
				params.brandParentId = this.formData106.brandParentId
				params.sourceId = this.sourceId
				if (
					this.formData106.activityImage &&
					this.formData106.activityImage.length
				) {
					console.log(this.formData106.activityImage, '4546546')
					params.materialPath = this.formData106.activityImage[0].activityImage
				}
			}
			console.log(params, 'yyyyyyyy')
			let {
				data: { resultCode },
			} = await (this.sourceId
				? materialSourceUpdate(params)
				: materialSourceSave(params))
			this.fixLoading = false
			if (resultCode == 0) {
				this.$message.success('保存成功')
				this.getData102(true)
				this.dialogVisible105 = false
			}
		},
		_delActBanner: async function ({ sourceId }) {
			let {
				data: { resultCode, resultMsg },
			} = await materialSourceDelete({ sourceId: sourceId })
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.getData102()
			}
		},
		async getData102(flag) {
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			const {
				data: { resultCode, resultData },
			} = await materialSourcePage(paramJson)
			if (resultCode == 0) {
				resultData.records.map((item) => {
					item.imageBigUrl = getBigImg(item.materialPath)
				})
				this.tableData102 = resultData.records
				this.page102.count = resultData.total
			} else {
				this.tableData102 = []
				this.page102.count = 0
			}
			this.loading = false
		},
		findSearchParams102(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			const paramJson = Object.assign(this.formData101, {
				pageSize: this.page102.length,
				pageNum: this.page102.currentPage,
			})
			return paramJson
		},
		handleEdit(row) {
			this.formData106.brandParentId = ''
			this.formCfg106[2].uploadAttributes.limit = 1 //物料处理方式
			this.formData106.activityImage = [
				{
					activityImage: getBigImg(row.materialPath),
				},
			]
			this.sourceId = row.sourceId
			this.formData106.goodsNumber = row.goodsNumber
			this.formData106.brandParentId = row.brandParentId
			this.formData106.brandParentName = row.brandParentName
			this.dialogVisible105 = true
		},
	},
}
</script>
<style lang="scss" scope>
.upload-box {
	display: flex;
	.template {
		margin-right: 20px;
		height: 32px;
	}
}
.actBanner-page-url {
	width: 120px;
}
</style>

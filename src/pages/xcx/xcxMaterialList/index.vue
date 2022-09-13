<template>
	<div class="xcxMaterialList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData121"
				:items="formCfg121"
				:formAction="formAction121"
			>
			</yx-form>
			<yx-table
				:select="true"
				:selectionChange="selectionChange"
				v-loading="loading"
				:columns="tableColumns122"
				:pagination="page122"
				:data="tableData122"
			>
				<template slot="imageList" slot-scope="scope">
					<div>
						<el-image
							v-if="scope.row.imageList && scope.row.imageList.length"
							class="c_image"
							fit="cover"
							:src="getBigImg(scope.row.imageList[0].imageUrl)"
						>
							<div slot="error" class="image-slot">
								<i class="el-icon-picture-outline"></i>
							</div>
						</el-image>
						<p v-if="scope.row.imageList && scope.row.imageList.length >= 2">
							(共{{ scope.row.imageList.length }}张图片)
						</p>
					</div>
				</template>
				<template slot="releaseState" slot-scope="scope">
					<div>
						<el-tag v-if="scope.row.releaseState == 1">已发布</el-tag>
						<el-tag type="info" v-else-if="scope.row.releaseState == 2"
							>未发布</el-tag
						>
						<span v-else>-</span>
					</div>
				</template>
			</yx-table>
			<Dialog
				:title="dialogTitle123"
				:visible.sync="dialogVisible123"
				:width="dialogWidth123"
				:bottomBtn="dialogBottomBtn123"
			>
				<yx-form
					ref="dialog124"
					labelWidth="100px"
					:data="formData124"
					:items="formCfg124"
					:formAction="formAction124"
					:rules="formRules124"
				>
					<template slot="brandName">
						<el-autocomplete
							placeholder="请选择会场"
							v-model="formData124.brandName"
							:fetch-suggestions="querySearchAsync"
							@select="changeBrandId"
							class="input-with-select"
						>
							<el-button
								@click="openBrandDialog"
								slot="append"
								icon="el-icon-more"
							></el-button>
						</el-autocomplete>
					</template>
				</yx-form>
			</Dialog>
			<Dialog
				:title="dialogTitle125"
				:visible.sync="dialogVisible125"
				:width="dialogWidth125"
				:bottomBtn="dialogBottomBtn125"
			>
				<yx-form
					:inline="true"
					:data="formData126"
					:items="formCfg126"
					:formAction="formAction126"
				>
				</yx-form>
				<yx-table
					v-loading="loading127"
					:columns="tableColumns127"
					:pagination="page127"
					:data="tableData127"
				>
					<template slot="brandId" slot-scope="scope">
						<el-radio
							v-model="formData124.brandId"
							:label="scope.row.brandId"
							@change="changeBrandId(scope.row)"
							>选择
						</el-radio>
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
import { getBigImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'
import {
	getEvaluationMaterialListByCondition,
	releaseOrDelEvaluationMaterial,
	addEvaluationMaterial,
	editEvaluationMaterial,
} from '@/api/yhtPlusCmsEvaluationMaterial'
import { supplierAccountNumberList } from '@/api/yhtPlusCmsSupplierAccountNumber'
import { getBrandList } from '@/api/brand'
import { getSensitiveWordFilteringList } from '@/api/systemConfiguration'

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
			loading: false,
			selectedList: [],
			formData121: {
				supplierAccountNumberId: 0,
				isBrand: 0,
				isSelection: 0,
				releaseState: 0,
				keyword: '',
			},
			formCfg121: [
				{
					title: '商家',
					type: 'select',
					dataIndex: 'supplierAccountNumberId',
					placeholder: '',
					label: 'supplierName',
					options: [
						{
							supplierAccountNumberId: 0,
							supplierName: '全部',
						},
					],
				},
				{
					type: 'select',
					title: '是否关联会场',
					dataIndex: 'isBrand',
					placeholder: '请输入是否关联会场',
					label: 'value',
					options: [
						{
							isBrand: 0,
							value: '全部',
						},
						{
							isBrand: 1,
							value: '是',
						},
						{
							isBrand: 2,
							value: '否',
						},
					],
				},
				{
					type: 'select',
					title: '是否标记选品',
					dataIndex: 'isSelection',
					placeholder: '请输入是否标记选品',
					label: 'value',
					options: [
						{
							isSelection: 0,
							value: '全部',
						},
						{
							isSelection: 1,
							value: '是',
						},
						{
							isSelection: 2,
							value: '否',
						},
					],
				},
				{
					type: 'select',
					title: '状态',
					dataIndex: 'releaseState',
					placeholder: '请输入状态',
					label: 'value',
					options: [
						{
							releaseState: 0,
							value: '全部',
						},
						{
							releaseState: 1,
							value: '已发布',
						},
						{
							releaseState: 2,
							value: '未发布',
						},
					],
				},
				{
					title: '',
					type: 'input',
					dataIndex: 'keyword',
					placeholder: '品牌名称/评论人',
				},
			],
			formAction121: [
				{
					title: '搜索',
					type: 'primary',
					auth: '',
					click: () => {
						this._getEvaluationMaterialListByCondition(true)
					},
				},
				{
					title: '批量取消',
					type: 'primary',
					auth: '',
					click: () => {
						this.operateEvaluation(2)
					},
				},
				{
					title: '批量发布',
					type: 'primary',
					auth: '',
					click: () => {
						this.operateEvaluation(1)
					},
				},
				{
					title: '批量删除',
					type: 'primary',
					auth: '',
					click: () => {
						this.operateEvaluation(0)
					},
				},
				{
					title: '新增素材',
					auth: '',
					type: 'warning',
					dialogId: 123,
					click: () => {
						this.dialogTitle123 = '新增素材'
						this.formData124 = {
							brandName: '',
							brandId: '',
							content: '',
							addMaterialBanner: [],
							addMaterialPoster: [],
							evaluationPeopleName: '',
							releaseState: 1,
						}
						this.dialogVisible123 = true
						this.$nextTick(() => {
							this.$refs.dialog124.$refs.YxForm.clearValidate()
						})
					},
				},
				{
					title: '导入素材',
					type: 'warning',
					auth: '',
					click: () => {
						this.$router.push({
							path: `importMaterial`,
						})
					},
				},
			],
			tableData122: [],
			tableColumns122: [
				{
					type: 'string',
					dataIndex: 'evaluationMaterialId',
					title: '评论ID',
				},
				{
					type: 'string',
					dataIndex: 'brandParentName',
					title: '品牌名称',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场名称',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
					customRender: (row) => {
						if (row.supplierName) {
							return row.supplierName
						} else if (row.sourceType) {
							this.sourceTypeMap(row.sourceType)
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'content',
					title: '内容',
					width: '300px',
				},
				{
					type: 'image',
					dataIndex: 'evaluationPeopleImgUrlTable',
					title: '评价人头像',
					width: 120,
				},
				{
					type: 'custom',
					dataIndex: 'imageList',
					title: '图片素材',
					width: 120,
				},
				{
					type: 'string',
					dataIndex: 'evaluationPeopleName',
					title: '评价人名称',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'string',
					dataIndex: 'clerkName',
					title: '最后修改人',
				},
				{
					type: 'date',
					dataIndex: 'modifyTime',
					title: '修改时间',
				},
				{
					type: 'string',
					dataIndex: 'isBrand',
					title: '是否关联会场',
					customRender: (row) => {
						return row.releaseState == 1 ? '是' : '否'
					},
				},
				{
					type: 'string',
					dataIndex: 'isSelection',
					title: '是否标记选品',
					customRender: (row) => {
						return row.isSelection == 1 ? '是' : '否'
					},
				},
				{
					type: 'custom',
					dataIndex: 'releaseState',
					title: '状态',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '删除',
							auth: 'editEvaluationMaterial',
							popconfirm: true,
							popconfirmTitle: '确定删除该素材',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this.delEvaluationMaterial(row)
							},
						},
						{
							title: '取消发布',
							auth: 'editEvaluationMaterial',
							click: (row) => {
								this._releaseOrDelEvaluationMaterial(row)
							},
							customRender: (action, row) => {
								action.title =
									row.releaseState == 1
										? '取消发布'
										: row.releaseState == 2
										? '发布'
										: ''
								return action
							},
						},
						{
							title: '编辑',
							auth: 'editEvaluationMaterial',
							dialogId: 123,
							click: (row) => {
								this.updateEvaluationMaterialInfo(row)
							},
						},
					],
				},
			],
			page122: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getEvaluationMaterialListByCondition()
				},
			},
			dialogTitle123: '新增素材',
			dialogWidth123: '800px',
			dialogVisible123: false,
			dialogBottomBtn123: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog124.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveEvaluationMaterial()
								// this.dialogVisible123 = false
							}
						})
					},
				},
			],
			formData124: {
				brandName: '',
				brandId: '',
				content: '',
				materialImage: '',
				imageList: [],
				evaluationPeopleName: '',
				releaseState: '',
			},
			formRules124: {
				content: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入内容'))
							} else if (this.sensitiveWordMap['小程序素材评价']) {
								let flag = false
								this.sensitiveWordMap['小程序素材评价'].map((item) => {
									if (value.indexOf(item) > -1) {
										callback(
											new Error(
												`【素材内容】内出现敏感词【${item}】，请修改后再保存`
											)
										)
										flag = true
										return false
									}
								})
								if (!flag) {
									callback()
								}
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				brandName: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData124.brandId) {
								callback(new Error('选择会场'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
			},
			formCfg124: [
				{
					type: 'custom',
					title: '选择会场',
					dataIndex: 'brandName',
					placeholder: '请输入商家名称',
				},
				{
					type: 'textarea',
					title: '内容',
					dataIndex: 'content',
					placeholder: '请输入内容',
				},
				{
					type: 'uploadImage',
					title: '评论人头像',
					dataIndex: 'addMaterialBanner',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'addMaterialBanner',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'addMaterialBanner'),
					},
				},
				{
					type: 'uploadImageDraggable',
					title: '图片素材',
					dataIndex: 'addMaterialPoster',
					uploadAttributes: {
						limit: 9,
						imageName: 'addMaterialPoster',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'addMaterialPoster'),
					},
				},
				{
					title: '评论人名称',
					type: 'input',
					dataIndex: 'evaluationPeopleName',
					placeholder: '请输入评论人名称',
				},
				{
					title: '发布状态',
					type: 'radio',
					dataIndex: 'releaseState',
					label: 'value',
					options: [
						{
							releaseState: 1,
							value: '发布',
						},
						{
							releaseState: 2,
							value: '不发布',
						},
					],
				},
			],
			formAction124: [],
			dialogTitle125: '选择会场',
			dialogWidth125: '800px',
			dialogVisible125: false,
			dialogBottomBtn125: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible125 = false
					},
				},
			],
			formData126: {
				keyword: '',
			},
			formCfg126: [
				{
					type: 'input',
					title: '筛选',
					dataIndex: 'keyword',
					placeholder: '会场名称',
				},
			],
			formAction126: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						this._getBrandList(true)
					},
				},
			],
			loading127: false,
			tableData127: [],
			tableColumns127: [
				{
					type: 'custom',
					dataIndex: 'brandId',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场',
				},
			],
			page127: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getBrandList()
				},
			},
			sensitiveWordMap: {},
		}
	},

	created() {
		this._supplierAccountNumberList()
		this._getSensitiveWordFilteringList()
	},

	methods: {
		saveEvaluationMaterial: async function () {
			let paramJson = {
				brandName: this.formData124.brandName,
				brandId: this.formData124.brandId,
				content: this.formData124.content,
				evaluationPeopleName: this.formData124.evaluationPeopleName,
				releaseState: this.formData124.releaseState,
				imageList: [],
			}
			if (this.formData124.addMaterialBanner.length) {
				paramJson.materialImage = this.formData124.addMaterialBanner[0]
				delete paramJson.materialImage.addMaterialBanner
			}
			this.formData124.addMaterialPoster.map((item, index) => {
				let imageObject = Object.assign(item, {
					sortOrder: index,
				})
				delete imageObject.addMaterialPoster
				paramJson.imageList.push(imageObject)
			})
			let res = null
			let flag = false
			if (this.formData124.evaluationMaterialId) {
				paramJson.evaluationMaterialId = this.formData124.evaluationMaterialId
				res = await editEvaluationMaterial(paramJson)
			} else {
				flag = true
				res = await addEvaluationMaterial(paramJson)
			}
			let {
				data: { resultCode, resultMsg },
			} = res
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible123 = false
				this._getEvaluationMaterialListByCondition(flag)
			}
			this.dialogVisible123 = false
		},
		delEvaluationMaterial: async function ({ evaluationMaterialId }) {
			let {
				data: { resultCode, resultMsg },
			} = await releaseOrDelEvaluationMaterial({
				evaluationMaterialIdList: [evaluationMaterialId],
				state: 0,
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this._getEvaluationMaterialListByCondition(true)
			}
		},
		_getSensitiveWordFilteringList: async function () {
			let {
				data: { resultCode, resultData },
			} = await getSensitiveWordFilteringList()
			if (resultCode == 0) {
				resultData.list.map((item) => {
					if (item.filterWord) {
						this.sensitiveWordMap[item.detection] = item.filterWord.split(',')
					}
				})
			}
		},
		sourceTypeMap(sourceType) {
			const map = new Map([
				['1', 'AKC'],
				['2', 'HYK'],
				['3', 'BBC'],
				['4', 'WPC'],
				['5', '京东联盟'],
				['6', '海外购'],
				['7', '砍单活动'],
				['8', '奥买家'],
				['9', '自有品牌'],
				['10', '商家'],
				['11', '购拉拉'],
				['12', '超链'],
				['13', '自有品牌-海外'],
			])
			let key = sourceType
			if (Number.isInteger(key)) {
				key = key.toString()
			}
			if (!map.get(key)) {
				return '-'
			}
			return map.get(key)
		},
		_supplierAccountNumberList: async function () {
			this.loading = true
			let {
				data: { resultCode, resultData },
			} = await supplierAccountNumberList()
			let list = [
				{
					supplierAccountNumberId: 0,
					supplierName: '全部',
				},
			]
			if (resultCode == 0) {
				list.push(...resultData.supplierAccountNumberList)
			}
			this.formCfg121[0].options = list
			this._getEvaluationMaterialListByCondition(true)
		},
		_getEvaluationMaterialListByCondition: async function (flag) {
			this.loading = true
			let paramJson = this.findSearchParams122(flag)
			const {
				data: { resultCode, resultData },
			} = await getEvaluationMaterialListByCondition(paramJson)
			if (resultCode == 0) {
				this.tableData122 = resultData.evaluationMaterialList
				this.page122.count = resultData.count
				this.tableData122.map((item) => {
					item.evaluationPeopleImgUrl = item.evaluationPeopleImgUrl
						? getBigImg(item.evaluationPeopleImgUrl)
						: item.brandLogoUrl
						? getBigImg(item.brandLogoUrl)
						: ''
					item.evaluationPeopleImgUrlTable = item.evaluationPeopleImgUrl
						? getBigImg(item.evaluationPeopleImgUrl)
						: getBigImg(item.brandLogoUrl)
				})
			} else {
				this.tableData122 = []
				this.page122.count = 0
			}
			this.loading = false
		},
		findSearchParams122(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page122.currentPage = 1
			}
			const paramJson = Object.assign(this.formData121, {
				length: this.page122.length,
				startIndex: (this.page122.currentPage - 1) * this.page122.length,
			})
			return paramJson
		},
		_releaseOrDelEvaluationMaterial: async function ({
			releaseState,
			content,
			evaluationMaterialId,
		}) {
			// 发布、取消发布
			let newReleaseState = 1
			if (releaseState == 1) {
				newReleaseState = 2
			} else {
				let flag = false
				if (this.sensitiveWordMap['小程序素材评价']) {
					this.sensitiveWordMap['小程序素材评价'].map((item) => {
						if (content.indexOf(item) > -1) {
							this.$message.error(
								`【素材内容】内出现敏感词【${item}】，请修改后再保存`
							)
							flag = true
							return false
						}
					})
				}
				if (flag) {
					return
				}
			}
			let paramJson = {
				evaluationMaterialIdList: [evaluationMaterialId],
				releaseState: newReleaseState,
			}
			let {
				data: { resultCode, resultMsg },
			} = await releaseOrDelEvaluationMaterial(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this._getEvaluationMaterialListByCondition()
			}
		},
		async uploadImageHttpRequest(params, name) {
			//上传banner
			let formData = new FormData()
			if (name == 'addMaterialBanner') {
				formData.append('formId', '#addMaterialBanner')
				formData.append('data', JSON.stringify({ imageType: 54 }))
			} else if (name == 'addMaterialPoster') {
				formData.append('formId', '#addMaterialPoster')
				formData.append('data', JSON.stringify({ imageType: 54 }))
			}
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			if (resultCode == 0) {
				resultData.imageList[0][name] = getBigImg(
					resultData.imageList[0].imageUrl
				)
				if (name == 'addMaterialPoster') {
					this.formData124[name].push(...resultData.imageList)
				} else {
					this.formData124[name] = resultData.imageList
				}
			}
			this.$forceUpdate()
		},
		selectionChange(list) {
			this.selectedList = list
		},
		operateEvaluation(type) {
			// 取消发布，发布，删除
			let ids = []
			let operate = ''
			let flag = false
			this.selectedList.some((item) => {
				if (flag) {
					return true
				}
				if (type == 1) {
					operate = '发布'
					this.sensitiveWordMap['小程序素材评价'].some((itemWord) => {
						if (item.content.indexOf(itemWord) > -1) {
							this.$message.warning(
								`【素材内容】内出现敏感词【${itemWord}】，请修改后再保存`
							)
							flag = true
							return true
						}
					})
					ids.push(item.evaluationMaterialId)
				} else if (type == 2) {
					operate = '取消发布'
					ids.push(item.evaluationMaterialId)
				} else if (type == 0) {
					operate = '删除'
					ids.push(item.evaluationMaterialId)
				}
			})
			if (flag) {
				return
			}
			if (ids.length == 0) {
				return this.$message.warning('请选择可操作的评价素材')
			}
			// if (ids.length > 10) {
			// 	return this.$message.warning('只能勾选10条评价素材进行操作')
			// }
			this.$confirm(`确认批量${operate}${ids.length}个素材？`, '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						let paramJson = {
							evaluationMaterialIdList: ids,
						}
						if (type == 1 || type == 2) {
							paramJson = Object.assign(paramJson, {
								releaseState: type,
							})
						} else if (type == 0) {
							paramJson = Object.assign(paramJson, {
								state: type,
							})
						}
						let {
							data: { resultCode, resultMsg },
						} = await releaseOrDelEvaluationMaterial(paramJson)
						if (resultCode == 0) {
							this.$message.success(resultMsg)
						} else {
							this.$message({
								message: `批量${operate}失败`,
								type: 'warning',
								duration: 5000,
							})
						}
						this._getEvaluationMaterialListByCondition(type == 0)
					}
				},
			})
		},
		updateEvaluationMaterialInfo(row) {
			this.formData124 = Object.assign({}, JSON.parse(JSON.stringify(row)))
			if (row.evaluationPeopleImgUrl) {
				this.formData124.addMaterialBanner = [
					{
						addMaterialBanner: row.evaluationPeopleImgUrl,
						imageUrl: row.evaluationPeopleImgUrl,
					},
				]
			} else {
				this.formData124.addMaterialBanner = []
			}
			this.formData124.addMaterialPoster = []
			if (row.imageList) {
				row.imageList.map((item) => {
					item.addMaterialPoster = getBigImg(item.imageUrl)
					this.formData124.addMaterialPoster.push(item)
				})
			}
			this.dialogTitle123 = '编辑素材'
			this.dialogVisible123 = true
			this.$nextTick(() => {
				this.$refs.dialog124.$refs.YxForm.clearValidate()
			})
		},
		findSearchParams127(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page127.currentPage = 1
			}
			const paramJson = Object.assign(this.formData126, {
				length: this.page127.length,
				startIndex: (this.page127.currentPage - 1) * this.page127.length,
			})
			return paramJson
		},
		_getBrandList: async function (flag) {
			this.loading127 = true
			let paramJson = this.findSearchParams127(flag)
			const {
				data: { resultCode, resultData },
			} = await getBrandList(paramJson)
			if (resultCode == 0) {
				this.tableData127 = resultData.brandList
				this.page127.count = resultData.brandCount
			} else {
				this.tableData127 = []
				this.page127.count = 0
			}
			this.loading127 = false
		},
		openBrandDialog() {
			this._getBrandList(true)
			this.dialogVisible125 = true
		},
		changeBrandId(row) {
			this.formData124.brandId = row.brandId
			this.formData124.brandName = row.brandName
		},
		querySearchAsync: async function (queryString = '', cb) {
			console.log(queryString)
			let {
				data: { resultCode, resultData },
			} = await getBrandList({
				startIndex: 0,
				length: 20,
				selectionTag: 2,
				keyword: queryString,
			})
			if (resultCode == 0) {
				resultData.brandList.map((item) => {
					item.value = item.brandName
				})
				cb(resultData.brandList)
			}
		},
	},
}
</script>
<style scoped>
.c_image {
	width: 100px;
}
.input-with-select {
	width: 100%;
}
</style>

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
				<template slot="transitionName" slot-scope="scope">
					<div>
						<span v-if="scope.row.transitionState == 9">{{
							scope.row.goodsGroupName
						}}</span>
						<span v-else-if="scope.row.transitionState == 10">{{
							scope.row.actDiscountName
						}}</span>
						<el-image
							v-else-if="
								scope.row.transitionState == 11 && scope.row.actBannerPageUrl
							"
							class="actBanner-page-url"
							fit="cover"
							:src="getBigImg(scope.row.actBannerPageUrl)"
							:preview-src-list="[getBigImg(scope.row.actBannerPageUrl)]"
						>
							<div slot="error" class="image-slot">
								<i class="el-icon-picture-outline"></i>
							</div>
						</el-image>
						<span v-else>-</span>
					</div>
				</template>
				<template slot="bannerState" slot-scope="scope">
					<div>
						<el-tag v-if="curTime < scope.row.startTime" type="danger"
							>未开始</el-tag
						>
						<el-tag v-if="curTime > scope.row.endTime" type="info"
							>已结束</el-tag
						>
						<el-tag
							v-if="
								curTime >= scope.row.startTime && curTime <= scope.row.endTime
							"
							>进行中</el-tag
						>
					</div>
				</template>
			</yx-table>
			<Dialog
				:title="dialogTitle103"
				:visible.sync="dialogVisible103"
				:width="dialogWidth103"
				:bottomBtn="dialogBottomBtn103"
			>
				<yx-form
					ref="formRef104"
					labelWidth="100px"
					:data="formData104"
					:items="formCfg104"
					:formAction="formAction104"
					:rules="formRules104"
				>
					<template slot="goodsGroup">
						<el-autocomplete
							placeholder="请选择品牌"
							v-model="formData104.groupName"
							:fetch-suggestions="querySearchAsync"
							@select="changeGoodsGroup"
							class="input-with-select"
						>
							<el-button
								@click="setDialog101"
								slot="append"
								icon="el-icon-more"
							></el-button>
						</el-autocomplete>
					</template>
					<template slot="upload">
						<div>
							<div class="upload-box">
								<el-button
									@click="handleDownExcel"
									class="template"
									type="primary"
									>下载模板</el-button
								>
								<el-upload
									:before-upload="beforeUpload"
									:file-list="fileList"
									ref="uploadUser"
									:http-request="uploadHttpRequest"
								>
									<el-button slot="trigger" class="mr20" icon="el-icon-plus">
										添加文件
									</el-button>
								</el-upload>
							</div>
							<div v-if="userIds.length">
								<p v-for="(item, index) in userIds" :key="index">
									用户ID:{{ item }}
								</p>
							</div>
						</div>
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
					v-loading="loading112"
					:columns="tableColumns112"
					:pagination="page112"
					:data="tableData112"
				>
					<template slot="goodsSpecId" slot-scope="scope">
						<el-radio
							v-model="formData104.goodsGroupId"
							:label="scope.row.goodsGroupId"
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
import {
	getActBannerList,
	delActBanner,
	addActBanner,
	updateActBanner,
} from '@/api/yhtPlusCmsActivity'
import { getBigImg } from '@/utils/imageTool'
import { getDepartmentAmiBaList } from '@/api/cmsOrganizationAdmin'
import { uploadImageList } from '@/api/image'
import { getActDiscountListByCondition } from '@/api/yhtPlusCmsAct'
import { downloadFile } from '@/utils/helper/common'
import { importActBannerUserIds } from '@/api/webImport'
import {
	getGoodsGroupListByCondition,
	getGoodsGroupListByConditionForCMS,
} from '@/api/goodsGroup'

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
			loading112: false,
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
					title: '',
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
						this.getData112(true)
					},
				},
			],
			tableData112: [],
			tableColumns112: [
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
				{
					title: '分组类型',
					type: 'newMap',
					dataIndex: 'goodsType',
					options: [
						['1', '品牌营销'],
						['2', '专享营销'],
					],
				},
			],
			page112: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData112()
				},
			},
			getBigImg,
			curTime: new Date().getTime(),
			loading: false,
			formData101: {
				keyword: '',
			},
			formCfg101: [
				{
					type: 'input',
					title: '关键词',
					dataIndex: 'keyword',
					placeholder: 'banner名称',
				},
			],
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData102(true)
					},
					tableId: 102,
				},
				{
					title: '新增banner',
					type: 'success',
					auth: 'addActBanner',
					click: () => {
						this.formData104 = {
							showTypeList: [],
							channelList: [],
							departmentId: [],
							bannerImage: [],
							actBannerPageImage: [],
							transitionState: 1,
							bannerName: '',
							startTime: '',
							endTime: '',
							sortOrder: '',
							goodsGroupId: '',
							scope: 1,
						}
						this.dialogTitle103 = '新增Banner'
						this.$nextTick(() => {
							this.$refs.formRef104.$refs.YxForm.clearValidate()
						})
						this.dialogVisible103 = true
					},
					dialogId: 103,
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					dataIndex: 'bannerId',
					title: 'bannerID',
				},
				{
					type: 'string',
					dataIndex: 'bannerName',
					title: 'banner名称',
				},
				{
					type: 'image',
					dataIndex: 'imageBigUrl',
					title: '图片',
				},
				{
					type: 'newMap',
					dataIndex: 'transitionState',
					title: '跳转页面',
					options: [
						['1', '不跳'],
						['2', '选品列表页'],
						['3', '京东专区'],
						['4', '我的推手'],
						['5', '步数换首页'],
						['6', '砍单专区'],
						['8', '领券中心'],
						['9', '指定分组'],
						['10', '满减/满折专区'],
						['11', '活动预告'],
						['12', '小程序直播'],
						['14', '分类'],
						['15', '活动专区'],
						['16', '多件促销'],
						['17', 'H5'],
					],
				},
				{
					type: 'custom',
					dataIndex: 'transitionName',
					title: '跳转位置',
				},
				{
					type: 'string',
					dataIndex: 'showTypeIds',
					title: '展示位置',
					customRender: (row) => {
						let showTypeHtml = []
						let value = row.showTypeIds
						value = value || ''
						value = value.split(',')
						for (let i = 0; i < value.length; i++) {
							if (value[i] == 1) {
								showTypeHtml.push('选品')
							} else if (value[i] == 2) {
								showTypeHtml.push('首页头部')
							} else if (value[i] == 3) {
								showTypeHtml.push('首页腰部')
							} else if (value[i] == 4) {
								showTypeHtml.push('品牌专场')
							} else if (value[i] == 5) {
								showTypeHtml.push('商品详情')
							}
						}
						return showTypeHtml.join(',')
					},
				},
				{
					type: 'string',
					dataIndex: 'sortOrder',
					title: '排序值',
				},
				{
					type: 'string',
					dataIndex: 'startTime',
					title: '有效时间',
					customRender: (row) => {
						return (
							moment(row.startTime).format('YYYY-MM-DD HH:mm:ss') +
							'-' +
							moment(row.endTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					type: 'custom',
					dataIndex: 'bannerState',
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
							auth: 'delActBanner',
							popconfirm: true,
							popconfirmTitle: '确认要删除该banner吗',
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
							auth: 'updateActBanner',
							dialogId: 103,
							click: (row) => {
								this.updateActBannerInfo(row)
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
			dialogTitle103: '新增Banner',
			dialogWidth103: '600px',
			dialogVisible103: false,
			dialogBottomBtn103: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.formRef104.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveAddActBannerList()
							}
						})
					},
				},
			],
			formData104: {
				bannerName: '',
				startTime: '',
				endTime: '',
				sortOrder: '',
			},
			formRules104: {
				bannerName: [
					{ required: true, message: '请输入活动标题', trigger: 'blur' },
				],
				startTime: [
					{ required: true, message: '请选择开始时间', trigger: 'change' },
				],
				endTime: [
					{ required: true, message: '请选择结束时间', trigger: 'change' },
				],
				showTypeList: [
					{ required: true, message: '请选择展示位置', trigger: 'change' },
				],
				h5Url: [
					{
						required: true,
						validator: (rule, value, callback) => {
							const regExp =
								/^(((ht|f)tps):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/
							const flag = regExp.test(value)
							if (flag === true) {
								callback()
							} else {
								callback(new Error('请输入有效的以https开头的H5链接'))
							}
						},
						message: '请输入有效的以https开头的H5链接',
						trigger: 'change',
					},
				],
				sortOrder: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入排序值'))
							} else if (value > 255) {
								callback(new Error('排序值最高不超过255'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				actDiscountId: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (
								(this.formData104.transitionState == 10 ||
									this.formData104.transitionState == 15) &&
								!this.formData104.actDiscountId
							) {
								callback(new Error('请选择活动!'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				goodsGroup: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (
								this.formData104.transitionState == 9 &&
								!this.formData104.goodsGroupId
							) {
								callback(new Error('请选择指定品牌!'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				bannerImage: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData104.bannerImage.length) {
								callback(new Error('请上传banner图片'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				actBannerPageImage: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (
								this.formData104.transitionState == 11 &&
								!this.formData104.actBannerPageImage.length
							) {
								callback(new Error('请上传预告图片'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			formCfg104: [
				{
					type: 'input',
					title: '活动标题',
					dataIndex: 'bannerName',
					placeholder: '请输入活动标题',
				},
				{
					title: '展示时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
				{
					type: 'checkbox',
					dataIndex: 'showTypeList',
					title: '展示位置',
					label: 'value',
					options: [
						{
							value: '选品',
							showTypeList: '1',
						},
						{
							value: '首页头部',
							showTypeList: '2',
						},
						{
							value: '首页腰部',
							showTypeList: '3',
						},
						{
							value: '品牌专场',
							showTypeList: '4',
						},
						{
							value: '商品详情',
							showTypeList: '5',
						},
					],
					change: () => {
						this.$forceUpdate()
					},
				},
				{
					title: '排序值',
					type: 'inputNumber',
					dataIndex: 'sortOrder',
					placeholder: '最高不超过255',
				},
				{
					type: 'select',
					title: '跳转类型',
					dataIndex: 'transitionState',
					placeholder: '请选择跳转类型',
					label: 'value',
					change: (transitionState) => {
						this.transitionStateChange(transitionState)
					},
					options: [
						{
							value: '不跳',
							transitionState: 1,
						},
						{
							transitionState: 2,
							value: '选品列表页',
						},
						{
							transitionState: 3,
							value: '京东专区',
						},
						{
							transitionState: 4,
							value: '我的推手',
						},
						{
							transitionState: 5,
							value: '步数换首页',
						},
						{
							transitionState: 6,
							value: '砍单专区',
						},
						{
							transitionState: 8,
							value: '领券中心',
						},
						{
							transitionState: 9,
							value: '指定分组',
						},
						{
							transitionState: 10,
							value: '满减/满折活动专区',
						},
						{
							transitionState: 11,
							value: '活动预告',
						},
						{
							transitionState: 12,
							value: '小程序直播',
						},
						{
							transitionState: 14,
							value: '分类',
						},
						{
							transitionState: 15,
							value: '活动专区',
						},
						{
							transitionState: 16,
							value: '多件促销',
						},
						{
							transitionState: 20,
							value: 'H5',
						},
					],
				},
				{
					title: '跳转链接',
					type: 'input',
					// TODO： 修改为接口字段
					dataIndex: 'h5Url',
					hide: true,
				},
				{
					title: '选择品牌',
					type: 'custom',
					dataIndex: 'goodsGroup',
					hide: true,
				},
				{
					title: '选择营销活动',
					type: 'select',
					dataIndex: 'actDiscountId',
					label: 'actName',
					options: [],
					hide: true,
				},
				{
					type: 'radio',
					dataIndex: 'scope',
					title: '可见范围',
					label: 'value',
					change: (scope) => {
						this.userTypeChange(scope)
					},
					options: [
						{
							value: '平台所有用户',
							scope: 1,
						},
						{
							value: '店主',
							scope: 2,
						},
						{
							value: '消费者',
							scope: 3,
						},
						{
							value: '部分用户',
							scope: 4,
						},
					],
				},
				{
					type: 'custom',
					dataIndex: 'upload',
					hide: true,
				},
				{
					title: '渠道店主',
					type: 'checkbox',
					dataIndex: 'channelList',
					options: this.$store.state.app.constant.SHOP_CHANNEL_LIST,
					label: 'channelList',
					change: () => {
						this.$forceUpdate()
					},
				},
				{
					title: '分组店主',
					type: 'checkbox',
					dataIndex: 'departmentId',
					options: [],
					label: 'departmentName',
					change: () => {
						this.$forceUpdate()
					},
				},
				{
					type: 'uploadImage',
					title: 'banner图片',
					dataIndex: 'bannerImage',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'bannerImage',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'bannerImage'),
					},
				},
				{
					type: 'uploadImage',
					title: '预告图片',
					dataIndex: 'actBannerPageImage',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'actBannerPageImage',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'actBannerPageImage'),
					},
				},
			],
			formAction104: [],
			actDiscountList: [],
			activityAreaList: [],
			fileList: [],
			userIds: [],
		}
	},

	created() {
		this.getData102(true)
		this._getDepartmentAmiBaList()
	},

	methods: {
		beforeUpload(files) {
			this.fileList = [files]
		},
		uploadHttpRequest: async function (params) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ timeStamp: new Date().getTime(), groupId: 2 })
			)
			formData.append('formId', '#excelForm')
			formData.append('excel', params.file)
			const {
				data: { resultCode, resultData },
			} = await importActBannerUserIds(formData)
			if (resultCode == 0) {
				this.userIds = resultData.userIds || []
			}
		},
		// 下载Excel模板
		handleDownExcel() {
			downloadFile(`/excel/platform/导入部分用户模板.xlsx`)
		},
		userTypeChange(type) {
			this.formCfg104.map((item) => {
				if (item.dataIndex == 'upload') {
					item.hide = type != 4
				}
			})
		},
		saveAddActBannerList: async function () {
			let paramJson = {
				bannerName: this.formData104.bannerName,
				sortOrder: this.formData104.sortOrder,
				transitionState: this.formData104.transitionState,
				scope: this.formData104.scope,
				state: 1,
				startTime: moment(this.formData104.startTime).valueOf(),
				endTime: moment(this.formData104.endTime).valueOf(),
				showTypeIds: this.formData104.showTypeList.join(','),
				channelsWay: this.formData104.channelList.join(','),
				groupWay: this.formData104.departmentId.join(','),
				h5Url: this.formData104.h5Url,
			}
			if (
				this.formData104.showTypeList.length == 1 &&
				this.formData104.showTypeList[0] == 1
			) {
				paramJson.showType = 1
			} else if (
				this.formData104.showTypeList.length == 1 &&
				this.formData104.showTypeList[0] == 2
			) {
				paramJson.showType = 2
			} else if (
				this.formData104.showTypeList.length == 2 &&
				this.formData104.showTypeList.includes('1') &&
				this.formData104.showTypeList.includes('2')
			) {
				paramJson.showType = 3
			}
			if (paramJson.transitionState == 9) {
				paramJson.goodsGroupId = this.formData104.goodsGroupId
			}
			if (paramJson.transitionState == 10 || paramJson.transitionState == 15) {
				paramJson.actDiscountId = this.formData104.actDiscountId
			}
			if (
				this.formData104.bannerImage[0] &&
				this.formData104.bannerImage[0].imageId
			) {
				paramJson.portraitImageData = this.formData104.bannerImage[0]
				delete paramJson.portraitImageData.bannerImage
				paramJson.portraitImageData = JSON.stringify(
					paramJson.portraitImageData
				)
			}
			if (
				this.formData104.actBannerPageImage[0] &&
				this.formData104.actBannerPageImage[0].imageId
			) {
				paramJson.actBannerPageImage = this.formData104.actBannerPageImage[0]
				delete paramJson.actBannerPageImage.actBannerPageImage
				paramJson.actBannerPageImage = JSON.stringify(
					paramJson.actBannerPageImage
				)
			}
			if (paramJson.scope == 4) {
				paramJson.userIds = this.userIds
				if (!paramJson.userIds.length) {
					this.$message.error('请导入小程序用户')
					return
				}
			}
			let res = null
			let flag = false
			if (this.formData104.bannerId) {
				paramJson.actBannerId = this.formData104.bannerId
				res = await updateActBanner(paramJson)
			} else {
				flag = true
				res = await addActBanner(paramJson)
			}
			let {
				data: { resultCode, resultMsg },
			} = res
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible103 = false
				this.getData102(flag)
			}
		},
		setDialog101() {
			this.dialogVisible101 = true
			this.getData112(true)
		},
		getData112: async function (flag) {
			this.loading112 = true
			let paramJson = this.findSearchParams123(flag)
			const {
				data: { resultCode, resultData },
			} = await getGoodsGroupListByConditionForCMS(paramJson)
			if (resultCode == 0) {
				this.tableData112 = resultData.goodsGroupList
				this.page112.count = resultData.goodsGroupCount
			} else {
				this.tableData112 = []
				this.page112.count = 0
			}
			this.loading112 = false
		},
		findSearchParams123(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page112.currentPage = 1
			}
			const paramJson = Object.assign(this.formData123, {
				length: this.page112.length,
				goodsGroupStateList: ['1', '2'],
				// goodsType: 1,
				gcategoryList: ['1'],
				startIndex: (this.page112.currentPage - 1) * this.page112.length,
			})
			return paramJson
		},
		changeGoodsGroup(row) {
			this.formData104.goodsGroupId = row.goodsGroupId
			this.formData104.groupName = row.groupName
		},
		querySearchAsync: async function (queryString = '', cb) {
			let {
				data: { resultCode, resultData },
			} = await getGoodsGroupListByConditionForCMS({
				goodsGroupStateList: ['1', '2'],
				// goodsType: 1,
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
		transitionStateChange(state) {
			this.formCfg104.map((item) => {
				if (
					item.dataIndex == 'actDiscountId' ||
					item.dataIndex == 'goodsGroup' ||
					item.dataIndex == 'h5Url'
				) {
					item.hide = true
				}
			})
			if (state == 10) {
				this.formCfg104.map((item) => {
					if (item.dataIndex == 'actDiscountId') {
						item.hide = false
						item.label = 'actName'
						item.title = '选择营销活动'
						if (this.actDiscountList.length) {
							item.options = this.actDiscountList
						}
					}
				})
				this.formData104.actDiscountId =
					this.formData104.actDiscountId != -1
						? this.formData104.actDiscountId
						: ''
				if (!this.actDiscountList.length) {
					this._getActDiscountListByCondition()
				}
			} else if (state == 15) {
				this.formCfg104.map((item) => {
					if (item.dataIndex == 'actDiscountId') {
						item.hide = false
						item.label = 'name'
						item.title = '选择活动'
						if (this.activityAreaList.length) {
							item.options = this.activityAreaList
						}
					}
				})
				this.formData104.actDiscountId =
					this.formData104.actDiscountId != -1
						? this.formData104.actDiscountId
						: ''
				if (!this.activityAreaList.length) {
					this._getGoodsGroupListByCondition()
				}
			} else if (state == 9) {
				this.formCfg104.map((item) => {
					if (item.dataIndex == 'goodsGroup') {
						item.hide = false
					}
				})
			} else if (state == 20) {
				this.formCfg104.map((item) => {
					if (item.dataIndex == 'h5Url') {
						item.hide = false
					}
				})
			}
		},
		_getGoodsGroupListByCondition: async function () {
			let {
				data: { resultCode, resultData },
			} = await getGoodsGroupListByCondition()
			if (resultCode == 0) {
				resultData.activityAreaList.map((item) => {
					item.actDiscountId = item.id
				})
				this.activityAreaList = resultData.activityAreaList || []
				this.formCfg104.map((item) => {
					if (item.dataIndex == 'actDiscountId') {
						item.options = resultData.activityAreaList
					}
				})
			}
		},
		_getActDiscountListByCondition: async function () {
			let {
				data: { resultCode, resultData },
			} = await getActDiscountListByCondition({
				openTypeList: [1, 2],
			})
			if (resultCode == 0) {
				this.actDiscountList = resultData.actDiscountList || []
				this.formCfg104.map((item) => {
					if (item.dataIndex == 'actDiscountId') {
						item.options = resultData.actDiscountList
					}
				})
			}
		},
		async uploadImageHttpRequest(params, name) {
			//上传海报
			let formData = new FormData()
			if (name == 'bannerImage') {
				formData.append('formId', '#portraitImageFrom')
				formData.append('data', JSON.stringify({ imageType: 48 }))
			} else if (name == 'actBannerPageImage') {
				formData.append('formId', '#bannerPageImageFrom')
				formData.append('data', JSON.stringify({ imageType: 53 }))
			}
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			if (resultCode == 0) {
				resultData.imageList[0][name] = getBigImg(
					resultData.imageList[0].imageUrl
				)
				this.formData104[name] = resultData.imageList
			}
			this.$forceUpdate()
		},
		updateActBannerInfo(row) {
			this.formData104 = Object.assign({}, row)
			this.formData104.showTypeList =
				(this.formData104.showTypeIds &&
					this.formData104.showTypeIds.split(',')) ||
				[]
			this.formData104.channelList =
				(this.formData104.channelsWay &&
					this.formData104.channelsWay.split(',')) ||
				[]
			this.formData104.departmentId =
				(this.formData104.groupWay &&
					this.formData104.groupWay.split(',').map(Number)) ||
				[]
			this.formData104.departmentId
			this.formData104.bannerImage = [
				{
					bannerImage: getBigImg(this.formData104.imageUrl),
				},
			]
			this.formData104.actBannerPageImage = this.formData104.actBannerPageUrl
				? [
						{
							actBannerPageImage: getBigImg(this.formData104.actBannerPageUrl),
						},
				  ]
				: []
			if (!this.formData104.goodsGroupId) {
				this.formData104.goodsGroupId = ''
			} else if (
				this.formData104.goodsGroupId &&
				this.formData104.goodsGroupId == -1
			) {
				this.formData104.goodsGroupId = ''
			}
			if (this.formData104.goodsGroupName) {
				this.formData104.groupName = this.formData104.goodsGroupName
			}
			this.transitionStateChange(this.formData104.transitionState)
			this.dialogTitle103 = '编辑Banner'
			this.dialogVisible103 = true
			this.$forceUpdate()
		},
		_getDepartmentAmiBaList: async function () {
			let {
				data: {
					resultCode,
					resultData: { resultData },
				},
			} = await getDepartmentAmiBaList()
			if (resultCode == 0) {
				this.formCfg104.map((item) => {
					if (item.dataIndex == 'departmentId') {
						item.options = resultData.list
					}
				})
				this.$forceUpdate()
			}
		},
		_delActBanner: async function ({ bannerId }) {
			let {
				data: { resultCode, resultMsg },
			} = await delActBanner({ actBannerId: bannerId })
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
			} = await getActBannerList(paramJson)
			if (resultCode == 0) {
				resultData.actBannerList.map((item) => {
					item.imageBigUrl = getBigImg(item.imageUrl)
				})
				this.tableData102 = resultData.actBannerList
				this.page102.count = resultData.count
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
				length: this.page102.length,
				startIndex: (this.page102.currentPage - 1) * this.page102.length,
			})
			return paramJson
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

<template>
	<div class="bannerStatistics">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData109"
				:items="formCfg109"
				:formAction="formAction109"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading110"
				:columns="tableColumns110"
				:pagination="page110"
				:data="tableData110"
			>
				<template slot="link" slot-scope="scope">
					<div>
						<el-link type="primary" :href="scope.row.link" target="_blank">{{
							scope.row.link
						}}</el-link>
					</div>
				</template>
				<template slot="bannerState" slot-scope="scope">
					<div>
						<el-tag type="danger" v-if="curTime < scope.row.startTime"
							>未开始</el-tag
						>
						<el-tag type="info" v-if="curTime > scope.row.endTime"
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
				:title="dialogTitle111"
				:visible.sync="dialogVisible111"
				:width="dialogWidth111"
				:bottomBtn="dialogBottomBtn111"
			>
				<yx-form
					ref="dialog112"
					labelWidth="100px"
					:data="formData112"
					:items="formCfg112"
					:formAction="formAction112"
					:rules="formRules112"
				>
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
import {
	getBannerList,
	updateBanner,
	addBanner,
	delBanner,
} from '@/api/businessSchool'
import { getBigImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'
import moment from 'moment'

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
			isShow: false,
			curTime: new Date().getTime(),
			formData109: {
				keyword: '',
			},
			formCfg109: [
				{
					type: 'input',
					title: '关键词',
					dataIndex: 'keyword',
					placeholder: 'banner名称',
				},
			],
			formAction109: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						this.init(true)
					},
				},
				{
					title: '新增banner',
					type: 'warning',
					auth: 'updateBusinessSchool',
					dialogId: 135,
					click: () => {
						this.formData112 = {
							bannerName: '',
							startTime: '',
							endTime: '',
							link: '',
							bannerImage: [],
						}
						this.dialogVisible111 = true
						this.$nextTick(() => {
							this.$refs.dialog112.$refs.YxForm.clearValidate()
						})
					},
				},
			],
			loading110: false,
			tableData110: [],
			tableColumns110: [
				{
					type: 'string',
					dataIndex: 'bannerName',
					title: 'banner名称',
				},
				{
					type: 'image',
					dataIndex: 'imageUrl',
					title: '图片',
				},
				{
					type: 'date',
					dataIndex: 'startTime',
					title: '有效期',
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
					dataIndex: 'link',
					title: '跳转链接',
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
							auth: 'updateBusinessSchool',
							popconfirm: true,
							popconfirmTitle: '确认要删除该banner吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._delBanner(row)
							},
						},
						{
							title: '编辑',
							auth: 'updateBusinessSchool',
							click: (row) => {
								this.updateBannerInfo(row)
								this.$nextTick(() => {
									this.$refs.dialog112.$refs.YxForm.clearValidate()
								})
								this.dialogVisible111 = true
							},
						},
					],
				},
			],
			page110: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			dialogTitle111: '新增banner',
			dialogWidth111: '600px',
			dialogVisible111: false,
			dialogBottomBtn111: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog112.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveBannerList()
								// this.dialogVisible105 = false
							}
						})
					},
				},
			],
			formRules112: {
				bannerName: [
					{ required: true, message: '请输入活动标题', trigger: 'blur' },
				],
				startTime: [
					{ required: true, message: '请选择开始时间', trigger: 'change' },
				],
				endTime: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请选择结束时间!'))
							} else if (value < this.formData112.startTime) {
								callback(new Error('结束时间必须大于开始时间!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				link: [{ required: true, message: '请输入跳转链接', trigger: 'blur' }],
				bannerImage: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData112.bannerImage.length) {
								callback(new Error('请上传图片!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			formData112: {
				bannerName: '',
				startTime: '',
				endTime: '',
				link: '',
				bannerImage: [],
			},
			formCfg112: [
				{
					type: 'input',
					title: '活动标题',
					dataIndex: 'bannerName',
					placeholder: '',
				},
				{
					title: '有效时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					type: 'input',
					title: '跳转链接',
					dataIndex: 'link',
					placeholder: '',
				},
				{
					type: 'uploadImage',
					title: 'banner图片',
					dataIndex: 'bannerImage',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'bannerImage',
						httpRequest: (file) => this.uploadImageHttpRequest(file),
					},
				},
			],
			formAction112: [],
		}
	},

	methods: {
		_delBanner: async function ({ bannerId }) {
			let {
				data: { resultCode, resultMsg },
			} = await delBanner({ bannerId })
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.init(true)
			}
		},
		saveBannerList: async function () {
			let paramJson = {
				bannerName: this.formData112.bannerName,
				link: this.formData112.link,
				state: 1,
				sort: 1,
				startTime: moment(this.formData112.startTime).valueOf(),
				endTime: moment(this.formData112.endTime).valueOf(),
			}
			if (this.formData112.bannerImage[0].imageId) {
				paramJson.Image = this.formData112.bannerImage[0]
				delete paramJson.bannerImage
			}
			let res = null
			let flag = false
			if (this.formData112.bannerId) {
				paramJson.bannerId = this.formData112.bannerId
				res = await updateBanner(paramJson)
			} else {
				flag = true
				res = await addBanner(paramJson)
			}
			let {
				data: { resultCode, resultMsg },
			} = res
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible111 = false
				this.init(flag)
			}
		},
		async uploadImageHttpRequest(params) {
			//上传banner
			let formData = new FormData()
			formData.append('formId', '#bannerImageFrom')
			formData.append('data', JSON.stringify({ imageType: 51 }))
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			if (resultCode == 0) {
				resultData.imageList[0].bannerImage = getBigImg(
					resultData.imageList[0].imageUrl
				)
				this.formData112.bannerImage = resultData.imageList
			}
			// this.$forceUpdate()
		},
		updateBannerInfo(row) {
			// 商学院banner-编辑
			this.formData112 = Object.assign({}, row)
			this.formData112.bannerImage = [
				{
					bannerImage: this.formData112.imageUrl,
				},
			]
			this.dialogTitle111 = '编辑课程'
			this.dialogVisible111 = true
			this.$forceUpdate()
		},
		init: async function (flag) {
			this.loading110 = true
			let paramJson = this.findSearchParams110(flag)
			const {
				data: { resultCode, resultData },
			} = await getBannerList(paramJson)
			if (resultCode == 0) {
				this.isShow = true
				this.curTime = new Date().getTime()
				this.tableData110 = resultData.actBannerList
				this.page110.count = resultData.count
				this.tableData110.map((item) => {
					item.imageUrl = getBigImg(item.imageUrl)
				})
			} else {
				this.tableData110 = []
				this.page110.count = 0
			}
			this.loading110 = false
		},
		findSearchParams110(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page110.currentPage = 1
			}
			const paramJson = Object.assign(this.formData109, {
				length: this.page110.length,
				startIndex: (this.page110.currentPage - 1) * this.page110.length,
			})
			return paramJson
		},
	},
}
</script>

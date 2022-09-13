<template>
	<div class="activityArea">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData115"
				:items="formCfg115"
				:formAction="formAction115"
			>
			</yx-form>
			<div class="goods-group-btn-box">
				<el-button @click="addActivity" type="primary">新增活动</el-button>
			</div>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns116"
				:pagination="page116"
				:data="tableData116"
			></yx-table>
			<Dialog
				:title="dialogTitle117"
				:visible.sync="dialogVisible117"
				:width="dialogWidth117"
				:bottomBtn="dialogBottomBtn117"
			>
				<yx-form
					labelWidth="100px"
					ref="dialog118"
					:data="formData118"
					:items="formCfg118"
					:formAction="formAction118"
					:rules="formRules118"
				>
				</yx-form>
			</Dialog>
			<Dialog
				title="查看活动码"
				:visible.sync="dialogVisible119"
				width="360px"
				:bottomBtn="dialogBottomBtn119"
			>
				<div class="code-box">
					<el-image
						z-index="2100"
						class="c_image"
						fit="cover"
						:src="codeImagePath"
						:preview-src-list="[codeImagePath]"
					>
						<div slot="error" class="image-slot">
							<i class="el-icon-picture-outline"></i>
						</div>
					</el-image>
				</div>
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
	list,
	add,
	editActivity,
	generateQRCode,
} from '@/api/yhtPlusCmsActArea'
import { getBigImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'

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
			dialogVisible119: false,
			codeImagePath: '',
			dialogBottomBtn119: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible119 = false
					},
				},
			],
			loading: false,
			formData115: {
				activityName: '',
			},
			formCfg115: [
				{
					type: 'input',
					title: '活动名称',
					dataIndex: 'activityName',
					placeholder: '请输入活动名称',
				},
			],
			formAction115: [
				{
					title: '清空',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getData116(true)
					},
				},
			],
			tableData116: [],
			tableColumns116: [
				{
					type: 'string',
					dataIndex: 'id',
					title: '活动id',
				},
				{
					type: 'string',
					dataIndex: 'name',
					title: '活动名称',
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
					type: 'newMap',
					dataIndex: 'states',
					title: '活动状态',
					options: [
						['0', '未开始'],
						['1', '进行中'],
						['2', '已结束'],
					],
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '编辑活动',
							auth: '',
							click: ({ name, desc, startTime, endTime, image, id }) => {
								this.formData118 = {
									id,
									name,
									desc,
									startTime,
									endTime,
									areaImageList: [],
								}
								this.formData118.areaImageList = [
									{
										areaImageUrl: getBigImg(image.imageUrl),
										imageUrl: image.imageUrl,
										itemId: image.itemId,
									},
								]
								this.$forceUpdate()
								this.dialogTitle117 = '编辑活动'
								this.$nextTick(() => {
									this.$refs.dialog118.$refs.YxForm.clearValidate()
								})
								this.dialogVisible117 = true
							},
						},
						{
							title: '编辑楼层',
							auth: '',
							dialogId: 117,
							click: ({ id }) => {
								this.$router.push({
									path: `activityAreaFloor/${id}`,
								})
							},
						},
						{
							title: '预览',
							auth: '',
							dialogId: '',
							click: (row) => {
								this._generateQRCode(row)
							},
						},
					],
				},
			],
			page116: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData116()
				},
			},
			dialogTitle117: '新增活动',
			dialogWidth117: '800px',
			dialogVisible117: false,
			dialogBottomBtn117: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog118.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveAddActivityList()
								// this.dialogVisible117 = false
							}
						})
					},
				},
			],
			formData118: {
				name: '',
				startTime: '',
				endTime: '',
				desc: '',
			},
			formRules118: {
				name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
				startTime: [
					{ required: true, message: '请选择开始时间', trigger: 'change' },
				],
				endTime: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请选择结束时间!'))
							} else if (value < this.formData118.startTime) {
								callback(new Error('结束时间必须大于开始时间!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				desc: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
				areaImageList: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData118.areaImageList.length) {
								callback(new Error('请上传图片!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			formCfg118: [
				{
					type: 'input',
					title: '活动名称',
					dataIndex: 'name',
					placeholder: '请输入活动名称',
				},
				{
					title: '有效时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
				{
					title: '分享文案',
					type: 'input',
					dataIndex: 'desc',
					placeholder: '请输入分享文案',
				},
				{
					type: 'uploadImage',
					title: '分享图片',
					dataIndex: 'areaImageList',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'areaImageUrl',
						httpRequest: (file) => this.uploadImageHttpRequest(file),
					},
				},
			],
			formAction118: [],
		}
	},

	created() {
		this.getData116(true)
	},

	methods: {
		_generateQRCode: async function ({ id }) {
			let {
				data: { resultCode, resultData },
			} = await generateQRCode({
				id,
				page: 'pages/activityArea/activityArea',
			})
			if (resultCode == 0) {
				this.codeImagePath = getBigImg(resultData.codeImagePath) || ''
				this.dialogVisible119 = true
			}
		},
		addActivity() {
			this.dialogTitle117 = '新增活动'
			this.formData118 = {
				name: '',
				desc: '',
				startTime: '',
				endTime: '',
				areaImageList: [],
			}
			this.$nextTick(() => {
				this.$refs.dialog118.$refs.YxForm.clearValidate()
			})
			this.dialogVisible117 = true
		},
		saveAddActivityList: async function () {
			let paramJson = {
				activityName: this.formData118.name,
				desc: this.formData118.desc,
				startTime: moment(this.formData118.startTime).valueOf(),
				endTime: moment(this.formData118.endTime).valueOf(),
				image: this.formData118.areaImageList[0],
			}
			console.log(
				this.formData118.areaImageList,
				'this.formData118.areaImageList'
			)
			delete paramJson.image.areaImageUrl
			let res = null
			if (this.formData118.id) {
				paramJson.id = this.formData118.id
				res = await editActivity(paramJson)
			} else {
				res = await add(paramJson)
			}
			let {
				data: { resultCode, resultMsg },
			} = res
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible117 = false
				this.getData116(true)
			}
			console.log(paramJson)
		},
		async uploadImageHttpRequest(params) {
			//上传banner
			let formData = new FormData()
			formData.append('formId', '#portraitImageFrom')
			formData.append('data', JSON.stringify({ imageType: 73 }))
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			if (resultCode == 0) {
				resultData.imageList[0].areaImageUrl = getBigImg(
					resultData.imageList[0].imageUrl
				)
				this.formData118.areaImageList = resultData.imageList
				// this.$forceUpdate()
			}
		},
		async getData116(flag) {
			this.loading = true
			let paramJson = this.findSearchParams116(flag)
			const {
				data: { resultCode, resultData },
			} = await list(paramJson)
			if (resultCode == 0) {
				this.tableData116 = resultData.activityAreaList
				this.page116.count = resultData.count
			} else {
				this.tableData116 = []
				this.page116.count = 0
			}
			this.loading = false
		},
		findSearchParams116(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page116.currentPage = 1
			}
			const paramJson = Object.assign(this.formData115, {
				length: this.page116.length,
				startIndex: (this.page116.currentPage - 1) * this.page116.length,
			})
			return paramJson
		},
	},
}
</script>
<style scope>
.goods-group-btn-box {
	margin-bottom: 20px;
}
.c_image {
	height: 200px;
	width: 200px;
}
.code-box {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>

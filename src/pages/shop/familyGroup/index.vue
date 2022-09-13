<template>
	<div class="channelPage">
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="规则店主" name="one"> </el-tab-pane>
			<el-tab-pane label="特定店主" name="two"> </el-tab-pane>
		</el-tabs>
		<yx-form
			:inline="true"
			:data="formData181"
			:items="formCfg181"
			:formAction="formAction181"
		>
		</yx-form>
		<div class="goods-group-btn-box">
			<el-button v-auth="'mentorUpdate'" type="primary" @click="addChannel"
				>新建</el-button
			>
		</div>
		<yx-table
			:select="false"
			v-loading="loading"
			:columns="tableColumns103"
			:data="tableData103"
		>
		</yx-table>
		<el-pagination
			v-if="page103.count"
			style="margin: 30px 400px"
			:total="page103.count"
			:page-size="page103.length"
			:page-sizes="[5, 10, 20, 30, 40]"
			:current-page="page103.currentPage"
			layout="total, sizes, prev, pager, next, jumper"
			@current-change="nextPage"
			@size-change="handleSizeChange"
		/>
		<Dialog
			:title="dialogTitle104"
			:visible.sync="dialogVisible104"
			:width="dialogWidth104"
			:bottomBtn="windowsShow != 1 ? dialogBottomBtn104 : []"
		>
			<yx-form
				ref="formRef105"
				labelWidth="120px"
				:data="formData105"
				:items="formCfg105"
				:rules="formRules105"
				:formAction="formAction105"
			>
			</yx-form>
		</Dialog>
		<Dialog
			:visible.sync="dialogVisible105"
			width="500px"
			:bottomBtn="deleteBottomBtn"
		>
			<div>
				<h3>是否删除该店主的二维码和该店主信息</h3>
			</div>
		</Dialog>
	</div>
</template>
<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import { getBigImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'
import { mentorList, mentorUpdate } from '@/api/newMaterial'

export default {
	name: 'FamilyGroup',
	components: {
		YxForm,
		YxTable,
		Dialog,
	},
	props: [],
	data() {
		return {
			activeName: 'one',
			windowsShow: null,
			id: null,
			loading: false,
			dialogVisible105: false,
			deleteRow: {},
			formData181: {
				organizationId: '',
				shopCategory: 0,
			},
			formCfg181: [
				{
					type: 'inputNumber',
					title: '店铺ID',
					dataIndex: 'organizationId',
					placeholder: '请输入店铺ID(精准查询)',
				},
			],
			formAction181: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getData103(true)
					},
				},
				{
					title: '重置',
					isClear: true,
				},
			],
			tableData103: [],
			tableColumns103: [
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: '店铺ID',
				},

				{
					type: 'string',
					dataIndex: 'organizationName',
					title: '店铺名称',
				},
				{
					type: 'string',
					dataIndex: 'currentMonthEquityLevel',
					title: '本月权益等级',
					customRender: ({ currentMonthEquityLevel }) => {
						return currentMonthEquityLevel == 0
							? '非签约'
							: currentMonthEquityLevel == 1
							? '签约'
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'operatorName',
					title: '最后编辑者',
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '删除',
							auth: '',
							click: (row) => {
								console.log('111')
								this.dialogVisible105 = true
								this.deleteRow = row
							},
						},
						{
							title: '编辑',
							auth: 'mentorUpdate',
							click: (row) => {
								this.formData105.organizationId = row.organizationId
								if (row.enterpriseWechatQrCode) {
									this.formData105.image = [
										{
											imageUrl: row.enterpriseWechatQrCode,
										},
									]
								} else {
									this.formData105.image = []
								}
								this.id = row.id
								this.windowsShow = 2
								this.formCfg105[0].disabled = false
								this.formCfg105[1].disabled = false
								this.dialogTitle104 = '编辑'
								this.dialogVisible104 = true
							},
						},
						{
							title: '查看',
							auth: 'mentorDetail',
							click: (row) => {
								this.formData105.organizationId = row.organizationId
								if (row.enterpriseWechatQrCode) {
									this.formData105.image = [
										{
											imageUrl: row.enterpriseWechatQrCode,
										},
									]
								} else {
									this.formData105.image = []
								}
								this.windowsShow = 1
								this.formCfg105[0].disabled = true
								this.formCfg105[1].disabled = true
								this.dialogTitle104 = '查看'
								this.dialogVisible104 = true
							},
						},
					],
				},
			],
			page103: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData103()
				},
			},
			deleteBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this._deleteActChannelLanding()
					},
				},
			],
			dialogTitle104: '新增落地页',
			dialogWidth104: '600px',
			dialogVisible104: false,
			dialogBottomBtn104: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.formRef105.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveAddChannel()
							}
						})
					},
				},
			],
			formRules105: {
				organizationId: [
					{ required: true, message: '请输入店铺ID', trigger: 'blur' },
				],
				image: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData105.image.length) {
								callback(new Error('请上传二维码图片'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
			},
			formData105: {
				organizationId: '',
				image: [],
			},
			formCfg105: [
				{
					type: 'inputNumber',
					title: '店铺ID',
					dataIndex: 'organizationId',
					placeholder: '请输入店铺ID',
				},
				{
					type: 'uploadImage',
					title: '二维码',
					dataIndex: 'image',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'imageUrl',
						beforeAvatarUpload: (file) => this.beforeAvatarUpload(file),
						httpRequest: (file) => this.uploadImageHttpRequest(file),
					},
					hide: false,
				},
			],
			formAction105: [],
		}
	},

	created() {
		this.getData103(true)
	},

	methods: {
		// tab切换
		handleClick(tab) {
			if (tab.name == 'one') {
				this.getData103(true)
			} else {
				this.getData103(true)
			}
		},
		addChannel() {
			this.windowsShow = 3
			this.formCfg105[0].disabled = false
			this.formCfg105[1].disabled = false
			this.formData105 = {
				organizationId: '',
				image: [],
			}
			this.dialogTitle104 = '新建'
			this.dialogVisible104 = true
		},
		handleSizeChange(val) {
			this.page103.length = val
			this.getData103()
		},

		nextPage(val) {
			this.page103.currentPage = val
			this.getData103()
		},
		beforeAvatarUpload(file) {
			if (!/\.(jpg|jpeg|png|GIF|JPG|PNG|webp|svg|bmp|gif)$/.test(file.name)) {
				this.$message.warning('请上传jpg|jpeg|gif|bmp|png|webp|svg照片')
				return false
			} else {
				return file
			}
		},
		async uploadImageHttpRequest(params) {
			if (
				!/\.(jpg|jpeg|png|GIF|JPG|PNG|webp|svg|bmp|gif)$/.test(params.file.name)
			) {
				this.$message.warning('请上传jpg|jpeg|gif|bmp|png|webp|svg照片')
				return
			}
			//上传海报
			let formData = new FormData()
			formData.append('formId', '#posterImageFrom')
			formData.append('data', JSON.stringify({ imageType: 62 }))
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			if (resultCode == 0) {
				this.formData105.image.push({
					imageUrl: getBigImg(resultData.imageList[0].imageUrl),
					imageList: resultData.imageList,
				})
			}
			this.$forceUpdate()
		},
		saveAddChannel: async function () {
			let paramJson = {
				organizationId: this.formData105.organizationId,
				enterpriseWechatQrCode: this.formData105.image[0].imageUrl,
			}
			if (this.windowsShow == 2) {
				paramJson.id = this.id
			}
			if (this.activeName === 'one') {
				paramJson.shopCategory = 1
			} else {
				paramJson.shopCategory = 2
			}
			let flag = false
			let {
				data: { resultCode, resultMsg },
			} = await mentorUpdate(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible104 = false
				this.getData103(flag)
			}
		},
		// 删除分组
		_deleteActChannelLanding: async function () {
			let paramJson = {
				id: this.deleteRow.id, //id
				organizationId: this.deleteRow.organizationId,
			}
			if (this.activeName === 'one') {
				paramJson.shopCategory = 1
			} else {
				paramJson.shopCategory = 2
			}
			let {
				data: { resultCode, resultMsg },
			} = await mentorUpdate(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.getData103(true)
				this.dialogVisible105 = false
			}
		},
		async getData103(flag) {
			this.loading = true
			let paramJson = this.findSearchParams103(flag)
			if (this.activeName === 'one') {
				paramJson.shopCategory = 1
			} else {
				paramJson.shopCategory = 2
			}
			const {
				data: { resultCode, resultData },
			} = await mentorList(paramJson)
			if (resultCode == 0) {
				this.tableData103 = resultData.records
				this.page103.count = resultData.total
			} else {
				this.tableData103 = []
				this.page103.count = 0
			}
			this.loading = false
		},
		findSearchParams103(flag) {
			//搜索条件
			let paramJson = Object.assign(this.formData181, {
				pageNum: 1,
				pageSize: 10,
			})
			// 每页的加载数据长度
			paramJson.pageSize = this.page103.length
			// 当前页的条数开始
			if (flag) {
				this.page103.currentPage = 1
			}
			paramJson.pageNum = this.page103.currentPage
			return paramJson
		},
	},
}
</script>
<style lang="scss" scope>
.goods-group-btn-box {
	margin-bottom: 20px;
}
</style>

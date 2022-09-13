<template>
	<div class="channelPage">
		<basicContainer>
			<div class="goods-group-btn-box">
				<el-button
					v-auth="'saveActChannelLanding'"
					type="primary"
					@click="addChannel"
					>新增落地页</el-button
				>
			</div>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns103"
				:pagination="page103"
				:data="tableData103"
			>
				<template slot="state" slot-scope="scope">
					<div>
						<el-tag v-if="scope.row.state == 0" type="warning">异常</el-tag>
						<el-tag v-if="scope.row.state == 2" type="danger">禁用</el-tag>
						<el-tag v-if="scope.row.state == 1">启用</el-tag>
					</div>
				</template>
			</yx-table>
			<Dialog
				:title="dialogTitle104"
				:visible.sync="dialogVisible104"
				:width="dialogWidth104"
				:bottomBtn="dialogBottomBtn104"
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
	getActChannelLandingList,
	deleteActChannelLanding,
	updateActChannelLanding,
	saveActChannelLanding,
} from '@/api/actChannelLanding'

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
			loading: false,
			tableData103: [],
			tableColumns103: [
				{
					type: 'string',
					dataIndex: 'landingName',
					title: '落地页名称',
				},
				{
					type: 'image',
					dataIndex: 'posterBigUrl',
					title: '落地页海报',
				},
				{
					type: 'string',
					dataIndex: 'linkageChannel',
					title: '关联渠道',
				},
				{
					type: 'string',
					dataIndex: 'landingPageType',
					title: '落地页类型',
					customRender: ({ landingPageType }) => {
						return landingPageType == 1
							? '直接获取手机号'
							: landingPageType == 2
							? '需要手机验证码'
							: '直接获取手机号'
					},
				},
				{
					type: 'string',
					dataIndex: 'jumpPath',
					title: '注册后跳转路径',
				},
				{
					type: 'string',
					dataIndex: 'channelPage',
					title: '落地页URL',
					customRender: ({ actChannelLandingId }) => {
						return 'pages/channelPage/channelPage?id=' + actChannelLandingId
					},
				},
				{
					type: 'custom',
					dataIndex: 'state',
					title: '状态',
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '删除',
							auth: 'saveActChannelLanding',
							popconfirm: true,
							popconfirmTitle: '确认要删除该落地页吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._deleteActChannelLanding(row)
							},
						},
						{
							title: '编辑',
							auth: 'saveActChannelLanding',
							click: (row) => {
								this.formData105 = Object.assign({}, row)
								this.formData105.channelPage =
									'pages/channelPage/channelPage?id=' + row.actChannelLandingId
								if (row.posterBigUrl) {
									this.formData105.posterImageList = [
										{
											posterBigUrl: row.posterBigUrl,
										},
									]
								} else {
									this.formData105.posterImageList = []
								}
								this.formCfg105[this.formCfg105.length - 1].hide = false
								this.dialogTitle104 = '编辑落地页'
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
						// this.dialogVisible104 = false
					},
				},
			],
			formRules105: {
				landingName: [
					{ required: true, message: '请输入活动标题', trigger: 'blur' },
				],
				linkageChannel: [
					{ required: true, message: '请选择关联渠道', trigger: 'blur' },
				],
				posterImageList: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData105.posterImageList.length) {
								callback(new Error('请上传banner图片'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				registerBtn: [
					{ required: true, message: '请输入注册按钮文案', trigger: 'blur' },
				],
			},
			formData105: {
				landingName: '',
				linkageChannel: '',
				posterImageList: [],
				registerBtn: '',
				jumpPath: '',
				state: '',
				landingPageType: '',
			},
			formCfg105: [
				{
					type: 'input',
					title: '活动标题',
					dataIndex: 'landingName',
					placeholder: '请输入活动标题',
				},
				{
					type: 'select',
					title: '关联渠道',
					dataIndex: 'linkageChannel',
					placeholder: '请选择关联渠道',
					label: 'value',
					options: [
						{
							value: '渠道服务商3',
							linkageChannel: '渠道服务商3',
						},
						{
							linkageChannel: '百度搜索',
							value: '百度搜索',
						},
						{
							linkageChannel: '360搜索',
							value: '360搜索',
						},
						{
							linkageChannel: '凌希2',
							value: '凌希2',
						},
						{
							linkageChannel: '橙陨首购CPA',
							value: '橙陨首购CPA',
						},
						{
							linkageChannel: '繁笙首购CPA',
							value: '繁笙首购CPA',
						},
						{
							linkageChannel: '凌希首购CPA',
							value: '凌希首购CPA',
						},
						{
							linkageChannel: '正西首购CPA',
							value: '正西首购CPA',
						},
						{
							linkageChannel: '宏创首购CPA',
							value: '宏创首购CPA',
						},
						{
							linkageChannel: '渠道示例',
							value: '渠道示例',
						},
						{
							linkageChannel: '西瓜皮公众号',
							value: '西瓜皮公众号',
						},
						{
							linkageChannel: '亿远UV_A',
							value: '亿远UV_A',
						},
						{
							linkageChannel: '百姓网wap_BD',
							value: '百姓网wap_BD',
						},
						{
							linkageChannel: '新先视CPS微信',
							value: '新先视CPS微信',
						},
						{
							linkageChannel: '微信群',
							value: '微信群',
						},
						{
							linkageChannel: '朋友圈广告',
							value: '朋友圈广告',
						},
						{
							linkageChannel: 'TZ',
							value: 'TZ',
						},
						{
							linkageChannel: '斗米兼职',
							value: '斗米兼职',
						},
						{
							linkageChannel: 'JNY',
							value: 'JNY',
						},
						{
							linkageChannel: 'mmg',
							value: 'mmg',
						},
						{
							linkageChannel: 'ytt',
							value: 'ytt',
						},
						{
							linkageChannel: '头条渠道',
							value: '头条渠道',
						},
						{
							linkageChannel: '孩教圈推广',
							value: '孩教圈推广',
						},
						{
							linkageChannel: '小程序引导页',
							value: '小程序引导页',
						},
						{
							linkageChannel: '推广渠道',
							value: '推广渠道',
						},
						{
							linkageChannel: '渠道代理商',
							value: '渠道代理商',
						},
						{
							linkageChannel: '腾讯广告推广',
							value: '腾讯广告推广',
						},
						{
							linkageChannel: '邀请码注册',
							value: '邀请码注册',
						},
						{
							linkageChannel: '未知',
							value: '未知',
						},
						{
							linkageChannel: '淘客-黄蜂',
							value: '淘客-黄蜂',
						},
						{
							linkageChannel: '淘客-野蛮',
							value: '淘客-野蛮',
						},
						{
							linkageChannel: '淘客-核桃',
							value: '淘客-核桃',
						},
						{
							linkageChannel: '备用1',
							value: '备用1',
						},
						{
							linkageChannel: '备用2',
							value: '备用2',
						},
						{
							linkageChannel: '备用3',
							value: '备用3',
						},
						{
							linkageChannel: '备用4',
							value: '备用4',
						},
						{
							linkageChannel: '备用5',
							value: '备用5',
						},
						{
							linkageChannel: '备用6',
							value: '备用6',
						},
						{
							linkageChannel: '备用7',
							value: '备用7',
						},
						{
							linkageChannel: '备用8',
							value: '备用8',
						},
						{
							linkageChannel: '备用9',
							value: '备用9',
						},
						{
							linkageChannel: '备用10',
							value: '备用10',
						},
					],
				},
				{
					type: 'uploadImage',
					title: '落地页海报',
					dataIndex: 'posterImageList',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'posterBigUrl',
						httpRequest: (file) => this.uploadImageHttpRequest(file),
					},
				},
				{
					title: '注册按钮文案',
					type: 'input',
					dataIndex: 'registerBtn',
					placeholder: '请输入注册按钮文案',
				},
				{
					title: '注册后跳转路径',
					type: 'input',
					dataIndex: 'jumpPath',
					placeholder: '请输入注册后跳转路径',
				},
				{
					title: '状态',
					type: 'radio',
					dataIndex: 'state',
					label: 'value',
					options: [
						{
							value: '启用',
							state: 1,
						},
						{
							state: 2,
							value: '禁用',
						},
					],
				},
				{
					title: '落地页类型',
					type: 'radio',
					dataIndex: 'landingPageType',
					label: 'value',
					options: [
						{
							value: '直接获取手机号',
							landingPageType: 1,
						},
						{
							landingPageType: 2,
							value: '需要手机验证码',
						},
					],
				},
				{
					type: 'text',
					dataIndex: 'channelPage',
					title: '落地页URL',
					hide: true,
				},
			],
			formAction105: [],
		}
	},

	created() {
		this.getData103(true)
	},

	methods: {
		addChannel() {
			this.formData105 = {
				landingName: '',
				linkageChannel: '',
				posterImageList: [],
				registerBtn: '',
				jumpPath: '',
				state: 1,
				landingPageType: 1,
			}
			this.formCfg105[this.formCfg105.length - 1].hide = true
			this.dialogTitle104 = '新增落地页'
			this.dialogVisible104 = true
		},
		async uploadImageHttpRequest(params) {
			//上传海报
			let formData = new FormData()
			formData.append('formId', '#posterImageFrom')
			formData.append('data', JSON.stringify({ imageType: 62 }))

			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			if (resultCode == 0) {
				resultData.imageList[0].posterBigUrl = getBigImg(
					resultData.imageList[0].imageUrl
				)
				this.formData105.posterImageList = resultData.imageList
			}
			this.$forceUpdate()
		},
		saveAddChannel: async function () {
			let paramJson = {
				landingName: this.formData105.landingName,
				linkageChannel: this.formData105.linkageChannel,
				state: this.formData105.state,
				landingPageType: this.formData105.landingPageType,
				registerBtn: this.formData105.registerBtn,
				jumpPath: this.formData105.jumpPath,
			}
			if (this.formData105.posterImageList[0].imageId) {
				paramJson.posterUrl = this.formData105.posterImageList[0]
				delete paramJson.posterUrl.posterBigUrl
				paramJson.posterUrl = JSON.stringify(paramJson.posterUrl)
			}
			let res = null
			let flag = false
			if (this.formData105.actChannelLandingId) {
				paramJson.actChannelLandingId = this.formData105.actChannelLandingId
				res = await updateActChannelLanding(paramJson)
			} else {
				flag = true
				res = await saveActChannelLanding(paramJson)
			}
			let {
				data: { resultCode, resultMsg },
			} = res
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible104 = false
				this.getData103(flag)
			}
		},
		// 删除分组
		_deleteActChannelLanding: async function ({ actChannelLandingId }) {
			let {
				data: { resultCode, resultMsg },
			} = await deleteActChannelLanding({
				actChannelLandingId, //分组id
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.getData103(true)
			}
		},
		async getData103(flag) {
			this.loading = true
			let paramJson = this.findSearchParams103(flag)
			const {
				data: { resultCode, resultData },
			} = await getActChannelLandingList(paramJson)
			if (resultCode == 0) {
				resultData.actChannelLandingList.map((item) => {
					if (item.posterUrl) {
						item.posterBigUrl = getBigImg(item.posterUrl)
					}
				})
				this.tableData103 = resultData.actChannelLandingList
				this.page103.count = resultData.pageCount
			} else {
				this.tableData103 = []
				this.page103.count = 0
			}
			this.loading = false
		},
		findSearchParams103(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page103.currentPage = 1
			}
			const paramJson = Object.assign(
				{},
				{
					length: this.page103.length,
					startIndex: (this.page103.currentPage - 1) * this.page103.length,
				}
			)
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

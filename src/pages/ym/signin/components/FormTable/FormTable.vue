<template>
	<el-tabs v-model="activeTab" @tab-click="handleTabClick">
		<el-tab-pane label="体验卡兑换记录" name="record">
			<basic-container>
				<yx-form
					v-loading="exportLoading"
					:inline="true"
					:data="searchData"
					:items="searchCfg"
					:formAction="searchAction"
					labelWidth="7em"
				></yx-form>

				<YxTable
					v-loading="loading"
					:select="true"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
				</YxTable>

				<EditDialog
					ref="activityEdit"
					:visible.sync="activityEditDialog"
					@fatherMethodInit="fatherMethodInit"
				/>

				<EditSettleTimeDialog
					ref="settleTimeEdit"
					:visible.sync="settleTimeEditDialog"
				/>
			</basic-container>
		</el-tab-pane>
		<el-tab-pane label="广告位设置" name="ad">
			<basic-container>
				<div style="width: 700px">
					<yx-form
						ref="form"
						v-loading="showLoading"
						:inline="false"
						:items="adItem"
						:data="formData"
						:rules="formRules"
						labelWidth="150px"
						:formAction="formAction"
					>
						<template #advertisingPicUrl>
							<el-upload
								class="avatar-uploader"
								action="#"
								:show-file-list="false"
								:file-list="fileList"
								:http-request="uploadImageHttpRequest"
							>
								<i
									v-if="formData.advertisingPicUrl"
									class="el-icon-close ivbox-icon"
									@click.stop="deleteImg"
								></i>
								<img
									v-if="formData.advertisingPicUrl"
									:src="formData.advertisingPicUrl"
									class="avatar"
								/>
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</template>
						<template #wechatAppletsJumpLink>
							<el-input
								v-model.trim="formData.wechatAppletsJumpLink"
								placeholder="请输入微信小程序跳转链接"
							></el-input>
						</template>
						<template #appH5JumpLink>
							<el-input
								v-model.trim="formData.appH5JumpLink"
								placeholder="请输入APP-H5跳转链接"
							></el-input>
						</template>
						<template #appJumpLink>
							<el-input
								v-model.trim="formData.appJumpLink"
								placeholder="请输入APP原生跳转链接"
							></el-input>
							<div style="color: #999">APP-H5链接跟原生链接填其中一即可</div>
						</template>
					</yx-form>
				</div>
			</basic-container>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import moment from 'moment'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { uploadImgToCos } from '@/utils/upload'
import { numberFormat } from '@/utils/helper/common'
import {
	signinExchangeList,
	advertisingSaveOrUpdate,
	advertisingSelectAdvertising,
} from '@/api/marketing'

export default {
	components: {
		BasicContainer,
		YxTable,
		YxForm,
	},

	name: 'FormTable',

	data() {
		return {
			activeTab: 'record',
			selectionData: [],
			numberFormat,
			actId: '',
			moment,
			exportLoading: false,
			loading: false,
			sum: {},
			levelMap: {
				1: '实习店主',
				2: '正式店主',
				3: '进阶店主',
				4: '优秀服务商',
				5: '签约服务商',
			},
			searchData: {
				exchangePhone: '',
				exchangeType: '',
				startTime: '',
				endTime: '',
			},
			searchCfg: [
				{
					title: '兑换店铺手机',
					type: 'input',
					dataIndex: 'exchangePhone',
					placeholder: '请输入兑换店铺手机',
				},
				{
					type: 'select',
					title: '兑换类型',
					dataIndex: 'exchangeType',
					label: 'value',
					options: [
						{
							exchangeType: '',
							value: '全部',
						},
						{
							exchangeType: 1,
							value: '自己店铺',
						},
						{
							exchangeType: 2,
							value: '好友店铺',
						},
					],
				},
				{
					title: '申请时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
				},
			],
			searchAction: [
				{
					title: '搜索',
					type: 'primary',
					click: () => {
						this.init(true)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					dataIndex: 'signInOrganizationId',
					title: '申请店铺ID',
				},
				{
					dataIndex: 'signInOrganizationName',
					title: '店铺昵称',
				},
				{
					dataIndex: 'signInOrgEquityLevel',
					title: '申请前权益等级',
					customRender: (row) => {
						return this.levelMap[row.signInOrgEquityLevel] || '-'
					},
				},
				{
					dataIndex: 'exchangeType',
					title: '兑换类型',
					customRender: (row) => {
						const exchangeType = {
							1: '自己店铺',
							2: '好友店铺',
						}
						return exchangeType[row.exchangeType]
					},
				},
				{
					dataIndex: 'exchangeOrganizationId',
					title: '兑换店铺ID',
				},
				{
					dataIndex: 'exchangeOrganizationPhone',
					title: '兑换店铺手机',
				},
				{
					dataIndex: 'exchangeOrgEquityLevel',
					title: '兑换前权益等级',
					customRender: (row) => {
						return this.levelMap[row.exchangeOrgEquityLevel] || '-'
					},
				},
				{
					dataIndex: 'exchangeTime',
					title: '申请时间',
					customRender: (row) => {
						return row.exchangeTime
							? moment(row.exchangeTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},

			showLoading: false,
			fileList: [],
			tempFileUrlList: [],
			adItem: [
				{
					title: '广告图',
					type: 'custom',
					dataIndex: 'advertisingPicUrl',
				},
				{
					title: '微信小程序跳转链接',
					type: 'custom',
					dataIndex: 'wechatAppletsJumpLink',
				},
				{
					title: 'APP-H5跳转链接',
					type: 'custom',
					dataIndex: 'appH5JumpLink',
				},
				{
					title: 'APP原生跳转链接',
					type: 'custom',
					dataIndex: 'appJumpLink',
				},
			],
			formData: {
				id: '',
				advertisingPicUrl: '',
				wechatAppletsJumpLink: '',
				appH5JumpLink: '',
				appJumpLink: '',
			},
			formRules: {},
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
			],
		}
	},

	created() {
		this.actId = this.$route.params.actId
		const now = new Date()
		this.searchData.startTime = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate() - 6
		)
		this.searchData.endTime = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate(),
			23,
			59,
			59
		)
		this.init()
	},

	methods: {
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign({}, this.searchData, {
				startTime: moment(this.searchData.startTime).valueOf() || '',
				endTime: moment(this.searchData.endTime).valueOf() || '',
			})
			if (flag) {
				this.page.currentPage = 1
			}
			// 每页的加载数据长度
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			paramJson.pageNum = this.page.currentPage
			return paramJson
		},

		fatherMethodInit() {
			this.init(true)
		},

		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true

			const {
				data: { resultData },
			} = await signinExchangeList(paramJson)

			if (resultData && resultData.records?.length > 0) {
				this.tableData = resultData.records
				this.page.count = resultData.total
			} else {
				this.page.count = 0
				this.tableData = []
			}

			await this.fetchAd()

			this.loading = false
		},

		async fetchAd() {
			const {
				data: { resultCode, resultData },
			} = await advertisingSelectAdvertising()
			if (resultCode === 0 && resultData && resultData.id) {
				this.formData.id = resultData.id
				this.formData.advertisingPicUrl = resultData.advertisingPicUrl || ''
				this.formData.wechatAppletsJumpLink =
					resultData.wechatAppletsJumpLink || ''
				this.formData.appH5JumpLink = resultData.appH5JumpLink || ''
				this.formData.appJumpLink = resultData.appJumpLink || ''
			}
		},

		deleteImg() {
			this.fileList = []
			this.formData.advertisingPicUrl = ''
		},

		/* 上传图片 s */
		handleImgData() {},
		beforeRemove(file, fileList) {
			// 删除文件前
			// this.newFileList = fileList
			for (let i = 0; i < fileList.length; i++) {
				if (fileList[i].uid == file.uid) {
					this.tempFileUrlList.splice(i, 1)
					return
				}
			}
		},
		// 文件列表改变
		onChange(_, fileList) {
			this.fileList = fileList
		},
		uploadImageHttpRequest: async function (params) {
			const isType = /\.(jpg|jpeg|png|GIF|gif|JPG|PNG)$/.test(
				params.file.name.toLocaleLowerCase()
			)
			if (!isType) {
				return this.$message.warning('不支持的上传类型')
			}

			const result = await uploadImgToCos(params.file)
			this.formData.advertisingPicUrl = result.url
		},
		async submitForm() {
			let paramsData = Object.assign({}, this.formData)
			if (!this.formData.id) {
				delete paramsData.id
			}

			this.showLoading = true
			const res = await advertisingSaveOrUpdate(this.formData)
			const resultCode = res.data.resultCode
			if (resultCode == 0) {
				this.$message({
					message: '操作成功',
					type: 'success',
				})
			}
			this.fetchAd()
			this.showLoading = false
		},
	},
}
</script>
<style lang="scss" scoped>
.avatar-uploader ::v-deep {
	.el-upload {
		border: 1px dashed #d9d9d9 !important;
		border-radius: 6px !important;
		cursor: pointer !important;
		position: relative !important;
		overflow: hidden !important;
	}
	.el-upload:hover {
		border-color: #409eff !important;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 80px;
		height: 80px;
		line-height: 80px;
		text-align: center;
	}
	.avatar {
		width: 80px;
		height: 80px;
		display: block;
	}
	.ivbox-icon {
		position: absolute;
		right: 0;
		top: 0;
		z-index: 999;
		font-size: 16px;
		text-shadow: 0px 0px 1px #fff;
	}
}
</style>

<template>
	<div class="wg_main">
		<basicContainer>
			<!-- <el-button type="primary" class="el-icon-right" @click="oldSystem"
				>老系统</el-button
			> -->
			<div class="container">
				<div class="check-msg">
					<label>头像：</label>
					<img style="width: 100px" :src="getBigImg(detail.portrait)" />
				</div>

				<yx-info :data="detail" :items="infoItems">
					<!-- 自定义插槽 -->
				</yx-info>
			</div>
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane label="所在群组" name="getImUserGroupPage">
					<span slot="label">所在群组 </span>
					<yx-form
						:inline="true"
						ref="UserGroup"
						labelWidth="70px"
						:data="dialogData"
						:items.sync="dialogCfg"
						:formAction="funAction"
					>
					</yx-form>

					<YxTable
						v-loading="tableLoding"
						:columns="tableColumns"
						:pagination="page"
						:data="tableData"
					>
					</YxTable>
				</el-tab-pane>
				<el-tab-pane label="好友" name="getImUserFriendPage">
					<span slot="label">好友 </span>
					<yx-form
						:inline="true"
						ref="UserGroup"
						labelWidth="70px"
						:data="dialogDataUser"
						:items.sync="dialogCfgUser"
						:formAction="funActionUser"
					>
					</yx-form>

					<YxTable
						v-loading="tableLoding"
						:columns="tableUserColumns"
						:pagination="pageUser"
						:data="tableUser"
					>
					</YxTable
				></el-tab-pane>
			</el-tabs>
		</basicContainer>
	</div>
</template>
<script>
import { numberFormat } from '@/utils/helper/common'
import YxInfo from '@wg-vue-materials/yx-info'
import YxForm from '@wg-vue-materials/yx-form'
import { getBigImg } from '@/utils/imageTool'
import {
	getImUserDetails,
	getImUserGroupPage,
	getImUserFriendPage,
} from '@/api/cmsImUser.js'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'

export default {
	name: 'MerchantImportRecord',
	components: { BasicContainer, YxTable, YxInfo, YxForm },
	data() {
		return {
			getBigImg,
			imUserId: this.$route.params.imUserId,
			tableLoding: false,
			authList: {},
			activeName: 'getImUserGroupPage',
			detail: {},
			numberFormat: numberFormat,
			infoItems: [
				{
					type: 'string',
					title: 'IM_id',
					dataIndex: 'imUserId',
				},
				{
					type: 'string',
					title: '用户昵称',
					dataIndex: 'name',
				},
				{
					type: 'string',
					title: '账号',
					dataIndex: 'account',
				},
				{
					type: 'string',
					title: '手机号',
					dataIndex: 'phoneMob',
				},
				{
					type: 'string',
					title: '用户类型',
					dataIndex: 'status',
					customRender: (row) => {
						return row.type === 1 ? '店主' : '员工'
					},
				},

				{
					type: 'string',
					title: '创建时间',
					dataIndex: 'addTime',
					customRender: (row) => {
						return row.addTime
							? moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
			],
			dialogData: {
				imGroupId: '',
				name: '',
				groupMasterName: '',
				type: '',
			},
			funAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getImUserGroupPage()
					},
				},
			],
			dialogCfg: [
				{
					type: 'input',
					title: '群组id',
					dataIndex: 'imGroupId',
				},
				{
					type: 'input',
					title: '用户昵称',
					dataIndex: 'name',
				},
				{
					type: 'input',
					title: '群主',
					dataIndex: 'groupMasterName',
				},
				{
					title: '用户类型',
					type: 'select',
					dataIndex: 'type',
					options: [
						{
							type: '',
							value: '全部',
						},
						{
							type: 1,
							value: '实习店主',
						},
						{
							type: 2,
							value: '正式店主',
						},
						{
							type: 3,
							value: '进阶店主',
						},
						{
							type: 4,
							value: '优秀店主',
						},
						{
							type: 5,
							value: '副本群',
						},
					],
					label: 'value',
				},
			],
			dialogDataUser: {
				friendId: '',
				name: '',
				phoneMob: '',
				type: '',
			},
			dialogCfgUser: [
				{
					type: 'input',
					title: 'IM_id',
					dataIndex: 'friendId',
				},
				{
					type: 'input',
					title: '用户昵称',
					dataIndex: 'name',
				},
				{
					type: 'input',
					title: '手机号',
					dataIndex: 'phoneMob',
				},
				{
					title: '用户类型',
					type: 'select',
					dataIndex: 'type',
					options: [
						{
							type: '',
							value: '全部',
						},
						{
							type: 1,
							value: '店主',
						},
						{
							type: 2,
							value: '员工',
						},
					],
					label: 'value',
				},
			],
			funActionUser: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getImUserFriendPage()
					},
				},
			],
			// 所在群组
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'imGroupId',
					title: '群组id',
				},
				{
					type: 'string',
					dataIndex: 'name',
					title: '群组名称',
				},
				{
					type: 'string',
					dataIndex: 'type',
					title: '群组类型',
					customRender: (row) => {
						// 群组类型 1~5 实习店主/正式店主/进阶店主/优秀店主/副本群；
						let typeMap = [
							'实习店主',
							'正式店主',
							'进阶店主',
							'优秀店主',
							'副本群',
						]
						return typeMap[row.type]
					},
				},
				{
					type: 'string',
					dataIndex: 'groupMasterName',
					title: '群主',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getImUserGroupPage()
				},
			},
			tableData: [],
			tableUserColumns: [
				{
					type: 'string',
					dataIndex: 'imUserId',
					title: 'IM_id',
				},
				{
					type: 'string',
					dataIndex: 'phoneMob',
					title: '手机号',
				},
				{
					type: 'string',
					dataIndex: 'name',
					title: '用户昵称',
				},
				{
					type: 'string',
					dataIndex: 'type',
					title: '用户类型',
					customRender: (row) => {
						let typeMap = ['店主', '员工']
						return typeMap[row.type]
					},
				},
			],
			pageUser: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getImUserFriendPage()
				},
			},
			tableUser: [],
		}
	},
	created() {
		// 获取详情
		this._getImUserDetails()
		// 获取所在群组
		this._getImUserGroupPage(true)
	},
	methods: {
		// 打开老系统
		oldSystem() {
			window.open(
				`/yhtplus/web/communityUserCenterDetail.html?imUserId=${this.imUserId}`
			)
		},
		handleClick({ name }) {
			// tab拦点击事件
			if (this.tableLoding) {
				return
			}
			if (name == 'getImUserGroupPage') {
				// 获取所在群组
				this._getImUserGroupPage(true)
			} else if (name == 'getImUserFriendPage') {
				// 获取好友
				this._getImUserFriendPage(true)
			}
		},
		async _getImUserDetails() {
			// 详情
			let params = {
				imUserId: this.imUserId,
			}
			let {
				data: { resultCode, resultData },
			} = await getImUserDetails(params)
			if (resultCode == 0) {
				this.detail = resultData
			}
		},

		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.dialogData, {
				startIndex: 0,
				length: 1,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		async _getImUserGroupPage(flag) {
			// 获取所在群组列表
			this.tableLoding = true
			let params = this.findSearchParams(flag)
			params.imUserId = this.imUserId
			let {
				data: { resultCode, resultData },
			} = await getImUserGroupPage(params)
			if (resultCode === 0) {
				this.tableData = resultData.records
				this.page.count = resultData.total
			}
			this.tableLoding = false
		},
		findSearchParamsUser(flag) {
			//搜索条件
			let paramJson = Object.assign(this.dialogDataUser, {
				startIndex: 0,
				length: 1,
			})
			// 每页的加载数据长度
			paramJson.length = this.pageUser.length
			// 当前页的条数开始
			if (flag) {
				this.pageUser.currentPage = 1
			}
			paramJson.startIndex =
				(this.pageUser.currentPage - 1) * this.pageUser.length
			return paramJson
		},
		async _getImUserFriendPage(flag) {
			// 获取好友列表
			this.tableLoding = true
			let params = this.findSearchParamsUser(flag)
			params.imUserId = this.imUserId

			let {
				data: { resultCode, resultData },
			} = await getImUserFriendPage(params)
			if (resultCode == 0) {
				this.tableUser = resultData.records
				this.pageUser.count = resultData.total
			}
			this.tableLoding = false
		},
	},
}
</script>

<style lang="scss" scoped>
.mt10 {
	margin-top: 10px;
}

.data_list {
	width: 100%;
	display: flex;
	align-items: center;
	font-size: 14px;
	border: 1px solid #e8e8e8;
	border-right: 0;
}

.data_list + .data_list {
	border-top: 0;
}

.mt-10 {
	margin-top: -10px;
}

.data_item {
	display: flex;
	justify-content: center;
	flex: 1;
	padding: 25px 0;
	text-align: center;
	border-right: 1px solid #e8e8e8;
}
.data_msg {
	margin: 0 10px;
}
.data_btn {
	margin-top: 5px;
	padding: 0 15px;
	height: 32px;
	line-height: 32px;
}
.capital_images {
	width: 50px;
	height: 50px;
	background-image: url(../../../../static/images/capital_images.png);
	background-size: 50px 50px;
	background-repeat: no-repeat;
}

::v-deep .basic-container {
	padding: 20px 0;
}
.info-container {
	padding: 10px 0 35px;
}
</style>

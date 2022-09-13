<template>
	<div>
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData105"
				:items="formCfg105"
				:formAction="formAction105"
			>
			</yx-form>
			<yx-table
				:select="true"
				v-loading="loading"
				:columns="tableColumns106"
				:pagination="page106"
				:data="tableData106"
			>
			</yx-table>

			<!-- //查看数据 -->
			<Dialog
				title="查看数据"
				:visible="viewDatapopUp"
				width="50%"
				@before-close="viewDatapopUp = false"
			>
				<yx-form
					:inline="true"
					:data="formData101"
					:items="formCfg101"
					:formAction="formAction101"
				>
				</yx-form>
				<div class="font_siwe">
					老店主邀请新店主的二维码详情页访问 (uv):{{
						resultData102.invitationQrcodeDetailVisit
					}}
				</div>
				<div class="font_siwe">
					老店主邀请新店主H5页面访问 (uv):{{ resultData102.invitationH5Visit }}
				</div>
				<div class="font_siwe" style="margin-bottom: 20px">
					老店主邀请新店主点击邀请页面下载按钮人数 (uv):{{
						resultData102.invitationClickDownloadButton
					}}
				</div>
				<yx-table v-loading="loading" :columns="Table101" :data="TableData101">
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
	listAppInvitation,
	exportAppInvitation,
	invitationStatisticsByDate,
	invitationStatisticsList,
} from '@/api/cmsAppInvitation'
import { downloadFile } from '@/utils/helper/common'

export default {
	name: 'InviteStatisticsList',
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
			viewDatapopUp: false,
			TableData101: [],
			resultData102: [],
			formData105: {
				invitationShopId: '',
				startTime: '',
				endTime: '',
			},
			formData101: {
				startTime: moment().startOf('day').valueOf(), // 开始时间
				endTime: moment().endOf('day').valueOf(), // 结束时间
			},
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.viewData102()
					},
				},
			],
			formCfg101: [
				{
					title: '时间段统计',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
				},
			],
			Table101: [
				{
					type: 'string',
					dataIndex: 'date',
					title: '时间',
				},
				{
					type: 'string',
					dataIndex: 'invitationQrcodeDetailVisit',
					title: '邀请二维码详情页访问',
				},
				{
					type: 'string',
					dataIndex: 'invitationH5Visit',
					title: '邀请H5页面访问',
				},
				{
					type: 'string',
					dataIndex: 'invitationClickDownloadButton',
					title: '点击邀请页面下载按钮人数',
				},
				{
					type: 'string',
					dataIndex: 'invitationH5VisitRate',
					title: '邀请H5页面访问/邀请二维码详情页访问',
					customRender: (row) => {
						return row.invitationH5VisitRate && row.invitationH5VisitRate > 0
							? row.invitationH5VisitRate + '%'
							: row.invitationH5VisitRate
					},
				},
				{
					type: 'string',
					dataIndex: 'invitationClickDownloadButtonRate',
					title: '邀请H5页面访问/邀请二维码详情页访问',
					customRender: (row) => {
						return row.invitationClickDownloadButtonRate &&
							row.invitationClickDownloadButtonRate > 0
							? row.invitationClickDownloadButtonRate + '%'
							: row.invitationClickDownloadButtonRate
					},
				},
			],
			formCfg105: [
				{
					type: 'input',
					title: '邀请店主ID',
					dataIndex: 'invitationShopId',
					placeholder: '请输入邀请店主ID',
				},
				{
					title: '选择时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
				},
			],
			formAction105: [
				{
					title: '重置',
					auth: '',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: (e) => {
						this._listAppInvitation(true, e)
					},
				},
				{
					title: '导出',
					type: 'primary',
					click: () => {
						this.deriveHzw(true)
					},
				},
				{
					title: '查看数据',
					type: 'info',
					click: () => {
						this.viewData100(true)
					},
				},
			],
			tableData106: [],
			tableColumns106: [
				{
					type: 'string',
					dataIndex: 'invitedShopId',
					title: '受邀店主ID',
				},
				{
					type: 'string',
					dataIndex: 'invitedShopName',
					title: '受邀店主名称',
				},
				{
					type: 'string',
					dataIndex: 'invitedShopkeeperPhone',
					title: '受邀店主手机号',
				},
				{
					type: 'string',
					dataIndex: 'invitationShopId',
					title: '邀请店主ID',
				},
				{
					type: 'string',
					dataIndex: 'invitationShopName',
					title: '邀请店主昵称',
				},
				{
					type: 'string',
					dataIndex: 'updateTime',
					title: '操作时间',
					customRender: (row) => {
						return row.updateTime
							? moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
			],
			page106: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._listAppInvitation()
				},
			},
		}
	},

	created() {
		this._listAppInvitation(true)
	},

	methods: {
		viewData100() {
			this.viewDatapopUp = true
			this.viewData101()
			this.viewData102()
		},
		//查看数据
		viewData101: async function () {
			this.loading = true
			let paramJson = this.formData101
			let {
				data: { resultCode, resultData },
			} = await invitationStatisticsList(paramJson)
			this.loading = false
			if (resultCode == 0) {
				this.TableData101 = resultData && resultData ? resultData : []
			} else {
				this.TableData101 = []
			}
		},
		viewData102: async function () {
			let paramJson = this.formData101
			let {
				data: { resultCode, resultData },
			} = await invitationStatisticsByDate(paramJson)
			if (resultCode == 0) {
				this.resultData102 = resultData && resultData ? resultData : []
			} else {
				this.resultData102 = []
			}
		},

		//导出
		deriveHzw: async function () {
			let paramJson = Object.assign({}, this.formData105)
			paramJson.groupId = this.$store.state.user.userInfo.groupId
			console.log(paramJson)
			let { data } = await exportAppInvitation({
				data: JSON.stringify(paramJson),
			})
			downloadFile(data, '邀请列表.xlsx')
		},
		findSearchParams106(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page106.currentPage = 1
			}
			const paramJson = Object.assign(this.formData105, {
				length: this.page106.length,
				startIndex: (this.page106.currentPage - 1) * this.page106.length,
			})
			return paramJson
		},
		_listAppInvitation: async function (flag) {
			let paramJson = this.findSearchParams106(flag)
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await listAppInvitation(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData106 = resultData.records
				this.page106.count = resultData.total
			} else {
				this.page106.count = 0
				this.tableData106 = []
			}
		},
	},
}
</script>
<style>
.bg-yellow {
	background-color: #ffc94b;
	width: 40px;
}
.bg-grey {
	background-color: #5cb85c;
	width: 40px;
}
.font_siwe {
	font-size: 26px;
	font-weight: 900;
}
</style>

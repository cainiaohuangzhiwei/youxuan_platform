<template>
	<div class="page-wrapper">
		<basic-container>
			<!-- 搜索条件 -->
			<yx-form
				:inline="true"
				:data="formData"
				:items="formCfg"
				:formAction="formAction"
			>
			</yx-form>

			<!-- 数据列表 -->
			<yx-table
				v-loading="loading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			>
				<template slot="activityTitle" slot-scope="scope">
					<div class="row-item">
						<div class="table-title">{{ scope.row.activityTitle }}</div>
						<div class="sub-title">
							{{ formatTimeText(scope.row.startTime, scope.row.endTime) }}
						</div>
					</div>
				</template>
				<template slot="status" slot-scope="scope">
					<div>
						<el-tag type="danger" v-if="scope.row.status === 1">未开始</el-tag>
						<el-tag type="info" v-if="scope.row.status === 3">已结束</el-tag>
						<el-tag v-if="scope.row.status === 2">进行中</el-tag>
					</div>
				</template>
				<template slot="lastUpdateUserName" slot-scope="scope">
					<div class="row-item">
						<div class="table-title">{{ scope.row.lastUpdateUserName }}</div>
						<div class="sub-title">
							{{ getTimeStr(scope.row.updateTime) }}
						</div>
					</div>
				</template>
				<template slot="imageUrl" slot-scope="scope">
					<div class="row-item">
						<img :src="getBigImg(scope.row.imageUrl)" alt="" />
					</div>
				</template>
			</yx-table>
		</basic-container>

		<!-- 数据汇总弹窗 -->
		<DataDialog
			title="启动页数据"
			:visible.sync="dataDialogVisible"
			:viewData="viewData"
			:loading="dataDialogLoading"
		/>

		<!-- 新增/编辑弹窗 -->
		<AddResourceDialog
			type="BootPage"
			:title="addDialogTitle"
			:visible.sync="addDialogVisible"
			:defaultValue="addDialogCurrentRowData"
			:formDisabled="addDialogTitle === '查看启动页广告'"
			@successCallback="handleSearch"
		/>
	</div>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import DataDialog from '../components/DataDialog'
import AddResourceDialog from '../components/AddResourceDialog'
import moment from 'moment'
import { getBigImg } from '@/utils/imageTool'
import { getStartPage, getStartPageActivityDate } from '@/api/marketing'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		DataDialog,
		AddResourceDialog,
	},

	data() {
		return {
			loading: false,
			dataDialogLoading: false,
			getBigImg,
			viewData: {},
			formData: {
				applicationType: 0,
				status: 0,
				searchContent: '',
			},
			formCfg: [
				{
					type: 'select',
					title: '',
					dataIndex: 'applicationType',
					placeholder: '全部应用',
					label: 'value',
					change: () => {
						if (!this.loading) this.handleSearch(true)
					},
					options: [
						{
							applicationType: 0,
							value: '全部应用',
						},
						{
							applicationType: 1,
							value: '小程序',
						},
						{
							applicationType: 2,
							value: 'B端App',
						},
					],
				},
				{
					type: 'select',
					title: '',
					dataIndex: 'status',
					placeholder: '全部状态',
					label: 'value',
					change: () => {
						if (!this.loading) this.handleSearch(true)
					},
					options: [
						{
							status: 0,
							value: '全部状态',
						},
						{
							status: 1,
							value: '未开始',
						},
						{
							status: 2,
							value: '进行中',
						},
						{
							status: 3,
							value: '已结束',
						},
					],
				},
				{
					type: 'input',
					title: '',
					dataIndex: 'searchContent',
					placeholder: '名称搜索',
				},
			],
			formAction: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (!this.loading) this.handleSearch(true)
					},
				},
				{
					title: '新增',
					type: 'success',
					auth: 'advertisementStartPageAdd',
					click: this.handleAdd,
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'advActivityId',
					title: 'ID',
				},
				{
					type: 'custom',
					dataIndex: 'activityTitle',
					title: '启动页广告名称',
					width: 270,
				},
				{
					type: 'custom',
					dataIndex: 'imageUrl',
					title: '图片',
					width: 200,
				},
				{
					type: 'string',
					dataIndex: 'userTagNameList',
					title: '可见人群',
					customRender: ({ userTagNameList }) => {
						return userTagNameList.join('、') || '全部'
					},
				},
				{
					type: 'string',
					dataIndex: 'applicationTypeList',
					title: '应用',
					customRender: ({ applicationTypeList }) => {
						return applicationTypeList.join('、') || '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'sort',
					title: '排序值',
				},
				{
					type: 'custom',
					dataIndex: 'status',
					title: '状态',
				},
				{
					type: 'custom',
					dataIndex: 'lastUpdateUserName',
					title: '最后操作人',
					width: 140,
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '编辑',
							auth: 'advertisementStartPageUpdate',
							customRender: (action, row) => {
								// 已结束不展示
								action.hide = row.status === 3
								return action
							},
							click: this.handleEditItem,
						},
						{
							title: '查看配置',
							auth: 'advertisementStartPageUpdate',
							customRender: (action, row) => {
								// 除了已结束，都展示
								action.hide = row.status !== 3
								return action
							},
							click: this.handleViewItem,
						},
						{
							title: '数据',
							auth: 'advertisementStartPageGetActivityDate',
							customRender: (action, row) => {
								// 未开始隐藏
								action.hide = row.status === 1
								return action
							},
							click: this.handleViewData,
						},
					],
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					if (!this.loading) this.handleSearch()
				},
			},
			// 数据弹窗开关
			dataDialogVisible: false,
			// 新增弹窗数据
			addDialogVisible: false,
			addDialogCurrentRowData: {},
			addDialogTitle: '新建启动页广告',
		}
	},

	mounted() {
		this.handleSearch(true)
	},

	methods: {
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = Object.assign(this.formData, {
				pageSize: this.page.length,
				pageNum: this.page.currentPage,
			})
			return paramJson
		},

		async handleSearch(flag) {
			this.loading = true
			const paramJson = this.findSearchParams(flag)

			const {
				data: { resultCode, resultData, total },
			} = await getStartPage(paramJson).catch(() => {
				this.loading = false
			})

			if (resultCode === 0) {
				this.tableData = resultData
				this.page.count = total
			}

			this.loading = false
		},

		handleAdd() {
			this.addDialogTitle = '新建启动页广告'
			this.addDialogCurrentRowData = {}
			this.addDialogVisible = true
		},

		handleEditItem(row) {
			this.addDialogTitle = '编辑启动页广告'
			this.addDialogCurrentRowData = row
			this.addDialogVisible = true
		},

		handleViewItem(row) {
			this.addDialogTitle = '查看启动页广告'
			this.addDialogCurrentRowData = row
			this.addDialogVisible = true
		},

		// 查看数据
		async handleViewData(row) {
			this.dataDialogLoading = true
			this.dataDialogVisible = true
			const {
				data: { resultData },
			} = await getStartPageActivityDate({
				advActivityId: row.advActivityId,
			}).catch(() => {
				this.$message.error('网络异常！')
				this.dataDialogLoading = false
			})
			this.viewData = resultData
			this.dataDialogLoading = false
		},

		// 组装时间文案
		formatTimeText(startTime, endTime) {
			return `${this.getTimeStr(startTime)} - ${this.getTimeStr(endTime)}`
		},

		// 格式化时间
		getTimeStr(times) {
			return moment(times).format('YYYY-MM-DD HH:mm:ss')
		},
	},
}
</script>

<style lang="scss" scoped>
.page-wrapper {
	.row-item {
		text-align: left;
		.table-title {
			font-size: 12px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.sub-title {
			color: #a3a3a3;
		}

		img {
			width: 180px;
		}
	}
}
</style>

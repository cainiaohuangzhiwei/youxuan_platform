<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				></yx-table>
			</el-row>
		</div>
		<EditDialog
			ref="form"
			:title="EditDialogTitle"
			:visible.sync="editDialog"
			:row="row"
			@initTable="_selectList"
		/>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
// import { checkFunctionCode } from '@/utils/auth'
import { selectList, updateAppBanner } from '@/api/appBanner'
import EditDialog from './components/EditDialog'
import { getSmallImg } from '@/utils/imageTool'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		EditDialog,
	},
	name: 'FormTable',

	data() {
		return {
			// getOrganizationDetails: checkFunctionCode('getOrganizationDetails'),
			row: {},
			showLoading: false,
			searchData: {
				bannerName: '', // Banner名称
			},
			editDialog: false,
			EditDialogTitle: '',
			orderStatus: [],
			positionMap: ['', '个人中心'],
			stateMap: ['删除', '有效', '无效'],
			searchCfg: [
				{
					type: 'input',
					title: 'Banner名称',
					dataIndex: 'bannerName',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._selectList(true)
					},
				},
				{
					title: '新增Banner',
					type: 'primary',
					click: () => {
						this.EditDialogTitle = '新增Banner'
						this.row = {}
						this.editDialog = true
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'appBannerId',
					title: 'BannerID',
				},
				{
					type: 'string',
					dataIndex: 'bannerName',
					title: 'banner名称',
				},
				{
					type: 'image',
					dataIndex: 'pictureS',
					title: '图片',
				},
				{
					type: 'string',
					dataIndex: 'position',
					title: 'banner位置',
					customRender: (row) => {
						return this.positionMap[row.position]
					},
				},
				{
					type: 'string',
					dataIndex: 'sort',
					title: '排序值',
				},
				{
					type: 'string',
					dataIndex: 'jumpUrl',
					title: '跳转链接',
					customRender: (row) => {
						if (row.jumpType == 0) {
							return '无'
						} else if (row.jumpType == 1) {
							return row.jumpUrl
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'startTime',
					title: '有效时间',
					width: 300,
					customRender: (row) => {
						return row.startTime && row.endTime
							? moment(row.startTime).format('YYYY年MM月DD日HH:mm') +
									'~' +
									moment(row.endTime).format('YYYY年MM月DD日HH:mm')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'state',
					title: '状态',
					customRender: (row) => {
						return this.stateMap[row.state]
					},
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '编辑',
							// auth: 'addOrganizationTagToOrganization',
							click: (row) => {
								this.row = row
								this.EditDialogTitle = '编辑Banner'
								this.editDialog = true
							},
						},
						{
							title: '删除',
							// auth: 'addOrganizationTagToOrganization',
							click: (row) => {
								let _this = this
								_this.$confirm('确定删除？', '提示', {
									type: 'warning',
									async callback(action) {
										if (action === 'confirm') {
											_this._deleteBanner(row.appBannerId)
										}
									},
								})
							},
						},
					],
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._selectList()
				},
			},
		}
	},

	methods: {
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
				groupId: 2,
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
		_selectList: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await selectList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.bannerVOList.map((v) => {
					v.pictureS = getSmallImg(v.pictureUrl)
					return v
				})
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		//删除banner
		_deleteBanner: async function (appBannerId) {
			let paramJson = {
				appBannerId,
				state: 0,
			}
			let {
				data: { resultCode },
			} = await updateAppBanner(paramJson)
			if (resultCode == 0) {
				this.$message.success('删除成功')
				this._selectList()
			}
		},
	},
}
</script>

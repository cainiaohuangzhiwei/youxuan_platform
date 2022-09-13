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
				>
					<template slot="organizationName" slot-scope="scope">
						<div>
							<el-button
								@click="goShopDetail(scope.row)"
								v-if="getOrganizationDetails"
								type="text"
								>{{ scope.row.organizationName }}</el-button
							>
							<span v-else>{{ scope.row.organizationName }}</span>
						</div>
					</template>
				</yx-table>
			</el-row>
		</div>
		<organization-tree
			:dialogVisible.sync="dialogVisible"
			:organizationInfo="organizationInfo"
		></organization-tree>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import organizationTree from './organizationTree'
import { checkFunctionCode } from '@/utils/auth'
import moment from 'moment'
import { getOrganizationTree } from '@/api/yhtPlusCmsOrganization'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		organizationTree,
	},
	name: 'FormTable',

	data() {
		return {
			showLoading: false,
			getOrganizationDetails: checkFunctionCode('getOrganizationDetails'),
			dialogVisible: false, // 弹框开关
			organizationInfo: {}, // 店铺项
			searchData: {
				keyword: '', // 手机号 /店铺名称
				uploadFile: '',
			},
			orderStatus: [],
			searchCfg: [
				{
					type: 'input',
					title: '筛选',
					dataIndex: 'keyword',
					placeholder: '手机号/店铺名称',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.callOrganizationTree(true)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'custom',
					dataIndex: 'organizationName',
					title: '店铺名称',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '查看下级',
							click: (row) => {
								this.viewSubordinates(row)
							},
							customRender: (action, row) => {
								action.hide = row.childrenCount > 0 ? false : true
								action.title =
									row.childrenCount > 0 ? `查看下级(${row.childrenCount})` : '-'
								return action
							},
						},
					],
				},
				{
					type: 'string',
					dataIndex: 'addTime',
					title: '添加时间',
					customRender: (row) => {
						return row.addTime
							? moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'phone',
					title: '手机号',
				},
				{
					type: 'string',
					dataIndex: 'channel',
					title: '渠道',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.callOrganizationTree()
				},
			},
		}
	},

	created() {
		// this.callOrganizationTree(true)
	},

	methods: {
		goShopDetail(row) {
			this.$router.push({
				path: `shop/shopDetail/${row.organizationId}`,
			})
		},
		viewSubordinates(row) {
			// 查看下级
			this.dialogVisible = true
			this.organizationInfo = row
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
				groupId: 2,
				fatherId: 0,
				sortField: 0,
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
		callOrganizationTree: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getOrganizationTree(paramJson)
			this.showLoading = false
			if (resultCode === 0) {
				this.tableData = resultData.organizationList
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>

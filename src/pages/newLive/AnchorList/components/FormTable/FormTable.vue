<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			>
			</yx-form>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
					<template slot="phoneMobile" slot-scope="scope">
						<el-popover
							placement="top-start"
							width="120"
							popper-class="popperClass"
							trigger="click"
							:content="visiblePhone"
						>
							<div
								slot="reference"
								style="cursor: pointer"
								title="点击获取手机号"
								@click="showPhone(scope.row)"
							>
								{{ scope.row.phoneMobile }}
							</div>
						</el-popover>
					</template>
				</yx-table>
			</el-row>
		</div>
		<!-- 新建、编辑主播弹框 S -->
		<save-anchor-dialog
			ref="anchor"
			:dialogVisible.sync="dialogAnchorVisible"
			:itemInfo="selectedItem"
			@updateList="_getAnchor(true)"
		></save-anchor-dialog>
		<!-- 选择机构弹框 E -->
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import saveAnchorDialog from './saveAnchorDialog'
import { getAnchor, setAnchorState } from '@/api/yhtPlusCmsLiveUserAction'
import { findAnchorPhoneById } from '@/api/showPhone'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		saveAnchorDialog,
	},
	name: 'FormTable',

	data() {
		return {
			showLoading: false,
			visiblePhone: '***********',
			selectedItem: {}, // 选中项
			selectedMcn: {}, // 选择机构
			dialogAnchorVisible: false, //新增编辑弹框开关
			searchData: {
				anchorId: '', // 主播id
				nickname: '', // 主播昵称
				addStartQuery: '', // 添加开始时间
				addEndQuery: '', // 添加结束时间
			},
			orderStatus: [],
			searchCfg: [
				{
					type: 'input',
					title: '主播ID',
					dataIndex: 'anchorId',
				},
				{
					type: 'input',
					title: '主播昵称',
					dataIndex: 'nickname',
				},
				{
					title: '添加时间',
					type: 'datetimerange',
					dataIndex: ['addStartQuery', 'addEndQuery'],
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getAnchor(true)
					},
				},
				{
					title: '新建主播',
					type: 'primary',
					click: () => {
						this.addAndEditAnchor(true)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'anchorId',
					title: '主播ID',
				},
				{
					type: 'string',
					dataIndex: 'nickName',
					title: '主播昵称',
				},
				{
					type: 'string',
					dataIndex: 'anchorName',
					title: '主播名称',
				},
				{
					type: 'custom',
					dataIndex: 'phoneMobile',
					title: '手机号码',
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
					dataIndex: 'mcnName',
					title: '关联机构',
				},
				{
					type: 'string',
					dataIndex: 'anchorState',
					title: '主播状态',
					customRender: (row) => {
						return row.anchorState == 1 ? '启用' : '禁用'
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.addAndEditAnchor(true, row)
							},
						},
						{
							title: '启用',
							click: (row) => {
								this.setAnchorState(row)
							},
							customRender: (action, row) => {
								action.title = row.anchorState == 1 ? '禁用' : '启用'
								return action
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
					this._getAnchor()
				},
			},
		}
	},
	created() {
		this._getAnchor(true)
	},
	methods: {
		async showPhone(rowData) {
			this.visiblePhone = '***********'
			let {
				data: { resultCode, resultData },
			} = await findAnchorPhoneById({
				id: rowData.anchorId,
			})

			if (resultCode == 0) {
				this.visiblePhone = resultData
			}
		},
		addAndEditAnchor(flag, row = {}) {
			this.selectedItem = row
			if (row) {
				this.$nextTick(() => {
					this.$refs.anchor.details(row)
				})
			}
			this.dialogAnchorVisible = flag
		},
		async setAnchorState(row) {
			const state = row.anchorState == 1 ? '禁用' : '启用'
			this.$confirm(`确定主播${state}${row.anchorName}？`, '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						let {
							data: { resultMsg, resultCode },
						} = await setAnchorState({
							anchorId: row.anchorId,
							forbid: row.anchorState,
						})
						if (resultCode == 0) {
							this.$message({
								message: resultMsg,
								type: 'success',
							})
						}
						this._getAnchor(true)
					}
				},
			})
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.addStartQuery = moment(paramJson.addStartQuery).valueOf() || ''
			paramJson.addEndQuery = moment(paramJson.addEndQuery).valueOf() || ''
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		async _getAnchor(flag) {
			// 获取主播列表
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getAnchor(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.datalist
				this.page.count = resultData.count

				this.tableData.map((i) => {
					i.phoneShow = false
					return i
				})
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>

<style lang="scss">
.row_flex {
	display: flex;
	align-items: center;
}
.popperClass {
	text-align: center;
}
</style>

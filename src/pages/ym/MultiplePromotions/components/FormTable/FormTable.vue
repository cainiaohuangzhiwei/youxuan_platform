<template>
	<basic-container>
		<div>
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane label="活动列表" name="activitiesList">
					<yx-form
						:inline="true"
						:data="searchData"
						:items="searchCfg"
						:formAction="searchAction"
					>
						<template slot="actState">
							<el-checkbox-group v-model="searchData.actState">
								<el-checkbox
									v-for="item in actStateList"
									:label="item.key"
									:key="item.key"
									>{{ item.label }}</el-checkbox
								>
							</el-checkbox-group>
						</template>
					</yx-form>
					<el-row>
						<yx-table
							v-loading="showLoading"
							:columns="tableColumns"
							:pagination="page"
							:data="tableData"
						></yx-table>
					</el-row>
					<EditDialog
						ref="form"
						:title="EditDialogTitle"
						:visible.sync="editDialog"
						:row="row"
						@initTable="_getActMorePromotion"
					/>
					<Dialog
						:title="dialogTitle107"
						:visible.sync="dialogVisible107"
						:width="dialogWidth107"
						:bottomBtn="dialogBottomBtn107"
					>
						<yx-table
							:columns="tableColumns109"
							:data="tableData109"
						></yx-table>
					</Dialog>
				</el-tab-pane>
			</el-tabs>
		</div>
		<!-- 预览二维码弹窗 S -->
		<preview-qrcode-dialog
			:dialogVisible.sync="previewQrcodeDialogVisible"
			:previewParams="previewParams"
		/>
		<!-- 预览二维码弹窗 E -->
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import moment from 'moment'
import {
	getActMorePromotion,
	updateActState,
	handleMorePromotionRedis,
} from '@/api/yhtPlusCmsActMorePromotion'

import EditDialog from './components/EditDialog'
import PreviewQrcodeDialog from './components/PreviewQrcodeDialog'
const addActState = [
	{
		key: '0',
		label: '未开始',
	},
	{
		key: '1',
		label: '进行中',
	},
	{
		key: '2',
		label: '已结束',
	},
] // 活动状态

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		EditDialog,
		Dialog,
		PreviewQrcodeDialog,
	},
	name: 'FormTable',

	data() {
		return {
			activeName: 'activitiesList',
			dialogTitle107: '查看档期',
			dialogWidth107: '640px',
			dialogVisible107: false,
			dialogBottomBtn107: [],
			tableData109: [],
			tableColumns109: [
				{
					type: 'string',
					dataIndex: 'groupName1',
					title: '档期名称',
				},
				{
					type: 'string',
					dataIndex: 'groupName2',
					title: '档期名称',
				},
				{
					title: '档期名称',
					type: 'string',
					dataIndex: 'groupName3',
				},
				{
					title: '档期名称',
					type: 'string',
					dataIndex: 'groupName4',
				},
				{
					title: '档期名称',
					type: 'string',
					dataIndex: 'groupName5',
				},
				{
					title: '档期名称',
					type: 'string',
					dataIndex: 'groupName6',
				},
			],
			actStateList: addActState,
			row: {},
			state: '',
			showLoading: false,
			searchData: {
				actName: '', // 活动名称
				actState: ['0', '1'], // 活动状态
			},
			editDialog: false,
			EditDialogTitle: '',
			searchCfg: [
				{
					type: 'input',
					title: '活动名称	',
					dataIndex: 'actName',
				},
				{
					type: 'custom',
					dataIndex: 'actState',
					title: '活动状态',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getActMorePromotion(true)
					},
				},
				{
					title: '新增活动',
					type: 'primary',
					click: () => {
						this.EditDialogTitle = '新增活动'
						this.row = {}
						this.editDialog = true
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'actMorePromotionId',
					title: '活动Id',
					width: 80,
				},
				{
					type: 'string',
					dataIndex: 'actName',
					title: '活动名称',
				},
				{
					type: 'string',
					dataIndex: 'startTime',
					title: '活动时间',
					width: 240,
					customRender: (row) => {
						return row.startTime && row.endTime
							? moment(row.startTime).format('YYYY-MM-DD HH:mm') +
									'~' +
									moment(row.endTime).format('YYYY-MM-DD HH:mm')
							: '-'
					},
				},
				{
					type: 'action',
					title: '档期数',
					width: 120,
					actions: [
						{
							title: '档期数',
							click: ({ actMorePromotionRelationList }) => {
								this.showGoodsGroupInfo(actMorePromotionRelationList)
							},
							customRender: (action, { groupCount }) => {
								action.title = `档期数 (${groupCount})`
								return action
							},
						},
					],
				},
				{
					type: 'string',
					dataIndex: 'actRuleAmount',
					title: '活动规则',
					width: 120,
					customRender: (row) => {
						return row.actRuleAmount + '件' + row.actRuleCash + '元'
					},
				},
				{
					type: 'string',
					dataIndex: 'actState',
					title: '活动状态',
					width: 120,
					customRender: (row) => {
						return row.actState == 0
							? '未开始'
							: row.actState == 1
							? '进行中'
							: '已结束'
					},
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '编辑',
							click: async (row) => {
								let {
									data: { resultCode, resultData },
								} = await getActMorePromotion({
									type: 0,
									actMorePromotionId: row.actMorePromotionId,
								})
								this.showLoading = false
								if (resultCode == 0) {
									this.row = resultData.actMorePromotionOne || {}
									this.EditDialogTitle = '编辑活动'
									this.editDialog = true
								}
							},
							customRender: (action, row) => {
								action.hide = row.isNewData == 0
								return action
							},
						},
						{
							title: '查看',
							click: async (row) => {
								let {
									data: { resultCode, resultData },
								} = await getActMorePromotion({
									type: 0,
									actMorePromotionId: row.actMorePromotionId,
								})
								this.showLoading = false
								if (resultCode == 0) {
									this.row = resultData.actMorePromotionOne || {}
									this.EditDialogTitle = '查看活动'
									this.editDialog = true
								}
							},
							customRender: (action, row) => {
								action.hide = !(row.isNewData == 0)
								return action
							},
						},
						{
							title: '查看商品',
							click: ({ actMorePromotionRelationList }) => {
								let goodsGroupIds = actMorePromotionRelationList.map((item) => {
									return item.goodsGroupId
								})
								this.$router.push({
									path: `/ym/multiplePromotionList/${goodsGroupIds.join(',')}`,
								})
							},
							customRender: (action, row) => {
								action.hide = !row.actMorePromotionId
								return action
							},
						},
						{
							title: '刷新缓存',
							click: (row) => {
								let _this = this
								_this.$confirm('确定刷新缓存？', '提示', {
									type: 'warning',
									async callback(action) {
										if (action === 'confirm') {
											_this.handleMorePromotionRedis(row.actMorePromotionId)
										}
									},
								})
							},
						},
						{
							title: '结束活动',
							click: (row) => {
								let _this = this
								_this.$confirm('确认要结束该活动吗？', '提示', {
									type: 'warning',
									async callback(action) {
										if (action === 'confirm') {
											_this.updateActState(row.actMorePromotionId)
										}
									},
								})
							},
							customRender: (action, row) => {
								action.hide = row.actState != 1
								return action
							},
						},
						{
							title: '预览',
							auth: 'getActiveActivityCode',
							click: ({ actMorePromotionId, actRuleAmount, actRuleCash }) => {
								if (actMorePromotionId) {
									this.previewParams = {
										page: 'subpages/morePromotionList/morePromotionList',
										id: actMorePromotionId,
										scene: 'id=' + actMorePromotionId,
										title: actRuleAmount + '件' + actRuleCash + '元',
									}
									this.previewQrcodeDialogVisible = true
								}
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
					this._getActMorePromotion()
				},
			},
			// 二维码预览弹窗
			previewQrcodeDialogVisible: false,
			previewParams: {},
		}
	},

	mounted() {
		this._getActMorePromotion()
	},

	methods: {
		// 查看档期数
		showGoodsGroupInfo(actMorePromotionRelationList) {
			let list = actMorePromotionRelationList.map((item) => {
				return item.groupName
			})
			let mapIndex = 0,
				groupList = []
			for (let i = 0; i < list.length; i++) {
				if (i % 6 == 0 && i != 0) {
					let item = {
						groupName1: list[mapIndex],
						groupName2: list[mapIndex + 1],
						groupName3: list[mapIndex + 2],
						groupName4: list[mapIndex + 3],
						groupName5: list[mapIndex + 4],
						groupName6: list[mapIndex + 5],
					}
					groupList.push(item)
					mapIndex = i
				}
			}
			if (mapIndex < list.length) {
				let item = {
					groupName1: list[mapIndex],
				}
				if (list.length - mapIndex > 1) item.groupName2 = list[mapIndex + 1]
				if (list.length - mapIndex > 2) item.groupName3 = list[mapIndex + 2]
				if (list.length - mapIndex > 3) item.groupName4 = list[mapIndex + 3]
				if (list.length - mapIndex > 4) item.groupName5 = list[mapIndex + 4]
				if (list.length - mapIndex > 5) item.groupName6 = list[mapIndex + 5]

				groupList.push(item)
			}
			this.dialogVisible107 = true
			this.tableData109 = groupList
		},
		//切换tab
		handleClick(tab) {
			switch (tab.name) {
				case 'activitiesList':
					this._getActMorePromotion(true)
					break
			}
			this.activeName = tab.name
		},
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
		// 获取领活动列表
		_getActMorePromotion: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getActMorePromotion(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.actMorePromotionList
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		//刷缓存
		handleMorePromotionRedis: async function (actMorePromotionId) {
			let paramJson = {
				actMorePromotionId,
			}
			let {
				data: { resultCode },
			} = await handleMorePromotionRedis(paramJson)
			if (resultCode == 0) {
				this.$message.success('刷新成功')
				this._getActMorePromotion()
			}
		},
		//结束活动
		updateActState: async function (actMorePromotionId) {
			let paramJson = {
				actMorePromotionId,
			}
			let {
				data: { resultCode, resultMsg },
			} = await updateActState(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this._getActMorePromotion()
			}
		},
	},
}
</script>

<template>
	<BasicContainer>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<template v-for="item in tabsList">
				<el-tab-pane
					v-if="item.auth"
					:label="item.label"
					:name="item.name"
					:key="item.name"
				>
					<div v-if="item.name === 'one'">
						<YxForm
							:inline="true"
							:data="searchData"
							:items="searchCfg"
							:formAction="searchActionOne"
						/>

						<YxTable
							v-if="item.name === 'one'"
							v-loading="loadingOne"
							:columns="tableColumns"
							:pagination="page"
							:data="tableData"
						/>
					</div>

					<div v-if="item.name === 'two'">
						<YxForm
							:inline="true"
							:data="searchAward"
							:items="searchCfgTwo"
							:formAction="searchActionTwo"
						/>

						<YxTable
							v-loading="loadingTwo"
							:columns="tableColumnsTwo"
							:pagination="pageTwo"
							:data="tableDataSecond"
						/>
					</div>
					<div v-if="item.name === 'three'">
						<!-- <YxForm
							:inline="true"
							:data="searchThree"
							:items="searchCfgThree"
							:formAction="searchActionThree"
						/> -->
						<YxTable
							v-loading="loadingThree"
							:columns="tableColumnsThree"
							:data="tableDataThree"
						/>
					</div>
					<div v-if="item.name === 'four'">
						<YxForm
							:inline="true"
							:data="searchFour"
							:items="searchCfgFour"
							:formAction="searchActionFour"
						/>
						<YxTable
							v-loading="loadingFour"
							:columns="tableColumnsFour"
							:pagination="pageFour"
							:data="tableDataFour"
						/>
					</div>
				</el-tab-pane>
			</template>
		</el-tabs>
		<EditRuleDialog
			ref="rule"
			:title="title"
			:visible.sync="editRuleDialog"
			@fatherMethodOne="fatherMethodOne"
		/>

		<EditConfigDialog
			ref="config"
			:title="title"
			:visible.sync="editConfigDialog"
			@fatherMethodTwo="_queryActSaleRewardEntrancePage"
		/>

		<LookRuleDialog ref="lookRule" :visible.sync="lookRuleDialog" />

		<LookConfigDialog
			ref="lookConfig"
			:visible.sync="lookConfigDialog"
			@fatherMethodInit="fatherMethodInit"
		/>
		<ActEntranceDialog
			:actEntranceId="actEntranceId"
			:visible.sync="actEntranceDialog"
		/>
		<PlatformActDialog
			:row="platformActRow"
			:visible.sync="platformActDialog"
			@platformActSaveSuccess="_platformActList"
		/>
	</BasicContainer>
</template>
<script>
import moment from 'moment'
import {
	actSaleRewardList,
	finishActSaleReward,
	queryActSaleRewardEntrancePage,
	closeActSaleRewardEntrance,
	queryActEntrancePage,
	operateActEntranceStatus,
	platformActList,
} from '@/api/userRewardSystem'
import { checkFunctionCode } from '@/utils/auth.js'

export default {
	components: {
		LookRuleDialog: () => import('../rule/LookDialog'),
		LookConfigDialog: () => import('../config/LookDialog'),
		ActEntranceDialog: () => import('../config/ActEntranceDialog'),
		EditRuleDialog: () => import('../rule/EditDialog'),
		PlatformActDialog: () => import('../rule/PlatformActDialog'),
		EditConfigDialog: () => import('../config/EditDialog'),
		YxForm: () => import('@wg-vue-materials/yx-form'),
		YxTable: () => import('@wg-vue-materials/yx-table'),
		BasicContainer: () => import('@wg-vue-materials/basic-container'),
	},

	name: 'userRewardSystem',
	data() {
		return {
			activeName: 'one',
			tableData: [],
			tableDataSecond: [],
			loadingOne: false,
			loadingTwo: false,
			lookRuleDialog: false,
			lookConfigDialog: false,
			editRuleDialog: false,
			editConfigDialog: false,
			actEntranceDialog: false,
			actEntranceId: '',
			entranceStatusMap: {
				1: '未开始',
				2: '进行中',
				3: '已结束',
			},
			entranceCloseMap: {
				1: '禁用',
				0: '开启',
			},
			entranceTypeMap: {
				1: '活动奖励',
			},
			tableColumns: [
				{
					title: '活动ID',
					dataIndex: 'actSaleRewardId',
				},
				{
					title: '活动名称',
					dataIndex: 'activityName',
				},
				{
					title: '活动状态',
					dataIndex: 'activityState',
				},
				{
					title: '活动时间',
					dataIndex: 'startTime',
					customRender: ({ startTime, endTime }) => {
						if (startTime && endTime) {
							return (
								moment(startTime).format('YYYY-MM-DD HH:mm:ss') +
								' - ' +
								moment(endTime).format('YYYY-MM-DD HH:mm:ss')
							)
						} else {
							return '无'
						}
					},
				},
				{
					type: 'data',
					title: '奖励截止时间',
					dataIndex: 'deadline',
				},
				{
					title: '操作',
					type: 'action',
					width: '150',
					actions: [
						{
							title: '查看',
							click: (row) => {
								this.handleLookRule(row)
							},
						},
						{
							title: '编辑',
							auth: 'editActSaleReward',
							click: (row) => {
								this.handleEdit(row)
							},
							customRender: (action, row) => {
								action.hide =
									row.activityState != '进行中' && row.activityState != '未开始'
								return action
							},
						},
						{
							title: '结束',
							auth: 'finishActSaleReward',
							click: ({ actSaleRewardId }) => {
								this._handleFinish(actSaleRewardId, 1)
							},
							customRender: (action, row) => {
								action.hide =
									this.convertActivityStatus(row) != '进行中' &&
									this.convertActivityStatus(row) != '未开始'
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
					this._actSaleRewardList()
				},
			},
			searchData: {
				activityName: '',
				actRewardStatus: '',
			},
			searchAward: {
				entranceName: '',
			},
			searchCfg: [
				{
					title: '活动名称',
					dataIndex: 'activityName',
					placeholder: '请输入活动名称',
				},
				{
					title: '活动状态',
					dataIndex: 'actRewardStatus',
					placeholder: '请输入活动名称',
					type: 'select',
					label: 'value',
					options: [
						{
							value: '全部',
							actRewardStatus: '',
						},
						{
							value: '未开始',
							actRewardStatus: 1,
						},
						{
							value: '进行中',
							actRewardStatus: 2,
						},
						{
							value: '待发奖',
							actRewardStatus: 3,
						},
						{
							value: '已结束',
							actRewardStatus: 4,
						},
					],
				},
			],
			searchCfgTwo: [
				{
					title: '活动名称',
					dataIndex: 'entranceName',
					placeholder: '请输入活动名称',
				},
			],
			searchActionOne: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._actSaleRewardList()
					},
				},
				{
					title: '新增活动规则',
					type: 'primary',
					auth: 'createActSaleReward',
					click: () => {
						this.editRuleDialog = true
					},
				},
			],
			searchActionTwo: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._queryActSaleRewardEntrancePage()
					},
				},
				{
					title: '新增配置奖励活动',
					type: 'primary',
					auth: 'createActSaleRewardEntrance',
					click: () => {
						this.editConfigDialog = true
					},
				},
			],
			currentDtaOne: {
				imageName: '',
				sort: '',
				isHide: '0',
				imageList: [],
				jumpLocationLink: '',
			},
			tableColumnsTwo: [
				{
					title: '活动ID',
					dataIndex: 'actSaleRewardEntranceId',
				},
				{
					title: '活动名称',
					dataIndex: 'entranceName',
				},
				{
					title: '关联奖励',
					dataIndex: 'activityName',
				},
				{
					title: '活动时间',
					dataIndex: 'startTime',
					customRender: ({ startTime, endTime }) => {
						if (startTime && endTime) {
							return (
								moment(startTime).format('YYYY-MM-DD HH:mm:ss') +
								' - ' +
								moment(endTime).format('YYYY-MM-DD HH:mm:ss')
							)
						} else {
							return '无'
						}
					},
				},
				{
					title: '活动状态',
					dataIndex: 'entranceStatus',
					customRender: ({ entranceStatus }) => {
						return this.entranceStatusMap[entranceStatus]
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '查看',
							auth: 'getActSaleRewardEntrance',
							click: (row) => {
								this.handleLookConfig(row)
							},
						},
						{
							title: '编辑',
							auth: 'updateActSaleRewardEntrance',
							click: (row) => {
								this.handleEdit(row)
							},
							customRender: (action, row) => {
								action.hide = row.entranceStatus == 3
								return action
							},
						},
						{
							title: '结束',
							auth: 'closeActSaleRewardEntrance',
							click: ({ actSaleRewardEntranceId }) => {
								this._handleFinish(actSaleRewardEntranceId, 2)
							},
							customRender: (action, row) => {
								action.hide = row.entranceStatus != 1 && row.entranceStatus != 2
								return action
							},
						},
					],
				},
			],
			searchThree: { entranceName: '' },
			searchCfgThree: [
				{
					title: '活动名称',
					dataIndex: 'entranceName',
					placeholder: '请输入活动名称',
				},
			],
			searchActionThree: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._queryActEntrancePage()
					},
				},
			],
			tableDataThree: [],
			tableColumnsThree: [
				{
					title: '活动ID',
					dataIndex: 'actEntranceId',
				},
				{
					title: '活动名称',
					dataIndex: 'entranceName',
				},
				{
					title: '活动类型',
					dataIndex: 'entranceType',
					customRender: ({ entranceType }) => {
						return this.entranceTypeMap[entranceType]
					},
				},
				{
					title: '状态',
					customRender: ({ entranceClose }) => {
						return this.entranceCloseMap[entranceClose]
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '编辑',
							auth: 'updateActEntrance',
							click: (row) => {
								this.actEntranceId = row.actEntranceId
								this.actEntranceDialog = true
							},
						},
						{
							title: '开启/禁用',
							auth: 'operateActEntranceStatus',
							click: (row) => {
								this._operateActEntranceStatus(row)
							},
							customRender: (action, row) => {
								action.title = row.entranceClose == 1 ? '开启' : '禁用'
								return action
							},
						},
					],
				},
			],
			platformActRow: {},
			platformActDialog: false,
			searchFour: { activityName: '' },
			searchCfgFour: [
				{
					title: '活动名称',
					dataIndex: 'activityName',
					placeholder: '请输入活动名称',
				},
			],
			searchActionFour: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._platformActList(true)
					},
				},
				{
					title: '创建活动',
					type: 'primary',
					auth: 'kbPlatformActivitySave',
					click: () => {
						this.platformActRow = {}
						this.platformActDialog = true
					},
				},
			],
			tableDataFour: [],
			tableColumnsFour: [
				{
					title: '活动ID',
					dataIndex: 'platformActivityId',
				},
				{
					title: '活动名称',
					dataIndex: 'activityName',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '编辑',
							auth: 'kbPlatformActivityUpdate',
							click: (row) => {
								this.platformActRow = row
								this.platformActDialog = true
							},
						},
						{
							title: '复制路径',
							// auth: 'operateActEntranceStatus',
							click: (row) => {
								this.$copyText(
									`/subpages/rewardBoard/rewardBoard?platformActivityId=${row.platformActivityId}`
								).then(() => {
									this.$message.success('复制成功')
								})
							},
						},
					],
				},
			],
			tabsList: [
				{
					name: 'one',
					label: '活动奖励规则',
					auth: checkFunctionCode('actSaleRewardList'),
				},
				// {
				// 	name: 'two',
				// 	label: '奖励活动配置',
				// 	auth: checkFunctionCode('queryActSaleRewardEntrancePage'),
				// },
				{
					name: 'three',
					label: '活动入口',
					auth: checkFunctionCode('queryActEntrancePage'),
				},
				// {
				// 	name: 'four',
				// 	label: '平台活动',
				// 	auth: checkFunctionCode('kbPlatformActivityList'),
				// },
			],
			pageTwo: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._queryActSaleRewardEntrancePage()
				},
			},
			pageThree: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._queryActEntrancePage()
				},
			},
			pageFour: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._platformActList()
				},
			},
		}
	},

	created() {
		this.handleTabShow()
	},

	methods: {
		// 处理tab权限请求接口
		handleTabShow() {
			if (checkFunctionCode('actSaleRewardList')) {
				this.activeName = 'one'
				this._actSaleRewardList(true)
			}

			if (
				!checkFunctionCode('actSaleRewardList') &&
				checkFunctionCode('queryActSaleRewardEntrancePage')
			) {
				this.activeName = 'two'
				this._queryActSaleRewardEntrancePage(true)
			}
		},

		// tab切换
		handleClick(tab) {
			if (tab.name == 'one') {
				this._actSaleRewardList()
			} else if (tab.name == 'two') {
				this._queryActSaleRewardEntrancePage()
			} else if (tab.name == 'three') {
				this._queryActEntrancePage()
			} else if (tab.name == 'four') {
				this._platformActList()
			}
		},

		// 活动奖励规则查询条件
		_findSearchParams(flag) {
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = {
				activityName: this.searchData.activityName,
				actRewardStatus: this.searchData.actRewardStatus
					? [this.searchData.actRewardStatus]
					: [],
				length: this.page.length,
				currentPage: this.searchData.activityName ? 1 : this.page.currentPage,
				startIndex: this.searchData.activityName
					? 0
					: (this.page.currentPage - 1) * this.page.length,
			}

			return paramJson
		},

		// 活动奖励规则列表
		async _actSaleRewardList(flag) {
			this.loadingOne = true
			const {
				data: { resultData },
			} = await actSaleRewardList(this._findSearchParams(flag))

			if (resultData.records.length > 0) {
				const data = resultData.records
				for (let i = 0; i < data.length; i++) {
					data[i].activityState = this.convertActivityStatus(data[i])
				}

				this.tableData = data
				this.page.count = resultData.total
			} else {
				this.page.count = 0
				this.tableData = []
			}
			this.loadingOne = false
		},

		// 子组件传值
		fatherMethodInit(params) {
			this.handleLookConfig(params)
			this.handleLookRule(params)
		},

		// 子组件调用父组件选品区方法更新
		fatherMethodOne() {
			this._actSaleRewardList()
		},

		// 结束
		_handleFinish(id, type) {
			this.$confirm('确定结束活动吗？（活动结束后不可再打开）', '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						type === 1
							? this._finishActSaleReward(id)
							: this._closeActSaleRewardEntrance(id)
					}
				},
			})
		},

		// 结束活动奖励规则
		async _finishActSaleReward(actSaleRewardId) {
			const {
				data: { resultMsg, resultCode },
			} = await finishActSaleReward({ actSaleRewardId })
			this.finishMessage(resultMsg, resultCode)
		},

		// 结束活动奖励配置
		async _closeActSaleRewardEntrance(actSaleRewardEntranceId) {
			const {
				data: { resultMsg, resultCode },
			} = await closeActSaleRewardEntrance({ actSaleRewardEntranceId })
			this.finishMessage(resultMsg, resultCode)
		},

		// 结束提示
		finishMessage(msg, code) {
			if (code == 0) {
				this.$message.success(msg)
				if (this.activeName === 'one') {
					this._actSaleRewardList()
				} else if (this.activeName === 'two') {
					this._queryActSaleRewardEntrancePage()
				}
			}
		},

		// 活动奖励规则搜索条件
		findSearchParams(flag) {
			if (flag) {
				this.pageTwo.currentPage = 1
			}

			const paramJson = Object.assign(this.searchData, {
				length: this.page.length,
				currentPage: this.page.currentPage,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})
			return paramJson
		},

		// 奖励活动配置条件
		findSearchParamsTwo(flag) {
			if (flag) {
				this.pageTwo.currentPage = 1
			}

			const paramJson = Object.assign(this.searchAward, {
				length: this.pageTwo.length,
				startIndex: (this.pageTwo.currentPage - 1) * this.pageTwo.length,
			})
			return paramJson
		},
		// 活动入口搜索条件
		findSearchParamsThree(flag) {
			if (flag) {
				this.pageThree.currentPage = 1
			}

			const paramJson = Object.assign(this.searchThree, {
				length: this.pageThree.length,
				startIndex: (this.pageThree.currentPage - 1) * this.pageThree.length,
				currentPage: this.pageThree.currentPage,
			})
			return paramJson
		},

		// 奖励配置列表
		async _queryActSaleRewardEntrancePage(flag) {
			const paramJson = this.findSearchParamsTwo(flag)
			this.loadingTwo = true
			const {
				data: { resultData },
			} = await queryActSaleRewardEntrancePage(paramJson)

			if (resultData.records.length > 0) {
				this.pageTwo.count = resultData.total
				this.tableDataSecond = resultData.records
			} else {
				this.pageTwo.count = 0
				this.tableDataSecond = []
			}
			this.loadingTwo = false
		},
		// 活动入口列表
		async _queryActEntrancePage(flag) {
			const paramJson = this.findSearchParamsThree(flag)
			this.loadingThree = true
			const {
				data: { resultData = {} },
			} = await queryActEntrancePage(paramJson)

			if (resultData.records && resultData.records.length > 0) {
				this.pageThree.count = resultData.total
				this.tableDataThree = resultData.records
			} else {
				this.pageThree.count = 0
				this.tableDataThree = []
			}
			this.loadingThree = false
		},

		async _operateActEntranceStatus(row) {
			let { actEntranceId, entranceClose } = row
			let text = entranceClose == 1 ? '开启' : '关闭'
			this.$confirm(`确定${text}活动入口吗？`, '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						entranceClose = entranceClose == 1 ? 0 : 1
						const {
							data: { resultCode, resultMsg },
						} = await operateActEntranceStatus({ actEntranceId, entranceClose })
						if (resultCode == 0) {
							this.$message.success(`${text}活动入口成功`)
						} else {
							this.$message.error(resultMsg)
						}
						this._queryActEntrancePage()
					}
				},
			})
		},

		// 平台活动列表
		async _platformActList(flag) {
			const paramJson = this.findSearchParamsFour(flag)
			this.loadingFour = true
			const {
				data: { resultData = {} },
			} = await platformActList(paramJson)

			if (resultData.records && resultData.records.length > 0) {
				this.pageFour.count = resultData.total
				this.tableDataFour = resultData.records
			} else {
				this.pageFour.count = 0
				this.tableDataFour = []
			}
			this.loadingFour = false
		},

		// 平台活动列表搜索条件
		findSearchParamsFour(flag) {
			if (flag) {
				this.pageFour.currentPage = 1
			}
			// this.searchFour
			const paramJson = Object.assign(this.searchFour, {
				length: this.pageFour.length,
				startIndex: (this.pageFour.currentPage - 1) * this.pageFour.length,
				currentPage: this.pageFour.currentPage,
			})
			return paramJson
		},

		// 弹窗显示
		handleEdit(row) {
			if (this.activeName === 'one') {
				this.editRuleDialog = true
				this.$nextTick(() => {
					this.$refs.rule._viewActSaleReward(row)
				})
			} else if (this.activeName === 'two') {
				this.editConfigDialog = true
				this.$nextTick(() => {
					this.$refs.config._getActSaleRewardEntrance(
						row.actSaleRewardEntranceId
					)
				})
			}
		},

		handleLookConfig(row) {
			this.lookConfigDialog = true
			this.$nextTick(() => {
				this.$refs.lookConfig._getActSaleRewardEntrance(
					row.actSaleRewardEntranceId
				)
			})
		},

		handleLookRule(row) {
			this.lookRuleDialog = true
			this.$nextTick(() => {
				this.$refs.lookRule._viewActSaleReward(row.actSaleRewardId)
			})
		},

		/**
		 *活动状态
		 *未开始：当前时间小于活动开始时间，活动状态为未开始
		 *进行中：活动开始时间<当前时间<活动结束时间，活动状态为进行中
		 *待领奖：活动结束时间<当前时间<奖励截止时间，活动状态为待领奖
		 *已结束：奖励截止时间<当前时间，活动状态为已结束
		 */
		convertActivityStatus({ activityEnd, startTime, endTime, deadline }) {
			const curveTime = Date.parse(new Date())

			if (activityEnd == 1) {
				return '已结束'
			}
			if (curveTime < startTime) {
				return '未开始'
			} else if (startTime < curveTime && curveTime < endTime) {
				return '进行中'
			} else if (endTime < curveTime && curveTime < deadline) {
				return '待领奖'
			} else if (deadline < curveTime) {
				return '已结束'
			}
		},
	},
}
</script>
<style lang="scss"></style>

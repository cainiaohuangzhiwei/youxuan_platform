<template>
	<BasicContainer>
		<!-- <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
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
					<div v-if="item.name === 'pageconfig'">
						<PageConfig />
					</div>
					<div v-if="item.name === 'three'">
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
		</el-tabs> -->
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
	finishActSaleReward,
	queryActSaleRewardEntrancePage,
	closeActSaleRewardEntrance,
	queryActEntrancePage,
	operateActEntranceStatus,
	platformActList,
	platFormList,
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
		// PageConfig: () => import('./tabs/PageConfig'),
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
				1: '?????????',
				2: '?????????',
				3: '?????????',
			},
			entranceCloseMap: {
				1: '??????',
				0: '??????',
			},
			entranceTypeMap: {
				1: '????????????',
			},
			tableColumns: [
				{
					title: '??????ID',
					dataIndex: 'actSaleRewardId',
				},
				{
					title: '????????????',
					dataIndex: 'activityName',
				},
				{
					title: '????????????',
					dataIndex: 'activityState',
				},
				{
					title: '????????????',
					dataIndex: 'startTime',
					customRender: ({ startTime, endTime }) => {
						if (startTime && endTime) {
							return (
								moment(startTime).format('YYYY-MM-DD HH:mm:ss') +
								' - ' +
								moment(endTime).format('YYYY-MM-DD HH:mm:ss')
							)
						} else {
							return '???'
						}
					},
				},
				{
					type: 'data',
					title: '??????????????????',
					dataIndex: 'deadline',
				},
				{
					title: '??????',
					type: 'action',
					width: '150',
					actions: [
						{
							title: '??????',
							click: (row) => {
								this.handleLookRule(row)
							},
						},
						{
							title: '??????',
							auth: 'editActSaleReward',
							click: (row) => {
								this.handleEdit(row)
							},
							customRender: (action, row) => {
								action.hide =
									row.activityState != '?????????' && row.activityState != '?????????'
								return action
							},
						},
						{
							title: '??????',
							auth: 'finishActSaleReward',
							click: ({ actSaleRewardId }) => {
								this._handleFinish(actSaleRewardId, 1)
							},
							customRender: (action, row) => {
								action.hide =
									this.convertActivityStatus(row) != '?????????' &&
									this.convertActivityStatus(row) != '?????????'
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
					this._platFormList()
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
					title: '????????????',
					dataIndex: 'activityName',
					placeholder: '?????????????????????',
				},
				{
					title: '????????????',
					dataIndex: 'actRewardStatus',
					placeholder: '?????????????????????',
					type: 'select',
					label: 'value',
					options: [
						{
							value: '??????',
							actRewardStatus: '',
						},
						{
							value: '?????????',
							actRewardStatus: 1,
						},
						{
							value: '?????????',
							actRewardStatus: 2,
						},
						{
							value: '?????????',
							actRewardStatus: 3,
						},
						{
							value: '?????????',
							actRewardStatus: 4,
						},
					],
				},
			],
			searchCfgTwo: [
				{
					title: '????????????',
					dataIndex: 'entranceName',
					placeholder: '?????????????????????',
				},
			],
			searchActionOne: [
				{
					title: '??????',
					type: 'primary',
					click: () => {
						this._platFormList()
					},
				},
				{
					title: '??????????????????',
					type: 'primary',
					auth: 'createActSaleReward',
					click: () => {
						this.editRuleDialog = true
					},
				},
			],
			searchActionTwo: [
				{
					title: '??????',
					type: 'primary',
					click: () => {
						this._queryActSaleRewardEntrancePage()
					},
				},
				{
					title: '????????????????????????',
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
					title: '??????ID',
					dataIndex: 'actSaleRewardEntranceId',
				},
				{
					title: '????????????',
					dataIndex: 'entranceName',
				},
				{
					title: '????????????',
					dataIndex: 'activityName',
				},
				{
					title: '????????????',
					dataIndex: 'startTime',
					customRender: ({ startTime, endTime }) => {
						if (startTime && endTime) {
							return (
								moment(startTime).format('YYYY-MM-DD HH:mm:ss') +
								' - ' +
								moment(endTime).format('YYYY-MM-DD HH:mm:ss')
							)
						} else {
							return '???'
						}
					},
				},
				{
					title: '????????????',
					dataIndex: 'entranceStatus',
					customRender: ({ entranceStatus }) => {
						return this.entranceStatusMap[entranceStatus]
					},
				},
				{
					type: 'action',
					title: '??????',
					width: '150',
					actions: [
						{
							title: '??????',
							auth: 'getActSaleRewardEntrance',
							click: (row) => {
								this.handleLookConfig(row)
							},
						},
						{
							title: '??????',
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
							title: '??????',
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
					title: '????????????',
					dataIndex: 'entranceName',
					placeholder: '?????????????????????',
				},
			],
			searchActionThree: [
				{
					title: '??????',
					type: 'primary',
					click: () => {
						this._queryActEntrancePage()
					},
				},
			],
			tableDataThree: [],
			tableColumnsThree: [
				{
					title: '??????ID',
					dataIndex: 'actEntranceId',
				},
				{
					title: '????????????',
					dataIndex: 'entranceName',
				},
				{
					title: '????????????',
					dataIndex: 'entranceType',
					customRender: ({ entranceType }) => {
						return this.entranceTypeMap[entranceType]
					},
				},
				{
					title: '??????',
					customRender: ({ entranceClose }) => {
						return this.entranceCloseMap[entranceClose]
					},
				},
				{
					type: 'action',
					title: '??????',
					width: '150',
					actions: [
						{
							title: '??????',
							auth: 'updateActEntrance',
							click: (row) => {
								this.actEntranceId = row.actEntranceId
								this.actEntranceDialog = true
							},
						},
						{
							title: '??????/??????',
							auth: 'operateActEntranceStatus',
							click: (row) => {
								this._operateActEntranceStatus(row)
							},
							customRender: (action, row) => {
								action.title = row.entranceClose == 1 ? '??????' : '??????'
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
					title: '????????????',
					dataIndex: 'activityName',
					placeholder: '?????????????????????',
				},
			],
			searchActionFour: [
				{
					title: '??????',
					type: 'primary',
					click: () => {
						this._platformActList(true)
					},
				},
				{
					title: '????????????',
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
					title: '??????ID',
					dataIndex: 'platformActivityId',
				},
				{
					title: '????????????',
					dataIndex: 'activityName',
				},
				{
					type: 'action',
					title: '??????',
					width: '150',
					actions: [
						{
							title: '??????',
							auth: 'kbPlatformActivityUpdate',
							click: (row) => {
								this.platformActRow = row
								this.platformActDialog = true
							},
						},
						{
							title: '????????????',
							// auth: 'operateActEntranceStatus',
							click: (row) => {
								this.$copyText(
									`/subpages/rewardBoard/rewardBoard?platformActivityId=${row.platformActivityId}`
								).then(() => {
									this.$message.success('????????????')
								})
							},
						},
					],
				},
			],
			tabsList: [
				{
					name: 'one',
					label: '??????????????????',
					auth: checkFunctionCode('platFormList'),
				},
				// {
				// 	name: 'two',
				// 	label: '??????????????????',
				// 	auth: checkFunctionCode('queryActSaleRewardEntrancePage'),
				// },
				{
					name: 'pageconfig',
					label: '??????????????????',
					auth: checkFunctionCode('getPlatActPageConfList'),
				},
				{
					name: 'three',
					label: '????????????',
					auth: checkFunctionCode('queryActEntrancePage'),
				},
				{
					name: 'four',
					label: '???????????????',
					auth: checkFunctionCode('kbPlatformActivityList'),
				},
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
		// this.handleTabShow()
		this._platformActList()
	},

	methods: {
		// ??????tab??????????????????
		handleTabShow() {
			if (checkFunctionCode('platFormList')) {
				this.activeName = 'one'
				this._platFormList(true)
			}
			if (
				!checkFunctionCode('platFormList') &&
				checkFunctionCode('queryActSaleRewardEntrancePage')
			) {
				this.activeName = 'two'
				this._queryActSaleRewardEntrancePage(true)
			}
		},

		// tab??????
		handleClick(tab) {
			if (tab.name == 'one') {
				this._platFormList()
			} else if (tab.name == 'two') {
				this._queryActSaleRewardEntrancePage()
			} else if (tab.name == 'three') {
				this._queryActEntrancePage()
			} else if (tab.name == 'four') {
				this._platformActList()
			}
		},

		// ??????????????????????????????
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

		// ????????????????????????
		async _platFormList(flag) {
			this.loadingOne = true
			const {
				data: { resultData },
			} = await platFormList(this._findSearchParams(flag))

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

		// ???????????????
		fatherMethodInit(params) {
			this.handleLookConfig(params)
			this.handleLookRule(params)
		},

		// ?????????????????????????????????????????????
		fatherMethodOne() {
			this._platFormList()
		},

		// ??????
		_handleFinish(id, type) {
			this.$confirm('????????????????????????????????????????????????????????????', '??????', {
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

		// ????????????????????????
		async _finishActSaleReward(actSaleRewardId) {
			const {
				data: { resultMsg, resultCode },
			} = await finishActSaleReward({ actSaleRewardId })
			this.finishMessage(resultMsg, resultCode)
		},

		// ????????????????????????
		async _closeActSaleRewardEntrance(actSaleRewardEntranceId) {
			const {
				data: { resultMsg, resultCode },
			} = await closeActSaleRewardEntrance({ actSaleRewardEntranceId })
			this.finishMessage(resultMsg, resultCode)
		},

		// ????????????
		finishMessage(msg, code) {
			if (code == 0) {
				this.$message.success(msg)
				if (this.activeName === 'one') {
					this._platFormList()
				} else if (this.activeName === 'two') {
					this._queryActSaleRewardEntrancePage()
				}
			}
		},

		// ??????????????????????????????
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

		// ????????????????????????
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
		// ????????????????????????
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

		// ??????????????????
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
		// ??????????????????
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
			let text = entranceClose == 1 ? '??????' : '??????'
			this.$confirm(`??????${text}??????????????????`, '??????', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						entranceClose = entranceClose == 1 ? 0 : 1
						const {
							data: { resultCode, resultMsg },
						} = await operateActEntranceStatus({ actEntranceId, entranceClose })
						if (resultCode == 0) {
							this.$message.success(`${text}??????????????????`)
						} else {
							this.$message.error(resultMsg)
						}
						this._queryActEntrancePage()
					}
				},
			})
		},

		// ??????????????????
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

		// ??????????????????????????????
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

		// ????????????
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
		 *????????????
		 *???????????????????????????????????????????????????????????????????????????
		 *??????????????????????????????<????????????<?????????????????????????????????????????????
		 *??????????????????????????????<????????????<?????????????????????????????????????????????
		 *??????????????????????????????<???????????????????????????????????????
		 */
		convertActivityStatus({ activityEnd, startTime, endTime, deadline }) {
			const curveTime = Date.parse(new Date())

			if (activityEnd == 1) {
				return '?????????'
			}
			if (curveTime < startTime) {
				return '?????????'
			} else if (startTime < curveTime && curveTime < endTime) {
				return '?????????'
			} else if (endTime < curveTime && curveTime < deadline) {
				return '?????????'
			} else if (deadline < curveTime) {
				return '?????????'
			}
		},
	},
}
</script>
<style lang="scss"></style>

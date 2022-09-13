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
				</yx-table>
			</el-row>
		</div>
		<!-- 编辑直播计划弹框 S -->
		<add-an-edit-live-plan-dialog
			:dialogVisible.sync="dialogLivePlanVisible"
			:editItem.sync="editItem"
			@updateList="_getLivePlanPageList(true)"
		></add-an-edit-live-plan-dialog>
		<!-- 编辑直播计划弹框 E	 -->
		<!-- 禁用直播弹框 S -->
		<disable-live-dialog
			:dialogVisible.sync="disableVisible"
			:itemInfo.sync="disableItem"
			@updateList="_getLivePlanPageList(true)"
		></disable-live-dialog>
		<!-- 禁用直播弹框 E -->
		<!-- 编辑商品信息弹框 S -->
		<edit-goods-info-dialog
			:dialogVisible.sync="dialogGoodsInfoVisible"
			:itemInfo.sync="editLiveGoodInfo"
			@updateList="_getLivePlanPageList(true)"
		></edit-goods-info-dialog>

		<look-code-dialog ref="form" :title="title" :visible.sync="formDialog" />

		<add-like-dialog
			:dialogVisible.sync="disableLikeVisible"
			:itemInfo.sync="liveItem"
		/>
		<marketing-tool-dialog
			ref="marketingTool"
			:dialogVisible.sync="marketingDialog"
			:itemInfo.sync="editMarketingToolInfo"
			@updateList="_getLivePlanPageList(true)"
		/>
		<editDialog ref="rule" :visible.sync="editRuleDialog" />

		<hotfix-dialog
			:dialogVisible.sync="hotfixVisible"
			:itemInfo.sync="hotfixItem"
		/>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import addAnEditLivePlanDialog from './addAnEditLivePlanDialog'
import disableLiveDialog from './disableLiveDialog'
import editDialog from './editDialog'
import addLikeDialog from './addLikeDialog'
import editGoodsInfoDialog from './editGoodsInfoDialog'
import marketingToolDialog from './marketingToolDialog'
import hotfixDialog from './hotfixDialog'
import { getLivePlanPageList, deleteLivePlan } from '@/api/livePlan'
import { wgGetDate, getConstantValueByKey } from '@/utils/helper/common'
import moment from 'moment'
import lookCodeDialog from './lookCodeDialog'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		addAnEditLivePlanDialog,
		disableLiveDialog,
		editGoodsInfoDialog,
		lookCodeDialog,
		addLikeDialog,
		marketingToolDialog,
		editDialog,
		hotfixDialog,
	},
	name: 'FormTable',

	data() {
		return {
			formDialog: false, // 二维码弹窗
			showLoading: false,
			editItem: {}, // 编辑项
			disableItem: {}, // 禁用项
			liveItem: {}, // 人气项
			hotfixItem: {}, //紧急修复
			dialogCouponVisible: false, // 选择优惠券弹框
			dialogGroupVisible: false, //选择品牌弹框开关
			currentTime: null,
			selectedGoodsGroup: {}, // 分组选中项
			dialogGoodsInfoVisible: false, // 编辑商品信息弹框开关
			editLiveGoodInfo: {}, // 编辑商品直播项
			editMarketingToolInfo: {}, // 编辑营销工具
			disableVisible: false,
			disableLikeVisible: false, // 人气值调整
			selectedAnchor: {},
			dialogLivePlanVisible: false,
			marketingDialog: false,
			editRuleDialog: false,
			hotfixVisible: false,
			pickerOptions: {},
			searchData: {
				livePlanId: '', //直播Id
				nicknameLike: '', //主播昵称
				livePlanNameLike: '', //直播名称
				planStatus: '', //计划状态
				expectStartQuery: wgGetDate().getMonthStartDate, //直播开始时间
				expectEndQuery: wgGetDate().getMonthEndDate, //直播结束时间
			},
			searchCfg: [
				{
					type: 'inputNumber',
					title: '直播ID',
					dataIndex: 'livePlanId',
				},
				{
					type: 'input',
					title: '直播名称',
					dataIndex: 'livePlanNameLike',
				},
				{
					type: 'input',
					title: '主播昵称',
					dataIndex: 'nicknameLike',
				},
				{
					title: '计划状态',
					type: 'select',
					dataIndex: 'planStatus',
					label: 'value',
					options: this.$store.state.app.constant.LIVE_STATUS,
				},
				{
					title: '直播时间',
					type: 'datetimerange',
					dataIndex: ['expectStartQuery', 'expectEndQuery'],
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getLivePlanPageList(true)
					},
				},
				{
					title: '创建计划',
					type: 'primary',
					click: () => {
						this.addPlan()
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					width: 80,
					type: 'string',
					dataIndex: 'livePlanId',
					title: '直播ID',
				},
				{
					type: 'string',
					dataIndex: 'livePlanName',
					title: '直播名称',
				},
				{
					type: 'string',
					dataIndex: 'nickname',
					title: '主播昵称',
				},
				{
					width: 255,
					type: 'string',
					title: '活动计划时间',
					dataIndex: 'planStartTime',
					customRender: (row) => {
						return (
							moment(row.planStartTime).format('YYYY-MM-DD HH:mm:ss') +
							' - ' +
							moment(row.planEndTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					width: 135,
					type: 'data',
					title: '直播预计开始时间',
					dataIndex: 'expectStartTime',
				},
				{
					type: 'string',
					title: '关联分组',
					customRender: (row) => {
						return row.goodsGroupNameList.length > 0
							? row.goodsGroupNameList.toString()
							: '-'
					},
				},
				{
					type: 'string',
					title: '关联活动',
					customRender: (row) => {
						return (row.jumpType == 2 || row.jumpType == 3) &&
							row.goodsGroupName
							? row.goodsGroupName
							: '-'
					},
				},
				{
					width: 80,
					type: 'string',
					dataIndex: 'couponNum',
					title: '优惠券',
				},
				{
					width: 100,
					type: 'string',
					dataIndex: 'planStatus',
					title: '计划状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.LIVE_STATUS,
							row.planStatus,
							'-',
							'planStatus'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'disabledRemark',
					title: '备注',
				},
				{
					type: 'action',
					title: '操作',
					width: 150,
					actions: [
						{
							title: '编辑活动',
							click: (row) => {
								this.addPlan(row)
							},
						},
						{
							title: '编辑商品',
							click: (row) => {
								this.$router.push({
									path: `/live/goodsInfo/${row.livePlanId}`,
								})
							},
							customRender: (action, row) => {
								action.hide = row.planStatus != 2 && row.planStatus != 0
								return action
							},
						},
						{
							title: '禁用直播',
							click: (row) => {
								this.disableLivePlan(row)
							},
						},
						{
							title: '删除',
							customRender: (action, row) => {
								action.hide = row.planStatus != 0
								return action
							},
							click: (row) => {
								this.deleteLivePlan(row)
							},
						},
						{
							title: '快速查看',
							click: (row) => {
								this.handleLookCode(row)
							},
							customRender: (action, row) => {
								action.hide = row.planStatus == 0
								return action
							},
						},
						{
							title: '营销工具',
							click: (row) => {
								// this.callGroupAndCouponData(row)
								this.marketingToolData(row)
								// this.marketingDialog = true
							},
						},
						{
							title: '人气值调整',
							customRender: (action, row) => {
								action.hide = row.flag == 0
								return action
							},
							click: (row) => {
								this.handleAddLike(row)
							},
						},
						{
							title: '紧急维护',
							click: (row) => {
								this.handleHotfix(row)
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
					this._getLivePlanPageList()
				},
			},
		}
	},
	created() {
		this._getLivePlanPageList(true)
	},
	methods: {
		async callGroupAndCouponData(row) {
			// 获取当前想商品信息
			this.editLiveGoodInfo = row
			this.dialogGoodsInfoVisible = true
		},
		async marketingToolData(row) {
			this.editMarketingToolInfo = row
			this.marketingDialog = true
			console.log('111', this.marketingDialog)
		},
		async disableLivePlan(row) {
			// 禁用直播
			if (row && row.livePlanId) {
				this.disableVisible = true
				this.disableItem = {
					livePlanId: row.livePlanId,
					disabledRemark: '',
				}
			}
		},
		deleteLivePlan(row) {
			// 删除直播计划
			this.$confirm('确定要删除该直播计划吗？', '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						let {
							data: { resultMsg, resultCode },
						} = await deleteLivePlan({
							livePlanId: row.livePlanId,
						})
						this.$message({
							message: resultMsg,
							type: resultCode == 0 ? 'success' : 'warning',
						})
						this._getLivePlanPageList(true)
					}
				},
			})
		},
		async addPlan(row) {
			// 新建直播计划弹框
			if (row && row.livePlanId) {
				// 编辑直播计划
				this.editItem = row
			} else {
				this.editItem = {}
			}
			this.dialogLivePlanVisible = true
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
			paramJson.expectStartQuery =
				moment(paramJson.expectStartQuery).valueOf() || ''
			paramJson.expectEndQuery =
				moment(paramJson.expectEndQuery).valueOf() || ''
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		async _getLivePlanPageList(flag) {
			// 直播列表
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let { data } = await getLivePlanPageList(paramJson)
			this.showLoading = false
			if (data.resultCode == 0) {
				this.tableData = data.resultData.livePlanList
				this.page.count = data.resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		// 二维码显示
		handleLookCode(row) {
			this.formDialog = true
			this.$nextTick(() => {
				this.$refs.form.detail(row)
			})
		},
		// 人气值调整
		handleAddLike(row) {
			if (row && row.livePlanId) {
				this.disableLikeVisible = true
				this.liveItem = {
					livePlanId: row.livePlanId,
					disabledRemark: '',
				}
			}
		},
		handleHotfix(row) {
			if (row && row.livePlanId) {
				this.hotfixVisible = true
				this.hotfixItem = {
					livePlanId: row.livePlanId,
				}
			}
		},
	},
}
</script>

<style lang="scss" scope></style>

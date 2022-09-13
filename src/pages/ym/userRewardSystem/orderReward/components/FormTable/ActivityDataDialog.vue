<template>
	<yx-dialog
		title="活动数据"
		:bottomBtn="bottomBtn"
		:visible.sync="localVisible"
		:before-close="resetForm"
	>
		<div>
			<yx-form
				:inline="true"
				:data="formData"
				:items="formCfg"
				:formAction="formAction"
			></yx-form>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tialogColumns"
					:data="tableData"
					:pagination="page"
				>
				</yx-table>
			</el-row>
		</div>
		<activity-details-dialog
			:visible.sync="activityDetailsDialog"
			:activityDetailsRow="activityDetailsRow"
			@transmit="transmit"
		></activity-details-dialog>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import ActivityDetailsDialog from './ActivityDetailsDialog'
import { listPageActivityReward } from '@/api/userRewardSystem'
export default {
	components: {
		YxDialog,
		YxTable,
		YxForm,
		ActivityDetailsDialog,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			default: false,
		},
		activityDataRow: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			activityDetailsDialog: false,
			activityDetailsRow: {},
			tableData: [],
			showLoading: false,
			formData: {
				searchUserId: '',
			},
			formCfg: [
				{
					type: 'input',
					title: '用户ID',
					dataIndex: 'searchUserId',
				},
			],
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._listPageActivityReward(true)
					},
				},
			],
			tialogColumns: [
				{
					type: 'string',
					dataIndex: 'userId',
					title: '用户ID',
				},
				{
					type: 'string',
					dataIndex: 'organizationName',
					title: '店铺名称',
				},
				{
					type: 'string',
					dataIndex: 'effectiveRewardAmount',
					title: '奖励销售分',
				},
				{
					type: 'string',
					dataIndex: 'effectiveRewardCash',
					title: '奖励金额',
				},
				{
					type: 'string',
					dataIndex: 'effectiveGoodsSum',
					title: '有效商品数',
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '查看详情',
							click: (row) => {
								this.activityDetailsDialog = true
								this.activityDetailsRow = row
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
					this._listPageActivityReward()
				},
			},
		}
	},
	computed: {
		localVisible: {
			get() {
				return this.visible
			},
			set(val) {
				this.$emit('update:visible', val)
			},
		},
	},

	watch: {
		localVisible(val) {
			if (val) {
				console.log(this.activityDataRow, 'adfasdfasdfdf')
				this._listPageActivityReward(true)
			}
		},
	},
	methods: {
		transmit() {
			this.localVisible = false
		},
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			let newSearchData = Object.assign(this.formData, this.paramJson)
			const paramJson = Object.assign(newSearchData, {
				activitySn: this.activityDataRow.activitySn,
				currentPage: this.page.currentPage,
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})

			return paramJson
		},
		async _listPageActivityReward(flag) {
			let paramJson = this.findSearchParams(flag)
			console.log(paramJson, 'axfaadfsdfsdf')
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await listPageActivityReward(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.records
				this.page.count = resultData.total
			}
		},
		resetForm() {
			this.localVisible = false
		},
	},
}
</script>

<style lang="scss" scoped></style>

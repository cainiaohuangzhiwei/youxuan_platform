<template>
	<el-dialog
		width="50%"
		title="选择活动奖励规则"
		v-loading="loading"
		:visible.sync="localVisible"
		:before-close="resetForm"
		append-to-body
		@open="open"
	>
		<YxForm
			:inline="true"
			:data="formData"
			:items="formItems"
			:formAction="formAction"
			:labelWidth="'110px'"
		/>
		<YxTable :columns="tableColumns" :pagination="page" :data="tableData">
			<template slot="checkradio" slot-scope="scope">
				<el-radio
					v-model="actSaleRewardId"
					:label="scope.row.actSaleRewardId"
					@change="radioChange(scope.row)"
					>选择</el-radio
				>
			</template>
		</YxTable>
		<YxForm :formAction="formActionSubmit" />
	</el-dialog>
</template>

<script>
import { platFormList } from '@/api/userRewardSystem'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		YxForm: () => import('@wg-vue-materials/yx-form'),
		YxTable: () => import('@wg-vue-materials/yx-table'),
	},

	data() {
		return {
			actSaleRewardId: '',
			actSaleRewardName: '',
			formData: {
				ruleName: '',
			},
			formItems: [
				{
					type: 'input',
					title: '规则名称',
					dataIndex: 'activityName',
				},
			],
			loading: false,
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._platFormList(true)
					},
				},
			],
			formActionSubmit: [
				{
					title: '取消',
					type: '',
					click: () => {
						this.localVisible = false
					},
				},
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submit()
					},
				},
			],
			tableColumns: [
				{
					title: '规则名称',
					dataIndex: 'activityName',
				},
				{
					title: '活动状态',
					dataIndex: 'actRewardStatus',
					customRender: (row) => {
						return this.convertActivityStatus(row)
					},
				},
				{
					type: 'custom',
					title: '操作',
					dataIndex: 'checkradio',
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
			tableData: [],
			actRewardStatusMap: {
				1: '未开始',
				2: '进行中',
				3: '待发奖',
				4: '已结束',
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

	methods: {
		resetForm() {
			this.localVisible = false
		},
		async open() {
			this._platFormList(true)
		},
		async _platFormList(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await platFormList(paramJson)

			if (resultCode == 0) {
				if (resultData && resultData.records.length > 0) {
					this.page.count = resultData.total
					this.tableData = resultData.records
				} else {
					this.page.count = 0
					this.tableData = []
				}
			}
			this.loading = false
		},
		findSearchParams(flag) {
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.formData, {
				length: this.page.length,
				currentPage: this.page.currentPage,
				startIndex: (this.page.currentPage - 1) * this.page.length,
				actRewardStatus: [1, 2],
			})
			return paramJson
		},

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
		submit() {
			if (this.actSaleRewardId) {
				this.$emit(
					'checkActSaleRewardId',
					this.actSaleRewardId,
					this.actSaleRewardName
				)
				this.localVisible = false
			} else {
				this.$message.warning('请选择关联奖励')
			}
		},
		radioChange(row) {
			this.actSaleRewardName = row.activityName
		},
	},
}
</script>

<style lang="scss" scoped></style>

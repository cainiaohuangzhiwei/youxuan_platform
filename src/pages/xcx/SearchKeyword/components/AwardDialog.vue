<template>
	<el-dialog
		width="800px"
		title="选择活动"
		append-to-body
		:close-on-click-modal="false"
		:visible.sync="localVisible"
		:before-close="resetForm"
	>
		<YxForm
			ref="form"
			:inline="true"
			:items="item"
			:data="formData"
			:formAction="formAction"
		/>
		<YxTable
			v-loading="loading"
			:columns="tableColumns"
			:pagination="page"
			:data="tableData"
		>
			<template slot="actDiscountId" slot-scope="scope">
				<el-radio
					v-model="rowData.actDiscountId"
					:label="scope.row.actDiscountId"
					@change="changeAnchor(scope.row)"
					>选择</el-radio
				>
			</template>
		</YxTable>

		<div class="wg-text-right wg-mt20" v-if="page.count > 0">
			<el-button type="primary" @click="submitForm">确定</el-button>
		</div>
	</el-dialog>
</template>

<script>
import { getActDiscountListByCondition } from '@/api/yhtPlusCmsAct.js'

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
			item: [
				{
					title: '活动名称',
					dataIndex: 'keyword',
					placeholder: '请输入活动名称',
				},
			],
			formData: {
				keyword: '',
			},
			rowData: {},
			loading: false,
			tableData: [],
			tableColumns: [
				{
					width: 200,
					type: 'custom',
					dataIndex: 'actDiscountId',
				},
				{
					title: '活动奖励名称',
					dataIndex: 'actName',
				},
				{
					title: '活动状态',
					dataIndex: 'activityStatus',
					customRender: (row) => {
						return this.convertActivityStatus(row)
					},
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init(true)
					},
				},
			],
		}
	},

	watch: {
		visible() {
			if (this.visible) {
				this.init(true)
			}
		},
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
		details(actDiscountId) {
			this.rowData.actDiscountId = actDiscountId
			this.init(true)
		},

		changeAnchor(row) {
			this.rowData = Object.assign({}, row)
		},

		findSearchParams(flag) {
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.formData, {
				length: this.page.length,
				currentPage: this.formData.actName ? 1 : this.page.currentPage,
				startIndex: this.formData.actName
					? 0
					: (this.page.currentPage - 1) * this.page.length,
			})

			return paramJson
		},

		async init(flag) {
			this.loading = true
			const paramJson = this.findSearchParams(flag)
			paramJson.openTypeList = ['1', '2']
			const {
				data: { resultCode, resultData },
			} = await getActDiscountListByCondition(paramJson)

			if (resultCode == 0) {
				this.tableData = resultData.actDiscountList
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
			this.loading = false
		},

		resetForm() {
			this.localVisible = false
			this.rowData = {}
			this.$refs.form.$refs.YxForm.resetFields()
		},

		submitForm() {
			if (!this.rowData.actDiscountId) {
				return this.$message.warning('请选择活动')
			}

			this.$emit('awardMethod', this.rowData)
			this.resetForm()
		},

		/**
		 *活动状态
		 *未开始：当前时间小于活动开始时间，活动状态为未开始
		 *进行中：活动开始时间<当前时间<活动结束时间，活动状态为进行中
		 *待领奖：活动结束时间<当前时间<奖励截止时间，活动状态为待领奖
		 *已结束：奖励截止时间<当前时间，活动状态为已结束
		 */
		convertActivityStatus({ activityEnd, startTime, endTime }) {
			const curveTime = Date.parse(new Date())
			if (activityEnd == 1) {
				return '已结束'
			}
			if (curveTime < startTime) {
				return '未开始'
			} else if (startTime < curveTime && curveTime < endTime) {
				return '进行中'
			} else if (endTime < curveTime) {
				return '已结束'
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>

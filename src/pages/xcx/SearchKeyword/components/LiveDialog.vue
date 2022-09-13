<template>
	<el-dialog
		width="800px"
		title="选择直播"
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
			<template slot="livePlanId" slot-scope="scope">
				<el-radio
					v-model="rowData.livePlanId"
					:label="scope.row.livePlanId"
					@change="changeAnchor(scope.row)"
					>选择</el-radio
				>
			</template>
		</YxTable>

		<div class="wg-text-right" v-if="page.count > 0">
			<el-button type="primary" @click="submitForm">确定</el-button>
		</div>
	</el-dialog>
</template>

<script>
import moment from 'moment'
import { getLivePlanPageList } from '@/api/livePlan'
import { getConstantValueByKey } from '@/utils/helper/common'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	watch: {
		visible() {
			if (this.visible) {
				this.init(true)
			}
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
					title: '直播名称',
					dataIndex: 'livePlanNameLike',
					placeholder: '请输入直播名称',
				},
				{
					title: '直播状态',
					dataIndex: 'planStatus',
					placeholder: '请输入直播状态',
					type: 'select',
					label: 'value',
					options: this.$store.state.app.constant.LIVE_STATUS,
				},
			],
			formData: {
				livePlanNameLike: '',
				planStatus: '',
			},
			rowData: {},
			loading: false,
			tableData: [],
			tableColumns: [
				{
					width: 80,
					type: 'custom',
					dataIndex: 'livePlanId',
				},
				{
					width: 90,
					title: '直播ID',
					dataIndex: 'livePlanId',
				},
				{
					title: '直播名称',
					dataIndex: 'livePlanName',
				},
				{
					width: 130,
					title: '主播昵称',
					dataIndex: 'nickname',
				},
				{
					width: 290,
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
					width: 80,
					title: '计划状态',
					dataIndex: 'planStatus',
					customRender: ({ planStatus }) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.LIVE_STATUS,
							planStatus,
							'-',
							'planStatus'
						)
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
		details(livePlanId) {
			this.rowData.livePlanId = parseInt(livePlanId.toString())
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
				startIndex: this.formData.livePlanNameLike
					? 0
					: (this.page.currentPage - 1) * this.page.length,
			})

			return paramJson
		},

		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const {
				data: { resultData },
			} = await getLivePlanPageList(paramJson)

			if (resultData.livePlanList.length > 0) {
				this.tableData = resultData.livePlanList
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
			if (!this.rowData.livePlanId) {
				return this.$message.warning('请选择直播')
			}
			this.$emit('liveMethod', this.rowData)
			this.resetForm()
		},
	},
}
</script>

<style lang="scss" scoped></style>

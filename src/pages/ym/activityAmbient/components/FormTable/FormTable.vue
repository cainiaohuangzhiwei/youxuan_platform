<template>
	<basic-container>
		<el-button class="add" type="primary" @click="addActivityAmbient(1, {})"
			>新增活动氛围</el-button
		>

		<YxTable
			class="wg-mt20"
			v-loading="loading"
			:columns="tableColumns"
			:pagination="page"
			:data="tableData"
		/>

		<EditDialog
			ref="activityAmbient"
			:visible.sync="activityAmbientDialog"
			@fatherMethodInit="fatherMethodInit"
		/>
	</basic-container>
</template>

<script>
import moment from 'moment'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import EditDialog from './EditDialog'
import { pageQuery, finishOperation } from '@/api/activityAmbient'
import { getConstantValueByKey } from '@/utils/helper/common'
export default {
	components: {
		BasicContainer,
		YxTable,
		EditDialog,
	},

	name: 'FormTable',

	data() {
		return {
			loading: false,
			activityAmbientDialog: false,
			tableData: [],
			tableColumns: [
				{
					dataIndex: 'actAtmosphereId',
					title: '氛围ID',
				},
				{
					dataIndex: 'name',
					title: '氛围名称',
				},
				{
					dataIndex: 'showTime',
					title: '展示时间',
				},
				{
					type: 'string',
					dataIndex: 'actState',
					title: '状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.ACTIVITY_AMBIENT_STATE,
							row.actState,
							'-',
							'actState'
						)
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
								this.addActivityAmbient(2, row)
							},
							customRender: (action, row) => {
								action.hide = row.actState == 2
								return action
							},
						},
						{
							title: '结束',
							click: (row) => {
								this.handleFinish(row)
							},
							customRender: (action, row) => {
								action.hide = row.actState == 2
								return action
							},
						},
						{
							title: '查看',
							click: (row) => {
								this.addActivityAmbient(3, row)
							},
							customRender: (action, row) => {
								action.hide = row.actState != 2
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
					this.init()
				},
			},
		}
	},

	created() {
		this.init()
	},

	methods: {
		findSearchParams(flag) {
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = {
				length: this.page.length,
				currentPage: this.page.currentPage,
			}

			return paramJson
		},

		fatherMethodInit() {
			this.init(true)
		},

		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true

			const {
				data: { resultData },
			} = await pageQuery(paramJson)

			if (resultData.records.length > 0) {
				this.tableData = resultData.records.map((item) => {
					return {
						...item,
						showTime:
							item.showStartTime && item.showEndTime
								? `${moment(item.showStartTime).format(
										'YYYY-MM-DDHH:mm:ss'
								  )} - ${moment(item.showEndTime).format('YYYY-MM-DDHH:mm:ss')}`
								: '-',
					}
				})
				this.page.count = resultData.total
			} else {
				this.page.count = 0
				this.tableData = []
			}
			this.loading = false
		},

		handleFinish({ name, actAtmosphereId }) {
			this.$confirm(`确定要结束${name}？`, '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						const {
							data: { resultMsg, resultCode },
						} = await finishOperation({ actAtmosphereId, state: 0 })
						const type = resultCode == 0 ? 'success' : 'error'
						this.$message[type](resultMsg)
						this.init(true)
					}
				},
			})
		},

		addActivityAmbient(type, row) {
			this.activityAmbientDialog = true
			this.$nextTick(() => {
				this.$refs.activityAmbient.detail(type, row)
			})
		},
	},
}
</script>

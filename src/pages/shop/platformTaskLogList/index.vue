<template>
	<div>
		<WgForm
			:inline="true"
			labelWidth="96px"
			:data="formData181"
			:items="formCfg181"
			:formAction="formAction181"
			:actionInline="true"
		>
		</WgForm>
		<yx-table
			v-loading="loading"
			:select="false"
			:columns="tableColumns182"
			:pagination="page182"
			:data="tableData182"
		>
		</yx-table>
		<!-- 调整分佣比例记录 -->
		<recordListDialog ref="recordTable" />
	</div>
</template>
<script>
import WgForm from '@wg-vue-materials/wg-form'
import YxTable from '@wg-vue-materials/yx-table'
import recordListDialog from './components/recordListDialog'
import {
	organizationPlatformTaskRecord,
	saveOrUpdatePlatformTaskRecord,
} from '@/api/accountService'

export default {
	name: 'PlatformTaskLogList',
	components: {
		WgForm,
		YxTable,
		recordListDialog,
	},
	props: [],
	data() {
		return {
			loading: false,
			formData181: {
				organizationId: '', // 店主id
				dateMonth: 202205, // 月份
				platformTaskComplete: '', // 是否可参与平台任务
				platformTaskStatus: '', // 平台任务状态
			},
			formCfg181: [
				{
					type: 'inputNumber',
					title: '店主ID',
					dataIndex: 'organizationId',
					placeholder: '请输入店主ID',
				},
				{
					type: 'select',
					title: '月份',
					dataIndex: 'dateMonth',
					label: 'value',
					options: [
						{
							dateMonth: 202212,
							value: '12月',
						},
						{
							dateMonth: 202211,
							value: '11月',
						},
						{
							dateMonth: 202210,
							value: '10月',
						},
						{
							dateMonth: 202209,
							value: '9月',
						},
						{
							dateMonth: 202208,
							value: '8月',
						},
						{
							dateMonth: 202207,
							value: '7月',
						},
						{
							dateMonth: 202206,
							value: '6月',
						},
						{
							dateMonth: 202205,
							value: '5月',
						},
						{
							dateMonth: 202204,
							value: '4月',
						},
					],
				},
				{
					type: 'select',
					title: '是否可参与',
					dataIndex: 'platformTaskComplete',
					label: 'value',
					options: [
						{
							platformTaskComplete: '',
							value: '全部',
						},
						{
							platformTaskComplete: 1,
							value: '是',
						},
						{
							platformTaskComplete: 0,
							value: '否',
						},
					],
				},
				{
					type: 'select',
					title: '状态',
					dataIndex: 'platformTaskStatus',
					label: 'value',
					options: [
						{
							platformTaskStatus: '',
							value: '全部',
						},
						{
							platformTaskStatus: 1,
							value: '已完成',
						},
						{
							platformTaskStatus: 0,
							value: '未完成',
						},
					],
				},
			],
			formAction181: [
				{
					title: '重置',
					align: 'right',
					isClear: true,
				},
				{
					title: '查询',
					align: 'right',
					type: 'primary',
					click: () => {
						this._organizationPlatformTaskRecord(true)
					},
				},
			],
			tableData182: [],
			tableColumns182: [
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: '店主ID',
				},
				{
					type: 'newMap',
					dataIndex: 'platformTaskComplete',
					title: '是否可参与平台任务',
					options: [
						['0', '否'],
						['1', '是'],
						['', '-'],
					],
				},
				{
					type: 'newMap',
					dataIndex: 'platformTaskStatus',
					title: '平台任务状态',
					options: [
						['0', '未完成'],
						['1', '已完成'],
						['', '-'],
					],
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '查看详情',
							// auth: 'getOperationListByRecordId',
							click: (row) => {
								this.$refs.recordTable.detail(row)
							},
						},
						{
							title: '设置为已完成',
							auth: 'orgPlatformTaskRecordChangeStatus',
							customRender: (action, row) => {
								action.hide = row.platformTaskStatus == '1' ? true : false
								return action
							},
							click: (row) => {
								let _this = this
								_this.$confirm('确定设置为已完成？', '提示', {
									type: 'warning',
									callback(action) {
										if (action === 'confirm') {
											_this._updateDisableRelation(row)
										}
									},
								})
							},
						},
						{
							title: '设置为未完成',
							auth: 'orgPlatformTaskRecordChangeStatus',
							customRender: (action, row) => {
								action.hide = row.platformTaskStatus == '1' ? false : true
								return action
							},
							click: (row) => {
								let _this = this
								_this.$confirm('确定设置为未完成？', '提示', {
									type: 'warning',
									callback(action) {
										if (action === 'confirm') {
											_this._updateDisableRelation(row)
										}
									},
								})
							},
						},
					],
				},
			],
			page182: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._organizationPlatformTaskRecord()
				},
			},
		}
	},

	created() {
		this._organizationPlatformTaskRecord()
	},

	methods: {
		_updateDisableRelation: async function (row) {
			// 禁用个体工商户
			const {
				data: { resultCode },
			} = await saveOrUpdatePlatformTaskRecord({
				platformTaskRecordId: row.platformTaskRecordId,
				organizationId: row.organizationId, // 店主id
				dateMonth: row.dateMonth, // 月份
				userName: this.$store.state.user.userInfo.clerkName,
				platformTaskStatus: row.platformTaskStatus == '1' ? 0 : 1,
			})
			if (resultCode == 0) {
				this.$message.success(`操作成功`)
				this._organizationPlatformTaskRecord()
			}
		},
		_organizationPlatformTaskRecord: async function (flag) {
			// 获取列表信息
			this.loading = true
			let paramJson = this.findSearchParams182(flag)
			const {
				data: { resultCode, resultData, total },
			} = await organizationPlatformTaskRecord(paramJson)
			if (resultCode == 0) {
				console.log('resultData------', resultData)
				console.log('resultData------', total)
				this.tableData182 = resultData || []
				this.page182.count = total || 0
			}
			this.loading = false
		},
		findSearchParams182(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page182.currentPage = 1
			}
			const paramJson = Object.assign(
				{
					pageSize: this.page182.length,
					pageNum: this.page182.currentPage,
				},
				this.formData181
			)
			return paramJson
		},
	},
}
</script>

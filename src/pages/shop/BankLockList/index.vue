<template>
	<div class="xcxImgList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData181"
				:items="formCfg181"
				:formAction="formAction181"
			>
			</yx-form>
			<yx-table
				v-loading="loading"
				:select="false"
				:columns="tableColumns182"
				:pagination="page182"
				:data="tableData182"
			>
			</yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import {
	getAccCustomerAuthInfoListFors,
	updateAccCustomerAuthInfoStatus,
} from '@/api/taxAdministration'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	props: [],
	data() {
		return {
			loading: false,
			formData181: {
				organizationId: '',
			},
			formCfg181: [
				{
					type: 'inputNumber',
					title: '店主ID',
					dataIndex: 'organizationId',
					placeholder: '请输入店主ID',
				},
			],
			formAction181: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getAccCustomerAuthInfoListFors(true)
					},
				},
				{
					title: '重置',
					isClear: true,
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
					type: 'string',
					dataIndex: 'name',
					title: '客户名称',
				},
				{
					type: 'newMap',
					dataIndex: 'status',
					title: '锁定状态',
					options: [
						['1', '锁定'],
						['2', '解锁'],
					],
				},
				{
					type: 'string',
					dataIndex: 'endLockingTime',
					title: '锁定截止时间',
					customRender: (row) => {
						return row.endLockingTime
							? moment(row.endLockingTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '解锁',
							auth: 'accCustomerAuthInfoUpdateStatus',
							click: (row) => {
								this._updateAccCustomerAuthInfoStatus(row)
							},
							customRender: (action, row) => {
								action.hide = row.status == 1 ? false : true
								return action
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
					this._getAccCustomerAuthInfoListFors()
				},
			},
		}
	},

	created() {},

	methods: {
		_updateAccCustomerAuthInfoStatus: async function (row) {
			// 更新解锁状态
			this.loading = true
			let paramJson = {
				status: row.status == 1 ? 2 : 1,
				accCustomerAuthInfoId: row.accCustomerAuthInfoId,
				organizationId: row.organizationId,
			}
			const {
				data: { resultCode },
			} = await updateAccCustomerAuthInfoStatus(paramJson)
			if (resultCode == 0) {
				this._getAccCustomerAuthInfoListFors()
			}
			this.loading = false
		},
		_getAccCustomerAuthInfoListFors: async function (flag) {
			// 校验是否输入店主id
			if (!this.formData181.organizationId) {
				this.$message.warning(`请填写店主ID`)
				return
			}
			this.loading = true
			let paramJson = this.findSearchParams182(flag)
			const {
				data: { resultCode, resultData },
			} = await getAccCustomerAuthInfoListFors(paramJson)
			if (resultCode == 0) {
				this.tableData182 = resultData.list
				this.page182.count = resultData.count
			}
			this.loading = false
		},
		findSearchParams182(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page182.currentPage = 1
			}
			const paramJson = Object.assign(this.formData181, {
				length: this.page182.length,
				startIndex: (this.page182.currentPage - 1) * this.page182.length,
			})
			return paramJson
		},
	},
}
</script>

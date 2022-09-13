/* eslint-disable no-unused-vars */
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
					:select="true"
					v-loading="loading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
					:selectionChange="selectionChange"
				></yx-table>
			</el-row>
		</div>
	</basic-container>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { numberFormat } from '@/utils/helper/common'
import { getConstantValueByKey } from '@/utils/helper/common'
import { list, switchOnOff } from '@/api/merchant'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			numberFormat: numberFormat,
			searchData: {
				supplierName: '', //商家名称
				supplierId: '', //商家Id
				sftChannelSwitch: '', //收付通开户开关:1-开启,0 - 未开启
			},
			loading: false,
			selectionData: [],
			searchCfg: [
				{
					title: '商家名称',
					type: 'input',
					dataIndex: 'supplierName',
					placeholder: '请输入商家名称',
					change: () => {
						this.init()
					},
				},
				{
					title: '商家Id',
					type: 'inputNumber',
					dataIndex: 'supplierId',
					placeholder: '请输入商家Id',
					change: () => {
						this.init()
					},
				},
				// {
				// 	type: 'select',
				// 	title: '收付通开户状态',
				// 	dataIndex: 'status',
				// 	label: 'value',
				// 	options: this.$store.state.app.constant.CASH_FLTX_SUPPLIER_LIST_TYPE,
				// },
				{
					type: 'select',
					title: '收付通开户开关',
					dataIndex: 'sftChannelSwitch',
					label: 'value',
					options: [
						{
							sftChannelSwitch: '',
							value: '全部',
						},
						{
							sftChannelSwitch: 1,
							value: '开启',
						},
						{
							sftChannelSwitch: 0,
							value: '关闭',
						},
					],
				},
			],
			searchAction: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init(true)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					dataIndex: 'supplierId',
					title: '商家ID',
				},
				{
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'string',
					dataIndex: 'sftChannelSwitch',
					title: '收付通开户开关',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.SWITCH_THROUGH_PAYMENT,
							row.sftChannelSwitch,
							'-',
							'sftChannelSwitch'
						)
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '开启',
							auth: 'sftSwitch',
							click: (row) => {
								this.freezeOrThaw(row)
							},
							customRender: (action, row) => {
								action.hide = row.sftChannelSwitch == 1
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
		this.init(true)
	},

	methods: {
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			console.log('flag', flag)
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.searchData, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})
			return paramJson
		},
		//开启
		freezeOrThaw(row) {
			const paramJson = Object.assign(
				{},
				{
					supplierId: row.supplierId,
				}
			)
			this.$confirm(
				`是否开启"${row.supplierName}"商家，开启后暂不允许重新关闭！`,
				'提示',
				{
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							let {
								data: { resultCode },
							} = await switchOnOff(paramJson)
							if (resultCode == 0) {
								this.init()
							}
						}
					},
				}
			)
		},
		// 列表
		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			let {
				data: {
					resultCode,
					resultData: { recordList = [], count = 0 },
				},
			} = await list(paramJson)
			if (resultCode == 0) {
				this.tableData = recordList
				this.page.count = count
			} else {
				this.page.count = 0
				this.tableData = []
				this.loading = false
			}
		},
	},
}
</script>

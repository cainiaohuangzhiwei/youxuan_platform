<template>
	<div>
		<yx-form
			ref="YxForm"
			:inline="true"
			:data="searchData"
			:items="searchCfg"
			:formAction="searchAction"
		></yx-form>

		<yx-table
			v-loading="loading"
			:columns="tableColumns"
			:pagination="page"
			:data="tableData"
		></yx-table>
	</div>
</template>

<script>
import moment from 'moment'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { directList } from '@/api/shopDetail'
import {
	getConstantValueByKey,
	// retainDecimalPoint,
} from '@/utils/helper/common'

export default {
	components: {
		YxForm,
		YxTable,
	},

	props: {
		organizationId: {
			default: '',
		},
	},

	data() {
		return {
			searchData: {
				payType: '0',
				status: '0',
				levelId: '-1',
				remark: '',
			},
			searchCfg: [
				{
					type: 'select',
					title: '类型',
					dataIndex: 'payType',
					label: 'value',
					options: this.$store.state.app.constant.INDIRECT_PAY_STATE,
				},
				{
					type: 'select',
					title: '状态',
					dataIndex: 'status',
					label: 'value',
					options: this.$store.state.app.constant.INDIRECT_STATE,
				},
				// {
				// 	type: 'select',
				// 	title: '等级',
				// 	dataIndex: 'levelId',
				// 	label: 'value',
				// 	options: this.$store.state.app.constant.LEVEL_SELECT,
				// },
				{
					title: ' 备注',
					dataIndex: 'remark',
					placeholder: '请输入备注',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init()
					},
				},
				{
					title: '重置',
					click: () => {
						this.resetForm()
					},
				},
			],
			tableData: [],
			loading: false,
			tableColumns: [
				{
					dataIndex: 'inviteCode',
					title: '邀请码',
				},
				{
					type: 'string',
					dataIndex: 'payType',
					title: '类型',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.PAY_TYPE,
							row.payType,
							'其他',
							'state'
						)
					},
				},
				// {
				// 	dataIndex: 'codePrice',
				// 	title: '费用',
				// 	customRender: (row) => {
				// 		return row.codePrice ? row.codePrice : '-'
				// 	},
				// },
				// {
				// 	dataIndex: 'extractPrice',
				// 	title: '应得分成',
				// 	customRender: (row) => {
				// 		if (row.payType == 2) {
				// 			if (row.extractPrice) {
				// 				return `￥${retainDecimalPoint(row.extractPrice, 2)}`
				// 			} else {
				// 				return '-'
				// 			}
				// 		} else {
				// 			return '无'
				// 		}
				// 	},
				// },
				{
					type: 'string',
					width: '140',
					dataIndex: 'addTime',
					title: '购买/生成时间',
					customRender: (row) => {
						return row.addTime
							? moment(row.addTime).format('YYYY-MM-DD HH:mm')
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '使用状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.EMPLOY_STATE,
							row.status,
							'-',
							'state'
						)
					},
				},
				{
					width: 120,
					type: 'string',
					dataIndex: 'expiryTime',
					title: '有效期',
					customRender: (row) => {
						return this.handleExpiryTime(row)
					},
				},
				{
					dataIndex: 'remark',
					title: '备注',
				},
				{
					width: '120',
					dataIndex: 'phoneMob',
					title: '购买者手机号',
					customRender: (row) => {
						return row.phoneMob ? row.phoneMob : '-'
					},
				},
				{
					width: '120',
					dataIndex: 'usePhone',
					title: '使用者手机号',
					customRender: (row) => {
						return row.usePhone ? row.usePhone : '-'
					},
				},
				{
					dataIndex: 'personalVolume',
					title: '销售额',
				},
				{
					dataIndex: 'payOrderCount',
					title: '成单数',
				},
				// {
				// 	type: 'string',
				// 	dataIndex: 'levelType',
				// 	title: '店铺等级',
				// 	customRender: (row) => {
				// 		return this.convertLevelType(row.levelType)
				// 	},
				// },
				{
					dataIndex: 'organizationName',
					title: '使用店铺',
					customRender: (row) => {
						return row.organizationName ? row.organizationName : '-'
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
		}
	},

	methods: {
		// 搜索条件
		findSearchParams(flag) {
			const paramJson = Object.assign(this.searchData, {
				tag: '2',
				length: this.page.length,
				isExpire: !this.searchData.status ? 2 : 1,
				organizationId: this.organizationId || '',
			})

			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},

		// 获取直接邀请开通情况列表
		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			if (paramJson.status === '') {
				delete paramJson.status
			}

			this.loading = true
			const res = await directList(paramJson)

			if (res.data.resultData.extractList.length > 0) {
				this.tableData = res.data.resultData.extractList
				this.page.count = res.data.resultData.count
				this.loading = false
			} else {
				this.page.count = 0
				this.tableData = []
				this.loading = false
			}
		},

		// 转换店铺等级
		convertLevelType(levelType) {
			if (levelType == 2) {
				return 'VIP店主'
			} else if (levelType == 1) {
				return '服务商'
			} else {
				return '普通店主'
			}
		},

		// 重置
		resetForm() {
			this.searchData = {
				payType: '0',
				status: '0',
				levelId: '-1',
				remark: '',
			}
		},

		// 转换有效期
		handleExpiryTime(row) {
			if (row.payType == 4) {
				return moment(row.addTime + row.expiryTime).format('YYYY-MM-DD HH:mm')
			} else if (row.payType == 5) {
				return !row.expiryTime
					? '无限期'
					: moment(row.addTime + row.expiryTime).format('YYYY-MM-DD HH:mm')
			} else {
				return '无限期'
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>

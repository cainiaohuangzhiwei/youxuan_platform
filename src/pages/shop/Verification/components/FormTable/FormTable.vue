<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:rules="rules"
				:formAction="searchAction"
			></yx-form>

			<el-row>
				<yx-table
					v-loading="loading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				></yx-table>
			</el-row>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getVerifyCodeList } from '@/api/verification'
import { getConstantValueByKey } from '@/utils/helper/common'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			rules: {
				phoneMob: [{ required: true, message: '请输入手机号' }],
			},
			searchData: {
				phoneMob: '',
			},
			searchCfg: [
				{
					title: '手机号',
					dataIndex: 'phoneMob',
					placeholder: '请输入手机号',
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
			],
			loading: false,
			tableData: [],
			orderStatus: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'expiry',
					title: '过期时间',
					customRender: (row) => {
						return row.expiry
							? moment(row.expiry).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					dataIndex: 'phoneMob',
					title: '手机号',
				},
				{
					dataIndex: 'code',
					title: '验证码',
				},
				{
					type: 'string',
					dataIndex: 'verifyType',
					title: '验证码类型',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.VERIFICATION_TYPE,
							row.verifyType,
							'-',
							'state'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'verifyState',
					title: '状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.VERIFY_STATE,
							row.verifyState,
							'-',
							'state'
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
		}
	},

	created() {
		// this.init(true)
	},

	methods: {
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.searchData, {
				startIndex: (this.page.currentPage - 1) * this.page.length,
				length: this.page.length,
			})

			return paramJson
		},

		//获取验证码列表
		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			let res = await getVerifyCodeList(paramJson)

			if (res.data.resultData.verifyCodeList.length > 0) {
				this.tableData = res.data.resultData.verifyCodeList
				this.page.count = res.data.resultData.verifyCodeCount
				this.loading = false
			} else {
				this.page.count = 0
				this.tableData = []
				this.loading = false
			}
		},
	},
}
</script>

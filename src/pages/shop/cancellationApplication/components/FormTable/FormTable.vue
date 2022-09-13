/* eslint-disable no-unused-vars */
<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
				:rules="funRules"
				ref="form"
			>
			</yx-form>
			<yx-form
				ref="ImportForm"
				:inline="true"
				:data="storeData"
				:items="storeFormOptions"
				v-if="importSupplierSettleRule"
			>
			</yx-form>

			<el-row>
				<yx-table
					v-loading="loading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
				</yx-table>
			</el-row>
		</div>
	</basic-container>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { numberFormat } from '@/utils/helper/common'
import moment from 'moment'
import { listByParam } from '@/api/relation'
import { isNull } from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			importSupplierSettleRule: checkFunctionCode('importSupplierSettleRule'),
			storeData: {},
			showHistoryDialog: false, //变更记录
			row: {}, //当前行选中数据
			numberFormat: numberFormat,
			searchData: {
				queryUserId: '',
				// 操作时间
				applyStartTime: moment().startOf('day').valueOf(), //开始时间
				applyEndTime: moment().endOf('day').valueOf(), //结束时间
				userType: '',
			},
			loading: false,
			selectionData: [],
			funRules: {
				queryUserId: [
					{
						validator: (rule, value, callback) => {
							if (value && value < 1) {
								callback(new Error('店主ID不可小于等于0'))
							} else if (value && value.length > 10) {
								callback(new Error('店主ID输入长度不可以大于10位'))
							} else if (value && value > 2147483647) {
								callback(new Error('店主ID不可大于数值‘2147483647’'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			searchCfg: [
				{
					type: 'inputNumber',
					title: '用户ID',
					dataIndex: 'queryUserId',
					placeholder: '请输入用户ID',
					enter: () => {
						this.init()
					},
				},
				{
					type: 'datetimerange',
					dataIndex: ['applyStartTime', 'applyEndTime'],
					title: '申请时间',
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
				{
					title: '用户身份',
					type: 'selectMap',
					dataIndex: 'userType',
					options: {
						全部: '',
						店主: '2',
						顾客: '1',
					},
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
						this.$refs.form.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.init(true)
							}
						})
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					dataIndex: 'id',
					title: '序号',
				},
				{
					type: 'date',
					dataIndex: 'applyTime',
					title: '申请时间',
				},
				{
					dataIndex: 'userId',
					title: '申请人用户ID',
				},
				{
					dataIndex: 'organizationId',
					title: '店主ID',
				},
				{
					dataIndex: 'userType',
					title: '用户身份',
					customRender: (row) => {
						return row.organizationId > 0 ? '店主' : '顾客'
					},
				},
				{
					dataIndex: 'mobilePhone',
					title: '申请人的联系方式',
				},
				{
					dataIndex: 'applyReason',
					title: '申请理由',
				},
				{
					type: 'action',
					title: '操作',
					width: 180,
					actions: [
						{
							title: '查看店铺',
							auth: '',
							click: (row) => {
								this.$router.push({
									path: `shop/shopDetail/${row.organizationId}`,
								})
							},
							customRender: (action, row) => {
								action.hide = !row.organizationId > 0
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
		findSearchParams(flag) {
			const paramJson = Object.assign(this.searchData, {
				pageSize: this.page.length,
				pageNum: (this.page.currentPage - 1) * this.page.length,
			})
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			paramJson.pageNum = this.page.currentPage
			// paramJson.applyStartTime = this.searchData.applyStartTime
			// 	? moment(this.searchData.applyStartTime)
			// 	: ''
			// paramJson.applyEndTime = this.searchData.applyEndTime
			// 	? moment(this.searchData.applyEndTime)
			// 	: ''
			if (isNull(paramJson.orgId)) {
				delete paramJson.orgId
			}
			if (isNull(paramJson.state)) {
				delete paramJson.state
			}
			return paramJson
		},
		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			let {
				data: { resultCode, resultData },
			} = await listByParam(paramJson)
			this.loading = false
			if (resultCode == 0) {
				this.tableData = resultData.recordList.length
					? resultData.recordList
					: []
				this.page.count = resultData.totalCount
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.red-color {
	font-size: 24px;
	color: #d51a21;
	vertical-align: middle;
}
.green-color {
	font-size: 24px;
	color: #407434;
	vertical-align: middle;
}
.yellow-color {
	font-size: 24px;
	color: #f4d000;
	vertical-align: middle;
}
.slot {
	text-align: left;
	display: flex;

	.goods_img {
		width: 60px;
		height: 60px;
		margin-right: 10px;
		line-height: 155px;
	}

	.number {
		margin-right: 10px;
	}

	.goods_name {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
	}
}
.add-btn {
	margin-bottom: 20px;
}
</style>

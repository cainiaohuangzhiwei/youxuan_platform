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
				<template slot="startAddTime">
					<el-date-picker
						v-model="searchData.startAddTime"
						type="date"
						placeholder="选择日期"
					>
					</el-date-picker>
					-
					<el-date-picker
						v-model="searchData.endAddTime"
						type="date"
						placeholder="选择日期"
					>
					</el-date-picker>
				</template>
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
			<history-dialog :itemInfo="row" :visible.sync="showHistoryDialog" />
		</div>
	</basic-container>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import historyDialog from '../historyDialog'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { numberFormat } from '@/utils/helper/common'
import moment from 'moment'
import { relationPage, relationModify } from '@/api/relation'
import { isNull } from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		historyDialog,
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
				orgId: '',
				// 操作时间
				startAddTime: moment().startOf('day').valueOf(), //开始时间
				endAddTime: moment().endOf('day').valueOf(), //结束时间
				state: '',
			},
			loading: false,
			selectionData: [],
			funRules: {
				orgId: [
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
					title: '店主ID',
					dataIndex: 'orgId',
					placeholder: '请输入店主ID',
					enter: () => {
						this.init()
					},
				},
				{
					type: 'custom',
					dataIndex: 'startAddTime',
					title: '添加时间',
				},
				{
					title: '状态',
					type: 'selectMap',
					dataIndex: 'state',
					options: {
						全部: '',
						待审批: 'PENDING',
						未完成: 'INCOMPLETED',
						处理中: 'PROCESSING',
						已完成: 'FINISHED',
						已关闭: 'CLOSED',
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
				{
					title: '新增',
					type: 'primary',
					auth: 'relationcreate',
					click: () => {
						this.$router.push({
							name: 'addChange',
						})
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					dataIndex: 'orgId',
					title: '店主ID',
				},
				{
					dataIndex: 'oldFatherId',
					title: '原直属上级ID',
				},
				{
					dataIndex: 'newFatherId',
					title: '调整后直属上级ID',
				},
				{
					dataIndex: 'relationCount',
					title: '裂变关系链店主数量',
				},
				{
					dataIndex: 'addUser',
					title: '操作人',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					dataIndex: 'stateDesc',
					title: '状态',
				},
				{
					type: 'action',
					title: '操作',
					width: 180,
					actions: [
						{
							title: '审核',
							auth: 'relationModify',
							click: (row) => {
								this.open(row)
							},
							customRender: (action, row) => {
								action.hide =
									row.stateDesc == '已完成' ||
									row.stateDesc == '已关闭' ||
									row.stateDesc == '处理中'
								action.title = row.stateDesc == '未开始' ? '取消' : '审核'
								return action
							},
						},
						{
							title: '查看详情',
							auth: '',
							click: (row) => {
								this.row = row
								this.showHistoryDialog = true
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
		open(row) {
			let _this = this
			if (row.stateDesc == '待审核') {
				_this.$prompt('备注（必填，不超过20字）：', '请确定审核本条记录？', {
					confirmButtonText: '审批通过',
					cancelButtonText: '审批不通过',
					distinguishCancelAndClose: true,
					inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
					inputErrorMessage: '请输入备注',
					inputType: 'textarea',
					inputPlaceholder: '请输入备注',
					inputValidator: (value) => {
						// 点击按钮时，对文本框里面的值进行验证
						if (value && value.length > 20) {
							return '字数太长！'
						}
					},
					callback: async (action, value) => {
						if (action == 'confirm') {
							_this.auditRelationModify(row, value.inputValue, 'INCOMPLETED')
						} else if (action == 'cancel') {
							_this.auditRelationModify(row, value.inputValue, 'CLOSED')
						}
					},
				})
			} else {
				_this.$alert('是否确认取消，取消后将不执行更改操作', '取消', {
					confirmButtonText: '确定',
					callback: (action) => {
						if (action == 'confirm') {
							_this.auditRelationModify(row, '取消', 'CLOSED')
						}
					},
				})
			}
		},
		async auditRelationModify(row, value, text) {
			let {
				data: { resultCode },
			} = await relationModify({
				remark: value,
				state: text,
				requestNo: row.requestNo,
				optUser: this.$store.state.user.userInfo.clerkName,
				optUserId: this.$store.state.user.userInfo.clerkId,
			})
			if (resultCode == 0) {
				this.$message.success('操作成功')
				this.init()
			}
		},
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
			paramJson.startAddTime = this.searchData.startAddTime
				? moment(this.searchData.startAddTime).format('YYYY-MM-DD')
				: ''
			paramJson.endAddTime = this.searchData.endAddTime
				? moment(this.searchData.endAddTime).format('YYYY-MM-DD')
				: ''
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
				data: { resultCode, resultData, total },
			} = await relationPage(paramJson)
			this.loading = false
			if (resultCode == 0) {
				this.tableData = resultData.length ? resultData : []
				this.page.count = total
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

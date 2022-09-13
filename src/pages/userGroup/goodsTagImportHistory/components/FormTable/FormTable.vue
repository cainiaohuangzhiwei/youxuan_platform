<template>
	<basic-container>
		<div>
			<div class="title_css">导入类型：导入标签商品信息</div>
			<yx-form
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			></yx-form>

			<yx-table v-loading="loading" :columns="tableColumns" :data="list">
				<template slot="reqInterfaceNick"></template>
			</yx-table>

			<!-- <el-row type="flex" class="row-bg pagination" justify="end">
				<el-select
					class="el-sel"
					v-model="formInline.length"
					@change="callExchangeHistorysList(true)"
				>
					<el-option
						v-for="item in optionsArr"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					>
					</el-option>
				</el-select>
				<el-button
					@click="changePage('back')"
					:disabled="formInline.page == 1"
					>{{ formInline.page == 1 ? '首页' : '上一页' }}</el-button
				>
				<el-button @click="changePage('next')" :disabled="isData">
					下一页
				</el-button>
			</el-row> -->
			<el-row type="flex" class="row-bg pagination" justify="end">
				<el-pagination
					background
					layout="total, sizes, prev, pager, next, jumper"
					:total="totalCount"
					:page-size="formInline.length"
					:current-page="formInline.page"
					:hide-on-single-page="true"
					@current-change="changePage"
					@size-change="sizeChange"
				>
				</el-pagination>
			</el-row>
			<DetailDialog :visible.sync="DetailDialog" :row="row" />
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { findImportRecordList } from '@/api/webImport.js'

import DetailDialog from './DetailDialog'
import moment from 'moment'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		DetailDialog,
	},
	data() {
		return {
			DetailDialog: false,
			row: {},
			isData: false,
			dialogVisible: false,
			totalCount: 0,
			formInline: {
				importType: 41,
				setTime: [],
				endTime: '', //结束时间
				startTime: '', //开始时间
				status: '', //状态
				fileName: '', //文件名
				clerkName: '', //操作人名称
				clerkId: this.$store.state?.user?.userInfo?.clerkId || '',
				length: 10,
				startIndex: 0,
				page: 1,
			},
			optionsArr: [
				{
					value: 10,
					label: '10条/页',
				},
				{
					value: 20,
					label: '20条/页',
				},
				{
					value: 50,
					label: '50条/页',
				},
				{
					value: 100,
					label: '100条/页',
				},
				{
					value: 200,
					label: '200条/页',
				},
			],
			formCfg: [
				{
					title: '状态',
					type: 'selectMap',
					dataIndex: 'status',
					options: {
						全部: '',
						导入中: 1,
						导入完成: 2,
						导入失败: 3,
					},
				},

				{
					title: '导入时间',
					type: 'time',
					dataIndex: 'setTime',
					placeholder: ['开始时间', '结束时间'],
					timeAttributes: {
						type: 'datetimerange',
						pickerOptions: {
							disabledDate: (time) => {
								let nowDate = new Date()
								let oneDay = 1000 * 60 * 60 * 24
								let oneYearLater = new Date(nowDate.getTime() - oneDay * 182)
								return time.getTime() < oneYearLater
							},
						},
					},
				},

				{
					title: '文件名称',
					type: 'input',
					dataIndex: 'fileName',
					placeholder: '请输入内容',
				},
				{
					title: '操作人',
					type: 'input',
					dataIndex: 'clerkName',
					placeholder: '请输入内容',
				},
			],
			formAction: [
				{
					title: '重置',
					click: () => {
						this.reset()
					},
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.callExchangeHistorysList(true)
					},
				},
			],
			// 详情数据
			list: [],
			loading: false,
			tableColumns: [
				{
					type: 'string',
					dataIndex: '',
					title: '导入日期',
					customRender: (row) => {
						return row.addTime
							? moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},

				{
					type: 'string',
					dataIndex: 'fileName',
					title: '文件名称',
				},
				{
					type: 'string',
					dataIndex: '',
					title: '总行数/成功/失败',
					customRender: (row) => {
						return `${row.rowCount}/${row.successCount}/${row.errorCount}`
					},
				},
				{
					type: 'string',
					dataIndex: 'clerkName',
					title: '操作人',
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '状态',
					customRender: (row) => {
						return row.status === 1
							? '导入中'
							: row.status === 2
							? '导入完成'
							: '导入失败'
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '查看详情',
							click: (row) => {
								this.showDetail(row)
							},
						},
					],
				},
			],
		}
	},

	created() {
		this.formInline.setTime = [
			moment().startOf('day').valueOf(),
			moment().endOf('day').valueOf(),
		]
	},
	mounted() {
		this.callExchangeHistorysList()
	},
	methods: {
		onSubmit() {
			this.callExchangeHistorysList(true)
		},

		changePage(val) {
			this.formInline.page = val
			const { length = 10 } = this.formInline
			this.formInline.startIndex = length * (val - 1)
			this.callExchangeHistorysList()
		},
		reset() {
			this.formInline.status = ''
			this.formInline.fileName = ''
			this.formInline.clerkName = ''
			this.formInline.setTime = [
				moment().startOf('day').valueOf(),
				moment().endOf('day').valueOf(),
			]
			this.$nextTick(() => {
				this.callExchangeHistorysList(true)
			})
		},
		sizeChange(val) {
			this.formInline.page = 1
			this.formInline.length = val
			this.formInline.startIndex = 0
			this.callExchangeHistorysList()
		},

		// 初始化
		async callExchangeHistorysList(flag) {
			if (flag) {
				this.formInline.page = 1
				this.formInline.startIndex = 0
			}
			this.loading = true
			this.list = []
			this.formInline.startTime = this.formInline.setTime
				? moment(this.formInline.setTime[0]).format('x')
				: ''
			this.formInline.endTime = this.formInline.setTime
				? moment(this.formInline.setTime[1]).format('x')
				: ''
			const {
				data: { resultCode, resultData },
			} = await findImportRecordList(this.formInline)
			if (resultCode == 0) {
				if (
					resultData.importDataList?.length === 0 ||
					resultData.importDataList.length < this.formInline.length
				) {
					this.isData = true
				} else {
					this.isData = false
				}
				this.list = resultData?.importDataList || []
				this.totalCount = resultData?.count || 0
			} else {
				this.list = []
			}
			this.loading = false
		},
		showDetail(row) {
			this.DetailDialog = true
			this.row = row
		},
	},
}
</script>

<style lang="scss" scoped>
.el-sel {
	width: 100px;
	margin-right: 10px;
}
.pagination {
	margin-top: 30px;
}
.title_css {
	font-weight: 700;
	margin-bottom: 30px;
}
</style>

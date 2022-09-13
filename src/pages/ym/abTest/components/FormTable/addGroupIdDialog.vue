<template>
	<yx-dialog
		:bottomBtn="bottomBtn"
		:visible.sync="localVisible"
		:before-close="resetForm"
		title="选择测试活动"
	>
		<yx-form
			:inline="true"
			:data="dialogData"
			:items="dialogCfg"
			:formAction="dialogAction"
		></yx-form>

		<el-row>
			<yx-table
				v-loading="showLoading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			>
				<template slot="saleState" slot-scope="scope">
					<div>
						<el-tag type="danger" v-if="curTime < scope.row.saleStartTime">
							未开始
						</el-tag>

						<el-tag type="info" v-if="curTime > scope.row.saleEndTime">
							已结束
						</el-tag>

						<el-tag
							v-if="
								curTime >= scope.row.saleStartTime &&
								curTime <= scope.row.saleEndTime
							"
						>
							进行中
						</el-tag>
					</div>
				</template>
			</yx-table>
		</el-row>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getSmallImg } from '@/utils/imageTool'
import { getTestList } from '@/api/abTest'
import moment from 'moment'

export default {
	components: {
		YxDialog,
		YxForm,
		YxTable,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			define: false,
		},
		mainRow: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			getSmallImg: getSmallImg,
			selectRow: {},
			showLoading: false,
			currentTime: '',
			statusMap: ['未开始', '进行中', '已结束'],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'id',
					title: 'ID',
				},
				{
					title: '测试名称',
					type: 'string',
					dataIndex: 'testName',
				},
				{
					title: '测试时间',
					type: 'string',
					dataIndex: 'startTime',
					customRender: (row) => {
						return (
							moment(row.startTime).format('YYYY-MM-DD HH:mm:ss') +
							'-' +
							moment(row.endTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					title: '状态',
					type: 'string',
					dataIndex: 'status',
					customRender: (row) => {
						const curTime = new Date().getTime()
						const startTime = new Date(
							moment(row.startTime).format('YYYY-MM-DD HH:mm:ss')
						).getTime()
						const endTime = new Date(
							moment(row.endTime).format('YYYY-MM-DD HH:mm:ss')
						).getTime()
						if (endTime > curTime) {
							row.status = 0
						} else if (curTime > endTime) {
							row.status = 2
						}
						if (curTime >= startTime && curTime < endTime) {
							row.status = 1
						}
						return this.statusMap[row.status]
					},
				},
				{
					title: '操作',
					type: 'action',
					fixed: 'right',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.updatedSelectRow(row)
							},
							customRender: (action, row) => {
								action.title = this.findRow(row) ? '移除' : '添加'
								return action
							},
						},
					],
				},
			],
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveSelected()
					},
				},
				{
					title: '取消',
					click: () => {
						this.resetForm()
					},
				},
			],
			dialogData: {
				testId: '',
				testType: 2,
			},
			dialogCfg: [
				{
					type: 'input',
					title: 'ID',
					dataIndex: 'testId',
					placeholder: '输入测试ID',
				},
				{
					type: 'input',
					title: '测试名称',
					dataIndex: 'testName',
				},
			],
			dialogAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getData(true)
					},
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData()
				},
			},

			tableData: [],
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
	mounted() {},
	watch: {
		localVisible(val) {
			if (val) {
				console.log('mainRow>>', this.mainRow)
				this.selectRow = this.mainRow
				this.getData()
			}
		},
	},
	methods: {
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			// this.$refs.form.$refs.YxForm.resetFields()
		},
		saveSelected() {
			this.$emit('save', this.selectRow)
			console.log('保存>>>>', this.selectRow)
			this.localVisible = false
		},
		findRow(row) {
			// 判断是否已经添加用户
			return this.selectRow.groupId === row.id
		},
		updatedSelectRow(row) {
			if (this.findRow(row)) {
				this.selectRow = {}
			} else {
				this.selectRow = {
					groupId: row.id,
				}
			}
			this.$forceUpdate()
		},

		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = Object.assign(this.dialogData, {
				pageSize: this.page.length,
				pageNum: this.page.currentPage,
			})
			if (!this.dialogData.testId) {
				delete paramJson.testId
			}
			return paramJson
		},
		getData: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			const { data } = await getTestList(paramJson)
			const { resultCode, resultData } = data
			this.curTime = new Date().getTime()
			if (resultCode == 0) {
				this.tableData = resultData
				this.page.count = data.total
			} else {
				this.tableData = []
				this.page.count = 0
			}
			this.showLoading = false
		},
	},
}
</script>

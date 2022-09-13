<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			></yx-form>

			<yx-table v-loading="loading" :columns="tableColumns" :data="list">
				<template slot="reqInterfaceNick" slot-scope="scope">
					<div @click="showDetail(scope.row)">
						{{ substringDetail(scope.row) }}
					</div>
				</template>
			</yx-table>

			<el-row type="flex" class="row-bg pagination" justify="end">
				<el-select
					class="el-sel"
					v-model="formInline.pageSize"
					@change="callExchangeGoodsList(true)"
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
			</el-row>

			<el-dialog title="详细信息" :visible.sync="dialogVisible" width="25%">
				{{ reqInterfaceNickNameStr }}
			</el-dialog>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getCmsRedoLogList } from '@/api/yhtPlusCmsRedoLog'
import moment from 'moment'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	data() {
		return {
			isData: false,
			dialogVisible: false,
			formInline: {
				setTime: [],
				endAddTime: '', //结束时间
				startAddTime: '', //开始时间
				os: '', //系统
				osModule: '', //模块
				reqInterfaceNickName: '', //操作事件/接口名称
				success: '', //是否成功
				userAccount: '', //账号
				userName: '', //操作人名称
				pageSize: 10,
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
					title: '操作人账号',
					type: 'input',
					dataIndex: 'userAccount',
					placeholder: '请输入内容',
				},
				{
					title: '操作人',
					type: 'input',
					dataIndex: 'userName',
					placeholder: '请输入内容',
				},
				{
					title: '操作模块',
					type: 'input',
					dataIndex: 'osModule',
					placeholder: '请输入内容',
				},
				{
					title: '操作事件',
					type: 'input',
					dataIndex: 'reqInterfaceNickName',
					placeholder: '请输入内容',
				},
				{
					title: '操作时间',
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
								return time.getTime() > nowDate || time.getTime() < oneYearLater
							},
						},
					},
				},
				{
					title: '操作状态',
					type: 'selectMap',
					dataIndex: 'success',
					options: {
						全部: '',
						成功: true,
						失败: false,
					},
				},
				{
					title: '操作系统',
					type: 'selectMap',
					dataIndex: 'os',
					options: {
						全部: '',
						S端: 'S端',
						商家端: '商家端',
						社群工作台: '社群工作台',
					},
				},
			],
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.callExchangeGoodsList(true)
					},
				},
				{
					title: '重置',
					isClear: true,
				},
			],
			// 详情数据
			list: [],
			loading: false,
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'userAccount',
					title: '操作人账号',
				},
				{
					type: 'string',
					dataIndex: 'userName',
					title: '操作人',
				},
				{
					type: 'string',
					dataIndex: '',
					title: '操作时间',
					customRender: (row) => {
						return row.addTime
							? moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'os',
					title: '操作系统',
				},
				{
					type: 'string',
					dataIndex: 'osModule',
					title: '操作模块',
				},
				{
					type: 'custom',
					dataIndex: 'reqInterfaceNick',
					title: '操作事件',
				},
				{
					type: 'string',
					dataIndex: 'success',
					title: '操作状态',
					customRender: (row) => {
						return row.success ? '成功' : '失败'
					},
				},
			],
		}
	},

	created() {
		this.formInline.setTime = [
			moment().startOf('day').valueOf(),
			moment().format().valueOf(),
		]
	},
	mounted() {
		this.callExchangeGoodsList()
	},
	methods: {
		onSubmit() {
			this.callExchangeGoodsList(true)
		},

		changePage(type) {
			if (type == 'next') {
				this.formInline.page++
			} else {
				this.formInline.page--
			}
			this.callExchangeGoodsList()
		},

		// 初始化
		async callExchangeGoodsList(flag) {
			if (flag) {
				this.formInline.page = 1
			}
			this.loading = true
			this.list = []
			this.formInline.startAddTime = this.formInline.setTime
				? moment(this.formInline.setTime[0]).format('x')
				: ''
			this.formInline.endAddTime = this.formInline.setTime
				? moment(this.formInline.setTime[1]).format('x')
				: ''
			const {
				data: { resultCode, resultData },
			} = await getCmsRedoLogList(this.formInline)
			if (resultCode == 0) {
				if (
					resultData.length === 0 ||
					resultData.length < this.formInline.pageSize
				) {
					this.isData = true
				} else {
					this.isData = false
				}
				this.list = resultData
			} else {
				this.list = []
			}
			this.loading = false
		},
		substringDetail: function (row) {
			let str = '调用' + row.reqInterfaceNickName + ',参数' + row.reqParameters
			if (str.length > 25) {
				str = str.substring(0, 25) + '...'
			}
			return str
		},
		showDetail: function (row) {
			let str = '调用' + row.reqInterfaceNickName + ',参数' + row.reqParameters
			this.reqInterfaceNickNameStr = str
			this.dialogVisible = true
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
</style>

<template>
	<basic-container>
		<div>
			<div style="">
				<yx-form
					style="display: contents"
					:inline="true"
					:data="formInline"
					:items="formCfg"
				>
				</yx-form>
				<div style="float: right">
					<el-input
						type="number"
						placeholder="输入店主 ID 进行搜索"
						v-model="formInline.orgId"
						class="input-with-select wi"
					>
						<el-button
							slot="append"
							icon="el-icon-search"
							@click="_researchFeedbackList"
						></el-button>
					</el-input>
					<el-button
						type="primary"
						style="margin-left: 21px"
						@click="_researchFeedbackExport"
						>导出</el-button
					>
				</div>
			</div>

			<el-row>
				<yx-table
					v-loading="loading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableList"
				>
					<template slot="results" slot-scope="scope">
						<div
							style="display: flex; text-align: left"
							v-for="(item, index) in scope.row.results"
							:key="index"
						>
							{{ index + 1 }}：{{ item.optionDesc }}
						</div>
					</template>
				</yx-table>
			</el-row>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import { researchFeedbackList, researchFeedbackExport } from '@/api/relation'
import { downloadFile } from '@/utils/helper/common'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			loading: false,
			formInline: {
				orgId: '',
				startTime: moment().startOf('month').valueOf(), // 查询开始时间
				endTime: moment().endOf('month').valueOf(), // 查询结束时间
			},
			tableList: [],
			formCfg: [
				{
					title: '',
					label: 'value',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
					change: () => {
						this._researchFeedbackList(true)
					},
				},
			],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'orgId',
					title: '店主ID',
				},
				{
					type: 'string',
					dataIndex: 'addTime',
					title: '提交时间',
				},
				{
					type: 'string',
					dataIndex: 'sceneDesc',
					title: '调研场景',
				},
				{
					type: 'custom',
					dataIndex: 'results',
					width: '800px',
					title: '调研结果',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._researchFeedbackList()
				},
			},
		}
	},
	mounted() {
		this._researchFeedbackList()
	},
	created: function () {
		this._researchFeedbackList(true)
	},
	methods: {
		//导出
		_researchFeedbackExport: async function () {
			let paramJson = {}
			if (this.formInline.orgId) {
				paramJson.orgId = this.formInline.orgId
			}
			paramJson.groupId = this.$store.state.user.userInfo.groupId
			if (this.formInline.startTime) {
				paramJson.startTime = moment(this.formInline.startTime).format(
					'YYYY-MM-DD HH:mm:ss'
				)
			}
			if (this.formInline.endTime) {
				paramJson.endTime = moment(this.formInline.endTime).format(
					'YYYY-MM-DD HH:mm:ss'
				)
			}
			if (paramJson.startTime == undefined || paramJson.endTime == undefined) {
				return this.$message.warning('请选择完整时间')
			}
			let { data } = await researchFeedbackExport(paramJson)
			data && downloadFile(data, '调研反馈表.xlsx')
		},

		// 搜索条件
		findSearchParams(flag) {
			//搜索条件
			let paramJson = {
				pageNum: 1,
				pageSize: 10,
			}
			// 每页的加载数据长度
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.pageNum = this.page.currentPage
			return paramJson
		},
		async _researchFeedbackList(flag) {
			let paramJson = this.findSearchParams(flag)
			if (this.formInline.startTime) {
				paramJson.startTime = moment(this.formInline.startTime).format(
					'YYYY-MM-DD HH:mm:ss'
				)
			}
			if (this.formInline.endTime) {
				paramJson.endTime = moment(this.formInline.endTime).format(
					'YYYY-MM-DD HH:mm:ss'
				)
			}
			if (
				moment(paramJson.startTime).valueOf() >
				moment(paramJson.endTime).valueOf()
			) {
				return this.$message.warning('开始时间不可大于结束时间')
			}
			if (paramJson.startTime == undefined || paramJson.endTime == undefined) {
				return this.$message.warning('请选择完整时间')
			}
			if (this.formInline.orgId) {
				paramJson.orgId = this.formInline.orgId
			}
			this.loading = true
			let {
				data: { resultCode, resultData, total },
			} = await researchFeedbackList(paramJson)
			this.loading = false
			if (resultCode == 0) {
				this.tableList = resultData
				this.page.count = total
			} else {
				this.page.count = 0
				this.tableList = []
			}
		},
	},
}
</script>

<style>
.messageCenter_keyword_input {
	width: 260px;
}
.wi {
	width: 500px;
}
</style>

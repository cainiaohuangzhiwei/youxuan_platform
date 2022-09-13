<template>
	<div>
		<el-table
			v-loading="showLoading"
			:data="tableData"
			border
			style="width: 100%"
		>
			<el-table-column label="版本号" align="center" prop="ruleId">
			</el-table-column>
			<el-table-column prop="addUser" label="发布人" align="center">
			</el-table-column>
			<!-- <el-table-column prop="opertion" label="动作" align="center">
			</el-table-column> -->
			<el-table-column prop="addTime" label="发布时间" align="center">
				<template slot-scope="scope">
					{{ moment(scope.row.updateTime).format('YYYY.MM.DD HH:mm:ss') }}
				</template>
			</el-table-column>
			<el-table-column prop="action" label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="primary" @click="showDetail(scope.row)"
						>查看版本内容</el-button
					>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagBox">
			<custom-paging
				:total="total"
				:length="pageSize"
				:currentPage="pageNum"
				@tableChange="tableChange"
				@sizeChange="sizeChange"
				@currentChange="currentChange"
			></custom-paging>
		</div>

		<el-dialog :visible="detailDialog" @close="detailDialog = false">
			<online-pane
				:flowRuleId="flowRuleId"
				:returnContentList="returnContentList"
			></online-pane>
		</el-dialog>
	</div>
</template>

<script>
import moment from 'moment'
import customPaging from './customPaging'
import onlinePane from './onlinePane'
import { rcOptRecordList } from '@/api/scene'
export default {
	props: {
		abtStrategyId: {
			type: Number,
		},
		returnContentList: {
			type: Array,
			default: () => [],
		},
	},
	components: { customPaging, onlinePane },
	data() {
		return {
			moment: moment,
			params: this.$route.params,
			detail: {},
			detailDialog: false,
			pageSize: 10,
			pageNum: 1,
			total: 0,
			tableData: [],
			showLoading: false,
			flowRuleId: 0,
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.pageSize = 10
			this.pageNum = 1
			this._rcOptRecordList()
		},
		tableChange(val) {
			this.pageNum = val.pageNum
			this.pageSize = val.pageSize
			this._rcOptRecordList()
		},
		findSearchParams() {
			//搜索条件
			let paramJson = {
				pageNum: 0,
				pageSize: 1,
				abtStrategyId: this.abtStrategyId,
				sceneId: this.params.sceneId,
			}
			// 每页的加载数据长度
			paramJson.pageSize = this.pageSize
			// 当前页的条数开始
			paramJson.pageNum = this.pageNum
			return paramJson
		},
		_rcOptRecordList: async function () {
			this.showLoading = true
			let params = this.findSearchParams()
			let { data } = await rcOptRecordList(params)
			this.showLoading = false
			if (data.resultCode == 0) {
				this.tableData = data.resultData
				this.total = data.total
			} else {
				this.total = 0
				this.tableData = []
			}
		},
		showDetail(row) {
			this.detailDialog = true
			this.flowRuleId = row.ruleId
			// this.detail = this.item || row
		},
	},
}
</script>

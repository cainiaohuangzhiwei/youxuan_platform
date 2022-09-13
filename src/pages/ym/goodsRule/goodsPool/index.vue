<template>
	<div class="GoodsPool-page">
		<!-- 基于element的搜索表格组合 -->
		<basic-container>
			<template v-if="rcAuthAccount.accountType">
				<!-- 查询 -->
				<div class="box">
					<yx-form
						:inline="true"
						:data="searchDataTwo"
						:items="searchCfgTwo"
						@submit.native.prevent
					>
						<template #keyWord>
							<div style="display: inline-flex">
								<el-input
									style="margin-right: 10px"
									v-model="searchDataTwo.keyWord"
									placeholder="请输入商品池名称"
									@keyup.enter.native="search"
								></el-input>
								<el-button type="primary" @click="search">查询</el-button>
								<el-button type="primary" @click="ceateRule"
									>创建商品池</el-button
								>
							</div>
						</template>
						<template #querySelf>
							<div>
								<el-checkbox v-model="searchDataTwo.querySelf"
									>只看我创建</el-checkbox
								>
							</div>
						</template>
					</yx-form>
				</div>

				<!-- 表格 -->
				<yx-table
					v-loading="loading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
					<template slot="ruleDetailList" slot-scope="scope">
						<div
							v-html="
								Array.isArray(scope.row.ruleDetailList)
									? scope.row.ruleDetailList
											.map((x) => x.ruleContent)
											.join('<br/>')
									: ''
							"
						></div>
					</template>
				</yx-table>
			</template>
			<el-divider v-else>没有操作权限，请联系管理员！</el-divider>
		</basic-container>
		<edit-modal
			:goodsPoolId="goodsPoolId"
			:showDialog.sync="showDialog"
			:row="goodsPoolRow"
			@update="search"
		></edit-modal>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import editModal from './edit'
import { queryGoodsPoolRuleDetailList, deleteRuleById } from '@/api/goodsRule'
export default {
	name: 'goodsPool',
	components: {
		BasicContainer,
		YxTable,
		YxForm,
		editModal,
	},
	data() {
		return {
			rcAuthAccount: this.$store.state.user.rcAuthAccount, //流量规则平台授权账户信息
			searchDataTwo: {
				keyWord: '', // 商品货号
				querySelf: 0,
			},
			searchCfgTwo: [
				{
					title: '',
					type: 'custom',
					dataIndex: 'querySelf',
				},
				{
					title: '',
					type: 'custom',
					dataIndex: 'keyWord',
					placeholder: '请输入商品池名称',
				},
			],
			tableColumns: [
				{
					dataIndex: 'goodsPoolName',
					title: '商品池名称',
				},
				{
					width: 100,
					dataIndex: 'goodsPoolId',
					title: '商品池ID',
				},
				{
					dataIndex: 'ruleDetailList',
					type: 'custom',
					title: '规则',
				},
				{
					dataIndex: 'lastUpdateTime',
					type: 'date',
					title: '最后更新时间',
				},
				{
					dataIndex: 'createUser',
					title: '创建者',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					fixed: 'right',
					actions: [
						{
							title: '编辑',
							// auth: 'updateGroupGoodsByGoodsId',
							click: (row) => {
								this.showDialog = true
								this.goodsPoolId = row.goodsPoolId
								this.goodsPoolRow = row
							},
						},
						{
							title: '删除',
							// auth: 'batchDeleteOrganizationSpec',
							click: (row) => {
								this.$confirm(`确定删除该规则？`, '提示', {
									type: 'warning',
									callback: async (action) => {
										if (action === 'confirm') {
											let {
												data: { resultMsg, resultCode },
											} = await deleteRuleById({ goodsPoolId: row.goodsPoolId })
											const typeMsg = resultCode == 0 ? 'success' : 'error'
											if (resultCode == 0) {
												this.$message[typeMsg](resultMsg)
												this._getGoodsRuleList(true)
											}
										}
									},
								})
							},
						},
					],
				},
			],
			tableData: [],
			page: {
				count: 10,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getGoodsRuleList()
				},
			},
			loading: false,
			goodsPoolId: '',
			goodsPoolRow: {},
			showDialog: false,
		}
	},
	mounted() {
		this._getGoodsRuleList()
	},
	methods: {
		ceateRule() {
			this.showDialog = true
			this.goodsPoolId = ''
			this.goodsPoolRow = {}
		},
		search(e) {
			this.goodsPoolId = ''
			this.goodsPoolRow = {}
			this.showDialog = false
			if (e) {
				this.page.currentPage = 1
				this._getGoodsRuleList()
			}
		},
		_getGoodsRuleList(flag) {
			if (flag) {
				if (this.tableData.length === 1 && this.page.currentPage !== 1) {
					this.page.currentPage--
				}
			}
			this.loading = true
			queryGoodsPoolRuleDetailList({
				pageNum: this.page.currentPage,
				pageSize: this.page.length || 10,
				goodsPoolName: this.searchDataTwo.keyWord,
				querySelf: this.searchDataTwo.querySelf ? 1 : 0, // 只查自己
				goodsPoolContentType: 'GOODS',
				status: 2, // 有效
			})
				.then(({ data }) => {
					this.loading = false
					if (data.resultCode === 0) {
						this.page.count = data.total
						this.tableData = data.resultData
					}
				})
				.catch(() => {
					this.loading = false
				})
		},
	},
}
</script>
<style>
.box {
	text-align: right;
}
</style>

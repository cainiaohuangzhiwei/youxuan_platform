<template>
	<basic-container>
		<div v-if="rcAuthAccount.accountType" class="testList">
			<div class="sceneBox">
				<p style="color: red; margin-left: 50px; font-size: 28px">场景信息</p>
				<el-form ref="form" :model="form" label-width="120px">
					<!-- <el-form-item>
						<p slot="label" style="font-size: 24px; color: red">场景信息</p>
					</el-form-item> -->
					<div class="formBox">
						<div>
							<el-form-item label="场景名称">
								<el-input
									class="iuputBox"
									v-model="form.sceneName"
									maxlength="128"
									disabled
								></el-input>
							</el-form-item>
							<el-form-item label="分流父ID">
								<el-input
									class="iuputBox"
									v-model="form.testId"
									disabled
								></el-input>
								<br />
								<el-button
									style="margin-top: 10px"
									@click="
										$router.push({
											name: 'abTestExpri',
											params: { id: form.testId },
										})
									"
									>跳转AB测试详情</el-button
								>
							</el-form-item>
							<el-form-item label="页面名称">
								<el-input
									class="iuputBox"
									v-model="form.pageName"
									maxlength="128"
								></el-input>
							</el-form-item>
						</div>
						<div>
							<el-form-item label="最后更新人">
								<span class="iuputBox">{{ form.updateUserName }}</span>
							</el-form-item>
							<el-form-item label="最后更新时间">
								<span class="iuputBox">{{
									moment(form.updateTime).format('YYYY-MM-DD HH:mm:ss')
								}}</span>
							</el-form-item>
						</div>
					</div>
					<div class="buttonBox">
						<el-form-item>
							<el-button type="primary" size="medium" @click="handleModify"
								>保存</el-button
							>
						</el-form-item>
					</div>
				</el-form>
			</div>
			<div class="strategyBox" v-if="sceneList.length > 0">
				<p style="color: red; margin-left: 20px; font-size: 28px">场景策略</p>
				<div
					class="strategyItem"
					v-for="(item, index) in sceneList"
					:key="index"
				>
					<div class="strategH">
						<p class="strategyT">分流子ID:{{ item.abtStrategyId }}</p>
						<el-button
							type="danger"
							size="medium"
							@click="isShow(item, index)"
							v-if="!item.show"
							>展开</el-button
						>
					</div>
					<div v-if="item.show">
						<div class="strategyD">
							<p class="mr-20">
								创建时间：{{
									moment(item.addTime).format('YYYY-MM-DD HH:mm:ss')
								}}
							</p>
							<p class="mr-20">
								最后更新时间：{{
									moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
								}}
							</p>
							<p>最后更新人：{{ item.updateUserName }}</p>
						</div>
						<div>
							<el-tabs v-model="activeName[index]" type="card">
								<el-tab-pane label="在编辑版本" name="edit" lazy>
									<edit-pane
										:item="item"
										:index="index"
										:abtIdParent="form.testId"
										:shopSceneId="form.shopSceneId"
										@showChange="isShow(item, index)"
										:returnContentList="returnContentList"
										@refresh="handleRefresh(index)"
										@clear="(row) => handleClear(index, row)"
									></edit-pane>
								</el-tab-pane>
								<el-tab-pane label="线上生效版本" name="prod" lazy>
									<online-pane
										ref="onlinePane"
										:item="item"
										:online="true"
										:abtStrategyId="item.abtStrategyId"
										:returnContentList="returnContentList"
									></online-pane>
									<div style="text-align: right; margin-top: 15px">
										<el-button size="medium" @click="isShow(item, index, false)"
											>收起</el-button
										>
									</div>
								</el-tab-pane>
								<el-tab-pane label="历史版本" name="history" lazy>
									<history-pane
										ref="historyPane"
										:item="item"
										:abtStrategyId="item.abtStrategyId"
										:returnContentList="returnContentList"
									></history-pane>
									<div style="text-align: right; margin-top: 15px">
										<el-button size="medium" @click="isShow(item, index, false)"
											>收起</el-button
										>
									</div>
								</el-tab-pane>
							</el-tabs>
						</div>
					</div>
				</div>
			</div>
		</div>
		<el-divider v-else>没有操作权限，请联系管理员！</el-divider>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import moment from 'moment'
import editPane from './editPane'
import onlinePane from './onlinePane'
import historyPane from './historyPane'
import {
	rcBizSceneGetById,
	rcBizSceneUpdateById,
	listBySceneId,
	optionsGet,
} from '@/api/scene'

export default {
	components: {
		BasicContainer,
		editPane,
		onlinePane,
		historyPane,
	},
	name: 'FormTable',
	data() {
		return {
			rcAuthAccount: this.$store.state.user.rcAuthAccount,
			moment: moment,
			params: this.$route.params,

			rankingModelList: [],
			form: {
				sceneName: '',
				testId: '',
				pageName: '',
				updateTime: '',
				updateUserName: '',
			},
			sceneList: [],
			returnContentList: [],
			activeName: [],
		}
	},
	created() {},

	async mounted() {
		if (!this.rcAuthAccount.accountType) return
		await this._optionsGet()
		this._rcBizSceneGetById()
		this._listBySceneId()
	},

	methods: {
		_optionsGet: async function () {
			let { data } = await optionsGet()
			if (data.resultCode == 0) {
				this.rankingModelList = data.resultData.rankingModelList.map((item) => {
					item.name = item.label + '———' + item.value
					return item
				})
				this.searchModelList = data.resultData.searchModeList.map((item) => {
					item.name = item.label
					return item
				})
				this.returnContentList = data.resultData.returnContentList
			}
		},
		_listBySceneId: async function () {
			let params = {
				id: this.params.sceneId,
			}
			let { data } = await listBySceneId(params)
			if (data.resultCode == 0) {
				this.sceneList = data.resultData.map((item) => {
					item.show = false
					item.rankingModelList = JSON.parse(
						JSON.stringify(this.rankingModelList)
					)
					item.searchModelList = JSON.parse(
						JSON.stringify(this.searchModelList)
					)
					item.returnContentType = item.returnContentType || 'GOODS_GROUP' // 物品类型-默认会场
					item._returnContentType = item.returnContentType
					item.pageNum = 1
					item.pageSize = 10
					item.total = 0
					item.showLoading = false
					item.tableData = []
					item.bsPageNum = 1
					item.bsPgeSize = 10
					item.bsTotal = 0
					item.bsShowLoading = false
					item.bsTableData = []
					item.rcSortObj = {}
					item.ranking = ''
					item.rankingSearch = ''
					return item
				})

				this.activeName = new Array(this.sceneList.length).fill('')
			}
		},
		_rcBizSceneGetById: async function () {
			let params = {
				id: this.params.sceneId,
			}
			let { data } = await rcBizSceneGetById(params)
			if (data.resultCode == 0) {
				this.form.sceneName = data.resultData.sceneName || ''
				this.form.pageName = data.resultData.pageName || ''
				this.form.testId = data.resultData.testId
				this.form.updateUserName = data.resultData.updateUserName || ''
				this.form.updateTime = data.resultData.updateTime || ''
				this.form.shopSceneId = data.resultData.shopSceneId || ''
			}
		},
		handleModify: async function () {
			let params = {
				sceneId: this.params.sceneId,
				pageName: this.form.pageName,
				sceneName: this.form.sceneName,
				updateUser: this.$store.state.user.userInfo.userId,
			}
			let { data } = await rcBizSceneUpdateById(params)
			if (data.resultCode == 0) {
				this.$message.success('保存成功')
				this.form.sceneName = data.resultData.sceneName || ''
				this.form.pageName = data.resultData.pageName || ''
				this.form.testId = data.resultData.testId
				this.form.updateUserName = data.resultData.updateUserName || ''
				this.form.updateTime = data.resultData.updateTime || ''
			}
		},
		isShow(item, index, update = true) {
			if (!item.show && update) {
				this.activeName[index] = 'edit'
			}
			item.show = !item.show
		},
		//刷新列表+线上
		handleRefresh(index) {
			if (this.$refs.historyPane && this.$refs.historyPane[index]) {
				this.$refs.historyPane[index].init()
			}
			if (this.$refs.onlinePane && this.$refs.onlinePane[index]) {
				this.$refs.onlinePane[index]._newFlowRule()
			}
		},
		// 清空数据
		handleClear(index, row) {
			this.sceneList[index] = row
		},
	},
}
</script>

<style>
.testList .el-table .cell {
	white-space: pre-wrap;
}
.sceneBox {
	border: 1px solid #cccccc;
	padding: 6px 15px 15px 15px;
	box-sizing: border-box;
	margin-bottom: 30px;
	border-radius: 10px;
}
.formBox {
	display: flex;
}
.iuputBox {
	width: 400px;
	max-width: 400px;
}
.strategyBox {
	border: 1px solid #cccccc;
	padding: 6px 40px 15px 40px;
	box-sizing: border-box;
	margin-bottom: 30px;
	border-radius: 10px;
}
.strategyItem {
	border: 1px solid #cccccc;
	border-radius: 6px;
	padding: 10px 20px;
	margin-bottom: 20px;
}
.strategH {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.strategyT {
	font-size: 26px;
}
.strategyD {
	display: flex;
	align-items: center;
	font-size: 22px;
}
.mr-20 {
	margin-right: 20px;
}
.pagBox {
	text-align: center;
	margin-top: 20px;
}
.buttonBox {
	text-align: right;
	margin-right: 30px;
}
</style>

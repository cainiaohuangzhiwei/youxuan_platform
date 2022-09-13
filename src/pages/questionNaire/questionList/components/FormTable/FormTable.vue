<template>
	<basic-container>
		<div>
			<el-button
				v-auth="authMap.add"
				type="primary"
				style="margin-bottom: 20px"
				@click="handleAdd"
			>
				新增问卷
			</el-button>
			<el-button
				v-auth="authMap.query"
				type="primary"
				style="margin-bottom: 20px"
				@click="refresh"
			>
				刷新问卷
			</el-button>
			<el-button style="float: right" type="text" @click="jumpQua"
				>调研问卷使用说明</el-button
			>
		</div>
		<div v-loading="loading">
			<div v-for="(item, i) in tableData" :key="item.queQuestionnaireId">
				<el-card class="qua-card" style="margin-bottom: 20px">
					<div class="header">
						{{ i + 1 + 10 * (page.currentPage - 1) }}.
						<span class="header_title">{{ item.title }}</span>
					</div>
					<div class="middel">
						<template v-if="item.questionnaireStatus">
							<div>状态： 已投放</div>
							<div>编辑时间： {{ item.updateTime }}</div>
							<div>编辑者： {{ item.updateUser }}</div>
						</template>
						<template v-else>
							<div>状态： 未投放</div>
							<div>编辑时间： {{ item.updateTime }}</div>
							<div>编辑者： {{ item.updateUser }}</div>
						</template>
					</div>
					<div class="bottom">
						<div class="bottom-left">
							<div>ID： {{ item.shortId }}</div>
							<div>
								访问：<span>{{ item.browseUV || 0 }}</span>
							</div>
							<div>
								答卷： <span>{{ item.submitUV || 0 }}</span>
							</div>
						</div>
						<div>
							<template v-if="!item.questionnaireStatus">
								<el-button
									v-auth="authMap.publish"
									type="primary"
									@click="handlePublish(item)"
								>
									投放
								</el-button>
								<el-button
									v-auth="authMap.detail"
									@click="handleEdit(item.queQuestionnaireId)"
								>
									编辑
								</el-button>
							</template>

							<template v-if="item.questionnaireStatus">
								<el-button
									v-auth="authMap.publish"
									type="text"
									@click="handlePublish(item, false)"
								>
									投放信息
								</el-button>
								<span v-auth="authMap.close">
									开启投放
									<el-switch
										:value="item.questionnaireStatus !== 0"
										@change="(e) => handleStatus(e, item.queQuestionnaireId)"
										style="margin: 0 10px"
									></el-switch>
								</span>
								<el-button
									v-auth="authMap.detail"
									@click="() => handleEdit(item.queQuestionnaireId)"
								>
									编辑
								</el-button>
								<el-button
									v-auth="authMap.export"
									type="primary"
									@click="handleExport(item)"
									>数据导出</el-button
								>
							</template>

							<el-button v-auth="authMap.copy" @click="handleCopy(item)">
								复制
							</el-button>
							<el-button
								v-auth="authMap.delete"
								type="danger"
								@click="handleDel(item)"
								>删除</el-button
							>
						</div>
					</div>
				</el-card>
			</div>
			<el-card shadow="never" v-if="!tableData.length">
				<div class="empty">
					<i class="el-icon-receiving"></i>
					<div class="empty-text">暂无问卷</div>
				</div>
			</el-card>
			<el-pagination
				v-auth="authMap.query"
				background
				:current-page.sync="page.currentPage"
				@current-change="handlePage"
				layout="prev, pager, next"
				:total="page.total"
			></el-pagination>
		</div>

		<publish-dialog
			v-auth="authMap.publish"
			ref="publishDialog"
			:visible.sync="visible"
			:publishId.sync="publishId"
			:shortId.sync="shortId"
			@open="handleOpen"
		></publish-dialog>

		<el-dialog
			title="复制文件"
			:visible="copyVisible"
			:close-on-click-modal="false"
			:before-close="resetForm"
		>
			<div class="copy-content">
				<div class="copy-content_title">问卷标题：</div>
				<div class="copy-content_input">
					<el-input v-model="copyDataTitle"></el-input>
					<el-button type="text" @click="handleCopyTitle"
						>使用原问卷名称</el-button
					>
				</div>
			</div>

			<div slot="footer">
				<el-button
					type="primary"
					:loading="copyLoading"
					@click="handleCopySubmit"
					>确定</el-button
				>
			</div>
		</el-dialog>
	</basic-container>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import {
	questionNaireList,
	questionNaireDelete,
	questionNaireClose,
	questionNaireExport,
	questionNaireCopy,
} from '@/api/questionNaire'
import { downloadFile } from '@/utils/helper/common'
import PublishDialog from '../PublishDialog.vue'
import moment from 'moment'
export default {
	components: {
		BasicContainer,
		PublishDialog,
	},
	name: 'FormTable',
	data() {
		return {
			tableData: [],
			visible: false,
			copyVisible: false,
			copyLoading: false,
			copyData: {},
			copyDataTitle: '',
			loading: false,
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
			},
			userId: 0,
			publishId: '',
			shortId: '',
			authMap: {
				add: '/questionnaire/que-questionnaire/v2/add',
				query: '/questionnaire/que-questionnaire/v2/pageQuery',
				detail:
					'/questionnaire/que-questionnaire/v2/getQuestionnaireDetailFors',
				delete: '/questionnaire/que-questionnaire/v2/deleteById',
				update: '/questionnaire/que-questionnaire/v2/updateQueQuestionnaire',
				publish: '/questionnaire/que-questionnaire/v2/launchQuestionnaire',
				export: '/questionnaire/que-questionnaire/v2/exportDataById',
				close: '/questionnaire/que-questionnaire/v2/closeQuestionnaire',
				copy: '/questionnaire/que-questionnaire/v2/copy',
			},
		}
	},
	created() {
		this.userId = this.$store.state.user.userInfo.userId
		this.fetchQuestionNaireList()
	},
	watch: {
		'$route.query': function () {
			if (this.$route.query && this.$route.query.refresh === '1') {
				this.$router.push({
					path: `/ym/myOuestionNaire`,
				})
				this.refresh()
			}
		},
	},
	methods: {
		jumpQua() {
			window.open(
				'https://weeget.feishu.cn/docs/doccndWr8vGcSa8dEB3ssoXRnEc',
				'_blank'
			)
		},
		fetchQuestionNaireList() {
			this.loading = true
			questionNaireList({
				userId: this.userId,
				currentPage: this.page.currentPage,
				length: this.page.length,
			})
				.then(({ data }) => {
					if (data && data.resultCode == 0) {
						const resultData = data.resultData
						this.tableData = resultData.records.map((x) => {
							x.updateTime = x.updateTime
								? moment(x.updateTime).format('YYYY-MM-DD HH:mm:ss')
								: ''
							x.releaseTime = x.releaseTime
								? moment(x.releaseTime).format('YYYY-MM-DD HH:mm:ss')
								: ''
							return x
						})
						this.page.total = resultData.total
					}
				})
				.finally(() => {
					this.loading = false
				})
		},
		handlePage(e) {
			this.page.currentPage = e
			this.fetchQuestionNaireList()
		},
		refresh() {
			this.page.currentPage = 1
			this.fetchQuestionNaireList()
		},
		handleAdd() {
			this.$router.push({
				path: `/ym/questionEdit/0`,
			})
		},
		handleEdit(id) {
			this.$router.push({
				path: `/ym/questionEdit/${id}`,
			})
		},
		handleOpen() {
			this.refresh()
		},
		// 投放状态
		handleStatus(e, queQuestionnaireId) {
			const that = this
			if (!e) {
				this.$confirm('你确定要关闭该问卷的投放吗？', '提示', {
					type: 'warning',
					callback(action) {
						if (action === 'confirm') {
							that.loading = true
							questionNaireClose({
								queQuestionnaireId,
								userId: that.$store.state.user.userInfo.userId || '',
							}).then((res) => {
								if (res.data) {
									that.$message.success('投放关闭成功')
									that.refresh()
								}
							})
						}
					},
				})
			}
		},
		handlePublish(item, showInfo = true) {
			this.publishId = item.queQuestionnaireId
			this.shortId = item.shortId
			this.visible = true
			this.$nextTick(() => {
				if (!showInfo) {
					this.$refs.publishDialog.detail({
						launchProduct: item.launchProduct,
						startTime: item.startTime,
						endTime: item.endTime,
					})
				} else {
					this.$refs.publishDialog.detail({
						launchProduct: 1,
						startTime: '',
						endTime: '',
					})
				}
			})
		},
		handleExport(item) {
			this.loading = true
			questionNaireExport({
				userId: this.userId,
				queQuestionnaireId: item.queQuestionnaireId,
			})
				.then(({ data }) => {
					if (data) {
						downloadFile(data, '问卷-' + item.title + '.xlsx')
					}
				})
				.finally(() => {
					this.loading = false
				})
		},
		handleDel(item) {
			const that = this
			this.$confirm(
				'你确定要删除这条问卷吗？删除后词条问卷将不再展示。',
				'提示',
				{
					type: 'warning',
					callback(action) {
						if (action === 'confirm') {
							that.loading = true
							questionNaireDelete({
								userId: that.$store.state.user.userInfo.userId || '',
								queQuestionnaireId: item.queQuestionnaireId,
							}).then(({ data }) => {
								if (data.resultCode == 0) {
									that.$message.success('删除成功')
									that.refresh()
								}
							})
						}
					},
				}
			)
		},
		handleCopy(item) {
			this.copyVisible = true
			this.copyData.id = item.queQuestionnaireId
			this.copyData.oTitle = item.title
		},
		handleCopyTitle() {
			this.copyDataTitle = this.copyData.oTitle
		},
		resetForm() {
			this.copyVisible = false
			this.copyData = {}
			this.copyDataTitle = ''
		},
		handleCopySubmit() {
			if (this.copyLoading) return
			if (this.copyDataTitle) {
				this.copyLoading = true
				questionNaireCopy({
					id: this.copyData.id,
					title: this.copyDataTitle,
				})
					.then((res) => {
						if (res) {
							this.resetForm()
							this.$message.success('复制成功')
							this.refresh()
						}
					})
					.finally(() => {
						this.copyLoading = false
					})
			}
		},
	},
}
</script>
<style lang="scss" scoped>
.qua-card {
	.header {
		font-size: 18px;
		padding-bottom: 10px;
	}
	.header_title {
		padding-left: 20px;
	}
	.middel {
		font-size: 15px;
		display: flex;
		color: #a1a1a1;
		margin-left: 30px;
		& > div {
			margin-right: 20px;
		}
	}
	.bottom {
		border-top: 1px solid #eee;
		padding-top: 10px;
		margin-top: 10px;
		display: flex;
		justify-content: space-between;
		.bottom-left {
			color: #8c8c8c;
			display: inline-flex;
			& > div {
				margin-right: 20px;
				& > span {
					color: #f38c2c;
				}
			}
		}
	}
}

.empty {
	font-size: 60px;
	color: #bebebe;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	.empty-text {
		margin-top: 10px;
		font-size: 16px;
	}
}

.copy-content {
	display: flex;
	.copy-content_title {
		line-height: 32px;
	}
	.copy-content_input {
		flex-grow: 1;
		line-height: 32px;
	}
}
</style>

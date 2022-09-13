<template>
	<div class="xcxMaterialList">
		<basicContainer>
			<el-button
				type="primary"
				style="margin-bottom: 20px"
				@click="updateNewComerInfo()"
				>新增活动</el-button
			>
			<yx-table
				v-loading="loading"
				:columns="newComerColumn"
				:pagination="newComerPage"
				:data="newComerData"
			>
				<template slot="activityStatus" slot-scope="scope">
					<!-- // 活动状态 0:未开始 1:进行中 2:已结束 -->
					<div>
						<el-tag
							v-if="scope.row.activityStatus == 0"
							type="info"
							size="small"
						>
							未开始
						</el-tag>
						<el-tag v-else-if="scope.row.activityStatus == 1" size="small">
							进行中
						</el-tag>
						<el-tag v-else type="info" size="small">已结束</el-tag>
					</div>
				</template>
			</yx-table>

			<EditDialog
				ref="form"
				:title="dialogTitleNewComer"
				:visible.sync="dialogVisibleNewComer"
				:row="dialogformDataNewComer"
				:dialogState="dialogState"
				@initTable="_getNewComerList"
			/>

			<el-dialog
				title="导出数据"
				center
				width="500px"
				:visible.sync="showExportDialog"
				:modal-append-to-body="false"
				:close-on-click-modal="false"
				:close-on-press-escape="false"
			>
				<el-date-picker
					v-model="exportTimeList"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
				>
				</el-date-picker>
				<div
					v-if="showExportBtns && showExportBtns.length"
					style="margin-top: 10px"
				>
					<template v-for="(item, index) in showExportBtns">
						<el-button
							@click="item.click"
							:key="index"
							:type="item.type ? item.type : 'primary'"
						>
							{{ item.title }}
						</el-button>
					</template>
				</div>
			</el-dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import { getBigImg } from '@/utils/imageTool'
import {
	exportCompletedList,
	shopkeeperActivityList,
	shopkeeperActivityDelete,
} from '@/api/newComerArea'
import EditDialog from './EditDialog'
import moment from 'moment'
import { downloadFile } from '@/utils/helper/common'

export default {
	components: {
		BasicContainer,
		YxTable,
		EditDialog,
	},
	props: [],
	data() {
		return {
			newComerData: [],

			newComerColumn: [
				{
					type: 'string',
					dataIndex: 'id',
					title: '序号',
				},
				{
					type: 'string',
					dataIndex: 'activityName',
					title: '活动名称',
				},
				{
					type: 'date',
					dataIndex: 'showStartTime',
					title: '开始时间',
				},
				{
					type: 'date',
					dataIndex: 'showEndTime',
					title: '结束时间',
				},
				{
					type: 'custom',
					dataIndex: 'activityStatus',
					title: '状态',
				},
				{
					type: 'string',
					dataIndex: 'userId',
					title: '最后操作人ID',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '导出名单',
							click: async (row) => {
								this.showExportDialog = true
								this.showExport = row
								const _now = moment()
								this.exportTimeList = [_now.startOf('days'), _now.endOf('days')]
							},
						},
						{
							title: '编辑',
							click: async (row) => {
								this.updateNewComerInfo(row)
							},
							customRender: (action, row) => {
								action.hide = row.activityStatus !== 0
								return action
							},
						},
						{
							title: '删除',
							click: (row) => {
								this.delNewComerInfo(row)
							},
						},
					],
				},
			],
			newComerPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getNewComerList()
				},
			},
			dialogVisibleNewComer: false,
			dialogTitleNewComer: '',
			dialogformDataNewComer: {
				endTime: '',
				startTime: '',
				imageList: [],
				activityName: '',
			},
			dialogWidth: '800px',
			getBigImg,
			loading: false,
			editLoading: false,

			showExportDialog: false,
			showExport: null,
			exportTimeList: [],
			showExportBtns: [
				{
					title: '确 定 导 出',
					type: 'primary',
					click: async () => {
						if (this.exportTimeList && this.exportTimeList.length) {
							let startTime = new Date(
								moment(this.exportTimeList[0]).startOf('days')
							).getTime()
							let endTime = new Date(
								moment(this.exportTimeList[1]).endOf('days')
							).getTime()

							if (
								startTime <
									new Date(
										moment(this.showExport.showStartTime).startOf('days')
									) ||
								endTime >
									new Date(moment(this.showExport.showEndTime).endOf('days'))
							) {
								return this.$message.error('所选时间不超过开始时间和结束时间')
							}

							if (startTime < this.showExport.showStartTime) {
								startTime = this.showExport.showStartTime
							}
							if (endTime > this.showExport.showEndTime) {
								endTime = this.showExport.showEndTime
							}

							const { data } = await exportCompletedList({
								activityId: this.showExport.id,
								startTime,
								endTime,
							})
							if (data) {
								downloadFile(data, '领取红包的名单.xlsx')
							}
							this.showExportDialog = false
							this.showExport = null
							this.exportTimeList = []
						} else {
							this.$message.error('请选择导出的日期')
						}
					},
				},
			],
		}
	},

	created() {
		this._getNewComerList()
	},

	methods: {
		findSearchParams(
			key = 'newComer',
			flag,
			refresh = false,
			isDelete = false
		) {
			if (refresh) {
				const len = this[`${key}Data`].length
				const currentPage = this[`${key}Page`].currentPage
				if (len === 1) {
					this[`${key}Page`].currentPage = Math.max(
						currentPage - (isDelete ? 1 : 0),
						1
					)
				}
			} else {
				if (flag) {
					this[`${key}Page`].currentPage = 1
				}
			}

			const paramJson = {
				pageSize: this[`${key}Page`].length,
				pageNum: this[`${key}Page`].currentPage,
			}
			return paramJson
		},
		_getNewComerList(flag, refresh) {
			this.loading = true
			let paramJson = this.findSearchParams('newComer', flag, refresh)
			shopkeeperActivityList(paramJson)
				.then(({ data: { resultCode, resultData } }) => {
					if (resultCode == 0 && resultData) {
						this.newComerPage.count = resultData.total
						this.newComerData = resultData.records
					} else {
						this.newComerData = []
						this.newComerPage.count = 0
					}
				})
				.finally(() => {
					this.loading = false
				})
		},
		updateNewComerInfo(info) {
			this.dialogVisibleNewComer = true
			if (info) {
				this.dialogTitleNewComer = '新人专区-入口编辑'
				this.dialogformDataNewComer = Object.assign(
					{},
					this.$options.data().dialogformDataNewComer,
					JSON.parse(JSON.stringify(info)),
					{
						operationTime: undefined,
					}
				)
			} else {
				this.dialogTitleNewComer = '新人专区-入口新增'
				this.dialogformDataNewComer = Object.assign(
					{},
					this.$options.data().dialogformDataNewComer
				)
			}
			this.dialogVisible = true
		},
		delNewComerInfo({ id }) {
			const that = this
			this.$confirm(
				'您确认要删除此活动么？删除后此活动不会在小程序展示。',
				'提示',
				{
					type: 'warning',
					callback(action) {
						if (action === 'confirm') {
							that.loading = true
							shopkeeperActivityDelete({
								id,
							})
								.then(({ data: { resultCode } }) => {
									if (resultCode == 0) {
										that.$message.success('删除成功')
										that._getNewComerList(true, true, true)
									} else {
										that.loading = false
									}
								})
								.catch(() => {
									that.loading = false
								})
						}
					},
				}
			)
		},
	},
}
</script>
<style scoped>
.c_image {
	width: 100px;
}
.input-with-select {
	width: 100%;
}
</style>

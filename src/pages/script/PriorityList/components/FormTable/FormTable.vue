<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			>
				<el-input
					type="textarea"
					slot="keyword"
					:rows="5"
					placeholder="时间和品牌名称直接用空格隔开，品牌与品牌之间用英文逗号隔开（要带时间搜索）"
					v-model="formInline.keyword"
				>
				</el-input>
			</yx-form>
			<div>
				<el-button size="small" type="primary" @click="batchPreCrawl"
					>批量预先爬取</el-button
				>
				<el-button
					size="small"
					class="ml20"
					@click="cancelPreCrawlInBulk"
					type="primary"
					>批量取消预先爬取</el-button
				>
				<el-button
					size="small"
					class="ml20"
					@click="mainPushPreCrawl"
					type="primary"
					>主推预先爬取</el-button
				>
			</div>
			<div class="con_title">
				<el-row>
					<yx-table
						:select="true"
						:columns="tableColumns"
						:selectionChange="selectionChange"
						:pagination="page"
						:data="list"
					>
						<template slot="brandImg" slot-scope="scope">
							<el-image
								class="img100"
								:src="scope.row.imgUrl"
								fit="contain"
							></el-image>
						</template>
						<template slot="operating" slot-scope="scope">
							<el-button
								v-if="scope.row.isReady == 1"
								type="text"
								size="small"
								@click="priorityCancel(scope.row)"
								>取消优先爬取</el-button
							>
							<el-button
								v-if="scope.row.isReady == 2"
								type="text"
								size="small"
								@click="setDialogMarkFirstCrawl(scope.row)"
								>标记优先爬取</el-button
							>
						</template></yx-table
					>
				</el-row>
			</div>
		</div>
		<yx-dialog
			title="提示"
			:bottomBtn="bottomBtn"
			:visible.sync="dialogMarkFirstCrawl"
		>
			<yx-form
				labelWidth="140px"
				:data="dialogData"
				:items.sync="dialogCfg"
				:formAction="dialogAction"
			>
			</yx-form>
		</yx-dialog>
	</basic-container>
</template>

<script>
import {
	getBrandReadyListByCondition,
	updateBrandReadyListByCondition,
} from '@/api/yhtPlusCmsMasterControl'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxDialog from '@/components/Dialog/index.vue'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import { getConstantValueByKey } from '@/utils/helper/common'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		YxDialog,
	},
	data() {
		return {
			dialogData: {
				sessions: '',
			},
			dialogCfg: [
				{
					type: 'radioMap',
					dataIndex: 'sessions',
					title: '请确定标记预先爬取场次',
					options: {
						'8点': '8点',
						'12点': '12点',
						'15点': '15点',
						'17点': '17点',
						'20点': '20点',
					},
				},
			],
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.priorityConfirm(true)
					},
				},
			],
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: this.onSubmit,
				},
			],
			formInline: {
				keyword: '',
				sourceType: '',
				timeSequence: '',
				startTime: moment(moment().startOf('month')).valueOf(), // 下单开始时间
				endTime: moment(moment().endOf('month')).valueOf(), // 下单结束时间
			},
			// 详情数据
			list: [],
			dialogMarkFirstCrawl: false,
			// 选中的表格条目
			selectList: [],
			formCfg: [
				{
					title: '品牌搜索',
					type: 'textarea',
					dataIndex: 'keyword',
					placeholder:
						'时间和品牌名称直接用空格隔开，品牌与品牌之间用英文逗号隔开（要带时间搜索）',
				},
				{
					title: '渠道',
					type: 'select',
					label: 'value',
					dataIndex: 'sourceType',
					options: this.$store.state.app.constant.CARETSORCE_TYPE,
				},
				{
					title: '爬取场次',
					type: 'select',
					dataIndex: 'timeSequence',
					label: 'value',
					options: this.$store.state.app.constant.TIMESEQUENCE_TYPE,
				},
				{
					title: '开播时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
				},
			],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '品牌名称',
				},
				{
					type: 'custom',
					dataIndex: 'brandImg',
					title: '品牌图片',
				},
				{
					type: 'string',
					dataIndex: 'productCount',
					title: '商品数量',
				},
				{
					type: 'string',
					dataIndex: 'sourceType',
					title: '渠道',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.CARETSORCE_TYPE,
							row.sourceType,
							'-',
							'sourceType'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'startTime',
					title: '开播时间',
					customRender: (row) => {
						return row.startTime
							? moment(row.startTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'isReady',
					title: '预爬标记',
					customRender: (row, column) => {
						return this.preClimbingMark(row, column)
					},
				},
				{
					type: 'custom',
					dataIndex: 'operating',
					title: '操作',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.callBrandReadyListByCondition()
				},
			},
		}
	},

	created: function () {
		this.initPage()
	},

	methods: {
		addTimeChange(newVlaue) {
			if (newVlaue) {
				this.formInline.addTimeRange = newVlaue
			}
		},
		onSubmit() {
			this.callBrandReadyListByCondition(true)
		},
		findSearchParams(flag) {
			let paramJson = this.formInline
			paramJson.keyword = paramJson.keyword.replace(/，/gi, ',')
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		async initPage() {
			await this.callBrandReadyListByCondition()
		},
		async callBrandReadyListByCondition(flag) {
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getBrandReadyListByCondition(paramJson)
			if (resultCode === 0) {
				this.list = resultData.brandReadyList
				this.page.count = resultData.count
			}
		},
		selectionChange(list) {
			this.selectList = list
		},
		// 主推预先爬取
		mainPushPreCrawl() {
			let self = this
			if (!this.selectList.length) {
				this.$message({
					message: '请选择品牌',
					type: 'warning',
				})
				return
			}
			let brands = []
			let isReady = false
			this.selectList.map((item) => {
				if (item.isReady == 2) {
					isReady = true
				}
				brands.push(item.brandId)
			})
			if (isReady) {
				this.$message({
					message: '请选择已标记品牌',
					type: 'warning',
				})
				return
			}
			let title = `你已选择${brands.length}个品牌确定主推预先爬取？`
			this.$confirm(title, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				callback: async (action) => {
					if (action == 'confirm') {
						let {
							data: { resultMsg },
						} = await updateBrandReadyListByCondition({
							isMainPush: 1,
							brands: brands,
						})
						self.$message.success({
							message: resultMsg,
							duration: 1000,
							onClose() {
								self.callBrandReadyListByCondition(true)
							},
						})
					}
				},
			})
		},
		// 批量取消预先爬取
		cancelPreCrawlInBulk() {
			if (!this.selectList.length) {
				this.$message({
					message: '请选择品牌',
					type: 'warning',
				})
				return
			}
			let isReady = false
			let brands = []
			this.selectList.map((item) => {
				if (item.isReady == 2) {
					isReady = true
				}
				brands.push(item.brandId)
			})
			if (isReady) {
				this.$message({
					message: '请选择已标记品牌',
					type: 'warning',
				})
				return
			}
			this.batchCrawling(2, brands)
		},
		//预爬标记状态 显示
		preClimbingMark(row) {
			let resultStr = ''
			if (row.isReady == 1) {
				resultStr = row.timeSequence + '点'
				if (row.isMainPush) {
					resultStr += '（主推）'
				}
				return resultStr
			} else if (row.isReady == 2) {
				return '否'
			} else {
				return '-'
			}
		},
		// 批量预先爬取
		batchPreCrawl() {
			if (!this.selectList.length) {
				this.$message({
					message: '请选择品牌',
					type: 'warning',
				})
				return
			}
			this.dialogMarkFirstCrawl = true
			this.preCrawlType = 2
		},
		async batchCrawling(isReady, brands, sessions) {
			let self = this
			if (isReady == 2) {
				let title =
					brands.length == 1
						? '确定取消预先爬取？'
						: '是否取消预先爬取  ' + brands.length + '  个品牌'
				this.$confirm(title, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					callback: async (action) => {
						if (action == 'confirm') {
							let {
								data: { resultMsg },
							} = await updateBrandReadyListByCondition({
								isReady: isReady,
								brands: brands,
							})
							self.$message.success({
								message: resultMsg,
								duration: 1000,
								onClose() {
									self.callBrandReadyListByCondition(true)
								},
							})
						}
					},
				})
			} else {
				let {
					data: { resultMsg },
				} = await updateBrandReadyListByCondition({
					isReady: isReady,
					brands: brands,
					timeSequence: sessions.substr(0, sessions.length - 1),
				})
				self.dialogMarkFirstCrawl = false
				self.dialogData.sessions = ''
				self.$message.success({
					message: resultMsg,
					duration: 1000,
					onClose() {
						self.callBrandReadyListByCondition(true)
					},
				})
			}
		},
		// 取消优先爬取
		priorityCancel(row) {
			this.batchCrawling(2, [row.brandId])
		},
		// 标记优先爬取
		setDialogMarkFirstCrawl(row) {
			this.priorityConfirmItem = row
			this.dialogMarkFirstCrawl = true
			this.preCrawlType = 1
		},
		priorityConfirm(flag) {
			if (!flag) {
				this.dialogMarkFirstCrawl = false
				this.dialogData.sessions = ''
				return
			}
			if (!this.dialogData.sessions) {
				this.$message({
					message: '请选择场次',
					type: 'warning',
				})
				return
			}
			if (this.preCrawlType == 1) {
				this.batchCrawling(
					1,
					[this.priorityConfirmItem.brandId],
					this.dialogData.sessions
				)
			} else {
				let brands = []
				let isReady = false
				this.selectList.map((item) => {
					if (item.isReady == 1) {
						isReady = true
					}
					brands.push(item.brandId)
				})
				if (isReady) {
					this.$message({
						message: '请选择未标记品牌',
						type: 'warning',
					})
					return
				}
				this.batchCrawling(1, brands, this.dialogData.sessions)
			}
		},
	},
}
</script>

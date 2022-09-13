<template>
	<yx-dialog
		:title="isCheckView ? '查看档期' : '选择档期'"
		:bottomBtn="bottomBtn"
		:visible.sync="localVisible"
		:before-close="resetForm"
	>
		<el-form ref="form" :inline="true" :model="form" label-width="80px">
			<el-form-item label="档期类型">
				<el-select v-model="form.goodsType" placeholder="请选择档期类型">
					<el-option label="品牌营销" :value="1"></el-option>
					<el-option label="专项营销" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="档期名称">
				<el-autocomplete
					v-model="form.value"
					:fetch-suggestions="querySearchAsync"
					@select="handleSelect"
					@change="handleChange"
				></el-autocomplete>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleQuery(true)">查询</el-button>
			</el-form-item>
		</el-form>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane :disabled="this.isCheckView" label="选择档期" :name="1"
				><el-row>
					<el-button type="text" size="medium" @click="handleAdd"
						>批量添加</el-button
					>
					<!-- <el-button type="text" size="medium" @click="handleRemoval"
						>批量移除</el-button
					> -->
				</el-row>
				<el-row class="table_box">
					<yx-table
						:select="!this.isCheckView"
						v-loading="showLoading"
						:columns="tialogColumns"
						:pagination="tialogPage"
						:data="tialogData"
						:selectionChange="selectionChange"
					>
						<template slot="saleState" slot-scope="scope">
							<el-tag effect="dark" :type="saleState(scope.row).type">{{
								saleState(scope.row).label
							}}</el-tag>
						</template>
					</yx-table>
				</el-row></el-tab-pane
			>
			<el-tab-pane
				:disabled="this.isCheckView"
				:label="'已选档期' + selectGroupList.length"
				:name="2"
				><el-row>
					<el-button
						v-if="!this.isCheckView"
						type="text"
						size="medium"
						@click="handleRemovalSd"
						>批量移除</el-button
					>
				</el-row>
				<el-row class="table_box">
					<yx-table
						:select="!this.isCheckView"
						v-loading="selectedLoading"
						:columns="selectedtialogColumns"
						:data="selectedtialogData"
						:selectionChange="selectedselectionChange"
					>
						<template slot="saleState" slot-scope="scope">
							<el-tag effect="dark" :type="saleStateSd(scope.row).type">{{
								saleStateSd(scope.row).label
							}}</el-tag>
						</template>
					</yx-table>
				</el-row></el-tab-pane
			>
		</el-tabs>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxTable from '@wg-vue-materials/yx-table'
import { queryGoodsGroupInfoFilterAKCBatch } from '@/api/userRewardSystem'
import moment from 'moment'
export default {
	components: {
		YxDialog,
		YxTable,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			default: false,
		},
		selectScheduleRow: {
			type: Array,
			default: () => [],
		},
		isCheckView: {
			type: Boolean,
			default: false,
		},
		// selectScheduleRow: {
		// 	type: Object,
		// 	default: () => ({}),
		// },
	},
	data() {
		return {
			activeName: 1,
			selectionData: [],
			selectionDataSd: [],
			currentTime: null,
			selectedcurrentTime: null,
			selectGroupList: [],
			formData187: {
				gcategoryList: [],
				goodsGroupStateList: [1, 2],
				sortField: 0,
				channelType: 0,
				startTime: '',
				endTime: '',
				isShopKeeperGrouping: '',
			},
			showLoading: false,
			selectedLoading: false,
			form: {
				goodsType: 1,
				value: '',
				goodsGroupId: '',
			},
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveBrand()
					},
				},
			],
			cacheBtns: this.bottomBtn,
			selectedtialogColumns: [
				{
					type: 'string',
					dataIndex: 'goodsGroupId',
					title: '档期ID',
					customRender: (row) => {
						if (row.goodsGroupId) {
							return row.goodsGroupId
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'groupName',
					title: '档期名称',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场名称',
				},
				{
					type: 'string',
					dataIndex: 'saleStartTime',
					title: '售卖时间',
					width: '146',
					customRender: (row) => {
						return (
							moment(row.saleStartTime).format('YYYY-MM-DD HH:mm:ss') +
							'-' +
							moment(row.saleEndTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					type: 'custom',
					dataIndex: 'saleState',
					title: '售卖状态',
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '移除',
							click: (row) => {
								this.editUserListSd(row)
							},
							customRender: (action) => {
								action.hide = this.isCheckView
								return action
							},
						},
					],
				},
			],
			// selectedtialogPage: {
			// 	count: 0,
			// 	length: 10,
			// 	currentPage: 1,
			// 	tableChange: () => {
			// 		this.handleSelected()
			// 	},
			// },
			selectedtialogData: [],
			tialogColumns: [
				{
					type: 'string',
					dataIndex: 'goodsGroupId',
					title: '档期ID',
					customRender: (row) => {
						if (row.goodsGroupId) {
							return row.goodsGroupId
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'groupName',
					title: '档期名称',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场名称',
				},
				{
					type: 'string',
					dataIndex: 'saleStartTime',
					title: '售卖时间',
					width: '146',
					customRender: (row) => {
						return (
							moment(row.saleStartTime).format('YYYY-MM-DD HH:mm:ss') +
							'-' +
							moment(row.saleEndTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					type: 'custom',
					dataIndex: 'saleState',
					title: '售卖状态',
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.editUserList(row)
							},
							customRender: (action, row) => {
								action.title = this.findIndex(row) ? '添加' : '移除'
								action.hide = this.isCheckView
								return action
							},
						},
					],
				},
			],
			tialogPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.handleQuery()
				},
			},
			tialogData: [],
		}
	},
	computed: {
		localVisible: {
			get() {
				return this.visible
			},
			set(val) {
				this.$emit('update:visible', val)
				if (!val) {
					this.$emit('close')
				}
			},
		},
	},

	watch: {
		localVisible(val) {
			this.activeName = this.isCheckView ? 2 : 1
			this.form.goodsType = 1
			this.form.value = ''
			this.form.goodsGroupId = ''
			this.tialogPage.count = 0
			this.tialogData = []
			this.selectedtialogData = []
			if (val) {
				this.selectGroupList = JSON.parse(
					JSON.stringify(this.selectScheduleRow)
				)
				this.handleQuery(true)
				if (this.selectGroupList.length) {
					this.handleSelected()
				}
			}
		},
		isCheckView(val) {
			if (val) {
				this.bottomBtn = []
			} else {
				this.bottomBtn = this.cacheBtns
			}
		},
	},
	methods: {
		handleClick(tab, event) {
			console.log(tab, event)
		},
		selectedselectionChange(row) {
			this.selectionDataSd = row
		},
		selectionChange(row) {
			this.selectionData = row
		},
		handleAdd() {
			let ids = this.selectGroupList.map((item) => {
				return item.goodsGroupId
			})
			if (this.selectionData && this.selectionData.length) {
				this.selectionData.forEach((row) => {
					if (ids.indexOf(row.goodsGroupId) == -1) {
						this.selectGroupList.push(row)
					}
				})
			}
			if (this.selectGroupList && this.selectGroupList.length) {
				this.handleSelected()
			}
		},
		handleRemovalSd() {
			if (this.selectionDataSd && this.selectionDataSd.length) {
				for (let i = 0; i < this.selectionDataSd.length; i++) {
					for (let j = 0; j < this.selectGroupList.length; j++) {
						if (
							String(this.selectionDataSd[i].goodsGroupId) ===
							String(this.selectGroupList[j].goodsGroupId)
						) {
							const indexs = this.selectGroupList.findIndex(
								(item) =>
									String(item.goodsGroupId) ===
									String(this.selectGroupList[j].goodsGroupId)
							)
							this.selectGroupList.splice(indexs, 1)
						}
					}
				}
				// this.handleSelected()
				this.selectedtialogData = this.selectedtialogData.filter((item) => {
					return !this.selectionDataSd.some((item2) => {
						return String(item2.goodsGroupId) === String(item.goodsGroupId)
					})
				})
			}
		},
		handleRemoval() {
			if (this.selectionData && this.selectionData.length) {
				for (let i = 0; i < this.selectionData.length; i++) {
					for (let j = 0; j < this.selectGroupList.length; j++) {
						if (
							this.selectionData[i].goodsGroupId ===
							this.selectGroupList[j].goodsGroupId
						) {
							let indexs = this.selectGroupList.indexOf(this.selectGroupList[j])
							this.selectGroupList.splice(indexs, 1)
						}
					}
				}
			}
			if (this.selectGroupList && this.selectGroupList.length) {
				this.handleSelected()
			} else {
				this.selectedtialogData = []
			}
		},
		findIndex(row) {
			// 判断是否已经添加用户
			let ids = this.selectGroupList.map((item) => {
				return item.goodsGroupId
			})
			return ids.indexOf(row.goodsGroupId) == -1
		},
		editUserListSd(row) {
			// 添加/移除用户
			let ids = this.selectGroupList.map((item) => {
				return item.goodsGroupId
			})
			this.selectGroupList.splice(ids.indexOf(row.goodsGroupId), 1)
			if (this.selectGroupList && this.selectGroupList.length) {
				this.handleSelected()
			} else {
				this.selectedtialogData = []
			}
		},
		editUserList(row) {
			// 添加/移除用户
			let ids = this.selectGroupList.map((item) => {
				return item.goodsGroupId
			})
			if (ids.indexOf(row.goodsGroupId) == -1) {
				this.selectGroupList.push(row)
			} else {
				this.selectGroupList.splice(ids.indexOf(row.goodsGroupId), 1)
			}
			if (this.selectGroupList && this.selectGroupList.length) {
				this.handleSelected()
			} else {
				this.selectedtialogData = []
			}
		},
		async handleSelected() {
			this.selectedLoading = true
			let paramJson = this.findUserParamsSelected()
			let {
				data: { resultCode, resultData },
			} = await queryGoodsGroupInfoFilterAKCBatch(paramJson)
			this.selectedLoading = false
			if (resultCode === 0) {
				this.selectedtialogData = resultData
				// this.selectedtialogPage.count = resultData.goodsGroupCount
				this.selectedcurrentTime = Date.now()
			} else {
				// this.selectedtialogPage.count = 0
				this.selectedtialogData = []
			}
		},
		saleStateSd(row) {
			if (this.selectedcurrentTime < row.saleStartTime) {
				return {
					type: 'danger',
					label: '未开始',
				}
			}
			if (
				this.selectedcurrentTime >= row.saleStartTime &&
				this.selectedcurrentTime <= row.saleEndTime
			) {
				return {
					type: '',
					label: '进行中',
				}
			}
			if (this.selectedcurrentTime > row.saleEndTime) {
				return {
					type: 'info',
					label: '已结束',
				}
			}
		},
		saleState(row) {
			if (this.currentTime < row.saleStartTime) {
				return {
					type: 'danger',
					label: '未开始',
				}
			}
			if (
				this.currentTime >= row.saleStartTime &&
				this.currentTime <= row.saleEndTime
			) {
				return {
					type: '',
					label: '进行中',
				}
			}
			if (this.currentTime > row.saleEndTime) {
				return {
					type: 'info',
					label: '已结束',
				}
			}
		},
		findSearchParams188(value) {
			const paramJson = Object.assign(this.formData187, {
				groupNameKeyword: value,
				length: 20,
				goodsType: this.form.goodsType,
				startIndex: 0,
				groupName: value,
				pageSize: 20,
				pageNum: 1,
			})
			return paramJson
		},
		//远程搜索
		async querySearchAsync(value = '', cb) {
			//这里是需要上传给后端的参数
			let params = this.findSearchParams188(value)
			let {
				data: { resultCode, resultData },
			} = await queryGoodsGroupInfoFilterAKCBatch(params)
			if (resultCode == 0) {
				resultData.map((item) => {
					item.value = item.groupName
				})
				cb(resultData)
			} else {
				this.$message.error('接口错误')
			}
		},
		handleChange() {
			this.form.goodsGroupId = ''
		},
		handleSelect(item) {
			this.form.goodsGroupId = item.goodsGroupId
		},
		findUserParamsSelected() {
			// 当前页的条数开始
			// if (flag) {
			// 	this.tialogPage.currentPage = 1
			// }
			const paramJson = {
				gcategoryList: [],
				goodsGroupStateList: [1, 2],
				sortField: 0,
				channelType: 0,
				startTime: '',
				endTime: '',
				isShopKeeperGrouping: '',
				// length: this.tialogPage.length,
				// startIndex: (this.tialogPage.currentPage - 1) * this.tialogPage.length,
			}
			paramJson.pageSize = 100
			paramJson.pageNum = 1

			paramJson.goodsGroupIdList = this.selectGroupList.map((item) => {
				return item.goodsGroupId
			})
			return paramJson
		},
		findUserParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.tialogPage.currentPage = 1
			}
			const paramJson = {
				goodsType: this.form.goodsType,
				goodsGroupIdList: this.form.goodsGroupId
					? [this.form.goodsGroupId]
					: [],
				gcategoryList: [],
				goodsGroupStateList: [1, 2],
				sortField: 0,
				channelType: 0,
				startTime: '',
				endTime: '',
				isShopKeeperGrouping: '',
				length: this.tialogPage.length,
				startIndex: (this.tialogPage.currentPage - 1) * this.tialogPage.length,
			}

			paramJson.pageSize = this.tialogPage.length
			paramJson.pageNum = this.tialogPage.currentPage
			paramJson.groupName = this.form.value

			return paramJson
		},
		async handleQuery(flag) {
			this.showLoading = true
			let paramJson = this.findUserParams(flag)
			let {
				data: { resultCode, resultData, total },
			} = await queryGoodsGroupInfoFilterAKCBatch(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tialogData = resultData
				this.tialogPage.count = total
				this.currentTime = Date.now()
			} else {
				this.tialogPage.count = 0
				this.tialogData = []
			}
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			// this.$refs.form.$refs.YxForm.resetFields()
		},
		saveBrand() {
			this.$emit('saveSchedule', this.selectGroupList)
			this.localVisible = false
		},
	},
}
</script>

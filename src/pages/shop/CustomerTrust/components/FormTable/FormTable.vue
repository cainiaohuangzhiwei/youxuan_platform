<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>

			<el-row>
				<yx-table
					:select="true"
					v-loading="loading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
					:selectionChange="selectionChange"
				></yx-table>
			</el-row>

			<batch-dialog
				:row="currentDta"
				:visible.sync="batchDialog"
				@fatherMethodInit="fatherMethodInit"
			/>
		</div>
		<!--操作记录弹框 -->
		<el-dialog title="操作记录" :visible.sync="dialogVisible" width="50%">
			<el-timeline v-if="operatingRecord.length" :reverse="false">
				<el-timeline-item v-for="(item, index) in operatingRecord" :key="index">
					<div class="tracking-item">
						<div class="tracking-item-div">
							{{
								getConstantValueByKey(
									$store.state.app.constant.OPERATING_RECORD_STATUS,
									item.item,
									'-',
									'item'
								)
							}}
						</div>
						<div class="tracking-item-div">
							{{ moment(item.addTime).format('YYYY-MM-DD HH:mm:ss') }}
						</div>
						<div class="tracking-item-div">{{ item.userName }}</div>
					</div>
				</el-timeline-item>
			</el-timeline>
			<div v-else>暂无操作记录</div>
		</el-dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import BatchDialog from './BatchDialog'
import {
	cusServiceList,
	batchCtrlCusServiceTrusteeship,
	batchDelCusServiceTrusteeship,
} from '@/api/service'
import {
	cusServiceTrusteeshipOnForC,
	cusServiceTrusteeshipOffForC,
	cusServiceTrusteeshipRecord,
} from '@/api/yhtPlusCmsOrganization'
import { getConstantValueByKey } from '@/utils/helper/common'
import moment from 'moment'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		BatchDialog,
	},
	name: 'FormTable',

	data() {
		return {
			getConstantValueByKey: getConstantValueByKey,
			moment: moment,
			searchData: {
				keyword: '',
				trusteeshipState: '',
			},
			loading: false,
			batchDialog: false,
			// 操作记录弹框开关
			dialogVisible: false,
			orderStatus: [],
			selectionData: [],
			operatingRecord: [],
			searchCfg: [
				{
					title: '店主ID/手机号',
					dataIndex: 'keyword',
					placeholder: '请输入店主ID/手机号',
					change: () => {
						this.init()
					},
				},
				{
					type: 'select',
					title: '切换权限状态',
					dataIndex: 'trusteeshipState',
					label: 'value',
					options: this.$store.state.app.constant.TRUSTEESHIP_STATE_OPTION,
					change: () => {
						this.init()
					},
				},
				{
					type: 'select',
					title: '真实托管状态',
					dataIndex: 'entranceState',
					label: 'value',
					options: this.$store.state.app.constant.REAL_MANAGED_STATE,
					change: () => {
						this.init()
					},
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init()
					},
				},
				{
					title: '批量导入Excel',
					type: 'primary',
					auth: 'batchAddCusServiceTrusteeship',
					click: () => {
						this.batchDialog = true
					},
				},
				{
					title: '批量启用',
					auth: 'batchAddCusServiceTrusteeship',
					type: 'success',
					click: () => {
						this.handleBatchForbidden(2)
					},
				},
				{
					title: '批量禁用',
					auth: 'batchAddCusServiceTrusteeship',
					type: 'warning',
					click: () => {
						this.handleBatchForbidden(3)
					},
				},
				{
					title: '批量删除',
					auth: 'batchDelCusServiceTrusteeship',
					type: 'danger',
					click: () => {
						this.handleDel({})
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					dataIndex: 'organizationId',
					title: '店主ID',
				},
				{
					dataIndex: 'organizationName',
					title: '店主名称',
				},
				{
					dataIndex: 'phone',
					title: '手机号',
				},
				{
					type: 'string',
					dataIndex: 'trusteeshipState',
					title: '切换权限状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.TRUSTEESHIP_STATE_OPTION,
							row.trusteeshipState,
							'-',
							'trusteeshipState'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'entranceState',
					title: '真实托管状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.REAL_MANAGED_STATE,
							row.entranceState,
							'-',
							'entranceState'
						)
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '禁用',
							auth: 'batchAddCusServiceTrusteeship',
							click: (row) => {
								this.handleForbidden(row)
							},
							customRender: (action, row) => {
								action.title = getConstantValueByKey(
									this.$store.state.app.constant.TRUSTEESHIP_STATE_OPTION,
									row.trusteeshipState == 1 ? 0 : 1,
									'-',
									'trusteeshipState'
								)
								return action
							},
						},
						{
							title: '开启',
							auth: 'cusServiceTrusteeshipOnForC',
							click: (row) => {
								this._cusServiceTrusteeshipNoOff(row)
							},
							customRender: (action, row) => {
								action.title = getConstantValueByKey(
									this.$store.state.app.constant.REAL_MANAGED_STATE,
									row.entranceState == 1 ? 0 : 1,
									'-',
									'entranceState'
								)
								return action
							},
						},
						{
							title: '删除',
							auth: 'batchDelCusServiceTrusteeship',
							click: (row) => {
								this.handleDel(row)
							},
						},
						{
							title: '查看操作记录',
							click: (row) => {
								this._cusServiceTrusteeshipRecord(row)
							},
						},
					],
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
		}
	},

	created() {
		// this.init(true)
	},

	methods: {
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.searchData, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})

			return paramJson
		},

		// 子组件调用父组件选品区方法更新
		fatherMethodInit() {
			this.init(true)
		},
		async _cusServiceTrusteeshipRecord(row) {
			console.log(row)
			// 获取操作记录
			let paramJson = Object.assign(
				{},
				{
					organizationId: row.organizationId,
					length: 100,
					startIndex: (this.page.currentPage - 1) * this.page.length,
				}
			)
			let {
				data: {
					resultCode,
					resultData: { records = [] },
				},
			} = await cusServiceTrusteeshipRecord(paramJson)
			this.dialogVisible = true
			if (resultCode == 0) {
				this.operatingRecord = records
			}
		},
		// 获取客服托管列表
		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			let res = await cusServiceList(paramJson)

			if (res.data.resultData.cusServiceTrusteeshipList.length > 0) {
				this.tableData = res.data.resultData.cusServiceTrusteeshipList
				this.page.count = res.data.resultData.count
				this.loading = false
			} else {
				this.page.count = 0
				this.tableData = []
				this.loading = false
			}
		},

		// 多选
		selectionChange(row) {
			this.selectionData = row
		},

		// 禁用/启用
		async handleForbidden(row) {
			const paramJson = Object.assign(
				{},
				{
					organizationIds: [row.organizationId],
					trusteeshipState: row.trusteeshipState == 1 ? 0 : 1,
				}
			)

			this.$confirm(
				`确认要${this.getConstantValueByKey(
					this.$store.state.app.constant.TRUSTEESHIP_STATE_OPTION,
					paramJson.trusteeshipState,
					'-',
					'trusteeshipState'
				)}该客服托管吗？`,
				'提示',
				{
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							let {
								data: { resultMsg },
							} = await batchCtrlCusServiceTrusteeship(paramJson)
							this.$message.success(resultMsg)
							this.init(true)
						}
					},
				}
			)
		},
		// 打开/关闭
		async _cusServiceTrusteeshipNoOff(row) {
			const paramJson = Object.assign(
				{},
				{
					organizationId: row.organizationId,
					userName: this.$store.state.user.userInfo.nickname,
				}
			)
			let usServiceTrusteeshipOnOff
			if (row.entranceState == 1) {
				usServiceTrusteeshipOnOff = cusServiceTrusteeshipOffForC
			} else {
				usServiceTrusteeshipOnOff = cusServiceTrusteeshipOnForC
			}
			this.$confirm(
				`确认要${this.getConstantValueByKey(
					this.$store.state.app.constant.REAL_MANAGED_STATE,
					row.entranceState == 1 ? 0 : 1,
					'-',
					'entranceState'
				)}该客服托管吗？`,
				'提示',
				{
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							let {
								data: { resultMsg },
							} = await usServiceTrusteeshipOnOff(paramJson)
							this.$message.success(resultMsg)
							this.init(true)
						}
					},
				}
			)
		},
		// 批量禁用/启用
		handleBatchForbidden(type) {
			let ids
			if (type == 2) {
				ids = this.selectionData.map((item) => {
					if (item.trusteeshipState === 0) {
						return item.organizationId
					}
				})
			} else if (type == 3) {
				ids = this.selectionData.map((item) => {
					if (item.trusteeshipState === 1) {
						return item.organizationId
					}
				})
			}

			if (this.isAllEqual(ids)) {
				return this.$message.warning('请选择可操作的店铺托管记录')
			}

			const idsArr = ids.filter((i) => i)
			const paramJson = Object.assign(
				{},
				{
					organizationIds: idsArr,
					trusteeshipState: type == 2 ? 1 : 0,
				}
			)

			this.$confirm(
				`确认要批量${this.getConstantValueByKey(
					this.$store.state.app.constant.TRUSTEESHIP_STATE_OPTION,
					paramJson.trusteeshipState,
					'-',
					'trusteeshipState'
				)}${idsArr.length}个店铺托管记录？`,
				'提示',
				{
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							let {
								data: { resultMsg },
							} = await batchCtrlCusServiceTrusteeship(paramJson)
							this.$message.success(resultMsg)
							this.init(true)
						}
					},
				}
			)
		},

		// 判断数组的数组是否全部为undefined
		isAllEqual(array) {
			if (array.length > 0) {
				return !array.some(function (value) {
					return value !== array[1]
				})
			} else {
				return true
			}
		},

		// 删除
		handleDel(row) {
			const ids = this.selectionData.map((item) => {
				return item.organizationId
			})
			const paramJson = Object.assign(
				{},
				{
					groupId: 2,
					organizationIds:
						Object.keys(row).length > 0
							? [row.customerServiceTrusteeshipId]
							: ids,
					trusteeshipState: row.trusteeshipState == 1 ? 0 : 1,
				}
			)

			if (Object.keys(row).length == 0 && !this.selectionData.length) {
				return this.$message.warning('请选择店铺托管')
			}

			const title =
				Object.keys(row).length == 0
					? `确定批量删除${this.selectionData.length}勾选的店铺托管？`
					: '确认要删除该记录吗？'

			this.$confirm(title, '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						let {
							data: { resultMsg, resultCode },
						} = await batchDelCusServiceTrusteeship(paramJson)
						const type = resultCode == 0 ? 'success' : 'error'
						this.$message[type](resultMsg)
						this.init(true)
					}
				},
			})
		},
	},
}
</script>

<style>
.tracking-item {
	display: flex;
}
.tracking-item-div {
	width: 30%;
}
</style>

<template>
	<basic-container>
		<div>
			<div style="">
				<WgForm
					style="display: contents"
					:inline="true"
					:data="searchFormData"
					:items="searchFormCfg"
					:formAction="searchAction"
				>
				</WgForm>
			</div>
			<el-row>
				<h3>策略组：{{ groupName }}</h3>
				<WgTable
					v-loading="loading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableList"
				>
					<template slot="setName" slot-scope="scope">
						{{ scope.row.strategyName }}
						<el-button
							icon="el-icon-edit"
							@click="modifyName(scope.row, STATEGIC_TYPE.MODIFY)"
						></el-button>
					</template>
				</WgTable>
			</el-row>
		</div>
		<Dialog :title="dialogTitle" :visible.sync="modifyNameShow" width="400px">
			<WgForm
				ref="WgForm"
				:actionInline="true"
				labelWidth="4em"
				class="strategy"
				:data="strategyData"
				v-loading="copyLoading"
				:items="
					type == STATEGIC_TYPE.COPY ? strategyCfgAdd : strategyCfgModification
				"
			>
				<template slot="uoStrategyGroupId">
					<el-select
						value-key="userTagId"
						style="width: 100%"
						v-model="strategyData.uoStrategyGroupId"
						clearable
						:remote-method="_getTagList"
						filterable
						allow-create
						default-first-option
						placeholder="请输入组名称"
						@change="changeSelectGroup"
					>
						<el-option
							v-for="item in tagList"
							:key="item.uoStrategyGroupId"
							:label="item.groupName + ' —— ' + item.creator"
							:value="item.uoStrategyGroupId"
						>
						</el-option>
					</el-select>
				</template>
			</WgForm>
			<el-button type="primary" class="btns" @click="createOrUpdate"
				>确定</el-button
			>
			<el-button class="btns" @click="hideModifyDialog">取消</el-button>
		</Dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import WgForm from '@/components/WgForm'
import WgTable from '@/components/WgTable'
import Dialog from '@/components/Dialog'
import moment from 'moment'
import {
	queryStrategyBatch,
	removeStrategy,
	updateStrategyName,
	enableStrategy,
	disableStrategy,
	queryStrategyGroupBatch,
	saveStrategy,
	seeConfig,
	saveDraft,
} from '@/api/userOperation'
import { STATEGIC_TYPE, STATEGIC_STATUS_MAP } from '../constants.js'
import { OPTION_TYPE } from '../../../groupConfiguration/components/constants.js'

export default {
	components: {
		BasicContainer,
		WgForm,
		WgTable,
		Dialog,
	},
	name: 'FormTable',

	data() {
		return {
			loading: false,
			copyLoading: false,
			modifyNameShow: false,
			dialogTitle: '',
			type: null,
			STATEGIC_TYPE,
			tagList: [],
			searchFormData: {
				status: '',
				strategyName: '',
				creator: '',
			},
			strategyData: {
				groupName: '',
				uoStrategyGroupId: '',
			},
			tableList: [],
			searchFormCfg: [
				{
					title: '名称：',
					type: 'input',
					dataIndex: 'strategyName',
					placeholder: '模糊搜索',
				},
				{
					title: '创建人：',
					type: 'input',
					dataIndex: 'creator',
					placeholder: '模糊搜索',
				},
				{
					type: 'select',
					title: '状态',
					dataIndex: 'status',
					label: 'text',
					options: [
						{
							status: STATEGIC_STATUS_MAP.ALL,
							text: '全部',
						},
						{
							status: STATEGIC_STATUS_MAP.DRAFT,
							text: '草稿',
						},
						{
							status: STATEGIC_STATUS_MAP.PENDING_ENABLE,
							text: '待启用',
						},
						{
							status: STATEGIC_STATUS_MAP.ENABLE,
							text: '启用',
						},
						{
							status: STATEGIC_STATUS_MAP.DISABLE,
							text: '禁用',
						},
					],
					change: () => {
						this._researchDataList()
					},
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					align: 'right',
					click: () => {
						this._researchDataList(true)
					},
				},
			],
			strategyCfgAdd: [
				{
					title: '名称',
					type: 'input',
					dataIndex: 'strategyName',
					maxlength: 20,
				},
				{
					type: 'custom',
					title: '组名',
					dataIndex: 'uoStrategyGroupId',
					maxlength: 20,
				},
			],
			strategyCfgModification: [
				{
					title: '新名称',
					type: 'input',
					dataIndex: 'strategyName',
					maxlength: 20,
				},
			],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'uoStrategyId',
					// align: 'center',
					title: 'ID',
				},
				{
					type: 'custom',
					dataIndex: 'setName',
					title: '名称',
				},
				{
					type: 'map',
					dataIndex: 'status',
					title: '状态',
					options: {
						草稿: 0,
						待启用: 1,
						启用: 2,
						禁用: 3,
					},
				},
				{
					type: 'string',
					dataIndex: 'creator',
					title: '创建人',
				},
				{
					type: 'string',
					dataIndex: 'addTime',
					title: '创建日期',
					customRender: (row) => {
						return moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '启用',
							auth: 'userOperationStrategyGroupQueryStrategyGroupBatch',
							click: (row) => {
								this.enableStrategy(row)
							},
							customRender: (action, row) => {
								if (
									row.status === STATEGIC_STATUS_MAP.PENDING_ENABLE ||
									row.status === STATEGIC_STATUS_MAP.DISABLE
								) {
									action.hide = false
								} else {
									action.hide = true
								}
								return action
							},
						},
						{
							title: '禁用',
							auth: 'userOperationStrategyGroupQueryStrategyGroupBatch',
							click: (row) => {
								// 禁用
								this.disableStrategy(row)
							},
							customRender: (action, row) => {
								if (row.status === STATEGIC_STATUS_MAP.ENABLE) {
									action.hide = false
								} else {
									action.hide = true
								}
								return action
							},
						},
						{
							title: '复制',
							auth: 'userOperationStrategyGroupQueryStrategyGroupBatch',
							click: (row) => {
								this.modifyName(row, STATEGIC_TYPE.COPY)
								this._getTagList()
							},
							customRender: (action, row) => {
								if (row.status !== STATEGIC_STATUS_MAP.DRAFT) {
									action.hide = false
								} else {
									action.hide = true
								}
								return action
							},
						},
						{
							title: '查看',
							auth: 'userOperationStrategyGroupQueryStrategyGroupBatch',
							click: (row) => {
								this.$router.push({
									name: 'CreateGroupStrategic',
									params: {
										type: OPTION_TYPE.VIEW,
										id: row.uoStrategyId,
										uoStrategyGroupId: row.uoStrategyGroupId,
										groupName: this.groupName,
									},
								})
							},
							customRender: (action, row) => {
								if (row.status !== STATEGIC_STATUS_MAP.DRAFT) {
									action.hide = false
								} else {
									action.hide = true
								}
								return action
							},
						},
						{
							title: '编辑',
							auth: 'userOperationStrategyGroupQueryStrategyGroupBatch',
							click: (row) => {
								this.$router.push({
									name: 'CreateGroupStrategic',
									params: {
										type: OPTION_TYPE.CREATE,
										id: row.uoStrategyId,
										uoStrategyGroupId: row.uoStrategyGroupId,
										groupName: this.groupName,
									},
								})
							},
							customRender: (action, row) => {
								if (
									row.status === STATEGIC_STATUS_MAP.ENABLE ||
									row.status === STATEGIC_STATUS_MAP.DISABLE
								) {
									action.hide = true
								} else {
									action.hide = false
								}
								return action
							},
						},
						{
							title: '删除',
							auth: 'userOperationStrategyGroupQueryStrategyGroupBatch',
							click: (row) => {
								this.deleteRow(row)
							},
							customRender: (action, row) => {
								if (
									row.status === STATEGIC_STATUS_MAP.ENABLE ||
									row.status === STATEGIC_STATUS_MAP.DISABLE
								) {
									action.hide = true
								} else {
									action.hide = false
								}
								return action
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
					this._researchDataList()
				},
			},
		}
	},
	mounted() {
		this.groupName = this.$route.params.groupName
		this._researchDataList()
	},
	activated: function () {
		this.groupName = this.$route.params.groupName
		this._researchDataList(true)
	},
	methods: {
		modifyName(row, v) {
			this.type = v
			if (v === STATEGIC_TYPE.COPY) {
				this.dialogTitle = '复制策略'
				this.strategyData = {
					...this.strategyData,
					uoStrategyId: row.uoStrategyId,
					strategyName: row.strategyName,
					uoStrategyGroupId: Number(row.uoStrategyGroupId),
				}
			} else {
				this.dialogTitle = '修改名称'
				this.strategyData = {
					...row,
				}
			}
			this.modifyNameShow = true
		},

		// 改
		async createOrUpdate() {
			// 拷贝页面
			if (this.type === STATEGIC_TYPE.COPY) {
				this.copyLoading = true

				const params = {
					// 复制的状态下， 传uoStrategyId
					uoStrategyId: this.strategyData.uoStrategyId,
					groupName: this.strategyData.groupName,
					uoStrategyGroupId: this.strategyData.uoStrategyGroupId,
					strategyName: this.strategyData.strategyName,
					creatorId: this.$store.state.user.userInfo.clerkId,
					creator: this.$store.state.user.userInfo.clerkName,
				}
				const {
					data: { resultCode, resultData },
				} = await saveStrategy(params)

				if (resultCode === 0) {
					// 获取拷贝源的策略配置
					const {
						data: {
							resultCode: sourceStrategyCode,
							resultData: sourceStrategyData,
						},
					} = await seeConfig({
						strategyId: this.strategyData.uoStrategyId,
					})

					if (sourceStrategyCode === 0) {
						const {
							data: { resultCode: saveDraftCode },
						} = await saveDraft({
							...sourceStrategyData,
							uoStrategyId: resultData.uoStrategyId,
						})

						if (saveDraftCode === 0) {
							this.modifyNameShow = false
							this.strategyData = {}
							this.$message.success('复制成功')
							this._researchDataList()
							setTimeout(() => {
								this.copyLoading = false
								this.$router.push({
									name: 'CreateGroupStrategic',
									params: {
										type: OPTION_TYPE.CREATE,
										id: resultData.uoStrategyId,
										uoStrategyGroupId: params.uoStrategyGroupId,
										groupName: this.groupName,
									},
								})
							}, 1000)
						}
					}
				}
				this.copyLoading = false
			} else {
				const {
					data: { resultCode },
				} = await updateStrategyName({
					strategyName: this.strategyData.strategyName,
					uoStrategyId: this.strategyData.uoStrategyId,
				})
				if (resultCode === 0) {
					this.modifyNameShow = false
					this.$message.success('修改成功')
					this._researchDataList(true)
				}
			}
		},

		// 删
		async deleteRow(row) {
			this.$confirm('是否删除该条策略', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const {
					data: { resultCode },
				} = await removeStrategy({
					uoStrategyId: row.uoStrategyId,
				})
				if (resultCode === 0) {
					this.$message.success('删除成功')
					this._researchDataList(true)
				}
			})
		},

		// 启用
		async enableStrategy(row) {
			this.$confirm('是否启用该条策略', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const {
					data: { resultCode },
				} = await enableStrategy({
					strategyId: row.uoStrategyId,
				})
				if (resultCode === 0) {
					this.$message.success('启用成功')
					this._researchDataList()
				}
			})
		},

		// 禁用
		async disableStrategy(row) {
			this.$confirm('是否禁用该条策略', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const {
					data: { resultCode },
				} = await disableStrategy({
					strategyId: row.uoStrategyId,
				})
				if (resultCode === 0) {
					this.$message.success('禁用成功')
					this._researchDataList()
				}
			})
		},

		hideModifyDialog() {
			this.modifyNameShow = false
		},
		getOpen() {
			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.$message({
						type: 'success',
						message: '删除成功!',
					})
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					})
				})
		},

		// 搜索条件
		findSearchParams(flag) {
			//搜索条件
			const paramJson = {
				pageNum: 1,
				pageSize: 10,
				uoStrategyGroupId: this.$route.params.id,
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
		async _researchDataList(flag) {
			let paramJson = this.findSearchParams(flag)
			this.loading = true
			const params = {
				...paramJson,
				...this.searchFormData,
			}
			const {
				data: { resultCode, resultData, total },
			} = await queryStrategyBatch(params)
			this.loading = false
			if (resultCode == 0) {
				this.tableList = resultData
				this.page.count = total
			} else {
				this.page.count = 0
				this.tableList = []
			}
		},

		async _getTagList() {
			const params = {
				startCreateTime: new Date('2021-01-01 00:00:00').getTime(),
				groupName: '',
				creator: '',
				pageSize: 99999999,
				currentPage: 1,
			}
			const {
				data: { resultCode, resultData },
			} = await queryStrategyGroupBatch(params)
			if (resultCode === 0) {
				this.tagList = Object.freeze(resultData)
				const groupName = this.tagList.find(
					(item) =>
						item.uoStrategyGroupId === this.strategyData.uoStrategyGroupId
				).groupName
				this.strategyData.groupName = groupName
			}
		},

		changeSelectGroup(val) {
			const current = this.tagList.find(
				(item) => item.uoStrategyGroupId === val
			)
			if (current) {
				this.strategyData.groupName = current.groupName
				this.strategyData.uoStrategyGroupId = current.uoStrategyGroupId
			} else {
				this.strategyData.groupName = val
				this.strategyData.uoStrategyGroupId = ''
			}
		},
	},
}
</script>

<style>
.btns {
	float: right;
	margin-right: 10px;
}
</style>

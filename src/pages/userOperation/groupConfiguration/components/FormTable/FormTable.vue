<template>
	<basic-container>
		<div>
			<div>
				<WgForm
					style="display: contents"
					:inline="true"
					:data="searchParams"
					:items="searchFormCfg"
					:formAction="searchAction"
				>
				</WgForm>
			</div>

			<el-row>
				<WgTable
					v-loading="loading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableList"
				>
					<template slot="setName" slot-scope="scope">
						{{ scope.row.groupName }}
						<el-button
							icon="el-icon-edit"
							@click="modifyName(scope.row, EDIT_TYPE.MODIFY)"
						></el-button>
					</template>
				</WgTable>
			</el-row>
		</div>
		<Dialog :title="dialogTitle" :visible.sync="modifyNameShow" width="400px">
			<WgForm
				ref="WgForm"
				labelWidth="4em"
				class="strategy"
				:data="strategyGroupData"
				:items="
					type == EDIT_TYPE.CREATE
						? strategyGroupCfgAdd
						: strategyGroupCfgModification
				"
			>
				<template slot="uoStrategyGroupId">
					<el-select
						value-key="userTagId"
						style="width: 100%"
						v-model="strategyGroupData.uoStrategyGroupId"
						clearable
						@focus="_getTagList"
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
	queryStrategyGroupBatch,
	removeStrategyGroup,
	updateStrategyGroup,
	saveStrategy,
} from '@/api/userOperation'
import { EDIT_TYPE, OPTION_TYPE } from '../constants'

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
			modifyNameShow: false,
			EDIT_TYPE,
			dialogTitle: '',
			type: null,
			tableList: [],
			tagList: [],
			searchParams: {
				groupName: '',
				creator: '',
			},
			searchFormCfg: [
				{
					title: '名称：',
					type: 'input',
					dataIndex: 'groupName',
					placeholder: '模糊搜索',
				},
				{
					title: '创建人：',
					type: 'input',
					dataIndex: 'creator',
					placeholder: '模糊搜索',
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
				{
					title: '新建策略',
					type: 'primary',
					align: 'right',
					click: () => {
						this.modifyName(null, EDIT_TYPE.CREATE)
					},
				},
			],
			addEntry: false,
			strategyGroupData: {
				groupName: '',
				name: '',
				uoStrategyGroupId: '',
			},
			strategyGroupCfgAdd: [
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
			strategyGroupCfgModification: [
				{
					title: '新名称',
					type: 'input',
					dataIndex: 'groupName',
					maxlength: 20,
				},
			],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'uoStrategyGroupId',
					align: 'center',
					title: 'ID',
				},
				{
					type: 'custom',
					dataIndex: 'setName',
					align: 'center',
					title: '组名',
				},
				{
					type: 'string',
					dataIndex: 'creator',
					align: 'center',
					title: '创建人',
				},
				{
					type: 'string',
					dataIndex: 'addTime',
					align: 'center',
					title: '创建日期',
					customRender: (record) =>
						moment(record.addTime).format('YYYY-MM-DD HH:mm:ss'),
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '查看',
							auth: 'uoAttributeClassifyQueryUoAttributeClassifyBatch',
							click: (record) => {
								this.$router.push({
									name: 'StrategicManagement',
									params: {
										id: record.uoStrategyGroupId,
										groupName: record.groupName,
									},
								})
							},
						},
						{
							title: '删除',
							auth: 'uoAttributeClassifyQueryUoAttributeClassifyBatch',
							click: (record) => {
								this.deleteStrategyGroup(record)
							},
							customRender: (action, record) => {
								action.hide = record.isDisplay !== 1
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
	activated() {
		this._researchDataList()
	},
	methods: {
		modifyName(row, v) {
			this.modifyNameShow = true
			this.type = v
			if (v === EDIT_TYPE.CREATE) {
				this.dialogTitle = '新建策略'
				this.strategyGroupData = {}
			} else {
				this.dialogTitle = '修改名称'
				this.strategyGroupData = {
					...row,
				}
			}
		},

		hideModifyDialog() {
			this.modifyNameShow = false
		},

		async createOrUpdate() {
			// 去到新建页面
			if (this.type === EDIT_TYPE.CREATE) {
				const params = {
					groupName: this.strategyGroupData.groupName,
					uoStrategyGroupId: !this.addEntry
						? this.strategyGroupData.uoStrategyGroupId
						: null,
					strategyName: this.strategyGroupData.strategyName,
					creatorId: this.$store.state.user.userInfo.clerkId,
					creator: this.$store.state.user.userInfo.clerkName,
				}

				const {
					data: { resultCode, resultData },
				} = await saveStrategy(params)

				if (resultCode === 0) {
					this.$message.success('新建成功')
					this._researchDataList()
					this.modifyNameShow = false
					this.strategyGroupData = {}
					this.$router.push({
						name: 'CreateGroupStrategic',
						params: {
							type: OPTION_TYPE.CREATE,
							id: resultData.uoStrategyId,
							uoStrategyGroupId: resultData.uoStrategyGroupId,
							groupName: resultData.groupName,
						},
					})
				}
			} else {
				const {
					data: { resultCode },
				} = await updateStrategyGroup({
					groupName: this.strategyGroupData.groupName,
					uoStrategyGroupId: this.strategyGroupData.uoStrategyGroupId,
				})
				if (resultCode === 0) {
					this.modifyNameShow = false
					this.$message.success('修改成功')
					this._researchDataList(true)
				}
			}
		},

		// 删除策略分组
		async deleteStrategyGroup(record) {
			this.$confirm('确定删除该策略分组吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					const { uoStrategyGroupId } = record
					this.loading = true
					const {
						data: { resultCode },
					} = await removeStrategyGroup({
						uoStrategyGroupId,
					})
					this.loading = false
					if (resultCode === 0) {
						this.$message.success({
							message: '删除成功',
						})
						this._researchDataList()
					}
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
		async _getTagList() {
			const params = {
				startCreateTime: new Date('2021-01-01 00:00:00').getTime(),
				groupName: '',
				creator: '',
				pageSize: 99999999,
				currentPage: 1,
			}
			let {
				data: { resultData },
			} = await queryStrategyGroupBatch(params)
			this.tagList = Object.freeze(resultData)
		},
		async _researchDataList(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const params = {
				...paramJson,
				...this.searchParams,
			}
			const {
				data: { resultCode, resultData, total },
			} = await queryStrategyGroupBatch(params)
			this.loading = false
			if (resultCode == 0) {
				this.tableList = resultData
				this.page.count = total
			} else {
				this.page.count = 0
				this.tableList = []
			}
		},

		changeSelectGroup(val) {
			const current = this.tagList.find(
				(item) => item.uoStrategyGroupId === val
			)
			if (current) {
				this.addEntry = false
				this.strategyGroupData.groupName = current.groupName
				this.strategyGroupData.uoStrategyGroupId = current.uoStrategyGroupId
			} else {
				this.strategyGroupData.groupName = val
				this.addEntry = true
				// this.strategyGroupData.uoStrategyGroupId = ''
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

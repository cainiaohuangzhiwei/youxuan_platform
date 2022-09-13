<template>
	<div class="shopFamilyTree-page">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane
				label="店主查询"
				name="shopkeeperQuery"
				v-auth="getKaBoardPage"
			>
				<yx-form
					:inline="true"
					labelWidth="6em"
					:data="formData"
					:items="formCfg"
					:formAction="formAction"
				>
					<template #dataTime>
						<el-date-picker
							v-model="formData.dataTime"
							type="date"
							placeholder="选择日期时间"
							value-format="yyyy-MM-dd"
							format="yyyy-MM-dd"
							:picker-options="{
								disabledDate: (time) => {
									return (
										time.getTime() < Date.now() - 8.64e7 * 33 ||
										time.getTime() > Date.now() - 8.64e7
									)
								},
								selectableRange: startTimeRange,
							}"
						>
						</el-date-picker>
					</template>
				</yx-form>
			</el-tab-pane>
			<el-tab-pane
				label="员工组别管理"
				name="groupManagement"
				v-auth="businessGroupClerkPage"
			>
				<el-button
					type="primary"
					style="margin-bottom: 20px"
					@click="add"
					v-auth="addBusinessGroupClerk"
					>新建</el-button
				>
				<yx-table
					v-loading="groupLoading"
					:columns="groupTableColumns"
					:pagination="groupPage"
					:data="groupTableDataBrand"
				>
				</yx-table>
			</el-tab-pane>
		</el-tabs>
		<Dialog
			title="新建"
			:visible="dialogVisible106"
			:width="dialogWidth106"
			:bottomBtn="dialogBottomBtn106"
			@before-close="dialogVisible106 = false"
		>
			<yx-form
				ref="addFormDialog"
				:data="formData107"
				:items="formCfg107"
				:formAction="formAction107"
				:rules="addRecordPopupFormRules"
				label-width="100px"
			>
				<template #selectClerk>
					<el-input
						v-model="formData107.userName"
						placeholder="请选择员工"
						value-key="userId"
						label="userName"
						@focus="selectEmpoyee"
						clearable
						@clear="
							() => {
								formData107.userName = ''
								formData107.userId = ''
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="employeeDialogVisible = true"
						></el-button>
					</el-input>
				</template>
			</yx-form>
		</Dialog>
		<echarts
			v-if="activeName == 'shopkeeperQuery'"
			ref="echartsRef"
			:treeDatas="treeDatas"
			:formData="formData"
			@actionTypeClick="actionTypeClick"
			@getData="getData"
		></echarts>
		<selectedEmployeeDialog
			:dialogVisible.sync="employeeDialogVisible"
			:selectedList.sync="employeeList"
		></selectedEmployeeDialog>
	</div>
</template>
<script>
import echarts from './components/echarts.vue'
import YxForm from '@wg-vue-materials/yx-form'
import {
	getKaBoardPage,
	queryListByPage,
	addBusinessGroupClerk,
	deleteBusinessGroupClerk,
	queryDownList,
} from '@/api/ka'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import selectedEmployeeDialog from '@/components/EmployeeDialog'
export default {
	name: 'shopFamilyTree',
	components: {
		echarts,
		YxForm,
		YxTable,
		Dialog,
		selectedEmployeeDialog,
	},
	data() {
		return {
			activeName: 'shopkeeperQuery',
			treeDatas: {},
			loading: false,
			employeeDialogVisible: false,
			groupLoading: false,
			dialogVisible106: false,
			employeeList: [],
			formData: {
				currentDepth: 1, // 需要查询的深度
				organizationId: '', // 店主id
				pageNum: 0, // 当前页码
				pageSize: 5, // 每页大小
				rootOrganizationId: '', // 根节点店主id
				dataTime: '', // 时间
			},
			formCfg: [
				{
					title: '店铺id',
					type: 'inputNumber',
					dataIndex: 'organizationId',
					placeholder: '请输入店铺id',
					enter: () => {
						if (!this.loading) this.getData()
					},
				},
				{
					type: 'custom',
					dataIndex: 'dataTime',
					title: '时间筛选',
				},
			],
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (!this.loading) this.getData()
					},
				},
			],
			groupTableDataBrand: [],
			groupTableColumns: [
				{
					type: 'string',
					dataIndex: 'businessGroupNumber',
					title: '组别',
				},
				{
					type: 'string',
					dataIndex: 'userName',
					title: '员工',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '删除',
							auth: 'deleteBusinessGroupClerk',
							click: (row) => {
								this.$confirm('此操作将删除该员工组别, 是否继续?', '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning',
								})
									.then(async () => {
										let {
											data: { resultCode },
										} = await deleteBusinessGroupClerk({ id: row.id })
										if (resultCode == 0) {
											this.$message({
												type: 'success',
												message: '删除成功!',
											})
											this._queryListByPage()
										}
									})
									.catch(() => {
										this.$message({
											type: 'info',
											message: '已取消删除',
										})
									})
							},
						},
					],
				},
			],
			groupPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._queryListByPage()
				},
			},
			dialogBottomBtn106: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.addFormDialog.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this._addBusinessGroupClerk()
							}
						})
					},
				},
			],

			formAction107: [],
			addRecordPopupFormRules: {
				businessGroupNumber: [
					{ required: true, message: '请选择组别!', trigger: 'blur' },
				],
				userName: [{ required: true, message: '请选择员工!', trigger: 'blur' }],
			},
			formCfg107: [
				{
					type: 'custom',
					title: '选择员工',
					dataIndex: 'selectClerk',
				},
				{
					title: '选择组别',
					type: 'select',
					dataIndex: 'businessGroupNumber',
					label: 'value',
					options: [],
				},
			],
			businessGroupNumberList: [],
			formData107: {
				userName: '',
				userId: '',
				businessGroupNumber: '',
			},
			expandable: 1,
		}
	},
	watch: {
		employeeList: {
			handler(val) {
				val.length > 0 &&
					(this.formData107.userName = val[0].userName) &&
					(this.formData107.userId = val[0].userId)
			},
			deep: true,
		},
	},
	methods: {
		add() {
			this.dialogVisible106 = true
			this.employeeList = []
			this.formData107 = {
				userName: '',
				userId: '',
				businessGroupNumber: '',
			}
			this._queryDownList()
		},
		async _queryDownList() {
			let {
				data: { resultCode, resultData },
			} = await queryDownList({})
			if (resultCode == 0) {
				this.businessGroupNumberList = resultData
				this.formCfg107[1].options = [
					...this.businessGroupNumberList.map((item) => {
						return {
							businessGroupNumber: item,
							value: item + '组',
						}
					}),
				]
			}
		},

		async _addBusinessGroupClerk() {
			let paramJson = {
				empowerUserId: this.formData107.userId,
				userName: this.formData107.userName,
				businessGroupNumber: this.formData107.businessGroupNumber,
			}
			let {
				data: { resultCode },
			} = await addBusinessGroupClerk(paramJson)
			if (resultCode == 0) {
				this.$message.success('成功')
				this.dialogVisible106 = false
				this._queryListByPage()
			}
		},
		// 选择员工列表
		selectEmpoyee(e) {
			e.target.blur()
			this.employeeDialogVisible = true
		},
		// tab切换
		handleClick(tab) {
			if (tab.name == 'shopkeeperQuery') {
				// this.getData()
			} else if (tab.name == 'groupManagement') {
				this._queryListByPage(true)
			}
		},
		findCounponParams(flag) {
			const paramJson = Object.assign(
				{},
				{
					startIndex: 0,
					length: 1,
					userState: 1,
				}
			)
			// 每页的加载数据长度
			paramJson.pageSize = this.groupPage.length
			// 当前页的条数开始
			if (flag) {
				this.groupPage.currentPage = 1
			}
			paramJson.startIndex =
				(this.groupPage.currentPage - 1) * this.groupPage.length
			paramJson.pageNum = this.groupPage.currentPage
			return paramJson
		},
		async _queryListByPage(flag) {
			// 员工列表
			this.groupLoading = true
			let paramJson = this.findCounponParams(flag)
			let {
				data: { resultCode, resultData, total },
			} = await queryListByPage(paramJson)
			this.groupLoading = false
			if (resultCode == 0) {
				this.groupTableDataBrand = resultData
				this.groupPage.count = total
			} else {
				this.groupPage.count = 0
				this.groupTableDataBrand = []
			}
		},
		actionTypeClick(type, nodeData, idNodesChainKeys, clickExpandable) {
			console.log('type类型：', type, '数据链：', nodeData)
			let idNodesChainKeysAry = idNodesChainKeys
				? idNodesChainKeys.split(',')
				: []
			console.log('操作节点---', type, nodeData.pageNum)
			// 判断是否有选中节点
			if (!nodeData.organizationId) {
				this.$message({
					type: 'error',
					message: '请选择需操作的店主',
					duration: 3000,
				})
				return
			} else if (type === 'root' && idNodesChainKeysAry.length === 1) {
				this.$message({
					type: 'error',
					message: '该选中节点为根节点',
					duration: 3000,
				})
				return
			} else if (type === 'root' && !nodeData.canDeepSearch) {
				this.$message({
					type: 'error',
					message: '该店主暂无下转信息',
					duration: 3000,
				})
				return
			} else if (type === 'up' && nodeData.pageNum - 1 <= 0) {
				this.$message({
					type: 'error',
					message: '当前已为第一页信息',
					duration: 3000,
				})
				return
			} else if (
				type === 'down' &&
				(nodeData.pageNum + 1 > nodeData.totalPage ||
					!clickExpandable ||
					!this.expandable)
			) {
				this.$message({
					type: 'error',
					message: '当前为最后一页，暂无更多数据',
					duration: 3000,
				})
				return
			}
			let nextData = {
				organizationId: nodeData.organizationId,
				currentDepth: idNodesChainKeysAry.length + 1,
				pageNum:
					type === 'down'
						? nodeData.pageNum + 1
						: type === 'up'
						? nodeData.pageNum - 1
						: 1,
			}
			if (type === 'root') {
				// 打开新窗口
				window.open(
					'/yhtplus/egg/statistics/shopFamilyTree?rootOrganizationId=' +
						this.formData.organizationId +
						'&currentDepth=1&pageNum=1&dataTime=' +
						this.formData.dataTime +
						'&organizationId=' +
						nextData.organizationId
				)
			} else {
				// 切换选中节点数据
				this.getData(nextData, type, idNodesChainKeysAry)
			}
		},
		isNumber(val) {
			val = val.replace(/[^0-9]/gi, '')
			// 此处还可以限制位数以及大小
			return val
		},
		async getData(nextData, type, idNodesChainKeysAry) {
			let paramJson = {}
			let actionType = 'new'
			if (nextData) {
				paramJson = {
					dataTime: this.formData.dataTime,
					organizationId: nextData.organizationId,
					rootOrganizationId: this.formData.organizationId,
					currentDepth: nextData.currentDepth,
					pageNum: nextData.pageNum,
					pageSize: 5,
				}
				actionType = 'next'
			} else {
				paramJson = {
					dataTime: this.formData.dataTime,
					organizationId: this.formData.organizationId,
					rootOrganizationId: this.formData.organizationId,
					pageNum: 1,
					pageSize: 5,
					currentDepth: 1,
				}
			}
			if (paramJson.organizationId.length > 10) {
				return this.$message.warning('店主ID长度不可大于10位')
			}
			if (!paramJson.organizationId) {
				this.$message({
					type: 'error',
					message: '请输入店主id',
					duration: 3000,
				})
				return
			} else if (!paramJson.dataTime) {
				this.$message({
					type: 'error',
					message: '请选择查询时间',
					duration: 3000,
				})
				return
			}

			this.loading = true

			const {
				data: { resultCode, resultData, resultMsg },
			} = await getKaBoardPage(paramJson)

			if (resultCode != 0 && !resultMsg) {
				this.$message({
					type: 'error',
					message: '查询出错',
					duration: 3000,
				})
			}
			this.loading = false
			if (resultData) {
				this.expandable = resultData.expandable //是否还有横向 1有，0没有
				if (actionType === 'new') {
					this.$refs.echartsRef.clearSelectPageParam()
					this.treeDatas = resultData
				} else if (actionType === 'next') {
					if (type === 'root') {
						this.$refs.echartsRef.clearSelectPageParam()
						this.treeDatas = resultData
					} else if (type === 'up' || type === 'down') {
						// 请求成功，更新选中节点数据
						this.$refs.echartsRef.updataSelectPageNum(nextData.pageNum)
						if (
							type === 'up' &&
							nextData.pageNum == 1 &&
							nextData.currentDepth == 1
						) {
							// 判断是否为根节点返回第一页
							this.treeDatas = resultData
							// this.treeDatas = resultData.kaBoardBOList[0]
						} else {
							// 根系节点数据
							this.spliceTreeNodeData(
								this.treeDatas,
								resultData.kaBoardBOList,
								idNodesChainKeysAry,
								type,
								nextData.pageNum
							)
							// this.treeDatas = JSON.parse(JSON.stringify(this.treeDatas))
							this.treeDatas = resultData
						}
					}
				}
			}
		},
		spliceTreeNodeData(
			targetData,
			newData,
			idNodesChainKeysAry,
			type,
			pageNum
		) {
			if (idNodesChainKeysAry.length > 1) {
				idNodesChainKeysAry.splice(0, 1)
				this.spliceTreeNodeData(
					targetData.kaBoardBOList[idNodesChainKeysAry[0]],
					newData,
					idNodesChainKeysAry,
					type,
					pageNum
				)
			} else if (idNodesChainKeysAry.length == 1) {
				targetData.kaBoardBOList = newData
				// 更新页码，需要自己维护页码
				targetData.pageNum = pageNum
			}
		},
		init() {
			if (this.$route.query.organizationId) {
				console.log('判断是否为新开查询')
				this.formData.organizationId = this.$route.query.rootOrganizationId
				this.formData.dataTime = this.$route.query.dataTime
				let nextData = {
					organizationId: this.$route.query.organizationId,
					currentDepth: Number(this.$route.query.currentDepth),
					pageNum: Number(this.$route.query.pageNum),
				}
				// 切换选中节点数据
				this.getData(nextData, 'root')
			}
		},
	},
	created() {
		// 判断是否为新开查询
		this.init()
	},
}
</script>

<style lang="scss"></style>

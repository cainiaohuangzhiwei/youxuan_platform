<template>
	<div class="setDepartment">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
				<template slot="departmentId">
					<el-select
						ref="departmentName"
						v-model="formData101.departmentName"
						placeholder="请选择"
					>
						<el-option :value="mineStatusValue" style="height: auto">
							<el-tree
								:data="departmentTree"
								node-key="departmentId"
								ref="tree"
								class="department-tree"
								highlight-current
								:expand-on-click-node="false"
								:props="defaultProps"
								@node-click="handleNodeClick"
							></el-tree>
						</el-option>
					</el-select>
				</template>
			</yx-form>
			<div class="goods-group-btn-box">
				<el-button
					@click="batchHandleClerk(1)"
					v-auth="'batchOperateClerkList'"
					type="primary"
					>批量启用</el-button
				>
				<el-button
					v-auth="'batchOperateClerkList'"
					@click="batchHandleClerk(2)"
					type="primary"
					>批量禁用</el-button
				>
				<el-button
					class="hide-btn"
					@click="_refreshPayTypeWeightCache"
					type="primary"
					>刷新支付权重</el-button
				>
				<el-button v-auth="'addClerk'" @click="addClerk" type="primary"
					>新增员工</el-button
				>
			</div>
			<yx-table
				:select="true"
				v-loading="loading"
				:selectionChange="selectionChange"
				:columns="tableColumns102"
				:pagination="page102"
				:data="tableData102"
			></yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getDepartmentList } from '@/api/department'
import { getClerkListByCondition, batchOperateClerkList } from '@/api/clerk'
import { refreshPayTypeWeightCache } from '@/api/yuntongPay'
import { resetOtpSecretKey } from '@/api/webUser.js'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	props: [],
	data() {
		return {
			mineStatusValue: [],
			loading: false,
			formData101: {
				userState: 0,
				keyword: '',
				departmentId: '',
				departmentName: '全部部门',
			},
			formCfg101: [
				{
					type: 'select',
					title: '状态',
					dataIndex: 'userState',
					label: 'value',
					change: () => {
						this.init(true)
					},
					options: [
						{
							value: '全部',
							userState: 0,
						},
						{
							userState: 1,
							value: '正常',
						},
						{
							userState: 2,
							value: '禁用',
						},
					],
				},
				{
					type: 'custom',
					title: '部门',
					dataIndex: 'departmentId',
				},
				{
					type: 'input',
					title: '',
					dataIndex: 'keyword',
					placeholder: '用户名 / 姓名 / 手机',
				},
			],
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					yapiId: '',
					token: '',
					dialogId: '',
					click: () => {
						this.init(true)
					},
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					dataIndex: 'userId',
					title: '用户ID',
				},
				{
					type: 'string',
					dataIndex: 'userName',
					title: '用户名',
				},
				{
					type: 'string',
					dataIndex: 'clerkName',
					title: '昵称',
				},
				{
					type: 'string',
					dataIndex: 'realName',
					title: '真实姓名',
				},
				{
					type: 'string',
					dataIndex: 'position',
					title: '职位',
				},
				{
					type: 'string',
					dataIndex: 'departmentName',
					title: '部门',
				},
				{
					type: 'string',
					dataIndex: 'phoneMob',
					title: '手机',
				},
				{
					type: 'string',
					dataIndex: 'roleName',
					title: '角色名称',
				},
				{
					type: 'string',
					dataIndex: 'email',
					title: 'Email',
				},
				{
					type: 'newMap',
					dataIndex: 'userState',
					title: '状态',
					options: [
						['1', '正常'],
						['2', '禁用'],
					],
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '重置MFA',
							auth: 'resetOtpSecretKeyOther',
							click: ({ userId }) => {
								this.$confirm(
									'确认后，将该员工置为从未登录。该员工重新登录时，需要走首次登录流程?',
									'提示',
									{
										type: 'warning',
										callback: async (action) => {
											if (action === 'confirm') {
												const {
													data: { resultCode },
												} = await resetOtpSecretKey({ userIdForOtp: userId })
												if (resultCode == 0) {
													this.$message.success('重置成功')
												}
											}
										},
									}
								)
							},
						},
						{
							title: '编辑',
							auth: 'updateClerkByClerkId',
							dialogId: '',
							click: ({ clerkId }) => {
								this.$router.push({
									path: `/set/setStaffAdd/${clerkId}`,
								})
							},
							customRender: (action, row) => {
								action.hide = row.userState == 2
								return action
							},
						},
						{
							title: '禁用',
							auth: 'batchOperateClerkList',
							popconfirm: true,
							popconfirmTitle: '确认要删除该分组吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._batchOperateClerkList(
									[row.userId],
									row.userState == 1 ? 2 : 1
								)
							},
							customRender: (action, row) => {
								action.popconfirmTitle = `是否${
									row.userState == 1 ? '禁用' : '启用'
								}员工  ${row.clerkName}`
								action.title = row.userState == 1 ? '禁用' : '启用'
								return action
							},
						},
					],
				},
			],
			page102: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			departmentTree: [],
			selectedList: [],
			defaultProps: {
				children: 'childDepartmentList',
				label: 'departmentName',
			},
			isShow: false,
		}
	},

	methods: {
		addClerk() {
			this.$router.push({
				path: '/set/setStaffAdd',
			})
		},
		_refreshPayTypeWeightCache: async function () {
			let {
				data: { resultCode, resultData },
			} = await refreshPayTypeWeightCache()
			if (resultCode == 0) {
				let resultMsg = resultData.join('，')
				if (resultMsg) {
					this.$message.success(resultMsg)
				}
			}
		},
		selectionChange(list) {
			this.selectedList = list
		},
		batchHandleClerk(operateType) {
			console.log(operateType, this.selectedList)
			if (!this.selectedList.length) {
				return this.$message.warning('请选择员工')
			}
			let userIdList = this.selectedList.map((item) => {
				return item.userId
			})
			let _titleText
			if (operateType == 1) {
				_titleText = '启用'
			} else if (operateType == 2) {
				_titleText = '禁用'
			}
			this.$confirm(
				`是否${_titleText}${userIdList.length}名员工`,
				`批量${_titleText}`,
				{
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							this._batchOperateClerkList(userIdList, operateType)
						}
					},
				}
			)
		},
		// 开启禁用员工
		_batchOperateClerkList: async function (userIdList, operateType) {
			let {
				data: { resultCode, resultMsg },
			} = await batchOperateClerkList({ userIdList, operateType })
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.init()
			}
		},
		// 获取部门
		_getDepartmentList: async function () {
			let {
				data: { resultCode, resultData },
			} = await getDepartmentList()
			if (resultCode == 0) {
				this.departmentTree = [
					{
						departmentId: '',
						departmentName: '全部部门',
					},
				]
				this.departmentTree.push(...resultData.departmentTree)
			}
		},
		handleNodeClick(data) {
			this.formData101.departmentId = data.departmentId
			this.formData101.departmentName = data.departmentName
			this.$refs.departmentName.blur()
			this.init(true)
		},
		async init(flag) {
			if (!this.departmentTree.length) {
				this._getDepartmentList()
			}
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			const {
				data: { resultCode, resultData },
			} = await getClerkListByCondition(paramJson)
			if (resultCode == 0) {
				this.isShow = true
				this.tableData102 = resultData.clerkList
				this.page102.count = resultData.clerkCount
			} else {
				this.tableData102 = []
				this.page102.count = 0
			}
			this.loading = false
		},
		findSearchParams102(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			const paramJson = Object.assign(this.formData101, {
				length: this.page102.length,
				startIndex: (this.page102.currentPage - 1) * this.page102.length,
			})
			return paramJson
		},
	},
}
</script>
<style scoped>
.content {
	color: red;
	margin-top: -22px;
}
.department-tree {
	margin: 0 -20px;
}
.goods-group-btn-box {
	margin-bottom: 20px;
}
.hide-btn {
	display: none;
}
</style>

<template>
	<div>
		<el-dialog
			width="600px"
			:title="this.newSceneRow.authAccountId ? '编辑账号' : '新增账号'"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="账号名称" prop="userName">
					<el-input
						v-model="form.userName"
						style="width: 400px"
						maxlength="128"
					></el-input>
				</el-form-item>
				<el-form-item label="账号类型" prop="accountType">
					<el-radio-group v-model="form.accountType">
						<el-radio
							v-for="item in accountTypeList"
							:label="item.key"
							:key="item.key"
							>{{ item.value }}</el-radio
						>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div v-if="form.accountType == 1" class="auth-account">
				<h4>商城场景权限明细</h4>
				<el-row>
					<yx-table
						v-loading="showLoading"
						:columns="tableColumns"
						:pagination="page"
						:data="tableData"
					>
						<template slot="operationType" slot-scope="scope">
							<el-checkbox-group
								v-model="scope.row.operationType"
								@change="(val, data) => handleCheckedChange(val, scope.row)"
							>
								<el-checkbox :label="'1'">编辑</el-checkbox>
								<el-checkbox :label="'2'">审核</el-checkbox>
							</el-checkbox-group>
						</template>
					</yx-table>
				</el-row>
			</div>
			<el-row class="btn-group">
				<el-button @click="handleCancel">取消</el-button>
				<el-button type="primary" @click="submitForm">保存</el-button>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
import {
	getRcShopSceneList,
	getRcAuthAccountById,
	addRcAuthAccount,
	updateRcAuthAccountById,
} from '@/api/trafficRules'
import YxTable from '@wg-vue-materials/yx-table'
export default {
	props: {
		visible: {
			type: Boolean,
			define: false,
		},
		newSceneRow: {
			define: false,
			default: () => {},
		},
	},

	components: { YxTable },

	data() {
		return {
			form: {
				userName: '', //账号名称
				accountType: '', //账号类型
			},
			rules: {
				sceneName: [
					{
						required: true,
						message: '请输入场景名称',
						trigger: ['blur', 'change'],
					},
				],
				testId: [
					{
						required: true,
						message: '分流父ID',
						trigger: ['blur', 'change'],
					},
				],
				pageName: [
					{
						required: true,
						message: '页面名称',
						trigger: ['blur', 'change'],
					},
				],
			},
			//账号类型
			accountTypeList: [
				{
					key: 1,
					value: '普通账号',
				},
				{
					key: 2,
					value: '管理员',
				},
				{
					key: 3,
					value: '超级管理员',
				},
			],
			authorityList: [], //需要更新的商城场景权限明细
			showLoading: false,
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'shopSceneName',
				},
				{
					type: 'custom',
					dataIndex: 'operationType',
				},
			],
			tableData: [], //商城场景权限明细列表
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getRcShopSceneList()
				},
			},
		}
	},
	watch: {
		localVisible(val) {
			this.$refs.form && this.$refs.form.resetFields()
			if (val) {
				if (this.newSceneRow.authAccountId) {
					//编辑
					this.getRcAuthAccountById(this.newSceneRow.authAccountId) //根据ID查询权限账号信息
				} else {
					//新增
					this.getRcShopSceneList(true) //获取商城场景权限明细
					this.form.userName = ''
					this.form.accountType = 1
					this.authorityList = []
				}
			}
		},
	},
	computed: {
		localVisible: {
			get() {
				return this.visible
			},
			set(val) {
				this.$emit('update:visible', val)
			},
		},
	},

	methods: {
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},
		handleCancel() {
			this.localVisible = false
		},
		submitForm() {
			this.$refs['form'].validate(async (valid) => {
				if (valid) {
					if (this.newSceneRow.authAccountId) {
						this._updateRcAuthAccountById() //更新
					} else {
						this._addRcAuthAccount() //新增
					}
				}
			})
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = {
				pageNum: 0,
				pageSize: 1,
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
		//获取商城场景权限明细
		getRcShopSceneList: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let { data } = await getRcShopSceneList(paramJson)
			this.showLoading = false
			if (data.resultCode == 0) {
				this.tableData = data.resultData
				this.page.count = data.total
				//回显之前操作的数据
				this.tableData = this.tableData.map((row) => {
					let authorityItem = this.authorityList.find(
						(item) => item.objValue == row.shopSceneId
					)
					if (authorityItem?.objValue) {
						row.operationType = authorityItem.operationType
					} else {
						row.operationType = []
					}
					return row
				})
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		//根据ID查询权限账号信息【数据平台六期】
		getRcAuthAccountById: async function (authAccountId) {
			let { data } = await getRcAuthAccountById({ authAccountId })
			if (data.resultCode == 0) {
				this.rcAuthAccount = data.resultData //账户权限信息
				this.form.userName = this.rcAuthAccount.userName //账号名称
				this.form.accountType = this.rcAuthAccount.accountType //账号类型
				const rcAuthAccountDetailSaveDTOList =
					this.rcAuthAccount?.rcAuthAccountDetailSaveDTOList?.map((item) => {
						item.operationType = item.operationType.split(',')
						return item
					})
				this.authorityList = rcAuthAccountDetailSaveDTOList || [] //权限明细列表
				this.getRcShopSceneList(true) //获取商城场景权限明细
			} else {
				this.rcAuthAccount = {}
			}
		},
		//添加权限账号信息
		_addRcAuthAccount: async function () {
			const authorityList = this.authorityList?.map((item) => {
				let authorityItem = {}
				authorityItem.objType = 'SHOP_SCENE'
				authorityItem.objValue = item.objValue
				item.operationType = item.operationType.filter((x) => x)
				authorityItem.operationType = item.operationType?.join()
				return authorityItem
			})
			let paramJson = {
				accountType: this.form.accountType,
				userId: this.$store.state.user.userInfo.userId,
				addUser: this.$store.state.user.userInfo.userId,
				userName: this.form.userName,
			}
			if (this.form.accountType == 1) {
				paramJson.rcAuthAccountDetailSaveDTOList = authorityList
			}
			let { data } = await addRcAuthAccount(paramJson)
			if (data.resultCode == 0) {
				this.$message({
					message: '添加成功',
					type: 'success',
				})
				this.localVisible = false
				this.$emit('Refresh')
			}
		},
		//编辑权限账号信息
		_updateRcAuthAccountById: async function () {
			const authorityList = this.authorityList?.map((item) => {
				let authorityItem = {}
				authorityItem.objType = 'SHOP_SCENE'
				authorityItem.objValue = item.objValue
				item.operationType = item.operationType.filter((x) => x)
				authorityItem.operationType = item.operationType.join()
				authorityItem.authAccountDetailId = item.authAccountDetailId
				return authorityItem
			})
			let paramJson = {
				authAccountId: this.newSceneRow.authAccountId,
				accountType: this.form.accountType,
				userId: this.$store.state.user.userInfo.userId,
				updateUser: this.$store.state.user.userInfo.userId,
				userName: this.form.userName,
			}
			if (this.form.accountType == 1) {
				paramJson.rcAuthAccountDetailSaveDTOList = authorityList
			}
			let { data } = await updateRcAuthAccountById(paramJson)
			if (data.resultCode == 0) {
				this.$message({
					message: '编辑成功',
					type: 'success',
				})
				this.localVisible = false
				this.$emit('Refresh')
			}
		},
		//场景权限明细变更
		handleCheckedChange: async function (val, row) {
			let flag = false
			this.authorityList.forEach((item, index) => {
				if (item.objValue == row.shopSceneId) {
					this.authorityList[index].operationType = row.operationType
					flag = true
				}
			})
			if (!flag) {
				let authorityItem = {}
				authorityItem.objType = 'SHOP_SCENE'
				authorityItem.objValue = row.shopSceneId
				authorityItem.operationType = row.operationType
				this.authorityList.push(authorityItem)
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.auth-account {
	border-radius: 8px;
}
.btn-group {
	text-align: right;
}
</style>

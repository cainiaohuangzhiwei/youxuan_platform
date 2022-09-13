<template>
	<div class="permission_box">
		<p class="title">角色权限设置</p>
		<div class="box-rigth">
			<span>角色名称：</span>
			<div>
				<el-select
					@change="_getRoleFunctionListByRoleId"
					class="role-select"
					v-model="roleId"
					placeholder="请选择"
				>
					<el-option
						v-for="item in roleList"
						:key="item.roleId"
						:label="item.roleName"
						:value="item.roleId"
					>
					</el-option>
				</el-select>
				<el-button v-auth="'addRole'" @click="addRole" type="text"
					>新增角色</el-button
				>
				<el-button v-auth="'updateRoleByRoleId'" @click="showDialog" type="text"
					>修改角色名称</el-button
				>
				<el-button
					v-auth="'deleteRoleByRoleId'"
					@click="_deleteRoleByRoleId"
					type="text"
					>删除</el-button
				>
				<p>说明：</p>
				<p>1. 具备该角色的用户登录后显示操作员工作台</p>
				<p>2. 修改角色权限后，所有赋予此角色的员工账号对应权限均将修改</p>
				<p>3. 系统管理员、管理员角色不允许改名，也不允许修改其操作权限</p>
				<p>
					4. 其他权限为该角色的职责范围权限（包括：读取、修改、删除、转移客户)
				</p>
			</div>
		</div>
		<p class="title">
			<span>角色权限明细</span>
			<el-checkbox
				:indeterminate="isIndeterminate"
				@change="handleCheckAllChange"
				v-model="checkedAll"
				>全选</el-checkbox
			>
		</p>
		<template>
			<div
				v-loading="functionLoading"
				:class="[
					'function-item-list',
					item.collectionName && index != 0 ? 'border-item-top' : '',
				]"
				v-for="(item, index) in functionCollectionList"
				:key="index"
			>
				<span>{{ item.collectionName }}</span>
				<div class="function-item" :key="index">
					<el-checkbox-group
						@change="handleCheckedFunctionChange"
						v-model="item.checkedFunctionIdList"
					>
						<el-checkbox
							v-for="(cItem, cIndex) in item.functionList"
							:label="cItem.functionId"
							:key="cIndex"
							>{{ cItem.functionName }}</el-checkbox
						>
					</el-checkbox-group>
				</div>
			</div>
		</template>
		<Dialog
			:title="dialogTitle128"
			:visible.sync="dialogVisible128"
			:width="dialogWidth128"
			:bottomBtn="dialogBottomBtn128"
		>
			<yx-form
				ref="dialog126"
				labelWidth="100px"
				:data="formData126"
				:items="formCfg126"
			>
			</yx-form>
		</Dialog>
		<!-- <div class="save_button" v-auth="'updateRoleFunctionListByRoleId'">
			<el-button type="primary" @click="_updateRoleFunctionListByRoleId"
				>保存</el-button
			>
		</div> -->
	</div>

	<!-- <div class="permission-box">
		<div class="role-list">
			<div
				:class="['role-item', item.roleId == roleId ? 'is-checked' : '']"
				v-for="(item, index) in roleList"
				:key="index"
			>
				<p class="title">{{ item.roleName }}</p>
				<div class="btn-box">
					<el-button type="text" icon="el-icon-edit"></el-button>
					<el-button type="text" icon="el-icon-delete"></el-button>
				</div>
			</div>
		</div>
		<div class="function-list" v-loading="functionLoading">
			<template v-for="(item, index) in functionCollectionList">
				<div
					:class="['function-title', item.collectionName ? 'border-item' : '']"
					:key="index"
				>
					<span>{{ item.collectionName }}</span>
				</div>
				<div class="function-item" :key="index">
					<el-checkbox-group v-model="item.checkedFunctionIdList">
						<el-checkbox
							v-for="(cItem, cIndex) in item.functionList"
							:label="cItem.functionId"
							:key="cIndex"
							>{{ cItem.functionName }}</el-checkbox
						>
					</el-checkbox-group>
				</div>
			</template>
		</div>
	</div> -->
</template>

<script>
import {
	getRoleList,
	getRoleFunctionListByRoleId,
	updateRoleFunctionListByRoleId,
	deleteRoleByRoleId,
	updateRoleByRoleId,
	addRole,
} from '@/api/privilege'
import Dialog from '@/components/Dialog'
import YxForm from '@wg-vue-materials/yx-form'
import { isNull } from '@/utils/helper/common'
export default {
	components: {
		Dialog,
		YxForm,
	},
	data() {
		return {
			dialogTitle128: '修改角色名称',
			dialogVisible128: false,
			dialogWidth128: '400px',
			dialogBottomBtn128: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this._updateRoleByRoleId()
					},
				},
			],
			formData126: {},
			formCfg126: [
				{
					type: 'input',
					title: '角色名称',
					dataIndex: 'roleName',
				},
			],
			checkedAll: false,
			isIndeterminate: false,
			roleList: [],
			functionCollectionList: [],
			functionLoading: false,
			isShow: false,
			roleId: null,
		}
	},
	created() {
		this.init(true)
	},
	methods: {
		// 添加角色
		addRole() {
			this.dialogTitle128 = '添加角色'
			this.formData126 = {
				roleName: '',
				roleId: null,
			}
			this.dialogVisible128 = true
		},
		// 修改角色名称
		showDialog() {
			let index = this.roleList.findIndex((item) => {
				return item.roleId == this.roleId
			})
			this.dialogTitle128 = '修改角色名称'
			this.formData126 = JSON.parse(JSON.stringify(this.roleList[index]))
			this.dialogVisible128 = true
		},
		// 修改角色名称
		_updateRoleByRoleId: async function () {
			if (!this.formData126.roleName) {
				this.$message.warning('请输入角色名称')
				return
			}
			if (this.formData126.roleId == null) {
				let {
					data: { resultCode, resultMsg },
				} = await addRole({
					roleName: this.formData126.roleName,
					roleId: this.formData126.roleId,
				})
				if (resultCode == 0) {
					this.$message.success(resultMsg)
					this.dialogVisible128 = false
					this.init(false)
				}
			} else {
				let {
					data: { resultCode, resultMsg },
				} = await updateRoleByRoleId({
					roleName: this.formData126.roleName,
					roleId: this.formData126.roleId,
				})
				if (resultCode == 0) {
					let index = this.roleList.findIndex((item) => {
						return item.roleId == this.roleId
					})
					this.roleList[index].roleName = this.formData126.roleName
					this.$message.success(resultMsg)
					this.dialogVisible128 = false
				}
			}
		},
		// 删除角色
		_deleteRoleByRoleId: async function () {
			this.$confirm(`是否删除该角色`, '删除角色', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						let {
							data: { resultMsg, resultCode },
						} = await deleteRoleByRoleId({
							roleId: this.roleId,
						})
						if (resultCode == 0) {
							let index = this.roleList.findIndex((item) => {
								return item.roleId == this.roleId
							})
							this.roleList.splice(index, 1)
							this.roleId = this.roleList[0].roleId
							this.$message.success(resultMsg)
							this._getRoleFunctionListByRoleId()
						}
					}
				},
			})
		},
		// 获取角色列表
		init: async function (flag) {
			let {
				data: { resultCode, resultData },
			} = await getRoleList()
			if (resultCode == 0) {
				this.isShow = true
				this.roleList = resultData.roleList || []
				if (flag) {
					this.roleId =
						resultData.roleList &&
						resultData.roleList[0] &&
						resultData.roleList[0].roleId
					// this._getRoleFunctionListByRoleId()
				}
			}
		},
		// 保存当前编辑角色权限
		_updateRoleFunctionListByRoleId: async function () {
			if (this.functionLoading) {
				return
			}
			let functionIdList = []
			this.functionCollectionList.map((item) => {
				functionIdList.push(...item.checkedFunctionIdList)
			})
			if (!functionIdList.length) {
				this.$message.warning('请勾选角色权限')
				return
			}
			this.functionLoading = true
			let {
				data: { resultCode, resultMsg },
			} = await updateRoleFunctionListByRoleId({
				roleId: this.roleId,
				functionIdList,
			})
			this.functionLoading = false
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this._getRoleFunctionListByRoleId()
			}
		},
		handleCheckedFunctionChange() {
			let checkedAll = true
			let isIndeterminate = false
			this.functionCollectionList.map((item) => {
				if (
					!item.checkedFunctionIdList.length ||
					item.checkedFunctionIdList.length != item.allIdList.length
				) {
					checkedAll = false
				}
				if (
					item.checkedFunctionIdList.length &&
					item.checkedFunctionIdList.length != item.allIdList.length
				) {
					isIndeterminate = true
				}
			})
			this.checkedAll = checkedAll
			this.isIndeterminate = checkedAll ? false : isIndeterminate
		},
		// 全选
		handleCheckAllChange(val) {
			this.functionCollectionList.map((item) => {
				item.checkedFunctionIdList = val ? item.allIdList : []
			})
			this.isIndeterminate = false
		},
		// 获取当前角色权限
		_getRoleFunctionListByRoleId: async function () {
			this.functionLoading = true
			let {
				data: { resultCode, resultData },
			} = await getRoleFunctionListByRoleId({ roleId: this.roleId })
			if (resultCode == 0) {
				let functionCollectionList = resultData.functionCollectionList || []
				let checkedAll = true
				let isIndeterminate = false
				let newFunctionCollectionList = []
				functionCollectionList.forEach((item) => {
					if (!isNull(item) && !isNull(item.collectionName)) {
						newFunctionCollectionList.push(item)
					}
				})
				newFunctionCollectionList.forEach((item) => {
					let checkedFunctionIdList = []
					let allIdList = []
					item.functionList.forEach((code) => {
						code.switch = code.roleFunctionId > 0
						allIdList.push(code.functionId)
						if (code.roleFunctionId > 0) {
							checkedFunctionIdList.push(code.functionId)
						} else {
							checkedAll = false
						}
					})
					if (
						checkedFunctionIdList.length &&
						checkedFunctionIdList.length != item.functionList.length
					) {
						isIndeterminate = true
					}
					item.allIdList = allIdList
					item.checkedFunctionIdList = checkedFunctionIdList
					item.switch = checkedFunctionIdList.length == item.functionList.length
				})
				this.checkedAll = checkedAll
				this.isIndeterminate = isIndeterminate
				this.functionCollectionList = newFunctionCollectionList
				this.functionLoading = false
			}
		},
	},
}
</script>

<style>
.permission-box .el-checkbox {
	margin-bottom: 20px;
	width: 300px;
}
.permission-box .el-checkbox-group {
	column-count: 4;
}
.permission_box .el-checkbox {
	margin-bottom: 20px;
	width: 300px;
	display: inline-block;
}
</style>
<style lang="scss" scoped>
.permission_box {
	padding-bottom: 40px;
	.title {
		font-size: 16px;
		font-weight: 800;
		span {
			margin-right: 60px;
		}
	}
	.role-select {
		margin-right: 20px;
	}
	.box-rigth {
		display: flex;
		padding-left: 30px;
	}
	.function-item-list {
		display: flex;
		padding-left: 30px;
		margin-bottom: 10px;
		span {
			width: 130px;
			box-sizing: border-box;
			// padding: 0 40px 0 20px;
			// text-align: right;
		}
		.function-item {
			flex: 1;
		}
	}
}
.permission-box {
	display: flex;
}
.role-list {
	width: 240px;
	overflow-y: scroll;
	height: 76vh;
	box-sizing: border-box;
	border-right: 1px solid #eee;
}
.role-item.is-checked {
	background-color: #dcdfe6;
}
.role-item {
	display: flex;
	align-items: center;
	border-bottom: 1px solid #eee;
	padding: 10px;

	.title {
		width: 160px;
		font-size: 14px;
	}
	.btn-box {
		flex: 1;
		padding-right: 10px;
	}
}
.function-list {
	flex: 1;
	box-sizing: border-box;
	padding: 0 20px;
	overflow-y: scroll;
	height: 76vh;
	.function-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 0;
		margin-bottom: 20px;
		span {
			font-size: 18px;
		}
	}
	.border-item {
		border-bottom: 1px solid #eee;
	}
}
.border-item-top {
	border-top: 1px solid #eee;
	padding-top: 20px;
}
.save_button {
	width: 100vw;
	padding: 20px 0px 20px 50px;
	z-index: 120;
	margin-left: -20px;
	box-sizing: border-box;
	position: fixed;
	bottom: 0px;
	background: rgba(0, 0, 0, 0.3);
}
</style>

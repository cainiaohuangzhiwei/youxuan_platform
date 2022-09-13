<template>
	<basic-container>
		<div style="margin-bottom: 60px">
			修改店主ID：
			<el-input
				class="wi mb20"
				v-model="shopId1"
				type="number"
				placeholder="请输入内容"
			></el-input>
			<el-button
				class="ml20"
				type="primary"
				@click="_oredrListManagerSettleItem"
				>查询</el-button
			>
			<yx-table
				v-loading="showLoading"
				:columns="tableColumns"
				:data="tableData"
			>
			</yx-table>
		</div>
		<div style="margin-bottom: 60px">
			更改为直属上级ID：
			<el-input
				class="wi mb20"
				v-model="shopId2"
				type="number"
				placeholder="请输入内容"
			></el-input>
			<el-button
				class="ml20"
				type="primary"
				@click="_oredrListManagerSettleItemDirectly"
				>查询</el-button
			>
			<yx-table
				v-loading="showLoadingDirectly"
				:columns="tableColumnsdirectly"
				:data="tableDatadirectly"
			>
			</yx-table>
		</div>
		<label class="ml20" style="color: #ff4949">*</label>
		备注：
		<el-input
			class="wi"
			type="textarea"
			:autosize="{ minRows: 2, maxRows: 4 }"
			placeholder="请输入内容"
			maxlength="30"
			show-word-limit
			v-model="textarea"
		>
		</el-input>
		<div class="distance">
			<el-button
				type="info"
				@click="
					$router.push({
						name: 'changeOwnerSuperior',
					})
				"
				>取消</el-button
			>
			<el-button type="primary" @click="getRelationApply">确定</el-button>
		</div>
		<Dialog
			:visible.sync="dialogVisible"
			width="500px"
			:bottomBtn="deleteBottomBtn"
		>
			<div v-if="rowData">
				<h4>店主ID：{{ rowData.orgId }}</h4>
				<h4>店主名称：{{ rowData.orgName }}</h4>
				<h4 style="color: #ff4949">
					当前裂变关系链下店主数量：{{ shopNumber }}
				</h4>
				<h4 style="color: #ff4949">
					原上级ID：{{ rowData.fatherId }} 更换为上级ID：{{
						rowDatadirectly.orgId
					}}
				</h4>
				<h4>
					请仔细核实确认是否更改，确认后次日生效，生效后的订单收益会按照最新的关系进行计算
				</h4>
			</div>
		</Dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import { numberFormat } from '@/utils/helper/common'
import Dialog from '@/components/Dialog'

import YxTable from '@wg-vue-materials/yx-table'
import {
	relationGetOrg,
	relationTeamCount,
	relationcreate,
} from '@/api/relation'

export default {
	name: 'ShopPlatformRewardList',
	components: {
		BasicContainer,
		YxTable,
		Dialog,
	},

	data() {
		return {
			numberFormat: numberFormat,
			showLoading: false,
			showLoadingDirectly: false,
			dialogVisible: false,
			shopId1: '',
			shopId2: '',
			shopNumber: null,
			textarea: '',
			rowData: {},
			rowDatadirectly: {},
			tableData: [],
			tableDatadirectly: [],
			deleteBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this._relationcreate()
					},
				},
			],
			tableColumnsdirectly: [
				{
					type: 'string',
					dataIndex: 'orgId',
					title: '店主ID',
				},
				{
					type: 'string',
					dataIndex: 'orgName',
					title: '店主名称',
				},
				{
					type: 'string',
					dataIndex: 'phone',
					title: '手机号',
				},
			],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'orgId',
					title: '店主ID',
				},
				{
					type: 'string',
					dataIndex: 'orgName',
					title: '店主名称',
				},
				{
					type: 'string',
					dataIndex: 'phone',
					title: '手机号',
				},
				{
					type: 'string',
					dataIndex: 'fatherId',
					title: '上级店主ID',
				},
				{
					type: 'string',
					dataIndex: 'fatherName',
					title: '上级店主名称',
				},
				{
					type: 'string',
					dataIndex: 'fatherPhone',
					title: '上级手机号',
				},
			],
		}
	},

	created() {
		// this._listPageOrderSettleItem(true)
		// this._organizationSettleCollectAmount()
	},

	methods: {
		_relationcreate: async function () {
			if (!this.rowData.orgId || !this.rowDatadirectly.orgId) {
				return this.$message.warning('请先查询需要更改的店主信息')
			}
			let {
				data: { resultCode },
			} = await relationcreate({
				addUser: this.$store.state.user.userInfo.clerkName,
				newFatherId: this.rowDatadirectly.orgId,
				orgId: this.rowData.orgId,
				remark: this.textarea,
			})
			if (resultCode == 0) {
				this.$message.success('操作成功')
				this.$router.push({
					name: 'changeOwnerSuperior',
				})
			}
		},

		getRelationApply: async function () {
			if (!this.rowData.orgId || !this.rowDatadirectly.orgId) {
				return this.$message.warning('请先查询需要更改的店主信息')
			}
			if (!this.textarea) {
				return this.$message.warning('请填写备注')
			}
			this.dialogVisible = true
			let {
				data: { resultCode, resultData },
			} = await relationTeamCount({
				orgId: this.shopId1,
			})
			if (resultCode == 0) {
				this.shopNumber = resultData
			}
		},

		isNumber(val) {
			val = val.replace(/[^0-9]/gi, '')
			// 此处还可以限制位数以及大小
			return val
		},
		_oredrListManagerSettleItemDirectly: async function () {
			let paramJson = {
				orgId: this.shopId2,
			}
			if (
				(paramJson.orgId && !this.isNumber(paramJson.orgId)) ||
				!paramJson.orgId
			) {
				return this.$message.warning('输入店主ID格式有误')
			}
			if (paramJson.orgId.length > 10) {
				return this.$message.warning('店主ID长度不可大于10位')
			}
			this.showLoadingDirectly = true
			let {
				data: { resultCode, resultData },
			} = await relationGetOrg(paramJson)
			this.showLoadingDirectly = false
			if (resultCode == 0) {
				this.tableDatadirectly = resultData ? [resultData] : []
				this.rowDatadirectly = resultData
			} else {
				this.tableDatadirectly = []
				this.rowDatadirectly = {}
			}
		},
		_oredrListManagerSettleItem: async function () {
			let paramJson = {
				orgId: this.shopId1,
			}
			if (
				(paramJson.orgId && !this.isNumber(paramJson.orgId)) ||
				!paramJson.orgId
			) {
				return this.$message.warning('输入店主ID格式有误')
			}
			if (paramJson.orgId.length > 10) {
				return this.$message.warning('店主ID长度不可大于10位')
			}
			paramJson.queryFather = true
			this.showLoading == true
			let {
				data: { resultCode, resultData },
			} = await relationGetOrg(paramJson)
			this.showLoading == false
			if (resultCode == 0) {
				this.tableData = resultData ? [resultData] : []
				this.rowData = resultData
			} else {
				this.tableData = []
				this.rowData = {}
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.wi {
	width: 300px;
}
.mb20 {
	margin-bottom: 20px;
}
.ml20 {
	margin-left: 20px;
}
.distance {
	margin-top: 100px;
	margin-left: 500px;
}
</style>

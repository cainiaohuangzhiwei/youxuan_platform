<template>
	<basic-container>
		<!-- <div>店主身份提现路由</div>
		<div
			class="box"
			v-for="(withdrawalConfigDetailVo, i) in withdrawalConfigDetailVoList"
			:key="i"
		>
			<div class="item" v-for="(item, index) in shopIdentity" :key="index">
				<span class="data-item">{{ item.title }}</span>
				<span class="data-item" v-if="!item.click">{{
					item.isString
						? withdrawalConfigDetailVo[item.data]
						: withdrawalConfigDetailVo[item.data] == 1
						? '是'
						: '否'
				}}</span>
				<el-button
					class="data-item"
					v-else
					v-auth="item.auth"
					@click="item.click(withdrawalConfigDetailVo)"
					type="text"
					>{{ item.data }}</el-button
				>
			</div>
		</div> -->
		<div class="title">限额提现路由</div>
		<div
			class="box"
			v-for="(withdrawalConfigDetailVo, i) in withdrawalConfigDetailVoList"
			:key="i"
		>
			<div class="item" v-for="(item, index) in withdrawalLimit" :key="index">
				<span class="data-item">{{ item.title }}</span>
				<span class="data-item" v-if="!item.click && item.amount">{{
					numberFormat(withdrawalConfigDetailVo[item.amount], 2, '.', ',')
				}}</span>
				<span class="data-item" v-else-if="!item.click && item.data">{{
					withdrawalConfigDetailVo[item.data]
				}}</span>
				<el-button
					class="data-item"
					v-else
					v-auth="item.auth"
					@click="item.click(withdrawalConfigDetailVo)"
					type="text"
					>{{ item.data }}</el-button
				>
			</div>
		</div>
		<!-- 操作记录 -->
		<operationRecord
			:objects="objects"
			:dialogVisible.sync="dialogVisible"
		></operationRecord>
		<!-- 编辑提现路由 -->
		<editRoute
			:withdrawalConfigDetailVo="withdrawalConfigDetailVo"
			:dialogVisible.sync="editRouteVisible"
			@updateWithdrawalConfig="_getWithdrawalConfig"
		></editRoute>
		<!-- 编辑可用额度 -->
		<editLimit
			:withdrawalConfigDetailVo="withdrawalConfigDetailVo"
			:dialogVisible.sync="editLimitVisible"
			@updateWithdrawalConfig="_getWithdrawalConfig"
		></editLimit>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import operationRecord from './components/operationRecord'
import editRoute from './components/editRoute'
import editLimit from './components/editLimit'
import { getWithdrawalConfig } from '@/api/withdrawalConfig'
import { numberFormat } from '@/utils/helper/common'

export default {
	components: {
		BasicContainer,
		operationRecord,
		editRoute,
		editLimit,
	},
	name: 'FormTable',

	data() {
		return {
			numberFormat: numberFormat,
			objects: 'updateOrgWithdrawalConfig',
			withdrawalConfigDetailVoList: [],
			withdrawalConfigDetailVo: {},
			withdrawalLimit: [
				// 限额提现路由
				{
					title: '限额路由',
					data: 'limitRoute',
				},
				{
					title: '可用限额',
					amount: 'useAmount',
				},
				{
					title: '冻结',
					amount: 'lockAmount',
				},
				{
					title: '操作',
					data: '编辑',
					auth: 'updateAmountWithdrawalConfig',
					click: (withdrawalConfigDetailVo) => {
						this.editLimitVisible = true
						this.withdrawalConfigDetailVo = withdrawalConfigDetailVo
					},
				},
				{
					title: '操作记录',
					data: '操作记录',
					auth: 'operationalLogsList',
					click: (withdrawalConfigDetailVo) => {
						this.shoWoperationRecord('updateAmount', withdrawalConfigDetailVo)
					},
				},
			],
			shopIdentity: [
				// 店主身份提现路由
				{
					title: '店主身份路由',
					data: 'organizationRoute',
					isString: true,
				},
				{
					title: '普通店主',
					data: 'ordinaryOrganization',
				},
				{
					title: 'vip店主',
					data: 'vipOrganization',
				},
				{
					title: '服务商',
					data: 'serviceOrganization',
				},
				{
					title: '操作',
					data: '编辑',
					auth: 'updateOrgWithdrawalConfig',
					click: (withdrawalConfigDetailVo) => {
						this.editIdentity(withdrawalConfigDetailVo)
					},
				},
				{
					title: '操作记录',
					data: '操作记录',
					auth: 'operationalLogsList',
					click: (withdrawalConfigDetailVo) => {
						this.shoWoperationRecord('updateOrg', withdrawalConfigDetailVo)
					},
				},
			],
			editLimitVisible: false, // 编辑限额开关
			editRouteVisible: false, // 编辑提现路由开关
			dialogVisible: false, // 操作记录弹框
			withdrawData: {}, // 提现信息
		}
	},
	watch: {
		$route: {
			immediate: true,
			deep: true,
			handler(newValue) {
				if (newValue.name == 'ConfigureWithdrawalRouting') {
					this._getWithdrawalConfig()
				}
			},
		},
	},

	methods: {
		shoWoperationRecord(objects, withdrawalConfigDetailVo) {
			// 显示操作记录弹框
			this.objects = objects
			this.withdrawalConfigDetailVo = withdrawalConfigDetailVo
			this.dialogVisible = true
		},
		editIdentity(withdrawalConfigDetailVo) {
			// 显示店主路由编辑弹框
			this.editRouteVisible = true
			this.withdrawalConfigDetailVo = withdrawalConfigDetailVo
		},
		_getWithdrawalConfig: async function () {
			// 获取提现路由配置
			let {
				data: { resultCode, resultData },
			} = await getWithdrawalConfig()
			if (resultCode == 0) {
				this.withdrawalConfigDetailVoList =
					resultData.withdrawalConfigDetailVoList
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.box {
	display: flex;
	justify-content: space-around;
	border: 1px solid #ddd;
	margin-top: 20px;
	.item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		.data-item {
			width: 100%;
			height: 50px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.data-item:nth-child(1) {
			border-bottom: 1px solid #ddd;
		}
	}
	.item:nth-child(n + 2) {
		border-left: 1px solid #ddd;
	}
}
.title {
	// margin-top: 50px;
}
</style>

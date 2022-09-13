<template>
	<div class="shopStatistics">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
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
import { receiveCouponRecord } from '@/api/yhtPlusCoupon'
import moment from 'moment'

export default {
	components: { BasicContainer, YxForm, YxTable },
	props: {
		params: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			loading: false,
			formData101: {
				keyword: '',
				startTime: '',
				endTime: '',
				userType: '',
			},
			formCfg101: [
				{
					type: 'input',
					dataIndex: 'keyword',
					title: '关键词',
					placeholder: '用户ID/领取人名称/赠送人名称/优惠券发放员工',
				},
				{
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					title: '领取时间',
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
				{
					title: '用户身份',
					type: 'select',
					dataIndex: 'userType',
					placeholder: '请选择用户身份',
					label: 'value',
					options: [
						{
							value: '全部',
							userType: '',
						},
						{
							value: '小c',
							userType: 0,
						},
						{
							value: '小b',
							userType: 1,
						},
					],
				},
			],
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (!this.loading) this.init(true)
					},
					tableId: 102,
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					dataIndex: 'userId',
					title: '用户Id',
				},
				{
					type: 'string',
					dataIndex: 'userName',
					title: '领取人名称',
					customRender: ({ currentOrgName, userName }) => {
						return currentOrgName ? currentOrgName : userName
					},
				},
				{
					type: 'string',
					dataIndex: 'providerName',
					title: '赠送人名称',
					customRender: ({ proOrgName, providerName }) => {
						return proOrgName ? proOrgName : providerName
					},
				},
				{
					type: 'string',
					dataIndex: 'grantTime',
					title: '派发时间',
					customRender: ({ sourceType, addTime }) => {
						if (sourceType == 4) {
							return moment(addTime).format('YYYY-MM-DD HH:mm:ss')
						} else {
							return '-'
						}
					},
				},
				{
					type: 'date',
					dataIndex: 'grantTime',
					title: '领取时间',
				},
				{
					type: 'newMap',
					dataIndex: 'userType',
					title: '用户身份',
					options: [
						['0', '小c'],
						['1', '小b'],
					],
				},
				{
					type: 'newMap',
					dataIndex: 'sourceType',
					title: '优惠券来源',
					options: [
						['1', '领券中心'],
						['2', '兑换优惠券'],
						['3', '领券中心'],
						['4', '系统派发'],
						['5', '直播领券中心'],
						['6', '礼包系统'],
						['7', '订单补偿'],
						['8', '其他'],
						['9', '新店主领取专区'],
						['10', '鲁班系统'],
						['11', '养鱼签到活动'],
						['12', '策略中心'],
						['15', '新人优惠券活动'],
						['16', 'AKC优惠券'],
						['17', '用户运营中台'],
						['18', '销售活动派发'],
					],
				},
				{
					type: 'string',
					dataIndex: 'sourceType',
					title: '优惠券来源备注',
					customRender: ({
						sourceType,
						operateUserName,
						giftShareName,
						sourceDescribe,
					}) => {
						if (
							sourceType == 1 ||
							sourceType == 3 ||
							sourceType == 5 ||
							sourceType == 9 ||
							sourceType == 2 ||
							sourceType == 8
						) {
							return '-'
						} else if (sourceType == 4 || sourceType == 7) {
							return operateUserName
						} else if (sourceType == 6) {
							return giftShareName
						} else if (sourceType === 18) {
							return sourceDescribe || '-'
						} else {
							return '-'
						}
					},
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
		}
	},

	methods: {
		tableColumnHide(give) {
			this.tableColumns102.map((item) => {
				if (item.dataIndex == 'providerName') {
					item.hide = give != 0 ? false : true
				}
			})
		},
		async init(flag) {
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			const {
				data: { resultCode, resultData },
			} = await receiveCouponRecord(paramJson)
			if (resultCode == 0) {
				this.tableData102 = resultData.userYxCouponList
				this.page102.count = resultData.count
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
				yxCouponId: this.params.yxCouponId,
				startIndex: (this.page102.currentPage - 1) * this.page102.length,
			})
			return paramJson
		},
	},
}
</script>

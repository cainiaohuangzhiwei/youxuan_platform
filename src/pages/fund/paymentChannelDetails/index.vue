<template>
	<basic-container>
		<yx-form
			:inline="true"
			:data="searchData"
			:items="searchCfg"
			:formAction="searchAction"
		>
			<template slot="datetimerBtn">
				<el-button type="text" @click="setDatetimerange(1)">昨天</el-button>
				<el-button type="text" @click="setDatetimerange(2)">本周</el-button>
				<el-button type="text" @click="setDatetimerange(3)">本月</el-button>
			</template>
		</yx-form>
		<div class="main-box">
			<el-card
				shadow="never"
				class="item-box"
				v-for="(item, index) in detailsList"
				:key="index"
			>
				<p>{{ item.channelName }}{{ item.businessTypeName }}</p>
				<p>￥{{ numberFormat(item.statisticalAmount / 100, 2) }}</p>
			</el-card>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import moment from 'moment'
import { channelTradeStatisticalQuery } from '@/api/weeget-bullet-payment-rest'
import { numberFormat } from '@/utils/helper/common'
export default {
	components: {
		BasicContainer,
		YxForm,
	},
	data() {
		return {
			numberFormat: numberFormat,
			detailsList: [],
			searchData: {
				startDate: moment().startOf('day').valueOf(), // 开始时间
				endDate: moment().endOf('day').valueOf(), // 结束时间
			},
			searchCfg: [
				{
					title: '统计时间',
					type: 'datetimerange',
					dataIndex: ['startDate', 'endDate'],
				},
				{
					type: 'custom',
					dataIndex: 'datetimerBtn',
				},
			],
			searchAction: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._channelTradeStatisticalQuery()
					},
				},
			],
		}
	},
	created() {
		this._channelTradeStatisticalQuery()
	},
	methods: {
		async _channelTradeStatisticalQuery() {
			if (!this.searchData.endDate || !this.searchData.startDate) {
				return this.$message.warning('请选择时间')
			}
			let time = 24 * 60 * 60 * 1000 * 31
			if (this.searchData.endDate - this.searchData.startDate > time) {
				return this.$message.warning('时间不能超过31天')
			}
			const startDate = this.searchData.startDate.toString()
			const endDate = this.searchData.endDate.toString()
			let {
				data: { resultCode, resultData },
			} = await channelTradeStatisticalQuery({ startDate, endDate })
			if (resultCode == 0) {
				this.detailsList = resultData.detailsList
			}
		},
		setDatetimerange(type) {
			// 设置添加时间段
			if (type == 1) {
				// 昨天
				this.searchData.startDate =
					moment().startOf('day').valueOf() - 24 * 60 * 60 * 1000
				this.searchData.endDate =
					moment().endOf('day').valueOf() - 24 * 60 * 60 * 1000
			} else if (type == 2) {
				// 本周
				this.searchData.startDate = moment().startOf('isoWeek').valueOf()
				this.searchData.endDate = moment().endOf('isoWeek').valueOf()
			} else {
				// 本月
				this.searchData.startDate = moment().startOf('month').valueOf()
				this.searchData.endDate = moment().endOf('month').valueOf()
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.main-box {
	display: flex;
	flex-wrap: wrap;
	.item-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 22%;
		height: 120px;
		margin-right: 3%;
		p {
			text-align: center;
			font-weight: 600;
		}
	}
	.item-box:nth-child(n + 5) {
		margin-top: 30px;
	}
	.item-box:nth-child(4n) {
		margin-right: 0;
	}
}
</style>

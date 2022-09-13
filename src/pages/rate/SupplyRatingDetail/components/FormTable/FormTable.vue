<template>
	<basic-container>
		<div class="top_wraper" v-loading="showLoading">
			<div class="supplyName">
				商家名称：{{ supplierName }}
				<div class="timeTabs">
					<el-radio-group @change="changeDay" v-model="time">
						<el-radio-button label="-90">90天</el-radio-button>
						<el-radio-button label="-30">30天</el-radio-button>
						<el-radio-button label="-7">7天</el-radio-button>
					</el-radio-group>
				</div>
			</div>

			<el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
				<el-tab-pane label="发货时长" name="deliveryTime">
					<DeliveryTime
						:supplierEchart="supplierEchart"
						activeName="deliveryTime"
						:time="time"
						v-if="activeName === 'deliveryTime'"
					/>
				</el-tab-pane>
				<el-tab-pane label="揽收时长" name="collectionTime">
					<CollectionTime
						:supplierEchart="supplierEchart"
						activeName="collectionTime"
						:time="time"
						v-if="activeName === 'collectionTime'"
					/>
				</el-tab-pane>
				<el-tab-pane label="签收时长" name="signingTime">
					<SigningTime
						:supplierEchart="supplierEchart"
						activeName="signingTime"
						:time="time"
						v-if="activeName === 'signingTime'"
					/>
				</el-tab-pane>
				<el-tab-pane label="及时发货率" name="timelyDeliveryRate">
					<TimelyDeliveryRate
						:supplierEchart="supplierEchart"
						activeName="timelyDeliveryRate"
						:time="time"
						v-if="activeName === 'timelyDeliveryRate'"
					/>
				</el-tab-pane>
				<el-tab-pane label="虚假发货率" name="falseDeliveryRate">
					<FalseDeliveryRate
						:supplierEchart="supplierEchart"
						activeName="falseDeliveryRate"
						:time="time"
						v-if="activeName === 'falseDeliveryRate'"
					/>
				</el-tab-pane>
				<el-tab-pane label="错发漏发率" name="errorRate">
					<ErrorRate
						:supplierEchart="supplierEchart"
						activeName="errorRate"
						:time="time"
						v-if="activeName === 'errorRate'"
					/>
				</el-tab-pane>
				<el-tab-pane label="缺货率" name="shortageRate">
					<ShortageRate
						:supplierEchart="supplierEchart"
						activeName="shortageRate"
						:time="time"
						v-if="activeName === 'shortageRate'"
					/>
				</el-tab-pane>
			</el-tabs>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import DeliveryTime from '../DeliveryTime'
import CollectionTime from '../CollectionTime'
import SigningTime from '../SigningTime'
import TimelyDeliveryRate from '../TimelyDeliveryRate'
import FalseDeliveryRate from '../FalseDeliveryRate'
import ErrorRate from '../ErrorRate'
import ShortageRate from '../ShortageRate'
import { getSupplierGradeList } from '@/api/monitorController'
import { wgGetDate } from '@/utils/helper/common'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		DeliveryTime,
		CollectionTime,
		SigningTime,
		TimelyDeliveryRate,
		FalseDeliveryRate,
		ErrorRate,
		ShortageRate,
	},
	name: 'FormTable',
	data() {
		return {
			showLoading: false,
			chartData: [],
			activeName: 'deliveryTime',
			supplierName: '',
			time: '-7',
			supplierEchart: [],
		}
	},
	// watch: {
	// activeName(val) {
	// 	// console.log('val', this.$children)
	// },
	// },
	created() {
		this.supplierName = decodeURIComponent(this.$route.query.supplierName)
		this.init()
	},
	methods: {
		changeDay() {
			this.init()
		},
		// 查询列表数据
		async init() {
			this.showLoading = true

			let paramJson = {
				supplierId: this.$route.params.supplierId,
				length: 90,
				currentPage: 1,
			}
			if (this.time == '-7') {
				paramJson.searchStartDate = moment(
					wgGetDate().getSixStartDate
				).valueOf()
				paramJson.searchEndDate = moment().endOf('day').valueOf()
			} else if (this.time == '-30') {
				paramJson.searchStartDate = moment(
					wgGetDate().getThirtyStartDate
				).valueOf()
				paramJson.searchEndDate = moment().endOf('day').valueOf()
			} else if (this.time == '-90') {
				paramJson.searchStartDate = moment(
					wgGetDate().getNinetyStartDate
				).valueOf()
				paramJson.searchEndDate = moment().endOf('day').valueOf()
			}

			const {
				data: { resultCode, resultData = [] },
			} = await getSupplierGradeList(paramJson)
			// const platformGradeList = await getPlatformGradeList(paramJson)
			if (resultCode == 0) {
				console.log(resultData.datalist)
				this.supplierEchart = resultData.datalist
				this.showLoading = false
			}
		},
		handleClick(tab) {
			this.activeName = tab.name
		},
	},
}
</script>

<style lang="scss">
.top_wraper {
	position: relative;
	.supplyName {
		font-size: 24px;
		font-weight: 500;
		margin-bottom: 20px;
	}
	.timeTabs {
		position: absolute;
		right: 20px;
		top: 107px;
		z-index: 10;
	}
}
</style>

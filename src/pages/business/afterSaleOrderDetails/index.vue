<template>
	<basicContainer>
		<!-- <el-button
			style="display: none"
			type="primary"
			class="el-icon-right"
			@click="oldSystem"
			>老系统</el-button
		> -->
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="售后单详情" name="detailsTab">
				<detailsTab
					@update="_findAfterSalesDetails"
					:afterSalesDetailVo.sync="afterSalesDetailVo"
					:afterSalesRefundVo.sync="afterSalesRefundVo"
					:afterSalesRemark.sync="afterSalesRemark"
					ref="detailsTab"
				></detailsTab>
			</el-tab-pane>
			<el-tab-pane label="退货/退款记录" name="backRecordTab">
				<backRecordTab
					:afterSalesRefundVo.sync="afterSalesRefundVo"
					:afterSalesDetailVo.sync="afterSalesDetailVo"
					@update="_findAfterSalesDetails"
					ref="backRecordTab"
				></backRecordTab>
			</el-tab-pane>
			<el-tab-pane label="处理记录" name="processingRecordTab"
				><processingRecordTab
					:afterSalesRecordVo.sync="afterSalesRecordVo"
					:afterSalesRemark.sync="afterSalesRemark"
					ref="processingRecordTab"
				></processingRecordTab>
			</el-tab-pane>
			<el-tab-pane label="售后仲裁单信息" name="arbitrationInformationTab">
				<arbitrationInformationTab
					:afterSalesSn.sync="afterSalesDetailVo.afterSalesSn"
					ref="arbitrationInformationTab"
				></arbitrationInformationTab>
			</el-tab-pane>
			<el-tab-pane label="工单信息" name="ticketTab">
				<ticketTab
					:orderId.sync="afterSalesDetailVo.orderId"
					ref="ticketTab"
				></ticketTab>
			</el-tab-pane>
		</el-tabs>
	</basicContainer>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import { setViewTitle } from '@/utils/helper/common'
import { findAfterSalesDetails } from '@/api/afterSales'
import ticketTab from './components/ticketTab'
import arbitrationInformationTab from './components/arbitrationInformationTab'
import processingRecordTab from './components/processingRecordTab'
import backRecordTab from './components/backRecordTab'
import detailsTab from './components/detailsTab'
export default {
	name: 'AfterSaleOrderDetails',
	components: {
		BasicContainer,
		ticketTab,
		arbitrationInformationTab,
		processingRecordTab,
		backRecordTab,
		detailsTab,
	},
	data() {
		return {
			activeName: 'detailsTab',
			params: this.$route.params,
			afterSalesDetailVo: {},
			afterSalesRecordVo: [],
			afterSalesRemark: {},
			afterSalesRefundVo: {},
		}
	},
	created() {
		let { afterSalesId = '' } = this.$route.params
		setViewTitle(this.$store, this.$route, `${afterSalesId}`)
		this._findAfterSalesDetails()
		// this.$nextTick(() => {
		// 	this.$refs.equityTab.init(true)
		// })
	},
	methods: {
		// 打开老系统
		oldSystem() {
			window.open(
				`/yhtplus/web/afterSaleOrderDetails.html?afterSalesId=${this.$route.params.afterSalesId}`
			)
		},
		async _findAfterSalesDetails() {
			let {
				data: { resultCode, resultData },
			} = await findAfterSalesDetails({
				afterSalesId: this.params.afterSalesId,
			})
			if (resultCode == 0) {
				this.afterSalesDetailVo = resultData.afterSalesDetailVo || {}
				this.afterSalesRemark = resultData.afterSalesRemark || {}
				this.afterSalesRefundVo = resultData.afterSalesRefundVo || {}
				this.afterSalesRecordVo =
					(resultData.afterSalesRecordVo &&
						resultData.afterSalesRecordVo.reverse()) ||
					[]
				// this.$nextTick(() => {
				// 	this.$refs.ticketTab.init()
				// })
			}
		},
		handleClick({ name }) {
			if (name == 'ticketTab' && !this.$refs[name].isShow) {
				this.$refs[name].init(true)
			}
			if (name == 'arbitrationInformationTab' && !this.$refs[name].isShow) {
				this.$refs[name]._init(true)
			}
		},
	},
}
</script>

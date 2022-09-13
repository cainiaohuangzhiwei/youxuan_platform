<template>
	<div>
		<el-timeline class="timeline-box" :reverse="true">
			<el-timeline-item
				v-if="
					afterSalesRecordVo &&
					afterSalesRecordVo[0] &&
					afterSalesRecordVo[0].operatingItems != 10
				"
				placement="top"
				:size="'normal'"
			>
				<template slot="dot">
					<span></span>
				</template>
			</el-timeline-item>
			<el-timeline-item
				v-for="(record, index) in afterSalesRecordVo"
				:key="index"
				placement="top"
				size="normal"
			>
				<div>
					<p class="timeline-name">
						<span>{{ enumeration(record.operatingItems) }}</span>
						<span>{{
							moment(record.addTime).format('YYYY-MM-DD HH:mm:ss')
						}}</span>
						<span
							v-if="
								record.operatorName ||
								(record.isSupplier == 1 && record.supplierName)
							"
							>{{ record.operatorName
							}}{{
								record.isSupplier == 1 ? '{' + record.supplierName + '}' : ''
							}}</span
						>
						<span v-else></span>
						<span v-if="record.remark">备注：{{ record.remark }}</span>
					</p>
					<!-- <p class="timeline-name">
						状态：{{ operatingItems[record.operatingItems] }}
					</p>
					<p
						v-if="
							record.operatorName ||
							(record.isSupplier == 1 && record.supplierName)
						"
						class="timeline-name"
					>
						操作人：{{ record.operatorName
						}}{{
							record.isSupplier == 1 ? '{' + record.supplierName + '}' : ''
						}}
					</p>
					<p class="timeline-name" v-if="record.remark">
						备注：{{ record.remark }}
					</p>
					<p class="timeline-name">
						审核时间：{{ moment(record.addTime).format('YYYY-MM-DD HH:mm:ss') }}
					</p> -->
				</div>
			</el-timeline-item>
		</el-timeline>
		<p>客服备注：{{ afterSalesRemark.customerRemark }}</p>
		<p>仓库备注：{{ afterSalesRemark.warehouseRemark }}</p>
	</div>
</template>

<script>
import moment from 'moment'
export default {
	props: {
		afterSalesRecordVo: {
			type: Array,
			default: () => [],
		},
		afterSalesRemark: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			moment,
			operatingItems: [
				'',
				'申请售后',
				'审核通过',
				'审核不通过',
				'二次申请',
				'同意退款',
				'不同意退款',
				'填写物流单号',
				'验收通过',
				'确认退款',
				'退款成功',
				'退款失败',
				'人工退款（人工退款指的是退款单的人工退款）',
				'关闭售后单',
				'修改售后单',
				'修改物流信息',
				'售后完成',
				'验收不通过',
				'撤销申请',
				'超时关闭售后单',
				'填写备注',
				'异常处理中-处理成功',
				'关闭售后单（结果确认中）',
				'关闭售后单（异常处理中）',
				'开启优先赔付',
				'录入返退金额',
				'更改售后类型',
				'结果确认中-处理成功',
				'售后单超30天自动关闭',
				'超时自动审核通过',
				'超时自动验货通过',
				'超时未申请仲裁自动关闭',
				'用户重新修改申请',
				'延长可回寄期',
				'未发货前自动审核通过',
				'7天无理由自动审核通过',
				// 34
				// |
				// 空(31-50无枚举)
				// |
				// 51
				'用户申请平台介入',
				'商家提交凭证信息',
				'平台转交至商家',
				'商家审核通过',
				'商家验货通过',
				'平台仲裁成功(判定为商家责任)',
				'平台仲裁失败(判定为用户责任)',
				'用户修改售后申请关闭',
				'用户撤销售后申请关闭',
				'超时自动判责(判定为商家责任)',
				'客服关闭售后单',
			],
			// 			售后单操作事项,1，申请售后、2，审核通过、3，审核不通过、4，二次申请、5，同意退款,、6，不同意退款、7，填写物流单号、8，验收通过、9，确认退款、10，退款成功、11，退款失败、12，人工退款（人工退款指的是退款单的人工退款）、13，关闭售后单、14，修改售后单、15，修改物流信息,16、售后完成,17、验收不通过 18、用户撤销申请 19、超时关闭售后单 20、填写备注 21、异常处理中-处理成功 24、开启优先赔付 25、录入反退金额 26、关闭揽退单 27、结果确认中-处理成功 28 售后单超 30天自动关闭 29、超时自动审核通过 30、超时自动验货通过
			// 31、超时未申请仲裁自动关闭；34、未发货前自动审核通过；35、7天无理由自动审核通过；仲裁单操作事项：51.用户提交凭证信息；52.商家提交凭证信息；53.平台转交至商家；54.商家审核通过; 55.商家验货通过;56.平台仲裁成功(判定为商家责任)；57.平台仲裁失败(判定为用户责任)； 58.用户修改售后申请关闭；59.用户撤销售后申请关闭；60.超时自动判责(判定为商家责任)； 61.客服关闭售后单)
		}
	},
	methods: {
		enumeration(Arab) {
			let arabvalues =
				Arab <= 35 ? this.operatingItems[Arab] : this.operatingItems[Arab - 15]
			return arabvalues
		},
	},
}
</script>

<style lang="scss" scoped>
.timeline-box {
	padding-left: 10px;
}
.timeline-name {
	margin: 0;
	padding-bottom: 20px;
	margin-top: -12px;
	span {
		width: 200px;
		display: inline-block;
	}
}
</style>

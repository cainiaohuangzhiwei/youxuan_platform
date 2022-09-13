<template>
	<basicContainer>
		<div class="info-box">
			<yx-info
				:inline="false"
				:loading="showLoading"
				:data="formData"
				:items="formCfg"
				:column="2"
			></yx-info>
		</div>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="已领取" name="receivedSet">
				<receivedSet :params="params" ref="receivedSet"></receivedSet
			></el-tab-pane>
			<el-tab-pane label="已使用" name="usedSet">
				<usedSet :params="params" ref="usedSet"></usedSet
			></el-tab-pane>
		</el-tabs>
	</basicContainer>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import { getCouponDetail } from '@/api/yhtPlusCoupon'
import YxInfo from '@wg-vue-materials/yx-info'
import receivedSet from './components/receivedSet'
import usedSet from './components/usedSet'
import moment from 'moment'
import { setViewTitle } from '@/utils/helper/common'
import { couponSwitchPart14 } from '@/api/coupon'
export default {
	components: {
		BasicContainer,
		YxInfo,
		receivedSet,
		usedSet,
	},
	data() {
		return {
			activeName: 'receivedSet',
			params: this.$route.params,
			query: this.$route.query,
			formData: {},
			formCfg: [
				{
					type: 'string',
					title: '优惠券名称',
					dataIndex: 'couponName',
					width: 300,
				},
				{
					type: 'string',
					title: '会员类别',
					dataIndex: 'userRankText',
					width: 300,
				},
				{
					type: 'string',
					title: '发放数量',
					dataIndex: 'grantQuantity',
					width: 300,
				},
				{
					type: 'string',
					title: '每人限领',
					dataIndex: 'limitCount',
					width: 300,
				},
				{
					type: 'string',
					title: '优惠券类型',
					dataIndex: 'typeTxt',
					width: 300,
				},
				{
					type: 'string',
					title: '每人每日限领',
					dataIndex: 'limitDaily',
					width: 300,
				},
				{
					type: 'string',
					title: '使用门槛',
					dataIndex: 'limitTypeText',
					width: 300,
				},
				{
					type: 'string',
					title: '使用方式',
					dataIndex: 'giveText',
					width: 300,
				},
				{
					type: 'string',
					title: '使用范围',
					dataIndex: 'rangeText',
					width: 300,
				},
				{
					type: 'string',
					title: '优惠券状态',
					dataIndex: 'statusText',
					width: 300,
				},
				{
					type: 'string',
					title: '使用有效期',
					dataIndex: 'expiryDateTypeText',
					width: 300,
				},
			],
			showLoading: false,
		}
	},
	created() {
		setViewTitle(this.$store, this.$route, this.params.yxCouponId)
		this._getCouponDetail()
	},
	methods: {
		_getCouponDetail: async function () {
			this.showLoading = true
			const switchData = await couponSwitchPart14() //新旧接口开关
			const couponSwitch = switchData?.data?.resultData || false
			let {
				data: { resultCode, resultData },
			} = await getCouponDetail(
				{
					yxCouponId: this.params.yxCouponId,
				},
				{},
				couponSwitch
			)
			this.showLoading = false
			if (resultCode == 0) {
				let yxCoupon = {}
				if (couponSwitch) {
					yxCoupon = resultData || {}
				} else {
					yxCoupon = resultData.yxCoupon || {}
				}
				if (yxCoupon.expiryDateType == 1) {
					yxCoupon.expiryDateTypeText =
						moment(yxCoupon.startTime).format('YYYY-MM-DD HH:mm:ss') +
						'-' +
						moment(yxCoupon.endTime).format('YYYY-MM-DD HH:mm:ss')
				} else if (yxCoupon.expiryDateType == 2) {
					yxCoupon.expiryDateTypeText =
						'自领取起' + yxCoupon.expiryDate + '天内有效'
				} else {
					yxCoupon.expiryDateTypeText = '-'
				}
				yxCoupon.statusText =
					yxCoupon.status == '-1'
						? '删除'
						: yxCoupon.status == 0
						? '禁用'
						: yxCoupon.status == 1
						? '启用'
						: ''
				yxCoupon.rangeText =
					yxCoupon.range == 0
						? '全场'
						: yxCoupon.range == 1
						? '' + yxCoupon.rangeExt + ''
						: ''
				yxCoupon.giveText =
					yxCoupon.give == 0
						? '自用'
						: yxCoupon.give == 1
						? '转赠'
						: yxCoupon.give == 2
						? '自用，转赠'
						: ''
				yxCoupon.limitTypeText =
					yxCoupon.limitType == 0
						? '不限制'
						: yxCoupon.limitType == 1
						? '满' + yxCoupon.limitAmount + '元可用'
						: yxCoupon.limitType == 2
						? '首单可用'
						: yxCoupon.limitType == 3
						? '满' + yxCoupon.floorCount + '件可用'
						: ''
				yxCoupon.typeTxt =
					yxCoupon.type == 1 ? '折扣类' : yxCoupon.type == 2 ? '消费类' : ''
				yxCoupon.userRankText =
					yxCoupon.userRank == 0
						? '全平台用户'
						: yxCoupon.userRank == 1
						? '店主'
						: yxCoupon.userRank == 2
						? '消费者'
						: yxCoupon.userRank == 3
						? '新用户'
						: yxCoupon.userRank == 4
						? '新店主'
						: ''
				this.formData = yxCoupon
				this.$nextTick(() => {
					if (!this.query.type) {
						this.$refs.receivedSet.tableColumnHide(yxCoupon.give)
						this.$refs.receivedSet.init(true)
					} else {
						this.activeName = this.query.type
						this.$refs[this.query.type].tableColumnHide(yxCoupon.give)
						this.$refs[this.query.type].init(true)
					}
				})
			}
		},
		handleClick({ name }) {
			this.$nextTick(() => {
				this.$refs[name].init(true)
				this.$refs[name].tableColumnHide(this.formData.give)
			})
		},
	},
}
</script>

<style lang="scss" scoped></style>

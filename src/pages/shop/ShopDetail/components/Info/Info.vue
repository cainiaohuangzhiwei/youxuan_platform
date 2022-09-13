<template>
	<div class="container">
		<!-- 店铺信息 -->
		<yx-info
			:data="shopInfoFirst"
			:items="shopItemsFirst"
			:column="'4'"
			:isImgWrap="false"
		>
			<template #imageUrl>
				<div class="shop_via">
					店主头像：
					<el-image
						class="image"
						:src="shopInfoFirst.imageUrl"
						:fit="fit"
						:preview-src-list="shopInfoFirst.imageUrl"
					/>
				</div>
			</template>
			<template #customServiceImage v-if="flag">
				<p v-if="shopInfoFirst.customServiceImage.length > 0">
					店主二维码：
					<el-image
						class="image"
						:src="shopInfoFirst.customServiceImage"
						:fit="fit"
						:preview-src-list="shopInfoFirst.customServiceImage"
					/>
				</p>
				<p v-else class="set">店主二维码：未设置</p>
			</template>
			<template #brandName>
				<div class="applet" style="display: inline-flex">
					<span style="width: 70px"> 小助手：</span>
					<el-button
						class="btn"
						type="primary"
						@click="handleApplet"
						v-if="shopInfoSecond.userId"
						>小程序登录</el-button
					>
					<el-button
						v-auth="'Login'"
						class="btn"
						type="primary"
						@click="_simulation(1)"
						v-if="shopInfoSecond.userId"
						>登录店主中心</el-button
					>
					<el-button
						v-auth="'Login'"
						class="btn"
						type="primary"
						@click="_simulation(2)"
						v-if="shopInfoSecond.userId"
						>登录店主中心3.0</el-button
					>
				</div>
			</template>
		</yx-info>
		<yx-info
			class="items"
			:data="shopInfoSecond"
			:items="shopItemsSecond"
			:column="'4'"
		>
			<template #addTime>
				<div class="mt10">
					注册时间：{{ shopInfoSecond.addTime | moment('YYYY-MM-DD') }}
				</div>
			</template>
			<template #balance>
				<div class="mt10">
					店主余额:{{
						shopInfoSecond.balance
							? '￥' + numberFormat(shopInfoSecond.balance, 2)
							: '￥0.00'
					}}
				</div>
			</template>
			<template #phone>
				<div class="mt10">
					手机号码：
					<el-popover
						placement="top-start"
						width="120"
						popper-class="popperClass"
						trigger="click"
						:content="visiblePhone"
						><span
							slot="reference"
							@click="showPhone"
							class="show-phone"
							title="点击获取手机号"
							>{{ shopInfoSecond.phone }}</span
						>
					</el-popover>
				</div>
			</template>
		</yx-info>
		<yx-info
			class="item"
			:data="shopInfoThirdly"
			:items="shopItemsThirdly"
			:column="'4'"
		>
		</yx-info>

		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane
				:label="item.label"
				:name="item.name"
				v-for="item in tabsList"
				:key="item.name"
			>
				<balance-log
					v-if="item.name === 'first'"
					ref="first"
					:organizationId="initOrgId()"
				/>
				<direct-invite-open-condition
					v-else-if="item.name === 'second'"
					:organizationId="initOrgId()"
					ref="second"
				/>
				<indirect-invite-open-condition
					v-else-if="item.name === 'third'"
					:organizationId="initOrgId()"
					ref="third"
				/>
				<sell-order-list
					v-else-if="item.name === 'fourth'"
					:organizationId="initOrgId()"
					ref="fourth"
					@fatherMethods="activeName = 'first'"
				/>
				<sell-order-list-statistics
					v-else-if="item.name === 'fifth'"
					:organizationId="initOrgId()"
					ref="fifth"
				/>
			</el-tab-pane>
		</el-tabs>

		<applet-login-dialog
			ref="applet"
			:title="shopInfoSecond.organizationName"
			:visible.sync="appletDialog"
		/>
	</div>
</template>

<script>
import { getSmallImg } from '@/utils/imageTool'
import YxInfo from '@wg-vue-materials/yx-info'
import BalanceLog from './components/BalanceLog'
import DirectInviteOpenCondition from './components/DirectInviteOpenCondition'
import IndirectInviteOpenCondition from './components/IndirectInviteOpenCondition'
import SellOrderList from './components/SellOrderList'
import SellOrderListStatistics from './components/SellOrderListStatistics'
import {
	shopDetailList,
	// levelByCondition,
	findOrganizationDetails,
} from '@/api/shopDetail'
import { findOrganizationPhoneById } from '@/api/showPhone'
import { getConstantValueByKey } from '@/utils/helper/common'
import AppletLoginDialog from './components/AppletLoginDialog'
import { simulation } from '@/api/webUser'
import { setViewTitle, numberFormat } from '@/utils/helper/common'
export default {
	components: {
		YxInfo,
		BalanceLog,
		DirectInviteOpenCondition,
		IndirectInviteOpenCondition,
		SellOrderList,
		SellOrderListStatistics,
		AppletLoginDialog,
	},
	name: 'SearchTable',

	data() {
		return {
			numberFormat: numberFormat,
			flag: false, // 小程序登录按钮登录显示
			appletDialog: false, // 小程序登录弹窗
			organization: {},
			shopInfoFirst: {},
			shopInfoSecond: {},
			shopInfoThirdly: {},
			shopItemsFirst: [
				{
					type: 'custom',
					dataIndex: 'imageUrl',
				},
				{
					type: 'custom',
					dataIndex: 'customServiceImage',
				},
				{
					type: 'custom',
					dataIndex: 'brandName',
				},
			],
			shopItemsSecond: [
				{
					type: 'string',
					title: '店主名称',
					dataIndex: 'organizationName',
				},
				{
					type: 'string',
					title: '姓名',
					dataIndex: 'legalPersonName',
				},
				{
					type: 'string',
					title: '店主维护部门',
					dataIndex: 'departmentName',
				},
				// {
				// 	type: 'string',
				// 	title: '手机号码',
				// 	dataIndex: 'phone',
				// },
				{
					type: 'custom',
					dataIndex: 'phone',
				},
				{
					type: 'string',
					title: '店主等级',
					dataIndex: 'levelType',
					customRender: () => {
						return getConstantValueByKey(
							this.$store.state.app.constant.LEVEL_TYPE,
							this.shopInfoSecond.levelType,
							'-',
							'state'
						)
					},
				},
				{
					type: 'custom',
					dataIndex: 'addTime',
				},
				{
					type: 'custom',
					dataIndex: 'balance',
				},
				{
					type: 'number',
					title: '提现冻结',
					dataIndex: 'lockBalance',
					customRender: () => {
						return this.shopInfoSecond.lockBalance
							? '￥' + numberFormat(this.shopInfoSecond.lockBalance, 2)
							: '￥0.00'
					},
				},
				{
					type: 'number',
					title: '借支冻结',
					dataIndex: 'borrowingLockBalance',
					customRender: () => {
						return this.shopInfoSecond.borrowingLockBalance
							? '￥' + numberFormat(this.shopInfoSecond.borrowingLockBalance, 2)
							: '￥0.00'
					},
				},
				{
					type: 'string',
					title: '待入账',
					dataIndex: 'sumUnIntoAccountAmount',
					customRender: () => {
						return this.shopInfoSecond.sumUnIntoAccountAmount
							? `￥${this.shopInfoSecond.sumUnIntoAccountAmount}`
							: '￥0.00'
					},
				},
				{
					type: 'string',
					title: '直属店主',
					dataIndex: 'fatherName',
				},
				// {
				// 	type: 'string',
				// 	title: 'vip店主',
				// 	dataIndex: 'vipOrganizationName',
				// },
				// {
				// 	type: 'string',
				// 	title: '间接vip店主',
				// 	dataIndex: 'indirectVipOrganizationName',
				// },
				// {
				// 	type: 'string',
				// 	title: '服务商',
				// 	dataIndex: 'serviceOrganizationName',
				// },
				// {
				// 	type: 'string',
				// 	title: '间接服务商',
				// 	dataIndex: 'indirectServiceOrganizationName',
				// },
			],
			shopItemsThirdly: [
				// {
				// 	type: 'string',
				// 	title: '直推人数',
				// 	dataIndex: 'directCount',
				// },
				// {
				// 	type: 'string',
				// 	title: '间推人数',
				// 	dataIndex: 'indirectCount',
				// },
				{
					type: 'string',
					title: '售后率',
					dataIndex: 'returnRate',
					customRender: () => {
						return this.shopInfoThirdly.returnRate
							? `${this.shopInfoThirdly.returnRate}%`
							: 0
					},
				},
				{
					type: 'string',
					title: '售后退款总额',
					dataIndex: 'totalRefundAmount',
					customRender: () => {
						return this.shopInfoThirdly.totalRefundAmount
							? `￥${this.shopInfoThirdly.totalRefundAmount}`
							: ''
					},
				},
				{
					type: 'string',
					title: '售后总数',
					dataIndex: 'refundQuantity',
				},
				{
					type: 'string',
					title: '状态',
					dataIndex: 'organizationState',
					customRender: () => {
						return getConstantValueByKey(
							this.$store.state.app.constant.ORGANIZATION_STATUS,
							this.shopInfoThirdly.organizationState,
							'-',
							'state'
						)
					},
				},
			],
			activeName: 'first',
			organizationId: '',
			imgdefault: [require('../../../../../assets/goods_default.jpg')],
			tabsList: [
				{
					name: 'first',
					label: '余额流水',
				},
				{
					name: 'second',
					label: '直接邀请开通情况',
				},
				{
					name: 'third',
					label: '间接邀请开通情况',
				},
				{
					name: 'fourth',
					label: '销售订单列表',
				},
				{
					name: 'fifth',
					label: '销售订单统计',
				},
			],
			visiblePhone: '***********',
		}
	},

	created() {
		const organizationId = this.initOrgId()
		this.init(organizationId)
	},

	methods: {
		initOrgId() {
			return (
				this.$route.params.organizationId ||
				this.$route.query.organizationId ||
				''
			)
		},

		// tab切换
		handleClick(tab) {
			if (tab.name === 'first') {
				this.$refs.first[0].init(true)
			} else if (tab.name === 'second') {
				this.$refs.second[0].init(true)
			} else if (tab.name === 'third') {
				this.$refs.third[0].init(true)
			} else if (tab.name === 'fourth') {
				this.$refs.fourth[0].init(true)
			} else if (tab.name === 'fifth') {
				this.$refs.fifth[0].initChartList()
			}
		},

		// 初始化
		async init(val) {
			this.flag = false
			this.organizationId = val
			const resFirst = await shopDetailList({
				organizationId: val,
			})
			// const resSecond = await levelByCondition({ groupId: 2 })
			const resThirdly = await findOrganizationDetails({
				organizationId: val,
			})

			Promise.all([resFirst, resThirdly]).then((res) => {
				const { imageList, organization } = res[0].data.resultData
				const {
					customServiceImage,
					organizationState,
					returnRate,
				} = organization
				const {
					totalRefundAmount,
					refundQuantity,
				} = res[1].data.resultData.refund
				if (
					imageList &&
					imageList[0] &&
					imageList[0].imageUrl &&
					imageList[0].type == 22
				) {
					imageList[0].imageUrl =
						imageList[0].imageUrl.indexOf('qlogo') > -1
							? imageList[0].imageUrl
							: [getSmallImg(imageList[0].imageUrl)]
				} else {
					imageList && imageList[0] && (imageList[0].imageUrl = [])
				}
				organization.customServiceImage = customServiceImage
					? [getSmallImg(customServiceImage)]
					: []
				this.shopInfoFirst = Object.assign(
					(imageList && imageList[0]) || {},
					organization
				)
				setViewTitle(this.$store, this.$route, val) // 设置已访问标题
				this.shopInfoSecond = organization
				this.shopInfoThirdly = Object.assign(res[1].data.resultData, {
					organizationState: organizationState,
					returnRate: returnRate,
					totalRefundAmount: totalRefundAmount,
					refundQuantity: refundQuantity,
				})
				this.flag = true
			})
		},
		// showPhone
		async showPhone() {
			this.visiblePhone = '**********'
			const organizationId = this.initOrgId()

			let {
				data: { resultCode, resultData },
			} = await findOrganizationPhoneById({
				id: organizationId,
			})
			if (resultCode == 0) {
				this.visiblePhone = resultData
				//	this.phoneShow = true
			}
		},
		async _simulation(v) {
			const organizationId = this.initOrgId()
			let {
				data: { resultCode: code, resultData: phone },
			} = await findOrganizationPhoneById({
				id: organizationId,
			})
			if (code == 0) {
				let {
					data: { resultData, resultCode },
				} = await simulation({
					phone,
					code: 'appsim%%%',
					channelNo: 'simulation',
				})
				if (resultCode == 0) {
					let origin
					if (v == 1) {
						origin =
							location.origin == 'https://fors-ali-pressure.yunhuotong.net'
								? 'https://test-dev-yhyx-app-b.weeget.cn/taroh5'
								: location.origin == 'https://fors-ali-release.yunhuotong.net'
								? 'https://test-integrated-yhyx-app-b.weeget.cn/taroh5'
								: location.origin == 'https://youxuan-v2.yunhuotong.net/'
								? 'https://yhyx-app-b-v2.yunhuotong.net/taroh5'
								: 'https://yhyx-app-b.yunhuotong.net/taroh5'
						if (process.env.NODE_ENV == 'development') {
							origin = 'https://test-dev-yhyx-app-b.weeget.cn/taroh5'
						}
					} else {
						origin =
							location.origin == 'https://fors-ali-pressure.yunhuotong.net'
								? 'https://test-dev-gateway-h5.weeget.cn/act-h5/'
								: location.origin == 'https://fors-ali-release.yunhuotong.net'
								? 'https://ali-release-gateway-h5.weeget.cn/act-h5/'
								: location.origin == 'https://youxuan-v2.yunhuotong.net'
								? 'https://yhyx-gateway-h5-v2.yunhuotong.net/act-h5/'
								: 'https://yhyx-gateway-h5.yunhuotong.net/act-h5/'
						if (process.env.NODE_ENV == 'development') {
							origin = 'https://test-dev-gateway-h5.weeget.cn/act-h5/'
						}
					}
					window.open(
						`${origin}/#/organizationCenter?userId=${resultData.userId}&shopId=${resultData.organizationId}&token=${resultData.appToken}`
					)
				}
			}
		},
		// 小程序登录弹窗
		handleApplet() {
			this.appletDialog = true
			this.$refs.applet.updateData(
				this.organizationId,
				this.shopInfoSecond.userId
			)
		},
	},
}
</script>

<style lang="scss" scoped>
.container {
	width: 100%;

	.shop_via {
		margin-top: 14px;
	}

	.items {
		margin-top: -13px;
	}

	.item {
		margin-top: -20px;
	}

	.image {
		width: 100px;
		height: 100px;
	}

	.applet {
		margin-top: 94px;
	}

	.set {
		margin-top: 99px;
	}

	.mt10 {
		margin-top: 10px;
	}

	.color_text {
		color: #1890ff;
	}
	.show-phone {
		cursor: pointer;
	}
}
</style>

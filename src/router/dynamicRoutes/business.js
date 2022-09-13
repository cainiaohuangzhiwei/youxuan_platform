/*
 * @Description: 业务路由
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-09 10:50:15
 * @LastEditTime: 2021-12-22 14:31:40
 * @LastEditors: Please set LastEditors
 */
const businessRouter = {
	path: '/business',
	redirect: '/business/orderList',
	name: 'business',
	component: () => import('@/layout'),
	meta: {
		title: '业务',
		icon: 'el-icon-activity',
	},
	children: [
		{
			path: 'orderList',
			name: 'OrderList',
			meta: {
				title: '订单列表',
				functionCode: ['getOrderListByCondition'],
			},
			component: () => import('@/pages/business/OrderList/index'),
		},
		{
			path: 'orderEdit/:orderId',
			name: 'OrderEdit',
			hidden: true,
			meta: {
				functionCode: ['updateOrderByOrderId'],
				title: '修改地址',
			},
			component: () => import('@/pages/business/OrderEdit/index'),
		},
		{
			path: 'orderShipmentsSpot/:orderId',
			name: 'OrderShipmentsSpot',
			hidden: true,
			meta: {
				// functionCode: ['updateOrderByOrderId'],
				title: '立即发货',
			},
			component: () => import('@/pages/business/OrderShipmentsSpot/index'),
		},
		{
			path: 'orderDetails/:orderId',
			name: 'OrderDetails',
			hidden: true,
			meta: {
				title: '订单详情',
			},
			component: () => import('@/pages/business/orderDetails/index'),
		},
		{
			path: 'afterSaleOrderDetails/:afterSalesId',
			name: 'AfterSaleOrderDetails',
			hidden: true,
			meta: {
				title: '售后单详情',
			},
			component: () => import('@/pages/business/afterSaleOrderDetails/index'),
		},
		{
			path: 'afterSaleOrderList',
			name: 'AfterSaleOrderList',
			meta: {
				title: '售后单列表',
				functionCode: ['listAfterSales'],
			},
			component: () => import('@/pages/business/AfterSaleOrderList/index'),
		},
		{
			path: 'arbitrationList',
			name: 'arbitrationList',
			meta: {
				title: '售后仲裁单列表',
				functionCode: ['afterSalesArbitrationPage'],
			},
			component: () => import('@/pages/business/arbitrationList/index'),
		},
		{
			path: 'upstreamAfter',
			name: 'UpstreamAfter',
			meta: {
				title: '上游售后单',
				functionCode: ['queryAfterSales'],
			},
			component: () => import('@/pages/business/upstreamAfter/index'),
		},

		{
			path: 'listOfCanceledWorkOrders',
			name: 'ListOfCanceledWorkOrders',
			meta: {
				title: '取消订单工单列表',
				functionCode: ['cancelOrderList'],
			},
			component: () =>
				import('@/pages/business/ListOfCanceledWorkOrders/index'),
		},
		{
			path: 'modifyAddressList',
			name: 'ModifyAddressList',
			meta: {
				title: '修改地址列表',
				functionCode: ['getOrderRecordList'],
			},
			component: () => import('@/pages/business/ModifyAddressList/index'),
		},
		{
			path: 'refundList',
			name: 'RefundList',
			meta: {
				title: '退款单列表',
				functionCode: ['getRefundOrderListByParam'],
			},
			component: () => import('@/pages/business/RefundList/index.vue'),
		},
		{
			path: 'returnGoodsList',
			name: 'ReturnGoodsList',
			meta: {
				title: '退货单列表',
				functionCode: ['getRetrunOrderListByParam'],
			},
			component: () => import('@/pages/business/ReturnGoodsList/index'),
		},
		{
			path: 'shipmentsList',
			name: 'ShipmentsList',
			meta: {
				title: '发货单列表',
				functionCode: ['getOrderDeliverListByCondition'],
			},
			component: () => import('@/pages/business/ShipmentsList/index'),
		},
		{
			path: 'waitCouponList',
			name: 'WaitCouponList',
			meta: {
				title: '待补偿列表',
				functionCode: [
					'findCouponCompensationByCondition',
					'findAllCompensation',
					'findCompensationHJ',
				],
			},
			component: () => import('@/pages/business/WaitCouponList/index'),
		},
		{
			path: 'limitSupplementList',
			name: 'LimitSupplementList',
			meta: {
				title: '客服限制补款列表',
				functionCode: ['getRefundLimitListByParam'],
			},
			component: () => import('@/pages/business/LimitSupplementList/index'),
		},
		{
			path: 'priorityClaimsList',
			name: 'PriorityClaimsList',
			meta: {
				title: '优先赔付列表',
				functionCode: ['prepaymentList'],
			},
			component: () => import('@/pages/business/PriorityClaimsList/index'),
		},
		{
			path: 'equityCardList',
			name: 'EquityCardList',
			meta: {
				title: '权益卡列表',
				functionCode: ['listEquityOrder'],
			},
			component: () => import('@/pages/business/EquityCardList/index'),
		},
		{
			path: 'invoiceList',
			name: 'InvoiceList',
			meta: {
				title: '发票列表',
				functionCode: ['invoice'],
			},
			component: () => import('@/pages/business/InvoiceList/index'),
		},
		{
			path: 'newBillingInformation',
			name: 'NewBillingInformation',
			hidden: true,
			meta: {
				title: '新建发票',
			},
			component: () => import('@/pages/business/newBillingInformation/index'),
		},
		{
			path: 'invoiceDetails/:invoiceId',
			name: 'InvoiceDetails',
			hidden: true,
			meta: {
				title: '发票详情',
			},
			component: () => import('@/pages/business/invoiceDetails/index'),
		},
		{
			path: 'invoiceMportList',
			name: 'InvoiceMportList',
			hidden: true,
			meta: {
				title: '发票导入记录',
			},
			component: () => import('@/pages/business/invoiceMportList/index'),
		},
		{
			path: 'workorderList',
			name: 'WorkorderList',
			meta: {
				title: '工单管理',
				functionCode: ['ticketList'],
			},
			component: () => import('@/pages/business/WorkorderList/index'),
		},
		{
			path: 'workorderDetails/:serviceTicketId',
			name: 'WorkorderDetails',
			hidden: true,
			meta: {
				title: '工单详情',
			},
			component: () => import('@/pages/business/workorderDetails/index'),
		},
		{
			path: 'downloadCenter',
			name: 'DownloadCenter',
			meta: {
				title: '下载中心',
				functionCode: ['cmsDownloadCenterList'],
			},
			component: () => import('@/pages/business/DownloadCenter/index'),
		},
		{
			path: 'riskManagementList',
			name: 'RiskManagementList',
			meta: {
				title: '风控退款处理列表',
				functionCode: ['listFillingChannels'],
			},
			component: () => import('@/pages/business/RiskManagementList/index'),
		},
		{
			path: 'refundFailSyncList',
			name: 'RefundFailSyncList',
			meta: {
				title: '退款失败同步列表',
				functionCode: ['userCompensationWithdrawRefundList'],
			},
			component: () => import('@/pages/business/RefundFailSyncList/index'),
		},
		{
			path: 'paymentsSmallList',
			name: 'PaymentsSmallList',
			meta: {
				title: '小额打款列表',
				functionCode: ['queryPageSmallPayment'],
			},
			component: () => import('@/pages/business/paymentsSmallList/index'),
		},
		{
			path: 'automaticAudit',
			name: 'AutomaticAudit',
			meta: {
				title: '商家自动审核/验货配置列表',
				functionCode: ['afterSaleAutoAuditConfigList'],
			},
			component: () => import('@/pages/business/AutomaticAudit/index'),
		},
		{
			path: 'shipmentRequestList',
			name: 'ShipmentRequestList',
			meta: {
				title: '上游取消发货申请列表',
				functionCode: ['queryOrderApproveRecord'],
			},
			component: () => import('@/pages/business/shipmentRequestList/index'),
		},

		{
			path: 'afterArbitrationDetails/:Id',
			name: 'afterArbitrationDetails',
			hidden: true,
			meta: {
				title: '售后仲裁单详情',
				functionCode: ['afterSalesArbitrationDetail'],
			},
			component: () => import('@/pages/business/afterArbitrationDetails/index'),
		},
		{
			path: 'quorumConfigurationList',
			name: 'quorumConfigurationList',
			meta: {
				title: '售后转仲裁商家配置列表',
				functionCode: ['afterSalesSupplierArbitrateConfig'],
			},
			component: () => import('@/pages/business/quorumConfigurationList/index'),
		},
		{
			path: 'afterSaleSupplyList',
			name: 'afterSaleSupplyList',
			meta: {
				title: '商家开启售后单列表',
				functionCode: ['supplierTurnonAfterSalesPage'],
			},
			component: () => import('@/pages/business/afterSaleSupplyList/index'),
		},
		{
			path: 'beforeDeliveryRefund',
			name: 'beforeDeliveryRefund',
			meta: {
				title: '发货前秒退商家配置表',
				functionCode: ['listSupplierAfterSalesSecRefundConfig'],
			},
			component: () => import('@/pages/business/beforeDeliveryRefund/index'),
		},
		{
			path: 'afterSaleConfig',
			name: 'afterSaleConfig',
			meta: {
				title: '七天无理由类目配置表',
				functionCode: ['reasonConfigListGoodsCategory'],
			},
			component: () => import('@/pages/business/afterSaleConfig/index'),
		},
	],
}
export default businessRouter

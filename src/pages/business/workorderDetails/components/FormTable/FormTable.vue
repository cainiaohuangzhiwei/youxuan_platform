<template>
	<div class="messageadd">
		<el-card class="mb20">
			<div class="fb mb20">工单标题：{{ serviceTicketDetail.ticketTitle }}</div>
			<div class="fb mb20">工单内容：{{ serviceTicketDetail.problemDesc }}</div>
			<div class="imageDiv mb20">
				<span class="fb mb20"> 附件：</span>
				<el-image
					class="image"
					v-for="(v, k) in serviceTicketDetail.attachments"
					:key="k"
					:src="getBigImg(v)"
					:preview-src-list="[getBigImg(v)]"
				/>
			</div>

			<div class="df">
				<!-- --------工单信息 -->
				<el-card class="mb20 wid40">
					<span class="fb fz mb20"> 工单信息</span>
					<!-- 必有 -->
					<div class="mb20 mt20">工单ID:{{ serviceTicketDetail.ticketId }}</div>
					<div class="mb20">
						工单状态:{{ ticketStatus_arr[serviceTicketDetail.ticketStatus] }}
					</div>
					<div class="mb20">
						工单类型:{{ ticketType_arr[serviceTicketDetail.ticketType] }}
					</div>
					<div class="mb20">商家:{{ serviceTicketDetail.supplierName }}</div>
					<div class="mb20">
						创建时间:{{
							serviceTicketDetail.ticketCreateTime
								? moment(serviceTicketDetail.ticketCreateTime).format(
										'YYYY-MM-DD HH:mm:ss'
								  )
								: '-'
						}}
					</div>
					<!-- 2 3有 -->
					<div
						class="mb20"
						v-if="
							serviceTicketDetail.ticketStatus == 2 ||
							serviceTicketDetail.ticketStatus == 3
						"
					>
						接单人:{{ serviceTicketDetail.staffName }}
					</div>
					<div
						class="mb20"
						v-if="
							serviceTicketDetail.ticketStatus == 2 ||
							serviceTicketDetail.ticketStatus == 3
						"
					>
						同步状态:{{
							ticketSyncState_arr[serviceTicketDetail.ticketSyncState]
						}}
					</div>
					<div
						class="mb20"
						v-if="
							serviceTicketDetail.ticketStatus == 2 ||
							serviceTicketDetail.ticketStatus == 3
						"
					>
						接单时间:{{
							serviceTicketDetail.staffTime
								? moment(serviceTicketDetail.staffTime).format(
										'YYYY-MM-DD HH:mm:ss'
								  )
								: '-'
						}}
					</div>
					<div
						class="mb20"
						v-if="
							serviceTicketDetail.ticketStatus == 2 ||
							serviceTicketDetail.ticketStatus == 3
						"
					>
						同步商家时间:{{
							serviceTicketDetail.syncSupplierTime
								? moment(serviceTicketDetail.syncSupplierTime).format(
										'YYYY-MM-DD HH:mm:ss'
								  )
								: '-'
						}}
					</div>
					<!-- 只有4有 -->
					<div class="mb20" v-if="serviceTicketDetail.ticketStatus == 4">
						完结时间:{{
							serviceTicketDetail.ticketFinishTime
								? moment(serviceTicketDetail.ticketFinishTime).format(
										'YYYY-MM-DD HH:mm:ss'
								  )
								: '-'
						}}
					</div>
					<div class="mb20" v-if="serviceTicketDetail.ticketStatus == 4">
						处理结果:{{ serviceTicketDetail.ticketFinishResult }}
					</div>
					<div class="mb20" v-if="serviceTicketDetail.ticketStatus == 4">
						备注:{{ serviceTicketDetail.ticketFinishRemark }}
					</div>
				</el-card>
				<!-- --------工单信息 -->
				<!-- --------售后单信息-->
				<el-card class="mb20 wid40 ml300">
					<span class="fb fz mb20"> 售后单信息</span>
					<div class="mb20 mt20">
						售后单号:
						<router-link
							:to="`/business/afterSaleOrderDetails/${serviceTicketDetail.afterSalesId}`"
							><el-button type="text">{{
								serviceTicketDetail.afterSalesSn
							}}</el-button></router-link
						>
					</div>
					<div class="mb20">
						售后类型:{{ afterType_arr[serviceTicketDetail.afterType] }}
					</div>
					<div class="mb20">
						是否已收到货:{{ acceptGoods_arr[serviceTicketDetail.acceptGoods] }}
					</div>
					<div class="mb20">售后原因:{{ serviceTicketDetail.afterReason }}</div>
					<div class="mb20">问题描述:{{ serviceTicketDetail.problemDesc }}</div>
					<div class="mb20">
						商家驳回理由:{{ serviceTicketDetail.rejectReason }}
					</div>
				</el-card>
				<!-- --------售后单信息-->
			</div>
			<div class="df">
				<!-- --------订单信息-->
				<el-card class="mb20 wid40">
					<span class="fb fz"> 订单信息</span>
					<yx-table
						class="mt20"
						:select="false"
						:columns="orderTableColumns"
						:data="orderData"
					>
						<template #orderSn>
							<el-button type="text">
								<router-link
									:to="`/business/orderDetails/${orderData[0].orderId}`"
									>{{ orderData[0].orderSn }}</router-link
								>
							</el-button>
							<el-button
								v-clipboard:copy="orderData[0].orderSn"
								v-clipboard:success="copyCode"
								type="text"
								>复制</el-button
							>
						</template>
					</yx-table>
				</el-card>
				<!-- --------订单信息-->
				<el-card class="mb20 wid40 ml300">
					<span class="fb fz">订单关联所有售后单信息</span>
					<yx-table
						class="mt20"
						:select="false"
						:columns="associatedAfteTableColumns"
						:data="associatedAfteData"
					>
						<template slot="afterSalesSn" slot-scope="scope">
							<el-button type="text">
								<router-link
									:to="`/business/afterSaleOrderDetails/${scope.row.afterSalesId}`"
									>{{ scope.row.afterSalesSn }}</router-link
								>
							</el-button>
							<el-button
								v-clipboard:copy="scope.row.afterSalesSn"
								v-clipboard:success="copyCode"
								type="text"
								>复制</el-button
							>
						</template>
					</yx-table>
				</el-card>
			</div>
		</el-card>
		<div class="save_button">
			<el-button
				type="primary"
				v-if="
					serviceTicketDetail.ticketStatus == 2 ||
					serviceTicketDetail.ticketStatus == 3
				"
				@click="endRepairOrder"
				>完结</el-button
			>
			<el-button
				v-if="serviceTicketDetail.ticketStatus == 2"
				@click="circulationMerchants"
				>流转至商家</el-button
			>
		</div>
		<el-card class="mb20">
			<div class="fb fz">回复记录</div>
			<div
				class="pull_down"
				v-if="
					serviceTicketDetail.communicationList &&
					serviceTicketDetail.communicationList.length
				"
			>
				<el-card
					class="box-card"
					v-for="o in serviceTicketDetail.communicationList"
					:key="o"
				>
					<div
						:class="o.identify == 1 ? 'text item fb fRight' : 'text item fb'"
					>
						{{ o.operator }}
						<div class="dc">
							{{
								o.operateTime
									? moment(o.operateTime).format('YYYY-MM-DD HH:mm:ss')
									: '-'
							}}
						</div>
						<div>{{ o.content }}</div>
						<div class="imageDivTwo" v-if="o.images">
							<el-image
								class="image"
								v-for="(v, k) in o.images"
								:key="k"
								:src="getBigImg(v)"
								:preview-src-list="[getBigImg(v)]"
							/>
						</div>
					</div>
				</el-card>
			</div>
			<!-- 表单组件	v-if="
					serviceTicketDetail.ticketStatus != 1 &&
					serviceTicketDetail.ticketStatus != 4
				" -->
			<div class="ml-145">
				<yx-form
					ref="form"
					labelWidth="140px"
					:items="itemImges"
					:data="formData"
				>
					<template #content>
						<el-input
							placeholder="您可在此处输入回复内容"
							style="width: 66.35%"
							type="textarea"
							:rows="10"
							v-model.trim="formData.content"
						></el-input>
					</template>
				</yx-form>
			</div>
			<el-button
				type="info"
				v-if="
					serviceTicketDetail.ticketStatus != 1 &&
					serviceTicketDetail.ticketStatus != 4
				"
				@click="writeBack"
				>回复</el-button
			>
		</el-card>
		<!-- </el-drawer> -->
		<!-- //完结工单 -->
		<Dialog
			title="完结工单"
			:visible="endRepaiOrderLoding"
			width="50%"
			:bottomBtn="endRepaiOrderBottomBtn"
			@before-close="endRepaiOrderLoding = false"
		>
			<yx-form
				style="margin-top: 60px"
				ref="form"
				:inline="false"
				:items="settingsItem"
				:data="settingsData"
				labelWidth="80px"
			>
			</yx-form>
		</Dialog>
	</div>
</template>

<script>
import { uploadImageList } from '@/api/image'
import { getBigImg } from '@/utils/imageTool'
import Dialog from '@/components/Dialog'
import {
	ticketDetail,
	ticketReply,
	ticketFinish,
	ticketExchange,
} from '@/api/serviceTicket'
import { isNull } from '@/utils/helper/common'
import moment from 'moment'
export default {
	components: {
		YxTable: () => import('@wg-vue-materials/yx-table'),
		YxForm: () => import('@wg-vue-materials/yx-form'),
		Dialog,
	},
	data() {
		return {
			getBigImg: getBigImg,
			moment: moment,
			serviceTicketId: this.$route.params.serviceTicketId, //哪哪都用到的id]
			endRepaiOrderLoding: false, //完结滴弹窗开关
			endRepaiOrderBottomBtn: [
				//确定完结按钮
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.endRepaiOrderAudit()
					},
				},
			],
			//完结的入参
			settingsData: {
				ticketFinishRemark: '',
				ticketFinishResult: '',
				afterSalesImageList: [],
			},
			//完结弹窗的表单
			settingsItem: [
				{
					type: 'select',
					title: '处理结果',
					dataIndex: 'ticketFinishResult',
					placeholder: '请选择处理结果',
					label: 'value',
					options: [
						{
							ticketFinishResult: '1',
							value: '处理成功',
						},
						{
							ticketFinishResult: '2',
							value: '处理失败',
						},
					],
				},
				{
					title: '回复',
					type: 'textarea',
					dataIndex: 'ticketFinishRemark',
				},
				{
					type: 'uploadImage',
					title: '图片',
					dataIndex: 'afterSalesImageList',
					uploadAttributes: {
						limit: 10,
						imageName: 'imageUrl',
						httpRequest: (file) => this._uploadImageHttpRequest(file, 2),
					},
				},
			],
			serviceTicketDetail: {}, //全局数据源
			content: '', //回复内容
			images: [], //回复图片
			//工单状态
			ticketStatus_arr: [
				'全部',
				'待接单',
				'待平台处理',
				'待商家回复',
				'已完结',
			],
			//工单类型
			ticketType_arr: [
				'',
				'审核结果沟通',
				'验货结果沟通',
				'售后申诉',
				'二次申诉',
			],
			//售后类型
			afterType_arr: ['', '退货退款', '仅退款'],
			//是否收到货
			acceptGoods_arr: ['', '已收到', '未收到'],
			//同步状态
			ticketSyncState_arr: ['全部', '未同步', '已同步'],
			//售后单状态
			afterOrderStatus_arr: [
				'',
				'',
				'申请中',
				'待寄出',
				'已寄出',
				'待退款',
				'退款中',
				'退款成功',
				'已关闭',
			],
			//表单参
			formData: {
				coverImageMore: [], //多张图片
				content: '',
			},
			//上传图片
			itemImges: [
				{
					type: 'custom',
					dataIndex: 'content',
					title: '文字和表情',
				},
				{
					type: 'uploadImage',
					dataIndex: 'coverImageMore',
					uploadAttributes: {
						limit: 5,
						imageName: 'imageUrl',
						httpRequest: (file) => this._uploadImageHttpRequest(file, 1),
					},
				},
			],
			//订单信息
			orderData: [],
			orderTableColumns: [
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '关联订单编号',
				},
				{
					type: 'string',
					dataIndex: 'deliverState',
					title: '发货状态',
					customRender: (row) => {
						let deliverGoods = ''
						if (row.deliverSign == 0 && row.deliverState == 1) {
							deliverGoods = '待发货(未拣货)'
						} else if (row.deliverSign == 1 && row.deliverState == 1) {
							deliverGoods = '待发货(拣货中)'
						} else if (row.deliverSign == 2 && row.deliverState == 3) {
							deliverGoods = '已发货(部分商品发货)'
						} else if (row.deliverSign == 3 && row.deliverState == 3) {
							deliverGoods = '已发货(全部商品发货)'
						} else if (row.deliverSign == 3 && row.deliverState == 4) {
							deliverGoods = '已确认收货'
						} else {
							if (row.deliverState == 1) {
								deliverGoods = '待发货(未拣货)'
							} else {
								deliverGoods = '状态异常'
							}
						}
						return deliverGoods
					},
				},
				{
					type: 'string',
					dataIndex: 'orderTime',
					title: '下单时间',
					customRender: (row) => {
						return row.orderTime
							? moment(row.orderTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
			],
			//订单关联所有售后单信息
			associatedAfteData: [],
			associatedAfteTableColumns: [
				{
					type: 'custom',
					dataIndex: 'afterSalesSn',
					title: '售后单号',
				},
				{
					type: 'string',
					dataIndex: 'afterOrderStatus',
					title: '售后单状态',
					customRender: (row) => {
						return this.afterOrderStatus_arr[row.afterOrderStatus]
					},
				},
				{
					type: 'string',
					dataIndex: 'afterSalesTime',
					title: '申请售后单时间',
					customRender: (row) => {
						return row.afterSalesTime
							? moment(row.afterSalesTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
			],
		}
	},
	created() {
		this.getticketDetail() // 获取详情数据
	},

	methods: {
		//流转商家
		circulationMerchants: async function () {
			let serviceTick = this.serviceTicketId
			this.$confirm(
				'是否确认流转至商家？流转成功后，状态变为"待商家回复"',
				'提示',
				{
					type: 'warning',
					async callback(action) {
						if (action === 'confirm') {
							const {
								data: { resultCode },
							} = await ticketExchange({
								serviceTicketId: serviceTick,
								exchangeType: 2, ////1流转平台,2流转商家
							})
							if (resultCode == 0) {
								this.$message({
									message: `流转成功!`,
									type: 'success',
								})
								this.getticketDetail()
							}
						}
					},
				}
			)
		},
		//确定完结接口调起
		endRepaiOrderAudit: async function () {
			let afterSalesImageListPush = []
			this.settingsData.afterSalesImageList.map((item) => {
				afterSalesImageListPush.push(item.imageUrlTemp)
			})
			let paramJson = {
				ticketFinishResult: this.settingsData.ticketFinishResult,
				ticketFinishRemark: this.settingsData.ticketFinishRemark,
				serviceTicketId: this.$route.params.serviceTicketId,
				afterSalesImageList: afterSalesImageListPush,
			}
			if (isNull(paramJson.ticketFinishResult)) {
				this.$message.warning({ message: '请选择处理结果' })
				return
			}
			if (isNull(paramJson.ticketFinishRemark)) {
				this.$message.warning({ message: '请填写回复内容' })
				return
			}
			if (paramJson.afterSalesImageList.length == 0) {
				this.$message.warning({ message: '请选上传图片' })
				return
			}
			let {
				data: { resultCode },
			} = await ticketFinish(paramJson)
			if (resultCode == 0) {
				this.$message({
					message: `完结成功!`,
					type: 'success',
				})
				this.endRepaiOrderLoding = false
				this.getticketDetail()
			}
		},
		//完结弹窗
		endRepairOrder() {
			this.settingsData.ticketFinishResult = ''
			this.settingsData.ticketFinishRemark = ''
			this.serviceTicketId = null
			this.settingsData.afterSalesImageList = []
			this.serviceTicketIdRow = this.serviceTicketId
			this.endRepaiOrderLoding = true
		},
		//复制小提示
		copyCode() {
			this.$message.success('复制成功')
		},
		//回复信息
		writeBack: async function () {
			let imageUrList = []
			if (this.formData.coverImageMore.length) {
				this.formData.coverImageMore.map((v) => {
					imageUrList.push(v.imageUrlTemp)
				})
			}
			let paramsData = {
				serviceTicketId: this.serviceTicketId,
			}
			if (this.content) {
				paramsData.content = this.content
			}
			if (imageUrList.length) {
				paramsData.images = imageUrList
			}
			if (!paramsData.content && !paramsData.images) {
				this.$message.warning('请输入回复内容')
				return
			}
			let {
				data: { resultCode = 0 }, //判空
			} = await ticketReply(paramsData)
			if (resultCode == 0) {
				this.content = ''
				//表单参
				;(this.formData = {
					coverImageMore: [], //多张图片
				}),
					this.getticketDetail()
				this.$message.success('回复成功')
			}
		},
		//获取详情信息
		getticketDetail: async function () {
			let {
				data: { resultCode = 0, resultData = [] }, //判空
			} = await ticketDetail({
				serviceTicketId: this.serviceTicketId,
			})
			if (resultCode == 0) {
				this.serviceTicketDetail = resultData.serviceTicketDetail //全局数据
				this.orderData.push(resultData.serviceTicketDetail) //订单信息数据
				this.associatedAfteData = this.serviceTicketDetail.afterSalesList //订单关联所有售后单信息数据
				this.serviceTicketDetail.communicationList.map((v) => {
					if (v.images) {
						let magesA = v.images.split(',')
						v.images = magesA
						this.images.push(...magesA)
					}
				})
			}
		},
		//格式校验
		beforeAvatarUpload(file) {
			if (!/\.(jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)) {
				this.$message.warning('格式不对')
				return false
			} else {
				return file
			}
		},
		// 上传图标图片
		_uploadImageHttpRequest: async function (params, v) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#addMaterial', imageType: 77 })
			)
			formData.append('file', params.file)
			const res = await uploadImageList(formData)
			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				if (v == 1) {
					//回复图片
					this.formData.coverImageMore.push({
						imageUrl: getBigImg(res.data.resultData.imageList[0].imageUrl),
						imageUrlTemp: res.data.resultData.imageList[0].imageUrl,
					})
				} else {
					//完结工单图片
					this.settingsData.afterSalesImageList.push({
						imageUrl: getBigImg(res.data.resultData.imageList[0].imageUrl),
						imageUrlTemp: res.data.resultData.imageList[0].imageUrl,
					})
				}
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
	},
}
</script>

<style lang="scss">
.messageadd .row {
	display: flex;
	align-items: center;
	width: 300px;
	.width {
		width: 100%;
	}
}
.imageDiv {
	width: 10%;
	.el-image {
		height: 160px;
	}
}
.imageDivTwo {
	width: 50%;
	display: flex;
	.el-image {
		height: 160px;
		padding: 10px;
	}
}
.fb {
	font-weight: bold;
}
.mb20 {
	margin-bottom: 20px;
}
.text {
	font-size: 14px;
}

.item {
	padding: 18px 0;
}

.box-card {
	width: 1000px;
}
.dc {
	display: contents;
}
.fz {
	font-size: 18px;
}
.textareaWidth {
	width: 1000px;
	height: 200px;
	.el-textarea__inner {
		min-height: 200px;
	}
}
.ml-145 {
	margin-left: -145px;
}
.oA {
	.el-drawer__container {
		.el-drawer {
			overflow: auto;
		}
	}
}
.wid40 {
	width: 40%;
}
.df {
	display: flex;
}
.ml300 {
	margin-left: 300px;
}
.mt20 {
	margin-top: 20px;
}
.save_button {
	position: fixed;
	bottom: 0;
	left: 280px;
	right: 0;
	padding: 20px 0px 20px 50px;
	background-color: #ccc;
	opacity: 0.8;
	z-index: 120;
}
.fRight {
	float: right;
}
.pull_down {
	word-break: break-all;
	width: 67%;
	overflow-y: scroll;
	height: 400px;
}
</style>

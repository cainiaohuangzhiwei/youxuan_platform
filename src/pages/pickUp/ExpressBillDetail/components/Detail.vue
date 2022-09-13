<template>
	<div class="express-bill-detail-com">
		<yx-form
			v-loading="loading"
			:inline="true"
			:data="formData101"
			:items="formCfg101"
			:formAction="formAction101"
		>
			<template slot="orderSn">
				<router-link :to="`/business/orderDetails/${formData101.orderId}`"
					><el-button type="text">{{
						formData101.orderSn
					}}</el-button></router-link
				>
			</template>
			<template slot="afterSalesSn">
				<router-link
					v-for="(item, index) in formData101.afterSalesList"
					:key="index"
					:to="`/business/afterSaleOrderDetails/${item.afterSalesId}`"
					><el-button type="text"
						>{{ item.afterSalesSn
						}}{{
							formData101.afterSalesList.length - 1 > index ? '、' : ''
						}}</el-button
					></router-link
				>
			</template>
		</yx-form>
		<div class="order-msg">
			<div class="o-title">揽件订单信息</div>
			<span
				v-if="
					formData101.collectionStatus == 1 ||
					formData101.collectionStatus == 2 ||
					formData101.collectionStatus == 3
				"
				v-auth="'/collectionOrderDetail/change'"
			>
				<el-button @click="showDialogFun" class="o-button" type="primary"
					>修改揽件订单信息</el-button
				>
			</span>
		</div>
		<div class="flex-box" v-if="orderDetail && orderDetail.detailInfo">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>寄件信息</span>
				</div>
				<div class="text item">
					寄件人：{{ orderDetail.detailInfo.senderName || '' }}
				</div>
				<div class="text item">
					寄件人联系方式：{{ orderDetail.detailInfo.senderPhone || '' }}
				</div>
				<div class="text item">
					寄件地址：
					{{ orderDetail.detailInfo.srcProvince || '' }}
					{{ orderDetail.detailInfo.srcCity || '' }}
					{{ orderDetail.detailInfo.srcCounty || '' }}

					{{ orderDetail.detailInfo.senderAddress || '' }}
				</div>
			</el-card>
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>收件信息</span>
				</div>
				<div class="text item">
					收件人：{{ orderDetail.detailInfo.recipientName || '' }}
				</div>
				<div class="text item">
					收件人联系方式：{{ orderDetail.detailInfo.recipientPhone || '' }}
				</div>
				<div class="text item">
					收件地址：
					{{ orderDetail.detailInfo.destProvince || '' }}
					{{ orderDetail.detailInfo.destCity || '' }}
					{{ orderDetail.detailInfo.destCounty || '' }}
					{{ orderDetail.detailInfo.recipientAddress || '' }}
				</div>
			</el-card>
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>取件信息</span>
				</div>
				<div class="text item">
					上门取件时间：{{
						moment(orderDetail.detailInfo.pickupTime).format(
							'YYYY-MM-DD HH:mm:ss'
						) || ''
					}}
				</div>
				<div class="text item">
					快递小哥姓名：{{ orderDetail.detailInfo.pickupUserName || '' }}
				</div>
				<div class="text item">
					快递小哥联系电话：{{ orderDetail.detailInfo.pickupUserPhone || '' }}
				</div>
				<div class="text item">
					取件码：{{ orderDetail.detailInfo.pickupCode || '' }}
					<span
						>（{{
							pickupCodeFlag(orderDetail.detailInfo.pickupCodeFlag)
						}}）</span
					>
				</div>
			</el-card>
		</div>
		<Dialog
			:title="dialogTitle110"
			:visible="dialogVisible110"
			:width="dialogWidth110"
			@before-close="resetAll"
		>
			<yx-form
				v-loading="loading102"
				:inline="false"
				:data="formData102"
				:items="formCfg102"
				:rules="rules"
				:formAction="formAction102"
				label-position="right"
				label-width="128px"
			>
				<template slot="srcAreaId">
					<el-cascader
						ref="el_cascader"
						v-model="selectedArea"
						:options="addressOptions"
						:props="parentAreaLis"
						@change="getArea"
					></el-cascader>
				</template>
				<template slot="message">
					<div class="express-bill-message">寄件信息</div>
				</template>
				<template slot="messageT">
					<div class="express-bill-message">取件信息</div>
				</template>
				<template slot="pickupTimeDate">
					<el-row>
						<el-col :span="8">
							<el-select
								class="time-style time-style-ta"
								v-model="formData102.pickupTimeDate"
								placeholder="请选择日期"
								@change="dateChange"
							>
								<el-option
									v-for="item in dateList"
									:key="item"
									:label="item"
									:value="item"
								>
								</el-option>
							</el-select>
						</el-col>
						<el-col :span="5">
							<el-time-select
								:clearable="false"
								class="time-style time-style-t"
								placeholder="起始时间"
								v-model="formData102.startTime"
								@change="startChange"
								:picker-options="{
									start: limitStartTime,
									step: '01:00',
									end: limitEndTime,
								}"
							>
							</el-time-select>
						</el-col>
						<el-col :span="2"> <div class="time-style-center">-</div> </el-col>
						<el-col :span="5">
							<el-time-select
								:clearable="false"
								class="time-style time-style-t"
								placeholder="结束时间"
								v-model="formData102.endTime"
								@change="endChange"
								:picker-options="{
									start: limitStartTime,
									step: '01:00',
									end: limitEndTime,
									minTime: formData102.startTime,
								}"
							>
							</el-time-select>
						</el-col>
					</el-row>
				</template>
			</yx-form>
		</Dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import {
	collectionOrderDetail,
	searchPickTime,
	collectionOrderChange,
} from '@/api/collectionOrder'
import moment from 'moment'
import Dialog from '@/components/Dialog'
import { getParentAreaListByAreaId, getAreaListByParentId } from '@/api/public'
import { getConstantValueByKey } from '@/utils/helper/common'

export default {
	components: {
		YxForm,
		Dialog,
	},
	data() {
		let validatePhoneNumber = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入手机号'))
			} else if (!/^1[3456789][0-9]{9}$/.test(value)) {
				callback(new Error('请输入正确的手机号'))
			} else {
				callback()
			}
		}
		return {
			moment,
			newVal: '',
			limitStartTime: '00:00',
			limitEndTime: '23:00',
			dateList: [],
			pickupTimeSourceData: [], //上门取件时间源数据
			orderDetail: {},
			formData101: {
				orderSn: '',
				afterSalesSn: '',
				collectionOrderSn: '',
				transactionSn: '',
				collectionStatus: '',
				expressPlatform: '',
				trackingNum: '',
				addTime: moment().startOf('day').valueOf(),
				equityOrderSn: '',
				equityReductionFlag: '',
				afterSalesList: '',
			},
			formCfg101: [
				{
					type: 'custom',
					title: '订单编号：',
					dataIndex: 'orderSn',
				},
				{
					type: 'custom',
					title: '售后单号：',
					dataIndex: 'afterSalesSn',
				},
				{
					type: 'text',
					title: '揽件订单号：',
					dataIndex: 'collectionOrderSn',
				},
				// {
				// 	type: 'text',
				// 	title: ' 交易单号：',
				// 	dataIndex: 'transactionSn',
				// },
				{
					type: 'text',
					title: '揽件订单状态：',
					dataIndex: 'collectionStatusName',
				},
				{
					type: 'text',
					title: '物流公司：',
					dataIndex: 'expressPlatformName',
				},
				{
					type: 'text',
					title: '运单号：',
					dataIndex: 'trackingNum',
				},
				{
					type: 'time',
					title: '提交订单时间：',
					disabled: true,
					dataIndex: 'addTime',
					timeAttributes: {
						type: 'datetime',
					},
				},
				{
					type: 'text',
					title: '锁定权益卡订单号：',
					dataIndex: 'equityOrderSn',
				},
				{
					type: 'text',
					title: '权益卡锁定状态：',
					dataIndex: 'equityReductionFlagName',
				},
			],
			dialogTitle110: '修改揽件订单信息',
			dialogVisible110: false,
			dialogWidth110: '800px',
			formAction102: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.changeOrder()
					},
				},
			],
			// 动态级联
			addressOptions: [],
			selectedArea: [],
			parentAreaLis: {
				lazy: true,
				children: 'childAreaList',
				label: 'areaName',
				value: 'areaId',
				lazyLoad: async (node, resolve) => {
					if (node.level > 0) {
						// 后两级用另外一个接口
						if (node.children.length === 0) {
							const {
								data: { resultData, resultCode },
							} = await getAreaListByParentId({
								parentId: node.data.areaId,
							})
							if (resultCode === 0) {
								let nodes = resultData.areaList.map((item) => {
									return {
										leaf: item.childAreaCount == 0 || item.level >= 4,
										value: {
											areaId: item.areaId,
											areaName: item.areaName,
										},
										...item,
									}
								})
								resolve(nodes)
							}
						} else {
							resolve()
						}
					}
				},
			},
			loading102: false,
			formData102: {
				senderName: '',
				senderPhone: '',
				srcAreaId: '',
				senderAddress: '',
				pickupTime: '',
				pickupTimeDate: '',
				startTime: '',
				endTime: '',
			},
			formCfg102: [
				{
					type: 'custom',
					title: '',
					dataIndex: 'message',
				},
				{
					type: 'input',
					title: '寄件人',
					dataIndex: 'senderName',
				},
				{
					type: 'input',
					title: '寄件人联系方式',
					dataIndex: 'senderPhone',
				},
				{
					type: 'custom',
					title: '寄件地址',
					dataIndex: 'srcAreaId',
				},
				{
					title: '详细地址',
					type: 'input',
					dataIndex: 'senderAddress',
				},
				{
					type: 'custom',
					title: '',
					dataIndex: 'messageT',
				},
				{
					type: 'custom',
					title: '上门取件时间',
					dataIndex: 'pickupTimeDate',
				},
			],
			rules: {
				senderName: [
					{ required: true, message: '请输入寄件人', trigger: 'blur' },
				],
				senderPhone: [
					{ required: true, validator: validatePhoneNumber, trigger: 'blur' },
				],
				srcAreaId: [
					{ required: true, message: '请选择寄件地址', trigger: 'blur' },
				],
				senderAddress: [
					{ required: true, message: '请输入详细地址', trigger: 'blur' },
				],
				pickupTimeDate: [
					{ required: true, message: '请选择上门取件时间', trigger: 'blur' },
				],
			},
		}
	},
	created() {
		this.init()
	},
	methods: {
		resetAll(flag) {
			this.formData102 = {
				senderName: '',
				senderPhone: '',
				srcAreaId: '',
				senderAddress: '',
				pickupTime: '',
				pickupTimeDate: '',
				startTime: '',
				endTime: '',
			}
			this.dialogVisible110 = false
			if (flag) {
				this.init()
			} else {
				let newVal = this.newVal
				this.formData102.senderName = newVal.detailInfo.senderName
				this.formData102.senderPhone = newVal.detailInfo.senderPhone
				this.formData102.senderAddress = newVal.detailInfo.senderAddress
				this.formData102.pickupTime = newVal.detailInfo.pickupTime
				this.formData102.srcAreaId = newVal.detailInfo.srcAreaId
			}
		},
		getArea() {
			const newArea = this.$refs.el_cascader.getCheckedNodes()[0].pathLabels
			this.searchPickTime({
				provName: newArea[1],
				cityName: newArea[2],
				districtName: newArea[3],
			})
		},
		async changeOrder() {
			const newArea = this.$refs.el_cascader.getCheckedNodes()[0].pathLabels
			const area = this.selectedArea
			console.log(
				area[area.length - 1] != this.formData102.srcAreaId,
				this.formData102.senderAddress !=
					this.formData101.detailInfo.senderAddress,
				moment(
					this.formData102.pickupTimeDate + ' ' + this.formData102.endTime
				).valueOf() != this.formData101.detailInfo.pickupTime
			)
			this.loading102 = true
			const {
				data: { resultCode },
			} = await collectionOrderChange({
				collectionOrderId: this.formData101.id, //揽件单id
				senderAddress: this.formData102.senderAddress, //详细地址
				senderName: this.formData102.senderName, //发件人
				senderPhone: this.formData102.senderPhone, //发件人联系方式
				pickupTime: moment(
					this.formData102.pickupTimeDate + ' ' + this.formData102.endTime
				).valueOf(), //上门取件时间
				srcAreaId: area[area.length - 1],
				isAfreshOrder:
					area[area.length - 1] != this.formData102.srcAreaId ||
					this.formData102.senderAddress !=
						this.formData101.detailInfo.senderAddress ||
					moment(
						this.formData102.pickupTimeDate + ' ' + this.formData102.endTime
					).valueOf() != this.formData101.detailInfo.pickupTime, //标识,false:只修改寄件人或者联系电话,true:修改寄件地址或者上门取件时间,后面需要根据这个条件决定做不做取消揽件单后重新下单的处理
				srcProvince: newArea[1] || '', //发件地省份
				srcCity: newArea[2] || '', // 发件地城市
				srcCounty: newArea[3] || '', //发件地区/县
				recipientAddress: this.formData101.detailInfo.recipientAddress, //寄件人详细地址
			})
			this.loading102 = false
			this.dialogVisible110 = false
			if (resultCode === 0) {
				this.$message.success('修改成功')
				this.resetAll(true)
			}
		},
		pickupCodeFlag(val) {
			const arr = ['未核销', '已核销']
			return arr[val] || '-'
		},
		showDialogFun() {
			this.dialogVisible110 = true
			this.openAddress()
			this.searchPickTime()
		},
		async searchPickTime(json) {
			let pickupTime = JSON.parse(JSON.stringify(this.formData102.pickupTime))
			let pickupTimeDate = moment(pickupTime).format('YYYY-MM-DD HH:mm')
			let pickupTimeArr = (pickupTimeDate && pickupTimeDate.split(' ')) || []
			const {
				data: { resultData, resultCode },
			} = await searchPickTime({
				provName: json
					? json.provName
					: this.orderDetail.detailInfo.srcProvince,
				cityName: json ? json.cityName : this.orderDetail.detailInfo.srcCity,
				districtName: json
					? json.districtName
					: this.orderDetail.detailInfo.srcCounty,
				streetName: this.orderDetail.detailInfo.senderAddress,
				addrDetail: this.orderDetail.detailInfo.senderAddress,
			})
			this.loading102 = false
			console.log(pickupTime, 'pickupTime--------------------')
			if (resultCode === 0) {
				if (resultData && resultData.length > 0) {
					this.pickupTimeSourceData = resultData || []
					let defaultTime = resultData[0] // 判断原来时间是否在可选时间内
					this.dateList = resultData.map((item) => {
						if (pickupTimeArr[0] == item.serviceDate) {
							defaultTime = item
						}
						return item.serviceDate
					})

					// dateList = dateList.concat(pickupTimeArr[0])
					// let obj = {}
					// // 去重
					// this.dateList = dateList.reduce((item, next) => {
					// 	obj[next] ? '' : (obj[next] = true && item.push(next))
					// 	return item
					// }, [])

					this.$nextTick(() => {
						let pickupTimeOneHour =
							pickupTime - 3600 * 1000 * (defaultTime?.duration || 1)
						let pickupTimeDateOneHour = moment(pickupTimeOneHour).format(
							'YYYY-MM-DD HH:mm'
						)
						let pickupTimeArrOneHour =
							(pickupTimeDateOneHour && pickupTimeDateOneHour.split(' ')) || []
						if (pickupTime > moment(resultData[0].startTime).valueOf()) {
							this.formData102.pickupTimeDate = pickupTimeArr[0]
						}
						this.formData102.startTime = pickupTimeArrOneHour[1]
						this.formData102.endTime = pickupTimeArr[1]

						if (defaultTime) {
							defaultTime.startTime = moment(defaultTime.startTime).format(
								'YYYY-MM-DD HH:mm'
							)
							defaultTime.endTime = moment(defaultTime.endTime).format(
								'YYYY-MM-DD HH:mm'
							)
							this.limitStartTime =
								(defaultTime.startTime &&
									defaultTime.startTime.split(' ')[1]) ||
								'00:00'
							this.limitEndTime =
								(defaultTime.endTime && defaultTime.endTime.split(' ')[1]) ||
								'23:00'
						} else {
							this.limitStartTime = pickupTimeArrOneHour[1]
							this.limitEndTime = pickupTimeArr[1]
						}
					})
				} else {
					this.formData102.pickupTimeDate = ''
					this.formData102.startTime = ''
					this.formData102.endTime = ''
				}
			}
		},
		startChange(val) {
			let duration = 1 //时间间隔默认1小时
			this.pickupTimeSourceData?.forEach((item) => {
				if (item.serviceDate == this.formData102.pickupTimeDate) {
					duration = item.duration
				}
			})
			this.formData102.startTime = val
			let nextTime = parseInt(val.split(':')[0]) + duration
			this.formData102.endTime =
				nextTime < 10 ? '0' + nextTime + ':00' : nextTime + ':00'
		},
		endChange(val) {
			let duration = 1 //时间间隔默认1小时
			this.pickupTimeSourceData?.forEach((item) => {
				if (item.serviceDate == this.formData102.pickupTimeDate) {
					duration = item.duration
				}
			})
			this.formData102.endTime = val
			let nextTime = parseInt(val.split(':')[0]) - duration
			this.formData102.startTime =
				nextTime < 10 ? '0' + nextTime + ':00' : nextTime + ':00'
		},
		async openAddress() {
			this.loading102 = true
			const {
				data: { resultData, resultCode },
			} = await getParentAreaListByAreaId({
				areaId: this.formData102.srcAreaId,
			})
			this.loading102 = false
			if (resultCode === 0) {
				this.addressOptions = this.getDefautlArea(
					JSON.parse(JSON.stringify(resultData.areaList))
				)
				this.$nextTick(() => {
					this.selectedArea = this.myDefautlArea(
						JSON.parse(JSON.stringify(resultData.areaList))
					)
				})
			}
		},
		getDefautlArea(areaList) {
			areaList.forEach((item) => {
				if (item.childAreaCount == 0 || item.level >= 4) {
					item.leaf = true
				}
				// item.value = {
				// 	areaId: item.areaId,
				// 	areaName: item.areaName,
				// }
				if (item.childAreaList) {
					this.getDefautlArea(item.childAreaList)
				}
			})
			return areaList
		},
		myDefautlArea(areaList, arr = []) {
			areaList.forEach((item) => {
				if (item.childAreaList) {
					arr.push(item.areaId)
					this.myDefautlArea(item.childAreaList, arr)
				}
			})
			return arr
		},
		dateChange() {
			let duration = 1
			this.pickupTimeSourceData?.forEach((item) => {
				if (item.serviceDate == this.formData102.pickupTimeDate) {
					duration = item.duration
				}
			})
			let nextTime =
				parseInt(this.formData102.startTime?.split(':')[0]) + duration
			this.formData102.endTime =
				nextTime < 10 ? '0' + nextTime + ':00' : nextTime + ':00'
		},
		async init() {
			this.showLoading = true
			const {
				data: { resultCode, resultData },
			} = await collectionOrderDetail({
				id: this.$route.params.id,
			})
			this.showLoading = false
			if (resultCode == 0) {
				const arr = ['-', '顺丰']
				const arr2 = ['无运保卡抵扣渠道', '运保卡抵扣渠道', '']
				resultData.expressPlatformName = arr[resultData.expressPlatform]
				resultData.equityReductionFlagName =
					arr2[resultData.equityReductionFlag]
				resultData.collectionStatusName = getConstantValueByKey(
					this.$store.state.app.constant.collection_status,
					resultData.collectionStatus,
					'-',
					'collectionStatus'
				)

				this.formData101 = resultData
				this.orderDetail = resultData
				const newVal = JSON.parse(JSON.stringify(resultData))
				this.newVal = newVal
				this.formData102.senderName = newVal.detailInfo.senderName
				this.formData102.senderPhone = newVal.detailInfo.senderPhone
				this.formData102.senderAddress = newVal.detailInfo.senderAddress
				this.formData102.pickupTime = newVal.detailInfo.pickupTime
				this.formData102.srcAreaId = newVal.detailInfo.srcAreaId
			} else {
				this.formData101 = {}
			}
		},
	},
}
</script>

<style lang="scss">
.express-bill-message {
	position: relative;
	font-size: 18px;
	color: #333;
	// margin-left: 8px;
	left: -120px;
	// &::after {
	// 	content: '*';
	// 	color: #ff4949;
	// 	position: absolute;
	// 	left: -12px;
	// }
}
.time-style.time-style-t {
	width: 140px;
}
.time-style.time-style-ta {
	width: 180px;
}
.time-style-center {
	text-align: center;
}
.express-bill-detail {
	.order-msg {
		position: relative;
		height: 40px;
		line-height: 40px;
		vertical-align: middle;
		margin-bottom: 20px;
		.o-title {
			display: inline-block;
			color: #333;
			font-size: 22px;
			margin-right: 12px;
		}
		.o-button {
			vertical-align: bottom;
			margin-bottom: 6px;
		}
	}
	.el-form--inline .el-form-item {
		margin-right: 30px;
	}
	.flex-box {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.text {
		font-size: 14px;
		span {
			color: brown;
		}
	}

	.item {
		margin-bottom: 18px;
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: '';
	}
	.clearfix:after {
		clear: both;
	}

	.box-card {
		width: 30%;
	}
}
</style>

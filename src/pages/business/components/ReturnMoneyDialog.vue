<template>
	<!-- 订单补款弹窗 S -->
	<Dialog
		title="订单补款"
		:visible="visible"
		width="600px"
		@before-close="resetForm"
	>
		<p class="text-warn" v-if="tableData103.length > 0">
			该订单已经发起过补款，详细信息如下，请确认是否还要再次发起
		</p>
		<yx-form
			label-width="130px"
			:inline="false"
			ref="dialog189"
			label-position="right"
			:data="returnMoneyFormData"
			:items="returnMoneyFormCfg"
			:rules="funRules"
			:formAction="returnMoneyDialogBottomBtn"
		>
			<template slot="remarkType">
				<el-cascader
					v-if="dialogVisible"
					:options="remarkTypeOptions"
					:props="{ expandTrigger: '请选择补款类型' }"
					@change="handleRemarkTypeChange"
				></el-cascader>
			</template>
			<template slot="trackingNum">
				<el-radio-group v-model="trackingChecked">
					<el-radio
						v-for="(item, index) in shipmentNumberList"
						:key="index"
						:label="item.trackingNum"
					>
						{{ item.trackingNum }}</el-radio
					>
				</el-radio-group>
			</template>
			<template slot="compensationAmount">
				<el-input
					type="number"
					class="wi100"
					oninput="value=value.toString().match(/^\d+(?:\.\d{0,2})?/)"
					max="100"
					min="0"
					@change="compensationAmountChange"
					v-model="returnMoneyFormData.compensationAmount"
					autocomplete="off"
				></el-input>
			</template>

			<template slot="supplierCompensationAmount">
				<el-input
					type="number"
					class="wi100"
					:disabled="disabledTrue"
					oninput="value=value.toString().match(/^\d+(?:\.\d{0,2})?/)"
					max="100"
					min="0"
					@change="compensationChange"
					v-model="returnMoneyFormData.supplierCompensationAmount"
					autocomplete="off"
				></el-input>
				平台承担<el-input
					type="number"
					class="wi100"
					v-model="returnMoneyFormData.platformCompensationAmount"
					autocomplete="off"
					disabled
				></el-input>
			</template>
			<template slot="uploading">
				<el-input
					class="textarea"
					size="small"
					placeholder="图片复制/粘贴"
					show-word-limit
					@paste.native="_uploadImageHttpRequest"
				>
				</el-input>
			</template>
		</yx-form>

		<div v-if="tableData103.length > 0">
			<yx-table
				:select="false"
				v-loading="tableDataLoading103"
				:columns="tableColumns103"
				:data="tableData103"
			>
				<template slot="takeAmount" slot-scope="scope">
					<span style="color: #ff0000">{{
						scope.row.supplierCompensationAmount
					}}</span>
					/
					<span style="color: #00cc00">{{
						scope.row.platformCompensationAmount
					}}</span>
				</template>
			</yx-table>
		</div>
	</Dialog>
	<!-- 订单补款弹窗 E -->
</template>

<script>
import Dialog from '@/components/Dialog'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { uploadImageList } from '@/api/image'
import {
	getCompensationInfo,
	getCompensationResonList,
} from '@/api/afterSales.js'
import { getBigImg } from '@/utils/imageTool'
import { addPayment, subsidyQueryPage } from '@/api/yxCompensationAmount.js'
import { accSub } from '@/utils/helper/common'
export default {
	name: 'RefundDialog',
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		activeRow: {
			type: Object,
			default: () => ({}),
		},
	},
	components: {
		YxForm,
		YxTable,
		Dialog,
	},
	data() {
		return {
			imageDialog: false,
			accSub,
			comment: '',
			// 退款弹窗
			visible: false,
			refundDialogLoading: false,

			// 订单补款弹窗
			tableDataLoading103: false,
			returnMoneyDialogBottomBtn: [
				{
					title: '确定',
					type: 'primary',
					click: async () => {
						this.$refs.dialog189.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.savereturnMoney()
							}
						})
					},
				},
			],
			// 订单补款弹窗 - 表单
			returnMoneyFormData: {
				orderSn: '',
				supplementType: '1',
				refundWay: '1',
				remarkType: '9',
				activityImage: [],
				compensationAmount: '',
				refundDesc: '',
				remark: '',
				supplierCompensationAmount: '',
				platformCompensationAmount: '',
				childRemark: '',
			},
			funRules: {
				uploading: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (this.returnMoneyFormData.activityImage.length == 0) {
								callback(new Error('请上传图片!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				supplierCompensationAmount: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请正确填写商家承担金额!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				remarkType: [
					{ required: true, message: '请选择补款原因!', trigger: 'blur' },
				],
				compensationAmount: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请正确填写打款金额!'))
							} else if (value <= 0) {
								callback(new Error('请输入大于0的数值!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				// remark: [
				// 	{ required: true, message: '请输入补款备注!', trigger: 'blur' },
				// ],
			},
			returnMoneyFormCfg: [
				{
					title: '订单号',
					type: 'text',
					dataIndex: 'orderSn',
				},
				// {
				// 	title: '补款方式',
				// 	type: 'radio',
				// 	dataIndex: 'supplementType',
				// 	label: 'value',
				// 	options: [
				// 		{
				// 			supplementType: '1',
				// 			value: '到消费者微信零钱',
				// 		},
				// 	],
				// },
				// {
				// 	title: '补款类型',
				// 	type: 'radio',
				// 	label: 'value',
				// 	dataIndex: 'refundWay',
				// 	options: [
				// 		{
				// 			refundWay: '1',
				// 			value: '普通退款',
				// 		},
				// 		{
				// 			refundWay: '2',
				// 			value: '售后申诉退款',
				// 		},
				// 		{
				// 			refundWay: '3',
				// 			value: '二次申诉退款',
				// 		},
				// 	],
				// },
				{
					title: '补款原因',
					type: 'custom',
					label: 'value',
					dataIndex: 'remarkType',
					// options: [
					// 	{
					// 		remarkType: '8',
					// 		value: '特殊处理',
					// 	},
					// 	{
					// 		remarkType: '9',
					// 		value: '退货运费',
					// 	},
					// 	{
					// 		remarkType: '10',
					// 		value: '质量问题',
					// 	},
					// 	{
					// 		remarkType: '17',
					// 		value: '超售后期退款',
					// 	},
					// 	{
					// 		remarkType: '19',
					// 		value: '破损补款',
					// 	},
					// 	{
					// 		remarkType: '13',
					// 		value: '错发补款',
					// 	},
					// 	{
					// 		remarkType: '12',
					// 		value: '漏发补款',
					// 	},
					// 	{
					// 		remarkType: '20',
					// 		value: '未按约定时间发货',
					// 	},
					// ],
					change: (val) => {
						if (val == 8) {
							this.returnMoneyFormCfg[5].disabled = true
							this.returnMoneyFormData.refundDesc = '2'
						} else {
							this.returnMoneyFormCfg[5].disabled = false
						}
					},
				},
				{
					title: '打款金额',
					type: 'custom',
					dataIndex: 'compensationAmount',
				},
				{
					title: '商家承担金额',
					type: 'custom',
					dataIndex: 'supplierCompensationAmount',
				},
				{
					title: '图片上传',
					type: 'custom',
					dataIndex: 'uploading',
				},
				{
					type: 'uploadImage',
					dataIndex: 'activityImage',
					uploadAttributes: {
						limit: 3,
						imageName: 'imageUrl',
						accept: 'image/jpeg, image/jpg, image/png',
						beforeAvatarUpload: (file) => this.beforeAvatarUpload(file),
						httpRequest: (file) =>
							this._uploadImageHttpRequest(file, 'clickUploading'),
					},
				},
				// {
				// 	title: '补款说明',
				// 	type: 'radio',
				// 	dataIndex: 'refundDesc',
				// 	label: 'value',
				// 	options: [
				// 		{
				// 			refundDesc: '1',
				// 			value: '商家承担',
				// 		},
				// 		{
				// 			refundDesc: '2',
				// 			value: '平台承担',
				// 		},
				// 	],
				// },
				{
					title: '客户退货物流单号',
					type: 'custom',
					dataIndex: 'trackingNum',
				},
				{
					title: '备注',
					type: 'textarea',
					dataIndex: 'remark',
				},
			],
			trackingChecked: '',
			shipmentNumberList: [],
			tableData103: [],
			tableData104: [],
			tableColumns103: [
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'string',
					dataIndex: 'id',
					title: '补款ID',
				},
				{
					type: 'custom',
					dataIndex: 'takeAmount',
					title: '商家承担金额/平台承担金额',
				},
				{
					type: 'string',
					dataIndex: 'trackingNum',
					title: '客户退货物流单号',
				},
				{
					type: 'string',
					dataIndex: 'compensationPlatformType',
					title: '发起方',
					customRender: (row) => {
						if (row.compensationPlatformType == 8) {
							return '商家发起'
						} else if (row.compensationPlatformType == 4) {
							return '平台发起'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'remarkType',
					title: '补款方式',
					customRender: (row) => {
						const arr = {
							8: '特殊处理',
							9: '退货运费',
							10: '质量问题',
							17: '超售后期退款',
							11: '破损补款',
							12: '错发补款',
							13: '漏发补款',
							14: '未按约定时间发货',
							19: '破损补款',
							20: '未按约定时间发货',
						}
						return arr[row.remarkType] || '-'
					},
				},
				{
					title: '备注',
					type: 'string',
					dataIndex: 'remark',
				},
				{
					title: '派发状态',
					type: 'string',
					dataIndex: 'compensationState',
					customRender: (row) => {
						const arr = ['已派发', '未派发']
						return arr[row.compensationState] || '已派发'
					},
				},
				{
					title: '是否汇聚补款',
					type: 'string',
					dataIndex: 'isHJ',
					customRender: (row) => {
						if (row.isHJ == 1) {
							return '是'
						} else {
							return '否'
						}
					},
				},
			],
			remarkTypeOptions: [],
		}
	},
	methods: {
		savereturnMoney: async function () {
			let imgList = this.returnMoneyFormData.activityImage.map((item) => {
				return item.imageUrlTemp
			})
			const params = {
				orderId: this.activeRow.orderId, //订单id
				orderDeliverState: this.activeRow.deliverState, //当前订单发货状态
				orderSn: this.activeRow.orderSn, //订单id
				platformCompensationAmount:
					this.returnMoneyFormData.platformCompensationAmount, //平台补偿金额
				supplierCompensationAmount:
					this.returnMoneyFormData.supplierCompensationAmount, //商家补偿金额
				compensationAmount: this.returnMoneyFormData.compensationAmount, //补偿金额
				remark: this.returnMoneyFormData.remark, //备注
				supplementType: this.returnMoneyFormData.supplementType, //补偿到账方式 1到消费者微信零钱 2到店主余额
				organizationId: this.activeRow.organizationId, //组织ID
				weixinUserId: this.activeRow.weixinUserId, //微信用户id
				imageUrlList: imgList, //截图图片
				refundWay: this.returnMoneyFormData.refundWay,
				remarkType: this.returnMoneyFormData.remarkType,
				childRemark: this.returnMoneyFormData.childRemark,
				refundDesc: this.returnMoneyFormData.refundDesc,
				trackingNum: this.trackingChecked || '',
			}
			if (!params.compensationAmount.trim() || params.compensationAmount <= 0) {
				return this.$message.warning('请正确填写打款金额！')
			}
			if (params.imageUrlList.length == 0) {
				return this.$message.warning('请上传图片！')
			}
			if (params.imageUrlList.length > 3) {
				return this.$message.warning('只能上传三张图片！')
			}
			// return
			const {
				data: { resultCode, resultMsg },
			} = await addPayment(params)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible = false
				this.resetForm()
				this.$emit('fatherMethodInit')
			}
		},
		compensationAmountChange(e) {
			if (e) {
				this.returnMoneyFormData.platformCompensationAmount = this.accSub(
					e,
					this.returnMoneyFormData.supplierCompensationAmount
				)
			}
		},
		compensationChange(e) {
			if (this.returnMoneyFormData.compensationAmount) {
				this.returnMoneyFormData.platformCompensationAmount = this.accSub(
					this.returnMoneyFormData.compensationAmount,
					e
				)
			} else {
				this.returnMoneyFormData.supplierCompensationAmount = ''
				this.$message.error('请先输入打款金额')
				return
			}
		},
		beforeAvatarUpload(params) {
			const isLt2M = params.size / 1024 / 1024 < 5
			if (!isLt2M) {
				this.$message.error('上传文件大于5M,请重新选择!')
				return false
			} else {
				return params
			}
		},
		// 上传图标图片
		_uploadImageHttpRequest: async function (params, way) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#addMaterial', imageType: 80 })
			)
			const isLt2M = params.file
				? params.file.size / 1024 / 1024 < 5
				: params.clipboardData.files[0].size / 1024 / 1024 < 5 //限制上传
			if (!isLt2M) {
				this.$message.error('上传文件大于5M,请重新选择!')
				return
			}
			if (this.returnMoneyFormData.activityImage.length >= 3) {
				this.$message.error('图片不能超过三张')
				return
			}
			// 粘贴时进行处理
			let uploa
			if (params.clipboardData && params.clipboardData.files[0]) {
				uploa = params.clipboardData.files[0]
			} else {
				uploa = params.file
			}
			formData.append('file', uploa)
			if (this.imageDialog && way != 'clickUploading') {
				return
			}
			this.imageDialog = true
			const res = await uploadImageList(formData)
			this.imageDialog = false

			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				this.returnMoneyFormData.activityImage.push({
					imageUrl: getBigImg(res.data.resultData.imageList[0].imageUrl),
					imageUrlTemp: res.data.resultData.imageList[0].imageUrl,
				})
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
		async init() {
			const row = this.activeRow
			this.dialogVisible = true

			this.tableDataLoading103 = true
			const {
				data: { resultCode, resultData },
			} = await getCompensationInfo({
				trackingNum: row.trackingNum,
				orderSn: row.orderSn,
				needTrackingNum: 1,
			})
			if (resultCode === 0) {
				resultData.trackingNumList &&
					resultData.trackingNumList.length > 0 &&
					this.initReplenishmentTable(resultData, row.trackingNum)

				this.returnMoneyFormData.orderSn = row.orderSn
				this.tableDataLoading103 = false
				this.refundConfirmLoading = false
			}
		},
		// 补款记录
		async subsidyQueryPage() {
			this.tableDataLoading103 = true
			const row = this.activeRow
			let {
				data: { resultCode, resultData },
			} = await subsidyQueryPage({
				orderId: row.orderId,
				queryType: 2,
			})
			this.tableDataLoading103 = false
			if (resultCode == 0) {
				this.tableData103 =
					resultData && resultData.records ? resultData.records : []
			}
		},
		// 查看物流单补款补偿记录
		async initReplenishmentTable(resultData, trackingNum) {
			// 物流单号集合
			let trackingNumList = resultData.trackingNumList || []
			let ntrackingNumList = trackingNumList.sort()
			let shipmentNumberList = []
			let obj = {}
			for (let i = 0; i < ntrackingNumList.length; i++) {
				if (ntrackingNumList[i] == ntrackingNumList[i + 1]) {
					if (!obj[ntrackingNumList[i]]) {
						obj[ntrackingNumList[i]] = {
							trackingNum: ntrackingNumList[i],
							isItRedundant: true,
						}
					}
				} else {
					if (!obj[ntrackingNumList[i]]) {
						obj[ntrackingNumList[i]] = {
							trackingNum: ntrackingNumList[i],
							isItRedundant: false,
						}
					}
				}
			}
			for (let key in obj) {
				shipmentNumberList.push(obj[key])
			}
			this.shipmentNumberList = shipmentNumberList
			this.$nextTick(() => {
				shipmentNumberList.forEach((item) => {
					if (item.trackingNum == trackingNum) {
						this.trackingChecked = item.trackingNum
					}
				})
			})
			if (!this.trackingChecked)
				this.trackingChecked = shipmentNumberList[0].trackingNum
		},
		// 关闭弹窗
		resetForm() {
			this.dialogVisible = false
			this.trackingChecked = ''
			this.shipmentNumberList = []
			this.returnMoneyFormData = {
				orderSn: '',
				supplementType: '1',
				refundWay: '1',
				remarkType: '9',
				activityImage: [],
				compensationAmount: '',
				refundDesc: '',
				remark: '',
				supplierCompensationAmount: '',
				platformCompensationAmount: '',
				childRemark: '',
			}
		},
		// 获取补款类型级联选择器数据
		async fetchRemarkTypeOptions() {
			const {
				data: { resultData },
			} = await getCompensationResonList()

			// 格式化后台提供的列表
			const newOptions = resultData.map((item) => {
				return {
					value: item.remarkType,
					label: item.reason,
					children: item.remarks.map((childItem) => {
						return {
							value: childItem,
							label: childItem,
						}
					}),
				}
			})

			this.remarkTypeOptions = newOptions
		},
		// 写入补款类型级联选择器数据
		handleRemarkTypeChange(e) {
			const [remarkType, childRemark] = e
			this.returnMoneyFormData.remarkType = remarkType
			this.returnMoneyFormData.childRemark = childRemark
		},
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
			if (this.visible) {
				this.init()
				this.subsidyQueryPage()
				this.fetchRemarkTypeOptions()
			}
		},
		dialogVisible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.visible = newVlaue
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.text-warn {
	color: brown;
	padding: 6px 0;
	margin: 0 0 0 60px;
}
.wi100 {
	width: 100px;
}
</style>

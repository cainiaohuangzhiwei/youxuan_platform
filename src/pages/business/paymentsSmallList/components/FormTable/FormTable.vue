<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			>
				<template #supplierName>
					<el-input
						v-model="searchData.supplierName"
						placeholder="请选择商家"
						value-key="supplierName"
						label="supplierName"
						@focus="selectSupplier"
						clearable
						@clear="
							() => {
								searchData.supplierName = ''
								searchData.supplierId = ''
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="formsDialog = true"
						></el-button>
					</el-input>
				</template>
			</yx-form>

			<el-row>
				<div style="float: right">
					<el-button
						v-auth="'exportSmallPayment'"
						size="small"
						@click="_exportTransfer"
						type="primary"
						>导出</el-button
					>
					<el-button
						v-if="batchShow"
						size="small"
						v-auth="'batchCloseSmallPayment'"
						@click="_batch(1)"
						type="primary"
						>批量关闭</el-button
					>
					<el-button
						size="small"
						v-if="batchShow"
						@click="_batch(2)"
						v-auth="'batchRejectSmallPayment'"
						type="primary"
						>批量驳回</el-button
					>
				</div>
				<div class="amount_box">
					打款金额<span>￥{{ numberFormat(compensationAmountTotal, 2) }}</span
					>商家承担<span>￥{{ supplierCompensationAmountTotal }}</span
					>,平台承担<span>￥{{ platformCompensationAmountTotal }}</span>
				</div>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:select="true"
					:data="tableData"
					:selectionChange="selectionChange"
				>
				</yx-table>
			</el-row>
		</div>
		<!-- //快速处理 -->
		<Dialog
			:title="titleDialog"
			:visible="reviewReasonLoding"
			width="50%"
			:bottomBtn="reviewReasonBottomBtn"
			@before-close="reviewReasonLoding = false"
			class="examineA"
		>
			<yx-table
				v-loading="operationLoading"
				:columns="operationTableColumns"
				:data="operationTableData"
			>
				<template slot="imageUrls" slot-scope="scope">
					<div class="goods_img_list">
						<div v-for="item in scope.row.imageUrls" :key="item">
							<div class="goods_img_list_warp">
								<el-image class="" fit="cover" :src="getBigImg(item)">
									<div slot="error" class="el-image__error">
										<i class="el-icon-picture-outline"></i>
									</div>
								</el-image>
							</div>
						</div>
					</div>
				</template>
			</yx-table>
			<yx-form
				label-width="130px"
				:inline="false"
				label-position="right"
				:data="processingData"
				:items="processingCfg"
				:rules="funRules"
			>
				<template slot="amount">
					<div>
						<span>商家承担 {{ vertical.supplierCompensationAmount }}</span>
						<span style="margin-left: 30px"
							>平台承担 {{ vertical.platformCompensationAmount }}</span
						>
					</div>
				</template>

				<template slot="supplierCompensationAmount">
					<el-input
						oninput="value=value.toString().match(/^\d+(?:\.\d{0,2})?/)"
						type="number"
						class="wi100"
						max="100"
						min="0"
						@change="moneyCalculate"
						v-model="processingData.supplierCompensationAmount"
						autocomplete="off"
					></el-input>
					平台承担<el-input
						type="number"
						class="wi100"
						v-model="processingData.platformCompensationAmount"
						autocomplete="off"
						disabled
					></el-input>
				</template>
				<template slot="remark">
					<el-input
						type="textarea"
						v-model.trim="processingData.remark"
						maxlength="50"
						:autosize="{ minRows: 2, maxRows: 4 }"
						placeholder="请输入原因（驳回时，原因必填）"
					></el-input>
				</template>
			</yx-form>
		</Dialog>

		<!-- //审核原因 -->
		<Dialog
			:title="auditDialog"
			:visible="auditLoding"
			width="50%"
			:bottomBtn="auditBottomBtn"
			@before-close="auditLoding = false"
		>
			<span>本次操作将{{ auditDialog }}<br />原因</span>
			<el-input
				type="textarea"
				v-model.trim="transferRemark"
				maxlength="50"
				:autosize="{ minRows: 2, maxRows: 4 }"
				placeholder="请输入原因"
			></el-input>
		</Dialog>
		<!-- 商家/商家列表 -->
		<supply-dialog
			:itemInfo="supplyRow"
			:visible.sync="formsDialog"
			@fatherMethodInit="
				(row) => {
					searchData.supplierName = row.supplierName
					searchData.supplierId = row.supplierId
				}
			"
		/>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import Dialog from '@/components/Dialog'
import SupplyDialog from '@/components/SupplyDialog'

import {
	getConstantValueByKey,
	numberFormat,
	downloadFile,
	accSub,
} from '@/utils/helper/common'
import YxTable from '@wg-vue-materials/yx-table'
import {
	search,
	detail,
	reject,
	close,
	smallMoneyExport,
	batchReject,
	batchClose,
} from '@/api/yxCompensationAmount'
import { uploadImageList } from '@/api/image'
import { getBigImg } from '@/utils/imageTool'

import moment from 'moment'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
		SupplyDialog,
	},
	data() {
		return {
			numberFormat: numberFormat,
			accSub,
			getBigImg,
			showLoading: false,
			formsDialog: false,
			batchShow: false,
			operationLoading: false,
			reviewReasonLoding: false,
			auditLoding: false,
			operationRecordsLoding: false,
			vertical: {},
			clickPlace: 0,
			titleDialog: '',
			transferRemark: '',
			compensationAmountTotal: 0, // 转账金额
			selectionData: [],
			platformCompensationAmountTotal: 0, // 平台补偿金额
			supplierCompensationAmountTotal: 0, // 商家补偿金额
			searchData: {
				supplierName: '',
				supplierId: '',
				processState: '', // 处理状态：1.待商家处理；2.待平台处理；3.已完成；4.已关闭
				createTimeStart: moment().startOf('day').valueOf(), // 开始时间
				createTimeEnd: moment().endOf('day').valueOf(), // 结束时间
				approvalStatus: '', // 审核状态
				orderSn: '',
			},
			processingData: {
				supplierCompensationAmount: '',
				platformCompensationAmount: '',
				remark: '',
				activityImage: [],
			},
			processingCfg: [
				{
					title: '承担金额',
					type: 'custom',
					dataIndex: 'amount',
				},
				{
					title: '商家承担金额',
					type: 'custom',
					dataIndex: 'supplierCompensationAmount',
				},
				{
					title: '原因',
					type: 'custom',
					dataIndex: 'remark',
				},
				{
					type: 'uploadImage',
					title: '请上传驳回材料',
					dataIndex: 'activityImage',
					uploadAttributes: {
						limit: 3,
						imageName: 'imageUrl',
						accept: 'image/jpeg, image/jpg, image/png',
						beforeAvatarUpload: (file) => this.beforeUpload(file),
						httpRequest: (file) => this._uploadImageHttpRequest(file),
					},
					hide: false,
				},
			],
			orderStatus: [],
			reviewReasonBottomBtn: [
				{
					title: '确认关闭',
					type: 'info',
					auth: 'closeSmallPayment',

					click: () => {
						this._audit(1)
					},
				},
				{
					title: '确认驳回',
					auth: 'rejectSmallPayment',
					click: () => {
						this._audit(2)
					},
				},
			],
			auditBottomBtn: [
				{
					title: '确认',
					click: () => {
						this._batchConnector()
					},
				},
			],
			searchCfg: [
				{
					title: '商家名称',
					type: 'custom',
					dataIndex: 'supplierName',
					placeholder: '请输入商家名称',
				},
				{
					type: 'input',
					title: '订单号',
					dataIndex: 'orderSn',
				},
				{
					type: 'select',
					title: '处理状态',
					dataIndex: 'processState',
					label: 'value',
					options: [
						{
							processState: '',
							value: '全部',
						},
						{
							processState: 1,
							value: '待商家处理',
						},
						{
							processState: 2,
							value: '待平台处理',
						},
						{
							processState: 3,
							value: '已完成',
						},
						{
							processState: 4,
							value: '已关闭',
						},
					],
					change: (val) => {
						this._fundAccountTransferList(true)
						this.batchShow = val == 2
					},
				},
				{
					title: '创建时间',
					type: 'datetimerange',
					dataIndex: ['createTimeStart', 'createTimeEnd'],
				},
				{
					type: 'select',
					title: '发起方',
					dataIndex: 'compensationPlatformType',
					label: 'value',
					options: [
						{
							compensationPlatformType: '',
							value: '全部',
						},
						{
							compensationPlatformType: 4,
							value: '平台',
						},
						{
							compensationPlatformType: 8,
							value: '商家',
						},
					],
				},
				{
					type: 'select',
					title: '派发方',
					dataIndex: 'distributePlatformType',
					label: 'value',
					options: [
						{
							distributePlatformType: '',
							value: '全部',
						},
						{
							distributePlatformType: 4,
							value: '平台',
						},
						{
							distributePlatformType: 8,
							value: '商家',
						},
					],
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
						this._fundAccountTransferList(true)
					},
				},
			],
			operationTableData: [],
			operationTableColumns: [
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '时间',
				},
				{
					type: 'string',
					dataIndex: 'processType',
					title: '处理事项',
					customRender: (row) => {
						let TYPE = [
							'',
							'生成小额打款记录',
							'发起申诉',
							'申诉打回',
							'修改商家承担金额驳回',
							'关闭',
							'商家同意',
							'自动确认',
						]
						return TYPE[row.processType]
					},
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '处理理由',
				},
				{
					type: 'custom',
					dataIndex: 'imageUrls',
					title: '图片',
				},
				{
					type: 'string',
					dataIndex: 'operatorName',
					title: '处理人',
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'string',
					dataIndex: 'orderSn',
					title: '订单号',
				},
				{
					type: 'data',
					dataIndex: 'createTime',
					title: '创建时间',
				},
				{
					type: 'amount',
					dataIndex: 'compensationAmount',
					title: '打款金额',
				},
				{
					type: 'amount',
					dataIndex: 'supplierCompensationAmount',
					title: '商家承担金额',
				},
				{
					type: 'amount',
					dataIndex: 'platformCompensationAmount',
					title: '平台承担金额',
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
					dataIndex: 'appealCount',
					title: '申诉次数',
				},
				{
					type: 'newMap',
					dataIndex: 'distributePlatformType',
					title: '派发方',
					options: [
						['4', '平台'],
						['8', '商家'],
					],
				},
				{
					type: 'string',
					dataIndex: 'operatorName',
					title: '打款人',
				},
				{
					type: 'string',
					dataIndex: 'processState',
					title: '处理状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.PROCESS_STATE,
							row.processState,
							'-',
							'processState'
						)
					},
				},
				{
					type: 'action',
					width: 150,
					title: '操作',
					actions: [
						{
							title: '快速处理',
							auth: 'closeSmallPayment' && 'rejectSmallPayment',
							click: (row) => {
								this.reviewReasonLoding = true
								this.transferRemark = ''
								this.processingData = {
									supplierCompensationAmount: row.supplierCompensationAmount,
									platformCompensationAmount: row.platformCompensationAmount,
									remark: '',
									activityImage: [],
								}
								this.vertical = row
								this._detail()
								this.clickPlace = 1
							},
							customRender: (action, row) => {
								action.hide = row.processState != 2
								return action
							},
						},
						{
							title: '查看详情',
							auth: '',
							click: (row) => {
								this.$router.push({
									path: `/fund/paymentsSmallDetails`,
									query: {
										id: row.id,
									},
								})
							},
						},
					],
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._fundAccountTransferList()
				},
			},
		}
	},

	created() {
		this._fundAccountTransferList(true)
	},

	methods: {
		async beforeUpload(file) {
			const isLt2M = file.size / 1024 / 1024 < 2
			if (!isLt2M) {
				this.$message({
					message: '上传文件大于2M,请重新选择!',
					type: 'warning',
				})
				return Promise.reject(isLt2M)
			}
			return isLt2M
		},
		previewSrcList(list) {
			return list.map((item) => {
				return getBigImg(item)
			})
		},
		moneyCalculate(e) {
			if (this.vertical.compensationAmount) {
				this.processingData.platformCompensationAmount = this.accSub(
					this.vertical.compensationAmount,
					e
				)
			} else {
				this.processingData.platformCompensationAmount = 0
			}
		},
		//批量
		_batchConnector: async function () {
			let Url = this.clickPlace == 1 ? batchClose : batchReject
			let paramJson = {
				remark: this.transferRemark,
				idList: [],
			}
			this.selectionData.map((item) => {
				paramJson.idList.push(item.id)
			})
			if (!paramJson.remark) {
				return this.$message.error('请输入原因')
			}
			console.log('11', Url, paramJson)
			// return
			let {
				data: { resultCode },
			} = await Url(paramJson)
			if (resultCode == 0) {
				this.$message.success('成功')
				this.auditLoding == false
				this._fundAccountTransferList(true)
			}
		},
		//快速处理Table列表
		_detail: async function () {
			let {
				data: { resultCode, resultData },
			} = await detail({ id: this.vertical.id })
			if (resultCode == 0) {
				this.operationTableData = resultData.records
			}
		},
		selectSupplier(e) {
			e.target.blur()
			this.formsDialog = true
		},
		// 上传图片
		_uploadImageHttpRequest: async function (params) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#addMaterial', imageType: 80 })
			)
			formData.append('file', params.file)
			const res = await uploadImageList(formData)
			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				this.processingData.activityImage.push({
					imageUrl: getBigImg(res.data.resultData.imageList[0].imageUrl),
					imageUrlTemp: res.data.resultData.imageList[0].imageUrl,
				})
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
		// 、、批量审核
		_batch(v) {
			if (this.selectionData.length == 0) {
				return this.$message.warning('请勾选批量数据')
			}
			this.transferRemark = ''
			this.clickPlace = v
			this.auditDialog = v == 1 ? '批量关闭' : '批量驳回'
			this.auditLoding = true
		},
		_audit: async function (v) {
			let _this = this
			//1关2驳
			let title = ''
			if (v == 1) {
				title = '关闭小额打款记录，将会自动修改商家承担金额为0，请确认是否关闭'
			} else if (v == 2) {
				if (this.processingData.supplierCompensationAmount == 0) {
					title = '商家承担金额为0，系统将为你关闭扣款，请确认是否关闭'
				} else {
					title =
						'现“商家承担' +
						this.processingData.supplierCompensationAmount +
						'平台承担' +
						this.processingData.platformCompensationAmount +
						'，请确认是否按照现有金额驳回'
				}
			}
			this.$confirm(title, '提示', {
				type: 'warning',
				async callback(action) {
					if (action === 'confirm') {
						_this.disposeMethod(v)
					}
				},
			})
		},
		disposeMethod: async function (v) {
			console.log('1111', v)
			let paramJson = this.processingData
			paramJson.id = this.vertical.id
			paramJson.imageUrlList = []
			this.processingData.activityImage.map((item) => {
				paramJson.imageUrlList.push(item.imageUrlTemp)
			})
			if (v == 2 && !paramJson.remark) {
				return this.$message.warning('驳回时请填写原因')
			}
			let Url = v == 1 ? close : v == 2 ? reject : ''
			// console.log('111111', paramJson)
			// return
			let {
				data: { resultCode },
			} = await Url(paramJson)
			if (resultCode == 0) {
				this.reviewReasonLoding = false
				this.$message.success('成功')
				this._fundAccountTransferList(true)
			}
		},
		//勾选
		selectionChange(row) {
			this.selectionData = row
		},
		// //导出
		_exportTransfer: async function () {
			let paramJson = Object.assign({}, this.processingData)
			paramJson.idList = []
			this.selectionData.map((item) => {
				paramJson.idList.push(item.id)
			})
			if (paramJson.idList == 0) {
				return this.$message.warning('请勾选导出数据')
			}
			let { data } = await smallMoneyExport(paramJson)
			downloadFile(data, '小额打款列表.xlsx')
		},
		setDatetimerange(data) {
			// 设置添加时间段
			let startTime =
				moment().startOf('day').valueOf() - (data - 1) * 24 * 60 * 60 * 1000
			this.searchData.addTimeStart = startTime
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				pageNum: 1,
				pageSize: 10,
			})
			// 每页的加载数据长度
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.pageNum = this.page.currentPage
			return paramJson
		},
		_fundAccountTransferList: async function (flag) {
			let paramJson = this.findSearchParams(flag)
			this.showLoading = true
			let {
				data: {
					resultCode,
					resultData: {
						compensationAmountTotal = 0,
						platformCompensationAmountTotal = 0,
						supplierCompensationAmountTotal = 0,
						records = [],
						total = 0,
					},
				},
			} = await search(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.compensationAmountTotal = compensationAmountTotal //补偿金额
				this.platformCompensationAmountTotal = platformCompensationAmountTotal //平台补偿金额
				this.supplierCompensationAmountTotal = supplierCompensationAmountTotal //商家补偿金额
				this.tableData = records
				this.page.count = total
			} else {
				this.compensationAmountTotal = 0
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.amount_box {
	margin: 20px 0;
	span {
		font-size: 26px;
		font-weight: bold;
	}
}
.wi100 {
	width: 100px;
}
::v-deep.examineA .el-dialog {
	overflow-y: hidden;
}
::v-deep.examineA .el-dialog .el-dialog__header {
	padding-bottom: 0px;
	height: 50px;
}
</style>

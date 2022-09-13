<template>
	<div class="goodsStockList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData105"
				:items="formCfg105"
				:formAction="formAction105"
			>
				<template #supplierName>
					<el-input
						v-model="formData105.supplierName"
						placeholder="请选择商家"
						@focus="selectSupplier"
						clearable
						@clear="
							() => {
								formData105.supplierName = []
								formData105.supplierId = []
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="handleAdd"
						></el-button>
					</el-input>
				</template>
			</yx-form>
			<yx-table
				v-loading="loading"
				:columns="tableColumns106"
				:pagination="page106"
				:data="tableData106"
			>
				<template slot="orderSn" slot-scope="scope">
					<router-link :to="`/business/orderDetails/${scope.row.orderId}`"
						><el-button type="text">{{
							scope.row.orderSn
						}}</el-button></router-link
					>
				</template>
				<template slot="afterSalesSn" slot-scope="scope">
					<router-link
						:to="`/business/afterSaleOrderDetails/${scope.row.afterSalesId}`"
						><el-button type="text">{{
							scope.row.afterSalesSn
						}}</el-button></router-link
					>
				</template>
			</yx-table>
			<!-- //导入发票 -->
			<Dialog
				title="导入发票"
				:visible="importInvoiceLoding"
				width="20%"
				height="10%"
				@before-close="importInvoiceLoding = false"
			>
				<yx-form
					style="margin-top: 60px"
					ref="form"
					:inline="false"
					:items="importItem"
					:data="importData"
					labelWidth="80px"
				>
				</yx-form>
			</Dialog>
			<!-- //审核 -->
			<Dialog
				title="审核"
				:visible="auditLoding"
				:bottomBtn="auditBottomBtn"
				width="50%"
				@before-close="auditLoding = false"
			>
				<yx-form
					style="margin-top: 60px"
					ref="form"
					:inline="false"
					:items="auditItem"
					:data="auditData"
					labelWidth="85px"
				>
				</yx-form>
			</Dialog>
			<!-- //上传票据信息 -->
			<Dialog
				title="上传票据信息"
				:visible="uploadDialogLoding"
				:bottomBtn="uploadBottomBtn"
				width="50%"
				@before-close="uploadDialogLoding = false"
			>
				<yx-form
					style="margin-top: 60px"
					ref="form"
					:inline="false"
					:items="uploadItem"
					:data="uploadData"
					labelWidth="80px"
				>
					<template #accessory>
						<el-upload
							class="w_file"
							ref="uploadFile"
							accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.wordprocessingml.template"
							:action="uploadAttachmentList"
							multiple
							:headers="uploadHead"
							:limit="5"
							:fileList="fileList"
							:auto-upload="true"
							:before-remove="beforeRemove"
							:on-exceed="handleExceed"
							:on-change="onChange"
							:http-request="
								(file) => {
									uploadImageHttpRequest(file)
								}
							"
						>
							<el-button class="mr20" icon="el-icon-plus" slot="trigger"
								>上传文件</el-button
							>
						</el-upload>
					</template>
				</yx-form>
			</Dialog>
			<!-- 商家/商家列表 -->
			<multitermSupply-dialog
				:itemInfo="supplyRow"
				:visible.sync="formsDialog"
				@fatherMethodInit="fatherMethodInit"
			/>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import MultitermSupplyDialog from '@/components/MultitermSupplyDialog'
import { uploadImageList } from '@/api/image'
import { isNull } from '@/utils/helper/common'
import {
	getInvoiceList,
	exportInvoice,
	impostInvoice,
	updateStatus,
	uploadAttachmentList,
	updateInvoiceFile,
} from '@/api/invoice'
import { downloadFile } from '@/utils/helper/common'
import moment from 'moment'
import { getBigImg } from '@/utils/imageTool'
import { mapGetters } from 'vuex'
export default {
	name: 'InvoiceList',
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
		MultitermSupplyDialog,
	},
	props: [],
	data() {
		return {
			loading: false,
			tempFileUrlList: [],
			invoiceListData: [],
			fileList: [],
			uploadAttachmentList: uploadAttachmentList,
			selectGroupList: [],
			supplyRow: [],
			dateStatusRow: '',
			stateType: '',
			formsDialog: false,
			fileToUpload: '',
			importInvoiceLoding: false,
			auditLoding: false,
			uploadDialogLoding: false,
			formData105: {
				supplierName: [],
				supplierId: [],
				invoiceNumber: '', //发票ID
				orderSn: '', //关联订单号
				status: '', //开票状态
				invoiceTitle: '', // 发票抬头
				startTime: moment().startOf('month').valueOf(), //创建时间
				endTime: moment().endOf('month').valueOf(),
				supplierNumberIds: [],
			},

			uploadItem: [
				{
					type: 'uploadImage',
					title: '图片',
					dataIndex: 'credentialsImage',
					uploadAttributes: {
						limit: 5,
						imageName: 'credentialsImage',
						action: this.uploadImageList,
						httpRequest: (file) =>
							this.uploadCertificate(
								file,
								'credentialsImage',
								'addSupplierCredentials',
								45
							),
					},
				},
				{
					title: '附件',
					type: 'custom',
					dataIndex: 'accessory',
				},
				{
					title: '备注',
					type: 'textarea',
					dataIndex: 'billPostscript',
				},
			],
			uploadBottomBtn: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.uploadTicketInformation()
					},
				},
			],
			uploadData: {
				credentialsImage: [], // 图片
				billPostscript: '',
			},
			importData: {
				goodsFile: [],
			},
			auditData: {
				billPostscript: '',
			},
			auditItem: [
				{
					title: '审核原因：',
					type: 'textarea',
					dataIndex: 'billPostscript',
				},
			],
			importItem: [
				{
					type: 'upload',
					dataIndex: 'goodsFile',
					uploadAttributes: {
						limit: 1,
						autoUpload: false,
						accept:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
						httpRequest: (file) => this._impostInvoice(file),
					},
					class: 'excel-upload',
				},
			],
			formCfg105: [
				{
					type: 'input',
					title: '发票ID',
					dataIndex: 'invoiceNumber',
					placeholder: '请输入发票ID',
				},
				{
					type: 'input',
					title: '关联订单号',
					dataIndex: 'orderSn',
					placeholder: '请输入关联订单号',
				},
				{
					type: 'input',
					title: '发票抬头',
					dataIndex: 'invoiceTitle',
					placeholder: '请输入关联发票抬头',
				},
				{
					title: '商家名称',
					type: 'custom',
					dataIndex: 'supplierName',
				},
				{
					title: '创建时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					type: 'select',
					title: '开票状态',
					dataIndex: 'status',
					placeholder: '请选择开票状态',
					label: 'value',
					options: [
						{
							status: '',
							value: '全部',
						},
						{
							status: '0',
							value: '待审核',
						},
						{
							status: '3',
							value: '已关闭',
						},
						{
							status: '1',
							value: '开票中',
						},
						{
							status: '2',
							value: '已完成',
						},
					],
				},
			],
			auditBottomBtn: [
				{
					title: '确定',
					type: 'primary',
					auth: '',
					click: () => {
						this._updateStatus()
					},
				},
			],
			formAction105: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: (e) => {
						this.getInvoiceList(true, e)
					},
				},
				{
					title: '新建开票信息',
					auth: 'addInvoice',
					type: 'primary',
					click: () => {
						this.newBillingInformation()
					},
				},
				{
					title: '导出',
					auth: 'invoice',
					type: 'primary',
					click: () => {
						this._exportInvoice()
					},
				},
				{
					title: '批量导入发票信息',
					auth: 'addInvoice',
					type: 'primary',
					click: () => {
						this.importInvoice()
					},
				},
				{
					title: '发票导入历史记录',
					type: 'primary',
					click: () => {
						this.invoiceMportList()
					},
				},
			],
			tableData106: [],
			tableColumns106: [
				{
					type: 'string',
					dataIndex: 'invoiceNumber',
					title: '发票ID',
				},
				{
					type: 'string',
					dataIndex: 'applyTime',
					title: '申请时间',
					customRender: (row) => {
						return row.applyTime
							? moment(row.applyTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '关联订单号',
				},

				{
					type: 'string',
					dataIndex: 'invoiceType',
					title: '发票类型',
					customRender: (row) => {
						if (row.invoiceType == 1) {
							return '增值税普通发票'
						} else if (row.invoiceType == 2) {
							return '增值税专用发票'
						} else if (row.invoiceType == 3) {
							return '增值税电子发票'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'invoiceTitle',
					title: '发票抬头',
				},
				{
					type: 'amount',
					dataIndex: 'invoiceAmount',
					title: '开票金额',
				},
				{
					type: 'string',
					dataIndex: 'phone',
					title: '联系电话',
				},
				{
					type: 'string',
					dataIndex: 'email',
					title: '收件邮箱',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '开票状态',
					customRender: (row) => {
						if (row.status == 0) {
							return '待审核'
						} else if (row.status == 1) {
							return '开票中'
						} else if (row.status == 2) {
							return '已完成'
						} else if (row.status == 3) {
							return '已关闭'
						}
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '查看详情',
							click: (row) => {
								this.$router.push({
									name: 'InvoiceDetails',
									params: { invoiceId: row.invoiceId },
								})
							},
						},
						{
							title: '审核通过',
							click: (row) => {
								this.passAuditOrNo(row, 1)
							},
							customRender: (action, row) => {
								action.hide = row.status != 0
								return action
							},
						},
						{
							title: '审核不通过',
							click: (row) => {
								this.passAuditOrNo(row, 3)
							},
							customRender: (action, row) => {
								action.hide = row.status != 0
								return action
							},
						},
						{
							title: '上传票据信息',
							click: (row) => {
								this.uploadDialog(row)
							},
							customRender: (action, row) => {
								action.hide = row.status != 1
								return action
							},
						},
					],
				},
			],
			page106: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getInvoiceList()
				},
			},
			uploadImageList:
				'/weeget-infinite-backend-gateway/yhtplus/image/uploadImageList.action',
		}
	},
	computed: {
		...mapGetters(['getUserId', 'getSessionKey']),
		uploadHead() {
			// 上传文件请求头
			return {
				'X-AUTH-TOKEN': this.getSessionKey,
			}
		},
	},

	created() {
		this.getInvoiceList()
	},

	methods: {
		selectSupplier(e) {
			e.target.blur()
			this.formsDialog = true
		},
		async uploadTicketInformation() {
			let paramJson = {
				billPostscript: this.uploadData.billPostscript,
				invoiceId: this.invoiceListData.invoiceId,
			}
			let imageListArr = this.uploadData.credentialsImage.map((item) => {
				return item[0]
			})
			let fileListArr = this.tempFileUrlList.map((item) => {
				return {
					accessoryFieName: item.name,
					fileUrl: item.attachmentUrl,
				}
			})
			paramJson.imageList = imageListArr
			paramJson.fileList = fileListArr
			if (
				paramJson.imageList.length == 0 &&
				paramJson.fileList == 0 &&
				isNull(paramJson.billPostscript)
			) {
				this.$message.warning({ message: '附件、图片、备注必须填一个' })
				return
			}
			const {
				data: { resultCode },
			} = await updateInvoiceFile(paramJson)
			if (resultCode == 0) {
				this.$message.success('成功')
				this.uploadDialogLoding = false
				this.getInvoiceList(true)
			}
			console.log('=-==-=-=-', paramJson)
		},
		beforeRemove(file, fileList) {
			// 删除文件前
			// this.newFileList = fileList
			for (let i = 0; i < fileList.length; i++) {
				if (fileList[i].uid == file.uid) {
					this.tempFileUrlList.splice(i, 1)
					return
				}
			}
		},
		/** 自定义导入 */
		uploadImageHttpRequest: async function (params) {
			let formData = new FormData()
			formData.append('formId', '#accessoryForm')
			formData.append(
				'data',
				JSON.stringify({
					timeStamp: new Date().getTime(),
					groupId: 2,
					attachmentType: 4,
				})
			)
			formData.append('excel', params.file)

			const {
				data: { resultCode, resultData },
			} = await uploadAttachmentList(formData, false)
			if (resultCode == 0) {
				this.$message.success('导入成功')
				resultData.attachmentList[0].name = params.file.name
				this.tempFileUrlList.push(...resultData.attachmentList)
			}
		},
		handleExceed() {
			/** 文件超出回调 **/
			this.$message.warning({ message: '只能上传五个文件' })
		},
		onChange(file, fileList) {
			// 文件列表改变
			this.fileList = fileList
		},
		uploadDialog(row) {
			this.uploadData = {
				credentialsImage: [], // 图片
				billPostscript: '',
			}
			this.fileList = []
			this.tempFileUrlList = []
			this.uploadDialogLoding = true
			this.invoiceListData = row
		},
		newBillingInformation() {
			this.$router.push({
				name: 'NewBillingInformation',
			})
		},
		//跳转记录
		invoiceMportList() {
			this.$router.push({
				name: 'InvoiceMportList',
			})
		},
		//弹窗
		importInvoice() {
			this.importData.goodsFile = []
			this.importInvoiceLoding = true
		},
		//导入
		async _impostInvoice(file) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({
					timeStamp: new Date().getTime(),
					groupId: 2,
					organizationId: this.$store.state.user.userInfo.organizationId,
				})
			)
			formData.append('formId', '#goodsForm')
			formData.append('fileToUpload', file.file)
			let {
				data: { resultCode, resultMsg },
			} = await impostInvoice(formData)
			if (resultCode === 0) {
				this.$message.success(resultMsg)
				this.importInvoiceLoding = false
			}
		},

		//导出
		_exportInvoice: async function () {
			let paramJson = Object.assign({}, this.formData105)
			paramJson.groupId = this.$store.state.user.userInfo.groupId
			let _paramJson = { ...paramJson }
			if (!_paramJson.supplierNumberIds.length) {
				delete _paramJson.supplierNumberIds
			}
			delete _paramJson.supplierId
			delete _paramJson.supplierName
			if (!_paramJson.status) {
				_paramJson.status = -1
			}
			let { data } = await exportInvoice(_paramJson)
			downloadFile(data, '发票列表.xlsx')
		},
		//审核
		passAuditOrNo(row, type) {
			this.auditLoding = true
			this.dateStatusRow = row
			this.stateType = type
			this.auditData.billPostscript = ''
		},

		_updateStatus: async function () {
			let paramJson = {
				billPostscript: this.auditData.billPostscript,
				status: this.stateType,
				invoiceId: this.dateStatusRow.invoiceId,
				supplierEmployeeId: this.$store.state.user.userInfo.userId,
				disposeName: this.$store.state.user.userInfo.userName,
			}
			if (paramJson.status == 3 && isNull(paramJson.billPostscript)) {
				this.$message.error('请填写原因')
				return
			}
			const {
				data: { resultCode },
			} = await updateStatus(paramJson)
			if (resultCode == 0) {
				this.$message({
					message: `成功!`,
					type: 'success',
				})
				this.auditLoding = false
				this.getInvoiceList()
			}
		},
		handleAdd() {
			this.supplyRow = JSON.parse(JSON.stringify(this.selectGroupList))
			this.formsDialog = true
		},
		//处理商家多选查询
		fatherMethodInit(row = {}) {
			this.selectGroupList = JSON.parse(JSON.stringify(row))
			for (let i = 0; i < row.length; i++) {
				this.formData105.supplierName.push(row[i].supplierName) //插入数组
				this.formData105.supplierName = [
					//数组防重
					...new Set(this.formData105.supplierName),
				]
				this.formData105.supplierId.push(row[i].supplierId)
				this.formData105.supplierId = [
					//数组防重
					...new Set(this.formData105.supplierId),
				]
			}
			console.log('+++++++', this.formData105.supplierName)
		},
		findSearchParams106(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page106.currentPage = 1
			}
			let formData = {
				invoiceNumber: this.formData105.invoiceNumber, //发票ID
				orderSn: this.formData105.orderSn, //关联订单号
				status: this.formData105.status, //开票状态
				invoiceTitle: this.formData105.invoiceTitle, // 发票抬头
				startTime: this.formData105.startTime, //创建时间
				endTime: this.formData105.endTime,
				supplierNumberIds: this.formData105.supplierNumberIds,
			}
			const paramJson = Object.assign(formData, {
				length: this.page106.length,
				startIndex: (this.page106.currentPage - 1) * this.page106.length,
			})
			paramJson.startTime = moment(paramJson.startTime).valueOf() || ''
			paramJson.endTime = moment(paramJson.endTime).valueOf() || ''
			paramJson.supplierNumberIds = this.formData105.supplierId

			return paramJson
		},
		getInvoiceList: async function (flag, e) {
			let paramJson = this.findSearchParams106(flag)
			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			this.loading = true
			let {
				data: { resultCode, resultData },
			} = await getInvoiceList(paramJson, custom)
			this.loading = false
			if (resultCode == 0) {
				this.tableData106 = resultData.invoiceList
				this.page106.count = resultData.count
			} else {
				this.page106.count = 0
				this.tableData106 = []
			}
		},
		// 上传图片
		async uploadCertificate(params, key, name, imageType) {
			const uploadData = new FormData()
			uploadData.append(
				'data',
				JSON.stringify({ formId: `#${name}`, imageType: imageType })
			)
			uploadData.append('image', params.file)
			const res = await uploadImageList(uploadData)

			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				if (imageType == 44) {
					this.uploadData[key] = res.data.resultData.imageList
					this.uploadData[key][0][key] = getBigImg(
						res.data.resultData.imageList[0].imageUrl
					)
				} else {
					this.uploadData[key].push(res.data.resultData.imageList)
					console.log('jsdlgkjnsodg', res.data.resultData.imageList)
					for (let i = 0; i < this.uploadData[key].length; i++) {
						const item = this.uploadData[key][i]
						for (let j = 0; j < item.length; j++) {
							if (item[j].imageUrl) {
								this.uploadData[key][i][key] = getBigImg(item[j].imageUrl)
							}
						}
					}
				}

				this.flag = false
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
	},
}
</script>

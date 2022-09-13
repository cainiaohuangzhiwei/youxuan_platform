<template>
	<basic-container>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="发票详情" name="one">
				<div class="overstriking">发票信息</div>

				<yx-info :data="orderInfoData" :items="orderInfoItems">
					<!-- 自定义插槽 -->

					<template #orderSn>
						关联订单号：
						<router-link :to="`/business/orderDetails/${orderInfoData.orderId}`"
							><el-button type="text">{{
								orderInfoData.orderSn
							}}</el-button></router-link
						>
					</template>
					<template #phone>
						<div style="padding: 10px 0">
							联系电话：
							<el-popover
								placement="top-start"
								width="120"
								popper-class="popperClass"
								trigger="click"
								:content="visiblePhone"
								><span
									slot="reference"
									@click="showPhone(orderInfoData.invoiceId)"
									style="cursor: pointer"
									title="点击获取手机号"
									>{{ orderInfoData.phone }}</span
								>
							</el-popover>
						</div>
					</template>
				</yx-info>
				<div class="mlb">
					<span>备注：</span>
					<el-input
						style="width: 31%"
						type="textarea"
						v-model="parameters.invoicePostscript"
					>
					</el-input>
				</div>

				<div>
					<span>审核结果反馈：</span>
					<el-input
						style="width: 30%"
						type="textarea"
						v-model="parameters.auditResult"
					>
					</el-input>
				</div>

				<div
					v-if="this.invoiceFile.length > 0"
					class="overstriking"
					style="margin-top: 20px"
				>
					票据信息
				</div>

				<div
					class="check-msg"
					v-for="(item, index) in invoiceFile"
					:key="index"
				>
					<div v-if="item.accessoryType == 1">
						图片<el-image
							class="mb20"
							fit="cover"
							:src="getBigImg(item.accessoryContent)"
							:preview-src-list="[getBigImg(item.accessoryContent)]"
						>
							<div slot="error" class="image-slot">
								<i class="el-icon-picture-outline"></i>
							</div>
						</el-image>
						<el-button
							class="buPoAb"
							type="primary"
							@click="
								download(
									item.accessoryContent,
									item.accessoryFieName
										? item.accessoryFieName
										: 'image' + index,
									1
								)
							"
						>
							下载
						</el-button>
					</div>
					<div class="buPoAb" v-else>
						文件：
						<a :href="item.accessoryContent">{{ item.accessoryFieName }} </a>
						<el-button
							style="display: inline-block"
							type="primary"
							@click="download(item.accessoryContent, item.accessoryFieName, 2)"
							>下载</el-button
						>
					</div>
				</div>
				票据备注：<el-input
					style="width: 30%; margin-top: 60px"
					type="textarea"
					v-model="parameters.billPostscript"
				>
				</el-input>
				<div class="save_button">
					<el-button
						v-if="orderInfoData.status == 0"
						type="primary"
						@click="passAuditOrNo(1)"
						>审核通过</el-button
					>
					<el-button v-if="orderInfoData.status == 0" @click="passAuditOrNo(3)"
						>审核不通过</el-button
					>
					<el-button v-if="orderInfoData.status == 1" @click="uploadDialog"
						>上传票据信息</el-button
					>
				</div>
			</el-tab-pane>
			<el-tab-pane label="处理记录" name="two">
				<el-timeline class="timeline-box" :reverse="true">
					<el-timeline-item placement="top" size="normal"></el-timeline-item>
					<el-timeline-item
						v-for="(dispose, index) in invoiceList"
						:key="index"
						placement="top"
						size="normal"
					>
						<div>
							<p class="timeline-name">
								状态：{{ operatingItems[dispose.status] }}
							</p>
							<p v-if="dispose.disposeName" class="timeline-name">
								操作人：{{ dispose.disposeName }}
							</p>
							<p class="timeline-name">
								时间：{{
									moment(dispose.disposeTime).format('YYYY-MM-DD HH:mm:ss')
								}}
							</p>
						</div>
					</el-timeline-item>
				</el-timeline>
			</el-tab-pane>
		</el-tabs>
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
	</basic-container>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import { getBigImg } from '@/utils/imageTool'
import YxInfo from '@wg-vue-materials/yx-info'
import YxForm from '@wg-vue-materials/yx-form'
import Dialog from '@/components/Dialog'
import { isNull } from '@/utils/helper/common'
import moment from 'moment'
import { numberFormat } from '@/utils/helper/common'
import { findInvoicePhoneById } from '@/api/showPhone'
import {
	findIncludeZeroById,
	findInvoiceFile,
	findInvoiceById,
	updateStatus,
	uploadAttachmentList,
	updateInvoiceFile,
} from '@/api/invoice'
import { uploadImageList } from '@/api/image'
export default {
	components: {
		BasicContainer,
		YxInfo,
		Dialog,
		YxForm,
	},
	name: 'FormTable',

	data() {
		return {
			tempFileUrlList: [],
			moment: moment,
			operatingItems: ['申请开票', '审核通过', '已完成', '审核不通过'],
			getBigImg: getBigImg,
			activeName: 'one',
			uploadAttachmentList: uploadAttachmentList,
			uploadImageList:
				'/weeget-infinite-backend-gateway/yhtplus/image/uploadImageList.action',
			auditLoding: false,
			uploadDialogLoding: false,
			orderInfoData: {},
			invoiceFile: [],
			fileList: [],
			invoiceList: [],
			stateType: '',
			parameters: {
				invoicePostscript: '',
				auditResult: '',
				billPostscript: '',
			},
			auditItem: [
				{
					title: '审核原因：',
					type: 'textarea',
					dataIndex: 'billPostscript',
				},
			],
			auditData: {
				billPostscript: '',
			},
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
			uploadBottomBtn: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.uploadTicketInformation()
					},
				},
			],
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
			uploadData: {
				credentialsImage: [], // 图片
				billPostscript: '',
			},
			orderInfoItems: [
				{
					type: 'custom',
					dataIndex: 'orderSn',
				},
				{
					type: 'string',
					title: '开票状态',
					dataIndex: 'status',
					customRender: () => {
						return this.orderInfoData.status == 0
							? '待审核'
							: this.orderInfoData.status == 1
							? '开票中'
							: this.orderInfoData.status == 2
							? '已完成'
							: '已关闭'
					},
				},
				{
					type: 'string',
					title: '发票抬头类型',
					dataIndex: 'status',
					customRender: () => {
						return this.orderInfoData.invoiceTitleType === 1 ? '个人' : '企业'
					},
				},
				{
					type: 'string',
					title: ' 商家',
					dataIndex: 'supplierName',
					customRender: () => {
						return this.orderInfoData.supplierName
					},
				},
				{
					type: 'string',
					title: ' 发票ID',
					dataIndex: 'invoiceNumber',
					customRender: () => {
						return this.orderInfoData.invoiceNumber
					},
				},
				{
					type: 'string',
					title: ' 申请时间',
					dataIndex: 'applyTime',
					customRender: () => {
						return this.orderInfoData.applyTime
							? moment(this.orderInfoData.applyTime).format(
									'YYYY-MM-DD HH:mm:ss'
							  )
							: '-'
					},
				},
				{
					type: 'string',
					title: ' 发票类型',
					dataIndex: 'supplierName',
					customRender: () => {
						return this.orderInfoData.invoiceType == 1
							? '增值税普通发票'
							: this.orderInfoData.invoiceType == 2
							? '增值税专用发票'
							: '增值税电子发票'
					},
				},
				{
					type: 'string',
					title: ' 发票抬头',
					dataIndex: 'invoiceTitle',
					customRender: () => {
						return this.orderInfoData.invoiceTitle
					},
				},
				{
					type: 'string',
					title: ' 开票金额',
					dataIndex: 'invoiceAmount',
					customRender: () => {
						return numberFormat(this.orderInfoData.invoiceAmount, 2)
					},
				},
				{
					type: 'custom',
					title: ' 联系电话',
					dataIndex: 'phone',
				},
				// {
				// 	type: 'string',
				// 	title: ' 联系电话',
				// 	dataIndex: 'invoiceTitle',
				// 	switch: this.phoneShow,
				// 	hoverTitle: '点击获取手机号',
				// 	customRender: () => {
				// 		return this.orderInfoData.phone
				// 	},
				// 	click: (ev, item) => {
				// 		this.showPhone()
				// 	},
				// },

				{
					type: 'string',
					title: ' 纳税人识别号',
					dataIndex: 'taxpayerNumber',
					customRender: () => {
						return this.orderInfoData.taxpayerNumber
					},
				},
				{
					type: 'string',
					title: '银行账号',
					dataIndex: 'bankCard',
					customRender: () => {
						return this.orderInfoData.bankCard
					},
				},
				{
					type: 'string',
					title: ' 开户银行',
					dataIndex: 'bankName',
					customRender: () => {
						return this.orderInfoData.bankName
					},
				},
				{
					type: 'string',
					title: ' 收件人姓名',
					dataIndex: 'addresseeName',
					customRender: () => {
						return this.orderInfoData.addresseeName
					},
				},
				{
					type: 'string',
					title: ' 收件邮箱',
					dataIndex: 'email',
					customRender: () => {
						return this.orderInfoData.email
					},
				},
				{
					type: 'string',
					title: '收件人地址',
					dataIndex: 'site',
					customRender: () => {
						return this.orderInfoData.site
					},
				},
				{
					type: 'string',
					title: ' 单位地址及电话',
					dataIndex: 'unitSite',
					customRender: () => {
						return this.orderInfoData.unitSite
					},
				},
			],
			visiblePhone: '***********',
		}
	},
	computed: {
		uploadHead() {
			// 上传文件请求头
			return {
				'X-AUTH-TOKEN': this.getSessionKey,
			}
		},
	},
	created() {
		this.invoiceId = this.$route.params.invoiceId || ''
		this.findIncludeZeroByIdList()
		this.findInvoiceFile()
	},
	methods: {
		async showPhone(invoiceId) {
			this.visiblePhone = '***********'
			let {
				data: { resultCode, resultData },
			} = await findInvoicePhoneById({
				id: invoiceId,
			})
			if (resultCode == 0) {
				this.visiblePhone = resultData
				//this.$set(this.orderInfoData, 'phone', '13610325641')
			}
		},
		async uploadTicketInformation() {
			let paramJson = {
				billPostscript: this.uploadData.billPostscript,
				invoiceId: this.invoiceId,
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
				paramJson.fileList.length == 0 &&
				isNull(paramJson.billPostscript)
			) {
				this.$message({
					message: `图片，附件，备注必须选填一个!`,
					type: 'warning',
				})
			}
			const {
				data: { resultCode },
			} = await updateInvoiceFile(paramJson)
			if (resultCode == 0) {
				this.$message.success('成功')
				this.uploadDialogLoding = false
				this.findIncludeZeroByIdList()
				this.findInvoiceFile()
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
		handleExceed() {
			/** 文件超出回调 **/
			this.$message.warning({ message: '只能上传五个文件' })
		},
		onChange(file, fileList) {
			// 文件列表改变
			this.fileList = fileList
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
			let index = params.file.name.lastIndexOf('.')
			let format = params.file.name.substring(
				index + 1,
				params.file.name.length
			)
			console.log('file:', params.file)
			if (!/\.jpeg|png|pdf|jpg|bmp|XLS|XLSX|docx|doc|txt/i.test(format)) {
				this.$message.warning(
					'附件上传有误,仅支持上传pdf、excel、word、txt、图片（JPG,JPEG,BMP,PNG）格式文件'
				)
				this.fileList = []
				this.tempFileUrlList = []
				return
			}
			if (params.file.size > 1024 * 60000) {
				this.$message.warning({ message: '上传的附件请不勿大于60M,请重新选择' })
				this.fileList = []
				this.tempFileUrlList = []
				return
			}
			const {
				data: { resultCode, resultData },
			} = await uploadAttachmentList(formData, false)
			if (resultCode == 0) {
				this.$message.success('导入成功')
				resultData.attachmentList[0].name = params.file.name
				this.tempFileUrlList.push(...resultData.attachmentList)
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
		//上传票据弹窗
		uploadDialog() {
			this.uploadDialogLoding = true
			this.uploadData = {
				credentialsImage: [], // 图片
				billPostscript: '',
			}
			this.fileList = []
			this.tempFileUrlList = []
		},
		//审核弹窗
		passAuditOrNo(type) {
			this.auditLoding = true
			this.stateType = type
		},
		//调起审核
		_updateStatus: async function () {
			let paramJson = {
				billPostscript: this.auditData.billPostscript,
				status: this.stateType,
				invoiceId: this.invoiceId,
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
				this.findIncludeZeroByIdList()
				this.findInvoiceFile()
			}
		},
		//下载票据信息
		download(accessoryContent, accessoryFieName, a) {
			let downLoadServer
			if (location.host.indexOf('127.0.0.1') > -1) {
				downLoadServer = 'https://fors-ali-pressure.yunhuotong.net/yhtplus/'
			} else {
				downLoadServer = location.origin + '/yhtplus/'
			}
			if (a == 1) {
				this.downloadFile(
					downLoadServer + accessoryContent + '.jpg',
					accessoryFieName
				)
			} else {
				this.downloadFile(downLoadServer + accessoryContent, accessoryFieName)
			}
			console.log('vvvvvvvv', downLoadServer)
		},
		// tab切换
		handleClick(tab) {
			if (tab.name == 'one') {
				this.findIncludeZeroByIdList()
				this.findInvoiceFile()
			} else {
				this.findInvoiceById()
			}
		},
		//获取发票信息
		async findIncludeZeroByIdList() {
			let {
				data: { resultCode, resultData },
			} = await findIncludeZeroById({
				invoiceId: this.invoiceId,
			})
			if (resultCode == 0) {
				this.phoneShow = false
				if (!resultData.invoice) {
					this.$message({
						message: `没有此发票!`,
						type: 'warning',
					})
					return
				}
				this.orderInfoData = resultData.invoice

				if (this.orderInfoData.invoiceTitleType == 1) {
					this.orderInfoItems[10].hide = true
					this.orderInfoItems[11].hide = true

					this.orderInfoItems[12].hide = true

					this.orderInfoItems[16].hide = true

					console.log('=======', this.orderInfoItems[10])
				}
				this.parameters.invoicePostscript = this.orderInfoData.invoicePostscript
				this.parameters.auditResult = this.orderInfoData.auditResult
				this.parameters.billPostscript = this.orderInfoData.billPostscript
			} else {
				this.orderInfoData = {}
			}
		},
		//获取票据信息
		async findInvoiceFile() {
			let {
				data: { resultCode, resultData },
			} = await findInvoiceFile({
				invoiceId: this.invoiceId,
			})
			if (resultCode == 0) {
				this.invoiceFile = resultData
			} else {
				this.invoiceFile = []
			}
		},
		// 获取处理记录
		async findInvoiceById() {
			let {
				data: { resultCode, resultData },
			} = await findInvoiceById({ invoiceId: this.invoiceId })
			if (resultCode == 0) {
				this.invoiceList = resultData.invoiceList
			} else {
				this.invoiceList = []
			}
		},
		downloadFile: function (downloadUrl, accessoryFileName) {
			let xhr = new XMLHttpRequest()
			xhr.open('get', downloadUrl, true)
			// 设置返回数据的类型为arraybuffer
			xhr.responseType = 'arraybuffer'
			xhr.setRequestHeader(
				'Content-Type',
				'application/x-www-form-urlencoded; charset=utf-8'
			)
			// xhr.setRequestHeader('X-AUTH-TOKEN', _this.token);
			xhr.setRequestHeader('Access-Control-Allow-Orig', '*')
			xhr.onload = function (res) {
				if (this.status == 200) {
					let response = this.response
					// 获取请求头Content-Type的值，用来判断是否是文件流下载
					let type = xhr.getResponseHeader('Content-Type')
					// text/plain;charset=utf-8：就是指“无类型”，一般的字节流用于数据传输，非文件下载
					if (type == 'text/plain;charset=utf-8') {
						// 将数据arraybuffer转成Json对象
						// let enc = new TextDecoder('utf-8')
						// var res = JSON.parse(enc.decode(new Uint8Array(response)))
						console.log(res)
						return
					}
					//将字符串 转换成 Blob 对象
					let blob = new Blob([response], {
						type: type,
					})
					// 创建新的URL表示指定的File对象或者Blob对象
					let URL = window.URL || window.webkitURL
					let objectUrl = URL.createObjectURL(blob)
					// 创建a标签用于跳转至下载链接
					let a = document.createElement('a')
					// href属性指定下载链接
					a.href = objectUrl
					// 设置文件名称
					a.download = accessoryFileName
					// click()事件触发下载
					a.click()
					// 去除a标签，以免影响其他操作
					a.remove()
					// 将URL释放
					URL.revokeObjectURL(objectUrl)
				}
			}
			xhr.send()
		},
	},
}
</script>
<style lang="scss">
.popperClass {
	text-align: center;
}
.mlb {
	margin-bottom: 20px;
	margin-left: 55px;
}
.buPoAb {
	position: absolute;
	margin-left: 20px;
}
.mb20 {
	margin-bottom: 20px;
}
.check-msg {
	width: 100px;
	height: 100px;
	margin-bottom: 20px;
	display: table;
}
.overstriking {
	font-weight: bold;
	font-size: 16px;
	margin-bottom: 20px;
}
.poster_img {
	width: 50px;
	height: 50px;
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
</style>

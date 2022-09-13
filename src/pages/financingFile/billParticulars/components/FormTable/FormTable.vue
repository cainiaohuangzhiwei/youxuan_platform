<template>
	<basic-container>
		<!-- <el-button
			type="primary"
			class="el-icon-right"
			@click="oldSystem"
			style="display: block"
			>老系统</el-button
		> -->
		<img src="@/assets/image/logo_icon.png" />
		<h3 class="assembly">会场信息</h3>
		<yx-info :data="infoData" :items="infoItems">
			<!-- 自定义插槽 -->
			<template #null>
				<h3 style="height: 10px"></h3>
			</template>
			<template #null1>
				<el-button
					style="margin-left: -350px; margin-top: 10px"
					type="primary"
					@click="operation"
				>
					查看处理记录
				</el-button>
			</template>
			<template #null2>
				<h3 style="height: 25px"></h3>
			</template>
			<template #title>
				<div style="font-size: 27px" class="el-icon-s-order"></div>
				<h3 class="assembly">对账单信息</h3>
			</template>
		</yx-info>
		<el-card>
			<div class="mb20" v-if="moneyToType == 1">
				<label>订单首款金额:</label>
				<label class="ml100">￥{{ infoData.reconciliationAmount }}</label>
				<label class="ml100">已确认</label>
				<el-link
					class="ml100"
					type="primary"
					:href="'/yhtplus/egg/financingFile/accountDetail'"
					>查看</el-link
				>
			</div>
			<div v-if="moneyToType == 2 || moneyToType == 3">
				<div class="mb20" v-if="moneyToType == 2">
					<label>订单尾款金额:</label>
					<label class="ml100">￥{{ infoData.reconciliationAmount }}</label>
					<label class="ml100">已确认</label>
					<el-link
						class="ml100"
						type="primary"
						:href="'/yhtplus/egg/financingFile/accountDetail'"
						>查看</el-link
					>
				</div>
				<div class="mb20">
					<label>退款成功金额:</label>
					<label class="ml100">￥{{ stFinanceLastVO.refundAmount }}</label>
					<label class="ml100">已确认</label>
					<el-link
						class="ml100"
						type="primary"
						:href="'/yhtplus/egg/financingFile/accountDetail'"
						>查看</el-link
					>
				</div>
				<div class="mb20">
					<label>补款金额:</label>
					<label class="ml100">￥{{ stFinanceLastVO.fillingAmount }}</label>
					<label class="ml100">已确认</label>
					<el-link
						class="ml100"
						type="primary"
						:href="'/yhtplus/egg/financingFile/accountDetail'"
						>查看</el-link
					>
				</div>
				<div class="mb20">
					<label>罚款金额:</label>
					<label class="ml100">￥{{ stFinanceLastVO.fineAmount }}</label>
					<label class="ml100">已确认</label>
					<el-link
						class="ml100"
						type="primary"
						:href="'/yhtplus/egg/financingFile/accountDetail'"
						>查看</el-link
					>
					<el-button
						v-if="moneyToType == 2 && !fineShow"
						class="ml20"
						type="primary"
						@click="confirmedError(3)"
						>确认无误</el-button
					>
				</div>
				<div class="mb20">
					<label>营销费用:</label>
					<label class="ml100">￥{{ stFinanceLastVO.marketingAmount }}</label>
					<label class="ml100">已确认</label>
					<el-link
						class="ml100"
						type="primary"
						:href="'/yhtplus/egg/financingFile/accountDetail'"
						>查看</el-link
					>
					<el-button
						v-if="moneyToType == 2 && !marketingShow"
						class="ml20"
						type="primary"
						@click="confirmedError(4)"
						>确认无误</el-button
					>
				</div>
				<div class="mb20">
					<label>其他:</label>
					<label class="ml100">￥{{ stFinanceLastVO.otherAmount }}</label>
					<label class="ml100">已确认</label>
					<el-link
						class="ml100"
						type="primary"
						:href="'/yhtplus/egg/financingFile/accountDetail'"
						>查看</el-link
					>
					<el-button
						v-if="moneyToType == 2 && !elseShow"
						class="ml20"
						type="primary"
						@click="confirmedError(6)"
						>确认无误</el-button
					>
				</div>
			</div>
			<div class="mb20">
				<label>对账金额:</label>
				<label class="ml100"
					>￥{{
						moneyToType == 1
							? infoData.reconciliationAmount
							: stFinanceLastVO.totalAmount
					}}</label
				>
				<el-link class="ml100" type="primary" @click="downloadStatement"
					>下载对账单</el-link
				>
				<el-link
					class="ml100"
					type="primary"
					:href="'/yhtplus/egg/financingFile/accountDetail'"
					>查看</el-link
				>
			</div>
		</el-card>
		<div v-if="infoData.fileName">
			<div style="font-size: 27px" class="el-icon-s-check"></div>
			<h3 class="assembly">商家提交资料</h3>

			<el-card>
				<h4>附件：</h4>
				<div
					class="mb20"
					v-for="(item, index) in infoData.fileName"
					:key="index"
				>
					<label>{{ item }}</label>
					<el-link
						class="ml100"
						type="primary"
						:href="imgCosServerPath + infoData.url[index]"
						>下载</el-link
					>
					<el-link
						v-if="
							getImgCosServerPath(infoData.url, index) ||
							infoData.url[index].pathShow ||
							infoData.url[index].format
						"
						class="ml100"
						type="primary"
						@click="getPreview(infoData.url, index, 1)"
						>预览</el-link
					>
					<el-link
						v-if="infoData.url[index].pathShow"
						class="ml100"
						type="primary"
						@click="getPreview(infoData.url, index, 0)"
						>收起</el-link
					>
					<!-- <div>{{ infoData.url[index].pathShow }}</div> -->
					<iframe
						v-if="infoData.url[index].pathShow"
						class="preview"
						:src="
							'https://view.officeapps.live.com/op/view.aspx?src=' +
							imgCosServerPath +
							infoData.url[index].path
						"
					></iframe>
				</div>
			</el-card>
		</div>
		<div
			class="save_button"
			v-if="infoData.status != 2 && infoData.status != 6"
		>
			<el-button
				type="primary"
				v-if="infoData.status == 1"
				@click="submitFirstSupplier(1)"
				>提交商家对账</el-button
			>
			<el-button
				type="primary"
				v-if="infoData.status == 3"
				@click="submitFirstSupplier(2)"
				>初审通过</el-button
			>
			<el-button
				type="primary"
				v-if="infoData.status == 3"
				@click="firstTrialNoPass(1)"
				>初审不通过</el-button
			>
			<el-button
				type="primary"
				v-if="infoData.status == 5"
				@click="submitFirstSupplier(3)"
				>三审通过</el-button
			>
			<el-button
				type="primary"
				v-if="infoData.status == 5"
				@click="firstTrialNoPass(2)"
				>三审不通过</el-button
			>
			<el-button
				type="primary"
				v-if="infoData.status == 4"
				@click="submitFirstSupplier(4)"
				>复审通过</el-button
			>

			<el-button
				type="primary"
				v-if="infoData.status == 4"
				@click="firstTrialNoPass(3)"
				>复审不通过</el-button
			>
			<el-button
				type="primary"
				v-if="infoData.status == 7"
				@click="anewReconciliation"
				>重新发起对账</el-button
			>
		</div>
		<!-- //查看记录 -->
		<Dialog
			title="查看记录"
			:visible="checkRecordLoding"
			width="60%"
			:bottomBtn="checkRecordBtn"
			@before-close="checkRecordLoding = false"
		>
			<el-timeline :reverse="reverse">
				<el-timeline-item
					v-for="(item, index) in supplierWithdrawOperationRecordListS"
					:key="index"
				>
					{{ optStatus[item.optStatus] }}
					<div style="margin-left: 20%; display: inline-block">
						{{ moment(item.addTime).format('YYYY-MM-DD HH:mm:ss') }}
					</div>
					<div style="margin-left: 20%; display: inline-block">
						{{
							item.status == 3
								? item.addUserName + '(商家名称)'
								: item.addUserName
						}}
					</div>
					<div style="margin-left: 20%; display: inline-block">
						{{ item.remark }}
					</div>
				</el-timeline-item>
			</el-timeline>
		</Dialog>
	</basic-container>
</template>

<script>
import YxInfo from '@wg-vue-materials/yx-info'
import Dialog from '@/components/Dialog'
import BasicContainer from '@wg-vue-materials/basic-container'
import moment from 'moment'
import { downloadFile } from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth'
import { imgCosServerPath } from '@/utils/imageTool'
import {
	getFirstStFinanceInfo, // 首款对账单详情
	getEndStFinanceInfo, // 尾款对账单详情
	getPreviousStFinanceInfo, // 往期对账单详情
	getFirstStFinanceDownUrl, // 首款对账单下载
	getEndStFinanceDownUrl, // 尾款对账单详情
	getPreviousStFinanceDownUrl, // 往期对账单下载
	listEndStFinanceSureAmount, //查询尾款确认无误的款项
	confirmStFinanceAmount, //确认无误操作
	submitFirstSupplierStFinance, //首款提交商家对账
	submitEndSupplierStFinance, //尾款提交商家对账
	submitPreviousSupplierStFinance, //往期提交商家对账
	firstAuditStFinance, //首款初审
	endAuditStFinance, //尾款初审
	previousAuditStFinance, //往期初审
	firstAuditStFinanceFinal, //首款三审
	endAuditStFinanceFinal, //尾款三审
	previousAuditStFinanceFinal, //往期三审
	firstAuditStFinanceRepeat, //首款复审
	endAuditStFinanceRepeat, //尾款复审
	previousAuditStFinanceRepeat, //往期复审
	firstAgainStFinance, //首款重新发起对账
	endAgainStFinance, //尾款重新发起对账
	previousAgainStFinance, //往期重新发起对账
	listFirstStFinanceOperation, //首款查看处理记录
	listEndStFinanceOperation, //尾款查看处理记录
	listPreviousStFinanceOperation, //往期查看处理记录
} from '@/api/supplyAmount'
import {
	downloadFirstStFinance, // 首款对账单下载
	downloadLastStFinance, // 尾款对账单下载
	downloadPastStFinance, // 往期对账单下载
} from '@/api/webImport'
export default {
	components: {
		BasicContainer,
		YxInfo,
		Dialog,
	},
	name: 'FormTable',

	data() {
		return {
			getFirstStFinanceDownUrl: checkFunctionCode('getFirstStFinanceDownUrl'),
			getEndStFinanceDownUrl: checkFunctionCode('getEndStFinanceDownUrl'),
			getPreviousStFinanceDownUrl: checkFunctionCode(
				'getPreviousStFinanceDownUrl'
			),
			moment,
			imgCosServerPath,
			moneyToType: this.$route.query.moneyToType,
			stFinanceId: this.$route.query.stFinanceId,
			infoData: {},
			stFinanceLastVO: {},
			downloadData: {},
			fineShow: false,
			marketingShow: false,
			elseShow: false,
			loading: false,
			checkRecordLoding: false,
			reverse: false,
			supplierWithdrawOperationRecordListS: [],
			// 处理节点
			optStatus: [
				'',
				'提起商家对账', //1
				'发起对账', //2
				'初审通过', //3
				'初审不通过', //4
				'复审通过', //5
				'复审不通过', //6
				'重新发起对账', //7
				'退款金额确认无误', //8
				'补款金额确认无误', //9
				'罚款金额确认无误', //10
				'营销费用确认无误', //11
				'其它费用确认无误', //12
				'三审通过', //13
				'三审不通过', //14
			],
			infoItems: [
				{
					type: 'string',
					title: '分组ID',
					dataIndex: 'goodsGroupId',
				},
				{
					type: 'string',
					title: '分组名称',
					dataIndex: 'goodsGroupName',
				},
				{
					type: 'string',
					title: '会场名称',
					dataIndex: 'brandName',
				},
				{
					type: 'string',
					title: '供应商名称',
					dataIndex: 'supplierName',
				},
				{
					type: 'string',
					title: '售卖时间',
					dataIndex: 'salesStartTime',
					customRender: (row) => {
						return row.salesStartTime && row.salesEndTime
							? moment(row.salesStartTime).format('YYYY-MM-DD HH:mm:ss') +
									'-' +
									moment(row.salesEndTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					dataIndex: 'null',
					type: 'custom',
				},
				{
					dataIndex: 'title',
					type: 'custom',
				},
				{
					dataIndex: 'null1',
					type: 'custom',
				},
				{
					dataIndex: 'null2',
					type: 'custom',
				},
				{
					type: 'string',
					title: '首款对账单ID',
					dataIndex: 'stFinanceId',
				},
				{
					type: 'string',
					title: '订单总金额',
					dataIndex: 'amount',
				},
				{
					type: 'string',
					title: '订单总金额',
					dataIndex: 'ratio',
					customRender: (row) => {
						return row.ratio + '%'
					},
				},
				{
					type: 'string',
					title: '首款对账状态',
					dataIndex: 'status',
					customRender: (row) => {
						return row.status === 1
							? '待平台确认'
							: row.status === 2
							? '待对账'
							: row.status === 3
							? '待对账'
							: row.status === 4
							? '待复审'
							: row.status === 5
							? '待三审'
							: row.status === 6
							? '已完成'
							: '已关闭'
					},
				},
				{
					type: 'string',
					title: '创建时间',
					dataIndex: 'addTime',
					customRender: (row) => {
						return row.addTime
							? moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					title: '发起对账时间',
					dataIndex: 'stTime',
					customRender: (row) => {
						return row.stTime
							? moment(row.stTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
			],
		}
	},

	created() {
		this.particularsDetails()
	},

	methods: {
		// 打开老系统
		oldSystem() {
			window.open(
				`/yhtplus/web/billParticulars.html?stFinanceId=${this.stFinanceId}&moneyToType=${this.moneyToType}&supplierId=${this.$route.query.supplierId}`
			)
		},
		operation: async function () {
			this.checkRecordLoding = true
			let Url =
				this.moneyToType == 1
					? listFirstStFinanceOperation
					: this.moneyToType == 2
					? listEndStFinanceOperation
					: listPreviousStFinanceOperation

			let {
				data: { resultCode, resultData },
			} = await Url({
				stFinanceId: this.stFinanceId,
			})
			if (resultCode == 0) {
				this.supplierWithdrawOperationRecordListS = resultData
			}
		},
		//重新发起对账
		anewReconciliation: async function () {
			let Url =
				this.moneyToType == 1
					? firstAgainStFinance
					: this.moneyToType == 2
					? endAgainStFinance
					: previousAgainStFinance
			this.$confirm('重新发起对账后，对账单的状态会变为“待平台确认”', '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						const {
							data: { resultCode, resultMsg: resultMsg1 },
						} = await Url({
							stFinanceId: this.stFinanceId,
							type: this.moneyToType,
						})
						if (resultCode == 0) {
							this.$message.success(resultMsg1)
							this.particularsDetails()
						}
					}
				},
			})
		},
		//不通过操作
		firstTrialNoPass: async function (v) {
			let _this = this
			let paramJson = {
				stFinanceId: this.stFinanceId,
				type: this.moneyToType,
				isTrue: 2, //不通过
			}
			let title = v == 1 ? '是否确认不通过账单' : '三审是否确认不通过账单'
			let Url
			if (v == 3) {
				if (
					this.infoData.reconciliationAmount * this.infoData.ratio * 0.01 >=
					Math.pow(10, 5)
				) {
					//打款比例* 0.01 >= Math.pow(10, 5) =超10W
					paramJson.isAudit = 1
				} else {
					paramJson.isAudit = 0 //不超10W
				}
			}
			if (this.moneyToType == 1) {
				if (v == 1) {
					Url = firstAuditStFinance //首款初审不通过
				} else if (v == 2) {
					Url = firstAuditStFinanceFinal //首款三审不通过
				} else {
					Url = firstAuditStFinanceRepeat //首款复审不通过
				}
			} else if (this.moneyToType == 2) {
				if (v == 1) {
					Url = endAuditStFinance //尾款初审不通过
				} else if (v == 2) {
					Url = endAuditStFinanceFinal //尾款三审不通过
				} else {
					Url = endAgainStFinance //尾款复审不通过
				}
			} else {
				if (v == 1) {
					Url = previousAuditStFinance //往期提交对账
				} else if (v == 2) {
					Url = previousAuditStFinanceFinal //往期提交对账
				} else {
					Url = previousAgainStFinance //往期复审不通过
				}
			}
			_this
				.$prompt(title, '提示', {
					type: 'warning',
					inputPattern: /\S/,
					inputErrorMessage: '请输入不通过原因',
				})
				.then(async ({ value }) => {
					if (!value) return
					paramJson.remark = value
					_this.loading = true
					let {
						data: { resultCode },
					} = await Url(paramJson)
					_this.loading = false
					if (resultCode == 0) {
						_this.$message.success('成功')
						_this.particularsDetails()
					}
				})
		},
		//通过操作
		submitFirstSupplier: async function (v) {
			let Url
			let title =
				v == 1
					? '是否确认提交商家对账？'
					: v == 2
					? '是否确认审核通过账单'
					: v == 3
					? '是否确认三审通过账单'
					: '是否确认复审通过账单'
			let paramJson = {
				stFinanceId: this.stFinanceId,
				type: this.moneyToType,
				isTrue: 1, //通过
			}
			if (v == 4) {
				if (
					this.infoData.reconciliationAmount * this.infoData.ratio * 0.01 >=
					Math.pow(10, 5)
				) {
					//打款比例* 0.01 >= Math.pow(10, 5) =超10W
					paramJson.isAudit = 1
				} else {
					paramJson.isAudit = 0 //不超10W
				}
			}
			if (this.moneyToType == 1) {
				if (v == 1) {
					Url = submitFirstSupplierStFinance //首款提交对账
				} else if (v == 2) {
					Url = firstAuditStFinance //首款初审通过
				} else if (v == 3) {
					Url = firstAuditStFinanceFinal //首款三审通过
				} else {
					Url = firstAuditStFinanceRepeat //首款复审通过
				}
			} else if (this.moneyToType == 2) {
				if (v == 1) {
					Url = submitEndSupplierStFinance //尾款提交对账
				} else if (v == 2) {
					Url = endAuditStFinance //尾款初审
				} else if (v == 3) {
					Url = endAuditStFinanceFinal //尾款三审通过
				} else {
					Url = endAuditStFinanceRepeat //尾款复审通过
				}
			} else {
				if (v == 1) {
					Url = submitPreviousSupplierStFinance //往期提交对账
				} else if (v == 2) {
					Url = previousAuditStFinance //往期提交对账
				} else if (v == 3) {
					Url = previousAuditStFinanceFinal //往期三审通过
				} else {
					Url = previousAuditStFinanceRepeat //往期复审通过
				}
			}
			this.$confirm(title, '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						const {
							data: { resultCode, resultMsg: resultMsg1 },
						} = await Url(paramJson)
						if (resultCode == 0) {
							this.$message.success(resultMsg1)
							this.particularsDetails()
						}
					}
				},
			})
		},

		getPreview(path, index, v) {
			if (typeof this.infoData.url[index] == 'string') {
				this.infoData.url[index] = {
					path: path[index],
					pathShow: v,
					format: false,
				}
			} else {
				this.infoData.url[index].pathShow = v
				this.infoData.url[index].format = true
			}
			this.infoData = JSON.parse(JSON.stringify(this.infoData))
		},
		getImgCosServerPath(a, b) {
			let string = a[b] ? JSON.stringify(a[b]) : JSON.stringify(a[b].path)
			let index = string.lastIndexOf('.') //截取
			let ext = string.substr(index + 1) //获取文件后缀
			return ext == 'docx"' || ext == 'doc"'
		},
		confirmedError: async function (v) {
			let {
				data: { resultCode },
			} = await confirmStFinanceAmount({
				stFinanceId: this.stFinanceId,
				dataType: v,
				amount: 1,
			})
			if (resultCode == 0) {
				this.particularsDetails()
			}
		},
		downloadStatement: async function () {
			let paramJson = {
				stFinanceId: this.stFinanceId,
			}
			let addUrl
			let addExcelName
			if (this.moneyToType == 1) {
				addExcelName = '首款对账单.xls'
				addUrl = downloadFirstStFinance
			} else if (this.moneyToType == 2) {
				addExcelName = '尾款对账单.xls'
				addUrl = downloadLastStFinance
			} else {
				addExcelName = '往期数据对账单.xls'
				addUrl = downloadPastStFinance
			}
			if (this.infoData.status == 1) {
				let { data } = await addUrl(paramJson)
				downloadFile(data, addExcelName)
			} else {
				this.downloadFile(
					imgCosServerPath + this.downloadData.downUrl,
					addExcelName
				)
			}
		},
		getFinanceDownUrl: async function () {
			let Url =
				this.moneyToType == 1
					? getFirstStFinanceDownUrl
					: this.moneyToType == 2
					? getEndStFinanceDownUrl
					: getPreviousStFinanceDownUrl
			let {
				data: { resultCode, resultData },
			} = await Url({
				stFinanceId: this.stFinanceId,
				type: this.$route.query.moneyToType,
			})
			if (resultCode == 0) {
				this.downloadData = resultData
			}
		},

		downloadFile: function (downloadUrl, addExcelName) {
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
					a.download = addExcelName
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
		_listEndStFinanceSureAmount: async function () {
			let {
				data: { resultCode, resultData },
			} = await listEndStFinanceSureAmount({
				stFinanceId: this.stFinanceId,
				type: this.moneyToType,
			})
			if (resultCode == 0) {
				resultData.forEach((item) => {
					if (item.type == 3) {
						this.fineShow = true
					}
					if (item.type == 4) {
						this.marketingShow = true
					}
					if (item.type == 6) {
						this.elseShow = true
					}
				})
			}
		},

		particularsDetails: async function () {
			this.showLoading = true
			let paramJson = {
				stFinanceId: this.$route.query.stFinanceId,
				type: this.$route.query.moneyToType,
				supplierId: this.$route.query.supplierId,
			}
			let Url =
				paramJson.type == 1
					? getFirstStFinanceInfo
					: paramJson.type == 2
					? getEndStFinanceInfo
					: getPreviousStFinanceInfo
			let {
				data: { resultCode, resultData },
			} = await Url(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.infoData = resultData || {}
				this.stFinanceLastVO = resultData.stFinanceLastVO || {}
				if (
					this.infoData.status != 1 &&
					((this.moneyToType == 1 && this.getFirstStFinanceDownUrl) ||
						(this.moneyToType == 2 && this.getEndStFinanceDownUrl) ||
						(this.moneyToType == 3 && this.getPreviousStFinanceDownUrl))
				) {
					this.getFinanceDownUrl() //获取下载对账单
				}
			}
			if (this.moneyToType == 2) {
				this._listEndStFinanceSureAmount()
			}
		},
	},
}
</script>

<style lang="scss" scope>
.assembly {
	display: inline-block;
	margin-left: 10px;
}
.mb20 {
	margin-bottom: 20px;
}
.ml100 {
	margin-left: 100px;
}
.ml20 {
	margin-left: 20px;
}
.preview {
	width: 1000px;
	height: 1000px;
	display: flex;
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

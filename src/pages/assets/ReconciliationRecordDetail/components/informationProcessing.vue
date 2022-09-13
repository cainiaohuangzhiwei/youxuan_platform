<template>
	<div>
		<div v-if="!basicMessage">
			<h3 class="mb20">基本信息</h3>
			<div class="mb20">
				<span>公司名称:</span
				><span class="ml20">{{ baseInfo.supplierName }}</span>
			</div>
			<div class="mb20">
				<span>活动总额:</span
				><span class="ml20">￥{{ baseInfo.actTotalAmount }}</span>
			</div>
			<div class="mb20" v-if="headTrail">
				<span>首款付款金额:</span
				><span class="ml20">￥{{ baseInfo.realAmount }}</span>
			</div>
			<div v-if="!headTrail">
				<div class="mb20">
					<span>已付金额:</span
					><span class="ml20">￥{{ baseInfo.prePaidAmount }}</span>
				</div>
				<div class="mb20">
					<span>应付金额:</span
					><span class="ml20">￥{{ baseInfo.copeAmount }}</span>
				</div>
				<div class="mb20">
					<span>发生退款:</span
					><span class="ml20">￥{{ baseInfo.refundAmount }}</span>
				</div>
				<div class="mb20">
					<span>补款金额:</span
					><span class="ml20">￥{{ baseInfo.filingAmount }}</span>
				</div>
				<div class="mb20">
					<span>实付金额:</span
					><span class="ml20">￥{{ baseInfo.actualAmount }}</span>
				</div>
			</div>
			<div class="mb20">
				<span>审批备注:</span><span class="ml20">{{ baseInfo.remark }}</span>
			</div>
			<h3>基本信息</h3>
			<div class="mb20">
				<span>户名:</span><span class="ml20">{{ bankInfo.accountName }}</span>
			</div>
			<div class="mb20">
				<span>开户行:</span><span class="ml20">{{ bankInfo.bankName }}</span>
			</div>
			<div class="mb20">
				<span>账号:</span><span class="ml20">{{ bankInfo.accountNumber }}</span>
			</div>
			<h3 class="mb20">附件</h3>
			<div v-for="(item, index) in bankInfo.accessoryFileName" :key="index">
				<el-link
					type="primary"
					@click="getDownload(downloadList[index], item)"
					class="mb20 el-icon-download"
					>{{ item }}</el-link
				>
			</div>
			<h3 class="mb20">提交信息</h3>
			<div class="mb20">
				<span
					>提交人名称:<span class="ml20">{{
						operationInfo.clerkName
					}}</span></span
				>
			</div>
			<div class="mb20">
				<span
					>提交时间:<span class="ml20">{{
						moment(operationInfo.addTime).format('YYYY-MM-DD HH:mm:ss')
					}}</span></span
				>
			</div>
			<div class="mb20" v-for="(item, index) in records" :key="index">
				<h3>审核信息</h3>
				<span class="ml20">审批人名称:</span><span>{{ item.clerkName }}</span>
				<span class="ml20"
					>审批结果:<span>{{ item.result }}</span></span
				><span class="ml20"
					>审批备注:<span>{{ item.remark }}</span></span
				><span class="ml20"
					>提交时间:<span>{{
						moment(item.addTime).format('YYYY-MM-DD HH:mm:ss')
					}}</span></span
				>
			</div>
			<div
				class="mb20"
				style="display: flex"
				v-if="!remark_hide && remittanceButton"
			>
				<span class="must">*</span>
				<span class="w50">备注</span>
				<el-input
					type="textarea"
					v-model.trim="remark"
					maxlength="200"
					placeholder="请输入备注"
				></el-input>
			</div>
		</div>

		<div class="save_button" v-if="!offTheStocks">
			<el-button
				type="primary"
				v-if="!consentButton"
				@click="consentOrrefuse(1)"
				>同意</el-button
			>
			<el-button type="danger" v-if="!refuseButton" @click="consentOrrefuse(2)"
				>拒绝</el-button
			>
			<el-button
				type="primary"
				v-if="!remittanceButton"
				@click="initiateWithdrawal"
				>打款</el-button
			>
		</div>
		<yx-dialog width="600px" :visible.sync="visibleShow" :bottomBtn="bottomBtn">
			<yx-form
				labelWidth="100px"
				:data.sync="withdrawData"
				:items="dialogCfg"
				:rules="formRules"
				ref="dialog110"
			>
				<template slot="amount">
					<div class="withdrawal_amount">
						<span>￥{{ numberFormat(amount, 2) }}</span>
					</div>
				</template>
			</yx-form>
		</yx-dialog>
		<yx-dialog
			width="600px"
			:visible.sync="WithdrawalShow"
			:bottomBtn="WithdrawalShowBtn"
		>
			<div>
				<span>提现类型：</span>
				<span>成本提现账户</span>
			</div>
			<div>
				<span>提现账号：</span>
				<span>{{ withdrawData.cashAccount }}</span>
			</div>
			<div>
				<span>提现金额：</span>
				<span>{{ withdrawData.serviceCharge }}元</span>
			</div>
			<div>
				<span>提现手续费：</span>
				<span>{{ numberFormat(amount, 2) }}元</span>
			</div>
			<div>
				<span>备注：</span>
				<span>{{ withdrawData.remark }}</span>
			</div>
			<div>是否确定提现？</div>
		</yx-dialog>
	</div>
</template>

<script>
import {
	checkFinancePassWord,
	findRemainderByType,
} from '@/api/yhtPlusCmsFinance'
import { getPublicKeyAndModel } from '@/api/webUser.js'
import RSA from 'js-rsa-dave'
import YxForm from '@wg-vue-materials/yx-form'
import YxDialog from '@/components/Dialog/index.vue'
import { numberFormat } from '@/utils/helper/common'
// import { digitUppercase } from '@/utils/helper/common'
import { updateReconciliationStatusById } from '@/api/reconciliation'
import { doWithdraw } from '@/api/yhtPlusCmsFinance'
import moment from 'moment'

export default {
	props: {
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
		headTrail: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		YxForm,
		YxDialog,
	},

	data() {
		return {
			numberFormat,
			moment,
			operationInfo: {},
			baseInfo: {},
			bankInfo: {},
			records: [],
			remark: '',
			amount: 2,
			withdrawData: {
				withdrawText: '',
				accountNameAndNumber: '',
				cashAccount: '',
				serviceCharge: '',
				arrivalType: 0,
				remark: '',
			},
			WithdrawalShow: false,
			visibleShow: false,
			remark_hide: false,
			offTheStocks: false,
			basicMessage: false,
			remitRecord: false,
			remittanceButton: false,
			consentButton: false,
			refuseButton: false,
			formRules: {
				remark: [{ required: true, message: '请填写备注', trigger: 'blur' }],
			},
			WithdrawalShowBtn: [
				{
					title: '确认',
					type: 'primary',
					click: () => {
						this._sponsorWithdrawal()
					},
				},
			],
			bottomBtn: [
				{
					title: '确认',
					type: 'primary',
					click: () => {
						this.$refs.dialog110.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.WithdrawalShow = true
							}
						})
					},
				},
				{
					title: '取消',
					type: 'default',
					click: () => {
						this.visibleShow = false
					},
				},
			],
			dialogCfg: [
				{
					type: 'text',
					dataIndex: 'withdrawText',
					title: '类型',
				},
				{
					type: 'text',
					dataIndex: 'accountNameAndNumber',
					title: '账户余额',
				},
				{
					type: 'text',
					dataIndex: 'cashAccount',
					title: '提现账号',
				},
				{
					type: 'text',
					dataIndex: 'serviceCharge',
					title: '提现金额',
				},
				{
					type: 'radio',
					title: '提现方式',
					dataIndex: 'arrivalType',
					options: this.$store.state.app.constant.ARRIVAL_TYPE,
					label: 'value',
					change: () => {
						this.aCommission()
					},
				},
				{
					type: 'custom',
					dataIndex: 'amount',
					title: '提现手续费',
				},
				{
					type: 'textarea',
					dataIndex: 'remark',
					title: '备注',
				},
			],
		}
	},

	watch: {
		itemInfo() {
			this.init()
		},
		headTrail() {
			this.init()
		},
	},
	created() {},

	methods: {
		async _sponsorWithdrawal() {
			let arrParamJson = {
				amount: numberFormat(this.withdrawData.serviceCharge, 2),
				remark: this.withdrawData.remark,
				serviceCharge: String(this.amount),
				type: 2,
				organizationId: 0,
				arrivalType: this.withdrawData.arrivalType,
				reconciliationExaminationId: Number(
					this.itemInfo.reconciliationExaminationId
				),
			}

			let {
				data: { resultCode, resultMsg },
			} = await doWithdraw(arrParamJson)
			if (resultCode == 0) {
				this.WithdrawalShow = false
				this.visibleShow = false
				this.$message.success(resultMsg)
			}
		},
		aCommission() {
			// 设置手续费
			let serviceCharge = 2
			if (this.withdrawData.arrivalType == 1) {
				// t+1
				serviceCharge = Math.abs(this.withdrawData.serviceCharge) * 0.0003
				if (serviceCharge < 0.01) {
					serviceCharge = 0.01
				} else {
					serviceCharge = serviceCharge.toFixed(2)
					serviceCharge = Math.round(serviceCharge * 100) / 100
				}
				serviceCharge += 2
			}
			this.amount = Math.abs(this.withdrawData.serviceCharge)
				? serviceCharge
				: 0
		},
		initiateWithdrawal() {
			// 发起提现
			this.$prompt('提现密码', '', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
				inputErrorMessage: '请输入密码',
				inputType: 'password',
			}).then(async ({ value }) => {
				this.visible = false
				let {
					data: { resultCode },
				} = await checkFinancePassWord(
					await this.getRSAPassword({
						password: value,
					})
				)
				if (resultCode == 0) {
					this._doWithdraw()
				}
			})
		},
		async _doWithdraw() {
			this.withdrawData = {}
			this.withdrawData.withdrawText = '成本账号提现	'
			this.withdrawData.cashAccount =
				this.bankInfo.accountName +
				this.bankInfo.bankName +
				this.bankInfo.accountNumber
			this.withdrawData.arrivalType = 0
			this.withdrawData.serviceCharge = this.headTrail
				? this.baseInfo.realAmount
				: this.baseInfo.filingAmount
			let {
				data: { resultCode, resultData },
			} = await findRemainderByType({
				type: 2,
			})
			if (resultCode == 0) {
				this.withdrawData.accountNameAndNumber = resultData
				this.visibleShow = true
			}
		},
		async getRSAPassword(paramJson) {
			let psw = paramJson.password.split('').reverse().join('')
			let resaData = await getPublicKeyAndModel()
			let publicKey = RSA.getKeyPair(
				resaData.data.resultData.publicKeyIndex,
				'',
				resaData.data.resultData.modulus
			)
			paramJson.password = RSA.encryptedString(publicKey, psw)
			paramJson.privateKeySessionKey =
				resaData.data.resultData.privateKeySessionKey
			return paramJson
		},
		//处理详细信息
		init() {
			console.log('=== this.headTrail==', this.headTrail)
			this.bankInfo = this.itemInfo.bankInfo
			this.baseInfo = this.itemInfo.baseInfo
			this.operationInfo = this.itemInfo.operationInfo
			this.records = this.itemInfo.records
			if (this.bankInfo && this.bankInfo.attachmentUrl) {
				this.downloadList = this.bankInfo.attachmentUrl.split(',')
			}
			// ("1", "未提交"),("2", "待确认"),("3", "待审核"),("4", "待付款"),("5", "付款中"),("6", "已完成"),("7", "已拒绝"),("8", "付款失败");
			let status = this.headTrail
				? this.itemInfo.reconciliationRecord.firstStatus
				: this.itemInfo.reconciliationRecord.lastStatus
			this.remark_hide = false
			this.offTheStocks = false
			this.basicMessage = false
			this.remitRecord = false
			this.remittanceButton = false
			this.consentButton = false
			this.refuseButton = false

			switch (status) {
				case 1:
				case 7:
					this.remark_hide = true //备注
					this.offTheStocks = true //全部按钮
					this.basicMessage = true //全部详情信息
					break
				case 2:
				case 3:
					this.remitRecord = true //隐藏打款记录
					this.remittanceButton = true //打款
					break
				case 6:
					this.remark_hide = true //备注
					this.offTheStocks = true //全部按钮
					break
				case 4:
				case 5:
				case 8:
					this.consentButton = true //同意
					this.refuseButton = true //拒绝
					this.remark_hide = true //备注
					this.remitRecord = true //隐藏打款记录
					break
			}
		},
		async consentOrrefuse(v) {
			if (!this.remark) {
				return this.$message.warning('请填写备注')
			}
			const {
				data: { resultCode },
			} = await updateReconciliationStatusById({
				type: this.headTrail ? 1 : 2,
				isAgree: v,
				reconciliationRecordId: this.$route.params.reconciliationRecordId,
				remark: this.remark,
			})
			if (resultCode == 0) {
				this.$emit('initTable')
			}
		},

		onChange(file, fileList) {
			// 文件列表改变
			this.fileList = fileList
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
		//下载
		getDownload(accessoryContent, accessoryFieName) {
			console.log('-----------', accessoryContent, accessoryFieName)
			let downLoadServer
			if (location.host.indexOf('127.0.0.1') > -1) {
				downLoadServer = 'https://fors-ali-pressure.yunhuotong.net/yhtplus/'
			} else {
				downLoadServer = location.origin + '/yhtplus/'
			}
			console.log(
				'-----------',
				this.staticDownloadFile(
					downLoadServer + accessoryContent,
					accessoryFieName
				)
			)
			this.staticDownloadFile(
				downLoadServer + accessoryContent,
				accessoryFieName
			)
		},
		//静态下载
		staticDownloadFile: function (downloadUrl, accessoryFileName) {
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

<style lang="scss" scoped></style>

<template>
	<basic-container>
		<el-steps
			:active="activeStep"
			finish-status="success"
			simple
			style="margin-top: 20px"
		>
			<el-step title="确认资料"></el-step>
			<el-step title="待账户验证"></el-step>
			<el-step title="审核中"></el-step>
			<el-step title="待签约"></el-step>
			<el-step title="签约完成"></el-step>
		</el-steps>
		<h3>企业基本信息</h3>
		<el-card shadow="never">
			<yx-form
				ref="yxForm1"
				:rules="formRules"
				:formDisabled="formDisabled"
				:items="formItems1"
				:data="formData1"
				labelWidth="200px"
			>
				<template slot="businessTime">
					<el-radio-group v-model="formData1.type" class="radio-group">
						<el-radio :label="1" class="radio-item">
							<div class="radio-item">
								<el-date-picker
									v-model="formData1.businessTime"
									type="daterange"
									range-separator="至"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									@change="validityPeriodChange(1)"
								>
								</el-date-picker>
								<span style="margin-left: 20px"
									>注：证件有效期到期时间必须大于 60
									天，即到期时间距当前时间需超过 60 天</span
								>
							</div>
						</el-radio>
						<el-radio style="margin-top: 20px" :label="2"
							><el-date-picker
								v-model="formData1.businessTimeStart"
								type="date"
								placeholder="选择日期"
							>
							</el-date-picker>
							- 长期</el-radio
						>
					</el-radio-group>
				</template>
				<template slot="businessLicenseCopy">
					<div>
						<el-upload
							v-if="!formData1.businessLicenseCopy"
							class="wg_upload cash-account-details-upload"
							ref="uploadFile"
							:show-file-list="false"
							drag
							accept="image/bmp, image/jpeg, image/jpg, image/png"
							:multiple="false"
							:before-upload="beforeAvatarUpload"
							:http-request="
								(file) => {
									uploadImageHttpRequest(file)
								}
							"
						>
							<div class="upload_tip" slot="trigger">上传文件</div>
						</el-upload>
						<div v-else class="image-box">
							<el-image
								class="image-box"
								:src="getBigImg(formData1.businessLicenseCopy)"
								:preview-src-list="[getBigImg(formData1.businessLicenseCopy)]"
							></el-image>
							<el-upload
								class="wg_replace-image"
								ref="uploadFile"
								:show-file-list="false"
								accept="image/gif, image/jpeg, image/jpg, image/png"
								:multiple="false"
								:before-upload="beforeAvatarUpload"
								:http-request="
									(file) => {
										uploadImageHttpRequest(file)
									}
								"
							>
								<div slot="trigger">重新上传</div>
							</el-upload>
						</div>
						<div class="el-upload__tip" slot="tip">
							1.媒体图片只支持JPG、BMP、PNG格式
						</div>
						<div class="el-upload__tip" slot="tip">2.文件大小不能超过2M。</div>
					</div>
				</template>
			</yx-form>
		</el-card>
		<h3>管理员基本信息</h3>
		<el-card shadow="never">
			<yx-form
				ref="yxForm2"
				:rules="formRules"
				:data="formData2"
				:formDisabled="formDisabled"
				:items="formItems2"
				labelWidth="200px"
			>
				<template slot="tip">
					<div class="tip">
						*
						请谨慎选择法人或联系人信息，管理员用于接收支付账户的重要管理信息及日常操作验证码。
					</div>
				</template>
				<template slot="idCardValidTime">
					<div>
						<el-radio-group
							v-model="formData2.certificateValidDateType"
							class="radio-group"
						>
							<el-radio :label="1" class="radio-item">
								<div class="radio-item">
									<el-date-picker
										v-model="formData2.idCardValidTime"
										type="daterange"
										range-separator="至"
										start-placeholder="开始日期"
										end-placeholder="结束日期"
										@change="validityPeriodChange(2)"
									>
									</el-date-picker>
								</div>
							</el-radio>
							<el-radio style="margin-top: 20px" :label="2"
								><el-date-picker
									v-model="formData2.idCardValidTimeStart"
									type="date"
									placeholder="选择日期"
								>
								</el-date-picker>
								- 长期</el-radio
							>
						</el-radio-group>
					</div>
				</template>
				<template slot="idCard">
					<div>
						<p>请按顺序分别上传人面像和国徽面电子版图片，图片必须清晰可见。</p>
						<p>注：请尽量避免使用有多余空白的照片</p>
						<div class="image-container">
							<el-upload
								v-if="!formData2.idCardCopy"
								class="wg_upload cash-account-details-upload"
								ref="uploadFile"
								:http-request="
									(file) => {
										uploadImageHttpRequest(file, 'idCardCopy')
									}
								"
								:show-file-list="false"
								drag
								accept="image/bmp, image/jpeg, image/jpg, image/png"
								:multiple="false"
								:before-upload="beforeAvatarUpload"
							>
								<div class="upload_tip" slot="trigger">人面像</div>
							</el-upload>
							<div v-else class="image-box">
								<el-image
									class="image-box"
									:src="getBigImg(formData2.idCardCopy)"
									:preview-src-list="[getBigImg(formData2.idCardCopy)]"
								></el-image>
								<el-upload
									class="wg_replace-image"
									ref="uploadFile"
									:http-request="
										(file) => {
											uploadImageHttpRequest(file, 'idCardCopy')
										}
									"
									:show-file-list="false"
									accept="image/bmp, image/jpeg, image/jpg, image/png"
									:multiple="false"
									:before-upload="beforeAvatarUpload"
								>
									<div slot="trigger">重新上传</div>
								</el-upload>
							</div>
							<el-upload
								v-if="!formData2.idCardNational"
								class="wg_upload cash-account-details-upload"
								ref="uploadFile"
								drag
								:http-request="
									(file) => {
										uploadImageHttpRequest(file, 'idCardNational')
									}
								"
								:show-file-list="false"
								accept="image/bmp, image/jpeg, image/jpg, image/png"
								:multiple="false"
								:before-upload="beforeAvatarUpload"
							>
								<div class="upload_tip" slot="trigger">国徽面</div>
							</el-upload>
							<div v-else class="image-box">
								<el-image
									class="image-box"
									:src="getBigImg(formData2.idCardNational)"
									:preview-src-list="[getBigImg(formData2.idCardNational)]"
								></el-image>
								<el-upload
									class="wg_replace-image"
									ref="uploadFile"
									:http-request="
										(file) => {
											uploadImageHttpRequest(file, 'idCardNational')
										}
									"
									:show-file-list="false"
									accept="image/bmp, image/jpeg, image/jpg, image/png"
									:multiple="false"
									:before-upload="beforeAvatarUpload"
								>
									<div slot="trigger">重新上传</div>
								</el-upload>
							</div>
						</div>
					</div>
				</template>
			</yx-form>
		</el-card>
		<h3>开户银行信息</h3>
		<el-card shadow="never">
			<yx-form
				ref="yxForm3"
				:rules="formRules"
				:data="formData3"
				:formDisabled="true"
				:items="formItems3"
				labelWidth="200px"
			>
				<template slot="tip">
					<div>银行账户名称必须与营业执照上的“商户名称”一致</div>
				</template>
				<template slot="area">
					<div>
						<el-select
							v-model="bankInfo.provinceCode"
							placeholder="请选择省"
							@change="
								(code) => {
									this.getAreaList(code, 'cityList')
								}
							"
						>
							<el-option
								v-for="item in provinceList"
								:key="item.code"
								:label="item.simpleName"
								:value="item.code"
							>
							</el-option>
						</el-select>
						<el-select
							style="margin-left: 20px"
							v-if="cityList.length"
							v-model="bankInfo.cityCode"
							placeholder="请选择市"
							@change="
								(code) => {
									this.getAreaList(code, 'areaList')
								}
							"
						>
							<el-option
								v-for="item in cityList"
								:key="item.code"
								:label="item.simpleName"
								:value="item.code"
							>
							</el-option>
						</el-select>
						<!-- <el-select
							style="margin-left: 20px"
							v-if="areaList.length"
							v-model="bankInfo.areaCode"
							placeholder="请选择市"
						>
							<el-option
								v-for="item in areaList"
								:key="item.code"
								:label="item.simpleName"
								:value="item.code"
							>
							</el-option>
						</el-select> -->
					</div>
				</template>
			</yx-form>
		</el-card>
		<h3>商户类型</h3>
		<el-card shadow="never">
			<span>支付商户类型</span>
			<el-radio-group
				:disabled="formDisabled"
				style="margin-left: 20px"
				v-model="merchantType"
			>
				<el-radio :label="1">招商公司</el-radio>
				<el-radio :label="2">推广公司</el-radio>
			</el-radio-group>
		</el-card>
		<div
			class="footer-box"
			v-if="
				sftInfoData.merchantSftAccount &&
				(sftInfoData.merchantSftAccount.state == 0 ||
					sftInfoData.merchantSftAccount.state == 4)
			"
		>
			<el-button @click="cancel">取消</el-button>
			<el-button @click="submit" type="primary">提交信息</el-button>
		</div>
		<el-dialog
			title=""
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:show-close="false"
			:modal-append-to-body="false"
			:visible.sync="dialogVisible"
			width="800px"
			center
		>
			<div class="box-c">
				<h2 class="fw">
					微信审核已通过，请使用签约时填入管理员微信进行扫码认证
				</h2>
				<div class="qrcodeimg">
					<div class="item" id="qrcode" ref="qrCode" xss="removed"></div>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
				<el-button type="primary" @click="_sweptCodeState"> 我已扫码</el-button>
			</span>
		</el-dialog>
		<!-- 待账户验证 -->
		<el-dialog
			:visible.sync="accountVerifiedDialog"
			labelWidth="105px"
			:modal-append-to-body="false"
			title="账户汇款验证"
		>
			<yx-info
				:data="sftInfoData.merchantSftAccountResult"
				:items="accountVerifiedItems"
			>
			</yx-info>
		</el-dialog>
	</basic-container>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { uploadFile } from '@/api/image'
import BasicContainer from '@wg-vue-materials/basic-container'
import { getSftDetail, sftAccount, sweptCodeState } from '@/api/accountService'
import { bankAddressCode } from '@/api/weeget-bullet-payment-rest'
import { getBigImg } from '@/utils/imageTool'
import QRCode from 'qrcodejs2'
import YxInfo from '@wg-vue-materials/yx-info'
import moment from 'moment'
export default {
	name: 'payMerchandon',
	components: {
		BasicContainer,
		YxForm,
		YxInfo,
	},
	data() {
		return {
			accountVerifiedDialog: false,
			//待验证信息
			accountVerifiedItems: [
				{
					type: 'string',
					title: '付款户名',
					dataIndex: 'accountName',
				},
				{
					type: 'string',
					title: '汇款金额',
					dataIndex: 'payAmount',
					customRender: () => {
						return (
							'￥' + this.sftInfoData.merchantSftAccountResult.payAmount / 100
						)
					},
				},
				{
					type: 'string',
					title: '收款卡号',
					dataIndex: 'destinationAccountNumber',
				},
				{
					type: 'string',
					title: '收款户名',
					dataIndex: 'destinationAccountName',
				},
				{
					type: 'string',
					title: '开户银行',
					dataIndex: 'destinationAccountBank',
				},
				{
					type: 'string',
					title: '省市信息',
					dataIndex: 'city',
				},
				{
					type: 'string',
					title: '备注信息',
					dataIndex: 'remark',
				},
				{
					type: 'string',
					title: '汇款截止时间',
					dataIndex: 'deadline',
					// customRender: () => {
					//   return this.accountVerifiedItems.deadline ? moment(this.accountVerifiedItems.deadline).format(
					//     'YYYY-MM-DD HH:mm:ss') : '-'
					// },
				},
			],
			activeStep: 1,
			merchantType: 1,
			params: this.$route.params,
			formDisabled: true,
			bankInfo: {
				provinceCode: '',
				cityCode: '',
				// areaCode: '',
			},
			getBigImg: getBigImg,
			dialogVisible: false,
			// uploadImageList: uploadImageList,
			formData1: {
				merchantName: '',
				companyAddress: '',
				businessLicenseNumber: '',
				type: 1,
				businessTimeStart: '',
				businessTime: [],
				businessLicenseCopy: '',
			},
			formRules: {
				merchantName: [
					{ required: true, message: '请输入企业名称', trigger: 'blur' },
				],
				companyAddress: [
					{ required: true, message: '请输入公司详细地址', trigger: 'blur' },
				],
				businessLicenseNumber: [
					{
						required: true,
						message: '请输入统一社会信用代码',
						trigger: 'blur',
					},
				],
				businessTime: [
					{
						validator: (rule, value, callback) => {
							if (this.formData1.type == 1) {
								if (!this.formData1.businessTime.length) {
									callback(new Error('请选择时间'))
								} else if (
									moment(this.formData1.businessTime[1]).valueOf() <
									moment().endOf('day').valueOf() + 60 * 24 * 60 * 60 * 1000
								) {
									callback(
										new Error(
											'证件有效期到期时间必须大于 60 天，即到期时间距当前时间需超过 60 天'
										)
									)
								} else {
									callback()
								}
							} else {
								if (!this.formData1.businessTimeStart) {
									callback(new Error('请选择开始时间'))
								} else {
									callback()
								}
							}
						},
						trigger: 'blur',
					},
				],
				businessLicenseCopy: [
					{
						validator: (rule, value, callback) => {
							if (!this.formData1.businessLicenseCopy) {
								callback(new Error('请上传营业执照'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				contactType: [{ required: true, message: '请选择', trigger: 'change' }],
				legalPerson: [
					{ required: true, message: '请输入法人姓名', trigger: 'blur' },
				],
				idDocType: [
					{ required: true, message: '请选择证件类型', trigger: 'change' },
				],
				idCardNumber: [
					{
						validator: (rule, value, callback) => {
							const pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
							if (value === '') {
								callback(new Error('请输入身份证号'))
							} else {
								if (!pattern.test(value)) {
									callback(new Error('身份证号码错误'))
								} else {
									callback()
								}
							}
						},
						trigger: 'blur',
					},
				],
				legalPersonMobilePhoneNumber: [
					{
						validator: (rule, value, callback) => {
							const pattern = /^1[34578]\d{9}$/
							if (value === '') {
								callback(new Error('请输入预留手机号'))
							} else {
								if (!pattern.test(value)) {
									callback(new Error('请输入正确手机号码'))
								} else {
									callback()
								}
							}
						},
						trigger: 'blur',
					},
				],
				idCardValidTime: [
					{
						validator: (rule, value, callback) => {
							if (this.formData2.certificateValidDateType == 1) {
								if (!this.formData2.idCardValidTime.length) {
									callback(new Error('请选择时间'))
								} else if (
									moment(this.formData2.idCardValidTime[1]).valueOf() <
									moment().endOf('day').valueOf() + 60 * 24 * 60 * 60 * 1000
								) {
									callback(
										new Error(
											'证件有效期到期时间必须大于 60 天，即到期时间距当前时间需超过 60 天'
										)
									)
								} else {
									callback()
								}
							} else {
								if (!this.formData2.idCardValidTimeStart) {
									callback(new Error('请选择开始时间'))
								} else {
									callback()
								}
							}
						},
						trigger: 'blur',
					},
				],
				idCard: [
					{
						validator: (rule, value, callback) => {
							if (
								!this.formData2.idCardCopy &&
								!this.formData2.idCardNational
							) {
								callback(new Error('请上传证件照'))
							} else if (!this.formData2.idCardCopy) {
								callback(new Error('请上传人面面'))
							} else if (!this.formData2.idCardNational) {
								callback(new Error('请上传国徽面'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				accountBank: [
					{
						required: true,
						message: '请选择银行名称',
						trigger: 'change',
					},
				],
				accountName: [
					{ required: true, message: '请输入银行账户名称', trigger: 'blur' },
				],
				accountNumber: [
					{ required: true, message: '请输入银行账户号', trigger: 'blur' },
				],
				bankName: [
					{ required: true, message: '请输入开户支行', trigger: 'blur' },
				],
				bankBranchId: [
					{ required: true, message: '请输入联行号', trigger: 'blur' },
				],
			},
			formItems1: [
				{
					title: '企业名称',
					type: 'input',
					dataIndex: 'merchantName',
					class: 'input-box-bind-account',
				},
				{
					title: '公司详细地址',
					type: 'input',
					dataIndex: 'companyAddress',
					class: 'input-box-bind-account',
				},
				{
					title: '统一社会信用代码',
					type: 'input',
					dataIndex: 'businessLicenseNumber',
					class: 'input-box-bind-account',
				},
				{
					type: 'custom',
					title: '组织机构有效期',
					dataIndex: 'businessTime',
				},
				{
					type: 'custom',
					title: '营业执照',
					dataIndex: 'businessLicenseCopy',
				},
			],
			formData2: {
				contactType: 1,
				legalPerson: '',
				idDocType: 1,
				idCardNumber: '',
				certificateValidDateType: 1,
				idCardValidTime: [],
				idCardValidTimeStart: '',
				legalPersonMobilePhoneNumber: '',
				contactEmail: '',
				idCardCopy: '',
				idCardNational: '',
			},
			formItems2: [
				{
					type: 'custom',
					unformItem: true,
					dataIndex: 'tip',
				},
				{
					title: '法人姓名',
					type: 'input',
					dataIndex: 'legalPerson',
					class: 'input-box-bind-account',
				},
				{
					title: '法人证件类型',
					type: 'select',
					dataIndex: 'idDocType',
					label: 'value',
					class: 'input-box-bind-account',
					// 证件类型: 1-身份证,2-护照,3-中国香港居民-来往内地通行证,4-中国澳门居民-来往内地通行证,5-中国台湾居民-来往大陆通行证
					options: [
						{
							idDocType: 1,
							value: '身份证',
						},
						// {
						// 	idDocType: 2,
						// 	value: '护照',
						// },
						// {
						// 	idDocType: 3,
						// 	value: '中国香港居民-来往内地通行证',
						// },
						// {
						// 	idDocType: 4,
						// 	value: '中国澳门居民-来往内地通行证',
						// },
						// {
						// 	idDocType: 5,
						// 	value: '中国台湾居民-来往大陆通行',
						// },
					],
				},
				{
					title: '法人证件号',
					type: 'input',
					dataIndex: 'idCardNumber',
					class: 'input-box-bind-account',
				},
				{
					type: 'custom',
					title: '法人证件有效期',
					dataIndex: 'idCardValidTime',
				},
				{
					title: '法人手机号',
					type: 'inputNumber',
					dataIndex: 'legalPersonMobilePhoneNumber',
					class: 'input-box-bind-account',
				},
				{
					title: '法人邮箱',
					type: 'input',
					dataIndex: 'contactEmail',
					class: 'input-box-bind-account',
				},
				{
					type: 'custom',
					title: '法人证件',
					dataIndex: 'idCard',
				},
			],
			formData3: {
				accountBank: '',
				accountName: '',
				accountNumber: '',
				bankName: '',
				bankBranchId: '',
			},
			formItems3: [
				{
					title: '银行名称',
					type: 'input',
					dataIndex: 'accountBank',
					class: 'input-box-bind-account',
				},
				{
					title: '银行账户名称',
					type: 'input',
					dataIndex: 'accountName',
					class: 'input-box-bind-account',
				},
				{
					type: 'custom',
					dataIndex: 'tip',
				},
				{
					title: '银行账户号',
					type: 'input',
					dataIndex: 'accountNumber',
					class: 'input-box-bind-account',
				},
				{
					title: '开户支行',
					type: 'input',
					dataIndex: 'bankName',
					class: 'input-box-bind-account',
				},
				{
					title: '银行所在城市',
					type: 'custom',
					dataIndex: 'area',
				},
				{
					title: '联行号',
					type: 'input',
					dataIndex: 'bankBranchId',
					class: 'input-box-bind-account',
				},
			],
			provinceList: [],
			cityList: [],
			// areaList: [],
			sftInfoData: {},
			loading: false,
		}
	},
	watch: {
		$route: {
			immediate: true,
			deep: true,
			handler(newValue) {
				console.log('this.loading)>>>>', this.loading)
				if (newValue.name == 'payMerchandon' && !this.loading) {
					this._bankCodes('', (resultCode, resultData) => {
						if (resultCode == 0) {
							this.provinceList = resultData.bankAddressCodeBOS
						}
					})
					this._getSftDetail()
				}
			},
		},
	},
	created() {},
	methods: {
		async _sweptCodeState() {
			let {
				data: { resultCode },
			} = await sweptCodeState({
				outRequestNo: this.sftInfoData.merchantSftAccount.outRequestNo,
			})
			if (resultCode == 0) {
				this.$message({
					message: '如已扫码成功,请稍后查询',
					type: 'success',
				})
			}
		},
		async _getSftDetail() {
			let {
				data: { resultCode, resultData },
			} = await getSftDetail({
				accountRecordNo: this.params.accountRecordNo,
			})
			this.loading = true
			if (resultCode == 0) {
				this.sftInfoData = resultData
				this.formData1 = {
					merchantName: resultData.merchantSftAccount.merchantName,
					companyAddress: resultData.merchantSftAccount.companyAddress,
					businessLicenseNumber:
						resultData.merchantSftAccount.businessLicenseNumber,
					type: resultData.merchantSftAccount.businessTimeEnd == '长期' ? 2 : 1,
					businessTimeStart: resultData.merchantSftAccount.businessTimeStart,
					businessTime:
						resultData.merchantSftAccount.businessTimeEnd == '长期'
							? []
							: [
									resultData.merchantSftAccount.businessTimeStart,
									resultData.merchantSftAccount.businessTimeEnd,
							  ],
					businessLicenseCopy:
						resultData.merchantSftAccount.businessLicenseCopy,
				}
				this.formData2 = {
					contactType: resultData.merchantSftAccount.isLegalPersonEqContact
						? 1
						: 2,
					legalPerson: resultData.merchantSftAccount.legalPerson,
					idDocType: 1,
					idCardNumber: resultData.merchantSftAccount.idCardNumber,
					certificateValidDateType:
						resultData.merchantSftAccount.idCardValidTimeEnd == '长期' ? 2 : 1,
					idCardValidTime:
						resultData.merchantSftAccount.idCardValidTimeEnd == '长期'
							? []
							: [
									resultData.merchantSftAccount.idCardValidTimeStart,
									resultData.merchantSftAccount.idCardValidTimeEnd,
							  ],
					idCardValidTimeStart:
						resultData.merchantSftAccount.idCardValidTimeEnd == '长期'
							? resultData.merchantSftAccount.idCardValidTimeStart
							: '',
					legalPersonMobilePhoneNumber:
						resultData.merchantSftAccount.legalPersonMobilePhoneNumber,
					contactEmail: resultData.merchantSftAccount.contactEmail,
					idCardCopy: resultData.merchantSftAccount.idCardCopy,
					idCardNational: resultData.merchantSftAccount.idCardNational,
				}
				this.formData3 = {
					accountBank: resultData.merchantSftBankAccount.accountBank,
					accountName: resultData.merchantSftBankAccount.accountName,
					accountNumber: resultData.merchantSftBankAccount.accountNumber,
					bankName: resultData.merchantSftBankAccount.bankName,
					bankBranchId: resultData.merchantSftBankAccount.bankBranchId,
				}
				this.merchantType = resultData.merchantSftAccount.merchantType
				let municipalityList = [
					'110000',
					'120000',
					'310000',
					'500000',
					'810000',
					'820000',
				]
				let provinceCode = `${resultData.merchantSftBankAccount.bankCityCode.slice(
					0,
					2
				)}0000`
				let cityCode =
					municipalityList.indexOf(provinceCode) != -1
						? resultData.merchantSftBankAccount.bankCityCode
						: `${resultData.merchantSftBankAccount.bankCityCode.slice(0, 4)}00`
				let bankInfo = {
					provinceCode,
					cityCode,
					// areaCode: resultData.merchantSftBankAccount.bankCityCode,
				}
				this._bankCodes(bankInfo.provinceCode, (code, data) => {
					if (code == 0) {
						this.cityList = data.bankAddressCodeBOS
					}
				})
				// this._bankCodes(bankInfo.cityCode, (code, data) => {
				// 	if (code == 0) {
				// 		this.areaList = data.bankAddressCodeBOS
				// 	}
				// })
				this.bankInfo = bankInfo
				this.formDisabled = resultData.merchantSftAccount.state != 0
				this.dialogVisible = resultData.merchantSftAccount.state == 5
				if (resultData.merchantSftAccount.state == 2) {
					this.accountVerifiedDialog = true
				}
				if (resultData.merchantSftAccount.state == 4) {
					const h = this.$createElement
					this.$msgbox({
						title: '验证不通过',
						message: h('p', null, [
							h('span', null, '验证不通过，原因是 '),
							h(
								'span',
								{ style: 'color: red' },
								resultData.merchantSftAccountResult.auditDetailDisplay
							),
						]),
						showCancelButton: false,
						showClose: false,
						closeOnClickModal: false,
						closeOnPressEscape: false,
						confirmButtonText: '确定',
					}).then(() => {
						this.formDisabled = false
					})
				}
				console.log(
					this.dialogVisible,
					'dialogVisible>>>>',
					resultData.merchantSftAccount.state
				)
				if (this.dialogVisible) {
					this.$nextTick(() => {
						let qr = new QRCode(this.$refs.qrCode, {
							width: 400,
							height: 400,
							// text: 'https://pay.weixin.qq.com/public/apply4ec_sign/s?applymentId=2000002196473389&sign=4619115dd3ad9dadfcf2b8bc3584621d', //URL地址 // 二维码内容
							text: this.sftInfoData.merchantSftAccountResult.signUrl, //'https://pay.weixin.qq.com/public/apply4ec_sign/s?applymentId=2000002196473389&sign=4619115dd3ad9dadfcf2b8bc3584621d', //URL地址 // 二维码内容
							// render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
							colorDark: '#1ba42f',
							colorLight: '#FFFFFF',
						})
						console.log(qr)
					})
				}
				switch (resultData.merchantSftAccount.state) {
					case 0:
					case 1:
					case 4:
						this.activeStep = 1
						break
					case 2:
						this.activeStep = 2
						break
					case 3:
					case 7:
						this.activeStep = 3
						break
					case 5:
						this.activeStep = 4
						break
					default:
						this.activeStep = 5
						break
				}
			}
		},
		getAreaList(code, key) {
			if (key == 'cityList') {
				this.bankInfo.cityCode = ''
				// this.bankInfo.areaCode = ''
				// this.areaList = []
			} else {
				// this.bankInfo.areaCode = ''
			}
			this._bankCodes(code, (resultCode, resultData) => {
				if (resultCode == 0) {
					this[key] = resultData.bankAddressCodeBOS
				}
			})
		},
		async _bankCodes(code = '', cb) {
			let {
				data: { resultCode, resultData },
			} = await bankAddressCode({
				code,
				channel: 'SU_NING',
				sign: 'a29c832d825365aba30267d0c6209156',
				developerId: 10001,
				signType: 'MD5',
				version: '1.0',
			})
			if (cb) {
				cb(resultCode, resultData)
			}
		},
		async submit() {
			this.$refs.yxForm1.$refs.YxForm.validate((valid1) => {
				this.$refs.yxForm2.$refs.YxForm.validate((valid2) => {
					this.$refs.yxForm3.$refs.YxForm.validate(async (valid3) => {
						if (valid1 && valid2 && valid3) {
							let paramJson = Object.assign(
								{},
								{
									...this.formData1,
									...this.formData2,
									...this.formData3,
									accountRecordNo: this.params.accountRecordNo,
									merchantType: this.merchantType,
									isLegalPersonEqContact: true,
									bankCityCode:
										this.bankInfo.cityCode || this.bankInfo.provinceCode,
								}
							)
							paramJson.businessTimeStart =
								this.formData1.type == 1
									? moment(this.formData1.businessTime[0]).format('YYYY-MM-DD')
									: moment(this.formData1.businessTimeStart).format(
											'YYYY-MM-DD'
									  )
							paramJson.businessTimeEnd =
								this.formData1.type == 1
									? moment(this.formData1.businessTime[1]).format('YYYY-MM-DD')
									: '长期'
							paramJson.idCardValidTimeStart =
								this.formData2.certificateValidDateType == 1
									? moment(this.formData2.idCardValidTime[0]).format(
											'YYYY-MM-DD'
									  )
									: moment(this.formData2.idCardValidTimeStart).format(
											'YYYY-MM-DD'
									  )
							paramJson.idCardValidTimeEnd =
								this.formData2.certificateValidDateType == 1
									? moment(this.formData2.idCardValidTime[1]).format(
											'YYYY-MM-DD'
									  )
									: '长期'
							delete paramJson.businessTime
							delete paramJson.idCardValidTime
							delete paramJson.type
							delete paramJson.certificateValidDateType
							let {
								data: { resultCode },
							} = await sftAccount(paramJson)
							if (resultCode == 0) {
								this.loading = false
								this._getSftDetail()
								this.$store
									.dispatch('tagsView/delVisitedView', this.$route)
									.then(() => {
										this.$router.push({
											path: '/fund/paymentChannelBusinessEntry',
										})
									})
							}
							// console.log('>>>>>>>>', data)
						}
					})
				})
			})
		},
		cancel() {
			this.$store.dispatch('tagsView/delVisitedView', this.$route).then(() => {
				this.$router.push({
					path: '/fund/paymentChannelBusinessEntry',
				})
			})
		},
		async beforeAvatarUpload(file) {
			const isSize = new Promise((resolve, reject) => {
				const isJPG =
					file.type === 'image/jpg' ||
					file.type === 'image/png' ||
					file.type === 'image/bmp'
				const isLt2M = file.size / 1024 / 1024 < 2
				if (!isJPG) {
					this.$message.warning('媒体图片只支持JPG、BMP、PNG格式!')
				}
				if (!isLt2M) {
					this.$message.warning('文件大小不能超过2M!')
				}
				let valid = isJPG && isLt2M
				valid ? resolve() : reject(valid)
			}).then(
				() => {
					return file
				},
				(err) => {
					return Promise.reject(err)
				}
			)
			return isSize
		},
		async uploadImageHttpRequest(params, type) {
			let formData = new FormData()
			formData.append('file', params.file)
			let {
				data: { resultData },
			} = await uploadFile(formData)
			if (!type) {
				this.formData1.businessLicenseCopy = resultData.url
			} else {
				this.formData2[type] = resultData.url
			}
		},
		validityPeriodChange(type) {
			if (type == 1) {
				this.formData1.type = 1
			} else if (type == 2) {
				this.formData2.certificateValidDateType = 1
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.radio-group {
	display: flex;
	flex-direction: column;
}
.radio-item {
	display: flex;
	align-items: center;
}
.wg_upload {
	cursor: pointer;
	width: 120px;
	height: 120px;
	background: #ddd;
	// margin: 5px;
	// margin-top: 15px;
	text-align: center;
	line-height: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	// padding-top: 35px;
	border: 1px solid #ccc;
	box-sizing: border-box;
	margin-right: 20px;
}
.image-box {
	width: 120px;
	height: 120px;
	position: relative;
	margin-right: 20px;
}
.wg_replace-image {
	width: 100%;
	height: 24px;
	position: absolute;
	background: #e7e7e7;
	bottom: 0;
	left: 0;
	z-index: 10;
	text-align: center;
	line-height: 24px;
	border: 0;
	border-top-width: 0px;
}
.tip {
	margin-bottom: 10px;
}
.image-container {
	display: flex;
}
.footer-box {
	height: 120px;
	display: flex;
	align-items: center;
	justify-content: center;
	.el-button {
		margin: 0 50px;
	}
}
.dialog-item {
	display: flex;
	align-items: center;
	margin: 10px 0;
	span {
		width: 100px;
	}
	.el-input {
		width: 100px;
	}
}
.upload_tip {
	width: 120px;
	height: 120px;
	padding-top: 30px;
	line-height: 30px;
}
.box-c {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.fw {
	font-weight: 900;
}
.item {
	margin-bottom: 30px;
}
</style>
<style>
.input-box-bind-account {
	width: 500px;
}
.cash-account-details-upload .el-upload-dragger {
	cursor: pointer;
	width: 120px;
	height: 120px;
	background: transparent;
	float: left;
	text-align: center;
	line-height: 20px;
	/* padding-top: 35px; */
	/* position: absolute;
	left: 0;
	top: 0; */
}
</style>

<template>
	<div class="container">
		<el-steps
			:active="activeStep"
			finish-status="success"
			simple
			style="margin-top: 20px"
		>
			<el-step title="提交资料"></el-step>
			<el-step title="待账户验证"></el-step>
			<el-step title="审核中"></el-step>
			<el-step title="签约完成"></el-step>
		</el-steps>
		<h3>企业基本信息</h3>
		<el-card shadow="never">
			<yx-form
				ref="yxForm1"
				:rules="formRules"
				:items="formItems1"
				:formDisabled="formDisabled1"
				:data="formData1"
				labelWidth="200px"
			>
				<template slot="organizationValidDate">
					<div>
						<el-radio-group v-model="formData1.type" class="radio-group">
							<el-radio :label="1" class="radio-item">
								<div class="radio-item">
									<el-date-picker
										v-model="formData1.organizationValidDate"
										type="daterange"
										range-separator="至"
										start-placeholder="开始日期"
										end-placeholder="结束日期"
										@change="validityPeriodChange(1)"
									>
									</el-date-picker>
								</div>
							</el-radio>

							<el-radio style="margin-top: 20px" :label="2"
								><el-date-picker
									v-model="formData1.organizationValidDateStart"
									type="date"
									placeholder="选择日期"
								>
								</el-date-picker>
								- 长期</el-radio
							>
						</el-radio-group>
						<div>
							注：证件有效期到期时间必须大于 60天，即到期时间距当前时间需超过 60
							天
						</div>
					</div>
				</template>
				<template slot="businessLicense">
					<div>
						<el-upload
							v-if="!formData1.businessLicense.length"
							class="wg_upload cash-account-details-upload"
							ref="uploadFile"
							:show-file-list="false"
							drag
							accept="image/bmp, image/jpeg, image/png"
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
								:src="getBigImg(formData1.businessLicense[0].imageUrl)"
								:preview-src-list="[
									getBigImg(formData1.businessLicense[0].imageUrl),
								]"
							></el-image>
							<el-upload
								v-if="submitShow"
								class="wg_replace-image"
								ref="uploadFile"
								:show-file-list="false"
								accept="image/gif, image/jpeg, image/png"
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
				:items="formItems2"
				:formDisabled="formDisabled2"
				labelWidth="200px"
			>
				<template slot="tip">
					<div class="tip">
						*
						请谨慎选择法人或联系人信息，管理员用于接收支付账户的重要管理信息及日常操作验证码。
					</div>
				</template>
				<template slot="certificateValidDate">
					<div>
						<el-radio-group
							v-model="formData2.certificateValidDateType"
							class="radio-group"
						>
							<el-radio :label="1" class="radio-item">
								<div class="radio-item">
									<el-date-picker
										v-model="formData2.certificateValidDate"
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
									v-model="formData2.certificateValidDateStart"
									type="date"
									placeholder="选择日期"
								>
								</el-date-picker>
								- 长期</el-radio
							>
						</el-radio-group>
					</div>
				</template>
				<template slot="legalPersonId">
					<div>
						<p>请按顺序分别上传人面像和国徽面电子版图片，图片必须清晰可见。</p>
						<p>注：请尽量避免使用有多余空白的照片</p>
						<div class="image-container">
							<el-upload
								v-if="!formData2.certificateFaceImg.certificateFaceImg.length"
								class="wg_upload cash-account-details-upload"
								ref="uploadFile"
								:http-request="
									(file) => {
										uploadImageHttpRequest(file, 'certificateFaceImg')
									}
								"
								:show-file-list="false"
								drag
								accept="image/bmp, image/jpeg, image/png"
								:multiple="false"
								:before-upload="beforeAvatarUpload"
							>
								<div class="upload_tip" slot="trigger">人面像</div>
							</el-upload>
							<div v-else class="image-box">
								<el-image
									class="image-box"
									:src="
										getBigImg(
											formData2.certificateFaceImg.certificateFaceImg[0]
												.imageUrl
										)
									"
									:preview-src-list="[
										getBigImg(
											formData2.certificateFaceImg.certificateFaceImg[0]
												.imageUrl
										),
									]"
								></el-image>
								<el-upload
									class="wg_replace-image"
									ref="uploadFile"
									v-if="submitShow"
									:http-request="
										(file) => {
											uploadImageHttpRequest(file, 'certificateFaceImg')
										}
									"
									:show-file-list="false"
									accept="image/bmp, image/jpeg, image/png"
									:multiple="false"
									:before-upload="beforeAvatarUpload"
								>
									<div slot="trigger">重新上传</div>
								</el-upload>
							</div>
							<el-upload
								v-if="!formData2.certificateFaceImg.certificateNationImg.length"
								class="wg_upload cash-account-details-upload"
								ref="uploadFile"
								drag
								:http-request="
									(file) => {
										uploadImageHttpRequest(file, 'certificateNationImg')
									}
								"
								:show-file-list="false"
								accept="image/bmp, image/jpeg, image/png"
								:multiple="false"
								:before-upload="beforeAvatarUpload"
							>
								<div class="upload_tip" slot="trigger">国徽面</div>
							</el-upload>
							<div v-else class="image-box">
								<el-image
									class="image-box"
									:src="
										getBigImg(
											formData2.certificateFaceImg.certificateNationImg[0]
												.imageUrl
										)
									"
									:preview-src-list="[
										getBigImg(
											formData2.certificateFaceImg.certificateNationImg[0]
												.imageUrl
										),
									]"
								></el-image>
								<el-upload
									class="wg_replace-image"
									ref="uploadFile"
									:http-request="
										(file) => {
											uploadImageHttpRequest(file, 'certificateNationImg')
										}
									"
									:show-file-list="false"
									accept="image/bmp, image/jpeg, image/png"
									:multiple="false"
									v-if="submitShow"
									:before-upload="beforeAvatarUpload"
								>
									<div slot="trigger">重新上传</div>
								</el-upload>
							</div>
						</div>
					</div>
				</template>
				<template slot="certificateValidDate2">
					<div>
						<el-radio-group
							v-model="formData2.certificateValidDateType2"
							class="radio-group"
						>
							<el-radio :label="1" class="radio-item">
								<div class="radio-item">
									<el-date-picker
										v-model="formData2.certificateValidDate2"
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
									v-model="formData2.certificateValidDateStart2"
									type="date"
									placeholder="选择日期"
								>
								</el-date-picker>
								- 长期</el-radio
							>
						</el-radio-group>
					</div>
				</template>
				<template slot="certificateFaceImgMediaId">
					<div>
						<p>请按顺序分别上传人面像和国徽面电子版图片，图片必须清晰可见。</p>
						<p>注：请尽量避免使用有多余空白的照片</p>
						<div class="image-container">
							<el-upload
								v-if="
									!formData2.certificateFaceImgMediaId.certificateFaceImgMediaId
										.length
								"
								class="wg_upload cash-account-details-upload"
								ref="uploadFile"
								:http-request="
									(file) => {
										uploadImageHttpRequest(file, 'certificateFaceImgMediaId')
									}
								"
								:show-file-list="false"
								drag
								accept="image/bmp, image/jpeg, image/png"
								:multiple="false"
								:before-upload="beforeAvatarUpload"
							>
								<div class="upload_tip" slot="trigger">人面像</div>
							</el-upload>
							<div v-else class="image-box">
								<el-image
									class="image-box"
									:src="
										getBigImg(
											formData2.certificateFaceImgMediaId
												.certificateFaceImgMediaId[0].imageUrl
										)
									"
									:preview-src-list="[
										getBigImg(
											formData2.certificateFaceImgMediaId
												.certificateFaceImgMediaId[0].imageUrl
										),
									]"
								></el-image>
								<el-upload
									class="wg_replace-image"
									ref="uploadFile"
									v-if="submitShow"
									:http-request="
										(file) => {
											uploadImageHttpRequest(file, 'certificateFaceImgMediaId')
										}
									"
									:show-file-list="false"
									accept="image/bmp, image/jpeg, image/png"
									:multiple="false"
									:before-upload="beforeAvatarUpload"
								>
									<div slot="trigger">重新上传</div>
								</el-upload>
							</div>
							<el-upload
								v-if="
									!formData2.certificateFaceImgMediaId.certificateNationImgTwo
										.length
								"
								class="wg_upload cash-account-details-upload"
								ref="uploadFile"
								drag
								:http-request="
									(file) => {
										uploadImageHttpRequest(file, 'certificateNationImgTwo')
									}
								"
								:show-file-list="false"
								accept="image/bmp, image/jpeg, image/png"
								:multiple="false"
								:before-upload="beforeAvatarUpload"
							>
								<div class="upload_tip" slot="trigger">国徽面</div>
							</el-upload>
							<div v-else class="image-box">
								<el-image
									class="image-box"
									:src="
										getBigImg(
											formData2.certificateFaceImgMediaId
												.certificateNationImgTwo[0].imageUrl
										)
									"
									:preview-src-list="[
										getBigImg(
											formData2.certificateFaceImgMediaId
												.certificateNationImgTwo[0].imageUrl
										),
									]"
								></el-image>
								<el-upload
									class="wg_replace-image"
									ref="uploadFile"
									:http-request="
										(file) => {
											uploadImageHttpRequest(file, 'certificateNationImgTwo')
										}
									"
									:show-file-list="false"
									accept="image/bmp, image/jpeg, image/png"
									:multiple="false"
									v-if="submitShow"
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
		<h3>股东信息</h3>
		<el-card shadow="never">
			<yx-form
				ref="yxForm4"
				:rules="formRules"
				:data="formData4"
				:items="formItems4"
				:formDisabled="formDisabled4"
				labelWidth="200px"
			>
				<template slot="certificateValidDate4">
					<div>
						<el-radio-group
							v-model="formData4.certificateValidDateType4"
							class="radio-group"
						>
							<el-radio :label="1" class="radio-item">
								<div class="radio-item">
									<el-date-picker
										v-model="formData4.certificateValidDate4"
										type="daterange"
										range-separator="至"
										start-placeholder="开始日期"
										end-placeholder="结束日期"
										@change="validityPeriodChange(3)"
									>
									</el-date-picker>
								</div>
							</el-radio>
							<el-radio style="margin-top: 20px" :label="2"
								><el-date-picker
									v-model="formData4.certificateValidDateStart4"
									type="date"
									placeholder="选择日期"
								>
								</el-date-picker>
								- 长期</el-radio
							>
						</el-radio-group>
					</div>
				</template>
			</yx-form>
		</el-card>
		<h3>受益人信息</h3>
		<el-card shadow="never">
			<yx-form
				ref="yxForm5"
				:rules="formRules"
				:data="formData5"
				:items="formItems5"
				:formDisabled="formDisabled5"
				labelWidth="200px"
			>
				<template slot="certificateValidDate5">
					<div>
						<el-radio-group
							v-model="formData5.certificateValidDateType5"
							class="radio-group"
						>
							<el-radio :label="1" class="radio-item">
								<div class="radio-item">
									<el-date-picker
										v-model="formData5.certificateValidDate5"
										type="daterange"
										range-separator="至"
										start-placeholder="开始日期"
										end-placeholder="结束日期"
										@change="validityPeriodChange(4)"
									>
									</el-date-picker>
								</div>
							</el-radio>
							<el-radio style="margin-top: 20px" :label="2"
								><el-date-picker
									v-model="formData5.certificateValidDateStart5"
									type="date"
									placeholder="选择日期"
								>
								</el-date-picker>
								- 长期</el-radio
							>
						</el-radio-group>
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
				:items="formItems3"
				:formDisabled="formDisabled3"
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
						<el-select
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
						</el-select>
					</div>
				</template>
			</yx-form>
		</el-card>

		<div class="footer-box" v-if="submitShow">
			<el-button @click="cancel">取消</el-button>
			<el-button @click="submit" type="primary">提交信息</el-button>
		</div>
		<el-dialog
			title="打款金额验证"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:show-close="false"
			:visible.sync="dialogVisible"
			width="30%"
			center
		>
			<p class="dialog-item">
				你提供的银行卡已收到一笔打款，请填入打款金额进行验证。
			</p>
			<div class="dialog-item">
				<span>打款金额</span>
				<el-input v-model="amount" placeholder="请输入">
					<template slot="append">元</template>
				</el-input>
			</div>
			<p
				class="dialog-item"
				v-if="
					infoData.accountBankInformation &&
					infoData.accountBankInformation.payVerifyDeadline
				"
			>
				截止验证时间：{{ infoData.accountBankInformation.payVerifyDeadline }}
			</p>
			<span slot="footer" class="dialog-footer" v-auth="'suningPayVerify'">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="_payVerify">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { uploadFile } from '@/api/image'
import {
	// openAccount,
	payVerify,
	// bindCard,
	openAccountToPublic,
	updateOpenAccount,
} from '@/api/accountService'
import { getBigImg } from '@/utils/imageTool'
import { checkFunctionCode } from '@/utils/auth.js'
import { bankAddressCode } from '@/api/weeget-bullet-payment-rest'
import moment from 'moment'
export default {
	components: {
		YxForm,
	},
	computed: {
		// showBtn() {
		// 	return (
		// 		(!this.params.openAccountSn && this.suningOpenAccount) ||
		// 		(this.infoData.accountBankInformation &&
		// 			(this.infoData.bindCardStatus == 0 ||
		// 				this.infoData.bindCardStatus == 6) &&
		// 			this.infoData.accountType == 1 &&
		// 			((this.suningOpenAccount && this.infoData.businessType == 1) ||
		// 				(this.suningBindCard && this.infoData.businessType == 2)))
		// 	)
		// },
		submitShow() {
			return (
				(this.params.skipType != 'supplier' &&
					this.params.skipType == 'platformCheck' &&
					(this.infoData.bindCardStatus == 0 ||
						this.infoData.bindCardStatus == 1 ||
						this.infoData.bindCardStatus == 6)) ||
				(this.params.skipType == 'platform' &&
					this.infoData.bindCardStatus == 7) ||
				this.params.openAccountSn == '1'
			)
		},
	},

	props: {
		infoData: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			suningOpenAccount: checkFunctionCode('suningOpenAccount'),
			suningBindCard: checkFunctionCode('suningBindCard'),
			activeStep: 1,
			amount: '',
			params: this.$route.params,
			formDisabled1: false,
			formDisabled2: false,
			formDisabled3: false,
			formDisabled4: false,
			formDisabled5: false,
			bankInfo: {
				provinceCode: '',
				cityCode: '',
				areaCode: '',
			},
			getBigImg: getBigImg,
			dialogVisible: false,
			// uploadImageList: uploadImageList,
			formData1: {
				companyName: '',
				companyAddress: '',
				socialCreditCode: '',
				type: 1,
				organizationValidDateStart: '',
				organizationValidDate: [],
				businessLicense: [],
				enterpriseTelephoneNumber: '',
			},
			formRules: {
				companyName: [
					{ required: true, message: '请输入企业名称', trigger: 'blur' },
				],
				companyAddress: [
					{ required: true, message: '请输入公司详细地址', trigger: 'blur' },
				],
				socialCreditCode: [
					{
						validator: (rule, value, callback) => {
							const pattern = /(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/
							if (value === '') {
								callback(new Error('请输入统一社会信用代码'))
							} else {
								if (!pattern.test(value)) {
									callback(new Error('统一社会信用代码错误'))
								} else {
									callback()
								}
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
				registeredCapital: [
					{
						validator: (rule, value, callback) => {
							if (value && value.length > 10) {
								callback(new Error('最高不超过10位数'))
							} else if (!value) {
								callback(new Error('请输入注册资本'))
							} else {
								callback()
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
				enterpriseTelephoneNumber: [
					{
						validator: (rule, value, callback) => {
							if (value && value.length > 20) {
								callback(new Error('最高不超过20位数'))
							} else if (!value) {
								callback(new Error('请输入企业联系电话'))
							} else {
								callback()
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
				organizationValidDate: [
					{
						validator: (rule, value, callback) => {
							if (this.formData1.type == 1) {
								if (!this.formData1.organizationValidDate.length) {
									callback(new Error('请选择时间'))
								} else if (
									moment(this.formData1.organizationValidDate[1]).valueOf() <
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
								if (!this.formData1.organizationValidDateStart) {
									callback(new Error('请选择开始时间'))
								} else {
									callback()
								}
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
				businessLicense: [
					{
						validator: (rule, value, callback) => {
							if (!this.formData1.businessLicense.length) {
								callback(new Error('请上传营业执照'))
							} else {
								callback()
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
				contactType: [{ required: true, message: '请选择', trigger: 'change' }],
				contactName: [
					{ required: true, message: '请输入法人姓名', trigger: 'blur' },
				],
				certificateType: [
					{ required: true, message: '请选择证件类型', trigger: 'change' },
				],
				certificateNo: [
					{
						validator: (rule, value, callback) => {
							if (value === '') {
								callback(new Error('请输入证件号'))
							} else {
								if (value.length > 18) {
									callback(new Error('最多允许输入18位数'))
								} else {
									callback()
								}
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
				contactPhone: [
					{
						validator: (rule, value, callback) => {
							const pattern = /^1[3456789][0-9]{9}$/
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
						required: true,
						trigger: 'blur',
					},
				],
				certificateValidDate: [
					{
						validator: (rule, value, callback) => {
							if (this.formData2.certificateValidDateType == 1) {
								if (!this.formData2.certificateValidDate.length) {
									callback(new Error('请选择时间'))
								} else if (
									moment(this.formData2.certificateValidDate[1]).valueOf() <
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
								if (!this.formData2.certificateValidDateStart) {
									callback(new Error('请选择开始时间'))
								} else {
									callback()
								}
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
				certificateValidDate2: [
					{
						validator: (rule, value, callback) => {
							if (this.formData2.certificateValidDateType2 == 1) {
								if (!this.formData2.certificateValidDate2.length) {
									callback(new Error('请选择时间'))
								} else if (
									moment(this.formData2.certificateValidDate2[1]).valueOf() <
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
								if (!this.formData2.certificateValidDateStart2) {
									callback(new Error('请选择开始时间'))
								} else {
									callback()
								}
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
				contactName2: [
					{ required: true, message: '请输入联系人姓名', trigger: 'blur' },
				],
				certificateType2: [
					{
						required: true,
						message: '请选择联系人证件类型',
						trigger: 'change',
					},
				],
				certificateNo2: [
					{
						validator: (rule, value, callback) => {
							if (value === '') {
								callback(new Error('请输入联系人证件号'))
							} else {
								if (value.length > 18) {
									callback(new Error('最多允许输入18位数'))
								} else {
									callback()
								}
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
				contactPhone2: [
					{
						validator: (rule, value, callback) => {
							const pattern = /^1[3456789][0-9]{9}$/
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
						required: true,
						trigger: 'blur',
					},
				],
				legalPersonId: [
					{
						validator: (rule, value, callback) => {
							if (
								!this.formData2.certificateFaceImg.certificateFaceImg.length &&
								!this.formData2.certificateFaceImg.certificateNationImg.length
							) {
								callback(new Error('请上传证件照'))
							} else if (
								!this.formData2.certificateFaceImg.certificateFaceImg.length
							) {
								callback(new Error('请上传人面面'))
							} else if (
								!this.formData2.certificateFaceImg.certificateNationImg.length
							) {
								callback(new Error('请上传国徽面'))
							} else {
								callback()
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
				certificateFaceImgMediaId: [
					{
						validator: (rule, value, callback) => {
							if (
								!this.formData2.certificateFaceImgMediaId
									.certificateFaceImgMediaId.length &&
								!this.formData2.certificateFaceImgMediaId
									.certificateNationImgTwo.length
							) {
								callback(new Error('请上传证件照'))
							} else if (
								!this.formData2.certificateFaceImgMediaId
									.certificateFaceImgMediaId.length
							) {
								callback(new Error('请上传人面面'))
							} else if (
								!this.formData2.certificateFaceImgMediaId
									.certificateNationImgTwo.length
							) {
								callback(new Error('请上传国徽面'))
							} else {
								callback()
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
				bankName: [
					{
						required: true,
						message: '请输入银行名称',
						trigger: 'blur',
					},
				],
				contactEmail: [
					{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
				],
				bankAccountName: [
					{ required: true, message: '请输入银行账户名称', trigger: 'blur' },
				],
				bankAccountNo: [
					{ required: true, message: '请输入银行账户号', trigger: 'blur' },
				],
				bankSubbranch: [
					{ required: true, message: '请输入开户支行', trigger: 'blur' },
				],
				bankLinkNum: [
					{ required: true, message: '请输入联行号', trigger: 'blur' },
				],
				area: [
					{
						validator: (rule, value, callback) => {
							if (!this.bankInfo.provinceCode && this.provinceList.length) {
								callback(new Error('请选择地区'))
							} else if (!this.bankInfo.cityCode && this.cityList.length) {
								callback(new Error('请选择地区'))
							} else if (!this.bankInfo.areaCode && this.areaList.length) {
								callback(new Error('请选择地区'))
							} else {
								callback()
							}
						},
						required: true,
						trigger: 'change',
					},
				],
				shareholderType: [
					{ required: true, message: '请选择股东类型', trigger: 'change' },
				],
				actualControllerName: [
					{
						required: true,
						message: '请输入实际控制人名称',
						trigger: 'change',
					},
				],
				certificateType4: [
					{
						required: true,
						message: '请选择实际控制人证件人类型',
						trigger: 'change',
					},
				],
				actualControllerNo4: [
					{
						required: true,
						message: '请输入实际控制人证件号',
						trigger: 'change',
					},
				],
				certificateValidDate4: [
					{
						validator: (rule, value, callback) => {
							if (this.formData4.certificateValidDateType4 == 1) {
								if (!this.formData4.certificateValidDate4.length) {
									callback(new Error('请选择时间'))
								} else if (
									moment(this.formData4.certificateValidDate4[1]).valueOf() <
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
								if (!this.formData4.certificateValidDateStart4) {
									callback(new Error('请选择开始时间'))
								} else {
									callback()
								}
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
				beneficialOwnerName: [
					{
						required: true,
						message: '请输入受益所有人名称',
						trigger: 'change',
					},
				],
				certificateType5: [
					{
						required: true,
						message: '请选择受益所有人证件类型',
						trigger: 'change',
					},
				],
				actualControllerNo5: [
					{
						required: true,
						message: '请输入受益所有人证件号',
						trigger: 'change',
					},
				],
				addressRevenueOwner: [
					{
						required: true,
						message: '请输入受益所有人地址',
						trigger: 'change',
					},
				],
				certificateValidDate5: [
					{
						validator: (rule, value, callback) => {
							if (this.formData5.certificateValidDateType5 == 1) {
								if (!this.formData5.certificateValidDate5.length) {
									callback(new Error('请选择时间'))
								} else if (
									moment(this.formData5.certificateValidDate5[1]).valueOf() <
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
								if (!this.formData5.certificateValidDateStart5) {
									callback(new Error('请选择开始时间'))
								} else {
									callback()
								}
							}
						},
						required: true,
						trigger: 'blur',
					},
				],
			},
			formItems1: [
				{
					title: '企业名称',
					type: 'input',
					dataIndex: 'companyName',
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
					dataIndex: 'socialCreditCode',
					class: 'input-box-bind-account',
				},
				{
					title: '注册资本',
					type: 'inputNumber',
					dataIndex: 'registeredCapital',
					class: 'input-box-bind-account',
				},
				{
					title: '企业联系电话',
					type: 'inputNumber',
					dataIndex: 'enterpriseTelephoneNumber',
					class: 'input-box-bind-account',
				},
				{
					type: 'custom',
					title: '组织机构有效期',
					dataIndex: 'organizationValidDate',
				},
				{
					type: 'custom',
					title: '营业执照',
					dataIndex: 'businessLicense',
				},
			],
			formData2: {
				contactType: 1,
				contactName: '',
				certificateType: 1,
				certificateNo: '',
				certificateValidDateType: 1,
				certificateValidDate: [],
				certificateValidDateStart: '',
				contactPhone: '',
				contactEmail: '',
				certificateFaceImg: {
					certificateFaceImg: [],
					certificateNationImg: [],
				},
				certificateFaceImgMediaId: {
					certificateFaceImgMediaId: [],
					certificateNationImgTwo: [],
				},
				contactName2: '',
				certificateType2: 1,
				certificateNo2: '',
				contactPhone2: '',
				certificateValidDateType2: 1,
				certificateValidDate2: [],
				certificateValidDateStart2: '',
			},
			formItems2: [
				{
					title: '法人和联系人是否为同一人',
					type: 'radio',
					dataIndex: 'contactType',
					label: 'value',
					class: 'input-box-bind-account',
					options: [
						{
							contactType: 1,
							value: '是',
						},
						{
							contactType: 2,
							value: '否',
						},
					],
					change: (contactType) => {
						this.setItems(contactType)
					},
				},
				{
					type: 'custom',
					unformItem: true,
					dataIndex: 'tip',
				},
				{
					title: '法人姓名',
					type: 'input',
					dataIndex: 'contactName',
					class: 'input-box-bind-account',
				},
				{
					title: '法人证件类型',
					type: 'select',
					dataIndex: 'certificateType',
					label: 'value',
					class: 'input-box-bind-account',
					options: [
						{
							certificateType: 1,
							value: '身份证',
						},
						{
							certificateType: 2,
							value: '其他国家或地区居民护照',
						},
						{
							certificateType: 3,
							value: '香港居民来往内地通行证',
						},
						{
							certificateType: 4,
							value: '澳门居民来往内地通行证',
						},
						{
							certificateType: 5,
							value: '台湾居民来往内地通行证',
						},
					],
				},
				{
					title: '法人证件号',
					type: 'input',
					dataIndex: 'certificateNo',
					class: 'input-box-bind-account',
				},
				{
					type: 'custom',
					title: '法人证件有效期',
					dataIndex: 'certificateValidDate',
				},
				{
					title: '法人手机号',
					type: 'inputNumber',
					dataIndex: 'contactPhone',
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
					dataIndex: 'legalPersonId',
				},
				{
					title: '联系人姓名',
					type: 'input',
					dataIndex: 'contactName2',
					class: 'input-box-bind-account',
					hide: true,
				},
				{
					title: '联系人证件类型',
					type: 'select',
					dataIndex: 'certificateType2',
					label: 'value',
					class: 'input-box-bind-account',
					hide: true,
					options: [
						{
							certificateType2: 1,
							value: '身份证',
						},
						{
							certificateType2: 2,
							value: '其他国家或地区居民护照',
						},
						{
							certificateType2: 3,
							value: '香港居民来往内地通行证',
						},
						{
							certificateType2: 4,
							value: '澳门居民来往内地通行证',
						},
						{
							certificateType2: 5,
							value: '台湾居民来往内地通行证',
						},
					],
				},
				{
					title: '联系人证件号',
					type: 'input',
					dataIndex: 'certificateNo2',
					hide: true,
					class: 'input-box-bind-account',
				},
				{
					type: 'custom',
					title: '联系人证件有效期',
					dataIndex: 'certificateValidDate2',
					hide: true,
				},
				{
					title: '联系人手机号',
					type: 'inputNumber',
					dataIndex: 'contactPhone2',
					hide: true,
					class: 'input-box-bind-account',
				},
				{
					type: 'custom',
					title: '联系人证件',
					hide: true,
					dataIndex: 'certificateFaceImgMediaId',
				},
			],
			formData3: {
				bankName: '',
				bankAccountName: '',
				bankAccountNo: '',
				bankSubbranch: '',
				bankLinkNum: '',
			},
			formItems3: [
				{
					title: '银行名称',
					type: 'input',
					dataIndex: 'bankName',
					class: 'input-box-bind-account',
				},
				{
					title: '银行账户名称',
					type: 'input',
					dataIndex: 'bankAccountName',
					class: 'input-box-bind-account',
				},
				{
					type: 'custom',
					dataIndex: 'tip',
				},
				{
					title: '银行账户号',
					type: 'input',
					dataIndex: 'bankAccountNo',
					class: 'input-box-bind-account',
				},
				{
					title: '开户支行',
					type: 'input',
					dataIndex: 'bankSubbranch',
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
					dataIndex: 'bankLinkNum',
					class: 'input-box-bind-account',
				},
			],
			formData4: {
				shareholderType: '1',
				actualControllerName: '',
				certificateType4: 1,
				actualControllerNo4: '',
				certificateValidDate4: [],
				certificateValidDateType4: 1,
				certificateValidDateStart4: '',
			},
			formItems4: [
				{
					title: '股东类型',
					type: 'radioMap',
					dataIndex: 'shareholderType',
					options: {
						企业: '1',
						个人: '2',
					},
					change: (e) => {
						this.shareholderChange(e)
					},
				},
				{
					title: '实际控制企业名称',
					type: 'input',
					dataIndex: 'actualControllerName',
					class: 'input-box-bind-account',
				},
				{
					title: '实际控制人证件类型',
					type: 'select',
					hide: true,
					dataIndex: 'certificateType4',
					label: 'value',
					class: 'input-box-bind-account',
					options: [
						{
							certificateType4: 1,
							value: '大陆居民身份证',
						},
						{
							certificateType4: 2,
							value: '其他国家或地区居民护照',
						},
						{
							certificateType4: 3,
							value: '香港居民来往内地通行证',
						},
						{
							certificateType4: 4,
							value: '澳门居民来往内地通行证',
						},
						{
							certificateType4: 5,
							value: '台湾居民来往内地通行证',
						},
						{
							certificateType4: 6,
							value: '其它',
						},
					],
				},
				{
					title: '实际控制企业统一社会信用代码',
					type: 'input',
					dataIndex: 'actualControllerNo4',
					class: 'input-box-bind-account',
				},
				{
					type: 'custom',
					title: '组织机构有效期',
					dataIndex: 'certificateValidDate4',
				},
			],
			formData5: {
				beneficialOwnerName: '',
				actualControllerNo5: '',
				certificateType5: 1,
				addressRevenueOwner: '',
				certificateValidDate5: [],
				certificateValidDateType5: 1,
				certificateValidDateStart5: '',
			},
			formItems5: [
				{
					title: '受益所有人名称',
					type: 'input',
					dataIndex: 'beneficialOwnerName',
					class: 'input-box-bind-account',
				},
				{
					title: '受益所有人证件类型',
					type: 'select',
					dataIndex: 'certificateType5',
					label: 'value',
					class: 'input-box-bind-account',
					options: [
						{
							certificateType5: 1,
							value: '大陆居民身份证',
						},
						{
							certificateType5: 2,
							value: '其他国家或地区居民护照',
						},
						{
							certificateType5: 3,
							value: '香港居民来往内地通行证',
						},
						{
							certificateType5: 4,
							value: '澳门居民来往内地通行证',
						},
						{
							certificateType5: 5,
							value: '台湾居民来往内地通行证',
						},
						{
							certificateType5: 6,
							value: '其它',
						},
					],
				},
				{
					title: '受益所有人证件号',
					type: 'input',
					dataIndex: 'actualControllerNo5',
					class: 'input-box-bind-account',
				},
				{
					title: '受益所有人地址',
					type: 'input',
					dataIndex: 'addressRevenueOwner',
					class: 'input-box-bind-account',
				},
				{
					type: 'custom',
					title: '证件有效期',
					dataIndex: 'certificateValidDate5',
				},
			],
			provinceList: [],
			cityList: [],
			areaList: [],
		}
	},
	watch: {
		infoData() {
			this.formItems1[2].disabled = this.infoData.bindCardStatus == 7
			this.formDisabled3 = this.infoData.bindCardStatus == 7
			if (
				(this.infoData.bindCardStatus != 0 &&
					this.infoData.bindCardStatus != 1 &&
					this.infoData.bindCardStatus != 6 &&
					this.params.skipType == 'platformCheck') ||
				(this.params.skipType == 'platform' &&
					this.infoData.bindCardStatus != 7)
			) {
				this.formDisabled1 = true
				this.formDisabled2 = true
				this.formDisabled3 = true
				this.formDisabled4 = true
				this.formDisabled5 = true
			}

			if (!this.params.openAccountSn) {
				return
			}
			// 企业基本信息 对公才有
			if (this.infoData.basicEnterpriseInformation) {
				this.formData1 = {
					companyName: this.infoData.basicEnterpriseInformation.companyName,
					registeredCapital: this.infoData.basicEnterpriseInformation
						.registeredCapital,
					enterpriseTelephoneNumber: this.infoData.basicEnterpriseInformation
						.registeredTel,
					companyAddress: this.infoData.basicEnterpriseInformation
						.companyAddress,
					socialCreditCode: this.infoData.basicEnterpriseInformation
						.socialCreditCode,
					type:
						this.infoData.basicEnterpriseInformation.organizationValidDateEnd ==
						'长期'
							? 2
							: 1,
					organizationValidDateStart:
						this.infoData.basicEnterpriseInformation.organizationValidDateEnd ==
						'长期'
							? this.infoData.basicEnterpriseInformation
									.organizationValidDateStart
							: '',
					organizationValidDate:
						this.infoData.basicEnterpriseInformation.organizationValidDateEnd ==
						'长期'
							? []
							: [
									this.infoData.basicEnterpriseInformation
										.organizationValidDateStart,
									this.infoData.basicEnterpriseInformation
										.organizationValidDateEnd,
							  ],
					businessLicense: [
						{
							imageUrl: this.infoData.basicEnterpriseInformation
								.businessLicenseUrl,
						},
					],
				}
			}
			// 法人基本信息 对公才有
			if (this.infoData.basicLegalInformation) {
				this.formData2 = Object.assign(this.formData2, {
					contactType: this.infoData.isSamePeople ? 1 : 2,
					contactName: this.infoData.basicLegalInformation.contactName,
					certificateType: this.infoData.basicLegalInformation.certificateType,
					certificateNo: this.infoData.basicLegalInformation.certificateNo,
					certificateValidDateType:
						this.infoData.basicLegalInformation.certificateValidDateEnd ==
						'长期'
							? 2
							: 1,
					certificateValidDateStart:
						this.infoData.basicLegalInformation.certificateValidDateEnd ==
						'长期'
							? this.infoData.basicLegalInformation.certificateValidDateStart
							: '',
					certificateValidDate:
						this.infoData.basicLegalInformation.certificateValidDateEnd ==
						'长期'
							? []
							: [
									this.infoData.basicLegalInformation.certificateValidDateStart,
									this.infoData.basicLegalInformation.certificateValidDateEnd,
							  ],
					contactPhone: this.infoData.basicLegalInformation.contactPhone,
					contactEmail: this.infoData.basicLegalInformation.contactEmail,
					certificateFaceImg: {
						certificateFaceImg: [
							{
								imageUrl: this.infoData.basicLegalInformation
									.certificateFaceImgUrl,
							},
						],
						certificateNationImg: [
							{
								imageUrl: this.infoData.basicLegalInformation
									.certificateNationImgUrl,
							},
						],
					},
				})
			}
			// 联系人基本信息 对私对公都有
			if (
				this.infoData.basicContactInformation &&
				!this.infoData.isSamePeople
			) {
				this.formData2 = Object.assign(this.formData2, {
					contactName2:
						(this.infoData.basicContactInformation &&
							this.infoData.basicContactInformation.contactName) ||
						'',
					certificateType2:
						(this.infoData.basicContactInformation &&
							this.infoData.basicContactInformation.certificateType) ||
						'',
					certificateNo2:
						(this.infoData.basicContactInformation &&
							this.infoData.basicContactInformation.certificateNo) ||
						'',
					contactPhone2:
						(this.infoData.basicContactInformation &&
							this.infoData.basicContactInformation.contactPhone) ||
						'',
					certificateValidDateType2:
						this.infoData.basicContactInformation.certificateValidDateEnd ==
						'长期'
							? 2
							: 1,
					certificateValidDateStart2:
						this.infoData.basicContactInformation.certificateValidDateEnd ==
						'长期'
							? this.infoData.basicContactInformation.certificateValidDateStart
							: '',
					certificateValidDate2:
						this.infoData.basicContactInformation.certificateValidDateEnd ==
						'长期'
							? []
							: [
									this.infoData.basicContactInformation
										.certificateValidDateStart,
									this.infoData.basicContactInformation.certificateValidDateEnd,
							  ],
					certificateFaceImgMediaId: {
						certificateFaceImgMediaId: [
							{
								imageUrl: this.infoData.basicContactInformation
									.certificateFaceImgUrl,
							},
						],
						certificateNationImgTwo: [
							{
								imageUrl: this.infoData.basicContactInformation
									.certificateNationImgUrl,
							},
						],
					},
				})
			}
			// 受益人信息 对公才有
			if (this.infoData.beneficiaryInformation) {
				this.formData5 = Object.assign(this.formData5, {
					beneficialOwnerName: this.infoData.beneficiaryInformation.contactName
						? this.infoData.beneficiaryInformation.contactName
						: '',
					actualControllerNo5: this.infoData.beneficiaryInformation
						.certificateNo
						? this.infoData.beneficiaryInformation.certificateNo
						: '',
					certificateType5: this.infoData.beneficiaryInformation.certificateType
						? this.infoData.beneficiaryInformation.certificateType
						: 1,
					addressRevenueOwner: this.infoData.beneficiaryInformation.workAddress
						? this.infoData.beneficiaryInformation.workAddress
						: '',
					certificateValidDate5:
						this.infoData.beneficiaryInformation.certificateValidDateEnd ==
						'长期'
							? []
							: [
									this.infoData.beneficiaryInformation
										.certificateValidDateStart,
									this.infoData.beneficiaryInformation.certificateValidDateEnd,
							  ],
					certificateValidDateType5:
						this.infoData.beneficiaryInformation.certificateValidDateEnd ==
						'长期'
							? 2
							: 1,
					certificateValidDateStart5:
						this.infoData.beneficiaryInformation.certificateValidDateEnd ==
						'长期'
							? this.infoData.beneficiaryInformation.certificateValidDateStart
							: '',
				})
			}
			// 股东类型 1:企业 2:个人
			if (this.infoData.shareholdersTyoe == 1) {
				if (this.infoData.shareholdersEnterpriseInformation) {
					this.formData4 = Object.assign(this.formData4, {
						shareholderType: '1',
						actualControllerName: this.infoData
							.shareholdersEnterpriseInformation.realCompanyName,
						certificateType4: 1,
						actualControllerNo4: this.infoData.shareholdersEnterpriseInformation
							.realSocialCreditCode,
						certificateValidDate4:
							this.infoData.shareholdersEnterpriseInformation
								.organizationValidDateEnd == '长期'
								? []
								: [
										this.infoData.shareholdersEnterpriseInformation
											.organizationValidDateStart,
										this.infoData.shareholdersEnterpriseInformation
											.organizationValidDateEnd,
								  ],
						certificateValidDateType4:
							this.infoData.shareholdersEnterpriseInformation
								.organizationValidDateEnd == '长期'
								? 2
								: 1,
						certificateValidDateStart4:
							this.infoData.shareholdersEnterpriseInformation
								.organizationValidDateEnd == '长期'
								? this.infoData.shareholdersEnterpriseInformation
										.organizationValidDateStart
								: '',
					})
				}
			} else {
				if (this.infoData.shareholdersPersonalInformation) {
					this.formData4 = Object.assign(this.formData4, {
						shareholderType: '2',
						actualControllerName: this.infoData.shareholdersPersonalInformation
							.realCompanyName,
						certificateType4: this.infoData.shareholdersPersonalInformation
							.certificateType,
						actualControllerNo4: this.infoData.shareholdersPersonalInformation
							.certificateNo,
						certificateValidDate4:
							this.infoData.shareholdersPersonalInformation
								.certificateValidDateEnd == '长期'
								? []
								: [
										this.infoData.shareholdersPersonalInformation
											.certificateValidDateStart,
										this.infoData.shareholdersPersonalInformation
											.certificateValidDateEnd,
								  ],
						certificateValidDateType4:
							this.infoData.shareholdersPersonalInformation
								.certificateValidDateEnd == '长期'
								? 2
								: 1,
						certificateValidDateStart4:
							this.infoData.shareholdersPersonalInformation
								.certificateValidDateEnd == '长期'
								? this.infoData.shareholdersPersonalInformation
										.certificateValidDateStart
								: '',
					})
				}
			}
			this.setItems(this.formData2.contactType)
			// 开户银行信息 对私对公都有
			if (this.infoData.accountBankInformation) {
				if (this.params.accountBankInfoId) {
					this.formData3 = {
						bankName: this.infoData.accountBankInformation.bankName,
						bankAccountName: this.infoData.accountBankInformation
							.bankAccountName,
						bankAccountNo: this.infoData.accountBankInformation.bankAccountNo,
						bankSubbranch: this.infoData.accountBankInformation.bankSubbranch,
						bankLinkNum: this.infoData.accountBankInformation.bankLinkNum,
					}
					let municipalityList = [
						'110000',
						'120000',
						'310000',
						'500000',
						'810000',
						'820000',
					]
					let provinceCode = `${this.infoData.accountBankInformation.bankCityCode.slice(
						0,
						2
					)}0000`
					let cityCode =
						municipalityList.indexOf(provinceCode) != -1
							? this.infoData.accountBankInformation.bankCityCode
							: `${this.infoData.accountBankInformation.bankCityCode.slice(
									0,
									4
							  )}00`
					let bankInfo = {
						provinceCode,
						cityCode,
						areaCode: this.infoData.accountBankInformation.bankCityCode,
					}
					this._bankCodes(bankInfo.provinceCode, (resultCode, resultData) => {
						if (resultCode == 0) {
							this.cityList = resultData.bankAddressCodeBOS
						}
					})
					this._bankCodes(bankInfo.cityCode, (resultCode, resultData) => {
						if (resultCode == 0) {
							this.areaList = resultData.bankAddressCodeBOS
						}
					})
					this.bankInfo = bankInfo
				}
				if (
					this.infoData.bindCardStatus &&
					this.infoData.bindCardStatus == 3 &&
					this.params.accountBankInfoId
				) {
					this.dialogVisible = true
				}
				// if (this.params.skipType == 'supplier') {
				// 	this.formDisabled1 = true
				// 	this.formDisabled2 = true
				// 	this.formDisabled3 = this.params.accountBankInfoId ? true : false
				// }

				if (this.infoData.bindCardStatus && this.params.accountBankInfoId) {
					switch (this.infoData.bindCardStatus) {
						case 0:
						case 1:
						case 2:
						case 6:
						case 8:
							this.activeStep = 1
							break
						case 3:
							this.activeStep = 2
							break
						case 4:
						case 5:
							this.activeStep = 3
							break
						default:
							this.activeStep = 4
							break
					}
				}
			}

			if (
				this.infoData.accountBankInformation &&
				this.infoData.bindCardStatus &&
				this.infoData.bindCardStatus == 6 &&
				this.infoData.toPublicBankAccount &&
				this.params.accountBankInfoId
			) {
				const h = this.$createElement
				this.$msgbox({
					title: '验证不通过',
					message: h('p', null, [
						h('span', null, '验证不通过，原因是 '),
						h(
							'span',
							{ style: 'color: red' },
							this.infoData.accountBankInformation.rejectReason
						),
					]),
					showCancelButton: false,
					showClose: false,
					closeOnClickModal: false,
					closeOnPressEscape: false,
					confirmButtonText: '确定',
				}).then(() => {
					if (!this.params.supplierId) {
						this.formDisabled1 = false
						this.formDisabled2 = false
						this.formDisabled3 = false
						this.formDisabled4 = false
						this.formDisabled5 = false
					}
				})
			}
			if (this.params.skipType == 'supplier') {
				this.formDisabled1 = true
				this.formDisabled2 = true
				this.formDisabled3 = true
				this.formDisabled4 = true
				this.formDisabled5 = true
			}
			if (
				this.params.openAccountSn == '1' ||
				this.params.openAccountSn == '2'
			) {
				if (!this.infoData.isFirstOpenAccount) {
					this.formDisabled3 = true
				} else {
					this.formData3 = {
						bankName: '',
						bankAccountName: '',
						bankAccountNo: '',
						bankSubbranch: '',
						bankLinkNum: '',
					}
				}
			}
			this.shareholderChange(this.infoData.shareholdersTyoe)
		},
	},
	created() {
		this._bankCodes('', (resultCode, resultData) => {
			if (resultCode == 0) {
				this.provinceList = resultData.bankAddressCodeBOS
			}
		})
	},
	methods: {
		async _payVerify() {
			if (!this.amount || this.amount <= 0) {
				return this.$message.warning('请输入正确金额')
			}
			if (this.amount >= 10) {
				return this.$message.warning('金额不能大于等于10')
			}
			let {
				data: { resultCode },
			} = await payVerify({
				amount: this.amount,
				openAccountSn: this.params.openAccountSn,
				outRequestNo: this.infoData.accountBankInformation.outRequestNo,
				operator: this.$store.state.user.userInfo.clerkName || '',
				operatorUserId: this.$store.state.user.userInfo.userId,
			})
			if (resultCode == 0) {
				this.cancel()
			}
		},
		getAreaList(code, key) {
			if (key == 'cityList') {
				this.bankInfo.cityCode = ''
				this.bankInfo.areaCode = ''
				this.areaList = []
			} else {
				this.bankInfo.areaCode = ''
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
		submit() {
			// if (
			// 	this.$route.params.openAccountSn &&
			// 	(!this.params.accountBankInfoId ||
			// 		(this.params.accountBankInfoId &&
			// 			this.infoData.accountBankInformation.businessType == 2))
			// ) {
			// 	this.$refs.yxForm3.$refs.YxForm.validate(async (valid3) => {
			// 		if (valid3) {
			// 			let paramJson = {
			// 				userName: this.$store.state.user.userInfo.clerkName,
			// 				bankName: this.formData3.bankName,
			// 				bankAccountName: this.formData3.bankAccountName,
			// 				bankAccountNo: this.formData3.bankAccountNo,
			// 				businessType: 2,
			// 				bankSubbranch: this.formData3.bankSubbranch,
			// 				bankLinkNum: this.formData3.bankLinkNum,
			// 				toPublicBankAccount: true,
			// 				openAccountSn: this.$route.params.openAccountSn,
			// 				// outRequestNo: this.infoData.accountBankInformation.outRequestNo,
			// 				bankCityCode:
			// 					this.bankInfo.areaCode ||
			// 					this.bankInfo.cityCode ||
			// 					this.bankInfo.provinceCode,
			// 			}
			// 			if (
			// 				this.params.accountBankInfoId &&
			// 				this.infoData.accountBankInformation.businessType == 2
			// 			) {
			// 				paramJson.outRequestNo = this.infoData.accountBankInformation.outRequestNo
			// 			}
			// 			let {
			// 				data: { resultCode },
			// 			} = await bindCard(paramJson)
			// 			if (resultCode == 0) {
			// 				this.$store
			// 					.dispatch('tagsView/delVisitedView', this.$route)
			// 					.then(() => {
			// 						this.$router.push({
			// 							path: '/fund/cashAccountList',
			// 						})
			// 					})
			// 			}
			// 		}
			// 	})
			// } else {
			this.$refs.yxForm1.$refs.YxForm.validate((valid1) => {
				this.$refs.yxForm2.$refs.YxForm.validate((valid2) => {
					this.$refs.yxForm3.$refs.YxForm.validate(async (valid3) => {
						this.$refs.yxForm4.$refs.YxForm.validate(async (valid4) => {
							this.$refs.yxForm5.$refs.YxForm.validate(async (valid5) => {
								let verify = valid1 && valid2 && valid3 && valid4 && valid5
								if (!verify) {
									return this.$message.error('请检查信息未填写完整!')
								}
								if (verify) {
									let organizationValidDateStart =
										this.formData1.type == 1
											? moment(this.formData1.organizationValidDate[0]).format(
													'YYYY-MM-DD'
											  )
											: moment(
													this.formData1.organizationValidDateStart
											  ).format('YYYY-MM-DD')
									let organizationValidDateEnd =
										this.formData1.type == 1
											? moment(this.formData1.organizationValidDate[1]).format(
													'YYYY-MM-DD'
											  )
											: '长期'
									let paramJson = {
										companyName: this.formData1.companyName,
										accountType: 1,
										userName: this.$store.state.user.userInfo.clerkName,
										baseInfo: {
											businessLicenseUrl: this.formData1.businessLicense[0]
												.imageUrl,
											companyAddress: this.formData1.companyAddress,
											organizationValidDateStart,
											organizationValidDateEnd,
											registeredCapital: this.formData1.registeredCapital,
											socialCreditCode: this.formData1.socialCreditCode,
											registeredTel: this.formData1.enterpriseTelephoneNumber,
											companyName: this.formData1.companyName,
										},
										contacts: [
											{
												certificateFaceImgUrl: this.formData2.certificateFaceImg
													.certificateFaceImg[0].imageUrl,
												certificateNationImgUrl: this.formData2
													.certificateFaceImg.certificateNationImg[0].imageUrl,
												certificateNo: this.formData2.certificateNo,
												certificateType: this.formData2.certificateType,
												certificateValidDateStart:
													this.formData2.certificateValidDateType == 1
														? moment(
																this.formData2.certificateValidDate[0]
														  ).format('YYYY-MM-DD')
														: moment(
																this.formData2.certificateValidDateStart
														  ).format('YYYY-MM-DD'),
												certificateValidDateEnd:
													this.formData2.certificateValidDateType == 1
														? moment(
																this.formData2.certificateValidDate[1]
														  ).format('YYYY-MM-DD')
														: '长期',
												contactEmail: this.formData2.contactEmail,
												contactName: this.formData2.contactName,
												contactPhone: this.formData2.contactPhone,
												contactType: 1,
											},
										],
										bankInfo: {
											bankName: this.formData3.bankName,
											bankAccountName: this.formData3.bankAccountName,
											// suningOpenAccountBankInfoId:
											bankAccountNo: this.formData3.bankAccountNo,
											businessType: 1,
											bankSubbranch: this.formData3.bankSubbranch,
											bankLinkNum: this.formData3.bankLinkNum,
											toPublicBankAccount: true,
											bankCityCode:
												this.bankInfo.areaCode ||
												this.bankInfo.cityCode ||
												this.bankInfo.provinceCode,
										},
									}
									if (
										this.infoData.bindCardStatus == 7 ||
										this.infoData.bindCardStatus == 0 ||
										this.infoData.bindCardStatus == 1 ||
										this.infoData.bindCardStatus == 6
									) {
										paramJson.bankInfo.suningOpenAccountBankInfoId = this.infoData.accountBankInformation.suningOpenAccountBankInfoId
									}
									// if (this.formData2.certificateType != 1) {
									// 	delete paramJson.contacts[0].certificateValidDateStart
									// }
									if (this.formData2.contactType == 2) {
										paramJson.contacts.push({
											contactName: this.formData2.contactName2,
											contactPhone: this.formData2.contactPhone2,
											certificateFaceImgUrl: this.formData2
												.certificateFaceImgMediaId.certificateFaceImgMediaId[0]
												.imageUrl,
											certificateNationImgUrl: this.formData2
												.certificateFaceImgMediaId.certificateNationImgTwo[0]
												.imageUrl,
											contactType: 2,
											certificateType: this.formData2.certificateType2,
											certificateNo: this.formData2.certificateNo2,
											certificateValidDateStart:
												this.formData2.certificateValidDateType2 == 1
													? moment(
															this.formData2.certificateValidDate2[0]
													  ).format('YYYY-MM-DD')
													: moment(
															this.formData2.certificateValidDateStart2
													  ).format('YYYY-MM-DD'),
											certificateValidDateEnd:
												this.formData2.certificateValidDateType2 == 1
													? moment(
															this.formData2.certificateValidDate2[1]
													  ).format('YYYY-MM-DD')
													: '长期',
										})
										// if (this.formData2.certificateType2 != 1) {
										// 	delete paramJson.contacts[1].certificateValidDateStart
										// }
									}
									console.log('88888888888888', this.formData4.shareholderType)
									//股东信息
									if (this.formData4.shareholderType == 1) {
										//股东类型：企业
										paramJson.baseInfo.realCompanyName = this.formData4.actualControllerName //实际控制企业名称
										paramJson.baseInfo.realSocialCreditCode = this.formData4.actualControllerNo4 //实际控制企业统一社会信用代码
										//组织机构有效期
										paramJson.baseInfo.realOrganizationValidDateStart =
											this.formData4.certificateValidDateType4 == 1
												? moment(
														this.formData4.certificateValidDate4[0]
												  ).format('YYYY-MM-DD')
												: moment(
														this.formData4.certificateValidDateStart4
												  ).format('YYYY-MM-DD')
										paramJson.baseInfo.realOrganizationValidDateEnd =
											this.formData4.certificateValidDateType4 == 1
												? moment(
														this.formData4.certificateValidDate4[1]
												  ).format('YYYY-MM-DD')
												: '长期'
									} else {
										//股东类型：个人
										paramJson.contacts.push({
											contactName: this.formData4.actualControllerName,
											contactPhone: this.formData4.contactPhone4,
											contactType: 4,
											certificateType: this.formData4.certificateType4,
											certificateNo: this.formData4.actualControllerNo4,
											certificateValidDateStart:
												this.formData4.certificateValidDateType4 == 1
													? moment(
															this.formData4.certificateValidDate4[0]
													  ).format('YYYY-MM-DD')
													: moment(
															this.formData4.certificateValidDateStart4
													  ).format('YYYY-MM-DD'),
											certificateValidDateEnd:
												this.formData4.certificateValidDateType4 == 1
													? moment(
															this.formData4.certificateValidDate4[1]
													  ).format('YYYY-MM-DD')
													: '长期',
										})
									}
									//受益人信息
									paramJson.contacts.push({
										contactName: this.formData5.beneficialOwnerName,
										contactType: 5,
										certificateType: this.formData5.certificateType5,
										certificateNo: this.formData5.actualControllerNo5,
										workAddress: this.formData5.addressRevenueOwner,
										certificateValidDateStart:
											this.formData5.certificateValidDateType5 == 1
												? moment(
														this.formData5.certificateValidDate5[0]
												  ).format('YYYY-MM-DD')
												: moment(
														this.formData5.certificateValidDateStart5
												  ).format('YYYY-MM-DD'),
										certificateValidDateEnd:
											this.formData5.certificateValidDateType5 == 1
												? moment(
														this.formData5.certificateValidDate5[1]
												  ).format('YYYY-MM-DD')
												: '长期',
									})
									if (this.infoData.openAccountSn) {
										paramJson.openAccountSn = this.infoData.openAccountSn
										paramJson.bankInfo.outRequestNo =
											this.infoData.accountBankInformation &&
											this.infoData.accountBankInformation.outRequestNo
										paramJson.bankInfo.openAccountSn = this.infoData.openAccountSn
									}
									paramJson.clerkId = this.$store.state.user.userInfo.clerkId
									paramJson.bankInfo.supplierId = 0
									paramJson.supplierId = 0
									let Url =
										this.infoData.bindCardStatus == 7 ||
										this.infoData.modifyOpenAccount
											? updateOpenAccount
											: openAccountToPublic
									let {
										data: { resultCode },
									} = await Url(paramJson)
									if (resultCode == 0) {
										this.$message.success('成功')
										setTimeout(() => {
											this.$store
												.dispatch('tagsView/delVisitedView', this.$route)
												.then(() => {
													this.$router.push({
														path: '/fund/cashAccountList',
													})
												})
										}, 2000)
									} else {
										setTimeout(() => {
											this.$store
												.dispatch('tagsView/delVisitedView', this.$route)
												.then(() => {
													this.$router.push({
														path: '/fund/cashAccountList',
													})
												})
										}, 2000)
									}
								}
							})
						})
					})
				})
			})
			// }
		},
		cancel() {
			this.$store.dispatch('tagsView/delVisitedView', this.$route).then(() => {
				this.$router.push({
					path: '/fund/cashAccountList',
				})
			})
		},
		setItems(type) {
			console.log('type---------', type)
			const dataIndexList = [
				'contactName2',
				'certificateType2',
				'certificateNo2',
				'contactPhone2',
				'certificateValidDate2',
				'certificateFaceImgMediaId',
			]
			this.formItems2.forEach((item) => {
				if (dataIndexList.indexOf(item.dataIndex) != -1) {
					item.hide = type == 1
				}
			})
		},
		async beforeAvatarUpload(file) {
			const isSize = new Promise((resolve, reject) => {
				let strFilter = ['.jpg', '.png', '.bmp']
				let strPostfix = file.name.substr(file.name.lastIndexOf('.'))
				const isJPG = strFilter.indexOf(strPostfix) != -1
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
			const {
				data: { resultCode, resultData },
			} = await uploadFile(formData)
			if (resultCode == 0) {
				if (!type) {
					this.formData1.businessLicense = [
						{
							imageUrl: resultData.url,
						},
					]
				} else {
					if (type == 'certificateFaceImg') {
						this.formData2.certificateFaceImg[type] = [
							{
								imageUrl: resultData.url,
							},
						]
					}
					if (type == 'certificateNationImg') {
						this.formData2.certificateFaceImg.certificateNationImg = [
							{
								imageUrl: resultData.url,
							},
						]
					} else {
						this.formData2.certificateFaceImgMediaId[type] = [
							{
								imageUrl: resultData.url,
							},
						]
					}
				}
			}
		},
		validityPeriodChange(type) {
			if (type == 1) {
				this.formData1.type = 1
			} else if (type == 2) {
				this.formData2.certificateValidDateType = 1
			} else if (type == 3) {
				this.formData4.certificateValidDateType4 = 1
			} else if (type == 4) {
				this.formData5.certificateValidDateType5 = 1
			}
		},
		shareholderChange(e) {
			this.formItems4.forEach((item) => {
				if (e == 2) {
					if (item.dataIndex == 'actualControllerName') {
						item.title = '实际控制人名称'
					}
					if (item.dataIndex == 'certificateType4') {
						item.hide = false
					}
					if (item.dataIndex == 'actualControllerNo4') {
						item.title = '实际控制人证件号'
					}
					if (item.dataIndex == 'certificateValidDate4') {
						item.title = '证件有效期'
					}
				} else {
					if (item.dataIndex == 'actualControllerName') {
						item.title = '实际控制企业名称'
					}
					if (item.dataIndex == 'certificateType4') {
						item.hide = true
					}
					if (item.dataIndex == 'actualControllerNo4') {
						item.title = '实际控制企业统一社会信用代码'
					}
					if (item.dataIndex == 'certificateValidDate4') {
						item.title = '组织机构有效期'
					}
				}
			})
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
		width: 100%;
	}
}
.upload_tip {
	width: 120px;
	height: 120px;
	padding-top: 30px;
	line-height: 30px;
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

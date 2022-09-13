<template>
	<div v-loading="showLoading" class="signing-information">
		<h1>提交认证资料</h1>
		<div class="information-content">
			<el-tabs class="left-tabs" tab-position="left">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>一、企业资质</span>
					</div>
					<h4 class="msg-title">供应商基本信息</h4>
					<div
						v-if="accountMsg && accountMsg.merchantSftAccount"
						class="information-total-msg"
					>
						<div class="msg-list">
							<div class="msg-item">
								<div class="msg-label">企业名称：</div>
								<div class="msg-detail">
									{{ accountMsg.merchantSftAccount.merchantName || '-' }}
								</div>
							</div>
							<div class="msg-item">
								<div class="msg-label">公司详细地址：</div>
								<div class="msg-detail">
									{{ accountMsg.merchantSftAccount.companyAddress || '-' }}
								</div>
							</div>
						</div>
						<div class="msg-list">
							<div class="msg-item">
								<div class="msg-label">统一社会信用代码：</div>
								<div class="msg-detail">
									{{
										accountMsg.merchantSftAccount.businessLicenseNumber || '-'
									}}
								</div>
							</div>
							<div class="msg-item">
								<div class="msg-label">组织机构有效期：</div>
								<div class="msg-detail">
									{{ accountMsg.merchantSftAccount.businessTime || '-' }}
								</div>
							</div>
						</div>
						<div class="msg-list">
							<div class="msg-item">
								<div class="msg-label">营业执照：</div>
								<div class="msg-detail">
									<el-image
										:key="i"
										class="detail-image"
										:src="
											getBigImg(
												accountMsg.merchantSftAccount.businessLicenseCopy
											)
										"
										fit="contain"
										:preview-src-list="[
											getBigImg(
												accountMsg.merchantSftAccount.businessLicenseCopy
											),
										]"
									></el-image>
								</div>
							</div>
						</div>
					</div>

					<h4 class="msg-title">
						管理员信息（管理员需要微信实名扫码认证，请谨慎填写）
					</h4>
					<div class="information-total-msg">
						<div class="msg-list">
							<div class="msg-item msg-item-after">
								<div class="msg-label">法人和联系人是否为同一人：</div>
								<div class="msg-detail">
									{{
										accountMsg.merchantSftAccount.isLegalPersonEqContact
											? '是'
											: '否'
									}}
								</div>
							</div>
						</div>
						<div class="msg-list">
							<div class="msg-item">
								<div class="msg-label">法人姓名：</div>
								<div class="msg-detail">
									{{ accountMsg.merchantSftAccount.legalPerson || '-' }}
								</div>
							</div>
							<div class="msg-item">
								<div class="msg-label">法人证件类型：</div>
								<div class="msg-detail">
									{{
										certificate[accountMsg.merchantSftAccount.idDocType] || '-'
									}}
								</div>
							</div>
						</div>
						<div class="msg-list">
							<div class="msg-item">
								<div class="msg-label">法人证件号：</div>
								<div class="msg-detail">
									{{ accountMsg.merchantSftAccount.idCardNumber || '-' }}
								</div>
							</div>
							<div class="msg-item">
								<div class="msg-label">法人证件有效期：</div>
								<div class="msg-detail">
									{{
										accountMsg.merchantSftAccount.idCardValidTime
											? moment(
													accountMsg.merchantSftAccount.idCardValidTime
											  ).format('YYYY-MM-DD')
											: '-'
									}}
								</div>
							</div>
						</div>
						<div class="msg-list">
							<div class="msg-item">
								<div class="msg-label">法人手机号：</div>
								<div class="msg-detail">
									{{
										accountMsg.merchantSftAccount
											.legalPersonMobilePhoneNumber || '-'
									}}
								</div>
							</div>
							<div class="msg-item">
								<div class="msg-label">法人邮箱：</div>
								<div class="msg-detail">
									{{ accountMsg.merchantSftAccount.contactEmail || '-' }}
								</div>
							</div>
						</div>
						<div class="msg-list">
							<div class="msg-item">
								<div class="msg-label">法人证件：</div>
								<div class="msg-detail">
									<div class="image-block">
										<span class="demonstration">身份证人像面</span>
										<el-image
											class="detail-image"
											:src="getBigImg(accountMsg.merchantSftAccount.idCardCopy)"
											fit="contain"
											:preview-src-list="[
												getBigImg(accountMsg.merchantSftAccount.idCardCopy),
											]"
										></el-image>
									</div>
									<div class="image-block">
										<span class="demonstration">身份证背面像</span>
										<el-image
											class="detail-image"
											:src="
												getBigImg(accountMsg.merchantSftAccount.idCardNational)
											"
											fit="contain"
											:preview-src-list="[
												getBigImg(accountMsg.merchantSftAccount.idCardNational),
											]"
										></el-image>
									</div>
								</div>
							</div>
						</div>
						<div v-if="!accountMsg.merchantSftAccount.isLegalPersonEqContact">
							<div class="msg-list">
								<div class="msg-item">
									<div class="msg-label">联系人姓名：</div>
									<div class="msg-detail">
										{{ accountMsg.merchantSftAccount.contactName || '-' }}
									</div>
								</div>
								<div class="msg-item">
									<div class="msg-label">联系人证件类型：</div>
									<div class="msg-detail">
										{{
											certificate[
												accountMsg.merchantSftAccount.contactIdDocType
											] || '-'
										}}
									</div>
								</div>
							</div>
							<div class="msg-list">
								<div class="msg-item">
									<div class="msg-label">联系人证件号：</div>
									<div class="msg-detail">
										{{
											accountMsg.merchantSftAccount.contactIdCardNumber || '-'
										}}
									</div>
								</div>
								<div class="msg-item">
									<div class="msg-label">联系人手机号：</div>
									<div class="msg-detail">
										{{
											accountMsg.merchantSftAccount.contactMobilePhone || '-'
										}}
									</div>
								</div>
							</div>
						</div>
					</div>
				</el-card>

				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>二、银行信息</span>
					</div>
					<h4 class="msg-title">开户银行信息</h4>
					<div
						v-if="accountMsg && accountMsg.merchantSftBankAccount"
						class="information-total-msg"
					>
						<div class="msg-list">
							<div class="msg-item">
								<div class="msg-label">银行名称：</div>
								<div class="msg-detail">
									{{ accountMsg.merchantSftBankAccount.accountBank || '-' }}
								</div>
							</div>
							<div class="msg-item">
								<div class="msg-label">银行账户名称：</div>
								<div class="msg-detail">
									{{ accountMsg.merchantSftBankAccount.accountName || '-' }}
								</div>
							</div>
						</div>
						<div class="msg-list">
							<div class="msg-item">
								<div class="msg-label">银行账户号：</div>
								<div class="msg-detail">
									{{ accountMsg.merchantSftBankAccount.accountNumber || '-' }}
								</div>
							</div>
							<div class="msg-item">
								<div class="msg-label">开户支行：</div>
								<div class="msg-detail">
									{{ accountMsg.merchantSftBankAccount.bankName || '-' }}
								</div>
							</div>
						</div>
						<div class="msg-list">
							<div class="msg-item">
								<div class="msg-label">银行所在城市：</div>
								<div v-if="areaMsg && areaMsg.fullName" class="msg-detail">
									{{ areaMsg.fullName || '-' }}
								</div>
							</div>
							<div class="msg-item">
								<div class="msg-label">银联号：</div>
								<div class="msg-detail">
									{{ accountMsg.merchantSftBankAccount.bankBranchId || '-' }}
								</div>
							</div>
						</div>
						<div class="msg-list">
							<div class="msg-item">
								<div class="msg-label">银行预留手机号：</div>
								<div class="msg-detail">
									{{
										accountMsg.merchantSftBankAccount.bankContactMobilePhone ||
										'-'
									}}
								</div>
							</div>
						</div>
					</div>
				</el-card>
			</el-tabs>
		</div>
	</div>
</template>

<script>
import { getBigImg } from '@/utils/imageTool'
import { getAccountBySupplierId, bankCodes } from '@/api/newFund'
import moment from 'moment'
export default {
	components: {},
	name: 'FormTable',

	data() {
		return {
			certificate: [
				'',
				'身份证',
				'护照',
				'中国香港居民-来往内地通行证',
				'中国澳门居民-来往内地通行证',
				'中国台湾居民-来往大陆通行证',
			],
			getBigImg,
			moment,
			accountMsg: {},
			areaMsg: {},
		}
	},

	created() {
		this.init()
	},

	methods: {
		// 平台账户列表
		async init() {
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await getAccountBySupplierId({
				supplierId: parseInt(this.$route.params.id),
			})
			this.showLoading = false
			if (resultCode == 0) {
				this.accountMsg = resultData
				this.openAddress(resultData.merchantSftBankAccount.bankAreaCode)
			} else {
				this.accountMsg = {}
			}
		},
		async openAddress(areaId) {
			this.areaLoading = true

			const {
				data: { resultData, resultCode },
			} = await bankCodes({
				code: areaId,
			})
			this.areaLoading = false
			if (resultCode === 0) {
				console.log(resultData)
				this.areaMsg = resultData[0] || {}
			}
		},
	},
}
</script>

<style scoped lang="scss">
.signing-information {
	h1 {
		font-size: 16px;
	}
	h3 {
		font-size: 14px;
	}
}
.information-content {
	.pdf-view {
		margin: 10px auto;
	}
	margin: 0 12px;
	.left-tabs {
		margin: 24px 0;
	}
	.box-card {
		margin: 10px;
	}
	.self-tabel {
		margin-bottom: 12px;
		line-height: 24px;
	}
	.information-total-msg .msg-list .msg-item .msg-detail {
		color: #333;
		font-size: 16px;
		flex: 1;
	}
}
.information-total-msg {
	.msg-list {
		display: flex;
		line-height: 48px;

		.msg-item {
			flex: 1;
			display: flex;
			&.msg-item-after {
				position: relative;
				&::after {
					top: 20px;
					left: 10px;
					position: absolute;
					content: '*请谨慎选择法人或联系人信息，管理员用于接收支付账户的重要管理信息及日常操作验证码';
					color: brown;
					font-size: 12px;
					word-break: break-all;
					white-space: nowrap;
				}
			}
			.msg-label {
				color: #666;
				position: relative;
				margin-left: 18px;
				font-size: 14px;
				word-break: break-all;
				white-space: nowrap;
				&::after {
					content: '*';
					position: absolute;
					color: brown;
					left: -10px;
					top: 5px;
					font-size: 16px;
				}
			}

			.image-block {
				padding-bottom: 10px;
				text-align: center;
				display: inline-block;
				width: 160px;
				box-sizing: border-box;
				vertical-align: top;
				.demonstration {
					display: block;
					color: #333;
					font-size: 14px;
				}
			}
			.detail-image {
				vertical-align: text-top;
				width: 140px;
				margin-right: 12px;
			}
		}
	}
}
</style>

<template>
	<basic-container>
		<Info :resultDataList="resultDataList" />
		<div
			class="mb30"
			v-for="(item, index) in afterSalesArbitrationRecordVOList"
			:key="index"
		>
			<div>
				<div class="mb10">
					<h3 class="di-c">{{ titleList[item.operatingItems] }}</h3>
					<div class="fl-r">
						{{
							item.updateTime
								? moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
								: '-'
						}}
					</div>
				</div>
				<el-card>
					<!-- 用户申请平台介入 -->
					<div v-if="item.operatingItems == 51">
						<div class="pd20">
							<span>是否收到货：</span>
							<span>{{ resultDataList.acceptGoodsStr }}</span>
						</div>
						<div class="pd20">
							<span>申请原因：</span>
							<span>{{ resultDataList.afterReason }}</span>
						</div>
						<div class="pd20">
							<span>问题描述：</span>
							<span>{{ item.remark }}</span>
						</div>
					</div>
					<!-- 商家提交凭证信息 -->
					<div v-if="item.operatingItems == 52">
						<div class="pd20">
							<span>凭证描述：</span>
							<span>{{ item.remark }}</span>
						</div>
						<div class="df pd20">
							<span>凭证图片：</span>
							<div>
								<template v-for="(image, index) in item.imageVOList">
									<el-image
										:key="index"
										class="wg_image_box"
										fit="cover"
										:src="getBigImg(image.imageUrl)"
										:preview-src-list="[getBigImg(image.imageUrl)]"
									>
										<div slot="error" class="image-slot">
											<i class="el-icon-picture-outline"></i>
										</div>
									</el-image>
								</template>
							</div>
						</div>
					</div>
					<!-- 平台转交至商家 -->
					<div v-if="item.operatingItems == 53">
						<div class="pd20">
							<span>转交备注：</span>
							<span>{{ item.remark }}</span>
						</div>
						<div class="pd20">
							<span>操作人：</span>
							<span>{{ item.operatorName }}</span>
						</div>
					</div>
					<!-- 平台仲裁失败(判定为用户责任) -->
					<div v-if="item.operatingItems == 57">
						<div class="pd20">
							<span>仲裁结果：</span>
							<span>{{ item.operatingItemsStr }}</span>
						</div>
						<div class="pd20">
							<span>平台仲裁描述：</span>
							<span>{{ item.remark }}</span>
						</div>
						<div class="df pd20">
							<span>凭证图片：</span>
							<div>
								<template v-for="(image, index) in item.imageVOList">
									<el-image
										:key="index"
										class="wg_image_box"
										fit="cover"
										:src="getBigImg(image.imageUrl)"
										:preview-src-list="[getBigImg(image.imageUrl)]"
									>
										<div slot="error" class="image-slot">
											<i class="el-icon-picture-outline"></i>
										</div>
									</el-image>
								</template>
							</div>
						</div>
						<div class="pd20">
							<span>操作人：</span>
							<span>{{ item.operatorName }}</span>
						</div>
					</div>
					<!-- 平台仲裁成功(判定为商家责任) -->
					<div v-if="item.operatingItems == 56">
						<div class="pd20">
							<span>仲裁结果：</span>
							<span>{{ item.operatingItemsStr }}</span>
						</div>
						<div class="pd20">
							<span>平台仲裁描述：</span>
							<span>{{ item.remark }}</span>
						</div>
						<div class="df pd20">
							<span>凭证图片：</span>
							<div>
								<template v-for="(image, index) in item.imageVOList">
									<el-image
										:key="index"
										class="wg_image_box"
										fit="cover"
										:src="getBigImg(image.imageUrl)"
										:preview-src-list="[getBigImg(image.imageUrl)]"
									>
										<div slot="error" class="image-slot">
											<i class="el-icon-picture-outline"></i>
										</div>
									</el-image>
								</template>
							</div>
						</div>
						<div class="pd20">
							<span>操作人：</span>
							<span>{{ item.operatorName }}</span>
						</div>
					</div>
					<!-- 超时自动判责 -->
					<div v-if="item.operatingItems == 60">
						<div class="pd20">
							<span>超时未提交凭证，已判定为商家责：</span>
						</div>
					</div>
					<!-- 用户（包含店主、客服）撤销售后单 -->
					<div v-if="item.operatingItems == 59">
						<div class="pd20">
							<span>用户撤销售后单，该售后单已关闭</span>
						</div>
						<div class="pd20">
							<span>操作人：</span>
							<span>{{ item.operatorName }}</span>
						</div>
					</div>
					<!-- 用户（店主）修改售后申请 -->
					<div v-if="item.operatingItems == 58">
						<div class="pd20">
							<span>用户重新修改申请，该售后单已关闭</span>
						</div>
						<div class="pd20">
							<span>操作人：</span>
							<span>{{ item.operatorName }}</span>
						</div>
					</div>
					<!-- 商家审核通过 -->
					<div v-if="item.operatingItems == 54">
						<div class="pd20">
							<span>审核备注：</span>
							<span>{{ item.remark }}</span>
						</div>
					</div>
					<!-- 商家验货通过 -->
					<div v-if="item.operatingItems == 55">
						<div class="pd20">
							<span>验货备注：</span>
							<span>{{ item.remark }}</span>
						</div>
					</div>
					<!-- (售后单操作事项,1，申请售后、2，审核通过、3，审核不通过、4，二次申请、5，同意退款,、6，不同意退款、7，填写物流单号、8，验收通过、9，确认退款、10，退款成功、11，退款失败、12，人工退款（人工退款指的是退款单的人工退款）、13，关闭售后单、14，修改售后单、15，修改物流信息,16、售后完成,17、验收不通过 18、用户撤销申请 19、超时关闭售后单 20、填写备注 21、异常处理中-处理成功 24、开启优先赔付 25、录入反退金额 26、关闭揽退单 27、结果确认中-处理成功 28 售后单超 30天自动关闭 29、超时自动审核通过 30、超时自动验货通过
31、超时未申请仲裁自动关闭；仲裁单操作事项：51.用户申请平台介入；52.商家提交凭证信息；53.平台转交至商家；54.商家审核通过; 55.商家验货通过;56.平台仲裁成功(判定为商家责任)；57.平台仲裁失败(判定为用户责任)； 58.用户修改售后申请关闭；59.用户撤销售后申请关闭；60.超时自动判责(判 -->
				</el-card>
			</div>
			<div
				class="save_button"
				v-if="
					resultDataList.arbitrationState == 1 ||
					resultDataList.arbitrationState == 2
				"
			>
				<el-button
					type="primary"
					v-if="afterSalesArbitrateSuccess"
					@click="successAndFailure('success')"
					>仲裁成功</el-button
				>
				<el-button
					type="primary"
					v-if="afterSalesArbitrateFail"
					@click="successAndFailure('failure')"
					>仲裁失败</el-button
				>

				<el-button
					v-if="
						resultDataList.arbitrationState == 2 &&
						resultDataList.afterType == 1 &&
						resultDataList.arbitrationType == 1 &&
						afterSalesArbitrateForwardToSupplier
					"
					type="primary"
					@click="processingDialog = true"
					>转交至商家处理</el-button
				>
			</div>
		</div>
		<!-- //仲裁弹窗 -->
		<Dialog
			:title="arbitrationTitle"
			:visible="arbitramentDialog"
			width="50%"
			:bottomBtn="arbitramentBottomBtn"
			@before-close="arbitramentDialog = false"
		>
			<h3>{{ arbitramentHint }}</h3>
			<yx-form
				style="margin-top: 60px"
				ref="form105"
				:inline="false"
				:rules="funRules"
				:items="arbitramentItem"
				:data="arbitramentData"
				labelWidth="100px"
			>
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
				<template
					slot="merchantAddress"
					v-if="
						resultDataList.afterType == 1 &&
						arbitramentTitle == 'success' &&
						resultDataList.arbitrationType == 1
					"
				>
					<div class="prefix-star" style="margin-left: -80px">
						同步商家端地址:
					</div>
					<div style="color: #999999">
						（当商家有多个售后地址时，可通过“转交至商家处理”让商家进行同步地址）
					</div>
					<div style="display: flex">
						<label>是否使用商家端的仓库地址: </label>
						<el-form-item style="margin-left: 20px">
							<el-radio-group v-model="arbitramentData.rate">
								<el-radio :label="1">是</el-radio>
								<el-radio :label="2">否</el-radio>
							</el-radio-group>
						</el-form-item>
					</div>
					<el-form-item label="寄回地址" v-if="arbitramentData.rate == 2">
						<el-input
							v-model="arbitramentData.returnStandard"
							type="textarea"
							placeholder="寄回地址（用户可见）"
							:autosize="{ minRows: 2, maxRows: 4 }"
						/>
					</el-form-item>
					<el-form-item v-if="arbitramentData.rate == 1">
						选择仓库地址:
						<el-select
							v-model="arbitramentData.selectAd"
							placeholder="请选择"
							@change="selectChange"
						>
							<el-option
								v-for="item in options"
								:key="item.afterSalesAddressId"
								:label="item.title"
								:value="item.afterSalesAddressId"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<div v-if="arbitramentData.rate == 1">
						<el-form-item label="仓库收件人：">
							<span>{{ arbitramentData.consignee }}</span>
						</el-form-item>
						<el-form-item label="手机号：">
							<span>{{ arbitramentData.phone }}</span>
						</el-form-item>
						<el-form-item label="电话：">
							<span>{{ arbitramentData.tel }}</span>
						</el-form-item>
						<el-form-item label="仓库地址：">
							<span>{{ arbitramentData.address }}</span>
						</el-form-item>
						<el-form-item label="寄回标准：">
							<span>{{ arbitramentData.standard }}</span>
						</el-form-item>
					</div>
				</template>
			</yx-form>
		</Dialog>
		<Dialog
			title="转交至商家处理"
			:visible="processingDialog"
			width="30%"
			:bottomBtn="processingBottomBtn"
			@before-close="processingDialog = false"
		>
			<h3>
				此操作用于商家有多个售后地址，客服无法同步给用户时，转交至商家，让商家进行同意退款并同步给用户使用
			</h3>
			<div style="display: flex">
				<label class="prefix-star" style="width: 100px">转交备注：</label>
				<el-input
					type="textarea"
					maxlength="200"
					v-model.trim="transferMerchantText"
					placeholder="请明确仲裁结果，并告知商家进行同意退款操作"
				></el-input>
			</div>
		</Dialog>
	</basic-container>
</template>

<script>
import Info from '../Info'
import Dialog from '@/components/Dialog'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import { uploadImageList } from '@/api/image'
import { getBigImg } from '@/utils/imageTool'
import { checkFunctionCode } from '@/utils/auth'
import {
	afterSalesArbitrationdetail,
	afterSalesAddressList,
	platformArbitrateFail,
	platformArbitrateSuccess,
	platformForwardToSupplier,
} from '@/api/afterSales'
import moment from 'moment'
export default {
	components: {
		BasicContainer,
		Dialog,
		YxForm,
		Info,
	},
	name: 'FormTable',

	data() {
		// 售后单操作事项,1，申请售后、2，审核通过、3，审核不通过、4，二次申请、5，同意退款,、6，不同意退款、7，填写物流单号、8，验收通过、9，确认退款、10，退款成功、11，退款失败、12，人工退款（人工退款指的是退款单的人工退款）、13，关闭售后单、14，修改售后单、15，修改物流信息,16、售后完成,17、验收不通过 18、用户撤销申请 19、超时关闭售后单 20、填写备注 21、异常处理中-处理成功 24、开启优先赔付 25、录入反退金额 26、关闭揽退单 27、结果确认中-处理成功 28 售后单超 30天自动关闭 29、超时自动审核通过 30、超时自动验货通过
		// 31、超时未申请仲裁自动关闭；仲裁单操作事项：51.用户提交凭证信息；52.商家提交凭证信息；53.平台转交至商家；54.商家审核通过; 55.商家验货通过;56.平台仲裁成功(判定为商家责任)；57.平台仲裁失败(判定为用户责任)； 58.用户修改售后申请关闭；59.用户撤销售后申请关闭；60.超时自动判责(判定为商家责任)； 61.客服关闭售后单)
		return {
			afterSalesArbitrateSuccess: checkFunctionCode(
				'afterSalesArbitrateSuccess'
			), // 仲裁成功
			afterSalesArbitrateFail: checkFunctionCode('afterSalesArbitrateFail'), // 仲裁失败
			afterSalesArbitrateForwardToSupplier: checkFunctionCode(
				'afterSalesArbitrateForwardToSupplier'
			), // 仲裁成功
			arbitramentTitle: '',
			titleList: {
				51: '用户提交凭证信息',
				52: '商家提交凭证信息',
				53: '平台转交至商家',
				54: '商家审核通过',
				55: '商家验货通过',
				56: '平台仲裁成功(判定为商家责任)',
				57: '平台仲裁失败(判定为用户责任)',
				58: '用户修改售后申请关闭',
				59: '用户撤销售后申请关闭',
				60: '超时自动判责(判定为商家责任)',
			},
			moment,
			getBigImg,
			resultDataList: {},
			afterSalesArbitrationRecordVOList: [],
			Id: '',
			imageDialog: false,
			arbitramentDialog: false,
			processingDialog: false,
			arbitrationTitle: '',
			transferMerchantText: '',
			options: [],
			arbitramentData: {
				ticketFinishRemark: '',
				activityImage: [],
				selectAd: '',
				address: '',
				phone: '',
				tel: '',
				standard: '',
				returnStandard: '',
				rate: 1,
			},
			processingBottomBtn: [
				{
					title: '取消',
					type: 'cancel',
					click: () => {
						this.processingDialog = false
					},
				},
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this._platformForwardToSupplier()
					},
				},
			],
			arbitramentBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.form105.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this._arbitrationMethod()
								// this.dialogVisible105 = false
							}
						})
					},
				},
				{
					title: '取消',
					type: 'cancel',
					click: () => {
						this.arbitramentData = {
							ticketFinishRemark: '',
							activityImage: [],
							selectAd: '',
							address: '',
							phone: '',
							tel: '',
							returnStandard: '',
							standard: '',
							rate: 1,
						}
						this.arbitramentDialog = false
					},
				},
			],
			arbitramentItem: [
				{
					title: '仲裁备注',
					type: 'textarea',
					dataIndex: 'ticketFinishRemark',
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
						limit: 5,
						imageName: 'imageUrl',
						accept: 'image/jpeg, image/jpg, image/png',
						beforeAvatarUpload: (file) => this.beforeAvatarUpload(file),
						httpRequest: (file) =>
							this._uploadImageHttpRequest(file, 'clickUploading'),
					},
				},
				{
					type: 'custom',
					dataIndex: 'merchantAddress',
				},
			],
			funRules: {
				ticketFinishRemark: [
					{ required: true, message: '请填写备注!', trigger: 'blur' },
				],
			},
		}
	},

	created() {
		this.Id = this.$route.params.Id || ''
	},

	mounted() {
		this._afterSalesArbitrationdetail()
	},

	methods: {
		//流转商家
		async _platformForwardToSupplier() {
			if (!this.transferMerchantText) {
				return this.$message({
					message: '请填写备注',
					type: 'error',
				})
			}
			const {
				data: { resultCode },
			} = await platformForwardToSupplier({
				id: this.Id,
				remark: this.transferMerchantText,
				operatorName: this.$store.state.user.userInfo.userName,
				operatorId: this.$store.state.user.userInfo.userId,
			})
			if (resultCode == 0) {
				this.$message({
					message: `流转成功!`,
					type: 'success',
				})
				this.processingDialog = false
				this._afterSalesArbitrationdetail()
			}
		},
		//仲裁失败/成功
		_arbitrationMethod: async function () {
			let paramJson = {
				remark: this.arbitramentData.ticketFinishRemark,
				id: this.Id,
				operatorName: this.$store.state.user.userInfo.userName,
				operatorId: this.$store.state.user.userInfo.userId,
				imageUrlList: [],
			}
			this.arbitramentData.activityImage.map((item) => {
				paramJson.imageUrlList.push(item.imageUrlTemp)
			})
			if (
				this.resultDataList.afterType == 1 &&
				this.arbitramentTitle == 'success' &&
				this.resultDataList.arbitrationType == 1
			) {
				if (this.arbitramentData.rate == 1) {
					paramJson.mailAddress = this.arbitramentData.address
					paramJson.returnStandard = this.arbitramentData.standard
					if (!paramJson.mailAddress) {
						return this.$message({
							message: '请选择地址',
							type: 'error',
						})
					}
				} else {
					paramJson.returnStandard = this.arbitramentData.returnStandard
					if (!paramJson.returnStandard) {
						return this.$message({
							message: '请填写寄回地址',
							type: 'error',
						})
					}
				}
			}
			let Url =
				this.arbitramentTitle == 'success'
					? platformArbitrateSuccess
					: platformArbitrateFail
			console.log('===========', paramJson, this.arbitramentData)
			let {
				data: { resultCode = 0 },
			} = await Url(paramJson)
			if (resultCode == 0) {
				this.resetForm()
				this.arbitramentDialog = false
				this.$message({
					message: '操作成功',
					type: 'success',
				})
				this._afterSalesArbitrationdetail()
			}
		},
		//获取详情数据
		_afterSalesArbitrationdetail: async function () {
			let {
				data: { resultCode = 0, resultData = [] },
			} = await afterSalesArbitrationdetail({ id: this.Id })

			if (resultCode == 0) {
				this.afterSalesArbitrationRecordVOList =
					resultData.afterSalesArbitrationRecordVOList
				this.resultDataList = resultData
			}
		},
		// 重置
		resetForm() {
			this.options = []
			this.arbitramentData = {
				ticketFinishRemark: '',
				activityImage: [],
				selectAd: '',
				address: '',
				phone: '',
				tel: '',
				standard: '',
				returnStandard: '',
				rate: 1,
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
			if (!params.file && !params.clipboardData.files[0]) {
				this.$message.error('粘贴板无图片内容，请复制需上传的图片!')
				return
			}
			const isLt2M = params.file
				? params.file.size / 1024 / 1024 < 5
				: params.clipboardData.files[0].size / 1024 / 1024 < 5 //限制上传
			if (!isLt2M) {
				this.$message.error('上传文件大于5M,请重新选择!')
				return
			}
			if (this.arbitramentData.activityImage.length >= 5) {
				this.$message.error('图片不能超过五张')
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
				this.arbitramentData.activityImage.push({
					imageUrl: getBigImg(res.data.resultData.imageList[0].imageUrl),
					imageUrlTemp: res.data.resultData.imageList[0].imageUrl,
				})
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
		selectChange(val) {
			if (val) {
				let obj = this.options.find((item) => {
					return item.afterSalesAddressId == val
				})
				this.filterFormData(obj)
			}
		},
		filterFormData(obj) {
			this.arbitramentData.consignee = obj.consignee
			this.arbitramentData.phone = obj.phone
			this.arbitramentData.tel = obj.tel
			this.arbitramentData.address =
				obj.province +
				obj.city +
				obj.district +
				obj.detail +
				'|' +
				obj.consignee +
				'|' +
				obj.phone
			this.arbitramentData.standard = obj.standard
		},
		afterSalesAddressList: async function () {
			let {
				data: { resultCode = 0, resultData = [] },
			} = await afterSalesAddressList({
				supplierId: this.resultDataList.supplierId,
			})
			if (resultCode == 0) {
				this.options = resultData
				this.selectOp = resultData
				if (resultData.length == 1) {
					this.arbitramentData.selectAd = resultData[0].afterSalesAddressId
					this.filterFormData(resultData[0])
				}
			}
		},
		//仲裁弹窗
		successAndFailure(title) {
			this.arbitramentDialog = true
			this.resetForm()
			this.arbitramentTitle = title
			if (title == 'success') {
				this.arbitramentHint =
					this.resultDataList.afterType == 1 &&
					this.resultDataList.arbitrationType == 1
						? '仲裁成功后，售后单将审核通过，变为”待寄出“状态，是否确认进行操作仲裁成功？'
						: '仲裁成功后，将退款给用户，是否确认进行操作仲裁成功？'
				this.arbitrationTitle = '仲裁成功'
				this.arbitramentItem[3].hide = false
				this.afterSalesAddressList()
			} else {
				this.arbitramentHint =
					'仲裁失败后，售后单将变为“已关闭”状态，是否确认进行操作仲裁失败？'
				this.arbitrationTitle = '仲裁失败'
				if (this.resultDataList.afterType == 1) {
					this.arbitramentItem[3].hide = true
				}
			}
		},
	},
}
</script>

<style lang="scss" scope>
.form-msg {
	font-size: 14px;
	color: #606266;
	margin-bottom: 14px;
	span {
		color: brown;
	}
}
.el-col .el-form-item--small.el-form-item {
	margin-bottom: 0;
}
.fl-r {
	float: right;
}
.di-c {
	margin-bottom: 10px;
	display: contents;
}
.mb10 {
	margin-bottom: 10px;
}
.mb30 {
	margin-bottom: 30px;
}

.pd20 {
	padding: 20px;
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
.prefix-star:before {
	content: '*';
	color: #ff6c60;
}
.wg_image_box {
	width: 150px;
	margin-left: 20px;
}
.df {
	display: flex;
}
</style>

<template>
	<div class="goodsStockList">
		<basicContainer>
			<WgForm
				ref="WgForm"
				:inline="true"
				:data="formData105"
				:items="formCfg105"
				:formAction="formAction105"
				:actionInline="true"
			>
			</WgForm>
			<div style="margin-bottom: 20px">
				<label for="">快捷筛选：</label>
				<el-button :type="buttonType" @click="overtimeQuery"
					>商家超时未处理单</el-button
				>
				<el-button
					v-if="buttonType == 'primary'"
					type="primary"
					@click="_exportArbitration(1)"
					>导出超时数据</el-button
				>
			</div>
			<WgTable
				v-loading="showLoading"
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
			</WgTable>

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
			<!-- //商家超时未处理单查询 -->
			<Dialog
				title="是否进行快捷查询"
				:visible="WhetherPerformQuickQuery"
				width="20%"
				:bottomBtn="performQuickBottomBtn"
				@before-close="WhetherPerformQuickQuery = false"
			>
				<h3>选择此筛选条件后，其他筛选条件均不生效</h3>
			</Dialog>
			<!-- //仲裁弹窗 -->
			<Dialog
				:title="arbitrationTitle"
				:visible="arbitramentDialog"
				width="50%"
				:bottomBtn="arbitramentBottomBtn"
				@before-close="arbitramentDialog = false"
			>
				<h3>{{ arbitramentHint }}</h3>
				<WgForm
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
							placeholder="图片可直接在此处框粘贴"
							show-word-limit
							@paste.native="_uploadImageHttpRequest"
						>
						</el-input>
					</template>
					<template
						slot="merchantAddress"
						v-if="
							arbitramentRow.afterType == 1 &&
							arbitramentTitle == 'succeed' &&
							arbitramentRow.arbitrationType == 1
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
						<el-form-item
							style="margin-top: 10px"
							v-if="arbitramentData.rate == 1"
						>
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
				</WgForm>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import WgForm from '@/components/WgForm'
import WgTable from '@/components/WgTable'
import Dialog from '@/components/Dialog'
import { uploadImageList } from '@/api/image'
import { getBigImg } from '@/utils/imageTool'
import {
	afterSalesAddressList,
	arbitrationExport,
	afterSalesArbitrationPage,
	platformArbitrateFail,
	platformArbitrateSuccess,
	platformForwardToSupplier,
} from '@/api/afterSales'
import { getCmsSupplierListByCondition } from '@/api/yhtPlusCmsSupplier'
import { wgGetDate, downloadFile } from '@/utils/helper/common'
import moment from 'moment'
export default {
	name: 'arbitrationList',
	components: {
		BasicContainer,
		WgForm,
		WgTable,
		Dialog,
	},
	props: [],
	data() {
		return {
			imageDialog: false,
			showLoading: false,
			endRepaiOrderLoding: false,
			serviceTicketIdRow: null,
			WhetherPerformQuickQuery: false,
			arbitramentDialog: false,
			processingDialog: false,
			transferMerchantText: '',
			arbitrationTitle: '',
			arbitramentHint: '',
			buttonType: 'cancel',
			selectGroupList: [],
			options: [],
			arbitramentRow: {},
			arbitramentTitle: '',
			formData105: {
				afterSalesSn: '', //关联售后单号
				afterType: '', //售后类型，1：退货退款，2：仅退款
				applyArbitrationEndTime: wgGetDate().getMonthEndDate, //用户申请仲裁时间结束时间
				applyArbitrationStartTime: wgGetDate().getMonthStartDate, //用户申请仲裁时间开始时间
				supplierCompleteStartTime: wgGetDate().getMonthStartDate, //商家处理完成时间 - 开始时间
				supplierCompleteEndTime: wgGetDate().getMonthEndDate, //商家处理完成时间 - 结束时间
				platformCompleteStartTime: wgGetDate().getMonthStartDate, //平台处理完成时间 - 开始时间
				platformCompleteEndTime: wgGetDate().getMonthEndDate, //平台处理完成时间 - 结束时间
				arbitrationSn: '', //仲裁单号
				arbitrationState: '', //仲裁状态，1：待商家处理，2：待平台处理, 3：已关闭, 4：仲裁完成
				arbitrationType: '', //仲裁类型，1：审核结果仲裁，2：验货结果仲裁
				isSupplierCompleteOverTime: 0, //是只查询否商家审核超时
				orderSn: '', //订单号
				platformType: 4, //平台类型,4：S端、8：商家端
				supplierName: '',
				supplierId: '',
			},
			funRules: {
				ticketFinishRemark: [
					{ required: true, message: '请填写备注!', trigger: 'blur' },
				],
			},

			performQuickBottomBtn: [
				{
					title: '取消',
					type: 'cancel',
					click: () => {
						this.buttonType = 'cancel'
						this.WhetherPerformQuickQuery = false
					},
				},
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.buttonType = 'primary'
						this.WhetherPerformQuickQuery = false
						this.formData105.isSupplierCompleteOverTime = '1'
						this._getAfterSalesArbitrationPage(true)
					},
				},
			],
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
							ticketFinishResult: '',
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

			arbitramentData: {
				ticketFinishRemark: '',
				ticketFinishResult: '',
				activityImage: [],
				selectAd: '',
				address: '',
				phone: '',
				tel: '',
				returnStandard: '',
				standard: '',
				rate: 1,
			},
			arbitramentItem: [
				{
					title: '仲裁备注',
					type: 'textarea',
					placeholder: '该备注会显示在商家端及用户侧',
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
			formCfg105: [
				{
					type: 'input',
					title: '仲裁单号',
					dataIndex: 'arbitrationSn',
					placeholder: '请输入仲裁单号',
					enter: () => {
						this._getAfterSalesArbitrationPage(true)
					},
				},
				{
					type: 'input',
					title: '订单编号',
					dataIndex: 'orderSn',
					placeholder: '请输入订单编号',
					enter: () => {
						this._getAfterSalesArbitrationPage(true)
					},
				},
				{
					type: 'input',
					title: '售后单号',
					dataIndex: 'afterSalesSn',
					placeholder: '请输入售后单号',
					enter: () => {
						this._getAfterSalesArbitrationPage(true)
					},
				},
				{
					type: 'generalSelect',
					title: '商家',
					multiple: false, //是否多选单选
					Url: getCmsSupplierListByCondition, //获取接口
					key: 'supplierId', //key值设置
					dataIndex: 'supplierId',
					showName: 'supplierName',
					inquire: 'supplierName', //入参字段
					placeholder: '请输入商家名称', //提示语
					dataList: 'supplierList', //获取数据下层
					colSpan: 6,
				},
				{
					type: 'select',
					title: '售后类型',
					dataIndex: 'afterType',
					placeholder: '请选择售后类型',
					label: 'value',
					options: [
						{
							afterType: '',
							value: '全部',
						},
						{
							afterType: '1',
							value: '退货退款',
						},
						{
							afterType: '2',
							value: '仅退款',
						},
					],
				},
				{
					type: 'select',
					title: '仲裁类型',
					dataIndex: 'arbitrationType',
					placeholder: '请选择仲裁类型',
					label: 'value',
					options: [
						{
							arbitrationType: '',
							value: '全部',
						},
						{
							arbitrationType: '1',
							value: '审核结果仲裁',
						},
						{
							arbitrationType: '2',
							value: '验货结果仲裁',
						},
					],
				},

				{
					type: 'select',
					title: '仲裁状态',
					dataIndex: 'arbitrationState',
					placeholder: '请选择仲裁状态',
					label: 'value',
					options: [
						{
							arbitrationState: '',
							value: '全部',
						},
						{
							arbitrationState: '1',
							value: '待商家处理',
						},
						{
							arbitrationState: '2',
							value: '待平台处理',
						},
						{
							arbitrationState: '4',
							value: '仲裁完成',
						},
						{
							arbitrationState: '3',
							value: '仲裁关闭',
						},
					],
				},
				{
					title: '用户申请仲裁时间',
					type: 'datetimerange',
					dataIndex: ['applyArbitrationStartTime', 'applyArbitrationEndTime'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					title: '商家处理完成时间',
					type: 'datetimerange',
					dataIndex: ['supplierCompleteStartTime', 'supplierCompleteEndTime'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					title: '平台处理完成时间',
					type: 'datetimerange',
					dataIndex: ['platformCompleteStartTime', 'platformCompleteEndTime'],
					placeholder: ['开始时间', '结束时间'],
				},
				// {
				// 	type: 'custom',
				// 	dataIndex: 'rapidScreening',
				// 	enter: () => {
				// 		this._getAfterSalesArbitrationPage(true)
				// 	},
				// },
			],
			formAction105: [
				{
					title: '重置',
					supplierId: '',
					align: 'right',
					click: () => {
						this.resetForm()
					},
				},
				{
					title: '查询',
					type: 'primary',
					align: 'right',
					click: (e) => {
						this._getAfterSalesArbitrationPage(true, e)
					},
				},
				{
					title: '导出',
					type: 'success',
					auth: 'afterSalesArbitrationExport',
					click: () => {
						this._exportArbitration(0)
					},
				},
			],
			tableData106: [],
			tableColumns106: [
				{
					type: 'string',
					dataIndex: 'arbitrationSn',
					width: '150',
					title: '仲裁单号',
				},

				{
					type: 'custom',
					dataIndex: 'orderSn',
					width: '200',
					title: '关联订单号',
				},
				{
					type: 'custom',
					dataIndex: 'afterSalesSn',
					width: '200',
					title: '售后单号',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
				},
				{
					type: 'string',
					dataIndex: 'afterType',
					title: '售后类型',
					customRender: (row) => {
						return row.afterType == 1 ? '退货退款' : '仅退款'
					},
				},
				{
					type: 'string',
					dataIndex: 'arbitrationType',
					title: '仲裁类型',
					customRender: (row) => {
						return row.arbitrationType == 1 ? '审核结果仲裁' : '验货结果仲裁'
					},
				},
				{
					type: 'string',
					dataIndex: 'arbitrationState',
					title: '仲裁状态',
					customRender: (row) => {
						if (row.arbitrationState == 1) {
							return '待商家处理'
						} else if (row.arbitrationState == 2) {
							return '待平台处理'
						} else if (row.arbitrationState == 3) {
							return '已关闭'
						} else if (row.arbitrationState == 4) {
							return '仲裁完成'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'data',
					dataIndex: 'applyArbitrationTime',
					title: '用户申请仲裁时间',
					width: '148',
				},
				{
					type: 'data',
					dataIndex: 'supplierCompleteTime',
					title: '商家处理完成时间',
					width: '148',
				},
				{
					type: 'data',
					dataIndex: 'platformCompleteTime',
					title: '平台处理完成时间',
					width: '148',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '查看详情',
							auth: 'afterSalesArbitrationDetail',
							click: (row) => {
								this.$router.push({
									path: `/business/afterArbitrationDetails/${row.id}`,
								})
							},
						},
						{
							title: '仲裁成功',
							auth: 'afterSalesArbitrateSuccess',
							click: (row) => {
								this.arbitramentDialog = true
								this.showHidden(row, 'succeed')

								this.arbitramentHint =
									row.afterType == 1 && row.arbitrationType == 1
										? '仲裁成功后，售后单将审核通过，变为”待寄出“状态，是否确认进行操作仲裁成功？'
										: '仲裁成功后，将退款给用户，是否确认进行操作仲裁成功？'

								this.arbitrationTitle = '仲裁成功'
							},
							customRender: (action, row) => {
								action.hide =
									row.arbitrationState != 1 && row.arbitrationState != 2
								return action
							},
						},
						{
							title: '仲裁失败',
							auth: 'afterSalesArbitrateFail',
							click: (row) => {
								this.arbitramentDialog = true
								this.showHidden(row, 'fail')
								this.arbitramentHint =
									'仲裁失败后，售后单将变为“已关闭”状态，是否确认进行操作仲裁失败？'

								this.arbitrationTitle = '仲裁失败'
							},
							customRender: (action, row) => {
								action.hide =
									row.arbitrationState != 1 && row.arbitrationState != 2
								return action
							},
						},
						{
							title: '转交至商家处理',
							auth: 'afterSalesArbitrateForwardToSupplier',
							click: (row) => {
								this.processingDialog = true
								this.arbitramentRow = row
							},
							customRender: (action, row) => {
								// 退货退款+审核结果仲裁+待平台处理
								let show =
									row.arbitrationState == 2 &&
									row.afterType == 1 &&
									row.arbitrationType == 1
								action.hide = !show
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
					this._getAfterSalesArbitrationPage()
				},
			},
		}
	},
	computed: {},
	watch: {},
	created() {
		this._getAfterSalesArbitrationPage()
	},
	mounted() {},
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
				id: this.arbitramentRow.id,
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
				this._getAfterSalesArbitrationPage()
			}
		},
		//仲裁失败/成功
		_arbitrationMethod: async function () {
			let paramJson = {
				remark: this.arbitramentData.ticketFinishRemark,
				id: this.arbitramentRow.id,
				operatorName: this.$store.state.user.userInfo.userName,
				operatorId: this.$store.state.user.userInfo.userId,
				imageUrlList: [],
			}
			this.arbitramentData.activityImage.map((item) => {
				paramJson.imageUrlList.push(item.imageUrlTemp)
			})
			if (
				this.arbitramentRow.afterType == 1 &&
				this.arbitramentTitle == 'succeed' &&
				this.arbitramentRow.arbitrationType == 1
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
					paramJson.mailAddress = ''
					paramJson.mailAddress = this.arbitramentData.returnStandard
					if (!paramJson.mailAddress) {
						return this.$message({
							message: '请填写寄回地址',
							type: 'error',
						})
					}
				}
			}
			let Url =
				this.arbitramentTitle == 'succeed'
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
				this._getAfterSalesArbitrationPage()
			}
		},
		//仲裁弹窗显/隐
		showHidden(row, title) {
			this.arbitramentRow = row
			this.arbitramentTitle = title
			if (row.afterType == 1 && title == 'fail') {
				this.arbitramentItem[3].hide = true
			} else {
				this.arbitramentData.selectAd = ''
				this.afterSalesAddressList()
				this.arbitramentItem[3].hide = false
			}
			this.resetForm()
		},
		_exportArbitration: async function (v) {
			this.$confirm('确定导出？', '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						let paramJson = Object.assign({}, this.formData105)
						paramJson.isSupplierCompleteOverTime = v
						let { data } = await arbitrationExport(paramJson)
						downloadFile(data, '售后仲裁单列表.xlsx')
					}
				},
			})
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
				supplierId: this.arbitramentRow.supplierId,
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
		overtimeQuery() {
			if (this.buttonType == 'cancel') {
				this.WhetherPerformQuickQuery = true
				this.buttonType = 'primary'
			} else {
				this.resetForm()
				this.buttonType = 'cancel'
				this.WhetherPerformQuickQuery = false
			}
		},
		// 重置
		resetForm() {
			console.log('llllll', this)
			this.$refs.WgForm.resetFields()
			this.selectGroupList = []
			this.arbitramentData = {
				ticketFinishRemark: '',
				ticketFinishResult: '',
				activityImage: [],
				selectAd: '',
				address: '',
				phone: '',
				tel: '',
				standard: '',
				returnStandard: '',
				rate: 1,
			}
			this.buttonType = 'cancel'
			this.formData105 = {
				afterSalesSn: '', //关联售后单号
				afterType: '', //售后类型，1：退货退款，2：仅退款
				applyArbitrationEndTime: wgGetDate().getMonthEndDate, //用户申请仲裁时间结束时间
				applyArbitrationStartTime: wgGetDate().getMonthStartDate, //用户申请仲裁时间开始时间
				supplierCompleteStartTime: wgGetDate().getMonthStartDate, //商家处理完成时间 - 开始时间
				supplierCompleteEndTime: wgGetDate().getMonthEndDate, //商家处理完成时间 - 结束时间
				platformCompleteStartTime: wgGetDate().getMonthStartDate, //平台处理完成时间 - 开始时间
				platformCompleteEndTime: wgGetDate().getMonthEndDate, //平台处理完成时间 - 结束时间
				arbitrationSn: '', //仲裁单号
				arbitrationState: '', //仲裁状态，1：待商家处理，2：待平台处理, 3：已关闭, 4：仲裁完成
				arbitrationType: '', //仲裁类型，1：审核结果仲裁，2：验货结果仲裁
				isSupplierCompleteOverTime: 0, //是只查询否商家审核超时
				orderSn: '', //订单号
				platformType: 4, //平台类型,4：S端、8：商家端
				supplierName: '',
				supplierId: '',
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
		findSearchParams106(flag) {
			//搜索条件
			let paramJson = Object.assign(this.formData105, {
				pageNum: 1,
				pageSize: 10,
			})
			// 每页的加载数据长度
			paramJson.pageSize = this.page106.length
			// 当前页的条数开始
			if (flag) {
				this.page106.currentPage = 1
			}
			paramJson.applyArbitrationStartTime =
				moment(paramJson.applyArbitrationStartTime).valueOf() || ''
			paramJson.applyArbitrationEndTime =
				moment(paramJson.applyArbitrationEndTime).valueOf() || ''
			paramJson.supplierCompleteStartTime =
				moment(paramJson.supplierCompleteStartTime).valueOf() || ''
			paramJson.supplierCompleteEndTime =
				moment(paramJson.supplierCompleteEndTime).valueOf() || ''
			paramJson.platformCompleteStartTime =
				moment(paramJson.platformCompleteStartTime).valueOf() || ''
			paramJson.platformCompleteEndTime =
				moment(paramJson.platformCompleteEndTime).valueOf() || ''
			paramJson.pageNum = this.page106.currentPage
			return paramJson
		},
		_getAfterSalesArbitrationPage: async function (flag, e) {
			let paramJson = this.findSearchParams106(flag)
			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await afterSalesArbitrationPage(paramJson, custom)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData106 = resultData.records
				this.page106.count = resultData.total
			} else {
				this.page106.count = 0
				this.tableData106 = []
			}
		},
	},
}
</script>
<style>
.prefix-star:before {
	content: '*';
	color: #ff6c60;
}
</style>

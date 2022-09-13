<template>
	<basic-container>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="云货优选" name="systemOffers">
				<div class="add-coupon-box">
					<div class="add-coupon-item" v-auth="'addYxCouponYx'">
						<img
							class="add-coupon-img"
							src="../../../../../../static/images/coupon-yx.jpg"
						/>
						<div class="add-coupon-info">
							<div>
								<div class="add-coupon-title">优选券</div>
								<div class="add-coupon-tip">实付价计佣，影响店主佣金</div>
							</div>
							<el-button
								class="add-coupon-btn"
								type="primary"
								@click="addCoupon(3)"
								>+创建优选券</el-button
							>
						</div>
					</div>
					<div class="add-coupon-item" v-auth="'addYxCouponBrand'">
						<img
							class="add-coupon-img"
							src="../../../../../../static/images/coupon-brand.jpg"
						/>
						<div class="add-coupon-info">
							<div>
								<div class="add-coupon-title">品牌券</div>
								<div class="add-coupon-tip">销售价计佣，不影响店主佣金</div>
							</div>
							<el-button
								class="add-coupon-btn"
								type="primary"
								@click="addCoupon(2)"
								>+创建品牌券</el-button
							>
						</div>
					</div>
					<div class="add-coupon-item" v-auth="'addYxCouponPlatform'">
						<img
							class="add-coupon-img"
							src="../../../../../../static/images/coupon-platform.jpg"
						/>
						<div class="add-coupon-info">
							<div>
								<div class="add-coupon-title">平台购物券</div>
								<div class="add-coupon-tip">实付价计佣，影响店主佣金</div>
							</div>
							<el-button
								class="add-coupon-btn"
								type="primary"
								@click="addCoupon(1)"
								>+创建平台购物券</el-button
							>
						</div>
					</div>
				</div>
				<div class="couponList">
					<yx-form
						:inline="true"
						:data="searchData"
						:items="searchCfg"
						:formAction="searchAction"
						><template #yxCouponIds>
							<el-input
								type="textarea"
								v-model="searchData.yxCouponIds"
								placeholder="可支持通过用逗号或换行批量搜索，精确搜索"
							></el-input> </template
					></yx-form>
					<el-row>
						<yx-table
							v-loading="showLoading"
							:columns="tableColumns"
							:pagination="page"
							:data="tableData"
						>
							<template slot="range" slot-scope="scope">
								<el-button
									type="text"
									@click="handleConference(scope.row)"
									v-if="
										scope.row.range == 1 &&
										scope.row.rangeExtList &&
										scope.row.rangeExtList.length > 1
									"
									>指定档期（{{
										scope.row.rangeExtList ? scope.row.rangeExtList.length : 0
									}}）</el-button
								>
								<el-button
									type="text"
									@click="handleCommodity(scope.row)"
									v-else-if="
										scope.row.range == 3 &&
										scope.row.rangeExtList &&
										scope.row.rangeExtList.length > 1
									"
									>指定商品（{{
										scope.row.rangeExtList ? scope.row.rangeExtList.length : 0
									}}）</el-button
								>
								<span
									v-else-if="
										scope.row.range == 1 &&
										scope.row.rangeExtList &&
										scope.row.rangeExtList.length == 1
									"
									>指定档期：{{ scope.row.rangeExtList[0].groupName }}</span
								>
								<span
									v-else-if="
										scope.row.range == 3 &&
										scope.row.rangeExtList &&
										scope.row.rangeExtList.length == 1
									"
									>指定商品：{{ scope.row.rangeExtList[0].goodsName }}</span
								>
								<span v-else>全场</span>
							</template>
						</yx-table>
					</el-row>
					<modify-amount-dialog
						:visible.sync="modifyAmountDialog"
						:modifyAmountRow="modifyAmountRow"
						@Refresh="Refresh"
					></modify-amount-dialog>

					<distribute-coupons-dialog
						:visible.sync="distributeCouponsDialog"
						:distributeCouponsRow="distributeCouponsRow"
						@Refresh="Refresh"
					></distribute-coupons-dialog>
					<conference-hall-dialog
						:visible.sync="conferenceHallDialog"
						:conferenceHallRow="conferenceHallRow"
					>
					</conference-hall-dialog>
					<designated-goods-dialog
						:visible.sync="designatedGoodsDialog"
						:conferenceHallRow="conferenceHallRow"
					></designated-goods-dialog>
				</div>
			</el-tab-pane>
			<el-tab-pane label="上游优惠券" name="upstreamCoupon">
				<span slot="label"> 上游优惠券</span>
				<div class="couponList">
					<yx-form
						:inline="true"
						:data="upstreamData"
						:items="upstreamCfg"
						:formAction="upstreamAction"
						><template #yxCouponIds>
							<el-input
								type="textarea"
								v-model="upstreamData.yxCouponIds"
								placeholder="批量搜索用逗号隔开或换行输入"
							></el-input> </template
					></yx-form>
					<el-row>
						<yx-table
							v-loading="upstreamLoading"
							:columns="upstreamTableColumns"
							:pagination="upstreamPage"
							:data="upstreamTableData"
						>
							<template slot="range" slot-scope="scope">
								<el-button
									type="text"
									@click="handleConference(scope.row)"
									v-if="
										scope.row.range == 1 &&
										scope.row.rangeExtList &&
										scope.row.rangeExtList.length > 1
									"
									>指定档期（{{
										scope.row.rangeExtList ? scope.row.rangeExtList.length : 0
									}}）</el-button
								>
								<el-button
									type="text"
									@click="handleCommodity(scope.row)"
									v-else-if="
										scope.row.range == 3 &&
										scope.row.rangeExtList &&
										scope.row.rangeExtList.length > 1
									"
									>指定商品（{{
										scope.row.rangeExtList ? scope.row.rangeExtList.length : 0
									}}）</el-button
								>
								<span
									v-else-if="
										scope.row.range == 1 &&
										scope.row.rangeExtList &&
										scope.row.rangeExtList.length == 1
									"
									>指定档期：{{ scope.row.rangeExtList[0].groupName }}</span
								>
								<span
									v-else-if="
										scope.row.range == 3 &&
										scope.row.rangeExtList &&
										scope.row.rangeExtList.length == 1
									"
									>指定商品：{{ scope.row.rangeExtList[0].goodsName }}</span
								>
								<span v-else>全场</span>
							</template>
						</yx-table>
					</el-row>
					<look-coupon-dialog
						:visible.sync="lookCouponDialog"
						:editRow="upstreamEditRow"
					></look-coupon-dialog>
				</div>
			</el-tab-pane>
		</el-tabs>
		<new-edit-coupon-dialog
			:visible.sync="newEditCouponDialog"
			:editRow="editRow"
			@Refresh="Refresh"
		></new-edit-coupon-dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import ModifyAmountDialog from './ModifyAmountDialog'
import NewEditCouponDialog from './NewEditCouponDialog'
import LookCouponDialog from './LookCouponDialog'
import DistributeCouponsDialog from './DistributeCouponsDialog'
import ConferenceHallDialog from './ConferenceHallDialog'
import DesignatedGoodsDialog from './DesignatedGoodsDialog'
import { highPrecisionMul } from '@/utils/helper/common'
import { checkFunctionCode } from '@/utils/auth'
import {
	queryYxCouponInfoBatch,
	closeOrOpenCoupon,
	updateCouponShelfState,
	updateCouponName,
	getYxCouponInfoToYhtPlus,
} from '@/api/coupon'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		ModifyAmountDialog,
		NewEditCouponDialog,
		DistributeCouponsDialog,
		ConferenceHallDialog,
		DesignatedGoodsDialog,
		LookCouponDialog,
	},
	name: 'FormTable',

	data() {
		return {
			activeName: 'systemOffers',
			copyRow: {},
			value: [],
			upstreamLoading: false,
			modifyAmountDialog: false,
			lookCouponDialog: false,
			distributeCouponsDialog: false,
			conferenceHallDialog: false,
			designatedGoodsDialog: false,
			conferenceHallRow: {},
			distributeCouponsRow: {},
			modifyAmountRow: {},
			editRow: {},
			upstreamEditRow: {},
			newEditCouponDialog: false,
			showLoading: false,
			searchData: {
				couponName: '',
				addStartTime: '',
				addEndTime: '',
				status: '',
				couponType: '',
				yxCouponIds: '',
			},
			upstreamData: {
				couponName: '',
				yxCouponIds: '',
				addStartTime: '',
				addEndTime: '',
				couponType: '',
				sourceType: 2,
			},
			upstreamCfg: [
				{
					type: 'input',
					title: '优惠券名称',
					dataIndex: 'couponName',
				},
				{
					title: '创建时间:',
					type: 'datetimerange',
					dataIndex: ['addStartTime', 'addEndTime'],
				},
				{
					type: 'select',
					title: '渠道',
					dataIndex: 'sourceType',
					label: 'value',
					options: [
						{
							sourceType: 2,
							value: 'AKC',
						},
					],
				},
				{
					title: '优惠券ID',
					type: 'custom',
					dataIndex: 'yxCouponIds',
				},
			],
			orderStatus: [],
			statusMap: ['禁用', '正常'],
			shelfStateMap: ['', '下架', '上架'],
			searchCfg: [
				{
					type: 'input',
					title: '优惠券名称',
					dataIndex: 'couponName',
				},
				{
					title: '创建时间:',
					type: 'datetimerange',
					dataIndex: ['addStartTime', 'addEndTime'],
				},
				{
					type: 'select',
					title: '优惠券状态',
					dataIndex: 'status',
					label: 'value',
					options: [
						{
							status: '',
							value: '全部',
						},
						{
							status: '0',
							value: '禁用',
						},
						{
							status: '1',
							value: '启用',
						},
					],
				},
				{
					type: 'select',
					title: '优惠券类型',
					dataIndex: 'couponType',
					label: 'value',
					options: [
						{
							couponType: '',
							value: '全部',
						},
						{
							couponType: 3,
							value: '优选券',
						},
						{
							couponType: 2,
							value: '品牌券',
						},
						{
							couponType: 1,
							value: '平台购物券',
						},
					],
				},
				{
					title: 'ID',
					type: 'custom',
					dataIndex: 'yxCouponIds',
				},
			],
			upstreamAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._queryYxCouponInfoBatch(true)
					},
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._queryYxCouponInfoBatch(true)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'yxCouponId',
					title: '优惠券ID',
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'couponName',
					title: '优惠券名称',
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'limitType',
					title: '使用门槛',
					align: 'left',
					customRender: (row) => {
						if (row.limitType == 1) {
							return '满' + row.limitAmount + '元'
						} else if (row.limitType == 3) {
							return '满' + row.floorCount + '件'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'typeExt',
					title: '优惠类型',
					align: 'left',
					customRender: (row) => {
						if (row.typeExt == 1) {
							return '减' + row.amount + '元'
						} else if (row.typeExt == 2) {
							return '打' + highPrecisionMul(row.amount, 10) + '折'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'couponType',
					title: '优惠券类型',
					align: 'left',
					customRender: (row) => {
						if (row.couponType == 1) {
							return '平台购物券'
						} else if (row.couponType == 2) {
							return '品牌券'
						} else if (row.couponType == 3) {
							return '优选券'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'expiryDateType',
					title: '有效期',
					align: 'left',
					width: 140,
					customRender: (row) => {
						if (row.expiryDateType == 1) {
							return (
								moment(row.startTime).format('YYYY-MM-DD HH:mm:ss') +
								'~' +
								moment(row.endTime).format('YYYY-MM-DD HH:mm:ss')
							)
						} else if (row.expiryDateType == 2) {
							return '自领取起' + row.expiryDate + '天内有效'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'custom',
					dataIndex: 'range',
					title: '使用范围',
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'usePermission',
					title: '使用权限',
					align: 'left',
					customRender: (row) => {
						if (row.usePermission == 1) {
							return '仅领券店主下可使用'
						} else {
							return '所有店主下可使用'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'grantQuantity',
					title: '发放总量',
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '优惠券状态',
					customRender: (row) => {
						return this.statusMap[row.status]
					},
				},
				{
					type: 'string',
					dataIndex: 'shelfState ',
					title: '上架状态',
					customRender: (row) => {
						return this.shelfStateMap[row.shelfState]
					},
				},
				{
					type: 'action',
					title: '操作',
					width: 140,
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.editCoupon(row)
							},
							customRender: (action, row) => {
								let actionHide = false
								if (row.typeExt == 2) {
									actionHide = true
								} else if (
									row.couponType == 3 &&
									!checkFunctionCode('updateYxCouponYx')
								) {
									actionHide = true
								} else if (
									row.couponType == 2 &&
									!checkFunctionCode('updateYxCouponBrand')
								) {
									actionHide = true
								} else if (
									row.couponType == 1 &&
									!checkFunctionCode('updateYxCouponPlatform')
								) {
									actionHide = true
								}
								action.hide = actionHide
								return action
							},
						},
						{
							title: '查看',
							click: (row) => {
								this.newEditCouponDialog = true
								row.isCheck = true
								this.editRow = row
							},
							customRender: (action, row) => {
								action.hide = row.typeExt != 2
								return action
							},
						},
						{
							title: '禁用',
							auth: 'closeOrOpenCoupon',
							click: (row) => {
								this._closeOrOpenCoupon(row)
							},
							customRender: (action, row) => {
								action.hide = row.status == 0
								return action
							},
						},
						{
							title: '启用',
							auth: 'closeOrOpenCoupon',
							click: (row) => {
								this._closeOrOpenCoupon(row)
							},
							customRender: (action, row) => {
								action.hide = row.status == 1
								return action
							},
						},
						{
							title: '下架',
							click: (row) => {
								this._updateCouponShelfState(row)
							},
							customRender: (action, row) => {
								action.hide = row.shelfState == 1
								return action
							},
						},
						{
							title: '上架',
							click: (row) => {
								this._updateCouponShelfState(row)
							},
							customRender: (action, row) => {
								action.hide = row.shelfState == 2
								return action
							},
						},
						{
							title: '优惠券详情',
							click: ({ yxCouponId }) => {
								this.$router.push({
									path: `/ym/couponDetails/${yxCouponId}`,
								})
							},
						},
						{
							title: '修改发放总数',
							click: (row) => {
								this.modifyAmountDialog = true
								this.modifyAmountRow = row
							},
						},
						{
							title: '派发优惠券',
							click: (row) => {
								this.distributeCouponsRow = row
								this.distributeCouponsDialog = true
							},
							customRender: (action, row) => {
								action.hide =
									row.shelfState == 2 && row.status == 1 ? false : true
								return action
							},
						},
						{
							title: '复制',
							click: (row) => {
								let copyRow = Object.assign(
									{
										isCopy: true,
									},
									row
								)
								delete copyRow.yxCouponId
								this.copyRow = copyRow
								console.log('row>>>>>>>>>>>>>', row)
								this.$message.success('复制成功')
							},
						},
					],
				},
			],
			upstreamTableData: [],
			upstreamTableColumns: [
				{
					type: 'string',
					dataIndex: 'yxCouponId',
					title: '优惠券ID',
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'couponName',
					title: '优惠券名称',
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'limitType',
					title: '使用门槛',
					align: 'left',
					customRender: (row) => {
						if (row.limitType == 1) {
							return '满' + row.limitAmount + '元'
						} else if (row.limitType == 3) {
							return '满' + row.floorCount + '件'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'typeExt',
					title: '优惠类型',
					align: 'left',
					customRender: (row) => {
						if (row.typeExt == 1) {
							return '减' + row.amount + '元'
						} else if (row.typeExt == 2) {
							return '打' + highPrecisionMul(row.amount, 10) + '折'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'couponType',
					title: '优惠券类型',
					align: 'left',
					customRender: (row) => {
						if (row.couponType == 1) {
							return '平台购物券'
						} else if (row.couponType == 2) {
							return '品牌券'
						} else if (row.couponType == 3) {
							return '优选券'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'expiryDateType',
					title: '有效期',
					align: 'left',
					width: 140,
					customRender: (row) => {
						if (row.expiryDateType == 1) {
							return (
								moment(row.startTime).format('YYYY-MM-DD HH:mm:ss') +
								'~' +
								moment(row.endTime).format('YYYY-MM-DD HH:mm:ss')
							)
						} else if (row.expiryDateType == 2) {
							return '自领取起' + row.expiryDate + '天内有效'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'custom',
					dataIndex: 'range',
					title: '使用范围',
					align: 'left',
				},
				{
					type: 'string',
					dataIndex: 'limitDaily',
					title: '限领数量',
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '优惠券禁用状态',
					customRender: (row) => {
						return this.statusMap[row.status]
					},
				},
				{
					type: 'string',
					dataIndex: 'shelfState ',
					title: '上架状态',
					customRender: (row) => {
						return this.shelfStateMap[row.shelfState]
					},
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '查看',
							click: (row) => {
								this.newEditCouponDialog = true
								row.isCheck = true
								this.editRow = row
							},
						},
						{
							title: '编辑',
							click: (row) => {
								this.compile(row)
							},
						},
						{
							title: '禁用',
							auth: 'closeOrOpenCoupon',
							click: (row) => {
								this._closeOrOpenCoupon(row)
							},
							customRender: (action, row) => {
								action.hide = row.status == 0
								return action
							},
						},
						{
							title: '启用',
							auth: 'closeOrOpenCoupon',
							click: (row) => {
								this._closeOrOpenCoupon(row)
							},
							customRender: (action, row) => {
								action.hide = row.status == 1
								return action
							},
						},
						{
							title: '下架',
							click: (row) => {
								this._updateCouponShelfState(row)
							},
							customRender: (action, row) => {
								action.hide = row.shelfState == 1
								return action
							},
						},
						{
							title: '上架',
							click: (row) => {
								this._updateCouponShelfState(row)
							},
							customRender: (action, row) => {
								action.hide = row.shelfState == 2
								return action
							},
						},
						{
							title: '优惠券详情',
							click: ({ yxCouponId }) => {
								this.$router.push({
									path: `/ym/couponDetails/${yxCouponId}`,
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
					this._queryYxCouponInfoBatch()
				},
			},
			upstreamPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._queryYxCouponInfoBatch()
				},
			},
		}
	},

	mounted() {
		this._queryYxCouponInfoBatch()
	},

	methods: {
		// 添加优惠券
		addCoupon(couponType) {
			if (this.copyRow.isCopy && this.copyRow.couponType == couponType) {
				this.$confirm('是否粘贴刚复制的优惠券信息？', '提示', {
					type: 'warning',
					confirmButtonText: '确认粘贴',
					cancelButtonText: '暂不粘贴',
					callback: (action) => {
						if (action === 'confirm') {
							this.editRow = this.copyRow
							this.newEditCouponDialog = true
						} else {
							this.editRow = {}
							this.newEditCouponDialog = true
						}
					},
				})
			} else {
				this.editRow = {
					couponType,
				}
				this.newEditCouponDialog = true
			}
		},
		async compile(row) {
			this.$prompt(`修改优惠券名称`, '', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
				inputErrorMessage: '请输入优惠券名称',
				inputPlaceholder: '请输入优惠券名称',
				inputType: 'textarea',
				customClass: 'winClass', //弹窗样式
				inputValidator: (value) => {
					if (!value) {
						return '请输入优惠券名称'
					}
				},
			}).then(
				async ({ value }) => {
					const {
						data: { resultCode },
					} = await updateCouponName({
						yxCouponId: row.yxCouponId,
						couponName: value,
					})
					if (resultCode == 0) {
						this.$message.success('修改成功')
						this._queryYxCouponInfoBatch()
					}
				},
				() => {}
			)
		},
		handleClick() {
			this._queryYxCouponInfoBatch(true)
		},
		handleConference(val) {
			this.conferenceHallRow = {}
			this.conferenceHallRow = val
			this.conferenceHallDialog = true
		},
		handleCommodity(val) {
			this.conferenceHallRow = {}
			this.conferenceHallRow = val
			this.designatedGoodsDialog = true
		},
		// handleChange(value) {
		// 	console.log(this.$refs['cascader'].getCheckedNodes())
		// 	console.log(value, '========')
		// 	console.log(this.value, 'valuelrjelrjelr======')
		// },
		Refresh() {
			this._queryYxCouponInfoBatch()
		},
		_updateCouponShelfState(row) {
			let text
			let params = {
				yxCouponId: row.yxCouponId,
			}
			if (row.shelfState == 1) {
				text = '确认上架优惠券吗？'
				params.shelfState = 2
			} else if (row.shelfState == 2) {
				text = '下架后优惠券不可被派发或领取，确认是否下架？'
				params.shelfState = 1
			}
			this.$confirm(text, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this._updateCouponShelfState1(params)
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消',
					})
				})
		},
		async _updateCouponShelfState1(params) {
			let {
				data: { resultCode, resultMsg },
			} = await updateCouponShelfState(params)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this._queryYxCouponInfoBatch()
			} else {
				this.$message.error(resultMsg)
			}
		},
		_closeOrOpenCoupon(row) {
			let text
			let params = {
				yxCouponId: row.yxCouponId,
			}
			if (row.status == 0) {
				text = '确认启用优惠券吗？'
				params.status = 1
			} else if (row.status == 1) {
				text = '优惠券禁用后用户已领取的优惠券无法使用，确认禁用该优惠券？'
				params.status = 0
			}
			this.$confirm(text, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this._closeOrOpenCoupon1(params)
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消',
					})
				})
		},
		async _closeOrOpenCoupon1(params) {
			let {
				data: { resultCode, resultMsg },
			} = await closeOrOpenCoupon(params)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this._queryYxCouponInfoBatch()
			} else {
				this.$message.error(resultMsg)
			}
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(
				{
					groupId: 2,
				},
				this.activeName == 'upstreamCoupon'
					? this.upstreamData
					: this.searchData
			)
			let blank = /[\r\n]+/g.test(paramJson.yxCouponIds)
			if (paramJson.yxCouponIds.length > 0 && !blank) {
				let goodsCoupon
				goodsCoupon = String(paramJson.yxCouponIds)
				goodsCoupon = goodsCoupon.split(',')
				paramJson.yxCouponIds = goodsCoupon
			} else if (blank) {
				paramJson.yxCouponIds = paramJson.yxCouponIds.replace(/\n/g, ',')
				paramJson.yxCouponIds = paramJson.yxCouponIds.replace(/\s*/g, '')
				paramJson.yxCouponIds =
					paramJson.yxCouponIds.length > 0
						? paramJson.yxCouponIds.split(',')
						: []
			} else {
				paramJson.yxCouponIds = []
			}
			if (this.activeName == 'upstreamCoupon') {
				paramJson.sourceType = 2
				if (flag) {
					this.upstreamPage.currentPage = 1
				}
				paramJson.pageSize = this.upstreamPage.length
				paramJson.pageNum = this.upstreamPage.currentPage
			} else {
				paramJson.sourceType = 1
				if (flag) {
					this.page.currentPage = 1
				}
				paramJson.pageSize = this.page.length
				paramJson.pageNum = this.page.currentPage
			}
			return paramJson
		},
		_queryYxCouponInfoBatch: async function (flag) {
			let paramJson = this.findSearchParams(flag)
			this.showLoading = true
			let {
				data: { resultCode, resultData, total },
			} = await queryYxCouponInfoBatch(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				let couponList = resultData || []
				couponList.forEach((item) => {
					if (item.rangeExtInfo) {
						let rangeExtInfo = item.rangeExtInfo.split(',')
						if (item.range == 1) {
							item.rangeExtList = rangeExtInfo.map((x) => {
								return {
									goodsGroupId: Number(x.split('-')[0]),
									groupName: x.split(x.split('-')[0] + '-')[1],
								}
							})
						}
						if (item.range == 3) {
							item.rangeExtList = rangeExtInfo.map((x) => {
								return {
									goodsId: Number(x.split('-')[0]),
									goodsName: x.split(x.split('-')[0] + '-')[1],
								}
							})
						}
					}
				})
				if (this.activeName == 'upstreamCoupon') {
					this.upstreamTableData = couponList
					this.upstreamPage.count = total
				} else {
					this.tableData = couponList
					this.page.count = total
				}
			} else {
				if (this.activeName == 'upstreamCoupon') {
					this.upstreamPage.count = 0
					this.upstreamTableData = []
				} else {
					this.page.count = 0
					this.tableData = []
				}
			}
		},
		// 编辑优惠券
		editCoupon(row) {
			getYxCouponInfoToYhtPlus({
				yxCouponId: row.yxCouponId,
			}).then(({ data: { resultData } }) => {
				resultData.isCheck = false
				if (row.isNewData == 0) {
					resultData.rangeExtList = row.rangeExtList
				}
				this.editRow = resultData
				this.newEditCouponDialog = true
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.add-coupon-box {
	display: flex;
}
.add-coupon-item {
	display: flex;
	align-items: center;
	padding-right: 30px;
	margin-bottom: 10px;
}

.add-coupon-info {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 90px;
}
.add-coupon-img {
	width: 90px;
	height: 90px;
	margin-right: 10px;
	border-radius: 8px;
}
.add-coupon-title {
	font-size: 22px;
}
.add-coupon-tip {
	margin-top: 4px;
	font-size: 12px;
}
.add-coupon-btn {
	font-size: 14px;
}
.couponList .el-table .cell {
	white-space: pre-wrap;
}
</style>

<template>
	<div class="package">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData104"
				:items="formCfg104"
				:formAction="formAction104"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns105"
				:pagination="page105"
				:data="tableData105"
			></yx-table>
			<Dialog
				:title="dialogTitle107"
				:visible.sync="dialogVisible107"
				:width="dialogWidth107"
				:bottomBtn="dialogBottomBtn107"
			>
				<yx-form
					ref="dialog108"
					labelWidth="100px"
					:data="formData108"
					:items="formCfg108"
					:formAction="formAction108"
					:rules="formRules108"
				>
					<template slot="packageType">
						<div class="package-type-box">
							<el-checkbox label="isCoupon" v-model="formData108.packageType"
								>优惠券</el-checkbox
							>
							<div style="margin-left: 20px">
								<el-button
									type="text"
									icon="el-icon-plus"
									@click="addChannelRewardCoupon"
									>添加优惠券</el-button
								>
								<div
									v-for="(item, index) in formData108.giftCoupon"
									:key="index"
									class="coupon-item"
								>
									<el-autocomplete
										placeholder="请选择优惠券"
										v-model="item.couponName"
										:fetch-suggestions="querySearchAsync"
										@select="(row) => changeYxCouponId(row, index)"
										class="input-with-select"
									>
										<el-button
											@click="openYxCouponDialog(item, index)"
											slot="append"
											icon="el-icon-more"
										></el-button>
									</el-autocomplete>
									<span>数量</span>
									<el-input
										class="coupon-count"
										type="number"
										v-model="item.couponCount"
										placeholder="请输入内容"
									></el-input>
									<span>张/人</span>
									<el-button
										type="danger"
										@click="formData108.giftCoupon.splice(index, 1)"
										>删除</el-button
									>
								</div>
							</div>
						</div>
					</template>
				</yx-form>
			</Dialog>
			<Dialog
				:title="dialogTitle125"
				:visible.sync="dialogVisible125"
				:width="dialogWidth125"
				:bottomBtn="dialogBottomBtn125"
			>
				<yx-form
					:inline="true"
					:data="formData126"
					:items="formCfg126"
					:formAction="formAction126"
				>
				</yx-form>
				<yx-table
					v-loading="loading127"
					:columns="tableColumns127"
					:pagination="page127"
					:data="tableData127"
				>
					<template slot="yxCouponId" slot-scope="scope">
						<el-radio
							v-model="yxCouponId"
							:label="scope.row.yxCouponId"
							@change="changeYxCouponId(scope.row, yxCouponIndex)"
							>选择
						</el-radio>
					</template>
				</yx-table>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import moment from 'moment'
import { findGiftListByParam, addGift, updateGift, delGift } from '@/api/gift'
import { findCouponListByParam } from '@/api/coupon'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},
	props: [],
	data() {
		return {
			dialogTitle125: '选择优惠券',
			dialogWidth125: '800px',
			dialogVisible125: false,
			yxCouponId: '',
			yxCouponIndex: null,
			dialogBottomBtn125: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible125 = false
					},
				},
			],
			formData126: {
				couponName: '',
			},
			formCfg126: [
				{
					type: 'input',
					title: '筛选',
					dataIndex: 'couponName',
					placeholder: '优惠券名称',
				},
			],
			formAction126: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						this._findCouponListByParam(true)
					},
				},
			],
			loading127: false,
			tableData127: [],
			tableColumns127: [
				{
					type: 'custom',
					dataIndex: 'yxCouponId',
				},
				{
					type: 'string',
					dataIndex: 'couponName',
					title: '优惠券名称',
				},
				{
					type: 'string',
					dataIndex: 'expiryDateType',
					title: '有效期',
					customRender: ({
						expiryDateType,
						startTime,
						endTime,
						expiryDate,
					}) => {
						if (expiryDateType == 1) {
							return (
								moment(startTime).format('YYYY-MM-DD HH:mm:ss') +
								'-' +
								moment(endTime).format('YYYY-MM-DD HH:mm:ss')
							)
						} else if (expiryDateType == 2) {
							return '自领取起' + expiryDate + '天内有效'
						} else {
							return '-'
						}
					},
				},
			],
			page127: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._findCouponListByParam()
				},
			},
			loading: false,
			formData104: {
				giftName: '',
				addTimeStart: '',
				addTimeEnd: moment().endOf('day').valueOf(),
			},
			formCfg104: [
				{
					type: 'input',
					title: '礼包名称',
					dataIndex: 'giftName',
					placeholder: '请输入礼包名称',
				},
				{
					type: 'datetimerange',
					title: '添加时间',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
				},
			],
			formAction104: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.init(true)
					},
					tableId: 105,
				},
				{
					title: '清空',
					isClear: true,
				},
				{
					title: '新增礼包',
					type: 'success',
					auth: 'addGift',
					click: () => {
						this.formData108 = {
							giftName: '',
							packageType: ['isCoupon'],
							giftCoupon: [],
						}
						this.$nextTick(() => {
							this.$refs.dialog108.$refs.YxForm.clearValidate()
						})
						this.dialogTitle107 = '新增礼包'
						this.dialogVisible107 = true
					},
					dialogId: 107,
				},
			],
			tableData105: [],
			tableColumns105: [
				{
					type: 'string',
					dataIndex: 'giftId',
					title: '礼包id',
				},
				{
					type: 'string',
					dataIndex: 'giftName',
					title: '礼包名称',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'string',
					dataIndex: 'addUserName',
					title: '创建人',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '编辑',
							auth: 'updateGift',
							click: (row) => {
								this.formData108 = JSON.parse(JSON.stringify(row))
								this.formData108.packageType = ['isCoupon']
								this.dialogTitle107 = '编辑礼包'
								this.dialogVisible107 = true
							},
							dialogId: 107,
						},
						{
							title: '删除',
							auth: 'delGift',
							popconfirm: true,
							popconfirmTitle: '确认要删除该礼包吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._delGift(row)
							},
						},
					],
				},
			],
			page105: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			dialogTitle107: '新增礼包',
			dialogWidth107: '800px',
			dialogVisible107: false,
			dialogBottomBtn107: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog108.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.savePackage()
							}
						})
						// this.dialogVisible107 = false
					},
				},
			],
			formData108: {
				giftName: '',
				packageType: ['isCoupon'],
				giftCoupon: [],
			},
			formRules108: {
				giftName: [
					{ required: true, message: '请输入礼包名称', trigger: 'blur' },
				],
				packageType: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData108.packageType.length) {
								callback(new Error('请选择礼包内容'))
							} else if (!this.formData108.giftCoupon.length) {
								callback(new Error('请添加优惠券'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
			},
			formCfg108: [
				{
					type: 'input',
					title: '礼包名称',
					dataIndex: 'giftName',
					placeholder: '请输入礼包名称',
				},
				{
					type: 'custom',
					title: '礼包内容',
					dataIndex: 'packageType',
				},
			],
			formAction108: [],
		}
	},

	created() {
		let curTime = moment().startOf('day').valueOf()
		this.formData104.addTimeStart = moment(
			curTime - 24 * 60 * 60 * 1000 * 14
		).valueOf()
	},

	methods: {
		async _delGift({ giftId }) {
			let {
				data: { resultCode, resultMsg },
			} = await delGift({
				giftId, //分组id
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.init(true)
			}
		},
		async savePackage() {
			let paramJson = {
				giftName: this.formData108.giftName,
				inviteCodeCount: '',
				inviteCodeTime: '',
				giftType: 1,
				couponIds: [],
				couponCount: [],
			}
			let flag = true
			for (let item of this.formData108.giftCoupon) {
				if (!item.yxCouponId) {
					flag = false
					this.$message.error('请选择优惠券')
					break
				}
				if (item.couponCount <= 0) {
					flag = false
					this.$message.error('请输入赠送数量(不少于1)')
					break
				}
				if (item.grantQuantity && item.couponCount > item.grantQuantity) {
					flag = false
					this.$message.error('赠送数量不可大于优惠券总数量')
					break
				}
				paramJson.couponIds.push(item.yxCouponId)
				paramJson.couponCount.push(item.couponCount)
			}
			if (!flag) {
				return
			}
			let res = null
			let isFlag = false
			if (this.formData108.giftId) {
				paramJson.giftId = this.formData108.giftId
				res = await updateGift(paramJson)
			} else {
				res = await addGift(paramJson)
				isFlag = true
			}
			let {
				data: { resultCode, resultMsg },
			} = res
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible107 = false
				this.init(isFlag)
			}
		},
		_findCouponListByParam: async function (flag) {
			this.loading127 = true
			let paramJson = this.findSearchParams127(flag)
			const {
				data: { resultCode, resultData },
			} = await findCouponListByParam(paramJson)
			if (resultCode == 0) {
				this.tableData127 = resultData.YxCouponList
				this.page127.count = resultData.count
			} else {
				this.tableData127 = []
				this.page127.count = 0
			}
			this.loading127 = false
		},
		findSearchParams127(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page127.currentPage = 1
			}
			const paramJson = Object.assign(this.formData126, {
				length: this.page127.length,
				startIndex: (this.page127.currentPage - 1) * this.page127.length,
			})
			return paramJson
		},
		openYxCouponDialog(row, index) {
			this.yxCouponId = row.yxCouponId
			this.yxCouponIndex = index
			this.dialogVisible125 = true
			this.formData126.couponName = ''
			this._findCouponListByParam(true)
		},
		changeYxCouponId(row, index) {
			let newRow = JSON.parse(JSON.stringify(row))
			this.formData108.giftCoupon[index] = Object.assign(
				this.formData108.giftCoupon[index],
				newRow
			)
		},
		addChannelRewardCoupon() {
			this.formData108.giftCoupon.push({
				couponName: '',
				couponCount: '',
				yxCouponId: '',
			})
		},
		querySearchAsync: async function (queryString = '', cb) {
			let {
				data: { resultCode, resultData },
			} = await findCouponListByParam({
				couponName: queryString,
				startIndex: 0,
				length: 20,
			})
			if (resultCode == 0) {
				resultData.YxCouponList.map((item) => {
					item.value = item.couponName
				})
				cb(resultData.YxCouponList)
			}
		},
		async init(flag) {
			this.loading = true
			let paramJson = this.findSearchParams105(flag)
			const {
				data: { resultCode, resultData },
			} = await findGiftListByParam(paramJson)

			if (resultCode == 0) {
				this.tableData105 = resultData.giftList
				this.page105.count = resultData.count
			} else {
				this.tableData105 = []
				this.page105.count = 0
			}
			this.loading = false
		},
		findSearchParams105(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page105.currentPage = 1
			}
			const paramJson = Object.assign(this.formData104, {
				length: this.page105.length,
				startIndex: (this.page105.currentPage - 1) * this.page105.length,
			})
			return paramJson
		},
	},
}
</script>
<style lang="scss" scoped>
.package-type-box {
	display: flex;
}
.coupon-item {
	margin: 10px 0;
	display: flex;
	.coupon-count {
		width: 120px;
	}
	span {
		margin: 0 10px;
	}
}
</style>

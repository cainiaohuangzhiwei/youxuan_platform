<template>
	<div>
		<yx-dialog
			:bottomBtn="bottomBtn"
			:visible.sync="localVisible"
			:before-close="resetForm"
			width="800px"
			title="新增优惠券"
		>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchItems"
				:formAction="searchAction"
			></yx-form>

			<div class="tips">注：仅展示能派发的优惠券</div>
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
		</yx-dialog>

		<ConferenceHallDialog
			:visible.sync="conferenceHallDialog"
			:conferenceHallRow="conferenceHallRow"
		>
		</ConferenceHallDialog>
		<DesignatedGoodsDialog
			:visible.sync="designatedGoodsDialog"
			:conferenceHallRow="conferenceHallRow"
		></DesignatedGoodsDialog>
	</div>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getSmallImg } from '@/utils/imageTool'
import { highPrecisionMul } from '@/utils/helper/common'
import { queryUoStrategyYxCouponInfoBatch } from '@/api/coupon'
import ConferenceHallDialog from './ConferenceHallDialog'
import DesignatedGoodsDialog from './DesignatedGoodsDialog'
import moment from 'moment'

export default {
	components: {
		YxDialog,
		YxForm,
		YxTable,
		ConferenceHallDialog,
		DesignatedGoodsDialog,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			define: false,
		},
		couponList: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			conferenceHallDialog: false,
			designatedGoodsDialog: false,
			getSmallImg: getSmallImg,
			selectCouponList: [],
			showLoading: false,
			currentTime: '',
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'yxCouponId',
					title: 'ID',
				},
				{
					type: 'string',
					dataIndex: 'couponName',
					title: '优惠券名称',
				},
				{
					type: 'string',
					dataIndex: 'typeExt',
					title: '优惠类型',
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
					dataIndex: 'expiryDateType',
					title: '有效期',
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
				},
				{
					type: 'map',
					dataIndex: 'usePermission',
					title: '使用权限',
					options: {
						未选择: 0,
						仅限店铺使用: 1,
						平台店铺使用: 2,
					},
				},
				{
					type: 'string',
					dataIndex: 'grantQuantity',
					title: '发放总量',
				},
				{
					title: '操作',
					type: 'action',
					fixed: 'right',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.updatedUserGroup(row)
							},
							customRender: (action, row) => {
								action.title = this.findIndex(row) ? '添加' : '移除'
								return action
							},
						},
					],
				},
			],
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveCallback()
					},
				},
				{
					title: '取消',
					click: () => {
						this.resetForm()
					},
				},
			],
			searchData: {
				couponName: '',
				addStartTime: '',
				addEndTime: '',
			},
			searchItems: [
				{
					type: 'input',
					title: '优惠券名称',
					dataIndex: 'couponName',
					placeholder: '模糊搜索',
				},
				{
					title: '创建时间:',
					type: 'datetimerange',
					dataIndex: ['addStartTime', 'addEndTime'],
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getData(true)
					},
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData()
				},
			},

			tableData: [],
		}
	},
	computed: {
		localVisible: {
			get() {
				return this.visible
			},
			set(val) {
				this.$emit('update:visible', val)
			},
		},
	},
	mounted() {},
	watch: {
		localVisible(val) {
			if (val) {
				this.selectCouponList = this.couponList
					? JSON.parse(JSON.stringify(this.couponList))
					: []
				this.getData()
			}
		},
	},
	methods: {
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			// this.$refs.form.$refs.YxForm.resetFields()
		},
		saveCallback() {
			// if (this.selectCouponList && this.selectCouponList.length > 1) {
			// 	return this.$message.warning('主推档期不能超过1个')
			// }
			this.$emit('saveCallback', this.selectCouponList)
			this.localVisible = false
		},
		findIndex(row) {
			// 判断是否已经添加用户
			let ids = this.selectCouponList.map((item) => {
				return item.yxCouponId
			})
			return ids.indexOf(row.yxCouponId) == -1
		},
		updatedUserGroup(row) {
			// 添加/移除用户
			const ids = this.selectCouponList.map((item) => {
				return item.yxCouponId
			})
			if (ids.indexOf(row.yxCouponId) == -1) {
				this.selectCouponList.push(row)
			} else {
				this.selectCouponList.splice(ids.indexOf(row.yxCouponId), 1)
			}
		},

		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = Object.assign(this.searchData, {
				pageSize: this.page.length,
				pageNum: this.page.currentPage,
			})
			return paramJson
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
		getData: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			const {
				data: { resultCode, resultData, total },
			} = await queryUoStrategyYxCouponInfoBatch(paramJson)
			if (resultCode == 0) {
				const couponList = resultData || []
				couponList.forEach((item) => {
					if (item.rangeExtInfo) {
						let rangeExtInfo = item.rangeExtInfo.split(',')
						if (item.range == 1) {
							item.rangeExtList = rangeExtInfo.map((x) => {
								return {
									yxCouponId: Number(x.split('-')[0]),
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
				this.tableData = couponList
				this.page.count = total
			} else {
				this.tableData = []
				this.page.count = 0
			}
			this.showLoading = false
		},
	},
}
</script>

<style lang="scss">
.tips {
	margin-bottom: 10px;
}
</style>

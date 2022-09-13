<template>
	<div>
		<el-dialog
			width="60%"
			title="选择优惠券"
			append-to-body
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<yx-form
				ref="form"
				:inline="true"
				:items="item"
				:data="searchData"
				:rules="funRules"
				:formAction="funAction"
			>
			</yx-form>

			<yx-table
				v-loading="loading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			>
			</yx-table>
			<div class="btn">
				<el-button type="primary" @click="saveBrand">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { newGetCouponList } from '@/api/receiveCouponCenter'
import moment from 'moment'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		itemInfo: {
			type: Array,
			default: () => [],
		},
	},

	components: {
		YxForm,
		YxTable,
	},

	data() {
		return {
			selectCoupon: {},
			item: [
				{
					title: '筛选',
					dataIndex: 'couponName',
					placeholder: '请输入优惠券名称',
				},
			],
			searchData: {
				couponName: '',
			},
			rowData: [],
			isAdd: 0,
			loading: false,
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'yxCouponId',
					title: '优惠券ID',
				},
				{
					type: 'string',
					dataIndex: 'couponName',
					title: '优惠券名称',
				},
				{
					type: 'string',
					dataIndex: 'effectiveTime',
					title: '优惠券有效期',
					width: 300,
					customRender: (row) => {
						if (row.expiryDateType == 1) {
							return (
								moment(row.startTime).format('YYYY-MM-DD HH:mm:ss') +
								'-' +
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
					type: 'action',
					dataIndex: 'add',
					title: '操作',
					actions: [
						{
							title: '选择',
							click: (row) => {
								this.editUserList(row)
							},
							customRender: (action, row) => {
								action.title =
									this.selectCoupon.yxCouponId == row.yxCouponId
										? '已选'
										: '选择'
								action.type =
									this.selectCoupon.yxCouponId == row.yxCouponId
										? 'success'
										: ''
								return action
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
					this._getCouponList()
				},
			},
			funAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getCouponList(true)
					},
				},
			],
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

	watch: {
		localVisible(val) {
			if (val) {
				this.selectCoupon = JSON.parse(JSON.stringify(this.itemInfo))
				this._getCouponList(true)
			}
		},
	},

	created() {
		this._getCouponList(true)
	},

	methods: {
		// 搜索条件
		findNewSearchParams(flag) {
			let paramJson = Object.assign(this.searchData, {
				pageSize: 10,
				pageNum: 0,
			})
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			paramJson.pageNum = this.page.currentPage
			return paramJson
		},
		// 获取优惠券列表
		async _getCouponList(flag) {
			// this.showLoading = true
			const paramJson = this.findNewSearchParams(flag)
			this.loading = true
			const res = await newGetCouponList(paramJson)
			const { resultCode, resultData } = res.data
			this.loading = false
			if (resultCode == 0) {
				this.tableData = resultData
				this.page.count = res?.data?.total || 0
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		resetForm() {
			this.localVisible = false
			this.$refs.form.$refs.YxForm.resetFields()
		},
		saveBrand() {
			this.$emit('fatherMethodInit', this.selectCoupon)
			this.localVisible = false
		},
		editUserList(row) {
			// 添加/移除用户
			this.selectCoupon = row
		},
	},
}
</script>

<style lang="scss" scoped>
.btn {
	text-align: right;
}
</style>

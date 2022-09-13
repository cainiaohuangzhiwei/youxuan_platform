<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
				><template #yxCouponIds>
					<el-input
						type="textarea"
						v-model="searchData.yxCouponIds"
						placeholder="批量搜索请换行或用逗号隔开"
					></el-input> </template
			></yx-form>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				></yx-table>
			</el-row>
			<EditDialog
				ref="form"
				:title="EditDialogTitle"
				:visible.sync="editDialog"
				:row="row"
				:dialogState="dialogState"
				@initTable="_receiveCouponCenterList"
			/>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import { receiveCouponCenterList, delCoupon } from '@/api/receiveCouponCenter'
import EditDialog from './components/EditDialog'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		EditDialog,
	},
	name: 'FormTable',

	data() {
		return {
			row: {},
			dialogState: false,
			state: '',
			showLoading: false,
			searchData: {
				couponName: '', // 优惠券名称
				status: '', // 优惠券状态
				yxCouponIds: '',
			},
			editDialog: false,
			EditDialogTitle: '',
			searchCfg: [
				{
					type: 'input',
					title: '优惠券名称',
					dataIndex: 'couponName',
				},
				{
					type: 'select',
					dataIndex: 'status',
					title: '状态',
					label: 'value',
					options: this.$store.state.app.constant.COUPON_CENTER_STATUS,
				},
				{
					title: '优惠券ID',
					type: 'custom',
					dataIndex: 'yxCouponIds',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._receiveCouponCenterList(true)
					},
				},
				{
					title: '添加优惠券',
					type: 'primary',
					click: () => {
						this.EditDialogTitle = '添加优惠券'
						this.row = {}
						this.editDialog = true
						this.dialogState = true
					},
				},
			],
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
					dataIndex: 'startTime',
					title: '可领取时间',
					width: 300,
					customRender: (row) => {
						return row.startTime && row.endTime
							? moment(row.startTime).format('YYYY-MM-DD HH:mm') +
									'~' +
									moment(row.endTime).format('YYYY-MM-DD HH:mm')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '领取状态',
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.row = row
								this.EditDialogTitle = '编辑优惠券'
								this.editDialog = true
								this.dialogState = false
							},
						},
						{
							title: '删除',
							click: (row) => {
								let _this = this
								_this.$confirm('确定删除？', '提示', {
									type: 'warning',
									async callback(action) {
										if (action === 'confirm') {
											_this._delCoupon([row.couponCenterId])
										}
									},
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
					this._receiveCouponCenterList()
				},
			},
		}
	},

	mounted() {
		this._receiveCouponCenterList()
	},

	methods: {
		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				startIndex: 0,
				length: 1,
				groupId: 2,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
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
			return paramJson
		},
		// 获取领券中心列表
		_receiveCouponCenterList: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await receiveCouponCenterList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.couponList
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		//删除优惠券
		_delCoupon: async function (couponCenterIds) {
			let paramJson = {
				couponCenterIds,
			}
			let {
				data: { resultCode },
			} = await delCoupon(paramJson)
			if (resultCode == 0) {
				this.$message.success('删除成功')
				this._receiveCouponCenterList()
			}
		},
	},
}
</script>

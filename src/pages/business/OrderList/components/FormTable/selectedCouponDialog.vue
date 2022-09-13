<template>
	<yx-dialog title="选择优惠券" :bottomBtn="bottomBtn" :visible.sync="visible">
		<div>
			<yx-form
				:inline="true"
				:data="dialogData"
				:items.sync="dialogCfg"
				:formAction="dialogAction"
			>
			</yx-form>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tialogColumns"
					:pagination="tialogPage"
					:data="tialogData"
				>
					<template slot="yxCouponId" slot-scope="scope">
						<el-radio
							v-model="rowData.yxCouponId"
							:label="scope.row.yxCouponId"
							@change="changeAnchor(scope.row)"
							>选择</el-radio
						>
					</template>
				</yx-table>
			</el-row>
		</div>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { findCouponListByParam } from '@/api/coupon'
export default {
	components: {
		YxDialog,
		YxForm,
		YxTable,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		// 机构
		selectedList: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			rowData: {
				yxCouponId: null,
			},
			showLoading: false,
			visible: false,
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveCoupon()
					},
				},
			],
			dialogData: {
				// 选择优惠券搜索条件
				couponName: '', // 优惠券名称
			},
			dialogCfg: [
				// 优惠券配置项
				{
					type: 'input',
					dataIndex: 'couponName',
					title: '筛选',
				},
			],
			dialogAction: [
				// 优惠券按钮
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getValidCouponPage(true)
					},
				},
			],
			tialogColumns: [
				// 优惠券配置项
				{
					type: 'custom',
					dataIndex: 'yxCouponId',
					title: '',
				},
				{
					type: 'string',
					dataIndex: 'couponName',
					title: '优惠券名称',
				},
				{
					type: 'string',
					dataIndex: 'grantCount',
					title: '库存量',
				},
				// {
				// 	type: 'action',
				// 	title: '操作',
				// 	width: '150',
				// 	actions: [
				// 		{
				// 			title: '选择',
				// 			click: (row) => {
				// 				this.saveCoupon(row)
				// 			},
				// 		},
				// 	],
				// },
			],
			tialogPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getValidCouponPage()
				},
			},
			tialogData: [],
		}
	},
	methods: {
		// 单选
		changeAnchor(row) {
			this.rowData = Object.assign({}, row)
		},
		saveCoupon() {
			if (!this.rowData.yxCouponId)
				return this.$message.warning('请选择优惠券！')
			this.selectedList.unshift(this.rowData)
			this.visible = false
		},
		findCouponIndex(row) {
			// 判断是否已经添加优惠券
			let selectCouponList = this.selectedList.map((item) => {
				return item.yxCouponId
			})
			return selectCouponList.indexOf(row.yxCouponId) == -1
		},
		findCounponParams(flag) {
			// 优惠券搜索条件
			let paramJson = Object.assign(this.dialogData, {
				startIndex: 0,
				length: 1,
				status: 1,
				isVoucherCenter: 1,
				shelfState: 2,
			})
			// 每页的加载数据长度
			paramJson.length = this.tialogPage.length
			// 当前页的条数开始
			if (flag) {
				this.tialogPage.currentPage = 1
			}
			paramJson.startIndex =
				(this.tialogPage.currentPage - 1) * this.tialogPage.length
			return paramJson
		},
		async _getValidCouponPage(flag) {
			// 优惠券列表
			this.showLoading = true
			let paramJson = this.findCounponParams(flag)
			let {
				data: { resultCode, resultData },
			} = await findCouponListByParam(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tialogData = resultData.YxCouponList
				this.tialogPage.count = resultData.count
			} else {
				this.tialogPage.count = 0
				this.tialogData = []
			}
		},
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
			if (this.visible) {
				this._getValidCouponPage(true)
			} else {
				this.rowData = {
					yxCouponId: null,
				}
			}
		},
		dialogVisible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.visible = newVlaue
			}
		},
	},
}
</script>

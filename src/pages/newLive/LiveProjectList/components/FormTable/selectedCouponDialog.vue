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
				</yx-table>
			</el-row>
		</div>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getValidCouponPage } from '@/api/livePlan'
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
					type: 'string',
					dataIndex: 'couponName',
					title: '优惠券名称',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.editCouponList(row)
							},
							customRender: (action, row) => {
								action.title = this.findCouponIndex(row) ? '添加' : '移除'
								return action
							},
						},
					],
				},
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
		saveCoupon() {
			this.visible = false
		},
		editCouponList(row) {
			// 添加/移除优惠券
			let selectCouponList = this.selectedList.map((item) => {
				return item.yxCouponId
			})
			if (selectCouponList.indexOf(row.yxCouponId) == -1) {
				this.selectedList.push(row)
			} else {
				this.selectedList.splice(selectCouponList.indexOf(row.yxCouponId), 1)
			}
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
			} = await getValidCouponPage(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tialogData = resultData.list
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

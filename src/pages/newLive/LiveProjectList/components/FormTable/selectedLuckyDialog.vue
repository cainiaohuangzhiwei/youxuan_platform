<template>
	<yx-dialog
		title="选择抽奖活动"
		:bottomBtn="bottomBtn"
		:visible.sync="visible"
	>
		<div>
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
import YxTable from '@wg-vue-materials/yx-table'
import { lotteryListWithFilter } from '@/api/lotteryTools'
export default {
	components: {
		YxDialog,
		YxTable,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		// 直播开始时间
		liveStartTime: {
			type: String,
			default: '',
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
			tialogColumns: [
				// 优惠券配置项
				{
					type: 'string',
					dataIndex: 'lotteryActivityName',
					title: '活动名称',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.editLotteryList(row)
							},
							customRender: (action, row) => {
								action.title = this.findLotteryIndex(row) ? '添加' : '移除'
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
					this._lotteryListWithFilter()
				},
			},
			tialogData: [],
		}
	},
	methods: {
		saveCoupon() {
			this.visible = false
		},
		editLotteryList(row) {
			// 添加/移除抽奖活动
			let selectLotteryList = this.selectedList.map((item) => {
				return item.lotteryActivityId
			})
			if (selectLotteryList.indexOf(row.lotteryActivityId) == -1) {
				this.selectedList.push(row)
			} else {
				this.selectedList.splice(
					selectLotteryList.indexOf(row.lotteryActivityId),
					1
				)
			}
		},
		findLotteryIndex(row) {
			// 判断是否已经添加抽奖活动
			let selectLotteryList = this.selectedList.map((item) => {
				return item.lotteryActivityId
			})
			return selectLotteryList.indexOf(row.lotteryActivityId) == -1
		},
		findParams(flag) {
			// 抽奖活动搜索条件
			let paramJson = {
				lotteryStateList: [0],
				startTime: this.liveStartTime,
				startIndex: 0,
				length: 10,
			}
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
		async _lotteryListWithFilter(flag) {
			// 抽奖活动列表
			this.showLoading = true
			let paramJson = this.findParams(flag)
			let {
				data: { resultCode, resultData },
			} = await lotteryListWithFilter(paramJson)
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
				this._lotteryListWithFilter(true)
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

<template>
	<yx-dialog
		title="选择品牌"
		:bottomBtn="bottomBtn"
		:visible.sync="visible"
		@before-close="resetForm"
	>
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
					<template slot="saleState" slot-scope="scope">
						<div v-html="findSaleStateString(scope.row)"></div>
					</template>
					<template slot="goodsGroupId" slot-scope="scope">
						<el-radio
							v-model="selectedGoodsGroup.goodsGroupId"
							:label="scope.row.goodsGroupId"
							@change="changeGoodsGroup(scope.row)"
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
import { getConstantValueByKey } from '@/utils/helper/common'
import { getGoodsGroupListByConditionForCMS } from '@/api/goodsGroup'
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
		itemInfo: {
			type: Object,
			default: () => ({}),
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
						this.saveGroup()
					},
				},
			],
			selectedGoodsGroup: {},
			tialogPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getGoodsGroupListByConditionForCMS()
				},
			},
			tialogData: [],
			currentTime: null,
			tialogColumns: [
				// 品牌列表项
				{
					type: 'string',
					dataIndex: 'groupName',
					title: '分组名称',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '品牌名称',
				},
				{
					type: 'string',
					dataIndex: 'sourceType',
					title: '渠道',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.SOURCE_NAME,
							row.sourceType,
							'-',
							'sourceType'
						)
					},
				},
				{
					type: 'data',
					dataIndex: 'saleStartTime',
					title: '售卖时间',
				},
				{
					type: 'custom',
					dataIndex: 'saleState',
					title: '售卖状态',
				},
				{
					type: 'string',
					dataIndex: 'goodsCount',
					title: '商品数',
				},
				{
					type: 'custom',
					dataIndex: 'goodsGroupId',
				},
			],
			dialogData: {
				// 搜索品牌参数
				groupNameKeyword: '',
			},
			dialogCfg: [
				// 品牌搜索项
				{
					type: 'input',
					dataIndex: 'groupNameKeyword',
					title: '筛选',
				},
			],
			dialogAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getGoodsGroupListByConditionForCMS(true)
					},
				},
			],
		}
	},
	methods: {
		saveGroup() {
			this.$emit('update:itemInfo', this.selectedGoodsGroup)
			this.visible = false
			this.selectedGoodsGroup = {}
		},
		changeGoodsGroup(row) {
			this.selectedGoodsGroup = Object.assign({}, row)
		},
		findSaleStateString(row) {
			// 活动状态值
			let stateString, color
			if (this.currentTime < row.saleStartTime) {
				stateString = '未开始'
				color = '#c41717'
			} else if (
				this.currentTime >= row.saleStartTime &&
				this.currentTime <= row.saleEndTime
			) {
				color = '#4498E0'
				stateString = '进行中'
			} else if (this.currentTime > row.saleEndTime) {
				stateString = '已结束'
				color = '#b0b0b0'
			}
			return `<div><span style="width:8px;height:8px;background:${color};margin-right: 10px;display: inline-block;"></span><span style="color: ${color};">${stateString}</span></div>`
			// return `<el-tag type="${type}">${stateString}</el-tag>`
		},
		findGoodsGroupListByConditionForCMSParams(flag) {
			// 品牌列表搜索参数
			let paramJson = Object.assign(this.dialogData, {
				startIndex: 0,
				organizationId:
					(this.$store.state.user.userInfo &&
						this.$store.state.user.userInfo.organizationId) ||
					'',
				goodsGroupStateList: ['1', '2'],
				goodsType: 1,
				groupId: 2,
				gcategoryList: ['1'],
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
		async _getGoodsGroupListByConditionForCMS(flag) {
			// 品牌列表
			this.showLoading = true
			let paramJson = this.findGoodsGroupListByConditionForCMSParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getGoodsGroupListByConditionForCMS(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.currentTime = resultData.currentTime
				this.tialogData = resultData.goodsGroupList
				this.tialogPage.count = resultData.goodsGroupCount
			} else {
				this.tialogPage.count = 0
				this.tialogData = []
			}
		},
		resetForm() {
			this.$emit('closeDialog', false)
		},
	},
	watch: {
		// itemInfo(newVlaue) {
		// 	this.selectedGoodsGroup = newVlaue
		// },
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
			if (this.visible) {
				this._getGoodsGroupListByConditionForCMS(true)
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

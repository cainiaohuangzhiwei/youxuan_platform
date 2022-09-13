<template>
	<yx-dialog :title="title" :bottomBtn="bottomBtn" :visible.sync="visible">
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
					<template slot="goodsName" slot-scope="scope">
						<div>
							<div>货号：{{ scope.row.goodsNumber }}</div>
							<div>{{ scope.row.goodsName }}</div>
						</div>
					</template>
					<template slot="goodsSpecId" slot-scope="scope">
						<el-radio
							v-model="selectedGoodsGroup.goodsSpecId"
							:label="scope.row.goodsSpecId"
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
import { getYouxuanGoodsList } from '@/api/goodsList'
import { getBigImg } from '@/utils/imageTool'
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
		groups: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			title: '选择商品',
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
					this._getYouxuanGoodsList()
				},
			},
			tialogData: [],
			currentTime: null,
			tialogColumns: [
				// 品牌列表项
				{
					type: 'image',
					dataIndex: 'goodsDefaultImage',
					class: 'poster_img',
					title: '商品图',
				},
				{
					type: 'custom',
					dataIndex: 'goodsName',
					title: '商品名称',
				},
				{
					type: 'string',
					dataIndex: 'scateName',
					title: '商品分类',
					customRender: (row) => {
						return row.scateName ? row.scateName : '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '品牌',
				},
				{
					type: 'string',
					dataIndex: 'supplyPrice',
					title: '供货价',
					customRender: (row) => {
						return row.supplyPrice ? '￥' + row.supplyPrice : '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'lowestPrice  ',
					title: '建议零售价',
					customRender: (row) => {
						if (row.lowestPrice && row.highestPrice) {
							return '￥' + row.lowestPrice + '~' + row.highestPrice
						} else if (row.lowestPrice) {
							return '￥' + row.lowestPrice
						} else if (row.highestPrice) {
							return '￥' + row.highestPrice
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'marketPrice',
					title: '市场价',
					customRender: (row) => {
						return row.marketPrice ? '￥' + row.marketPrice : '-'
					},
				},
				{
					type: 'custom',
					dataIndex: 'goodsSpecId',
				},
			],
			dialogData: {
				// 搜索品牌参数
				goodsName: '',
			},
			dialogCfg: [
				// 品牌搜索项
				{
					type: 'input',
					dataIndex: 'goodsName',
					title: '筛选',
				},
			],
			dialogAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getYouxuanGoodsList(true)
					},
				},
			],
		}
	},
	methods: {
		saveGroup() {
			console.log(
				this.selectedGoodsGroup,
				'this.selectedGoodsGroupthis.selectedGoodsGroup'
			)
			this.$emit('update:itemInfo', this.selectedGoodsGroup)
			this.$emit('selectedMethods', this.selectedGoodsGroup)
			this.visible = false
		},
		changeGoodsGroup(row) {
			this.selectedGoodsGroup = Object.assign({}, row)
		},
		findGoodsGroupListByConditionForCMSParams(flag) {
			// 品牌列表搜索参数
			let paramJson = Object.assign(this.dialogData, {
				goodsGroupIdList: [this.groups.goodsGroupId],
				brandIdList: [this.groups.brandId],
				viewType: 3,
				shelfState: 2,
				startIndex: 0,
				groupId: 2,
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
		async _getYouxuanGoodsList(flag) {
			// 品牌列表
			this.showLoading = true
			let paramJson = this.findGoodsGroupListByConditionForCMSParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getYouxuanGoodsList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				resultData.goodsList.map((item) => {
					item.goodsDefaultImage = getBigImg(item.goodsDefaultImage)
				})
				this.tialogData = resultData.goodsList
				this.tialogPage.count = resultData.goodsCount
			} else {
				this.tialogPage.count = 0
				this.tialogData = []
			}
		},
	},
	watch: {
		itemInfo(newVlaue) {
			this.selectedGoodsGroup = newVlaue
		},
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
			if (this.visible) {
				this._getYouxuanGoodsList(true)
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

<style lang="scss" scoped>
.poster_img {
	width: 50px;
	height: 50px;
}
</style>

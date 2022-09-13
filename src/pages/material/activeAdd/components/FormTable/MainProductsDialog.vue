<template>
	<div class="mainProdu">
		<yx-dialog
			:bottomBtn="bottomBtn"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<yx-form
				:inline="true"
				:data="dialogData"
				:items="dialogCfg"
				:formAction="dialogAction"
			></yx-form>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tialogColumns"
					:pagination="tialogPage"
					:data="tialogData"
				>
					<template slot="goodsDefaultImage" slot-scope="scope">
						<div class="slot">
							<div>
								<img
									class="goods_img"
									:src="getSmallImg(scope.row.goodsDefaultImage)"
									alt=""
								/>
							</div>
							<div style="text-align: left">
								<div class="goodsName">{{ scope.row.goodsName }}</div>
								<div>
									<el-tag :type="shelfStateMapTag[handleGoodsTag(scope.row)]">{{
										handleGoodsTag(scope.row)
									}}</el-tag>
									<span class="number">货号：{{ scope.row.goodsNumber }}</span>
								</div>
							</div>
						</div>
					</template>
				</yx-table>
			</el-row>
		</yx-dialog>
	</div>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getSmallImg } from '@/utils/imageTool'
import { goodsList } from '@/api/newMaterial'
export default {
	components: {
		YxDialog,
		YxForm,
		YxTable,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			define: false,
		},
		mainProductsRow: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			getSmallImg: getSmallImg,
			shelfStateMapTag: {
				在售: 'warning',
				待售: 'info',
				下架: 'info',
				推荐: 'danger',
			},
			selectGoodsList: [],
			showLoading: false,
			currentTime: '',
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveProduct()
					},
				},
			],
			dialogData: {
				keyWord: '',
			},
			dialogCfg: [
				{
					type: 'input',
					title: '商品货号',
					dataIndex: 'keyWord',
				},
			],
			dialogAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._goodsList(true)
					},
				},
			],
			tialogColumns: [
				{
					type: 'custom',
					dataIndex: 'goodsDefaultImage',
					title: '商品信息',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.editUserList(row)
							},
							customRender: (action, row) => {
								action.title = this.findIndex(row) ? '添加' : '移除'
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
					this._goodsList()
				},
			},
			tialogData: [],
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
				this.selectGoodsList = JSON.parse(JSON.stringify(this.mainProductsRow))
				this._goodsList()
			}
		},
	},
	methods: {
		handleGoodsTag(row = {}) {
			let title =
				row.goodsShelfState == 2
					? row.goodsIsSale == 1
						? '在售'
						: '待售'
					: '下架'
			return title
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			// this.$refs.form.$refs.YxForm.resetFields()
		},
		saveProduct() {
			if (this.selectGoodsList && this.selectGoodsList.length > 5) {
				return this.$message.warning('主推商品不能超过5个')
			}
			this.$emit('saveProduct', this.selectGoodsList)
			this.localVisible = false
		},
		findIndex(row) {
			// 判断是否已经添加用户
			let ids = this.selectGoodsList.map((item) => {
				return item.goodsId
			})
			return ids.indexOf(row.goodsId) == -1
		},
		editUserList(row) {
			// 添加/移除用户
			let ids = this.selectGoodsList.map((item) => {
				return item.goodsId
			})
			if (ids.indexOf(row.goodsId) == -1) {
				this.selectGoodsList.push(row)
			} else {
				this.selectGoodsList.splice(ids.indexOf(row.goodsId), 1)
			}
		},
		findUserParams(flag) {
			// 用户搜索条件
			let paramJson = {
				keyWord: this.dialogData.keyWord,
				pageNum: 1,
				pageSize: 10,
			}
			// 每页的加载数据长度
			paramJson.pageSize = this.tialogPage.length
			// 当前页的条数开始
			if (flag) {
				this.tialogPage.currentPage = 1
			}
			paramJson.pageNum = this.tialogPage.currentPage
			return paramJson
		},
		async _goodsList(flag) {
			// 用户列表
			this.showLoading = true
			let paramJson = this.findUserParams(flag)
			let {
				data: { resultCode, resultData },
			} = await goodsList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tialogData = resultData.records
				this.tialogPage.count = resultData.total
			} else {
				this.tialogPage.count = 0
				this.tialogData = []
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.slot {
	display: flex;
	align-items: center;
	padding-left: 30px;
}
.goods_img {
	width: 60px;
	height: 60px;
	margin-right: 10px;
	line-height: 155px;
}
.goodsName {
	text-align: left;
}
.number {
	margin-left: 6px;
}
</style>

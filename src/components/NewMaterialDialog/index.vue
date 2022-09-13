/* eslint-disable no-dupe-else-if */
<template>
	<div>
		<el-dialog
			width="800px"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<el-form ref="form" :inline="true" :model="form" label-width="80px">
				<el-form-item label="会场">
					<el-autocomplete
						v-model="form.value"
						:fetch-suggestions="querySearchAsync"
						@select="handleSelect"
						@change="handleChange"
					></el-autocomplete>
				</el-form-item>
				<el-form-item label="商品货号">
					<el-input v-model="form.keyword"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleQuery">查询</el-button>
				</el-form-item>
			</el-form>
			<el-row>
				<yx-table
					v-loading="tableLoading"
					:highlightCcurrentRow="true"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
					<template slot="goodsId" slot-scope="scope">
						<el-radio
							v-model="goodsRow.goodsId"
							@change="changeRow(scope.row)"
							:label="scope.row.goodsId"
							>选择</el-radio
						>
					</template>
					<template slot="goodsDefaultImage" slot-scope="scope">
						<div class="slot">
							<div>
								<img
									class="goods_img"
									:src="getSmallImg(scope.row.goodsDefaultImage)"
									alt=""
								/>
							</div>
							<div>
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
				<div class="bs">
					<el-button type="primary" @click="handleFix">确定</el-button>
					<el-button @click="resetForm()">取消</el-button>
				</div>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
import YxTable from '@wg-vue-materials/yx-table'
import { getSmallImg } from '@/utils/imageTool'
import { getBrandListConfiguration } from '@/api/newMaterial'
import { getYouxuanGoodsList } from '@/api/goodsList'
import { retainDecimalPoint } from '@/utils/helper/common'
export default {
	props: {
		visible: {
			type: Boolean,
			define: false,
		},
		newMaterialRow: {
			define: false,
			default: () => {},
		},
	},

	components: {
		YxTable,
	},

	data() {
		return {
			goodsRow: {},
			tableLoading: false,
			addMaterialDialog: false,
			addMaterialRow: {},
			retainDecimalPoint: retainDecimalPoint,
			shelfStateMapTag: {
				在售: 'warning',
				待售: 'info',
				下架: 'info',
				推荐: 'danger',
			},
			getSmallImg: getSmallImg,
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getYouxuanGoodsList()
				},
			},
			tableData: [],
			tableColumns: [
				{
					type: 'custom',
					dataIndex: 'goodsId',
				},
				{
					type: 'custom',
					width: 400,
					dataIndex: 'goodsDefaultImage',
					title: '商品信息',
				},
				{
					dataIndex: 'dailyPrice',
					title: '售价',
					customRender: (row) => {
						if (row.dailyPrice) {
							return `￥${retainDecimalPoint(row.dailyPrice, 2)}`
						} else {
							return '-'
						}
					},
				},
			],
			form: {
				value: '',
				keyword: '',
				brandId: '',
			},
		}
	},
	watch: {
		localVisible(val) {
			if (val) {
				this.form.value = ''
				this.form.keyword = ''
				this.form.brandId = ''
				this.goodsRow = {}
				this.page.count = 0
				this.page.length = 10
				this.tableData = []
			}
		},
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
	methods: {
		changeRow(row) {
			this.goodsRow = Object.assign({}, row)
		},
		findSearchParams123(val) {
			// 当前页的条数开始
			// this.page.currentPage = 1
			const paramJson = {
				keywordList: [val],
				length: 20,
				supplierAccountNumberIds: [],
				selectionTag: '',
				// goodsGroupStateList: ['1', '2', '3'],
				// goodsType: 1,
				// gcategoryList: ['1'],
				startIndex: 0,
			}
			return paramJson
		},
		//远程搜索
		async querySearchAsync(value = '', cb) {
			//这里是需要上传给后端的参数
			let params = this.findSearchParams123(value)
			let {
				data: { resultCode, resultData },
			} = await getBrandListConfiguration(params)
			if (resultCode == 0) {
				resultData.brandList.map((item) => {
					item.value = item.brandName
				})
				cb(resultData.brandList)
			} else {
				this.$message.error('接口错误')
			}
		},
		handleChange() {
			this.form.brandId = ''
		},
		handleSelect(item) {
			this.form.brandId = item.brandId
		},
		handleQuery() {
			this.goodsRow = {}
			this._getYouxuanGoodsList(true)
		},
		async _getYouxuanGoodsList(flag) {
			let params = this.findSearchParams(flag)
			this.tableLoading = true
			let {
				data: { resultCode, resultData },
			} = await getYouxuanGoodsList(params)
			this.tableLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.goodsList || []
				this.page.count = resultData.goodsCount
			}
		},
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = {
				viewType: '3',
				sortField: 1,
				brandIdList: [this.form.brandId],
				keyword: this.form.keyword,
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			}
			return paramJson
		},
		handleFix() {
			if (!this.goodsRow.goodsId) {
				return this.$message.warning('请选择对应商品')
			} else {
				this.localVisible = false
				this.$emit('Refresh', this.goodsRow)
			}
		},
		// 商品规格-处理显示商品状态
		handleGoodsTag(row = {}) {
			let title =
				row.shelfState == 2 ? (row.isSales == 1 ? '在售' : '待售') : '下架'
			return title
		},
		saveBrand(val) {
			this.selectGroupList = val
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},
	},
}
</script>

<style lang="scss" scoped>
.slot {
	text-align: left;
	display: flex;
	align-items: center;
	.goods_img {
		width: 60px;
		height: 60px;
		margin-right: 10px;
		line-height: 155px;
	}
	.goodsName {
		width: 300px;
		min-width: 300px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
	}
	.number {
		margin-right: 10px;
	}

	.goods_name {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
	}
}
.bs {
	text-align: center;
	margin-top: 20px;
}
</style>

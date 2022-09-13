<template>
	<basic-container>
		<div class="goods" v-loading="loading">
			<!-- 商品货号查询 -->
			<yx-form
				v-loading="eLoading"
				ref="form"
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			>
				<template #brandName>
					<el-select
						v-model="searchData.brandName"
						filterable
						remote
						reserve-keyword
						placeholder="请输入会场名称搜索"
						:remote-method="_getBrandList"
						:loading="listLoading"
						style="width: 100%"
						@focus="_getBrandList(e, 'focusAction')"
						@change="handleBrandName"
					>
						<el-option
							v-for="item in brandList"
							:key="item.brandId"
							:label="item.brandName"
							:value="item.brandName"
						>
						</el-option>
					</el-select>
				</template>
				<template #keyword>
					<div>
						<el-input
							type="textarea"
							placeholder="请输入货号搜索,货号与货号之间使用逗号隔开或者换行"
							v-model="searchData.keyword"
						/>
					</div>
				</template>
			</yx-form>
			<yx-table :columns="tableColumns" :pagination="page" :data="tableData">
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
							<p>
								<span class="number">货号：{{ scope.row.goodsNumber }}</span>
								<el-tag :type="shelfStateMapTag[handleGoodsTag(scope.row)]">{{
									handleGoodsTag(scope.row)
								}}</el-tag>
							</p>
							<p class="goods_name">{{ scope.row.goodsName }}</p>
						</div>
					</div>
				</template>
			</yx-table>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getSmallImg } from '@/utils/imageTool'
import {
	getGoodsAttributeList,
	exportGoodsAttributeInfo,
} from '@/api/goodsList'
import { getBrandList } from '@/api/brand'
import { downloadFile } from '@/utils/helper/common'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			listLoading: false,
			loading: false,
			eLoading: false,
			brandList: [],
			shelfStateMapTag: {
				在售: 'warning',
				待售: 'info',
				下架: 'info',
				推荐: 'danger',
			},
			getSmallImg,
			searchData: {
				keyWord: '',
				brandName: '',
			},
			searchCfg: [
				{
					title: '会场名称',
					type: 'custom',
					dataIndex: 'brandName',
					placeholder: '请输入会场名称',
				},
				{
					title: '商品货号',
					type: 'textarea',
					dataIndex: 'keyword',
					placeholder: '请输入货号搜索,货号与货号之间使用逗号隔开或者换行',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getYouxuanGoodsList(true)
					},
				},
				{
					title: '重置',
					click: () => {
						this.$refs.form.$refs.YxForm.resetFields()
						this.tableData = []
						this.brandList = []
						this.findSearchParams(true)
					},
				},
				{
					title: '导出',
					type: 'primary',
					click: () => {
						this.handleBatchForbidden()
					},
				},
			],
			tableColumns: [
				{
					width: 300,
					type: 'custom',
					dataIndex: 'goodsDefaultImage',
					title: '商品',
				},
				{
					dataIndex: 'brandName',
					title: '会场名称',
				},
				{
					dataIndex: 'supplierName',
					title: '商家',
				},
				{
					dataIndex: 'goodsCategoryNames',
					title: '商品类目',
				},
				{
					dataIndex: 'attributeValue',
					title: '是否有商品属性',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getYouxuanGoodsList()
				},
			},
			tableData: [],
		}
	},

	methods: {
		handleBrandName() {
			// this.$refs.form.$refs.YxForm.clearValidate('brandName')
			this._getYouxuanGoodsList(true)
		},
		// 获取基础属性列表
		async _getBrandList(queryString, type) {
			const paramJson = {
				startIndex: 0,
				length: 50,
				keyword: queryString,
			}
			if (type === 'focusAction' && this.brandList.length > 0) {
				return
			}
			this.listLoading = true
			const {
				data: { resultCode, resultData },
			} = await getBrandList(paramJson)
			this.listLoading = false
			if (resultCode == 0) {
				let brandList = resultData.brandList || []
				this.brandList = this.unique(brandList)
			}
		},
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const searchData = this.handleNoParams()
			const paramsData = JSON.parse(JSON.stringify(this.searchData))
			const paramJson = Object.assign(paramsData, {
				keyword: searchData.keyword,
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})

			return paramJson
		},
		unique(arr) {
			if (!Array.isArray(arr)) {
				return
			}
			arr = arr.sort()
			let arrry = arr[0] ? [arr[0]] : []
			for (let i = 1; i < arr.length; i++) {
				if (arr[i].brandName !== arr[i - 1].brandName) {
					arrry.push(arr[i])
				}
			}
			return arrry
		},
		// 商品规格-处理显示商品状态
		handleGoodsTag(row = {}) {
			let title =
				row.shelfState == 2 ? (row.isSales == 1 ? '在售' : '待售') : '下架'
			return title
		},
		// 处理货号参数
		handleNoParams() {
			const searchData = JSON.parse(JSON.stringify(this.searchData))
			if (searchData.keyword) {
				searchData.keyword = searchData.keyword.replace(/\n/g, ',')
				searchData.keyword = searchData.keyword.replace(/\s*/g, '') //商品货号
			}

			return searchData
		},
		async _getYouxuanGoodsList(flag) {
			if (!this.searchData.brandName) {
				this.$message.error('请填写会场名称！')
				return
			}
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await getGoodsAttributeList(paramJson)
			if (resultCode == 0) {
				this.tableData = resultData.goodsList || []
				this.page.count = resultData.goodsCount
			} else {
				this.page.count = 0
				this.tableData = []
			}

			this.loading = false
		},
		//批量导出
		async handleBatchForbidden() {
			if (!this.searchData.brandName) {
				this.$message.error('请填写会场名称！')
				return
			}
			const paramJson = this.findSearchParams()
			this.eLoading = true
			const { data } = await exportGoodsAttributeInfo(paramJson)
			this.eLoading = false
			downloadFile(data, '商品列表.xlsx')
		},
	},
}
</script>

<style lang="scss" scoped>
.goods {
	&__no {
		margin-top: -10px;

		.attribute {
			color: #ff0000;
		}
	}

	.search {
		position: relative;

		.venue {
			position: relative;

			.feature {
				position: absolute;
				right: 0;
				top: -34px;
			}
		}

		.checked {
			padding: 0 10px;
			border: 1px solid #e6e6e6;

			&__btn {
				text-align: center;
			}
		}

		.view {
			position: absolute;
			right: 0;
			bottom: 18px;
		}
	}

	.slot {
		text-align: left;
		display: flex;

		.goods_img {
			width: 60px;
			height: 60px;
			margin-right: 10px;
			line-height: 155px;
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

	.active {
		color: #4498e0;
		cursor: pointer;
		line-height: 15px;
	}

	.bedeck {
		height: 150px;
		padding: 10px;
		overflow-y: auto;
		border: 1px solid #e6e6e6;
		border-bottom: none;
	}
}
</style>

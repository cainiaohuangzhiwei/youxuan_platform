/* eslint-disable no-unused-vars */
<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
				:rules="funRules"
				ref="form"
			>
				<template #supplierAccountNumberId>
					<el-select
						v-model="searchData.supplierAccountNumberId"
						filterable
						remote
						clearable
						placeholder="请输入商家名称"
						value-key="supplierAccountNumberId"
						:remote-method="_findSupplierAccountNumberForList"
						@change="handleChangeSupplierAccountNumber"
						><i class="el-icon-search el-input__icon" slot="prefix"> </i>
						<el-option
							v-for="item in formDataSupplierAccountNumberList"
							:key="item.supplierAccountNumberId"
							:label="item.supplierName"
							:value="item.supplierAccountNumberId"
						>
						</el-option>
					</el-select>
				</template>
			</yx-form>

			<el-row>
				<yx-table
					v-loading="loading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
					:selectionChange="selectionChange"
				>
					<template slot="goodsDetail" slot-scope="scope">
						<div class="slot active">
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

									<el-tag type="danger">{{ handleGoodsTag(scope.row) }}</el-tag>
								</p>
								<p class="goods_name">{{ scope.row.goodsName }}</p>
							</div>
						</div>
					</template>
					<template slot="hoverShow" slot-scope="scope">
						<echarts-popover :options="scope.row"></echarts-popover>
					</template>
				</yx-table>
			</el-row>
		</div>
	</basic-container>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import EchartsPopover from '@/components/EchartsPopover'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { numberFormat } from '@/utils/helper/common'
import { queryGoodsPriceComparison } from '@/api/supplierPrice'
import { findSupplierAccountNumberForList } from '@/api/yhtPlusCmsSupplierAccountNumber'
import { getSmallImg } from '@/utils/imageTool'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		EchartsPopover,
	},
	name: 'FormTable',

	data() {
		return {
			getSmallImg: getSmallImg,
			numberFormat: numberFormat,
			searchData: {
				supplierAccountNumberId: '',
				shelfState: 0,
				isSales: 0,
				goodsName: '',
				goodsNumber: '',
			},
			// 搜索商家数据源
			formDataSupplierAccountNumberList: [],
			loading: false,
			selectionData: [],
			searchCfg: [
				{
					title: '商家',
					type: 'custom',
					dataIndex: 'supplierAccountNumberId',
				},
				{
					type: 'select',
					title: '商品状态',
					dataIndex: 'shelfState',
					label: 'value',
					options: this.$store.state.app.constant.COMPARISON_GOOD_STATUS,
					// change: () => {
					// 	this.init()
					// },
				},
				{
					type: 'select',
					title: '销售状态',
					dataIndex: 'isSales',
					label: 'value',
					options: this.$store.state.app.constant.COMPARISON_SALE_STATUS,
					// change: () => {
					// 	this.init()
					// },
				},
				{
					title: '商品名称',
					type: 'input',
					dataIndex: 'goodsName',
					placeholder: '请输入商品名称',
					// change: () => {
					// 	this.init()
					// },
				},
				{
					type: 'input',
					title: '商品货号',
					dataIndex: 'goodsNumber',
					placeholder: '请输入商品货号',
					// change: () => {
					// 	this.init()
					// },
				},
			],
			funRules: {
				supplierAccountNumberId: [
					{ required: true, message: '请选择商家!', trigger: 'blur' },
				],
			},
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init(true)
					},
				},
				{
					title: '重置',
					isClear: true,
				},
			],
			tableData: [],
			tableColumns: [
				{
					width: 300,
					type: 'custom',
					dataIndex: 'goodsDetail',
					title: '商品信息',
				},

				{
					dataIndex: 'supplierName',
					title: '商家',
				},
				{
					type: 'amount',
					dataIndex: 'priceMin',
					title: '历史最低售价',
				},
				{
					type: 'amount',
					dataIndex: 'priceMax',
					title: '历史最高售价',
				},
				{
					width: 120,
					type: 'custom',
					dataIndex: 'hoverShow',
					title: '操作',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
		}
	},

	created() {
		//this.init(true)
	},

	methods: {
		getType(val) {
			let type
			switch (val) {
				case 0:
					type = '平稳'
					break
				case 1:
					type = '上升'
					break
				case 2:
					type = '下降'
					break

				default:
					type = '---'
					break
			}
			return type
		},
		// 获取商家列表
		async _findSupplierAccountNumberForList(query) {
			if (query !== '') {
				const paramJson = {
					startIndex: 0,
					length: 20,
					keyword: query,
				}
				const {
					data: { resultCode, resultData },
				} = await findSupplierAccountNumberForList(paramJson)

				if (resultCode == 0) {
					this.formDataSupplierAccountNumberList = resultData.list || []
					return
				}
			}
			this.formDataSupplierAccountNumberList = []
		},
		// 选择商家
		handleChangeSupplierAccountNumber() {
			this.$refs.form.$refs.YxForm.clearValidate('supplierAccountNumberId')
		},
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			console.log('flag', flag)
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.searchData, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})

			return paramJson
		},
		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			let {
				data: {
					resultCode,
					resultData: { goodsList = [], goodsCount = 0 },
				},
			} = await queryGoodsPriceComparison(paramJson)
			this.loading = false
			if (resultCode == 0) {
				this.tableData = goodsList
				this.page.count = goodsCount
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		// 商品规格-处理显示商品状态
		handleGoodsTag(row = {}) {
			let title
			switch (row.isSales) {
				case 1:
					title = '待售'
					break
				case 2:
					title = '在售'
					break
				default:
					title = '下架'
					break
			}
			return title
		},
	},
}
</script>

<style lang="scss" scoped>
.red-color {
	font-size: 24px;
	color: #d51a21;
	vertical-align: middle;
}
.green-color {
	font-size: 24px;
	color: #407434;
	vertical-align: middle;
}
.yellow-color {
	font-size: 24px;
	color: #f4d000;
	vertical-align: middle;
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
</style>

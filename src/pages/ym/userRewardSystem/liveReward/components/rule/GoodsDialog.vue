<template>
	<el-dialog
		width="800px"
		title="添加商品"
		append-to-body
		:close-on-click-modal="false"
		:visible.sync="localVisible"
		:before-close="resetForm"
		:open="open"
	>
		<YxForm
			ref="formGoods"
			:inline="true"
			:items="item"
			:data="searchData"
			:formAction="formAction"
		>
			<template #supplierName>
				<el-input
					class="supplier"
					v-model="searchData.supplierName"
					placeholder="请选择商家"
					@focus="handleSupplier"
				>
					<el-button
						slot="append"
						icon="el-icon-more"
						@click="handleSupplier"
					/>
				</el-input>
			</template>
		</YxForm>

		<el-table
			border
			v-loading="loading"
			ref="multipleGoodsTable"
			:data="tableData"
			tooltip-effect="dark"
			:row-key="getRowKeys"
			@select="handleSelect"
			@select-all="selectAll"
		>
			<el-table-column
				align="center"
				type="selection"
				:reserve-selection="true"
				width="55"
			/>
			<el-table-column align="center" prop="goodsName" label="商品">
				<template slot-scope="scope">
					<div class="slot active">
						<div>
							<img
								class="goods_img"
								:src="getSmallImg(scope.row.defaultImageUrl)"
								alt=""
							/>
						</div>
						<div>
							<p>
								<span class="number">货号：{{ scope.row.goodsNumber }}</span>
								<el-tag
									v-if="shelfStateMapTag[goodsStateMap[scope.row.isSale]]"
									:type="shelfStateMapTag[goodsStateMap[scope.row.isSale]]"
									>{{ goodsStateMap[scope.row.isSale] }}</el-tag
								>
							</p>
							<p>{{ scope.row.goodsName }}</p>
						</div>
					</div>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination
			v-if="page.count"
			class="page"
			:total="page.count"
			:page-size="page.length"
			:page-sizes="[10, 30, 50, 100]"
			:current-page="page.currentPage"
			layout="total, sizes, prev, pager, next, jumper"
			@current-change="nextPage"
			@size-change="handleSizeChange"
		/>

		<div class="page">
			<el-button type="primary" @click="submitForm">确定</el-button>
			<!-- <el-button @click="resetForm">取消</el-button> -->
		</div>

		<SupplierDialog
			ref="supplier"
			:visible.sync="supplierDialog"
			:supplierId="searchData.supplierId"
			@supplierData="supplierData"
		/>
	</el-dialog>
</template>

<script>
import { getSmallImg } from '@/utils/imageTool'
import { getGoodsList } from '@/api/userRewardSystem'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		SupplierDialog: () => import('./SupplierDialog'),
		YxForm: () => import('@wg-vue-materials/yx-form'),
	},

	data() {
		return {
			checkedGoods: [],
			item: [
				{
					type: 'custom',
					title: '商家',
					dataIndex: 'supplierName',
				},
				{
					type: 'textarea',
					title: '货号搜索',
					dataIndex: 'goodsNumber',
					placeholder: '请输入货号,货号与货号之间使用英文逗号隔开或者换行',
				},
			],
			goodsId: [],
			echoOff: false,
			searchData: {
				supplierIds: [],
				supplierName: [],
				goodsNumber: '',
			},
			supplierList: [],
			loading: false,
			supplierDialog: false,
			tableData: [],
			getSmallImg,
			shelfStateMapTag: {
				在售: 'warning',
				待售: 'info',
			},
			goodsStateMap: {
				1: '在售',
				2: '待售',
			},
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
			},
			formAction: [
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
		details(type, supplierBOList, goodsId, supplierName, supplierIds) {
			if (type == 2) {
				if (typeof supplierIds == 'undefined' || supplierIds.length == 0) {
					for (let i = 0; i < supplierBOList.length; i++) {
						this.searchData.supplierIds.push(supplierBOList[i].supplierId)
						this.searchData.supplierIds = [
							...new Set(this.searchData.supplierIds),
						]
						this.searchData.supplierName.push(supplierBOList[i].supplierName)
						this.searchData.supplierName = [
							...new Set(this.searchData.supplierName),
						]

						this.supplierList = supplierBOList
					}
				} else if (
					typeof supplierIds != 'undefined' &&
					supplierIds.length > 0
				) {
					this.searchData.supplierIds = [...new Set(supplierIds)]
					this.searchData.supplierName = [...new Set(supplierName)]
				}
			}

			if (type == 1) {
				if (goodsId.length == 0) {
					this.searchData.supplierName = []
					this.searchData.supplierIds = []
				} else {
					this.searchData.supplierName = supplierName || []
					this.searchData.supplierIds = supplierIds || []
				}
			}
			this.goodsId = goodsId
			this.checkedGoods = []
			if (goodsId.length) {
				goodsId.forEach((element) => {
					this.checkedGoods.push({
						goodsId: element.targetId,
						supplierId: element.supplierId,
					})
				})
			}
			this.echoOff = true
			this.tableData = []
			if (this.searchData.supplierIds.length == 0) {
				if (type == 1 || supplierBOList.length == 0) {
					return
				}
			}
			this._getYouxuanGoodsList(true)
		},

		findSearchParams(flag) {
			if (flag) {
				this.page.currentPage = 1
			}

			const paramsData = JSON.parse(JSON.stringify(this.searchData))
			paramsData.goodsNumber = paramsData.goodsNumber.replace(/\n/g, ',')
			paramsData.goodsNumber = paramsData.goodsNumber.replace(/\s*/g, '')
			paramsData.goodsNumber = paramsData.goodsNumber
				? paramsData.goodsNumber.split(',')
				: []

			const paramJson = {
				supplierIds: paramsData.supplierIds,
				goodsNumber: paramsData.goodsNumber,
				length: this.page.length,
				currentPage: this.page.currentPage,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			}

			return paramJson
		},

		async _getYouxuanGoodsList(flag) {
			if (this.searchData.supplierIds.length === 0) {
				return this.$message.warning('请选择商家')
			}

			this.loading = true
			const paramJson = this.findSearchParams(flag)

			const {
				data: { resultCode, resultData },
			} = await getGoodsList(paramJson)

			if (resultCode == 0) {
				this.tableData = resultData.records
				this.page.count = resultData.total
				this.toggleSelection()
			} else {
				this.page.count = 0
				this.tableData = []
			}

			this.loading = false
		},

		handleEchoData(data) {
			for (let i = 0; i < this.goodsId.length; i++) {
				for (let j = 0; j < data.length; j++) {
					if (data[j].goodsId == this.goodsId[i]) {
						this.$refs.multipleGoodsTable.toggleRowSelection(data[j], true)
					}
				}
			}
		},

		resetForm() {
			this.localVisible = false
			this.$refs.multipleGoodsTable.clearSelection()
			this.searchData = {
				supplierIds: [],
				supplierName: [],
				goodsNumber: '',
			}

			this.page = {
				count: 0,
				length: 10,
				currentPage: 1,
			}
		},

		resetTable() {
			this.searchData.supplierIds = []
			this.searchData.supplierName = []
		},

		submitForm() {
			if (!this.checkedGoods.length) {
				return this.$message.warning('请选择商品')
			}
			const goodsId = this.checkedGoods
			const data = {
				goodsId,
				supplierName: this.searchData.supplierName,
				supplierIds: this.searchData.supplierIds,
			}

			this.$emit('handleGoods', data)
			this.resetForm()
		},

		supplierData(supplierId, supplierName) {
			this.searchData.supplierIds = supplierId
			this.searchData.supplierName = supplierName
		},

		handleSupplier() {
			this.supplierDialog = true
			this.$nextTick(() => {
				this.$refs.supplier.detail(this.searchData.supplierIds)
			})
		},

		getRowKeys(row) {
			return row.goodsId
		},

		handleSelect(selection, row) {
			let selected = selection.find((item) => {
				return item.goodsId == row.goodsId && item.supplierId == row.supplierId
			})
			if (selected) {
				let checked = this.checkedGoods.find((item) => {
					return (
						item.goodsId == row.goodsId && item.supplierId == row.supplierId
					)
				})
				if (!checked) {
					this.checkedGoods.push({
						goodsId: row.goodsId,
						supplierId: row.supplierId,
					})
				}
			} else {
				let index = this.checkedGoods.findIndex((item) => {
					return (
						item.goodsId == row.goodsId && item.supplierId == row.supplierId
					)
				})
				if (index !== undefined) {
					this.checkedGoods.splice(index, 1)
				}
			}
		},
		selectAll(selection) {
			if (selection.length) {
				//全选
				selection.forEach((row) => {
					let checked = this.checkedGoods.find((item) => {
						return (
							item.goodsId == row.goodsId && item.supplierId == row.supplierId
						)
					})
					if (!checked) {
						this.checkedGoods.push({
							goodsId: row.goodsId,
							supplierId: row.supplierId,
						})
					}
				})
			} else {
				//反选
				this.tableData.forEach((row) => {
					let index = this.checkedGoods.findIndex((item) => {
						return (
							item.goodsId == row.goodsId && item.supplierId == row.supplierId
						)
					})
					if (index !== undefined) {
						this.checkedGoods.splice(index, 1)
					}
				})
			}
		},

		handleSizeChange(val) {
			this.page.length = val
			this._getYouxuanGoodsList()
		},

		nextPage(val) {
			this.page.currentPage = val
			this._getYouxuanGoodsList()
		},
		open() {
			// this.checkedGoods = []
		},

		toggleSelection() {
			this.tableData.forEach((row) => {
				let checked = this.checkedGoods.find((item) => {
					return (
						item.goodsId == row.goodsId && item.supplierId == row.supplierId
					)
				})
				if (checked) {
					let index = this.tableData.findIndex((item) => {
						return (
							item.goodsId == row.goodsId && item.supplierId == row.supplierId
						)
					})
					this.$refs.multipleGoodsTable.toggleRowSelection(
						this.tableData[index],
						true
					)
				}
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.supplier {
	width: 690px;
}

p {
	margin: 0;
}

.slot {
	text-align: left;
	display: flex;
	align-items: center;
	justify-content: center;

	.goods_img {
		width: 50px;
		height: 50px;
		margin-right: 10px;
		line-height: 155px;
	}

	.number {
		margin-right: 10px;
	}
}

.page {
	margin: 20px 0;
	text-align: right;
}

.active {
	line-height: 15px;
}
</style>

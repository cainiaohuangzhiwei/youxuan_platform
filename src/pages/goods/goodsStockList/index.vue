<template>
	<div class="goodsStockList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData105"
				:items="formCfg105"
				:formAction="formAction105"
			>
			</yx-form>
			<yx-table
				:select="true"
				v-loading="loading"
				:columns="tableColumns106"
				:pagination="page106"
				:data="tableData106"
			>
				<template slot="goodsInventory" slot-scope="scope">
					<div class="slot active">
						<div>
							<p>
								<span class="number">货号：{{ scope.row.goodsNumber }}</span>
							</p>
							<p class="goods_name">{{ scope.row.goodsName }}</p>
							<p v-if="scope.row.shelfState == 2" class="bg-grey">上架</p>
							<p v-else class="bg-yellow">下架</p>
						</div>
					</div>
				</template>
			</yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import { wgGetDate } from '@/utils/helper/common'
import { isNull } from '@/utils/helper/common'
import { getWarehouseSpecListByCondition } from '@/api/webGoods'
import { getWarehouseList } from '@/api/warehouse'
import { getGoodsConfiguration } from '@/api/systemConfiguration'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	props: [],
	data() {
		return {
			loading: false,
			warehouseList: [],
			inviteCodeListData: [],
			formData105: {
				brandName: '',
				likeGoodsName: '',
				likeGoodsNumber: '',
				likeBarCode: '',
				warehouseId: 1,
				sortField: 1,
				shelfState: '',
				shelvesTimeStart: wgGetDate().getMonthStartDate,
				shelvesTimeEnd: wgGetDate().getMonthEndDate,
			},
			formCfg105: [
				{
					type: 'input',
					title: '会场名称',
					dataIndex: 'brandName',
					placeholder: '请输入会场名称',
				},
				{
					type: 'input',
					title: '商品名称',
					dataIndex: 'likeGoodsName',
					placeholder: '请输入商品名称',
				},
				{
					type: 'input',
					title: '货号',
					dataIndex: 'likeGoodsNumber',
					placeholder: '货号',
				},
				{
					type: 'input',
					title: '规格编码',
					dataIndex: 'likeBarCode',
					placeholder: '规格编码',
				},
				{
					type: 'select',
					title: '商品状态',
					dataIndex: 'shelfState',
					placeholder: '请选择商品状态',
					label: 'value',
					options: [
						{
							shelfState: '',
							value: '全部',
						},
						{
							shelfState: '2',
							value: '上架',
						},
						{
							shelfState: '1',
							value: '下架',
						},
					],
					change: () => {
						this.getWarehouseSpecListByCondition(true)
					},
				},
				{
					type: 'select',
					title: '排序',
					dataIndex: 'sortField',
					placeholder: '请选择排序',
					label: 'value',
					options: [
						{
							sortField: 1,
							value: '商品ID↓',
						},
						{
							sortField: 3,
							value: '商品ID↑',
						},
						{
							sortField: 2,
							value: '库存量↓',
						},
						{
							sortField: 4,
							value: '库存量↑',
						},
					],
					change: () => {
						this.getWarehouseSpecListByCondition(true)
					},
				},
				{
					type: 'select',
					title: '盘点仓库：',
					label: 'warehouseName',
					dataIndex: 'warehouseId',
					placeholder: '请输入仓库',
					options: [],
				},
				{
					title: '上架时间',
					type: 'datetimerange',
					dataIndex: ['shelvesTimeStart', 'shelvesTimeEnd'],
					placeholder: ['开始时间', '结束时间'],
				},
			],
			formAction105: [
				{
					title: '重置',
					auth: '',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: (e) => {
						this.getWarehouseSpecListByCondition(true, e)
					},
				},
			],
			tableData106: [],
			tableColumns106: [
				{
					type: 'string',
					dataIndex: 'warehouseName',
					title: '所在仓库',
				},
				{
					type: 'custom',
					dataIndex: 'goodsInventory',
					title: '商品名称',
				},
				{
					type: 'string',
					dataIndex: '',
					title: '规格',
					customRender: (row) => {
						let specHtml = ''
						if (
							!isNull(row.specOne) &&
							!isNull(this.inviteCodeListData.specOne)
						) {
							specHtml +=
								this.inviteCodeListData.specOne + '：' + row.specOne + '。'
						}
						if (
							!isNull(row.specTwo) &&
							!isNull(this.inviteCodeListData.specTwo)
						) {
							specHtml +=
								this.inviteCodeListData.specTwo + '：' + row.specTwo + '。'
						}
						if (
							!isNull(row.specThree) &&
							!isNull(this.inviteCodeListData.specThree)
						) {
							specHtml +=
								this.inviteCodeListData.specThree + '：' + row.specThree + '。'
						}
						return specHtml
					},
				},
				{
					type: 'string',
					dataIndex: 'specNumber',
					title: '规格码（SKU码）',
				},
				{
					type: 'string',
					dataIndex: 'scateName',
					title: '分类',
				},
				{
					type: 'string',
					dataIndex: 'unit',
					title: '单位',
				},
				{
					type: 'string',
					dataIndex: 'goodsStock',
					title: '库存数量',
				},
				{
					type: 'string',
					dataIndex: 'lockingStock',
					title: '锁定库存',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '出库',
							auth: 'stockOut',
							click: () => {
								this.$router.push({
									path: `newStockOperationOperation`,
								})
							},
						},
					],
				},
			],
			page106: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getWarehouseSpecListByCondition()
				},
			},
		}
	},

	created() {
		this.addGetGoodsConfiguration(true)
		this._getWarehouseList(true)
	},

	methods: {
		addGetGoodsConfiguration: async function () {
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await getGoodsConfiguration()
			if (resultCode === 0) {
				this.inviteCodeListData = resultData.goodsType
			} else {
				this.inviteCodeListData = []
			}
		},
		//获取部门列表
		async _getWarehouseList() {
			let res = await getWarehouseList()
			res = res.data
			if (res.resultCode === 0) {
				this.warehouseList = res.resultData.warehouseList
				this.formCfg105[6].options = [
					{
						warehouseId: '',
						warehouseName: '全部',
					},
					...this.warehouseList,
				]
				// departmentId
			}
		},
		findSearchParams106(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page106.currentPage = 1
			}
			const paramJson = Object.assign(this.formData105, {
				length: this.page106.length,
				startIndex: (this.page106.currentPage - 1) * this.page106.length,
			})
			paramJson.shelvesTimeStart =
				moment(paramJson.shelvesTimeStart).valueOf() || ''
			paramJson.shelvesTimeEnd =
				moment(paramJson.shelvesTimeEnd).valueOf() || ''
			paramJson.isBrand = 'isBrand'
			return paramJson
		},
		getWarehouseSpecListByCondition: async function (flag) {
			let paramJson = this.findSearchParams106(flag)
			if (isNull(paramJson.brandName)) {
				this.$message.warning({ message: '请填写会场名称' })
				return
			}
			this.loading = true
			let {
				data: { resultCode, resultData },
			} = await getWarehouseSpecListByCondition(paramJson)
			this.loading = false
			if (resultCode === 0) {
				this.tableData106 = resultData.warehouseSpecList
				this.page106.count = resultData.warehouseSpecCount
			} else {
				this.page106.count = 0
				this.tableData106 = []
			}
		},
	},
}
</script>
<style>
.bg-yellow {
	background-color: #ffc94b;
	width: 40px;
}
.bg-grey {
	background-color: #5cb85c;
	width: 40px;
}
</style>

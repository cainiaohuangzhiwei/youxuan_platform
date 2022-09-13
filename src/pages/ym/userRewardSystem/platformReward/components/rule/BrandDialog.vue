<template>
	<el-dialog
		width="800px"
		title="添加品牌"
		append-to-body
		:close-on-click-modal="false"
		:visible.sync="localVisible"
		@open="open"
	>
		<YxForm
			ref="formGoods"
			:inline="true"
			:items="item"
			:data="searchData"
			:formAction="formAction"
		>
			<template #supplierName>
				<el-row>
					<el-col :span="12">
						<el-input
							width="100px"
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
					</el-col>
				</el-row>
			</template>
		</YxForm>
		<el-tabs v-model="brandTabs" type="card" @tab-click="handleClick">
			<el-tab-pane label="选择品牌" name="checkBrand">
				<YxTable
					v-loading="loadingOne"
					:columns="columnsOne"
					:pagination="pageOne"
					:data="tableDataOne"
					><template #supplierName
						><div>{{ searchData.supplierName }}</div></template
					></YxTable
				>
			</el-tab-pane>
			<el-tab-pane
				:label="`已选品牌${
					!loadingOne && tableDataTwo.length
						? '(' + tableDataTwo.length + ')'
						: ''
				}`"
				name="checkedBrand"
				><YxTable
					v-loading="loadingTwo"
					:columns="columnsTwo"
					:pagination="pageTwo"
					:data="tableDataTwo"
				></YxTable>
			</el-tab-pane>
		</el-tabs>
		<div class="page">
			<el-button type="primary" @click="submitForm">确定</el-button>
			<!-- <el-button @click="resetForm">取消</el-button> -->
		</div>

		<SupplierBrandDialog
			:visible.sync="supplierBrandDialog"
			@checkSupplier="checkSupplier"
		/>
	</el-dialog>
</template>

<script>
import { getBrandParentList } from '@/api/userRewardSystem'
import { getSmallImg } from '@/utils/imageTool'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		brandDialogFirstopen: {
			type: Boolean,
			default: true,
		},
		brandActRewardRuleTargetList: {
			type: Array,
			default: () => [],
		},
		brandIndex: {
			type: Number,
		},
	},

	components: {
		SupplierBrandDialog: () => import('./SupplierBrandDialog'),
		YxForm: () => import('@wg-vue-materials/yx-form'),
		YxTable: () => import('@wg-vue-materials/yx-table'),
	},

	data() {
		return {
			item: [
				{
					type: 'custom',
					title: '商家',
					dataIndex: 'supplierName',
				},
			],
			supplierId: '',
			searchData: {
				supplierName: '',
			},
			checkedMap: {},
			brandParentIds: [],
			supplierBrandDialog: false,
			brandTabs: 'checkBrand',
			loadingOne: false,
			tableDataOne: [],
			tableDataOneTemp: [],
			pageOne: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getBrandParentList()
				},
			},
			columnsOne: [
				{
					type: 'custom',
					title: '商家名称',
					dataIndex: 'supplierName',
				},
				{
					title: '品牌名称',
					dataIndex: 'brandParentName',
				},
				{
					type: 'image',
					title: '品牌LOGO',
					dataIndex: 'brandLogoUrlS',
				},
				{
					title: '操作',
					type: 'action',
					width: '150',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.addBrand(row)
							},
						},
					],
				},
			],
			loadingTwo: false,
			tableDataTwo: [],
			pageTwo: {
				count: 0,
				length: 10,
				currentPage: 1,
			},
			columnsTwo: [
				{
					type: 'string',
					title: '商家名称',
					dataIndex: 'supplierName',
				},
				{
					title: '品牌名称',
					dataIndex: 'brandParentName',
				},
				{
					type: 'image',
					title: '品牌LOGO',
					dataIndex: 'brandLogoUrlS',
				},
				{
					title: '操作',
					type: 'action',
					width: '150',
					actions: [
						{
							title: '移除',
							click: (row) => {
								this.moveBrand(row)
							},
						},
					],
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
		localFirstopen: {
			get() {
				return this.brandDialogFirstopen
			},
			set(val) {
				this.$emit('update:brandDialogFirstopen', val)
			},
		},
	},
	watch: {
		brandParentIds: {
			handler(newVal) {
				this.tableDataOne = this.tableDataOneTemp.filter((item) => {
					let hasIn = newVal.find((i) => {
						return (
							i.brandParentId == item.brandParentId &&
							i.supplierId == item.supplierId
						)
					})
					return !hasIn
				})
			},
			//首次绑定则执行
			immediate: true,
			//深监听
			deep: true,
		},
	},

	methods: {
		findSearchParams(flag) {
			if (flag) {
				this.pageOne.currentPage = 1
			}
			let paramJson = {}
			paramJson = {
				supplierId: this.supplierId,
				length: this.pageOne.length,
				currentPage: this.pageOne.currentPage,
				startIndex: (this.pageOne.currentPage - 1) * this.pageOne.length,
			}

			return paramJson
		},

		async _getBrandParentList(flag) {
			if (this.supplierId === '') {
				return this.$message.warning('请选择商家')
			}
			this.loadingOne = true
			this.loadingTwo = true
			const paramJson = this.findSearchParams(flag)
			const {
				data: { resultCode, resultData },
			} = await getBrandParentList(paramJson)

			if (resultCode == 0) {
				this.tableDataOne = resultData.brandParentList.map((v) => {
					v.brandLogoUrlS = getSmallImg(v.brandLogoUrl)
					return v
				})
				this.tableDataOneTemp = this.tableDataOne
				this.tableDataOne = this.tableDataOneTemp.filter((item) => {
					let hasIn = this.brandParentIds.find((i) => {
						return (
							i.brandParentId == item.brandParentId &&
							i.supplierId == this.supplierId
						)
					})
					return !hasIn
				})
				this.pageOne.count = resultData.count
			} else {
				this.pageOne.count = 0
				this.tableDataOne = []
			}
			this.loadingOne = false
			this.loadingTwo = false
		},

		addBrand(row) {
			let hasIn = this.brandParentIds.find((i) => {
				return (
					i.brandParentId == row.brandParentId &&
					i.supplierId == this.supplierId
				)
			})
			if (!hasIn) {
				this.brandParentIds.push({
					brandParentId: row.brandParentId,
					supplierId: this.supplierId,
				})
				row.supplierId = this.supplierId
				row.supplierName = this.searchData.supplierName
				this.tableDataTwo.push(row)
			}
		},
		moveBrand(row) {
			let index = this.brandParentIds.findIndex((item) => {
				return (
					item.brandParentId == row.brandParentId &&
					item.supplierId == row.supplierId
				)
			})
			if (index > -1) {
				this.brandParentIds.splice(index, 1)
				this.tableDataTwo = this.tableDataTwo.filter((item) => {
					let hasIn = this.brandParentIds.find((i) => {
						return (
							i.brandParentId == item.brandParentId &&
							i.supplierId == item.supplierId
						)
					})
					return hasIn
				})
			}
		},
		resetForm() {
			this.resetSupplierData()
			this.supplierId = ''
			this.searchData.supplierName = ''
			this.localVisible = false
		},
		resetSupplierData() {
			this.tableDataOne = []
			this.tableDataOneTemp = []
			this.pageOne.count = 0
			this.pageOne.length = 10
			this.pageOne.currentPage = 1
		},
		resetCheckedData() {
			this.tableDataTwo = []
			this.brandParentIds = []
			this.supplierId = ''
			this.searchData.supplierName = ''
		},

		submitForm() {
			if (!this.brandParentIds.length) {
				return this.$message.warning('请选择品牌')
			}

			const data = this.tableDataTwo.map((item) => {
				return {
					targetType: 3,
					targetId: item.brandParentId,
					supplierId: item.supplierId,
				}
			})
			//保留选择数据
			this.checkedMap[this.brandIndex] = {
				supplierId: this.supplierId,
				supplierName: this.searchData.supplierName,
				tableDataTwo: this.tableDataTwo,
			}
			this.$emit('handleBrand', data)
			this.localVisible = false
		},

		async checkSupplier(supplierId, supplierName) {
			this.supplierId = supplierId
			this.searchData.supplierName = supplierName
			this.resetSupplierData()
			await this._getBrandParentList(true)
			this.brandTabs = 'checkBrand'
		},

		handleSupplier() {
			this.supplierBrandDialog = true
		},
		async open() {
			//首次打开编辑dialog重置数据
			if (this.localFirstopen) {
				this.resetSupplierData()
				this.resetCheckedData()
				this.checkedMap = {}
				//非首次打开编辑dialog,重复打开brandDialog时,保留选择,并获取上次选择
			} else if (this.checkedMap[this.brandIndex]) {
				await this.checkSupplier(
					this.checkedMap[this.brandIndex].supplierId,
					this.checkedMap[this.brandIndex].supplierName
				)
				this.tableDataTwo = this.checkedMap[this.brandIndex].tableDataTwo
				//新增子活动时,清空数据,但是checkerMap不清空
			} else {
				this.resetSupplierData()
				this.resetCheckedData()
			}
			this.localFirstopen = false
			//编辑时已选品牌商
			if (this.brandActRewardRuleTargetList.actRewardRuleTargetList) {
				this.resetSupplierData()
				this.resetCheckedData()
				this.brandActRewardRuleTargetList.actRewardRuleTargetList.forEach(
					(item) => {
						if (item.targetType == 3) {
							this.brandParentIds.push({
								brandParentId: item.targetId,
								supplierId: item.supplierId,
							})
							this.tableDataTwo.push({
								brandParentName: item.targetName,
								brandParentId: item.targetId,
								brandLogoUrlS: getSmallImg(item.defaultImageUrl),
								supplierName: item.supplierName,
								supplierId: item.supplierId,
							})
						}
					}
				)
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.supplier {
	width: 690px;
}
.el-select .el-input {
	width: 130px;
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

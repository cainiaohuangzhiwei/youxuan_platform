<template>
	<div class="goodsStockList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData105"
				:items="formCfg105"
				:formAction="formAction105"
			>
				<template #brandName>
					<el-input
						v-model="formData105.brandName"
						placeholder="请选择会场"
						value-key="brandName"
						label="brandName"
						@focus="selectBrand"
						clearable
						@clear="
							() => {
								formData105.brandName = ''
								formData105.brandId = ''
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="brandFormsDialog = true"
						></el-button>
					</el-input>
				</template>
				<template #supplierName>
					<el-input
						v-model="formData105.supplierName"
						placeholder="请选择商家"
						value-key="supplierName"
						label="supplierName"
						@focus="selectSupplier"
						clearable
						@clear="
							() => {
								formData105.supplierName = ''
								formData105.supplierAccountNumberId = ''
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="formsDialog = true"
						></el-button>
					</el-input>
				</template>
			</yx-form>
			<yx-table
				:select="true"
				v-loading="loading"
				:columns="tableColumns106"
				:selectionChange="selectionChange"
				:pagination="page106"
				:data="tableData106"
			>
				<template slot="goodsDefaultImage" slot-scope="scope">
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
							</p>
							<p class="goods_name">{{ scope.row.goodsName }}</p>
						</div>
					</div>
				</template>
			</yx-table>
			<!-- //限购设置 -->
			<Dialog
				title="限购设置"
				:visible="settingsPurchasingLoding"
				width="50%"
				:bottomBtn="settingsPurchasingBottomBtn"
				@before-close="settingsPurchasingLoding = false"
			>
				<yx-form
					style="margin-top: 60px"
					ref="form"
					:inline="false"
					:items="settingsItem"
					:data="settingsData"
					labelWidth="80px"
				>
					<template #total>
						<span style="margin-left: -88px"> 每个用户限购:</span>
						<el-input
							onkeyup="if(value.length>5)value=value.slice(0,6);this.v=function(){this.value=this.value.replace(/-/g,'');}.call(this)"
							style="width: 100px"
							type="number"
							v-model.trim="settingsData.total"
							min="1"
							placeholder="请输入限购数量"
						></el-input
						>件
						<span style="color: crimson">(填入数字不可为0或负数)</span>
					</template>
					<template #typeCustom>
						<el-checkbox
							:disabled="effectDisabled"
							@change="checkboxType"
							v-model="settingsData.type"
							>限购立即生效</el-checkbox
						>
					</template>
				</yx-form>
			</Dialog>
			<!-- 会场列表 -->
			<brand-dialog
				:itemInfo="brandRow"
				:visible.sync="brandFormsDialog"
				:paramJson="searchBrandData"
				@fatherMethodInit="
					(row) => {
						formData105.brandName = row.brandName
						formData105.brandId = row.brandId
					}
				"
			/>
			<!-- 商家/商家列表 -->
			<supplyNumber-Dialog
				:itemInfo="supplyRow"
				:visible.sync="formsDialog"
				@fatherMethodInit="
					(row) => {
						formData105.supplierName = row.supplierName
						formData105.supplierAccountNumberId = row.supplierAccountNumberId
					}
				"
			/>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import BrandDialog from '@/components/BrandDialog'
import { getConstantValueByKey } from '@/utils/helper/common'
import { isNull } from '@/utils/helper/common'
import { getSmallImg } from '@/utils/imageTool'
import SupplyNumberDialog from '@/components/SupplyNumberDialog'
import { getGoodsRestrictionYouxuanGoodsList } from '@/api/yhtPlusWebGoods'
import {
	createGoodsRestriction,
	modifyGoodsRestriction,
	deleteGoodsRestriction,
	batchCreateGoodsRestriction,
	batchDeleteGoodsRestriction,
} from '@/api/goodsRestriction'

import moment from 'moment'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		BrandDialog,
		Dialog,
		SupplyNumberDialog,
	},
	props: [],
	data() {
		return {
			searchBrandData: {
				selectionTag: 2,
			},
			brandRow: {},
			formsDialog: false,
			brandFormsDialog: false,
			viewType: null,
			loading: false,
			getSmallImg: getSmallImg,
			settingsPurchasingLoding: false,
			verticalScroll: null,
			effectDisabled: false,
			selectedList: [],
			formData105: {
				goodsRestrictionStatus: '0', //限购状态
				shelfState: '0', //商品状态
				isSales: '', //销售状态
				goodsName: '', //商品名称
				keyword: '', //货号
				supplierName: '', // 商家
				supplierAccountNumberId: '',
				brandName: '', // 会场
				brandId: '',
				shelvesTimeStart: '',
				shelvesTimeEnd: '',
			},
			settingsPurchasingBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.settingsPurchasingAudit()
					},
				},
			],
			settingsData: {
				total: '',
				startTime: '',
				endTime: '',
				type: false,
			},
			settingsItem: [
				{
					type: 'custom',
					dataIndex: 'total',
				},
				{
					title: '限购时段',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					type: 'custom',
					dataIndex: 'typeCustom',
				},
			],
			warehouseBottomBtn: [
				{
					title: '取 消',
					type: '',
					click: () => {
						this.warehouseLoding = false
					},
				},
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.quantityAudit()
					},
				},
			],
			formCfg105: [
				{
					type: 'select',
					title: '限购状态',
					dataIndex: 'goodsRestrictionStatus',
					placeholder: '请选择限购状态',
					label: 'value',
					options: [
						{
							goodsRestrictionStatus: '0',
							value: '全部商品',
						},
						{
							goodsRestrictionStatus: '1',
							value: '已限购',
						},
						{
							goodsRestrictionStatus: '2',
							value: '不限购',
						},
					],
				},
				{
					type: 'select',
					title: '商品状态',
					dataIndex: 'shelfState',
					placeholder: '请选择商品状态',
					label: 'value',
					options: [
						{
							shelfState: '0',
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
				},

				{
					type: 'select',
					title: '销售状态',
					dataIndex: 'isSales',
					placeholder: '请选择销售状态',
					label: 'value',
					options: [
						{
							isSales: '',
							value: '全部',
						},
						{
							isSales: '1',
							value: '在售',
						},
						{
							isSales: '2',
							value: '待售',
						},
					],
				},
				{
					title: '会场名称',
					type: 'custom',
					dataIndex: 'brandName',
				},
				{
					type: 'input',
					title: '商品名称',
					dataIndex: 'goodsName',
					placeholder: '请输入商品名称',
				},
				{
					title: '商品货号',
					type: 'input',
					dataIndex: 'keyword',
					placeholder: '请输入商品货号',
				},
				{
					title: '商家',
					type: 'custom',
					dataIndex: 'supplierName',
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
						this.getGoodsRestrictionYouxuanGoodsList(true, e)
					},
				},
				{
					title: '批量限购',
					type: 'primary',
					auth: '',
					click: (row) => {
						this.purchaseLimits(row, 1)
					},
				},
				{
					title: '批量删除',
					type: 'primary',
					auth: '',
					click: () => {
						this.deleteBatchesGoodsList()
					},
				},
			],
			tableData106: [],
			outboundDetailsTable: [
				{
					type: 'string',
					dataIndex: 'barCode',
					title: '条形码',
				},
				{
					type: 'string',
					dataIndex: 'specOne',
					title: '规格一',
				},
				{
					type: 'string',
					dataIndex: 'specTwo',
					title: '规格二',
				},
				{
					type: 'string',
					dataIndex: 'clerkName',
					title: '操作人',
				},
				{
					type: 'string',
					dataIndex: 'addTime',
					title: '操作时间',
					customRender: (row) => {
						return row.addTime
							? row.addTime + moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'enteredTime',
					title: '条形码',
				},
				{
					type: 'string',
					dataIndex: 'updateType',
					title: '操作类型',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.OPERATION_TYPE_CODE,
							row.updateType,
							'-',
							'updateType'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'quantity',
					title: '数量',
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '操作备注',
				},
			],
			tableColumns106: [
				{
					type: 'custom',
					dataIndex: 'goodsDefaultImage',
					title: '商品名称',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场名称',
				},

				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
				},
				{
					type: 'string',
					dataIndex: 'checkTime',
					title: '上架时间',
					customRender: (row) => {
						return row.checkTime && row.checkTime
							? moment(row.checkTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'checkTime',
					title: '时段',
					customRender: (row) => {
						return row.goodsRestrictionVO
							? moment(row.goodsRestrictionVO.startTime).format(
									'YYYY-MM-DD HH:mm:ss'
							  ) +
									moment(row.goodsRestrictionVO.endTime).format(
										'YYYY-MM-DD HH:mm:ss'
									)
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'total',
					title: '数量',
					customRender: (row) => {
						return row.goodsRestrictionVO && row.goodsRestrictionVO.total
							? '每个用户限购' + row.goodsRestrictionVO.total + '件'
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '限购',
					customRender: (row) => {
						if (row.goodsRestrictionVO) {
							if (row.goodsRestrictionVO.status == 1) {
								return '已限购'
							}
						} else {
							return '不限购'
						}
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '用户限购',
							click: (row) => {
								this.purchaseLimits(row, 2)
							},
							customRender: (action, row) => {
								action.title = row.goodsRestrictionVO ? '修改' : '用户限购'
								return action
							},
						},
						{
							title: '删除',
							popconfirm: true,
							popconfirmTitle: '确定删除限购',
							confirm: (row) => {
								this.deletePurchaseLimit(row)
							},
							customRender: (action, row) => {
								action.hide = !row.goodsRestrictionVO
								return action
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
					this.getGoodsRestrictionYouxuanGoodsList()
				},
			},
		}
	},

	methods: {
		async deleteBatchesGoodsList() {
			if (this.selectedList.length == 0) {
				this.$message.warning({ message: '请勾选可删除的商品' })
				return
			}
			let goodsIdList = []
			let goodsNumberList = []
			let brandIdList = []
			let goodsRestrictionIdList = []
			this.selectedList.map((item) => {
				if (item.goodsRestrictionVO) {
					goodsIdList.push(item.goodsId)
					goodsNumberList.push(item.goodsNumber)
					brandIdList.push(item.brandId)
					goodsRestrictionIdList.push(
						item.goodsRestrictionVO.goodsRestrictionId
					)
				}
			})
			let paramJson = {
				goodsIds: goodsIdList,
				goodsNumbers: goodsNumberList,
				brandIds: brandIdList,
				goodsRestrictionIds: goodsRestrictionIdList,
			}
			if (goodsIdList.length == 0) {
				this.$message.warning({ message: '无可批量删除的商品' })
				return
			}
			const title =
				this.selectedList.length > 0
					? `确定批量删除${this.selectedList.length}勾选的商品限购？`
					: '确认要删除商品限购吗？'

			this.$confirm(title, '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						let {
							data: { resultMsg, resultCode },
						} = await batchDeleteGoodsRestriction(paramJson)
						const type = resultCode == 0 ? 'success' : 'error'
						this.$message[type](resultMsg)
						this.getGoodsRestrictionYouxuanGoodsList(true)
					}
				},
			})
		},
		//勾选list数据
		selectionChange(list) {
			this.selectedList = list
		},
		//删除限购
		async deletePurchaseLimit(row) {
			const {
				data: { resultCode },
			} = await deleteGoodsRestriction({
				goodsRestrictionId: row.goodsRestrictionVO.goodsRestrictionId,
			})
			if (resultCode == 0) {
				this.$message({
					message: `删除成功!`,
					type: 'success',
				})
				this.getGoodsRestrictionYouxuanGoodsList()
			}
		},
		//修改回显 单条数据
		purchaseLimits(row, type) {
			this.viewType = type
			if (type == 1 && this.selectedList.length == 0) {
				this.$message.warning({ message: '请勾选可限购的商品' })
				return
			}
			if (row.goodsRestrictionVO && type == 2) {
				this.settingsData.total = row.goodsRestrictionVO.total
					? row.goodsRestrictionVO.total
					: ''
				this.settingsData.type = row.goodsRestrictionVO.type == 2 ? true : false
				this.settingsItem[1] = {
					title: '结束时段',
					type: 'time',
					timeAttributes: {
						type: 'datetime',
					},
					dataIndex: 'endTime',
				}
				this.effectDisabled = true
				this.settingsData.startTime = row.goodsRestrictionVO.startTime
					? row.goodsRestrictionVO.startTime
					: ''
				this.settingsData.endTime = row.goodsRestrictionVO.endTime
					? row.goodsRestrictionVO.endTime
					: ''
			} else {
				this.settingsData.total = ''
				this.settingsData.startTime = ''
				this.settingsData.endTime = ''
				this.settingsData.type = false
				this.effectDisabled = false
			}
			this.verticalScroll = row
			this.settingsPurchasingLoding = true
		},
		//监听checkbox按钮
		checkboxType() {
			if (this.settingsData.type) {
				this.settingsItem[1] = {
					title: '限购时段',
					type: 'time',
					timeAttributes: {
						type: 'datetime',
					},
					dataIndex: 'endTime',
				}
			} else {
				this.settingsItem[1] = {
					title: '限购时段',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
				}
			}
		},
		//确定限购
		settingsPurchasingAudit: async function () {
			//编辑 批量 单个限购接口
			let addUrl
			let paramJson
			if (this.viewType == 1) {
				let goodsIdList = []
				let goodsNumberList = []
				let brandIdList = []
				this.selectedList.map((item) => {
					if (!item.goodsRestrictionVO) {
						goodsIdList.push(item.goodsId)
						goodsNumberList.push(item.goodsNumber)
						brandIdList.push(item.brandId)
					}
				})
				paramJson = {
					total: this.settingsData.total,
					goodsIds: goodsIdList,
					goodsNumbers: goodsNumberList,
					brandIds: brandIdList,
				}
				addUrl = batchCreateGoodsRestriction
			} else {
				paramJson = {
					//单个切入
					total: this.settingsData.total,
					goodsId: this.verticalScroll.goodsId,
					brandId: this.verticalScroll.brandId,
					goodsNumber: this.verticalScroll.goodsNumber,
				}
				if (!this.verticalScroll.goodsRestrictionVO) {
					addUrl = createGoodsRestriction
				} else {
					paramJson.goodsRestrictionId =
						this.verticalScroll.goodsRestrictionVO.goodsRestrictionId
					addUrl = modifyGoodsRestriction
				}
			}
			//监听到的单选框 择参
			if (this.settingsData.type) {
				paramJson.type = 1
				paramJson.endTime = this.settingsData.endTime
			} else {
				paramJson.endTime = this.settingsData.endTime
				paramJson.startTime = this.settingsData.startTime
				paramJson.type = 2
			}
			if (isNull(paramJson.total) || paramJson.total == 0) {
				this.$message.warning({ message: '请输入整数' })
				return
			}
			if (isNull(paramJson.endTime)) {
				this.$message.warning({ message: '请选择完整时间' })
				return
			}
			let {
				data: { resultCode, resultMsg },
			} = await addUrl(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.settingsPurchasingLoding = false
				this.getGoodsRestrictionYouxuanGoodsList()
			}
		},
		//会场弹窗
		selectBrand(e) {
			e.target.blur()
			this.brandFormsDialog = true
		},
		//商家弹窗
		selectSupplier(e) {
			e.target.blur()
			this.formsDialog = true
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

			//商品货号
			return paramJson
		},
		getGoodsRestrictionYouxuanGoodsList: async function (flag, e) {
			let paramJson = this.findSearchParams106(flag)
			paramJson.viewType = 3
			paramJson.goodsStatus = 3
			paramJson.linkSourceType = 'goodsRestriction' //查询限购信息字段
			paramJson.brandIdList = [paramJson.brandId]
			// paramJson.brandIdList = ['66434']
			if (isNull(paramJson.brandId)) {
				this.$message.warning({ message: '请选择会场' })
				return
			}
			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await getGoodsRestrictionYouxuanGoodsList(paramJson, custom)
			this.showLoading = false
			if (resultCode === 0) {
				this.tableData106 = resultData.goodsList
				this.page106.count = resultData.goodsCount
			} else {
				this.page106.count = 0
				this.tableData106 = []
			}
		},
	},
}
</script>
<style>
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
</style>

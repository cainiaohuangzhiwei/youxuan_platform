<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="oneformInline"
				:items="oneformCfg"
				:formAction="oneformAction"
			></yx-form>
			<goods-number-input
				:notGoodsNumber="notGoodsNumber"
				ref="goodsNumberInput"
			/>
			<yx-form
				:inline="true"
				:data="twoformInline"
				:items="twoformCfg"
				:formAction="twoformAction"
			>
				<template #goodsCategoryName>
					<el-cascader
						:options="goodsCategoryList"
						@change="handleChange"
						clearable
						:props="{
							checkStrictly: true,
							children: 'goodsCategoryChildList',
							label: 'goodsCategoryName',
							value: 'goodsCategoryId',
						}"
						ref="cascader"
						placeholder="请选择类目名称"
					></el-cascader>
				</template>
			</yx-form>
			<div class="brandSelect" v-if="littleShow">
				<div class="brandLeft">
					<div class="one">会场:</div>
					<div>
						<el-checkbox-group
							v-model="formInline.brandIdList"
							@change="littleHandleChange"
						>
							<el-checkbox
								class="mb10"
								:label="item.brandId"
								v-for="(item, index) in littleBrandList"
								:key="index"
								>{{ item.brandName }}</el-checkbox
							>
						</el-checkbox-group>
					</div>
				</div>
				<div class="brandRight" @click="handleMore">更多</div>
			</div>
			<div class="moreSelect" v-if="moreShow">
				<div class="one">会场:</div>
				<div class="two">
					<div class="t-top">
						<el-checkbox-group
							v-model="moreformInline.brandIdList"
							@change="moreHandleChange"
						>
							<el-checkbox
								class="mb10"
								:label="item.brandId"
								v-for="(item, index) in moreBrandList"
								:key="index"
								>{{ item.brandName }}</el-checkbox
							>
						</el-checkbox-group>
					</div>
					<div class="t-bot">
						<div>
							已选会场:<span
								v-for="(item, index) in moreBrandNames"
								:key="index"
								>{{ item
								}}{{ moreBrandNames.length - 1 != index ? '，' : '' }}</span
							>
						</div>
						<div class="tb-b">
							<el-button type="primary" @click="handleSure">确定</el-button>
							<el-button @click="handleCancal">取消</el-button>
						</div>
					</div>
				</div>
			</div>
			<yx-form :inline="true" :formAction="threeformAction"></yx-form>
			<el-row>
				<yx-table
					:select="true"
					:columns="tableColumns"
					:pagination="page"
					:data="newTableData"
					:actionInline="true"
					:selectionChange="selectionChange"
					:spanMethod="spanMethod"
					v-loading="tableLoading"
				>
					<!-- 商品信息 -->
					<template slot="info" slot-scope="scope">
						<div class="info">
							<el-image
								class="poster_img"
								fit="cover"
								:src="scope.row.goodsDefaultImage"
								:preview-src-list="[scope.row.goodsDefaultImage]"
							>
								<div slot="error" class="image-slot">
									<i class="el-icon-picture-outline"></i>
								</div>
							</el-image>
							<div @click="handleDetail(scope.row, scope)">
								<div>货号:{{ scope.row.goodsNumber }}</div>
								<div>{{ scope.row.goodsName }}</div>
							</div>
						</div>
						<p>
							提交时间：{{
								moment(scope.row.checkTime).format('YYYY-MM-DD HH:mm:ss')
							}}
						</p>
					</template>
					<template slot="hoverShow" slot-scope="scope">
						<el-link type="primary" @click="toDetail(scope.row)">查看</el-link>
						<!-- <echarts-popover
							:isNew="true"
							:options="scope.row"
						></echarts-popover> -->
					</template>
				</yx-table>
			</el-row>
			<batch-dialog
				:row="currentDta"
				:visible.sync="batchDialog"
				@fatherMethodInit="fatherMethodInit"
			/>
			<DisableGoodsDialog
				:visible.sync="DisableGoodsDialog"
				:row="DialogData"
				:selectRow="selectData"
				:title="dialogTitle"
				@refreshList="getYouxuanGoodsAuditListByParam"
			/>
			<PriceAuditDialog
				:visible.sync="PriceAuditDialog"
				:row="PriceData"
				:title="dialogTitle"
				@refreshList="getYouxuanGoodsAuditListByParam"
			/>
			<!-- 修改分佣比例 -->
			<batch-brokerage-ratio-dialog
				:batchGoodsId="batchGoodsId"
				:brokerBrandId="brokerBrandId"
				:visible.sync="batchBrokerageRatioDialog"
				:brokerageRatioRow="brokerageRatioRow"
				@fatherMethodInit="fatherMethodInit"
			/>
			<!-- 审核详情弹窗 -->
			<CommodityAuditDialog
				:visible.sync="commodityAuditDialogVisibel"
				:newTableData="newTableData"
				:commodityAuditDialogParams="commodityAuditDialogParams"
			/>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import BatchDialog from './BatchDialog'
import DisableGoodsDialog from './DisableGoodsDialog'
import PriceAuditDialog from './PriceAuditDialog'
import goodsNumberInput from './goodsNumberInput'
import { getBigImg } from '@/utils/imageTool'
import { downloadFile } from '@/utils/helper/common'
import BatchBrokerageRatioDialog from './BatchBrokerageRatioDialog'
// import EchartsPopover from '@/components/EchartsPopover'
import { checkGoodsListFromSupplier } from '@/api/yhtPlusWebGoods'
import {
	getBrandByGoodsStatus,
	getYouxuanGoodsAuditListByParam,
	exportGoodsWaitingDetails,
	autoCheckFlag,
	autoCalculatePrice,
	getYouxuanGoodsNumberAuditListByParam,
} from '@/api/supplierGoodsAudit'
import CommodityAuditDialog from '../CommodityAuditDialog'
import { checkFunctionCode } from '@/utils/auth'
import { goodsEnableCategoryTree } from '@/api/grossMargins'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		BatchDialog,
		DisableGoodsDialog,
		PriceAuditDialog,
		BatchBrokerageRatioDialog,
		// EchartsPopover,
		goodsNumberInput,
		CommodityAuditDialog,
	},
	name: 'FormTable',

	data() {
		return {
			moment,
			queryGoodsPriceComparisonDetail: checkFunctionCode(
				'queryGoodsPriceComparisonDetail'
			),
			notGoodsNumber: [],
			brokerBrandId: '',
			brandId: '',
			brokerageRatioRow: {},
			batchBrokerageRatioDialog: false, // 修改分佣比例弹窗
			batchGoodsId: [], // 批量修改分佣比例单个会场所有商品ID
			batchPriceGoodsId: [],
			gStatus: '',
			autoCheck: false,
			selectData: [],
			spanArr: [],
			pos: '',
			newTableData: [],
			DisableGoodsDialog: false,
			PriceAuditDialog: false,
			littleBrandList: '',
			moreBrandList: '',
			littleShow: true,
			moreShow: false,
			moreBrandNames: [],
			batchDialog: false,
			dialogTitle: '',
			importType: '',
			tableLoading: false,
			DialogData: {},
			selectionData: [],
			//导入Excel
			ImportDialog: false,
			departmentList: [],
			//表单数据
			oneformInline: {
				keyword: '',
			},
			twoformInline: {
				goodsNumber: '',
				goodsName: '',
				brandParentName: '',
				supplierName: '',
				checkTimeStart: '',
				checkTimeEnd: '',
				goodsStatus: '',
			},
			formInline: {
				brandIdList: [],
			},
			moreformInline: {
				brandIdList: [],
			},
			oneformCfg: [
				{
					title: '会场名称:',
					dataIndex: 'keyword',
					placeholder: '会场名称',
					// change: () => {
					// 	this._getOrganizationListByCondition()
					// },
				},
			],
			twoformCfg: [
				{
					title: '商品货号:',
					dataIndex: 'goodsNumber',
					placeholder: '商品货号',
				},
				{
					title: '商品名称:',
					dataIndex: 'goodsName',
					placeholder: '商品名称',
				},
				{
					title: '品牌名称:',
					dataIndex: 'brandParentName',
					placeholder: '品牌名称',
				},
				{
					title: '商家名称:',
					dataIndex: 'supplierName',
					placeholder: '商家名称',
				},
				{
					title: '提交时间:',
					type: 'datetimerange',
					dataIndex: ['checkTimeStart', 'checkTimeEnd'],
				},
				{
					title: '审核状态',
					type: 'select',
					dataIndex: 'goodsStatus',
					label: 'value',
					options: this.$store.state.app.constant.GOODS_STATUS,
				},
				{
					title: '商品类目',
					type: 'custom',
					hide: this.goodsCategoryListAuth,
					dataIndex: 'goodsCategoryName',
				},
			],
			goodsCategoryId: '',
			goodsCategoryList: [], //商品类目
			goodsCategoryListAuth: checkFunctionCode('goodsCategoryTree'), //商品类目权限
			oneformAction: [
				{
					title: '搜索',
					type: 'primary',
					// auth: 'bindDepartmentId',
					click: () => {
						if (this.littleShow) {
							this.getBrandByGoodsStatus(30)
						}
						if (this.moreShow) {
							this.getBrandByGoodsStatus(200)
						}
					},
				},
			],
			twoformAction: [
				{
					title: '搜索',
					type: 'primary',
					// auth: 'bindDepartmentId',
					click: () => {
						if (this.littleShow && !this.formInline.brandIdList.length) {
							this.$message({
								message: '至少选择一个会场',
								type: 'warning',
							})
							return
						}
						if (this.moreShow && !this.moreformInline.brandIdList.length) {
							this.$message({
								message: '至少选择一个会场',
								type: 'warning',
							})
							return
						}
						this.getYouxuanGoodsAuditListByParam()
					},
				},
				{
					title: '重置',
					// auth: 'bindDepartmentId',
					click: () => {
						this.oneformInline.keyword = ''
						this.twoformInline.goodsNumber = ''
						this.twoformInline.goodsName = ''
						this.twoformInline.brandParentName = ''
						this.twoformInline.supplierName = ''
						this.twoformInline.goodsStatus = ''
						this.twoformInline.checkTimeStart = moment(
							moment().startOf('month')
						).valueOf()
						this.twoformInline.checkTimeEnd = moment(
							moment().endOf('month')
						).valueOf()
					},
				},
			],
			threeformAction: [
				{
					title: '批量导出',
					type: 'primary',
					// auth: 'bindDepartmentId',
					click: () => {
						this.batchExport()
					},
				},
				// {
				// 	title: '批量导入',
				// 	type: 'primary',
				// 	// auth: 'bindDepartmentId',
				// 	click: () => {
				// 		this.batchDialog = true
				// 	},
				// },
				{
					title: '批量审核不通过',
					type: 'primary',
					auth: 'checkGoodsPrice',
					click: () => {
						this.batchAudit()
					},
				},
				{
					title: '批量修改分佣比例',
					type: 'primary',
					auth: 'updateCheckListCommissionRate',
					click: () => {
						this.handleBatchBrokerageRatio()
					},
					// customRender: (action) => {},
				},
				{
					title: '批量审核价格',
					type: 'primary',
					auth: 'autoCalculatePrice',
					click: () => {
						this.batchAuditPrice()
					},
					// customRender: (action) => {},
				},
				{
					title: '批量审核商品资料',
					type: 'primary',
					auth: 'checkGoodsListFromSupplier',
					click: () => {
						this._batchAuditGoods()
					},
				},
			],
			list: [],
			tableColumns: [
				{
					type: 'custom',
					dataIndex: 'info',
					title: '商品信息',
					width: 200,
				},
				// {
				// 	dataIndex: 'brandParentName',
				// 	title: '品牌',
				// 	customRender: (row) => {
				// 		if (row.brandParentName) {
				// 			return row.brandParentName
				// 		} else {
				// 			return '-'
				// 		}
				// 	},
				// },
				{
					width: 120,
					dataIndex: 'goodsCategoryName',
					title: '商品分类',
					customRender: (row) => {
						if (row.goodsCategoryName) {
							return row.goodsCategoryName
						} else {
							return '-'
						}
					},
				},
				{
					width: 120,
					dataIndex: 'brandParentName',
					title: '品牌',
					customRender: (row) => {
						if (row.brandParentName) {
							return row.brandParentName
						} else {
							return '-'
						}
					},
				},
				// {
				// 	width: 135,
				// 	dataIndex: 'supplierName',
				// 	title: '商家',
				// },
				{
					width: 135,
					dataIndex: 'brandName',
					title: '会场名称',
				},
				// {
				// 	width: 135,
				// 	dataIndex: 'checkTime',
				// 	type: 'data',
				// 	title: '提交时间',
				// },
				{
					dataIndex: 'specOne',
					title: '颜色',
				},
				{
					dataIndex: 'specTwo',
					title: '尺码',
				},
				{
					dataIndex: 'lowestPrice',
					width: 135,
					title: '建议最低零售价',
					renderHeader: (h, { column }) => {
						return this.renderHeader(
							h,
							{ column },
							'商品在平台正常销售的价格，以此价格进行销售最具性价比。'
						)
					},
					customRender: (row) => {
						if (row.lowestPrice > 0) {
							return row.lowestPrice
						} else {
							return '-'
						}
					},
				},
				{
					dataIndex: 'supplierPrice',
					title: '商家建议最低销售价',
					renderHeader: (h, { column }) => {
						return this.renderHeader(
							h,
							{ column },
							'商家提供的最低建议销售价。'
						)
					},
					customRender: (row) => {
						if (row.supplierPrice > 0) {
							return row.supplierPrice
						} else {
							return '-'
						}
					},
				},
				{
					dataIndex: 'costPrice',
					title: '结算价',
					renderHeader: (h, { column }) => {
						return this.renderHeader(
							h,
							{ column },
							'商品完成销售后，平台与商家的结算价格。'
						)
					},
					customRender: (row) => {
						if (row.costPrice > 0) {
							return row.costPrice
						} else {
							return '-'
						}
					},
				},
				{
					dataIndex: 'highestPrice',
					title: '外网价',
					renderHeader: (h, { column }) => {
						return this.renderHeader(
							h,
							{ column },
							'商品在云货优选平台以外的其他主流线上渠道实际销售价格。'
						)
					},
					customRender: (row) => {
						if (row.highestPrice > 0) {
							return row.highestPrice
						} else {
							return '-'
						}
					},
				},
				{
					dataIndex: 'marketPrice',
					title: '市场价',
					renderHeader: (h, { column }) => {
						return this.renderHeader(h, { column }, [
							'1.划线价必须有依据，可以是吊牌价或品牌官网售价等价格；',
							'2.请商家务必妥善保存划线价定价依据以备查。抽检时如无法提供的，将被平台或政府处罚；',
							'3.平台鼓励商家在商品详情页对“划线价”的含义及定价依据进行准确说明。',
						])
					},
					customRender: (row) => {
						if (row.marketPrice > 0) {
							return row.marketPrice
						} else {
							return '-'
						}
					},
				},
				{
					dataIndex: 'totalStock',
					title: '库存',
				},
				{
					width: 120,
					type: 'custom',
					hide: this.queryGoodsPriceComparisonDetail,
					dataIndex: 'hoverShow',
					title: '价格走势',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '审核(商品信息审核通过)',
							auth: 'autoCalculatePrice',
							click: (row) => {
								this.$confirm('是否确定审核通过?', '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning',
								})
									.then(() => {
										this.autoCalculatePrice(row, 'alone')
									})
									.catch(() => {
										this.$message({
											type: 'info',
											message: '已取消审核',
										})
									})
							},
							customRender: (action, row) => {
								action.hide = row.goodsStatus != 7
								return action
							},
						},
						{
							title: '审核',
							auth: 'checkGoodsFromSupplier',
							click: (row) => {
								this.handleDetail(row)
							},
							customRender: (action, row) => {
								action.hide = row.goodsStatus != 2
								return action
							},
						},
						{
							title: '审核不通过',
							auth: 'checkGoodsPrice',
							click: (row) => {
								this.dialogTitle = '审核不通过'
								this.DisableGoodsDialog = true
								this.DialogData = row
								this.selectData = []
							},
						},
						{
							title: '修改分佣比例',
							auth: 'updateCheckListCommissionRate',
							click: (row) => {
								this.brokerageRatioRow = row
								this.brokerageRatioRow.type = 2
								this.batchBrokerageRatioDialog = true
							},
							customRender: (action, row) => {
								action.hide = row.goodsStatus != 7
								return action
							},
						},
					],
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getYouxuanGoodsAuditListByParam()
				},
			},
			commodityAuditDialogVisibel: false,
			commodityAuditDialogParams: {},
		}
	},
	created() {
		// this._getOrganizationTag()
		// this._getOrganizationListByCondition()
		// this._getDepartmentList()
		this.getBrandByGoodsStatus(30)
		if (checkFunctionCode('goodsCategoryTree')) {
			this.getGoodsCategoryList() // 获取商品类目
		}
		// this.autoCheckFlag()
	},
	methods: {
		toDetail(options) {
			let json = {}
			if (options.supplierAccountNumberId) {
				json.supplierAccountNumberId = options.supplierAccountNumberId
			} else if (options.supplierId) {
				json.supplierId = options.supplierId
			}
			this.$router.push({
				path: `goodsPriceDetails/${encodeURIComponent(options.goodsNumber)}`,
				query: json,
			})
		},
		getGoodsCategoryList: async function () {
			let {
				data: { resultCode = 0, resultData = [] },
			} = await goodsEnableCategoryTree()
			if (resultCode == 0) {
				this.goodsCategoryList = this.mapAll(resultData.goodsCategoryList)
			}
		},
		//数据过滤，三级后去掉子级，可以选中
		mapAll(options) {
			return options.map((item) => {
				//最高三级，清除第三级后面的数组，组件就可以选中
				if (item.goodsCategoryLevel === 3) {
					item.goodsCategoryChildList = null
				}
				if (
					item.goodsCategoryChildList &&
					item.goodsCategoryChildList.length > 0
				) {
					this.mapAll(item.goodsCategoryChildList)
				}
				return item
			})
		},
		_batchAuditGoods: async function () {
			const len = this.formInline.brandIdList.length
			const more = this.moreformInline.brandIdList
			const selectionLen = this.selectionData.length
			if (!len && !more) {
				return this.$message.warning('请选择一个会场')
			} else if (!selectionLen) {
				return this.$message.warning('请选择需要批量审核商品资料商品')
			}
			let goodsIdList = this.selectionData.map((item) => {
				return item.goodsId
			})
			let {
				data: { resultCode = 0, resultMsg },
			} = await checkGoodsListFromSupplier({
				goodsIdList: goodsIdList,
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.getYouxuanGoodsAuditListByParam()
			}
		},
		renderHeader(h, { column }, tip) {
			let arr = typeof tip === 'string' ? [tip] : tip
			// 表头提示
			return h('div', [
				h('span', column.label),
				h(
					'el-tooltip',
					{
						props: {
							effect: 'dark',
							content: [
								h(
									'div',
									arr.map((item) => {
										return h('p', item)
									})
								),
							],
							placement: 'top',
						},
					},
					[
						h('i', {
							class: 'el-icon-question',
							style: 'color:#409EFF;margin-left:5px;',
						}),
					]
				),
			])
		},
		unique(arr) {
			for (let i = 0; i < arr.length; i++) {
				for (let j = i + 1; j < arr.length; j++) {
					if (arr[i] == arr[j]) {
						//第一个等同于第二个，splice方法删除第二个
						arr.splice(j, 1)
						j--
					}
				}
			}
			return arr
		},

		batchAuditPrice() {
			if (!this.selectionData.length) {
				return this.$message.warning('请选择需要批量审核价格商品')
			}
			this.brandId = ''
			this.brandId = this.selectionData[0].brandId
			let judge = this.selectionData.some((item) => {
				return item.brandId != this.brandId
			})
			if (judge) {
				return this.$message.warning('只能选择同一个会场的商品')
			}
			this.batchPriceGoodsId = this.selectionData.map((item) => {
				return item.goodsId
			})
			this.autoCalculatePrice(this.batchPriceGoodsId, 'batch')
		},
		handleBatchBrokerageRatio() {
			if (!this.selectionData.length) {
				return this.$message.warning('请选择需要批量修改分佣比例商品')
			}
			this.brokerBrandId = ''
			this.brokerBrandId = this.selectionData[0].brandId
			let judge = this.selectionData.some((item) => {
				return item.brandId != this.brokerBrandId
			})
			if (judge) {
				return this.$message.warning('只能选择同一个会场的商品')
			}
			this.batchGoodsId = this.selectionData.map((item) => {
				return item.goodsId
			})
			this.brokerageRatioRow.type = 1
			this.batchBrokerageRatioDialog = true
		},
		handleDetail(row) {
			console.log('idx', row.idx)
			// const startIndex = (this.page.currentPage - 1) * this.page.length
			// const goodsSt =
			// 	row.goodsStatus + (this.gStatus ? '&goodsStatus=' + this.gStatus : '')
			// this.commodityAuditDialogParams = {
			// 	currentIndex: row.idx,
			// 	goodsSt,
			// 	gStatus: this.gStatus,
			// 	startIndex,
			// }
			// this.commodityAuditDialogVisibel = false
			// this.commodityAuditDialogVisibel = true
			let startIndex = (this.page.currentPage - 1) * this.page.length
			this.$router.push({
				path: `/goods/commodityAudit/${row.goodsId}/${row.goodsSpecId}/${
					row.checkTime
				}/${row.idx}/${this.page.count}/${startIndex}/${row.goodsStatus}/${
					this.goodsCategoryId ? this.goodsCategoryId : null
				}`,
			})
		},
		async autoCalculatePrice(row, i) {
			console.log(this.unique(row), 'rowrow')

			let paramJson
			if (i == 'alone') {
				paramJson = {
					goodsIdList: [row.goodsId],
					brandId: row.brandId,
				}
			} else {
				paramJson = {
					goodsIdList: this.unique(row),
					brandId: this.brandId,
				}
			}
			// let paramJson = {
			// 	goodsIdList: [row.goodsId],
			// }
			let res = await autoCalculatePrice(paramJson)
			res = res.data
			if (res.resultCode == 0) {
				this.$message({
					message: '成功',
					type: 'success',
					onClose: () => {
						this.getYouxuanGoodsAuditListByParam()
					},
				})
			}
		},
		async autoCheckFlag() {
			let res = await autoCheckFlag()
			res = res.data
			if (res.resultCode == 0) {
				this.autoCheck = res.resultData
			}
		},
		async batchExport(flag) {
			let paramJson = this.findSearchParams(flag)
			paramJson.isExport = 7
			let goodsIdList = []
			goodsIdList = this.selectionData.map((item) => {
				return item.goodsId
			})
			paramJson.goodsIdList = goodsIdList
			let headList = [
				'goodsNumber',
				'brandParentName',
				'supplierName',
				'goodsName',
				'specOne',
				'costPrice',
				'lowestPrice',
				'supplierPrice',
				'supplyPrice',
				'highestPrice',
				'marketPrice',
				'stock',
				'specTwo',
				'barCode',
			]
			paramJson.headList = headList
			paramJson.signField = -1
			let { data } = await exportGoodsWaitingDetails(paramJson)
			downloadFile(data, '审核商家商品.xlsx')
		},
		batchAudit() {
			if (this.selectionData && !this.selectionData.length) {
				this.$message.error('请选择需要批量审核的数据')
				return
			}
			this.dialogTitle = '审核不通过'
			this.DisableGoodsDialog = true
			this.selectData = this.selectionData
			this.DialogData = {}
		},
		spanMethod({ rowIndex, columnIndex }) {
			if (
				columnIndex === 0 ||
				columnIndex === 1 ||
				columnIndex === 2 ||
				columnIndex === 3 ||
				// columnIndex === 4 ||
				// columnIndex === 5 ||
				// columnIndex === 6 ||
				columnIndex === 14 ||
				columnIndex === 12
			) {
				const _row = this.spanArr[rowIndex]
				const _col = _row > 0 ? 1 : 0
				return {
					// [0,0] 表示这一行不显示， [2,1]表示行的合并数
					rowspan: _row,
					colspan: _col,
				}
			}
		},
		// 子组件调用父组件选品区方法更新
		fatherMethodInit() {
			if (this.littleShow && !this.formInline.brandIdList.length) {
				return
			} else if (this.moreShow && !this.moreformInline.brandIdList.length) {
				return
			} else {
				this.getYouxuanGoodsAuditListByParam()
			}
			// this.getYouxuanGoodsAuditListByParam()
		},
		littleHandleChange(val) {
			if (val && !val.length) {
				this.newTableData = []
				this.spanArr = []
				this.pos = ''
				this.page.count = 0
				return
			}
			this.getYouxuanGoodsAuditListByParam()
		},
		handleMore() {
			this.getBrandByGoodsStatus(200)
			this.littleShow = false
			this.moreShow = true
		},
		handleCancal() {
			this.littleShow = true
			this.moreShow = false
			this.moreformInline.brandIdList = []
			this.moreBrandNames = []
		},
		moreHandleChange(val) {
			this.moreBrandNames = []
			if (val && val.length) {
				this.moreformInline.brandIdList.forEach((item) => {
					this.moreBrandList.forEach((ite) => {
						if (item == ite.brandId) {
							this.moreBrandNames.push(ite.brandName)
						}
					})
				})
			}
		},
		handleSure() {
			if (!this.moreformInline.brandIdList.length) {
				this.$message({
					message: '至少选择一个会场',
					type: 'warning',
				})
				return
			}
			this.getYouxuanGoodsAuditListByParam()
		},
		async getBrandByGoodsStatus(index) {
			let paramJson = {
				keyword: this.oneformInline.keyword,
				length: index,
			}
			this.tableLoading = true
			let res = await getBrandByGoodsStatus(paramJson)
			this.tableLoading = false
			res = res.data
			if (res.resultCode === 0) {
				if (index == 30) {
					this.formInline.brandIdList = []
					this.littleBrandList =
						res.resultData.brandList && res.resultData.brandList.length
							? res.resultData.brandList
							: []
				}
				if (index == 200) {
					this.moreformInline.brandIdList = []
					this.moreBrandNames = []
					this.moreBrandList =
						res.resultData.brandList && res.resultData.brandList.length
							? res.resultData.brandList
							: []
				}
			}
		},
		//优化商品列表货号搜索,返回无货号
		async _getYouxuanGoodsNumberAuditListByParam(paramJson) {
			// 如果货号为空 不做请求
			if (!paramJson.keyword) {
				this.notGoodsNumber = []
				return
			}
			const {
				data: {
					resultCode,
					resultData: { notGoodsNumber = [] },
				},
			} = await getYouxuanGoodsNumberAuditListByParam(paramJson)
			if (resultCode == 0 && notGoodsNumber.length > 0) {
				this.notGoodsNumber = notGoodsNumber
			} else {
				this.notGoodsNumber = [] //添加清空：‘以下货号搜索找不到对应商品’
			}
		},
		async getYouxuanGoodsAuditListByParam(flag) {
			let paramJson = this.findSearchParams(flag)
			this._getYouxuanGoodsNumberAuditListByParam(paramJson)
			// if (paramJson.brandIdList && !paramJson.brandIdList.length) {
			// 	this.$message({
			// 		message: '至少选择一个会场',
			// 		type: 'warning',
			// 	})
			// 	return
			// }
			this.gStatus = ''
			this.tableLoading = true
			let res = await getYouxuanGoodsAuditListByParam(paramJson)
			this.tableLoading = false
			this.gStatus = paramJson.goodsStatus
			res = res.data
			this.newTableData = []
			this.spanArr = []
			this.pos = ''
			if (res.resultCode === 0) {
				let list = res.resultData.goodsList
				if (list && list.length) {
					list.forEach((item, idx) => {
						if (item.newGoodsSpecList && item.newGoodsSpecList.length) {
							item.newGoodsSpecList.forEach((ite) => {
								let current = {
									barCode: item.barCode,
									supplierId: item.supplierId,
									goodsDefaultImage: getBigImg(item.goodsDefaultImage),
									goodsName: item.goodsName,
									goodsNumber: item.goodsNumber,
									brandId: item.brandId,
									goodsId: item.goodsId,
									brandParentName: item.brandParentName,
									goodsCategoryName: item.goodsCategoryName,
									supplierName: item.supplierName,
									brandName: item.brandName,
									checkTime: item.checkTime,
									goodsStatus: item.goodsStatus,
									specOne: ite.specOne,
									specTwo: ite.specTwo,
									costPrice: ite.costPrice,
									supplierPrice: ite.supplierPrice,
									lowestPrice: ite.lowestPrice,
									highestPrice: ite.highestPrice,
									marketPrice: ite.marketPrice,
									totalStock: ite.totalStock,
									goodsSpecId: item.goodsSpecId,
									idx: idx,
								}
								this.newTableData.push(current)
							})
						}
					})
				}
				if (this.newTableData && this.newTableData.length) {
					this.getSpanArr(this.newTableData)
				}
				this.page.count = res.resultData.goodsCount
			}
		},
		getSpanArr(data) {
			data.forEach((item, index) => {
				if (index == 0) {
					this.spanArr.push(1)
					this.pos = 0
				} else {
					// 判断当前元素与上一个元素是否相同
					if (data[index].goodsId == data[index - 1].goodsId) {
						this.spanArr[this.pos] += 1
						this.spanArr.push(0)
					} else {
						this.spanArr.push(1)
						this.pos = index
					}
				}
			})
		},
		findSearchParams(flag) {
			const goodsNumber = this.$refs.goodsNumberInput.handleNoParams(1)
			let paramJson = {
				goodsCategoryId: this.goodsCategoryId,
				signField: 1,
				goodsStatus: this.twoformInline.goodsStatus,
				keyword: goodsNumber.keyword, // 多个以逗号隔开
				goodsName: this.twoformInline.goodsName,
				brandParentName: this.twoformInline.brandParentName,
				supplierName: this.twoformInline.supplierName,
				brandName: this.oneformInline.keyword,
				checkTimeStart: this.twoformInline.checkTimeStart
					? moment(this.twoformInline.checkTimeStart).valueOf()
					: '',
				checkTimeEnd: this.twoformInline.checkTimeEnd
					? moment(this.twoformInline.checkTimeEnd).valueOf()
					: '',
			}
			if (this.littleShow) {
				paramJson.brandIdList = this.formInline.brandIdList
			}
			if (this.moreShow) {
				paramJson.brandIdList = this.moreformInline.brandIdList
			}
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		// 多选
		selectionChange(row) {
			this.selectionData = row
		},
		handleChange(e) {
			console.log(e)
			this.goodsCategoryId = e[e.length - 1]
			this.getYouxuanGoodsAuditListByParam(true)
		},
	},
}
</script>

<style lang="scss" scope>
.brandSelect {
	width: 100%;
	display: flex;
	justify-content: space-between;
	margin-bottom: 16px;
}
.brandLeft {
	display: flex;
}
.one {
	font-size: 14px;
	color: #606266;
	min-width: 46px;
}
.brandRight {
	color: #4498e0;
	cursor: pointer;
	min-width: 40px;
}
.moreSelect {
	display: flex;
	margin-bottom: 16px;
}
.two {
	// flex: 1;
	width: 100%;
}
.t-top {
	width: 100%;
	border: 1px solid #e6e6e6;
	padding: 10px 0 0 10px;
	box-sizing: border-box;
	height: 200px;
	overflow: hidden;
	overflow-y: auto;
}
.t-bot {
	width: 100%;
	padding: 10px;
	border: 1px solid #e6e6e6;
	border-top: none;
	font-size: 16px;
	color: #4c4c4c;
	word-break: break-all;
	word-wrap: break-word;
}
.tb-b {
	width: 100%;
	text-align: center;
	margin-top: 20px;
}
.mb10 {
	margin-bottom: 10px;
}
.poster_img {
	width: 50px;
	height: 50px;
	line-height: 50px;
	margin-right: 6px;
	// margin-right: 20px;
}
.info {
	display: flex;
	align-items: center;
	color: #4498e0;
	cursor: pointer;
}
</style>

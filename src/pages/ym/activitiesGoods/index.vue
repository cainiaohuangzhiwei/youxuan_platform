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
				:selectionChange="selectionChange"
				:columns="tableColumns106"
				:pagination="page106"
				:data="tableData106"
				:span-method="objectSpanMethod"
			>
				<template slot="goodsDefaultImage" slot-scope="scope">
					<div class="slot active">
						<div>
							<img
								class="goods_img"
								:src="getSmallImg(scope.row.goodPic)"
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
				<template slot="specTwo" slot-scope="scope">
					<div v-if="scope.row.barCode">条形码：{{ scope.row.barCode }}</div>
					<div style="display: inline-flex">
						<p v-if="scope.row.specOne">{{ scope.row.specOne }}</p>
						<p v-if="scope.row.specTwo">/{{ scope.row.specTwo }}</p>
						<p v-if="scope.row.specThree">/{{ scope.row.specThree }}</p>
					</div>
				</template>
				<template slot="killPrice" slot-scope="scope">
					<div
						style="color: red"
						v-if="
							accSub(
								scope.row.killPrice,
								scope.row.lowestSellingPriceLastThirtyDays
							) > 0
						"
					>
						{{ scope.row.killPrice }}
					</div>
					<div v-else>{{ scope.row.killPrice }}</div>
				</template>
			</yx-table>
			<!-- //弹窗 -->
			<Dialog
				:title="modifyTitle"
				:visible="modifyGoodsLoding"
				width="80%"
				:bottomBtn="modifyBottomBtn"
				@before-close="modifyGoodsLoding = false"
			>
				<yx-table
					:columns="inventoryTable"
					:pagination="inventoryPage"
					:data="inventoryTableData"
					:span-method="objectSpanMethodGoods"
				>
					<template slot="goodsInventory" slot-scope="scope">
						<div class="slot active">
							<div>
								<p>
									<span class="number">货号：{{ scope.row.goodsNumber }}</span>
								</p>
								<p class="goods_name">{{ scope.row.goodsName }}</p>
							</div>
						</div>
					</template>
					<template slot="killPrice" slot-scope="scope">
						<div class="slot active">
							<div style="display: flex">
								<el-input
									:disabled="disabledInput"
									onkeyup="this.value=this.value.match(/\d+\.?\d{0,3}/);this.dispatchEvent(new Event('input'))"
									min="1"
									v-model="scope.row.killPrice"
								></el-input>
								<span class="el-icon-edit" style="padding: 10px"></span>
							</div>
						</div>
					</template>
					<template slot="killNum" slot-scope="scope">
						<div class="slot active" v-if="scope.row.shelfState === 1">
							<div style="display: flex">
								<el-input
									type="number"
									onkeyup="this.value=parseInt(this.value.replace(/[^\d]/g,''))"
									min="1"
									v-model="scope.row.killNum"
								></el-input>
								<span class="el-icon-edit" style="padding: 10px"></span>
							</div>
						</div>
						<!-- :min="seckillQuantityList[scope.index].killNum" -->
						<div class="slot active" v-else>
							<el-input-number
								size="medium"
								v-model="scope.row.addKillNum"
								:min="0"
								@input.native="onInputNumber"
							></el-input-number>
						</div>
					</template>
					<template slot="activitySortOrder" slot-scope="scope">
						<div class="slot active">
							<div style="display: flex">
								<el-input
									type="number"
									onkeyup="this.value=parseInt(this.value.replace(/[^\d]/g,''))"
									min="1"
									v-model="scope.row.activitySortOrder"
								></el-input>
								<span class="el-icon-edit" style="padding: 10px"></span>
							</div>
						</div>
					</template>
					<template slot="specOne" slot-scope="scope">
						<div v-if="scope.row.barCode">条形码：{{ scope.row.barCode }}</div>
						<div style="display: inline-flex">
							<p v-if="scope.row.specOne">{{ scope.row.specOne }}</p>
							<p v-if="scope.row.specTwo">/{{ scope.row.specTwo }}</p>
							<p v-if="scope.row.specThree">/{{ scope.row.specThree }}</p>
						</div>
					</template>
				</yx-table>
			</Dialog>

			<Dialog
				title="查看数据"
				:visible="viewDataLoding"
				width="50%"
				:bottomBtn="viewDataBottomBtn"
				@before-close="viewDataLoding = false"
			>
				<div style="font-weight: bold; margin-bottom: 20px">
					下单秒杀数量：{{ goodsTotalQuantity }}，有效订单数：{{
						validOrderTotalCount
					}}
				</div>
				<yx-table
					v-loading="loading"
					:columns="viewDataTable"
					:pagination="stockUpdatePage"
					:data="lookTableData"
				>
					<!-- 订单号 -->
					<template slot="orderSn" slot-scope="scope">
						<router-link :to="`/business/orderDetails/${scope.row.orderId}`"
							><el-button type="text">{{
								scope.row.orderSn
							}}</el-button></router-link
						>
					</template>
				</yx-table>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
// import { getConstantValueByKey } from '@/utils/helper/common'
// import { isNull } from '@/utils/helper/common'
import { getSmallImg } from '@/utils/imageTool'

import {
	queryListGoods,
	batchGoodsShelves,
	querySeckillOrder,
	totalSeckillOrder,
	updateGoodsSpec,
	deleteById,
	secKillActivityGoodsExport,
} from '@/api/secKillActivity'
import { isNull } from '@/utils/helper/common'
import { downloadFile, accSub } from '@/utils/helper/common'
// import moment from 'moment'

export default {
	name: 'activitiesGoods',
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},

	props: [],
	data() {
		return {
			accSub,
			loading: false, //活动商品列表loading
			lookTableData: [], //查看数据表格
			getSmallImg: getSmallImg,
			modifyGoodsLoding: false, //修改商品弹窗
			outboundLoding: false, //查看数据表格loading
			selectedList: [], //批量勾选list
			viewDataLoding: false, //查看数据
			formData105: {
				//列表查询入参
				goodsNumbers: '',
				shelfState: '',
			},
			viewDataBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.viewDataLoding = false //查看数据
					},
				},
			],
			//修改商品操作
			modifyBottomBtn: [
				{
					title: '取 消',
					type: '',
					click: () => {
						this.modifyGoodsLoding = false
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
					title: '商品货号',
					type: 'textarea',
					dataIndex: 'goodsNumbers',
					placeholder: '请输入货号搜索,货号与货号之间使用逗号隔开或者换行',
				},
				{
					type: 'select',
					title: '活动商品状态',
					dataIndex: 'shelfState',
					placeholder: '请选择活动商品状态',
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
						this._queryListGoods(true)
					},
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
						this._queryListGoods(true, e)
					},
				},
				{
					title: '导入添加活动商品',
					type: 'primary',
					auth: 'secKillActivityGoodsImport',
					click: () => {
						this.$router.push({
							path: `/ym/activitiesGoodsImport/${this.$route.params.secKillActivityId}`,
						})
					},
					customRender: (action) => {
						action.hide = this.$route.params.activityStatus === 2
						return action
					},
				},
				{
					title: '导出商品信息',
					type: 'primary',
					auth: '',
					click: () => {
						this.secKillActivityGoodsExport()
					},
				},
				{
					title: '批量上架',
					type: 'primary',
					auth: 'batchGoodsShelves',
					click: () => {
						let selectGoodsList = this.selectedList.map((item) => {
							return item.secKillActivityGoodsId
						})
						let arr = this.uniqueArr(Object.assign([], selectGoodsList))
						if (arr.length === 0) {
							this.$message.warning({ message: '请勾选需要批量上架的商品' })
							return
						} else {
							this.$alert(
								'是否批量上架' + arr.length + '条活动商品',
								'批量上架',
								{
									confirmButtonText: '确定',
									callback: (action) => {
										if (action === 'confirm') {
											this.hitDescendShelf()
										}
									},
								}
							)
						}
					},
					customRender: (action) => {
						action.hide = this.$route.params.activityStatus === 2
						return action
					},
				},
			],
			tableData106: [],
			inventoryTableData: [], //修改商品弹窗表格
			seckillQuantityList: [], //秒杀数量的监听
			viewDataTable: [
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '订单号',
				},
				{
					type: 'string',
					dataIndex: 'goodsQuantity',
					title: '秒杀商品数',
				},
				{
					type: 'string',
					dataIndex: 'valid',
					title: '是否有效',
					customRender: (row) => {
						return row.valid === 1 ? '是' : '否'
					},
				},
			],
			inventoryTable: [
				{
					type: 'custom',
					dataIndex: 'goodsInventory',
					title: '商品信息',
				},
				{
					type: 'custom',
					dataIndex: 'specOne',
					title: '规格信息',
				},
				{
					title: '秒杀价',
					type: 'custom',
					dataIndex: 'killPrice',
				},
				{
					title: '可秒杀数量',
					width: '220',
					type: 'string',
					dataIndex: 'killNum',
				},
				{
					title: '可秒杀数量',
					width: '220',
					type: 'custom',
					dataIndex: 'killNum',
				},
				{
					title: '活动排序',
					type: 'custom',
					dataIndex: 'activitySortOrder',
				},
			],
			tableColumns106: [
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场名称',
				},
				{
					type: 'custom',
					dataIndex: 'goodsDefaultImage',
					title: '商品信息',
				},
				{
					type: 'custom',
					dataIndex: 'specTwo',
					title: '规格信息',
				},
				{
					dataIndex: 'supplyPrice',
					title: '供货价',
				},
				{
					dataIndex: 'lowestSellingPriceLastThirtyDays',
					title: '近30天最低的最低销售价',
					customRender: (row) => {
						return row.lowestSellingPriceLastThirtyDays
							? row.lowestSellingPriceLastThirtyDays
							: '-'
					},
				},
				{
					dataIndex: 'killPrice',
					type: 'custom',
					title: '秒杀价',
				},
				{
					dataIndex: 'killNum',
					title: '可秒杀数量',
				},
				{
					dataIndex: 'virtualNum',
					title: '虚拟已秒杀数量',
				},
				{
					type: 'string',
					dataIndex: 'activitySortOrder',
					title: '活动排序',
				},
				// {
				// 	type: 'string',
				// 	dataIndex: 'businessMarketingProportion',
				// 	title: '商家承担营销比例',
				// 	customRender: (row) => {
				// 		return row.businessMarketingProportion
				// 			? row.businessMarketingProportion + '%'
				// 			: '-'
				// 	},
				// },
				{
					type: 'string',
					dataIndex: 'creator',
					title: '提报人',
				},
				{
					type: 'string',
					dataIndex: 'shelfState',
					title: '状态',
					customRender: (row) => {
						return row.shelfState === 1 ? '下架' : '上架'
					},
				},
				{
					type: 'action',
					title: '出入库记录',
					width: '150',
					actions: [
						{
							title: '上架',
							auth: 'batchGoodsShelves',
							popconfirm: true,
							popconfirmTitle: '是否上架该活动商品',
							confirm: (row) => {
								this.hitDescendShelf(row)
							},
							customRender: (action, row) => {
								action.hide = this.$route.params.activityStatus === 2
								action.title = row.shelfState == 1 ? '上架' : '下架'
								action.popconfirmTitle =
									row.shelfState == 1
										? '是否上架该活动商品'
										: '是否下架该活动商品'
								return action
							},
						},
						{
							title: '修改商品',
							auth: 'updateGoodsSpec',
							click: (row) => {
								this.getRecomposeGoods(row)
							},
							customRender: (action) => {
								action.hide = this.$route.params.activityStatus === 2
								return action
							},
						},
						{
							title: '删除',
							auth: 'secKillActivityGoodsDeleteById',
							click: (row) => {
								this.$alert('是否删除该活动商品', '删除活动商品', {
									confirmButtonText: '确定',
									callback: (action) => {
										if (action === 'confirm') {
											this.getDeleteById(row)
										}
									},
								})
							},
							customRender: (action, row) => {
								action.hide =
									row.shelfState === 2 ||
									this.$route.params.activityStatus === 2
								return action
							},
						},
						{
							title: '查看数据',
							click: (row) => {
								this.viewDataGoodsId = row.goodsId
								this.getViewDataLoding(row)
								this.getTotalSeckillOrder(row)
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
					this._queryListGoods()
				},
			},
			stockUpdatePage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getViewDataLoding()
				},
			},
			spanArr: [],
			amend: [],
			pos: '', //活动商品列表合并
			branches: '', //修改商品合并
			modifyTitle: '', //修改商品弹窗标题
			disabledInput: false, //上架状态禁操作
			validOrderTotalCount: 0, //有效订单数
			goodsTotalQuantity: 0, // 下单秒杀数量
			viewDataGoodsId: null,
		}
	},

	created() {
		this._queryListGoods()
	},

	methods: {
		onInputNumber(e) {
			this.$message.closeAll()
			// 验证是否是纯数字
			let isNumber = /^\d*$/.test(e.target.value)
			// 过滤非数字
			e.target.value = e.target.value.replace(/\D/g, '')
			if (!isNumber || e.target.value < -1) {
				this.$message.warning('只能输入大于等于0的整数')
			}
			e.target.value =
				(e.target.value >= -1 && e.target.value.match(/^\d*/g)[0]) || 0
		},
		async getDeleteById(row) {
			const {
				data: { resultCode },
			} = await deleteById({
				secKillActivityGoodsId: row.secKillActivityGoodsId,
			})
			if (resultCode === 0) {
				this.$message({
					message: '成功!',
					type: 'success',
				})
				this._queryListGoods()
			}
		},
		//查看数据
		findSearchviewDataParams(flag) {
			let paramJson = Object.assign(
				{},
				{
					pageSize: 10,
					pageNum: 1,
				}
			)
			paramJson.pageSize = this.stockUpdatePage.length
			// 当前页的条数开始
			if (flag) {
				this.stockUpdatePage.currentPage = 1
			}
			paramJson.pageNum = this.stockUpdatePage.currentPage
			paramJson.goodsId = this.viewDataGoodsId
			paramJson.actId = Number(this.$route.params.secKillActivityId)
			return paramJson
		},
		//查看数据列表数据
		async getViewDataLoding(row, flag) {
			this.viewDataLoding = true
			let paramJson = this.findSearchviewDataParams(flag)
			const {
				data: { resultCode, resultData, total },
			} = await querySeckillOrder(paramJson)
			if (resultCode === 0) {
				this.lookTableData = resultData || []
				this.stockUpdatePage.count = total
			} else {
				this.lookTableData = []
				this.stockUpdatePage.count = 0
			}
		},
		//查看数据信息汇总
		async getTotalSeckillOrder(row, flag) {
			let paramJson = this.findSearchviewDataParams(flag)
			// paramJson.goodsId = row.goodsId
			const {
				data: { resultCode, resultData },
			} = await totalSeckillOrder(paramJson)
			if (resultCode === 0) {
				this.validOrderTotalCount = resultData.validOrderTotalCount
				this.goodsTotalQuantity = resultData.goodsTotalQuantity
			} else {
				this.validOrderTotalCount = 0
				this.goodsTotalQuantity = 0
			}
		},
		//去重
		uniqueArr(array) {
			const obj = {}
			return array.filter((item) => {
				// 防止key重复
				const newItem = item + JSON.stringify(item)
				// eslint-disable-next-line no-prototype-builtins
				return obj.hasOwnProperty(newItem) ? false : (obj[newItem] = true)
			})
		},
		//上下架
		async hitDescendShelf(row) {
			let paramJson = {}
			if (!row) {
				let selectGoodsList = this.selectedList.map((item) => {
					return item.secKillActivityGoodsId
				})
				let arr = this.uniqueArr(Object.assign([], selectGoodsList))
				paramJson.secKillActivityGoodsId = arr
				paramJson.shelfState = 2
			} else {
				paramJson.secKillActivityGoodsId = [row.secKillActivityGoodsId]
				paramJson.shelfState = row.shelfState == 1 ? 2 : 1 //状态 2-上架，1-下架
			}
			paramJson.secKillActivityId = this.$route.params.secKillActivityId
			// return
			const {
				data: { resultCode },
			} = await batchGoodsShelves(paramJson)
			if (resultCode == 0) {
				this.$message({
					message: '成功!',
					type: 'success',
				})
				this._queryListGoods()
			}
		},
		// 处理合并表格
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
		// 处理合并表格
		getSpanArrS(data) {
			data.forEach((item, index) => {
				if (index == 0) {
					this.amend.push(1)
					this.branches = 0
				} else {
					// 判断当前元素与上一个元素是否相同
					if (data[index].goodsId == data[index - 1].goodsId) {
						this.amend[this.branches] += 1
						this.amend.push(0)
					} else {
						this.amend.push(1)
						this.branches = index
					}
				}
			})
		},
		// 修改商品弹窗表格合并
		objectSpanMethodGoods({ rowIndex, columnIndex }) {
			if (
				columnIndex === 0 ||
				columnIndex === 5 ||
				(!this.disabledInput && columnIndex === 4)
			) {
				const _row = this.amend[rowIndex]
				const _col = _row > 0 ? 1 : 0
				return {
					// [0,0] 表示这一行不显示， [2,1]表示行的合并数
					rowspan: _row,
					colspan: _col,
				}
			}
		},
		// 活动商品列表合并
		objectSpanMethod({ rowIndex, columnIndex }) {
			if (
				columnIndex === 0 ||
				columnIndex === 1 ||
				columnIndex === 2 ||
				columnIndex === 9 ||
				columnIndex === 10 ||
				columnIndex === 11 ||
				columnIndex === 12 ||
				columnIndex === 13
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

		async quantityAudit() {
			let paramJson = {}
			let goodsSpecIdList = []
			this.inventoryTableData.forEach((item) => {
				goodsSpecIdList.push({
					addKillNum: item.addKillNum,
					killNum: item.killNum, //可秒杀数量
					killPrice: item.killPrice, //秒杀价格
					activitySortOrder: Number(
						this.inventoryTableData[0].activitySortOrder
					), //活动排序
					goodsName: item.goodsName, //商品名称
					goodsNumber: item.goodsNumber, //商品货号
					specOne: item.specOne, //规格一
					specTwo: item.specTwo, //规格二
					specThree: item.specThree, //规格三
					secKillGoodsSpecId: item.secKillGoodsSpecId, //活动商品规格id
					secKillGoodsId: item.secKillGoodsId, //秒杀活动商品id
					goodsSpecId: item.goodsSpecId, //商品规格id
					barCode: item.barCode, //条形码
					secKillActivityId: item.secKillActivityId,
					shelfState: item.shelfState,
				})
			})
			paramJson.goodsSpecIdList = goodsSpecIdList
			let killPriceVerify = false
			let killNumVerify = false
			let activitySortOrderVerify = false

			try {
				paramJson.goodsSpecIdList.map((item) => {
					if (isNull(item.killNum)) {
						killNumVerify = true
					}
					if (isNull(item.killPrice)) {
						killPriceVerify = true
					}
					if (!item.activitySortOrder) {
						activitySortOrderVerify = true
					}
				})
			} catch (e) {
				console.error('失败', e)
			}
			if (killNumVerify) {
				this.$message.warning({ message: '请输入正确的可秒杀数量' })
				return
			}
			if (killPriceVerify) {
				this.$message.warning({ message: '请输入正确的秒杀价' })
				return
			}
			if (activitySortOrderVerify) {
				this.$message.warning({ message: '请输入正确的活动排序' })
				return
			}
			console.log('修改商品入参：', paramJson)
			// return
			let {
				data: { resultCode },
			} = await updateGoodsSpec(paramJson)
			if (resultCode == 0) {
				this.modifyGoodsLoding = false
				this.$message.success('操作成功')
				this._queryListGoods()
			}
		},
		selectionChange(list) {
			this.selectedList = list
		},

		getRecomposeGoods(row) {
			this.modifyGoodsLoding = true
			this.modifyTitle =
				row.shelfState == 1 ? '修改商品（下架）' : '修改商品（上架）'
			this.disabledInput = row.shelfState == 2 ? true : false
			row.shelfState == 2
				? (this.inventoryTable[4].title = '加可秒杀数量（只增不减）')
				: '可秒杀数量'
			if (row.shelfState == 1) {
				this.inventoryTable[3].hide = true
			} else {
				this.inventoryTable[3].hide = false
			}
			//修改商品
			let arryInventory = []
			row.goodsSpecIdList.map((item) => {
				arryInventory.push(
					Object.assign({}, item, {
						addKillNum: 0,
						shelfState: row.shelfState, //上下架状态
						goodsName: row.goodsName, //商品名称
						goodsNumber: row.goodsNumber, //商品货号
						activitySortOrder: row.activitySortOrder, //活动排序
						specOne: item.specOne, //规格一
						specTwo: item.specTwo, //规格二
						specThree: item.specThree, //规格三
						secKillGoodsSpecId: item.secKillGoodsSpecId, //活动商品规格id
						secKillGoodsId: item.secKillGoodsId, //秒杀活动商品id
						goodsSpecId: item.goodsSpecId, //商品规格id
						killPrice: item.killPrice, //秒杀价格
						barCode: item.barCode, //条形码
						goodsId: row.goodsId, //商品id
					})
				)
			})
			this.inventoryTableData = arryInventory
			this.seckillQuantityList = row.goodsSpecIdList
			console.log('========', this.inventoryTableData)
			this.merageInit(2)
			this.getSpanArrS(this.inventoryTableData)
		},
		findSearchParams106(flag) {
			let paramJson = Object.assign(
				{
					pageSize: 10,
					pageNum: 1,
				},
				this.formData105
			)
			paramJson.pageSize = this.page106.length
			// 当前页的条数开始
			if (flag) {
				this.page106.currentPage = 1
			}
			paramJson.pageNum = this.page106.currentPage
			let blank = /[\r\n]+/g.test(paramJson.goodsNumbers)
			if (paramJson.goodsNumbers.length > 0 && !blank) {
				let goodsCoupon
				goodsCoupon = String(paramJson.goodsNumbers)
				goodsCoupon = goodsCoupon.split(',')
				paramJson.goodsNumbers = goodsCoupon
			} else if (blank) {
				paramJson.goodsNumbers = paramJson.goodsNumbers.replace(/\n/g, ',')
				paramJson.goodsNumbers = paramJson.goodsNumbers.replace(/\s*/g, '')
				paramJson.goodsNumbers =
					paramJson.goodsNumbers.length > 0
						? paramJson.goodsNumbers.split(',')
						: []
			} else {
				paramJson.goodsNumbers = []
			}
			//商品货号
			return paramJson
		},
		// 初始合并行的数组
		merageInit(v) {
			if (v === 1) {
				this.spanArr = []
				this.pos = 0
			} else {
				this.amend = []
				this.branches = 0
			}
		},
		_queryListGoods: async function (flag, e) {
			let paramJson = this.findSearchParams106(flag)
			paramJson.secKillActivityId = this.$route.params.secKillActivityId
			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			this.loading = true
			let {
				data: { resultCode, resultData, total },
			} = await queryListGoods(paramJson, custom)
			this.loading = false
			this.tableData106 = []
			if (resultCode === 0) {
				// this.tableData106 = resultData
				const list = resultData
				this.page106.count = total
				list.forEach((item) => {
					if (item.goodsSpecIdList && item.goodsSpecIdList.length) {
						item.goodsSpecIdList.forEach((v) => {
							const current = {
								goodsSpecIdList: item.goodsSpecIdList,
								activitySortOrder: item.activitySortOrder, //活动排序
								businessMarketingProportion: item.businessMarketingProportion, //商家承担营销比例
								creator: item.creator, //提报人
								goodPic: item.goodPic, //商品图片
								goodsGroupId: item.goodsGroupId, //分组id
								brandName: item.brandName, //分组名称 会场名称
								goodsId: item.goodsId, //	商品id
								goodsName: item.goodsName, //商品名称
								goodsNumber: item.goodsNumber, //商品货号
								secKillActivityGoodsId: item.secKillActivityGoodsId, //活动商品id
								secKillActivityId: item.secKillActivityId, //秒杀活动id
								shelfState: item.shelfState, //上下架，1：下架，2：上架
								barCode: v.barCode, //条形码
								goodsSpecId: v.goodsSpecId, //商品规格id
								killNum: v.killNum, //可秒杀数量
								killPrice: v.killPrice, //秒杀价格
								lowestSellingPriceLastThirtyDays:
									v.lowestSellingPriceLastThirtyDays, //近30天最低的最低销售价
								secKillGoodsId: v.secKillGoodsId, //秒杀活动商品id
								secKillGoodsSpecId: v.secKillGoodsSpecId, //活动商品id
								specOne: v.specOne, //规格一
								specTwo: v.specTwo, //规格二
								specThree: v.specThree, //规格三
								supplyPrice: v.supplyPrice, //供货价
								virtualNum: v.virtualNum, //虚拟可秒杀数量
							}
							this.tableData106.push(current)
						})
					}
				})
				this.merageInit(1)
				this.getSpanArr(this.tableData106)
			} else {
				this.page106.count = 0
				this.tableData106 = []
			}
		},
		secKillActivityGoodsExport() {
			let paramJson = this.findSearchParams106()
			if (this.selectedList.length > 0) {
				let goodsNumbers = this.selectedList.map((item) => {
					return item.goodsNumber
				})
				paramJson.goodsNumbers = goodsNumbers
			}
			this.$confirm('确定导出？', '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						paramJson.secKillActivityId = this.$route.params.secKillActivityId
						let { data } = await secKillActivityGoodsExport(paramJson)
						downloadFile(data, '秒杀活动商品列表.xlsx')
					}
				},
			})
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

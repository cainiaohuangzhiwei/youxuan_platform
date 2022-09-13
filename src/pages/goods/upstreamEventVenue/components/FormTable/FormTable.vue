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
				:data="tableDataBrand"
				:selectionChange="selectionChange"
			>
				<template slot="syncTime" slot-scope="scope">
					<span style="color: #1890ff">{{
						scope.row.syncTime
							? moment(scope.row.syncTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					}}</span>
				</template>
			</yx-table>
			<!-- 实时同步会场活动 -->
			<Dialog
				:title="dialogTitle105"
				:visible.sync="dialogVisible105"
				:width="dialogWidth105"
				@before-close="handleCloseDialog105"
			>
				<div class="searchid">
					此功能用于通过手动搜索爱库存活动ID，进行实时同步爱库存活动会场
				</div>

				<yx-form
					ref="dialog106"
					labelWidth="100px"
					:data="formData106"
					:items="formCfg106"
					:formAction="formAction106"
					:rules="formRules106"
					:inline="true"
				>
				</yx-form>
				<el-button type="primary" class="Synchronize" @click="synchronizeClick"
					>批量同步
				</el-button>

				<yx-table
					:select="true"
					v-loading="Synloading"
					:columns="tableColumns107"
					:data="SynchronizeBrand"
					:selectionChange="selectionBrand"
				>
				</yx-table>
			</Dialog>
		</basicContainer>

		<Dialog
			:visible.sync="exportTaskDialog"
			:width="'30%'"
			:bottomBtn="exportTaskBtn"
		>
			<div>下载失败，已创建导出任务，请稍后到下载列表下载数据</div>
		</Dialog>

		<div style="position: absolute; height: 0; overflow: hidden">
			<el-image
				ref="imagePreview"
				:src="businessLicenseImg"
				:preview-src-list="[businessLicenseImg]"
			>
			</el-image>
		</div>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import { wgGetDate } from '@/utils/helper/common'
import { imgCosServerPath } from '@/utils/imageTool'
import Dialog from '@/components/Dialog'

import {
	searchBrandRecord,
	syncGoods,
	syncGoodsInventory,
	getActivityDetail,
	createActFixedPrice,
	akcBrandListExport,
	queryActivityList,
	syncActivityList,
} from '@/api/brandRecord'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},
	props: [],
	data() {
		return {
			moment: moment,
			loading: false,
			Synloading: false,
			tableDataBrand: [],
			selectedList: [],
			businessLicenseImg: '',
			formData105: {
				brandParentName: '', //品牌名称
				categoryFrontName: '', //品类名称
				name: '', //上游活动名称
				endStatus: '', //是否结束 0未结束 1已经结束
				refBrandName: '', //会场名称
				startTime: wgGetDate().getMonthStartDate, //活动开始时间
				endTime: wgGetDate().getMonthEndDate, //活动结束时间
				type: '', //渠道类型
				fixedPriceFlag: '', //一口价标志。1：存在；0不存在
			},
			// 实时同步会场data
			formData106: {
				id: '', //活动ID
				brand: '', //品牌名称
				category: '', //品类名称
				name: '', //活动名称
				actIdList: [],
				startDate: '', //活动开始时间
				endDate: '', //活动结束时间
			},
			formCfg105: [
				{
					type: 'input',
					title: '会场名称',
					dataIndex: 'refBrandName',
					placeholder: '请输入会场名称',
				},
				{
					type: 'input',
					title: '品牌',
					dataIndex: 'brandParentName',
					placeholder: '请输入品牌名称',
				},
				{
					type: 'input',
					title: '品类',
					dataIndex: 'categoryFrontName',
					placeholder: '请输入品类名称',
				},
				{
					type: 'input',
					title: '上游活动名称',
					dataIndex: 'name',
					placeholder: '请输入上游活动名称',
				},
				{
					type: 'select',
					title: '渠道',
					dataIndex: 'sourceType',
					placeholder: '请选择渠道',
					label: 'value',
					options: this.$store.state.app.constant.SOURCE_NAME,
				},
				{
					type: 'select',
					title: '是否有一口价活动',
					dataIndex: 'fixedPriceFlag',
					placeholder: '请选择是否有一口价活动',
					label: 'value',
					options: [
						{
							fixedPriceFlag: '',
							value: '全部',
						},
						{
							fixedPriceFlag: '0',
							value: '否',
						},
						{
							fixedPriceFlag: '1',
							value: '是',
						},
					],
				},
				{
					title: '活动时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					title: '',
					type: 'radio',
					dataIndex: 'endStatus',
					label: 'value',
					options: [
						{
							endStatus: 0,
							value: '未结束',
						},
						{
							endStatus: 1,
							value: '已结束',
						},
					],
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
						this.getSearchBrandRecord(true, e)
					},
				},
				{
					title: '批量同步商品',
					type: 'primary',
					auth: 'syncGoods',
					click: () => {
						if (this.selectedList.length == 0) {
							this.$message.warning({ message: '请勾选批量同步的商品' })
							return
						}
						this.$confirm(
							`确认要批量同步${this.selectedList.length}个商品吗？`,
							'提示',
							{
								type: 'warning',
								callback: async (action) => {
									if (action === 'confirm') {
										this.synchronousGoods(null, 2)
									}
								},
							}
						)
					},
				},
				{
					title: '批量同步一口价活动',
					type: 'primary',
					auth: 'createActFixedPrice01',
					click: () => {
						if (this.selectedList.length == 0) {
							this.$message.warning({
								message: '请勾选批量同步一口价活动的商品',
							})
							return
						}
						this.$confirm(
							`确认要批量同步一口价活动${this.selectedList.length}个会场吗？，确认后，同步会场下一口价商品的活动信息，可在上游一口价活动信息列表查看，并同步一口价商品信息`,
							'提示',
							{
								type: 'warning',
								callback: async (action) => {
									if (action === 'confirm') {
										this.synchronousGoods(null, 5)
									}
								},
							}
						)
					},
				},
				{
					title: '导出',
					type: 'success',
					click: () => {
						this.exportUpstreamEventVenue()
					},
				},
				{
					title: '下载中心',
					type: 'success',
					click: () => {
						this.$router.push({
							path: `/business/downloadCenter`,
						})
					},
				},
				// 实时同步会场
				{
					title: '实时同步活动会场',
					type: 'primary',
					click: () => {
						this.dialogVisible105 = true
					},
				},
			],
			SynchronizeBrand: [],
			tableColumns107: [
				{
					width: 80,
					type: 'string',
					dataIndex: 'id',
					title: '活动ID',
				},
				{
					type: 'string',
					dataIndex: 'name',
					title: '活动名称',
				},
				{
					type: 'string',
					dataIndex: 'brand',
					title: '品牌',
				},
				{
					type: 'string',
					dataIndex: 'category',
					title: '品类',
				},
				{
					type: 'string',
					dataIndex: 'startDate',
					title: '活动开始时间',
				},
				{
					type: 'string',
					dataIndex: 'endDate',
					title: '活动结束时间',
				},
			],
			tableColumns106: [
				{
					width: 80,
					type: 'string',
					dataIndex: 'refBrandId',
					title: '会场ID',
				},
				{
					type: 'string',
					dataIndex: 'refBrandName',
					title: '会场名称',
				},
				{
					type: 'string',
					dataIndex: 'name',
					title: '上游活动名称',
				},
				{
					type: 'string',
					dataIndex: 'description',
					title: '活动描述',
				},
				{
					type: 'string',
					dataIndex: 'brandParentName',
					title: '品牌',
				},
				{
					type: 'image',
					dataIndex: 'brandLogoUrl',
					title: '品牌logo',
				},
				{
					type: 'string',
					dataIndex: 'categoryFrontName',
					title: '品类',
				},
				{
					type: 'string',
					dataIndex: 'startTime',
					title: '开始时间',
					customRender: (row) => {
						return row.startTime
							? moment(row.startTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'endTime',
					title: '结束时间',
					customRender: (row) => {
						return row.endTime
							? moment(row.endTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'invalidAreas',
					title: '不发货地区',
				},
				{
					type: 'string',
					dataIndex: 'syncState',
					title: '商品同步状态',
					customRender: (row) => {
						return row.syncState == 0
							? '待同步'
							: row.syncState == 1
							? '同步中'
							: row.syncState == 2
							? '已同步'
							: row.syncState == 3
							? '同步失败'
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'fixedPriceFlag',
					title: '是否有一口价活动',
					customRender: (row) => {
						return row.fixedPriceFlag == 0
							? '否'
							: row.fixedPriceFlag == 1
							? '是'
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'couponDesc',
					title: '上游优惠券',
				},
				{
					width: 60,
					type: 'string',
					dataIndex: 'refundInsurance',
					title: '运费险',
					customRender: (row) => {
						return row.refundInsurance == 0
							? '否'
							: row.refundInsurance == 1
							? '是'
							: '-'
					},
				},
				{
					width: 100,
					type: 'string',
					dataIndex: 'activeType',
					title: '档期类型',
					customRender: (row) => {
						return row.activeType == 2
							? '常规档期'
							: row.activeType == 3
							? 'POP档期'
							: '-'
					},
				},
				{
					width: 100,
					type: 'string',
					dataIndex: 'isExchangeRefundGoods',
					title: '七天无理由',
					customRender: (row) => {
						return row.isExchangeRefundGoods == 0
							? '不支持'
							: row.isExchangeRefundGoods == 1
							? '支持'
							: row.isExchangeRefundGoods == 2
							? '拆封后不支持'
							: row.isExchangeRefundGoods == 3
							? '激活后不支持'
							: '-'
					},
				},
				{
					width: 120,
					type: 'string',
					dataIndex: 'content',
					title: '发货说明',
				},
				{
					type: 'custom',
					dataIndex: 'syncTime',
					title: '最后同步时间',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '同步商品',
							auth: 'syncGoods',
							click: (row) => {
								this.$confirm(
									row.fixedPriceFlag == 1
										? '确认后，同步此会场下所有商品，若此会场有一口价活动商品，在活动期内同步的商品价格为一口价价格'
										: '是否确认同步该商品',
									'同步商品',
									{
										type: 'warning',
										callback: async (action) => {
											if (action === 'confirm') {
												this.synchronousGoods(row, 1)
											}
										},
									}
								)
							},
						},
						{
							title: '同步库存',
							auth: 'syncGoodsInventory',
							popconfirm: true,
							popconfirmTitle: '确认同步该商品库存？',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this.synchronizationInventory(row)
							},
						},
						{
							title: '同步非一口价商品',
							auth: 'syncGoods01',
							click: (row) => {
								this.$confirm(
									'确认后，只会同步此活动下无“一口价”活动的商品。',
									'同步非一口价商品',
									{
										type: 'warning',
										callback: async (action) => {
											if (action === 'confirm') {
												this.synchronousGoods(row, 3)
											}
										},
									}
								)
							},
							customRender: (action, row) => {
								action.hide = !row.fixedPriceFlag
								return action
							},
						},
						{
							title: '同步一口价活动',
							auth: 'createActFixedPrice02',
							click: (row) => {
								this.$confirm(
									'确认后，同步会场下一口价商品的活动信息，可在上游一口价活动信息列表查看，并同步一口价商品信息',
									'同步一口价活动',
									{
										type: 'warning',
										callback: async (action) => {
											if (action === 'confirm') {
												this.synchronousGoods(row, 4)
											}
										},
									}
								)
							},
							customRender: (action, row) => {
								action.hide = !row.fixedPriceFlag
								return action
							},
						},

						{
							title: '获取营业执照',
							auth: 'getActivityDetail',
							click: (row) => {
								this.syncgetActivityDetail(row)
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
					this.getSearchBrandRecord()
				},
			},
			exportTaskDialog: false,
			exportTaskBtn: [
				{
					title: '进入下载中心',
					auth: '',
					click: () => {
						this.$router.push({
							path: `/business/downloadCenter`,
						})
						this.exportTaskDialog = false
					},
				},
			],
			dialogTitle105: '实时同步活动会场',
			dialogWidth105: '800px',
			dialogVisible105: false,
			formCfg106: [
				{
					title: '活动ID',
					type: 'textarea',

					dataIndex: 'actIdList',
					placeholder:
						'请输入爱库存活动ID搜索，支持批量搜索。活动ID与活动ID之间用逗号隔开或者换行',
				},
			],
			formAction106: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: (e) => {
						this.Synchronize(true, e)
					},
				},
			],
			formRules106: {
				actIdList: [
					{ required: true, message: '请输入爱库存活动ID', trigger: 'blur' },
				],
			},
		}
	},

	created() {
		this.getSearchBrandRecord(true)
	},

	methods: {
		synchronizationInventory: async function (row) {
			console.log('---row--', row)
			let paramJson = {
				activityId: row.activityId,
				activityType: row.type,
				refBrandId: row.refBrandId,
				inventoryChangeId: row.inventoryChangeId,
			}
			let {
				data: { resultCode, resultMsg },
			} = await syncGoodsInventory(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.getSearchBrandRecord(true)
			}
		},
		selectionChange(list) {
			this.selectedList = list
		},
		selectionBrand(list) {
			this.selectedBrandList = list
		},

		synchronousGoods: async function (row, type) {
			let paramJson = []
			let Url
			if (type == 1 || type == 3) {
				console.log('---row--', row)
				let dtoList = {}
				if (type == 3) {
					dtoList.syncType = 1
				}
				Url = syncGoods
				dtoList.activityId = row.activityId
				dtoList.activityType = row.type
				dtoList.refBrandId = row.refBrandId
				paramJson.push(dtoList)
			} else {
				let dtoList
				if (type == 5 || type == 4) {
					paramJson = {}
					if (type == 5) {
						const actIdList = this.selectedList.map((item) => {
							return item.activityId
						})
						paramJson.actIdList = actIdList
					} else {
						paramJson.actIdList = [row.activityId]
					}
					paramJson.syncType = 2
					Url = createActFixedPrice
				} else {
					dtoList = this.selectedList.map((item) => {
						return {
							activityId: item.activityId,
							activityType: item.type,
						}
					})
					Url = syncGoods
					paramJson = dtoList
				}
				console.log('paramJson', paramJson)
			}
			// return
			let {
				data: { resultCode, resultMsg },
			} = await Url(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.getSearchBrandRecord()
			}
		},

		findSearchParams106(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page106.currentPage = 1
			}
			const paramJson = Object.assign(this.formData105, {
				length: this.page106.length,
				// startIndex: (this.page106.currentPage - 1) * this.page106.length,
			})
			paramJson.currentPage = this.page106.currentPage
			paramJson.type = this.formData105.sourceType
			paramJson.startTime = moment(paramJson.startTime).valueOf() || ''
			paramJson.endTime = moment(paramJson.endTime).valueOf() || ''
			return paramJson
		},
		getSearchBrandRecord: async function (flag) {
			let paramJson = this.findSearchParams106(flag)
			this.loading = true
			let {
				data: {
					resultData: { records = [], total = 0 },
					resultCode,
				},
			} = await searchBrandRecord(paramJson)
			if (resultCode == 0) {
				this.tableDataBrand = records
				this.page106.count = total
				this.loading = false
			} else {
				this.page106.count = 0
				this.tableDataBrand = []
				this.loading = false
			}
		},

		async syncgetActivityDetail(row) {
			let paramJson = {
				liveId: row.activityId,
				type: row.type,
			}
			let {
				data: { resultCode, resultMsg, resultData },
			} = await getActivityDetail(paramJson)
			if (resultCode == 0) {
				if (resultData.waterMarkLicense) {
					this.businessLicenseImg = resultData.waterMarkLicense
					this.$refs.imagePreview.clickHandler()
				} else {
					this.$message.error('该活动无营业执照，请联系爱库存运营')
				}
			} else {
				this.$message.error(resultMsg)
			}
		},
		// 导出爱库存会场列表
		exportUpstreamEventVenue: async function () {
			this.loading = true
			const paramJson = Object.assign({}, this.findSearchParams106())
			paramJson.listPath = '商品>上游活动会场'
			const {
				data: { resultData },
			} = await akcBrandListExport(paramJson)
			this.loading = false
			if (resultData.exportDelay) {
				this.exportTaskDialog = true
				return
			}
			if (resultData.remoteFilePath) {
				resultData.remoteFilePath = resultData.remoteFilePath.replace(
					'/data/yhtplusFile/',
					''
				)
				const elt = document.createElement('a')
				elt.setAttribute('href', imgCosServerPath + resultData.remoteFilePath)
				elt.setAttribute('download', 'file.xlsx')
				elt.style.display = 'none'
				document.body.appendChild(elt)
				elt.click()
				document.body.removeChild(elt)
			}
		},
		// 实时同步会场
		Synchronize: async function () {
			const paramJson = Object.assign({}, this.formData106, {
				actIdList: [this.formData106.actIdList],
			})

			if (paramJson.actIdList.length > 0) {
				paramJson.actIdList = paramJson.actIdList.toString()
				paramJson.actIdList = paramJson.actIdList.replace(/(\n)/g, ',')
				paramJson.actIdList = paramJson.actIdList.split(',')
			} else {
				paramJson.actIdList = []
			}
			// 过滤空字符串的actId
			paramJson.actIdList = paramJson.actIdList.filter((item) => {
				return item !== ''
			})

			this.Synloading = true
			const {
				data: { resultData, resultCode },
			} = await queryActivityList(paramJson)

			if (resultCode === 0) {
				this.SynchronizeBrand = resultData
				this.Synloading = false
			} else {
				this.page106.count = 0
				this.SynchronizeBrand = []
				this.Synloading = false
			}
			this.Synloading = false
		},

		handleCloseDialog105() {
			this.formData106.actIdList = []
			this.SynchronizeBrand = []
			this.dialogVisible105 = false
		},

		// 实时同步会场批量同步
		synchronizeClick() {
			if (this.selectedBrandList.length == 0) {
				this.$message.warning({ message: '请先选择活动' })
				return
			}
			this.$confirm(
				`确认要批量同步${this.selectedBrandList.length}个活动吗？`,
				'提示',
				{
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							const paramJson = {}
							const actIdList = this.selectedBrandList.map((item) => {
								return item.id
							})
							paramJson.actIdList = actIdList
							const {
								data: { resultCode },
							} = await syncActivityList(paramJson)
							if (resultCode === 0) {
								this.$message.success('同步成功')

								this.handleCloseDialog105()
							}
						}
					},
				}
			)
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
.searchid {
	margin-bottom: 20px;
}
.Synchronize {
	margin-bottom: 10px;
}
</style>

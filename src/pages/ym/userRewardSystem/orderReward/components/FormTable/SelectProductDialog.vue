<template>
	<yx-dialog
		title="选择商品"
		:bottomBtn="bottomBtn"
		:visible.sync="localVisible"
		@before-close="resetForm"
	>
		<el-form ref="form" :inline="true" :model="form" label-width="80px">
			<el-form-item label="档期类型">
				<el-select v-model="form.goodsType" placeholder="请选择档期类型">
					<el-option label="品牌营销" :value="1"></el-option>
					<el-option label="专项营销" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="档期名称">
				<el-autocomplete
					:disabled="BooleS"
					v-model="form.value"
					:fetch-suggestions="querySearchAsync"
					@select="handleSelect"
					@change="handleChange"
				></el-autocomplete>
			</el-form-item>
			<el-form-item label="商品货号">
				<el-input
					type="textarea"
					placeholder="请输入货号搜索,货号与货号之间使用逗号隔开或者换行"
					v-model="form.keyword"
					:autosize="{ minRows: 2, maxRows: 4 }"
				/>
			</el-form-item>
			<div v-if="notGoodsNumber.length > 0" style="margin-bottom: 40px">
				以下货号搜索找不到对应商品：
				<span
					style="color: #ff0000"
					v-for="(item, index) in notGoodsNumber"
					:key="index"
					><span style="display: block">{{ item }}</span>
				</span>
			</div>
			<el-form-item>
				<el-button type="primary" @click="handleQuery(true)">查询</el-button>
			</el-form-item>
		</el-form>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="选择商品" :name="1"
				><el-row>
					<el-button type="text" size="medium" @click="handleAdd"
						>批量添加</el-button
					>
					<el-button type="text" size="medium" @click="handleRemoval"
						>批量移除</el-button
					>
				</el-row>
				<el-row class="table_box">
					<yx-table
						:select="true"
						v-loading="showLoading"
						:columns="tialogColumns"
						:pagination="tialogPage"
						:data="tialogData"
						:selectionChange="selectionChange"
					>
						<template slot="saleState" slot-scope="scope">
							<el-tag effect="dark" :type="saleState(scope.row).type">{{
								saleState(scope.row).label
							}}</el-tag>
						</template>
					</yx-table>
				</el-row></el-tab-pane
			>
			<el-tab-pane :label="'已选商品' + selectGroupList.length" :name="2"
				><el-row>
					<el-button type="text" size="medium" @click="handleRemovalSd"
						>批量移除</el-button
					>
					<el-button
						type="text"
						size="medium"
						@click="_exportingProductInformation"
						>导出商品信息</el-button
					>
				</el-row>
				<el-row class="table_box">
					<yx-table
						:select="true"
						v-loading="selectedLoading"
						:columns="selectedtialogColumns"
						:data="selectedtialogData"
						:selectionChange="selectedselectionChange"
					>
						<template slot="saleState" slot-scope="scope">
							<el-tag effect="dark" :type="saleStateSd(scope.row).type">{{
								saleStateSd(scope.row).label
							}}</el-tag>
						</template>
					</yx-table>
				</el-row></el-tab-pane
			>
		</el-tabs>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxTable from '@wg-vue-materials/yx-table'
import {
	getGoodsGroupListByConditionForCMS,
	getGoodsGroupSimplerInfoList,
} from '@/api/userRewardSystem'
import { getYouxuanGoodsList } from '@/api/goodsList'
import { downloadFile } from '@/utils/helper/common'
import {
	getYouxuanGoodsNumberList,
	exportGoodsAndGroupInfoList,
} from '@/api/yhtPlusWebGoods'

import moment from 'moment'
export default {
	components: {
		YxDialog,
		YxTable,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			default: false,
		},
		BooleS: {
			type: Boolean,
			default: false,
		},
		newActivitiesRow: {
			type: Object,
			default: () => ({}),
		},
		selectProductRow: {
			type: Array,
			default: () => [],
		},
		inquireProductRow: {
			type: Array,
			default: () => [],
		},
		eliminateGoodsInfoListS: {
			type: Array,
			default: () => [],
		},
		// selectScheduleRow: {
		// 	type: Object,
		// 	default: () => ({}),
		// },
	},
	data() {
		return {
			activeName: 1,
			selectionData: [],
			selectionDataSd: [],
			currentTime: null,
			selectedcurrentTime: null,
			selectGroupList: [],
			notGoodsNumber: [],
			formData187: {
				gcategoryList: [],
				goodsGroupStateList: [1, 2],
				sortField: 0,
				channelType: 0,
				startTime: '',
				endTime: '',
				isShopKeeperGrouping: '',
			},
			showLoading: false,
			selectedLoading: false,
			form: {
				goodsType: 1,
				value: '',
				goodsGroupId: '',
				keyword: '',
			},
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveProduct()
					},
				},
			],
			selectedtialogColumns: [
				{
					type: 'string',
					dataIndex: 'goodsNumber',
					title: '货号',
				},
				{
					type: 'string',
					dataIndex: 'goodsName',
					title: '商品',
					customRender: (row) => {
						if (row.goodsName) {
							return row.goodsName
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'groupName',
					title: '档期名称',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场名称',
				},
				{
					type: 'string',
					dataIndex: 'saleStartTime',
					title: '售卖时间',
					width: '146',
					customRender: (row) => {
						return (
							moment(row.saleStartTime).format('YYYY-MM-DD HH:mm:ss') +
							'-' +
							moment(row.saleEndTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					type: 'custom',
					dataIndex: 'saleState',
					title: '售卖状态',
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '移除',
							click: (row) => {
								this.editUserListSd(row)
							},
							// customRender: (action, row) => {
							// 	action.title = this.findIndex(row) ? '添加' : '移除'
							// 	return action
							// },
						},
					],
				},
			],
			// selectedtialogPage: {
			// 	count: 0,
			// 	length: 10,
			// 	currentPage: 1,
			// 	tableChange: () => {
			// 		this.handleSelected()
			// 	},
			// },
			selectedtialogData: [],
			tialogColumns: [
				{
					type: 'string',
					dataIndex: 'goodsNumber',
					title: '货号',
				},
				{
					type: 'string',
					dataIndex: 'goodsName',
					title: '商品',
					customRender: (row) => {
						if (row.goodsName) {
							return row.goodsName
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'groupName',
					title: '档期名称',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场名称',
				},
				{
					type: 'string',
					dataIndex: 'saleStartTime',
					width: '146',
					title: '售卖时间',
					customRender: (row) => {
						return (
							moment(row.saleStartTime).format('YYYY-MM-DD HH:mm:ss') +
							'-' +
							moment(row.saleEndTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					type: 'custom',
					dataIndex: 'saleState',
					title: '售卖状态',
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.editUserList(row)
							},
							customRender: (action, row) => {
								action.title = this.findIndex(row) ? '添加' : '移除'
								return action
							},
						},
					],
				},
			],
			tialogPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.handleQuery()
				},
			},
			tialogData: [],
			selectedLength: 0,
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

	watch: {
		localVisible(val) {
			this.activeName = 1
			this.form.goodsType = 1
			this.form.value = ''
			this.form.goodsGroupId = ''
			this.form.keyword = ''
			this.tialogPage.count = 0
			this.tialogData = []
			this.selectedtialogData = []
			if (this.inquireProductRow.length > 0 && this.BooleS) {
				let groupNameS = []
				let goodsGroupIdS = []
				this.inquireProductRow.map((item) => {
					groupNameS.push(item.groupName)
					goodsGroupIdS.push(item.goodsGroupId)
				})
				this.form.goodsGroupId = goodsGroupIdS
				this.form.value = groupNameS
				this.querySearchAsync('', () => {})
			}
			// this.selectedLength =
			// 	this.selectGroupList?.length > 0
			// 		? this.selectGroupList.length
			// 		: this.eliminateGoodsInfoListS.length
			// console.log('8888888', this.selectedLength)
			if (val) {
				this.selectGroupList = JSON.parse(
					JSON.stringify(
						this.selectProductRow.length > 0
							? this.selectProductRow
							: this.eliminateGoodsInfoListS
					)
				)
				if (this.selectGroupList.length) {
					this.handleSelected()
				}
			}
		},
	},
	methods: {
		_exportingProductInformation: async function () {
			let paramJson = {}
			paramJson.goodsInfoBOList = this.selectionDataSd.map((item) => {
				return {
					brandName: item.brandName,
					goodsName: item.goodsName,
					goodsNumber: item.goodsNumber,
					groupName: item.groupName,
					saleEndTime: item.saleEndTime,
					saleStartTime: item.saleStartTime,
				}
			})
			let { data } = await exportGoodsAndGroupInfoList(paramJson)
			data && downloadFile(data, '商品信息表.xlsx')
		},
		handleClick(tab, event) {
			console.log(tab, event)
		},
		selectedselectionChange(row) {
			this.selectionDataSd = row
		},
		selectionChange(row) {
			this.selectionData = row
		},
		handleAdd() {
			let ids = this.selectGroupList.map((item) => {
				return item.goodsId
			})
			if (this.selectionData && this.selectionData.length) {
				this.selectionData.forEach((row) => {
					if (ids.indexOf(row.goodsId) == -1) {
						this.selectGroupList.push(row)
					}
				})
			}
			if (this.selectGroupList && this.selectGroupList.length) {
				console.log('11111111', this.selectGroupList)

				this.handleSelected()
			}
		},
		handleRemovalSd() {
			// if (this.selectionDataSd && this.selectionDataSd.length && !this.BooleS) {
			for (let i = 0; i < this.selectionDataSd.length; i++) {
				for (let j = 0; j < this.selectGroupList.length; j++) {
					if (
						this.selectionDataSd[i].goodsId === this.selectGroupList[j].goodsId
					) {
						let indexs = this.selectGroupList.indexOf(this.selectGroupList[j])
						this.selectGroupList.splice(indexs, 1)
					}
				}
			}
			console.log('商品范围去移除', this.selectionDataSd)

			this.handleSelected()
			// } else {
			// 	console.log('档期中剔除商品去移除', this.eliminateGoodsInfoListS)

			// 	for (let i = 0; i < this.selectionDataSd.length; i++) {
			// 		for (let j = 0; j < this.eliminateGoodsInfoListS.length; j++) {
			// 			if (
			// 				this.selectionDataSd[i].goodsId ===
			// 				this.eliminateGoodsInfoListS[j].goodsId
			// 			) {
			// 				let indexs = this.eliminateGoodsInfoListS.indexOf(
			// 					this.eliminateGoodsInfoListS[j]
			// 				)
			// 				this.eliminateGoodsInfoListS.splice(indexs, 1)
			// 			}
			// 		}
			// 	}

			// 	this.handleSelected()
			// }
		},
		handleRemoval() {
			if (this.selectionData && this.selectionData.length) {
				for (let i = 0; i < this.selectionData.length; i++) {
					for (let j = 0; j < this.selectGroupList.length; j++) {
						if (
							this.selectionData[i].goodsId === this.selectGroupList[j].goodsId
						) {
							let indexs = this.selectGroupList.indexOf(this.selectGroupList[j])
							this.selectGroupList.splice(indexs, 1)
						}
					}
				}
			}
			if (this.selectGroupList && this.selectGroupList.length) {
				this.handleSelected()
			} else {
				this.selectedtialogData = []
			}
		},
		findIndex(row) {
			// 判断是否已经添加用户
			let ids = this.selectGroupList.map((item) => {
				return item.goodsId
			})
			return ids.indexOf(row.goodsId) == -1
		},
		editUserListSd(row) {
			// 添加/移除用户
			let ids = this.selectGroupList.map((item) => {
				return item.goodsId
			})
			this.selectGroupList.splice(ids.indexOf(row.goodsId), 1)
			if (this.selectGroupList && this.selectGroupList.length) {
				this.handleSelected()
			} else {
				this.selectedtialogData = []
			}
		},
		editUserList(row) {
			// 添加/移除用户
			let ids = this.selectGroupList.map((item) => {
				return item.goodsId
			})
			if (ids.indexOf(row.goodsId) == -1) {
				this.selectGroupList.push(row)
			} else {
				this.selectGroupList.splice(ids.indexOf(row.goodsId), 1)
			}
			if (this.selectGroupList && this.selectGroupList.length) {
				this.handleSelected()
			} else {
				this.selectedtialogData = []
			}
		},
		async handleSelected() {
			this.selectedLoading = true
			let paramJson = this.findUserParamsGoods()
			let {
				data: { resultCode, resultData },
			} = await getGoodsGroupSimplerInfoList(paramJson)
			this.selectedLoading = false
			if (resultCode == 0) {
				this.selectedtialogData = resultData
			} else {
				this.selectedtialogData = []
			}
		},
		saleStateSd(row) {
			if (row.isInSell == 0) {
				return {
					type: 'danger',
					label: '未开始',
				}
			}
			if (row.isInSell == 1) {
				return {
					type: '',
					label: '进行中',
				}
			} else {
				return {
					type: 'danger',
					label: '未开始',
				}
			}
		},
		saleState(row) {
			if (this.currentTime < row.saleStartTime) {
				return {
					type: 'danger',
					label: '未开始',
				}
			}
			if (
				this.currentTime >= row.saleStartTime &&
				this.currentTime <= row.saleEndTime
			) {
				return {
					type: '',
					label: '进行中',
				}
			}
			if (this.currentTime > row.saleEndTime) {
				return {
					type: 'info',
					label: '已结束',
				}
			}
		},
		findSearchParams188(value) {
			const paramJson = Object.assign(this.formData187, {
				groupNameKeyword: value,
				length: 20,
				goodsType: this.form.goodsType,
				startIndex: 0,
			})
			return paramJson
		},
		//远程搜索
		async querySearchAsync(value = '', cb) {
			//这里是需要上传给后端的参数
			let params = this.findSearchParams188(value)
			let {
				data: { resultCode, resultData },
			} = await getGoodsGroupListByConditionForCMS(params)
			if (resultCode == 0) {
				resultData.goodsGroupList.map((item) => {
					item.value = item.groupName
				})
				this.currentTime = resultData.currentTime
				cb(resultData.goodsGroupList)
			} else {
				this.$message.error('接口错误')
			}
		},
		handleChange() {
			this.form.goodsGroupId = ''
		},
		handleSelect(item) {
			this.form.goodsGroupId = item.goodsGroupId
		},
		findUserParamsGoods() {
			let paramJson = {}
			// if (this.BooleS && this.newActivitiesRow.id) {
			// 	paramJson.goodsIdList = this.eliminateGoodsInfoListS.map((item) => {
			// 		return item.goodsId
			// 	})
			// } else {
			paramJson.goodsIdList = this.selectGroupList.map((item) => {
				return item.goodsId
			})
			// }
			return paramJson
		},
		// 处理货号参数
		handleNoParams() {
			const searchDataTwo = JSON.parse(JSON.stringify(this.form))
			searchDataTwo.keyword = searchDataTwo.keyword.replace(/\n/g, ',')
			searchDataTwo.keyword = searchDataTwo.keyword.replace(/\s*/g, '') //商品货号
			// const goodsNumberLength = searchDataTwo.keyword.match(/,|，/g)
			// if (type === 1 && goodsNumberLength && goodsNumberLength.length > 500) {
			// 	return this.$message.warning('货号长度最多支持500个货号搜索')
			// }
			return searchDataTwo
		},
		findUserParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.tialogPage.currentPage = 1
			}
			const hParams = this.handleNoParams()
			console.log('=========', this.BooleS)
			const paramJson = Object.assign(
				{
					goodsGroupIdList:
						(this.form.goodsGroupId && this.inquireProductRow.length === 0) ||
						!this.BooleS
							? [this.form.goodsGroupId]
							: this.inquireProductRow.length > 0
							? this.form.goodsGroupId
							: [''],
					viewType: 3,
					shelfState: 2,
					keyword: hParams.keyword,
				},
				{
					length: this.tialogPage.length,
					startIndex:
						(this.tialogPage.currentPage - 1) * this.tialogPage.length,
				}
			)
			return paramJson
		},
		async handleQuery(flag) {
			this.showLoading = true
			let paramJson = this.findUserParams(flag)
			const {
				data: { resultCode, resultData },
			} = await getYouxuanGoodsList(paramJson)
			if (resultCode == 0) {
				this.tialogData = resultData.goodsList.map((item) => {
					// item.brandName = item?.goodsGroupList[0]?.brandName
					// item.saleStartTime = item?.goodsGroupList[0]?.saleStartTime
					// item.saleEndTime = item?.goodsGroupList[0]?.saleEndTime
					item.groupName = item?.goodsGroupList[0]?.groupName
					item.goodsGroupId = item?.goodsGroupList[0]?.goodsGroupId
					return item
				})
				this.tialogPage.count = resultData.goodsCount
			} else {
				this.tialogPage.count = 0
				this.tialogData = []
			}
			if (this.form.keyword) {
				this._getYouxuanGoodsNumberList(true)
			} else {
				this.notGoodsNumber = []
			}
			this.showLoading = false
		},
		async _getYouxuanGoodsNumberList(flag) {
			let paramJson = this.findUserParams(flag)
			const {
				data: { resultCode, resultData },
			} = await getYouxuanGoodsNumberList(paramJson)
			if (resultCode === 0) {
				if (this.form.keyword) {
					this.notGoodsNumber = resultData.notGoodsNumber
				} else {
					this.notGoodsNumber = []
				}
			}
		},

		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.notGoodsNumber = []
			// this.$refs.form.$refs.YxForm.resetFields()
		},
		saveProduct() {
			this.$emit('saveProduct', this.selectGroupList)
			this.notGoodsNumber = []
			this.localVisible = false
		},
	},
}
</script>

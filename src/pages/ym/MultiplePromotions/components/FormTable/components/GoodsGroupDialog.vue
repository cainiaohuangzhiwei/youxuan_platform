<template>
	<div>
		<el-dialog
			width="60%"
			title="选择档期"
			append-to-body
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<yx-form
				ref="form"
				:inline="true"
				:items="formItem"
				:data="searchData"
				:formAction="funAction"
			>
				<template #supplierId>
					<el-select
						v-model="selectedSupplier"
						filterable
						remote
						placeholder="请输入商家名称"
						value-key="supplierId"
						:remote-method="_getCmsSupplierListByCondition"
						@change="selectSupplier"
						:disabled="disableEdit"
					>
						<el-option
							v-for="item in formDataSupplierList"
							:key="item.supplierId"
							:label="item.supplierName"
							:value="item"
						>
						</el-option>
					</el-select>
				</template>
			</yx-form>

			<yx-table
				v-loading="loading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			>
			</yx-table>
			<div class="btn">
				<el-button type="primary" @click="saveBrand">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getGoodsGroupListByConditionForPromotion } from '@/api/goodsGroup'
import { getCmsSupplierListByCondition } from '@/api/yhtPlusCmsSupplier'
import moment from 'moment'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		itemInfo: {
			type: Array,
			default: () => [],
		},
		row: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm,
		YxTable,
	},

	data() {
		return {
			selectedSupplier: {},
			selectGroupList: [],
			actMorePromotionId: false,
			actGroupOrderList: [],
			curTime: '',
			formItem: [
				{
					title: '商家',
					type: 'custom',
					dataIndex: 'supplierId',
				},
				{
					title: '筛选',
					dataIndex: 'groupNameKeyword',
					placeholder: '档期名称/会场名称',
				},
				{
					title: '档期类型',
					type: 'select',
					label: 'value',
					dataIndex: 'goodsType',
					options: [
						{
							goodsType: 1,
							value: '品牌营销',
						},
						{
							goodsType: 2,
							value: '专享营销',
						},
					],
				},
			],
			// 搜索商家数据源
			formDataSupplierList: [],
			searchData: {
				supplierId: '',
				goodsType: 1,
				groupNameKeyword: '',
			},
			rowData: [],
			isAdd: 0,
			loading: false,
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'goodsGroupId',
					title: '档期ID',
				},
				{
					type: 'string',
					dataIndex: 'groupName',
					title: '档期名称',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
					customRender: (row) => {
						if (this.selectedSupplier.supplierName) {
							return this.selectedSupplier.supplierName
						} else {
							return row.brandName
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'effectiveTime',
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
					type: 'string',
					dataIndex: 'saleState',
					title: '售卖状态',
					customRender: (row) => {
						let stateString
						if (this.curTime < row.saleStartTime) {
							stateString = '未开始'
						}
						if (
							this.curTime >= row.saleStartTime &&
							this.curTime <= row.saleEndTime
						) {
							stateString = '进行中'
						}
						if (this.curTime > row.saleEndTime) {
							stateString = '已结束'
						}
						return stateString
					},
				},
				{
					type: 'action',
					dataIndex: 'add',
					title: '操作',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.editUserList(row)
							},
							customRender: (action, row) => {
								action.title = this.findIndex(row)
								action.hide = action.title === ''
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
					this._getGoodsGroupListByConditionForCMS()
				},
			},
			funAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getGoodsGroupListByConditionForCMS()
					},
				},
			],
			// 活动进行中
			disableEdit: false,
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
			this.reset()
			if (val) {
				this.selectGroupList = JSON.parse(JSON.stringify(this.itemInfo))
				console.log('this.row', this.row)
				if (this.row.actMorePromotionId) {
					const { startTime, endTime } = this.row || {}
					const nowTime = new Date().getTime()
					// 多件促销活动进行中
					this.disableEdit = nowTime > startTime && nowTime < endTime
					this.actMorePromotionId = this.row.actMorePromotionId
					this.actGroupOrderList = this.row.actGroupOrderList
					if (
						this.selectGroupList.length > 0 &&
						this.selectGroupList[0].supplierId > 0
					) {
						this.searchData.supplierId = this.selectGroupList[0].supplierId
						this.selectedSupplier.supplierId = this.searchData.supplierId
						this._getCmsSupplierListByCondition(
							'',
							this.selectedSupplier.supplierId
						)
						this._getGoodsGroupListByConditionForCMS()
					} else {
						this._getCmsSupplierListByCondition()
					}
				} else {
					this.actMorePromotionId = false
					this.actGroupOrderList = []
					this._getCmsSupplierListByCondition()
				}
			}
		},
	},

	methods: {
		reset() {
			this.searchData.supplierId = ''
			this.searchData.groupNameKeyword = ''
			this.page.count = 0
			this.page.length = 10
			this.page.currentPage = 1
			this.tableData = []
			this.selectedSupplier = {}
		},
		// 获取商家列表
		async _getCmsSupplierListByCondition(query, supplierId) {
			const paramJson = {
				startIndex: 0,
				length: 20,
			}
			if (query !== '') {
				paramJson.supplierName = query
			} else if (supplierId) {
				paramJson.supplierId = supplierId
			}
			const {
				data: { resultCode, resultData },
			} = await getCmsSupplierListByCondition(paramJson)

			if (resultCode == 0) {
				this.formDataSupplierList = resultData.supplierList || []
				if (supplierId && this.formDataSupplierList.length > 0) {
					this.selectedSupplier = this.formDataSupplierList[0]
				}
				return
			}
			this.formDataSupplierList = []
		},
		selectSupplier(val) {
			if (val && this.searchData.supplierId != val.supplierId) {
				this.selectGroupList = []
				this.tableData = []
				this.searchData.supplierId = val.supplierId
			}
		},
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			let paramJson = Object.assign(
				{
					length: this.page.length,
					startIndex: (this.page.currentPage - 1) * this.page.length,
					organizationId: 1,
					goodsGroupStateList: ['1', '2'],
					gcategoryList: ['1'],
					actGroupOrderList: this.actGroupOrderList,
				},
				this.searchData
			)
			if (this.actMorePromotionId) {
				paramJson.actMorePromotionId = this.actMorePromotionId
			}
			return paramJson
		},

		// 获取优惠券列表
		async _getGoodsGroupListByConditionForCMS(flag) {
			if (!this.selectedSupplier.supplierId) {
				return this.$message.warning('请选择商家！')
			}
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const res = await getGoodsGroupListByConditionForPromotion(paramJson)
			const { resultCode, resultData } = res.data
			this.loading = false
			if (resultCode == 0) {
				this.tableData = resultData.goodsGroupList
				this.curTime = resultData.currentTime
				this.page.count = resultData.goodsGroupCount
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		resetForm() {
			this.localVisible = false
			this.$refs.form.$refs.YxForm.resetFields()
		},
		saveBrand() {
			this.$emit('saveBrand', this.selectGroupList, this.selectedSupplier)
			this.resetForm()
		},
		findIndex(row) {
			const { actMorePromotionRelationList } = this.row || {}
			const ids = actMorePromotionRelationList?.map((item) => item.goodsGroupId)
			// 如果是已经开始的多件促销活动，已经绑定的会场不可以进行操作
			const disableEditState =
				this.disableEdit && ids.includes(row.goodsGroupId)

			// 判断是否已经添加
			let remove = this.selectGroupList.some(
				(e) => Number(e.goodsGroupId) === row.goodsGroupId
			)
			//可操作
			if (row.groupState == 1 && !disableEditState) {
				if (remove) {
					return '移除'
				} else {
					return '添加'
				}
			} else {
				return ''
			}
		},
		editUserList(row) {
			// 添加/移除用户
			let ids = this.selectGroupList.map((item) => {
				return item.goodsGroupId
			})
			if (ids.indexOf(row.goodsGroupId) == -1) {
				this.selectGroupList.push(row)
			} else {
				this.selectGroupList.splice(ids.indexOf(row.goodsGroupId), 1)
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.btn {
	text-align: right;
}
</style>

<template>
	<yx-dialog
		title="选择档期"
		:bottomBtn="bottomBtn"
		:visible.sync="localVisible"
		:before-close="resetForm"
	>
		<yx-form
			:inline="true"
			:data="dialogData"
			:items="dialogCfg"
			:formAction="dialogAction"
		>
			<template v-if="!listData.noSupplier" #supplierId>
				<el-form-item label="商家" prop="supplierId">
					<el-select
						v-model="selectedSupplier"
						filterable
						remote
						placeholder="请输入商家名称"
						value-key="supplierId"
						:remote-method="_getCmsSupplierListByCondition"
						@change="selectSupplier"
					>
						<el-option
							v-for="item in formDataSupplierList"
							:key="item.supplierId"
							:label="item.supplierName"
							:value="item"
						>
						</el-option>
					</el-select>
				</el-form-item>
			</template>
		</yx-form>
		<el-row>
			<yx-table
				v-loading="showLoading"
				:columns="tialogColumns"
				:pagination="tialogPage"
				:data="tialogData"
			>
			</yx-table>
		</el-row>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { queryGoodsGroupInfoBySupplierId } from '@/api/coupon'
import { getCmsSupplierListByCondition } from '@/api/yhtPlusCmsSupplier'
import moment from 'moment'
export default {
	components: {
		YxDialog,
		YxForm,
		YxTable,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			default: false,
		},
		rangeExt: {
			type: Array,
			default: () => [],
		},
		listData: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			selectedSupplier: {},
			selectGroupList: [],
			showLoading: false,
			currentTime: '',
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveBrand()
					},
				},
			],
			// 搜索商家数据源
			formDataSupplierList: [],
			dialogData: {
				supplierId: '',
				groupName: '',
				goodsType: '1',
			},
			dialogCfg: [
				{
					title: '商家',
					type: 'custom',
					dataIndex: 'supplierId',
					unformItem: true,
				},
				{
					type: 'input',
					title: '档期名称',
					dataIndex: 'groupName',
					placeholder: '档期名称',
				},
				{
					type: 'select',
					title: '营销类型',
					dataIndex: 'goodsType',
					label: 'value',
					options: [
						{
							goodsType: '1',
							value: '品牌营销',
						},
						{
							goodsType: '2',
							value: '专享营销',
						},
					],
				},
			],
			dialogAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getGoodsGroupListByConditionForCMS(true)
					},
				},
			],
			tialogColumns: [
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
				},
				{
					type: 'string',
					dataIndex: 'saleStartTime',
					title: '售卖时间',
					customRender: (row) => {
						return row.saleStartTime && row.saleEndTime
							? moment(row.saleStartTime).format('YYYY-MM-DD HH:mm:ss') +
									'-' +
									moment(row.saleEndTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'saleState',
					title: '售卖状态',
					customRender: (row) => {
						let currentTime = this.currentTime
						if (currentTime < row.saleStartTime) {
							return '未开始'
						}
						if (
							currentTime >= row.saleStartTime &&
							currentTime <= row.saleEndTime
						) {
							return '进行中'
						}
						if (currentTime > row.saleEndTime) {
							return '已结束'
						}
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
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
					this._getGoodsGroupListByConditionForCMS()
				},
			},
			tialogData: [],
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
				this.dialogData.supplierId = this.listData.supplierId
				this.selectedSupplier.supplierId = this.dialogData.supplierId
				this.selectGroupList = JSON.parse(JSON.stringify(this.rangeExt))
				// 是否需要选择商家
				if (!this.listData.noSupplier) {
					if (this.dialogData.supplierId) {
						this._getCmsSupplierListByCondition(
							'',
							this.selectedSupplier.supplierId
						)
						this._getGoodsGroupListByConditionForCMS()
					} else {
						this._getCmsSupplierListByCondition()
					}
				} else {
					this._getGoodsGroupListByConditionForCMS()
				}
			}
		},
	},
	methods: {
		reset() {
			this.dialogData.supplierId = ''
			this.dialogData.groupNameKeyword = ''
			this.tialogPage.count = 0
			this.tialogPage.length = 10
			this.tialogPage.currentPage = 1
			this.tialogData = []
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
			if (val && this.dialogData.supplierId != val.supplierId) {
				this.selectGroupList = []
				this.tialogData = []
				this.dialogData.supplierId = val.supplierId
			}
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			// this.$refs.form.$refs.YxForm.resetFields()
		},
		saveBrand() {
			this.$emit('saveBrand', this.selectGroupList, this.selectedSupplier)
			this.resetForm()
		},
		findIndex(row) {
			// 判断是否已经添加用户
			let ids = this.selectGroupList.map((item) => {
				return item.goodsGroupId
			})
			return ids.indexOf(row.goodsGroupId) == -1
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
		findUserParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.tialogPage.currentPage = 1
			}
			// 用户搜索条件
			let paramJson = Object.assign(
				{
					// startIndex:
					// 	(this.tialogPage.currentPage - 1) * this.tialogPage.length,
					// length: this.tialogPage.length,
					pageNum: this.tialogPage.currentPage,
					pageSize: this.tialogPage.length,
					groupId: 2,
					goodsGroupStateList: ['1', '2'],
					gcategoryList: ['1'],
				},
				this.dialogData
			)
			return paramJson
		},
		async _getGoodsGroupListByConditionForCMS(flag) {
			if (!this.listData.noSupplier && !this.selectedSupplier.supplierId) {
				return this.$message.warning('请选择商家！')
			}
			this.showLoading = true
			let paramJson = this.findUserParams(flag)
			let {
				data: { resultCode, resultData, total },
			} = await queryGoodsGroupInfoBySupplierId(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tialogData = resultData
				this.tialogPage.count = total
				this.currentTime = new Date().getTime()
			} else {
				this.tialogPage.count = 0
				this.tialogData = []
			}
		},
	},
}
</script>

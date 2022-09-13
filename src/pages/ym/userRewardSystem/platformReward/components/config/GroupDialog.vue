<template>
	<el-dialog
		width="900px"
		title="选择分组"
		append-to-body
		:close-on-click-modal="false"
		:visible.sync="localVisible"
		:before-close="resetForm"
	>
		<YxForm
			ref="form"
			:inline="true"
			:items="item"
			:data="searchData"
			:formAction="formAction"
		/>
		<el-table
			border
			v-loading="loading"
			ref="multipleTable"
			:data="tableData"
			tooltip-effect="dark"
			:row-key="getRowKeys"
			@selection-change="handleSelectionChange"
		>
			<el-table-column
				align="center"
				type="selection"
				:reserve-selection="true"
				width="55"
			/>
			<el-table-column
				align="center"
				width="90"
				prop="goodsGroupId"
				label="分组ID"
			/>
			<el-table-column align="center" prop="groupName" label="分组名称" />
			<el-table-column align="center" prop="brandName" label="会场名称" />
			<el-table-column
				align="center"
				width="270"
				prop="saleTime"
				label="售卖时间"
			/>
			<el-table-column
				align="center"
				width="80"
				prop="saleStateConversion"
				label="售卖状态"
			/>
		</el-table>

		<el-pagination
			v-if="page.count > 0"
			class="page"
			:total="page.count"
			:page-size="page.length"
			:page-sizes="[10, 30, 50, 100]"
			:current-page="page.currentPage"
			layout="total, sizes, prev, pager, next, jumper"
			@current-change="nextPage"
			@size-change="handleSizeChange"
		/>

		<div class="page" v-if="page.count > 0">
			<el-button type="primary" @click="submitForm">确定</el-button>
		</div>
	</el-dialog>
</template>

<script>
import moment from 'moment'
import { getGoodsGroupListByConditionForCMS } from '@/api/goodsGroup'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm: () => import('@wg-vue-materials/yx-form'),
	},

	data() {
		return {
			item: [
				{
					title: '分组名称',
					dataIndex: 'groupNameKeyword',
					placeholder: '请输入分组名称',
				},
			],
			searchData: {
				sortField: '0',
				channelType: '0',
				groupNameKeyword: '',
				supplierRow: '',
				gcategoryList: [],
				goodsGroupStateList: [],
			},
			curTime: '',
			rowData: {},
			echoOff: false,
			loading: false,
			tableData: [],
			multipleSelection: [],
			goodsGroupTargetIds: [],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init(true)
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

	watch: {
		itemInfo() {
			this.rowData = Object.assign({}, this.itemInfo)
		},
	},

	methods: {
		details(goodsGroupTargetIds) {
			this.goodsGroupTargetIds = goodsGroupTargetIds || []
			this.init(true)
		},

		findSearchParams(flag) {
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.searchData, {
				length: this.page.length,
				startIndex: this.searchData.groupNameKeyword
					? 0
					: (this.page.currentPage - 1) * this.page.length,
			})

			return paramJson
		},

		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const {
				data: { resultData },
			} = await getGoodsGroupListByConditionForCMS(paramJson)
			if (resultData.goodsGroupList.length > 0) {
				for (let i = 0; i < resultData.goodsGroupList.length; i++) {
					const item = resultData.goodsGroupList[i]
					item.saleTime =
						moment(item.saleStartTime).format('YYYY-MM-DD HH:mm:ss') +
						' - ' +
						moment(item.saleEndTime).format('YYYY-MM-DD HH:mm:ss')

					if (this.curTime < item.saleStartTime) {
						item.saleStateConversion = '未开始'
					}
					if (
						this.curTime >= item.saleStartTime &&
						this.curTime <= item.saleEndTime
					) {
						item.saleStateConversion = '进行中'
					}
					if (this.curTime > item.saleEndTime) {
						item.saleStateConversion = '已结束'
					}
				}

				this.tableData = resultData.goodsGroupList
				this.curTime = resultData.currentTime
				this.page.count = resultData.goodsGroupCount
			} else {
				this.page.count = 0
				this.tableData = []
			}
			this.loading = false
		},

		resetForm() {
			this.localVisible = false
			this.rowData = {}
			this.$refs.multipleTable.clearSelection()
			this.$refs.form.$refs.YxForm.resetFields()
		},

		submitForm() {
			if (this.multipleSelection.length === 0) {
				return this.$message.warning('请选择分组')
			}

			this.$emit('groupMethod', this.multipleSelection)
			this.resetForm()
		},

		fatherMethodInit(row = {}) {
			this.searchData.supplierRow = row.bankName
			this.supplierRow = row
		},

		getRowKeys(row) {
			return row.goodsGroupId
		},

		handleSelectionChange(val) {
			this.multipleSelection = val
		},

		handleSizeChange(val) {
			this.page.length = val
			this.init()
		},

		nextPage(val) {
			this.page.currentPage = val
			this.init()
		},
	},
}
</script>

<style lang="scss" scoped>
.page {
	margin: 20px 0;
	text-align: right;
}
</style>

<template>
	<div>
		<el-dialog
			top="2%"
			width="70%"
			title="选择优惠券"
			append-to-body
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			custom-class="operate-dialog"
		>
			<yx-form
				ref="form"
				:inline="true"
				:items="item"
				:data="searchData"
				:rules="funRules"
				:formAction="funAction"
				><template #yxCouponIds>
					<el-input
						type="textarea"
						v-model="searchData.yxCouponIds"
						placeholder="优惠券ID，批量搜索请换行或用逗号隔开"
					></el-input>
				</template>
			</yx-form>
			<div class="btn-list">
				<el-button @click="batchAdd" type="primary">批量添加</el-button>
				<el-button @click="batchRemove" type="primary">批量移除</el-button>
			</div>
			<yx-table
				ref="operateCouponTable"
				v-loading="loading"
				:select="true"
				rowKey="yxCouponId"
				:selectionChange="selectionList"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
				:height="500"
			>
			</yx-table>
			<div class="btn">
				<el-button type="primary" @click="saveConfirm">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { newGetCouponList } from '@/api/receiveCouponCenter'
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
	},

	components: {
		YxForm,
		YxTable,
	},

	data() {
		return {
			selectCouponList: [],
			item: [
				{
					title: '优惠券名称',
					dataIndex: 'couponName',
					placeholder: '请输入优惠券名称',
				},
				{
					type: 'select',
					dataIndex: 'sourceType',
					title: '优惠券渠道',
					label: 'value',
					options: [
						{
							sourceType: 1,
							value: '云货优选',
						},
						{
							sourceType: 2,
							value: 'AKC',
						},
					],
				},
				{
					title: '筛选',
					type: 'custom',
					dataIndex: 'yxCouponIds',
				},
			],
			searchData: {
				yxCouponIds: '',
				couponName: '',
				sourceType: 1,
			},
			rowData: [],
			isAdd: 0,
			loading: false,
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'yxCouponId',
					title: '优惠券ID',
				},
				{
					type: 'string',
					dataIndex: 'couponName',
					title: '优惠券名称',
				},
				{
					type: 'string',
					dataIndex: 'effectiveTime',
					title: '优惠券有效期',
					width: 300,
					customRender: (row) => {
						if (row.expiryDateType == 1) {
							return (
								moment(row.startTime).format('YYYY-MM-DD HH:mm:ss') +
								'-' +
								moment(row.endTime).format('YYYY-MM-DD HH:mm:ss')
							)
						} else if (row.expiryDateType == 2) {
							return '自领取起' + row.expiryDate + '天内有效'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'sourceType',
					title: '优惠券渠道',
					customRender: (row) => {
						return row.sourceType == 1
							? '云货优选'
							: row.sourceType
							? 'AKC'
							: '-'
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
								this.editList(row)
							},
							customRender: (action, row) => {
								action.title = this.findIndex(row) ? '添加' : '移除'
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
					this._getCouponList()
				},
			},
			funAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getCouponList()
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
		localVisible(val) {
			if (val) {
				this.selectCouponList = JSON.parse(JSON.stringify(this.itemInfo))
				// this._getCouponList()
			}
		},
	},

	created() {
		// this._getCouponList()
	},

	methods: {
		// 搜索条件
		findNewSearchParams(flag) {
			let paramJson = Object.assign(this.searchData, {
				pageSize: 10,
				pageNum: 1,
			})
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.pageNum = this.page.currentPage
			let blank = /[\r\n]+/g.test(paramJson.yxCouponIds)
			if (paramJson.yxCouponIds.length > 0 && !blank) {
				let goodsCoupon
				goodsCoupon = String(paramJson.yxCouponIds)
				goodsCoupon = goodsCoupon.split(',')
				paramJson.yxCouponIds = goodsCoupon
			} else if (blank) {
				paramJson.yxCouponIds = paramJson.yxCouponIds.replace(/\n/g, ',')
				paramJson.yxCouponIds = paramJson.yxCouponIds.replace(/\s*/g, '')
				paramJson.yxCouponIds =
					paramJson.yxCouponIds.length > 0
						? paramJson.yxCouponIds.split(',')
						: []
			} else {
				paramJson.yxCouponIds = []
			}
			return paramJson
		},
		// 获取优惠券列表
		async _getCouponList(flag) {
			// this.showLoading = true
			const paramJson = this.findNewSearchParams(flag)
			if (paramJson.yxCouponIds.length == 0 && !paramJson.couponName) {
				return this.$message.error('请通过通过优惠券名称、优惠券ID搜索')
			}
			this.loading = true
			const res = await newGetCouponList(paramJson)
			const { resultCode, resultData } = res.data
			this.loading = false
			if (resultCode == 0) {
				this.tableData = resultData
				this.page.count = res?.data?.total || 0
				// 对 Table 进行重新布局
				this.$nextTick(() => {
					this.$refs.operateCouponTable.$refs.YxTable.doLayout()
				})
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		resetForm() {
			this.localVisible = false
			// this.$refs.form.$refs.YxForm.resetFields()
		},
		saveConfirm() {
			this.$emit('fatherMethodInit', this.selectCouponList)
			this.localVisible = false
		},
		findIndex(row) {
			// 判断是否已经添加用户
			let ids = this.selectCouponList.map((item) => {
				return item.yxCouponId
			})
			return ids.indexOf(row.yxCouponId) == -1
		},
		editList(row) {
			// 添加/移除用户
			let ids = this.selectCouponList.map((item) => {
				return item.yxCouponId
			})
			if (ids.indexOf(row.yxCouponId) == -1) {
				this.selectCouponList.push(row)
			} else {
				this.selectCouponList.splice(ids.indexOf(row.yxCouponId), 1)
			}
		},
		selectionList(list) {
			this.selectTempList = list
		},
		batchRemove() {
			let selectIds = this.selectCouponList.map((item) => {
				return item.yxCouponId
			})
			let selectTempList = this.selectTempList.filter((row) => {
				return selectIds.indexOf(row.yxCouponId) != -1
			})
			if (!selectTempList.length) {
				return this.$message.error('请选择可移除的优惠券')
			}
			let selectTempIds = this.selectTempList.map((item) => {
				return item.yxCouponId
			})
			this.selectCouponList = this.selectCouponList.filter((row) => {
				return selectTempIds.indexOf(row.yxCouponId) == -1
			})
		},
		batchAdd() {
			let selectIds = this.selectCouponList.map((item) => {
				return item.yxCouponId
			})
			let selectTempList = this.selectTempList.filter((row) => {
				return selectIds.indexOf(row.yxCouponId) == -1
			})
			if (!selectTempList.length) {
				return this.$message.error('请选择可添加的优惠券')
			}
			this.selectCouponList = this.selectCouponList.concat(this.selectTempList)
		},
	},
}
</script>

<style lang="scss" scoped>
.btn {
	text-align: right;
}
.btn-list {
	margin-bottom: 10px;
}
</style>

<style lang="scss">
.el-dialog__body {
	max-height: none;
	padding: 15px 20px;
}
</style>

<template>
	<div>
		<el-dialog
			width="850px"
			title="选择优惠券"
			append-to-body
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="init"
		>
			<WgForm
				ref="form"
				:inline="true"
				:items="searchItem"
				:data="searchData"
				:rules="funRules"
				:formAction="funAction"
			>
			</WgForm>

			<WgTable
				v-loading="loading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			>
				<template slot="yxCouponId" slot-scope="scope">
					<el-radio
						v-model="rowData.yxCouponId"
						:label="scope.row.yxCouponId"
						@change="changeRow(scope.row)"
						>选择</el-radio
					>
				</template>
			</WgTable>

			<div class="btn">
				<el-button type="primary" @click="submitForm">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import WgForm from '@/components/WgForm'
import WgTable from '@/components/WgTable'
import { findCouponListByParam } from '@/api/coupon'

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
		WgForm,
		WgTable,
	},

	data() {
		return {
			searchItem: [
				{
					title: '搜索',
					dataIndex: 'couponName',
					placeholder: '请输入优惠券名称',
					colSpan: 8,
				},
			],
			searchData: {
				couponName: '',
			},
			rowData: {},
			loading: false,
			tableData: [],
			tableColumns: [
				{
					dataIndex: 'couponName',
					title: '优惠券名称',
				},
				{
					title: '操作',
					width: 200,
					type: 'custom',
					align: 'center',
					dataIndex: 'yxCouponId',
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			funAction: [
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
		// 单选
		changeRow(row) {
			this.rowData = Object.assign({}, row)
		},

		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}

			const paramJson = Object.assign(this.searchData, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})
			return paramJson
		},

		// 获取商家列表
		async init(flag) {
			const paramJson = this.findSearchParams(flag)
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await findCouponListByParam(paramJson)
			this.loading = false

			if (resultCode == 0 && resultData.YxCouponList.length > 0) {
				this.tableData = resultData.YxCouponList
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},

		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.rowData = {}
		},

		// 确定
		submitForm() {
			if (!this.rowData.yxCouponId) {
				return this.$message.warning('请选择优惠券')
			}

			this.$emit('fatherMethodInit', this.rowData)
			this.resetForm()
		},
	},
}
</script>

<style lang="scss" scoped>
.btn {
	text-align: right;
}
</style>

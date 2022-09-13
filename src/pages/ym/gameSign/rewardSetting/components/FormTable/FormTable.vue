<template>
	<basic-container>
		<div>
			<yx-form :inline="true" :formAction="oneformAction"></yx-form>
			<el-row>
				<yx-table
					:columns="tableColumns"
					:data="tableData"
					:actionInline="true"
					v-loading="tableLoading"
				>
				</yx-table>
			</el-row>
			<EditDialog
				ref="form"
				:title="EditDialogTitle"
				:visible.sync="dialogVisible"
				:row="editItem"
				:dialogState="dialogState"
				@initTable="_getActFishCouponList"
			/>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import EditDialog from './components/EditDialog'

import { getActFishCouponList, delActFishCouponList } from '@/api/actFish'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		EditDialog,
	},
	name: 'FormTable',

	data() {
		return {
			editItem: {},
			dialogVisible: false,
			dialogState: false,
			tableData: [],
			tableLoading: false,
			oneformAction: [
				{
					title: '新增奖励',
					type: 'primary',
					// auth: 'bindDepartmentId',
					click: () => {
						this.addReward()
					},
				},
			],
			tableColumns: [
				{
					width: 80,
					dataIndex: 'yxCouponId',
					title: '优惠券ID',
				},
				{
					dataIndex: 'couponName',
					title: '优惠券名称',
				},
				{
					dataIndex: 'startTime',
					title: '可领取时间',
					width: 285,
					customRender: (row) => {
						return (
							moment(row.startTime).format('YYYY-MM-DD HH:mm:ss') +
							' - ' +
							moment(row.endTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					dataIndex: 'status',
					title: '领取状态',
					width: 150,
					customRender: (row) => {
						if (row.status == 0) {
							return '未开始'
						} else if (row.status == 1) {
							return '进行中'
						} else if (row.status == 2) {
							return '已结束'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '编辑',
							// auth: 'getOrganizationDetails',
							click: (row) => {
								this.addReward(row)
							},
						},
						{
							title: '删除',
							// auth: 'checkGoodsPrice',
							click: (row) => {
								this.$confirm('确定删除?', '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning',
								})
									.then(() => {
										this.tableLoading = true
										delActFishCouponList({
											actFishCouponId: row.actFishCouponId,
										}).then(({ data }) => {
											if (data.resultCode == 0) {
												this.$message.success('删除成功')
												this._getActFishCouponList()
											}
										})
									})
									.catch(() => {
										this.$message({
											type: 'info',
											message: '已取消',
										})
									})
							},
						},
					],
				},
			],
		}
	},
	created() {
		this._getActFishCouponList()
	},
	methods: {
		async _getActFishCouponList() {
			this.tableLoading = true
			let { data } = await getActFishCouponList()
			this.tableLoading = false
			if (data.resultCode == 0) {
				this.tableData = data.resultData
			} else {
				this.tableData = []
			}
		},
		async addReward(row) {
			// 新建津贴限额计划
			if (row && row.actFishCouponId) {
				// 编辑津贴限额计划
				this.EditDialogTitle = '编辑奖励'
				this.editItem = row
			} else {
				this.EditDialogTitle = '添加奖励'
				this.editItem = {}
			}

			this.dialogVisible = true
			this.dialogState = true
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

<template>
	<basic-container>
		<div>
			<yx-form :inline="true" :formAction="oneformAction"></yx-form>
			<el-row>
				<yx-table
					:columns="tableColumns"
					:data="tableData"
					:actionInline="true"
					:pagination="page"
					v-loading="tableLoading"
				>
				</yx-table>
			</el-row>
			<EditDialog
				ref="form"
				:title="EditDialogTitle"
				:visible.sync="dialogVisible"
				:row="editItem"
				@initTable="_getShopkeeperCouponList"
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
import {
	shopkeeperCouponList,
	shopkeeperCouponRemove,
} from '@/api/newComerArea'
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
			tableData: [],
			tableLoading: false,
			oneformAction: [
				{
					title: '新增优惠券',
					type: 'primary',
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
					dataIndex: 'yxCouponName',
					title: '优惠券名称',
				},
				{
					dataIndex: 'startTime',
					title: '可领取时间',
					width: 285,
					customRender: (row) => {
						return (
							moment(row.canReceiveStartTime).format('YYYY-MM-DD HH:mm:ss') +
							' - ' +
							moment(row.canReceiveEndTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					dataIndex: 'receiveStatus',
					title: '领取状态',
					width: 150,
					customRender: (row) => {
						// 0:未开始 1:进行中 2:已结束
						if (row.receiveStatus == 0) {
							return '未开始'
						} else if (row.receiveStatus == 1) {
							return '进行中'
						} else if (row.receiveStatus == 2) {
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
							title: '重选',
							click: (row) => {
								this.addReward(row)
							},
						},
						{
							title: '移除',
							click: (row) => {
								this.$confirm(
									'确定移除优惠券 ' + row.yxCouponName + ' ?',
									'提示',
									{
										confirmButtonText: '确定',
										cancelButtonText: '取消',
										type: 'warning',
									}
								).then(() => {
									this.tableLoading = true
									shopkeeperCouponRemove({
										id: row.id,
									}).then(({ data }) => {
										if (data.resultCode == 0) {
											this.$message.success('移除成功')
											if (
												this.tableData.length === 1 &&
												this.page.currentPage > 1
											) {
												this.page.currentPage--
											}
											this._getShopkeeperCouponList()
										}
									})
								})
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
					this._getShopkeeperCouponList()
				},
			},
		}
	},
	created() {
		this._getShopkeeperCouponList()
	},
	methods: {
		async _getShopkeeperCouponList() {
			this.tableLoading = true
			let { data } = await shopkeeperCouponList({
				pageSize: this.page.length,
				pageNum: this.page.currentPage,
			})
			this.tableLoading = false
			if (data.resultCode == 0) {
				this.page.count = data.resultData.total
				this.tableData = data.resultData.records
			} else {
				this.tableData = []
			}
		},
		async addReward(row) {
			if (row && row.id) {
				this.EditDialogTitle = '编辑优惠券'
				this.editItem = row
			} else {
				this.EditDialogTitle = '添加优惠券'
				this.editItem = {}
			}

			this.dialogVisible = true
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

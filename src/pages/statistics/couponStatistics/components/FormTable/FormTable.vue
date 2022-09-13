<template>
	<div class="couponStatistics">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
				<template #couponIdList>
					<el-input
						type="textarea"
						:rows="2"
						placeholder="可支持用逗号或换行批量搜索，精确搜索"
						v-model="formData101.couponIdList"
					>
					</el-input>
				</template>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns102"
				:pagination="page102"
				:data="tableData102"
			>
				<template slot="couponName" slot-scope="scope">
					<div>
						<router-link :to="`/ym/couponDetails/${scope.row.yxCouponId}`">
							<el-button type="text">{{ scope.row.couponName }}</el-button>
						</router-link>
					</div>
				</template>
				<template slot="range" slot-scope="scope">
					<el-button
						type="text"
						@click="handleConference(scope.row)"
						v-if="
							scope.row.range == 1 &&
							scope.row.rangeExtInfo &&
							scope.row.rangeExtInfo.length > 1
						"
						>指定会场（{{
							scope.row.rangeExtInfo ? scope.row.rangeExtInfo.length : 0
						}}）</el-button
					>
					<el-button
						type="text"
						@click="handleCommodity(scope.row)"
						v-else-if="
							scope.row.range == 3 &&
							scope.row.rangeExtInfo &&
							scope.row.rangeExtInfo.length > 1
						"
						>指定商品（{{
							scope.row.rangeExtInfo ? scope.row.rangeExtInfo.length : 0
						}}）</el-button
					>
					<span
						v-else-if="
							scope.row.range == 1 &&
							scope.row.rangeExtInfo &&
							scope.row.rangeExtInfo.length == 1
						"
						>指定会场：{{ scope.row.rangeExtInfo[0] }}</span
					>
					<span
						v-else-if="
							scope.row.range == 3 &&
							scope.row.rangeExtInfo &&
							scope.row.rangeExtInfo.length == 1
						"
						>指定商品：{{ scope.row.rangeExtInfo[0] }}</span
					>
					<span v-else>全场</span>
				</template>
			</yx-table>
		</basicContainer>
		<conference-hall-dialog
			:visible.sync="conferenceHallDialog"
			:conferenceHallRow="conferenceHallRow"
		>
		</conference-hall-dialog>
		<designated-goods-dialog
			:visible.sync="designatedGoodsDialog"
			:conferenceHallRow="conferenceHallRow"
		></designated-goods-dialog>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import ConferenceHallDialog from './ConferenceHallDialog'
import DesignatedGoodsDialog from './DesignatedGoodsDialog'
import moment from 'moment'
import {
	findCouponListByParamNew,
	exportCMSYXCouponStatistics,
} from '@/api/yhtPlusCoupon'
import { downloadFile } from '@/utils/helper/common'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		ConferenceHallDialog,
		DesignatedGoodsDialog,
	},
	props: [],
	data() {
		return {
			loading: false,
			conferenceHallDialog: false,
			designatedGoodsDialog: false,
			conferenceHallRow: {},
			formData101: {
				couponName: '',
				couponIdList: '',
				startTime: moment().startOf('month').valueOf(),
				endTime: moment().endOf('month').valueOf(),
				addStartTime: moment().startOf('month').valueOf(),
				addEndTime: moment().endOf('month').valueOf(),
				isDel: 0,
			},
			formCfg101: [
				{
					type: 'custom',
					dataIndex: 'couponIdList',
					title: '优惠券ID',
				},
				{
					type: 'input',
					title: '优惠券名称',
					dataIndex: 'couponName',
					placeholder: '请输入优惠券名称',
					enter: () => {
						if (!this.loading) this.getData102(true)
					},
				},
				{
					type: 'datetimerange',
					title: '创建时间',
					dataIndex: ['addStartTime', 'addEndTime'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
				},
				{
					type: 'datetimerange',
					title: '有效时间',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
				},
				{
					title: '是否删除',
					type: 'select',
					dataIndex: 'isDel',
					placeholder: '是否删除',
					label: 'value',
					options: [
						{
							value: '全部',
							isDel: 0,
						},
						{
							value: '是',
							isDel: 1,
						},
						{
							value: '否',
							isDel: 2,
						},
					],
					change: () => {
						if (!this.loading) this.getData102(true)
					},
				},
			],
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData102(true)
					},
					tableId: 102,
				},
				{
					title: '导出excel',
					type: '',
					auth: 'exportCMSYXCouponStatistics',
					click: () => {
						this.exportIt()
					},
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					dataIndex: 'yxCouponId',
					title: '优惠券ID',
				},
				{
					type: 'custom',
					dataIndex: 'couponName',
					title: '优惠券名称',
					width: 130,
				},
				{
					type: 'string',
					dataIndex: 'yxCouponType',
					title: '优惠券类型',
				},
				{
					type: 'string',
					dataIndex: 'expiryDateType',
					title: '有效期',
					width: 300,
					customRender: (row) => {
						if (row.expiryDateType == 1) {
							return (
								moment(row.startTime).format('YYYY-MM-DD HH:mm:ss') +
								'~' +
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
					type: 'custom',
					dataIndex: 'range',
					width: '140',
					title: '使用范围',
				},
				{
					type: 'amount',
					dataIndex: 'yxCouponGrantTotalAmount',
					title: '发放总金额',
				},
				{
					type: 'string',
					dataIndex: 'grantQuantity',
					title: '发放数量',
				},
				{
					type: 'string',
					dataIndex: 'receiveQuantity',
					title: '已领取数量',
				},
				{
					type: 'string',
					dataIndex: 'yxCouponProportionUsed',
					title: '已使用占比',
				},
				{
					type: 'amount',
					dataIndex: 'yxCouponReceiveAmount',
					title: '领取金额',
				},
				{
					type: 'string',
					dataIndex: 'useQuantity',
					title: '已使用',
				},
				{
					type: 'amount',
					dataIndex: 'totalAmountUsed',
					title: '已使用总金额',
				},
				{
					type: 'amount',
					dataIndex: 'totalOrderAmount',
					title: '用券总成交额',
				},
				{
					type: 'string',
					dataIndex: 'yxCouponProportionReceived',
					title: '已领取占比',
				},
				{
					type: 'string',
					dataIndex: 'overdueCount',
					title: '已过期',
				},
				{
					type: 'string',
					dataIndex: 'goodsTransactNum',
					title: '成交商品数',
				},
				{
					type: 'string',
					dataIndex: 'status',
					title: '是否删除',
					customRender: (row) => {
						return row.status == -1 ? '是' : '否'
					},
				},
			],
			page102: {
				count: 1,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData102()
				},
			},
		}
	},

	created() {
		this.getData102(true)
	},
	mounted() {
		let a = this.MonthsBetw('2019-11', '2019-11')
		console.log(a, '==========')
	},
	methods: {
		//返回两个日期相差的月数
		MonthsBetw(date1, date2) {
			//用-分成数组
			date1 = date1.split('-')
			date2 = date2.split('-')
			//获取年,月数
			let year1 = parseInt(date1[0]),
				month1 = parseInt(date1[1]),
				year2 = parseInt(date2[0]),
				month2 = parseInt(date2[1]),
				//通过年,月差计算月份差
				months = (year2 - year1) * 12 + (month2 - month1) + 1
			return months
		},
		handleConference(val) {
			this.conferenceHallRow = val
			this.conferenceHallDialog = true
		},
		handleCommodity(val) {
			this.conferenceHallRow = val
			this.designatedGoodsDialog = true
		},
		async exportIt() {
			// 导出数据
			let paramJson = this.findSearchParams102()
			paramJson.isLength = true
			let { data } = await exportCMSYXCouponStatistics(paramJson)
			downloadFile(data, 'excel.xls')
		},
		async getData102(flag) {
			this.loading = true
			let paramJson = this.findSearchParams102(flag)
			if (paramJson.startTime || paramJson.endTime) {
				paramJson.expiryDateType = 1
			} else {
				paramJson.expiryDateType = 0
			}
			const {
				data: { resultCode, resultData },
			} = await findCouponListByParamNew(paramJson)
			if (resultCode != 0) {
				this.$message({
					type: 'error',
					message: '查询超时',
					duration: 3000,
				})
			}
			if (resultData.YxCouponList) {
				let YxCouponList = resultData.YxCouponList
				YxCouponList.forEach((item) => {
					if (item.rangeExtInfo) {
						item.rangeExtInfo = item.rangeExtInfo.split(',')
					} else {
						item.rangeExtInfo = []
					}
				})
				this.tableData102 = resultData.YxCouponList
				this.page102.count = resultData.count
				console.log(this.tableData102, '============')
			}
			this.loading = false
		},
		findSearchParams102(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			const paramJson = Object.assign(this.formData101, {
				length: this.page102.length,
				startIndex: (this.page102.currentPage - 1) * this.page102.length,
			})
			paramJson.couponIdList = paramJson.couponIdList.replace(/\n/g, ',')
			paramJson.couponIdList = paramJson.couponIdList.replace(/\s*/g, '') //商品货号
			return paramJson
		},
	},
}
</script>

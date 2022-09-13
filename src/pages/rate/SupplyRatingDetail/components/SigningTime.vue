<template>
	<div class="CollectionTime">
		<div>
			<SupplyRatingDetailEchart
				label="签收时长"
				echartId="CollectionTime"
				:options="options"
				ref="SupplyRatingDetailEchart"
				v-bind="$attrs"
			/>
		</div>
		<div style="margin-top: 40px">
			<yx-form
				v-loading="eLoading"
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			>
				<template slot="searchTime" scope="row">
					<el-date-picker
						v-model="row.data.searchTime"
						type="date"
						placeholder="选择日期"
					>
					</el-date-picker>
				</template>
			</yx-form>
		</div>
		<yx-table
			v-loading="showLoading"
			:select="true"
			:columns="tableColumns"
			:selectionChange="handleSelectionChange"
			:pagination="pagination"
			:data="tableData"
		></yx-table>
	</div>
</template>

<script>
// import * as echarts from 'echarts'
import SupplyRatingDetailEchart from './Echart'
import YxForm from '@wg-vue-materials/yx-form'
import yxTable from '@wg-vue-materials/yx-table'
import {
	getSupplierOrderSignForGradeList,
	getSupplierOrderSignForGradeListExport,
} from '@/api/monitorController'
import { downloadFile } from '@/utils/helper/common'
import moment from 'moment'

export default {
	props: {
		platformEchart: {
			type: Array,
			default: () => [],
		},
		supplierEchart: {
			type: Array,
			default: () => [],
		},
	},
	components: {
		YxForm,
		yxTable,
		SupplyRatingDetailEchart,
	},
	name: 'FormTable',
	data() {
		return {
			options: {},
			tableData: [],
			eLoading: false,
			showLoading: false,
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'orderSn',
					title: '订单号',
				},
				{
					type: 'date',
					dataIndex: 'orderCreateTime',
					title: '订单时间',
				},
				{
					type: 'string',
					dataIndex: 'signForTimeDouble',
					title: '签收时长(h)',
					customRender: (row) => {
						return row.signForTimeDouble.toFixed(2) || '0.00'
					},
				},
				{
					type: 'string',
					dataIndex: 'expressSn',
					title: '物流单号',
					customRender: (row) => {
						return row.expressSn || '-'
					},
				},
			],
			formInline: {
				orderSn: '', //订单号
				expressSn: '', //快递单号
				signTimeMin: '', //签收时长
				signTimeMax: '', //签收时长
				timer: [
					moment().startOf('day').valueOf(),
					moment().endOf('day').valueOf(),
				], //订单时间
			},
			formCfg: [
				{
					title: '签收时长',
					type: 'inputNumber',
					dataIndex: 'signTimeMin',
					placeholder: '请输入签收时长',
				},
				{
					title: '-',
					type: 'inputNumber',
					dataIndex: 'signTimeMax',
					placeholder: '请输入签收时长',
				},
				{
					title: '订单号',
					type: 'input',
					dataIndex: 'orderSn',
					placeholder: '请输入订单号',
					enter: () => {
						this._init(true)
					},
				},
				{
					title: '物流单号',
					type: 'input',
					dataIndex: 'expressSn',
					placeholder: '请输入物流单号',
					enter: () => {
						this._init(true)
					},
				},

				{
					title: '订单时间',
					dataIndex: 'timer',
					type: 'time',
					timeAttributes: {
						type: 'datetimerange',
						defaultTime: ['00:00:00', '23:59:59'],
					},
				},
			],
			formAction: [
				{
					title: '搜索',
					type: 'primary',
					click: () => {
						this._init(true)
					},
				},
				{
					title: '导出',
					auth: '',
					type: 'primary',
					click: () => {
						this.exportExcel()
					},
				},
			],
			multipleSelection: [], // 多选
			pagination: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._init()
				},
			},
			formDialog: false,
		}
	},

	watch: {
		//观察supplierEchart的变化
		supplierEchart: {
			handler(newVal, oldVal) {
				if (newVal != oldVal) {
					this.echartInit()
				}
			},
			deep: true, //对象内部属性的监听，关键。
			immediate: true,
		},
	},
	methods: {
		echartInit() {
			let options = {
				tooltip: {
					trigger: 'axis',
					formatter: function (params) {
						let res = params[0].name
						for (let i = 0; i < params.length; i++) {
							res +=
								'<br>' +
								params[i].marker +
								params[i].seriesName +
								'：' +
								params[i].data +
								(params[i].seriesName.indexOf('时长') != -1 ? 'h' : '')
						}
						return res
					},
				},
				color: ['#fac858', '#73c0de', '#91cc75'],
				legend: {
					x: 'center',
					data: ['签收时长(h)', '平均排名', '平台平均时长(h)'],
					icon: 'circle',
					top: '5%',
					right: '5%',
					itemWidth: 6,
					itemGap: 20,
					textStyle: {
						color: '#556677',
					},
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '15%',
					containLabel: true,
				},
				dataZoom: [
					{
						type: 'slider', //图表下方的伸缩条
						show: false, //是否显示
						realtime: true, //拖动时，是否实时更新系列的视图
						filterMode: 'empty',
						start: 0,
					},
					// { moveOnMouseWheel: false },
				],
				xAxis: {
					// axisLabel: {
					// 	interval: 0, //横轴信息全部显示
					// },
					type: 'category',
					boundaryGap: true,
					data: [],
					axisLine: {
						show: false,
					},
					axisTick: {
						show: false,
					},
				},
				yAxis: {
					type: 'value',
					axisLabel: {
						color: '#333',
						formatter: '{value}',
					},
					splitLine: {
						lineStyle: {
							type: 'dashed',
						},
					},
					axisLine: {
						lineStyle: {
							color: 'rgba(107,107,107,.37)',
						},
					},
				},
				series: [
					{
						name: '签收时长(h)',
						type: 'line',
						data: [],
					},
					{
						name: '平均排名',
						type: 'line',
						data: [],
					},
					{
						name: '平台平均时长(h)',
						type: 'line',
						data: [],
					},
				],
			}
			options.xAxis.data = this.supplierEchart.map((item) => {
				return item.analysisDate
			})
			options.series[0].data = this.supplierEchart.map((item) => {
				return item.averageSignForTime || 0
			})
			options.series[1].data = this.supplierEchart.map((item) => {
				return item.averageSignForRanking || 0
			})
			options.series[2].data = this.supplierEchart.map((item) => {
				return (
					(item.searchPlatformGradeForResponseDTO &&
						item.searchPlatformGradeForResponseDTO.averageSignForTime) ||
					0
				)
			})
			if (options.xAxis.data.length > 10) {
				//	json.dataZoom[0].startValue = xAxisData[xAxisData.length - 10]
				options.dataZoom[0].show = true
			} else {
				options.dataZoom[0].show = false
				//		json.dataZoom[0].startValue = xAxisData[0]
			}
			this.options = options
		},
		toggleSelection(rows) {
			if (rows) {
				rows.forEach((row) => {
					this.$refs.multipleTable.toggleRowSelection(row)
				})
			} else {
				this.$refs.multipleTable.clearSelection()
			}
		},
		handleSelectionChange(val) {
			this.multipleSelection = val
		},
		exportExcel: async function () {
			let paramJson = this.findSearchParams()
			if (this.formInline.signTimeMin < 0 || this.formInline.signTimeMax < 0) {
				this.$message.error('签收时长请填写正数！')
				return
			}
			if (
				(this.formInline.signTimeMin && !this.formInline.signTimeMax) ||
				(!this.formInline.signTimeMin && this.formInline.signTimeMax)
			) {
				this.$message.error('签收时长请填写完整的时间区间')
				return
			}
			if (this.multipleSelection && this.multipleSelection.length > 0) {
				paramJson.analysisOrderMetadataIds = this.multipleSelection.map(
					(item) => {
						return item.analysisOrderMetadataId
					}
				)
			}
			this.eLoading = true
			let { data } = await getSupplierOrderSignForGradeListExport(paramJson)
			this.eLoading = false
			downloadFile(data, '导出详情.xlsx')
		},
		// 查询列表数据
		async _init(flag) {
			if (this.formInline.signTimeMin < 0 || this.formInline.signTimeMax < 0) {
				this.$message.error('签收时长请填写正数！')
				return
			}
			if (
				(this.formInline.signTimeMin && !this.formInline.signTimeMax) ||
				(!this.formInline.signTimeMin && this.formInline.signTimeMax)
			) {
				this.$message.error('签收时长请填写完整的时间区间')
				return
			}
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getSupplierOrderSignForGradeList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.datalist || []
				this.pagination.count = resultData.count
			}
		},

		// 获取筛选的数据
		findSearchParams(flag) {
			let paramJson = JSON.parse(JSON.stringify(this.formInline))
			// 每页的加载数据长度
			paramJson.length = this.pagination.length

			paramJson.supplierId = this.$route.params.supplierId
			paramJson.signTimeMin = paramJson.signTimeMin
				? parseFloat(paramJson.signTimeMin).toFixed(2)
				: ''
			paramJson.signTimeMax = paramJson.signTimeMax
				? parseFloat(paramJson.signTimeMax).toFixed(2)
				: ''
			paramJson.addTimeStart = this.formInline.timer
				? moment(this.formInline.timer[0]).valueOf()
				: ''
			paramJson.addTimeEnd = this.formInline.timer
				? moment(this.formInline.timer[1]).valueOf()
				: ''
			// 当前页的条数开始
			if (flag) {
				this.pagination.currentPage = 1
			}
			paramJson.startIndex =
				(this.pagination.currentPage - 1) * this.pagination.length
			return paramJson
		},
	},
}
</script>

<style>
.my_header {
	display: flex;
	justify-content: center;
	align-items: center;
}
.my_el-icon-question {
	font-size: 16px;
	margin-left: 10px;
	margin-bottom: 4px;
}
.pagination {
	padding: 30px 0;
	display: flex;
	justify-content: center;
}
</style>

<template>
	<Dialog
		:title="title"
		:visible.sync="visible"
		width="1200px"
		@close="handleClose"
		:showClose="true"
	>
		<div v-loading="loading">
			<div class="data-item">
				<div class="data-item-title">· 汇总数据</div>
				<div class="data-item-content">
					<yx-table :columns="tableColumnsTotal" :data="allData.total">
					</yx-table>
					<yx-table :columns="tableColumnsPV" :data="allData.pv"></yx-table>
					<yx-table :columns="tableColumnsUV" :data="allData.uv"></yx-table>
				</div>
			</div>
			<div class="data-item">
				<div class="data-item-title">· 小程序</div>
				<div class="data-item-content">
					<yx-table :columns="tableColumnsTotal" :data="xcxData.total">
					</yx-table>
					<yx-table :columns="tableColumnsPV" :data="xcxData.pv"></yx-table>
					<yx-table :columns="tableColumnsUV" :data="xcxData.uv"></yx-table>
				</div>
			</div>
			<div class="data-item">
				<div class="data-item-title">· B端APP</div>
				<div class="data-item-content">
					<yx-table :columns="tableColumnsTotal" :data="bAppData.total">
					</yx-table>
					<yx-table :columns="tableColumnsPV" :data="bAppData.pv"></yx-table>
					<yx-table :columns="tableColumnsUV" :data="bAppData.uv"></yx-table>
				</div>
			</div>
		</div>
	</Dialog>
</template>

<script>
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'

// 获取默认数据
function getDefaultData() {
	return {
		total: [
			{
				uv: 0,
				click: 0,
				rate: 0,
			},
		],
		uv: [
			{
				uv: 0,
				click: 0,
				rate: 0,
			},
		],
		pv: [
			{
				pv: 0,
				click: 0,
				rate: 0,
			},
		],
	}
}

export default {
	components: {
		Dialog,
		YxTable,
	},

	props: {
		title: {
			type: String,
			default: '',
		},
		visible: {
			type: Boolean,
			default: false,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		viewData: {
			type: Object,
			default: () => {},
		},
	},

	watch: {
		viewData(val) {
			const {
				// app总点击次数
				appClickNumber = 0,
				// app总点击率
				appClickRate = 0,
				// app总曝光次数
				appExposureNumber = 0,
				// app最近30天点击次数
				appLatelyClickNumber = 0,
				// app最近30天点击人数
				appLatelyClickUv = 0,
				// app最近30天曝光人数
				appLatelyExposureUv = 0,
				// app最近30天曝光次数
				appLatelyPv = 0,
				// app最近30天次数点击率
				appPvClickRate = 0,
				// app最近30天人数点击率
				appUvClickRate = 0,
				// 小程序总点击次数
				smallClickNumber = 0,
				// 小程序总点击率
				smallClickRate = 0,
				// 小程序总曝光次数
				smallExposureNumber = 0,
				// 小程序最近30天点击次数
				smallLatelyClickNumber = 0,
				// 小程序最近30天点击人数
				smallLatelyClickUv = 0,
				// 小程序最近30天曝光人数
				smallLatelyExposureUv = 0,
				// 小程序最近30天曝光次数
				smallLatelyPv = 0,
				// 小程序最近30天次数点击率
				smallPvClickRate = 0,
				// 小程序最近30天人数点击率
				smallUvClickRate = 0,
				// 汇总点击次数
				totalClickNumber = 0,
				// 汇总总点击率
				totalClickRate = 0,
				// 汇总曝光次数
				totalExposureNumber = 0,
				// 汇总最近30天点击次数
				totalLatelyClickNumber = 0,
				// 汇总最近30天点击人数
				totalLatelyClickUv = 0,
				// 汇总最近30天曝光人数
				totalLatelyExposureUv = 0,
				// 汇总最近30天曝光次数
				totalLatelyPv = 0,
				// 汇总最近30天次数点击率
				totalPvClickRate = 0,
				// 汇总最近30天人数点击率
				totalUvClickRate = 0,
			} = val || {}

			this.allData = {
				total: [
					{
						uv: totalExposureNumber,
						click: totalClickNumber,
						rate: totalClickRate,
					},
				],
				pv: [
					{
						pv: totalLatelyPv,
						click: totalLatelyClickNumber,
						rate: totalPvClickRate,
					},
				],
				uv: [
					{
						uv: totalLatelyExposureUv,
						click: totalLatelyClickUv,
						rate: totalUvClickRate,
					},
				],
			}
			this.xcxData = {
				total: [
					{
						uv: smallExposureNumber,
						click: smallClickNumber,
						rate: smallClickRate,
					},
				],
				pv: [
					{
						pv: smallLatelyPv,
						click: smallLatelyClickNumber,
						rate: smallPvClickRate,
					},
				],
				uv: [
					{
						uv: smallLatelyExposureUv,
						click: smallLatelyClickUv,
						rate: smallUvClickRate,
					},
				],
			}
			this.bAppData = {
				total: [
					{
						uv: appExposureNumber,
						click: appClickNumber,
						rate: appClickRate,
					},
				],
				pv: [
					{
						pv: appLatelyPv,
						click: appLatelyClickNumber,
						rate: appPvClickRate,
					},
				],
				uv: [
					{
						uv: appLatelyExposureUv,
						click: appLatelyClickUv,
						rate: appUvClickRate,
					},
				],
			}
		},
	},

	data() {
		return {
			allData: getDefaultData(),
			xcxData: getDefaultData(),
			bAppData: getDefaultData(),
			tableColumnsTotal: [
				{
					type: 'string',
					dataIndex: 'uv',
					title: '曝光总次数',
					width: 120,
				},
				{
					type: 'string',
					dataIndex: 'click',
					title: '点击次数',
					width: 120,
				},
				{
					type: 'string',
					dataIndex: 'rate',
					title: '点击率',
					width: 120,
					customRender: ({ rate }) => {
						return (parseFloat(rate * 100).toFixed(2) || 0) + '%'
					},
				},
			],
			tableColumnsPV: [
				{
					type: 'string',
					dataIndex: 'pv',
					title: '近30天曝光次数',
					width: 120,
				},
				{
					type: 'string',
					dataIndex: 'click',
					title: '近30天点击次数',
					width: 120,
				},
				{
					type: 'string',
					dataIndex: 'rate',
					title: '点击率',
					width: 120,
					customRender: ({ rate }) => {
						return (parseFloat(rate * 100).toFixed(2) || 0) + '%'
					},
				},
			],
			tableColumnsUV: [
				{
					type: 'string',
					dataIndex: 'uv',
					title: '近30天曝光人数',
					width: 120,
				},
				{
					type: 'string',
					dataIndex: 'click',
					title: '近30天点击人数',
					width: 120,
				},
				{
					type: 'string',
					dataIndex: 'rate',
					title: '点击率',
					width: 120,
					customRender: ({ rate }) => {
						return (parseFloat(rate * 100).toFixed(2) || 0) + '%'
					},
				},
			],
		}
	},

	methods: {
		handleClose() {
			this.$emit('update:visible', false)
			this.allData = getDefaultData()
			this.xcxData = getDefaultData()
			this.bAppData = getDefaultData()
		},
	},
}
</script>

<style scoped lang="scss">
.data-item {
	margin-bottom: 30px;
	.data-item-title {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 15px;
	}

	.data-item-content {
		display: flex;
		justify-content: space-between;
	}
}
</style>

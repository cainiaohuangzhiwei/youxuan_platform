<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			></yx-form>

			<el-row>
				<yx-table
					:select="true"
					:columns="tableColumns"
					:selectionChange="selectionChange"
					:pagination="page"
					:data="list"
					><template slot="operating" slot-scope="scope">
						<el-button type="text" size="small" @click="checkStock(scope.row)"
							>库存盘点</el-button
						>
						<el-button type="text" size="small" @click="againEvents(scope.row)"
							>重新爬取</el-button
						>
					</template></yx-table
				>
			</el-row>
		</div>
	</basic-container>
</template>

<script>
import { getBrandRecordListByCondition } from '@/api/yhtPlusCmsMasterControl'
import { priorityLoad } from '@/api/priority'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import { getConstantValueByKey } from '@/utils/helper/common'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	name: 'FormTable',

	data() {
		return {
			// 详情数据
			list: [],
			count: 0,
			// 选中的表格条目
			selectList: [],
			// 分页
			currentPage: 1,
			// 长度
			pageLength: 10,
			// 新修改
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: this.onSubmit,
				},
				{
					title: '批量盘点',
					type: 'primary',
					click: this.batchMake,
				},
			],
			formInline: {
				keyword: '',
				sourceType: '',
				startTime: moment(moment().startOf('month')).valueOf(), // 下单开始时间
				endTime: moment(moment().endOf('month')).valueOf(), // 下单结束时间
			},
			formCfg: [
				{
					title: '品牌名称',
					type: 'input',
					dataIndex: 'keyword',
					placeholder: '品牌名称',
				},
				{
					title: '渠道',
					type: 'select',
					label: 'value',
					dataIndex: 'sourceType',
					options: this.$store.state.app.constant.CARETSORCE_TYPE,
				},
				{
					label: '开播时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
				},
			],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '品牌名称',
				},
				{
					type: 'string',
					dataIndex: 'goodsCount',
					title: '商品数量',
				},
				{
					type: 'string',
					dataIndex: 'sourceType',
					title: '渠道',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.CARETSORCE_TYPE,
							row.sourceType,
							'-',
							'sourceType'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'startTime',
					title: '开播时间',
					customRender: (row) => {
						return row.startTime
							? moment(row.startTime).format('YYYY-MM-DD HH:mm:ss')
							: '无'
					},
				},
				{
					type: 'string',
					dataIndex: 'brandState',
					title: '爬取状态',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.CRAWLING_STATE,
							row.brandState,
							'-',
							'brandState'
						)
					},
				},
				{
					type: 'custom',
					dataIndex: 'operating',
					title: '操作',
				},
			],
			page: {
				count: 0,
				currentPage: 1,
				length: 10,
				tableChange: () => {
					this.callBrandRecordListByCondition()
				},
			},
		}
	},

	created: function () {
		this.$nextTick(() => {
			this.callBrandRecordListByCondition()
		})
	},
	methods: {
		onSubmit() {
			this.callBrandRecordListByCondition(true)
		},
		resetForm(formName) {
			this.$refs[formName].resetFields()
		},
		// 新修改
		selectionChange(list) {
			this.selectList = list
		},
		findSearchParams(flag) {
			let paramJson = this.formInline
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		async callBrandRecordListByCondition(flag) {
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getBrandRecordListByCondition(paramJson)
			if (resultCode == 0) {
				this.list = resultData.brandRecordList
				this.page.count = resultData.count
			}
		},
		// 批量盘点
		batchMake() {
			if (!this.selectList.length) {
				this.$message({
					message: '请选择品牌',
					type: 'warning',
				})
				return
			}
			let brandList = []
			this.selectList.map((item) => {
				brandList.push({
					brandId: item.brandId,
					sourceType: item.sourceType,
					brandName: item.brandName,
				})
			})
			this.checkStock(brandList)
		},
		// 库存盘点
		checkStock(brandList) {
			let self = this
			this.$confirm('确认要库存盘点吗？', '提示', {
				type: 'warning',
				callback: async (action) => {
					if (!Array.isArray(brandList)) {
						brandList = [brandList]
					}
					if (action === 'confirm') {
						let {
							data: { resultCode, resultMsg },
						} = await priorityLoad({
							brandList: brandList,
							Type: 4,
						})
						if (resultCode === 0) {
							self.$message.success({
								message: resultMsg,
								duration: 1000,
								onClose() {
									this.callsupplierAccountNumberList()
								},
							})
						}
					}
				},
			})
		},
		// 重新爬取
		againEvents(row) {
			let self = this
			this.$confirm('确认要重新爬取吗？', '提示', {
				type: 'warning',
				callback: async function (action) {
					if (action === 'confirm') {
						let brandList = {
							brandId: row.brandId,
							sourceType: row.sourceType,
							brandName: row.brandName,
						}
						let {
							data: { resultCode, resultMsg },
						} = await priorityLoad({
							Type: 2,
							brandList: [brandList],
						})
						if (resultCode === 0) {
							self.$message.success({
								message: resultMsg,
								duration: 1000,
								onClose() {
									this.callBrandRecordListByCondition()
								},
							})
						}
					}
				},
			})
		},
	},
}
</script>

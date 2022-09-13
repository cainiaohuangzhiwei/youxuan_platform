<template>
	<div class="goodsStockList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData105"
				:items="formCfg105"
				:formAction="formAction105"
			>
				<template #supplierName>
					<el-input
						v-model="formData105.supplierName"
						placeholder="请选择商家"
						@focus="handleAdd"
						clearable
						@clear="
							() => {
								formData105.supplierName = []
								formData105.supplierAccountNumberId = []
								selectGroupList = {}
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="handleAdd"
						></el-button>
					</el-input>
				</template>
			</yx-form>
			<yx-table
				v-loading="loading"
				:columns="tableColumns106"
				:pagination="page106"
				:data="tableData106"
			>
			</yx-table>
			<!-- //上传票据信息 -->
			<!-- 商家选择 S-->
			<supplier-account-dialog
				:itemInfo="supplyRow"
				:visible.sync="formsDialog"
				@fatherMethodInit="fatherMethodInit"
			/>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import SupplierAccountDialog from '@/components/SupplierAccountDialog'

import { getAppraiseList, exportAppraise } from '@/api/appraise'
import { downloadFile } from '@/utils/helper/common'

import { wgGetDate } from '@/utils/helper/common'
import moment from 'moment'

export default {
	name: 'Appraise',
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		SupplierAccountDialog,
	},
	props: [],
	data() {
		return {
			loading: false,
			tempFileUrlList: [],
			invoiceListData: [],
			fileList: [],
			selectGroupList: {},
			supplyRow: [],
			dateStatusRow: '',
			stateType: '',
			formsDialog: false,
			fileToUpload: '',

			formData105: {
				supplierName: [],
				supplierAccountNumberId: [],
				orderSalesSn: '', //关联订单号
				afterSalesSn: '',
				endAddTime: wgGetDate().getCurrentEndDate, //创建时间,
				startAddTime: wgGetDate().getCurrentStartDate,
			},

			importData: {
				goodsFile: [],
			},

			formCfg105: [
				{
					type: 'input',
					title: '售后单号',
					dataIndex: 'afterSalesSn',
					placeholder: '请输入售后单号',
				},
				{
					type: 'input',
					title: '订单号',
					dataIndex: 'orderSalesSn',
					placeholder: '请输入关联订单号',
				},

				{
					title: '商家名称',
					type: 'custom',
					dataIndex: 'supplierName',
				},

				{
					title: '创建时间',
					type: 'datetimerange',
					dataIndex: ['startAddTime', 'endAddTime'],
					placeholder: ['开始时间', '结束时间'],
				},
			],

			formAction105: [
				{
					title: '查询',
					type: 'primary',
					click: (e) => {
						this.getAppraise(true, e)
					},
				},

				{
					title: '导出',
					auth: 'exportAfterSalesEvaluationList',
					type: 'primary',
					click: () => {
						this._exportInvoice()
					},
				},
			],
			tableData106: [],
			tableColumns106: [
				{
					type: 'string',
					dataIndex: 'orderSalesSn',
					title: '关联订单号',
				},

				{
					type: 'string',
					dataIndex: 'afterSalesSn',
					title: '售后订单号',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
				},
				{
					type: 'string',
					dataIndex: 'score',
					title: '服务评价星级',
				},
				{
					type: 'string',
					dataIndex: 'content',
					title: '详细评价',
				},
				{
					type: 'string',
					dataIndex: 'tagList',
					title: '评价标签',
				},
				{
					type: 'string',
					dataIndex: 'addTime',
					title: '提交时间',
					customRender: (row) => {
						return row.addTime
							? moment(row.addTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
			],
			page106: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getAppraise()
				},
			},
		}
	},

	created() {
		this.getAppraise()
	},

	methods: {
		selectSupplier(e) {
			e.target.blur()
			this.formsDialog = true
		},
		//导出
		_exportInvoice: async function () {
			let formData = {
				afterSalesSn: this.formData105.afterSalesSn,
				orderSalesSn: this.formData105.orderSalesSn, //关联订单号
				startAddTime: moment(this.formData105.startAddTime).valueOf() || '', //创建时间
				endAddTime: moment(this.formData105.endAddTime).valueOf() || '',
				supplierName: this.formData105.supplierName.join(','),
			}
			let paramJson = Object.assign({}, formData)
			paramJson.groupId = this.$store.state.user.userInfo.groupId

			let { data } = await exportAppraise(paramJson)
			downloadFile(data, '售后评价列表.xlsx')
		},

		handleAdd() {
			this.supplyRow = JSON.parse(JSON.stringify(this.selectGroupList))
			this.formsDialog = true
		},
		//处理商家多选查询
		fatherMethodInit(row = {}) {
			this.selectGroupList = JSON.parse(JSON.stringify(row))
			if (!row || !row.supplierName || !row.supplierAccountNumberId) return
			this.formData105.supplierName = [row.supplierName]
			this.formData105.supplierAccountNumberId = [row.supplierAccountNumberId]
		},
		findSearchParams106(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page106.currentPage = 1
			}
			let formData = {
				afterSalesSn: this.formData105.afterSalesSn,
				orderSalesSn: this.formData105.orderSalesSn, //关联订单号
				startAddTime: moment(this.formData105.startAddTime).valueOf() || '', //创建时间
				endAddTime: moment(this.formData105.endAddTime).valueOf() || '',
				supplierName: this.formData105.supplierName.join(','),
			}
			const paramJson = Object.assign(formData, {
				length: this.page106.length,
				currentPage: this.page106.currentPage,
			})
			// paramJson.startTime = moment(paramJson.startTime).valueOf() || ''
			// paramJson.endTime = moment(paramJson.endTime).valueOf() || ''
			return paramJson
		},
		getAppraise: async function (flag, e) {
			let paramJson = this.findSearchParams106(flag)
			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			this.loading = true
			let {
				data: { resultCode, resultData },
			} = await getAppraiseList(paramJson, custom)
			this.loading = false
			if (resultCode == 0) {
				this.tableData106 = resultData.records
				this.page106.count = resultData.total
			} else {
				this.page106.count = 0
				this.tableData106 = []
			}
		},
	},
}
</script>

<template>
	<div class="selectionGoods">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
			</yx-form>
			<div class="selection-goods-btnlist">
				<el-button @click="importExcel" type="primary">导入Excel</el-button>
				<el-button @click="copyText" type="primary">复制文本</el-button>
				<el-button @click="exportExcel" type="primary">导出Excel</el-button>
			</div>
			<yx-table
				:select="true"
				v-loading="loading"
				:selectionChange="selectionChange"
				:columns="tableColumns102"
				:data="tableData102"
				:spanMethod="spanMethod"
			>
				<template slot="groupName" slot-scope="scope">
					<div>
						<span v-if="scope.row.groupName == '选品建议'">{{
							scope.row.groupName
						}}</span>
						<span
							v-else
							:class="
								curTime - scope.row.saleStartTime < 7 * 24 * 60 * 60 * 1000
									? 'selectiongoods-red'
									: ''
							"
							>{{ scope.row.groupName }}</span
						>
					</div>
				</template>
				<template slot="brandName" slot-scope="scope">
					<div>
						<span v-if="scope.row.groupName == '选品建议'">{{
							scope.row.brandName
						}}</span>
						<span
							v-else
							:class="
								curTime - scope.row.saleStartTime < 7 * 24 * 60 * 60 * 1000
									? 'selectiongoods-red'
									: ''
							"
							>{{ scope.row.brandName }}</span
						>
					</div>
				</template>
				<template slot="saleStartTime" slot-scope="scope">
					<div>
						<span v-if="scope.row.groupName == '选品建议'">无-无</span>
						<span
							v-else
							:class="
								curTime - scope.row.saleStartTime < 7 * 24 * 60 * 60 * 1000
									? 'selectiongoods-red'
									: ''
							"
							>{{
								moment(scope.row.saleStartTime).format('YYYY-MM-DD HH:mm:ss') +
								'-' +
								moment(scope.row.saleEndTime).format('YYYY-MM-DD HH:mm:ss')
							}}</span
						>
					</div>
				</template>
				<template slot="supplierName" slot-scope="scope">
					<div>
						<span v-if="scope.row.groupName == '选品建议'">-</span>
						<span
							v-else
							:class="
								curTime - scope.row.saleStartTime < 7 * 24 * 60 * 60 * 1000
									? 'selectiongoods-red'
									: ''
							"
							>{{ scope.row.supplierName }}</span
						>
					</div>
				</template>
				<template slot="orderAmount" slot-scope="scope">
					<div>
						<span v-if="scope.row.groupName == '选品建议'"
							>平均销售额{{ scope.row.sales.toFixed(2) }}</span
						>
						<span
							v-else
							:class="
								curTime - scope.row.saleStartTime < 7 * 24 * 60 * 60 * 1000
									? 'selectiongoods-red'
									: ''
							"
							>{{ scope.row.orderAmount.toFixed(2) }}</span
						>
					</div>
				</template>
				<template slot="returnRate" slot-scope="scope">
					<div>
						<span v-if="scope.row.groupName == '选品建议'"
							>平均售后率{{ scope.row.returnRate.toFixed(2) }}%</span
						>
						<span
							v-else
							:class="
								curTime - scope.row.saleStartTime < 7 * 24 * 60 * 60 * 1000
									? 'selectiongoods-red'
									: ''
							"
							>{{ scope.row.returnRate.toFixed(2) }}%</span
						>
					</div>
				</template>
			</yx-table>
			<Dialog
				:title="dialogTitle194"
				:visible.sync="dialogVisible194"
				:width="dialogWidth194"
			>
				<yx-form
					ref="dialog194"
					labelWidth="100px"
					:data="formData195"
					:items="formCfg195"
				>
				</yx-form>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { findBrandInfoByBrandName } from '@/api/yhtPlusWebGoods'
import { exportBrandInfoExcel, impostBrandKeyWord } from '@/api/webImport'
import { downloadFile } from '@/utils/helper/common'
import Dialog from '@/components/Dialog'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},
	props: [],
	data() {
		return {
			formData195: {
				excelText: '表格表头第一列为时间，第二列为品牌',
				findBrandInfoByBrandName: [],
			},
			impostBrandKeyWord: '/yhtplus/webImport/impostBrandKeyWord.action',
			formCfg195: [
				{
					type: 'text',
					title: 'Excel内容',
					dataIndex: 'excelText',
				},
				{
					type: 'upload',
					title: '上传Excel',
					dataIndex: 'findBrandInfoByBrandName',
					uploadAttributes: {
						autoUpload: false,
						imageName: 'findBrandInfoByBrandName',
						action: this.uploadImageList,
						fileList: [],
						onChange: (item, files) => {
							this.formCfg195[1].uploadAttributes.fileList = []
							this.formCfg195[1].uploadAttributes.fileList.push(files)
						},
						httpRequest: (file) => this.uploadImageHttpRequest(file),
					},
				},
			],
			dialogTitle194: '导入Excel',
			dialogWidth194: '500px',
			dialogVisible194: false,
			selectedList: [],
			moment,
			curTime: new Date().getTime(),
			loading: false,
			formData101: {
				brandString: '',
			},
			formCfg101: [
				{
					type: 'textarea',
					dataIndex: 'brandString',
					title: '品牌搜索',
					placeholder:
						'时间和品牌名称直接用空格隔开，品牌与品牌之间用英文逗号隔开（要带时间搜索）',
				},
			],
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					yapiId: '',
					token: '',
					dialogId: '',
					click: () => {
						if (!this.loading) this.getData102()
					},
					tableId: 102,
				},
			],
			tableData102: [],
			tableColumns102: [
				{
					type: 'string',
					dataIndex: 'keyword',
					title: '搜索内容',
				},
				{
					type: 'custom',
					dataIndex: 'groupName',
					title: '档期名称',
				},
				{
					type: 'custom',
					dataIndex: 'brandName',
					title: '会场名称',
				},
				{
					type: 'custom',
					dataIndex: 'saleStartTime',
					title: '售卖时间',
				},
				{
					type: 'custom',
					dataIndex: 'supplierName',
					title: '渠道',
				},
				{
					type: 'custom',
					dataIndex: 'orderAmount',
					title: '销售额',
				},
				{
					type: 'custom',
					dataIndex: 'returnRate',
					title: '售后率',
				},
			],
		}
	},

	methods: {
		importExcel() {
			this.dialogVisible194 = true
			this.formCfg195[1].uploadAttributes.fileList = []
		},
		async uploadImageHttpRequest(params) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ timeStamp: new Date().getTime(), groupId: 2 })
			)
			formData.append('formId', '#excelForm')
			formData.append('excel', params.file)
			const {
				data: { resultData, resultCode, resultMsg },
			} = await impostBrandKeyWord(formData)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible194 = false
				this.formData101.brandString = resultData.brandString
				this.getData102()
			}
		},
		exportExcel: async function () {
			let paramJson = this.formData101
			let { data } = await exportBrandInfoExcel(paramJson)
			downloadFile(data, 'excel.xlsx')
		},
		selectionChange(list) {
			this.selectedList = list
		},
		copyText() {
			if (!this.selectedList.length) {
				return this.$message.warning('请选择数据')
			}
			let copyText = ''
			this.selectedList.map((item) => {
				this.tableData102.map((list) => {
					if (list.keyword == item.keyword) {
						if (!copyText) {
							copyText += list.brandName
						} else {
							copyText += '\n' + list.brandName
						}
					}
				})
			})
			this.$copyText(copyText).then(
				() => {
					this.$message.success('复制成功')
				},
				() => {
					this.$message.error('复制失败')
				}
			)
		},
		// eslint-disable-next-line no-unused-vars
		spanMethod({ row, column, rowIndex, columnIndex }) {
			if (columnIndex === 1 || columnIndex === 0) {
				if (row.rowspan) {
					return {
						rowspan: row.rowspan,
						colspan: 1,
					}
				} else {
					return {
						rowspan: 0,
						colspan: 0,
					}
				}
			}
		},
		async getData102() {
			this.loading = true
			let paramJson = this.formData101
			const {
				data: { resultCode, resultData },
			} = await findBrandInfoByBrandName(paramJson)
			if (
				resultCode == 0 &&
				Object.prototype.toString.call(resultData.brandInfo) ===
					'[object Array]'
			) {
				let allArr = []
				resultData.brandInfo.map((items) => {
					let brandInfoAll = {
						groupName: '选品建议',
						brandName: '选品建议',
						sales: 0,
						goodsQuantity: 0,
						returnQuantity: 0,
					}
					items.map((item) => {
						item.returnRate = item.returnRate || 0
						brandInfoAll.sales += item.sales || 0
						brandInfoAll.goodsQuantity += item.goodsQuantity || 0
						brandInfoAll.returnQuantity += item.returnQuantity || 0
					})
					if (items.length > 0) {
						brandInfoAll.sales = brandInfoAll.sales / items.length
						if (
							brandInfoAll.goodsQuantity > 0 &&
							brandInfoAll.returnQuantity > 0
						) {
							brandInfoAll.returnRate = Math.round(
								(brandInfoAll.returnQuantity / brandInfoAll.goodsQuantity) * 100
							)
						} else {
							brandInfoAll.returnRate = 0
						}
						items.push(brandInfoAll)
						items[0].rowspan = items.length
						allArr.push(...items)
					}
				})
				this.tableData102 = allArr
			} else {
				this.tableData102 = []
			}
			this.loading = false
		},
	},
}
</script>
<style lang="scss" scope>
.selectiongoods-red {
	color: red;
}
.selection-goods-btnlist {
	margin-bottom: 20px;
}
</style>

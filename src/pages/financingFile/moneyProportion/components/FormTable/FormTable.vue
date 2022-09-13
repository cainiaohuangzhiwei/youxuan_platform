<template>
	<basic-container>
		<div>
			<!-- <el-button type="primary" class="el-icon-right" @click="oldSystem"
				>老系统</el-button
			> -->
			<yx-form
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			></yx-form>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="list"
				></yx-table>
			</el-row>
		</div>
		<Dialog
			title="编辑打款比例"
			:visible.sync="addSupplierVisible"
			:bottomBtn="dialogBottomBtn194"
			width="500px"
		>
			<div class="ad">原首款打款比例{{ selectItem.downPayment }}%</div>
			<div class="ac" style="">
				<span style="color: #ff6c60">*</span>
				<label class="ad" style="width: 50px">更改为:</label>
				<el-input
					style="width: 100px"
					v-model="downPayment"
					oninput='this.value=this.value.replace(/^[0]+[0-9]*$/gi,"")'
					type="number"
					placeholder="请输入款比例"
				></el-input
				>%
			</div>
		</Dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'

import {
	supplierAccountNumberDownPaymentList,
	updateSupplierDownPayment,
} from '@/api/yhtPlusCmsSupplierAccountNumber'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},
	name: 'FormTable',
	data() {
		return {
			showLoading: false,
			formInline: {
				keyword: '', // 商家名称
				supplierId: '', // 商家ID
				downPayment: '',
			},
			downPayment: '',
			addSupplierVisible: false, // 新增编辑弹框开关
			selectItem: {}, // 选中编辑项
			dialogVisibleAdd: false,
			dialogBottomBtn194: [
				{
					title: '取消',
					type: 'primary',
					click: () => {
						this.addSupplierVisible = false
					},
				},
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this._updateSupplierDownPayment(true)
					},
				},
			],
			formCfg: [
				{
					title: '商家ID',
					type: 'inputNumber',
					dataIndex: 'supplierId',
					placeholder: '请输入商家ID',
				},
				{
					title: '商家名称',
					type: 'input',
					dataIndex: 'keyword',
					placeholder: '请输入商家名称',
				},
				{
					title: '首款打款比例',
					type: 'input',
					dataIndex: 'downPayment',
					placeholder: '请输入首款打款比例',
				},
			],
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: this.onSubmit,
				},
			],
			// 列表数据
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'supplierId',
					title: '商家ID',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'string',
					dataIndex: 'downPayment',
					title: '首款打款比',
					customRender: (row) => {
						return row.downPayment + '%'
					},
				},
				{
					type: 'action',
					dataIndex: 'action',
					title: '操作',
					actions: [
						{
							title: '编辑',
							auth: 'editSupplierService',
							click: (row) => {
								this.downPayment = ''
								this.selectItem = row
								this.addSupplierVisible = true
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
					this.supplierServiceListTable(false)
				},
			},
			list: [],
		}
	},
	created: function () {
		this.supplierServiceListTable(true)
	},
	methods: {
		// 打开老系统
		oldSystem() {
			window.open(`/yhtplus/web/moneyProportion.html`)
		},
		_updateSupplierDownPayment: async function () {
			if (!this.downPayment) {
				return this.$message.error('请输入打款比例')
			}
			let {
				data: { resultCode },
			} = await updateSupplierDownPayment({
				downPayment: this.downPayment,
				supplierId: this.selectItem.supplierId,
			})
			if (resultCode == 0) {
				this.$message.success('成功')
				this.addSupplierVisible = false
				this.supplierServiceListTable(true)
			}
		},

		// 查询列表数据
		supplierServiceListTable: async function (flag) {
			if (
				this.formInline.supplierId &&
				!/^[0-9]*$/.test(this.formInline.supplierId)
			) {
				return this.$message.error('商家ID数据格式不对')
			}
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await supplierAccountNumberDownPaymentList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.list = resultData.supplierAccountNumberVoList
				this.page.count = resultData.count
			}
		},
		onSubmit() {
			this.supplierServiceListTable(true)
		},
		// 获取筛选的数据
		findSearchParams(flag) {
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = Object.assign(this.formInline, {
				startIndex: (this.page.currentPage - 1) * this.page.length,
				length: this.page.length,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
	},
}
</script>
<style>
.ad {
	text-align: center;
	font-weight: 900;
	margin-bottom: 20px;
}
.ac {
	display: flex;
	margin-left: 165px;
}
</style>

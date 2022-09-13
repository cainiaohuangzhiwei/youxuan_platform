<template>
	<basic-container>
		<div>
			<WgForm
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
				:actionInline="true"
			>
			</WgForm>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:select="true"
					:data="tableData"
					:selectionChange="selectionChange"
				>
					<template slot="transferringAccount" slot-scope="scope">
						<div>
							<p>{{ scope.row.transferOutAccountName }}</p>
							<p>{{ scope.row.transferOutAccountId }}</p>
						</div>
					</template>
				</yx-table>
			</el-row>
		</div>
		<Dialog
			title="审核"
			:visible="auditLoding"
			:bottomBtn="auditBottonBtn"
			width="30%"
			@before-close="auditLoding = false"
		>
			<yx-form
				ref="form"
				:inline="false"
				:items="auditItem"
				:data="auditData"
				labelWidth="85px"
			>
			</yx-form>
		</Dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import WgForm from '@/components/WgForm'
import { numberFormat } from '@/utils/helper/common'
import YxTable from '@wg-vue-materials/yx-table'
import { getCmsSupplierListByCondition } from '@/api/yhtPlusCmsSupplier'
import Dialog from '@/components/Dialog'
import YxForm from '@wg-vue-materials/yx-form'
import {
	merchantWithdrawa,
	examineApprove,
	checkApplyFile,
} from '@/api/accountService'
import { isNull } from '@/utils/helper/common'
import moment from 'moment'
// import { imgCosServerPath } from '@/utils/imageTool'
export default {
	components: {
		BasicContainer,
		YxTable,
		WgForm,
		YxForm,
		Dialog,
	},
	name: 'wthdrawalAccountApplication',

	data() {
		return {
			numberFormat: numberFormat,
			showLoading: false,
			selectionData: [],
			auditLoding: false,
			auditItem: [
				{
					title: '审核原因',
					type: 'textarea',
					dataIndex: 'applyRecordId',
				},
			],
			auditData: {
				applyRecordId: '',
			},
			auditBottonBtn: [
				{
					title: '审核通过',
					type: 'primary',
					click: () => {
						this.open(3)
					},
				},
				{
					title: '审核不通过',
					click: () => {
						this.open(2)
					},
				},
			],
			searchData: {
				applyStartTime: moment().startOf('day').valueOf(), // 开始时间
				applyEndTime: moment().endOf('day').valueOf(), // 结束时间
				applyStatus: '', // 状态
				supplierId: '',
			},
			searchCfg: [
				{
					type: 'generalSelect',
					title: '商家名称',
					multiple: false, //是否多选单选
					Url: getCmsSupplierListByCondition, //获取接口
					key: 'supplierId', //key值设置
					dataIndex: 'supplierId',
					showName: 'supplierName',
					inquire: 'supplierName', //入参字段
					placeholder: '请输入商家名称', //提示语
					dataList: 'supplierList', //获取数据下层
					colSpan: 6,
				},
				{
					type: 'select',
					title: '申请状态',
					dataIndex: 'applyStatus',
					label: 'value',
					options: [
						{
							applyStatus: '',
							value: '全部',
						},
						{
							applyStatus: 1,
							value: '待审核',
						},
						{
							applyStatus: 2,
							value: '审核失败',
						},
						{
							applyStatus: 3,
							value: '审核通过',
						},
					],
				},
				{
					title: '申请时间',
					type: 'datetimerange',
					dataIndex: ['applyStartTime', 'applyEndTime'],
				},
			],
			searchAction: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._fundAccountTransferList(true)
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},

				{
					type: 'string',
					dataIndex: 'reviewerName',
					title: '申请人',
				},
				{
					type: 'data',
					dataIndex: 'addTime',
					title: '申请时间',
				},
				{
					type: 'string',
					dataIndex: 'beforeChangeAccountName',
					title: '变更前提现账户名称',
				},
				{
					type: 'string',
					dataIndex: 'afterChangeAccountName',
					title: '变更后提现账户名称',
				},
				{
					type: 'action',
					title: '公司账户变更通知函',
					width: '120',
					actions: [
						{
							title: '下载',
							// auth: 'addOrganizationTagToOrganization',
							click: (row) => {
								this._checkApplyFile(row, 1)
							},
							customRender: (action, row) => {
								action.hide = !row.changeNotificationFlag
								return action
							},
						},
					],
				},
				{
					type: 'action',
					title: '委托收款函',
					width: '120',
					actions: [
						{
							title: '下载',
							// auth: 'addOrganizationTagToOrganization',
							click: (row) => {
								this._checkApplyFile(row, 2)
							},
							customRender: (action, row) => {
								action.hide = !row.entrustmentCollectionFlag
								return action
							},
						},
					],
				},
				{
					type: 'string',
					dataIndex: 'auditStatus',
					title: '状态',
					customRender: (row) => {
						// 打款类型:1.售后补款 2.店主营销费用打款 3.运保卡赔付
						return row.auditStatus == 1
							? '待审核'
							: row.auditStatus == 2
							? '审核失败'
							: row.auditStatus == 3
							? '审核通过'
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'operatorName',
					title: '操作人',
					customRender: (row) => {
						return (
							row.operatorName +
							(!isNull(row.reason) ? '(' + row.reason + ')' : '')
						)
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '审批',
							auth: 'suningAccountChangeApply',
							click: (row) => {
								this.auditLoding = true
								this.auditRow = row
							},
							customRender: (action, row) => {
								action.hide = row.auditStatus != 1
								return action
							},
						},
					],
				},
			],
			auditRow: {},
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._fundAccountTransferList()
				},
			},
		}
	},

	created() {
		this._fundAccountTransferList(true)
	},

	methods: {
		async open(type) {
			if (this.auditData.applyRecordId.length > 100) {
				return this.$message({
					type: 'info',
					message: '字数不可超过100',
				})
			}
			let {
				data: { resultCode },
			} = await examineApprove({
				applyRecordId: this.auditRow.applyRecordId,
				auditStatus: type,
				clerkId: this.$store.state.user.userInfo.clerkId,
				clerkName: this.$store.state.user.userInfo.clerkName,
				reason: this.auditData.applyRecordId,
			})
			if (resultCode == 0) {
				this.$message({
					type: 'success',
					message: '成功',
				})
				this.auditLoding = false
				this._fundAccountTransferList()
			}
		},
		downloadFile: function (downloadUrl, accessoryFileName) {
			let xhr = new XMLHttpRequest()
			xhr.open('get', downloadUrl, true)
			// 设置返回数据的类型为arraybuffer
			xhr.responseType = 'arraybuffer'
			xhr.setRequestHeader(
				'Content-Type',
				'application/x-www-form-urlencoded; charset=utf-8'
			)
			// xhr.setRequestHeader('X-AUTH-TOKEN', _this.token);
			xhr.setRequestHeader('Access-Control-Allow-Orig', '*')
			xhr.onload = function (res) {
				if (this.status == 200) {
					let response = this.response
					// 获取请求头Content-Type的值，用来判断是否是文件流下载
					let type = xhr.getResponseHeader('Content-Type')
					// text/plain;charset=utf-8：就是指“无类型”，一般的字节流用于数据传输，非文件下载
					if (type == 'text/plain;charset=utf-8') {
						// 将数据arraybuffer转成Json对象
						// let enc = new TextDecoder('utf-8')
						// var res = JSON.parse(enc.decode(new Uint8Array(response)))
						console.log(res)
						return
					}
					//将字符串 转换成 Blob 对象
					let blob = new Blob([response], {
						type: type,
					})
					// 创建新的URL表示指定的File对象或者Blob对象
					let URL = window.URL || window.webkitURL
					let objectUrl = URL.createObjectURL(blob)
					// 创建a标签用于跳转至下载链接
					let a = document.createElement('a')
					// href属性指定下载链接
					a.href = objectUrl
					// 设置文件名称
					a.download = accessoryFileName
					// click()事件触发下载
					a.click()
					// 去除a标签，以免影响其他操作
					a.remove()
					// 将URL释放
					URL.revokeObjectURL(objectUrl)
				}
			}
			xhr.send()
		},
		_checkApplyFile: async function (row, type) {
			let {
				data: { resultCode, resultData },
			} = await checkApplyFile({
				applyRecordId: row.applyRecordId,
				fileType: type,
			})
			if (resultCode == 0) {
				let downLoadServer
				if (location.host.indexOf('127.0.0.1') > -1) {
					downLoadServer = 'https://fors-ali-pressure.yunhuotong.net/yhtplus/'
				} else {
					downLoadServer = location.origin + '/yhtplus/'
				}
				this.downloadFile(
					downLoadServer + resultData.filePath,
					resultData.filePath
				)
			}
		},

		findSearchParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.searchData, {
				pageSize: 10,
				pageNum: 1,
			})
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.pageNum = this.page.currentPage
			return paramJson
		},
		_fundAccountTransferList: async function (flag) {
			let paramJson = this.findSearchParams(flag)
			this.showLoading = true
			let {
				data: { resultCode, resultData, total },
			} = await merchantWithdrawa(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData = resultData
				this.page.count = total
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.amount_box {
	margin: 20px 0;
	span {
		font-size: 26px;
		font-weight: bold;
	}
}
.wi100 {
	width: 100px;
}
</style>

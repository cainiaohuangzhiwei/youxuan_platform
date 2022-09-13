<template>
	<basic-container>
		<yx-form
			:inline="true"
			:data="formInline"
			:items="formCfg"
			:formAction="formAction"
		>
			<template #supplierName>
				<div>
					<el-input
						v-model="formInline.supplierName"
						placeholder="请选择商家"
						value-key="supplierName"
						label="supplierName"
						@focus="selectSupplier"
						clearable
						@clear="
							() => {
								formInline.supplierName = ''
								formInline.supplierId = ''
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="dialogVisible198 = true"
						></el-button>
					</el-input>
				</div>
			</template>
		</yx-form>
		<yx-table
			v-loading="loading102"
			:select="true"
			:selectionChange="selectionChange"
			:columns="table102"
			:pagination="page102"
			:data="tableData102"
		>
			<template slot="addTime" slot-scope="scope">
				<div>
					<p>{{ moment(scope.row.addTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
					<p>
						{{
							scope.row.importConfirmTime
								? moment(scope.row.importConfirmTime).format(
										'YYYY-MM-DD HH:mm:ss'
								  )
								: '-'
						}}
					</p>
				</div>
			</template>
			<template slot="orderSn" slot-scope="scope">
				<div>
					<router-link :to="`/business/orderDetails/${scope.row.orderId}`"
						><el-button type="text">{{
							scope.row.orderSn
						}}</el-button></router-link
					>
				</div>
			</template>
			<template slot="violationStatusHtml" slot-scope="scope">
				<div>
					<el-tag v-if="scope.row.violationStatus == 1" type="warning"
						>待处理</el-tag
					>
					<el-tag v-else-if="scope.row.violationStatus == 3" type="success"
						>已完成</el-tag
					>
					<el-tag v-else-if="scope.row.violationStatus == 4" type="info"
						>已关闭</el-tag
					>
					<el-tag v-else type="danger">申诉中</el-tag>
				</div>
			</template>
		</yx-table>
		<Dialog
			:title="dialogTitle198"
			:visible.sync="dialogVisible198"
			:width="dialogWidth198"
			:bottomBtn="dialogBottomBtn189"
		>
			<yx-form
				:inline="true"
				:data="formData101"
				:items="formCfg101"
				:formAction="formAction101"
			>
			</yx-form>
			<yx-table
				v-loading="loading101"
				:columns="table101"
				:pagination="page101"
				:data="tableData101"
			>
				<template slot="supplierAccountNumberId" slot-scope="scope">
					<el-radio
						v-model="formInline.supplierId"
						:label="scope.row.supplierId"
						@change="changeAnchor(scope.row)"
						>选择</el-radio
					>
				</template>
			</yx-table>
		</Dialog>
		<Dialog
			:title="'已创建导出任务，请稍后到下载列表下载数据'"
			:visible.sync="exportTaskDialog"
			:width="'30%'"
			:bottomBtn="exportTaskBtn"
		>
		</Dialog>
		<Dialog
			:title="'请确认是否对选中违规批量作废，作废后商家不可见，且操作不可逆。'"
			:visible.sync="batchInvalidDialog"
			:width="'30%'"
			:bottomBtn="batchInvalidBtn"
		>
		</Dialog>
		<Dialog
			:title="'批量关闭'"
			:visible.sync="batchClosedDialog"
			@before-close="resetForm"
			:width="'30%'"
			:bottomBtn="batchCloseBtn"
		>
			<div style="margin-bottom: 20px">
				请确认是否对选中违规批量关闭，关闭后将不再处罚商家。
			</div>
			<template>
				<el-input
					type="textarea"
					v-model.trim="batchCloseRemark"
					maxlength="50"
					:autosize="{ minRows: 2, maxRows: 4 }"
					placeholder="请输入备注（非必填）"
				></el-input>
			</template>
		</Dialog>
		<Dialog
			:title="'批量驳回'"
			@before-close="resetForm"
			:visible.sync="batchRejectDialog"
			:width="'30%'"
			:bottomBtn="batchRejectBtn"
		>
			<div style="margin-bottom: 20px">
				请确认是否对选中违规批量驳回，驳回后依旧需要商家确认。
			</div>
			<template>
				<el-input
					type="textarea"
					v-model.trim="batchRejectRemark"
					maxlength="50"
					:autosize="{ minRows: 2, maxRows: 4 }"
					placeholder="请输入备注（必填）"
				></el-input>
			</template>
		</Dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { downloadFile } from '@/utils/helper/common'
import { imgCosServerPath } from '@/utils/imageTool'
import Dialog from '@/components/Dialog'
import moment from 'moment'
import {
	violationInvalid,
	merchantViolationList,
	importConfirm,
	batchAudit, // 批量关闭
	batchInvalid, // 批量作废
	exportByCondition, //  导出
} from '@/api/supply'
import { getCmsSupplierListByCondition } from '@/api/webImport'
export default {
	name: 'violationRecordList',
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},
	data() {
		return {
			moment,
			loading102: false,
			exportTaskDialog: false,
			batchInvalidDialog: false,
			batchClosedDialog: false,
			batchRejectDialog: false,
			batchCloseRemark: '',
			batchRejectRemark: '',
			selectionData: [],
			batchRejectBtn: [
				{
					title: '驳回',
					auth: '',
					click: () => {
						this._batchAudit(1)
					},
				},
			],
			batchCloseBtn: [
				{
					title: '关闭',
					auth: '',
					click: () => {
						this._batchAudit(2)
					},
				},
			],
			exportTaskBtn: [
				{
					title: '进入下载中心',
					auth: '',
					click: () => {
						this.$router.push({
							path: `/supply/violationsDownloaded`,
						})
						this.exportTaskDialog = false
					},
				},
			],
			batchInvalidBtn: [
				{
					title: '取消',
					type: 'default',
					click: () => {
						this.batchInvalidDialog = false
					},
				},
				{
					title: '确定',
					auth: '',
					click: () => {
						this._batchInvalid()
					},
				},
			],
			table102: [
				{
					type: 'string',
					title: '违规记录单号',
					dataIndex: 'violationSn',
				},
				{
					type: 'custom',
					title: '生成时间/确认时间',
					dataIndex: 'addTime',
					width: '200',
					customRender: ({ addTime, importConfirmTime }) => {
						return `${moment(addTime).format('YYYY-MM-DD HH:mm:ss')}/${moment(
							importConfirmTime
						).format('YYYY-MM-DD HH:mm:ss')}/`
					},
				},
				{
					type: 'custom',
					title: '订单号',
					dataIndex: 'orderSn',
					width: '200',
				},
				{
					type: 'string',
					title: '商家名称',
					dataIndex: 'supplierName',
				},
				{
					type: 'newMap',
					dataIndex: 'violationType',
					title: '违规处罚事项',
					options: [
						['1', '超时发货'],
						['2', '超时揽收'],
						['3', '虚假发货'],
						['4', '包装违规'],
						['5', '空包'],
						['6', '错发'],
						['7', '漏发'],
						['8', '商品缺货'],
						['9', '物流停滞'],
						['10', '其他发货异常'],
						['11', '未按规则提交资质材料'],
						['12', '资质造假'],
						['13', '样品检验'],
						['14', '飞行检查'],
						['15', '商品违规审查'],
						['16', '知识产权侵权'],
						['17', '商品价格违规'],
						['18', '出售假冒/盗版商品'],
						['19', '物理/化学/安全等项目不合格'],
						['20', '商品质量抽检规则'],
						['21', '经营/售卖三无产品'],
						['22', '虚假宣传'],
						['23', '妨害消费者权益'],
						['24', '违背交易流程'],
						['25', '不当获取/使用信息'],
						['26', '违背承诺'],
						['27', '发票开具'],
						['28', '消极处理售后'],
						['29', '严重售后问题'],
						['30', '扰乱平台秩序/不配合平台管理'],
						['31', '骚扰他人'],
						['32', '虚假交易'],
						['33', '其他违规'],
					],
				},
				{
					type: 'amount',
					title: '违规处罚结果',
					dataIndex: 'fineAmount',
				},
				{
					type: 'string',
					dataIndex: 'applyType',
					title: '申诉类型',
					customRender: (row) => {
						let arr = ['-', '快递问题', '系统对接', 'WMS/ERP异常', '政策管控']
						return arr[row.applyType]
					},
				},
				{
					type: 'string',
					title: '申诉次数',
					dataIndex: 'appealCount',
				},
				{
					type: 'string',
					dataIndex: 'importConfirm',
					title: '确认状态',
					customRender: (row) => {
						return row.importConfirm ? '已确认' : '未确认'
					},
				},
				{
					type: 'string',
					title: '核实人',
					dataIndex: 'verifier',
				},
				{
					type: 'custom',
					dataIndex: 'violationStatusHtml',
					title: '处理状态',
				},
				// {
				// 	type: 'newMap',
				// 	dataIndex: 'violationStatus',
				// 	title: '处理状态',
				// 	options: [
				// 		['1', '待处理'],
				// 		['2', '申诉中'],
				// 		['3', '已完成'],
				// 		['4', '已关闭'],
				// 	],
				// },
				{
					type: 'string',
					dataIndex: 'valid',
					title: '是否作废',
					customRender: ({ valid }) => {
						return valid ? '否' : '是'
					},
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '作废',
							auth: 'violationInvalid',
							popconfirm: true,
							popconfirmTitle: '是否作废',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._violationInvalid(row)
							},
							customRender: (action, row) => {
								action.hide = row.violationStatus != 1 || !row.valid
								return action
							},
						},
						{
							title: '确认',
							// auth: 'handleGoodsGroupListRedis',
							popconfirm: true,
							popconfirmTitle: '是否确认',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._importConfirm(row)
							},
							customRender: (action, row) => {
								action.hide = row.importConfirm || !row.valid
								return action
							},
						},
						{
							title: '驳回',
							auth: 'violationDetail',
							click: (row) => {
								this.$router.push({
									path: `/supply/violationRecordDetails/${row.supplierId}/${row.violationSn}`,
								})
							},
							customRender: (action, row) => {
								action.hide = row.violationStatus != 2
								return action
							},
						},
						{
							title: '查看详情',
							auth: 'violationDetail',
							click: (row) => {
								this.$router.push({
									path: `/supply/violationRecordDetails/${row.supplierId}/${row.violationSn}`,
								})
							},
						},
					],
				},
			],
			page102: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData102()
				},
			},
			tableData102: [],
			loading101: false,
			table101: [
				{
					width: 200,
					type: 'custom',
					dataIndex: 'supplierAccountNumberId',
				},
				{
					dataIndex: 'supplierName',
					title: '商家',
				},
			],
			page101: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData101()
				},
			},
			tableData101: [],
			formData101: {
				supplierName: '',
			},
			formCfg101: [
				{
					type: 'input',
					title: '商家名称',
					dataIndex: 'supplierName',
				},
			],
			formAction101: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getData101(true)
					},
				},
			],
			dialogTitle198: '选择商家',
			dialogVisible198: false,
			dialogWidth198: '80%',
			dialogBottomBtn189: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.dialogVisible198 = false
					},
				},
			],
			formInline: {
				violationSn: '',
				orderSn: '',
				supplierName: '',
				verifier: '',
				supplierId: '',
				violationStatus: '',
				importConfirm: '',
				valid: true,
				violationType: '',
				importConfirmTimeStart: '',
				importConfirmTimeEnd: '',
				orderTimeStart: '',
				orderTimeEnd: '',
				// importConfirmTime: [],
				// addTime: [],
				addTimeStart: moment().startOf('day').valueOf(),
				addTimeEnd: moment().endOf('day').valueOf(),
			},
			formCfg: [
				{
					type: 'input',
					title: '违规记录单号',
					dataIndex: 'violationSn',
				},
				{
					type: 'input',
					title: '订单号',
					dataIndex: 'orderSn',
				},
				{
					title: '商家',
					type: 'custom',
					dataIndex: 'supplierName',
				},
				{
					type: 'input',
					title: '核实人',
					dataIndex: 'verifier',
				},
				{
					type: 'select',
					title: '处理状态',
					dataIndex: 'violationStatus',
					label: 'value',
					options: [
						{
							violationStatus: '',
							value: '全部',
						},
						{
							violationStatus: 1,
							value: '待处理',
						},
						{
							violationStatus: 2,
							value: '申诉中',
						},
						{
							violationStatus: 3,
							value: '已完成',
						},
						{
							violationStatus: 4,
							value: '已关闭',
						},
					],
				},
				{
					type: 'select',
					title: '确认状态',
					dataIndex: 'importConfirm',
					label: 'value',
					options: [
						{
							importConfirm: '',
							value: '全部',
						},
						{
							importConfirm: false,
							value: '待确认',
						},
						{
							importConfirm: true,
							value: '已确认',
						},
					],
				},
				{
					type: 'select',
					title: '是否作废',
					dataIndex: 'valid',
					label: 'value',
					options: [
						{
							valid: '',
							value: '全部',
						},
						{
							valid: false,
							value: '是',
						},
						{
							valid: true,
							value: '否',
						},
					],
				},
				{
					type: 'select',
					title: '违规处罚事项',
					dataIndex: 'violationType',
					label: 'value',
					options: [
						{ violationType: '', value: '全部' },
						{ violationType: 1, value: '超时发货' },
						{ violationType: 2, value: '超时揽收' },
						{ violationType: 3, value: '虚假发货' },
						{ violationType: 4, value: '包装违规' },
						{ violationType: 5, value: '空包' },
						{ violationType: 6, value: '错发' },
						{ violationType: 7, value: '漏发' },
						{ violationType: 8, value: '商品缺货' },
						{ violationType: 9, value: '物流停滞' },
						{ violationType: 10, value: '其他发货异常' },
						{ violationType: 11, value: '未按规则提交资质材料' },
						{ violationType: 12, value: '资质造假' },
						{ violationType: 13, value: '样品检验' },
						{ violationType: 14, value: '飞行检查' },
						{ violationType: 15, value: '商品违规审查' },
						{ violationType: 16, value: '知识产权侵权' },
						{ violationType: 17, value: '商品价格违规' },
						{ violationType: 18, value: '出售假冒/盗版商品' },
						{ violationType: 19, value: '物理/化学/安全等项目不合格' },
						{ violationType: 20, value: '商品质量抽检规则' },
						{ violationType: 21, value: '经营/售卖三无产品' },
						{ violationType: 22, value: '虚假宣传' },
						{ violationType: 23, value: '妨害消费者权益' },
						{ violationType: 24, value: '违背交易流程' },
						{ violationType: 25, value: '不当获取/使用信息' },
						{ violationType: 26, value: '违背承诺' },
						{ violationType: 27, value: '发票开具' },
						{ violationType: 28, value: '消极处理售后' },
						{ violationType: 29, value: '严重售后问题' },
						{ violationType: 30, value: '扰乱平台秩序/不配合平台管理' },
						{ violationType: 31, value: '骚扰他人' },
						{ violationType: 32, value: '虚假交易' },
						{ violationType: 33, value: '其他违规' },
					],
				},
				{
					type: 'datetimerange',
					dataIndex: ['importConfirmTimeStart', 'importConfirmTimeEnd'],
					title: '违规确认时间',
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
				{
					type: 'datetimerange',
					dataIndex: ['addTimeStart', 'addTimeEnd'],
					title: '违规时间',
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
				{
					type: 'datetimerange',
					dataIndex: ['orderTimeStart', 'orderTimeEnd'],
					title: '下单时间',
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
				// {
				// 	type: 'time',
				// 	title: '违规确认时间',
				// 	dataIndex: 'importConfirmTime',
				// 	timeAttributes: {
				// 		type: 'datetimerange',
				// 	},
				// },
				// {
				// 	type: 'time',
				// 	title: '违规时间',
				// 	dataIndex: 'addTime',
				// 	timeAttributes: {
				// 		type: 'datetimerange',
				// 	},
				// },
			],
			formAction: [
				{
					title: '批量关闭',
					type: 'primary',
					click: () => {
						let ids = []
						this.selectionData.map((item) => {
							if (item.violationStatus == 2) {
								ids.push({
									merchantViolationId: item.merchantViolationId,
								})
							}
						})
						if (ids.length == 0) {
							return this.$message.warning('请选择可操作的违规记录')
						}
						if (this.selectionData == 0) {
							return this.$message.warning('请选择需要操作的违规记录')
						} else {
							this.batchClosedDialog = true
						}
					},
					customRender: (action) => {
						action.hide = this.formInline.violationStatus != 2
						return action
					},
				},
				{
					title: '批量驳回',
					type: 'primary',
					click: () => {
						let ids = []
						this.selectionData.map((item) => {
							if (item.violationStatus == 2) {
								ids.push({
									merchantViolationId: item.merchantViolationId,
								})
							}
						})
						if (ids.length == 0) {
							return this.$message.warning('请选择可操作的违规记录')
						}
						if (this.selectionData == 0) {
							return this.$message.warning('请选择需要操作的违规记录')
						} else {
							this.batchRejectDialog = true
						}
					},
					customRender: (action) => {
						action.hide = this.formInline.violationStatus != 2
						return action
					},
				},
				{
					title: '导出',
					type: 'primary',
					click: () => {
						this.$confirm('确定导出违规记录列表？', '提示', {
							type: 'success',
							callback: async (action) => {
								if (action === 'confirm') {
									let paramJson = this.findSearchParams102()
									paramJson.listPath = '商家管理<商家违规记录列表'
									paramJson.fileName = 'abc'

									let paramJson_ = { ...paramJson }
									let {
										data: { resultCode, resultData },
									} = await exportByCondition(paramJson_)
									console.log('111111', resultData.exportDelay)

									if (resultCode == 0) {
										if (resultData.remoteFilePath) {
											resultData.remoteFilePath =
												resultData.remoteFilePath.replace(
													'/data/yhtplusFile/',
													''
												)
											window.open(imgCosServerPath + resultData.remoteFilePath)
										} else if (resultData.exportDelay) {
											this.exportTaskDialog = true
										}
									}
								}
							},
						})
					},
				},
				{
					title: '批量作废',
					type: 'primary',
					click: () => {
						let ids = []
						this.selectionData.map((item) => {
							if (item.violationStatus == 1 || !item.valid) {
								ids.push({
									merchantViolationId: item.merchantViolationId,
								})
							}
						})
						if (ids.length == 0) {
							return this.$message.warning('请选择可操作的违规记录')
						}
						if (this.selectionData == 0) {
							return this.$message.warning('请选择需要操作的违规记录')
						} else {
							this.batchInvalidDialog = true
						}
					},
					customRender: (action) => {
						action.hide = this.formInline.violationStatus != 1
						return action
					},
				},
				{
					title: '重置',
					// isClear: true,
					click: () => {
						this.formInline = {
							violationSn: '',
							orderSn: '',
							supplierName: '',
							verifier: '',
							supplierId: '',
							violationStatus: '',
							importConfirm: '',
							valid: '',
							violationType: '',
							importConfirmTimeStart: '',
							importConfirmTimeEnd: '',
							// importConfirmTime: [],
							// addTime: [],
							addTimeStart: moment().startOf('day').valueOf(),
							addTimeEnd: moment().endOf('day').valueOf(),
						}
						this.formData101 = {
							supplierName: '',
						}
						this.tableData101 = []
						this.page101.count = 0
					},
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (!this.loading) this.getData102(true)
					},
					tableId: 104,
				},
			],
		}
	},
	methods: {
		//批量关闭/驳回
		_batchAudit(v) {
			let ids = []
			this.selectionData.map((item) => {
				if (item.violationStatus == 2) {
					ids.push(item.violationSn)
				}
			})
			const paramJson = Object.assign(
				{},
				{
					violationSnList: ids,
				}
			)
			paramJson.audit = v == 1 ? 2 : 1
			paramJson.reason = v == 1 ? this.batchRejectRemark : this.batchCloseRemark
			if (v == 1 && !paramJson.reason) {
				return this.$message.warning('请填写原因')
			}
			paramJson.userName = this.$store.state.user.userInfo.clerkName
			this.$confirm(
				`确认要批量${v == 1 ? '驳回' : '关闭'}${ids.length}个违规记录吗？`,
				'提示',
				{
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							let {
								data: { resultMsg = '', resultCode },
							} = await batchAudit(paramJson)
							if (resultCode == 0) {
								this.$message.success(resultMsg)
								this.getData102(true)
								this.batchRejectDialog = false
								this.batchClosedDialog = false
							}
						}
					},
				}
			)
		},
		//导出
		exportCouponCompensationByCondition: async function () {
			let paramJson = Object.assign({}, this.formInline)
			paramJson.groupId = this.$store.state.user.userInfo.groupId
			let { data } = await exportByCondition(paramJson)
			console.log(data)
			downloadFile(data, '违规记录表.xlsx')
		},
		//批量作废
		_batchInvalid() {
			let ids = []
			this.selectionData.map((item) => {
				if (item.violationStatus == 1 || !item.valid) {
					ids.push(item.violationSn)
				}
			})
			if (ids.length == 0) {
				return this.$message.warning('请选择可操作的违规记录')
			}
			const paramJson = Object.assign(
				{},
				{
					violationSnList: ids,
				}
			)
			paramJson.userName = this.$store.state.user.userInfo.clerkName
			this.$confirm(`确认要批量作废${ids.length}个违规记录吗？`, '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						let {
							data: { resultMsg = '', resultCode },
						} = await batchInvalid(paramJson)
						if (resultCode == 0) {
							this.$message.success(resultMsg)
							this.getData102(true)
							this.batchInvalidDialog = false
						}
					}
				},
			})
		},
		//勾选
		selectionChange(row) {
			this.selectionData = row
		},
		resetForm() {
			this.batchClosedDialog = false
			this.batchCloseRemark = ''
			this.batchRejectDialog = false
			this.batchRejectRemark = ''
		},
		copyCode() {
			this.$message.success('复制成功')
		},
		//商家弹窗
		selectSupplier(e) {
			e.target.blur()
			this.dialogVisible198 = true
		},
		changeAnchor(row) {
			this.formInline.supplierName = row.supplierName
			this.formInline.supplierId = row.supplierId
			// this.rowData = Object.assign({}, row)
		},
		findSearchParams101(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page101.currentPage = 1
			}
			const paramJson = Object.assign(this.formData101, {
				length: this.page101.length,
				startIndex: (this.page101.currentPage - 1) * this.page101.length,
			})
			return paramJson
		},
		async getData101(flag) {
			this.loading101 = true
			let paramJson = this.findSearchParams101(flag)
			const {
				data: { resultCode, resultData },
			} = await getCmsSupplierListByCondition(paramJson)
			if (resultCode == 0) {
				this.tableData101 = resultData.supplierList
				this.page101.count = resultData.count
			} else {
				this.tableData101 = []
				this.page101.count = 0
			}
			this.loading101 = false
		},
		// 确认
		async _importConfirm({ violationSn }) {
			let {
				data: { resultCode, resultData },
			} = await importConfirm({
				violationSn,
				userName: this.$store.state.user.userInfo.clerkName,
			})
			if (resultCode == 0) {
				if (resultData) {
					this.getData102()
					this.$message.success('确认成功')
				} else {
					this.$message.error('确认失败')
				}
			}
		},
		// 作废
		async _violationInvalid({ violationSn }) {
			let {
				data: { resultCode },
			} = await violationInvalid({
				violationSn,
				userName: this.$store.state.user.userInfo.clerkName,
			})
			if (resultCode == 0) {
				this.getData102()
				this.$message.success('作废成功')
			}
		},
		getData102: async function (flag) {
			let paramJson = this.findSearchParams102(flag)
			console.log('paramJson>>>', paramJson)
			let timer =
				// !paramJson.importConfirmTimeStart ||
				// !paramJson.importConfirmTimeEnd ||
				!paramJson.addTimeStart || !paramJson.addTimeEnd
			if (!paramJson.violationSn && !paramJson.orderSn && timer) {
				return this.$message.warning(
					'请输入违规单号或者订单号，或者选择完整的违规时间范围'
				)
			}
			let time = 31 * 24 * 60 * 60 * 1000
			if (
				paramJson.importConfirmTimeStart &&
				paramJson.importConfirmTimeEnd &&
				time < paramJson.importConfirmTimeEnd - paramJson.importConfirmTimeStart
			) {
				this.$message.warning('违规确认时间区间不能大于31天！')
				return
			}
			if (
				paramJson.addTimeStart &&
				paramJson.addTimeEnd &&
				time < paramJson.addTimeEnd - paramJson.addTimeStart
			) {
				this.$message.warning('违规时间区间不能大于31天！')
				return
			}
			this.loading102 = true
			const {
				data: { resultCode, resultData },
			} = await merchantViolationList(paramJson)
			if (resultCode == 0) {
				this.tableData102 = resultData.recordList
				this.page102.count = resultData.count
			} else {
				this.tableData102 = []
				this.page102.count = 0
			}
			this.loading102 = false
		},
		findSearchParams102(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page102.currentPage = 1
			}
			let paramJson = Object.assign(
				{ ...this.formInline },
				{
					length: this.page102.length,
					startIndex: (this.page102.currentPage - 1) * this.page102.length,
				}
			)

			// paramJson.importConfirmTimeStart =
			// 	this.formInline.importConfirmTime &&
			// 	this.formInline.importConfirmTime[0]
			// 		? moment(this.formInline.importConfirmTime[0]).valueOf()
			// 		: ''
			// paramJson.merchantConfirmTimeEnd =
			// 	this.formInline.importConfirmTime &&
			// 	this.formInline.importConfirmTime[1]
			// 		? moment(this.formInline.importConfirmTime[1]).valueOf()
			// 		: ''
			// paramJson.addTimeStart =
			// 	this.formInline.addTime && this.formInline.addTime[0]
			// 		? moment(this.formInline.addTime[0]).valueOf()
			// 		: ''
			// paramJson.addTimeEnd =
			// 	this.formInline.addTime && this.formInline.addTime[1]
			// 		? moment(this.formInline.addTime[1]).valueOf()
			// 		: ''
			// delete paramJson.importConfirmTime
			// delete paramJson.addTime
			return paramJson
		},
	},
}
</script>

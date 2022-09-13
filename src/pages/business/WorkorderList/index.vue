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
						@focus="selectSupplier"
						clearable
						@clear="
							() => {
								formData105.supplierName = []
								formData105.supplierNumberIds = []
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
				v-loading="showLoading"
				:columns="tableColumns106"
				:pagination="page106"
				:data="tableData106"
			>
				<template slot="orderSn" slot-scope="scope">
					<router-link :to="`/business/orderDetails/${scope.row.orderId}`"
						><el-button type="text">{{
							scope.row.orderSn
						}}</el-button></router-link
					>
				</template>
				<template slot="afterSalesSn" slot-scope="scope">
					<router-link
						:to="`/business/afterSaleOrderDetails/${scope.row.afterSalesId}`"
						><el-button type="text">{{
							scope.row.afterSalesSn
						}}</el-button></router-link
					>
				</template>
			</yx-table>
			<!-- //完结工单 -->
			<Dialog
				title="完结工单"
				:visible="endRepaiOrderLoding"
				width="50%"
				:bottomBtn="endRepaiOrderBottomBtn"
				@before-close="endRepaiOrderLoding = false"
			>
				<yx-form
					style="margin-top: 60px"
					ref="form"
					:inline="false"
					:items="settingsItem"
					:data="settingsData"
					labelWidth="80px"
				>
				</yx-form>
			</Dialog>
			<!-- 商家列表 -->
			<multitermSupply-dialog
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
import Dialog from '@/components/Dialog'
import { uploadImageList } from '@/api/image'
import { getBigImg } from '@/utils/imageTool'
import MultitermSupplyDialog from '@/components/MultitermSupplyDialog'
import { ticketList, ticketExchange, ticketFinish } from '@/api/serviceTicket'
import { wgGetDate } from '@/utils/helper/common'
import moment from 'moment'
import { isNull } from '@/utils/helper/common'
export default {
	name: 'WorkorderList',
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
		MultitermSupplyDialog,
	},
	props: [],
	data() {
		return {
			showLoading: false,
			formsDialog: false,
			endRepaiOrderLoding: false,
			serviceTicketIdRow: null,
			supplyRow: [],
			selectGroupList: [],
			formData105: {
				supplierName: [],
				supplierNumberIds: [],
				ticketId: '', //工单id
				orderSn: '', //关联订单号
				afterSalesSn: '', //关联售后单号
				staffName: '', //接单人
				ticketCreateStartTime: wgGetDate().getMonthStartDate, //创建时间
				ticketCreateEndTime: wgGetDate().getMonthEndDate,
				ticketStatus: '2',
				ticketType: '', //工单类型
				ticketSyncState: '0', //同步状态
			},
			endRepaiOrderBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.endRepaiOrderAudit()
					},
				},
			],
			settingsData: {
				ticketFinishRemark: '',
				ticketFinishResult: '',
				afterSalesImageList: [],
			},
			settingsItem: [
				{
					type: 'select',
					title: '处理结果',
					dataIndex: 'ticketFinishResult',
					placeholder: '请选择处理结果',
					label: 'value',
					options: [
						{
							ticketFinishResult: '1',
							value: '处理成功',
						},
						{
							ticketFinishResult: '2',
							value: '处理失败',
						},
					],
				},
				{
					title: '回复',
					type: 'textarea',
					dataIndex: 'ticketFinishRemark',
				},
				{
					type: 'uploadImage',
					title: '图片',
					dataIndex: 'afterSalesImageList',
					uploadAttributes: {
						limit: 10,
						imageName: 'imageUrl',
						httpRequest: (file) => this._uploadImageHttpRequest(file),
					},
				},
			],
			formCfg105: [
				{
					type: 'input',
					title: '工单ID',
					dataIndex: 'ticketId',
					placeholder: '请输入工单ID',
					enter: () => {
						this._getTicketList(true)
					},
				},
				{
					type: 'input',
					title: '关联订单号',
					dataIndex: 'orderSn',
					placeholder: '请输入关联订单号',
					enter: () => {
						this._getTicketList(true)
					},
				},
				{
					type: 'input',
					title: '关联售后单号',
					dataIndex: 'afterSalesSn',
					placeholder: '请输入关联售后单号',
					enter: () => {
						this._getTicketList(true)
					},
				},
				{
					type: 'input',
					title: '接单人',
					dataIndex: 'staffName',
					placeholder: '请输入接单人',
					enter: () => {
						this._getTicketList(true)
					},
				},
				{
					title: '商家名称',
					type: 'custom',
					dataIndex: 'supplierName',
				},
				{
					title: '创建时间',
					type: 'datetimerange',
					dataIndex: ['ticketCreateStartTime', 'ticketCreateEndTime'],
					placeholder: ['开始时间', '结束时间'],
				},
				{
					type: 'select',
					title: '工单状态',
					dataIndex: 'ticketStatus',
					placeholder: '请选择工单状态',
					label: 'value',
					options: [
						{
							ticketStatus: '0',
							value: '全部',
						},
						{
							ticketStatus: '1',
							value: '待接单',
						},
						{
							ticketStatus: '3',
							value: '待商家回复',
						},
						{
							ticketStatus: '2',
							value: '待平台处理',
						},
						{
							ticketStatus: '4',
							value: '已完结',
						},
					],
				},
				{
					type: 'select',
					title: '工单类型',
					dataIndex: 'ticketType',
					placeholder: '请选择工单类型',
					label: 'value',
					options: [
						{
							ticketType: '0',
							value: '全部',
						},
						{
							ticketType: '1',
							value: '审核结果沟通',
						},
						{
							ticketType: '2',
							value: '验货结果沟通',
						},
						{
							ticketType: '3',
							value: '售后申诉',
						},
						{
							ticketType: '4',
							value: '二次申诉',
						},
					],
				},
				{
					type: 'select',
					title: '同步状态',
					dataIndex: 'ticketSyncState',
					placeholder: '请选择同步状态',
					label: 'value',
					options: [
						{
							ticketSyncState: '0',
							value: '全部',
						},
						{
							ticketSyncState: '1',
							value: '未同步',
						},
						{
							ticketSyncState: '2',
							value: '已同步',
						},
					],
				},
			],
			formAction105: [
				{
					title: '重置',
					supplierNumberIds: '',
					click: () => {
						this.resetForm()
					},
				},
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: (e) => {
						this._getTicketList(true, e)
					},
				},
			],
			tableData106: [],
			tableColumns106: [
				{
					type: 'string',
					dataIndex: 'ticketId',
					title: '工单ID',
				},
				{
					type: 'string',
					dataIndex: 'staffName',
					title: '接单人姓名',
				},
				{
					type: 'custom',
					dataIndex: 'orderSn',
					title: '关联订单号',
				},
				{
					type: 'custom',
					dataIndex: 'afterSalesSn',
					title: '关联售后单号',
				},

				{
					type: 'string',
					dataIndex: 'ticketType',
					title: '工单类型',
					customRender: (row) => {
						if (row.ticketType == 1) {
							return '审核结果沟通'
						} else if (row.ticketType == 2) {
							return '验货结果沟通'
						} else if (row.ticketType == 3) {
							return '售后申诉'
						} else if (row.ticketType == 4) {
							return '二次申诉'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'ticketTitle',
					title: '工单标题',
				},
				{
					type: 'string',
					dataIndex: 'ticketTitle',
					title: '工单内容',
					customRender: (row) => {
						return row.ticketContent.length > 25
							? row.ticketContent.substring(0, 25) + '...'
							: row.ticketContent
					},
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
				},
				{
					type: 'string',
					dataIndex: 'ticketCreateTime',
					title: '创建时间',
					customRender: (row) => {
						return row.ticketCreateTime && row.ticketCreateTime
							? moment(row.ticketCreateTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'ticketStatus',
					title: '工单状态',
					customRender: (row) => {
						if (row.ticketStatus == 1) {
							return '待接单'
						} else if (row.ticketStatus == 2) {
							return '待平台处理'
						} else if (row.ticketStatus == 3) {
							return '待商家回复'
						} else if (row.ticketStatus == 4) {
							return '已完结'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'ticketSyncState',
					title: '同步状态',
					customRender: (row) => {
						if (row.ticketSyncState == 1) {
							return '未同步'
						} else if (row.ticketSyncState == 2) {
							return '已同步'
						}
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '查看详情',
							click: (row) => {
								this.$router.push({
									path: `/business/workorderDetails/${row.serviceTicketId}`,
								})
							},
						},
						{
							title: '流转至商家',
							popconfirm: true,
							popconfirmTitle:
								'是否确认流转至商家？流转成功后，状态变为"待商家回复"',
							confirm: (row) => {
								this.ticketExchange(row)
							},
							customRender: (action, row) => {
								action.hide = row.ticketStatus != 2
								return action
							},
						},
						{
							title: '完结',
							click: (row) => {
								this.endRepairOrder(row)
							},
							customRender: (action, row) => {
								action.hide = row.ticketStatus != 2 && row.ticketStatus != 3
								return action
							},
						},
					],
				},
			],
			page106: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getTicketList()
				},
			},
		}
	},

	created() {
		this._getTicketList()
	},

	methods: {
		// 重置
		resetForm() {
			this.supplyRow = []
			this.selectGroupList = []
			this.formData105 = {
				supplierName: [],
				supplierNumberIds: [],
				ticketId: '', //工单id
				orderSn: '', //关联订单号
				afterSalesSn: '', //关联售后单号
				staffName: '', //接单人
				ticketCreateStartTime: wgGetDate().getMonthStartDate, //创建时间
				ticketCreateEndTime: wgGetDate().getMonthEndDate,
				ticketStatus: '2',
				ticketType: '', //工单类型
				ticketSyncState: '0', //同步状态
			}
		},
		handleAdd() {
			this.supplyRow = JSON.parse(JSON.stringify(this.selectGroupList))
			this.formsDialog = true
		},
		//处理商家多选查询
		fatherMethodInit(row = {}) {
			this.selectGroupList = JSON.parse(JSON.stringify(row))
			for (let i = 0; i < row.length; i++) {
				this.formData105.supplierName.push(row[i].supplierName) //插入数组
				this.formData105.supplierName = [
					//数组防重
					...new Set(this.formData105.supplierName),
				]
				this.formData105.supplierNumberIds.push(row[i].supplierAccountNumberId)
				this.formData105.supplierNumberIds = [
					//数组防重
					...new Set(this.formData105.supplierNumberIds),
				]
			}
			console.log('+++++++', this.formData105.supplierName)
		},
		endRepairOrder(row) {
			this.settingsData.ticketFinishResult = ''
			this.settingsData.ticketFinishRemark = ''
			this.serviceTicketId = null
			this.settingsData.afterSalesImageList = []
			this.serviceTicketIdRow = row.serviceTicketId
			this.endRepaiOrderLoding = true
		},
		endRepaiOrderAudit: async function () {
			let afterSalesImageListPush = []
			this.settingsData.afterSalesImageList.map((item) => {
				afterSalesImageListPush.push(item.imageUrlTemp)
			})
			let paramJson = {
				ticketFinishResult: this.settingsData.ticketFinishResult,
				ticketFinishRemark: this.settingsData.ticketFinishRemark,
				serviceTicketId: this.serviceTicketIdRow,
				afterSalesImageList: afterSalesImageListPush,
			}
			if (isNull(paramJson.ticketFinishResult)) {
				this.$message.warning({ message: '请选择处理结果' })
				return
			}
			if (isNull(paramJson.ticketFinishRemark)) {
				this.$message.warning({ message: '请填写回复内容' })
				return
			}
			if (paramJson.afterSalesImageList.length == 0) {
				this.$message.warning({ message: '请选上传图片' })
				return
			}
			let {
				data: { resultCode },
			} = await ticketFinish(paramJson)
			if (resultCode == 0) {
				this.$message({
					message: `完结成功!`,
					type: 'success',
				})
				this.endRepaiOrderLoding = false
				this._getTicketList()
			}
		},
		// 上传图标图片
		_uploadImageHttpRequest: async function (params) {
			let settingsData = new FormData()
			settingsData.append(
				'data',
				JSON.stringify({ formId: '#addMaterial', imageType: 82 })
			)
			settingsData.append('file', params.file)
			const res = await uploadImageList(settingsData)
			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				this.settingsData.afterSalesImageList.push({
					imageUrl: getBigImg(res.data.resultData.imageList[0].imageUrl),
					imageUrlTemp: res.data.resultData.imageList[0].imageUrl,
				})
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
		//流转商家
		async ticketExchange(row) {
			const {
				data: { resultCode },
			} = await ticketExchange({
				serviceTicketId: row.serviceTicketId,
				exchangeType: 2, ////1流转平台,2流转商家
			})
			if (resultCode == 0) {
				this.$message({
					message: `流转成功!`,
					type: 'success',
				})
				this._getTicketList()
			}
		},
		//商家弹窗
		selectSupplier(e) {
			e.target.blur()
			this.formsDialog = true
		},
		findSearchParams106(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page106.currentPage = 1
			}
			const paramJson = Object.assign(this.formData105, {
				length: this.page106.length,
				startIndex: (this.page106.currentPage - 1) * this.page106.length,
			})
			paramJson.ticketCreateStartTime =
				moment(paramJson.ticketCreateStartTime).valueOf() || ''
			paramJson.ticketCreateEndTime =
				moment(paramJson.ticketCreateEndTime).valueOf() || ''

			return paramJson
		},
		_getTicketList: async function (flag, e) {
			let paramJson = this.findSearchParams106(flag)
			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await ticketList(paramJson, custom)
			this.showLoading = false
			if (resultCode == 0) {
				this.tableData106 = resultData.serviceTicketList
				this.page106.count = resultData.count
			} else {
				this.page106.count = 0
				this.tableData106 = []
			}
		},
	},
}
</script>

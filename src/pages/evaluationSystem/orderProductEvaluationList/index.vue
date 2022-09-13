<template>
	<basicContainer>
		<yx-form
			:inline="true"
			:data="formData187"
			:items="formCfg187"
			:formAction="formAction187"
		>
			<template #supplierName>
				<el-input
					v-model="formData187.supplierName"
					placeholder="请选择商家"
					value-key="supplierName"
					label="supplierName"
					@focus="selectSupplier"
					clearable
					@clear="clearSupplier"
				>
					<el-button
						slot="append"
						icon="el-icon-more"
						@click="supplyDialogVisible = true"
					></el-button>
				</el-input>
			</template>
			<template #score>
				<el-select
					v-model="formData187.scoreList"
					multiple
					placeholder="请选择"
				>
					<el-option
						v-for="item in scoreList"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					>
					</el-option>
				</el-select>
			</template>
		</yx-form>
		<yx-table
			v-loading="loading"
			:columns="tableColumns188"
			:pagination="page188"
			:data="tableData188"
		>
			<template slot="orderSn" slot-scope="scope">
				<div>
					<router-link :to="`/business/orderDetails/${scope.row.orderId}`"
						><el-button type="text">{{
							scope.row.orderSn
						}}</el-button></router-link
					>
				</div>
			</template>
			<template slot="ratingPicture" slot-scope="scope">
				<div>
					<el-button
						@click="previewImage(scope.row.imageUrlList)"
						v-if="scope.row.imageUrlList && scope.row.imageUrlList.length"
						type="text"
						>查看评价图片</el-button
					>
					<p v-else>- -</p>
				</div>
			</template>
			<template slot="replyState" slot-scope="scope">
				<div>
					<p>{{ scope.row.replyState ? '已回复' : '未回复' }}</p>
					<el-button
						v-auth="'orderGoodsEvaluationDetail'"
						type="text"
						@click="_orderGoodsEvaluationDetail(1, scope.row)"
						v-if="scope.row.replyState"
						>查看回复内容</el-button
					>
				</div>
			</template>
		</yx-table>
		<supplier-dialog
			ref="supplierDialog"
			:visible.sync="supplyDialogVisible"
			@fatherMethodInit="fatherMethodInit"
			:supplierAccountNumberList="supplierAccountNumberList"
			chooseType="checkbox"
			:showAppraiseSelect="true"
		/>
		<el-image
			ref="myImg"
			style="visibility: hidden"
			:src="url"
			:preview-src-list="srcList"
		>
		</el-image>
		<Dialog
			v-loading="dialogLoading119"
			:title="dialogTitle119"
			:visible.sync="dialogVisible119"
			width="800px"
			:bottomBtn="dialogTitle119 == '查看回复内容' ? [] : dialogBottomBtn119"
		>
			<div>
				<h3>商品信息：</h3>
				<p class="info-p">
					<span>订单编号：{{ replyDetail.orderSn }}</span>
					<span>货号：{{ replyDetail.goodsNumber }}</span>
					<span>商品ID：{{ replyDetail.goodsId }}</span>
					<span>商品规格ID：{{ replyDetail.goodsSpecId }}</span>
				</p>
				<h3>用户商品详情描述：</h3>
				<p>{{ replyDetail.orderGoodEvaluationContent }}</p>
				<h3>评论回复：</h3>
				<p v-if="dialogTitle119 == '查看回复内容'">
					{{ replyDetail.replyContent }}
				</p>
				<el-input
					v-else
					type="textarea"
					placeholder="请输入内容"
					v-model="replyDetail.replyContent"
					maxlength="500"
					:autosize="{ minRows: 6, maxRows: 9 }"
					show-word-limit
				>
				</el-input>
			</div>
		</Dialog>
	</basicContainer>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import moment from 'moment'
import SupplierDialog from '@/components/SupplyDialog'
import { downloadFile } from '@/utils/helper/common'
import { getBigImg } from '@/utils/imageTool'
import {
	pageOrderGoodsEvaluationList,
	exportOrderGoodsEvaluationList,
	orderGoodsEvaluationBlock,
	orderGoodsEvaluationReply,
	orderGoodsEvaluationDetail,
} from '@/api/evaluation'
export default {
	name: 'OrderProductEvaluationList',
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
		SupplierDialog,
	},
	data() {
		return {
			replyDetail: {},
			dialogLoading119: false,
			dialogTitle119: '回复评价',
			dialogVisible119: false,
			dialogBottomBtn119: [
				{
					title: '取消',
					type: 'default',
					click: () => {
						this.dialogVisible119 = false
					},
				},
				{
					title: '确认',
					type: 'primary',
					click: () => {
						this._orderGoodsEvaluationReply()
					},
				},
			],
			url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
			srcList: [
				'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
				'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg',
			],
			scoreList: [
				{
					label: '1分',
					value: 1,
				},
				{
					label: '2分',
					value: 2,
				},
				{
					label: '3分',
					value: 3,
				},
				{
					label: '4分',
					value: 4,
				},
				{
					label: '5分',
					value: 5,
				},
			],
			previewImageVisible: false,
			supplyDialogVisible: false,
			tableColumns188: [
				{
					type: 'custom',
					width: 200,
					dataIndex: 'orderSn',
					title: '订单编号',
				},
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家名称',
				},
				{
					type: 'string',
					dataIndex: 'goodsNumber',
					title: '货号',
				},
				{
					type: 'string',
					dataIndex: 'goodsId',
					title: '商品ID',
				},
				{
					type: 'string',
					dataIndex: 'goodsSpecId',
					title: '商品规格ID',
				},
				{
					type: 'string',
					dataIndex: 'quantity',
					title: '数量',
				},
				{
					type: 'string',
					dataIndex: 'score',
					title: '商品描述得分',
				},
				{
					type: 'string',
					dataIndex: 'content',
					title: '商品详细描述',
					width: 300,
				},
				{
					type: 'newMap',
					dataIndex: 'type',
					title: '评价类型',
					options: [
						['1', '人工评价'],
						['0', '默认好评'],
						['2', '含文字或图片评价'],
					],
				},
				{
					type: 'custom',
					dataIndex: 'ratingPicture',
					title: '评价图片',
				},
				{
					type: 'custom',
					dataIndex: 'replyState',
					title: '回复状态',
				},
				{
					type: 'newMap',
					dataIndex: 'blockState',
					title: '数据状态',
					options: [
						['1', '屏蔽'],
						['0', '展示'],
					],
				},
				{
					type: 'date',
					dataIndex: 'orderTime',
					title: '下单时间',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '评价提交时间',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '屏蔽评价',
							auth: 'orderGoodsEvaluationBlock',
							popconfirm: true,
							popconfirmTitle: '屏蔽后，该条用户评价内容及回复内容均不显示',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._orderGoodsEvaluationBlock(row)
							},
							customRender: (action, row) => {
								action.hide = row.type == 0
								action.title = row.blockState == 1 ? '展示评价' : '屏蔽评价'
								action.popconfirmTitle =
									row.blockState == 1
										? '确定后，该条用户评价内容将进行展示'
										: '屏蔽后，该条用户评价内容及回复内容均不显示'
								return action
							},
						},
						{
							title: '回复评价',
							auth: 'orderGoodsEvaluationReply',
							click: (row) => {
								let type = row.replyState == 1 ? 3 : 2
								this._orderGoodsEvaluationDetail(type, row)
							},
							customRender: (action, row) => {
								action.hide = row.type == 0
								action.title = row.replyState == 1 ? '编辑回复' : '回复评价'
								return action
							},
						},
					],
				},
			],
			page188: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			tableData188: [],
			loading: false,
			formData187: {
				orderSn: '',
				goodsId: '',
				goodsSpecId: '',
				type: null,
				startOrderTime: '',
				endOrderTime: '',
				startAddTime: moment().startOf('day').valueOf(),
				endAddTime: moment().endOf('day').valueOf(),
				supplierName: '',
				supplierNumberIds: [],
				blockState: null,
				replyState: null,
				scoreList: [],
			},
			formCfg187: [
				{
					type: 'input',
					dataIndex: 'orderSn',
					title: '订单编号',
				},
				{
					type: 'custom',
					title: '商家',
					dataIndex: 'supplierName',
				},
				{
					type: 'input',
					dataIndex: 'goodsId',
					title: '商品ID',
				},
				{
					type: 'input',
					dataIndex: 'goodsSpecId',
					title: '商品规格ID',
				},
				{
					type: 'select',
					dataIndex: 'type',
					title: '评价类型',
					label: 'value',
					options: [
						{
							type: null,
							value: '全部',
						},
						{
							type: 1,
							value: '人工评价',
						},
						{
							type: 0,
							value: '默认好评',
						},
						{
							type: 2,
							value: '含文字或图片评价',
						},
					],
				},
				{
					type: 'select',
					dataIndex: 'blockState',
					title: '数据状态',
					label: 'value',
					options: [
						{
							blockState: null,
							value: '全部',
						},
						{
							blockState: 0,
							value: '展示',
						},
						{
							blockState: 1,
							value: '屏蔽',
						},
					],
				},
				{
					type: 'select',
					dataIndex: 'replyState',
					title: '回复状态',
					label: 'value',
					options: [
						{
							replyState: null,
							value: '全部',
						},
						{
							replyState: 0,
							value: '未回复',
						},
						{
							replyState: 1,
							value: '已回复',
						},
					],
				},
				{
					type: 'custom',
					dataIndex: 'score',
					title: '商品描述得分',
				},
				{
					type: 'datetimerange',
					dataIndex: ['startOrderTime', 'endOrderTime'],
					title: '下单时间',
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
				{
					type: 'datetimerange',
					dataIndex: ['startAddTime', 'endAddTime'],
					title: '提交时间',
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
			],
			exportLoading: false,
			formAction187: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init(true)
					},
				},
				{
					title: '导出',
					type: 'success',
					auth: 'exportOrderGoodsEvaluationList',
					click: async () => {
						if (this.exportLoading) return
						this.exportLoading = true
						let paramJson = this.findSearchParams()
						let { data } = await exportOrderGoodsEvaluationList(paramJson)
						downloadFile(data, '订单商品评价列表.xlsx')
						this.exportLoading = false
					},
				},
			],
			supplierAccountNumberList: [],
		}
	},
	methods: {
		// 回复评价
		async _orderGoodsEvaluationReply() {
			if (!this.replyDetail.replyContent) {
				return this.$message.warning('请输入评价内容')
			}
			this.dialogLoading119 = true
			let {
				data: { resultCode },
			} = await orderGoodsEvaluationReply({
				orderGoodsEvaluationId: this.replyDetail.id,
				replyContent: this.replyDetail.replyContent,
				replyId: this.replyDetail.replyId,
			})
			this.dialogLoading119 = false
			if (resultCode == 0) {
				this.$message.success(
					this.dialogTitle119 == '回复评价' ? '回复成功' : '修改成功'
				)
				this.dialogVisible119 = false
				this.init()
			}
		},
		//  查看评价详情
		async _orderGoodsEvaluationDetail(type, row) {
			let {
				data: { resultCode, resultData },
			} = await orderGoodsEvaluationDetail({ orderGoodsEvaluationId: row.id })
			if (resultCode == 0) {
				if (type == 1) {
					this.dialogTitle119 = '查看回复内容'
				} else if (type == 2) {
					this.dialogTitle119 = '回复评价'
				} else {
					this.dialogTitle119 = '编辑回复评价'
				}
				// 处理评价详情
				this.replyDetail = {
					...row,
					...resultData,
					replyId:
						resultData?.replyDetailList?.[resultData.replyDetailList.length - 1]
							?.id || '',
					replyContent:
						resultData?.replyDetailList?.[resultData.replyDetailList.length - 1]
							?.replyContent || '',
				}
				this.dialogVisible119 = true
			}
		},
		// 屏蔽回复
		async _orderGoodsEvaluationBlock(row) {
			let {
				data: { resultCode },
			} = await orderGoodsEvaluationBlock({
				orderGoodsEvaluationId: row.id,
				blockState: row.blockState == 1 ? 0 : 1,
			})
			if (resultCode == 0) {
				this.$message.success('修改成功')
				this.init()
			}
		},
		previewImage(list) {
			let srcList = list.map((item) => {
				return getBigImg(item)
			})
			this.url = srcList[0]
			this.srcList = srcList
			this.previewImageVisible = true
			this.$refs.myImg.showViewer = true
		},
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page188.currentPage = 1
			}
			const paramJson = Object.assign(this.formData187, {
				length: this.page188.length,
				currentPage: this.page188.currentPage,
			})
			return paramJson
		},
		async init(flag) {
			this.loading = true
			let paramJson = this.findSearchParams(flag)
			const {
				data: { resultCode, resultData },
			} = await pageOrderGoodsEvaluationList(paramJson)
			if (resultCode === 0) {
				this.tableData188 = resultData.records
				this.page188.count = resultData.total
			}
			this.loading = false
		},
		clearSupplier() {
			this.formData187.supplierName = ''
			this.formData187.supplierIdList = []
			this.supplierAccountNumberList = []
		},
		fatherMethodInit(row) {
			// 多个商家筛选
			const supplierNameList = []
			this.formData187.supplierIdList = row.map((i) => {
				supplierNameList.push(i.supplierName)
				return i.supplierId
			})
			// 选择器回显
			this.formData187.supplierName = supplierNameList.join('、')
			this.supplierAccountNumberList = row
		},
		selectSupplier(e) {
			e.target.blur()
			this.supplyDialogVisible = true
		},
	},
}
</script>
<style lang="scss" scoped>
.info-p span {
	margin-right: 24px;
}
</style>

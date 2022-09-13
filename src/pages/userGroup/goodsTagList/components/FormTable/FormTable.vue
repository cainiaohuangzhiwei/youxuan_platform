<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			></yx-form>
			<div class="goods-group-btn-box">
				<el-button @click="handleAdd" type="primary" v-auth="'addGoodsTag'"
					>新增标签</el-button
				>
			</div>
			<el-row v-loading="loading">
				<yx-table
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
					class="goodsTagTable"
				></yx-table>
			</el-row>
			<GoodsTagDialog
				ref="goods_tag_dialog"
				:visible.sync="buriedDialog"
				:buriedRow="buriedRow"
				:actionType="actionType"
				@refreshList="getData"
			></GoodsTagDialog>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import GoodsTagDialog from './GoodsTagDialog'

import { goodsTagList, switchGoodsTagStatus } from '@/api/yhtPlusWebGoods'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		GoodsTagDialog,
	},
	name: 'FormTable',

	data() {
		return {
			buriedRow: {},
			buriedDialog: false,
			actionType: 'create',
			stateMap: ['禁用', '启用'],
			loading: false,
			formInline: {
				goodsTagId: '',
				title: '',
				state: '',
				startTimestamp: moment().startOf('month').hours(0),
				endTimestamp: moment().endOf('month'),
			},
			formCfg: [
				{
					title: '商品标签ID:',
					dataIndex: 'goodsTagId',
					placeholder: '请输入内容',
				},
				{
					title: '标签名称:',
					dataIndex: 'title',
					placeholder: '请输入内容',
				},
				{
					title: '状态',
					type: 'select',
					dataIndex: 'state',
					label: 'value',
					options: [
						{
							state: '',
							value: '全部',
						},
						{
							state: 1,
							value: '启用',
						},
						{
							state: 0,
							value: '禁用',
						},
					],
				},
				{
					title: '添加时间',
					type: 'datetimerange',
					dataIndex: ['startTimestamp', 'endTimestamp'],
				},
			],
			formAction: [
				{
					title: '重置',
					// auth: 'bindDepartmentId',
					click: () => {
						this.reset()
					},
				},
				{
					title: '搜索',
					type: 'primary',
					// auth: 'bindDepartmentId',
					click: () => {
						this.page.currentPage = 1
						this.getData()
					},
				},
			],
			tableData: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'goodsTagId',
					title: '商品标签ID',
				},
				{
					type: 'string',
					dataIndex: 'title',
					title: '标签名称',
				},
				{
					type: 'string',
					dataIndex: 'goodsNumber',
					title: '商品数量',
				},
				{
					type: 'string',
					dataIndex: 'weight',
					title: '标签权重值',
				},
				{
					type: 'string',
					dataIndex: 'state',
					title: '状态',
					customRender: (row) => {
						return this.stateMap[row.state]
					},
				},
				{
					type: 'string',
					dataIndex: 'addTimestamp',
					title: '创建时间',
					width: 200,
					customRender: (row) => {
						return row.addTimestamp
							? moment(row.addTimestamp).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '启用',
							auth: 'setGoodsTagState',
							popconfirm: true,
							popconfirmTitle: '是否启用该标签',
							confirm: (row) => {
								this.handleSwitchStatus(row, 1)
							},
							customRender: (action, row) => {
								action.hide = row.state === 1
								return action
							},
						},
						{
							title: '禁用',
							auth: 'setGoodsTagState',
							popconfirm: true,
							popconfirmTitle: '是否禁用该标签',
							confirm: (row) => {
								this.handleSwitchStatus(row, 0)
							},
							customRender: (action, row) => {
								action.hide = row.state === 0
								return action
							},
						},
						{
							title: '编辑',
							auth: 'addGoodsTag',
							click: (row) => {
								this.actionType = 'edit'
								this.getDetail(row)
							},
						},
						{
							title: '关联商品',
							auth: 'relationGoodsForGoodsTag',
							click: (row) => {
								this.actionType = 'import'
								this.getDetail(row)
							},
						},
						{
							title: '查看商品',
							auth: 'checkupGoodsFromGoodsTag',
							click: (row) => {
								this.checkupGoodses(row)
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
					this.getData()
				},
			},
		}
	},

	created() {
		this.getData()
	},
	methods: {
		getParams() {
			const {
				goodsTagId = '',
				title = '',
				state,
				startTimestamp = '',
				endTimestamp = '',
			} = this.formInline
			const data = {
				pageNum: this.page.currentPage,
				pageSize: this.page.length,
				state,
			}
			if (goodsTagId) {
				data.goodsTagId = goodsTagId
			}
			if (title) {
				data.title = title
			}
			if (startTimestamp) {
				data.startTimestamp = moment(startTimestamp).valueOf()
			}
			if (endTimestamp) {
				data.endTimestamp = moment(endTimestamp).valueOf()
			}
			return data
		},
		async getData() {
			this.loading = true
			const res = await goodsTagList(this.getParams()).finally(() => {
				this.loading = false
			})
			if (res && res.data && res.data.resultCode === 0) {
				const { resultData, total } = res.data || {}
				this.tableData = resultData || []
				if (this.page.currentPage === 1) {
					this.page.count = total || 0
				}
			}
		},

		reset() {
			this.formInline = this.$options.data().formInline
			this.page.currentPage = 1
			this.$nextTick(() => {
				this.getData()
			})
		},
		handleAdd() {
			this.actionType = 'create'
			this.buriedDialog = true
		},
		//启用
		async handleSwitchStatus(row, state = 0) {
			this.loading = true
			const {
				data: { resultCode },
			} = await switchGoodsTagStatus({
				goodsTagId: row.goodsTagId,
				state: state, //状态 0-启用，1-禁用
			})
			this.loading = false
			if (resultCode == 0) {
				this.$message({
					message: `设置成功!`,
					type: 'success',
				})
				this.getData()
			}
		},

		getDetail(item) {
			this.buriedDialog = true
			this.$refs.goods_tag_dialog.getDetail(item)
		},
		checkupGoodses(item) {
			this.$router.push({
				name: 'goodsTagGoodsList',
				params: {
					goodsTagId: item.goodsTagId,
				},
			})
		},
	},
}
</script>

<style lang="scss" scope>
.goods-group-btn-box {
	margin-bottom: 20px;
}
.goodsTagTable .popconfirm-btn + .el-button {
	margin-left: 10px;
}
</style>

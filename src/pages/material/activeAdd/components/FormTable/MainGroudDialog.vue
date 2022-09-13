<template>
	<yx-dialog
		:bottomBtn="bottomBtn"
		:visible.sync="localVisible"
		:before-close="resetForm"
		title="选择档期"
	>
		<yx-form
			:inline="true"
			:data="dialogData"
			:items="dialogCfg"
			:formAction="dialogAction"
		></yx-form>

		<el-row>
			<yx-table
				v-loading="showLoading"
				:columns="tableColumns"
				:pagination="page"
				:data="tableData"
			>
				<template slot="saleState" slot-scope="scope">
					<div>
						<el-tag type="danger" v-if="curTime < scope.row.saleStartTime">
							未开始
						</el-tag>

						<el-tag type="info" v-if="curTime > scope.row.saleEndTime">
							已结束
						</el-tag>

						<el-tag
							v-if="
								curTime >= scope.row.saleStartTime &&
								curTime <= scope.row.saleEndTime
							"
						>
							进行中
						</el-tag>
					</div>
				</template>
			</yx-table>
		</el-row>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getSmallImg } from '@/utils/imageTool'
import { getGoodsGroupListByConditionForCMS } from '@/api/goodsGroup'
import moment from 'moment'

export default {
	components: {
		YxDialog,
		YxForm,
		YxTable,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			define: false,
		},
		mainGroupRow: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			getSmallImg: getSmallImg,
			selectGroupList: [],
			showLoading: false,
			currentTime: '',
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'groupName',
					title: '档期名称',
				},
				{
					title: '会场名称',
					type: 'string',
					dataIndex: 'brandName',
				},
				{
					title: '渠道',
					type: 'newMap',
					dataIndex: 'sourceType',
					options: [
						['1', 'AKC'],
						['2', 'HYK'],
						['3', 'BBC'],
						['4', 'WPC'],
						['5', '京东联盟'],
						['6', '海外购'],
						['7', '砍单活动'],
						['8', '奥买家'],
						['9', '自有品牌'],
						['10', '商家'],
						['11', '购拉拉'],
						['12', '超链'],
						['13', '自有品牌-海外'],
					],
				},
				{
					title: '售卖时间',
					type: 'string',
					dataIndex: 'saleStartTime',
					customRender: (row) => {
						return (
							moment(row.saleStartTime).format('YYYY-MM-DD HH:mm:ss') +
							'-' +
							moment(row.saleEndTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					title: '售卖状态',
					type: 'custom',
					dataIndex: 'saleState',
				},
				{
					title: '商品数',
					type: 'string',
					dataIndex: 'goodsCount',
				},
				{
					title: '操作',
					type: 'action',
					fixed: 'right',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.updatedGoodsGroup(row)
							},
							customRender: (action, row) => {
								action.title = this.findIndex(row) ? '添加' : '移除'
								return action
							},
						},
					],
				},
			],
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveGroud()
					},
				},
				{
					title: '取消',
					click: () => {
						this.resetForm()
					},
				},
			],
			dialogData: {
				groupNameKeyword: '',
				goodsType: 1,
			},
			dialogCfg: [
				{
					type: 'input',
					title: '筛选',
					dataIndex: 'groupNameKeyword',
					placeholder: '品牌名称',
				},
				{
					type: 'select',
					title: '营销类型',
					dataIndex: 'goodsType',
					label: 'value',
					options: [
						{
							goodsType: 1,
							value: '品牌营销',
						},
						{
							goodsType: 2,
							value: '专享营销',
						},
					],
				},
			],
			dialogAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getData(true)
					},
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

			tableData: [],
		}
	},
	computed: {
		localVisible: {
			get() {
				return this.visible
			},
			set(val) {
				this.$emit('update:visible', val)
			},
		},
	},
	mounted() {},
	watch: {
		localVisible(val) {
			if (val) {
				this.selectGroupList = JSON.parse(JSON.stringify(this.mainGroupRow))
				this.getData()
			}
		},
	},
	methods: {
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			// this.$refs.form.$refs.YxForm.resetFields()
		},
		saveGroud() {
			if (this.selectGroupList && this.selectGroupList.length > 1) {
				return this.$message.warning('主推档期不能超过1个')
			}
			this.$emit('saveGroup', this.selectGroupList)
			this.localVisible = false
		},
		findIndex(row) {
			// 判断是否已经添加用户
			let ids = this.selectGroupList.map((item) => {
				return item.goodsGroupId
			})
			return ids.indexOf(row.goodsGroupId) == -1
		},
		updatedGoodsGroup(row) {
			const ids = this.selectGroupList.map((item) => {
				return item.goodsGroupId
			})
			if (ids.indexOf(row.goodsGroupId) == -1) {
				this.selectGroupList = [row]
			} else {
				this.selectGroupList.splice(ids.indexOf(row.goodsGroupId), 1)
			}
			this.$forceUpdate()
		},

		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = Object.assign(this.dialogData, {
				length: this.page.length,
				goodsGroupStateList: ['1', '2'],
				gcategoryList: ['1'],
				isAct: 1,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})
			return paramJson
		},
		getData: async function (flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			const {
				data: { resultCode, resultData },
			} = await getGoodsGroupListByConditionForCMS(paramJson)
			this.curTime = new Date().getTime()
			if (resultCode == 0) {
				this.tableData = resultData.goodsGroupList
				this.page.count = resultData.goodsGroupCount
			} else {
				this.tableData = []
				this.page.count = 0
			}
			this.showLoading = false
		},
	},
}
</script>

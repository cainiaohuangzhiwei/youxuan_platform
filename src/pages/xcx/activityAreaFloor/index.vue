<template>
	<div class="activityAreaFloor">
		<basicContainer>
			<div class="goods-group-btn-box">
				<el-button type="primary" @click="toDetails">新增楼层</el-button>
			</div>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns101"
				:pagination="page101"
				:data="tableData101"
			></yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import { activityFloorList, deleteActivityFloor } from '@/api/yhtPlusCmsActArea'
import { setViewTitle } from '@/utils/helper/common'

export default {
	components: {
		BasicContainer,
		YxTable,
	},
	props: [],
	data() {
		return {
			loading: false,
			params: this.$route.params,
			tableData101: [],
			tableColumns101: [
				{
					type: 'string',
					dataIndex: 'sort',
					title: '显示顺序',
				},
				{
					type: 'string',
					dataIndex: 'floorName',
					title: '楼层名称',
				},
				{
					type: 'string',
					dataIndex: 'floorStyle',
					title: '楼层样式',
					customRender: ({ floorStyle }) => {
						return `${floorStyle}个图片位`
					},
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '查看详情',
							click: ({ id }) => {
								this.$router.push({
									path: `/xcx/activityAreaFloorDetails/${this.params.id}/${id}`,
								})
							},
						},
						{
							title: '删除',
							popconfirm: true,
							popconfirmTitle: '是否确定删除该楼层',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._deleteActivityFloor(row)
							},
						},
					],
				},
			],
			page101: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._activityFloorList()
				},
			},
		}
	},

	created() {
		let { id = '' } = this.$route.params
		if (id) {
			setViewTitle(this.$store, this.$route, `${id}`)
		}
		this._activityFloorList(true)
	},

	methods: {
		toDetails() {
			this.$router.push({
				path: `/xcx/activityAreaFloorDetails/${this.params.id}`,
			})
		},
		_deleteActivityFloor: async function ({ id }) {
			let {
				data: { resultCode, resultMsg },
			} = await deleteActivityFloor({
				activityAreaFloorId: id, //分组id
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this._activityFloorList(true)
			}
		},
		_activityFloorList: async function (flag) {
			this.loading = true
			let paramJson = this.findSearchParams101(flag)
			const {
				data: { resultCode, resultData },
			} = await activityFloorList(paramJson)
			if (resultCode == 0) {
				this.tableData101 = resultData.activityFloorList
				this.page101.count = resultData.count
			} else {
				this.page101.count = 0
				this.tableData101 = []
			}
			this.loading = false
		},
		findSearchParams101(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page101.currentPage = 1
			}
			const paramJson = Object.assign(
				{
					id: this.params.id,
				},
				{
					length: this.page101.length,
					startIndex: (this.page101.currentPage - 1) * this.page101.length,
				}
			)
			return paramJson
		},
	},
}
</script>

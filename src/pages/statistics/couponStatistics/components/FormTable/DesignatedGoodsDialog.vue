<template>
	<yx-dialog
		title="查看商品"
		:bottomBtn="bottomBtn"
		:visible.sync="localVisible"
		:before-close="resetForm"
	>
		<div>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tialogColumns"
					:data="tableData2"
				>
				</yx-table>
			</el-row>
		</div>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxTable from '@wg-vue-materials/yx-table'
export default {
	components: {
		YxDialog,
		YxTable,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			default: false,
		},
		conferenceHallRow: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			tableData: [],
			tableData2: [],
			showLoading: false,
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveSupplier()
					},
				},
			],
			tialogData: [],
			tialogColumns: [
				{
					type: 'string',
					dataIndex: 'goodsName1',
					title: '商品名称',
				},
				{
					type: 'string',
					dataIndex: 'goodsName2',
					title: '商品名称',
				},
				{
					type: 'string',
					dataIndex: 'goodsName3',
					title: '商品名称',
				},
				{
					type: 'string',
					dataIndex: 'goodsName4',
					title: '商品名称',
				},
				{
					type: 'string',
					dataIndex: 'goodsName5',
					title: '商品名称',
				},
				{
					type: 'string',
					dataIndex: 'goodsName6',
					title: '商品名称',
				},
			],
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

	watch: {
		localVisible(val) {
			if (val) {
				if (this.conferenceHallRow && this.conferenceHallRow.rangeExtInfo) {
					this.tableData = JSON.parse(
						JSON.stringify(this.conferenceHallRow.rangeExtInfo)
					)
				}
				this.queryData()
				// this.selectedSupplier = JSON.parse(JSON.stringify(this.itemInfo))
			}
		},
	},
	methods: {
		queryData() {
			let list = this.tableData
			let mapIndex = 0,
				groupList = []
			for (let i = 0; i < list.length; i++) {
				if (i % 6 == 0 && i != 0) {
					let item = {
						goodsName1: list[mapIndex],
						goodsName2: list[mapIndex + 1],
						goodsName3: list[mapIndex + 2],
						goodsName4: list[mapIndex + 3],
						goodsName5: list[mapIndex + 4],
						goodsName6: list[mapIndex + 5],
					}
					groupList.push(item)
					mapIndex = i
				}
			}
			if (mapIndex < list.length) {
				let item = {
					goodsName1: list[mapIndex],
				}
				if (list.length - mapIndex > 1) item.goodsName2 = list[mapIndex + 1]
				if (list.length - mapIndex > 2) item.goodsName3 = list[mapIndex + 2]
				if (list.length - mapIndex > 3) item.goodsName4 = list[mapIndex + 3]
				if (list.length - mapIndex > 4) item.goodsName5 = list[mapIndex + 4]
				if (list.length - mapIndex > 5) item.goodsName6 = list[mapIndex + 5]

				groupList.push(item)
			}
			this.tableData2 = JSON.parse(JSON.stringify(groupList))
		},
		saveSupplier() {
			this.localVisible = false
		},
	},
}
</script>

<style lang="scss" scoped></style>

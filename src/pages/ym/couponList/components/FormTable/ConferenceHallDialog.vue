<template>
	<yx-dialog
		title="查看会场"
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
					dataIndex: 'groupName1',
					title: '分组名称',
				},
				{
					type: 'string',
					dataIndex: 'groupName2',
					title: '分组名称',
				},
				{
					type: 'string',
					dataIndex: 'groupName3',
					title: '分组名称',
				},
				{
					type: 'string',
					dataIndex: 'groupName4',
					title: '分组名称',
				},
				{
					type: 'string',
					dataIndex: 'groupName5',
					title: '分组名称',
				},
				{
					type: 'string',
					dataIndex: 'groupName6',
					title: '分组名称',
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
				if (this.conferenceHallRow && this.conferenceHallRow.rangeExtList) {
					this.tableData = JSON.parse(
						JSON.stringify(this.conferenceHallRow.rangeExtList)
					)
				}
				this.queryData()
				// this.selectedSupplier = JSON.parse(JSON.stringify(this.itemInfo))
			}
		},
	},
	methods: {
		queryData() {
			console.log(this.tableData, 'fasdfasdfsfcccd')
			let list = this.tableData
			let mapIndex = 0,
				groupList = []
			for (let i = 0; i < list.length; i++) {
				if (i % 6 == 0 && i != 0) {
					let item = {
						groupName1: list[mapIndex].groupName,
						groupName2: list[mapIndex + 1].groupName,
						groupName3: list[mapIndex + 2].groupName,
						groupName4: list[mapIndex + 3].groupName,
						groupName5: list[mapIndex + 4].groupName,
						groupName6: list[mapIndex + 5].groupName,
					}
					groupList.push(item)
					mapIndex = i
				}
			}
			if (mapIndex < list.length) {
				let item = {
					groupName1: list[mapIndex].groupName,
				}
				if (list.length - mapIndex > 1)
					item.groupName2 = list[mapIndex + 1].groupName
				if (list.length - mapIndex > 2)
					item.groupName3 = list[mapIndex + 2].groupName
				if (list.length - mapIndex > 3)
					item.groupName4 = list[mapIndex + 3].groupName
				if (list.length - mapIndex > 4)
					item.groupName5 = list[mapIndex + 4].groupName
				if (list.length - mapIndex > 5)
					item.groupName6 = list[mapIndex + 5].groupName

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

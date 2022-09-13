<template>
	<yx-dialog title="关联机构" :bottomBtn="bottomBtn" :visible.sync="visible">
		<yx-form
			:inline="true"
			:data="dialogData"
			:items.sync="dialogCfg"
			:formAction="dialogAction"
		>
		</yx-form>
		<el-row>
			<yx-table
				v-loading="showLoading"
				:columns="tialogMcnColumns"
				:pagination="tialogMcnPage"
				:data="tialogMcnData"
			>
				<template slot="mcnId" slot-scope="scope">
					<el-radio
						v-model="selectedItem.mcnId"
						:label="scope.row.mcnId"
						@change="changeMcn(scope.row)"
						>选择</el-radio
					>
				</template>
			</yx-table>
		</el-row>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getMcnList } from '@/api/yhtPlusCmsLiveMcnControl'
export default {
	components: {
		YxDialog,
		YxForm,
		YxTable,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		// 主播信息
		selectedMcn: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			showLoading: false,
			selectedItem: {},
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveMcn()
					},
				},
			],
			visible: false,
			dialogData: {
				// 机构搜素参数
				mcnIdAndMcnName: '', // 机构名称或id
			},
			dialogCfg: [
				// 机构搜索项
				{
					type: 'input',
					dataIndex: 'mcnIdAndMcnName',
					title: '筛选',
					placeholder: '机构ID/机构名称',
				},
			],
			dialogAction: [
				// 机构搜索按钮
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getMcnList(true)
					},
				},
			],
			tialogMcnData: [],
			tialogMcnPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getMcnList()
				},
			},
			tialogMcnColumns: [
				// 机构表格项
				{
					type: 'string',
					title: '机构ID',
					dataIndex: 'mcnId',
				},
				{
					type: 'string',
					title: '机构名称',
					dataIndex: 'mcnName',
				},
				{
					type: 'custom',
					dataIndex: 'mcnId',
				},
			],
		}
	},
	methods: {
		changeMcn(row) {
			this.selectedItem = Object.assign({}, row)
		},
		findMcnParams(flag) {
			//搜索条件
			let paramJson = Object.assign(this.dialogData, {
				startIndex: 0,
				length: 1,
			})
			// 每页的加载数据长度
			paramJson.length = this.tialogMcnPage.length
			// 当前页的条数开始
			if (flag) {
				this.tialogMcnPage.currentPage = 1
			}
			paramJson.startIndex =
				(this.tialogMcnPage.currentPage - 1) * this.tialogMcnPage.length
			return paramJson
		},
		async _getMcnList(flag) {
			// 获取机构列表
			this.showLoading = true
			let paramJson = this.findMcnParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getMcnList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tialogMcnData = resultData.datalist
				this.tialogMcnPage.count = resultData.count
			} else {
				this.tialogMcnPage.count = 0
				this.tialogMcnData = []
			}
		},
		saveMcn() {
			this.$emit('update:selectedMcn', this.selectedItem)
			this.visible = false
		},
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
			if (this.visible) {
				this._getMcnList(true)
				this.selectedItem = Object.assign({}, this.selectedMcn)
			}
		},
		dialogVisible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.visible = newVlaue
			}
		},
	},
}
</script>

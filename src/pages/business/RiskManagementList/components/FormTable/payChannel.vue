<template>
	<yx-dialog title="选择渠道号" :bottomBtn="bottomBtn" :visible.sync="visible">
		<el-row>
			<yx-table
				v-loading="showLoading"
				:columns="tialogColumns"
				:data="payChannelList"
			>
				<template slot="payChannelsId" slot-scope="scope">
					<el-radio
						v-model="selectedItem.payChannelsId"
						:label="scope.row.payChannelsId"
						@change="changePayChannel(scope.row)"
						>选择</el-radio
					>
				</template>
			</yx-table>
		</el-row>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxTable from '@wg-vue-materials/yx-table'
import { listPayChannels } from '@/api/fillingDispose'
export default {
	components: {
		YxDialog,
		YxTable,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		// 渠道信息
		selectedRow: {
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
						this.savePayChannen()
					},
				},
			],
			visible: false,
			payChannelList: [],
			tialogColumns: [
				// 渠道列表配置项
				{
					type: 'string',
					title: '主商户',
					dataIndex: 'merchantNo',
				},
				{
					type: 'string',
					title: '子商户',
					dataIndex: 'otherNo',
					customRender: (row) => {
						return row.otherNo ? row.otherNo : '0'
					},
				},
				{
					type: 'custom',
					dataIndex: 'payChannelsId',
				},
			],
		}
	},
	methods: {
		// 选择渠道号
		changePayChannel(row) {
			this.selectedItem = Object.assign({}, row)
			if (!this.selectedItem.otherNo) {
				this.selectedItem.otherNo = 0
			}
		},
		// 获取渠道列表
		_listPayChannels: async function () {
			this.showLoading = true
			let {
				data: { resultCode, resultData = [] },
			} = await listPayChannels()
			this.showLoading = false
			if (resultCode == 0) {
				this.payChannelList = resultData
			} else {
				this.payChannelList = []
			}
		},
		// 点击确定判断是否有勾选渠道号
		savePayChannen() {
			if (!this.selectedItem.payChannelsId) {
				return this.$message.warning('请选择渠道号')
			}
			this.$emit('update:selectedRow', this.selectedItem)
			this.visible = false
		},
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
			if (this.visible) {
				this._listPayChannels()
				this.selectedItem = Object.assign({}, this.selectedRow)
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

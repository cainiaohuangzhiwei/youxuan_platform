<template>
	<basic-container>
		<div>
			<div class="btn-box">
				<el-button
					v-auth="'saveFillingChannels'"
					@click="setVisible"
					type="primary"
					>新增风控渠道号</el-button
				>
				<el-button
					style="display: none"
					v-auth="'disposeFilling'"
					@click="setRefundTimer"
					type="primary"
					>触发退款定时器</el-button
				>
			</div>
			<yx-table
				v-loading="showLoading"
				:columns="tableColumns"
				:data="fillingChannelList"
			></yx-table>
		</div>
		<yx-dialog
			title="新增渠道号"
			:bottomBtn="bottomBtn"
			:visible.sync="visible"
		>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			>
				<template #otherNo>
					<el-input
						v-model="searchData.otherNo"
						placeholder="请选择渠道号"
						value-key="otherNo"
						label="otherNo"
						@focus="selectOtherNo"
						clearable
						@clear="
							() => {
								searchData.otherNo = ''
								searchData.payChannelsId = ''
							}
						"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="visibleInfo = true"
						></el-button>
					</el-input>
				</template>
			</yx-form>
		</yx-dialog>
		<pay-channel
			:dialogVisible.sync="visibleInfo"
			:selectedRow.sync="searchData"
		></pay-channel>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import YxForm from '@wg-vue-materials/yx-form'
import {
	listFillingChannels,
	saveFillingChannels,
	delFillingChannels,
	disposeFilling,
} from '@/api/fillingDispose'
import YxDialog from '@/components/Dialog/index.vue'
import payChannel from './payChannel'

export default {
	components: {
		BasicContainer,
		YxTable,
		YxDialog,
		YxForm,
		payChannel,
	},
	name: 'FormTable',

	data() {
		return {
			showLoading: false,
			// 风控列表
			fillingChannelList: [],
			visible: false,
			visibleInfo: false,
			searchData: {
				otherNo: '',
				payChannelsId: '',
			},
			// 新增表单配置项
			searchCfg: [
				{
					title: '选择渠道号',
					type: 'custom',
					dataIndex: 'otherNo',
				},
			],
			// 新增弹框按钮配置项
			bottomBtn: [
				{
					title: '取消',
					type: 'default',
					click: () => {
						this.visible = false
					},
				},
				{
					title: '确定',
					click: () => {
						this._saveFillingChannels()
					},
				},
			],
			// 风控列表配置项
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'otherNo',
					title: '渠道号',
					customRender: (row) => {
						return row.otherNo ? row.otherNo : '0'
					},
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'string',
					dataIndex: 'userName',
					title: '操作人',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '删除',
							auth: 'delFillingChannels',
							popconfirm: true,
							popconfirmTitle: '确认删除此渠道号？',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._delFillingChannels(row)
							},
						},
					],
				},
			],
		}
	},

	created() {
		this._listFillingChannels()
	},

	methods: {
		// 显示新增渠道列表
		setVisible() {
			this.visible = true
			this.searchData = {
				otherNo: '',
				payChannelsId: '',
			}
		},
		// 显示渠道号列表
		selectOtherNo() {
			this.visibleInfo = true
		},
		// 新增风控渠道号
		_saveFillingChannels: async function () {
			if (!this.searchData.payChannelsId) {
				return this.$message.warning('请选择渠道号')
			}
			let {
				data: { resultCode },
			} = await saveFillingChannels({
				payChannelsId: this.searchData.payChannelsId,
			})
			if (resultCode == 0) {
				this.$message.success('新增成功')
				this.visible = false
				this._listFillingChannels()
			}
		},
		// 删除风控渠道号
		_delFillingChannels: async function ({ fillingChannelsId }) {
			let {
				data: { resultCode },
			} = await delFillingChannels({
				fillingChannelsId,
			})
			if (resultCode == 0) {
				this.$message.success('删除成功')
				this._listFillingChannels()
			}
		},
		// 触发退款定时器
		setRefundTimer: async function () {
			let {
				data: { resultCode },
			} = await disposeFilling({})
			if (resultCode == 0) {
				this.$message.success('触发成功')
			}
		},
		// 获取风控渠道号列表
		_listFillingChannels: async function () {
			this.showLoading = true
			let {
				data: { resultCode, resultData = [] },
			} = await listFillingChannels()
			this.showLoading = false
			if (resultCode == 0) {
				this.fillingChannelList = resultData
			} else {
				this.fillingChannelList = []
			}
		},
	},
}
</script>

<style scoped>
.btn-box {
	margin-bottom: 20px;
	text-align: right;
}
</style>

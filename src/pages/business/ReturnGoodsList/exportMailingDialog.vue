<template>
	<yx-dialog
		title="导出退货单列表"
		:bottomBtn="bottomBtn"
		:visible.sync="visible"
	>
		<yx-form labelWidth="100px" :data="dialogData" :items="dialogCfg"></yx-form>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import { downloadFile } from '@/utils/helper/common'
import { exportRetrunOrderListByCondition } from '@/api/yhtPlusCmsOrder'
import moment from 'moment'
export default {
	components: {
		YxDialog,
		YxForm,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		// 勾选列表
		selectedList: {
			type: Array,
			default: () => [],
		},
		// 搜索条件
		exportData: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this._exportMailing()
					},
				},
			],
			dialogData: {
				key: [],
				all: ['all'],
			},
			visible: false,
			dialogCfg: [
				{
					type: 'checkbox',
					dataIndex: 'all',
					label: 'value',
					title: '字段选择',
					change: () => {
						this.change(true)
					},
					options: [
						{
							all: 'all',
							value: '全选',
						},
					],
				},
				{
					type: 'checkbox',
					dataIndex: 'key',

					label: 'value',
					change: () => {
						this.change(false)
					},
					options: this.$store.state.app.constant.EXPORT_RETURN_ORDER,
				},
			],
		}
	},
	created() {
		this.dialogData.key = this.$store.state.app.constant.EXPORT_RETURN_ORDER.map(
			(item) => {
				return item.key
			}
		)
		this.visible = this.dialogVisible
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
		},
		dialogVisible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.visible = newVlaue
			}
		},
	},
	methods: {
		change(flag) {
			// 勾选监听
			if (flag) {
				if (this.dialogData.all.length) {
					this.dialogData.key = this.$store.state.app.constant.EXPORT_RETURN_ORDER.map(
						(item) => {
							return item.key
						}
					)
				} else {
					this.dialogData.key = []
				}
			} else {
				if (
					this.dialogData.key.length ==
					this.$store.state.app.constant.EXPORT_RETURN_ORDER.length
				) {
					this.dialogData.all = ['all']
				} else {
					this.dialogData.all = []
				}
			}
		},
		async _exportMailing() {
			// 导出文件
			let header = {}
			this.$store.state.app.constant.EXPORT_RETURN_ORDER.map((item) => {
				this.dialogData.key.map((key) => {
					if (item.key == key) {
						header[key] = item.value
					}
				})
			})

			// 弹框提示
			if (Object.keys(header).length == 0) {
				this.$message.error('请勾选字段')
				return
			}

			let levelUpgradeIdList = []
			if (this.selectedList.length) {
				levelUpgradeIdList = this.selectedList.map((item) => {
					return item.levelUpgradeId
				})
			}
			let paramJson = { header }
			if (levelUpgradeIdList.length) {
				paramJson.levelUpgradeIdList = levelUpgradeIdList
			} else {
				paramJson = Object.assign(paramJson, this.exportData)
				paramJson.startTime = moment(paramJson.startTime).valueOf() || ''
				paramJson.endTime = moment(paramJson.endTime).valueOf() || ''
			}
			let { data } = await exportRetrunOrderListByCondition(paramJson)
			this.visible = false
			downloadFile(data, '退货单列表.xlsx')
		},
	},
}
</script>

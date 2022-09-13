<template>
	<div>
		<yx-dialog
			:width="`800px`"
			v-loading="loading"
			:title="dialogTitle"
			:visible.sync="visible"
		>
			<yx-form
				labelWidth="140px"
				:data="dialogData"
				:rules="rules"
				:items.sync="dialogCfg"
				:formAction="dialogAction"
			>
			</yx-form>
		</yx-dialog>
	</div>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import { getLivePlanById, setHotfixContent } from '@/api/livePlan'
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
		// 项的信息
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			loading: false,
			visible: false,
			dialogTitle: '紧急维护',
			dialogData: {
				switchDefaultCopy: '', //缺省文案
				switchOn: 0, //状态
				switchJumpUrl: '', //小程序链接
			},
			rules: {},
			dialogCfg: [
				{
					type: 'input',
					title: '缺省文案',
					dataIndex: 'switchDefaultCopy',
				},
				{
					type: 'radio',
					title: '状态',
					dataIndex: 'switchOn',
					label: 'value',
					options: [
						{
							value: '开',
							switchOn: 1,
						},
						{
							value: '关',
							switchOn: 0,
						},
					],
				},
				{
					type: 'input',
					title: '小程序链接',
					dataIndex: 'switchJumpUrl',
				},
			],
			dialogAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.saveHofix()
					},
				},
			],
		}
	},
	methods: {
		async saveHofix() {
			let paramJson = this.dialogData
			//保存紧急维护内容
			let res = await setHotfixContent(paramJson)
			console.log(res, 'sadsadsad')
			if (res.data.resultCode == 0) {
				this.$message({
					message: '设置成功',
					type: 'success',
				})
				this.visible = false
			}
		},
		async _getLivePlanById(livePlanId) {
			// 获取直播详情
			let {
				data: { resultData },
			} = await getLivePlanById({
				livePlanId,
			})

			//解出参数
			let { switchDefaultCopy, switchJumpUrl, switchOn } = resultData || {}

			this.dialogData = Object.assign(
				{},
				{
					switchDefaultCopy: switchDefaultCopy || '',
					switchJumpUrl: switchJumpUrl || '',
					switchOn: switchOn || 0,
					livePlanId,
				}
			)
		},
	},
	watch: {
		visible(newVlaue) {
			if (this.visible) {
				if (this.itemInfo && this.itemInfo.livePlanId) {
					this._getLivePlanById(this.itemInfo.livePlanId)
				}
			}
			if (this.dialogVisible != newVlaue) {
				this.$emit('update:dialogVisible', newVlaue)
			}
		},
		dialogVisible(newVlaue) {
			this.visible = newVlaue
		},
	},
}
</script>

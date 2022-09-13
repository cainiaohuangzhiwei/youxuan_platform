<template>
	<yx-dialog title="编辑路由" :bottomBtn="bottomBtn" :visible.sync="visible">
		<yx-form labelWidth="100px" :data="dialogData" :items.sync="dialogCfg">
		</yx-form>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import { updateOrgWithdrawalConfig } from '@/api/withdrawalConfig'
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
		// 操作记录类型,1店主身份提现路由，2限额提现路由
		withdrawalConfigDetailVo: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			bottomBtn: [
				{
					title: '确定',
					click: (e) => {
						this._updateOrgWithdrawalConfig(e)
					},
				},
			],
			visible: false,
			dialogData: {
				ordinaryOrganization: 0,
				vipOrganization: 0,
				serviceOrganization: 0,
			},
			dialogCfg: [
				{
					type: 'radioMap',
					dataIndex: 'ordinaryOrganization',
					title: '普通店主',
					options: {
						否: 0,
						是: 1,
					},
				},
				{
					type: 'radioMap',
					dataIndex: 'vipOrganization',
					title: 'vip店主',
					options: {
						否: 0,
						是: 1,
					},
				},
				{
					type: 'radioMap',
					dataIndex: 'serviceOrganization',
					title: '服务商',
					options: {
						否: 0,
						是: 1,
					},
				},
			],
		}
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
		},
		dialogVisible(newVlaue) {
			this.visible = newVlaue
			if (this.visible) {
				let {
					ordinaryOrganization,
					vipOrganization,
					serviceOrganization,
					withdrawalConfigId,
				} = this.withdrawalConfigDetailVo
				this.dialogData = {
					ordinaryOrganization,
					vipOrganization,
					withdrawalConfigId,
					serviceOrganization,
				}
			}
		},
	},
	methods: {
		_updateOrgWithdrawalConfig: async function (e) {
			// 编辑店主路由
			let custom = {
				uid: e.currentTarget.__vue__._uid,
			}
			let {
				data: { resultCode, resultMsg },
			} = await updateOrgWithdrawalConfig(this.dialogData, custom)
			if (resultCode == 0) {
				this.$message({
					message: resultMsg,
					type: 'success',
				})
				this.visible = false
				this.$emit('updateWithdrawalConfig')
			}
		},
	},
}
</script>

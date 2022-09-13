<template>
	<yx-dialog title="模拟账户" :bottomBtn="bottomBtn" :visible.sync="visible">
		<yx-form labelWidth="100px" :data="dialogData" :items="dialogCfg"></yx-form>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import { simulationSupplierByUserId } from '@/api/clerk'
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
		selectItem: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			visible: false,
			dialogData: {
				supplierName: '', // 商家名字
				userName: '', // 登陆账号
				password: '', // 模拟登陆密码
			},
			dialogCfg: [
				{
					type: 'input',
					dataIndex: 'supplierName',
					title: '商家名称',
					disabled: true,
				},
				{
					type: 'input',
					dataIndex: 'userName',
					title: '登陆账号',
					disabled: true,
				},
				{
					type: 'input',
					dataIndex: 'password',
					title: '模拟登陆密码',
					disabled: true,
				},
			],
		}
	},
	methods: {
		async _simulationSupplierByUserId() {
			let {
				data: { resultData, resultCode },
			} = await simulationSupplierByUserId({
				clerkId: this.selectItem.clerkId,
			})
			if (resultCode == 0) {
				this.dialogData = resultData.simulationUserVo
			}
		},
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
			if (this.visible) {
				this._simulationSupplierByUserId()
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

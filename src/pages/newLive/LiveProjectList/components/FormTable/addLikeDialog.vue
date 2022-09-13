<template>
	<yx-dialog title="人气值调整" :visible.sync="visible">
		<yx-form
			labelWidth="100px"
			:data="dialogData"
			:rules="rules"
			:items.sync="dialogCfg"
			:formAction="dialogAction"
		>
		</yx-form>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import { addLiveCount } from '@/api/livePlan'
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
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		const checkNumber = (rule, value, callback) => {
			const regEn = /^[1-9]\d*$/
			if (!regEn.test(value)) {
				callback(new Error('请输入正整数'))
			} else if (value > 10000) {
				callback(new Error('增加的人气值不能大于10000'))
			}
			{
				callback()
			}
		}
		return {
			visible: false,
			dialogData: {
				livePlanId: '',
				add: '',
			},
			dialogAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this._addLive()
					},
				},
			],
			dialogCfg: [
				{
					type: 'input',
					title: '',
					placeholder: '请填入想增加的人气值，正数，如300',
					dataIndex: 'add',
				},
			],
			rules: {
				add: [
					{ required: true, message: '请填入想增加的人气值', trigger: 'blur' },
					{ validator: checkNumber },
				],
			},
		}
	},
	methods: {
		async _addLive() {
			let paramJson = Object.assign({}, this.dialogData)
			let {
				data: { resultMsg, resultCode },
			} = await addLiveCount(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.visible = false
				this.$emit('updateList')
			}
		},
	},
	watch: {
		itemInfo() {
			if (this.itemInfo && this.itemInfo.livePlanId) {
				this.dialogData = {
					livePlanId: this.itemInfo.livePlanId,
					add: '',
				}
			}
		},
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
		},
		dialogVisible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.visible = newVlaue
			}
		},
	},
}
</script>

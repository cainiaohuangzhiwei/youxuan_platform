<template>
	<div>
		<yx-dialog
			:visible.sync="localVisible"
			:before-close="resetForm"
			:bottomBtn="bottomBtn"
			width="800px"
			title="操作"
		>
			<yx-form
				ref="form"
				:inline="true"
				:data="dialogData"
				:items="dialogCfg"
				:rules="funRules"
			>
				<template #content>
					<UE
						ref="um"
						:defaultMsg="information"
						:name="'ue' + messagePlanId"
					></UE>
				</template>
			</yx-form>
		</yx-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxDialog from '@/components/Dialog'
import UE from '@/components/RichText'
import { auditForSupplier } from '@/api/businessMaterial'
export default {
	components: {
		YxDialog,
		YxForm,
		UE,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			define: false,
		},
		rejectEditRow: {
			type: Object,
			default: () => {},
		},
		//是否新增
		isAdd: {
			type: Boolean,
			define: false,
		},
	},
	data() {
		const validatePass = (_rule, _value, callback) => {
			const val = this.$refs.um.editor.getContent()
			if (!val) {
				callback(new Error('请输入消息内容'))
			} else {
				callback()
			}
		}

		return {
			information: '',
			messagePlanId: '',
			showLoading: false,
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveRejectReason()
					},
				},
				{
					title: '取消',
					type: 'default',
					click: () => {
						this.resetForm()
					},
				},
			],
			dialogCfg: [
				{
					type: 'custom',
					title: '驳回理由',
					dataIndex: 'content',
				},
			],
			funRules: {
				content: [{ required: true, validator: validatePass, trigger: 'blur' }],
			},
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
	mounted() {},
	watch: {
		localVisible(val) {
			if (val) {
				this.selectGoodsList = JSON.parse(JSON.stringify(this.rejectEditRow))
				this.$refs.um && this.$refs.um.editor.setContent('')
			}
		},
	},
	methods: {
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},
		async saveRejectReason() {
			const val = this.$refs.um.editor.getContent()
			if (!val) {
				this.$message.error('请输入驳回理由')
				return
			}
			// 正则， html变迁替换
			const pureText = val.replace(/<[^>]+>/g, '')
			if (pureText.length > 100) {
				this.$message.error('驳回理由不能超过100字')
				return
			}

			const { clerkId, clerkName, userId } = this.$store.state.user.userInfo

			// return
			const {
				data: { resultCode, resultMsg = '' },
			} = await auditForSupplier({
				...this.rejectEditRow,
				activityGoodsMaterialRefId: this.rejectEditRow.id,
				auditRemark: val,
				auditStatus: 4,
				clerkId,
				userName: clerkName,
				userId,
			})

			if (resultCode === 0) {
				this.$message.success('驳回成功！')
				this.localVisible = false
				this.rejectEditRow = {}
				this.$emit('rejectSuccess', this.rejectEditRow)
				return
			} else {
				this.$message.error('驳回失败：' + resultMsg)
				return
			}
		},
		findIndex(row) {
			// 判断是否已经添加用户
			let ids = this.selectGoodsList.map((item) => {
				return item.activityGoodsMaterialRefId
			})
			return ids.indexOf(row.activityGoodsMaterialRefId) == -1
		},
	},
}
</script>

<style lang="scss" scoped></style>

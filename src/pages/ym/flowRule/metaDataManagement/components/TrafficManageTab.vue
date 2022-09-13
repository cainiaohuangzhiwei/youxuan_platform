<template>
	<basic-container>
		<div style="width: 700px">
			<yx-form
				:inline="false"
				:items="adItem"
				:data="formData"
				labelWidth="150px"
				:formAction="formAction"
			>
			</yx-form>
		</div>
	</basic-container>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { trafficSaveOrUpdate, trafficGetOne } from '@/api/metaData'
import BasicContainer from '@wg-vue-materials/basic-container'
export default {
	components: {
		BasicContainer,
		YxForm,
	},

	data() {
		return {
			adItem: [
				{
					title: '店主分流ID',
					type: 'input',
					dataIndex: 'abtIdB',
					disabled: true,
				},
				{
					title: '店主兜底分流ID',
					type: 'input',
					dataIndex: 'defaultAbtIdB',
					disabled: true,
				},
				{
					title: '顾客分流ID',
					type: 'input',
					dataIndex: 'abtIdC',
					disabled: true,
				},
				{
					title: '顾客兜底分流ID',
					type: 'input',
					dataIndex: 'defaultAbtIdC',
					disabled: true,
				},
			],
			formData: {
				abtIdB: '',
				abtIdC: '',
				defaultAbtIdB: '',
				defaultAbtIdC: '',
				rcFlowHandleId: 0,
			},

			formAction: [
				{
					title: '编辑',
					type: 'primary',

					click: () => {
						this.submitForm()
					},
				},
			],
		}
	},

	created() {
		this.fetchAd()
	},

	methods: {
		async fetchAd() {
			const {
				data: { resultCode, resultData },
			} = await trafficGetOne()
			if (resultCode === 0 && resultData) {
				this.formData.rcFlowHandleId = resultData.rcFlowHandleId
				this.formData.abtIdB = resultData.abtIdB || ''
				this.formData.abtIdC = resultData.abtIdC || ''
				this.formData.defaultAbtIdB = resultData.defaultAbtIdB || ''
				this.formData.defaultAbtIdC = resultData.defaultAbtIdC || ''
			}
		},

		submitForm() {
			if (this.formAction[0].title == '编辑') {
				this.formAction[0].title = '保存'
				this.adItem.forEach((item) => {
					item.disabled = false
				})
			} else {
				this.saveForm()
				this.formAction[0].title = '编辑'
				this.adItem.forEach((item) => {
					item.disabled = true
				})
			}
		},

		async saveForm() {
			this.formData.operator = this.$store.state.user.userInfo.clerkName || ''
			const res = await trafficSaveOrUpdate(this.formData)
			const resultCode = res.data.resultCode
			if (resultCode == 0) {
				this.$message({
					message: '保存成功',
					type: 'success',
				})
			}
			this.fetchAd()
		},
	},
}
</script>

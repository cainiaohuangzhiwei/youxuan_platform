<template>
	<div>
		<yx-form
			ref="orgReconciliationImport"
			:inline="true"
			:data="storeData"
			:items="storeFormOptions"
			:formAction="storeActions"
		>
		</yx-form>
		<p class="mtb20">数据导入说明：</p>
		<p class="lh26">
			1、文件后缀名必须为：xls或xlsx（Excel标准格式）。<br />
			2.一个表格最多不允许超过10000行<br />
			3.一个表格内，同一个店主ID只允许有一行<br />
			4.调账类型只允许：月度收益补贴、普通调账<br />
		</p>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { orgReconciliationImport } from '@/api/shopSettlement'
export default {
	name: 'ReconciliationData',
	components: { YxForm },
	data() {
		return {
			storeData: {},
			// TODO： 控件渲染数据
			storeFormOptions: [
				{
					type: 'upload',
					dataIndex: 'fileStream',
					uploadAttributes: {
						limit: 1,
						autoUpload: false,
						showBtn: true,
						accept:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
						httpRequest: (file) => this._orgReconciliationImport(file, 'excel'),
					},
					class: 'excel-upload',
				},
			],
			storeActions: [
				{
					title: '导入',
					type: 'primary',
					click: () => {
						if (
							this.$refs['orgReconciliationImport'].$refs.fileStream[0]
								.uploadFiles &&
							this.$refs['orgReconciliationImport'].$refs.fileStream[0]
								.uploadFiles.length === 0
						) {
							this.$message.error('请先添加文件后点击导入！')
							return
						}

						this.$refs['orgReconciliationImport'].$refs.fileStream[0].submit()
					},
				},
				{
					title: '查看导入历史记录',
					type: 'primary',
					click: () => {
						this.$router.push({
							path: `shopBalanceTopUpList`,
						})
					},
				},
			],
		}
	},
	methods: {
		async _orgReconciliationImport(file) {
			let formData = new FormData()
			formData.append(
				'paramJsonStr',
				JSON.stringify({
					clerkId: this.$store.state.user.userInfo.clerkId,
					userId: this.$store.state.user.userInfo.userId,
					groupId: 2,
				})
			)
			formData.append('file', file.file)
			let {
				data: { resultCode, resultMsg },
			} = await orgReconciliationImport(formData)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
			}
			// 清空文件
			this.$refs['orgReconciliationImport'].$refs.fileStream[0].clearFiles()
		},
	},
}
</script>

<style></style>

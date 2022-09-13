<template>
	<div>
		<yx-form
			ref="orgDeductRecordImport"
			:inline="true"
			:data="storeData"
			:items="storeFormOptions"
			:formAction="storeActions"
		>
		</yx-form>
		<p class="mtb20">数据导入说明：</p>
		<p class="lh26">
			1、文件后缀名必须为：xls或xlsx（Excel标准格式）。<br />
			2、第一行空出，第一列填写店主ID，第二列填写扣款金额<br />
			3、一个表格内，同一个店主ID只允许有一行
		</p>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { orgDeductRecordImport } from '@/api/shopSettlement'
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
						httpRequest: (file) => this._orgDeductRecordImport(file, 'excel'),
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
							this.$refs['orgDeductRecordImport'].$refs.fileStream[0]
								.uploadFiles &&
							this.$refs['orgDeductRecordImport'].$refs.fileStream[0]
								.uploadFiles.length === 0
						) {
							this.$message.error('请先添加文件后点击导入！')
							return
						}

						this.$refs['orgDeductRecordImport'].$refs.fileStream[0].submit()
					},
				},
				{
					title: '查看导入历史记录',
					type: 'primary',
					click: () => {
						this.$router.push({
							path: `shopMonthlyStatementList`,
						})
					},
				},
			],
		}
	},
	methods: {
		async _orgDeductRecordImport(file) {
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
			} = await orgDeductRecordImport(formData)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
			}
			// 清空文件
			this.$refs['orgDeductRecordImport'].$refs.fileStream[0].clearFiles()
		},
	},
}
</script>

<style></style>

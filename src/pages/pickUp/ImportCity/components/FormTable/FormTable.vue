<template>
	<div>
		<yx-form
			ref="impostCityService"
			:inline="true"
			:data="storeData"
			:items="storeFormOptions"
			:formAction="storeActions"
		>
		</yx-form>
		<p class="mtb20">数据导入说明：</p>
		<p class="lh26">
			1、文件后缀名必须为：xls或xlsx（Excel标准格式），文件大小 &lt; 5M。<br />
			2、城市名称必须正确，错误或匹配不上系统则不允许导入；<br />
		</p>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { impostCityService } from '@/api/collectionOrder'
import { downloadFile } from '@/utils/helper/common'
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
						httpRequest: (file) => this._impostCityService(file, 'excel'),
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
							this.$refs['impostCityService'].$refs.fileStream[0].uploadFiles &&
							this.$refs['impostCityService'].$refs.fileStream[0].uploadFiles
								.length === 0
						) {
							this.$message.error('请先添加文件后点击导入！')
							return
						}

						this.$refs['impostCityService'].$refs.fileStream[0].submit()
					},
				},
				{
					title: '下载“揽件城市配置”模板',
					type: 'primary',
					click: () => {
						downloadFile('/excel/express/上门揽件配置城市文件模板.xls')
					},
				},
			],
		}
	},
	methods: {
		async _impostCityService(file) {
			let formData = new FormData()
			formData.append('formId', '#excelForm')
			formData.append(
				'data',
				JSON.stringify({
					organizationId: 1,
					clerkId: this.$store.state.user.userInfo.clerkId,
					userId: this.$store.state.user.userInfo.userId,
					timeStamp: new Date() * 1,
					groupId: 2,
					importSource: 1,
				})
			)
			formData.append('excel', file.file)
			let {
				data: { resultCode, resultMsg },
			} = await impostCityService(formData)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
			}
			// 清空文件
			this.$refs['impostCityService'].$refs.fileStream[0].clearFiles()
		},
	},
}
</script>

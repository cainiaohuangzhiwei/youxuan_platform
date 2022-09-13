<template>
	<div>
		<!-- <el-button type="primary" class="el-icon-right" @click="oldSystem"
			>老系统</el-button
		> -->
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="1、下载评价素材导入模块" name="download">
				<h4 class="mtb20">第一步：下载评价素材导入模板</h4>
				评价素材导入说明：
				<p class="lh26">
					{{ title }}
					<br />
					2，会场名称不许为空，若为空，则该素材无法导入；
					<br />
					3，内容、评价人名称可为空；
				</p>
				<el-button style="margin-bottom: 20px" @click="download"
					>下载评价素材导入模板</el-button
				>
				<br />
				<el-button style="margin-bottom: 20px" type="primary" @click="nextStep"
					>下一步，上传评价素材资料</el-button
				>
				<br />
				<el-link type="primary" @click="skip">导入评价素材图片</el-link>
			</el-tab-pane>
			<el-tab-pane label="2、上传评价素材" name="uploading">
				<h4 class="mtb20">第二步：下载评价素材导入模板</h4>
				<yx-form
					ref="withholdData"
					:inline="true"
					:data="storeData"
					:items="storeFormOptions"
				>
				</yx-form>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { downloadFile } from '@/utils/helper/common'
import { importEvaluation } from '@/api/webImport'
export default {
	name: 'MerchantWithholdData',
	components: { YxForm },
	data() {
		return {
			activeName: 'download',
			title:
				'1，文件后缀名必须为：xls或xlsx（Excel标准格式），文件大小 <5M，不可超过1000行（如评价素材较多，请分批上传）',
			storeData: {
				brandId: '',
				warehouseId: '',
			},
			brandName: '',
			// TODO： 控件渲染数据
			storeFormOptions: [
				{
					type: 'upload',
					dataIndex: 'fileStream',
					auth: '',
					uploadAttributes: {
						limit: 1,
						autoUpload: false,
						accept:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
						httpRequest: (file) => this._importDataDetail(file, 'excel'),
					},
					class: 'excel-upload',
				},
			],
		}
	},
	methods: {
		// 打开老系统
		oldSystem() {
			window.open(`/yhtplus/web/importMaterial.html`)
		},
		skip() {
			this.$router.push({
				path: `importMaterialImage`,
			})
		},
		nextStep() {
			this.activeName = 'uploading'
		},
		download() {
			downloadFile('/excel/platform/导入评价素材模板.xlsx')
		},
		async _importDataDetail(file) {
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
				})
			)
			formData.append('excel', file.file)
			let {
				data: { resultCode, resultMsg },
			} = await importEvaluation(formData)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
			}
			// 清空文件
			this.$refs['withholdData'].$refs.fileStream[0].clearFiles()
		},
	},
}
</script>

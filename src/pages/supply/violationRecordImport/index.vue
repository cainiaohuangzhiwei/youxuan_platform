<template>
	<div>
		<el-upload
			action=""
			class="excel-upload"
			ref="importViolationData"
			accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
			:limit="1"
			:auto-upload="false"
			:http-request="
				(file) => {
					_importDataDetail(file)
				}
			"
		>
			<el-button slot="trigger" class="mr20" icon="el-icon-plus">
				添加文件
			</el-button>
			<el-button type="primary" @click="submitUpload"> 导入 </el-button>
			<el-button
				type="primary"
				@click="downloadFile('/excel/platform/商家违规导入模板.xlsx?v=0.01')"
			>
				下载模板
			</el-button>
		</el-upload>
		<p class="mtb20">数据导入说明：</p>
		<p class="lh26">
			1.商家ID必填
			<br />
			2.订单号不必填
			<br />
			3.违规处罚事项从模板内的sheet2中获取，必填
			<br />
			4.违规原因不允许超过120字，必填
			<br />
			5.违规处罚金额最少为0.01，必填
			<br />
			6.违规确认状态为“待确认”时，需要在“商家违规记录列表”手动确认后商家才可见。
			<br />
		</p>
	</div>
</template>

<script>
import { downloadFile } from '@/utils/helper/common'
import { violationImportExcel } from '@/api/supply'
export default {
	data() {
		return {
			storeData: {
				brandId: '',
				warehouseId: '',
			},
			brandName: '',
			// TODO： 控件渲染数据
			downloadFile,
		}
	},
	methods: {
		submitUpload() {
			this.$refs.importViolationData.submit()
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
			} = await violationImportExcel(formData)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
			}
			// 清空文件
			this.$refs['importViolationData'].$refs.fileStream[0].clearFiles()
		},
	},
}
</script>
<style lang="scss" scoped>
.mr20 {
	margin-right: 20px;
}
.excel-upload {
	display: inline-block;
	margin-right: 20px;
}
</style>

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
				@click="
					downloadFile('/excel/supplier/商家小额补款配置模板.xlsx?v=0.01')
				"
			>
				下载商家小额补款配置模板
			</el-button>
		</el-upload>
		<p class="mtb20">数据导入说明：</p>
		<p class="lh26">
			1.文件后缀名必须为：xls或xlsx（Excel标准格式），文件大小 &lt;
			5M，不可超过5000行（如数据较多，请分批上传）。
			<br />
			2.商家ID不许为空，若为空则不允许导入；
			<br />
			3.商家名称不许为空，若商家名称为空或者商家ID与商家名称不匹配，则不允许导入；
			<br />
			4.小额补款权限状态不许为空，若为空则不允许导入；开启状态用数字“1”代替，关闭状态用数字“0”代替；
			<br />
			5.每日小额补款金额上限不许为空，若为空则不允许导入；
			<br />
		</p>
	</div>
</template>

<script>
import { downloadFile } from '@/utils/helper/common'
import { supplierConfigImportExcel } from '@/api/supplyAmount'

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
			} = await supplierConfigImportExcel(formData)
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

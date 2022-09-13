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
				@click="downloadFile('/excel/platform/导入活动商品模板.xlsx?v=1.0.1')"
			>
				下载模板
			</el-button>
			<el-button type="primary" @click="goImportRecord">
				查看导入历史记录
			</el-button>
		</el-upload>
		<p class="mtb20">数据导入说明：</p>
		<p class="lh26">
			1、一次导入最高不超过1000行。
			<br />
			2、排序值最高255。
			<br />
			3、同一会场同一货号重复导入，则视为覆盖原商品记录。
		</p>
	</div>
</template>

<script>
import { downloadFile } from '@/utils/helper/common'
import { secKillActivityGoodsImport } from '@/api/secKillActivity'
export default {
	name: 'activitiesGoodsImport',
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
		goImportRecord() {
			this.$router.push({
				path: `/publicPage/importRecord/${40}/${encodeURIComponent(
					'秒杀活动商品记录'
				)}`,
			})
		},
		submitUpload() {
			this.$refs.importViolationData.submit()
		},
		async _importDataDetail(file) {
			let formData = new FormData()
			formData.append(
				'paramJsonStr',
				JSON.stringify({
					clerkId: this.$store.state.user.userInfo.clerkId,
					userId: this.$store.state.user.userInfo.userId,
					groupId: 2,
					secKillActivityId: this.$route.params.secKillActivityId,
				})
			)
			formData.append('secKillActivityId', this.$route.params.secKillActivityId)

			formData.append('file', file.file)
			// formData.secKillActivityId = this.$route.params.secKillActivityId
			let {
				data: { resultCode, resultMsg },
			} = await secKillActivityGoodsImport(formData)
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

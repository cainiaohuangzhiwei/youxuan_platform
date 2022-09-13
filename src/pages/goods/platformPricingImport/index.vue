<template>
	<div>
		<el-button
			type="primary"
			@click="
				downloadFile(
					type == 1
						? '/excel/platform/导入批量平台调价模板（商家+品牌+类目）.xlsx'
						: '/excel/platform/导入批量平台调价模板（商品）.xlsx'
				)
			"
		>
			下载批量平台调价模板
			<div style="margin-top: 10px">
				{{ type == 1 ? '（维度：商家+品牌+类目）' : '（维度：商品）' }}
			</div>
		</el-button>
		<p class="mtb20">数据导入说明：</p>
		<p class="lh26">
			<span
				>1、文件后缀名必须为：xls或xlsx（Excel标准格式），文件大小
				&lt;5M，不可超过{{
					type == 1 ? 500 : 5000
				}}行（如数据较多，请分批上传）。</span
			>
			<br />
			2、数据ID为商品>商家扣点配置列表中的数据ID，不许为空、且必须正确，否则不允许导入。
			<br />
			3、商家名称、品牌名称必须和首列数据ID匹配，否则导入失败。
			<br />
			4、<span style="color: red"> 此维度下商品必须全部处于下架状态，</span
			>否则导入失败。 <br />
			5、加价方式不许为空，若为空则不允许导入；比例用数字“1”代替，金额用数字“2”代替。
			<br />
			6、加价金额/比例，无需输入百分号或单位。仅支持0、正数，最多两位小数点。
			<br />
		</p>
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

				<el-button type="primary" @click="goImportRecord">
					查看导入历史记录
				</el-button>
			</el-upload>
		</div>
	</div>
</template>

<script>
import { downloadFile } from '@/utils/helper/common'
import {
	importPlatformAdjustmentByCategory,
	importPlatformAdjustmentByGoods,
} from '@/api/deduction'
export default {
	name: 'platformPricingImport',
	data() {
		return {
			type: this.$route.params.type,
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
				path: `/publicPage/importRecord/${
					this.type == 1 ? 41 : 42
				}/${encodeURIComponent(
					this.type == 1
						? '批量平台调价导入记录（维度：商家+品牌+类目）'
						: '批量平台调价导入记录（商品）'
				)}`,
			})
		},
		submitUpload() {
			this.$refs.importViolationData.submit()
		},
		async _importDataDetail(file) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({
					clerkId: this.$store.state.user.userInfo.clerkId,
					userId: this.$store.state.user.userInfo.userId,
					userName: this.$store.state.user.userInfo.userName,
					clerkName: this.$store.state.user.userInfo.clerkName,
					groupId: 2,
				})
			)
			formData.append('file', file.file)
			let Url =
				this.type == 1
					? importPlatformAdjustmentByCategory
					: importPlatformAdjustmentByGoods
			let {
				data: { resultCode, resultMsg },
			} = await Url(formData)
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

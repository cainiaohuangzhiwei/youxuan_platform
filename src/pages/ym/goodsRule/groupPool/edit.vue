<template>
	<div class="GoodsPool-page">
		<!-- 基于element的搜索表格组合 -->
		<el-dialog width="80%" :visible.sync="showDialog" @close="back(true)">
			<el-form ref="formData" :model="formData" label-width="100px">
				<div class="title">会场池信息</div>

				<el-form-item
					label="会场池名称"
					prop="goodsPoolName"
					:rules="[{ required: true, message: '会场池名称不能为空' }]"
				>
					<el-input
						:disabled="!isNew"
						v-model="formData.goodsPoolName"
					></el-input>
				</el-form-item>
				<el-form-item v-if="!isNew" label="会场池ID">
					{{ id }}
				</el-form-item>

				<el-divider></el-divider>
				<div class="title">
					会场池条件<el-button
						v-if="isEdit"
						size="mini"
						style="margin-left: 20px"
						type="primary"
						@click="onEdit"
						>编辑会场池</el-button
					>
				</div>

				<el-form-item label="">
					<el-radio>公式配置</el-radio>
				</el-form-item>
				<el-form-item
					label="输入公式"
					prop="ruleContent"
					:rules="[{ required: true, message: '公式不能为空' }]"
				>
					<el-input
						:disabled="isEdit"
						type="textarea"
						:rows="6"
						v-model="formData.ruleContent"
					></el-input>
				</el-form-item>
				<el-form-item>
					<el-form-item>
						<el-button :loading="debugLoading" type="info" @click="onDebug"
							>调试</el-button
						>
						<el-button :loading="loading" type="primary" @click="onSubmit"
							>确定</el-button
						>
					</el-form-item>
				</el-form-item>
			</el-form>

			<!-- 表格 -->
			<template v-if="showTable">
				<div class="title">数据明细</div>
				<yx-table
					v-loading="loading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
				</yx-table>
			</template>
		</el-dialog>
	</div>
</template>
<script>
import YxTable from '@wg-vue-materials/yx-table'
import { getSmallImg } from '@/utils/imageTool'
import {
	queryGoodsGroupListByRule,
	addRule,
	updateRuleById,
} from '@/api/goodsRule'
export default {
	name: 'groupPoolEdit',
	components: {
		YxTable,
	},
	data() {
		return {
			showTable: false,
			tableColumns: [
				{
					dataIndex: 'goodsGroupId',
					title: '会场ID',
				},
				{
					dataIndex: 'groupName',
					title: '会场名称',
				},
				{
					type: 'image',
					dataIndex: 'brandLogoUrl',
					title: '品牌图片',
					class: 'image_small',
				},
			],
			tableData: [],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getMatchGoodsRuleList()
				},
			},
			formData: {
				ruleGroupDetailId: '',
				goodsPoolName: '',
				ruleContent: '',
			},
			id: 0,
			isNew: true,
			isEdit: false,
			debugLoading: false,
			loading: false,
		}
	},
	props: {
		goodsPoolId: {
			type: [Number, String],
		},
		row: {
			type: Object,
			value: () => {},
		},
		showDialog: Boolean,
	},
	watch: {
		goodsPoolId: function () {
			if (this.goodsPoolId && this.id !== this.goodsPoolId) {
				this.getRuleInfo(this.goodsPoolId)
			}
		},
	},

	methods: {
		getRuleInfo(id) {
			this.isEdit = true
			this.isNew = false
			this.id = id
			if (Object.keys(this.row).length) {
				const ruleDetail = this.row.ruleDetailList.length
					? this.row.ruleDetailList[0]
					: {}
				this.formData = {
					goodsPoolName: this.row.goodsPoolName,
					goodsPoolId: this.id,
					...ruleDetail,
				}
			}
		},
		tableChange(e) {
			this.page.currentPage = e
			this._getMatchGoodsRuleList()
		},
		onDebug() {
			if (!this.formData.ruleContent) {
				this.$message.warning('请输入公式')
				return
			}
			this.page.currentPage = 1
			this._getMatchGoodsRuleList()
		},
		_getMatchGoodsRuleList() {
			this.showTable = true
			if (this.debugLoading) return
			this.debugLoading = true
			queryGoodsGroupListByRule({
				ruleContent: this.formData.ruleContent,
				pageNum: this.page.currentPage,
				pageSize: this.page.pageSize || 10,
			})
				.then(({ data }) => {
					this.debugLoading = false
					if (data.resultCode === 0) {
						this.page.count = data.total
						this.tableData = data.resultData.map((x) => {
							x.brandLogoUrl = getSmallImg(x.brandLogoUrl)
							return x
						})
					}
				})
				.catch(() => {
					this.debugLoading = false
				})
		},
		onEdit() {
			this.isEdit = false
		},
		onSubmit() {
			this.$refs.formData.validate((valid) => {
				if (valid) {
					this.loading = true
					if (this.id) {
						updateRuleById({
							goodsPoolId: this.formData.goodsPoolId,
							ruleGroupDetailId: this.formData.ruleGroupDetailId,
							ruleContent: this.formData.ruleContent,
						})
							.then((res) => {
								this.loading = false
								if (res.data?.resultCode == 0) {
									this.$message.success('修改成功')
									this.back()
								}
							})
							.catch(() => {
								this.loading = false
							})
					} else {
						addRule({
							goodsPoolName: this.formData.goodsPoolName,
							goodsPoolContentType: 'GOODS_GROUP',
							ruleContent: this.formData.ruleContent,
						})
							.then((res) => {
								this.loading = false
								if (res.data?.resultCode == 0) {
									this.$message.success('创建成功')
									this.back()
								}
							})
							.catch(() => {
								this.loading = false
							})
					}
				}
			})
		},
		back(e) {
			this.$emit('update', !e)
			this.showDialog = false
			this.id = ''
			this.tableData = []
			this.page.count = 0
			this.page.currentPage = 1
			this.$refs.formData.clearValidate()
			this.$refs.formData.resetFields()

			this.formData = {
				ruleGroupDetailId: '',
				goodsPoolName: '',
				ruleContent: '',
			}

			this.isNew = true
			this.isEdit = false
			this.showTable = false
		},
	},
}
</script>

<style>
.image_small {
	width: 50px;
}
</style>
<style lang="scss" scoped>
.GoodsPool-page {
	.title {
		margin: 30px 0 10px 0;
		font-size: 16px;
	}
}
</style>

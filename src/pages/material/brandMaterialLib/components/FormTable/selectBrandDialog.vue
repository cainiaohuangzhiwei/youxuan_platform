/* eslint-disable no-dupe-else-if */
<template>
	<div>
		<el-dialog
			width="800px"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<yx-form
				:inline="true"
				:data="searchData"
				:items="searchCfg"
				:formAction="searchAction"
			></yx-form>
			<el-row>
				<yx-table
					v-loading="tableLoading"
					:highlightCcurrentRow="true"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				>
					<template slot="brandParentId" slot-scope="scope">
						<el-radio
							v-model="brandRow.brandParentId"
							@change="changeRow(scope.row)"
							:label="scope.row.brandParentId"
							>选择</el-radio
						>
					</template>
					<template slot="brandParentName" slot-scope="scope">
						<div class="slot">
							<div>
								<img
									class="goods_img"
									:src="
										getSmallImg(scope.row.brandImgUrl || scope.row.brandLogoUrl)
									"
									alt=""
								/>
							</div>
							<div>
								<div>{{ scope.row.brandParentName }}</div>
								<span>ID: {{ scope.row.brandParentId }}</span>
							</div>
						</div>
					</template>
					<template slot="materialCount" slot-scope="scope">
						<div>
							<span v-if="scope.row.materialCount > 0" class="hm">有</span>
							<span v-else class="nm">无</span>
						</div>
					</template>
				</yx-table>
				<div class="bs">
					<el-button type="primary" @click="handleSure">确定</el-button>
					<el-button @click="handleCancel">取消</el-button>
				</div>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getSmallImg } from '@/utils/imageTool'
import { searchBrandParent } from '@/api/newMaterial'
export default {
	props: {
		visible: {
			type: Boolean,
			define: false,
		},
		selectBrandRow: {
			define: false,
			default: () => {},
		},
	},

	components: {
		YxForm,
		YxTable,
	},

	data() {
		return {
			brandRow: {},
			tableLoading: false,
			brandMaterialDialog: false,
			brandMaterialRow: {},
			getSmallImg: getSmallImg,
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._searchBrandParent()
				},
			},
			tableData: [],
			tableColumns: [
				{
					type: 'custom',
					dataIndex: 'brandParentId',
				},
				{
					type: 'custom',
					width: 400,
					dataIndex: 'brandParentName',
					title: '品牌',
				},
				{
					type: 'custom',
					dataIndex: 'materialCount',
					title: '素材',
				},
			],
			searchData: {
				keyword: '',
			},
			searchCfg: [
				{
					type: 'input',
					title: '品牌名称',
					dataIndex: 'keyword',
					placeholder: '请输入品牌名称进行搜索',
				},
			],
			searchAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._searchBrandParent(true)
					},
				},
			],
		}
	},
	watch: {
		localVisible(val) {
			if (val) {
				this.searchData.keyword = ''
				this.brandRow = {}
				this.page.count = 0
				this.page.length = 10
				this.tableData = []
			}
		},
	},
	computed: {
		localVisible: {
			get() {
				return this.visible
			},
			set(val) {
				this.$emit('update:visible', val)
			},
		},
	},
	methods: {
		changeRow(row) {
			this.brandRow = Object.assign({}, row)
		},
		handleCancel() {
			this.localVisible = false
		},
		async _searchBrandParent(flag) {
			let paramJson = this.findSearchParams(flag)
			this.tableLoading = true
			let {
				data: { resultCode, resultData },
			} = await searchBrandParent(paramJson)
			this.tableLoading = false
			if (resultCode == 0) {
				this.tableData = resultData.voList || []
				this.page.count = resultData.total
			}
		},
		findSearchParams(flag) {
			let paramJson = {
				keyword: this.searchData.keyword,
			}
			paramJson.pageSize = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.pageNum = this.page.currentPage
			return paramJson
		},
		handleSure() {
			if (!this.brandRow.brandParentId) {
				return this.$message.warning('请选择对应品牌')
			} else {
				// this.brandMaterialDialog = true
				this.brandMaterialRow = {
					brandParentId: this.brandRow.brandParentId,
				}
				this.$emit('refresh', this.brandMaterialRow)
				this.localVisible = false
			}
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},
	},
}
</script>

<style lang="scss" scoped>
.slot {
	text-align: left;
	display: flex;
	align-items: center;

	.goods_img {
		width: 60px;
		height: 60px;
		margin-right: 10px;
		line-height: 155px;
	}

	.number {
		margin-right: 10px;
	}

	.goods_name {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
	}
}
.bs {
	text-align: center;
	margin-top: 20px;
}
.nm {
	color: rgb(195, 90, 103);
}
.hm {
	color: rgb(156, 204, 80);
}
</style>

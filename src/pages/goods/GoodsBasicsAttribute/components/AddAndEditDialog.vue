<template>
	<div>
		<el-dialog
			width="650px"
			title="新增属性"
			append-to-body
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="init"
		>
			<div v-loading="loading">
				<yx-form
					ref="form"
					:inline="false"
					:items="item"
					:data="searchData"
					:rules="funRules"
					:labelWidth="'100px'"
				>
					<template slot="attributeType">
						<el-button
							v-if="itemInfo.type !== 'check'"
							@click="newAdd"
							class="fr"
							type="primary"
							>新增</el-button
						>
					</template>
				</yx-form>

				<yx-table
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
					class="add-tabel"
				>
					<template slot="attribute" slot-scope="scope">
						属性{{ (page.currentPage - 1) * page.length + scope.index + 1 }}
					</template>
					<template slot="attributeItemValue" slot-scope="scope">
						<div v-if="itemInfo.type === 'check'">
							{{ scope.row.attributeItemValue }}
						</div>
						<el-input
							placeholder="请输入新的值"
							v-model="scope.row.attributeItemValue"
							maxlength="50"
							v-else
						></el-input>
					</template>
				</yx-table>

				<div v-if="itemInfo.type !== 'check'" class="btn">
					<el-button type="primary" @click="submitForm">保存</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import {
	saveBasicsAttribute,
	getBasicsAttribute,
	deleteBasicsAttributeItem,
	updateBasicsAttribute,
} from '@/api/yhtPlusCmsGoodsBasicsAttribute'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm,
		YxTable,
	},

	data() {
		return {
			item: [
				{
					title: '属性ID',
					dataIndex: 'goodsBasicsAttributeId',
					disabled: true,
					hide: true,
				},
				{
					title: '属性名称',
					dataIndex: 'attributeName',
					placeholder: '请输入属性名称',
					maxlength: 15,
				},
				{
					width: 100,
					type: 'custom',
					title: '属性值',
					dataIndex: 'attributeType',
				},
			],
			searchData: {
				attributeName: '',
			},
			loading: false,
			saveTableData: [],
			tableData: [],
			tableColumns: [
				{
					width: 100,
					type: 'custom',
					title: '属性',
					dataIndex: 'attribute',
				},
				{
					type: 'custom',
					title: '值',
					dataIndex: 'attributeItemValue',
				},
				{
					type: 'action',
					title: '操作',
					width: 100,
					hide: false,
					actions: [
						{
							title: '删除',
							popconfirm: true,
							popconfirmTitle: '是否删除该属性值',
							confirm: (row, e, i) => {
								this.deleteIt(row, e, i)
							},
						},
					],
				},
			],
			page: {
				count: 0,
				length: 5,
				pageSizes: [5, 10, 20, 30, 50],
				currentPage: 1,
				tableChange: () => {
					this.tableChange()
				},
			},
		}
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
		tableChange() {
			let saveTableData = this.saveTableData
			this.tableData = saveTableData.filter(
				(_, index) =>
					index >= (this.page.currentPage - 1) * this.page.length &&
					index < this.page.currentPage * this.page.length
			)
		},
		newAdd() {
			this.tableData.push({
				attributeItemValue: '',
			})
			this.saveTableData.push({
				attributeItemValue: '',
			})

			this.page.count = this.saveTableData.length
			let saveTableData = this.saveTableData
			if (saveTableData.length % this.page.length > 0) {
				this.page.currentPage =
					parseInt(saveTableData.length / this.page.length) + 1
			} else {
				this.page.currentPage = parseInt(
					saveTableData.length / this.page.length
				)
			}

			this.tableData = saveTableData.filter(
				(_, index) =>
					index >= (this.page.currentPage - 1) * this.page.length &&
					index < this.page.currentPage * this.page.length
			)
		},
		//删除
		deleteIt(row, e, i) {
			if (row.goodsBasicsAttributeItemId) {
				this.deleteBasicsAttributeItem(row.goodsBasicsAttributeItemId, i)
			} else {
				this.resetPage(i)
			}
		},
		// 删除时同步分页
		resetPage(i) {
			this.tableData.splice(i, 1)
			this.saveTableData.splice(
				i + (this.page.currentPage - 1) * this.page.length,
				1
			)

			if (this.tableData.length === 0) {
				this.page.currentPage !== 1
					? (this.page.currentPage -= 1)
					: (this.page.currentPage = 1)
			}
			this.tableChange()
			this.page.count = this.saveTableData.length
		},
		async deleteBasicsAttributeItem(goodsBasicsAttributeItemId, i) {
			this.loading = true
			const {
				data: { resultCode },
			} = await deleteBasicsAttributeItem({
				goodsBasicsAttributeItemId: goodsBasicsAttributeItemId,
			})
			this.loading = false
			if (resultCode == 0) {
				this.resetPage(i)
			}
		},
		// 获取商家列表
		init() {
			if (this.itemInfo.goodsBasicsAttributeId) {
				this.item[0].hide = false
				this.item[1].disabled = true
				this.searchData.goodsBasicsAttributeId = this.itemInfo.goodsBasicsAttributeId
				this.searchData.attributeName = this.itemInfo.attributeName
				this.getBasics()
				if (this.itemInfo.type === 'check') {
					this.tableColumns[2].hide = true
				}
			} else {
				//创建绑定关系
				this.saveTableData = [
					{
						attributeItemValue: '',
					},
				]
				this.tableData = this.saveTableData.filter(
					(_, index) => index + 1 <= this.page.length
				)
			}
		},
		async getBasics() {
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await getBasicsAttribute({
				goodsBasicsAttributeId: this.itemInfo.goodsBasicsAttributeId,
			})
			this.loading = false
			if (resultCode == 0) {
				this.saveTableData = resultData.goodsBasicsAttributeItems || []
				this.tableData = this.saveTableData.filter(
					(_, index) => index + 1 <= this.page.length
				)

				this.page.count =
					(resultData.goodsBasicsAttributeItems &&
						resultData.goodsBasicsAttributeItems.length) ||
					0
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		// 关闭弹窗
		resetForm() {
			this.item[0].hide = true
			this.item[1].disabled = false
			this.tableColumns[2].hide = false
			this.page.count = 0
			this.page.currentPage = 1
			this.page.length = 5
			this.searchData.attributeName = ''
			this.saveTableData = []
			this.tableData = []
			this.localVisible = false
		},

		// 保存
		async submitForm() {
			let attributeItems = []
			if (!this.searchData.attributeName) {
				this.$message({
					message: '请输入属性名称',
					type: 'warning',
				})
				return
			}
			this.saveTableData.forEach((item) => {
				if (item.attributeItemValue) {
					let json = {}
					json.attributeItemValue = item.attributeItemValue

					if (item.goodsBasicsAttributeItemId)
						json.goodsBasicsAttributeItemId = item.goodsBasicsAttributeItemId
					attributeItems.push(json)
				}
			})
			if (attributeItems.length === 0) {
				this.$message({
					message: '请输入属性值',
					type: 'warning',
				})
				return
			}

			this.loading = true
			if (this.itemInfo.goodsBasicsAttributeId) {
				const {
					data: { resultCode },
				} = await updateBasicsAttribute({
					goodsBasicsAttributeId: this.searchData.goodsBasicsAttributeId,
					attributeName: this.searchData.attributeName,
					attributeItems: attributeItems,
				})
				this.loading = false
				if (resultCode == 0) {
					this.$message({
						message: '编辑成功!',
						type: 'success',
					})
					this.resetForm()
					this.$emit('fatherMethodInit')
				}
			} else {
				const {
					data: { resultCode },
				} = await saveBasicsAttribute({
					attributeName: this.searchData.attributeName,
					attributeItems: attributeItems,
				})
				this.loading = false
				if (resultCode == 0) {
					this.$message({
						message: '新增成功!',
						type: 'success',
					})
					this.resetForm()
					this.$emit('fatherMethodInit')
				}
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.btn {
	text-align: right;
}
.add-tabel {
	margin-bottom: 18px;
	margin-top: -24px;
}
.fr {
	float: right;
}
</style>

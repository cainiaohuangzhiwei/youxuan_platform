<template>
	<yx-dialog
		title="添加上传图片"
		:bottomBtn="bottomBtn"
		:visible.sync="localVisible"
		:before-close="resetForm"
	>
		<div>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tialogColumns"
					:pagination="tialogPage"
					:data="tialogData"
				>
					<template slot="sourceId" slot-scope="scope">
						<el-radio
							v-model="selectedSupplier.sourceId"
							:label="scope.row.sourceId"
							@change="changeAnchor(scope.row)"
							>选择</el-radio
						>
					</template>
				</yx-table>
			</el-row>
		</div>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxTable from '@wg-vue-materials/yx-table'
import { materialSourcePage } from '@/api/promotionMaterials'
// import { getAnchor } from '@/api/yhtPlusCmsLiveUserAction'
// import moment from 'moment'
export default {
	components: {
		YxDialog,
		YxTable,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			default: false,
		},
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
		imgIndex: [Number, String],
		goodsNumber: [Number, String],
		brandId: [Number, String],
	},
	data() {
		return {
			showLoading: false,
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveSupplier()
					},
				},
			],
			selectedSupplier: {},
			tialogData: [],
			tialogPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._materialSourcePage()
				},
			},
			tialogColumns: [
				{
					type: 'image',
					dataIndex: 'materialPath',
					title: '图片',
				},
				{
					type: 'custom',
					dataIndex: 'sourceId',
					title: '选择',
				},
			],
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

	watch: {
		localVisible(val) {
			if (val) {
				this.selectedSupplier = JSON.parse(JSON.stringify(this.itemInfo))
				this._materialSourcePage()
			}
		},
	},
	methods: {
		changeAnchor(row) {
			this.selectedSupplier = Object.assign({}, row)
		},
		saveSupplier() {
			this.selectedSupplier.materialType = 'image'
			// this.selectedSupplier.materialContent =
			// 	this.selectedSupplier.materialPath || ''
			this.selectedSupplier.materialId =
				this.selectedSupplier.materialId || null
			this.$emit('saveUpload', this.selectedSupplier)
			this.localVisible = false
		},
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.tialogPage.currentPage = 1
			}
			const paramJson = {
				pageSize: this.tialogPage.length,
				pageNum: this.tialogPage.currentPage,
				goodsNumber: this.goodsNumber,
				brandId: this.brandId,
				sourceType: 2,
			}
			// const paramJson = Object.assign(this.dialogData, {
			// 	length: this.tialogPage.length,
			// 	startIndex: (this.tialogPage.currentPage - 1) * this.tialogPage.length,
			// })

			return paramJson
		},
		async _materialSourcePage(flag) {
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await materialSourcePage(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tialogData = resultData.records
				this.tialogPage.count = resultData.total
			} else {
				this.tialogPage.count = 0
				this.tialogData = []
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>

<template>
	<yx-dialog
		title="选择商家"
		:bottomBtn="bottomBtn"
		:visible.sync="localVisible"
		:before-close="resetForm"
	>
		<div>
			<yx-form
				:inline="true"
				:data="dialogData"
				:items.sync="dialogCfg"
				:formAction="dialogAction"
			>
			</yx-form>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tialogColumns"
					:pagination="tialogPage"
					:data="tialogData"
				>
					<template slot="supplierAccountNumberId" slot-scope="scope">
						<el-radio
							:disabled="
								scope.row.supplierName == '广州微裕贸易有限公司' ||
								scope.row.supplierAccountNumberId === 2194
							"
							v-model="selectedSupplier.supplierAccountNumberId"
							:label="scope.row.supplierAccountNumberId"
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
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
// import { getAnchor } from '@/api/yhtPlusCmsLiveUserAction'
import { findSupplierAccountNumberForList } from '@/api/yhtPlusCmsSupplierAccountNumber'
// import moment from 'moment'
export default {
	components: {
		YxDialog,
		YxForm,
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
					this._findSupplierAccountNumberForList()
				},
			},
			tialogColumns: [
				{
					type: 'string',
					dataIndex: 'supplierName',
					title: '商家',
				},
				{
					type: 'custom',
					dataIndex: 'supplierAccountNumberId',
					title: '选择',
				},
			],
			dialogData: {
				keyword: '', // 主播昵称/主播Id
			},
			dialogCfg: [
				{
					type: 'input',
					title: '筛选',
					dataIndex: 'keyword',
					placeholder: '选择商家',
				},
			],
			dialogAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._findSupplierAccountNumberForList(true)
					},
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
				console.log(this.itemInfo, 'dsdfdfdfdfdfdf')
				this.dialogData.keyword = ''
				this.selectedSupplier = JSON.parse(JSON.stringify(this.itemInfo))
				this._findSupplierAccountNumberForList()
			}
		},
	},
	methods: {
		changeAnchor(row) {
			this.selectedSupplier = Object.assign({}, row)
		},
		saveSupplier() {
			this.$emit('saveBusiness', this.selectedSupplier)
			this.localVisible = false
		},
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.tialogPage.currentPage = 1
			}

			const paramJson = Object.assign(this.dialogData, {
				length: this.tialogPage.length,
				startIndex: (this.tialogPage.currentPage - 1) * this.tialogPage.length,
			})

			return paramJson
		},
		async _findSupplierAccountNumberForList(flag) {
			// 商家列表
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await findSupplierAccountNumberForList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tialogData = resultData.list
				this.tialogPage.count = resultData.count
			} else {
				this.tialogPage.count = 0
				this.tialogData = []
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>

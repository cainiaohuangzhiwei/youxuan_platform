<template>
	<div>
		<yx-dialog :title="title" :visible.sync="visible">
			<yx-form
				:rules="rules"
				:labelWidth="'130px'"
				:data="dialogData"
				:items="dialogCfg"
				:formAction="formAction"
			>
				<template #supplierName>
					<el-row :gutter="24">
						<el-col :span="20" class="supplier_name">
							<el-input
								v-model="dialogData.supplierName"
								debounce
								placeholder="请在右侧按钮选择商家名称"
								value-key="supplierName"
								label="supplierName"
								:fetch-suggestions="_getCmsSupplierListByCondition"
								@select="handleBrandName"
								@focus="formsDialog = true"
								:disabled="addDisabled"
						/></el-col>
						<el-col :span="2">
							<el-button
								type="primary"
								icon="el-icon-more"
								:disabled="addDisabled"
								@click="formsDialog = true"
							/>
						</el-col>
					</el-row>
				</template>
			</yx-form>
		</yx-dialog>

		<!-- 商家列表 -->
		<supply-dialog
			:itemInfo="supplyRow"
			:visible.sync="formsDialog"
			@fatherMethodInit="
				(row) => {
					dialogData.supplierName = row.supplierName
					dialogData.supplierId = row.supplierId
				}
			"
		/>
	</div>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import SupplyDialog from './SupplyDialog'
import { getCmsSupplierListByCondition } from '@/api/yhtPlusCmsSupplier'
import {
	editSupplierService,
	addSupplierService,
} from '@/api/yhtPlusSupplierService'
export default {
	components: {
		YxDialog,
		YxForm,
		SupplyDialog,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		selectItem: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			visible: false,
			formsDialog: false,
			addDisabled: false,
			title: '新增商家登录账号',
			supplyRow: {}, // 商家当前行选中数据
			dialogData: {
				supplierId: '', //商家ID
				qiyuSupplierId: '', //七鱼商户ID
				supplierStatus: '1', //商家状态  1：启用  2：禁用
				supplierName: '', //商家名称
			},
			supplierList: [],
			rules: {},
			rulesAdd: {
				supplierName: [
					{ required: true, message: '请选择商家名称', trigger: 'blur' },
				],
				qiyuSupplierId: [
					{ required: true, message: '请输入七鱼ID', trigger: 'blur' },
				],
			},
			dialogCfg: [
				{
					type: 'custom',
					dataIndex: 'supplierName',
					title: '商家名称',
					disabled: false,
				},
				{
					type: 'input',
					disabled: false,
					title: '七鱼ID',
					dataIndex: 'qiyuSupplierId',
					placeholder: '请输入正确的七鱼ID',
				},
				{
					type: 'radio',
					disabled: false,
					title: '状态',
					dataIndex: 'supplierStatus',
					label: 'value',
					options: [
						{
							supplierStatus: '1',
							value: '启用',
						},
						{
							supplierStatus: '2',
							value: '禁用',
						},
					],
				},
			],
			resetmAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.resetmChange()
					},
				},
			],
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.changeCustomer()
					},
				},
			],
		}
	},
	methods: {
		// 获取商家列表
		async _getCmsSupplierListByCondition(queryString, callback) {
			const paramJson = {
				startIndex: 0,
				length: 20,
			}
			const {
				data: { resultCode, resultData },
			} = await getCmsSupplierListByCondition(paramJson)

			if (resultCode == 0 && resultData.supplierList.length > 0) {
				callback(resultData.supplierList)
			}
		},
		// 操作商家
		handleBrandName(item) {
			this.dialogData.supplierName = item.supplierName
			this.dialogData.supplierId = item.supplierId
		},
		async _updatesupplierServiceEdit(paramJson) {
			// 编辑商家客服
			let {
				data: { resultMsg, resultCode },
			} = await editSupplierService(paramJson)

			if (resultCode == 0) {
				this.$message({
					message: resultMsg,
					type: 'success',
				})
				this.$emit('updateList')
				this.visible = false
			}
		},
		async _addSupplierService(paramJson) {
			// 添加商家客服
			let {
				data: { resultMsg, resultCode },
			} = await addSupplierService(paramJson)

			if (resultCode == 0) {
				this.$message({
					message: resultMsg,
					type: 'success',
				})
				this.$emit('updateList')
				this.visible = false
			}
		},
		async changeCustomer() {
			let paramJson = {
				supplierId: this.dialogData.supplierId, //商家ID
				qiyuSupplierId: this.dialogData.qiyuSupplierId, //七鱼商户ID
				supplierStatus: this.dialogData.supplierStatus, //商家状态  1：启用  2：禁用
			}
			if (this.selectItem.supplierName) {
				// 编辑
				paramJson.supplierServiceId = this.selectItem.supplierServiceId
				this._updatesupplierServiceEdit(paramJson)
			} else {
				this._addSupplierService(paramJson)
			}
		},
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
			if (this.visible) {
				if (this.selectItem.supplierName) {
					this.title = '编辑商家客服'
					console.log('1111111', this.dialogCfg[0])
					this.addDisabled = true
					this.dialogData.supplierId = this.selectItem.supplierId
					this.dialogData.supplierStatus = this.selectItem.supplierStatus.toString()
					this.dialogData.supplierName = this.selectItem.supplierName
					this.dialogData.qiyuSupplierId = this.selectItem.qiyuSupplierId
					this.rules = this.rulesAdd
				} else {
					this.dialogData = {
						supplierId: '', //商家ID
						qiyuSupplierId: '', //七鱼商户ID
						supplierStatus: '1', //商家状态  1：启用  2：禁用
						supplierName: '', //商家名称
					}
					this.title = '新增商家客服'
					this.rules = this.rulesAdd
					this.addDisabled = false
				}
			}
		},
		dialogVisible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.visible = newVlaue
			}
		},
	},
}
</script>

<style lang="scss" scope>
.supplier_name {
	margin-left: -11px;
}
</style>

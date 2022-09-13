<template>
	<div>
		<Dialog :title="title" :visible.sync="localVisible" width="400px">
			<WgForm labelWidth="6em" :data="formData" :items="renderItems"> </WgForm>
			<el-button type="primary" class="btns" @click="next">下一步</el-button>
			<el-button class="btns" @click="hideTypeDialog">取消</el-button>
		</Dialog>

		<!-- 商品选择 -->
		<SelectProductDialog
			:visible.sync="selectProductDialogVisible"
			:selectProductRow="selectProductRow"
			:inquireProductRow="inquireProductRow"
			:eliminateGoodsInfoListS="eliminateGoodsInfoListS"
			:BooleS="BooleS"
			:newActivitiesRow="newActivitiesRow"
			:isCheckView.sync="isCheckView"
			@saveProduct="saveProduct"
			@close="closeSelectDialog"
		></SelectProductDialog>

		<!-- 档期选择 -->
		<SelectScheduleDialog
			:visible.sync="selectScheduleDialogVisible"
			:selectScheduleRow="selectScheduleRow"
			:isCheckView.sync="isCheckView"
			@saveSchedule="saveSchedule"
			@close="closeSelectDialog"
		></SelectScheduleDialog>

		<!-- 鲁班活页 -->
		<LubanActivityDialog
			:visible.sync="lubanActivityDialogVisible"
			:selectLubanRow="selectLubanRow"
			:isCheckView.sync="isCheckView"
			@saveCallback="saveLuban"
			@close="closeSelectDialog"
		/>
	</div>
</template>
<script>
import WgForm from '@/components/WgForm'
import Dialog from '@/components/Dialog'
import { CORRELATION_TYPE, CORRELATION_OPTION } from './constants.js'
import SelectScheduleDialog from './SelectScheduleDialog'
import SelectProductDialog from './SelectProductDialog'
import LubanActivityDialog from './LubanActivityDialog'

export default {
	props: {
		visible: {
			type: Boolean,
			define: false,
		},
		isCheckView: {
			type: Boolean,
			default: false,
		},
		uoConditionItemCorrelationList: {
			type: Array,
			define: () => [],
		},
		correlationTypeList: {
			type: Array,
			define: () => [],
		},
	},
	components: {
		Dialog,
		WgForm,
		SelectScheduleDialog,
		SelectProductDialog,
		LubanActivityDialog,
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
				this.showSelectForm()
			}
		},
	},
	data() {
		return {
			// 选择类型
			title: '选择关联内容',
			selectProductDialogVisible: false,
			selectScheduleDialogVisible: false,
			lubanActivityDialogVisible: false,
			selectProductRow: [],
			inquireProductRow: [],
			selectLubanRow: [],
			eliminateGoodsInfoListS: [],
			newActivitiesRow: {},
			BooleS: false, //在档期中剔除商品
			formData: {
				correlationType: CORRELATION_TYPE.GOODS,
				lists: [],
			},
			renderItems: [
				{
					title: '关联内容:',
					dataIndex: 'correlationType',
					type: 'radio',
					label: 'text',
					options: [
						// {
						// 	text: '商品',
						// 	correlationType: CORRELATION_TYPE.GOODS,
						// },
						// {
						// 	text: '档期',
						// 	correlationType: CORRELATION_TYPE.BRANDS,
						// },
						// {
						// 	text: '鲁班活动页',
						// 	correlationType: CORRELATION_TYPE.LUBAN_ACTIVITY,
						// },
					],
				},
			],
		}
	},

	methods: {
		// 展示逻辑
		showSelectForm() {
			if (this.uoConditionItemCorrelationList.length) {
				this.formData.correlationType =
					this.uoConditionItemCorrelationList[0].correlationType
				this.formData.lists = this.uoConditionItemCorrelationList
				this.showSelectFormDialog = true
				this.next()
			} else {
				// 渲染可选
				const selectOptionItem = this.renderItems.find(
					(item) => item.dataIndex === 'correlationType'
				)
				selectOptionItem.options = this.correlationTypeList.map((item) => {
					return {
						text: CORRELATION_OPTION[item],
						correlationType: item,
					}
				})
				// 初始化
				this.formData.correlationType = CORRELATION_TYPE.GOODS
				this.formData.lists = []
				this.showSelectFormDialog = true
			}
		},
		// 关闭弹窗
		hideTypeDialog() {
			this.localVisible = false
			this.formData.lists = []
			this.formData.correlationType = ''
		},

		// 关闭选择弹窗
		closeSelectDialog() {
			if (this.showSelectFormDialog) {
				this.$emit('close')
			}
		},

		next() {
			if (this.formData.correlationType === CORRELATION_TYPE.GOODS) {
				// 商品选择
				this.selectProductDialogVisible = true
				this.selectProductRow = this.formData.lists
					.filter((item) => item.correlationType === CORRELATION_TYPE.GOODS)
					.map((item) => ({
						goodsId: item.correlationId,
					}))
			} else if (this.formData.correlationType === CORRELATION_TYPE.BRANDS) {
				// 档期选择
				this.selectScheduleDialogVisible = true
				this.selectScheduleRow = this.formData.lists
					.filter((item) => item.correlationType === CORRELATION_TYPE.BRANDS)
					.map((item) => ({
						goodsGroupId: item.correlationId,
					}))
			} else if (
				this.formData.correlationType === CORRELATION_TYPE.LUBAN_ACTIVITY
			) {
				// 鲁班页选择
				this.lubanActivityDialogVisible = true
				this.selectLubanRow = this.formData.lists
					.filter(
						(item) => item.correlationType === CORRELATION_TYPE.LUBAN_ACTIVITY
					)
					.map((item) => item.correlationId)
			}
		},

		saveSchedule(selectScheduleRow) {
			this.selectScheduleDialogVisible = false
			this.formData.lists = selectScheduleRow.map((item) => {
				return {
					correlationId: item.goodsGroupId,
					correlationType: CORRELATION_TYPE.BRANDS,
				}
			})
			this.$emit('saveCallback', this.formData.lists)
		},

		saveProduct(selectProductRow) {
			this.selectProductDialogVisible = false
			this.formData.lists = selectProductRow.map((item) => {
				return {
					correlationId: item.goodsId,
					correlationType: CORRELATION_TYPE.GOODS,
				}
			})
			this.$emit('saveCallback', this.formData.lists)
		},

		saveLuban(selectLubanRow) {
			this.lubanActivityDialogVisible = false
			this.formData.lists = selectLubanRow.map((item) => {
				return {
					correlationId: item,
					correlationType: CORRELATION_TYPE.LUBAN_ACTIVITY,
				}
			})
			this.$emit('saveCallback', this.formData.lists)
		},
	},
}
</script>

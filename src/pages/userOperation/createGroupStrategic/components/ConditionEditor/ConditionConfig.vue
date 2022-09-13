<template>
	<div>
		<yx-dialog
			:bottomBtn="bottomBtn"
			:visible.sync="localVisible"
			:before-close="resetForm"
			width="500px"
			title="添加条件"
		>
			<yx-form
				:data="formData"
				:items.sync="formItems"
				ref="conditionForm"
				label-width="80px"
				v-loading="loading"
				:rules="rules"
			>
				<!-- 选择分类 -->
				<template #uoAttributeClassifyId>
					<div>
						<el-tag
							v-if="formData.uoAttributeClassifyId"
							:key="i"
							:closable="!disabled"
							:disable-transitions="false"
							@close="deleteClassifyItem"
							class="tagItem"
						>
							{{ formData.classifyName }}
						</el-tag>
						<el-button
							@click="selectUoAttributeClassify"
							type="primary"
							icon="el-icon-plus"
							size="mini"
							:disabled="disabled"
						>
							选择分类
						</el-button>
					</div>
				</template>

				<!-- 选择属性 -->
				<template #uoAttributeId>
					<div>
						<el-tag
							v-if="formData.uoAttributeId"
							:key="i"
							:closable="!disabled"
							:disable-transitions="false"
							@close="deleteAttributeItem"
							class="tagItem"
						>
							{{ formData.uoAttributeName }}
						</el-tag>
						<el-button
							@click="selectUoAttribute"
							type="primary"
							icon="el-icon-plus"
							size="mini"
							:disabled="disabled"
						>
							选择属性
						</el-button>
					</div>
				</template>

				<!-- 选择条件 -->
				<template #condition>
					<el-select
						v-model="formData.condition"
						placeholder="请选择条件"
						@change="changeCondition"
					>
						<el-option
							v-for="item in conditionOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</template>

				<!-- 选择字典 -->
				<template #attributeValue>
					<el-select
						v-model="formData.attributeValue"
						placeholder="请选择字典值"
					>
						<el-option
							v-for="item in attributeValueOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</template>
			</yx-form>
		</yx-dialog>

		<!-- 选择分类 -->
		<ClassifySelect
			:visible.sync="selectClassifyVisible"
			:classifyItem="defaultClassifyItem"
			@saveCallback="saveClassifyCallback"
		></ClassifySelect>

		<!-- 选择属性 -->
		<AttributeSelect
			:visible.sync="selectAttributeVisible"
			:classifyItem="defaultAttributeItem"
			@saveCallback="saveAttributeCallback"
		></AttributeSelect>
	</div>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import ClassifySelect from './ClassifySelect'
import AttributeSelect from './AttributeSelect'
import {
	NORMAL_CONDITION,
	CONDITION_STATUS,
	DICT_CONDITION,
	ATTRIBUTE_TYPE,
} from './constants'

import { queryAttributeDictionariesBatch } from '@/api/uoOptionKey'

export default {
	components: {
		YxDialog,
		YxForm,
		ClassifySelect,
		AttributeSelect,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			define: false,
		},
		disabled: {
			type: Boolean,
			define: false,
		},
		config: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			loading: false,
			// 选择分类
			selectClassifyVisible: false,
			defaultClassifyItem: {},
			// 选择属性
			selectAttributeVisible: false,
			defaultAttributeItem: {},

			// 属性值
			attributeValueOptions: [],

			// 选择关联
			addCorrelationDialog: false,

			// 表单数据
			formData: {
				// 分类
				uoAttributeClassifyId: '',
				classifyName: '',
				nameCode: '',
				// 属性
				uoAttributeId: '',
				uoAttributeName: '',
				// 条件
				condition: CONDITION_STATUS.EQUAL,
				attributeValue: '',
			},
			conditionOptions: NORMAL_CONDITION,
			formItems: [
				{
					type: 'custom',
					title: '分类',
					dataIndex: 'uoAttributeClassifyId',
				},
				{
					type: 'custom',
					title: '属性',
					dataIndex: 'uoAttributeId',
				},
				{
					type: 'custom',
					title: '判断条件',
					dataIndex: 'condition',
				},
				{
					type: 'time',
					timeAttributes: {
						type: 'datetime',
					},
					title: '值/选项',
					dataIndex: 'attributeValue',
				},
			],
			rules: {
				uoAttributeClassifyId: [
					{ required: true, message: '请选择分类', trigger: 'change' },
				],
				uoAttributeId: [
					{ required: true, message: '请选择属性', trigger: 'change' },
				],
				condition: [
					{ required: true, message: '请选择条件', trigger: 'change' },
				],
				attributeValue: [
					{
						required: true,
						trigger: 'change',
						validator: this.validateAttributeValue,
					},
				],
			},
			bottomBtn: [
				{
					title: '取消',
					type: 'info',
					click: () => {
						this.resetForm()
					},
				},
				{
					title: '确定',
					click: () => {
						console.log('确定')
						this.saveCallback()
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
	mounted() {},
	watch: {
		localVisible(val) {
			if (val) {
				this.deleteClassifyItem()
				this.init()
			}
		},
	},
	methods: {
		init() {
			this.formData = Object.assign(this.formData, this.config)
			this.formatFormItemType(true)
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},
		// 选择分类
		selectUoAttributeClassify() {
			this.selectClassifyVisible = true
			this.defaultClassifyItem = this.formData
		},
		// 保存分类
		saveClassifyCallback(val) {
			if (this.formData.uoAttributeClassifyId !== val.uoAttributeClassifyId) {
				this.deleteAttributeItem()
			}
			this.formData.uoAttributeClassifyId = val.uoAttributeClassifyId
			this.formData.classifyName = val.name
			this.formData.nameCode = val.nameCode
			this.formatFormCol()
		},
		// 删除分类
		deleteClassifyItem() {
			this.formData.uoAttributeClassifyId = ''
			this.formData.classifyName = ''
			this.formData.nameCode = ''
			this.deleteAttributeItem()
		},
		// 删除属性
		deleteAttributeItem() {
			this.formData.uoAttributeId = ''
			this.formData.uoAttributeName = ''
			this.formData.attributeType = ''
			this.formData.attributeValue = ''
			this.formatFormCol()
		},
		// 选择属性
		selectUoAttribute() {
			if (!this.formData.uoAttributeClassifyId) {
				this.$message.error('请先选择分类')
				return
			}
			this.selectAttributeVisible = true
			this.defaultAttributeItem = this.formData
		},
		// 保存属性
		saveAttributeCallback(val) {
			if (this.formatData.uoAttributeId !== val.uoAttributeId) {
				this.formData.uoAttributeId = val.uoAttributeId
				this.formData.uoAttributeName = val.name
				this.formData.attributeType = val.attributeType
				this.formatFormItemType()
			}
		},
		// 修改表单属性类型
		formatFormItemType(isInit) {
			// 日期
			if (this.formData.attributeType === ATTRIBUTE_TYPE.DATE) {
				this.getFormItem('attributeValue').type = 'time'
				this.formData.attributeValue =
					this.formData.attributeValue && Number(this.formData.attributeValue)
			} else if (this.formData.attributeType === ATTRIBUTE_TYPE.DICT) {
				// 字典
				this.getFormItem('attributeValue').type = 'custom'
				console.log('改变字典渲染值')
			} else {
				// 整数
				if (
					this.formData.attributeType === ATTRIBUTE_TYPE.INTEGER ||
					this.formData.attributeType === ATTRIBUTE_TYPE.DECIMAL
				) {
					this.getFormItem('attributeValue').type = 'inputNumber'
				} else {
					this.getFormItem('attributeValue').type = 'input'
				}
			}
			if (!isInit) {
				this.formData.attributeValue = ''
			}
			this.formatFormCol()
		},
		// 处理数据选择表单数据
		async formatFormCol() {
			if (this.formData.attributeType === ATTRIBUTE_TYPE.DICT) {
				this.formData.condition = CONDITION_STATUS.EQUAL
				this.conditionOptions = DICT_CONDITION
				this.attributeValueOptions = await this.getDictOptions(
					this.formData.uoAttributeId
				)
			} else {
				this.conditionOptions = NORMAL_CONDITION
			}

			this.changeCondition(this.formData.condition)
		},
		// 请求字典信息
		async getDictOptions(id) {
			const {
				data: { resultCode, resultData },
			} = await queryAttributeDictionariesBatch({
				uoAttributeId: id,
			})
			if (resultCode === 0) {
				return resultData.map((item) => ({
					label: item.name,
					value: String(item.uoOptionKeyId),
				}))
			}
			return []
		},
		validateAttributeValue(_rule, value, callback) {
			if (value === '') {
				callback(new Error('请输入条件值'))
			}
			if (this.formData.attributeType === ATTRIBUTE_TYPE.INTEGER) {
				// 判断值是否为整数
				if (!/^[0-9]*$/.test(value)) {
					callback(new Error('请输入整数'))
				}
			}

			if (this.formData.attributeType === ATTRIBUTE_TYPE.DECIMAL) {
				// 判断值是否为整数
				if (!/^[0-9]+(.[0-9]{1,2})?$/.test(value)) {
					callback(new Error('请输入数字，最多两位小数'))
				}
			}

			return callback()
		},
		// 根据dataIndex获取表单配置索引
		getFormItem(dataIndex) {
			return this.formItems.find((item) => item.dataIndex === dataIndex)
		},
		updatedUserGroup(row) {
			// 添加/移除用户
			const ids = this.selectCouponList.map((item) => {
				return item.yxCouponId
			})
			if (ids.indexOf(row.yxCouponId) == -1) {
				this.selectCouponList.push(row)
			} else {
				this.selectCouponList.splice(ids.indexOf(row.yxCouponId), 1)
			}
		},

		// 改变条件
		changeCondition(val) {
			if (
				val === CONDITION_STATUS.NO_VALUE ||
				val === CONDITION_STATUS.HAS_VALUE
			) {
				this.formData.attributeValue = ''
				this.getFormItem('attributeValue').hide = true
			} else {
				this.getFormItem('attributeValue').hide = false
			}
		},

		handleConference(val) {
			this.conferenceHallRow = {}
			this.conferenceHallRow = val
			this.conferenceHallDialog = true
		},
		handleCommodity(val) {
			this.conferenceHallRow = {}
			this.conferenceHallRow = val
			this.designatedGoodsDialog = true
		},
		formatData() {
			// condition为有值或无值时， 删除属性值
			if (
				this.formData.condition === CONDITION_STATUS.NO_VALUE ||
				this.formData.condition === CONDITION_STATUS.HAS_VALUE
			) {
				this.formData.attributeValue = ''
			}
		},
		saveCallback() {
			// 校验form表单
			this.$refs.conditionForm.$refs.YxForm.validate((valid) => {
				if (valid) {
					this.formatData()
					this.$emit('saveCallback', this.formData)
					this.resetForm()
				} else {
					return false
				}
			})
		},
	},
}
</script>

<style lang="scss">
.tips {
	margin-bottom: 10px;
}
</style>

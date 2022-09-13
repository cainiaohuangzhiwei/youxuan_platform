<template>
	<div>
		<div class="condition-editor">
			<div
				class="condition-list"
				v-for="(item, index) in uoConditionList"
				:key="index"
			>
				<!-- 或、非 -->
				<div v-if="index !== 0">
					<el-select
						class="condition-type"
						v-model="item.conditionType"
						align="center"
						placeholder="请选择条件"
						:disabled="disabled"
					>
						<el-option
							v-for="item in RELATION_OPTION"
							class="condition-type-option"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</div>
				<!-- 条件组 -->
				<div class="condition-item">
					<i
						class="el-icon-close closeBtn"
						@click="delConditionGroup(index)"
						v-if="!disabled"
					></i>
					<div class="item">
						<div class="item-flex connector">且</div>
						<div class="item-flex">
							<div
								class="condition-item"
								v-for="(conditionItem, key) in item.uoConditionItemList"
								:key="key"
							>
								<el-tag
									:closable="!disabled"
									size="medium"
									@close="delCorrelationItem(index, key)"
								>
									{{ getComputedText(conditionItem) }}</el-tag
								>
								<i
									class="el-icon-edit"
									v-if="!disabled"
									@click="editConditionConfig(index, key, conditionItem)"
								></i>
								<span
									v-if="
										conditionItem.uoConditionItemCorrelationList &&
										conditionItem.uoConditionItemCorrelationList.length > 0
									"
								>
									<el-tag
										:closable="!disabled"
										size="medium"
										type="success"
										class="correlation-number"
										@click="checkCorrelation(index, key)"
										@close="delCorrelationList(index, key)"
										>已关联
										{{
											conditionItem.uoConditionItemCorrelationList.length
										}}个{{
											CORRELATION_TYPE_TEXT[
												conditionItem.uoConditionItemCorrelationList[0]
													.correlationType
											]
										}}</el-tag
									>
									<i
										v-if="!disabled"
										class="el-icon-edit"
										@click="editCorrelationList(index, key)"
									></i>
								</span>
								<span v-else>
									<el-button
										v-if="
											conditionItem.correlationTypeList &&
											conditionItem.correlationTypeList.length > 0
										"
										:disabled="disabled"
										class="ml-btn"
										type="primary"
										@click="addCorrelationItem(index, key)"
										>添加关联</el-button
									>
								</span>
							</div>
							<el-button
								v-if="!disabled"
								type="primary"
								@click="addConditionItem(index)"
								>添加条件<i class="el-icon-plus el-icon--right"></i
							></el-button>
						</div>
					</div>
				</div>
			</div>
			<el-button :disabled="disabled" type="primary" @click="addConditionGroup"
				>添加条件组<i class="el-icon-plus el-icon--right"></i
			></el-button>
		</div>
		<!-- 条件配置 -->
		<ConditionConfig
			:visible.sync="conditionConfigDialog"
			:config="conditionConfig"
			@saveCallback="saveConditionConfig"
			:disabled="disabled"
		/>
		<!-- 添加关联 -->
		<AddCorrelation
			:visible.sync="selectCorrelationDialog"
			@saveCallback="saveCorrelation"
			:uoConditionItemCorrelationList.sync="uoConditionItemCorrelationList"
			:correlationTypeList="correlationTypeList"
			@close="closeAddCorrelation"
			:isCheckView.sync="isCheckView"
		/>
	</div>
</template>

<script>
import ConditionConfig from './ConditionConfig'
import AddCorrelation from './AddCorrelation'
import {
	CONDITION_STATUS,
	RELATION_OPTION,
	RELATION_TYPE,
	ATTRIBUTE_TYPE,
	CORRELATION_TYPE,
	DICT_OPTION,
} from './constants'
import {
	queryCorrelationTypeBatch,
	queryAttributeDictionariesBatch,
} from '@/api/uoOptionKey'
import moment from 'moment'

const CORRELATION_TYPE_TEXT = {
	[CORRELATION_TYPE.GOODS]: '商品',
	[CORRELATION_TYPE.BRANDS]: '档期',
	[CORRELATION_TYPE.LUBAN_ACTIVITY]: '鲁班页',
}

export default {
	name: 'ConditionEditor',
	components: {
		ConditionConfig,
		AddCorrelation,
	},
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
		uoConditionList: {
			Object,
			default: () => [],
		},
	},
	data() {
		return {
			RELATION_OPTION,
			CORRELATION_TYPE_TEXT,
			// 条件
			conditionConfigDialog: false,
			conditionConfig: {},
			conditionConfigIndex: undefined,
			editConditionIndex: undefined,
			// 关联
			selectCorrelationDialog: false,
			correlationIndex: undefined,
			editCorrelationIndex: undefined,
			uoConditionItemCorrelationList: [],
			// 关联的可选项
			correlationTypeList: [],
			// 字典值映射
			dictionaryMap: DICT_OPTION,
			// 是否为查看
			isCheckView: false,
		}
	},
	mounted() {
		this.getCorrelationTypeList()
	},
	methods: {
		// 添加条件组
		addConditionGroup() {
			this.uoConditionList.push({
				conditionType: RELATION_TYPE.OR,
				uoConditionItemList: [],
			})
		},

		// 删除条件组
		delConditionGroup(index) {
			this.uoConditionList.splice(index, 1)
		},

		// 添加条件
		addConditionItem(firstIndex) {
			this.conditionConfigDialog = true
			this.conditionConfigIndex = firstIndex
			this.conditionConfig = {}
			// 编辑
			this.editConditionIndex = undefined
		},

		// 编辑
		editConditionConfig(firstIndex, secondIndex, row) {
			this.conditionConfigDialog = true
			this.conditionConfigIndex = firstIndex
			this.conditionConfig = row
			// 编辑
			this.editConditionIndex = secondIndex
		},

		// 添加关联
		addCorrelationItem(firstIndex, secondIndex) {
			this.selectCorrelationDialog = true
			this.correlationIndex = firstIndex
			// 编辑
			this.editCorrelationIndex = secondIndex
			this.uoConditionItemCorrelationList = []
			this.correlationTypeList =
				this.uoConditionList[firstIndex].uoConditionItemList[
					secondIndex
				].correlationTypeList
		},

		// 保存关联
		saveCorrelation(val) {
			this.uoConditionList[this.correlationIndex].uoConditionItemList[
				this.editCorrelationIndex
			].uoConditionItemCorrelationList = val
			this.selectCorrelationDialog = false
			this.uoConditionList = JSON.parse(JSON.stringify(this.uoConditionList))
			this.$emit('change', this.uoConditionList)
		},
		// 关闭关联弹窗
		closeAddCorrelation() {
			this.selectCorrelationDialog = false
		},

		// 保存条件
		saveConditionConfig(val) {
			this.conditionConfigDialog = false
			if (this.editConditionIndex !== undefined) {
				// 属性id改变， 删除关联
				if (this.conditionConfig.uoAttributeId !== val.uoAttributeId) {
					val.uoConditionItemCorrelationList = []
				}

				this.uoConditionList[this.conditionConfigIndex].uoConditionItemList[
					this.editConditionIndex
				] = JSON.parse(JSON.stringify(val))
			} else {
				this.uoConditionList[
					this.conditionConfigIndex
				].uoConditionItemList.push({ ...val })
			}
			this.getCorrelationTypeList()
		},

		// 根据属性获取关联类型
		async getCorrelationTypeList() {
			const uoAttributeIds = this.uoConditionList
				.map((item) => {
					return item.uoConditionItemList.map((cItem) => {
						return cItem.uoAttributeId
					})
				})
				.flat()
			const duplicateList = [...new Set(uoAttributeIds)]
			if (duplicateList.length === 0) return
			const {
				data: { resultData },
			} = await queryCorrelationTypeBatch({
				uoAttributeIdList: duplicateList,
			})

			// 关联类型回显赋值
			this.uoConditionList.forEach((item) => {
				item.uoConditionItemList.forEach((cItem) => {
					const { uoAttributeId } = cItem
					// cItem.correlationTypeList = [0, 1, 2]
					if (resultData[uoAttributeId]) {
						cItem.correlationTypeList = resultData[uoAttributeId]
					} else {
						cItem.correlationTypeList = []
					}
				})
			})
			this.uoConditionList = JSON.parse(JSON.stringify(this.uoConditionList))
			this.$emit('change', this.uoConditionList)
		},

		// 根据属性获取字典值
		async getDictionaryList(uoAttributeId) {
			// 有缓存直接返回
			if (this.dictionaryMap[uoAttributeId]) {
				return this.dictionaryMap[uoAttributeId]
			}
			const {
				data: { resultCode, resultData },
			} = await queryAttributeDictionariesBatch({
				uoAttributeId,
			})
			if (resultCode === 0) {
				const dictList = resultData.map((item) => ({
					[item.uoOptionKeyId]: item.name,
				}))
				this.dictionaryMap = {
					...this.dictionaryMap,
					...dictList,
				}
			}
			return []
		},

		// 删除某条件
		delCorrelationItem(firstIndex, secondIndex) {
			this.uoConditionList[firstIndex].uoConditionItemList.splice(
				secondIndex,
				1
			)
			this.uoConditionList = JSON.parse(JSON.stringify(this.uoConditionList))
			this.$emit('change', this.uoConditionList)
		},

		// 删除关联
		delCorrelationList(firstIndex, secondIndex) {
			console.log('删除关联', firstIndex, secondIndex)
			this.uoConditionList[firstIndex].uoConditionItemList[
				secondIndex
			].uoConditionItemCorrelationList = []
			this.uoConditionList = JSON.parse(JSON.stringify(this.uoConditionList))
			this.$emit('change', this.uoConditionList)
		},

		// 查看关联内容
		checkCorrelation(firstIndex, secondIndex) {
			if (this.disabled) {
				this.selectCorrelationDialog = true
				this.correlationIndex = firstIndex
				// 编辑
				this.editCorrelationIndex = secondIndex
				this.uoConditionItemCorrelationList =
					this.uoConditionList[firstIndex].uoConditionItemList[
						secondIndex
					].uoConditionItemCorrelationList
				this.uoConditionList = JSON.parse(JSON.stringify(this.uoConditionList))

				// 是否为查看状态
				this.isCheckView = true
				this.$emit('change', this.uoConditionList)
			}
		},

		// 编辑关联
		editCorrelationList(firstIndex, secondIndex) {
			this.selectCorrelationDialog = true
			this.correlationIndex = firstIndex
			// 编辑
			this.editCorrelationIndex = secondIndex
			this.uoConditionItemCorrelationList =
				this.uoConditionList[firstIndex].uoConditionItemList[
					secondIndex
				].uoConditionItemCorrelationList
			this.uoConditionList = JSON.parse(JSON.stringify(this.uoConditionList))
			this.$emit('change', this.uoConditionList)
		},

		/**
     * @description 将条件字段转为中文
     * @param {Object} conditionItem 条件类型
     * 字段说明
      attributeType 属性类型：0：整数 ，1：小数，2：日期，3：字典'
      attributeValue 值选项：-1表示无值，日期：传时间戳， 1实习/2正式/3进阶/4优服/5签服
      classifyName 分类名称
      condition 判断条件：0等于/1大于/2大于等于/3小于/4小于等于/5不等于/6有值/7无值
      nameCode 名称编码
      uoAttributeClassifyId 分类id
      uoAttributeId 属性id
      uoAttributeName 属性名称
      uoConditionItemCorrelationList 关联列表
        correlationId 关联id 商品id/档期id/鲁班页id
        correlationType 关联类型;0：商品，1：档期，2：鲁班页
     */
		getComputedText(conditionItem) {
			let attributeValue = conditionItem.attributeValue || ''
			if (conditionItem.attributeType === ATTRIBUTE_TYPE.DATE) {
				attributeValue =
					(attributeValue &&
						moment(Number(attributeValue)).format('YYYY-MM-DD HH:mm:ss')) ||
					''
			}
			// this.getDictionaryList(conditionItem.uoAttributeId)
			if (conditionItem.attributeType === ATTRIBUTE_TYPE.DICT) {
				attributeValue = this.dictionaryMap[attributeValue]
			}
			return `${conditionItem.uoAttributeName} ${this.getConditionText(
				conditionItem.condition
			)} ${String(attributeValue || '')}`
		},
		// 获取条件文本
		getConditionText(condition) {
			switch (condition) {
				case CONDITION_STATUS.EQUAL:
					return '='
				case CONDITION_STATUS.GREATER:
					return '>'
				case CONDITION_STATUS.GREATER_EQUAL:
					return '>='
				case CONDITION_STATUS.LESS:
					return '<'
				case CONDITION_STATUS.LESS_EQUAL:
					return '<='
				case CONDITION_STATUS.NOT_EQUAL:
					return '!='
				case CONDITION_STATUS.HAS_VALUE:
					return '有值'
				case CONDITION_STATUS.NO_VALUE:
					return '无值'
				default:
					return ''
			}
		},
	},
}
</script>

<style>
.condition-type {
	display: block;
	width: 100%;
}
.condition-type-option {
	text-align: center;
}
.condition-type .el-input__inner {
	text-align: center;
}
.condition-item {
	border: solid 1px #ababab;
	border-radius: 10px;
	padding: 10px;
	margin: 10px 0;
	position: relative;
}

.condition-item .closeBtn {
	cursor: pointer;
	position: absolute;
	right: 20px;
	top: 20px;
	font-size: 20px;
}

.item {
	display: flex;
	align-items: center;
}

.connector {
	font-weight: bold;
	margin: 0 20px;
}

.correlation-number {
	cursor: pointer;
	margin-left: 5px;
}

.condition-item .el-icon-edit {
	cursor: pointer;
	color: #1890ff;
	font-size: 20px;
	margin: 0 10px;
}
.ml-btn {
	margin-left: 10px;
}
</style>

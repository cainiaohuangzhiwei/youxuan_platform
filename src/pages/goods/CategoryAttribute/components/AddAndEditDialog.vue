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
					:rules="rules"
					:labelWidth="'100px'"
					:formAction="searchAction"
				>
					<template #goodsCategoryName>
						<el-cascader
							:disabled="itemInfo.type === 'check' || itemInfo.type === 'edit'"
							v-model="searchData.goodsCategoryName"
							:options="newOptions"
							@change="handleChange"
							:props="defaultProps"
							ref="cascader"
							placeholder="请选择类目名称"
						></el-cascader>
					</template>
					<template #attributeName>
						<el-select
							v-model="searchData.attributeName"
							filterable
							remote
							reserve-keyword
							placeholder="请输入属性名称搜索"
							:remote-method="_listBasicsAttribute"
							:loading="listLoading"
							style="width: 100%"
							@focus="_listBasicsAttribute(e, 'focusAction')"
							@change="handleBrandName"
							:disabled="itemInfo.type === 'check' || itemInfo.type === 'edit'"
						>
							<el-option
								v-for="item in basicsAttributeList"
								:key="item.goodsBasicsAttributeId"
								:label="item.attributeName"
								:value="item.goodsBasicsAttributeId"
							>
							</el-option>
						</el-select>
						<!-- <el-autocomplete
							v-model="searchData.attributeName"
							debounce="500"
							placeholder="请选择属性名称"
							value-key="attributeName"
							label="attributeName"
							maxlength="30"
							:fetch-suggestions="_listBasicsAttribute"
							@select="handleBrandName"
							@blur="blurHandleBrandName"
							:disabled="itemInfo.type === 'check' || itemInfo.type === 'edit'"
						>
						</el-autocomplete> -->
					</template>

					<template #goodsBasicsAttributeItemIds>
						<div v-if="itemInfo.type === 'check'">
							<span
								class="span-item"
								v-for="item in goodsBasicsAttributeItems"
								:key="item.goodsBasicsAttributeItemId"
								>{{ item.attributeItemValue }}</span
							>
						</div>
						<div v-else>
							<el-checkbox-group
								v-model="searchData.goodsBasicsAttributeItemIds"
								@change="handleCheckedNodesChange"
							>
								<el-checkbox
									v-for="item in goodsBasicsAttributeItems"
									:label="item.goodsBasicsAttributeItemId"
									:key="item.goodsBasicsAttributeItemId"
									>{{ item.attributeItemValue }}</el-checkbox
								>
							</el-checkbox-group>
						</div>
					</template>
				</yx-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'

import {
	listBasicsAttribute,
	getBasicsAttribute,
} from '@/api/yhtPlusCmsGoodsBasicsAttribute'
import {
	saveCategoryAttribute,
	updateCategoryAttribute,
	getCategoryAttributeInfo,
} from '@/api/yhtPlusCmsGoodsCategoryAttribute'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		options: {
			type: Object,
			default: () => ({}),
		},
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm,
	},

	data() {
		return {
			listLoading: false,
			basicsAttributeList: [],
			newOptions: [],
			defaultProps: {
				children: 'goodsCategoryChildList',
				label: 'goodsCategoryName',
				value: 'goodsCategoryId',
			},
			goodsBasicsAttributeItems: [],
			item: [
				{
					type: 'custom',
					title: '类目名称',
					dataIndex: 'goodsCategoryName',
				},
				{
					type: 'custom',
					title: '属性名称',
					dataIndex: 'attributeName',
				},
				{
					title: '属性ID',
					dataIndex: 'goodsBasicsAttributeId',
					disabled: true,
					hide: true,
				},
				{
					title: '属性别称',
					dataIndex: 'attributeAnotherName',
					placeholder: '请输入属性别称',
					maxlength: 30,
				},
				{
					type: 'select',
					title: '是否必填',
					dataIndex: 'requiredType',
					placeholder: '请选择是否可必填',
					label: 'value',
					options: this.$store.state.app.constant
						.CATEGORY_ATTRIBUTE_REQUIRED_TYPE,
				},
				{
					type: 'select',
					title: '是否可多选',
					dataIndex: 'multipleType',
					placeholder: '请选择是否可多选',
					label: 'value',
					options: this.$store.state.app.constant
						.CATEGORY_ATTRIBUTE_MULTIPLE_TYPE,
				},
				{
					type: 'custom',
					hide: true,
					title: '属性值',
					dataIndex: 'goodsBasicsAttributeItemIds',
				},
			],
			searchData: {
				goodsCategoryName: '',
				goodsCategoryId: '',
				attributeName: '',
				goodsBasicsAttributeId: '',
				attributeAnotherName: '',
				requiredType: '',
				multipleType: '',
				goodsBasicsAttributeItemIds: [],
			},
			rules: {
				goodsCategoryName: [
					{ required: true, message: '请输入类目名称', trigger: 'blur' },
				],
				attributeName: [
					{ required: true, message: '请输入属性名称', trigger: 'blur' },
				],
				goodsBasicsAttributeId: [
					{ required: true, message: '请输入属性ID', trigger: 'blur' },
				],
				// attributeAnotherName: [
				// 	{ required: true, message: '请输入属性别名', trigger: 'blur' },
				// ],
				requiredType: [
					{ required: true, message: '请选择是否可必填', trigger: 'blur' },
				],
				multipleType: [
					{ required: true, message: '请选择是否可多选', trigger: 'blur' },
				],
				goodsBasicsAttributeItemIds: [
					{ required: true, message: '请选择属性值', trigger: 'blur' },
				],
			},
			loading: false,
			searchAction: [
				{
					hide: false,
					title: '保存',
					type: 'primary',
					click: () => {
						this.submitForm()
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
	methods: {
		handleCheckedNodesChange(value) {
			this.searchData.goodsBasicsAttributeItemIds = value
		},
		handleChange(e) {
			if (e) this.searchData.goodsCategoryId = e[2]
		},
		async getBasics(goodsBasicsAttributeId, items) {
			this.loading = true
			const {
				data: {
					resultCode,
					resultData: { goodsBasicsAttributeItems = [] },
				},
			} = await getBasicsAttribute({
				goodsBasicsAttributeId: goodsBasicsAttributeId,
			})
			this.loading = false
			if (resultCode == 0) {
				//根据返回的列表，重新选中
				if (items && items.length > 0) {
					items.forEach((e) => {
						goodsBasicsAttributeItems.forEach((_e) => {
							if (
								e.goodsBasicsAttributeItemId === _e.goodsBasicsAttributeItemId
							) {
								this.searchData.goodsBasicsAttributeItemIds.push(
									e.goodsBasicsAttributeItemId
								)
							}
						})
					})
				}
				this.goodsBasicsAttributeItems = goodsBasicsAttributeItems
			} else {
				this.goodsBasicsAttributeItems = []
			}
		},
		handleBrandName(e) {
			this.item[6].hide = false
			this.item[2].hide = false
			this.searchData.goodsBasicsAttributeId = e
			this.searchData.goodsBasicsAttributeItemIds = []
			this.getBasics(e)
			this.$refs.form.$refs.YxForm.clearValidate('attributeName')
		},
		// 获取基础属性列表
		async _listBasicsAttribute(queryString, type) {
			const paramJson = {
				startIndex: 0,
				length: 20,
				attributeName: queryString,
			}
			if (type === 'focusAction' && this.basicsAttributeList.length > 0) {
				return
			}
			this.listLoading = true
			const {
				data: { resultCode, resultData },
			} = await listBasicsAttribute(paramJson)
			this.listLoading = false
			if (resultCode == 0) {
				this.basicsAttributeList = resultData.records || []
			}
		},
		// 获取属性值

		// 初始化
		init() {
			let options = JSON.parse(JSON.stringify(this.options))
			options.splice(0, 1)
			this.newOptions = this.mapAll(options, this.itemInfo.goodsCategoryId)

			if (this.itemInfo.goodsCategoryAttributeId) {
				this.item[6].hide = false
				this.item[2].hide = false
				this.getCategoryAttributeInfo()
				if (this.itemInfo.type === 'check') {
					this.searchAction[0].hide = true
					this.item.forEach((item) => {
						item.disabled = true
					})
				}
			}
		},
		//获取详情数据
		async getCategoryAttributeInfo() {
			this.loading = true
			const {
				data: { resultCode, resultData = {} },
			} = await getCategoryAttributeInfo({
				goodsCategoryAttributeId: this.itemInfo.goodsCategoryAttributeId,
			})
			this.loading = false
			if (resultCode == 0) {
				let goodsCategoryName = resultData.goodsCategoryList.map((item) => {
					return item.goodsCategoryId
				})
				this.searchData = {
					goodsCategoryName: goodsCategoryName,
					goodsCategoryId: resultData.goodsCategoryId,
					attributeName: resultData.attributeName,
					goodsBasicsAttributeId: resultData.goodsBasicsAttributeId,
					attributeAnotherName: resultData.attributeAnotherName,
					requiredType: resultData.requiredType,
					multipleType: resultData.multipleType,
					goodsBasicsAttributeItemIds: [],
				}
				//获取选中属性值
				if (this.itemInfo.type === 'check') {
					this.goodsBasicsAttributeItems =
						resultData.goodsCategoryAttributeItems || []
				} else {
					this.getBasics(
						resultData.goodsBasicsAttributeId,
						resultData.goodsCategoryAttributeItems
					)
				}
			}
		},
		//数据过滤，三级后去掉子级，可以选中
		mapAll(options) {
			return options.map((item) => {
				//最高三级，清除第三级后面的数组，组件就可以选中
				if (item.goodsCategoryLevel === 3) {
					item.goodsCategoryChildList = null
				}
				if (
					item.goodsCategoryChildList &&
					item.goodsCategoryChildList.length > 0
				) {
					this.mapAll(item.goodsCategoryChildList)
				}
				return item
			})
		},

		// 关闭弹窗
		resetForm() {
			this.searchData = {
				goodsCategoryName: '',
				goodsCategoryId: '',
				attributeName: '',
				goodsBasicsAttributeId: '',
				attributeAnotherName: '',
				requiredType: '',
				multipleType: '',
				goodsBasicsAttributeItemIds: [],
			}
			this.basicsAttributeList = []
			this.searchAction[0].hide = false
			this.item[6].hide = true
			this.item[2].hide = true
			this.item.forEach((item) => {
				if (item.dataIndex !== 'goodsBasicsAttributeId') {
					item.disabled = false
				}
			})
			// 清空选中的节点
			this.$refs.cascader.$refs.panel.clearCheckedNodes()
			// 设置为空可以让节点不高亮显示
			this.$refs.cascader.$refs.panel.activePath = []
			this.$refs.form.$refs.YxForm.clearValidate()
			this.goodsBasicsAttributeItems = []
			this.localVisible = false
		},

		// 保存
		async submitForm() {
			this.loading = true

			if (this.itemInfo.goodsCategoryAttributeId) {
				const {
					data: { resultCode },
				} = await updateCategoryAttribute({
					goodsCategoryAttributeId: this.itemInfo.goodsCategoryAttributeId,
					attributeAnotherName:
						this.searchData.attributeAnotherName ||
						this.searchData.attributeName,
					multipleType: this.searchData.multipleType,
					requiredType: this.searchData.requiredType,
					goodsBasicsAttributeItemIds: this.searchData
						.goodsBasicsAttributeItemIds,
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
				//如果没有填别名，默认为属性名称
				if (!this.searchData.attributeAnotherName) {
					this.basicsAttributeList.forEach((item) => {
						if (
							item.goodsBasicsAttributeId ===
							this.searchData.goodsBasicsAttributeId
						) {
							this.searchData.attributeAnotherName = item.attributeName
						}
					})
				}
				const {
					data: { resultCode },
				} = await saveCategoryAttribute(this.searchData)
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
.span-item {
	margin-right: 5px;
}
</style>

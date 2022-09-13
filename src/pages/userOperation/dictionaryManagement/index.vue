<template>
	<div class="channelPage">
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<WgForm
				style="display: contents"
				:inline="true"
				:data="formData181"
				:items="formCfg181"
				:formAction="formAction181"
			>
			</WgForm>
			<el-tab-pane label="属性分类" name="one">
				<!-- S-------------属性分类-------------S -->

				<div class="goods-group-btnlist">
					<el-button
						v-auth="'uoAttributeClassifyQueryUoAttributeClassifyBatch'"
						style="float: right; margin-bottom: 20px"
						type="primary"
						@click="addChannel"
						>新建</el-button
					>
				</div>
				<yx-table
					:select="false"
					v-loading="loading"
					:columns="tableColumns103"
					:data="tableData103"
				>
				</yx-table>
				<el-pagination
					v-if="page103.count"
					style="margin: 30px 400px"
					:total="page103.count"
					:page-size="page103.length"
					:page-sizes="[5, 10, 20, 30, 40]"
					:current-page="page103.currentPage"
					layout="total, sizes, prev, pager, next, jumper"
					@current-change="nextPage"
					@size-change="handleSizeChange"
				/>
				<!-- E-------------属性分类-------------E -->
			</el-tab-pane>
			<el-tab-pane label="属性" name="two">
				<!-- S-------------属性-------------S -->
				<!-- <WgForm
					:inline="true"
					:data="formDataProperty"
					:items="formCfgProperty"
					:formAction="formActionProperty"
					:actionInline="true"
				>
				</WgForm> -->
				<div class="goods-group-btnlist">
					<el-button
						v-auth="'uoAttributeClassifyQueryUoAttributeClassifyBatch'"
						style="float: right; margin-bottom: 20px"
						type="primary"
						@click="addChannelProperty"
						>新建</el-button
					>
				</div>
				<yx-table
					:select="false"
					v-loading="loadingProperty"
					:columns="tableColumnsProperty"
					:data="tableDataProperty"
				>
				</yx-table>
				<el-pagination
					v-if="pageProperty.count"
					style="margin: 30px 400px"
					:total="pageProperty.count"
					:page-size="pageProperty.length"
					:page-sizes="[5, 10, 20, 30, 40]"
					:current-page="pageProperty.currentPage"
					layout="total, sizes, prev, pager, next, jumper"
					@current-change="nextPageProperty"
					@size-change="handleSizeChangeProperty"
				/>
				<!-- E-------------属性------------E -->
			</el-tab-pane>
		</el-tabs>

		<Dialog
			:title="dialogTitle104"
			:visible.sync="dialogVisible104"
			:width="dialogWidth104"
			:bottomBtn="dialogBottonBtn104"
		>
			<yx-form
				ref="formRef105"
				labelWidth="120px"
				:data="formData105"
				:items="formCfg105"
				:rules="formRules105"
				:formAction="formAction105"
			>
			</yx-form>
		</Dialog>
		<!-- 字典属性 -->
		<Dialog
			:title="dialogTitleProperty"
			:visible.sync="dialogVisibleProperty"
			width="600px"
			:bottomBtn="dialogBottonBtnProperty"
		>
			<WgForm
				ref="propertyef105"
				labelWidth="120px"
				:data="formDataAddProperty"
				:items="formCfgAddProperty"
				:rules="formRulesAddProperty"
				:formAction="formActionAddProperty"
			>
				<template slot="judgementCondition">
					<div v-html="formDataAddProperty.judgementCondition"></div>
				</template>
				<template slot="dictionaryOptions">
					<el-tag
						v-for="tag in tagsSelectDictionary"
						:key="tag.name"
						style="margin-right: 10px"
						closable
						:disable-transitions="false"
						@close="handleClose(tag)"
						:type="tag.type"
					>
						{{ tag.name }}
					</el-tag>
					<el-button
						style="margin-left: 20px"
						type="text"
						@click="selectDictionaryOptions"
						>选择字典选项</el-button
					>
				</template>
				<template slot="correlationType">
					<el-select
						:disabled="correlationTypeDisabled"
						v-model="correlationTypeOptionsValue"
						multiple
						placeholder="请选择"
					>
						<el-option
							v-for="item in correlationTypeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</template>
			</WgForm>
		</Dialog>
		<Dialog
			title="选择字典选项"
			:visible.sync="dictionaryOptionsDialog"
			:width="'800px'"
			:bottomBtn="dictionaryOptionsBottonBtn"
		>
			<div style="width: 300px; margin-bottom: 20px">
				<el-input
					placeholder="请输入名称"
					v-model="dictionariesNmae"
					class="input-with-select"
				>
					<el-button
						slot="append"
						icon="el-icon-search"
						@click="dictionariesList(true)"
					></el-button>
				</el-input>
			</div>
			<el-button
				v-auth="'uoAttributeClassifyQueryUoAttributeClassifyBatch'"
				type="primary"
				style="float: right; margin-bottom: 20px"
				@click="addDictionariesMethod"
				>新建</el-button
			>

			<yx-table
				:select="true"
				v-loading="dictionaryOptionsLoading"
				:columns="tableColumnsDictionaryOptions"
				:data="tableDataDictionaryOptions"
				:selectionChange="selectionChange"
				:pagination="pageDictionaryOptions"
			>
			</yx-table>
		</Dialog>
		<Dialog
			:title="dialogAddDictionariesTitle"
			:visible.sync="dialogAddDictionaries"
			width="500px"
			:bottomBtn="dialogAddDictionariesBottomBtn"
		>
			<yx-form
				ref="formRefAddDictionaries"
				labelWidth="120px"
				:data="formDataAddDictionaries"
				:items="formCfgAddDictionaries"
				:rules="formRulesAddDictionaries"
				:formAction="formActionAddDictionaries"
			>
			</yx-form>
		</Dialog>
	</div>
</template>
<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import WgForm from '@/components/WgForm'
import {
	queryUoAttributeClassifyBatch,
	queryVisibleUoAttributeClassifyBatch,
	saveUoAttributeClassify,
	saveUoAttribute,
	updateUoOptionKey,
	saveUoOptionKey,
	queryUoOptionKeyBatch,
	updateUoAttribute,
	updateVisibleStatus,
	queryUoAttributeBatch,
	updateAttributeClassifyVisibleType,
	updateUoAttributeClassify,
	getUoAttribute,
} from '@/api/uoOptionKey'

const DEFAULT_CONDITION_STRING = '等于/大于/大于等于/小于/小于等于/不等于'
const DICT_CONDITION_STRING = '等于/不等于'

export default {
	name: 'FamilyGroup',
	components: {
		YxForm,
		YxTable,
		Dialog,
		WgForm,
	},
	props: [],
	data() {
		return {
			activeName: 'one',
			id: null,
			loading: false,
			dialogVisible105: false,
			deleteRow: {},
			//S--------------属性分类----------S
			windowsShow: null,
			dialogWidth104: '600px',
			dialogVisible104: false,
			dialogBottonBtn104: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.formRef105.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveAddChannel()
							}
						})
					},
				},
			],
			formData181: {
				name: '',
				visibleType: '',
			},
			formCfg181: [
				{
					type: 'input',
					title: '名称：',
					dataIndex: 'name',
					placeholder: '模糊搜索',
				},
				{
					type: 'select',
					title: '状态',
					dataIndex: 'visibleType',
					label: 'value',
					options: [
						{
							visibleType: '',
							value: '全部',
						},
						{
							visibleType: '0',
							value: '不可见',
						},
						{
							visibleType: 1,
							value: '可见',
						},
					],
				},
			],
			formAction181: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (this.activeName == 'one') {
							this.getData103(true)
						} else {
							this.getDataProperty(true)
						}
					},
				},
				{
					title: '重置',
					isClear: true,
				},
			],
			tableData103: [],
			compileId: '',
			tableColumns103: [
				{
					type: 'string',
					dataIndex: 'uoAttributeClassifyId',
					title: 'ID',
				},
				{
					type: 'string',
					dataIndex: 'name',
					title: '名称',
				},
				{
					type: 'string',
					dataIndex: 'nameCode',
					title: '名称编码',
				},
				{
					type: 'string',
					dataIndex: 'sort',
					title: '排序',
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '编辑',
							auth: 'uoAttributeClassifyQueryUoAttributeClassifyBatch',
							click: (row) => {
								this.compileId = row.uoAttributeClassifyId
								this.formData105 = {
									name: row.name,
									nameCode: row.nameCode,
									sort: row.sort,
								}
								this.formCfg105.find(
									(item) => item.dataIndex === 'nameCode'
								).disabled = true
								this.dialogTitle104 = '编辑属性分类'
								this.dialogVisible104 = true
							},
						},
						{
							title: '可见',
							auth: 'uoAttributeClassifyQueryUoAttributeClassifyBatch',
							click: (row) => {
								let title =
									row.visibleType == 1
										? '此操作将设置不可见, 是否继续?'
										: '此操作将设置可见, 是否继续?'
								this.$confirm(title, '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning',
								})
									.then(() => {
										this._visible(row, 1)
									})
									.catch(() => {
										this.$message({
											type: 'info',
											message: '已取消',
										})
									})
							},
							customRender: (action, row) => {
								action.title = row.visibleType == 1 ? '不可见' : '可见'
								return action
							},
						},
					],
				},
			],
			page103: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData103()
				},
			},
			formRules105: {
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
				nameCode: [
					{ required: true, message: '请输入名称编码', trigger: 'blur' },
				],
				sort: [
					{
						required: true,
						validator: (_rule, value, callback) => {
							if (value > 99999 || value <= 0) {
								callback(new Error('排序值范围1~99999'))
							} else if (!value) {
								callback(new Error('请输入排序'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			formData105: {
				name: '',
				nameCode: '',
				sort: '',
			},
			formCfg105: [
				{
					type: 'input',
					title: '名称',
					dataIndex: 'name',
					placeholder: '请输入名称',
				},
				{
					type: 'input',
					title: '名称编码',
					dataIndex: 'nameCode',
					placeholder: '请输入名称编码',
				},
				{
					type: 'inputNumber',
					title: '排序',
					dataIndex: 'sort',
					placeholder: '请输入排序',
				},
			],
			formAction105: [],
			//E--------------属性分类----------E
			//S--------------属性----------S
			correlationTypeDisabled: false,
			dialogVisibleProperty: false,
			dialogTitleProperty: '新建属性',
			tableDataProperty: [],
			tableColumnsProperty: [
				{
					type: 'string',
					dataIndex: 'uoAttributeId',
					title: 'ID',
				},
				{
					type: 'string',
					dataIndex: 'uoAttributeClassifyName',
					title: '分类名',
				},
				{
					type: 'string',
					dataIndex: 'name',
					title: '名称',
				},
				{
					type: 'string',
					dataIndex: 'nameCode',
					title: '名称编码',
				},
				{
					type: 'string',
					dataIndex: 'sort',
					title: '排序',
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '编辑',
							auth: 'uoAttributeClassifyQueryUoAttributeClassifyBatch',
							click: (row) => {
								if (row.attributeType == 3) {
									this.formCfgAddProperty[0].disabled = false
								} else {
									this.formCfgAddProperty[0].disabled = true
								}
								this.correlationTypeDisabled = true
								this._getUoAttribute(row)
								this.uoAttributeId = row.uoAttributeId
								this.dialogTitleProperty = '编辑属性'
								this.dialogVisibleProperty = true
							},
						},
						{
							title: '可见',
							auth: 'uoAttributeClassifyQueryUoAttributeClassifyBatch',
							click: (row) => {
								let title =
									row.visibleType == 1
										? '此操作将设置不可见, 是否继续?'
										: '此操作将设置可见, 是否继续?'
								this.$confirm(title, '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning',
								})
									.then(() => {
										this._visible(row, 2)
									})
									.catch(() => {
										this.$message({
											type: 'info',
											message: '已取消',
										})
									})
							},
							customRender: (action, row) => {
								action.title = row.visibleType == 1 ? '不可见' : '可见'
								return action
							},
						},
					],
				},
			],
			uoAttributeId: null,
			pageProperty: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getDataProperty()
				},
			},
			formRulesAddProperty: {
				attributeTypes: [
					{ required: true, message: '请选择属性类型', trigger: 'blur' },
				],
				nameCode: [
					{ required: true, message: '请输入名称编码', trigger: 'blur' },
				],
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
				sort: [
					{
						required: true,
						validator: (_rule, value, callback) => {
							if (value > 99999 || value <= 0) {
								callback(new Error('排序值范围1~99999'))
							} else if (!value) {
								callback(new Error('请输入排序'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				uoAttributeClassifyId: [
					{ required: true, message: '请选择分类', trigger: 'blur' },
				],
				dictionaryOptions: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (
								this.formDataAddProperty.attributeTypes == 3 &&
								this.tagsSelectDictionary.length == 0
							) {
								callback(new Error('请选择字典选项'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			formDataAddProperty: {
				attributeTypes: 0,
				name: '',
				nameCode: '',
				sort: '',
				uoAttributeClassifyId: '',
				dictionaryOptions: '',
				judgementCondition: DEFAULT_CONDITION_STRING,
			},
			dialogBottonBtnProperty: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.propertyef105.$refs.WgForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveAddChannelProperty()
							}
						})
					},
				},
			],
			selectedList: [],
			tagsSelectDictionary: [],
			formCfgAddProperty: [
				{
					type: 'select',
					title: '属性类型',
					dataIndex: 'attributeTypes',
					label: 'value',
					options: [
						{
							attributeTypes: 0,
							value: '整数',
						},
						{
							attributeTypes: 1,
							value: '小数',
						},
						{
							attributeTypes: 2,
							value: '日期',
						},
						{
							attributeTypes: 3,
							value: '字典',
						},
					],
					change: () => {
						this.getChange()
					},
				},
				{
					type: 'input',
					title: '名称',
					dataIndex: 'name',
					placeholder: '请输入名称',
				},
				{
					type: 'input',
					title: '名称编码',
					dataIndex: 'nameCode',
					placeholder: '请输入名称编码',
				},
				{
					type: 'inputNumber',
					title: '排序',
					dataIndex: 'sort',
					placeholder: '请输入排序',
				},
				{
					type: 'generalSelect',
					title: '选择属性分类',
					multiple: false, //是否多选单选
					Url: queryVisibleUoAttributeClassifyBatch, //获取接口
					dataIndex: 'uoAttributeClassifyId',
					key: 'uoAttributeClassifyId',
					showName: 'name',
					inquire: 'name', //入参字段
					placeholder: '请选择属性分类', //提示语
					dataList: '', //获取数据下层
					change: (e) => {
						this.getChangeSelect(e)
					},
				},
				{
					type: 'custom',
					title: '判断条件',
					dataIndex: 'judgementCondition',
				},
				{
					type: 'custom',
					title: '字典选项',
					hide: true,
					dataIndex: 'dictionaryOptions',
				},
				{
					type: 'custom',
					title: '关联项',
					dataIndex: 'correlationType',
				},
			],
			compileUoAttributeClassifyId: null,
			correlationTypeOptionsValue: [],
			correlationTypeOptions: [
				{
					value: 0,
					label: '商品',
				},
				{
					value: 1,
					label: '档期',
				},
				{
					value: 2,
					label: '鲁班页',
				},
			],
			dialogAddDictionaries: false, //新建字典选项弹窗
			dialogAddDictionariesTitle: '新建字典选项',
			dialogAddDictionariesBottomBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.formRefAddDictionaries.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.getDialogAddDictionaries()
							}
						})
					},
				},
			], //新建字典选项弹窗确认按钮
			formRulesAddDictionaries: {
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
				nameCode: [
					{ required: true, message: '请输入名称编码', trigger: 'blur' },
				],
				dictionaryKey: [
					{ required: true, message: '请输入值', trigger: 'blur' },
				],
			}, //校验新建字典选项
			formDataAddDictionaries: {
				name: '',
				nameCode: '',
				dictionaryKey: '',
			},
			uoOptionKeyId: null,
			formCfgAddDictionaries: [
				{
					type: 'input',
					title: '名称',
					dataIndex: 'name',
					placeholder: '请输入名称',
				},
				{
					type: 'input',
					title: '名称编码',
					dataIndex: 'nameCode',
					placeholder: '请输入名称编码',
				},
				{
					type: 'input',
					title: '值',
					dataIndex: 'dictionaryKey',
					placeholder: '请输入值',
				},
			],
			dictionariesNmae: '', //查询选择字典选项
			dictionaryOptionsDialog: false, //选择字典选项弹窗
			dictionaryOptionsBottonBtn: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.saveDictionaryOptions()
					},
				},
			],
			tableDataDictionaryOptions: [], //选择字典选项列表
			tableColumnsDictionaryOptions: [
				{
					type: 'string',
					dataIndex: 'name',
					title: '名称',
				},
				{
					type: 'string',
					dataIndex: 'nameCode',
					title: '编码',
				},
				{
					type: 'string',
					dataIndex: 'dictionaryKey',
					title: '值',
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '编辑',
							auth: 'uoAttributeClassifyQueryUoAttributeClassifyBatch',
							click: (row) => {
								this.dialogAddDictionariesTitle = '编辑字典选项'
								this.dialogAddDictionaries = true
								this.uoOptionKeyId = row.uoOptionKeyId
								this.formDataAddDictionaries = {
									name: row.name,
									nameCode: row.nameCode,
									dictionaryKey: row.dictionaryKey,
								}
							},
						},
					],
				},
			],
			pageDictionaryOptions: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.dictionariesList()
				},
			},
			//E--------------属性----------E
		}
	},

	created() {
		this.getData103(true)
	},

	methods: {
		async _visible(row, v) {
			let paramJson = {
				visibleType: row.visibleType === 0 ? 1 : 0,
			}
			let Url = null
			if (v == 1) {
				paramJson.uoAttributeClassifyId = row.uoAttributeClassifyId
				Url = updateAttributeClassifyVisibleType
			} else {
				paramJson.uoAttributeId = row.uoAttributeId
				Url = updateVisibleStatus
			}
			const {
				data: { resultCode },
			} = await Url(paramJson)
			if (resultCode == 0) {
				this.$message({
					type: 'success',
					message: '成功!',
				})
				if (v == 1) {
					this.getData103()
				} else {
					this.getDataProperty()
				}
			}
		},

		getChange() {
			if (this.formDataAddProperty.attributeTypes == 3) {
				this.formCfgAddProperty[6].hide = false
				this.formDataAddProperty.judgementCondition = DICT_CONDITION_STRING
			} else {
				this.formCfgAddProperty[6].hide = true
				this.formDataAddProperty.judgementCondition = DEFAULT_CONDITION_STRING
			}
		},
		// tab切换
		handleClick(tab) {
			this.formData181 = {
				name: '',
				visibleType: '',
			}
			if (tab.name == 'one') {
				this.getData103(true)
			} else {
				this.getDataProperty(true)
			}
		},
		//S------------属性分类------------S
		addChannel() {
			this.windowsShow = 1
			this.formData105 = {
				name: '',
				nameCode: '',
				sort: '',
			}
			this.dialogTitle104 = '新建属性分类'
			this.dialogVisible104 = true
			this.formCfg105.find(
				(item) => item.dataIndex === 'nameCode'
			).disabled = false
			this.compileId = ''
		},
		getChangeSelect() {
			this.compileUoAttributeClassifyId = null
		},
		async _getUoAttribute(row) {
			const {
				data: { resultCode, resultData },
			} = await getUoAttribute({ uoAttributeId: row.uoAttributeId })
			if (resultCode == 0) {
				this.formDataAddProperty = Object.assign({}, resultData)
				this.compileUoAttributeClassifyId = resultData.uoAttributeClassifyId
				this.formDataAddProperty.uoAttributeClassifyId =
					resultData.uoAttributeClassifyName
				this.formDataAddProperty.attributeTypes = resultData.attributeType
				this.formCfgAddProperty[6].hide = resultData.attributeType != 3
				this.tagsSelectDictionary = resultData.optionKeyBOList
				this.correlationTypeOptionsValue = resultData.correlationTypeList

				this.formDataAddProperty.judgementCondition =
					resultData.attributeType == 3
						? DICT_CONDITION_STRING
						: DEFAULT_CONDITION_STRING
			}
		},
		handleSizeChange(val) {
			this.page103.length = val
			this.getData103()
		},

		nextPage(val) {
			this.page103.currentPage = val
			this.getData103()
		},
		async getData103(flag) {
			this.loading = true
			let paramJson = this.findSearchParams103(flag)
			const {
				data: { resultCode, resultData, total },
			} = await queryUoAttributeClassifyBatch(paramJson)
			if (resultCode == 0) {
				this.tableData103 = resultData
				this.page103.count = total
			} else {
				this.tableData103 = []
				this.page103.count = 0
			}
			this.loading = false
		},
		findSearchParams103(flag) {
			//搜索条件
			const paramJson = Object.assign(this.formData181, {
				pageNum: 1,
				pageSize: 10,
			})
			// 每页的加载数据长度
			paramJson.pageSize = this.page103.length
			// 当前页的条数开始
			if (flag) {
				this.page103.currentPage = 1
			}
			paramJson.pageNum = this.page103.currentPage
			return { ...paramJson }
		},
		//E------------属性分类------------E
		addDictionariesMethod() {
			this.dialogAddDictionariesTitle = '新建字典选项'
			this.dialogAddDictionaries = true
			this.uoOptionKeyId = null
			this.formDataAddDictionaries = {
				name: '',
				code: '',
				value: '',
			}
		},
		base10(str) {
			//直接输出的方法
			//return str.split('').reverse().reduce((sum,e,i) => sum += e*Math.pow(2,i),0);
			//转化为数组，然后遍历计算的方法
			let num10 = 0
			let arr = str.split(',')
			let len = arr.length
			for (let i = 0; i < len; i++) {
				num10 += arr[i] * Math.pow(2, len - i - 1)
			}
			return num10
		},
		async saveAddChannelProperty() {
			console.log(
				'==========',
				this.formDataAddProperty,
				this.tagsSelectDictionary,
				this.correlationTypeOptionsValue
			)
			const paramJson = {
				updateUserId: this.$store.state.user.userInfo.userId,
				addUserId: this.$store.state.user.userInfo.userId,
				attributeType: this.formDataAddProperty.attributeTypes,
				correlationTypeList: this.correlationTypeOptionsValue,
				name: this.formDataAddProperty.name,
				nameCode: this.formDataAddProperty.nameCode,
				sort: this.formDataAddProperty.sort,
				uoAttributeClassifyId: this.formDataAddProperty.uoAttributeClassifyId,
				conditionList:
					this.formDataAddProperty.attributeTypes == 3
						? [0, 5, 6, 7]
						: [0, 1, 2, 3, 4, 5, 6, 7],
			}
			if (this.formDataAddProperty.attributeTypes == 3) {
				paramJson.dictionaryList = this.tagsSelectDictionary.map((item) => {
					return item.uoOptionKeyId
				})
			}
			let Url = saveUoAttribute
			if (this.uoAttributeId) {
				paramJson.uoAttributeClassifyId = this.compileUoAttributeClassifyId
					? this.compileUoAttributeClassifyId
					: this.formDataAddProperty.uoAttributeClassifyId
				paramJson.uoAttributeId = this.uoAttributeId
				Url = updateUoAttribute
			}
			// return
			const {
				data: { resultCode },
			} = await Url(paramJson)
			if (resultCode == 0) {
				this.$message({
					type: 'success',
					message: '成功!',
				})
				this.getDataProperty()
				this.dialogVisibleProperty = false
			}
		},
		handleClose(tag) {
			this.tagsSelectDictionary.splice(
				this.tagsSelectDictionary.indexOf(tag),
				1
			)
		},
		saveDictionaryOptions() {
			if (this.selectedList.length == 0) {
				this.$message({
					type: 'info',
					message: '请勾选字典选项',
				})
			} else {
				this.tagsSelectDictionary = this.selectedList
				this.dictionaryOptionsDialog = false
			}
			console.log('1111111', this.selectedList)
		},
		selectionChange(list) {
			this.selectedList = list
		},
		selectDictionaryOptions() {
			this.dictionaryOptionsDialog = true
			this.dictionariesList(true)
		},
		getDialogAddDictionaries: async function () {
			let param = this.formDataAddDictionaries
			param.addUserId = this.$store.state.user.userInfo.userId
			let Url = this.uoOptionKeyId ? updateUoOptionKey : saveUoOptionKey
			if (this.uoOptionKeyId) {
				param.uoOptionKeyId = this.uoOptionKeyId
				param.updateUserId = this.$store.state.user.userInfo.userId
			}
			const {
				data: { resultCode },
			} = await Url(this.formDataAddDictionaries)
			if (resultCode == 0) {
				this.$message({
					type: 'success',
					message: '成功!',
				})
				this.dialogAddDictionaries = false
				this.dictionariesList(true)
			}
		},

		findSearchParamsDictionaries(flag) {
			//搜索条件
			const paramJson = Object.assign({}, this.formData181, {
				pageNum: 1,
				pageSize: 10,
			})
			// 每页的加载数据长度
			paramJson.pageSize = this.pageDictionaryOptions.length
			// 当前页的条数开始
			if (flag) {
				this.pageDictionaryOptions.currentPage = 1
			}
			paramJson.pageNum = this.pageDictionaryOptions.currentPage
			return paramJson
		},
		dictionariesList: async function (flag) {
			this.loadingProperty = true
			const paramJson = this.findSearchParamsDictionaries(flag)
			paramJson.shopCategory = 2
			paramJson.name = this.dictionariesNmae
			const {
				data: { resultCode, resultData, total },
			} = await queryUoOptionKeyBatch(paramJson)
			if (resultCode == 0) {
				this.tableDataDictionaryOptions = resultData
				this.pageDictionaryOptions.count = total
			} else {
				this.tableDataDictionaryOptions = []
				this.pageDictionaryOptions.count = 0
			}
			this.loadingProperty = false
		},
		addChannelProperty() {
			this.uoAttributeId = ''
			this.dialogTitleProperty = '新建属性'
			this.close()
			this.correlationTypeDisabled = false
			this.dialogVisibleProperty = true
		},
		close() {
			this.formCfgAddProperty[0].disabled = false
			this.formCfgAddProperty[6].hide = true
			this.formDataAddProperty = {
				attributeTypes: 0,
				name: '',
				nameCode: '',
				sort: '',
				uoAttributeClassifyId: '',
				dictionaryOptions: '',
				judgementCondition: DEFAULT_CONDITION_STRING,
			}
			this.correlationTypeOptionsValue = []
			this.tagsSelectDictionary = []
		},
		handleSizeChangeProperty(val) {
			this.pageProperty.length = val
			this.getDataProperty()
		},

		nextPageProperty(val) {
			this.pageProperty.currentPage = val
			this.getDataProperty()
		},
		saveAddChannel: async function () {
			let paramJson = this.formData105
			if (this.compileId) {
				paramJson.uoAttributeClassifyId = this.compileId
				paramJson.updateUserId = this.$store.state.user.userInfo.userId
			}
			let Url = this.compileId
				? updateUoAttributeClassify
				: saveUoAttributeClassify
			let flag = false
			let {
				data: { resultCode, resultMsg },
			} = await Url(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible104 = false
				this.getData103(flag)
			}
		},

		findSearchParamsProperty(flag) {
			//搜索条件
			let paramJson = Object.assign(this.formData181, {
				pageNum: 1,
				pageSize: 10,
			})
			// 每页的加载数据长度
			paramJson.pageSize = this.pageProperty.length
			// 当前页的条数开始
			if (flag) {
				this.pageProperty.currentPage = 1
			}
			paramJson.pageNum = this.pageProperty.currentPage
			return paramJson
		},
		async getDataProperty(flag) {
			this.loadingProperty = true
			let paramJson = this.findSearchParamsProperty(flag)
			const {
				data: { resultCode, resultData, total },
			} = await queryUoAttributeBatch(paramJson)
			if (resultCode == 0) {
				this.tableDataProperty = resultData
				this.pageProperty.count = total
			} else {
				this.tableDataProperty = []
				this.pageProperty.count = 0
			}
			this.loadingProperty = false
		},
	},
}
</script>
<style lang="scss" scope>
.goods-group-btnlist {
	margin-bottom: 20px;
}
</style>

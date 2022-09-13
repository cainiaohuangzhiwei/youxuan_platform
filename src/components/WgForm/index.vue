<template>
	<el-form
		class="wg-form"
		ref="WgForm"
		:inline="inline"
		:label-width="labelWidth"
		:model="data"
		size="small"
		:rules="rules"
		:label-position="labelPosition"
		:disabled="formDisabled"
		@submit.native.prevent
	>
		<el-row :gutter="!inline ? 20 : 0">
			<template v-for="(item, index) in items">
				<template v-if="item.type === 'custom' && item.unformItem">
					<slot :name="item.dataIndex" :data="data" />
				</template>
				<el-col v-if="item.type === 'br'" span="24" :key="index"></el-col>
				<el-col
					v-if="!item.hide && !item.unformItem && item.type !== 'br'"
					:key="index"
					:span="
						item.colSpan
							? item.colSpan
							: !inline
							? 24
							: index % 3 < 3 &&
							  (item.type === 'input' ||
									item.type === 'inputText' ||
									item.type === 'inputNumber' ||
									item.type === 'inputPassword' ||
									item.type === 'textarea' ||
									item.type === 'select')
							? 6
							: 24
					"
				>
					<el-form-item
						:key="index"
						:label="item.title"
						:label-width="item.labelWidth"
						:prop="getDataIndex(item, index)"
						:class="item.class"
					>
						<template v-if="item.customLabel">
							<slot slot="label">
								<div class="custom_label" v-html="item.customLabel" />
							</slot>
						</template>
						<!-- text输入框 -->
						<el-input
							v-if="
								!item.type || item.type === 'input' || item.type === 'inputText'
							"
							v-model="data[item.dataIndex]"
							:disabled="item.disabled"
							:maxlength="item.maxlength"
							:placeholder="item.placeholder || '请输入' + item.title"
							@change="item.change && item.change(data[item.dataIndex])"
							@keyup.enter.native="
								!item.change && item.enter && item.enter(data[item.dataIndex])
							"
							suffix-icon="xxxx"
						/>
						<!-- number输入框 -->
						<el-input
							v-else-if="item.type === 'inputNumber'"
							v-model="data[item.dataIndex]"
							:disabled="item.disabled"
							type="number"
							:maxlength="item.maxlength"
							:placeholder="item.placeholder || '请输入' + item.title"
							@change="item.change && item.change(data[item.dataIndex])"
							@keyup.enter.native="
								!item.change && item.enter && item.enter(data[item.dataIndex])
							"
							suffix-icon="xxxx"
						/>
						<!-- password输入框 -->
						<el-input
							v-else-if="item.type === 'inputPassword'"
							v-model="data[item.dataIndex]"
							auto-complete="new-password"
							:disabled="item.disabled"
							type="password"
							:maxlength="item.maxlength"
							:placeholder="item.placeholder || '请输入' + item.title"
							@change="item.change && item.change(data[item.dataIndex])"
							suffix-icon="xxxx"
						/>
						<!-- 文本域 -->
						<el-input
							v-else-if="item.type === 'textarea'"
							v-model="data[item.dataIndex]"
							type="textarea"
							:disabled="item.disabled"
							:placeholder="item.placeholder || '请输入' + item.title"
							:maxlength="item.maxlength"
							:show-word-limit="item.maxlength ? true : false"
							:autosize="
								item.autosize ? item.autosize : { minRows: 2, maxRows: 4 }
							"
							@change="item.change && item.change(data[item.dataIndex])"
						/>
						<!-- 下拉框 -->
						<el-select
							v-else-if="item.type === 'select'"
							v-model="data[item.dataIndex]"
							:filterable="
								item.selectAttributes && item.selectAttributes.filterable
									? item.selectAttributes.filterable
									: false
							"
							:filter-method="
								item.selectAttributes && item.selectAttributes.filterMmethod
							"
							:disabled="item.disabled"
							:placeholder="item.placeholder || '请选择' + item.title"
							@change="item.change && item.change(data[item.dataIndex])"
						>
							<el-option
								v-for="op in item.options"
								:key="op[item.dataIndex]"
								:label="item.label ? op[item.label] : op[item.dataIndex]"
								:value="op[item.dataIndex]"
							/>
						</el-select>
						<el-select
							v-else-if="item.type === 'selectMap'"
							v-model="data[item.dataIndex]"
							style="width: 100%"
							:filterable="
								item.selectAttributes && item.selectAttributes.filterable
									? item.selectAttributes.filterable
									: false
							"
							:filter-method="
								item.selectAttributes && item.selectAttributes.filterMmethod
							"
							:disabled="item.disabled"
							:placeholder="item.placeholder || '请选择' + item.title"
							@change="item.change && item.change(data[item.dataIndex])"
						>
							<el-option
								v-for="op in optionsMap(item)"
								:key="op.value"
								:label="op.label"
								:value="op.value"
							/>
						</el-select>
						<!-- 下拉选择 -->
						<el-select
							v-else-if="item.type === 'generalSelect'"
							v-model="data[item.dataIndex]"
							:multiple="item.multiple"
							filterable
							remote
							clearable
							@focus="generalSelectPort"
							:placeholder="item.placeholder"
							:remote-method="generalSelectPort"
							@change="item.change && item.change(data[item.dataIndex])"
							><i class="el-icon-search el-input__icon" slot="prefix"> </i>
							<el-option
								v-for="ite in formDataList"
								:key="ite[item.dataIndex]"
								:label="
									item.showName ? ite[item.showName] : ite[item.dataIndex]
								"
								:value="ite[item.dataIndex]"
							>
							</el-option>
						</el-select>
						<!-- 单选 -->
						<el-radio-group
							v-else-if="item.type === 'radioMap'"
							v-model="data[item.dataIndex]"
							:disabled="item.disabled"
							@change="item.change && item.change(data[item.dataIndex])"
						>
							<el-radio
								v-for="ra in optionsMap(item)"
								:key="ra.value"
								:label="ra.value"
								:disabled="ra.disabled"
							>
								{{ ra.label }}
							</el-radio>
						</el-radio-group>
						<el-radio-group
							v-else-if="item.type === 'radio'"
							v-model="data[item.dataIndex]"
							:disabled="item.disabled"
							@change="item.change && item.change(data[item.dataIndex])"
						>
							<el-radio
								v-for="ra in item.options"
								:key="ra[item.dataIndex]"
								:label="ra[item.dataIndex]"
								:disabled="ra.disabled"
							>
								{{ item.label ? ra[item.label] : ra[item.dataIndex] }}
							</el-radio>
						</el-radio-group>
						<!-- 单选按钮 -->
						<el-radio-group
							v-else-if="item.type === 'radioButton'"
							v-model="data[item.dataIndex]"
							:disabled="item.disabled"
							@change="item.change && item.change(data[item.dataIndex])"
						>
							<el-radio-button
								v-for="ra in item.options"
								:key="ra[item.dataIndex]"
								:label="ra[item.dataIndex]"
								:disabled="ra.disabled"
							>
								{{ item.label ? ra[item.label] : ra[item.dataIndex] }}
							</el-radio-button>
						</el-radio-group>
						<!-- 复选框 -->
						<el-checkbox-group
							v-else-if="item.type === 'checkboxMap'"
							v-model="data[item.dataIndex]"
							:disabled="item.disabled"
							@change="item.change && item.change(data[item.dataIndex])"
						>
							<el-checkbox
								v-for="ch in optionsMap(item)"
								:key="ch.value"
								:label="ch.value"
								:border="item.border"
								:disabled="ch.disabled"
							>
								{{ ch.label }}
							</el-checkbox>
						</el-checkbox-group>
						<el-checkbox-group
							v-else-if="item.type === 'checkbox'"
							v-model="data[item.dataIndex]"
							:disabled="item.disabled"
							@change="item.change && item.change(data[item.dataIndex])"
						>
							<el-checkbox
								v-for="ch in item.options"
								:key="ch[item.dataIndex]"
								:label="ch[item.dataIndex]"
								:border="item.border"
								:disabled="ch.disabled"
							>
								{{ item.label ? ch[item.label] : ch[item.dataIndex] }}
							</el-checkbox>
						</el-checkbox-group>
						<!-- 日期 -->
						<el-date-picker
							v-else-if="
								item.type === 'time' &&
								(!item.timeAttributes ||
									!item.timeAttributes.type ||
									item.timeAttributes.type == 'date')
							"
							v-model="data[item.dataIndex]"
							:disabled="item.disabled"
							@change="item.change && item.change(data[item.dataIndex])"
						/>
						<!-- 时间 -->
						<el-time-select
							v-else-if="
								item.type === 'time' &&
								item.timeAttributes &&
								item.timeAttributes.type == 'timeSelect'
							"
							v-model="data[item.dataIndex]"
							:picker-options="item.timeAttributes.pickerOptions || {}"
							:placeholder="item.placeholder || '请选择时间'"
							:disabled="item.disabled"
							@change="item.change && item.change(data[item.dataIndex])"
						/>
						<el-time-picker
							v-else-if="
								item.type === 'time' &&
								item.timeAttributes &&
								item.timeAttributes.type == 'timePicker'
							"
							v-model="data[item.dataIndex]"
							:picker-options="item.timeAttributes.pickerOptions || {}"
							:is-range="item.timeAttributes.isRange || false"
							:range-separator="item.timeAttributes.rangeSeparator || '-'"
							:start-placeholder="
								item.timeAttributes.startPlaceholder || '开始时间'
							"
							:end-placeholder="
								item.timeAttributes.endPlaceholder || '结束时间'
							"
							:placeholder="item.placeholder || '请选择时间'"
							:disabled="item.disabled"
							@change="item.change && item.change(data[item.dataIndex])"
						/>
						<!-- 日期时间 -->
						<el-date-picker
							v-else-if="
								item.type === 'time' &&
								item.timeAttributes &&
								item.timeAttributes.type == 'datetime'
							"
							v-model="data[item.dataIndex]"
							type="datetime"
							:placeholder="item.placeholder || '请选择时间'"
							:picker-options="item.timeAttributes.pickerOptions || {}"
							:disabled="item.disabled"
							@change="
								(datetimerangeValue) =>
									dateParseTimeChange(item, datetimerangeValue)
							"
						/>
						<el-date-picker
							v-else-if="
								item.type === 'time' &&
								item.timeAttributes &&
								item.timeAttributes.type == 'datetimerange'
							"
							v-model="data[item.dataIndex]"
							type="datetimerange"
							:picker-options="item.timeAttributes.pickerOptions || {}"
							:range-separator="item.timeAttributes.rangeSeparator || '-'"
							:start-placeholder="
								item.timeAttributes.startPlaceholder || '开始时间'
							"
							:end-placeholder="
								item.timeAttributes.endPlaceholder || '结束时间'
							"
							:placeholder="item.placeholder || '请选择时间'"
							:default-time="
								item.timeAttributes.defaultTime
									? item.timeAttributes.defaultTime
									: ['00:00:00', '23:59:59']
							"
							:disabled="item.disabled"
							@change="item.change && item.change(data[item.dataIndex])"
						/>
						<!-- 日期区间 -->
						<template v-else-if="item.type === 'datetimerange'">
							<el-row>
								<el-col :span="11">
									<el-form-item class="mr0" :prop="item.dataIndex[0]">
										<el-date-picker
											v-model="data[item.dataIndex[0]]"
											style="width: 100%"
											type="datetime"
											:placeholder="
												item.placeholder ? item.placeholder[0] : '开始时间'
											"
											:disabled="item.disabled"
											:clearable="item.clearable"
											:default-time="
												item.defaultTime1 ? item.defaultTime1 : '00:00:00'
											"
											@change="
												(datetimerangeValue) =>
													datetimerangeChange(item, datetimerangeValue, 0)
											"
										/>
									</el-form-item>
								</el-col>
								<el-col :span="2">
									<span class="wg_telephone_line">-</span>
								</el-col>
								<el-col :span="11">
									<el-form-item :prop="item.dataIndex[1]">
										<el-date-picker
											v-model="data[item.dataIndex[1]]"
											style="width: 100%"
											type="datetime"
											:placeholder="
												item.placeholder ? item.placeholder[1] : '结束时间'
											"
											:disabled="item.disabled"
											:clearable="item.clearable"
											:default-time="
												item.defaultTime2 ? item.defaultTime2 : '23:59:59'
											"
											@change="
												(datetimerangeValue) =>
													datetimerangeChange(item, datetimerangeValue, 1)
											"
										/>
									</el-form-item>
								</el-col>
							</el-row>
						</template>
						<!-- 文件上传 -->
						<template v-else-if="item.type === 'upload'">
							<el-upload
								:ref="item.dataIndex"
								:class="item.class"
								:accept="item.uploadAttributes.accept"
								:limit="item.uploadAttributes.limit"
								:file-list="
									item.uploadAttributes.fileList || data[item.dataIndex]
								"
								:auto-upload="isautoUpload(item)"
								:disabled="item.disabled"
								:before-upload="
									(files, fileList) => {
										beforeUpload(item, files, fileList)
									}
								"
								:on-remove="
									(files, fileList) => {
										onRemove(item, files, fileList)
									}
								"
								:on-change="
									(files, fileList) => {
										onChange(item, files, fileList)
									}
								"
								:on-exceed="
									(files, fileList) => {
										onExceed(item, files, fileList)
									}
								"
								:http-request="
									(file) => {
										item.uploadAttributes.httpRequest(file)
									}
								"
							>
								<el-button slot="trigger" class="mr20" icon="el-icon-plus">
									添加文件
								</el-button>
								<el-button
									v-if="!isautoUpload(item) && !item.uploadAttributes.showBtn"
									type="primary"
									@click="upExcelData(item.dataIndex)"
								>
									导入
								</el-button>
							</el-upload>
						</template>
						<!-- 图片上传 -->
						<template v-else-if="item.type === 'uploadImage'">
							<div
								v-for="(listItem, listIndex) in data[item.dataIndex]"
								:key="listIndex"
								class="wg_image_box"
							>
								<el-image
									fit="cover"
									class="wg_image_item"
									z-index="9999"
									:preview-src-list="[
										listItem[item.uploadAttributes.imageName],
									]"
									:src="listItem[item.uploadAttributes.imageName]"
								>
									<div slot="error" class="el-image__error">
										<i class="el-icon-picture-outline" />
									</div>
								</el-image>
								<el-checkbox
									v-if="item.uploadAttributes.isChange"
									@change="uploadImageChange(item, listItem, listIndex)"
									class="imageCheckbox"
									v-model="listItem.checked"
								></el-checkbox>
								<div class="wg_image_item_dlt" v-if="canItBeModified(item)">
									<span
										@click="deleteImage(item, listItem, listIndex)"
										v-if="!item.uploadAttributes.isEdit"
										>删除</span
									>
									<el-upload
										v-else
										:ref="item.dataIndex"
										class=""
										:multiple="1"
										:limit="1"
										:headers="item.uploadAttributes.uploadImageHead"
										:action="item.uploadAttributes.action"
										:disabled="item.disabled"
										:file-list="item.fileList"
										:accept="
											item.uploadAttributes.accept
												? item.uploadAttributes.accept
												: 'image/gif, image/jpeg, image/jpg, image/png'
										"
										:show-file-list="false"
										:before-upload="
											(file) => {
												replaceUpload(item, listIndex, file)
											}
										"
										:http-request="
											(file) => {
												item.uploadAttributes.httpRequest(file)
											}
										"
									>
										<div slot="trigger">更换</div>
									</el-upload>
								</div>
							</div>
							<el-upload
								v-if="
									data[item.dataIndex].length >= item.uploadAttributes.limit
										? false
										: true
								"
								:ref="item.dataIndex"
								class="wg_upload wg-vue-materials_drag"
								:multiple="item.uploadAttributes.limit > 1 ? true : false"
								:limit="item.uploadAttributes.limit"
								:headers="item.uploadAttributes.uploadImageHead"
								:action="item.uploadAttributes.action"
								:disabled="item.disabled"
								drag
								:accept="
									item.uploadAttributes.accept
										? item.uploadAttributes.accept
										: 'image/gif, image/jpeg, image/jpg, image/png'
								"
								:show-file-list="false"
								:before-upload="item.uploadAttributes.beforeAvatarUpload"
								:file-list="data[item.dataIndex]"
								:on-exceed="
									(files, fileList) => {
										handleExceed(item, files, fileList)
									}
								"
								:http-request="
									(file) => {
										item.uploadAttributes.httpRequest(file)
									}
								"
							>
								<div slot="trigger">
									新增图片相册<br />{{
										'(暂定最多' + item.uploadAttributes.limit + '张)'
									}}
								</div>
							</el-upload>
						</template>
						<!-- 图片上传 -->
						<template v-else-if="item.type === 'uploadImageDraggable'">
							<draggable
								v-model="data[item.dataIndex]"
								@update="
									(evt) => {
										imageUpdate(evt, item)
									}
								"
								:options="data.options ? data.options : { animation: 500 }"
							>
								<transition-group>
									<div
										v-for="(listItem, listIndex) in data[item.dataIndex]"
										:key="listIndex"
										class="wg_image_box"
									>
										<el-image
											fit="cover"
											class="wg_image_item"
											z-index="9999"
											:preview-src-list="[
												listItem[item.uploadAttributes.imageName],
											]"
											:src="listItem[item.uploadAttributes.imageName]"
										>
											<div slot="error" class="el-image__error">
												<i class="el-icon-picture-outline" />
											</div>
										</el-image>
										<el-checkbox
											v-if="item.uploadAttributes.isChange"
											@change="uploadImageChange(item, listItem, listIndex)"
											class="imageCheckbox"
											v-model="listItem.checked"
										></el-checkbox>
										<div class="wg_image_item_dlt" v-if="canItBeModified(item)">
											<span
												@click="deleteImage(item, listItem, listIndex)"
												v-if="!item.uploadAttributes.isEdit"
												>删除</span
											>
											<el-upload
												v-else
												:ref="item.dataIndex"
												class=""
												:multiple="1"
												:limit="1"
												:headers="item.uploadAttributes.uploadImageHead"
												:action="item.uploadAttributes.action"
												:disabled="item.disabled"
												:file-list="item.fileList"
												:accept="
													item.uploadAttributes.accept
														? item.uploadAttributes.accept
														: 'image/gif, image/jpeg, image/jpg, image/png'
												"
												:show-file-list="false"
												:before-upload="
													(file) => {
														replaceUpload(item, listIndex, file)
													}
												"
												:http-request="
													(file) => {
														item.uploadAttributes.httpRequest(file)
													}
												"
											>
												<div slot="trigger">更换</div>
											</el-upload>
										</div>
									</div>
								</transition-group>
							</draggable>
							<el-upload
								v-if="
									data[item.dataIndex].length >= item.uploadAttributes.limit
										? false
										: true
								"
								:ref="item.dataIndex"
								class="wg_upload wg-vue-materials_drag"
								drag
								:multiple="item.uploadAttributes.limit > 1 ? true : false"
								:limit="item.uploadAttributes.limit"
								:headers="item.uploadAttributes.uploadImageHead"
								:action="item.uploadAttributes.action"
								:disabled="item.disabled"
								:accept="
									item.uploadAttributes.accept
										? item.uploadAttributes.accept
										: 'image/gif, image/jpeg, image/jpg, image/png'
								"
								:show-file-list="false"
								:before-upload="item.uploadAttributes.beforeAvatarUpload"
								:file-list="data[item.dataIndex]"
								:on-exceed="
									(files, fileList) => {
										handleExceed(item, files, fileList)
									}
								"
								:http-request="
									(file) => {
										item.uploadAttributes.httpRequest(file)
									}
								"
							>
								<div slot="trigger">
									新增图片相册<br />{{
										'(暂定最多' + item.uploadAttributes.limit + '张)'
									}}
								</div>
							</el-upload>
						</template>
						<!-- 自定义插槽 -->
						<template v-else-if="item.type === 'custom'">
							<slot :name="item.dataIndex" :data="data" />
						</template>
						<!-- 文本 -->
						<template v-else-if="item.type === 'text'">
							<div v-html="data[item.dataIndex]"></div>
						</template>
					</el-form-item>
				</el-col>
			</template>
			<el-col v-if="formAction.length && !actionInline" :span="actionColSpan">
				<el-form-item>
					<template v-for="(action, index) in formAction">
						<el-button
							v-show="!getAtionFormatter(action).hide"
							:key="index"
							v-auth="getAtionFormatter(action).auth || ''"
							:type="action.type"
							@click="actionButtonClick($event, action)"
						>
							{{ getAtionFormatter(action).title }}
						</el-button>
					</template>
				</el-form-item>
			</el-col>
		</el-row>
		<!-- 按钮事件-换行 -->
		<el-row
			v-if="formAction.length && actionInline"
			type="flex"
			justify="space-between"
		>
			<el-col span="12">
				<el-form-item>
					<template v-for="(action, index) in formAction">
						<el-button
							v-if="action.align !== 'right'"
							v-show="!getAtionFormatter(action).hide"
							:key="index"
							v-auth="getAtionFormatter(action).auth || ''"
							:type="action.type"
							@click="actionButtonClick($event, action)"
						>
							{{ getAtionFormatter(action).title }}
						</el-button>
					</template>
				</el-form-item>
			</el-col>
			<el-col span="12">
				<el-row type="flex" justify="end">
					<el-form-item class="mr0">
						<template v-for="(action, index) in formAction">
							<el-button
								v-if="action.align === 'right'"
								v-show="!getAtionFormatter(action).hide"
								:key="index"
								v-auth="getAtionFormatter(action).auth || ''"
								:type="action.type"
								@click="actionButtonClick($event, action)"
							>
								{{ getAtionFormatter(action).title }}
							</el-button>
						</template>
					</el-form-item>
				</el-row>
			</el-col>
		</el-row>
	</el-form>
</template>

<script>
/**
 * @Description: 使用例子：
 * <div>
		<wg-form :inline="true"
      :data="searchData"
      :items="searchCfg"
      :formAction="searchAction"></wg-form>
	</div>
 * @property {string} labelWidth 文本宽度
 * @property {array} items 组件使用数据的配置
 * @property {boolean} inline 是否换行
 * @property {object} data 组件渲染所使用的数据
 * @property {array} rules 表单校验
 * @property {array} formAction 表单按钮
 * @property {string} labelPosition 表单文本对齐方式
 * @property {boolean} actionInline 表单按钮是否需要换行
 * @property {number} actionColSpan 表单按钮是否需要换行
 */
import draggable from 'vuedraggable'
export default {
	name: 'YxFrom',
	props: {
		// 分行, 参考element
		inline: {
			type: Boolean,
			default: false,
		},
		// 表单禁用
		formDisabled: {
			type: Boolean,
			default: false,
		},
		// 文本宽度, 参考element
		labelWidth: {
			type: String,
			default: '',
		},
		/**
		 *  表单配置, 参考element
		 *  valueMap(Array): [keyName, valueName]
		 */
		items: {
			type: Array,
			default: () => [],
		},
		// 表单数据, 要与items子项的prop对应
		data: {
			type: Object,
			default: () => {},
		},
		// 表单校验, 参考element
		rules: {
			type: Object,
			default: () => {},
		},
		/**
		 *  表单按钮
		 *  isClear(Boolean): 是否为清除表单
		 */
		formAction: {
			type: Array,
			default: () => [],
		},
		// 表单文本对齐方式, 参考element
		labelPosition: {
			type: String,
			default: 'left',
		},
		// 表单按钮是否需要换行
		actionInline: {
			type: Boolean,
			default: false,
		},
		// 表单按钮占位
		actionColSpan: {
			type: Number,
			default: 12,
		},
	},
	components: {
		draggable,
	},
	data() {
		return {
			dyData: {},
			// 搜索数据源
			formDataList: [],
		}
	},
	methods: {
		// 获取列表
		async generalSelectPort(query) {
			let portUrl = null
			let inquireName = ''
			let dataList = null
			//下拉查询类型
			this.items.map((item) => {
				if (item.type === 'generalSelect') {
					portUrl = item.Url
					inquireName = item.inquire
					dataList = item.dataList
				}
			})

			// if (query !== '') {
			const paramJson = {
				startIndex: 0,
				length: 20,
			}
			paramJson[inquireName] = typeof query === 'object' ? '' : query //入参查询字段
			const {
				data: { resultCode, resultData },
			} = await portUrl(paramJson)
			if (resultCode == 0) {
				this.formDataList = resultData[dataList] || resultData || []
				return
			}
			// }
			this.formDataList = []
		},
		imageUpdate(evt, item) {
			if (item.imageUpdate) {
				item.imageUpdate(evt)
			}
			this.$forceUpdate()
		},
		/**
		 * @Description:
		 * @param {String} str 时间字符串
		 * @param {Boolean} isEnd 是否是结束时间
		 * @return: 1秒后的时间戳
		 */
		dateParseTime(str, isEnd) {
			if (str === null || !str) {
				return ''
			}
			str = new Date(str).getTime()
			if (isEnd) {
				str += 999
			}
			return str
		},
		optionsMap(item) {
			const list = []
			for (const key in item.options) {
				list.push({
					label: key,
					value: item.options[key],
				})
			}
			return list
		},
		// 是否可以更改
		canItBeModified(item) {
			if (item.uploadAttributes.canNotBeModified) {
				return false
			}
			return true
		},
		// 图片勾选回调
		uploadImageChange(item, listItem, listIndex) {
			if (item.uploadAttributes.change) {
				item.uploadAttributes.change(listItem, listIndex)
			}
		},
		deleteImage(item, imageItem, index) {
			/** 删除商品图片 * */
			const self = this
			this.$confirm('确定删除此图片', '提示', {
				type: 'warning',
				callback(action) {
					if (action === 'confirm') {
						if (item.deleteImage) {
							item.deleteImage(self.data[item.dataIndex][index])
						}
						self.$delete(self.data[item.dataIndex], index)
						self.$forceUpdate()
					}
				},
			})
		},
		upExcelData(refName) {
			this.$refs[refName][0].submit()
		},
		replaceUpload(item, index) {
			this.$delete(this.data[item.dataIndex], index)
		},
		beforeUpload(item, files, fileList) {
			// 文件状态改变时
			if (item.uploadAttributes.beforeUpload) {
				item.uploadAttributes.beforeUpload(item, files, fileList)
			}
		},
		onRemove(item, files, fileList) {
			// 文件状态改变时
			if (item.uploadAttributes.onRemove) {
				item.uploadAttributes.onRemove(item, files, fileList)
			}
		},
		onChange(item, files, fileList) {
			// 文件状态改变时
			if (item.uploadAttributes.onChange) {
				item.uploadAttributes.onChange(item, files, fileList)
			}
		},
		onExceed(item, files, fileList) {
			// 文件超出个数限制时的钩子
			if (item.uploadAttributes.onExceed) {
				item.uploadAttributes.onExceed(item, files, fileList)
			} else {
				this.$message.warning({
					message: `最多只能上传${item.uploadAttributes.limit}个文件`,
				})
			}
		},
		handleExceed(item) {
			/** 文件超出回调 * */
			this.$message.warning({
				message: `最多只能上传${item.uploadAttributes.limit}张图片`,
			})
		},
		resetFields() {
			// 重置表单
			this.$refs.WgForm.resetFields()
		},
		clearValidate() {
			// 移除表单项的校验结果
			this.$refs.WgForm.clearValidate()
		},
		actionButtonClick(e, data) {
			/** 按钮点击事件 * */
			if (data.isClear) {
				// 清空表单
				this.$refs.WgForm.resetFields()
				this.items.map((item, index) => {
					if (item.type === 'datetimerange') {
						const dateArr = [
							this.data[item.dataIndex[0]],
							this.data[item.dataIndex[1]],
						]
						this.$set(this.dyData, `datetimerangeArray${index}`, dateArr)
					}
				})
			} else if (data.click) {
				if (this.rules && !data.cancel) {
					this.$refs.WgForm.validate((valid) => {
						if (valid) {
							// 规则校验通过
							if (data.click) {
								data.click(e)
							}
						}
					})
				} else {
					data.click(e)
				}
			}
		},
		isautoUpload(item) {
			// 判断是否是自动上传文件
			if (item.uploadAttributes && 'autoUpload' in item.uploadAttributes) {
				if (item.uploadAttributes.autoUpload) {
					return true
				}
				return false
			}
			return true
		},
		getAtionFormatter(action) {
			/** 按钮渲染更新 * */
			if (action.customRender) {
				const newAction = action.customRender(Object.assign({}, action))
				if (newAction) {
					action = Object.assign(action, newAction)
				}
			}
			return action
		},
		getDataIndex(item) {
			/** 过滤dataIndex名称绑定 * */
			if (
				Object.prototype.toString.call(item.dataIndex) === '[object String]'
			) {
				return item.dataIndex
			}
			return ''
		},
		dateParseTimeChange(item, datetimerangeValue) {
			this.data[item.dataIndex] = this.dateParseTime(datetimerangeValue)
			item.change && item.change()
		},
		datetimerangeChange(item, datetimerangeValue, index) {
			/** 选择时间区间变化回调 * */
			if (datetimerangeValue) {
				if (index === 0) {
					this.data[item.dataIndex[0]] = this.dateParseTime(datetimerangeValue)
				} else if (index === 1) {
					this.data[item.dataIndex[1]] = this.dateParseTime(
						datetimerangeValue,
						true
					)
				}
			} else if (index === 0) {
				this.data[item.dataIndex[0]] = ''
			} else if (index === 1) {
				this.data[item.dataIndex[1]] = ''
			}
			item.change && item.change()
		},
	},
}
</script>
<style lang="scss" scoped>
/** 图片上传样式 **/
.wg-form .wg_image_box {
	overflow: hidden;
	position: relative;
	cursor: pointer;
	width: 120px;
	height: 120px;
	line-height: 116px;
	margin: 5px;
	padding: 0px;
	text-align: center;
	float: left;
	border: 1px solid #ccc;
	margin-top: 15px;
	border-radius: 5px;
	box-shadow: #e6e6e6 0px 0px 7px 1px;
	.wg_image_item {
		width: 100%;
		height: 100%;
	}
	.wg_image_item_dlt {
		width: 100%;
		height: 24px;
		position: absolute;
		background: #e7e7e7;
		bottom: 0;
		left: 0;
		z-index: 10;
		text-align: center;
		line-height: 24px;
		border: 0;
		border-top-width: 0px;
	}
}
.wg-form .wg_upload {
	cursor: pointer;
	width: 120px;
	height: 120px;
	background: #ddd;
	float: left;
	margin: 5px;
	margin-top: 15px;
	text-align: center;
	line-height: 20px;
	padding-top: 35px;
	border: 1px solid #ccc;
	position: relative;
}
.wg-form .wg_telephone_line {
	width: 100%;
	text-align: center;
	display: block;
}
.wg-form .mr0 {
	margin-right: 0;
}
.wg-form .mr20 {
	margin-right: 20px;
}
.wg-form .custom_label {
	line-height: 20px;
}
.wg-form .imageCheckbox {
	position: absolute;
	top: 0;
	right: 0;
	display: flex;
}
.wg-form .el-form-item .el-form-item {
	margin: 0 !important;
}
.wg-form .el-select {
	width: 100%;
}
</style>
<style lang="scss">
.wg-vue-materials_drag .el-upload-dragger {
	cursor: pointer;
	width: 100%;
	height: 100%;
	background: transparent;
	float: left;
	text-align: center;
	line-height: 20px;
	padding-top: 35px;
	position: absolute;
	left: 0;
	top: 0;
}
@media only screen and (max-width: 1650px) {
	.wg-form.el-form--inline .el-form-item__content .el-input--suffix {
		max-width: 190px;
	}
}
@media only screen and (max-width: 1550px) {
	.wg-form.el-form--inline .el-form-item__content .el-input--suffix {
		max-width: 170px;
	}
}
@media only screen and (max-width: 1470px) {
	.wg-form.el-form--inline .el-form-item__content .el-input--suffix {
		max-width: 150px;
	}
}
@media only screen and (max-width: 1400px) {
	.wg-form.el-form--inline .el-form-item__content .el-input--suffix {
		max-width: 130px;
	}
}
@media only screen and (max-width: 1310px) {
	.wg-form.el-form--inline .el-form-item__content .el-input--suffix {
		max-width: 110px;
	}
}
</style>

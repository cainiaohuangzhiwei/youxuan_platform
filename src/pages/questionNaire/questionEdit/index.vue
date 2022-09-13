<template>
	<div ref="questionEdit">
		<el-container
			style="height: 100%; max-height: 80vh; border: 1px solid #eee"
		>
			<el-aside class="question-slider" width="140px">
				<div class="option-type">题目类型</div>
				<el-button @click="addItem('radio')">单选题</el-button>
				<el-button @click="addItem('checkbox')">多选题</el-button>
				<el-button @click="addItem('input')">填空题</el-button>
				<el-button @click="addItem('NPS')">NPS净值推荐</el-button>
				<el-button @click="addItem('matrix')">矩阵选择题</el-button>
				<el-button @click="addItem('score')">评分题</el-button>
				<el-button @click="addItem('region')">地区选择题</el-button>
				<div class="option-type">工具</div>
				<el-button @click="addItem('page')">分页</el-button>
			</el-aside>
			<el-container v-loading="loading">
				<el-header class="qua-header" style="height: auto">
					<div class="qua-header_title">{{ id ? '编辑问卷' : '新增问卷' }}</div>
					<div>
						<el-button v-if="isDrag" type="success" @click="submitSort">
							确定使用当前排序
						</el-button>
						<el-button v-if="id" @click="previewQua">预览</el-button>
						<el-button v-auth="authMap.update" v-if="id" @click="saveQua"
							>保存</el-button
						>
						<el-button v-auth="authMap.add" v-else @click="saveQua"
							>保存</el-button
						>
					</div>
				</el-header>

				<el-main>
					<el-form
						ref="form"
						:model="quaData"
						:rules="quaRules"
						@submit.native.prevent="() => {}"
					>
						<el-form-item label="问卷标题" prop="title">
							<el-input
								maxlength="60"
								show-word-limit
								v-model="quaData.title"
								placeholder="请输入问卷标题"
							></el-input>
						</el-form-item>
						<el-form-item label="问卷引言" props="introduction">
							<el-input
								:autosize="{ minRows: 2, maxRows: 6 }"
								type="textarea"
								maxlength="200"
								show-word-limit
								v-model="quaData.introduction"
								placeholder="请输入问卷引言，用来介绍问卷调研的目的"
							></el-input>
						</el-form-item>
					</el-form>

					<el-alert
						title="选项必须满足是以下的其中一种格式"
						:type="!errorInfo ? 'info' : 'error'"
						show-icon
						:closable="false"
					>
						<div class="tip">
							1、 全部是文本<br />
							2、 全部是图片500kb以内 <br />
							3、 全部是图片+文字标题 <br />
							4、 “其他”选项仅支持全文字选项
						</div>
						<div v-if="errorInfo">{{ errorInfo }}</div>
					</el-alert>

					<div class="option-card" style="margin-top: 20px">
						<el-card
							shadow="never"
							body-style="padding: 10px;text-align: center"
						>
							【第1页/共{{ totalPage }}页】共{{ posPage[1] - posPage[0] }}题
						</el-card>
					</div>

					<draggable
						:list="questionList"
						chosenClass="chosen"
						forceFallback="true"
						group="people"
						animation="1000"
						handle=".el-icon-rank"
						@end="onDragEnd"
					>
						<transition-group>
							<div
								class="option-card"
								v-for="(item, i) in questionList"
								:key="i"
							>
								<el-card v-if="item.questionType" shadow="never">
									<div class="title">
										<div class="title_left">
											{{ item.sortNum }}
											<span v-if="item.required" class="required">*</span>
											<span v-else class="required"></span>
											<div style="flex-grow: 1">
												<input-edit-item
													v-model="item.questionTitle"
													:rules="quaRules.questionTitle"
												></input-edit-item>
												<input-edit-item
													v-model="item.subTitle"
													:rules="quaRules.subTitle"
													placeHolder="请输入副标题"
												></input-edit-item>
											</div>
										</div>
										<div class="action">
											必答{{ item.required ? '已开启' : '已关闭' }}
											<el-switch
												active-color="#13ce66"
												v-model="item.required"
											></el-switch>
											<el-tooltip content="设置显示条件" placement="top">
												<i
													v-if="
														item.showConditionList &&
														item.showConditionList.length
													"
													class="el-icon-s-tools"
													:style="`cursor: pointer; padding: 0 10px; color: #409EFF`"
													@click="setItem(i)"
												></i>
												<i
													v-else
													class="el-icon-setting"
													:style="`cursor: pointer; padding: 0 10px; color: #757575`"
													@click="setItem(i)"
												></i>
											</el-tooltip>

											<i
												class="el-icon-rank"
												style="cursor: move; padding: 0"
											></i>
											<i
												class="el-icon-delete"
												style="color: #f56c6c"
												@click="delItem(i)"
											></i>
										</div>
									</div>
									<div class="options">
										<template v-if="item.questionType === 1">
											<radio-item
												v-model="item.optionsList"
												@otherMethods="handleOtherMethods"
											></radio-item>
										</template>

										<template v-if="item.questionType === 2">
											<div class="maxLimit">
												最多选择项数
												<el-input-number
													size="mini"
													:min="1"
													:max="item.optionsList.length"
													:step="1"
													step-strictly
													v-model="item.optionsNum"
												></el-input-number>
											</div>
											<checkbox-item
												v-model="item.optionsList"
												@otherMethods="handleOtherMethods"
											></checkbox-item>
										</template>

										<template v-if="item.questionType === 3">
											<input-item v-model="item.multiLine"></input-item>
										</template>

										<template v-if="item.questionType === 4">
											<nps-item></nps-item>
											<div class="nps-bottom">
												<input-edit-item
													v-model="item.lowScoreDesc"
													:rules="quaRules.scoreDesc"
												></input-edit-item>
												<input-edit-item
													v-model="item.highScoreDesc"
													:rules="quaRules.scoreDesc"
												></input-edit-item>
											</div>
										</template>
										<template v-if="item.questionType === 5">
											<matrix-item
												v-model="questionList[i]"
												@otherMethods="handleOtherMethods"
											></matrix-item>
										</template>
										<template v-if="item.questionType === 6">
											<region-item v-model="item.optionsList"></region-item>
										</template>
									</div>
								</el-card>
								<el-card
									v-else-if="item.num !== 1"
									shadow="never"
									class="page-card"
									body-style="padding: 10px"
								>
									<div class="title-center">
										<div class="title-page">
											【第{{ item.num }}页/共{{ totalPage }}页】 共
											{{ posPage[item.num] - posPage[item.num - 1] }}题
										</div>
										<div class="action">
											<i class="el-icon-rank" style="cursor: move"></i>
											<i class="el-icon-delete" @click="delItem(i, 'page')"></i>
										</div>
									</div>
								</el-card>
							</div>
						</transition-group>
					</draggable>

					<el-form id="ending" ref="ending">
						<el-form-item label="问卷结尾">
							<el-input
								type="textarea"
								:autosize="{ minRows: 2, maxRows: 6 }"
								maxlength="1000"
								show-word-limit
								v-model="quaData.ending"
								placeholder="填写感谢类的文本"
							></el-input>
						</el-form-item>
					</el-form>
				</el-main>
			</el-container>
		</el-container>

		<option-dialog
			ref="optionDialog"
			:action="optionIndex ? 'edit' : 'add'"
			:visible.sync="visible"
			@addOpiton="handleOption"
			@editOpiton="handleOption"
		></option-dialog>

		<code-look ref="codeLook" :visible.sync="visibleCode"></code-look>

		<!-- 启用显示条件 -->
		<set-item-visible
			ref="settingItem"
			:visible.sync="settingVisible"
			@submit="handleCondition"
		></set-item-visible>

		<!-- 矩阵选择题 -->
		<matrix-dialog
			ref="matrixDialog"
			@change="handleMatrixOption"
		></matrix-dialog>
	</div>
</template>
<script>
import OptionDialog from './components/OptionDialog'
import CodeLook from './components/codeLook'
import { getSmallImg } from '@/utils/imageTool'
import { setViewTitle } from '@/utils/helper/common'
import draggable from 'vuedraggable'
import {
	questionNaireCreate,
	questionNaireUpdate,
	questionNaireDetail,
} from '@/api/questionNaire'
import RadioItem from './components/RadioItem'
import CheckboxItem from './components/CheckboxItem'
import InputEditItem from './components/InputEditItem'
import InputItem from './components/InputItem'
import NpsItem from './components/NpsItem'
import SetItemVisible from './components/SetItemVisible'
import MatrixItem from './components/MatrixItem'
import MatrixDialog from './components/MatrixDialog'
import RegionItem from './components/RegionItem'
// （1-单选 2-多选 3-填空 4-NPS(默认0-10) 5-矩形阵题 6-地区选择）
const optionsNps = []
for (let i = 0; i <= 10; i++) {
	optionsNps.push({
		optionsValue: i,
	})
}
const optionItem = {
	radio: {
		questionType: 1,
		questionTitle: '请选择一个选项',
		subTitle: '',
		required: true,
		pageNum: 1,
		sortNum: 1,
		optionsList: [
			{
				optionsValue: '选项1',
				imageUrl: '',
			},
			{
				optionsValue: '选项2',
				imageUrl: '',
			},
		],
	},
	checkbox: {
		questionType: 2,
		questionTitle: '请选择多个选项（多选）',
		subTitle: '',
		required: true,
		optionsNum: 2,
		checked: [],
		pageNum: 1,
		sortNum: 2,
		optionsList: [
			{
				optionsValue: '选项1',
				imageUrl: '',
			},
			{
				optionsValue: '选项2',
				imageUrl: '',
			},
		],
	},
	input: {
		questionType: 3,
		questionTitle: '请填写本项内容',
		subTitle: '',
		required: true,
		pageNum: 1,
		sortNum: 3,
		value: '',
		multiLine: true, // 行数
	},
	NPS: {
		questionType: 4,
		questionTitle: '请填写本项内容',
		subTitle: '',
		required: true,
		pageNum: 1,
		sortNum: 4,
		lowScoreDesc: '非常不满意',
		highScoreDesc: '非常满意',
		optionsList: optionsNps,
	},
	matrix: {
		questionType: 5,
		questionTitle: '请填写本项内容',
		subTitle: '',
		required: true,
		pageNum: 1,
		sortNum: 5,
		multipleChooseFlag: 0, // 是否多选
		x: '', // 矩阵小标题的数组合并
		subTitleList: [],
		optionsList: [],
	},
	score: {
		questionType: 1,
		questionTitle: '请填写本项内容',
		subTitle: '',
		required: true,
		pageNum: 1,
		sortNum: 6,
		optionsList: [
			{
				optionsValue: '非常不满意',
				imageUrl: '',
			},
			{
				optionsValue: '不满意',
				imageUrl: '',
			},
			{
				optionsValue: '一般',
				imageUrl: '',
			},
			{
				optionsValue: '满意',
				imageUrl: '',
			},
			{
				optionsValue: '非常满意',
				imageUrl: '',
			},
		],
	},
	region: {
		questionType: 6,
		questionTitle: '请填写本项内容',
		subTitle: '',
		required: true,
		pageNum: 1,
		sortNum: 7,
		optionsList: [
			{
				optionsValue: '省份',
				imageUrl: '',
				areaLevel: 2,
			},
			{
				optionsValue: '城市',
				imageUrl: '',
				areaLevel: 3,
			},
			{
				optionsValue: '地区',
				imageUrl: '',
				areaLevel: 4,
			},
		],
	},
	page: {
		questionType: 0,
		num: 1,
	},
}
export default {
	name: 'questionEdit',
	components: {
		OptionDialog,
		draggable,
		CodeLook,
		RadioItem,
		CheckboxItem,
		InputEditItem,
		InputItem,
		NpsItem,
		SetItemVisible,
		MatrixItem,
		MatrixDialog,
		RegionItem,
	},
	data() {
		return {
			questionList: [],
			id: '',
			item: [
				{
					type: 'input',
					title: '问卷标题',
					dataIndex: 'title',
					placeholder: '请输入问卷标题',
				},
				{
					type: 'input',
					title: '问卷引言',
					dataIndex: 'introduction',
					placeholder: '请输入问卷引言，用来介绍问卷调研的目的',
				},
			],

			quaData: {
				title: '',
				introduction: '',
				ending: '',
			},
			quaRules: {
				title: [{ required: true, message: '请输入问卷标题', trigger: 'blur' }],
				questionTitle: [
					{ required: true, message: '请输入标题', trigger: 'blur' },
					{ max: 100, message: '标题长度不超过100个字符', trigger: 'blur' },
				],
				subTitle: [
					{ max: 100, message: '标题长度不超过100个字符', trigger: 'blur' },
				],
				scoreDesc: [{ required: true, message: '请输入描述', trigger: 'blur' }],
			},
			quaAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
			],
			getSmallImg,
			loading: false,
			visible: false,
			visibleCode: false,
			activeIndex: null,
			optionIndex: null,
			isDrag: false,
			errorInfo: '',
			cb: null,
			settingVisible: false,
			matrixVisible: false,
			matrixDetail: {
				multipleChooseFlag: 0,
				subTitleList: [],
				x: '',
				optionsList: [],
			},
			authMap: {
				add: '/questionnaire/que-questionnaire/v2/add',
				update: '/questionnaire/que-questionnaire/v2/updateQueQuestionnaire',
			},
			shortId: '',
		}
	},
	computed: {
		totalPage: function () {
			return (this.questionList.filter((x) => !x.questionType) || []).length
		},
		posPage: function () {
			const list = [0]
			this.questionList.forEach((x, i) => {
				if (!x.questionType && i) {
					const len = list.length + 1
					list.push(Math.max(i - len + 1, 0))
				}
			})
			list.push(this.questionList.length - this.totalPage)
			return list
		},
	},
	created() {
		const id = this.$route.params.id || 0
		if (!id || Number(id) === 0) {
			setViewTitle(this.$store, this.$route, '', '新增问卷')
			this.init()
		} else {
			this.id = id
			this.loading = true
			let totalPage = 0
			setViewTitle(this.$store, this.$route, id.substr(-4, 4)) // 设置已访问标题
			questionNaireDetail({
				queQuestionnaireId: id,
			})
				.then(({ data }) => {
					if (data && data.resultCode == 0) {
						this.shortId = data.resultData.shortId
						this.quaData = {
							title: data.resultData.title,
							introduction: data.resultData.introduction,
							ending: data.resultData.ending,
							queQuestionnaireId: data.resultData.queQuestionnaireId,
							questionnaireStatus: data.resultData.questionnaireStatus,
						}
						const questionList = []
						for (let i = 0; i < data.resultData.questionList.length; i++) {
							const x = data.resultData.questionList[i]
							if (x.questionType === 2) {
								x.checked = []
							}
							if (x.questionType === 5) {
								x.multipleChooseFlag = x.multipleChooseFlag ? 1 : 0
								x.subTitleList = x.matrixChildQuestionList.map(
									(y) => y.matrixChildQuestionTitle
								)
								x.x = x.subTitleList.join('\n')
							}
							if (x.optionsList) {
								x.optionsList = x.optionsList.map((y) => {
									if (y.imageUrl) {
										y.image = {
											imageList: getSmallImg(y.imageUrl),
											imageUrl: y.imageUrl,
										}
									}
									y.oid = this.rondom8()
									return y
								})
							}

							x.required = x.required ? true : false
							if (totalPage < x.pageNum) {
								totalPage = x.pageNum
								const page = { ...optionItem.page }
								page.num = x.pageNum
								questionList.push(page)
							}
							x.qid = this.rondom8()
							questionList.push(x)
						}
						this.questionList = questionList
						this.$nextTick(() => {
							this.translateConditionList()
						})
					}
				})
				.finally(() => {
					this.loading = false
				})
		}
	},
	methods: {
		// 处理showConditionList显示的
		translateConditionList() {
			const oldQuestion = this.questionList.filter((x) => x.questionType)
			this.questionList.forEach((x) => {
				if (
					x.showConditionList &&
					Array.isArray(x.showConditionList) &&
					x.showConditionList.length
				) {
					x.showConditionList.forEach((y) => {
						if (!y.qid || !y.oid) {
							// 矩阵题型
							if (y.questionType === 5) {
								const arr = y.questionIndex.split('-')
								const qItem = oldQuestion[Number(arr[0])]
								if (qItem) {
									y.qid = qItem.qid + '-' + arr[1]
									y.oid = qItem.optionsList[Number(y.optionIndex)].oid
								}
							} else {
								// 非矩阵题型
								const qItem = oldQuestion[Number(y.questionIndex)]
								if (qItem) {
									y.qid = qItem.qid
									y.oid = qItem.optionsList[Number(y.optionIndex)].oid
								}
							}
						}
					})
				}
			})
		},
		// 随机8位数
		rondom8() {
			const r = Math.floor(Math.random() * 2742745743360 + 78364164096)
			return r.toString(36)
		},
		// 方法调用
		handleOtherMethods(key, ...params) {
			if (key && typeof this[key] === 'function') {
				this[key].call(this, ...params)
			}
		},
		init() {
			const initId = () => ({
				qid: this.rondom8(),
				optionsList: [
					{
						optionsValue: '选项1',
						imageUrl: '',
						oid: this.rondom8(),
					},
					{
						optionsValue: '选项2',
						imageUrl: '',
						oid: this.rondom8(),
					},
				],
			})
			const radio = Object.assign({}, optionItem.radio, initId())
			const checkbox = Object.assign({}, optionItem.checkbox, initId())
			const input = Object.assign({}, optionItem.input)
			this.questionList = [optionItem.page, radio, checkbox, input]
		},
		addItem(type) {
			if (type === 'page') {
				const _questionList = [...this.questionList]
				const lastPage =
					_questionList.reverse().find((x) => x.questionType === 0) || {}
				const page = { ...optionItem.page }
				page.num = lastPage.num + 1
				this.questionList.push(page)
			} else {
				let initId = {
					qid: this.rondom8(),
				}
				if (
					optionItem[type].optionsList &&
					optionItem[type].optionsList.length
				) {
					initId = {
						qid: this.rondom8(),
						optionsList: optionItem[type].optionsList.map((x) => ({
							...x,
							oid: this.rondom8(),
						})),
					}
				}
				const item = {
					...Object.assign({}, optionItem[type]),
					pageNum: this.totalPage,
					sortNum: this.questionList.length - this.totalPage + 1,
					...initId,
				}

				if (type === 'matrix') {
					item.created = true
				}
				this.questionList.push(item)
			}
			this.$nextTick(() => {
				document.getElementById('ending').scrollIntoView({
					behavior: 'smooth',
				})
			})
		},
		delItem(i, page) {
			const that = this
			this.$confirm(
				page
					? '你确定要删除分页吗？'
					: '你确定要删除词条题目吗？删除后词条题目将不再展示，且控制其他词条题目显示将失效',
				'提示',
				{
					type: 'warning',
					async callback(action) {
						if (action === 'confirm') {
							that.questionList.splice(i, 1)
							that.submitSort()
						}
					},
				}
			)
		},
		// 设置选项
		setItem(i) {
			this.activeIndex = i
			const qua = this.questionList[i]
			// 只取当前设置 的 之前的题目
			const otherQuaList = JSON.parse(JSON.stringify(this.questionList)).slice(
				0,
				i
			)

			this.settingVisible = true
			const normalOtherQuaList = []
			for (let x = 0; x < otherQuaList.length; x++) {
				const itemQua = otherQuaList[x]
				if ([1, 2].includes(itemQua.questionType)) {
					normalOtherQuaList.push(itemQua)
				} else if (itemQua.questionType === 5) {
					// 矩阵处理
					normalOtherQuaList.push(
						...otherQuaList[x].subTitleList.map((y, zIndex) => ({
							sortNum: itemQua.sortNum + '.' + (zIndex + 1),
							_sortNum: itemQua.sortNum,
							qid: itemQua.qid + '-' + zIndex,
							questionTitle: itemQua.questionTitle + '-' + y,
							questionType: 5,
							optionsList: itemQua.optionsList,
						}))
					)
				}
			}
			this.$refs.settingItem.detail(qua, normalOtherQuaList)
		},
		// 设置显示条件
		handleCondition(condition) {
			this.questionList[this.activeIndex].showConditionList = condition
		},
		editMatrix(item, cb) {
			this.$refs.matrixDialog.showDetail(item)
			if (typeof cb === 'function') {
				this.cb = cb
			}
		},

		// 新增选项
		addOption(cb) {
			this.visible = true
			this.optionIndex = 0
			if (typeof cb === 'function') {
				this.cb = cb
			}
		},
		// 编辑选项
		editOption(item, cb) {
			this.optionIndex = 1
			if (typeof cb === 'function') {
				this.cb = cb
			}
			this.visible = true
			if (item.image) [(item.imageUrl = item.image.imageList)]
			this.$refs.optionDialog.detail(item)
		},

		handleOption(option) {
			if (this.cb) {
				if (!option.oid) {
					option.oid = this.rondom8()
				}
				this.cb(option)
			}
		},
		handleMatrixOption(option) {
			// 删除矩阵
			if (option.delete) {
				const len = this.questionList.length
				this.questionList.splice(len - 1, 1)
				return
			}
			if (this.cb) {
				if (!option.oid) {
					option.oid = this.rondom8()
				}
				this.cb(option)
			}
		},

		previewQua() {
			this.visibleCode = true
			this.$refs.codeLook.updateData(this.shortId)
		},
		// 校验选项
		validOption(options = []) {
			if (!Array.isArray(options)) return true
			const optionType = (item) => {
				const _img = item.image || item.imageUrl
				if (item.optionsValue && _img) {
					return 'isMulite'
				} else if (item.optionsValue && !_img) {
					return 'isOnlyName'
				} else if (!item.optionsValue && _img) {
					return 'isOnlyImg'
				}
			}

			let checkType = ''
			let isVal = true
			for (let i = 0; i < options.length; i++) {
				const _checkType = optionType(options[i])
				if (!checkType) {
					checkType = _checkType
				} else if (checkType !== _checkType) {
					isVal = false
					break
				}
			}
			return isVal
		},
		saveQua() {
			if (this.loading) return
			this.submitSort()
			const quaData = JSON.parse(JSON.stringify(this.quaData))
			const errorIndex = [] // 错误的题号
			const questionList = this.questionList.filter((x) => x.questionType)
			this.$refs.form.validate((valid) => {
				if (valid) {
					quaData.questionList = []

					for (let i = 0; i < questionList.length; i++) {
						const x = Object.assign({}, { ...questionList[i] })

						// 设置了显示条件
						if (x.showConditionList && x.showConditionList.length) {
							const newConditionList = JSON.parse(
								JSON.stringify(x.showConditionList)
							)

							const showConditionList = newConditionList.map((y) => {
								const quaItem = questionList.find((z) => y.qid.includes(z.qid))
								// 过滤找不到 和 排序位置在当前题目之后 的题目
								if (!quaItem || quaItem.sortNum > x.sortNum) {
									return false
								}

								const optionIndex = quaItem.optionsList
									.map((z) => z.oid)
									.indexOf(y.oid)
								if (optionIndex < 0) {
									return false
								}
								// 矩阵小标题
								if (y.qid.includes('-') && quaItem.questionType === 5) {
									const ids = y.qid.split('-')
									const indexSubTitle = ids[1]
									return {
										questionType: quaItem.questionType,
										questionIndex: `${quaItem.sortNum - 1}-${indexSubTitle}`,
										optionIndex,
									}
								}
								return {
									questionType: quaItem.questionType,
									questionIndex: quaItem.sortNum - 1,
									optionIndex,
								}
							})
							x.showConditionList = showConditionList.filter((z) => z)
						}

						// 选项校验处理
						if (x.optionsList && Array.isArray(x.optionsList)) {
							const newOptionsList = JSON.parse(JSON.stringify(x.optionsList))
							if (!this.validOption(newOptionsList)) {
								errorIndex.push(x.sortNum)
								break
							}
							x.optionsList = newOptionsList.map((y, j) => {
								y.sortNum = j + 1
								if (y.image) {
									y.imageUrl = y.image.imageUrl
									delete y.image
								}
								delete y.oid
								return y
							})
						}

						// 矩阵
						if (x.questionType === 5) {
							delete x.x
						}

						x.required = x.required ? 1 : 0
						delete x.qid
						delete x.oid
						delete x.x
						quaData.questionList.push(Object.assign({}, { ...x }))
					}
					if (errorIndex.length) {
						this.$message.error(`题号${errorIndex.join(',')}的选项格式不统一`)
						return
					}

					quaData.totalPage = this.totalPage
					quaData.userId = this.$store.state.user.userInfo.userId || ''
					// console.log(quaData)
					this.loading = true
					if (this.id) {
						questionNaireUpdate(quaData)
							.then(({ data }) => {
								this.loading = false
								if (data.resultCode == 0) {
									this.$message.success('保存成功')
								}
							})
							.finally(() => {
								this.loading = false
							})
					} else {
						questionNaireCreate(quaData)
							.then(({ data }) => {
								this.loading = false
								if (data.resultCode == 0) {
									this.$message.success('新增成功')
									this.$refs.form.resetFields()
									this.init()
									this.$router.push({
										path: `/ym/myOuestionNaire?refresh=1`,
									})
								}
							})
							.finally(() => {
								this.loading = false
							})
					}
				}
			})
		},
		onDragEnd() {
			this.isDrag = true
		},
		submitSort() {
			let sortNum = 1
			let pageNum = 0
			this.questionList.forEach((item) => {
				if (item.questionType) {
					item.sortNum = sortNum
					item.pageNum = pageNum
					sortNum++
				} else {
					pageNum++
				}
			})
			this.isDrag = false
		},
	},
}
</script>

<style lang="scss" scoped>
.qua-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px;
	border-bottom: 1px solid #eee;
	.qua-header_title {
		font-size: 18px;
		font-weight: bold;
	}
}
.question-slider {
	background-color: rgb(238, 241, 246);
	display: flex;
	flex-direction: column;
	align-items: baseline;
	padding: 10px 0;
	.el-button {
		margin-left: 16px;
	}
	.el-button + .el-button {
		margin-top: 10px;
	}
	.option-type {
		margin: 20px 0 10px 10px;
		align-self: flex-start;
		font-weight: bold;
		font-size: 16px;
	}
}
.tip {
	font-size: 14px;
	margin-bottom: 10px;
}
.option-card {
	margin-bottom: 20px;

	.page-card {
		margin-top: 40px;
	}

	.title {
		display: flex;
		justify-content: space-between;
		line-height: 32px;
		.title_left {
			display: flex;
			flex-grow: 1;
		}
	}
	.title-center {
		display: flex;
		justify-content: center;
		.title-page {
			flex-grow: 1;
			text-align: center;
			padding-left: 52px;
		}
	}
	.action {
		flex-shrink: 0;
		align-self: flex-end;
		& > i {
			padding-left: 10px;
			font-size: 16px;
		}
	}

	.required {
		padding-right: 10px;
		color: red;
	}

	.options {
		margin-top: 10px;

		.option-img {
			width: 50px;
			height: 50px;
			object-fit: scale-down;
		}

		.maxLimit {
			margin: 10px 0;
		}
	}

	.nps-bottom {
		display: flex;
		justify-content: space-between;
	}
}
</style>

<template>
	<div>
		<el-dialog
			width="500px"
			:title="title"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<yx-form
				ref="form"
				:inline="false"
				:items="item"
				:data="funData"
				:rules="funRules"
				:labelWidth="'110px'"
				:formAction="funAction"
			>
				<template #brandParentId>
					<div class="brand-box">
						<el-select
							class="brand-select"
							v-model="funData.brandParentId"
							filterable
							remote
							reserve-keyword
							placeholder="请输入品牌"
							:remote-method="_getBrandParentList"
							:loading="listLoading"
							style="width: 100%"
							@focus="_getBrandParentList(e, 'focusAction')"
							@change="handleBrandName"
						>
							<el-option
								v-for="item in searchList"
								:key="item.brandParentId"
								:label="item.brandParentName"
								:value="item.brandParentId"
							>
							</el-option>
						</el-select>
						<el-button
							slot="append"
							icon="el-icon-more"
							class="under-select"
							@click="formsDialog = true"
						></el-button>
					</div>

					<!-- <el-autocomplete
						v-model="funData.brandParentName"
						debounce
						placeholder="请输入品牌"
						value-key="brandParentName"
						label="brandParentName"
						:fetch-suggestions="_getBrandParentList"
						@select="handleBrandName"
					>
						<el-button
							slot="append"
							icon="el-icon-more"
							@click="formsDialog = true"
						></el-button>
					</el-autocomplete> -->
				</template>
				<template #classifyDrop>
					<div class="row_flex">
						<el-button type="text" @click="cutUserDialog(true)"
							>添加分类</el-button
						>
					</div>
					<div>
						<span class="classifys" v-for="item in classifys" :key="item.id">{{
							item.firstClassify
						}}</span>
					</div>
				</template>
				<template #evaluate>
					<div>
						<div class="dx">
							质量：<el-rate
								class="mt6"
								@change="evaluatePrice(true)"
								allow-half="true"
								v-model="funData.evaluationOne"
								low-threshold="1"
							>
							</el-rate>
						</div>
						<div class="dx">
							价格：<el-rate
								class="mt6"
								@change="evaluatePrice(true)"
								allow-half="true"
								v-model="funData.evaluationTwo"
							>
							</el-rate>
						</div>
						<div class="dx">
							款式：<el-rate
								class="mt6"
								@change="evaluatePrice(true)"
								allow-half="true"
								v-model="funData.evaluationThree"
							>
							</el-rate>
						</div>
						<div class="dx">
							售后：<el-rate
								class="mt6"
								@change="evaluatePrice(true)"
								allow-half="true"
								v-model="funData.evaluationFour"
							>
							</el-rate>
						</div>
					</div>
				</template>
				<template #brandLabel>
					<div class="row_flex">
						<el-button class="btn" type="text" @click="newlyIncreased"
							>+新增
						</el-button>
						<div
							class="time"
							:class="{ adorn: counter.length === 0 }"
							v-if="endOrderTimeShow"
						>
							<p v-for="(item, index) in counter" :key="index">
								<el-input
									class="wit150"
									v-model="item.brandLabel"
									placeholder="请输入品牌标签"
								></el-input>

								<el-button type="danger" @click="thisSplice(index)"
									>删除</el-button
								>
							</p>
						</div>
					</div>
					<div></div>
				</template>
			</yx-form>
			<!-- 品牌 -->
			<brandSelect-dialog
				:itemInfo="supplyRow"
				:visible.sync="formsDialog"
				@fatherMethodInit="
					(row) => {
						let isPush = true
						searchList.forEach((item) => {
							if (item.brandParentId == row.brandParentId) {
								isPush = false
							}
						})
						if (isPush) {
							searchList = searchList.concat(row)
						}
						funData.brandParentId = row.brandParentId
					}
				"
			/>
		</el-dialog>
		<selected-classify-dialog
			:dialogVisible.sync="dialogUserVisible"
			:classifys.sync="classifys"
		></selected-classify-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import BrandSelectDialog from './BrandSelectDialog'
import SelectedClassifyDialog from './SelectedClassifyDialog'
import { getBrandParentList, saveBrandCategory } from '@/api/yhtPlusWebGoods'
export default {
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		visible: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: '',
		},
		// 单条信息
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	components: {
		YxForm,
		BrandSelectDialog,
		SelectedClassifyDialog,
	},
	data() {
		return {
			listLoading: false,
			searchList: [],
			formsDialog: false,
			dialogUserVisible: false,
			counter: [],
			endOrderTimeShow: true,
			classifys: [], // 选择
			supplyRow: {}, // 当前行选中数据
			supplierList: [],
			dialogData: {
				classifys: [],
				firstClassify: '',
			},
			item: [
				{
					title: '品牌',
					type: 'custom',
					dataIndex: 'brandParentId',
				},
				{
					type: 'input',
					title: '品牌品类名称',
					dataIndex: 'brandCategoryName',
					placeholder: '请输入品牌品类名称',
				},
				{
					title: '分类',
					type: 'custom',
					dataIndex: 'classifyDrop',
				},
				{
					type: 'textarea',
					title: '品牌建议',
					dataIndex: 'proposal',
					placeholder: '请输入品牌建议',
				},
				{
					title: '品牌评价',
					type: 'custom',
					dataIndex: 'evaluate',
				},
				{
					type: 'textarea',
					title: '评价原因',
					dataIndex: 'evaluationReason',
					placeholder: '请输入评价原因',
				},
				{
					title: '品牌标签',
					type: 'custom',
					dataIndex: 'brandLabel',
				},
			],
			compileData: {},
			funData: {
				brandCategoryName: '', //品牌品类名称
				brandParentId: '', //品牌品类id
				evaluationReason: '', //评价原因
				brandParentName: '',
				proposal: '', //品牌建议
				evaluationOne: '',
				evaluationTwo: '',
				evaluationThree: '',
				evaluationFour: '',
				brandLabel: '',
			},
			evaluationList: '',
			funRules: {
				brandCategoryName: [
					{
						required: true,
						message: '请输入品牌品类名称',
						trigger: ['blur', 'change'],
					},
				],
				brandParentId: [
					{ required: true, message: '请输入品牌', trigger: 'blur' },
				],
			},
			funAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
			],
			classifysOld: [],
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
		classifys() {
			this.dialogData.classifys = this.classifys.map((item) => {
				return item.id
			})
			console.log('caoniam', this.classifys)
		},
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
		},
		dialogVisible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.visible = newVlaue
			}
		},
	},
	methods: {
		// 添加标签
		newlyIncreased() {
			this.counter.push({})
			this.endOrderTimeShow = true
		},
		// 删除截单时间
		thisSplice(index) {
			this.counter.splice(index, 1)
		},

		//评价处理
		evaluatePrice() {
			this.evaluationList =
				this.funData.evaluationOne * 2 +
				',' +
				this.funData.evaluationTwo * 2 +
				',' +
				this.funData.evaluationThree * 2 +
				',' +
				this.funData.evaluationFour * 2
		},
		cutUserDialog() {
			// 添加分类弹框
			this.dialogUserVisible = true
		},
		// 操作品牌品类
		handleBrandName(item) {
			this.funData.brandParentId = item
		},
		// 获取品牌品类列表
		async _getBrandParentList(queryString, type) {
			const paramJson = {
				startIndex: 0,
				length: 20,
				keyword: queryString,
			}
			if (type === 'focusAction' && this.searchList.length > 0) {
				return
			}
			this.listLoading = true
			const {
				data: { resultCode, resultData },
			} = await getBrandParentList(paramJson)
			this.listLoading = false
			if (resultCode == 0 && resultData.brandParentList.length > 0) {
				this.searchList = resultData.brandParentList || []
			}
		},

		// 回显
		async addDetail(row, type) {
			this.classifys = []
			this.classifysOld = []
			this.compileData = row
			if (type == 2) {
				let classifyList = []
				if (row.classifyInfo) {
					let classifyListOld = row.classifyInfo.split(',')
					classifyList = classifyListOld.map((item) => {
						this.classifysOld.push(Number(item.split('-')[0]))
						return {
							classifyId: Number(item.split('-')[0]),
							firstClassify: item.split('-')[2],
							id: Number(item.split('-')[0]),
						}
					})
					console.log(classifyList)
				}
				this.classifys = classifyList
				if (row.tag) {
					const tagList = row.tag.split(',')
					this.counter = tagList.map((item) => {
						return {
							brandLabel: item,
						}
					})
				}

				this.funData.brandParentName = row.brandParentName
					? row.brandParentName
					: ''
				this.funData.brandParentId = row.brandParentId ? row.brandParentId : ''
				this.funData.brandCategoryName = row.brandCategoryName
					? row.brandCategoryName
					: ''
				this.funData.proposal = row.proposal ? row.proposal : ''
				let evaluationArr = row.evaluation.split(',')
				this.funData.evaluationOne = row.evaluation
					? Number(evaluationArr[0]) / 2
					: 0
				this.funData.evaluationTwo = row.evaluation
					? Number(evaluationArr[1]) / 2
					: 0
				this.funData.evaluationThree = row.evaluation
					? Number(evaluationArr[2]) / 2
					: 0
				this.funData.evaluationFour = row.evaluation
					? Number(evaluationArr[3]) / 2
					: 0
				this.funData.evaluationReason = row.evaluationReason
					? row.evaluationReason
					: ''
			} else {
				this.funData = {
					brandCategoryName: '', //品牌品类名称
					brandParentId: '', //品牌品类id
					evaluationReason: '', //评价原因
					brandParentName: '',
					proposal: '', //品牌建议
					evaluationOne: '',
					evaluationTwo: '',
					evaluationThree: '',
					evaluationFour: '',
				}
			}
			this.evaluatePrice()
		},

		// 保存
		async submitForm() {
			this.addBrandSave()
		},

		// 新增
		async addBrandSave() {
			//分类
			let addBrandCategoryClassifyIdList = []
			if (this.dialogData.classifys.length > 0) {
				addBrandCategoryClassifyIdList = this.dialogData.classifys
			}
			//标签
			let counterList = []
			if (this.counter.length > 0) {
				for (let i = 0; i < this.counter.length; i++) {
					counterList.push(this.counter[i].brandLabel)
				}
			}
			let parameter = {
				brandParentId: this.funData.brandParentId,
				brandCategoryName: this.funData.brandCategoryName,
				addBrandCategoryClassifyIdList: addBrandCategoryClassifyIdList,
				proposal: this.funData.proposal,
				evaluation: this.evaluationList,
				evaluationReason: this.funData.evaluationReason,
				deleteBrandCategoryClassifyIdList: [],
				tag: counterList.join(),
			}
			console.log(this.compileData, 'this.compileData')
			if (this.compileData.brandCategoryId) {
				parameter.brandCategoryId = this.compileData.brandCategoryId
				if (this.classifysOld.length > 0) {
					for (let i = 0; i < this.classifysOld.length; i++) {
						let flag = false
						for (let j = 0; j < addBrandCategoryClassifyIdList.length; j++) {
							if (this.classifysOld[i] == addBrandCategoryClassifyIdList[j]) {
								flag = true
								break
							}
						}
						if (!flag) {
							parameter.deleteBrandCategoryClassifyIdList.push(
								this.classifysOld[i]
							)
						}
					}
				}
			}
			const {
				data: { resultCode, resultMsg },
			} = await saveBrandCategory(parameter)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.resetForm()
				this.$emit('fatherbrandCategory')
			}
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			// this.item[0].disabled = false
			// this.item[2].disabled = false
			this.compileData.brandCategoryId = ''
			this.classifys = []
			this.dialogData = {
				classifys: [],
				firstClassify: '',
			}
			this.counter = []
			this.funData = {
				brandCategoryName: '', //品牌品类名称
				brandParentId: '', //品牌品类id
				evaluationReason: '', //评价原因
				brandParentName: '',
				proposal: '', //品牌建议
				evaluationOne: '',
				evaluationTwo: '',
				evaluationThree: '',
				evaluationFour: '',
			}
			this.$refs.form.$refs.YxForm.resetFields()
		},
	},
}
</script>

<style lang="scss" scoped>
.classifys {
	margin-right: 10px;
	margin-bottom: 10px;
}
.mt10 {
	margin-top: 10px;
}
.dx {
	display: flex;
}
.mt6 {
	margin-top: 6px;
}
.wit150 {
	width: 150px;
}
.brand-box {
	display: flex;
	position: relative;
	.brand-select {
		position: relative;
		z-index: 9;
	}
	.under-select {
		position: relative;
		z-index: 1;
		left: -3px;
	}
}
</style>

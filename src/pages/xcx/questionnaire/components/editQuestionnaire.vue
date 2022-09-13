<template>
	<div>
		<yx-dialog
			:width="`800px`"
			v-loading="loading"
			:title="dialogTitle"
			:visible.sync="localVisible"
		>
			<yx-form
				labelWidth="140px"
				:data="dialogData"
				:rules="rules"
				:items="dialogCfg"
				:formAction="dialogAction"
			>
				<template slot="queQuestionnaireId" slot-scope="scope">
					<div class="row_flex">
						<el-input
							class="row_input"
							v-model="scope.data.queQuestionnaireName"
							disabled
						></el-input>
						<el-button type="primary" @click="selectQuestionnaire"
							>选择问卷</el-button
						>
					</div>
				</template>
			</yx-form>
		</yx-dialog>

		<!-- 选择问卷 -->
		<select-questionnaire-dialog
			:dialogVisible.sync="dialogQuestionnaireVisible"
			:itemInfo="selectedQuestionnaire"
			@handleSelectedAnchor="handleSelectedQuestionnaire"
		></select-questionnaire-dialog>
	</div>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import selectQuestionnaireDialog from './selectQuestionnaireDialog'
import { uploadImageList } from '@/api/image'
import { getSmallImg } from '@/utils/imageTool'
import { questionnaireEntranceUpdate } from '@/api/questionNaire'

export default {
	components: {
		YxDialog,
		YxForm,
		selectQuestionnaireDialog,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		// 项的信息
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			loading: false,
			dialogTitle: '问卷调查',
			dialogData: {
				entranceImage: [],
				entranceName: '',
				queQuestionnaireId: '',
				startTime: '',
				endTime: '',
				queQuestionnaireName: '',
				queQuestionnaireUrl: '',
			},
			rules: {
				entranceImage: [
					{ required: true, message: '请上传问卷入口图片', trigger: 'blur' },
				],
				queQuestionnaireId: [
					{ required: true, message: '请选择问卷', trigger: 'blur' },
				],
				startTime: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请选择结束时间!'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				endTime: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请选择结束时间!'))
							} else if (value < this.dialogData.startTime) {
								callback(new Error('结束时间必须大于开始时间!'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
			},
			dialogCfg: [
				{
					type: 'uploadImage',
					title: '问卷入口图片',
					dataIndex: 'entranceImage',
					uploadAttributes: {
						limit: 1,
						imageName: 'entranceImage',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'entranceImage'),
					},
				},
				{
					type: 'input',
					title: '问卷入口位置',
					dataIndex: 'entranceName',
					disabled: true,
				},
				{
					type: 'custom',
					dataIndex: 'queQuestionnaireId',
					title: '选择问卷',
				},
				{
					title: '入口有效期',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
				},
			],
			dialogAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.editQueQuestionnaire()
					},
				},
			],
			dialogQuestionnaireVisible: false,
			selectedQuestionnaire: {},
		}
	},

	computed: {
		localVisible: {
			get() {
				return this.dialogVisible
			},
			set(val) {
				this.$emit('update:dialogVisible', val)
			},
		},
	},

	methods: {
		async uploadImageHttpRequest(params, key, maxSize) {
			const size = params.file.size

			if (maxSize && size >= 1024 * maxSize) {
				this.$message.warning(`图片大小不超过${maxSize}K`)
				this.dialogData[key] = []
				return
			}

			//上传海报
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#addImageFrom_goods', imageType: 81 })
			)
			formData.append('file', params.file)

			let {
				data: { resultData },
			} = await uploadImageList(formData)

			this.dialogData[key] = resultData.imageList
			this.dialogData[key][0][key] = getSmallImg(
				resultData.imageList[0].imageUrl
			)
		},
		selectQuestionnaire() {
			this.dialogQuestionnaireVisible = true
		},
		handleSelectedQuestionnaire(val) {
			this.dialogData.queQuestionnaireId = val.queQuestionnaireId
			this.dialogData.queQuestionnaireName = val.title
		},
		async editQueQuestionnaire() {
			let paramJson = Object.assign({}, this.dialogData)

			if (
				paramJson.entranceImage &&
				paramJson.entranceImage[0] &&
				paramJson.entranceImage[0].imageUrl
			) {
				paramJson.entranceImage = paramJson.entranceImage[0].imageUrl
			}

			const res = await questionnaireEntranceUpdate(paramJson)

			if (res.data.resultCode == 0) {
				this.$message({
					message: '编辑成功',
					type: 'success',
				})
				this.localVisible = false
				this.$emit('updateList')
			}
		},
	},

	watch: {
		itemInfo() {
			this.dialogData = Object.assign({}, this.itemInfo)
			this.selectedQuestionnaire = {
				queQuestionnaireId: this.dialogData.queQuestionnaireId,
				title: this.dialogData.queQuestionnaireName,
			}
			// 问卷入口图片处理
			if (this.dialogData.entranceImage) {
				this.dialogData.entranceImage = [
					{
						imageUrl: this.dialogData.entranceImage,
						entranceImage: getSmallImg(this.dialogData.entranceImage),
					},
				]
			} else {
				this.dialogData.entranceImage = []
			}
		},
	},
}
</script>

<style lang="scss">
.row_flex {
	display: flex;
	align-items: center;
}
.row_input {
	margin-right: 20px;
}
</style>

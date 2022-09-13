<template>
	<div>
		<el-dialog
			width="600px"
			:title="'配置' + mapName[name] + '信息'"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			@open="resetForm"
		>
			<el-form
				v-if="name !== 'scene'"
				ref="form"
				:model="form"
				:rules="rules"
				label-width="80px"
			>
				<template v-if="name === 'sort'">
					<el-form-item label="排序对象" prop="returnContentType">
						<el-select v-model="form.returnContentType">
							<el-option
								v-for="opt in returnContentList"
								:key="opt.value"
								:value="opt.value"
								:label="opt.label"
							></el-option>
						</el-select>
					</el-form-item>
				</template>
				<template v-if="name === 'recall'">
					<el-form-item label="召回对象" prop="returnContentType">
						<el-select v-model="form.returnContentType">
							<el-option
								v-for="opt in returnContentList"
								:key="opt.value"
								:value="opt.value"
								:label="opt.label"
							></el-option>
						</el-select>
					</el-form-item>
				</template>
				<template v-if="name === 'source'">
					<el-form-item label="召回对象" prop="returnContentType">
						<el-select v-model="form.returnContentType">
							<el-option
								v-for="opt in returnContentList"
								:key="opt.value"
								:value="opt.value"
								:label="opt.label"
							></el-option>
						</el-select>
					</el-form-item>
				</template>
				<el-form-item label="数据源" prop="source">
					<el-input
						v-model="form.source"
						style="width: 400px"
						maxlength="128"
					></el-input>
				</el-form-item>

				<el-form-item label="必传参数" v-if="name != 'search'" prop="paramIds">
					<el-checkbox-group v-model="form.paramIds">
						<el-checkbox
							v-for="par in paramsList"
							:key="par.paramId"
							:label="par.paramId"
							>{{ par.paramName }}</el-checkbox
						>
					</el-checkbox-group>
				</el-form-item>
				<template v-if="name === 'source'">
					<el-form-item label="是否分页" prop="isPage">
						<el-radio-group v-model="form.isPage">
							<el-radio :label="0">否</el-radio>
							<el-radio :label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
				</template>
				<el-form-item :label="mapNameInput[name]" prop="name">
					<el-input
						v-model="form.name"
						style="width: 400px"
						maxlength="128"
					></el-input>
				</el-form-item>
				<el-form-item>
					<el-button @click="handleCancel">取消</el-button>
					<el-button type="primary" @click="submitForm">保存</el-button>
				</el-form-item>
			</el-form>
			<el-form
				v-else
				ref="form1"
				:model="form"
				:rules="rules"
				label-width="80px"
			>
				<el-form-item label="场景ID" prop="sceneId">
					<el-input v-model="form.sceneId" style="width: 400px"></el-input>
				</el-form-item>
				<el-form-item label="场景名称" prop="shopSceneName">
					<el-input
						v-model="form.shopSceneName"
						style="width: 400px"
					></el-input>
				</el-form-item>
				<el-form-item label="分流父ID" prop="abtId">
					<el-input v-model="form.abtId" style="width: 400px"></el-input>
					<div style="color: #999">多个分流父ID用逗号隔开</div>
				</el-form-item>
				<el-form-item>
					<el-button @click="handleCancel">取消</el-button>
					<el-button type="primary" @click="submitForm">保存</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import {
	sortAdd,
	sortUpdateById,
	recallAdd,
	recallUpdateById,
	dataSourceAdd,
	dataSourceUpdateById,
	sortParamList,
	sceneAdd,
	sceneUpdateById,
	searchAdd,
	searchUpdateById,
} from '@/api/metaData'
const mapName = {
	sort: '排序算法',
	recall: '召回服务',
	source: '数据源',
	scene: '商城场景',
	search: '搜索服务管理',
}
const mapNameInput = {
	sort: '算法名称',
	recall: '服务名称',
	source: '名称',
	search: '服务名称',
}
export default {
	props: {
		visible: {
			type: Boolean,
			define: false,
		},
		newSceneRow: {
			define: false,
			default: () => {},
		},
		name: {
			type: String,
		},
		returnContentList: {
			type: Array,
			default: () => [],
		},
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

	data() {
		const methodList = (() => {
			let addMethod
			let updateMethod
			switch (this.name) {
				case 'sort':
					addMethod = sortAdd
					updateMethod = sortUpdateById
					break
				case 'recall':
					addMethod = recallAdd
					updateMethod = recallUpdateById
					break
				case 'source':
					addMethod = dataSourceAdd
					updateMethod = dataSourceUpdateById
					break
				case 'scene':
					addMethod = sceneAdd
					updateMethod = sceneUpdateById
					break
				case 'search':
					addMethod = searchAdd
					updateMethod = searchUpdateById
					break
			}
			return { addMethod, updateMethod }
		})()

		return {
			mapName,
			mapNameInput,
			form: {
				paramIds: [],
				name: '',
				returnContentType: '',
				source: '',
				isPage: 0,
				sceneId: '',
				shopSceneId: '',
				shopSceneName: '',
				abtId: '',
			},
			rules: {
				returnContentType: [
					{
						required: true,
						message: this.name === 'sort' ? '请选择排序对象' : '请选择召回对象',
						trigger: ['blur', 'change'],
					},
				],
				recallObject: [
					{
						required: true,
						message: '请选择召回对象',
						trigger: ['blur', 'change'],
					},
				],
				source: [
					{
						required: true,
						message: '请输入数据源',
						trigger: ['blur', 'change'],
					},
				],
				name: [
					{
						required: true,
						message: '请输入' + mapNameInput[this.name],
						trigger: ['blur', 'change'],
					},
				],
				sceneId: [{ required: true, message: '请输入场景ID' }],
				shopSceneName: [{ required: true, message: '请输入场景名称' }],
				abtId: [{ required: true, message: '请输入父分流ID' }],
			},
			paramsList: [],
			paramsTotal: 0,
			addMethod: methodList.addMethod,
			updateMethod: methodList.updateMethod,
		}
	},
	watch: {
		localVisible(val) {
			this.$refs.form && this.$refs.form.resetFields()
			if (val) {
				if (this.name === 'sort') {
					this.form.id = this.newSceneRow.sortId
					this.form.name = this.newSceneRow.algorithmModelName
					this.form.source = this.newSceneRow.algorithmModel
				}
				if (this.name === 'recall') {
					this.form.id = this.newSceneRow.recallId
					this.form.name = this.newSceneRow.recallModelName
					this.form.source = this.newSceneRow.recallModel
				}
				if (this.name === 'source') {
					this.form.id = this.newSceneRow.sourceId
					this.form.name = this.newSceneRow.sourceName
					this.form.source = this.newSceneRow.sourceValue
					this.form.isPage = this.newSceneRow.isPage || 0
				}
				if (this.name === 'scene') {
					this.form.sceneId = this.newSceneRow.sceneId || ''
					this.form.shopSceneId = this.newSceneRow.shopSceneId || ''
					this.form.id = this.newSceneRow.shopSceneId || ''
					this.form.shopSceneName = this.newSceneRow.shopSceneName || ''
					this.form.abtId = this.newSceneRow.abtId || ''
				}
				if (this.name === 'search') {
					this.form.id = this.newSceneRow.searchId || ''
					this.form.source = this.newSceneRow.algorithmModel || ''
					this.form.name = this.newSceneRow.algorithmModelName || ''
				}
				if (this.newSceneRow.rcParamRelationDTOList) {
					this.form.paramIds = this.newSceneRow.rcParamRelationDTOList.map(
						(element) => element.paramId
					)
				} else {
					this.form.paramIds = []
				}
				this.form.returnContentType = this.newSceneRow.returnContentType
			}
		},
	},
	mounted() {
		this.getParamsList()
	},

	methods: {
		// 获取字段list
		getParamsList() {
			// 0：通用；1：召回；2：排序 3：数据池
			const paramUseTypeText = ['recall', 'sort', 'source']
			const paramUseType = paramUseTypeText.indexOf(this.name)
			if (paramUseType < 0) return
			sortParamList({
				pageSize: 50,
				paramUseType: paramUseType + 1,
			}).then(({ data }) => {
				if (data) {
					this.paramsList = data.resultData
					this.paramsTotal = data.total
				}
			})
		},
		// 打开弹窗
		resetForm() {
			const form = this.$refs[this.name === 'scene' ? 'form1' : 'form']
			if (form) {
				this.$nextTick(() => {
					form.clearValidate()
				})
			}
		},
		handleCancel() {
			this.localVisible = false
		},
		submitForm() {
			this.$refs[this.name === 'scene' ? 'form1' : 'form'].validate(
				async (valid) => {
					if (valid) {
						let params
						if (this.name === 'sort') {
							params = {
								algorithmModelName: this.form.name,
								algorithmModel: this.form.source,
							}
						}
						if (this.name === 'recall') {
							params = {
								recallModelName: this.form.name,
								recallModel: this.form.source,
							}
						}
						if (this.name === 'source') {
							params = {
								sourceName: this.form.name,
								sourceValue: this.form.source,
								isPage: this.form.isPage,
							}
						}

						if (this.name === 'scene') {
							params = {
								sceneId: this.form.sceneId,
								shopSceneName: this.form.shopSceneName,
								abtId: this.form.abtId,
								shopSceneId: this.form.shopSceneId,
							}
						}

						if (this.name === 'search') {
							params = {
								algorithmModel: this.form.source,
								algorithmModelName: this.form.name,
							}
						} else {
							params.paramIds = this.form.paramIds
							params.returnContentType = this.form.returnContentType
						}

						if (this.form.id) {
							if (this.name !== 'scene') {
								params[this.name + 'Id'] = this.form.id
							} else {
								params.shopSceneId = this.form.shopSceneId
							}
							params.updateUser = this.$store.state.user.userInfo.userId
							let {
								data: { resultCode },
							} = await this.updateMethod(params)
							if (resultCode == 0) {
								this.$message.success('修改成功')
								this.$emit('Refresh', true)
								this.localVisible = false
							}
						} else {
							params.addUser = this.$store.state.user.userInfo.userId
							let {
								data: { resultCode },
							} = await this.addMethod(params)
							if (resultCode == 0) {
								this.$message.success('新建成功')
								this.$emit('Refresh', true)
								this.localVisible = false
							}
						}
					}
				}
			)
		},
	},
}
</script>

<style lang="scss" scoped></style>

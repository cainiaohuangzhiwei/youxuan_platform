<template>
	<div>
		<el-dialog
			width="600px"
			title="新建场景-场景信息"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="handleCancel"
			@open="getSceneList"
		>
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="场景名称" prop="shopSceneName">
					<el-select
						v-model="form.sceneName"
						@change="handleScene"
						filterable
						remote
						reserve-keyword
						placeholder="请输入关键词"
						:remote-method="remoteMethod"
						:loading="loading"
					>
						<el-option
							v-for="item in sceneList"
							:key="item.shopSceneId"
							:label="item.shopSceneName"
							:value="item"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="分流父ID" prop="testId">
					<el-select v-model="form.testId">
						<el-option
							v-for="(item, index) in testIdList"
							:key="index"
							:label="item"
							:value="item"
						></el-option
					></el-select>
				</el-form-item>
				<el-form-item label="页面名称" prop="pageName">
					<el-input
						v-model="form.pageName"
						style="width: 400px"
						maxlength="128"
					></el-input>
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
import { rcBizSceneAdd } from '@/api/scene'
import { sceneQueryList } from '@/api/metaData'

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
	},

	components: {},

	data() {
		return {
			form: {
				sceneName: '',
				shopSceneName: null,
				testId: '',
				pageName: '',
			},
			sceneList: [],
			initSceneList: [],
			testIdList: [],
			rules: {
				shopSceneName: [
					{
						required: true,
						message: '请选择场景名称',
						trigger: ['blur', 'change'],
					},
				],
				testId: [
					{
						required: true,
						message: '请选择分流父ID',
						trigger: ['blur', 'change'],
					},
				],
				pageName: [
					{
						required: true,
						message: '请输入页面名称',
						trigger: ['blur', 'change'],
					},
				],
			},
		}
	},
	watch: {
		localVisible() {
			this.$refs.form && this.$refs.form.resetFields()
			this.form.shopSceneName = ''
			this.form.sceneName = ''
			this.form.testId = ''
			this.form.pageName = ''
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
	mounted() {
		this.getSceneList()
	},

	methods: {
		getSceneList() {
			if (!this.initSceneList.length) {
				sceneQueryList().then(({ data }) => {
					this.initSceneList = data.resultData
					this.sceneList = data.resultData
				})
			} else {
				this.sceneList = this.initSceneList
			}
		},
		remoteMethod(query) {
			if (query !== '') {
				this.loading = true
				sceneQueryList({ shopSceneName: query }).then(({ data }) => {
					this.loading = false
					this.sceneList = data.resultData
				})
			} else {
				this.getSceneList()
			}
		},
		handleScene(e) {
			this.form.sceneName = e.shopSceneName
			this.form.shopSceneName = e
			if (e.abtId) {
				this.testIdList = e.abtId.split(/,|，/)
			} else {
				this.testIdList = []
			}
		},
		// 关闭弹窗
		// resetForm() {
		// 	this.$refs.form && this.$refs.form.clearValidate()
		// 	this.localVisible = false
		// },
		handleCancel() {
			this.$refs.form && this.$refs.form.clearValidate()
			this.localVisible = false
			this.initSceneList = []
		},
		submitForm() {
			this.$refs['form'].validate(async (valid) => {
				if (valid) {
					let params = {
						sceneName: this.form.sceneName,
						shopSceneId: this.form.shopSceneName.shopSceneId,
						testId: this.form.testId,
						pageName: this.form.pageName,
						addUser: this.$store.state.user.userInfo.userId,
					}
					let {
						data: { resultCode, resultData },
					} = await rcBizSceneAdd(params)
					if (resultCode == 0) {
						this.$message.success('新建成功')
						this.$emit('Refresh', true)
						this.$router.push({
							path: `editScene/${resultData}`,
						})
						this.localVisible = false
					}
				}
			})
		},
	},
}
</script>

<style lang="scss" scoped></style>

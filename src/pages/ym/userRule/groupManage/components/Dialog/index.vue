<template>
	<el-dialog
		:title="title"
		:visible.sync="localVisible"
		width="55%"
		@open="open"
		:modal-append-to-body="false"
		:close-on-click-modal="false"
	>
		<el-form
			ref="YxForm"
			:model="ruleForm"
			label-width="110px"
			v-loading="isLoading"
			:rules="rules"
		>
			<el-form-item label="人群名称" prop="groupName">
				<el-input placeholder="请输入分群名称" v-model="ruleForm.groupName" />
			</el-form-item>

			<el-form-item label="人群ID" prop="id" v-if="row.id">
				<el-input
					placeholder="请输入人群ID"
					:disabled="true"
					v-model="ruleForm.id"
				/>
			</el-form-item>

			<el-form-item label="创建时间" prop="addTime" v-if="row.id">
				<el-date-picker
					v-model="ruleForm.addTime"
					type="datetime"
					:disabled="true"
					placeholder="创建时间"
				>
				</el-date-picker>
			</el-form-item>

			<el-form-item label="创建人" prop="creator" v-if="row.id">
				<el-input
					placeholder="请输入创建人"
					:disabled="true"
					v-model="ruleForm.creator"
				/>
			</el-form-item>

			<el-form-item label="最后更新时间" prop="updateTime" v-if="row.id">
				<el-date-picker
					v-model="ruleForm.updateTime"
					type="datetime"
					:disabled="true"
					placeholder="最后更新时间"
				>
				</el-date-picker>
			</el-form-item>

			<el-form-item label="最后更新人" prop="operator" v-if="row.id">
				<el-input
					placeholder="请输入最后更新人"
					:disabled="true"
					v-model="ruleForm.operator"
				/>
			</el-form-item>

			<el-form-item label="配置方式" prop="configType">
				<el-radio-group v-model="ruleForm.configType" :disabled="true">
					<template v-for="item in configTypeList">
						<el-radio :key="item.value" :label="item.value">{{
							item.desc
						}}</el-radio>
					</template>
				</el-radio-group>
			</el-form-item>

			<el-form-item label="人群条件公式" prop="groupExpression">
				<el-input
					type="textarea"
					:rows="3"
					class="expression-input"
					placeholder="请输入人群条件公式"
					v-model="ruleForm.groupExpression"
				>
				</el-input>
			</el-form-item>

			<el-form-item class="btns">
				<el-button size="large" type="info" @click="viewProfileTest()"
					>调试</el-button
				>
				<el-button size="large" type="primary" @click="submitForm()">
					确认
				</el-button>
			</el-form-item>
		</el-form>
		<div class="test-result" v-if="viewProfile">
			<h3>人群画像:</h3>
			<p class="total">共 {{ viewProfile.total || 0 }} 人</p>

			<div class="item" v-if="viewProfile.genderView">
				<p class="title">性别比例</p>
				<p>
					男性{{ viewProfile.genderView.man || 0 }}%，女性{{
						viewProfile.genderView.woman || 0
					}}%，未知{{ viewProfile.genderView.unknown || 0 }}%
				</p>
			</div>
			<div class="item" v-if="viewProfile.userRoleTypeView">
				<p class="title">店主比例</p>
				<p>
					店主比例{{ viewProfile.userRoleTypeView.buser || 0 }}%，顾客{{
						viewProfile.userRoleTypeView.cuser || 0
					}}%
				</p>
			</div>
		</div>
	</el-dialog>
</template>
<script>
import { saveOrUpdate, viewProfile } from '@/api/platformUserGroupTag'

export default {
	name: 'editGroupDialog',
	components: {},
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		row: {
			type: Object,
			default: () => ({}),
		},
		successCallback: {
			type: Function,
			default: () => () => {},
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
		return {
			isLoading: false,
			title: '创建人群',
			ruleForm: {
				groupName: '',
				groupExpression: '',
				configType: 2,
			},
			// 人群画像信息
			viewProfile: null,
			configTypeList: [
				{
					value: 1,
					desc: '可视化配置',
				},
				{
					value: 2,
					desc: '公式配置',
				},
			],
			fileList: [],
			rules: {
				groupName: [
					{ required: true, message: '请输入分群名称', trigger: 'blur' },
				],
				groupExpression: [
					{ required: true, message: '请输入人群条件公式', trigger: 'blur' },
				],
			},
		}
	},
	methods: {
		open() {
			const { row = {} } = this
			if (row.id) {
				this.title = '编辑人群'
				this.ruleForm = {
					...row,
					configType: row.configType || 2,
				}
				this.ruleForm.groupName = row.groupName
				this.ruleForm.groupExpression = row.groupExpression
			} else {
				this.title = '创建人群'
				this.ruleForm = {
					groupName: '',
					groupExpression: '',
					configType: 2,
				}
			}
			this.viewProfile = null
		},
		async submitForm() {
			const params = {
				...this.ruleForm,
				operatorId: this.$store.state.user.userInfo.userId,
				operator: this.$store.state.user.userInfo.userName,
			}

			// 编辑
			if (this.row.id) {
				params.id = this.row.id
			}

			const {
				data: { resultCode },
			} = await saveOrUpdate(params)

			if (resultCode === 0) {
				this.localVisible = false
				this.$message({
					message: this.row.id ? '保存人群成功!' : '新建人群成功!',
					type: 'success',
				})
				this.resetForm()
				this.successCallback && this.successCallback()
			}
		},
		// 调试
		async viewProfileTest() {
			// 加载中
			this.isLoading = true
			const { groupExpression = '' } = this.ruleForm
			if (!groupExpression) {
				this.$message({
					message: '请输入人群条件公式',
					type: 'warning',
				})
				this.isLoading = false
				return
			}
			try {
				const {
					data: { resultCode, resultData },
				} = await viewProfile({
					expression: groupExpression,
				})
				this.isLoading = false
				if (resultCode === 0) {
					this.viewProfile = resultData
				} else {
					this.viewProfile = null
				}
			} catch (err) {
				this.isLoading = false
			}
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.isLoading = false
			this.ruleForm = {
				groupName: '',
				groupExpression: '',
				configType: 2,
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.mb20 {
	margin-bottom: 20px;
}
.btns {
	text-align: right;
	margin-top: 20px;
}
.expression-input {
	font-size: 20px;
}
.test-result {
	background-color: #e2e2e2;
	padding: 20px;
	border-radius: 4px;
}
.total {
	font-size: 20px;
}
.item {
	margin-top: 40px;
	border-bottom: dashed 1px #c7c7c7;
}
.item .title {
	background-color: #f56c6c;
	padding: 10px 20px;
	border-radius: 4px;
	color: #fff;
	display: inline-block;
}
</style>

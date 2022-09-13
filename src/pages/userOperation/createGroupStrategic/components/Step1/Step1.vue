<template>
	<div>
		<WgForm
			ref="form"
			:actionInline="true"
			labelWidth="8em"
			:data="formData"
			:items="formCfg"
			:rules="rules"
		>
			<template #uoGroupList>
				<div class="userGroupTag">
					<div v-if="formData.uoGroupList && formData.uoGroupList.length">
						<el-tag
							:key="i"
							v-for="(tag, i) in formData.uoGroupList"
							:closable="!disabled"
							:disable-transitions="false"
							@close="handleUserGroupClose(tag)"
							class="tagItem"
						>
							{{ tag.userGroupName }}
						</el-tag>
					</div>
					<el-button
						@click="handleAddUserGroup"
						type="primary"
						icon="el-icon-plus"
						size="mini"
						:disabled="disabled"
					>
						选择分群
					</el-button>
				</div>
			</template>
		</WgForm>

		<!-- 用户分群选择 -->
		<UserGroupSelect
			:visible.sync="UserGroupDialog"
			:userIdentity.sync="formData.userIdentity"
			:userGroupList.sync="formData.uoGroupList"
			@saveUserGroup="saveUserGroup"
		></UserGroupSelect>
	</div>
</template>

<script>
import WgForm from '@/components/WgForm'
import UserGroupSelect from './UserGroupSelect'

export default {
	name: 'Step1',
	components: {
		WgForm,
		UserGroupSelect,
	},
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
		strategyConfig: {
			Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			formCfg: [
				{
					disabled: this.disabled,
					title: '选择触发类型',
					type: 'radio',
					dataIndex: 'userIdentity',
					label: 'value',
					change: () => {
						// this.aCommission()
						console.log('change triggerType')
					},
					options: [
						{
							userIdentity: 0,
							value: '店主',
						},
					],
				},
				{
					title: '选择用户分群',
					type: 'custom',
					dataIndex: 'uoGroupList',
				},
			],
			rules: {
				userIdentity: [
					{ required: true, message: '请选择触发类型', trigger: 'change' },
				],
				uoGroupList: [
					{ required: true, message: '请选择用户分群', trigger: 'change' },
				],
			},
			formData: {
				userIdentity: 0,
				uoGroupList: [],
			},
			UserGroupDialog: false,
		}
	},
	mounted() {
		this.initFormData()
	},
	watch: {
		strategyConfig() {
			this.initFormData()
		},
	},
	methods: {
		initFormData() {
			const uoGroupList =
				this.strategyConfig.uoGroupList?.map((item) => ({
					userGroupId: item.groupId,
					userGroupName: item.groupName,
				})) || []
			this.formData.uoGroupList = uoGroupList
		},
		handleUserGroupClose(tag) {
			this.formData.uoGroupList.splice(
				this.formData.uoGroupList.indexOf(tag),
				1
			)
			this.changeFormDataForSubmit()
		},
		handleAddUserGroup() {
			this.UserGroupDialog = true
		},

		changeFormDataForSubmit() {
			this.strategyConfig.uoGroupList = this.formData.uoGroupList.map(
				(item) => ({
					groupId: item.userGroupId,
					groupName: item.userGroupName,
				})
			)
		},

		saveUserGroup(val) {
			this.formData.uoGroupList = val
			this.changeFormDataForSubmit()
		},
		submitForm() {
			// 校验表单
			return new Promise((resolve, reject) => {
				this.$refs.form.$refs.WgForm.validate((valid) => {
					if (valid) {
						resolve(this.strategyConfig)
					} else {
						reject(new Error('校验失败'))
					}
				})
			})
		},
		saveForm() {
			// 保存表单
			return new Promise((resolve) => {
				resolve(this.strategyConfig)
			})
		},
	},
}
</script>

<style>
.btns {
	float: right;
	margin-right: 10px;
}

.cronExpression {
	margin: 10px 0;
}

.tagItem {
	margin-right: 10px;
}
</style>

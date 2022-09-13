<template>
	<div>
		<el-dialog
			width="800px"
			:title="editRow.id ? '编辑测试' : '新增测试'"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<yx-form
				ref="form"
				v-loading="showLoading"
				:inline="false"
				:items="item"
				:data="formData"
				:rules="formRules"
				labelWidth="120px"
				:formAction="formAction"
			>
				<template #testName>
					<el-input v-model.trim="formData.testName" maxlength="20"></el-input>
				</template>
				<template #expiryDateType>
					<el-date-picker
						v-model="formData.time"
						type="datetimerange"
						:default-time="['00:00:00', '23:59:59']"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
					></el-date-picker>
				</template>
				<template #groupId>
					<div class="groupId">
						<el-tag class="tagItem" v-if="formData.groupId">
							{{ formData.groupId }}
						</el-tag>
						<el-button
							@click="handleAddTestId"
							type="primary"
							icon="el-icon-plus"
							size="mini"
							:disabled="editRow.id"
						>
							选择活动
						</el-button>
						<span class="tips">选择需要对齐的测试活动</span>
					</div>
				</template>
				<template #description>
					<el-input
						type="textarea"
						v-model.trim="formData.description"
						maxlength="100"
						:autosize="{ minRows: 2, maxRows: 4 }"
					></el-input>
				</template>
			</yx-form>
		</el-dialog>

		<!-- 档期选择 -->
		<addGroupIdDialog
			:visible.sync="addGroupIdVisible"
			:mainRow="mainRow"
			@save="saveGroupId"
		></addGroupIdDialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import moment from 'moment'
import addGroupIdDialog from './addGroupIdDialog'
import { addOrUpdate } from '@/api/abTest'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		editRow: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm,
		addGroupIdDialog,
	},

	data() {
		return {
			mainRow: {},
			addGroupIdVisible: false,
			item: [
				{
					title: '测试名称',
					placeholder: '测试名称,最多可填写20个字符',
					dataIndex: 'testName',
					maxlength: 20,
				},
				{
					title: '测试时间',
					type: 'custom',
					dataIndex: 'expiryDateType',
				},
				{
					title: '流量分配模式',
					type: 'radio',
					dataIndex: 'testType',
					label: 'text',
					options: [
						{
							text: '按用户ID分配',
							testType: 1,
						},
						{
							text: '随机混淆',
							testType: 2,
						},
					],
					change: (val) => {
						const GroupIdIndex = this.item.findIndex(
							(item) => item.dataIndex === 'groupId'
						)
						if (val !== 2) {
							this.item[GroupIdIndex].hide = true
						} else {
							this.item[GroupIdIndex].hide = false
						}
					},
				},
				{
					title: '流量因子',
					type: 'custom',
					dataIndex: 'groupId',
					hide: true,
				},
				{
					title: '活动描述',
					placeholder: '活动描述,最多可填写100个字',
					type: 'custom',
					dataIndex: 'description',
					maxlength: 100,
				},
			],
			dialogFormVisible: false,
			showLoading: false,
			dialogBrandVisible: false,
			formData: this.getForm(),
			formRules: {
				testName: [
					{
						required: true,
						message: '请输入测试名称!',
						trigger: ['blur', 'change'],
					},
					{
						validator: (rule, value, callback) => {
							const pattern = /^\s+$/
							// eslint-disable-next-line no-useless-escape
							const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im
							const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
							if (pattern.test(value)) {
								callback(new Error('测试名称不能为空'))
							} else if (regEn.test(value) || regCn.test(value)) {
								callback(new Error('测试名称不能包含特殊字符'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				expiryDateType: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (
								!this.formData.time ||
								(this.formData.time && !this.formData.time.length)
							) {
								callback(new Error('请选择测试时间范围'))
							}
							callback()
						},
						trigger: ['blur', 'change'],
					},
				],
				testType: [
					{
						required: true,
						message: '请选择流量分配模式!',
					},
				],
			},
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
			],
		}
	},
	watch: {
		localVisible(val) {
			this.formData = this.getForm()
			if (!val) {
				this.formData = {}
			} else {
				this.formData.testName = this.editRow.testName
				this.formData.description = this.editRow.description
				this.formData.time = [this.editRow.startTime, this.editRow.endTime]
				this.formData.testType = this.editRow.testType || 1
				this.formData.groupId = this.editRow.groupId
				const GroupIdIndex = this.item.findIndex(
					(item) => item.dataIndex === 'groupId'
				)
				const testTypeIndex = this.item.findIndex(
					(item) => item.dataIndex === 'testType'
				)
				// 编辑状态不能修改流量因子
				if (this.editRow.id) {
					this.item[GroupIdIndex].disabled = true
					this.item[testTypeIndex].disabled = true
				} else {
					this.item[GroupIdIndex].disabled = false
					this.item[testTypeIndex].disabled = false
				}
				// 选择了“随机混淆”， 展示活动选择
				if (this.formData.testType !== 2) {
					this.item[GroupIdIndex].hide = true
				} else {
					this.item[GroupIdIndex].hide = false
				}

				console.log('this.form', this.formData)
			}
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
	methods: {
		getForm() {
			return {
				testName: '',
				time: '',
				description: '',
				testType: 1,
				groupId: '',
			}
		},
		handleAddTestId() {
			this.mainRow = {
				...this.editRow,
				...this.formData,
			}
			this.addGroupIdVisible = true
		},
		saveGroupId(msg) {
			console.log('msg>>', msg)
			this.editRow.groupId = msg.groupId
			this.formData.groupId = msg.groupId
		},
		// 提交
		submitForm: async function () {
			if (!this.formData.testName) {
				return this.$message.error('请填写测试名称')
			}
			if (
				!this.formData.time ||
				(this.formData.time && !this.formData.time.length)
			) {
				return this.$message.error('请选择测试时间范围')
			}
			this.formData.startTime = moment(this.formData.time[0]).format(
				'YYYY-MM-DD HH:mm:ss'
			)
			this.formData.endTime = moment(this.formData.time[1]).format(
				'YYYY-MM-DD HH:mm:ss'
			)

			let param = {
				testName: this.formData.testName,
				startTime: this.formData.startTime,
				endTime: this.formData.endTime,
				testType: this.formData.testType,
				groupId: this.formData.groupId,
			}
			let resultCode = ''
			if (this.formData.description) {
				param.description = this.formData.description
			}
			if (this.editRow.id) {
				param.id = this.editRow.id
			}

			try {
				let data = await addOrUpdate(param)
				resultCode = data.data.resultCode

				if (resultCode == 0) {
					let msg = this.editRow.id ? '编辑成功' : '添加成功'
					this.$message({
						message: msg,
						type: 'success',
					})
					setTimeout(() => {
						this.localVisible = false
						this.$emit('Refresh', true)
					}, 1000)
				}
			} catch (e) {
				// this.$message.error('添加失败，请稍后再试')
			}
		},
		// 关闭弹窗
		resetForm() {
			console.log(111111, this.$refs.form.$refs.YxForm)
			this.$refs.form && this.$refs.form.$refs.YxForm.resetFields()
			this.localVisible = false
		},
	},
}
</script>

<style lang="scss" scoped>
.tagItem {
	margin-right: 10px;
}

.tips {
	margin-left: 10px;
	color: #9d9d9d;
}
</style>

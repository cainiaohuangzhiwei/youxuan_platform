<template>
	<div>
		<el-dialog
			width="500px"
			:title="titleMap[title]"
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
				<template #parameter v-if="title == 2 || title == 4">
					<el-button class="btn" @click="cutParameter">+新增参数 </el-button>
					<div
						class="time"
						:class="{ adorn: counter.length === 0 }"
						v-if="parameterShow"
					>
						<p v-for="(item, index) in counter" :key="index">
							参数{{ index }}:<el-input
								v-model="item.parameter"
								placeholder="请填写参数名称"
								style="width: 200px"
								type="text"
							></el-input>
							<el-button type="danger" @click="thisSplice(index)"
								>删除</el-button
							>
						</p>
					</div>
				</template>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { addErp, projectAdd, projectUpdate } from '@/api/YhtPlusCmsErpAction'
import { isNull } from '@/utils/helper/common'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: '',
		},
	},

	components: {
		YxForm,
	},

	data() {
		return {
			erpIds: '',
			outsideAccessSettingIds: '',
			parameterShow: true,
			counter: [],
			titleMap: {
				1: '新增(我方)',
				2: '新增(对方)',
				3: '编辑ERP',
			},
			item: [
				{
					type: 'input',
					title: 'ERP名称',
					dataIndex: 'erpName',
					placeholder: '请输入ERP名称',
				},
				{
					type: 'radio',
					title: '是否启用',
					dataIndex: 'whether',
					label: 'value',
					options: [
						{
							whether: 0,
							value: '是',
						},
						{
							whether: 1,
							value: '否',
						},
					],
				},
				{
					type: 'custom',
					dataIndex: 'parameter',
				},
			],
			funData: {
				erpName: '',
				whether: 0,
			},
			funRules: {
				erpName: [
					{ required: true, message: '请输入ERP名称', trigger: 'blur' },
				],
				whether: [{ required: true, message: '请选择状态', trigger: 'blur' }],
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
			queryParam: {},
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

	methods: {
		// 删除
		thisSplice(index) {
			this.counter.splice(index, 1)
		},
		// 添加
		cutParameter() {
			this.counter.push({})
			this.parameterShow = true
		},

		// 回显
		detail(row) {
			if (this.title == 3) {
				this.erpIds = row.erpId
				this.funData.erpName = row.erpName
				this.funData.disabled = row.disabled
			} else {
				this.outsideAccessSettingIds = row.outsideAccessSettingId
				this.funData.erpName = row.projectName
				this.funData.disabled = row.status
				this.endOrderTimeShow = true
				const addEndParameterList = row.parameter.split(',')
				this.counter = addEndParameterList.map((item) => {
					let splitOne = item.split('"')
					return {
						parameter: splitOne[1],
					}
				})
			}
		},

		// 保存
		async submitForm() {
			const typeMap = {
				1: 1,
				2: 2,
				3: 1,
				4: 2,
			}

			this.funData.groupId = 2
			this.funData.type = typeMap[this.title]
			this.addErp()
		},

		// 新增
		async addErp() {
			const paramsData = Object.assign(this.funData)
			let addUrl
			paramsData.disabled = this.funData.whether
			if (this.erpIds) {
				paramsData.erpId = this.erpIds
			}
			if (this.title == 1 || this.title == 3) {
				addUrl = addErp
			} else {
				paramsData.projectName = this.funData.erpName
				paramsData.status = this.funData.whether == 1 ? 0 : 1
				paramsData.parameter = this.counter.map((item) => {
					return item.parameter
				})
				if (this.title == 2) {
					addUrl = projectAdd
				} else {
					paramsData.outsideAccessSettingId = this.outsideAccessSettingIds
					addUrl = projectUpdate
				}
				if (paramsData.parameter.length == 0 || isNull(paramsData.parameter)) {
					this.$message({
						message: '请填写参数',
						type: 'warning',
					})
					return
				}
				for (let i = 0; i < paramsData.parameter.length; i++) {
					if (
						paramsData.parameter[i] == undefined ||
						isNull(paramsData.parameter[i])
					) {
						this.$message({
							message: '请填写参数',
							type: 'warning',
						})
					}
				}
			}
			delete this.funData.whether
			const res = await addUrl(paramsData)
			if (res.data.resultCode == 0) {
				this.$message.success(res.data.resultMsg)
				this.resetForm()
				if (this.title == 1 || this.title == 3) {
					this.$emit('fatherMethodOne')
				} else if (this.title == 2 || this.title == 4) {
					this.$emit('fatherMethodTwo')
				}
			}
		},

		// 关闭弹窗
		resetForm() {
			this.counter = []
			this.funData.erpName = ''
			this.funData.whether = 0
			this.localVisible = false
			this.$refs.form.$refs.YxForm.resetFields()
		},
	},
}
</script>

<style lang="scss" scoped></style>

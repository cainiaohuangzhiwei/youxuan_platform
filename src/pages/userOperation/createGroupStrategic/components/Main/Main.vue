<template>
	<basic-container>
		<el-steps :active="active" :space="400">
			<el-step
				:icon="item.icon"
				v-for="(item, index) in stepsConfig"
				:key="index"
			>
				<template v-slot:icon>
					<span
						@click="changeActive(index)"
						:class="item.icon + ' iconSize pointer'"
					></span>
				</template>
				<template v-slot:title>
					<span @click="changeActive(index)" class="pointer">
						{{ item.title }}
					</span>
				</template>
			</el-step>
		</el-steps>

		<div class="step-content">
			<Step1
				ref="Step1"
				v-if="active === 1"
				:disabled="disabled"
				:strategyConfig.sync="strategyConfig"
			/>
			<Step2
				ref="Step2"
				v-if="active === 2"
				:disabled="disabled"
				:strategyConfig.sync="strategyConfig"
			/>
			<Step3
				ref="Step3"
				v-if="active === 3"
				:disabled="disabled"
				:strategyConfig.sync="strategyConfig"
			/>
			<Step4
				ref="Step4"
				v-if="active === 4"
				:disabled="disabled"
				:strategyConfig.sync="strategyConfig"
			/>
		</div>

		<div class="option-btns" v-if="!disabled">
			<el-button size="big" type="danger" plain @click="prev" v-if="active > 1"
				>上一步</el-button
			>
			<el-button size="big" type="danger" plain @click="next" v-if="active < 3"
				>下一步</el-button
			>
			<el-button size="big" type="primary" @click="saveDraft"
				>保存为草稿</el-button
			>
			<el-button size="big" type="success" @click="save">保存</el-button>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import { setViewTitle } from '@/utils/helper/common'
import { seeConfig, saveDraft, checkAndSaveStrategy } from '@/api/userOperation'
import { OPTION_TYPE } from '../../../groupConfiguration/components/constants'
import Step1 from '../Step1/Step1'
import Step2 from '../Step2/Step2'
import Step3 from '../Step3/Step3'
import Step4 from '../Step4/Step4'

export default {
	components: {
		BasicContainer,
		// WgTable,
		Step1,
		Step2,
		Step3,
		Step4,
	},
	name: 'FormTable',
	data() {
		return {
			// 策略配置
			strategyConfig: {},
			// 当前的操作类型, 新建、编辑、查看
			currentOptionType: '',
			disabled: false,
			active: 1,
			stepsConfig: [
				{
					id: 1,
					icon: 'el-icon-user',
					title: '受众人群',
				},
				{
					id: 2,
					icon: 'el-icon-time',
					title: '触发条件',
				},
				{
					id: 3,
					icon: 'el-icon-medal',
					title: '营销配置',
				},
				{
					id: 4,
					icon: 'el-icon-loading',
					title: '执行情况',
				},
			],
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.currentOptionType = this.$route.params.type
			if (this.currentOptionType !== OPTION_TYPE.VIEW) {
				this.stepsConfig = this.stepsConfig.filter((item) => item.id !== 4)
			} else {
				// 查看执行情况， 不可编辑
				setViewTitle(this.$store, this.$route, null, '查看配置步骤')
				this.disabled = true
			}
			this.getStrategyConfig()
		},
		async getStrategyConfig() {
			const {
				data: { resultCode, resultData },
			} = await seeConfig({
				strategyId: this.$route.params.id,
			})

			if (resultCode === 0) {
				const config = this.formatDataToEdit(resultData)
				this.strategyConfig = config
			}
		},
		// 保存为草稿
		async saveDraft() {
			const currentFormVals = await this.saveFormValue(this.active)
			const saveDraftParams = this.formatSaveDraftParams(currentFormVals)
			const {
				data: { resultCode },
			} = await saveDraft(saveDraftParams)
			if (resultCode === 0) {
				this.$message({
					message: '保存草稿成功！',
					type: 'success',
				})
			}
		},
		// 格式化数据
		formatSaveDraftParams(params) {
			return {
				...params,
				uoStrategyId: this.$route.params.id,
			}
		},
		// 返回为编辑模式
		formatDataToEdit(data) {
			const strategyConfig = {
				...data,
			}
			return strategyConfig
		},
		// 保存
		save() {
			// 确认提示
			this.$confirm('策略将保存为待启用状态', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					const currentFormVals = await this.saveFormValue(this.active)
					const saveParams = this.formatSaveDraftParams(currentFormVals)
					const {
						data: { resultCode },
					} = await checkAndSaveStrategy(saveParams)
					if (resultCode === 0) {
						this.$message({
							message: '保存成功',
							type: 'success',
						})

						// 返回策略列表页面
						console.log('params::', this.$route.params)

						setTimeout(() => {
							this.$router.push({
								name: 'StrategicManagement',
								params: {
									id: this.$route.params.uoStrategyGroupId,
									groupName: this.$route.params.groupName,
								},
							})
						}, 1000)
					}
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消保存',
					})
				})
		},

		async prev() {
			if (this.active > 1) {
				const currentFormVals = await this.saveFormValue(this.active)
				const saveDraftParams = this.formatSaveDraftParams(currentFormVals)
				if (currentFormVals && saveDraftParams) {
					this.strategyConfig = saveDraftParams
					this.active--
				}
			}
		},

		async next() {
			if (this.active < 4) {
				const currentFormVals = await this.saveFormValue(this.active)
				const saveDraftParams = this.formatSaveDraftParams(currentFormVals)
				if (currentFormVals && saveDraftParams) {
					this.strategyConfig = saveDraftParams
					this.active++
				}
			}
		},

		// 校验表单
		async checkFormValue(index) {
			try {
				const formValue = await await this.$refs[`Step${index}`].submitForm()
				return formValue
			} catch (error) {
				// this.$message({
				// 	type: 'error',
				// 	message: error,
				// })
				return false
			}
		},

		// 保存表单
		async saveFormValue(index) {
			try {
				const formValue = await await this.$refs[`Step${index}`].saveForm()
				return formValue
			} catch (error) {
				this.$message({
					type: 'error',
					message: error,
				})
				return false
			}
		},

		changeActive(index) {
			if (this.disabled) {
				this.active = index + 1
			}
		},
	},
}
</script>

<style>
.btns {
	float: right;
	margin-right: 10px;
}
.step-content {
	margin-top: 50px;
}
.option-btns {
	margin-top: 20px;
}
.iconSize {
	font-size: 30px;
}
.pointer {
	cursor: pointer;
}

.strategy .el-row {
	display: grid;
}
.strategy .el-row .el-col-6 {
	display: contents;
}
.messageCenter_keyword_input {
	width: 260px;
}
.wi {
	width: 500px;
}
</style>

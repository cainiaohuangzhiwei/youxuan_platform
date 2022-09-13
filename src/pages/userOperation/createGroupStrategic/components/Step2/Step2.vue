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
			<!-- 单次执行 -->
			<template slot="singleExecutionTime">
				<el-date-picker
					v-model="formData.singleExecutionTime"
					value-format="timestamp"
					type="datetime"
					format="yyyy-MM-dd HH:mm"
					placeholder="选择日期时间"
					default-time="11:00:00"
					:disabled="disabled"
					:picker-options="{
						disabledDate: (time) => {
							return time.getTime() < Date.now() - 8.64e7
						},
					}"
				/>
			</template>

			<!-- 重复执行 -->
			<template slot="cronList">
				<div>
					<div
						v-for="(item, index) in formData.cronList"
						:key="item.id"
						class="cron-item"
					>
						<CronEditor
							:value.sync="formData.cronList[index].value"
							:multipleLimit="1"
							:disabled="disabled"
							:allowedPeriods="allowedPeriods"
							defaultPeriod="month"
							@change="onCronChange"
						/>
						<i
							class="el-icon-close cronItemClose"
							@click="closeCron(item.id)"
							v-if="formData.cronList.length > 1 && !disabled"
						/>
					</div>
					<el-button
						v-if="formData.cronList.length < 5 && !disabled"
						@click="addCronList"
						><i class="el-icon-plus addCron" />添加触达时间</el-button
					>
				</div>
			</template>

			<!-- 选择触发条件 -->
			<template #uoConditionList>
				<ConditionEditor
					:uoConditionList.sync="formData.uoConditionList"
					:disabled="disabled"
					@change="onConditionChange"
				/>
			</template>

			<!-- 参与限制 -->
			<template #limitTriggerNumber>
				<div class="limitTriggerNumber">
					<el-select
						:disabled="disabled"
						class="limit-select"
						v-model="formData.limitTriggerTimeIndicators"
						filterable
						placeholder="请选择限制类型"
					>
						<el-option
							v-for="item in limitOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
					<el-input
						type="number"
						:min="0"
						:max="99999999"
						v-model="formData.limitTriggerNumber"
						:disabled="disabled"
						class="limit-number"
					></el-input>
					次
				</div>
			</template>
		</WgForm>
	</div>
</template>

<script>
import WgForm from '@/components/WgForm'
// import CronEditor from '@/components/CronEditor'
import CronEditor from 'ele-vue-cron'
import ConditionEditor from '../ConditionEditor/index'
import {
	TRIGGER_TYPE,
	EXECUTE_TYPE,
	LIMITTRIGGER,
	LIMITTRIGGER_MAP,
} from '../constants.js'
import moment from 'moment'

// 检验触达时间
const validateCron = (_rule, value, callback) => {
	if (value === '') {
		callback(new Error('请选择触达时间'))
	} else {
		callback()
	}
}
// 校验触发动作
const validateLimitTriggerNumber = (_rule, value, callback) => {
	if (value === '') {
		callback(new Error('请输入参与限制数'))
	} else if (value < 1 || value > 99999999) {
		callback(new Error('参与限制数必须在1-99999999之间'))
	} else {
		callback()
	}
}

// 校验触发动作
const validateuoConditionList = (_rule, value, callback) => {
	if (!value || value.length === 0) {
		callback(new Error('请配置触发动作'))
	} else {
		callback()
	}
}

export default {
	name: 'Step2',
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
	components: {
		WgForm,
		CronEditor,
		ConditionEditor,
	},
	data() {
		return {
			allowedPeriods: ['month', 'week', 'day'],
			allowedDropdowns: ['period', 'month-days', 'hours'],
			limitOptions: Object.keys(LIMITTRIGGER_MAP).map((key) => {
				return {
					label: LIMITTRIGGER_MAP[key],
					value: Number(key),
				}
			}),
			formCfg: [
				{
					title: '选择触发条件',
					type: 'radio',
					dataIndex: 'triggerType',
					label: 'value',
					disabled: this.disabled,
					change: (val) => {
						this.filterFormCol({
							...this.formData,
							triggerType: val,
						})
					},
					options: [
						{
							triggerType: TRIGGER_TYPE.TIMING,
							value: '定时型',
						},
						{
							triggerType: TRIGGER_TYPE.ACTION,
							value: '触发型-完成某动作',
						},
					],
				},
				{
					title: '选择类型',
					type: 'radio',
					dataIndex: 'executeType',
					disabled: this.disabled,
					hide: false,
					label: 'value',
					change: (val) => {
						this.filterFormCol({
							...this.formData,
							executeType: val,
						})
					},
					options: [
						{
							executeType: EXECUTE_TYPE.ONCE,
							value: '单次',
						},
						{
							executeType: EXECUTE_TYPE.REPEAT,
							value: '重复',
						},
					],
				},
				{
					title: '选择触达时间',
					type: 'custom',
					hide: false,
					dataIndex: 'singleExecutionTime',
				},
				{
					title: '选择触达时间',
					type: 'custom',
					hide: false,
					dataIndex: 'cronList',
				},
				{
					title: '在起止时间内完成下列事件后触达',
					type: 'custom',
					hide: false,
					dataIndex: 'uoConditionList',
				},
				{
					title: '起止时间',
					type: 'time',
					hide: false,
					disabled: this.disabled,
					dataIndex: 'startAndEndTime',
					placeholder: ['开始时间', '结束时间'],
					timeAttributes: {
						type: 'datetimerange',
					},
				},
				{
					title: '参与限制',
					type: 'custom',
					hide: false,
					dataIndex: 'limitTriggerNumber',
				},
			],
			rules: {
				triggerType: [
					{ required: true, message: '请选择触发类型', trigger: 'change' },
				],
				executeType: [
					{ required: true, message: '请选择类型', trigger: 'change' },
				],
				cronList: [
					{
						required: true,
						validator: validateCron,
						message: '请选择触达时间',
						trigger: 'change',
					},
				],
				singleExecutionTime: [
					{ required: true, message: '请选择触达时间', trigger: 'change' },
				],
				startAndEndTime: [
					{ required: true, message: '请选择起止时间', trigger: 'change' },
				],
				// endTime: [
				// 	{ required: true, message: '请选择起止时间', trigger: 'change' },
				// ],
				uoConditionList: [
					{
						required: true,
						validator: validateuoConditionList,
						message: '请配置触达动作',
						trigger: 'change',
					},
				],
				limitTriggerNumber: [
					{
						required: true,
						validator: validateLimitTriggerNumber,
						// message: '请填写参与限制',
						trigger: 'change',
					},
				],
			},
			formData: {
				triggerType: TRIGGER_TYPE.TIMING,
				executeType: EXECUTE_TYPE.ONCE,
				// 单次执行时间
				singleExecutionTime: '',
				// 重复执行时间
				// cron: '0 11 * * *',
				cronList: [
					{
						id: this.getRandomId(),
						value: '0 11 * * *',
					},
				],
				startTime: '', // 开始时间
				endTime: '', // 结束时间
				startAndEndTime: [], // 起止时间
				// 触发执行限制时间指标 0：每日 1：每周 2：每月
				limitTriggerTimeIndicators: LIMITTRIGGER.DAY,
				limitTriggerNumber: 1, // 限制触发次数
			},
		}
	},
	created: function () {
		this.initFormData()
	},
	watch: {
		strategyConfig() {
			this.initFormData()
		},
	},

	methods: {
		addCronList() {
			this.formData.cronList.push({
				id: this.getRandomId(),
				value: '0 11 * * *',
			})
		},
		getRandomId() {
			return Math.random().toString(36).substr(2)
		},
		closeCron(id) {
			// 从数组中删除
			const crons = [...this.formData.cronList]
			const index = crons.findIndex((item) => item.id === id)
			crons.splice(index, 1)
			this.formData.cronList = crons
		},
		initFormData() {
			this.formData = {
				...this.formData,
				...this.strategyConfig,
				executeType: this.strategyConfig.executeType || EXECUTE_TYPE.ONCE,
				limitTriggerNumber: this.strategyConfig.limitTriggerNumber || 1,
				uoConditionList: this.strategyConfig.uoConditionList || [],
				cronList: (this.strategyConfig.cronList &&
					this.strategyConfig.cronList.map((item) => ({
						id: this.getRandomId(),
						value: item,
					}))) || [
					{
						id: this.getRandomId(),
						value: '0 11 * * *',
					},
				],
			}

			if (this.strategyConfig.startTime && this.strategyConfig.endTime) {
				this.formData.startAndEndTime = [
					this.strategyConfig.startTime,
					this.strategyConfig.endTime,
				]
			}

			this.filterFormCol(this.formData)
		},

		// 保存条件
		onConditionChange(val) {
			this.formData.uoConditionList = val
		},

		// 处理数据， 去除部分不提交的数据
		formatData() {
			if (
				this.formData.startAndEndTime &&
				this.formData.startAndEndTime.length
			) {
				this.formData.startTime = moment(
					this.formData.startAndEndTime[0]
				).valueOf()
				this.formData.endTime = moment(
					this.formData.startAndEndTime[1]
				).valueOf()
			} else {
				this.formData.startTime = ''
				this.formData.endTime = ''
			}

			const changeData = { ...this.formData }

			// 根据triggerType 判断哪些数据需要提交
			if (changeData.triggerType === TRIGGER_TYPE.TIMING) {
				// 删除条件
				delete changeData.uoConditionList
				if (changeData.executeType === EXECUTE_TYPE.ONCE) {
					delete changeData.cronList
				}
			} else {
				delete changeData.executeType
				delete changeData.cronList
				delete changeData.singleExecutionTime
			}

			// 处理重复触发时间格式
			if (changeData.cronList && changeData.cronList.length) {
				changeData.cronList = changeData.cronList.map((item) => item.value)
			}

			return changeData
		},

		submitForm() {
			// 校验表单
			return new Promise((resolve, reject) => {
				this.$refs.form.$refs.WgForm.validate((valid) => {
					if (valid) {
						const formatData = this.formatData()
						resolve(formatData)
					} else {
						reject(new Error('校验失败'))
					}
				})
			})
		},

		saveForm() {
			// 校验表单
			return new Promise((resolve) => {
				const formatData = this.formatData()
				resolve(formatData)
			})
		},

		// 过滤表单配置
		filterFormCol(row) {
			// 触发类型切换
			if (row.triggerType === TRIGGER_TYPE.TIMING) {
				this.formCfg = this.formCfg.map((item) => {
					// 展示的项
					if (
						item.dataIndex === 'executeType' ||
						item.dataIndex === 'cronList' ||
						item.dataIndex === 'singleExecutionTime'
					) {
						item.hide = false
					}
					// 隐藏的项
					if (
						item.dataIndex === 'limitTriggerNumber' ||
						item.dataIndex === 'uoConditionList'
					) {
						item.hide = true
					}
					return item
				})

				// 选择类型切换
				if (row.executeType === EXECUTE_TYPE.ONCE) {
					this.formCfg = this.formCfg.map((item) => {
						if (
							item.dataIndex === 'cronList' ||
							item.dataIndex === 'startAndEndTime'
						) {
							item.hide = true
						}
						return item
					})
				} else {
					this.formCfg = this.formCfg.map((item) => {
						if (item.dataIndex === 'singleExecutionTime') {
							item.hide = true
						}

						if (item.dataIndex === 'startAndEndTime') {
							item.hide = false
						}
						return item
					})
				}
			} else {
				this.formCfg = this.formCfg.map((item) => {
					if (
						item.dataIndex === 'executeType' ||
						item.dataIndex === 'cronList' ||
						item.dataIndex === 'singleExecutionTime'
					) {
						item.hide = true
					}

					if (
						item.dataIndex === 'limitTriggerNumber' ||
						item.dataIndex === 'uoConditionList' ||
						item.dataIndex === 'startAndEndTime'
					) {
						item.hide = false
					}
					return item
				})
			}
		},

		onCronChange(cron) {
			console.log('cron:', cron)
			console.log('this.formData:', this.formData)
		},
	},
}
</script>

<style>
.btns {
	float: right;
	margin-right: 10px;
}
.limit-select {
	width: 100px;
}
.limitTriggerNumber .limit-number {
	display: inline-block;
	width: 90px;
}
.cron-item {
	margin-bottom: 10px;
	position: relative;
	display: flex;
}

.cronItemClose {
	font-size: 20px;
	margin: 10px 0 0 20px;
	cursor: pointer;
}
</style>

<template>
	<div v-loading="loading">
		<el-dialog
			width="800px"
			:title="parseAction[actionType]"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			:destroy-on-close="true"
		>
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="事件ID" prop="eventId" :rules="rules.eventId">
					<el-input
						v-model="form.eventId"
						:disabled="actionType === 'check'"
					></el-input>
				</el-form-item>
				<el-form-item label="事件名称">
					<el-input
						v-model="form.eventDesc"
						maxlength="20"
						show-word-limit
						:disabled="actionType === 'check'"
					></el-input>
				</el-form-item>
				<el-form-item label="客户端" prop="appId" :rules="rules.appId">
					<el-select
						v-model="form.appId"
						placeholder="请选择客户端"
						:disabled="actionType === 'check'"
					>
						<el-option
							v-for="item in appMatch"
							:key="item"
							:label="appIds[item]"
							:value="item"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="上线状态">
					<el-select
						v-model="form.status"
						placeholder="请选择客户端"
						:disabled="actionType === 'check'"
					>
						<el-option label="上线" :value="1"></el-option>
						<el-option label="下线" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<div v-for="(item, index) in form.propertyDTO" :key="index">
					<el-form-item
						:label="index == 0 ? '事件属性' : ''"
						:prop="'propertyDTO.' + index + '.name'"
						:rules="rules.name"
					>
						<div class="box">
							<div class="box_left">
								<el-button type="primary">{{ 'b' + (11 + index) }}</el-button>
								<el-input
									v-model="item.name"
									style="width: 200px"
									:disabled="actionType === 'check'"
								></el-input>
							</div>
							<div class="box_right">
								<span style="margin-right: 10px">属性值格式</span>
								<el-select
									v-model="item.type"
									placeholder="请选择"
									style="width: 100px"
									:disabled="actionType === 'check'"
								>
									<el-option label="字符串" value="string"></el-option>
									<el-option label="数值" value="int"></el-option>
									<el-option label="日期时间" value="date"></el-option>
								</el-select>
							</div>
						</div>
					</el-form-item>
				</div>
				<el-form-item v-if="actionType !== 'check'">
					<el-button type="text" @click="handleAdd()" size="medium"
						>添加属性</el-button
					>
					<el-button
						type="text"
						style="color: #ff0000; margin-left: 15px"
						size="medium"
						@click="handleDel()"
						>删除属性</el-button
					>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click="resetForm">取 消</el-button>
				<el-button
					v-if="actionType !== 'check'"
					type="primary"
					@click="handleSave()"
					>保存</el-button
				>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import {} from '@/api/supplierGoodsAudit'
import { createDotEvent, getDotEvent, editDotEvent } from '@/api/statistics'

const appIds = {
	Yz2mTekVFboxyHnL: '云货优选小程序',
	BqejjxBr6bKKPHFu: 'B端APP',
	C01x2etKsWMwdGGB: 'C端APP',
	ZjdhWKtS2NFg8nxX: '直播APP',
	QIdLQuSPH3iadna6: '芊鱼APP',
}
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		buriedRow: {
			type: Object,
			default: () => ({}),
		},
		actionType: {
			type: String,
			default: 'create',
		},
	},

	components: {},

	data() {
		const validId = (rule, value, callback) => {
			let reg = /^\d+$/
			if (!reg.test(value)) {
				callback(new Error('事件ID必须是由数字组合'))
			} else {
				callback()
			}
		}
		return {
			form: {
				eventId: '',
				eventDesc: '',
				appName: '',
				appId: '',
				status: 1,
				propertyDTO: [
					{
						name: '',
						type: 'string',
					},
				],
			},
			appIds,
			appMatch: Object.keys(appIds),
			rules: {
				name: [
					{
						required: true,
						message: '请输入事件属性',
						trigger: ['blur', 'change'],
					},
				],
				eventId: [
					{
						trigger: ['blur', 'change'],
						validator: validId,
					},
					{
						required: true,
						message: '请输入事件ID',
						trigger: ['blur', 'change'],
					},
				],
				appId: [
					{
						required: true,
						message: '请选择客户端',
						trigger: ['blur', 'change'],
					},
				],
			},
			parseAction: {
				create: '新增',
				edit: '编辑',
				check: '查看',
			},
			loading: false,
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
		handleAdd() {
			if (this.form.propertyDTO.length == 30) {
				this.$message.warning('属性值目前最多可以添加30个')
				return
			}
			this.form.propertyDTO.push({
				name: '',
				type: 'string',
				eventconfigId: isNaN(this.form.id) ? this.form.id : undefined,
			})
			this.$forceUpdate()
		},
		handleDel() {
			if (this.form.propertyDTO.length == 1) {
				this.$message.warning('属性值至少拥有一个')
				return
			}
			this.form.propertyDTO.pop()
			this.$forceUpdate()
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.form = this.$options.data().form
			this.$refs.form.resetFields()
		},
		getDetail(id) {
			this.loading = true
			getDotEvent({ id })
				.then((res) => {
					if (res && res.data && res.data.resultCode === 0) {
						const propertyDTO = []
						const obj = res.data.resultData.obj
						res.data.resultData.pro.forEach((item) => {
							propertyDTO.push({
								name: item.name,
								eventconfigId: item.eventconfigId,
								type: item.type,
							})
						})
						if (!propertyDTO.length) {
							this.form.propertyDTO = [
								{
									name: '',
									eventconfigId: obj.id,
									type: 'string',
								},
							]
						} else {
							this.form.propertyDTO = propertyDTO
						}

						this.form = Object.assign(this.form, obj)
					}
				})
				.finally(() => {
					this.loading = false
				})
		},
		// 提交数据
		handleSave() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.submitData()
				}
			})
		},
		submitData() {
			const _form = this.form
			this.loading = true
			const data = {
				..._form,
				appName: this.appIds[_form.appId],
			}
			this.loading = true
			if (this.actionType === 'edit') {
				editDotEvent(data)
					.then((res) => {
						if (res.data && res.data.resultData) {
							if (res.data.resultData.resultCode == 0) {
								this.resetForm()
								this.$emit('refreshList')
							} else {
								this.$message.error(res.data.resultData.resultMsg)
							}
						}
					})
					.finally(() => {
						this.loading = false
					})
			} else if (this.actionType === 'create') {
				createDotEvent(data)
					.then((res) => {
						if (res.data && res.data.resultData) {
							if (res.data.resultData.resultCode == 0) {
								this.resetForm()
								this.$emit('refreshList')
							} else {
								this.$message.error(res.data.resultData.resultMsg)
							}
						}
					})
					.finally(() => {
						this.loading = false
					})
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.inline {
	display: inline-block;
}
.box {
	display: flex;
	align-items: center;
	justify-content: flex-start;
}
.box_left {
	display: flex;
	margin-right: 30px;
}

.box_right {
	display: flex;
}
</style>

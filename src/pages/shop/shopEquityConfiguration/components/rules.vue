<template>
	<div>
		<yx-form
			:inline="true"
			:data="formData187"
			:items="formCfg187"
			:formAction="formAction187"
		>
		</yx-form>
		<yx-table
			v-loading="loading"
			:columns="tableColumns188"
			:pagination="page188"
			:data="tableData188"
		>
		</yx-table>
		<Dialog
			:title="dialogTitle198"
			:visible.sync="dialogVisible198"
			:width="dialogWidth198"
			:bottomBtn="dialogTitle198 == '查看详情' ? '' : dialogBottomBtn189"
			@before-close="
				() => {
					dialogVisible198 = false
					formData189 = {
						ruleName: '',
						value1: '',
						value2: '',
						equityImgUrl: [],
						equityLevelType: '1',
						remark: '',
					}
				}
			"
		>
			<yx-form
				v-loading="loading189"
				ref="dialog189"
				labelWidth="120px"
				:data="formData189"
				:items="formCfg189"
				:rules="formRules189"
				:formDisabled="dialogTitle198 == '查看详情'"
			>
				<template slot="tip">
					<div>图片尺寸大小需要限制：最高不能超过16px，最宽不能超过100px</div>
				</template>
				<template slot="equityLevelType">
					<div style="margin-bottom: 20px">
						<el-radio
							v-model="equityLevelType"
							:disabled="editForbid"
							@change="equityChange"
							label="1"
							>类型一</el-radio
						>
						<el-select
							:disabled="editForbid"
							v-model="formData189.value1"
							placeholder="请选择"
						>
							<el-option
								v-for="item in options1"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</div>
					<div>
						<el-radio
							:disabled="editForbid"
							v-model="equityLevelType"
							@change="equityChange"
							label="2"
							>类型二</el-radio
						>
						<el-select
							:disabled="editForbid"
							v-model="formData189.value2"
							placeholder="请选择"
						>
							<el-option
								v-for="item in options2"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</div>
				</template>
			</yx-form>
		</Dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import { getBigImg } from '@/utils/imageTool'
import { uploadMultipleFile } from '@/api/image'
import {
	addConfiguration,
	queryList,
	updateById,
} from '@/api/actEquityLevelRule'
export default {
	components: {
		YxForm,
		YxTable,
		Dialog,
	},
	computed: {
		formCfg189() {
			return [
				{
					type: 'input',
					title: '配置名称',
					dataIndex: 'ruleName',
					disabled: this.editForbid,
				},
				{
					type: 'uploadImageDraggable',
					title: '权益标签图片',
					dataIndex: 'equityImgUrl',
					uploadAttributes: {
						limit: 1,
						// isEdit: true,
						imageName: 'equityImgUrl',
						beforeAvatarUpload: (file) => this.beforeAvatarUpload(file, 1),
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'equityImgUrl'),
					},
				},
				{
					type: 'custom',
					title: '',
					dataIndex: 'tip',
				},
				{
					type: 'custom',
					title: '保底权益等级',
					dataIndex: 'equityLevelType',
					label: 'value',
				},
				{
					type: 'textarea',
					title: '备注',
					dataIndex: 'remark',
					maxlength: 100,
					autosize: {
						minRows: 5,
						maxRows: 9,
					},
				},
			]
		},
	},
	data() {
		return {
			loading189: false,
			ruleId: null,
			equityLevelType: '1',
			formData189: {
				ruleName: '',
				value1: '',
				value2: '',
				equityImgUrl: [],
				level: '',
				remark: '',
			},
			options1: [
				{
					value: 2,
					label: '正式店主',
				},
				{
					value: 3,
					label: '进阶店主',
				},
			],
			options2: [
				{
					value: 4,
					label: '优秀服务商',
				},
				{
					value: 5,
					label: '签约服务商',
				},
			],
			formRules189: {
				ruleName: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入配置名称'))
							} else if (value.length > 10) {
								callback(new Error('不超过10字'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				equityLevelType: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (
								(this.equityLevelType == 1 && !this.formData189.value1) ||
								(this.equityLevelType == 2 && !this.formData189.value2)
							) {
								callback(new Error('请选择保底权益等级'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
			},
			dialogTitle198: '添加配置',
			dialogVisible198: false,
			dialogWidth198: '650px',
			dialogBottomBtn189: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.$refs.dialog189.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this._levelEquityRulesSave()
							}
						})
					},
				},
			],
			editForbid: false,
			loading: false,
			tableColumns188: [
				{
					type: 'string',
					dataIndex: 'ruleId',
					title: 'ID',
				},
				{
					type: 'string',
					dataIndex: 'addTime',
					title: '添加时间',
					// customRender: ({ addTime }) => {
					// 	return `${addTime[0]}-${addTime[1]}-${addTime[2]} ${addTime[3]}:${addTime[4]}:${addTime[5]}`
					// },
				},
				{
					type: 'string',
					dataIndex: 'ruleName',
					title: '权益名称',
				},
				{
					type: 'newMap',
					dataIndex: 'equityLevel',
					title: '保底等级',
					options: [
						['2', '正式店主'],
						['3', '进阶店主'],
						['4', '优秀服务商'],
						['5', '签约服务商'],
					],
				},
				{
					type: 'string',
					dataIndex: 'optUserName',
					title: '操作人',
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '查看详情',
							click: (row) => {
								this.editForbid = false
								this.echo(row)
								this.dialogTitle198 = '查看详情'
							},
						},
						{
							auth: 'updateById',
							title: '编辑',
							click: (row) => {
								this.editForbid = true
								this.echo(row)
								this.dialogTitle198 = '编辑规则'
							},
						},
					],
				},
			],
			page188: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._levelEquityRulesPage()
				},
			},
			tableData188: [],
			formData187: {
				ruleName: '',
				// startTime: '',
				// endTime: '',
				// addTime: moment().startOf('month').valueOf(),
				// endTime: moment().endOf('month').valueOf(),
			},
			formCfg187: [
				{
					type: 'input',
					dataIndex: 'ruleName',
					title: '权益规则名称',
				},
				{
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					title: '添加时间',
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
			],
			formAction187: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._levelEquityRulesPage(true)
					},
				},
				{
					title: '重置',
					isClear: true,
				},
				{
					auth: 'addConfiguration',
					title: '新建权益规则',
					type: 'success',
					click: () => {
						this.dialogVisible198 = true
						this.editForbid = false
						this.dialogTitle198 = '添加规则'
						this.formData189 = {
							ruleName: '',
							equityImgUrl: [],
							equityLevelType: '1',
							remark: '',
						}
						this.$nextTick(() => {
							this.$refs.dialog189.$refs.YxForm.clearValidate()
						})
					},
				},
			],
		}
	},
	created() {
		this._levelEquityRulesPage(true)
	},
	methods: {
		equityChange(e) {
			if (e == 1) {
				this.formData189.value2 = ''
			} else {
				this.formData189.value1 = ''
			}
		},
		echo(row) {
			this.dialogVisible198 = true
			this.formData189.ruleName = row.ruleName
			this.equityLevelType = String(row.equityLevelType)
			if (row.equityLevelType == 1) {
				this.formData189.value1 = row.equityLevel
				this.formData189.value2 = ''
			} else {
				this.formData189.value1 = ''
				this.formData189.value2 = row.equityLevel
			}
			this.formData189.remark = row.remark
			this.ruleId = row.ruleId
			if (row.equityImgUrl) {
				this.formData189.equityImgUrl.push({
					equityImgUrl: row.equityImgUrl,
				})
			}
		},
		_levelEquityRulesSave: async function () {
			let paramJson = {
				ruleName: this.formData189.ruleName,
				equityImgUrl: this.formData189.equityImgUrl.length
					? this.formData189.equityImgUrl[0].equityImgUrl
					: '',
				remark: this.formData189.remark,
				optUserName: this.$store.state.user.userInfo.clerkName,
				optUserId: this.$store.state.user.userInfo.clerkId,
			}
			paramJson.equityLevelType = this.equityLevelType
			if (paramJson.equityLevelType == 1) {
				paramJson.equityLevel = this.formData189.value1
			} else {
				paramJson.equityLevel = this.formData189.value2
			}
			let Url = null
			if (this.dialogTitle198 == '编辑规则') {
				paramJson.ruleId = this.ruleId
				Url = updateById
			} else {
				Url = addConfiguration
			}
			console.log('入参：', paramJson)
			let {
				data: { resultCode },
			} = await Url(paramJson)
			if (resultCode == 0) {
				this.dialogVisible198 = false
				this.$message.success('成功')
				this.formData189 = {
					ruleName: '',
					equityImgUrl: [],
					equityLevelType: '1',
					remark: '',
				}
				this._levelEquityRulesPage()
			}
		},
		_levelEquityRulesPage: async function (flag) {
			let paramJson = this.findSearchParams188(flag)
			// let time = 24 * 60 * 60 * 1000 * 31
			// if (
			// 	moment(this.formData187.addTime).valueOf() -
			// 		moment(this.formData187.endTime).valueOf() >
			// 	time
			// ) {
			// 	return this.$message.warning('时间不能超过31天')
			// }
			this.loading = true
			const {
				data: { resultCode, resultData, total },
			} = await queryList(paramJson)
			if (resultCode == 0) {
				this.tableData188 = resultData
				this.page188.count = total
			}
			this.loading = false
		},
		findSearchParams188(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page188.currentPage = 1
			}
			const paramJson = Object.assign(this.formData187, {
				pageSize: this.page188.length,
				pageNum: this.page188.currentPage,
			})
			return paramJson
		},
		async beforeAvatarUpload(file, type) {
			let index = file.name.lastIndexOf('.')
			let format = file.name.substring(index + 1, file.name.length)
			let isType = /\.|png|jpg/i.test(format)
			if (!isType) {
				this.$message.warning('图片上传有误,仅支持上传png,jpg格式图片')
				return Promise.reject(isType)
			}
			const isSize = new Promise((resolve, reject) => {
				const url = window.URL || window.webkitURL
				const img = new Image()
				img.onload = function () {
					// 图片比例校验
					console.log(img.width, img.height, type)
					// if (!isType) {
					// 	reject(false)
					// }
					// if (type == 1) {
					const valid = img.width <= 100 && img.height <= 16
					// eslint-disable-next-line prefer-promise-reject-errors
					valid ? resolve() : reject(valid)
					// }
					// else {
					// 	const valid = img.width == 351 && img.height == 32
					// 	// eslint-disable-next-line prefer-promise-reject-errors
					// 	valid ? resolve() : reject(valid)
					// }
				}
				img.src = url.createObjectURL(file)
			}).then(
				() => {
					return file
				},
				(err) => {
					if (!isType) {
						this.$message.warning('图片上传有误,仅支持上传png,jpg格式图片')
					} else {
						this.$message.warning('图片尺寸不对')
					}
					return Promise.reject(err)
				}
			)
			return isType && isSize
		},
		async uploadImageHttpRequest(params, name) {
			//上传banner
			let formData = new FormData()
			// if (name == 'addMaterialBanner') {
			// 	formData.append('formId', '#addMaterialBanner')
			// formData.append('data', JSON.stringify({ imageType: 54 }))
			// } else if (name == 'addMaterialPoster') {
			// 	formData.append('formId', '#addMaterialPoster')
			// 	formData.append('data', JSON.stringify({ imageType: 54 }))
			// }
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadMultipleFile(formData)
			if (resultCode == 0) {
				resultData[0][name] = getBigImg(resultData[0].url)
				this.formData189[name] = resultData
			}
		},
	},
}
</script>

<style></style>

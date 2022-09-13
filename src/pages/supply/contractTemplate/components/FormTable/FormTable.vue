<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			>
			</yx-form>

			<el-row>
				<yx-table
					v-loading="loading"
					:columns="tableColumns"
					:selectionChange="selectionChange"
					:pagination="page"
					:data="templateList"
					><template slot="operating" slot-scope="scope">
						<el-button
							type="text"
							size="small"
							@click="openEditTeplateDialog(scope.row)"
							>编辑</el-button
						>
					</template>
					<template slot="optName" slot-scope="scope">
						<div>
							{{ scope.row.optName }}
						</div>
						<div>
							{{ scope.row.updateTime }}
						</div>
					</template>
				</yx-table>
			</el-row>
		</div>

		<Dialog
			:title="dialogTitle194"
			:visible.sync="dialogVisible194"
			:width="dialogWidth194"
			:bottomBtn="dialogBottomBtn194"
		>
			<yx-form
				ref="dialog194"
				labelWidth="130px"
				:data="formData194"
				:items="formCfg194"
				:rules="rules194"
			>
				<template #accessory>
					<el-upload
						class="w_file"
						ref="uploadFile"
						accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.wordprocessingml.template"
						:action="uploadAttachmentList"
						multiple
						:headers="uploadHead"
						:limit="1"
						:fileList="fileList"
						:auto-upload="true"
						:before-remove="beforeRemove"
						:on-exceed="handleExceed"
						:on-change="onChange"
						:http-request="
							(file) => {
								uploadImageHttpRequest(file)
							}
						"
					>
						<el-button class="mr20" icon="el-icon-plus" slot="trigger"
							>上传文件</el-button
						>
					</el-upload>
				</template>
				<template #effectiveStyle>
					<div style="margin-bottom: 10px">
						<el-radio
							v-model="formData194.effectiveStyle"
							label="ESTABLISHED"
							@change="changeRadio(1)"
							>签署时间<el-date-picker
								class="ml30"
								:disabled="disabledRadio"
								v-model="formData194.effectiveStartTime"
								type="datetime"
								placeholder="开始日期"
							>
							</el-date-picker
						></el-radio>
					</div>
					<div>
						<el-radio
							v-model="formData194.effectiveStyle"
							label="SIGN"
							@change="changeRadio(2)"
							><span>签署时间</span>
							<span class="ml30">签署后立刻生效</span>
						</el-radio>
					</div>
				</template>
				<template #dueStyle>
					<div style="margin-bottom: 10px">
						<el-radio
							v-model="formData194.dueStyle"
							@change="changeRadio(3)"
							label="ESTABLISHED"
							>签署时间<el-date-picker
								class="ml30"
								:disabled="disabledPicker"
								v-model="formData194.effectiveEndTime"
								type="datetime"
								placeholder="开始日期"
							>
							</el-date-picker
						></el-radio>
					</div>
					<div>
						<el-radio
							v-model="formData194.dueStyle"
							@change="changeRadio(4)"
							label="SIGN"
							><span>签署时间</span>
							<span class="ml30">签署后</span>

							<el-input
								v-model.trim="formData194.expirationDay"
								:disabled="disabledInput"
								type="number"
								style="width: 80px; margin-left: 10px"
							></el-input
							>&nbsp;天失效
						</el-radio>
					</div>
				</template>
				<template #datetimerange>
					<el-date-picker
						v-model="formData194.templateStartTime"
						type="datetime"
						placeholder="开始时间"
					/>
					-
					<el-date-picker
						v-model="formData194.templateEndTime"
						type="datetime"
						placeholder="结束时间"
					/>
				</template>
			</yx-form>
		</Dialog>
		<Dialog
			title="选择商家发送合同"
			:visible.sync="sendContractLoding"
			:width="dialogWidth194"
			:bottomBtn="sendContractBottom"
		>
			<h4>合同模板：{{ sendContractRow.templateName }}</h4>
			<template v-if="sendContractRow.templateType != 'CONTRACT'">
				<span style="color: #ff4949; margin-right: 4px">*</span>
				选择收费方案：
				<el-radio class="mb20" v-model="supplierRow.chargeType" label="1"
					>方案一</el-radio
				>
				<el-radio v-model="supplierRow.chargeType" label="2">方案二</el-radio>
			</template>
			<div class="mb20">
				商家名称：
				<el-input
					class="wi"
					type="textarea"
					v-model="supplierRow.supplierNames"
					placeholder="请输入内容"
				></el-input>
				商家ID：
				<el-input
					class="wi"
					type="textarea"
					v-model="supplierRow.supplierIds"
					placeholder="请输入内容"
				></el-input>
				<el-button type="primary" class="ml30" @click="supplierInit(true)"
					>查询</el-button
				>
			</div>
			<el-button type="primary" class="mb20" @click="batchSend"
				>批量发送</el-button
			>
			<yx-table
				v-loading="loadingSupplier"
				:columns="tableColumnsSupplier"
				:pagination="pageSupplier"
				:data="tableDataSupplier"
				:select="true"
				:selectionChange="selectionChange"
			>
			</yx-table>
		</Dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import moment from 'moment'
import { debounce } from 'lodash'
import { imgCosServerPath } from '@/utils/imageTool'
import { listSupplierInfo } from '@/api/yhtPlusCmsSupplier'
import {
	listContractTemplate,
	createContractTemplate,
	enableTemplate,
	getContractTemplateDetail,
	supplierSendContract,
} from '@/api/signCenter'
import { uploadAttachmentList } from '@/api/invoice'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},
	name: 'FormTable',

	data() {
		return {
			supplierRow: {
				chargeType: '0',
				supplierNames: '',
				supplierIds: '',
			},

			// 附件
			uploadAttachmentList: uploadAttachmentList,
			fileList: [],
			tempFileUrlList: [],
			principalId: null,
			loading: false,
			dialogTitle194: '新增合同模板',
			dialogWidth194: '800px',
			dialogVisible194: false,
			disabledRadio: false,
			disabledPicker: false,
			disabledInput: false,
			formData194: {
				templateType: '', //模板类型（CONTRACT: 合同，OTHER: 其他）
				dueStyle: '', //到期样式 失效样式（ESTABLISHED :固定时间，SIGN :签署时间）
				effectiveStyle: '', //生效样式 生效样式（ESTABLISHED :固定时间，SIGN :签署时间）
				effectiveStartTime: '', //生效时间
				effectiveEndTime: '', //失效时间
				templateStartTime: '', //合同模板有效开始时间
				templateEndTime: '', //合同模板有效结束时间
				expirationDay: '', //失效天数
				templateUrl: '', //模板地址
				templateName: '', //模板文件名称
			},
			formCfg194: [
				{
					title: '附件',
					type: 'custom',
					dataIndex: 'accessory',
				},
				{
					type: 'select',
					title: '合同模板类型',
					dataIndex: 'templateType',
					label: 'value',
					placeholder: '请选择合同模板类型',
					options: [
						{
							value: '主合同',
							templateType: 'CONTRACT',
						},
						{
							value: '商家自主服务协议',
							templateType: 'SERVICEAGREEMENT',
						},
					],
				},
				{
					title: '合同生效时间',
					type: 'custom',
					dataIndex: 'effectiveStyle',
				},
				{
					title: '合同到期时间',
					type: 'custom',
					dataIndex: 'dueStyle',
				},
				{
					title: '合同模板有效时间',
					type: 'custom',
					dataIndex: 'datetimerange',
				},
			],
			rules194: {
				templateType: [
					{
						required: true,
						message: '请选择模板类型',
						trigger: ['blur', 'change'],
					},
				],
				accessory: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (this.tempFileUrlList.length == 0) {
								callback(new Error('请上传附件'))
							}
							callback()
						},
						trigger: ['blur', 'change'],
					},
				],
				effectiveStyle: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请选择生效类型'))
							}
							if (value == 'ESTABLISHED') {
								if (!this.formData194.effectiveStartTime) {
									callback(new Error('请选择生效时间'))
								} else if (
									moment(this.formData194.effectiveStartTime).valueOf() <
									moment(new Date()).valueOf()
								) {
									callback(new Error('生效时间不可小于当前时间'))
								}
							}
							callback()
						},
						trigger: ['blur', 'change'],
					},
				],
				dueStyle: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请选择失效类型'))
							}
							if (value == 'ESTABLISHED') {
								if (!this.formData194.effectiveEndTime) {
									callback(new Error('请选择失效时间'))
								} else if (
									moment(this.formData194.effectiveEndTime).valueOf() <
									moment(new Date()).valueOf()
								) {
									callback(new Error('失效时间不可小于当前时间'))
								}
							} else if (value == 'SIGN') {
								if (!this.formData194.expirationDay) {
									callback(new Error('请填写失效天数'))
								} else if (this.formData194.expirationDay == 0) {
									callback(new Error('失效天数不得为0'))
								}
							}
							callback()
						},
						trigger: ['blur', 'change'],
					},
				],
				datetimerange: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData194.templateStartTime) {
								callback(new Error(`开始时间不能为空`))
							} else if (!this.formData194.templateEndTime) {
								callback(new Error(`结束时间不能为空`))
							} else if (
								this.formData194.templateStartTime >
								this.formData194.templateEndTime
							) {
								callback(new Error(`开始时间不能大于结束时间`))
							} else if (
								moment(this.formData194.templateEndTime).valueOf() <
								moment(new Date()).valueOf()
							) {
								callback(new Error(`有效结束时间不可小于当前时间`))
							} else {
								callback()
							}
						},
					},
				],
			},
			sendContractLoding: false,
			dialogBottomBtn194: [
				{
					title: '取消',
					type: 'primary',
					click: () => {
						this.dialogVisible194 = false
						this.reset()
					},
				},
				{
					title: '确定',
					type: 'primary',
					click: debounce(
						() => {
							this.$refs.dialog194.$refs.YxForm.validate((valid) => {
								if (valid) {
									this._createTemplate()
								}
							})
						},
						300,
						{
							leading: true,
							trailing: false,
						}
					),
				},
			],
			templateList: [],
			// 选中的表格条目
			selectList: [],
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._listContractTemplate()
					},
				},
				{
					title: '新增合同模板',
					auth: 'createContractTemplate',
					type: 'primary',
					click: () => {
						this.dialogVisible194 = true
						this.reset()
					},
				},
			],
			formInline: {
				contractTemplateSn: '', // 合同模板编号
				contractTemplateName: '', // 合同模板名称
				templateStatus: '', // 合同模板状态
			},
			formCfg: [
				{
					title: '合同模板编号',
					label: 'value',
					type: 'input',
					dataIndex: 'contractTemplateSn',
					placeholder: '请输入合同模板编号',
				},
				{
					title: '合同模板名称',
					label: 'value',
					type: 'input',
					dataIndex: 'contractTemplateName',
					placeholder: '请输入合同模板名称',
				},
				{
					type: 'select',
					title: '合同模板状态',
					dataIndex: 'templateStatus',
					placeholder: '请选择合同模板状态',
					label: 'value',
					options: [
						{
							value: '全部',
							templateStatus: '',
						},
						{
							value: '未启用',
							templateStatus: 0,
						},
						{
							value: '已启用',
							templateStatus: 1,
						},
					],
				},
			],
			tableColumns: [
				// TODO: 等待后端接口提供后修改索引字段名称dataIndex
				{
					type: 'string',
					dataIndex: 'templateId',
					title: '合同模板编号',
				},
				{
					type: 'string',
					dataIndex: 'templateName',
					title: '合同模板名称',
				},
				{
					type: 'string',
					dataIndex: 'templateStatus',
					title: '合同模板状态',
					customRender: (row) => {
						return row.templateStatus == 1 ? '已启用' : '未启用'
					},
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '查看',
							auth: 'getContractTemplateDetail',
							click: (row) => {
								window.open(imgCosServerPath + row.templateUrl)
							},
						},
						{
							title: '编辑',
							auth: 'createContractTemplate',
							click: (row) => {
								this.reset()
								this.dialogVisible194 = true
								this.dialogTitle194 = '编辑合同模板'
								this.principalId = row.id
								this._getContractTemplateDetail(row)
								console.log('row', this.principalId)
							},
						},
						{
							title: '启用模板',
							auth: 'enableTemplate',
							popconfirm: true,
							popconfirmTitle: '',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								let enableNu = row.templateStatus == 0 ? 1 : 0
								this._enableTemplate(row.id, enableNu)
							},
							customRender: (action, row) => {
								action.title = row.templateStatus == 0 ? '启用模板' : '禁用模板'
								action.popconfirmTitle =
									row.templateStatus == 0 ? '确认启用？' : '确认禁用？'
								return action
							},
						},
						{
							title: '发送合同',
							auth: 'supplierSendContract',
							click: (row) => {
								this.supplierRow = {
									chargeType: '0',
									supplierNames: '',
									supplierIds: '',
								}
								this.sendContractRow = row
								this.supplierInit(true)
								this.sendContractLoding = true
							},
							customRender: (action, row) => {
								action.hide = row.templateStatus === 0
								return action
							},
						},
					],
				},
			],
			loadingSupplier: false,
			sendContractRow: {},
			selectedList: [],
			tableDataSupplier: [],
			tableColumnsSupplier: [
				{
					dataIndex: 'supplierId',
					title: '商家ID',
				},
				{
					dataIndex: 'supplierName',
					title: '商家名称',
				},
			],
			pageSupplier: {
				count: 0,
				currentPage: 1,
				length: 10,
				tableChange: () => {
					this.supplierInit()
				},
			},
			page: {
				count: 0,
				currentPage: 1,
				length: 10,
				tableChange: () => {
					this._listContractTemplate()
				},
			},
			sendContractBottom: [
				{
					title: '取消',
					type: 'primary',
					click: () => {
						this.sendContractLoding = false
					},
				},
			],
		}
	},
	computed: {
		uploadHead() {
			// 上传文件请求头
			return {
				'X-AUTH-TOKEN': this.getSessionKey,
			}
		},
	},
	created: function () {
		this.$nextTick(() => {
			this._listContractTemplate()
		})
	},
	methods: {
		selectionChange(list) {
			this.selectedList = list
		},
		async batchSend() {
			if (!this.selectedList.length) {
				return this.$message.warning('请选择商家')
			}
			if (
				this.supplierRow.chargeType === '0' &&
				this.sendContractRow.templateType != 'CONTRACT'
			) {
				return this.$message.warning('请选择收费方案')
			}
			let supplierIds = this.selectedList.map((item) => {
				return item.supplierId
			})
			// supplierRow
			const {
				data: { resultCode },
			} = await supplierSendContract({
				supplierIds: supplierIds,
				chargeType: this.supplierRow.chargeType,
				templateId: this.sendContractRow.templateId,
			})
			if (resultCode == 0) {
				this.sendContractLoding = false
				this._listContractTemplate()
				this.$message.success('成功，请在合同管理列表查询签署情况')
			}
		},
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.pageSupplier.currentPage = 1
			}
			const params = Object.assign(this.supplierRow, {
				length: this.pageSupplier.length,
				startIndex:
					(this.pageSupplier.currentPage - 1) * this.pageSupplier.length,
			})
			return params
		},
		// 获取商家列表
		async supplierInit(flag) {
			let paramJson = this.findSearchParams(flag)
			paramJson = JSON.parse(JSON.stringify(paramJson))
			if (paramJson.supplierIds) {
				paramJson.supplierIds = paramJson.supplierIds.replace(/\n/g, ',')
				paramJson.supplierIds = paramJson.supplierIds.replace(/\s*/g, '')
			}
			if (paramJson.supplierNames) {
				paramJson.supplierNames = paramJson.supplierNames.replace(/\n/g, ',')
				paramJson.supplierNames = paramJson.supplierNames.replace(/\s*/g, '')
			}

			if (paramJson.supplierIds && paramJson.supplierNames) {
				this.$message.warning('商家id和商家名称不能同时查询')
				return
			}
			this.loadingSupplier = true
			const {
				data: { resultCode, resultData },
			} = await listSupplierInfo(paramJson)
			this.loadingSupplier = false
			if (resultCode == 0 && resultData.respDTOS.length > 0) {
				this.tableDataSupplier = resultData.respDTOS
				this.pageSupplier.count = resultData.count
			} else {
				this.pageSupplier.count = 0
				this.tableDataSupplier = []
			}
		},
		//单选框
		changeRadio(e) {
			if (e == 1) {
				this.disabledRadio = false
			} else if (e == 2) {
				this.formData194.effectiveStartTime = ''
				this.disabledRadio = true
			} else if (e == 3) {
				this.formData194.expirationDay = ''
				this.disabledInput = true
				this.disabledPicker = false
			} else if (e == 4) {
				this.formData194.effectiveEndTime = ''
				this.disabledPicker = true
				this.disabledInput = false
			}
			console.log('111', e)
		},
		//编辑回显
		_getContractTemplateDetail: async function (row) {
			let {
				data: { resultCode, resultData },
			} = await getContractTemplateDetail({
				id: row.id,
			})
			if (resultCode == 0) {
				this.formData194 = resultData
				//回显时间初始默认值
				this.formData194.effectiveStartTime = this.formData194
					.effectiveStartTime
					? this.formData194.effectiveStartTime
					: ''
				this.formData194.effectiveEndTime = this.formData194.effectiveEndTime
					? this.formData194.effectiveEndTime
					: ''

				this.fileList.push({
					name: row.templateName,
				})
				this.tempFileUrlList.push({
					attachmentUrl: resultData.templateUrl,
					name: row.templateName,
				})
			}
		},
		//启用禁用
		_enableTemplate: async function (id, enableNu) {
			let paramJson = {
				id,
				enableNu,
			}
			let {
				data: { resultCode },
			} = await enableTemplate(paramJson)
			if (resultCode == 0) {
				this.$message.success('成功')
				this._listContractTemplate()
			}
		},
		handleExceed() {
			/** 文件超出回调 **/
			this.$message.warning({ message: '只能上传一个文件' })
		},
		onChange(file, fileList) {
			// 文件列表改变
			this.fileList = fileList
		},
		beforeRemove(file, fileList) {
			// 删除文件前
			// this.newFileList = fileList
			for (let i = 0; i < fileList.length; i++) {
				if (fileList[i].uid == file.uid) {
					this.tempFileUrlList.splice(i, 1)
					return
				}
			}
		},
		/** 自定义导入 */
		uploadImageHttpRequest: async function (params) {
			let formData = new FormData()
			formData.append('formId', '#accessoryForm')
			formData.append(
				'data',
				JSON.stringify({
					timeStamp: new Date().getTime(),
					groupId: 2,
					attachmentType: 4,
				})
			)
			formData.append('excel', params.file)
			if (params.file.size > 1024 * 2000) {
				this.$message.warning({ message: '上传的附件请不勿大于2M,请重新选择' })
				this.fileList = []
				this.tempFileUrlList = []
				return
			}
			if (params.file.name.length > 100) {
				this.$message.warning({ message: '上传的附件名称不得大于100字符' })
				this.fileList = []
				this.tempFileUrlList = []
				return
			}
			const {
				data: { resultCode, resultData },
			} = await uploadAttachmentList(formData, false)
			if (resultCode == 0) {
				this.$message.success('导入成功')
				resultData.attachmentList[0].name = params.file.name
				this.tempFileUrlList.push(...resultData.attachmentList)
			}
		},

		findSearchParams106(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const params = Object.assign(this.formInline, {
				length: this.page.length,
				startIndex: (this.page.currentPage - 1) * this.page.length,
			})
			return params
		},
		async _listContractTemplate(flag) {
			let params = this.findSearchParams106(flag)
			this.loading = true
			let res = await listContractTemplate(params).finally(() => {
				this.loading = false
			})
			const { resultCode, resultData } = res.data
			if (resultCode == 0) {
				this.templateList = resultData.list
				this.page.count = resultData.totalCount
			}
		},
		async _createTemplate() {
			const params = this.formData194
			params.effectiveStartTime = moment(params.effectiveStartTime).valueOf()
			params.effectiveEndTime = moment(params.effectiveEndTime).valueOf()
			params.templateStartTime = moment(params.templateStartTime).valueOf()
			params.templateEndTime = moment(params.templateEndTime).valueOf()
			params.templateUrl = this.tempFileUrlList[0].attachmentUrl
			params.templateName = this.tempFileUrlList[0].name
			if (this.principalId) {
				params.id = this.principalId
			}
			// return
			await createContractTemplate(params)
				.then((res) => {
					const { resultCode } = res.data
					if (resultCode == 0) {
						this.$message.success('成功')
						this.dialogVisible194 = false
						this.reset()
						this._listContractTemplate()
					}
				})
				.finally(() => {
					this.reset()
					this.dialogVisible194 = false
				})
		},
		reset() {
			this.$nextTick(() => {
				this.$refs.dialog194.$refs.YxForm.clearValidate()
			})
			this.disabledPicker = false
			this.disabledInput = false
			this.disabledRadio = false
			this.fileList = []
			this.tempFileUrlList = []
			this.principalId = null
			this.formData194 = {
				templateType: '', //模板类型（CONTRACT: 合同，OTHER: 其他）
				dueStyle: '', //到期样式 失效样式（ESTABLISHED :固定时间，SIGN :签署时间）
				effectiveStyle: '', //生效样式 生效样式（ESTABLISHED :固定时间，SIGN :签署时间）
				effectiveStartTime: '', //生效时间
				effectiveEndTime: '', //失效时间
				templateStartTime: '', //合同模板有效开始时间
				templateEndTime: '', //合同模板有效结束时间
				expirationDay: '', //失效天数
				templateUrl: '', //模板地址
				templateName: '', //模板文件名称
			}
		},
	},
}
</script>

<style>
.messageCenter_keyword_input {
	width: 260px;
}
.ml30 {
	margin-left: 30px;
}
.wi {
	width: 200px;
}
.mb20 {
	margin-bottom: 20px;
}
</style>

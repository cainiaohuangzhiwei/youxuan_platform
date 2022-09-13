<template>
	<basic-container>
		<div>
			<yx-form :inline="true" :data="formInline" :items="formCfg"> </yx-form>
			<yx-form
				:inline="false"
				:items="formTags"
				:formAction="formAction"
				:actionInline="true"
			>
				<template slot="channelList">
					<el-collapse>
						<el-collapse-item title="渠道" name="1">
							<el-checkbox-group
								v-model="formInline.channelList"
								@change="_getOrganizationListByCondition"
							>
								<el-checkbox
									v-for="(item, index) in $store.state.app.constant
										.SHOP_CHANNEL_LIST"
									:key="index"
									:label="item.channelList"
								></el-checkbox>
							</el-checkbox-group>
						</el-collapse-item>
						<el-collapse-item title="店主标签" name="2">
							<el-checkbox-group
								v-model="formInline.groupTagList"
								@change="_getOrganizationListByCondition"
							>
								<el-checkbox
									v-for="(item, index) in markingData.groupTagList"
									:key="index"
									:label="item.groupTagList"
									>{{ item.tagName }}</el-checkbox
								>
							</el-checkbox-group>
						</el-collapse-item>
						<el-collapse-item title="群标签" name="3">
							<el-checkbox-group
								v-model="formInline.crowdList"
								@change="_getOrganizationListByCondition"
							>
								<el-checkbox
									v-for="(item, index) in markingData.crowdList"
									:key="index"
									:label="item.crowdList"
									>{{ item.tagName }}</el-checkbox
								>
							</el-checkbox-group>
						</el-collapse-item>
						<el-collapse-item title="小C标签" name="4">
							<el-checkbox-group
								v-model="formInline.littleCList"
								@change="_getOrganizationListByCondition"
							>
								<el-checkbox
									v-for="(item, index) in markingData.littleCList"
									:key="index"
									:label="item.littleCList"
									>{{ item.tagName }}</el-checkbox
								>
							</el-checkbox-group>
						</el-collapse-item>
					</el-collapse>
				</template>
			</yx-form>
			<el-row>
				<yx-table
					:select="true"
					:columns="tableColumns"
					:pagination="page"
					:data="list"
					:actionInline="true"
					:selectionChange="selectionChange"
					v-loading="tableLoading"
				>
					<!-- 店铺名称 -->
					<template slot="organizationName" slot-scope="scope">
						<el-link
							type="primary"
							@click="organizationDetails(scope.row.organizationId)"
							>{{ scope.row.organizationName }}</el-link
						><br />
						<template v-for="(item, index) in scope.row.groupTagList">
							<el-tag
								v-if="item.type == 2 || item.type == 7 || item.type == 8"
								style="margin: 0 4px 4px 0"
								type="warning"
								:key="index"
								>{{ item.tagName }}{{ item.type }}</el-tag
							>
						</template>
					</template>
					<!-- 上级店主 -->
					<template slot="fatherName" slot-scope="scope">
						<el-link
							type="primary"
							@click="organizationDetails(scope.row.fatherId)"
							>{{ scope.row.fatherName }}</el-link
						>
					</template>
					<!-- Vip店主 -->
					<template slot="vipOrganizationName" slot-scope="scope">
						<el-link
							type="primary"
							@click="organizationDetails(scope.row.vipFatherId)"
							>{{ scope.row.vipOrganizationName }}</el-link
						>
					</template>
					<!-- 服务商 -->
					<template slot="serviceOrganizationName" slot-scope="scope">
						<el-link
							type="primary"
							@click="organizationDetails(scope.row.serviceFatherId)"
							>{{ scope.row.serviceOrganizationName }}</el-link
						>
					</template>
					<!-- 间接VIP -->
					<template slot="indirectVipOrganizationName" slot-scope="scope">
						<el-link
							type="primary"
							@click="organizationDetails(scope.row.indirectVipFatherId)"
							>{{ scope.row.indirectVipOrganizationName }}</el-link
						>
					</template>
					<!-- 间接服务商 -->
					<template slot="indirectServiceOrganizationName" slot-scope="scope">
						<el-link
							type="primary"
							@click="organizationDetails(scope.row.indirectServiceFatherId)"
							>{{ scope.row.indirectServiceOrganizationName }}</el-link
						>
					</template>
				</yx-table>
			</el-row>
		</div>
		<MarkingDialog
			:visible.sync="markingData.MarkingDialog"
			:row="markingData"
			:rows="selectionData"
			:title="dialogTitle"
			:multiple="markingData.multipleMaring"
			@refreshList="_getOrganizationListByCondition"
		/>
		<InviteCodeDialog
			:visible.sync="InviteCodeData.InviteCodeDialog"
			:title="dialogTitle"
			:row="DialogData"
			:rows="selectionData"
			:multiple="InviteCodeData.multipleInviteCode"
			@refreshList="_getOrganizationListByCondition"
		/>
		<EnableShopDialog
			:visible.sync="EnableShopData.EnableShopDialog"
			:row="DialogData"
			:title="dialogTitle"
			@refreshList="_getOrganizationListByCondition"
		/>
		<DisableShopDialog
			:visible.sync="EnableShopData.DisableShopDialog"
			:row="DialogData"
			:title="dialogTitle"
			@refreshList="_getOrganizationListByCondition"
		/>
		<DeleteOrganizationsDialog
			:visible.sync="DeleteOrganizationsDialog"
			:row="DialogData"
			@refreshList="_getOrganizationListByCondition"
		/>
		<MultipleEnableDialog
			:visible.sync="EnableShopData.MultipleEnableDialog"
			:row="selectionData"
			:type="EnableShopData.MultipleEnableType"
			@refreshList="_getOrganizationListByCondition"
		/>
		<SetLevelDialog
			:visible.sync="SetLevelDialog"
			:row="DialogData"
			@refreshList="_getOrganizationListByCondition"
		/>
		<SetDepartmentDialog
			:visible.sync="setDepartmentData.SetDepartmentDialog"
			:title="dialogTitle"
			:row="DialogData"
			:rows="selectionData"
			:departmentList="departmentList"
			:multiple="setDepartmentData.multipleSetDepartment"
			@refreshList="_getOrganizationListByCondition"
		/>
		<ImportDialog
			:visible.sync="ImportDialog"
			:title="dialogTitle"
			:importType="importType"
			@refreshList="_getOrganizationListByCondition"
		/>
		<Dialog
			:title="title184"
			:visible.sync="dialogVisible183"
			:width="dialogWidth183"
			:bottomBtn="dialogBottomBtn183"
		>
			<yx-form
				ref="yxForm184"
				labelWidth="120px"
				:inline="false"
				:rules="formRules184"
				:data="formData184"
				:items="formCfg184"
			>
				<template slot="area">
					<el-cascader
						class="el_cascader"
						ref="el_cascader"
						v-model="selectedArea"
						:options="addressOptions"
						:props="cascaderProps"
						@change="getArea"
					></el-cascader>
				</template>
			</yx-form>
		</Dialog>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import MarkingDialog from './components/MarkingDialog'
import InviteCodeDialog from './components/InviteCodeDialog'
import EnableShopDialog from './components/EnableShopDialog'
import DisableShopDialog from './components/DisableShopDialog'
import DeleteOrganizationsDialog from './components/DeleteOrganizationsDialog'
import MultipleEnableDialog from './components/MultipleEnableDialog'
import SetLevelDialog from './components/SetLevelDialog'
import SetDepartmentDialog from './components/SetDepartmentDialog'
import ImportDialog from './components/ImportDialog'
import Dialog from '@/components/Dialog'
import moment from 'moment'

import {
	getOrganizationTag,
	getOrganizationListByCondition,
	getDepartmentList,
	getOrganizationDetails,
} from '@/api/shopList'
import { uploadImageList } from '@/api/image'
import { getAreaList } from '@/api/area'
import { getBigImg } from '@/utils/imageTool'
import { getSensitiveWordFilteringList } from '@/api/systemConfiguration'
import {
	updateOrganizationByOrganizationId,
	addOrganization,
} from '@/api/yhtPlusCmsOrganization'
export default {
	components: {
		Dialog,
		BasicContainer,
		YxForm,
		YxTable,
		MarkingDialog,
		InviteCodeDialog,
		EnableShopDialog,
		DisableShopDialog,
		DeleteOrganizationsDialog,
		MultipleEnableDialog,
		SetLevelDialog,
		SetDepartmentDialog,
		ImportDialog,
	},
	name: 'FormTable',

	data() {
		return {
			title184: '编辑店铺',
			cascaderProps: {
				children: 'childAreaList',
				label: 'areaName',
				value: 'areaId',
			},
			selectedArea: [],
			addressOptions: [],
			formCfg184: [
				{
					title: '店铺名称',
					type: 'input',
					dataIndex: 'organizationName',
				},
				{
					title: '手机号码',
					type: 'input',
					dataIndex: 'phone',
				},
				{
					title: '用户姓名',
					type: 'input',
					dataIndex: 'legalPersonName',
				},
				{
					type: 'uploadImageDraggable',
					title: '店铺头像',
					dataIndex: 'imageList',
					uploadAttributes: {
						limit: 1,
						imageName: 'shopAvatar',
						httpRequest: (file) => this.uploadImageHttpRequest(file),
					},
				},
				{
					title: '所在地区',
					type: 'custom',
					dataIndex: 'area',
				},
				{
					title: '店铺简介',
					type: 'textarea',
					maxlength: 120,
					dataIndex: 'organizationRemark',
				},
			],
			formData184: {
				organizationName: '',
				phone: '',
				legalPersonName: '',
				imageList: [],
				organizationRemark: '',
			},
			formRules184: {
				organizationName: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入店铺名称'))
							} else if (this.sensitiveWordMap['小程序店铺名称']) {
								let flag = false
								this.sensitiveWordMap['小程序店铺名称'].map((item) => {
									if (value.indexOf(item) > -1) {
										callback(
											new Error(
												`【小程序店铺名称】内出现敏感词【${item}】，请修改后再保存`
											)
										)
										flag = true
										return false
									}
								})
								if (!flag) {
									callback()
								}
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				phone: [
					{
						required: true,
						message: '请输入手机号码',
						trigger: 'blur',
					},
				],
				legalPersonName: [
					{
						required: true,
						message: '请输入姓名',
						trigger: 'blur',
					},
				],
				area: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.selectedArea.length) {
								callback(new Error('请选择地区'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				imageList: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData184.imageList.length) {
								callback(new Error('请选择头像'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			dialogVisible183: false,
			dialogWidth183: '850px',
			dialogBottomBtn183: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.$refs.yxForm184.$refs.YxForm.validate((valid) => {
							if (valid) {
								if (this.isEdit) {
									this._updateOrganizationByOrganizationId()
								}
							}
						})
					},
				},
				{
					title: '旧系统',
					type: 'warning',
					click: () => {
						window.open(
							`/yhtplus/web/shopAdd.html?organizationId=${this.formData184.organizationId}&isEdit=true`
						)
					},
				},
			],
			dialogTitle: '',
			importType: '',
			tableLoading: false,
			DialogData: {},
			selectionData: [],
			//打标参数
			markingData: {
				multipleMaring: false,
				MarkingDialog: false,
				groupTagList: [],
				crowdList: [],
				littleCList: [],
			},
			//邀请码参数
			InviteCodeData: {
				InviteCodeDialog: false,
				multipleInviteCode: false,
			},
			//启用/禁用店铺参数
			EnableShopData: {
				EnableShopDialog: false,
				MultipleEnableType: '',
				MultipleEnableDialog: false,
				DisableShopDialog: false,
			},
			//注销店铺
			DeleteOrganizationsDialog: false,
			//设置等级
			SetLevelDialog: false,
			//设置部门
			setDepartmentData: {
				SetDepartmentDialog: false,
				multipleSetDepartment: false,
			},
			//导入Excel
			ImportDialog: false,
			departmentList: [],
			//表单数据
			formInline: {
				organizationId: '',
				status: '',
				organizationState: '',
				parentOrganizationName: '',
				organizationIdentity: '',
				phone: '',
				keyword: '',
				subordinateCount: '',
				levelType: '',
				startTime: '',
				endTime: '',
				fileName: '',
				clerkName: '',
				key: [],
				channelList: [],
				groupTagList: [],
				crowdList: [],
				littleCList: [],
				row: '',
				departmentId: '',
				lowerDepartmentId: '',
			},
			formCfg: [
				{
					title: '店主状态',
					type: 'select',
					dataIndex: 'organizationState',
					label: 'value',
					options: this.$store.state.app.constant.SHOP_STATUS,
					change: () => {
						this._getOrganizationListByCondition()
					},
				},
				{
					dataIndex: 'parentOrganizationName',
					// placeholder: '店铺上级/VIP店主/间接服务商/服务器',
					placeholder: '店主上级',
					enter: () => {
						this._getOrganizationListByCondition()
					},
				},
				{
					title: '店主身份',
					type: 'select',
					dataIndex: 'organizationIdentity',
					label: 'value',
					options: this.$store.state.app.constant.ORGANIZATION_IDENTITY,
					change: () => {
						this._getOrganizationListByCondition()
					},
				},
				{
					dataIndex: 'phone',
					placeholder: '手机号',
					enter: () => {
						this._getOrganizationListByCondition()
					},
				},
				{
					dataIndex: 'keyword',
					placeholder: '店铺名称',
					enter: () => {
						this._getOrganizationListByCondition()
					},
				},
				// {
				// 	title: '店铺等级',
				// 	type: 'select',
				// 	dataIndex: 'levelType',
				// 	label: 'value',
				// 	options: this.$store.state.app.constant.SHOP_LEVEL,
				// 	change: () => {
				// 		this._getOrganizationListByCondition()
				// 	},
				// },
				// {
				// 	title: '部门',
				// 	type: 'select',
				// 	dataIndex: 'departmentId',
				// 	placeholder: '一级部门',
				// 	label: 'departmentName',
				// 	change: this.departmentChange,
				// 	options: [],
				// },
				// {
				// 	type: 'select',
				// 	dataIndex: 'lowerDepartmentId',
				// 	label: 'departmentName',
				// 	placeholder: '二级部门',
				// 	options: [
				// 		{
				// 			lowerDepartmentId: '',
				// 			departmentName: '全部',
				// 		},
				// 	],
				// 	change: () => {
				// 		this._getOrganizationListByCondition()
				// 	},
				// },
				{
					title: '直接下级店主数大于等于',
					dataIndex: 'subordinateCount',
					placeholder: '数量',
					enter: () => {
						this._getOrganizationListByCondition()
					},
				},
				{
					title: '店主ID',
					dataIndex: 'organizationId',
					placeholder: '店主ID',
					enter: () => {
						this._getOrganizationListByCondition()
					},
				},
				{
					title: '添加时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
				},
			],
			formTags: [
				{
					type: 'custom',
					dataIndex: 'channelList',
				},
			],
			formAction: [
				{
					title: '批量设置维护部门',
					type: 'primary',
					auth: 'bindDepartmentId',
					click: () => {
						this.multipleSetDepartmentDialog()
					},
				},
				{
					title: '导入EXCEL（设置维护部门)',
					type: 'primary',
					auth: 'bindDepartmentId',
					click: () => {
						this.dialogTitle = '导入EXCEL（设置维护部门)'
						this.importType = 'importDepartment'
						this.ImportDialog = true
					},
				},
				{
					title: '导入Excel(邀请码)',
					type: 'primary',
					click: () => {
						this.dialogTitle = '导入Excel(邀请码)'
						this.importType = 'importInviteCode'
						this.ImportDialog = true
					},
				},
				{
					title: '导入Excel(打标) ',
					type: 'primary',
					auth: 'importAddOrganizationTagToOrganization',
					click: () => {
						this.dialogTitle = '导入Excel(打标)'
						this.importType = 'importMarking'
						this.ImportDialog = true
					},
				},
				{
					title: '批量生成邀请码',
					type: 'primary',
					click: () => {
						this.multipleInviteCodeDialog()
					},
				},
				{
					title: '批量启用',
					type: 'primary',
					auth: 'updateOrganizationByOrganizationId',
					click: () => {
						this.MultipleEnable('enable')
					},
				},
				{
					title: '批量禁用',
					type: 'primary',
					auth: 'updateOrganizationByOrganizationId',
					click: () => {
						this.MultipleEnable('disable')
					},
				},
				{
					title: '批量打标',
					type: 'primary',
					auth: 'addOrganizationTagToOrganization',
					click: () => {
						this.MultipleMarking()
					},
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getOrganizationListByCondition()
					},
				},
			],
			list: [],
			tableColumns: [
				{
					width: 70,
					dataIndex: 'userId',
					title: '用户ID',
				},
				{
					width: 70,
					dataIndex: 'organizationId',
					title: '店主ID',
				},
				{
					type: 'custom',
					dataIndex: 'organizationName',
					title: '店主名称',
					width: 150,
				},
				{
					width: 135,
					dataIndex: 'addTime',
					type: 'data',
					title: '添加时间',
				},
				{
					width: 105,
					dataIndex: 'phone',
					title: '手机号',
				},
				{
					dataIndex: 'channel',
					title: '渠道',
				},
				// {
				// 	width: 70,
				// 	dataIndex: 'levelType',
				// 	title: '等级',
				// 	customRender: (row) => {
				// 		if (row.levelType == 2) {
				// 			return 'VIP店主'
				// 		} else if (row.levelType == 1) {
				// 			return '服务商'
				// 		} else {
				// 			return '普通店主'
				// 		}
				// 	},
				// },
				{
					type: 'custom',
					dataIndex: 'fatherName',
					title: '上级店主',
				},
				// {
				// 	type: 'custom',
				// 	dataIndex: 'vipOrganizationName',
				// 	title: 'VIP店主',
				// },
				// {
				// 	type: 'custom',
				// 	dataIndex: 'serviceOrganizationName',
				// 	title: '服务商',
				// },
				// {
				// 	type: 'custom',
				// 	dataIndex: 'indirectVipOrganizationName',
				// 	title: '间接VIP',
				// },
				// {
				// 	width: 90,
				// 	type: 'custom',
				// 	dataIndex: 'indirectServiceOrganizationName',
				// 	title: '间接服务商',
				// },
				{
					width: 45,
					dataIndex: 'organizationState',
					title: '状态',
					customRender: (row) => {
						if (row.organizationState == 1) {
							return '正常'
						} else if (row.organizationState == 2) {
							return '禁用'
						} else {
							return '-'
						}
					},
				},
				// {
				// 	width: 100,
				// 	dataIndex: 'departmentName',
				// 	title: '店主维护部门',
				// },
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '打标',
							auth: 'addOrganizationTagToOrganization',
							click: (row) => {
								this.markingData.row = row
								this.markingData.MarkingDialog = true
								this.dialogTitle = '店铺快速打标'
								this.markingData.multipleMaring = false
							},
						},
						{
							title: '生成邀请码',
							auth: 'batchAddInviteCode',
							click: (row) => {
								this.dialogTitle = '生成邀请码'
								this.InviteCodeData.multipleInviteCode = false
								this.DialogData = row
								this.InviteCodeData.InviteCodeDialog = true
							},
							customRender: (action, row) => {
								action.hide = row.isBanding == 2
								return action
							},
						},
						{
							title: '详情',
							auth: 'getOrganizationDetails',
							click: (row) => {
								this.$router.push({
									path: `shop/shopDetail/${row.organizationId}`,
								})
							},
						},
						{
							title: '编辑',
							auth: 'updateOrganizationByOrganizationId',
							click: (row) => {
								this._getOrganizationDetails(row)
								// window.open(
								// 	`/yhtplus/web/shopAdd.html?organizationId=${row.organizationId}&isEdit=true`
								// )
							},
						},
						// {
						// 	title: '设置等级',
						// 	auth: 'updateOrganizationLevel',
						// 	click: (row) => {
						// 		this.DialogData = row
						// 		this.SetLevelDialog = true
						// 	},
						// },
						{
							title: '设置维护部门',
							auth: 'bindDepartmentId',
							click: (row) => {
								this.DialogData = row
								this.dialogTitle = '设置维护部门'
								this.setDepartmentData.multipleSetDepartment = false
								this.setDepartmentData.SetDepartmentDialog = true
							},
						},
						{
							title: '禁用/启用',
							auth: 'batchOperateOrganizationList',
							click: (row) => {
								this.AbleShopDialog = true
								if (row.organizationState == 1) {
									this.dialogTitle = '禁用店铺'
									this.EnableShopData.DisableShopDialog = true
								} else {
									this.dialogTitle = '启用店铺'
									this.EnableShopData.EnableShopDialog = true
								}
								this.DialogData = row
							},
							customRender: (action, row) => {
								action.hide = row.organizationState == 3
								return action
							},
						},
						{
							title: '注销',
							auth: 'deleteOrganizations',
							click: (row) => {
								let isLogout = row.phone.length == 12 && row.phone[11] == 1
								if (!isLogout) {
									this.dialogTitle = '注销'
									this.DeleteOrganizationsDialog = true
									this.DialogData = row
								}
							},
							customRender: (action, row) => {
								action.hide = row.organizationState == 3
								return action
							},
						},
					],
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getOrganizationListByCondition()
				},
			},
			parentList: [],
			sensitiveWordMap: {},
			isEdit: false,
		}
	},
	created() {
		this._getOrganizationTag()
		// this._getOrganizationListByCondition()
		this._getDepartmentList()
		// this._getAreaListByParentId(0)
		this._getSensitiveWordFilteringList()
	},
	methods: {
		async _addOrganization() {
			let paramJson = {
				organizationName: this.formData184.organizationName,
				phone: this.formData184.phone,
				legalPersonName: this.formData184.legalPersonName,
				areaId: this.selectedArea[this.selectedArea.length - 1],
				imageList: this.formData184.imageList,
				organizationRemark: this.formData184.organizationRemark,
				level: 0,
			}
			let {
				data: { resultCode },
			} = await addOrganization(paramJson)
			if (resultCode == 0) {
				this.dialogVisible183 = false
				this._getOrganizationListByCondition()
			}
		},
		async _updateOrganizationByOrganizationId() {
			let paramJson = {
				organizationName: this.formData184.organizationName,
				phone: this.formData184.phone,
				legalPersonName: this.formData184.legalPersonName,
				areaId: this.selectedArea[this.selectedArea.length - 1],
				imageList: this.formData184.imageList,
				organizationId: this.formData184.organizationId,
				organizationRemark: this.formData184.organizationRemark,
			}
			let {
				data: { resultCode },
			} = await updateOrganizationByOrganizationId(paramJson)
			if (resultCode == 0) {
				this.dialogVisible183 = false
				this.$message.success('成功')
				this._getOrganizationListByCondition()
			}
		},
		_getSensitiveWordFilteringList: async function () {
			let {
				data: { resultCode, resultData },
			} = await getSensitiveWordFilteringList()
			if (resultCode == 0) {
				resultData.list.map((item) => {
					if (item.filterWord) {
						this.sensitiveWordMap[item.detection] = item.filterWord.split(',')
					}
				})
			}
		},
		async _getAreaList() {
			return new Promise((resolve) => {
				getAreaList()
					.then(({ data: { resultCode, resultData } }) => {
						if (resultCode == 0 && resultData.areaTree.length) {
							this.addressOptions = [
								resultData.areaTree[0],
								resultData.areaTree[1],
							]
						}
						resolve()
					})
					.catch(() => {
						resolve()
					})
			})
		},
		async uploadImageHttpRequest(params) {
			//上传banner
			let formData = new FormData()
			formData.append('formId', '#portraitImageFrom')
			formData.append('data', JSON.stringify({ imageType: 22 }))
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			if (resultCode == 0) {
				resultData.imageList[0].shopAvatar = getBigImg(
					resultData.imageList[0].imageUrl
				)
				this.formData184.imageList = resultData.imageList
			}
			this.$forceUpdate()
		},
		shellArr(areaList, areaId) {
			if (areaList.length) {
				areaList.forEach((item) => {
					if (item.childAreaList && item.childAreaList.length) {
						if (item.childAreaList.some((row) => row.areaId === areaId)) {
							//这里利用some筛选子级有没有符合条件的，有就重新递归，没有就继续递归
							this.selectedArea.unshift(item.areaId)
							//重新递归
							this.shellArr(this.addressOptions, item.areaId)
						} else {
							//继续递归
							this.shellArr(item.childAreaList, areaId)
						}
					} else {
						return
					}
				})
			}
		},
		async _getOrganizationDetails(row) {
			this.isEdit = true
			this.title184 = '编辑店铺'
			let {
				data: { resultCode, resultData },
			} = await getOrganizationDetails({ organizationId: row.organizationId })
			if (resultCode == 0) {
				if (!this.addressOptions.length) {
					await this._getAreaList()
				}
				if (
					resultData.organization.areaId &&
					resultData.organization.areaId > 0
				) {
					this.shellArr(this.addressOptions, resultData.organization.areaId)
					this.selectedArea.push(resultData.organization.areaId)
				}
				if (resultData.imageList.length) {
					resultData.imageList[0].shopAvatar = getBigImg(
						resultData.imageList[0].imageUrl
					)
				}
				this.formData184 = Object.assign(this.formData184, {
					...resultData.organization,
					imageList: resultData.imageList,
				})
				this.dialogVisible183 = true
				this.$nextTick(() => {
					this.$refs.yxForm184.$refs.YxForm.clearValidate()
				})
			}
		},
		_getOrganizationTag: async function () {
			let res = await getOrganizationTag()
			res = res.data
			if (res.resultCode === 0) {
				let groupTagList = res.resultData.groupTagList.map((item) => {
					return {
						groupTagList: item.groupTagId,
						tagName: item.tagName,
					}
				})
				this.markingData.groupTagList = groupTagList
				let crowdList = res.resultData.crowdList.map((item) => {
					return {
						crowdList: item.groupTagId,
						tagName: item.tagName,
					}
				})
				this.markingData.crowdList = crowdList
				let littleCList = res.resultData.littleCList.map((item) => {
					return {
						littleCList: item.groupTagId,
						tagName: item.tagName,
					}
				})
				this.markingData.littleCList = littleCList
			}
		},
		findSearchParams(flag) {
			let paramJson = {
				keyword: this.formInline.keyword,
				phone: this.formInline.phone,
				parentOrganizationName: this.formInline.parentOrganizationName,
				organizationIdentity: this.formInline.organizationIdentity,
				organizationId: this.formInline.organizationId,
				organizationState: this.formInline.organizationState,
				levelType: this.formInline.levelType,
				channelList: this.formInline.channelList,
				subordinateCount: this.formInline.subordinateCount,
				departmentId: this.formInline.lowerDepartmentId
					? this.formInline.lowerDepartmentId
					: this.formInline.departmentId,
				groupsTagList: this.formInline.crowdList,
				organizationTagList: this.formInline.groupTagList,
				cTagList: this.formInline.littleCList,
				startTime: this.formInline.startTime
					? moment(this.formInline.startTime).valueOf()
					: '',
				endTime: this.formInline.endTime
					? moment(this.formInline.endTime).valueOf()
					: '',
			}
			console.log(paramJson)
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		//获取店铺列表
		async _getOrganizationListByCondition(flag) {
			let paramJson = this.findSearchParams(flag)
			this.tableLoading = true
			let res = await getOrganizationListByCondition(paramJson)
			this.tableLoading = false
			res = res.data
			if (res.resultCode === 0) {
				this.list = res.resultData.organizationList
				this.page.count = res.resultData.organizationCount
			}
		},
		//获取部门列表
		async _getDepartmentList() {
			let res = await getDepartmentList()
			res = res.data
			if (res.resultCode === 0) {
				this.departmentList = res.resultData.departmentTree
				this.formCfg.forEach((item) => {
					// 一级部门
					if (item.dataIndex === 'departmentId') {
						item.options = [
							{
								departmentId: '',
								departmentName: '全部',
							},
							...this.departmentList,
						]
					}
				})
			}
		},
		departmentChange(row) {
			// 二级部门联动
			let r = this.departmentList.find((ele) => ele.departmentId === row)
			let formCfg_lowerDepartment_item = this.formCfg.find((item) => {
				return item.dataIndex === 'lowerDepartmentId'
			})
			if (r && r.childDepartmentList) {
				if (formCfg_lowerDepartment_item) {
					formCfg_lowerDepartment_item.options = [
						{
							lowerDepartmentId: '',
							departmentName: '全部',
						},
						...r.childDepartmentList.map((item) => {
							return {
								lowerDepartmentId: item.departmentId,
								departmentName: item.departmentName,
							}
						}),
					]
				}
			} else {
				if (formCfg_lowerDepartment_item) {
					formCfg_lowerDepartment_item.options = [
						{
							lowerDepartmentId: '',
							departmentName: '全部',
						},
					]
				}
			}
			this._getOrganizationListByCondition()
		},
		organizationDetails(organizationId) {
			this.$router.push({
				path: `shop/shopDetail/${organizationId}`,
			})
		},
		// 多选
		selectionChange(row) {
			this.selectionData = row
		},
		//批量启用/禁用
		MultipleEnable(type) {
			if (this.selectionData.length === 0) {
				this.$message.error('请选择店铺')
				return
			}
			this.EnableShopData.MultipleEnableType = type
			this.EnableShopData.MultipleEnableDialog = true
		},
		//批量打标
		MultipleMarking() {
			if (this.selectionData.length === 0) {
				this.$message.error('请选择店铺')
				return
			}
			this.dialogTitle = '店铺批量打标'
			this.markingData.MarkingDialog = true
			this.markingData.multipleMaring = true
		},
		//批量设置维护部门
		multipleSetDepartmentDialog() {
			if (this.selectionData.length === 0) {
				this.$message.error('请选择店铺')
				return
			}
			this.dialogTitle = '批量设置维护部门'
			this.setDepartmentData.SetDepartmentDialog = true
			this.setDepartmentData.multipleSetDepartment = true
		},
		//批量生成邀请码
		multipleInviteCodeDialog() {
			if (this.selectionData.length === 0) {
				this.$message.error('请选择店铺')
				return
			}
			this.dialogTitle = '批量生成邀请码'
			this.InviteCodeData.InviteCodeDialog = true
			this.InviteCodeData.multipleInviteCode = true
		},
	},
}
</script>
<style lang="scss" scoped>
.el_cascader {
	width: 400px;
}
</style>

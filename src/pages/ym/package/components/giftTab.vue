<template>
	<div class="package">
		<basicContainer>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns101"
				:data="tableData101"
			></yx-table>
			<Dialog
				:title="dialogTitle104"
				:visible.sync="dialogVisible104"
				:width="dialogWidth104"
				:bottomBtn="dialogBottomBtn104"
			>
				<yx-form
					:inline="true"
					:data="formData105"
					:items="formCfg105"
					:formAction="formAction105"
				>
				</yx-form
				><yx-table
					:select="false"
					v-loading="loading106"
					:columns="tableColumns106"
					:pagination="page106"
					:data="tableData106"
				></yx-table>
			</Dialog>
			<Dialog
				:title="dialogTitle110"
				:visible.sync="dialogVisible110"
				:width="dialogWidth110"
				:bottomBtn="dialogBottomBtn110"
			>
				<yx-form
					ref="dialog111"
					labelWidth="120px"
					:data="formData111"
					:items="formCfg111"
					:formAction="formAction111"
					:rules="formRules111"
				>
					<template slot="giftId">
						<el-autocomplete
							placeholder="请选择选择礼包"
							v-model="formData111.giftName"
							:fetch-suggestions="querySearchAsync"
							@select="changeGiftId"
							class="input-with-select"
						>
							<el-button
								@click="openGiftDialog"
								slot="append"
								icon="el-icon-more"
							></el-button>
						</el-autocomplete>
					</template>
				</yx-form>
			</Dialog>
			<Dialog
				:title="dialogTitle125"
				:visible.sync="dialogVisible125"
				:width="dialogWidth125"
				:bottomBtn="dialogBottomBtn125"
			>
				<yx-form
					:inline="true"
					:data="formData126"
					:items="formCfg126"
					:formAction="formAction126"
				>
				</yx-form>
				<yx-table
					v-loading="loading127"
					:columns="tableColumns127"
					:pagination="page127"
					:data="tableData127"
				>
					<template slot="giftId" slot-scope="scope">
						<el-radio
							v-model="formData111.giftId"
							:label="scope.row.giftId"
							@change="changeGiftId(scope.row)"
							>选择
						</el-radio>
					</template>
				</yx-table>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import YxForm from '@wg-vue-materials/yx-form'
import {
	findGiftShareListByParam,
	findGiftShareRecord,
	findGiftListByParam,
	updateGiftShareState,
} from '@/api/gift'
import { exportGiftShareRecord } from '@/api/webImport'
import { downloadFile } from '@/utils/helper/common'

export default {
	components: {
		BasicContainer,
		YxTable,
		Dialog,
		YxForm,
	},
	props: [],
	data() {
		return {
			formData111: {
				state: 1,
				giftId: '',
				giftName: '',
			},
			formRules111: {
				giftId: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData111.giftId) {
								callback(new Error('请选择礼包'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
			},
			formCfg111: [
				{
					type: 'custom',
					title: '关联礼包',
					dataIndex: 'giftId',
				},
				{
					title: '状态',
					type: 'radio',
					dataIndex: 'state',
					label: 'value',
					options: [
						{
							value: '启用',
							state: 2,
						},
						{
							value: '禁用',
							state: 1,
						},
					],
				},
			],
			dialogTitle110: '新人礼包',
			dialogWidth110: '800px',
			dialogVisible110: false,
			dialogBottomBtn110: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog111.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.planSaveBtn()
							}
						})
					},
				},
			],
			dialogTitle125: '选择礼包',
			dialogWidth125: '800px',
			dialogVisible125: false,
			dialogBottomBtn125: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible125 = false
					},
				},
			],
			formData126: {
				giftName: '',
				addTimeStart: 1577808000000,
			},
			formCfg126: [
				{
					type: 'input',
					title: '筛选',
					dataIndex: 'giftName',
					placeholder: '礼包名称',
				},
			],
			formAction126: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						this._findGiftListByParam(true)
					},
				},
			],
			loading127: false,
			tableData127: [],
			tableColumns127: [
				{
					type: 'custom',
					dataIndex: 'giftId',
				},
				{
					type: 'string',
					dataIndex: 'giftName',
					title: '礼包',
				},
				{
					type: 'string',
					dataIndex: 'addUserName',
					title: '创建人',
				},
			],
			page127: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._findGiftListByParam()
				},
			},
			loading106: false,
			loading: false,
			tableData101: [],
			tableColumns101: [
				{
					type: 'string',
					dataIndex: 'giftShareName',
					title: '云货礼包名称',
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
				{
					type: 'string',
					dataIndex: 'giftName',
					title: '关联礼包',
				},
				{
					type: 'string',
					dataIndex: 'receiveCount',
					title: '已领取份数',
				},
				{
					type: 'string',
					dataIndex: 'state',
					title: '状态',
					customRender: ({ state }) => {
						let res = '未知'
						switch (state) {
							case 1:
								res = '禁用'
								break
							case 2:
								res = '启用'
								break
							case 3:
								res = '删除'
								break
						}
						return res
					},
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '编辑',
							auth: '',
							dialogId: '',
							click: (row) => {
								this.formData111 = JSON.parse(JSON.stringify(row))
								this.dialogVisible110 = true
							},
						},
						{
							title: '领取记录',
							auth: '',
							dialogId: 104,
							click: ({ giftShareId }) => {
								this.formData105.phone = ''
								this.tableData106 = []
								this._findGiftShareRecord(giftShareId)
								this.dialogVisible104 = true
							},
						},
					],
				},
			],
			page101: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData101()
				},
			},
			dialogTitle104: '领取记录',
			dialogWidth104: '800px',
			dialogVisible104: false,
			dialogBottomBtn104: [],
			formData105: {
				phone: '',
			},
			formCfg105: [
				{
					type: 'input',
					title: '',
					dataIndex: 'phone',
					placeholder: '请输入手机号',
				},
			],
			formAction105: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._findGiftShareRecord()
					},
				},
				{
					title: '导出',
					type: 'warning',
					auth: 'exportGiftShareRecord',
					click: () => {
						this.exportDataBtn()
					},
				},
			],
			tableData106: [],
			tableColumns106: [
				{
					type: 'string',
					dataIndex: 'organizationId',
					title: '店铺id',
				},
				{
					type: 'string',
					dataIndex: 'organizationName',
					title: '店铺名称',
				},
				{
					type: 'string',
					dataIndex: 'organizationPhone',
					title: '手机号',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '领取时间',
				},
			],
			page106: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData106()
				},
			},
		}
	},

	methods: {
		planSaveBtn: async function () {
			let paramJson = {
				giftShareId: this.formData111.giftShareId,
				giftName: this.formData111.giftName,
				state: this.formData111.state,
				giftId: this.formData111.giftId,
				channel: 2, // 云货礼包（app) 渠道为2
			}
			let {
				data: { resultCode },
			} = await updateGiftShareState(paramJson)
			if (resultCode == 0) {
				this.$message.success('成功')
				this.dialogVisible110 = false
				this.init()
			}
		},
		openGiftDialog() {
			this.formData126.giftName = ''
			this.dialogVisible125 = true
			this._findGiftListByParam(true)
		},
		changeGiftId(row) {
			let state = this.formData111.state
			this.formData111 = Object.assign(this.formData111, row)
			this.formData111.state = state
		},
		querySearchAsync: async function (queryString = '', cb) {
			let {
				data: { resultCode, resultData },
			} = await findGiftListByParam({
				giftName: queryString,
				startIndex: 0,
				addTimeStart: 1577808000000,
			})
			if (resultCode == 0) {
				resultData.giftList.map((item) => {
					item.value = item.giftName
				})
				cb(resultData.giftList)
			}
		},
		_findGiftListByParam: async function (flag) {
			this.loading127 = true
			let paramJson = this.findSearchParams127(flag)
			const {
				data: { resultCode, resultData },
			} = await findGiftListByParam(paramJson)
			if (resultCode == 0) {
				this.tableData127 = resultData.giftList
				this.page127.count = resultData.count
			} else {
				this.tableData127 = []
				this.page127.count = 0
			}
			this.loading127 = false
		},
		findSearchParams127(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page127.currentPage = 1
			}
			const paramJson = Object.assign(this.formData126, {
				length: this.page127.length,
				startIndex: (this.page127.currentPage - 1) * this.page127.length,
			})
			return paramJson
		},
		exportDataBtn: async function () {
			let { data } = await exportGiftShareRecord({
				giftShareId: this.giftShareId,
			})
			downloadFile(data, '礼包派发数据.xlsx')
		},
		_findGiftShareRecord: async function (giftShareId) {
			this.giftShareId = giftShareId
			this.loading106 = true
			let paramJson = {
				startIndex: 0,
				addTimeStart: 1577808000000,
				channel: 2,
				giftShareId,
			}
			paramJson.phone = this.formData105.phone
			const {
				data: { resultCode, resultData },
			} = await findGiftShareRecord(paramJson)
			if (resultCode == 0) {
				this.tableData106 = resultData.giftShareRecordList
			} else {
				this.tableData106 = []
			}
			this.loading106 = false
		},
		async init() {
			this.loading = true
			let paramJson = {
				channel: 2,
			}
			const {
				data: { resultCode, resultData },
			} = await findGiftShareListByParam(paramJson)
			if (resultCode == 0) {
				this.tableData101 = resultData.giftSharList
			} else {
				this.tableData101 = []
			}
			this.loading = false
		},
	},
}
</script>

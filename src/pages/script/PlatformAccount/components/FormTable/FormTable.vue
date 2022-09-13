<template>
	<basic-container>
		<div>
			<yx-form
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			></yx-form>
			<el-row>
				<yx-table
					:select="true"
					:columns="tableColumns"
					:selectionChange="selectionChange"
					:pagination="page"
					:data="list"
				></yx-table>
			</el-row>
		</div>
		<edit-platform-user-dialog
			:dialogVisible.sync="showDialog"
			:itemInfo.sync="editItem"
			@updateList="callExchangeGoodsList(true)"
		></edit-platform-user-dialog>
		<el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
			<span>确认删除账号？</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="showDialogVisible(false)">取 消</el-button>
				<el-button type="primary" @click="delEvents">确 定</el-button>
			</span>
		</el-dialog>
	</basic-container>
</template>

<script>
import { getPlatformUserList, deletePlatformUserById } from '@/api/platformUser'
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import editPlatformUserDialog from './editPlatformUserDialog'
import { getConstantValueByKey } from '@/utils/helper/common'
export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		editPlatformUserDialog,
	},
	name: 'FormTable',

	data() {
		return {
			dialogVisible: false, //删除账号dialog
			selectedItem: null,
			showDialog: false, //设备弹框dialog
			editItem: {},
			isAdd: false, //编辑||新增
			dialogTitle: '新增设备',
			equipmentCodeState: [],
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: this.onSubmit,
				},
				{
					title: '新增设备',
					type: 'primary',
					click: () => {
						this.steShowDialog(true)
					},
				},
			],
			formInline: {
				sourceType: 0,
				equipmentCode: '',
			},
			//查询
			formCfg: [
				{
					title: '设备号',
					type: 'select',
					label: 'value',
					dataIndex: 'equipmentCode',
					placeholder: '请选择',
					options: this.$store.state.app.constant.EQUIPMENTCODE_STATE,
				},
				{
					title: '渠道',
					type: 'select',
					label: 'value',
					dataIndex: 'sourceType',
					options: this.$store.state.app.constant.SOURCETYPE_STATE,
				},
			],
			// 详情数据
			list: [],
			tableColumns: [
				{
					type: 'string',
					dataIndex: 'sourceType',
					title: '渠道',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.SOURCETYPE_STATE,
							row.sourceType,
							'-',
							'sourceType'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'equipmentCode',
					title: '设备号',
					customRender: (row) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.EQUIPMENTCODE_STATE,
							row.equipmentCode,
							'-',
							'equipmentCode'
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'loginAccount',
					title: '登录账号',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					fixed: 'right',
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.steShowDialog(true, row)
							},
						},
						{
							title: '删除',
							click: (row) => {
								this.showDialogVisible(true, row)
							},
						},
					],
				},
			],
			page: {
				count: 0,
				currentPage: 1,
				length: 10,
				tableChange: () => {
					this.callExchangeGoodsList()
				},
			},
		}
	},

	created: function () {
		this.initPage()
	},
	methods: {
		onSubmit() {
			this.callExchangeGoodsList(true)
		},

		resetForm(formName) {
			this.$refs[formName].resetFields()
		},
		// 每页几条
		handleSizeChange(val) {
			this.pageLength = val
			this.callExchangeGoodsList()
		},
		// 当前页
		handleCurrentChange(val) {
			this.currentPage = val
			this.callExchangeGoodsList()
		},
		findSearchParams(flag) {
			/** 列表搜索参数 **/
			let paramJson = JSON.parse(JSON.stringify(this.formInline))
			paramJson = Object.assign(paramJson, {
				startIndex: 0,
				length: 1,
			})
			// 每页的加载数据长度
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		initPage: async function () {
			await this.callExchangeGoodsList()
		},
		callExchangeGoodsList: async function (flag) {
			const self = this
			let paramJson = self.findSearchParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getPlatformUserList(paramJson)
			if (resultCode === 0) {
				self.list = resultData.platformUserList
				this.page.count = resultData.count
			} else {
				this.page.count = 0
				this.list = []
			}
		},
		steShowDialog(flag, info) {
			if (info) {
				this.editItem = info
			} else {
				this.editItem = {}
			}
			this.showDialog = flag
		},
		isNull(arg1) {
			return !!(!arg1 && arg1 !== 0 && typeof arg1 !== 'boolean')
		},
		showDialogVisible(flag, info) {
			this.selectedItem = info || null
			this.dialogVisible = flag
		},
		delEvents: async function () {
			const self = this
			let {
				data: { resultCode, resultMsg },
			} = await deletePlatformUserById({
				platformUserId: self.selectedItem.id,
			})
			if (resultCode == 0) {
				this.showDialogVisible(false)
				this.callExchangeGoodsList(true)
			} else {
				self.$message({
					message: resultMsg,
					type: 'error',
				})
				this.showDialogVisible(false)
			}
		},
	},
}
</script>
